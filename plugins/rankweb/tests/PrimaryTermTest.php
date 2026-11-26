<?php
/**
 * PHPUnit tests for the primary category choice (includes/class-rankweb-primary-term.php). No WordPress.
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

require_once dirname( __DIR__ ) . '/includes/class-rankweb-primary-term.php';

/** Primary term. */
final class PrimaryTermTest extends PHPUnit\Framework\TestCase {

	public function testOnlyAnAssignedCategoryCounts(): void {
		$this->assertSame( 7, RankWeb_Primary_Term::resolve( '7', array( 3, 7 ) ) );
		$this->assertSame( 0, RankWeb_Primary_Term::resolve( '9', array( 3, 7 ) ) );
		$this->assertSame( 0, RankWeb_Primary_Term::resolve( '', array( 3, 7 ) ) );
		$this->assertSame( 0, RankWeb_Primary_Term::resolve( '7', array() ) );
	}

	public function testCleanKeepsPositiveNumbers(): void {
		$this->assertSame( '12', RankWeb_Primary_Term::clean( ' 12 ' ) );
		$this->assertSame( '', RankWeb_Primary_Term::clean( '-3' ) );
		$this->assertSame( '', RankWeb_Primary_Term::clean( 'abc' ) );
	}
}
