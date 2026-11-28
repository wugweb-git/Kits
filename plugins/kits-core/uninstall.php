<?php
/**
 * Uninstall Kits Core. By default it deletes nothing: theme options, form settings, saved keys and publisher records
 * stay, so reinstalling finds everything as it was.
 *
 * Only when Kits → Settings → Uninstall → "Delete this plugin's data when it is deleted" is ticked
 * (kits_delete_data_on_uninstall is true) does it delete Kits Core's own data, exactly this:
 *
 * Options:
 *   kits_theme_options, kits_page_defaults, kits_settings_backup, kits_settings_backup_defaults, kits_altcha_key,
 *   kits_ga4_via_gtm, kits_preview_devices, kits_preview_ips, kits_preview_links, kits_spot_map, kits_presets_enabled,
 *   kits_presets_rewrite, kits_presets_consent, kits_core_joined,
 *   kits_daily_backup (the daily backup's switch) and aw_backup_last (its last run, backups.php), aw_error_pages (the error pages' state, error-pages.php),
 *   kits_cli_commands (the Help commands list, cli-commands.php),
 *   the site operations (includes/ops/): aw_cdn_ttl, aw_cdn_ttl_long,
 *   aw_cron_runs, aw_deployed_head, aw_dispatch_log, aw_error_count, aw_site_check_last,
 *   the media records: aw_media_merge_log, aw_media_merge_data_*, aw_media_webp_log; kits_delete_data_on_uninstall.
 * The used ALTCHA answers (option rows kits_altcha_used_*, 1.4.1), deleted by prefix.
 * Transients (they expire anyway): kits_preview_link_*, kits_thanks_*, kits_transfer_result_*, kits_altcha_*, kits_dl_*,
 *   aw_error_count_mailed, aw_error_pages_checked, and the site transient kits_update_release.
 * Scheduled events: kits_spot_map_daily, aw_daily_backup, aw_error_count_daily, aw_site_check_deploy.
 * Also options kits_active_style_variation, kits_update_channel, kits_global_styles_backup, kits_tidy_menus,
 *   kits_error_count_daily, kits_daily_event, kits_public_gate_routes, and the
 *   transient kits_registry. Scheduled events aw_daily, aw_error_count_daily, aw_daily_backup and
 *   kits_checkin_weekly are unscheduled on every uninstall (ticked or not).
 * A site layer adds its own options, transient prefixes, events and tables with the filter kits_core_uninstall_options
 *   and the actions kits_core_uninstall (every uninstall) and kits_core_uninstall_data (data deletion ticked); what it
 *   adds is its own to list and document.
 *
 * Never deleted, even when ticked:
 * - Posts, pages, synced patterns, Styles (wp_global_styles), terms, users, attachments and any post meta (the
 *   _kits_* Page Options of each page stay).
 * - The aw_form_* / aw_rl_* form transients (they expire within the hour).
 * - The keyword tables ({prefix}aw_si_keywords, {prefix}aw_si_kw_map) and aw_kw_db, the sourcing lists aw_sources,
 *   aw_publishers and aw_relevance, and the aw_fetch_favicons event: InsightWeb's and SourceWeb's since 18 Nov 2026
 *   (Kits Core no longer installs, reads or books them).
 * - Files: the daily backups in ~/backups and the error pages (drop-ins) in wp-content.
 * - Anything belonging to another plugin or to WordPress itself.
 *
 * Before deleting, writes a backup to wp-content/uploads/wugweb-backups/kits-core-uninstall-<YYYYmmdd-His>.jsonl.gz
 * (includes/uninstall-backup.php): a header line, then every option below (except kits_altcha_key, a regenerated
 * secret that is deleted but never written to the backup file) with its value as stored, then every row of
 * every table below (transients are caches and are not kept). If the backup cannot be written, nothing is deleted.
 *
 * Runs for the current site only.
 *
 * @package kits-core
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Scheduled events are removed on every uninstall (they are not data, and nothing else would unbook them).
foreach ( array( 'aw_daily', 'aw_error_count_daily', 'aw_daily_backup', 'kits_checkin_weekly' ) as $kits_hook ) {
	wp_unschedule_hook( $kits_hook );
}
do_action( 'kits_core_uninstall' ); // a site layer unschedules its own events here.

if ( true !== (bool) get_option( 'kits_delete_data_on_uninstall', false ) ) {
	return; // The default: keep everything.
}

$kits_options = array(
	'kits_theme_options',
	'kits_page_defaults',
	'kits_brand_tokens',
	'kits_brand_active_preset',
	'kits_settings_backup',
	'kits_settings_backup_defaults',
	'kits_altcha_key',
	'kits_ga4_via_gtm',
	'kits_preview_devices',
	'kits_preview_ips',
	'kits_preview_links',
	'kits_spot_map',
	'kits_presets_enabled',
	'kits_core_joined',
	'kits_daily_backup',
	'aw_backup_last',
	'aw_error_pages',
	'kits_presets_rewrite',
	'kits_presets_consent',
	'kits_cli_commands',
	'aw_media_merge_log',
	'aw_media_webp_log',
	'aw_cdn_ttl',
	'aw_cdn_ttl_long',
	'aw_cron_runs',
	'aw_deployed_head',
	'aw_dispatch_log',
	'aw_error_count',
	'aw_site_check_last',
	'kits_checkin_on',
	'kits_checkin_url',
	'kits_checkin_last',
	'kits_active_style_variation',
	'kits_update_channel',
	'kits_global_styles_backup',
	'kits_tidy_menus',
	'kits_error_count_daily',
	'kits_daily_event',
	'kits_public_gate_routes',
);
$kits_options = array_values( array_unique( array_merge( $kits_options, array_map( 'strval', (array) apply_filters( 'kits_core_uninstall_options', array() ) ) ) ) ); // a site layer's own options.

// The ALTCHA signing key is deleted but kept OUT of the backup file: it is a secret (regenerated on demand), and the
// backup lives under uploads/, which is URL-reachable on servers that ignore .htaccess (for example nginx).
$kits_backup_options = array_values( array_diff( $kits_options, array( 'kits_altcha_key' ) ) );

require_once __DIR__ . '/includes/uninstall-backup.php';
if ( ! kits_uninstall_backup( 'kits-core', __DIR__ . '/kits-core.php', array_merge( $kits_backup_options, array( 'kits_delete_data_on_uninstall' ) ), array( 'aw_media_merge_data_' ), array() ) ) {
	return; // No backup, no delete (the reason is in the error log).
}

foreach ( $kits_options as $kits_option ) {
	delete_option( $kits_option );
}

global $wpdb;
$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like( 'aw_media_merge_data_' ) . '%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- uninstall: the merge tool's per-group records, once.
$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like( 'kits_altcha_used_' ) . '%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- uninstall: used ALTCHA challenges, once.
delete_transient( 'kits_brand_theme_data' );
delete_transient( 'aw_error_count_mailed' ); // includes/ops/error-count.php.
foreach ( array( 'kits_preview_link_', 'kits_thanks_', 'kits_transfer_result_', 'kits_altcha_', 'kits_dl_' ) as $kits_prefix ) {
	foreach ( array( '_transient_', '_transient_timeout_' ) as $kits_kind ) {
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like( $kits_kind . $kits_prefix ) . '%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- uninstall: transients by prefix, once.
	}
}
delete_site_transient( 'kits_update_release' );
delete_transient( 'kits_registry' ); // includes/registry-updates.php.
delete_site_transient( 'kits_registry' );

do_action( 'kits_core_uninstall_data' ); // a site layer deletes its own tables and transients here.

wp_unschedule_hook( 'kits_spot_map_daily' );
wp_unschedule_hook( 'aw_error_count_daily' ); // includes/ops/error-count.php.
wp_unschedule_hook( 'aw_site_check_deploy' ); // includes/ops/site-check.php.
wp_unschedule_hook( 'aw_daily_backup' ); // the daily backup (backups.php); the backup files in ~/backups stay.
delete_transient( 'aw_error_pages_checked' ); // error-pages.php; the drop-ins in wp-content stay.

delete_option( 'kits_delete_data_on_uninstall' ); // Last, so a run that stops half-way can be repeated.
