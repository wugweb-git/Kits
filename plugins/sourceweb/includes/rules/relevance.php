<?php
/**
 * Relevance gate (owner, 10 Oct 2026): the workers ask a cheap model whether each item is about animal welfare in
 * India, fits a Category (WordPress's category) and, for documents, was issued by a known body, before anything is created.
 *
 * Endpoints (the ingest application-password user, edit_posts):
 * - GET  aw/v1/relevance-config    Categories (slug => name), each section's allowed categories and tags (sections:
 *                                  type => {categories: {slug: name}, tags: {slug: name}}), Directory organisation names (known issuers) and the
 *                                  titles of News from the last 4 days (recent), for the same-story check.
 * - GET  aw/v1/relevance-items     Existing News, Library, Resources, Opportunities and Press items, any status but
 *                                  trash; paginated (page, per_page ≤ 200, missing=1 for items without a verdict).
 * - POST aw/v1/relevance-verdicts  {verdicts: [{id, relevant, category, india, issuer, reason, model, at}]} → meta
 *                                  sourceweb_relevance (JSON). Never changes an item's status.
 * - POST aw/v1/relevance-rejected  {title, source_url, reason, type, feed, model}, or {entries: [...]} for a run's
 *                                  rejections in one request → the Rejected log: option
 *                                  aw_relevance_rejected, newest first, last 500, one entry per URL. Shown under
 *                                  Sourcing → Rejected, to administrators only; never in To review.
 *
 * Sourcing → To review shows only items the check passed (or has not checked): an item whose stored verdict is "not
 * relevant" is left out of the list and its counts.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The types the relevance check covers: the news, library, opportunity and press types of the site, and post.
 *
 * @return string[]
 */
function sourceweb_relevance_types(): array {
	return sourceweb_types_with( array( 'news', 'library', 'opportunity', 'press' ), array( 'post' ) );
}

const AW_RELEVANCE_LOG     = 'aw_relevance_rejected';
const AW_RELEVANCE_LOG_MAX = 500;

/**
 * A verdict as stored on an item (meta sourceweb_relevance): JSON {relevant, category, india, issuer, reason, model, at}.
 *
 * @param array $v Verdict as received.
 * @return string JSON.
 */
function sourceweb_relevance_clean( array $v ) {
	return wp_json_encode(
		array(
			'relevant' => ! empty( $v['relevant'] ) && 'no' !== $v['relevant'],
			'category' => sanitize_title( (string) ( $v['category'] ?? '' ) ),
			'india'    => ! empty( $v['india'] ) && 'no' !== $v['india'],
			'issuer'   => sanitize_text_field( (string) ( $v['issuer'] ?? '' ) ),
			'reason'   => sanitize_text_field( (string) ( $v['reason'] ?? '' ) ),
			'model'    => sanitize_text_field( (string) ( $v['model'] ?? '' ) ),
			'at'       => sanitize_text_field( (string) ( $v['at'] ?? gmdate( 'Y-m-d\TH:i:s\Z' ) ) ),
		)
	);
}

/** Store the gate's verdict on a new item (ingest and press ingest). */
function sourceweb_relevance_store( $post_id, $verdict ) {
	if ( is_array( $verdict ) && $verdict ) {
		update_post_meta( $post_id, 'aw_relevance', wp_slash( sourceweb_relevance_clean( $verdict ) ) );
	}
}

/**
 * Title for duplicate checks (same rule as the workers' norm_title): lower case, letters and digits only, a trailing
 * " - Publisher" or leading "Section | " removed.
 */
function sourceweb_norm_title( $title ) {
	$t = function_exists( 'mb_strtolower' ) ? mb_strtolower( (string) $title ) : strtolower( (string) $title );
	$t = preg_replace( '/\s+[-–—|]\s+[^-–—|]{2,40}$/u', '', $t );
	$t = preg_replace( '/^[^|]{2,30}\|\s+/u', '', $t );
	$t = preg_replace( '/[^\p{L}\p{N}\s]|_/u', ' ', $t );
	return trim( preg_replace( '/\s+/u', ' ', $t ) );
}

/**
 * An existing item (any status but trash, drafts included) with the same normalised title and a date within a day.
 *
 * @param string[] $types    Post types.
 * @param string   $title    Title.
 * @param string   $day      YYYY-MM-DD.
 * @param string   $date_key Meta holding the item's own date.
 * @return int Post ID or 0.
 */
