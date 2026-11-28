<?php
/**
 * MailWeb tests for includes/mail-delivery.php, mail-fallback-mailer.php and the log, fallback and alert parts of
 * mailweb-fluentsmtp.php, no WordPress needed (a stub PHPMailer stands in for WordPress's):
 *
 * - Everything is off on a clean install; settings are cleaned (bad address dropped, server name cut to a host name).
 * - The delivery log: nothing is written while the switch is off; sent, failed, fallback and queued are recorded as
 *   what happened, never as "delivered"; an unknown status is stored as failed; addresses are removed from errors; the
 *   log is cut to 200 lines.
 * - Fallback SMTP: the password is encrypted, kept when the field is left empty, removed on request and never printed
 *   by the form; the mailer tries the primary, then the fallback once, restores the primary settings, and reports a
 *   single error when both fail; it is not used while another SMTP plugin is active or the connection is incomplete.
 * - Failure alerts: off by default, at most one an hour, the failures in between are counted, the alert goes past the
 *   limit and pause, a failing alert raises no alert, no recipient or text is in it.
 * - The pause-notice dismiss: per user, for that pause only.
 *
 * Usage: php plugins/mailweb/tests/delivery.php
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

define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );
define( 'DAY_IN_SECONDS', 86400 );
define( 'MAILWEB_DIR', dirname( __DIR__ ) . '/' );
define( 'MAILWEB_CAP', 'manage_mailweb' );
define( 'ENT_QUOTES_X', 3 );

$GLOBALS['t_options']    = array();
$GLOBALS['t_transients'] = array();
$GLOBALS['t_usermeta']   = array();
$GLOBALS['t_mails']      = array(); // every wp_mail() call the stub saw
$GLOBALS['t_user']       = 7;

function get_option( $n, $d = false ) {
	return array_key_exists( $n, $GLOBALS['t_options'] ) ? $GLOBALS['t_options'][ $n ] : $d;
}
function update_option( $n, $v, $a = null ) {
	$GLOBALS['t_options'][ $n ] = $v;
	return true;
}
function get_transient( $n ) {
	return $GLOBALS['t_transients'][ $n ] ?? false;
}
function set_transient( $n, $v, $e = 0 ) {
	$GLOBALS['t_transients'][ $n ] = $v;
	return true;
}
function delete_transient( $n ) {
	unset( $GLOBALS['t_transients'][ $n ] );
	return true;
}
function get_current_user_id() {
	return $GLOBALS['t_user'];
}
function get_user_meta( $u, $k, $single = false ) {
	return $GLOBALS['t_usermeta'][ $u ][ $k ] ?? '';
}
function update_user_meta( $u, $k, $v ) {
	$changed                         = ( $GLOBALS['t_usermeta'][ $u ][ $k ] ?? null ) !== $v;
	$GLOBALS['t_usermeta'][ $u ][ $k ] = $v;
	return $changed;
}
function absint( $v ) {
	return abs( (int) $v );
}
function sanitize_key( $k ) {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $k ) );
}
function sanitize_text_field( $s ) {
	return trim( preg_replace( '/[\r\n\t ]+/', ' ', strip_tags( (string) $s ) ) );
}
function is_email( $e ) {
	return (bool) preg_match( '/^[a-z0-9._%+\-]+@[a-z0-9\-]+(\.[a-z0-9\-]+)+$/i', (string) $e ) ? $e : false;
}
function sanitize_email( $e ) {
	$e = strtolower( trim( (string) $e ) );
	return is_email( $e ) ? $e : '';
}
function wp_unslash( $v ) {
	return $v;
}
function wp_strip_all_tags( $s ) {
	return strip_tags( (string) $s );
}
function wp_specialchars_decode( $s, $q = 0 ) {
	return htmlspecialchars_decode( (string) $s, ENT_QUOTES );
}
function get_bloginfo( $k ) {
	return "Site\nName"; // a newline on purpose: it must never reach the subject
}
function is_wp_error( $e ) {
	return $e instanceof WP_Error;
}
class WP_Error {
	public $msg;
	public $data;
	public function __construct( $c = '', $m = '', $d = '' ) {
		$this->msg  = $m;
		$this->data = $d;
	}
	public function get_error_message() {
		return $this->msg;
	}
	public function get_error_data() {
		return $this->data;
	}
}
function __( $s ) {
	return $s;
}
function _n( $a, $b, $n ) {
	return 1 === (int) $n ? $a : $b;
}
function esc_html( $s ) {
	return htmlspecialchars( (string) $s );
}
function esc_attr( $s ) {
	return htmlspecialchars( (string) $s );
}
function esc_url( $s ) {
	return (string) $s;
}
function esc_html__( $s ) {
	return esc_html( $s );
}
function esc_attr__( $s ) {
	return esc_attr( $s );
}
function checked( $a, $b = true, $echo = true ) {
	return $a === $b ? ' checked="checked"' : '';
}
function wp_nonce_field( ...$a ) {
	echo '<input type="hidden" name="_wpnonce">';
}
function wp_admin_notice( $m, $a = array() ) {
	echo '<div class="notice">' . $m . '</div>';
}
function admin_url( $p = '' ) {
	return 'https://example.test/wp-admin/' . $p;
}
function wp_nonce_url( $u, $a ) {
	return $u . '&_wpnonce=abc';
}
function mailweb_settings_url( $sub = 'incoming', $args = array(), $anchor = '' ) {
	return 'https://example.test/wp-admin/admin.php?page=mailweb-settings&sub=' . $sub;
}
function mailweb_paused() {
	return get_option( 'mailweb_pause', false );
}
function mailweb_smtp_settings() {
	return array( 'pass' => get_option( 'primary_pass', '' ), 'user' => 'site@example.com', 'name' => 'Site' );
}
// A stand-in for the crypto helpers: reversible, and recognisable as "not the plain password".
function mailweb_encrypt( $p ) {
	return 'mwenc1:' . strrev( (string) $p );
}
function mailweb_decrypt( $p ) {
	return 0 === strpos( (string) $p, 'mwenc1:' ) ? strrev( substr( (string) $p, 7 ) ) : (string) $p;
}
function apply_filters( $n, $v, ...$a ) {
	return $v;
}
function add_action( ...$a ) {}
function add_filter( ...$a ) {}
function remove_action( ...$a ) {}
function current_user_can( $c ) {
	return true;
}
/** wp_mail stand-in: records the call, and fails when told to (firing the failure handler like WordPress). */
function wp_mail( $to, $subject, $message = '', $headers = '', $atts = array() ) {
	$GLOBALS['t_mails'][] = array( 'to' => $to, 'subject' => $subject, 'message' => $message, 'bypass' => ! empty( $GLOBALS['mailweb_bypass_cap'] ), 'alerting' => ! empty( $GLOBALS['mailweb_alerting'] ) );
	if ( ! empty( $GLOBALS['t_mail_fails'] ) ) {
		mailweb_on_mail_failed( new WP_Error( 'wp_mail_failed', 'SMTP Error: Could not authenticate for ' . $to, array( 'to' => array( $to ), 'subject' => $subject ) ) );
		return false;
	}
	return true;
}

