<?php
/**
 * Animal Writes: the India and animal welfare registration fields that DirectoryWeb 1.4.0 no longer carries. AWBI recognition
 * (code, dates, the lapsed mark), NGO Darpan (ID, blacklist, authority, Act, sectors), 12A, 80G and FCRA. The stored meta
 * keys are unchanged (aw_awbi_*, aw_darpan_*, aw_reg_12a, aw_reg_80g, aw_fcra, aw_reg_authority, aw_reg_act, aw_sectors).
 * Everything is added through DirectoryWeb's filters; DirectoryWeb alone has the one neutral registration number.
 *
 * Also here: the field group for the editor (acf-json/group_aw_listing_registrations_in.json), the places file (data/lgd.json,
 * the Local Government Directory) and the district centres (data/district-centroids.json).
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The words of these fields: the exact wording the live site had. */
const AW_DIRECTORYWEB_REG_LABELS = array(
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
);

/**
 * One of this layer's labels.
 *
 * @param string $key A key of AW_DIRECTORYWEB_REG_LABELS.
 * @return string
 */
function aw_directoryweb_label( string $key ): string {
	return AW_DIRECTORYWEB_REG_LABELS[ $key ] ?? $key;
}

/**
 * An array with new entries put right after one key (at the end when the key is not there).
 *
 * @param array  $list  Array.
 * @param string $after Key to follow.
 * @param array  $new   Entries to add.
 * @return array
 */
function aw_directoryweb_insert_after( array $list, string $after, array $new ): array {
	if ( ! array_key_exists( $after, $list ) ) {
		return array_merge( $list, $new );
	}
	$out = array();
	foreach ( $list as $k => $v ) {
		$out[ $k ] = $v;
		if ( $k === $after ) {
			$out = array_merge( $out, $new );
		}
	}
	return $out;
}

// The meta fields (Schema & Fields lists them): AWBI, 12A, 80G, NGO Darpan.
add_filter(
	'directoryweb_meta_fields',
	function ( $fields ) {
		$acc  = aw_directoryweb_label( 'accreditor' );
		$list = aw_directoryweb_label( 'accreditor_list' );
		$reg  = aw_directoryweb_label( 'registry_name' );
		$fields = (array) $fields;
		$fields = aw_directoryweb_insert_after(
			$fields,
			'verified_on',
			array(
				'awbi_recognised' => array( 'string', $acc . ' recognised on (Y-m-d)' ),
				'awbi_renewed'    => array( 'string', $acc . ' renewed on (Y-m-d)' ),
				'awbi_valid'      => array( 'string', $acc . ' recognition valid until (Y-m-d)' ),
				'awbi_code'       => array( 'string', $acc . ' recognition code (from the ' . $list . '; read only)' ),
				'awbi_dropped'    => array( 'string', 'Date of the current ' . $list . ' the code is missing from (Y-m-d): recognition may have lapsed' ),
				'awbi_list_on'    => array( 'string', 'Date of the ' . $list . ' the code comes from (Y-m-d; empty = ' . aw_directoryweb_label( 'accreditor_first_list' ) . ')' ),
			)
		);
		$fields = aw_directoryweb_insert_after(
			$fields,
			'registration',
			array(
				'reg_12a'               => array( 'string', aw_directoryweb_label( 'tax_12a_help' ) ),
				'reg_80g'               => array( 'string', aw_directoryweb_label( 'tax_80g_help' ) ),
				'darpan_id'             => array( 'string', aw_directoryweb_label( 'registry_id' ) ),
				'darpan_blacklisted_by' => array( 'string', 'Blacklisted on ' . $reg . ' by (as ' . $reg . ' lists it)' ),
				'darpan_blacklisted_on' => array( 'string', 'Blacklisted on ' . $reg . ' from (Y-m-d)' ),
				'reg_authority'         => array( 'string', 'Registration authority (from ' . $reg . '; admin only)' ),
				'reg_act'               => array( 'string', 'Registered under (Act; from ' . $reg . '; admin only)' ),
			)
		);
		$fields['reg_date'] = array( 'string', 'Registration date (Y-m-d; from ' . $reg . '; admin only)' );
		return aw_directoryweb_insert_after( $fields, 'reg_date', array( 'sectors' => array( 'string', 'Sectors of work as ' . $reg . ' lists them (comma separated; admin only)' ) ) );
	}
);

add_filter(
	'directoryweb_date_meta_names',
	fn( $names ) => array_merge( (array) $names, array( 'awbi_recognised', 'awbi_renewed', 'awbi_valid' ) )
);

// Decision fields: only a DirectoryWeb manager (or code) changes them.
add_filter(
	'directoryweb_protected_meta_names',
	fn( $names ) => array_merge(
		(array) $names,
		array(
			'awbi_recognised', 'awbi_renewed', 'awbi_valid', 'awbi_code', 'awbi_dropped', 'awbi_list_on',
			'darpan_id', 'darpan_blacklisted_by', 'darpan_blacklisted_on', 'reg_authority', 'reg_act', 'sectors',
		)
	)
);

