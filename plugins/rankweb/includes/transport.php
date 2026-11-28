<?php
/**
 * Transport (RankWeb → Transport): copy SEO titles, descriptions, focus keywords and robots settings from Yoast SEO,
 * Rank Math or All in One SEO into RankWeb's fields. A dry run is the default and writes nothing; a field that already
 * has a value is never overwritten. Reads the other plugin's stored data only (no outside call, nothing is deleted from
 * it). The rules are in class-rankweb-transport.php. Module "transport".
 *
 *   GET  rankweb/v1/transport       the sources and how many items each has data for
 *   POST rankweb/v1/transport/run   { source, apply, after } one batch of items; the report says where the next starts
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-transport.php';
require_once __DIR__ . '/class-rankweb-term-seo.php';

const RANKWEB_TRANSPORT_BATCH = 200;

add_action(
	'admin_menu',
	function () {
		add_submenu_page( AW_SEO_MENU, __( 'Transport', 'rankweb' ), __( 'Transport', 'rankweb' ), 'manage_options', 'aw-transport', 'rankweb_transport_screen' );
	}
);

/** RankWeb → Transport. */
function rankweb_transport_screen(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to see this.', 'rankweb' ), '', array( 'response' => 403 ) );
	}
	rankweb_ui_page( 'transport' );
}

/** The post types whose items are copied: the ones RankWeb's editor box covers. */
function rankweb_transport_types(): array {
	return function_exists( 'rankweb_sidebar_post_types' ) ? rankweb_sidebar_post_types() : array( 'post', 'page' );
}

/** The meta keys that show an item has data in a source (any one is enough). */
function rankweb_transport_keys( string $source ): array {
	return array(
		'yoast'    => array( '_yoast_wpseo_title', '_yoast_wpseo_metadesc', '_yoast_wpseo_focuskw', '_yoast_wpseo_meta-robots-noindex', '_yoast_wpseo_meta-robots-nofollow', '_yoast_wpseo_meta-robots-adv' ),
		'rankmath' => array( 'rank_math_robots', 'rank_math_advanced_robots' ),
		'aioseo'   => array( '_aioseop_title', '_aioseop_description', '_aioseop_keywords' ),
		'seopress' => array( '_seopress_titles_title', '_seopress_titles_desc', '_seopress_analysis_target_kw', '_seopress_robots_index', '_seopress_robots_follow', '_seopress_robots_archive', '_seopress_robots_snippet' ),
		'tsf'      => array( '_genesis_title', '_genesis_description', '_genesis_noindex', '_genesis_nofollow', '_genesis_noarchive' ),
	)[ $source ] ?? array();
}

/** All in One SEO 4's table, or '' when it is not there. */
function rankweb_transport_aioseo_table(): string {
	global $wpdb;
	$table = $wpdb->prefix . 'aioseo_posts';
	return $table === $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table ) ) ) ? $table : ''; // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- a read of another plugin's table
}

/** What the screen shows first: each source and how many items carry its data. */
function rankweb_transport_payload(): array {
	global $wpdb;
	$types = rankweb_transport_types();
	$in    = implode( ',', array_fill( 0, count( $types ), '%s' ) );
	$out   = array();
	foreach ( RankWeb_Transport::sources() as $key => $name ) {
		$keys = rankweb_transport_keys( $key );
		$n    = 0;
		if ( $keys && $types ) {
			$k = implode( ',', array_fill( 0, count( $keys ), '%s' ) );
			$n = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(DISTINCT m.post_id) FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID = m.post_id WHERE m.meta_key IN ($k) AND m.meta_value <> '' AND p.post_type IN ($in)", array_merge( $keys, $types ) ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders -- counts for the screen; placeholders built from fixed lists
		}
		if ( 'aioseo' === $key && '' !== rankweb_transport_aioseo_table() ) {
			$n += (int) $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM %i', rankweb_transport_aioseo_table() ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- counts for the screen; the table name is built from the prefix
		}
		$out[] = array( 'key' => $key, 'name' => $name, 'items' => $n );
	}
	return array( 'sources' => $out, 'batch' => RANKWEB_TRANSPORT_BATCH );
}

