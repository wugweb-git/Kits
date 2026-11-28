<?php
/**
 * Edit fields for values that only WP-CLI could change before. Core form tables and meta box markup, no custom CSS; each value keeps its key and stored shape,
 * and a Save with no change writes nothing.
 *
 * - Category → Edit: Card image (term meta aw_category_card, media.php) and Pinned Resources (aw_pinned, one row per
 *   post ID, pages.php).
 * - Linked campaigns → Edit: Short name (term meta aw_short_name; the older key aw_campaign_short is read when it is
 *   empty, hub-blocks.php).
 * The Library "Dated" and campaign "Metrics" fields moved to the site layer in Kits Core 1.4.1
 * (the site layer's includes/edit-fields.php); Kits Core no longer names those types or keys.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------- Category: card image and pinned Resources ---------- */

add_action(
	'category_edit_form_fields',
	function ( $term ) {
		wp_nonce_field( 'kits_edit_fields_cat', 'kits_edit_fields_cat_nonce' );
		$card = (int) get_term_meta( $term->term_id, 'aw_category_card', true );
		$pins = array_map( 'intval', (array) get_term_meta( $term->term_id, 'aw_pinned', false ) );
		printf(
			'<tr class="form-field"><th scope="row"><label for="aw_category_card">%1$s</label></th><td><input type="number" min="0" class="small-text" id="aw_category_card" name="aw_category_card" value="%2$s" aria-describedby="aw_category_card-help"> %3$s<p class="description" id="aw_category_card-help">%4$s</p></td></tr>',
			esc_html( 'Card image' ),
			esc_attr( $card ? (string) $card : '' ),
			$card ? wp_kses_post( wp_get_attachment_image( $card, array( 60, 34 ) ) ) : '',
			esc_html( 'Optional. Media ID of the picture cards in this category use when an item has none of its own. Empty: the category image.' )
		);
		printf(
			'<tr class="form-field"><th scope="row"><label for="aw_pinned">%1$s</label></th><td><input type="text" class="regular-text" id="aw_pinned" name="aw_pinned" value="%2$s" aria-describedby="aw_pinned-help"><p class="description" id="aw_pinned-help">%3$s</p></td></tr>',
			esc_html( 'Pinned Resources' ),
			esc_attr( implode( ', ', $pins ) ),
			esc_html( 'Resource IDs, comma separated, in order: shown first in this category\'s Resources (up to six). Only published Resources show.' )
		);
	},
	15
);

add_action(
	'edited_category',
	function ( $term_id ) {
		if ( ! isset( $_POST['kits_edit_fields_cat_nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['kits_edit_fields_cat_nonce'] ) ), 'kits_edit_fields_cat' ) || ! current_user_can( 'manage_categories' ) ) {
			return;
		}
		$card = absint( wp_unslash( $_POST['aw_category_card'] ?? 0 ) );
		$now  = (int) get_term_meta( $term_id, 'aw_category_card', true );
		if ( $card !== $now ) {
			$card && wp_attachment_is_image( $card ) ? update_term_meta( $term_id, 'aw_category_card', $card ) : delete_term_meta( $term_id, 'aw_category_card' );
		}
		$pins = array_values( array_unique( array_filter( array_map( 'absint', preg_split( '/[\s,]+/', sanitize_text_field( wp_unslash( $_POST['aw_pinned'] ?? '' ) ) ) ) ) ) );
		$pins = array_values( array_filter( $pins, fn( $p ) => 'post' === get_post_type( $p ) ) );
		if ( array_map( 'intval', (array) get_term_meta( $term_id, 'aw_pinned', false ) ) !== $pins ) {
			delete_term_meta( $term_id, 'aw_pinned' );
			foreach ( $pins as $p ) {
				add_term_meta( $term_id, 'aw_pinned', $p );
			}
		}
	}
);

/* ---------- Linked campaigns: short name ---------- */

// The hook named after the site's linked-campaign taxonomy is added once the tenant has named it (KITS_CAMPAIGN_LINK is
// set while the plugins load). The Library "Dated" and campaign "Metrics" fields are the site layer's since Kits Core 1.4.1.
add_action(
	'init',
	function () {
		if ( defined( 'KITS_CAMPAIGN_LINK' ) && '' !== (string) KITS_CAMPAIGN_LINK ) {
			add_action( KITS_CAMPAIGN_LINK . '_edit_form_fields', 'kits_edit_fields_camp_field', 5 );
			add_action( 'edited_' . KITS_CAMPAIGN_LINK, 'kits_edit_fields_camp_save' );
		}
	},
	1
);

/**
 * Linked campaigns → Edit: the Short name field.
 *
 * @param WP_Term $term Term.
 */
function kits_edit_fields_camp_field( $term ): void {
		wp_nonce_field( 'kits_edit_fields_camp', 'kits_edit_fields_camp_nonce' );
		printf(
			'<tr class="form-field"><th scope="row"><label for="aw_term_short_name">%1$s</label></th><td><input type="text" id="aw_term_short_name" name="aw_term_short_name" value="%2$s" aria-describedby="aw_term_short_name-help"><p class="description" id="aw_term_short_name-help">%3$s</p></td></tr>',
			esc_html( 'Short name' ),
			esc_attr( kits_edit_fields_term_short( $term->term_id ) ),
			esc_html( 'The campaign\'s name on chips and in emails about its items. Empty: the full name.' )
		);
}

/**
 * A linked campaign's short name as the site reads it: aw_short_name, else the older aw_campaign_short.
 *
 * @param int $term_id Term ID.
 */
function kits_edit_fields_term_short( $term_id ): string {
	$short = (string) get_term_meta( $term_id, 'aw_short_name', true );
	return '' !== $short ? $short : (string) get_term_meta( $term_id, 'aw_campaign_short', true );
}

/**
 * Linked campaigns → Edit: saves the Short name.
 *
 * @param int $term_id Term ID.
 */
function kits_edit_fields_camp_save( $term_id ): void {
	if ( ! isset( $_POST['kits_edit_fields_camp_nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['kits_edit_fields_camp_nonce'] ) ), 'kits_edit_fields_camp' ) || ! current_user_can( 'manage_categories' ) ) {
		return;
	}
		$v = sanitize_text_field( wp_unslash( $_POST['aw_term_short_name'] ?? '' ) );
	if ( kits_edit_fields_term_short( $term_id ) === $v ) {
		return; // unchanged: neither key is touched.
	}
	if ( '' === $v ) {
		delete_term_meta( $term_id, 'aw_short_name' );
		delete_term_meta( $term_id, 'aw_campaign_short' ); // emptied on purpose: the full name shows.
		return;
	}
		update_term_meta( $term_id, 'aw_short_name', $v ); // read before the older key.
}
