<?php
/**
 * uninstall.php: without the "delete data" tick nothing is removed; with it, exactly the listed options, rows and
 * transients go (and a site layer's through the filters), a backup file is written first without the ALTCHA secret,
 * and if the backup cannot be written nothing is deleted.
 *
 * Usage: php plugins/kits-core/tests/uninstall-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO -- a command-line test runner with stand-ins.

require __DIR__ . '/wp-stubs.php';

if ( ! extension_loaded( 'pdo_sqlite' ) ) {
	echo "FAIL: pdo_sqlite is needed\n";
	exit( 1 );
}

define( 'WP_UNINSTALL_PLUGIN', 'kits-core/kits-core.php' );
$GLOBALS['t_unscheduled'] = array();
$GLOBALS['t_uploads']     = sys_get_temp_dir() . '/kits-uninstall-' . getmypid();
function wp_unschedule_hook( $h ) {
	$GLOBALS['t_unscheduled'][] = $h;
}
function wp_upload_dir( $time = null, $create = true ) {
	return array( 'basedir' => $GLOBALS['t_uploads'], 'error' => false );
}
function wp_mkdir_p( $d ) {
	return is_dir( $d ) || @mkdir( $d, 0777, true );
}
function get_file_data( $f, $h ) {
	preg_match( '/^\s*\*\s*Version:\s*(\S+)/m', (string) file_get_contents( $f ), $m );
	return array( 'Version' => $m[1] ?? '' );
}
function esc_sql( $s ) {
	return addslashes( $s );
}

/** Run uninstall.php in its own scope, return what it did. */
function t_uninstall() {
	$GLOBALS['t_unscheduled'] = array();
	$GLOBALS['t_fired']       = array();
	include dirname( __DIR__ ) . '/uninstall.php';
}
add_action( 'kits_core_uninstall', function () {
	$GLOBALS['t_fired'][] = 'kits_core_uninstall';
} );
add_action( 'kits_core_uninstall_data', function () {
	$GLOBALS['t_fired'][] = 'kits_core_uninstall_data';
} );
add_filter( 'kits_core_uninstall_options', fn( $o ) => array_merge( $o, array( 'site_layer_option' ) ) );

/** A site with data: option => value, also mirrored in the table the backup reads. */
function t_seed() {
	t_reset();
	$GLOBALS['wpdb'] = new T_Wpdb();
	$opts            = array(
		'kits_theme_options'         => 'a:1:{s:3:"foo";s:3:"bar";}',
		'kits_brand_tokens'          => 'a:1:{s:6:"accent";s:7:"#123456";}',
		'kits_altcha_key'            => 'SECRET-KEY-DO-NOT-BACKUP',
		'kits_preview_devices'       => 'a:0:{}',
		'aw_backup_last'             => 'x',
		'kits_global_styles_backup'  => '{"version":3}',
		'site_layer_option'          => 'layer',
		'blogname'                   => 'Keep Me',
		'unrelated_plugin_option'    => 'keep',
	);
	foreach ( $opts as $k => $v ) {
		update_option( $k, $v );
		$GLOBALS['wpdb']->put( $k, $v );
	}
	foreach ( array( 'kits_altcha_used_abc', 'kits_altcha_used_def', '_transient_kits_dl_1', '_transient_timeout_kits_dl_1', '_transient_kits_altcha_pruned', '_transient_kits_preview_link_3', '_transient_other_plugin' ) as $row ) {
		$GLOBALS['wpdb']->put( $row, '1', 'no' );
	}
	set_transient( 'kits_brand_theme_data', array( 1 ) );
	set_site_transient( 'kits_update_release', array( 1 ) );
	set_transient( 'kits_registry', array( 1 ) );
	set_transient( 'aw_error_count_mailed', 1 );
	delete_option( 'kits_delete_data_on_uninstall' );
}

// ---- 1. default: keep everything ----
t_seed();
t_uninstall();
t( in_array( 'aw_daily', $GLOBALS['t_unscheduled'], true ) && in_array( 'kits_checkin_weekly', $GLOBALS['t_unscheduled'], true ), 'default: the scheduled events are removed even when data is kept' );
t( array( 'kits_core_uninstall' ) === $GLOBALS['t_fired'], 'default: the site layer hears kits_core_uninstall but not kits_core_uninstall_data' );
t( 'Keep Me' === get_option( 'blogname' ) && '#123456' !== '' && false !== get_option( 'kits_brand_tokens' ) && false !== get_option( 'kits_theme_options' ) && 'layer' === get_option( 'site_layer_option' ), 'default: every option is kept' );
t( $GLOBALS['wpdb']->has( 'kits_altcha_used_abc' ) && false !== get_transient( 'kits_registry' ), 'default: rows and transients are kept' );
t( ! is_dir( $GLOBALS['t_uploads'] ), 'default: no backup file is written' );

