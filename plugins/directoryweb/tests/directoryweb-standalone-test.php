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
check( strpos( kits_count( 42 ), '42' ) !== false, 'kits_count returns formatted count' );
check( strpos( kits_icon( 'map-pin' ), 'kit-ico--map-pin' ) !== false, 'kits_icon renders span' );
check( strpos( kits_date( '2026-11-23', 'Y-m-d' ), '2026-11-23' ) !== false, 'kits_date formats date time tag' );

// 2. Check table renderer fallback.
ob_start();
kits_simple_table( 'test-table', array( 'name' => 'Name', 'val' => 'Value' ), array( array( 'name' => 'Item 1', 'val' => '100' ) ) );
$table_html = ob_get_clean();
check( strpos( $table_html, 'test-table' ) !== false, 'kits_simple_table renders table' );
check( strpos( $table_html, 'Item 1' ) !== false, 'kits_simple_table renders row data' );

// 3. Check phone normalisation.
check( '9876543210' === kits_ff_phone10( '+91 98765 43210' ), 'kits_ff_phone10 extracts 10 digits' );
check( '+91 98765 43210' === kits_ff_phone_store( '9876543210' ), 'kits_ff_phone_store formats +91 number' );

// 4. Check social username parsing.
check( 'myorg' === kits_ff_social_user( 'l_instagram', 'https://instagram.com/myorg' ), 'kits_ff_social_user parses Instagram URL' );
check( 'myorg' === kits_ff_social_user( 'l_x', '@myorg' ), 'kits_ff_social_user parses handle' );

// 5. Check REST permission callback.
$can_func = kits_shell_rest_can( 'manage_directoryweb' );
check( is_callable( $can_func ), 'kits_shell_rest_can returns callable' );
check( true === $can_func( new stdClass() ), 'kits_shell_rest_can passes for authorized user' );

$unauth_func = kits_shell_rest_can( 'super_admin_only' );
$result = $unauth_func( new stdClass() );
check( $result instanceof WP_Error && 'rest_forbidden' === $result->code, 'kits_shell_rest_can returns WP_Error for missing capability' );

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
