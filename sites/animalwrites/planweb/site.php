<?php
/**
 * Animal Writes site layer for PlanWeb. Load as a must-use plugin (wp-content/mu-plugins/). It is not part of any
 * distributed package: it holds what belongs to this one site, which PlanWeb used to carry. Needs PlanWeb 0.5.0.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The team's Dates calendar (Kits → Dates), aw_team_dates() and the seeded and campaign dates, moved here unchanged.
require_once __DIR__ . '/team-dates.php';

// The one-time 14 Nov 2026 move of Animal Writes entries (channels in titles, seven reminders to Done), moved here unchanged.
require_once __DIR__ . '/migrate.php';

// The earlier Dates list PlanWeb imports from once it is on (option aw_team_dates). The source value is the one stored on
// entries already imported, so the one-for-one check keeps matching them. The import waits for the 11 Nov note rename.
add_filter(
	'planweb_import_source',
	function () {
		return array(
			'option' => 'aw_team_dates',
			'source' => 'aw_team_dates',
			'wait'   => 'aw_team_dates_links_note_1111',
		);
	}
);

// News and Directory are imported in bulk (hundreds a month): off in the site schedule until ticked.
add_filter(
	'planweb_site_skip_types',
	function () {
		return array( 'aw_news', 'aw_listing' );
	}
);
