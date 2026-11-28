<?php
/**
 * Review-queue rules in the plugin (owner, 14 Nov 2026: "you don't have to put me on review"). The rules are in
 * autoresolve-model.php (tested without WordPress); this file applies them.
 *
 * - When a value is queued for review (aw_enrich_queued) it is decided at once: approved, rejected as no change or
 *   another place, or left for the owner. The row shows its reason ("Auto: ...") in the change log.
 * - POST sourceweb/v1/enrichment/autoresolve {dry, limit} decides the rows already waiting (dry run by default).
 * - A PIN code in a listing's address fills an empty PIN field (so the address schema has postalCode), after every
 *   write to the address and in the sweep.
 * - Never on a claimed or verified listing. Off with the option aw_enrich_autoresolve = 0 or the filter
 *   sourceweb_enrich_autoresolve.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/autoresolve-model.php';

/** Whether queued values are decided by the rules. */
function sourceweb_ar_on() {
	return (bool) apply_filters( 'sourceweb_enrich_autoresolve', '0' !== (string) get_option( 'aw_enrich_autoresolve', '1' ) );
}

/**
 * What the model needs to know about where a value came from.
 *
 * @param int   $lid     Listing.
 * @param array $sources Row sources.
 * @return array{own_site: bool, site_stem: string, site_host: string}
 */
function sourceweb_ar_context( $lid, $sources ) {
	$own = false;
	foreach ( (array) $sources as $s ) {
		if ( is_array( $s ) && ( 'website' === ( $s['key'] ?? '' ) || false !== stripos( (string) ( $s['name'] ?? '' ), 'own website' ) ) ) {
			$own = true;
		}
	}
	$host = wp_parse_url( (string) get_post_meta( $lid, 'aw_website', true ), PHP_URL_HOST );
	$stem = $host ? (string) preg_replace( '/\..*$/', '', (string) preg_replace( '/^www\./', '', strtolower( $host ) ) ) : '';
	return array( 'own_site' => $own, 'site_stem' => $stem, 'site_host' => $host ? (string) preg_replace( '/^www\\./', '', strtolower( $host ) ) : '' );
}

/**
 * Whether another listing already holds this phone number (compared by its last 10 digits).
 *
 * @param int    $lid    Listing.
 * @param string $number Number.
 * @return bool
 */
