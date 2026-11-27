<?php
/**
 * Reviewing a Fluent Forms claim with DirectoryWeb alone (no Kits Core, no Animal Writes Core).
 *
 * Reads a claim entry the way the Claims screen does, with stand-ins for WordPress, a stored Fluent Forms submission and
 * Fluent Forms itself, and proves that the review path needs no helper or constant from Kits Core or Animal Writes Core.
 * It does not prove a real Fluent Forms install: that stays unverified (see PENDING.md).
 *
 * Usage: php plugins/directoryweb/tests/claim-review-standalone-tests.php
 *
 * @package directoryweb
 */

// phpcs:disable -- a command-line test runner with stand-ins for WordPress functions.

$root = dirname( __DIR__ );

if ( isset( $argv[1] ) && 'noff' === $argv[1] ) { // child: Fluent Forms is not active
	$no_ff = true;
}

define( 'ABSPATH', '/' );
define( 'DIRECTORYWEB_CAP', 'manage_directoryweb' );
define( 'ARRAY_A', 'ARRAY_A' );
if ( empty( $no_ff ) ) {
	define( 'FLUENTFORM', true );
}
const DIRECTORYWEB_CLAIM_ROLES        = array( 'founder' => 'Founder' );
const DIRECTORYWEB_SERVICES = array( 'rescue' => 'Rescue' );

function add_action( ...$a ) {}
function add_filter( ...$a ) {}
function absint( $n ) { return abs( (int) $n ); }
function get_option( $k, $d = false ) { return 'aw_ff_forms' === $k ? array( 'claim' => 7 ) : $d; }
function get_post_type( $id ) { return 'aw_listing'; }
function get_post_meta( $id, $k, $single = false ) { return ''; }
function esc_attr( $s ) { return (string) $s; }
function esc_html( $s ) { return (string) $s; }
function esc_url( $u ) { return (string) $u; }
function sanitize_text_field( $s ) { return trim( strip_tags( (string) $s ) ); }
function wp_unslash( $v ) { return $v; }
function apply_filters( $h, $v ) { return $v; }
function directoryweb_listing_phones( $lid ) { return array(); }
function directoryweb_ff_forms(): array { return array( 7 => 'Claim form' ); }

class Dw_Test_Db {
	public $prefix = 'wp_';
	public function prepare( $sql, ...$args ) { return $sql; }
	public function get_row( $sql, $out ) {
		return array(
			'id'            => 41,
			'form_id'       => 7,
			'serial_number' => 5,
			'created_at'    => '2026-11-25 10:00:00',
			'response'      => json_encode(
				array(
					'listing'         => 12,
					'name'            => 'Asha Rao',
					'email'           => 'asha@example.org',
					'role'            => 'founder',
					'l_phone1'        => '9876543210',
					'l_phone1_label'  => 'Office',
					'l_phone1_wa'     => array( '1' ),
					'l_instagram'     => 'https://www.instagram.com/shelter_blr/',
					'l_services'      => array( 'rescue' ),
					'show_on_listing' => 'yes',
				)
			),
		);
	}
}
$wpdb = new Dw_Test_Db();

require $root . '/includes/standalone-fallback.php';
require $root . '/includes/claim-native.php';
require $root . '/includes/claim-evidence.php';
require $root . '/includes/claims-review.php';

$fails = 0;
$count = 0;
function check( $ok, $name ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo 'FAIL: ' . $name . "\n";
	}
}

check( ! function_exists( 'kits_ff_id' ) && ! function_exists( 'aw_ff_phone10' ) && ! defined( 'KITS_FF_SOCIAL' ), 'no Kits Core or Animal Writes Core helper or constant is loaded' );

if ( ! empty( $no_ff ) ) {
	check( 0 === directoryweb_claim_ff_id(), 'no Fluent Forms: no claim form id' );
	check( null === directoryweb_claim_entry( 41 ), 'no Fluent Forms: no entry is read' );
	echo $count . ' checks, ' . $fails . " failed\n";
	exit( $fails ? 1 : 0 );
}

check( 7 === directoryweb_claim_ff_id(), 'the claim form id comes from DirectoryWeb\'s own option' );
$c = directoryweb_claim_entry( 41 );
check( is_array( $c ), 'the entry is read' );
check( 12 === $c['listing'] && 'asha@example.org' === $c['email'] && 'Founder' === $c['role'], 'listing, email and role' );
check( 'DW-C-5' === $c['ref'], 'reference from the submission serial number' );
check( isset( $c['propose']['phones'] ) && false !== strpos( $c['propose']['phones'], '+91 98765 43210' ) && false !== strpos( $c['propose']['phones'], '| Office' ), 'phone stored as +91 with its label' );
check( isset( $c['propose']['phones'] ) && false !== strpos( $c['propose']['phones'], '| WhatsApp' ), 'the WhatsApp tick is kept' );
check( false !== strpos( (string) ( $c['propose']['l_instagram'] ?? '' ), 'shelter_blr' ), 'a social link is carried through (reducing it to a username at submit time is Kits Core\'s form layer, not the review\'s)' );
check( 'rescue' === ( $c['propose']['l_services'] ?? '' ), 'services' );

$src = file_get_contents( $root . '/includes/claims-review.php' );
check( ! preg_match( '/KITS_FF_|\baw_ff_phone/', $src ), 'claims-review.php names no Kits Core constant or Animal Writes phone helper' );
check( ! preg_match( '/(?<!function_exists\( \')\bkits_simple_table\(/', $src ), 'claims-review.php calls no unguarded Kits Core function' );

// A second process proves the same code reads nothing when Fluent Forms is not active.
$out = array();
exec( escapeshellarg( PHP_BINARY ) . ' ' . escapeshellarg( __FILE__ ) . ' noff 2>&1', $out, $rc );
check( 0 === $rc, 'without Fluent Forms: ' . implode( ' | ', $out ) );

echo $count . ' checks, ' . $fails . " failed\n";
exit( $fails ? 1 : 0 );
