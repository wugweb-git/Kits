<?php
/**
 * Uninstall takes off every scheduled event PlanWeb books, with the "Delete data" switch off as well as on.
 *
 * 1. Every hook the code schedules (the Dashboard's counts job and each hook of PLANWEB_JOBS) is found under includes/.
 * 2. Running uninstall.php with the switch off unschedules each of those hooks and deletes nothing else.
 *
 * Usage: php plugins/planweb/tests/uninstall-cron-test.php
 *
 * @package planweb
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.PHP.DiscouragedPHPFunctions, Universal.Files.SeparateFunctionsFromOO -- a command-line test with WordPress stubs.
if ( 'cli' !== PHP_SAPI ) {
	exit;
}

$planweb_root   = dirname( __DIR__ );
$planweb_failed = 0;
$planweb_check  = function ( bool $ok, string $what ) use ( &$planweb_failed ): void {
	echo ( $ok ? 'ok   ' : 'FAIL ' ) . $what . "\n";
	if ( ! $ok ) {
		++$planweb_failed;
	}
};

// 1. The hooks the code schedules.
$planweb_hooks = array();
$planweb_dash  = (string) file_get_contents( $planweb_root . '/includes/planweb-dashboard.php' );
if ( preg_match( "/const\s+PLANWEB_COUNTS_JOB\s*=\s*'([a-z0-9_]+)'/", $planweb_dash, $planweb_m ) ) {
	$planweb_hooks[] = $planweb_m[1];
}
$planweb_jobs = (string) file_get_contents( $planweb_root . '/includes/jobs-model.php' );
if ( preg_match_all( "/'hook'\s*=>\s*'([a-z0-9_]+)'/", $planweb_jobs, $planweb_m ) ) {
	$planweb_hooks = array_merge( $planweb_hooks, $planweb_m[1] );
}
$planweb_hooks = array_values( array_unique( $planweb_hooks ) );
$planweb_check( count( $planweb_hooks ) >= 5, count( $planweb_hooks ) . ' scheduled hooks found in includes/' );
// Nothing else in includes/ may book an event with a hook this test did not find.
$planweb_other = array();
foreach ( glob( $planweb_root . '/includes/*.php' ) as $planweb_file ) {
	$planweb_code = (string) file_get_contents( $planweb_file );
	if ( preg_match_all( "/wp_schedule_(?:single_)?event\([^;]*?,\s*(PLANWEB_COUNTS_JOB|\\\$job\['hook'\]|'[a-z0-9_]+')\s*(?:,\s*array\([^)]*\)\s*)?\)\s*;/", $planweb_code, $planweb_m ) ) {
		foreach ( $planweb_m[1] as $planweb_arg ) {
			if ( 'PLANWEB_COUNTS_JOB' !== $planweb_arg && "\$job['hook']" !== $planweb_arg ) {
				$planweb_other[] = trim( $planweb_arg, "'" );
			}
		}
	}
}
$planweb_check( ! array_diff( $planweb_other, $planweb_hooks ), 'no event is booked with a hook outside the list' );

// 2. Run uninstall.php.
define( 'ABSPATH', $planweb_root . '/' );
define( 'WP_UNINSTALL_PLUGIN', 'planweb/planweb.php' );
$GLOBALS['planweb_test_unscheduled'] = array();
$GLOBALS['planweb_test_deleted']     = array();
$GLOBALS['planweb_test_switch']      = false;
function get_option( $name, $fallback = false ) { // phpcs:ignore
	return 'planweb_delete_data_on_uninstall' === $name ? $GLOBALS['planweb_test_switch'] : $fallback;
}
function delete_option( $name ) { // phpcs:ignore
	$GLOBALS['planweb_test_deleted'][] = $name;
	return true;
}
function delete_transient( $name ) { // phpcs:ignore
	return true;
}
function wp_unschedule_hook( $hook ) { // phpcs:ignore
	$GLOBALS['planweb_test_unscheduled'][] = $hook;
	return 1;
}
function planweb_uninstall_backup() { // phpcs:ignore
	return true;
}
$GLOBALS['wpdb'] = new class() {
	public $prefix  = 'wp_';
	public $options = 'wp_options';
	public function prepare( $q, ...$a ) { // phpcs:ignore
		return $q;
	}
	public function esc_like( $s ) { // phpcs:ignore
		return $s;
	}
	public function query( $q ) { // phpcs:ignore
		return 0;
	}
};
// The backup helper is loaded by uninstall.php with require_once; a stand-in file keeps this test from writing a backup.
include $planweb_root . '/uninstall.php';
$planweb_missing = array_diff( $planweb_hooks, $GLOBALS['planweb_test_unscheduled'] );
$planweb_check( ! $planweb_missing, 'uninstall with Delete data off unschedules every hook' . ( $planweb_missing ? ' (missing: ' . implode( ', ', $planweb_missing ) . ')' : '' ) );
$planweb_check( ! $GLOBALS['planweb_test_deleted'], 'uninstall with Delete data off deletes no option' );

if ( $planweb_failed ) {
	echo "\n$planweb_failed failed\n";
	exit( 1 );
}
echo "\nAll passed\n";
