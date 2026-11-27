<?php
/**
 * Where an organisation's details come from: one small label per data source on every listing.
 *
 * The plugin knows two sources: Google Maps (the listing's Google profile) and The organisation (an approved claim). A site
 * adds its own lists with the filters `directoryweb_data_sources` (the registry), `directoryweb_listing_source_slugs` (which
 * of them a listing has), `directoryweb_listing_source` (one entry's label, date and link), `directoryweb_source_variants`
 * (tag colours), `directoryweb_source_labels_hidden` (sources kept in the data, not shown) and `directoryweb_source_hosts`
 * (the site whose logo stands for a source). A listing shows only the sources it really has.
 * Imports record their source in the listing meta directoryweb_data_sources (list of slugs).
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Source registry: slug => [mark, label, as of (Y-m-d or ''), link]. */
function directoryweb_data_sources() {
	$registry = array(
		'gmaps'        => array( 'MAPS', 'Google Maps', '', '' ), // link: the listing's own Google Maps link
		'organisation' => array( 'ORG', 'The organisation', '', '' ),
	);
	$out = apply_filters( 'directoryweb_data_sources', $registry );
	return is_array( $out ) ? $out : $registry;
}

/**
 * The sources of one listing: list of [slug, mark, label, as of, link].
 *
 * @param int $id Listing ID.
 * @return array
 */
function directoryweb_listing_sources( $id ) {
	$reg   = directoryweb_data_sources();
	$slugs = array_filter( (array) get_post_meta( $id, 'directoryweb_data_sources', true ) );
	$slugs = (array) apply_filters( 'directoryweb_listing_source_slugs', $slugs, $id ); // a site adds the sources it can tell from the listing's fields
	if ( get_post_meta( $id, 'aw_g_profile', true ) ) {
		$slugs[] = 'gmaps';
	}
	if ( get_post_meta( $id, 'aw_verified', true ) ) {
		$slugs[] = 'organisation';
	}
	$out = array();
	foreach ( array_unique( $slugs ) as $slug ) {
		if ( ! isset( $reg[ $slug ] ) ) {
			continue;
		}
		list( $mark, $label, $on, $link ) = $reg[ $slug ];
		if ( 'organisation' === $slug ) {
			$on = (string) get_post_meta( $id, 'aw_verified_on', true );
		}
		if ( 'gmaps' === $slug ) {
			$link  = (string) ( get_post_meta( $id, 'aw_g_profile', true ) ? get_post_meta( $id, 'aw_g_profile', true ) : get_post_meta( $id, 'aw_maps_url', true ) );
			$label = 'Google Business Profile';
		}
		$entry = apply_filters( 'directoryweb_listing_source', array( $slug, $mark, $label, $on, $link ), $id );
		$out[] = is_array( $entry ) ? $entry : array( $slug, $mark, $label, $on, $link );
	}
	return apply_filters( 'directoryweb_listing_sources', $out, $id ); // enrichment.php adds the enrichment worker's sources
}

/**
 * Small labels for a listing's sources.
 *
 * @param int  $id   Listing ID.
 * @param bool $full Also write the source's name and date (profile page); cards show the mark only.
 * @return string
 */
