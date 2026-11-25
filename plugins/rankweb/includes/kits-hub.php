<?php
/**
 * RankWeb in the Kits admin: a row in Kits → Home's System Status, through Kits
 * Core's filter kits_status_rows. Only when Kits Core is loaded; without it nothing here runs and
 * the plugin's own menu works as before. Loaded whether or not Rank Math is active, so the row can say it is missing.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'kits_admin_tabs' ) ) {
			return;
		}
		add_filter( 'kits_status_rows', 'rankweb_seo_extras_kits_status_row' );
		add_filter( 'kits_settings_transfer_options', 'rankweb_seo_extras_kits_export' );
	},
	20 // after the plugin's own plugins_loaded (5), which loads the menu.
);

/**
 * The RankWeb row of the System Status table.
 *
 * @param array $rows Rows: [label, HTML value].
 */
function rankweb_seo_extras_kits_status_row( $rows ) {
	$main_file = defined( 'RANKWEB_FILE' ) ? RANKWEB_FILE : ( file_exists( RANKWEB_DIR . 'rankweb.php' ) ? RANKWEB_DIR . 'rankweb.php' : RANKWEB_DIR . 'rankweb.php' );
	$head      = get_file_data( $main_file, array( 'Version' => 'Version' ) );
	/* translators: %s: plugin version. */
	$text = sprintf( __( 'Active, %s', 'rankweb' ), $head['Version'] );
	if ( ! rankweb_seo_extras_rank_math() ) {
		$fix    = __( 'Does nothing until Rank Math SEO is active.', 'rankweb' );
		$rows[] = array( __( 'RankWeb', 'rankweb' ), function_exists( 'kits_status_cell' ) ? kits_status_cell( $text, $fix ) : esc_html( $text . '. ' . $fix ) );
		return $rows;
	}
	$link   = defined( 'AW_SEO_MENU' ) ? ' <a href="' . esc_url( admin_url( 'admin.php?page=' . AW_SEO_MENU ) ) . '">' . esc_html__( 'Overview', 'rankweb' ) . '</a>' : '';
	$rows[] = array( __( 'RankWeb', 'rankweb' ), esc_html( $text ) . $link );
	return $rows;
}

/**
 * RankWeb's three settings options in Kits → Import / Export (docs/org/rankweb-org-plan.md §0, answer 3): the rules, the
 * FAQ box types and the listings kept indexed. An export before and after a change shows that no setting was lost.
 *
 * @param array $names Option names in the export.
 */
function rankweb_seo_extras_kits_export( $names ) {
	return array_values( array_unique( array_merge( (array) $names, array( 'aw_seo_settings', 'aw_faq_off_types', 'aw_seo_keep_listings' ) ) ) );
}
