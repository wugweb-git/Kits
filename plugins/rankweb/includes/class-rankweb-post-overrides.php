<?php
/**
 * Per-item overrides: a canonical address, a 301 redirect and a share image address. Pure PHP, no WordPress, so
 * tests/PostOverridesTest.php runs it. Addresses are cleaned to http or https only; a redirect that points at the item's
 * own address is dropped, so it can never loop.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Overrides for one item. */
final class RankWeb_Post_Overrides {

	/** The post meta keys. */
	const KEYS = array(
		'canonical' => '_rankweb_canonical',
		'redirect'  => '_rankweb_redirect',
		'og_image'  => '_rankweb_og_image',
	);

	/** Text overrides: the title and description used when the page is shared. */
	const TEXT_KEYS = array(
		'og_title'       => '_rankweb_og_title',
		'og_description' => '_rankweb_og_description',
	);

	/** Text cleaned to one line, no tags. */
	public static function clean_text( $v ): string {
		return trim( preg_replace( '/\s+/u', ' ', strip_tags( (string) $v ) ) );
	}

	/** An address cleaned: http or https with a host, no spaces or script, else ''. */
	public static function clean_url( $v ): string {
		$v = trim( strip_tags( (string) $v ) );
		if ( '' === $v || preg_match( '/\s/', $v ) || ! preg_match( '#^https?://[^/\s]+#i', $v ) || false === filter_var( $v, FILTER_VALIDATE_URL ) ) {
			return '';
		}
		return $v;
	}

	/** The same address in a comparable form (lower-case scheme and host, no trailing slash, no fragment). */
	public static function normal( string $url ): string {
		$p = parse_url( $url );
		if ( ! $p || empty( $p['host'] ) ) {
			return $url;
		}
		return strtolower( (string) ( $p['scheme'] ?? 'http' ) ) . '://' . strtolower( $p['host'] ) . ( isset( $p['port'] ) ? ':' . $p['port'] : '' ) . rtrim( (string) ( $p['path'] ?? '' ), '/' ) . ( isset( $p['query'] ) ? '?' . $p['query'] : '' );
	}

	/**
	 * Where to send a visitor, or '' for nowhere.
	 *
	 * @param string $target  The stored redirect address.
	 * @param string $current The address being viewed.
	 */
	public static function redirect_to( string $target, string $current ): string {
		$t = self::clean_url( $target );
		return ( '' === $t || self::normal( $t ) === self::normal( $current ) ) ? '' : $t;
	}

	/**
	 * Cleaned values for the three keys from a form's submitted values.
	 *
	 * @param array $in canonical, redirect, og_image.
	 * @return array<string,string> Meta key => clean value ('' = remove).
	 */
	public static function clean_form( array $in ): array {
		$out = array();
		foreach ( self::KEYS as $field => $key ) {
			$out[ $key ] = self::clean_url( $in[ $field ] ?? '' );
		}
		foreach ( self::TEXT_KEYS as $field => $key ) {
			$out[ $key ] = self::clean_text( $in[ $field ] ?? '' );
		}
		return $out;
	}
}
