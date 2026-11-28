<?php
/**
 * Route a pushed keyword candidate ON APPROVAL (owner, 17 Nov 2026). When the owner approves a suggestion InsightWeb
 * pushed (or an owner-set auto-approve rule fires), its recommended use and topic become a real keyword with the right
 * Section, Role, Category and search on/off, using the EXISTING Section rules (aw_sources['sections']).
 *
 * - recommended_type → Section (post type): the type the site gives the role of the same name (news, library, campaign).
 * - topic → Category: the category whose slug or name matches the topic (if any), which adds the Category-word role.
 * - Role: Include (keeps the item and, in English, runs its own Google News search); search on.
 * - Two auto-approve rules, BOTH OFF by default (option sourceweb_sourcing_push_autoapprove), the owner toggles them:
 *     • score ≥ N and recommended_type in a chosen set;
 *     • proven focus keyphrases (the site already ranks) with rank ≤ N.
 *   Off, every candidate waits for a person in Keywords → Suggestions (the default: never auto-insert).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SOURCEWEB_SOURCING_PUSH_AUTOAPPROVE = 'aw_sourcing_push_autoapprove';

/**
 * The section (post type) a recommended_type routes to: news, library and campaign are role names
 * (post-type-roles.php); '' for any other value or a role the site has no type for.
 *
 * @param string $type recommended_type.
 * @return string
 */
function sourceweb_sourcing_push_section( $type ) {
	return in_array( $type, SOURCEWEB_SOURCING_PUSHED_TYPES, true ) ? sourceweb_type( (string) $type ) : '';
}

/** The auto-approve settings, both rules off by default. */
function sourceweb_sourcing_push_autoapprove() {
	$o = (array) get_option( SOURCEWEB_SOURCING_PUSH_AUTOAPPROVE, array() );
	return array(
		'on_score'    => ! empty( $o['on_score'] ),
		'min_score'   => max( 0, (int) ( $o['min_score'] ?? 80 ) ),
		'types'       => array_values( array_intersect( SOURCEWEB_SOURCING_PUSHED_TYPES, array_map( 'strval', (array) ( $o['types'] ?? array() ) ) ) ),
		'on_proven'   => ! empty( $o['on_proven'] ),
		'proven_rank' => max( 1, (int) ( $o['proven_rank'] ?? 10 ) ),
	);
}

/**
 * Save the auto-approve settings from posted values (unknown keys ignored); logs a change.
 *
 * @param array $in Posted settings.
 * @return array The stored settings.
 */
function sourceweb_sourcing_push_autoapprove_save( array $in ) {
	$old = sourceweb_sourcing_push_autoapprove();
	$new = array(
		'on_score'    => ! empty( $in['on_score'] ),
		'min_score'   => max( 0, (int) ( $in['min_score'] ?? $old['min_score'] ) ),
		'types'       => array_values( array_intersect( SOURCEWEB_SOURCING_PUSHED_TYPES, array_map( 'strval', (array) ( $in['types'] ?? array() ) ) ) ),
		'on_proven'   => ! empty( $in['on_proven'] ),
		'proven_rank' => max( 1, (int) ( $in['proven_rank'] ?? $old['proven_rank'] ) ),
	);
	if ( $new !== $old ) {
		update_option( SOURCEWEB_SOURCING_PUSH_AUTOAPPROVE, $new, false );
		sourceweb_src_log( 'keywords', 'Pushed-keyword auto-approve: ' . ( $new['on_score'] ? 'score ≥ ' . $new['min_score'] . ' (' . ( $new['types'] ? implode( ', ', $new['types'] ) : 'any type' ) . ')' : 'score rule off' ) . '; ' . ( $new['on_proven'] ? 'proven rank ≤ ' . $new['proven_rank'] : 'proven rule off' ) );
	}
	return $new;
}

/**
 * The routing a pushed candidate maps to: the section, role bits, category slug (if the topic matches one) and search on.
 *
 * @param array $cand A pushed candidate (recommended_type, topic, ...).
 * @return array{roles:int, sections:string[], categories:string[], search_on:int}
 */
