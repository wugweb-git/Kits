<?php
/**
 * PlanWeb's scheduled jobs on WP-Cron (the rules are in jobs-model.php, which tests/run.php covers). All four are off
 * until the owner switches them on in PlanWeb Settings:
 *
 * - Overdue sweep (daily, 06:00 site time): flags open entries whose date has passed, so the Calendar and the
 *   Dashboard count them as overdue. Dates are never changed and nothing is deleted.
 * - Repeats (daily, 06:15): an entry set to repeat weekly or monthly gets ONE next entry once its date has passed.
 * - Reminders (daily, 08:00): one plain-text email per site user listing their entries due soon and not finished.
 * - Weekly digest (Monday, 08:30): the next 7 days and what is overdue, to the site administrator.
 *
 * Email goes only to site users, through the site's own wp_mail(); PlanWeb posts nothing to any social network. A
 * mail is recorded as sent only after wp_mail() says yes, and the planweb_job_email filter can stop any of them.
 *
 * Options (group planweb): planweb_jobs_overdue, planweb_jobs_repeats, planweb_reminders_on, planweb_reminder_days,
 * planweb_digest_on, planweb_digest_brand. Written by the jobs: planweb_jobs_sent (reminder dedupe: entry ID and date),
 * planweb_digest_sent (the week last mailed).
 *
 * @package planweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Reminder dedupe list and the digest's last week. */
const PLANWEB_JOBS_SENT   = 'planweb_jobs_sent';
const PLANWEB_DIGEST_SENT = 'planweb_digest_sent';

/** Repeat labels (one place, so the Calendar's form and the shell's lists read the same). */
function planweb_repeat_labels(): array {
	return array(
		'none'    => __( 'Does not repeat', 'planweb' ),
		'weekly'  => __( 'Every week', 'planweb' ),
		'monthly' => __( 'Every month', 'planweb' ),
	);
}

/* ---------- Settings ---------- */

/**
 * The saved settings, with their defaults.
 *
 * @return array{overdue: bool, repeats: bool, reminders: bool, days: int, digest: bool, brand: string}
 */
function planweb_jobs_settings(): array {
	return array(
		'overdue'   => 1 === planweb_jobs_clean_flag( get_option( 'planweb_jobs_overdue', 0 ) ),
		'repeats'   => 1 === planweb_jobs_clean_flag( get_option( 'planweb_jobs_repeats', 0 ) ),
		'reminders' => 1 === planweb_jobs_clean_flag( get_option( 'planweb_reminders_on', 0 ) ),
		'days'      => planweb_jobs_clean_days( get_option( 'planweb_reminder_days', 1 ) ) ?? 1,
		'digest'    => 1 === planweb_jobs_clean_flag( get_option( 'planweb_digest_on', 0 ) ),
		'brand'     => planweb_jobs_clean_brand( get_option( 'planweb_digest_brand', '' ) ) ?? '',
	);
}

/**
 * Sanitize callback of the switches: a bad value keeps the stored one.
 *
 * @param mixed  $v      Value.
 * @param string $option Option name.
 */
function planweb_jobs_sanitize_flag( $v, string $option ): int {
	return planweb_jobs_clean_flag( $v ) ?? ( 1 === planweb_jobs_clean_flag( get_option( $option, 0 ) ) ? 1 : 0 );
}

add_action(
	'init',
	function () {
		foreach ( array( 'planweb_jobs_overdue', 'planweb_jobs_repeats', 'planweb_reminders_on', 'planweb_digest_on' ) as $option ) {
			register_setting(
				'planweb',
				$option,
				array(
					'type'              => 'integer',
					'default'           => 0,
					'sanitize_callback' => fn( $v ) => planweb_jobs_sanitize_flag( $v, $option ),
					'show_in_rest'      => false,
				)
			);
		}
		register_setting(
			'planweb',
			'planweb_reminder_days',
			array(
				'type'              => 'integer',
				'default'           => 1,
				'sanitize_callback' => fn( $v ) => planweb_jobs_clean_days( $v ) ?? ( planweb_jobs_clean_days( get_option( 'planweb_reminder_days', 1 ) ) ?? 1 ),
				'show_in_rest'      => false,
			)
		);
		register_setting(
			'planweb',
			'planweb_digest_brand',
			array(
				'type'              => 'string',
				'default'           => '',
				'sanitize_callback' => fn( $v ) => planweb_jobs_clean_brand( $v ) ?? planweb_jobs_clean_brand( get_option( 'planweb_digest_brand', '' ) ) ?? '',
				'show_in_rest'      => false,
			)
		);
	}
);

