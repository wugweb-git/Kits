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
 * @param string[] $post_types the site's content types (news, library, opportunity, listing) and post.
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
 * Add a place a person made on the Places screen. Its id comes from the label when none is given. Refused, with the
 * reason, when it cannot be a place, or its id is already a place (the site's content types, other plugins' places and
 * the ones made here all share one list of ids).
 *
 * @param array    $custom   The places made so far (a list of raw places).
 * @param array    $raw      id, label, kind, post_type, owner of the new one.
 * @param string[] $taken    Ids already used by any place.
 * @return array{0:array,1:string} The list with the new place added (or unchanged), and the reason it was refused ('' when added).
 */
function sourceweb_place_add( array $custom, array $raw, array $taken ): array {
	$label = trim( (string) ( $raw['label'] ?? '' ) );
	$id    = '' !== trim( (string) ( $raw['id'] ?? '' ) ) ? (string) $raw['id'] : $label;
	$id    = trim( preg_replace( '/[^a-z0-9_-]+/', '-', strtolower( $id ) ), '-_' );
	if ( '' === $id ) {
		return array( $custom, 'A place needs a name.' );
	}
	if ( in_array( $id, $taken, true ) ) {
		return array( $custom, 'There is already a place with the id "' . $id . '".' );
	}
	$raw['id'] = $id;
	if ( '' === $label ) {
		$raw['label'] = $id;
	}
	$place = sourceweb_place_clean( $raw );
	if ( ! $place ) {
		return array( $custom, 'A content type place has to name its content type.' );
	}
	$custom[] = array(
		'id'        => $place['id'],
		'label'     => $place['label'],
		'kind'      => $place['kind'],
		'post_type' => $place['post_type'],
		'owner'     => $place['owner'],
	);
	return array( $custom, '' );
}

/**
 * Remove a place made on the Places screen, unless a route still sends items to it.
 *
 * @param array  $custom The places made so far.
 * @param string $id     The place to remove.
 * @param array  $routes The saved routes ([ 'when' => …, 'place' => id ]).
 * @return array{0:array,1:string} The list, and the reason nothing was removed ('' when removed).
 */
function sourceweb_place_remove( array $custom, string $id, array $routes ): array {
	foreach ( $routes as $r ) {
		if ( is_array( $r ) && (string) ( $r['place'] ?? '' ) === $id ) {
			return array( $custom, 'A route still sends items to "' . $id . '". Change or remove that route first.' );
		}
	}
	$kept = array_values( array_filter( $custom, static fn( $p ) => is_array( $p ) && (string) ( $p['id'] ?? '' ) !== $id ) );
	return array( $kept, count( $kept ) === count( $custom ) ? 'There is no place "' . $id . '" made here.' : '' );
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

/** The item fields a route can test, and the tests a settings row offers. */
const SOURCEWEB_ROUTE_FIELDS = array( 'type', 'title', 'summary', 'source_url', 'source_name', 'feed', 'kind' );
const SOURCEWEB_ROUTE_OPS    = array( 'always', 'eq', 'contains', 'in', 'has' );

/**
 * A settings row (one test, one place) as an expression. null when the row cannot be one.
 *
 * @param array $row place, op (one of SOURCEWEB_ROUTE_OPS), field, value (text; for `in`, values separated by commas).
 * @return array|null The `when` expression ( array() = always ).
 */
function sourceweb_route_row_to_expr( array $row ): ?array {
	$op    = (string) ( $row['op'] ?? 'always' );
	$field = (string) ( $row['field'] ?? '' );
	$val   = trim( (string) ( $row['value'] ?? '' ) );
	if ( 'always' === $op ) {
		return array();
	}
	if ( ! in_array( $op, SOURCEWEB_ROUTE_OPS, true ) || ! in_array( $field, SOURCEWEB_ROUTE_FIELDS, true ) ) {
		return null;
	}
	if ( 'has' === $op ) {
		return array( 'has', $field );
	}
	if ( '' === $val ) {
		return null;
	}
	if ( 'in' === $op ) {
		$list = array_values( array_filter( array_map( 'trim', explode( ',', $val ) ), 'strlen' ) );
		return $list ? array( 'in', $field, $list ) : null;
	}
	return array( $op, $field, $val );
}

/**
 * The row a stored expression shows as, or null when it is more than one simple test (kept as it is, shown read-only).
 *
 * @param mixed $expr Stored `when`.
 * @return array|null op, field, value.
 */
function sourceweb_route_expr_to_row( $expr ): ?array {
	if ( array() === $expr || null === $expr ) {
		return array( 'op' => 'always', 'field' => '', 'value' => '' );
	}
	if ( ! is_array( $expr ) || ! isset( $expr[0] ) ) {
		return null;
	}
	$op = $expr[0];
	if ( 'has' === $op && 2 === count( $expr ) && in_array( $expr[1], SOURCEWEB_ROUTE_FIELDS, true ) ) {
		return array( 'op' => 'has', 'field' => $expr[1], 'value' => '' );
	}
	if ( in_array( $op, array( 'eq', 'contains' ), true ) && 3 === count( $expr ) && in_array( $expr[1], SOURCEWEB_ROUTE_FIELDS, true ) && is_scalar( $expr[2] ) ) {
		return array( 'op' => $op, 'field' => $expr[1], 'value' => (string) $expr[2] );
	}
	if ( 'in' === $op && 3 === count( $expr ) && in_array( $expr[1], SOURCEWEB_ROUTE_FIELDS, true ) && is_array( $expr[2] ) ) {
		return array( 'op' => 'in', 'field' => $expr[1], 'value' => implode( ', ', array_map( 'strval', $expr[2] ) ) );
	}
	return null;
}

/**
 * Settings rows to the routes to store. A row may carry `keep` (its stored expression, for a test the screen cannot
 * edit). Rows naming a place that does not exist, or with an unreadable test, are returned in the second list.
 *
 * @param array $rows   List of rows (place, op, field, value, keep).
 * @param array $places id => place.
 * @return array{0:array,1:string[]} Routes, and a note for each row left out.
 */
function sourceweb_routes_from_rows( array $rows, array $places ): array {
	$routes = array();
	$notes  = array();
	foreach ( array_values( $rows ) as $i => $row ) {
		$n     = $i + 1;
		$place = is_array( $row ) ? (string) ( $row['place'] ?? '' ) : '';
		if ( ! isset( $places[ $place ] ) ) {
			$notes[] = "Row $n: no place called '$place'.";
			continue;
		}
		$expr = isset( $row['keep'] ) && is_array( $row['keep'] ) ? $row['keep'] : sourceweb_route_row_to_expr( $row );
		if ( null === $expr ) {
			$notes[] = "Row $n: the test is incomplete.";
			continue;
		}
		$routes[] = array( 'when' => $expr, 'place' => $place );
	}
	return array( $routes, $notes );
}

/**
 * A short form of a summary for a small place (a gallery caption, a card): the whole sentences that fit in $words
 * words, or the first $words words with an ellipsis when the first sentence is longer.
 *
 * @param string $text  Summary.
 * @param int    $words Most words.
 */
function sourceweb_summary_short( string $text, int $words = 30 ): string {
	$text = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags_safe( $text ) ) );
	if ( '' === $text || $words < 1 ) {
		return '';
	}
	if ( count( explode( ' ', $text ) ) <= $words ) {
		return $text;
	}
	$out = '';
	foreach ( preg_split( '/(?<=[.!?])\s+/', $text ) as $sentence ) {
		$try = '' === $out ? $sentence : $out . ' ' . $sentence;
		if ( count( explode( ' ', $try ) ) > $words ) {
			break;
		}
		$out = $try;
	}
	if ( '' !== $out ) {
		return $out;
	}
	return rtrim( implode( ' ', array_slice( explode( ' ', $text ), 0, $words ) ), ",;:-" ) . '…';
}

