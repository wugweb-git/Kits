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
defined( 'AW_SOURCING_DIR' ) || define( 'AW_SOURCING_DIR', dirname( __DIR__ ) . '/' );

// Minimal WordPress stubs.
$GLOBALS['test_options'] = array();
$GLOBALS['test_transients'] = array();

if ( ! function_exists( 'add_action' ) ) {
	function add_action( $hook, $cb, $priority = 10, $accepted_args = 1 ) {}
}
if ( ! function_exists( 'add_filter' ) ) {
	function add_filter( $hook, $cb, $priority = 10, $accepted_args = 1 ) {}
}
if ( ! function_exists( 'apply_filters' ) ) {
	function apply_filters( $hook, $val ) {
		return $val;
	}
}
if ( ! function_exists( 'get_option' ) ) {
	function get_option( $k, $default = false ) {
		return $GLOBALS['test_options'][ $k ] ?? $default;
	}
}
if ( ! function_exists( 'update_option' ) ) {
	function update_option( $k, $v, $autoload = null ) {
		$GLOBALS['test_options'][ $k ] = $v;
		return true;
	}
}
if ( ! function_exists( 'delete_option' ) ) {
	function delete_option( $k ) {
		unset( $GLOBALS['test_options'][ $k ] );
		return true;
	}
}
if ( ! function_exists( 'get_transient' ) ) {
	function get_transient( $k ) {
		return $GLOBALS['test_transients'][ $k ] ?? false;
	}
}
if ( ! function_exists( 'set_transient' ) ) {
	function set_transient( $k, $v, $exp = 0 ) {
		$GLOBALS['test_transients'][ $k ] = $v;
		return true;
	}
}
if ( ! function_exists( 'delete_transient' ) ) {
	function delete_transient( $k ) {
		unset( $GLOBALS['test_transients'][ $k ] );
		return true;
	}
}
if ( ! function_exists( 'sanitize_title' ) ) {
	function sanitize_title( $s ) {
		return strtolower( trim( preg_replace( '/[^a-zA-Z0-9_-]+/', '-', (string) $s ), '-' ) );
	}
}
if ( ! function_exists( 'current_time' ) ) {
	function current_time( $type ) {
		return 'Y-m-d' === $type ? date( 'Y-m-d' ) : date( 'Y-m-d H:i:s' );
	}
}
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

// Load files.
require_once dirname( __DIR__ ) . '/includes/sourcing-basics.php';
require_once dirname( __DIR__ ) . '/includes/content-helpers.php';
require_once dirname( __DIR__ ) . '/includes/workers-registry.php';
require_once dirname( __DIR__ ) . '/includes/workers-tick.php';
require_once dirname( __DIR__ ) . '/includes/rules-model.php';
require_once dirname( __DIR__ ) . '/includes/ingest.php';

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

// 4. Worker exponential retry backoff.
$b1 = aw_worker_retry_backoff( 'sourcing.yml', 503 );
check( 1 === $b1['attempts'] && 60 === $b1['delay'], 'aw_worker_retry_backoff 1st attempt is 60s' );
check( aw_worker_is_in_backoff( 'sourcing.yml' ), 'aw_worker_is_in_backoff returns true' );

$b2 = aw_worker_retry_backoff( 'sourcing.yml', 503 );
check( 2 === $b2['attempts'] && 300 === $b2['delay'], 'aw_worker_retry_backoff 2nd attempt is 300s' );

$b3 = aw_worker_retry_backoff( 'sourcing.yml', 503 );
check( 3 === $b3['attempts'] && 900 === $b3['delay'], 'aw_worker_retry_backoff 3rd attempt is 900s' );

$b4 = aw_worker_retry_backoff( 'sourcing.yml', 503 );
check( 4 === $b4['attempts'] && 3600 === $b4['delay'], 'aw_worker_retry_backoff 4th attempt capped at 3600s' );

check( aw_worker_clear_backoff( 'sourcing.yml' ), 'aw_worker_clear_backoff cleans state' );
check( ! aw_worker_is_in_backoff( 'sourcing.yml' ), 'aw_worker_is_in_backoff returns false after clear' );

// 5. Feed retry backoff.
$f1 = aw_feed_retry_backoff( 'https://feed.example.com/rss', 429 );
check( 1 === $f1['attempts'] && 60 === $f1['delay'], 'aw_feed_retry_backoff sets initial backoff' );
check( aw_feed_is_in_backoff( 'https://feed.example.com/rss' ), 'aw_feed_is_in_backoff returns true' );
aw_feed_clear_backoff( 'https://feed.example.com/rss' );
check( ! aw_feed_is_in_backoff( 'https://feed.example.com/rss' ), 'aw_feed_clear_backoff removes backoff' );

// 6. Domain trust overrides.
check( aw_rules_domain_override_save( 'trusted-news.in', 'allow', 'Trusted News' ), 'aw_rules_domain_override_save allow succeeds' );
check( aw_rules_domain_override_save( 'spam-site.com', 'block', 'Spam Site' ), 'aw_rules_domain_override_save block succeeds' );

$overrides = aw_rules_domain_overrides();
check( isset( $overrides['trusted-news.in'] ) && 'allow' === $overrides['trusted-news.in']['status'], 'trusted-news.in has allow status' );
check( isset( $overrides['spam-site.com'] ) && 'block' === $overrides['spam-site.com']['status'], 'spam-site.com has block status' );

check( aw_rules_domain_override_delete( 'trusted-news.in' ), 'aw_rules_domain_override_delete succeeds' );
$overrides_after = aw_rules_domain_overrides();
check( ! isset( $overrides_after['trusted-news.in'] ), 'trusted-news.in reset from overrides' );

// 7. Feed excluded tags.
check( aw_rules_feed_excluded_tags_save( array( 'politics', 'gossip', 'sports' ) ), 'aw_rules_feed_excluded_tags_save succeeds' );
$excluded = aw_rules_feed_excluded_tags();
check( in_array( 'politics', $excluded, true ) && in_array( 'gossip', $excluded, true ), 'aw_rules_feed_excluded_tags returns saved tags' );

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