/** RankWeb's own values for an item, in Transport's shape. */
function rankweb_transport_current( int $id ): array {
	$get = static fn( string $k ): string => trim( (string) get_post_meta( $id, $k, true ) );
	$rm  = get_post_meta( $id, 'rank_math_robots', true );
	$rm  = is_array( $rm ) ? $rm : array_filter( array_map( 'trim', explode( ',', (string) $rm ) ) );
	return array(
		'title'       => '' !== $get( 'rank_math_title' ) ? $get( 'rank_math_title' ) : $get( '_rankweb_title' ),
		'description' => '' !== $get( 'rank_math_description' ) ? $get( 'rank_math_description' ) : $get( '_rankweb_description' ),
		'focus'       => $get( 'rank_math_focus_keyword' ),
		'noindex'     => ( '1' === $get( '_rankweb_noindex' ) || in_array( 'noindex', $rm, true ) ) ? '1' : '',
		'nofollow'    => ( '1' === $get( '_rankweb_nofollow' ) || in_array( 'nofollow', $rm, true ) ) ? '1' : '',
		'noarchive'   => ( '1' === $get( '_rankweb_noarchive' ) || in_array( 'noarchive', $rm, true ) ) ? '1' : '',
		'nosnippet'   => ( '1' === $get( '_rankweb_nosnippet' ) || in_array( 'nosnippet', $rm, true ) ) ? '1' : '',
		'max_snippet' => $get( '_rankweb_max_snippet' ),
	);
}

/** Where each field is written (the fields RankWeb's editor box reads). */
function rankweb_transport_target( string $field ): string {
	return array(
		'title'       => 'rank_math_title',
		'description' => 'rank_math_description',
		'focus'       => 'rank_math_focus_keyword',
		'noindex'     => '_rankweb_noindex',
		'nofollow'    => '_rankweb_nofollow',
		'noarchive'   => '_rankweb_noarchive',
		'nosnippet'   => '_rankweb_nosnippet',
		'max_snippet' => '_rankweb_max_snippet',
	)[ $field ];
}

/** The other plugin's stored values for one item as the meta array RankWeb_Transport::read() takes. */
function rankweb_transport_source_meta( string $source, int $id, array $aioseo_rows ): array {
	$meta = array();
	foreach ( rankweb_transport_keys( $source ) as $k ) {
		$meta[ $k ] = get_post_meta( $id, $k, true );
	}
	if ( 'aioseo' === $source && isset( $aioseo_rows[ $id ] ) ) {
		foreach ( (array) $aioseo_rows[ $id ] as $col => $v ) {
			$meta[ 'row_' . $col ] = $v;
		}
	}
	return $meta;
}

/**
 * One batch of Transport: items after ID `$after` (oldest first), `RANKWEB_TRANSPORT_BATCH` at a time.
 *
 * @param string $source 'yoast', 'rankmath' or 'aioseo'.
 * @param bool   $apply  False (the default of the screen): a dry run, nothing is written.
 * @param int    $after  The last item ID of the batch before (0 for the first).
 * @return array dry, error, updated (items changed), counts (writes per field), kept (values left because the field was filled), scanned, changes (lines, up to 25), next (0 when done).
 */
