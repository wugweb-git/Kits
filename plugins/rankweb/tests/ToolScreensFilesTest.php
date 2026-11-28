<?php
/**
 * RankWeb → Images and → SEO CSV on the shell: find and replace, fill captions and CSV import as functions that return
 * a report (includes/media-seo.php, bulk-csv.php), their REST routes, and each route's permission. The real files are
 * loaded; WordPress is stubbed with an in-memory post and meta store.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing, Universal.Files.SeparateFunctionsFromOO, WordPress.WP.AlternativeFunctions -- test harness.

require_once __DIR__ . '/tool-stubs.php';

if ( ! defined( 'RANKWEB_MEDIA_CAPTION' ) ) {
	define( 'RANKWEB_MEDIA_CAPTION', '{title} on {sitename}' );
}

$GLOBALS['rw_meta']  = $GLOBALS['rw_meta'] ?? array();
$GLOBALS['rw_posts'] = array();
$GLOBALS['rw_ids']   = array();

if ( ! function_exists( 'rankweb_bulk_types' ) ) {
	function rankweb_bulk_types() {
		return array( 'post', 'page' );
	}
}
if ( ! function_exists( 'rankweb_bulk_link_keywords' ) ) {
	function rankweb_bulk_link_keywords( $id ) {
		return array();
	}
}

require_once dirname( __DIR__ ) . '/includes/media-seo.php';
require_once dirname( __DIR__ ) . '/includes/bulk-csv.php';

/** The Images and SEO CSV screens' functions and routes. */
final class ToolScreensFilesTest extends PHPUnit\Framework\TestCase {

	protected function setUp(): void {
		$GLOBALS['rw_meta']  = array();
		$GLOBALS['rw_posts'] = array(
			1 => new WP_Post( array( 'ID' => 1, 'post_type' => 'attachment', 'post_title' => 'Stray dog', 'post_excerpt' => '', 'post_name' => 'dog-photo' ) ),
			2 => new WP_Post( array( 'ID' => 2, 'post_type' => 'attachment', 'post_title' => 'Cat', 'post_excerpt' => 'A dog nearby', 'post_name' => 'cat' ) ),
			3 => new WP_Post( array( 'ID' => 3, 'post_type' => 'attachment', 'post_title' => 'Bird', 'post_excerpt' => '', 'post_name' => 'bird' ) ),
			10 => new WP_Post( array( 'ID' => 10, 'post_type' => 'post', 'post_title' => 'A post' ) ),
			11 => new WP_Post( array( 'ID' => 11, 'post_type' => 'event', 'post_title' => 'An event' ) ),
		);
		$GLOBALS['rw_ids']                           = array( 1, 2, 3 );
		$GLOBALS['rw_meta'][1]['_wp_attachment_image_alt'] = 'dog in a field';
		$GLOBALS['rw_meta'][3]['_wp_attachment_image_alt'] = 'a bird';
		$GLOBALS['rw_meta'][3]['_wp_attached_file']        = '2026/11/bird_on-wire.jpg';
		rw_user( true, array( 'manage_options', 'edit_post' ) );
	}

	/* ---------- Images ---------- */

	public function testReplaceDryRunReportsAndWritesNothing(): void {
		$r = rankweb_media_replace( 'dog', 'hound', array( 'alt', 'title', 'caption' ), false, true, false );
		$this->assertTrue( $r['dry'] );
		$this->assertSame( '', $r['error'] );
		$this->assertSame( 3, $r['updated'], 'alt of 1, title of 1, caption of 2' );
		$this->assertSame( 'dog in a field', get_post_meta( 1, '_wp_attachment_image_alt', true ) );
		$this->assertSame( 'Stray dog', $GLOBALS['rw_posts'][1]->post_title );
		$this->assertSame( 'hound in a field', $r['changes'][0]['to'] );
	}

