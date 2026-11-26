<?php
/**
 * SourceWeb's routes for the Sources, Keywords, Rules, AI models, Workers, report and Settings screens, under
 * sourceweb/v1. Each calls the plugin's own save functions, so every save is checked and logged the same way.
 * Administrators only (manage_options):
 *
 *   GET  workers                 the Workers list (view, search, orderby, order, page), the Run now log
 *   GET  workers/<id>            one worker for its form ('new' for Add New Worker), with the keys it may use
 *   GET  workers/<id>/runs       the runs the workflow reported, newest first
 *   POST workers/save            save a worker (sourceweb_worker_save())
 *   POST workers/delete          delete a Planned worker (sourceweb_worker_delete())
 *   POST workers/run             Run now (sourceweb_workers_run_now())
 *   GET  sources                 the Sources list (view, search, orderby, order, page)
 *   POST sources/decide          a list action on hosts (sourceweb_sourcing_sources_apply())
 *   POST sources/short           short names for card chips (sourceweb_sourcing_shorts_apply())
 *   GET  sources/one             one source for its form (host; '' for Add New Source), with its feeds
 *   POST sources/save            save the source form (sourceweb_sourcing_source_save())
 *   GET  sources/feeds           every feed (type, state, search, page), or one site's (host)
 *   POST sources/feeds/decide    on, off, keyword check on/off, delete (sourceweb_sources_feed_op())
 *   GET  keywords                the Keywords list (view, cat, search, orderby, order, page), the two switches, Press settings
 *   GET  keywords/one            one keyword for its form (id; 0 for Add New Keyword)
 *   POST keywords/save           add (sourceweb_sourcing_kw_add()), edit or delete from sourcing (sourceweb_sourcing_kw_apply())
 *   POST keywords/decide         a row or bulk action on ids (sourceweb_sourcing_kw_bulk())
 *   GET  keywords/test           Test a headline (sourceweb_relevance_verdict())
 *   POST keywords/settings       relevance filter, aggregator feeds, Press discovery (the Settings API forms' own sanitizers)
 *   GET  keywords/suggestions    searches from Search Insights no keyword covers (sourceweb_sourcing_suggestions())
 *   POST keywords/suggestions/decide  include, exclude, search, dismiss, restore (sourceweb_sourcing_suggest_apply())
 *   GET  rules/sections          Section rules: the sections and the tag rules
 *   GET  rules/section           one section's allowed categories and tags (type)
 *   POST rules/section/save      save them (sourceweb_sourcing_section_save())
 *   GET  rules/tag               one tag rule for its form (tag; '' for Add New Rule), with the tags to choose from
 *   POST rules/tag/save          add or edit a tag rule (sourceweb_rules_tag_save())
 *   POST rules/tag/delete        delete a tag rule (sourceweb_rules_tag_delete())
 *   GET  rules/enrich            Directory enrichment: the trust order and the field rules
 *   POST rules/priority          save the trust order (sourceweb_rules_priority_save())
 *   GET  rules/field             one field's rule for its form (field)
 *   POST rules/field/save        save it (sourceweb_rules_field_save())
 *   GET  rules/summary           Summary rules, as the form shows them
 *   POST rules/summary/save      save them through the form's sanitizer (sourceweb_summary_rules_sanitize())
 *
 * Keys never go out: a key is its id (a hash) and its last 4 characters.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'rest_api_init',
	function () {
		$text   = array(
			'type'    => 'string',
			'default' => '',
		);
		$page   = array(
			'type'    => 'integer',
			'default' => 1,
		);
		$list   = array(
			'view'    => $text,
			'search'  => $text,
			'orderby' => $text,
			'order'   => $text,
			'page'    => $page,
		);
		$worker = array(
			'type'     => 'string',
			'required' => true,
		);
		$hosts  = array(
			'type'    => 'array',
			'items'   => array( 'type' => 'string' ),
			'default' => array(),
		);
		$flag   = array(
			'type'    => 'boolean',
			'default' => false,
		);
		$routes = array(
			'/workers'                                => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_workers', $list ),
			'/workers/(?P<id>[a-z0-9_-]+)'            => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_worker', array() ),
			'/workers/(?P<id>[a-z0-9_-]+)/runs'       => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_worker_runs', array() ),
			'/workers/save'                           => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_worker_save',
				array(
					'edit'      => $worker,
					'id'        => $text,
					'name'      => $text,
					'what'      => $text,
					'schedule'  => $text,
					'late'      => $text,
					'group'     => $text,
					'group_new' => $text,
					'keys'      => array(
						'type'    => 'array',
						'items'   => array( 'type' => 'string' ),
						'default' => array(),
					),
					'keysShown' => array(
						'type'    => 'boolean',
						'default' => false,
					),
				),
			),
			'/workers/delete'                         => array( 'POST', SOURCEWEB_SRC_CAP, 'sourceweb_rest_worker_delete', array( 'id' => $worker ) ),
			'/workers/run'                            => array( 'POST', SOURCEWEB_SRC_CAP, 'sourceweb_rest_worker_run', array( 'id' => $worker ) ),
			'/sources'                                => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_sources', $list ),
			'/sources/decide'                         => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_sources_decide',
				array(
					'action' => array(
						'type'     => 'string',
						'enum'     => array( 'allow', 'neutral', 'block', 'press_add', 'press_remove', 'relay_on', 'relay_off', 'delete' ),
						'required' => true,
					),
					'hosts'  => $hosts,
				),
			),
			'/sources/short'                          => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_sources_short',
				array(
					'short' => array(
						'type'    => 'object',
						'default' => array(),
					),
				),
			),
			'/sources/one'                            => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_source', array( 'host' => $text ) ),
			'/sources/save'                           => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_source_save',
				array(
					'host'   => $text,
					'status' => $text,
					'name'   => $text,
					'short'  => $text,
					'press'  => $flag,
					'relay'  => $flag,
				),
			),
			'/sources/feeds'                          => array(
				'GET',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_feeds',
				array(
					'host'   => $text,
					'type'   => $text,
					'state'  => $text,
					'search' => $text,
					'page'   => $page,
				),
			),
			'/sources/feeds/decide'                   => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_feeds_decide',
				array(
					'op'  => array(
						'type'     => 'string',
						'enum'     => array( 'on', 'off', 'filter_on', 'filter_off', 'delete' ),
						'required' => true,
					),
					'ids' => $hosts,
				),
			),
			'/keywords'                               => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_keywords', $list + array( 'cat' => $text ) ),
			'/keywords/one'                           => array(
				'GET',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_keyword',
				array(
					'id' => array(
						'type'    => 'integer',
						'default' => 0,
					),
				),
			),
			'/keywords/save'                          => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_keyword_save',
				array(
					'id'         => array(
						'type'    => 'integer',
						'default' => 0,
					),
					'label'      => $text,
					'variants'   => $text,
					'lang'       => array(
						'type'    => 'string',
						'enum'    => array( 'en', 'hi', 'hinglish' ),
						'default' => 'en',
					),
					'roles'      => array(
						'type'    => 'array',
						'items'   => array( 'type' => 'integer' ),
						'default' => array(),
					),
					'categories' => $hosts,
					'sections'   => $hosts,
					'search_on'  => $flag,
					'query'      => $text,
					'delete'     => $flag,
				),
			),
			'/keywords/decide'                        => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_keywords_decide',
				array(
					'op'  => array(
						'type'     => 'string',
						'pattern'  => '^(delete|(add|remove)_[0-9]+|cat_[a-z0-9_-]+)$',
						'required' => true,
					),
					'ids' => array(
						'type'    => 'array',
						'items'   => array( 'type' => 'integer' ),
						'default' => array(),
					),
				),
			),
			'/keywords/test'                          => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_keywords_test', array( 'text' => $text ) ),
			'/keywords/settings'                      => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_keywords_settings',
				array(
					'enabled'          => $flag,
					'gnews_allow_only' => $flag,
					'press'            => array(
						'type'    => 'object',
						'default' => array(),
					),
				),
			),
			'/keywords/suggestions'                   => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_suggestions', $list ),
			'/keywords/suggestions/decide'            => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_suggestions_decide',
				array(
					'op' => array(
						'type'     => 'string',
						'enum'     => array( 'include', 'exclude', 'search', 'route', 'dismiss', 'restore' ),
						'required' => true,
					),
					'qs' => $hosts,
				),
			),
			'/keywords/suggestions/autoapprove'       => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_suggestions_autoapprove',
				array(
					'on_score'    => array( 'type' => 'boolean', 'default' => false ),
					'min_score'   => array( 'type' => 'integer', 'default' => 80 ),
					'types'       => array( 'type' => 'array', 'items' => array( 'type' => 'string' ), 'default' => array() ),
					'on_proven'   => array( 'type' => 'boolean', 'default' => false ),
					'proven_rank' => array( 'type' => 'integer', 'default' => 10 ),
				),
			),
			'/rules/sections'                         => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_rules_sections', array() ),
			'/rules/section'                          => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_rules_section', array( 'type' => $text ) ),
			'/rules/section/save'                     => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_rules_section_save',
				array(
					'type'       => $text,
					'categories' => $hosts,
					'tags'       => $hosts,
					'gone'       => array(
						'type'    => 'object',
						'default' => array(),
					),
				),
			),
			'/rules/tag'                              => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_rules_tag', array( 'tag' => $text ) ),
			'/rules/tag/save'                         => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_rules_tag_save',
				array(
					'tag'         => $text,
					'original'    => $text,
					'any'         => $text,
					'hold'        => $text,
					'unless'      => $text,
					'hold_reason' => $text,
				),
			),
			'/rules/tag/delete'                       => array( 'POST', SOURCEWEB_SRC_CAP, 'sourceweb_rest_rules_tag_delete', array( 'tag' => $worker ) ),
			'/rules/enrich'                           => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_rules_enrich', array() ),
			'/rules/priority'                         => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_rules_priority',
				array(
					'pos' => array(
						'type'    => 'object',
						'default' => array(),
					),
				),
			),
			'/rules/field'                            => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_rules_field', array( 'field' => $text ) ),
			'/rules/field/save'                       => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_rules_field_save',
				array(
					'field' => $worker,
					'rule'  => array(
						'type'    => 'object',
						'default' => array(),
					),
				),
			),
			'/rules/summary'                          => array( 'GET', SOURCEWEB_SRC_CAP, 'sourceweb_rest_rules_summary', array() ),
			'/rules/summary/save'                     => array(
				'POST',
				SOURCEWEB_SRC_CAP,
				'sourceweb_rest_rules_summary_save',
				array(
					'values' => array(
						'type'    => 'object',
						'default' => array(),
					),
				),
			),
		);
		foreach ( $routes as $path => $r ) {
			register_rest_route(
				SOURCEWEB_REST,
				$path,
				array(
					'methods'             => $r[0],
					'permission_callback' => sourceweb_rest_can( $r[1] ),
					'callback'            => $r[2],
					'args'                => $r[3],
				)
			);
		}
	}
);

/*
 * The callbacks are in sourceweb-rest-workers.php, -sources.php, -keywords.php and -rules.php (loaded right after this file).
 */
