<?php
/**
 * PHPUnit tests for verification tags and crawler rules (includes/class-rankweb-site-tags.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-site-tags.php';

/** Site tags. */
final class SiteTagsTest extends PHPUnit\Framework\TestCase {

	public function testACodeOrAWholeTagGivesTheSameTag(): void {
		$esc  = static fn( $s ) => htmlspecialchars( $s, ENT_QUOTES );
		$a    = RankWeb_Site_Tags::verify_tags( array( 'google' => 'abc123_-X' ), $esc );
		$b    = RankWeb_Site_Tags::verify_tags( array( 'google' => '<meta name="google-site-verification" content="abc123_-X" />' ), $esc );
		$this->assertSame( $a, $b );
		$this->assertSame( array( '<meta name="google-site-verification" content="abc123_-X" />' ), $a );
	}

	public function testEmptyAndHostileCodesPrintNothingHarmful(): void {
		$esc = static fn( $s ) => $s;
		$this->assertSame( array(), RankWeb_Site_Tags::verify_tags( array( 'google' => '', 'bing' => '   ' ), $esc ) );
		$t = RankWeb_Site_Tags::verify_tags( array( 'bing' => 'x"><script>alert(1)</script>' ), $esc );
		$this->assertSame( array( '<meta name="msvalidate.01" content="xscriptalert1script" />' ), $t );
	}

	public function testCrawlersAreAddedOnceAndExistingGroupsKept(): void {
		$txt = "User-agent: *\nDisallow: /wp-admin/\n\nUser-agent: GPTBot\nDisallow: /private/\n";
		$out = RankWeb_Site_Tags::robots( $txt, array( 'GPTBot', 'ClaudeBot', 'ClaudeBot', 'bad name', '' ) );
		$this->assertSame( 1, substr_count( $out, 'User-agent: GPTBot' ) );
		$this->assertSame( 1, substr_count( $out, 'User-agent: ClaudeBot' ) );
		$this->assertTrue( false !== strpos( $out, "User-agent: ClaudeBot\nDisallow: /" ) );
		$this->assertTrue( false === strpos( $out, 'bad name' ) );
		$this->assertSame( $txt, RankWeb_Site_Tags::robots( $txt, array() ) );
	}
}
