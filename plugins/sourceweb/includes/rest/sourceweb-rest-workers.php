<?php
/**
 * SourceWeb's Workers routes' callbacks (split from sourceweb-rest-pages.php, which registers the routes and lists them).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A link into the workers' GitHub repository, or '' when the site names none. The repository ("owner/name") comes from
 * the filter `sourceweb_workers_repo`; there is no default.
 *
 * @param string $path Path inside the repository, starting with a slash.
 */
function sourceweb_workers_repo_url( string $path ): string {
	$repo = sourceweb_dispatch_repo();
	return '' === $repo ? '' : 'https://github.com/' . $repo . $path;
}

/* ---------- Workers ---------- */

/** Worker status => label. */
const SOURCEWEB_WORKER_STATUS = array(
	'active'  => 'Active',
	'waiting' => 'Waiting for first report',
	'late'    => 'Late',
	'failing' => 'Failing',
	'planned' => 'Planned',
);

/**
 * A reported run as plain text: result and its tone, the failed step, when, how long, the counts.
 *
 * @param array|null $l A run from sourceweb_workers_last() or the runs option.
 * @return array|null { result, label, tone, when, took, counts }.
 */
function sourceweb_worker_run_text( $l ) {
	if ( ! $l ) {
		return null;
	}
	$map  = array(
		'success'   => array( 'success', 'Success' ),
		'running'   => array( 'info', 'Running' ),
		'failed'    => array( 'error', 'Failed' ),
		'cancelled' => array( 'error', 'Cancelled' ),
		'skipped'   => array( 'warn', 'Skipped' ),
	);
	$res  = (string) ( $l['result'] ?? '' );
	$m    = $map[ $res ] ?? $map['failed'];
	$step = '';
	if ( ! empty( $l['failed_step'] ) ) {
		$step = ': step "' . $l['failed_step'] . '"';
	} elseif ( 'skipped' === $res ) {
		$step = ': step "' . ( $l['main_step'] ?? 'main' ) . '" did not run';
	}
	$counts = (array) ( $l['counts'] ?? array() );
	return array(
		'result' => $res,
		'label'  => $m[1] . $step . ( ! empty( $l['dry_run'] ) ? ' (dry run)' : '' ),
		'tone'   => $m[0],
		'when'   => ! empty( $l['started'] ) ? wp_date( 'j M Y, g:i a', (int) $l['started'] ) : '',
		'took'   => ! empty( $l['ended'] ) && ! empty( $l['started'] ) && $l['ended'] >= $l['started'] ? sourceweb_workers_duration( $l['ended'] - $l['started'] ) : '',
		'counts' => implode( ', ', array_map( fn( $k, $v ) => str_replace( '_', ' ', (string) $k ) . ': ' . $v, array_keys( $counts ), $counts ) ),
	);
}

/**
 * One row of the Workers list.
 *
 * @param array $r A row from sourceweb_workers_status_rows().
 */
