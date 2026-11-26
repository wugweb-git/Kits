<?php
/**
 * SourceWeb's Sources and feeds routes' callbacks (split from sourceweb-rest-pages.php, which registers the routes and lists them).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------- Sources ---------- */

/** Sources views => label (the list's status= views). */
function sourceweb_source_views(): array {
	$v = array(
		'allow'   => 'Allowed',
		'neutral' => 'Neutral',
		'block'   => 'Blocked',
		'press'   => 'Press sites',
		'feeds'   => 'With feeds',
		'code'    => 'Read by code',
		'relay'   => 'Relay',
	);
	if ( sourceweb_sourcing_phase() >= 2 ) { // press sites went with Brave (phase 2)
		unset( $v['press'] );
	}
	return $v;
}

/**
 * One row of the Sources list, in plain text.
 *
 * @param array $r  A row from sourceweb_sourcing_source_rows().
 * @param bool  $si Search Console figures are there.
 */
function sourceweb_source_row( array $r, bool $si ): array {
	$st   = array(
		'allow'   => 'Allowed',
		'neutral' => 'Neutral',
		'block'   => 'Blocked',
	);
	$not  = array(
		'relay' => 'Relay only',
		'feeds' => 'Feeds only',
	)[ $r['kind'] ] ?? '';
	$rec  = $r['rec'];
	$last = $r['relay_last'];
	$n    = 'number_format_i18n';
	$code = (string) $r['code'];
	return array(
		'id'         => $r['host'],
		'title'      => $r['host'],
		'name'       => $r['name'],
		'icon'       => sourceweb_src_icon_url( $r['host'] ),
		'pub'        => (bool) $r['pub'],
		'kind'       => $r['kind'],
		'short'      => $r['short'],
		'status'     => $r['status'],
		'statusText' => $r['pub'] ? ( $st[ $r['status'] ] ?? 'Neutral' ) : ( '' !== $not ? $not . ' (not a publisher)' : 'Not a publisher' ),
		'press'      => (bool) $r['press'],
		'rating'     => $r['pub'] && ! empty( $rec['rating'] ) ? $rec['rating'] . ( ! empty( $rec['credibility'] ) ? ' · ' . $rec['credibility'] . ' credibility' : '' ) : '',
		'ratingUrl'  => $r['pub'] && ! empty( $rec['rating_url'] ) ? esc_url_raw( (string) $rec['rating_url'] ) : '',
		'dr'         => $r['dr'],
		'drAt'       => $r['dr_at'],
		'feeds'      => $r['feeds'],
		'feedsText'  => $r['feeds'] ? sprintf( /* translators: 1: feeds, 2: feeds that are on. */ _n( '%1$s feed (%2$s on)', '%1$s feeds (%2$s on)', $r['feeds'], 'sourceweb' ), $n( $r['feeds'] ), $n( $r['feeds_on'] ) ) . ( $r['code_n'] ? ', ' . $n( $r['code_n'] ) . ' read by code' : '' ) : '',
		'relay'      => (bool) $r['relay'],
		'relayOwn'   => (bool) $r['relay_own'],
		'relayLast'  => $last ? (string) $last['status'] . ' · ' . wp_date( 'j M Y, g:i a', (int) $last['at'] ) : '',
		'relayOk'    => $last ? is_int( $last['status'] ?? null ) && $last['status'] < 400 : null,
		'items'      => $n( $r['f30'] ) . ' / ' . $n( $r['pub_n'] ),
		'search'     => $si ? '28 days: ' . $n( $r['impr'] ) . ' impr. · ' . $n( $r['clicks'] ) . ' clicks; 3 months: ' . $n( $r['impr3'] ) . ' impr. · ' . $n( $r['clicks3'] ) . ' clicks' : '',
		'seoTitle'   => $r['title'],
		'seoDesc'    => $r['desc'],
		'seoAt'      => '' === $r['at'] ? '' : 'Checked ' . substr( $r['at'], 0, 10 ) . ' · ' . ( ctype_digit( $code ) ? 'HTTP ' . $code : $code ),
		'last'       => $r['last'],
		'canDelete'  => in_array( $r['kind'], array( 'publisher', 'relay' ), true ) && ! $r['feeds'] && ! $r['press'] && ! $r['count'] && ! $r['f30'] && ! $r['pub_n'],
		// For the sort: the raw numbers.
		'f30'        => $r['f30'],
		'pubN'       => $r['pub_n'],
		'impr'       => $r['impr'],
		'impr3'      => $r['impr3'],
		'feedsOn'    => $r['feeds_on'],
	);
}

