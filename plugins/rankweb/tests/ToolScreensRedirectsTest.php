<?php
/**
 * RankWeb → Redirect tools on the shell: CSV import, the 404 log and the .htaccess write as functions that return a
 * report (includes/redirect-tools.php), their REST routes, and each route's permission. The real file is loaded;
 * WordPress, Rank Math and the database are stubbed. The .htaccess file itself is not written here (that needs
 * WP_Filesystem); what is tested is that the server refuses without the confirm flag and reaches the writer with it.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing, Universal.Files.SeparateFunctionsFromOO, WordPress.DB, WordPress.PHP.DiscouragedPHPFunctions -- test harness.

require_once __DIR__ . '/tool-stubs.php';

if ( ! defined( 'AW_REDIRECT_HTACCESS' ) ) {
	define( 'AW_REDIRECT_HTACCESS', 0 ); // the option is off: a confirmed write stops at "the option is off", before any file is touched
}
if ( ! defined( 'ARRAY_A' ) ) {
	define( 'ARRAY_A', 'ARRAY_A' );
}
if ( ! class_exists( 'RankMath\Helper' ) ) {
	eval( 'namespace RankMath; class Helper { public static function is_module_active( $m ) { return ! empty( $GLOBALS["rw_rm_on"] ); } }' ); // phpcs:ignore Squiz.PHP.Eval.Discouraged -- a Rank Math stand-in
}

/** A stand-in for $wpdb: Rank Math's redirections and 404 tables. */
class RW_Redirect_Wpdb {
	public $prefix = 'wp_';
	public function prepare( $q, ...$args ) {
		return vsprintf( str_replace( array( '%i', '%s', '%d' ), '%s', $q ), $args );
	}
	public function get_var( $sql ) {
		return ! empty( $GLOBALS['rw_404_table'] ) ? 'wp_rank_math_404_logs' : null;
	}
	public function get_results( $sql, $out = null ) {
		if ( false !== strpos( $sql, 'rank_math_redirections' ) ) {
			return $GLOBALS['rw_rm_rows'];
		}
		if ( false !== strpos( $sql, 'rank_math_404_logs' ) ) {
			return $GLOBALS['rw_404_rows'];
		}
		return array();
	}
}

$GLOBALS['rw_rm_calls'] = array(); // what rankweb_rank_math_redirect() was asked to add
if ( ! function_exists( 'maybe_unserialize' ) ) {
	function maybe_unserialize( $v ) {
		return @unserialize( (string) $v );
	}
}
if ( ! function_exists( 'rankweb_rank_math_redirect' ) ) {
	function rankweb_rank_math_redirect( $pattern, $target, $comparison, $code ) {
		if ( 'taken' === $pattern ) {
			return 0; // already in the list
		}
		$GLOBALS['rw_rm_calls'][] = array( $pattern, $target, $comparison, $code );
		return count( $GLOBALS['rw_rm_calls'] );
	}
}

require_once dirname( __DIR__ ) . '/includes/redirect-tools.php';

/** The Redirect tools screen's functions and routes. */
final class ToolScreensRedirectsTest extends PHPUnit\Framework\TestCase {

	protected function setUp(): void {
		$GLOBALS['wpdb']          = new RW_Redirect_Wpdb();
		$GLOBALS['rw_rm_on']      = true;
		$GLOBALS['rw_rm_calls']   = array();
		$GLOBALS['rw_opts']       = array();
		$GLOBALS['rw_404_table']  = true;
		$GLOBALS['rw_404_rows']   = array(
			array( 'uri' => '/old-page', 'times_accessed' => 4, 'accessed' => '2026-11-20 10:00:00', 'referer' => '=HYPERLINK("x")', 'user_agent' => 'Bot' ),
			array( 'uri' => '/gone', 'times_accessed' => 1, 'accessed' => '2026-11-19 09:00:00', 'referer' => '', 'user_agent' => '' ),
		);
		$GLOBALS['rw_rm_rows']    = array(
			array( 'sources' => serialize( array( array( 'pattern' => 'old-a', 'comparison' => 'exact' ), array( 'pattern' => '^x/(.*)$', 'comparison' => 'regex' ) ) ), 'url_to' => 'https://example.org/new-a/', 'header_code' => '301' ),
		);
		unset( $_SERVER['SERVER_SOFTWARE'] );
		rw_user( true, array( 'manage_options' ) );
	}

	private function csv_file( string $text ): array {
		$tmp = tempnam( sys_get_temp_dir(), 'rwred' );
		file_put_contents( $tmp, $text );
		return array( 'tmp_name' => $tmp, 'size' => strlen( $text ), 'error' => 0 );
	}

	private function import( string $text, bool $apply ): array {
		$f = $this->csv_file( $text );
		$r = rankweb_redirect_import_file( $f, $apply, fn() => true );
		unlink( $f['tmp_name'] );
		return $r;
	}

	/* ---------- Import ---------- */

