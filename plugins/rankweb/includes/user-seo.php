<?php
/**
 * SEO fields on the user profile (the author page): a search title, a search description and noindex, printed when
 * RankWeb prints the page head. Rank Math's stored user fields are read when RankWeb's are empty. The values and their
 * rules are in class-rankweb-term-seo.php.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-term-seo.php';

/** A user's values, RankWeb's own then Rank Math's. */
function rankweb_user_seo_values( int $user_id ): array {
	$own = array();
	foreach ( RankWeb_Term_Seo::USER_KEYS as $k => $meta ) {
		$own[ $k ] = (string) get_user_meta( $user_id, $meta, true );
	}
	return RankWeb_Term_Seo::resolve(
		$own,
		array(
			'title'       => (string) get_user_meta( $user_id, 'rank_math_title', true ),
			'description' => (string) get_user_meta( $user_id, 'rank_math_description', true ),
			'robots'      => get_user_meta( $user_id, 'rank_math_robots', true ),
		)
	);
}

/** The author whose page is being viewed. */
function rankweb_user_seo_current(): ?array {
	if ( ! function_exists( 'is_author' ) || ! is_author() ) {
		return null;
	}
	$id = (int) get_queried_object_id();
	return $id ? rankweb_user_seo_values( $id ) : null;
}

$rankweb_user_form = function ( $user ) {
	if ( ! function_exists( 'rankweb_prints_head' ) || ! rankweb_prints_head() || ! current_user_can( 'edit_user', $user->ID ) ) {
		return;
	}
	$own = array();
	foreach ( RankWeb_Term_Seo::USER_KEYS as $k => $meta ) {
		$own[ $k ] = (string) get_user_meta( $user->ID, $meta, true );
	}
	wp_nonce_field( 'rankweb_user_seo', 'rankweb_user_seo_nonce' );
	echo '<h2>' . esc_html__( 'Search engines (RankWeb)', 'rankweb' ) . '</h2><table class="form-table" role="presentation"><tbody>';
	echo '<tr><th><label for="rankweb-user-title">' . esc_html__( 'Search title of the author page', 'rankweb' ) . '</label></th><td><input type="text" class="regular-text" id="rankweb-user-title" name="rankweb_user_seo[title]" value="' . esc_attr( $own['title'] ) . '" /></td></tr>';
	echo '<tr><th><label for="rankweb-user-desc">' . esc_html__( 'Search description of the author page', 'rankweb' ) . '</label></th><td><textarea id="rankweb-user-desc" class="large-text" rows="3" name="rankweb_user_seo[description]">' . esc_textarea( $own['description'] ) . '</textarea></td></tr>';
	echo '<tr><th>' . esc_html__( 'Search visibility', 'rankweb' ) . '</th><td><label><input type="checkbox" name="rankweb_user_seo[noindex]" value="1"' . checked( '1', $own['noindex'], false ) . ' /> ' . esc_html__( 'Keep the author page out of search results', 'rankweb' ) . '</label></td></tr>';
	echo '</tbody></table>';
};
add_action( 'show_user_profile', $rankweb_user_form );
add_action( 'edit_user_profile', $rankweb_user_form );

$rankweb_user_save = function ( $user_id ) {
	$user_id = (int) $user_id;
	if ( empty( $_POST['rankweb_user_seo_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['rankweb_user_seo_nonce'] ) ), 'rankweb_user_seo' ) || ! current_user_can( 'edit_user', $user_id ) ) {
		return;
	}
	$form = isset( $_POST['rankweb_user_seo'] ) && is_array( $_POST['rankweb_user_seo'] ) ? array_map( 'sanitize_textarea_field', wp_unslash( $_POST['rankweb_user_seo'] ) ) : array();
	foreach ( RankWeb_Term_Seo::clean_form( $form, RankWeb_Term_Seo::USER_KEYS ) as $key => $value ) {
		if ( '' === $value ) {
			delete_user_meta( $user_id, $key );
		} else {
			update_user_meta( $user_id, $key, $value );
		}
	}
};
add_action( 'personal_options_update', $rankweb_user_save );
add_action( 'edit_user_profile_update', $rankweb_user_save );

if ( function_exists( 'rankweb_prints_head' ) && rankweb_prints_head() ) {
	add_filter(
		'pre_get_document_title',
		function ( $title ) {
			$v = '' === (string) $title ? rankweb_user_seo_current() : null;
			return $v && '' !== $v['title'] ? $v['title'] : $title;
		},
		19
	);
}
