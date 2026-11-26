<?php
/**
 * Site check-in tests that need no WordPress: what is allowed to be sent, to where, and what the message holds.
 *
 * Usage: php plugins/kits-core/tests/site-checkin-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO

if ( 'cli' !== PHP_SAPI ) {
	exit;
}
define( 'ABSPATH', __DIR__ . '/' );
define( 'DAY_IN_SECONDS', 86400 );
define( 'WEEK_IN_SECONDS', 604800 );

$GLOBALS['t_off'] = false;

function apply_filters( $tag, $value ) { // phpcs:ignore
	return ( 'kits_checkin' === $tag && $GLOBALS['t_off'] ) ? false : $value;
}
function add_filter( $tag, $cb, $p = 10, $n = 1 ) { // phpcs:ignore
}
function add_action( $tag, $cb ) { // phpcs:ignore
}
function esc_url_raw( $u, $protocols = null ) { // phpcs:ignore
	$u = trim( (string) $u );
	$s = (string) parse_url( $u, PHP_URL_SCHEME );
	if ( '' === $s || ( null !== $protocols && ! in_array( $s, $protocols, true ) ) || ! in_array( $s, array( 'http', 'https' ), true ) ) {
		return '';
	}
	return $u;
}
function wp_parse_url( $u ) { // phpcs:ignore
	return parse_url( $u );
}
function wp_json_encode( $v, $f = 0 ) { // phpcs:ignore
	return json_encode( $v, $f );
}

require dirname( __DIR__ ) . '/includes/site-checkin.php';

$count = 0;
$fails = 0;
function t( $ok, $label ) { // phpcs:ignore
	global $count, $fails;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL: $label\n";
	}
}

// The address.
t( 'https://example.org/in' === kits_checkin_clean_url( ' https://example.org/in ' ), 'an https address is kept and trimmed' );
t( '' === kits_checkin_clean_url( 'http://example.org/in' ), 'plain http is refused' );
t( '' === kits_checkin_clean_url( 'ftp://example.org' ), 'another scheme is refused' );
t( '' === kits_checkin_clean_url( 'https://user:pw@example.org/' ), 'an address with a login in it is refused' );
t( '' === kits_checkin_clean_url( 'javascript:alert(1)' ), 'a script address is refused' );
t( '' === kits_checkin_clean_url( '' ), 'empty stays empty' );

// The switch.
t( 1 === kits_checkin_clean_flag( '1' ) && 1 === kits_checkin_clean_flag( 'on' ) && 0 === kits_checkin_clean_flag( '0' ) && 0 === kits_checkin_clean_flag( 'yes please' ) && 0 === kits_checkin_clean_flag( null ), 'only a real tick counts' );

// May it send: both the switch and the address, and no filter saying no.
t( true === kits_checkin_may_send( 1, 'https://example.org/in' ), 'on and an address: may send' );
t( false === kits_checkin_may_send( 0, 'https://example.org/in' ), 'off: never sends' );
t( false === kits_checkin_may_send( 1, '' ), 'on with no address: never sends' );
t( false === kits_checkin_may_send( 1, 'http://example.org/in' ), 'on with a plain-http address: never sends' );
$GLOBALS['t_off'] = true;
t( false === kits_checkin_may_send( 1, 'https://example.org/in' ), 'the kits_checkin filter can stop it' );
$GLOBALS['t_off'] = false;

// The message: only Wugweb plugins, clean versions, nothing else.
$p = kits_checkin_payload(
	array(
		'site'    => 'https://example.org/',
		'wp'      => '7.1',
		'php'     => '8.2.1',
		'channel' => 'whatever',
		'theme'   => '2.2.0 <script>',
		'plugins' => array(
			'rankweb'      => '2.3.0',
			'kits-core'    => '1.3.0',
			'some-other'   => '9.9.9',
			'akismet'      => '5.0',
			'planweb'      => '',
			'mailweb'      => "3.3.1\n<b>",
		),
		'email'   => 'owner@example.org',
		'users'   => array( 'a', 'b' ),
	)
);
t( array( 'kits-core', 'mailweb', 'rankweb' ) === array_keys( $p['plugins'] ), 'only known Wugweb plugins with a version are named, sorted' );
t( '3.3.1b' === $p['plugins']['mailweb'], 'a version is cleaned of anything but version characters' );
t( 'stable' === $p['channel'], 'an unknown channel becomes stable' );
t( '2.2.0script' === $p['theme'], 'the theme version is cleaned' );
t( ! isset( $p['email'] ) && ! isset( $p['users'] ), 'no email address and no users in the message' );
t( array( 'schema', 'site', 'wp', 'php', 'channel', 'theme', 'plugins' ) === array_keys( $p ), 'the message has exactly these fields' );
t( 'pre' === kits_checkin_payload( array( 'channel' => 'pre' ) )['channel'], 'the pre-release channel is reported as it is' );
t( array() === kits_checkin_payload( array() )['plugins'], 'no facts: no plugins, no error' );

echo "$count checks, $fails failed\n";
exit( $fails ? 1 : 0 );
