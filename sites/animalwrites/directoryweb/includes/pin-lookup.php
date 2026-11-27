<?php
/**
 * The Indian PIN code lookup (India Post, api.postalpincode.in), moved out of DirectoryWeb 1.3.0 unchanged: PIN → State
 * and District, the public and editor AJAX handlers, the district that most listings with a PIN store, and (below) the
 * hooks that put the PIN back into DirectoryWeb's Place box, search box, Near me and storage rules.
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------- PIN code → State and District (India Post, matched to LGD) ---------- */

/**
 * Whether the outside PIN code lookup (India Post, api.postalpincode.in) may be called. Off by default: a generic
 * directory has no use for Indian PIN codes and sends nothing to that service. A site that wants it (animalwrites.in)
 * returns true from the `directoryweb_pin_lookup_enabled` filter.
 */
function directoryweb_pin_lookup_enabled(): bool {
	return (bool) apply_filters( 'directoryweb_pin_lookup_enabled', false );
}

/**
 * Look up a PIN code: India Post gives the post office's district and state names; they are matched to the LGD file.
 * Returns [state, district, state_slug, district_slug, state_name, district_name, note] or an error message.
 *
 * @param string $pin PIN code.
 * @return array|string
 */
function directoryweb_pin_lookup( $pin ) {
	$pin = preg_replace( '/\D/', '', (string) $pin );
	if ( ! preg_match( '/^[1-9]\d{5}$/', $pin ) ) {
		return 'Enter a 6-digit PIN code, like 682011';
	}
	if ( ! directoryweb_pin_lookup_enabled() ) {
		return 'PIN code lookup is not switched on for this site. Choose your state and district instead.';
	}
	$data = get_transient( 'aw_pin_' . $pin );
	if ( false === $data ) {
		$r = wp_remote_get( 'https://api.postalpincode.in/pincode/' . $pin, array( 'timeout' => 8 ) );
		if ( is_wp_error( $r ) || 200 !== wp_remote_retrieve_response_code( $r ) ) {
			return 'Couldn\'t find this PIN. Choose your state and district instead.';
		}
		$data = json_decode( wp_remote_retrieve_body( $r ), true );
		set_transient( 'aw_pin_' . $pin, $data, WEEK_IN_SECONDS );
	}
	$po       = $data[0]['PostOffice'][0] ?? null;
	$state    = $po ? directoryweb_place_state_by_name( (string) ( $po['State'] ?? '' ) ) : null;
	$district = $state ? directoryweb_place_district_by_name( (string) ( $po['District'] ?? '' ), $state ) : null;
	if ( ! $state ) {
		return 'Couldn\'t find this PIN. Choose your state and district instead.';
	}
	return array(
		'state'         => $state->code,
		'district'      => $district ? $district->code : 0,
		'state_slug'    => $state->slug,
		'district_slug' => $district ? $district->slug : '',
		'state_name'    => $state->name,
		'district_name' => $district ? $district->name : '',
		'note'          => $district ? '' : 'Choose your district.',
	);
}

// The same lookup for public forms (volunteer, claim): no login, a few per minute per visitor.
add_action( 'wp_ajax_nopriv_aw_pin', 'directoryweb_pin_public' );
add_action( 'wp_ajax_aw_pin', 'directoryweb_pin_public' );
function directoryweb_pin_public() {
	nocache_headers();
	$key = 'aw_pin_rl_' . md5( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
	$n   = (int) get_transient( $key );
	if ( $n >= 30 ) {
		wp_send_json_error( 'Too many tries. Wait a minute, then try again.' );
	}
	set_transient( $key, $n + 1, 10 * MINUTE_IN_SECONDS );
	$r = directoryweb_pin_lookup( sanitize_text_field( (string) wp_unslash( $_GET['pin'] ?? '' ) ) ); // phpcs:ignore WordPress.Security.NonceVerification
	is_array( $r ) ? wp_send_json_success( $r ) : wp_send_json_error( $r );
}


/**
 * The district most of the published listings with a PIN code store: the exact PIN first, then the PINs that share
 * its first three digits (India Post's sorting district). Null when no listing stores such a PIN.
 *
 * @param string $pin 6-digit PIN code.
 * @return object|null
 */
function directoryweb_pin_nearest_district( $pin ) {
	global $wpdb;
	$pin = preg_replace( '/\D/', '', (string) $pin );
	if ( 6 !== strlen( $pin ) ) {
		return null;
	}
	foreach ( array( $pin, substr( $pin, 0, 3 ) . '___' ) as $like ) {
		$code = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT d.meta_value FROM {$wpdb->postmeta} pc JOIN {$wpdb->posts} p ON p.ID = pc.post_id AND p.post_type = 'aw_listing' AND p.post_status = 'publish' JOIN {$wpdb->postmeta} d ON d.post_id = p.ID AND d.meta_key = 'aw_district_code' WHERE pc.meta_key = 'aw_pincode' AND pc.meta_value LIKE %s GROUP BY d.meta_value ORDER BY COUNT(*) DESC LIMIT 1",
				$like
			)
		);
		$d    = $code ? directoryweb_place_district( (int) $code ) : null;
		if ( $d ) {
			return $d;
		}
	}
	return null;
}


