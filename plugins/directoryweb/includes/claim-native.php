<?php
/**
 * Native listing claims: the standalone claim path, with no Fluent Forms and no Kits Core.
 *
 * A claim is a private `aw_claim` post (the type claims.php registers). Its state moves along a fixed table:
 *
 *   pending  -> approved | rejected | withdrawn
 *   approved -> revoked
 *   rejected -> pending   (re-opened for a second look)
 *   revoked  -> pending
 *   withdrawn: final
 *
 * Approving applies the ticked fields to the listing through aw_claim_apply_field() (the same writer the Fluent Forms
 * review uses, so Undo and the enrichment log behave the same) and marks the listing verified. Revoking takes the
 * verified mark back. The Fluent Forms path in claims-review.php is untouched; this one is used when there is no claim
 * form configured, or by REST.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const DW_CLAIM_TRANSITIONS = array(
	'pending'   => array( 'approved', 'rejected', 'withdrawn' ),
	'approved'  => array( 'revoked' ),
	'rejected'  => array( 'pending' ),
	'revoked'   => array( 'pending' ),
	'withdrawn' => array(),
);

/** Claim field => the DW_CLAIM_L key it maps to (what aw_claim_apply_field() understands). */
const DW_CLAIM_NATIVE_MAP = array(
	'phone'    => 'phones',
	'email'    => 'l_email',
	'website'  => 'l_website',
	'area'     => 'l_area',
	'about'    => 'l_about',
	'services' => 'l_services',
);

/** Pending claims one email may have open at a time, and sends per IP per hour. */
const DW_CLAIM_MAX_OPEN_PER_EMAIL = 3;
const DW_CLAIM_MAX_SENDS_PER_HOUR = 5;

/**
 * Whether a claim may move from one state to another.
 *
 * @param string $from Current state.
 * @param string $to   Wanted state.
 * @return bool
 */
function dw_claim_can_transition( string $from, string $to ): bool {
	return in_array( $to, DW_CLAIM_TRANSITIONS[ $from ] ?? array(), true );
}

/**
 * Clean and validate what a claimant sent. Pure: no WordPress state is read except the sanitising helpers.
 *
 * @param array $in Raw input: name, email, phone, role, show, notes, and the proposed phone, email, website, area, about, services.
 * @return array{ok:bool, errors:array<string,string>, person:array, propose:array}
 */
function dw_claim_validate( array $in ): array {
	$errors = array();
	$name   = trim( sanitize_text_field( (string) ( $in['name'] ?? '' ) ) );
	$email  = (string) sanitize_email( (string) ( $in['email'] ?? '' ) );
	$phone  = trim( sanitize_text_field( (string) ( $in['phone'] ?? '' ) ) );
	$role   = (string) ( $in['role'] ?? '' );
	if ( '' === $name || strlen( $name ) > 120 ) {
		$errors['name'] = 'Enter your name.';
	}
	if ( '' === $email || ! is_email( $email ) ) {
		$errors['email'] = 'Enter an email address we can reach you on.';
	}
	if ( '' !== $phone && ! aw_claim_phone_ok( $phone ) ) {
		$errors['phone'] = 'That does not look like a phone number.';
	}
	if ( ! array_key_exists( $role, DW_CLAIM_ROLES ) || '' === $role ) {
		$errors['role'] = 'Choose how you are connected to this listing.';
	}
	$propose = array();
	foreach ( array( 'phone', 'email', 'website', 'area', 'about' ) as $f ) {
		$raw = trim( (string) ( $in[ 'l_' . $f ] ?? '' ) );
		if ( '' === $raw ) {
			continue;
		}
		if ( 'phone' === $f ) {
			if ( ! aw_claim_phone_ok( $raw ) ) {
				$errors['l_phone'] = 'That does not look like a phone number.';
				continue;
			}
			$propose[ $f ] = sanitize_text_field( $raw );
			continue;
		}
		$meta = array(
			'email'   => 'aw_email',
			'website' => 'aw_website',
		)[ $f ] ?? '';
		$val  = '' !== $meta ? aw_claim_clean( $meta, $raw ) : sanitize_textarea_field( $raw );
		if ( '' === $val ) {
			$errors[ 'l_' . $f ] = 'We could not use that value.';
			continue;
		}
		$max = 'about' === $f ? 2000 : 300;
		if ( strlen( $val ) > $max ) {
			$errors[ 'l_' . $f ] = 'That is too long.';
			continue;
		}
		$propose[ $f ] = $val;
	}
	$services = array_intersect( array_map( 'sanitize_key', (array) ( $in['l_services'] ?? array() ) ), array_keys( DIRECTORYWEB_SERVICES ) );
	if ( $services ) {
		sort( $services );
		$propose['services'] = implode( ',', $services );
	}
	if ( ! $propose ) {
		$errors['propose'] = 'Say what should change on the listing.';
	}
	return array(
		'ok'      => ! $errors,
		'errors'  => $errors,
		'person'  => array(
			'name'  => $name,
			'email' => $email,
			'phone' => $phone,
			'role'  => $role,
			'show'  => ! empty( $in['show'] ),
			'notes' => mb_substr( trim( sanitize_textarea_field( (string) ( $in['notes'] ?? '' ) ) ), 0, 1000 ),
		),
		'propose' => $propose,
	);
}

