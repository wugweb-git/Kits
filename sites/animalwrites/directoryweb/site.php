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
				'animals'               => 'Animals helped',
				'animals_help'          => 'Comma separated, e.g. dogs, cats, cattle, birds',
				'awbi_number'           => 'AWBI number',
				'awbi_not_on_list'      => 'Not on the current AWBI list',
				'awbi_code'             => 'AWBI code',
				'awbi_recognised'       => 'AWBI recognised on',
				'awbi_renewed'          => 'AWBI renewed on',
				'awbi_valid'            => 'AWBI valid until',
				'registry_id'           => 'NGO Darpan ID',
				'registry_name'         => 'NGO Darpan',
				'accreditor'            => 'AWBI',
				'accreditor_list'       => 'AWBI list',
				'accreditor_first_list' => '31 May 2026 list',
				'tax_12a'               => '12A',
				'tax_12a_help'          => '12A registration number',
				'tax_80g'               => '80G',
				'tax_80g_help'          => '80G registration number',
				'foreign_funding'       => 'FCRA',
				'category_example'      => 'Animal shelter',
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
