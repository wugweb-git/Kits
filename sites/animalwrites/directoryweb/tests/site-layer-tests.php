<?php
/**
 * The Animal Writes site layer (sites/animalwrites/directoryweb/) carries, unchanged, what DirectoryWeb 1.3.0 no longer has:
 * Find help and the district helplines, local cards, Verified from government lists, Featured in, the PIN lookup, the
 * veterinary filter, services, data sources, Directory wording and India geocoding. This checks the wiring and the words.
 *
 * Run: php sites/animalwrites/directoryweb/tests/site-layer-tests.php
 */
define( 'ABSPATH', __DIR__ . '/' );
$dir    = dirname( __DIR__ );
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

$GLOBALS['dw_filters'] = array();
function add_filter( $h, $cb, $p = 10, $n = 1 ) {
	$GLOBALS['dw_filters'][ $h ][] = $cb;
}
function add_action( ...$a ) {
	$GLOBALS['dw_actions'][ $a[0] ][] = $a[1];
}
function apply_filters( $h, $v, ...$rest ) {
	foreach ( $GLOBALS['dw_filters'][ $h ] ?? array() as $cb ) {
		$v = $cb( $v, ...$rest );
	}
	return $v;
}
function __( $t ) {
	return $t;
}

// Every file the loader names exists, parses, and nothing else is left unlisted.
$site = (string) file_get_contents( $dir . '/site.php' );
preg_match( '/array\(( \'[a-z-]+\',?)+ \) as \$directoryweb_aw_file/', $site, $m );
preg_match_all( "/'([a-z-]+)'/", $m[0], $names );
$listed = $names[1];
$onDisk = array_map( fn( $f ) => basename( $f, '.php' ), glob( $dir . '/includes/*.php' ) );
sort( $listed );
sort( $onDisk );
check( $listed === $onDisk, 'site.php loads every file in includes/ (and only those)' );
foreach ( $onDisk as $f ) {
	exec( escapeshellarg( PHP_BINARY ) . ' -l ' . escapeshellarg( "$dir/includes/$f.php" ), $o, $rc );
	check( 0 === $rc, "includes/$f.php has no syntax error" );
}
foreach ( array( 'find-help', 'district-helplines', 'local-cards', 'directoryweb-find-help', 'directoryweb-helplines', 'directoryweb-local-card', 'gov-verified', 'featured', 'pin-lookup', 'sources', 'types', 'copy' ) as $f ) {
	check( in_array( $f, $listed, true ), "$f is loaded by the site layer" );
}
check( 1 === preg_match( "/add_filter\(\s*'directoryweb_pin_lookup_enabled'\s*,\s*'__return_true'\s*\)/", $site ), 'the PIN lookup is turned on' );
check( 1 === preg_match( "/add_filter\(\s*'directoryweb_near_bounds'/", $site ), 'Near me stays inside India' );

// The words and data the plugin no longer has.
require $dir . '/includes/types.php';
require $dir . '/includes/copy.php';
require $dir . '/includes/sources.php';
check( 5 === count( apply_filters( 'directoryweb_type_groups', array() )['veterinary']['types'] ) && 'Veterinary' === apply_filters( 'directoryweb_type_groups', array() )['veterinary']['name'], 'veterinary is one type filter again' );
check( 15 === count( apply_filters( 'directoryweb_services', array() ) ) && array( 'wildlife-rescue', 'emergency-rescue' ) === apply_filters( 'directoryweb_service_type_slugs', array() ), 'the 15 services, two of them listing types' );
check( array( 'treatment', 'ambulance' ) === apply_filters( 'directoryweb_type_services', array() )['mobile-veterinary-unit'], 'type to services map' );
$city = (object) array( 'name' => 'Ernakulam', 'parent' => 5 );
check( 'Animal NGOs in Ernakulam' === apply_filters( 'directoryweb_directory_h1', 'Listings in Ernakulam', $city, '' ), 'district H1' );
check( 'Animal Welfare NGOs in Kerala' === apply_filters( 'directoryweb_directory_h1', 'Listings in Kerala', (object) array( 'name' => 'Kerala', 'parent' => 0 ), '' ), 'state H1' );
check( 'Gaushala in Ernakulam' === apply_filters( 'directoryweb_directory_h1', 'Gaushala in Ernakulam', $city, 'Gaushala' ), 'type H1 left to the plugin' );
check( 'Animal welfare organisations, Gaushalas and government vets across India.' === apply_filters( 'directoryweb_directory_intro', '', null ), 'hub intro' );
$claim = apply_filters( 'directoryweb_claim_copy', array() );
check( 3 === count( $claim['benefits'] ) && 'Direct Emergency Helpline' === $claim['benefits'][0]['title'], 'claim page: the three benefits, helpline first' );
$geo = apply_filters( 'directoryweb_geocode_profile', array() );
check( 'India' === $geo['country'] && in_array( 'aw_awbi_address', $geo['address_keys'], true ), 'geocoding: India and the AWBI address' );
$reg = apply_filters( 'directoryweb_data_sources', array() );
check( 11 === count( $reg ) && 'AWBI' === $reg['awbi'][0], 'data sources: the AWBI, government and import lists' );
check( 'https://awbi.gov.in/' === apply_filters( 'directoryweb_source_hosts', array() )['awbi'], 'source logos: the AWBI site' );

echo $checks . ' checks, ' . count( $failed ) . " failed\n";
exit( $failed ? 1 : 0 );