/**
 * GET sources: one page of the Sources list, most items first, as today's list.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_sources( WP_REST_Request $request ) {
	$src  = sourceweb_sourcing_source_rows();
	$rows = array();
	foreach ( $src['rows'] as $r ) {
		if ( '' !== (string) $r['host'] ) {
			$rows[] = sourceweb_source_row( $r, (bool) $src['si'] );
		}
	}
	// Most items first (fetched, then published), then the latest seen, then the host.
	usort( $rows, fn( $a, $b ) => ( $b['f30'] <=> $a['f30'] ) ?: ( $b['pubN'] <=> $a['pubN'] ) ?: strcmp( $b['last'], $a['last'] ) ?: strcmp( $a['id'], $b['id'] ) );
	$in    = array(
		'press' => fn( $r ) => $r['press'],
		'feeds' => fn( $r ) => $r['feeds'] > 0,
		'code'  => fn( $r ) => false !== strpos( $r['feedsText'], 'read by code' ),
		'relay' => fn( $r ) => $r['relay'],
	);
	$views = array();
	foreach ( sourceweb_source_views() as $k => $l ) {
		$views[ $k ] = array( $l, $in[ $k ] ?? fn( $r ) => $r['status'] === $k );
	}
	$out = sourceweb_list(
		$rows,
		$request->get_params(),
		array(
			'views' => $views,
			'text'  => fn( $r ) => $r['id'] . ' ' . $r['name'] . ' ' . $r['short'] . ' ' . $r['seoTitle'],
			'sort'  => array(
				'title'  => fn( $r ) => $r['id'],
				'status' => fn( $r ) => $r['statusText'] . ' ' . $r['id'],
				'dr'     => fn( $r ) => null === $r['dr'] ? -1 : $r['dr'],
				'feeds'  => fn( $r ) => array( $r['feeds'], $r['feedsOn'] ),
				'items'  => fn( $r ) => array( $r['f30'], $r['pubN'] ),
				'search' => fn( $r ) => array( $r['impr'], $r['impr3'] ),
				'last'   => fn( $r ) => $r['last'],
			),
			'per'   => 50,
		)
	);
	$out['feedCount'] = array_sum( array_column( $rows, 'feeds' ) );
	$out['phase']     = sourceweb_sourcing_phase();
	$out['si']        = (bool) $src['si'];
	$out['stale']     = (bool) $src['stale'];
	return rest_ensure_response( $out );
}

/**
 * POST sources/decide: a row or bulk action, as today's list.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_sources_decide( WP_REST_Request $request ) {
	$action = (string) $request['action'];
	$phase  = sourceweb_sourcing_phase();
	if ( ( in_array( $action, array( 'press_add', 'press_remove' ), true ) && $phase >= 2 ) || ( in_array( $action, array( 'relay_on', 'relay_off' ), true ) && $phase < 1 ) ) {
		return new WP_Error( 'sourceweb_not_now', __( 'That action is not available at this phase.', 'sourceweb' ), array( 'status' => 400 ) );
	}
	$hosts = array_values( array_filter( array_map( 'sourceweb_sourcing_norm_host', array_map( 'sanitize_text_field', (array) $request['hosts'] ) ) ) );
	if ( ! $hosts ) {
		return rest_ensure_response(
			array(
				'changed' => false,
				'message' => __( 'Nothing changed.', 'sourceweb' ),
			)
		);
	}
	$pubs                 = sourceweb_publishers(); // read just before the write: the ingest gate updates the same option
	$before               = $pubs;
	list( $pubs, $press ) = sourceweb_sourcing_sources_apply( $pubs, $action, $hosts );
	if ( $pubs !== $before ) {
		update_option( SOURCEWEB_PUB_OPTION, $pubs, false );
	}
	$changed = $pubs !== $before || $press;
	return rest_ensure_response(
		array(
			'changed' => $changed,
			'message' => $changed ? __( 'Saved. The workers use this from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ),
		)
	);
}

/**
 * POST sources/short: short names, host => name.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_sources_short( WP_REST_Request $request ) {
	$in = array();
	foreach ( (array) $request['short'] as $h => $v ) {
		$h = sourceweb_sourcing_norm_host( sanitize_text_field( (string) $h ) );
		if ( '' !== $h && is_scalar( $v ) ) {
			$in[ $h ] = sanitize_text_field( (string) $v );
		}
	}
	$pubs   = sourceweb_publishers();
	$before = $pubs;
	$pubs   = sourceweb_sourcing_shorts_apply( $pubs, $in );
	if ( $pubs !== $before ) {
		update_option( SOURCEWEB_PUB_OPTION, $pubs, false );
	}
	return rest_ensure_response(
		array(
			'changed' => $pubs !== $before,
			'message' => $pubs !== $before ? __( 'Short names saved.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ),
		)
	);
}

/**
 * GET sources/one: a source for its form ('' for Add New Source).
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_source( WP_REST_Request $request ) {
	$host  = sourceweb_sourcing_norm_host( sanitize_text_field( (string) $request['host'] ) );
	$new   = '' === $host;
	$all   = sourceweb_publishers();
	$rec   = $new ? null : ( $all[ $host ] ?? null );
	$press = ! $new && in_array( $host, sourceweb_sourcing_press_hosts(), true );
	$feeds = $new ? array() : ( sourceweb_sourcing_feeds_by_host()[ $host ] ?? array() );
	if ( ! $new && null === $rec && ! $press && ! $feeds ) {
		return new WP_Error( 'sourceweb_no_source', __( 'No such source.', 'sourceweb' ), array( 'status' => 404 ) );
	}
	$pub     = null !== $rec && empty( $rec['kind'] );
	$options = array(
		array(
			'value' => 'block',
			'label' => 'Blocked',
		),
		array(
			'value' => 'allow',
			'label' => 'Allowed',
		),
		array(
			'value' => 'neutral',
			'label' => 'Neutral',
		),
	);
	if ( ! $pub ) {
		$options[] = array(
			'value' => 'none',
			'label' => 'Not a publisher (press site, relay or feeds only)',
		);
	}
	$last = $new ? null : sourceweb_src_relay_last( sourceweb_src_relay_index( (array) get_option( 'aw_relay_log', array() ) ), $host );
	return rest_ensure_response(
		array(
			'host'       => $host,
			'new'        => $new,
			'name'       => (string) ( $rec['name'] ?? '' ),
			'short'      => (string) ( $rec['short'] ?? '' ),
			'status'     => $pub ? (string) ( $rec['status'] ?? 'neutral' ) : ( $new ? 'block' : 'none' ),
			'options'    => $options,
			'press'      => $press,
			'pressShown' => sourceweb_sourcing_phase() < 2 || $press,
			'relayShown' => sourceweb_sourcing_phase() >= 1,
			'relay'      => ! empty( $rec['relay'] ) || ( sourceweb_sourcing_phase() < 1 && ! $new && sourceweb_src_host_in( $host, sourceweb_relay_hosts() ) ),
			'relayLast'  => $last ? (string) $last['status'] . ' · ' . wp_date( 'j M Y, g:i a', (int) $last['at'] ) : '',
			'feeds'      => count( $feeds ),
		)
	);
}

/**
 * POST sources/save: the source form.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_source_save( WP_REST_Request $request ) {
	list( $changed, $err ) = sourceweb_sourcing_source_save(
		array(
			'host'        => (string) $request['host'],
			'status'      => (string) $request['status'],
			'name'        => (string) $request['name'],
			'short'       => (string) $request['short'],
			'press'       => (bool) $request['press'],
			'relay_shown' => true,
			'relay'       => (bool) $request['relay'],
		)
	);
	if ( '' !== $err ) {
		$msg = array(
			'host'    => 'Nothing saved: that is not a host (example.com).',
			'status'  => 'Nothing saved: choose Allowed, Neutral or Blocked.',
			'nothing' => 'Nothing saved: a source that is not a publisher must be searched for coverage, relayed or have feeds.',
		);
		return new WP_Error( 'sourceweb_source_' . $err, $msg[ $err ] ?? 'Nothing saved.', array( 'status' => 400 ) );
	}
	return rest_ensure_response(
		array(
			'changed' => $changed,
			'host'    => sourceweb_sourcing_norm_host( sanitize_text_field( (string) $request['host'] ) ),
			'message' => $changed ? __( 'Saved. The workers use this from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ),
		)
	);
}

/**
 * GET sources/feeds: every feed and source read by code, or one site's.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_feeds( WP_REST_Request $request ) {
	$host = sourceweb_sourcing_norm_host( sanitize_text_field( (string) $request['host'] ) );
	$rows = array();
	foreach ( (array) ( sourceweb_sources_config()['sources'] ?? array() ) as $s ) {
		if ( ! is_array( $s ) || empty( $s['id'] ) || ( '' !== $host && sourceweb_src_source_host( $s ) !== $host ) ) {
			continue;
		}
		$t      = (string) ( $s['type'] ?? '' );
		$rss    = 'rss' === ( $s['kind'] ?? '' );
		$q      = $rss ? sourceweb_gnews_query( (string) $s['url'] ) : '';
		$h      = sourceweb_src_source_host( $s );
		$args   = array(
			'feed' => $s['id'],
			'type' => $t,
		);
		$rows[] = array(
			'id'       => $t . '|' . $s['id'],
			'title'    => (string) ( $s['name'] ?? $s['id'] ),
			'type'     => $t,
			'typeText' => (string) ( AW_SOURCE_TYPES[ $t ][0] ?? $t ),
			'rss'      => $rss,
			'address'  => $q ? $q : (string) ( $s['url'] ?? '' ),
			'note'     => $q ? 'Google News search' : ( $rss ? '' : (string) ( $s['kind'] ?? '' ) . '; needs code to change' ),
			'host'     => $h,
			'byCode'   => 'code' === sourceweb_src_read_by( $s ),
			'on'       => ! empty( $s['on'] ),
			'filter'   => $rss ? ( ! empty( $s['filter'] ) ? 'On' : 'Off' ) : '—',
			'filterOn' => ! empty( $s['filter'] ),
			// The feed form, at its own address (the new Sources screen draws it: sourceweb_feed_parts()).
			'editUrl'  => sourceweb_sourcing_url( 'sources', '' !== $host ? $args + array( 'host' => rawurlencode( $host ) ) : $args ),
		);
	}
	$views = array();
	foreach ( AW_SOURCE_TYPES as $t => $l ) {
		$views[ $t ] = array( $l[0], fn( $r ) => $r['type'] === $t );
	}
	$views['on']  = array( 'On', fn( $r ) => $r['on'] );
	$views['off'] = array( 'Off', fn( $r ) => ! $r['on'] );
	$state        = sanitize_key( (string) $request['state'] );
	$out          = sourceweb_list(
		$rows,
		array(
			'view'   => '' !== $state ? $state : sanitize_key( (string) $request['type'] ),
			'search' => (string) $request['search'],
			'page'   => (int) $request['page'],
		),
		array(
			'views' => $views,
			'text'  => fn( $r ) => $r['title'] . ' ' . $r['address'] . ' ' . $r['host'] . ' ' . $r['id'],
			'per'   => '' !== $host ? 500 : 50,
		)
	);
	$out['addUrl'] = sourceweb_sourcing_url(
		'sources',
		array_filter(
			array(
				'feed' => 'new',
				'host' => '' !== $host ? rawurlencode( $host ) : '',
			)
		)
	);
	return rest_ensure_response( $out );
}

/**
 * POST sources/feeds/decide.
 *
 * @param WP_REST_Request $request Request.
 */
function sourceweb_rest_feeds_decide( WP_REST_Request $request ) {
	$ids     = array_map( 'sanitize_text_field', (array) $request['ids'] );
	$changed = $ids && sourceweb_sources_feed_op( (string) $request['op'], $ids );
	return rest_ensure_response(
		array(
			'changed' => $changed,
			'message' => $changed ? __( 'Saved. The workers use this from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ),
		)
	);
}
