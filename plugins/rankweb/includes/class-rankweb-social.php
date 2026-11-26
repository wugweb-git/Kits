<?php
/**
 * Small social and feed helpers: the site's Twitter/X handle for the twitter:site tag, and the "appeared first on" line
 * added to feed items so a copy of the feed links back. Pure PHP, no WordPress, so tests/SocialTest.php runs it.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Social and feed text. */
final class RankWeb_Social {

	/** A handle as "@name" (letters, digits, underscore, up to 15), else ''. Accepts the name, "@name" or a profile address. */
	public static function handle( $v ): string {
		$v = trim( (string) $v );
		if ( preg_match( '#^https?://(?:www\.)?(?:twitter|x)\.com/([A-Za-z0-9_]{1,15})/?$#i', $v, $m ) ) {
			$v = $m[1];
		}
		$v = ltrim( $v, '@' );
		return preg_match( '/^[A-Za-z0-9_]{1,15}$/', $v ) ? '@' . $v : '';
	}

	/**
	 * The line added after a feed item.
	 *
	 * @param string $title Item title (plain text).
	 * @param string $url   Item address.
	 * @param string $site  Site name.
	 * @param string $home  Site address.
	 * @param callable $esc Escapes text for HTML (esc_html) and addresses (esc_url): called as $esc( value, 'html'|'url' ).
	 */
	public static function feed_line( string $title, string $url, string $site, string $home, callable $esc ): string {
		return '<p>' . sprintf(
			'The post <a href="%1$s">%2$s</a> appeared first on <a href="%3$s">%4$s</a>.',
			$esc( $url, 'url' ),
			$esc( $title, 'html' ),
			$esc( $home, 'url' ),
			$esc( $site, 'html' )
		) . '</p>';
	}
}
