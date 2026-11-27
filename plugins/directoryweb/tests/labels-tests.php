<?php
/**
 * Wording: the defaults name no animal or India-specific thing, and the Animal Writes site layer
 * (sites/animalwrites/directoryweb/site.php) gives back exactly the pre-1.2.3 words.
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
$aw = 'aw' === ( $argv[1] ?? '' );
if ( ! $aw ) {
foreach ( directoryweb_labels() as $k => $v ) {
	check( ! preg_match( $bad, $v ), "default label $k is neutral: $v" );
}
foreach ( directoryweb_meta_schema() as $k => $def ) {
	if ( preg_match( '/^aw_(awbi_|darpan|reg_|sectors|animals|g_category)/', $k ) ) {
		check( ! preg_match( $bad, $def[2] ), "default schema text of $k is neutral: {$def[2]}" );
	}
}
foreach ( array( 'l_animals', 'l_12a', 'l_80g', 'l_darpan', 'l_fcra', 'l_awbi_code', 'l_awbi_rec', 'l_awbi_ren', 'l_awbi_valid' ) as $k ) {
	check( ! preg_match( $bad, directoryweb_claim_label( $k, 'plain' ) ), "claim label $k is neutral" );
}

}

// The Animal Writes layer: the exact words the live site had. The schema is cached per process, so run it again with the layer loaded.
if ( ! $aw ) {
	passthru( escapeshellarg( PHP_BINARY ) . ' ' . escapeshellarg( __FILE__ ) . ' aw', $rc );
	echo $count . ' checks, ' . $fails . " failed (neutral defaults)\n";
	exit( ( $fails || $rc ) ? 1 : 0 );
}
require $root . '/../../sites/animalwrites/directoryweb/site.php';
$want = array(
	'animals' => 'Animals helped', 'animals_help' => 'Comma separated, e.g. dogs, cats, cattle, birds', 'awbi_number' => 'AWBI number',
	'awbi_not_on_list' => 'Not on the current AWBI list', 'awbi_code' => 'AWBI code', 'awbi_recognised' => 'AWBI recognised on',
	'awbi_renewed' => 'AWBI renewed on', 'awbi_valid' => 'AWBI valid until', 'registry_id' => 'NGO Darpan ID',
	'tax_12a' => '12A', 'tax_80g' => '80G', 'foreign_funding' => 'FCRA',
);
foreach ( $want as $k => $v ) {
	check( directoryweb_label( $k ) === $v, "Animal Writes label $k" );
}
check( 'AWBI list' === directoryweb_label( 'accreditor_list' ), 'Animal Writes accreditor list' );
$claim = array( 'l_animals' => 'Animals helped', 'l_12a' => '12A', 'l_80g' => '80G', 'l_darpan' => 'NGO Darpan ID', 'l_fcra' => 'FCRA', 'l_awbi_code' => 'AWBI code', 'l_awbi_rec' => 'AWBI recognised on', 'l_awbi_ren' => 'AWBI renewed on', 'l_awbi_valid' => 'AWBI valid until' );
foreach ( $claim as $k => $v ) {
	check( directoryweb_claim_label( $k, 'plain' ) === $v, "Animal Writes claim label $k" );
}
$schema = directoryweb_meta_schema();
$wantd  = array(
	'aw_awbi_recognised' => 'AWBI recognised on (Y-m-d)',
	'aw_awbi_renewed'    => 'AWBI renewed on (Y-m-d)',
	'aw_awbi_valid'      => 'AWBI recognition valid until (Y-m-d)',
	'aw_awbi_code'       => 'AWBI recognition code (from the AWBI list; read only)',
	'aw_awbi_dropped'    => 'Date of the current AWBI list the code is missing from (Y-m-d): recognition may have lapsed',
	'aw_awbi_list_on'    => 'Date of the AWBI list the code comes from (Y-m-d; empty = 31 May 2026 list)',
	'aw_g_category'      => 'Google category (e.g. Animal shelter)',
	'aw_reg_12a'         => '12A registration number',
	'aw_reg_80g'         => '80G registration number',
	'aw_darpan_id'       => 'NGO Darpan ID',
	'aw_darpan_blacklisted_by' => 'Blacklisted on NGO Darpan by (as NGO Darpan lists it)',
	'aw_darpan_blacklisted_on' => 'Blacklisted on NGO Darpan from (Y-m-d)',
	'aw_reg_authority'   => 'Registration authority (from NGO Darpan; admin only)',
	'aw_reg_act'         => 'Registered under (Act; from NGO Darpan; admin only)',
	'aw_reg_date'        => 'Registration date (Y-m-d; from NGO Darpan; admin only)',
	'aw_sectors'         => 'Sectors of work as NGO Darpan lists them (comma separated; admin only)',
	'aw_animals'         => 'Animals helped (comma separated)',
);
foreach ( $wantd as $k => $v ) {
	check( isset( $schema[ $k ] ) && $v === $schema[ $k ][2], "Animal Writes schema text of $k" );
}

echo $count . ' checks, ' . $fails . " failed (Animal Writes layer)\n";
exit( $fails ? 1 : 0 );
