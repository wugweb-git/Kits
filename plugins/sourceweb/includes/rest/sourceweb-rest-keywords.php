<?php
/**
 * SourceWeb's Keywords and search suggestions routes' callbacks (split from sourceweb-rest-pages.php, which registers the routes and lists them).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------- Keywords ---------- */

/** Keywords is on the keyword table (phase 2 and later); before that the routes refuse. */
function sourceweb_keywords_ready() {
	return sourceweb_sourcing_kw_on() ? true : new WP_Error( 'aw_kw_not_ready', __( 'The keyword table is not ready yet.', 'sourceweb' ), array( 'status' => 409 ) );
}

/** Category slug => name. */
function sourceweb_keyword_categories(): array {
	$out = array();
	foreach ( get_terms(
		array(
			'taxonomy'   => 'category',
			'hide_empty' => false,
		)
	) as $t ) {
		$out[ $t->slug ] = $t->name;
	}
	return $out;
}

/** The two switches and the Press settings, as the forms show them. */
function sourceweb_keyword_settings(): array {
	$r = sourceweb_relevance();
	$p = (array) ( sourceweb_sources_config()['press'] ?? array() );
	return array(
		'enabled'          => ! empty( $r['enabled'] ),
		'gnews_allow_only' => ! empty( $r['gnews_allow_only'] ),
		'press'            => array(
			'enabled'    => ! empty( $p['enabled'] ),
			'every_days' => (int) ( $p['every_days'] ?? 7 ),
		),
	);
}

/**
 * A keyword record as a list row.
 *
 * @param array $r    Record from sourceweb_sourcing_kw_records().
 * @param array $cats Category slug => name.
 */
function sourceweb_keyword_row( array $r, array $cats ): array {
	$search = $r['searches'] ? 'On: ' . implode( ', ', array_map( fn( $x ) => $x['feed'], $r['searches'] ) ) : ( ( $r['roles'] & ( SOURCEWEB_KW_ROLE_INCLUDE | SOURCEWEB_KW_ROLE_SEARCH ) ) && ! $r['search_on'] ? 'Off' : '—' );
	return array(
		'id'         => (int) $r['id'],
		'title'      => (string) $r['label'],
		'lang'       => (string) $r['lang'],
		'langLabel'  => 'en' === $r['lang'] ? '' : ( 'hi' === $r['lang'] ? 'Hindi' : 'Hinglish' ),
		'spellings'  => $r['variants'] ? implode( ', ', $r['variants'] ) : '—',
		'spell'      => implode( ' ', insightweb_kw_spellings( $r ) ),
		'roles'      => (int) ( $r['roles'] & SOURCEWEB_KW_WORKER_ROLES ),
		'rolesText'  => implode( ', ', sourceweb_sourcing_kw_role_names( $r['roles'] ) ),
		'categories' => array_map(
			fn( $slug ) => array(
				'slug' => $slug,
				'name' => $cats[ $slug ] ?? $slug,
			),
			array_values( (array) $r['categories'] )
		),
		'search'     => $search,
		'items'      => $r['searches'] ? number_format_i18n( $r['items'][0] ) . ' fetched · ' . number_format_i18n( $r['items'][1] ) . ' published' : '—',
		'itemsN'     => (int) $r['items'][0],
		'impr'       => (int) $r['impr28'],
	);
}

