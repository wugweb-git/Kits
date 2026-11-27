<?php
/**
 * MailWeb tests for includes/sending-mode.php and the capability rule, no WordPress needed:
 * a new install has force-From, the daily limit and body logging all off; a site with saved MailWeb settings keeps the
 * old behaviour (force-From and limit on); another SMTP plugin makes MailWeb stand down; the filter overrides both ways;
 * the retention is clamped; MAILWEB_CAP is for administrators only unless the filter widens it.
 *
 * Usage: php plugins/mailweb/tests/sending-mode.php
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable -- a command-line test runner with WordPress stubs.

$GLOBALS['sm_options'] = array();
$GLOBALS['sm_filters'] = array();

function get_option( $name, $fallback = false ) {
	return array_key_exists( $name, $GLOBALS['sm_options'] ) ? $GLOBALS['sm_options'][ $name ] : $fallback;
}
function absint( $v ) {
	return abs( (int) $v );
}
function sanitize_key( $k ) {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $k ) );
}
function apply_filters( $name, $value, ...$args ) {
	foreach ( $GLOBALS['sm_filters'][ $name ] ?? array() as $cb ) {
		$value = $cb( $value, ...$args );
	}
	return $value;
}
function add_action( ...$a ) {}
function add_filter( ...$a ) {}
function register_activation_hook( ...$a ) {}

require dirname( __DIR__ ) . '/includes/sending-mode.php';
require dirname( __DIR__ ) . '/includes/mailweb-caps.php';

$fails = 0;
function sm_t( $ok, $label ) {
	global $fails;
	echo ( $ok ? 'ok   ' : 'FAIL ' ) . $label . "\n";
	$fails += $ok ? 0 : 1;
}
function sm_reset() {
	$GLOBALS['sm_options'] = array();
	$GLOBALS['sm_filters'] = array();
}

// A new install: everything off.
sm_reset();
sm_t( false === mailweb_is_configured_site(), 'no saved settings: not a configured site' );
$s = mailweb_sending_settings();
sm_t( 0 === $s['force_from'] && 0 === $s['cap'] && 0 === $s['log_body'] && 30 === $s['log_days'], 'new install: force From, limit and body logging are off, 30 days' );
sm_t( ! mailweb_sending_on( 'force_from' ) && ! mailweb_cap_active() && ! mailweb_sending_on( 'log_body' ), 'new install: nothing is taken over' );

// A site that saved MailWeb settings keeps the old behaviour (body logging stays off).
foreach ( array( 'mailweb_smtp', 'mailweb_cap', 'mailweb_mailboxes', 'mailweb_crm', 'mailweb_default_from' ) as $opt ) {
	sm_reset();
	$GLOBALS['sm_options'][ $opt ] = 'mailweb_cap' === $opt || 'mailweb_smtp' === $opt || 'mailweb_crm' === $opt || 'mailweb_mailboxes' === $opt ? array( 'x' => 1 ) : 'support';
	$s = mailweb_sending_settings();
	sm_t( mailweb_is_configured_site() && 1 === $s['force_from'] && 1 === $s['cap'] && 0 === $s['log_body'], "existing site ($opt saved): force From and limit on, body logging off" );
}
sm_reset();
$GLOBALS['sm_options']['mailweb_cap'] = array();
sm_t( ! mailweb_is_configured_site(), 'an empty saved option does not count as configured' );

// Once stored, the stored values win over detection.
sm_reset();
$GLOBALS['sm_options']['mailweb_cap']     = array( 'budget' => 50 );
$GLOBALS['sm_options']['mailweb_sending'] = array( 'force_from' => 0, 'cap' => 1, 'log_body' => 1, 'log_days' => 7 );
$s = mailweb_sending_settings();
sm_t( 0 === $s['force_from'] && 1 === $s['cap'] && 1 === $s['log_body'] && 7 === mailweb_log_days(), 'stored switches win over detection; retention 7 days' );

// Retention is clamped to 1..365 and falls back to 30.
sm_t( 365 === mailweb_sending_clean( array( 'log_days' => 9999 ) )['log_days'], 'retention is at most 365 days' );
sm_t( 30 === mailweb_sending_clean( array( 'log_days' => 0 ) )['log_days'] && 30 === mailweb_sending_clean( array() )['log_days'], 'retention 0 or missing is 30 days' );
sm_t( 1 === mailweb_sending_clean( array( 'log_days' => 1 ) )['log_days'], 'retention 1 stays 1' );

// Another SMTP plugin: MailWeb stands down, even when its switches are on; body logging is not a takeover.
sm_reset();
$GLOBALS['sm_options']['mailweb_sending'] = array( 'force_from' => 1, 'cap' => 1, 'log_body' => 1, 'log_days' => 30 );
sm_t( ! mailweb_defer_to_external_smtp() && mailweb_sending_on( 'force_from' ) && mailweb_cap_active(), 'no other SMTP plugin: switches apply' );
define( 'POST_SMTP_VER', '3' );
sm_t( 'Post SMTP' === mailweb_external_smtp_plugin() && mailweb_defer_to_external_smtp(), 'Post SMTP constant: MailWeb defers' );
sm_t( ! mailweb_sending_on( 'force_from' ) && ! mailweb_cap_active() && ! mailweb_takes_over_mail(), 'deferring: no forced From, no limit, no takeover' );

// The filter works both ways.
$GLOBALS['sm_filters']['mailweb_defer_to_external_smtp'][] = fn( $d, $p ) => false;
sm_t( ! mailweb_defer_to_external_smtp() && mailweb_cap_active(), 'filter false: MailWeb sends anyway' );
$GLOBALS['sm_filters']['mailweb_defer_to_external_smtp'] = array( fn( $d, $p ) => 'Post SMTP' === $p ? $d : true );
sm_t( mailweb_defer_to_external_smtp(), 'filter true: defers' );

// The capability: administrators only, unless the filter widens it.
sm_reset();
sm_t( array() === mailweb_caps_from(), 'manage_mailweb: no extra capability grants it by default' );
$GLOBALS['sm_filters']['mailweb_caps_from'][] = fn( $c ) => array( 'edit_others_posts', 'Bad Cap!' );
sm_t( array( 'edit_others_posts', 'badcap' ) === mailweb_caps_from(), 'manage_mailweb: the filter widens it (names are sanitised)' );
$all = mailweb_caps_fallback( array( 'edit_others_posts' => true ) );
sm_t( ! empty( $all['manage_mailweb'] ), 'manage_mailweb: an editor gets it only when the filter widens it' );
sm_reset();
$all = mailweb_caps_fallback( array( 'edit_others_posts' => true ) );
sm_t( empty( $all['manage_mailweb'] ), 'manage_mailweb: an editor does not have it by default' );

echo $fails ? "\n$fails failed\n" : "\nall passed\n";
exit( $fails ? 1 : 0 );
