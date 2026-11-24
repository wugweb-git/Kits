<?php
/**
 * Tests for includes/standalone-seo.php: who owns the head, the site-default seam, the schema type RankWeb can write,
 * and the description helpers. The real file is loaded; WordPress functions are stubbed.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing, Universal.Files.SeparateFunctionsFromOO -- test harness.

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! class_exists( 'PHPUnit\Framework\TestCase' ) && file_exists( __DIR__ . '/phpunit-lite.php' ) ) {
	require_once __DIR__ . '/phpunit-lite.php';
}

$GLOBALS['rw_filters'] = array();
$GLOBALS['rw_meta']    = array();
$GLOBALS['rw_info']    = array( 'name' => 'Example Site', 'description' => 'A tagline' );

if ( ! function_exists( 'add_filter' ) ) {
	function add_filter( $tag, $fn, $prio = 10, $args = 1 ) { // phpcs:ignore
		$GLOBALS['rw_filters'][ $tag ][] = $fn;
		return true;
	}
}
if ( ! function_exists( 'add_action' ) ) {
	function add_action( $tag, $fn, $prio = 10, $args = 1 ) { // phpcs:ignore
		return add_filter( $tag, $fn, $prio, $args );
	}
}
if ( ! function_exists( 'apply_filters' ) ) {
	function apply_filters( $tag, $value, ...$rest ) { // phpcs:ignore
		foreach ( $GLOBALS['rw_filters'][ $tag ] ?? array() as $fn ) {
			$value = $fn( $value, ...$rest );
		}
		return $value;
	}
}
if ( ! function_exists( 'get_bloginfo' ) ) {
	function get_bloginfo( $what = '' ) { // phpcs:ignore
		return $GLOBALS['rw_info'][ $what ] ?? '';
	}
}
if ( ! function_exists( 'wp_specialchars_decode' ) ) {
	function wp_specialchars_decode( $s, $q = 0 ) { // phpcs:ignore
		return $s;
	}
}
if ( ! function_exists( 'get_locale' ) ) {
	function get_locale() { // phpcs:ignore
		return 'en_GB';
	}
}
if ( ! function_exists( 'get_post_meta' ) ) {
	function get_post_meta( $id, $key, $single = false ) { // phpcs:ignore
		return $GLOBALS['rw_meta'][ $id ][ $key ] ?? '';
	}
}
if ( ! function_exists( 'aw_seo_extras_rank_math' ) ) {
	function aw_seo_extras_rank_math() { // phpcs:ignore
		return ! empty( $GLOBALS['rw_rank_math'] );
	}
}

require_once dirname( __DIR__ ) . '/includes/standalone-seo.php';

/** Standalone SEO module. */
final class StandaloneSeoTest extends PHPUnit\Framework\TestCase {

	public function testNoOtherSeoPluginMeansRankWebPrintsTheHead(): void {
		$GLOBALS['rw_rank_math'] = false;
		$this->assertSame( 'none', rankweb_seo_owner() );
		$this->assertTrue( rankweb_prints_head() );
	}

	public function testRankMathOwnsTheHeadWhenActive(): void {
		$GLOBALS['rw_rank_math'] = true;
		$this->assertSame( 'rank_math', rankweb_seo_owner() );
		$this->assertFalse( rankweb_prints_head() );
		$GLOBALS['rw_rank_math'] = false;
	}

	public function testSiteDefaultsAreGenericAndSettable(): void {
		$this->assertSame( 'en-GB', rankweb_language(), 'language comes from the WordPress locale, not a country' );
		$this->assertSame( array(), rankweb_site_default( 'same_as', array() ) );
		$this->assertSame( '', rankweb_site_default( 'email', '' ) );
		add_filter( 'rankweb_site_default_email', fn() => 'hello@example.org' );
		$this->assertSame( 'hello@example.org', rankweb_site_default( 'email', '' ) );
		$GLOBALS['rw_filters'] = array();
	}

	public function testSiteNameIsTheSitesOwn(): void {
		$this->assertSame( 'Example Site', rankweb_site_name() );
	}

	public function testOnlyTypesPhpCanWriteAreOffered(): void {
		$this->assertSame( array( 'Article', 'BlogPosting', 'NewsArticle', 'WebPage' ), rankweb_schema_types() );
		$GLOBALS['rw_meta'][7]['_rankweb_schema_type'] = 'Event';
		$this->assertSame( '', rankweb_post_schema_type( 7 ), 'a type PHP cannot emit is ignored' );
		$GLOBALS['rw_meta'][7]['_rankweb_schema_type'] = 'NewsArticle';
		$this->assertSame( 'NewsArticle', rankweb_post_schema_type( 7 ) );
	}

	public function testChosenSchemaTypeChangesAnArticleNode(): void {
		$GLOBALS['rw_meta'][8]['_rankweb_schema_type'] = 'BlogPosting';
		$nodes = rankweb_apply_schema_type( array( array( '@type' => 'Article', 'headline' => 'H' ), array( '@type' => 'BreadcrumbList' ) ), 8 );
		$this->assertSame( 'BlogPosting', $nodes[0]['@type'] );
		$this->assertSame( 'BreadcrumbList', $nodes[1]['@type'], 'other nodes are left alone' );
		$GLOBALS['rw_meta'][9]['_rankweb_schema_type'] = 'WebPage';
		$same = rankweb_apply_schema_type( array( array( '@type' => 'Article' ) ), 9 );
		$this->assertSame( 'Article', $same[0]['@type'], 'WebPage never turns an article into a page' );
		$none = rankweb_apply_schema_type( array( array( '@type' => 'Article' ) ), 10 );
		$this->assertSame( 'Article', $none[0]['@type'], 'no choice, no change' );
	}

	public function testOwnDescriptionWinsAndTaglineCopyIsIgnored(): void {
		$GLOBALS['rw_meta'][11]['_rankweb_description'] = 'Written by hand.';
		$this->assertSame( 'Written by hand.', rankweb_post_seo_field( 11, 'description' ) );
		$GLOBALS['rw_meta'][12]['rank_math_description'] = 'A tagline'; // what auto-fill once copied into every post
		$this->assertSame( '', rankweb_post_seo_field( 12, 'description' ) );
		$GLOBALS['rw_meta'][13]['rank_math_description'] = 'Kept from Rank Math.';
		$this->assertSame( 'Kept from Rank Math.', rankweb_post_seo_field( 13, 'description' ), "a site that leaves Rank Math keeps what it wrote" );
	}

	public function testCutTextEndsAtAWordWithAnEllipsis(): void {
		$long = str_repeat( 'dogs need water and shade ', 12 );
		$cut  = rankweb_cut_text( $long, 160 );
		$this->assertTrue( mb_strlen( $cut ) <= 160 );
		$this->assertTrue( '…' === mb_substr( $cut, -1 ) );
		$this->assertSame( 'Short text.', rankweb_cut_text( 'Short text.', 160 ) );
	}
}