function sourceweb_ar_phone_elsewhere( $lid, $number ) {
	global $wpdb;
	$last = substr( preg_replace( '/\D+/', '', (string) $number ), -10 );
	if ( strlen( $last ) < 10 ) {
		return false;
	}
	return (bool) $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->prepare( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'aw_phones' AND post_id <> %d AND REGEXP_REPLACE( meta_value, '[^0-9]', '' ) LIKE %s LIMIT 1", (int) $lid, '%' . $wpdb->esc_like( $last ) . '%' ) // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	);
}

/**
 * Decide one waiting row, and apply the decision unless $apply is false.
 *
 * @param int  $id    Row ID.
 * @param bool $apply Write the decision (false: only say what it would be).
 * @return array{act: string, why: string}|null null when the row is not waiting.
 */
function sourceweb_ar_row( $id, $apply = true ) {
	$r = sourceweb_enrich_row( (int) $id );
	if ( ! $r || 'pending' !== $r['status'] || ! is_string( $r['value'] ) ) {
		return null;
	}
	$lid = (int) $r['listing_id'];
	if ( 0 === strpos( (string) $r['note'], 'From an imported list' ) ) {
		return array( 'act' => 'leave', 'why' => 'an imported list is always checked by a person' );
	}
	if ( sourceweb_enrich_is_protected( $lid ) ) {
		return array( 'act' => 'leave', 'why' => 'a claimed or verified listing is never changed automatically' );
	}
	if ( 'phone' === $r['field'] && sourceweb_ar_phone_elsewhere( $lid, $r['value'] ) ) {
		return array( 'act' => 'leave', 'why' => 'the number is on another listing (a name clash?)' );
	}
	$d = sourceweb_ar_decide( $r['field'], (string) sourceweb_enrich_current( $lid, $r['field'] ), $r['value'], (string) $r['confidence'], sourceweb_ar_context( $lid, $r['sources'] ), sourceweb_ar_rules() );
	if ( ! $apply || 'leave' === $d['act'] ) {
		return $d;
	}
	if ( 'reject' === $d['act'] ) {
		sourceweb_enrich_set_status( (int) $id, 'rejected', 'Auto: ' . $d['why'] );
	} elseif ( sourceweb_enrich_approve( (int) $id ) ) {
		sourceweb_enrich_set_status( (int) $id, 'approved', 'Auto: ' . $d['why'] );
	} else {
		return array( 'act' => 'leave', 'why' => 'could not be written' );
	}
	return $d;
}

// A value queued for review is decided at once; the results reply says what became of it.
add_filter(
	'sourceweb_enrich_queued_decision',
	function ( $act, $id ) {
		if ( $id && sourceweb_ar_on() ) {
			$d = sourceweb_ar_row( (int) $id );
			return $d ? $d['act'] : '';
		}
		return $act;
	},
	10,
	2
);

/**
 * The PIN code in the address, when the PIN field is empty.
 *
 * @param int $lid Listing.
 * @return bool Whether the PIN field was filled.
 */
function sourceweb_ar_fill_pin( $lid ) {
	static $busy = false;
	$lid = (int) $lid;
	if ( $busy || ! sourceweb_is_type( get_post_type( $lid ), 'listing' ) || sourceweb_enrich_is_protected( $lid ) || '' !== trim( (string) get_post_meta( $lid, 'aw_pincode', true ) ) ) {
		return false;
	}
	$pin = sourceweb_ar_pin( (string) get_post_meta( $lid, 'aw_address', true ) );
	if ( '' === $pin ) {
		return false;
	}
	$src  = array( array( 'key' => 'listing', 'name' => 'The listing\'s own address', 'url' => '', 'fetched_at' => wp_date( 'Y-m-d' ) ) );
	$busy = true; // writing the PIN calls aw_enrich_changed again
	$ok   = sourceweb_enrich_write( $lid, 'pincode', $pin, 'apply', $src );
	$busy = false;
	if ( $ok ) {
		sourceweb_enrich_add_row( $lid, 'pincode', $pin, '', $src, 'high', 'auto-applied', 'autoresolve', 'From the listing\'s own address' );
	}
	return (bool) $ok;
}

// After every write to a listing from the enrichment: its address may now hold a PIN the field lacks.
add_action(
	'sourceweb_enrich_changed',
	function ( $lid ) {
		if ( sourceweb_ar_on() ) {
			sourceweb_ar_fill_pin( (int) $lid );
		}
	}
);

/**
 * Decide the rows already waiting.
 *
 * @param WP_REST_Request $req dry (default true), limit (default 300, at most 1000).
 * @return WP_REST_Response
 */
function sourceweb_ar_rest_sweep( WP_REST_Request $req ) {
	global $wpdb;
	$dry   = ! ( false === $req->get_param( 'dry' ) || 'false' === $req->get_param( 'dry' ) || '0' === (string) $req->get_param( 'dry' ) );
	$limit = max( 1, min( 1000, (int) ( $req->get_param( 'limit' ) ? $req->get_param( 'limit' ) : 300 ) ) );
	$t     = sourceweb_enrich_table();
	$ids   = array_map( 'intval', $wpdb->get_col( $wpdb->prepare( "SELECT id FROM %i WHERE status = 'pending' AND field NOT IN ( 'closed', 'merge_into', 'place' ) ORDER BY id ASC LIMIT %d", $t, $limit ) ) ); // phpcs:ignore WordPress.DB
	$count = array();
	$seen  = array();
	foreach ( $ids as $id ) {
		$d = sourceweb_ar_row( $id, ! $dry );
		if ( ! $d ) {
			continue;
		}
		$k           = $d['act'] . ': ' . $d['why'];
		$count[ $k ] = ( $count[ $k ] ?? 0 ) + 1;

		$seen[ $d['act'] ][] = $id;
	}
	$pins = 0;
	if ( ! $dry && '' !== sourceweb_type( 'listing' ) ) {
		$is_l = sourceweb_sql_in_types( 'p.post_type', array( sourceweb_type( 'listing' ) ) );
		foreach ( (array) $wpdb->get_col( "SELECT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} a ON a.post_id = p.ID AND a.meta_key = 'aw_address' LEFT JOIN {$wpdb->postmeta} c ON c.post_id = p.ID AND c.meta_key = 'aw_pincode' WHERE {$is_l} AND p.post_status IN ( 'publish', 'pending' ) AND ( c.meta_value IS NULL OR c.meta_value = '' ) AND a.meta_value REGEXP '[1-9][0-9]{2} ?[0-9]{3}' LIMIT 500" ) as $lid ) { // phpcs:ignore WordPress.DB
			$pins += sourceweb_ar_fill_pin( (int) $lid ) ? 1 : 0;
		}
	}
	ksort( $count );
	return rest_ensure_response(
		array(
			'dry'       => $dry,
			'rows'      => count( $ids ),
			'by_reason' => $count,
			'approve'   => count( $seen['approve'] ?? array() ),
			'reject'    => count( $seen['reject'] ?? array() ),
			'leave'     => count( $seen['leave'] ?? array() ),
			'pins'      => $pins,
		)
	);
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'sourceweb/v1',
			'/enrichment/autoresolve',
			array(
				'methods'             => 'POST',
				'permission_callback' => fn() => current_user_can( defined( 'SOURCEWEB_ENRICH_CAP' ) ? SOURCEWEB_ENRICH_CAP : 'edit_others_posts' ),
				'callback'            => 'sourceweb_ar_rest_sweep',
				'args'                => array(
					'dry'   => array( 'required' => false ),
					'limit' => array( 'type' => 'integer', 'required' => false ),
				),
			)
		);
	}
);

