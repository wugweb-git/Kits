<?php
/**
 * Notification emails for native claims (claim-native.php): plain text through wp_mail(), no other plugin needed.
 *
 * A site owner is told when a claim comes in; the claimant is told when it is approved, rejected or revoked.
 * MailWeb (or any mailer) can take over per message: return false from the `directoryweb_claim_mail` filter and nothing is sent here.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Builds one message, or null when the event sends none. Pure: no mail is sent and no state is read.
 *
 * @param string $event         'created' or a state the claim moved to.
 * @param array  $claim         dw_claim_get().
 * @param string $listing_title Listing name.
 * @param string $admin_email   Where new claims are reported.
 * @param string $review_url    Link to the claim in wp-admin.
 * @param string $site          Site name.
 * @return array{to:string,subject:string,body:string}|null
 */
function dw_claim_mail_build( string $event, array $claim, string $listing_title, string $admin_email, string $review_url, string $site ): ?array {
	$name  = (string) ( $claim['person']['name'] ?? '' );
	$email = (string) ( $claim['person']['email'] ?? '' );
	$sign  = "\n\n" . $site;
	$what  = '' !== $listing_title ? $listing_title : 'the listing';
	if ( 'created' === $event ) {
		if ( '' === $admin_email ) {
			return null;
		}
		return array(
			'to'      => $admin_email,
			'subject' => sprintf( '[%s] New claim: %s', $site, $what ),
			'body'    => sprintf( "%s (%s) sent a claim for %s.\n\nReview it: %s", '' !== $name ? $name : 'Someone', $email, $what, $review_url ) . $sign,
		);
	}
	$lines = array(
		'approved' => array( 'Your claim was approved', "Your claim for %s was approved. The changes you sent are now on the listing, and it carries the verified mark." ),
		'rejected' => array( 'Your claim was not approved', "Your claim for %s was not approved. If you think this is a mistake, reply to this email." ),
		'revoked'  => array( 'Your claim was withdrawn by the site', "The approval of your claim for %s was taken back. The verified mark is removed until it is reviewed again." ),
	);
	if ( ! isset( $lines[ $event ] ) || '' === $email || ! is_email( $email ) ) {
		return null;
	}
	return array(
		'to'      => $email,
		'subject' => sprintf( '[%s] %s: %s', $site, $lines[ $event ][0], $what ),
		'body'    => ( '' !== $name ? "Hello {$name},\n\n" : '' ) . sprintf( $lines[ $event ][1], $what ) . $sign,
	);
}

/**
 * Sends one built message unless a filter claims it.
 *
 * @param string $event  Event name.
 * @param int    $id     Claim ID.
 */
function dw_claim_mail_send( string $event, int $id ): void {
	$claim = function_exists( 'dw_claim_get' ) ? dw_claim_get( $id ) : null;
	if ( ! $claim ) {
		return;
	}
	$to_admin = (string) get_option( 'directoryweb_claim_notify', get_option( 'admin_email', '' ) );
	$msg      = dw_claim_mail_build(
		$event,
		$claim,
		html_entity_decode( (string) get_the_title( (int) $claim['listing'] ), ENT_QUOTES, 'UTF-8' ),
		$to_admin,
		(string) get_edit_post_link( $id, 'raw' ),
		wp_specialchars_decode( (string) get_bloginfo( 'name' ), ENT_QUOTES )
	);
	if ( null === $msg || false === apply_filters( 'directoryweb_claim_mail', true, $event, $msg, $claim ) ) {
		return;
	}
	wp_mail( $msg['to'], $msg['subject'], $msg['body'] );
}

add_action(
	'directoryweb_claim_created',
	function ( $id ) {
		dw_claim_mail_send( 'created', (int) $id );
	}
);
add_action(
	'directoryweb_claim_transitioned',
	function ( $id, $from, $to ) {
		unset( $from );
		dw_claim_mail_send( (string) $to, (int) $id );
	},
	10,
	3
);