function sourceweb_find_by_title( array $types, $title, $day, $date_key = 'aw_source_date' ) {
	$key = sourceweb_norm_title( $title );
	$day = substr( (string) $day, 0, 10 );
	if ( '' === $key || ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $day ) ) {
		return 0;
	}
	$from = gmdate( 'Y-m-d', strtotime( $day . ' -1 day' ) );
	$to   = gmdate( 'Y-m-d', strtotime( $day . ' +1 day' ) );
	$ids  = get_posts(
		array(
			'post_type'      => $types,
			'post_status'    => array( 'publish', 'pending', 'draft', 'private', 'future', 'trash' ), // trash: never re-created
			'fields'         => 'ids',
			'posts_per_page' => 500,
			'no_found_rows'  => true,
			'meta_query'     => array( array( 'key' => $date_key, 'value' => array( $from, $to . ' 23:59:59' ), 'compare' => 'BETWEEN', 'type' => 'CHAR' ) ), // phpcs:ignore WordPress.DB.SlowDBQuery
		)
	);
	foreach ( $ids as $id ) {
		if ( sourceweb_norm_title( get_post_field( 'post_title', $id ) ) === $key ) {
			return (int) $id;
		}
	}
	return 0;
}

/** Categories: slug => name. */
function sourceweb_relevance_categories() {
	$out = array();
	foreach ( get_terms( array( 'taxonomy' => 'category', 'hide_empty' => false ) ) as $t ) {
		$out[ $t->slug ] = html_entity_decode( $t->name );
	}
	return $out;
}

/** Each section's allowed categories and tags (Sourcing → Sections): type => {categories, tags} as slug => name. */
function sourceweb_relevance_sections() {
	$out   = array();
	$names = function ( $tax, $slugs ) {
		$o = array();
		foreach ( $slugs ? get_terms( array( 'taxonomy' => $tax, 'slug' => $slugs, 'hide_empty' => false ) ) : array() as $t ) {
			$o[ $t->slug ] = html_entity_decode( $t->name );
		}
		return (object) $o;
	};
	foreach ( sourceweb_post_types() as $type ) {
		$out[ $type ] = array( 'categories' => $names( 'category', sourceweb_section_categories( $type ) ), 'tags' => $names( 'post_tag', sourceweb_section_tags( $type ) ) );
	}
	return $out;
}

/** Directory organisations (animal-welfare organisations, ABC centres, wildlife rescue): published names. */
function sourceweb_relevance_directory() {
	global $wpdb;
	$is_l = sourceweb_sql_in_types( 'p.post_type', array( sourceweb_type( 'listing' ) ) ); // 1=0 without a listing type
	return $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		"SELECT DISTINCT p.post_title FROM {$wpdb->posts} p
		 JOIN {$wpdb->term_relationships} tr ON tr.object_id = p.ID
		 JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id AND tt.taxonomy = 'post_tag'
		 JOIN {$wpdb->terms} t ON t.term_id = tt.term_id AND t.slug IN ('animal-welfare-organisation','abc-centre','wildlife-rescue')
		 WHERE {$is_l} AND p.post_status = 'publish'" // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- needed here and bounded; see the surrounding code.
	);
}

/** One item for the classifier. */
function sourceweb_relevance_row( WP_Post $p ) {
	$id      = $p->ID;
	$press   = sourceweb_is_type( $p->post_type, 'press' );
	$text    = $p->post_excerpt ? $p->post_excerpt : wp_trim_words( wp_strip_all_tags( strip_shortcodes( $p->post_content ) ), 150 );
	$issuer  = function_exists( 'sourceweb_item_issuer' ) ? sourceweb_item_issuer( $id ) : null;
	$verdict = (string) get_post_meta( $id, 'aw_relevance', true );
	$rtypes  = 'post' === $p->post_type ? wp_list_pluck( sourceweb_item_tags( $id, sourceweb_section_tags( 'post' ) ), 'slug' ) : array();
	$row     = array(
		'id'          => $id,
		'type'        => $p->post_type,
		'status'      => $p->post_status,
		'title'       => html_entity_decode( get_the_title( $p ), ENT_QUOTES ),
		'summary'     => html_entity_decode( (string) $text, ENT_QUOTES ),
		'source_url'  => (string) get_post_meta( $id, $press ? 'aw_press_url' : 'aw_source_url', true ),
		'source_name' => (string) get_post_meta( $id, $press ? 'aw_press_publisher' : 'aw_source_name', true ),
		'issuer'      => $issuer ? $issuer->name : '',
		'resource_types' => $rtypes, // the Resource type tags (research, guide ...)
		'tags'           => $press ? array() : wp_list_pluck( sourceweb_item_tags( $id ), 'slug' ),
		'categories'     => $press ? array() : wp_get_post_terms( $id, 'category', array( 'fields' => 'slugs' ) ),
		'verdict'     => $verdict ? json_decode( $verdict, true ) : null,
	);
	return $row;
}