/** PIN lookup for the Place box (editors): see directoryweb_pin_lookup() in places.php. */
add_action(
	'wp_ajax_aw_pin_lookup',
	function () {
		check_ajax_referer( 'aw_place_save', 'nonce' );
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( 'Not allowed.' );
		}
		$r = directoryweb_pin_lookup( sanitize_text_field( (string) wp_unslash( $_GET['pin'] ?? '' ) ) );
		is_array( $r ) ? wp_send_json_success( $r ) : wp_send_json_error( $r );
	}
);


/* ---------- The PIN back in DirectoryWeb's Place box, search box, Near me and storage rules ---------- */

// Place box: the PIN row with its "Fill in" button, and the script behind it.
add_filter(
	'directoryweb_place_box_postal_row',
	function ( $html, $pin ) {
		return '<p><label for="aw-pin"><strong>PIN code</strong></label><br><input type="text" id="aw-pin" name="aw_pincode" value="' . esc_attr( $pin ) . '" inputmode="numeric" pattern="[1-9][0-9]{5}" maxlength="6" placeholder="686001" style="width:8em"> <button type="button" class="button" id="aw-pin-go">Fill in</button><br><span id="aw-pin-msg" class="description" aria-live="polite">Fills State and District from India Post.</span></p>';
	},
	10,
	2
);
add_filter( 'directoryweb_postal_code_input', fn( $v ) => preg_replace( '/\D/', '', (string) $v ) );
add_filter( 'directoryweb_postal_code_valid', fn( $ok, $code ) => (bool) preg_match( '/^[1-9]\d{5}$/', (string) $code ), 10, 2 );
add_filter( 'directoryweb_place_error', fn() => 'Place not saved: choose the state and district from the lists, and give a 6-digit PIN code (or leave it empty). The previous place is kept.' );
add_filter( 'directoryweb_search_label', fn() => 'Name or PIN code' );
add_filter( 'directoryweb_search_placeholder', fn() => 'Search by name or PIN code' );

foreach ( array( 'admin_print_footer_scripts-post.php', 'admin_print_footer_scripts-post-new.php' ) as $directoryweb_pin_hook ) {
	add_action(
		$directoryweb_pin_hook,
		function () {
			if ( ! function_exists( 'directoryweb_place_box' ) || ! defined( 'AW_PLACE_EDIT_TYPES' ) || ! in_array( get_post_type(), AW_PLACE_EDIT_TYPES, true ) ) {
				return;
			}
			ob_start();
			?>
(function () {
	var st = document.getElementById('aw-state'), di = document.getElementById('aw-district');
	var go = document.getElementById('aw-pin-go'), pin = document.getElementById('aw-pin'), msg = document.getElementById('aw-pin-msg');
	if (!st || !di || !go || !pin || !msg) { return; }
	function look() {
		msg.textContent = 'Looking up…';
		var u = ajaxurl + '?action=directoryweb_pin_lookup&pin=' + encodeURIComponent(pin.value) + '&nonce=' + encodeURIComponent(document.getElementById('aw_place_nonce').value);
		fetch(u, { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (r) {
			if (!r.success) { msg.textContent = r.data; return; }
			st.value = String(r.data.state); st.dispatchEvent(new Event('change'));
			di.value = String(r.data.district || 0);
			msg.textContent = r.data.note || (r.data.district_name + ', ' + r.data.state_name);
		}).catch(function () { msg.textContent = 'India Post did not answer. Choose the state and district below.'; });
	}
	go.addEventListener('click', look);
	pin.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); look(); } });
})();
			<?php
			wp_register_script( 'directoryweb-pin-box', false, array(), DIRECTORYWEB_VERSION, true );
			wp_enqueue_script( 'directoryweb-pin-box' );
			wp_add_inline_script( 'directoryweb-pin-box', (string) ob_get_clean() );
		}
	);
}
unset( $directoryweb_pin_hook );

