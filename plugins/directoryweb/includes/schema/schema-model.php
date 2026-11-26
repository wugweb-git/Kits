<?php
/**
 * The canonical listing schema (pure: no WordPress, so tests/schema-tests.php checks it).
 *
 * One list of fields defines what a listing contains; listing types choose which of those fields they use. Forms
 * (a native one or an external plugin's) map INTO this schema: no form has a schema of its own.
 *
 * A field: key (letters, digits, underscore), label, type, required, help, options (for select and multiselect),
 * min and max (text length, or the value for a number), pattern (a regular expression the text must match).
 * A listing type: id, label, fields (field keys, in order), post_type ('' = the directory's own).
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const DIRECTORYWEB_FIELD_TYPES = array( 'text', 'textarea', 'number', 'url', 'email', 'phone', 'date', 'boolean', 'select', 'multiselect' );

/**
 * One field tidied, or null when it cannot be one (no key, or an unknown type).
 *
 * @param array $f Raw field.
 * @return array|null
 */
function directoryweb_field_clean( array $f ): ?array {
	$key  = strtolower( preg_replace( '/[^a-z0-9_]/i', '', (string) ( $f['key'] ?? '' ) ) );
	$type = (string) ( $f['type'] ?? 'text' );
	if ( '' === $key || ! in_array( $type, DIRECTORYWEB_FIELD_TYPES, true ) ) {
		return null;
	}
	$options = array();
	foreach ( (array) ( $f['options'] ?? array() ) as $o ) {
		$o = trim( (string) $o );
		if ( '' !== $o && ! in_array( $o, $options, true ) ) {
			$options[] = $o;
		}
	}
	if ( in_array( $type, array( 'select', 'multiselect' ), true ) && ! $options ) {
		return null; // a choice field needs choices
	}
	$pattern = (string) ( $f['pattern'] ?? '' );
	if ( '' !== $pattern && ( strlen( $pattern ) > 200 || false === @preg_match( '~' . str_replace( '~', '\~', $pattern ) . '~u', '' ) ) ) { // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- testing whether the pattern compiles
		$pattern = '';
	}
	return array(
		'key'      => $key,
		'label'    => '' !== trim( (string) ( $f['label'] ?? '' ) ) ? trim( (string) $f['label'] ) : $key,
		'type'     => $type,
		'required' => ! empty( $f['required'] ),
		'help'     => trim( (string) ( $f['help'] ?? '' ) ),
		'options'  => $options,
		'min'      => isset( $f['min'] ) && is_numeric( $f['min'] ) ? 0 + $f['min'] : null,
		'max'      => isset( $f['max'] ) && is_numeric( $f['max'] ) ? 0 + $f['max'] : null,
		'pattern'  => $pattern,
	);
}

/**
 * A list of fields tidied; a later one with the same key replaces an earlier one.
 *
 * @param array $fields Raw fields.
 * @return array<string, array> key => field.
 */
function directoryweb_fields_clean( array $fields ): array {
	$out = array();
	foreach ( $fields as $f ) {
		$c = is_array( $f ) ? directoryweb_field_clean( $f ) : null;
		if ( $c ) {
			$out[ $c['key'] ] = $c;
		}
	}
	return $out;
}

/**
 * One listing type tidied, or null when it has no id. Its fields are limited to those that exist.
 *
 * @param array $t         Raw type.
 * @param array $field_keys Keys of the fields that exist.
 * @return array|null
 */
function directoryweb_listing_type_clean( array $t, array $field_keys ): ?array {
	$id = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $t['id'] ?? '' ) ) );
	if ( '' === $id ) {
		return null;
	}
	$fields = array();
	foreach ( (array) ( $t['fields'] ?? array() ) as $k ) {
		$k = strtolower( preg_replace( '/[^a-z0-9_]/i', '', (string) $k ) );
		if ( '' !== $k && in_array( $k, $field_keys, true ) && ! in_array( $k, $fields, true ) ) {
			$fields[] = $k;
		}
	}
	return array(
		'id'        => $id,
		'label'     => '' !== trim( (string) ( $t['label'] ?? '' ) ) ? trim( (string) $t['label'] ) : $id,
		'fields'    => $fields,
		'post_type' => strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $t['post_type'] ?? '' ) ) ),
	);
}

/**
 * Listing types tidied; a later one with the same id replaces an earlier one.
 *
 * @param array $types      Raw types.
 * @param array $field_keys Keys of the fields that exist.
 * @return array<string, array> id => type.
 */
function directoryweb_listing_types_clean( array $types, array $field_keys ): array {
	$out = array();
	foreach ( $types as $t ) {
		$c = is_array( $t ) ? directoryweb_listing_type_clean( $t, $field_keys ) : null;
		if ( $c ) {
			$out[ $c['id'] ] = $c;
		}
	}
	return $out;
}