// A stub PHPMailer in WordPress's namespace; it fails for hosts listed in $GLOBALS['t_fail_hosts'].
eval(
	'namespace PHPMailer\PHPMailer;
	class Exception extends \Exception {}
	class PHPMailer {
		public $Mailer = "mail"; public $Host = "primary.test"; public $Port = 25; public $SMTPAuth = false; public $SMTPSecure = "";
		public $Username = ""; public $Password = ""; public $From = "site@example.com"; public $FromName = "Site"; public $Sender = ""; public $ErrorInfo = "";
		protected $exceptions; public $reply = array(); public static $validator; public $sent_via = array();
		public function __construct( $e = null ) { $this->exceptions = (bool) $e; }
		public function isSMTP() { $this->Mailer = "smtp"; }
		public function smtpClose() {}
		public function getReplyToAddresses() { return $this->reply; }
		public function clearReplyTos() { $this->reply = array(); }
		public function addReplyTo( $a, $n = "" ) { $this->reply[ $a ] = array( $a, $n ); return true; }
		public function setFrom( $a, $n = "", $auto = true ) { $this->From = $a; $this->FromName = $n; return true; }
		public function send() {
			$this->sent_via[] = array( $this->Host, $this->Username, $this->Password, $this->From, array_keys( $this->reply ) );
			if ( in_array( $this->Host, $GLOBALS["t_fail_hosts"] ?? array(), true ) ) {
				$this->ErrorInfo = "SMTP Error: Could not authenticate to " . $this->Host . " as " . $this->Username . ".";
				if ( $this->exceptions ) { throw new Exception( $this->ErrorInfo ); }
				return false;
			}
			return true;
		}
	}
	class ForeignMailer extends PHPMailer {}'
);

