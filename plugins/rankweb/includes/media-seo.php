<?php
/**
 * RankWeb PRO, phase E: Image SEO — find and replace across media alt/title/caption, and fill missing captions
 * (docs/org/rankweb-org-plan.md (Appendix B), E). Rank Math keeps Image SEO for Pro.
 *
 * Screen: RankWeb → Images. Two tools, each with a dry run that writes nothing:
 * - Find and replace in the alt text, title and caption of attachments (plain text or a regular expression, optionally
 *   case-insensitive), using RankWeb_Bulk::replace. A dry run lists the before and after of the first matches.
 * - Fill a missing caption from a pattern ({title}, {filename}, {sitename}); existing captions are never touched.
 *
 * Module "media" (RankWeb → Settings → Modules). No scheduled job. Each run is capped (AW_MEDIA_BATCH) so one screen
 * load never walks the whole library.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-aw-bulk.php';

const AW_MEDIA_BATCH = 500; // attachments touched in one run

/** The three fields and how they are stored. */
function rankweb_media_fields(): array {
	return array(
		'alt'     => __( 'Alt text', 'rankweb' ),
		'title'   => __( 'Title', 'rankweb' ),
		'caption' => __( 'Caption', 'rankweb' ),
	);
}

/** Read one field of an attachment. */
function rankweb_media_get( int $id, string $field ): string {
	if ( 'alt' === $field ) {
		return (string) get_post_meta( $id, '_wp_attachment_image_alt', true );
	}
	$post = get_post( $id );
	if ( ! $post instanceof WP_Post ) {
		return '';
	}
	return 'title' === $field ? (string) $post->post_title : (string) $post->post_excerpt;
}

/** Write one field of an attachment. */
function rankweb_media_set( int $id, string $field, string $value ): void {
	if ( 'alt' === $field ) {
		update_post_meta( $id, '_wp_attachment_image_alt', $value );
		return;
	}
	wp_update_post(
		array(
			'ID' => $id,
			'title' === $field ? 'post_title' : 'post_excerpt' => $value,
		)
	);
}

/** Attachment IDs, newest first, capped. */
function rankweb_media_ids(): array {
	return array_map(
		'intval',
		get_posts(
			array(
				'post_type'        => 'attachment',
				'post_status'      => 'inherit',
				'posts_per_page'   => AW_MEDIA_BATCH,
				'orderby'          => 'ID',
				'order'            => 'DESC',
				'fields'           => 'ids',
				'suppress_filters' => true, // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.SuppressFilters_suppress_filters -- admin/background query over post IDs; filters suppressed so other plugins do not alter this internal set (capped or cached, never a front-end query).
			)
		)
	);
}

/** The caption from the pattern for an attachment. */
function rankweb_media_caption_for( int $id ): string {
	$post = get_post( $id );
	if ( ! $post instanceof WP_Post ) {
		return '';
	}
	$file = (string) get_post_meta( $id, '_wp_attached_file', true );
	$name = '' !== $file ? pathinfo( $file, PATHINFO_FILENAME ) : $post->post_name;
	$name = trim( str_replace( array( '-', '_' ), ' ', (string) $name ) );
	return trim(
		strtr(
			(string) AW_MEDIA_CAPTION,
			array(
				'{title}'    => (string) $post->post_title,
				'{filename}' => $name,
				'{sitename}' => (string) get_bloginfo( 'name' ),
			)
		)
	);
}

add_action(
	'admin_menu',
	function () {
		add_submenu_page( AW_SEO_MENU, __( 'Images', 'rankweb' ), __( 'Images', 'rankweb' ), 'manage_options', 'aw-images', 'rankweb_media_screen' );
	}
);

/* ---------- Find and replace ---------- */

/**
 * Find and replace in the alt text, title and caption of the most recent attachments. A dry run (the default) writes
 * nothing and lists the first matches. The classic handler and POST rankweb/v1/images/replace both call this.
 *
 * @param string   $search  What to find (plain text, or a pattern when $regex).
 * @param string   $replace What to put there.
 * @param string[] $fields  'alt', 'title', 'caption'.
 * @param bool     $regex   $search is a regular expression.
 * @param bool     $ci      Ignore case.
 * @param bool     $apply   Write the changes (false: a dry run).
 * @return array { dry, updated, changes[ { id, field, from, to } ] (the first 50), error }.
 */
