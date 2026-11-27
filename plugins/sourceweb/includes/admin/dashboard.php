<?php
/**
 * Helpers for the Overview and for a WordPress Dashboard box: the workers with their last run and status (problems
 * first) and the AI keys refused. Read-only: the workers' stored run reports and the AI models' saved statuses; no
 * remote calls. SourceWeb adds no Dashboard box itself; a site that wants one adds it with these helpers.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * AI keys refused or out of credit: the same rule as the Dashboard's AI tile (sourceweb_sourcing_ai_counts()).
 * Null when the keys are not saved on the AI models screen yet. Counts only; never reads a key's value.
 */
function sourceweb_sourcing_dash_ai_refused(): ?int {
	$rows = get_option( 'aw_ai_models', null );
	if ( ! is_array( $rows ) ) {
		return null;
	}
	$bad = 0;
	foreach ( $rows as $r ) {
		if ( ! is_array( $r ) || empty( $r['key'] ) ) {
			continue;
		}
		$st = (string) ( $r['status'] ?? 'unchecked' );
		if ( ! in_array( $st, array( 'tool', 'works', 'limited', 'unchecked', 'card' ), true ) ) {
			++$bad;
		}
	}
	return $bad;
}

/**
 * One row per worker (sourceweb_workers_all(): the registry's, then Planned), problems first.
 *
 * @return array[] name, last (Unix or 0), status (failed, late, running, ok, off), problem (bool).
 */
function sourceweb_sourcing_dash_workers(): array {
	$kinds = array();
	foreach ( array_keys( sourceweb_workers_problems() ) as $k ) {
		list( $file, $kind )              = explode( ':', $k, 2 );
		$kinds[ sourceweb_worker_id( $file ) ][] = $kind;
	}
	$rows = array();
	foreach ( sourceweb_workers_all() as $id => $w ) {
		$last  = sourceweb_workers_last( $w['file'] );
		$k     = $kinds[ $id ] ?? array();
		$reg   = (array) ( $w['registry'] ?? array() );
		$sched = ! empty( $reg['crons'] ) || ! empty( $reg['after'] );
		if ( array_intersect( $k, array( 'late', 'stuck' ) ) ) {
			$status = 'late';
		} elseif ( $k ) {
			$status = 'failed';
		} elseif ( $w['planned'] || ! $sched ) {
			$status = 'off'; // Planned, or run by hand only
		} elseif ( ! $last ) {
			$status = 'off'; // scheduled but has never reported: not set up on this site yet, so not an alarm
		} elseif ( 'running' === (string) ( $last['result'] ?? '' ) ) {
			$status = 'running';
		} else {
			$status = 'ok';
		}
		$rows[] = array(
			'name'    => (string) $w['name'],
			'last'    => $last ? (int) ( $last['started'] ?? 0 ) : 0,
			'status'  => $status,
			'problem' => in_array( $status, array( 'failed', 'late' ), true ),
		);
	}
	$order = array_flip( array( 'failed', 'late', 'running', 'ok', 'off' ) );
	usort( $rows, fn( $a, $b ) => $order[ $a['status'] ] <=> $order[ $b['status'] ] ); // stable: the registry's order within a status
	return $rows;
}
