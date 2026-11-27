<?php
/**
 * The Library "Dated" and campaign "Metrics" edit fields, which moved from Kits Core 1.4.1 into this site layer
 * (includes/edit-fields.php): the line parser, the date check, the type filters, the switch (animalwrites_edit_fields),
 * the save handlers' capability and nonce checks, and that Kits Core itself no longer carries them.
 *
 * Usage: php sites/animalwrites/kits-core/tests/edit-fields-tests.php
 *
 * @package animalwrites-kits-core
 */

// phpcs:disable -- a command-line test runner with WordPress stubs.

$core = dirname( __DIR__, 4 ) . '/plugins/kits-core/';
require $core . 'tests/wp-stubs.php';

$GLOBALS['t_meta'] = array();
class WP_Post {
	public $ID        = 0;
	public $post_type = '';
}
function get_post_meta( $id, $k, $single = false ) {
	return $GLOBALS['t_meta'][ $id ][ $k ] ?? '';
}
function update_post_meta( $id, $k, $v ) {
	$GLOBALS['t_meta'][ $id ][ $k ] = is_string( $v ) ? stripslashes( $v ) : $v; // core unslashes what it is given
}
function delete_post_meta( $id, $k ) {
	unset( $GLOBALS['t_meta'][ $id ][ $k ] );
}
function wp_is_post_revision( $id ) {
	return false;
}
function wp_slash( $v ) {
	return addslashes( $v );
}
function wp_verify_nonce( $n, $a ) {
	return 'good' === $n;
}
function wp_http_validate_url( $u ) {
	return filter_var( $u, FILTER_VALIDATE_URL ) ? $u : false;
}
function kits_campaign_post_type(): string {
	return (string) apply_filters( 'kits_campaign_post_type', '' );
}

// Kits Core 1.4.1 must not carry these any more (the plugin file is not loaded here: it has other hooks).
$plugin_src = file_get_contents( $core . 'includes/admin-layer/edit-fields.php' );
t( false === strpos( $plugin_src, 'aw_legal' ) && false === strpos( $plugin_src, 'aw_campaign_metrics' ) && false === strpos( $plugin_src, 'function kits_library_post_type' ) && false === strpos( $plugin_src, 'KITS_EDIT_METRIC_FIELDS' ), 'Kits Core\'s edit-fields.php no longer holds the Dated or Metrics code' );

require dirname( __DIR__ ) . '/includes/edit-fields.php';

// ---- the loader only loads this file with Kits Core 1.4.1 or later ----
$loader = file_get_contents( dirname( __DIR__ ) . '/kits-core-site.php' );
t( 1 === preg_match( "/version_compare\( KITS_CORE_VERSION, '1\.4\.1', '>=' \) \) \{\s*require_once \\\$dir \. 'edit-fields\.php';/", $loader ), 'the loader gates edit-fields.php on Kits Core 1.4.1' );

// ---- type filters ----
t( 'aw_legal' === kits_library_post_type(), 'the Library type is aw_legal by default in the site layer' );
add_filter( 'kits_library_post_type', fn() => 'other_type', 9 );
t( 'other_type' === kits_library_post_type(), 'a filter running later can change the Library type' );
$GLOBALS['t_hooks']['kits_library_post_type'] = array();
add_filter( 'kits_library_post_type', fn( $t ) => '' === $t ? 'aw_legal' : $t, 5 );

// ---- the parser ----
$lines = "visits | Visits | 1,200 | 1200 | 100 | 2026-11-01 | 30 | team | GA4 | https://example.org/\nletters | Letters";
$list  = kits_edit_fields_metric_list( $lines );
t( is_array( $list ) && 2 === count( $list ), 'two metric lines read' );
t( 1200.0 === $list[0]['count'] && 100 === $list[0]['threshold'] && 30 === $list[0]['stale_days'] && '2026-11-01' === $list[0]['verified'], 'numbers and the date kept with their types' );
t( array( 'key' => 'letters', 'label' => 'Letters' ) === $list[1], 'empty fields are not stored' );
t( null === kits_edit_fields_metric_list( 'visits | Visits | 1 | 1 | 1 | 2026-13-40' ), 'a bad date keeps every metric as it was' );
t( null === kits_edit_fields_metric_list( 'a|b|c|d|e|f|g|h|i|j|k' ), 'more than ten fields is refused' );
t( null === kits_edit_fields_metric_list( ' | no key' ), 'a line with no key is refused' );
t( null === kits_edit_fields_metric_list( 'k | l | 1 | 1 | 1 | | | | | not a url' ), 'a bad source link is refused' );
t( array() === kits_edit_fields_metric_list( "\n  \n" ), 'blank lines give an empty list' );
t( kits_edit_fields_is_day( '2026-02-28' ) && ! kits_edit_fields_is_day( '2026-02-30' ) && ! kits_edit_fields_is_day( '28/02/2026' ), 'a real day only' );

