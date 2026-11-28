<?php
/**
 * Shared stand-ins for the WordPress functions the 1.4.1 tests need (hooks that really run, options, transients,
 * capabilities, escaping, wp_die and wp_send_json that throw so a test can catch them). Loaded by the new tests; it is
 * not a test itself (its name does not end in -tests.php, so the CI loop skips it).
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO, Generic.Files.OneObjectStructurePerFile -- a command-line test helper with stand-ins.

if ( 'cli' !== PHP_SAPI ) {
	exit;
}
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', sys_get_temp_dir() . '/kits-test-abspath/' );
}
foreach ( array(
	'MINUTE_IN_SECONDS' => 60,
	'HOUR_IN_SECONDS'   => 3600,
	'DAY_IN_SECONDS'    => 86400,
) as $k => $v ) {
	defined( $k ) || define( $k, $v );
}
defined( 'KITS_CORE_DIR' ) || define( 'KITS_CORE_DIR', dirname( __DIR__ ) . '/' );
defined( 'KITS_CORE_VERSION' ) || define( 'KITS_CORE_VERSION', '1.5.0' );

$GLOBALS['t_hooks']      = array();
$GLOBALS['t_opts']       = array();
$GLOBALS['t_transients'] = array();
$GLOBALS['t_caps']       = array();
$GLOBALS['t_user']       = 0;
$GLOBALS['t_fails']      = 0;
$GLOBALS['t_count']      = 0;

class T_Die extends Exception {
	public $payload;
	public $status;
	public function __construct( $payload = '', $status = 0 ) {
		parent::__construct( is_string( $payload ) ? $payload : 'die' );
		$this->payload = $payload;
		$this->status  = $status;
	}
}
class T_Redirect extends Exception {
	public $url;
	public function __construct( $url ) {
		parent::__construct( 'redirect' );
		$this->url = $url;
	}
}
class WP_Error {
	public $code;
	public $message;
	public function __construct( $code = '', $message = '' ) {
		$this->code    = $code;
		$this->message = $message;
	}
	public function get_error_code() {
		return $this->code;
	}
	public function get_error_message() {
		return $this->message;
	}
}
class WP_REST_Response {
	public $data;
	public $headers = array();
	public function __construct( $data = null ) {
		$this->data = $data;
	}
	public function header( $k, $v ) {
		$this->headers[ $k ] = $v;
	}
}

/** Check helper: t( $ok, 'name' ). */
function t( $ok, $name ) {
	++$GLOBALS['t_count'];
	if ( ! $ok ) {
		++$GLOBALS['t_fails'];
		echo "FAIL: $name\n";
	}
}
/** Print the summary and exit with the right code. */
function t_done() {
	echo $GLOBALS['t_count'] . ' checks, ' . $GLOBALS['t_fails'] . " failed\n";
	exit( $GLOBALS['t_fails'] ? 1 : 0 );
}
/** Forget every option, transient and capability (a fresh site); hooks stay unless $hooks is true. */
function t_reset( $hooks = false ) {
	if ( $hooks ) {
		$GLOBALS['t_hooks'] = array();
	}
	$GLOBALS['t_opts']       = array();
	$GLOBALS['t_transients'] = array();
	$GLOBALS['t_caps']       = array();
	$GLOBALS['t_user']       = 0;
}

function add_filter( $tag, $cb, $p = 10, $n = 1 ) {
	$GLOBALS['t_hooks'][ $tag ][ $p ][] = array( $cb, $n );
	return true;
}
function add_action( $tag, $cb, $p = 10, $n = 1 ) {
	return add_filter( $tag, $cb, $p, $n );
}
function has_action( $tag ) {
	return ! empty( $GLOBALS['t_hooks'][ $tag ] );
}
function has_filter( $tag ) {
	return has_action( $tag );
}
function apply_filters( $tag, $value, ...$args ) {
	if ( empty( $GLOBALS['t_hooks'][ $tag ] ) ) {
		return $value;
	}
	$by = $GLOBALS['t_hooks'][ $tag ];
	ksort( $by );
	foreach ( $by as $list ) {
		foreach ( $list as list( $cb, $n ) ) {
			$value = $cb( ...array_slice( array_merge( array( $value ), $args ), 0, $n ) );
		}
	}
	return $value;
}
function do_action( $tag, ...$args ) {
	if ( empty( $GLOBALS['t_hooks'][ $tag ] ) ) {
		return;
	}
	$by = $GLOBALS['t_hooks'][ $tag ];
	ksort( $by );
	foreach ( $by as $list ) {
		foreach ( $list as list( $cb, $n ) ) {
			$cb( ...array_slice( $args, 0, $n ) );
		}
	}
}
function t_hook_callbacks( $tag ) {
	$out = array();
	$by  = $GLOBALS['t_hooks'][ $tag ] ?? array();
	ksort( $by );
	foreach ( $by as $list ) {
		foreach ( $list as $row ) {
			$out[] = $row[0];
		}
	}
	return $out;
}

