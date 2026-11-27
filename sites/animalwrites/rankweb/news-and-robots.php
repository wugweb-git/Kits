<?php
/**
 * Animal Writes site layer for RankWeb 2.4.0: the Google News sitemap (/news-sitemap.xml) and the robots.txt extras
 * (the news sitemap line and the Content-Signal line). Moved unchanged from RankWeb 2.3.7 (includes/sitemap.php and
 * includes/robots.php); the two settings that switched them (Settings -> Robots rules) are no longer in RankWeb, so
 * their saved values in the option aw_seo_settings are read here.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Whether the site may add its own lines to robots.txt: RankWeb is the SEO owner (no other SEO plugin prints the head)
 * and the saved setting is on (RankWeb 2.3.x stored it in aw_seo_settings; absent: the old default).
 *
 * @param string $const   The setting's old constant name.
 * @param int    $default The old default (news line 1, Content-Signal 0).
 */
function awsite_robots_extras_on( string $const, int $default ): bool {
	if ( ! function_exists( 'rankweb_seo_owner' ) || 'none' !== rankweb_seo_owner() ) {
		return false;
	}
	$saved = (array) get_option( 'aw_seo_settings', array() );
	return (bool) ( array_key_exists( $const, $saved ) ? $saved[ $const ] : $default );
}

/* ---------- Google News sitemap: /news-sitemap.xml (owner, 12 Nov 2026; Rank Math's own is Pro-only) ---------- */

/** Hours a News item stays in the Google News sitemap (Google reads the last two days only). */
const AW_NEWS_SITEMAP_HOURS = 48;

/**
 * News items from the last 48 hours, newest first: [url, title, date]. The date is the one the item's NewsArticle
 * node prints (schema.php, rankweb_article_nodes(): the day the story was reported when stored, else the publish date), so
 * the two never disagree. Read with $wpdb: front-end News queries are re-sorted by source date.
 *
 * @return array List of ['loc', 'title', 'date' (ISO 8601)].
 */
function rankweb_news_sitemap_items() {
	global $wpdb;
	$since = gmdate( 'Y-m-d H:i:s', time() - ( AW_NEWS_SITEMAP_HOURS + 24 ) * HOUR_IN_SECONDS ); // a day more: the source date can be later than the publish date
	$ids   = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'aw_news' AND post_status = 'publish' AND post_password = '' AND post_date_gmt >= %s ORDER BY post_date_gmt DESC LIMIT 1000", $since ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$cut   = time() - AW_NEWS_SITEMAP_HOURS * HOUR_IN_SECONDS;
	$out   = array();
	foreach ( array_map( 'intval', $ids ) as $id ) {
		if ( function_exists( 'kits_preview_only_ids' ) && in_array( $id, (array) kits_preview_only_ids(), true ) ) {
			continue; // preview-only items are never listed
		}
		$src  = (string) get_post_meta( $id, 'aw_source_date', true );
		$date = '' !== $src && function_exists( 'rankweb_schema_date' ) && rankweb_schema_date( $src ) ? rankweb_schema_date( $src ) : get_the_date( 'c', $id );
		$ts   = strtotime( (string) $date );
		if ( ! $ts || $ts < $cut || $ts > time() + HOUR_IN_SECONDS ) {
			continue;
		}
		$out[] = array( 'loc' => get_permalink( $id ), 'title' => rankweb_plain_text( get_the_title( $id ) ), 'date' => (string) $date, 'ts' => $ts );
	}
	usort( $out, fn( $a, $b ) => $b['ts'] <=> $a['ts'] );
	return $out;
}

/** The Google News sitemap XML. */
function rankweb_news_sitemap_xml() {
	$x = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' . "\n";
	foreach ( rankweb_news_sitemap_items() as $r ) {
		$x .= "\t<url>\n\t\t<loc>" . esc_xml( $r['loc'] ) . "</loc>\n\t\t<news:news>\n\t\t\t<news:publication>\n\t\t\t\t<news:name>" . esc_xml( (string) apply_filters( 'rankweb_news_publication_name', rankweb_site_name() ) ) . "</news:name>\n\t\t\t\t<news:language>en</news:language>\n\t\t\t</news:publication>\n"
			. "\t\t\t<news:publication_date>" . esc_xml( $r['date'] ) . "</news:publication_date>\n\t\t\t<news:title>" . esc_xml( $r['title'] ) . "</news:title>\n\t\t</news:news>\n\t</url>\n";
	}
	return $x . '</urlset>' . "\n";
}

