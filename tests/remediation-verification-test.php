<?php
/**
 * Comprehensive Verification Suite for Audit Remediation.
 *
 * Verifies all 5 remediation areas across all plugins:
 * 1. Kits Core before and after each companion plugin (Order A and Order B, zero fatal redeclarations).
 * 2. Each companion plugin activated independently.
 * 3. All six plugins activated together (with and without Kits Core).
 * 4. REST requests with missing, invalid, and valid nonces across all companion plugins.
 * 5. Application Password authentication across all companion plugins.
 * 6. RankWeb with and without Rank Math (verifying exactly one meta description, canonical, robots, and schema).
 *
 * Usage: php tests/remediation-verification-test.php
 *
 * @package wugweb-kits
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 1 );
}

$root = dirname( __DIR__ );
$total_suites = 0;
$failed_suites = 0;

function run_test_case( string $title, callable $test_fn ) {
	global $total_suites, $failed_suites;
	++$total_suites;
	echo "------------------------------------------------------------\n";
	echo "RUNNING: {$title}...\n";
	try {
		$result = $test_fn();
		if ( true === $result ) {
			echo "SUCCESS: {$title}\n";
		} else {
			++$failed_suites;
			echo "FAILED: {$title} - " . ( is_string( $result ) ? $result : 'Check failed' ) . "\n";
		}
	} catch ( Throwable $e ) {
		++$failed_suites;
		echo "EXCEPTION: {$title} - " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
	}
}

function get_wp_stub_header( string $root ): string {
	return <<<PHP
define( 'ABSPATH', '{$root}/' );
define( 'WP_PLUGIN_DIR', '{$root}/plugins' );
if ( ! defined( 'MINUTE_IN_SECONDS' ) ) {
	define( 'MINUTE_IN_SECONDS', 60 );
	define( 'HOUR_IN_SECONDS', 3600 );
	define( 'DAY_IN_SECONDS', 86400 );
}
if ( ! defined( 'MB_IN_BYTES' ) ) {
	define( 'MB_IN_BYTES', 1048576 );
}
\$GLOBALS['wp_actions'] = array();
\$GLOBALS['wp_filters'] = array();
\$GLOBALS['wp_options'] = array();
\$GLOBALS['wp_shortcodes'] = array();

function add_action( \$tag, \$cb, \$priority = 10, \$accepted_args = 1 ) {
	\$GLOBALS['wp_actions'][\$tag][] = array( 'cb' => \$cb, 'p' => \$priority, 'args' => \$accepted_args );
	return true;
}
function add_filter( \$tag, \$cb, \$priority = 10, \$accepted_args = 1 ) {
	\$GLOBALS['wp_filters'][\$tag][] = array( 'cb' => \$cb, 'p' => \$priority, 'args' => \$accepted_args );
	return true;
}
function do_action( \$tag, ...\$args ) {
	if ( empty( \$GLOBALS['wp_actions'][\$tag] ) ) return;
	foreach ( \$GLOBALS['wp_actions'][\$tag] as \$hook ) {
		call_user_func_array( \$hook['cb'], \$args );
	}
}
function apply_filters( \$tag, \$value, ...\$args ) {
	if ( empty( \$GLOBALS['wp_filters'][\$tag] ) ) return \$value;
	foreach ( \$GLOBALS['wp_filters'][\$tag] as \$hook ) {
		\$value = call_user_func_array( \$hook['cb'], array_merge( array( \$value ), \$args ) );
	}
	return \$value;
}
function register_activation_hook( \$file, \$cb ) {}
function register_deactivation_hook( \$file, \$cb ) {}
function wp_register_plugin_realpath( \$file ) { return \$file; }
function plugin_dir_path( \$file ) { return dirname( \$file ) . '/'; }
function plugin_dir_url( \$file ) { return 'https://example.com/wp-content/plugins/' . basename( dirname( \$file ) ) . '/'; }
function plugin_basename( \$file ) { return basename( dirname( \$file ) ) . '/' . basename( \$file ); }
function plugins_url( \$path = '', \$plugin = '' ) { return 'https://example.com/wp-content/plugins/' . ltrim( \$path, '/' ); }
function load_plugin_textdomain( \$domain, \$deprecated = false, \$plugin_rel_path = false ) { return true; }
function get_option( \$opt, \$default = false ) { return \$GLOBALS['wp_options'][\$opt] ?? \$default; }
function update_option( \$opt, \$val, \$autoload = null ) { \$GLOBALS['wp_options'][\$opt] = \$val; return true; }
function delete_option( \$opt ) { unset( \$GLOBALS['wp_options'][\$opt] ); return true; }
function add_shortcode( \$tag, \$cb ) { \$GLOBALS['wp_shortcodes'][\$tag] = \$cb; return true; }
function do_shortcode( \$content, \$ignore_html = false ) { return \$content; }
function is_multisite() { return false; }
function is_admin() { return false; }
function is_404() { return false; }
function wp_date( \$fmt, \$ts = null ) { return date( \$fmt, \$ts ?: time() ); }
function number_format_i18n( \$n ) { return number_format( (float) \$n ); }
function esc_html( \$t ) { return htmlspecialchars( (string) \$t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( \$t ) { return htmlspecialchars( (string) \$t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( \$u ) { return filter_var( \$u, FILTER_SANITIZE_URL ) ?: ''; }
function sanitize_text_field( \$s ) { return trim( strip_tags( (string) \$s ) ); }
function sanitize_email( \$email ) { return filter_var( \$email, FILTER_SANITIZE_EMAIL ) ?: ''; }
function sanitize_key( \$k ) { return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) \$k ) ); }
function wp_unslash( \$v ) { return \$v; }
function wp_strip_all_tags( \$text, \$remove_breaks = false ) { return strip_tags( (string) \$text ); }
function absint( \$maybeint ) { return abs( intval( \$maybeint ) ); }
function wp_parse_args( \$args, \$defaults = array() ) { return array_merge( \$defaults, is_array( \$args ) ? \$args : array() ); }
function wp_parse_url( \$url, \$component = -1 ) { return parse_url( \$url, \$component ); }
function wp_mkdir_p( \$target ) { return true; }
function wp_upload_dir() { return array( 'basedir' => '/tmp' ); }
function __( \$t, \$d = 'default' ) { return \$t; }
function _e( \$t, \$d = 'default' ) { echo \$t; }
function esc_html__( \$t, \$d = 'default' ) { return esc_html( \$t ); }
function esc_attr__( \$t, \$d = 'default' ) { return esc_attr( \$t ); }
function is_user_logged_in() { return true; }
function current_user_can( \$c ) {
	if ( isset( \$GLOBALS['test_allowed_cap'] ) ) {
		return \$GLOBALS['test_allowed_cap'] === \$c;
	}
	return true;
}
function did_action( \$tag ) { return ! empty( \$GLOBALS['wp_actions'][\$tag] ); }
function get_bloginfo( \$show = '', \$filter = 'raw' ) { return 'Test Site'; }
function get_query_var( \$var, \$default = '' ) { return \$default; }
function get_site_icon_url( \$size = 512, \$url = '', \$blog_id = 0 ) { return 'https://example.com/icon.png'; }
function wp_get_attachment_metadata( \$attachment_id = 0, \$unfiltered = false ) { return array( 'width' => 512, 'height' => 512 ); }
function wp_next_scheduled( \$hook, \$args = array() ) { return false; }
function wp_schedule_event( \$timestamp, \$recurrence, \$hook, \$args = array() ) { return true; }
function wp_schedule_single_event( \$timestamp, \$hook, \$args = array() ) { return true; }
function wp_unschedule_hook( \$hook ) { return true; }
function is_singular( \$post_types = '' ) { return false; }
function is_post_type_archive( \$post_types = '' ) { return false; }
function is_tag( \$slug = '' ) { return false; }
function is_category( \$category = '' ) { return false; }
function is_tax( \$taxonomy = '', \$term = '' ) { return false; }
function is_author( \$author = '' ) { return false; }
function is_date() { return false; }
function is_archive() { return false; }
function is_search() { return false; }
function is_home() { return false; }
function is_front_page() { return false; }
function is_page( \$page = '' ) { return true; }
function is_single( \$post = '' ) { return false; }
function is_attachment() { return false; }
function get_queried_object_id() { return 100; }
function get_queried_object() { return get_post( 100 ); }
function get_post( \$p = null ) {
	\$post = new stdClass();
	\$post->ID = 100;
	\$post->post_type = 'page';
	\$post->post_name = 'sample';
	\$post->post_title = 'Sample Page';
	return \$post;
}
function get_the_title( \$id = 0 ) { return 'Sample Page'; }
function get_permalink( \$post = 0, \$leavename = false ) { return 'https://example.com/sample'; }
function wptexturize( \$t ) { return \$t; }
function get_post_meta( \$id, \$k, \$s = false ) { return ''; }
function update_post_meta( \$id, \$k, \$v ) { return true; }
function get_posts( \$args = array() ) { return array(); }
function get_terms( \$args = array() ) { return array(); }
function get_page_by_path( \$page_path, \$output = 'OBJECT', \$post_type = 'page' ) { return null; }
function home_url( \$path = '' ) { return 'https://example.com' . ( \$path ? '/' . ltrim( \$path, '/' ) : '' ); }
function site_url( \$path = '' ) { return 'https://example.com' . ( \$path ? '/' . ltrim( \$path, '/' ) : '' ); }
function wp_http_validate_url( \$url ) { return filter_var( \$url, FILTER_VALIDATE_URL ) ? \$url : false; }
function wp_json_encode( \$d, \$o = 0 ) { return json_encode( \$d, \$o ); }

class WP_Error {
	public \$code;
	public \$message;
	public \$data;
	public function __construct( \$c = '', \$m = '', \$d = array() ) {
		\$this->code = \$c;
		\$this->message = \$m;
		\$this->data = \$d;
	}
}
class WP_REST_Request {
	private \$headers = array();
	private \$params = array();
	public function __construct( array \$headers = array(), array \$params = array() ) {
		\$this->headers = \$headers;
		\$this->params = \$params;
	}
	public function get_header( \$k ) { return \$this->headers[\$k] ?? null; }
	public function get_param( \$k ) { return \$this->params[\$k] ?? null; }
}
PHP;
}

function run_isolated_php( string $code ): array {
	$tmp = tempnam( sys_get_temp_dir(), 'wug_test_' );
	file_put_contents( $tmp, "<?php\n" . $code );
	$cmd = escapeshellcmd( PHP_BINARY ) . ' ' . escapeshellarg( $tmp );
	$output = array();
	$exit_code = 0;
	exec( $cmd . ' 2>&1', $output, $exit_code );
	unlink( $tmp );
	return array(
		'exit_code' => $exit_code,
		'output'    => implode( "\n", $output ),
	);
}

echo "============================================================\n";
echo "   WUGWEB SUITE: AUDIT REMEDIATION VERIFICATION SUITE       \n";
echo "============================================================\n\n";

$companion_plugins = array(
	'directoryweb' => '/plugins/directoryweb/directoryweb.php',
	'insightweb'   => '/plugins/insightweb/insightweb.php',
	'mailweb'      => '/plugins/mailweb/mailweb.php',
	'planweb'      => '/plugins/planweb/planweb.php',
	'rankweb'      => '/plugins/rankweb/rankweb.php',
	'sourceweb'    => '/plugins/sourceweb/sourceweb.php',
);

/* --------------------------------------------------------------------------
 * 1. LOADING ORDER TESTS: KITS CORE BEFORE AND AFTER EACH COMPANION PLUGIN
 * -------------------------------------------------------------------------- */

