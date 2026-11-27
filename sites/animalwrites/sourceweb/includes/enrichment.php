<?php
/**
 * Animal Writes Directory enrichment sources, moved out of SourceWeb 0.4.0 (second pass, 0.4.1): the AWBI register and
 * NGO Darpan, their fields, the AWBI-only queue group and the Darpan duplicate check. SourceWeb keeps the generic
 * enrichment (the sources, fields and rules every site has); this file adds the Animal Writes ones through its filters:
 * sourceweb_enrich_sources, sourceweb_enrich_fields, sourceweb_enrich_claim_fields, sourceweb_enrich_listing_payload,
 * sourceweb_enrich_queue_steps, sourceweb_enrich_index_item, sourceweb_enrich_cleanup_item and
 * sourceweb_enrich_duplicate_keys. The stored keys (aw_awbi_*, aw_darpan_id, the source keys awbi and darpan) do not change.
 *
 * @package animalwrites-sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The sources, in the order they had in the plugin (trust order lives in the field rules, not here).
add_filter(
	'sourceweb_enrich_sources',
	function ( $sources ) {
		$sources = (array) $sources;
		$out     = array();
		foreach ( $sources as $key => $row ) {
			if ( 'osm' === $key ) { // Darpan sat between social and OpenStreetMap.
				$out['darpan'] = array( 'NGO Darpan', 'ngodarpan.gov.in', true, 'Legal details (only where the page can be read without a CAPTCHA)' );
			}
			if ( 'listing' === $key ) { // AWBI sat after Wikidata, before the listing's own details.
				$out['awbi'] = array( 'AWBI', 'awbi.gov.in', true, 'The AWBI address already on the listing' );
			}
			$out[ $key ] = $row;
		}
		return $out + array_diff_key(
			array(
				'darpan' => array( 'NGO Darpan', 'ngodarpan.gov.in', true, 'Legal details (only where the page can be read without a CAPTCHA)' ),
				'awbi'   => array( 'AWBI', 'awbi.gov.in', true, 'The AWBI address already on the listing' ),
			),
			$out
		);
	}
);

// The field NGO Darpan fills.
add_filter(
	'sourceweb_enrich_fields',
	function ( $fields ) {
		$fields = (array) $fields;
		$out    = array();
		foreach ( $fields as $key => $row ) {
			$out[ $key ] = $row;
			if ( 'registration' === $key ) {
				$out['darpan_id'] = array( 'NGO Darpan ID', 'aw_darpan_id', 'Legal' );
			}
		}
		return isset( $out['darpan_id'] ) ? $out : $out + array( 'darpan_id' => array( 'NGO Darpan ID', 'aw_darpan_id', 'Legal' ) );
	}
);

// The AWBI register's details, written only by an approved claim.
add_filter(
	'sourceweb_enrich_claim_fields',
	function ( $fields ) {
		return (array) $fields + array(
			'awbi_code'       => array( 'AWBI code', 'aw_awbi_code', 'Legal' ),
			'awbi_recognised' => array( 'AWBI recognised on', 'aw_awbi_recognised', 'Legal' ),
			'awbi_renewed'    => array( 'AWBI renewed on', 'aw_awbi_renewed', 'Legal' ),
			'awbi_valid'      => array( 'AWBI valid until', 'aw_awbi_valid', 'Legal' ),
		);
	}
);

// What the workers get with each listing: its AWBI code and address.
add_filter(
	'sourceweb_enrich_listing_payload',
	function ( $payload, $id ) {
		$payload                 = (array) $payload;
		$payload['awbi_code']    = (string) get_post_meta( (int) $id, 'aw_awbi_code', true );
		$payload['awbi_address'] = (string) get_post_meta( (int) $id, 'aw_awbi_address', true );
		return $payload;
	},
	10,
	2
);

// The queue: never-checked AWBI listings with no phone, email or website go right after the listings with no way to
// reach them; group=awbi-bare asks for those alone.
add_filter(
	'sourceweb_enrich_queue_steps',
	function ( $steps, $group, $ctx ) {
		$m    = (string) ( $ctx['m'] ?? '' );
		$bare = "EXISTS (SELECT 1 FROM {$m} a WHERE a.post_id = p.ID AND a.meta_key = 'aw_awbi_code' AND a.meta_value <> '') AND NOT EXISTS (SELECT 1 FROM {$m} x WHERE x.post_id = p.ID AND x.meta_key IN ('aw_email','aw_website') AND x.meta_value <> '') AND NOT EXISTS (SELECT 1 FROM {$m} x WHERE x.post_id = p.ID AND x.meta_key = 'aw_phones' AND x.meta_value > 0)";
		if ( 'awbi-bare' === $group ) {
			return array( "c.meta_value IS NULL AND {$bare}" );
		}
		$steps = array_values( (array) $steps );
		array_splice( $steps, 3, 0, array( "c.meta_value IS NULL AND {$bare}" ) ); // after: new, claimed, no way to reach
		return $steps;
	},
	10,
	3
);

// The state index (matching an NGO Darpan CSV to listings) carries each listing's Darpan ID.
add_filter(
	'sourceweb_enrich_index_item',
	function ( $item, $id ) {
		$item              = (array) $item;
		$item['darpan_id'] = (string) get_post_meta( (int) $id, 'aw_darpan_id', true );
		return $item;
	},
	10,
	2
);

// The clean-up export carries the AWBI address and code and the Darpan ID.
add_filter(
	'sourceweb_enrich_cleanup_item',
	function ( $item, $id ) {
		$item                 = (array) $item;
		$item['awbi_address'] = (string) get_post_meta( (int) $id, 'aw_awbi_address', true );
		$item['awbi_code']    = (string) get_post_meta( (int) $id, 'aw_awbi_code', true );
		$item['darpan_id']    = (string) get_post_meta( (int) $id, 'aw_darpan_id', true );
		return $item;
	},
	10,
	2
);

// Two listings with the same NGO Darpan ID are a possible duplicate (flagged, never merged).
add_filter(
	'sourceweb_enrich_duplicate_keys',
	function ( $keys ) {
		return (array) $keys + array( 'darpan_id' => 'aw_darpan_id' );
	}
);
