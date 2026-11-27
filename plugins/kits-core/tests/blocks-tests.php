<?php
/**
 * Kits block logic that needs no WordPress: days left, metric threshold and format, text lines, sponsored cleaning.
 *
 * Usage: php plugins/kits-core/tests/blocks-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals -- a command-line test runner.

if ( 'cli' !== PHP_SAPI ) {
	exit;
}
define( 'ABSPATH', __DIR__ . '/' );
if ( ! function_exists( 'wp_strip_all_tags' ) ) {
	function wp_strip_all_tags( $t ) { return trim( strip_tags( (string) $t ) ); }
}
require dirname( __DIR__ ) . '/includes/blocks-model.php';

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

t( 5 === kits_countdown_days( '2026-12-05', '2026-11-30' ), 'five days across a month end' );
t( 0 === kits_countdown_days( '2026-12-05', '2026-12-05' ), 'zero on the day' );
t( -1 === kits_countdown_days( '2026-12-04', '2026-12-05' ), 'negative after' );
t( 1 === kits_countdown_days( '2028-03-01', '2028-02-29' ), 'leap day' );
t( null === kits_countdown_days( '2026-02-30', '2026-12-05' ), 'an impossible date is not a date' );
t( null === kits_countdown_days( 'tomorrow', '2026-12-05' ), 'words are not a date' );
t( kits_metric_show( 120, 100 ) && kits_metric_show( 100, 100 ) && kits_metric_show( '7', 0 ), 'a metric shows from its threshold' );
t( ! kits_metric_show( 99, 100 ) && ! kits_metric_show( null, 0 ) && ! kits_metric_show( 'many', 0 ), 'a metric under its threshold or without a number shows nothing' );
t( '12,345' === kits_metric_format( 12345 ) && '4.5' === kits_metric_format( 4.5 ) && '3' === kits_metric_format( '3.0' ), 'numbers are grouped, zeros trimmed' );
t( array( 'a', 'b' ) === kits_block_lines( "a\r\n\n  b  \n" ), 'lines are trimmed, empties dropped' );
t( 2 === count( kits_block_lines( "1\n2\n3", 2 ) ), 'lines are capped' );
$c = kits_sponsored_clean( array( array( 'name' => '<b>Acme</b>', 'url' => 'https://acme.test', 'text' => 'Food' ), array( 'name' => 'Bad', 'url' => 'http://no-tls.test' ), array( 'name' => '', 'url' => 'https://x.test' ), 'junk' ) );
t( 1 === count( $c ) && 'Acme' === $c[0]['name'], 'sponsored rows need a name and an https address; tags go' );

echo "$count checks, $fails failed\n";
exit( $fails ? 1 : 0 );
