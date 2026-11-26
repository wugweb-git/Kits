<?php
/**
 * PHPUnit tests for per-item robots (includes/class-rankweb-robots.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-robots.php';

/** Per-item robots. */
final class RobotsTest extends PHPUnit\Framework\TestCase {

	public function testNothingSetAsksForNothing(): void {
		$item = RankWeb_Robots::from_meta( array() );
		$this->assertFalse( RankWeb_Robots::any( $item ) );
		$this->assertSame( array( 'max-image-preview' => 'large' ), RankWeb_Robots::apply( array( 'max-image-preview' => 'large' ), $item ) );
	}

	public function testFlagsComeFromRankWebFieldsOrRankMathsList(): void {
		$item = RankWeb_Robots::from_meta( array( 'noarchive' => '1' ), 'noindex, nofollow' );
		$this->assertTrue( $item['nofollow'] );
		$this->assertTrue( $item['noarchive'] );
		$this->assertFalse( $item['nosnippet'] );
		$this->assertTrue( RankWeb_Robots::any( $item ) );
	}

	public function testNofollowReplacesFollowAndKeepsNoindex(): void {
		$r = RankWeb_Robots::apply( array( 'noindex' => true, 'follow' => true ), RankWeb_Robots::from_meta( array( 'nofollow' => '1' ) ) );
		$this->assertSame( array( 'noindex' => true, 'nofollow' => true ), $r );
	}

	public function testNosnippetBeatsMaxSnippet(): void {
		$item = RankWeb_Robots::from_meta( array( 'nosnippet' => '1', 'max_snippet' => '50' ) );
		$r    = RankWeb_Robots::apply( array( 'max-snippet' => -1 ), $item );
		$this->assertSame( array( 'nosnippet' => true ), $r );
	}

	public function testMaxSnippetIsCleaned(): void {
		$this->assertSame( 120, RankWeb_Robots::max_snippet( ' 120 ' ) );
		$this->assertSame( -1, RankWeb_Robots::max_snippet( '-1' ) );
		$this->assertSame( 0, RankWeb_Robots::max_snippet( 0 ) );
		$this->assertSame( null, RankWeb_Robots::max_snippet( '' ) );
		$this->assertSame( null, RankWeb_Robots::max_snippet( '-5' ) );
		$this->assertSame( null, RankWeb_Robots::max_snippet( 'abc' ) );
		$r = RankWeb_Robots::apply( array(), RankWeb_Robots::from_meta( array( 'max_snippet' => '0' ) ) );
		$this->assertSame( array( 'max-snippet' => 0 ), $r );
	}
}