function sourceweb_sourcing_push_routing( array $cand ) {
	$roles    = defined( 'SOURCEWEB_KW_ROLE_INCLUDE' ) ? SOURCEWEB_KW_ROLE_INCLUDE : 1;
	$sections = array();
	$type     = (string) ( $cand['recommended_type'] ?? '' );
	$section  = sourceweb_sourcing_push_section( $type );
	if ( '' !== $section && post_type_exists( $section ) ) {
		$sections[] = $section;
	}
	$categories = array();
	$topic      = trim( (string) ( $cand['topic'] ?? '' ) );
	if ( '' !== $topic ) {
		$term = get_term_by( 'slug', sanitize_title( $topic ), 'category' );
		if ( ! $term ) {
			$term = get_term_by( 'name', $topic, 'category' );
		}
		if ( $term instanceof WP_Term ) {
			$categories[] = $term->slug;
			$roles       |= ( defined( 'SOURCEWEB_KW_ROLE_CATEGORY' ) ? SOURCEWEB_KW_ROLE_CATEGORY : 1024 );
		}
	}
	return array(
		'roles'      => $roles,
		'sections'   => $sections,
		'categories' => $categories,
		'search_on'  => 1,
	);
}

/**
 * Approve one pushed candidate and route it into a keyword (Section, Role, Category, search on). The candidate is then
 * forgotten from the push store.
 *
 * @param string $q    The keyword (as suggested).
 * @param string $how  'owner' (a person approved) or 'auto' (an auto-approve rule).
 * @return bool|WP_Error Whether a keyword was added or changed.
 */
function sourceweb_sourcing_push_route( $q, $how = 'owner' ) {
	if ( ! function_exists( 'sourceweb_sourcing_kw_add' ) || ! function_exists( 'insightweb_si_norm' ) ) {
		return new WP_Error( 'aw_push_not_ready', 'Keywords are not set up yet.' );
	}
	$norm  = insightweb_si_norm( (string) $q );
	$store = sourceweb_sourcing_pushed_raw();
	$cand  = $store[ $norm ] ?? null;
	if ( ! is_array( $cand ) ) {
		return new WP_Error( 'aw_push_missing', 'No such pushed keyword.' );
	}
	$route = sourceweb_sourcing_push_routing( $cand );
	$r     = sourceweb_sourcing_kw_add(
		(string) $cand['q'],
		array(
			'roles'     => $route['roles'],
			'sections'  => $route['sections'],
			'categories' => $route['categories'],
			'search_on' => $route['search_on'],
		)
	);
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$where = $route['sections'] ? implode( ', ', $route['sections'] ) : 'no section';
	$cats  = $route['categories'] ? ', category ' . implode( ', ', $route['categories'] ) : '';
	sourceweb_src_log( 'keywords', $cand['q'] . ': approved from Search Insights (' . ( 'auto' === $how ? 'auto-approved' : 'owner' ) . '), routed to ' . $where . $cats, '', 'Include' );
	sourceweb_sourcing_pushed_forget( $norm );
	return true;
}

/**
 * Whether a candidate qualifies for an auto-approve rule ('' when it does not).
 *
 * @param array $cand     A pushed candidate.
 * @param array $settings sourceweb_sourcing_push_autoapprove().
 * @return string Why it qualifies ('' = not).
 */
function sourceweb_sourcing_push_autoapprove_match( array $cand, array $settings ) {
	if ( $settings['on_proven'] && ! empty( $cand['focus_keyphrase'] ) && (int) ( $cand['rank'] ?? 0 ) >= 1 && (int) $cand['rank'] <= $settings['proven_rank'] ) {
		return 'proven';
	}
	if ( $settings['on_score'] && (int) ( $cand['score'] ?? 0 ) >= $settings['min_score'] ) {
		if ( ! $settings['types'] || in_array( (string) ( $cand['recommended_type'] ?? '' ), $settings['types'], true ) ) {
			return 'score';
		}
	}
	return '';
}

/**
 * Apply the auto-approve rules to the stored candidates (both off by default: nothing happens). A candidate a keyword
 * already covers, or that is dismissed, is left alone.
 *
 * @return int How many were auto-routed.
 */
function sourceweb_sourcing_push_autoroute() {
	$settings = sourceweb_sourcing_push_autoapprove();
	if ( ! $settings['on_score'] && ! $settings['on_proven'] ) {
		return 0; // the default: never auto-insert
	}
	$n = 0;
	foreach ( sourceweb_sourcing_pushed_raw() as $cand ) {
		if ( ! is_array( $cand ) || '' === sourceweb_sourcing_push_autoapprove_match( $cand, $settings ) ) {
			continue;
		}
		$r = sourceweb_sourcing_push_route( (string) $cand['q'], 'auto' );
		if ( true === $r ) {
			++$n;
		}
	}
	return $n;
}
// Right after a push lands, auto-route the ones an owner rule allows (off by default).
add_action( 'sourceweb_push_keywords', fn() => sourceweb_sourcing_push_autoroute(), 20, 0 );