/** Titles of News published or waiting from the last 4 days: the workers ask the AI whether a new item is one of these stories. */
function sourceweb_relevance_recent_titles(): array {
	$types = sourceweb_types( array( 'news', 'library' ) );
	if ( ! $types ) {
		return array(); // an empty post_type would query WordPress's own posts
	}
	$ids = get_posts(
		array(
			'post_type'      => $types, // court reports in the Library repeat each other too (owner, 14 Oct 2026)
			'post_status'    => array( 'publish', 'pending', 'draft', 'future' ),
			'date_query'     => array( array( 'after' => '4 days ago' ) ),
			'posts_per_page' => 400,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);
	return array_values( array_map( fn( $id ) => html_entity_decode( get_the_title( $id ), ENT_QUOTES ), $ids ) );
}

/** The same stories with their IDs, so the workers can add a later report's facts to the first one (same-story.php). */
function sourceweb_relevance_recent_items(): array {
	$types = sourceweb_types( array( 'news', 'library' ) );
	if ( ! $types ) {
		return array();
	}
	$ids = get_posts(
		array(
			'post_type'      => $types,
			'post_status'    => array( 'publish', 'pending', 'draft', 'future' ),
			'date_query'     => array( array( 'after' => '4 days ago' ) ),
			'posts_per_page' => 400,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);
	return array_values( array_map( fn( $id ) => array( 'id' => (int) $id, 'title' => html_entity_decode( get_the_title( $id ), ENT_QUOTES ) ), $ids ) );
}

add_action(
	'rest_api_init',
	function () {
		$can = 'sourceweb_ingest_can';
		register_rest_route(
			'aw/v1',
			'/relevance-config',
			array(
				'methods'             => 'GET',
				'permission_callback' => $can,
				'callback'            => fn() => new WP_REST_Response( array( 'categories' => sourceweb_relevance_categories(), 'sections' => sourceweb_relevance_sections(), 'directory' => sourceweb_relevance_directory(), 'recent' => sourceweb_relevance_recent_titles(), 'recent_items' => sourceweb_relevance_recent_items() ) ),
			)
		);
		register_rest_route(
			'aw/v1',
			'/relevance-items',
			array(
				'methods'             => 'GET',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $req ) {
					$args = array(
						'post_type'      => sourceweb_relevance_types(),
						'post_status'    => array( 'publish', 'pending', 'draft', 'private', 'future' ),
						'posts_per_page' => max( 1, min( 200, (int) ( $req->get_param( 'per_page' ) ?: 100 ) ) ),
						'paged'          => max( 1, (int) $req->get_param( 'page' ) ),
						'orderby'        => 'ID',
						'order'          => 'ASC',
					);
					if ( $req->get_param( 'missing' ) ) {
						$args['meta_query'] = array( array( 'key' => 'aw_relevance', 'compare' => 'NOT EXISTS' ) ); // phpcs:ignore WordPress.DB.SlowDBQuery
					}
					$q = new WP_Query( $args );
					return new WP_REST_Response(
						array(
							'total' => (int) $q->found_posts,
							'pages' => (int) $q->max_num_pages,
							'items' => array_map( 'sourceweb_relevance_row', $q->posts ),
						)
					);
				},
			)
		);
		register_rest_route(
			'aw/v1',
			'/relevance-verdicts',
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $req ) {
					$n = 0;
					foreach ( (array) $req->get_param( 'verdicts' ) as $v ) {
						$id = (int) ( $v['id'] ?? 0 );
						if ( ! is_array( $v ) || ! $id || ! in_array( get_post_type( $id ), sourceweb_relevance_types(), true ) ) {
							continue;
						}
						update_post_meta( $id, 'aw_relevance', wp_slash( sourceweb_relevance_clean( $v ) ) ); // meta only: status untouched
						++$n;
					}
					return new WP_REST_Response( array( 'stored' => $n ) );
				},
			)
		);
		// The workers' check could not run (no AI service answered): items were held back. A dashboard notice is stored;
		// a site may add an email through the sourceweb_relevance_alert filter.
		register_rest_route(
			'aw/v1',
			'/relevance-alert',
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $req ) {
					$n    = max( 0, (int) $req->get_param( 'held' ) );
					$run  = sanitize_text_field( (string) $req->get_param( 'run' ) );
					$link = esc_url_raw( (string) $req->get_param( 'link' ) );
					if ( ! $n ) { // a run where the check worked clears the dashboard notice
						delete_option( 'aw_relevance_alert_notice' );
						return new WP_REST_Response( array( 'status' => 'clear' ) );
					}
					$prev = (array) get_option( 'aw_relevance_alert_notice', array() );
					update_option( 'aw_relevance_alert_notice', array( 'held' => $n + (int) ( $prev['held'] ?? 0 ), 'since' => $prev['since'] ?? current_time( 'j M Y, g:i a' ), 'run' => $link ), false );
					/**
					 * The relevance check could not run for $n new items. The dashboard notice above is already stored.
					 * A site that wants an email hooks this and returns the REST response data.
					 *
					 * @param array  $response The data returned to the worker.
					 * @param int    $n        Items held in this run.
					 * @param string $run      The run's id.
					 * @param string $link     The run's link.
					 */
					return new WP_REST_Response( apply_filters( 'sourceweb_relevance_alert', array( 'status' => 'noted', 'held' => $n ), $n, $run, $link ) );
				},
			)
		);
		register_rest_route(
			'aw/v1',
			'/relevance-rejected',
			array(
				'methods'             => 'POST',
				'permission_callback' => $can,
				'callback'            => function ( WP_REST_Request $req ) {
					$batch = $req->get_param( 'entries' ); // the workers send a run's rejections in one request
					$batch = is_array( $batch ) ? array_slice( $batch, 0, AW_RELEVANCE_LOG_MAX ) : array( $req->get_params() );
					$log   = (array) get_option( AW_RELEVANCE_LOG, array() );
					foreach ( $batch as $e ) {
						$e     = (array) $e;
						$url   = esc_url_raw( (string) ( $e['source_url'] ?? '' ) );
						$entry = array(
							'title'  => sanitize_text_field( (string) ( $e['title'] ?? '' ) ),
							'url'    => $url,
							'reason' => sanitize_text_field( (string) ( $e['reason'] ?? '' ) ),
							'type'   => sanitize_key( (string) ( $e['type'] ?? '' ) ),
							'feed'   => sanitize_text_field( (string) ( $e['feed'] ?? '' ) ),
							'kw'     => function_exists( 'sourceweb_sourcing_feed_keyword' ) ? sourceweb_sourcing_feed_keyword( (string) ( $e['feed'] ?? '' ) ) : '',
							'model'  => sanitize_text_field( (string) ( $e['model'] ?? '' ) ),
							'at'     => current_time( 'Y-m-d H:i' ),
						);
						$log = array_values( array_filter( $log, fn( $x ) => is_array( $x ) && ( $x['url'] ?? '' ) !== $url ) );
						array_unshift( $log, $entry );
					}
					update_option( AW_RELEVANCE_LOG, array_slice( $log, 0, AW_RELEVANCE_LOG_MAX ), false );
					return new WP_REST_Response( array( 'status' => 'logged' ) );
				},
			)
		);
	}
);

