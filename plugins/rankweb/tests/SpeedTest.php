<?php
/**
 * PHPUnit tests for the page-speed helpers (includes/class-rankweb-speed.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-speed.php';

/** Speed rules. */
final class SpeedTest extends PHPUnit\Framework\TestCase {

	public function testDeferOnlyListedScriptsWithASource(): void {
		$tag = '<script src="https://x.test/a.js" id="a-js"></script>';
		$this->assertSame( '<script defer src="https://x.test/a.js" id="a-js"></script>', RankWeb_Speed::defer_tag( $tag, 'a', array( 'a' ) ) );
		$this->assertSame( $tag, RankWeb_Speed::defer_tag( $tag, 'b', array( 'a' ) ) );
		$this->assertSame( '<script>var x=1;</script>', RankWeb_Speed::defer_tag( '<script>var x=1;</script>', 'a', array( 'a' ) ) );
		$async = '<script async src="a.js"></script>';
		$this->assertSame( $async, RankWeb_Speed::defer_tag( $async, 'a', array( 'a' ) ) );
		$mod = '<script type="module" src="a.js"></script>';
		$this->assertSame( $mod, RankWeb_Speed::defer_tag( $mod, 'a', array( 'a' ) ) );
	}

	public function testHandlesAreCleaned(): void {
		$this->assertSame( array( 'jquery-core', 'my_script', 'b' ), RankWeb_Speed::handles( array( ' jquery-core ', 'my_script', '', 'jquery-core', '<b>' ) ) );
		$this->assertSame( array(), RankWeb_Speed::handles( array( '', '  ' ) ) );
	}

	public function testFontsGetDisplaySwapOnce(): void {
		$g = 'https://fonts.googleapis.com/css2?family=Inter:wght@400';
		$this->assertSame( $g . '&display=swap', RankWeb_Speed::font_display( $g ) );
		$this->assertSame( $g . '&display=optional', RankWeb_Speed::font_display( $g . '&display=optional' ) );
		$this->assertSame( 'https://fonts.googleapis.com/css?family=Lato&display=swap', RankWeb_Speed::font_display( 'https://fonts.googleapis.com/css?family=Lato' ) );
		$this->assertSame( 'https://x.test/style.css', RankWeb_Speed::font_display( 'https://x.test/style.css' ) );
	}

	public function testWebpOnlyWhenTheServerCanWriteIt(): void {
		$this->assertSame( array(), RankWeb_Speed::webp_map( array(), false ) );
		$m = RankWeb_Speed::webp_map( array( 'image/gif' => 'image/png' ), true );
		$this->assertSame( 'image/webp', $m['image/jpeg'] );
		$this->assertSame( 'image/webp', $m['image/png'] );
		$this->assertSame( 'image/png', $m['image/gif'] );
	}
}
