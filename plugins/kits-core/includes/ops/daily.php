<?php
/**
 * The daily event aw_daily. Other plugins hook their daily jobs
 * onto it (DirectoryWeb's re-verification, SourceWeb's opportunities, Kits Core's thumbnails), so the event keeps its
 * name. It is booked here on init when it is missing and switched on (option or filter kits_daily_event, off by default
 * since 1.3.3); nothing runs on it by itself.
 *
 * WP-Cron runs on traffic; on the live server a real cron hits wp-cron.php (cron-health.php shows who calls it).
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Whether the aw_daily event is booked. Off by default: the option kits_daily_event is '1', or the filter
 * kits_daily_event returns true (a plugin that hooks a job onto aw_daily turns it on that way).
 */
function kits_daily_event_on(): bool {
	return (bool) apply_filters( 'kits_daily_event', '1' === (string) get_option( 'kits_daily_event', '0' ) );
}

add_action(
	'init',
	function () {
		$booked = wp_next_scheduled( 'aw_daily' );
		if ( ! kits_daily_event_on() ) {
			if ( $booked ) {
				wp_unschedule_hook( 'aw_daily' );
			}
			return;
		}
		if ( ! $booked ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'aw_daily' );
		}
	}
);
