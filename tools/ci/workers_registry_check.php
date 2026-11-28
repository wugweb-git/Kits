<?php
/**
 * Fails when SourceWeb's workflow registry differs from the workers repository's docs/workers.json.
 *
 *   php tools/ci/workers_registry_check.php [path-or-url-to-workers.json]
 *
 * With no argument it reads the file from the workers repository's main branch. A network failure is
 * reported and skipped (exit 0), a difference is a failure (exit 1).
 */

define( 'ABSPATH', __DIR__ );
require dirname( __DIR__, 2 ) . '/plugins/sourceweb/includes/workers/workers-registry.php';

$src = $argv[1] ?? 'https://raw.githubusercontent.com/wugweb-git/sourceweb-workers/main/docs/workers.json';
$raw = @file_get_contents( $src );
if ( false === $raw ) {
	fwrite( STDOUT, "SKIP: could not read $src\n" );
	exit( 0 );
}
$theirs = json_decode( $raw, true );
if ( ! is_array( $theirs ) || ! isset( $theirs['workers'] ) ) {
	fwrite( STDERR, "FAIL: $src is not a workers.json\n" );
	exit( 1 );
}

$ours = SOURCEWEB_WORKERS;
$bad  = array();
foreach ( array_diff( array_keys( $theirs['workers'] ), array_keys( $ours ) ) as $k ) {
	$bad[] = "missing in the plugin: $k";
}
foreach ( array_diff( array_keys( $ours ), array_keys( $theirs['workers'] ) ) as $k ) {
	$bad[] = "not in the workers repository: $k";
}
foreach ( array_intersect( array_keys( $ours ), array_keys( $theirs['workers'] ) ) as $k ) {
	$a = $ours[ $k ];
	$b = $theirs['workers'][ $k ];
	ksort( $a );
	ksort( $b );
	if ( json_encode( $a ) !== json_encode( $b ) ) {
		$bad[] = "differs: $k";
	}
}

if ( $bad ) {
	fwrite( STDERR, "FAIL: the registries differ\n  " . implode( "\n  ", $bad ) . "\n" );
	exit( 1 );
}
echo 'OK: ' . count( $ours ) . " workflows match\n";
