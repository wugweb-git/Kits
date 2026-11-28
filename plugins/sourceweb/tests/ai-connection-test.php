<?php
/**
 * AI connections (28 Nov 2026): nothing about a provider, address, model or key is in the code. Checks, with small
 * WordPress stubs: the generic connection path, the no-key behaviour (nothing offered, no notice), the one-time
 * migration of saved rows (idempotent), the core AI client path when WordPress 7.0's client is there, and that no
 * provider name or address is written in the plugin.
 *
 * Usage: php plugins/sourceweb/tests/ai-connection-test.php
 *
 * The core-client checks run last: once a stub wp_ai_client_prompt() is defined it stays defined for the process.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, Universal.Files.SeparateFunctionsFromOO -- a command-line test runner with stubs.

defined( 'DAY_IN_SECONDS' ) || define( 'DAY_IN_SECONDS', 86400 );
defined( 'SOURCEWEB_SRC_SCREEN' ) || define( 'SOURCEWEB_SRC_SCREEN', 'toplevel_page_aw-sourcing' );
if ( ! function_exists( 'wp_parse_url' ) ) {
	function wp_parse_url( $url, $component = -1 ) { // stand-in: WordPress's wrapper around parse_url()
		return parse_url( $url, $component );
	}
}

$GLOBALS['t_options'] = array();
$GLOBALS['t_hooks']   = array();
$GLOBALS['t_http']    = array(); // each outgoing request: url, args
$GLOBALS['t_reply']   = array( 'code' => 200, 'body' => '{}', 'headers' => array() ); // what the next request answers
$GLOBALS['t_events']  = array();

class WP_Error {
	public $code;
	public $message;
	public function __construct( $code = '', $message = '' ) {
		$this->code    = $code;
		$this->message = $message;
	}
}
function is_wp_error( $v ) {
	return $v instanceof WP_Error;
}
function add_action( $hook, $cb = null, $p = 10, $n = 1 ) {
	$GLOBALS['t_hooks'][] = $hook;
}
function add_filter( $hook, $cb = null, $p = 10, $n = 1 ) {
	$GLOBALS['t_hooks'][] = $hook;
}
function apply_filters( $hook, $value ) {
	return $value;
}
function get_option( $k, $d = false ) {
	return array_key_exists( $k, $GLOBALS['t_options'] ) ? $GLOBALS['t_options'][ $k ] : $d;
}
function update_option( $k, $v, $a = null ) {
	$GLOBALS['t_options'][ $k ] = $v;
	return true;
}
function wp_cache_delete( $k, $g = '' ) {
	return true;
}
function sanitize_key( $s ) {
	return strtolower( preg_replace( '/[^a-zA-Z0-9_\-]/', '', (string) $s ) );
}
function sanitize_text_field( $s ) {
	return trim( strip_tags( (string) $s ) );
}
function esc_url_raw( $u, $protocols = null ) {
	return filter_var( $u, FILTER_VALIDATE_URL ) ? $u : '';
}
function wp_json_encode( $v ) {
	return json_encode( $v );
}
function wp_list_pluck( $list, $field ) {
	return array_column( $list, $field );
}
function wp_next_scheduled( $h ) {
	return false;
}
function wp_schedule_single_event( $t, $h ) {
	$GLOBALS['t_events'][] = $h;
}
function spawn_cron() {}
function sourceweb_src_log( $a, $b ) {}
function number_format_i18n( $n ) {
	return (string) $n;
}
function wp_date( $f, $t = null ) {
	return gmdate( $f, $t ?? time() );
}
function wp_remote_post( $url, $args = array() ) {
	$GLOBALS['t_http'][] = array( $url, $args );
	return $GLOBALS['t_reply'];
}
function wp_remote_retrieve_response_code( $r ) {
	return $r['code'];
}
function wp_remote_retrieve_body( $r ) {
	return $r['body'];
}
function wp_remote_retrieve_headers( $r ) {
	return $r['headers'];
}

$root = dirname( __DIR__ );
define( 'SOURCEWEB_SOURCING_DIR', $root . '/' );
require $root . '/includes/ai/ai-jobs.php';
require $root . '/includes/ai/ai-keys.php';
require $root . '/includes/ai/ai-core-client.php';
require $root . '/includes/lifecycle/ai-connection-migrate.php';

$fails = 0;
$count = 0;
function t( $ok, $what ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		fwrite( STDERR, "FAIL: $what\n" );
	}
}
function reset_state() {
	$GLOBALS['t_options'] = array();
	$GLOBALS['t_http']    = array();
	$GLOBALS['t_reply']   = array( 'code' => 200, 'body' => '{}', 'headers' => array() );
}

// ---- A brand-new tenant: no connection, no core client ----
reset_state();
t( ! function_exists( 'wp_ai_client_prompt' ), 'setup: the core client is not defined yet' );
t( array() === sourceweb_ai_rows() || array() === array_filter( sourceweb_ai_rows() ), 'new tenant: no saved connection' );
t( '' === sourceweb_ai_text_source(), 'new tenant: no source for text tasks' );
t( null === sourceweb_ai_generate_text( 'hello' ), 'no key: generate_text returns null, so the feature is skipped' );
t( array() === $GLOBALS['t_http'], 'no key: nothing is sent anywhere' );
t( array( 'rows' => array(), 'tools' => array() ) === sourceweb_ai_served(), 'no key: the workers are served nothing' );
t( ! array_intersect( $GLOBALS['t_hooks'], array( 'admin_notices', 'all_admin_notices', 'network_admin_notices', 'user_admin_notices' ) ), 'no key: no admin notice hook is registered by the AI files' );

// ---- Generic path: a connection the administrator entered ----
$res = sourceweb_ai_keys_add( 'k-test-0001', 'My router', array(), null, false, array( 'url' => 'https://llm.example.test/v1/', 'model' => 'm-one', 'kind' => 'ai' ) );
t( true === $res['saved'] && 1 === count( $res['added'] ), 'add: a key with its own address and model is saved' );
$row = sourceweb_ai_rows()[0];
t( 'https://llm.example.test/v1' === $row['url'] && 'm-one' === $row['model'] && 'ai' === $row['kind'] && 'myrouter' === $row['provider'] && 'unchecked' === $row['status'], 'add: address (no trailing slash), model, kind and an id from the label are stored per site' );
$GLOBALS['t_reply'] = array( 'code' => 200, 'body' => '{"choices":[{"message":{"content":"ok"}}]}', 'headers' => array( 'x-ratelimit-remaining-requests' => '9', 'x-ratelimit-limit-requests' => '10' ) );
$rows               = sourceweb_ai_rows();
$checked            = sourceweb_ai_check( $rows[0] );
t( 'works' === $checked['status'] && 'https://llm.example.test/v1/chat/completions' === $GLOBALS['t_http'][0][0], 'check: the test goes to the saved address, once' );
t( 'm-one' === json_decode( $GLOBALS['t_http'][0][1]['body'], true )['model'] && 1 === count( $GLOBALS['t_http'] ), 'check: with the saved model, no fallback list' );
t( false !== strpos( $checked['limits'], 'Requests: 9 of 10 left' ), 'check: limits are read from the answer' );
$GLOBALS['t_reply']['code'] = 401;
t( 'invalid' === sourceweb_ai_check( $rows[0] )['status'], 'check: a refused key is marked refused' );
$GLOBALS['t_reply']['code'] = 429;
t( 'limited' === sourceweb_ai_check( $rows[0] )['status'], 'check: a rate limit is not a failure' );
$GLOBALS['t_options']['aw_ai_models'][0] = $checked;
t( 'connection' === sourceweb_ai_text_source(), 'generic path: a working saved connection answers text tasks when there is no core client' );
$GLOBALS['t_http']  = array();
$GLOBALS['t_reply'] = array( 'code' => 200, 'body' => '{"choices":[{"message":{"content":"from connection"}}]}', 'headers' => array() );
t( 'from connection' === sourceweb_ai_generate_text( 'say it' ), 'generic path: generate_text returns the answer' );
t( 'https://llm.example.test/v1/chat/completions' === $GLOBALS['t_http'][0][0] && 'Bearer k-test-0001' === $GLOBALS['t_http'][0][1]['headers']['Authorization'], 'generic path: the saved address and key are used' );
$served = sourceweb_ai_served();
t( 1 === count( $served['rows'] ) && 'https://llm.example.test/v1/chat/completions' === $served['rows'][0]['url'] && 'm-one' === $served['rows'][0]['model'] && 'myrouter' === $served['rows'][0]['provider'], 'workers: they get this site\'s address, model, id and key' );
$GLOBALS['t_reply'] = array( 'code' => 500, 'body' => '{}', 'headers' => array() );
t( is_wp_error( sourceweb_ai_generate_text( 'x' ) ), 'generic path: a failed call is an error, not text' );

// A tool connection: label, address, key; never tested as a model.
$GLOBALS['t_http'] = array();
sourceweb_ai_keys_add( 'tool-key-1', 'Page reader', array(), null, false, array( 'url' => 'https://tools.example.test', 'kind' => 'tool', 'model' => 'ignored' ) );
$rows = sourceweb_ai_rows();
$tool = $rows[1];
t( 'tool' === $tool['kind'] && '' === $tool['model'] && 'pagereader' === $tool['provider'], 'tool: kind tool, no model, id from the label' );
t( 'tool' === sourceweb_ai_check( $tool )['status'] && array() === $GLOBALS['t_http'], 'tool: no request is made to test it' );
$GLOBALS['t_options']['aw_ai_models'][1] = sourceweb_ai_check( $tool );
$served                                  = sourceweb_ai_served();
t( 1 === count( $served['tools'] ) && 'pagereader' === $served['tools'][0]['provider'] && 'https://tools.example.test' === $served['tools'][0]['url'], 'tool: the workers get it by its id and address' );

// A row without an address cannot be tested.
$blank = sourceweb_ai_blank_row( 'lonely' );
t( 'incomplete' === sourceweb_ai_check( $blank )['status'], 'check: no address or model is "incomplete", not a guess' );
t( '' === sourceweb_ai_clean_url( 'ftp://x.test' ) && '' === sourceweb_ai_clean_url( 'not a url' ), 'address: only web addresses are kept' );

// ---- Migration ----
reset_state();
$old = array(
	array( 'key' => 'A1', 'provider' => 'aprov', 'model' => 'old-model', 'url' => 'https://old.example.test/api/v1', 'status' => 'works', 'checked' => 5, 'label' => 'note', 'workers' => array( 'sourcing' ) ),
	array( 'key' => 'B2', 'provider' => 'ownclient', 'model' => 'x-flash', 'url' => '', 'status' => 'works', 'checked' => 5 ),
	array( 'key' => 'C3', 'provider' => 'toolid', 'model' => '', 'url' => '', 'status' => 'tool', 'checked' => 5 ),
	array( 'key' => 'D4', 'provider' => '', 'model' => '', 'url' => '', 'status' => 'unchecked', 'checked' => 0 ),
);
update_option( 'aw_ai_models', $old );
sourceweb_ai_migrate_connections();
$m = get_option( 'aw_ai_models' );
t( 'ai' === $m[0]['kind'] && 'https://old.example.test/api/v1' === $m[0]['url'] && 'old-model' === $m[0]['model'] && 'aprov' === $m[0]['provider'] && 'note' === $m[0]['label'] && array( 'sourcing' ) === $m[0]['workers'], 'migration: a saved row\'s own address and model become its connection fields, nothing else changes' );
t( '' === $m[1]['url'] && 'x-flash' === $m[1]['model'] && 'ownclient' === $m[1]['provider'] && 'works' === $m[1]['status'], 'migration: a row with no address keeps its id, model and status, so the workers read it as before' );
t( 'tool' === $m[2]['kind'] && '' === $m[2]['model'] && 'toolid' === $m[2]['provider'], 'migration: a tool row becomes kind tool' );
t( 'ai' === $m[3]['kind'], 'migration: a never-checked row becomes an AI row' );
t( '1' === get_option( SOURCEWEB_AI_CONN_MIGRATED_OPTION ), 'migration: marked done' );
t( $m === sourceweb_ai_migrate_rows( $m ), 'migration: running the row step again changes nothing' );
update_option( 'aw_ai_models', array( array( 'key' => 'Z', 'status' => 'unchecked', 'checked' => 0, 'provider' => '', 'model' => '' ) ) );
sourceweb_ai_migrate_connections();
t( ! isset( get_option( 'aw_ai_models' )[0]['kind'] ), 'migration: once done it does not run again' );
reset_state();
sourceweb_ai_migrate_connections();
t( null === get_option( 'aw_ai_models', null ) && '1' === get_option( SOURCEWEB_AI_CONN_MIGRATED_OPTION ), 'migration: a new tenant has nothing to migrate and no option is created for rows' );
$served = null;
update_option( 'aw_ai_models', $m );
$served = sourceweb_ai_served();
t( 'aprov' === $served['rows'][0]['provider'] && 'https://old.example.test/api/v1/chat/completions' === $served['rows'][0]['url'] && 'ownclient' === $served['rows'][1]['provider'] && '' === $served['rows'][1]['url'], 'migration: after it, the workers are served the same ids, models and addresses as before' );

// ---- No hardcoded provider, address or model in the plugin ----
$bad   = '/openrouter|requesty|cline\.bot|commandcode|nvidia|vercel|hugging ?face|sambanova|groq|generativelanguage|mistral|cerebras|firecrawl|tinyfish|anthropic|openai\.com|api\.openai|gemini|AI_PROVIDERS|AI_TOOLS/i';
$found = array();
$it    = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root . '/includes', FilesystemIterator::SKIP_DOTS ) );
$files = 0;
foreach ( $it as $f ) {
	if ( 'php' !== $f->getExtension() ) {
		continue;
	}
	++$files;
	if ( preg_match( $bad, (string) file_get_contents( $f->getPathname() ), $mm ) ) {
		$found[] = substr( $f->getPathname(), strlen( $root ) ) . ' (' . $mm[0] . ')';
	}
}
t( $files > 50 && array() === $found, 'no provider name or address in includes/: ' . implode( ', ', $found ) );
t( ! preg_match( $bad, (string) file_get_contents( $root . '/sourceweb.php' ) ), 'no provider name or address in sourceweb.php' );

// ---- The core AI client (WordPress 7.0+) ----
class T_Prompt {
	public static $supported = true;
	public static $throw     = false;
	public static $log       = array();
	private $prompt;
	public function __construct( $p ) {
		$this->prompt = $p;
	}
	public function is_supported_for_text_generation() {
		self::$log[] = 'supported?';
		return self::$supported;
	}
	public function using_model_preference( $m ) {
		self::$log[] = 'pref:' . $m;
		return $this;
	}
	public function generate_text() {
		self::$log[] = 'generate:' . $this->prompt;
		return 'from core';
	}
}
if ( ! defined( 'T_NEVER_DEFINED' ) ) { // inside a block, so the function exists only from here on (a top-level function is hoisted)
	function wp_ai_client_prompt( $p = '' ) {
		if ( T_Prompt::$throw ) {
			throw new RuntimeException( 'prevented' );
		}
		return new T_Prompt( $p );
	}
}

reset_state();
update_option( 'aw_ai_models', $m );
$GLOBALS['t_http'] = array();
t( sourceweb_ai_core_ready() && 'core' === sourceweb_ai_text_source(), 'core client: chosen when it is there and supports text' );
T_Prompt::$log = array();
t( 'from core' === sourceweb_ai_generate_text( 'write' ), 'core client: generate_text returns its text' );
t( array() === $GLOBALS['t_http'], 'core client: no request to a saved connection' );
t( array( 'supported?', 'supported?', 'generate:write' ) === array_slice( T_Prompt::$log, 0, 3 ) || in_array( 'generate:write', T_Prompt::$log, true ), 'core client: it is asked to generate' );
t( ! array_filter( T_Prompt::$log, fn( $l ) => 0 === strpos( $l, 'pref:' ) ), 'core client: with no preference saved, no model is named' );
update_option( SOURCEWEB_AI_MODEL_PREFERENCE_OPTION, 'some-model' );
T_Prompt::$log = array();
sourceweb_ai_generate_text( 'write' );
t( in_array( 'pref:some-model', T_Prompt::$log, true ), 'core client: the administrator\'s model preference is passed as a preference' );
T_Prompt::$supported = false;
t( ! sourceweb_ai_core_ready() && 'connection' === sourceweb_ai_text_source(), 'core client: not supported, so the saved connection is used' );
T_Prompt::$throw = true;
t( ! sourceweb_ai_core_ready(), 'core client: switched off (it throws), so it is not used' );
T_Prompt::$throw     = false;
T_Prompt::$supported = true;
reset_state();
t( 'core' === sourceweb_ai_text_source() && 'from core' === sourceweb_ai_generate_text( 'x' ), 'core client: works with no saved key at all' );
t( '' === sourceweb_ai_model_preference(), 'core client: the model preference is empty by default' );

fwrite( STDOUT, "$count checks, $fails failed\n" );
exit( $fails ? 1 : 0 );
