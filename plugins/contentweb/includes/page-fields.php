<?php
/** Page management schema: every column of the Notion "Pages" table, stored as page meta and shown as list columns. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function wugweb_core_page_fields() {
	return array(
		'search_intent' => 'string', 'secondary_keywords' => 'string', 'hero_path' => 'string', 'media_paths' => 'string',
		'ai_summary' => 'string', 'key_takeaways' => 'string', 'redirect_to' => 'string',
	);
}

add_action( 'init', function () {
	add_post_type_support( 'page', 'custom-fields' );
	foreach ( wugweb_core_page_fields() as $k => $t ) {
		register_post_meta( 'page', 'wugweb_page_' . $k, array( 'type' => $t, 'single' => true, 'show_in_rest' => true ) );
	}
} );

add_action( 'admin_init', function () {
	$pg = array();
	foreach ( wugweb_core_page_fields() as $k => $t ) { $pg[ 'wugweb_page_' . $k ] = $t; }
	wugweb_admin_post_columns( 'page', 'wugweb_page_', $pg, array() );

	// Pages list: drop the default Author and Comments columns.
	add_filter( 'manage_page_posts_columns', function ( $cols ) { unset( $cols['author'], $cols['comments'] ); return $cols; }, 20 );
} );
