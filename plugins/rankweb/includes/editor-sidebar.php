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
			array( 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-compose', 'wp-i18n' ),
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
				'siteUrl'    => get_site_url(),
				'siteName'   => get_bloginfo( 'name' ),
				'postType'   => $screen->post_type,
				'postId'     => get_the_ID(),
				'pluginName' => 'RankWeb SEO',
				'schemaTypes' => function_exists( 'rankweb_schema_types' ) ? rankweb_schema_types() : array( 'Article' ),
			)
		);
	}
);
