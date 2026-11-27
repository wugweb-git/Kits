<?php
/**
 * Admin: show the icons the front end uses.
 * - Taxonomy list tables get a first "Icon" column (24px, alt = "<term> icon", a dash when none).
 * - The term edit screen gets a wugweb_icon_path field with a live preview.
 * - Clients list gets a Logo column (wugweb_icon_path, then wugweb_client_logo).
 * - Media Library list view gets an Alt text column (_wp_attachment_image_alt).
 */
defined( 'ABSPATH' ) || exit;
if ( ! is_admin() ) { return; }

function wugweb_admin_icon_taxonomies() {
	return array( 'tool', 'platform', 'industry', 'sector', 'country', 'discipline', 'service_group', 'owner', 'asset_type', 'content_type', 'department' );
}

function wugweb_admin_icon_img( $url, $alt ) {
	return '<img src="' . esc_url( $url ) . '" alt="' . esc_attr( $alt ) . '" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;vertical-align:middle">';
}

add_action( 'admin_init', function () {
	foreach ( wugweb_admin_icon_taxonomies() as $tax ) {
		add_filter( "manage_edit-{$tax}_columns", function ( $cols ) {
			$out = array();
			foreach ( $cols as $k => $v ) { $out[ $k ] = $v; if ( 'cb' === $k ) { $out['wugweb_icon'] = 'Icon'; } }
			if ( ! isset( $out['wugweb_icon'] ) ) { $out = array_merge( array( 'wugweb_icon' => 'Icon' ), $out ); }
			return $out;
		}, 30 );
		add_filter( "manage_{$tax}_custom_column", function ( $out, $col, $term_id ) {
			if ( 'wugweb_icon' !== $col ) { return $out; }
			$t = get_term( (int) $term_id );
			$u = function_exists( 'wugweb_icon_url' ) ? wugweb_icon_url( 'term', $term_id ) : '';
			return $u ? wugweb_admin_icon_img( $u, ( $t && ! is_wp_error( $t ) ? $t->name : '' ) . ' icon' ) : '&mdash;';
		}, 10, 3 );
		// Edit screen: path field + preview.
		add_action( "{$tax}_edit_form_fields", function ( $term ) {
			$path = (string) get_term_meta( $term->term_id, 'wugweb_icon_path', true );
			$u = function_exists( 'wugweb_icon_url' ) ? wugweb_icon_url( 'term', $term->term_id ) : '';
			wp_nonce_field( 'wugweb_icon_path_' . $term->term_id, 'wugweb_icon_path_nonce' );
			echo '<tr class="form-field"><th scope="row"><label for="wugweb_icon_path">Icon path</label></th><td><input type="text" name="wugweb_icon_path" id="wugweb_icon_path" value="' . esc_attr( $path ) . '" class="regular-text" placeholder="assets/..."> ';
			echo $u ? wugweb_admin_icon_img( $u, $term->name . ' icon' ) : '<span aria-hidden="true">&mdash;</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built by wugweb_admin_icon_img with esc_url/esc_attr
			echo '<p class="description">R2 key (assets/...) or a full URL. Shown on the front end next to the name; leave empty for no icon.</p></td></tr>';
		} );
		add_action( "edited_{$tax}", function ( $term_id ) {
			if ( ! isset( $_POST['wugweb_icon_path_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['wugweb_icon_path_nonce'] ) ), 'wugweb_icon_path_' . $term_id ) ) { return; }
			if ( ! current_user_can( 'edit_term', $term_id ) || ! isset( $_POST['wugweb_icon_path'] ) ) { return; }
			$v = trim( sanitize_text_field( wp_unslash( $_POST['wugweb_icon_path'] ) ) );
			if ( '' === $v ) { delete_term_meta( $term_id, 'wugweb_icon_path' ); } else { update_term_meta( $term_id, 'wugweb_icon_path', $v ); }
		} );
	}

	// Clients list: logo column.
	add_filter( 'manage_client_posts_columns', function ( $cols ) {
		$out = array();
		foreach ( $cols as $k => $v ) { $out[ $k ] = $v; if ( 'cb' === $k ) { $out['wugweb_logo'] = 'Logo'; } }
		if ( ! isset( $out['wugweb_logo'] ) ) { $out = array_merge( array( 'wugweb_logo' => 'Logo' ), $out ); }
		return $out;
	}, 30 );
	add_action( 'manage_client_posts_custom_column', function ( $col, $post_id ) {
		if ( 'wugweb_logo' !== $col ) { return; }
		$u = function_exists( 'wugweb_icon_url' ) ? wugweb_icon_url( 'post', $post_id ) : '';
		echo $u ? wugweb_admin_icon_img( $u, get_the_title( $post_id ) . ' logo' ) : '&mdash;'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built by wugweb_admin_icon_img with esc_url/esc_attr
	}, 10, 2 );

	// Media Library list view: alt text column.
	add_filter( 'manage_media_columns', function ( $cols ) { $cols['wugweb_alt'] = 'Alt text'; return $cols; } );
	add_action( 'manage_media_custom_column', function ( $col, $post_id ) {
		if ( 'wugweb_alt' !== $col ) { return; }
		if ( ! wp_attachment_is_image( $post_id ) ) { echo '&mdash;'; return; }
		$alt = trim( (string) get_post_meta( $post_id, '_wp_attachment_image_alt', true ) );
		if ( '' !== $alt ) { echo esc_html( $alt ); return; }
		echo metadata_exists( 'post', $post_id, '_wp_attachment_image_alt' ) ? '<em>decorative (empty)</em>' : '<strong style="color:#b32d2e">missing</strong>';
	}, 10, 2 );
} );
