<?php
/**
 * Guard: RankWeb must not name the Animal Writes site anywhere in its runtime code. Every .php and .js file of the
 * plugin is scanned, comments removed, for "Animal Writes", "animalwrites" and the "animal-writes/" block namespace. The only files allowed to name it are
 * includes/animal-writes-compat.php (loaded only when Animal Writes Core is active) and includes/legacy-aliases.php.
 * Skipped: tests/, languages/, build/, node_modules/. Stored names (aw_* keys, text domain, CSS classes) are not matched.
 *
 * Usage: php plugins/rankweb/tests/no-animal-writes-test.php
 *
 * @package rankweb
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.PHP.DiscouragedPHPFunctions, WordPress.Security.EscapeOutput -- a command-line test.

$root   = dirname( __DIR__ );
$skip   = array( 'tests', 'languages', 'build', 'node_modules', 'vendor' );
$except = array( 'includes/animal-writes-compat.php', 'includes/legacy-aliases.php' );
$count  = 0;
$fails  = 0;

/** The code of a PHP file with comments blanked (line numbers kept). */
function rankweb_guard_php_code( $src ) {
	$out = '';
	foreach ( token_get_all( $src ) as $t ) {
		if ( is_array( $t ) ) {
			$out .= in_array( $t[0], array( T_COMMENT, T_DOC_COMMENT ), true ) ? preg_replace( '/[^\n]/', '', $t[1] ) : $t[1];
		} else {
			$out .= $t;
		}
	}
	return $out;
}

/** The code of a JS file with comments blanked (line numbers kept). */
function rankweb_guard_js_code( $src ) {
	$src = preg_replace_callback( '#/\*.*?\*/#s', fn( $m ) => preg_replace( '/[^\n]/', '', $m[0] ), $src );
	return preg_replace( '#(?<![:\'"\\\\])//[^\n]*#', '', $src );
}

$iter = new RecursiveIteratorIterator(
	new RecursiveCallbackFilterIterator(
		new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ),
		function ( $f ) use ( $skip ) {
			return ! ( $f->isDir() && in_array( $f->getFilename(), $skip, true ) );
		}
	)
);
foreach ( $iter as $file ) {
	$ext = strtolower( $file->getExtension() );
	if ( ! in_array( $ext, array( 'php', 'js' ), true ) ) {
		continue;
	}
	$rel = substr( $file->getPathname(), strlen( $root ) + 1 );
	if ( in_array( $rel, $except, true ) ) {
		continue;
	}
	++$count;
	$src  = (string) file_get_contents( $file->getPathname() );
	$code = 'php' === $ext ? rankweb_guard_php_code( $src ) : rankweb_guard_js_code( $src );
	$bad  = array();
	foreach ( explode( "\n", $code ) as $i => $line ) {
		if ( preg_match( '/animal ?writes|animalwrites|animal-writes\//i', $line ) ) {
			$bad[] = $rel . ':' . ( $i + 1 ) . ': ' . trim( substr( $line, 0, 120 ) );
		}
	}
	if ( $bad ) {
		++$fails;
		echo "FAIL {$rel}\n  " . implode( "\n  ", $bad ) . "\n";
	}
}

// The compat file itself must exist (the AW values live there) and is the one place that may name the site.
++$count;
if ( ! is_file( $root . '/includes/animal-writes-compat.php' ) ) {
	++$fails;
	echo "FAIL includes/animal-writes-compat.php is missing\n";
}

echo "{$count} checks, {$fails} failed\n";
exit( $fails ? 1 : 0 );
