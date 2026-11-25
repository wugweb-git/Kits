<?php
/**
 * Gutenberg block: directoryweb/collection-filter
 *
 * The directory's faceted filter (state, district, type, services, verified, search) as a block, replacing the
 * [directoryweb_directory_filter] shortcode, which stays for existing content. The filter itself is directoryweb_directory_filter()
 * (directory.php), so URL state, facet caching and the query engine are the same for the block and the shortcode.
 * No Kits Core and no SCF are needed.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Register the block. */
function directoryweb_register_collection_filter_block() {
	register_block_type(
		'directoryweb/collection-filter',
		array(
			'api_version'     => 3,
			'title'           => __( 'Directory filter', 'directoryweb' ),
			'description'     => __( 'Filter the directory by place, type, services and verified status.', 'directoryweb' ),
			'category'        => 'widgets',
			'icon'            => 'filter',
			'supports'        => array(
				'autoRegister' => true,
				'html'         => false,
				'align'        => array( 'wide', 'full' ),
			),
			'attributes'      => array(
				'type' => array(
					'type'    => 'string',
					'default' => '',
				),
			),
			'render_callback' => 'directoryweb_collection_filter_render',
		)
	);
}
add_action( 'init', 'directoryweb_register_collection_filter_block' );

/**
 * Render the block: only a known organisation type is passed on, anything else means "all types".
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function directoryweb_collection_filter_render( $attributes = array() ) {
	if ( ! function_exists( 'directoryweb_directory_filter' ) ) {
		return '';
	}
	if ( function_exists( 'directoryweb_use_style' ) ) {
		directoryweb_use_style( 'aw-directory' );
	}
	$type = sanitize_key( (string) ( $attributes['type'] ?? '' ) );
	if ( '' !== $type && function_exists( 'directoryweb_listing_type_ok' ) && ! directoryweb_listing_type_ok( $type ) ) {
		$type = '';
	}
	return '<div class="wp-block-directoryweb-collection-filter">' . directoryweb_directory_filter( $type ) . '</div>';
}