/**
 * The fields a seed schema (the plugin's existing meta list: key => [ type, post types, description ]) becomes: one text
 * field per key, with the prefix taken off. Nothing is lost: the stored meta keep their names.
 *
 * @param array  $meta   directoryweb_meta_schema().
 * @param string $prefix The meta prefix to take off.
 * @return array<string, array> key => field.
 */
function directoryweb_fields_from_meta_schema( array $meta, string $prefix ): array {
	$raw = array();
	foreach ( $meta as $name => $def ) {
		$key   = 0 === strpos( (string) $name, $prefix ) ? substr( (string) $name, strlen( $prefix ) ) : (string) $name;
		$type  = 'boolean' === ( $def[0] ?? '' ) ? 'boolean' : 'text';
		$raw[] = array( 'key' => $key, 'label' => (string) ( $def[2] ?? $key ), 'type' => $type );
	}
	return directoryweb_fields_clean( $raw );
}

/**
 * Checks values against the fields of a listing type. Unknown keys are dropped; an empty optional field is left out.
 *
 * @param array $values Raw values: key => value (a list for multiselect).
 * @param array $fields key => field, the type's fields only.
 * @return array{0:array,1:array} The cleaned values, and the problems (key => message).
 */
function directoryweb_schema_validate( array $values, array $fields ): array {
	$clean = array();
	$bad   = array();
	foreach ( $fields as $key => $f ) {
		$raw   = $values[ $key ] ?? null;
		$empty = null === $raw || '' === $raw || array() === $raw;
		if ( 'boolean' === $f['type'] ) {
			$clean[ $key ] = in_array( $raw, array( true, 1, '1', 'true', 'yes', 'on' ), true ) ? 1 : 0;
			continue;
		}
		if ( $empty ) {
			if ( $f['required'] ) {
				$bad[ $key ] = $f['label'] . ' is required.';
			}
			continue;
		}
		$err = '';
		$val = $raw;
		switch ( $f['type'] ) {
			case 'number':
				if ( ! is_numeric( $raw ) ) {
					$err = 'must be a number.';
				} else {
					$val = 0 + $raw;
					if ( null !== $f['min'] && $val < $f['min'] ) {
						$err = 'must be at least ' . $f['min'] . '.';
					} elseif ( null !== $f['max'] && $val > $f['max'] ) {
						$err = 'must be at most ' . $f['max'] . '.';
					}
				}
				break;
			case 'url':
				$val = trim( (string) $raw );
				if ( ! preg_match( '~^https?://[^\s/$.?#][^\s]*$~i', $val ) ) {
					$err = 'must be a web address starting with http:// or https://.';
				}
				break;
			case 'email':
				$val = trim( (string) $raw );
				if ( false === filter_var( $val, FILTER_VALIDATE_EMAIL ) ) {
					$err = 'must be an email address.';
				}
				break;
			case 'phone':
				$val = trim( (string) $raw );
				if ( ! preg_match( '/^\+?[0-9 ()\-]{6,20}$/', $val ) ) {
					$err = 'must be a phone number.';
				}
				break;
			case 'date':
				$val = trim( (string) $raw );
				$d   = DateTime::createFromFormat( 'Y-m-d', $val );
				if ( ! $d || $d->format( 'Y-m-d' ) !== $val ) {
					$err = 'must be a date as YYYY-MM-DD.';
				}
				break;
			case 'select':
				$val = trim( (string) $raw );
				if ( ! in_array( $val, $f['options'], true ) ) {
					$err = 'must be one of the choices.';
				}
				break;
			case 'multiselect':
				$val = array_values( array_unique( array_map( 'strval', (array) $raw ) ) );
				if ( array_diff( $val, $f['options'] ) ) {
					$err = 'has a choice that is not allowed.';
				}
				break;
			default: // text, textarea
				$val = trim( (string) $raw );
				$len = function_exists( 'mb_strlen' ) ? mb_strlen( $val ) : strlen( $val );
				if ( null !== $f['min'] && $len < $f['min'] ) {
					$err = 'must be at least ' . $f['min'] . ' characters.';
				} elseif ( null !== $f['max'] && $len > $f['max'] ) {
					$err = 'must be at most ' . $f['max'] . ' characters.';
				}
		}
		if ( '' === $err && '' !== $f['pattern'] && ! preg_match( '~' . str_replace( '~', '\~', $f['pattern'] ) . '~u', is_array( $val ) ? implode( ' ', $val ) : (string) $val ) ) {
			$err = 'is not in the expected format.';
		}
		if ( '' !== $err ) {
			$bad[ $key ] = $f['label'] . ' ' . $err;
		} else {
			$clean[ $key ] = $val;
		}
	}
	return array( $clean, $bad );
}
