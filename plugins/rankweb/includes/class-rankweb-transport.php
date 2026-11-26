<?php
/**
 * Transport: what to copy from Yoast SEO, Rank Math or All in One SEO into RankWeb's fields for one item. Pure PHP, no
 * WordPress, so tests/TransportTest.php runs it. It reads the other plugin's stored values (a post-meta array, or for
 * All in One SEO 4 a row of its table) into one shape, then plans which fields to write: a field that already has a
 * value is never overwritten, and a value that is still a template ("%%title%% %%sep%%") is skipped because it means
 * nothing without the other plugin.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-robots.php';

/** Copy of SEO fields from another plugin. */
final class RankWeb_Transport {

	/** The fields RankWeb fills, in the order they are reported. */
	const FIELDS = array( 'title', 'description', 'focus', 'noindex', 'nofollow', 'noarchive', 'nosnippet', 'max_snippet' );

	/** @return array<string,string> Source key => name. */
	public static function sources(): array {
		return array(
			'yoast'    => 'Yoast SEO',
			'rankmath' => 'Rank Math',
			'aioseo'   => 'All in One SEO',
		);
	}

	/**
	 * The other plugin's values for one item, in RankWeb's shape.
	 *
	 * @param string $source 'yoast', 'rankmath' or 'aioseo'.
	 * @param array  $meta   Post meta as key => single value. For All in One SEO 4 the row's columns under keys 'row_title',
	 *                       'row_description', 'row_keyphrases' (JSON), 'row_robots_default', 'row_robots_noindex',
	 *                       'row_robots_nofollow', 'row_robots_noarchive', 'row_robots_nosnippet', 'row_robots_max_snippet'.
	 * @return array<string,string> Every field of FIELDS ('' when the source has nothing); flags are '1' or ''.
	 */
	public static function read( string $source, array $meta ): array {
		$out = array_fill_keys( self::FIELDS, '' );
		$m   = static fn( string $k ): string => isset( $meta[ $k ] ) && is_scalar( $meta[ $k ] ) ? trim( (string) $meta[ $k ] ) : '';
		if ( 'yoast' === $source ) {
			$out['title']       = $m( '_yoast_wpseo_title' );
			$out['description'] = $m( '_yoast_wpseo_metadesc' );
			$out['focus']       = $m( '_yoast_wpseo_focuskw' );
			$out['noindex']     = '1' === $m( '_yoast_wpseo_meta-robots-noindex' ) ? '1' : '';
			$out['nofollow']    = '1' === $m( '_yoast_wpseo_meta-robots-nofollow' ) ? '1' : '';
			$adv                = array_map( 'trim', explode( ',', strtolower( $m( '_yoast_wpseo_meta-robots-adv' ) ) ) );
			$out['noarchive']   = in_array( 'noarchive', $adv, true ) ? '1' : '';
			$out['nosnippet']   = in_array( 'nosnippet', $adv, true ) ? '1' : '';
		} elseif ( 'rankmath' === $source ) {
			// Title, description and focus keyword are already in the fields RankWeb's editor box uses.
			$raw   = $meta['rank_math_robots'] ?? '';
			$words = array_map( 'trim', explode( ',', strtolower( is_array( $raw ) ? implode( ',', $raw ) : (string) $raw ) ) );
			foreach ( array( 'noindex', 'nofollow', 'noarchive', 'nosnippet' ) as $w ) {
				$out[ $w ] = in_array( $w, $words, true ) ? '1' : '';
			}
			$adv = $meta['rank_math_advanced_robots'] ?? array();
			if ( is_array( $adv ) && isset( $adv['max-snippet'] ) ) {
				$n = RankWeb_Robots::max_snippet( $adv['max-snippet'] );
				$out['max_snippet'] = null === $n ? '' : (string) $n;
			}
		} elseif ( 'aioseo' === $source ) {
			$out['title']       = $m( 'row_title' ) . $m( '_aioseop_title' );
			$out['description'] = $m( 'row_description' ) . $m( '_aioseop_description' );
			$kp                 = json_decode( $m( 'row_keyphrases' ), true );
			$out['focus']       = is_array( $kp ) && isset( $kp['focus']['keyphrase'] ) && is_string( $kp['focus']['keyphrase'] ) ? trim( $kp['focus']['keyphrase'] ) : '';
			if ( '' === $out['focus'] ) {
				$out['focus'] = trim( explode( ',', $m( '_aioseop_keywords' ) )[0] );
			}
			// Per item robots count only when the item does not use the site default.
			if ( '' !== $m( 'row_robots_default' ) && '0' === $m( 'row_robots_default' ) ) {
				foreach ( array( 'noindex', 'nofollow', 'noarchive', 'nosnippet' ) as $w ) {
					$out[ $w ] = '1' === $m( 'row_robots_' . $w ) ? '1' : '';
				}
				$n = RankWeb_Robots::max_snippet( $m( 'row_robots_max_snippet' ) );
				$out['max_snippet'] = null === $n || 0 === $n ? '' : (string) $n; // AIOSEO stores 0 for "not set"
			}
		}
		if ( self::is_template( $out['title'] ) ) {
			$out['title'] = '';
		}
		if ( self::is_template( $out['description'] ) ) {
			$out['description'] = '';
		}
		return $out;
	}

	/** Whether a value still holds the other plugin's variables (%%title%%, %title%, #post_title). */
	public static function is_template( string $v ): bool {
		return 1 === preg_match( '/%%?[a-z_]+%%?|#[a-z_]{3,}/i', $v );
	}

	/**
	 * What to write for one item.
	 *
	 * @param array $incoming From read().
	 * @param array $current  RankWeb's values today, the same keys ('' = empty).
	 * @return array{write:array<string,string>,kept:string[]} write: field => value; kept: fields that have a value already.
	 */
	public static function plan( array $incoming, array $current ): array {
		$write = array();
		$kept  = array();
		foreach ( self::FIELDS as $f ) {
			$in = trim( (string) ( $incoming[ $f ] ?? '' ) );
			if ( '' === $in ) {
				continue;
			}
			if ( '' !== trim( (string) ( $current[ $f ] ?? '' ) ) ) {
				$kept[] = $f;
				continue;
			}
			$write[ $f ] = $in;
		}
		return array( 'write' => $write, 'kept' => $kept );
	}

	/**
	 * Counts over many plans.
	 *
	 * @param array[] $plans From plan(), one per item.
	 * @return array{items:int,changed:int,fields:array<string,int>,kept:int}
	 *         items scanned, items with something to write, writes per field, values left alone because the field was filled.
	 */
	public static function tally( array $plans ): array {
		$t = array( 'items' => 0, 'changed' => 0, 'fields' => array_fill_keys( self::FIELDS, 0 ), 'kept' => 0 );
		foreach ( $plans as $p ) {
			++$t['items'];
			if ( ! empty( $p['write'] ) ) {
				++$t['changed'];
			}
			foreach ( array_keys( (array) ( $p['write'] ?? array() ) ) as $f ) {
				++$t['fields'][ $f ];
			}
			$t['kept'] += count( (array) ( $p['kept'] ?? array() ) );
		}
		return $t;
	}
}
