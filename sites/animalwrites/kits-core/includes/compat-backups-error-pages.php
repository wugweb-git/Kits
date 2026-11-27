<?php
/**
 * Animal Writes site layer: the older aw_ names of the daily backup and error page functions (Animal Writes Core, before
 * 18 Nov 2026), as thin wrappers over the kits_ functions in Kits Core. Moved out of Kits Core 1.4.0 unchanged.
 *
 * @package animalwrites-kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * The old names (Animal Writes Core), kept as thin wrappers until nothing calls them.
 */
if ( ! function_exists( 'aw_backup_dir' ) ) {
	/** Old name of kits_daily_backup_dir(). */
	function aw_backup_dir() {
		return kits_daily_backup_dir();
	}
}
if ( ! function_exists( 'aw_run_backup' ) ) {
	/**
	 * Old name of kits_daily_backup_run().
	 *
	 * @return array What was written.
	 */
	function aw_run_backup() {
		return kits_daily_backup_run();
	}
}
if ( ! function_exists( 'aw_backup_site_check' ) ) {
	/** Old name of kits_daily_backup_site_check(). */
	function aw_backup_site_check() {
		kits_daily_backup_site_check();
	}
}
if ( ! function_exists( 'aw_backup_remote_last' ) ) {
	/**
	 * Old name of kits_backup_remote_last().
	 *
	 * @return int
	 */
	function aw_backup_remote_last() {
		return kits_backup_remote_last();
	}
}
if ( ! function_exists( 'aw_backup_problem' ) ) {
	/**
	 * Old name of kits_backup_problem().
	 *
	 * @param int|null $now Unix time (tests).
	 * @return string
	 */
	function aw_backup_problem( $now = null ) {
		return kits_backup_problem( $now );
	}
}

/*
 * The old names (Animal Writes Core), kept as thin wrappers until nothing calls them.
 */
if ( ! function_exists( 'aw_error_pages_sync' ) ) {
	/**
	 * Old name of kits_error_pages_sync().
	 *
	 * @return array<string,string>
	 */
	function aw_error_pages_sync() {
		return kits_error_pages_sync();
	}
}
if ( ! function_exists( 'aw_error_page_sync_one' ) ) {
	/**
	 * Old name of kits_error_page_sync_one().
	 *
	 * @param string $src Source file in the plugin.
	 * @param string $dst Drop-in path in wp-content.
	 * @return string
	 */
	function aw_error_page_sync_one( $src, $dst ) {
		return kits_error_page_sync_one( $src, $dst );
	}
}
