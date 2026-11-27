<?php
/**
 * Who may write each listing meta key over REST and the editor (includes/listing-meta.php), without WordPress.
 *
 * The Verified mark, its dates, the re-verify flag and the registry fields record a decision: a contributor who can edit
 * a listing must not be able to set them through the REST API. Code (claim approval, imports) writes them with
 * update_post_meta(), which never calls auth_callback.
 *
 * Usage: php plugins/directoryweb/tests/meta-authorization-tests.php
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	if ( 'cli' !== PHP_SAPI ) {
		exit;
	}
	define( 'ABSPATH', __DIR__ . '/' );
}

// phpcs:disable -- a command-line test runner with stand-ins for WordPress functions.

$caps = array(); // capability => true for the current user
$reg  = array(); // key => register_post_meta args
function add_action( ...$a ) {}
$GLOBALS['dw_filters'] = array();
function add_filter( $h, $cb, ...$r ) { $GLOBALS['dw_filters'][ $h ][] = $cb; }
$uid = 5; // 0 = no signed-in user (CLI, cron)
function get_current_user_id() { global $uid; return $uid; }
function get_post_type( $id ) { return $id >= 100 ? 'post' : 'aw_listing'; }
function apply_filters( $h, $v ) { foreach ( $GLOBALS['dw_filters'][ $h ] ?? array() as $cb ) { $v = $cb( $v ); } return $v; }
function _doing_it_wrong( $f ) {}
function esc_html( $v ) { return (string) $v; }
function esc_url_raw( $v ) { return (string) $v; }
function sanitize_email( $v ) { return (string) $v; }
function sanitize_text_field( $v ) { return trim( strip_tags( (string) $v ) ); }
function sanitize_title( $v ) { return strtolower( (string) $v ); }
function absint( $v ) { return abs( (int) $v ); }
function current_user_can( $cap, ...$args ) { global $caps; return ! empty( $caps[ $cap ] ); }
function register_post_meta( $t, $k, $a ) { global $reg; $reg[ $k ] = $a; }

class WP_REST_Response { public $d; function __construct( $d = null ) { $this->d = $d; } function get_data() { return $this->d; } function set_data( $d ) { $this->d = $d; } }
const DIRECTORYWEB_CAP = 'manage_directoryweb';
if ( ! function_exists( '__' ) ) {
	function __( $t ) { return $t; }
}
require dirname( __DIR__ ) . '/includes/labels.php';
require dirname( __DIR__ ) . '/includes/listing-meta.php';

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
function allowed( $key, $post_id = 5 ) {
	global $reg;
	return (bool) ( $reg[ $key ]['auth_callback'] )( false, $key, $post_id, 1, 'edit_post', array() );
}

directoryweb_register_meta();
check( count( directoryweb_meta_schema() ) === count( $reg ), 'every schema key is registered' );

$protected = array_map( fn( $n ) => 'aw_' . $n, directoryweb_protected_meta_names() );
check( in_array( 'aw_verified', $protected, true ) && in_array( 'aw_gov_verified_by', $protected, true ) && in_array( 'aw_needs_reverify', $protected, true ), 'Verified, government source and re-verify flag are protected' );
check( array() === array_diff( $protected, array_keys( $reg ) ), 'every protected name is a real schema key' );

// A contributor: can edit the listing, no DirectoryWeb capability.
$caps = array( 'edit_posts' => true, 'edit_post' => true );
foreach ( $protected as $key ) {
	check( ! allowed( $key ), 'contributor may NOT write ' . $key );
}
foreach ( array( 'aw_email', 'aw_website', 'aw_area', 'aw_services', 'aw_instagram' ) as $key ) {
	check( allowed( $key ), 'contributor may write ' . $key );
}

// A user who cannot edit this post at all.
$caps = array( 'edit_posts' => true );
check( ! allowed( 'aw_email' ), 'edit_posts alone does not allow another person\'s listing' );
check( allowed( 'aw_email', 0 ), 'with no post (a schema-level check) edit_posts is enough' );

// A DirectoryWeb manager.
$caps = array( 'edit_posts' => true, 'edit_post' => true, DIRECTORYWEB_CAP => true );
foreach ( $protected as $key ) {
	check( allowed( $key ), 'manager may write ' . $key );
}

// No capabilities: nothing.
$caps = array();
check( ! allowed( 'aw_email' ) && ! allowed( 'aw_verified' ), 'a user with no capability may write nothing' );

// The path-independent guard (REST, SCF/ACF forms, quick edit, Custom Fields box and update_post_meta all reach it).
$caps = array( 'edit_posts' => true, 'edit_post' => true );
$uid  = 5;
foreach ( array( 'directoryweb_guard_protected_meta' ) as $fn ) {
	check( false === $fn( null, 7, 'aw_verified' ), 'guard: a contributor\'s write of aw_verified is refused, whichever route' );
	check( false === $fn( null, 7, 'aw_gov_verified_by' ) && false === $fn( null, 7, 'aw_reg_date' ), 'guard: government source and registration date refused' );
	check( null === $fn( null, 7, 'aw_area' ), 'guard: a descriptive field passes' );
	check( null === $fn( null, 7, 'other_verified' ), 'guard: a key outside the prefix passes' );
	check( null === $fn( null, 100, 'aw_verified' ), 'guard: another post type is not ours to police' );
	check( true === $fn( true, 7, 'aw_verified' ), 'guard: a decision already made by an earlier filter is kept' );
}
$caps = array( 'edit_posts' => true, DIRECTORYWEB_CAP => true );
check( null === directoryweb_guard_protected_meta( null, 7, 'aw_verified' ), 'guard: a manager may write the Verified mark' );
$caps = array();
$uid  = 0;
check( null === directoryweb_guard_protected_meta( null, 7, 'aw_verified' ), 'guard: code with no signed-in user (CLI, cron, import) may write it' );
// Reads: team-only meta never reaches a non-manager's REST response.
$priv_names = array( 'aw_needs_reverify', 'aw_gov_verified_by' );
check( array_map( fn( $n ) => 'aw_' . $n, directoryweb_private_meta_names() ) === $priv_names, 'the team-only list is the documented two keys' );
check( array() === array_diff( $priv_names, array_keys( directoryweb_meta_schema() ) ), 'every team-only key is a real schema key' );
check( array() === array_intersect( $priv_names, array( 'aw_verified', 'aw_verified_on', 'aw_gov_verified_on', 'aw_reg_date', 'aw_registration' ) ), 'values the listing page prints stay public' );
$meta = array( 'aw_area' => 'x', 'aw_verified' => true, 'aw_gov_verified_by' => 'G', 'aw_needs_reverify' => true );
foreach ( array( 'anonymous' => array(), 'contributor' => array( 'edit_posts' => true, 'edit_post' => true ) ) as $who => $c ) {
	$caps = $c;
	$r    = directoryweb_rest_hide_private_meta( new WP_REST_Response( array( 'id' => 1, 'meta' => $meta ) ) );
	check( array( 'aw_area' => 'x', 'aw_verified' => true ) === $r->get_data()['meta'], $who . ': single response keeps public meta, drops team-only' );
	$batch = directoryweb_rest_scrub_response( new WP_REST_Response( array( 'responses' => array( array( 'body' => array( 'meta' => $meta, '_embedded' => array( 'x' => array( array( 'meta' => $meta ) ) ) ) ) ) ) ) );
	check( false === strpos( json_encode( $batch->get_data() ), 'aw_gov_verified_by' ) && false !== strpos( json_encode( $batch->get_data() ), 'aw_area' ), $who . ': a batch or embedded response is scrubbed at any depth' );
}
$caps = array( DIRECTORYWEB_CAP => true );
check( $meta === directoryweb_rest_hide_private_meta( new WP_REST_Response( array( 'meta' => $meta ) ) )->get_data()['meta'], 'a manager keeps every field' );
check( 'x' === directoryweb_rest_hide_private_meta( 'x' ), 'a non-response passes through' );
// A tenant's own registration or accreditation fields come in through the filters, with nothing hard-coded in the plugin.
$default_keys = array_keys( directoryweb_meta_schema() );
check( array() === preg_grep( '/awbi|darpan|12a|80g|fcra|sectors|reg_authority|reg_act/', $default_keys ), 'no accreditation, registry or tax-number key by default' );
check( in_array( 'aw_registration', $default_keys, true ) && in_array( 'aw_reg_date', $default_keys, true ), 'the neutral registration number and date stay' );
add_filter( 'directoryweb_protected_meta_names', fn( $n ) => array_merge( $n, array( 'acc_code' ) ) );
add_filter( 'directoryweb_private_meta_names', fn( $n ) => array_merge( $n, array( 'acc_note' ) ) );
add_filter( 'directoryweb_date_meta_names', fn( $n ) => array_merge( $n, array( 'acc_valid' ) ) );
check( in_array( 'acc_code', directoryweb_protected_meta_names(), true ) && in_array( 'acc_note', directoryweb_private_meta_names(), true ), 'a site adds protected and team-only names' );
$caps = array( 'edit_posts' => true, 'edit_post' => true );
$uid  = 5;
check( false === directoryweb_guard_protected_meta( null, 7, 'aw_acc_code' ), 'a protected name a site added is guarded' );
check( '2026-01-02' === directoryweb_sanitize_meta( '2026-01-02', 'aw_acc_valid' ) && '' === directoryweb_sanitize_meta( 'soon', 'aw_acc_valid' ), 'a date name a site added is kept as Y-m-d' );
echo $count . ' checks, ' . $fails . " failed\n";
exit( $fails ? 1 : 0 );
