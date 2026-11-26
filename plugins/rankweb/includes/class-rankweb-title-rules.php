<?php
/**
 * Title separator and prefix. Pure PHP, no WordPress, so tests/TitleRulesTest.php runs it. The separator is one of a short
 * list of marks (so a typo cannot break the title tag); the prefix is plain text put before the page title.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Title rules. */
final class RankWeb_Title_Rules {

	/** The separators offered. */
	const SEPARATORS = array( '-', '–', '—', '|', '·', '•', '»', '«', '/', '~', ':' );

	/** A separator from the list, else '' (meaning WordPress's own). */
	public static function separator( $v ): string {
		$v = trim( (string) $v );
		return in_array( $v, self::SEPARATORS, true ) ? $v : '';
	}

	/** A prefix cleaned to one short line of plain text, up to 40 characters. */
	public static function prefix( $v ): string {
		$v = trim( preg_replace( '/\s+/u', ' ', strip_tags( (string) $v ) ) );
		return function_exists( 'mb_substr' ) ? mb_substr( $v, 0, 40 ) : substr( $v, 0, 40 );
	}

	/**
	 * The title parts with a prefix before the title.
	 *
	 * @param array  $parts WordPress's document_title_parts.
	 * @param string $prefix Cleaned prefix.
	 */
	public static function with_prefix( array $parts, string $prefix ): array {
		if ( '' !== $prefix && isset( $parts['title'] ) && '' !== (string) $parts['title'] && 0 !== strpos( (string) $parts['title'], $prefix ) ) {
			$parts['title'] = $prefix . ' ' . $parts['title'];
		}
		return $parts;
	}
}
