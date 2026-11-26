<?php
/**
 * Internal links, phase 4: silos (docs/org/rankweb-org-plan.md (Appendix A)).
 *
 * A silo has a name, one hub item, its supporting items in order, and a mode (virtual or circle, RankWeb_Silo). Stored in two
 * tables of RankWeb's own, not a taxonomy: {prefix}aw_silos (name, hub, mode) and {prefix}aw_silo_items (item ID as the
 * primary key, so an item is in one silo only, plus its position, which is the circle's order). A taxonomy would show in
 * the editor, the REST API and the sitemaps, allow one item in several silos, and keep no order.
 *
 * - On the page: the end of the content of a silo's hub or supporting item gets a list of its silo links (the_content,
 *   after the auto-linker; the hub, virtual mode: its supporting items; supporting items: the hub and their siblings).
 * - The auto-linker never links an item in one silo to another silo's supporting item (only to its hub), and tries the
 *   targets of the item's own silo first.
 * - The audit counts the silo links as links (they are not saved in the content) and flags a link from one silo into
 *   another silo's supporting item.
 * - Checks on the Silos screen: fewer items than the minimum (hub included) and addresses deeper than the limit.
 *
 * Screen: RankWeb → Internal links → Silos (manage_options to change; manage_rankweb to see). REST: GET, POST and DELETE rankweb/v1/links/silos (rankweb_silo_register_routes()).
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-aw-silo.php';
require_once __DIR__ . '/admin-table.php';

const AW_SILO_DB     = 'aw_silo_db';
const AW_SILO_DB_VER = '1';

/**
 * A table name with the site prefix.
 *
 * @param string $name 'silos' or 'items'.
 */
function rankweb_silo_table( string $name ): string {
	global $wpdb;
	return $wpdb->prefix . ( 'items' === $name ? 'aw_silo_items' : 'aw_silos' );
}

/** Create the two tables (their own version option). */
function rankweb_silo_install(): void {
	if ( get_option( AW_SILO_DB ) === AW_SILO_DB_VER ) {
		return;
	}
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$c = $wpdb->get_charset_collate();
	$s = rankweb_silo_table( 'silos' );
	$i = rankweb_silo_table( 'items' );
	dbDelta(
		"CREATE TABLE {$s} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		name varchar(120) NOT NULL DEFAULT '',
		hub_id bigint(20) unsigned NOT NULL DEFAULT 0,
		mode varchar(8) NOT NULL DEFAULT 'virtual',
		PRIMARY KEY  (id),
		UNIQUE KEY hub_id (hub_id)
		) {$c};"
	);
	dbDelta(
		"CREATE TABLE {$i} (
		post_id bigint(20) unsigned NOT NULL DEFAULT 0,
		silo_id bigint(20) unsigned NOT NULL DEFAULT 0,
		position int(10) unsigned NOT NULL DEFAULT 0,
		PRIMARY KEY  (post_id),
		KEY silo_id (silo_id)
		) {$c};"
	);
	update_option( AW_SILO_DB, AW_SILO_DB_VER, true );
}
add_action( 'admin_init', 'rankweb_silo_install' );

/* ---------- Reading ---------- */

/**
 * Every silo: array( silo ID => array( name, hub, mode, items (IDs in order) ) ) and the map item ID => array( silo,
 * hub ). One read of two small tables, kept in the transient aw_seo_silo_map until a silo changes.
 */
