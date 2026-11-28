<?php
/**
 * SourceWeb's Rules routes' callbacks (split from sourceweb-rest-pages.php, which registers the routes and lists them).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------- Rules ---------- */

/** Rules is one tab from the phase 3 migration; before it the routes refuse. */
function sourceweb_rules_ready() {
	return sourceweb_rules_live() ? true : new WP_Error( 'aw_rules_not_ready', __( 'Rules is not set up yet (the phase 3 migration).', 'sourceweb' ), array( 'status' => 409 ) );
}

/**
 * Term names for slugs in the stored order; a slug with no term shows as "slug (no such …)".
 *
 * @param array  $slugs Slugs.
 * @param string $tax   category or post_tag.
 */
function sourceweb_rules_names( array $slugs, string $tax ): array {
	$out = array();
	foreach ( $slugs as $slug ) {
		$t     = get_term_by( 'slug', (string) $slug, $tax );
		$out[] = $t ? $t->name : urldecode( (string) $slug ) . ( 'category' === $tax ? ' (no such category)' : ' (no such tag)' );
	}
	return $out;
}

/**
 * GET rules/sections: every section with its allowed categories and tags, workers file and summary rule, and the tag
 * rules with the sections that may give each tag.
 */
function sourceweb_rest_rules_sections() {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$secs  = (array) ( sourceweb_sources_config()['sections'] ?? array() );
	$sums  = sourceweb_rules_summary_by_type();
	$what  = array(
		'news'        => __( 'News items', 'sourceweb' ),
		'legal'       => __( 'Library items', 'sourceweb' ),
		'research'    => __( 'Research', 'sourceweb' ),
		'opportunity' => __( 'Opportunities', 'sourceweb' ),
		'press'       => __( 'Press coverage', 'sourceweb' ),
	);
	$rows  = array();
	foreach ( sourceweb_rules_sections() as $type => $def ) {
		$cats   = array_values( (array) ( $secs[ $type ]['categories'] ?? array() ) );
		$tags   = array_values( (array) ( $secs[ $type ]['tags'] ?? array() ) );
		$sum    = $sums[ $type ] ?? array();
		$rows[] = array(
			'id'         => $type,
			'title'      => $def['label'],
			'stored'     => array_key_exists( $type, $secs ),
			'categories' => $cats ? implode( ', ', sourceweb_rules_names( $cats, 'category' ) ) : __( 'Every category', 'sourceweb' ),
			'tags'       => $tags ? implode( ', ', sourceweb_rules_names( $tags, 'post_tag' ) ) : '—',
			'tagCount'   => count( $tags ),
			'worker'     => '' === $def['worker_type'] ? '—' : ( $what[ $def['worker_type'] ] ?? $def['worker_type'] ),
			'summary'    => $sum ? sprintf( '%d–%d words', (int) $sum['min_words'], (int) $sum['max_words'] ) . ( '' !== (string) ( $sum['inherit'] ?? '' ) ? ' (inherits News)' : '' ) : '—',
		);
	}
	$labs  = sourceweb_rules_section_labels();
	$rules = array();
	foreach ( sourceweb_rules_tag_rules() as $slug => $r ) {
		$slug = (string) $slug;
		$term = get_term_by( 'slug', $slug, 'post_tag' );
		if ( ! $term && 0 === strpos( $slug, 'campaign-' ) && taxonomy_exists( ( defined( 'KITS_CAMPAIGN_LINK' ) ? KITS_CAMPAIGN_LINK : '' ) ) ) {
			$term = get_term_by( 'slug', $slug, ( defined( 'KITS_CAMPAIGN_LINK' ) ? KITS_CAMPAIGN_LINK : '' ) );
		}
		$in = array();
		foreach ( $secs as $t => $sec ) {
			if ( in_array( $slug, array_map( 'strval', (array) ( $sec['tags'] ?? array() ) ), true ) ) {
				$in[] = $labs[ $t ] ?? $t;
			}
		}
		$rules[] = array(
			'id'       => $slug,
			'title'    => $term ? $term->name : urldecode( $slug ) . ' (no such tag)',
			'slug'     => urldecode( $slug ),
			'any'      => implode( ', ', (array) ( $r['any'] ?? array() ) ),
			'hold'     => array_values( array_map( 'strval', (array) ( $r['hold'] ?? array() ) ) ),
			'unless'   => implode( ', ', (array) ( $r['unless'] ?? array() ) ),
			'reason'   => (string) ( $r['hold_reason'] ?? '' ),
			'sections' => $in ? implode( ', ', $in ) : __( 'No section allows this tag yet', 'sourceweb' ),
		);
	}
	return rest_ensure_response(
		array(
			'sections' => $rows,
			'tagRules' => $rules,
		)
	);
}

