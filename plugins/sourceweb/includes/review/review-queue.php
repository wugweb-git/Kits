<?php
/**
 * Sourcing → To review (Inbox → To review until 25 Oct 2026): one list of everything that came in automatically and is waiting for a person — news, Library
 * items, opportunities and press — with why each was held (aw_review). Publish puts an item live; Reject moves it to
 * Drafts with a note (nothing is deleted). One at a time or several together. Replaces "Press to review".
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Who reviews: the To review screen and its Publish and Reject. */
const AW_REVIEW_CAP = SOURCEWEB_CAP; // manage_sourceweb (sourceweb-caps.php); was edit_others_posts, which still opens it

/**
 * Types in the queue: post type => label. Built from the site's type roles (sourceweb_post_type_roles); a role with no
 * type is left out. WordPress's own post is always there (research papers only: Resources tagged research, a held one
 * shows why, 24 Oct 2026). The social role is the site layer's social posts, only while that module is on.
 *
 * @return array<string,string>
 */
function sourceweb_review_types(): array {
	$labels = array(
		'news'        => 'News',
		'library'     => 'Library',
		'opportunity' => 'Opportunity',
		'press'       => 'Press',
		'social'      => 'Social post',
	);
	$out    = array();
	foreach ( $labels as $role => $label ) {
		$type = sourceweb_type( $role );
		if ( '' !== $type ) {
			$out[ $type ] = $label;
		}
	}
	$out['post'] = 'Research';
	return $out;
}

/** A review item: any of the types above, but of Resources only research papers (guides are never reviewed here). */
function sourceweb_review_is_item( $p ) {
	// A type switched off (Social posts) is left out; its records are kept.
	return $p && isset( sourceweb_review_types()[ $p->post_type ] ) && post_type_exists( $p->post_type ) && ( 'post' !== $p->post_type || has_term( 'research', 'post_tag', $p ) );
}

/**
 * Items waiting: Pending, plus drafts the automatic review held back.
 *
 * @param string $type One type, or '' for all.
 * @return WP_Post[]
 */
function sourceweb_review_items( $type = '' ) {
	$labels  = sourceweb_review_types();
	$types   = $type && isset( $labels[ $type ] ) ? array( $type ) : array_keys( $labels );
	$pending = get_posts( array( 'post_type' => $types, 'post_status' => 'pending', 'numberposts' => 300, 'orderby' => 'date', 'order' => 'DESC' ) );
	$held    = get_posts(
		array(
			'post_type'   => $types,
			'post_status' => 'draft',
			'numberposts' => 300,
			'meta_query'  => array( array( 'key' => 'aw_review', 'value' => 'held:', 'compare' => 'LIKE' ) ), // phpcs:ignore WordPress.DB.SlowDBQuery
		)
	);
	$all = array_values( array_filter( array_merge( $pending, $held ), 'sourceweb_review_is_item' ) );
	// Only items the relevance check passed (or has not checked): "not relevant" never reaches a person (owner, 10 Oct 2026).
	if ( function_exists( 'sourceweb_relevance_failed' ) ) {
		$all = array_values( array_filter( $all, fn( $p ) => ! sourceweb_relevance_failed( $p->ID ) ) );
	}
	usort( $all, fn( $a, $b ) => strcmp( $b->post_date, $a->post_date ) );
	return $all;
}

/** How many items are waiting (for the menu count). */
function sourceweb_review_count() {
	static $n = null;
	if ( null === $n ) {
		$cached = get_transient( 'aw_review_count' ); // cached 5 minutes; sourceweb_review_count_flush() clears it (audit 9)
		if ( false === $cached ) {
			$cached = count( sourceweb_review_items() );
			set_transient( 'aw_review_count', $cached, 5 * MINUTE_IN_SECONDS );
		}
		$n = (int) $cached;
	}
	return $n;
}

/** Forget the cached To review count (a review item changed). Moved from Core's admin-ia.php (aw_inbox_counts_flush), 25 Oct 2026. */
function sourceweb_review_count_flush() {
	delete_transient( 'aw_review_count' );
}
add_action(
	'transition_post_status',
	function ( $new, $old, $post ) {
		if ( sourceweb_is_any_type( $post->post_type, array( 'news', 'library', 'opportunity', 'press', 'social' ) ) ) {
			sourceweb_review_count_flush();
		}
	},
	10,
	3
);
foreach ( array( 'added_post_meta', 'updated_post_meta', 'deleted_post_meta' ) as $aw_review_hook ) {
	add_action(
		$aw_review_hook,
		function ( $mid, $id, $key ) {
			if ( 'aw_review' === $key ) {
				sourceweb_review_count_flush();
			}
		},
		10,
		3
	);
}
unset( $aw_review_hook );

add_action(
	'admin_menu',
	function () {
		add_submenu_page( AW_SRC_MENU, 'To review', 'To review' . ( function_exists( 'kits_menu_count' ) ? kits_menu_count( sourceweb_review_count() ) : '' ), AW_REVIEW_CAP, 'aw-review', 'sourceweb_review_page' );
	},
	10 // after the menu and its Overview (admin-menu.php, 9)
);

/**
 * Publish or reject items.
 *
 * @param int[]  $ids    Post IDs.
 * @param string $action 'publish' or 'reject'.
 * @return int Items changed.
 */
