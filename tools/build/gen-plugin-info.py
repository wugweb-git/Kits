#!/usr/bin/env python3
"""Generate each product's Plugins-screen details (includes/plugin-info.php; SourceWeb: includes/admin/plugin-info.php).

What it gives a plugin: its icon and banner, the row links "Getting Started" and "Documentation" (core WordPress adds
"Version | By | View details" itself), and a "View details" window with the tabs Description, Installation, FAQ, Changelog,
Screenshots and Reviews, all read from the plugin's own readme.txt and assets/screenshot-N.png. It also says which other
plugins the plugin works with. Each plugin must stand alone, so each gets its own copy with its own function prefix.
`--check` fails when a committed copy differs from what the template makes (CI).

Usage: python3 tools/build/gen-plugin-info.py [--check]
"""
import argparse, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]

# slug -> dict(prefix, name, file expression, admin page expression, output file, works-with list)
TARGETS = {
    'kits-core': dict(p='kits_plugin', name='Kits Core', file="KITS_CORE_DIR . 'kits-core.php'", page="defined( 'KITS_MENU' ) ? KITS_MENU : 'kits'", out='includes/plugin-info.php', works=[]),
    'directoryweb': dict(p='directoryweb_plugin', name='DirectoryWeb', file='DIRECTORYWEB_FILE', page="defined( 'DIRECTORYWEB_PAGE' ) ? DIRECTORYWEB_PAGE : 'directoryweb'", out='includes/plugin-info.php',
                         works=[('Fluent Forms', 'fluentform', 'the claim form is a Fluent Forms form')]),
    'rankweb': dict(p='rankweb_seo_plugin', name='RankWeb', file="defined( 'RANKWEB_FILE' ) ? RANKWEB_FILE : RANKWEB_DIR . 'rankweb.php'", page="defined( 'AW_SEO_MENU' ) ? AW_SEO_MENU : 'rankweb'", out='includes/plugin-info.php',
                    works=[('Rank Math SEO', 'seo-by-rank-math', 'built to run beside it: focus keywords, titles, schema, bulk edit and the redirect tools read and write its fields. Without it RankWeb prints its own basic SEO tags and several tools have nothing to work on')]),
    'sourceweb': dict(p='sourceweb_src_plugin', name='SourceWeb', file='SOURCEWEB_FILE', page="defined( 'AW_SRC_MENU' ) ? AW_SRC_MENU : 'sourceweb'", out='includes/admin/plugin-info.php', works=[]),
    'insightweb': dict(p='insightweb_si_plugin', name='InsightWeb', file='INSIGHTWEB_FILE', page="defined( 'AW_SI_SLUG' ) ? AW_SI_SLUG : 'insightweb'", out='includes/plugin-info.php',
                       works=[('Site Kit by Google', 'google-site-kit', 'it supplies the Search Console figures; without it the Dashboard shows a setup note')]),
    'mailweb': dict(p='mailweb_plugin', name='MailWeb', file='MAILWEB_FILE', page="'mailweb'", out='includes/plugin-info.php',
                    works=[('FluentCRM', 'fluent-crm', 'optional; contacts and the mail webhook')]),
    'planweb': dict(p='planweb_plugin', name='PlanWeb', file="PLANWEB_DIR . 'planweb.php'", page="defined( 'PLANWEB_MENU' ) ? PLANWEB_MENU : 'planweb'", out='includes/plugin-info.php', works=[]),
}

