<?php
/**
 * RankWeb PRO, phase F: redirect tools (docs/org/rankweb-org-plan.md (Appendix B), F). Rank Math keeps CSV import/export, 404-log
 * export and .htaccess sync for Pro. The one redirect list stays Rank Math → Redirections (owner, 10 Oct 2026); this
 * screen reads and writes that list, it does not keep its own.
 *
 * Screen: RankWeb → Redirect tools (manage_options). Tools:
 * - Export the redirects as CSV (source, target, code, comparison).
 * - Import a CSV into Rank Math's list, with a dry run (the default) that writes nothing and reports each row. The code
 *   may be 301, 302, 307, 308, 410 or 451 (410/451 need no target). Adds through rankweb_rank_math_redirect(); an exact
 *   source already in the list is left alone.
 * - Export Rank Math's 404 log as CSV (reused, not a second monitor).
 * - The .htaccess block: download the Apache directives for the exact redirects, or (only when the setting is on and
 *   the server is Apache or LiteSpeed) write them into the site's .htaccess between RankWeb's markers, a backup first.
 *
 * Module "redirect-tools" (RankWeb → Settings → Modules). No scheduled job. Categories are not built: Rank Math's list
 * has no category field, and the owner's rule keeps redirects in that one list (noted in docs/org/rankweb-org-plan.md (Appendix B)).
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-aw-redirects.php';

const AW_HTACCESS_MARKER = 'RankWeb Redirects';

/** Whether Rank Math's redirections module is on. */
function rankweb_redirect_ready(): bool {
	return class_exists( '\RankMath\Helper' ) && \RankMath\Helper::is_module_active( 'redirections' );
}

