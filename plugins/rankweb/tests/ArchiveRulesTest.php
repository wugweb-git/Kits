<?php
/**
 * PHPUnit tests for the archive noindex rules (includes/class-rankweb-archive-rules.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-archive-rules.php';

/** Archive rules. */
final class ArchiveRulesTest extends PHPUnit\Framework\TestCase {

	public function testNothingIsNoindexWhenNoRuleIsOn(): void {
		$this->assertFalse( RankWeb_Archive_Rules::noindex( array( 'author' => true, 'date' => true, 'paged' => 4, 'attachment' => true, 'empty_term' => true ), array() ) );
	}

	public function testEachRuleOnlyMatchesItsOwnPages(): void {
		$on = array( 'author' => true );
		$this->assertTrue( RankWeb_Archive_Rules::noindex( array( 'author' => true ), $on ) );
		$this->assertFalse( RankWeb_Archive_Rules::noindex( array( 'date' => true ), $on ) );
		$this->assertTrue( RankWeb_Archive_Rules::noindex( array( 'date' => true ), array( 'date' => true ) ) );
		$this->assertTrue( RankWeb_Archive_Rules::noindex( array( 'attachment' => true ), array( 'attachment' => true ) ) );
		$this->assertTrue( RankWeb_Archive_Rules::noindex( array( 'empty_term' => true ), array( 'empty' => true ) ) );
	}

	public function testPagedStartsAtPageTwo(): void {
		$on = array( 'paged' => true );
		$this->assertFalse( RankWeb_Archive_Rules::noindex( array( 'paged' => 1 ), $on ) );
		$this->assertFalse( RankWeb_Archive_Rules::noindex( array(), $on ) );
		$this->assertTrue( RankWeb_Archive_Rules::noindex( array( 'paged' => 2 ), $on ) );
	}
}
