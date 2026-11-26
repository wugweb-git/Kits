<?php
/**
 * The workers' routes under SourceWeb's own namespace. The workers repository calls aw/v1/<route>; every one of those
 * routes is also served at sourceweb/v1/worker-api/<route>, same callback, same permission, same arguments, so the
 * workers can move to the new address one day without a flag day. aw/v1 stays as it is.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'rest_api_init',
	function ( $server ) {
		if ( ! is_object( $server ) || ! method_exists( $server, 'get_routes' ) ) {
			return;
		}
		foreach ( $server->get_routes( 'aw/v1' ) as $route => $handlers ) {
			$alias = sourceweb_worker_route_alias( (string) $route );
			if ( '' === $alias || ! is_array( $handlers ) ) {
				continue;
			}
			$mirror = array();
			foreach ( $handlers as $h ) {
				if ( ! is_array( $h ) || empty( $h['callback'] ) || empty( $h['methods'] ) ) {
					continue;
				}
				$mirror[] = array(
					'methods'             => implode( ',', array_keys( (array) $h['methods'] ) ),
					'callback'            => $h['callback'],
					'permission_callback' => $h['permission_callback'] ?? '__return_false',
					'args'                => (array) ( $h['args'] ?? array() ),
				);
			}
			if ( $mirror ) {
				register_rest_route( SOURCEWEB_REST, $alias, $mirror );
			}
		}
	},
	99
);
