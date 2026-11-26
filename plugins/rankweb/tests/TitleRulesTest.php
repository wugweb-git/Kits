<?php
/**
 * PHPUnit tests for the title separator and prefix (includes/class-rankweb-title-rules.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-title-rules.php';

/** Title rules. */
final class TitleRulesTest extends PHPUnit\Framework\TestCase {

	public function testSeparatorIsFromTheList(): void {
		$this->assertSame( '|', RankWeb_Title_Rules::separator( ' | ' ) );
		$this->assertSame( '–', RankWeb_Title_Rules::separator( '–' ) );
		$this->assertSame( '', RankWeb_Title_Rules::separator( '<script>' ) );
		$this->assertSame( '', RankWeb_Title_Rules::separator( '' ) );
	}

	public function testPrefixIsShortPlainText(): void {
		$this->assertSame( 'Kits', RankWeb_Title_Rules::prefix( ' <b>Kits</b> ' ) );
		$this->assertSame( 40, strlen( RankWeb_Title_Rules::prefix( str_repeat( 'a', 90 ) ) ) );
	}

	public function testPrefixGoesBeforeTheTitleOnce(): void {
		$p = RankWeb_Title_Rules::with_prefix( array( 'title' => 'Adopt', 'site' => 'Site' ), 'Kits:' );
		$this->assertSame( 'Kits: Adopt', $p['title'] );
		$this->assertSame( 'Kits: Adopt', RankWeb_Title_Rules::with_prefix( $p, 'Kits:' )['title'] );
		$this->assertSame( array( 'site' => 'Site' ), RankWeb_Title_Rules::with_prefix( array( 'site' => 'Site' ), 'Kits:' ) );
		$this->assertSame( array( 'title' => 'Adopt' ), RankWeb_Title_Rules::with_prefix( array( 'title' => 'Adopt' ), '' ) );
	}
}
