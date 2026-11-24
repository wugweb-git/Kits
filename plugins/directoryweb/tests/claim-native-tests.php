<?php
/**
 * Tests the native (no Fluent Forms) claim path: state table, validation, create, transitions, listing effects.
 * WordPress is stubbed in memory; the claim writer aw_claim_apply_field() is stubbed to record what it was asked to apply.
 *
 * Usage: php plugins/directoryweb/tests/claim-native-tests.php
 *
 * @package directoryweb
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'DIRECTORYWEB_CAP', 'manage_directoryweb' );
define( 'HOUR_IN_SECONDS', 3600 );

const DW_CLAIM_ROLES      = array( '' => 'Choose one', 'founder' => 'Founder', 'staff' => 'Staff', 'volunteer' => 'Volunteer', 'other' => 'Other' );
const DIRECTORYWEB_SERVICES = array( 'adoption' => 'Adoption', 'rescue' => 'Rescue', 'vet' => 'Vet care' );

class WP_Error {
	public $code; public $message; public $data;
	public function __construct( $c = '', $m = '', $d = array() ) { $this->code = $c; $this->message = $m; $this->data = $d; }
	public function get_error_message() { return $this->message; }
	public function get_error_data() { return $this->data; }
}
function is_wp_error( $x ) { return $x instanceof WP_Error; }

// In-memory store.
$GLOBALS['posts'] = array();
$GLOBALS['meta']  = array();
$GLOBALS['next']  = 100;
$GLOBALS['hooks'] = array();
function add_action( $tag, $fn, $prio = 10, $args = 1 ) { $GLOBALS['hooks'][ $tag ][] = array( $fn, $args ); }
function do_action( $tag, ...$a ) { foreach ( $GLOBALS['hooks'][ $tag ] ?? array() as $h ) { $h[0]( ...array_slice( $a, 0, $h[1] ) ); } }
function apply_filters( $tag, $v ) { return $v; }
$GLOBALS['opts'] = array( 'admin_email' => 'owner@example.org', 'aw_ff_send_email' => '1' );
function get_option( $k, $d = false ) { return $GLOBALS['opts'][ $k ] ?? $d; }
$GLOBALS['mails'] = array();
function wp_mail( $to, $subject, $body ) { $GLOBALS['mails'][] = compact( 'to', 'subject', 'body' ); return true; }
function wp_strip_all_tags( $s ) { return strip_tags( (string) $s ); }
function admin_url( $p = "" ) { return "https://example.test/wp-admin/" . $p; }
function add_meta_box( ...$a ) {}
function sanitize_text_field( $s ) { return trim( strip_tags( (string) $s ) ); }
function sanitize_textarea_field( $s ) { return trim( strip_tags( (string) $s ) ); }
function sanitize_key( $s ) { return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $s ) ); }
function sanitize_email( $s ) { return filter_var( trim( (string) $s ), FILTER_VALIDATE_EMAIL ) ? trim( (string) $s ) : ''; }
function is_email( $s ) { return (bool) filter_var( $s, FILTER_VALIDATE_EMAIL ); }
function esc_url_raw( $u ) { return filter_var( $u, FILTER_VALIDATE_URL ) ? $u : ''; }
function aw_claim_phone_ok( $v ) { $n = strlen( preg_replace( '/\D+/', '', $v ) ); return (bool) preg_match( '#^[0-9+()\-/ .]+$#', $v ) && $n >= 6 && $n <= 15; }
function aw_claim_clean( $k, $v ) { return 'aw_email' === $k ? sanitize_email( $v ) : esc_url_raw( $v ); }
function aw_claim_now( $l, $k, $p ) { return ''; }
function wp_json_encode( $v ) { return json_encode( $v ); }
function current_time( $t ) { return '2026-11-24 12:00:00'; }
function wp_date( $f ) { return '2026-11-24'; }
function delete_transient( $k ) {}
function get_post_type( $id ) { return $GLOBALS['posts'][ $id ]['type'] ?? false; }
function get_post_status( $id ) { return $GLOBALS['posts'][ $id ]['status'] ?? false; }
function get_the_title( $id ) { return $GLOBALS['posts'][ $id ]['title'] ?? ''; }
function wp_insert_post( $a, $e = false ) { $id = $GLOBALS['next']++; $GLOBALS['posts'][ $id ] = array( 'type' => $a['post_type'], 'status' => $a['post_status'], 'title' => $a['post_title'] ); return $id; }
function update_post_meta( $id, $k, $v ) { $GLOBALS['meta'][ $id ][ $k ] = $v; return true; }
function get_post_meta( $id, $k, $single = true ) { return $GLOBALS['meta'][ $id ][ $k ] ?? ''; }
function delete_post_meta( $id, $k ) { unset( $GLOBALS['meta'][ $id ][ $k ] ); }
function get_posts( $q ) {
	$want = array();
	foreach ( $q['meta_query'] as $m ) { $want[ $m['key'] ] = $m['value']; }
	$out = array();
	foreach ( $GLOBALS['posts'] as $id => $p ) {
		if ( $p['type'] !== $q['post_type'] ) { continue; }
		foreach ( $want as $k => $v ) { if ( ( $GLOBALS['meta'][ $id ][ $k ] ?? null ) !== $v ) { continue 2; } }
		$out[] = $id;
	}
	return array_slice( $out, 0, $q['posts_per_page'] );
}
$GLOBALS['applied'] = array();
function aw_claim_apply_field( $c, $key ) { $GLOBALS['applied'][] = $key . '=' . ( $c['propose'][ $key ] ?? '' ); return true; }

require dirname( __DIR__ ) . '/includes/claim-native.php';

$pass = 0; $fail = 0;
function check( $ok, $name ) { global $pass, $fail; if ( $ok ) { $pass++; echo "  ok  $name\n"; } else { $fail++; echo "FAIL  $name\n"; } }

// A published listing.
$GLOBALS['posts'][1] = array( 'type' => 'aw_listing', 'status' => 'publish', 'title' => 'Paws Shelter' );
$GLOBALS['posts'][2] = array( 'type' => 'aw_listing', 'status' => 'draft', 'title' => 'Draft' );
$good = array( 'name' => 'Asha', 'email' => 'asha@example.org', 'role' => 'founder', 'l_phone' => '+91 98765 43210', 'l_website' => 'https://paws.example.org', 'l_services' => array( 'adoption', 'bogus' ) );

echo "State table\n";
check( dw_claim_can_transition( 'pending', 'approved' ), 'pending -> approved' );
check( dw_claim_can_transition( 'approved', 'revoked' ), 'approved -> revoked' );
check( ! dw_claim_can_transition( 'approved', 'rejected' ), 'approved -/-> rejected' );
check( ! dw_claim_can_transition( 'withdrawn', 'pending' ), 'withdrawn is final' );
check( ! dw_claim_can_transition( 'nonsense', 'approved' ), 'unknown state refused' );

echo "Validation\n";
$v = dw_claim_validate( $good );
check( $v['ok'] && 'adoption' === $v['propose']['services'], 'good input passes; unknown service dropped' );
check( ! dw_claim_validate( array_merge( $good, array( 'email' => 'nope' ) ) )['ok'], 'bad email refused' );
check( ! dw_claim_validate( array_merge( $good, array( 'role' => '' ) ) )['ok'], 'missing role refused' );
check( ! dw_claim_validate( array_merge( $good, array( 'l_phone' => 'abc' ) ) )['ok'], 'bad proposed phone refused' );
check( isset( dw_claim_validate( array( 'name' => 'A', 'email' => 'a@b.co', 'role' => 'staff' ) )['errors']['propose'] ), 'claim that proposes nothing refused' );
check( ! dw_claim_validate( array_merge( $good, array( 'l_about' => str_repeat( 'x', 2001 ) ) ) )['ok'], 'over-long About refused' );

echo "Create\n";
check( is_wp_error( dw_claim_create( 2, $good ) ), 'draft listing cannot be claimed' );
check( is_wp_error( dw_claim_create( 999, $good ) ), 'missing listing cannot be claimed' );
$id = dw_claim_create( 1, $good );
check( is_int( $id ) && 'pending' === dw_claim_get( $id )['status'], 'valid claim stored as pending' );
check( 'private' === $GLOBALS['posts'][ $id ]['status'], 'claim post is private' );
$dup = dw_claim_create( 1, $good );
check( is_wp_error( $dup ) && 'dw_claim_duplicate' === $dup->code, 'duplicate open claim for the same listing refused' );

echo "Transitions\n";
$r = dw_claim_transition( $id, 'revoked', 7 );
check( is_wp_error( $r ) && 409 === $r->data['status'], 'pending -> revoked refused (409)' );
check( ! get_post_meta( 1, 'aw_verified' ), 'listing not verified before approval' );
$r = dw_claim_transition( $id, 'approved', 7, 'ok', array( 'phone', 'services', 'about' ) );
check( true === $r, 'pending -> approved' );
check( true === get_post_meta( 1, 'aw_verified' ) && '2026-11-24' === get_post_meta( 1, 'aw_verified_on' ), 'approval verifies the listing' );
check( array( 'phones=+91 98765 43210', 'l_services=adoption' ) === $GLOBALS['applied'], 'only ticked and proposed fields applied (about was not proposed)' );
check( is_wp_error( dw_claim_transition( $id, 'approved', 7 ) ), 'cannot approve twice' );
check( true === dw_claim_transition( $id, 'revoked', 7, 'lost contact' ), 'approved -> revoked' );
check( false === get_post_meta( 1, 'aw_verified' ) && true === get_post_meta( 1, 'aw_needs_reverify' ), 'revoke removes verified mark, flags re-verify' );
check( true === dw_claim_transition( $id, 'pending', 7 ), 'revoked -> pending (re-opened)' );
check( true === dw_claim_transition( $id, 'rejected', 7 ), 'pending -> rejected' );
$hist = dw_claim_get( $id )['history'];
check( count( $hist ) === 5 && 'created' === $hist[0]['event'], 'history records every move (5 entries)' );
check( null === dw_claim_get( 1 ), 'a non-claim post is not a native claim' );

echo "Limits\n";
foreach ( array( 'b', 'c', 'd', 'e' ) as $i => $x ) {
	$GLOBALS['posts'][ 10 + $i ] = array( 'type' => 'aw_listing', 'status' => 'publish', 'title' => "L$x" );
	$res = dw_claim_create( 10 + $i, array_merge( $good, array( 'email' => 'many@example.org' ) ) );
}
check( is_wp_error( $res ) && 'dw_claim_limit' === $res->code, 'one email cannot hold more than ' . DW_CLAIM_MAX_OPEN_PER_EMAIL . ' open claims' );

echo "Emails\n";
$m = $GLOBALS['mails'];
check( 1 === preg_match( '#Review it: https://example.test/wp-admin/post.php\?post=\d+&action=edit#', $m[1]['body'] ), 'owner email carries a working review link' );
check( count( $m ) >= 2 && 'asha@example.org' === $m[0]['to'] && 'owner@example.org' === $m[1]['to'], 'claim creation emails claimant and site owner' );
$GLOBALS['mails'] = array();
$GLOBALS['posts'][30] = array( 'type' => 'aw_listing', 'status' => 'publish', 'title' => "Evil\r\nBcc: x@y.z" );
$eid = dw_claim_create( 30, array_merge( $good, array( 'email' => 'eve@example.org' ) ) );
check( false === strpbrk( $GLOBALS['mails'][0]['subject'], "\r\n" ), 'subject is header-safe (no CR/LF)' );
$GLOBALS['mails'] = array();
dw_claim_transition( $eid, 'approved', 7 );
check( 1 === count( $GLOBALS['mails'] ) && 'eve@example.org' === $GLOBALS['mails'][0]['to'] && false !== strpos( $GLOBALS['mails'][0]['body'], 'approved' ), 'approval emails the claimant' );
$GLOBALS['mails'] = array();
dw_claim_transition( $eid, 'revoked', 7 );
dw_claim_transition( $eid, 'pending', 7 );
check( 1 === count( $GLOBALS['mails'] ), 're-opening a claim sends no email (revoke did)' );
$GLOBALS['mails'] = array(); $GLOBALS['opts']['aw_ff_send_email'] = '0';
$GLOBALS['posts'][31] = array( 'type' => 'aw_listing', 'status' => 'publish', 'title' => 'Quiet' );
dw_claim_create( 31, array_merge( $good, array( 'email' => 'quiet@example.org' ) ) );
check( 0 === count( $GLOBALS['mails'] ), 'no email while "Emails from forms and claims" is off' );

echo "\n$pass passed, $fail failed\n";
exit( $fail ? 1 : 0 );
