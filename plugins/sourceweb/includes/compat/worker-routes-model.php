<?php
/**
 * The address of a worker route under SourceWeb's own namespace (pure; the hook is worker-routes.php).
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The route to register for an aw/v1 route.
 *
 * @param string $route e.g. '/aw/v1/ingest' or '/aw/v1/review/(?P<id>\d+)'.
 * @return string '' when it is not an aw/v1 route.
 */
function sourceweb_worker_route_alias( string $route ): string {
	return 0 === strpos( $route, '/aw/v1/' ) ? '/worker-api/' . substr( $route, strlen( '/aw/v1/' ) ) : '';
}