function directoryweb_source_labels( $id, $full = false ) {
	$variant = (array) apply_filters( 'directoryweb_source_variants', array( 'organisation' => '', 'gmaps' => '' ) );
	$hidden  = (array) apply_filters( 'directoryweb_source_labels_hidden', array() );
	// Google Maps shows as its own pin, the organisation as a building icon (owner, 12 Oct 2026); the others as their letters.
	$marks = array(
		'gmaps'        => '<img class="aw-datasrc-img" src="' . esc_url( function_exists( 'aw_theme_file_uri' ) ? aw_theme_file_uri( 'assets/img/google-maps.png' ) : DIRECTORYWEB_URL . 'assets/img/google-maps.png' ) . '" alt="" width="16" height="16">',
		'organisation' => '<svg class="aw-datasrc-img" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
	);
	$html    = '';
	foreach ( directoryweb_listing_sources( $id ) as list( $slug, $mark, $label, $on, $link ) ) {
		if ( in_array( $slug, $hidden, true ) ) {
			continue; // kept as a source in the data, not shown on the site
		}
		$title = $label . ( $on ? ', as on ' . wp_date( 'j M Y', strtotime( $on ) ) : '' );
		$tag   = '<span class="kit-tag aw-datasrc' . ( ! empty( $variant[ $slug ] ) ? ' kit-tag--' . $variant[ $slug ] : '' ) . '" title="' . esc_attr( $title ) . '"><span class="aw-datasrc-mark" aria-hidden="true">' . ( $marks[ $slug ] ?? esc_html( $mark ) ) . '</span><span class="screen-reader-text">' . esc_html( 'Source: ' . $title ) . '</span></span>';
		if ( $full ) { // "Details from": the source's logo, like publishers on News
			$logo = directoryweb_source_logo( $slug, $id, $link );
			$tag  = $logo ? '<span class="aw-datasrc-logo" title="' . esc_attr( $title ) . '">' . $logo . '</span>' : $tag;
			$shown = esc_html( $label ) . ( $on ? ', as on ' . directoryweb_date( $on ) : '' ); // the one date component
			$text  = $link ? '<a href="' . esc_url( $link ) . '" rel="noopener nofollow">' . $shown . '</a>' : $shown;
			$tag  = '<span class="aw-datasrc-row">' . $tag . ' <span class="aw-datasrc-text">' . $text . '</span></span>'; // one text cell: the date stays beside its label
		}
		$html .= $tag;
	}
	return $html ? '<span class="aw-datasrcs' . ( $full ? ' is-full' : '' ) . '">' . $html . '</span>' : '';
}

/** Hosts whose logo stands for a source: slug => URL. Google Maps by default; a site adds its own (`directoryweb_source_hosts`). */
function directoryweb_source_hosts(): array {
	$hosts = apply_filters( 'directoryweb_source_hosts', array( 'gmaps' => 'https://www.google.com/maps/' ) );
	return is_array( $hosts ) ? $hosts : array();
}

/**
 * The logo of a source as an <img>: the list's site (the list's publisher, Google Maps) or, for "The organisation", the
 * listing's own logo. Logos are fetched once per site into the Media Library (never while a page is drawn); '' if none.
 *
 * @param string $slug Source slug.
 * @param int    $id   Listing ID.
 * @param string $link The source's link.
 * @return string
 */
function directoryweb_source_logo( $slug, $id, $link ) {
	if ( 0 === strpos( $slug, 'enrich-' ) && function_exists( 'aw_enrich_icon' ) ) { // a source of the enrichment worker: its site's favicon
		return aw_enrich_icon( array( 'key' => substr( $slug, 7 ), 'name' => '', 'url' => $link ), $id );
	}
	if ( 'organisation' === $slug ) {
		$tid = (int) get_post_thumbnail_id( $id );
		return $tid ? (string) wp_get_attachment_image( $tid, 'thumbnail', false, array( 'alt' => '', 'width' => 20, 'height' => 20, 'loading' => 'lazy' ) ) : '';
	}
	$url   = directoryweb_source_hosts()[ $slug ] ?? $link;
	$host  = preg_replace( '/^www\./', '', (string) wp_parse_url( (string) $url, PHP_URL_HOST ) );
	$cache = (array) get_option( 'aw_press_logos', array() );
	$aid   = (int) ( $cache[ $host ] ?? 0 );
	return $aid ? (string) wp_get_attachment_image( $aid, 'thumbnail', false, array( 'alt' => '', 'width' => 20, 'height' => 20, 'loading' => 'lazy' ) ) : '';
}

/** Fetch the logos of every source site once (wp eval 'directoryweb_source_logos_fetch();'). */
function directoryweb_source_logos_fetch() {
	global $wpdb;
	$urls = array_values( directoryweb_source_hosts() );
	foreach ( $wpdb->get_col( "SELECT DISTINCT meta_value FROM {$wpdb->postmeta} pm JOIN {$wpdb->posts} p ON p.ID = pm.post_id AND p.post_type = 'aw_listing' WHERE pm.meta_key = 'aw_source_url' AND pm.meta_value <> ''" ) as $u ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$urls[] = $u;
	}
	$done = array();
	foreach ( $urls as $u ) {
		$h = (string) wp_parse_url( $u, PHP_URL_HOST );
		if ( $h && ! isset( $done[ $h ] ) && function_exists( 'aw_press_site_logo' ) ) {
			$done[ $h ] = aw_press_site_logo( $u );
		}
	}
	return $done;
}

