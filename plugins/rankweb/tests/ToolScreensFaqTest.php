<?php
/**
 * RankWeb → FAQ on the shell: the functions its REST routes call (includes/faq-overview.php) and each route's permission.
 * The real file is loaded; the rest of WordPress and of the FAQ module is stubbed.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing, Universal.Files.SeparateFunctionsFromOO -- test harness.

require_once __DIR__ . '/tool-stubs.php';

$GLOBALS['rw_faq_items'] = array(); // 'post:12' => rows, what the stubbed FAQ box holds
$GLOBALS['rw_faq_saved'] = array();

if ( ! function_exists( 'rankweb_faq_items' ) ) {
	function rankweb_faq_items( $store, $id ) {
		return $GLOBALS['rw_faq_items'][ $store . ':' . $id ] ?? array();
	}
}
if ( ! function_exists( 'rankweb_faq_items_save' ) ) {
	function rankweb_faq_items_save( $store, $id, array $rows ) {
		$GLOBALS['rw_faq_saved'][ $store . ':' . $id ] = $rows;
		$GLOBALS['rw_faq_items'][ $store . ':' . $id ] = $rows;
	}
}
if ( ! function_exists( 'rankweb_faq_registry' ) ) {
	function rankweb_faq_registry() {
		return array();
	}
}
if ( ! function_exists( 'rankweb_faq_post_types' ) ) {
	function rankweb_faq_post_types() {
		return array();
	}
}
if ( ! function_exists( 'rankweb_faq_taxonomies' ) ) {
	function rankweb_faq_taxonomies() {
		return array();
	}
}
if ( ! function_exists( 'rankweb_faq_off_types' ) ) {
	function rankweb_faq_off_types() {
		return array( 'page' );
	}
}

require_once dirname( __DIR__ ) . '/includes/faq-overview.php';

/** The FAQ screen's functions and routes. */
final class ToolScreensFaqTest extends PHPUnit\Framework\TestCase {

	private function rows(): array {
		$mk = fn( $store, $id, $name, $type, $shown, $drafts ) => array(
			'store'   => $store,
			'id'      => $id,
			'name'    => $name,
			'type'    => $type,
			'shown'   => $shown,
			'auto'    => 0,
			'edited'  => 0,
			'own'     => $shown,
			'drafts'  => $drafts,
			'draft_q' => $drafts ? array( 'Is it open?' ) : array(),
		);
		return array(
			$mk( 'post', 1, 'Zebra', 'post', 5, 0 ),
			$mk( 'post', 2, 'apple', 'page', 3, 2 ),
			$mk( 'term', 3, 'Mango', 'category', 0, 1 ),
			$mk( 'post', 4, 'Banana', 'post', 9, 0 ),
		);
	}

	public function testQueryViewsSplitWithAnFaqFromWaitingForApproval(): void {
		$all = rankweb_faq_query( $this->rows(), array( 'view' => 'all' ) );
		$this->assertSame( 3, $all['total'] );
		$wait = rankweb_faq_query( $this->rows(), array( 'view' => 'waiting' ) );
		$this->assertSame( 2, $wait['total'] );
		$this->assertSame( array( 'apple', 'Mango' ), array_column( $wait['rows'], 'name' ), 'name order, natural and case-blind' );
	}

	public function testQueryFiltersByTypeAndSearchesTheName(): void {
		$r = rankweb_faq_query( $this->rows(), array( 'type' => 'post' ) );
		$this->assertSame( array( 'Banana', 'Zebra' ), array_column( $r['rows'], 'name' ) );
		$r = rankweb_faq_query( $this->rows(), array( 's' => 'ANAN' ) );
		$this->assertSame( array( 'Banana' ), array_column( $r['rows'], 'name' ) );
	}

	public function testQuerySortsAndPagesAndIgnoresAnUnknownColumn(): void {
		$r = rankweb_faq_query( $this->rows(), array( 'orderby' => 'shown', 'order' => 'desc' ) );
		$this->assertSame( array( 9, 5, 3 ), array_column( $r['rows'], 'shown' ) );
		$r = rankweb_faq_query( $this->rows(), array( 'orderby' => 'shown', 'order' => 'desc', 'per_page' => 2, 'page' => 2 ) );
		$this->assertSame( array( 3 ), array_column( $r['rows'], 'shown' ) );
		$this->assertSame( 3, $r['total'], 'the total counts every page' );
		$r = rankweb_faq_query( $this->rows(), array( 'orderby' => 'drop table' ) );
		$this->assertSame( 'apple', $r['rows'][0]['name'], 'falls back to name' );
	}

