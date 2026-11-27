<?php
/**
 * Schedule (plan §6, IST): the daily run at 07:10 (after the Search demand refresh at 07:00) and the rollup at 23:30.
 * Each step records its own result in the run log, so one failure never hides the others.
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const AW_SI_CRON_DAILY          = 'aw_si_daily';
const AW_SI_CRON_ROLLUP         = 'aw_si_rollup';
const INSIGHTWEB_CRON_TELEMETRY = 'insightweb_daily_telemetry_cron';

/**
 * The daily run: tables, the one-time seed, Search Console, roles, then the calculation. Skipped while the owner has
 * switched Search Insights off by deleting its data, unless started by hand.
 *
 * @param bool $by_hand Started from Settings or WP-CLI: switches Search Insights on again.
 */
function insightweb_si_daily( bool $by_hand = false ): array {
	if ( get_option( 'aw_si_off' ) ) {
		if ( ! $by_hand ) {
			return array( 'off' => true );
		}
		delete_option( 'aw_si_off' );
	}
	insightweb_si_install();
	insightweb_si_run_start( 'gsc' );
	$out        = array( 'seed' => insightweb_si_seed() );
	$gsc        = insightweb_si_gsc_run();
	$out['gsc'] = $gsc;
	// Roles, the calculation and topics are one entry in the run log ("Keyword roles"): its Detail shows the seed's
	// problem, the role counts, the priorities worked out and any write that failed.
	insightweb_si_run_start( 'roles' );
	$errors = array();
	$failed = '';
	try {
		$out['roles'] = insightweb_si_sync_roles();
	} catch ( Throwable $e ) {
		$failed       = $e->getMessage();
		$out['roles'] = array();
	}
	try {
		$out['compute'] = insightweb_si_compute();
	} catch ( Throwable $e ) {
		$errors[] = __( 'Priorities could not be worked out: ', 'insightweb' ) . $e->getMessage();
	}
	try {
		$out['topics'] = insightweb_si_sync_topics(); // After the calculation: it reads the page Google shows most.
	} catch ( Throwable $e ) {
		$errors[] = __( 'Topics could not be updated: ', 'insightweb' ) . $e->getMessage();
	}
	$info           = $out['roles'];
	$info['errors'] = array_merge( $errors, (array) ( $info['errors'] ?? array() ), (array) ( $out['compute']['errors'] ?? array() ) );
	foreach ( array( 'P1', 'P2', 'P3', 'P4' ) as $p ) {
		$info['prio'][ $p ] = (int) ( $out['compute'][ $p ] ?? 0 );
	}
	if ( '' !== $failed ) {
		insightweb_si_run_fail( 'roles', $failed ); // the priorities above still ran, on yesterday's roles
	} else {
		insightweb_si_run_ok( 'roles', $info );
	}
	return $out;
}
add_action( AW_SI_CRON_DAILY, fn() => insightweb_si_daily() );

/**
 * Execute daily telemetry refresh: Search Console sync and metric compute.
 */
function insightweb_daily_telemetry_refresh(): array {
	if ( get_option( 'aw_si_off' ) ) {
		return array( 'off' => true );
	}
	$res = insightweb_si_daily();
	if ( function_exists( 'insightweb_dash_request' ) ) {
		insightweb_dash_request();
	}
	return $res;
}
add_action( INSIGHTWEB_CRON_TELEMETRY, 'insightweb_daily_telemetry_refresh' );

/** The nightly rollup, with its result in the run log. */
function insightweb_si_rollup_cron(): void {
	if ( ! insightweb_si_ready() ) {
		return;
	}
	insightweb_si_run_start( 'rollup' );
	try {
		$result = insightweb_si_rollup();
		if ( ! empty( $result['error'] ) ) {
			insightweb_si_run_fail( 'rollup', $result['error'] );
		} else {
			insightweb_si_run_ok( 'rollup', $result );
		}
	} catch ( Throwable $e ) {
		insightweb_si_run_fail( 'rollup', $e->getMessage() );
	}
}
add_action( AW_SI_CRON_ROLLUP, 'insightweb_si_rollup_cron' );

add_action(
	'init',
	function () {
		if ( get_option( 'aw_si_off' ) ) {
			return; // Switched off by Delete data.
		}
		$tz = wp_timezone();
		if ( ! wp_next_scheduled( AW_SI_CRON_DAILY ) ) {
			wp_schedule_event( ( new DateTimeImmutable( 'tomorrow 07:10', $tz ) )->getTimestamp(), 'daily', AW_SI_CRON_DAILY );
		}
		if ( ! wp_next_scheduled( AW_SI_CRON_ROLLUP ) ) {
			wp_schedule_event( ( new DateTimeImmutable( 'today 23:30', $tz ) )->getTimestamp(), 'daily', AW_SI_CRON_ROLLUP );
		}
		if ( ! wp_next_scheduled( INSIGHTWEB_CRON_TELEMETRY ) ) {
			wp_schedule_event( ( new DateTimeImmutable( 'tomorrow 07:10', $tz ) )->getTimestamp(), 'daily', INSIGHTWEB_CRON_TELEMETRY );
		}
	}
);

add_filter(
	'aw_si_cron_hooks',
	fn( $hooks ) => array_merge( (array) $hooks, array( INSIGHTWEB_CRON_TELEMETRY ) )
);