/**
 * The terms of a taxonomy as choices (slug, name), and the ticked ones of a list.
 *
 * @param string $tax    category or post_tag.
 * @param array  $ticked Stored slugs.
 */
function sourceweb_rules_term_choices( string $tax, array $ticked ): array {
	$out = array();
	foreach ( get_terms(
		array(
			'taxonomy'   => $tax,
			'hide_empty' => false,
			'orderby'    => 'name',
		)
	) as $t ) {
		$out[] = array(
			'value' => $t->slug,
			'label' => $t->name,
		);
	}
	$gone = array();
	foreach ( $ticked as $slug ) {
		if ( ! get_term_by( 'slug', (string) $slug, $tax ) ) {
			$gone[] = (string) $slug;
		}
	}
	return array( $out, $gone );
}

/**
 * GET rules/section: one section's allowed categories and tags as checklists; a stored slug with no term is kept
 * (ticked) until unticked.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_section( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$type  = sanitize_key( (string) $request['type'] );
	$types = sourceweb_rules_section_labels();
	if ( ! isset( $types[ $type ] ) ) {
		return new WP_Error( 'rest_not_found', __( 'No such section.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$sec                 = (array) ( sourceweb_sources_config()['sections'][ $type ] ?? array() );
	$cat                 = array_values( array_map( 'strval', (array) ( $sec['categories'] ?? array() ) ) );
	$tag                 = array_values( array_map( 'strval', (array) ( $sec['tags'] ?? array() ) ) );
	list( $cats, $cgone ) = sourceweb_rules_term_choices( 'category', $cat );
	list( $tags, $tgone ) = sourceweb_rules_term_choices( 'post_tag', $tag );
	return rest_ensure_response(
		array(
			'type'       => $type,
			'label'      => $types[ $type ],
			'categories' => array_values( array_diff( $cat, $cgone ) ),
			'tags'       => array_values( array_diff( $tag, $tgone ) ),
			'gone'       => array(
				'categories' => $cgone,
				'tags'       => $tgone,
			),
			'choices'    => array(
				'categories' => $cats,
				'tags'       => $tags,
			),
		)
	);
}

/**
 * POST rules/section/save: the ticked slugs as term IDs, then today's save.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_section_save( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$type = sanitize_key( (string) $request['type'] );
	if ( ! isset( sourceweb_rules_sections()[ $type ] ) ) {
		return new WP_Error( 'rest_not_found', __( 'No such section.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$ids  = function ( array $slugs, string $tax ) {
		$out = array();
		foreach ( array_map( 'sanitize_title', $slugs ) as $slug ) {
			$t = get_term_by( 'slug', $slug, $tax );
			if ( $t ) {
				$out[] = (int) $t->term_id;
			}
		}
		return $out;
	};
	$gone = (array) $request['gone'];
	$done = sourceweb_sourcing_section_save(
		$type,
		array(
			'categories' => $ids( (array) $request['categories'], 'category' ),
			'tags'       => $ids( (array) $request['tags'], 'post_tag' ),
		),
		array(
			'categories' => array_map( 'sanitize_title', array_map( 'strval', (array) ( $gone['categories'] ?? array() ) ) ),
			'tags'       => array_map( 'sanitize_title', array_map( 'strval', (array) ( $gone['tags'] ?? array() ) ) ),
		)
	);
	$label = sourceweb_rules_section_labels()[ $type ];
	return rest_ensure_response(
		array(
			'done'    => $done,
			/* translators: %s: section. */
			'message' => 'saved' === $done ? sprintf( __( 'Saved the %s section. The workers use this from their next run.', 'sourceweb' ), $label ) : sprintf( __( 'Nothing changed for %s.', 'sourceweb' ), $label ), // phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment -- the comment above covers both
		)
	);
}

