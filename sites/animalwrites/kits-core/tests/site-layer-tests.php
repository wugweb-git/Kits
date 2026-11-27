<?php
// No ABSPATH guard: this is a command-line runner that defines ABSPATH itself.
/**
 * Tests that need no WordPress: the Animal Writes site layer for Kits Core 1.4.0 (sites/animalwrites/kits-core/).
 * It loads only with Kits Core 1.4.0 or later; its filters give Kits Core's generic features the values the live site had
 * before they were taken out of the plugin (media groups, error pages and their marker, form references and capability,
 * the first backup choice, the redirect and the Edit screens names); the moved screens still join the Kits frame with their
 * own capability; the drop-ins keep the marker the installed pages carry; and the uninstall extensions are registered.
 *
 * Usage: php sites/animalwrites/kits-core/tests/site-layer-tests.php
 *
 * @package animalwrites-kits-core
 */

if ( 'cli' !== PHP_SAPI ) {
	exit;
}

// phpcs:disable -- a command-line test runner with WordPress stubs.

define( 'ABSPATH', sys_get_temp_dir() . '/aw-site-layer-tests/' );
define( 'KITS_MENU', 'kits' );
define( 'KITS_CORE_DIR', dirname( __DIR__, 4 ) . '/plugins/kits-core/' );

$GLOBALS['t_hooks']   = array();
$GLOBALS['t_options'] = array();
$GLOBALS['t_cron']    = array();

function add_filter( $hook, $cb, $prio = 10, $args = 1 ) {
	$GLOBALS['t_hooks'][ $hook ][] = array( $cb, $args );
	return true;
}
function add_action( $hook, $cb, $prio = 10, $args = 1 ) {
	return add_filter( $hook, $cb, $prio, $args );
}
function apply_filters( $hook, $value, ...$rest ) {
	foreach ( $GLOBALS['t_hooks'][ $hook ] ?? array() as $h ) {
		$value = call_user_func_array( $h[0], array_slice( array_merge( array( $value ), $rest ), 0, max( 1, $h[1] ) ) );
	}
	return $value;
}
function get_option( $n, $d = false ) {
	return $GLOBALS['t_options'][ $n ] ?? $d;
}
function wp_next_scheduled( $hook ) {
	return $GLOBALS['t_cron'][ $hook ] ?? false;
}
function plugins_url( $path = '', $plugin = '' ) {
	return 'https://example.test/wp-content/mu-plugins/' . ltrim( $path, '/' );
}
function trailingslashit( $s ) {
	return rtrim( (string) $s, '/\\' ) . '/';
}
function is_singular() {
	return false;
}

$fails = 0;
$n     = 0;
function check( $what, $ok ) {
	global $fails, $n;
	++$n;
	if ( ! $ok ) {
		++$fails;
	}
	echo ( $ok ? 'ok   ' : 'FAIL ' ) . $what . "\n";
}

$site = dirname( __DIR__ ) . '/';

/* ---------- The layer's files ---------- */

$loader = (string) file_get_contents( $site . 'kits-core-site.php' );
preg_match_all( "/^\t\t'([^']+\.php)',$/m", $loader, $m );
check( 'the loader lists the moved files', count( $m[1] ) >= 15 );
foreach ( $m[1] as $f ) {
	check( "loader file exists: $f", is_file( $site . 'includes/' . $f ) );
}
check( 'it waits for Kits Core 1.4.0 (plugins_loaded, version check)', false !== strpos( $loader, "version_compare( KITS_CORE_VERSION, '1.4.0', '<' )" ) && false !== strpos( $loader, "'plugins_loaded', 'animalwrites_kits_core_site_load', 1" ) );
foreach ( array( 'assets/site/dropins/maintenance.php', 'assets/site/dropins/php-error.php', 'assets/site/error/404-wide.webp', 'assets/site/error/404-phone.webp', 'assets/js/sponsored-blocks.js', 'README.md' ) as $f ) {
	check( "file exists: $f", is_file( $site . $f ) );
}
check( 'the plugin no longer ships assets/site', ! is_dir( KITS_CORE_DIR . 'assets/site' ) );

