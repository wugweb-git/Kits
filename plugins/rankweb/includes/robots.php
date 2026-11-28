<?php
/**
 * Robots rules that depend on an item's state or a list's contents, which Rank Math's per-type and per-item settings
 * cannot express. Fixed rules live in Rank Math: per item (Advanced → Robots: the search, report, claim (owner, 24 Oct 2026) and thank-you pages,
 * hidden items) and per type or taxonomy (Titles & Meta: listing-type, opportunity-type, Library-kind and service
 * archives; site search).
 *
 * - Closed opportunities (past their deadline or review date): noindex, links followed.
 * - Directory district × type pages with no listings (RANKWEB_THIN_DISTRICT_TYPE = 1): noindex.
 * - Directory profiles with no contact at all, unless they have Search Console impressions: noindex.
 * - The Web Stories archive (/web-stories/) while no story is published: noindex.
 * - Every RSS/Atom feed (posts, News, Opportunities, Library, comments): X-Robots-Tag noindex, links followed (owner, 25 Oct 2026).
 * - Any wp_robots rule another plugin adds (e.g. a staging copy's noindex): Rank Math removes every wp_robots filter,
 *   so a copy of them is kept before it starts and asked here.
 * - Rank Math's sitemaps leave out what these rules keep out of the index: closed opportunities, profiles with no
 *   contact, items merged into another story, items without a slug, and preview-only items (kits_preview_only_ids(),
 *   e.g. the sample listing). Always on, as the rules themselves. Private, draft and noindex items and the empty Web
 *   Stories type are left out by Rank Math itself; fixed exclusions are Rank Math settings (Sitemap → Exclude posts:
 *   the search page). Claim forms (/claim/, page 12587) are noindex, follow and out of every sitemap.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Owner, 21 Oct 2026: the 3-organisation rule of 20 Oct is withdrawn. A district × type page with at least 1 organisation is
 * indexed and in the sitemap; only a page with none (nothing to show) stays noindex (stored counts).
 */
// RANKWEB_THIN_DISTRICT_TYPE: RankWeb → Settings (settings.php).

/**
 * Thin district × type pages that stay indexed: every one with Search Console clicks or impressions in the 90 days to
 * 20 Oct 2026 (owner). Paths under /directory/.
 */
// RANKWEB_DIRECTORY_KEEP_INDEXED: RankWeb → Settings (settings.php).

/** Whether a district × type page (its URL) is on the keep-indexed list. */
function rankweb_directory_keep_indexed( $url ) {
	$path = trim( (string) wp_parse_url( $url, PHP_URL_PATH ), '/' );
	return in_array( preg_replace( '#^directory/#', '', $path ), RANKWEB_DIRECTORY_KEEP_INDEXED, true );
}

/** District × type page with too few listings to be worth indexing. */
function rankweb_is_thin_directory_page() {
	if ( ! function_exists( 'directoryweb_is_directory_view' ) || ! directoryweb_is_directory_view() || ! get_query_var( 'aw_dir_type' ) ) {
		return false;
	}
	$place = directoryweb_current_place();
	if ( ! $place || ! $place->parent ) {
		return false;
	}
	// Stored counts (places.php), the same numbers the sitemap uses — the page query's found_posts is not reliable here.
	$type = (string) get_query_var( 'aw_dir_type' );
	foreach ( directoryweb_place_counts()['pairs'] as $p ) {
		if ( (string) $p[0] === (string) $place->code && $p[1] === $type ) {
			return (int) $p[3] < RANKWEB_THIN_DISTRICT_TYPE && ! rankweb_directory_keep_indexed( directoryweb_directory_url( $place->slug, $type ) );
		}
	}
	return true; // no listings of this type here
}

/**
 * Owner, 24 Oct 2026: a Directory profile with no way to reach the organisation (no phone, WhatsApp, email, website or
 * social profile) is noindex (links followed) and out of the sitemap, so Google spends its crawl on profiles worth
 * indexing. It becomes indexable again by itself once a contact is added (enrichment, claim or edit). Profiles with
 * Search Console impressions stay indexed: their IDs are in the option aw_seo_keep_listings (first set from the
 * Search Console export of 24 Oct 2026, 901 profiles; changed on RankWeb → Settings → Indexing).
 */
