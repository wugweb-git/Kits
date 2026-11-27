<?php
/**
 * Tests for the Animal Writes site layer of SourceWeb 0.4.0 that need no WordPress: the WP-CLI migration files (phases 1
 * to 4) keep their safety rules, and the site files parse and fire the same hooks. They moved here from
 * plugins/sourceweb/tests when the migration code left the plugin.
 *
 * Usage: php sites/animalwrites/sourceweb/tests/run.php
 *
 * @package animalwrites-sourceweb
 */

$fails = 0;
$count = 0;

/**
 * One check.
 *
 * @param mixed  $ok   Truthy when it passes.
 * @param string $what What is checked.
 */
function aw_t( $ok, $what ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		fwrite( STDERR, "FAIL: $what\n" );
	}
}

$p2_mg = (string) file_get_contents( dirname( __DIR__ ) . '/includes/lifecycle/sourcing-migrate-phase2.php' );
aw_t( substr_count( $p2_mg, "'aw_sourcing_migrating'" ) >= 3, 'migration sets the flag and clears it when done or rolled back' );
$p2_src = (string) file_get_contents( dirname( __DIR__ ) . '/includes/lifecycle/sourcing-migrate-phase2.php' );
aw_t( substr_count( $p2_src, '$save();' ) >= 5, 'phase 2 saves its undo record before each change' );
$p4_mg  = (string) file_get_contents( dirname( __DIR__ ) . '/includes/lifecycle/sourcing-migrate-retire.php' );
$p4_mig = substr( $p4_mg, strpos( $p4_mg, "'aw_sourcing_cli_migrate_4'" ), strpos( $p4_mg, "'aw_sourcing_cli_verify_4'" ) - strpos( $p4_mg, "'aw_sourcing_cli_migrate_4'" ) );
aw_t( ! preg_match( "/(update|delete)_option\(\s*(SOURCEWEB_REL_OPTION|'aw_relevance'|'aw_sources'|'aw_sourcing_dismissed')/", $p4_mig ), 'migrate --phase=4 writes and deletes no old option' );
aw_t( false === strpos( $p4_mg, 'aw-backups' ) || ! preg_match( '/unlink|wp_delete_file|delete_option\(\s*\$name/', $p4_mg ), 'phase 4 deletes no backup' );
aw_t( substr_count( $p4_mig, '$save();' ) >= 3 && false !== strpos( $p4_mig, "'aw_sourcing_migrating', 4" ), 'the record is saved before each step and the migrating flag is set' );

// The site layer: every file is there and loads its hooks (alerts and seeds are filters and actions only).
foreach ( array( 'site.php', 'includes/seeds.php', 'includes/alerts.php', 'includes/enrichment.php', 'includes/not-news-rules.php', 'includes/dashboard-box.php', 'includes/kits-hub.php', 'data/sources-seed.json' ) as $f ) {
	aw_t( is_file( dirname( __DIR__ ) . '/' . $f ), "$f exists" );
}
$seed = json_decode( (string) file_get_contents( dirname( __DIR__ ) . '/data/sources-seed.json' ), true );
aw_t( is_array( $seed ) && ! empty( $seed['sources'] ), 'the starter list is valid JSON with sources' );
$alerts = (string) file_get_contents( dirname( __DIR__ ) . '/includes/alerts.php' );
aw_t( false !== strpos( $alerts, "'sourceweb_ingest_problems'" ) && false !== strpos( $alerts, "'sourceweb_workers_problems'" ) && false !== strpos( $alerts, "'sourceweb_relevance_alert'" ), 'the alert emails hook the three SourceWeb extension points' );
aw_t( false === strpos( $alerts . (string) file_get_contents( dirname( __DIR__ ) . '/includes/seeds.php' ), 'sourceweb_animal_writes_context' ), 'the site layer needs no switch' );

// The role map and the Animal Writes enrichment (second pass, 0.4.1): filters only, answering SourceWeb's neutral filters.
$site = (string) file_get_contents( dirname( __DIR__ ) . '/site.php' );
aw_t( false !== strpos( $site, "'sourceweb_post_type_roles'" ) && preg_match( "/'news'\\s*=> 'aw_news'.*'library'\\s*=> 'aw_legal'.*'campaign'\\s*=> 'aw_campaign'.*'opportunity'\\s*=> 'aw_opportunity'.*'listing'\\s*=> 'aw_listing'.*'press'\\s*=> 'aw_press'/s", $site ), 'site.php feeds the six post types to sourceweb_post_type_roles' );

