<?php
/**
 * The Dashboard by country: Search Console clicks, impressions, click rate and average position for one country.
 *
 * Site Kit's Search Console call takes no country filter (it filters by page only), but it does pass `dimensions`
 * through, so the daily run asks once more for date + country and stores those rows (metric `c`, the country's
 * three-letter code in the page column, as Search Console writes it). A country on the Dashboard is those rows added up
 * for the chosen days, with the same "compare only with a fully stored window before" rule as the site's figures.
 * Pages and searches are not split by country: that would need a request for every country on every day.
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The most countries listed in the Dashboard's country choice. */
const INSIGHTWEB_COUNTRY_LIMIT = 40;

/** Days of stored country rows the country choice is ranked over. */
const INSIGHTWEB_COUNTRY_RANK_DAYS = 90;

/**
 * A country code as the stored rows spell it: three lower-case letters. '' when it is not one.
 *
 * @param mixed $code Raw code.
 */
function insightweb_country_code( $code ): string {
	$code = strtolower( trim( (string) $code ) );
	return preg_match( '/^[a-z]{3}$/', $code ) ? $code : '';
}

/**
 * The name of a country for its three-letter code. A site adds or corrects names with the filter
 * `insightweb_country_names` (code => name); a code with no name is shown as the code in capitals.
 *
 * @param string $code Code from insightweb_country_code().
 */
function insightweb_country_name( string $code ): string {
	$names = (array) apply_filters(
		'insightweb_country_names',
		array(
			'afg' => 'Afghanistan',
			'arg' => 'Argentina',
			'aus' => 'Australia',
			'aut' => 'Austria',
			'bgd' => 'Bangladesh',
			'bel' => 'Belgium',
			'bra' => 'Brazil',
			'can' => 'Canada',
			'che' => 'Switzerland',
			'chl' => 'Chile',
			'chn' => 'China',
			'col' => 'Colombia',
			'cze' => 'Czechia',
			'deu' => 'Germany',
			'dnk' => 'Denmark',
			'egy' => 'Egypt',
			'esp' => 'Spain',
			'fin' => 'Finland',
			'fra' => 'France',
			'gbr' => 'United Kingdom',
			'grc' => 'Greece',
			'hkg' => 'Hong Kong',
			'idn' => 'Indonesia',
			'ind' => 'India',
			'irl' => 'Ireland',
			'isr' => 'Israel',
			'ita' => 'Italy',
			'jpn' => 'Japan',
			'ken' => 'Kenya',
			'kor' => 'South Korea',
			'lka' => 'Sri Lanka',
			'mex' => 'Mexico',
			'mys' => 'Malaysia',
			'nga' => 'Nigeria',
			'nld' => 'Netherlands',
			'nor' => 'Norway',
			'npl' => 'Nepal',
			'nzl' => 'New Zealand',
			'pak' => 'Pakistan',
			'per' => 'Peru',
			'phl' => 'Philippines',
			'pol' => 'Poland',
			'prt' => 'Portugal',
			'rou' => 'Romania',
			'rus' => 'Russia',
			'sau' => 'Saudi Arabia',
			'sgp' => 'Singapore',
			'swe' => 'Sweden',
			'tha' => 'Thailand',
			'tur' => 'Türkiye',
			'twn' => 'Taiwan',
			'ukr' => 'Ukraine',
			'are' => 'United Arab Emirates',
			'usa' => 'United States',
			'vnm' => 'Vietnam',
			'zaf' => 'South Africa',
		)
	);
	$code  = insightweb_country_code( $code );
	if ( '' === $code ) {
		return '';
	}
	return isset( $names[ $code ] ) && '' !== (string) $names[ $code ] ? (string) $names[ $code ] : strtoupper( $code );
}

/**
 * The country rows of one day as the daily run stores them: [ kw_id, page (the code), metric, clicks, impressions,
 * position ]. Pure. A row with no valid code is left out.
 *
 * @param array $rows Search Console rows for date + country: [ [ date, country ], clicks, impressions, position ].
 * @return array[]
 */
function insightweb_country_store_rows( array $rows ): array {
	$out = array();
	foreach ( $rows as $r ) {
		$code = insightweb_country_code( $r[0][1] ?? '' );
		if ( '' !== $code ) {
			$out[] = array( 0, $code, 'c', (int) $r[1], (int) $r[2], (float) $r[3] );
		}
	}
	return $out;
}

/**
 * The countries to choose from: the ones with the most clicks over the last 90 stored days.
 *
 * @return array[] Each: code, name, clicks (a number), impr.
 */
function insightweb_country_list(): array {
	global $wpdb;
	if ( get_option( 'aw_si_off' ) || ! function_exists( 'insightweb_si_table' ) ) {
		return array();
	}
	$o    = insightweb_si_table( 'obs' );
	$from = gmdate( 'Y-m-d', time() - INSIGHTWEB_COUNTRY_RANK_DAYS * DAY_IN_SECONDS );
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- a small read of the plugin's own table.
	$rows = (array) $wpdb->get_results( $wpdb->prepare( "SELECT page, SUM(clicks) c, SUM(impr) i FROM %i WHERE src = 'gsc' AND metric = 'c' AND period = 'day' AND d >= %s GROUP BY page ORDER BY c DESC, i DESC LIMIT %d", $o, $from, INSIGHTWEB_COUNTRY_LIMIT ) );
	$out  = array();
	foreach ( $rows as $r ) {
		$code = insightweb_country_code( $r->page );
		if ( '' !== $code ) {
			$out[] = array(
				'code'   => $code,
				'name'   => insightweb_country_name( $code ),
				'clicks' => (int) $r->c,
				'impr'   => (int) $r->i,
			);
		}
	}
	return $out;
}