require dirname( __DIR__ ) . '/includes/sending-mode.php';
require dirname( __DIR__ ) . '/includes/mailweb-fluentsmtp.php';
require dirname( __DIR__ ) . '/includes/mail-delivery.php';
require dirname( __DIR__ ) . '/includes/mail-fallback-mailer.php';

$fails = 0;
function t( $ok, $label ) {
	global $fails;
	echo ( $ok ? 'ok   ' : 'FAIL ' ) . $label . "\n";
	$fails += $ok ? 0 : 1;
}
function t_reset() {
	$GLOBALS['t_options']    = array();
	$GLOBALS['t_transients'] = array();
	$GLOBALS['t_usermeta']   = array();
	$GLOBALS['t_mails']      = array();
	$GLOBALS['t_mail_fails'] = false;
	$GLOBALS['t_fail_hosts'] = array();
	unset( $GLOBALS['mailweb_fallback_error'], $GLOBALS['mailweb_alerting'], $GLOBALS['mailweb_bypass_cap'], $GLOBALS['phpmailer'] );
}
function t_fallback_on() {
	mailweb_smtp_fallback_save( array( 'enabled' => 1, 'host' => 'fallback.test', 'port' => 587, 'user' => 'backup@example.com', 'pass' => 'f4llb@ck' ) );
}

// ---------- A clean install: everything off ----------
t_reset();
$d = mailweb_delivery_settings();
t( 0 === $d['log_mail'] && 0 === $d['alerts'] && '' === $d['alert_to'], 'clean install: log, alerts off and no alert address' );
t( ! mailweb_delivery_on( 'log_mail' ) && ! mailweb_delivery_on( 'alerts' ) && ! mailweb_fallback_active(), 'clean install: log, alerts and fallback are all off' );
t( false === get_option( 'mailweb_smtp_fallback', false ), 'clean install: no fallback option exists' );
$c = mailweb_delivery_clean( array( 'log_mail' => '1', 'alerts' => 'on', 'alert_to' => 'not-an-address' ) );
t( 1 === $c['log_mail'] && 1 === $c['alerts'] && '' === $c['alert_to'], 'delivery settings: bad alert address is dropped' );
t( 'ops@example.com' === mailweb_delivery_clean( array( 'alert_to' => ' OPS@example.com ' ) )['alert_to'], 'delivery settings: a good address is kept, lower-cased' );
$GLOBALS['t_options']['admin_email'] = 'admin@example.com';
t( 'admin@example.com' === mailweb_alert_recipient(), 'alert recipient: the administration email when none is set' );
update_option( 'mailweb_delivery', array( 'alert_to' => 'ops@example.com' ) );
t( 'ops@example.com' === mailweb_alert_recipient(), 'alert recipient: the saved address wins' );

// ---------- Logging ----------
t_reset();
mailweb_on_mail_succeeded( array( 'to' => array( 'a@example.com' ), 'subject' => 'Hi' ) );
mailweb_on_mail_failed( new WP_Error( 'x', 'boom', array( 'to' => array( 'a@example.com' ), 'subject' => 'Hi' ) ) );
mailweb_on_mail_queued( array( 'to' => 'a@example.com', 'subject' => 'Hi' ) );
t( array() === mailweb_logs_list(), 'log off: nothing is recorded for sent, failed or queued' );