function rankweb_silo_data(): array {
	static $memo = null;
	if ( null !== $memo ) {
		return $memo;
	}
	$hit = get_transient( 'aw_seo_silo_map' );
	if ( ! is_array( $hit ) ) {
		$hit = array(
			'silos' => array(),
			'map'   => array(),
		);
		if ( get_option( AW_SILO_DB ) === AW_SILO_DB_VER ) {
			global $wpdb;
			foreach ( (array) $wpdb->get_results( $wpdb->prepare( 'SELECT id, name, hub_id, mode FROM %i ORDER BY name, id', rankweb_silo_table( 'silos' ) ), ARRAY_A ) as $r ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table, kept in a transient.
				$sid                              = (int) $r['id'];
				$hit['silos'][ $sid ]             = array(
					'name'  => (string) $r['name'],
					'hub'   => (int) $r['hub_id'],
					'mode'  => in_array( $r['mode'], RankWeb_Silo::MODES, true ) ? (string) $r['mode'] : 'virtual',
					'items' => array(),
				);
				$hit['map'][ (int) $r['hub_id'] ] = array(
					'silo' => $sid,
					'hub'  => true,
				);
			}
			foreach ( (array) $wpdb->get_results( $wpdb->prepare( 'SELECT post_id, silo_id FROM %i ORDER BY silo_id, position, post_id', rankweb_silo_table( 'items' ) ), ARRAY_A ) as $r ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table, kept in a transient.
				$sid = (int) $r['silo_id'];
				if ( isset( $hit['silos'][ $sid ] ) ) {
					$hit['silos'][ $sid ]['items'][]   = (int) $r['post_id'];
					$hit['map'][ (int) $r['post_id'] ] = array(
						'silo' => $sid,
						'hub'  => false,
					);
				}
			}
		}
		set_transient( 'aw_seo_silo_map', $hit, DAY_IN_SECONDS );
	}
	$memo = $hit;
	return $hit;
}

/** Forget what was read (a silo changed): the transient, and the pages built with the old rules. */
function rankweb_silo_changed(): void {
	delete_transient( 'aw_seo_silo_map' );
	if ( function_exists( 'rankweb_link_bump' ) ) {
		rankweb_link_bump( true );
	}
}

/**
 * The links a silo member shows: array( id, url, title ) for each published target, in order.
 *
 * @param int $id Item ID.
 */
function rankweb_silo_targets( int $id ): array {
	$d = rankweb_silo_data();
	if ( ! isset( $d['map'][ $id ] ) ) {
		return array();
	}
	$s   = $d['silos'][ $d['map'][ $id ]['silo'] ];
	$out = array();
	foreach ( RankWeb_Silo::links( $s['mode'], $s['hub'], $s['items'], $id, max( 1, (int) AW_SILO_MAX ) ) as $tid ) {
		$t = get_post( $tid );
		if ( $t instanceof WP_Post && 'publish' === $t->post_status && '' === $t->post_password ) {
			$out[] = array(
				'id'    => $tid,
				'url'   => (string) get_permalink( $t ),
				'title' => get_the_title( $t ),
			);
		}
	}
	return $out;
}

/* ---------- On the page ---------- */

/**
 * The_content: the silo's links after the content, on a singular view of a silo's hub or supporting item.
 *
 * @param string $html Content HTML.
 */
function rankweb_silo_filter_content( $html ) {
	if ( ! is_string( $html ) || is_admin() || is_feed() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || doing_filter( 'get_the_excerpt' ) || ! is_main_query() || ! is_singular() ) {
		return $html;
	}
	$id = (int) get_the_ID();
	if ( $id < 1 || get_queried_object_id() !== $id || post_password_required( $id ) || ! isset( rankweb_silo_data()['map'][ $id ] ) ) {
		return $html;
	}
	// The_content can run more than once for the main item (a Query Loop, a summary, an SEO analysis): one list per page.
	static $printed = array();
	if ( ! in_the_loop() || isset( $printed[ $id ] ) ) {
		return $html;
	}
	$printed[ $id ] = true;
	$d       = rankweb_silo_data();
	$silo    = $d['silos'][ $d['map'][ $id ]['silo'] ];
	$targets = rankweb_silo_targets( $id );
	if ( ! $targets ) {
		return $html;
	}
	$list = '';
	foreach ( $targets as $t ) {
		$list .= '<li><a class="aw-silo-link" href="' . esc_url( $t['url'] ) . '">' . esc_html( $t['title'] ) . '</a></li>';
	}
	/* translators: %s: the silo's name. */
	$heading = sprintf( __( 'More in %s', 'rankweb' ), $silo['name'] );
	return $html . '<nav class="aw-silo-links" aria-label="' . esc_attr( $heading ) . '"><p class="aw-silo-heading">' . esc_html( $heading ) . '</p><ul>' . $list . '</ul></nav>';
}
add_filter( 'the_content', 'rankweb_silo_filter_content', 26 ); // after the auto-linker (25)

/**
 * The auto-linker's rule: an item in a silo links to another silo's hub only.
 *
 * @param int $source Item that links.
 * @return callable fn( int $target ): bool
 */
function rankweb_silo_target_rule( int $source ): callable {
	$map = rankweb_silo_data()['map'];
	return fn( int $target ): bool => RankWeb_Silo::may_link( $map, $source, $target );
}

