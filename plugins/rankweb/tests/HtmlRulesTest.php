<?php
/**
 * PHPUnit tests for the HTML and CSS speed rules (includes/class-rankweb-html-rules.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-html-rules.php';

/** HTML rules. */
final class HtmlRulesTest extends PHPUnit\Framework\TestCase {

	public function testDelayHoldsBackOnlyListedPlainScripts(): void {
		$t = '<script src="https://x.test/a.js" id="a-js"></script>';
		$d = RankWeb_Html_Rules::delay_tag( $t, 'a', array( 'a' ) );
		$this->assertSame( '<script type="rankweb/delayed" data-rankweb-src="https://x.test/a.js" id="a-js"></script>', $d );
		$this->assertSame( $t, RankWeb_Html_Rules::delay_tag( $t, 'b', array( 'a' ) ) );
		$mod = '<script type="module" src="a.js"></script>';
		$this->assertSame( $mod, RankWeb_Html_Rules::delay_tag( $mod, 'a', array( 'a' ) ) );
		$this->assertSame( '<script>x()</script>', RankWeb_Html_Rules::delay_tag( '<script>x()</script>', 'a', array( 'a' ) ) );
		$this->assertStringContainsString( 'rankweb/delayed', RankWeb_Html_Rules::delay_loader() );
	}

	public function testMinifyKeepsStringsAndDropsComments(): void {
		$css = "/* hi */\n.a { color : red ; content: \"a  b;  c\" }\n.b,\n.c > .d { margin: 0 }\n";
		$this->assertSame( '.a{color : red;content: "a  b;  c"}.b,.c>.d{margin: 0}', RankWeb_Html_Rules::minify_css( $css ) );
	}

	public function testPruneDropsRulesForNamesNotOnThePage(): void {
		$html = '<div class="card big"><p id="intro">x</p></div>';
		$css  = '.card{a:1}.gone{b:2}.card .gone2,.big{c:3}#intro{d:4}#nope{e:5}p{f:6}.is-open{g:7}[data-x]{h:8}.x:not(.gone){i:9}';
		$out  = RankWeb_Html_Rules::prune_css( $css, $html );
		$this->assertSame( '.card{a:1}.big{c:3}#intro{d:4}p{f:6}.is-open{g:7}[data-x]{h:8}.x:not(.gone){i:9}', $out );
	}

	public function testPruneRecursesIntoMediaAndKeepsOtherAtRules(): void {
		$html = '<div class="card"></div>';
		$css  = '@charset "UTF-8";@media (min-width:600px){.card{a:1}.gone{b:2}}@media print{.gone{b:2}}@font-face{font-family:X;src:url(x.woff2)}@keyframes k{from{a:1}to{a:2}}';
		$this->assertSame( '@charset "UTF-8";@media (min-width:600px){.card{a:1}}@font-face{font-family:X;src:url(x.woff2)}@keyframes k{from{a:1}to{a:2}}', RankWeb_Html_Rules::prune_css( $css, $html ) );
	}

	public function testPruneHonoursTheExtraSafeList(): void {
		$this->assertSame( '.promo-x{a:1}', RankWeb_Html_Rules::prune_css( '.promo-x{a:1}.other{b:1}', '<p></p>', array( 'promo-' ) ) );
	}

	public function testPruneLeavesUnbalancedCssAlone(): void {
		$bad = '.a{color:red';
		$this->assertSame( $bad, RankWeb_Html_Rules::prune_css( $bad, '<p></p>' ) );
	}

	public function testGoogleFontsLinksAndFiles(): void {
		$html = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&amp;display=swap"><link href="https://x.test/a.css">';
		$l    = RankWeb_Html_Rules::google_font_links( $html );
		$this->assertSame( array( 'https://fonts.googleapis.com/css2?family=Inter&display=swap' ), array_values( $l ) );
		$css = "@font-face{src:url(https://fonts.gstatic.com/s/inter/v1/a.woff2) format('woff2')}@font-face{src:url('https://fonts.gstatic.com/s/inter/v1/b.woff2')}@font-face{src:url(https://evil.test/c.woff2)}";
		$this->assertSame( array( 'https://fonts.gstatic.com/s/inter/v1/a.woff2', 'https://fonts.gstatic.com/s/inter/v1/b.woff2' ), RankWeb_Html_Rules::font_files( $css ) );
		$this->assertSame( 'url(/f/1.woff2)', RankWeb_Html_Rules::localize_font_css( 'url(https://fonts.gstatic.com/a.woff2)', array( 'https://fonts.gstatic.com/a.woff2' => '/f/1.woff2' ) ) );
		$this->assertTrue( 1 === preg_match( '/^[0-9a-f]{40}\.woff2$/', RankWeb_Html_Rules::font_name( 'https://fonts.gstatic.com/a.woff2' ) ) );
	}

	public function testWebpSwapOnlyWhereACopyExists(): void {
		$base = 'https://e.org/wp-content/uploads';
		$html = '<img src="' . $base . '/2026/a.jpg" srcset="' . $base . '/2026/a-300.jpg 300w, ' . $base . '/2026/b.png 600w"><i style="background:url(' . $base . '/2026/c.jpeg)"></i>';
		$have = array( $base . '/2026/a.jpg' => true, $base . '/2026/c.jpeg' => true );
		$out  = RankWeb_Html_Rules::swap_webp( $html, $base, static fn( $u ) => isset( $have[ $u ] ) );
		$this->assertStringContainsString( 'src="' . $base . '/2026/a.jpg.webp"', $out );
		$this->assertStringContainsString( $base . '/2026/a-300.jpg 300w', $out );
		$this->assertStringContainsString( $base . '/2026/b.png 600w', $out );
		$this->assertStringContainsString( 'url(' . $base . '/2026/c.jpeg.webp)', $out );
	}
}
