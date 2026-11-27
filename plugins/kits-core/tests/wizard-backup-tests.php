<?php
/**
 * Setup wizard: applying a colour style keeps a one-level backup of Styles (Global Styles), Restore puts it back, and
 * "Kits Default" (which clears Styles) needs its confirmation box.
 *
 * Usage: php plugins/kits-core/tests/wizard-backup-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO, Generic.Files.OneObjectStructurePerFile -- a command-line test runner with stand-ins.

require __DIR__ . '/wp-stubs.php';

const KITS_MENU = 'kits';
$GLOBALS['t_posts']    = array( 5 => '{"version":3,"styles":{"color":{"background":"#fff"}},"note":"back\\\\slash"}' );
$GLOBALS['t_cleaned']  = 0;
$GLOBALS['t_style_ok'] = true;
$tmp                   = sys_get_temp_dir() . '/kits-wizard-' . getmypid();
mkdir( $tmp . '/styles', 0777, true );
file_put_contents( $tmp . '/styles/forest.json', json_encode( array( 'settings' => array( 'color' => array( 'palette' => array( array( 'slug' => 'primary', 'color' => '#1E6B43' ) ) ) ), 'styles' => array( 'color' => array( 'background' => '#eef' ) ) ) ) );
file_put_contents( $tmp . '/styles/broken.json', '{not json' );

class WP_Theme_JSON {
	const LATEST_SCHEMA = 3;
}
class WP_Theme_JSON_Resolver {
	public static function get_user_data_from_wp_global_styles( $theme, $create ) {
		return $GLOBALS['t_style_ok'] ? array( 'ID' => 5 ) : array();
	}
	public static function clean_cached_data() {
		++$GLOBALS['t_cleaned'];
	}
}
function wp_get_theme() {
	return new stdClass();
}
function get_template_directory() {
	return $GLOBALS['t_tmp'];
}
$GLOBALS['t_tmp'] = $tmp;
function get_post( $id ) {
	return isset( $GLOBALS['t_posts'][ $id ] ) ? (object) array( 'post_content' => $GLOBALS['t_posts'][ $id ] ) : null;
}
function wp_slash( $v ) {
	return addslashes( $v );
}
function wp_update_post( $a ) {
	$GLOBALS['t_posts'][ $a['ID'] ] = stripslashes( $a['post_content'] ); // core unslashes what it is given
	return $a['ID'];
}
function wp_verify_nonce( $n, $a ) {
	return 'good' === $n;
}
function check_admin_referer( $a, $f = '_wpnonce' ) {
	if ( 'good' !== ( $_REQUEST[ $f ] ?? '' ) ) {
		wp_die( 'bad nonce', '', 403 );
	}
	return true;
}
function set_theme_mod( $k, $v ) {}

require dirname( __DIR__ ) . '/includes/onboarding-wizard.php';

$orig = $GLOBALS['t_posts'][5];

// ---- apply keeps a backup ----
t( ! kits_onboarding_has_backup(), 'no backup before anything is applied' );
t( true === kits_onboarding_apply_style_variation( 'forest' ), 'applying forest succeeds' );
$now = json_decode( $GLOBALS['t_posts'][5], true );
t( true === $now['isGlobalStylesUserThemeJSON'] && '#1E6B43' === $now['settings']['color']['palette'][0]['color'] && '#eef' === $now['styles']['color']['background'], 'Styles now hold the forest variation' );
t( $orig === get_option( 'kits_global_styles_backup' ), 'the previous Styles are backed up exactly (a backslash in the JSON survives)' );
t( kits_onboarding_has_backup(), 'has_backup is true' );
t( $GLOBALS['t_cleaned'] >= 1, 'the resolver cache is cleaned after the change' );

// ---- restore swaps ----
$after_forest = $GLOBALS['t_posts'][5];
t( true === kits_onboarding_restore_global_styles(), 'restore succeeds' );
t( $orig === $GLOBALS['t_posts'][5], 'restore puts the original Styles back byte for byte' );
t( $after_forest === get_option( 'kits_global_styles_backup' ), 'the backup is now what restore overwrote (one level: restore twice goes forward again)' );
t( true === kits_onboarding_restore_global_styles() && $after_forest === $GLOBALS['t_posts'][5], 'a second restore returns to the forest variation' );

// ---- failures leave everything alone ----
$before_posts  = $GLOBALS['t_posts'];
$before_backup = get_option( 'kits_global_styles_backup' );
t( false === kits_onboarding_apply_style_variation( 'missing' ), 'a variation with no file is refused' );
t( false === kits_onboarding_apply_style_variation( 'broken' ), 'a variation with broken JSON is refused' );
t( $before_posts === $GLOBALS['t_posts'] && $before_backup === get_option( 'kits_global_styles_backup' ), 'a refused variation changes neither Styles nor the backup' );
t( false === kits_onboarding_apply_style_variation( '../../etc/passwd' ), 'a path in the slug is refused' );
$GLOBALS['t_style_ok'] = false;
t( false === kits_onboarding_apply_style_variation( 'forest' ) && false === kits_onboarding_restore_global_styles(), 'with no Styles record, apply and restore both return false' );
$GLOBALS['t_style_ok'] = true;
delete_option( 'kits_global_styles_backup' );
t( false === kits_onboarding_restore_global_styles() && ! kits_onboarding_has_backup(), 'restore with no backup returns false' );

// ---- Kits Default clears Styles but keeps a backup ----
$GLOBALS['t_posts'][5] = $orig;
t( true === kits_onboarding_apply_style_variation( 'default' ), 'applying Kits Default succeeds' );
$def = json_decode( $GLOBALS['t_posts'][5], true );
t( ! isset( $def['settings'] ) && ! isset( $def['styles'] ), 'Kits Default leaves no settings or styles' );
t( $orig === get_option( 'kits_global_styles_backup' ), 'and the cleared Styles are in the backup' );
// An empty previous record does not overwrite a good backup.
$GLOBALS['t_posts'][5] = '';
kits_onboarding_apply_style_variation( 'forest' );
t( $orig === get_option( 'kits_global_styles_backup' ), 'an empty Styles record never replaces the stored backup' );

// ---- the form: Kits Default needs the box ticked ----
$submit = t_hook_callbacks( 'admin_init' )[0];
$run    = function ( array $post, array $caps = array( 'manage_options' => true ) ) use ( $submit ) {
	$GLOBALS['t_caps'] = $caps;
	$_POST             = $post + array( 'kits_onboarding_nonce' => 'good' );
	try {
		$submit();
	} catch ( T_Redirect $e ) {
		return 'redirect';
	} catch ( T_Die $e ) {
		return 'die';
	}
	return 'none';
};
$GLOBALS['t_posts'][5] = $orig;
delete_option( 'kits_active_style_variation' );
delete_option( 'kits_global_styles_backup' );
t( 'redirect' === $run( array( 'kits_style_variation' => 'default' ) ), 'the form answers with a redirect' );
t( false === get_option( 'kits_active_style_variation' ) && $orig === $GLOBALS['t_posts'][5], 'Kits Default without the confirmation box changes nothing' );
t( 'redirect' === $run( array( 'kits_style_variation' => 'default', 'kits_confirm_default' => '1' ) ), 'with the box ticked it goes ahead' );
t( 'default' === get_option( 'kits_active_style_variation' ) && $orig === get_option( 'kits_global_styles_backup' ), 'Kits Default with the box applies and backs up' );
$GLOBALS['t_posts'][5] = $orig;
$run( array( 'kits_style_variation' => 'forest' ) );
t( 'forest' === get_option( 'kits_active_style_variation' ) && false !== strpos( $GLOBALS['t_posts'][5], '#1E6B43' ), 'forest needs no confirmation' );
$before = $GLOBALS['t_posts'][5];
$run( array( 'kits_style_variation' => 'ink' ) );
t( 'forest' === get_option( 'kits_active_style_variation' ) && $before === $GLOBALS['t_posts'][5], 'the old name "ink" and other values are not accepted' );
t( 'die' === $run( array( 'kits_style_variation' => 'forest' ), array() ), 'without manage_options the form dies' );
t( 'die' === $run( array( 'kits_style_variation' => 'forest', 'kits_onboarding_nonce' => 'bad' ) ), 'with a bad nonce the form dies' );

// ---- the Restore button's handler ----
$restore = t_hook_callbacks( 'admin_post_kits_restore_global_styles' )[0];
$GLOBALS['t_posts'][5] = $before;
update_option( 'kits_global_styles_backup', $orig );
$GLOBALS['t_caps'] = array();
try {
	$restore();
	t( false, 'restore without capability dies' );
} catch ( T_Die $e ) {
	t( $before === $GLOBALS['t_posts'][5], 'restore without capability changes nothing' );
}
$GLOBALS['t_caps'] = array( 'manage_options' => true );
$_REQUEST          = array( 'kits_restore_nonce' => 'bad' );
try {
	$restore();
} catch ( T_Die $e ) {
	t( $before === $GLOBALS['t_posts'][5], 'restore with a bad nonce changes nothing' );
}
$_REQUEST = array( 'kits_restore_nonce' => 'good' );
try {
	$restore();
} catch ( T_Redirect $e ) {
	t( $orig === $GLOBALS['t_posts'][5] && false !== strpos( $e->url, 'restored=1' ), 'restore with capability and nonce puts the backup back and says so' );
}
t_done();
