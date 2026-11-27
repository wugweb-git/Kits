<?php
/**
 * Animal Writes site layer for DirectoryWeb 1.4.0 and later (1.3.0 for the first part). DirectoryWeb is a generic directory; everything that is only
 * for the Animal Writes site lives here, unchanged: the wording, the India PIN lookup and bounds, the Find help block and
 * its links, the district helpline cards, the small-district local card, the veterinary type filter and the services list,
 * government-list Verified, the Featured in lists, the data sources, the Directory titles and intros, the claim page
 * copy, the India geocoding, and (1.4.0) the registration fields (AWBI, 12A, 80G, FCRA, NGO Darpan) and the India places data. Not part of the plugin zip: it must be deployed alongside DirectoryWeb 1.4.0 (see ../README.md).
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter(
	'directoryweb_labels',
	function ( $labels ) {
		return array_merge(
			(array) $labels,
			array(
				'animals'          => 'Animals helped',
				'animals_help'     => 'Comma separated, e.g. dogs, cats, cattle, birds',
				'category_example' => 'Animal shelter',
			)
		);
	}
);

// The India and animal welfare registration fields (AWBI, 12A, 80G, FCRA, NGO Darpan), their wording and the places data are in
// includes/registrations.php; the plugin (1.4.0) carries none of them.
add_filter( 'directoryweb_pin_lookup_enabled', '__return_true' );

// "Near me" stays inside India (min latitude, max latitude, min longitude, max longitude).
add_filter(
	'directoryweb_near_bounds',
	function () {
		return array( 6.0, 37.5, 68.0, 98.0 );
	}
);

// The Animal Writes features and data, loaded once every plugin is (they use DirectoryWeb's functions when they run).
add_action(
	'plugins_loaded',
	function () {
		if ( ! defined( 'DIRECTORYWEB_LOADED' ) ) {
			return; // DirectoryWeb is not active: nothing to extend.
		}
		foreach ( array( 'registrations', 'types', 'copy', 'sources', 'pin-lookup', 'local-cards', 'district-helplines', 'find-help', 'directoryweb-local-card', 'directoryweb-helplines', 'directoryweb-find-help', 'gov-verified', 'featured' ) as $directoryweb_aw_file ) {
			require_once __DIR__ . '/includes/' . $directoryweb_aw_file . '.php';
		}
	},
	5
);

/** Animal Writes' claim form also holds the AWBI dates (moved from Kits Core's KITS_FF_DATES in Kits Core 1.4.1). */
add_filter( 'directoryweb_ff_dates', static fn( $d ) => array_values( array_unique( array_merge( (array) $d, array( 'l_awbi_rec', 'l_awbi_ren', 'l_awbi_valid' ) ) ) ) );
