<?php
/**
 * Sourcing → Workers (owner, 24 Oct 2026): every workflow of the workers repository, its last run, counts,
 * problems and Run now. Schedules are changed in the workflows, never here; names, groups, descriptions and late limits
 * can be overridden, and Planned workers added (workers-meta.php; the Workers screen is the Kits shell's, sourceweb-ui.php).
 *
 * Data: each workflow reports its start and end (POST aw/v1/worker-run, the workers' application password) from
 * .github/actions/report in wugweb-git/sourceweb-workers. Nothing polls GitHub.
 * Alerts: a workflow with no report for its late limit (late_after_h), a run that failed, was cancelled or skipped its
 * main step, or a run with no end after its timeout; and UpdraftPlus's newest remote backup older than 36 hours or a
 * failed backup run (kits_backup_problem, Kits Core backups.php). Shown on the Workers screen, in the dashboard box "Scheduled tasks", in
 * Tools → Site Health, and emailed to the owner once per new set of problems (the ingestion watchdog's pattern).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/workers-registry.php';

const AW_WORKERS_KEEP = 20; // runs kept per workflow

/** Workflow file => array of runs (run_id => record), newest last. */
function sourceweb_workers_runs() {
	$all = array();
	foreach ( array_keys( AW_WORKERS ) as $file ) {
		$all[ $file ] = (array) get_option( sourceweb_workers_option( $file ), array() );
	}
	return $all;
}

/** One option per workflow (aw_worker_runs_sourcing_yml), so reports from different workflows never overwrite each other. */
function sourceweb_workers_option( $file ) {
	return 'aw_worker_runs_' . preg_replace( '/[^a-z0-9]+/', '_', strtolower( $file ) );
}

/** The newest run of a workflow (highest run id), or null. */
function sourceweb_workers_last( $file ) {
	$runs = (array) get_option( sourceweb_workers_option( $file ), array() );
	if ( ! $runs ) {
		return null;
	}
	krsort( $runs, SORT_NUMERIC );
	return reset( $runs );
}

/**
 * The values a cron field allows (*, n, a-b, a-b/n, *\/n, lists).
 *
 * @return int[]
 */
function sourceweb_workers_cron_field( $spec, $lo, $hi ) {
	$out = array();
	foreach ( explode( ',', $spec ) as $part ) {
		$bits = explode( '/', $part );
		$step = max( 1, (int) ( $bits[1] ?? 1 ) );
		if ( '*' === $bits[0] ) {
			list( $a, $b ) = array( $lo, $hi );
		} elseif ( false !== strpos( $bits[0], '-' ) ) {
			list( $a, $b ) = array_map( 'intval', explode( '-', $bits[0] ) );
		} else {
			$a = (int) $bits[0];
			$b = isset( $bits[1] ) ? $hi : $a;
		}
		for ( $i = $a; $i <= $b; $i += $step ) {
			$out[ $i ] = $i;
		}
	}
	ksort( $out );
	return array_values( $out );
}

/** Next time (Unix) any of the crons fires after $from, or 0. */
function sourceweb_workers_next( array $crons, $from ) {
	$best = 0;
	foreach ( $crons as $cron ) {
		list( $m, $h, $dom, $mon, $dow ) = preg_split( '/\s+/', trim( $cron ) );
		$mins                            = sourceweb_workers_cron_field( $m, 0, 59 );
		$hrs                             = sourceweb_workers_cron_field( $h, 0, 23 );
		$doms                            = sourceweb_workers_cron_field( $dom, 1, 31 );
		$mons                            = sourceweb_workers_cron_field( $mon, 1, 12 );
		$dows                            = array_map( fn( $d ) => $d % 7, sourceweb_workers_cron_field( $dow, 0, 7 ) );
		$day                             = (int) ( floor( $from / DAY_IN_SECONDS ) * DAY_IN_SECONDS );
		for ( $i = 0; $i < 62; $i++, $day += DAY_IN_SECONDS ) {
			$dok    = in_array( (int) gmdate( 'j', $day ), $doms, true );
			$wok    = in_array( (int) gmdate( 'w', $day ), $dows, true );
			$day_ok = ( '*' !== $dom && '*' !== $dow ) ? ( $dok || $wok ) : ( $dok && $wok ); // cron's own rule
			if ( ! $day_ok || ! in_array( (int) gmdate( 'n', $day ), $mons, true ) ) {
				continue;
			}
			foreach ( $hrs as $hh ) {
				foreach ( $mins as $mm ) {
					$t = $day + $hh * HOUR_IN_SECONDS + $mm * MINUTE_IN_SECONDS;
					if ( $t > $from ) {
						$best = $best ? min( $best, $t ) : $t;
						break 3;
					}
				}
			}
		}
	}
	return $best;
}

