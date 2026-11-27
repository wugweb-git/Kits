<?php
/**
 * Campaign form (owner, 21 Oct 2026): "Sign it" in the campaign letter tool is the Fluent Forms form "Campaign form"
 * (forms/10-campaign-form.json; its ID in the option aw_ff_campaign_form). The letter tool keeps its own screen (grounds,
 * the letter as it is written, the Gmail / Outlook / email app / copy buttons, which a form cannot do); when a letter is
 * sent, campaign.js submits the signer to Fluent Forms. So every signer is an entry (Fluent Forms → Entries), with the
 * campaign, grounds, route, own line, both boxes, WhatsApp and the visit fields, and the form's FluentCRM link adds them
 * (Newsletter list, newsletter and volunteer tags, the campaign fields). After the link: the campaign-<slug> tag, the
 * boxes as 1/0 and the letter's anonymous statistics row (campaign-letters.php, one row per send_id).
 *
 * The raw copy (owner, 21 Oct 2026: "keep a ready fallback"): OFF by default since 1.3.3 (Kits -> Settings -> Form copies).
 * When switched on, every form send (all Fluent Forms forms, and the campaign sign-up) is copied into wp_aw_form_raw
 * the moment it reaches the server, before any check, minus fields whose names contain pass, card, cvv, ssn or token.
 * Its status says what happened: received (refused by a check, or failed), saved (with the entry ID), duplicate (a
 * retry of a send already saved). Kept 30 days unless the retention setting says otherwise (kits_form_raw_days).
 * Turning it off keeps the stored rows; "Delete stored copies" removes them. wp aw raw-export writes it as CSV.
 *
 * Moved from Animal Writes Core `includes/campaign-form.php` (18 Nov 2026); options, meta keys, tags, hooks and
 * slugs are unchanged, and the old function names still work (back-compat wrappers).
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const KITS_CF_OPTION   = 'aw_ff_campaign_form';
const KITS_RAW_DB      = '1';
const KITS_RAW_DAYS    = 30; // default retention in days (option kits_form_raw_days)
const KITS_CF_RL_LIMIT = 30; // sends an hour from one connection (colleges and offices share one)

/** The Campaign form's Fluent Forms ID, or 0. */
function kits_cf_id() {
	return defined( 'FLUENTFORM' ) ? (int) get_option( KITS_CF_OPTION, 0 ) : 0;
}

/* ---------- The raw copy ---------- */

function kits_raw_table() {
	global $wpdb;
	return $wpdb->prefix . 'aw_form_raw';
}

/** Whether form sends are copied. Off by default: the option kits_form_raw_capture is '1'. */
function kits_raw_capture_on(): bool {
	return '1' === (string) get_option( 'kits_form_raw_capture', '0' );
}

/** Days a copy is kept (1 to 365; default 30). */
function kits_raw_days(): int {
	$d = (int) get_option( 'kits_form_raw_days', KITS_RAW_DAYS );
	return $d < 1 ? KITS_RAW_DAYS : min( 365, $d );
}

/** Whether a field name is one never stored (password, card, cvv, ssn, token). */
function kits_raw_sensitive_name( $name ): bool {
	return 1 === preg_match( '/pass|card|cvv|ssn|token/i', (string) $name );
}

/** The send without its sensitive fields (at any depth). */
function kits_raw_strip( $data ) {
	$out = array();
	foreach ( (array) $data as $k => $v ) {
		if ( kits_raw_sensitive_name( $k ) ) {
			continue;
		}
		$out[ $k ] = is_array( $v ) ? kits_raw_strip( $v ) : $v;
	}
	return $out;
}

/** Number of stored copies (0 when the table is missing). */
function kits_raw_count(): int {
	global $wpdb;
	if ( KITS_RAW_DB !== get_option( 'aw_form_raw_db' ) ) {
		return 0;
	}
	return (int) $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM %i', kits_raw_table() ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
}