function sourceweb_worker_row( array $r ): array {
	$groups      = sourceweb_worker_group_defs();
	list( $own, $all ) = $r['keys'];
	if ( ! $own ) {
		$keys = 'All keys';
	} else {
		/* translators: %d: number of keys. */
		$keys = sprintf( _n( '%d key attached', '%d keys attached', $own, 'sourceweb' ), $own ) . ( $all ? ' (+ ' . $all . ' for all workers)' : '' );
	}
	$note = '';
	if ( 'planned' === $r['status'] ) {
		$note = 'Not built yet';
	} elseif ( 'active' === $r['status'] && $r['planned'] ) {
		$note = 'Reported, not in the registry yet';
	}
	return array(
		'id'          => $r['id'],
		'title'       => $r['name'],
		'what'        => $r['what'],
		'group'       => $r['group'],
		'groupLabel'  => (string) ( $groups[ $r['group'] ][0] ?? $r['group'] ),
		'file'        => $r['file'],
		'fileUrl'     => $r['planned'] ? '' : sourceweb_workers_repo_url( '/blob/main/.github/workflows/' . rawurlencode( $r['file'] ) ),
		'planned'     => (bool) $r['planned'],
		'schedule'    => $r['planned'] ? ( '' !== $r['schedule'] ? 'Wanted: ' . $r['schedule'] : '' ) : sourceweb_workers_schedule( $r['registry'] + array( 'file' => $r['file'] ) ),
		'late'        => $r['planned'] ? '' : sourceweb_workers_late_words( $r ),
		'last'        => sourceweb_worker_run_text( $r['last'] ),
		'lastAt'      => (int) ( $r['last']['started'] ?? 0 ),
		'status'      => $r['status'],
		'statusLabel' => SOURCEWEB_WORKER_STATUS[ $r['status'] ],
		'statusNote'  => $note,
		'problem'     => in_array( $r['status'], array( 'late', 'failing' ), true ) ? $r['note'] : '',
		'keys'        => $keys,
		'canRun'      => sourceweb_workers_can_run( $r ),
	);
}

/** The groups for the worker form: [ { value, label } ]. */
function sourceweb_worker_groups(): array {
	$out = array();
	foreach ( sourceweb_worker_group_defs() as $slug => $g ) {
		$out[] = array(
			'value' => (string) $slug,
			'label' => (string) $g[0],
		);
	}
	return $out;
}