/**
 * Create a pending claim.
 *
 * @param int   $listing aw_listing post ID (must be published).
 * @param array $input   See dw_claim_validate().
 * @return int|WP_Error New aw_claim ID.
 */
function dw_claim_create( int $listing, array $input ) {
	if ( 'aw_listing' !== get_post_type( $listing ) || 'publish' !== get_post_status( $listing ) ) {
		return new WP_Error( 'dw_claim_listing', 'That listing cannot be claimed.', array( 'status' => 404 ) );
	}
	$v = dw_claim_validate( $input );
	if ( ! $v['ok'] ) {
		return new WP_Error( 'dw_claim_invalid', 'Some details need another look.', array( 'status' => 422, 'errors' => $v['errors'] ) );
	}
	$open = get_posts(
		array(
			'post_type'      => 'aw_claim',
			'post_status'    => 'private',
			'posts_per_page' => DW_CLAIM_MAX_OPEN_PER_EMAIL,
			'fields'         => 'ids',
			'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery
				array( 'key' => '_dw_claim_status', 'value' => 'pending' ),
				array( 'key' => '_dw_claim_email', 'value' => strtolower( $v['person']['email'] ) ),
			),
		)
	);
	if ( count( $open ) >= DW_CLAIM_MAX_OPEN_PER_EMAIL ) {
		return new WP_Error( 'dw_claim_limit', 'You already have claims waiting for review. We will be in touch.', array( 'status' => 429 ) );
	}
	foreach ( $open as $oid ) {
		if ( (int) get_post_meta( $oid, '_dw_claim_listing', true ) === $listing ) {
			return new WP_Error( 'dw_claim_duplicate', 'You already have a claim waiting for this listing.', array( 'status' => 409 ) );
		}
	}
	$id = wp_insert_post(
		array(
			'post_type'   => 'aw_claim',
			'post_status' => 'private',
			'post_title'  => sprintf( 'Claim: %s by %s', get_the_title( $listing ), $v['person']['name'] ),
		),
		true
	);
	if ( is_wp_error( $id ) ) {
		return $id;
	}
	update_post_meta( $id, '_dw_claim_listing', $listing );
	update_post_meta( $id, '_dw_claim_status', 'pending' );
	update_post_meta( $id, '_dw_claim_email', strtolower( $v['person']['email'] ) );
	update_post_meta( $id, '_dw_claim_person', wp_json_encode( $v['person'] ) );
	update_post_meta( $id, '_dw_claim_propose', wp_json_encode( $v['propose'] ) );
	dw_claim_log( $id, 'created', 'pending', 0, '' );
	do_action( 'directoryweb_claim_created', $id, $listing );
	return (int) $id;
}

/**
 * Append to a claim's history.
 *
 * @param int    $id    aw_claim ID.
 * @param string $event What happened.
 * @param string $state State after.
 * @param int    $by    User ID (0 = the claimant).
 * @param string $note  Reviewer note.
 */