function rankweb_transport_run( string $source, bool $apply, int $after = 0, string $kind = 'posts' ): array {
	global $wpdb;
	if ( ! isset( RankWeb_Transport::sources()[ $source ] ) ) {
		return array( 'dry' => ! $apply, 'error' => __( 'Choose where to copy from.', 'rankweb' ) );
	}
	if ( 'terms' === $kind || 'users' === $kind ) {
		return rankweb_transport_run_other( $kind, $source, $apply, $after );
	}
	$types = rankweb_transport_types();
	if ( ! $types ) {
		return array( 'dry' => ! $apply, 'error' => __( 'No post types are set for the editor box.', 'rankweb' ) );
	}
	$ids = get_posts(
		array(
			'post_type'        => $types,
			'post_status'      => 'any',
			'fields'           => 'ids',
			'orderby'          => 'ID',
			'order'            => 'ASC',
			'posts_per_page'   => RANKWEB_TRANSPORT_BATCH + 1,
			'suppress_filters' => false,
			'no_found_rows'    => true,
			'rankweb_after_id' => $after,
		)
	);
	$ids  = array_values( array_filter( array_map( 'intval', $ids ), static fn( $i ) => $i > $after ) );
	$next = 0;
	if ( count( $ids ) > RANKWEB_TRANSPORT_BATCH ) {
		$ids  = array_slice( $ids, 0, RANKWEB_TRANSPORT_BATCH );
		$next = (int) end( $ids );
	}
	$rows = array();
	if ( 'aioseo' === $source && $ids && '' !== rankweb_transport_aioseo_table() ) {
		$in   = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
		$res  = (array) $wpdb->get_results( $wpdb->prepare( "SELECT post_id, title, description, keyphrases, robots_default, robots_noindex, robots_nofollow, robots_noarchive, robots_nosnippet, robots_max_snippet FROM %i WHERE post_id IN ($in)", array_merge( array( rankweb_transport_aioseo_table() ), array_map( 'intval', $ids ) ) ), ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders -- the table is another plugin's; one %d per id
		foreach ( $res as $r ) {
			$rows[ (int) $r['post_id'] ] = $r;
		}
	}
	$plans   = array();
	$changes = array();
	foreach ( $ids as $id ) {
		$plan = RankWeb_Transport::plan( RankWeb_Transport::read( $source, rankweb_transport_source_meta( $source, $id, $rows ) ), rankweb_transport_current( $id ) );
		$plans[] = $plan;
		if ( ! $plan['write'] ) {
			continue;
		}
		if ( $apply ) {
			foreach ( $plan['write'] as $field => $value ) {
				update_post_meta( $id, rankweb_transport_target( $field ), 'max_snippet' === $field ? (string) $value : ( 'focus' === $field || 'title' === $field || 'description' === $field ? sanitize_text_field( $value ) : '1' ) );
			}
		}
		if ( count( $changes ) < 25 ) {
			/* translators: 1: item title, 2: the fields copied. */
			$changes[] = sprintf( __( '%1$s: %2$s', 'rankweb' ), get_the_title( $id ) ?: '#' . $id, implode( ', ', array_keys( $plan['write'] ) ) );
		}
	}
	$t = RankWeb_Transport::tally( $plans );
	return array(
		'dry'     => ! $apply,
		'updated' => $t['changed'],
		'counts'  => $t['fields'],
		'kept'    => $t['kept'],
		'scanned' => $t['items'],
		'changes' => $changes,
		'next'    => $next,
	);
}

/**
 * One batch of Transport for terms or users (title, description and noindex only).
 *
 * @param string $kind   'terms' or 'users'.
 * @param string $source Source key.
 * @param bool   $apply  False: a dry run.
 * @param int    $after  The last ID of the batch before.
 */
function rankweb_transport_run_other( string $kind, string $source, bool $apply, int $after ): array {
	global $wpdb;
	$limit = RANKWEB_TRANSPORT_BATCH + 1;
	$map   = array(); // id => taxonomy ('' for users)
	if ( 'terms' === $kind ) {
		$tax = function_exists( 'rankweb_term_seo_taxonomies' ) ? rankweb_term_seo_taxonomies() : array( 'category', 'post_tag' );
		if ( ! $tax ) {
			return array( 'dry' => ! $apply, 'error' => __( 'No taxonomies have the SEO fields.', 'rankweb' ) );
		}
		$in   = implode( ',', array_fill( 0, count( $tax ), '%s' ) );
		$rows = (array) $wpdb->get_results( $wpdb->prepare( "SELECT term_id, taxonomy FROM {$wpdb->term_taxonomy} WHERE taxonomy IN ($in) AND term_id > %d ORDER BY term_id ASC LIMIT %d", array_merge( $tax, array( $after, $limit ) ) ), ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders -- placeholders built from a fixed list
		foreach ( $rows as $r ) {
			$map[ (int) $r['term_id'] ] = (string) $r['taxonomy'];
		}
	} else {
		foreach ( (array) $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM {$wpdb->users} WHERE ID > %d ORDER BY ID ASC LIMIT %d", $after, $limit ) ) as $id ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$map[ (int) $id ] = '';
		}
	}
	$ids  = array_keys( $map );
	$next = 0;
	if ( count( $ids ) > RANKWEB_TRANSPORT_BATCH ) {
		$ids  = array_slice( $ids, 0, RANKWEB_TRANSPORT_BATCH );
		$next = (int) end( $ids );
	}
	$yoast = 'terms' === $kind && 'yoast' === $source ? (array) get_option( 'wpseo_taxonomy_meta', array() ) : array();
	$rows  = array();
	if ( 'terms' === $kind && 'aioseo' === $source && $ids ) {
		$table = $wpdb->prefix . 'aioseo_terms';
		if ( $table === $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table ) ) ) ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$in = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
			foreach ( (array) $wpdb->get_results( $wpdb->prepare( "SELECT term_id, title, description, robots_default, robots_noindex FROM %i WHERE term_id IN ($in)", array_merge( array( $table ), array_map( 'intval', $ids ) ) ), ARRAY_A ) as $r ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders -- another plugin's table; one %d per id
				$rows[ (int) $r['term_id'] ] = $r;
			}
		}
	}
	$plans   = array();
	$changes = array();
	foreach ( $ids as $id ) {
		if ( 'terms' === $kind ) {
			$meta = array();
			foreach ( array( 'rank_math_robots', '_seopress_titles_title', '_seopress_titles_desc', '_seopress_robots_index', 'autodescription-term-settings' ) as $k ) {
				$meta[ $k ] = get_term_meta( $id, $k, true );
			}
			foreach ( (array) ( $yoast[ $map[ $id ] ][ $id ] ?? array() ) as $k => $v ) {
				$meta[ $k ] = $v;
			}
			foreach ( (array) ( $rows[ $id ] ?? array() ) as $k => $v ) {
				$meta[ 'row_' . $k ] = $v;
			}
			$in  = RankWeb_Transport::read_term( $source, $meta );
			$own = array();
			foreach ( RankWeb_Term_Seo::KEYS as $f => $key ) {
				$own[ $f ] = (string) get_term_meta( $id, $key, true );
			}
			$cur = rankweb_term_seo_values_for_transport( $id, $own );
		} else {
			$meta = array();
			foreach ( array( 'wpseo_title', 'wpseo_metadesc', 'wpseo_noindex_author', 'rank_math_title', 'rank_math_description', 'rank_math_robots', 'autodescription-user-settings' ) as $k ) {
				$meta[ $k ] = get_user_meta( $id, $k, true );
			}
			$in  = RankWeb_Transport::read_user( $source, $meta );
			$cur = array();
			foreach ( RankWeb_Term_Seo::USER_KEYS as $f => $key ) {
				$cur[ $f ] = (string) get_user_meta( $id, $key, true );
			}
		}
		$in   = array_intersect_key( $in, array_flip( array( 'title', 'description', 'noindex' ) ) );
		$plan = RankWeb_Transport::plan( $in, $cur );
		$plans[] = $plan;
		if ( ! $plan['write'] ) {
			continue;
		}
		if ( $apply ) {
			$keys = 'terms' === $kind ? RankWeb_Term_Seo::KEYS : RankWeb_Term_Seo::USER_KEYS;
			foreach ( $plan['write'] as $field => $value ) {
				$val = 'noindex' === $field ? '1' : sanitize_text_field( $value );
				'terms' === $kind ? update_term_meta( $id, $keys[ $field ], $val ) : update_user_meta( $id, $keys[ $field ], $val );
			}
		}
		if ( count( $changes ) < 25 ) {
			$name = 'terms' === $kind ? ( get_term( $id )->name ?? '#' . $id ) : ( get_userdata( $id )->display_name ?? '#' . $id );
			/* translators: 1: term or user name, 2: the fields copied. */
			$changes[] = sprintf( __( '%1$s: %2$s', 'rankweb' ), $name, implode( ', ', array_keys( $plan['write'] ) ) );
		}
	}
	$t = RankWeb_Transport::tally( $plans );
	return array( 'dry' => ! $apply, 'updated' => $t['changed'], 'counts' => $t['fields'], 'kept' => $t['kept'], 'scanned' => $t['items'], 'changes' => $changes, 'next' => $next );
}

