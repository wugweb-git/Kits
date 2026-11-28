<?php
/**
 * The earlier aw_* function names, for this site's theme and layers. The plugins no longer define them: each name hands over
 * to the function in the plugin that owns it (directoryweb_, sourceweb_, insightweb_, rankweb_). Remove a line when no caller is left.
 *
 * @package animalwrites-kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'aw_claim_logo_ok' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_claim_logo_ok( ...$args ) {
		return function_exists( 'directoryweb_claim_logo_ok' ) ? directoryweb_claim_logo_ok( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_claim_logo_store' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_claim_logo_store( ...$args ) {
		return function_exists( 'directoryweb_claim_logo_store' ) ? directoryweb_claim_logo_store( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_contact_score' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_contact_score( ...$args ) {
		return function_exists( 'directoryweb_contact_score' ) ? directoryweb_contact_score( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_directory_filter' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_directory_filter( ...$args ) {
		return function_exists( 'directoryweb_directory_filter' ) ? directoryweb_directory_filter( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_directory_url' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_directory_url( ...$args ) {
		return function_exists( 'directoryweb_directory_url' ) ? directoryweb_directory_url( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_add_row' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_add_row( ...$args ) {
		return function_exists( 'sourceweb_enrich_add_row' ) ? sourceweb_enrich_add_row( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_after_change' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_after_change( ...$args ) {
		return function_exists( 'sourceweb_enrich_after_change' ) ? sourceweb_enrich_after_change( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_icon' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_icon( ...$args ) {
		return function_exists( 'sourceweb_enrich_icon' ) ? sourceweb_enrich_icon( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_install' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_install( ...$args ) {
		return function_exists( 'sourceweb_enrich_install' ) ? sourceweb_enrich_install( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_last_applied' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_last_applied( ...$args ) {
		return function_exists( 'sourceweb_enrich_last_applied' ) ? sourceweb_enrich_last_applied( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_profile_extras' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_profile_extras( ...$args ) {
		return function_exists( 'sourceweb_enrich_profile_extras' ) ? sourceweb_enrich_profile_extras( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_progress' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_progress( ...$args ) {
		return function_exists( 'sourceweb_enrich_progress' ) ? sourceweb_enrich_progress( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_provenance' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_provenance( ...$args ) {
		return function_exists( 'sourceweb_enrich_provenance' ) ? sourceweb_enrich_provenance( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_review_page' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_review_page( ...$args ) {
		return function_exists( 'sourceweb_enrich_review_page' ) ? sourceweb_enrich_review_page( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_snapshot' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_snapshot( ...$args ) {
		return function_exists( 'sourceweb_enrich_snapshot' ) ? sourceweb_enrich_snapshot( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_enrich_table' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_enrich_table( ...$args ) {
		return function_exists( 'sourceweb_enrich_table' ) ? sourceweb_enrich_table( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_featured_names' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_featured_names( ...$args ) {
		return function_exists( 'directoryweb_featured_names' ) ? directoryweb_featured_names( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_is_directory_view' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_is_directory_view( ...$args ) {
		return function_exists( 'directoryweb_is_directory_view' ) ? directoryweb_is_directory_view( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_issuer_short' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_issuer_short( ...$args ) {
		return function_exists( 'sourceweb_issuer_short' ) ? sourceweb_issuer_short( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_issuers' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_issuers( ...$args ) {
		return function_exists( 'sourceweb_issuers' ) ? sourceweb_issuers( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_item_codes' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_item_codes( ...$args ) {
		return function_exists( 'directoryweb_item_codes' ) ? directoryweb_item_codes( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_item_issuer' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_item_issuer( ...$args ) {
		return function_exists( 'sourceweb_item_issuer' ) ? sourceweb_item_issuer( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_lgd' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_lgd( ...$args ) {
		return function_exists( 'directoryweb_lgd' ) ? directoryweb_lgd( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_listing_place' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_listing_place( ...$args ) {
		return function_exists( 'directoryweb_listing_place' ) ? directoryweb_listing_place( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_listing_sources' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_listing_sources( ...$args ) {
		return function_exists( 'directoryweb_listing_sources' ) ? directoryweb_listing_sources( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_org_listing_ok' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_org_listing_ok( ...$args ) {
		return function_exists( 'directoryweb_org_listing_ok' ) ? directoryweb_org_listing_ok( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_place_by_slug' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_place_by_slug( ...$args ) {
		return function_exists( 'directoryweb_place_by_slug' ) ? directoryweb_place_by_slug( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_place_counts_reset' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_place_counts_reset( ...$args ) {
		return function_exists( 'directoryweb_place_counts_reset' ) ? directoryweb_place_counts_reset( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_place_district' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_place_district( ...$args ) {
		return function_exists( 'directoryweb_place_district' ) ? directoryweb_place_district( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_place_districts' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_place_districts( ...$args ) {
		return function_exists( 'directoryweb_place_districts' ) ? directoryweb_place_districts( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_place_key' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_place_key( ...$args ) {
		return function_exists( 'directoryweb_place_key' ) ? directoryweb_place_key( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_place_state' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_place_state( ...$args ) {
		return function_exists( 'directoryweb_place_state' ) ? directoryweb_place_state( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_place_states' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_place_states( ...$args ) {
		return function_exists( 'directoryweb_place_states' ) ? directoryweb_place_states( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_places_from_text' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_places_from_text( ...$args ) {
		return function_exists( 'directoryweb_places_from_text' ) ? directoryweb_places_from_text( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_post_types' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_post_types( ...$args ) {
		return function_exists( 'directoryweb_post_types' ) ? directoryweb_post_types( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_review_count' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_review_count( ...$args ) {
		return function_exists( 'sourceweb_review_count' ) ? sourceweb_review_count( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_seo_kp_refusal' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_seo_kp_refusal( ...$args ) {
		return function_exists( 'rankweb_seo_kp_refusal' ) ? rankweb_seo_kp_refusal( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_seo_kp_replay' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_seo_kp_replay( ...$args ) {
		return function_exists( 'rankweb_seo_kp_replay' ) ? rankweb_seo_kp_replay( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_set_item_places' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_set_item_places( ...$args ) {
		return function_exists( 'directoryweb_set_item_places' ) ? directoryweb_set_item_places( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_si_cap' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_si_cap( ...$args ) {
		return function_exists( 'insightweb_si_cap' ) ? insightweb_si_cap( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_si_health_test' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_si_health_test( ...$args ) {
		return function_exists( 'insightweb_si_health_test' ) ? insightweb_si_health_test( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_si_norm' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_si_norm( ...$args ) {
		return function_exists( 'insightweb_si_norm' ) ? insightweb_si_norm( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_si_object_path' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_si_object_path( ...$args ) {
		return function_exists( 'insightweb_si_object_path' ) ? insightweb_si_object_path( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_si_ready' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_si_ready( ...$args ) {
		return function_exists( 'insightweb_si_ready' ) ? insightweb_si_ready( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_si_table' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_si_table( ...$args ) {
		return function_exists( 'insightweb_si_table' ) ? insightweb_si_table( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_si_url' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_si_url( ...$args ) {
		return function_exists( 'insightweb_si_url' ) ? insightweb_si_url( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_summary_description' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_summary_description( ...$args ) {
		return function_exists( 'sourceweb_summary_description' ) ? sourceweb_summary_description( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_summary_section' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_summary_section( ...$args ) {
		return function_exists( 'sourceweb_summary_section' ) ? sourceweb_summary_section( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_unverified_add' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_unverified_add( ...$args ) {
		return function_exists( 'directoryweb_unverified_add' ) ? directoryweb_unverified_add( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_unverified_list' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_unverified_list( ...$args ) {
		return function_exists( 'directoryweb_unverified_list' ) ? directoryweb_unverified_list( ...$args ) : null;
	}
}

if ( ! function_exists( 'aw_unverified_remove' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- earlier name
	function aw_unverified_remove( ...$args ) {
		return function_exists( 'directoryweb_unverified_remove' ) ? directoryweb_unverified_remove( ...$args ) : null;
	}
}
