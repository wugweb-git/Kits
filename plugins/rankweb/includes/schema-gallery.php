<?php
/**
 * "Structured data" box: choose one of the types in Google's search gallery (Recipe, Product, Local business, Event,
 * Job posting, Course, Fact check, Profile page, Software app, Book, Movie, Review), fill its fields, and RankWeb prints
 * the markup. The types and their fields are in class-rankweb-schema-gallery.php; this file is the box, the save and
 * the printing. A type whose required fields are not all filled prints nothing, and the box says what is missing.
 *
 * The box is a meta box (both editors show it) inside the edit screen's own form, so it has no form or action of its own.
 * One node per item, in post meta `_rankweb_gallery` (type and values). Into Rank Math's graph when Rank Math prints
 * the head, into RankWeb's own JSON-LD when it does.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-schema-gallery.php';

const RANKWEB_GALLERY_META = '_rankweb_gallery';

/** The post types that get the box (public types; filter `rankweb_gallery_post_types`). */
function rankweb_gallery_post_types(): array {
	if ( ! function_exists( 'get_post_types' ) ) {
		return array();
	}
	$types = array_values( array_diff( get_post_types( array( 'public' => true ) ), array( 'attachment' ) ) );
	$types = apply_filters( 'rankweb_gallery_post_types', $types );
	return array_values( array_filter( array_map( 'sanitize_key', (array) $types ), 'post_type_exists' ) );
}

/**
 * The node for an item, or null.
 *
 * @param int $post_id Item.
 * @return array{node:?array,missing:string[],type:string}
 */
function rankweb_gallery_result( int $post_id ): array {
	$saved = get_post_meta( $post_id, RANKWEB_GALLERY_META, true );
	$type  = is_array( $saved ) ? (string) ( $saved['type'] ?? '' ) : '';
	if ( '' === $type || ! isset( RankWeb_Schema_Gallery::types()[ $type ] ) ) {
		return array( 'node' => null, 'missing' => array(), 'type' => '' );
	}
	$r         = RankWeb_Schema_Gallery::build( $type, (array) ( $saved['values'] ?? array() ) );
	$r['type'] = $type;
	return $r;
}

add_action(
	'add_meta_boxes',
	function ( $post_type, $post = null ) {
		if ( ! $post instanceof WP_Post || ! in_array( (string) $post_type, rankweb_gallery_post_types(), true ) || ! current_user_can( 'edit_post', (int) $post->ID ) ) {
			return;
		}
		add_meta_box(
			'rankweb-gallery',
			__( 'Structured data (Google)', 'rankweb' ),
			'rankweb_gallery_box',
			$post_type,
			'normal',
			'low' // shown in the block editor's box area too: this is the box most people will use
		);
	},
	10,
	2
);

/**
 * The box.
 *
 * @param WP_Post $post Item.
 */