/** A term's values for Transport: RankWeb's own, else what Rank Math stored (the page already shows those). */
function rankweb_term_seo_values_for_transport( int $term_id, array $own ): array {
	return array(
		'title'       => $own['title'],
		'description' => $own['description'],
		'noindex'     => $own['noindex'],
	);
}

add_filter(
	'posts_where',
	function ( $where, $query ) {
		global $wpdb;
		$after = (int) $query->get( 'rankweb_after_id' );
		return $after > 0 ? $where . $wpdb->prepare( " AND {$wpdb->posts}.ID > %d", $after ) : $where;
	},
	10,
	2
);

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			RANKWEB_REST,
			'/transport',
			array(
				'methods'             => 'GET',
				'permission_callback' => rankweb_rest_can( 'manage_options' ),
				'callback'            => fn() => rest_ensure_response( rankweb_transport_payload() ),
			)
		);
		register_rest_route(
			RANKWEB_REST,
			'/transport/run',
			array(
				'methods'             => 'POST',
				'permission_callback' => rankweb_rest_can( 'manage_options' ),
				'args'                => array(
					'source' => array( 'type' => 'string', 'default' => '' ),
					'apply'  => array( 'type' => 'boolean', 'default' => false ),
					'after'  => array( 'type' => 'integer', 'default' => 0 ),
					'kind'   => array( 'type' => 'string', 'default' => 'posts' ),
				),
				'callback'            => fn( WP_REST_Request $req ) => rest_ensure_response( rankweb_transport_run( sanitize_key( (string) $req['source'] ), (bool) $req['apply'], max( 0, (int) $req['after'] ), in_array( (string) $req['kind'], array( 'posts', 'terms', 'users' ), true ) ? (string) $req['kind'] : 'posts' ) ),
			)
		);
	}
);