	public function testImportDryRunReportsEachRowAndAddsNothing(): void {
		$r = $this->import( "source,target,code\n/old/,/new/,301\n/gone/,,410\n", false );
		$this->assertTrue( $r['dry'] );
		$this->assertSame( '', $r['error'] );
		$this->assertSame( 2, $r['added'] );
		$this->assertSame( array(), $GLOBALS['rw_rm_calls'], 'a dry run writes nothing' );
		$this->assertSame( '/old/ → https://example.org/new/', $r['lines'][0] );
		$this->assertSame( '/gone/ → 410', $r['lines'][1] );
	}

	public function testImportApplyAddsToRankMathWithTheSourceTidiedAndSetsTheCategory(): void {
		$r = $this->import( "source,target,code,comparison,category\n/old/,/new/,301,exact,Seasonal\n^x/(.*)\$,https://other.test/\$1,302,regex,\n", true );
		$this->assertFalse( $r['dry'] );
		$this->assertSame( 2, $r['added'] );
		$this->assertSame( array( 'old', 'https://example.org/new/', 'exact', 301 ), $GLOBALS['rw_rm_calls'][0], 'slashes trimmed from an exact source' );
		$this->assertSame( '^x/(.*)$', $GLOBALS['rw_rm_calls'][1][0], 'a pattern is kept as it is' );
		$this->assertSame( array( 'Seasonal' => 1 ), rankweb_redirect_category_counts() );
	}

	public function testImportSkipsBadRowsAndSourcesAlreadyInTheList(): void {
		$r = $this->import( "source,target,code\n/a/,,301\n/b/,/x/,999\ntaken,/y/,301\n/ok/,/z/,301\n", true );
		$this->assertSame( 1, $r['added'] );
		$this->assertCount( 3, $r['skipped'] );
		$this->assertStringContainsString( 'No target', $r['skipped'][0] );
		$this->assertStringContainsString( 'Unknown status code 999', $r['skipped'][1] );
		$this->assertStringContainsString( 'already in the list', $r['skipped'][2] );
	}

	public function testImportNeedsRankMathAndAnUploadedCsvWithASourceColumn(): void {
		$GLOBALS['rw_rm_on'] = false;
		$r = $this->import( "source,target\n/a/,/b/\n", true );
		$this->assertStringContainsString( 'Redirections module is off', $r['error'] );
		$GLOBALS['rw_rm_on'] = true;
		$r = rankweb_redirect_import_file( null, true );
		$this->assertStringContainsString( 'Choose a CSV file', $r['error'] );
		$f = $this->csv_file( "source,target\n/a/,/b/\n" );
		$r = rankweb_redirect_import_file( $f, true ); // on disk, but not received as an upload
		$this->assertStringContainsString( 'Choose a CSV file', $r['error'] );
		$this->assertSame( array(), $GLOBALS['rw_rm_calls'] );
		$r = rankweb_redirect_import_file( array( 'tmp_name' => $f['tmp_name'], 'size' => 6 * MB_IN_BYTES, 'error' => 0 ), true, fn() => true );
		$this->assertStringContainsString( '5 MB', $r['error'] );
		unlink( $f['tmp_name'] );
		$r = $this->import( "target,code\n/b/,301\n", true );
		$this->assertStringContainsString( '"source" column', $r['error'] );
	}

	/* ---------- 404 log ---------- */

	public function testTheFourOhFourLogIsReadFromRankMathsTable(): void {
		$r = rankweb_redirect_404_rows( 100 );
		$this->assertTrue( $r['exists'] );
		$this->assertSame( '/old-page', $r['rows'][0]['uri'] );
		$this->assertSame( 4, $r['rows'][0]['hits'] );
		$GLOBALS['rw_404_table'] = false;
		$r                       = rankweb_redirect_404_rows( 100 );
		$this->assertFalse( $r['exists'], 'Rank Math has no 404 table' );
		$this->assertSame( array(), $r['rows'] );
	}

	public function testTheFourOhFourCsvNeutralisesSpreadsheetFormulas(): void {
		$csv = rankweb_redirect_404_csv();
		$this->assertTrue( str_starts_with( $csv, 'uri,hits,last_seen,referer,user_agent' ) );
		$this->assertStringContainsString( '\'=HYPERLINK', $csv, 'an attacker-set referer cannot be a formula' );
		$this->assertStringNotContainsString( ',"=HYPERLINK', $csv );
	}

	/* ---------- .htaccess ---------- */

	public function testTheHtaccessBlockHoldsTheExactRedirectsBetweenRankWebsMarkers(): void {
		$block = rankweb_redirect_htaccess_block();
		$this->assertTrue( str_starts_with( $block, "# BEGIN RankWeb Redirects\n" ) );
		$this->assertTrue( str_ends_with( $block, "# END RankWeb Redirects\n" ) );
		$this->assertStringContainsString( 'old-a', $block );
		$this->assertStringNotContainsString( '^x/', $block, 'a regex rule stays in Rank Math' );
	}

