<?php
/**
 * Kits by Wugweb: full theme metadata, purpose, capabilities, logo assets, and Appearance > Themes / themes_api integration.
 *
 * @package kits-by-wugweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Returns full metadata for the Kits by Wugweb theme (title, purpose, capabilities, logos, and product links).
 *
 * @return array<string, mixed>
 */
function kits_theme_metadata(): array {
	$theme = function_exists( 'wp_get_theme' ) ? wp_get_theme( get_template() ) : null;
	$uri   = function_exists( 'get_template_directory_uri' ) ? get_template_directory_uri() : '';

	$version     = $theme ? (string) $theme->get( 'Version' ) : '2.2.0';
	$title       = $theme ? (string) $theme->get( 'Name' ) : 'Kits by Wugweb';
	$description = $theme ? (string) $theme->get( 'Description' ) : '';

	return array(
		'slug'        => 'kits-by-wugweb',
		'title'       => $title,
		'version'     => $version,
		'author'      => 'Wugweb',
		'author_uri'  => 'https://wugweb.com',
		'theme_uri'   => 'https://wugweb.com/themes/kits-by-wugweb/',
		'purpose'     => __( 'Full-site-editing (FSE) multipurpose block theme driven by semantic design tokens, style variations, and zero-dependency Day/Night anti-FOUC.', 'kits-by-wugweb' ),
		'description' => $description,
		'functions'   => array(
			'tokens'     => __( 'Semantic theme.json v3 token engine (colour, typography, spacing, radius, shadows).', 'kits-by-wugweb' ),
			'patterns'   => __( '47+ native block patterns across Components, Lists, Pages, Headers, and Footers.', 'kits-by-wugweb' ),
			'variations' => __( 'Site Editor style variations (Default, Slate, Forest, Dark) with instant theme switching.', 'kits-by-wugweb' ),
			'a11y'       => __( 'WCAG-verified contrast pairs, local Inter WOFF2 font, and accessible navigation/breadcrumbs.', 'kits-by-wugweb' ),
		),
		'logo'        => array(
			'svg' => $uri . '/assets/images/kits-icon.svg',
			'1x'  => $uri . '/assets/images/kits-icon-128.png',
			'2x'  => $uri . '/assets/images/kits-icon-256.png',
		),
		'screenshot'  => $uri . '/screenshot.jpg',
		'links'       => array(
			'faq'     => 'https://wugweb.com/themes/kits-by-wugweb/#faq',
			'rate'    => 'https://wugweb.com/themes/kits-by-wugweb/reviews/#new-post',
			'details' => 'https://wugweb.com/themes/kits-by-wugweb/',
			'support' => 'https://wugweb.com/support/?product=kits-by-wugweb',
			'more'    => 'https://wugweb.com/themes/',
			'upgrade' => 'https://wugweb.com/pricing/?product=kits-by-wugweb',
		),
	);
}

/**
 * Enriches the Appearance > Themes details panel with Kits by Wugweb's logo, purpose, and action links.
 *
 * @param array<string, array<string, mixed>> $prepared_themes Themes prepared for JS.
 * @return array<string, array<string, mixed>>
 */
function kits_theme_prepare_for_js( array $prepared_themes ): array {
	if ( empty( $prepared_themes['kits-by-wugweb'] ) ) {
		return $prepared_themes;
	}
	$meta  = kits_theme_metadata();
	$links = $meta['links'];
	$bar   = implode(
		' | ',
		array(
			'<a href="' . esc_url( $links['faq'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'FAQ', 'kits-by-wugweb' ) . '</a>',
			'<a href="' . esc_url( $links['rate'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Rate Kits by Wugweb', 'kits-by-wugweb' ) . '</a>',
			'<a href="' . esc_url( $links['details'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'View details', 'kits-by-wugweb' ) . '</a>',
			'<a href="' . esc_url( $links['support'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Support', 'kits-by-wugweb' ) . '</a>',
			'<a href="' . esc_url( $links['more'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'More', 'kits-by-wugweb' ) . '</a>',
			'<a href="' . esc_url( $links['upgrade'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Upgrade to Premium', 'kits-by-wugweb' ) . '</a>',
		)
	);

	$prepared_themes['kits-by-wugweb']['description'] .= '<p><strong>' . esc_html__( 'Purpose:', 'kits-by-wugweb' ) . '</strong> ' . esc_html( $meta['purpose'] ) . '</p><p>' . $bar . '</p>';
	$prepared_themes['kits-by-wugweb']['kitsMeta']     = $meta;
	return $prepared_themes;
}
add_filter( 'wp_prepare_themes_for_js', 'kits_theme_prepare_for_js' );

/**
 * Provides full theme metadata to WordPress's themes_api('theme_information') endpoint.
 *
 * @param false|object|array $res    Existing response.
 * @param string             $action API action.
 * @param object             $args   Request arguments.
 * @return false|object|array
 */
function kits_theme_api_details( $res, $action, $args ) {
	if ( 'theme_information' !== $action || 'kits-by-wugweb' !== ( $args->slug ?? '' ) ) {
		return $res;
	}
	$meta = kits_theme_metadata();
	return (object) array(
		'name'           => $meta['title'],
		'slug'           => $meta['slug'],
		'version'        => $meta['version'],
		'author'         => $meta['author'],
		'preview_url'    => $meta['theme_uri'],
		'screenshot_url' => $meta['screenshot'],
		'homepage'       => $meta['theme_uri'],
		'sections'       => array(
			'description' => esc_html( $meta['description'] . ' ' . $meta['purpose'] ),
		),
	);
}
add_filter( 'themes_api', 'kits_theme_api_details', 10, 3 );
