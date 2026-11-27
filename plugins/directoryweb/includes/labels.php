<?php
/**
 * Wording that was written for one site (an animal welfare directory in India), as neutral defaults any directory can use.
 *
 * The stored keys do not change (aw_animals and the rest keep their names); only the words people read do.
 * A site that wants the old wording, or its own, filters the whole list:
 *
 *     add_filter( 'directoryweb_labels', fn( $l ) => array_merge( $l, array( 'animals' => 'Animals helped' ) ) );
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Every label that has a neutral default, by key.
 *
 * Keys: animals, animals_help, category_example. (Registration and accreditation labels are not here: a site that has
 * such fields owns their wording with the fields, see `directoryweb_meta_fields` and `directoryweb_claim_fields`.)
 *
 * @return array<string,string>
 */
function directoryweb_labels(): array {
	$labels = array(
		'animals'          => __( 'Who is helped', 'directoryweb' ),
		'animals_help'     => __( 'Comma separated', 'directoryweb' ),
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
 * @param string $key   directoryweb_claim_fields() key.
 * @param string $plain The label the claim table holds.
 * @return string
 */
function directoryweb_claim_label( string $key, string $plain ): string {
	$map = array(
		'l_animals'    => 'animals',
	);
	return isset( $map[ $key ] ) ? directoryweb_label( $map[ $key ] ) : $plain;
}
