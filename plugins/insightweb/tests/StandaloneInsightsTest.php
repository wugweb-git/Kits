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
if ( ! function_exists( 'wp_verify_nonce' ) ) {
	function wp_verify_nonce( $nonce, $action = -1 ) {
		return 'valid_nonce' === $nonce && 'wp_rest' === $action;
	}
}
if ( ! function_exists( 'rest_get_authenticated_app_password' ) ) {
	function rest_get_authenticated_app_password() {
		return $GLOBALS['mock_app_password'] ?? null;
	}
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

// 1. Verify insightweb_rest_can fallback.
check( function_exists( 'insightweb_rest_can' ), 'insightweb_rest_can is defined' );
$cb = insightweb_rest_can( 'manage_insightweb' );
check( is_callable( $cb ), 'insightweb_rest_can returns callable' );

// Missing nonce returns rest_cookie_invalid_nonce for cookie auth.
$missing_res = $cb( new stdClass() );
check( $missing_res instanceof WP_Error && 'rest_cookie_invalid_nonce' === $missing_res->code, 'missing nonce returns rest_cookie_invalid_nonce' );

// Invalid nonce returns rest_cookie_invalid_nonce.
$bad_req = (object) array( 'headers' => array( 'X-WP-Nonce' => 'bad' ) );
$bad_res = $cb( $bad_req );
check( $bad_res instanceof WP_Error && 'rest_cookie_invalid_nonce' === $bad_res->code, 'invalid nonce returns rest_cookie_invalid_nonce' );

// Valid nonce passes.
$valid_req = (object) array( 'headers' => array( 'X-WP-Nonce' => 'valid_nonce' ) );
check( true === $cb( $valid_req ), 'valid nonce passes insightweb_rest_can' );

// Application password passes without nonce.
$GLOBALS['mock_app_password'] = (object) array( 'uuid' => 'test-app' );
check( true === $cb( new stdClass() ), 'application password passes without nonce' );
$GLOBALS['mock_app_password'] = null;

// Missing capability returns rest_forbidden.
$unauth_cb = insightweb_rest_can( 'super_admin_only' );
$result = $unauth_cb( $valid_req );
check( $result instanceof WP_Error && 'rest_forbidden' === $result->code, 'insightweb_rest_can denies unauthorized' );

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

if ( ! function_exists( 'insightweb_si_table' ) ) {
	function insightweb_si_table( $name ) {
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
check( false === $r7['is_mock'], 'Range 7 is strictly not mock data' );
check( false !== strpos( $r7['message'], 'Search Console' ), 'Range 7 has awaiting sync message' );

// 3. Verify shaped tiles empty state and mock prevention.
if ( ! function_exists( 'number_format_i18n' ) ) {
	function number_format_i18n( $n, $d = 0 ) {
		return number_format( (float) $n, $d );
	}
}
if ( ! function_exists( 'wp_date' ) ) {
	function wp_date( $fmt, $ts ) {
		return date( $fmt, $ts );
	}
}
if ( ! function_exists( 'home_url' ) ) {
	function home_url( $path = '' ) {
		return 'https://example.com' . $path;
	}
}

require_once dirname( __DIR__ ) . '/includes/insightweb-rest.php';
$shaped = insightweb_dash_shape( $r7, array() );
check( true === $shaped['empty'], 'Shaped dashboard is marked empty' );
check( false === $shaped['is_mock'], 'Shaped dashboard is not mock' );
check( 6 === count( $shaped['tiles'] ), 'All 6 tiles are shaped' );
foreach ( $shaped['tiles'] as $tile ) {
	check( true === $tile['empty'], "Tile {$tile['key']} is marked empty" );
	check( false === $tile['is_mock'], "Tile {$tile['key']} is strictly not mock" );
	check( false !== strpos( $tile['message'], 'Search Console' ), "Tile {$tile['key']} has awaiting sync message" );
}

// 4. Verify Credential Connection Diagnostics.
$GLOBALS['test_options'] = array();
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
if ( ! function_exists( 'register_setting' ) ) {
	function register_setting() {}
}

require_once dirname( __DIR__ ) . '/includes/insightweb-keys.php';

// Not configured status
$stat_empty = insightweb_check_service_status( 'INSIGHTWEB_CLARITY_TOKEN' );
check( 'not_configured' === $stat_empty['status'], 'Unset key returns not_configured' );

// Connected status when key is provided
$GLOBALS['test_options'][ INSIGHTWEB_KEYS_OPTION ] = array(
	insightweb_stored_name( 'INSIGHTWEB_CLARITY_TOKEN' ) => 'clarity-test-token-12345',
	insightweb_stored_name( 'INSIGHTWEB_GOOGLE_ALERTS_FEED_1' ) => 'https://www.google.com/alerts/feeds/12345/67890',
	insightweb_stored_name( 'INSIGHTWEB_GOOGLE_ALERTS_FEED_2' ) => 'invalid-feed-url',
);
$stat_clarity = insightweb_check_service_status( 'INSIGHTWEB_CLARITY_TOKEN' );
check( 'connected' === $stat_clarity['status'], 'Configured key returns connected' );

$stat_feed_ok = insightweb_check_service_status( 'INSIGHTWEB_GOOGLE_ALERTS_FEED_1' );
check( 'connected' === $stat_feed_ok['status'], 'Valid alerts feed URL returns connected' );

$stat_feed_bad = insightweb_check_service_status( 'INSIGHTWEB_GOOGLE_ALERTS_FEED_2' );
check( 'invalid_key' === $stat_feed_bad['status'], 'Invalid alerts feed URL returns invalid_key' );

// 5. Verify Telemetry Cron hook definition.
if ( ! function_exists( 'wp_timezone' ) ) {
	function wp_timezone() {
		return new DateTimeZone( 'UTC' );
	}
}
if ( ! function_exists( 'wp_next_scheduled' ) ) {
	function wp_next_scheduled() {
		return false;
	}
}
if ( ! function_exists( 'wp_schedule_event' ) ) {
	function wp_schedule_event() {
		return true;
	}
}
if ( ! function_exists( 'insightweb_si_install' ) ) {
	function insightweb_si_install() {}
}
if ( ! function_exists( 'insightweb_si_run_start' ) ) {
	function insightweb_si_run_start() {}
}
if ( ! function_exists( 'insightweb_si_seed' ) ) {
	function insightweb_si_seed() { return array(); }
}
if ( ! function_exists( 'insightweb_si_gsc_run' ) ) {
	function insightweb_si_gsc_run() { return array(); }
}
if ( ! function_exists( 'insightweb_si_sync_roles' ) ) {
	function insightweb_si_sync_roles() { return array(); }
}
if ( ! function_exists( 'insightweb_si_compute' ) ) {
	function insightweb_si_compute() { return array(); }
}
if ( ! function_exists( 'insightweb_si_sync_topics' ) ) {
	function insightweb_si_sync_topics() { return array(); }
}
if ( ! function_exists( 'insightweb_si_run_ok' ) ) {
	function insightweb_si_run_ok() {}
}

require_once dirname( __DIR__ ) . '/includes/search-insights/cron.php';
check( defined( 'INSIGHTWEB_CRON_TELEMETRY' ) && 'insightweb_daily_telemetry_cron' === INSIGHTWEB_CRON_TELEMETRY, 'INSIGHTWEB_CRON_TELEMETRY constant is defined' );
check( function_exists( 'insightweb_daily_telemetry_refresh' ), 'insightweb_daily_telemetry_refresh function exists' );

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
