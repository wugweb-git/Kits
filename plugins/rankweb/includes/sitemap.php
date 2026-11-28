<?php
/**
 * Rank Math sitemap (/sitemap_index.xml) additions:
 * - a "directory" sitemap (directory-sitemap.xml) of the Directory place pages (/directory/{state}/,
 *   /directory/{state}/{district}/) that have listings, and district × listing-type pages with listings. Places come
 *   from the LGD file (places.php); Rank Math knows nothing of these virtual pages.
 * - a "filtered" sitemap (filtered-sitemap.xml) of the indexable filtered hub lists (filtered-views.php), rebuilt
 *   once a day (event aw_seo_sitemap_daily), never on a request.
 * - both from one provider class (RankWeb_Rank_Math_Sitemap); this module's switch turns both off.
 * - no post-type archive links (the sections are Pages, listed in the page sitemap).
 * - Rank Math's stored sitemaps are cleared after saves through the REST API and WP-CLI too.
 * - an HTML sitemap for people and crawlers: [aw_html_sitemap] on the /sitemap/ page (made once), linked from the footer.
 * Items kept out of the index by a rule of their state are left out of every sitemap by robots.php, whether this
 * module is on or not.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** District × listing-type pairs with enough listings to be indexed (no state × type pages exist). Stored counts, places.php. */
function rankweb_sitemap_directory_pairs() {
	if ( ! function_exists( 'directoryweb_place_counts' ) ) { // DirectoryWeb is off
		return array();
	}
	$pairs = get_transient( 'aw_sitemap_dir_pairs' );
	if ( false !== $pairs ) {
		return $pairs;
	}
	$pairs = array();
	foreach ( directoryweb_place_counts()['pairs'] as $p ) {
		$d = directoryweb_place_district( $p[0] );
		if ( $d && ( $p[3] >= RANKWEB_THIN_DISTRICT_TYPE || rankweb_directory_keep_indexed( directoryweb_directory_url( $d->slug, $p[1] ) ) ) ) {
			$pairs[] = array( 'city' => $d->slug, 'type' => $p[1], 'modified' => $p[2], 'n' => $p[3] );
		}
	}
	usort( $pairs, fn( $x, $y ) => strcmp( $x['city'] . '/' . $x['type'], $y['city'] . '/' . $y['type'] ) );
	set_transient( 'aw_sitemap_dir_pairs', $pairs, 12 * HOUR_IN_SECONDS );
	return $pairs;
}

/** Directory place pages (states and districts with listings), then district × type pages. */
function rankweb_sitemap_directory_urls() {
	$urls = array();
	if ( ! function_exists( 'directoryweb_place_states' ) ) { // DirectoryWeb is off
		return $urls;
	}
	foreach ( directoryweb_place_states() as $st ) {
		if ( directoryweb_place_count( $st ) ) {
			$urls[] = array( 'loc' => directoryweb_directory_url( $st->slug ) );
		}
		foreach ( directoryweb_place_districts( $st->code ) as $d ) {
			if ( directoryweb_place_count( $d ) ) {
				$urls[] = array( 'loc' => directoryweb_directory_url( $d->slug ) );
			}
		}
	}
	foreach ( rankweb_sitemap_directory_pairs() as $r ) {
		$urls[] = array( 'loc' => directoryweb_directory_url( $r['city'], $r['type'] ), 'lastmod' => gmdate( 'c', strtotime( $r['modified'] . ' UTC' ) ) );
	}
	return $urls;
}

/**
 * The indexable filtered hub lists (filtered-views.php) as the daily job below last stored them. Before its first run
 * they are built on the spot (and not stored).
 *
 * @return array List of ['loc' => URL].
 */
function rankweb_sitemap_filtered_urls() {
	if ( ! function_exists( 'rankweb_sitemap_filtered_build' ) ) {
		return array(); // the Filtered views module is off: no filtered lists
	}
	$urls = get_option( 'aw_sitemap_filtered' );
	return is_array( $urls ) ? $urls : rankweb_sitemap_filtered_build();
}

