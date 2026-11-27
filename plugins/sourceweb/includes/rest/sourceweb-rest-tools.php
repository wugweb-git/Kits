<?php
/**
 * Manual tools (they were workflows run by hand; a person starts them here). Administrators only.
 *
 *   GET tools/recheck   the newest published items of the sourced news type that the current rules would now refuse
 *                       (an archive or tag page, a job vacancy). Reads only; a person decides what to do with each.
 *
 * Add by link, the other former workflow (Submit URLs), is on To review.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			SOURCEWEB_REST,
			'/tools/recheck',
			array(
				'methods'             => 'GET',
				'permission_callback' => sourceweb_rest_can( SOURCEWEB_SRC_CAP ),
				'callback'            => fn() => rest_ensure_response( sourceweb_recheck_published() ),
			)
		);
	}
);

/**
 * The published items the rules would refuse today.
 *
 * @param int $limit Newest items to look at.
 * @return array{checked:int,flagged:array}
 */
function sourceweb_recheck_published( int $limit = 300 ): array {
	$type = function_exists( 'sourceweb_news_type' ) ? sourceweb_news_type() : '';
	if ( '' === $type ) {
		return array( 'checked' => 0, 'flagged' => array() );
	}
	$posts   = get_posts(
		array(
			'post_type'        => $type,
			'post_status'      => 'publish',
			'posts_per_page'   => $limit,
			'orderby'          => 'date',
			'order'            => 'DESC',
		)
	);
	$flagged = array();
	foreach ( $posts as $p ) {
		$reason = sourceweb_not_news_reason( $p->post_title, (string) get_post_meta( $p->ID, 'aw_source_url', true ), $type );
		if ( '' !== $reason ) {
			$flagged[] = array(
				'id'     => $p->ID,
				'title'  => $p->post_title,
				'reason' => $reason,
				'edit'   => get_edit_post_link( $p->ID, 'raw' ),
			);
		}
	}
	return array( 'checked' => count( $posts ), 'flagged' => $flagged );
}
