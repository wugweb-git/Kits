<?php
/**
 * Sourcing → Summary rules (owner, 15 Oct 2026): the one rule set for the summaries of News, the Library
 * and Resources research, kept in one place.
 *
 * - Option sourceweb_summary_rules: the owner's edits over the defaults (data/summary-rules-default.json, the same file as
 *   the workers' aw_workers/summary_rules.json). Lengths per section, structure, attribution, quotes, wording, the
 *   searched words, the linkable entities.
 * - GET aw/v1/summary-rules serves them to the workers, which build their prompts and checks from them (summarise.py,
 *   merge.py, fold_existing.py) and use the same defaults when the site cannot be reached.
 * - The site applies them too: auto-review holds a summary over its section's maximum, or not plain text
 *   (sourceweb_summary_problem); a summary below the minimum is never held (owner, 15 Oct 2026: the workers re-read the source
 *   and other coverage of the same story, and publish the best rule-following summary); the search description is the summary's lead (aw-seo-extras titles.php); an item's own page
 *   shows the whole summary; the entities a summary names are stored per item (aw_entities) for internal linking.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const AW_SUMMARY_RULES_OPTION = 'aw_summary_rules';

/** The defaults (the workers keep the same file). */
function sourceweb_summary_rules_defaults() {
	static $d = null;
	if ( null === $d ) {
		$d = json_decode( (string) file_get_contents( SOURCEWEB_SOURCING_DIR . 'data/summary-rules-default.json' ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		$d = is_array( $d ) ? $d : array( 'sections' => array() );
	}
	return $d;
}

/** The rules in force: the saved values over the defaults. */
function sourceweb_summary_rules() {
	$out   = sourceweb_summary_rules_defaults();
	$saved = get_option( AW_SUMMARY_RULES_OPTION );
	if ( ! is_array( $saved ) ) {
		return $out;
	}
	foreach ( $saved as $k => $v ) {
		if ( 'sections' === $k && is_array( $v ) ) {
			foreach ( $v as $name => $sec ) {
				// From the sourcing restructure's phase 3 the sections are stored by post type (the news and library types, post)
				// with their old name as alias (news, library, research): read by that name, so every reader sees the
				// same rules. A section of another post type (its own rule, or inherit) is read by aw-sourcing's Rules.
				$name = is_array( $sec ) && ! isset( $out['sections'][ $name ] ) ? (string) ( $sec['alias'] ?? '' ) : $name;
				if ( is_array( $sec ) && isset( $out['sections'][ $name ] ) ) {
					unset( $sec['alias'], $sec['inherit'] );
					$out['sections'][ $name ] = array_merge( $out['sections'][ $name ], array_filter( $sec, fn( $x ) => '' !== $x && array() !== $x ) );
				}
			}
		} elseif ( array_key_exists( $k, $out ) && gettype( $v ) === gettype( $out[ $k ] ) && '' !== $v && array() !== $v ) {
			$out[ $k ] = $v;
		}
	}
	foreach ( $out['sections'] as &$sec ) {
		$sec['min_words'] = min( (int) $sec['min_words'], (int) $sec['max_words'] );
	}
	return $out;
}

/** Which rules an item follows: news, library, research, or '' (no summary rules). */
function sourceweb_summary_section( $post ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return '';
	}
	if ( sourceweb_is_type( $post->post_type, 'news' ) ) {
		return 'news';
	}
	if ( sourceweb_is_type( $post->post_type, 'library' ) ) {
		return 'library';
	}
	if ( 'post' === $post->post_type && ( has_term( 'research', 'post_tag', $post ) || ( taxonomy_exists( 'aw_resource_type' ) && has_term( 'research', 'aw_resource_type', $post ) ) ) ) { // research is a tag since 15 Oct 2026
		return 'research';
	}
	return '';
}

/** Words as the workers count them. */
function sourceweb_summary_words( $text ) {
	return preg_match_all( "/[\\p{L}\\p{N}_'’-]+/u", (string) $text );
}

/**
 * Why a summary breaks the length or plain-text rules of its section, or ''.
 *
 * @param string $text     The summary.
 * @param string $section  news|library|research.
 * @param bool   $short_ok Below the minimum words is not a problem (auto-review: never held for it).
 * @return string
 */
function sourceweb_summary_problem( $text, $section, $short_ok = false ) {
	$rules = sourceweb_summary_rules();
	$sec   = $rules['sections'][ $section ] ?? null;
	$text  = trim( str_replace( '[Needs legal review]', '', (string) $text ) );
	if ( ! $sec ) {
		return '';
	}
	// No summary at all is never "short": an item without one is never published (owner, 18 Oct 2026, after two News
	// items went live empty on 16 Oct). The workers write it from the source or other coverage first.
	if ( '' === $text ) {
		return 'no summary';
	}
	if ( preg_match( '#<[a-z/][^>]*>|https?://|www\.|\[[^\]]+\]\([^)]+\)|\*\*|\n#i', $text ) ) {
		return 'summary is not plain text (link, HTML, markup or line break)';
	}
	$w = sourceweb_summary_words( $text );
	if ( $w < (int) $sec['min_words'] && ! $short_ok ) {
		return sprintf( 'summary below the minimum (%d words; %s needs %d)', $w, $sec['label'], (int) $sec['min_words'] );
	}
	if ( $w > (int) $sec['max_words'] ) {
		return sprintf( 'summary over the maximum (%d words; %s allows %d)', $w, $sec['label'], (int) $sec['max_words'] );
	}
	return ''; // length is words only; no sentence count (owner, 25 Oct 2026)
}

/**
 * The search description from a summary: its lead, or the first sentences that fit whole; only a lead longer than the
 * limit is cut at a word.
 *
 * @param string $text The summary.
 * @param int    $max  Characters (the rules' description_max_chars when 0).
 * @return string
 */
function sourceweb_summary_description( $text, $max = 0 ) {
	$max  = $max ? $max : (int) ( sourceweb_summary_rules()['description_max_chars'] ?? 155 );
	$text = trim( preg_replace( '/\s+/u', ' ', (string) $text ) );
	$out  = '';
	foreach ( preg_split( '/(?<=[.!?])\s+(?=["“‘(]?[A-Z0-9])/u', $text ) as $s ) {
		$next = '' === $out ? $s : $out . ' ' . $s;
		if ( mb_strlen( $next ) > $max ) {
			break;
		}
		$out = $next;
	}
	return '' !== $out ? $out : ( function_exists( 'rankweb_seo_cut' ) ? rankweb_seo_cut( $text, $max ) : mb_substr( $text, 0, $max ) );
}

/* ---------- Linkable entities (internal linking, Phase 7) ---------- */

/** Entity lines: [[canonical, alias, ...], ...]. */
function sourceweb_summary_entity_lines() {
	$out = array();
	foreach ( (array) ( sourceweb_summary_rules()['entities'] ?? array() ) as $line ) {
		$parts = array_values( array_filter( array_map( 'trim', explode( '|', (string) $line ) ) ) );
		if ( $parts ) {
			$out[] = $parts;
		}
	}
	return $out;
}

/** True when $text names $phrase as a whole phrase (an all-capitals alias must match its case). */
function sourceweb_summary_names( $text, $phrase ) {
	$flags = preg_match( '/^[A-Z0-9 ]+$/', $phrase ) ? 'u' : 'iu';
	return (bool) preg_match( '/(?<![\p{L}\p{N}-])' . str_replace( '\ ', '\s+', preg_quote( $phrase, '/' ) ) . '(?![\p{L}\p{N}-])/' . $flags, (string) $text );
}

/** A published page titled with an entity's name (Library first, then the Directory): [post type, ID] or null. */
function sourceweb_summary_entity_page( $name ) {
	global $wpdb;
	$in  = sourceweb_sql_in_types( 'post_type', sourceweb_types( array( 'library', 'listing' ) ) ); // 1=0 when the site has neither
	$row = $wpdb->get_row( $wpdb->prepare( "SELECT ID, post_type FROM {$wpdb->posts} WHERE post_status = 'publish' AND {$in} AND (post_title = %s OR post_title = %s OR post_title LIKE %s OR post_title LIKE %s OR post_title LIKE %s) ORDER BY post_type = %s DESC, LENGTH(post_title) ASC LIMIT 1", $name, 'The ' . $name, $wpdb->esc_like( $name ) . ' (%', 'The ' . $wpdb->esc_like( $name ) . ' (%', '% - ' . $wpdb->esc_like( $name ), sourceweb_type( 'library' ) ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- the SQL is built from the plugin's own fixed lists (types escaped by esc_sql()), never request data; a one-off admin/cron read
	return $row ? array( $row->post_type, (int) $row->ID ) : null;
}

/**
 * The linkable entities a summary names: laws (Library), organisations and bodies (Directory), places (LGD codes),
 * and named entities with no page yet.
 *
 * @param string $text The summary.
 * @return array
 */
function sourceweb_summary_entities( $text ) {
	$out = array( 'laws' => array(), 'organisations' => array(), 'places' => array(), 'other' => array() );
	foreach ( sourceweb_summary_entity_lines() as $parts ) {
		$hit = false;
		foreach ( $parts as $p ) {
			$hit = $hit || sourceweb_summary_names( $text, $p );
		}
		if ( ! $hit ) {
			continue;
		}
		$page = sourceweb_summary_entity_page( $parts[0] );
		if ( ! $page ) {
			$out['other'][] = array( 'name' => $parts[0] );
		} else {
			$out[ sourceweb_is_type( $page[0], 'library' ) ? 'laws' : 'organisations' ][] = array( 'name' => $parts[0], 'id' => $page[1] );
		}
	}
	if ( function_exists( 'directoryweb_lgd' ) ) {
		$lgd    = directoryweb_lgd();
		$states = array();
		foreach ( $lgd['states'] as $s ) {
			if ( sourceweb_summary_names( $text, $s->name ) ) {
				$states[ $s->code ]  = true;
				$out['places'][]     = array( 'name' => $s->name, 'state' => $s->code, 'district' => 0 );
			}
		}
		$seen = array();
		foreach ( $lgd['districts'] as $d ) {
			if ( strlen( $d->name ) > 3 && preg_match( '/^\p{Lu}/u', $d->name ) && preg_match( '/(?<![\p{L}-])' . preg_quote( $d->name, '/' ) . '(?![\p{L}-])/u', (string) $text ) ) {
				$seen[ $d->name ][] = $d;
			}
		}
		foreach ( $seen as $name => $hits ) {
			$in = array_values( array_filter( $hits, fn( $d ) => isset( $states[ $d->state ] ) ) );
			$d  = 1 === count( $hits ) ? $hits[0] : ( 1 === count( $in ) ? $in[0] : null ); // a name in two states: only with its state named
			if ( $d ) {
				$out['places'][] = array( 'name' => $d->name, 'state' => $d->state, 'district' => $d->code );
			}
		}
	}
	return $out;
}

/** Store the entities an item's summary names (meta aw_entities, JSON). */
function sourceweb_summary_store_entities( $post_id ) {
	if ( ! sourceweb_is_any_type( get_post_type( $post_id ), array( 'news', 'library' ) ) && 'post' !== get_post_type( $post_id ) ) {
		return;
	}
	$found = sourceweb_summary_entities( wp_strip_all_tags( (string) get_post_field( 'post_excerpt', $post_id, 'raw' ) ) );
	update_post_meta( $post_id, 'aw_entities', wp_slash( wp_json_encode( $found ) ) );
}

add_action(
	'wp_after_insert_post',
	function ( $post_id, $post ) {
		if ( ( 'post' === $post->post_type || sourceweb_is_any_type( $post->post_type, array( 'news', 'library' ) ) ) && 'trash' !== $post->post_status && ! wp_is_post_revision( $post_id ) ) {
			sourceweb_summary_store_entities( $post_id );
		}
	},
	20,
	2
);

/* ---------- Workers ---------- */
