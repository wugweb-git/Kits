<?php
/**
 * SourceWeb in Tools → Search Insights (owner, 24 Oct 2026; rebuilt on Search Insights phase 1).
 *
 * - "Sourcing keywords" tab (filter aw_si_tabs): per Google News search of the workers, the items it brought in over
 *   30 days, News and Library apart (sourceweb_sourcing_keyword_stats), with the 28-day and 3-month clicks and impressions of the
 *   published items' pages from Search Insights (insightweb_si_page_metrics: the daily page rows, which include searches Google hides).
 * - The searches behind Sourcing → Keywords → Suggestions (filter aw_search_demand_terms): Search
 *   Insights' keywords with their 28-day figures, English only (owner: no Hindi or Hinglish suggestions).
 * - Soft link both ways: without aw-seo-extras (or before Search Insights is installed) the tab is not added and the
 *   suggestions get no searches; Search Insights' own screens do not depend on this file.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The tab sits between Search Insights' Searches and Settings tabs.
add_filter( 'insightweb_si_tabs', fn( $tabs ) => (array) $tabs + array( 'sourcing' => __( 'Sourcing keywords', 'sourceweb' ) ) );

add_action(
	'aw_si_tab_sourcing',
	function () {
		if ( ! class_exists( 'WP_List_Table' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
		}
		require_once __DIR__ . '/class-aw-sourcing-si-keywords-table.php';
		$table = new SourceWeb_Sourcing_SI_Keywords_Table( sourceweb_sourcing_kw_report( 30 ) );
		$table->prepare_items();
		echo '<p>A results report over every keyword in<a href="' . esc_url( admin_url( 'admin.php?page=aw-sourcing&tab=keywords' ) ) . '">Plugins → SourceWeb → Keywords</a>, one row each, with its real roles. An English Include or Search keyword is a Google News search every run; the Search column shows whether it is on. '
			. '<strong>Fetched</strong>: the items it brought in over the last 30 days, whatever happened to them since (held, merged, backfilled). <strong>Published</strong>: those live now. '
			. '<strong>Keyword impressions</strong>: Search Console impressions for the keyword itself over 28 days. <strong>Page impressions and clicks</strong>: Search Console over the last 28 days and the last 3 months for the published items\' own pages, searches Google hides included. '
			. 'Items from before 24 Oct 2026 did not record their search: they are counted by the word in their title or summary and marked estimated. Hindi keywords are never searches.</p>';
		if ( ! $table->has_page_data() ) { // Search Insights has not stored a Search Console run yet, or is switched off
			$off = function_exists( 'insightweb_si_ready' ) && ! insightweb_si_ready();
			wp_admin_notice(
				'<span class="dashicons dashicons-info" aria-hidden="true"></span> '
				. esc_html( $off ? 'Search Insights is off, so there are no page figures. Settings → Run the daily update starts it again.' : ( $table->page_data_stale() ? 'Search Insights has not had a successful Search Console run in the last 28 days, so there are no current page figures. Check Search Insights → Settings.' : 'Page figures appear after Search Insights\' next daily Search Console run (07:10 IST); the first 30 days fill in over about two runs, the 3 months over about a week.' ) ),
				array( 'type' => 'info', 'additional_classes' => array( 'inline' ) )
			);
		}
		$table->display();
	}
);

/**
 * Search Insights' searches for the suggestions: keyword, 28-day impressions / clicks / position, brand. English only.
 *
 * @param mixed $terms Null when nothing has offered searches yet.
 * @return array|null
 */
function sourceweb_sourcing_si_terms( $terms ) {
	if ( ! sourceweb_sourcing_si_available() ) {
		return $terms;
	}
	global $wpdb;
	$k     = insightweb_si_table( 'keywords' );
	$brand = (int) apply_filters( 'sourceweb_si_role_brand', defined( 'INSIGHTWEB_SI_ROLE_BRAND' ) ? (int) INSIGHTWEB_SI_ROLE_BRAND : 8 ); // InsightWeb's Brand role bit; 8 when InsightWeb's constant is not there
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- the table name comes from Search Insights.
	$rows = $wpdb->get_results( $wpdb->prepare( "SELECT norm, label, impr28, clicks28, pos28, roles FROM %i WHERE lang = 'en' AND impr28 >= 20 ORDER BY impr28 DESC LIMIT 5000", $k ) ); // the suggestions' own floor (keyword-suggestions.php)
	$out  = array();
	foreach ( (array) $rows as $r ) {
		$out[] = array(
			'q'      => '' !== (string) $r->label ? (string) $r->label : (string) $r->norm,
			'impr'   => (int) $r->impr28,
			'clicks' => (int) $r->clicks28,
			'pos'    => null === $r->pos28 ? 0.0 : (float) $r->pos28,
			'brand'  => (bool) ( (int) $r->roles & $brand ),
			'rising' => false, // Search Console Rising is off until 8 weeks of history (owner, 24 Oct 2026)
		);
	}
	return array_merge( is_array( $terms ) ? $terms : array(), $out ); // another provider's searches are kept
}
add_filter( 'sourceweb_search_demand_terms', 'sourceweb_sourcing_si_terms' );

/** Search Insights is installed and switched on (aw-seo-extras active). */
function sourceweb_sourcing_si_available() {
	return function_exists( 'insightweb_si_ready' ) && function_exists( 'insightweb_si_table' ) && insightweb_si_ready();
}
