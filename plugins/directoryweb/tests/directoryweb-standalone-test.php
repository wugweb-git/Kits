<?php
/**
 * Tests DirectoryWeb in standalone mode (without Kits Core).
 * Verifies standalone fallbacks, UI helper functions, and REST callbacks.
 *
 * Usage: php plugins/directoryweb/tests/directoryweb-standalone-test.php
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
if ( ! function_exists( 'number_format_i18n' ) ) {
	function number_format_i18n( $n ) {
		return number_format( (float) $n );
	}
}
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
if ( ! function_exists( 'wp_date' ) ) {
	function wp_date( $fmt, $ts = null ) {
		return date( $fmt, $ts ?: time() );
	}
}
if ( ! function_exists( 'get_option' ) ) {
	function get_option( $opt, $default = false ) {
		static $opts = array();
		return $opts[ $opt ] ?? $default;
	}
}
if ( ! function_exists( 'update_option' ) ) {
	function update_option( $opt, $val ) {
		return true;
	}
}
if ( ! function_exists( 'is_user_logged_in' ) ) {
	function is_user_logged_in() {
		return true;
	}
}
if ( ! function_exists( 'current_user_can' ) ) {
	function current_user_can( $cap ) {
		return 'manage_directoryweb' === $cap || 'manage_options' === $cap;
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
	function __( $text, $domain = 'default' ) {
		return $text;
	}
}
if ( ! function_exists( 'esc_html__' ) ) {
	function esc_html__( $text, $domain = 'default' ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}
if ( ! function_exists( 'esc_attr__' ) ) {
	function esc_attr__( $text, $domain = 'default' ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
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

// Load the standalone compatibility layer.
require dirname( __DIR__ ) . '/includes/standalone-fallback.php';

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

// 1. Check primitives.
check( strpos( directoryweb_count( 42 ), '42' ) !== false, 'directoryweb_count returns formatted count' );
check( strpos( directoryweb_icon( 'map-pin' ), 'kit-ico--map-pin' ) !== false, 'directoryweb_icon renders span' );
check( strpos( directoryweb_date( '2026-11-23', 'Y-m-d' ), '2026-11-23' ) !== false, 'directoryweb_date formats date time tag' );

// 2. Check table renderer fallback.
ob_start();
directoryweb_simple_table( 'test-table', array( 'name' => 'Name', 'val' => 'Value' ), array( array( 'name' => 'Item 1', 'val' => '100' ) ) );
$table_html = ob_get_clean();
check( strpos( $table_html, 'test-table' ) !== false, 'directoryweb_simple_table renders table' );
check( strpos( $table_html, 'Item 1' ) !== false, 'directoryweb_simple_table renders row data' );

// 3. Check phone normalisation.
check( '9876543210' === directoryweb_ff_phone10( '+91 98765 43210' ), 'directoryweb_ff_phone10 extracts 10 digits' );
check( '+91 98765 43210' === directoryweb_ff_phone_store( '9876543210' ), 'directoryweb_ff_phone_store formats +91 number' );

// 4. Check social username parsing.
check( 'myorg' === directoryweb_ff_social_user( 'l_instagram', 'https://instagram.com/myorg' ), 'directoryweb_ff_social_user parses Instagram URL' );
check( 'myorg' === directoryweb_ff_social_user( 'l_x', '@myorg' ), 'directoryweb_ff_social_user parses handle' );

// 5. Check REST permission callback.
check( function_exists( 'directoryweb_rest_can' ), 'directoryweb_rest_can is defined' );
$can_func = directoryweb_rest_can( 'manage_directoryweb' );
check( is_callable( $can_func ), 'directoryweb_rest_can returns callable' );

// Missing nonce returns 403 rest_cookie_invalid_nonce for cookie auth.
$missing_nonce_res = $can_func( new stdClass() );
check( $missing_nonce_res instanceof WP_Error && 'rest_cookie_invalid_nonce' === $missing_nonce_res->code, 'missing nonce returns rest_cookie_invalid_nonce' );

// Invalid nonce returns 403 rest_cookie_invalid_nonce.
$bad_req = (object) array( 'headers' => array( 'X-WP-Nonce' => 'bad_token' ) );
$bad_nonce_res = $can_func( $bad_req );
check( $bad_nonce_res instanceof WP_Error && 'rest_cookie_invalid_nonce' === $bad_nonce_res->code, 'invalid nonce returns rest_cookie_invalid_nonce' );

// Valid nonce succeeds.
$valid_req = (object) array( 'headers' => array( 'X-WP-Nonce' => 'valid_nonce' ) );
check( true === $can_func( $valid_req ), 'valid nonce passes directoryweb_rest_can' );

// Application password succeeds without cookie nonce.
$GLOBALS['mock_app_password'] = (object) array( 'uuid' => 'test-app' );
check( true === $can_func( new stdClass() ), 'application password passes without nonce' );
$GLOBALS['mock_app_password'] = null;

// Missing capability returns rest_forbidden.
$unauth_func = directoryweb_rest_can( 'super_admin_only' );
$valid_req_unauth = (object) array( 'headers' => array( 'X-WP-Nonce' => 'valid_nonce' ) );
$result = $unauth_func( $valid_req_unauth );
check( $result instanceof WP_Error && 'rest_forbidden' === $result->code, 'directoryweb_rest_can returns WP_Error for missing capability' );

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