/**
 * GET rules/tag: one tag rule for its form ('' for Add New Rule), with the tags to choose from.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_tag( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$slug  = sanitize_title( (string) $request['tag'] );
	$rules = sourceweb_rules_tag_rules();
	if ( '' !== $slug && ! isset( $rules[ $slug ] ) ) {
		return new WP_Error( 'rest_not_found', __( 'No such tag rule.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$r     = '' === $slug ? array() : (array) $rules[ $slug ];
	$lines = fn( $k ) => implode( "\n", array_map( 'strval', (array) ( $r[ $k ] ?? array() ) ) );
	list( $tags ) = sourceweb_rules_term_choices( 'post_tag', array() );
	if ( '' !== $slug && ! in_array( $slug, array_column( $tags, 'value' ), true ) ) {
		$tags[] = array(
			'value' => $slug,
			'label' => urldecode( $slug ) . ' (no such tag)',
		);
	}
	return rest_ensure_response(
		array(
			'tag'         => $slug,
			'any'         => $lines( 'any' ),
			'hold'        => $lines( 'hold' ),
			'unless'      => $lines( 'unless' ),
			'hold_reason' => (string) ( $r['hold_reason'] ?? '' ),
			'choices'     => $tags,
		)
	);
}

/** Notice key => [tone, words] for a Rules save (as today's notices). */
function sourceweb_rules_message( string $done, string $for ): array {
	$msg = array(
		/* translators: %s: tag. */
		'tag_added'   => array( 'success', __( 'Tag rule %s added. The workers use it from their next run.', 'sourceweb' ) ),
		/* translators: %s: tag. */
		'tag_saved'   => array( 'success', __( 'Tag rule %s saved. The workers use it from their next run.', 'sourceweb' ) ),
		/* translators: %s: tag. */
		'tag_deleted' => array( 'success', __( 'Tag rule %s deleted.', 'sourceweb' ) ),
		/* translators: %s: tag. */
		'tag_exists'  => array( 'error', __( 'A tag rule for %s exists already: edit it instead.', 'sourceweb' ) ),
		'tag_empty'   => array( 'error', __( 'Choose a tag and give at least one phrase.', 'sourceweb' ) ),
		/* translators: %s: the patterns. */
		'tag_badre'   => array( 'error', __( 'Not saved: a hold pattern is not a valid regular expression (%s).', 'sourceweb' ) ),
		/* translators: %s: field. */
		'field_saved' => array( 'success', __( 'Field rule %s saved. The enrichment worker uses it from its next run.', 'sourceweb' ) ),
		/* translators: %s: the order. */
		'order_saved' => array( 'success', __( 'Trust order saved: %s.', 'sourceweb' ) ),
		/* translators: %s: what it is about. */
		'none'        => array( 'info', __( 'Nothing changed for %s.', 'sourceweb' ) ),
		/* translators: %s: field. */
		'nosuch'      => array( 'error', __( 'No such field: %s.', 'sourceweb' ) ),
	);
	$m = $msg[ $done ] ?? array( 'info', '%s' );
	return array( $m[0], sprintf( $m[1], $for ) );
}

/**
 * A Rules save's answer: 200 with the notice, or 400 for a refusal.
 *
 * @param array $res [notice key, what it is about].
 */
function sourceweb_rules_answer( array $res ) {
	list( $tone, $text ) = sourceweb_rules_message( $res[0], (string) $res[1] );
	if ( 'error' === $tone ) {
		return new WP_Error( 'aw_rules_' . $res[0], $text, array( 'status' => 400 ) );
	}
	return rest_ensure_response(
		array(
			'done'    => $res[0],
			'tone'    => $tone,
			'message' => $text,
		)
	);
}