function rankweb_media_replace( string $search, string $replace, array $fields, bool $regex, bool $ci, bool $apply ): array {
	$fields = array_values( array_intersect( array_map( 'sanitize_key', $fields ), array_keys( rankweb_media_fields() ) ) );
	$report = array(
		'dry'     => ! $apply,
		'updated' => 0,
		'changes' => array(),
		'error'   => '',
	);
	if ( '' === $search ) {
		$report['error'] = __( 'Enter something to search for.', 'rankweb' );
		return $report;
	}
	if ( ! $fields ) {
		$report['error'] = __( 'Choose at least one field.', 'rankweb' );
		return $report;
	}
	foreach ( rankweb_media_ids() as $id ) {
		foreach ( $fields as $field ) {
			$old = rankweb_media_get( $id, $field );
			if ( '' === $old ) {
				continue;
			}
			$res = RankWeb_Bulk::replace( $old, $search, $replace, $regex, $ci );
			if ( '' !== $res['error'] ) {
				$report['error'] = $res['error'];
				return $report;
			}
			if ( $res['count'] > 0 && $res['text'] !== $old ) {
				++$report['updated'];
				if ( count( $report['changes'] ) < 50 ) {
					$report['changes'][] = array(
						'id'    => $id,
						'field' => $field,
						'from'  => $old,
						'to'    => $res['text'],
					);
				}
				if ( $apply ) {
					rankweb_media_set( $id, $field, $res['text'] );
				}
			}
		}
	}
	return $report;
}

