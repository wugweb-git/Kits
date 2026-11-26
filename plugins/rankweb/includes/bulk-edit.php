<?php
/**
 * RankWeb PRO, phase E: list-screen SEO columns, filters, Quick Edit and Bulk Edit (docs/org/rankweb-org-plan.md (Appendix B), E).
 *
 * On the post-list screen of each configured type: a "SEO" column (title, description and focus keyword at a glance), a
 * filter (missing title, missing description, missing focus keyword, noindex, or no internal links in), Quick Edit for
 * the title, description and focus keyword, and Bulk Edit for the focus keyword, the link keywords and the robots index
 * rule. The CSV screen is in bulk-csv.php (the same module). Rank Math's own fields (rank_math_title,
 * rank_math_description, rank_math_focus_keyword, rank_math_robots) are read and written; the link keywords are
 * RankWeb's _aw_link_keywords.
 *
 * Module "bulk" (RankWeb → Settings → Modules). No scheduled job.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The post types that get the list-screen SEO tools (the setting; empty: none). */
function rankweb_bulk_types(): array {
	return array_values( array_filter( array_map( 'sanitize_key', (array) AW_BULK_TYPES ), 'post_type_exists' ) );
}

/** An item's robots flags (Rank Math's rank_math_robots, an array like array( 'noindex' )). */
function rankweb_bulk_robots( int $id ): array {
	$r = get_post_meta( $id, 'rank_math_robots', true );
	return is_array( $r ) ? array_values( array_filter( array_map( 'sanitize_key', $r ) ) ) : array();
}

/** An item's link keywords as a display string (internal links module). */
function rankweb_bulk_link_keywords( int $id ): array {
	return function_exists( 'rankweb_link_keywords' ) ? rankweb_link_keywords( $id ) : (array) get_post_meta( $id, '_aw_link_keywords', true );
}

require_once __DIR__ . '/class-rankweb-seo-bar.php';

/* ---------- The column ---------- */

add_action(
	'admin_init',
	function () {
		foreach ( rankweb_bulk_types() as $type ) {
			add_filter( "manage_{$type}_posts_columns", 'rankweb_bulk_column' );
			add_action( "manage_{$type}_posts_custom_column", 'rankweb_bulk_column_cell', 10, 2 );
		}
	}
);

/**
 * Add the SEO column after the title.
 *
 * @param array $cols Columns.
 */
function rankweb_bulk_column( array $cols ): array {
	$out = array();
	foreach ( $cols as $key => $label ) {
		$out[ $key ] = $label;
		if ( 'title' === $key ) {
			$out['aw_seo'] = __( 'SEO', 'rankweb' );
		}
	}
	if ( ! isset( $out['aw_seo'] ) ) {
		$out['aw_seo'] = __( 'SEO', 'rankweb' );
	}
	return $out;
}

/**
 * Print one SEO Bar: a segment per check, the worst status in words and the checks to look at. Shared by the post lists,
 * the term lists and the user list. $extra goes inside the wrapper, for a screen's own hidden values.
 *
 * @param array  $checks From RankWeb_Seo_Bar::checks().
 * @param string $extra  Escaped HTML printed inside the wrapper after the checks.
 */
