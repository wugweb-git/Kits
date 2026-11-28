<?php
/**
 * MailWeb on the Plugins screen: its icon and banner, the row links Getting Started and Documentation, and a "View details"
 * window with Description, Installation, FAQ, Changelog, Screenshots and Reviews, all read from the plugin's own
 * readme.txt and assets/screenshot-N.png, through WordPress's own hooks for a plugin with an Update URI:
 * update_plugins_wugweb-git.github.io (WordPress 5.8+) and plugins_api. It reports the installed version, so WordPress never
 * offers an update from here; nothing is downloaded and no other site is asked. Generated from
 * tools/build/gen-plugin-info.py; change the template, not this copy.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The direct build (with an Update URI header) supplies its own row and View details window. The WordPress.org build has none:
// WordPress.org supplies the window from the readme and its assets, and updates the plugin itself.
if ( is_admin() && '' !== trim( (string) get_file_data( MAILWEB_FILE, array( 'uri' => 'Update URI' ) )['uri'] ) ) {
	add_filter( 'update_plugins_wugweb-git.github.io', 'mailweb_plugin_update_row', 10, 3 );
	add_filter( 'plugins_api', 'mailweb_plugin_details', 10, 3 );
}
add_filter( 'plugin_row_meta', 'mailweb_plugin_row_meta', 10, 2 );
add_action( 'admin_enqueue_scripts', fn( $hook ) => 'plugins.php' === $hook ? add_thickbox() : null );

/** The plugin's main file. */
function mailweb_plugin_file(): string {
	return MAILWEB_FILE;
}

/** The product page, which is also the plugin's documentation (built from the repository by tools/release). */
function mailweb_plugin_docs_url(): string {
	return 'https://wugweb-git.github.io/Kits/plugins/mailweb/';
}

/**
 * Adds Getting Started and Documentation after the "Version | By | View details" WordPress prints itself.
 *
 * @param array<int, string> $links Existing row meta links.
 * @param string             $file  Plugin file basename.
 * @return array<int, string>
 */
function mailweb_plugin_row_meta( array $links, string $file ): array {
	if ( plugin_basename( mailweb_plugin_file() ) !== $file ) {
		return $links;
	}
	$page  = (string) ( 'mailweb' );
	$start = menu_page_url( $page, false );
	if ( '' === (string) $start ) {
		$start = admin_url( 'admin.php?page=' . rawurlencode( $page ) );
	}
	return array_merge(
		$links,
		array(
			'<a href="' . esc_url( $start ) . '">' . esc_html__( 'Getting Started', 'mailweb' ) . '</a>',
			'<a href="' . esc_url( mailweb_plugin_docs_url() ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Documentation', 'mailweb' ) . '</a>',
		)
	);
}

/**
 * The icon and banner addresses.
 *
 * @return array{icons: array<string, string>, banners: array<string, string>}
 */
function mailweb_plugin_art(): array {
	$base = plugins_url( 'assets/', mailweb_plugin_file() );
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
function mailweb_plugin_update_row( $update, $plugin_data, $plugin_file ) {
	if ( plugin_basename( mailweb_plugin_file() ) !== $plugin_file ) {
		return $update;
	}
	return array_merge(
		array(
			'id'           => (string) ( $plugin_data['UpdateURI'] ?? '' ),
			'slug'         => 'mailweb',
			'version'      => (string) ( $plugin_data['Version'] ?? '' ),
			'url'          => 'https://wugweb.com',
			'package'      => '',
			'requires_php' => (string) ( $plugin_data['RequiresPHP'] ?? '' ),
		),
		mailweb_plugin_art()
	);
}

/**
 * The plugins this one works with, as an HTML list for the Description tab ("Works with"). Empty when it stands alone.
 *
 * @return string
 */
function mailweb_plugin_works_with(): string {
	$rows = array(
		array( 'FluentCRM', 'fluent-crm', 'optional; contacts and the mail webhook' ),
	);
	if ( ! $rows ) {
		return '';
	}
	$html = '<h4>' . esc_html__( 'Works with', 'mailweb' ) . '</h4><ul>';
	foreach ( $rows as $row ) {
		$html .= '<li><a href="' . esc_url( 'https://wordpress.org/plugins/' . $row[1] . '/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $row[0] ) . '</a>: ' . esc_html( $row[2] ) . '.</li>';
	}
	return $html . '</ul><p>' . esc_html__( 'None of these is required to activate the plugin.', 'mailweb' ) . '</p>';
}

/**
 * The "View details" window.
 *
 * @param false|object|array $result What another filter returned.
 * @param string             $action The plugins_api action.
 * @param object             $args   Its arguments (slug).
 * @return false|object|array
 */
function mailweb_plugin_details( $result, $action, $args ) {
	if ( 'plugin_information' !== $action || 'mailweb' !== ( $args->slug ?? '' ) ) {
		return $result;
	}
	if ( ! function_exists( 'get_plugin_data' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$plugin_file = mailweb_plugin_file();
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
	$art                     = mailweb_plugin_art();
	$sections                = array();
	$desc                    = isset( $parts['description'] ) ? mailweb_plugin_readme_html( $parts['description'] ) : esc_html( (string) $head['Description'] );
	$sections['description'] = $desc . mailweb_plugin_works_with();
	if ( isset( $parts['installation'] ) ) {
		$sections['installation'] = mailweb_plugin_readme_html( $parts['installation'] );
	}
	$faq = $parts['frequently asked questions'] ?? '';
	if ( '' !== $faq ) {
		$sections['faq'] = mailweb_plugin_readme_html( $faq );
	}
	if ( isset( $parts['changelog'] ) ) {
		$sections['changelog'] = mailweb_plugin_readme_html( $parts['changelog'] );
	}
	$shots = mailweb_plugin_screenshots_html( $parts['screenshots'] ?? '', $dir, $plugin_file );
	if ( '' !== $shots ) {
		$sections['screenshots'] = $shots;
	}
	$sections['reviews'] = '<p>' . esc_html__( 'Tell us how MailWeb works for you, or what is missing, on the plugin page.', 'mailweb' ) . '</p><p><a href="' . esc_url( mailweb_plugin_docs_url() ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Open the MailWeb page', 'mailweb' ) . '</a></p>';
	return (object) array(
		'name'          => 'MailWeb',
		'slug'          => 'mailweb',
		'version'       => (string) $head['Version'],
		'author'        => '<a href="https://wugweb.com">Wugweb</a>',
		'homepage'      => mailweb_plugin_docs_url(),
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
function mailweb_plugin_screenshots_html( string $text, string $dir, string $plugin_file ): string {
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
function mailweb_plugin_readme_html( string $text ): string {
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
