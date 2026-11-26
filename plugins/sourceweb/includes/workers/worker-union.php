<?php
/**
 * The worker union, the WordPress side: every worker in one list. A plugin registers its own:
 *
 *   add_filter( 'sourceweb_workers', function ( $workers ) {
 *       $workers[] = array( 'id' => 'gallery-tagger', 'label' => 'Gallery tagger', 'step' => 'enhance', 'runner' => 'plugin',
 *                           'trigger' => 'scheduled', 'what' => 'Tags new gallery pictures', 'owner' => 'gallery' );
 *       return $workers;
 *   } );
 *
 * GET sourceweb/v1/workers/union lists them.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** @return array<string, array> id => definition. */
function sourceweb_workers_union(): array {
	$added = apply_filters( 'sourceweb_workers', array() );
	return sourceweb_worker_union( AW_WORKERS, is_array( $added ) ? $added : array() );
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			SOURCEWEB_REST,
			'/workers/union',
			array(
				'methods'             => 'GET',
				'permission_callback' => sourceweb_rest_can( SOURCEWEB_SRC_CAP ),
				'callback'            => fn() => rest_ensure_response( array_values( sourceweb_workers_union() ) ),
			)
		);
	}
);
