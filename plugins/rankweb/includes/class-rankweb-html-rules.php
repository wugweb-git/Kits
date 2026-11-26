<?php
/**
 * Rules that rewrite a page's HTML or CSS for speed: delay chosen scripts until the visitor interacts, shrink CSS, drop CSS
 * rules no element on the page can match, point Google Fonts at local copies, and serve WebP copies of images. Pure PHP, no
 * WordPress, so tests/HtmlRulesTest.php runs it; includes/speed-pipeline.php feeds it the page. Every rule errs on the side
 * of leaving things as they were.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** HTML and CSS rewrite rules. */
final class RankWeb_Html_Rules {

	/** Class and id names that scripts often add later: rules naming them are never dropped. */
	const SAFE_NAMES = '/^(?:is-|has-|js-|no-js|wp-|elementor|et_|fl-|woocommerce|admin-bar|screen-reader|sr-only|active|open|opened|close|show|hide|hidden|visible|fixed|sticky|stuck|scroll|loaded|loading|expanded|collapsed|current|selected|disabled|focus|hover|dark|light|mobile|desktop|menu|nav|slide|slick|swiper|owl|fade|in$|out$|collapse|modal|tooltip|popover|dropdown|toggle)/i';

	/* ---------- Delay scripts ---------- */

	/**
	 * A script tag held back until the visitor interacts, when its handle is on the list. An inline script, a module, or
	 * one with another type is left alone.
	 */
	public static function delay_tag( string $tag, string $handle, array $handles ): string {
		if ( ! in_array( $handle, $handles, true ) || false === stripos( $tag, ' src=' ) || preg_match( '/\stype=["\'](?!text\/javascript)/i', $tag ) ) {
			return $tag;
		}
		$tag = preg_replace( '/<script\b/i', '<script type="rankweb/delayed"', $tag, 1 );
		return preg_replace( '/\ssrc=/i', ' data-rankweb-src=', $tag, 1 );
	}

	/** The small script that loads the held-back scripts, in order, on the first scroll, click, key press or touch (or after 8 seconds). */
	public static function delay_loader(): string {
		return '<script id="rankweb-delay-loader">(function(){var d=false,e=["scroll","click","keydown","touchstart","mousemove"];function r(){if(d){return}d=true;e.forEach(function(n){removeEventListener(n,r)});var s=[].slice.call(document.querySelectorAll(\'script[type="rankweb/delayed"]\'));(function n(){var o=s.shift();if(!o){return}var t=document.createElement("script");[].forEach.call(o.attributes,function(a){if(a.name==="data-rankweb-src"){t.src=a.value}else if(a.name!=="type"){t.setAttribute(a.name,a.value)}});t.onload=t.onerror=n;o.parentNode.replaceChild(t,o)})()}e.forEach(function(n){addEventListener(n,r,{passive:true,once:true})});setTimeout(r,8000)})();</script>';
	}

	/* ---------- CSS ---------- */

	/** CSS with comments and extra spaces taken out. Text in quotes is not touched. */
	public static function minify_css( string $css ): string {
		$parts = preg_split( '/("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')/', $css, -1, PREG_SPLIT_DELIM_CAPTURE );
		$out   = '';
		foreach ( $parts as $i => $p ) {
			if ( 1 === $i % 2 ) {
				$out .= $p; // a string
				continue;
			}
			$p    = preg_replace( '#/\*.*?\*/#s', '', $p );
			$p    = preg_replace( '/\s+/', ' ', $p );
			$p    = preg_replace( '/\s*([{};,>])\s*/', '$1', $p );
			$p    = str_replace( ';}', '}', $p );
			$out .= $p;
		}
		return trim( $out );
	}

	/**
	 * CSS without the rules that name a class or id found nowhere in the page. A selector is kept when it has an attribute,
	 * :not(), :is(), :where() or :has() part, names something on the safe list or the extra safe list, or when every name
	 * it uses appears anywhere in the HTML (scripts and inline styles included). At-rules other than @media, @supports and
	 * @layer blocks are kept whole.
	 *
	 * @param string   $css   One stylesheet.
	 * @param string   $html  The page.
	 * @param string[] $safe  Extra names (prefixes) never to drop.
	 */
	public static function prune_css( string $css, string $html, array $safe = array() ): string {
		$out = '';
		foreach ( self::blocks( $css ) as $b ) {
			[ $prelude, $body ] = $b;
			if ( null === $body ) {
				$out .= $prelude; // a statement such as @import or @charset
				continue;
			}
			$p = trim( $prelude );
			if ( preg_match( '/^@(?:media|supports|layer)\b/i', $p ) ) {
				$inner = self::prune_css( $body, $html, $safe );
				$out  .= '' !== trim( $inner ) ? $prelude . '{' . $inner . '}' : '';
			} elseif ( '@' === substr( $p, 0, 1 ) ) {
				$out .= $prelude . '{' . $body . '}';
			} else {
				$keep = array();
				foreach ( self::split_selectors( $p ) as $sel ) {
					if ( self::selector_may_match( $sel, $html, $safe ) ) {
						$keep[] = $sel;
					}
				}
				$out .= $keep ? implode( ',', $keep ) . '{' . $body . '}' : '';
			}
		}
		return $out;
	}

