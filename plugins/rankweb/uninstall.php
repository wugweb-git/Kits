<?php
/**
 * Uninstall RankWeb. By default it deletes nothing: settings, FAQ records, focus keywords and the scores it has stored
 * stay, so reinstalling finds everything as it was.
 *
 * Only when "Delete this plugin's data when it is deleted" is ticked (RankWeb → Settings → Modules, option
 * aw_seo_delete_data = 1) it deletes RankWeb's own data, and exactly this:
 *
 * Options:
 *   aw_seo_settings          (but when it holds InsightWeb's numbers, key 'search-insights', that key stays)
 *   aw_faq_off_types, aw_seo_keep_listings, aw_default_share_image, aw_seo_delete_data,
 *   aw_seo_endpoints_last, aw_seo_cache_gen, aw_seo_press_kw_1103, aw_seed_redirects_version, aw_sitemap_filtered,
 *   aw_html_sitemap_page (the option only; the page itself stays), aw_faq_experiment,
 *   rankweb_health_log, rankweb_health_schema, aw_link_db, aw_link_index_version, aw_link_page_version, aw_link_index_built, aw_link_audit_state, rankweb_link_audit_summary, aw_link_audit_checks
 * Transients (and their timeouts):
 *   rankweb_health, aw_faq_counts, aw_faq_index, aw_html_sitemap, aw_seed_redirects_wait, aw_sitemap_dir_pairs,
 *   and every transient named aw_seo_… (aw_seo_dir_data, rankweb_seo_category_counts, aw_seo_endpoints_mailed,
 *   aw_seo_advice_focus_index_v2, aw_seo_advice_median2_<type>, aw_seo_rendered_<id>, aw_seo_c_<hash>,
 *   aw_seo_categories_<type>, aw_seo_link_index, aw_seo_link_<id>)
 * Scheduled events:
 *   aw_seo_fill_daily, aw_seo_endpoints_watchdog, aw_seo_sitemap_daily, aw_faq_index_build, rankweb_health_build and
 *   rankweb_link_index_build (both with and without their 'now' argument)
 * Also removed: option rankweb_caps and rankweb_redirect_categories (the redirect labels; in the backup), the transients
 *   rankweb_image_sitemap, rankweb_font_fail_*, rankweb_schema_note_*, aw_faq_* , aw_silo_error_* and aw_link_audit_lock, the capability
 *   manage_rankweb on every role, the page cache folder wp-content/cache/rankweb/ and the local font folder
 *   wp-content/uploads/rankweb-fonts/ (both rebuilt from the site when a speed option is on; not in the backup).
 *   Kept: the .webp copies the WebP conversion made next to the media files (they are ordinary files in the media library).
 * Custom tables: {prefix}rankweb_link_keywords, {prefix}aw_links, {prefix}aw_link_audit, {prefix}aw_silos and {prefix}aw_silo_items (Internal links), dropped. Rank Math's tables are Rank Math's.
 *
 * Before deleting, writes a backup to wp-content/uploads/wugweb-backups/rankweb-uninstall-<YYYYmmdd-His>.jsonl.gz
 * (includes/uninstall-backup.php): a header line, then every option below with its value as stored, then every row of
 * every table below (transients are caches and are not kept).
 * aw_seo_settings is kept whole in the backup. If the backup cannot be written, nothing is deleted.
 *
 * Never deleted: posts, pages, terms, users, post or term meta (FAQ records, focus keywords, scores), Rank Math's data,
 * and any other plugin's options. The link keywords (post meta _aw_link_keywords) stay with the other post meta.
 *
 * @package rankweb
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( ! get_option( 'aw_seo_delete_data', 0 ) ) {
	return; // The default: keep everything.
}

$rankweb_seo_options = array( 'aw_faq_off_types', 'aw_seo_keep_listings', 'aw_default_share_image', 'aw_seo_endpoints_last', 'aw_seo_cache_gen', 'aw_seo_press_kw_1103', 'aw_seed_redirects_version', 'aw_sitemap_filtered', 'aw_html_sitemap_page', 'aw_faq_experiment', 'rankweb_health_log', 'rankweb_health_schema', 'aw_link_db', 'aw_link_index_version', 'aw_link_page_version', 'aw_link_index_built', 'aw_link_audit_db', 'aw_silo_db', 'aw_link_audit_state', 'rankweb_link_audit_summary', 'aw_link_audit_checks', 'rankweb_caps', 'rankweb_redirect_categories', 'aw_seo_delete_data' );

require_once __DIR__ . '/includes/uninstall-backup.php';
$rankweb_uninst_slug = file_exists( __DIR__ . '/rankweb.php' ) ? 'rankweb' : 'aw-seo-extras';
$rankweb_uninst_file = file_exists( __DIR__ . '/rankweb.php' ) ? __DIR__ . '/rankweb.php' : __DIR__ . '/aw-seo-extras.php';
if ( ! rankweb_seo_uninstall_backup( $rankweb_uninst_slug, $rankweb_uninst_file, array_merge( array( 'aw_seo_settings' ), $rankweb_seo_options ), array(), array( $GLOBALS['wpdb']->prefix . 'rankweb_link_keywords', $GLOBALS['wpdb']->prefix . 'aw_links', $GLOBALS['wpdb']->prefix . 'aw_link_audit', $GLOBALS['wpdb']->prefix . 'aw_silos', $GLOBALS['wpdb']->prefix . 'aw_silo_items' ) ) ) {
	return; // No backup, no delete (the reason is in the error log).
}

$rankweb_seo_settings = get_option( 'aw_seo_settings', array() );
if ( is_array( $rankweb_seo_settings ) && ! empty( $rankweb_seo_settings['search-insights'] ) ) {
	update_option( 'aw_seo_settings', array( 'search-insights' => $rankweb_seo_settings['search-insights'] ), true ); // InsightWeb's numbers stay
} else {
	delete_option( 'aw_seo_settings' );
}
unset( $rankweb_seo_settings );

foreach ( $rankweb_seo_options as $rankweb_seo_option ) {
	delete_option( $rankweb_seo_option );
}

foreach ( array( 'rankweb_health', 'aw_faq_counts', 'aw_faq_index', 'aw_html_sitemap', 'aw_seed_redirects_wait', 'aw_sitemap_dir_pairs' ) as $rankweb_seo_transient ) {
	delete_transient( $rankweb_seo_transient );
}
global $wpdb;
// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- no API deletes transients by prefix.
$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", $wpdb->esc_like( '_transient_aw_seo_' ) . '%', $wpdb->esc_like( '_transient_timeout_aw_seo_' ) . '%' ) );
foreach ( array( 'rankweb_', 'aw_faq_', 'aw_silo_error_', 'aw_link_audit_lock' ) as $rankweb_seo_prefix ) {
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- no API deletes transients by prefix.
	$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", $wpdb->esc_like( '_transient_' . $rankweb_seo_prefix ) . '%', $wpdb->esc_like( '_transient_timeout_' . $rankweb_seo_prefix ) . '%' ) );
}
unset( $rankweb_seo_prefix );

// The capability RankWeb added (rankweb-caps.php): taken off every role.
if ( function_exists( 'wp_roles' ) ) {
	foreach ( wp_roles()->role_objects as $rankweb_seo_role ) {
		if ( $rankweb_seo_role->has_cap( 'manage_rankweb' ) ) {
			$rankweb_seo_role->remove_cap( 'manage_rankweb' );
		}
	}
	unset( $rankweb_seo_role );
}

// Cache and font files (speed-pipeline.php): only RankWeb's own two folders, and only when they are where RankWeb puts them.
require_once ABSPATH . 'wp-admin/includes/file.php';
$rankweb_seo_upload  = wp_get_upload_dir();
$rankweb_seo_folders = array( trailingslashit( WP_CONTENT_DIR ) . 'cache/rankweb', trailingslashit( (string) $rankweb_seo_upload['basedir'] ) . 'rankweb-fonts' );
if ( WP_Filesystem() ) {
	global $wp_filesystem;
	foreach ( $rankweb_seo_folders as $rankweb_seo_folder ) {
		if ( 'rankweb' === basename( $rankweb_seo_folder ) || 'rankweb-fonts' === basename( $rankweb_seo_folder ) ) {
			if ( $wp_filesystem->is_dir( $rankweb_seo_folder ) ) {
				$wp_filesystem->delete( $rankweb_seo_folder, true );
			}
		}
	}
}
unset( $rankweb_seo_upload, $rankweb_seo_folders, $rankweb_seo_folder );

foreach ( array( 'aw_seo_fill_daily', 'aw_seo_endpoints_watchdog', 'aw_seo_sitemap_daily', 'aw_faq_index_build', 'rankweb_health_build', 'aw_link_index_build', 'aw_link_audit', 'rankweb_video_sync' ) as $rankweb_seo_hook ) {
	wp_clear_scheduled_hook( $rankweb_seo_hook );
}
wp_clear_scheduled_hook( 'rankweb_health_build', array( 'now' ) );
wp_clear_scheduled_hook( 'aw_link_index_build', array( 'now' ) );
wp_clear_scheduled_hook( 'aw_link_audit', array( 'now' ) );
wp_clear_scheduled_hook( 'aw_link_audit', array( 'more' ) );

// Internal links' tables (written to the backup above).
foreach ( array( 'rankweb_link_keywords', 'aw_links', 'aw_link_audit', 'aw_silos', 'aw_silo_items' ) as $rankweb_seo_table ) {
	$wpdb->query( $wpdb->prepare( 'DROP TABLE IF EXISTS %i', $wpdb->prefix . $rankweb_seo_table ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.DirectDatabaseQuery.SchemaChange -- RankWeb's own tables, on uninstall.
}
