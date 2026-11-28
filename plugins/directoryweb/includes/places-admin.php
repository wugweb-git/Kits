<?php
/**
 * Place fields on Directory listings, inside the Address and place box (DIRECTORYWEB_PLACE_EDIT_TYPES; owner, 1 Nov 2026). Other place types (DIRECTORYWEB_PLACE_TYPES in
 * places.php) keep their stored place, found by auto-detect or set before; it is still read and counted.
 * State → District dropdowns built from the LGD file; a site can add a postal code lookup through the `directoryweb_place_box_postal_row` filter.
 * There is no place list in WP Admin and no way to type a place that is not in LGD. Codes that are not in the file
 * are not saved (a notice says so) and the item keeps its previous place.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Post types whose edit screen shows the Place fields (no side box: they are rendered in the Address and place box). */
const DIRECTORYWEB_PLACE_EDIT_TYPES = array( 'aw_listing' );

/** The box. */
function directoryweb_place_box( $post ) {
	list( $states, $districts ) = directoryweb_item_codes( $post->ID );
	$rows = array();
	foreach ( $districts as $c ) {
		$d = directoryweb_place_district( $c );
		if ( $d ) {
			$rows[ $d->state ] = $rows[ $d->state ] ?? array();
			$rows[ $d->state ][] = $d->code;
		}
	}
	foreach ( $states as $c ) {
		if ( ! isset( $rows[ $c ] ) ) {
			$rows[ $c ] = array( 0 );
		}
	}
	$pairs = array();
	foreach ( $rows as $s => $ds ) {
		foreach ( $ds as $d ) {
			$pairs[] = array( (int) $s, (int) $d );
		}
	}
	$first = $pairs ? array_shift( $pairs ) : array( 0, 0 );
	wp_nonce_field( 'aw_place_save', 'aw_place_nonce' );
	$pin  = (string) get_post_meta( $post->ID, 'aw_pincode', true );
	$city = (string) get_post_meta( $post->ID, 'aw_place_city', true );
	echo (string) apply_filters( 'directoryweb_place_box_postal_row', '<p><label for="aw-pin"><strong>' . esc_html__( 'Postal code', 'directoryweb' ) . '</strong></label><br><input type="text" id="aw-pin" name="aw_pincode" value="' . esc_attr( $pin ) . '" maxlength="12" style="width:8em"></p>', $pin ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts here or by the site layer
	echo '<p><label for="aw-state"><strong>State</strong></label><br><select id="aw-state" name="aw_state_code" style="width:100%"><option value="0">Choose a state</option>';
	foreach ( directoryweb_place_states() as $s ) {
		echo '<option value="' . (int) $s->code . '"' . selected( $first[0], $s->code, false ) . '>' . esc_html( $s->name ) . '</option>';
	}
	echo '</select></p>';
	echo '<p><label for="aw-district"><strong>District</strong></label><br><select id="aw-district" name="aw_district_code" style="width:100%"><option value="0">' . ( $first[0] ? 'Whole state' : 'Choose a state first' ) . '</option>';
	foreach ( directoryweb_place_states() as $s ) {
		echo '<optgroup label="' . esc_attr( $s->name ) . '" data-state="' . (int) $s->code . '"' . ( (int) $first[0] === $s->code ? '' : ' hidden disabled' ) . '>';
		foreach ( directoryweb_place_districts( $s->code ) as $d ) {
			echo '<option value="' . (int) $d->code . '"' . selected( $first[1], $d->code, false ) . '>' . esc_html( $d->name ) . '</option>';
		}
		echo '</optgroup>';
	}
	echo '</select></p>';
	if ( $pairs ) {
		echo '<p><strong>Also</strong></p><ul style="margin-top:0">';
		foreach ( $pairs as $p ) {
			$pl = $p[1] ? directoryweb_place_district( $p[1] ) : directoryweb_place_state( $p[0] );
			echo '<li><label><input type="checkbox" name="aw_place_more[]" value="' . esc_attr( $p[0] . ':' . $p[1] ) . '" checked> ' . esc_html( $pl ? ( $p[1] ? $pl->name . ', ' . directoryweb_place_state( $p[0] )->name : $pl->name ) : '' ) . '</label></li>';
		}
		echo '</ul><p class="description">Untick to remove.</p>';
	}
	echo '<p><label for="aw-city"><strong>Town or area</strong> <span class="description">(optional, shown only)</span></label><br><input type="text" id="aw-city" name="aw_place_city" value="' . esc_attr( $city ) . '" maxlength="80" style="width:100%" placeholder="Kottayam town"></p>';
	echo '<p class="description">States and districts: Local Government Directory, ' . esc_html( directoryweb_lgd()['version'] ) . '.</p>';
}

// On a listing the box is inside SCF's "Address and place" group (a message field); same markup, nonce and save.
add_action(
	'acf/render_field/key=field_aw_listing_msg_place',
	function () {
		$post = get_post();
		if ( $post && 'aw_listing' === $post->post_type ) {
			directoryweb_place_box( $post );
		}
	}
);

/** Save: codes must be in the LGD file, a district inside its state, a valid postal code. Otherwise nothing changes. */
add_action(
	'save_post',
	function ( $id, $post ) {
		if ( ! in_array( $post->post_type, DIRECTORYWEB_PLACE_TYPES, true ) || ! isset( $_POST['aw_place_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['aw_place_nonce'] ), 'aw_place_save' ) || ! current_user_can( 'edit_post', $id ) || wp_is_post_revision( $id ) ) {
			return;
		}
		$state    = absint( $_POST['aw_state_code'] ?? 0 );
		$district = absint( $_POST['aw_district_code'] ?? 0 );
		$places   = $state ? array( array( $state, $district ) ) : array();
		$more_raw = isset( $_POST['aw_place_more'] ) ? array_map( 'sanitize_text_field', (array) wp_unslash( $_POST['aw_place_more'] ) ) : array();
		foreach ( $more_raw as $more ) {
			$more  = sanitize_text_field( $more );
			$parts = array_map( 'absint', explode( ':', (string) $more ) );
			if ( ! empty( $parts[0] ) ) {
				$places[] = array( $parts[0], $parts[1] ?? 0 );
			}
		}
		$pin    = (string) apply_filters( 'directoryweb_postal_code_input', trim( sanitize_text_field( (string) wp_unslash( $_POST['aw_pincode'] ?? '' ) ) ) );
		$city   = sanitize_text_field( wp_unslash( $_POST['aw_place_city'] ?? '' ) );
		$before = directoryweb_item_codes( $id );
		if ( directoryweb_set_item_places( $id, $places, $pin, $city ) ) {
			if ( directoryweb_item_codes( $id ) !== $before ) { // The box posts the place it loaded with: only a change is an editor's choice.
				update_post_meta( $id, 'aw_place_source', 'editor' );
				delete_post_meta( $id, 'aw_place_auto' );
			}
		} else {
			set_transient( 'aw_place_error_' . get_current_user_id(), (string) apply_filters( 'directoryweb_place_error', 'Place not saved: choose the state and district from the lists, and give a valid postal code (or leave it empty). The previous place is kept.' ), 60 );
		}
	},
	20,
	2
);

add_action(
	'admin_notices',
	function () {
		$msg = get_transient( 'aw_place_error_' . get_current_user_id() );
		if ( $msg ) {
			delete_transient( 'aw_place_error_' . get_current_user_id() );
			wp_admin_notice( esc_html( $msg ), array( 'type' => 'error' ) );
		}
	}
);

add_action(
	'admin_print_footer_scripts-post.php',
	'directoryweb_place_box_js'
);
add_action(
	'admin_print_footer_scripts-post-new.php',
	'directoryweb_place_box_js'
);

/** District follows State. */
function directoryweb_place_box_js() {
	if ( ! in_array( get_post_type(), DIRECTORYWEB_PLACE_EDIT_TYPES, true ) ) {
		return;
	}
	ob_start();
	?>
(function () {
	var st = document.getElementById('aw-state'), di = document.getElementById('aw-district');
	if (!st || !di) { return; }
	function show() {
		var v = st.value;
		di.querySelectorAll('optgroup').forEach(function (g) { var on = g.dataset.state === v; g.hidden = !on; g.disabled = !on; });
		di.options[0].textContent = v !== '0' ? 'Whole state' : 'Choose a state first';
		var cur = di.selectedOptions[0];
		if (cur && cur.parentNode.tagName === 'OPTGROUP' && cur.parentNode.dataset.state !== v) { di.value = '0'; }
	}
	st.addEventListener('change', show);
})();
	<?php
	wp_register_script( 'directoryweb-place-box', false, array(), DIRECTORYWEB_VERSION, true );
	wp_enqueue_script( 'directoryweb-place-box' );
	wp_add_inline_script( 'directoryweb-place-box', (string) ob_get_clean() );
}