/** The sitemap's address. */
function rankweb_news_sitemap_url() {
	return home_url( '/news-sitemap.xml' );
}


// Mapped like RankWeb's video and image sitemaps when Rank Math is off (RankWeb 2.4.0 no longer maps the news one).
// Decided once the plugins are loaded: this file is loaded before RankWeb.
add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'rankweb_seo_extras_rank_math' ) || rankweb_seo_extras_rank_math() ) {
			return;
		}
		add_action(
			'parse_request',
			function ( $wp ) {
				$path = (string) wp_parse_url( (string) wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
				$home = rtrim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
				if ( post_type_exists( 'aw_news' ) && $home . '/news-sitemap.xml' === $path ) {
					$wp->query_vars['sitemap'] = 'news';
				}
			},
			-1
		);
	},
	20
);

// Rank Math's rule sends /news-sitemap.xml to WordPress as sitemap=news; it is answered here, before Rank Math (parse_query).
add_action(
	'parse_request',
	function ( $wp ) {
		if ( 'news' !== ( $wp->query_vars['sitemap'] ?? '' ) || ! post_type_exists( 'aw_news' ) ) {
			return;
		}
		do_action( 'litespeed_control_set_ttl', 900 ); // LiteSpeed keeps it 15 minutes at most
		if ( ! headers_sent() ) {
			status_header( 200 );
			header( 'Content-Type: application/xml; charset=UTF-8' );
			header( 'X-Robots-Tag: noindex, follow' );
			header( 'Cache-Control: public, max-age=900' );
		}
		echo rankweb_news_sitemap_xml(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped per value in rankweb_news_sitemap_xml()
		exit;
	},
	0
);

// Listed in sitemap_index.xml (Rank Math's own filter for extra index entries, as its Local SEO sitemap does).
add_filter(
	'rank_math/sitemap/index',
	function ( $xml ) {
		$items = rankweb_news_sitemap_items();
		$mod   = $items ? gmdate( 'c', $items[0]['ts'] ) : '';
		return $xml . "\t<sitemap>\n\t\t<loc>" . esc_xml( rankweb_news_sitemap_url() ) . "</loc>\n" . ( $mod ? "\t\t<lastmod>" . esc_xml( $mod ) . "</lastmod>\n" : '' ) . "\t</sitemap>\n";
	}
);

// And in robots.txt, after the site's own Sitemap line. Only when RankWeb is the SEO owner, the setting is on and the site
// has News items (the aw_news type): on any other site the news sitemap would be empty and another plugin owns robots.txt.
add_filter(
	'robots_txt',
	function ( $txt ) {
		if ( ! post_type_exists( 'aw_news' ) || ! awsite_robots_extras_on( 'RANKWEB_ROBOTS_NEWS_SITEMAP', 1 ) ) {
			return $txt;
		}
		$line = 'Sitemap: ' . rankweb_news_sitemap_url();
		return false !== strpos( (string) $txt, $line ) ? $txt : rtrim( (string) $txt ) . "\n" . $line . "\n";
	},
	60
);

/**
 * The robots.txt Content-Signal (owner, 3 Nov 2026): one line under the first User-agent: * group. The rest of the file is
 * Rank Math's saved text, unchanged. Runs after Rank Math (10) and before the staging copy's block-all (99).
 * Off unless the saved setting RANKWEB_ROBOTS_CONTENT_SIGNAL is on; only when RankWeb is the SEO owner.
 *
 * @param string $txt robots.txt text.
 */
function awsite_robots_content_signal( $txt ) {
	$txt = (string) $txt;
	if ( ! awsite_robots_extras_on( 'RANKWEB_ROBOTS_CONTENT_SIGNAL', 0 ) ) {
		return $txt;
	}
	$signal = (string) apply_filters( 'aw_seo_content_signal', 'search=yes, ai-input=yes, ai-train=no' );
	if ( '' === $signal || preg_match( '/^\s*Content-Signal\s*:/mi', $txt ) ) {
		return $txt;
	}
	$line = 'Content-Signal: ' . $signal;
	if ( preg_match( '/^User-agent:\s*\*\s*$/mi', $txt, $m, PREG_OFFSET_CAPTURE ) ) {
		$at = $m[0][1] + strlen( $m[0][0] );
		return substr( $txt, 0, $at ) . "\n" . $line . substr( $txt, $at );
	}
	return "User-agent: *\n" . $line . "\n\n" . $txt;
}
add_filter( 'robots_txt', 'awsite_robots_content_signal', 50 );
