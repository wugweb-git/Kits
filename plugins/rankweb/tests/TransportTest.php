<?php
/**
 * PHPUnit tests for Transport (includes/class-rankweb-transport.php). No WordPress.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing -- PHPUnit naming.

if ( ! defined( 'ABSPATH' ) && 'cli' !== PHP_SAPI ) {
	exit;
}
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once dirname( __DIR__ ) . '/includes/class-rankweb-transport.php';

/** Transport. */
final class TransportTest extends PHPUnit\Framework\TestCase {

	public function testYoastFieldsAndRobots(): void {
		$r = RankWeb_Transport::read(
			'yoast',
			array(
				'_yoast_wpseo_title'                => 'Stray dog rescue',
				'_yoast_wpseo_metadesc'             => 'How to help.',
				'_yoast_wpseo_focuskw'              => 'stray dog',
				'_yoast_wpseo_meta-robots-noindex'  => '1',
				'_yoast_wpseo_meta-robots-nofollow' => '2',
				'_yoast_wpseo_meta-robots-adv'      => 'noimageindex, noarchive',
			)
		);
		$this->assertSame( 'Stray dog rescue', $r['title'] );
		$this->assertSame( 'stray dog', $r['focus'] );
		$this->assertSame( '1', $r['noindex'] );
		$this->assertSame( '', $r['nofollow'] );
		$this->assertSame( '1', $r['noarchive'] );
		$this->assertSame( '', $r['nosnippet'] );
	}

	public function testTemplatesAreSkipped(): void {
		$r = RankWeb_Transport::read( 'yoast', array( '_yoast_wpseo_title' => '%%title%% %%sep%% %%sitename%%', '_yoast_wpseo_metadesc' => 'Real text' ) );
		$this->assertSame( '', $r['title'] );
		$this->assertSame( 'Real text', $r['description'] );
		$this->assertTrue( RankWeb_Transport::is_template( '%title% %sep%' ) );
		$this->assertFalse( RankWeb_Transport::is_template( '100% sure' ) );
	}

	public function testRankMathReadsRobotsAndMaxSnippetOnly(): void {
		$r = RankWeb_Transport::read(
			'rankmath',
			array(
				'rank_math_title'           => 'x',
				'rank_math_robots'          => array( 'noindex', 'nosnippet' ),
				'rank_math_advanced_robots' => array( 'max-snippet' => '-1' ),
			)
		);
		$this->assertSame( '', $r['title'] );
		$this->assertSame( '1', $r['noindex'] );
		$this->assertSame( '1', $r['nosnippet'] );
		$this->assertSame( '-1', $r['max_snippet'] );
	}

	public function testAioseoRowAndOldMeta(): void {
		$r = RankWeb_Transport::read(
			'aioseo',
			array(
				'row_title'            => 'A title',
				'row_keyphrases'       => '{"focus":{"keyphrase":"adopt a dog"}}',
				'row_robots_default'   => '0',
				'row_robots_noindex'   => '1',
				'row_robots_max_snippet' => '0',
			)
		);
		$this->assertSame( 'A title', $r['title'] );
		$this->assertSame( 'adopt a dog', $r['focus'] );
		$this->assertSame( '1', $r['noindex'] );
		$this->assertSame( '', $r['max_snippet'] );
		$old = RankWeb_Transport::read( 'aioseo', array( '_aioseop_title' => 'Old', '_aioseop_keywords' => 'one, two' ) );
		$this->assertSame( 'Old', $old['title'] );
		$this->assertSame( 'one', $old['focus'] );
		$def = RankWeb_Transport::read( 'aioseo', array( 'row_robots_default' => '1', 'row_robots_noindex' => '1' ) );
		$this->assertSame( '', $def['noindex'] );
	}

	public function testAFilledFieldIsNeverOverwritten(): void {
		$in   = array( 'title' => 'New', 'description' => 'New desc', 'noindex' => '1', 'focus' => '' );
		$plan = RankWeb_Transport::plan( $in, array( 'title' => 'Mine', 'description' => '' ) );
		$this->assertSame( array( 'description' => 'New desc', 'noindex' => '1' ), $plan['write'] );
		$this->assertSame( array( 'title' ), $plan['kept'] );
	}

	public function testTallyCountsFieldsAndKept(): void {
		$a = RankWeb_Transport::plan( array( 'title' => 'T', 'focus' => 'f' ), array() );
		$b = RankWeb_Transport::plan( array( 'title' => 'T' ), array( 'title' => 'x' ) );
		$c = RankWeb_Transport::plan( array(), array() );
		$t = RankWeb_Transport::tally( array( $a, $b, $c ) );
		$this->assertSame( 3, $t['items'] );
		$this->assertSame( 1, $t['changed'] );
		$this->assertSame( 1, $t['fields']['title'] );
		$this->assertSame( 1, $t['fields']['focus'] );
		$this->assertSame( 1, $t['kept'] );
	}

	public function testSeoPressAndTheSeoFramework(): void {
		$s = RankWeb_Transport::read( 'seopress', array( '_seopress_titles_title' => 'SP title', '_seopress_titles_desc' => '%%post_excerpt%%', '_seopress_analysis_target_kw' => 'dog, cat', '_seopress_robots_index' => 'yes', '_seopress_robots_snippet' => 'yes', '_seopress_robots_follow' => '' ) );
		$this->assertSame( 'SP title', $s['title'] );
		$this->assertSame( '', $s['description'] );
		$this->assertSame( 'dog', $s['focus'] );
		$this->assertSame( '1', $s['noindex'] );
		$this->assertSame( '1', $s['nosnippet'] );
		$this->assertSame( '', $s['nofollow'] );
		$t = RankWeb_Transport::read( 'tsf', array( '_genesis_title' => 'T', '_genesis_noindex' => '1', '_genesis_nofollow' => '-1' ) );
		$this->assertSame( 'T', $t['title'] );
		$this->assertSame( '1', $t['noindex'] );
		$this->assertSame( '', $t['nofollow'] );
		$this->assertSame( '', $t['focus'] );
		$this->assertTrue( isset( RankWeb_Transport::sources()['seopress'], RankWeb_Transport::sources()['tsf'] ) );
	}
}
