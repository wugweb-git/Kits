<?php
/**
 * PHPUnit tests for WebP copy planning (includes/class-rankweb-webp.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-webp.php';

/** WebP planning. */
final class WebpTest extends PHPUnit\Framework\TestCase {

	public function testFilesAreTheOriginalAndItsSizes(): void {
		$f = RankWeb_Webp::files( '/up/2026/a.jpg', array( 'thumbnail' => array( 'file' => 'a-150.jpg' ), 'large' => array( 'file' => 'a-1024.jpg' ), 'bad' => array( 'file' => '../x.jpg' ), 'gif' => array( 'file' => 'a.gif' ) ) );
		$this->assertSame( array( '/up/2026/a.jpg', '/up/2026/a-150.jpg', '/up/2026/a-1024.jpg' ), $f );
		$this->assertSame( array(), RankWeb_Webp::files( '/up/a.gif', array() ) );
		$this->assertSame( array(), RankWeb_Webp::files( '', array() ) );
	}

	public function testMissingSkipsGoneFilesAndExistingCopies(): void {
		$have = array( '/u/a.jpg' => 1, '/u/b.jpg' => 1, '/u/b.jpg.webp' => 1 );
		$m    = RankWeb_Webp::missing( array( '/u/a.jpg', '/u/b.jpg', '/u/c.jpg' ), static fn( $p ) => isset( $have[ $p ] ) );
		$this->assertSame( array( '/u/a.jpg' ), $m );
	}
}
