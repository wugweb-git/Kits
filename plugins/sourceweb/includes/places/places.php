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
	return sourceweb_places_clean( is_array( $more ) ? $more : array_values( $places ) );
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
	if ( $p && 'content_type' !== $p['kind'] ) {
		do_action( 'sourceweb_place_deliver', $p, $item, $post_id );
	}
}

// Places: a tab of its own, after Rules (the menu order is in menu-model.php).
add_filter(
	'kits_sourcing_tabs',
	fn( $tabs ) => $tabs + array( 'places' => array( 'Places' ) ),
	99
);

/**
 * Every way an item can enter SourceWeb: the built-in types, then whatever plugins add through `sourceweb_source_types`.
 *
 * @return array<string, array>
 */
function sourceweb_source_types(): array {
	$more = apply_filters( 'sourceweb_source_types', SOURCEWEB_SOURCE_TYPES );
	return sourceweb_source_types_clean( is_array( $more ) ? $more : SOURCEWEB_SOURCE_TYPES );
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
		'fields' => SOURCEWEB_ROUTE_FIELDS,
		'ops'    => SOURCEWEB_ROUTE_OPS,
	);
}

add_action(
	'rest_api_init',
	function () {
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