update_option( 'mailweb_delivery', array( 'log_mail' => 1 ) );
mailweb_on_mail_succeeded( array( 'to' => array( 'a@example.com', 'b@example.com' ), 'subject' => 'Hi', 'message' => 'SECRET BODY' ) );
$l = mailweb_logs_list();
t( 1 === count( $l ) && 'sent' === $l[0]['status'] && 'a@example.com, b@example.com' === $l[0]['to'] && 'Hi' === $l[0]['subject'], 'log on: a sent email is recorded with recipients and subject' );
t( false === strpos( wp_json_encode_t( $l ), 'SECRET BODY' ), 'log on: the text of the email is never stored' );
function wp_json_encode_t( $v ) {
	return json_encode( $v );
}
mailweb_on_mail_failed( new WP_Error( 'x', 'SMTP Error: could not authenticate as a@example.com', array( 'to' => array( 'c@example.com' ), 'subject' => 'Bye' ) ) );
$l = mailweb_logs_list();
t( 'failed' === $l[0]['status'] && 'c@example.com' === $l[0]['to'] && false === strpos( $l[0]['error'], 'a@example.com' ) && false !== strpos( $l[0]['error'], '[address]' ), 'log on: a failure is recorded as failed, addresses removed from the error' );
$GLOBALS['mailweb_fallback_error'] = 'primary refused';
mailweb_on_mail_succeeded( array( 'to' => 'd@example.com', 'subject' => 'Via fallback' ) );
$l = mailweb_logs_list();
t( 'fallback' === $l[0]['status'] && 'fallback' === $l[0]['provider'] && false !== strpos( $l[0]['error'], 'primary refused' ), 'log on: an email the fallback accepted is recorded as fallback, with the primary error' );
t( ! isset( $GLOBALS['mailweb_fallback_error'] ), 'log on: the fallback marker is consumed' );
mailweb_on_mail_succeeded( array( 'to' => 'e@example.com', 'subject' => 'Next' ) );
t( 'sent' === mailweb_logs_list()[0]['status'], 'log on: the next email is not marked fallback' );
mailweb_on_mail_queued( array( 'to' => 'q@example.com', 'subject' => 'Held' ) );
t( 'queued' === mailweb_logs_list()[0]['status'] && 'queue' === mailweb_logs_list()[0]['provider'], 'log on: a queued email is recorded as queued' );
mailweb_log_record( array( 'to' => 'z@example.com', 'status' => 'delivered' ) );
t( 'failed' === mailweb_logs_list()[0]['status'], 'an unknown status is stored as failed, never as sent' );
t( false === stripos( mailweb_log_status_label( 'sent' ), 'delivered' ) && 'Failed' === mailweb_log_status_label( 'failed' ), 'status labels say accepted, not delivered' );
$GLOBALS['t_options']['mailweb_email_logs'] = array();
for ( $i = 0; $i < 230; $i++ ) {
	mailweb_log_record( array( 'to' => "u$i@example.com", 'status' => 'sent' ) );
}
t( 200 === count( get_option( 'mailweb_email_logs' ) ) && 'u229@example.com' === mailweb_logs_list( 1 )[0]['to'], 'the log keeps the last 200 lines, newest first' );

// ---------- Fallback settings ----------
t_reset();
t_fallback_on();
$raw = get_option( 'mailweb_smtp_fallback' );
t( 'f4llb@ck' !== $raw['pass'] && 0 === strpos( $raw['pass'], 'mwenc1:' ), 'fallback: the password is stored encrypted' );
t( 'f4llb@ck' === mailweb_smtp_fallback_settings()['pass'], 'fallback: the password reads back for sending' );
mailweb_smtp_fallback_save( array( 'enabled' => 1, 'host' => 'fallback.test', 'port' => 587, 'user' => 'backup@example.com', 'pass' => '' ) );
t( 'f4llb@ck' === mailweb_smtp_fallback_settings()['pass'], 'fallback: an empty password field keeps the saved one' );
mailweb_smtp_fallback_save( array( 'enabled' => 1, 'host' => 'HTTPS://Smtp.Example.com:465/path', 'port' => 99999, 'user' => 'b@example.com', 'pass' => '', 'clear_pass' => 1 ) );
$f = mailweb_smtp_fallback_settings();
t( 'smtp.example.com' === $f['host'] && 65535 === $f['port'] && '' === $f['pass'], 'fallback: server name cut to a host, port clamped, password removed on request' );
t( ! mailweb_fallback_active(), 'fallback: switched on but without a password it is not used' );
mailweb_smtp_fallback_save( array( 'enabled' => 0, 'host' => 'x.test', 'port' => 0, 'user' => 'bad', 'pass' => 'p' ) );
$f = mailweb_smtp_fallback_settings();
t( 465 === $f['port'] && '' === $f['user'] && ! mailweb_fallback_active(), 'fallback: port 0 is 465, a bad mailbox is dropped, off is not used' );
t_fallback_on();
t( mailweb_fallback_active(), 'fallback: complete and on is used' );

