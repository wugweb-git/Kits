<?php
/**
 * Animal Writes site layer: what Kits Core's uninstall and deactivation also clean up for the moved features. Kits Core 1.4.0
 * fires these hooks; the names and the data are the ones Kits Core 1.3.x removed itself. Loaded whether or not Kits Core is
 * active, because Kits Core is deactivated before it is deleted.
 *
 * @package animalwrites-kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Options deleted with "Delete this plugin's data" (and written to Kits Core's uninstall backup file first).
add_filter(
	'kits_core_uninstall_options',
	function ( $options ) {
		return array_merge(
			(array) $options,
			array( 'aw_category_images', 'aw_thumb_map', 'aw_media_reuse_log', 'kits_form_raw_capture', 'kits_form_raw_days', 'aw_form_raw_db', 'kits_aw_carryover_done' )
		);
	}
);

// Every uninstall (ticked or not): the form copy's clean-up event.
add_action(
	'kits_core_uninstall',
	function () {
		wp_unschedule_hook( 'aw_raw_prune' );
	}
);

// Deactivation of Kits Core: events booked by the moved features come off (booked again where their switch is on).
add_action(
	'kits_core_deactivated',
	function () {
		wp_unschedule_hook( 'aw_thumb_rebuild' ); // a queued thumbnail map rebuild (thumbs.php)
		wp_unschedule_hook( 'aw_raw_prune' );
	}
);

// Only when the data deletion is ticked.
add_action(
	'kits_core_uninstall_data',
	function () {
		global $wpdb;
		delete_transient( 'aw_thumb_dupes_n' );
		foreach ( array( '_transient_', '_transient_timeout_' ) as $kind ) {
			$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like( $kind . 'aw_media_reuse_notice_' ) . '%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- uninstall: transients by prefix, once.
		}
		// The form copy table (forms/campaign-form.php): the copies are personal data and are not written to the backup file.
		$wpdb->query( $wpdb->prepare( 'DROP TABLE IF EXISTS %i', $wpdb->prefix . 'aw_form_raw' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery,WordPress.DB.DirectDatabaseQuery.SchemaChange -- uninstall: the form copy table, once.
		wp_unschedule_hook( 'aw_thumb_rebuild' ); // the thumbnail map rebuild (thumbs.php)
	}
);