function rankweb_gallery_box( WP_Post $post ): void {
	$id    = (int) $post->ID;
	$saved = get_post_meta( $id, RANKWEB_GALLERY_META, true );
	$cur   = is_array( $saved ) ? (string) ( $saved['type'] ?? '' ) : '';
	$vals  = is_array( $saved ) ? (array) ( $saved['values'] ?? array() ) : array();
	$types = RankWeb_Schema_Gallery::types();
	wp_nonce_field( 'rankweb_gallery_' . $id, 'rankweb_gallery_nonce' );

	echo '<p><label for="rankweb-gallery-type"><strong>' . esc_html__( 'What is this page?', 'rankweb' ) . '</strong></label> ';
	echo '<select id="rankweb-gallery-type" name="rankweb_gallery_type"><option value="">' . esc_html__( 'None', 'rankweb' ) . '</option>';
	foreach ( $types as $key => $spec ) {
		echo '<option value="' . esc_attr( $key ) . '"' . selected( $cur, $key, false ) . '>' . esc_html( $spec['label'] ) . '</option>';
	}
	echo '</select></p>';

	$r = rankweb_gallery_result( $id );
	if ( '' !== $cur ) {
		if ( $r['node'] ) {
			echo '<p class="description"><span class="dashicons dashicons-yes-alt" style="color:#007017" aria-hidden="true"></span> ' . esc_html__( 'Complete. This page prints the markup.', 'rankweb' ) . '</p>';
		} else {
			/* translators: %s: the fields still to fill. */
			echo '<p class="description"><span class="dashicons dashicons-warning" style="color:#8a5a00" aria-hidden="true"></span> ' . esc_html( sprintf( __( 'Nothing is printed yet. Still needed: %s.', 'rankweb' ), implode( ', ', $r['missing'] ) ) ) . '</p>';
		}
	}

	foreach ( $types as $key => $spec ) {
		echo '<fieldset class="rankweb-gallery-set" data-type="' . esc_attr( $key ) . '"' . ( $key === $cur ? '' : ' hidden' ) . '><legend class="screen-reader-text">' . esc_html( $spec['label'] ) . '</legend>';
		echo '<table class="form-table" role="presentation"><tbody>';
		foreach ( $spec['fields'] as $f ) {
			list( $path, $label, $kind, $req ) = $f;
			$name = 'rankweb_gallery[' . $key . '][' . RankWeb_Schema_Gallery::key( $path ) . ']';
			$fid  = 'rwg-' . $key . '-' . RankWeb_Schema_Gallery::key( $path );
			$v    = ( $key === $cur ) ? (string) ( $vals[ $path ] ?? '' ) : '';
			echo '<tr><th scope="row"><label for="' . esc_attr( $fid ) . '">' . esc_html( $label ) . ( $req ? ' <span aria-hidden="true" style="color:#b32d2e">*</span><span class="screen-reader-text">' . esc_html__( '(required)', 'rankweb' ) . '</span>' : '' ) . '</label></th><td>';
			if ( 'longtext' === $kind || 'lines' === $kind || 'steps' === $kind || 'items' === $kind ) {
				echo '<textarea id="' . esc_attr( $fid ) . '" name="' . esc_attr( $name ) . '" rows="' . ( 'longtext' === $kind ? 3 : 5 ) . '" class="large-text"' . ( $req ? ' aria-required="true"' : '' ) . '>' . esc_textarea( $v ) . '</textarea>';
			} elseif ( 'select' === $kind ) {
				echo '<select id="' . esc_attr( $fid ) . '" name="' . esc_attr( $name ) . '">';
				foreach ( (array) $f[4] as $val => $text ) {
					echo '<option value="' . esc_attr( (string) $val ) . '"' . selected( $v, (string) $val, false ) . '>' . esc_html( '' === $text ? '—' : $text ) . '</option>';
				}
				echo '</select>';
			} else {
				$html_type = 'url' === $kind ? 'url' : 'text';
				echo '<input type="' . esc_attr( $html_type ) . '" id="' . esc_attr( $fid ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( $v ) . '" class="regular-text"' . ( $req ? ' aria-required="true"' : '' ) . '>';
			}
			echo '</td></tr>';
		}
		echo '</tbody></table></fieldset>';
	}
	echo '<p><a href="' . esc_url( 'https://search.google.com/test/rich-results?url=' . rawurlencode( (string) get_permalink( $id ) ) ) . '" target="_blank" rel="noopener">' . esc_html__( 'Test this page in Google’s Rich Results Test', 'rankweb' ) . '</a></p>';

	// Show the chosen type's fields only.
	wp_register_script( 'rankweb-gallery', '', array(), RANKWEB_VERSION, true );
	wp_enqueue_script( 'rankweb-gallery' );
	wp_add_inline_script(
		'rankweb-gallery',
		"(function(){var s=document.getElementById('rankweb-gallery-type');if(!s){return;}function f(){document.querySelectorAll('.rankweb-gallery-set').forEach(function(e){e.hidden=e.getAttribute('data-type')!==s.value;});}s.addEventListener('change',f);f();})();"
	);
}

add_action(
	'save_post',
	function ( $post_id, $post ) {
		static $done = array();
		$post_id = (int) $post_id;
		if ( isset( $done[ $post_id ] ) || ! $post instanceof WP_Post || wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
			return;
		}
		if ( empty( $_POST['rankweb_gallery_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['rankweb_gallery_nonce'] ) ), 'rankweb_gallery_' . $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		$done[ $post_id ] = true;
		$type             = isset( $_POST['rankweb_gallery_type'] ) ? sanitize_text_field( wp_unslash( $_POST['rankweb_gallery_type'] ) ) : '';
		if ( '' === $type || ! isset( RankWeb_Schema_Gallery::types()[ $type ] ) ) {
			delete_post_meta( $post_id, RANKWEB_GALLERY_META );
			return;
		}
		$raw = isset( $_POST['rankweb_gallery'][ $type ] ) && is_array( $_POST['rankweb_gallery'][ $type ] ) ? wp_unslash( $_POST['rankweb_gallery'][ $type ] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- RankWeb_Schema_Gallery::clean() cleans every field by its kind
		update_post_meta( $post_id, RANKWEB_GALLERY_META, array( 'type' => $type, 'values' => RankWeb_Schema_Gallery::clean( $type, $raw ) ) );
	},
	20,
	2
);

/** The page's node, from the queried item (null when none or incomplete). */
function rankweb_gallery_page_node(): ?array {
	if ( ! function_exists( 'is_singular' ) || ! function_exists( 'get_queried_object_id' ) || ! is_singular() || ! is_singular( rankweb_gallery_post_types() ) ) {
		return null;
	}
	$id = get_queried_object_id();
	$r  = rankweb_gallery_result( (int) $id );
	if ( ! $r['node'] ) {
		return null;
	}
	$node        = $r['node'];
	$node['@id'] = trailingslashit( (string) get_permalink( $id ) ) . '#' . strtolower( $r['type'] );
	return $node;
}

// Into Rank Math's graph.
add_filter(
	'rank_math/json_ld',
	function ( $data ) {
		$node = rankweb_gallery_page_node();
		if ( is_array( $data ) && $node ) {
			$data['rankweb_gallery'] = $node;
		}
		return $data;
	},
	1105
);
