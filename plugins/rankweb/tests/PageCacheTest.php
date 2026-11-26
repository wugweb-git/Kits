<?php
/**
 * PHPUnit tests for page cache rules (includes/class-rankweb-page-cache.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-page-cache.php';

/** Page cache. */
final class PageCacheTest extends PHPUnit\Framework\TestCase {

	private function req( array $over = array() ): array {
		return array_merge( array( 'method' => 'GET', 'cookies' => array( 'pll_language' ), 'query' => '', 'path' => '/about/' ), $over );
	}

	public function testPlainGetIsCacheable(): void {
		$this->assertTrue( RankWeb_Page_Cache::cacheable_request( $this->req() ) );
		$this->assertTrue( RankWeb_Page_Cache::cacheable_request( $this->req( array( 'query' => 'utm_source=x&fbclid=1' ) ) ) );
	}

	public function testPersonalOrOddRequestsAreNot(): void {
		$this->assertFalse( RankWeb_Page_Cache::cacheable_request( $this->req( array( 'method' => 'POST' ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::cacheable_request( $this->req( array( 'cookies' => array( 'wordpress_logged_in_abc' ) ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::cacheable_request( $this->req( array( 'cookies' => array( 'woocommerce_items_in_cart' ) ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::cacheable_request( $this->req( array( 'query' => 's=dogs' ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::cacheable_request( $this->req( array( 'path' => '/wp-json/x' ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::cacheable_request( $this->req( array( 'path' => '/feed/' ) ) ) );
	}

	public function testStorablePage(): void {
		$ok = array( 'status' => 200, 'html' => '<html></html>' );
		$this->assertTrue( RankWeb_Page_Cache::storable_page( $ok ) );
		$this->assertFalse( RankWeb_Page_Cache::storable_page( array_merge( $ok, array( 'status' => 404 ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::storable_page( array_merge( $ok, array( 'is_search' => true ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::storable_page( array_merge( $ok, array( 'is_user_logged_in' => true ) ) ) );
		$this->assertFalse( RankWeb_Page_Cache::storable_page( array( 'status' => 200, 'html' => 'partial' ) ) );
		$this->assertFalse( RankWeb_Page_Cache::storable_page( array( 'status' => 200, 'html' => '<html><!-- rankweb-no-cache --></html>' ) ) );
	}

	public function testFileNamesAreHashesAndAgeIsChecked(): void {
		$a = RankWeb_Page_Cache::file_name( 'Example.org', '/a/' );
		$this->assertSame( $a, RankWeb_Page_Cache::file_name( 'example.org', '/a' ) );
		$this->assertTrue( 1 === preg_match( '/^[0-9a-f]{40}\.html$/', RankWeb_Page_Cache::file_name( 'x', '/../../etc/passwd' ) ) );
		$this->assertTrue( RankWeb_Page_Cache::fresh( 1000, 1, 1000 + 3599 ) );
		$this->assertFalse( RankWeb_Page_Cache::fresh( 1000, 1, 1000 + 3600 ) );
		$this->assertFalse( RankWeb_Page_Cache::fresh( 1000, 0, 1001 ) );
	}
}