// The form never prints the password.
update_option( 'mailweb_delivery', array( 'log_mail' => 1, 'alerts' => 1, 'alert_to' => 'ops@example.com' ) );
ob_start();
mailweb_delivery_form();
$html = ob_get_clean();
t( false === strpos( $html, 'f4llb@ck' ) && false === strpos( $html, strrev( 'f4llb@ck' ) ) && false === strpos( $html, 'mwenc1' ), 'form: the saved password is never in the page' );
t( false !== strpos( $html, 'name="fb_pass"' ) && false !== strpos( $html, 'type="password"' ) && false !== strpos( $html, 'name="_wpnonce"' ), 'form: a password field and a nonce' );
t( false !== strpos( $html, 'Saved. Leave empty to keep it.' ) && false !== strpos( $html, 'fb_clear_pass' ), 'form: says a password is saved and offers to remove it' );
t_reset();
ob_start();
mailweb_delivery_form();
$html = ob_get_clean();
t( false === strpos( $html, ' checked' ), 'form on a clean install: no switch is ticked' );

// ---------- The mailer ----------
t_reset();
t_fallback_on();
use PHPMailer\PHPMailer\PHPMailer as P;
use PHPMailer\PHPMailer\Exception as PE;
$m = new MailWeb_Fallback_Mailer( true );
t( $m->send() && ! isset( $GLOBALS['mailweb_fallback_error'] ) && 1 === count( $m->sent_via ), 'mailer: the primary accepts it, the fallback is not touched' );

$m                       = new MailWeb_Fallback_Mailer( true );
$GLOBALS['t_fail_hosts'] = array( 'primary.test' );
$ok                      = $m->send();
t( $ok && 2 === count( $m->sent_via ), 'mailer: primary fails, the fallback is tried once and its success is the result' );
t( 'fallback.test' === $m->sent_via[1][0] && 'backup@example.com' === $m->sent_via[1][1] && 'f4llb@ck' === $m->sent_via[1][2], 'mailer: the retry uses the fallback server, mailbox and password' );
t( 'backup@example.com' === $m->sent_via[1][3] && array( 'site@example.com' ) === $m->sent_via[1][4], 'mailer: the retry sends from the fallback mailbox, the original From becomes Reply-To' );
t( 'primary.test' === $m->Host && 'mail' === $m->Mailer && 'site@example.com' === $m->From && '' === $m->Username && '' === $m->Password && array() === $m->reply, 'mailer: the primary settings are back after the retry' );
t( isset( $GLOBALS['mailweb_fallback_error'] ) && false === strpos( $GLOBALS['mailweb_fallback_error'], 'site@example.com' ), 'mailer: the primary error is kept for the log, without addresses' );

$m                       = new MailWeb_Fallback_Mailer( true );
$m->addReplyTo( 'sales@example.com', 'Sales' );
$m->send();
t( array( 'sales@example.com' ) === $m->sent_via[1][4] && array( 'sales@example.com' ) === array_keys( $m->reply ), 'mailer: a message that has its own Reply-To keeps it, before and after' );

$m                       = new MailWeb_Fallback_Mailer( true );
$GLOBALS['t_fail_hosts'] = array( 'primary.test', 'fallback.test' );
$msg                     = '';
try {
	$m->send();
} catch ( PE $e ) {
	$msg = $e->getMessage();
}
t( '' !== $msg && false !== strpos( $msg, 'primary.test' ) && false !== strpos( $msg, 'Fallback:' ) && false !== strpos( $msg, 'fallback.test' ), 'mailer: both fail: one error naming both' );
t( 2 === count( $m->sent_via ) && 'primary.test' === $m->Host && 'mail' === $m->Mailer, 'mailer: both fail: tried exactly twice, primary settings restored' );
t( false === strpos( $msg, 'f4llb@ck' ), 'mailer: the password is not in the error' );

$m = new MailWeb_Fallback_Mailer( false );
$GLOBALS['t_fail_hosts'] = array( 'primary.test', 'fallback.test' );
t( false === $m->send() && false !== strpos( $m->ErrorInfo, 'Fallback:' ), 'mailer: with exceptions off both failing returns false and sets ErrorInfo' );

