<?php
/**
 * Places, the WordPress side (places-model.php): the registry other plugins add to, the routes chosen in settings, and
 * the one function the intake asks, "where does this go?".
 *
 * Nothing changes until a route is set or a place is registered: with none, an item goes where it always went, to the
 * content type of its own type.
 *
 * Register a place from any plugin:
 *   add_filter( 'sourceweb_places', function ( $places ) {
 *       $places[] = array( 'id' => 'gallery', 'label' => 'Picture gallery', 'kind' => 'plugin', 'owner' => 'myplugin',
 *                          'enhance' => array( 'image', 'attribution' ) );
 *       return $places;
 *   } );
 * and take its items with  add_action( 'sourceweb_place_deliver', function ( $place, $item, $post_id ) {}, 10, 3 )
 * (fired for places that are not content types).
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The routes chosen in settings: a list of [ 'when' => expression, 'place' => id ]. Empty by default. */
const SOURCEWEB_ROUTES_OPTION = 'sourceweb_routes';

/**
 * Every place: the content types SourceWeb fills today, then whatever plugins register through `sourceweb_places`.
 *
 * @return array<string, array>
 */
function sourceweb_places(): array {
	$places = sourceweb_places_default( function_exists( 'sourceweb_post_types' ) ? sourceweb_post_types() : array() );
	$more   = apply_filters( 'sourceweb_places', array_values( $places ) );
	$out    = sourceweb_places_clean( is_array( $more ) ? $more : array_values( $places ) );
	// What to do to an item for a place can be chosen in settings (the Places tab): that choice wins over the code's.
	foreach ( (array) get_option( SOURCEWEB_PLACE_ENHANCE_OPTION, array() ) as $id => $list ) {
		if ( isset( $out[ $id ] ) && is_array( $list ) ) {
			$out[ $id ]['enhance'] = sourceweb_place_clean( array( 'id' => $id, 'kind' => 'other', 'enhance' => $list ) )['enhance'] ?? array();
		}
	}
	return $out;
}

/** Per place, the enhancements chosen in settings: place id => list of enhancer ids. */
const SOURCEWEB_PLACE_ENHANCE_OPTION = 'sourceweb_place_enhance';

/** What each place has reported about the items it was given: source => [ delivered, accepted, rejected ]. */
const SOURCEWEB_OUTCOMES_OPTION = 'sourceweb_outcomes';

/**
 * The enhancements a place can be given: id => [ label, callback( $post_id, $item, $place ) ]. Add one from any plugin
 * with the `sourceweb_enhancers` filter.
 *
 * @return array<string, array>
 */
function sourceweb_enhancers(): array {
	$all = array(
		'summary-short' => array(
			'Short summary',
			static function ( int $post_id, array $item ): void {
				update_post_meta( $post_id, 'sourceweb_short_summary', sourceweb_summary_short( (string) ( $item['summary'] ?? '' ) ) );
			},
		),
		'source-credit' => array(
			'Source credit line',
			static function ( int $post_id, array $item ): void {
				$name = trim( (string) ( $item['source_name'] ?? '' ) );
				$url  = trim( (string) ( $item['source_url'] ?? '' ) );
				update_post_meta( $post_id, 'sourceweb_credit', trim( $name . ( '' !== $url ? ' — ' . $url : '' ) ) );
			},
		),
	);
	$more = apply_filters( 'sourceweb_enhancers', $all );
	$out  = array();
	foreach ( is_array( $more ) ? $more : $all as $id => $e ) {
		if ( is_string( $id ) && is_array( $e ) && isset( $e[1] ) && is_callable( $e[1] ) ) {
			$out[ sanitize_key( $id ) ] = array( (string) $e[0], $e[1] );
		}
	}
	return $out;
}

/**
 * Where an item of this type goes. '' means no place applies and the caller keeps its own behaviour.
 *
 * @param string $type Content type of the item as the workers sent it.
 * @param array  $item More item fields for the routes' tests (title, source_name, feed, summary …).
 * @return array|null The place.
 */
