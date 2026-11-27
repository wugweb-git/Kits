<?php
/**
 * The sourcing lists (option aw_sources, empty until a site supplies a starter list). SourceWeb's tabs edit them; the site
 * reads the section categories and tags (the site's own tags code, DirectoryWeb's listing types). Moved from
 * Kits Core on 18 Nov 2026 with the same option.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The lists. A site starts empty. The filter `sourceweb_starter_sources` lets a site (or a site layer) supply a starter
 * list, an array in the same shape as the option (defaults, keywords, sources, categories, press); it is stored once,
 * with the workers switched off ('live' false) for the owner to turn on after checking.
 */
function sourceweb_sources_config() {
	$c = get_option( 'aw_sources' );
	if ( ! is_array( $c ) ) {
		$starter = apply_filters( 'sourceweb_starter_sources', array() );
		if ( is_array( $starter ) && ! empty( $starter['sources'] ) ) {
			$c         = $starter;
			$c['live'] = false; // the owner switches the workers over after checking
			update_option( 'aw_sources', $c, false );
		} else {
			// Nothing is stored, so a starter list supplied later still seeds it.
			$c = array( 'defaults' => array(), 'keywords' => array(), 'sources' => array(), 'live' => false );
		}
	}
	$c['categories'] = (array) ( $c['categories'] ?? array() );
	$c['sections']   = (array) ( $c['sections'] ?? array() );
	return $c;
}

