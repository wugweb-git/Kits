<?php
/**
 * PHPUnit tests for the image sitemap (includes/class-rankweb-image-sitemap.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-image-sitemap.php';

/** The image sitemap. */
final class ImageSitemapTest extends PHPUnit\Framework\TestCase {

	public function testExtractResolvesDedupesAndSkips(): void {
		$html = '<p><img src="/wp-content/a.jpg" alt="a"><img class="x" src=\'https://cdn.example.com/b.png?x=1&amp;y=2\'>'
			. '<img src="/wp-content/a.jpg"><img src="data:image/gif;base64,AAA"><img src="//cdn.example.com/c.webp">'
			. '<img src="/pixel.gif" width="1" height="1"><img src="relative.jpg"><img alt="none"></p>';
		$this->assertSame(
			array( 'https://example.com/wp-content/a.jpg', 'https://cdn.example.com/b.png?x=1&y=2', 'https://cdn.example.com/c.webp' ),
			RankWeb_Image_Sitemap::extract( $html, 'https://example.com/' )
		);
	}

	public function testXmlListsPagesWithImagesOnly(): void {
		$xml = RankWeb_Image_Sitemap::xml(
			array(
				array( 'loc' => 'https://example.com/a/', 'lastmod' => '2026-11-01T10:00:00+00:00', 'images' => array( 'https://example.com/a.jpg?x=1&y=2', 'https://example.com/a.jpg?x=1&y=2' ) ),
				array( 'loc' => 'https://example.com/none/', 'images' => array() ),
			)
		);
		$this->assertStringContainsString( 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"', $xml );
		$this->assertStringContainsString( '<image:loc>https://example.com/a.jpg?x=1&amp;y=2</image:loc>', $xml );
		$this->assertSame( 1, substr_count( $xml, '<image:image>' ), 'a repeat is written once' );
		$this->assertSame( 1, substr_count( $xml, '<url>' ) );
		$this->assertStringContainsString( '<lastmod>2026-11-01T10:00:00+00:00</lastmod>', $xml );
	}

	public function testAPageIsCappedAtGoogleLimit(): void {
		$imgs = array();
		for ( $i = 0; $i < 1005; $i++ ) {
			$imgs[] = "https://example.com/i$i.jpg";
		}
		$xml = RankWeb_Image_Sitemap::xml( array( array( 'loc' => 'https://example.com/', 'images' => $imgs ) ) );
		$this->assertSame( 1000, substr_count( $xml, '<image:image>' ) );
	}
}
