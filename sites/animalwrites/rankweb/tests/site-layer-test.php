<?php
/**
 * Animal Writes site layer for RankWeb 2.4.0: every moved file parses, and the pieces that are plain functions behave as
 * they did in RankWeb 2.3.7 (the robots.txt Content-Signal line, the news sitemap line, the AWBI description, the filters
 * that feed RankWeb's neutral hooks).
 * Usage: php sites/animalwrites/rankweb/tests/site-layer-test.php
 *
 * @package animalwrites-site
 */

// phpcs:disable -- a command-line test with stand-ins for WordPress.
define( 'ABSPATH', '/' );
$GLOBALS['filters'] = array();
$GLOBALS['opts']    = array();
function add_filter( $t, $f, $p = 10, $n = 1 ) { $GLOBALS['filters'][ $t ][] = $f; return true; }
function add_action( $t, $f, $p = 10, $n = 1 ) { return add_filter( $t, $f ); }
function apply_filters( $t, $v, ...$a ) { foreach ( $GLOBALS['filters'][ $t ] ?? array() as $f ) { $v = $f( $v, ...$a ); } return $v; }
function get_option( $k, $d = false ) { return $GLOBALS['opts'][ $k ] ?? $d; }
function rankweb_seo_owner() { return 'none'; }
function post_type_exists() { return true; }
function home_url( $p = '' ) { return 'https://animalwrites.in' . $p; }
function esc_xml( $s ) { return $s; }

$fails = 0;
function chk( $ok, $label ) { global $fails; echo ( $ok ? 'ok   ' : 'FAIL ' ) . $label . "\n"; $fails += $ok ? 0 : 1; }

$dir = dirname( __DIR__ );
foreach ( array( 'site.php', 'legacy-aliases.php', 'listings.php', 'schema-hubs.php', 'news-and-robots.php', 'faq-data.php', 'programmatic.php', 'defaults.php', 'rankweb-constant-names.php' ) as $f ) {
	exec( 'php -l ' . escapeshellarg( $dir . '/' . $f ) . ' 2>&1', $out, $rc );
	chk( 0 === $rc, "{$f} parses" );
}

// The old AW_ constant names: a wp-config override carries over, saved keys are read under the new names.
define( 'AW_SEO_DESC_MAX', 140 );
require $dir . '/rankweb-constant-names.php';
chk( defined( 'RANKWEB_SEO_DESC_MAX' ) && 140 === RANKWEB_SEO_DESC_MAX, 'wp-config AW_SEO_DESC_MAX carries over to RANKWEB_SEO_DESC_MAX' );
chk( ! defined( 'RANKWEB_FAQ_MAX' ), 'a name not overridden stays undefined' );
$mapped = apply_filters( 'option_aw_seo_settings', array( 'general' => array( 'AW_SEO_DESC_MAX' => 150, 'on' => 1 ), 'search-insights' => array( 'AW_SI_DAYS' => 90 ) ) );
chk( array( 'on' => 1, 'RANKWEB_SEO_DESC_MAX' => 150 ) === $mapped['general'] || array( 'RANKWEB_SEO_DESC_MAX' => 150, 'on' => 1 ) === $mapped['general'], 'saved AW_ keys are read as RANKWEB_ keys' );
chk( array( 'AW_SI_DAYS' => 90 ) === $mapped['search-insights'], 'InsightWeb keys are left alone' );

require $dir . '/news-and-robots.php';
$txt = "User-agent: *\nDisallow: /wp-admin/\n";
chk( $txt === awsite_robots_content_signal( $txt ), 'Content-Signal: off by default' );
$GLOBALS['opts']['aw_seo_settings'] = array( 'RANKWEB_ROBOTS_CONTENT_SIGNAL' => 1 );
chk( false !== strpos( awsite_robots_content_signal( $txt ), "User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=no\n" ), 'Content-Signal: on from the saved setting, under User-agent: *' );
chk( awsite_robots_content_signal( awsite_robots_content_signal( $txt ) ) === awsite_robots_content_signal( $txt ), 'Content-Signal: added once' );
$news = apply_filters( 'robots_txt', "Sitemap: https://animalwrites.in/sitemap_index.xml\n" );
chk( false !== strpos( $news, 'Sitemap: https://animalwrites.in/news-sitemap.xml' ), 'news sitemap line is on by default' );
$GLOBALS['opts']['aw_seo_settings']['RANKWEB_ROBOTS_NEWS_SITEMAP'] = 0;
chk( false === strpos( apply_filters( 'robots_txt', 'x' ), 'news-sitemap' ), 'news sitemap line follows the saved setting' );

require $dir . '/listings.php';
chk( 'IN' === apply_filters( 'rankweb_country_code', '' ) && 'Animal ' === apply_filters( 'rankweb_wording', '', 'dir_adjective' ) && 'x' === apply_filters( 'rankweb_wording', 'x', 'other' ), 'country code and Directory wording' );
chk( isset( apply_filters( 'rankweb_filtered_place_title_words', array() )['state']['aw_news'] ), 'filtered-view title words restored' );
chk( array_keys( (array) apply_filters( 'rankweb_listing_identifier_fields', array( 'aw_registration' => 'Registration' ) ) ) === array( 'aw_registration', 'aw_reg_12a', 'aw_reg_80g', 'aw_fcra', 'aw_darpan_id' ), 'India registers are added to the identifier fields' );
chk( in_array( 'aw_darpan_id', apply_filters( 'rankweb_analysis_excluded_fields', array() ), true ), 'India identifier fields are kept out of the analyzer counts' );
$site = file_get_contents( $dir . '/site.php' );
chk( false !== strpos( $site, "'rankweb_post_type_roles'" ) && false !== strpos( $site, "'press'       => 'aw_press'" ) && false !== strpos( $site, "legacy-aliases.php" ), 'site.php feeds the content type roles and loads the aw_* aliases' );

echo $fails ? "{$fails} failed\n" : "all passed\n";
exit( $fails ? 1 : 0 );
