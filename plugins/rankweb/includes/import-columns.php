<?php
/**
 * Import columns: an outside source (a Notion sync, a CSV script, a headless CMS) that stores SEO values under its own
 * meta keys has them copied into the fields the SEO plugin reads (rank_math_title, rank_math_description,
 * rank_math_focus_keyword, rank_math_canonical_url, rank_math_facebook_image, noindex), so the source site keeps no SEO
 * fields of its own. A site lists its prefixes with the `rankweb_import_prefixes` filter; the suffixes are seo_title,
 * seo_description, focus_keyword, canonical_url, og_image and no_index. Runs when the source key is added or updated.
 * Never deletes the source key. A site that sets no prefix gets nothing from this file.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Meta key prefixes (e.g. 'wugweb_', 'wugweb_cs_') whose SEO columns are copied. None unless a site adds them. */
function rankweb_import_prefixes(): array {
	return array_values( array_filter( array_map( 'strval', (array) apply_filters( 'rankweb_import_prefixes', array() ) ) ) );
}

/** Which Rank Math field a source key feeds, or '' when the key is not an SEO column. */
function rankweb_import_target( string $key ): string {
	static $map = array(
		'seo_title'       => 'rank_math_title',
		'seo_description' => 'rank_math_description',
		'focus_keyword'   => 'rank_math_focus_keyword',
		'canonical_url'   => 'rank_math_canonical_url',
		'og_image'        => 'rank_math_facebook_image',
		'no_index'        => 'rank_math_robots',
	);
	foreach ( rankweb_import_prefixes() as $prefix ) {
		if ( 0 === strpos( $key, $prefix ) && isset( $map[ substr( $key, strlen( $prefix ) ) ] ) ) {
			return $map[ substr( $key, strlen( $prefix ) ) ];
		}
	}
	return '';
}

/** The value as the SEO plugin wants it. Title gets the site name when it still fits 60 characters. */
function rankweb_import_value( string $target, $value, int $post_id ) {
	$value = is_string( $value ) ? trim( $value ) : $value;
	if ( 'rank_math_title' === $target ) {
		$suffix = (string) apply_filters( 'rankweb_import_title_suffix', ' | ' . get_bloginfo( 'name' ) );
		return ( '' !== $suffix && mb_strlen( $value . $suffix ) <= 60 && false === stripos( $value, (string) get_bloginfo( 'name' ) ) ) ? $value . $suffix : $value;
	}
	if ( 'rank_math_canonical_url' === $target && '' !== $value && 0 !== strpos( $value, 'http' ) ) {
		return trailingslashit( (string) apply_filters( 'rankweb_import_canonical_origin', home_url() ) ) . ltrim( rtrim( $value, '/' ), '/' ) . '/';
	}
	if ( 'rank_math_robots' === $target ) {
		$robots = (array) get_post_meta( $post_id, 'rank_math_robots', true );
		$robots = array_values( array_diff( $robots, array( 'index', 'noindex' ) ) );
		$robots[] = in_array( strtolower( (string) $value ), array( '1', 'true', 'yes', 'noindex' ), true ) ? 'noindex' : 'index';
		return $robots;
	}
	return $value;
}

function rankweb_import_on_meta( $meta_id, $post_id, $key, $value ): void {
	$target = rankweb_import_target( (string) $key );
	if ( '' === $target ) {
		return;
	}
	$out = rankweb_import_value( $target, $value, (int) $post_id );
	if ( '' === $out || array() === $out ) {
		return;
	}
	update_post_meta( (int) $post_id, $target, $out );
}
add_action( 'added_post_meta', 'rankweb_import_on_meta', 10, 4 );
add_action( 'updated_post_meta', 'rankweb_import_on_meta', 10, 4 );
