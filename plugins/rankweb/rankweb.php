<?php
/**
 * RankWeb
 *
 * @package           rankweb
 * @author            Wugweb
 * @copyright         2026 Wugweb
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       RankWeb
 * Plugin URI:        https://wugweb-git.github.io/Kits/plugins/rankweb/
 * Description:       Complete SEO suite for WordPress: structured schema, canonicals, robots directives, sitemaps, breadcrumbs, internal links, media optimization, and content analysis. Integrates with Rank Math when active.
 * Version:           2.5.1
 * Requires at least: 7.1
 * Requires PHP:      8.0
 * Author:            Wugweb
 * Author URI:        https://wugweb.com/
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://wugweb.com/plugins/rankweb/
 * Text Domain:       rankweb
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'RANKWEB_VERSION' ) || define( 'RANKWEB_VERSION', '2.5.1' ); // keep equal to the Version header above

if ( ! defined( 'RANKWEB_DIR' ) ) {
	define( 'RANKWEB_DIR', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'RANKWEB_FILE' ) ) {
	define( 'RANKWEB_FILE', __FILE__ );
}

require_once RANKWEB_DIR . 'includes/post-type-roles.php'; // which content type plays news, library, campaign, opportunity, listing, press (the site says; filter rankweb_post_type_roles).
require_once RANKWEB_DIR . 'includes/text.php'; // rankweb_plain_text(), used by every file.
require_once RANKWEB_DIR . 'includes/rankweb-caps.php'; // RankWeb's own capability, manage_rankweb (granted from manage_categories).
require_once RANKWEB_DIR . 'includes/plugin-info.php'; // icon, banner and View details on the Plugins screen, with or without Rank Math.
require_once RANKWEB_DIR . 'includes/kits-hub.php'; // a tab and a status row in the Kits admin, when Kits Core is loaded.
require_once RANKWEB_DIR . 'includes/breadcrumbs-render.php'; // the visible trail above the page title, with or without Rank Math and the Breadcrumbs module.
require_once RANKWEB_DIR . 'includes/media-autofill.php'; // new image uploads: empty name, alt, caption, description, image context and keyphrase filled, with or without Rank Math.
require_once RANKWEB_DIR . 'includes/media-columns.php'; // Media Library columns: slug, SEO fields, where each file is used, optimisation; with or without Rank Math.
require_once RANKWEB_DIR . 'includes/reprint.php'; // Reprint, Content Syndication & Canonical Attribution engine (Reprint benchmark).
require_once RANKWEB_DIR . 'includes/import-columns.php'; // SEO columns another system stores under its own keys are copied into the SEO plugin's fields (sites opt in by prefix).
require_once RANKWEB_DIR . 'includes/editor-sidebar.php'; // Gutenberg Block Editor Sidebar & Live 0-100 Score Engine (Rank Math/Yoast benchmark).

/** Whether Rank Math is active (it loads after this plugin, so this is asked on plugins_loaded). */
function rankweb_seo_extras_rank_math() {
	return defined( 'RANK_MATH_VERSION' ) && class_exists( '\RankMath\Helper' );
}

add_action(
	'plugins_loaded',
	function () {
		define( 'RANKWEB_STANDALONE', ! rankweb_seo_extras_rank_math() );
		require_once RANKWEB_DIR . 'includes/standalone-seo.php'; // who prints the head, site defaults (language, profiles), standalone tags: needs nothing else
		require_once RANKWEB_DIR . 'includes/settings.php'; // first: the modules, their settings and switches
		$off = rankweb_seo_files_off();
		foreach ( array( 'helpers', 'overview', 'faq', 'hub-fallbacks', 'titles', 'canonical', 'filtered-views', 'robots', 'schema', 'rank-math-schema', 'opengraph', 'standalone-head', 'sitemap', 'redirects', 'breadcrumbs', 'focus-keywords', 'health', 'llms', 'markdown', 'analysis', 'content-advice', 'internal-links', 'link-audit', 'link-anchors', 'silos', 'video', 'schema-custom', 'schema-gallery', 'site-tags', 'bulk-edit', 'bulk-csv', 'media-seo', 'redirect-tools', 'transport', 'speed', 'speed-pipeline', 'webp-convert', 'social', 'term-seo', 'user-seo', 'primary-term', 'agent-tools', 'rankweb-dashboard', 'rankweb-widget', 'rankweb-rest', 'rankweb-ui', 'rankweb-native-admin', 'rankweb-modules', 'help-tab' ) as $file ) {
			if ( 'rank-math-schema' === $file && ! rankweb_seo_extras_rank_math() ) {
				continue; // Rank Math schema bridge is only loaded when Rank Math is active.
			}
			if ( ! in_array( $file, $off, true ) ) { // a module switched off in RankWeb → Settings is not loaded
				require_once RANKWEB_DIR . 'includes/' . $file . '.php';
			}
		}
		// A switched-off module's scheduled job is taken off (its file, which runs and reschedules it, is not loaded).
		// Checked in admin and cron requests only, so a page view never writes.
		$jobs = array(
			'health'         => 'aw_seo_endpoints_watchdog',
			'sitemap'        => 'aw_seo_sitemap_daily',
			'internal-links' => array( 'aw_link_index_build', 'aw_link_audit' ),
			'video'          => 'rankweb_video_sync',
		);
		$idle = array_intersect_key( $jobs, array_flip( $off ) );
		if ( $idle ) {
			add_action(
				'init',
				function () use ( $idle ) {
					if ( ! is_admin() && ! wp_doing_cron() ) {
						return;
					}
					foreach ( $idle as $hooks ) {
						foreach ( (array) $hooks as $hook ) {
							if ( wp_next_scheduled( $hook ) ) {
								wp_clear_scheduled_hook( $hook );
							}
						}
					}
				}
			);
		}
	},
	5
);

// Search Insights' scheduled jobs are InsightWeb's now: switching RankWeb off never stops them.
register_deactivation_hook(
	__FILE__,
	function () {
		// The SEO jobs: titles.php, health.php, sitemap.php; the Dashboard counts: rankweb-dashboard.php.
		foreach ( array( 'aw_seo_fill_daily', 'aw_seo_endpoints_watchdog', 'aw_seo_sitemap_daily', 'rankweb_health_build', 'aw_link_index_build', 'aw_link_audit', 'rankweb_video_sync', 'aw_faq_index_build' ) as $hook ) {
			wp_clear_scheduled_hook( $hook ); // repeating (no-argument) events only, as Core
		}
		wp_clear_scheduled_hook( 'rankweb_health_build', array( 'now' ) ); // A Count now that has not run yet.
		wp_clear_scheduled_hook( 'aw_link_index_build', array( 'now' ) ); // A rebuild after a Settings save.
		wp_clear_scheduled_hook( 'aw_link_audit', array( 'now' ) ); // An audit asked for and not yet run.
		wp_clear_scheduled_hook( 'aw_link_audit', array( 'more' ) ); // The next slice of a running audit.
	}
);

// More from Kits: one quiet page that lists the other Kits plugins. The WordPress.org build leaves this file out.
if ( file_exists( __DIR__ . '/includes/more-from-kits.php' ) ) {
	require_once __DIR__ . '/includes/more-from-kits.php';
}
