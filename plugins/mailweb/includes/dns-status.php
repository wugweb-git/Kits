<?php
/**
 * Pure DNS judgement for MailWeb's daily email-setup check (no DNS call, no WordPress call besides translation), so it
 * can be tested on the command line. The live lookups and the cron are in smtp.php.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Judges a domain's TXT records for SPF. Pure: no DNS call, so it can be tested.
 *
 * Valid when one `v=spf1` record includes Hostinger's sender list; "mismatch" when there is an SPF record without it;
 * "pending" when there is none; "multiple" when there are several (SPF allows only one, receivers then ignore all).
 *
 * @param string[] $txt TXT record strings of the domain.
 * @return array{status: string, message: string}
 */
function mailweb_spf_status( array $txt ): array {
	$spf = array_values(
		array_filter(
			$txt,
			static function ( $t ) {
				return 0 === stripos( ltrim( (string) $t ), 'v=spf1' );
			}
		)
	);
	if ( count( $spf ) > 1 ) {
		return array(
			'status'  => 'multiple',
			'message' => __( 'More than one SPF record found; keep only one.', 'mailweb' ),
		);
	}
	if ( ! $spf ) {
		return array(
			'status'  => 'pending',
			'message' => __( 'No SPF record detected yet (DNS propagation may take up to 24h).', 'mailweb' ),
		);
	}
	if ( false === stripos( $spf[0], '_spf.mail.hostinger.com' ) ) {
		return array(
			'status'  => 'mismatch',
			'message' => __( 'SPF record found but it does not include Hostinger mail.', 'mailweb' ),
		);
	}
	return array(
		'status'  => 'valid',
		'message' => __( 'SPF record includes Hostinger mail.', 'mailweb' ),
	);
}
