<?php
/**
 * Legacy function names, kept only so other plugins and sites that still call the old Animal Writes names keep working.
 * Nothing inside directoryweb calls these. Each one hands over to the directoryweb_* function; remove one when no caller is left.
 *
 * @package DirectoryWeb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'aw_claim_logo_ok' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_claim_logo_ok( ...$args ) {
		return directoryweb_claim_logo_ok( ...$args );
	}
}

if ( ! function_exists( 'aw_claim_logo_store' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_claim_logo_store( ...$args ) {
		return directoryweb_claim_logo_store( ...$args );
	}
}

if ( ! function_exists( 'aw_contact_score' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_contact_score( ...$args ) {
		return directoryweb_contact_score( ...$args );
	}
}

if ( ! function_exists( 'aw_directory_url' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_directory_url( ...$args ) {
		return directoryweb_directory_url( ...$args );
	}
}

if ( ! function_exists( 'aw_featured_names' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_featured_names( ...$args ) {
		return function_exists( 'directoryweb_featured_names' ) ? directoryweb_featured_names( ...$args ) : array(); // the Animal Writes site layer defines it
	}
}

if ( ! function_exists( 'aw_is_directory_view' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_is_directory_view( ...$args ) {
		return directoryweb_is_directory_view( ...$args );
	}
}

if ( ! function_exists( 'aw_item_codes' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_item_codes( ...$args ) {
		return directoryweb_item_codes( ...$args );
	}
}

if ( ! function_exists( 'aw_lgd' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_lgd( ...$args ) {
		return directoryweb_lgd( ...$args );
	}
}

if ( ! function_exists( 'aw_listing_place' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_listing_place( ...$args ) {
		return directoryweb_listing_place( ...$args );
	}
}

if ( ! function_exists( 'aw_listing_sources' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_listing_sources( ...$args ) {
		return directoryweb_listing_sources( ...$args );
	}
}

if ( ! function_exists( 'aw_org_listing_ok' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_org_listing_ok( ...$args ) {
		return directoryweb_org_listing_ok( ...$args );
	}
}

if ( ! function_exists( 'aw_place_by_slug' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_place_by_slug( ...$args ) {
		return directoryweb_place_by_slug( ...$args );
	}
}

if ( ! function_exists( 'aw_place_counts_reset' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_place_counts_reset( ...$args ) {
		return directoryweb_place_counts_reset( ...$args );
	}
}

if ( ! function_exists( 'aw_place_district' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_place_district( ...$args ) {
		return directoryweb_place_district( ...$args );
	}
}

if ( ! function_exists( 'aw_place_districts' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_place_districts( ...$args ) {
		return directoryweb_place_districts( ...$args );
	}
}

if ( ! function_exists( 'aw_place_key' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_place_key( ...$args ) {
		return directoryweb_place_key( ...$args );
	}
}

if ( ! function_exists( 'aw_place_state' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_place_state( ...$args ) {
		return directoryweb_place_state( ...$args );
	}
}

if ( ! function_exists( 'aw_place_states' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_place_states( ...$args ) {
		return directoryweb_place_states( ...$args );
	}
}

if ( ! function_exists( 'aw_places_from_text' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_places_from_text( ...$args ) {
		return directoryweb_places_from_text( ...$args );
	}
}

if ( ! function_exists( 'aw_post_types' ) && function_exists( 'directoryweb_post_types' ) ) { // only when there is something to pass to: SourceWeb tests for aw_post_types() and was fatal on an alias with no target
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_post_types( ...$args ) {
		return directoryweb_post_types( ...$args );
	}
}

if ( ! function_exists( 'aw_set_item_places' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_set_item_places( ...$args ) {
		return directoryweb_set_item_places( ...$args );
	}
}

if ( ! function_exists( 'aw_unverified_add' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_unverified_add( ...$args ) {
		return directoryweb_unverified_add( ...$args );
	}
}

if ( ! function_exists( 'aw_unverified_list' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_unverified_list( ...$args ) {
		return directoryweb_unverified_list( ...$args );
	}
}

if ( ! function_exists( 'aw_unverified_remove' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- legacy name
	function aw_unverified_remove( ...$args ) {
		return directoryweb_unverified_remove( ...$args );
	}
}


/*
 * Scheduled jobs that used the old names: clear them once so only the renamed jobs run. The renamed jobs
 * are scheduled by their own code as before.
 */
add_action(
	'init',
	static function () {
		foreach ( array( 'aw_featured_rescan', 'aw_geocode_one' ) as $legacy_hook ) {
			if ( wp_next_scheduled( $legacy_hook ) ) {
				wp_clear_scheduled_hook( $legacy_hook );
			}
		}
	},
	1
);

if ( ! function_exists( 'dw_claim_upload_error' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name, still called by Kits Core's Fluent Forms bridge.
	function dw_claim_upload_error( ...$args ) {
		return directoryweb_claim_upload_error( ...$args );
	}
}
