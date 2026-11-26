<?php
/**
 * Stand-ins for the few WordPress pieces the tool screens' REST routes and report functions touch, shared by the
 * ToolScreens*Test.php files (FAQ, Internal links, Images, SEO CSV, Redirect tools). Every stub is guarded, so a file
 * that ran before this one (StandaloneSeoTest, ShareTagsTest) keeps its own. Not a test file: the runner only loads
 * *Test.php.
 *
 * What it gives a test:
 *  - rw_user( $in, $caps, $nonce ): the signed-in state the permission check reads.
 *  - rw_routes( $register ): runs a route-registering function and returns the routes it registered, 'METHOD /path' => args.
 *  - rw_can( $args, $nonce ): runs a route's permission_callback with a request carrying that nonce.
 *  - WP_Error, WP_REST_Request: just enough to be built and read.
 *
 * @package rankweb
 */

// phpcs:disable -- a test harness.

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! class_exists( 'PHPUnit\Framework\TestCase' ) && file_exists( __DIR__ . '/phpunit-lite.php' ) ) {
	require_once __DIR__ . '/phpunit-lite.php';
}

$GLOBALS['rw_user']   = array( 'in' => false, 'caps' => array(), 'nonce' => 'good' );
$GLOBALS['rw_routes'] = array();
$GLOBALS['rw_opts']   = $GLOBALS['rw_opts'] ?? array();
$GLOBALS['rw_transients'] = $GLOBALS['rw_transients'] ?? array();

