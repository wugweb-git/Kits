<?php
/**
 * Run now: sourceweb_dispatch_token(), sourceweb_dispatch_repo(), sourceweb_dispatch_ready() and
 * sourceweb_dispatch_workflow(), taken from workers.php and run on their own with a stand-in for WordPress's HTTP call.
 *
 * Usage: php plugins/sourceweb/tests/dispatch-test.php
 *
 * @package sourceweb
 */

// phpcs:disable -- a command-line test runner with WordPress stubs.
define( 'ABSPATH', __DIR__ . '/' );
$GLOBALS['flt']  = array();
$GLOBALS['http'] = array( 'code' => 204 );
function apply_filters( $t, $v ) { return array_key_exists( $t, $GLOBALS['flt'] ) ? $GLOBALS['flt'][ $t ] : $v; }
function __( $s ) { return $s; }
function sanitize_file_name( $s ) { return preg_replace( '/[^A-Za-z0-9._-]/', '', (string) $s ); }
function home_url() { return 'https://example.com/'; }
function wp_parse_url( $u, $c = -1 ) { return parse_url( $u, $c ); }
function wp_json_encode( $v ) { return json_encode( $v ); }
function is_wp_error( $x ) { return $x instanceof WP_Error; }
class WP_Error { public $code; public $msg; function __construct( $c = '', $m = '' ) { $this->code = $c; $this->msg = $m; } function get_error_message() { return $this->msg; } }
function wp_remote_post( $url, $args ) { $GLOBALS['http']['last'] = array( $url, $args ); return $GLOBALS['http']['code'] instanceof WP_Error ? $GLOBALS['http']['code'] : array( 'code' => $GLOBALS['http']['code'] ); }
function wp_remote_retrieve_response_code( $r ) { return $r['code']; }

$src = file_get_contents( __DIR__ . '/../includes/workers/workers.php' );
foreach ( array( 'sourceweb_dispatch_token', 'sourceweb_dispatch_repo', 'sourceweb_dispatch_ready', 'sourceweb_dispatch_workflow' ) as $fn ) {
	if ( ! preg_match( '/^function ' . $fn . '\(.*?^\}/ms', $src, $m ) ) {
		fwrite( STDERR, "FAIL: $fn not found\n" );
		exit( 1 );
	}
	eval( $m[0] );
}
$fail = 0;
$ok   = function ( $name, $cond ) use ( &$fail ) {
	if ( ! $cond ) {
		$fail++;
		echo "FAIL: $name\n";
	}
};
$ok( '' === sourceweb_dispatch_token() && '' === sourceweb_dispatch_repo() && ! sourceweb_dispatch_ready(), 'nothing set: not ready' );
$e = sourceweb_dispatch_workflow( 'sourcing.yml' );
$ok( $e instanceof WP_Error && 'sourceweb_dispatch_token' === $e->code && ! isset( $GLOBALS['http']['last'] ), 'no token: refused, no request made' );
define( 'SOURCEWEB_GITHUB_TOKEN', 'ghp_test' );
$e = sourceweb_dispatch_workflow( 'sourcing.yml' );
$ok( $e instanceof WP_Error && 'sourceweb_dispatch_repo' === $e->code, 'token but no repository: refused' );
$GLOBALS['flt']['sourceweb_workers_repo'] = 'not a repo';
$ok( '' === sourceweb_dispatch_repo(), 'a value that is not owner/name is not a repository' );
$GLOBALS['flt']['sourceweb_workers_repo'] = 'wugweb-git/sourceweb-workers';
$ok( 'wugweb-git/sourceweb-workers' === sourceweb_dispatch_repo() && sourceweb_dispatch_ready(), 'a repository by filter makes it ready' );
$ok( true === sourceweb_dispatch_workflow( 'sourcing.yml', array( 'dry_run' => false ) ), '204 is started' );
list( $url, $args ) = $GLOBALS['http']['last'];
$ok( 'https://api.github.com/repos/wugweb-git/sourceweb-workers/actions/workflows/sourcing.yml/dispatches' === $url, 'the request goes to the workflow dispatches address' );
$ok( 'Bearer ghp_test' === $args['headers']['Authorization'] && 0 === $args['redirection'], 'bearer token, and a redirect is not followed' );
$b = json_decode( $args['body'], true );
$ok( 'main' === $b['ref'] && array( 'dry_run' => '' ) === $b['inputs'], 'ref main; inputs sent as strings' );
$e = sourceweb_dispatch_workflow( '../../x' );
$ok( $e instanceof WP_Error && 'sourceweb_dispatch_file' === $e->code, 'a path is not a workflow file name' );
foreach ( array( 301 => 'sourceweb_dispatch_moved', 401 => 'sourceweb_dispatch_denied', 403 => 'sourceweb_dispatch_denied', 404 => 'sourceweb_dispatch_missing', 500 => 'sourceweb_dispatch_failed' ) as $code => $want ) {
	$GLOBALS['http']['code'] = $code;
	$e = sourceweb_dispatch_workflow( 'sourcing.yml' );
	$ok( $e instanceof WP_Error && $want === $e->code, "HTTP $code is reported as $want" );
}
$GLOBALS['http']['code'] = new WP_Error( 'http_request_failed', 'cURL error 28' );
$e = sourceweb_dispatch_workflow( 'sourcing.yml' );
$ok( $e instanceof WP_Error && 'cURL error 28' === $e->get_error_message(), 'a network error is passed on' );
echo $fail ? "$fail failed\n" : "dispatch tests: all passed\n";
exit( $fail ? 1 : 0 );
