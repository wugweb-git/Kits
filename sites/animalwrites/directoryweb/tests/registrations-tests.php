<?php
/**
 * The Animal Writes registration fields (includes/registrations.php) put back, through DirectoryWeb 1.4.0's filters,
 * everything the plugin carried before: AWBI, 12A, 80G, FCRA and NGO Darpan in the meta schema, the protected and
 * team-only lists, the claim form rows and their labels, the listing page rows, the editor field group and the India places data.
 *
 * Usage: php sites/animalwrites/directoryweb/tests/registrations-tests.php
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	if ( 'cli' !== PHP_SAPI ) {
		exit;
	}
	define( 'ABSPATH', __DIR__ . '/' );
}

// phpcs:disable -- a command-line test runner with stand-ins for WordPress functions.

$filters = array();
function add_filter( $h, $cb, ...$r ) { global $filters; $filters[ $h ][] = $cb; }
function add_action( ...$a ) {}
function apply_filters( $h, $v, ...$rest ) { global $filters; foreach ( $filters[ $h ] ?? array() as $cb ) { $v = $cb( $v, ...$rest ); } return $v; }
function __( $t ) { return $t; }
function esc_html( $v ) { return (string) $v; }
function directoryweb_lf( $id, $k ) { global $lf; return $lf[ $k ] ?? ''; }
function directoryweb_date( $d ) { return '<d>' . $d . '</d>'; }
function directoryweb_listing_parts( $p ) { return implode( '|', array_filter( $p ) ); }
function directoryweb_listing_validity( $d ) { return '' === $d ? '' : 'valid:' . $d; }
function directoryweb_listing_na( $id ) { return 'NA'; }
function directoryweb_listing_issuer_icon( $slug, $id, $fallback ) { return 'icon:' . $slug; }
function get_post_meta( $id, $k ) { global $lf; return $lf[ $k ] ?? ''; }

$plugin = dirname( __DIR__, 4 ) . '/plugins/directoryweb';
require $plugin . '/includes/labels.php';
require $plugin . '/includes/listing-meta.php';
require dirname( __DIR__ ) . '/includes/registrations.php';

$count = 0;
$fails = 0;
function check( $ok, $label ) { global $count, $fails; ++$count; if ( ! $ok ) { ++$fails; echo "FAIL: $label\n"; } }

// Protected, team-only (same order as before), dates, expiry.
$p = directoryweb_protected_meta_names();
foreach ( array( 'awbi_recognised', 'awbi_renewed', 'awbi_valid', 'awbi_code', 'awbi_dropped', 'awbi_list_on', 'darpan_id', 'darpan_blacklisted_by', 'darpan_blacklisted_on', 'reg_authority', 'reg_act', 'reg_date', 'sectors', 'verified', 'gov_verified_by' ) as $n ) {
	check( in_array( $n, $p, true ), "protected: $n" );
}
check( array( 'needs_reverify', 'gov_verified_by', 'darpan_blacklisted_by', 'darpan_blacklisted_on', 'reg_authority', 'reg_act', 'sectors', 'awbi_list_on' ) === directoryweb_private_meta_names(), 'team-only list: the same eight, in the same order' );
check( array( 'awbi_valid' ) === apply_filters( 'directoryweb_expiry_meta_names', array() ), 'daily re-check: AWBI valid until' );
foreach ( array( 'awbi_recognised', 'awbi_renewed', 'awbi_valid' ) as $n ) {
	check( '2026-02-03' === directoryweb_sanitize_meta( '2026-02-03', 'aw_' . $n ) && '' === directoryweb_sanitize_meta( 'soon', 'aw_' . $n ), "date kept as Y-m-d: $n" );
}

// The claim form: the table as it was, rows, order and labels (through the plugin's claim label rule).
$src = (string) file_get_contents( $plugin . '/includes/claims-review.php' );
$a   = strpos( $src, 'const DIRECTORYWEB_CLAIM_L = array(' );
$b   = strpos( $src, "\n);", $a ) + 3;
eval( substr( $src, $a, $b - $a ) );
$base   = DIRECTORYWEB_CLAIM_L;
$moved  = array( 'l_12a', 'l_80g', 'l_darpan', 'l_reg_auth', 'l_reg_act', 'l_fcra', 'l_awbi_code', 'l_awbi_rec', 'l_awbi_ren', 'l_awbi_valid' );
check( array() === array_intersect( $moved, array_keys( $base ) ), 'the plugin table has none of the moved rows' );
$rows = apply_filters( 'directoryweb_claim_fields', $base );
$was  = json_decode( (string) file_get_contents( __DIR__ . '/fixtures/claim-fields-before-1.4.0.json' ), true );
check( array_keys( $was ) === array_keys( $rows ), 'claim rows: the same 35 rows in the same order' );
$ok = true;
foreach ( $was as $k => $def ) {
	if ( 'l_animals' === $k ) {
		continue; // its wording is checked in labels-aw-tests.php
	}
	$mine = $rows[ $k ];
	$mine[0] = directoryweb_claim_label( $k, $mine[0] );
	if ( $mine !== $def ) {
		$ok = false;
		echo "claim row differs: $k\n";
	}
}
check( $ok, 'claim rows: label, meta key, log field and public flag unchanged' );
check( array( 'l_reg_date', 'l_awbi_rec', 'l_awbi_ren', 'l_awbi_valid' ) === apply_filters( 'directoryweb_ff_dates', array( 'l_reg_date' ) ), 'claim form date fields' );
check( in_array( 'aw_awbi_valid', apply_filters( 'directoryweb_claim_date_meta_keys', array() ), true ), 'claimed AWBI dates are kept as Y-m-d' );

// The editor box, the facts, the registration rows and pairs.
$fields = apply_filters( 'directoryweb_listing_fields', array( 'About' => array( 'aw_founded' => array( 'Year' ), 'aw_registration' => array( 'Registration' ), 'aw_animals' => array( 'A' ) ) ) );
check( array( 'aw_founded', 'aw_registration', 'aw_reg_12a', 'aw_reg_80g', 'aw_darpan_id', 'aw_animals' ) === array_keys( $fields['About'] ) && '12A' === $fields['About']['aw_reg_12a'][0], 'profile box: 12A, 80G and Darpan after the registration' );
$facts = apply_filters( 'directoryweb_org_facts', array( 'aw_head' => 'Head', 'aw_registration' => 'Registration', 'aw_hours' => 'Hours' ), 1 );
check( array( 'aw_head', 'aw_registration', 'aw_reg_12a', 'aw_reg_80g', 'aw_fcra', 'aw_darpan_id', 'aw_hours' ) === array_keys( $facts ) && 'FCRA' === $facts['aw_fcra'], 'listing facts: 12A, 80G, FCRA, Darpan after the registration' );
$lf    = array( 'aw_awbi_code' => 'X-1', 'aw_awbi_valid' => '2030-01-01', 'aw_reg_12a' => 'T1', 'aw_fcra' => 'F1', 'aw_darpan_id' => 'KL/1' );
$reg   = array( array( 'Registration', 'R', 'file' ) );
$rows2 = apply_filters( 'directoryweb_listing_registration_rows', $reg, 1 );
check( 6 === count( $rows2 ) && 'AWBI number' === $rows2[0][0] && 'X-1|valid:2030-01-01' === $rows2[0][1] && 'icon:awbi' === $rows2[0][2], 'Registrations group: AWBI number first, with its validity' );
check( array( 'AWBI number', 'Registration', '12A', '80G', 'FCRA', 'NGO Darpan ID' ) === array_column( $rows2, 0 ) && 'icon:mha' === $rows2[4][2] && 'icon:darpan' === $rows2[5][2], 'Registrations group: the same six rows in the same order, with the issuers' );
$lf    = array();
check( 'NA' === apply_filters( 'directoryweb_listing_registration_rows', $reg, 1 )[0][1], 'Registrations group: no AWBI code says data not yet available' );
$lf    = array( 'aw_awbi_code' => 'X-1', 'aw_awbi_dropped' => '2026-05-31' );
check( false !== strpos( apply_filters( 'directoryweb_listing_registration_rows', $reg, 1 )[0][1], 'Not on the current AWBI list' ), 'Registrations group: lapsed code says so' );
$lf    = array( 'aw_reg_12a' => 'T1', 'aw_reg_80g' => 'G1', 'aw_darpan_id' => 'KL/1' );
$pairs = apply_filters( 'directoryweb_listing_registration_pairs', array( array( 'Registration', 'R' ) ), 1 );
check( array( 'Registration', '12A', '80G', 'NGO Darpan ID' ) === array_column( $pairs, 0 ) && 'T1' === $pairs[1][1], 'reading panel: the registration group has 12A, 80G and Darpan' );
check( array( 'Recognised by the Animal Welfare Board of India (AWBI code' ) === apply_filters( 'directoryweb_listing_template_intro_prefixes', array() ), 'an AWBI import line counts as a template intro' );

// The editor's words for the two neutral fields.
$f = apply_filters( 'acf/load_field/name=aw_animals', array( 'label' => 'Who is helped', 'instructions' => 'Comma separated.' ) );
check( 'Animals helped' === $f['label'] && 'Comma separated, e.g. dogs, cats, cattle, birds.' === $f['instructions'], 'editor: Animals helped and its hint' );
check( 'As on the Google profile, e.g. Animal shelter.' === apply_filters( 'acf/load_field/name=aw_g_category', array( 'instructions' => 'x' ) )['instructions'], 'editor: Google category example' );

// The editor field group and the places data.
$g = json_decode( (string) file_get_contents( dirname( __DIR__ ) . '/acf-json/group_aw_listing_registrations_in.json' ), true );
$n = array_column( $g['fields'], 'name' );
foreach ( array( 'aw_reg_12a', 'aw_reg_80g', 'aw_darpan_id', 'aw_fcra', 'aw_awbi_code', 'aw_awbi_valid', 'aw_awbi_recognised', 'aw_awbi_renewed', 'aw_reg_authority', 'aw_reg_act', 'aw_sectors' ) as $f ) {
	check( in_array( $f, $n, true ), "field group has $f" );
}
$kept = json_decode( (string) file_get_contents( $plugin . '/acf-json/group_aw_listing_registrations.json' ), true );
check( array( 'aw_registration', 'aw_reg_type', 'aw_reg_date' ) === array_column( $kept['fields'], 'name' ), 'the plugin keeps only the neutral registration, type and date fields' );
$keys = array_merge( array_column( $g['fields'], 'key' ), array_column( $kept['fields'], 'key' ) );
check( count( $keys ) === count( array_unique( $keys ) ), 'no field key is used twice across the two groups' );
check( 'group_aw_listing_registrations_in' === $g['key'] && array( 'group_aw_listing_registrations_in' ) === apply_filters( 'aw_scf_groups', array() ), 'the group is registered by the site layer' );
$paths = apply_filters( 'acf/settings/load_json', array() );
check( is_dir( $paths[0] ) && is_file( $paths[0] . '/group_aw_listing_registrations_in.json' ), 'the site layer adds its acf-json folder' );
$lgd = json_decode( (string) file_get_contents( apply_filters( 'directoryweb_places_file', '' ) ), true );
check( count( $lgd['states'] ) > 30 && count( $lgd['districts'] ) > 700, 'places file: states and districts' );
check( is_array( json_decode( (string) file_get_contents( apply_filters( 'directoryweb_district_centroids_file', '' ) ), true ) ), 'district centres file parses' );
check( ! file_exists( $plugin . '/data/lgd.json' ) && ! file_exists( $plugin . '/data/district-centroids.json' ), 'the plugin ships no places data' );

echo $count . ' checks, ' . $fails . " failed (Animal Writes registrations)\n";
exit( $fails ? 1 : 0 );