add_action(
	'init',
	function () {
		if ( ! kits_raw_capture_on() || KITS_RAW_DB === get_option( 'aw_form_raw_db' ) ) {
			return; // off: no table is made; an existing one is left as it is
		}
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta(
			'CREATE TABLE ' . kits_raw_table() . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			received_at datetime NOT NULL,
			kind varchar(20) NOT NULL DEFAULT '',
			form_id bigint(20) unsigned NOT NULL DEFAULT 0,
			email varchar(190) NOT NULL DEFAULT '',
			payload longtext NOT NULL,
			status varchar(20) NOT NULL DEFAULT 'received',
			entry_id bigint(20) unsigned NOT NULL DEFAULT 0,
			PRIMARY KEY  (id),
			KEY email (email),
			KEY received (received_at)
			) {$wpdb->get_charset_collate()};"
		);
		update_option( 'aw_form_raw_db', KITS_RAW_DB, false );
	},
	5
);

/** Copies one send as it arrived; returns the row ID (0 when the table is not there). */
function kits_raw_save( $kind, $form_id, $data ) {
	global $wpdb;
	if ( ! kits_raw_capture_on() || KITS_RAW_DB !== get_option( 'aw_form_raw_db' ) ) {
		return 0;
	}
	$data = kits_raw_strip( $data );
	unset( $data['altcha'] ); // the bot check's answer: long and of no use later
	$ok = $wpdb->insert( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		kits_raw_table(),
		array(
			'received_at' => current_time( 'mysql', true ),
			'kind'        => substr( (string) $kind, 0, 20 ),
			'form_id'     => (int) $form_id,
			'email'       => substr( strtolower( trim( sanitize_text_field( (string) ( $data['email'] ?? '' ) ) ) ), 0, 190 ),
			'payload'     => (string) wp_json_encode( $data ),
		)
	);
	return $ok ? (int) $wpdb->insert_id : 0;
}

