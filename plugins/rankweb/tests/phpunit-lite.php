<?php
/**
 * Runs RankWeb's PHPUnit test classes without PHPUnit (the Deploy check has PHP but no Composer packages; owner rule:
 * no local WordPress). A small stand-in for PHPUnit\Framework\TestCase with the assertions the tests use; with real
 * PHPUnit installed, `phpunit plugins/rankweb/tests/` runs the same files.
 *
 * Usage: php plugins/rankweb/tests/phpunit-lite.php
 *
 * @package rankweb
 */

// phpcs:disable -- a command-line test runner.

namespace PHPUnit\Framework;

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( TestCase::class ) ) {
	/** Stand-in for PHPUnit's TestCase. */
	abstract class TestCase {
		public static int $assertions = 0;

		private static function fail_with( string $msg ): void {
			throw new \RuntimeException( $msg );
		}

		public function assertSame( $expected, $actual, string $msg = '' ): void {
			++self::$assertions;
			if ( $expected !== $actual ) {
				self::fail_with( ( $msg ? $msg . "\n" : '' ) . "expected: " . var_export( $expected, true ) . "\n  actual: " . var_export( $actual, true ) );
			}
		}

		public function assertNotSame( $expected, $actual, string $msg = '' ): void {
			++self::$assertions;
			if ( $expected === $actual ) {
				self::fail_with( ( $msg ? $msg . "\n" : '' ) . 'did not expect: ' . var_export( $expected, true ) );
			}
		}

		public function assertCount( int $n, $list, string $msg = '' ): void {
			$this->assertSame( $n, count( $list ), $msg ?: 'count' );
		}

		public function assertTrue( $v, string $msg = '' ): void {
			$this->assertSame( true, $v, $msg );
		}

		public function assertFalse( $v, string $msg = '' ): void {
			$this->assertSame( false, $v, $msg );
		}

		public function assertStringContainsString( string $needle, string $haystack, string $msg = '' ): void {
			$this->assertTrue( false !== strpos( $haystack, $needle ), $msg ?: "contains: {$needle}" );
		}

		public function assertStringNotContainsString( string $needle, string $haystack, string $msg = '' ): void {
			$this->assertTrue( false === strpos( $haystack, $needle ), $msg ?: "does not contain: {$needle}" );
		}
	}
}

$fails = 0;
$count = 0;
foreach ( glob( __DIR__ . '/*Test.php' ) as $file ) {
	$before = get_declared_classes();
	require_once $file;
	foreach ( array_diff( get_declared_classes(), $before ) as $class ) {
		if ( ! is_subclass_of( $class, TestCase::class ) ) {
			continue;
		}
		foreach ( get_class_methods( $class ) as $method ) {
			if ( 0 !== strpos( $method, 'test' ) ) {
				continue;
			}
			++$count;
			try {
				$test = new $class();
				if ( method_exists( $test, 'setUp' ) ) { // PHPUnit calls setUp() (protected) before each test
					$set_up = new \ReflectionMethod( $test, 'setUp' );
					if ( PHP_VERSION_ID < 80100 ) {
						$set_up->setAccessible( true ); // PHP 8.0 refuses a protected method through reflection without this (8.1+ needs nothing, 8.5 deprecates it)
					}
					$set_up->invoke( $test );
				}
				$test->$method();
			} catch ( \Throwable $e ) {
				++$fails;
				echo "FAIL {$class}::{$method}\n  " . $e->getMessage() . "\n";
			}
		}
	}
}
echo ( $fails ? 'FAILED' : 'OK' ) . " ({$count} tests, " . TestCase::$assertions . " assertions, {$fails} failed)\n";
exit( $fails ? 1 : 0 );
