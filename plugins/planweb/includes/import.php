<?php
/**
 * Import from an earlier Dates list (plan 2.3). A site that kept its dates in an option can name it through the filter
 * planweb_import_source (see planweb_import_source()); with no source named, which is the default, nothing here runs.
 * Once PlanWeb is on, every element of that option (as stored) becomes one
 * entry: date, title and note copied as they are, Type reminder, Status idea. Keyed by date, title, note and copy
 * number, so identical elements stay separate and a second run adds nothing. The option is never written.
 * planweb_verify() compares the two one for one (PlanWeb → Calendar → Import, and wp planweb verify).
 *
 * @package planweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Where an earlier Dates list lives. Default: nothing, so a site without one never imports and shows no import screen.
 *
 * @return array{option: string, source: string, wait: string} option: the option holding a list of {date, title, note};
 *               source: the value written to the planweb_source meta of each imported entry; wait: an option that must
 *               be set before the first automatic run ('' for none).
 */
function planweb_import_source(): array {
	/**
	 * Name the option an earlier Dates list is stored in.
	 *
	 * @param array $source option, source and wait (all empty by default).
	 */
	$s = (array) apply_filters(
		'planweb_import_source',
		array(
			'option' => '',
			'source' => '',
			'wait'   => '',
		)
	);
	return array(
		'option' => (string) ( $s['option'] ?? '' ),
		'source' => (string) ( $s['source'] ?? '' ),
		'wait'   => (string) ( $s['wait'] ?? '' ),
	);
}

// An administrator's first admin page after PlanWeb is switched on (never Ajax, heartbeat or another role). Waits
// for Dates' 11 Nov note rename, so the notes copied are the renamed ones (or runs at once when there is no Dates
// list at all). It tries once: if a row fails, the result shows it and the Import button (or wp planweb import)
// runs it again.
add_action(
	'admin_init',
	function () {
		$src = planweb_import_source();
		if ( '' === $src['option'] || ! planweb_on() || get_option( 'planweb_import_done' ) || get_option( 'planweb_import_tried' ) || ! post_type_exists( PLANWEB_TYPE ) ) {
			return;
		}
		if ( wp_doing_ajax() || wp_doing_cron() || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		if ( is_array( get_option( $src['option'], null ) ) && '' !== $src['wait'] && ! get_option( $src['wait'] ) ) {
			return;
		}
		update_option( 'planweb_import_tried', time(), false );
		planweb_import();
	},
	30
);

/**
 * Run the import. Safe to run again: an element already imported (even if its entry is in the Trash) is skipped.
 *
 * @return array The result, also stored in the option planweb_import_result.
 */
function planweb_import(): array {
	$src = planweb_import_source();
	if ( '' === $src['option'] ) {
		return array(); // No earlier Dates list is named: nothing to import.
	}
	if ( ! add_option( 'planweb_import_lock', time(), '', false ) ) {
		$held = (int) get_option( 'planweb_import_lock' );
		if ( $held > time() - 5 * MINUTE_IN_SECONDS ) {
			return (array) get_option( 'planweb_import_result', array() );
		}
		update_option( 'planweb_import_lock', time(), false ); // A run that died long ago.
	}
	$stored = get_option( $src['option'], null );
	$map    = planweb_map_dates( $stored );
	$have   = array();
	$q      = new WP_Query(
		array(
			'post_type'      => PLANWEB_TYPE,
			'post_status'    => array( 'publish', 'trash' ),
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_key'       => 'planweb_source', // phpcs:ignore WordPress.DB.SlowDBQuery -- once.
			'meta_value'     => $src['source'], // phpcs:ignore WordPress.DB.SlowDBQuery -- once.
		)
	);
	foreach ( $q->posts as $id ) {
		$have[ (string) get_post_meta( $id, 'planweb_source_key', true ) ] = true;
	}
	$created  = 0;
	$skipped  = 0;
	$failed   = array();
	$personal = array();
	kses_remove_filters(); // Copy title and note exactly (WP-CLI has no user, so KSES would turn & into &amp;).
	foreach ( $map['rows'] as $r ) {
		if ( isset( $have[ $r['key'] ] ) ) {
			++$skipped;
			continue;
		}
		$id = wp_insert_post(
			wp_slash(
				array(
					'post_type'    => PLANWEB_TYPE,
					'post_status'  => 'publish',
					'post_title'   => $r['title'],
					'post_content' => $r['note'],
				)
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			$failed[] = array(
				'index' => $r['index'],
				'error' => $id->get_error_message(),
			);
			continue;
		}
		update_post_meta( $id, 'planweb_date', $r['date'] );
		update_post_meta( $id, 'planweb_status', 'idea' );
		update_post_meta( $id, 'planweb_repeat', 'none' );
		update_post_meta( $id, 'planweb_source', $src['source'] );
		update_post_meta( $id, 'planweb_source_key', $r['key'] );
		wp_set_object_terms( $id, array( 'reminder' ), 'planweb_type' );
		if ( '' !== planweb_personal_data_problem( $r['title'] . "\n" . $r['note'] ) ) {
			$personal[] = (int) $id;
		}
		$have[ $r['key'] ] = true;
		++$created;
	}
	kses_init();
	$result = array(
		'time'     => time(),
		'found'    => is_array( $stored ),
		'stored'   => is_array( $stored ) ? count( $stored ) : 0,
		'valid'    => count( $map['rows'] ),
		'created'  => $created,
		'skipped'  => $skipped,
		'invalid'  => $map['invalid'],
		'failed'   => $failed,
		'personal' => $personal,
	);
	update_option( 'planweb_import_result', $result, false );
	if ( ! $failed ) {
		update_option( 'planweb_import_done', time(), false );
	}
	delete_option( 'planweb_import_lock' );
	return $result;
}

/**
 * The imported entries (not those in the Trash), by import key.
 *
 * @return array key => [id, date, title, note].
 */
function planweb_imported_entries(): array {
	$out = array();
	$src = planweb_import_source();
	if ( '' === $src['option'] || ! post_type_exists( PLANWEB_TYPE ) ) {
		return $out;
	}
	$q = new WP_Query(
		array(
			'post_type'      => PLANWEB_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'no_found_rows'  => true,
			'meta_key'       => 'planweb_source', // phpcs:ignore WordPress.DB.SlowDBQuery -- a check screen.
			'meta_value'     => $src['source'], // phpcs:ignore WordPress.DB.SlowDBQuery -- a check screen.
		)
	);
	foreach ( $q->posts as $p ) {
		$out[ (string) get_post_meta( $p->ID, 'planweb_source_key', true ) ] = array(
			'id'    => (int) $p->ID,
			'date'  => (string) get_post_meta( $p->ID, 'planweb_date', true ),
			'title' => (string) $p->post_title,
			'note'  => (string) $p->post_content,
		);
	}
	return $out;
}

/**
 * The one-for-one check: the earlier Dates option as stored against the imported entries. Reads only.
 *
 * @return array planweb_compare() plus invalid (elements the import cannot take).
 */
function planweb_verify(): array {
	$src = planweb_import_source();
	$map = planweb_map_dates( '' === $src['option'] ? null : get_option( $src['option'], null ) );
	return planweb_compare( $map['rows'], planweb_imported_entries() ) + array( 'invalid' => $map['invalid'] );
}
