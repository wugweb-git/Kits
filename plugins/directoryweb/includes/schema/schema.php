<?php
/**
 * Schema & Fields, Listing Types and Form Integrations, the WordPress side (schema-model.php and integrations-model.php
 * are the rules).
 *
 * Stored (not autoloaded): directoryweb_fields, directoryweb_listing_types, directoryweb_form_mappings. With none saved,
 * the fields are the plugin's existing listing meta and there is one listing type using all of them, so nothing changes
 * until an administrator edits them.
 *
 * Everything reaches the listing through directoryweb_submit(): the native form, an external form's adapter, an import.
 * It validates against the listing type's fields, then creates the listing as pending (or draft) with the values as meta.
 *
 * Add a form provider from any plugin with the `directoryweb_form_adapters` filter (contract: integrations-model.php),
 * and tell DirectoryWeb about a submission with directoryweb_form_submission( $provider, $form_id, $values ).
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const DIRECTORYWEB_FIELDS_OPTION   = 'directoryweb_fields';
const DIRECTORYWEB_TYPES_OPTION    = 'directoryweb_listing_types';
const DIRECTORYWEB_MAPPINGS_OPTION = 'directoryweb_form_mappings';

/** The canonical fields: what was saved, else the plugin's existing listing meta. @return array<string, array> */
function directoryweb_schema_fields(): array {
	$saved = get_option( DIRECTORYWEB_FIELDS_OPTION, null );
	if ( is_array( $saved ) && $saved ) {
		return directoryweb_fields_clean( $saved );
	}
	return directoryweb_fields_from_meta_schema( directoryweb_meta_schema(), directoryweb_meta_prefix() );
}

/** The listing types: what was saved, else one that uses every field and the directory's own post type. @return array<string, array> */
function directoryweb_schema_types(): array {
	$keys  = array_keys( directoryweb_schema_fields() );
	$saved = get_option( DIRECTORYWEB_TYPES_OPTION, null );
	if ( is_array( $saved ) && $saved ) {
		return directoryweb_listing_types_clean( $saved, $keys );
	}
	return directoryweb_listing_types_clean( array( array( 'id' => 'listing', 'label' => __( 'Listing', 'directoryweb' ), 'fields' => $keys ) ), $keys );
}

/** The mappings, one per form. @return array[] */
function directoryweb_form_mappings(): array {
	$types = directoryweb_schema_types();
	$out   = array();
	foreach ( (array) get_option( DIRECTORYWEB_MAPPINGS_OPTION, array() ) as $m ) {
		$c = is_array( $m ) ? directoryweb_mapping_clean( $m, $types ) : null;
		if ( $c ) {
			$out[] = $c;
		}
	}
	return $out;
}

