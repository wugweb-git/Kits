<?php
/**
 * Tests the native claim notification messages (pure builder).
 *
 * Usage: php plugins/directoryweb/tests/claim-native-mail-tests.php
 *
 * @package directoryweb
 */

define( 'ABSPATH', __DIR__ . '/' );
function add_action( ...$a ) {}
function is_email( $s ) { return (bool) filter_var( $s, FILTER_VALIDATE_EMAIL ); }
require dirname( __DIR__ ) . '/includes/claim-native-mail.php';

$fails = 0; $count = 0;
function check( $ok, $label ) { global $fails, $count; ++$count; if ( ! $ok ) { ++$fails; echo "FAIL: $label\n"; } }

$claim = array( 'person' => array( 'name' => 'Asha', 'email' => 'asha@example.org' ), 'listing' => 7 );

$m = dw_claim_mail_build( 'created', $claim, 'Paws Home', 'owner@example.org', 'https://x.test/wp-admin/post.php?post=9', 'Demo' );
check( 'owner@example.org' === $m['to'] && false !== strpos( $m['subject'], 'New claim: Paws Home' ) && false !== strpos( $m['body'], 'asha@example.org' ) && false !== strpos( $m['body'], 'post=9' ), 'new claim goes to the site owner with a review link' );
check( null === dw_claim_mail_build( 'created', $claim, 'Paws Home', '', '', 'Demo' ), 'no owner address: no message' );

foreach ( array( 'approved', 'rejected', 'revoked' ) as $ev ) {
	$m = dw_claim_mail_build( $ev, $claim, 'Paws Home', 'owner@example.org', '', 'Demo' );
	check( $m && 'asha@example.org' === $m['to'] && false !== strpos( $m['body'], 'Paws Home' ) && 0 === strpos( $m['body'], 'Hello Asha' ), "$ev: the claimant is told, by name" );
}
check( false !== strpos( dw_claim_mail_build( 'approved', $claim, 'Paws Home', '', '', 'Demo' )['body'], 'verified mark' ), 'approval says what changed' );
check( null === dw_claim_mail_build( 'pending', $claim, 'Paws Home', 'o@x.org', '', 'Demo' ), 'back to pending sends nothing' );
check( null === dw_claim_mail_build( 'withdrawn', $claim, 'Paws Home', 'o@x.org', '', 'Demo' ), 'withdrawn by the claimant sends nothing' );
$bad = array( 'person' => array( 'name' => 'A', 'email' => 'not-an-email' ) );
check( null === dw_claim_mail_build( 'approved', $bad, 'X', 'o@x.org', '', 'Demo' ), 'a bad claimant address sends nothing' );
check( false !== strpos( dw_claim_mail_build( 'approved', array( 'person' => array( 'email' => 'a@b.co' ) ), '', '', '', 'Demo' )['body'], 'the listing' ), 'a missing listing name falls back to a plain phrase' );

echo "{$count} checks, {$fails} failed\n";
exit( $fails ? 1 : 0 );
