<?php
/**
 * The page-speed pipeline (module "speed"): turns on only what the settings ask for, all off by default.
 *
 * - Delay scripts until the visitor interacts (script handles you list).
 * - Shrink the site's own CSS files and drop rules no element on the page can match (inlined for the page).
 * - Local Google Fonts: downloads the font files once and serves them from this site. This is the one feature that calls an
 *   outside address (fonts.googleapis.com and fonts.gstatic.com, only for the fonts a page already asks for).
 * - Serve a .webp copy of an image when one exists next to it (made by RankWeb → Page speed → Convert).
 * - A page cache for signed-out visitors, stored in wp-content/cache/rankweb.
 *
 * The rewrite rules are in class-rankweb-html-rules.php, the cache rules in class-rankweb-page-cache.php. Nothing here runs
 * for a signed-in visitor, in the admin, or on a request that is not a plain page.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-speed.php';
require_once __DIR__ . '/class-rankweb-html-rules.php';
require_once __DIR__ . '/class-rankweb-page-cache.php';

/** A speed setting (a constant the settings screen defines), with a default. */
function rankweb_speed_on( string $const ): bool {
	return defined( $const ) && (bool) constant( $const );
}

/** The folder of cached pages. */
function rankweb_cache_dir(): string {
	return trailingslashit( WP_CONTENT_DIR ) . 'cache/rankweb/';
}

/** The folder of local font copies (inside uploads, so it has an address). */
function rankweb_fonts_dir(): array {
	$u = wp_get_upload_dir();
	return array( trailingslashit( $u['basedir'] ) . 'rankweb-fonts/', trailingslashit( $u['baseurl'] ) . 'rankweb-fonts/' );
}