function rankweb_seo_bar_render( array $checks, string $extra = '' ): void {
	$colors = array(
		RankWeb_Seo_Bar::GOOD => '#00a32a',
		RankWeb_Seo_Bar::WARN => '#dba617',
		RankWeb_Seo_Bar::BAD  => '#d63638',
	);
	$words  = array(
		RankWeb_Seo_Bar::GOOD => __( 'Good', 'rankweb' ),
		RankWeb_Seo_Bar::WARN => __( 'Check', 'rankweb' ),
		RankWeb_Seo_Bar::BAD  => __( 'Fix', 'rankweb' ),
	);
	$ink    = array( // text colours with enough contrast on white; the bar keeps the lighter ones
		RankWeb_Seo_Bar::GOOD => '#007017',
		RankWeb_Seo_Bar::WARN => '#8a5a00',
		RankWeb_Seo_Bar::BAD  => '#b32d2e',
	);
	$icons  = array(
		RankWeb_Seo_Bar::GOOD => 'yes-alt',
		RankWeb_Seo_Bar::WARN => 'warning',
		RankWeb_Seo_Bar::BAD  => 'dismiss',
	);
	$worst  = RankWeb_Seo_Bar::worst( $checks );
	echo '<div class="aw-seo-col">';
	// One segment per check, in colour and, because colour alone is not enough, with the worst status in words.
	echo '<div style="display:flex;gap:2px;max-width:140px" aria-hidden="true">';
	foreach ( $checks as $c ) {
		echo '<span style="flex:1;height:6px;border-radius:3px;background:' . esc_attr( $colors[ $c['status'] ] ) . '"></span>';
	}
	echo '</div>';
	$n = RankWeb_Seo_Bar::counts( $checks );
	/* translators: 1: checks that pass, 2: checks to look at, 3: checks to fix. */
	echo '<span class="screen-reader-text">' . esc_html( sprintf( __( 'SEO checks: %1$d good, %2$d to check, %3$d to fix.', 'rankweb' ), $n['good'], $n['warn'], $n['bad'] ) ) . '</span>';
	echo '<div aria-hidden="true" style="color:' . esc_attr( $ink[ $worst ] ) . ';font-weight:600"><span class="dashicons dashicons-' . esc_attr( $icons[ $worst ] ) . '" style="vertical-align:middle"></span> ' . esc_html( $words[ $worst ] ) . '</div>';
	$todo = array_filter( $checks, fn( $c ) => RankWeb_Seo_Bar::GOOD !== $c['status'] );
	if ( $todo ) {
		echo '<ul style="margin:2px 0 0;list-style:none" aria-label="' . esc_attr__( 'SEO checks to look at', 'rankweb' ) . '">';
		foreach ( $todo as $c ) {
			echo '<li style="color:' . esc_attr( $ink[ $c['status'] ] ) . '"><span class="dashicons dashicons-' . esc_attr( $icons[ $c['status'] ] ) . '" style="font-size:16px;width:16px;height:16px;vertical-align:text-bottom" aria-hidden="true"></span> ' . esc_html( $c['label'] ) . '</li>';
		}
		echo '</ul>';
	}
	echo $extra; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- the callers escape what they pass
	echo '</div>';
}

/**
 * The SEO column cell, with the raw values in hidden spans for Quick Edit to read.
 *
 * @param string $col Column key.
 * @param int    $id  Item ID.
 */
function rankweb_bulk_column_cell( $col, $id ): void {
	if ( 'aw_seo' !== $col ) {
		return;
	}
	$id    = (int) $id;
	$title = (string) get_post_meta( $id, 'rank_math_title', true );
	$desc  = (string) get_post_meta( $id, 'rank_math_description', true );
	$focus = (string) get_post_meta( $id, 'rank_math_focus_keyword', true );
	$checks = RankWeb_Seo_Bar::checks(
		array(
			'title'       => $title,
			'post_title'  => (string) get_the_title( $id ),
			'description' => '' !== $desc ? $desc : (string) get_post_meta( $id, '_rankweb_description', true ),
			'focus'       => $focus,
			'noindex'     => rankweb_is_noindex_item( $id ) || '1' === (string) get_post_meta( $id, '_rankweb_noindex', true ),
			'slug'        => (string) get_post_field( 'post_name', $id ),
		)
	);
	rankweb_seo_bar_render(
		$checks,
		'<span class="hidden aw-seo-title">' . esc_html( $title ) . '</span>'
		. '<span class="hidden aw-seo-desc">' . esc_html( $desc ) . '</span>'
		. '<span class="hidden aw-seo-focus">' . esc_html( $focus ) . '</span>'
	);
}

// The column needs room: WordPress shares the width among the columns, and with several plugin columns the SEO one
// gets a few characters, so every check wraps a word to a line. Found in the browser (26 Nov 2026).
add_action(
	'admin_head',
	function () {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( $screen && in_array( $screen->base, array( 'edit', 'edit-tags', 'users' ), true ) ) {
			echo '<style>.wp-list-table th.column-aw_seo,.wp-list-table td.column-aw_seo{width:200px;min-width:160px}.column-aw_seo .aw-seo-col ul{margin-left:0;padding-left:0}</style>' . "\n";
		}
	}
);

/* ---------- The bar on the category, tag and user lists ---------- */

/** The taxonomies whose list screen shows the SEO Bar (public ones with a screen; filterable). */
function rankweb_bulk_taxonomies(): array {
	$tax = (array) apply_filters( 'rankweb_bulk_taxonomies', array( 'category', 'post_tag' ) );
	return array_values( array_filter( array_map( 'sanitize_key', $tax ), 'taxonomy_exists' ) );
}

