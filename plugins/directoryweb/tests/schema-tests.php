<?php
/**
 * Tests the canonical schema, listing types and form mapping (pure).
 *
 * Usage: php plugins/directoryweb/tests/schema-tests.php
 *
 * @package directoryweb
 */

define( 'ABSPATH', __DIR__ . '/' );
require dirname( __DIR__ ) . '/includes/schema/schema-model.php';
require dirname( __DIR__ ) . '/includes/schema/integrations-model.php';

$fails = 0; $count = 0;
function check( $ok, $label ) { global $fails, $count; ++$count; if ( ! $ok ) { ++$fails; echo "FAIL: $label\n"; } }

// Fields.
check( null === directoryweb_field_clean( array( 'key' => '', 'type' => 'text' ) ), 'a field needs a key' );
check( null === directoryweb_field_clean( array( 'key' => 'a', 'type' => 'hologram' ) ), 'an unknown type is refused' );
check( null === directoryweb_field_clean( array( 'key' => 'a', 'type' => 'select' ) ), 'a select needs choices' );
$f = directoryweb_field_clean( array( 'key' => 'Phone Number!', 'type' => 'phone', 'required' => 1 ) );
check( $f && 'phonenumber' === $f['key'] && $f['required'], 'the key is tidied' );
$f = directoryweb_field_clean( array( 'key' => 'a', 'type' => 'text', 'pattern' => '(' ) );
check( $f && '' === $f['pattern'], 'a pattern that does not compile is dropped' );
$fs = directoryweb_fields_clean( array( array( 'key' => 'a', 'label' => 'One' ), array( 'key' => 'a', 'label' => 'Two' ), array( 'key' => '' ) ) );
check( 1 === count( $fs ) && 'Two' === $fs['a']['label'], 'a later field with the same key replaces an earlier one' );

// From the existing meta.
$seed = directoryweb_fields_from_meta_schema( array( 'x_email' => array( 'string', array( 'p' ), 'Email' ), 'x_verified' => array( 'boolean', array( 'p' ), 'Verified' ) ), 'x_' );
check( isset( $seed['email'], $seed['verified'] ) && 'boolean' === $seed['verified']['type'] && 'Email' === $seed['email']['label'], 'the existing meta list becomes fields, prefix taken off' );

// Types.
$t = directoryweb_listing_types_clean( array( array( 'id' => 'Clinic', 'fields' => array( 'email', 'ghost', 'email' ) ) ), array( 'email', 'website' ) );
check( isset( $t['clinic'] ) && array( 'email' ) === $t['clinic']['fields'], 'a type keeps only existing fields, once each' );
check( array() === directoryweb_listing_types_clean( array( array( 'label' => 'No id' ) ), array() ), 'a type needs an id' );

