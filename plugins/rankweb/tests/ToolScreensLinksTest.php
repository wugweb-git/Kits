<?php
/**
 * RankWeb → Internal links on the shell: the audit, anchor-mix and silo routes (includes/link-audit.php,
 * link-anchors.php, silos.php), the silo save and delete functions behind them, and each route's permission. The real
 * files are loaded; WordPress and its database are stubbed.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing, Universal.Files.SeparateFunctionsFromOO, WordPress.DB -- test harness.

require_once __DIR__ . '/tool-stubs.php';

foreach ( array(
	'AW_SILO_MIN'              => 5,
	'AW_SILO_DEPTH'            => 3,
	'AW_SILO_MAX'              => 10,
	'AW_LINK_ANCHOR_EXACT_MAX' => 30,
	'AW_LINK_ANCHOR_TYPE_MAX'  => 60,
	'AW_LINK_ANCHOR_MIN'       => 5,
	'ARRAY_A'                  => 'ARRAY_A',
) as $rw_name => $rw_value ) {
	if ( ! defined( $rw_name ) ) {
		define( $rw_name, $rw_value );
	}
}

/** A small stand-in for $wpdb that keeps the two silo tables and the audit table in memory. */
class RW_Links_Wpdb {
	public $prefix    = 'wp_';
	public $posts     = 'wp_posts';
	public $insert_id = 0;
	public $silos     = array(); // id => array( id, name, hub_id, mode )
	public $items     = array(); // post_id => array( post_id, silo_id, position )
	public $audit     = array(); // rows as the audit query returns them
	public function prepare( $q, ...$args ) {
		return vsprintf( str_replace( array( '%i', '%s', '%d' ), '%s', $q ), $args );
	}
	public function esc_like( $s ) {
		return $s;
	}
	public function get_results( $sql, $out = null ) {
		if ( false !== strpos( $sql, 'wp_aw_silo_items' ) ) {
			return array_values( $this->items );
		}
		if ( false !== strpos( $sql, 'wp_aw_silos' ) ) {
			return array_values( $this->silos );
		}
		if ( false !== strpos( $sql, 'aw_link_audit' ) ) {
			return $this->audit;
		}
		return array();
	}
	public function get_var( $sql ) {
		return count( $this->audit );
	}
	public function insert( $table, $row, $fmt = null ) {
		if ( 'wp_aw_silos' === $table ) {
			$this->insert_id                = count( $this->silos ) + 50;
			$this->silos[ $this->insert_id ] = array( 'id' => $this->insert_id ) + $row;
		} else {
			$this->items[ $row['post_id'] ] = $row;
		}
		return 1;
	}
	public function update( $table, $row, $where, $f = null, $wf = null ) {
		$this->silos[ $where['id'] ] = $row + $this->silos[ $where['id'] ];
		return 1;
	}
	public function delete( $table, $where, $fmt = null ) {
		if ( 'wp_aw_silos' === $table ) {
			unset( $this->silos[ $where['id'] ] );
		} else {
			foreach ( $this->items as $pid => $it ) {
				if ( $it['silo_id'] === $where['silo_id'] ) {
					unset( $this->items[ $pid ] );
				}
			}
		}
		return 1;
	}
}

$GLOBALS['wpdb']                   = new RW_Links_Wpdb();
$GLOBALS['wpdb']->silos[5]         = array( 'id' => 5, 'name' => 'Adoption', 'hub_id' => 100, 'mode' => 'virtual' );
$GLOBALS['wpdb']->items[101]       = array( 'post_id' => 101, 'silo_id' => 5, 'position' => 0 );
$GLOBALS['wpdb']->items[102]       = array( 'post_id' => 102, 'silo_id' => 5, 'position' => 1 );
$GLOBALS['rw_opts']['aw_silo_db']  = '1';
$GLOBALS['rw_opts']['aw_link_audit_db'] = '1';

if ( ! function_exists( 'rankweb_link_table' ) ) {
	function rankweb_link_table( $name ) {
		return 'wp_aw_link_' . $name;
	}
}
if ( ! function_exists( 'get_post' ) ) {
	function get_post( $id ) {
		return $id >= 100 && $id < 300 ? new WP_Post( array( 'ID' => $id ) ) : null;
	}
}
if ( ! function_exists( 'is_post_type_viewable' ) ) {
	function is_post_type_viewable( $t ) {
		return true;
	}
}
if ( ! function_exists( 'get_the_title' ) ) {
	function get_the_title( $id ) {
		return 100 === (int) $id ? '' : 'Title ' . (int) $id;
	}
}
if ( ! function_exists( 'get_permalink' ) ) {
	function get_permalink( $id ) {
		return 'https://example.org/library/p' . (int) $id . '/';
	}
}
if ( ! function_exists( 'get_edit_post_link' ) ) {
	function get_edit_post_link( $id, $ctx = '' ) {
		return 'https://example.org/wp-admin/post.php?post=' . (int) $id;
	}
}
if ( ! function_exists( 'home_url' ) ) {
	function home_url( $p = '' ) {
		return 'https://example.org' . $p;
	}
}
if ( ! function_exists( 'wp_json_encode' ) ) {
	function wp_json_encode( $d, $o = 0, $depth = 512 ) {
		return json_encode( $d, $o, $depth );
	}
}

