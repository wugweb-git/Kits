<?php
/**
 * Animal Writes Directory wording (moved out of DirectoryWeb 1.3.0 unchanged): the Directory's H1 and intro line, the
 * /claim/ copy and the geocoding country.
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// H1 of a place view with no type: "Animal NGOs and Helpline Numbers in Ernakulam" or "Animal Welfare NGOs and Helpline
// Numbers in Kerala" where the place's title says so (a listing with a phone or an official number: filter
// directoryweb_place_has_helpline, answered by RankWeb; 18 Nov 2026, option B), with the title's fallback "Animal Helpline
// Numbers in …" where that form passes 60 characters; else "Animal NGOs in Ernakulam" or "Animal Welfare NGOs in Kerala".
add_filter(
	'directoryweb_directory_h1',
	function ( $h1, $city, $tname ) {
		if ( $tname || ! $city ) {
			return $h1;
		}
		if ( apply_filters( 'directoryweb_place_has_helpline', false, $city ) ) { // RankWeb answers
			// Same fallback as the page-1 title (rankweb_seo_fit, 60): "Animal Helpline Numbers in …" where the NGO form is too long.
			$ngo = $city->parent ? 'Animal NGOs and Helpline Numbers in ' : 'Animal Welfare NGOs and Helpline Numbers in ';
			return ( mb_strlen( $ngo . $city->name ) <= 60 ? $ngo : 'Animal Helpline Numbers in ' ) . $city->name;
		}
		return ( $city->parent ? 'Animal NGOs in ' : 'Animal Welfare NGOs in ' ) . $city->name;
	},
	10,
	3
);

// The Directory's intro line for the current view: hub, "… in {State}." or "… in {District}, {State}." (copy of 8 Oct 2026).
// On place pages the meta and share description come from rankweb_seo_dir_description() (RankWeb), not from this line.
add_filter(
	'directoryweb_directory_intro',
	function ( $line, $city ) {
		if ( ! $city ) {
			return 'Animal welfare organisations, Gaushalas and government vets across India.';
		}
		if ( $city->parent ) {
			$state = directoryweb_place_parent_state( $city );
			return sprintf( 'Animal NGOs, shelters, Gaushalas and government vets in %1$s, %2$s, with phone numbers where they have one.', $city->name, $state->name );
		}
		return sprintf( 'Animal NGOs, shelters, Gaushalas and government vets in %s, with phone numbers where they have one.', $city->name );
	},
	10,
	2
);

add_filter(
	'directoryweb_archive_place_title',
	fn( $t, $city ) => sprintf( 'Animal welfare directory: %s', $city->name ),
	10,
	2
);

// /claim/
add_filter(
	'directoryweb_claim_copy',
	function ( $copy ) {
		return array_merge(
			$copy,
			array(
				'hero_desc'    => 'Search by organisation name, shelter, veterinary clinic, or trust to take ownership of your listing.',
				'placeholder'  => 'e.g. Friendicoes, CUPA, Sanjay Gandhi Animal Care...',
				'benefits'     => array(
					array( 'icon' => 'phone', 'title' => 'Direct Emergency Helpline', 'text' => 'Ensure citizens in distress can reach your active emergency phone and WhatsApp numbers without delay.' ),
					array( 'icon' => 'check', 'title' => 'Verified Organisation Mark', 'text' => 'Establish trust with donors, volunteers, and local authorities through a verified organisation badge.' ),
					array( 'icon' => 'sliders', 'title' => 'Complete Profile Control', 'text' => 'Manage your services, animal categories helped, operating hours, official logo, and website links.' ),
				),
				'missing_text' => 'If your shelter, clinic, or animal NGO does not appear in search results, submit a request to create a new directory listing.',
			)
		);
	}
);

// Geocoding: India (the country, the PIN code, the AWBI address and the Indian address words).
add_filter(
	'directoryweb_geocode_profile',
	function ( $p ) {
		return array_merge(
			$p,
			array(
				'country'          => 'India',
				'address_keys'     => array( 'aw_address', 'aw_awbi_address', 'aw_import_address' ),
				'postcode_field'   => '/^[1-9]\d{5}$/',
				'postcode_in_text' => '/\b([1-9]\d{2})\s?(\d{3})\b/',
				'postcode_strip'   => '/\b[1-9]\d{2}\s?\d{3}\b/',
				'noise'            => array( 'p\.?\s?o\.?', 'post', 'tehsil', 'teh\.?', 'tel\.?', 'tq\.?', 'taluk', 'taluka', 'mandal', 'block', 'dist\.?', 'district', 'via', 'near', 'opp\.?' ),
			)
		);
	}
);
