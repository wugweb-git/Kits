<?php
/**
 * InsightWeb's bootstrap: Search Insights (owner, 24 Oct 2026; plan in docs/org/insightweb-org-plan.md). One record
 * per keyword, with its roles, owning pages, Search Console figures by day, priority and a suggested action. Read-only
 * data and suggestions: nothing here edits Rank Math keyphrases or the Sourcing lists.
 *
 * Moved out of RankWeb on 11 Nov 2026 with no other change (docs/plugins/insightweb-plan.md). Called on plugins_loaded by
 * insightweb.php, or by RankWeb's bridge while InsightWeb is not active yet; whichever calls first loads it, once.
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( defined( 'INSIGHTWEB_LOADED' ) ) {
	return; // Already loaded on this request (InsightWeb or RankWeb's bridge, whichever came first).
}
define( 'INSIGHTWEB_LOADED', true );
if ( ! defined( 'INSIGHTWEB_DIR' ) ) {
	define( 'INSIGHTWEB_DIR', dirname( __DIR__ ) . '/' );
}

// The keyword table and its rules are InsightWeb's (moved from Kits Core, 18 Nov 2026). Loaded before the checks
// below: SourceWeb uses them even when Search Insights is off.
require_once INSIGHTWEB_DIR . 'includes/keywords.php';

// Standalone support: load fallback if Kits Core is not active.
if ( ! defined( 'KITS_CORE_LOADED' ) ) {
	require_once INSIGHTWEB_DIR . 'includes/standalone-fallback.php';
}

define( 'INSIGHTWEB_STANDALONE', ! defined( 'KITS_CORE_LOADED' ) );
define( 'INSIGHTWEB_RANKMATH_ACTIVE', ( defined( 'RANK_MATH_VERSION' ) && class_exists( '\RankMath\Helper' ) ) );

if ( ! function_exists( 'insightweb_caps_grant' ) ) { // Loaded by insightweb.php; here for RankWeb's bridge.
	require_once INSIGHTWEB_DIR . 'includes/insightweb-caps.php';
}
require_once INSIGHTWEB_DIR . 'includes/settings.php'; // the seven numbers (constants) and the API rule, first
require_once INSIGHTWEB_DIR . 'includes/insightweb-keys.php'; // InsightWeb's own service keys (Settings → Keys), before anything reads one

foreach ( array( 'schema', 'runs', 'sitekit', 'keywords', 'gsc', 'compute', 'score', 'sourcing-push', 'rollup', 'cron', 'health', 'searches', 'dryrun', 'admin-table', 'rising', 'admin', 'cli' ) as $aw_si_file ) {
	require_once __DIR__ . '/search-insights/' . $aw_si_file . '.php';
}
// Phase 2: GA4, PageSpeed, Clarity, searches on the site, the Pages tab, redirects counted as their target.
// Phase 4: the Check list tab with the bookmarklet live check, and the imports on the Settings tab.
// Phase 5: the monthly snapshot CSV and the rebuilt keyword map. Rank Math: SEO scores, and its Search Console rows as a backup.
// Links (31 Oct 2026): who links to us, the Bing Webmaster monthly run and the links seed.
// Crawler access (31 Oct 2026): weekly checks from the server and from outside (workers), in Site Health.
// Server (3 Nov 2026): crawler requests, 4xx/5xx answers and PHP errors per day, and the hPanel numbers typed by hand.
// Dashboard (3 Nov 2026): the SEO box on the WordPress Dashboard, from the stored rows.
// Referrer icons (3 Nov 2026): site icons beside the referring sources on the Overview.
// Search Console types (3 Nov 2026): Discover and Google News per page, and URL Inspection index status.
// Bing crawl (3 Nov 2026): Bing's crawl statistics weekly and keyword volumes monthly.
// Google Alerts (3 Nov 2026): up to two alert feeds from Settings → Keys, as Mention rows on the Links tab.
foreach ( array( 'sitesearch', 'ga4', 'psi', 'clarity', 'bing', 'sources', 'pages', 'checklist', 'imports', 'snapshot', 'rankmath', 'links', 'links-seed', 'crawlcheck', 'server', 'visitors', 'selfcheck', 'dashboard', 'referrer-icons', 'gsc-types', 'bing-crawl', 'alerts', 'report-email', 'tool-imports', 'openseo-positions' ) as $aw_si_file ) {
	require_once __DIR__ . '/search-insights/' . $aw_si_file . '.php';
}
unset( $aw_si_file );
// 404 and search logging is on HOLD (not loaded). Version 1.1.2 loaded it by mistake: remove what it stored (raw 404 paths and visitor search terms), once.
add_action(
	'admin_init',
	function () {
		if ( get_option( 'insightweb_held_logs_removed' ) ) {
			return;
		}
		delete_option( 'insightweb_404_log' );
		delete_option( 'insightweb_internal_searches' );
		update_option( 'insightweb_held_logs_removed', 1, false );
	}
);

// The screens on the Kits admin shell: Dashboard, the tabs and Settings.
require_once INSIGHTWEB_DIR . 'includes/insightweb-dashboard.php';
require_once INSIGHTWEB_DIR . 'includes/legacy-aliases.php'; // the earlier aw_si_* names that Kits Core, RankWeb and DirectoryWeb still call
require_once INSIGHTWEB_DIR . 'includes/insightweb-rest.php';
require_once INSIGHTWEB_DIR . 'includes/help-tab.php';
require_once INSIGHTWEB_DIR . 'includes/insightweb-boxes.php'; // the Overview boxes on the Dashboard
require_once INSIGHTWEB_DIR . 'includes/insightweb-tabs.php'; // the other tabs on the shell
require_once INSIGHTWEB_DIR . 'includes/insightweb-ui.php';
