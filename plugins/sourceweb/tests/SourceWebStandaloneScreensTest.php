<?php
/**
 * Tests for SourceWeb's standalone screens (0.3.0): the nine screens that work without Kits Core and the forms behind
 * them. No WordPress: the few functions the code calls are stubbed. What is checked here is the part that does not
 * need a page: every change is a POST with a capability check and a nonce, the keyword, route and section saves do
 * what they say, and a form can never name a stored route's test.
 *
 * Usage: php plugins/sourceweb/tests/SourceWebStandaloneScreensTest.php
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security, Squiz.Commenting, Generic.Files.OneObjectStructurePerFile -- a command-line test with stubs.

define( 'MINUTE_IN_SECONDS', 60 );
define( 'AW_REVIEW_CAP', 'manage_sourceweb' );
define( 'AW_ENRICH_CAP', 'manage_sourceweb' );

$GLOBALS['t_options']   = array();
$GLOBALS['t_trans']     = array();
$GLOBALS['t_hooks']     = array();
$GLOBALS['t_can']       = true;
$GLOBALS['t_nonce']     = array();
$GLOBALS['t_nonce_bad'] = false;

class T_Die extends Exception {}
class T_Redirect extends Exception {}
class T_Nonce extends Exception {}

function add_action( $hook, $cb, $p = 10, $n = 1 ) {
	$GLOBALS['t_hooks'][ $hook ] = $cb;
}
function add_filter( $hook, $cb, $p = 10, $n = 1 ) {}
function apply_filters( $h, $v ) {
	return $v;
}
function get_option( $k, $d = false ) {
	return $GLOBALS['t_options'][ $k ] ?? $d;
}
function update_option( $k, $v, $a = null ) {
	$GLOBALS['t_options'][ $k ] = $v;
	return true;
}
function get_transient( $k ) {
	return $GLOBALS['t_trans'][ $k ] ?? false;
}
function set_transient( $k, $v, $e = 0 ) {
	$GLOBALS['t_trans'][ $k ] = $v;
	return true;
}
function delete_transient( $k ) {
	unset( $GLOBALS['t_trans'][ $k ] );
	return true;
}
function get_current_user_id() {
	return 7;
}
function wp_get_current_user() {
	return (object) array( 'display_name' => 'Tester', 'user_login' => 'tester' );
}
function current_time( $t ) {
	return 'Y-m-d' === $t ? '2026-11-27' : '2026-11-27 10:00:00';
}
function current_user_can( $cap ) {
	return $GLOBALS['t_can'];
}
function wp_die( $m = '', $code = 0 ) {
	throw new T_Die( (string) $code );
}
function check_admin_referer( $a ) {
	$GLOBALS['t_nonce'][] = $a;
	if ( $GLOBALS['t_nonce_bad'] ) {
		throw new T_Nonce( $a );
	}
	return 1;
}
function wp_safe_redirect( $url ) {
	throw new T_Redirect( $url );
}
function admin_url( $p = '' ) {
	return 'http://example.test/wp-admin/' . $p;
}
function sourceweb_ui_url( $screen ) {
	return 'http://example.test/wp-admin/admin.php?page=aw-sourcing&tab=' . $screen;
}
function wp_parse_url( $u, $c = -1 ) {
	return parse_url( $u, $c );
}
function add_query_arg( $args, $url ) {
	$q = parse_url( $url, PHP_URL_QUERY );
	$pairs = array();
	foreach ( $args as $k => $v ) { // as WordPress's build_query(): the values were encoded by the caller
		$pairs[] = $k . '=' . $v;
	}
	return $url . ( $q ? '&' : '?' ) . implode( '&', $pairs );
}
function wp_unslash( $v ) {
	return is_array( $v ) ? array_map( 'wp_unslash', $v ) : stripslashes( (string) $v );
}
function sanitize_text_field( $s ) {
	return trim( strip_tags( (string) $s ) );
}
function sanitize_textarea_field( $s ) {
	return trim( strip_tags( (string) $s ) );
}
function sanitize_key( $s ) {
	return strtolower( preg_replace( '/[^a-zA-Z0-9_-]/', '', (string) $s ) );
}
function sanitize_title( $s ) {
	return strtolower( trim( preg_replace( '/[^a-zA-Z0-9_-]+/', '-', (string) $s ), '-' ) );
}
function absint( $v ) {
	return abs( (int) $v );
}
function esc_html__( $s, $d = '' ) {
	return $s;
}
function __( $s, $d = '' ) {
	return $s;
}
function _n( $a, $b, $n, $d = '' ) {
	return 1 === $n ? $a : $b;
}
function wp_json_encode( $v ) {
	return json_encode( $v );
}

require dirname( __DIR__ ) . '/includes/sources/sourcing-basics.php';
require dirname( __DIR__ ) . '/includes/sources/sources-model.php';
require dirname( __DIR__ ) . '/includes/sources/sourcing-policy.php';
require dirname( __DIR__ ) . '/includes/places/places-model.php';
require dirname( __DIR__ ) . '/includes/rules/rules-model.php';
require dirname( __DIR__ ) . '/includes/admin/sourceweb-standalone-screens.php';
require dirname( __DIR__ ) . '/includes/admin/sourceweb-standalone-config.php';

const SOURCEWEB_ROUTES_OPTION = 'sourceweb_routes';
function sourceweb_sources_config() {
	$c = get_option( 'aw_sources' );
	return is_array( $c ) ? $c : array( 'defaults' => array(), 'sources' => array(), 'live' => false );
}
function sourceweb_places() {
	return array(
		'aw_news' => array( 'id' => 'aw_news', 'label' => 'News', 'kind' => 'content_type', 'post_type' => 'aw_news', 'enhance' => array(), 'owner' => '' ),
		'gallery' => array( 'id' => 'gallery', 'label' => 'Gallery', 'kind' => 'plugin', 'post_type' => '', 'enhance' => array(), 'owner' => 'g' ),
	);
}

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

/**
 * Run a callable and report what it threw: 'die:CODE', 'nonce:ACTION', 'redirect:URL' or ''.
 *
 * @param callable $fn Callable.
 */
