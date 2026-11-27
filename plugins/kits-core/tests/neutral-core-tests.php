<?php
// No ABSPATH guard: this is a command-line runner.
/**
 * Kits Core is used on other tenants (Wugweb, iKAN, others), so it must carry nothing that only makes sense for one site.
 * This sweeps the plugin's code for Animal Writes wording and data (the names and strings listed below), checks that the
 * files that moved to sites/animalwrites/kits-core/ are not back, and that every plugin PHP file is still loaded or
 * required by something. Notes in CHANGELOG.md, PENDING.md and readme.txt may name the site layer; code may not.
 *
 * Usage: php plugins/kits-core/tests/neutral-core-tests.php
 *
 * @package kits-core
 */

if ( 'cli' !== PHP_SAPI ) {
	exit;
}

// phpcs:disable -- a command-line test runner.

$root  = dirname( __DIR__ ) . '/';
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

// Allowed exceptions, each with its reason: field names stored in existing Fluent Forms claim forms (KITS_FF_DATES) and the
// aw_ listing function guard in the claim form check. (The Library "Dated" and campaign Metrics edit fields, which named
// aw_legal, moved to the site layer in 1.4.1: no exception for them any more.)
$allowed = array(
	'includes/forms/fluentforms.php' => array( 'l_awbi_', 'aw_listing_phones' ),
);

$words = '/animal|awbi|darpan|aw_news|aw_press|aw_opportunity|aw_campaign_link|aw_campaign_metrics|aw_legal|animalwrites|aw1-im/i';
$bad   = array();
$it    = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ) );
foreach ( $it as $file ) {
	$path = $file->getPathname();
	$rel  = substr( $path, strlen( $root ) );
	if ( preg_match( '#^(node_modules|build|languages|tests|src/node_modules)/#', $rel ) || ! preg_match( '/\.(php|js|json|css|html)$/', $rel ) || false !== strpos( $rel, 'package-lock' ) ) {
		continue;
	}
	$text = (string) file_get_contents( $path );
	if ( preg_match_all( $words, $text, $m, PREG_OFFSET_CAPTURE ) ) {
		foreach ( $m[0] as $hit ) {
			$line = substr_count( substr( $text, 0, $hit[1] ), "\n" ) + 1;
			$row  = explode( "\n", $text )[ $line - 1 ];
			$ok   = false;
			foreach ( $allowed[ $rel ] ?? array() as $a ) {
				$ok = $ok || false !== stripos( $row, $a );
			}
			if ( ! $ok ) {
				$bad[] = "$rel:$line";
			}
		}
	}
}
check( 'no Animal Writes wording or data in the plugin code (found: ' . implode( ', ', array_slice( array_unique( $bad ), 0, 12 ) ) . ')', ! $bad );

check( 'the Library and Metrics edit fields are in the site layer, not here', ! preg_match( '/aw_legal|aw_campaign_metrics|kits_library_post_type|kits_edit_fields_dated|kits_edit_fields_metric/', (string) file_get_contents( $root . 'includes/admin-layer/edit-fields.php' ) ) && is_file( dirname( $root, 2 ) . '/sites/animalwrites/kits-core/includes/edit-fields.php' ) );

foreach ( array(
	'includes/campaign-letters.php', 'includes/campaign-links.php', 'includes/thumbs.php', 'includes/category-images.php',
	'includes/card-images.php', 'includes/taxonomy-rename.php', 'includes/forms/campaign-form.php', 'includes/forms/volunteers.php',
	'includes/forms/reports.php', 'includes/forms/form-pages.php', 'includes/forms/compat.php', 'includes/ops/compat.php',
	'includes/ops/retention.php', 'includes/tools/media-reuse.php', 'includes/tools/data/media-reuse-plan.php',
	'includes/tools/data/media-duplicate-groups.php', 'assets/site', 'assets/js/sponsored-blocks.js',
) as $gone ) {
	check( "moved to the site layer, not here: $gone", ! file_exists( $root . $gone ) );
}

// Every include file is required by kits-core.php (directly or through its lists), so none is orphaned or missing.
$main = (string) file_get_contents( $root . 'kits-core.php' );
$main .= (string) file_get_contents( $root . 'includes/admin-shell.php' );
$missing = array();
foreach ( glob( $root . 'includes/*.php' ) as $f ) {
	$base = basename( $f, '.php' );
	if ( false !== strpos( $base, '-model' ) || 'uninstall-backup' === $base || 0 === strpos( $base, 'class-' ) ) {
		continue; // loaded by their screen, by another include or by uninstall.php
	}
	if ( false === strpos( $main, "'includes/$base.php'" ) && false === strpos( $main, $base . '.php' ) ) {
		$missing[] = $base;
	}
}
check( 'no include file is left unloaded (found: ' . implode( ', ', $missing ) . ')', ! $missing );

// Every require_once in kits-core.php points at a file that exists.
preg_match_all( "#'includes/([a-z0-9/_-]+\.php)'#i", file_get_contents( $root . 'kits-core.php' ), $m );
$gone = array_filter( array_unique( $m[1] ), fn( $f ) => ! is_file( $root . 'includes/' . $f ) );
check( 'every file kits-core.php requires exists', ! $gone );
preg_match_all( "#array\( ((?:'[a-z-]+',? ?)+)\) as \\\$kits_(?:forms|ops)_file#", file_get_contents( $root . 'kits-core.php' ), $lists );
$dirs = array( 'forms', 'ops' );
foreach ( $lists[1] as $i => $list ) {
	preg_match_all( "/'([a-z-]+)'/", $list, $names );
	foreach ( $names[1] as $name ) {
		check( "kits-core.php loads includes/{$dirs[$i]}/$name.php", is_file( $root . "includes/{$dirs[$i]}/$name.php" ) );
	}
}

echo "\n" . $n . ' checks, ' . $fails . " failed\n";
exit( $fails ? 1 : 0 );
