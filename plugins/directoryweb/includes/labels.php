<?php
/**
 * Wording that was written for one site (an animal welfare directory in India), as neutral defaults any directory can use.
 *
 * The stored keys do not change (aw_animals, aw_awbi_code and the rest keep their names); only the words people read do.
 * A site that wants the old wording, or its own, filters the whole list:
 *
 *     add_filter( 'directoryweb_labels', fn( $l ) => array_merge( $l, array( 'animals' => 'Animals helped', 'awbi_number' => 'AWBI number' ) ) );
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Every label that has a neutral default, by key.
 *
 * Keys: animals, animals_help, awbi_number, awbi_not_on_list, awbi_code, awbi_recognised, awbi_renewed, awbi_valid, registry_id,
 * registry_name, accreditor, accreditor_list, accreditor_first_list, tax_12a, tax_12a_help, tax_80g, tax_80g_help, foreign_funding,
 * category_example.
 *
 * @return array<string,string>
 */
function directoryweb_labels(): array {
	$labels = array(
		'animals'          => __( 'Who is helped', 'directoryweb' ),
		'animals_help'     => __( 'Comma separated', 'directoryweb' ),
		'awbi_number'      => __( 'Accreditation number', 'directoryweb' ),
		'awbi_not_on_list' => __( 'Not on the current accreditation list', 'directoryweb' ),
		'awbi_code'        => __( 'Accreditation code', 'directoryweb' ),
		'awbi_recognised'  => __( 'Accredited on', 'directoryweb' ),
		'awbi_renewed'     => __( 'Accreditation renewed on', 'directoryweb' ),
		'awbi_valid'       => __( 'Accreditation valid until', 'directoryweb' ),
		'registry_id'      => __( 'Registry ID', 'directoryweb' ),
		'registry_name'    => __( 'the registry', 'directoryweb' ),
		'accreditor'       => __( 'Accreditation', 'directoryweb' ),
		'accreditor_list'  => __( 'accreditation list', 'directoryweb' ),
		'accreditor_first_list' => __( 'the first list', 'directoryweb' ),
		'tax_12a'          => __( 'Tax exemption number', 'directoryweb' ),
		'tax_12a_help'     => __( 'Tax exemption registration number', 'directoryweb' ),
		'tax_80g'          => __( 'Donor tax relief number', 'directoryweb' ),
		'tax_80g_help'     => __( 'Donor tax relief registration number', 'directoryweb' ),
		'foreign_funding'  => __( 'Foreign funding registration', 'directoryweb' ),
		'category_example' => __( 'Community centre', 'directoryweb' ),
	);
	/**
	 * Filters the labels. Return the same keys; an unknown or empty one falls back to the default.
	 *
	 * @param array<string,string> $labels Key => label.
	 */
	$filtered = apply_filters( 'directoryweb_labels', $labels );
	$out      = $labels;
	foreach ( is_array( $filtered ) ? $filtered : array() as $k => $v ) {
		if ( isset( $labels[ $k ] ) && is_string( $v ) && '' !== trim( $v ) ) {
			$out[ $k ] = $v;
		}
	}
	return $out;
}

/**
 * One label.
 *
 * @param string $key A key of directoryweb_labels().
 * @return string
 */
function directoryweb_label( string $key ): string {
	$all = directoryweb_labels();
	return $all[ $key ] ?? $key;
}

/**
 * The label of a claim form field, with the neutral wording where the field is one of the keyed labels.
 *
 * @param string $key   DIRECTORYWEB_CLAIM_L key.
 * @param string $plain The label the claim table holds.
 * @return string
 */
function directoryweb_claim_label( string $key, string $plain ): string {
	$map = array(
		'l_animals'    => 'animals',
		'l_darpan'     => 'registry_id',
		'l_12a'        => 'tax_12a',
		'l_80g'        => 'tax_80g',
		'l_fcra'       => 'foreign_funding',
		'l_awbi_code'  => 'awbi_code',
		'l_awbi_rec'   => 'awbi_recognised',
		'l_awbi_ren'   => 'awbi_renewed',
		'l_awbi_valid' => 'awbi_valid',
	);
	return isset( $map[ $key ] ) ? directoryweb_label( $map[ $key ] ) : $plain;
}