	public function testReplaceApplyWritesAltTitleAndCaption(): void {
		$r = rankweb_media_replace( 'dog', 'hound', array( 'alt', 'title', 'caption' ), false, true, true );
		$this->assertFalse( $r['dry'] );
		$this->assertSame( 3, $r['updated'] );
		$this->assertSame( 'hound in a field', get_post_meta( 1, '_wp_attachment_image_alt', true ) );
		$this->assertSame( 'Stray hound', $GLOBALS['rw_posts'][1]->post_title );
		$this->assertSame( 'A hound nearby', $GLOBALS['rw_posts'][2]->post_excerpt );
	}

	public function testReplaceOnlyTouchesTheChosenFieldsAndKnowsNoOthers(): void {
		$r = rankweb_media_replace( 'dog', 'hound', array( 'alt', 'post_content', 'nonsense' ), false, true, true );
		$this->assertSame( 1, $r['updated'] );
		$this->assertSame( 'Stray dog', $GLOBALS['rw_posts'][1]->post_title, 'the title was not chosen' );
	}

	public function testReplaceNeedsASearchAndAField(): void {
		$r = rankweb_media_replace( '', 'x', array( 'alt' ), false, false, true );
		$this->assertStringContainsString( 'something to search for', $r['error'] );
		$r = rankweb_media_replace( 'dog', 'x', array(), false, false, true );
		$this->assertStringContainsString( 'at least one field', $r['error'] );
		$this->assertSame( 'dog in a field', get_post_meta( 1, '_wp_attachment_image_alt', true ), 'nothing was written' );
	}

	public function testReplaceWithABadPatternReportsTheErrorAndWritesNothingAfterIt(): void {
		$r = rankweb_media_replace( '(', 'x', array( 'alt' ), true, false, true );
		$this->assertTrue( '' !== $r['error'] );
		$this->assertSame( 'dog in a field', get_post_meta( 1, '_wp_attachment_image_alt', true ) );
	}

	public function testCaptionsAreFilledOnlyWhereThereIsNoneAndNeverOverwritten(): void {
		$dry = rankweb_media_fill_captions( false );
		$this->assertTrue( $dry['dry'] );
		$this->assertSame( 2, $dry['updated'], 'attachment 2 has a caption' );
		$this->assertSame( '', $GLOBALS['rw_posts'][1]->post_excerpt, 'a dry run writes nothing' );
		$r = rankweb_media_fill_captions( true );
		$this->assertSame( 'Stray dog on Example Site', $GLOBALS['rw_posts'][1]->post_excerpt );
		$this->assertSame( 'Bird on Example Site', $GLOBALS['rw_posts'][3]->post_excerpt );
		$this->assertSame( 'A dog nearby', $GLOBALS['rw_posts'][2]->post_excerpt );
		$this->assertSame( 2, $r['updated'] );
	}

	public function testPayloadTicksAltAndTitleLikeTheClassicForm(): void {
		$p = rankweb_media_payload();
		$this->assertSame( array( 'alt' => true, 'title' => true, 'caption' => false ), array_column( $p['fields'], 'default', 'key' ) );
		$this->assertSame( 500, $p['batch'] );
		$this->assertSame( '{title} on {sitename}', $p['pattern'] );
	}

	public function testTheImageRoutesAreForAdministratorsAndWriteNothingUnlessAskedTo(): void {
		$routes = rw_routes( 'rankweb_media_register_routes' );
		$this->assertSame( array( 'GET /images', 'POST /images/replace', 'POST /images/captions' ), array_keys( $routes ) );
		foreach ( $routes as $key => $args ) {
			$this->assertSame( '', rw_matrix( $key, $args, 'manage_options' ) );
		}
		$this->assertFalse( $routes['POST /images/replace']['args']['apply']['default'], 'a dry run is the default' );
		$this->assertFalse( $routes['POST /images/captions']['args']['apply']['default'], 'a dry run is the default' );
		rw_user( true, array( RANKWEB_CAP ) );
		$r = rw_can( $routes['POST /images/replace'], 'good' );
		$this->assertTrue( is_wp_error( $r ), 'managing RankWeb is not enough: the menu entry is manage_options' );
	}

