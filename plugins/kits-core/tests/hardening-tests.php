<?php
/**
 * Kits Core 1.4.1 hardening tests, one section per fix:
 *   1. the form-nonce endpoint mints a nonce only for a real form;
 *   2. a theme update package needs an https address and a SHA-256, and the download is checked against it;
 *   3. an ALTCHA answer works once, even when two requests arrive together (atomic claim);
 *   4. the preview device link keeps its token out of the query string and works once;
 *   5. the settings download link carries a single-use token, not the reusable REST nonce.
 *
 * Usage: php plugins/kits-core/tests/hardening-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO, Generic.Files.OneObjectStructurePerFile -- a command-line test runner with stand-ins.

require __DIR__ . '/wp-stubs.php';

if ( ! extension_loaded( 'pdo_sqlite' ) ) {
	echo "SKIP-FAIL: pdo_sqlite is needed for the ALTCHA atomic-claim test\n";
	exit( 1 );
}

// ---- stand-ins only this file needs ----
define( 'KITS_UPDATE_URL', 'https://example.test/kits-theme.json' );
$GLOBALS['t_remote'] = array();
function wp_remote_get( $url, $args = array() ) {
	return $GLOBALS['t_remote'][ $url ] ?? new WP_Error( 'none', 'no answer' );
}
function wp_remote_retrieve_response_code( $r ) {
	return $r['code'] ?? 0;
}
function wp_remote_retrieve_body( $r ) {
	return $r['body'] ?? '';
}
function download_url( $url ) {
	$GLOBALS['t_downloaded'][] = $url;
	$f = tempnam( sys_get_temp_dir(), 'kits-dl' );
	file_put_contents( $f, $GLOBALS['t_package_bytes'] ?? '' );
	return $f;
}
function wp_get_theme( $s = '' ) {
	return new class() {
		public function exists() {
			return false;
		}
	};
}

require dirname( __DIR__ ) . '/includes/form-kit.php';
require dirname( __DIR__ ) . '/includes/registry-updates.php';
require dirname( __DIR__ ) . '/includes/theme-updates.php';
require dirname( __DIR__ ) . '/includes/altcha.php';
require dirname( __DIR__ ) . '/includes/preview.php';
require dirname( __DIR__ ) . '/includes/settings-transfer.php';

ob_start(); // cookies and headers in the preview tests

// ================= 1. form nonce endpoint =================
t_reset();
t( '' === kits_form_nonce_for( 'anything_at_all' ), '1: an unknown action name gets no nonce' );
t( '' === kits_form_nonce_for( '' ), '1: an empty key gets no nonce' );
t( '' === kits_form_nonce_for( 'delete_everything' ), '1: a key that is not a form gets no nonce' );
add_action( 'admin_post_nopriv_contact_us', '__return_true' );
t( '' !== kits_form_nonce_for( 'contact_us' ), '1: a form with a public handler gets its nonce' );
t( wp_create_nonce( 'contact_us' ) === kits_form_nonce_for( 'contact_us' ), '1: the nonce is the one the form checks (action = form key)' );
add_action( 'admin_post_members_only', '__return_true' );
t( '' !== kits_form_nonce_for( 'members_only' ), '1: a form with a signed-in handler gets its nonce' );
t( '' === kits_form_nonce_for( 'site_layer_form' ), '1: a form only a site layer knows is refused until it is listed' );
add_filter( 'kits_form_nonce_actions', fn( $a ) => array_merge( $a, array( 'site_layer_form' ) ) );
t( '' !== kits_form_nonce_for( 'site_layer_form' ), '1: kits_form_nonce_actions lists extra forms' );
t( wp_create_nonce( 'contact_us' ) === kits_form_nonce_for( 'Contact_Us' ), '1: keys are lower-cased like the form key' );
$_GET['form'] = 'not_a_form';
try {
	kits_form_nonce_json();
	t( false, '1: the endpoint answers' );
} catch ( T_Die $e ) {
	t( array( 'nonce' => '' ) === $e->payload, '1: the endpoint returns an empty nonce for an unknown form' );
}
$_GET['form'] = 'contact_us';
try {
	kits_form_nonce_json();
} catch ( T_Die $e ) {
	t( ( $e->payload['nonce'] ?? '' ) === wp_create_nonce( 'contact_us' ), '1: the endpoint still serves a cached page a fresh key' );
}

// ================= 2. theme update integrity =================
$bytes = 'PK-pretend-zip-bytes';
$sha   = hash( 'sha256', $bytes );
$pkg   = 'https://downloads.example.test/kits-by-wugweb-2.3.0.zip';
$serve = function ( array $json ) {
	t_reset();
	$GLOBALS['t_remote'][ KITS_UPDATE_URL ] = array(
		'code' => 200,
		'body' => json_encode( $json ),
	);
	add_filter( 'update_themes_wugweb.com', function () {
		return false;
	}, 5, 3 ); // keeps the hook list non-empty like core
};
$update = function () {
	$cb = array();
	foreach ( t_hook_callbacks( 'update_themes_wugweb.com' ) as $c ) {
		$cb[] = $c;
	}
	return $cb;
};
$ask = function () use ( $update ) {
	$r = false;
	foreach ( $update() as $c ) {
		$r = $c( $r, array( 'UpdateURI' => 'https://wugweb.com/kits' ), 'kits-by-wugweb' );
	}
	return $r;
};

$serve( array( 'version' => '2.3.0', 'package' => $pkg, 'sha256' => strtoupper( $sha ) ) );
$r = $ask();
t( is_array( $r ) && $pkg === $r['package'], '2: a package with an https address and a SHA-256 is offered' );
t( $sha === kits_update_release()['sha256'], '2: the checksum is kept lower-cased' );

$serve( array( 'version' => '2.3.0', 'package' => $pkg ) );
$r = $ask();
t( is_array( $r ) && '' === $r['package'], '2: no checksum, no package (the version still shows)' );

$serve( array( 'version' => '2.3.0', 'package' => 'http://downloads.example.test/a.zip', 'sha256' => $sha ) );
$r = $ask();
t( is_array( $r ) && '' === $r['package'], '2: a plain http package is not offered' );

$serve( array( 'version' => '2.3.0', 'package' => $pkg, 'sha256' => 'not-a-hash' ) );
$r = $ask();
t( is_array( $r ) && '' === $r['package'], '2: a malformed checksum is not accepted' );

// The download check.
$serve( array( 'version' => '2.3.0', 'package' => $pkg, 'sha256' => $sha ) );
$GLOBALS['t_package_bytes'] = $bytes;
$GLOBALS['t_downloaded']    = array();
$res                        = apply_filters( 'upgrader_pre_download', false, $pkg, null );
t( is_string( $res ) && is_file( $res ), '2: a download that matches the SHA-256 is handed to WordPress' );
if ( is_string( $res ) ) {
	unlink( $res );
}
$GLOBALS['t_package_bytes'] = $bytes . 'tampered';
$res                        = apply_filters( 'upgrader_pre_download', false, $pkg, null );
t( $res instanceof WP_Error && 'kits_bad_checksum' === $res->get_error_code(), '2: a download that does not match is refused' );
$res = apply_filters( 'upgrader_pre_download', false, 'https://elsewhere.example.test/other-plugin.zip', null );
t( false === $res, '2: a package that is not the theme\'s passes through untouched' );
$res = apply_filters( 'upgrader_pre_download', 'already', $pkg, null );
t( 'already' === $res, '2: an answer another filter already gave is kept' );
// Stale cache from 1.4.0: package without a checksum key must not install unchecked.
$GLOBALS['t_transients']['kits_update_release'] = array( 'version' => '2.3.0', 'package' => $pkg, 'url' => '', 'requires' => '', 'requires_php' => '', 'tested' => '' );
$res = apply_filters( 'upgrader_pre_download', false, $pkg, null );
t( $res instanceof WP_Error && 'kits_no_checksum' === $res->get_error_code(), '2: an older cached release with no checksum is refused, not installed unchecked' );
// Off by default: the address is empty without the constant, nothing is asked. (The constant is set in this file, so check the helper.)
t( null === kits_update_package_sha256( 'https://other.example.test/x.zip' ), '2: kits_update_package_sha256 is null for a package that is not the theme\'s' );
// Registry helper itself.
t( kits_download_verified( $pkg, 'zz' ) instanceof WP_Error, '2: kits_download_verified refuses a malformed checksum before downloading' );

// ================= 3. ALTCHA: atomic, single use =================
t_reset();
$GLOBALS['wpdb'] = new T_Wpdb();
$solve           = function ( array $ch ) {
	for ( $n = 0; $n <= KITS_ALTCHA_MAX; $n++ ) {
		if ( hash( 'sha256', $ch['salt'] . $n ) === $ch['challenge'] ) {
			return base64_encode( json_encode( array( 'algorithm' => 'SHA-256', 'challenge' => $ch['challenge'], 'number' => $n, 'salt' => $ch['salt'], 'signature' => $ch['signature'] ) ) );
		}
	}
	return '';
};
$ch      = kits_altcha_challenge();
$payload = $solve( $ch );
t( '' !== $payload, '3: the test solved its challenge' );
t( true === kits_altcha_verify( $payload ), '3: a solved challenge is accepted once' );
t( false === kits_altcha_verify( $payload ), '3: the same answer sent again is refused' );
$GLOBALS['t_transients'] = array(); // the old check lived in a transient: wiping it must not reopen the door
t( false === kits_altcha_verify( $payload ), '3: the used mark is not a transient (a flushed cache does not allow a replay)' );
t( 1 === $GLOBALS['wpdb']->count_rows() || 2 === $GLOBALS['wpdb']->count_rows(), '3: the used mark is one row in the options table' );
// Two requests "at once": two claims of one challenge, only the first wins.
$ch2   = kits_altcha_challenge();
$first = kits_altcha_claim( $ch2['challenge'], time() + 600 );
$both  = kits_altcha_claim( $ch2['challenge'], time() + 600 );
t( true === $first && false === $both, '3: of two claims for one challenge exactly one wins' );
// A forged or expired answer never reaches the claim.
$bad       = json_decode( base64_decode( $payload ), true );
$bad['signature'] = str_repeat( '0', 64 );
t( false === kits_altcha_verify( base64_encode( json_encode( $bad ) ) ), '3: a wrong signature is refused' );
$old        = array( 'salt' => 'abcd?expires=' . ( time() - 5 ) );
$old['challenge'] = hash( 'sha256', $old['salt'] . 7 );
$old_payload = base64_encode( json_encode( array( 'algorithm' => 'SHA-256', 'challenge' => $old['challenge'], 'number' => 7, 'salt' => $old['salt'], 'signature' => hash_hmac( 'sha256', $old['challenge'], kits_altcha_key() ) ) ) );
t( false === kits_altcha_verify( $old_payload ), '3: an expired challenge is refused' );
t( false === kits_altcha_verify( 'garbage' ), '3: garbage is refused' );
// Pruning: expired used-marks go (at most once an hour).
$GLOBALS['wpdb']->query( "INSERT INTO wp_options (option_name, option_value, autoload) VALUES ('kits_altcha_used_stale', '" . ( time() - 100 ) . "', 'no')" );
$before = $GLOBALS['wpdb']->count_rows();
$GLOBALS['t_transients'] = array();
kits_altcha_claim( hash( 'sha256', 'fresh' ), time() + 600 );
t( $GLOBALS['wpdb']->count_rows() === $before, '3: an expired used-mark is pruned when a new one is added (net change zero)' );

// ================= 4. preview device link =================
t_reset();
$token = bin2hex( random_bytes( 24 ) );
$url   = kits_preview_link_url( $token );
t( false !== strpos( $url, '#t=' . $token ), '4: the link carries the token after #' );
t( false === strpos( (string) wp_parse_url( $url, PHP_URL_QUERY ), $token ) && false === strpos( $url, '?t=' ) && false === strpos( $url, '&t=' ), '4: the token is not in the query string' );
t( false !== strpos( (string) wp_parse_url( $url, PHP_URL_QUERY ), 'action=kits_preview_device' ), '4: the link still names its admin-post action' );
$put = function ( $until, $label = 'Phone' ) use ( $token ) {
	update_option( 'kits_preview_links', array( kits_preview_hash( $token ) => array( 'until' => $until, 'label' => $label ) ) );
};
$put( time() + 3600 );
t( 'Phone' === kits_preview_link_take( $token ), '4: a valid token is taken and gives its device name' );
t( null === kits_preview_link_take( $token ), '4: the token works once' );
$put( time() - 1 );
t( null === kits_preview_link_take( $token ), '4: an expired token is refused' );
$put( time() + 3600 );
t( null === kits_preview_link_take( 'short' ) && null === kits_preview_link_take( strtoupper( $token ) ), '4: a malformed token is refused' );
t( null !== kits_preview_link_take( $token ), '4: (control) the same link still works after the refused tries' );

// The handler: GET shows the page and never reads the query string; POST registers.
$put( time() + 3600 );
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET                      = array( 't' => $token );
$_REQUEST                  = array( 't' => $token );
try {
	kits_preview_device_link();
	t( false, '4: GET shows a page' );
} catch ( T_Die $e ) {
	t( 200 === $e->status && false !== strpos( $e->payload, 'location.hash' ) && false === strpos( $e->payload, $token ), '4: GET shows a button page that reads the # and does not contain the token' );
}
t( isset( get_option( 'kits_preview_links' )[ kits_preview_hash( $token ) ] ), '4: a GET (even with ?t=) does not use up the link' );
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST                     = array();
$_GET                      = array( 't' => $token );
try {
	kits_preview_device_link();
	t( false, '4: a POST without the token in its body is refused' );
} catch ( T_Die $e ) {
	t( 410 === $e->status, '4: a token only in the query string is not accepted (410)' );
}
$_POST = array( 't' => $token );
$_GET  = array();
try {
	kits_preview_device_link();
	t( false, '4: a POST with the token registers' );
} catch ( T_Redirect $e ) {
	t( 1 === count( (array) get_option( 'kits_preview_devices', array() ) ) && array() === (array) get_option( 'kits_preview_links' ), '4: the POST registered one device and used up the link' );
}
try {
	kits_preview_device_link();
} catch ( T_Die $e ) {
	t( 410 === $e->status, '4: the used link is refused the second time' );
}
unset( $_SERVER['REQUEST_METHOD'] );
$_POST = $_GET = $_REQUEST = array();

// ================= 5. settings download =================
t_reset();
$GLOBALS['t_user'] = 7;
$dl                = kits_settings_transfer_url();
parse_str( (string) wp_parse_url( $dl, PHP_URL_QUERY ), $q );
t( 'kits_settings_download' === ( $q['action'] ?? '' ) && preg_match( '/^[0-9a-f]{32}$/', $q['kits_dl'] ?? '' ), '5: the link names the download action and carries a 32-hex token' );
t( ! isset( $q['_wpnonce'] ) && false === strpos( $dl, 'wp_rest' ) && false === strpos( $dl, '/wp-json/' ), '5: the reusable REST nonce is gone from the link' );
t( true === kits_settings_transfer_claim( $q['kits_dl'], 7 ), '5: the token works once for the user it was made for' );
t( false === kits_settings_transfer_claim( $q['kits_dl'], 7 ), '5: the token cannot be used twice' );
parse_str( (string) wp_parse_url( kits_settings_transfer_url(), PHP_URL_QUERY ), $q2 );
t( $q2['kits_dl'] !== $q['kits_dl'], '5: every link gets a new token' );
t( false === kits_settings_transfer_claim( $q2['kits_dl'], 8 ), '5: another user cannot use it' );
t( false === kits_settings_transfer_claim( $q2['kits_dl'], 7 ), '5: and a wrong try spends the token' );
t( false === kits_settings_transfer_claim( 'x', 7 ) && false === kits_settings_transfer_claim( '', 7 ) && false === kits_settings_transfer_claim( str_repeat( 'g', 32 ), 7 ), '5: malformed tokens are refused' );
parse_str( (string) wp_parse_url( kits_settings_transfer_url(), PHP_URL_QUERY ), $q3 );
t( false === kits_settings_transfer_claim( $q3['kits_dl'], 0 ), '5: a signed-out visitor (user 0) is refused' );
// The handler refuses without capability or a token, and exports nothing.
$handlers = t_hook_callbacks( 'admin_post_kits_settings_download' );
t( 1 === count( $handlers ), '5: the download is registered on admin-post' );
$_GET = array( 'kits_dl' => 'f' );
try {
	$handlers[0]();
	t( false, '5: no capability, no file' );
} catch ( T_Die $e ) {
	t( 403 === $e->status, '5: a user without manage_options gets 403' );
}
$GLOBALS['t_caps']['manage_options'] = true;
try {
	$handlers[0]();
	t( false, '5: a bad token, no file' );
} catch ( T_Die $e ) {
	t( 403 === $e->status, '5: an administrator with a bad token gets 403' );
}
$_GET = array();
ob_end_clean();
t_done();
