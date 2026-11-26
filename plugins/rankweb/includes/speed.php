<?php
/**
 * Page speed (RankWeb → Settings → Page speed): defer chosen scripts, Google Fonts display=swap, WebP for new uploads.
 * Every option is off or empty until set, except the font swap. No outside call; module "speed". The rules are in
 * class-rankweb-speed.php.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-speed.php';

add_filter(
	'script_loader_tag',
	function ( $tag, $handle ) {
		if ( is_admin() || ! defined( 'RANKWEB_DEFER_SCRIPTS' ) ) {
			return $tag;
		}
		return RankWeb_Speed::defer_tag( (string) $tag, (string) $handle, RankWeb_Speed::handles( RANKWEB_DEFER_SCRIPTS ) );
	},
	10,
	2
);

add_filter(
	'style_loader_src',
	function ( $src ) {
		return ( ! is_admin() && ( ! defined( 'RANKWEB_FONT_SWAP' ) || RANKWEB_FONT_SWAP ) && is_string( $src ) ) ? RankWeb_Speed::font_display( $src ) : $src;
	}
);

add_filter(
	'image_editor_output_format',
	function ( $map ) {
		if ( ! defined( 'RANKWEB_WEBP_UPLOADS' ) || ! RANKWEB_WEBP_UPLOADS || ! function_exists( 'wp_image_editor_supports' ) ) {
			return $map;
		}
		return RankWeb_Speed::webp_map( (array) $map, (bool) wp_image_editor_supports( array( 'mime_type' => 'image/webp' ) ) );
	}
);
