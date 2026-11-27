<?php
// No ABSPATH guard: this is a command-line runner that defines ABSPATH itself.
/**
 * Tests that need no WordPress: the Animal Writes site layer's ops files (sites/animalwrites/kits-core/includes/ops/),
 * moved out of Kits Core 1.4.0 unchanged. Retention's closed opportunities, and the older aw_ names that still answer
 * (the ops functions, the backup and error page functions) over Kits Core's kits_ functions.
 *
 * Usage: php sites/animalwrites/kits-core/tests/site-ops-tests.php
 *
 * @package animalwrites-kits-core
 */

if ( 'cli' !== PHP_SAPI ) {
	exit;
}

// phpcs:disable -- a command-line test runner with WordPress stubs.

$tmp = sys_get_temp_dir() . '/kits-site-ops-tests-' . getmypid();
define( 'ABSPATH', $tmp . '/a/b/c/' );
define( 'KITS_CORE_DIR', dirname( __DIR__, 4 ) . '/plugins/kits-core/' );
define( 'HOUR_IN_SECONDS', 3600 );
define( 'MINUTE_IN_SECONDS', 60 );
define( 'DAY_IN_SECONDS', 86400 );

$GLOBALS['t_filters'] = array();
$GLOBALS['t_meta']    = array();
$GLOBALS['t_posts']   = array();
$GLOBALS['t_request'] = '';

$GLOBALS['t_actions'] = array();
$GLOBALS['t_options'] = array();
function do_action( $hook ) {
	$GLOBALS['t_actions'][] = $hook;
}
function get_option( $n, $d = false ) {
	return $GLOBALS['t_options'][ $n ] ?? $d;
}
function update_option( $n, $v ) {
	$GLOBALS['t_options'][ $n ] = $v;
	return true;
}
function add_action() {}
function add_filter() {}
function add_shortcode() {}
function register_rest_route() {}
function apply_filters( $hook, $value, ...$rest ) {
	return array_key_exists( $hook, $GLOBALS['t_filters'] ) ? $GLOBALS['t_filters'][ $hook ] : $value;
}
function get_post( $id ) {
	return $GLOBALS['t_posts'][ is_object( $id ) ? $id->ID : $id ] ?? null;
}
function get_post_meta( $id, $key, $single = false ) {
	return $GLOBALS['t_meta'][ $id ][ $key ] ?? '';
}
function wp_date( $f ) {
	return '2026-11-19';
}
function wp_parse_url( $u, $c = -1 ) {
	return parse_url( $u, $c );
}
function wp_unslash( $v ) {
	return $v;
}
function sanitize_text_field( $s ) {
	return trim( strip_tags( (string) $s ) );
}
function is_404() {
	return true;
}
function wp_doing_cron() {
	return false;
}
function untrailingslashit( $s ) {
	return rtrim( $s, '/\\' );
}

$fails = 0;
$n     = 0;
function check( $what, $ok ) {
	global $fails, $n;
	++$n;
	if ( ! $ok ) {
		++$fails;
	}
	echo ( $ok ? 'ok   ' : 'FAIL ' ) . $what . "\n";
}

$core = KITS_CORE_DIR . 'includes/';
$site = dirname( __DIR__ ) . '/includes/';
require $core . 'ops/cron-health.php';
require $core . 'ops/keep-modified.php';
require $core . 'backups.php';
require $core . 'error-pages.php';
require $site . 'ops/retention.php';
require $site . 'ops/compat.php';
require $site . 'compat-backups-error-pages.php';

/* ---------- Retention ---------- */

$GLOBALS['t_posts'] = array( 1 => (object) array( 'ID' => 1, 'post_type' => 'aw_opportunity' ), 2 => (object) array( 'ID' => 2, 'post_type' => 'aw_news' ) );
$GLOBALS['t_meta'][1]['aw_deadline'] = '2026-11-01';
check( 'an opportunity past its deadline is closed', 'closed' === kits_retention_state( 1 ) );
$GLOBALS['t_meta'][1]['aw_deadline'] = '2026-12-01';
check( 'an open opportunity is normal', '' === kits_retention_state( 1 ) );
$GLOBALS['t_meta'][1] = array( 'aw_review_until' => '2026-11-18' );
check( 'with no deadline the review date decides', 'closed' === kits_retention_state( 1 ) );
check( 'news is never closed', '' === kits_retention_state( 2 ) );

/* ---------- The old names still answer ---------- */

check( 'old names: aw_retention_state and aw_keep_modified forward', 'closed' === aw_retention_state( 1 ) && 'x' === aw_keep_modified( fn() => 'x' ) );
check( 'old names: aw_cron_span forwards', '5 min' === aw_cron_span( 300 ) );
check( 'old name: aw_dispatch_workflow exists for the server\'s cron line', function_exists( 'aw_dispatch_workflow' ) && function_exists( 'aw_cron_last' ) && function_exists( 'aw_core_simple_table' ) );

check( 'old names: backup and error page functions forward', function_exists( 'aw_backup_dir' ) && function_exists( 'aw_run_backup' ) && function_exists( 'aw_error_pages_sync' ) && function_exists( 'aw_error_page_sync_one' ) && function_exists( 'aw_backup_problem' ) );

echo "\n" . $n . ' checks, ' . $fails . " failed\n";
exit( $fails ? 1 : 0 );
