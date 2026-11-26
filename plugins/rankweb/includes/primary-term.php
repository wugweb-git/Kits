<?php
/**
 * Primary category: the editor picks which of a post's categories is the main one. It sets the %category% in the post's
 * address and the category in RankWeb's breadcrumbs. The choice is in the block editor sidebar and the classic box; the
 * rules are in class-rankweb-primary-term.php.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-primary-term.php';

add_action(
	'init',
	function () {
		register_post_meta(
			'post',
			RankWeb_Primary_Term::KEY,
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'sanitize_callback' => array( 'RankWeb_Primary_Term', 'clean' ),
				'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
			)
		);
	}
);

/** A post's primary category as a term, or null. */
function rankweb_primary_category( int $post_id ): ?WP_Term {
	$assigned = wp_get_post_categories( $post_id, array( 'fields' => 'ids' ) );
	$id       = RankWeb_Primary_Term::resolve( get_post_meta( $post_id, RankWeb_Primary_Term::KEY, true ), is_array( $assigned ) ? $assigned : array() );
	$term     = $id ? get_term( $id, 'category' ) : null;
	return $term instanceof WP_Term ? $term : null;
}

// The %category% of the permalink.
add_filter(
	'post_link_category',
	function ( $cat, $cats, $post ) {
		$own = $post instanceof WP_Post ? rankweb_primary_category( (int) $post->ID ) : null;
		return $own ? $own : $cat;
	},
	10,
	3
);

// Classic editor: a choice among the post's saved categories, inside the RankWeb box.
add_action(
	'rankweb_robots_box_after',
	function ( $post ) {
		$cats = wp_get_post_categories( (int) $post->ID, array( 'fields' => 'all' ) );
		if ( ! is_array( $cats ) || count( $cats ) < 2 ) {
			return;
		}
		$cur = (string) get_post_meta( $post->ID, RankWeb_Primary_Term::KEY, true );
		echo '<p><label for="rankweb-primary">' . esc_html__( 'Primary category', 'rankweb' ) . '</label><br /><select id="rankweb-primary" name="rankweb_robots[primary]"><option value="">' . esc_html__( 'Automatic', 'rankweb' ) . '</option>';
		foreach ( $cats as $c ) {
			echo '<option value="' . esc_attr( (string) $c->term_id ) . '"' . selected( $cur, (string) $c->term_id, false ) . '>' . esc_html( $c->name ) . '</option>';
		}
		echo '</select></p>';
	}
);

add_action(
	'save_post_post',
	function ( $post_id ) {
		if ( empty( $_POST['rankweb_robots_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['rankweb_robots_nonce'] ) ), 'rankweb_robots_' . (int) $post_id ) || ! current_user_can( 'edit_post', (int) $post_id ) || ! isset( $_POST['rankweb_robots']['primary'] ) ) {
			return;
		}
		$v = RankWeb_Primary_Term::clean( sanitize_text_field( wp_unslash( $_POST['rankweb_robots']['primary'] ) ) );
		if ( '' === $v ) {
			delete_post_meta( (int) $post_id, RankWeb_Primary_Term::KEY );
		} else {
			update_post_meta( (int) $post_id, RankWeb_Primary_Term::KEY, $v );
		}
	}
);
