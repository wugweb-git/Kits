<?php
/**
 * RankWeb PRO, phase E: CSV export and import of the SEO fields (docs/org/rankweb-org-plan.md (Appendix B), E). Part of the "bulk"
 * module (bulk-edit.php). Screen: RankWeb → SEO CSV.
 *
 * Columns (RankWeb_Bulk): id, title, description, focus_keyword, link_keywords (a pipe list), canonical. Only the columns
 * present in an imported file are written, so a file with just id and title touches the title only; a column that is
 * present but blank clears that field. Import has a dry run (the default) that reports what would change without
 * writing, and lists the rows it could not use and why.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-aw-bulk.php';

/** CSV column => the meta key it reads and writes (id is the post, not a meta). */
function rankweb_bulk_csv_meta(): array {
	return array(
		'title'         => 'rank_math_title',
		'description'   => 'rank_math_description',
		'focus_keyword' => 'rank_math_focus_keyword',
		'canonical'     => 'rank_math_canonical_url',
		// link_keywords is handled on its own (the _aw_link_keywords array).
	);
}

/** One item's row for export. */
function rankweb_bulk_csv_row( int $id ): array {
	return array(
		'id'            => (string) $id,
		'title'         => (string) get_post_meta( $id, 'rank_math_title', true ),
		'description'   => (string) get_post_meta( $id, 'rank_math_description', true ),
		'focus_keyword' => (string) get_post_meta( $id, 'rank_math_focus_keyword', true ),
		'link_keywords' => implode( '|', (array) rankweb_bulk_link_keywords( $id ) ),
		'canonical'     => (string) get_post_meta( $id, 'rank_math_canonical_url', true ),
	);
}

add_action(
	'admin_menu',
	function () {
		add_submenu_page( RANKWEB_SEO_MENU, __( 'SEO CSV', 'rankweb' ), __( 'SEO CSV', 'rankweb' ), 'manage_options', 'aw-seo-csv', 'rankweb_bulk_csv_screen' );
	}
);

/* ---------- Export ---------- */

/** The CSV of every item's SEO fields (the supported types, up to 5000 items). */
function rankweb_bulk_csv_text(): string {
	$types = rankweb_bulk_types();
	$ids   = $types ? get_posts(
		array(
			'post_type'        => $types,
			'post_status'      => array( 'publish', 'draft', 'pending', 'future', 'private' ),
			'posts_per_page'   => 5000, // phpcs:ignore WordPress.WP.PostsPerPage.posts_per_page_posts_per_page -- a one-off CSV export the admin asked for
			'orderby'          => 'ID',
			'order'            => 'ASC',
			'fields'           => 'ids',
			'suppress_filters' => true, // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.SuppressFilters_suppress_filters -- admin/background query over post IDs; filters suppressed so other plugins do not alter this internal set (capped or cached, never a front-end query).
		)
	) : array();
	$rows  = array();
	foreach ( array_map( 'intval', $ids ) as $id ) {
		$rows[] = rankweb_bulk_csv_row( $id );
	}
	return RankWeb_Bulk::to_csv( $rows );
}

