<?php
/**
 * Image sitemap: the images a page shows, as <image:image> entries under the page's address. Pure PHP, no WordPress, so
 * tests/ImageSitemapTest.php runs it. Reads img tags from a page's content, resolves addresses against the site, leaves
 * out data: addresses, tracking pixels and repeats, and writes the XML (Google reads only <image:loc>; the title and
 * caption tags are retired, so they are not written).
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Image sitemap XML. */
final class RankWeb_Image_Sitemap {

	/** Google reads at most this many images for one page. */
	const MAX_PER_PAGE = 1000;

	/**
	 * The image addresses in some HTML, absolute, first seen first.
	 *
	 * @param string $html Content.
	 * @param string $base The site's address with no trailing slash (for src="/wp-content/x.jpg").
	 * @return string[]
	 */
	public static function extract( string $html, string $base ): array {
		$out  = array();
		$base = rtrim( $base, '/' );
		if ( ! preg_match_all( '/<img\b[^>]*>/i', $html, $tags ) ) {
			return $out;
		}
		foreach ( $tags[0] as $tag ) {
			if ( ! preg_match( '/\bsrc\s*=\s*(?:"([^"]*)"|\'([^\']*)\')/i', $tag, $m ) ) {
				continue;
			}
			$src = html_entity_decode( trim( '' !== $m[1] ? $m[1] : ( $m[2] ?? '' ) ), ENT_QUOTES, 'UTF-8' );
			if ( '' === $src || 0 === stripos( $src, 'data:' ) ) {
				continue;
			}
			if ( 0 === strpos( $src, '//' ) ) {
				$src = ( (string) parse_url( $base, PHP_URL_SCHEME ) ?: 'https' ) . ':' . $src;
			} elseif ( 0 === strpos( $src, '/' ) ) {
				$src = $base . $src;
			} elseif ( ! preg_match( '#^https?://#i', $src ) ) {
				continue; // a relative path with no base page to resolve it against
			}
			if ( preg_match( '/\b(?:width|height)\s*=\s*["\']?1["\']?(?=[\s>\/"\'])/i', $tag ) ) {
				continue; // a one-pixel image is a tracker, not content
			}
			$out[ $src ] = $src;
		}
		return array_values( $out );
	}

	/**
	 * The XML.
	 *
	 * @param array[] $pages Each: loc (page address), lastmod (ISO 8601, optional), images (addresses).
	 * @param callable|null $esc Escapes a value for XML (esc_xml in WordPress); default is a plain escape.
	 * @return string
	 */
	public static function xml( array $pages, ?callable $esc = null ): string {
		$esc = $esc ?? static fn( $s ) => htmlspecialchars( (string) $s, ENT_XML1 | ENT_QUOTES, 'UTF-8' );
		$x   = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";
		foreach ( $pages as $p ) {
			$imgs = array_slice( array_values( array_unique( array_filter( array_map( 'strval', (array) ( $p['images'] ?? array() ) ) ) ) ), 0, self::MAX_PER_PAGE );
			if ( ! $imgs || '' === (string) ( $p['loc'] ?? '' ) ) {
				continue; // a page with no images has no entry here
			}
			$x .= "\t<url>\n\t\t<loc>" . $esc( $p['loc'] ) . "</loc>\n";
			if ( ! empty( $p['lastmod'] ) ) {
				$x .= "\t\t<lastmod>" . $esc( $p['lastmod'] ) . "</lastmod>\n";
			}
			foreach ( $imgs as $img ) {
				$x .= "\t\t<image:image>\n\t\t\t<image:loc>" . $esc( $img ) . "</image:loc>\n\t\t</image:image>\n";
			}
			$x .= "\t</url>\n";
		}
		return $x . '</urlset>' . "\n";
	}
}
