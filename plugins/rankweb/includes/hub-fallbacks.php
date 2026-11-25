<?php
/**
 * Stand-ins for the directory and category title helpers a site may supply (a site that has its own hubs, places and
 * programmatic titles defines these functions before RankWeb loads; see sites/ in the source repository). Defined only
 * when nobody else did, and they answer "nothing to add", so a plain site gets WordPress's own titles.
 *
 * @package aw-seo-extras
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'aw_seo_term_title' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_term_title( $term ) {
		return '';
	}
}

if ( ! function_exists( 'aw_seo_tag_description' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_tag_description( $term ) {
		return '';
	}
}

if ( ! function_exists( 'aw_seo_category_description' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_category_description( $term ) {
		return '';
	}
}

if ( ! function_exists( 'aw_seo_dir_children' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_dir_children( $place, $key = '*' ) {
		return array();
	}
}

if ( ! function_exists( 'aw_seo_dir_count' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_dir_count( $place, $key = '*' ) {
		return 0;
	}
}

if ( ! function_exists( 'aw_seo_dir_breakdown' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_dir_breakdown( $place ) {
		return array();
	}
}

if ( ! function_exists( 'aw_seo_type_words' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_type_words( $key, $n = 2, $short = false ) {
		return (string) $key;
	}
}

if ( ! function_exists( 'aw_seo_has_numbers' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_has_numbers( $place ) {
		return false;
	}
}

if ( ! function_exists( 'aw_seo_dir_title' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_dir_title(  ) {
		return '';
	}
}

if ( ! function_exists( 'aw_seo_dir_description' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_dir_description(  ) {
		return '';
	}
}

if ( ! function_exists( 'aw_seo_category_counts' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_category_counts(  ) {
		return array();
	}
}

if ( ! function_exists( 'aw_seo_resources_count_label' ) ) {
	/**
	 * Nothing to add: a site with its own hubs defines this.
	 *
	 * @return mixed
	 */
	function aw_seo_resources_count_label(  ) {
		return '';
	}
}

if ( ! function_exists( 'aw_seo_sentence_case' ) ) {
	/**
	 * First letter upper case, the rest as given.
	 *
	 * @param string $text Text.
	 * @return string
	 */
	function aw_seo_sentence_case( $text ) {
		$text = (string) $text;
		return mb_strtoupper( mb_substr( $text, 0, 1 ) ) . mb_substr( $text, 1 );
	}
}

if ( ! function_exists( 'aw_seo_title_case' ) ) {
	/**
	 * Title Case for a short phrase.
	 *
	 * @param string $text Text.
	 * @return string
	 */
	function aw_seo_title_case( $text ) {
		return mb_convert_case( (string) $text, MB_CASE_TITLE, 'UTF-8' );
	}
}
