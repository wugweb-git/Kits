<?php
/**
 * Animal Writes site layer: the earlier aw_* function names, kept so Kits Core and other code on this site that still call
 * them keep working. RankWeb itself ships none of them and calls none (SourceWeb calls the rankweb_* names). Each one hands
 * over to the rankweb_* function; remove one when no caller is left.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'aw_rank_math_redirect' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_rank_math_redirect( ...$args ) {
		return rankweb_rank_math_redirect( ...$args );
	}
}

if ( ! function_exists( 'aw_redirect_add' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_redirect_add( ...$args ) {
		return rankweb_redirect_add( ...$args );
	}
}

if ( ! function_exists( 'aw_seo_cut' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_cut( ...$args ) {
		return rankweb_seo_cut( ...$args );
	}
}

if ( ! function_exists( 'aw_seo_item_description' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_item_description( ...$args ) {
		return rankweb_seo_item_description( ...$args );
	}
}

// The site layer loads before RankWeb does, so the old directory constant is set once the plugin has defined its own.
add_action(
	'plugins_loaded',
	function () {
		if ( ! defined( 'AW_SEO_EXTRAS_DIR' ) && defined( 'RANKWEB_DIR' ) ) {
			define( 'AW_SEO_EXTRAS_DIR', RANKWEB_DIR ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
		}
	},
	6
);