/**
 * The auto-linker's preference: targets in the item's own silo first.
 *
 * @param int $source Item that links.
 * @return callable fn( int $target ): bool
 */
function rankweb_silo_prefer_rule( int $source ): callable {
	$map  = rankweb_silo_data()['map'];
	$mine = $map[ $source ]['silo'] ?? 0;
	return fn( int $target ): bool => $mine > 0 && ( $map[ $target ]['silo'] ?? -1 ) === $mine;
}

/* ---------- Saving ---------- */

/**
 * Save a silo (new when $id is 0). Returns the silo's ID, or an error that names the problem.
 *
 * @param int    $id    Silo ID, or 0.
 * @param string $name  Name.
 * @param int    $hub   Hub item ID.
 * @param string $mode  'virtual' or 'circle'.
 * @param array  $items Supporting item IDs, in order.
 * @return int|WP_Error
 */
function rankweb_silo_save( int $id, string $name, int $hub, string $mode, array $items ) {
	global $wpdb;
	rankweb_silo_install();
	$name  = trim( mb_substr( $name, 0, 120 ) );
	$items = array_values( array_diff( array_unique( array_filter( array_map( 'absint', $items ) ) ), array( $hub ) ) );
	if ( '' === $name ) {
		return new WP_Error( 'aw_silo', __( 'The silo needs a name.', 'rankweb' ) );
	}
	if ( ! in_array( $mode, RankWeb_Silo::MODES, true ) ) {
		$mode = 'virtual';
	}
	foreach ( array_merge( array( $hub ), $items ) as $pid ) {
		$p = $pid > 0 ? get_post( $pid ) : null;
		if ( ! $p instanceof WP_Post || 'publish' !== $p->post_status || ! is_post_type_viewable( $p->post_type ) ) {
			/* translators: %d: an item ID. */
			return new WP_Error( 'aw_silo', sprintf( __( 'Item %d is not a published item with its own page.', 'rankweb' ), $pid ) );
		}
	}
	// One silo per item: a hub or an item already in another silo is refused, with its name.
	$d = rankweb_silo_data();
	foreach ( array_merge( array( $hub ), $items ) as $pid ) {
		$at = $d['map'][ $pid ]['silo'] ?? 0;
		if ( $at && $at !== $id ) {
			/* translators: 1: item ID, 2: the other silo's name. */
			return new WP_Error( 'aw_silo', sprintf( __( 'Item %1$d is already in the silo "%2$s". An item is in one silo only.', 'rankweb' ), $pid, $d['silos'][ $at ]['name'] ) );
		}
	}
	$silos = rankweb_silo_table( 'silos' );
	if ( $id > 0 ) {
		$wpdb->update(
			$silos,
			array(
				'name'   => $name,
				'hub_id' => $hub,
				'mode'   => $mode,
			),
			array( 'id' => $id ),
			array( '%s', '%d', '%s' ),
			array( '%d' )
		); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
	} else {
		$wpdb->insert(
			$silos,
			array(
				'name'   => $name,
				'hub_id' => $hub,
				'mode'   => $mode,
			),
			array( '%s', '%d', '%s' )
		); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
		$id = (int) $wpdb->insert_id;
	}
	if ( $id < 1 ) {
		return new WP_Error( 'aw_silo', __( 'The silo could not be saved.', 'rankweb' ) );
	}
	$wpdb->delete( rankweb_silo_table( 'items' ), array( 'silo_id' => $id ), array( '%d' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
	foreach ( $items as $pos => $pid ) {
		$wpdb->insert(
			rankweb_silo_table( 'items' ),
			array(
				'post_id'  => $pid,
				'silo_id'  => $id,
				'position' => $pos,
			),
			array( '%d', '%d', '%d' )
		); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
	}
	rankweb_silo_changed();
	return $id;
}

/**
 * Delete a silo (its settings only: no item is changed).
 *
 * @param int $id Silo ID.
 */
function rankweb_silo_delete( int $id ): void {
	global $wpdb;
	$wpdb->delete( rankweb_silo_table( 'items' ), array( 'silo_id' => $id ), array( '%d' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
	$wpdb->delete( rankweb_silo_table( 'silos' ), array( 'id' => $id ), array( '%d' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
	rankweb_silo_changed();
}

// An item gone for good leaves its silo (a hub gone takes its silo's setting with it; the other items stay unlinked by it).
add_action(
	'deleted_post',
	function ( $post_id ) {
		global $wpdb;
		if ( get_option( AW_SILO_DB ) !== AW_SILO_DB_VER ) {
			return;
		}
		$was = (int) $wpdb->delete( rankweb_silo_table( 'items' ), array( 'post_id' => (int) $post_id ), array( '%d' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
		$hub = (int) $wpdb->delete( rankweb_silo_table( 'silos' ), array( 'hub_id' => (int) $post_id ), array( '%d' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table.
		if ( $was || $hub ) {
			rankweb_silo_changed();
		}
	}
);

/* ---------- Checks and the REST route ---------- */

/**
 * The URL checks on one silo.
 *
 * @param array $silo A silo of rankweb_silo_data().
 * @return array few (int), deep (item IDs).
 */
function rankweb_silo_checks( array $silo ): array {
	$urls = array();
	foreach ( array_merge( array( (int) $silo['hub'] ), (array) $silo['items'] ) as $pid ) {
		$urls[ $pid ] = (string) get_permalink( $pid );
	}
	return RankWeb_Silo::check( $urls, home_url(), max( 1, (int) AW_SILO_MIN ), max( 1, (int) AW_SILO_DEPTH ) );
}

/**
 * A silo's item as { id, title } for the screen.
 *
 * @param int $id Item ID.
 */
function rankweb_silo_item_info( int $id ): array {
	$t = (string) get_the_title( $id );
	return array(
		'id'    => $id,
		'title' => '' !== $t ? $t : __( '(no title)', 'rankweb' ),
	);
}

/**
 * Every silo for the screen: its settings, the item titles, the address checks, and the limits the checks use.
 * (The ID lists in `hub` and `items` are what GET links/silos has always returned.)
 */
function rankweb_silo_payload(): array {
	$out = array();
	foreach ( rankweb_silo_data()['silos'] as $sid => $s ) {
		$out[] = array(
			'id'         => $sid,
			'name'       => $s['name'],
			'hub'        => $s['hub'],
			'mode'       => $s['mode'],
			'items'      => $s['items'],
			'hub_info'   => rankweb_silo_item_info( (int) $s['hub'] ),
			'items_info' => array_map( 'rankweb_silo_item_info', array_map( 'intval', array_slice( $s['items'], 0, 200 ) ) ),
			'checks'     => rankweb_silo_checks( $s ),
		);
	}
	return array(
		'silos'    => $out,
		'min'      => max( 1, (int) AW_SILO_MIN ),
		'depth'    => max( 1, (int) AW_SILO_DEPTH ),
		'can_edit' => current_user_can( 'manage_options' ),
	);
}

/**
 * Save a silo from what the form or the REST route sends: the items as one text (IDs split by white space or commas) or
 * as a list. The classic handler and POST links/silos both call this.
 *
 * @param array $in { silo|id, name, hub, mode, items }.
 * @return int|WP_Error The silo's ID, or an error that names the problem.
 */
function rankweb_silo_save_request( array $in ) {
	$items = $in['items'] ?? array();
	if ( is_string( $items ) ) {
		$items = preg_split( '/[\s,]+/', sanitize_textarea_field( $items ) );
	}
	return rankweb_silo_save(
		absint( $in['silo'] ?? $in['id'] ?? 0 ),
		sanitize_text_field( (string) ( $in['name'] ?? '' ) ),
		absint( $in['hub'] ?? 0 ),
		sanitize_key( (string) ( $in['mode'] ?? '' ) ),
		(array) $items
	);
}

/**
 * Delete a silo that exists (its settings only: no item is changed).
 *
 * @param int $id Silo ID.
 * @return true|WP_Error An error when there is no such silo.
 */
function rankweb_silo_remove( int $id ) {
	if ( ! isset( rankweb_silo_data()['silos'][ $id ] ) ) {
		return new WP_Error( 'aw_silo', __( 'There is no such silo.', 'rankweb' ), array( 'status' => 404 ) );
	}
	rankweb_silo_delete( $id );
	return true;
}

add_action( 'rest_api_init', 'rankweb_silo_register_routes' );

/**
 * The silo routes under rankweb/v1:
 *
 *   GET    links/silos       manage_rankweb  every silo with its checks
 *   POST   links/silos       manage_options  save a silo ({ id (0 for a new one), name, hub, mode, items[] }); returns the list
 *   DELETE links/silos/<id>  manage_options  delete a silo's settings (no item is changed); returns the list
 */
function rankweb_silo_register_routes(): void {
	register_rest_route(
		'rankweb/v1',
		'/links/silos',
		array(
			array(
				'methods'             => 'GET',
				'permission_callback' => rankweb_rest_can( RANKWEB_CAP ),
				'callback'            => fn() => rest_ensure_response( rankweb_silo_payload() ),
			),
			array(
				'methods'             => 'POST',
				'permission_callback' => rankweb_rest_can( 'manage_options' ),
				'args'                => array(
					'id'    => array(
						'type'    => 'integer',
						'minimum' => 0,
						'default' => 0,
					),
					'name'  => array(
						'type'     => 'string',
						'required' => true,
					),
					'hub'   => array(
						'type'     => 'integer',
						'required' => true,
					),
					'mode'  => array(
						'type'    => 'string',
						'enum'    => RankWeb_Silo::MODES,
						'default' => 'virtual',
					),
					'items' => array(
						'type'    => 'array',
						'items'   => array( 'type' => 'integer' ),
						'default' => array(),
					),
				),
				'callback'            => function ( WP_REST_Request $req ) {
					$id = rankweb_silo_save_request( $req->get_params() );
					if ( is_wp_error( $id ) ) {
						return new WP_Error( 'rest_invalid_param', $id->get_error_message(), array( 'status' => 400 ) );
					}
					return rest_ensure_response( array( 'id' => $id, 'message' => __( 'Silo saved.', 'rankweb' ) ) + rankweb_silo_payload() );
				},
			),
		)
	);
	register_rest_route(
		'rankweb/v1',
		'/links/silos/(?P<id>\d+)',
		array(
			array(
				'methods'             => 'DELETE',
				'permission_callback' => rankweb_rest_can( 'manage_options' ),
				'callback'            => function ( WP_REST_Request $req ) {
					$r = rankweb_silo_remove( (int) $req['id'] );
					if ( is_wp_error( $r ) ) {
						return $r;
					}
					return rest_ensure_response( array( 'message' => __( 'Silo deleted. No item was changed.', 'rankweb' ) ) + rankweb_silo_payload() );
				},
			),
		)
	);
}

/* ---------- The screen: RankWeb → Internal links → Silos ---------- */

/** The classic form's save: a thin wrapper over rankweb_silo_save_request() (the shell screen posts to the REST route). */
function rankweb_silo_save_post(): void {
	check_admin_referer( 'rankweb_silo_save' );
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
	}
	$id  = absint( wp_unslash( $_POST['silo'] ?? 0 ) );
	$res = rankweb_silo_save_request(
		array(
			'silo'  => $id,
			'name'  => wp_unslash( $_POST['name'] ?? '' ), // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised in rankweb_silo_save_request().
			'hub'   => wp_unslash( $_POST['hub'] ?? 0 ), // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- absint() in rankweb_silo_save_request().
			'mode'  => wp_unslash( $_POST['mode'] ?? '' ), // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised in rankweb_silo_save_request().
			'items' => wp_unslash( $_POST['items'] ?? '' ), // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised in rankweb_silo_save_request().
		)
	);
	$url = admin_url( 'admin.php?page=aw-links&view=silos' );
	if ( is_wp_error( $res ) ) {
		set_transient( 'aw_silo_error_' . get_current_user_id(), $res->get_error_message(), MINUTE_IN_SECONDS ); // shown once, on the form (not carried in the address)
		wp_safe_redirect( add_query_arg( 'silo', $id ? $id : 'new', $url ) );
		exit;
	}
	wp_safe_redirect( add_query_arg( 'saved', '1', $url ) );
	exit;
}

/** The classic form's delete: a thin wrapper over rankweb_silo_remove(). */
function rankweb_silo_delete_post(): void {
	check_admin_referer( 'rankweb_silo_delete' );
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
	}
	rankweb_silo_remove( absint( wp_unslash( $_POST['silo'] ?? 0 ) ) );
	wp_safe_redirect( add_query_arg( 'deleted', '1', admin_url( 'admin.php?page=aw-links&view=silos' ) ) );
	exit;
}

// The classic forms post action=rankweb_silo_save and rankweb_silo_delete; the handlers were hooked as aw_silo_*, so the
// forms reached nothing. Both names are hooked now.
foreach ( array( 'aw_silo_save', 'rankweb_silo_save' ) as $rankweb_silo_hook ) {
	add_action( 'admin_post_' . $rankweb_silo_hook, 'rankweb_silo_save_post' );
}
foreach ( array( 'aw_silo_delete', 'rankweb_silo_delete' ) as $rankweb_silo_hook ) {
	add_action( 'admin_post_' . $rankweb_silo_hook, 'rankweb_silo_delete_post' );
}
unset( $rankweb_silo_hook );

/** An item as "ID, title". */
function rankweb_silo_item_label( int $id ): string {
	$t = get_the_title( $id );
	return $id . ' · ' . ( '' !== $t ? $t : __( '(no title)', 'rankweb' ) );
}

/** The "Silos" view of RankWeb → Internal links. */
function rankweb_silo_screen(): void {
	$admin = current_user_can( 'manage_options' );
	$base  = admin_url( 'admin.php?page=aw-links&view=silos' );
	$d     = rankweb_silo_data();
	$edit  = isset( $_GET['silo'] ) ? sanitize_text_field( wp_unslash( $_GET['silo'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- shows a form, changes nothing.
	if ( isset( $_GET['saved'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- only a notice.
		wp_admin_notice( esc_html__( 'Silo saved.', 'rankweb' ), array( 'type' => 'success' ) );
	}
	if ( isset( $_GET['deleted'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- only a notice.
		wp_admin_notice( esc_html__( 'Silo deleted. No item was changed.', 'rankweb' ), array( 'type' => 'success' ) );
	}
	$err = get_transient( 'aw_silo_error_' . get_current_user_id() );
	if ( is_string( $err ) && '' !== $err ) {
		delete_transient( 'aw_silo_error_' . get_current_user_id() );
		wp_admin_notice( esc_html( $err ), array( 'type' => 'error' ) );
	}
	echo '<p>' . esc_html__( 'A silo is one hub item and its supporting items. Supporting items link to the hub and to each other; an item in one silo links to another silo\'s hub only. An item is in one silo only.', 'rankweb' ) . '</p>';
	if ( $admin ) {
		echo '<p><a class="button" href="' . esc_url( add_query_arg( 'silo', 'new', $base ) ) . '">' . esc_html__( 'Add a silo', 'rankweb' ) . '</a></p>';
	}
	if ( '' !== $edit && $admin && ( 'new' === $edit || isset( $d['silos'][ (int) $edit ] ) ) ) {
		rankweb_silo_form( 'new' === $edit ? 0 : (int) $edit, $d, $base );
	}
	$labels = array(
		'virtual' => __( 'Virtual: each links to the hub and the others', 'rankweb' ),
		'circle'  => __( 'Circle: each links to the next and back to the hub', 'rankweb' ),
	);
	$cells  = array();
	foreach ( $d['silos'] as $sid => $s ) {
		$c     = rankweb_silo_checks( $s );
		$notes = array();
		if ( $c['few'] ) {
			/* translators: 1: items in the silo, 2: fewest items. */
			$notes[] = esc_html( sprintf( __( 'Only %1$s items; at least %2$s are better.', 'rankweb' ), number_format_i18n( $c['few'] ), number_format_i18n( (int) AW_SILO_MIN ) ) );
		}
		if ( $c['deep'] ) {
			/* translators: 1: item IDs, 2: most folders deep. */
			$notes[] = esc_html( sprintf( __( 'Deeper than %2$s folders: %1$s.', 'rankweb' ), implode( ', ', $c['deep'] ), number_format_i18n( (int) AW_SILO_DEPTH ) ) );
		}
		$cells[] = array(
			'name'  => ( $admin ? '<a href="' . esc_url( add_query_arg( 'silo', $sid, $base ) ) . '">' . esc_html( $s['name'] ) . '</a>' : esc_html( $s['name'] ) ),
			'hub'   => esc_html( rankweb_silo_item_label( $s['hub'] ) ),
			'mode'  => esc_html( $labels[ $s['mode'] ] ?? $s['mode'] ),
			'items' => esc_html( number_format_i18n( count( $s['items'] ) ) ),
			'check' => implode( '<br>', $notes ),
		);
	}
	rankweb_seo_extras_simple_table(
		'aw-silos',
		array(
			'name'  => __( 'Silo', 'rankweb' ),
			'hub'   => __( 'Hub', 'rankweb' ),
			'mode'  => __( 'Mode', 'rankweb' ),
			'items' => __( 'Supporting items', 'rankweb' ),
			'check' => __( 'Address checks', 'rankweb' ),
		),
		$cells,
		array(
			'primary' => 'name',
			'empty'   => __( 'No silos yet.', 'rankweb' ),
		)
	);
}

/**
 * The form to add or change a silo.
 *
 * @param int    $id   Silo ID, 0 for a new one.
 * @param array  $d    rankweb_silo_data().
 * @param string $base The Silos view address.
 */
function rankweb_silo_form( int $id, array $d, string $base ): void {
	$s = $d['silos'][ $id ] ?? array(
		'name'  => '',
		'hub'   => 0,
		'mode'  => 'virtual',
		'items' => array(),
	);
	echo '<h2>' . esc_html( $id ? __( 'Change the silo', 'rankweb' ) : __( 'Add a silo', 'rankweb' ) ) . '</h2>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="rankweb_silo_save"><input type="hidden" name="silo" value="' . esc_attr( (string) $id ) . '">';
	wp_nonce_field( 'rankweb_silo_save' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="aw-silo-name">' . esc_html__( 'Name', 'rankweb' ) . '</label></th><td><input type="text" id="aw-silo-name" name="name" class="regular-text" maxlength="120" value="' . esc_attr( $s['name'] ) . '"></td></tr>';
	echo '<tr><th scope="row"><label for="aw-silo-hub">' . esc_html__( 'Hub item ID', 'rankweb' ) . '</label></th><td><input type="number" id="aw-silo-hub" name="hub" class="small-text" min="1" value="' . esc_attr( $s['hub'] ? (string) $s['hub'] : '' ) . '">' . ( $s['hub'] ? ' <span class="description">' . esc_html( rankweb_silo_item_label( $s['hub'] ) ) . '</span>' : '' ) . '</td></tr>';
	echo '<tr><th scope="row"><label for="aw-silo-mode">' . esc_html__( 'Mode', 'rankweb' ) . '</label></th><td><select id="aw-silo-mode" name="mode"><option value="virtual"' . selected( $s['mode'], 'virtual', false ) . '>' . esc_html__( 'Virtual: each links to the hub and the others', 'rankweb' ) . '</option><option value="circle"' . selected( $s['mode'], 'circle', false ) . '>' . esc_html__( 'Circle: each links to the next and back to the hub', 'rankweb' ) . '</option></select></td></tr>';
	echo '<tr><th scope="row"><label for="aw-silo-items">' . esc_html__( 'Supporting item IDs', 'rankweb' ) . '</label></th><td><textarea id="aw-silo-items" name="items" rows="8" class="large-text code">' . esc_textarea( implode( "\n", $s['items'] ) ) . '</textarea><p class="description">' . esc_html__( 'One item ID per line, in the order of the circle. Published items with their own page only.', 'rankweb' ) . '</p>';
	if ( $s['items'] ) {
		echo '<p class="description">' . esc_html( implode( ' · ', array_map( 'rankweb_silo_item_label', array_slice( $s['items'], 0, 30 ) ) ) ) . ( count( $s['items'] ) > 30 ? '…' : '' ) . '</p>';
	}
	echo '</td></tr></tbody></table>';
	submit_button( __( 'Save the silo', 'rankweb' ), 'primary', 'submit', false );
	echo ' <a class="button-link" href="' . esc_url( $base ) . '">' . esc_html__( 'Cancel', 'rankweb' ) . '</a></form>';
	if ( $id ) {
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="rankweb_silo_delete"><input type="hidden" name="silo" value="' . esc_attr( (string) $id ) . '">';
		wp_nonce_field( 'rankweb_silo_delete' );
		echo '<p class="description">' . esc_html__( 'Deleting a silo removes its settings only. No item is changed or deleted.', 'rankweb' ) . '</p>';
		submit_button( __( 'Delete this silo', 'rankweb' ), 'delete', 'submit', false );
		echo '</form>';
	}
}