TEMPLATE = r'''<?php
/**
 * @NAME@ on the Plugins screen: its icon and banner, the row links Getting Started and Documentation, and a "View details"
 * window with Description, Installation, FAQ, Changelog, Screenshots and Reviews, all read from the plugin's own
 * readme.txt and assets/screenshot-N.png, through WordPress's own hooks for a plugin with an Update URI:
 * update_plugins_wugweb-git.github.io (WordPress 5.8+) and plugins_api. It reports the installed version, so WordPress never
 * offers an update from here; nothing is downloaded and no other site is asked. Generated from
 * tools/build/gen-plugin-info.py; change the template, not this copy.
 *
 * @package @SLUG@
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The direct build (with an Update URI header) supplies its own row and View details window. The WordPress.org build has none:
// WordPress.org supplies the window from the readme and its assets, and updates the plugin itself.
if ( is_admin() && '' !== trim( (string) get_file_data( @FILE@, array( 'uri' => 'Update URI' ) )['uri'] ) ) {
	add_filter( 'update_plugins_wugweb-git.github.io', '@P@_update_row', 10, 3 );
	add_filter( 'plugins_api', '@P@_details', 10, 3 );
}
add_filter( 'plugin_row_meta', '@P@_row_meta', 10, 2 );
add_action( 'admin_enqueue_scripts', fn( $hook ) => 'plugins.php' === $hook ? add_thickbox() : null );

/** The plugin's main file. */
function @P@_file(): string {
	return @FILE@;
}

/** The product page, which is also the plugin's documentation (built from the repository by tools/release). */
function @P@_docs_url(): string {
	return 'https://wugweb-git.github.io/Kits/plugins/@SLUG@/';
}

/**
 * Adds Getting Started and Documentation after the "Version | By | View details" WordPress prints itself.
 *
 * @param array<int, string> $links Existing row meta links.
 * @param string             $file  Plugin file basename.
 * @return array<int, string>
 */
function @P@_row_meta( array $links, string $file ): array {
	if ( plugin_basename( @P@_file() ) !== $file ) {
		return $links;
	}
	$page  = (string) ( @PAGE@ );
	$start = menu_page_url( $page, false );
	if ( '' === (string) $start ) {
		$start = admin_url( 'admin.php?page=' . rawurlencode( $page ) );
	}
	return array_merge(
		$links,
		array(
			'<a href="' . esc_url( $start ) . '">' . esc_html__( 'Getting Started', '@SLUG@' ) . '</a>',
			'<a href="' . esc_url( @P@_docs_url() ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Documentation', '@SLUG@' ) . '</a>',
		)
	);
}

/**
 * The icon and banner addresses.
 *
 * @return array{icons: array<string, string>, banners: array<string, string>}
 */
function @P@_art(): array {
	$base = plugins_url( 'assets/', @P@_file() );
	return array(
		'icons'   => array(
			'1x'  => $base . 'icon-128x128.png',
			'2x'  => $base . 'icon-256x256.png',
			'svg' => $base . 'icon.svg',
		),
		'banners' => array(
			'low'  => $base . 'banner-772x250.png',
			'high' => $base . 'banner-1544x500.png',
		),
	);
}

/**
 * The row WordPress keeps for the plugin when it checks for updates: the installed version, so it is "up to date".
 *
 * @param array|false $update      What another filter returned, or false.
 * @param array       $plugin_data The plugin's header.
 * @param string      $plugin_file The plugin's file, relative to the plugins folder.
 * @return array|false
 */
function @P@_update_row( $update, $plugin_data, $plugin_file ) {
	if ( plugin_basename( @P@_file() ) !== $plugin_file ) {
		return $update;
	}
	return array_merge(
		array(
			'id'           => (string) ( $plugin_data['UpdateURI'] ?? '' ),
			'slug'         => '@SLUG@',
			'version'      => (string) ( $plugin_data['Version'] ?? '' ),
			'url'          => 'https://wugweb.com',
			'package'      => '',
			'requires_php' => (string) ( $plugin_data['RequiresPHP'] ?? '' ),
		),
		@P@_art()
	);
}

/**
 * The plugins this one works with, as an HTML list for the Description tab ("Works with"). Empty when it stands alone.
 *
 * @return string
 */
function @P@_works_with(): string {
	$rows = @ROWS@;
	if ( ! $rows ) {
		return '';
	}
	$html = '<h4>' . esc_html__( 'Works with', '@SLUG@' ) . '</h4><ul>';
	foreach ( $rows as $row ) {
		$html .= '<li><a href="' . esc_url( 'https://wordpress.org/plugins/' . $row[1] . '/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $row[0] ) . '</a>: ' . esc_html( $row[2] ) . '.</li>';
	}
	return $html . '</ul><p>' . esc_html__( 'None of these is required to activate the plugin.', '@SLUG@' ) . '</p>';
}

/**
 * The "View details" window.
 *
 * @param false|object|array $result What another filter returned.
 * @param string             $action The plugins_api action.
 * @param object             $args   Its arguments (slug).
 * @return false|object|array
 */
function @P@_details( $result, $action, $args ) {
	if ( 'plugin_information' !== $action || '@SLUG@' !== ( $args->slug ?? '' ) ) {
		return $result;
	}
	if ( ! function_exists( 'get_plugin_data' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$plugin_file = @P@_file();
	$dir         = dirname( $plugin_file );
	$head        = get_plugin_data( $plugin_file, false, false );
	$readme      = (string) @file_get_contents( $dir . '/readme.txt' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents, WordPress.PHP.NoSilencedErrors.Discouraged -- the plugin's own readme; none is fine.
	$parts       = array();
	foreach ( preg_split( '/^==\s*(.+?)\s*==\s*$/m', $readme, -1, PREG_SPLIT_DELIM_CAPTURE ) as $i => $chunk ) {
		if ( $i % 2 ) {
			$name = strtolower( trim( $chunk ) );
		} elseif ( isset( $name ) ) {
			$parts[ $name ] = $chunk;
		}
	}
	$tested                  = preg_match( '/^Tested up to:\s*(\S+)/mi', $readme, $m ) ? $m[1] : '';
	$art                     = @P@_art();
	$sections                = array();
	$desc                    = isset( $parts['description'] ) ? @P@_readme_html( $parts['description'] ) : esc_html( (string) $head['Description'] );
	$sections['description'] = $desc . @P@_works_with();
	if ( isset( $parts['installation'] ) ) {
		$sections['installation'] = @P@_readme_html( $parts['installation'] );
	}
	$faq = $parts['frequently asked questions'] ?? '';
	if ( '' !== $faq ) {
		$sections['faq'] = @P@_readme_html( $faq );
	}
	if ( isset( $parts['changelog'] ) ) {
		$sections['changelog'] = @P@_readme_html( $parts['changelog'] );
	}
	$shots = @P@_screenshots_html( $parts['screenshots'] ?? '', $dir, $plugin_file );
	if ( '' !== $shots ) {
		$sections['screenshots'] = $shots;
	}
	$sections['reviews'] = '<p>' . esc_html__( 'Tell us how @NAME@ works for you, or what is missing, on the plugin page.', '@SLUG@' ) . '</p><p><a href="' . esc_url( @P@_docs_url() ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Open the @NAME@ page', '@SLUG@' ) . '</a></p>';
	return (object) array(
		'name'          => '@NAME@',
		'slug'          => '@SLUG@',
		'version'       => (string) $head['Version'],
		'author'        => '<a href="https://wugweb.com">Wugweb</a>',
		'homepage'      => @P@_docs_url(),
		'requires'      => (string) $head['RequiresWP'],
		'requires_php'  => (string) $head['RequiresPHP'],
		'tested'        => $tested,
		'sections'      => $sections,
		'banners'       => $art['banners'],
		'icons'         => $art['icons'],
		'download_link' => '',
	);
}

/**
 * The Screenshots tab: each "N. caption" line of the readme with assets/screenshot-N.png when that file exists.
 *
 * @param string $text        The readme's Screenshots section.
 * @param string $dir         The plugin folder.
 * @param string $plugin_file The plugin's main file.
 */
function @P@_screenshots_html( string $text, string $dir, string $plugin_file ): string {
	$html = '';
	foreach ( preg_split( '/\R/', trim( $text ) ) as $line ) {
		if ( ! preg_match( '/^(\d+)\.\s+(.+)$/', trim( $line ), $m ) ) {
			continue;
		}
		$file = 'assets/screenshot-' . (int) $m[1] . '.png';
		if ( ! file_exists( $dir . '/' . $file ) ) {
			continue;
		}
		$html .= '<li><img src="' . esc_url( plugins_url( $file, $plugin_file ) ) . '" alt="' . esc_attr( $m[2] ) . '" style="max-width:100%;height:auto" /><p>' . esc_html( $m[2] ) . '</p></li>';
	}
	return '' === $html ? '' : '<ol>' . $html . '</ol>';
}

/**
 * A readme.txt section as HTML: "= Heading =", "* item" lists, `code` and paragraphs; everything escaped.
 *
 * @param string $text The section's text.
 */
function @P@_readme_html( string $text ): string {
	$html = '';
	$list = false;
	foreach ( preg_split( '/\R/', trim( $text ) ) as $line ) {
		$line = trim( $line );
		$safe = preg_replace( '/`([^`]+)`/', '<code>$1</code>', esc_html( $line ) );
		if ( preg_match( '/^\*\s+(.*)$/', $line ) ) {
			$html .= ( $list ? '' : '<ul>' ) . '<li>' . substr( $safe, 2 ) . '</li>';
			$list  = true;
			continue;
		}
		if ( $list ) {
			$html .= '</ul>';
			$list  = false;
		}
		if ( preg_match( '/^=\s*(.+?)\s*=$/', $line, $h ) ) {
			$html .= '<h4>' . esc_html( $h[1] ) . '</h4>';
		} elseif ( '' !== $line ) {
			$html .= '<p>' . $safe . '</p>';
		}
	}
	return $html . ( $list ? '</ul>' : '' );
}
'''

def render(slug: str) -> str:
    t = TARGETS[slug]
    works = '\n'.join("\t\tarray( %s, %s, %s )," % tuple("'" + x.replace("'", "\\'") + "'" for x in w) for w in t['works'])
    rows = 'array(\n' + works + '\n\t)' if works else 'array()'
    return (TEMPLATE.replace('@ROWS@', rows).replace('@PAGE@', t['page']).replace('@FILE@', t['file'])
            .replace('@NAME@', t['name']).replace('@SLUG@', slug).replace('@P@', t['p']))

def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument('--check', action='store_true'); a = ap.parse_args()
    bad = 0
    for slug, t in TARGETS.items():
        f = ROOT / 'plugins' / slug / t['out']
        want = render(slug)
        if a.check:
            if not f.exists() or f.read_text() != want:
                print(f'out of date: {f.relative_to(ROOT)} (run tools/build/gen-plugin-info.py)'); bad += 1
        else:
            f.write_text(want); print('wrote', f.relative_to(ROOT))
    return 1 if bad else 0

if __name__ == '__main__':
    sys.exit(main())