/**
 * GET workers: one page of the list, as on today's Workers tab (views by group, Late, Failing, Planned), and the Run
 * now log.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_workers( WP_REST_Request $request ) {
	$rows  = array_map( 'sourceweb_worker_row', sourceweb_workers_status_rows() );
	// Late and failing first, then the registry's order, Planned last (as today's list).
	$first = array_values( array_filter( $rows, fn( $r ) => in_array( $r['status'], array( 'late', 'failing' ), true ) ) );
	$rest  = array_values( array_filter( $rows, fn( $r ) => ! in_array( $r['status'], array( 'late', 'failing' ), true ) ) );
	$views = array();
	foreach ( sourceweb_worker_group_defs() as $slug => $g ) {
		$views[ 'group-' . $slug ] = array( $g[0], fn( $r ) => $r['group'] === $slug );
	}
	$views['late']    = array( 'Late', fn( $r ) => 'late' === $r['status'] );
	$views['failing'] = array( 'Failing', fn( $r ) => 'failing' === $r['status'] );
	$views['planned'] = array( 'Planned', fn( $r ) => $r['planned'] );
	$order            = array_flip( array_keys( SOURCEWEB_WORKER_STATUS ) );
	$out              = sourceweb_list(
		array_merge( $first, $rest ),
		$request->get_params(),
		array(
			'views' => $views,
			'text'  => fn( $r ) => $r['id'] . ' ' . $r['title'] . ' ' . $r['what'] . ' ' . $r['file'] . ' ' . $r['groupLabel'],
			'sort'  => array(
				'title'    => fn( $r ) => strtolower( $r['title'] ),
				'group'    => fn( $r ) => strtolower( $r['groupLabel'] . ' ' . $r['title'] ),
				'last_run' => fn( $r ) => $r['lastAt'],
				'status'   => fn( $r ) => $order[ $r['status'] ],
			),
			'per'   => 50,
		)
	);
	$log = array();
	foreach ( (array) get_option( 'aw_worker_dispatch_log', array() ) as $e ) {
		$w     = sourceweb_worker( sourceweb_worker_id( (string) ( $e['file'] ?? '' ) ) );
		$log[] = array(
			wp_date( 'j M Y, g:i a', (int) ( $e['at'] ?? 0 ) ),
			(string) ( $e['user'] ?? '' ),
			$w ? $w['name'] : (string) ( $e['file'] ?? '' ),
			! empty( $e['ok'] ) ? 'started' : (string) ( $e['msg'] ?? '' ),
		);
	}
	$out['log']    = $log;
	$out['runOff'] = ! sourceweb_dispatch_ready() && ! ( function_exists( 'kits_dispatch_workflow' ) && '' !== sourceweb_dispatch_token() );
	return rest_ensure_response( $out );
}

/**
 * GET workers/<id>: one worker for its form, or a blank Planned worker for 'new'. The keys come as id, last 4
 * characters and provider only.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_worker( WP_REST_Request $request ) {
	$id  = sanitize_key( (string) $request['id'] );
	$new = 'new' === $id;
	$w   = $new ? null : sourceweb_worker( $id );
	if ( ! $new && ! $w ) {
		return new WP_Error( 'sourceweb_no_worker', __( 'No such worker.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$keys = array();
	foreach ( sourceweb_ai_rows() as $r ) {
		$ws     = sourceweb_ai_row_workers( $r );
		$keys[] = array(
			'id'    => sourceweb_ai_key_id( (string) $r['key'] ),
			'short' => sourceweb_ai_key_short( $r ),
			'scope' => $ws ? sprintf( /* translators: %d: number of workers. */ _n( 'for %d worker', 'for %d workers', count( $ws ), 'sourceweb' ), count( $ws ) ) : __( 'all workers', 'sourceweb' ),
			'on'    => ! $ws || ( ! $new && in_array( $id, $ws, true ) ),
		);
	}
	$reg = $w && $w['registry'] ? $w['registry'] : null;
	return rest_ensure_response(
		array(
			'id'       => $new ? 'new' : $w['id'],
			'new'      => $new,
			'planned'  => $new || $w['planned'],
			'name'     => $w ? $w['name'] : '',
			'what'     => $w ? $w['what'] : '',
			'group'    => $w ? $w['group'] : 'one-off',
			'late'     => $w && null !== $w['late_after_h'] && '' !== $w['late_after_h'] ? (string) (int) $w['late_after_h'] : '',
			'schedule' => $w ? $w['schedule'] : '',
			'registry' => $reg ? array(
				'name'     => (string) $reg['name'],
				'late'     => null === $reg['late_after_h'] ? 'never' : $reg['late_after_h'] . ' h',
				'schedule' => sourceweb_workers_schedule( $reg + array( 'file' => $w['file'] ) ),
				'file'     => $w['file'],
				'fileUrl'  => sourceweb_workers_repo_url( '/blob/main/.github/workflows/' . rawurlencode( $w['file'] ) ),
			) : null,
			'groups'   => sourceweb_worker_groups(),
			'keys'     => $keys,
			'addKey'   => sourceweb_ai_keys_url( array( 'edit' => 'new' ) ),
		)
	);
}

