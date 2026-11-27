<?php
/**
 * Kits Core 1.4.1 surface tests: the filters kits_features and kits_settings_fields, the kits/v1/site-check REST route
 * (capability, read only, same checks as the screen), and the Scripts Manager gate kits_scripts_can_manage().
 *
 * Usage: php plugins/kits-core/tests/surface-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO -- a command-line test runner with stand-ins.

require __DIR__ . '/wp-stubs.php';

$GLOBALS['t_routes']   = array();
$GLOBALS['t_submenus'] = array();
$GLOBALS['t_next']     = false;
$GLOBALS['t_scheduled'] = array();
function register_rest_route( $ns, $route, $args ) {
	$GLOBALS['t_routes'][ $ns . $route ] = $args;
}
function add_submenu_page( $parent, $title, $menu, $cap, $slug, $cb = '' ) {
	$GLOBALS['t_submenus'][] = $slug;
}
function wp_next_scheduled( $hook ) {
	return $GLOBALS['t_next'];
}
function wp_schedule_single_event( $when, $hook ) {
	$GLOBALS['t_scheduled'][] = $hook;
}
function wp_clear_scheduled_hook( $hook ) {}
function current_time( $f ) {
	return '2026-11-27 10:00:00';
}
function get_post_types( $a = array(), $o = 'names' ) {
	return array();
}
function get_posts( $a = array() ) {
	return array();
}
function get_terms( $a = array() ) {
	return array();
}
function wp_style_is() {
	return false;
}
function __return_true() {
	return true;
}
function plugin_basename( $f ) {
	return basename( $f );
}
function wp_verify_nonce( $n, $a ) {
	return 'good' === $n;
}

require dirname( __DIR__ ) . '/includes/header-footer-scripts.php';
$save = t_hook_callbacks( 'admin_init' )[0] ?? null; // the Scripts save handler
require dirname( __DIR__ ) . '/includes/ops/site-check.php';
require dirname( __DIR__ ) . '/includes/admin-home.php';
do_action( 'rest_api_init' );

// ================= kits_features =================
$rows = kits_features_rows();
t( count( $rows ) >= 8 && 'Forms' === $rows[0][0], 'features: the default table keeps its rows (Forms first)' );
t( 4 === count( $rows[0] ), 'features: a row is name, what, where, state' );
add_filter(
	'kits_features',
	function ( $rows ) {
		$rows[] = array( 'Newsletter', esc_html( 'Sends the weekly letter.' ), esc_html( 'Settings' ), esc_html( 'On' ) );
		$rows[] = 'not a row';
		return array_values( array_filter( $rows, fn( $r ) => ! is_array( $r ) || 'Share bar' !== $r[0] ) );
	}
);
$rows2  = kits_features_rows();
$names  = array_map( fn( $r ) => $r[0], $rows2 );
t( in_array( 'Newsletter', $names, true ), 'features: the filter adds a row' );
t( ! in_array( 'Share bar', $names, true ), 'features: the filter removes a row' );
t( count( array_filter( $rows2, fn( $r ) => ! is_array( $r ) ) ) === 0, 'features: a value that is not a row is dropped' );

// ================= kits_settings_fields =================
// The Theme Options field list is theme-options.php; load it and the screen file that groups it.
require dirname( __DIR__ ) . '/includes/theme-options.php';
if ( ! function_exists( 'kits_page_option_types' ) ) {
	function kits_page_option_types() {
		return array();
	}
}
if ( ! function_exists( 'kits_archive_types' ) ) {
	function kits_archive_types() {
		return array();
	}
}
require dirname( __DIR__ ) . '/includes/admin-screens.php';
$speed = kits_core_settings_fields( 'Speed' );
t( isset( $speed['css_bundle'] ) && isset( $speed['css_parts_cap'] ), 'fields: the Speed group lists its Theme Options fields' );
t( ! isset( $speed['font_preload'] ), 'fields: a field shown in another section (font preload) is not in the group' );
$old = kits_core_settings_fields( 'Older content' );
t( isset( $old['legacy_group_styles'] ), 'fields: the Older content group lists its field' );
add_filter(
	'kits_settings_fields',
	function ( $fields, $group ) {
		if ( 'Speed' === $group ) {
			unset( $fields['css_bundle'] );
			$fields['junk']  = 'not a field';
			$fields['extra'] = array( 'group' => 'Speed', 'label' => 'Extra', 'kind' => 'text', 'choices' => array(), 'default' => '', 'note' => '' );
		}
		return $fields;
	},
	10,
	2
);
$speed2 = kits_core_settings_fields( 'Speed' );
t( ! isset( $speed2['css_bundle'] ), 'fields: the filter hides a field' );
t( isset( $speed2['extra'] ) && ! isset( $speed2['junk'] ), 'fields: the filter adds a field; an entry that is not a field is dropped' );
t( isset( kits_core_settings_fields( 'Older content' )['legacy_group_styles'] ), 'fields: the filter gets the group, so another group is untouched' );

// ================= kits/v1/site-check =================
t( isset( $GLOBALS['t_routes']['kits/v1/site-check'] ), 'site-check: the route kits/v1/site-check is registered on rest_api_init' );
$route = $GLOBALS['t_routes']['kits/v1/site-check'] ?? null;
t( is_array( $route ) && 'GET' === $route['methods'], 'site-check: GET only (read only)' );
t( false === $route['permission_callback'](), 'site-check: a visitor is refused' );
$GLOBALS['t_caps']['edit_posts'] = true;
t( false === $route['permission_callback'](), 'site-check: an editor is refused' );
$GLOBALS['t_caps']['manage_options'] = true;
t( true === $route['permission_callback'](), 'site-check: an administrator is let in' );

$empty = $route['callback']();
t( $empty->data['rows'] === array() && false === $empty->data['summary']['ok'] && 'Not run yet.' === $empty->data['summary']['text'], 'site-check: before any run it says so and lists nothing' );
t( 'no-store' === ( $empty->headers['Cache-Control'] ?? '' ), 'site-check: the answer is not cached' );
update_option(
	'aw_site_check_last',
	array(
		'at'   => '2026-11-27 09:00:00',
		'head' => 'abcdef1234567',
		'rows' => array(
			array( 'Home', '/', 200, 120, '' ),
			array( 'Search', '/search/?q=a', 500, 90, 'HTTP 500' ),
		),
	)
);
$opts_before = $GLOBALS['t_opts'];
$rep         = $route['callback']()->data;
t( 2 === count( $rep['rows'] ) && 'Home' === $rep['rows'][0]['page'] && 200 === $rep['rows'][0]['status'] && 'HTTP 500' === $rep['rows'][1]['problem'], 'site-check: the rows are the screen\'s rows (page, path, status, ms, problem)' );
t( '2026-11-27 09:00:00' === $rep['checked_at'] && 'abcdef1234567' === $rep['commit'], 'site-check: time and commit of the check' );
t( false === $rep['summary']['ok'] && false !== strpos( $rep['summary']['text'], '1 of 2 pages had a problem' ), 'site-check: the summary is the screen\'s sentence' );
t( kits_site_check_summary( false ) === $rep['summary'], 'site-check: the route and the screen share kits_site_check_summary()' );
t( $opts_before === $GLOBALS['t_opts'], 'site-check: reading changes no option' );
// Read only: even when the check is stale, the route books no run (the screens do).
function kits_deployed_head() {
	return 'ffffffffffffff';
}
$GLOBALS['t_scheduled'] = array();
$route['callback']();
t( array() === $GLOBALS['t_scheduled'], 'site-check: a stale check does not book a new run from the REST route' );
kits_site_check_summary();
t( array( 'aw_site_check_deploy' ) === $GLOBALS['t_scheduled'], 'site-check: (control) the screen\'s summary still books it' );

// ================= Scripts Manager gate =================
t_reset();
$caps               = array(
	array( array(), false, 'nobody' ),
	array( array( 'manage_options' ), false, 'manage_options alone (no unfiltered_html, as on multisite)' ),
	array( array( 'unfiltered_html' ), false, 'unfiltered_html alone' ),
	array( array( 'manage_options', 'unfiltered_html' ), true, 'both' ),
);
foreach ( $caps as list( $have, $want, $label ) ) {
	$GLOBALS['t_caps'] = array_fill_keys( $have, true );
	t( kits_scripts_can_manage() === $want, "scripts gate: $label -> " . ( $want ? 'allowed' : 'refused' ) );
	$GLOBALS['t_submenus'] = array();
	kits_scripts_menu();
	t( in_array( 'kits-scripts', $GLOBALS['t_submenus'], true ) === $want, "scripts gate: menu entry for $label is " . ( $want ? 'registered' : 'not registered' ) );
	ob_start();
	try {
		kits_scripts_page();
		$shown = true;
	} catch ( T_Die $e ) {
		$shown = false;
	}
	ob_end_clean();
	t( $shown === $want, "scripts gate: page for $label " . ( $want ? 'renders' : 'dies' ) );
}
// The save handler (admin_init).
t( is_callable( $save ), 'scripts gate: the save handler is on admin_init' );
$_POST = array( 'kits_scripts_nonce' => 'good', 'kits_header_scripts' => '<script>x()</script>', 'kits_body_scripts' => 'b', 'kits_footer_scripts' => 'f' );
$GLOBALS['t_caps'] = array( 'manage_options' => true );
$GLOBALS['t_opts'] = array();
try {
	$save();
	t( false, 'scripts gate: save without unfiltered_html dies' );
} catch ( T_Die $e ) {
	t( array() === $GLOBALS['t_opts'], 'scripts gate: save without unfiltered_html writes nothing' );
}
$GLOBALS['t_caps'] = array( 'unfiltered_html' => true );
try {
	$save();
} catch ( T_Die $e ) {
	t( array() === $GLOBALS['t_opts'], 'scripts gate: save without manage_options writes nothing' );
}
$_POST['kits_scripts_nonce'] = 'bad';
$GLOBALS['t_caps']           = array( 'manage_options' => true, 'unfiltered_html' => true );
try {
	$save();
} catch ( T_Die $e ) {
	t( array() === $GLOBALS['t_opts'], 'scripts gate: a bad nonce writes nothing even for a full administrator' );
}
$_POST['kits_scripts_nonce'] = 'good';
try {
	$save();
} catch ( T_Redirect $e ) {
	t( '<script>x()</script>' === get_option( 'kits_header_scripts' ) && 'b' === get_option( 'kits_body_scripts' ) && 'f' === get_option( 'kits_footer_scripts' ), 'scripts gate: with both capabilities the raw scripts are saved' );
}
$_POST = array();
t_done();
