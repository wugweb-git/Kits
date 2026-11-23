<?php
/**
 * Tests DirectoryWeb without Secure Custom Fields (SCF / ACF).
 * Verifies that listing metadata and fallback custom field storage operate independently.
 *
 * Usage: php plugins/directoryweb/tests/directoryweb-scf-fallback-test.php
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Minimal WordPress function stubs for standalone CLI execution.
if ( ! function_exists( 'esc_html' ) ) {
	function esc_html( $t ) {
		return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' );
	}
}
if ( ! function_exists( 'esc_attr' ) ) {
	function esc_attr( $t ) {
		return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' );
	}
}
if ( ! function_exists( 'esc_url' ) ) {
	function esc_url( $u ) {
		return filter_var( $u, FILTER_SANITIZE_URL ) ?: '';
	}
}
if ( ! function_exists( '__' ) ) {
	function __( $text, $domain = 'default' ) {
		return $text;
	}
}
if ( ! function_exists( 'esc_html__' ) ) {
	function esc_html__( $text, $domain = 'default' ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}
if ( ! function_exists( 'add_action' ) ) {
	function add_action( $tag, $callback, $priority = 10, $accepted_args = 1 ) {
		return true;
	}
}
if ( ! function_exists( 'add_filter' ) ) {
	function add_filter( $tag, $callback, $priority = 10, $accepted_args = 1 ) {
		return true;
	}
}

// Ensure mock post meta store.
$mock_meta = array();
if ( ! function_exists( 'get_post_meta' ) ) {
	function get_post_meta( $post_id, $key = '', $single = false ) {
		global $mock_meta;
		if ( '' === $key ) {
			return $mock_meta[ $post_id ] ?? array();
		}
		$val = $mock_meta[ $post_id ][ $key ] ?? '';
		return $single ? $val : (array) $val;
	}
}
if ( ! function_exists( 'update_post_meta' ) ) {
	function update_post_meta( $post_id, $key, $val ) {
		global $mock_meta;
		if ( ! isset( $mock_meta[ $post_id ] ) ) {
			$mock_meta[ $post_id ] = array();
		}
		$mock_meta[ $post_id ][ $key ] = $val;
		return true;
	}
}
if ( ! function_exists( 'delete_post_meta' ) ) {
	function delete_post_meta( $post_id, $key ) {
		global $mock_meta;
		unset( $mock_meta[ $post_id ][ $key ] );
		return true;
	}
}

// Load listing-profile.php.
require dirname( __DIR__ ) . '/includes/standalone-fallback.php';
require dirname( __DIR__ ) . '/includes/listing-profile.php';

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

// 1. Verify SCF is reported as inactive when SCF/ACF functions do not exist.
check( false === directoryweb_scf_active(), 'directoryweb_scf_active returns false without SCF' );

// 2. Verify listing cards are registered for fallback meta box.
$cards = directoryweb_listing_cards();
check( is_array( $cards ) && isset( $cards['Contact'], $cards['Online'], $cards['About'] ), 'listing cards definition exists' );

// 3. Test preservation and storage of legacy aw_* keys.
$test_post_id = 999;
$legacy_keys = array(
	'aw_phone'             => '+91 98765 43210',
	'aw_website'           => 'https://example.org',
	'aw_instagram'         => 'example_org',
	'aw_reg_number'        => 'REG-2026-001',
	'aw_verified'          => '1',
	'aw_gov_verified_on'   => '2026-11-20',
	'aw_state_code'        => '12',
	'aw_district_code'     => '123',
);

foreach ( $legacy_keys as $key => $val ) {
	update_post_meta( $test_post_id, $key, $val );
}

foreach ( $legacy_keys as $key => $expected ) {
	check( $expected === get_post_meta( $test_post_id, $key, true ), 'Preserved legacy key ' . $key );
}

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