/** The schedule in India time, in words ("05:47, 08:17, … IST", "every 15 min", "Mondays 09:10 IST"). */
function sourceweb_workers_schedule( array $w ) {
	if ( ! empty( $w['after'] ) ) {
		return 'After "' . $w['after'] . '"' . ( 'tests.yml' === $w['file'] ? ' and every push' : '' );
	}
	if ( empty( $w['crons'] ) ) {
		return 'By hand';
	}
	$ist  = 330; // minutes, India is UTC+5:30
	$days = array();
	$mins = array();
	foreach ( $w['crons'] as $cron ) {
		list( $m, $h, $dom, , $dow ) = preg_split( '/\s+/', trim( $cron ) );
		foreach ( sourceweb_workers_cron_field( $h, 0, 23 ) as $hh ) {
			foreach ( sourceweb_workers_cron_field( $m, 0, 59 ) as $mm ) {
				$mins[] = ( $hh * 60 + $mm + $ist ) % 1440;
			}
		}
		$days[] = '*' !== $dow ? 'dow:' . $dow : ( '*' !== $dom ? 'dom:' . $dom : '' );
	}
	sort( $mins );
	if ( count( $mins ) > 8 ) {
		$n = (int) $w['interval_min'];
		return 'Every ' . ( 60 === $n ? 'hour' : ( $n > 60 && 0 === $n % 60 ? ( $n / 60 ) . ' h' : $n . ' min' ) );
	}
	$times = implode( ', ', array_map( fn( $x ) => sprintf( '%02d:%02d', intdiv( $x, 60 ), $x % 60 ), $mins ) ) . ' IST';
	$day   = (string) reset( $days );
	if ( 0 === strpos( $day, 'dow:' ) ) {
		$names = array( 'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays' );
		return implode( ', ', array_map( fn( $d ) => $names[ $d % 7 ], sourceweb_workers_cron_field( substr( $day, 4 ), 0, 7 ) ) ) . ' ' . $times;
	}
	if ( 0 === strpos( $day, 'dom:' ) ) {
		return 'Day ' . substr( $day, 4 ) . ' of the month, ' . $times;
	}
	return ( 1 === count( $mins ) ? 'Daily ' : '' ) . $times;
}

/** "4 min 20 s" / "1 h 05 min". */
function sourceweb_workers_duration( $s ) {
	$s = max( 0, (int) $s );
	return $s < 3600 ? ( $s >= 60 ? intdiv( $s, 60 ) . ' min ' : '' ) . ( $s % 60 ) . ' s' : sourceweb_cron_span( $s );
}

/** How many workflows have reported at least one run. Zero means "nothing to judge", not "all on time". */
function sourceweb_workers_reporting_count(): int {
	$n = 0;
	foreach ( array_keys( AW_WORKERS ) as $file ) {
		$n += sourceweb_workers_last( $file ) ? 1 : 0;
	}
	return $n;
}

/**
 * What is wrong with the workers now, as "file:kind" => sentence (empty when all is well). A workflow that has never
 * reported is not a problem (reports start when the workers' change is merged); use sourceweb_workers_reporting_count()
 * to tell "all on time" from "nothing has reported".
 *
 * @param int|null $now Unix time (tests).
 * @return array<string,string>
 */