/* ---------- Schedule ---------- */

/**
 * Put each job's event in place: scheduled when PlanWeb and the job are on, gone otherwise. Called from an admin request
 * and after a save, never while a page loads for a visitor.
 */
function planweb_jobs_sync() {
	$s   = planweb_jobs_settings();
	$on  = array(
		'overdue'   => $s['overdue'],
		'repeats'   => $s['repeats'],
		'reminders' => $s['reminders'],
		'digest'    => $s['digest'],
	);
	$now = new DateTimeImmutable( 'now', wp_timezone() );
	foreach ( PLANWEB_JOBS as $key => $job ) {
		$next = wp_next_scheduled( $job['hook'] );
		if ( planweb_on() && $on[ $key ] && ! $next ) {
			wp_schedule_event( planweb_job_next_run( $now, $job['time'], $job['weekday'] ), $job['recurrence'], $job['hook'] );
		} elseif ( ( ! planweb_on() || ! $on[ $key ] ) && $next ) {
			wp_clear_scheduled_hook( $job['hook'] );
		}
	}
}
add_action( 'admin_init', 'planweb_jobs_sync' );

/** Take every job's event away (deactivation; the settings are kept). */
function planweb_jobs_unschedule() {
	foreach ( PLANWEB_JOBS as $job ) {
		wp_clear_scheduled_hook( $job['hook'] );
	}
}

/* ---------- Entries the jobs read ---------- */

/**
 * Every entry, with its author (the user the reminders go to).
 *
 * @param string $from Y-m-d or ''.
 * @param string $to   Y-m-d or ''.
 * @return array[]
 */
function planweb_jobs_entries( string $from = '', string $to = '' ): array {
	$entries = planweb_entries( $from, $to, array( 'posts_per_page' => -1 ) );
	foreach ( $entries as &$e ) {
		$e['author'] = (int) get_post_field( 'post_author', $e['id'] );
	}
	unset( $e );
	return $entries;
}

/** Whether a job may run: PlanWeb on and the job switched on. */
function planweb_jobs_may_run( string $key ): bool {
	$s = planweb_jobs_settings();
	return planweb_on() && post_type_exists( PLANWEB_TYPE ) && ! empty( $s[ $key ] );
}

/**
 * Send one job email through the opt-out filter and wp_mail().
 *
 * @param array $mail kind, to, subject, body.
 * @return bool Whether wp_mail() said yes.
 */
function planweb_jobs_send( array $mail ): bool {
	return planweb_job_deliver(
		$mail,
		/**
		 * Filter a PlanWeb email before it is sent. Return false to send nothing. The address cannot be changed.
		 *
		 * @param array|false $mail kind (reminder or digest), to, subject, body.
		 * @param string      $kind reminder or digest.
		 */
		fn( $m ) => apply_filters( 'planweb_job_email', $m, $m['kind'] ),
		fn( $m ) => wp_mail( $m['to'], $m['subject'], $m['body'] )
	);
}

/* ---------- The jobs ---------- */

/**
 * Overdue sweep: flag open past entries, let go of flags that no longer apply.
 *
 * @return array{set: int, cleared: int}
 */
function planweb_job_overdue_run(): array {
	$out = array(
		'set'     => 0,
		'cleared' => 0,
	);
	if ( ! planweb_jobs_may_run( 'overdue' ) ) {
		return $out;
	}
	$plan = planweb_overdue_plan( planweb_entries( '', '', array( 'posts_per_page' => -1 ) ), wp_date( 'Y-m-d' ) );
	foreach ( $plan['set'] as $id ) {
		update_post_meta( $id, 'planweb_flag', 'overdue' );
		++$out['set'];
	}
	foreach ( $plan['clear'] as $id ) {
		delete_post_meta( $id, 'planweb_flag' );
		++$out['cleared'];
	}
	if ( $out['set'] || $out['cleared'] ) {
		planweb_counts_request(); // The Dashboard counts again in the background.
	}
	return $out;
}
add_action( PLANWEB_JOBS['overdue']['hook'], 'planweb_job_overdue_run' );

/**
 * Repeats: one next entry for each repeating entry whose date has passed, at most 50 a run.
 *
 * @return int Entries made.
 */
