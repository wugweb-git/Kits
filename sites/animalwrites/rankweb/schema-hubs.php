<?php
/**
 * Animal Writes site layer for RankWeb 2.4.0: the section-hub and Media & PR list schema (CollectionPage + ItemList).
 * Moved unchanged from RankWeb 2.3.7 (includes/schema.php: rankweb_hub_schema_nodes(), rankweb_hub_schema_build(),
 * rankweb_press_image_schema(), rankweb_press_schema()). They read Animal Writes Core's hubs (AW_HUBS, aw_hub_*) and press
 * list (aw_press_list). RankWeb asks for them through the filter rankweb_collection_page_nodes.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter(
	'rankweb_collection_page_nodes',
	function ( $nodes ) {
		if ( is_page( array( 'press-coverage', 'media' ) ) && function_exists( 'aw_press_list' ) ) { // the press list (Animal Writes Core)
			return array( rankweb_press_schema() );
		}
		return rankweb_hub_schema_nodes(); // hubs and directory places: CollectionPage + ItemList (hubs.php)
	}
);

/**
 * CollectionPage + ItemList of a hub's current page (put in the page's one graph below). Empty off a hub.
 *
 * @return array
 */
function rankweb_hub_schema_nodes() {
	static $nodes = null;
	if ( null !== $nodes ) {
		return $nodes;
	}
	if ( ! function_exists( 'aw_hub_type' ) || ! function_exists( 'aw_hub_posts' ) || ! defined( 'AW_HUBS' ) ) { // the hubs (Animal Writes Core) are not loaded
		return $nodes = array();
	}
	$type = aw_hub_type();
	if ( ! $type || is_404() || 'aw_press' === $type ) {
		return $nodes = array(); // Media & PR has its own (rankweb_press_schema)
	}
	$url   = strtok( aw_hub_base_url(), '?' );
	$view  = function_exists( 'rankweb_seo_filtered_named' ) && rankweb_seo_filtered_named() ? rankweb_seo_filtered_view() : null;
	if ( $view ) { // a hub filtered by one category or tag is its own collection (filtered-views.php)
		$url = add_query_arg( $view['key'], rawurlencode( $view['slug'] ), strtok( aw_hub_base_url(), '?' ) );
	}
	// Kept until the next post change (rankweb_seo_cached): the plain list and its named filtered views, per page. Any
	// other filtered request is built each time, so query strings cannot fill the cache.
	$plain = ! function_exists( 'rankweb_seo_filter_params' ) || ! rankweb_seo_filter_params();
	if ( $plain || $view ) {
		$path  = (string) wp_parse_url( add_query_arg( array() ), PHP_URL_PATH ); // the request's own path (Directory places and types)
		$sort  = sanitize_key( wp_unslash( $_GET['sort'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification -- an order, read only
		$nodes = rankweb_seo_cached( 'hub_schema|' . $type . '|' . $url . '|' . $path . '|' . $sort . '|' . aw_hub_page() . '|' . get_queried_object_id(), fn() => rankweb_hub_schema_build( $type, $url, $view ) );
		return $nodes;
	}
	$nodes = rankweb_hub_schema_build( $type, $url, $view );
	return $nodes;
}

/**
 * The CollectionPage + ItemList of a hub list (rankweb_hub_schema_nodes()).
 *
 * @param string     $type Post type of the hub.
 * @param string     $url  The list's own address.
 * @param array|null $view Its named filtered view, if any.
 * @return array
 */
function rankweb_hub_schema_build( $type, $url, $view ) {
	$items = array();
	$start = ( aw_hub_page() - 1 ) * AW_HUBS[ $type ][2];
	$posts = aw_hub_posts( $type );
	$extra = 0;
	if ( 'aw_campaign' === $type && 1 === aw_hub_page() ) {
		$lead = get_page_by_path( 'india-writes-for-its-community-dogs', OBJECT, 'aw_campaign' ); // shown above the list as its own story (hubs.php)
		if ( $lead && 'publish' === $lead->post_status ) {
			array_unshift( $posts, $lead );
			$extra = 1;
		}
	}
	foreach ( $posts as $i => $p ) {
		if ( rankweb_is_noindex_item( $p->ID ) || in_array( (int) $p->ID, rankweb_seo_preview_ids(), true ) ) {
			continue; // not indexed (or preview only), so not listed
		}
		$item_data = array(
			'@type'    => 'ListItem',
			'position' => $start + $i + 1,
			'url'      => get_permalink( $p ),
			'name'     => rankweb_plain_text( get_the_title( $p ) ),
		);
		if ( 'aw_listing' === $type ) {
			$place = function_exists( 'directoryweb_listing_place' ) ? array_filter( array_reverse( (array) directoryweb_listing_place( $p->ID ) ) ) : array();
			$phone = function_exists( 'directoryweb_listing_first_phone' ) ? directoryweb_listing_first_phone( $p->ID ) : '';
			$ngo   = array(
				'@type' => 'NGO',
				'@id'   => get_permalink( $p ) . '#organization',
				'name'  => rankweb_plain_text( get_the_title( $p ) ),
				'url'   => get_permalink( $p ),
			);
			if ( $place ) {
				$ngo['address'] = array(
					'@type'           => 'PostalAddress',
					'addressCountry'  => 'IN',
					'addressRegion'   => $place[1] ?? ( $place[0] ?? '' ),
					'addressLocality' => $place[0] ?? '',
				);
			}
			if ( $phone ) {
				$ngo['telephone'] = $phone;
			}
			if ( has_post_thumbnail( $p->ID ) ) {
				$thumb = get_the_post_thumbnail_url( $p->ID, 'thumbnail' );
				if ( $thumb ) {
					$ngo['image'] = $thumb;
				}
			}
			$item_data['item'] = $ngo;
		}
		$items[] = $item_data;
	}
	$name  = 'aw_listing' === $type && function_exists( 'directoryweb_directory_h1' ) ? directoryweb_directory_h1() : get_the_title( get_queried_object_id() );
	$name  = $view && 'aw_listing' !== $type ? $view['name'] . ' – ' . get_the_title( get_queried_object_id() ) : $name; // "Wildlife – News"
	if ( ! $items ) { // an empty list: the collection page alone
		return array( array( '@type' => 'CollectionPage', '@id' => $url . '#page', 'url' => $url, 'name' => rankweb_plain_text( $name ), 'description' => rankweb_seo_description(), 'inLanguage' => rankweb_language(), 'isPartOf' => array( '@id' => home_url( '/#website' ) ), 'publisher' => array( '@id' => home_url( '/#organization' ) ) ) );
	}
	return array(
		array(
			'@type'       => 'CollectionPage',
			'@id'         => $url . '#page',
			'url'         => $url,
			'name'        => rankweb_plain_text( $name ),
			'description' => rankweb_seo_description(),
			'inLanguage'  => rankweb_language(),
			'isPartOf'    => array( '@id' => home_url( '/#website' ) ),
			'publisher'   => array( '@id' => home_url( '/#organization' ) ),
			'mainEntity'  => array( '@id' => $url . '#list' ),
		),
		array(
			'@type'           => 'ItemList',
			'@id'             => $url . '#list',
			'numberOfItems'   => (int) aw_hub_total( $type ) + $extra,
			'itemListElement' => $items,
		),
	);
}

/** ImageObject of a press item: its stored thumbnail, else the stored publisher logo (null when neither exists). */
function rankweb_press_image_schema( $id ) {
	foreach ( array( (int) get_post_thumbnail_id( $id ), (int) get_post_meta( $id, 'aw_press_logo', true ) ) as $att ) {
		$img = $att ? rankweb_schema_safe_image( rankweb_seo_attachment( $att ) ) : null;
		if ( $img ) {
			return array_filter( array( '@type' => 'ImageObject', 'url' => $img['url'], 'width' => $img['width'], 'height' => $img['height'] ) );
		}
	}
	return null;
}

/** Media & PR page schema: CollectionPage + ItemList. */
function rankweb_press_schema() {
	$list = array();
	foreach ( aw_press_list() as $i => $p ) {
		$list[] = array(
			'@type'    => 'ListItem',
			'position' => $i + 1,
			'item'     => array_filter(
				array(
					'@type'         => 'Article', // coverage of the site, at the outlet's address
					'headline'      => rankweb_plain_text( get_the_title( $p ) ),
					'about'         => array( '@id' => home_url( '/#organization' ) ),
					'name'          => rankweb_plain_text( get_the_title( $p ) ),
					'url'           => (string) get_post_meta( $p->ID, 'aw_press_url', true ),
					'datePublished' => rankweb_schema_date( (string) get_post_meta( $p->ID, 'aw_press_date', true ) ),
					'publisher'     => get_post_meta( $p->ID, 'aw_press_publisher', true ) ? array( '@type' => 'Organization', 'name' => (string) get_post_meta( $p->ID, 'aw_press_publisher', true ) ) : null,
					'image'         => rankweb_press_image_schema( $p->ID ),
				)
			),
		);
	}
	return array_filter( array(
		'@type'       => 'CollectionPage',
		'@id'         => get_permalink() . '#page',
		'url'         => get_permalink(),
		'name'        => rankweb_plain_text( get_the_title() ),
		'description' => rankweb_plain_text( rankweb_seo_description() ),
		'inLanguage'  => rankweb_language(),
		'isPartOf'    => array( '@id' => home_url( '/#website' ) ),
		'mainEntity'  => array( '@type' => 'ItemList', 'itemListElement' => $list ),
	) );
}

// The organisations an item features (DirectoryWeb's featured.php) as "mentions" on the article node. Moved unchanged from RankWeb 2.3.7.
add_filter(
	'rankweb_page_schema_nodes',
	function ( $nodes ) {
		if ( $nodes && is_singular( array( 'aw_news', 'aw_legal', 'post', 'aw_campaign' ) ) && function_exists( 'directoryweb_featured_mentions_schema' ) ) {
			$mentions = directoryweb_featured_mentions_schema( get_queried_object_id() ); // the organisations it features (featured.php)
			if ( $mentions ) {
				$nodes[0]['mentions'] = array_merge( (array) ( $nodes[0]['mentions'] ?? array() ), $mentions );
			}
		}
		return $nodes;
	}
);
