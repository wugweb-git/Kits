<?php
/**
 * Which image files to make WebP copies of. Pure PHP, no WordPress, so tests/WebpTest.php runs it. A copy sits next to the
 * original with .webp added to the file name (photo.jpg.webp), so the page rewrite can find it and nothing is replaced.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** WebP copy planning. */
final class RankWeb_Webp {

	/** The mime types that get a copy. */
	const MIMES = array( 'image/jpeg', 'image/png' );

	/**
	 * Every file of an image that should have a copy: the original and each size.
	 *
	 * @param string $file  The original's path.
	 * @param array  $sizes The attachment metadata's sizes (name => [ 'file' => name ]).
	 * @return string[] Paths.
	 */
	public static function files( string $file, array $sizes ): array {
		if ( '' === $file || ! preg_match( '/\.(?:jpe?g|png)$/i', $file ) ) {
			return array();
		}
		$dir = rtrim( dirname( $file ), '/' );
		$out = array( $file => $file );
		foreach ( $sizes as $s ) {
			$name = is_array( $s ) ? (string) ( $s['file'] ?? '' ) : '';
			if ( '' !== $name && false === strpos( $name, '/' ) && preg_match( '/\.(?:jpe?g|png)$/i', $name ) ) {
				$out[ $dir . '/' . $name ] = $dir . '/' . $name;
			}
		}
		return array_values( $out );
	}

	/**
	 * The files still without a copy.
	 *
	 * @param string[] $files  From files().
	 * @param callable $exists Called with a path; true when the path exists.
	 * @return string[]
	 */
	public static function missing( array $files, callable $exists ): array {
		return array_values( array_filter( $files, static fn( $f ) => $exists( $f ) && ! $exists( $f . '.webp' ) ) );
	}
}