/* ---------- The rules as rows the owner can add, edit, delete and reorder (SourceWeb → Rules → Review-queue rules) ---------- */

/** The option holding the rules (a list of rows; absent: the built-in rules). */
const SOURCEWEB_AR_RULES_OPTION = 'aw_enrich_autoresolve_rules';

/**
 * The rows as stored, cleaned (a row with an unknown field, condition or action is dropped), or the built-in rules.
 *
 * @return array[] each array{id, field, cond, action, on}
 */
function sourceweb_ar_rules() {
	$saved = get_option( SOURCEWEB_AR_RULES_OPTION );
	if ( ! is_array( $saved ) ) {
		return sourceweb_ar_default_rules();
	}
	$conds = sourceweb_ar_conditions();
	$out   = array();
	foreach ( $saved as $r ) {
		if ( is_array( $r ) && isset( $r['id'], SOURCEWEB_AR_FIELDS[ $r['field'] ?? '' ], SOURCEWEB_AR_ACTIONS[ $r['action'] ?? '' ], $conds[ $r['cond'] ?? '' ] ) && in_array( $r['field'], $conds[ $r['cond'] ]['fields'], true ) ) {
			$out[] = array( 'id' => (string) $r['id'], 'field' => $r['field'], 'cond' => $r['cond'], 'action' => $r['action'], 'on' => ! empty( $r['on'] ) );
		}
	}
	return $out;
}

/**
 * Store the rows and log the change.
 *
 * @param array[] $rows What to store.
 * @param string  $what What changed, in words.
 */
function sourceweb_ar_rules_store( array $rows, $what ) {
	$old = sourceweb_ar_rules();
	update_option( SOURCEWEB_AR_RULES_OPTION, array_values( $rows ), false );
	sourceweb_src_log( 'enrich', $what, $old, array_values( $rows ) );
}