function get_option( $k, $d = false ) {
	return array_key_exists( $k, $GLOBALS['t_opts'] ) ? $GLOBALS['t_opts'][ $k ] : $d;
}
function update_option( $k, $v, $autoload = null ) {
	$GLOBALS['t_opts'][ $k ] = $v;
	return true;
}
function add_option( $k, $v = '', $dep = '', $autoload = 'yes' ) {
	if ( array_key_exists( $k, $GLOBALS['t_opts'] ) ) {
		return false;
	}
	$GLOBALS['t_opts'][ $k ] = $v;
	return true;
}
function delete_option( $k ) {
	unset( $GLOBALS['t_opts'][ $k ] );
	return true;
}
function get_transient( $k ) {
	return $GLOBALS['t_transients'][ $k ] ?? false;
}
function set_transient( $k, $v, $e = 0 ) {
	$GLOBALS['t_transients'][ $k ] = $v;
	return true;
}
function delete_transient( $k ) {
	unset( $GLOBALS['t_transients'][ $k ] );
	return true;
}
function get_site_transient( $k ) {
	return get_transient( $k );
}
function set_site_transient( $k, $v, $e = 0 ) {
	return set_transient( $k, $v, $e );
}
function delete_site_transient( $k ) {
	return delete_transient( $k );
}

function current_user_can( $cap ) {
	return ! empty( $GLOBALS['t_caps'][ $cap ] );
}
function get_current_user_id() {
	return (int) $GLOBALS['t_user'];
}

function wp_unslash( $v ) {
	return is_string( $v ) ? stripslashes( $v ) : $v;
}
function sanitize_text_field( $v ) {
	return trim( strip_tags( (string) $v ) );
}
function sanitize_key( $v ) {
	return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $v ) );
}
function sanitize_file_name( $v ) {
	return preg_replace( '/[^A-Za-z0-9._-]/', '-', (string) $v );
}
function esc_html( $v ) {
	return htmlspecialchars( (string) $v, ENT_QUOTES, 'UTF-8' );
}
function esc_attr( $v ) {
	return esc_html( $v );
}
function esc_html__( $v, $d = '' ) {
	return esc_html( $v );
}
function esc_url( $u ) {
	$u = (string) $u;
	return preg_match( '#^(https?://|/)#i', $u ) ? htmlspecialchars( $u, ENT_QUOTES, 'UTF-8' ) : '';
}
function esc_url_raw( $u ) {
	return (string) $u;
}
function __( $s, $d = '' ) {
	return $s;
}
function _n( $a, $b, $n, $d = '' ) {
	return 1 === (int) $n ? $a : $b;
}
function wp_json_encode( $v, $f = 0 ) {
	return json_encode( $v, $f );
}
function wp_parse_url( $u, $c = -1 ) {
	return parse_url( $u, $c );
}
function home_url( $p = '' ) {
	return 'https://example.test' . $p;
}
function admin_url( $p = '' ) {
	return 'https://example.test/wp-admin/' . ltrim( $p, '/' );
}
function add_query_arg( $k, $v = null, $url = null ) {
	if ( is_array( $k ) ) {
		$url = $v;
		$q   = $k;
	} else {
		$q = array( $k => $v );
	}
	$frag = '';
	if ( false !== strpos( (string) $url, '#' ) ) {
		list( $url, $frag ) = explode( '#', $url, 2 );
		$frag               = '#' . $frag;
	}
	return $url . ( false === strpos( $url, '?' ) ? '?' : '&' ) . http_build_query( $q ) . $frag;
}
function wp_salt( $s = '' ) {
	return 'test-salt';
}
function nocache_headers() {}
function wp_delete_file( $f ) {
	@unlink( $f );
}
function wp_die( $m = '', $title = '', $args = array() ) {
	throw new T_Die( $m, is_array( $args ) ? ( $args['response'] ?? 0 ) : (int) $args );
}
function wp_send_json( $data ) {
	throw new T_Die( $data, 200 );
}
function wp_safe_redirect( $url ) {
	throw new T_Redirect( $url );
}
function wp_create_nonce( $action = -1 ) {
	return 'nonce-' . md5( (string) $action );
}
function wp_generate_password( $n = 12, $s = true ) {
	return substr( str_repeat( 'a', $n ), 0, $n );
}
function get_bloginfo( $k = '' ) {
	return 'Test Site';
}
function wp_strip_all_tags( $t ) {
	return trim( strip_tags( (string) $t ) );
}
function get_block_wrapper_attributes( $extra = array() ) {
	$out = array();
	foreach ( $extra as $k => $v ) {
		$out[] = esc_attr( $k ) . '="' . esc_attr( $v ) . '"';
	}
	return implode( ' ', $out );
}
function wp_nonce_field( $action = -1, $name = '_wpnonce', $referer = true, $echo = true ) {
	$html = '<input type="hidden" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . wp_create_nonce( $action ) . '">';
	if ( $echo ) {
		echo $html;
	}
	return $html;
}
function esc_textarea( $v ) {
	return esc_html( $v );
}
function wp_unique_id( $p = '' ) {
	static $i = 0;
	return $p . ( ++$i );
}
function sanitize_email( $e ) {
	return filter_var( (string) $e, FILTER_VALIDATE_EMAIL ) ? (string) $e : '';
}
function esc_js( $v ) {
	return addslashes( (string) $v );
}
function is_wp_error( $x ) {
	return $x instanceof WP_Error;
}