	public function testTheReplaceRouteCallsTheFunctionWithApplyOffByDefault(): void {
		$routes = rw_routes( 'rankweb_media_register_routes' );
		$req    = new WP_REST_Request( 'POST' );
		$req->params = array( 'search' => 'dog', 'replace' => 'hound', 'fields' => array( 'alt' ), 'regex' => false, 'ci' => false, 'apply' => false );
		$r = ( $routes['POST /images/replace']['callback'] )( $req );
		$this->assertTrue( $r['dry'] );
		$this->assertSame( 'dog in a field', get_post_meta( 1, '_wp_attachment_image_alt', true ) );
		$req->params['apply'] = true;
		$r = ( $routes['POST /images/replace']['callback'] )( $req );
		$this->assertFalse( $r['dry'] );
		$this->assertSame( 'hound in a field', get_post_meta( 1, '_wp_attachment_image_alt', true ) );
	}

	/* ---------- SEO CSV ---------- */

	private function csv_file( string $text ): array {
		$tmp = tempnam( sys_get_temp_dir(), 'rwcsv' );
		file_put_contents( $tmp, $text );
		return array( 'tmp_name' => $tmp, 'size' => strlen( $text ), 'error' => 0 );
	}

	public function testExportTextHasTheHeaderAndOneRowPerItem(): void {
		$GLOBALS['rw_ids']                          = array( 10 );
		$GLOBALS['rw_meta'][10]['rank_math_title'] = 'Hello, world';
		$csv = rankweb_bulk_csv_text();
		$this->assertTrue( str_starts_with( $csv, 'id,title,description,focus_keyword,link_keywords,canonical' ) );
		$this->assertStringContainsString( '10,"Hello, world"', $csv );
	}

	public function testImportDryRunReportsAndWritesNothing(): void {
		$GLOBALS['rw_meta'][10]['rank_math_title'] = 'Old';
		$file = $this->csv_file( "id,title\n10,New title\n" );
		$r    = rankweb_bulk_csv_import_file( $file, false, fn() => true );
		$this->assertTrue( $r['dry'] );
		$this->assertSame( '', $r['error'] );
		$this->assertSame( 1, $r['updated'] );
		$this->assertSame( 'Item 10: title', $r['changes'][0] );
		$this->assertSame( 'Old', get_post_meta( 10, 'rank_math_title', true ) );
		unlink( $file['tmp_name'] );
	}

	public function testImportApplyWritesOnlyTheColumnsInTheFileAndClearsABlankCell(): void {
		$GLOBALS['rw_meta'][10]['rank_math_title']       = 'Old';
		$GLOBALS['rw_meta'][10]['rank_math_description'] = 'Keep me';
		$GLOBALS['rw_meta'][10]['rank_math_canonical_url'] = 'https://x.test/';
		$file = $this->csv_file( "id,title,canonical\n10,New title,\n" );
		$r    = rankweb_bulk_csv_import_file( $file, true, fn() => true );
		$this->assertFalse( $r['dry'] );
		$this->assertSame( 'New title', get_post_meta( 10, 'rank_math_title', true ) );
		$this->assertSame( 'Keep me', get_post_meta( 10, 'rank_math_description', true ), 'a column that is not in the file is not touched' );
		$this->assertSame( '', get_post_meta( 10, 'rank_math_canonical_url', true ), 'a blank cell clears it' );
		unlink( $file['tmp_name'] );
	}

	public function testImportSkipsItemsOfOtherTypesAndItemsTheUserMayNotEdit(): void {
		$GLOBALS['rw_user']['deny'] = array( 12 );
		$GLOBALS['rw_posts'][12]    = new WP_Post( array( 'ID' => 12, 'post_type' => 'post' ) );
		$file = $this->csv_file( "id,title\n11,Event\n12,Not mine\n999,Missing\n" );
		$r    = rankweb_bulk_csv_import_file( $file, true, fn() => true );
		$this->assertSame( 0, $r['updated'] );
		$this->assertCount( 3, $r['skipped'] );
		$this->assertStringContainsString( 'you may not edit it', $r['skipped'][1] );
		$this->assertSame( '', get_post_meta( 12, 'rank_math_title', true ) );
		unlink( $file['tmp_name'] );
	}

