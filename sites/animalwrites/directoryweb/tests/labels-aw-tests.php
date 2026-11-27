<?php
/**
 * The Animal Writes site layer (sites/animalwrites/directoryweb/site.php) gives back exactly the pre-1.2.3 words.
 *
 * Usage: php sites/animalwrites/directoryweb/tests/labels-aw-tests.php
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	if ( 'cli' !== PHP_SAPI ) {
		exit;
	}
	define( 'ABSPATH', __DIR__ . '/' );
}

// phpcs:disable -- a command-line test runner with stand-ins for WordPress functions.

$filters = array();
function add_filter( $h, $cb, ...$r ) { global $filters; $filters[ $h ][] = $cb; }
function add_action( ...$a ) {}
function apply_filters( $h, $v, ...$rest ) { global $filters; foreach ( $filters[ $h ] ?? array() as $cb ) { $v = $cb( $v, ...$rest ); } return $v; }
function __( $t ) { return $t; }

$root = dirname( __DIR__, 4 ) . '/plugins/directoryweb';
require $root . '/includes/labels.php';
require $root . '/includes/listing-meta.php';

$count = 0;
$fails = 0;
function check( $ok, $label ) { global $count, $fails; ++$count; if ( ! $ok ) { ++$fails; echo "FAIL: $label\n"; } }

// The Animal Writes layer: the exact words the live site had.
require dirname( __DIR__ ) . '/site.php';
$want = array(
	'animals' => 'Animals helped', 'animals_help' => 'Comma separated, e.g. dogs, cats, cattle, birds', 'awbi_number' => 'AWBI number',
	'awbi_not_on_list' => 'Not on the current AWBI list', 'awbi_code' => 'AWBI code', 'awbi_recognised' => 'AWBI recognised on',
	'awbi_renewed' => 'AWBI renewed on', 'awbi_valid' => 'AWBI valid until', 'registry_id' => 'NGO Darpan ID',
	'tax_12a' => '12A', 'tax_80g' => '80G', 'foreign_funding' => 'FCRA',
);
require dirname( __DIR__ ) . '/includes/registrations.php';
foreach ( $want as $k => $v ) {
	check( ( isset( directoryweb_labels()[ $k ] ) ? directoryweb_label( $k ) : aw_directoryweb_label( $k ) ) === $v, "Animal Writes label $k" );
}
check( 'AWBI list' === aw_directoryweb_label( 'accreditor_list' ), 'Animal Writes accreditor list' );
check( 'Animals helped' === directoryweb_claim_label( 'l_animals', 'plain' ), 'Animal Writes claim label l_animals' );
// The whole listing schema is exactly what the plugin gave before 1.4.0 (keys, order, types, post types, texts).
$before = json_decode( (string) file_get_contents( __DIR__ . '/fixtures/meta-schema-before-1.4.0.json' ), true );
$schema = directoryweb_meta_schema();
check( array_keys( $before ) === array_keys( $schema ), 'Animal Writes schema: the same 48 keys in the same order' );
$same = true;
foreach ( $before as $k => $def ) {
	if ( ! isset( $schema[ $k ] ) || $schema[ $k ] !== $def ) {
		$same = false;
		echo "differs: $k\n";
	}
}
check( $same, 'Animal Writes schema: every type, post type and text unchanged' );

echo $count . ' checks, ' . $fails . " failed (Animal Writes layer)\n";
exit( $fails ? 1 : 0 );
