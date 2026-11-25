<?php
/**
 * Earlier function names, kept for callers outside this plugin (Kits Core, RankWeb, DirectoryWeb and sites that predate the
 * rename). Each one only passes its arguments to the sourceweb_ function; new code calls that one.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'aw_enrich_add_row' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_add_row( ...$args ) {
		return sourceweb_enrich_add_row( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_after_change' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_after_change( ...$args ) {
		return sourceweb_enrich_after_change( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_icon' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_icon( ...$args ) {
		return sourceweb_enrich_icon( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_install' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_install( ...$args ) {
		return sourceweb_enrich_install( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_last_applied' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_last_applied( ...$args ) {
		return sourceweb_enrich_last_applied( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_profile_extras' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_profile_extras( ...$args ) {
		return sourceweb_enrich_profile_extras( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_progress' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_progress( ...$args ) {
		return sourceweb_enrich_progress( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_provenance' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_provenance( ...$args ) {
		return sourceweb_enrich_provenance( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_review_page' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_review_page( ...$args ) {
		return sourceweb_enrich_review_page( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_snapshot' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_snapshot( ...$args ) {
		return sourceweb_enrich_snapshot( ...$args );
	}
}

if ( ! function_exists( 'aw_enrich_table' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_enrich_table( ...$args ) {
		return sourceweb_enrich_table( ...$args );
	}
}

if ( ! function_exists( 'aw_issuers' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_issuers( ...$args ) {
		return sourceweb_issuers( ...$args );
	}
}

if ( ! function_exists( 'aw_item_issuer' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_item_issuer( ...$args ) {
		return sourceweb_item_issuer( ...$args );
	}
}

if ( ! function_exists( 'aw_review_count' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_review_count( ...$args ) {
		return sourceweb_review_count( ...$args );
	}
}

if ( ! function_exists( 'aw_summary_description' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_summary_description( ...$args ) {
		return sourceweb_summary_description( ...$args );
	}
}

if ( ! function_exists( 'aw_summary_section' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, kept on purpose.
	function aw_summary_section( ...$args ) {
		return sourceweb_summary_section( ...$args );
	}
}
