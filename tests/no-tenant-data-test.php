<?php
/**
 * No other site's identity inside the distributable plugins: no domain, contact address, social account or
 * hosting path of a particular site in DirectoryWeb or RankWeb code (comments excluded).
 *
 * Usage: php tests/no-tenant-data-test.php
 */
$needles = array( 'animalwrites.in', 'animal_writes_', 'contact@animal', 'u544169507', 'profile.php?id=61596537146561' );
$bad     = array();
foreach ( array( 'directoryweb', 'rankweb' ) as $plugin ) {
	$it = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( __DIR__ . "/../plugins/$plugin", FilesystemIterator::SKIP_DOTS ) );
	foreach ( $it as $f ) {
		$path = $f->getPathname();
		if ( preg_match( '#/(node_modules|build|languages|tests)/|PENDING\.md$#', $path ) || ! preg_match( '/\.(php|js|json|txt)$/', $path ) ) {
			continue;
		}
		foreach ( file( $path ) as $n => $line ) {
			if ( preg_match( '#^\s*(//|\*|/\*)#', $line ) ) {
				continue;
			}
			foreach ( $needles as $x ) {
				if ( false !== strpos( $line, $x ) ) {
					$bad[] = str_replace( __DIR__ . '/../', '', $path ) . ':' . ( $n + 1 ) . " ($x)";
				}
			}
		}
	}
}
echo $bad ? "FAIL: tenant data found:\n  " . implode( "\n  ", $bad ) . "\n" : "ok: no tenant domain, contact, social account or hosting path in DirectoryWeb or RankWeb\n";
exit( $bad ? 1 : 0 );
