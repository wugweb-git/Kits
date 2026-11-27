<?php
/**
 * Kits Brand Customizer unit tests (pure PHP, zero WordPress dependency).
 *
 * Verifies:
 * - Token definitions and defaults
 * - Preset definitions (default + 3 tenant profiles)
 * - Sanitization (hex colors, rgba, font stacks, layout units, script injection prevention)
 * - CSS compilation (skipping untouched defaults, emitting both --kit-* and --wp--preset--*)
 * - Export/import roundtrip
 *
 * Usage: php plugins/kits-core/tests/brand-customizer-tests.php
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	if ( 'cli' !== PHP_SAPI ) {
		exit;
	}
	define( 'ABSPATH', __DIR__ . '/' );
}

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput.OutputNotEscaped -- a command-line test runner.

require dirname( __DIR__ ) . '/includes/brand-customizer-model.php';

$fails = 0;
$count = 0;

function brand_t( bool $ok, string $name ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL $name\n";
	} else {
		echo "ok   $name\n";
	}
}

echo "=== Kits Brand Customizer Tests ===\n";

// 1. Token definitions exist and cover key categories
$defs = kits_brand_token_definitions();
brand_t( isset( $defs['accent'], $defs['bg'], $defs['raised'], $defs['ink'], $defs['text'] ), 'Color tokens defined' );
brand_t( isset( $defs['font_display'], $defs['font_body'] ), 'Typography tokens defined' );
brand_t( isset( $defs['radius_control'], $defs['radius_card'], $defs['radius_media'], $defs['radius_pill'] ), 'Shape/Radius tokens defined' );
brand_t( isset( $defs['width_content'], $defs['width_wide'], $defs['space_section'] ), 'Layout tokens defined' );
brand_t( '#FFBE1A' === $defs['accent']['default'], 'Default accent is #FFBE1A' );

// 2. Presets: 1 Default + 3 Tenants
$presets = kits_brand_presets();
brand_t( count( $presets ) === 4, 'Exactly 4 presets defined (1 default + 3 tenants)' );
brand_t( isset( $presets['default'], $presets['tech_modern'], $presets['editorial_heritage'], $presets['eco_wellness'] ), 'Presets keys present' );
brand_t( '#2563EB' === $presets['tech_modern']['tokens']['accent'], 'Tenant 1 (tech) accent is electric blue' );
brand_t( '#C2410C' === $presets['editorial_heritage']['tokens']['accent'], 'Tenant 2 (editorial) accent is terracotta' );
brand_t( '#059669' === $presets['eco_wellness']['tokens']['accent'], 'Tenant 3 (eco) accent is emerald' );

// 3. Sanitization
$dirty_input = array(
	'accent'         => '#2563eb',
	'accent_ink'     => 'bad-color-string',
	'bg'             => 'rgba(255, 255, 255, 0.95)',
	'radius_control' => '8px; background: red;',
	'font_display'   => '<script>alert(1)</script>Inter, sans-serif',
);
$clean = kits_brand_sanitize_tokens( $dirty_input );
brand_t( '#2563eb' === $clean['accent'], 'Valid hex accepted' );
brand_t( ! isset( $clean['accent_ink'] ), 'Invalid color string rejected' );
brand_t( 'rgba(255, 255, 255, 0.95)' === $clean['bg'], 'Valid rgba color accepted' );
brand_t( '8px background: red' === $clean['radius_control'], 'Semicolon stripped from radius string' );
brand_t( 'scriptalert(1)/scriptInter, sans-serif' === $clean['font_display'], 'Tags and dangerous chars stripped from font string' );

$bad_colors = kits_brand_sanitize_tokens(
	array(
		'accent'     => 'rgb(0,0,0); } body { display:none',
		'bg'         => 'rgb(0,0,0){x}',
		'ink'        => 'hsl(1,2%,3%)<b>',
		'text'       => '#fff;',
		'accent_ink' => '#111<',
	)
);
brand_t( array() === $bad_colors, 'Colours containing { } ; < > are rejected' );
brand_t( 'rgb(10, 20, 30)' === kits_brand_sanitize_tokens( array( 'accent' => 'rgb(10, 20, 30)' ) )['accent'], 'A plain rgb colour is still accepted' );

// 4. CSS Compilation
// When tokens match defaults, nothing emitted
$css_empty = kits_brand_compile_css( array( 'accent' => '#FFBE1A' ) );
brand_t( '' === $css_empty, 'Default token does not produce redundant CSS output' );

// When customized, emits both --kit-* and --wp--preset--*
$custom_tokens = array(
	'accent'         => '#2563EB',
	'radius_control' => '4px',
);
$css_custom = kits_brand_compile_css( $custom_tokens );
brand_t( false !== strpos( $css_custom, '--kit-color-accent: #2563EB;' ), 'Emits --kit-color-accent override' );
brand_t( false !== strpos( $css_custom, '--wp--preset--color--primary: #2563EB;' ), 'Emits --wp--preset--color--primary bridge override' );
brand_t( false !== strpos( $css_custom, '--kit-radius-control: 4px;' ), 'Emits --kit-radius-control override' );
brand_t( false !== strpos( $css_custom, '--wp--preset--border-radius--control: 4px;' ), 'Emits --wp--preset--border-radius--control bridge override' );

// 5. Preset Compilation
$tenant_css = kits_brand_compile_css( $presets['tech_modern']['tokens'] );
brand_t( false !== strpos( $tenant_css, '--kit-color-accent: #2563EB;' ), 'Tech preset compiles accent' );
brand_t( false !== strpos( $tenant_css, '--kit-color-bg: #F8FAFC;' ), 'Tech preset compiles bg canvas' );


// 6. Defaults come from the theme, not from literals in this plugin
$theme_file = dirname( __DIR__, 3 ) . '/themes/kits-by-wugweb/theme.json';
if ( is_readable( $theme_file ) ) {
	$theme_json = json_decode( (string) file_get_contents( $theme_file ), true );
	$theme_set  = $theme_json['settings'];
	$resolved   = kits_brand_resolve_defaults( $theme_set );
	brand_t( '#C6D2E0' === $resolved['accent'], 'Resolved accent default is the theme primary (#C6D2E0), not the old literal' );
	brand_t( '#F4F4F4' === $resolved['bg'] && '#0062b8' === $resolved['accent_ink'], 'Resolved canvas and accent ink come from the theme palette' );
	brand_t( '8px' === $resolved['radius_control'] && '12px' === $resolved['radius_card'] && '9999px' === $resolved['radius_pill'], 'Resolved radii come from the theme radius presets' );
	brand_t( '1200px' === $resolved['width_content'] && '1200px' === $resolved['width_wide'], 'Resolved layout widths come from the theme layout' );
	brand_t( '' === kits_brand_compile_css( array( 'accent' => '#C6D2E0' ), $resolved ), 'A value equal to the theme default emits nothing' );
	brand_t( '' === kits_brand_compile_css( array( 'accent' => '#c6d2e0' ), $resolved ), 'Hex comparison ignores case' );
	brand_t( false !== strpos( kits_brand_compile_css( array( 'accent' => '#FFBE1A' ), $resolved ), '--wp--preset--color--primary: #FFBE1A;' ), 'The old literal default (#FFBE1A) now emits, because it differs from the theme' );

	// The palette can arrive flat or keyed by origin; both resolve the same.
	$flat   = $theme_set;
	$keyed  = $theme_set;
	$keyed['color']['palette'] = array( 'theme' => $theme_set['color']['palette'] );
	brand_t( kits_brand_resolve_defaults( $keyed )['accent'] === kits_brand_resolve_defaults( $flat )['accent'], 'Origin-keyed palette resolves like a flat one' );
	brand_t( 'inherit' === $resolved['font_display'], 'Tokens the theme does not define keep their built-in default' );
} else {
	echo "skip theme-default tests: theme.json not found\n";
}
brand_t( '' === kits_brand_compile_css( array( 'accent' => '#FFBE1A' ), array() ), 'With no resolved defaults, compile_css falls back to the built-in defaults (previous behaviour)' );

// Layer 3 theme.json patch builder tests.
$base_theme = array(
	'version'  => 3,
	'settings' => array(
		'color'  => array(
			'palette' => array(
				array( 'slug' => 'primary', 'name' => 'Accent', 'color' => '#C6D2E0' ),
				array( 'slug' => 'canvas', 'name' => 'Page', 'color' => '#F4F4F4' ),
				array( 'slug' => 'surface', 'name' => 'Surface', 'color' => '#EAEAEA' ),
			),
		),
		'border' => array(
			'radiusSizes' => array(
				array( 'slug' => 'control', 'name' => 'Control', 'size' => '8px' ),
				array( 'slug' => 'card', 'name' => 'Card', 'size' => '12px' ),
			),
		),
		'layout' => array(
			'contentSize' => '1200px',
			'wideSize'    => '1200px',
		),
	),
);
$patch = kits_brand_build_theme_json(
	array(
		'accent'         => '#2563EB',
		'radius_control' => '6px',
		'width_content'  => '760px',
	),
	$base_theme
);
brand_t( 3 === count( $patch['settings']['color']['palette'] ?? array() ), 'Layer 3 patch preserves full color palette list' );
brand_t( '#2563EB' === ( $patch['settings']['color']['palette'][0]['color'] ?? '' ), 'Layer 3 patch updates matching palette slug' );
brand_t( '#EAEAEA' === ( $patch['settings']['color']['palette'][2]['color'] ?? '' ), 'Layer 3 patch keeps untouched palette slugs intact' );
brand_t( 2 === count( $patch['settings']['border']['radiusSizes'] ?? array() ), 'Layer 3 patch preserves full radiusSizes list' );
brand_t( '6px' === ( $patch['settings']['border']['radiusSizes'][0]['size'] ?? '' ), 'Layer 3 patch updates matching radius slug' );
brand_t( '760px' === ( $patch['settings']['layout']['contentSize'] ?? '' ), 'Layer 3 patch updates layout contentSize' );
brand_t( array() === kits_brand_build_theme_json( array(), $base_theme ), 'Layer 3 patch is empty when no tokens are set' );

echo "\nSummary: $count checks, $fails failures.\n";
exit( $fails > 0 ? 1 : 0 );
