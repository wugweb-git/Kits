<?php
/**
 * RankWeb Gutenberg Block Editor Sidebar & Live SEO Score Engine.
 *
 * Benchmark: Rank Math Pro / Yoast SEO.
 * Provides a native block editor sidebar panel:
 * - Live 0-100 SEO Score Pill in editor header/status bar.
 * - Interactive SERP Snippet Preview (Google Mobile, Google Desktop, OpenGraph).
 * - Real-time Content Analysis Checklist (Title, Intro, URL, Headings, Word Count, Internal/External Links, Image Alts).
 * - Visual Schema Selector.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-robots.php';

/**
 * Post types the sidebar and its meta are registered for. Default post, page and aw_press; filterable.
 *
 * @return string[]
 */
function rankweb_sidebar_post_types(): array {
	return array_values( array_filter( array_map( 'sanitize_key', (array) apply_filters( 'rankweb_sidebar_post_types', array( 'post', 'page', 'aw_press' ) ) ) ) );
}

/**
 * Register post meta fields for block editor.
 */
add_action(
	'init',
	function () {
		$screens = rankweb_sidebar_post_types();
		foreach ( $screens as $type ) {
			register_post_meta(
				$type,
				'rank_math_focus_keyword',
				array(
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'string',
					'auth_callback' => fn() => current_user_can( 'edit_posts' ),
				)
			);
			foreach ( array( 'rank_math_title', 'rank_math_description' ) as $key ) { // Rank Math's own fields: the sidebar edits what the page prints.
				register_post_meta(
					$type,
					$key,
					array(
						'show_in_rest'      => true,
						'single'            => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
					)
				);
			}
			register_post_meta(
				$type,
				'_rankweb_score',
				array(
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'integer',
					'auth_callback' => fn() => current_user_can( 'edit_posts' ),
				)
			);
			register_post_meta(
				$type,
				'_rankweb_schema_type',
				array(
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
					'sanitize_callback' => fn( $v ) => function_exists( 'rankweb_schema_types' ) && in_array( $v, rankweb_schema_types(), true ) ? $v : '',
					'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
				)
			);
			register_post_meta(
				$type,
				'_rankweb_description',
				array(
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
					'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
				)
			);
			register_post_meta(
				$type,
				'_rankweb_noindex',
				array(
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
					'sanitize_callback' => fn( $v ) => '1' === (string) $v ? '1' : '',
					'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
				)
			);
			foreach ( array( '_rankweb_nofollow', '_rankweb_noarchive', '_rankweb_nosnippet' ) as $flag_key ) {
				register_post_meta(
					$type,
					$flag_key,
					array(
						'show_in_rest'      => true,
						'single'            => true,
						'type'              => 'string',
						'sanitize_callback' => fn( $v ) => '1' === (string) $v ? '1' : '',
						'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
					)
				);
			}
			register_post_meta(
				$type,
				'_rankweb_max_snippet',
				array(
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
					'sanitize_callback' => fn( $v ) => null === RankWeb_Robots::max_snippet( $v ) ? '' : (string) RankWeb_Robots::max_snippet( $v ),
					'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
				)
			);
		}
	}
);

/**
 * Enqueue Block Editor Sidebar Assets.
 */
