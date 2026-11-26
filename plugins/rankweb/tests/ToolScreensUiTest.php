<?php
/**
 * The tool screens' wiring in includes/rankweb-ui.php: every tool slug is a screen, and the capability the script is
 * enqueued for is the one the menu entry and the screen's REST routes need.
 *
 * @package rankweb
 */

// phpcs:disable WordPress.Files.FileName, WordPress.NamingConventions.ValidFunctionName, Squiz.Commenting.FunctionComment.Missing, Universal.Files.SeparateFunctionsFromOO -- test harness.

require_once __DIR__ . '/tool-stubs.php';

if ( ! defined( 'AW_SEO_MENU' ) ) {
	define( 'AW_SEO_MENU', 'aw-seo-plus' );
}

require_once dirname( __DIR__ ) . '/includes/rankweb-ui.php';

/** The screen slugs and their capabilities. */
final class ToolScreensUiTest extends PHPUnit\Framework\TestCase {

	protected function setUp(): void {
		unset( $_GET['page'] );
	}

	public function testEveryToolSlugIsAScreen(): void {
		$want = array(
			'aw-faq'       => 'faq',
			'aw-links'     => 'links',
			'aw-images'    => 'images',
			'aw-seo-csv'   => 'csv',
			'aw-redirects' => 'redirects',
			'aw-transport' => 'transport',
		);
		foreach ( $want as $page => $screen ) {
			$_GET['page'] = $page;
			$this->assertSame( $screen, rankweb_ui_wanted(), $page );
		}
		$_GET['page'] = 'something-else';
		$this->assertSame( '', rankweb_ui_wanted() );
	}

	public function testTheScriptIsEnqueuedForTheCapabilityOfTheMenuEntry(): void {
		$this->assertSame( RANKWEB_CAP, rankweb_ui_cap( 'faq' ) );
		$this->assertSame( RANKWEB_CAP, rankweb_ui_cap( 'links' ) );
		$this->assertSame( 'manage_options', rankweb_ui_cap( 'images' ) );
		$this->assertSame( 'manage_options', rankweb_ui_cap( 'csv' ) );
		$this->assertSame( 'manage_options', rankweb_ui_cap( 'redirects' ) );
		$this->assertSame( 'manage_options', rankweb_ui_cap( 'transport' ) );
		$this->assertSame( 'manage_options', rankweb_ui_cap( 'settings' ) );
	}

	public function testInternalLinksOffersTheViewsWhoseFilesAreLoaded(): void {
		$views = rankweb_ui_link_views();
		$this->assertSame( 'audit', $views[0] );
		$this->assertSame( function_exists( 'rankweb_anchor_page' ), in_array( 'anchors', $views, true ) );
		$this->assertSame( function_exists( 'rankweb_silo_payload' ), in_array( 'silos', $views, true ) );
	}
}
