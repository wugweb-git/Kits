<?php
/**
 * Notion master data: client post type, taxonomies and case study / client fields.
 * Fields are post meta / term meta exposed in REST so they appear in the editor and API.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function wugweb_core_client_fields() {
	return array(
  'client_id'=>'string',
  'entity_type'=>'string',
  'logo'=>'string',
  'website'=>'string',
  'country_legacy'=>'string',
  'year_first_worked'=>'integer',
  'date'=>'string',
  'engagements'=>'string',
  'partnered_by'=>'string',
  'projects'=>'string',
  'case_studies'=>'string',
  'blocked_by'=>'string',
  'blocking'=>'string',
  'status'=>'string'
	);
}
function wugweb_core_cs_fields() {
	return array(
  'case_study_id'=>'string',
  'client'=>'string',
  'featured'=>'boolean',
  'primary_discipline'=>'string',
  'additional_disciplines'=>'string',
  'engagement_type'=>'string',
  'project_type'=>'string',
  'platform'=>'string',
  'partner'=>'string',
  'team'=>'string',
  'special_thanks'=>'string',
  'timeline'=>'string',
  'year'=>'string',
  'country'=>'string',
  'live_url'=>'string',
  'prototype_url'=>'string',
  'seo_score'=>'string',
  'subtitle'=>'string',
  'short_title'=>'string',
  'ai_summary'=>'string',
  'ai_keywords'=>'string',
  'results'=>'string',
  'word_count'=>'integer',
  'read_time'=>'integer',
  'cover_image'=>'string',
  'client_logo'=>'string',
  'assets'=>'string',
  'categories'=>'string',
  'services'=>'string',
  'industry'=>'string',
  'sector'=>'string',
  'related_posts'=>'string',
  'related_cases'=>'string',
  'owner'=>'string',
  'date_last_updated_start'=>'string',
  'publications'=>'string',
  'published_at'=>'string',
  'filter_category'=>'string',
	);
}
add_action( 'init', function () {
	add_post_type_support( 'case_study', 'custom-fields' );
	add_post_type_support( 'case_study', 'excerpt' );
	register_post_type( 'client', array(
		'labels' => array( 'name' => 'Clients', 'singular_name' => 'Client' ),
		'public' => false, 'show_ui' => true, 'show_in_rest' => true, 'rest_base' => 'client',
		'menu_icon' => 'dashicons-businessperson', 'has_archive' => false, 'rewrite' => false,
		'supports' => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'excerpt' ),
		'taxonomies' => array( 'industry', 'country', 'sector' ),
	) );

	$tax = array(
		'sector' => array( 'Sectors', array( 'client', 'case_study' ), true ),
		'country' => array( 'Countries', array( 'client', 'case_study' ), true ),
		'platform' => array( 'Platforms', array(), true ),
		'tool' => array( 'Tool Stack', array( 'case_study' ), true ),
		'asset_type' => array( 'Asset Types', array(), false ),
		'content_type' => array( 'Content Types', array(), false ),
		'department' => array( 'Departments', array(), false ),
		'owner' => array( 'Owners', array( 'post', 'case_study' ), false ),
		'service_group' => array( 'Service Sub-Groups', array(), false ),
	);
	foreach ( $tax as $slug => $t ) {
		register_taxonomy( $slug, $t[1], array(
			'labels' => array( 'name' => $t[0], 'singular_name' => rtrim( $t[0], 's' ) ),
			'public' => $t[2], 'publicly_queryable' => false, 'show_ui' => true, 'show_in_rest' => true,
			'rest_base' => $slug, 'hierarchical' => false, 'rewrite' => false, 'show_admin_column' => true,
		) );
	}
	// Tags are not used on case studies or clients; Categories/Tags stay on Posts only. Detach only: terms stay in the database.
	foreach ( array( 'industry', 'discipline' ) as $s ) {
		register_taxonomy_for_object_type( $s, 'case_study' );
	}
	foreach ( array( 'industry', 'sector' ) as $s ) { register_taxonomy_for_object_type( $s, 'client' ); }
	foreach ( array( 'industry', 'service_group' ) as $s ) { register_taxonomy_for_object_type( $s, 'post' ); }

	foreach ( array_merge( array_keys( $tax ), array( 'industry', 'discipline', 'post_tag' ) ) as $s ) {
		foreach ( array( 'notion_url', 'notion_data' ) as $m ) {
			register_term_meta( $s, 'wugweb_' . $m, array( 'type' => 'string', 'single' => true, 'show_in_rest' => true ) );
		}
	}

	foreach ( array_merge( array_keys( $tax ), array( 'industry', 'discipline' ) ) as $s ) {
		register_term_meta( $s, 'wugweb_icon_path', array( 'type' => 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field' ) );
	}
	register_post_meta( 'client', 'wugweb_icon_path', array( 'type' => 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field' ) );

	foreach ( wugweb_core_client_fields() as $k => $t ) {
		register_post_meta( 'client', 'wugweb_client_' . $k, array( 'type' => $t, 'single' => true, 'show_in_rest' => true ) );
	}
	foreach ( wugweb_core_cs_fields() as $k => $t ) {
		register_post_meta( 'case_study', 'wugweb_cs_' . $k, array( 'type' => $t, 'single' => true, 'show_in_rest' => true ) );
	}
}, 30 );