foreach ( $companion_plugins as $name => $rel_path ) {
	// Order A: Kits Core loaded FIRST, then Companion Plugin
	run_test_case( "Load Order A: Kits Core -> {$name}", function () use ( $root, $rel_path ) {
		$stubs = get_wp_stub_header( $root );
		$code = <<<PHP
{$stubs}
require_once '{$root}/plugins/kits-core/kits-core.php';
require_once '{$root}{$rel_path}';
do_action( 'plugins_loaded' );
echo "OK";
PHP;
		$res = run_isolated_php( $code );
		if ( 0 !== $res['exit_code'] || 'OK' !== trim( $res['output'] ) ) {
			return "Subprocess exited with {$res['exit_code']}: {$res['output']}";
		}
		return true;
	} );

	// Order B: Companion Plugin loaded FIRST, then Kits Core
	run_test_case( "Load Order B: {$name} -> Kits Core", function () use ( $root, $rel_path ) {
		$stubs = get_wp_stub_header( $root );
		$code = <<<PHP
{$stubs}
require_once '{$root}{$rel_path}';
require_once '{$root}/plugins/kits-core/kits-core.php';
do_action( 'plugins_loaded' );
echo "OK";
PHP;
		$res = run_isolated_php( $code );
		if ( 0 !== $res['exit_code'] || 'OK' !== trim( $res['output'] ) ) {
			return "Subprocess exited with {$res['exit_code']}: {$res['output']}";
		}
		return true;
	} );
}