function t_run( callable $fn ): string {
	try {
		$fn();
	} catch ( T_Die $e ) {
		return 'die:' . $e->getMessage();
	} catch ( T_Nonce $e ) {
		return 'nonce:' . $e->getMessage();
	} catch ( T_Redirect $e ) {
		return 'redirect:' . $e->getMessage();
	}
	return '';
}

// 1. The nine screens, each with a capability.
$screens = sourceweb_sa_screens();
t( array( 'review', 'enrichment', 'keywords', 'rules', 'places', 'workers', 'rejected', 'relay-log', 'log' ) === array_keys( $screens ), 'the nine screens are listed' );
t( 'manage_sourceweb' === $screens['review'][1] && 'manage_options' === $screens['keywords'][1], 'review uses the SourceWeb capability, the settings screens manage_options' );
foreach ( $screens as $k => $s ) {
	t( is_callable( $s[0] ), "screen $k has a callable" );
}
$GLOBALS['t_can'] = false;
ob_start();
t( false === sourceweb_sa_render( 'keywords' ), 'a screen is not drawn for someone without the capability' );
t( false === sourceweb_sa_render( 'sources' ), 'a screen of part one is not drawn here' );
t( '' === ob_get_clean(), 'nothing is printed when the capability is missing' );
$GLOBALS['t_can'] = true;

// 2. Every admin-post handler: POST only, capability, then the nonce named like its action.
$handlers = array();
foreach ( $GLOBALS['t_hooks'] as $hook => $cb ) {
	if ( 0 === strpos( $hook, 'admin_post_sourceweb_sa_' ) ) {
		$handlers[ substr( $hook, strlen( 'admin_post_' ) ) ] = $cb;
	}
}
t( 22 === count( $handlers ), 'the screens register their handlers (' . count( $handlers ) . ')' );
foreach ( $handlers as $action => $cb ) {
	t( is_callable( $cb ), "$action: the handler exists" );
	$_SERVER['REQUEST_METHOD'] = 'GET';
	$GLOBALS['t_can']          = true;
	t( 'die:405' === t_run( $cb ), "$action: a GET changes nothing (405)" );
	$_SERVER['REQUEST_METHOD'] = 'POST';
	$GLOBALS['t_can']          = false;
	$GLOBALS['t_nonce']        = array();
	t( 'die:403' === t_run( $cb ), "$action: no capability, no change (403)" );
	t( array() === $GLOBALS['t_nonce'], "$action: the capability is checked before anything else" );
	$GLOBALS['t_can']       = true;
	$GLOBALS['t_nonce_bad'] = true;
	t( 'nonce:' . $action === t_run( $cb ), "$action: a bad nonce stops it, and the nonce action is the handler's own" );
	$GLOBALS['t_nonce_bad'] = false;
}

