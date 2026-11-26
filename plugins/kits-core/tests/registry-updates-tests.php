<?php
/**
 * Registry updater tests that need no WordPress: what is offered, on which channel, and from which address.
 *
 * Usage: php plugins/kits-core/tests/registry-updates-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO -- a command-line test runner with stand-ins.

if ( 'cli' !== PHP_SAPI ) {
	exit;
}
define( 'ABSPATH', __DIR__ . '/' );

$GLOBALS['t_cache']   = array();
$GLOBALS['t_filters'] = array();
$GLOBALS['t_opts']    = array();

function apply_filters( $tag, $value ) { // phpcs:ignore
	return $value;
}
function add_filter( $tag, $cb, $p = 10, $n = 1 ) { // phpcs:ignore
	$GLOBALS['t_filters'][ $tag ][] = $cb;
}
function add_action( $tag, $cb ) { // phpcs:ignore
}
function get_option( $k, $d = false ) { // phpcs:ignore
	return $GLOBALS['t_opts'][ $k ] ?? $d;
}
function get_site_transient( $k ) { // phpcs:ignore
	return $GLOBALS['t_cache'][ $k ] ?? false;
}
function set_site_transient( $k, $v ) { // phpcs:ignore
	$GLOBALS['t_cache'][ $k ] = $v;
}
function esc_url_raw( $u ) { // phpcs:ignore
	return $u;
}
function __( $s ) { // phpcs:ignore
	return $s;
}
define( 'HOUR_IN_SECONDS', 3600 );

require dirname( __DIR__ ) . '/includes/registry-updates.php';

$fails = 0;
$count = 0;
function t( $ok, $name ) { // phpcs:ignore
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL: $name\n";
	}
}

$dl = 'https://github.com/wugweb-git/Kits/releases/download/rankweb-v2.3.0/rankweb.zip';
$GLOBALS['t_cache']['kits_registry'] = array(
	'rankweb'      => array( 'released' => true, 'version' => '2.3.0', 'prerelease' => true, 'download' => array( 'commercial' => $dl ), 'sha256' => array( 'commercial' => str_repeat( 'a', 64 ) ), 'page' => 'https://x/', 'requires_wp' => '7.1', 'requires_php' => '8.0', 'tested' => '7.1' ),
	'mailweb'      => array( 'released' => true, 'version' => '3.3.0', 'prerelease' => false, 'download' => array( 'commercial' => 'https://evil.example/mailweb.zip' ), 'sha256' => array( 'commercial' => '' ) ),
	'planweb'      => array( 'released' => true, 'version' => '0.2.0', 'prerelease' => false, 'download' => array( 'commercial' => 'https://github.com/wugweb-git/Kits/releases/download/planweb-v0.2.0/planweb.zip' ), 'sha256' => array( 'commercial' => str_repeat( 'b', 64 ) ) ),
	'insightweb'   => array( 'released' => false ),
);

t( null === kits_registry_offer( 'rankweb', '2.2.0' ), 'a pre-release is not offered on the stable channel' );
$GLOBALS['t_opts']['kits_update_channel'] = 'pre';
$o = kits_registry_offer( 'rankweb', '2.2.0' );
t( is_array( $o ) && '2.3.0' === $o['version'] && $dl === $o['package'], 'a pre-release is offered on the pre-release channel' );
t( null === kits_registry_offer( 'rankweb', '2.3.0' ), 'the same version is not offered' );
t( null === kits_registry_offer( 'rankweb', '2.4.0' ), 'an older release is not offered' );
t( null === kits_registry_offer( 'mailweb', '3.2.0' ), 'a package outside the project\'s releases is refused' );
t( is_array( kits_registry_offer( 'planweb', '0.1.0' ) ), 'a stable release is offered' );
t( null === kits_registry_offer( 'insightweb', '1.0.0' ), 'an unreleased product is not offered' );
t( null === kits_registry_offer( 'sourceweb', '0.1.0' ), 'a product the registry lacks is not offered' );
t( kits_registry_trusted_package( $dl ) && ! kits_registry_trusted_package( 'http://github.com/wugweb-git/Kits/releases/download/a.zip' ), 'only https release files are trusted' );

echo "$count checks, $fails failed\n";
exit( $fails ? 1 : 0 );