function planweb_job_repeats_run(): int {
	if ( ! planweb_jobs_may_run( 'repeats' ) ) {
		return 0;
	}
	$today   = wp_date( 'Y-m-d' );
	$created = 0;
	foreach ( planweb_repeat_plan( planweb_jobs_entries( '', planweb_add_days( $today, -1 ) ), $today ) as $item ) {
		if ( $created >= PLANWEB_REPEAT_CAP ) {
			break;
		}
		$source = $item['source'];
		/**
		 * Filter whether a repeating entry gets its next entry. Return false to skip it (it is asked again on the next run).
		 *
		 * @param bool  $repeat Whether to repeat it.
		 * @param array $source The entry that repeats.
		 * @param array $fields What the new entry will hold.
		 */
		if ( false === apply_filters( 'planweb_repeat_entry', true, $source, $item['fields'] ) ) {
			continue;
		}
		$id = planweb_save_entry( $item['fields'] + array( 'author' => (int) ( $source['author'] ?? 0 ) ), 0, false );
		if ( is_wp_error( $id ) ) {
			continue;
		}
		update_post_meta( $source['id'], 'planweb_repeated_to', (string) $id ); // Never repeats twice.
		++$created;
	}
	if ( $created ) {
		planweb_counts_request();
	}
	return $created;
}
add_action( PLANWEB_JOBS['repeats']['hook'], 'planweb_job_repeats_run' );

/**
 * Reminders: one email per user per day, and only to a site user who owns an entry that is due soon.
 *
 * @return int Emails sent.
 */
function planweb_job_reminders_run(): int {
	if ( ! planweb_jobs_may_run( 'reminders' ) ) {
		return 0;
	}
	$today   = wp_date( 'Y-m-d' );
	$days    = planweb_jobs_settings()['days'];
	$entries = planweb_jobs_entries( $today, planweb_add_days( $today, $days ) );
	$users   = array();
	foreach ( $entries as &$e ) {
		/**
		 * Filter which site user an entry's reminder goes to (the entry's author by default). 0 for nobody.
		 *
		 * @param int   $user_id The user ID.
		 * @param array $entry   The entry.
		 */
		$e['author'] = (int) apply_filters( 'planweb_reminder_user', $e['author'], $e );
		if ( $e['author'] && ! isset( $users[ $e['author'] ] ) ) {
			$user = get_userdata( $e['author'] );
			if ( $user && is_email( $user->user_email ) ) {
				$users[ $e['author'] ] = array(
					'email' => (string) $user->user_email,
					'name'  => (string) $user->display_name,
				);
			}
		}
	}
	unset( $e );
	$sent = (array) get_option( PLANWEB_JOBS_SENT, array() );
	$mails = 0;
	$site  = wp_specialchars_decode( (string) get_bloginfo( 'name' ), ENT_QUOTES );
	foreach ( planweb_reminder_groups( $entries, $today, $days, $users, $sent ) as $g ) {
		if ( ! planweb_jobs_send( planweb_reminder_build( $g, $site, planweb_url(), $days, $today ) ) ) {
			continue; // Not recorded, so the next run tries again.
		}
		foreach ( $g['keys'] as $key ) {
			$sent[ $key ] = $today;
		}
		++$mails;
	}
	$sent = planweb_jobs_sent_prune( $sent, $today );
	if ( $sent !== (array) get_option( PLANWEB_JOBS_SENT, array() ) ) {
		update_option( PLANWEB_JOBS_SENT, $sent, false );
	}
	return $mails;
}
add_action( PLANWEB_JOBS['reminders']['hook'], 'planweb_job_reminders_run' );

/**
 * Weekly digest to the site administrator, once a week.
 *
 * @return string sent, off, already, nothing or failed.
 */
function planweb_job_digest_run(): string {
	if ( ! planweb_jobs_may_run( 'digest' ) ) {
		return 'off';
	}
	$week = wp_date( 'o-\WW' );
	if ( get_option( PLANWEB_DIGEST_SENT ) === $week ) {
		return 'already';
	}
	$today = wp_date( 'Y-m-d' );
	$mail  = planweb_digest_build(
		planweb_entries( '', planweb_add_days( $today, 6 ), array( 'posts_per_page' => -1 ) ),
		$today,
		wp_specialchars_decode( (string) get_bloginfo( 'name' ), ENT_QUOTES ),
		(string) get_option( 'admin_email' ),
		planweb_jobs_settings()['brand'],
		planweb_url()
	);
	if ( null === $mail ) {
		return 'nothing';
	}
	if ( ! planweb_jobs_send( $mail ) ) {
		return 'failed'; // Not recorded, so the next run tries again.
	}
	update_option( PLANWEB_DIGEST_SENT, $week, false );
	return 'sent';
}
add_action( PLANWEB_JOBS['digest']['hook'], 'planweb_job_digest_run' );

