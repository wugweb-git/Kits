<?php
/**
 * InsightWeb privacy-first 404 tracking, internal search query logging, and rising/declining keyword movers.
 *
 * Stores aggregated path/query counts only (no cookies, no IP addresses, no PII).
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const INSIGHTWEB_404_OPTION             = 'insightweb_404_log';
const INSIGHTWEB_INTERNAL_SEARCH_OPTION = 'insightweb_internal_searches';
const INSIGHTWEB_TELEMETRY_CAP          = 100;

/**
 * Normalizes a URL path for privacy-safe 404 aggregation (strips query string and fragment).
 *
 * @param string $raw_uri Raw request URI.
 * @return string Normalized path starting with '/'.
 */
function insightweb_normalize_404_path( string $raw_uri ): string {
	$path = (string) strtok( $raw_uri, '?#' );
	$path = '/' . ltrim( trim( $path ), '/' );
	if ( strlen( $path ) > 240 ) {
		$path = substr( $path, 0, 240 );
	}
	return $path;
}

/**
 * Records a 404 hit in the aggregated log (capped at INSIGHTWEB_TELEMETRY_CAP paths).
 *
 * @param string   $raw_uri Request URI.
 * @param int|null $now     Unix timestamp.
 * @return array<string, array{path: string, hits: int, last_seen: int}>
 */
function insightweb_record_404( string $raw_uri, ?int $now = null ): array {
	$now  = $now ?? time();
	$path = insightweb_normalize_404_path( $raw_uri );
	$log  = function_exists( 'get_option' ) ? (array) get_option( INSIGHTWEB_404_OPTION, array() ) : array();

	$prev         = isset( $log[ $path ] ) && is_array( $log[ $path ] ) ? $log[ $path ] : array( 'path' => $path, 'hits' => 0, 'last_seen' => 0 );
	$log[ $path ] = array(
		'path'      => $path,
		'hits'      => (int) $prev['hits'] + 1,
		'last_seen' => $now,
	);

	if ( count( $log ) > INSIGHTWEB_TELEMETRY_CAP ) {
		uasort( $log, fn( $a, $b ) => ( (int) ( $b['hits'] ?? 0 ) ) <=> ( (int) ( $a['hits'] ?? 0 ) ) );
		$log = array_slice( $log, 0, INSIGHTWEB_TELEMETRY_CAP, true );
	}

	if ( function_exists( 'update_option' ) ) {
		update_option( INSIGHTWEB_404_OPTION, $log, false );
	}
	return $log;
}

/**
 * Records an internal site search query (normalized, zero PII).
 *
 * @param string   $query         Search query.
 * @param int      $results_count Number of matched results.
 * @param int|null $now           Unix timestamp.
 * @return array<string, array{query: string, count: int, zero_results: int, last_seen: int}>
 */
function insightweb_record_internal_search( string $query, int $results_count = 0, ?int $now = null ): array {
	$now   = $now ?? time();
	$clean = strtolower( trim( preg_replace( '/\s+/', ' ', strip_tags( $query ) ) ) );
	if ( '' === $clean ) {
		return function_exists( 'get_option' ) ? (array) get_option( INSIGHTWEB_INTERNAL_SEARCH_OPTION, array() ) : array();
	}
	if ( strlen( $clean ) > 120 ) {
		$clean = substr( $clean, 0, 120 );
	}

	$log  = function_exists( 'get_option' ) ? (array) get_option( INSIGHTWEB_INTERNAL_SEARCH_OPTION, array() ) : array();
	$prev = isset( $log[ $clean ] ) && is_array( $log[ $clean ] ) ? $log[ $clean ] : array( 'query' => $clean, 'count' => 0, 'zero_results' => 0, 'last_seen' => 0 );

	$log[ $clean ] = array(
		'query'        => $clean,
		'count'        => (int) $prev['count'] + 1,
		'zero_results' => (int) $prev['zero_results'] + ( 0 === $results_count ? 1 : 0 ),
		'last_seen'    => $now,
	);

	if ( count( $log ) > INSIGHTWEB_TELEMETRY_CAP ) {
		uasort( $log, fn( $a, $b ) => ( (int) ( $b['count'] ?? 0 ) ) <=> ( (int) ( $a['count'] ?? 0 ) ) );
		$log = array_slice( $log, 0, INSIGHTWEB_TELEMETRY_CAP, true );
	}

	if ( function_exists( 'update_option' ) ) {
		update_option( INSIGHTWEB_INTERNAL_SEARCH_OPTION, $log, false );
	}
	return $log;
}

