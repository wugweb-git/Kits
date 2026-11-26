<?php
/**
 * Tests the claim CRM plan (pure): which events are filed, with what contact and tag.
 *
 * Usage: php plugins/directoryweb/tests/claim-crm-tests.php
 *
 * @package directoryweb
 */

define( 'ABSPATH', __DIR__ . '/' );
function add_action( ...$a ) {}
function apply_filters( $tag, $v ) { return $v; }
require dirname( __DIR__ ) . '/includes/claim-crm.php';

$fails = 0; $count = 0;
function check( $ok, $label ) { global $fails, $count; ++$count; if ( ! $ok ) { ++$fails; echo "FAIL: $label\n"; } }

$claim = array( 'person' => array( 'name' => 'Asha Rao Iyer', 'email' => ' Asha@Example.org ' ), 'listing' => 7 );
$p = directoryweb_claim_crm_plan( 'created', $claim );
check( $p && 'received' === $p['event'] && 'Claim received' === $p['tag'] && 'asha@example.org' === $p['email'], 'created is filed as received, address tidied' );
check( $p && 'Asha' === $p['first_name'] && 'Rao Iyer' === $p['last_name'], 'the name is split into first and last' );
foreach ( array( 'approved' => 'Claim approved', 'rejected' => 'Claim rejected', 'revoked' => 'Claim revoked' ) as $ev => $tag ) {
	$p = directoryweb_claim_crm_plan( $ev, $claim );
	check( $p && $tag === $p['tag'], "$ev has its own tag" );
}
check( null === directoryweb_claim_crm_plan( 'pending', $claim ), 'a return to pending is not filed' );
check( null === directoryweb_claim_crm_plan( 'withdrawn', $claim ), 'withdrawn is not filed' );
check( null === directoryweb_claim_crm_plan( 'approved', array( 'person' => array( 'email' => 'nope' ) ) ), 'a bad address is not filed' );
check( null === directoryweb_claim_crm_plan( 'approved', array() ), 'a claim with no person is not filed' );
$p = directoryweb_claim_crm_plan( 'approved', array( 'person' => array( 'email' => 'a@b.co' ) ) );
check( $p && '' === $p['first_name'] && '' === $p['last_name'], 'no name is allowed' );
check( 4 === count( directoryweb_claim_crm_tags() ), 'four tags, one per filed event' );

check( isset( directoryweb_claim_crm_adapters()['fluentcrm'] ) && is_callable( directoryweb_claim_crm_adapters()['fluentcrm']['active'] ) && false === directoryweb_claim_crm_adapters()['fluentcrm']['active'](), 'FluentCRM is a built-in adapter and is inactive when FluentCRM is not installed' );

echo "{$count} checks, {$fails} failed\n";
exit( $fails ? 1 : 0 );
