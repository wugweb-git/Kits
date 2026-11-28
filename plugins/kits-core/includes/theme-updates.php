<?php
/**
 * Updates for the Kits by Wugweb theme, the way WordPress updates any theme.
 *
 * The theme's style.css names an Update URI on wugweb-git.github.io, so WordPress asks this file instead of WordPress.org
 * (core filter update_themes_{hostname}, WordPress 6.1+). The answer comes from a small JSON file:
 *
 *     { "version": "2.3.0", "package": "https://…/kits-by-wugweb-2.3.0.zip",
 *       "sha256": "<64 hex characters: the zip's SHA-256>", "url": "https://…/changelog",
 *       "requires": "6.6", "requires_php": "7.4", "tested": "7.1" }
 *
 * With it, Appearance → Themes shows "New version available", "View version details" (the change log) and
 * "Update now", and the auto-updates toggle works.
 *
 * Integrity (1.4.1): a package is offered only when the JSON gives an https address and the zip's SHA-256, and the
 * download is checked against it before WordPress unpacks it. Without a checksum the version still shows but there is
 * nothing to install.
 *
 * The check is off until the JSON is published: the address comes from the kits_update_url filter (or the
 * KITS_UPDATE_URL constant) and is empty by default, so nothing is asked and no update is offered.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Where the Kits update JSON lives; empty means the check is off. */
function kits_update_url() {
	$url = defined( 'KITS_UPDATE_URL' ) ? (string) KITS_UPDATE_URL : '';
	return esc_url_raw( (string) apply_filters( 'kits_update_url', $url ) );
}

/** The change log that ships with the installed theme (readme.txt), for "read before updating". */
function kits_changelog_url() {
	$theme = wp_get_theme( 'kits-by-wugweb' );
	return $theme->exists() ? $theme->get_stylesheet_directory_uri() . '/readme.txt' : '';
}

/**
 * The latest release as WordPress wants it, or false. Cached for 12 hours (1 hour after a failed check).
 *
 * @return array|false
 */
function kits_update_release() {
	if ( '' === kits_update_url() ) {
		return false;
	}
	$cached = get_site_transient( 'kits_update_release' );
	if ( is_array( $cached ) ) {
		return $cached['version'] ? $cached : false;
	}
	$release = array( 'version' => '' );
	$res     = wp_remote_get(
		kits_update_url(),
		array(
			'timeout'    => 10,
			'user-agent' => 'Kits-registry/1', // generic: WordPress's default User-Agent carries this site's address.
		)
	);
	if ( ! is_wp_error( $res ) && 200 === (int) wp_remote_retrieve_response_code( $res ) ) {
		$json = json_decode( (string) wp_remote_retrieve_body( $res ), true );
		if ( is_array( $json ) && ! empty( $json['version'] ) && preg_match( '/^\d+(\.\d+)*$/', (string) $json['version'] ) ) {
			$sha     = strtolower( (string) ( $json['sha256'] ?? '' ) );
			$package = esc_url_raw( (string) ( $json['package'] ?? '' ) );
			if ( 0 !== strpos( $package, 'https://' ) || ! preg_match( '/^[0-9a-f]{64}$/', $sha ) ) {
				$package = ''; // no install without an https address and a checksum.
				$sha     = '';
			}
			$release = array(
				'version'      => (string) $json['version'],
				'package'      => $package,
				'sha256'       => $sha,
				'url'          => esc_url_raw( (string) ( $json['url'] ?? '' ) ),
				'requires'     => (string) ( $json['requires'] ?? '' ),
				'requires_php' => (string) ( $json['requires_php'] ?? '' ),
				'tested'       => (string) ( $json['tested'] ?? '' ),
			);
		}
	}
	set_site_transient( 'kits_update_release', $release, $release['version'] ? 12 * HOUR_IN_SECONDS : HOUR_IN_SECONDS );
	return $release['version'] ? $release : false;
}

add_filter(
	'update_themes_wugweb-git.github.io',
	/**
	 * Answer WordPress's update check for Kits by Wugweb.
	 *
	 * @param array|false $update     Earlier answer, if any.
	 * @param array       $theme_data The theme's headers.
	 * @param string      $stylesheet The theme's folder name.
	 * @return array|false
	 */
	function ( $update, $theme_data, $stylesheet ) {
		if ( $update || 'kits-by-wugweb' !== $stylesheet ) {
			return $update;
		}
		$release = kits_update_release();
		if ( ! $release ) {
			return false;
		}
		return array(
			'id'           => (string) ( $theme_data['UpdateURI'] ?? '' ),
			'theme'        => $stylesheet,
			'version'      => $release['version'],
			'url'          => $release['url'] ? $release['url'] : kits_changelog_url(),
			'package'      => $release['package'],
			'requires'     => $release['requires'],
			'requires_php' => $release['requires_php'],
			'tested'       => $release['tested'],
		);
	},
	10,
	3
);

/**
 * The checksum published for the theme package WordPress is about to download.
 *
 * @param string $package Package address.
 * @return string|null Null when the package is not the theme's; '' when it is but has no usable checksum.
 */
function kits_update_package_sha256( $package ) {
	$release = kits_update_release();
	if ( ! $release || empty( $release['package'] ) || $release['package'] !== $package ) {
		return null;
	}
	$sha = strtolower( (string) ( $release['sha256'] ?? '' ) );
	return preg_match( '/^[0-9a-f]{64}$/', $sha ) ? $sha : '';
}

// Check the theme package against its published SHA-256 before WordPress unpacks it (the registry's own packages are
// checked in registry-updates.php, which runs first). A theme package without a checksum is refused.
add_filter(
	'upgrader_pre_download',
	function ( $reply, $package ) {
		if ( false !== $reply || ! is_string( $package ) ) {
			return $reply;
		}
		$sha = kits_update_package_sha256( $package );
		return null === $sha ? $reply : kits_download_verified( $package, $sha );
	},
	11,
	2
);

// A manual "Check again" on Dashboard → Updates asks the JSON again.
add_action(
	'load-update-core.php',
	function () {
		if ( isset( $_GET['force-check'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- core's own link, read only.
			delete_site_transient( 'kits_update_release' );
		}
	}
);