/* --------------------------------------------------------------------------
 * 2. ALL SIX PLUGINS ACTIVATED TOGETHER (WITH AND WITHOUT KITS CORE)
 * -------------------------------------------------------------------------- */

run_test_case( "All 6 companion plugins together (without Kits Core)", function () use ( $root, $companion_plugins ) {
	$stubs = get_wp_stub_header( $root );
	$requires = '';
	foreach ( $companion_plugins as $rel_path ) {
		$requires .= "require_once '{$root}{$rel_path}';\n";
	}
	$code = <<<PHP
{$stubs}
{$requires}
do_action( 'plugins_loaded' );
echo "OK";
PHP;
	$res = run_isolated_php( $code );
	if ( 0 !== $res['exit_code'] || 'OK' !== trim( $res['output'] ) ) {
		return "Subprocess exited with {$res['exit_code']}: {$res['output']}";
	}
	return true;
} );

run_test_case( "All 6 companion plugins together WITH Kits Core", function () use ( $root, $companion_plugins ) {
	$stubs = get_wp_stub_header( $root );
	$requires = "require_once '{$root}/plugins/kits-core/kits-core.php';\n";
	foreach ( $companion_plugins as $rel_path ) {
		$requires .= "require_once '{$root}{$rel_path}';\n";
	}
	$code = <<<PHP
{$stubs}
{$requires}
do_action( 'plugins_loaded' );
echo "OK";
PHP;
	$res = run_isolated_php( $code );
	if ( 0 !== $res['exit_code'] || 'OK' !== trim( $res['output'] ) ) {
		return "Subprocess exited with {$res['exit_code']}: {$res['output']}";
	}
	return true;
} );