/* ---------- The moved screens still join the Kits frame with their own capability ---------- */

$joined = array(
	'includes/tools/media-reuse.php' => array( 'aw-media-reuse', 'manage_options', 'kits-tools' ),
	'includes/campaign-letters.php'  => array( 'aw-letter-report', 'edit_posts', '' ),
	'includes/taxonomy-rename.php'   => array( 'kits-taxonomy-rename', 'manage_options', 'kits-tools' ),
);
foreach ( $joined as $file => $def ) {
	$src = (string) file_get_contents( $site . $file );
	check( "frame: {$def[0]} joins with its own capability ({$def[1]})", false !== strpos( $src, "'kits_frame_extra_screens'" ) && false !== strpos( $src, "\$screens['{$def[0]}'] = array( '{$def[1]}', '{$def[2]}' )" ) );
	check( "frame: {$def[0]} prints through kits_frame_screen()", false !== strpos( $src, "kits_frame_screen( '{$def[0]}'" ) );
}

/* ---------- The drop-ins keep the marker the installed pages carry ---------- */

foreach ( array( 'php-error.php', 'maintenance.php' ) as $name ) {
	$src = (string) file_get_contents( $site . 'assets/site/dropins/' . $name );
	check( "dropins/$name carries the marker", false !== strpos( $src, 'Animal Writes error page' ) );
	check( "dropins/$name looks for its pictures in the same place as before", false !== strpos( $src, "'/plugins/kits-core/assets/site/dropins/'" ) );
}

/* ---------- Kits Core's generic features, with Animal Writes' values ---------- */

require $site . 'includes/site-uninstall.php';
require $site . 'includes/site-filters.php';
define( 'ANIMALWRITES_KITS_CORE_SITE_DIR', $site );
$carry = null;
foreach ( $GLOBALS['t_hooks']['init'] ?? array() as $h ) { // the carry-over is the layer's only init hook
	$carry = $h[0];
}
require KITS_CORE_DIR . 'includes/media-groups.php';
require KITS_CORE_DIR . 'includes/error-pages.php';

check( 'error pages: the folder is this layer\'s', $site . 'assets/site/dropins/' === kits_error_pages_dir() && kits_error_pages_here() );
check( 'error pages: the marker is the live one', 'Animal Writes error page' === kits_error_page_marker() );
foreach ( KITS_ERROR_PAGE_FILES as $name ) {
	check( "the source dropins/$name carries the marker, so it would install", false !== strpos( (string) file_get_contents( kits_error_pages_dir() . $name ), kits_error_page_marker() ) );
}
$pic = apply_filters( 'kits_error_picture_source', array() );
check( 'the 404 pictures are served from this layer', is_file( $pic['dir'] . '404-wide.webp' ) && is_file( $pic['dir'] . '404-phone.webp' ) && 0 === strpos( $pic['url'], 'https://example.test/' ) );

check( 'media groups: a listing\'s photo', 'Listing photo' === kits_media_group_for( 'x', 'x.jpg', 'image/jpeg', 'aw_listing' ) );
check( 'media groups: a Library file beats the PDF rule', 'Library document' === kits_media_group_for( 'x', 'x.pdf', 'application/pdf', 'aw_legal' ) );
check( 'media groups: a press image', 'Press image' === kits_media_group_for( 'x', 'x.jpg', 'image/jpeg', 'aw_press' ) );
check( 'media groups: a campaign photo by title or by file name', 'Campaign photo' === kits_media_group_for( 'Animal Writes campaign photo 3', 'z.jpg', 'image/jpeg', '' ) && 'Campaign photo' === kits_media_group_for( 'z', 'aw1-im-9.jpg', 'image/jpeg', '' ) );
check( 'media groups: the generic rules still decide the rest', 'Stock photo' === kits_media_group_for( 'z', 'photo-3.jpg', 'image/jpeg', '' ) && 'Document' === kits_media_group_for( 'z', 'z.pdf', 'application/pdf', '' ) && 'Guide image' === kits_media_group_for( 'z', 'z.jpg', 'image/jpeg', 'post' ) && 'Other' === kits_media_group_for( 'z', 'z.jpg', 'image/jpeg', '' ) && 'Logo' === kits_media_group_for( 'Site logo', 'z.jpg', 'image/jpeg', 'aw_listing' ) );

