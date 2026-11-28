<?php
/**
 * Guard: directoryweb defines no function with a short prefix ('aw_' or 'dw_') except the earlier-name aliases in includes/legacy-aliases.php
 * (WordPress.org wants a project prefix of four or more characters). Stored names (the aw_listing and aw_claim post types,
 * aw_* meta and options, Fluent Forms' dw_evidence submission meta) are not functions and keep their names.
 *
 * Usage: php plugins/directoryweb/tests/no-short-prefix-test.php
 *
 * @package directoryweb
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
	$is_alias_file = '/includes/legacy-aliases.php' === substr( $path, -28 );
	$code          = (string) file_get_contents( $path );
	preg_match_all( '/^\s*function\s+((?:aw|dw)_[A-Za-z0-9_]+)\s*\(/m', $code, $m );
	++$total;
	if ( $m[1] && ! $is_alias_file ) {
		++$failed;
		echo 'FAIL ' . substr( $path, strlen( $root ) + 1 ) . ' defines ' . implode( ', ', $m[1] ) . "\n";
	}
	preg_match_all( '/^\s*(?:final\s+|abstract\s+)?class\s+((?:AW|DW)_[A-Za-z0-9_]+)/m', $code, $c );
	preg_match_all( '/^\s*const\s+((?:AW|DW)_[A-Za-z0-9_]+)|define\(\s*[\'"]((?:AW|DW)_[A-Za-z0-9_]+)/m', $code, $k ); // a constant carries the plugin's own prefix (DIRECTORYWEB_)
	if ( array_filter( array_merge( $k[1], $k[2] ) ) ) {
		++$failed;
		echo 'FAIL ' . substr( $path, strlen( $root ) + 1 ) . ' defines constant ' . implode( ', ', array_filter( array_merge( $k[1], $k[2] ) ) ) . "\n";
	}
	if ( $c[1] ) {
		++$failed;
		echo 'FAIL ' . substr( $path, strlen( $root ) + 1 ) . ' defines class ' . implode( ', ', $c[1] ) . "\n";
	}
}
echo $total . ' files checked, ' . $failed . " failed\n";
exit( $failed ? 1 : 0 );
