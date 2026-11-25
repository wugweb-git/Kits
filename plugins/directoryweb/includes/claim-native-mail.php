<?php
/**
 * Notification emails for native claims (claim-native.php): plain text through wp_mail(), no other plugin needed.
 *
 * The message builder (pure, tested) and a sender for callers that want this wording. The live claim emails are
 * sent by claim-native.php through dw_claim_mail(), which honours the "Claim emails" Settings switch and lets MailWeb
 * (or any mailer) take a message over: return false from the `directoryweb_claim_mail` filter and nothing is sent.
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
	$to_admin = function_exists( 'dw_claim_notify_address' ) ? dw_claim_notify_address() : (string) get_option( 'admin_email', '' );
	$msg      = dw_claim_mail_build(
		$event,
		$claim,
		html_entity_decode( (string) get_the_title( (int) $claim['listing'] ), ENT_QUOTES, 'UTF-8' ),
		$to_admin,
		(string) get_edit_post_link( $id, 'raw' ),
		wp_specialchars_decode( (string) get_bloginfo( 'name' ), ENT_QUOTES )
	);
	if ( null === $msg ) {
		return;
	}
	if ( function_exists( 'dw_claim_mail' ) ) {
		dw_claim_mail( $msg['to'], $msg['subject'], $msg['body'], $event, $claim ); // the Settings switch and the directoryweb_claim_mail filter apply
	}
}

// No hooks here: claim-native.php sends the claim emails (directoryweb_claim_created / _transitioned) through
// dw_claim_mail(), which obeys the Settings switch and the directoryweb_claim_mail filter. Registering this file's
// sender as well would email everyone twice.