/** The SEO Bar for a term, as HTML. */
function rankweb_seo_bar_for_term( int $term_id, string $taxonomy ): string {
	$term = get_term( $term_id, $taxonomy );
	if ( ! $term instanceof WP_Term ) {
		return '';
	}
	$checks = RankWeb_Seo_Bar::checks(
		RankWeb_Seo_Bar::input_for(
			array(
				'title'       => (string) get_term_meta( $term_id, 'rank_math_title', true ),
				'description' => (string) get_term_meta( $term_id, 'rank_math_description', true ),
				'focus'       => (string) get_term_meta( $term_id, 'rank_math_focus_keyword', true ),
				'robots'      => get_term_meta( $term_id, 'rank_math_robots', true ),
			),
			array(
				'name'        => $term->name,
				'description' => wp_strip_all_tags( $term->description ),
				'slug'        => $term->slug,
			)
		)
	);
	ob_start();
	rankweb_seo_bar_render( $checks );
	return (string) ob_get_clean();
}

/** The SEO Bar for a user (the author page), as HTML. */
function rankweb_seo_bar_for_user( int $user_id ): string {
	$user = get_userdata( $user_id );
	if ( ! $user ) {
		return '';
	}
	$checks = RankWeb_Seo_Bar::checks(
		RankWeb_Seo_Bar::input_for(
			array(
				'title'       => (string) get_user_meta( $user_id, 'rank_math_title', true ),
				'description' => (string) get_user_meta( $user_id, 'rank_math_description', true ),
				'focus'       => '',
				'robots'      => get_user_meta( $user_id, 'rank_math_robots', true ),
			),
			array(
				'name'        => (string) $user->display_name,
				'description' => (string) $user->description,
				'slug'        => (string) $user->user_nicename,
			)
		)
	);
	ob_start();
	rankweb_seo_bar_render( $checks );
	return (string) ob_get_clean();
}

add_action(
	'admin_init',
	function () {
		foreach ( rankweb_bulk_taxonomies() as $tax ) {
			add_filter(
				"manage_edit-{$tax}_columns",
				function ( $cols ) {
					$cols['aw_seo'] = __( 'SEO', 'rankweb' );
					return $cols;
				}
			);
			add_filter(
				"manage_{$tax}_custom_column",
				function ( $content, $col, $term_id ) use ( $tax ) {
					return 'aw_seo' === $col ? $content . rankweb_seo_bar_for_term( (int) $term_id, $tax ) : $content;
				},
				10,
				3
			);
		}
		if ( current_user_can( 'list_users' ) ) {
			add_filter(
				'manage_users_columns',
				function ( $cols ) {
					$cols['aw_seo'] = __( 'SEO', 'rankweb' );
					return $cols;
				}
			);
			add_filter(
				'manage_users_custom_column',
				fn( $content, $col, $user_id ) => 'aw_seo' === $col ? $content . rankweb_seo_bar_for_user( (int) $user_id ) : $content,
				10,
				3
			);
		}
	}
);

/* ---------- The filter ---------- */

