<?php
/**
 * The page head when RankWeb prints it (standalone-seo.php: rankweb_prints_head()): the SEO title typed in the editor
 * sidebar, and rankweb_share_tags(), the Open Graph and Twitter tags as HTML. With Rank Math active none of this runs:
 * Rank Math prints its own, and opengraph.php adjusts them.
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

// The title typed in the sidebar, for a single item (a list or an archive keeps WordPress's own), when RankWeb prints the
// page head (no Rank Math, Yoast SEO, SEOPress or All in One SEO). The description, Open Graph and Twitter tags of that
// head are printed once, by standalone-seo.php (rankweb_print_head_tags()).
if ( function_exists( 'rankweb_prints_head' ) ? rankweb_prints_head() : ( function_exists( 'rankweb_seo_extras_rank_math' ) && ! rankweb_seo_extras_rank_math() ) ) {
	add_filter(
		'pre_get_document_title',
		function ( $title ) {
			if ( ! is_singular() || '' !== (string) $title ) {
				return $title;
			}
			$typed = function_exists( 'rankweb_seo_typed' ) ? rankweb_seo_typed( 'title' ) : '';
			return '' !== $typed ? rankweb_plain_text( $typed ) : $title;
		},
		20
	);
}
