<?php
/**
 * Folded menus: Kits under Appearance, each Wugweb plugin as one item under Plugins (admin-ui-spec §B0). The item opens the
 * product's first screen at its old address (admin.php?page=…); the product's other screens stay registered, with the
 * same addresses and capabilities, and show as core nav tabs above the screen. The model (addresses, owner, tabs) is
 * admin-fold-model.php; kits_admin_fold_tabs() prints the tabs (admin-menu.php).
 *
 * Nothing folds when Kits Core is not active: each plugin keeps its own top-level menu.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/admin-fold-model.php';

/**
 * The menus that fold: top-level menu slug => the WordPress menu their one item goes under.
 */
function kits_folded_menus(): array {
	$folds = array(
		'kits'               => 'themes.php',
		'directoryweb'       => 'plugins.php',
		'aw-sourcing-menu'   => 'plugins.php',
		'aw-seo-plus'        => 'plugins.php',
		'aw-search-insights' => 'plugins.php',
		'mailweb'            => 'plugins.php',
		'planweb'            => 'plugins.php',
	);
	/**
	 * Filters which top-level menus fold: slug => 'themes.php' or 'plugins.php'. Anything else is ignored.
	 *
	 * @param array $folds Top-level menu slug => parent menu.
	 */
	$folds = (array) apply_filters( 'kits_folded_menus', $folds );
	return array_filter( $folds, fn( $to ) => in_array( $to, array( 'themes.php', 'plugins.php' ), true ) );
}

// After every product has added its screens and the menu is in order (admin-screens.php sorts at 1000), before the old
// addresses redirect (10000).
add_action(
	'admin_menu',
	function () {
		global $menu;
		if ( ! is_array( $menu ) ) {
			return;
		}
		foreach ( kits_folded_menus() as $slug => $parent ) {
			foreach ( $menu as $entry ) {
				if ( ! is_array( $entry ) || ! isset( $entry[2] ) || (string) $slug !== (string) $entry[2] ) {
					continue;
				}
				// The item keeps the menu's name (with its count bubble) and its capability.
				add_submenu_page( $parent, wp_strip_all_tags( (string) $entry[0] ), (string) $entry[0], (string) $entry[1], kits_fold_link( (string) $slug ) );
				// Out of the top level only: its screens, addresses and capabilities stay (WordPress finds a screen in the submenus).
				remove_menu_page( (string) $slug );
				break;
			}
		}
	},
	1001
);

/**
 * The folded menu the current screen belongs to, '' when none.
 */
function kits_fold_current(): string {
	global $submenu, $plugin_page, $parent_file;
	return kits_fold_owner( (array) $submenu, kits_folded_menus(), is_string( $plugin_page ) ? $plugin_page : '', is_string( $parent_file ) ? $parent_file : '' );
}

// Light the one item under Appearance or Plugins on every screen of a folded menu.
add_filter(
	'parent_file',
	function ( $file ) {
		$owner = kits_fold_current();
		return '' === $owner ? $file : (string) kits_folded_menus()[ $owner ];
	},
	99
);

add_filter(
	'submenu_file',
	function ( $file ) {
		$owner = kits_fold_current();
		return '' === $owner ? $file : kits_fold_link( $owner );
	},
	99
);

// The other screens of a product (Kits prints its own five tabs) as core tabs, above the screen, once (an explicit kits_admin_fold_tabs() call on the
// same page then prints nothing more).
add_action(
	'in_admin_header',
	function () {
		$owner = kits_fold_current();
		if ( '' === $owner || 'kits' === $owner || ! function_exists( 'kits_admin_fold_tabs' ) ) {
			return;
		}
		global $submenu;
		// The row's name is the product's: a second row named "Screens" next to the header's own "Screens" is two
		// navigations a screen reader cannot tell apart. (The header hides this row when it lists the same screens.)
		$name = '';
		foreach ( (array) ( $submenu[ (string) ( kits_folded_menus()[ $owner ] ?? '' ) ] ?? array() ) as $item ) {
			if ( is_array( $item ) && isset( $item[0], $item[2] ) && kits_fold_link( $owner ) === $item[2] ) {
				$name = trim( explode( '<', (string) $item[0], 2 )[0] );
				break;
			}
		}
		kits_admin_fold_tabs(
			$owner,
			'' !== $name
				/* translators: %s: product name, e.g. RankWeb. */
				? sprintf( __( 'All %s screens', 'kits-core' ), $name )
				: __( 'All screens', 'kits-core' )
		);
	}
);

// More from Kits (more-products.php) is a hidden screen of the Kits menu (the menu keeps five items). It is reached from
// Kits Home and from this Plugins list: a link under Plugins, next to the products it offers.
add_action(
	'admin_menu',
	function () {
		if ( ! function_exists( 'kits_more_page' ) || ! current_user_can( 'install_plugins' ) ) {
			return;
		}
		add_submenu_page( 'plugins.php', __( 'More from Kits', 'kits-core' ), __( 'More from Kits', 'kits-core' ), 'install_plugins', kits_fold_link( 'kits-core-more' ) );
	},
	1002 // After the folded products' items (1001), so it comes last in the list.
);

// On the More page itself, light that item under Plugins.
add_filter(
	'parent_file',
	function ( $file ) {
		global $plugin_page;
		return 'kits-core-more' === $plugin_page ? 'plugins.php' : $file;
	},
	100
);
add_filter(
	'submenu_file',
	function ( $file ) {
		global $plugin_page;
		return 'kits-core-more' === $plugin_page ? kits_fold_link( 'kits-core-more' ) : $file;
	},
	100
);

// The page's tab title: the screen has no entry in the menu (the Kits menu keeps five), so WordPress has no name for it.
add_filter(
	'admin_title',
	function ( $admin_title, $title ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- which screen is open; nothing is saved here.
		if ( isset( $_GET['page'] ) && 'kits-core-more' === sanitize_key( wp_unslash( $_GET['page'] ) ) && '' === trim( (string) $title ) ) {
			return __( 'More from Kits', 'kits-core' ) . (string) $admin_title;
		}
		return $admin_title;
	},
	10,
	2
);
