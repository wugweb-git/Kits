<?php
/**
 * Deploy status for the deploy gate (3 Nov 2026).
 *
 * Each deploy replaces the deployed folder, so for a few seconds the plugins are missing. A FluentCRM campaign batch
 * that starts in that window sends without mailweb's mailbox and fails. A deploy check can read
 * GET /wp-json/aw/v1/deploy-status and hold the deploy while it says sending.
 * Since 1.3.3 it needs manage_options unless the option or filter kits_public_gate_routes is on;
 * it returns only a yes or no, never campaign names, ids or counts.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** True while a FluentCRM campaign is running or scheduled and still has emails waiting to go out. */
function kits_mail_sending() {
	global $wpdb;
	$c = $wpdb->prefix . 'fc_campaigns';
	$e = $wpdb->prefix . 'fc_campaign_emails';
	if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $c ) ) ) !== $c ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		return false; // FluentCRM not installed: nothing can be sending.
	}
	// Same rule as the old SSH check in tools/aw-ship.sh.
	return (bool) $wpdb->get_var( $wpdb->prepare( "SELECT 1 FROM %i c JOIN %i e ON e.campaign_id = c.id WHERE c.status IN ('working','scheduled') AND e.status IN ('pending','scheduled','processing') LIMIT 1", $c, $e ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
}

/**
 * Whether the deploy gate's routes (aw/v1/deploy-status, and any route a site layer adds with this permission) answer without a login. Off by default: they
 * then need manage_options. The option kits_public_gate_routes is '1', or the filter kits_public_gate_routes returns true.
 */
function kits_public_gate_routes_on(): bool {
	return (bool) apply_filters( 'kits_public_gate_routes', '1' === (string) get_option( 'kits_public_gate_routes', '0' ) );
}

/** The permission_callback of the deploy gate's routes. */
function kits_gate_route_permission(): bool {
	return kits_public_gate_routes_on() || current_user_can( 'manage_options' );
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'aw/v1',
			'/deploy-status',
			array(
				'methods'             => 'GET',
				'permission_callback' => 'kits_gate_route_permission', // manage_options, or public when kits_public_gate_routes is on (the deploy gate reads it without logging in).
				'callback'            => function () {
					$r = new WP_REST_Response( array( 'sending' => kits_mail_sending() ), 200 );
					$r->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
					$r->header( 'X-LiteSpeed-Cache-Control', 'no-cache' );
					return $r;
				},
			)
		);
	}
);