/**
 * One country's figures for each of the Dashboard's ranges, shaped like the site's (tiles for clicks, impressions, click
 * rate and position; the chart), computed from the stored country rows.
 *
 * @param string $code Code from insightweb_country_code().
 * @return array{code:string,name:string,ranges:object,end:string}|null Null for an unknown code or no stored country rows.
 */
function insightweb_country_figures( string $code ): ?array {
	global $wpdb;
	$code = insightweb_country_code( $code );
	if ( '' === $code || get_option( 'aw_si_off' ) || ! function_exists( 'insightweb_si_table' ) ) {
		return null;
	}
	$o = insightweb_si_table( 'obs' );
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- a small read of the plugin's own table.
	$end = (string) $wpdb->get_var( $wpdb->prepare( "SELECT MAX(d) FROM %i WHERE src = 'gsc' AND metric = 'c' AND period = 'day'", $o ) );
	if ( '' === $end ) {
		return null;
	}
	$e       = new DateTimeImmutable( $end, wp_timezone() );
	$longest = max( INSIGHTWEB_DASH_RANGES );
	$first   = $e->modify( '-' . ( 2 * $longest - 1 ) . ' days' )->format( 'Y-m-d' );
	$days    = array();
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- a small read of the plugin's own table.
	foreach ( (array) $wpdb->get_results( $wpdb->prepare( "SELECT d, SUM(clicks) c, SUM(impr) i, SUM(pos * impr) pw FROM %i WHERE src = 'gsc' AND metric = 'c' AND page = %s AND period = 'day' AND d BETWEEN %s AND %s GROUP BY d ORDER BY d", $o, $code, $first, $end ) ) as $r ) {
		$days[ (string) $r->d ] = array( (int) $r->c, (int) $r->i, (float) $r->pw );
	}
	if ( ! $days ) {
		return null;
	}
	$links  = array();
	$ranges = array();
	foreach ( INSIGHTWEB_DASH_RANGES as $n ) {
		$from  = $e->modify( '-' . ( $n - 1 ) . ' days' )->format( 'Y-m-d' );
		$pfrom = $e->modify( '-' . ( 2 * $n - 1 ) . ' days' )->format( 'Y-m-d' );
		$pend  = $e->modify( '-' . $n . ' days' )->format( 'Y-m-d' );
		$now   = insightweb_dash_window( $days, $from, $end );
		$prev  = insightweb_dash_window( $days, $pfrom, $pend );
		$row   = array(
			'days'       => $n,
			'from'       => $from,
			'stored'     => $now['stored'],
			'prevStored' => $prev['stored'],
			'clicks'     => $now['clicks'],
			'impr'       => $now['impr'],
			'pos'        => $now['pos'],
			'prevClicks' => $prev['clicks'],
			'prevImpr'   => $prev['impr'],
			'prevPos'    => $prev['pos'],
			'pages'      => 0,
			'queries'    => 0,
			'prevPages'  => 0,
			'prevQuery'  => 0,
			'chart'      => array(),
			'topPages'   => array(),
			'topQueries' => array(),
		);
		foreach ( $days as $d => $v ) {
			if ( $d >= $from ) {
				$row['chart'][ $d ] = $v[0];
			}
		}
		$shaped         = insightweb_dash_shape( $row, $links );
		$shaped['tiles'] = array_values( array_filter( $shaped['tiles'], fn( $t ) => in_array( $t['key'], array( 'clicks', 'impr', 'ctr', 'pos' ), true ) ) ); // pages and searches are not split by country
		$ranges[ (string) $n ] = $shaped;
	}
	return array(
		'code'    => $code,
		'name'    => insightweb_country_name( $code ),
		'end'     => $end,
		'endText' => wp_date( 'j M Y', strtotime( $end . ' 12:00:00' ) ),
		'ranges'  => (object) $ranges,
	);
}

add_action(
	'rest_api_init',
	function () {
		if ( ! function_exists( 'insightweb_rest_can' ) && ! function_exists( 'kits_shell_rest_can' ) ) {
			return;
		}
		$can = function_exists( 'insightweb_rest_can' ) ? 'insightweb_rest_can' : 'kits_shell_rest_can';
		register_rest_route(
			INSIGHTWEB_REST,
			'/dashboard/country',
			array(
				'methods'             => 'GET',
				'permission_callback' => $can( insightweb_si_cap() ),
				'args'                => array(
					'code' => array(
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'insightweb_country_code',
					),
				),
				'callback'            => function ( WP_REST_Request $r ) {
					$f = insightweb_country_figures( (string) $r['code'] );
					return $f ? rest_ensure_response( $f ) : new WP_Error( 'insightweb_no_country', __( 'No stored figures for that country yet. They fill in from the next daily update.', 'insightweb' ), array( 'status' => 404 ) );
				},
			)
		);
	}
);
