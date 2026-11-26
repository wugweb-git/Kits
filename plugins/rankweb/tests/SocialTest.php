<?php
/**
 * PHPUnit tests for social and feed helpers (includes/class-rankweb-social.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-social.php';

/** Social helpers. */
final class SocialTest extends PHPUnit\Framework\TestCase {

	public function testHandleForms(): void {
		$this->assertSame( '@animalwrites', RankWeb_Social::handle( 'animalwrites' ) );
		$this->assertSame( '@animalwrites', RankWeb_Social::handle( ' @animalwrites ' ) );
		$this->assertSame( '@animal_w', RankWeb_Social::handle( 'https://x.com/animal_w/' ) );
		$this->assertSame( '@name', RankWeb_Social::handle( 'https://twitter.com/name' ) );
		$this->assertSame( '', RankWeb_Social::handle( 'not a handle' ) );
		$this->assertSame( '', RankWeb_Social::handle( 'waytoolonghandlenamehere' ) );
		$this->assertSame( '', RankWeb_Social::handle( '' ) );
	}

	public function testFeedLineEscapesThroughTheCallback(): void {
		$esc  = static fn( $v, $k ) => 'url' === $k ? 'U(' . $v . ')' : htmlspecialchars( $v, ENT_QUOTES );
		$line = RankWeb_Social::feed_line( 'A & B', 'https://e.org/p', 'My <Site>', 'https://e.org', $esc );
		$this->assertSame( '<p>The post <a href="U(https://e.org/p)">A &amp; B</a> appeared first on <a href="U(https://e.org)">My &lt;Site&gt;</a>.</p>', $line );
	}
}