// Team-only: never in a REST response to anyone without the DirectoryWeb capability.
add_filter(
	'directoryweb_private_meta_names',
	fn( $names ) => array_merge( (array) $names, array( 'darpan_blacklisted_by', 'darpan_blacklisted_on', 'reg_authority', 'reg_act', 'sectors', 'awbi_list_on' ) )
);

// The daily re-check also flags a listing whose AWBI recognition has passed its "valid until".
add_filter( 'directoryweb_expiry_meta_names', fn( $names ) => array_merge( (array) $names, array( 'awbi_valid' ) ) );

// The claim form: the rows for these fields, where they always were.
add_filter(
	'directoryweb_claim_fields',
	function ( $rows ) {
		$rows = aw_directoryweb_insert_after(
			(array) $rows,
			'l_reg',
			array(
				'l_12a'    => array( 'Tax exemption number', 'aw_reg_12a', 'reg_12a', true ),
				'l_80g'    => array( 'Donor tax relief number', 'aw_reg_80g', 'reg_80g', true ),
				'l_darpan' => array( 'Registry ID', 'aw_darpan_id', 'darpan_id', true ),
			)
		);
		$rows = aw_directoryweb_insert_after(
			$rows,
			'l_reg_type',
			array(
				'l_reg_auth' => array( 'Registration authority', 'aw_reg_authority', 'reg_authority', false ),
				'l_reg_act'  => array( 'Registration act', 'aw_reg_act', 'reg_act', false ),
			)
		);
		$rows = aw_directoryweb_insert_after(
			$rows,
			'l_reg_date',
			array(
				'l_fcra'       => array( 'Foreign funding registration', 'aw_fcra', 'fcra', true ),
				'l_awbi_code'  => array( 'Accreditation code', 'aw_awbi_code', 'awbi_code', true ),
				'l_awbi_rec'   => array( 'Accredited on', 'aw_awbi_recognised', 'awbi_recognised', true ),
				'l_awbi_ren'   => array( 'Accreditation renewed on', 'aw_awbi_renewed', 'awbi_renewed', true ),
				'l_awbi_valid' => array( 'Accreditation valid until', 'aw_awbi_valid', 'awbi_valid', true ),
			)
		);
		// The words the claim review showed (the plain table labels above were replaced by these).
		$labels = array(
			'l_12a' => 'tax_12a', 'l_80g' => 'tax_80g', 'l_darpan' => 'registry_id', 'l_fcra' => 'foreign_funding',
			'l_awbi_code' => 'awbi_code', 'l_awbi_rec' => 'awbi_recognised', 'l_awbi_ren' => 'awbi_renewed', 'l_awbi_valid' => 'awbi_valid',
		);
		foreach ( $labels as $row => $label ) {
			$rows[ $row ][0] = aw_directoryweb_label( $label );
		}
		return $rows;
	}
);
add_filter( 'directoryweb_claim_date_meta_keys', fn( $keys ) => array_merge( (array) $keys, array( 'aw_awbi_recognised', 'aw_awbi_renewed', 'aw_awbi_valid' ) ) );
add_filter( 'directoryweb_ff_dates', fn( $dates ) => array_values( array_unique( array_merge( (array) $dates, array( 'l_awbi_rec', 'l_awbi_ren', 'l_awbi_valid' ) ) ) ) );

// The Organisation profile box in wp-admin (the fallback when SCF is off) and the facts on the listing.
add_filter(
	'directoryweb_listing_fields',
	function ( $groups ) {
		$groups = (array) $groups;
		if ( isset( $groups['About'] ) ) {
			$groups['About'] = aw_directoryweb_insert_after(
				$groups['About'],
				'aw_registration',
				array(
					'aw_reg_12a'   => array( aw_directoryweb_label( 'tax_12a' ), 'text', aw_directoryweb_label( 'tax_12a_help' ) ),
					'aw_reg_80g'   => array( aw_directoryweb_label( 'tax_80g' ), 'text', aw_directoryweb_label( 'tax_80g_help' ) ),
					'aw_darpan_id' => array( aw_directoryweb_label( 'registry_id' ), 'text', '' ),
				)
			);
		}
		return $groups;
	}
);
add_filter(
	'directoryweb_org_facts',
	fn( $rows ) => aw_directoryweb_insert_after(
		(array) $rows,
		'aw_registration',
		array(
			'aw_reg_12a'   => aw_directoryweb_label( 'tax_12a' ),
			'aw_reg_80g'   => aw_directoryweb_label( 'tax_80g' ),
			'aw_fcra'      => aw_directoryweb_label( 'foreign_funding' ),
			'aw_darpan_id' => aw_directoryweb_label( 'registry_id' ),
		)
	)
);