require_once dirname( __DIR__ ) . '/includes/link-audit.php';
require_once dirname( __DIR__ ) . '/includes/link-anchors.php';
require_once dirname( __DIR__ ) . '/includes/silos.php';

/** The Internal links screen's routes and functions. */
final class ToolScreensLinksTest extends PHPUnit\Framework\TestCase {

	/* The silo data is read once per process (a static memo), so the tests that read it come first and agree on this start: silo 5. */

	public function testPayloadListsTheSilosWithTitlesChecksAndLimits(): void {
		rw_user( true, array( RANKWEB_CAP, 'manage_options' ) );
		$p = rankweb_silo_payload();
		$this->assertCount( 1, $p['silos'] );
		$s = $p['silos'][0];
		$this->assertSame( 5, $s['id'] );
		$this->assertSame( array( 101, 102 ), $s['items'], 'the ID lists GET links/silos always had are kept' );
		$this->assertSame( '(no title)', $s['hub_info']['title'] );
		$this->assertSame( array( 'Title 101', 'Title 102' ), array_column( $s['items_info'], 'title' ) );
		$this->assertSame( 3, $s['checks']['few'], 'three items, fewer than the minimum of five' );
		$this->assertSame( 5, $p['min'] );
		$this->assertSame( 3, $p['depth'] );
		$this->assertTrue( $p['can_edit'] );
		rw_user( true, array( RANKWEB_CAP ) );
		$this->assertFalse( rankweb_silo_payload()['can_edit'] );
	}

	public function testSaveRequestRefusesAnItemAlreadyInAnotherSilo(): void {
		$r = rankweb_silo_save_request( array( 'id' => 0, 'name' => 'New', 'hub' => 100, 'mode' => 'virtual', 'items' => array() ) );
		$this->assertTrue( is_wp_error( $r ) );
		$this->assertStringContainsString( 'already in the silo "Adoption"', $r->get_error_message() );
		$this->assertCount( 1, $GLOBALS['wpdb']->silos, 'nothing was written' );
	}

	public function testSaveRequestNeedsANameAndPublishedItems(): void {
		$r = rankweb_silo_save_request( array( 'name' => '  ', 'hub' => 200 ) );
		$this->assertStringContainsString( 'needs a name', $r->get_error_message() );
		$r = rankweb_silo_save_request( array( 'name' => 'X', 'hub' => 200, 'items' => '201 999' ) );
		$this->assertStringContainsString( 'Item 999 is not a published item', $r->get_error_message() );
		$this->assertCount( 1, $GLOBALS['wpdb']->silos );
	}

	public function testSaveRequestTakesItemsAsTextOrAsAList(): void {
		$r = rankweb_silo_save_request( array( 'silo' => 0, 'name' => ' Dogs ', 'hub' => '200', 'mode' => 'circle', 'items' => "201, 202\n203\n200\n201" ) );
		$this->assertFalse( is_wp_error( $r ) );
		$silo = $GLOBALS['wpdb']->silos[ $r ];
		$this->assertSame( 'Dogs', $silo['name'] );
		$this->assertSame( 200, $silo['hub_id'] );
		$this->assertSame( 'circle', $silo['mode'] );
		$mine = array_filter( $GLOBALS['wpdb']->items, fn( $i ) => $i['silo_id'] === $r );
		$this->assertSame( array( 201, 202, 203 ), array_keys( $mine ), 'the hub and a repeated ID are left out; the order is kept' );
		$this->assertSame( array( 0, 1, 2 ), array_column( array_values( $mine ), 'position' ) );
		$r2 = rankweb_silo_save_request( array( 'id' => 0, 'name' => 'Cats', 'hub' => 210, 'mode' => 'nonsense', 'items' => array( 211, 212 ) ) );
		$this->assertSame( 'virtual', $GLOBALS['wpdb']->silos[ $r2 ]['mode'], 'an unknown mode becomes virtual' );
	}

	public function testRemoveDeletesTheSiloAndItsItemRowsOnly(): void {
		$this->assertTrue( rankweb_silo_remove( 5 ) );
		$this->assertFalse( isset( $GLOBALS['wpdb']->silos[5] ) );
		$this->assertFalse( isset( $GLOBALS['wpdb']->items[101] ) );
	}

	public function testRemoveOfAMissingSiloIsA404(): void {
		$r = rankweb_silo_remove( 4040 );
		$this->assertTrue( is_wp_error( $r ) );
		$this->assertSame( 404, $r->data['status'] );
	}

