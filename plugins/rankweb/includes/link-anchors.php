<?php
/**
 * Internal links, phase 3: the anchor mix (docs/org/rankweb-org-plan.md (Appendix A)).
 *
 * - Every link recorded in {prefix}aw_links gets an anchor type (RankWeb_Anchor, class-aw-anchor.php): exact, partial,
 *   branded, generic, naked, image, long_tail or other. The type is written with the row (rankweb_link_store()).
 * - For each target the share of each type is worked out from those rows by the audit (link-audit.php) and kept in the
 *   transient aw_seo_anchor_mix. RankWeb → Internal links → Anchor mix lists the targets with their shares and warns when
 *   exact match goes over its limit (default 20%) or any other type goes over its limit (default 60%). A target with
 *   fewer links than the minimum (default 5) gets no warning.
 * - The auto-linker reads that snapshot (one transient read, no query per keyword): before it links a keyword it asks
 *   rankweb_anchor_ok(), and a keyword that would put its target over a limit is skipped, so the target is linked by
 *   another of its keywords, or not at all in that item. The snapshot is the last audit's: it changes once a day, and a
 *   page already cached keeps its links until it is built again.
 * - REST: GET rankweb/v1/links/anchors (warn, page, per_page), manage_rankweb.
 *
 * @package aw-seo-extras
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-aw-anchor.php';

/** The limits as RankWeb_Anchor::mix() reads them. */
function rankweb_anchor_limits(): array {
	return array(
		'exact_max' => max( 0, (int) AW_LINK_ANCHOR_EXACT_MAX ),
		'type_max'  => max( 0, (int) AW_LINK_ANCHOR_TYPE_MAX ),
		'min_links' => max( 1, (int) AW_LINK_ANCHOR_MIN ),
	);
}

/** The settings that change how an anchor is typed, as one string (part of an item's cache key). */
function rankweb_anchor_settings_key(): string {
	return md5( (string) wp_json_encode( array( (array) AW_LINK_BRAND, (array) AW_LINK_GENERIC, (int) AW_LINK_LONG_WORDS ) ) );
}

/** The parts of the sorter's context that are the same for every target (brand names, generic anchors, long). */
function rankweb_anchor_base_ctx(): array {
	static $memo = null;
	if ( null === $memo ) {
		$memo = array(
			'brand'      => RankWeb_Anchor::normalize_list( (array) AW_LINK_BRAND ),
			'generic'    => RankWeb_Anchor::normalize_list( (array) AW_LINK_GENERIC ),
			'long_words' => max( 1, (int) AW_LINK_LONG_WORDS ),
		);
	}
	return $memo;
}

/**
 * The type of an anchor for a target.
 *
 * @param string $anchor   Anchor text (the ALT text for an image).
 * @param int    $target   Target item ID, 0 when the address is no item.
 * @param bool   $is_image The link holds an image and no text.
 */
function rankweb_anchor_type( string $anchor, int $target, bool $is_image = false ): string {
	static $kws = array();
	if ( $target > 0 && ! isset( $kws[ $target ] ) ) {
		$kws[ $target ] = array_values( array_filter( array_map( array( 'RankWeb_Linker', 'normalize' ), rankweb_link_keywords( $target ) ), 'strlen' ) );
	}
	return RankWeb_Anchor::type(
		$anchor,
		array(
			'keywords' => $target > 0 ? $kws[ $target ] : array(),
			'is_image' => $is_image,
		) + rankweb_anchor_base_ctx()
	);
}

/**
 * Links per target and type, from the links table (links to items only).
 *
 * @return array Target ID => array( type => links ).
 */