/** Daily: filtered-sitemap.xml is rebuilt (never on a request), and Rank Math's stored copy of it is cleared. */
function rankweb_sitemap_filtered_rebuild() {
	if ( ! function_exists( 'rankweb_sitemap_filtered_build' ) ) {
		return; // the Filtered views module is off
	}
	update_option( 'aw_sitemap_filtered', rankweb_sitemap_filtered_build(), false );
	if ( class_exists( '\RankMath\Sitemap\Cache_Watcher' ) ) {
		\RankMath\Sitemap\Cache_Watcher::invalidate( 'filtered' );
		add_action( 'shutdown', array( 'RankMath\Sitemap\Cache_Watcher', 'clear_queued' ) );
	}
}
add_action( 'aw_seo_sitemap_daily', 'rankweb_sitemap_filtered_rebuild' );
add_action(
	'admin_init',
	function () {
		if ( ! wp_next_scheduled( 'aw_seo_sitemap_daily' ) ) {
			wp_schedule_event( time() + 600, 'daily', 'aw_seo_sitemap_daily' );
		}
	}
);

/**
 * One page of a list of URLs as Rank Math's sitemap links.
 *
 * @param array $urls         List of ['loc' => URL, 'lastmod' => date (optional)].
 * @param int   $max_entries  Links per sitemap page.
 * @param int   $current_page Page, from 1.
 * @return array
 */
function rankweb_sitemap_page_links( array $urls, $max_entries, $current_page ) {
	$max_entries = max( 1, (int) $max_entries );
	$chunk       = array_slice( $urls, ( max( 1, (int) $current_page ) - 1 ) * $max_entries, $max_entries );
	return array_map( fn( $u ) => array_filter( array( 'loc' => $u['loc'], 'mod' => $u['lastmod'] ?? '' ) ), $chunk );
}

add_filter(
	'rank_math/sitemap/providers',
	function ( $providers ) {
		if ( ! interface_exists( '\RankMath\Sitemap\Providers\Provider' ) || ! class_exists( '\RankMath\Sitemap\Router' ) ) {
			return $providers;
		}
		if ( ! class_exists( 'RankWeb_Rank_Math_Sitemap' ) ) {
			/** The site's own sitemaps: directory-sitemap.xml and filtered-sitemap.xml (each paged by Rank Math's entries per sitemap). */
			class RankWeb_Rank_Math_Sitemap implements \RankMath\Sitemap\Providers\Provider {
				/** Sitemap type => function that lists its URLs. */
				const TYPES = array(
					'directory' => 'rankweb_sitemap_directory_urls',
					'filtered'  => 'rankweb_sitemap_filtered_urls',
				);

				public function handles_type( $type ) {
					return isset( self::TYPES[ $type ] );
				}

				public function get_index_links( $max_entries ) {
					$max_entries = max( 1, (int) $max_entries );
					$links       = array();
					foreach ( self::TYPES as $type => $source ) {
						$urls  = (array) call_user_func( $source );
						$pages = (int) ceil( count( $urls ) / $max_entries );
						for ( $i = 1; $i <= $pages; $i++ ) {
							$mods    = array_filter( wp_list_pluck( array_slice( $urls, ( $i - 1 ) * $max_entries, $max_entries ), 'lastmod' ) );
							$links[] = array_filter(
								array(
									'loc'     => \RankMath\Sitemap\Router::get_base_url( $type . '-sitemap' . ( $pages > 1 ? $i : '' ) . '.xml' ),
									'lastmod' => $mods ? max( $mods ) : '',
								)
							);
						}
					}
					return $links;
				}

				public function get_sitemap_links( $type, $max_entries, $current_page ) {
					return isset( self::TYPES[ $type ] ) ? rankweb_sitemap_page_links( (array) call_user_func( self::TYPES[ $type ] ), $max_entries, $current_page ) : array();
				}
			}
		}
		$providers[] = new RankWeb_Rank_Math_Sitemap();
		return $providers;
	}
);

add_filter( 'rank_math/sitemap/post_type_archive_link', '__return_false' );

/*
 * Rank Math keeps each sitemap as a stored file and only clears it from wp-admin screens and cron (its Cache_Watcher is
 * started only there). A post saved through the REST API (the block editor, admin REST writes) or WP-CLI left its
 * type's sitemap as it was, so a new item stayed out until the next admin save (2 Nov 2026: Library item 23678). The
 * same clearing Rank Math does is queued here for those requests and runs at the end of the request.
 */
add_action(
	'save_post',
	function ( $post_id, $post ) {
		if ( is_admin() || wp_doing_cron() || ! class_exists( '\RankMath\Sitemap\Cache_Watcher' ) ) {
			return; // Rank Math's own watcher runs there.
		}
		if ( wp_is_post_revision( $post_id ) || 'auto-draft' === $post->post_status || '' !== (string) $post->post_password ) {
			return; // As Rank Math: no clearing for revisions, auto-drafts or password-protected posts.
		}
		\RankMath\Sitemap\Cache_Watcher::invalidate_post( $post_id );
		add_action( 'shutdown', array( 'RankMath\Sitemap\Cache_Watcher', 'clear_queued' ) ); // the same callback Rank Math adds; added once
	},
	10,
	2
);