/** strip_tags without WordPress. */
function wp_strip_all_tags_safe( string $s ): string {
	return function_exists( 'wp_strip_all_tags' ) ? wp_strip_all_tags( $s ) : wp_strip_all_tags( $s );
}

/** What a place can report back about an item it was given (the closed loop). */
const SOURCEWEB_OUTCOME_EVENTS = array( 'delivered', 'accepted', 'rejected' );

/**
 * Counts one event against a source.
 *
 * @param array  $stats  source => [ delivered, accepted, rejected ].
 * @param string $source Source name (feed or publisher).
 * @param string $event  One of SOURCEWEB_OUTCOME_EVENTS.
 * @return array The new stats; unchanged for an empty source or an unknown event.
 */
function sourceweb_outcome_apply( array $stats, string $source, string $event ): array {
	$source = trim( $source );
	if ( '' === $source || ! in_array( $event, SOURCEWEB_OUTCOME_EVENTS, true ) ) {
		return $stats;
	}
	$row            = array_merge( array_fill_keys( SOURCEWEB_OUTCOME_EVENTS, 0 ), (array) ( $stats[ $source ] ?? array() ) );
	$row[ $event ]  = (int) $row[ $event ] + 1;
	$stats[ $source ] = $row;
	return $stats;
}

/**
 * Of the items a place has decided on, the share it accepted (0 to 1); null when it has decided on none.
 *
 * @param array $row delivered, accepted, rejected.
 */
function sourceweb_outcome_rate( array $row ): ?float {
	$a = (int) ( $row['accepted'] ?? 0 );
	$r = (int) ( $row['rejected'] ?? 0 );
	return $a + $r > 0 ? $a / ( $a + $r ) : null;
}

/**
 * Sources whose items a place mostly turns down: those with at least $min decisions and an accepted share below $below.
 * A flag only; nothing is blocked automatically.
 *
 * @param array $stats source => [ delivered, accepted, rejected ].
 * @param int   $min   Fewest decisions before a source can be flagged.
 * @param float $below Accepted share under which it is flagged (0 to 1).
 * @return string[] Source names.
 */
function sourceweb_outcome_flags( array $stats, int $min = 10, float $below = 0.3 ): array {
	$out = array();
	foreach ( $stats as $source => $row ) {
		$decided = (int) ( $row['accepted'] ?? 0 ) + (int) ( $row['rejected'] ?? 0 );
		$rate    = sourceweb_outcome_rate( (array) $row );
		if ( $decided >= $min && null !== $rate && $rate < $below ) {
			$out[] = (string) $source;
		}
	}
	return $out;
}