define( 'ABSPATH', __DIR__ . '/' );
$GLOBALS['sw_filters'] = array();
function add_filter( $tag, $cb, $prio = 10, $args = 1 ) {
	$GLOBALS['sw_filters'][ $tag ][] = $cb;
}
function get_post_meta( $id, $key, $single = false ) {
	return 'meta-' . $key;
}
require dirname( __DIR__ ) . '/includes/enrichment.php';
$run = function ( $tag, ...$args ) {
	$v = $args[0];
	foreach ( $GLOBALS['sw_filters'][ $tag ] ?? array() as $cb ) {
		$v = $cb( ...$args );
		$args[0] = $v;
	}
	return $v;
};
$src = $run( 'sourceweb_enrich_sources', array( 'claim' => array( 'C' ), 'social' => array( 'S' ), 'osm' => array( 'O' ), 'wikidata' => array( 'W' ), 'listing' => array( 'L' ), 'google_places' => array( 'G' ) ) );
aw_t( array( 'claim', 'social', 'darpan', 'osm', 'wikidata', 'awbi', 'listing', 'google_places' ) === array_keys( $src ), 'enrichment: NGO Darpan and AWBI return as sources in their old places' );
$fl = $run( 'sourceweb_enrich_fields', array( 'registration' => array( 'R' ), 'reg_80g' => array( 'G' ) ) );
aw_t( array( 'registration', 'darpan_id', 'reg_80g' ) === array_keys( $fl ) && 'aw_darpan_id' === $fl['darpan_id'][1], 'enrichment: the Darpan ID field returns after the registration number' );
aw_t( array( 'awbi_code', 'awbi_recognised', 'awbi_renewed', 'awbi_valid' ) === array_keys( $run( 'sourceweb_enrich_claim_fields', array() ) ), 'enrichment: the four AWBI claim fields return' );
$steps = $run( 'sourceweb_enrich_queue_steps', array( 'new', 'claimed', 'none', 'google', 'all' ), '', array( 'm' => 'pm' ) );
aw_t( 6 === count( $steps ) && false !== strpos( $steps[3], "aw_awbi_code" ) && 'google' === $steps[4], 'enrichment: the AWBI step comes after new, claimed and no way to reach' );
$only = $run( 'sourceweb_enrich_queue_steps', array( 'new', 'claimed' ), 'awbi-bare', array( 'm' => 'pm' ) );
aw_t( 1 === count( $only ) && false !== strpos( $only[0], 'pm a WHERE' ), 'enrichment: group awbi-bare asks for that step alone' );
aw_t( 'meta-aw_awbi_code' === $run( 'sourceweb_enrich_listing_payload', array(), 7 )['awbi_code'] && 'meta-aw_darpan_id' === $run( 'sourceweb_enrich_index_item', array(), 7 )['darpan_id'] && array( 'awbi_address', 'awbi_code', 'darpan_id' ) === array_keys( $run( 'sourceweb_enrich_cleanup_item', array(), 7 ) ), 'enrichment: the payload, the state index and the clean-up export carry the AWBI and Darpan values' );
aw_t( array( 'place_id' => 'aw_place_id', 'darpan_id' => 'aw_darpan_id' ) === $run( 'sourceweb_enrich_duplicate_keys', array( 'place_id' => 'aw_place_id' ) ), 'enrichment: the same Darpan ID is a possible duplicate' );
$nn = (string) file_get_contents( dirname( __DIR__ ) . '/includes/not-news-rules.php' );
aw_t( false !== strpos( $nn, "'sourceweb_not_news_reason'" ) && false !== strpos( $nn, "sourceweb_is_type( \$type, 'opportunity' )" ), 'the job-vacancy rule answers sourceweb_not_news_reason and spares the opportunity type' );

echo $fails ? "FAILED: $fails of $count\n" : "OK: $count checks\n";
exit( $fails ? 1 : 0 );