$prefix = apply_filters( 'kits_ff_ref_prefixes', array() );
check( 'form references read AW-, AW-V-, AW-C-, AW-R-', array( 'AW-', 'AW-V-', 'AW-C-', 'AW-R-' ) === array_values( $prefix ) );
check( 'private claim files: edit_aw_volunteers', 'edit_aw_volunteers' === apply_filters( 'kits_ff_file_capability', 'manage_options' ) );
check( 'the Overview\'s old address redirects to Kits', 'kits' === apply_filters( 'kits_admin_redirects', array() )['animal-writes'] );
check( 'Edit screens: the site\'s own source name and plugin folders', in_array( 'Animal Writes core', apply_filters( 'kits_edit_screen_own_plugins', array( 'Kits Core' ) ), true ) && in_array( 'aw-sourcing', apply_filters( 'kits_edit_screen_own_folders', array( 'rankweb' ) ), true ) );
check( 'Overview counts the animal-writes pattern category', in_array( 'animal-writes', apply_filters( 'kits_overview_pattern_categories', array( 'kits-lists' ) ), true ) );
check( 'media merge: the groups file is read and the share image keys are added', is_array( apply_filters( 'kits_media_merge_groups', array() ) ) && in_array( 'aw_campaign_share_image', apply_filters( 'kits_media_merge_meta_keys', array() ), true ) );

check( 'backup: no evidence, no first choice', '0' === apply_filters( 'kits_daily_backup_first_choice', '0' ) );
$GLOBALS['t_options']['aw_backup_last'] = array( 'at' => 'x' );
check( 'backup: where it already ran, the first choice is on', '1' === apply_filters( 'kits_daily_backup_first_choice', '0' ) );
$GLOBALS['t_options'] = array();
$GLOBALS['t_cron']['aw_daily_backup'] = 1;
check( 'backup: where a run is booked, the first choice is on', '1' === apply_filters( 'kits_daily_backup_first_choice', '0' ) );

/* ---------- Carry-over (once) ---------- */

function update_option( $n, $v, $autoload = null ) {
	$GLOBALS['t_options'][ $n ] = $v;
	return true;
}
$GLOBALS['t_options'] = array();
$GLOBALS['t_cron']    = array( 'aw_error_count_daily' => 1 );
$carry();
check( 'carry-over: a site that books aw_error_count_daily keeps the five options on', '1' === $GLOBALS['t_options']['kits_tidy_menus'] && '1' === $GLOBALS['t_options']['kits_error_count_daily'] && '1' === $GLOBALS['t_options']['kits_daily_event'] && '1' === $GLOBALS['t_options']['kits_public_gate_routes'] && '1' === $GLOBALS['t_options']['kits_form_raw_capture'] && '1' === $GLOBALS['t_options']['kits_aw_carryover_done'] );
$GLOBALS['t_options'] = array();
$GLOBALS['t_cron']    = array();
$carry();
check( 'carry-over: any other site finds them all off, and it runs once', ! isset( $GLOBALS['t_options']['kits_tidy_menus'] ) && '1' === $GLOBALS['t_options']['kits_aw_carryover_done'] );

/* ---------- Uninstall extensions ---------- */

$opts = apply_filters( 'kits_core_uninstall_options', array() );
check( 'uninstall: the moved features\' options are listed', array( 'aw_category_images', 'aw_thumb_map', 'aw_media_reuse_log', 'kits_form_raw_capture', 'kits_form_raw_days', 'aw_form_raw_db', 'kits_aw_carryover_done' ) === $opts );
check( 'uninstall: the form copy table and the events have hooks', ! empty( $GLOBALS['t_hooks']['kits_core_uninstall_data'] ) && ! empty( $GLOBALS['t_hooks']['kits_core_uninstall'] ) && ! empty( $GLOBALS['t_hooks']['kits_core_deactivated'] ) );

echo "\n" . $n . ' checks, ' . $fails . " failed\n";
exit( $fails ? 1 : 0 );