add_action(
	'enqueue_block_editor_assets',
	function () {
		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->post_type, rankweb_sidebar_post_types(), true ) ) {
			return;
		}

		$dir = plugin_dir_path( dirname( __FILE__ ) );
		$uri = plugin_dir_url( dirname( __FILE__ ) );

		wp_enqueue_script(
			'rankweb-editor-sidebar',
			$uri . 'assets/editor-sidebar.js',
			array( 'wp-plugins', 'wp-editor', 'wp-edit-post', 'wp-core-data', 'wp-element', 'wp-components', 'wp-data', 'wp-compose', 'wp-i18n' ),
			(string) filemtime( $dir . 'assets/editor-sidebar.js' ),
			true
		);

		wp_enqueue_style(
			'rankweb-editor-sidebar',
			$uri . 'assets/editor-sidebar.css',
			array( 'wp-components' ),
			(string) filemtime( $dir . 'assets/editor-sidebar.css' )
		);

		wp_localize_script(
			'rankweb-editor-sidebar',
			'rankwebEditorData',
			array(
				'siteUrl'    => untrailingslashit( get_site_url() ),
				'siteHost'   => (string) wp_parse_url( get_site_url(), PHP_URL_HOST ),
				'siteName'   => get_bloginfo( 'name' ),
				'postType'   => $screen->post_type,
				'postId'     => get_the_ID(),
				'pluginName' => 'RankWeb SEO',
				'schemaTypes' => function_exists( 'rankweb_schema_types' ) ? rankweb_schema_types() : array( 'Article' ),
			)
		);
	}
);

/* ---------- Classic editor: the same robots choices as the block editor sidebar, in a meta box ---------- */

add_action(
	'add_meta_boxes',
	function ( $post_type, $post = null ) {
		if ( ! $post instanceof WP_Post || ! in_array( (string) $post_type, rankweb_sidebar_post_types(), true ) || ! current_user_can( 'edit_post', (int) $post->ID ) ) {
			return;
		}
		add_meta_box(
			'rankweb-robots',
			__( 'Search engines (RankWeb)', 'rankweb' ),
			'rankweb_robots_box',
			$post_type,
			'side',
			'default',
			array( '__back_compat_meta_box' => true ) // the block editor has these in the RankWeb sidebar, so it hides this box
		);
	},
	10,
	2
);

/** The classic robots box. */
function rankweb_robots_box( WP_Post $post ): void {
	$id = (int) $post->ID;
	wp_nonce_field( 'rankweb_robots_' . $id, 'rankweb_robots_nonce' );
	$rows = array(
		'noindex'   => __( 'Keep out of search results', 'rankweb' ),
		'nofollow'  => __( 'Do not follow links on this page', 'rankweb' ),
		'noarchive' => __( 'Do not show a cached copy', 'rankweb' ),
		'nosnippet' => __( 'Do not show a text snippet', 'rankweb' ),
	);
	foreach ( $rows as $key => $label ) {
		echo '<p><label><input type="checkbox" name="rankweb_robots[' . esc_attr( $key ) . ']" value="1"' . checked( '1', (string) get_post_meta( $id, '_rankweb_' . $key, true ), false ) . ' /> ' . esc_html( $label ) . '</label></p>';
	}
	echo '<p><label for="rankweb-max-snippet">' . esc_html__( 'Longest text snippet (characters)', 'rankweb' ) . '</label><br /><input type="number" min="-1" id="rankweb-max-snippet" name="rankweb_robots[max_snippet]" value="' . esc_attr( (string) get_post_meta( $id, '_rankweb_max_snippet', true ) ) . '" aria-describedby="rankweb-max-snippet-help" /></p>';
	echo '<p class="description" id="rankweb-max-snippet-help">' . esc_html__( 'Leave empty for no rule, -1 for no limit.', 'rankweb' ) . '</p>';
}

add_action(
	'save_post',
	function ( $post_id ) {
		$post_id = (int) $post_id;
		if ( wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || empty( $_POST['rankweb_robots_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['rankweb_robots_nonce'] ) ), 'rankweb_robots_' . $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		$form = isset( $_POST['rankweb_robots'] ) && is_array( $_POST['rankweb_robots'] ) ? array_map( 'sanitize_text_field', wp_unslash( $_POST['rankweb_robots'] ) ) : array();
		foreach ( RankWeb_Robots::clean_form( $form ) as $key => $value ) {
			if ( '' === $value ) {
				delete_post_meta( $post_id, $key );
			} else {
				update_post_meta( $post_id, $key, $value );
			}
		}
	}
);