// Validation.
$fields = directoryweb_fields_clean( array(
	array( 'key' => 'name', 'type' => 'text', 'required' => true, 'max' => 10 ),
	array( 'key' => 'email', 'type' => 'email' ),
	array( 'key' => 'site', 'type' => 'url' ),
	array( 'key' => 'beds', 'type' => 'number', 'min' => 1, 'max' => 50 ),
	array( 'key' => 'since', 'type' => 'date' ),
	array( 'key' => 'kind', 'type' => 'select', 'options' => array( 'shelter', 'clinic' ) ),
	array( 'key' => 'animals', 'type' => 'multiselect', 'options' => array( 'dogs', 'cats' ) ),
	array( 'key' => 'open', 'type' => 'boolean' ),
	array( 'key' => 'tel', 'type' => 'phone' ),
	array( 'key' => 'code', 'type' => 'text', 'pattern' => '^[A-Z]{3}$' ),
) );
list( $ok, $bad ) = directoryweb_schema_validate( array( 'name' => ' Paws ', 'email' => 'a@b.co', 'site' => 'https://x.org', 'beds' => '12', 'since' => '2020-02-29', 'kind' => 'clinic', 'animals' => array( 'dogs' ), 'open' => 'yes', 'tel' => '+91 98765 43210', 'code' => 'ABC', 'junk' => 'dropped' ), $fields );
check( ! $bad && 'Paws' === $ok['name'] && 12 === $ok['beds'] && 1 === $ok['open'] && ! isset( $ok['junk'] ), 'good values pass, are tidied, and unknown keys are dropped' );
list( , $bad ) = directoryweb_schema_validate( array(), $fields );
check( isset( $bad['name'] ) && 1 === count( $bad ), 'only the required field is missing' );
list( , $bad ) = directoryweb_schema_validate( array( 'name' => 'This name is far too long', 'email' => 'nope', 'site' => 'ftp://x', 'beds' => '99', 'since' => '2021-02-30', 'kind' => 'zoo', 'animals' => array( 'cows' ), 'tel' => 'abc', 'code' => 'abc' ), $fields );
check( array( 'name', 'email', 'site', 'beds', 'since', 'kind', 'animals', 'tel', 'code' ) === array_keys( $bad ), 'every bad value is reported by its field' );
list( $ok ) = directoryweb_schema_validate( array( 'name' => 'A' ), $fields );
check( ! isset( $ok['email'] ) && 0 === $ok['open'], 'an empty optional field is left out; a boolean is 0 or 1' );

// Adapters and mappings.
$ad = directoryweb_adapters_clean( array(
	array( 'id' => 'wpforms', 'active' => 'strlen', 'forms' => 'strlen', 'fields' => 'strlen' ),
	array( 'id' => 'broken', 'active' => 'nope_not_a_function', 'forms' => 'strlen', 'fields' => 'strlen' ),
	array( 'id' => '', 'active' => 'strlen', 'forms' => 'strlen', 'fields' => 'strlen' ),
) );
check( array( 'wpforms' ) === array_keys( $ad ), 'an adapter must follow the contract' );
$types = directoryweb_listing_types_clean( array( array( 'id' => 'clinic', 'fields' => array( 'name', 'email' ) ) ), array( 'name', 'email', 'site' ) );
$m = directoryweb_mapping_clean( array( 'provider' => 'WPForms', 'form' => 7, 'type' => 'clinic', 'enabled' => 1, 'fields' => array( 'f1' => 'name', 'f2' => 'email', 'f3' => 'site', 'f4' => 'name' ) ), $types );
check( $m && array( 'f1' => 'name', 'f2' => 'email' ) === $m['fields'], 'a mapping keeps only the type\'s fields, each once' );
check( 'pending' === $m['status'], 'a submission is pending unless draft is chosen' );
check( null === directoryweb_mapping_clean( array( 'provider' => 'x', 'form' => '1', 'type' => 'ghost' ), $types ), 'a mapping needs an existing type' );
check( $m === directoryweb_mapping_for( array( $m ), 'wpforms', '7' ), 'the mapping for a form is found' );
$off = $m; $off['enabled'] = false;
check( null === directoryweb_mapping_for( array( $off ), 'wpforms', '7' ), 'a mapping that is off is not used' );
check( array( 'name' => 'Paws', 'email' => 'a@b.co' ) === directoryweb_map_submission( $m, array( 'f1' => 'Paws', 'f2' => 'a@b.co', 'f9' => 'x' ) ), 'a submission is mapped to canonical keys' );
// Two forms from two providers feed one type.
$m2 = directoryweb_mapping_clean( array( 'provider' => 'gravityforms', 'form' => '2', 'type' => 'clinic', 'enabled' => 1, 'fields' => array( '1.3' => 'name' ) ), $types );
check( directoryweb_mapping_for( array( $m, $m2 ), 'gravityforms', '2' )['type'] === $m['type'], 'forms from different providers map into the same listing type' );

echo $fails ? "FAILED: $fails of $count\n" : "OK: $count checks\n";
exit( $fails ? 1 : 0 );