/**
 * Add or edit one rule.
 *
 * @param array  $in       field, cond, action, on.
 * @param string $original The id being edited, '' to add.
 * @return array{0: string, 1: string} done (added | edited | none | error) and a message.
 */
function sourceweb_ar_rule_save( array $in, $original = '' ) {
	$field  = (string) ( $in['field'] ?? '' );
	$cond   = (string) ( $in['cond'] ?? '' );
	$action = (string) ( $in['action'] ?? '' );
	$conds  = sourceweb_ar_conditions();
	if ( ! isset( SOURCEWEB_AR_FIELDS[ $field ] ) || ! isset( $conds[ $cond ] ) || ! in_array( $field, $conds[ $cond ]['fields'], true ) || ! isset( SOURCEWEB_AR_ACTIONS[ $action ] ) ) {
		return array( 'error', __( 'Choose a field, a condition that fits it, and what to do.', 'sourceweb' ) );
	}
	$row  = array( 'id' => '', 'field' => $field, 'cond' => $cond, 'action' => $action, 'on' => ! empty( $in['on'] ) );
	$rows = sourceweb_ar_rules();
	$ids  = wp_list_pluck( $rows, 'id' );
	if ( '' !== $original && in_array( $original, $ids, true ) ) {
		foreach ( $rows as $i => $r ) {
			if ( $r['id'] === $original ) {
				$row['id'] = $original;
				if ( $r === $row ) {
					return array( 'none', __( 'Nothing changed.', 'sourceweb' ) );
				}
				$rows[ $i ] = $row;
			}
		}
		sourceweb_ar_rules_store( $rows, 'Review-queue rule ' . $original . ' edited' );
		return array( 'edited', __( 'Rule saved.', 'sourceweb' ) );
	}
	$base = $field . '-' . $cond;
	$id   = $base;
	for ( $n = 2; in_array( $id, $ids, true ); $n++ ) {
		$id = $base . '-' . $n;
	}
	$row['id'] = $id;
	// A new rule goes after the last rule of its field (rules are tried in order), or at the end.
	$at = count( $rows );
	foreach ( $rows as $i => $r ) {
		if ( $r['field'] === $field ) {
			$at = $i + 1;
		}
	}
	array_splice( $rows, $at, 0, array( $row ) );
	sourceweb_ar_rules_store( $rows, 'Review-queue rule ' . $id . ' added' );
	return array( 'added', __( 'Rule added.', 'sourceweb' ) );
}

/**
 * Delete one rule.
 *
 * @param string $id Rule id.
 * @return array{0: string, 1: string}
 */
function sourceweb_ar_rule_delete( $id ) {
	$rows = sourceweb_ar_rules();
	$keep = array_values( array_filter( $rows, fn( $r ) => $r['id'] !== $id ) );
	if ( count( $keep ) === count( $rows ) ) {
		return array( 'none', __( 'No such rule.', 'sourceweb' ) );
	}
	sourceweb_ar_rules_store( $keep, 'Review-queue rule ' . $id . ' deleted' );
	return array( 'deleted', __( 'Rule deleted.', 'sourceweb' ) );
}

/**
 * Move a rule one place earlier or later among the rules of its field (rules are tried in order).
 *
 * @param string $id  Rule id.
 * @param string $dir up | down.
 * @return array{0: string, 1: string}
 */
function sourceweb_ar_rule_move( $id, $dir ) {
	$rows = sourceweb_ar_rules();
	$pos  = array_search( $id, wp_list_pluck( $rows, 'id' ), true );
	if ( false === $pos ) {
		return array( 'none', __( 'No such rule.', 'sourceweb' ) );
	}
	$step = 'up' === $dir ? -1 : 1;
	for ( $j = $pos + $step; isset( $rows[ $j ] ); $j += $step ) {
		if ( $rows[ $j ]['field'] === $rows[ $pos ]['field'] ) {
			$tmp          = $rows[ $pos ];
			$rows[ $pos ] = $rows[ $j ];
			$rows[ $j ]   = $tmp;
			sourceweb_ar_rules_store( $rows, 'Review-queue rule ' . $id . ' moved ' . ( 'up' === $dir ? 'earlier' : 'later' ) );
			return array( 'moved', __( 'Rule moved.', 'sourceweb' ) );
		}
	}
	return array( 'none', __( 'It is already there.', 'sourceweb' ) );
}

