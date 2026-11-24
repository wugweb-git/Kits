<?php
/**
 * DirectoryWeb's own functions: the listing type, the field group lists, activation and deactivation.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The listing post type, with the arguments Animal Writes Core's content-types.php builds for it (one function builds
 * them, aw_content_type_args()), and the core category on it, as Core's loop gave it.
 */
function directoryweb_register_listing_type(): void {
	if ( function_exists( 'aw_content_type_args' ) ) {
		$args = aw_content_type_args( 'aw_listing' );
	} else {
		// Standalone (no Animal Writes Core): a plain public listing type, so a fresh install can create listings.
		// The identifier stays `aw_listing`; sites that run Core keep the arguments Core builds above.
		$args = array(
			'labels'       => array(
				'name'          => __( 'Listings', 'directoryweb' ),
				'singular_name' => __( 'Listing', 'directoryweb' ),
			),
			'public'       => true,
			'show_in_rest' => true,
			'has_archive'  => 'directory',
			'rewrite'      => array( 'slug' => 'directory' ),
			'menu_icon'    => 'dashicons-location',
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions' ),
			'taxonomies'   => array( 'category' ),
		);
	}
	register_post_type( 'aw_listing', $args );
	register_taxonomy_for_object_type( 'category', 'aw_listing' );
}
/** One flush of the rewrite rules after the first deploy of a version (the Directory addresses come from this plugin now). */
add_action(
	'init',
	function () {
		if ( DIRECTORYWEB_VERSION !== get_option( 'directoryweb_rewrite_ver' ) ) {
			flush_rewrite_rules();
			update_option( 'directoryweb_rewrite_ver', DIRECTORYWEB_VERSION, false );
		}
	},
	99
);

/** Activation: rewrite rules for the Directory addresses, the capability, one flush. */
function directoryweb_activate(): void {
	if ( ! defined( 'DIRECTORYWEB_LOADED' ) ) {
		return;
	}
	directoryweb_register_listing_type();
	aw_directory_rewrites();
	directoryweb_register_meta();
	if ( function_exists( 'aw_register_meta' ) ) {
		aw_register_meta();
	}
	directoryweb_caps_grant();
	if ( function_exists( 'directoryweb_ensure_claim_page' ) ) {
		directoryweb_ensure_claim_page(); // the /claim/ page the claim links point to
	}
	flush_rewrite_rules();
	update_option( 'directoryweb_rewrite_ver', DIRECTORYWEB_VERSION, false );
}

/** Deactivation: only the rewrite rules are flushed; nothing is deleted. */
function directoryweb_deactivate(): void {
	flush_rewrite_rules();
}
