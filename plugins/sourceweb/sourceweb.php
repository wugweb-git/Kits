<?php
/**
 * Plugin Name: SourceWeb
 * Plugin URI:        https://wugweb-git.github.io/Kits/plugins/sourceweb/
 * Description: What the workers fetch and how it arrives, in its own SourceWeb menu: Overview, To review, Enrichment review, the settings screens (sources with their feeds and relay, keywords, rules, press queries, categories, AI models), the reports and jobs (workers, rejected items, relay log, change log) and Settings; the worker endpoints (ingest, relay, sourcing policy, relevance, same story, summaries, enrichment) and auto-review. Enhanced by Kits Core, DirectoryWeb and InsightWeb.
 * Version: 0.1.0
 * Requires at least: 7.1
 * Requires PHP: 8.0
 * Author: Wugweb
 * Author URI: https://wugweb.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: sourceweb
 * Domain Path: /languages
 *
 * Moved out of Animal Writes Core and Kits Core on 24 Oct 2026 with no change in behaviour: the same option keys,
 * REST routes, cron hooks, admin pages and actions. Core keeps the content types and templates.
 *
 * This file only defines and includes (no functions): it may be reached twice, from Core and as an active plugin.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'SOURCEWEB_VERSION' ) || define( 'SOURCEWEB_VERSION', '0.1.0' ); // keep equal to the Version header above
// Core loads this file; if it is also active on its own, the second load stops here.
if ( defined( 'SOURCEWEB_SOURCING_LOADED' ) ) {
	return;
}
define( 'SOURCEWEB_DIR', plugin_dir_path( __FILE__ ) );
define( 'SOURCEWEB_FILE', __FILE__ );
if ( ! defined( 'SOURCEWEB_SOURCING_DIR' ) ) {
	define( 'SOURCEWEB_SOURCING_DIR', SOURCEWEB_DIR );
}
if ( ! defined( 'SOURCEWEB_SOURCING_FILE' ) ) {
	define( 'SOURCEWEB_SOURCING_FILE', SOURCEWEB_FILE );
}
// Track active integrations without blocking standalone operation.
add_action(
	'plugins_loaded',
	function () {
		if ( ! defined( 'SOURCEWEB_STANDALONE' ) ) {
			define( 'SOURCEWEB_STANDALONE', ! defined( 'KITS_CORE_LOADED' ) );
		}
		if ( ! defined( 'SOURCEWEB_DIRECTORY_ACTIVE' ) ) {
			define( 'SOURCEWEB_DIRECTORY_ACTIVE', defined( 'DIRECTORYWEB_LOADED' ) );
		}
		if ( ! defined( 'SOURCEWEB_INSIGHTS_ACTIVE' ) ) {
			define( 'SOURCEWEB_INSIGHTS_ACTIVE', defined( 'INSIGHTWEB_KEYWORDS_LOADED' ) );
		}
	},
	1
);

if ( ! defined( 'MB_IN_BYTES' ) ) {
	define( 'MB_IN_BYTES', 1048576 );
}

// Keyword role bitmasks used by Sourcing (shared with InsightWeb when active).
if ( ! defined( 'SOURCEWEB_KW_ROLE_INCLUDE' ) ) {
	define( 'SOURCEWEB_KW_ROLE_INCLUDE', 1 );
	define( 'SOURCEWEB_KW_ROLE_ANIMAL', 32 );
	define( 'SOURCEWEB_KW_ROLE_CONTEXT', 64 );
	define( 'SOURCEWEB_KW_ROLE_EXCLUDE', 128 );
	define( 'SOURCEWEB_KW_ROLE_SEARCH', 256 );
	define( 'SOURCEWEB_KW_ROLE_PRESS', 512 );
	define( 'SOURCEWEB_KW_ROLE_CATEGORY', 1024 );
	define( 'SOURCEWEB_KW_SOURCING_ROLES', SOURCEWEB_KW_ROLE_INCLUDE | SOURCEWEB_KW_ROLE_ANIMAL | SOURCEWEB_KW_ROLE_CONTEXT | SOURCEWEB_KW_ROLE_EXCLUDE | SOURCEWEB_KW_ROLE_SEARCH | SOURCEWEB_KW_ROLE_CATEGORY );
	define( 'SOURCEWEB_KW_WORKER_ROLES', SOURCEWEB_KW_SOURCING_ROLES | SOURCEWEB_KW_ROLE_PRESS );
}

// The host and publisher helpers first, before the check: the site layer and other plugins call sourceweb_host() and sourceweb_publishers().
require_once __DIR__ . '/includes/sourcing-basics.php';
// The issuer label too (no dependency): the site layer's Library item box and card chips call sourceweb_issuer_short() and sourceweb_issuer_box().
require_once __DIR__ . '/includes/issuers.php';
require_once __DIR__ . '/includes/legacy-aliases.php'; // the earlier aw_* names that Kits Core, RankWeb and DirectoryWeb still call
define( 'SOURCEWEB_SOURCING_LOADED', '0.1.0' );
if ( ! defined( 'SOURCEWEB_SOURCING_DIR' ) ) {
	define( 'SOURCEWEB_SOURCING_DIR', __DIR__ . '/' );
}

// The menu's shape and the Sources model (plain functions, tested without WordPress by tests/run.php) first.
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-caps.php'; // SourceWeb's own capability, manage_sourceweb (granted from edit_others_posts)
require_once SOURCEWEB_SOURCING_DIR . 'includes/content-helpers.php'; // section lists, item tags and meta rules it used from Core (18 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/research-citation.php'; // research papers' credit: study title, authors, journal (moved from Core, 19 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/sources-config.php'; // the sourcing lists, option aw_sources (moved from Kits Core, 18 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/attribution.php'; // [aw_source_row], publisher icons and the favicon run, news slugs (moved from Kits Core, 18 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/summary-rules.php'; // the summary rules (option sourceweb_summary_rules); moved from Core 12 Nov 2026
require_once SOURCEWEB_SOURCING_DIR . 'includes/help-tab.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/plugin-info.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/menu-model.php'; // the Sourcing menu: slugs, screen id, order (admin-menu.php registers it)
require_once SOURCEWEB_SOURCING_DIR . 'includes/sources-model.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/keywords-model.php'; // phase 2: the lists in the keyword table (Core's)
require_once SOURCEWEB_SOURCING_DIR . 'includes/retire-model.php'; // phase 4: what stops being used, the policy without v1 keys
// Order matters for the Sourcing screens (Sources, Keywords, then these in this order; reports and Settings go last, menu-model.php).
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourcing-policy.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/source-sites.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/source-icons.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/cc0-images.php'; // publisher images (check, og:image, keep a copy) and the CC0 photo fetch from Openverse (moved from Core, 18 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/library-pdfs.php'; // which government PDFs we may host and the mirror that copies them (moved from Core, 18 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourcing-lists.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/summary-rules-admin.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/relevance.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/ingest.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/opportunities-site.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/auto-review.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/same-story.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/summary-rewrite.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/news-titles.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/enrichment.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/autoresolve.php'; // the review-queue rules applied when a value is queued (14 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/enrichment-cleanup.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/enrichment-admin.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/rules-model.php'; // sourcing restructure phase 3: Rules
require_once SOURCEWEB_SOURCING_DIR . 'includes/rules.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/rules-admin.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/enrichment-front.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/review-queue.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/keyword-suggestions.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/ai-keys.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/site-health.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/relay.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourcing-migrate.php'; // WP-CLI only: backup, migrate, verify, rollback
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourcing-migrate-phase2.php'; // WP-CLI only: the same for phase 2 (Keywords)
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourcing-migrate-rules.php'; // WP-CLI only: phase 3 (Rules)
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourcing-migrate-retire.php'; // WP-CLI only: phase 4 (Retire: archive, stop using the old lists)
require_once SOURCEWEB_SOURCING_DIR . 'includes/keyword-stats.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/search-insights-tab.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/workers.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/workers-tick.php'; // WP-CLI: wp aw workers-tick (hPanel cron every 15 minutes)
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourcing-terms-admin.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/keywords-admin.php'; // phase 2: Keywords on the keyword table
require_once SOURCEWEB_SOURCING_DIR . 'includes/keyword-push.php'; // receive keyword candidates pushed by InsightWeb (sourceweb_push_keywords)
require_once SOURCEWEB_SOURCING_DIR . 'includes/keyword-routing.php'; // route a pushed candidate on approval; owner auto-approve rules
// Workers you can organise and AI keys attached to workers (owner, 24 Oct 2026).
require_once SOURCEWEB_SOURCING_DIR . 'includes/workers-meta.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/workers-admin.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/ai-provider-icons.php';
// The Sourcing menu, its Overview and the Plugins screen links (owner, 25 Oct 2026).
require_once SOURCEWEB_SOURCING_DIR . 'includes/admin-menu.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/dashboard.php'; // the Dashboard box "Sourcing" (owner, 3 Nov 2026)
require_once SOURCEWEB_SOURCING_DIR . 'includes/kits-hub.php'; // a tab and a status row in the Kits admin, when Kits Core is loaded.
// The screens, on the Kits admin shell (sourceweb-ui.php), and their sourceweb/v1 routes.
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-model.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-dashboard.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-rest.php';
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-rest-pages.php'; // Sources, Keywords, Rules, Workers, Settings
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-rest-ai.php'; // AI models
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-rest-logs.php'; // Rejected, Relay log, Change log
require_once SOURCEWEB_SOURCING_DIR . 'includes/sourceweb-ui.php';