	/** Top-level blocks: [ prelude, body ] (body null for a statement ending in ; ). */
	private static function blocks( string $css ): array {
		$res   = array();
		$len   = strlen( $css );
		$start = 0;
		$depth = 0;
		$pre   = '';
		$q     = '';
		for ( $i = 0; $i < $len; $i++ ) {
			$c = $css[ $i ];
			if ( '' !== $q ) {
				if ( '\\' === $c ) {
					++$i;
				} elseif ( $c === $q ) {
					$q = '';
				}
				continue;
			}
			if ( '"' === $c || "'" === $c ) {
				$q = $c;
			} elseif ( '/' === $c && '*' === ( $css[ $i + 1 ] ?? '' ) ) {
				$e = strpos( $css, '*/', $i + 2 );
				$i = false === $e ? $len : $e + 1;
			} elseif ( '{' === $c ) {
				if ( 0 === $depth ) {
					$pre   = substr( $css, $start, $i - $start );
					$start = $i + 1;
				}
				++$depth;
			} elseif ( '}' === $c ) {
				--$depth;
				if ( 0 === $depth ) {
					$res[] = array( $pre, substr( $css, $start, $i - $start ) );
					$start = $i + 1;
				} elseif ( $depth < 0 ) {
					return array( array( $css, null ) ); // not balanced: leave it all alone
				}
			} elseif ( ';' === $c && 0 === $depth ) {
				$res[] = array( substr( $css, $start, $i - $start + 1 ), null );
				$start = $i + 1;
			}
		}
		if ( 0 !== $depth ) {
			return array( array( $css, null ) );
		}
		if ( trim( substr( $css, $start ) ) !== '' ) {
			$res[] = array( substr( $css, $start ), null );
		}
		return $res;
	}

	/** A selector list split at commas outside brackets. */
	private static function split_selectors( string $list ): array {
		$out   = array();
		$depth = 0;
		$cur   = '';
		foreach ( str_split( $list ) as $c ) {
			if ( '(' === $c || '[' === $c ) {
				++$depth;
			} elseif ( ')' === $c || ']' === $c ) {
				--$depth;
			}
			if ( ',' === $c && 0 === $depth ) {
				$out[] = trim( $cur );
				$cur   = '';
			} else {
				$cur .= $c;
			}
		}
		if ( '' !== trim( $cur ) ) {
			$out[] = trim( $cur );
		}
		return $out;
	}

	/** Whether a selector could match something on the page. */
	private static function selector_may_match( string $sel, string $html, array $safe ): bool {
		if ( preg_match( '/\[|:not\(|:is\(|:where\(|:has\(|:host|:root/i', $sel ) ) {
			return true;
		}
		if ( ! preg_match_all( '/[.#](-?[_a-zA-Z][_a-zA-Z0-9-]*)/', preg_replace( '/\\\\./', '', $sel ), $m ) ) {
			return true; // tags and pseudo-classes only
		}
		foreach ( $m[1] as $name ) {
			if ( preg_match( self::SAFE_NAMES, $name ) ) {
				continue;
			}
			foreach ( $safe as $s ) {
				if ( '' !== $s && 0 === strpos( $name, $s ) ) {
					continue 2;
				}
			}
			if ( false === strpos( $html, $name ) ) {
				return false;
			}
		}
		return true;
	}

	/* ---------- Google Fonts ---------- */

	/** The Google Fonts stylesheet addresses linked in a page. */
	public static function google_font_links( string $html ): array {
		if ( ! preg_match_all( '#<link\b[^>]*href=["\'](https?:)?(//fonts\.googleapis\.com/[^"\']+)["\'][^>]*>#i', $html, $m, PREG_SET_ORDER ) ) {
			return array();
		}
		$out = array();
		foreach ( $m as $x ) {
			$out[ $x[0] ] = 'https:' . html_entity_decode( $x[2], ENT_QUOTES, 'UTF-8' );
		}
		return $out;
	}

	/** The font file addresses a Google Fonts stylesheet loads (only fonts.gstatic.com). */
	public static function font_files( string $css ): array {
		preg_match_all( '#url\(\s*[\'"]?(https://fonts\.gstatic\.com/[^)\'"\s]+)[\'"]?\s*\)#i', $css, $m );
		return array_values( array_unique( $m[1] ) );
	}

	/** The stylesheet with font addresses replaced by the local ones (map: remote => local). */
	public static function localize_font_css( string $css, array $map ): string {
		return strtr( $css, $map );
	}

	/** A file name for a font address: a hash and the original extension. */
	public static function font_name( string $url ): string {
		$ext = strtolower( pathinfo( (string) parse_url( $url, PHP_URL_PATH ), PATHINFO_EXTENSION ) );
		return sha1( $url ) . '.' . ( preg_match( '/^(woff2?|ttf|otf)$/', $ext ) ? $ext : 'woff2' );
	}

	/* ---------- WebP ---------- */

	/**
	 * The page with image addresses under $base pointed at their WebP copy (the same address plus .webp) when it exists.
	 *
	 * @param string   $html   Page.
	 * @param string   $base   Uploads address, e.g. https://example.com/wp-content/uploads.
	 * @param callable $exists Called with an address; true when the WebP copy of it exists.
	 */
	public static function swap_webp( string $html, string $base, callable $exists ): string {
		$base = rtrim( $base, '/' );
		$re   = '#' . preg_quote( $base, '#' ) . '/[^\s"\'<>(),]+?\.(?:jpe?g|png)(?=[\s"\'<>(),?]|$)#i';
		$seen = array();
		return (string) preg_replace_callback(
			$re,
			static function ( $m ) use ( $exists, &$seen ) {
				$u = $m[0];
				if ( ! isset( $seen[ $u ] ) ) {
					$seen[ $u ] = (bool) $exists( $u );
				}
				return $seen[ $u ] ? $u . '.webp' : $u;
			},
			$html
		);
	}
}