/* ---------- Settings screens ---------- */

/**
 * Save the jobs' settings from the form (planweb_jobs_save) or the route; each goes through its registered cleaner.
 *
 * @param array $in overdue, repeats, reminders, digest (switches), days, brand: only those present are saved.
 * @return WP_Error|true A bad value is refused before anything is written.
 */
function planweb_jobs_save( array $in ) {
	$map = array(
		'overdue'   => 'planweb_jobs_overdue',
		'repeats'   => 'planweb_jobs_repeats',
		'reminders' => 'planweb_reminders_on',
		'digest'    => 'planweb_digest_on',
	);
	foreach ( $map as $key => $option ) {
		if ( array_key_exists( $key, $in ) && null === planweb_jobs_clean_flag( $in[ $key ] ) ) {
			return new WP_Error( 'planweb_jobs', __( 'A switch must be on or off.', 'planweb' ), array( 'status' => 400 ) );
		}
	}
	if ( array_key_exists( 'days', $in ) && null === planweb_jobs_clean_days( $in['days'] ) ) {
		return new WP_Error( 'planweb_jobs', __( 'Reminder days must be a whole number from 1 to 14.', 'planweb' ), array( 'status' => 400 ) );
	}
	if ( array_key_exists( 'brand', $in ) && null === planweb_jobs_clean_brand( $in['brand'] ) ) {
		return new WP_Error( 'planweb_jobs', __( 'The first line must be plain text of at most 120 characters.', 'planweb' ), array( 'status' => 400 ) );
	}
	foreach ( $map as $key => $option ) {
		if ( array_key_exists( $key, $in ) ) {
			update_option( $option, (int) planweb_jobs_clean_flag( $in[ $key ] ), false );
		}
	}
	if ( array_key_exists( 'days', $in ) ) {
		update_option( 'planweb_reminder_days', (int) planweb_jobs_clean_days( $in['days'] ), false );
	}
	if ( array_key_exists( 'brand', $in ) ) {
		update_option( 'planweb_digest_brand', (string) planweb_jobs_clean_brand( $in['brand'] ), false );
	}
	planweb_jobs_sync();
	return true;
}

/**
 * POST settings/jobs.
 *
 * @param WP_REST_Request $request Request.
 */
function planweb_rest_jobs( WP_REST_Request $request ) {
	$in = array();
	foreach ( array( 'overdue', 'repeats', 'reminders', 'days', 'digest', 'brand' ) as $key ) {
		if ( null !== $request[ $key ] ) {
			$in[ $key ] = $request[ $key ];
		}
	}
	$saved = planweb_jobs_save( $in );
	if ( is_wp_error( $saved ) ) {
		return $saved;
	}
	return rest_ensure_response(
		array(
			'jobs'    => planweb_jobs_settings(),
			'message' => __( 'Saved.', 'planweb' ),
		)
	);
}

add_action(
	'admin_post_planweb_jobs_save',
	function () {
		if ( ! check_admin_referer( 'planweb_jobs_save' ) || ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'planweb' ), 403 );
		}
		// An unticked box is not sent, so every switch reads as off unless it is there.
		$in = array(
			'overdue'   => isset( $_POST['overdue'] ) ? 1 : 0,
			'repeats'   => isset( $_POST['repeats'] ) ? 1 : 0,
			'reminders' => isset( $_POST['reminders'] ) ? 1 : 0,
			'digest'    => isset( $_POST['digest'] ) ? 1 : 0,
			'days'      => isset( $_POST['days'] ) ? sanitize_text_field( wp_unslash( $_POST['days'] ) ) : '1',
			'brand'     => isset( $_POST['brand'] ) ? sanitize_text_field( wp_unslash( $_POST['brand'] ) ) : '',
		);
		$saved = planweb_jobs_save( $in );
		$back  = function_exists( 'kits_shell_app' ) || 'settings' === ( isset( $_POST['back'] ) ? sanitize_key( wp_unslash( $_POST['back'] ) ) : '' ) ? planweb_ui_url( 'settings' ) : planweb_url(); // Nonce checked above.
		if ( is_wp_error( $saved ) ) {
			wp_safe_redirect( add_query_arg( 'error', rawurlencode( $saved->get_error_message() ), $back ) . '#planweb-jobs' );
			exit;
		}
		wp_safe_redirect( add_query_arg( 'done', 'jobs', $back ) . '#planweb-jobs' );
		exit;
	}
);

