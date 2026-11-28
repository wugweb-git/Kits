<?php
/**
 * SourceWeb's own basics: the capability, the publisher and relevance option names, host and publisher helpers and
 * the sourced post types. Kits Core had the same definitions until 18 Nov 2026 (now only here); each stays behind
 * function_exists / defined, so an older copy loaded first is harmless. Loaded by aw-sourcing.php before its
 * dependency check, because the site core plugin calls sourceweb_host() and sourceweb_publishers().
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'SOURCEWEB_PUB_OPTION' ) || define( 'SOURCEWEB_PUB_OPTION', 'aw_publishers' );
defined( 'SOURCEWEB_REL_OPTION' ) || define( 'SOURCEWEB_REL_OPTION', 'aw_relevance' );
defined( 'SOURCEWEB_SRC_CAP' ) || define( 'SOURCEWEB_SRC_CAP', 'manage_options' );

if ( ! function_exists( 'sourceweb_sourced_types' ) ) {
	/** Post types fed by sources (news-like). Sites set them with the kits_sourced_post_types filter. */
	function sourceweb_sourced_types() {
		return (array) apply_filters( 'kits_sourced_post_types', array( 'post' ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- a hook of WordPress core, another plugin, or the shared Kits set
	}
}

if ( ! function_exists( 'sourceweb_host' ) ) {
	/**
	 * Normalised host of a URL (lowercase, no www.).
	 *
	 * @param string $url URL.
	 */
	function sourceweb_host( $url ) {
		$h = strtolower( (string) wp_parse_url( (string) $url, PHP_URL_HOST ) );
		if ( '' === $h && preg_match( '#^([a-z0-9-]+\.)+[a-z]{2,}(/|$)#i', (string) $url ) ) {
			$h = strtolower( (string) wp_parse_url( 'https://' . (string) $url, PHP_URL_HOST ) );
		}
		return preg_replace( '/^www\./', '', $h );
	}
}

if ( ! function_exists( 'sourceweb_publishers' ) ) {
	/** Publisher records: host => [status, name, count, first, last]. */
	function sourceweb_publishers() {
		$p = get_option( SOURCEWEB_PUB_OPTION );
		return is_array( $p ) ? $p : array();
	}
}
