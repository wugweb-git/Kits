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

if ( ! defined( 'AW_SEO_EXTRAS_DIR' ) && defined( 'RANKWEB_DIR' ) ) {
	define( 'AW_SEO_EXTRAS_DIR', RANKWEB_DIR ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
}
