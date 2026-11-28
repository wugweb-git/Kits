<?php
/**
 * Animal Writes site layer: the values Kits Core 1.4.0's generic features read through filters, so the live Animal Writes
 * site behaves as before. Each block names the Kits Core file that reads it.
 *
 * @package animalwrites-kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------- Error pages (Kits Core includes/ops/not-found.php, includes/error-pages.php) ---------- */

// The drop-ins (assets/site/dropins/) and the 404, 500 and 503 pictures (assets/site/error/) are this layer's.
add_filter( 'kits_error_pages_dir', fn() => ANIMALWRITES_KITS_CORE_SITE_DIR . 'assets/site/dropins/' );
// The marker pages already installed in wp-content carry: a compatibility key, unchanged, so they are updated in place.
add_filter( 'kits_error_page_marker', fn() => 'Animal Writes error page' );
add_filter(
	'kits_error_picture_source',
	fn() => array(
		'dir' => ANIMALWRITES_KITS_CORE_SITE_DIR . 'assets/site/error/',
		'url' => plugins_url( 'assets/site/error/', ANIMALWRITES_KITS_CORE_SITE_DIR . 'kits-core-site.php' ),
	)
);

/* ---------- Forms (Kits Core includes/forms/fluentforms.php) ---------- */

// References read AW-12, AW-V-3, AW-C-4, AW-R-5 on this site.
add_filter( 'kits_ff_ref_prefixes', fn() => array( 'contact' => 'AW-', 'volunteer' => 'AW-V-', 'claim' => 'AW-C-', 'report' => 'AW-R-' ) );
// The private claim files are opened by whoever may edit volunteers.
add_filter( 'kits_ff_file_capability', fn() => 'edit_aw_volunteers' );
// A page with the volunteer block shows a form: Fluent Forms' stylesheets keep blocking there.
add_filter(
	'kits_page_has_form',
	fn( $has ) => $has || ( is_singular() && (bool) preg_match( '/wp:animal-writes\/volunteer/', (string) get_post_field( 'post_content', get_queried_object_id() ) ) )
);

/* ---------- Media groups (Kits Core includes/media-groups.php) ---------- */

add_filter(
	'kits_media_group_for',
	function ( $name, $title, $base, $mime, $parent_type ) {
		unset( $mime );
		if ( 'aw_listing' === $parent_type ) {
			return 'Listing photo';
		}
		if ( 'aw_legal' === $parent_type ) {
			return 'Library document';
		}
		if ( 'aw_press' === $parent_type ) {
			return 'Press image';
		}
		if ( preg_match( '/^Animal Writes campaign photo/i', (string) $title ) || 0 === strpos( (string) $base, 'aw1-im' ) ) {
			return 'Campaign photo';
		}
		return $name;
	},
	10,
	5
);

/* ---------- Media merge tool (Kits Core includes/tools/media-merge.php) ---------- */

add_filter( 'kits_media_merge_groups', fn() => (array) require ANIMALWRITES_KITS_CORE_SITE_DIR . 'includes/tools/data/media-duplicate-groups.php' );
add_filter( 'kits_media_merge_meta_keys', fn( $keys ) => array_merge( (array) $keys, array( 'aw_campaign_share_image', 'aw_campaign_share_story', 'aw_campaign_share_post' ) ) );
add_filter( 'kits_media_merge_known_keys', fn( $keys ) => array_merge( (array) $keys, array( 'aw_doc_preview', 'aw_file_id', 'aw_press_logo', 'aw_c_logo', 'aw_banner_image' ) ) );

/* ---------- Admin (Kits Core includes/admin-layer/, includes/admin-home.php) ---------- */

// The Overview's old address (admin.php?page=animal-writes) goes to Kits → Home.
add_filter( 'kits_admin_redirects', fn( $map ) => array_merge( (array) $map, array( 'animal-writes' => KITS_MENU ) ) );
// The map's source name for this site's own code, and the folders of its own plugins, on Help → Developer → Edit screens.
add_filter( 'kits_edit_screen_own_plugins', fn( $own ) => array_merge( array( 'Animal Writes core' ), (array) $own ) );
add_filter( 'kits_edit_screen_own_folders', fn( $own ) => array_merge( array( 'aw-seo-extras', 'aw-sourcing' ), (array) $own ) );
// The Overview counts this site's pattern category too.
add_filter( 'kits_overview_pattern_categories', fn( $cats ) => array_merge( array( 'animal-writes' ), (array) $cats ) );
// The campaign letters Dashboard box keeps its card look.
add_action(
	'admin_head-index.php',
	function () {
		$css = (string) file_get_contents( ANIMALWRITES_KITS_CORE_SITE_DIR . 'assets/css/dashboard-letters.css' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		echo '<style id="aw-dashboard-letters">' . wp_strip_all_tags( $css ) . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- our own file, tags stripped.
	}
);

/* ---------- Daily backup (Kits Core includes/backups.php) ---------- */

// A site where this backup already ran (aw_backup_last) or is booked (aw_daily_backup) keeps it on, once, with no manual step.
add_filter(
	'kits_daily_backup_first_choice',
	fn( $choice ) => ( get_option( 'aw_backup_last' ) || wp_next_scheduled( 'aw_daily_backup' ) ) ? '1' : $choice
);

/* ---------- One-time carry-over (was in Kits Core includes/ops/daily.php, 1.3.3) ---------- */

/**
 * The Animal Writes site books aw_error_count_daily, so it was running what Kits Core 1.3.3 left off by default. A site that
 * has that schedule keeps everything on: admin tidy, the daily error count, aw_daily, the public deploy-gate routes and the
 * form copy. Runs once (option kits_aw_carryover_done).
 */
add_action(
	'init',
	function () {
		if ( get_option( 'kits_aw_carryover_done' ) ) {
			return;
		}
		if ( wp_next_scheduled( 'aw_error_count_daily' ) ) {
			foreach ( array( 'kits_tidy_menus', 'kits_error_count_daily', 'kits_daily_event', 'kits_public_gate_routes', 'kits_form_raw_capture' ) as $opt ) {
				update_option( $opt, '1' );
			}
		}
		update_option( 'kits_aw_carryover_done', '1', false );
	},
	1
);

// Who may edit the dates (Kits Core's Dates screen): PlanWeb's site layer names the capability.
add_filter(
	'kits_dates_cap',
	function ( $cap ) {
		return defined( 'AW_DATES_CAP' ) ? AW_DATES_CAP : $cap;
	}
);

// The contact form's message placeholders, one per reason (Animal Writes Core's list, when it is loaded).
add_filter(
	'kits_contact_placeholders',
	function ( $placeholders ) {
		return defined( 'AW_CONTACT_PLACEHOLDER' ) && is_array( AW_CONTACT_PLACEHOLDER ) ? AW_CONTACT_PLACEHOLDER : $placeholders;
	}
);