function dw_claim_log( int $id, string $event, string $state, int $by, string $note ): void {
	$h   = (array) json_decode( (string) get_post_meta( $id, '_dw_claim_history', true ), true );
	$h[] = array( 'at' => current_time( 'mysql' ), 'event' => $event, 'state' => $state, 'by' => $by, 'note' => mb_substr( $note, 0, 500 ) );
	update_post_meta( $id, '_dw_claim_history', wp_json_encode( array_slice( $h, -50 ) ) );
}

/**
 * One native claim as an array, or null.
 *
 * @param int $id aw_claim ID.
 * @return array|null
 */
function dw_claim_get( int $id ): ?array {
	if ( 'aw_claim' !== get_post_type( $id ) || '' === (string) get_post_meta( $id, '_dw_claim_status', true ) ) {
		return null; // not a native claim (Fluent Forms-era claims have no _dw_claim_status)
	}
	return array(
		'id'      => $id,
		'listing' => (int) get_post_meta( $id, '_dw_claim_listing', true ),
		'status'  => (string) get_post_meta( $id, '_dw_claim_status', true ),
		'person'  => (array) json_decode( (string) get_post_meta( $id, '_dw_claim_person', true ), true ),
		'propose' => (array) json_decode( (string) get_post_meta( $id, '_dw_claim_propose', true ), true ),
		'history' => (array) json_decode( (string) get_post_meta( $id, '_dw_claim_history', true ), true ),
	);
}

/**
 * Move a claim to a new state, applying the listing changes the move implies.
 *
 * @param int      $id     aw_claim ID.
 * @param string   $to     New state.
 * @param int      $by     Reviewer user ID.
 * @param string   $note   Reviewer note.
 * @param string[] $fields Claim fields to apply on approval (default: all proposed).
 * @return true|WP_Error
 */
function dw_claim_transition( int $id, string $to, int $by, string $note = '', ?array $fields = null ) {
	$c = dw_claim_get( $id );
	if ( ! $c ) {
		return new WP_Error( 'dw_claim_missing', 'No such claim.', array( 'status' => 404 ) );
	}
	if ( ! dw_claim_can_transition( $c['status'], $to ) ) {
		return new WP_Error( 'dw_claim_state', sprintf( 'A %s claim cannot become %s.', $c['status'], $to ), array( 'status' => 409 ) );
	}
	$lid = $c['listing'];
	if ( 'aw_listing' !== get_post_type( $lid ) ) {
		return new WP_Error( 'dw_claim_listing', 'The listing no longer exists.', array( 'status' => 409 ) );
	}
	$applied = array();
	if ( 'approved' === $to ) {
		$entry = array( 'id' => $id, 'listing' => $lid, 'propose' => array(), 'logo' => '', 'photos' => array() );
		foreach ( $c['propose'] as $field => $value ) {
			if ( isset( DW_CLAIM_NATIVE_MAP[ $field ] ) ) {
				$entry['propose'][ DW_CLAIM_NATIVE_MAP[ $field ] ] = (string) $value;
			}
		}
		$want = null === $fields ? array_keys( $c['propose'] ) : array_values( array_intersect( array_map( 'sanitize_key', $fields ), array_keys( $c['propose'] ) ) );
		foreach ( $want as $field ) {
			if ( isset( DW_CLAIM_NATIVE_MAP[ $field ] ) && aw_claim_apply_field( $entry, DW_CLAIM_NATIVE_MAP[ $field ] ) ) {
				$applied[] = $field;
			}
		}
		delete_post_meta( $lid, 'aw_unverified' );
		update_post_meta( $lid, 'aw_verified', true );
		update_post_meta( $lid, 'aw_verified_on', wp_date( 'Y-m-d' ) );
		update_post_meta( $lid, 'aw_needs_reverify', false );
		update_post_meta( $id, '_dw_claim_applied', wp_json_encode( $applied ) );
		delete_transient( 'aw_verified_count' );
		if ( ! empty( $c['person']['email'] ) && function_exists( 'aw_org_people_link' ) ) {
			aw_org_people_link( $lid, $c['person']['email'], DW_CLAIM_ROLES[ $c['person']['role'] ?? '' ] ?? '', ! empty( $c['person']['show'] ) );
		}
		if ( function_exists( 'aw_enrich_after_change' ) ) {
			aw_enrich_after_change( $lid );
		}
	}
	if ( 'revoked' === $to ) {
		update_post_meta( $lid, 'aw_verified', false );
		update_post_meta( $lid, 'aw_needs_reverify', true );
		delete_transient( 'aw_verified_count' );
	}
	update_post_meta( $id, '_dw_claim_status', $to );
	dw_claim_log( $id, 'moved', $to, $by, $note );
	delete_transient( 'directoryweb_claim_rows' );
	do_action( 'directoryweb_claim_transitioned', $id, $c['status'], $to, $applied );
	return true;
}