	public function testTheServerRefusesToEditHtaccessWithoutTheConfirmFlag(): void {
		foreach ( array( false, true ) as $remove ) {
			$r = rankweb_redirect_htaccess_write( false, $remove );
			$this->assertSame( 'htaccess', $r['kind'] );
			$this->assertStringContainsString( 'Nothing was changed', $r['error'] );
			$this->assertSame( '', $r['ok'] );
		}
	}

	public function testAConfirmedWriteReachesTheWriterAndItsOwnChecksStillApply(): void {
		$r = rankweb_redirect_htaccess_write( true, false );
		$this->assertStringContainsString( 'The .htaccess option is off', $r['error'], 'confirmed, so it went on to the setting check' );
		$this->assertSame( 'htaccess', $r['kind'] );
	}

	public function testTheRouteRefusesAWriteSentWithoutConfirm(): void {
		$routes = rw_routes( 'rankweb_redirect_register_routes' );
		$cb     = $routes['POST /redirects/htaccess']['callback'];
		$req    = new WP_REST_Request( 'POST' );
		$req->params = array( 'confirm' => false, 'remove' => false );
		$r = $cb( $req );
		$this->assertStringContainsString( 'Nothing was changed', $r['error'] );
		$req->params['confirm'] = true;
		$r = $cb( $req );
		$this->assertStringContainsString( 'option is off', $r['error'] );
		$this->assertFalse( $routes['POST /redirects/htaccess']['args']['confirm']['default'], 'confirm is off unless sent' );
	}

	/* ---------- The screen's data and the routes ---------- */

	public function testPayloadSaysWhetherRankMathIsReadyAndWhereTheDownloadsAre(): void {
		$GLOBALS['rw_opts']['rankweb_redirect_categories'] = array( 'k1' => 'Seasonal', 'k2' => 'Seasonal', 'k3' => 'Old' );
		$p = rankweb_redirect_payload();
		$this->assertTrue( $p['ready'] );
		$this->assertSame( array( 'Old' => 1, 'Seasonal' => 2 ), array_column( $p['categories'], 'count', 'name' ) );
		$this->assertSame( 1, $p['htaccess']['count'] );
		$this->assertFalse( $p['htaccess']['can'], 'the option is off' );
		$this->assertStringContainsString( 'action=aw_redirect_export', $p['export']['redirects'] );
		$this->assertStringContainsString( '_wpnonce=nonce-aw_redirect_export', $p['export']['redirects'] );
		$this->assertStringContainsString( '_wpnonce=nonce-aw_redirect_404export', $p['export']['log404'] );
		$this->assertStringContainsString( 'action=aw_redirect_htaccess_download', $p['export']['htaccess'] );
		$GLOBALS['rw_rm_on'] = false;
		$this->assertFalse( rankweb_redirect_payload()['ready'] );
	}

	public function testApacheIsReadFromTheServerSoftware(): void {
		$this->assertFalse( rankweb_redirect_apache() );
		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.4';
		$this->assertTrue( rankweb_redirect_apache() );
		$_SERVER['SERVER_SOFTWARE'] = 'LiteSpeed';
		$this->assertTrue( rankweb_redirect_apache() );
		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.25';
		$this->assertFalse( rankweb_redirect_apache() );
	}

	public function testEveryRedirectRouteIsForAdministrators(): void {
		$routes = rw_routes( 'rankweb_redirect_register_routes' );
		$this->assertSame( array( 'GET /redirects', 'GET /redirects/404', 'POST /redirects/import', 'POST /redirects/htaccess' ), array_keys( $routes ) );
		foreach ( $routes as $key => $args ) {
			$this->assertSame( '', rw_matrix( $key, $args, 'manage_options' ) );
		}
		$this->assertFalse( $routes['POST /redirects/import']['args']['apply']['default'], 'a dry run is the default' );
		rw_user( true, array( RANKWEB_CAP ) );
		foreach ( $routes as $key => $args ) {
			$this->assertTrue( is_wp_error( rw_can( $args, 'good' ) ), $key . ': managing RankWeb is not enough' );
		}
	}

	public function testTheImportRouteReadsItsFileFromTheRequestsFileParams(): void {
		$routes = rw_routes( 'rankweb_redirect_register_routes' );
		$cb     = $routes['POST /redirects/import']['callback'];
		$req    = new WP_REST_Request( 'POST' );
		$req->params = array( 'apply' => true );
		$this->assertStringContainsString( 'Choose a CSV file', $cb( $req )['error'], 'no file in the request' );
		$f          = $this->csv_file( "source,target\n/a/,/b/\n" );
		$req->files = array( 'aw_csv' => $f );
		$this->assertStringContainsString( 'Choose a CSV file', $cb( $req )['error'], 'not an upload PHP received' );
		$this->assertSame( array(), $GLOBALS['rw_rm_calls'] );
		unlink( $f['tmp_name'] );
	}
}
