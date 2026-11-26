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