/** The built-in rules again (the edits are dropped; the log keeps them). */
function sourceweb_ar_rules_reset() {
	$old = sourceweb_ar_rules();
	delete_option( SOURCEWEB_AR_RULES_OPTION );
	sourceweb_src_log( 'enrich', 'Review-queue rules reset to the built-in ones', $old, sourceweb_ar_default_rules() );
	return array( 'reset', __( 'The built-in rules are back.', 'sourceweb' ) );
}

/**
 * A rule row for the screen.
 *
 * @param array $r Row.
 * @return array
 */
function sourceweb_ar_rule_view( array $r ) {
	$conds = sourceweb_ar_conditions();
	return array(
		'id'           => $r['id'],
		'field'        => $r['field'],
		'field_label'  => SOURCEWEB_AR_FIELDS[ $r['field'] ],
		'cond'         => $r['cond'],
		'cond_label'   => $conds[ $r['cond'] ]['label'],
		'action'       => $r['action'],
		'action_label' => SOURCEWEB_AR_ACTIONS[ $r['action'] ],
		'on'           => (bool) $r['on'],
	);
}

/**
 * The reply every save, delete, move and reset route gives (the shape the screen's answerMsg() reads).
 *
 * @param array{0: string, 1: string} $res done and message.
 * @return WP_REST_Response|WP_Error
 */
function sourceweb_ar_answer( array $res ) {
	if ( 'error' === $res[0] ) {
		return new WP_Error( 'aw_ar_error', $res[1], array( 'status' => 400 ) );
	}
	return rest_ensure_response( array( 'done' => $res[0], 'tone' => 'none' === $res[0] ? 'info' : 'success', 'message' => $res[1] ) );
}

