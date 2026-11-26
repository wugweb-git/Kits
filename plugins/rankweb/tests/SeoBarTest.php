<?php
/**
 * PHPUnit tests for the SEO Bar checks (includes/class-rankweb-seo-bar.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-seo-bar.php';

/** The SEO Bar. */
final class SeoBarTest extends PHPUnit\Framework\TestCase {

	private function status( array $checks, string $key ): string {
		foreach ( $checks as $c ) {
			if ( $key === $c['key'] ) {
				return $c['status'];
			}
		}
		return '';
	}

	public function testAnItemWithNothingIsBad(): void {
		$c = RankWeb_Seo_Bar::checks( array() );
		$this->assertSame( 'bad', $this->status( $c, 'title' ) );
		$this->assertSame( 'bad', $this->status( $c, 'description' ) );
		$this->assertSame( 'warn', $this->status( $c, 'focus' ) );
		$this->assertSame( 'bad', RankWeb_Seo_Bar::worst( $c ) );
	}

	public function testTheItemsOwnTitleIsUsedWhenThereIsNoSeoTitle(): void {
		$c = RankWeb_Seo_Bar::checks( array( 'post_title' => 'How to help a stray dog in the monsoon' ) );
		$this->assertSame( 'good', $this->status( $c, 'title' ) );
	}

	public function testLengthsAreFlagged(): void {
		$long = str_repeat( 'a', 61 );
		$c    = RankWeb_Seo_Bar::checks( array( 'title' => $long, 'description' => str_repeat( 'b', 161 ) ) );
		$this->assertSame( 'warn', $this->status( $c, 'title' ) );
		$this->assertSame( 'warn', $this->status( $c, 'description' ) );
		$c = RankWeb_Seo_Bar::checks( array( 'title' => 'Short', 'description' => 'Short' ) );
		$this->assertSame( 'warn', $this->status( $c, 'title' ) );
		$this->assertSame( 'warn', $this->status( $c, 'description' ) );
	}

	public function testTheFocusKeywordMustBeInTheTitle(): void {
		$in = array( 'title' => 'Stray dog rescue guide for the monsoon', 'description' => str_repeat( 'x', 100 ), 'focus' => 'Stray Dog, rescue' );
		$this->assertSame( 'good', $this->status( RankWeb_Seo_Bar::checks( $in ), 'focus' ) );
		$in['focus'] = 'cat adoption';
		$this->assertSame( 'warn', $this->status( RankWeb_Seo_Bar::checks( $in ), 'focus' ) );
	}

	public function testAllGoodAndNoindexAndSlug(): void {
		$in = array( 'title' => 'Stray dog rescue guide for the monsoon', 'description' => str_repeat( 'x', 100 ), 'focus' => 'stray dog', 'slug' => 'a' );
		$c  = RankWeb_Seo_Bar::checks( $in );
		$this->assertSame( 'good', RankWeb_Seo_Bar::worst( $c ) );
		$this->assertSame( 3, RankWeb_Seo_Bar::counts( $c )['good'] );
		$in['noindex'] = true;
		$in['slug']    = str_repeat( 's', 80 );
		$c             = RankWeb_Seo_Bar::checks( $in );
		$this->assertSame( 'warn', $this->status( $c, 'noindex' ) );
		$this->assertSame( 'warn', $this->status( $c, 'slug' ) );
		$this->assertSame( 'warn', RankWeb_Seo_Bar::worst( $c ) );
	}

	public function testInputForATermOrUser(): void {
		$in = RankWeb_Seo_Bar::input_for(
			array( 'title' => '', 'description' => '', 'focus' => 'rescue', 'robots' => array( 'index', 'noindex' ) ),
			array( 'name' => 'Rescue stories from the monsoon', 'description' => str_repeat( 'd', 90 ), 'slug' => 'rescue' )
		);
		$this->assertSame( 'Rescue stories from the monsoon', $in['post_title'] );
		$this->assertSame( str_repeat( 'd', 90 ), $in['description'] );
		$this->assertTrue( $in['noindex'] );
		$c = RankWeb_Seo_Bar::checks( $in );
		$this->assertSame( 'good', $this->status( $c, 'title' ) );
		$this->assertSame( 'good', $this->status( $c, 'description' ) );
		$this->assertSame( 'warn', $this->status( $c, 'noindex' ) );
		$own = RankWeb_Seo_Bar::input_for( array( 'description' => 'Own text', 'robots' => 'index,follow' ), array( 'description' => 'Fallback' ) );
		$this->assertSame( 'Own text', $own['description'] );
		$this->assertFalse( $own['noindex'] );
	}
}
