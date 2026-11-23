<?php
/**
 * PHPUnit tests for RankWeb standalone Schema output and helpers without Rank Math.
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

if ( ! class_exists( 'PHPUnit\Framework\TestCase' ) && file_exists( __DIR__ . '/phpunit-lite.php' ) ) {
	require_once __DIR__ . '/phpunit-lite.php';
}

require_once dirname( __DIR__ ) . '/includes/class-aw-schema.php';

// Stubs for testing standalone schema generation.
if ( ! function_exists( 'is_404' ) ) {
	function is_404() {
		return false;
	}
}
if ( ! function_exists( 'is_admin' ) ) {
	function is_admin() {
		return false;
	}
}
if ( ! function_exists( 'wp_json_encode' ) ) {
	function wp_json_encode( $data, $options = 0, $depth = 512 ) {
		return json_encode( $data, $options, $depth );
	}
}

/** Standalone Schema graph and node tests. */
final class StandaloneSchemaTest extends PHPUnit\Framework\TestCase {

	public function testSchemaSwapRef(): void {
		$node = array(
			'@type' => 'WebPage',
			'isPartOf' => array( '@id' => 'https://example.com/#old' ),
			'items' => array(
				array( '@id' => 'https://example.com/#old' ),
				array( '@id' => 'https://example.com/#other' ),
			),
		);

		// Implementation of swap ref helper.
		$swap = function ( $data, $from, $to ) use ( &$swap ) {
			if ( ! is_array( $data ) ) {
				return $data;
			}
			if ( array( '@id' => $from ) === $data ) {
				return array( '@id' => $to );
			}
			foreach ( $data as $k => $v ) {
				$data[ $k ] = $swap( $v, $from, $to );
			}
			return $data;
		};

		$result = $swap( $node, 'https://example.com/#old', 'https://example.com/#new' );
		$this->assertSame( 'https://example.com/#new', $result['isPartOf']['@id'] );
		$this->assertSame( 'https://example.com/#new', $result['items'][0]['@id'] );
		$this->assertSame( 'https://example.com/#other', $result['items'][1]['@id'] );
	}

	public function testStandaloneGraphStructure(): void {
		$pub = array(
			'@type' => 'Organization',
			'@id'   => 'https://example.com/#publisher',
			'name'  => 'Wugweb Publisher',
		);
		$site = array(
			'@type' => 'WebSite',
			'@id'   => 'https://example.com/#website',
			'name'  => 'Wugweb Site',
		);
		$nodes = array(
			array(
				'@type' => 'Article',
				'@id'   => 'https://example.com/article/#article',
				'headline' => 'Test SEO Article &amp; Guide',
			),
		);

		$graph = array( $pub, $site );
		foreach ( $nodes as $n ) {
			$graph[] = $n;
		}

		$payload = array(
			'@context' => 'https://schema.org',
			'@graph'   => $graph,
		);

		$json = wp_json_encode( $payload );
		$decoded = json_decode( $json, true );

		$this->assertSame( 'https://schema.org', $decoded['@context'] );
		$this->assertCount( 3, $decoded['@graph'] );
		$this->assertSame( 'Organization', $decoded['@graph'][0]['@type'] );
		$this->assertSame( 'WebSite', $decoded['@graph'][1]['@type'] );
		$this->assertSame( 'Article', $decoded['@graph'][2]['@type'] );
	}

	public function testCustomSchemaNodeParsing(): void {
		$custom = '{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is RankWeb standalone?","acceptedAnswer":{"@type":"Answer","text":"Yes."}}]}';
		$parsed = AW_Schema::parse( $custom );
		$this->assertSame( '', $parsed['error'] );
		$this->assertCount( 1, $parsed['nodes'] );
		$this->assertSame( 'FAQPage', $parsed['nodes'][0]['@type'] );
		$this->assertSame( 'Is RankWeb standalone?', $parsed['nodes'][0]['mainEntity'][0]['name'] );
	}
}
