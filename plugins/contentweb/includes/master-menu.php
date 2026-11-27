<?php
/**
 * Master: one top-level admin menu group (slug wugweb-platforms, the Notion-data tables live there too).
 * Holds Clients, Categories, Tags and every Notion taxonomy once.
 * Menu entries only: taxonomies stay attached to their post types, no URLs or data change.
 */
defined( 'ABSPATH' ) || exit;

function wugweb_master_taxonomies() {
	// taxonomy => array( menu label, post type the list screen opens under ).
	return array(
		'category'      => array( 'Categories', 'post' ),
		'post_tag'      => array( 'Tags', 'post' ),
		'industry'      => array( 'Industry', 'case_study' ),
		'sector'        => array( 'Sectors', 'client' ),
		'country'       => array( 'Countries', 'client' ),
		'discipline'    => array( 'Discipline', 'case_study' ),
		'tool'          => array( 'Tool Stack', 'case_study' ),
		'owner'         => array( 'Owners', 'case_study' ),
		'service_group' => array( 'Service Sub-Groups', 'post' ),
		'platform'      => array( 'Platforms (terms)', 'post' ),
		'asset_type'    => array( 'Asset Types', 'post' ),
		'content_type'  => array( 'Content Types', 'post' ),
		'department'    => array( 'Departments', 'post' ),
	);
}

// The kits-core plugin lists Categories and Tags under its own Classification menu. They live under Master here,
// so take them off its list (any other shared taxonomy, such as linked campaigns, stays where the plugin puts it).
add_filter( 'kits_admin_shared_taxonomies', function ( $list ) {
	return array_values( array_diff( (array) $list, array( 'category', 'post_tag' ) ) );
} );

// Hide the per-post-type menu entries (the taxonomy keeps its post types).
add_filter( 'register_taxonomy_args', function ( $args, $taxonomy ) {
	if ( isset( wugweb_master_taxonomies()[ $taxonomy ] ) ) { $args['show_in_menu'] = false; }
	return $args;
}, 10, 2 );
add_filter( 'register_post_type_args', function ( $args, $type ) {
	if ( 'client' === $type ) { $args['show_in_menu'] = false; }
	return $args;
}, 10, 2 );

add_action( 'admin_menu', function () {
	global $submenu;
	if ( empty( $submenu['wugweb-platforms'] ) ) { return; }
	$cap = 'manage_options';
	add_submenu_page( 'wugweb-platforms', 'Clients', 'Clients', $cap, 'edit.php?post_type=client' );
	foreach ( wugweb_master_taxonomies() as $tax => $d ) {
		if ( taxonomy_exists( $tax ) ) {
			add_submenu_page( 'wugweb-platforms', $d[0], $d[0], $cap, 'edit-tags.php?taxonomy=' . $tax . '&post_type=' . $d[1] );
		}
	}
	// Clients first, then taxonomies, then the Notion tables; group title Master.
	$items = $submenu['wugweb-platforms'];
	$rank = function ( $i ) {
		if ( 'edit.php?post_type=client' === $i[2] ) { return 0; }
		return ( 0 === strpos( $i[2], 'edit-tags.php' ) ) ? 1 : 2;
	};
	usort( $items, function ( $a, $b ) use ( $rank ) { return $rank( $a ) <=> $rank( $b ); } );
	$submenu['wugweb-platforms'] = $items; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- reordering the menu this theme owns
}, 99 );

// Keep the Master group open and the right entry highlighted on taxonomy and Clients screens.
add_filter( 'parent_file', function ( $parent ) {
	global $current_screen, $taxonomy, $post_type;
	$tax = isset( $current_screen->taxonomy ) ? $current_screen->taxonomy : '';
	if ( $tax && isset( wugweb_master_taxonomies()[ $tax ] ) ) { return 'wugweb-platforms'; }
	if ( ( isset( $current_screen->post_type ) && 'client' === $current_screen->post_type ) ) { return 'wugweb-platforms'; }
	return $parent;
} );
add_filter( 'submenu_file', function ( $submenu_file ) {
	global $current_screen;
	$tax = isset( $current_screen->taxonomy ) ? $current_screen->taxonomy : '';
	if ( $tax && isset( wugweb_master_taxonomies()[ $tax ] ) ) {
		return 'edit-tags.php?taxonomy=' . $tax . '&post_type=' . wugweb_master_taxonomies()[ $tax ][1];
	}
	if ( isset( $current_screen->post_type ) && 'client' === $current_screen->post_type ) { return 'edit.php?post_type=client'; }
	return $submenu_file;
} );
