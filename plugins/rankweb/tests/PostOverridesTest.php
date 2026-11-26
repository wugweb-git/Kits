<?php
/**
 * PHPUnit tests for per-item overrides (includes/class-rankweb-post-overrides.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-post-overrides.php';

/** Overrides. */
final class PostOverridesTest extends PHPUnit\Framework\TestCase {

	public function testOnlyHttpAddressesPass(): void {
		$this->assertSame( 'https://example.org/a?b=1', RankWeb_Post_Overrides::clean_url( ' https://example.org/a?b=1 ' ) );
		$this->assertSame( '', RankWeb_Post_Overrides::clean_url( 'javascript:alert(1)' ) );
		$this->assertSame( '', RankWeb_Post_Overrides::clean_url( '/relative' ) );
		$this->assertSame( '', RankWeb_Post_Overrides::clean_url( 'https://exa mple.org' ) );
		$this->assertSame( '', RankWeb_Post_Overrides::clean_url( '' ) );
	}

	public function testARedirectToItselfIsDropped(): void {
		$this->assertSame( '', RankWeb_Post_Overrides::redirect_to( 'https://Example.org/post/', 'https://example.org/post' ) );
		$this->assertSame( 'https://example.org/new/', RankWeb_Post_Overrides::redirect_to( 'https://example.org/new/', 'https://example.org/old/' ) );
		$this->assertSame( '', RankWeb_Post_Overrides::redirect_to( 'nonsense', 'https://example.org/old/' ) );
	}

	public function testFormIsCleanedToMetaKeys(): void {
		$m = RankWeb_Post_Overrides::clean_form( array( 'canonical' => 'https://example.org/c', 'redirect' => 'ftp://x', 'og_image' => 'https://example.org/i.jpg' ) );
		$this->assertSame( 'https://example.org/c', $m['_rankweb_canonical'] );
		$this->assertSame( '', $m['_rankweb_redirect'] );
		$this->assertSame( 'https://example.org/i.jpg', $m['_rankweb_og_image'] );
	}
}
