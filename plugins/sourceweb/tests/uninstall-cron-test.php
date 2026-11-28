<?php
/**
 * Uninstall takes off every scheduled event SourceWeb books, with the "Delete this plugin's data" switch off as well as on.
 *
 * 1. Every hook passed to wp_schedule_event() / wp_schedule_single_event() under includes/ (a literal or a constant) is in
 *    uninstall.php's list. Left booked on purpose: aw_fetch_favicons (shared with InsightWeb) and aw_research_citation
 *    (its work is the site core plugin's).
 * 2. Running uninstall.php with the switch off unschedules each of them.
 *
 * Usage: php plugins/sourceweb/tests/uninstall-cron-test.php
 *
 * @package sourceweb
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.PHP.DiscouragedPHPFunctions, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO -- a command-line test with WordPress stubs.
if ( 'cli' !== PHP_SAPI ) {
	exit;
}

$root   = dirname( __DIR__ );
$failed = 0;
$check  = function ( bool $ok, string $what ) use ( &$failed ): void {
	echo ( $ok ? 'ok   ' : 'FAIL ' ) . $what . "\n";
	if ( ! $ok ) {
		++$failed;
	}
};

$left      = array( 'aw_fetch_favicons', 'aw_research_citation' );
$consts    = array();
$scheduled = array();
$it        = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root . '/includes', FilesystemIterator::SKIP_DOTS ) );
foreach ( $it as $file ) {
	if ( ! preg_match( '/\.php$/', (string) $file ) ) {
		continue;
	}
	$code = (string) file_get_contents( (string) $file );
	if ( preg_match_all( "/^\s*const\s+([A-Z0-9_]+)\s*=\s*'([a-z0-9_]+)'/m", $code, $m, PREG_SET_ORDER ) ) {
		foreach ( $m as $row ) {
			$consts[ $row[1] ] = $row[2];
		}
	}
	if ( preg_match_all( "/wp_schedule_(?:single_)?event\(\s*[^,]+,\s*(?:'[a-z0-9_]+',\s*)?([A-Z0-9_]+|'[a-z0-9_]+'|\\\$hook)\s*[,)]/", $code, $m ) ) {
		foreach ( $m[1] as $arg ) {
			$scheduled[] = $arg;
		}
	}
}
$hooks = array();
foreach ( $scheduled as $arg ) {
	if ( '$hook' === $arg ) {
		array_push( $hooks, 'aw_ai_check_all_now', 'aw_ai_check_new' ); // ai-keys.php picks one of the two.
	} else {
		$hooks[] = "'" === $arg[0] ? trim( $arg, "'" ) : ( $consts[ $arg ] ?? 'UNRESOLVED:' . $arg );
	}
}
$hooks = array_values( array_unique( array_diff( $hooks, $left ) ) );
$check( count( $hooks ) >= 9, count( $hooks ) . ' scheduled hooks found in includes/ (' . implode( ', ', $hooks ) . ')' );
$check( ! preg_grep( '/^UNRESOLVED/', $hooks ), 'every scheduled hook resolves to a name' );

define( 'ABSPATH', $root . '/' );
define( 'WP_UNINSTALL_PLUGIN', 'sourceweb/sourceweb.php' );
$GLOBALS['sw_unscheduled'] = array();
function get_option( $name, $fallback = false ) { // phpcs:ignore
	return $fallback; // "Delete data" is off.
}
function wp_unschedule_hook( $hook ) { // phpcs:ignore
	$GLOBALS['sw_unscheduled'][] = $hook;
	return 1;
}
include $root . '/uninstall.php';

$missing = array_diff( $hooks, $GLOBALS['sw_unscheduled'] );
$check( ! $missing, 'uninstall with Delete data off unschedules every hook' . ( $missing ? ' (missing: ' . implode( ', ', $missing ) . ')' : '' ) );
$check( ! array_intersect( $left, $GLOBALS['sw_unscheduled'] ), 'the shared favicon event and the core plugin\'s research event are left booked' );

echo $failed ? "\n$failed failed\n" : "\nAll passed\n";
exit( $failed ? 1 : 0 );
