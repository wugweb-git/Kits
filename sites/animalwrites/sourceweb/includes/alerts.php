<?php
/**
 * Animal Writes: the alert emails to the site administrator that SourceWeb 0.3.x sent when its Site-specific extras
 * were on. SourceWeb 0.4.0 fires actions and a filter instead; this file sends the same emails, unchanged. Loaded by
 * ../site.php.
 *
 * @package animalwrites-sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Email the owner about ingestion problems (the action fires hourly, and after every heartbeat). One email per 12 hours for the same problems. */
add_action(
	'sourceweb_ingest_problems',
	function ( $problems ) {
		if ( ! $problems ) {
			delete_transient( 'aw_ingest_alert_mailed' );
			return;
		}
		$kinds = implode( ',', array_keys( $problems ) );
		$sent  = (string) get_transient( 'aw_ingest_alert_mailed' );
		if ( $sent && ! array_diff( array_keys( $problems ), explode( ',', $sent ) ) ) {
			return; // the same problems were emailed in the last 12 hours
		}
		$hb   = (array) get_option( 'aw_ingest_heartbeat', array() );
		$body = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) . " ingestion needs attention:\n\n- " . implode( "\n- ", $problems ) . "\n\n" . ( ! empty( $hb['last_link'] ) ? 'Last run: ' . $hb['last_link'] . "\n" : '' ) . "Runs: https://github.com/wugweb-git/animal-writes-workers/actions\n";
		if ( wp_mail( get_option( 'admin_email' ), wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) . ': ingestion problem — ' . reset( $problems ), $body ) ) {
			set_transient( 'aw_ingest_alert_mailed', $kinds, 12 * HOUR_IN_SECONDS );
		}
	}
);

/** Email the owner about worker problems, once per new set. */
add_action(
	'sourceweb_workers_problems',
	function ( $problems ) {
		if ( ! $problems ) {
			delete_transient( 'aw_workers_alert_mailed' );
			return;
		}
		$sent = (string) get_transient( 'aw_workers_alert_mailed' );
		if ( $sent && ! array_diff( array_keys( $problems ), explode( ',', $sent ) ) ) {
			return; // the same problems were emailed in the last 12 hours
		}
		$body = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) . " workers need attention:\n\n- " . implode( "\n- ", $problems ) . "\n\nWorkers: " . admin_url( 'admin.php?page=aw-sourcing&tab=workers' ) . "\nRuns: https://github.com/wugweb-git/animal-writes-workers/actions\n";
		if ( wp_mail( get_option( 'admin_email' ), wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) . ': worker problem — ' . reset( $problems ), $body ) ) {
			set_transient( 'aw_workers_alert_mailed', implode( ',', array_keys( $problems ) ), 12 * HOUR_IN_SECONDS );
		}
	}
);

/**
 * The workers' relevance check could not run (no AI service answered): items were held back, so the owner gets an
 * email (owner, 12 Oct 2026). At most one email per 6 hours; the count adds up in between.
 */
add_filter(
	'sourceweb_relevance_alert',
	function ( $response, $n, $run, $link ) {
		$total = $n + (int) get_option( 'aw_relevance_alert_pending', 0 );
		if ( get_transient( 'aw_relevance_alert_sent' ) ) {
			update_option( 'aw_relevance_alert_pending', $total, false );
			return array( 'status' => 'queued', 'held' => $total );
		}
		$sent = wp_mail(
			get_option( 'admin_email' ),
			wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) . ': ' . $total . ' item(s) held — the relevance check could not run',
			"The workers found {$total} new item(s) but no AI service answered the relevance check, so nothing was created for them. They are tried again on the next run (every 6 hours).\n\nRun: {$run}\n" . ( $link ? "Details: {$link}\n" : '' ) . "\nUsually this means the free daily limit of the AI keys is used up. Adding credit to a key (OpenRouter, OpenAI, DeepSeek …) clears it."
		);
		if ( $sent ) {
			set_transient( 'aw_relevance_alert_sent', 1, 6 * HOUR_IN_SECONDS );
			delete_option( 'aw_relevance_alert_pending' );
		}
		return array( 'status' => $sent ? 'sent' : 'mail failed', 'held' => $total );
	},
	10,
	4
);
