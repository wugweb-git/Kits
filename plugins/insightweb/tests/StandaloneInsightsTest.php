<?php
/**
 * Standalone tests for InsightWeb without Kits Core or Rank Math.
 * Tests REST callback, empty-state dashboard tiles, and standalone keyword/score functions.
 *
 * Usage: php plugins/insightweb/tests/StandaloneInsightsTest.php
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Minimal WordPress stubs.
if ( ! defined( 'MINUTE_IN_SECONDS' ) ) {
	define( 'MINUTE_IN_SECONDS', 60 );
	define( 'HOUR_IN_SECONDS', 3600 );
	define( 'DAY_IN_SECONDS', 86400 );
}
if ( ! function_exists( 'is_user_logged_in' ) ) {
	function is_user_logged_in() {
		return true;
	}
}
if ( ! function_exists( 'current_user_can' ) ) {
	function current_user_can( $cap ) {
		return 'manage_insightweb' === $cap || 'manage_options' === $cap;
	}
}
if ( ! class_exists( 'WP_Error' ) ) {
	class WP_Error {
		public $code;
		public $message;
		public $data;
		public function __construct( $c = '', $m = '', $d = array() ) {
			$this->code = $c;
			$this->message = $m;
			$this->data = $d;
		}
	}
}
if ( ! function_exists( '__' ) ) {
	function __( $t, $d = 'default' ) {
		return $t;
	}
}

if ( ! function_exists( 'add_action' ) ) {
	function add_action() {}
}
if ( ! function_exists( 'add_filter' ) ) {
	function add_filter() {}
}
if ( ! function_exists( 'delete_transient' ) ) {
	function delete_transient() {}
}
if ( ! function_exists( 'set_transient' ) ) {
	function set_transient() {}
}

// Load standalone fallback and dashboard.
require_once dirname( __DIR__ ) . '/includes/standalone-fallback.php';
require_once dirname( __DIR__ ) . '/includes/insightweb-dashboard.php';

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

// 1. Verify kits_shell_rest_can fallback.
check( function_exists( 'kits_shell_rest_can' ), 'kits_shell_rest_can is defined' );
$cb = kits_shell_rest_can( 'manage_insightweb' );
check( is_callable( $cb ), 'kits_shell_rest_can returns callable' );
check( true === $cb( new stdClass() ), 'kits_shell_rest_can passes for authorized user' );

$unauth_cb = kits_shell_rest_can( 'super_admin_only' );
$result = $unauth_cb( new stdClass() );
check( $result instanceof WP_Error && 'rest_forbidden' === $result->code, 'kits_shell_rest_can denies unauthorized' );

// 2. Verify empty-state dashboard tiles for fresh installs (prior to Search Console sync).
// Mock wpdb to simulate empty table.
class MockInsightWebDB {
	public function get_var( $q ) {
		return ''; // No MAX(d) exists yet.
	}
	public function prepare( $q, ...$args ) {
		return $q;
	}
}
$GLOBALS['wpdb'] = new MockInsightWebDB();

if ( ! function_exists( 'aw_si_table' ) ) {
	function aw_si_table( $name ) {
		return 'wp_aw_si_' . $name;
	}
}

$c = array( 'at' => time(), 'end' => '', 'ranges' => array() );
$dash_result = insightweb_dash_count( $c );

check( isset( $dash_result['ranges'][7] ), 'Range 7 exists in empty state' );
check( isset( $dash_result['ranges'][28] ), 'Range 28 exists in empty state' );
check( isset( $dash_result['ranges'][90] ), 'Range 90 exists in empty state' );

$r7 = $dash_result['ranges'][7];
check( 0 === $r7['clicks'], 'Range 7 clicks is 0' );
check( 0 === $r7['impr'], 'Range 7 impr is 0' );
check( null === $r7['pos'], 'Range 7 pos is null' );
check( true === $r7['empty'], 'Range 7 is marked empty' );

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
