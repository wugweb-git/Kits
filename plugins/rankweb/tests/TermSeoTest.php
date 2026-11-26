<?php
/**
 * PHPUnit tests for term SEO values (includes/class-rankweb-term-seo.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-term-seo.php';

/** Term SEO. */
final class TermSeoTest extends PHPUnit\Framework\TestCase {

	public function testOwnValuesWinAndRankMathFillsGaps(): void {
		$r = RankWeb_Term_Seo::resolve( array( 'title' => 'Mine' ), array( 'title' => 'Theirs', 'description' => 'Their text', 'robots' => array( 'index' ) ) );
		$this->assertSame( 'Mine', $r['title'] );
		$this->assertSame( 'Their text', $r['description'] );
		$this->assertFalse( $r['noindex'] );
	}

	public function testNoindexFromEitherPlugin(): void {
		$this->assertTrue( RankWeb_Term_Seo::resolve( array( 'noindex' => '1' ), array() )['noindex'] );
		$this->assertTrue( RankWeb_Term_Seo::resolve( array(), array( 'robots' => array( 'noindex', 'nofollow' ) ) )['noindex'] );
		$this->assertTrue( RankWeb_Term_Seo::resolve( array(), array( 'robots' => 'noindex' ) )['noindex'] );
		$this->assertFalse( RankWeb_Term_Seo::resolve( array(), array() )['noindex'] );
	}

	public function testFormIsCleaned(): void {
		$m = RankWeb_Term_Seo::clean_form( array( 'title' => " <b>Rescue</b>\n stories ", 'description' => 'x', 'noindex' => 'on' ) );
		$this->assertSame( 'Rescue stories', $m['_rankweb_term_title'] );
		$this->assertSame( '1', $m['_rankweb_term_noindex'] );
		$this->assertSame( '', RankWeb_Term_Seo::clean_form( array() )['_rankweb_term_noindex'] );
	}
}
