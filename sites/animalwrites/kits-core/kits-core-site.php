<?php
/**
 * Animal Writes site layer for Kits Core 1.4.0 and later.
 *
 * Everything Kits Core used to carry for the Animal Writes site only: the campaign letters and campaign form, the
 * volunteer and report forms and their pages, the campaign link taxonomy, the taxonomy rename tool, the thumbnail and
 * category picture code, the media reuse tool, opportunity retention, the older aw_ function names, the Animal Writes error
 * pages, and the filters that give Kits Core's generic features Animal Writes' values. Code moved here unchanged; option names,
 * meta keys, hooks, routes and slugs are the same as before.
 *
 * This folder is NOT part of the Kits Core plugin zip. Deploy it next to Kits Core 1.4.0 and load it as a must-use
 * plugin (see README.md). It does nothing until Kits Core 1.4.0 or later is loaded, and it must not be loaded with an
 * older Kits Core, which still carries the same functions.
 *
 * @package animalwrites-kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( defined( 'ANIMALWRITES_KITS_CORE_SITE' ) ) {
	return;
}
define( 'ANIMALWRITES_KITS_CORE_SITE', '1.4.0' );
define( 'ANIMALWRITES_KITS_CORE_SITE_DIR', __DIR__ . '/' );

require_once ANIMALWRITES_KITS_CORE_SITE_DIR . 'config-names.php'; // earlier wp-config.php names -> Kits Core's own constants (before the plugin loads).

// The uninstall and deactivation hooks work whether or not Kits Core is active (it is deactivated when it is deleted).
require_once ANIMALWRITES_KITS_CORE_SITE_DIR . 'includes/site-uninstall.php';

/**
 * Loads the layer once Kits Core is loaded. Must-use plugins load before plugins, so this waits for plugins_loaded.
 */
function animalwrites_kits_core_site_load(): void {
	if ( ! defined( 'KITS_CORE_VERSION' ) || ! defined( 'KITS_CORE_LOADED' ) || version_compare( KITS_CORE_VERSION, '1.4.0', '<' ) ) {
		return; // Kits Core is not here, or is older than 1.4.0 (which still has these functions itself).
	}
	$dir = ANIMALWRITES_KITS_CORE_SITE_DIR . 'includes/';
	require_once $dir . 'aw-names.php'; // the earlier aw_* names for the theme and layers; the plugins no longer define them
	// The same order Kits Core loaded them in before 1.4.0.
	foreach ( array(
		'taxonomy-rename.php',
		'category-images.php',
		'thumbs.php',
		'card-images.php',
		'tools/media-reuse.php',
		'forms/form-pages.php',
		'forms/reports.php',
		'forms/volunteers.php',
		'forms/campaign-form.php',
		'forms/compat.php',
		'campaign-links.php',
		'campaign-letters.php',
		'ops/retention.php',
		'ops/compat.php',
		'compat-backups-error-pages.php',
		'site-filters.php',
	) as $file ) {
		require_once $dir . $file;
	}
	// The Library "Dated" and campaign "Metrics" edit fields moved here from Kits Core 1.4.1; older Cores still carry them.
	if ( version_compare( KITS_CORE_VERSION, '1.4.1', '>=' ) ) {
		require_once $dir . 'edit-fields.php';
	}
}
add_action( 'plugins_loaded', 'animalwrites_kits_core_site_load', 1 );