if ( ! class_exists( 'WP_Error' ) ) {
	class WP_Error {
		public $code;
		public $message;
		public $data;
		public function __construct( $code = '', $message = '', $data = '' ) {
			$this->code    = $code;
			$this->message = $message;
			$this->data    = $data;
		}
		public function get_error_code() {
			return $this->code;
		}
		public function get_error_message() {
			return $this->message;
		}
		public function get_error_data() {
			return $this->data;
		}
	}
}
if ( ! class_exists( 'WP_REST_Request' ) ) {
	class WP_REST_Request implements ArrayAccess {
		public $headers = array();
		public $params  = array();
		public $files   = array();
		public function __construct( $method = 'GET', $route = '' ) {}
		public function get_header( $k ) {
			return $this->headers[ strtolower( $k ) ] ?? null;
		}
		public function get_param( $k ) {
			return $this->params[ $k ] ?? null;
		}
		public function get_params() {
			return $this->params;
		}
		public function get_file_params() {
			return $this->files;
		}
		public function offsetExists( $o ): bool {
			return isset( $this->params[ $o ] );
		}
		public function offsetGet( $o ): mixed {
			return $this->params[ $o ] ?? null;
		}
		public function offsetSet( $o, $v ): void {
			$this->params[ $o ] = $v;
		}
		public function offsetUnset( $o ): void {
			unset( $this->params[ $o ] );
		}
	}
}
if ( ! function_exists( 'is_wp_error' ) ) {
	function is_wp_error( $v ) {
		return $v instanceof WP_Error;
	}
}
if ( ! function_exists( '__' ) ) {
	function __( $s, $d = '' ) {
		return $s;
	}
}
if ( ! function_exists( '_n' ) ) {
	function _n( $one, $many, $n, $d = '' ) {
		return 1 === (int) $n ? $one : $many;
	}
}
if ( ! function_exists( 'esc_html__' ) ) {
	function esc_html__( $s, $d = '' ) {
		return $s;
	}
}
if ( ! function_exists( 'number_format_i18n' ) ) {
	function number_format_i18n( $n, $dec = 0 ) {
		return number_format( (float) $n, $dec );
	}
}
if ( ! function_exists( 'wp_date' ) ) {
	function wp_date( $f, $ts = null ) {
		return gmdate( $f, $ts ?? 0 );
	}
}
if ( ! function_exists( 'wp_list_pluck' ) ) {
	function wp_list_pluck( $list, $field ) {
		return array_map( fn( $x ) => $x[ $field ], $list );
	}
}
if ( ! function_exists( 'sanitize_key' ) ) {
	function sanitize_key( $k ) {
		return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $k ) );
	}
}
if ( ! function_exists( 'sanitize_text_field' ) ) {
	function sanitize_text_field( $s ) {
		return trim( preg_replace( '/[\r\n\t ]+/', ' ', strip_tags( (string) $s ) ) );
	}
}
if ( ! function_exists( 'sanitize_textarea_field' ) ) {
	function sanitize_textarea_field( $s ) {
		return trim( strip_tags( (string) $s ) );
	}
}
if ( ! function_exists( 'wp_unslash' ) ) {
	function wp_unslash( $v ) {
		return is_array( $v ) ? array_map( 'wp_unslash', $v ) : stripslashes( (string) $v );
	}
}
if ( ! function_exists( 'absint' ) ) {
	function absint( $n ) {
		return abs( (int) $n );
	}
}
if ( ! function_exists( 'rest_ensure_response' ) ) {
	function rest_ensure_response( $v ) {
		return $v;
	}
}
if ( ! function_exists( 'register_rest_route' ) ) {
	function register_rest_route( $ns, $route, $args ) {
		$methods = (string) ( $args['methods'] ?? '' );
		$GLOBALS['rw_routes'][ $methods . ' ' . $route ] = $args;
		return true;
	}
}
if ( ! function_exists( 'add_action' ) ) {
	function add_action( $tag, $fn, $prio = 10, $args = 1 ) {
		$GLOBALS['rw_filters'][ $tag ][] = $fn;
		return true;
	}
}
if ( ! function_exists( 'add_filter' ) ) {
	function add_filter( $tag, $fn, $prio = 10, $args = 1 ) {
		$GLOBALS['rw_filters'][ $tag ][] = $fn;
		return true;
	}
}
if ( ! function_exists( 'apply_filters' ) ) {
	function apply_filters( $tag, $value, ...$rest ) {
		return $value;
	}
}
if ( ! function_exists( 'is_user_logged_in' ) ) {
	function is_user_logged_in() {
		return ! empty( $GLOBALS['rw_user']['in'] );
	}
}
if ( ! function_exists( 'wp_verify_nonce' ) ) {
	function wp_verify_nonce( $nonce, $action ) {
		return 'wp_rest' === $action && (string) $nonce === (string) $GLOBALS['rw_user']['nonce'] ? 1 : false;
	}
}
if ( ! function_exists( 'current_user_can' ) ) {
	function current_user_can( $cap, ...$args ) {
		// A per-item right ( 'edit_post', 12 ) is refused for an ID in $GLOBALS['rw_user']['deny'].
		if ( isset( $args[0] ) && in_array( $args[0], (array) ( $GLOBALS['rw_user']['deny'] ?? array() ), true ) ) {
			return false;
		}
		return in_array( $cap, (array) $GLOBALS['rw_user']['caps'], true );
	}
}
if ( ! function_exists( 'get_transient' ) ) {
	function get_transient( $k ) {
		return $GLOBALS['rw_transients'][ $k ] ?? false;
	}
}
if ( ! function_exists( 'set_transient' ) ) {
	function set_transient( $k, $v, $ttl = 0 ) {
		$GLOBALS['rw_transients'][ $k ] = $v;
		return true;
	}
}
if ( ! function_exists( 'delete_transient' ) ) {
	function delete_transient( $k ) {
		unset( $GLOBALS['rw_transients'][ $k ] );
		return true;
	}
}
if ( ! function_exists( 'delete_option' ) ) {
	function delete_option( $k ) {
		unset( $GLOBALS['rw_opts'][ $k ] );
		return true;
	}
}
if ( ! function_exists( 'get_current_user_id' ) ) {
	function get_current_user_id() {
		return 7;
	}
}
if ( ! function_exists( 'get_option' ) ) {
	function get_option( $name, $fallback = false ) {
		return array_key_exists( $name, $GLOBALS['rw_opts'] ) ? $GLOBALS['rw_opts'][ $name ] : $fallback;
	}
}
if ( ! function_exists( 'update_option' ) ) {
	function update_option( $name, $value, $autoload = null ) {
		$GLOBALS['rw_opts'][ $name ] = $value;
		return true;
	}
}

