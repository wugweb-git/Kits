<?php
/**
 * Animal Writes site layer for DirectoryWeb 1.2.3 and later: restores the wording, the India PIN lookup and the India
 * bounds that the plugin no longer assumes for every site. Install like the RankWeb layer (see ../README.md).
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
				'animals'     => 'Animals helped',
				'awbi_number' => 'AWBI number',
			)
		);
	}
);

add_filter( 'directoryweb_pin_lookup_enabled', '__return_true' );

// "Near me" stays inside India (min latitude, max latitude, min longitude, max longitude).
add_filter(
	'directoryweb_near_bounds',
	function () {
		return array( 6.0, 37.5, 68.0, 98.0 );
	}
);