/* ---------- Front-end form ---------- */

/**
 * The native claim form for a listing (shown by directoryweb_ff_form() when no Fluent Forms form is set up).
 *
 * @param int $listing Listing ID.
 * @return string
 */
function dw_claim_native_form( int $listing ): string {
	if ( 'aw_listing' !== get_post_type( $listing ) ) {
		return '';
	}
	$sent = isset( $_GET['dw_claim'] ) ? sanitize_key( wp_unslash( $_GET['dw_claim'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	if ( 'sent' === $sent ) {
		return '<div class="aw-claim-done" role="status"><p>' . esc_html__( 'Thank you. Your claim was received and will be reviewed by our team.', 'directoryweb' ) . '</p></div>';
	}
	$err = '';
	if ( 'error' === $sent && isset( $_GET['msg'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		$err = '<p class="aw-claim-error" role="alert">' . esc_html( sanitize_text_field( rawurldecode( wp_unslash( $_GET['msg'] ) ) ) ) . '</p>'; // phpcs:ignore WordPress.Security.NonceVerification
	}
	$out  = '<form class="aw-claim-form" method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . $err;
	$out .= '<input type="hidden" name="action" value="dw_claim_submit"><input type="hidden" name="listing" value="' . (int) $listing . '">';
	$out .= wp_nonce_field( 'dw_claim_submit_' . $listing, '_dw_nonce', true, false );
	$out .= '<p class="aw-hp" style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave empty <input type="text" name="dw_website_hp" tabindex="-1" autocomplete="off"></label></p>';
	$field = static function ( $name, $label, $type = 'text', $req = false ) {
		return '<p><label>' . esc_html( $label ) . '<input type="' . esc_attr( $type ) . '" name="' . esc_attr( $name ) . '"' . ( $req ? ' required' : '' ) . '></label></p>';
	};
	$out .= $field( 'name', __( 'Your name', 'directoryweb' ), 'text', true ) . $field( 'email', __( 'Your email', 'directoryweb' ), 'email', true ) . $field( 'phone', __( 'Your phone (optional)', 'directoryweb' ), 'tel' );
	$out .= '<p><label>' . esc_html__( 'Your connection to this organisation', 'directoryweb' ) . '<select name="role" required>';
	foreach ( DW_CLAIM_ROLES as $k => $label ) {
		$out .= '<option value="' . esc_attr( $k ) . '">' . esc_html( $label ) . '</option>';
	}
	$out .= '</select></label></p>';
	$out .= '<fieldset><legend>' . esc_html__( 'What should the listing say?', 'directoryweb' ) . '</legend>';
	$out .= $field( 'l_phone', __( 'Phone', 'directoryweb' ), 'tel' ) . $field( 'l_email', __( 'Public email', 'directoryweb' ), 'email' ) . $field( 'l_website', __( 'Website', 'directoryweb' ), 'url' ) . $field( 'l_area', __( 'Area or locality', 'directoryweb' ) );
	$out .= '<p><label>' . esc_html__( 'About', 'directoryweb' ) . '<textarea name="l_about" rows="4" maxlength="2000"></textarea></label></p>';
	foreach ( DIRECTORYWEB_SERVICES as $slug => $label ) {
		$out .= '<label class="aw-claim-svc"><input type="checkbox" name="l_services[]" value="' . esc_attr( $slug ) . '"> ' . esc_html( is_array( $label ) ? ( $label[0] ?? $slug ) : $label ) . '</label> ';
	}
	$out .= '</fieldset>';
	$out .= '<p><label><input type="checkbox" name="show" value="1"> ' . esc_html__( 'Show my name on the listing', 'directoryweb' ) . '</label></p>';
	$out .= '<p><label>' . esc_html__( 'Anything else we should know', 'directoryweb' ) . '<textarea name="notes" rows="3" maxlength="1000"></textarea></label></p>';
	$out .= '<p><button type="submit">' . esc_html__( 'Send claim', 'directoryweb' ) . '</button></p></form>';
	return $out;
}

/** Where to send the claimant back to, with a result flag. */
function dw_claim_back( int $listing, string $flag, string $msg = '' ): void {
	$ref = wp_get_referer();
	$url = $ref ? $ref : ( $listing ? get_permalink( $listing ) : home_url( '/' ) );
	$url = add_query_arg( array_filter( array( 'dw_claim' => $flag, 'msg' => '' !== $msg ? rawurlencode( $msg ) : '' ) ), remove_query_arg( array( 'dw_claim', 'msg' ), $url ) );
	wp_safe_redirect( $url . '#claim' );
	exit;
}

/** Handle the native claim form post (logged in or not). */
function dw_claim_handle_submit(): void {
	$listing = absint( wp_unslash( $_POST['listing'] ?? 0 ) );
	if ( ! isset( $_POST['_dw_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_dw_nonce'] ) ), 'dw_claim_submit_' . $listing ) ) {
		dw_claim_back( $listing, 'error', 'The form expired. Reload the page and try again.' );
	}
	if ( '' !== trim( (string) wp_unslash( $_POST['dw_website_hp'] ?? '' ) ) ) {
		dw_claim_back( $listing, 'sent' ); // a bot filled the hidden field: look successful, store nothing
	}
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	$key = 'dw_claim_rl_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= DW_CLAIM_MAX_SENDS_PER_HOUR ) {
		dw_claim_back( $listing, 'error', 'Too many claims from this connection. Try again later.' );
	}
	set_transient( $key, $n + 1, HOUR_IN_SECONDS );
	$res = dw_claim_create( $listing, wp_unslash( $_POST ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- dw_claim_validate() sanitises every field
	if ( is_wp_error( $res ) ) {
		$errs = (array) ( $res->get_error_data()['errors'] ?? array() );
		dw_claim_back( $listing, 'error', $errs ? implode( ' ', $errs ) : $res->get_error_message() );
	}
	dw_claim_back( $listing, 'sent' );
}
add_action( 'admin_post_nopriv_dw_claim_submit', 'dw_claim_handle_submit' );
add_action( 'admin_post_dw_claim_submit', 'dw_claim_handle_submit' );

/* ---------- Admin: decide on the claim's edit screen ---------- */

add_action(
	'add_meta_boxes_aw_claim',
	function ( $post ) {
		if ( '' !== (string) get_post_meta( $post->ID, '_dw_claim_status', true ) ) {
			remove_meta_box( 'aw_claim_review', 'aw_claim', 'normal' ); // the old-form box reads aw_c_* meta a native claim does not have
			add_meta_box( 'dw_claim_native', __( 'Claim review', 'directoryweb' ), 'dw_claim_metabox', 'aw_claim', 'normal', 'high' );
		}
	},
	20
);

add_action(
	'manage_aw_claim_posts_custom_column',
	function ( $col, $id ) {
		$c = dw_claim_get( (int) $id );
		if ( ! $c ) {
			return;
		}
		if ( 'aw_status' === $col ) {
			echo esc_html( ucfirst( $c['status'] ) );
		} elseif ( 'aw_changes' === $col ) {
			echo esc_html( $c['propose'] ? implode( ', ', array_keys( $c['propose'] ) ) : __( 'Notes only', 'directoryweb' ) );
		}
	},
	11,
	2
);

/** Button words for each move. */
const DW_CLAIM_MOVE_LABELS = array(
	'approved' => 'Approve',
	'rejected' => 'Reject',
	'revoked'  => 'Revoke approval',
	'pending'  => 'Re-open',
);

/** The claim review box: who, what they propose against what the listing says now, state, history, and the moves allowed. */
function dw_claim_metabox( $post ): void {
	$c = dw_claim_get( (int) $post->ID );
	if ( ! $c ) {
		echo '<p>' . esc_html__( 'This claim came from a form entry. Review it under Directory → Claims.', 'directoryweb' ) . '</p>';
		return;
	}
	echo '<p><strong>' . esc_html( $c['person']['name'] ?? '' ) . '</strong> (' . esc_html( DW_CLAIM_ROLES[ $c['person']['role'] ?? '' ] ?? '' ) . ') &middot; ' . esc_html( $c['person']['email'] ?? '' ) . '</p>';
	echo '<p>' . esc_html__( 'Listing:', 'directoryweb' ) . ' <a href="' . esc_url( get_edit_post_link( $c['listing'] ) ) . '">' . esc_html( get_the_title( $c['listing'] ) ) . '</a> &middot; ' . esc_html__( 'State:', 'directoryweb' ) . ' <strong>' . esc_html( $c['status'] ) . '</strong></p>';
	echo '<table class="widefat"><thead><tr><th>' . esc_html__( 'Field', 'directoryweb' ) . '</th><th>' . esc_html__( 'Now', 'directoryweb' ) . '</th><th>' . esc_html__( 'Proposed', 'directoryweb' ) . '</th></tr></thead><tbody>';
	foreach ( $c['propose'] as $f => $v ) {
		$now = isset( DW_CLAIM_NATIVE_MAP[ $f ] ) ? aw_claim_now( $c['listing'], DW_CLAIM_NATIVE_MAP[ $f ], false ) : '';
		echo '<tr><td>' . esc_html( isset( DW_CLAIM_NATIVE_MAP[ $f ] ) && isset( DW_CLAIM_L[ DW_CLAIM_NATIVE_MAP[ $f ] ] ) ? DW_CLAIM_L[ DW_CLAIM_NATIVE_MAP[ $f ] ][0] : $f ) . '</td><td>' . esc_html( (string) $now ) . '</td><td>' . esc_html( (string) $v ) . '</td></tr>';
	}
	echo '</tbody></table>';
	$moves = DW_CLAIM_TRANSITIONS[ $c['status'] ] ?? array();
	foreach ( $moves as $m ) {
		if ( 'withdrawn' === $m ) {
			continue; // the claimant withdraws; a reviewer approves or rejects
		}
		$url = wp_nonce_url( admin_url( 'admin-post.php?action=dw_claim_decide&claim=' . (int) $c['id'] . '&to=' . $m ), 'dw_claim_decide_' . $c['id'] . '_' . $m );
		echo '<a class="button' . ( 'approved' === $m ? ' button-primary' : '' ) . '" href="' . esc_url( $url ) . '">' . esc_html( DW_CLAIM_MOVE_LABELS[ $m ] ?? ucfirst( $m ) ) . '</a> ';
	}
	if ( $c['history'] ) {
		echo '<h4>' . esc_html__( 'History', 'directoryweb' ) . '</h4><ul>';
		foreach ( $c['history'] as $h ) {
			echo '<li>' . esc_html( ( $h['at'] ?? '' ) . ' - ' . ( $h['event'] ?? '' ) . ' -> ' . ( $h['state'] ?? '' ) ) . '</li>';
		}
		echo '</ul>';
	}
}

add_action(
	'admin_post_dw_claim_decide',
	function () {
		$id = absint( $_GET['claim'] ?? 0 );
		$to = sanitize_key( $_GET['to'] ?? '' );
		if ( ! current_user_can( DIRECTORYWEB_CAP ) || ! check_admin_referer( 'dw_claim_decide_' . $id . '_' . $to ) ) { // phpcs:ignore WordPress.WP.Capabilities.Unknown
			wp_die( 'Not allowed.', 403 );
		}
		if ( 'withdrawn' === $to ) {
			wp_die( 'Only the claimant can withdraw.', 400 );
		}
		$res = dw_claim_transition( $id, $to, get_current_user_id() );
		if ( is_wp_error( $res ) ) {
			wp_die( esc_html( $res->get_error_message() ), (int) ( $res->get_error_data()['status'] ?? 400 ) );
		}
		wp_safe_redirect( get_edit_post_link( $id, 'raw' ) );
		exit;
	}
);

/* ---------- REST: POST directoryweb/v1/claims/<id>/transition ---------- */

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'directoryweb/v1',
			'/claims/(?P<id>\d+)/transition',
			array(
				'methods'             => 'POST',
				'permission_callback' => directoryweb_rest_can( DIRECTORYWEB_CAP ),
				'args'                => array(
					'to'     => array( 'required' => true, 'type' => 'string', 'enum' => array( 'approved', 'rejected', 'revoked', 'pending' ) ),
					'note'   => array( 'type' => 'string', 'default' => '' ),
					'fields' => array( 'type' => 'array', 'items' => array( 'type' => 'string' ) ),
				),
				'callback'            => function ( WP_REST_Request $r ) {
					$fields = $r->get_param( 'fields' );
					$res    = dw_claim_transition( (int) $r['id'], (string) $r['to'], get_current_user_id(), sanitize_text_field( (string) $r['note'] ), is_array( $fields ) ? $fields : null );
					if ( is_wp_error( $res ) ) {
						return $res;
					}
					return rest_ensure_response( dw_claim_get( (int) $r['id'] ) );
				},
			)
		);
	}
);

/* ---------- Emails (plain text, through wp_mail) ---------- */

/**
 * Whether claim emails go out: the site's "Emails from forms and claims" switch (option aw_ff_send_email, off by
 * default), so a native claim obeys the same setting as the Fluent Forms claims. wp_mail() is used, so MailWeb (or
 * any SMTP plugin) carries the message when it is active; nothing here depends on MailWeb.
 *
 * @return bool
 */
function dw_claim_mail_on(): bool {
	return (bool) apply_filters( 'directoryweb_claim_mail_enabled', '1' === (string) get_option( 'aw_ff_send_email', '0' ) );
}

/**
 * Send one claim email. A header-safe subject, plain-text body, no tracking.
 *
 * @param string $to      Recipient.
 * @param string $subject Subject.
 * @param string $body    Body.
 * @return bool
 */
function dw_claim_mail( string $to, string $subject, string $body ): bool {
	if ( ! dw_claim_mail_on() || ! is_email( $to ) ) {
		return false;
	}
	$subject = trim( preg_replace( '/[\r\n]+/', ' ', wp_strip_all_tags( $subject ) ) );
	return (bool) wp_mail( $to, $subject, $body );
}

add_action(
	'directoryweb_claim_created',
	function ( $id, $listing ) {
		$c = dw_claim_get( (int) $id );
		if ( ! $c ) {
			return;
		}
		$name  = (string) ( $c['person']['name'] ?? '' );
		$title = html_entity_decode( get_the_title( (int) $listing ), ENT_QUOTES, 'UTF-8' );
		dw_claim_mail(
			(string) ( $c['person']['email'] ?? '' ),
			sprintf( 'We received your claim for %s', $title ),
			sprintf( "Hello %s,\n\nWe received your claim for \"%s\". Our team will review it and write to you with the result. Nothing on the listing changes until then.\n", $name, $title )
		);
		dw_claim_mail(
			(string) apply_filters( 'directoryweb_claim_notify_to', get_option( 'admin_email' ) ),
			sprintf( 'New listing claim: %s', $title ),
			sprintf( "%s (%s) claimed \"%s\".\n\nReview it: %s\n", $name, (string) ( $c['person']['email'] ?? '' ), $title, (string) get_edit_post_link( (int) $id, 'raw' ) )
		);
	},
	10,
	2
);

add_action(
	'directoryweb_claim_transitioned',
	function ( $id, $from, $to ) {
		$words = array(
			'approved' => 'was approved. The changes you asked for are now on the listing and it is marked verified.',
			'rejected' => 'was not approved. Reply to this email if you think this is a mistake.',
			'revoked'  => 'is no longer approved. The listing is marked for re-verification.',
		);
		if ( ! isset( $words[ $to ] ) ) {
			return; // re-opening a claim is internal: the claimant is not told
		}
		$c = dw_claim_get( (int) $id );
		if ( ! $c ) {
			return;
		}
		$title = html_entity_decode( get_the_title( (int) $c['listing'] ), ENT_QUOTES, 'UTF-8' );
		dw_claim_mail(
			(string) ( $c['person']['email'] ?? '' ),
			sprintf( 'Your claim for %s', $title ),
			sprintf( "Hello %s,\n\nYour claim for \"%s\" %s\n", (string) ( $c['person']['name'] ?? '' ), $title, $words[ $to ] )
		);
	},
	10,
	3
);