/**
 * POST rules/tag/save: add or edit a tag rule.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_tag_save( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$in = array();
	foreach ( array( 'any', 'unless', 'hold_reason' ) as $k ) {
		$in[ $k ] = sanitize_textarea_field( (string) $request[ $k ] );
	}
	$in['hold'] = wp_check_invalid_utf8( (string) $request['hold'] ); // regular expressions: checked to compile (sourceweb_rules_tag_rule_clean), as today's form
	return sourceweb_rules_answer( sourceweb_rules_tag_save( sanitize_title( (string) $request['tag'] ), sanitize_title( (string) $request['original'] ), $in ) );
}

/**
 * POST rules/tag/delete: delete a tag rule.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_tag_delete( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$tag = sanitize_title( (string) $request['tag'] );
	$res = sourceweb_rules_tag_delete( $tag );
	return sourceweb_rules_answer( 'none' === $res[0] ? array( 'none', $tag ) : $res );
}

/** GET rules/enrich: the trust order and every field rule. */
function sourceweb_rest_rules_enrich() {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$order = sourceweb_enrich_field_rules()['priority'];
	$names = array_map( fn( $s ) => $s[0], sourceweb_enrich_sources() );
	$prio  = array();
	foreach ( $names as $k => $label ) {
		$pos    = array_search( $k, $order, true );
		$prio[] = array(
			'key'   => $k,
			'label' => $label,
			'pos'   => false === $pos ? '' : (string) ( $pos + 1 ),
		);
	}
	$fields = array();
	foreach ( sourceweb_rules_field_rows() as $k => $row ) {
		$r        = $row['rule'];
		$why      = (string) ( $row['why'] ?? '' );
		$fields[] = array(
			'id'       => $k,
			'set'      => ! empty( $row['set'] ),
			'title'    => $row['label'],
			'note'     => $row['set'] || isset( sourceweb_enrich_fields()[ $k ] ) ? '' : __( 'Added in the listing field group: off until its rule is set.', 'sourceweb' ),
			'group'    => $row['group'],
			'store'    => $row['store'] . ( $row['acf'] ? '' : ' (kept by code)' ),
			'on'       => '' !== $why ? 'Off: ' . $why : ( $r['on'] ? 'On' : 'Off' ),
			'sources'  => $r['sources'] ? implode( ', ', array_map( fn( $x ) => $names[ $x ] ?? $x, $r['sources'] ) ) : 'Any',
			'multi'    => $r['multi'] ? sprintf( 'Up to %d', (int) $r['multi'] ) : 'One',
			'official' => '' !== $r['official'] ? ( $names[ $r['official'] ] ?? $r['official'] ) : '—',
			'ai'       => $r['ai'] ? 'Yes' : '—',
			'invite'   => $r['invite'] ? 'Yes' : '—',
			'apply'    => ucfirst( (string) $r['apply'] ),
		);
	}
	return rest_ensure_response(
		array(
			'priority' => $prio,
			'fields'   => $fields,
		)
	);
}

