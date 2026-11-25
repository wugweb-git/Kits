<?php
/**
 * Legacy function names, kept only so other plugins and sites that still call the old Animal Writes names keep working.
 * Nothing inside rankweb calls these. Each one hands over to the rankweb_* function; remove one when no caller is left.
 *
 * @package RankWeb
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

if ( ! function_exists( 'aw_seo_dir_data' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_dir_data( ...$args ) {
		return rankweb_seo_dir_data( ...$args );
	}
}

if ( ! function_exists( 'aw_seo_item_description' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_item_description( ...$args ) {
		return rankweb_seo_item_description( ...$args );
	}
}

if ( ! function_exists( 'aw_seo_kp_refusal' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_kp_refusal( ...$args ) {
		return rankweb_seo_kp_refusal( ...$args );
	}
}

if ( ! function_exists( 'aw_seo_kp_replay' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_kp_replay( ...$args ) {
		return rankweb_seo_kp_replay( ...$args );
	}
}

if ( ! function_exists( 'aw_seo_share_jpeg_build' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_share_jpeg_build( ...$args ) {
		return rankweb_seo_share_jpeg_build( ...$args );
	}
}

if ( ! function_exists( 'aw_seo_share_square' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_seo_share_square( ...$args ) {
		return rankweb_seo_share_square( ...$args );
	}
}

if ( ! defined( 'AW_SEO_EXTRAS_DIR' ) && defined( 'RANKWEB_DIR' ) ) {
	define( 'AW_SEO_EXTRAS_DIR', RANKWEB_DIR ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
}

/*
 * Scheduled jobs that used the old names: clear them once so only the renamed jobs run. The renamed jobs
 * are scheduled by their own code as before.
 */
add_action(
	'init',
	static function () {
		foreach ( array( 'aw_seo_endpoints_watchdog', 'aw_seo_fill_daily', 'aw_seo_sitemap_daily', 'aw_faq_index_build' ) as $legacy_hook ) {
			if ( wp_next_scheduled( $legacy_hook ) ) {
				wp_clear_scheduled_hook( $legacy_hook );
			}
		}
	},
	1
);
