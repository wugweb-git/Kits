<?php
/**
 * SEO fields on the category, tag and other term screens (title, description, noindex), printed when RankWeb prints the
 * page head (no Rank Math, Yoast SEO, SEOPress or All in One SEO). The values and their rules are in
 * class-rankweb-term-seo.php.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-term-seo.php';

/** The taxonomies that get the fields (filterable). */
function rankweb_term_seo_taxonomies(): array {
	return array_values( array_filter( array_map( 'sanitize_key', (array) apply_filters( 'rankweb_term_seo_taxonomies', array( 'category', 'post_tag' ) ) ), 'taxonomy_exists' ) );
}

/** A term's values, RankWeb's own then Rank Math's. */
function rankweb_term_seo_values( int $term_id ): array {
	$own = array();
	foreach ( RankWeb_Term_Seo::KEYS as $k => $meta ) {
		$own[ $k ] = (string) get_term_meta( $term_id, $meta, true );
	}
	return RankWeb_Term_Seo::resolve(
		$own,
		array(
			'title'       => (string) get_term_meta( $term_id, 'rank_math_title', true ),
			'description' => (string) get_term_meta( $term_id, 'rank_math_description', true ),
			'robots'      => get_term_meta( $term_id, 'rank_math_robots', true ),
		)
	);
}

add_action(
	'admin_init',
	function () {
		if ( ! function_exists( 'rankweb_prints_head' ) || ! rankweb_prints_head() ) {
			return;
		}
		foreach ( rankweb_term_seo_taxonomies() as $tax ) {
			add_action(
				"{$tax}_edit_form_fields",
				function ( $term ) {
					$own = array();
					foreach ( RankWeb_Term_Seo::KEYS as $k => $meta ) {
						$own[ $k ] = (string) get_term_meta( $term->term_id, $meta, true );
					}
					wp_nonce_field( 'rankweb_term_seo', 'rankweb_term_seo_nonce' );
					echo '<tr class="form-field"><th scope="row"><label for="rankweb-term-title">' . esc_html__( 'Search title (RankWeb)', 'rankweb' ) . '</label></th><td><input type="text" id="rankweb-term-title" name="rankweb_term_seo[title]" value="' . esc_attr( $own['title'] ) . '" class="large-text" /><p class="description">' . esc_html__( 'Leave empty to use the name.', 'rankweb' ) . '</p></td></tr>';
					echo '<tr class="form-field"><th scope="row"><label for="rankweb-term-desc">' . esc_html__( 'Search description (RankWeb)', 'rankweb' ) . '</label></th><td><textarea id="rankweb-term-desc" name="rankweb_term_seo[description]" rows="3" class="large-text">' . esc_textarea( $own['description'] ) . '</textarea><p class="description">' . esc_html__( 'Leave empty to use the description above.', 'rankweb' ) . '</p></td></tr>';
					echo '<tr class="form-field"><th scope="row">' . esc_html__( 'Search visibility (RankWeb)', 'rankweb' ) . '</th><td><label><input type="checkbox" name="rankweb_term_seo[noindex]" value="1"' . checked( '1', $own['noindex'], false ) . ' /> ' . esc_html__( 'Keep this archive out of search results', 'rankweb' ) . '</label></td></tr>';
				}
			);
			add_action( "edited_{$tax}", 'rankweb_term_seo_save' );
		}
	}
);

/** Save the fields after the nonce and the capability check. */
function rankweb_term_seo_save( $term_id ): void {
	$term_id = (int) $term_id;
	if ( empty( $_POST['rankweb_term_seo_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['rankweb_term_seo_nonce'] ) ), 'rankweb_term_seo' ) || ! current_user_can( 'edit_term', $term_id ) ) {
		return;
	}
	$form = isset( $_POST['rankweb_term_seo'] ) && is_array( $_POST['rankweb_term_seo'] ) ? array_map( 'sanitize_textarea_field', wp_unslash( $_POST['rankweb_term_seo'] ) ) : array();
	foreach ( RankWeb_Term_Seo::clean_form( $form ) as $key => $value ) {
		if ( '' === $value ) {
			delete_term_meta( $term_id, $key );
		} else {
			update_term_meta( $term_id, $key, $value );
		}
	}
}

/** The term being viewed, when it is a category, tag or custom term archive. */
function rankweb_term_seo_current(): ?array {
	if ( ! function_exists( 'is_category' ) || ! ( is_category() || is_tag() || is_tax() ) ) {
		return null;
	}
	$term = get_queried_object();
	return $term instanceof WP_Term ? rankweb_term_seo_values( (int) $term->term_id ) : null;
}

if ( function_exists( 'rankweb_prints_head' ) && rankweb_prints_head() ) {
	add_filter(
		'pre_get_document_title',
		function ( $title ) {
			$v = '' === (string) $title ? rankweb_term_seo_current() : null;
			return $v && '' !== $v['title'] ? $v['title'] : $title;
		},
		19
	);
}