function sourceweb_place_for( string $type, array $item = array() ): ?array {
	$places = sourceweb_places();
	$routes = (array) get_option( SOURCEWEB_ROUTES_OPTION, array() );
	$id     = sourceweb_route( array( 'type' => $type ) + $item, $routes, $places );
	return '' !== $id ? $places[ $id ] : null;
}

/**
 * The post type an item is created as. For a content type place, that type; for any other place or none, the item's own
 * type (the item is created as it always was, then handed to the place by sourceweb_place_deliver()).
 *
 * @param string $type Content type as sent.
 * @param array  $item Item fields.
 */
function sourceweb_place_post_type( string $type, array $item = array() ): string {
	$p = sourceweb_place_for( $type, $item );
	return $p && 'content_type' === $p['kind'] ? $p['post_type'] : $type;
}

/**
 * Hands a created item to its place when the place is not a content type (a plugin, a workflow, a generator …).
 *
 * @param string $type    Content type as sent.
 * @param int    $post_id The created item.
 * @param array  $item    Item fields.
 */
function sourceweb_place_deliver( string $type, int $post_id, array $item = array() ): void {
	$p = sourceweb_place_for( $type, $item );
	if ( ! $p ) {
		return;
	}
	$enh = sourceweb_enhancers();
	foreach ( sourceweb_place_enhancements( $p, array_keys( $enh ) ) as $id ) {
		call_user_func( $enh[ $id ][1], $post_id, $item, $p );
	}
	if ( 'content_type' !== $p['kind'] ) {
		do_action( 'sourceweb_place_deliver', $p, $item, $post_id );
	}
	sourceweb_place_outcome( (string) ( $item['source_name'] ?? $item['feed'] ?? '' ), 'delivered' );
}

/**
 * Records what happened to an item a place was given, against the source it came from (the closed loop): delivered by
 * SourceWeb itself; accepted or rejected reported by the place (a plugin calls this, or fires the action
 * `sourceweb_place_outcome`; workflows use POST sourceweb/v1/places/outcome).
 *
 * @param string $source Source name (publisher or feed).
 * @param string $event  delivered, accepted or rejected.
 */
function sourceweb_place_outcome( string $source, string $event ): void {
	$stats = sourceweb_outcome_apply( (array) get_option( SOURCEWEB_OUTCOMES_OPTION, array() ), $source, $event );
	update_option( SOURCEWEB_OUTCOMES_OPTION, $stats, false );
}
add_action( 'sourceweb_place_outcome', 'sourceweb_place_outcome', 10, 2 );

// Places: a tab of its own, after Rules (the menu order is in menu-model.php).
add_filter(
	'kits_sourcing_tabs',
	fn( $tabs ) => $tabs + array( 'places' => array( 'Places' ) ),
	99
);

/**
 * Every outside service SourceWeb can send data to: the built-in list, then whatever plugins add through
 * `sourceweb_external_services` (a plugin that calls out for SourceWeb adds itself here, and says so in its readme).
 *
 * @return array<string, array>
 */
function sourceweb_external_services(): array {
	$more = apply_filters( 'sourceweb_external_services', SOURCEWEB_EXTERNAL_SERVICES );
	return sourceweb_external_services_clean( is_array( $more ) ? $more : SOURCEWEB_EXTERNAL_SERVICES );
}

/**
 * Every way an item can enter SourceWeb: the built-in types, then whatever plugins add through `sourceweb_source_types`.
 *
 * @return array<string, array>
 */
function sourceweb_source_types(): array {
	$more = apply_filters( 'sourceweb_source_types', SOURCEWEB_SOURCE_TYPES );
	return sourceweb_source_types_clean( is_array( $more ) ? $more : SOURCEWEB_SOURCE_TYPES );
}

/** The feedback table: one row per source, worst acceptance first. */
function sourceweb_outcome_rows(): array {
	$rows = array();
	foreach ( (array) get_option( SOURCEWEB_OUTCOMES_OPTION, array() ) as $source => $row ) {
		$rate   = sourceweb_outcome_rate( (array) $row );
		$rows[] = array(
			'source'    => (string) $source,
			'delivered' => (int) ( $row['delivered'] ?? 0 ),
			'accepted'  => (int) ( $row['accepted'] ?? 0 ),
			'rejected'  => (int) ( $row['rejected'] ?? 0 ),
			'rate'      => null === $rate ? null : round( $rate * 100 ),
		);
	}
	usort( $rows, static fn( $a, $b ) => ( $a['rate'] ?? 101 ) <=> ( $b['rate'] ?? 101 ) );
	return array_slice( $rows, 0, 100 );
}