// The listing page's Registrations group: AWBI first, then the registration number, 12A, 80G, FCRA and NGO Darpan.
add_filter(
	'directoryweb_listing_registration_rows',
	function ( $rows, $id ) {
		$awbi = directoryweb_lf( $id, 'aw_awbi_code' );
		$drop = directoryweb_lf( $id, 'aw_awbi_dropped' );
		$head = array(
			array(
				aw_directoryweb_label( 'awbi_number' ),
				$awbi
					? directoryweb_listing_parts(
						array(
							esc_html( $awbi ),
							directoryweb_listing_validity( directoryweb_lf( $id, 'aw_awbi_valid' ) ),
							$drop ? '<span class="kit-tag kit-tag--warning aw-facts-expired">' . esc_html( aw_directoryweb_label( 'awbi_not_on_list' ) ) . ' ' . directoryweb_date( $drop, null, 'aw-date' ) . '</span>' : '',
						)
					)
					: directoryweb_listing_na( $id ),
				directoryweb_listing_issuer_icon( 'awbi', $id, 'legal' ),
			),
		);
		$tail = array(
			array( aw_directoryweb_label( 'tax_12a' ), esc_html( directoryweb_lf( $id, 'aw_reg_12a' ) ), directoryweb_listing_issuer_icon( 'incometax', $id, 'legal' ) ),
			array( aw_directoryweb_label( 'tax_80g' ), esc_html( directoryweb_lf( $id, 'aw_reg_80g' ) ), directoryweb_listing_issuer_icon( 'incometax', $id, 'legal' ) ),
			array( aw_directoryweb_label( 'foreign_funding' ), esc_html( directoryweb_lf( $id, 'aw_fcra' ) ), directoryweb_listing_issuer_icon( 'mha', $id, 'legal' ) ),
			array( aw_directoryweb_label( 'registry_id' ), esc_html( directoryweb_lf( $id, 'aw_darpan_id' ) ), directoryweb_listing_issuer_icon( 'darpan', $id, 'legal' ) ),
		);
		return array_merge( $head, (array) $rows, $tail );
	},
	10,
	2
);

// The reading panel's Registration group in the admin list.
add_filter(
	'directoryweb_listing_registration_pairs',
	function ( $pairs, $id ) {
		$meta = fn( string $k ) => trim( (string) get_post_meta( $id, $k, true ) );
		return array_merge(
			(array) $pairs,
			array(
				array( aw_directoryweb_label( 'tax_12a' ), $meta( 'aw_reg_12a' ) ),
				array( aw_directoryweb_label( 'tax_80g' ), $meta( 'aw_reg_80g' ) ),
				array( aw_directoryweb_label( 'registry_id' ), $meta( 'aw_darpan_id' ) ),
			)
		);
	},
	10,
	2
);

// An import's one-line intro that says AWBI recognises the organisation is replaced by an enriched description.
add_filter(
	'directoryweb_listing_template_intro_prefixes',
	fn( $prefixes ) => array_merge( (array) $prefixes, array( 'Recognised by the Animal Welfare Board of India (AWBI code' ) )
);

// The editor's field group for these fields (SCF / ACF), read and saved in this layer's acf-json/.
const AW_DIRECTORYWEB_SCF_GROUPS = array( 'group_aw_listing_registrations_in' );
add_filter(
	'acf/settings/load_json',
	function ( $paths ) {
		$paths[] = __DIR__ . '/../acf-json';
		return $paths;
	}
);
foreach ( AW_DIRECTORYWEB_SCF_GROUPS as $aw_directoryweb_group ) {
	add_filter( 'acf/settings/save_json/key=' . $aw_directoryweb_group, fn() => dirname( __DIR__ ) . '/acf-json' );
}
unset( $aw_directoryweb_group );
add_filter( 'aw_scf_groups', fn( $groups ) => array_merge( (array) $groups, AW_DIRECTORYWEB_SCF_GROUPS ) );

// The editor's words for two fields whose group (in the plugin) is neutral: "Animals helped" and the Google category example.
add_filter(
	'acf/load_field/name=aw_animals',
	function ( $field ) {
		if ( is_array( $field ) ) {
			$field['label']        = 'Animals helped';
			$field['instructions'] = 'Comma separated, e.g. dogs, cats, cattle, birds.';
		}
		return $field;
	}
);
add_filter(
	'acf/load_field/name=aw_g_category',
	function ( $field ) {
		if ( is_array( $field ) ) {
			$field['instructions'] = 'As on the Google profile, e.g. Animal shelter.';
		}
		return $field;
	}
);

// India's place data: the Local Government Directory (states and districts) and the district centres.
add_filter( 'directoryweb_places_file', fn() => dirname( __DIR__ ) . '/data/lgd.json' );
add_filter( 'directoryweb_district_centroids_file', fn() => dirname( __DIR__ ) . '/data/district-centroids.json' );