/**
 * POST rules/priority: save the trust order.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_priority( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$pos = array();
	foreach ( (array) $request['pos'] as $k => $v ) {
		$pos[ sanitize_key( (string) $k ) ] = '' === trim( (string) $v ) ? '' : absint( $v );
	}
	return sourceweb_rules_answer( sourceweb_rules_priority_save( $pos ) );
}

/**
 * GET rules/field: one field's rule for its form, with the sources and the Apply choices it may have.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_field( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$field = sanitize_key( (string) $request['field'] );
	$rows  = sourceweb_rules_field_rows();
	if ( ! isset( $rows[ $field ] ) ) {
		return new WP_Error( 'rest_not_found', __( 'No such field.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$row     = $rows[ $field ];
	$sources = array();
	foreach ( sourceweb_enrich_sources() as $k => $s ) {
		$sources[] = array(
			'value' => $k,
			'label' => $s[0],
		);
	}
	$apply = array();
	foreach ( SOURCEWEB_ENRICH_APPLY as $k => $label ) {
		if ( ( 'both' === $k && ! in_array( $field, SOURCEWEB_ENRICH_TWO_FIELDS, true ) ) || ( 'review' !== $k && in_array( $field, SOURCEWEB_ENRICH_REVIEW_FIELDS, true ) ) ) {
			continue; // two values only where a field can hold them; closed and merge_into always to a person
		}
		$apply[] = array(
			'value' => $k,
			'label' => $label,
		);
	}
	return rest_ensure_response(
		array(
			'field'   => $field,
			'label'   => $row['label'],
			'group'   => $row['group'],
			'store'   => $row['store'],
			'why'     => (string) ( $row['why'] ?? '' ),
			'rule'    => array(
				'on'       => (bool) $row['rule']['on'],
				'sources'  => array_values( (array) $row['rule']['sources'] ),
				'multi'    => (int) $row['rule']['multi'],
				'official' => (string) $row['rule']['official'],
				'ai'       => (bool) $row['rule']['ai'],
				'invite'   => (bool) $row['rule']['invite'],
				'social'   => (bool) $row['rule']['social'],
				'apply'    => (string) $row['rule']['apply'],
			),
			'choices' => array(
				'sources' => $sources,
				'apply'   => $apply,
			),
		)
	);
}

/**
 * POST rules/field/save: save one field's rule.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_field_save( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$raw = (array) $request['rule'];
	$in  = array(
		'on'       => ! empty( $raw['on'] ),
		'ai'       => ! empty( $raw['ai'] ),
		'invite'   => ! empty( $raw['invite'] ),
		'social'   => ! empty( $raw['social'] ),
		'multi'    => absint( $raw['multi'] ?? 0 ),
		'official' => sanitize_key( (string) ( $raw['official'] ?? '' ) ),
		'sources'  => array_map( 'sanitize_key', array_map( 'strval', (array) ( $raw['sources'] ?? array() ) ) ),
		'apply'    => sanitize_key( (string) ( $raw['apply'] ?? '' ) ),
	);
	$res = sourceweb_rules_field_save( sanitize_key( (string) $request['field'] ), $in );
	if ( 'nosuch' === $res[0] ) {
		return new WP_Error( 'rest_not_found', __( 'No such field.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	return sourceweb_rules_answer( $res );
}

/** The Summary rules form's fields that are numbers, lists (one per line) and texts: key => label. */
function sourceweb_summary_fields(): array {
	return array(
		'numbers' => array(
			'lead_max_words'        => __( 'Lead sentence, about this many words or fewer', 'sourceweb' ),
			'max_quotes'            => __( 'Direct quotes per summary, at most', 'sourceweb' ),
			'max_quote_words'       => __( 'Words in a quote, at most', 'sourceweb' ),
			'max_copied_run'        => __( 'Words copied in a row outside a quote, at most', 'sourceweb' ),
			'description_max_chars' => __( 'Search description, characters', 'sourceweb' ),
		),
		'lists'   => array(
			'general'        => array( __( 'Rules', 'sourceweb' ), __( 'One rule per line. The facts-only, date, length, plain-text, no-AI-marker, English-only and searched-words rules are here.', 'sourceweb' ) ),
			'stock_phrases'  => array( __( 'Banned stock and praise wording', 'sourceweb' ), __( 'One per line. A summary using any of them is written again.', 'sourceweb' ) ),
			'ai_markers'     => array( __( 'AI markers', 'sourceweb' ), __( 'One per line. A summary containing any of them is written again.', 'sourceweb' ) ),
			'searched_terms' => array( __( 'Searched words', 'sourceweb' ), __( 'One group per line, words separated by |. When the source names one, the summary keeps one of the group.', 'sourceweb' ) ),
			'entities'       => array( __( 'Linkable entities: names', 'sourceweb' ), __( "One entity per line: the site's name first, then other spellings, separated by |. A summary using another spelling is written again.", 'sourceweb' ) ),
		),
		'texts'   => array(
			'description'   => __( 'Search description and summary', 'sourceweb' ),
			'card'          => __( 'Card excerpt', 'sourceweb' ),
			'merge'         => __( 'Same-story merges', 'sourceweb' ),
			'fallback'      => __( 'Short fallback', 'sourceweb' ),
			'entities_note' => __( 'Linkable entities: how summaries name things', 'sourceweb' ),
		),
	);
}