add_action(
	'admin_post_aw_media_replace',
	function () {
		check_admin_referer( 'aw_media_replace' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		$search  = isset( $_POST['search'] ) ? (string) wp_unslash( $_POST['search'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- a search string; used only as a needle/pattern in RankWeb_Bulk::replace, never echoed unescaped
		$replace = isset( $_POST['replace'] ) ? (string) wp_unslash( $_POST['replace'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- a replacement string, stored via wp_update_post/update_post_meta and escaped on output
		$report  = rankweb_media_replace( $search, $replace, (array) ( $_POST['fields'] ?? array() ), isset( $_POST['regex'] ), isset( $_POST['ci'] ), isset( $_POST['aw_apply'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- each field is sanitize_key'd in rankweb_media_replace()
		set_transient( 'aw_seo_media_report_' . get_current_user_id(), $report, 5 * MINUTE_IN_SECONDS );
		wp_safe_redirect( add_query_arg( 'done', '1', admin_url( 'admin.php?page=aw-images' ) ) );
		exit;
	}
);

/* ---------- Fill missing captions ---------- */

/**
 * Fill the caption of attachments that have none from the pattern (AW_MEDIA_CAPTION); an existing caption is never
 * touched. A dry run (the default) writes nothing. The classic handler and POST rankweb/v1/images/captions call this.
 *
 * @param bool $apply Write the captions (false: a dry run).
 * @return array { dry, updated, changes[ { id, field, from, to } ] (the first 50), error }.
 */
function rankweb_media_fill_captions( bool $apply ): array {
	$report = array(
		'dry'     => ! $apply,
		'updated' => 0,
		'changes' => array(),
		'error'   => '',
	);
	foreach ( rankweb_media_ids() as $id ) {
		if ( '' !== rankweb_media_get( $id, 'caption' ) ) {
			continue; // never touch an existing caption
		}
		$caption = rankweb_media_caption_for( $id );
		if ( '' === $caption ) {
			continue;
		}
		++$report['updated'];
		if ( count( $report['changes'] ) < 50 ) {
			$report['changes'][] = array(
				'id'    => $id,
				'field' => 'caption',
				'from'  => '',
				'to'    => $caption,
			);
		}
		if ( $apply ) {
			rankweb_media_set( $id, 'caption', $caption );
		}
	}
	return $report;
}

add_action(
	'admin_post_aw_media_captions',
	function () {
		check_admin_referer( 'aw_media_captions' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'rankweb' ), '', array( 'response' => 403 ) );
		}
		set_transient( 'aw_seo_media_report_' . get_current_user_id(), rankweb_media_fill_captions( isset( $_POST['aw_apply'] ) ), 5 * MINUTE_IN_SECONDS );
		wp_safe_redirect( add_query_arg( 'done', '1', admin_url( 'admin.php?page=aw-images' ) ) );
		exit;
	}
);

/* ---------- REST ---------- */

add_action( 'rest_api_init', 'rankweb_media_register_routes' );

/**
 * Image SEO on the shell, under rankweb/v1 (manage_options, the menu entry's capability). Every write route is a dry run
 * unless `apply` is true.
 *
 *   GET  images           the fields, the run cap and the caption pattern
 *   POST images/replace   { search, replace, fields[], regex, ci, apply } find and replace in alt, title and caption
 *   POST images/captions  { apply } fill missing captions from the pattern
 */
function rankweb_media_register_routes(): void {
	register_rest_route(
		RANKWEB_REST,
		'/images',
		array(
			'methods'             => 'GET',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'callback'            => fn() => rest_ensure_response( rankweb_media_payload() ),
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/images/replace',
		array(
			'methods'             => 'POST',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'args'                => array(
				'search'  => array(
					'type'     => 'string',
					'required' => true,
				),
				'replace' => array(
					'type'    => 'string',
					'default' => '',
				),
				'fields'  => array(
					'type'    => 'array',
					'items'   => array(
						'type' => 'string',
						'enum' => array_keys( rankweb_media_fields() ),
					),
					'default' => array(),
				),
				'regex'   => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'ci'      => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'apply'   => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
			'callback'            => fn( WP_REST_Request $req ) => rest_ensure_response( rankweb_media_replace( (string) $req['search'], (string) $req['replace'], (array) $req['fields'], (bool) $req['regex'], (bool) $req['ci'], (bool) $req['apply'] ) ),
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/images/captions',
		array(
			'methods'             => 'POST',
			'permission_callback' => rankweb_rest_can( 'manage_options' ),
			'args'                => array(
				'apply' => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
			'callback'            => fn( WP_REST_Request $req ) => rest_ensure_response( rankweb_media_fill_captions( (bool) $req['apply'] ) ),
		)
	);
}

/** What the Image SEO screen shows before anything is run. */
function rankweb_media_payload(): array {
	$fields = array();
	foreach ( rankweb_media_fields() as $key => $label ) {
		$fields[] = array(
			'key'     => $key,
			'label'   => $label,
			'default' => 'caption' !== $key, // the classic form ticks alt and title
		);
	}
	return array(
		'fields'  => $fields,
		'batch'   => (int) AW_MEDIA_BATCH,
		'pattern' => (string) AW_MEDIA_CAPTION,
	);
}

/* ---------- The screen ---------- */

/** RankWeb → Images. */
function rankweb_media_screen(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to see this.', 'rankweb' ), '', array( 'response' => 403 ) );
	}
	rankweb_ui_page( 'images' );
}

/** The classic page's body, for a site with no Kits Core. The shell screen is native (src/tools/files.js) and uses the routes above. */
function rankweb_media_body(): void {
	$post = admin_url( 'admin-post.php' );
	echo '<p>' . esc_html( sprintf( /* translators: %s: a number. */ __( 'Each run works on the %s most recent attachments.', 'rankweb' ), number_format_i18n( AW_MEDIA_BATCH ) ) ) . '</p>';
	$report = get_transient( 'aw_seo_media_report_' . get_current_user_id() );
	if ( is_array( $report ) ) {
		delete_transient( 'aw_seo_media_report_' . get_current_user_id() );
		rankweb_media_report( $report );
	}

	echo '<h2>' . esc_html__( 'Find and replace', 'rankweb' ) . '</h2>';
	echo '<form method="post" action="' . esc_url( $post ) . '"><input type="hidden" name="action" value="aw_media_replace">';
	wp_nonce_field( 'aw_media_replace' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="aw-media-search">' . esc_html__( 'Find', 'rankweb' ) . '</label></th><td><input type="text" id="aw-media-search" name="search" class="regular-text"></td></tr>';
	echo '<tr><th scope="row"><label for="aw-media-replace">' . esc_html__( 'Replace with', 'rankweb' ) . '</label></th><td><input type="text" id="aw-media-replace" name="replace" class="regular-text"></td></tr>';
	echo '<tr><th scope="row">' . esc_html__( 'Fields', 'rankweb' ) . '</th><td>';
	foreach ( rankweb_media_fields() as $key => $label ) {
		echo '<label style="margin-right:1em"><input type="checkbox" name="fields[]" value="' . esc_attr( $key ) . '"' . checked( 'caption' !== $key, true, false ) . '> ' . esc_html( $label ) . '</label>';
	}
	echo '</td></tr>';
	echo '<tr><th scope="row">' . esc_html__( 'Options', 'rankweb' ) . '</th><td><label style="margin-right:1em"><input type="checkbox" name="regex" value="1"> ' . esc_html__( 'Regular expression', 'rankweb' ) . '</label><label><input type="checkbox" name="ci" value="1"> ' . esc_html__( 'Ignore case', 'rankweb' ) . '</label></td></tr>';
	echo '<tr><th scope="row">' . esc_html__( 'Apply', 'rankweb' ) . '</th><td><label><input type="checkbox" name="aw_apply" value="1"> ' . esc_html__( 'Apply the changes (otherwise it is a dry run)', 'rankweb' ) . '</label></td></tr>';
	echo '</tbody></table>';
	submit_button( __( 'Find and replace', 'rankweb' ), 'primary', 'submit', false );
	echo '</form>';

	echo '<h2 style="margin-top:2em">' . esc_html__( 'Fill missing captions', 'rankweb' ) . '</h2>';
	echo '<p>' . esc_html( sprintf( /* translators: %s: the caption pattern. */ __( 'Fills the caption of attachments that have none, from the pattern: %s. Existing captions are left alone. Change the pattern in RankWeb → Settings → Images.', 'rankweb' ), (string) AW_MEDIA_CAPTION ) ) . '</p>';
	echo '<form method="post" action="' . esc_url( $post ) . '"><input type="hidden" name="action" value="aw_media_captions">';
	wp_nonce_field( 'aw_media_captions' );
	echo '<p><label><input type="checkbox" name="aw_apply" value="1"> ' . esc_html__( 'Apply the changes (otherwise it is a dry run)', 'rankweb' ) . '</label></p>';
	submit_button( __( 'Fill captions', 'rankweb' ), 'secondary', 'submit', false );
	echo '</form>';
}

/**
 * Show a media tool's report.
 *
 * @param array $report The report.
 */
function rankweb_media_report( array $report ): void {
	if ( '' !== (string) $report['error'] ) {
		wp_admin_notice( esc_html( (string) $report['error'] ), array( 'type' => 'error' ) );
		return;
	}
	$head = $report['dry']
		/* translators: %d: number of attachments. */
		? sprintf( __( 'Dry run: %d attachments would change. Nothing was written.', 'rankweb' ), (int) $report['updated'] )
		/* translators: %d: number of attachments. */
		: sprintf( __( '%d attachments updated.', 'rankweb' ), (int) $report['updated'] );
	wp_admin_notice( esc_html( $head ), array( 'type' => $report['dry'] ? 'info' : 'success' ) );
	if ( empty( $report['changes'] ) ) {
		return;
	}
	echo '<table class="widefat striped" style="max-width:60em"><thead><tr><th>' . esc_html__( 'Attachment', 'rankweb' ) . '</th><th>' . esc_html__( 'Field', 'rankweb' ) . '</th><th>' . esc_html__( 'From', 'rankweb' ) . '</th><th>' . esc_html__( 'To', 'rankweb' ) . '</th></tr></thead><tbody>';
	$fields = rankweb_media_fields();
	foreach ( (array) $report['changes'] as $c ) {
		echo '<tr><td><a href="' . esc_url( (string) get_edit_post_link( (int) $c['id'] ) ) . '">' . esc_html( '#' . (int) $c['id'] ) . '</a></td><td>' . esc_html( $fields[ $c['field'] ] ?? $c['field'] ) . '</td><td>' . esc_html( (string) $c['from'] ) . '</td><td>' . esc_html( (string) $c['to'] ) . '</td></tr>';
	}
	echo '</tbody></table>';
}
