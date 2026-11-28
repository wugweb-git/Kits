<?php
/**
 * Animal Writes site layer for SourceWeb 0.4.1. Not part of the plugin zip. Deploy it alongside SourceWeb 0.4.1 (see
 * README.md): it restores, through SourceWeb's filters and actions, what the plugin carried for this one site.
 *
 * Loaded as a must-use plugin: copy this folder to wp-content/mu-plugins/animalwrites-sourceweb/ and add the one-line
 * loader wp-content/mu-plugins/animalwrites-sourceweb.php containing
 * `<?php require __DIR__ . '/animalwrites-sourceweb/site.php';`
 *
 * @package animalwrites-sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ANIMALWRITES_SOURCEWEB_DIR', __DIR__ . '/' );

require_once __DIR__ . '/config-names.php'; // earlier wp-config.php names -> SourceWeb's own constants (before the plugin loads).

// The services a listing can offer, slug => name, from this site's list (Animal Writes Core's, when it is loaded).
add_filter(
	'sourceweb_enrich_services',
	function ( $services ) {
		return defined( 'AW_SERVICES' ) && is_array( AW_SERVICES ) ? AW_SERVICES : $services;
	}
);

// Filters and actions only: safe to load before SourceWeb itself.

// Which content type plays which role. SourceWeb names no site's post types: it asks for a role (news, library, campaign,
// opportunity, listing, press, social) and this map answers. The listing type also comes from DirectoryWeb's own
// directoryweb_post_type() when that plugin is active, which wins.
add_filter(
	'sourceweb_post_type_roles',
	function ( $map ) {
		return (array) $map + array(
			'news'        => 'aw_news',
			'library'     => 'aw_legal',
			'campaign'    => 'aw_campaign',
			'opportunity' => 'aw_opportunity',
			'listing'     => 'aw_listing',
			'press'       => 'aw_press',
			'social'      => 'aw_social',
		);
	}
);

require_once __DIR__ . '/includes/seeds.php';
require_once __DIR__ . '/includes/alerts.php';
require_once __DIR__ . '/includes/enrichment.php'; // the AWBI and NGO Darpan enrichment sources and fields
require_once __DIR__ . '/includes/not-news-rules.php'; // job vacancies are not news

// Everything below calls SourceWeb's functions, so it waits until the plugins are loaded. Nothing runs if SourceWeb is
// not active.
add_action(
	'plugins_loaded',
	function () {
		if ( ! defined( 'SOURCEWEB_SOURCING_DIR' ) || ! function_exists( 'sourceweb_sources_config' ) ) {
			return;
		}
		require_once __DIR__ . '/includes/dashboard-box.php';
		require_once __DIR__ . '/includes/kits-hub.php'; // a status row and the options Kits → Tools transfers, when Kits Core is loaded
		require_once __DIR__ . '/includes/lifecycle/sourcing-migrate.php'; // WP-CLI only: backup, migrate, verify, rollback (phase 1)
		require_once __DIR__ . '/includes/lifecycle/sourcing-migrate-phase2.php'; // phase 2 (Keywords)
		require_once __DIR__ . '/includes/lifecycle/sourcing-migrate-rules.php'; // phase 3 (Rules)
		require_once __DIR__ . '/includes/lifecycle/sourcing-migrate-retire.php'; // phase 4 (Retire)
	},
	15
);
