#!/usr/bin/env python3
"""Generate each plugin's own update check against the public registry (includes/registry-updates.php).

Without it a plugin only gets update notices when Kits Core is also active (Core answers for all of them). With it the
direct (Update URI) build of each plugin finds its own new release in the registry and offers it through WordPress's own
Updates screen, with the release file checked against the registry's SHA-256 before it is installed. The WordPress.org
build leaves the file out (build-dist.py), because WordPress.org updates those plugins itself. When Kits Core is active
its updater answers and this one stands down, so an update is never offered twice. Each plugin gets its own copy with its
own function prefix. `--check` fails when a committed copy differs from what the template makes (CI).

Usage: python3 tools/build/gen-registry-updates.py [--check]
"""
import argparse, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]

# slug -> (function prefix, output file relative to the plugin)
TARGETS = {
    'directoryweb': ('directoryweb_reg', 'includes/registry-updates.php'),
    'rankweb': ('rankweb_reg', 'includes/registry-updates.php'),
    'sourceweb': ('sourceweb_reg', 'includes/admin/registry-updates.php'),
    'insightweb': ('insightweb_reg', 'includes/registry-updates.php'),
    'mailweb': ('mailweb_reg', 'includes/registry-updates.php'),
    'planweb': ('planweb_reg', 'includes/registry-updates.php'),
}