/**
 * Why an incoming item is not News (owner, 20 Oct 2026), '' when it may be: an archive or tag page of a news site
 * ("Read all latest updates on and about …", "Latest news on …"). The workers' sources.not_an_article() has the same
 * rule. A site adds its own (the job-vacancy rule is the Animal Writes site layer's: filter sourceweb_not_news_reason).
 *
 * @param string $title Headline.
 * @param string $url   Source URL.
 * @param string $type  Post type it would become.
 * @return string
 */
function sourceweb_not_news_reason( $title, $url, $type ) {
	$title = (string) $title;
	$path  = (string) wp_parse_url( (string) $url, PHP_URL_PATH ) . '/';
	if ( preg_match( '#/(?:tags?|topics?|category|categories|author|authors|search|section)/#i', $path )
		|| preg_match( '/^\s*(?:read\s+)?(?:all\s+)?(?:the\s+)?latest\s+(?:news|updates|stories|headlines|articles)\b(?:\s*(?:,|and|&)\s*\w+){0,3}\s+(?:on|about|from|for|of)\b|\blatest\s+news\s*,\s*(?:photos|videos|updates)\b|^\s*(?:all\s+)?(?:news|updates)\s+(?:on\s+and\s+)?about\b/i', $title ) ) {
		return 'an archive or tag page of a news site, not a news report';
	}
	// Filter sourceweb_not_news_reason( string $reason, string $title, string $url, string $type ): a site adds rules of its
	// own for what is not a news report (for example a job vacancy, when it files jobs under an opportunity type).
	return (string) apply_filters( 'sourceweb_not_news_reason', '', $title, (string) $url, (string) $type );
}

