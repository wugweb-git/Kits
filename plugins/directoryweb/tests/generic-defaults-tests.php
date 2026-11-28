<?php
/**
 * Regression: DirectoryWeb is a generic directory. Its runtime code carries none of the Animal Writes features (Find help,
 * district helplines, local cards, Verified from government lists, Featured in, the 1962 / veterinary types, the India
 * PIN lookup), and its neutral defaults (data sources, geocoding, type groups) name no country, list or animal.
 * Those features live in sites/animalwrites/directoryweb/ (tested there).
 *
 * Run: php plugins/directoryweb/tests/generic-defaults-tests.php
 */
define( "ABSPATH", __DIR__ . "/" );
const DAY_IN_SECONDS = 86400;
const HOUR_IN_SECONDS = 3600;
const WEEK_IN_SECONDS = 604800;
$root   = dirname( __DIR__ );
$checks = 0;
$failed = array();
function check( $ok, $what ) {
	global $checks, $failed;
	++$checks;
	if ( ! $ok ) {
		$failed[] = $what;
		echo "FAIL $what\n";
	}
}

// 1. The moved files are gone from the plugin, and nothing requires them.
foreach ( array( 'find-help', 'district-helplines', 'local-cards', 'directoryweb-find-help', 'directoryweb-helplines', 'directoryweb-local-card', 'gov-verified', 'featured' ) as $f ) {
	check( ! file_exists( "$root/includes/$f.php" ), "includes/$f.php is not in the plugin" );
}
$main = (string) file_get_contents( $root . '/directoryweb.php' );
foreach ( array( 'find-help', 'district-helplines', 'local-cards', 'directoryweb-local-card', 'directoryweb-helplines', 'gov-verified' ) as $f ) {
	check( false === strpos( $main, "'$f'" ), "directoryweb.php does not load $f" );
}
check( false === strpos( $main, "'featured'," ), 'directoryweb.php does not load featured.php' );
check( false === strpos( $main, 'directoryweb_helplines_enabled' ), 'no switch or option for the helplines in the plugin' );

// 2. No Animal Writes code in the runtime files (comments ignored).
$tokens = array( 'DIRECTORYWEB_VET_TYPES', 'postalpincode', 'district_helplines', 'directoryweb/find-help', 'directoryweb/helplines', 'directoryweb/local-card', 'DIRECTORYWEB_TYPE_SERVICES', 'DIRECTORYWEB_SERVICES', 'DIRECTORYWEB_SOURCE_HOSTS', 'DIRECTORYWEB_IMPORT_SOURCES', "'India'", "'veterinary'", 'Gaushala', 'Emergency Helpline' );
$it     = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root . '/includes', FilesystemIterator::SKIP_DOTS ) );
foreach ( $it as $f ) {
	if ( 'php' !== $f->getExtension() ) {
		continue;
	}
	$code = '';
	foreach ( token_get_all( (string) file_get_contents( $f->getPathname() ) ) as $t ) {
		if ( is_array( $t ) && in_array( $t[0], array( T_COMMENT, T_DOC_COMMENT ), true ) ) {
			continue;
		}
		$code .= is_array( $t ) ? $t[1] : $t;
	}
	foreach ( $tokens as $tok ) {
		check( false === strpos( $code, $tok ), 'includes/' . substr( $f->getPathname(), strlen( $root . '/includes/' ) ) . " has no $tok" );
	}
}

// 3. Neutral defaults.
$GLOBALS['dw_filters'] = array();
function add_filter( $h, $cb ) {
	$GLOBALS['dw_filters'][ $h ][] = $cb;
}
function add_action( ...$a ) {}
function apply_filters( $h, $v, ...$rest ) {
	foreach ( $GLOBALS['dw_filters'][ $h ] ?? array() as $cb ) {
		$v = $cb( $v, ...$rest );
	}
	return $v;
}
function __( $t ) {
	return $t;
}
require $root . '/includes/data-sources.php';
require $root . '/includes/geocode.php';
check( array( 'gmaps', 'organisation' ) === array_keys( directoryweb_data_sources() ), 'data sources by default: Google Maps and the organisation only' );
check( array( 'gmaps' ) === array_keys( directoryweb_source_hosts() ), 'source hosts by default: Google Maps only' );
$p = directoryweb_geo_profile();
check( '' === $p['country'] && array( 'aw_address', 'aw_import_address' ) === $p['address_keys'] && '' === $p['postcode_in_text'], 'geocoding by default: no country, no postal code scanning, no AWBI address' );
add_filter( 'directoryweb_geocode_profile', fn( $x ) => array_merge( $x, array( 'country' => 'Kenya' ) ) );
check( 'Kenya' === directoryweb_geo_profile()['country'], 'geocoding: a site gives its country with the filter' );
add_filter( 'directoryweb_data_sources', fn( $r ) => $r + array( 'x' => array( 'X', 'X list', '', '' ) ) );
check( isset( directoryweb_data_sources()['x'] ), 'data sources: a site adds its own with the filter' );

echo $checks . ' checks, ' . count( $failed ) . " failed\n";
exit( $failed ? 1 : 0 );
