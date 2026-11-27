<?php
/**
 * Branded server error pages: the PHP fatal error page (500) and the update maintenance page (503).
 *
 * WordPress only reads these as drop-ins in wp-content (php-error.php and maintenance.php), which is outside what a
 * deploy updates, so a site's own pages live in a folder of its own (the filter kits_error_pages_dir names it) and are
 * copied there. A copy is made when the file is missing or differs from the source, on the first web request after a
 * deploy (when the deployed commit changes, see deploy-purge.php) and on admin screens. A file at that path without the
 * marker belongs to something else and is never replaced. Nothing here can stop a request: if wp-content is not
 * writable the copy is skipped and the result is kept in the option aw_error_pages.
 *
 * The marker is a compatibility key: pages already installed carry it and are recognised as ours by it. It is
 * KITS_ERROR_PAGE_MARKER unless a site names its own with the filter kits_error_page_marker, so pages that carry an
 * older marker keep being updated in place. The option aw_error_pages and the transient aw_error_pages_checked keep
 * their names.
 *
 * Without a pages folder (the plugin ships none), nothing is copied, no option is written and no notice shows: the
 * site keeps WordPress's own error pages.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Default marker that every drop-in carries; only files with it are replaced (see kits_error_page_marker()). */
const KITS_ERROR_PAGE_MARKER = 'Kits error page';

/** Drop-in file names (the same in the site's pages folder and wp-content/). */
const KITS_ERROR_PAGE_FILES = array( 'php-error.php', 'maintenance.php' );

/** Default folder of a site's error pages: none ships with the plugin (see kits_error_pages_dir()). */
const KITS_ERROR_PAGE_DIR = KITS_CORE_DIR . 'assets/site/dropins/';

/** The marker the drop-ins carry: KITS_ERROR_PAGE_MARKER, or the one a site names (an older marker keeps installed pages ours). */
function kits_error_page_marker(): string {
	$m = (string) apply_filters( 'kits_error_page_marker', KITS_ERROR_PAGE_MARKER );
	return '' !== $m ? $m : KITS_ERROR_PAGE_MARKER;
}

/** The folder that holds this site's error pages (with a trailing slash): KITS_ERROR_PAGE_DIR, or the one a site names. */
function kits_error_pages_dir(): string {
	return trailingslashit( (string) apply_filters( 'kits_error_pages_dir', KITS_ERROR_PAGE_DIR ) );
}

/**
 * Whether this site has its own error pages (its pages folder with at least one of the drop-ins).
 *
 * @return bool
 */
function kits_error_pages_here(): bool {
	foreach ( KITS_ERROR_PAGE_FILES as $name ) {
		if ( is_readable( kits_error_pages_dir() . $name ) ) {
			return true;
		}
	}
	return false;
}

/**
 * Copy each drop-in into wp-content when it is missing or out of date.
 *
 * @return array<string,string> File name => 'current', 'installed', 'updated', 'foreign', 'unwritable' or 'no-source'.
 */
function kits_error_pages_sync() {
	if ( ! kits_error_pages_here() ) {
		return array(); // Not this site's: nothing to install.
	}
	$status = array();
	foreach ( KITS_ERROR_PAGE_FILES as $name ) {
		$status[ $name ] = kits_error_page_sync_one( kits_error_pages_dir() . $name, WP_CONTENT_DIR . '/' . $name );
	}
	if ( get_option( 'aw_error_pages' ) !== $status ) {
		update_option( 'aw_error_pages', $status, false );
	}
	return $status;
}

/**
 * Bring one drop-in up to date.
 *
 * @param string $src Source file in the plugin.
 * @param string $dst Drop-in path in wp-content.
 * @return string Result, see kits_error_pages_sync().
 */
function kits_error_page_sync_one( $src, $dst ) {
	$new = is_readable( $src ) ? (string) file_get_contents( $src ) : ''; // phpcs:ignore WordPress.WP.AlternativeFunctions
	if ( '' === $new || false === strpos( $new, kits_error_page_marker() ) ) {
		return 'no-source';
	}
	$exists = file_exists( $dst );
	if ( $exists ) {
		$old = is_readable( $dst ) ? (string) file_get_contents( $dst ) : ''; // phpcs:ignore WordPress.WP.AlternativeFunctions
		if ( $old === $new ) {
			return 'current';
		}
		if ( false === strpos( $old, kits_error_page_marker() ) ) {
			return 'foreign'; // another plugin's or a person's drop-in: leave it alone.
		}
	}
	$dir = dirname( $dst );
	if ( ! is_writable( $dir ) || ( $exists && ! is_writable( $dst ) ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions
		return 'unwritable';
	}
	// Write next to the target, then rename: a half-written drop-in must never be what WordPress loads.
	$tmp = $dir . '/.' . basename( $dst ) . '.' . wp_generate_password( 8, false ) . '.tmp';
	if ( strlen( $new ) !== @file_put_contents( $tmp, $new, LOCK_EX ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions, WordPress.PHP.NoSilencedErrors
		@unlink( $tmp ); // phpcs:ignore WordPress.WP.AlternativeFunctions, WordPress.PHP.NoSilencedErrors
		return 'unwritable';
	}
	if ( ! @rename( $tmp, $dst ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions, WordPress.PHP.NoSilencedErrors
		@unlink( $tmp ); // phpcs:ignore WordPress.WP.AlternativeFunctions, WordPress.PHP.NoSilencedErrors
		return 'unwritable';
	}
	@chmod( $dst, 0644 ); // phpcs:ignore WordPress.WP.AlternativeFunctions, WordPress.PHP.NoSilencedErrors
	if ( function_exists( 'opcache_invalidate' ) ) {
		@opcache_invalidate( $dst, true ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
	}
	return $exists ? 'updated' : 'installed';
}

// After a deploy: deploy-purge.php stores the new commit on the first web request that sees it.
add_action( 'add_option_aw_deployed_head', 'kits_error_pages_sync' );
add_action( 'update_option_aw_deployed_head', 'kits_error_pages_sync' );

// On admin screens (not Ajax or the heartbeat), at most once an hour: puts the pages back if one was deleted, and covers a first install.
add_action(
	'admin_init',
	function () {
		if ( wp_doing_ajax() || ! kits_error_pages_here() || get_transient( 'aw_error_pages_checked' ) ) {
			return;
		}
		set_transient( 'aw_error_pages_checked', 1, HOUR_IN_SECONDS );
		kits_error_pages_sync();
	}
);

// Tell administrators on the dashboard when a page could not be installed.
add_action(
	'admin_notices',
	function () {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'dashboard' !== $screen->id || ! current_user_can( 'manage_options' ) || ! kits_error_pages_here() ) {
			return;
		}
		$bad = array_keys( array_filter( (array) get_option( 'aw_error_pages', array() ), fn( $s ) => in_array( $s, array( 'unwritable', 'foreign', 'no-source' ), true ) ) );
		if ( $bad ) {
			wp_admin_notice( esc_html( 'The branded error pages are not installed (' . implode( ', ', $bad ) . '): WordPress shows its own pages instead. Check that wp-content is writable.' ), array( 'type' => 'warning' ) );
		}
	}
);