defined( 'ARRAY_A' ) || define( 'ARRAY_A', 'ARRAY_A' );
/** A MySQL-flavoured $wpdb on SQLite: enough for INSERT IGNORE, DELETE ... LIKE and prepare(). */
class T_Wpdb {
	public $options = 'wp_options';
	private $pdo;
	public function __construct() {
		$this->pdo = new PDO( 'sqlite::memory:' );
		$this->pdo->exec( 'CREATE TABLE wp_options (option_id INTEGER PRIMARY KEY AUTOINCREMENT, option_name TEXT UNIQUE, option_value TEXT, autoload TEXT)' );
	}
	public function prepare( $sql, ...$args ) {
		if ( 1 === count( $args ) && is_array( $args[0] ) ) {
			$args = $args[0];
		}
		$i = 0;
		return preg_replace_callback(
			'/%[sd]/',
			function ( $m ) use ( &$i, $args ) {
				$v = $args[ $i++ ];
				return '%d' === $m[0] ? (string) (int) $v : $this->pdo->quote( (string) $v );
			},
			$sql
		);
	}
	public function esc_like( $s ) {
		return addcslashes( $s, '_%\\' );
	}
	public function query( $sql ) {
		$sql = str_replace( 'INSERT IGNORE', 'INSERT OR IGNORE', $sql );
		$sql = preg_replace( "/LIKE ('(?:[^']|'')*')/", "LIKE $1 ESCAPE '\\\\'", $sql );
		return $this->pdo->exec( $sql );
	}
	public $last_error = '';
	public function get_results( $sql, $mode = null ) {
		$sql = preg_replace( "/LIKE ('(?:[^']|'')*')/", "LIKE $1 ESCAPE '\\\\'", $sql );
		$st  = $this->pdo->query( $sql );
		return $st ? $st->fetchAll( PDO::FETCH_ASSOC ) : array();
	}
	public function get_var( $sql ) {
		return null; // SHOW TABLES: this plugin has no tables of its own
	}
	public function put( $name, $value, $autoload = 'yes' ) {
		$this->pdo->prepare( 'INSERT OR REPLACE INTO wp_options (option_name, option_value, autoload) VALUES (?, ?, ?)' )->execute( array( $name, $value, $autoload ) );
	}
	public function has( $name ) {
		$st = $this->pdo->prepare( 'SELECT COUNT(*) FROM wp_options WHERE option_name = ?' );
		$st->execute( array( $name ) );
		return (bool) $st->fetchColumn();
	}
	public function count_rows() {
		return (int) $this->pdo->query( 'SELECT COUNT(*) FROM wp_options' )->fetchColumn();
	}
}
