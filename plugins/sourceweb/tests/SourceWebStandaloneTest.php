<?php
/**
 * Standalone tests for SourceWeb without DirectoryWeb, InsightWeb, or Kits Core.
 *
 * Usage: php plugins/sourceweb/tests/SourceWebStandaloneTest.php
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'MINUTE_IN_SECONDS' ) ) {
	define( 'MINUTE_IN_SECONDS', 60 );
	define( 'HOUR_IN_SECONDS', 3600 );
	define( 'DAY_IN_SECONDS', 86400 );
}

// Minimal WordPress stubs.
if ( ! function_exists( 'wp_parse_url' ) ) {
	function wp_parse_url( $url, $component = -1 ) {
		return parse_url( $url, $component );
	}
}
if ( ! function_exists( 'sanitize_text_field' ) ) {
	function sanitize_text_field( $s ) {
		return trim( strip_tags( (string) $s ) );
	}
}
if ( ! function_exists( 'esc_url_raw' ) ) {
	function esc_url_raw( $u ) {
		return filter_var( $u, FILTER_SANITIZE_URL ) ?: '';
	}
}
if ( ! function_exists( 'get_the_terms' ) ) {
	function get_the_terms( $id, $taxonomy ) {
		return array();
	}
}
if ( ! function_exists( 'get_post_type' ) ) {
	function get_post_type( $id ) {
		return 'aw_news';
	}
}

// Load content helpers.
require_once dirname( __DIR__ ) . '/includes/sourcing-basics.php';
require_once dirname( __DIR__ ) . '/includes/content-helpers.php';

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

// 1. Sourcing basics.
check( 'example.com' === aw_host( 'https://www.example.com/feed.xml' ), 'aw_host extracts clean host' );
check( '' === aw_host( 'not a url' ), 'aw_host handles invalid URL' );

// 2. Tag fallback when DirectoryWeb is absent.
$tags = sourceweb_item_tags( 123 );
check( is_array( $tags ), 'sourceweb_item_tags returns array without DirectoryWeb' );

// 3. Meta sanitization fallback when DirectoryWeb is absent.
check( '2026-11-23' === sourceweb_sanitize_meta( '2026-11-23', 'aw_source_date' ), 'sourceweb_sanitize_meta validates date' );
check( '' === sourceweb_sanitize_meta( 'invalid-date', 'aw_source_date' ), 'sourceweb_sanitize_meta rejects bad date' );
check( 'https://example.com/article' === sourceweb_sanitize_meta( 'https://example.com/article', 'aw_source_url' ), 'sourceweb_sanitize_meta cleans url' );
check( 'CONTRACTOR' === sourceweb_sanitize_meta( 'contract', 'aw_employment_type' ), 'sourceweb_sanitize_meta normalizes employment type' );

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