/**
 * GET workers/<id>/runs: the runs the workflow reported, newest first.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_worker_runs( WP_REST_Request $request ) {
	$w = sourceweb_worker( (string) $request['id'] );
	if ( ! $w ) {
		return new WP_Error( 'sourceweb_no_worker', __( 'No such worker.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$runs = (array) get_option( sourceweb_workers_option( $w['file'] ), array() );
	krsort( $runs, SORT_NUMERIC );
	$ev   = array(
		'schedule'          => 'scheduled',
		'workflow_dispatch' => 'started by hand or from the site',
		'workflow_run'      => 'after another workflow',
		'push'              => 'push',
	);
	$rows = array();
	foreach ( $runs as $r ) {
		$t      = sourceweb_worker_run_text( $r );
		$sha    = (string) ( $r['sha'] ?? '' );
		$rows[] = array(
			'id'      => (string) ( $r['run_id'] ?? '' ),
			'attempt' => (int) ( $r['attempt'] ?? 1 ),
			'link'    => esc_url_raw( (string) ( $r['link'] ?? '' ) ),
			'when'    => $t['when'],
			'took'    => $t['took'],
			'label'   => $t['label'],
			'tone'    => $t['tone'],
			'event'   => (string) ( $ev[ $r['event'] ?? '' ] ?? ( $r['event'] ?? '' ) ),
			'counts'  => $t['counts'],
			'commit'  => '' !== $sha ? substr( $sha, 0, 7 ) : '',
			'commitUrl' => '' !== $sha ? sourceweb_workers_repo_url( '/commit/' . rawurlencode( $sha ) ) : '',
		);
	}
	return rest_ensure_response(
		array(
			'id'        => $w['id'],
			'name'      => $w['name'],
			'planned'   => (bool) $w['planned'],
			'keep'      => (int) SOURCEWEB_WORKERS_KEEP,
			'githubUrl' => $w['planned'] ? '' : sourceweb_workers_repo_url( '/actions/workflows/' . rawurlencode( $w['file'] ) ),
			'rows'      => $rows,
		)
	);
}

/**
 * POST workers/save.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_worker_save( WP_REST_Request $request ) {
	$res = sourceweb_worker_save(
		array(
			'edit'      => (string) $request['edit'],
			'id'        => (string) $request['id'],
			'name'      => (string) $request['name'],
			'what'      => (string) $request['what'],
			'schedule'  => (string) $request['schedule'],
			'late'      => (string) $request['late'],
			'group'     => (string) $request['group'],
			'group_new' => (string) $request['group_new'],
			'keys'      => $request['keysShown'] ? array_map( 'strval', (array) $request['keys'] ) : null,
		)
	);
	if ( is_wp_error( $res ) ) {
		return new WP_Error( 'sourceweb_worker_' . $res->get_error_code(), $res->get_error_message(), array( 'status' => 'missing' === $res->get_error_code() ? 404 : 400 ) );
	}
	$msg = array(
		'added' => 'Planned worker "%s" added. It shows "Not built yet" until a workflow with its ID reports a run.',
		'saved' => 'Worker "%s" saved.',
		'same'  => 'Nothing changed for "%s".',
	);
	$out = sprintf( $msg[ $res['done'] ], $res['name'] );
	if ( $res['skip'] ) {
		/* translators: %d: number of keys. */
		$out .= ' ' . sprintf( _n( '%d key was left ticked: it is for this worker only, and a key needs at least one worker. Remove it on AI models instead.', '%d keys were left ticked: each is for this worker only, and a key needs at least one worker. Remove them on AI models instead.', $res['skip'], 'sourceweb' ), $res['skip'] );
	}
	return rest_ensure_response( $res + array( 'message' => $out ) );
}

/**
 * POST workers/delete: a Planned worker only.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_worker_delete( WP_REST_Request $request ) {
	$res = sourceweb_worker_delete( (string) $request['id'] );
	if ( is_wp_error( $res ) ) {
		return $res;
	}
	return rest_ensure_response(
		array(
			'message' => sprintf( 'Planned worker "%s" deleted.', $res['name'] ) . ( $res['freed'] ? ' ' . sprintf( 'Now for all workers: %s.', implode( ', ', $res['freed'] ) ) : '' ),
		)
	);
}

/**
 * POST workers/run: Run now, for a registry workflow that needs no input.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_worker_run( WP_REST_Request $request ) {
	$w = sourceweb_worker( (string) $request['id'] );
	if ( ! $w || ! sourceweb_workers_can_run( $w ) ) {
		return new WP_Error( 'sourceweb_no_run', __( 'Run now is not available for this worker.', 'sourceweb' ), array( 'status' => 400 ) );
	}
	$res = sourceweb_workers_run_now( $w['file'] );
	if ( true !== $res ) {
		return new WP_Error( 'sourceweb_run_failed', $w['name'] . ': not started — ' . $res->get_error_message(), array( 'status' => 502 ) );
	}
	return rest_ensure_response( array( 'message' => $w['name'] . ': started on GitHub. Its start report appears here within a minute or two.' ) );
}
