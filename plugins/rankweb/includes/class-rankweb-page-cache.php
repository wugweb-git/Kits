<?php
/**
 * Page cache rules: which requests may be served from, and stored in, a cached copy of the page, and how a copy is named
 * and aged. Pure PHP, no WordPress, so tests/PageCacheTest.php runs it; includes/speed-pipeline.php does the file work.
 * Only a signed-out visitor's plain GET of an ordinary page is cached.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Page cache rules. */
final class RankWeb_Page_Cache {

	/** Cookie name starts that mean a request is personal. */
	const PERSONAL_COOKIES = array( 'wordpress_logged_in_', 'wp-postpass_', 'comment_author_', 'woocommerce_items_in_cart', 'woocommerce_cart_hash', 'wp_woocommerce_session_', 'edd_wp_session' );

	/** Query parameters that do not change the page. */
	const IGNORED_QUERY = '/^(?:utm_[a-z]+|fbclid|gclid|msclkid|mc_[a-z]+|_ga|ref)$/i';

	/**
	 * Whether a request may use the cache.
	 *
	 * @param array $req method, cookies (names), query (raw string), path.
	 */
	public static function cacheable_request( array $req ): bool {
		if ( 'GET' !== strtoupper( (string) ( $req['method'] ?? '' ) ) ) {
			return false;
		}
		foreach ( (array) ( $req['cookies'] ?? array() ) as $name ) {
			foreach ( self::PERSONAL_COOKIES as $p ) {
				if ( 0 === strpos( (string) $name, $p ) ) {
					return false;
				}
			}
		}
		if ( '' !== self::normal_query( (string) ( $req['query'] ?? '' ) ) ) {
			return false; // a page with its own query (search, preview, filters) is not cached
		}
		return ! preg_match( '#/(?:wp-admin|wp-login\.php|wp-json|xmlrpc\.php|wp-cron\.php)#', (string) ( $req['path'] ?? '' ) ) && ! preg_match( '#/feed/?$#', (string) ( $req['path'] ?? '' ) );
	}

	/** The query with the parameters that do not change the page removed. */
	public static function normal_query( string $q ): string {
		$keep = array();
		foreach ( explode( '&', ltrim( $q, '?' ) ) as $pair ) {
			if ( '' === $pair ) {
				continue;
			}
			$k = urldecode( explode( '=', $pair, 2 )[0] );
			if ( ! preg_match( self::IGNORED_QUERY, $k ) ) {
				$keep[] = $pair;
			}
		}
		sort( $keep );
		return implode( '&', $keep );
	}

	/**
	 * Whether the finished page may be stored.
	 *
	 * @param array $page status (int), html (string), is_404, is_search, is_preview, is_feed, is_user_logged_in, is_dynamic (bool).
	 */
	public static function storable_page( array $page ): bool {
		if ( 200 !== (int) ( $page['status'] ?? 0 ) || ! empty( $page['is_404'] ) || ! empty( $page['is_search'] ) || ! empty( $page['is_preview'] ) || ! empty( $page['is_feed'] ) || ! empty( $page['is_user_logged_in'] ) || ! empty( $page['is_dynamic'] ) ) { // is_dynamic: a cart, checkout or account page, or a page with a form nonce: never stored
			return false;
		}
		$html = (string) ( $page['html'] ?? '' );
		return false !== stripos( $html, '</html>' ) && false === stripos( $html, 'rankweb-no-cache' );
	}

	/** The file name for a page: a hash of the host and the path, so a path cannot name a file outside the folder. */
	public static function file_name( string $host, string $path ): string {
		return sha1( strtolower( $host ) . '|' . rtrim( $path, '/' ) ) . '.html';
	}

	/** Whether a copy written at $mtime is still good. */
	public static function fresh( int $mtime, int $hours, int $now ): bool {
		return $hours > 0 && $mtime > 0 && ( $now - $mtime ) < $hours * 3600;
	}
}