/** The form providers DirectoryWeb can read: the built-in Fluent Forms adapter, and any added by a plugin. @return array<string, array> */
function directoryweb_form_adapters(): array {
	$built = array(
		array(
			'id'     => 'fluentforms',
			'label'  => 'Fluent Forms',
			'active' => static fn() => defined( 'FLUENTFORM' ) || function_exists( 'wpFluentForm' ),
			'forms'  => static function (): array {
				global $wpdb;
				$rows = array();
				foreach ( (array) $wpdb->get_results( "SELECT id, title FROM {$wpdb->prefix}fluentform_forms ORDER BY id DESC LIMIT 200" ) as $r ) { // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- Fluent Forms' own table, read only
					$rows[] = array( (string) $r->id, (string) $r->title );
				}
				return $rows;
			},
			'fields' => static function ( $form_id ): array {
				global $wpdb;
				$json = $wpdb->get_var( $wpdb->prepare( "SELECT form_fields FROM {$wpdb->prefix}fluentform_forms WHERE id = %d", (int) $form_id ) ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- Fluent Forms' own table, read only
				$def  = $json ? json_decode( (string) $json, true ) : array();
				$out  = array();
				$walk = static function ( $items ) use ( &$walk, &$out ) {
					foreach ( (array) $items as $it ) {
						$name = $it['attributes']['name'] ?? '';
						if ( '' !== $name ) {
							$out[] = array( (string) $name, (string) ( $it['settings']['label'] ?? $name ) );
						}
						foreach ( array( 'fields', 'columns' ) as $k ) {
							if ( ! empty( $it[ $k ] ) ) {
								$walk( $it[ $k ] );
							}
						}
					}
				};
				$walk( $def['fields'] ?? array() );
				return $out;
			},
		),
	);
	$more = apply_filters( 'directoryweb_form_adapters', $built );
	return directoryweb_adapters_clean( is_array( $more ) ? $more : $built );
}

/**
 * Creates a listing from canonical values: the one way a listing gets made from a form or an import.
 *
 * @param string $type   Listing type id.
 * @param array  $values Canonical key => value.
 * @param array  $source What it came from: provider, form, status (pending or draft).
 * @return array{id:int,errors:array} The new listing's id (0 when refused) and the problems.
 */
function directoryweb_submit( string $type, array $values, array $source = array() ): array {
	$types = directoryweb_schema_types();
	if ( ! isset( $types[ $type ] ) ) {
		return array( 'id' => 0, 'errors' => array( '_type' => 'Unknown listing type.' ) );
	}
	$all    = directoryweb_schema_fields();
	$fields = array_intersect_key( $all, array_flip( $types[ $type ]['fields'] ) );
	list( $clean, $bad ) = directoryweb_schema_validate( $values, $fields );
	if ( $bad ) {
		return array( 'id' => 0, 'errors' => $bad );
	}
	$title = '';
	foreach ( array( 'title', 'name' ) as $k ) {
		if ( isset( $clean[ $k ] ) && '' !== trim( (string) $clean[ $k ] ) ) {
			$title = (string) $clean[ $k ];
			break;
		}
	}
	$id = wp_insert_post(
		array(
			'post_type'   => '' !== $types[ $type ]['post_type'] ? $types[ $type ]['post_type'] : directoryweb_post_type(),
			'post_status' => 'draft' === ( $source['status'] ?? '' ) ? 'draft' : 'pending',
			'post_title'  => '' !== $title ? $title : __( 'New listing', 'directoryweb' ),
		),
		true
	);
	if ( is_wp_error( $id ) ) {
		return array( 'id' => 0, 'errors' => array( '_save' => $id->get_error_message() ) );
	}
	$prefix = directoryweb_meta_prefix();
	foreach ( $clean as $k => $v ) {
		if ( 'title' === $k || 'name' === $k ) {
			continue;
		}
		update_post_meta( $id, $prefix . $k, is_array( $v ) ? implode( ', ', $v ) : $v );
	}
	update_post_meta( $id, 'directoryweb_listing_type', $type );
	update_post_meta( $id, 'directoryweb_submitted_via', sanitize_text_field( ( $source['provider'] ?? 'direct' ) . ':' . ( $source['form'] ?? '' ) ) );
	do_action( 'directoryweb_listing_submitted', (int) $id, $type, $source );
	return array( 'id' => (int) $id, 'errors' => array() );
}

/**
 * A form provider calls this when someone submits a form. Does nothing unless a mapping is on for that form.
 *
 * @param string $provider Provider id (an adapter's).
 * @param string $form_id  Form id.
 * @param array  $values   Provider field id => submitted value.
 * @return array|null The directoryweb_submit() result, or null when no mapping is on.
 */
function directoryweb_form_submission( string $provider, string $form_id, array $values ): ?array {
	$m = directoryweb_mapping_for( directoryweb_form_mappings(), $provider, $form_id );
	if ( ! $m ) {
		return null;
	}
	return directoryweb_submit( $m['type'], directoryweb_map_submission( $m, $values ), array( 'provider' => $provider, 'form' => $form_id, 'status' => $m['status'] ) );
}

// Fluent Forms tells us about every submission (the claim form is handled by claims-review.php; no mapping, no action).
add_action(
	'fluentform/submission_inserted',
	function ( $entry_id, $data, $form ) {
		directoryweb_form_submission( 'fluentforms', (string) ( $form->id ?? '' ), (array) $data );
	},
	40,
	3
);

/**
 * The plugins that work with DirectoryWeb, and what each is for. `plugin` is the folder the plugin is installed in.
 * Add one with the `directoryweb_companions` filter.
 *
 * @return array[] id, label, purpose, plugin, active (bool), url (where to get it or open it).
 */
function directoryweb_companions(): array {
	$list   = array(
		array( 'id' => 'sourceweb', 'label' => 'SourceWeb', 'plugin' => 'sourceweb', 'purpose' => __( 'Finds and enriches listings: contact details, links and missing facts, for you to review.', 'directoryweb' ) ),
		array( 'id' => 'rankweb', 'label' => 'RankWeb', 'plugin' => 'rankweb', 'purpose' => __( 'Search titles, descriptions, schema and sitemaps for every listing page.', 'directoryweb' ) ),
		array( 'id' => 'insightweb', 'label' => 'InsightWeb', 'plugin' => 'insightweb', 'purpose' => __( 'Shows which listings and searches people find you by.', 'directoryweb' ) ),
		array( 'id' => 'mailweb', 'label' => 'MailWeb', 'plugin' => 'mailweb', 'purpose' => __( 'Sends claim and submission emails reliably.', 'directoryweb' ) ),
		array( 'id' => 'planweb', 'label' => 'PlanWeb', 'plugin' => 'planweb', 'purpose' => __( 'Plans the content that promotes your directory.', 'directoryweb' ) ),
	);
	$list   = apply_filters( 'directoryweb_companions', $list );
	$active = (array) get_option( 'active_plugins', array() );
	$out    = array();
	foreach ( is_array( $list ) ? $list : array() as $c ) {
		if ( empty( $c['id'] ) || empty( $c['plugin'] ) ) {
			continue;
		}
		$on = false;
		foreach ( $active as $file ) {
			if ( 0 === strpos( (string) $file, $c['plugin'] . '/' ) ) {
				$on = true;
				break;
			}
		}
		$c['active'] = $on;
		$c['url']    = $c['url'] ?? ( $on ? '' : 'https://wugweb-git.github.io/Kits/plugins/' . rawurlencode( $c['plugin'] ) . '/' ); // each plugin's own Plugin URI page, which says where to get it
		$out[]       = $c;
	}
	return $out;
}

add_action(
	'rest_api_init',
	function () {
		$can = directoryweb_rest_can( 'manage_options' );
		$get = fn( callable $f ) => array( 'methods' => 'GET', 'permission_callback' => $can, 'callback' => fn() => rest_ensure_response( $f() ) );
		register_rest_route( DIRECTORYWEB_REST, '/schema', array(
			$get( fn() => array( 'fields' => array_values( directoryweb_schema_fields() ), 'types' => array_values( directoryweb_field_types_info() ) ) ),
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $r ) {
					$fields = directoryweb_fields_clean( (array) $r->get_param( 'fields' ) );
					if ( ! $fields ) {
						return new WP_Error( 'directoryweb_schema', __( 'A schema needs at least one valid field.', 'directoryweb' ), array( 'status' => 400 ) );
					}
					update_option( DIRECTORYWEB_FIELDS_OPTION, array_values( $fields ), false );
					return rest_ensure_response( array( 'fields' => array_values( directoryweb_schema_fields() ), 'types' => array_values( directoryweb_field_types_info() ) ) );
				},
			),
		) );
		register_rest_route( DIRECTORYWEB_REST, '/listing-types', array(
			$get( fn() => array( 'types' => array_values( directoryweb_schema_types() ), 'fields' => array_keys( directoryweb_schema_fields() ) ) ),
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $r ) {
					$types = directoryweb_listing_types_clean( (array) $r->get_param( 'types' ), array_keys( directoryweb_schema_fields() ) );
					if ( ! $types ) {
						return new WP_Error( 'directoryweb_types', __( 'Keep at least one listing type.', 'directoryweb' ), array( 'status' => 400 ) );
					}
					update_option( DIRECTORYWEB_TYPES_OPTION, array_values( $types ), false );
					return rest_ensure_response( array( 'types' => array_values( directoryweb_schema_types() ), 'fields' => array_keys( directoryweb_schema_fields() ) ) );
				},
			),
		) );
		register_rest_route( DIRECTORYWEB_REST, '/integrations', array(
			$get(
				function () {
					$out = array();
					foreach ( directoryweb_form_adapters() as $a ) {
						$on    = (bool) call_user_func( $a['active'] );
						$forms = array();
						if ( $on ) {
							foreach ( (array) call_user_func( $a['forms'] ) as $f ) {
								$forms[] = array( 'id' => (string) $f[0], 'title' => (string) $f[1], 'fields' => array_map( static fn( $x ) => array( 'id' => (string) $x[0], 'label' => (string) $x[1] ), (array) call_user_func( $a['fields'], $f[0] ) ) );
							}
						}
						$out[] = array( 'id' => $a['id'], 'label' => $a['label'], 'active' => $on, 'forms' => $forms );
					}
					return array( 'providers' => $out, 'mappings' => directoryweb_form_mappings(), 'types' => array_values( directoryweb_schema_types() ), 'fields' => array_values( directoryweb_schema_fields() ) );
				}
			),
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $r ) {
					$types = directoryweb_schema_types();
					$save  = array();
					foreach ( (array) $r->get_param( 'mappings' ) as $m ) {
						$c = is_array( $m ) ? directoryweb_mapping_clean( $m, $types ) : null;
						if ( $c ) {
							$save[] = $c;
						}
					}
					update_option( DIRECTORYWEB_MAPPINGS_OPTION, $save, false );
					return rest_ensure_response( array( 'mappings' => directoryweb_form_mappings() ) );
				},
			),
		) );
		register_rest_route( DIRECTORYWEB_REST, '/companions', $get( 'directoryweb_companions' ) );
		register_rest_route( DIRECTORYWEB_REST, '/config', array(
			$get( fn() => array( 'fields' => array_values( directoryweb_schema_fields() ), 'types' => array_values( directoryweb_schema_types() ), 'mappings' => directoryweb_form_mappings() ) ),
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $r ) {
					$fields = directoryweb_fields_clean( (array) $r->get_param( 'fields' ) );
					if ( ! $fields ) {
						return new WP_Error( 'directoryweb_config', __( 'That file has no valid fields.', 'directoryweb' ), array( 'status' => 400 ) );
					}
					$types = directoryweb_listing_types_clean( (array) $r->get_param( 'types' ), array_keys( $fields ) );
					if ( ! $types ) {
						return new WP_Error( 'directoryweb_config', __( 'That file has no valid listing types.', 'directoryweb' ), array( 'status' => 400 ) );
					}
					$maps = array();
					foreach ( (array) $r->get_param( 'mappings' ) as $m ) {
						$c = is_array( $m ) ? directoryweb_mapping_clean( $m, $types ) : null;
						if ( $c ) {
							$maps[] = $c;
						}
					}
					update_option( DIRECTORYWEB_FIELDS_OPTION, array_values( $fields ), false );
					update_option( DIRECTORYWEB_TYPES_OPTION, array_values( $types ), false );
					update_option( DIRECTORYWEB_MAPPINGS_OPTION, $maps, false );
					return rest_ensure_response( array( 'fields' => count( $fields ), 'types' => count( $types ), 'mappings' => count( $maps ) ) );
				},
			),
		) );
	}
);

/** The field types a person can pick, for the screen. @return array<string, array> */
function directoryweb_field_types_info(): array {
	$out = array();
	foreach ( DIRECTORYWEB_FIELD_TYPES as $t ) {
		$out[ $t ] = array( 'id' => $t, 'choices' => in_array( $t, array( 'select', 'multiselect' ), true ) );
	}
	return $out;
}
