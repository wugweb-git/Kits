<?php
/**
 * Updates for mailweb from the public registry, so the plugin finds its own new release without Kits Core. Direct build only
 * (the WordPress.org build has no Update URI and does not carry this file). Each Wugweb release is listed in
 * registry/index.json on the project's GitHub Pages site (built from the GitHub releases); this file asks for it at most
 * every 12 hours (1 hour after a failed check), offers a newer stable release through WordPress's Updates screen, and
 * keeps the downloaded file only when its SHA-256 matches the registry. Off with KITS_NO_REGISTRY_UPDATES or the
 * mailweb_registry_updates filter returning false; pre-releases only with the mailweb_update_channel filter or the
 * kits_update_channel option set to "pre". When Kits Core is active its updater answers instead. Generated from tools/build/gen-registry-updates.py; change
 * the template, not this copy.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The registry address. */
function mailweb_reg_url(): string {
	$url = defined( 'KITS_REGISTRY_URL' ) ? (string) KITS_REGISTRY_URL : 'https://wugweb-git.github.io/Kits/registry/index.json';
	return esc_url_raw( (string) apply_filters( 'mailweb_registry_url', $url ) );
}

/** Whether the registry is asked at all. */
function mailweb_reg_enabled(): bool {
	return ! defined( 'KITS_NO_REGISTRY_UPDATES' ) && (bool) apply_filters( 'mailweb_registry_updates', true );
}

/**
 * Whether a release package address is one of ours: a file attached to a release of the project's repository.
 *
 * @param string $url The package address.
 */
function mailweb_reg_trusted( string $url ): bool {
	return 0 === strpos( $url, 'https://github.com/wugweb-git/Kits/releases/download/' );
}

/**
 * The registry's products, cached for 12 hours (1 hour after a failed check). Empty when off or unreachable.
 *
 * @return array<string, array>
 */
function mailweb_reg_products(): array {
	if ( ! mailweb_reg_enabled() ) {
		return array();
	}
	$cached = get_site_transient( 'mailweb_reg_registry' );
	if ( is_array( $cached ) ) {
		return $cached;
	}
	$products = array();
	$res      = wp_remote_get(
		mailweb_reg_url(),
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
	set_site_transient( 'mailweb_reg_registry', $products, $products ? 12 * HOUR_IN_SECONDS : HOUR_IN_SECONDS );
	return $products;
}

/**
 * This plugin's newer registry release when it is stable (or the pre-release channel is on), else null.
 *
 * @param string $installed The installed version.
 */
function mailweb_reg_offer( string $installed ): ?array {
	$e = mailweb_reg_products()['mailweb'] ?? null;
	if ( ! is_array( $e ) || empty( $e['released'] ) || empty( $e['version'] ) ) {
		return null;
	}
	$channel = (string) apply_filters( 'mailweb_update_channel', (string) get_option( 'kits_update_channel', 'stable' ) );
	if ( ! empty( $e['prerelease'] ) && 'pre' !== $channel ) {
		return null;
	}
	$package = (string) ( $e['download']['commercial'] ?? '' );
	if ( '' === $package || ! mailweb_reg_trusted( $package ) || ! preg_match( '/^\d+(\.\d+)*(-[0-9A-Za-z.]+)?$/', (string) $e['version'] ) ) {
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
		if ( function_exists( 'kits_registry_offer' ) || 'mailweb' !== dirname( (string) $plugin_file ) ) {
			return $update; // Kits Core answers when it is active; another plugin's file is not ours.
		}
		$offer = mailweb_reg_offer( (string) ( $plugin_data['Version'] ?? '' ) );
		if ( ! $offer ) {
			return $update;
		}
		return array_merge(
			is_array( $update ) ? $update : array(),
			array(
				'id'           => (string) ( $plugin_data['UpdateURI'] ?? '' ),
				'slug'         => 'mailweb',
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
		if ( false !== $reply || function_exists( 'kits_registry_offer' ) || ! is_string( $package ) || ! mailweb_reg_trusted( $package ) ) {
			return $reply;
		}
		$e = mailweb_reg_products()['mailweb'] ?? null;
		if ( ! is_array( $e ) || ( $e['download']['commercial'] ?? '' ) !== $package ) {
			return $reply; // another product's file: its own check (or Kits Core's) handles it.
		}
		$want = strtolower( (string) ( $e['sha256']['commercial'] ?? '' ) );
		if ( ! preg_match( '/^[0-9a-f]{64}$/', $want ) ) {
			return new WP_Error( 'mailweb_reg_no_checksum', __( 'The update was not installed: the registry has no checksum for it.', 'mailweb' ) );
		}
		$file = download_url( $package );
		if ( is_wp_error( $file ) ) {
			return $file;
		}
		if ( ! hash_equals( $want, strtolower( (string) hash_file( 'sha256', $file ) ) ) ) {
			wp_delete_file( $file );
			return new WP_Error( 'mailweb_reg_bad_checksum', __( 'The update was not installed: the downloaded file does not match the published checksum.', 'mailweb' ) );
		}
		return $file;
	},
	10,
	2
);