// Without Rank Math nothing maps /video-sitemap.xml or /image-sitemap.xml to a request, so the addresses robots.txt
// lists would be 404. Mapped here to the same sitemap=video and sitemap=image the handlers below and in video.php answer.
if ( function_exists( 'rankweb_seo_extras_rank_math' ) && ! rankweb_seo_extras_rank_math() ) {
	add_action(
		'parse_request',
		function ( $wp ) {
			$path = (string) wp_parse_url( (string) wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
			$home = rtrim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
			foreach ( array( 'video', 'image' ) as $kind ) {
				if ( $home . '/' . $kind . '-sitemap.xml' === $path ) {
					$wp->query_vars['sitemap'] = $kind;
				}
			}
		},
		-1
	);
}

/* ---------- Image sitemap: /image-sitemap.xml, only when RankWeb prints the head (Rank Math's own sitemap lists images) ---------- */

require_once __DIR__ . '/class-rankweb-image-sitemap.php';

/** Pages with their images, for the image sitemap: published, public, not noindex, newest first; cached six hours. */
function rankweb_image_sitemap_pages(): array {
	$cached = get_transient( 'rankweb_image_sitemap' );
	if ( is_array( $cached ) ) {
		return $cached;
	}
	$types = array_values( array_diff( array_keys( get_post_types( array( 'public' => true ) ) ), array( 'attachment' ) ) );
	$ids   = get_posts(
		array(
			'post_type'      => $types,
			'post_status'    => 'publish',
			'has_password'   => false,
			'fields'         => 'ids',
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'posts_per_page' => (int) apply_filters( 'rankweb_image_sitemap_limit', 500 ),
			'no_found_rows'  => true,
			'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery -- a cached, bounded list
				'relation' => 'AND',
				array(
					'relation' => 'OR',
					array( 'key' => '_rankweb_noindex', 'compare' => 'NOT EXISTS' ),
					array( 'key' => '_rankweb_noindex', 'value' => '1', 'compare' => '!=' ),
				),
			),
		)
	);
	$base  = untrailingslashit( home_url() );
	$pages = array();
	foreach ( $ids as $id ) {
		$post   = get_post( $id );
		$images = RankWeb_Image_Sitemap::extract( (string) $post->post_content, $base );
		$thumb  = get_the_post_thumbnail_url( $id, 'full' );
		if ( $thumb ) {
			array_unshift( $images, $thumb );
		}
		if ( $images ) {
			$pages[] = array( 'loc' => get_permalink( $id ), 'lastmod' => get_post_modified_time( 'c', true, $id ), 'images' => array_values( array_unique( $images ) ) );
		}
	}
	set_transient( 'rankweb_image_sitemap', $pages, 6 * HOUR_IN_SECONDS );
	return $pages;
}

/** The image sitemap's address. */
function rankweb_image_sitemap_url() {
	return home_url( '/image-sitemap.xml' );
}