// ---- 2. data deletion ticked ----
t_seed();
update_option( 'kits_delete_data_on_uninstall', true );
$GLOBALS['wpdb']->put( 'kits_delete_data_on_uninstall', '1' );
t_uninstall();
foreach ( array( 'kits_theme_options', 'kits_brand_tokens', 'kits_altcha_key', 'kits_preview_devices', 'aw_backup_last', 'kits_global_styles_backup', 'site_layer_option', 'kits_delete_data_on_uninstall' ) as $o ) {
	t( false === get_option( $o, false ), "ticked: option $o is deleted" );
}
t( 'Keep Me' === get_option( 'blogname' ) && 'keep' === get_option( 'unrelated_plugin_option' ), 'ticked: options that are not Kits Core\'s are untouched' );
t( ! $GLOBALS['wpdb']->has( 'kits_altcha_used_abc' ) && ! $GLOBALS['wpdb']->has( 'kits_altcha_used_def' ), 'ticked: the used ALTCHA rows are deleted' );
t( ! $GLOBALS['wpdb']->has( '_transient_kits_dl_1' ) && ! $GLOBALS['wpdb']->has( '_transient_timeout_kits_dl_1' ) && ! $GLOBALS['wpdb']->has( '_transient_kits_altcha_pruned' ) && ! $GLOBALS['wpdb']->has( '_transient_kits_preview_link_3' ), 'ticked: the download-token, ALTCHA and preview-link transients are deleted' );
t( $GLOBALS['wpdb']->has( '_transient_other_plugin' ), 'ticked: another plugin\'s transient is kept' );
t( false === get_transient( 'kits_brand_theme_data' ) && false === get_site_transient( 'kits_update_release' ) && false === get_transient( 'kits_registry' ) && false === get_transient( 'aw_error_count_mailed' ), 'ticked: the named transients are deleted' );
t( array( 'kits_core_uninstall', 'kits_core_uninstall_data' ) === $GLOBALS['t_fired'], 'ticked: the site layer hears both actions, in order' );
t( in_array( 'aw_daily_backup', $GLOBALS['t_unscheduled'], true ) && in_array( 'aw_site_check_deploy', $GLOBALS['t_unscheduled'], true ), 'ticked: the remaining events are unscheduled' );
$files = glob( $GLOBALS['t_uploads'] . '/wugweb-backups/kits-core-uninstall-*.jsonl.gz' );
t( 1 === count( $files ), 'ticked: one backup file is written' );
$lines = $files ? array_map( fn( $l ) => json_decode( $l, true ), array_filter( explode( "\n", (string) implode( '', gzfile( $files[0] ) ) ) ) ) : array();
$head  = $lines[0] ?? array();
t( 'header' === ( $head['type'] ?? '' ) && 'kits-core' === ( $head['plugin'] ?? '' ) && '1.5.0' === ( $head['version'] ?? '' ), 'backup: the header names the plugin and version 1.5.0 (the version in kits-core.php)' );
$saved = array_column( array_filter( $lines, fn( $l ) => 'option' === ( $l['type'] ?? '' ) ), 'value', 'name' );
t( isset( $saved['kits_theme_options'], $saved['kits_brand_tokens'], $saved['site_layer_option'], $saved['kits_global_styles_backup'] ), 'backup: the options about to be deleted are in the file' );
t( ! isset( $saved['kits_altcha_key'] ) && false === strpos( implode( '', gzfile( $files[0] ) ), 'SECRET-KEY-DO-NOT-BACKUP' ), 'backup: the ALTCHA secret is never written to the file' );
t( ! isset( $saved['blogname'] ), 'backup: only Kits Core\'s options are in it' );
t( file_exists( $GLOBALS['t_uploads'] . '/wugweb-backups/.htaccess' ), 'backup: the folder is closed to the web' );

// ---- 3. no backup, no delete ----
t_seed();
update_option( 'kits_delete_data_on_uninstall', true );
$GLOBALS['wpdb']->put( 'kits_delete_data_on_uninstall', '1' );
$blocked = sys_get_temp_dir() . '/kits-uninstall-blocked-' . getmypid();
file_put_contents( $blocked, 'a file where the uploads folder should be' );
$GLOBALS['t_uploads'] = $blocked;
$log                  = ini_get( 'error_log' );
ini_set( 'error_log', sys_get_temp_dir() . '/kits-uninstall-errors.log' );
t_uninstall();
ini_set( 'error_log', $log );
t( false !== get_option( 'kits_theme_options', false ) && false !== get_option( 'kits_brand_tokens', false ) && 'layer' === get_option( 'site_layer_option' ), 'no backup: the options are all still there' );
t( $GLOBALS['wpdb']->has( 'kits_altcha_used_abc' ) && false !== get_transient( 'kits_registry' ), 'no backup: rows and transients are still there' );
t( true === get_option( 'kits_delete_data_on_uninstall' ) && ! in_array( 'kits_core_uninstall_data', $GLOBALS['t_fired'], true ), 'no backup: the tick stays (the run can be repeated) and the site layer is not told to delete' );

// ---- 4. the list in uninstall.php is the list the header comment promises ----
$src = file_get_contents( dirname( __DIR__ ) . '/uninstall.php' );
foreach ( array( 'kits_brand_tokens', 'kits_brand_active_preset', 'kits_global_styles_backup', 'kits_checkin_url', 'kits_update_channel' ) as $o ) {
	t( false !== strpos( $src, "'$o'" ), "uninstall.php lists $o" );
}
@unlink( $blocked );
t_done();
