<?php
/**
 * Updates for the Wugweb plugins and the Kits theme from the public registry (registry/index.json on the project's
 * GitHub Pages site, built from the GitHub releases). Each product's Update URI names wugweb.com, so WordPress asks
 * update_plugins_wugweb.com / update_themes_wugweb.com; this file answers from the registry, after each product's own
 * "up to date" answer (priority 20).
 *
 * Decisions (26 Nov 2026): the registry and the release files are public (no per-site login); only stable releases are
 * offered unless the site sets the channel to pre-release; the file is checked against the registry's SHA-256 before WordPress
 * installs it. Off with KITS_NO_REGISTRY_UPDATES or the kits_registry_updates filter returning false.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The registry address. */
function kits_registry_url(): string {
	$url = defined( 'KITS_REGISTRY_URL' ) ? (string) KITS_REGISTRY_URL : 'https://wugweb-git.github.io/Kits/registry/index.json';
	return esc_url_raw( (string) apply_filters( 'kits_registry_url', $url ) );
}

/** Whether the registry is asked at all. */
function kits_registry_enabled(): bool {
	return ! defined( 'KITS_NO_REGISTRY_UPDATES' ) && (bool) apply_filters( 'kits_registry_updates', true );
}

/** 'stable' (default) or 'pre': whether pre-releases are offered. Set with the kits_update_channel filter or the option of that name. */
function kits_update_channel(): string {
	$channel = (string) apply_filters( 'kits_update_channel', (string) get_option( 'kits_update_channel', 'stable' ) );
	return 'pre' === $channel ? 'pre' : 'stable';
}

/**
 * Whether a release package address is one of ours: a file attached to a release of the project's repository.
 *
 * @param string $url The package address.
 */
function kits_registry_trusted_package( string $url ): bool {
	return 0 === strpos( $url, 'https://github.com/wugweb-git/Kits/releases/download/' );
}

/**
 * The registry's products, cached for 12 hours (1 hour after a failed check). Empty when off or unreachable.
 *
 * @return array<string, array>
 */
function kits_registry_products(): array {
	if ( ! kits_registry_enabled() ) {
		return array();
	}
	$cached = get_site_transient( 'kits_registry' );
	if ( is_array( $cached ) ) {
		return $cached;
	}
	$products = array();
	$res      = wp_remote_get( kits_registry_url(), array(
		'timeout'    => 10,
		'user-agent' => 'Kits-registry/1', // generic: WordPress's default User-Agent carries this site's address
	) );
	if ( ! is_wp_error( $res ) && 200 === (int) wp_remote_retrieve_response_code( $res ) ) {
		$json = json_decode( (string) wp_remote_retrieve_body( $res ), true );
		if ( is_array( $json ) && isset( $json['products'] ) && is_array( $json['products'] ) ) {
			$products = $json['products'];
		}
	}
	set_site_transient( 'kits_registry', $products, $products ? 12 * HOUR_IN_SECONDS : HOUR_IN_SECONDS );
	return $products;
}

/**
 * The registry's offer for a product when it is newer than the installed version and allowed on this channel, else null.
 *
 * @param string $slug      Product slug (the folder name).
 * @param string $installed The installed version.
 */
function kits_registry_offer( string $slug, string $installed ): ?array {
	$e = kits_registry_products()[ $slug ] ?? null;
	if ( ! is_array( $e ) || empty( $e['released'] ) || empty( $e['version'] ) ) {
		return null;
	}
	if ( ! empty( $e['prerelease'] ) && 'pre' !== kits_update_channel() ) {
		return null;
	}
	$package = (string) ( $e['download']['commercial'] ?? '' );
	if ( '' === $package || ! kits_registry_trusted_package( $package ) || ! preg_match( '/^\d+(\.\d+)*(-[0-9A-Za-z.]+)?$/', (string) $e['version'] ) ) {
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
		'sha256'       => (string) ( $e['sha256']['commercial'] ?? '' ),
	);
}

