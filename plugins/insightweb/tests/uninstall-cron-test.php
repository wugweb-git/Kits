<?php
/**
 * Uninstall takes off every scheduled event InsightWeb books, with the "Delete data" switch off as well as on.
 *
 * 1. Every hook constant under includes/ that is passed to wp_schedule_event() / wp_schedule_single_event() is in
 *    uninstall.php's list (aw_fetch_favicons, shared with SourceWeb, is the one exception).
 * 2. Running uninstall.php with the switch off unschedules each of those hooks.
 *
 * Usage: php plugins/insightweb/tests/uninstall-cron-test.php
 *
 * @package insightweb
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

// 1. The hooks the code schedules.
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
	if ( preg_match_all( "/wp_schedule_(?:single_)?event\(.*?,\s*(?:'[a-z]+',\s*)?([A-Z0-9_]+|'[a-z0-9_]+')\s*[,)]/", $code, $m ) ) {
		foreach ( $m[1] as $arg ) {
			$scheduled[] = $arg;
		}
	}
}
$hooks = array();
foreach ( $scheduled as $arg ) {
	$hooks[] = "'" === $arg[0] ? trim( $arg, "'" ) : ( $consts[ $arg ] ?? 'UNRESOLVED:' . $arg );
}
$hooks = array_values( array_unique( array_diff( $hooks, array( 'aw_fetch_favicons' ) ) ) );
$check( count( $hooks ) >= 15, count( $hooks ) . ' scheduled hooks found in includes/' );
$check( ! preg_grep( '/^UNRESOLVED/', $hooks ), 'every scheduled hook resolves to a name' );

// 2. Run uninstall.php with the switch off.
define( 'ABSPATH', $root . '/' );
define( 'WP_UNINSTALL_PLUGIN', 'insightweb/insightweb.php' );
$GLOBALS['iw_unscheduled'] = array();
function get_option( $name, $fallback = false ) { // phpcs:ignore
	return $fallback;
}
function delete_option( $name ) { // phpcs:ignore
	return true;
}
function wp_unschedule_hook( $hook ) { // phpcs:ignore
	$GLOBALS['iw_unscheduled'][] = $hook;
	return 1;
}
function wp_upload_dir( $time = null, $create = true ) { // phpcs:ignore
	return array( 'basedir' => sys_get_temp_dir() . '/insightweb-uninstall-test' );
}
function trailingslashit( $s ) { // phpcs:ignore
	return rtrim( $s, '/' ) . '/';
}
function wp_delete_file( $f ) { // phpcs:ignore
	return true;
}
$wpdb         = new class() {
	public $prefix = 'wp_';
	public function prepare( $q, ...$a ) { // phpcs:ignore
		return $q;
	}
	public function query( $q ) { // phpcs:ignore
		return 0;
	}
};
$GLOBALS['wpdb'] = $wpdb;
include $root . '/uninstall.php';

$missing = array_diff( $hooks, $GLOBALS['iw_unscheduled'] );
$check( ! $missing, 'uninstall with Delete data off unschedules every hook' . ( $missing ? ' (missing: ' . implode( ', ', $missing ) . ')' : '' ) );
$check( ! in_array( 'aw_fetch_favicons', $GLOBALS['iw_unscheduled'], true ), 'the shared favicon event is left booked' );

echo $failed ? "\n$failed failed\n" : "\nAll passed\n";
exit( $failed ? 1 : 0 );