add_action(
	'admin_post_aw_bulk_export',
	function () {
		check_admin_referer( 'aw_bulk_export' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		$csv = rankweb_bulk_csv_text();
		nocache_headers();
		header( 'Content-Type: text/csv; charset=UTF-8' );
		header( 'Content-Disposition: attachment; filename="rankweb-seo-' . gmdate( 'Ymd-His' ) . '.csv"' );
		header( 'Content-Length: ' . strlen( $csv ) );
		echo $csv; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- a CSV download built by RankWeb_Bulk::to_csv()
		exit;
	}
);

/* ---------- Import ---------- */

/**
 * Import an uploaded CSV: checks the upload, reads it, then applies it (or, on a dry run, only reports). The classic
 * handler and POST rankweb/v1/seo-csv/import both call this.
 *
 * @param array|null    $file      One $_FILES entry ( tmp_name, size, error ), or null when none was sent.
 * @param bool          $apply     Write the changes (false: a dry run).
 * @param callable|null $is_upload Whether a path is an uploaded file (is_uploaded_file; a test passes its own).
 * @return array { dry, updated, changes[], skipped[], error }.
 */
function rankweb_bulk_csv_import_file( ?array $file, bool $apply, ?callable $is_upload = null ): array {
	$is_upload = $is_upload ?? 'is_uploaded_file';
	$report    = array(
		'dry'     => ! $apply,
		'updated' => 0,
		'changes' => array(),
		'skipped' => array(),
		'error'   => '',
	);
	$tmp       = is_array( $file ) ? (string) ( $file['tmp_name'] ?? '' ) : '';
	if ( '' === $tmp || ( isset( $file['error'] ) && UPLOAD_ERR_OK !== (int) $file['error'] ) || ! $is_upload( $tmp ) ) {
		$report['error'] = __( 'Choose a CSV file to import.', 'rankweb' );
		return $report;
	}
	if ( (int) ( $file['size'] ?? 0 ) > 5 * MB_IN_BYTES ) {
		$report['error'] = __( 'The file is larger than 5 MB.', 'rankweb' );
		return $report;
	}
	$text   = (string) file_get_contents( $tmp ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- an uploaded CSV in the PHP temp dir
	$parsed = RankWeb_Bulk::from_csv( $text );
	if ( '' !== $parsed['error'] ) {
		$report['error'] = $parsed['error'];
		return $report;
	}
	return rankweb_bulk_csv_apply( $parsed['rows'], $parsed['header'], ! $apply, $report );
}

add_action(
	'admin_post_aw_bulk_import',
	function () {
		check_admin_referer( 'aw_bulk_import' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		$file   = isset( $_FILES['aw_csv'] ) && is_array( $_FILES['aw_csv'] ) ? array_map( 'wp_unslash', $_FILES['aw_csv'] ) : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- an upload; tmp_name and size are only read by rankweb_bulk_csv_import_file(), which checks is_uploaded_file()
		$report = rankweb_bulk_csv_import_file( $file, isset( $_POST['aw_apply'] ) ); // the box "Apply the changes" turns the dry run off
		set_transient( 'aw_seo_bulk_report_' . get_current_user_id(), $report, 5 * MINUTE_IN_SECONDS );
		wp_safe_redirect( add_query_arg( 'imported', '1', admin_url( 'admin.php?page=aw-seo-csv' ) ) );
		exit;
	}
);

/* ---------- REST ---------- */

add_action( 'rest_api_init', 'rankweb_bulk_csv_register_routes' );

/**
 * SEO CSV on the shell, under rankweb/v1 (manage_options, the menu entry's capability). The export is not a route: it
 * is a download, so the screen links to the nonce'd admin-post address (rankweb_bulk_csv_payload() gives it).
 *
 *   GET  seo-csv         the supported types, the columns, the size limit and the export link
 *   POST seo-csv/import  multipart: aw_csv (the file) and apply (false: a dry run); the report
 */
function rankweb_bulk_csv_register_routes(): void {
	register_rest_route(
		RANKWEB_REST,
		'/seo-csv',
		array(
			'methods'             => 'GET',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'callback'            => fn() => rest_ensure_response( rankweb_bulk_csv_payload() ),
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/seo-csv/import',
		array(
			'methods'             => 'POST',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'args'                => array(
				'apply' => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
			'callback'            => function ( WP_REST_Request $req ) {
				$files = $req->get_file_params();
				return rest_ensure_response( rankweb_bulk_csv_import_file( isset( $files['aw_csv'] ) && is_array( $files['aw_csv'] ) ? $files['aw_csv'] : null, (bool) $req['apply'] ) );
			},
		)
	);
}

/** What the SEO CSV screen shows: the types the CSV covers, the columns, the size limit, and the export's nonce'd link. */
function rankweb_bulk_csv_payload(): array {
	$types = array();
	foreach ( rankweb_bulk_types() as $slug ) {
		$o       = get_post_type_object( $slug );
		$types[] = array(
			'slug'  => (string) $slug,
			'label' => $o ? (string) $o->labels->name : (string) $slug,
		);
	}
	return array(
		'types'     => $types,
		'columns'   => array( 'id', 'title', 'description', 'focus_keyword', 'link_keywords', 'canonical' ),
		'max_bytes' => 5 * MB_IN_BYTES,
		'export'    => add_query_arg(
			array(
				'action'   => 'aw_bulk_export',
				'_wpnonce' => wp_create_nonce( 'aw_bulk_export' ),
			),
			admin_url( 'admin-post.php' )
		),
	);
}

/**
 * Apply (or, on a dry run, only report) the CSV rows.
 *
 * @param array $rows   Rows from RankWeb_Bulk::from_csv().
 * @param array $header The file's columns.
 * @param bool  $dry    Report only, write nothing.
 * @param array $report The report so far.
 */
function rankweb_bulk_csv_apply( array $rows, array $header, bool $dry, array $report ): array {
	$types     = rankweb_bulk_types();
	$meta      = rankweb_bulk_csv_meta();
	$cols      = array_values( array_intersect( array_keys( $meta ), $header ) );
	$has_links = in_array( 'link_keywords', $header, true );
	foreach ( $rows as $row ) {
		$id   = (int) ( $row['id'] ?? 0 );
		$post = $id ? get_post( $id ) : null;
		if ( ! $post instanceof WP_Post || ! in_array( $post->post_type, $types, true ) ) {
			/* translators: %s: the id from the file. */
			$report['skipped'][] = sprintf( __( 'Row %s: not an item of a supported type.', 'rankweb' ), (string) ( $row['id'] ?? '?' ) );
			continue;
		}
		if ( ! current_user_can( 'edit_post', $id ) ) {
			/* translators: %d: item ID. */
			$report['skipped'][] = sprintf( __( 'Item %d: you may not edit it.', 'rankweb' ), $id );
			continue;
		}
		$changed = array();
		foreach ( $cols as $col ) {
			$raw = trim( (string) $row[ $col ] );
			$new = 'canonical' === $col ? esc_url_raw( $raw ) : ( 'description' === $col ? sanitize_textarea_field( $raw ) : sanitize_text_field( $raw ) );
			$old = (string) get_post_meta( $id, $meta[ $col ], true );
			if ( $new !== $old ) {
				$changed[] = $col;
				if ( ! $dry ) {
					if ( '' === $new ) {
						delete_post_meta( $id, $meta[ $col ] );
					} else {
						update_post_meta( $id, $meta[ $col ], $new );
					}
				}
			}
		}
		if ( $has_links && function_exists( 'rankweb_link_keywords_clean' ) ) {
			$new = rankweb_link_keywords_clean( explode( '|', (string) $row['link_keywords'] ) );
			$old = array_values( (array) rankweb_bulk_link_keywords( $id ) );
			if ( $new !== $old ) {
				$changed[] = 'link_keywords';
				if ( ! $dry ) {
					if ( $new ) {
						update_post_meta( $id, '_aw_link_keywords', $new );
					} else {
						delete_post_meta( $id, '_aw_link_keywords' );
					}
				}
			}
		}
		if ( $changed ) {
			++$report['updated'];
			if ( count( $report['changes'] ) < 100 ) {
				/* translators: 1: item ID, 2: list of fields. */
				$report['changes'][] = sprintf( __( 'Item %1$d: %2$s', 'rankweb' ), $id, implode( ', ', $changed ) );
			}
		}
	}
	return $report;
}

/* ---------- The screen ---------- */

/** RankWeb → SEO CSV. */
function rankweb_bulk_csv_screen(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to see this.', 'rankweb' ), '', array( 'response' => 403 ) );
	}
	rankweb_ui_page( 'csv' );
}

/** The classic page's body, for a site with no Kits Core. The shell screen is native (src/tools/files.js) and uses the routes above. */
function rankweb_bulk_csv_body(): void {
	$post = admin_url( 'admin-post.php' );
	if ( ! rankweb_bulk_types() ) {
		wp_admin_notice( esc_html__( 'No post types are set for bulk SEO work (RankWeb → Settings → Bulk edit).', 'rankweb' ), array( 'type' => 'warning' ) );
	}
	$report = get_transient( 'aw_seo_bulk_report_' . get_current_user_id() );
	if ( is_array( $report ) ) {
		delete_transient( 'aw_seo_bulk_report_' . get_current_user_id() );
		rankweb_bulk_csv_report( $report );
	}

	echo '<h2>' . esc_html__( 'Export', 'rankweb' ) . '</h2><p>' . esc_html__( 'Download every item\'s SEO fields as a CSV.', 'rankweb' ) . '</p>';
	echo '<form method="post" action="' . esc_url( $post ) . '"><input type="hidden" name="action" value="aw_bulk_export">';
	wp_nonce_field( 'aw_bulk_export' );
	submit_button( __( 'Export CSV', 'rankweb' ), 'secondary', 'submit', false );
	echo '</form>';

	echo '<h2 style="margin-top:2em">' . esc_html__( 'Import', 'rankweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Upload a CSV with an "id" column. Only the columns in the file are written; a blank cell clears that field. The dry run reports what would change and writes nothing.', 'rankweb' ) . '</p>';
	echo '<form method="post" enctype="multipart/form-data" action="' . esc_url( $post ) . '"><input type="hidden" name="action" value="aw_bulk_import">';
	wp_nonce_field( 'aw_bulk_import' );
	echo '<p><input type="file" name="aw_csv" accept=".csv,text/csv" required></p>';
	echo '<p><label><input type="checkbox" name="aw_apply" value="1"> ' . esc_html__( 'Apply the changes (otherwise it is a dry run)', 'rankweb' ) . '</label></p>';
	submit_button( __( 'Import CSV', 'rankweb' ), 'primary', 'submit', false );
	echo '</form>';
}

/**
 * Show an import report.
 *
 * @param array $report The report.
 */
function rankweb_bulk_csv_report( array $report ): void {
	if ( '' !== (string) $report['error'] ) {
		wp_admin_notice( esc_html( (string) $report['error'] ), array( 'type' => 'error' ) );
		return;
	}
	$head = $report['dry']
		/* translators: %d: number of items. */
		? sprintf( __( 'Dry run: %d items would change. Nothing was written.', 'rankweb' ), (int) $report['updated'] )
		/* translators: %d: number of items. */
		: sprintf( __( '%d items updated.', 'rankweb' ), (int) $report['updated'] );
	wp_admin_notice( esc_html( $head ), array( 'type' => $report['dry'] ? 'info' : 'success' ) );
	foreach ( array(
		'changes' => __( 'Changes', 'rankweb' ),
		'skipped' => __( 'Skipped', 'rankweb' ),
	) as $key => $label ) {
		if ( ! empty( $report[ $key ] ) ) {
			echo '<details open><summary><strong>' . esc_html( $label ) . '</strong> (' . esc_html( number_format_i18n( count( $report[ $key ] ) ) ) . ')</summary><ul style="list-style:disc;margin-left:2em">';
			foreach ( (array) $report[ $key ] as $line ) {
				echo '<li>' . esc_html( (string) $line ) . '</li>';
			}
			echo '</ul></details>';
		}
	}
}