t_reset();
$m                       = new MailWeb_Fallback_Mailer( true );
$GLOBALS['t_fail_hosts'] = array( 'primary.test' );
$threw                   = false;
try {
	$m->send();
} catch ( PE $e ) {
	$threw = true;
}
t( $threw && 1 === count( $m->sent_via ), 'mailer: fallback off: the primary failure is thrown, no second attempt' );

// Which PHPMailer wp_mail gets.
t_reset();
t_fallback_on();
unset( $GLOBALS['phpmailer'] );
mailweb_prepare_fallback_mailer( array() );
t( $GLOBALS['phpmailer'] instanceof MailWeb_Fallback_Mailer, 'prepare: no PHPMailer yet: ours is used' );
$GLOBALS['phpmailer'] = new P( true );
mailweb_prepare_fallback_mailer( array() );
t( $GLOBALS['phpmailer'] instanceof MailWeb_Fallback_Mailer, 'prepare: a plain PHPMailer is replaced by ours' );
$mine = $GLOBALS['phpmailer'];
mailweb_prepare_fallback_mailer( array() );
t( $mine === $GLOBALS['phpmailer'], 'prepare: ours is kept' );
$GLOBALS['phpmailer'] = $foreign = new PHPMailer\PHPMailer\ForeignMailer( true );
mailweb_prepare_fallback_mailer( array() );
t( $foreign === $GLOBALS['phpmailer'], 'prepare: another plugin\'s PHPMailer is left alone' );
t_reset();
mailweb_prepare_fallback_mailer( array() );
t( ! isset( $GLOBALS['phpmailer'] ), 'prepare: fallback off: nothing is touched' );

// ---------- Alerts ----------
t_reset();
$GLOBALS['t_options']['admin_email'] = 'admin@example.com';
t( false === mailweb_failure_alert( 'boom' ) && array() === $GLOBALS['t_mails'], 'alerts off: no email is sent' );
update_option( 'mailweb_delivery', array( 'alerts' => 1 ) );
t( true === mailweb_failure_alert( 'SMTP Error: could not authenticate' ), 'alerts on: the first failure sends an alert' );
$a = $GLOBALS['t_mails'][0];
t( 'admin@example.com' === $a['to'], 'alert: goes to the administration email by default' );
t( false === strpos( $a['subject'], "\n" ) && false !== strpos( $a['subject'], 'Site Name' ), 'alert: the subject is one line' );
t( false !== strpos( $a['message'], '1 email could not be sent' ) && false !== strpos( $a['message'], 'could not authenticate' ) && false !== strpos( $a['message'], 'No fallback SMTP' ), 'alert: count, last error and fallback state' );
t( $a['bypass'] && $a['alerting'] && empty( $GLOBALS['mailweb_bypass_cap'] ) && empty( $GLOBALS['mailweb_alerting'] ), 'alert: sent past the limit and pause, and the flags are cleared after' );
t( false === mailweb_failure_alert( 'again' ) && false === mailweb_failure_alert( 'again' ) && 1 === count( $GLOBALS['t_mails'] ), 'alerts: a second and third failure within the hour send nothing' );
delete_transient( 'mailweb_alert_throttled' ); // the hour passes
mailweb_failure_alert( 'later' );
t( 2 === count( $GLOBALS['t_mails'] ) && false !== strpos( $GLOBALS['t_mails'][1]['message'], '3 emails could not be sent' ), 'alerts: after the hour the next alert counts the failures in between' );
t( false === get_transient( 'mailweb_alert_count' ), 'alerts: the count starts again after an alert' );

t_reset();
update_option( 'mailweb_delivery', array( 'alerts' => 1, 'alert_to' => 'ops@example.com' ) );
$GLOBALS['t_mail_fails'] = true; // the alert itself fails
mailweb_on_mail_failed( new WP_Error( 'x', 'boom', array( 'to' => array( 'a@example.com' ), 'subject' => 'S' ) ) );
t( 1 === count( $GLOBALS['t_mails'] ) && 'ops@example.com' === $GLOBALS['t_mails'][0]['to'], 'alerts: a failing alert does not raise another alert (no loop)' );
t( false === strpos( json_encode( $GLOBALS['t_mails'][0] ), 'a@example.com' ), 'alert: no recipient of the failed email in it' );
t_reset();
update_option( 'mailweb_delivery', array( 'alerts' => 1 ) );
mailweb_on_mail_failed( new WP_Error( 'x', 'boom' ) );
t( array() === $GLOBALS['t_mails'], 'alerts: no recipient known (no admin email set): nothing is sent' );