/** Remove every cached page. */
function rankweb_cache_clear(): void {
	foreach ( (array) glob( rankweb_cache_dir() . '*.html' ) as $f ) {
		if ( is_file( $f ) ) {
			@unlink( $f ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions -- the cache folder is ours
		}
	}
}

foreach ( array( 'save_post', 'deleted_post', 'trashed_post', 'comment_post', 'edit_comment', 'transition_comment_status', 'switch_theme', 'wp_update_nav_menu', 'update_option_aw_seo_settings', 'update_option_sidebars_widgets', 'customize_save_after', 'edited_term', 'created_term', 'delete_term', 'upgrader_process_complete', 'activated_plugin', 'deactivated_plugin' ) as $rankweb_hook ) {
	add_action( $rankweb_hook, 'rankweb_cache_clear' );
}

add_action(
	'admin_bar_menu',
	function ( $bar ) {
		if ( rankweb_speed_on( 'RANKWEB_PAGE_CACHE' ) && current_user_can( 'manage_options' ) ) {
			$bar->add_node(
				array(
					'id'    => 'rankweb-cache-clear',
					'title' => esc_html__( 'Clear page cache', 'rankweb' ),
					'href'  => wp_nonce_url( admin_url( 'admin-post.php?action=rankweb_cache_clear' ), 'rankweb_cache_clear' ),
				)
			);
		}
	},
	90
);
add_action(
	'admin_post_rankweb_cache_clear',
	function () {
		if ( current_user_can( 'manage_options' ) && check_admin_referer( 'rankweb_cache_clear' ) ) {
			rankweb_cache_clear();
		}
		wp_safe_redirect( wp_get_referer() ?: admin_url() );
		exit;
	}
);

/** The cookies' names and the request facts the cache rules read. */
function rankweb_cache_request(): array {
	return array(
		'method'  => (string) ( $_SERVER['REQUEST_METHOD'] ?? '' ),
		'cookies' => array_keys( (array) $_COOKIE ),
		'query'   => (string) ( $_SERVER['QUERY_STRING'] ?? '' ),
		'path'    => (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ),
	);
}

// Serve a cached copy before WordPress builds the page.
add_action(
	'init',
	function () {
		if ( ! rankweb_speed_on( 'RANKWEB_PAGE_CACHE' ) || wp_doing_ajax() || wp_doing_cron() || is_admin() ) {
			return;
		}
		$req = rankweb_cache_request();
		if ( ! RankWeb_Page_Cache::cacheable_request( $req ) ) {
			return;
		}
		$file = rankweb_cache_dir() . RankWeb_Page_Cache::file_name( (string) ( $_SERVER['HTTP_HOST'] ?? '' ), $req['path'] );
		if ( is_readable( $file ) && RankWeb_Page_Cache::fresh( (int) filemtime( $file ), (int) ( defined( 'RANKWEB_CACHE_HOURS' ) ? RANKWEB_CACHE_HOURS : 12 ), time() ) ) {
			header( 'X-RankWeb-Cache: HIT' );
			header( 'Content-Type: text/html; charset=' . get_option( 'blog_charset' ) );
			readfile( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			exit;
		}
	},
	0
);

/* ---------- script tags (delay) ---------- */

add_filter(
	'script_loader_tag',
	function ( $tag, $handle ) {
		if ( is_admin() || is_user_logged_in() || ! defined( 'RANKWEB_DELAY_SCRIPTS' ) ) {
			return $tag;
		}
		return RankWeb_Html_Rules::delay_tag( (string) $tag, (string) $handle, RankWeb_Speed::handles( RANKWEB_DELAY_SCRIPTS ) );
	},
	11,
	2
);

/* ---------- the page ---------- */

/** Whether the pipeline should look at this page at all. */
function rankweb_pipeline_wanted(): bool {
	if ( is_admin() || is_user_logged_in() || is_feed() || is_preview() || is_customize_preview() || wp_doing_ajax() || 'GET' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) {
		return false;
	}
	foreach ( array( 'RANKWEB_DELAY_SCRIPTS', 'RANKWEB_MINIFY_CSS', 'RANKWEB_PRUNE_CSS', 'RANKWEB_LOCAL_FONTS', 'RANKWEB_WEBP_SERVE', 'RANKWEB_PAGE_CACHE' ) as $c ) {
		if ( defined( $c ) && constant( $c ) ) {
			return true;
		}
	}
	return false;
}

add_action(
	'template_redirect',
	function () {
		if ( ! rankweb_pipeline_wanted() ) {
			return;
		}
		ob_start( 'rankweb_pipeline_output' );
	},
	0
);

/** The output buffer callback: the rewrites, then the cache write. */
function rankweb_pipeline_output( $html ) {
	if ( ! is_string( $html ) || false === stripos( $html, '</html>' ) || false === stripos( $html, '<head' ) ) {
		return $html;
	}
	$page = $html;
	try {
		if ( rankweb_speed_on( 'RANKWEB_MINIFY_CSS' ) || rankweb_speed_on( 'RANKWEB_PRUNE_CSS' ) ) {
			$page = rankweb_pipeline_css( $page );
		}
		if ( rankweb_speed_on( 'RANKWEB_LOCAL_FONTS' ) ) {
			$page = rankweb_pipeline_fonts( $page );
		}
		if ( rankweb_speed_on( 'RANKWEB_WEBP_SERVE' ) ) {
			$u    = wp_get_upload_dir();
			$page = RankWeb_Html_Rules::swap_webp(
				$page,
				(string) $u['baseurl'],
				static function ( $url ) use ( $u ) {
					$file = $u['basedir'] . substr( $url, strlen( rtrim( (string) $u['baseurl'], '/' ) ) );
					return false === strpos( $file, '..' ) && is_file( $file . '.webp' );
				}
			);
		}
		if ( false !== strpos( $page, 'type="rankweb/delayed"' ) ) {
			$page = str_ireplace( '</body>', RankWeb_Html_Rules::delay_loader() . '</body>', $page );
		}
	} catch ( \Throwable $e ) {
		$page = $html; // never break a page for a speed rule
	}
	if ( rankweb_speed_on( 'RANKWEB_PAGE_CACHE' ) && RankWeb_Page_Cache::cacheable_request( rankweb_cache_request() )
		&& RankWeb_Page_Cache::storable_page( array( 'status' => http_response_code() ?: 200, 'html' => $page, 'is_404' => is_404(), 'is_search' => is_search(), 'is_preview' => is_preview(), 'is_feed' => is_feed(), 'is_user_logged_in' => is_user_logged_in(), 'is_dynamic' => ( function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() ) ) || false !== stripos( $page, '_wpnonce' ) ) ) ) {
		$dir = rankweb_cache_dir();
		if ( wp_mkdir_p( $dir ) ) {
			if ( ! file_exists( $dir . 'index.html' ) ) {
				file_put_contents( $dir . 'index.html', '' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			}
			$req = rankweb_cache_request();
			file_put_contents( $dir . RankWeb_Page_Cache::file_name( (string) ( $_SERVER['HTTP_HOST'] ?? '' ), $req['path'] ), $page . "\n<!-- Cached by RankWeb " . gmdate( 'c' ) . " -->", LOCK_EX ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		}
	}
	return $page;
}

/** The site's own stylesheet files as inline, shrunk and pruned styles. */
function rankweb_pipeline_css( string $page ): string {
	$home   = untrailingslashit( home_url() );
	$safe   = defined( 'RANKWEB_PRUNE_SAFELIST' ) ? array_filter( array_map( 'trim', (array) RANKWEB_PRUNE_SAFELIST ) ) : array();
	$prune  = rankweb_speed_on( 'RANKWEB_PRUNE_CSS' );
	$limit  = 400000; // a file bigger than this is left as it is
	return (string) preg_replace_callback(
		'#<link\b[^>]*rel=["\']stylesheet["\'][^>]*>#i',
		static function ( $m ) use ( $home, $safe, $prune, $limit, $page ) {
			if ( ! preg_match( '#href=["\']([^"\']+)["\']#i', $m[0], $h ) || preg_match( '#\bmedia=["\'](?!all|screen)#i', $m[0] ) ) {
				return $m[0];
			}
			$url = html_entity_decode( $h[1], ENT_QUOTES, 'UTF-8' );
			if ( 0 !== strpos( $url, $home . '/' ) || false === strpos( strtok( $url, '?' ), '.css' ) ) {
				return $m[0];
			}
			$path = ABSPATH . ltrim( substr( strtok( $url, '?' ), strlen( $home ) ), '/' );
			if ( false !== strpos( $path, '..' ) || ! is_readable( $path ) || filesize( $path ) > $limit ) {
				return $m[0];
			}
			$css = (string) file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			if ( preg_match( '#url\(\s*(?![\'"]?(?:data:|https?:|/|\#))#i', $css ) ) {
				return $m[0]; // relative addresses would break once the file is inlined
			}
			$out = $prune ? RankWeb_Html_Rules::prune_css( $css, $page, $safe ) : $css;
			$out = RankWeb_Html_Rules::minify_css( $out );
			return '<style data-rankweb-from="' . esc_attr( basename( $path ) ) . '">' . str_ireplace( '</style', '<\/style', $out ) . '</style>';
		},
		$page
	);
}

/** Google Fonts links replaced by local copies (downloaded the first time). */
function rankweb_pipeline_fonts( string $page ): string {
	foreach ( RankWeb_Html_Rules::google_font_links( $page ) as $tag => $href ) {
		$local = rankweb_local_font_css( $href );
		if ( '' !== $local ) {
			$page = str_replace( $tag, '<link rel="stylesheet" href="' . esc_url( $local ) . '" />', $page );
		}
	}
	return $page;
}

/**
 * The address of a local copy of a Google Fonts stylesheet, downloading it first if needed. Calls fonts.googleapis.com and
 * fonts.gstatic.com (and only those) from the server, once per stylesheet; a failure leaves the page on Google's own link.
 */
function rankweb_local_font_css( string $href ): string {
	if ( 'fonts.googleapis.com' !== strtolower( (string) wp_parse_url( $href, PHP_URL_HOST ) ) ) {
		return '';
	}
	[ $dir, $url ] = rankweb_fonts_dir();
	$name          = sha1( $href ) . '.css';
	if ( is_readable( $dir . $name ) ) {
		return $url . $name;
	}
	if ( get_transient( 'rankweb_font_fail_' . md5( $href ) ) || ! wp_mkdir_p( $dir ) ) {
		return '';
	}
	$res = wp_safe_remote_get( $href, array( 'timeout' => 8, 'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' ) ); // a browser name, so Google sends woff2 files
	$css = is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ? '' : (string) wp_remote_retrieve_body( $res );
	if ( '' === $css ) {
		set_transient( 'rankweb_font_fail_' . md5( $href ), 1, HOUR_IN_SECONDS );
		return '';
	}
	$map = array();
	foreach ( array_slice( RankWeb_Html_Rules::font_files( $css ), 0, 40 ) as $file ) {
		$f   = RankWeb_Html_Rules::font_name( $file );
		$got = wp_safe_remote_get( $file, array( 'timeout' => 8 ) );
		if ( is_wp_error( $got ) || 200 !== (int) wp_remote_retrieve_response_code( $got ) ) {
			set_transient( 'rankweb_font_fail_' . md5( $href ), 1, HOUR_IN_SECONDS );
			return ''; // all or nothing: a half-local stylesheet is worse than Google's own
		}
		file_put_contents( $dir . $f, wp_remote_retrieve_body( $got ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		$map[ $file ] = $url . $f;
	}
	file_put_contents( $dir . $name, RankWeb_Html_Rules::localize_font_css( $css, $map ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	return $url . $name;
}
