<?php
/**
 * The page head when Rank Math is not active: the SEO title typed in the editor sidebar, and the Open Graph and Twitter
 * share tags. With Rank Math active none of this runs: Rank Math prints its own, and opengraph.php adjusts them.
 *
 * @package aw-seo-extras
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The share tags as HTML. Pure: it only formats what it is given.
 *
 * @param array $d type, title, description, url, site_name, locale, image (url, width, height, type, alt).
 * @return string
 */
function rankweb_share_tags( array $d ): string {
	$tags = array(
		array( 'property', 'og:locale', (string) ( $d['locale'] ?? '' ) ),
		array( 'property', 'og:type', (string) ( $d['type'] ?? 'website' ) ),
		array( 'property', 'og:title', (string) ( $d['title'] ?? '' ) ),
		array( 'property', 'og:description', (string) ( $d['description'] ?? '' ) ),
		array( 'property', 'og:url', (string) ( $d['url'] ?? '' ) ),
		array( 'property', 'og:site_name', (string) ( $d['site_name'] ?? '' ) ),
	);
	$img  = (array) ( $d['image'] ?? array() );
	if ( ! empty( $img['url'] ) ) {
		$tags[] = array( 'property', 'og:image', (string) $img['url'] );
		foreach ( array( 'width', 'height', 'type', 'alt' ) as $k ) {
			if ( ! empty( $img[ $k ] ) ) {
				$tags[] = array( 'property', 'og:image:' . $k, (string) $img[ $k ] );
			}
		}
	}
	$tags[] = array( 'name', 'twitter:card', ! empty( $img['url'] ) ? 'summary_large_image' : 'summary' );
	$tags[] = array( 'name', 'twitter:title', (string) ( $d['title'] ?? '' ) );
	$tags[] = array( 'name', 'twitter:description', (string) ( $d['description'] ?? '' ) );
	if ( ! empty( $img['url'] ) ) {
		$tags[] = array( 'name', 'twitter:image', (string) $img['url'] );
	}
	$out = '';
	foreach ( $tags as $t ) {
		if ( '' !== $t[2] ) {
			$out .= '<meta ' . $t[0] . '="' . esc_attr( $t[1] ) . '" content="' . esc_attr( $t[2] ) . '" />' . "\n";
		}
	}
	return $out;
}

if ( function_exists( 'aw_seo_extras_rank_math' ) && ! aw_seo_extras_rank_math() ) {
	// The title typed in the sidebar, for a single item (a list or an archive keeps WordPress's own).
	add_filter(
		'pre_get_document_title',
		function ( $title ) {
			if ( ! is_singular() || '' !== (string) $title ) {
				return $title;
			}
			$typed = function_exists( 'aw_seo_typed' ) ? aw_seo_typed( 'title' ) : '';
			return '' !== $typed ? rankweb_plain_text( $typed ) : $title;
		},
		20
	);

	add_action(
		'wp_head',
		function () {
			if ( is_404() || is_admin() || ! ( is_singular() || is_front_page() || is_home() ) ) {
				return;
			}
			$obj   = get_queried_object();
			$title = wp_get_document_title();
			$desc  = function_exists( 'aw_seo_description' ) ? rankweb_plain_text( (string) aw_seo_description() ) : '';
			$img   = function_exists( 'aw_seo_image' ) ? aw_seo_image() : null;
			$image = array();
			if ( is_array( $img ) && ! empty( $img['url'] ) ) {
				$sq    = function_exists( 'aw_seo_share_square' ) ? aw_seo_share_square( ! empty( $img['id'] ) ? (int) $img['id'] : (string) $img['url'] ) : array( $img['url'], 0, 0, '' );
				$image = array(
					'url'    => (string) $sq[0],
					'width'  => (int) ( $sq[1] ?: ( $img['width'] ?? 0 ) ),
					'height' => (int) ( $sq[2] ?: ( $img['height'] ?? 0 ) ),
					'type'   => (string) ( $sq[3] ?: ( $img['type'] ?? '' ) ),
					'alt'    => $obj instanceof WP_Post ? rankweb_plain_text( $obj->post_title ) : '',
				);
			}
			$types = defined( 'AW_SEO_ARTICLE_TYPES' ) ? (array) AW_SEO_ARTICLE_TYPES : array( 'post' );
			echo rankweb_share_tags( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- every value is escaped inside rankweb_share_tags()
				array(
					'type'        => is_singular( $types ) ? 'article' : 'website',
					'title'       => $title,
					'description' => $desc,
					'url'         => is_singular() ? (string) get_permalink() : home_url( '/' ),
					'site_name'   => get_bloginfo( 'name' ),
					'locale'      => str_replace( '-', '_', determine_locale() ),
					'image'       => $image,
				)
			);
		},
		5
	);
}