add_action(
	'rest_api_init',
	function () {
		$cap  = fn() => current_user_can( defined( 'SOURCEWEB_SRC_CAP' ) ? SOURCEWEB_SRC_CAP : 'manage_options' );
		$id   = array( 'type' => 'string', 'required' => true );
		$read = function ( WP_REST_Request $req ) {
			$rows = sourceweb_ar_rules();
			$cur  = (string) $req->get_param( 'id' );
			$one  = null;
			foreach ( $rows as $r ) {
				if ( $r['id'] === $cur ) {
					$one = sourceweb_ar_rule_view( $r );
				}
			}
			$conds = array();
			foreach ( sourceweb_ar_conditions() as $k => $c ) {
				$conds[] = array( 'value' => $k, 'label' => $c['label'], 'fields' => $c['fields'] );
			}
			$fields  = array();
			$actions = array();
			foreach ( SOURCEWEB_AR_FIELDS as $k => $l ) {
				$fields[] = array( 'value' => $k, 'label' => $l );
			}
			foreach ( SOURCEWEB_AR_ACTIONS as $k => $l ) {
				$actions[] = array( 'value' => $k, 'label' => $l );
			}
			return rest_ensure_response(
				array(
					'on'         => sourceweb_ar_on(),
					'stored'     => is_array( get_option( SOURCEWEB_AR_RULES_OPTION ) ),
					'rows'       => array_map( 'sourceweb_ar_rule_view', $rows ),
					'one'        => $one,
					'fields'     => $fields,
					'conditions' => $conds,
					'actions'    => $actions,
				)
			);
		};
		register_rest_route( 'sourceweb/v1', '/rules/autoresolve', array( 'methods' => 'GET', 'permission_callback' => $cap, 'callback' => $read, 'args' => array( 'id' => array( 'type' => 'string', 'default' => '' ) ) ) );
		register_rest_route(
			'sourceweb/v1',
			'/rules/autoresolve/save',
			array(
				'methods'             => 'POST',
				'permission_callback' => $cap,
				'callback'            => fn( WP_REST_Request $q ) => sourceweb_ar_answer( sourceweb_ar_rule_save( (array) $q->get_json_params(), (string) $q->get_param( 'original' ) ) ),
				'args'                => array( 'original' => array( 'type' => 'string', 'default' => '' ) ),
			)
		);
		register_rest_route( 'sourceweb/v1', '/rules/autoresolve/delete', array( 'methods' => 'POST', 'permission_callback' => $cap, 'callback' => fn( WP_REST_Request $q ) => sourceweb_ar_answer( sourceweb_ar_rule_delete( (string) $q['id'] ) ), 'args' => array( 'id' => $id ) ) );
		register_rest_route( 'sourceweb/v1', '/rules/autoresolve/move', array( 'methods' => 'POST', 'permission_callback' => $cap, 'callback' => fn( WP_REST_Request $q ) => sourceweb_ar_answer( sourceweb_ar_rule_move( (string) $q['id'], 'up' === $q['dir'] ? 'up' : 'down' ) ), 'args' => array( 'id' => $id, 'dir' => array( 'type' => 'string', 'default' => 'down' ) ) ) );
		register_rest_route(
			'sourceweb/v1',
			'/rules/field/reset',
			array(
				'methods'             => 'POST',
				'permission_callback' => $cap,
				'callback'            => function ( WP_REST_Request $q ) {
					$res = sourceweb_rules_field_reset( sanitize_key( (string) $q['field'] ) );
					$txt = array(
						/* translators: %s: field name. */
						'field_reset' => __( 'Field rule %s is the built-in rule again.', 'sourceweb' ),
						/* translators: %s: field name. */
						'none'        => __( 'Nothing to put back for %s: it already uses the built-in rule.', 'sourceweb' ),
						/* translators: %s: field name. */
						'nosuch'      => __( 'No such field: %s.', 'sourceweb' ),
					);
					return sourceweb_ar_answer( array( 'nosuch' === $res[0] ? 'error' : $res[0], sprintf( $txt[ $res[0] ], $res[1] ) ) );
				},
				'args'                => array( 'field' => $id ),
			)
		);
		register_rest_route( 'sourceweb/v1', '/rules/autoresolve/reset', array( 'methods' => 'POST', 'permission_callback' => $cap, 'callback' => fn() => sourceweb_ar_answer( sourceweb_ar_rules_reset() ) ) );
		register_rest_route(
			'sourceweb/v1',
			'/rules/autoresolve/switch',
			array(
				'methods'             => 'POST',
				'permission_callback' => $cap,
				'callback'            => function ( WP_REST_Request $q ) {
					$on = ! empty( $q->get_json_params()['on'] );
					update_option( 'aw_enrich_autoresolve', $on ? '1' : '0', false );
					sourceweb_src_log( 'enrich', 'Review-queue rules switched ' . ( $on ? 'on' : 'off' ), $on ? '0' : '1', $on ? '1' : '0' );
					return sourceweb_ar_answer( array( 'switched', $on ? __( 'The rules decide waiting values again.', 'sourceweb' ) : __( 'The rules are off: every value waits for a person.', 'sourceweb' ) ) );
				},
			)
		);
	}
);

/* ---------- Enrichment review: edit a waiting value, or delete it ---------- */

/** Fields whose waiting value is not plain text, so it is not edited by hand here. */
const SOURCEWEB_AR_NOT_EDITABLE = array( 'logo', 'photos', 'hours', 'services', 'place', 'merge_into', 'closed', 'animals', 'areas_served' );