function sourceweb_workers_problems( $now = null ) {
	static $memo = null; // one check per request (notice, dashboard box, table, Site Health)
	if ( null === $now && null !== $memo ) {
		return $memo;
	}
	$cache = null === $now;
	$now   = $now ? $now : time();
	$out   = array();
	foreach ( AW_WORKERS as $file => $w ) {
		$last = sourceweb_workers_last( $file );
		if ( ! $last ) {
			continue;
		}
		$w = sourceweb_worker_def( $file, $w ); // the owner's name and late limit (Planned workers are not here: they never alert)
		$seen = max( (int) ( $last['ended'] ?? 0 ), (int) ( $last['started'] ?? 0 ) );
		if ( ! empty( $w['late_after_h'] ) && $now - $seen > (int) $w['late_after_h'] * HOUR_IN_SECONDS ) {
			$out[ $file . ':late' ] = sprintf( '%s has not reported for %s (late after %d h; last: %s).', $w['name'], sourceweb_cron_span( $now - $seen ), (int) $w['late_after_h'], wp_date( 'j M, g:i a', $seen ) );
		}
		$result = (string) ( $last['result'] ?? '' );
		if ( 'running' === $result && $now - (int) $last['started'] > ( (int) $w['timeout_min'] + 10 ) * MINUTE_IN_SECONDS ) {
			$out[ $file . ':stuck' ] = sprintf( '%s started %s and has not reported its end (timeout %d min).', $w['name'], wp_date( 'j M, g:i a', (int) $last['started'] ), (int) $w['timeout_min'] );
		} elseif ( in_array( $result, array( 'failed', 'cancelled', 'skipped' ), true ) ) {
			$step = (string) ( $last['failed_step'] ?? '' );
			if ( 'tests.yml' === $file && 'failed' === $result ) {
				$msg = 'Tests failed (sourcing is not blocked; GitHub opened an issue).';
			} elseif ( 'skipped' === $result ) {
				$msg = sprintf( '%s skipped: step "%s" did not run.', $w['name'], $last['main_step'] ?? 'main' );
			} else {
				$msg = sprintf( '%s %s%s.', $w['name'], $result, $step ? ': step "' . $step . '"' : '' );
			}
			$out[ $file . ':' . $result ] = $msg . ' ' . wp_date( 'j M, g:i a', max( (int) ( $last['ended'] ?? 0 ), (int) $last['started'] ) );
		}
	}
	// Backups (animal-writes-core backups.php): UpdraftPlus's newest remote backup older than 36 hours, or a failed run.
	$backup = function_exists( 'kits_backup_problem' ) ? kits_backup_problem( $now ) : '';
	if ( '' !== $backup ) {
		$out['updraftplus:backup'] = $backup;
	}
	if ( $cache ) {
		$memo = $out;
	}
	return $out;
}

/**
 * Check the workers (hourly event, and after every end report): fires the action `sourceweb_workers_problems` with the
 * problems (an empty array when all is well). SourceWeb sends no email itself; a site that wants one hooks the action.
 */