/**
 * GET keywords: one page of the Keywords list (A to Z unless sorted), the role, category and section choices, the
 * switches and the Press settings.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_keywords( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$cats = sourceweb_keyword_categories();
	$cat  = sanitize_title( (string) $request['cat'] );
	$cat  = isset( $cats[ $cat ] ) ? $cat : '';
	$recs = array_values( sourceweb_sourcing_kw_records() );
	if ( '' !== $cat ) {
		$recs = array_values( array_filter( $recs, fn( $r ) => in_array( $cat, (array) $r['categories'], true ) ) );
	}
	usort( $recs, fn( $a, $b ) => strcasecmp( $a['label'], $b['label'] ) );
	$rows  = array_map( fn( $r ) => sourceweb_keyword_row( $r, $cats ) + array( '_r' => $r ), $recs );
	$views = array( '' => array( __( 'All', 'sourceweb' ), fn( $x ) => sourceweb_sourcing_kw_in_view( $x['_r'], '' ) ) );
	foreach ( sourceweb_sourcing_kw_views() as $k => $v ) {
		$views[ $k ] = array( $v[0], fn( $x ) => sourceweb_sourcing_kw_in_view( $x['_r'], $k ) );
	}
	$out         = sourceweb_list(
		$rows,
		$request->get_params(),
		array(
			'views' => $views,
			'text'  => fn( $x ) => $x['spell'],
			'sort'  => array(
				'title' => fn( $x ) => strtolower( $x['title'] ),
				'items' => fn( $x ) => $x['itemsN'],
				'impr'  => fn( $x ) => $x['impr'],
			),
			'per'   => 100,
		)
	);
	$out['rows'] = array_map(
		function ( $x ) {
			unset( $x['_r'], $x['spell'] );
			return $x;
		},
		$out['rows']
	);
	$roles       = array();
	foreach ( sourceweb_sourcing_kw_roles() as $bit => $l ) {
		$roles[] = array(
			'value' => (int) $bit,
			'label' => $l,
			'help'  => sourceweb_sourcing_kw_role_help()[ $bit ],
		);
	}
	$out['roles']      = $roles;
	$out['include']    = SOURCEWEB_KW_ROLE_INCLUDE;
	$out['exclude']    = SOURCEWEB_KW_ROLE_EXCLUDE; // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- needed here and bounded; see the surrounding code.
	$out['categories'] = array_map(
		fn( $slug, $name ) => array(
			'value' => $slug,
			'label' => $name,
		),
		array_keys( $cats ),
		$cats
	);
	$out['cat']        = $cat;
	$out['settings']   = sourceweb_keyword_settings();
	return rest_ensure_response( $out );
}

/**
 * GET keywords/one: one keyword for its form, or a blank one (id 0).
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_keyword( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$choices = array(
		'roles'      => array(),
		'categories' => array(),
		'sections'   => array(),
	);
	foreach ( sourceweb_sourcing_kw_roles() as $bit => $l ) {
		$choices['roles'][] = array(
			'value' => (int) $bit,
			'label' => $l,
			'help'  => sourceweb_sourcing_kw_role_help()[ $bit ],
		);
	}
	foreach ( sourceweb_keyword_categories() as $slug => $name ) {
		$choices['categories'][] = array(
			'value' => $slug,
			'label' => $name,
		);
	}
	foreach ( sourceweb_sourcing_kw_sections() as $t => $l ) {
		$choices['sections'][] = array(
			'value' => $t,
			'label' => $l,
		);
	}
	$id = absint( $request['id'] );
	if ( ! $id ) {
		return rest_ensure_response(
			array(
				'id'       => 0,
				'label'    => '',
				'variants' => '',
				'roles'    => array(),
				'cats'     => array(),
				'sections' => array(),
				'lang'     => 'en',
				'choices'  => $choices,
			)
		);
	}
	$r = insightweb_kw_get( $id );
	if ( ! $r ) {
		return new WP_Error( 'rest_not_found', __( 'No such keyword.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$other    = array_values( array_filter( array_map( fn( $b, $l ) => ( $r['roles'] & $b ) && ! isset( sourceweb_sourcing_kw_roles()[ $b ] ) ? $l : '', array_keys( insightweb_si_roles() ), insightweb_si_roles() ) ) );
	$searches = sourceweb_kw_searches( $r, array_column( array_filter( (array) sourceweb_sources_config()['sources'], 'is_array' ), null, 'id' ) );
	return rest_ensure_response(
		array(
			'id'         => (int) $r['id'],
			'label'      => (string) $r['label'],
			'norm'       => (string) $r['norm'],
			'variants'   => implode( "\n", $r['variants'] ),
			'roles'      => array_values( array_filter( array_keys( sourceweb_sourcing_kw_roles() ), fn( $b ) => (bool) ( $r['roles'] & $b ) ) ),
			'otherRoles' => $other ? implode( ', ', $other ) : __( 'none', 'sourceweb' ),
			'cats'       => array_values( (array) $r['categories'] ),
			'sections'   => array_values( (array) $r['sections'] ),
			'lang'       => (string) $r['lang'],
			'search_on'  => (bool) $r['search_on'],
			'searches'   => $searches ? implode( ', ', array_map( fn( $x ) => $x['feed'], $searches ) ) : __( 'none', 'sourceweb' ),
			'query'      => (string) $r['query'],
			'feedId'     => '' !== (string) $r['feed_id'] ? (string) $r['feed_id'] : __( '(made from the query)', 'sourceweb' ),
			'choices'    => $choices,
		)
	);
}

/**
 * POST keywords/save: add a keyword, save one, or delete it from sourcing (its Sourcing and Press roles go; Search
 * Insights keeps the record), as today's forms.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_keyword_save( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$id   = absint( $request['id'] );
	$cats = sourceweb_keyword_categories();
	$set  = array(
		'roles'      => sourceweb_sourcing_kw_bits( array_map( 'absint', (array) $request['roles'] ) ),
		'variants'   => sanitize_textarea_field( (string) $request['variants'] ),
		'categories' => array_values( array_intersect( array_map( 'sanitize_title', (array) $request['categories'] ), array_keys( $cats ) ) ),
		'sections'   => array_values( array_intersect( array_map( 'sanitize_key', (array) $request['sections'] ), array_keys( sourceweb_sourcing_kw_sections() ) ) ),
	);
	$lang = (string) $request['lang'];
	if ( ! $id ) {
		if ( ! $set['roles'] ) {
			return new WP_Error( 'aw_kw_roles', __( 'Choose at least one role.', 'sourceweb' ), array( 'status' => 400 ) );
		}
		$label = sanitize_text_field( (string) $request['label'] );
		$r     = sourceweb_sourcing_kw_add( $label, $set + array( 'lang' => $lang ) );
		if ( is_wp_error( $r ) ) {
			$there = insightweb_kw_id_by_norm( insightweb_si_norm( $label ) );
			return new WP_Error( $r->get_error_code(), $r->get_error_message(), array( 'status' => 400, 'id' => (int) $there ) );
		}
		return rest_ensure_response(
			array(
				'done'    => 'added',
				'id'      => (int) $r,
				'message' => __( 'Keyword saved. The workers use it from their next run.', 'sourceweb' ),
			)
		);
	}
	if ( ! insightweb_kw_get( $id ) ) {
		return new WP_Error( 'rest_not_found', __( 'No such keyword.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$delete = (bool) $request['delete'];
	if ( $delete ) {
		$set = array( 'roles' => 0 );
	} else {
		$q                = trim( (string) $request['query'] );
		$q                = (string) preg_replace_callback( '#^(https?)://#i', fn( $m ) => strtolower( $m[1] ) . '://', $q );
		$set['query']     = preg_match( '#^https?://#i', $q ) ? esc_url_raw( $q ) : sanitize_text_field( $q ); // an address keeps its %XX
		$set['search_on'] = $request['search_on'] ? 1 : 0;
		$set['lang']      = $lang;
	}
	$r = sourceweb_sourcing_kw_apply( $id, $set );
	if ( is_wp_error( $r ) ) {
		return new WP_Error( $r->get_error_code(), $r->get_error_message(), array( 'status' => 400 ) );
	}
	$done = ! $r ? 'none' : ( $delete ? 'deleted' : 'saved' );
	$msg  = array(
		'none'    => __( 'Nothing changed.', 'sourceweb' ),
		'saved'   => __( 'Keyword updated. The workers use it from their next run.', 'sourceweb' ),
		'deleted' => __( 'Keyword deleted from sourcing (its Sourcing and Press roles were removed; Search Insights keeps the record).', 'sourceweb' ),
	);
	return rest_ensure_response(
		array(
			'done'    => $done,
			'id'      => $id,
			'message' => $msg[ $done ],
		)
	);
}

/**
 * POST keywords/decide: a row or bulk action, as today's list.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_keywords_decide( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	list( $n, $errs ) = sourceweb_sourcing_kw_bulk( (string) $request['op'], array_map( 'absint', (array) $request['ids'] ) );
	return rest_ensure_response(
		array(
			'changed' => $n,
			'errors'  => $errs,
			'message' => $n ? __( 'Keywords changed. The workers use them from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ),
		)
	);
}

/**
 * GET keywords/test: whether a headline is kept, and why.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_keywords_test( WP_REST_Request $request ) {
	$text = sanitize_text_field( (string) $request['text'] );
	if ( '' === $text ) {
		return new WP_Error( 'rest_invalid_param', __( 'Paste a headline.', 'sourceweb' ), array( 'status' => 400 ) );
	}
	$v = sourceweb_relevance_verdict( $text );
	return rest_ensure_response(
		array(
			'kept' => (bool) $v[0],
			'why'  => (string) $v[1],
		)
	);
}

/**
 * POST keywords/settings: the two switches and the Press settings, through the Settings API forms' own sanitizers
 * (same log lines; a Save with no change writes nothing).
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_keywords_settings( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	if ( ! function_exists( 'add_settings_error' ) ) {
		require_once ABSPATH . 'wp-admin/includes/template.php'; // The sanitizers add the "Saved" notice.
	}
	$before = sourceweb_keyword_settings();
	$rel    = sourceweb_relevance_switches_sanitize(
		array(
			'_aw_tab'          => 'keywords',
			'enabled'          => (bool) $request['enabled'],
			'gnews_allow_only' => (bool) $request['gnews_allow_only'],
		)
	);
	if ( is_array( $rel ) && $rel !== get_option( SOURCEWEB_REL_OPTION ) ) {
		update_option( SOURCEWEB_REL_OPTION, $rel );
	}
	$press = (array) $request['press'];
	if ( $press ) {
		$c = sourceweb_sources_sanitize(
			array(
				'_aw_tab'    => 'press',
				'enabled'    => ! empty( $press['enabled'] ),
				'every_days' => absint( $press['every_days'] ?? 0 ),
			)
		);
		if ( is_array( $c ) && $c !== get_option( 'aw_sources' ) ) {
			update_option( 'aw_sources', $c );
		}
	}
	$after = sourceweb_keyword_settings();
	return rest_ensure_response(
		array(
			'saved'    => $after !== $before,
			'message'  => $after !== $before ? __( 'Saved. The workers use this from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ),
			'settings' => $after,
		)
	);
}

/**
 * GET keywords/suggestions: searches people made (20 impressions in 28 days) that no keyword covers, most
 * impressions first; the Dismissed view holds the ones set aside.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_suggestions( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$all = sourceweb_sourcing_suggestions();
	if ( null === $all ) {
		return rest_ensure_response(
			array(
				'none'  => true,
				'rows'  => array(),
				'total' => 0,
				'page'  => 1,
				'pages' => 1,
				'view'  => '',
				'views' => array(),
			)
		);
	}
	$rows = array();
	foreach ( $all as $t ) {
		$rows[] = array(
			'id'        => $t['q'],
			'title'     => $t['q'],
			'impr'      => (int) $t['impr'],
			'clicks'    => (int) $t['clicks'],
			'pos'       => round( (float) $t['pos'], 1 ),
			'rising'    => (bool) $t['rising'],
			'dismissed' => (bool) $t['dismissed'],
			'pushed'    => ! empty( $t['pushed'] ),
			'score'     => (int) ( $t['score'] ?? 0 ),
			'type'      => (string) ( $t['recommended_type'] ?? '' ),
			'topic'     => (string) ( $t['topic'] ?? '' ),
			'proven'    => ! empty( $t['focus_keyphrase'] ),
			'rank'      => (int) ( $t['rank'] ?? 0 ),
			'source'    => (string) ( $t['source'] ?? '' ),
		);
	}
	// Default order: proven focus keyphrases first, then by InsightWeb Score, then impressions (owner, 17 Nov 2026).
	usort(
		$rows,
		fn( $a, $b ) => ( (int) $b['proven'] <=> (int) $a['proven'] ) ?: ( $b['score'] <=> $a['score'] ) ?: ( $b['impr'] <=> $a['impr'] ) ?: strcmp( $a['id'], $b['id'] )
	);
	$out         = sourceweb_list(
		$rows,
		$request->get_params(),
		array(
			'views' => array(
				''          => array( __( 'Suggested', 'sourceweb' ), fn( $r ) => ! $r['dismissed'] ),
				'dismissed' => array( __( 'Dismissed', 'sourceweb' ), fn( $r ) => $r['dismissed'] ),
			),
			'text'  => fn( $r ) => $r['id'] . ' ' . $r['topic'],
			'sort'  => array(
				'title'  => fn( $r ) => $r['id'],
				'impr'   => fn( $r ) => $r['impr'],
				'clicks' => fn( $r ) => $r['clicks'],
				'pos'    => fn( $r ) => $r['pos'],
				'score'  => fn( $r ) => $r['score'],
			),
			'per'   => 50,
		)
	);
	$out['none']        = false;
	$out['autoapprove'] = function_exists( 'sourceweb_sourcing_push_autoapprove' ) ? sourceweb_sourcing_push_autoapprove() : null;
	return rest_ensure_response( $out );
}

/**
 * POST keywords/suggestions/decide: add as Include, Exclude or Search, dismiss, or show again.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_suggestions_decide( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	$n = sourceweb_sourcing_suggest_apply( (string) $request['op'], array_map( 'sanitize_text_field', (array) $request['qs'] ) );
	return rest_ensure_response(
		array(
			'changed' => $n,
			/* translators: %d: number of searches. */
			'message' => $n ? sprintf( _n( '%d search changed.', '%d searches changed.', $n, 'sourceweb' ), $n ) : __( 'Nothing changed.', 'sourceweb' ),
		)
	);
}

/**
 * POST keywords/suggestions/autoapprove: save the two auto-approve rules for pushed keywords (both off by default).
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_suggestions_autoapprove( WP_REST_Request $request ) {
	$ready = sourceweb_keywords_ready();
	if ( is_wp_error( $ready ) ) {
		return $ready;
	}
	if ( ! function_exists( 'sourceweb_sourcing_push_autoapprove_save' ) ) {
		return new WP_Error( 'aw_push_not_ready', __( 'Pushed keywords are not set up yet.', 'sourceweb' ), array( 'status' => 409 ) );
	}
	$saved = sourceweb_sourcing_push_autoapprove_save(
		array(
			'on_score'    => (bool) $request['on_score'],
			'min_score'   => (int) $request['min_score'],
			'types'       => array_map( 'sanitize_key', (array) $request['types'] ),
			'on_proven'   => (bool) $request['on_proven'],
			'proven_rank' => (int) $request['proven_rank'],
		)
	);
	return rest_ensure_response(
		array(
			'autoapprove' => $saved,
			'message'     => __( 'Auto-approve rules saved.', 'sourceweb' ),
		)
	);
}
