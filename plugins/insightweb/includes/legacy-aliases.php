<?php
/**
 * Earlier function names, kept for callers outside this plugin (Kits Core, RankWeb, DirectoryWeb and sites that predate the
 * rename). Each one only passes its arguments to the insightweb_ function; new code calls that one.
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'aw_si_cap' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_si_cap( ...$args ) {
		return insightweb_si_cap( ...$args );
	}
}

if ( ! function_exists( 'aw_si_health_test' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_si_health_test( ...$args ) {
		return insightweb_si_health_test( ...$args );
	}
}

if ( ! function_exists( 'aw_si_norm' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_si_norm( ...$args ) {
		return insightweb_si_norm( ...$args );
	}
}

if ( ! function_exists( 'aw_si_object_path' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_si_object_path( ...$args ) {
		return insightweb_si_object_path( ...$args );
	}
}

if ( ! function_exists( 'aw_si_ready' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_si_ready( ...$args ) {
		return insightweb_si_ready( ...$args );
	}
}

if ( ! function_exists( 'aw_si_table' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_si_table( ...$args ) {
		return insightweb_si_table( ...$args );
	}
}

if ( ! function_exists( 'aw_si_url' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_si_url( ...$args ) {
		return insightweb_si_url( ...$args );
	}
}