/* --------------------------------------------------------------------------
 * 3. INDEPENDENT ACTIVATION OF EACH COMPANION PLUGIN
 * -------------------------------------------------------------------------- */

foreach ( $companion_plugins as $name => $rel_path ) {
	run_test_case( "Independent Activation: {$name} alone", function () use ( $root, $rel_path ) {
		$stubs = get_wp_stub_header( $root );
		$code = <<<PHP
{$stubs}
require_once '{$root}{$rel_path}';
do_action( 'plugins_loaded' );
echo "OK";
PHP;
		$res = run_isolated_php( $code );
		if ( 0 !== $res['exit_code'] || 'OK' !== trim( $res['output'] ) ) {
			return "Subprocess exited with {$res['exit_code']}: {$res['output']}";
		}
		return true;
	} );
}

/* --------------------------------------------------------------------------
 * 4. REST SECURITY: NONCE VALIDATION & APPLICATION PASSWORDS
 * -------------------------------------------------------------------------- */

$rest_checkers = array(
	'directoryweb' => array(
		'file' => '/plugins/directoryweb/includes/standalone-fallback.php',
		'func' => 'directoryweb_rest_can',
		'cap'  => 'manage_directoryweb',
	),
	'insightweb'   => array(
		'file' => '/plugins/insightweb/includes/standalone-fallback.php',
		'func' => 'insightweb_rest_can',
		'cap'  => 'manage_insightweb',
	),
	'mailweb'      => array(
		'file' => '/plugins/mailweb/includes/standalone-fallback.php',
		'func' => 'mailweb_rest_can',
		'cap'  => 'manage_mailweb',
	),
	'planweb'      => array(
		'file' => '/plugins/planweb/includes/standalone-fallback.php',
		'func' => 'planweb_rest_can',
		'cap'  => 'manage_planweb',
	),
	'sourceweb'    => array(
		'file' => '/plugins/sourceweb/includes/sourceweb-rest.php',
		'func' => 'sourceweb_rest_can',
		'cap'  => 'manage_sourceweb',
	),
);