/**
 * The Places screen's data: every place, and the routes as settings rows.
 *
 * @return array
 */
function sourceweb_places_screen(): array {
	$places = sourceweb_places();
	$rows   = array();
	foreach ( (array) get_option( SOURCEWEB_ROUTES_OPTION, array() ) as $r ) {
		if ( ! is_array( $r ) ) {
			continue;
		}
		$row    = sourceweb_route_expr_to_row( $r['when'] ?? array() );
		$rows[] = ( $row ?? array( 'op' => 'always', 'field' => '', 'value' => '' ) ) + array(
			'place'  => (string) ( $r['place'] ?? '' ),
			'keep'   => null === $row ? ( $r['when'] ?? array() ) : null,
			'custom' => null === $row ? wp_json_encode( $r['when'] ?? array() ) : '',
		);
	}
	return array(
		'places' => array_values( $places ),
		'routes' => $rows,
		'sources' => array_values( sourceweb_source_types() ),
		'enhancers' => array_map( static fn( $id, $e ) => array( 'id' => $id, 'label' => $e[0] ), array_keys( sourceweb_enhancers() ), sourceweb_enhancers() ),
		'outcomes'  => sourceweb_outcome_rows(),
		'fields' => SOURCEWEB_ROUTE_FIELDS,
		'ops'    => SOURCEWEB_ROUTE_OPS,
	);
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			SOURCEWEB_REST,
			'/places/enhance',
			array(
				'methods'             => 'POST',
				'permission_callback' => sourceweb_rest_can( SOURCEWEB_SRC_CAP ),
				'callback'            => function ( WP_REST_Request $req ) {
					$known = array_keys( sourceweb_enhancers() );
					$places = sourceweb_places();
					$save   = array();
					foreach ( (array) $req->get_param( 'enhance' ) as $id => $list ) {
						if ( isset( $places[ $id ] ) && is_array( $list ) ) {
							$save[ $id ] = array_values( array_intersect( array_map( 'sanitize_key', $list ), $known ) );
						}
					}
					update_option( SOURCEWEB_PLACE_ENHANCE_OPTION, $save, false );
					return rest_ensure_response( sourceweb_places_screen() );
				},
			)
		);
		register_rest_route(
			SOURCEWEB_REST,
			'/places/outcome',
			array(
				'methods'             => 'POST',
				'permission_callback' => fn() => current_user_can( 'manage_options' ) || current_user_can( 'aw_worker' ),
				'callback'            => function ( WP_REST_Request $req ) {
					sourceweb_place_outcome( sanitize_text_field( (string) $req->get_param( 'source' ) ), sanitize_key( (string) $req->get_param( 'event' ) ) );
					return rest_ensure_response( array( 'ok' => true ) );
				},
			)
		);
		register_rest_route(
			SOURCEWEB_REST,
			'/places',
			array(
				array(
					'methods'             => 'GET',
					'permission_callback' => sourceweb_rest_can( SOURCEWEB_SRC_CAP ),
					'callback'            => fn() => rest_ensure_response( sourceweb_places_screen() ),
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => sourceweb_rest_can( SOURCEWEB_SRC_CAP ),
					'callback'            => function ( WP_REST_Request $req ) {
						list( $routes, $notes ) = sourceweb_routes_from_rows( (array) $req->get_param( 'routes' ), sourceweb_places() );
						if ( $notes ) {
							return new WP_Error( 'sourceweb_routes', implode( ' ', $notes ), array( 'status' => 400 ) );
						}
						update_option( SOURCEWEB_ROUTES_OPTION, $routes, false );
						return rest_ensure_response( sourceweb_places_screen() );
					},
				),
			)
		);
	}
);