	public function testApproveApprovesOwnDraftsOnlyAndLeavesAutomaticQuestionsAlone(): void {
		rw_user( true, array( RANKWEB_CAP, 'edit_post', 'edit_term' ) );
		$GLOBALS['rw_faq_items'] = array(
			'post:2' => array(
				array( 'q' => 'Own draft', 'status' => 'draft', 'auto' => '' ),
				array( 'q' => 'Own done', 'status' => 'approved', 'auto' => '' ),
				array( 'q' => 'Auto', 'status' => 'draft', 'auto' => 'hours' ),
			),
			'term:3' => array( array( 'q' => 'Term draft', 'status' => 'draft', 'auto' => '' ) ),
		);
		$GLOBALS['rw_faq_saved'] = array();
		$r = rankweb_faq_approve( array( 'post:2', 'term:3' ) );
		$this->assertSame( 2, $r['approved'] );
		$this->assertSame( 2, $r['items'] );
		$this->assertSame( 0, $r['skipped'] );
		$saved = $GLOBALS['rw_faq_saved']['post:2'];
		$this->assertSame( 'approved', $saved[0]['status'] );
		$this->assertSame( wp_date( 'Y-m-d' ), $saved[0]['reviewed'] );
		$this->assertSame( 'draft', $saved[2]['status'], 'an automatic question is not touched' );
	}

	public function testApproveSkipsBadPicksAndItemsTheUserMayNotEdit(): void {
		rw_user( true, array( RANKWEB_CAP, 'edit_post', 'edit_term' ) );
		$GLOBALS['rw_user']['deny'] = array( 9 );
		$GLOBALS['rw_faq_items']    = array(
			'post:9' => array( array( 'q' => 'Not mine', 'status' => 'draft', 'auto' => '' ) ),
		);
		$GLOBALS['rw_faq_saved'] = array();
		$r = rankweb_faq_approve( array( 'post:9', 'nonsense', 'user:1', 'post:abc' ) );
		$this->assertSame( 0, $r['approved'] );
		$this->assertSame( 4, $r['skipped'] );
		$this->assertSame( array(), $GLOBALS['rw_faq_saved'], 'nothing was written' );
	}

	public function testApproveWritesNothingWhenNothingWaits(): void {
		rw_user( true, array( RANKWEB_CAP, 'edit_post' ) );
		$GLOBALS['rw_faq_items'] = array( 'post:5' => array( array( 'q' => 'Done', 'status' => 'approved', 'auto' => '' ) ) );
		$GLOBALS['rw_faq_saved'] = array();
		$r = rankweb_faq_approve( array( 'post:5', 'post:5' ) );
		$this->assertSame( 0, $r['approved'] );
		$this->assertSame( array(), $GLOBALS['rw_faq_saved'] );
	}

	public function testRecountBuildsTheIndexAgain(): void {
		unset( $GLOBALS['rw_transients']['aw_faq_index'] );
		$r = rankweb_faq_recount();
		$this->assertTrue( $r['at'] > 0 );
		$this->assertTrue( is_array( get_transient( 'aw_faq_index' ) ) );
	}

	public function testPayloadCarriesViewsRowsCountsAndFaqBox(): void {
		rw_user( true, array( RANKWEB_CAP, 'edit_post', 'edit_term', 'manage_options' ) );
		$GLOBALS['rw_transients']['aw_faq_index'] = array(
			'at'     => 1700000000,
			'rows'   => $this->rows(),
			'counts' => array(
				'post' => array( 'store' => 'post', 'published' => 10, 'faq' => 2, 'below' => 1, 'drafts' => 2 ),
				'tag'  => array( 'store' => 'term', 'published' => 0, 'faq' => 0, 'below' => 0, 'drafts' => 0 ),
			),
		);
		$p = rankweb_faq_payload( array( 'view' => 'waiting' ) );
		$this->assertSame( 'waiting', $p['view'] );
		$this->assertSame( 2, $p['total'] );
		$this->assertSame( array( 3, 2 ), array_column( $p['views'], 'count' ) );
		$this->assertSame( 'post:2', $p['rows'][0]['key'] );
		$this->assertStringContainsString( 'post=2', $p['rows'][0]['editUrl'] );
		$this->assertCount( 1, $p['counts'], 'a type with nothing in it is left out' );
		$this->assertTrue( $p['canTypes'] );
		$on = array_column( $p['faqTypes'], 'on', 'slug' );
		$this->assertFalse( $on['page'], 'an off type is shown unticked' );
		$this->assertTrue( $on['post'] );
		rw_user( true, array( RANKWEB_CAP, 'edit_post' ) );
		$GLOBALS['rw_user']['deny'] = array( 2 );
		$p = rankweb_faq_payload( array( 'view' => 'waiting' ) );
		$this->assertSame( '', $p['rows'][0]['editUrl'], 'no edit link for an item the user may not edit' );
		$this->assertFalse( $p['canTypes'] );
	}

	public function testEveryFaqRouteNeedsTheMenuCapabilityAndANonce(): void {
		$routes = rw_routes( 'rankweb_faq_register_routes' );
		$this->assertSame( array( 'GET /faq', 'POST /faq/approve', 'POST /faq/recount' ), array_keys( $routes ) );
		foreach ( $routes as $key => $args ) {
			$this->assertSame( '', rw_matrix( $key, $args, RANKWEB_CAP ) );
		}
	}
}