function rankweb_listing_unreachable( $id ) {
	$id = (int) $id;
	if ( ! rankweb_is_type( get_post_type( $id ), 'listing' ) || in_array( $id, array_map( 'intval', (array) get_option( 'aw_seo_keep_listings', array() ) ), true ) ) {
		return false;
	}
	$score = get_post_meta( $id, 'directoryweb_contact_score', true );
	if ( '' === $score && function_exists( 'directoryweb_contact_score' ) ) {
		$score = directoryweb_contact_score( $id ); // listings imported without a contact never got the stored score
		if ( rankweb_seo_may_store() ) {
			update_post_meta( $id, 'directoryweb_contact_score', $score ); // stored by the daily job or admin, never by a page view
		}
	}
	if ( (int) $score > 0 ) {
		return false;
	}
	foreach ( rankweb_seo_social_keys() as $k ) {
		if ( '' !== trim( (string) get_post_meta( $id, $k, true ) ) ) {
			return false;
		}
	}
	return true;
}

/** Whether this request may write to the database: admin, cron and WP-CLI (never a front-end page view). */
function rankweb_seo_may_store() {
	return is_admin() || wp_doing_cron() || ( defined( 'WP_CLI' ) && WP_CLI );
}

/** Daily: listings without a stored contact score get it, so the noindex rule and the sitemap read stored values. */
function rankweb_seo_fill_contact_scores() {
	if ( ! function_exists( 'directoryweb_contact_score' ) ) {
		return;
	}
	global $wpdb;
	$ids = $wpdb->get_col( "SELECT p.ID FROM {$wpdb->posts} p LEFT JOIN {$wpdb->postmeta} s ON s.post_id = p.ID AND s.meta_key = 'directoryweb_contact_score' WHERE p.post_type = '" . esc_sql( rankweb_type( 'listing' ) ) . "' AND p.post_status = 'publish' AND s.meta_id IS NULL LIMIT 1000" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	foreach ( $ids as $id ) {
		update_post_meta( (int) $id, 'directoryweb_contact_score', directoryweb_contact_score( (int) $id ) );
	}
}
add_action( 'aw_seo_fill_daily', 'rankweb_seo_fill_contact_scores', 40 ); // the daily event of titles.php

/** Whether the current view is an item or list kept out of search engines by a rule of its state. */
function rankweb_seo_noindex_rule() {
	if ( RANKWEB_SEO_NOINDEX_PROTECTED && is_singular() ) {
		$qid = get_queried_object_id();
		if ( $qid && '' !== (string) get_post_field( 'post_password', $qid ) ) {
			return true; // a password-protected item: its content is hidden, so keep it out of the index
		}
	}
	if ( rankweb_is_singular( array( 'opportunity' ) ) && function_exists( 'kits_retention_state' ) && kits_retention_state( get_queried_object() ) ) {
		return true; // closed opportunity
	}
	if ( is_post_type_archive( 'web-story' ) && ! (int) ( wp_count_posts( 'web-story' )->publish ?? 0 ) ) {
		return true; // the Web Stories archive while it has no published story (it is also out of the sitemap: Rank Math)
	}
	if ( rankweb_is_singular( array( 'listing' ) ) && rankweb_listing_unreachable( get_queried_object_id() ) ) {
		return true; // a profile with no contact (also out of the sitemap: sitemap.php)
	}
	return rankweb_is_thin_directory_page();
}

add_action(
	'wp',
	function () {
		global $wp_filter;
		if ( isset( $wp_filter['wp_robots'] ) && $wp_filter['wp_robots'] instanceof WP_Hook ) {
			$GLOBALS['rankweb_seo_wp_robots'] = clone $wp_filter['wp_robots'];
		}
	},
	1
);

add_filter(
	'rank_math/frontend/robots',
	function ( $robots ) {
		if ( rankweb_seo_noindex_rule() ) {
			$robots['index'] = 'noindex';
		}
		$hook = $GLOBALS['rankweb_seo_wp_robots'] ?? null;
		if ( $hook instanceof WP_Hook ) {
			$ours = (array) $hook->apply_filters( array(), array( array() ) );
			if ( ! empty( $ours['noindex'] ) ) {
				$robots['index'] = 'noindex';
			}
			if ( ! empty( $ours['nofollow'] ) ) {
				$robots['follow'] = 'nofollow';
			}
		}
		return $robots;
	},
	20
);

/* A listing reported closed stays in search (owner, 21 Oct 2026): it only carries the "Reported closed" note on its page. */

// "?press=all" lists every item on the profile: the same page, kept out of the index.
add_filter( 'rank_math/frontend/robots', fn( $r ) => rankweb_is_singular( array( 'listing' ) ) && isset( $_GET['press'] ) ? array_merge( (array) $r, array( 'index' => 'noindex', 'follow' => 'follow' ) ) : $r ); // phpcs:ignore WordPress.Security.NonceVerification

add_filter(
	'wp_robots',
	function ( array $robots ) {
		if ( rankweb_seo_noindex_rule() || ( rankweb_is_singular( array( 'listing' ) ) && isset( $_GET['press'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- needed here and bounded; see the surrounding code.
			$robots['noindex'] = true;
		}
		return $robots;
	},
	20
);

// Feeds stay out of the index (owner, 25 Oct 2026): a header, as a feed has no <head>.
add_action( 'template_redirect', fn() => is_feed() && ! headers_sent() ? header( 'X-Robots-Tag: noindex, follow' ) : null, 0 );

/* ---------- Sitemaps: what a rule above keeps out of the index stays out of Rank Math's sitemaps ---------- */

/**
 * Published profiles with no contact (rankweb_listing_unreachable() above), as an ID-keyed set: one query per
 * sitemap request instead of a meta lookup per listing. Listings with no stored score count as candidates and are
 * checked one by one (their score is stored by the daily job, rankweb_seo_fill_contact_scores()).
 */
function rankweb_sitemap_unreachable_listings() {
	static $set = null;
	if ( null !== $set ) {
		return $set;
	}
	global $wpdb;
	$keys = rankweb_seo_social_keys();
	$ids  = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->prepare(
			"SELECT p.ID FROM {$wpdb->posts} p
			LEFT JOIN {$wpdb->postmeta} s ON s.post_id = p.ID AND s.meta_key = 'directoryweb_contact_score'
			WHERE p.post_type = '" . esc_sql( rankweb_type( 'listing' ) ) . "' AND p.post_status = 'publish' AND ( s.meta_value IS NULL OR s.meta_value = '' OR s.meta_value = '0' )
			AND NOT EXISTS ( SELECT 1 FROM {$wpdb->postmeta} m WHERE m.post_id = p.ID AND m.meta_key IN ( " . implode( ', ', array_fill( 0, count( $keys ), '%s' ) ) . " ) AND TRIM( m.meta_value ) <> '' )",
			$keys
		)
	);
	$set  = array();
	_prime_post_caches( array_map( 'intval', $ids ), false, true );
	foreach ( $ids as $id ) {
		if ( rankweb_listing_unreachable( (int) $id ) ) {
			$set[ (int) $id ] = true;
		}
	}
	return $set;
}

add_filter(
	'rank_math/sitemap/entry',
	function ( $url, $type, $obj ) {
		$obj = ( 'post' === $type && is_object( $obj ) && ! empty( $obj->ID ) ) ? get_post( (int) $obj->ID ) : null; // Rank Math passes a database row
		if ( ! $obj instanceof WP_Post ) {
			return $url;
		}
		$closed      = rankweb_is_type( $obj->post_type, 'opportunity' ) && function_exists( 'kits_retention_state' ) && kits_retention_state( $obj );
		$merged      = (int) get_post_meta( $obj->ID, 'aw_merged_into', true ) > 0; // a same-story duplicate (normally private already)
		$unreachable = rankweb_is_type( $obj->post_type, 'listing' ) && isset( rankweb_sitemap_unreachable_listings()[ (int) $obj->ID ] ); // noindex (above)
		if ( '' === (string) $obj->post_name || $closed || $merged || $unreachable || in_array( (int) $obj->ID, rankweb_seo_preview_ids(), true ) ) {
			return false;
		}
		return $url;
	},
	10,
	3
);

/**
 * A post type whose every item is left out by the rule above (all opportunities closed) has an empty sitemap, which
 * Rank Math still listed in sitemap_index.xml and then answered 404 (audit, 12 Nov 2026). Such a type is left out of
 * the index until one of its items is open again. Counted once a day and after each post change (rankweb_seo_cached).
 */
add_filter(
	'rank_math/sitemap/exclude_post_type',
	function ( $exclude, $type ) {
		if ( $exclude || ! rankweb_is_type( $type, 'opportunity' ) || ! function_exists( 'kits_retention_state' ) || ! function_exists( 'rankweb_seo_cached' ) ) {
			return $exclude;
		}
		$open = rankweb_seo_cached(
			'sitemap_open_opportunities|' . wp_date( 'Y-m-d' ), // closing is by date: counted again each day
			function () {
				$ids = get_posts( array( 'post_type' => rankweb_type( 'opportunity' ), 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids', 'no_found_rows' => true ) );
				foreach ( $ids as $id ) {
					if ( ! kits_retention_state( $id ) ) {
						return 1;
					}
				}
				return 0;
			}
		);
		return ! $open;
	},
	10,
	2
);