function sourceweb_workers_watchdog() {
	update_option( 'aw_workers_watchdog_at', time(), true );
	$problems = sourceweb_workers_problems();
	/**
	 * The workers were checked.
	 *
	 * @param array<string,string> $problems Kind => sentence; empty when nothing is wrong.
	 */
	do_action( 'sourceweb_workers_problems', $problems );
}
add_action( 'aw_workers_watchdog', fn() => sourceweb_workers_watchdog() ); // the "report" argument only keeps the one-off event apart
// Like the ingestion watchdog: any request that reaches PHP also checks when the last check is an hour old, so a late
// worker is noticed even when scheduled tasks have stopped.
add_action(
	'shutdown',
	function () {
		if ( time() - (int) get_option( 'aw_workers_watchdog_at', 0 ) >= HOUR_IN_SECONDS && ! wp_installing() ) {
			sourceweb_workers_watchdog();
		}
	}
);
add_action(
	'init',
	function () {
		if ( ! wp_next_scheduled( 'aw_workers_watchdog' ) ) {
			wp_schedule_event( time() + 900, 'hourly', 'aw_workers_watchdog' );
		}
	}
);

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'aw/v1',
			'/worker-run',
			array(
				'methods'             => 'POST',
				// Only an application password (never a browser cookie), of the workers' own user or an administrator.
				'permission_callback' => fn() => did_action( 'application_password_did_authenticate' ) && ( current_user_can( 'aw_worker' ) || current_user_can( 'manage_options' ) ),
				'callback'            => function ( WP_REST_Request $req ) {
					$file = sanitize_file_name( (string) $req->get_param( 'workflow' ) );
					$run  = preg_replace( '/\D/', '', (string) $req->get_param( 'run_id' ) );
					// A Planned worker's new workflow may report before the registry has it: its runs are kept (no alerts).
					if ( ( ! isset( AW_WORKERS[ $file ] ) && ! ( preg_match( '/\.ya?ml$/', $file ) && sourceweb_worker_is_planned( sourceweb_worker_id( $file ) ) ) ) || '' === $run ) {
						return new WP_Error( 'aw_worker_unknown', 'Unknown workflow or run.', array( 'status' => 400 ) );
					}
					$now    = time();
					$phase  = 'start' === $req->get_param( 'phase' ) ? 'start' : 'end';
					$result = sanitize_key( (string) $req->get_param( 'result' ) );
					// Reports for the same workflow can overlap (a run's end and the next run's start): read-modify-write under
					// a MySQL lock, released at the end of the request at the latest.
					global $wpdb;
					$lock   = 'aw_worker_runs_' . md5( $file );
					if ( 1 !== (int) $wpdb->get_var( $wpdb->prepare( 'SELECT GET_LOCK(%s, 10)', $lock ) ) ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- a MySQL named lock, nothing to cache
						return new WP_Error( 'aw_worker_busy', 'Another report for this workflow is being saved; nothing was written.', array( 'status' => 503 ) );
					}
					wp_cache_delete( sourceweb_workers_option( $file ), 'options' );
					wp_cache_delete( 'notoptions', 'options' );
					$runs   = (array) get_option( sourceweb_workers_option( $file ), array() );
					$r      = (array) ( $runs[ $run ] ?? array() );
					$try    = max( 1, (int) $req->get_param( 'attempt' ) );
					if ( $try < (int) ( $r['attempt'] ?? 0 ) ) { // a late report from an attempt a re-run has replaced
						$wpdb->query( $wpdb->prepare( 'SELECT RELEASE_LOCK(%s)', $lock ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- releases the lock above
						return new WP_REST_Response( array( 'ok' => true, 'ignored' => 'older attempt' ) );
					}
					if ( 'start' === $phase && $try > (int) ( $r['attempt'] ?? 0 ) ) {
						// A re-run reuses the run id with the next attempt: it starts afresh.
						$r = array_diff_key( $r, array_flip( array( 'ended', 'result', 'failed_step', 'skipped_steps', 'counts', 'started' ) ) );
					}
					$counts = array();
					foreach ( array_slice( (array) $req->get_param( 'counts' ), 0, 20, true ) as $k => $v ) {
						if ( is_scalar( $v ) ) {
							$counts[ sanitize_key( str_replace( ' ', '_', (string) $k ) ) ] = is_bool( $v ) ? (int) $v : ( is_numeric( $v ) ? $v + 0 : mb_substr( sanitize_text_field( (string) $v ), 0, 40 ) );
						}
					}
					$started = (int) $req->get_param( 'started_at' );
					$r       = array_merge(
						$r,
						array(
							'run_id'  => $run,
							'attempt' => max( $try, (int) ( $r['attempt'] ?? 0 ) ),
							'event'   => sanitize_key( (string) $req->get_param( 'event' ) ),
							'sha'     => preg_replace( '/[^a-f0-9]/', '', strtolower( (string) $req->get_param( 'sha' ) ) ),
							'link'    => esc_url_raw( (string) $req->get_param( 'link' ) ),
							'dry_run' => (bool) $req->get_param( 'dry_run' ),
							'started' => $started > 0 && $started <= $now + 60 ? $started : (int) ( $r['started'] ?? $now ),
						)
					);
					if ( 'start' === $phase ) {
						$r['result'] = $r['result'] ?? 'running';
					} else {
						$r['ended']         = $now;
						$r['result']        = in_array( $result, array( 'success', 'failed', 'cancelled', 'skipped' ), true ) ? $result : 'failed';
						$r['failed_step']   = sanitize_key( (string) $req->get_param( 'failed_step' ) );
						$main               = sanitize_key( (string) $req->get_param( 'main_step' ) );
						$r['main_step']     = '' !== $main ? $main : 'main';
						$r['skipped_steps'] = array_map( 'sanitize_key', array_slice( array_filter( (array) $req->get_param( 'skipped_steps' ), 'is_scalar' ), 0, 10 ) );
						$r['counts']        = $counts;
					}
					$runs[ $run ] = $r;
					ksort( $runs, SORT_NUMERIC );
					update_option( sourceweb_workers_option( $file ), array_slice( $runs, -AW_WORKERS_KEEP, null, true ), false );
					$wpdb->query( $wpdb->prepare( 'SELECT RELEASE_LOCK(%s)', $lock ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- releases the lock above
					if ( 'end' === $phase && ! wp_next_scheduled( 'aw_workers_watchdog', array( 'report' ) ) ) {
						// Checked (and emailed) by the next scheduled-task tick, not inside the worker's request.
						wp_schedule_single_event( time(), 'aw_workers_watchdog', array( 'report' ) );
					}
					return new WP_REST_Response( array( 'ok' => true ) );
				},
			)
		);
	}
);

add_filter(
	'kits_sourcing_tabs',
	function ( $tabs ) {
		$tabs['workers'] = array( 'Workers' );
		return $tabs;
	}
);

/**
 * The GitHub token that starts a workflow: a fine-grained token for the workers repository only, with Actions read and
 * write, kept in wp-config.php (never in the database or a repository). SOURCEWEB_GITHUB_TOKEN; the names the site
 * already uses (KITS_GITHUB_DISPATCH_TOKEN, AW_GITHUB_DISPATCH_TOKEN) keep working.
 */
function sourceweb_dispatch_token(): string {
	foreach ( array( 'SOURCEWEB_GITHUB_TOKEN', 'KITS_GITHUB_DISPATCH_TOKEN', 'AW_GITHUB_DISPATCH_TOKEN' ) as $name ) {
		if ( defined( $name ) && '' !== trim( (string) constant( $name ) ) ) {
			return trim( (string) constant( $name ) );
		}
	}
	return '';
}

/**
 * The workers repository ("owner/name"): the filter `sourceweb_workers_repo`, then the constant SOURCEWEB_WORKERS_REPO, then
 * Kits Core's filter `kits_dispatch_repo`. '' when none is set or the value is not a repository name.
 */
function sourceweb_dispatch_repo(): string {
	$repo = trim( (string) apply_filters( 'sourceweb_workers_repo', defined( 'SOURCEWEB_WORKERS_REPO' ) ? (string) SOURCEWEB_WORKERS_REPO : '' ), '/ ' );
	if ( '' === $repo ) {
		$repo = trim( (string) apply_filters( 'kits_dispatch_repo', '' ), '/ ' );
	}
	return preg_match( '#^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$#', $repo ) ? $repo : '';
}

/** Whether Run now can start a workflow from this site: a token and a repository are set. */
function sourceweb_dispatch_ready(): bool {
	return '' !== sourceweb_dispatch_token() && '' !== sourceweb_dispatch_repo();
}

/**
 * Start a workflow in the workers repository now (GitHub's workflow_dispatch, on the main branch). The workflow's own
 * schedule stays as it is, and its concurrency group keeps runs from overlapping.
 *
 * @param string $file   Workflow file, e.g. sourcing.yml.
 * @param array  $inputs workflow_dispatch inputs (strings).
 * @return true|WP_Error
 */
function sourceweb_dispatch_workflow( $file, $inputs = array() ) {
	$file  = sanitize_file_name( (string) $file );
	$token = sourceweb_dispatch_token();
	$repo  = sourceweb_dispatch_repo();
	if ( '' === $token ) {
		return new WP_Error( 'sourceweb_dispatch_token', __( 'No GitHub token is set. Add SOURCEWEB_GITHUB_TOKEN to wp-config.php.', 'sourceweb' ) );
	}
	if ( '' === $repo ) {
		return new WP_Error( 'sourceweb_dispatch_repo', __( 'No workers repository is set. Add SOURCEWEB_WORKERS_REPO (owner/name) to wp-config.php.', 'sourceweb' ) );
	}
	if ( ! preg_match( '/^[A-Za-z0-9_.-]+\.ya?ml$/', $file ) ) {
		return new WP_Error( 'sourceweb_dispatch_file', __( 'That is not a workflow file name.', 'sourceweb' ) );
	}
	$resp = wp_remote_post(
		'https://api.github.com/repos/' . $repo . '/actions/workflows/' . rawurlencode( $file ) . '/dispatches',
		array(
			'timeout'     => 20,
			'redirection' => 0, // a renamed repository answers 301; say so rather than follow it with a changed request
			'headers'     => array(
				'Authorization'        => 'Bearer ' . $token,
				'Accept'               => 'application/vnd.github+json',
				'X-GitHub-Api-Version' => '2022-11-28',
				'User-Agent'           => (string) wp_parse_url( home_url(), PHP_URL_HOST ),
				'Content-Type'         => 'application/json',
			),
			'body'        => wp_json_encode(
				array(
					'ref'    => 'main',
					'inputs' => (object) array_map( 'strval', (array) $inputs ),
				)
			),
		)
	);
	if ( is_wp_error( $resp ) ) {
		return new WP_Error( 'sourceweb_dispatch_failed', $resp->get_error_message() );
	}
	$code = (int) wp_remote_retrieve_response_code( $resp );
	if ( 204 === $code ) {
		return true;
	}
	if ( in_array( $code, array( 301, 302, 307, 308 ), true ) ) {
		return new WP_Error( 'sourceweb_dispatch_moved', __( 'GitHub says the workers repository has moved. Set SOURCEWEB_WORKERS_REPO to its new name.', 'sourceweb' ) );
	}
	if ( 401 === $code || 403 === $code ) {
		return new WP_Error( 'sourceweb_dispatch_denied', __( 'GitHub refused the token. It needs Actions read and write on the workers repository.', 'sourceweb' ) );
	}
	if ( 404 === $code ) {
		return new WP_Error( 'sourceweb_dispatch_missing', __( 'GitHub could not find that repository or workflow, or the token cannot see it.', 'sourceweb' ) );
	}
	/* translators: %d: HTTP status. */
	return new WP_Error( 'sourceweb_dispatch_failed', sprintf( __( 'GitHub answered HTTP %d.', 'sourceweb' ), $code ) );
}

/**
 * Run now: start a workflow on GitHub and note it in the Run now log (aw_worker_dispatch_log) and the change log.
 *
 * @param string $file Workflow file.
 * @return true|WP_Error
 */
function sourceweb_workers_run_now( $file ) {
	$res = function_exists( 'kits_dispatch_workflow' ) && ! sourceweb_dispatch_ready() // Kits Core's connection, when this plugin has none of its own
		? kits_dispatch_workflow( $file, (array) ( AW_WORKERS[ $file ]['runnow'] ?? array() ) )
		: sourceweb_dispatch_workflow( $file, (array) ( AW_WORKERS[ $file ]['runnow'] ?? array() ) );
	$log = (array) get_option( 'aw_worker_dispatch_log', array() );
	array_unshift(
		$log,
		array(
			'at'   => time(),
			'user' => wp_get_current_user()->user_login,
			'file' => $file,
			'ok'   => true === $res,
			'msg'  => true === $res ? 'started' : $res->get_error_message(),
		)
	);
	update_option( 'aw_worker_dispatch_log', array_slice( $log, 0, 50 ), false );
	sourceweb_src_log( 'workers', 'Run now: ' . $file . ( true === $res ? '' : ' (not started: ' . $res->get_error_message() . ')' ) );
	return $res;
}

// Notice on the dashboard and Sourcing.
add_action(
	'admin_notices',
	function () {
		$screen = get_current_screen();
		if ( ! current_user_can( 'manage_options' ) || ! $screen || ! in_array( $screen->id, array( 'dashboard', AW_SRC_SCREEN ), true ) ) {
			return;
		}
		$problems = sourceweb_workers_problems();
		if ( $problems ) {
			wp_admin_notice( '<strong>Workers need attention.</strong> ' . esc_html( implode( ' ', $problems ) ) . ' <a href="' . esc_url( admin_url( 'admin.php?page=aw-sourcing&tab=workers' ) ) . '">Workers</a>', array( 'type' => 'error', 'dismissible' => true ) );
		}
	}
);

// The dashboard box "Scheduled tasks" (cron-health.php) lists the workflows with a problem.
add_action(
	'wp_dashboard_setup',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		add_action(
			'aw_cron_health_after',
			function () {
				$problems = sourceweb_workers_problems();
				$url      = admin_url( 'admin.php?page=aw-sourcing&tab=workers' );
				if ( ! $problems && 0 === sourceweb_workers_reporting_count() ) {
					echo '<p><span class="dashicons dashicons-clock" aria-hidden="true"></span> Workers: no report yet. <a href="' . esc_url( $url ) . '">Workers</a></p>';
					return;
				}
				if ( ! $problems ) {
					echo '<p><span class="dashicons dashicons-yes-alt" aria-hidden="true"></span> Workers: no problems. <a href="' . esc_url( $url ) . '">Workers</a></p>';
					return;
				}
				foreach ( $problems as $msg ) {
					wp_admin_notice( '<span class="dashicons dashicons-dismiss" aria-hidden="true"></span> ' . esc_html( $msg ), array( 'type' => 'error', 'additional_classes' => array( 'inline', 'notice-alt' ) ) );
				}
				echo '<p><a href="' . esc_url( $url ) . '">Workers</a></p>';
			}
		);
	}
);

