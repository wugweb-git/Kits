<?php
/**
 * Favicon host allow-list: insightweb_favicon_host_ok() and insightweb_favicon_sources(), taken from the source file and run on
 * their own (no WordPress).
 *
 * Usage: php plugins/insightweb/tests/favicon-hosts-test.php
 *
 * @package insightweb
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput -- a command-line test runner.

$GLOBALS['flt'] = array();
function apply_filters( $tag, $value ) {
	return array_key_exists( $tag, $GLOBALS['flt'] ) ? $GLOBALS['flt'][ $tag ] : $value;
}

$src = file_get_contents( __DIR__ . '/../includes/search-insights/referrer-icons.php' );
foreach ( array( 'insightweb_favicon_host_ok', 'insightweb_favicon_sources' ) as $fn ) {
	if ( ! preg_match( '/^function ' . $fn . '\(.*?^\}/ms', $src, $m ) ) {
		fwrite( STDERR, "FAIL: $fn not found\n" );
		exit( 1 );
	}
	eval( $m[0] ); // phpcs:ignore Squiz.PHP.Eval -- the function under test.
}

$fail = 0;
$ok   = function ( $name, $cond ) use ( &$fail ) {
	if ( ! $cond ) {
		$fail++;
		echo "FAIL: $name\n";
	}
};
$h = 'insightweb_favicon_host_ok';
foreach ( array( 'example.com', 'news.bbc.co.uk', 'a-b.example.org', 'xn--e1afmkfd.xn--p1ai' ) as $good ) {
	$ok( "accepts $good", $h( $good ) );
}
foreach ( array( '', 'localhost', '127.0.0.1', '10.0.0.5', '[::1]', 'intranet', 'printer.local', 'db.internal', 'a.b.localhost', 'exa mple.com', 'example.com/x', 'example.com:8080', '-bad.example.com', 'user@example.com', str_repeat( 'a', 260 ) . '.com' ) as $bad ) {
	$ok( 'refuses ' . substr( $bad, 0, 20 ), ! $h( $bad ) );
}
$GLOBALS['flt']['insightweb_favicon_hosts'] = array( 'example.com', 'news.org' );
$ok( 'allow-list lets the host in', $h( 'example.com' ) );
$ok( 'allow-list lets a subdomain in', $h( 'www.example.com' ) );
$ok( 'allow-list keeps others out', ! $h( 'other.com' ) );
$ok( 'allow-list is not a suffix match', ! $h( 'badexample.com' ) );
unset( $GLOBALS['flt']['insightweb_favicon_hosts'] );
$s = insightweb_favicon_sources( 'example.com' );
$ok( 'google first then the site', 2 === count( $s ) && false !== strpos( $s[0], 'google.com/s2/favicons' ) && 'https://example.com/favicon.ico' === $s[1] );
$GLOBALS['flt']['insightweb_favicon_third_party'] = false;
$s = insightweb_favicon_sources( 'example.com' );
$ok( 'third party off leaves only the site', array( 'https://example.com/favicon.ico' ) === $s );
echo $fail ? "$fail failed\n" : "favicon host tests: all passed\n";
exit( $fail ? 1 : 0 );