/**
 * The Scheduled jobs form (administrators): on PlanWeb → Settings under the shell's groups, and on the classic Calendar.
 *
 * @param bool $wrap Draw inside a wrap of its own (the shell's page has none left open).
 */
function planweb_jobs_panel( bool $wrap = false, string $back = '' ) {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$s = planweb_jobs_settings();
	if ( $wrap ) {
		echo '<div class="wrap planweb planweb-jobs">';
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- messages only.
		if ( isset( $_GET['done'] ) && 'jobs' === sanitize_key( wp_unslash( $_GET['done'] ) ) ) {
			wp_admin_notice( esc_html__( 'Scheduled jobs saved.', 'planweb' ), array( 'type' => 'success' ) );
		}
		if ( isset( $_GET['error'] ) ) {
			wp_admin_notice( esc_html( sanitize_text_field( wp_unslash( $_GET['error'] ) ) ), array( 'type' => 'error' ) );
		}
		// phpcs:enable
	}
	echo '<h2 id="planweb-jobs">' . esc_html__( 'Scheduled jobs', 'planweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Four small jobs that run once a day or once a week, all off until you switch them on. Nothing is posted to any social network. The two emails go only to people with an account on this site, sent by this site\'s own email (wp_mail), and only when switched on here.', 'planweb' ) . '</p>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="planweb_jobs_save">';
	wp_nonce_field( 'planweb_jobs_save' );
	if ( '' !== $back ) {
		echo '<input type="hidden" name="back" value="' . esc_attr( $back ) . '">';
	}
	echo '<table class="form-table" role="presentation"><tbody>';
	$rows = array(
		'overdue'   => array( __( 'Overdue sweep', 'planweb' ), __( 'Every day at 06:00 (site time), mark entries whose date has passed and that are still open (idea, draft, approved or due) as overdue, so the Calendar and Dashboard show them. Dates are never changed and nothing is deleted.', 'planweb' ) ),
		'repeats'   => array( __( 'Repeats', 'planweb' ), __( 'Every day at 06:15, make the next entry for an entry set to repeat every week or month, once its date has passed. One is made, with status Idea, and the old entry is marked so it never repeats twice. At most 50 a day.', 'planweb' ) ),
		'reminders' => array( __( 'Reminders by email', 'planweb' ), __( 'Every day at 08:00, email each site user a list of their entries that are due soon and not finished. "Their" means the user who created the entry; an entry with no such user is skipped.', 'planweb' ) ),
		'digest'    => array( __( 'Weekly digest by email', 'planweb' ), __( 'Every Monday at 08:30, email the site administrator address (Settings, General) the next 7 days and what is overdue.', 'planweb' ) ),
	);
	foreach ( $rows as $key => $r ) {
		echo '<tr><th scope="row">' . esc_html( $r[0] ) . '</th><td><label><input type="checkbox" name="' . esc_attr( $key ) . '" value="1"' . checked( $s[ $key ], true, false ) . '> ' . esc_html__( 'On', 'planweb' ) . '</label><p class="description">' . esc_html( $r[1] ) . '</p>';
		if ( 'reminders' === $key ) {
			echo '<p><label for="planweb-jobs-days">' . esc_html__( 'Remind this many days ahead (1 to 14)', 'planweb' ) . '</label> <input type="number" id="planweb-jobs-days" name="days" min="1" max="14" step="1" class="small-text" value="' . (int) $s['days'] . '"></p>';
		}
		if ( 'digest' === $key ) {
			echo '<p><label for="planweb-jobs-brand">' . esc_html__( 'First line of the email (optional)', 'planweb' ) . '</label><br><input type="text" id="planweb-jobs-brand" name="brand" class="regular-text" maxlength="120" value="' . esc_attr( $s['brand'] ) . '"></p>';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';
	submit_button( __( 'Save scheduled jobs', 'planweb' ), 'primary', 'submit', false );
	echo '</form>';
	if ( $wrap ) {
		echo '</div>';
	}
}