function rankweb_anchor_counts(): array {
	global $wpdb;
	$out  = array();
	$rows = (array) $wpdb->get_results( $wpdb->prepare( "SELECT target_id, anchor_type, COUNT(*) AS n FROM %i WHERE target_id > 0 AND anchor_type <> '' GROUP BY target_id, anchor_type", rankweb_link_table( 'links' ) ), ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- RankWeb's own table, once per audit.
	foreach ( $rows as $r ) {
		$out[ (int) $r['target_id'] ][ (string) $r['anchor_type'] ] = (int) $r['n'];
	}
	return $out;
}

/**
 * The last audit's counts, from the transient. Read only unless $build: only the audit and the screen build it.
 *
 * @param bool $build Build it when it is missing.
 */
function rankweb_anchor_snapshot( bool $build = false ): array {
	static $memo = null;
	if ( null !== $memo ) {
		return $memo;
	}
	$hit = get_transient( 'aw_seo_anchor_mix' );
	if ( ! is_array( $hit ) ) {
		if ( ! $build ) {
			return array(); // not remembered: nothing is refused (and not kept, so a build later in the request is read)
		}
		$hit = rankweb_anchor_counts();
		set_transient( 'aw_seo_anchor_mix', $hit, 2 * DAY_IN_SECONDS );
	}
	$memo = $hit;
	return $hit;
}

/** Build the snapshot again (the audit) and count the targets over a limit. */
function rankweb_anchor_rebuild(): array {
	$counts = rankweb_anchor_counts();
	set_transient( 'aw_seo_anchor_mix', $counts, 2 * DAY_IN_SECONDS );
	$limits = rankweb_anchor_limits();
	$warn   = 0;
	foreach ( $counts as $c ) {
		if ( RankWeb_Anchor::mix( $c, $limits )['warn'] ) {
			++$warn;
		}
	}
	return array(
		'targets' => count( $counts ),
		'warn'    => $warn,
	);
}

/**
 * The auto-linker's question: may this keyword be an anchor to this target, or would that put the target over a limit?
 *
 * @param int    $target Target item ID.
 * @param string $kw     Keyword, normalised (the anchor).
 */
function rankweb_anchor_ok( int $target, string $kw ): bool {
	$snap = rankweb_anchor_snapshot();
	return ! $snap || RankWeb_Anchor::room( (array) ( $snap[ $target ] ?? array() ), rankweb_anchor_type( $kw, $target ), rankweb_anchor_limits() );
}

/** The types and their texts. */
function rankweb_anchor_labels(): array {
	return array(
		'exact'     => __( 'Exact', 'aw-seo-extras' ),
		'partial'   => __( 'Partial', 'aw-seo-extras' ),
		'branded'   => __( 'Branded', 'aw-seo-extras' ),
		'generic'   => __( 'Generic', 'aw-seo-extras' ),
		'naked'     => __( 'Naked URL', 'aw-seo-extras' ),
		'image'     => __( 'Image', 'aw-seo-extras' ),
		'long_tail' => __( 'Long-tail', 'aw-seo-extras' ),
		'other'     => __( 'Other', 'aw-seo-extras' ),
	);
}

/**
 * One page of targets with their mix, most linked first.
 *
 * @param bool $warn_only Only targets over a limit.
 * @param int  $page      Page, from 1.
 * @param int  $per_page  Rows per page.
 * @return array items (post_id, title, url, total, pct, warn), total.
 */
function rankweb_anchor_page( bool $warn_only, int $page, int $per_page ): array {
	$limits = rankweb_anchor_limits();
	$rows   = array();
	foreach ( rankweb_anchor_snapshot( true ) as $tid => $counts ) {
		$mix = RankWeb_Anchor::mix( (array) $counts, $limits );
		if ( $warn_only && ! $mix['warn'] ) {
			continue;
		}
		$rows[ (int) $tid ] = $mix;
	}
	uksort(
		$rows,
		fn( $a, $b ) => $rows[ $a ]['total'] === $rows[ $b ]['total'] ? $a <=> $b : $rows[ $b ]['total'] <=> $rows[ $a ]['total']
	);
	$total = count( $rows );
	$items = array();
	foreach ( array_slice( $rows, ( max( 1, $page ) - 1 ) * $per_page, $per_page, true ) as $tid => $mix ) {
		$items[] = array(
			'post_id' => $tid,
			'title'   => (string) get_the_title( $tid ),
			'url'     => (string) get_permalink( $tid ),
			'total'   => $mix['total'],
			'pct'     => (object) $mix['pct'],
			'warn'    => $mix['warn'],
		);
	}
	return array(
		'items' => $items,
		'total' => $total,
	);
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'rankweb/v1',
			'/links/anchors',
			array(
				'methods'             => 'GET',
				'permission_callback' => rankweb_rest_can( RANKWEB_CAP ),
				'args'                => array(
					'warn'     => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'page'     => array(
						'type'    => 'integer',
						'default' => 1,
						'minimum' => 1,
					),
					'per_page' => array(
						'type'    => 'integer',
						'default' => 25,
						'minimum' => 1,
						'maximum' => 100,
					),
				),
				'callback'            => fn( WP_REST_Request $req ) => rest_ensure_response( rankweb_anchor_page( (bool) $req['warn'], (int) $req['page'], (int) $req['per_page'] ) + array( 'limits' => rankweb_anchor_limits() ) ),
			)
		);
	}
);