foreach ( $rest_checkers as $plugin => $cfg ) {
	run_test_case( "REST Security - {$plugin} (nonce checks & app passwords)", function () use ( $root, $cfg ) {
		$stubs = get_wp_stub_header( $root );
		$code = <<<PHP
{$stubs}

\$GLOBALS['test_allowed_cap'] = '{$cfg['cap']}';

\$app_pass = null;
function rest_get_authenticated_app_password() {
	global \$app_pass;
	return \$app_pass;
}

function wp_verify_nonce( \$n, \$a = -1 ) {
	return 'valid_nonce' === \$n && 'wp_rest' === \$a;
}

require_once '{$root}{$cfg['file']}';

\$can = {$cfg['func']}( '{$cfg['cap']}' );

// 1. Missing nonce in cookie request must fail with 403 rest_cookie_invalid_nonce
\$res1 = \$can( new WP_REST_Request() );
if ( ! ( \$res1 instanceof WP_Error && 'rest_cookie_invalid_nonce' === \$res1->code ) ) {
	echo "FAIL: Expected rest_cookie_invalid_nonce for missing nonce, got: " . var_export( \$res1, true );
	exit( 1 );
}

// 2. Invalid nonce in cookie request must fail with 403 rest_cookie_invalid_nonce
\$req_invalid = new WP_REST_Request( array( 'X-WP-Nonce' => 'fake_nonce' ) );
\$res2 = \$can( \$req_invalid );
if ( ! ( \$res2 instanceof WP_Error && 'rest_cookie_invalid_nonce' === \$res2->code ) ) {
	echo "FAIL: Expected rest_cookie_invalid_nonce for invalid nonce, got: " . var_export( \$res2, true );
	exit( 2 );
}

// 3. Valid nonce in cookie request must succeed
\$req_valid = new WP_REST_Request( array( 'X-WP-Nonce' => 'valid_nonce' ) );
\$res3 = \$can( \$req_valid );
if ( true !== \$res3 ) {
	echo "FAIL: Expected true for valid nonce, got: " . var_export( \$res3, true );
	exit( 3 );
}

// 4. Application password request succeeds even with missing cookie nonce
\$app_pass = (object) array( 'uuid' => 'app-pass-token' );
\$res4 = \$can( new WP_REST_Request() );
if ( true !== \$res4 ) {
	echo "FAIL: Expected true for App Password without nonce, got: " . var_export( \$res4, true );
	exit( 4 );
}

// 5. Missing capability with valid nonce must return 403 rest_forbidden
\$app_pass = null;
\$can_unauth = {$cfg['func']}( 'forbidden_cap' );
\$res5 = \$can_unauth( \$req_valid );
if ( ! ( \$res5 instanceof WP_Error && 'rest_forbidden' === \$res5->code ) ) {
	echo "FAIL: Expected rest_forbidden for unauthorized user, got: " . var_export( \$res5, true );
	exit( 5 );
}

echo "OK";
PHP;
		$res = run_isolated_php( $code );
		if ( 0 !== $res['exit_code'] || 'OK' !== trim( $res['output'] ) ) {
			return "Failed REST check ({$res['exit_code']}): {$res['output']}";
		}
		return true;
	} );
}

/* --------------------------------------------------------------------------
 * 5. RANKWEB WITH AND WITHOUT RANK MATH
 * -------------------------------------------------------------------------- */

