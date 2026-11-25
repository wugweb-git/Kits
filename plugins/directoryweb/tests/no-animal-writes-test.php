<?php
/**
 * Regression: DirectoryWeb's runtime files never name the Animal Writes brand.
 * Comment lines are ignored (they may explain a legacy data name); JSON files are scanned by value.
 * Run: php plugins/directoryweb/tests/no-animal-writes-test.php
 */
$root   = dirname( __DIR__ );
$skip   = array( 'tests', 'languages', 'build', 'node_modules', 'vendor' );
$exempt = array( 'includes/animal-writes-compat.php', 'includes/legacy-aliases.php' );
$re     = '/animal ?writes|animalwrites/i';
$checks = 0;
$failed = array();

/** Strings (keys excluded) of a decoded JSON document. */
function nw_json_values( $v, array &$out ) {
	if ( is_array( $v ) ) {
		foreach ( $v as $x ) {
			nw_json_values( $x, $out );
		}
	} elseif ( is_string( $v ) ) {
		$out[] = $v;
	}
}

$it = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ) );
foreach ( $it as $f ) {
	$rel = str_replace( '\\', '/', substr( $f->getPathname(), strlen( $root ) + 1 ) );
	if ( in_array( explode( '/', $rel )[0], $skip, true ) || in_array( $rel, $exempt, true ) || ! preg_match( '/\.(php|js|json)$/', $rel ) || 'package-lock.json' === basename( $rel ) ) {
		continue;
	}
	$src = (string) file_get_contents( $f->getPathname() );
	++$checks;
	if ( str_ends_with( $rel, '.json' ) ) {
		$vals = array();
		nw_json_values( json_decode( $src, true ), $vals );
		foreach ( $vals as $s ) {
			if ( preg_match( $re, $s ) ) {
				$failed[] = $rel . ': ' . substr( $s, 0, 80 );
			}
		}
		continue;
	}
	// Blank out block comments, keeping newlines so line numbers stay right.
	$src = preg_replace_callback( '#/\*.*?\*/#s', fn( $m ) => preg_replace( '/[^\n]/', ' ', $m[0] ), $src );
	foreach ( explode( "\n", $src ) as $n => $line ) {
		$t = ltrim( $line );
		if ( str_starts_with( $t, '//' ) || str_starts_with( $t, '*' ) || str_starts_with( $t, '#' ) ) {
			continue;
		}
		// Drop a trailing // comment (not one inside a URL scheme).
		$code = preg_replace( '#(?<![:\'"\w])//[^\n]*$#', '', $line );
		if ( preg_match( $re, $code ) ) {
			$failed[] = $rel . ':' . ( $n + 1 ) . ': ' . trim( substr( $line, 0, 100 ) );
		}
	}
}
foreach ( $failed as $m ) {
	echo "FAIL $m\n";
}
echo $checks . ' checks, ' . count( $failed ) . " failed\n";
exit( $failed ? 1 : 0 );