add_filter(
	'update_plugins_wugweb.com',
	/**
	 * Offer a newer registry release of a Wugweb plugin.
	 *
	 * @param array|false $update      The product's own answer (the installed version).
	 * @param array       $plugin_data The plugin's header.
	 * @param string      $plugin_file The plugin's file, relative to the plugins folder.
	 * @return array|false
	 */
	function ( $update, $plugin_data, $plugin_file ) {
		$slug = dirname( (string) $plugin_file );
		if ( ! in_array( $slug, array( 'kits-core', 'directoryweb', 'rankweb', 'sourceweb', 'insightweb', 'mailweb', 'planweb' ), true ) ) {
			return $update;
		}
		$offer = kits_registry_offer( $slug, (string) ( $plugin_data['Version'] ?? '' ) );
		if ( ! $offer ) {
			return $update;
		}
		return array_merge(
			is_array( $update ) ? $update : array(),
			array(
				'id'           => (string) ( $plugin_data['UpdateURI'] ?? '' ),
				'slug'         => $slug,
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

add_filter(
	'update_themes_wugweb.com',
	/**
	 * Offer a newer registry release of the theme when no update address is set (theme-updates.php).
	 *
	 * @param array|false $update     Earlier answer.
	 * @param array       $theme_data The theme's headers.
	 * @param string      $stylesheet The theme's folder name.
	 * @return array|false
	 */
	function ( $update, $theme_data, $stylesheet ) {
		if ( $update || 'kits-by-wugweb' !== $stylesheet ) {
			return $update;
		}
		$offer = kits_registry_offer( 'kits-by-wugweb', (string) ( $theme_data['Version'] ?? '' ) );
		if ( ! $offer ) {
			return $update;
		}
		return array(
			'id'           => (string) ( $theme_data['UpdateURI'] ?? '' ),
			'theme'        => $stylesheet,
			'version'      => $offer['version'],
			'url'          => $offer['url'],
			'package'      => $offer['package'],
			'requires'     => $offer['requires'],
			'requires_php' => $offer['requires_php'],
		);
	},
	20,
	3
);

// Check the downloaded file against the registry's SHA-256 before WordPress unpacks it.
add_filter(
	'upgrader_pre_download',
	function ( $reply, $package ) {
		if ( false !== $reply || ! is_string( $package ) || ! kits_registry_trusted_package( $package ) ) {
			return $reply;
		}
		$want = '';
		foreach ( kits_registry_products() as $e ) {
			if ( is_array( $e ) && ( $e['download']['commercial'] ?? '' ) === $package ) {
				$want = strtolower( (string) ( $e['sha256']['commercial'] ?? '' ) );
				break;
			}
		}
		if ( ! preg_match( '/^[0-9a-f]{64}$/', $want ) ) {
			return new WP_Error( 'kits_no_checksum', __( 'The update was not installed: the registry has no checksum for it.', 'kits-core' ) );
		}
		$file = download_url( $package );
		if ( is_wp_error( $file ) ) {
			return $file;
		}
		if ( ! hash_equals( $want, strtolower( (string) hash_file( 'sha256', $file ) ) ) ) {
			wp_delete_file( $file );
			return new WP_Error( 'kits_bad_checksum', __( 'The update was not installed: the downloaded file does not match the registry checksum.', 'kits-core' ) );
		}
		return $file;
	},
	10,
	2
);

// "Check again" on Dashboard → Updates asks the registry again.
add_action(
	'load-update-core.php',
	function () {
		if ( isset( $_GET['force-check'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- core's own link, read only.
			delete_site_transient( 'kits_registry' );
		}
	}
);

/** "Check again" on Dashboard → Updates clears WordPress's update cache; clear the registry's 12 h copy with it, so a new release shows at once. */
add_action(
	'delete_site_transient_update_plugins',
	function () {
		delete_site_transient( 'kits_registry' );
	}
);
add_action(
	'delete_site_transient_update_themes',
	function () {
		delete_site_transient( 'kits_registry' );
	}
);
