<?php
/**
 * Brand Tokens: Reset goes back to the chosen preset (or to the theme's own values when none was chosen), "Clear brand"
 * removes the tokens and the chosen preset, and both clear the cached theme.json patch.
 *
 * Usage: php plugins/kits-core/tests/brand-reset-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO -- a command-line test runner with stand-ins.

require __DIR__ . '/wp-stubs.php';

const KITS_MENU = 'kits';
require dirname( __DIR__ ) . '/includes/brand-customizer.php';

$presets = kits_brand_presets();
$key     = kits_brand_cache_key();
$dirty   = array( 'accent' => '#123456', 'radius_card' => '4px' );

// ---- Reset with a chosen preset ----
update_option( KITS_BRAND_OPTION, $dirty );
update_option( KITS_BRAND_PRESET_OPTION, 'tech_modern' );
set_transient( $key, array( 'cached' => true ) );
kits_brand_reset();
$saved = get_option( KITS_BRAND_OPTION );
t( kits_brand_sanitize_tokens( $presets['tech_modern']['tokens'] ) === $saved, 'reset: the tokens are the chosen preset\'s (cleaned like a save)' );
t( '#2563EB' === $saved['accent'], 'reset: the edited accent is gone, the preset\'s is back' );
t( 'tech_modern' === get_option( KITS_BRAND_PRESET_OPTION ), 'reset: the chosen preset stays chosen' );
t( false === get_transient( $key ), 'reset: the cached theme.json patch is cleared' );

// ---- Reset with no preset chosen ----
update_option( KITS_BRAND_OPTION, $dirty );
delete_option( KITS_BRAND_PRESET_OPTION );
set_transient( $key, array( 'cached' => true ) );
kits_brand_reset();
t( false === get_option( KITS_BRAND_OPTION, false ), 'reset with no preset: the tokens are removed (theme values)' );
t( false === get_transient( $key ), 'reset with no preset: the cache is cleared' );

// ---- Reset when the chosen preset no longer exists (a filter removed it) ----
update_option( KITS_BRAND_OPTION, $dirty );
update_option( KITS_BRAND_PRESET_OPTION, 'gone_preset' );
kits_brand_reset();
t( false === get_option( KITS_BRAND_OPTION, false ) && 'gone_preset' === get_option( KITS_BRAND_PRESET_OPTION ), 'reset with an unknown preset: tokens removed, nothing else touched' );

// ---- Clear brand ----
update_option( KITS_BRAND_OPTION, $dirty );
update_option( KITS_BRAND_PRESET_OPTION, 'eco_wellness' );
set_transient( $key, array( 'cached' => true ) );
kits_brand_clear();
t( false === get_option( KITS_BRAND_OPTION, false ) && false === get_option( KITS_BRAND_PRESET_OPTION, false ), 'clear: tokens and chosen preset are both removed' );
t( false === get_transient( $key ), 'clear: the cache is cleared' );
kits_brand_clear();
t( true, 'clear: clearing twice is harmless' );

// ---- Reset and Clear are two different actions on the screen, and the screen calls these functions ----
$src = file_get_contents( dirname( __DIR__ ) . '/includes/brand-customizer.php' );
t( 1 === preg_match( "/'reset' === \\\$action\\ ?\\) \\{\\s*kits_brand_reset\\(\\);/", $src ), 'the screen\'s Reset action calls kits_brand_reset()' );
t( 1 === preg_match( "/'clear_brand' === \\\$action\\ ?\\) \\{\\s*kits_brand_clear\\(\\);/", $src ), 'the screen\'s Clear action calls kits_brand_clear()' );
t( substr_count( $src, 'name="kits_brand_action" value="clear_brand"' ) >= 1 && substr_count( $src, 'name="kits_brand_action" value="reset"' ) >= 1, 'the screen has a separate Reset button and a Clear brand button' );
t( false !== strpos( $src, 'onsubmit="return confirm(' ) || false !== strpos( $src, 'confirm(' ), 'Clear brand asks for a confirmation' );

t_done();