function kits_raw_mark( $id, $status, $entry_id = 0 ) {
	global $wpdb;
	if ( $id ) {
		$wpdb->update( kits_raw_table(), array( 'status' => $status, 'entry_id' => (int) $entry_id ), array( 'id' => (int) $id ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	}
}

// Every Fluent Forms send, before Fluent Forms looks at it (its own handler runs at priority 10).
$GLOBALS['aw_raw_id'] = 0;
foreach ( array( 'wp_ajax_nopriv_fluentform_submit', 'wp_ajax_fluentform_submit' ) as $kits_cf_hook ) {
	add_action(
		$kits_cf_hook,
		function () {
			$data = array();
			parse_str( (string) wp_unslash( $_POST['data'] ?? '' ), $data ); // phpcs:ignore WordPress.Security.NonceVerification,WordPress.Security.ValidatedSanitizedInput -- copied as sent, read only by admins
			$form = absint( wp_unslash( $_POST['form_id'] ?? 0 ) ); // phpcs:ignore WordPress.Security.NonceVerification -- read only, to label the copy
			$GLOBALS['aw_raw_id'] = kits_raw_save( $form && $form === kits_cf_id() ? 'campaign' : 'form', $form, $data );
		},
		1
	);
}
add_action(
	'fluentform/submission_inserted',
	function ( $entry_id ) {
		kits_raw_mark( $GLOBALS['aw_raw_id'] ?? 0, 'saved', $entry_id );
	},
	1
);

// Older than the retention days: gone (daily). Booked only while the copy is on; nothing is deleted when it is off.
add_action(
	'init',
	function () {
		$booked = wp_next_scheduled( 'aw_raw_prune' );
		if ( ! kits_raw_capture_on() ) {
			if ( $booked ) {
				wp_unschedule_hook( 'aw_raw_prune' );
			}
			return;
		}
		if ( ! $booked ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'aw_raw_prune' );
		}
	}
);
add_action(
	'aw_raw_prune',
	function () {
		global $wpdb;
		if ( ! kits_raw_capture_on() || KITS_RAW_DB !== get_option( 'aw_form_raw_db' ) ) {
			return;
		}
		$wpdb->query( $wpdb->prepare( 'DELETE FROM %i WHERE received_at < %s', kits_raw_table(), gmdate( 'Y-m-d H:i:s', time() - kits_raw_days() * DAY_IN_SECONDS ) ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	}
);

// Kits -> Settings -> Form copies: the switch, the retention, and "Delete stored copies".
add_action(
	'init',
	function () {
		register_setting( 'kits_form_raw', 'kits_form_raw_capture', array( 'type' => 'string', 'default' => '0', 'sanitize_callback' => fn( $v ) => '1' === (string) $v ? '1' : '0', 'show_in_rest' => false ) );
		register_setting( 'kits_form_raw', 'kits_form_raw_days', array( 'type' => 'integer', 'default' => KITS_RAW_DAYS, 'sanitize_callback' => fn( $v ) => max( 1, min( 365, (int) $v ) ), 'show_in_rest' => false ) );
	}
);
add_filter(
	'kits_settings_sections',
	function ( $sections ) {
		$sections              = (array) $sections;
		$sections['form-copy'] = array(
			'title'  => __( 'Form copies', 'kits-core' ),
			'render' => 'kits_raw_settings_form',
			'cap'    => 'manage_options',
			'order'  => 80,
		);
		return $sections;
	}
);

/** Kits -> Settings -> Form copies. */
function kits_raw_settings_form(): void {
	echo '<p class="description">' . esc_html__( 'Off by default. When on, each Fluent Forms send is copied into the table wp_aw_form_raw the moment it arrives, before any check: the time, the form, the e-mail address and every submitted field except those whose name contains pass, card, cvv, ssn or token. It is a fallback if an entry fails to save. It is deleted after the retention days.', 'kits-core' ) . '</p>';
	echo '<form method="post" action="options.php">';
	echo '<input type="hidden" name="option_page" value="kits_form_raw"><input type="hidden" name="action" value="update">';
	wp_nonce_field( 'kits_form_raw-options', '_wpnonce', false );
	echo '<input type="hidden" name="_wp_http_referer" value="' . esc_attr( wp_make_link_relative( admin_url( 'admin.php?page=kits-settings&kits_section=form-copy' ) ) ) . '">';
	echo '<p><label><input type="checkbox" name="kits_form_raw_capture" value="1"' . checked( kits_raw_capture_on(), true, false ) . '> ' . esc_html__( 'Copy form sends into the database', 'kits-core' ) . '</label></p>';
	echo '<p><label>' . esc_html__( 'Keep copies for', 'kits-core' ) . ' <input type="number" min="1" max="365" name="kits_form_raw_days" value="' . esc_attr( (string) kits_raw_days() ) . '" class="small-text"> ' . esc_html__( 'days', 'kits-core' ) . '</label></p>';
	submit_button( __( 'Save form copy settings', 'kits-core' ) );
	echo '</form>';
	echo '<h3>' . esc_html__( 'Stored copies', 'kits-core' ) . '</h3>';
	/* translators: %d: number of stored copies */
	echo '<p>' . esc_html( sprintf( __( '%d stored. Turning the copy off keeps them until you delete them here.', 'kits-core' ), kits_raw_count() ) ) . '</p>';
	$confirm = esc_js( __( 'Delete every stored copy? This cannot be undone.', 'kits-core' ) );
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" onsubmit="return confirm(\'' . $confirm . '\');">'; // phpcs:ignore WordPress.Security.EscapeOutput -- $confirm is esc_js()
	echo '<input type="hidden" name="action" value="kits_raw_delete">';
	wp_nonce_field( 'kits_raw_delete', 'kits_raw_delete_nonce' );
	submit_button( __( 'Delete stored copies', 'kits-core' ), 'delete', 'submit', false );
	echo '</form>';
}

/** Deletes every stored copy (the table is emptied, not dropped). */
function kits_raw_delete_all(): void {
	global $wpdb;
	if ( KITS_RAW_DB === get_option( 'aw_form_raw_db' ) ) {
		$wpdb->query( $wpdb->prepare( 'DELETE FROM %i', kits_raw_table() ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	}
}

add_action(
	'admin_post_kits_raw_delete',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'kits-core' ), 403 );
		}
		check_admin_referer( 'kits_raw_delete', 'kits_raw_delete_nonce' );
		kits_raw_delete_all();
		wp_safe_redirect( add_query_arg( array( 'page' => 'kits-settings', 'kits_section' => 'form-copy', 'kits_deleted' => '1' ), admin_url( 'admin.php' ) ) );
		exit;
	}
);

/* ---------- The Campaign form ---------- */

/** The campaign a send names, when it is published and open; else 0. */
function kits_cf_campaign( $data ) {
	$id = function_exists( 'aw_camp_id' ) ? aw_camp_id( (int) ( $data['campaign_id'] ?? 0 ) ) : 0;
	return $id && 'publish' === get_post_status( $id ) && aw_camp_is_open( $id ) ? $id : 0;
}

/** The ALTCHA answer of a Campaign form send: in the form data, or in the raw post when Fluent Forms left it out (it is not a form field, so it is not kept with the entry). */
function kits_cf_altcha( $data ) {
	if ( isset( $data['altcha'] ) && is_scalar( $data['altcha'] ) ) {
		return (string) $data['altcha'];
	}
	$raw = array();
	parse_str( (string) wp_unslash( $_POST['data'] ?? '' ), $raw ); // phpcs:ignore WordPress.Security.NonceVerification,WordPress.Security.ValidatedSanitizedInput -- checked by kits_altcha_verify
	return is_scalar( $raw['altcha'] ?? null ) ? (string) $raw['altcha'] : '';
}

/** Fluent Forms' answer for a send already saved (a retry after a lost answer): the same reference, no new entry. */
function kits_cf_done( $ref ) {
	kits_raw_mark( $GLOBALS['aw_raw_id'] ?? 0, 'duplicate' );
	wp_send_json(
		array(
			'insert_id' => 0,
			'result'    => array( 'message' => '<p class="aw-form-done-title">Thank you.</p><p class="aw-form-ref">Your reference: <strong data-aw-ref="' . esc_attr( $ref ) . '">' . esc_html( $ref ) . '</strong></p>', 'action' => 'hide_form' ),
			'error'     => '',
		)
	);
}

add_filter(
	'fluentform/validation_errors',
	function ( $errors, $data, $form ) {
		if ( (int) $form->id !== kits_cf_id() || ! kits_cf_id() ) {
			return $errors;
		}
		$send = function_exists( 'aw_cl_send_id' ) ? aw_cl_send_id( $data['send_id'] ?? '' ) : '';
		$ref  = $send ? get_transient( 'aw_cl_s_' . $send ) : '';
		if ( $ref ) {
			kits_cf_done( $ref );
		}
		if ( ! kits_cf_campaign( $data ) ) {
			$errors['campaign_id'] = array( 'aw' => 'This campaign is closed.' );
		}
		$rl = 'aw_rl_aw_campaign_' . md5( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		if ( ! $errors && (int) get_transient( $rl ) >= KITS_CF_RL_LIMIT ) {
			$errors['aw_form'] = array( 'aw' => 'Too many tries. Wait a minute, then try again.' );
		}
		// The bot check (ALTCHA, audit item 4), checked and used up only when everything else is right.
		if ( ! $errors && ! aw_cl_human( $send, kits_cf_altcha( $data ) ) ) {
			$errors['altcha'] = array( 'aw' => 'Couldn\'t verify you\'re not a bot. Try again.' );
		}
		return $errors;
	},
	20,
	3
);

/** The yes/no boxes on the site's forms: an unticked box sends nothing, so the entry says 0 (owner, 21 Oct 2026). */
const KITS_FF_BOXES = array( 'nl_optin', 'wa_optin', 'org_assoc', 'org_show', 'consent' );

add_filter(
	'fluentform/insert_response_data',
	function ( $data, $form_id ) {
		if ( ! ( function_exists( 'kits_ff_key' ) && kits_ff_key( $form_id ) ) && (int) $form_id !== kits_cf_id() ) {
			return $data;
		}
		$form   = \FluentForm\App\Models\Form::find( (int) $form_id );
		$fields = $form ? (string) $form->form_fields : '';
		foreach ( KITS_FF_BOXES as $box ) {
			if ( false !== strpos( $fields, '"name":"' . $box . '"' ) && ( empty( $data[ $box ] ) || array( '' ) === (array) $data[ $box ] ) ) {
				$data[ $box ] = '0';
			}
		}
		return $data;
	},
	5,
	2
);

// What the server knows better than the page: the campaign's name and slug, the grounds' labels, the date, the
// reference (AW-L-<n>, the series the letter tool started) and the page fields.
add_filter(
	'fluentform/insert_response_data',
	function ( $data, $form_id ) {
		if ( (int) $form_id !== kits_cf_id() || ! kits_cf_id() ) {
			return $data;
		}
		$id                     = kits_cf_campaign( $data );
		$grounds                = aw_cl_grounds( $data['grounds'] ?? '' );
		$labels                 = aw_cl_ground_labels( $id );
		$data['campaign_id']    = (string) $id;
		$data['campaign']       = (string) get_post_field( 'post_name', $id );
		$data['campaign_title'] = get_the_title( $id );
		$data['grounds']        = $grounds;
		$data['grounds_text']   = implode( '; ', array_map( fn( $n ) => $n . '. ' . ( $labels[ $n ] ?? '' ), array_filter( explode( ',', $grounds ) ) ) );
		$route                  = sanitize_key( (string) ( $data['route'] ?? '' ) );
		$data['route']          = isset( AW_CL_ROUTES[ $route ] ) ? $route : '';
		$device                 = sanitize_key( (string) ( $data['device'] ?? '' ) );
		$data['device']         = isset( AW_CL_DEVICES[ $device ] ) ? $device : '';
		$data['letter_date']    = wp_date( 'Y-m-d', null, new DateTimeZone( 'Asia/Kolkata' ) );
		$data['city']           = aw_cl_city( $data['city'] ?? '' );
		$data['v_page_id']      = (string) $id;
		$data['v_page_title']   = get_the_title( $id );
		$data['ref']            = 'AW-L-' . aw_cl_next_ref();
		$send                   = aw_cl_send_id( $data['send_id'] ?? '' );
		if ( $send ) {
			set_transient( 'aw_cl_s_' . $send, $data['ref'], DAY_IN_SECONDS );
		}
		return $data;
	},
	10,
	2
);

// After the link (priority 10): the campaign-<slug> tag and the rest through the same function the letter tool used
// (it also makes the contact if the link did not run), the boxes as 1/0, the campaign fields, and the statistics row.
add_action(
	'fluentform/submission_inserted',
	function ( $entry_id, $data, $form ) {
		if ( (int) $form->id !== kits_cf_id() || ! kits_cf_id() ) {
			return;
		}
		$rl = 'aw_rl_aw_campaign_' . md5( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		set_transient( $rl, (int) get_transient( $rl ) + 1, HOUR_IN_SECONDS );
		$id = (int) ( $data['campaign_id'] ?? 0 );
		if ( ! $id ) {
			return;
		}
		$box  = function_exists( 'kits_ff_ticked' ) ? kits_ff_ticked( $data, 'nl_optin' ) : ! empty( $data['nl_optin'] );
		$wa   = function_exists( 'kits_ff_ticked' ) ? kits_ff_ticked( $data, 'wa_optin' ) : ! empty( $data['wa_optin'] );
		$tel  = trim( sanitize_text_field( (string) ( $data['whatsapp'] ?? '' ) ) );
		$tel  = '' !== $tel && function_exists( 'kits_clean_phone' ) && kits_clean_phone( $tel ) ? kits_clean_phone( $tel ) : substr( $tel, 0, 20 );
		$c_id = ! function_exists( 'mailweb_fcrm_campaign_signer' ) ? 0 : mailweb_fcrm_campaign_signer( (string) ( $data['email'] ?? '' ), sanitize_text_field( (string) ( $data['name'] ?? '' ) ), (string) ( $data['city'] ?? '' ), (string) $data['campaign'], $box, $tel, $wa, (string) ( $data['ref'] ?? '' ), (string) ( $data['consent_version'] ?? AW_CL_CONSENT ) );
		$c    = $c_id ? \FluentCrm\App\Models\Subscriber::find( $c_id ) : null;
		if ( $c ) {
			$c->syncCustomFieldValues(
				array(
					'campaign_last'    => (string) ( $data['campaign_title'] ?? '' ),
					'campaign_grounds' => (string) ( $data['grounds_text'] ?? '' ),
					'campaign_route'   => (string) ( $data['route'] ?? '' ),
					'campaign_date'    => (string) ( $data['letter_date'] ?? '' ),
					'campaign_line'    => mb_substr( sanitize_textarea_field( (string) ( $data['own'] ?? '' ) ), 0, 300 ),
				),
				false
			);
			if ( '' !== trim( (string) ( $data['own'] ?? '' ) ) ) { // wrote their own line: tagged, so FluentCRM can list them (owner, 26 Oct 2026)
				$c->attachTags( mailweb_fcrm_tag_ids( array( 'campaign-own-line' ) ) );
			}
		}
		aw_cl_record_letter(
			$id,
			array(
				'city'     => $data['city'] ?? '',
				'grounds'  => $data['grounds'] ?? '',
				'route'    => $data['route'] ?? '',
				'device'   => $data['device'] ?? '',
				'nl_optin' => $box ? '1' : '0',
				'wa_optin' => $wa ? '1' : '0',
				'send_id'  => $data['send_id'] ?? '',
			)
		);
	},
	20,
	3
);

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	// wp aw raw-export [--since=YYYY-MM-DD] [--status=received|saved] [--kind=form|campaign]: the raw copies as CSV.
	WP_CLI::add_command(
		'aw raw-export',
		function ( $args, $assoc ) {
			global $wpdb;
			$where = array( '1=1' );
			if ( ! empty( $assoc['since'] ) ) {
				$where[] = $wpdb->prepare( 'received_at >= %s', $assoc['since'] );
			}
			foreach ( array( 'status', 'kind' ) as $k ) {
				if ( ! empty( $assoc[ $k ] ) ) {
					$where[] = $wpdb->prepare( "$k = %s", $assoc[ $k ] ); // phpcs:ignore WordPress.DB.PreparedSQL
				}
			}
			$rows = $wpdb->get_results( 'SELECT * FROM ' . kits_raw_table() . ' WHERE ' . implode( ' AND ', $where ) . ' ORDER BY id', ARRAY_A ); // phpcs:ignore
			$out  = fopen( 'php://stdout', 'w' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			fputcsv( $out, array( 'id', 'received_at', 'kind', 'form_id', 'email', 'status', 'entry_id', 'payload' ) );
			foreach ( $rows as $r ) {
				fputcsv( $out, array( $r['id'], $r['received_at'], $r['kind'], $r['form_id'], $r['email'], $r['status'], $r['entry_id'], $r['payload'] ) );
			}
		}
	);
}