// ---------- Dismiss the paused notice ----------
t_reset();
$p1 = array( 'at' => 1000, 'error' => 'refused' );
t( false === mailweb_dismiss_pause_notice(), 'dismiss: nothing to dismiss when sending is not paused' );
update_option( 'mailweb_pause', $p1 );
t( ! mailweb_is_pause_dismissed_for_user( $p1 ), 'dismiss: shown until dismissed' );
t( mailweb_dismiss_pause_notice() && mailweb_is_pause_dismissed_for_user( $p1 ), 'dismiss: hides this pause for this user' );
t( mailweb_dismiss_pause_notice(), 'dismiss: dismissing twice still reports success' );
$GLOBALS['t_user'] = 8;
t( ! mailweb_is_pause_dismissed_for_user( $p1 ), 'dismiss: another user still sees it' );
$GLOBALS['t_user'] = 7;
t( ! mailweb_is_pause_dismissed_for_user( array( 'at' => 2000, 'error' => 'refused again' ) ), 'dismiss: a new pause shows the notice again' );
t( false !== strpos( mailweb_dismiss_pause_url(), 'action=mailweb_dismiss_pause' ) && false !== strpos( mailweb_dismiss_pause_url(), '_wpnonce=' ), 'dismiss: the link carries an action and a nonce' );

// ---------- Another SMTP plugin: no fallback ----------
t_reset();
t_fallback_on();
t( mailweb_fallback_active(), 'fallback is used when MailWeb is the sender' );
define( 'POST_SMTP_VER', '3' );
t( ! mailweb_fallback_active(), 'fallback is not used while another SMTP plugin is active' );
t( 'other-plugin' === mailweb_delivery_provider( false ), 'log: another SMTP plugin is named as the way it was sent' );


// ---------- Resend: only a failed or held row that still has its message ----------
t( mailweb_resend_allowed( 'failed' ) && mailweb_resend_allowed( 'held' ), 'resend: failed and held rows can go again' );
t( ! mailweb_resend_allowed( 'queued' ) && ! mailweb_resend_allowed( 'sent' ) && ! mailweb_resend_allowed( 'sending' ) && ! mailweb_resend_allowed( '' ), 'resend: waiting, sent and sending rows are left alone' );
class T_Wpdb {
	public $prefix = 'wp_';
	public $last   = array();
	public $rows   = array(
		1 => array( 'status' => 'failed', 'mail' => '{"to":"a@example.com"}' ),
		2 => array( 'status' => 'sent', 'mail' => '{"to":"a@example.com"}' ),
		3 => array( 'status' => 'failed', 'mail' => null ), // the text was not kept
		4 => array( 'status' => 'held', 'mail' => '{"to":"b@example.com"}' ),
	);
	public function prepare( $q, ...$a ) {
		$this->last = array( $q, $a );
		return $q;
	}
	public function get_var( $q ) {
		$id = $this->last[1][1] ?? 0;
		return isset( $this->rows[ $id ] ) && null !== $this->rows[ $id ]['mail'] ? $this->rows[ $id ]['status'] : null;
	}
	public function update( $table, $data, $where ) {
		if ( ! isset( $this->rows[ $where['id'] ] ) ) {
			return 0;
		}
		$this->rows[ $where['id'] ] = array_merge( $this->rows[ $where['id'] ], array( 'status' => $data['status'] ) );
		return 1;
	}
}
$GLOBALS['wpdb'] = new T_Wpdb();
t( 'failed' === mailweb_queue_row_status( 1 ), 'resend: the status of a row with its message is read' );
t( '' === mailweb_queue_row_status( 3 ), 'resend: a row whose message was not kept is not offered' );
t( '' === mailweb_queue_row_status( 99 ) && '' === mailweb_queue_row_status( 0 ), 'resend: no row, no status' );
t( true === mailweb_resend_email( 1 ) && 'queued' === $GLOBALS['wpdb']->rows[1]['status'], 'resend: a failed row goes back to queued' );
t( true === mailweb_resend_email( 4 ) && 'queued' === $GLOBALS['wpdb']->rows[4]['status'], 'resend: a held row goes back to queued' );
t( false === mailweb_resend_email( 2 ) && 'sent' === $GLOBALS['wpdb']->rows[2]['status'], 'resend: a sent row is not sent twice' );
t( false === mailweb_resend_email( 3 ), 'resend: a row with no message is refused' );
t( false === mailweb_resend_email( 1 ), 'resend: a row already queued is not requeued' );
unset( $GLOBALS['wpdb'] );