function sourceweb_review_apply( $ids, $action ) {
	$n    = 0;
	$who  = wp_get_current_user()->display_name;
	$when = current_time( 'Y-m-d H:i' );
	foreach ( array_map( 'intval', $ids ) as $id ) {
		$p = get_post( $id );
		if ( ! sourceweb_review_is_item( $p ) || ! in_array( $p->post_status, array( 'pending', 'draft' ), true ) || ! current_user_can( 'edit_post', $id ) ) {
			continue;
		}
		if ( 'publish' === $action && 'aw_social' === $p->post_type && '' === trim( (string) get_post_meta( $id, 'aw_social_summary', true ) ) ) {
			continue; // A social post needs its staff summary before it goes live.
		}
		if ( 'publish' === $action ) {
			$src = (string) get_post_meta( $id, 'aw_source_date', true );
			if ( get_post_meta( $id, 'aw_backfill', true ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', $src ) && $src <= current_time( 'Y-m-d' ) ) {
				// Backfilled items keep their original date (not the day they were approved).
				wp_update_post( array( 'ID' => $id, 'post_status' => 'publish', 'post_date' => $src . ' 12:00:00', 'post_date_gmt' => get_gmt_from_date( $src . ' 12:00:00' ), 'edit_date' => true ) );
			} else {
				wp_publish_post( $id );
			}
			update_post_meta( $id, 'aw_review', 'approved by ' . $who . ' ' . $when );
		} else {
			wp_update_post( array( 'ID' => $id, 'post_status' => 'draft' ) );
			update_post_meta( $id, 'aw_review', 'rejected by ' . $who . ' ' . $when . ' (kept in Drafts)' );
		}
		++$n;
	}
	return $n;
}

/** Sourcing → To review: the shell screen (sourceweb-ui.php). */
function sourceweb_review_page() {
	if ( ! current_user_can( AW_REVIEW_CAP ) ) {
		return;
	}
	sourceweb_ui_page( 'review' );
}

/* ---------- News and Library lists (edit.php): bulk Publish / Approve on every ticked item, and "Publish all" ---------- */

add_action(
	'init',
	function () {
		foreach ( array_diff( array_keys( sourceweb_review_types() ), array( 'post' ) ) as $aw_rt ) { // not on the Resources list (guides)
			add_filter( 'bulk_actions-edit-' . $aw_rt, fn( $a ) => array( 'aw_publish' => 'Publish (approve)' ) + $a );
			add_filter(
				'handle_bulk_actions-edit-' . $aw_rt,
				function ( $back, $action, $ids ) {
					if ( 'aw_publish' !== $action ) {
						return $back;
					}
					return add_query_arg( 'aw_published', sourceweb_review_apply( (array) $ids, 'publish' ), $back );
				},
				10,
				3
			);
		}
	},
	20
);

// "Publish all N in this view" on the Pending and Draft views (every page, not only the one on screen).
add_action(
	'restrict_manage_posts',
	function ( $type, $which ) {
		$status = sanitize_key( $_GET['post_status'] ?? '' ); // phpcs:ignore WordPress.Security.NonceVerification
		if ( 'top' !== $which || ! isset( sourceweb_review_types()[ $type ] ) || 'post' === $type || ! in_array( $status, array( 'pending', 'draft' ), true ) ) {
			return;
		}
		$n = (int) ( wp_count_posts( $type )->$status ?? 0 );
		if ( $n ) {
			$url = wp_nonce_url( admin_url( 'admin-post.php?action=aw_publish_all&post_type=' . $type . '&status=' . $status ), 'aw_publish_all' );
			echo '<a class="button" href="' . esc_url( $url ) . '" onclick="return confirm(' . esc_attr( wp_json_encode( sprintf( 'Publish all %d items in this view?', $n ) ) ) . ')">' . esc_html( sprintf( 'Publish all %d', $n ) ) . '</a>';
		}
	},
	10,
	2
);
add_action(
	'admin_post_aw_publish_all',
	function () {
		$type   = sanitize_key( $_GET['post_type'] ?? '' );
		$status = sanitize_key( $_GET['status'] ?? '' );
		if ( ! current_user_can( AW_REVIEW_CAP ) || ! check_admin_referer( 'aw_publish_all' ) || ! isset( sourceweb_review_types()[ $type ] ) || 'post' === $type || ! in_array( $status, array( 'pending', 'draft' ), true ) ) {
			wp_die( 'Not allowed.', 403 );
		}
		$ids = get_posts( array( 'post_type' => $type, 'post_status' => $status, 'fields' => 'ids', 'numberposts' => -1 ) );
		$n   = sourceweb_review_apply( $ids, 'publish' );
		wp_safe_redirect( add_query_arg( array( 'post_type' => $type, 'post_status' => $status, 'aw_published' => $n ), admin_url( 'edit.php' ) ) );
		exit;
	}
);
add_action(
	'admin_post_aw_review_item',
	function () {
		$id     = absint( $_GET['item_id'] ?? 0 );
		$action = sanitize_key( $_GET['review_action'] ?? '' );
		if ( ! $id || ! in_array( $action, array( 'publish', 'reject' ), true ) || ! current_user_can( AW_REVIEW_CAP ) || ! check_admin_referer( 'aw_review_' . $id ) ) {
			wp_die( 'Not allowed.', 403 );
		}
		sourceweb_review_apply( array( $id ), $action );
		$back = wp_get_referer() ? wp_get_referer() : admin_url( 'admin.php?page=aw-review' );
		wp_safe_redirect( add_query_arg( 'aw_reviewed', 1, $back ) );
		exit;
	}
);
add_action(
	'admin_notices',
	function () {
		if ( isset( $_GET['aw_published'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$n = (int) $_GET['aw_published']; // phpcs:ignore WordPress.Security.NonceVerification
			wp_admin_notice( esc_html( sprintf( /* translators: %d: number of items. */ _n( '%d item published.', '%d items published.', $n, 'sourceweb' ), $n ) ), array( 'type' => 'success', 'dismissible' => true ) );
		}
	}
);
