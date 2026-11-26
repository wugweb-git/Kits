<?php
/**
 * Per-item robots directives: nofollow, noarchive, nosnippet and max-snippet next to noindex. Pure PHP, no WordPress,
 * so tests/RobotsTest.php runs it. It reads an item's stored values (RankWeb's own fields, then the words in a Rank
 * Math robots list) and edits the array that core's wp_robots filter prints, so there is one robots tag.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Robots directives for one item. */
final class RankWeb_Robots {

	/** The yes/no directives besides noindex, in the order they print. */
	const FLAGS = array( 'nofollow', 'noarchive', 'nosnippet' );

	/**
	 * What one item asks for.
	 *
	 * @param array  $in         Stored values: nofollow, noarchive, nosnippet ('1' or ''), max_snippet ('' = not set, else an
	 *                           integer, -1 = no limit, 0 = none).
	 * @param string $rank_math  The Rank Math robots list as one comma string (e.g. 'noindex,nofollow'); read for the flags only.
	 * @return array{nofollow:bool,noarchive:bool,nosnippet:bool,max_snippet:?int}
	 */
	public static function from_meta( array $in, string $rank_math = '' ): array {
		$words = array_map( 'trim', explode( ',', strtolower( $rank_math ) ) );
		$out   = array();
		foreach ( self::FLAGS as $flag ) {
			$out[ $flag ] = '1' === (string) ( $in[ $flag ] ?? '' ) || in_array( $flag, $words, true );
		}
		$out['max_snippet'] = self::max_snippet( $in['max_snippet'] ?? '' );
		return $out;
	}

	/** A max-snippet value cleaned: null when not set or not a whole number of -1 or more. */
	public static function max_snippet( $v ): ?int {
		if ( is_int( $v ) ) {
			return $v >= -1 ? $v : null;
		}
		$v = trim( (string) $v );
		if ( '' === $v || ! preg_match( '/^-?\d+$/', $v ) ) {
			return null;
		}
		$n = (int) $v;
		return $n >= -1 ? $n : null;
	}

	/**
	 * The robots array with the item's directives added. Page-kind rules (noindex) stay as they are; nofollow replaces an
	 * existing follow; nosnippet wins over max-snippet (Google reads nosnippet as no text at all).
	 *
	 * @param array $robots What wp_robots holds (directive => true, or directive => value).
	 * @param array $item   From from_meta().
	 * @return array
	 */
	public static function apply( array $robots, array $item ): array {
		if ( ! empty( $item['nofollow'] ) ) {
			unset( $robots['follow'] );
			$robots['nofollow'] = true;
		}
		if ( ! empty( $item['noarchive'] ) ) {
			$robots['noarchive'] = true;
		}
		if ( ! empty( $item['nosnippet'] ) ) {
			$robots['nosnippet'] = true;
			unset( $robots['max-snippet'] );
		} elseif ( isset( $item['max_snippet'] ) && null !== $item['max_snippet'] ) {
			// A string: core's wp_robots prints "directive:value" only for strings, and a bare directive for any other truthy value.
			$robots['max-snippet'] = (string) (int) $item['max_snippet'];
		}
		return $robots;
	}

	/** Whether an item asks for anything (a list screen can show a mark). */
	public static function any( array $item ): bool {
		return ! empty( $item['nofollow'] ) || ! empty( $item['noarchive'] ) || ! empty( $item['nosnippet'] ) || ( isset( $item['max_snippet'] ) && null !== $item['max_snippet'] );
	}
}
