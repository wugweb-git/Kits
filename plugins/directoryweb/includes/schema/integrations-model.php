<?php
/**
 * Form integrations (pure): the contract a form provider's adapter follows, and the mapping from a provider's form
 * fields into the canonical schema. Several forms, from several providers, map into the same listing type.
 *
 * Adapter contract (an array, so any plugin can supply one through the `directoryweb_form_adapters` filter):
 *   id        string    'fluentforms', 'wpforms', 'gravityforms', 'cf7' …
 *   label     string
 *   active    callable  () => bool: the provider's plugin is installed and active
 *   forms     callable  () => list of [ id, title ]
 *   fields    callable  ( $form_id ) => list of [ id, label ]: the form's fields
 *   (the provider tells DirectoryWeb about a new submission by calling directoryweb_form_submission(); see schema.php)
 *
 * A mapping (one per form): provider, form (id), type (listing type id), fields (provider field id => canonical key),
 * status (the post status a submission gets: pending or draft), enabled.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * An adapter tidied, or null when it does not follow the contract.
 *
 * @param array $a Raw adapter.
 * @return array|null
 */
function directoryweb_adapter_clean( array $a ): ?array {
	$id = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $a['id'] ?? '' ) ) );
	foreach ( array( 'active', 'forms', 'fields' ) as $fn ) {
		if ( ! isset( $a[ $fn ] ) || ! is_callable( $a[ $fn ] ) ) {
			return null;
		}
	}
	if ( '' === $id ) {
		return null;
	}
	return array(
		'id'     => $id,
		'label'  => '' !== trim( (string) ( $a['label'] ?? '' ) ) ? trim( (string) $a['label'] ) : $id,
		'active' => $a['active'],
		'forms'  => $a['forms'],
		'fields' => $a['fields'],
	);
}

/**
 * Adapters tidied; a later one with the same id replaces an earlier one.
 *
 * @param array $list Raw adapters.
 * @return array<string, array> id => adapter.
 */
function directoryweb_adapters_clean( array $list ): array {
	$out = array();
	foreach ( $list as $a ) {
		$c = is_array( $a ) ? directoryweb_adapter_clean( $a ) : null;
		if ( $c ) {
			$out[ $c['id'] ] = $c;
		}
	}
	return $out;
}

/**
 * One mapping tidied, or null when it cannot be one. Only fields of the listing type are mapped, each canonical field
 * at most once.
 *
 * @param array $m          Raw mapping.
 * @param array $types      id => listing type.
 * @return array|null
 */
function directoryweb_mapping_clean( array $m, array $types ): ?array {
	$provider = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $m['provider'] ?? '' ) ) );
	$form     = trim( (string) ( $m['form'] ?? '' ) );
	$type     = (string) ( $m['type'] ?? '' );
	if ( '' === $provider || '' === $form || ! isset( $types[ $type ] ) ) {
		return null;
	}
	$fields = array();
	$used   = array();
	foreach ( (array) ( $m['fields'] ?? array() ) as $from => $to ) {
		$from = trim( (string) $from );
		$to   = (string) $to;
		if ( '' !== $from && in_array( $to, $types[ $type ]['fields'], true ) && ! isset( $used[ $to ] ) ) {
			$fields[ $from ] = $to;
			$used[ $to ]     = true;
		}
	}
	return array(
		'provider' => $provider,
		'form'     => $form,
		'type'     => $type,
		'fields'   => $fields,
		'status'   => 'draft' === ( $m['status'] ?? '' ) ? 'draft' : 'pending',
		'enabled'  => ! empty( $m['enabled'] ),
	);
}

/**
 * The mapping for a submitted form, or null when none is on for it.
 *
 * @param array  $mappings List of mappings (cleaned).
 * @param string $provider Provider id.
 * @param string $form     Form id.
 * @return array|null
 */
function directoryweb_mapping_for( array $mappings, string $provider, string $form ): ?array {
	foreach ( $mappings as $m ) {
		if ( $m['enabled'] && $m['provider'] === $provider && $m['form'] === $form ) {
			return $m;
		}
	}
	return null;
}

/**
 * A provider's submitted values as canonical values.
 *
 * @param array $mapping The mapping.
 * @param array $raw     Provider field id => submitted value.
 * @return array Canonical key => value.
 */
function directoryweb_map_submission( array $mapping, array $raw ): array {
	$out = array();
	foreach ( $mapping['fields'] as $from => $to ) {
		if ( array_key_exists( $from, $raw ) ) {
			$out[ $to ] = $raw[ $from ];
		}
	}
	return $out;
}