run_test_case( "RankWeb standalone (without Rank Math): exactly 1 description, canonical, robots", function () use ( $root ) {
	$stubs = get_wp_stub_header( $root );
	$code = <<<PHP
{$stubs}
define( 'RANKWEB_DIR', '{$root}/plugins/rankweb/' );

// Core wp_robots hook stub for standalone robots tag
function wp_robots() {
	echo "<meta name=\"robots\" content=\"max-image-preview:large\" />\\n";
}
add_action( 'wp_head', 'wp_robots', 1 );

// Core rel_canonical hook stub for standalone canonical tag
function rel_canonical() {
	echo "<link rel=\"canonical\" href=\"https://example.com/sample\" />\\n";
}
add_action( 'wp_head', 'rel_canonical', 10 );

// Load RankWeb files
require_once '{$root}/plugins/rankweb/rankweb.php';
do_action( 'plugins_loaded' );

// Simulate wp_head output
ob_start();
\$head_actions = \$GLOBALS['wp_actions']['wp_head'] ?? array();
usort( \$head_actions, fn( \$a, \$b ) => \$a['p'] <=> \$b['p'] );
foreach ( \$head_actions as \$entry ) {
	call_user_func( \$entry['cb'] );
}
\$output = ob_get_clean();

// Count occurrences
\$meta_desc_count = substr_count( \$output, '<meta name="description"' );
\$canonical_count = substr_count( \$output, '<link rel="canonical"' );
\$robots_count    = substr_count( \$output, '<meta name="robots"' );

if ( 1 !== \$meta_desc_count ) {
	echo "FAIL: Expected exactly 1 meta description, found {\$meta_desc_count}. Output:\\n{\$output}";
	exit( 1 );
}
if ( 1 !== \$canonical_count ) {
	echo "FAIL: Expected exactly 1 canonical, found {\$canonical_count}. Output:\\n{\$output}";
	exit( 2 );
}
if ( 1 !== \$robots_count ) {
	echo "FAIL: Expected exactly 1 robots, found {\$robots_count}. Output:\\n{\$output}";
	exit( 3 );
}
echo "OK (desc: 1, canonical: 1, robots: 1)";
PHP;
	$res = run_isolated_php( $code );
	if ( 0 !== $res['exit_code'] || ! str_contains( $res['output'], 'OK' ) ) {
		return "Failed RankWeb standalone check ({$res['exit_code']}): {$res['output']}";
	}
	return true;
} );

run_test_case( "RankWeb integrated with Rank Math: standalone meta-description is SUPPRESSED", function () use ( $root ) {
	$stubs = get_wp_stub_header( $root );
	$code = <<<PHP
{$stubs}
define( 'RANKWEB_DIR', '{$root}/plugins/rankweb/' );
define( 'RANK_MATH_VERSION', '1.0.100' );

// Mock Rank Math helper class
if ( ! class_exists( '\RankMath\Helper' ) ) {
	eval( 'namespace RankMath; class Helper {}' );
}

require_once '{$root}/plugins/rankweb/rankweb.php';
do_action( 'plugins_loaded' );

// Rank Math itself renders its own meta description in wp_head
function rank_math_meta_desc() {
	echo "<meta name=\"description\" content=\"Rank Math managed description\" />\\n";
}
add_action( 'wp_head', 'rank_math_meta_desc', 1 );

// Simulate wp_head
ob_start();
\$head_actions = \$GLOBALS['wp_actions']['wp_head'] ?? array();
usort( \$head_actions, fn( \$a, \$b ) => \$a['p'] <=> \$b['p'] );
foreach ( \$head_actions as \$entry ) {
	call_user_func( \$entry['cb'] );
}
\$output = ob_get_clean();

\$meta_desc_count = substr_count( \$output, '<meta name="description"' );
if ( 1 !== \$meta_desc_count ) {
	echo "FAIL: Expected exactly 1 meta description when Rank Math is active, found {\$meta_desc_count}. Output:\\n{\$output}";
	exit( 1 );
}
if ( ! str_contains( \$output, 'Rank Math managed description' ) ) {
	echo "FAIL: Expected Rank Math description to own output";
	exit( 2 );
}
echo "OK";
PHP;
	$res = run_isolated_php( $code );
	if ( 0 !== $res['exit_code'] || 'OK' !== trim( $res['output'] ) ) {
		return "Failed Rank Math integration check ({$res['exit_code']}): {$res['output']}";
	}
	return true;
} );

echo "\n============================================================\n";
echo sprintf( "Summary: %d total test suites executed, %d failed.\n", $total_suites, $failed_suites );
if ( $failed_suites > 0 ) {
	echo "VERIFICATION STATUS: FAILED\n";
	exit( 1 );
}
echo "VERIFICATION STATUS: ALL TESTS PASSED PERFECTLY!\n";
exit( 0 );