/** The classic page's body, for a site with no Kits Core: one form, dry run by default. */
function rankweb_transport_body(): void {
	echo '<p>' . esc_html__( 'Copy SEO titles, descriptions, focus keywords and robots settings from another SEO plugin. A field that already has a value is never overwritten. Nothing is deleted from the other plugin.', 'rankweb' ) . '</p>';
	$report = null;
	if ( 'POST' === ( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ?? '' ) ) ) && current_user_can( 'manage_options' ) && check_admin_referer( 'rankweb_transport' ) ) {
		$apply  = ! empty( $_POST['apply'] );
		$source = sanitize_key( wp_unslash( $_POST['source'] ?? '' ) );
		$kind   = sanitize_key( wp_unslash( $_POST['kind'] ?? 'posts' ) );
		$report = array( 'dry' => ! $apply, 'updated' => 0, 'kept' => 0, 'scanned' => 0 );
		$after  = 0;
		do {
			$r = rankweb_transport_run( $source, $apply, $after, in_array( $kind, array( 'posts', 'terms', 'users' ), true ) ? $kind : 'posts' );
			if ( ! empty( $r['error'] ) ) {
				$report = $r;
				break;
			}
			foreach ( array( 'updated', 'kept', 'scanned' ) as $k ) {
				$report[ $k ] += (int) $r[ $k ];
			}
			$after = (int) $r['next'];
		} while ( $after > 0 );
	}
	if ( $report ) {
		if ( ! empty( $report['error'] ) ) {
			wp_admin_notice( esc_html( $report['error'] ), array( 'type' => 'error' ) );
		} else {
			/* translators: 1: items changed or that would change, 2: items looked at, 3: values left because the field was filled. */
			$line = sprintf( __( '%1$d items of %2$d looked at; %3$d values left because the field already had one.', 'rankweb' ), $report['updated'], $report['scanned'], $report['kept'] );
			wp_admin_notice( esc_html( ( $report['dry'] ? __( 'Dry run, nothing was written. ', 'rankweb' ) : __( 'Copied. ', 'rankweb' ) ) . $line ), array( 'type' => 'success' ) );
		}
	}
	echo '<form method="post">';
	wp_nonce_field( 'rankweb_transport' );
	echo '<p><label>' . esc_html__( 'Copy from', 'rankweb' ) . ' <select name="source">';
	foreach ( RankWeb_Transport::sources() as $key => $name ) {
		echo '<option value="' . esc_attr( $key ) . '">' . esc_html( $name ) . '</option>';
	}
	echo '</select></label></p><p><label>' . esc_html__( 'What to copy', 'rankweb' ) . ' <select name="kind"><option value="posts">' . esc_html__( 'Posts and pages', 'rankweb' ) . '</option><option value="terms">' . esc_html__( 'Categories and tags (title, description, noindex)', 'rankweb' ) . '</option><option value="users">' . esc_html__( 'Authors (title, description, noindex)', 'rankweb' ) . '</option></select></label></p><p><label><input type="checkbox" name="apply" value="1" /> ' . esc_html__( 'Write the changes (leave empty for a dry run)', 'rankweb' ) . '</label></p>';
	submit_button( __( 'Run', 'rankweb' ), 'primary', 'submit', false );
	echo '</form>';
}
