<?php
/**
 * Guard: sourceweb defines no function with the short 'aw_' prefix except the earlier-name aliases in includes/compat/legacy-aliases.php
 * (WordPress.org wants a project prefix of four or more characters). Stored names (options, meta, hooks, cron events,
 * REST routes) are not functions and keep their names.
 *
 * Usage: php plugins/sourceweb/tests/no-aw-functions-test.php
 *
 * @package sourceweb
 */

$root   = dirname( __DIR__ );
$failed = 0;
$total  = 0;
$it     = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ) );
foreach ( $it as $file ) {
	$path = str_replace( '\\', '/', (string) $file );
	if ( ! preg_match( '/\.php$/', $path ) || false !== strpos( $path, '/tests/' ) || false !== strpos( $path, '/vendor/' ) || false !== strpos( $path, '/build/' ) ) {
		continue;
	}
	$is_alias_file = str_ends_with( $path, '/includes/compat/legacy-aliases.php' );
	$code          = (string) file_get_contents( $path );
	preg_match_all( '/^\s*function\s+(aw_[A-Za-z0-9_]+)\s*\(/m', $code, $m );
	++$total;
	if ( $m[1] && ! $is_alias_file ) {
		++$failed;
		echo 'FAIL ' . substr( $path, strlen( $root ) + 1 ) . ' defines ' . implode( ', ', $m[1] ) . "\n";
	}
	preg_match_all( '/^\s*(?:final\s+|abstract\s+)?class\s+(AW_[A-Za-z0-9_]+)/m', $code, $c );
	if ( $c[1] ) {
		++$failed;
		echo 'FAIL ' . substr( $path, strlen( $root ) + 1 ) . ' defines class ' . implode( ', ', $c[1] ) . "\n";
	}
}
echo $total . ' files checked, ' . $failed . " failed\n";
exit( $failed ? 1 : 0 );