// 3. Keyword switches.
$_SERVER['REQUEST_METHOD'] = 'POST';
t( true === sourceweb_sa_kw_switches_save( true, false ), 'switching the keyword check on is a change' );
t( ! empty( get_option( SOURCEWEB_REL_OPTION )['enabled'] ), 'and it is stored' );
t( false === sourceweb_sa_kw_switches_save( true, false ), 'saving the same switches changes nothing' );
t( true === sourceweb_sa_kw_switches_save( true, true ), 'switching aggregators on is a change' );
$log = get_option( 'kits_sourcing_log' );
t( is_array( $log ) && count( $log ) === 2, 'each change is in the change log' );

// 4. Keyword lists.
t( array( 'Include', 'Exclude' ) === sourceweb_sa_kw_lists_save( array( 'strong' => "dog\ncat\ndog", 'exclude' => 'vacancy', 'animal' => '' ) ), 'lists that changed are named; duplicates and empty lines go' );
$rel = get_option( SOURCEWEB_REL_OPTION );
t( array( 'dog', 'cat' ) === $rel['strong'] && array( 'vacancy' ) === $rel['exclude'], 'the lists are stored as clean arrays' );
t( true === $rel['enabled'] && true === $rel['gnews_allow_only'], 'saving lists keeps the switches' );
t( array() === sourceweb_sa_kw_lists_save( array( 'strong' => "dog\ncat" ) ), 'the same list again changes nothing' );
t( array( 'Include' ) === sourceweb_sa_kw_lists_save( array( 'strong' => "cat\ndog" ) ), 'a list in a new order is a change' );
$v = sourceweb_relevance_verdict( 'A stray dog was rescued' );
t( true === $v[0], 'the verdict reads the saved lists' );
t( false === sourceweb_relevance_verdict( 'Dog vacancy at the shelter' )[0], 'an Exclude word refuses' );

// 5. Press settings.
t( true === sourceweb_sa_kw_press_save( array( 'enabled' => true, 'every_days' => '14', 'queries' => "a\nb" ), false ), 'press settings save' );
$press = sourceweb_sources_config()['press'];
t( true === $press['enabled'] && 14 === $press['every_days'] && array( 'a', 'b' ) === $press['queries'], 'press values are stored typed' );
t( false === sourceweb_sa_kw_press_save( array( 'enabled' => true, 'every_days' => '14', 'queries' => "a\nb" ), false ), 'the same press settings change nothing' );
sourceweb_sa_kw_press_save( array( 'enabled' => true, 'every_days' => '900', 'queries' => "a\nb" ), false );
t( 14 === sourceweb_sources_config()['press']['every_days'], 'days outside 1 to 60 are ignored' );
sourceweb_sa_kw_press_save( array( 'enabled' => true, 'every_days' => '7', 'queries' => 'zzz' ), true );
t( array( 'a', 'b' ) === sourceweb_sources_config()['press']['queries'], 'with the keyword table, press queries are not written from this form' );