/** Add one entry to the Rejected log (Sourcing → Rejected), as the relevance-rejected endpoint does. */
function sourceweb_relevance_log_one( $title, $url, $reason, $type, $feed = '' ) {
	$url = esc_url_raw( (string) $url );
	$log = array_values( array_filter( (array) get_option( AW_RELEVANCE_LOG, array() ), fn( $x ) => is_array( $x ) && ( $x['url'] ?? '' ) !== $url ) );
	array_unshift(
		$log,
		array(
			'title'  => sanitize_text_field( (string) $title ),
			'url'    => $url,
			'reason' => sanitize_text_field( (string) $reason ),
			'type'   => sanitize_key( (string) $type ),
			'feed'   => sanitize_text_field( (string) $feed ),
			'kw'     => function_exists( 'sourceweb_sourcing_feed_keyword' ) ? sourceweb_sourcing_feed_keyword( (string) $feed ) : '',
			'model'  => 'site rule',
			'at'     => current_time( 'Y-m-d H:i' ),
		)
	);
	update_option( AW_RELEVANCE_LOG, array_slice( $log, 0, AW_RELEVANCE_LOG_MAX ), false );
}

/** Stored verdict says "not relevant". */
function sourceweb_relevance_failed( $post_id ) {
	$v = (string) get_post_meta( $post_id, 'aw_relevance', true );
	if ( '' === $v ) {
		return false;
	}
	$v = json_decode( $v, true );
	return is_array( $v ) && array_key_exists( 'relevant', $v ) && ! $v['relevant'];
}

// Sourcing → Rejected: the log of items the relevance check refused (never created). Administrators only.
add_filter(
	'kits_sourcing_tabs',
	function ( $tabs ) {
		if ( current_user_can( 'manage_options' ) ) {
			$tabs['rejected'] = array( 'Rejected' );
		}
		return $tabs;
	},
	20
);

/**
 * The Rejected log as plain text: the item (title, or its host), where it was found (keyword or feed), the reason, the
 * date, and a note when it came from an allowed publisher (rarely refused: worth a look). Used by GET sourceweb/v1/rejected.
 *
 * @return array[] { url, host, title, type, found, reason, at, problem }
 */
function sourceweb_relevance_rejected_rows(): array {
	$pubs = sourceweb_publishers();
	$rows = array();
	foreach ( (array) get_option( AW_RELEVANCE_LOG, array() ) as $e ) {
		$url    = (string) ( $e['url'] ?? '' );
		$host   = (string) wp_parse_url( $url, PHP_URL_HOST );
		$title  = (string) ( $e['title'] ?? '' );
		$rows[] = array(
			'url'     => $url,
			'host'    => $host,
			'title'   => '' !== $title ? $title : $host,
			'type'    => (string) ( $e['type'] ?? '' ),
			'found'   => '' !== (string) ( $e['kw'] ?? '' ) ? 'Keyword: ' . $e['kw'] : (string) ( $e['feed'] ?? '' ),
			'reason'  => (string) ( $e['reason'] ?? '' ),
			'at'      => (string) ( $e['at'] ?? '' ),
			'problem' => 'allow' === ( $pubs[ sourceweb_host( $url ) ]['status'] ?? '' ) ? 'From an allowed publisher (' . sourceweb_host( $url ) . '): check whether it should have been kept.' : '',
		);
	}
	return $rows;
}

