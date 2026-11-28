<?php
/**
 * Small helpers SourceWeb used from the site core plugin, now its own so it runs without Core (18 Nov 2026). The section
 * lists and the time span are copied with the same results; the meta rules are Core's while Core is active.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The days in order, Monday first (a listing's opening hours). */
const SOURCEWEB_WEEKDAYS = array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' );

/**
 * The types the same-story check compares: the news and library types of the site. Empty on a site with neither: the check then finds no story.
 *
 * @return string[]
 */
function sourceweb_same_story_types(): array {
	return sourceweb_types( array( 'news', 'library' ) );
}

/** The Library types, tag slug => name (a Library item's kind). */
const SOURCEWEB_LEGAL_KINDS = array(
	'act'              => 'Act',
	'rule'             => 'Rule',
	'order'            => 'Order',
	'judgment'         => 'Judgment',
	'circular'         => 'Circular',
	'notification'     => 'Notification',
	'template'         => 'Template',
	'advisory'         => 'Advisory',
	'official-release' => 'Official Release',
);

/** Scheduled tasks count as stopped after this long without a run (as in Kits Core's cron health). */
const SOURCEWEB_CRON_STALE = 30 * MINUTE_IN_SECONDS;

/**
 * Tag slugs a section uses (the sourcing lists, sourceweb_sources_config()).
 *
 * @param string $type Post type.
 * @return string[]
 */
function sourceweb_section_tags( $type ): array {
	$c = sourceweb_sources_config();
	return array_values( (array) ( $c['sections'][ $type ]['tags'] ?? array() ) );
}

/**
 * Category slugs a section uses (every category when the list is empty).
 *
 * @param string $type Post type.
 * @return string[]
 */
function sourceweb_section_categories( $type ): array {
	$c    = sourceweb_sources_config();
	$cats = array_values( (array) ( $c['sections'][ $type ]['categories'] ?? array() ) );
	return $cats ? $cats : (array) get_terms(
		array(
			'taxonomy'   => 'category',
			'hide_empty' => false,
			'fields'     => 'slugs',
		)
	);
}

/**
 * The content types SourceWeb fills: Core's list while Core is active, else the sections of the sourcing lists.
 *
 * @return string[]
 */
function sourceweb_post_types(): array {
	if ( function_exists( 'directoryweb_post_types' ) ) {
		return array_keys( directoryweb_post_types() );
	}
	return array_keys( (array) sourceweb_sources_config()['sections'] );
}

/**
 * An item's tags from one list ('' = the tags its section uses).
 *
 * @param int           $id    Post ID.
 * @param string[]|null $slugs Allowed slugs (null = the item's section).
 * @return WP_Term[]
 */
function sourceweb_item_tags( $id, $slugs = null ): array {
	if ( function_exists( 'directoryweb_item_tags' ) ) {
		return directoryweb_item_tags( $id, null === $slugs ? sourceweb_section_tags( (string) get_post_type( $id ) ) : (array) $slugs );
	}
	$terms = get_the_terms( $id, 'post_tag' );
	return is_array( $terms ) ? $terms : array();
}

/**
 * Clean a meta value the workers send: Core's rules while Core is active, DirectoryWeb's for listing keys, else a
 * date, address or plain text.
 *
 * @param mixed  $value Raw value.
 * @param string $key   Meta key.
 * @return mixed
 */
function sourceweb_sanitize_meta( $value, $key ) {
	if ( function_exists( 'aw_sanitize_meta' ) ) {
		return aw_sanitize_meta( $value, $key );
	}
	if ( function_exists( 'directoryweb_meta_schema' ) && isset( directoryweb_meta_schema()[ $key ] ) ) {
		return function_exists( 'directoryweb_sanitize_meta' ) ? directoryweb_sanitize_meta( $value, $key ) : sanitize_text_field( (string) $value );
	}
	if ( in_array( $key, array( 'aw_source_date', 'aw_deadline' ), true ) ) {
		return preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $value ) ? (string) $value : '';
	}
	if ( in_array( $key, array( 'aw_source_url', 'aw_website', 'aw_apply_url', 'aw_file_url' ), true ) ) {
		return esc_url_raw( (string) $value );
	}
	if ( 'aw_employment_type' === $key ) { // Google's JobPosting values only, as Core reads them
		$value = strtoupper( str_replace( array( '-', ' ' ), '_', trim( (string) $value ) ) );
		$value = (string) preg_replace( '/^(FULL|PART)_?TIME$/', '$1_TIME', $value );
		$value = array( 'CONTRACT' => 'CONTRACTOR', 'INTERNSHIP' => 'INTERN', 'TEMP' => 'TEMPORARY' )[ $value ] ?? $value;
		return in_array( $value, array( 'FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY', 'PER_DIEM', 'INTERN', 'VOLUNTEER', 'OTHER' ), true ) ? $value : '';
	}
	return sanitize_text_field( (string) $value );
}

/**
 * "2 h 05 min" / "12 min".
 *
 * @param int $s Seconds.
 * @return string
 */
function sourceweb_cron_span( $s ): string {
	$m = (int) round( $s / 60 );
	return $m >= 60 ? sprintf( '%d h %02d min', intdiv( $m, 60 ), $m % 60 ) : $m . ' min';
}

/**
 * A summary up to its last full sentence (owner, 20 Oct 2026): a tail cut off mid-sentence ("…of Kerala's Th") is
 * dropped, never cut mid-word. Only the first paragraph is checked (Library summaries carry a note on a line of their
 * own). Text without any full sentence is returned as it is.
 *
 * @param string $text Summary.
 * @return string
 */
function sourceweb_whole_sentences( $text ) {
	$lines = explode( "\n", trim( (string) $text ) );
	$first = trim( $lines[0] );
	if ( '' !== $first && ! preg_match( '/[.!?…]["\'”’)\]]*$/u', $first ) && preg_match_all( '/[.!?…]["\'”’)\]]*(?=\s|$)/u', $first, $m, PREG_OFFSET_CAPTURE ) ) {
		$last     = end( $m[0] );
		$lines[0] = substr( $first, 0, $last[1] + strlen( $last[0] ) );
	}
	return implode( "\n", $lines );
}
