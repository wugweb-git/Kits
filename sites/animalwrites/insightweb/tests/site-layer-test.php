<?php
/**
 * Animal Writes site layer for InsightWeb: the moved links seed and brand pattern still load and hold their rows.
 * Usage: php sites/animalwrites/insightweb/tests/site-layer-test.php
 *
 * @package animalwrites-site
 */

// phpcs:disable -- a command-line test with stand-ins for WordPress.
define( 'ABSPATH', '/' );
$GLOBALS['opts'] = array();
$GLOBALS['put']  = array();
function wp_specialchars_decode( $s ) { return $s; }
function get_bloginfo() { return 'Animal Writes'; }
function get_option( $k, $d = false ) { return $GLOBALS['opts'][ $k ] ?? $d; }
function update_option( $k, $v ) { $GLOBALS['opts'][ $k ] = $v; return true; }
function apply_filters( $t, $v ) { return $v; }
function home_url() { return 'https://animalwrites.in'; }
function wp_parse_url( $u, $c = -1 ) { return parse_url( $u, $c ); }
function insightweb_si_link_put( array $r ) { $GLOBALS['put'][] = $r; return 1; }

$fails = 0;
function chk( $ok, $label ) { global $fails; echo ( $ok ? 'ok   ' : 'FAIL ' ) . $label . "\n"; $fails += $ok ? 0 : 1; }

require dirname( __DIR__ ) . '/links-seed.php';
$rows = insightweb_si_links_seed_data();
chk( count( $rows ) > 50 && isset( $rows[0]['from_url'], $rows[0]['linked_url'], $rows[0]['type'] ), 'first batch has rows with the link fields (' . count( $rows ) . ')' );
$b = (array) require dirname( __DIR__ ) . '/data/links-2026-11-02.php';
chk( 22 === count( $b ), 'second batch has its 22 rows' );
$out = insightweb_si_links_seed();
chk( ( $out['added'] ?? 0 ) === count( $rows ) + 22 && isset( $GLOBALS['opts']['aw_si_links_seeded'], $GLOBALS['opts']['aw_si_links_seeded_20261102'] ), 'seed writes every row and marks both batches' );
chk( array() === insightweb_si_links_seed(), 'a second run does nothing' );

$src = file_get_contents( dirname( __DIR__ ) . '/site.php' );
preg_match( "/insightweb_brand_pattern', fn\(\) => '(.*?)' \);/", $src, $m );
$rx = $m[1] ?? '';
chk( '' !== $rx && preg_match( $rx, 'animal writes petition' ) && preg_match( $rx, 'animalwrites.in' ) && ! preg_match( $rx, 'stray dogs' ), 'brand pattern matches the site and its earlier names only' );
$site = file_get_contents( dirname( __DIR__ ) . '/site.php' );
chk( false !== strpos( $site, "'insightweb_post_type_roles'" ) && false !== strpos( $site, "'campaign'    => 'aw_campaign'" ), 'site.php feeds the content type roles' );

echo $fails ? "{$fails} failed\n" : "all passed\n";
exit( $fails ? 1 : 0 );