// Tools → Site Health: "Workers report on time".
add_filter(
	'site_status_tests',
	function ( $tests ) {
		$tests['direct']['aw_workers'] = array(
			'label' => 'Workers report on time',
			'test'  => function () {
				$problems = sourceweb_workers_problems();
				$waiting  = ! $problems && 0 === sourceweb_workers_reporting_count();
				return array(
					'label'       => $problems ? 'Workers need attention' : ( $waiting ? 'No worker has reported yet' : 'Workers report on time' ),
					'status'      => $problems ? 'critical' : ( $waiting ? 'recommended' : 'good' ),
					'badge'       => array(
						'label' => 'SourceWeb',
						'color' => $problems ? 'red' : 'blue',
					),
					'description' => '<p>' . ( $problems ? esc_html( implode( ' ', $problems ) ) : ( $waiting ? 'No workflow of the workers repository has reported a run yet, so nothing can be judged on time or late.' : 'Every workflow of the workers repository that has reported is on time and its last run went through.' ) ) . '</p>',
					'actions'     => '<p><a href="' . esc_url( admin_url( 'admin.php?page=aw-sourcing&tab=workers' ) ) . '">Plugins → SourceWeb → Workers</a></p>',
					'test'        => 'aw_workers',
				);
			},
		);
		return $tests;
	}
);