/** GET rules/summary: the rules as the form shows them, one row per section. */
function sourceweb_rest_rules_summary() {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$r     = sourceweb_summary_rules();
	$below = sourceweb_summary_below_counts();
	$secs  = array();
	foreach ( sourceweb_rules_summary_by_type() as $pt => $sec ) {
		$own    = isset( $sec['alias'] );
		$b      = $own ? ( $below[ $sec['alias'] ] ?? array( 0, 0 ) ) : null;
		$secs[] = array(
			'type'        => $pt,
			'label'       => $sec['label'],
			'own'         => $own,
			'inherit'     => ! $own && '' !== (string) ( $sec['inherit'] ?? '' ),
			'min_words'   => (int) $sec['min_words'],
			'max_words'   => (int) $sec['max_words'],
			'structure'   => (string) $sec['structure'],
			'attribution' => (string) $sec['attribution'],
			'below'       => $b ? sprintf( '%d of %d', (int) $b[0], (int) $b[1] ) : '—',
		);
	}
	$f      = sourceweb_summary_fields();
	$values = array();
	foreach ( array_keys( $f['numbers'] ) as $k ) {
		$values[ $k ] = (int) $r[ $k ];
	}
	foreach ( array_keys( $f['lists'] ) as $k ) {
		$values[ $k ] = implode( "\n", (array) $r[ $k ] );
	}
	foreach ( array_keys( $f['texts'] ) as $k ) {
		$values[ $k ] = (string) $r[ $k ];
	}
	return rest_ensure_response(
		array(
			'sections' => $secs,
			'values'   => $values,
			'fields'   => $f,
		)
	);
}

/**
 * POST rules/summary/save: the form's values through the form's own sanitizer (same log lines; a Save with no change
 * writes nothing; reset goes back to the defaults).
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_rules_summary_save( WP_REST_Request $request ) {
	$ready = sourceweb_rules_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	if ( ! function_exists( 'add_settings_error' ) ) {
		require_once ABSPATH . 'wp-admin/includes/template.php'; // The sanitizer adds the "Saved" notice.
	}
	$v  = (array) $request['values'];
	$in = array( '_aw_tab' => 'summary' );
	if ( ! empty( $v['_reset'] ) ) {
		$in['_reset'] = 1;
	}
	$f = sourceweb_summary_fields();
	foreach ( array_merge( array_keys( $f['numbers'] ), array_keys( $f['lists'] ), array_keys( $f['texts'] ) ) as $k ) {
		if ( isset( $v[ $k ] ) && is_scalar( $v[ $k ] ) ) {
			$in[ $k ] = (string) $v[ $k ];
		}
	}
	$in['sections'] = array();
	foreach ( (array) ( $v['sections'] ?? array() ) as $pt => $sec ) {
		if ( ! is_array( $sec ) ) {
			continue;
		}
		$one = array( 'shown' => 1 );
		foreach ( array( 'min_words', 'max_words', 'structure', 'attribution' ) as $k ) {
			if ( isset( $sec[ $k ] ) && is_scalar( $sec[ $k ] ) ) {
				$one[ $k ] = (string) $sec[ $k ];
			}
		}
		if ( ! empty( $sec['inherit'] ) ) {
			$one['inherit'] = 1;
		}
		$in['sections'][ sanitize_key( (string) $pt ) ] = $one;
	}
	$before = get_option( SOURCEWEB_SUMMARY_RULES_OPTION );
	$new    = sourceweb_summary_rules_sanitize( $in );
	$saved  = $new !== $before;
	if ( $saved ) {
		update_option( SOURCEWEB_SUMMARY_RULES_OPTION, $new, false );
	}
	return rest_ensure_response(
		array(
			'saved'   => $saved,
			'message' => $saved ? __( 'Saved. The workers use this from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ),
		)
	);
}