foreach ( array( 'MINUTE_IN_SECONDS' => 60, 'HOUR_IN_SECONDS' => 3600, 'DAY_IN_SECONDS' => 86400, 'MB_IN_BYTES' => 1048576 ) as $rw_const => $rw_val ) {
	if ( ! defined( $rw_const ) ) {
		define( $rw_const, $rw_val );
	}
}
if ( ! defined( 'RANKWEB_CAP' ) ) {
	define( 'RANKWEB_CAP', 'manage_rankweb' );
}
if ( ! function_exists( 'rankweb_rest_can' ) ) {
	require_once dirname( __DIR__ ) . '/includes/rankweb-rest.php'; // rankweb_rest_can(), RANKWEB_REST: the real permission check
}

/**
 * Set who is signed in.
 *
 * @param bool     $in    Signed in.
 * @param string[] $caps  Capabilities.
 * @param string   $nonce The wp_rest nonce this user's page would hold.
 */
function rw_user( bool $in, array $caps = array(), string $nonce = 'good' ): void {
	$GLOBALS['rw_user'] = array( 'in' => $in, 'caps' => $caps, 'nonce' => $nonce );
}

/**
 * The routes a registering function registers.
 *
 * @param callable $register Function that calls register_rest_route().
 * @return array 'METHOD /path' => args.
 */
function rw_routes( callable $register ): array {
	$GLOBALS['rw_routes'] = array();
	$register();
	return $GLOBALS['rw_routes'];
}

/**
 * Run a route's permission callback.
 *
 * @param array       $args  The route's registered args.
 * @param string|null $nonce Nonce the request carries in X-WP-Nonce (null: none).
 * @return bool|WP_Error
 */
function rw_can( array $args, ?string $nonce = 'good' ) {
	$req = new WP_REST_Request( (string) $args['methods'] );
	if ( null !== $nonce ) {
		$req->headers['x-wp-nonce'] = $nonce;
	}
	return ( $args['permission_callback'] )( $req );
}

/**
 * The permission matrix every tool route must pass: signed out is 401, no nonce or a wrong one is 403, a signed-in user
 * without the capability is 403, and the right capability with its nonce is allowed. Returns the failures, '' for none.
 *
 * @param string $name  Route key, for the message.
 * @param array  $args  Route args.
 * @param string $cap   The capability the route must need.
 */
function rw_matrix( string $name, array $args, string $cap ): string {
	$bad = array();
	rw_user( false );
	$r = rw_can( $args );
	if ( ! is_wp_error( $r ) || 401 !== ( $r->data['status'] ?? 0 ) ) {
		$bad[] = 'signed out is not 401';
	}
	rw_user( true, array( $cap ), 'good' );
	if ( true !== rw_can( $args, 'good' ) ) {
		$bad[] = 'the right capability with a nonce is refused';
	}
	$r = rw_can( $args, null );
	if ( ! is_wp_error( $r ) || 403 !== ( $r->data['status'] ?? 0 ) ) {
		$bad[] = 'no nonce is not 403';
	}
	$r = rw_can( $args, 'stale' );
	if ( ! is_wp_error( $r ) || 403 !== ( $r->data['status'] ?? 0 ) ) {
		$bad[] = 'a wrong nonce is not 403';
	}
	rw_user( true, array( 'read', 'edit_posts' === $cap ? 'upload_files' : 'edit_posts' ), 'good' );
	$r = rw_can( $args, 'good' );
	if ( ! is_wp_error( $r ) || 403 !== ( $r->data['status'] ?? 0 ) ) {
		$bad[] = 'a user without the capability is not 403';
	}
	return $bad ? $name . ': ' . implode( '; ', $bad ) : '';
}