if ( function_exists( 'rankweb_seo_extras_rank_math' ) && ! rankweb_seo_extras_rank_math() ) {
	add_action(
		'parse_request',
		function ( $wp ) {
			if ( 'image' !== ( $wp->query_vars['sitemap'] ?? '' ) ) {
				return;
			}
			if ( ! headers_sent() ) {
				status_header( 200 );
				header( 'Content-Type: application/xml; charset=UTF-8' );
				header( 'X-Robots-Tag: noindex, follow' );
			}
			echo RankWeb_Image_Sitemap::xml( rankweb_image_sitemap_pages(), 'esc_xml' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped per value
			exit;
		},
		0
	);
	add_action( 'save_post', fn() => delete_transient( 'rankweb_image_sitemap' ) );
	add_filter(
		'robots_txt',
		function ( $txt ) {
			$line = 'Sitemap: ' . rankweb_image_sitemap_url();
			return false !== strpos( (string) $txt, $line ) ? $txt : rtrim( (string) $txt ) . "\n" . $line . "\n";
		},
		61
	);
}

/* ---------- HTML sitemap: /sitemap/ (indexing work, owner 12 Nov 2026) ---------- */

/** The HTML sitemap page's address. */
const RANKWEB_HTML_SITEMAP_SLUG = 'sitemap';

/**
 * Links to every indexable section, item and Directory place, for people and crawlers: [aw_html_sitemap] on the
 * /sitemap/ page. Plain link lists and chips (kit.css), no new styles. Headings are the sections' own page titles and
 * the names of categories, states and districts. Left out: pages kept out of search (Rank Math's noindex), closed
 * opportunities, News items one by one (1,600+: their categories are linked) and listings one by one (their districts
 * are). Cached for 12 hours, worked out again when an item is saved.
 *
 * @return string HTML.
 */
function rankweb_html_sitemap() {
	$cached = get_transient( 'aw_html_sitemap' );
	if ( is_string( $cached ) && '' !== $cached ) {
		return $cached;
	}
	$list  = function ( array $links, $chips = false ) {
		if ( ! $links ) {
			return '';
		}
		$out = $chips ? '<ul class="kit-tags aw-term-chips">' : '<ul class="wp-block-list kit-links">';
		foreach ( $links as $l ) {
			$out .= '<li><a' . ( $chips ? ' class="kit-chip"' : '' ) . ' href="' . esc_url( $l[0] ) . '">' . esc_html( $l[1] ) . '</a></li>';
		}
		return $out . '</ul>';
	};
	$title = fn( $p ) => html_entity_decode( get_the_title( $p ), ENT_QUOTES );
	$noidx = function ( $id ) {
		$r = get_post_meta( (int) $id, 'rank_math_robots', true );
		return is_array( $r ) && in_array( 'noindex', $r, true );
	};
	$items = function ( $type ) use ( $title, $noidx ) {
		$ids = get_posts( array( 'post_type' => $type, 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids', 'orderby' => 'title', 'order' => 'ASC', 'suppress_filters' => true ) ); // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.SuppressFilters_suppress_filters -- our own fixed list: no query filter may reorder or add to it.
		$ids = array_values( array_diff( array_map( 'intval', $ids ), function_exists( 'rankweb_seo_preview_ids' ) ? array_map( 'intval', (array) rankweb_seo_preview_ids() ) : array() ) );
		$out = array();
		foreach ( $ids as $id ) {
			if ( $noidx( $id ) || ( rankweb_is_type( $type, 'opportunity' ) && function_exists( 'kits_retention_state' ) && kits_retention_state( get_post( $id ) ) ) ) {
				continue;
			}
			$out[] = array( get_permalink( $id ), $title( $id ) );
		}
		$key = fn( $l ) => mb_strtolower( preg_replace( '/^the\s+/i', '', $l[1] ) );
		usort( $out, fn( $a, $b ) => strcmp( $key( $a ), $key( $b ) ) );
		return $out;
	};
	$cats = function ( $type ) {
		$counts = function_exists( 'rankweb_seo_category_counts' ) ? rankweb_seo_category_counts() : array();
		$field  = 'post' === $type ? 'guide' : $type;
		$out    = array();
		foreach ( get_terms( array( 'taxonomy' => 'category', 'hide_empty' => true, 'orderby' => 'name' ) ) as $t ) {
			$n = (int) ( $counts[ $t->term_id ][ $field ] ?? 0 ) + ( 'post' === $type ? (int) ( $counts[ $t->term_id ]['research'] ?? 0 ) : 0 );
			if ( $n && 'uncategorized' !== $t->slug ) {
				$out[] = array( get_term_link( $t ), html_entity_decode( $t->name, ENT_QUOTES ) . ' (' . number_format_i18n( $n ) . ')' );
			}
		}
		return $out;
	};
	$head = function ( $id, $text, $url = '' ) {
		$h = $url ? '<a href="' . esc_url( $url ) . '">' . esc_html( $text ) . '</a>' : esc_html( $text );
		return '<h2 class="aw-more-head has-x-large-font-size" id="aw-sitemap-' . esc_attr( $id ) . '">' . $h . '</h2>';
	};
	$hub_title = function ( $type ) use ( $title ) {
		$p = isset( rankweb_hubs()[ $type ] ) ? get_page_by_path( rankweb_hubs()[ $type ][0] ) : null;
		return $p ? array( get_permalink( $p ), $title( $p ) ) : array( '', '' );
	};

	$html = '';
	// The site's own pages (not the sections, which follow, nor pages kept out of search).
	$hubs  = array_column( rankweb_hubs(), 0 );
	$skip  = array_merge( $hubs, array( 'home', RANKWEB_HTML_SITEMAP_SLUG, 'thank-you', 'search', 'claim', 'update' ) );
	$pages = array();
	foreach ( get_pages( array( 'post_status' => 'publish', 'sort_column' => 'post_title' ) ) as $p ) {
		if ( ! in_array( $p->post_name, $skip, true ) && ! $noidx( $p->ID ) ) {
			$pages[] = array( get_permalink( $p ), $title( $p ) );
		}
	}
	$home  = get_option( 'page_on_front' ) ? $title( (int) get_option( 'page_on_front' ) ) : get_bloginfo( 'name' );
	$html .= '<section class="aw-more-group" aria-labelledby="aw-sitemap-pages">' . $head( 'pages', $home, home_url( '/' ) ) . $list( $pages ) . '</section>';

	foreach ( rankweb_types_with( array( 'news', 'library', 'campaign', 'opportunity', 'press' ), array( 'post' ) ) as $type ) {
		list( $url, $name ) = $hub_title( $type );
		if ( ! $url ) {
			continue;
		}
		$body = $list( $cats( $type ), true );
		if ( rankweb_is_type( $type, 'library' ) && function_exists( 'aw_law_index_html' ) ) {
			$body .= aw_law_index_html();
		}
		if ( in_array( $type, rankweb_types_with( array( 'library', 'campaign', 'opportunity' ), array( 'post' ) ), true ) ) {
			$body .= $list( $items( $type ) );
		}
		$html .= '<section class="aw-more-group" aria-labelledby="aw-sitemap-' . esc_attr( $type ) . '">' . $head( $type, $name, $url ) . $body . '</section>';
	}

	// Directory: every state, then its districts with listings.
	list( $url, $name ) = $hub_title( rankweb_type( 'listing' ) );
	if ( $url && function_exists( 'rankweb_seo_dir_children' ) ) {
		$body   = '';
		$states = rankweb_seo_dir_children( null );
		usort( $states, fn( $a, $b ) => strcmp( $a[0]->name, $b[0]->name ) );
		foreach ( $states as $s ) {
			$state = $s[0];
			$kids  = rankweb_seo_dir_children( $state );
			usort( $kids, fn( $a, $b ) => strcmp( $a[0]->name, $b[0]->name ) );
			$links = array();
			foreach ( $kids as $d ) {
				$links[] = array( directoryweb_directory_url( $d[0]->slug ), $d[0]->name . ' (' . number_format_i18n( $d[1] ) . ')' );
			}
			$body .= '<h3 id="aw-sitemap-dir-' . esc_attr( $state->slug ) . '"><a href="' . esc_url( directoryweb_directory_url( $state->slug ) ) . '">' . esc_html( $state->name . ' (' . number_format_i18n( $s[1] ) . ')' ) . '</a></h3>' . $list( $links, true );
		}
		$html .= '<section class="aw-more-group" aria-labelledby="aw-sitemap-' . esc_attr( rankweb_type( 'listing' ) ) . '">' . $head( rankweb_type( 'listing' ), $name, $url ) . $body . '</section>';
	}

	set_transient( 'aw_html_sitemap', $html, 12 * HOUR_IN_SECONDS );
	return $html;
}
add_action( 'save_post', fn() => delete_transient( 'aw_html_sitemap' ) );

add_shortcode(
	'aw_html_sitemap',
	function () {
		if ( function_exists( 'kits_use_component_style' ) ) {
			kits_use_component_style( 'aw-single' ); // aw-more-group, aw-more-head
		}
		return rankweb_html_sitemap();
	}
);

// The /sitemap/ page, made once (published, with the shortcode) when it does not exist. Admin requests only, so a page
// view never writes; never made again once made, even if it is later moved to draft or deleted.
add_action(
	'admin_init',
	function () {
		if ( get_option( 'aw_html_sitemap_page' ) || ! current_user_can( 'publish_pages' ) ) {
			return;
		}
		$page = get_page_by_path( RANKWEB_HTML_SITEMAP_SLUG );
		$id   = $page ? (int) $page->ID : (int) wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => __( 'Sitemap', 'rankweb' ),
				'post_name'    => RANKWEB_HTML_SITEMAP_SLUG,
				'post_content' => '<!-- wp:shortcode -->[aw_html_sitemap]<!-- /wp:shortcode -->',
			)
		);
		update_option( 'aw_html_sitemap_page', $id ?: -1, false );
	}
);