/** The "Anchor mix" view of RankWeb → Internal links. */
function rankweb_anchor_screen(): void {
	$warn   = isset( $_GET['warn'] ); // phpcs:ignore WordPress.Security.NonceVerification -- a filter on a read-only list.
	$paged  = max( 1, absint( wp_unslash( $_GET['paged'] ?? 1 ) ) ); // phpcs:ignore WordPress.Security.NonceVerification -- a filter on a read-only list.
	$per    = 25;
	$labels = rankweb_anchor_labels();
	$limits = rankweb_anchor_limits();
	$base   = add_query_arg( 'view', 'anchors', admin_url( 'admin.php?page=aw-links' ) );
	$data   = rankweb_anchor_page( $warn, $paged, $per );
	/* translators: 1: limit for exact match in percent, 2: limit for any other type in percent, 3: fewest links. */
	echo '<p>' . esc_html( sprintf( __( 'The share of each anchor type among the links to an item. A warning shows when exact match is over %1$s%% or another type is over %2$s%% (only for items with %3$s links or more). Change the limits under RankWeb → Settings → Internal links.', 'aw-seo-extras' ), number_format_i18n( $limits['exact_max'] ), number_format_i18n( $limits['type_max'] ), number_format_i18n( $limits['min_links'] ) ) ) . '</p>';
	echo '<ul class="subsubsub"><li>' . ( $warn ? '<a href="' . esc_url( $base ) . '">' : '<strong>' ) . esc_html__( 'All items', 'aw-seo-extras' ) . ( $warn ? '</a>' : '</strong>' ) . ' | </li><li>' . ( $warn ? '<strong>' : '<a href="' . esc_url( add_query_arg( 'warn', '1', $base ) ) . '">' ) . esc_html__( 'With a warning', 'aw-seo-extras' ) . ( $warn ? '</strong>' : '</a>' ) . '</li></ul><br class="clear">'; // phpcs:ignore WordPress.Security.EscapeOutput -- each part is escaped above.
	$cols         = array(
		'item'  => __( 'Item', 'aw-seo-extras' ),
		'total' => __( 'Links in', 'aw-seo-extras' ),
	);
	$cols        += $labels;
	$cols['warn'] = __( 'Warning', 'aw-seo-extras' );
	$cells        = array();
	foreach ( $data['items'] as $it ) {
		$pct  = (array) $it['pct'];
		$cell = array(
			'item'  => '<a href="' . esc_url( (string) get_edit_post_link( $it['post_id'] ) ) . '">' . esc_html( '' !== $it['title'] ? $it['title'] : __( '(no title)', 'aw-seo-extras' ) ) . '</a> <a href="' . esc_url( $it['url'] ) . '">' . esc_html__( 'View', 'aw-seo-extras' ) . '</a>',
			'total' => esc_html( number_format_i18n( $it['total'] ) ),
		);
		foreach ( array_keys( $labels ) as $t ) {
			$cell[ $t ] = esc_html( number_format_i18n( (float) ( $pct[ $t ] ?? 0 ), 1 ) ) . '%';
		}
		$over = array();
		foreach ( $it['warn'] as $t ) {
			/* translators: 1: anchor type, 2: its limit in percent. */
			$over[] = esc_html( sprintf( __( '%1$s over %2$s%%', 'aw-seo-extras' ), $labels[ $t ] ?? $t, number_format_i18n( 'exact' === $t ? $limits['exact_max'] : $limits['type_max'] ) ) );
		}
		$cell['warn'] = implode( '<br>', $over );
		$cells[]      = $cell;
	}
	rankweb_seo_extras_simple_table(
		'aw-anchor-mix',
		$cols,
		$cells,
		array(
			'per_page' => $per,
			'total'    => $data['total'],
			'primary'  => 'item',
			'empty'    => __( 'No links to items are recorded yet. Run the audit first.', 'aw-seo-extras' ),
		)
	);
}