// ---- saving ----
$camp = 77;
add_filter( 'kits_campaign_post_type', fn() => 'aw_campaign' );
$_POST = array( 'kits_edit_fields_metrics_nonce' => 'good', 'aw_campaign_metrics_lines' => $lines );
$GLOBALS['t_caps'] = array();
kits_edit_fields_metrics_save( $camp );
t( ! isset( $GLOBALS['t_meta'][ $camp ]['aw_campaign_metrics'] ), 'metrics: a user who cannot edit the post saves nothing' );
$GLOBALS['t_caps'] = array( 'edit_post' => true );
$_POST['kits_edit_fields_metrics_nonce'] = 'bad';
kits_edit_fields_metrics_save( $camp );
t( ! isset( $GLOBALS['t_meta'][ $camp ]['aw_campaign_metrics'] ), 'metrics: a bad nonce saves nothing' );
$_POST['kits_edit_fields_metrics_nonce'] = 'good';
kits_edit_fields_metrics_save( $camp );
$stored = json_decode( $GLOBALS['t_meta'][ $camp ]['aw_campaign_metrics'] ?? 'null', true );
t( is_array( $stored ) && 'visits' === $stored[0]['key'] && 1200.0 === (float) $stored[0]['count'], 'metrics: with capability and nonce the lines are stored as JSON' );
$before = $GLOBALS['t_meta'][ $camp ]['aw_campaign_metrics'];
$_POST['aw_campaign_metrics_lines'] = 'visits | Visits | 1 | 1 | 1 | 2026-13-40';
kits_edit_fields_metrics_save( $camp );
t( $before === $GLOBALS['t_meta'][ $camp ]['aw_campaign_metrics'], 'metrics: a line that cannot be read changes nothing' );
$_POST['aw_campaign_metrics_lines'] = '';
kits_edit_fields_metrics_save( $camp );
t( ! isset( $GLOBALS['t_meta'][ $camp ]['aw_campaign_metrics'] ), 'metrics: an empty box removes the metrics' );

$lib = 88;
$_POST = array( 'kits_edit_fields_dated_nonce' => 'good', 'aw_legal_dated' => '2026-11-01' );
$GLOBALS['t_caps'] = array();
kits_edit_fields_dated_save( $lib );
t( '' === get_post_meta( $lib, 'aw_legal_dated' ), 'dated: no capability, nothing saved' );
$GLOBALS['t_caps'] = array( 'edit_post' => true );
kits_edit_fields_dated_save( $lib );
t( '2026-11-01' === get_post_meta( $lib, 'aw_legal_dated' ), 'dated: a real day is saved' );
$_POST['aw_legal_dated'] = '2026-02-30';
kits_edit_fields_dated_save( $lib );
t( '2026-11-01' === get_post_meta( $lib, 'aw_legal_dated' ), 'dated: an impossible day leaves the saved one' );
$_POST['aw_legal_dated'] = '';
kits_edit_fields_dated_save( $lib );
t( '' === get_post_meta( $lib, 'aw_legal_dated' ), 'dated: empty removes it' );

// ---- the init hooks and the switch ----
$init = t_hook_callbacks( 'init' );
t( 1 === count( $init ), 'one init handler adds the save hooks' );
$init[0]();
t( has_action( 'save_post_aw_legal' ) && has_action( 'save_post_aw_campaign' ), 'by default both save hooks are added' );
unset( $GLOBALS['t_hooks']['save_post_aw_legal'], $GLOBALS['t_hooks']['save_post_aw_campaign'] );
add_filter( 'animalwrites_edit_fields', fn() => array( 'metrics' ) );
$init[0]();
t( ! has_action( 'save_post_aw_legal' ) && has_action( 'save_post_aw_campaign' ), 'animalwrites_edit_fields can switch Dated off' );
unset( $GLOBALS['t_hooks']['save_post_aw_campaign'] );
$GLOBALS['t_hooks']['animalwrites_edit_fields'] = array();
add_filter( 'animalwrites_edit_fields', fn() => array() );
$init[0]();
t( ! has_action( 'save_post_aw_legal' ) && ! has_action( 'save_post_aw_campaign' ), 'and both off' );
$GLOBALS['t_hooks']['animalwrites_edit_fields'] = array();
$GLOBALS['t_hooks']['kits_campaign_post_type']  = array();
unset( $GLOBALS['t_hooks']['save_post_aw_legal'] );
$init[0]();
t( has_action( 'save_post_aw_legal' ) && ! has_action( 'save_post_aw_campaign' ), 'with no campaign type named, Metrics adds no hook' );

// ---- the Dated field is drawn only on a Library item ----
$render = t_hook_callbacks( 'acf/render_field/key=field_aw_legal_msg_item' );
t( 1 === count( $render ), 'the Dated field hangs on the Library document box' );
global $post;
$post            = new WP_Post();
$post->ID        = 5;
$post->post_type = 'aw_news';
ob_start();
$render[0]();
t( '' === ob_get_clean(), 'dated: not drawn on another type' );
$post->post_type = 'aw_legal';
ob_start();
$render[0]();
$html = ob_get_clean();
t( false !== strpos( $html, 'name="aw_legal_dated"' ) && false !== strpos( $html, 'kits_edit_fields_dated_nonce' ), 'dated: drawn on a Library item with its nonce' );
add_filter( 'animalwrites_edit_fields', fn() => array( 'metrics' ) );
ob_start();
$render[0]();
t( '' === ob_get_clean(), 'dated: not drawn when switched off' );

t_done();
