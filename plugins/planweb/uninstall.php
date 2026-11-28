<?php
/**
 * Uninstall PlanWeb. By default it deletes nothing: settings and every calendar entry stay, so reinstalling finds
 * everything as it was.
 *
 * Always, whatever the switch below says: every scheduled event of this plugin (list under "Scheduled events" below). They are
 * not data, and once the code is gone nothing would run them.
 *
 * Only when Kits → Modules → PlanWeb → "Delete this plugin's data when it is deleted" is ticked
 * (planweb_delete_data_on_uninstall is true) does it delete PlanWeb's own data, exactly this:
 *
 * Options: planweb_on, planweb_setup, planweb_import_done, planweb_import_lock, planweb_import_result,
 *   planweb_import_tried, planweb_feed_key, planweb_site_types, planweb_site_on, the planweb_migrate_1114 pair, the scheduled jobs'
 *   settings (planweb_jobs_overdue, planweb_jobs_repeats, planweb_reminders_on, planweb_reminder_days, planweb_digest_on,
 *   planweb_digest_brand) and their dedupe lists (planweb_jobs_sent, planweb_digest_sent), planweb_delete_data_on_uninstall.
 * Transients (they expire anyway): planweb_counts and those starting planweb_draft_.
 * Scheduled events (taken off on every uninstall, all of each hook, whatever their arguments): planweb_counts_build, planweb_job_overdue, planweb_job_repeats,
 *   planweb_job_reminders, planweb_job_digest (the scheduled jobs, jobs.php).
 * Tables: none of its own.
 *
 * Never deleted, even when ticked:
 * - The calendar entries (posts), their list values (terms), users, attachments and any post meta.
 * - The capabilities PlanWeb gave to roles (they are part of the users' roles; switching PlanWeb off removes them).
 * - An earlier Dates list that a site names through the filter planweb_import_source (its option), which PlanWeb only
 *   reads when it imports.
 *
 * Before deleting, writes a backup to wp-content/uploads/wugweb-backups/planweb-uninstall-<YYYYmmdd-His>.jsonl.gz
 * (includes/uninstall-backup.php): a header line, then every option below with its value as stored, then every row of
 * every table below (transients are caches and are not kept). If the backup cannot be written, nothing is deleted.
 *
 * Runs for the current site only.
 *
 * @package planweb
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Scheduled events go on every uninstall. wp_unschedule_hook() takes every event of a hook whatever its arguments (the Dashboard's
// counts job also runs once with the argument 'now', which wp_clear_scheduled_hook( $hook ) alone would leave). This list is the
// plugin's own hooks: PLANWEB_COUNTS_JOB (planweb-dashboard.php) and each hook of PLANWEB_JOBS (jobs-model.php);
// tests/uninstall-cron-test.php checks it against the code.
foreach ( array( 'planweb_counts_build', 'planweb_job_overdue', 'planweb_job_repeats', 'planweb_job_reminders', 'planweb_job_digest' ) as $planweb_hook ) {
	wp_unschedule_hook( $planweb_hook );
}
unset( $planweb_hook );

if ( true !== (bool) get_option( 'planweb_delete_data_on_uninstall', false ) ) {
	return; // The default: keep everything.
}

$planweb_options = array( 'planweb_on', 'planweb_setup', 'planweb_import_done', 'planweb_import_lock', 'planweb_import_result', 'planweb_import_tried', 'planweb_feed_key', 'planweb_site_types', 'planweb_site_on', 'planweb_migrate_1114', 'planweb_migrate_1114_lock', 'planweb_jobs_overdue', 'planweb_jobs_repeats', 'planweb_reminders_on', 'planweb_reminder_days', 'planweb_digest_on', 'planweb_digest_brand', 'planweb_jobs_sent', 'planweb_digest_sent' );

require_once __DIR__ . '/includes/uninstall-backup.php';
if ( ! planweb_uninstall_backup( 'planweb', __DIR__ . '/planweb.php', array_merge( $planweb_options, array( 'planweb_delete_data_on_uninstall' ) ), array(), array() ) ) {
	return; // No backup, no delete (the reason is in the error log).
}

foreach ( $planweb_options as $planweb_option ) {
	delete_option( $planweb_option );
}

delete_transient( 'planweb_counts' );
global $wpdb;
foreach ( array( '_transient_planweb_draft_', '_transient_timeout_planweb_draft_' ) as $planweb_start ) {
	$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like( $planweb_start ) . '%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- uninstall: transients by prefix, once.
}

delete_option( 'planweb_delete_data_on_uninstall' ); // Last, so a run that stops half-way can be repeated.