/** The active redirects in Rank Math's list as rows (source, target, code, comparison). */
function rankweb_redirect_rows(): array {
	global $wpdb;
	$table = $wpdb->prefix . 'rank_math_redirections';
	$rows  = (array) $wpdb->get_results( $wpdb->prepare( "SELECT sources, url_to, header_code FROM %i WHERE status = 'active' ORDER BY id", $table ), ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- Rank Math's table, an export the admin asked for
	$out   = array();
	foreach ( $rows as $r ) {
		foreach ( (array) maybe_unserialize( (string) $r['sources'] ) as $src ) {
			$out[] = array(
				'source'     => (string) ( $src['pattern'] ?? '' ),
				'target'     => (string) $r['url_to'],
				'code'       => (string) (int) $r['header_code'],
				'comparison' => (string) ( $src['comparison'] ?? 'exact' ),
				'category'   => rankweb_redirect_category_of( (string) ( $src['pattern'] ?? '' ), (string) ( $src['comparison'] ?? 'exact' ) ),
			);
		}
	}
	return $out;
}

/*
 * Categories. Rank Math's list has no category field and every redirect stays in that one list, so RankWeb keeps only a
 * label per source here (option rankweb_redirect_categories, keyed by comparison and source). It is a tag on the CSV and
 * on this screen: deleting the redirect in Rank Math leaves a harmless label behind, and nothing reads it at request time.
 */

/** The key of a redirect's label: its comparison and its source without slashes at the ends. */
function rankweb_redirect_category_key( string $source, string $comparison ): string {
	return md5( ( 'regex' === $comparison ? 'regex' : 'exact' ) . '|' . ( 'regex' === $comparison ? $source : trim( $source, '/' ) ) );
}

/** A redirect's category, or ''. */
function rankweb_redirect_category_of( string $source, string $comparison ): string {
	$map = (array) get_option( 'rankweb_redirect_categories', array() );
	return (string) ( $map[ rankweb_redirect_category_key( $source, $comparison ) ] ?? '' );
}

/** Set (or, with '', clear) a redirect's category. */
function rankweb_redirect_category_set( string $source, string $comparison, string $category ): void {
	$map = (array) get_option( 'rankweb_redirect_categories', array() );
	$key = rankweb_redirect_category_key( $source, $comparison );
	if ( '' === $category ) {
		unset( $map[ $key ] );
	} else {
		$map[ $key ] = $category;
	}
	update_option( 'rankweb_redirect_categories', $map, false );
}

/** The labels in use with how many redirects carry each, for the screen. */
function rankweb_redirect_category_counts(): array {
	$counts = array_count_values( array_filter( array_map( 'strval', array_values( (array) get_option( 'rankweb_redirect_categories', array() ) ) ) ) );
	ksort( $counts );
	return $counts;
}

add_action(
	'admin_menu',
	function () {
		add_submenu_page( AW_SEO_MENU, __( 'Redirect tools', 'rankweb' ), __( 'Redirect tools', 'rankweb' ), 'manage_options', 'aw-redirects', 'rankweb_redirect_tools_screen' );
	}
);

/* ---------- Export redirects ---------- */

add_action(
	'admin_post_aw_redirect_export',
	function () {
		check_admin_referer( 'aw_redirect_export' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		$csv = RankWeb_Redirects::to_csv( rankweb_redirect_rows() );
		nocache_headers();
		header( 'Content-Type: text/csv; charset=UTF-8' );
		header( 'Content-Disposition: attachment; filename="rankweb-redirects-' . gmdate( 'Ymd-His' ) . '.csv"' );
		header( 'Content-Length: ' . strlen( $csv ) );
		echo $csv; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- a CSV download built by RankWeb_Redirects::to_csv()
		exit;
	}
);

/* ---------- Import redirects ---------- */

/**
 * Import an uploaded CSV into Rank Math's list: checks the upload, reads it, then adds the rows (or, on a dry run, only
 * reports them). The classic handler and POST rankweb/v1/redirects/import both call this.
 *
 * @param array|null    $file      One $_FILES entry ( tmp_name, size, error ), or null when none was sent.
 * @param bool          $apply     Add the redirects (false: a dry run).
 * @param callable|null $is_upload Whether a path is an uploaded file (is_uploaded_file; a test passes its own).
 * @return array { kind, dry, added, lines[] (the first 100), skipped[], error }.
 */
function rankweb_redirect_import_file( ?array $file, bool $apply, ?callable $is_upload = null ): array {
	$is_upload = $is_upload ?? 'is_uploaded_file';
	$dry       = ! $apply;
	$report    = array(
		'kind'    => 'import',
		'dry'     => $dry,
		'added'   => 0,
		'lines'   => array(),
		'skipped' => array(),
		'error'   => '',
	);
	$tmp       = is_array( $file ) ? (string) ( $file['tmp_name'] ?? '' ) : '';
	if ( ! rankweb_redirect_ready() ) {
		$report['error'] = __( 'Rank Math\'s Redirections module is off.', 'rankweb' );
		return $report;
	}
	if ( '' === $tmp || ( isset( $file['error'] ) && UPLOAD_ERR_OK !== (int) $file['error'] ) || ! $is_upload( $tmp ) ) {
		$report['error'] = __( 'Choose a CSV file.', 'rankweb' );
		return $report;
	}
	if ( (int) ( $file['size'] ?? 0 ) > 5 * MB_IN_BYTES ) {
		$report['error'] = __( 'The file is larger than 5 MB.', 'rankweb' );
		return $report;
	}
	$text   = (string) file_get_contents( $tmp ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- an uploaded CSV in the PHP temp dir
	$parsed = RankWeb_Redirects::from_csv( $text );
	if ( '' !== $parsed['error'] ) {
		$report['error'] = $parsed['error'];
		return $report;
	}
	$n = 0;
	foreach ( $parsed['rows'] as $row ) {
		++$n;
		$v = RankWeb_Redirects::validate( $row );
		if ( '' !== $v['error'] ) {
			/* translators: 1: row number, 2: the reason. */
			$report['skipped'][] = sprintf( __( 'Row %1$d: %2$s', 'rankweb' ), $n, $v['error'] );
			continue;
		}
		$target = in_array( $v['code'], RankWeb_Redirects::GONE, true ) ? '' : rankweb_redirect_abs( $v['target'] );
		if ( $dry ) {
			++$report['added'];
		} else {
			$pattern = 'regex' === $v['comparison'] ? $v['source'] : trim( $v['source'], '/' );
			$id      = rankweb_rank_math_redirect( $pattern, $target, $v['comparison'], $v['code'] );
			if ( $id ) {
				if ( '' !== $v['category'] ) {
					rankweb_redirect_category_set( $pattern, $v['comparison'], $v['category'] );
				}
				++$report['added'];
			} else {
				/* translators: %d: row number. */
				$report['skipped'][] = sprintf( __( 'Row %d: already in the list or could not be saved.', 'rankweb' ), $n );
				continue;
			}
		}
		if ( count( $report['lines'] ) < 100 ) {
			$report['lines'][] = $v['source'] . ' → ' . ( '' !== $target ? $target : (string) $v['code'] );
		}
	}
	return $report;
}

add_action(
	'admin_post_aw_redirect_import',
	function () {
		check_admin_referer( 'aw_redirect_import' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		$file   = isset( $_FILES['aw_csv'] ) && is_array( $_FILES['aw_csv'] ) ? array_map( 'wp_unslash', $_FILES['aw_csv'] ) : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- an upload; tmp_name and size are only read by rankweb_redirect_import_file(), which checks is_uploaded_file()
		$report = rankweb_redirect_import_file( $file, isset( $_POST['aw_apply'] ) );
		set_transient( 'aw_seo_redirect_report_' . get_current_user_id(), $report, 5 * MINUTE_IN_SECONDS );
		wp_safe_redirect( admin_url( 'admin.php?page=aw-redirects' ) );
		exit;
	}
);

/** A target made absolute: a path on this site becomes a full URL; a full URL is kept. */
function rankweb_redirect_abs( string $target ): string {
	$target = trim( $target );
	if ( '' === $target ) {
		return '';
	}
	return preg_match( '~^https?://~i', $target ) ? $target : home_url( '/' . ltrim( $target, '/' ) );
}

/* ---------- 404 log ---------- */

/**
 * Rank Math's 404 log, most recent first (reused, not a second monitor).
 *
 * @param int $limit Rows (the CSV takes 5000, the screen 100).
 * @return array { exists: Rank Math's table is there, rows[ { uri, hits, last_seen, referer, user_agent } ] }.
 */
function rankweb_redirect_404_rows( int $limit ): array {
	global $wpdb;
	$table  = $wpdb->prefix . 'rank_math_404_logs';
	$exists = (string) $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- a one-off check for Rank Math's 404 table
	if ( $exists !== $table ) {
		return array(
			'exists' => false,
			'rows'   => array(),
		);
	}
	$rows = (array) $wpdb->get_results( $wpdb->prepare( 'SELECT uri, times_accessed, accessed, referer, user_agent FROM %i ORDER BY accessed DESC LIMIT %d', $table, max( 1, $limit ) ), ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- Rank Math's 404 table, shown or exported because the admin asked
	$out  = array();
	foreach ( $rows as $r ) {
		$out[] = array(
			'uri'        => (string) $r['uri'],
			'hits'       => (int) $r['times_accessed'],
			'last_seen'  => (string) $r['accessed'],
			'referer'    => (string) $r['referer'],
			'user_agent' => (string) $r['user_agent'],
		);
	}
	return array(
		'exists' => true,
		'rows'   => $out,
	);
}

/** The 404 log as CSV text (up to 5000 rows); the referer and user agent are attacker-set, so each cell is made safe for a spreadsheet. */
function rankweb_redirect_404_csv(): string {
	$fh = fopen( 'php://temp', 'r+' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen -- an in-memory stream
	fputcsv( $fh, array( 'uri', 'hits', 'last_seen', 'referer', 'user_agent' ), ',', '"', '' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fwrite -- in-memory
	foreach ( rankweb_redirect_404_rows( 5000 )['rows'] as $r ) {
		fputcsv( $fh, array( rankweb_redirect_csv_safe( $r['uri'] ), (string) $r['hits'], $r['last_seen'], rankweb_redirect_csv_safe( $r['referer'] ), rankweb_redirect_csv_safe( $r['user_agent'] ) ), ',', '"', '' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fwrite -- in-memory
	}
	rewind( $fh );
	$csv = (string) stream_get_contents( $fh );
	fclose( $fh ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose -- in-memory
	return $csv;
}

add_action(
	'admin_post_aw_redirect_404export',
	function () {
		check_admin_referer( 'aw_redirect_404export' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		$csv = rankweb_redirect_404_csv();
		nocache_headers();
		header( 'Content-Type: text/csv; charset=UTF-8' );
		header( 'Content-Disposition: attachment; filename="rankweb-404-log-' . gmdate( 'Ymd-His' ) . '.csv"' );
		header( 'Content-Length: ' . strlen( $csv ) );
		echo $csv; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- a CSV download escaped per field above
		exit;
	}
);

/* ---------- .htaccess ---------- */

/** The .htaccess directive lines for the exact redirects in the list. */
function rankweb_redirect_htaccess_lines(): array {
	$valid = array();
	foreach ( rankweb_redirect_rows() as $row ) {
		$v = RankWeb_Redirects::validate( $row );
		if ( '' === $v['error'] ) {
			$valid[] = $v;
		}
	}
	return RankWeb_Redirects::htaccess_lines( $valid );
}

/** Whether the server is one whose .htaccess is read (Apache or LiteSpeed). */
function rankweb_redirect_apache(): bool {
	$server = isset( $_SERVER['SERVER_SOFTWARE'] ) ? strtolower( sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ) ) : '';
	return false !== strpos( $server, 'apache' ) || false !== strpos( $server, 'litespeed' );
}

/** The block of Apache directives the .htaccess download and the write both use. */
function rankweb_redirect_htaccess_block(): string {
	return '# BEGIN ' . AW_HTACCESS_MARKER . "\n" . implode( "\n", rankweb_redirect_htaccess_lines() ) . "\n# END " . AW_HTACCESS_MARKER . "\n";
}

add_action(
	'admin_post_aw_redirect_htaccess_download',
	function () {
		check_admin_referer( 'aw_redirect_htaccess' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		$block = rankweb_redirect_htaccess_block();
		nocache_headers();
		header( 'Content-Type: text/plain; charset=UTF-8' );
		header( 'Content-Disposition: attachment; filename="rankweb-htaccess-redirects.txt"' );
		echo $block; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- a plain-text download; each line was built by RankWeb_Redirects
		exit;
	}
);

/**
 * Write (or remove) RankWeb's .htaccess block, only when the caller confirmed it: the server asks for the flag whatever
 * the screen did. The classic handler (its tick box) and POST rankweb/v1/redirects/htaccess both call this.
 *
 * @param bool $confirm The editing of .htaccess was confirmed.
 * @param bool $remove  Remove the block instead of writing it.
 * @return array{kind: string, error: string, ok: string}
 */
function rankweb_redirect_htaccess_write( bool $confirm, bool $remove ): array {
	if ( ! $confirm ) {
		return array(
			'kind'  => 'htaccess',
			'error' => __( 'Nothing was changed: confirm that .htaccess may be edited.', 'rankweb' ),
			'ok'    => '',
		);
	}
	return array( 'kind' => 'htaccess' ) + rankweb_redirect_htaccess_apply( $remove );
}

add_action(
	'admin_post_aw_redirect_htaccess_write',
	function () {
		check_admin_referer( 'aw_redirect_htaccess' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		set_transient( 'aw_seo_redirect_report_' . get_current_user_id(), rankweb_redirect_htaccess_write( isset( $_POST['aw_confirm'] ), isset( $_POST['aw_remove'] ) ), 5 * MINUTE_IN_SECONDS ); // the tick box is the confirmation, checked here
		wp_safe_redirect( admin_url( 'admin.php?page=aw-redirects' ) );
		exit;
	}
);

/**
 * Write (or remove) RankWeb's block in the site's .htaccess, a backup first.
 *
 * @param bool $remove Remove the block instead of writing it.
 * @return array{error: string, ok: string}
 */
function rankweb_redirect_htaccess_apply( bool $remove ): array {
	if ( ! AW_REDIRECT_HTACCESS ) {
		return array(
			'error' => __( 'The .htaccess option is off (RankWeb → Settings → Redirect tools).', 'rankweb' ),
			'ok'    => '',
		);
	}
	if ( ! rankweb_redirect_apache() ) {
		return array(
			'error' => __( 'This server does not read .htaccess (not Apache or LiteSpeed).', 'rankweb' ),
			'ok'    => '',
		);
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/misc.php';
	$path = get_home_path() . '.htaccess';
	global $wp_filesystem;
	if ( ! WP_Filesystem() || ! $wp_filesystem ) {
		return array(
			'error' => __( 'The .htaccess file could not be opened.', 'rankweb' ),
			'ok'    => '',
		);
	}
	if ( $wp_filesystem->exists( $path ) ) {
		if ( ! $wp_filesystem->is_writable( $path ) ) {
			return array(
				'error' => __( 'The .htaccess file is not writable.', 'rankweb' ),
				'ok'    => '',
			);
		}
		$current = $wp_filesystem->get_contents( $path );
		if ( false === $current || ! $wp_filesystem->put_contents( $path . '.rankweb-bak', (string) $current, FS_CHMOD_FILE ) ) {
			return array( 'error' => __( 'A backup of .htaccess could not be written, so nothing was changed.', 'rankweb' ), 'ok' => '' );
		}
	} elseif ( $remove ) {
		return array(
			'error' => '',
			'ok'    => __( 'There was nothing to remove.', 'rankweb' ),
		);
	}
	$lines = $remove ? array() : rankweb_redirect_htaccess_lines();
	if ( ! insert_with_markers( $path, AW_HTACCESS_MARKER, $lines ) ) {
		return array(
			'error' => __( 'The .htaccess file could not be written.', 'rankweb' ),
			'ok'    => '',
		);
	}
	return array(
		'error' => '',
		/* translators: %d: number of redirects. */
		'ok'    => $remove ? __( 'RankWeb\'s .htaccess block was removed (a backup is at .htaccess.rankweb-bak).', 'rankweb' ) : sprintf( __( '%d redirects written to .htaccess (a backup is at .htaccess.rankweb-bak).', 'rankweb' ), count( $lines ) ),
	);
}

/**
 * Neutralise a spreadsheet formula in a CSV cell (the 404 log's referer and user agent are attacker-set headers): a
 * value that begins with =, +, -, @ or a control character is prefixed with a single quote so a spreadsheet treats it
 * as text, not a formula.
 *
 * @param string $value A cell value.
 */
function rankweb_redirect_csv_safe( string $value ): string {
	return '' !== $value && 1 === preg_match( '/^[=+\-@\t\r]/', $value ) ? "'" . $value : $value;
}

/* ---------- REST ---------- */

add_action( 'rest_api_init', 'rankweb_redirect_register_routes' );

/**
 * Redirect tools on the shell, under rankweb/v1 (manage_options, the menu entry's capability). The list itself stays in
 * Rank Math → Redirections; these routes add to it (import) and read around it. The exports are downloads: the screen
 * links to the nonce'd admin-post addresses rankweb_redirect_payload() gives.
 *
 *   GET  redirects           whether Rank Math's module is on, the categories, the .htaccess state, the export links
 *   GET  redirects/404       Rank Math's 404 log, the 100 most recent
 *   POST redirects/import    multipart: aw_csv (the file) and apply (false: a dry run); the report
 *   POST redirects/htaccess  { confirm, remove } write (or remove) RankWeb's .htaccess block; refused unless confirm is true
 */
function rankweb_redirect_register_routes(): void {
	register_rest_route(
		RANKWEB_REST,
		'/redirects',
		array(
			'methods'             => 'GET',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'callback'            => fn() => rest_ensure_response( rankweb_redirect_payload() ),
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/redirects/404',
		array(
			'methods'             => 'GET',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'callback'            => fn() => rest_ensure_response( rankweb_redirect_404_rows( 100 ) ),
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/redirects/import',
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
				return rest_ensure_response( rankweb_redirect_import_file( isset( $files['aw_csv'] ) && is_array( $files['aw_csv'] ) ? $files['aw_csv'] : null, (bool) $req['apply'] ) );
			},
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/redirects/htaccess',
		array(
			'methods'             => 'POST',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'args'                => array(
				'confirm' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'remove'  => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
			'callback'            => fn( WP_REST_Request $req ) => rest_ensure_response( rankweb_redirect_htaccess_write( (bool) $req['confirm'], (bool) $req['remove'] ) ),
		)
	);
}

/** What the Redirect tools screen shows before anything is run. */
function rankweb_redirect_payload(): array {
	$post = admin_url( 'admin-post.php' );
	$link = fn( string $action, string $nonce ) => add_query_arg(
		array(
			'action'   => $action,
			'_wpnonce' => wp_create_nonce( $nonce ),
		),
		$post
	);
	$cats = array();
	foreach ( rankweb_redirect_category_counts() as $name => $n ) {
		$cats[] = array(
			'name'  => (string) $name,
			'count' => (int) $n,
		);
	}
	$apache = rankweb_redirect_apache();
	return array(
		'ready'      => rankweb_redirect_ready(),
		'categories' => $cats,
		'htaccess'   => array(
			'count'  => count( rankweb_redirect_htaccess_lines() ),
			'on'     => (bool) AW_REDIRECT_HTACCESS,
			'apache' => $apache,
			'can'    => (bool) AW_REDIRECT_HTACCESS && $apache,
		),
		'export'     => array(
			'redirects' => $link( 'aw_redirect_export', 'aw_redirect_export' ),
			'log404'    => $link( 'aw_redirect_404export', 'aw_redirect_404export' ),
			'htaccess'  => $link( 'aw_redirect_htaccess_download', 'aw_redirect_htaccess' ),
		),
	);
}

/* ---------- The screen ---------- */

/** RankWeb → Redirect tools. */
function rankweb_redirect_tools_screen(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to see this.', 'rankweb' ), '', array( 'response' => 403 ) );
	}
	rankweb_ui_page( 'redirects' );
}

/** The classic page's body, for a site with no Kits Core. The shell screen is native (src/tools/redirects.js) and uses the routes above. */
function rankweb_redirect_tools_body(): void {
	$post = admin_url( 'admin-post.php' );
	echo '<p>' . esc_html__( 'Redirects live in Rank Math → Redirections. These tools read and write that one list.', 'rankweb' ) . '</p>';
	if ( ! rankweb_redirect_ready() ) {
		wp_admin_notice( esc_html__( 'Rank Math\'s Redirections module is off, so these tools do nothing.', 'rankweb' ), array( 'type' => 'warning' ) );
	}
	$report = get_transient( 'aw_seo_redirect_report_' . get_current_user_id() );
	if ( is_array( $report ) ) {
		delete_transient( 'aw_seo_redirect_report_' . get_current_user_id() );
		rankweb_redirect_report( $report );
	}

	$cats = rankweb_redirect_category_counts();
	if ( $cats ) {
		$line = array();
		foreach ( $cats as $name => $n ) {
			$line[] = $name . ' (' . number_format_i18n( $n ) . ')';
		}
		echo '<p>' . esc_html__( 'Categories in the CSV:', 'rankweb' ) . ' ' . esc_html( implode( ', ', $line ) ) . '</p>';
	}
	echo '<h2>' . esc_html__( 'Export and import', 'rankweb' ) . '</h2>';
	echo '<form method="post" action="' . esc_url( $post ) . '" style="display:inline-block;margin-right:1em"><input type="hidden" name="action" value="aw_redirect_export">';
	wp_nonce_field( 'aw_redirect_export' );
	submit_button( __( 'Export redirects CSV', 'rankweb' ), 'secondary', 'submit', false );
	echo '</form>';
	echo '<form method="post" action="' . esc_url( $post ) . '" style="display:inline-block"><input type="hidden" name="action" value="aw_redirect_404export">';
	wp_nonce_field( 'aw_redirect_404export' );
	submit_button( __( 'Export 404 log CSV', 'rankweb' ), 'secondary', 'submit', false );
	echo '</form>';
	echo '<p>' . esc_html__( 'Import a CSV with a "source" column, and target, code (301, 302, 307, 308, 410, 451), comparison (exact or regex) and category (a label of your own; it stays in RankWeb; the Rank Math list is not changed). The dry run reports what would be added and writes nothing.', 'rankweb' ) . '</p>';
	echo '<form method="post" enctype="multipart/form-data" action="' . esc_url( $post ) . '"><input type="hidden" name="action" value="aw_redirect_import">';
	wp_nonce_field( 'aw_redirect_import' );
	echo '<p><input type="file" name="aw_csv" accept=".csv,text/csv" required></p>';
	echo '<p><label><input type="checkbox" name="aw_apply" value="1"> ' . esc_html__( 'Add the redirects (otherwise it is a dry run)', 'rankweb' ) . '</label></p>';
	submit_button( __( 'Import redirects', 'rankweb' ), 'primary', 'submit', false );
	echo '</form>';

	echo '<h2 style="margin-top:2em">' . esc_html__( 'Apache .htaccess', 'rankweb' ) . '</h2>';
	$count = count( rankweb_redirect_htaccess_lines() );
	/* translators: %d: number of redirects. */
	echo '<p>' . esc_html( sprintf( __( '%d exact redirects can go in .htaccess (regex rules stay in Rank Math).', 'rankweb' ), $count ) ) . '</p>';
	echo '<form method="post" action="' . esc_url( $post ) . '" style="display:inline-block;margin-right:1em"><input type="hidden" name="action" value="aw_redirect_htaccess_download">';
	wp_nonce_field( 'aw_redirect_htaccess' );
	submit_button( __( 'Download the .htaccess block', 'rankweb' ), 'secondary', 'submit', false );
	echo '</form>';
	if ( AW_REDIRECT_HTACCESS && rankweb_redirect_apache() ) {
		echo '<form method="post" action="' . esc_url( $post ) . '"><input type="hidden" name="action" value="aw_redirect_htaccess_write">';
		wp_nonce_field( 'aw_redirect_htaccess' );
		echo '<p><label><input type="checkbox" name="aw_confirm" value="1"> ' . esc_html__( 'Yes, edit .htaccess (a backup is made first)', 'rankweb' ) . '</label></p>';
		echo '<p><label><input type="checkbox" name="aw_remove" value="1"> ' . esc_html__( 'Remove the block instead of writing it', 'rankweb' ) . '</label></p>';
		submit_button( __( 'Write to .htaccess now', 'rankweb' ), 'delete', 'submit', false );
		echo '</form>';
	} else {
		echo '<p class="description">' . esc_html__( 'Writing to .htaccess is off, or this server is not Apache or LiteSpeed. Turn it on in RankWeb → Settings → Redirect tools. The downloaded block can be pasted by hand.', 'rankweb' ) . '</p>';
	}
}

/**
 * Show a redirect-tool report.
 *
 * @param array $report The report.
 */
function rankweb_redirect_report( array $report ): void {
	if ( '' !== (string) $report['error'] ) {
		wp_admin_notice( esc_html( (string) $report['error'] ), array( 'type' => 'error' ) );
		return;
	}
	if ( 'htaccess' === ( $report['kind'] ?? '' ) ) {
		wp_admin_notice( esc_html( (string) ( $report['ok'] ?? '' ) ), array( 'type' => 'success' ) );
		return;
	}
	$head = $report['dry']
		/* translators: %d: number of redirects. */
		? sprintf( __( 'Dry run: %d redirects would be added. Nothing was written.', 'rankweb' ), (int) $report['added'] )
		/* translators: %d: number of redirects. */
		: sprintf( __( '%d redirects added.', 'rankweb' ), (int) $report['added'] );
	wp_admin_notice( esc_html( $head ), array( 'type' => $report['dry'] ? 'info' : 'success' ) );
	foreach ( array(
		'lines'   => __( 'Redirects', 'rankweb' ),
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