/**
 * Surfaces rising queries and declining keywords from keyword/momentum rows for the dashboard (Steps 0-9).
 *
 * @param array<int, array<string, mixed>> $rows  Rows with 'keyword'/'query' and 'delta'/'momentum'/'clicks_delta'.
 * @param int                              $limit Max items per bucket.
 * @return array{rising: array<int, array<string, mixed>>, declining: array<int, array<string, mixed>>}
 */
function insightweb_keyword_movers( array $rows, int $limit = 10 ): array {
	$rising    = array();
	$declining = array();

	foreach ( $rows as $row ) {
		if ( ! is_array( $row ) ) {
			continue;
		}
		$kw    = trim( (string) ( $row['keyword'] ?? $row['query'] ?? '' ) );
		$delta = (float) ( $row['clicks_delta'] ?? $row['momentum'] ?? $row['delta'] ?? 0 );
		if ( '' === $kw || 0.0 === $delta ) {
			continue;
		}
		$item = array(
			'keyword' => $kw,
			'delta'   => $delta,
			'clicks'  => (int) ( $row['clicks'] ?? 0 ),
			'pos'     => isset( $row['position'] ) ? (float) $row['position'] : null,
		);
		if ( $delta > 0 ) {
			$rising[] = $item;
		} else {
			$declining[] = $item;
		}
	}

	usort( $rising, fn( $a, $b ) => $b['delta'] <=> $a['delta'] );
	usort( $declining, fn( $a, $b ) => $a['delta'] <=> $b['delta'] );

	return array(
		'rising'    => array_slice( $rising, 0, max( 1, $limit ) ),
		'declining' => array_slice( $declining, 0, max( 1, $limit ) ),
	);
}

if ( function_exists( 'add_action' ) ) {
	add_action(
		'template_redirect',
		function () {
			if ( function_exists( 'is_admin' ) && is_admin() ) {
				return;
			}
			if ( function_exists( 'is_404' ) && is_404() ) {
				$uri = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( (string) $_SERVER['REQUEST_URI'] ) : '/'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- normalized by insightweb_normalize_404_path()
				insightweb_record_404( $uri );
			} elseif ( function_exists( 'is_search' ) && is_search() ) {
				global $wp_query;
				$q     = function_exists( 'get_search_query' ) ? (string) get_search_query( false ) : '';
				$found = isset( $wp_query->found_posts ) ? (int) $wp_query->found_posts : 0;
				insightweb_record_internal_search( $q, $found );
			}
		}
	);

	add_action(
		'rest_api_init',
		function () {
			$perm = function_exists( 'insightweb_rest_can' ) ? insightweb_rest_can( 'manage_options' ) : fn() => current_user_can( 'manage_options' );
			register_rest_route(
				'insightweb/v1',
				'/telemetry/404-searches',
				array(
					array(
						'methods'             => 'GET',
						'callback'            => function () {
							return rest_ensure_response(
								array(
									'not_found'         => array_values( (array) get_option( INSIGHTWEB_404_OPTION, array() ) ),
									'internal_searches' => array_values( (array) get_option( INSIGHTWEB_INTERNAL_SEARCH_OPTION, array() ) ),
								)
							);
						},
						'permission_callback' => $perm,
					),
					array(
						'methods'             => 'DELETE',
						'callback'            => function () {
							delete_option( INSIGHTWEB_404_OPTION );
							delete_option( INSIGHTWEB_INTERNAL_SEARCH_OPTION );
							return rest_ensure_response( array( 'cleared' => true ) );
						},
						'permission_callback' => $perm,
					),
				)
			);
		}
	);
}
