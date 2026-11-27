<?php
/**
 * Wording: the defaults name no animal or India-specific thing. (The Animal Writes site layer's words are tested in
 * sites/animalwrites/directoryweb/tests/labels-aw-tests.php.)
 *
 * Usage: php plugins/directoryweb/tests/labels-tests.php
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	if ( 'cli' !== PHP_SAPI ) {
		exit;
	}
	define( 'ABSPATH', __DIR__ . '/' );
}

// phpcs:disable -- a command-line test runner with stand-ins for WordPress functions.

$filters = array();
function add_filter( $h, $cb ) { global $filters; $filters[ $h ][] = $cb; }
function add_action( ...$a ) {}
function apply_filters( $h, $v ) { global $filters; foreach ( $filters[ $h ] ?? array() as $cb ) { $v = $cb( $v ); } return $v; }
function __( $t ) { return $t; }

$root = dirname( __DIR__ );
require $root . '/includes/labels.php';
require $root . '/includes/listing-meta.php';

$count = 0;
$fails = 0;
function check( $ok, $label ) { global $count, $fails; ++$count; if ( ! $ok ) { ++$fails; echo "FAIL: $label\n"; } }

$bad = '/animal|ngo|awbi|darpan|shelter|12a|80g|fcra|india/i';

// Neutral defaults: no label and no schema description names the animal or India-specific wording.
{
foreach ( directoryweb_labels() as $k => $v ) {
	check( ! preg_match( $bad, $v ), "default label $k is neutral: $v" );
}
foreach ( directoryweb_meta_schema() as $k => $def ) {
	if ( preg_match( '/^aw_(awbi_|darpan|reg_|sectors|animals|g_category)/', $k ) ) {
		check( ! preg_match( $bad, $def[2] ), "default schema text of $k is neutral: {$def[2]}" );
	}
}
foreach ( array( 'l_animals' ) as $k ) {
	check( ! preg_match( $bad, directoryweb_claim_label( $k, 'plain' ) ), "claim label $k is neutral" );
}

foreach ( array( 'awbi_number', 'registry_id', 'accreditor', 'tax_12a', 'tax_80g', 'foreign_funding' ) as $k ) {
	check( ! isset( directoryweb_labels()[ $k ] ), "no default label for $k: a site that has such a field words it itself" );
}

}

echo $count . ' checks, ' . $fails . " failed (neutral defaults)\n";
exit( $fails ? 1 : 0 );