// Dashboard: the same alert while items are held (owner, 12 Oct 2026); it clears after a run where the check works.
add_action(
	'admin_notices',
	function () {
		$a = get_option( 'aw_relevance_alert_notice' );
		if ( ! is_array( $a ) || empty( $a['held'] ) || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		wp_admin_notice( '<strong>Relevance check could not run.</strong> ' . esc_html( (int) $a['held'] . ' new item(s) held since ' . $a['since'] . ': no AI service answered, so nothing was created for them. They are tried again every 6 hours. Adding credit to an AI key clears it.' ) . ( ! empty( $a['run'] ) ? ' <a href="' . esc_url( $a['run'] ) . '" target="_blank" rel="noopener">Run details</a>' : '' ), array( 'type' => 'error' ) );
	}
);

/*
 * Ingestion heartbeat and watchdog (owner, 12 Oct 2026; no new News 10-12 Oct went unnoticed).
 * - Every worker run reports what it did: items created and published, sources tried and failed (POST ingest-heartbeat).
 * - An hourly check on the site itself (event sourceweb_ingest_watchdog, and after every heartbeat) checks
 *   and a dashboard notice shows when: no News has been published for 12 hours; no worker run has reported for 8 hours (Actions
 *   stopped, a run crashed or timed out, login refused); or half the sources failed in the last run.
 * It sends no email itself: a site hooks the action sourceweb_ingest_problems.
 */

/**
 * Unix time of the newest News item published, or 0. A story carries its source's date (an item found at 5 am about
 * yesterday's news is dated yesterday), so the date says nothing about when it went live: the five most recently added
 * items are asked for the time they were last saved (owner, 21 Oct 2026; the notice and the e-mail said "no News for
 * 16 hours" while the workers were publishing).
 */
function sourceweb_newest_published_news() {
	global $wpdb;
	// Straight from the table: the News lists' pre_get_posts (display.php) re-sorts every front-end News query by
	// source date, so get_posts() returned yesterday-dated items added last night after older ones, and the watchdog
	// e-mailed "no News for 12 hours" while 13 items had gone live overnight (24 Oct 2026).
	$news = sourceweb_type( 'news' );
	if ( '' === $news ) {
		return 0; // no News type on this site
	}
	$ids  = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type = %s AND post_status = 'publish' ORDER BY ID DESC LIMIT 5", $news ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$best = 0;
	foreach ( $ids as $id ) {
		$best = max( $best, (int) get_post_time( 'U', true, $id ), (int) get_post_modified_time( 'U', true, $id ) );
	}
	return $best;
}

/**
 * What is wrong with ingestion right now, as key => sentence (empty when all is well).
 *
 * @param int|null $now Unix time (tests).
 * @return array<string,string>
 */
function sourceweb_ingest_problems( $now = null ) {
	$now  = $now ? $now : time();
	$hb   = (array) get_option( 'aw_ingest_heartbeat', array() );
	$out  = array();
	$news = sourceweb_newest_published_news();
	if ( $news && $now - $news >= 12 * HOUR_IN_SECONDS ) {
		$out['quiet'] = sprintf( 'No News has been published for %d hours (last: %s).', floor( ( $now - $news ) / HOUR_IN_SECONDS ), wp_date( 'j M Y, g:i a', $news ) );
	}
	$last = (int) ( $hb['last_run'] ?? 0 );
	if ( $last && $now - $last >= 8 * HOUR_IN_SECONDS ) { // a site whose workers never reported has not set them up: no alarm
		$out['no_run'] = $last ? sprintf( 'No worker run has reported for %d hours (last: %s). The GitHub Actions schedule may have stopped, or runs are failing before the end.', floor( ( $now - $last ) / HOUR_IN_SECONDS ), wp_date( 'j M Y, g:i a', $last ) ) : 'No worker run has reported yet.';
	}
	// Scheduled tasks (cron-health.php): no trigger has called wp-cron.php for 30 minutes.
	$cron = function_exists( 'kits_cron_last' ) ? kits_cron_last() : 0;
	if ( $cron && $now - $cron >= SOURCEWEB_CRON_STALE ) {
		$out['cron'] = sprintf( 'Scheduled tasks have not run for %d minutes (last: %s). Hostinger\'s server cron, the GitHub "WordPress cron" job and the outside monitor have all stopped.', floor( ( $now - $cron ) / MINUTE_IN_SECONDS ), wp_date( 'j M Y, g:i a', $cron ) );
	}
	$n    = (int) ( $hb['sources'] ?? 0 );
	$fail = (int) ( $hb['sources_failed'] ?? 0 );
	if ( $n && $fail * 2 >= $n ) {
		$out['sources'] = sprintf( '%d of %d sources could not be fetched in the last run%s', $fail, $n, empty( $hb['errors'] ) ? '.' : ': ' . implode( '; ', array_slice( (array) $hb['errors'], 0, 3 ) ) );
	}
	return $out;
}

/**
 * Check ingestion (hourly event, and after every heartbeat): stores the result and fires the action
 * `sourceweb_ingest_problems` with the problems (an empty array when all is well). SourceWeb sends no email itself; a
 * site that wants one hooks the action.
 */
function sourceweb_ingest_watchdog() {
	update_option( 'aw_ingest_watchdog_at', time(), true );
	$problems = sourceweb_ingest_problems();
	update_option( 'aw_ingest_watchdog_last', array( 'at' => time(), 'problems' => $problems ), false );
	/**
	 * Ingestion was checked.
	 *
	 * @param array<string,string> $problems Kind => sentence; empty when nothing is wrong.
	 */
	do_action( 'sourceweb_ingest_problems', $problems );
}
add_action( 'aw_ingest_watchdog', 'sourceweb_ingest_watchdog' );
// The check must not depend on what it watches (cron, GitHub): any request that reaches PHP also runs it when the last
// one is an hour old, or 10 minutes old while scheduled tasks look stopped (two autoloaded option reads otherwise).
add_action(
	'shutdown',
	function () {
		$age   = time() - (int) get_option( 'aw_ingest_watchdog_at', 0 );
		$cron  = function_exists( 'kits_cron_last' ) ? kits_cron_last() : 0;
		$stale = $cron && time() - $cron >= SOURCEWEB_CRON_STALE;
		if ( ( $age >= HOUR_IN_SECONDS || ( $stale && $age >= 10 * MINUTE_IN_SECONDS ) ) && ! wp_installing() ) {
			sourceweb_ingest_watchdog();
		}
	}
);
add_action(
	'init',
	function () {
		if ( ! wp_next_scheduled( 'aw_ingest_watchdog' ) ) {
			wp_schedule_event( time() + 600, 'hourly', 'aw_ingest_watchdog' );
		}
	}
);

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'aw/v1',
			'/ingest-heartbeat',
			array(
				'methods'             => 'POST',
				'permission_callback' => 'sourceweb_ingest_can',
				'callback'            => function ( WP_REST_Request $req ) {
					$now       = time();
					$new       = max( 0, (int) $req->get_param( 'new' ) );
					$published = null === $req->get_param( 'published' ) ? $new : max( 0, (int) $req->get_param( 'published' ) );
					$hb        = (array) get_option( 'aw_ingest_heartbeat', array() );
					$hb['last_run']       = $now;
					$hb['last_link']      = esc_url_raw( (string) $req->get_param( 'link' ) );
					$hb['new']            = $new;
					$hb['published']      = $published;
					$hb['sources']        = max( 0, (int) $req->get_param( 'sources' ) );
					$hb['sources_failed'] = max( 0, (int) $req->get_param( 'sources_failed' ) );
					$hb['lists']          = sanitize_key( (string) $req->get_param( 'lists' ) ); // site or yaml: which lists the run used
					$hb['errors']         = array_map( 'sanitize_text_field', array_slice( array_filter( (array) $req->get_param( 'errors' ), 'is_scalar' ), 0, 10 ) );
					if ( empty( $hb['first_run'] ) ) { // the first report, kept for good (Site Health's never-published-News rule)
						$hb['first_run'] = $now;
					}
					if ( $published > 0 || empty( $hb['last_new'] ) ) {
						$hb['last_new'] = $now;
					}
					update_option( 'aw_ingest_heartbeat', $hb, false );
					sourceweb_ingest_watchdog();
					return new WP_REST_Response( array( 'problems' => array_keys( sourceweb_ingest_problems( $now ) ) ) );
				},
			)
		);
	}
);
add_action(
	'admin_notices',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$problems = sourceweb_ingest_problems();
		if ( ! $problems ) {
			return;
		}
		$hb = (array) get_option( 'aw_ingest_heartbeat', array() );
		wp_admin_notice( '<strong>Ingestion needs attention.</strong> ' . esc_html( implode( ' ', $problems ) ) . ( ! empty( $hb['last_link'] ) ? ' <a href="' . esc_url( $hb['last_link'] ) . '" target="_blank" rel="noopener">Last run</a>' : '' ), array( 'type' => 'error' ) );
	}
);