// Search box: a PIN code opens that PIN's district (or state) list; when India Post does not know the PIN, the district of the
// listings that store it (or the nearest PIN prefix) is used.
add_filter(
	'directoryweb_search_place_from_code',
	function ( $found, $code ) {
		if ( ! preg_match( '/^[1-9]\d{5}$/', (string) $code ) ) {
			return $found;
		}
		$r = directoryweb_pin_lookup( $code );
		if ( ! is_array( $r ) || empty( $r['district_slug'] ) ) {
			$near = directoryweb_pin_nearest_district( $code );
			if ( $near ) {
				$r = array( 'state_slug' => directoryweb_place_parent_state( $near )->slug, 'district_slug' => $near->slug );
			}
		}
		return is_array( $r ) ? $r : $found;
	},
	10,
	2
);

// Near me: a PIN → its district's centre.
add_filter(
	'directoryweb_near_from_code',
	function ( $found, $pin ) {
		$pin = preg_replace( '/\D/', '', (string) $pin );
		if ( ! preg_match( '/^[1-9]\d{5}$/', $pin ) ) {
			return new WP_Error( 'aw_pin', 'Enter a 6-digit PIN code.', array( 'status' => 400 ) );
		}
		$r    = directoryweb_pin_lookup( $pin );
		$cent = is_array( $r ) && ! empty( $r['district'] ) ? directoryweb_district_centroid( (int) $r['district'] ) : null;
		if ( ! $cent ) {
			return new WP_Error( 'aw_pin', 'That PIN code was not found.', array( 'status' => 404 ) );
		}
		return array(
			'lat'      => $cent[0],
			'lng'      => $cent[1],
			'origin'   => 'PIN ' . $pin . ' (' . $r['district_name'] . ' district)',
			'district' => (int) $r['district'],
		);
	},
	10,
	2
);
add_filter(
	'directoryweb_near_code_input',
	function ( $html ) {
		return directoryweb_pin_lookup_enabled() ? '<span class="aw-near-or">or</span>'
		. '<label class="screen-reader-text" for="aw-near-pin">PIN code</label><input id="aw-near-pin" class="aw-near-pin" inputmode="numeric" maxlength="6" pattern="[1-9][0-9]{5}" placeholder="PIN code" autocomplete="postal-code">' : $html;
	}
);

// Settings → the PIN code lookup row, before the Geocoder row.
add_filter(
	'directoryweb_settings_services',
	function ( $services ) {
		$row = array(
			'slug'    => 'pin',
			'name'    => __( 'PIN code lookup', 'directoryweb' ),
			'status'  => directoryweb_pin_lookup_enabled() ? __( 'India Post, on', 'directoryweb' ) : __( 'Off', 'directoryweb' ),
			'tone'    => '',
			'summary' => directoryweb_pin_lookup_enabled() ? __( 'Answers are kept for a week.', 'directoryweb' ) : __( 'Off by default: no PIN code is sent anywhere. Return true from the directoryweb_pin_lookup_enabled filter to turn it on.', 'directoryweb' ),
			'facts'   => array(
				directoryweb_fact( __( 'Service', 'directoryweb' ), 'api.postalpincode.in' ),
				directoryweb_fact( __( 'PIN pattern', 'directoryweb' ), '^[1-9]\d{5}$' ),
			),
		);
		$out = array();
		foreach ( (array) $services as $s ) {
			if ( 'geocoder' === ( $s['slug'] ?? '' ) ) {
				$out[] = $row;
			}
			$out[] = $s;
		}
		return $out;
	}
);