// 6. Routes from a post.
$stored = array(
	array( 'when' => array( 'and', array( 'eq', 'type', 'news' ), array( 'has', 'summary' ) ), 'place' => 'gallery' ),
	array( 'when' => array(), 'place' => 'aw_news' ),
);
$posted = array(
	array( 'pos' => '2', 'orig' => '1', 'op' => 'always', 'field' => '', 'value' => '', 'place' => 'aw_news' ),
	array( 'pos' => '1', 'orig' => '0', 'op' => 'keep', 'field' => 'type', 'value' => 'attack', 'place' => 'gallery', 'keep' => array( 'eq', 'type', 'evil' ) ),
	array( 'pos' => '3', 'orig' => '', 'op' => 'always', 'field' => '', 'value' => '', 'place' => '' ),
	array( 'pos' => '4', 'orig' => '', 'op' => 'contains', 'field' => 'title', 'value' => 'puppy', 'place' => 'gallery' ),
	array( 'pos' => '5', 'orig' => '1', 'op' => 'always', 'field' => '', 'value' => '', 'place' => 'aw_news', 'remove' => '1' ),
);
$rows = sourceweb_sa_routes_from_post( $posted, $stored );
t( 3 === count( $rows ), 'a blank row and a removed row are left out' );
t( 'gallery' === $rows[0]['place'] && $stored[0]['when'] === $rows[0]['keep'], 'a kept test comes from the stored route, not from the post' );
t( 'aw_news' === $rows[1]['place'] && 'puppy' === $rows[2]['value'], 'rows follow their order numbers' );
list( $routes, $notes ) = sourceweb_routes_from_rows( $rows, sourceweb_places() );
t( ! $notes && 3 === count( $routes ) && $stored[0]['when'] === $routes[0]['when'], 'the rows make routes' );
$none = sourceweb_sa_routes_from_post( array( array( 'op' => 'keep', 'orig' => '9', 'place' => 'gallery' ) ), $stored );
t( array() === $none, 'a kept test with nothing stored behind it is dropped' );
list( , $notes ) = sourceweb_routes_from_rows( array( array( 'place' => 'nowhere', 'op' => 'always' ) ), sourceweb_places() );
t( 1 === count( $notes ), 'a route to a place that does not exist is refused' );

// 7. Review choices.
t( array( 'publish', array( 12 ) ) === sourceweb_sa_review_choice( array( 'sw_go' => 'publish-12' ) ), 'a row button names its item' );
t( array( 'reject', array( 3, 5 ) ) === sourceweb_sa_review_choice( array( 'sw_go' => 'bulk', 'sw_bulk' => 'reject', 'ids' => array( '3', '5', '3', 'x' ) ) ), 'ticked items go with the bulk action' );
t( array( '', array() ) === sourceweb_sa_review_choice( array( 'sw_go' => 'bulk', 'sw_bulk' => 'delete', 'ids' => array( '3' ) ) ), 'an unknown bulk action does nothing' );
t( array( '', array() ) === sourceweb_sa_review_choice( array( 'sw_go' => 'delete-4' ) ), 'an unknown row action does nothing' );
t( array( '', array() ) === sourceweb_sa_review_choice( array() ), 'no button, no action' );

// 8. Slugs and notices.
t( array( 'politics', 'gossip', 'sports' ) === sourceweb_sa_slugs( "Politics, gossip\nsports,,politics" ), 'slugs split on commas and lines, lowercase, no duplicates' );
sourceweb_sa_flash( 'success', 'Saved.' );
t( array( 'success', 'Saved.' ) === get_transient( 'sourceweb_sa_flash_7' ), 'a notice is kept for this person in a transient' );
$url = t_run( fn() => sourceweb_sa_back( 'rules', 'info', 'x', array( 'sw_tag' => 'a b' ) ) );
t( 0 === strpos( $url, 'redirect:http://example.test/wp-admin/admin.php?page=aw-sourcing&tab=rules' ) && false !== strpos( $url, 'sw_tag=a%20b' ), 'a form goes back to its screen with its arguments encoded' );
t( false === strpos( $url, 'Saved' ) && false === strpos( $url, 'x&' ), 'the notice text is not in the address' );

// 9. A whole handler: nonce, change, redirect.
$GLOBALS['t_nonce']  = array();
$GLOBALS['t_options'] = array();
$_POST               = array( 'enabled' => '1', 'gnews_allow_only' => '' );
$out                 = t_run( 'sourceweb_sa_handle_kw_switches' );
t( 0 === strpos( $out, 'redirect:' ) && array( 'sourceweb_sa_kw_switches' ) === $GLOBALS['t_nonce'], 'the switches handler checks its nonce, saves and goes back' );
t( ! empty( get_option( SOURCEWEB_REL_OPTION )['enabled'] ), 'and the switch is on' );

echo sprintf( "%d checks, %d failed\n", $count, $fails );
exit( $fails > 0 ? 1 : 0 );