TEMPLATE = r'''<?php
/**
 * Updates for @SLUG@ from the public registry, so the plugin finds its own new release without Kits Core. Direct build only
 * (the WordPress.org build has no Update URI and does not carry this file). Each Wugweb release is listed in
 * registry/index.json on the project's GitHub Pages site (built from the GitHub releases); this file asks for it at most
 * every 12 hours (1 hour after a failed check), offers a newer stable release through WordPress's Updates screen, and
 * keeps the downloaded file only when its SHA-256 matches the registry. Off with KITS_NO_REGISTRY_UPDATES or the
 * kits_registry_updates filter returning false; pre-releases only with the kits_update_channel filter or option set to
 * "pre". When Kits Core is active its updater answers instead. Generated from tools/build/gen-registry-updates.py; change
 * the template, not this copy.
 *
 * @package @SLUG@
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The registry address. */
function @P@_url(): string {
	$url = defined( 'KITS_REGISTRY_URL' ) ? (string) KITS_REGISTRY_URL : 'https://wugweb-git.github.io/Kits/registry/index.json';
	return esc_url_raw( (string) apply_filters( 'kits_registry_url', $url ) );
}

/** Whether the registry is asked at all. */
function @P@_enabled(): bool {
	return ! defined( 'KITS_NO_REGISTRY_UPDATES' ) && (bool) apply_filters( 'kits_registry_updates', true );
}

/**
 * Whether a release package address is one of ours: a file attached to a release of the project's repository.
 *
 * @param string $url The package address.
 */
function @P@_trusted( string $url ): bool {
	return 0 === strpos( $url, 'https://github.com/wugweb-git/Kits/releases/download/' );
}

/**
 * The registry's products, cached for 12 hours (1 hour after a failed check). Empty when off or unreachable.
 *
 * @return array<string, array>
 */
function @P@_products(): array {
	if ( ! @P@_enabled() ) {
		return array();
	}
	$cached = get_site_transient( '@P@_registry' );
	if ( is_array( $cached ) ) {
		return $cached;
	}
	$products = array();
	$res      = wp_remote_get(
		@P@_url(),
		array(
			'timeout'    => 10,
			'user-agent' => 'Kits-registry/1', // generic: WordPress's default User-Agent carries this site's address.
		)
	);
	if ( ! is_wp_error( $res ) && 200 === (int) wp_remote_retrieve_response_code( $res ) ) {
		$json = json_decode( (string) wp_remote_retrieve_body( $res ), true );
		if ( is_array( $json ) && isset( $json['products'] ) && is_array( $json['products'] ) ) {
			$products = $json['products'];
		}
	}
	set_site_transient( '@P@_registry', $products, $products ? 12 * HOUR_IN_SECONDS : HOUR_IN_SECONDS );
	return $products;
}

/**
 * This plugin's newer registry release when it is stable (or the pre-release channel is on), else null.
 *
 * @param string $installed The installed version.
 */
function @P@_offer( string $installed ): ?array {
	$e = @P@_products()['@SLUG@'] ?? null;
	if ( ! is_array( $e ) || empty( $e['released'] ) || empty( $e['version'] ) ) {
		return null;
	}
	$channel = (string) apply_filters( 'kits_update_channel', (string) get_option( 'kits_update_channel', 'stable' ) );
	if ( ! empty( $e['prerelease'] ) && 'pre' !== $channel ) {
		return null;
	}
	$package = (string) ( $e['download']['commercial'] ?? '' );
	if ( '' === $package || ! @P@_trusted( $package ) || ! preg_match( '/^\d+(\.\d+)*(-[0-9A-Za-z.]+)?$/', (string) $e['version'] ) ) {
		return null;
	}
	if ( version_compare( (string) $e['version'], $installed, '<=' ) ) {
		return null;
	}
	return array(
		'version'      => (string) $e['version'],
		'package'      => esc_url_raw( $package ),
		'url'          => esc_url_raw( (string) ( $e['page'] ?? '' ) ),
		'requires'     => (string) ( $e['requires_wp'] ?? '' ),
		'requires_php' => (string) ( $e['requires_php'] ?? '' ),
		'tested'       => (string) ( $e['tested'] ?? '' ),
	);
}

add_filter(
	'update_plugins_wugweb-git.github.io',
	/**
	 * Offer a newer registry release of this plugin.
	 *
	 * @param array|false $update      The plugin's own answer (the installed version).
	 * @param array       $plugin_data The plugin's header.
	 * @param string      $plugin_file The plugin's file, relative to the plugins folder.
	 * @return array|false
	 */
	function ( $update, $plugin_data, $plugin_file ) {
		if ( function_exists( 'kits_registry_offer' ) || '@SLUG@' !== dirname( (string) $plugin_file ) ) {
			return $update; // Kits Core answers when it is active; another plugin's file is not ours.
		}
		$offer = @P@_offer( (string) ( $plugin_data['Version'] ?? '' ) );
		if ( ! $offer ) {
			return $update;
		}
		return array_merge(
			is_array( $update ) ? $update : array(),
			array(
				'id'           => (string) ( $plugin_data['UpdateURI'] ?? '' ),
				'slug'         => '@SLUG@',
				'version'      => $offer['version'],
				'url'          => $offer['url'],
				'package'      => $offer['package'],
				'requires'     => $offer['requires'],
				'requires_php' => $offer['requires_php'],
				'tested'       => $offer['tested'],
			)
		);
	},
	20,
	3
);

// Check the downloaded file against the registry's SHA-256 before WordPress unpacks it (this plugin's release only).
add_filter(
	'upgrader_pre_download',
	function ( $reply, $package ) {
		if ( false !== $reply || function_exists( 'kits_registry_offer' ) || ! is_string( $package ) || ! @P@_trusted( $package ) ) {
			return $reply;
		}
		$e = @P@_products()['@SLUG@'] ?? null;
		if ( ! is_array( $e ) || ( $e['download']['commercial'] ?? '' ) !== $package ) {
			return $reply; // another product's file: its own check (or Kits Core's) handles it.
		}
		$want = strtolower( (string) ( $e['sha256']['commercial'] ?? '' ) );
		if ( ! preg_match( '/^[0-9a-f]{64}$/', $want ) ) {
			return new WP_Error( '@P@_no_checksum', __( 'The update was not installed: the registry has no checksum for it.', '@SLUG@' ) );
		}
		$file = download_url( $package );
		if ( is_wp_error( $file ) ) {
			return $file;
		}
		if ( ! hash_equals( $want, strtolower( (string) hash_file( 'sha256', $file ) ) ) ) {
			wp_delete_file( $file );
			return new WP_Error( '@P@_bad_checksum', __( 'The update was not installed: the downloaded file does not match the published checksum.', '@SLUG@' ) );
		}
		return $file;
	},
	10,
	2
);

'''

def render(slug, prefix):
    return TEMPLATE.replace('@SLUG@', slug).replace('@P@', prefix)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    bad = 0
    for slug, (prefix, out) in TARGETS.items():
        path = ROOT / 'plugins' / slug / out
        text = render(slug, prefix)
        if a.check:
            if not path.is_file() or path.read_text() != text:
                print(f'{path} differs from the template', file=sys.stderr)
                bad = 1
        else:
            path.write_text(text)
            print(f'wrote {path.relative_to(ROOT)}')
    return bad

sys.exit(main())
