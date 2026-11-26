<?php
/**
 * The SEO Bar: a few checks on one item's search fields, as a status per check (good, warn, bad) and a count. Pure PHP,
 * no WordPress, so tests/SeoBarTest.php runs it. The checks look only at what is stored (title, description, focus
 * keyword, noindex, address), never at the page or a score from another plugin.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Checks for the SEO Bar on the post lists. */
final class RankWeb_Seo_Bar {

	const GOOD = 'good';
	const WARN = 'warn';
	const BAD  = 'bad';

	/**
	 * The checks for one item.
	 *
	 * @param array $in title (SEO title, '' = the item's own title is used), post_title, description, focus (comma list),
	 *                  noindex (bool), slug.
	 * @return array[] Each: key, status, label (a short sentence that says what is wrong or right).
	 */
	public static function checks( array $in ): array {
		$title = trim( (string) ( $in['title'] ?? '' ) );
		$title = '' !== $title ? $title : trim( (string) ( $in['post_title'] ?? '' ) );
		$desc  = trim( (string) ( $in['description'] ?? '' ) );
		$focus = trim( explode( ',', (string) ( $in['focus'] ?? '' ) )[0] );
		$slug  = (string) ( $in['slug'] ?? '' );
		$tl    = self::length( $title );
		$dl    = self::length( $desc );
		$out   = array();

		if ( ! empty( $in['noindex'] ) ) {
			$out[] = self::row( 'noindex', self::WARN, 'Hidden from search engines.' );
		}
		if ( 0 === $tl ) {
			$out[] = self::row( 'title', self::BAD, 'No title.' );
		} elseif ( $tl > 60 ) {
			$out[] = self::row( 'title', self::WARN, "Title is $tl characters; search results cut it at about 60." );
		} elseif ( $tl < 30 ) {
			$out[] = self::row( 'title', self::WARN, "Title is only $tl characters." );
		} else {
			$out[] = self::row( 'title', self::GOOD, 'Title length is right.' );
		}
		if ( 0 === $dl ) {
			$out[] = self::row( 'description', self::BAD, 'No description.' );
		} elseif ( $dl > 160 ) {
			$out[] = self::row( 'description', self::WARN, "Description is $dl characters; search results cut it at about 160." );
		} elseif ( $dl < 70 ) {
			$out[] = self::row( 'description', self::WARN, "Description is only $dl characters." );
		} else {
			$out[] = self::row( 'description', self::GOOD, 'Description length is right.' );
		}
		if ( '' === $focus ) {
			$out[] = self::row( 'focus', self::WARN, 'No focus keyword.' );
		} elseif ( false === stripos( $title, $focus ) ) {
			$out[] = self::row( 'focus', self::WARN, 'The focus keyword is not in the title.' );
		} else {
			$out[] = self::row( 'focus', self::GOOD, 'The focus keyword is in the title.' );
		}
		if ( strlen( $slug ) > 75 ) {
			$out[] = self::row( 'slug', self::WARN, 'The address is long.' );
		}
		return $out;
	}

	/**
	 * Counts per status.
	 *
	 * @param array[] $checks From checks().
	 * @return array{good:int,warn:int,bad:int}
	 */
	public static function counts( array $checks ): array {
		$n = array( self::GOOD => 0, self::WARN => 0, self::BAD => 0 );
		foreach ( $checks as $c ) {
			if ( isset( $n[ $c['status'] ] ) ) {
				++$n[ $c['status'] ];
			}
		}
		return $n;
	}

	/** The worst status among the checks. */
	public static function worst( array $checks ): string {
		$n = self::counts( $checks );
		return $n[ self::BAD ] ? self::BAD : ( $n[ self::WARN ] ? self::WARN : self::GOOD );
	}

	private static function row( string $key, string $status, string $label ): array {
		return array(
			'key'    => $key,
			'status' => $status,
			'label'  => $label,
		);
	}

	private static function length( string $s ): int {
		return function_exists( 'mb_strlen' ) ? mb_strlen( $s ) : strlen( $s );
	}
}