	public function testImportRefusesWhatIsNotAnUploadedCsv(): void {
		$r = rankweb_bulk_csv_import_file( null, true );
		$this->assertStringContainsString( 'Choose a CSV file', $r['error'] );
		$file = $this->csv_file( "id,title\n10,X\n" );
		$r    = rankweb_bulk_csv_import_file( $file, true ); // a file on disk that PHP did not receive as an upload
		$this->assertStringContainsString( 'Choose a CSV file', $r['error'], 'is_uploaded_file() is checked' );
		$this->assertSame( '', get_post_meta( 10, 'rank_math_title', true ) );
		$r = rankweb_bulk_csv_import_file( array( 'tmp_name' => $file['tmp_name'], 'size' => 10, 'error' => UPLOAD_ERR_INI_SIZE ), true, fn() => true );
		$this->assertStringContainsString( 'Choose a CSV file', $r['error'], 'a failed upload' );
		$r = rankweb_bulk_csv_import_file( array( 'tmp_name' => $file['tmp_name'], 'size' => 6 * MB_IN_BYTES, 'error' => 0 ), true, fn() => true );
		$this->assertStringContainsString( '5 MB', $r['error'] );
		unlink( $file['tmp_name'] );
		$bad = $this->csv_file( "title,description\nx,y\n" );
		$r   = rankweb_bulk_csv_import_file( $bad, true, fn() => true );
		$this->assertTrue( '' !== $r['error'], 'a file with no id column' );
		unlink( $bad['tmp_name'] );
	}

	public function testPayloadGivesTheTypesTheColumnsAndANoncedExportLink(): void {
		$p = rankweb_bulk_csv_payload();
		$this->assertSame( array( 'Posts', 'Pages' ), array_column( $p['types'], 'label' ) );
		$this->assertSame( 'id', $p['columns'][0] );
		$this->assertStringContainsString( 'action=aw_bulk_export', $p['export'] );
		$this->assertStringContainsString( '_wpnonce=nonce-aw_bulk_export', $p['export'] );
		$this->assertSame( 5 * MB_IN_BYTES, $p['max_bytes'] );
	}

	public function testTheCsvRoutesAreForAdministratorsAndTheImportIsADryRunByDefault(): void {
		$routes = rw_routes( 'rankweb_bulk_csv_register_routes' );
		$this->assertSame( array( 'GET /seo-csv', 'POST /seo-csv/import' ), array_keys( $routes ) );
		foreach ( $routes as $key => $args ) {
			$this->assertSame( '', rw_matrix( $key, $args, 'manage_options' ) );
		}
		$this->assertFalse( $routes['POST /seo-csv/import']['args']['apply']['default'] );
	}

	public function testTheImportRouteReadsItsFileFromTheRequestsFileParams(): void {
		$routes = rw_routes( 'rankweb_bulk_csv_register_routes' );
		$cb     = $routes['POST /seo-csv/import']['callback'];
		$req    = new WP_REST_Request( 'POST' );
		$req->params = array( 'apply' => true );
		$r = $cb( $req );
		$this->assertStringContainsString( 'Choose a CSV file', $r['error'], 'no file in the request' );
		$file = $this->csv_file( "id,title\n10,X\n" );
		$req->files = array( 'aw_csv' => $file );
		$r = $cb( $req );
		$this->assertStringContainsString( 'Choose a CSV file', $r['error'], 'a path that PHP did not receive as an upload is refused' );
		$this->assertSame( '', get_post_meta( 10, 'rank_math_title', true ) );
		unlink( $file['tmp_name'] );
	}
}