	public function testAuditPageCarriesEditLinksAndDetail(): void {
		$GLOBALS['wpdb']->audit = array(
			array( 'post_id' => 7, 'links_in' => 0, 'links_out' => 3, 'depth' => 0, 'flags' => ',orphan,', 'detail' => '{"broken":["https://x.test/a"]}', 'post_title' => 'Seven' ),
		);
		$p = rankweb_link_audit_page( '', 1, 25 );
		$this->assertSame( 1, $p['total'] );
		$this->assertSame( 'https://example.org/wp-admin/post.php?post=7', $p['items'][0]['edit'] );
		$this->assertSame( array( 'orphan' ), $p['items'][0]['flags'] );
		$this->assertSame( array( 'https://x.test/a' ), ( (array) $p['items'][0]['detail'] )['broken'] );
	}

	public function testSummaryReadsTheStoredResultAndNoRunningAudit(): void {
		$GLOBALS['rw_opts']['rankweb_link_audit_summary'] = array( 'at' => 99, 'items' => 40, 'flagged' => 3, 'anchor_warn' => 1, 'by' => array( 'orphan' => 2 ) );
		$s = rankweb_link_audit_summary();
		$this->assertSame( 99, $s['at'] );
		$this->assertSame( 2, ( (array) $s['by'] )['orphan'] );
		$this->assertFalse( $s['progress']['running'] );
	}

	public function testAnchorPageListsTargetsWithAWarningFirstLabelsAndLimits(): void {
		$GLOBALS['rw_transients']['aw_seo_anchor_mix'] = array(
			11 => array( 'exact' => 9, 'branded' => 1 ),
			12 => array( 'branded' => 2 ),
		);
		$all = rankweb_anchor_page( false, 1, 25 );
		$this->assertSame( 2, $all['total'] );
		$this->assertSame( 11, $all['items'][0]['post_id'], 'most linked first' );
		$this->assertStringContainsString( 'post=11', $all['items'][0]['edit'] );
		$warn = rankweb_anchor_page( true, 1, 25 );
		$this->assertSame( array( 11 ), array_column( $warn['items'], 'post_id' ), 'only the target over a limit (12 has too few links to be judged)' );
		$this->assertSame( 30, rankweb_anchor_limits()['exact_max'] );
		$this->assertSame( 'Exact', rankweb_anchor_labels()['exact'] );
	}

	public function testTheAuditRoutesAndTheirCapabilities(): void {
		$routes = rw_routes( 'rankweb_link_audit_register_routes' );
		$this->assertSame( array( 'GET /links', 'GET /links/summary', 'POST /links/audit' ), array_keys( $routes ) );
		$this->assertSame( '', rw_matrix( 'GET /links', $routes['GET /links'], RANKWEB_CAP ) );
		$this->assertSame( '', rw_matrix( 'GET /links/summary', $routes['GET /links/summary'], RANKWEB_CAP ) );
		$this->assertSame( '', rw_matrix( 'POST /links/audit', $routes['POST /links/audit'], 'manage_options' ), 'starting an audit is for administrators' );
	}

	public function testTheAnchorRouteNeedsTheMenuCapability(): void {
		$routes = rw_routes( 'rankweb_anchor_register_routes' );
		$this->assertSame( array( 'GET /links/anchors' ), array_keys( $routes ) );
		$this->assertSame( '', rw_matrix( 'GET /links/anchors', $routes['GET /links/anchors'], RANKWEB_CAP ) );
	}

	public function testTheSiloRoutesReadWithTheMenuCapabilityAndChangeAsAdministrator(): void {
		$routes = rw_routes( 'rankweb_silo_register_routes' );
		$this->assertSame( array( 'GET /links/silos', 'POST /links/silos', 'DELETE /links/silos/(?P<id>\d+)' ), array_keys( $routes ) );
		$this->assertSame( '', rw_matrix( 'GET', $routes['GET /links/silos'], RANKWEB_CAP ) );
		$this->assertSame( '', rw_matrix( 'POST', $routes['POST /links/silos'], 'manage_options' ) );
		$this->assertSame( '', rw_matrix( 'DELETE', $routes['DELETE /links/silos/(?P<id>\d+)'], 'manage_options' ) );
	}

	public function testManagingRankWebIsNotEnoughToChangeASilo(): void {
		$routes = rw_routes( 'rankweb_silo_register_routes' );
		rw_user( true, array( RANKWEB_CAP ), 'good' );
		foreach ( array( 'POST /links/silos', 'DELETE /links/silos/(?P<id>\d+)' ) as $key ) {
			$r = rw_can( $routes[ $key ], 'good' );
			$this->assertTrue( is_wp_error( $r ), $key );
			$this->assertSame( 403, $r->data['status'] );
		}
	}
}