// ---------- The queue row id reaches the log ----------
// ---------- The queue row id reaches the log, so the Resend button has a row to act on ----------
t_reset();
update_option( 'mailweb_delivery', mailweb_delivery_clean( array( 'log_mail' => '1' ) ) );
$GLOBALS['mailweb_failed_queue_id'] = 41;
mailweb_on_mail_failed( new WP_Error( 'x', 'boom', array( 'to' => array( 'a@example.com' ), 'subject' => 'Hi' ) ) );
mailweb_on_mail_queued( array( 'to' => 'q@example.com', 'subject' => 'Held' ), 52 );
$ql = get_option( 'mailweb_email_logs', array() );
t( 41 === ( $ql[0]['queue_id'] ?? 0 ) && 'failed' === $ql[0]['status'], 'log: a failed direct send keeps its queue row id' );
t( 52 === ( $ql[1]['queue_id'] ?? 0 ) && 'queued' === $ql[1]['status'], 'log: a queued mail keeps its queue row id' );
t( ! isset( $GLOBALS['mailweb_failed_queue_id'] ), 'log: the id is used once, not carried to the next failure' );

// ---------- Inbox status: New, Read, Replied, Forwarded ----------
$inbox_src = file_get_contents( dirname( __DIR__ ) . '/includes/inbox.php' );
foreach ( array( 'mailweb_row_status', 'mailweb_row_status_label' ) as $fn ) {
	preg_match( '/^function ' . $fn . '\(.*?^\}/ms', $inbox_src, $m );
	t( ! empty( $m[0] ), "status: $fn is in inbox.php" );
	if ( ! empty( $m[0] ) ) {
		eval( $m[0] );
	}
}
t( 'new' === mailweb_row_status( array( 'unseen' => true, 'answered' => true ) ), 'status: an unseen message is New whatever else it carries' );
t( 'read' === mailweb_row_status( array( 'unseen' => false ) ), 'status: a seen message with no flag is Read' );
t( 'replied' === mailweb_row_status( array( 'answered' => true ) ), 'status: Answered is Replied' );
t( 'forwarded' === mailweb_row_status( array( 'forwarded' => true ) ), 'status: Forwarded is Forwarded' );
t( 'replied' === mailweb_row_status( array( 'answered' => true, 'forwarded' => true ) ), 'status: replied and forwarded shows Replied' );
t( 'Replied' === mailweb_row_status_label( 'replied' ) && 'Read' === mailweb_row_status_label( 'nonsense' ), 'status: the words, and an unknown one reads Read' );

// ---------- SMTP presets: what the Provider picker fills in ----------
$pre = mailweb_smtp_presets();
t( isset( $pre['hostinger'], $pre['gmail'], $pre['custom'] ), 'presets: the common providers and Custom are listed' );
$bad = array();
foreach ( $pre as $k => $p ) {
	if ( 'custom' === $k ) {
		continue;
	}
	if ( ! preg_match( '/^[a-z0-9.-]+\.[a-z]{2,}$/', $p['host'] ) || ! in_array( (int) $p['port'], array( 25, 465, 587, 2525 ), true ) || ( 465 === (int) $p['port'] ) !== ( 'ssl' === $p['encryption'] ) ) {
		$bad[] = $k;
	}
}
t( ! $bad, 'presets: each has a real host name, a standard port, and SSL only on 465' . ( $bad ? ' (' . implode( ',', $bad ) . ')' : '' ) );
t( '' === $pre['custom']['host'], 'presets: Custom leaves the server empty, so the picker fills nothing' );

echo $fails ? "\n$fails failed\n" : "\nall passed\n";
exit( $fails ? 1 : 0 );