add_action(
	'restrict_manage_posts',
	function ( $post_type ) {
		if ( ! in_array( (string) $post_type, rankweb_bulk_types(), true ) ) {
			return;
		}
		$current = isset( $_GET['aw_seo_filter'] ) ? sanitize_key( wp_unslash( $_GET['aw_seo_filter'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- a read-only list filter
		$options = array(
			''         => __( 'SEO: any', 'rankweb' ),
			'no_title' => __( 'No SEO title', 'rankweb' ),
			'no_desc'  => __( 'No description', 'rankweb' ),
			'no_focus' => __( 'No focus keyword', 'rankweb' ),
			'noindex'  => __( 'Noindex', 'rankweb' ),
			'orphan'   => __( 'No internal links in', 'rankweb' ),
		);
		echo '<select name="aw_seo_filter">';
		foreach ( $options as $value => $label ) {
			echo '<option value="' . esc_attr( $value ) . '"' . selected( $current, $value, false ) . '>' . esc_html( $label ) . '</option>';
		}
		echo '</select>';
	}
);

add_action(
	'pre_get_posts',
	function ( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'edit' !== $screen->base || ! in_array( (string) $screen->post_type, rankweb_bulk_types(), true ) ) {
			return;
		}
		$filter = isset( $_GET['aw_seo_filter'] ) ? sanitize_key( wp_unslash( $_GET['aw_seo_filter'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- a read-only list filter
		if ( '' === $filter ) {
			return;
		}
		if ( 'orphan' === $filter ) {
			$orphans = rankweb_bulk_orphan_ids( (string) $screen->post_type );
			$query->set( 'post__in', $orphans ? $orphans : array( 0 ) );
			return;
		}
		$map = array(
			'no_title' => 'rank_math_title',
			'no_desc'  => 'rank_math_description',
			'no_focus' => 'rank_math_focus_keyword',
		);
		if ( isset( $map[ $filter ] ) ) {
			$query->set(
				'meta_query', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- an admin list filter the editor chose
				array(
					'relation' => 'OR',
					array(
						'key'     => $map[ $filter ],
						'compare' => 'NOT EXISTS',
					),
					array(
						'key'     => $map[ $filter ],
						'value'   => '',
						'compare' => '=',
					),
				)
			);
		} elseif ( 'noindex' === $filter ) {
			$query->set(
				'meta_query', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- an admin list filter the editor chose
				array(
					array(
						'key'     => 'rank_math_robots',
						'value'   => 'noindex',
						'compare' => 'LIKE',
					),
				)
			);
		}
	}
);

/**
 * Item IDs of a type the audit marked as orphans (no internal links in).
 *
 * @param string $type Post type.
 * @return int[]
 */
function rankweb_bulk_orphan_ids( string $type ): array {
	global $wpdb;
	if ( ! function_exists( 'rankweb_link_table' ) || get_option( 'aw_link_audit_db' ) !== '1' ) {
		return array();
	}
	$ids = $wpdb->get_col( $wpdb->prepare( 'SELECT a.post_id FROM %i a JOIN %i p ON p.ID = a.post_id WHERE p.post_type = %s AND a.flags LIKE %s', rankweb_link_table( 'audit' ), $wpdb->posts, $type, '%,orphan,%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table, an admin list filter
	return array_map( 'intval', (array) $ids );
}

/* ---------- Quick Edit and Bulk Edit ---------- */

add_action(
	'quick_edit_custom_box',
	function ( $col, $post_type ) {
		if ( 'aw_seo' !== $col || ! in_array( (string) $post_type, rankweb_bulk_types(), true ) ) {
			return;
		}
		wp_nonce_field( 'aw_bulk_quick', 'aw_bulk_quick_nonce' );
		echo '<fieldset class="inline-edit-col-right"><div class="inline-edit-col"><div class="inline-edit-group wp-clearfix">';
		echo '<input type="hidden" name="aw_seo_loaded" value="0">'; // the script sets 1 once it has filled the fields from the row
		echo '<label class="inline-edit-group"><span class="title">' . esc_html__( 'SEO title', 'rankweb' ) . '</span><input type="text" name="aw_seo_title" class="aw-seo-field" value=""></label>';
		echo '<label class="inline-edit-group"><span class="title">' . esc_html__( 'Description', 'rankweb' ) . '</span><textarea name="aw_seo_desc" class="aw-seo-field" rows="1"></textarea></label>';
		echo '<label class="inline-edit-group"><span class="title">' . esc_html__( 'Focus keyword', 'rankweb' ) . '</span><input type="text" name="aw_seo_focus" class="aw-seo-field" value=""></label>';
		echo '</div></div></fieldset>';
	},
	10,
	2
);

add_action(
	'bulk_edit_custom_box',
	function ( $col, $post_type ) {
		if ( 'aw_seo' !== $col || ! in_array( (string) $post_type, rankweb_bulk_types(), true ) ) {
			return;
		}
		wp_nonce_field( 'aw_bulk_quick', 'aw_bulk_quick_nonce' );
		echo '<fieldset class="inline-edit-col-right"><div class="inline-edit-col">';
		echo '<label class="inline-edit-group"><span class="title">' . esc_html__( 'Focus keyword', 'rankweb' ) . '</span><input type="text" name="aw_seo_focus_bulk" value="" placeholder="' . esc_attr__( 'leave blank to keep', 'rankweb' ) . '"></label>';
		echo '<label class="inline-edit-group"><span class="title">' . esc_html__( 'Add link keyword', 'rankweb' ) . '</span><input type="text" name="aw_seo_linkkw_bulk" value="" placeholder="' . esc_attr__( 'added to each item', 'rankweb' ) . '"></label>';
		echo '<label class="inline-edit-group"><span class="title">' . esc_html__( 'Search index', 'rankweb' ) . '</span><select name="aw_seo_robots_bulk"><option value="">' . esc_html__( '— No change —', 'rankweb' ) . '</option><option value="index">' . esc_html__( 'Index', 'rankweb' ) . '</option><option value="noindex">' . esc_html__( 'Noindex', 'rankweb' ) . '</option></select></label>';
		echo '</div></fieldset>';
	},
	10,
	2
);

// Quick Edit (one item) and Bulk Edit (many) both reach save_post through wp_update_post. The nonce covers both; Bulk
// Edit also passes WordPress's own bulk nonce, checked by the core handler before this runs.
add_action(
	'save_post',
	function ( $post_id, $post ) {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) || ! in_array( $post->post_type, rankweb_bulk_types(), true ) ) {
			return;
		}
		if ( ! isset( $_REQUEST['aw_bulk_quick_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['aw_bulk_quick_nonce'] ) ), 'aw_bulk_quick' ) || ! current_user_can( 'edit_post', (int) $post_id ) ) {
			return;
		}
		$bulk = isset( $_REQUEST['bulk_edit'] );
		// Quick Edit: the three text fields, always written (an empty value clears).
		if ( ! $bulk ) {
			// Only when the script filled the fields from the row: with the SEO column hidden (Screen Options) they are
			// empty, and saving would clear the title, description and focus keyword.
			if ( '1' !== ( isset( $_REQUEST['aw_seo_loaded'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['aw_seo_loaded'] ) ) : '' ) ) {
				return;
			}
			if ( isset( $_REQUEST['aw_seo_title'] ) ) {
				update_post_meta( $post_id, 'rank_math_title', sanitize_text_field( wp_unslash( $_REQUEST['aw_seo_title'] ) ) );
			}
			if ( isset( $_REQUEST['aw_seo_desc'] ) ) {
				update_post_meta( $post_id, 'rank_math_description', sanitize_textarea_field( wp_unslash( $_REQUEST['aw_seo_desc'] ) ) );
			}
			if ( isset( $_REQUEST['aw_seo_focus'] ) ) {
				update_post_meta( $post_id, 'rank_math_focus_keyword', sanitize_text_field( wp_unslash( $_REQUEST['aw_seo_focus'] ) ) );
			}
			return;
		}
		// Bulk Edit: only the fields the editor filled in (blank = keep).
		$focus = isset( $_REQUEST['aw_seo_focus_bulk'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['aw_seo_focus_bulk'] ) ) : '';
		if ( '' !== $focus ) {
			update_post_meta( $post_id, 'rank_math_focus_keyword', $focus );
		}
		$add = isset( $_REQUEST['aw_seo_linkkw_bulk'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['aw_seo_linkkw_bulk'] ) ) : '';
		if ( '' !== $add && function_exists( 'rankweb_link_keywords_clean' ) ) {
			$list = rankweb_link_keywords_clean( array_merge( rankweb_bulk_link_keywords( (int) $post_id ), array( $add ) ) );
			update_post_meta( $post_id, '_aw_link_keywords', $list );
		}
		$robots = isset( $_REQUEST['aw_seo_robots_bulk'] ) ? sanitize_key( wp_unslash( $_REQUEST['aw_seo_robots_bulk'] ) ) : '';
		if ( 'index' === $robots || 'noindex' === $robots ) {
			$flags   = array_values( array_diff( rankweb_bulk_robots( (int) $post_id ), array( 'index', 'noindex' ) ) );
			$flags[] = $robots;
			update_post_meta( $post_id, 'rank_math_robots', $flags );
		}
	},
	10,
	2
);

// Quick Edit JS: copy the hidden column values into the Quick Edit fields when the row opens.
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( 'edit.php' !== $hook || ! $screen || ! in_array( (string) $screen->post_type, rankweb_bulk_types(), true ) ) {
			return;
		}
		$js = <<<'JS'
( function() {
	if ( ! window.inlineEditPost || ! window.jQuery ) { return; }
	var $ = window.jQuery, orig = inlineEditPost.edit;
	inlineEditPost.edit = function( id ) {
		orig.apply( this, arguments );
		var postId = typeof id === 'object' ? parseInt( this.getId( id ), 10 ) : id;
		if ( ! postId ) { return; }
		var row = $( '#post-' + postId );
		var ed  = $( '#edit-' + postId );
		ed.find( 'input[name="aw_seo_title"]' ).val( row.find( '.aw-seo-title' ).text() );
		ed.find( 'textarea[name="aw_seo_desc"]' ).val( row.find( '.aw-seo-desc' ).text() );
		ed.find( 'input[name="aw_seo_focus"]' ).val( row.find( '.aw-seo-focus' ).text() );
		ed.find( 'input[name="aw_seo_loaded"]' ).val( row.find( '.aw-seo-title' ).length ? '1' : '0' );
	};
} )();
JS;
		wp_register_script( 'aw-bulk-inline', '', array( 'inline-edit-post', 'jquery' ), '2.1.0', true );
		wp_enqueue_script( 'aw-bulk-inline' );
		wp_add_inline_script( 'aw-bulk-inline', $js );
	}
);
