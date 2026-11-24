<?php
/**
 * Animal Writes compatibility: the site values RankWeb used to assume, given back to the Animal Writes site only.
 *
 * Loaded by rankweb.php when Animal Writes Core is active. Every other site gets RankWeb's generic defaults
 * (standalone-seo.php: rankweb_site_default()). A site can change any of these under RankWeb → Settings or with the
 * `rankweb_site_default_*` filters; nothing here is stored.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$rankweb_aw_defaults = array(
	'alt_names'    => array( 'AnimalWrites', 'Animal Writes India', 'animalwrites.in' ), // people search the brand under several names (12 Nov 2026)
	'same_as'      => array( 'https://www.facebook.com/profile.php?id=61596537146561', 'https://www.instagram.com/animal_writes_/', 'https://x.com/animal_writes_', 'https://www.linkedin.com/company/animalwrites/', 'https://www.threads.com/@animal_writes_' ),
	'email'        => 'contact@animalwrites.in',
	'language'     => 'en-IN',
	'country'      => 'IN',
	'country_name' => 'India',
	'languages'    => array( 'en', 'hi' ),
	'founded'      => '2025-11', // the first campaign (November 2025)
);
foreach ( $rankweb_aw_defaults as $rankweb_aw_key => $rankweb_aw_value ) {
	add_filter( 'rankweb_site_default_' . $rankweb_aw_key, fn() => $rankweb_aw_value );
}
unset( $rankweb_aw_defaults, $rankweb_aw_key, $rankweb_aw_value );
