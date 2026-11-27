<?php
/**
 * Animal Writes site layer for RankWeb 2.4.0: the listing, hub and wording rules RankWeb 2.3.7 carried for this one site,
 * moved here unchanged and fed back through RankWeb's filters (rankweb_listing_schema_types, rankweb_listing_schema_node,
 * rankweb_listing_description, rankweb_hubs, rankweb_wording, rankweb_filtered_place_title_words, rankweb_faq_all_url,
 * rankweb_country_code). Loaded by site.php.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The section hubs of Animal Writes Core (AW_HUBS: type => [page slug, ..., items per page]).
add_filter( 'rankweb_hubs', fn( $hubs ) => defined( 'AW_HUBS' ) ? (array) AW_HUBS : $hubs );

add_filter( 'rankweb_country_code', fn() => 'IN' );
add_filter( 'rankweb_faq_all_url', fn() => get_page_by_path( 'resources/animal-welfare-faqs' ) instanceof WP_Post ? home_url( '/resources/animal-welfare-faqs/' ) : '' );

// The words the Directory's titles and descriptions use before their nouns ("Animal NGOs and Helpline Numbers in ...").
add_filter(
	'rankweb_wording',
	function ( $text, $key ) {
		$words = array(
			'dir_adjective'      => 'Animal ',
			'dir_adjective_long' => 'Animal Welfare ',
		);
		return $words[ $key ] ?? $text;
	},
	10,
	2
);

// Title shapes of a ?state= or ?publisher= view (RankWeb 2.3.7: AW_FILTERED_PLACE_TITLE_WORDS).
add_filter(
	'rankweb_filtered_place_title_words',
	fn() => array(
		'state'     => array(
			'aw_news'        => array( 'Animal Welfare News from %s', '%s Animal Welfare News', '%s News' ),
			'aw_legal'       => array( 'Animal Laws and Court Orders in %s', 'Animal Laws in %s', '%s Animal Laws' ),
			'aw_opportunity' => array( 'Animal Welfare Volunteer Roles and Jobs in %s', 'Animal Welfare Opportunities in %s', '%s Opportunities' ),
		),
		'publisher' => array(
			'aw_news' => array( 'Animal Welfare News from %s', '%s Animal Welfare News', '%s News' ),
		),
	)
);

// schema.org types of a listing by its listing types (RankWeb 2.3.7: rankweb_listing_schema()).
add_filter(
	'rankweb_listing_schema_types',
	function ( $stype, $id ) {
		$map   = array(
			'VeterinaryCare'         => array( 'veterinary-hospital', 'veterinary-clinic', 'veterinary-dispensary', 'bird-hospital', 'mobile-veterinary-unit' ),
			'AnimalShelter'          => array( 'animal-shelter', 'gaushala', 'sanctuary' ),
			'GovernmentOffice'       => array( 'veterinary-office', 'mobile-veterinary-unit' ), // a government office the public visits
		);
		$stype = array();
		foreach ( $map as $t => $slugs ) {
			if ( has_term( $slugs, 'post_tag', $id ) ) {
				$stype[] = $t;
			}
		}
		$srcs = function_exists( 'directoryweb_listing_sources' ) ? wp_list_pluck( directoryweb_listing_sources( $id ), 0 ) : array();
		if ( in_array( 'VeterinaryCare', $stype, true ) && ! in_array( 'GovernmentOffice', $stype, true ) && array_intersect( array( 'gov', 'gujforest' ), $srcs ) ) {
			$stype[] = 'GovernmentOffice'; // a government vet (from a government list)
		}
		if ( has_term( 'legal-aid', 'post_tag', $id ) && in_array( 'nalsa', $srcs, true ) ) {
			$stype[] = 'GovernmentOffice'; // a District Legal Services Authority: a government office, not an NGO
		}
		$ngo = array( 'animal-welfare-organisation', 'abc-centre', 'rescue-group', 'adoption-network', 'feeder-network', 'emergency-rescue', 'wildlife-rescue', 'animal-ambulance' );
		if ( ! in_array( 'nalsa', $srcs, true ) ) {
			$ngo[] = 'legal-aid';
		}
		if ( ! $stype || has_term( $ngo, 'post_tag', $id ) ) {
			array_unshift( $stype, 'NGO' );
		}
		return array_values( array_unique( $stype ) );
	},
	10,
	2
);

// The AWBI recognition code as the listing's first identifier (RankWeb 2.3.7: rankweb_listing_schema()).
add_filter(
	'rankweb_listing_schema_node',
	function ( $org, $id ) {
		$m    = fn( $k ) => trim( (string) get_post_meta( $id, $k, true ) );
		$code = $m( 'aw_awbi_code' );
		if ( $code ) {
			$org['identifier'] = array( '@type' => 'PropertyValue', 'propertyID' => 'AWBI recognition code', 'value' => $code );
			if ( $m( 'aw_awbi_dropped' ) ) { // on an older AWBI list only
				$org['identifier']['description'] = 'Not on the AWBI list of ' . wp_date( 'j M Y', strtotime( $m( 'aw_awbi_dropped' ) ) ) . '; recognition may have lapsed';
			}
		}
		return $org;
	},
	10,
	2
);

/** AWBI-recognised listing without a description of its own: one line of its facts ('' when it does not apply). */
function awsite_awbi_description( $id, $desc ) {
	$code = trim( (string) get_post_meta( $id, 'aw_awbi_code', true ) );
	if ( '' === $code || get_post_meta( $id, 'aw_awbi_dropped', true ) || has_excerpt( $id ) || ( '' !== trim( (string) $desc ) && ! preg_match( '/^Recognised by the Animal Welfare Board of India/i', trim( wp_strip_all_tags( (string) $desc ) ) ) ) ) {
		return '';
	}
	$types = function_exists( 'directoryweb_listing_types' ) ? directoryweb_listing_types( $id ) : array();
	if ( $types && count( $types ) > 1 ) { // the specific type (gaushala) before the general one
		usort( $types, fn( $a, $b ) => (int) ( 'animal-welfare-organisation' === $a->slug ) - (int) ( 'animal-welfare-organisation' === $b->slug ) );
	}
	$type  = $types ? implode( ' ', array_map( fn( $w ) => preg_match( '/^[A-Z]{2,}$/', $w ) || 0 === stripos( $w, 'gaushala' ) ? ucfirst( $w ) : mb_strtolower( $w ), explode( ' ', trim( preg_replace( '/\s*\(.*?\)/', '', $types[0]->name ) ) ) ) ) : 'organisation';
	list( $state, $district ) = rankweb_seo_item_place_names( $id );
	$where = implode( ', ', array_unique( array_filter( array( $district, $state ) ) ) ); // Chandigarh, Delhi: the district and state share a name
	$name  = preg_replace( '/[\s,;:]+$/u', '', rankweb_plain_text( get_post_field( 'post_title', $id ) ) );
	$line  = sprintf( '%1$s is an AWBI-recognised %2$s%3$s (AWBI code %4$s).', $name, $type, $where ? ' in ' . $where : '', $code );
	return mb_strlen( $line ) <= 120 ? $line . ' Address, contact and how to help.' : $line; // whole sentences only
}

add_filter(
	'rankweb_listing_description',
	function ( $desc, $id ) {
		$awbi = awsite_awbi_description( $id, $desc );
		return '' !== $awbi ? $awbi : $desc;
	},
	10,
	2
);

/** India's registers a listing states, as identifiers in its schema (RankWeb names only the general registration number). */
add_filter(
	'rankweb_listing_identifier_fields',
	fn( $fields ) => array_merge( (array) $fields, array( 'aw_reg_12a' => '12A', 'aw_reg_80g' => '80G', 'aw_fcra' => 'FCRA', 'aw_darpan_id' => 'NGO Darpan ID' ) )
);

/** Stored identifier fields kept out of the analyzer's word and keyword counts (they used to be in RankWeb's own list). */
add_filter(
	'rankweb_analysis_excluded_fields',
	fn( $names ) => array_merge( (array) $names, array( 'aw_reg_12a', 'aw_reg_80g', 'aw_darpan_id', 'aw_awbi_code', 'aw_ngobase_url' ) )
);
