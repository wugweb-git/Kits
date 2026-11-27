<?php
/**
 * Listing CSV import and export, the WordPress side (csv-model.php is the format). Both go through the schema:
 * a column is a field of the chosen listing type, and an import creates listings with directoryweb_submit(), so a row
 * is validated exactly like a form submission and arrives pending (or draft).
 *
 *   GET  directoryweb/v1/listings/export?type=<id>   the listings of that type as CSV text  (manage_options)
 *   POST directoryweb/v1/listings/import             type, csv, dry_run (default true), status  (manage_options)
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The CSV of a listing type's listings.
 *
 * @param string $type Listing type id.
 * @return string|null CSV text, or null for an unknown type.
 */
function directoryweb_export_csv( string $type ): ?string {
	$types = directoryweb_schema_types();
	if ( ! isset( $types[ $type ] ) ) {
		return null;
	}
	$fields = array_intersect_key( directoryweb_schema_fields(), array_flip( $types[ $type ]['fields'] ) );
	$prefix = directoryweb_meta_prefix();
	$posts  = get_posts(
		array(
			'post_type'        => '' !== $types[ $type ]['post_type'] ? $types[ $type ]['post_type'] : directoryweb_post_type(),
			'post_status'      => array( 'publish', 'pending', 'draft', 'private' ),
			'posts_per_page'   => 5000,
			'orderby'          => 'ID',
			'order'            => 'ASC',
		)
	);
	$rows   = array();
	foreach ( $posts as $p ) {
		$row = array();
		foreach ( $fields as $k => $f ) {
			$row[ $k ] = in_array( $k, array( 'title', 'name' ), true ) ? $p->post_title : get_post_meta( $p->ID, $prefix . $k, true );
		}
		$rows[] = $row;
	}
	return directoryweb_csv_build( array_keys( $fields ), $rows );
}

/**
 * Reads a CSV and, unless it is a dry run, creates the listings.
 *
 * @param string $type    Listing type id.
 * @param string $text    CSV text.
 * @param bool   $dry_run True: only check every row.
 * @param string $status  pending or draft.
 * @return array{error:string,ignored:string[],rows:int,ok:int,created:int[],problems:array}
 */
function directoryweb_import_csv( string $type, string $text, bool $dry_run = true, string $status = 'pending' ): array {
	$types  = directoryweb_schema_types();
	$report = array( 'error' => '', 'ignored' => array(), 'rows' => 0, 'ok' => 0, 'created' => array(), 'problems' => array() );
	if ( ! isset( $types[ $type ] ) ) {
		$report['error'] = 'Unknown listing type.';
		return $report;
	}
	$fields = array_intersect_key( directoryweb_schema_fields(), array_flip( $types[ $type ]['fields'] ) );
	$read   = directoryweb_csv_listings( $text, $fields );
	$report['ignored'] = $read['ignored'];
	if ( '' !== $read['error'] ) {
		$report['error'] = $read['error'];
		return $report;
	}
	$report['rows'] = count( $read['rows'] );
	foreach ( $read['rows'] as $n => $values ) {
		list( , $bad ) = directoryweb_schema_validate( $values, $fields );
		if ( $bad ) {
			$report['problems'][ $n ] = array_values( $bad );
			continue;
		}
		++$report['ok'];
		if ( ! $dry_run ) {
			$res = directoryweb_submit( $type, $values, array( 'provider' => 'csv', 'form' => '', 'status' => 'draft' === $status ? 'draft' : 'pending' ) );
			if ( $res['id'] ) {
				$report['created'][] = $res['id'];
			} else {
				--$report['ok'];
				$report['problems'][ $n ] = array_values( $res['errors'] );
			}
		}
	}
	return $report;
}

add_action(
	'rest_api_init',
	function () {
		$can = directoryweb_rest_can( 'manage_options' );
		register_rest_route(
			DIRECTORYWEB_REST,
			'/listings/export',
			array(
				'methods'             => 'GET',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $r ) {
					$csv = directoryweb_export_csv( sanitize_key( (string) $r->get_param( 'type' ) ) );
					return null === $csv ? new WP_Error( 'directoryweb_csv', __( 'Unknown listing type.', 'directoryweb' ), array( 'status' => 404 ) ) : rest_ensure_response( array( 'csv' => $csv ) );
				},
			)
		);
		register_rest_route(
			DIRECTORYWEB_REST,
			'/listings/import',
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $r ) {
					return rest_ensure_response(
						directoryweb_import_csv(
							sanitize_key( (string) $r->get_param( 'type' ) ),
							(string) $r->get_param( 'csv' ),
							false !== $r->get_param( 'dry_run' ),
							sanitize_key( (string) $r->get_param( 'status' ) )
						)
					);
				},
			)
		);
	}
);