/**
 * Change what a waiting value says (the person checking it corrects a typo, then applies it).
 *
 * @param int    $id    Row ID.
 * @param string $value New text.
 * @return array{0: string, 1: string} edited, none or error, and a message.
 */
function sourceweb_ar_value_edit( $id, $value ) {
	global $wpdb;
	$r = sourceweb_enrich_row( (int) $id );
	if ( ! $r || 'pending' !== $r['status'] || ! is_string( $r['value'] ) || in_array( $r['field'], SOURCEWEB_AR_NOT_EDITABLE, true ) ) {
		return array( 'error', __( 'Only a waiting text value can be edited.', 'sourceweb' ) );
	}
	$f   = (string) $r['field'];
	$new = trim( (string) $value );
	if ( in_array( $f, array( 'website', 'facebook', 'instagram', 'x', 'linkedin', 'youtube', 'donate_url', 'adopt_url' ), true ) ) {
		$new = esc_url_raw( $new );
	} elseif ( 'email' === $f ) {
		$new = sanitize_email( $new );
	} elseif ( in_array( $f, array( 'about', 'description' ), true ) ) {
		$new = sanitize_textarea_field( $new );
	} else {
		$new = sanitize_text_field( $new );
	}
	if ( '' === $new ) {
		return array( 'error', __( 'The value is empty or not valid for this field.', 'sourceweb' ) );
	}
	if ( $new === $r['value'] ) {
		return array( 'none', __( 'Nothing changed.', 'sourceweb' ) );
	}
	$wpdb->update( sourceweb_enrich_table(), array( 'value' => wp_json_encode( $new ), 'note' => substr( trim( (string) $r['note'] . ' Edited by a person.' ), 0, 190 ) ), array( 'id' => (int) $id, 'status' => 'pending' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	sourceweb_src_log( 'enrich', 'Waiting value ' . (int) $id . ' (' . $f . ', listing ' . (int) $r['listing_id'] . ') edited', $r['value'], $new );
	return array( 'edited', __( 'Value saved. Apply it when it is right.', 'sourceweb' ) );
}

/**
 * Delete a waiting value (it is gone from the queue; nothing was applied, so nothing on the listing changes).
 *
 * @param int $id Row ID.
 * @return array{0: string, 1: string} deleted or error, and a message.
 */
function sourceweb_ar_value_delete( $id ) {
	global $wpdb;
	$r = sourceweb_enrich_row( (int) $id );
	if ( ! $r || 'pending' !== $r['status'] ) {
		return array( 'error', __( 'Only a waiting value can be deleted.', 'sourceweb' ) );
	}
	$wpdb->delete( sourceweb_enrich_table(), array( 'id' => (int) $id, 'status' => 'pending' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	sourceweb_src_log( 'enrich', 'Waiting value ' . (int) $id . ' (' . $r['field'] . ', listing ' . (int) $r['listing_id'] . ') deleted', $r['value'], '' );
	return array( 'deleted', __( 'Value deleted.', 'sourceweb' ) );
}

add_action(
	'rest_api_init',
	function () {
		$cap = fn() => current_user_can( defined( 'SOURCEWEB_ENRICH_CAP' ) ? SOURCEWEB_ENRICH_CAP : 'edit_others_posts' );
		$id  = array( 'type' => 'integer', 'required' => true );
		register_rest_route( 'sourceweb/v1', '/enrichment/edit', array( 'methods' => 'POST', 'permission_callback' => $cap, 'callback' => fn( WP_REST_Request $q ) => sourceweb_ar_answer( sourceweb_ar_value_edit( (int) $q['id'], (string) $q->get_param( 'value' ) ) ), 'args' => array( 'id' => $id ) ) );
		register_rest_route( 'sourceweb/v1', '/enrichment/delete', array( 'methods' => 'POST', 'permission_callback' => $cap, 'callback' => fn( WP_REST_Request $q ) => sourceweb_ar_answer( sourceweb_ar_value_delete( (int) $q['id'] ) ), 'args' => array( 'id' => $id ) ) );
	}
);
