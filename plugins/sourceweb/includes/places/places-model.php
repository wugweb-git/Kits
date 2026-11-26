<?php
/**
 * Places (step 5 of SourceWeb's flow, ARCHITECTURE.md): where a sourced item goes. Plain functions with no WordPress
 * in them, so tests/run.php checks them.
 *
 * A place is a content type, another plugin, a workflow, or anything else that takes a finished item (an AI generator,
 * stats, research, a picture gallery, reviews). Each declares which enhancements fit it (step 6). A route is a boolean
 * test over the item and the place it chooses; the first route that matches wins, and an item no route matches goes to
 * the place of its own type, which is how it went before places existed.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The kinds of place. */
const SOURCEWEB_PLACE_KINDS = array( 'content_type', 'plugin', 'workflow', 'other' );

/**
 * One place, tidied, or null when it cannot be one (no id, or an unknown kind).
 *
 * @param array $p id, label, kind, post_type (content types), enhance (list of enhancement ids), owner (plugin slug).
 * @return array{id:string,label:string,kind:string,post_type:string,enhance:string[],owner:string}|null
 */
function sourceweb_place_clean( array $p ): ?array {
	$id   = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $p['id'] ?? '' ) ) );
	$kind = (string) ( $p['kind'] ?? 'content_type' );
	if ( '' === $id || ! in_array( $kind, SOURCEWEB_PLACE_KINDS, true ) ) {
		return null;
	}
	$post_type = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $p['post_type'] ?? '' ) ) );
	if ( 'content_type' === $kind && '' === $post_type ) {
		return null; // a content type place names its type
	}
	$enhance = array();
	foreach ( (array) ( $p['enhance'] ?? array() ) as $e ) {
		$e = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) $e ) );
		if ( '' !== $e && ! in_array( $e, $enhance, true ) ) {
			$enhance[] = $e;
		}
	}
	return array(
		'id'        => $id,
		'label'     => '' !== trim( (string) ( $p['label'] ?? '' ) ) ? trim( (string) $p['label'] ) : $id,
		'kind'      => $kind,
		'post_type' => $post_type,
		'enhance'   => $enhance,
		'owner'     => strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $p['owner'] ?? '' ) ) ),
	);
}

/**
 * The places that exist today: one content type place per post type SourceWeb fills, with the id equal to the type.
 *
 * @param string[] $post_types e.g. aw_news, aw_legal, post, aw_opportunity, aw_listing.
 * @return array<string, array> id => place.
 */
function sourceweb_places_default( array $post_types ): array {
	$out = array();
	foreach ( $post_types as $t ) {
		$p = sourceweb_place_clean(
			array(
				'id'        => (string) $t,
				'label'     => (string) $t,
				'kind'      => 'content_type',
				'post_type' => (string) $t,
			)
		);
		if ( $p ) {
			$out[ $p['id'] ] = $p;
		}
	}
	return $out;
}

/**
 * Tidies a list of places (from defaults plus whatever plugins register): bad ones are dropped, a later one with the
 * same id replaces an earlier one.
 *
 * @param array $places List of raw places, or id => raw place.
 * @return array<string, array> id => place.
 */
function sourceweb_places_clean( array $places ): array {
	$out = array();
	foreach ( $places as $p ) {
		$c = is_array( $p ) ? sourceweb_place_clean( $p ) : null;
		if ( $c ) {
			$out[ $c['id'] ] = $c;
		}
	}
	return $out;
}

/**
 * A boolean test over an item. An expression is an array whose first element is the operator:
 *   [ 'and', e, e, … ]   [ 'or', e, e, … ]   [ 'not', e ]
 *   [ 'eq', field, value ]   [ 'in', field, [ values ] ]   [ 'contains', field, text ] (case-insensitive)
 *   [ 'gte', field, number ]   [ 'has', field ]
 * An empty expression is true (no condition). An unknown operator or a malformed one is false: a rule that cannot be
 * read never lets an item through.
 *
 * @param mixed $expr Expression.
 * @param array $item Item fields.
 */
function sourceweb_expr_eval( $expr, array $item ): bool {
	if ( array() === $expr || null === $expr ) {
		return true;
	}
	if ( ! is_array( $expr ) || ! isset( $expr[0] ) || ! is_string( $expr[0] ) ) {
		return false;
	}
	$op   = $expr[0];
	$args = array_slice( $expr, 1 );
	$get  = static function ( $f ) use ( $item ) {
		return is_string( $f ) && array_key_exists( $f, $item ) ? $item[ $f ] : null;
	};
	switch ( $op ) {
		case 'and':
			foreach ( $args as $e ) {
				if ( ! sourceweb_expr_eval( $e, $item ) ) {
					return false;
				}
			}
			return (bool) $args;
		case 'or':
			foreach ( $args as $e ) {
				if ( sourceweb_expr_eval( $e, $item ) ) {
					return true;
				}
			}
			return false;
		case 'not':
			return 1 === count( $args ) && ! sourceweb_expr_eval( $args[0], $item );
		case 'eq':
			return 2 === count( $args ) && null !== $get( $args[0] ) && (string) $get( $args[0] ) === (string) $args[1];
		case 'in':
			return 2 === count( $args ) && is_array( $args[1] ) && null !== $get( $args[0] ) && in_array( (string) $get( $args[0] ), array_map( 'strval', $args[1] ), true );
		case 'contains':
			return 2 === count( $args ) && is_scalar( $get( $args[0] ) ) && is_scalar( $args[1] ) && '' !== (string) $args[1] && false !== stripos( (string) $get( $args[0] ), (string) $args[1] );
		case 'gte':
			return 2 === count( $args ) && is_numeric( $get( $args[0] ) ) && is_numeric( $args[1] ) && (float) $get( $args[0] ) >= (float) $args[1];
		case 'has':
			return 1 === count( $args ) && null !== $get( $args[0] ) && '' !== $get( $args[0] ) && array() !== $get( $args[0] );
	}
	return false;
}

/**
 * Where an item goes: the place of the first route whose test passes, else the place named like the item's own type,
 * else '' (no place: the caller keeps its own behaviour). A route naming a place that does not exist is skipped.
 *
 * @param array $item   Item fields; `type` is its content type.
 * @param array $routes List of [ 'when' => expression, 'place' => id ].
 * @param array $places id => place (sourceweb_places_clean()).
 */
function sourceweb_route( array $item, array $routes, array $places ): string {
	foreach ( $routes as $r ) {
		$id = is_array( $r ) ? (string) ( $r['place'] ?? '' ) : '';
		if ( isset( $places[ $id ] ) && sourceweb_expr_eval( $r['when'] ?? array(), $item ) ) {
			return $id;
		}
	}
	$own = (string) ( $item['type'] ?? '' );
	return isset( $places[ $own ] ) ? $own : '';
}

/**
 * The enhancements to run for a place, in the place's order, limited to those that exist.
 *
 * @param array    $place     A place.
 * @param string[] $available Enhancement ids that exist (summary, title, image, attribution, directory …).
 * @return string[]
 */
function sourceweb_place_enhancements( array $place, array $available ): array {
	return array_values( array_intersect( (array) ( $place['enhance'] ?? array() ), $available ) );
}
