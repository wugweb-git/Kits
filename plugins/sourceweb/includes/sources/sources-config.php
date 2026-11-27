<?php
/**
 * The sourcing lists (option aw_sources, seeded once from data/sources-seed.json). SourceWeb's tabs edit them; the site
 * reads the section categories and tags (Animal Writes Core's tags.php, DirectoryWeb's listing types). Moved from
 * Kits Core on 18 Nov 2026 with the same option and seed.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The lists (seeded once from data/sources-seed.json). */
function sourceweb_sources_config() {
	$c = get_option( 'aw_sources' );
	if ( ! is_array( $c ) && ! sourceweb_animal_writes_context() ) {
		// The starter list is Animal Writes' (animal-welfare sources and keywords): a generic site starts empty, and
		// nothing is stored, so switching the Animal Writes extras on later still seeds it.
		$c = array( 'defaults' => array(), 'keywords' => array(), 'sources' => array(), 'live' => false );
	} elseif ( ! is_array( $c ) ) {
		$c         = json_decode( (string) file_get_contents( SOURCEWEB_SOURCING_DIR . 'data/sources-seed.json' ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		$c['live'] = false; // the owner switches the workers over after checking
		update_option( 'aw_sources', $c, false );
	}
	$c['categories'] = (array) ( $c['categories'] ?? array() );
	$c['sections']   = (array) ( $c['sections'] ?? array() );
	return $c;
}

