<?php
/**
 * Tests the standalone share tags (Open Graph and Twitter), built without Rank Math.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing -- PHPUnit naming.

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! class_exists( 'PHPUnit\Framework\TestCase' ) && file_exists( __DIR__ . '/phpunit-lite.php' ) ) {
	require_once __DIR__ . '/phpunit-lite.php';
}
if ( ! function_exists( 'esc_attr' ) ) {
	function esc_attr( $t ) {
		return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' );
	}
}
require_once dirname( __DIR__ ) . '/includes/standalone-head.php';

/** Share tag output. */
final class ShareTagsTest extends PHPUnit\Framework\TestCase {

	private function sample( array $over = array() ): array {
		return array_merge(
			array(
				'type'        => 'article',
				'title'       => 'A "quoted" title',
				'description' => 'Short text.',
				'url'         => 'https://example.org/a/',
				'site_name'   => 'Example',
				'locale'      => 'en_US',
				'image'       => array( 'url' => 'https://example.org/i.jpg', 'width' => 1080, 'height' => 1080, 'type' => 'image/jpeg', 'alt' => 'Alt text' ),
			),
			$over
		);
	}

	public function testPrintsTheCoreTags(): void {
		$h = rankweb_share_tags( $this->sample() );
		$this->assertStringContainsString( '<meta property="og:type" content="article" />', $h );
		$this->assertStringContainsString( '<meta property="og:url" content="https://example.org/a/" />', $h );
		$this->assertStringContainsString( '<meta property="og:image:width" content="1080" />', $h );
		$this->assertStringContainsString( '<meta name="twitter:card" content="summary_large_image" />', $h );
		$this->assertStringContainsString( '<meta name="twitter:image" content="https://example.org/i.jpg" />', $h );
	}

	public function testEscapesValues(): void {
		$h = rankweb_share_tags( $this->sample() );
		$this->assertStringContainsString( 'content="A &quot;quoted&quot; title"', $h );
		$this->assertStringNotContainsString( 'A "quoted"', $h );
	}

	public function testWithoutAnImageTheCardIsSmallAndNoImageTagIsPrinted(): void {
		$h = rankweb_share_tags( $this->sample( array( 'image' => array() ) ) );
		$this->assertStringContainsString( '<meta name="twitter:card" content="summary" />', $h );
		$this->assertStringNotContainsString( 'og:image', $h );
		$this->assertStringNotContainsString( 'twitter:image', $h );
	}

	public function testEmptyValuesAreLeftOut(): void {
		$h = rankweb_share_tags( $this->sample( array( 'description' => '', 'site_name' => '' ) ) );
		$this->assertStringNotContainsString( 'og:description', $h );
		$this->assertStringNotContainsString( 'twitter:description', $h );
		$this->assertStringNotContainsString( 'og:site_name', $h );
	}
}
