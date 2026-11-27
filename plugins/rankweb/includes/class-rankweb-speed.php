<?php
/**
 * Page-speed helpers for Core Web Vitals: defer chosen scripts, make Google Fonts links show text at once, and choose
 * WebP for new image uploads. Pure PHP, no WordPress, so tests/SpeedTest.php runs it. Nothing here calls an outside
 * service: it only edits tags and settings WordPress already prints.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Speed rules. */
final class RankWeb_Speed {

	/**
	 * A script tag with defer added, when its handle is on the list. A tag that already has async, defer or
	 * type="module" is left alone, and so is one with no src (an inline script cannot be deferred).
	 *
	 * @param string   $tag     The tag.
	 * @param string   $handle  Script handle.
	 * @param string[] $handles Handles to defer.
	 */
	public static function defer_tag( string $tag, string $handle, array $handles ): string {
		if ( ! in_array( $handle, $handles, true ) || false === stripos( $tag, ' src=' ) || preg_match( '/\s(?:defer|async)(?:[\s=>])|type=["\']module["\']/i', $tag ) ) {
			return $tag;
		}
		return preg_replace( '/<script\b/i', '<script defer', $tag, 1 );
	}

	/** The handles from a settings list, cleaned (one per line, no spaces). */
	public static function handles( $list ): array {
		return array_values( array_unique( array_filter( array_map( static fn( $h ) => preg_replace( '/[^A-Za-z0-9_\-.]/', '', (string) $h ), (array) $list ) ) ) );
	}

	/** A Google Fonts address with display=swap, so text shows in a fallback font while the font loads. Other addresses are unchanged. */
	public static function font_display( string $url ): string {
		$host = (string) wp_parse_url( $url, PHP_URL_HOST );
		if ( 'fonts.googleapis.com' !== strtolower( $host ) || preg_match( '/[?&](?:amp;|#038;)?display=/', $url ) ) {
			return $url;
		}
		return $url . ( false === strpos( $url, '?' ) ? '?' : '&' ) . 'display=swap';
	}

	/**
	 * The output format map for WordPress's image editor: JPEG and PNG uploads are saved as WebP when the server can.
	 *
	 * @param array $map       Current map (source mime => output mime).
	 * @param bool  $supported Whether the image editor can write WebP.
	 */
	public static function webp_map( array $map, bool $supported ): array {
		if ( $supported ) {
			$map['image/jpeg'] = 'image/webp';
			$map['image/png']  = 'image/webp';
		}
		return $map;
	}
}
