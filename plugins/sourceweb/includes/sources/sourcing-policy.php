<?php
/**
 * Sourcing policy managed in WP Admin (Sourcing): sources (publishers) and relevance keywords. Moved from Kits Core
 * (24 Oct 2026); the sourced post types, sourceweb_host(), sourceweb_publishers() and the option constants stay there.
 *
 * - Publishers: every host the workers send is recorded automatically. Each is Allowed, Neutral or Blocked.
 *   Blocked hosts are refused by the ingest endpoint. With "Only allowed publishers from aggregator feeds" on
 *   (off by default), aggregator items (Google News, Apple News...) from hosts that are not Allowed are refused too.
 * - Keywords: strong / animal / context / exclude lists. When the relevance filter is on, an item is kept if
 *   it has a strong term, or an animal term and a context term, and no exclude term.
 * - The workers read the same policy from GET /wp-json/aw/v1/sourcing-policy before each run, so blocked or
 *   irrelevant items are skipped before they are summarised; the endpoint enforces it again on arrival.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Aggregator feeds (Google News today; Apple News or others later): feed ids starting gnews-, applenews- or agg-.
 *
 * @param string $feed Worker feed id.
 * @return bool
 */
function sourceweb_is_aggregator_feed( $feed ) {
	return (bool) preg_match( '/^(gnews|applenews|agg)-/', (string) $feed );
}

/** A publisher's status in words with a core dashicon (no custom CSS). */
function sourceweb_publisher_status_html( $st ) {
	$map = array(
		'allow'   => array( 'yes-alt', 'Allowed' ),
		'neutral' => array( 'minus', 'Neutral' ),
		'block'   => array( 'dismiss', 'Blocked' ),
	);
	$m = $map[ $st ] ?? $map['neutral'];
	return '<span class="dashicons dashicons-' . esc_attr( $m[0] ) . '" aria-hidden="true"></span> ' . esc_html( $m[1] );
}

/**
 * Change log of the Sourcing screen: who changed what, when (newest first, last 1,000 kept; 300 before 25 Oct 2026).
 * An add, edit or delete also gives the value before and after (shown as "old → new"); both are optional, so the
 * existing calls and entries stay as they are.
 *
 * @param string $tab  Tab.
 * @param string $what What changed, in words.
 * @param mixed  $old  Value before (null: not given; for an add, '' or an empty list).
 * @param mixed  $new  Value after (null: not given; for a delete, '' or an empty list).
 */
function sourceweb_src_log( $tab, $what, $old = null, $new = null ) {
	if ( '' === trim( $what ) ) {
		return;
	}
	$log = (array) get_option( 'kits_sourcing_log', array() );
	$log = sourceweb_src_log_push( $log, array( 'at' => current_time( 'mysql' ), 'user' => wp_get_current_user()->display_name, 'tab' => $tab, 'what' => $what ), $old, $new );
	update_option( 'kits_sourcing_log', $log, false );
}

/**
 * Several change log entries in one write (a bulk action): each [tab, what, old, new], old and new optional.
 *
 * @param array[] $entries Entries, in the order they happened.
 */
function sourceweb_src_log_many( array $entries ) {
	$entries = array_filter( $entries, fn( $e ) => '' !== trim( (string) ( $e[1] ?? '' ) ) );
	if ( ! $entries ) {
		return;
	}
	$log  = (array) get_option( 'kits_sourcing_log', array() );
	$user = wp_get_current_user()->display_name;
	foreach ( $entries as $e ) {
		$log = sourceweb_src_log_push( $log, array( 'at' => current_time( 'mysql' ), 'user' => $user, 'tab' => (string) $e[0], 'what' => (string) $e[1] ), $e[2] ?? null, $e[3] ?? null );
	}
	update_option( 'kits_sourcing_log', $log, false );
}

/** What changed between two lists, in words ("added: a, b; removed: c"). */
function sourceweb_src_diff( $label, $old, $new ) {
	$add = array_diff( (array) $new, (array) $old );
	$del = array_diff( (array) $old, (array) $new );
	$out = array();
	if ( $add ) {
		$out[] = 'added ' . implode( ', ', $add );
	}
	if ( $del ) {
		$out[] = 'removed ' . implode( ', ', $del );
	}
	return $out ? $label . ': ' . implode( '; ', $out ) : '';
}

/**
 * The older names of the three change log functions, kept for existing callers (Kits Core and older SourceWeb code).
 */
if ( ! function_exists( 'kits_sourcing_log' ) ) {
	/**
	 * Older name of sourceweb_src_log().
	 *
	 * @param string $tab  Tab.
	 * @param string $what What changed, in words.
	 * @param mixed  $old  Value before.
	 * @param mixed  $new  Value after.
	 */
	function kits_sourcing_log( $tab, $what, $old = null, $new = null ) {
		sourceweb_src_log( $tab, $what, $old, $new );
	}
}
if ( ! function_exists( 'kits_sourcing_log_many' ) ) {
	/**
	 * Older name of sourceweb_src_log_many().
	 *
	 * @param array[] $entries Entries.
	 */
	function kits_sourcing_log_many( array $entries ) {
		sourceweb_src_log_many( $entries );
	}
}
if ( ! function_exists( 'kits_sourcing_diff' ) ) {
	/**
	 * Older name of sourceweb_src_diff().
	 *
	 * @param string $label The list's name.
	 * @param array  $old   Before.
	 * @param array  $new   After.
	 */
	function kits_sourcing_diff( $label, $old, $new ) {
		return sourceweb_src_diff( $label, $old, $new );
	}
}

/** Relevance settings. */
function sourceweb_relevance() {
	$r = get_option( SOURCEWEB_REL_OPTION );
	return is_array( $r ) ? $r : array( 'enabled' => false, 'gnews_allow_only' => false, 'strong' => array(), 'animal' => array(), 'context' => array(), 'exclude' => array() ); // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- needed here and bounded; see the surrounding code.
}

/** Seed once: empty relevance lists (filter off), and the publisher lists a site supplies through filters; the hosts already in the content are counted. */
add_action(
	'init',
	function () {
		if ( false !== get_option( SOURCEWEB_REL_OPTION ) ) {
			return;
		}
		$now  = current_time( 'Y-m-d' );
		$pubs = array();
		// No publishers are blocked or allowed to start with; a site supplies its own starting lists with these filters.
		foreach ( (array) apply_filters( 'sourceweb_default_blocked_publishers', array() ) as $h ) {
			$pubs[ $h ] = array( 'status' => 'block', 'name' => '', 'count' => 0, 'first' => $now, 'last' => '' );
		}
		foreach ( (array) apply_filters( 'sourceweb_default_allowed_publishers', array() ) as $h ) {
			$pubs[ $h ] = array( 'status' => 'allow', 'name' => '', 'count' => 0, 'first' => $now, 'last' => '' );
		}
		// Hosts already in the content, with their counts.
		global $wpdb;
		$rows = $wpdb->get_results( "SELECT m.meta_value url, n.meta_value name, p.post_date d FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'aw_source_url' LEFT JOIN {$wpdb->postmeta} n ON n.post_id = p.ID AND n.meta_key = 'aw_source_name' WHERE p.post_type IN ('" . implode( "','", array_map( 'esc_sql', kits_sourced_types() ) ) . "')" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.NotPrepared -- fixed SQL; the post types are the plugin's own list, escaped
		foreach ( $rows as $r ) {
			$h = sourceweb_host( $r->url );
			if ( ! $h ) {
				continue;
			}
			$rec            = $pubs[ $h ] ?? array( 'status' => 'neutral', 'name' => '', 'count' => 0, 'first' => substr( $r->d, 0, 10 ), 'last' => '' );
			$rec['count']   = (int) $rec['count'] + 1;
			$rec['name']    = $rec['name'] ? $rec['name'] : (string) $r->name;
			$rec['last']    = max( (string) $rec['last'], substr( $r->d, 0, 10 ) );
			$rec['first']   = min( (string) $rec['first'], substr( $r->d, 0, 10 ) );
			$pubs[ $h ]     = $rec;
		}
		update_option( SOURCEWEB_PUB_OPTION, $pubs, false );
		update_option(
			SOURCEWEB_REL_OPTION,
			array(
				'enabled'          => false,
				'gnews_allow_only' => false,
				'strong'           => array(),
				'animal'           => array(),
				'context'          => array(),
				'exclude'          => array(), // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- needed here and bounded; see the surrounding code.
			),
			false
		);
	}
);

/**
 * Does text contain a term? Whole-word for short ASCII terms, substring otherwise (Hindi, phrases).
 *
 * @param string $hay  Lowercased text.
 * @param string $term Term.
 * @return bool
 */
function sourceweb_has_term( $hay, $term ) {
	$t = mb_strtolower( trim( $term ) );
	if ( '' === $t ) {
		return false;
	}
	if ( str_ends_with( $t, '*' ) ) { // a prefix ("steriliz*"): the shared matcher, as in the workers (policy.has_term)
		return sourceweb_match_term( $hay, $t );
	}
	if ( preg_match( "/^[a-z0-9 \\-'’]+$/u", $t ) ) { // Latin terms: whole words only, plural allowed ("hen" no longer matches "when")
		return (bool) preg_match( '/(?<![a-z0-9])' . preg_quote( $t, '/' ) . '(?:s|es)?(?![a-z0-9])/u', $hay );
	}
	return false !== mb_strpos( $hay, $t );
}

/**
 * Relevance verdict for a piece of text under the current keyword lists.
 *
 * @param string $text Title and summary.
 * @return array{0: bool, 1: string} keep?, reason.
 */
function sourceweb_relevance_verdict( $text ) {
	$r   = function_exists( 'sourceweb_sourcing_kw_on' ) && sourceweb_sourcing_kw_on() ? sourceweb_sourcing_kw_lists() : sourceweb_relevance(); // phase 2: the keyword table
	$hay = mb_strtolower( $text );
	foreach ( (array) $r['exclude'] as $t ) {
		if ( sourceweb_has_term( $hay, $t ) ) {
			return array( false, 'exclude term: ' . $t );
		}
	}
	foreach ( (array) $r['strong'] as $t ) {
		if ( sourceweb_has_term( $hay, $t ) ) {
			return array( true, 'strong term: ' . $t );
		}
	}
	$a = null;
	foreach ( (array) $r['animal'] as $t ) {
		if ( sourceweb_has_term( $hay, $t ) ) {
			$a = $t;
			break;
		}
	}
	if ( $a ) {
		foreach ( (array) $r['context'] as $t ) {
			if ( sourceweb_has_term( $hay, $t ) ) {
				return array( true, "animal term: {$a} + context term: {$t}" );
			}
		}
		return array( false, "animal term ({$a}) without a context term" );
	}
	return array( false, 'no animal or strong term' );
}

/**
 * Record a host and decide whether an incoming item may be stored.
 * Called by sourceweb_ingest() before anything is created.
 *
 * @param string $url   Source URL.
 * @param string $name  Publisher name.
 * @param string $feed  Worker feed id (gnews-* for Google News).
 * @param string $text  Title + summary.
 * @return string '' to accept, or 'blocked' / 'filtered'.
 */
function sourceweb_sourcing_gate( $url, $name, $feed, $text ) {
	$host = sourceweb_host( $url );
	if ( ! $host ) {
		return '';
	}
	$pubs = sourceweb_publishers();
	$rec  = $pubs[ $host ] ?? array( 'status' => 'neutral', 'name' => '', 'count' => 0, 'first' => current_time( 'Y-m-d' ), 'last' => '' );
	if ( 'relay' === ( $rec['kind'] ?? '' ) ) { // a relay-only site sends its first item: from now on a publisher (relay kept)
		unset( $rec['kind'] );
		$rec['status'] = $rec['status'] ?? 'neutral';
	}
	$rec['name']  = $rec['name'] ? $rec['name'] : sanitize_text_field( $name );
	$rec['last']  = current_time( 'Y-m-d' );
	$rec['count'] = (int) $rec['count'] + 1;
	$pubs[ $host ] = $rec;
	update_option( SOURCEWEB_PUB_OPTION, $pubs, false );

	$rel = sourceweb_relevance();
	if ( 'block' === $rec['status'] ) {
		return 'blocked';
	}
	if ( ! empty( $rel['gnews_allow_only'] ) && sourceweb_is_aggregator_feed( $feed ) && 'allow' !== $rec['status'] ) {
		return 'blocked';
	}
	if ( ! empty( $rel['enabled'] ) && 'allow' !== $rec['status'] && ! sourceweb_relevance_verdict( $text )[0] ) {
		return 'filtered';
	}
	// Exclude keywords always apply, filter on or off and whatever the publisher, as in the workers (owner's decision 14,
	// 25 Oct 2026; policy.py verdict).
	$excl = function_exists( 'sourceweb_sourcing_kw_on' ) && sourceweb_sourcing_kw_on() ? sourceweb_sourcing_kw_lists()['exclude'] : (array) ( $rel['exclude'] ?? array() );
	$hay  = mb_strtolower( $text );
	foreach ( $excl as $t ) {
		if ( sourceweb_has_term( $hay, (string) $t ) ) {
			return 'filtered';
		}
	}
	return '';
}

/* ---------- Policy endpoint for the workers ---------- */

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'aw/v1',
			'/sourcing-policy',
			array(
				'methods'             => 'GET',
				'permission_callback' => 'sourceweb_ingest_can',
				'callback'            => 'sourceweb_sourcing_policy_payload',
			)
		);
	}
);

/**
 * The sourcing policy the workers read. From phase 4 (owner, 25 Oct 2026) the v1 keys are not sent: relevance holds
 * only its switch and config only the v2 blocks (retire-model.php sourceweb_retire_policy()). The v1 code stays, so a
 * rollback to phase 3 sends them again.
 *
 * @return array
 */
function sourceweb_sourcing_policy_payload() {
	$pubs = sourceweb_publishers();
	$rel  = sourceweb_relevance();
	$by   = fn( $s ) => array_values( array_keys( array_filter( $pubs, fn( $p ) => ( $p['status'] ?? '' ) === $s ) ) );
	$data = array(
		'publishers' => array( 'blocked' => $by( 'block' ), 'allowed' => $by( 'allow' ), 'gnews_allow_only' => ! empty( $rel['gnews_allow_only'] ) ),
		'relevance'  => array( 'enabled' => ! empty( $rel['enabled'] ), 'strong' => $rel['strong'] ?? array(), 'animal' => $rel['animal'] ?? array(), 'context' => $rel['context'] ?? array(), 'exclude' => $rel['exclude'] ?? array() ), // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- needed here and bounded; see the surrounding code.
	);
	$data = apply_filters( 'kits_sourcing_policy', $data ); // a site adds its source lists here // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- a hook of WordPress core, another plugin, or the shared Kits set
	if ( sourceweb_sourcing_phase() < 4 || ! function_exists( 'sourceweb_retire_policy' ) ) {
		return $data;
	}
	// Phase 4: the keyword table always goes (also with "Workers use these lists" off), so the workers have the words
	// the relevance switch needs; without the table nothing is stripped (the archived v1 lists still go).
	if ( ! isset( $data['keywords'] ) && function_exists( 'sourceweb_sourcing_kw_on' ) && sourceweb_sourcing_kw_on() ) {
		$data['keywords'] = sourceweb_kw_payload( sourceweb_sourcing_kw_worker_rows(), (array) ( sourceweb_sources_config()['sources'] ?? array() ) );
	}
	return sourceweb_retire_policy( $data );
}

/* ---------- WP Admin: the Sourcing page (admin-menu.php); its screens are the Kits shell's (sourceweb-ui.php) ---------- */

/**
 * A Sources list action on some hosts (the Sources screen, sourceweb-rest-pages.php): allow, neutral or block (publishers
 * and relay-only sites), press_add / press_remove (before phase 2), relay_on / relay_off (from phase 1), delete (a
 * source with nothing attached). Logged as each was before. The caller writes the records.
 *
 * @param array  $pubs   sourceweb_publishers(), read just before.
 * @param string $status The action.
 * @param array  $hosts  Hosts.
 * @return array [ records, press sites changed ].
 */
function sourceweb_sourcing_sources_apply( array $pubs, $status, array $hosts ) {
	$press = false;
	if ( in_array( $status, array( 'press_add', 'press_remove' ), true ) ) { // Search here for coverage / Stop searching here
		$hosts = array_values( array_filter( array_map( 'sourceweb_sourcing_norm_host', $hosts ) ) );
		$press = sourceweb_sourcing_press_change( 'press_add' === $status ? $hosts : array(), 'press_remove' === $status ? $hosts : array() );
	} elseif ( in_array( $status, array( 'relay_on', 'relay_off' ), true ) && sourceweb_sourcing_phase() >= 1 ) { // logged per host
		$pubs = sourceweb_relay_switch( $pubs, $hosts, 'relay_on' === $status );
	} elseif ( 'delete' === $status ) {
		foreach ( $hosts as $h ) {
			$pubs = sourceweb_sourcing_source_delete( $pubs, $h );
		}
	} elseif ( in_array( $status, array( 'allow', 'neutral', 'block' ), true ) ) {
		$was = array();
		foreach ( $hosts as $h ) {
			$kind = (string) ( $pubs[ $h ]['kind'] ?? '' );
			if ( isset( $pubs[ $h ] ) && ( '' === $kind || 'relay' === $kind ) && ( ( $pubs[ $h ]['status'] ?? 'neutral' ) !== $status || 'relay' === $kind ) ) {
				$was[ $h ]            = 'relay' === $kind ? 'relay only' : (string) ( $pubs[ $h ]['status'] ?? 'neutral' );
				$pubs[ $h ]['status'] = $status;
				unset( $pubs[ $h ]['kind'] ); // a relay-only site given a status is a publisher
			}
		}
		if ( $was ) {
			sourceweb_src_log( 'publishers', implode( ', ', array_keys( $was ) ) . ' → ' . $status, $was, $status );
		}
	}
	return array( $pubs, $press );
}

/**
 * Short names for card chips (host => name), publishers only. Logged per host. The caller writes the records.
 *
 * @param array $pubs   sourceweb_publishers().
 * @param array $shorts Host => short name (sanitised).
 * @return array The records.
 */
function sourceweb_sourcing_shorts_apply( array $pubs, array $shorts ) {
	foreach ( $shorts as $h => $v ) {
		$v = mb_substr( (string) $v, 0, 24 );
		if ( isset( $pubs[ $h ] ) && empty( $pubs[ $h ]['kind'] ) && (string) ( $pubs[ $h ]['short'] ?? '' ) !== $v ) {
			sourceweb_src_log( 'publishers', $h . ' short name → ' . ( '' === $v ? '(none)' : $v ), (string) ( $pubs[ $h ]['short'] ?? '' ), $v );
			$pubs[ $h ]['short'] = $v;
		}
	}
	return $pubs;
}

/**
 * The feed form (Sources &feed=<id|new>, sourceweb_feed_parts()) posts here with tab feeds; the tab's own save hook
 * (kits_sourcing_save_feeds, sourcing-lists.php) saves and logs it, then the browser goes back to the screen it came from.
 */
add_action(
	'admin_post_aw_sourcing',
	function () {
		if ( ! current_user_can( SOURCEWEB_SRC_CAP ) || ! check_admin_referer( 'aw_sourcing' ) ) {
			wp_die( 'Not allowed.', 403 );
		}
		$tab = sanitize_key( $_POST['tab'] ?? '' );
		if ( ! has_action( 'kits_sourcing_save_' . $tab ) ) { // a form from a screen that no longer exists: say so, never "Saved"
			wp_die( 'Nothing saved: this form is from an older version of the Sourcing screens. Open the screen again and make the change there.', 'Sourcing', array( 'response' => 409, 'back_link' => true ) );
		}
		do_action( 'kits_sourcing_save_' . $tab );
		$from = wp_validate_redirect( esc_url_raw( wp_unslash( $_POST['src_back'] ?? '' ) ), '' );
		wp_safe_redirect( add_query_arg( 'updated', 1, '' !== $from ? $from : admin_url( 'admin.php?page=aw-sourcing&tab=sources&view=feeds' ) ) );
		exit;
	}
);

/** One-click block from the News / Legal Watch lists. */
add_action(
	'admin_post_aw_block_publisher',
	function () {
		$host = sanitize_text_field( wp_unslash( $_GET['host'] ?? '' ) );
		if ( ! current_user_can( SOURCEWEB_SRC_CAP ) || ! check_admin_referer( 'aw_block_' . $host ) ) {
			wp_die( 'Not allowed.', 403 );
		}
		$pubs            = sourceweb_publishers();
		$prev            = $pubs[ $host ] ?? null;
		$pubs[ $host ]   = array_merge( array( 'name' => '', 'count' => 0, 'first' => current_time( 'Y-m-d' ), 'last' => '' ), $pubs[ $host ] ?? array(), array( 'status' => 'block' ) );
		if ( 'relay' === ( $pubs[ $host ]['kind'] ?? '' ) ) { // a relay-only site given a status is a publisher
			unset( $pubs[ $host ]['kind'] );
		}
		update_option( SOURCEWEB_PUB_OPTION, $pubs, false );
		sourceweb_src_log( 'publishers', $host . ' → block (from the item list)', null === $prev ? '' : (string) ( $prev['status'] ?? 'neutral' ), 'block' );
		wp_safe_redirect( add_query_arg( 'aw_blocked', rawurlencode( $host ), wp_get_referer() ? wp_get_referer() : admin_url() ) );
		exit;
	}
);

// Publisher column on the sourced types' admin lists (registered once the site's filters are in place).
add_action(
	'admin_init',
	function () {
		foreach ( kits_sourced_types() as $aw_pt ) {
			add_filter(
				"manage_{$aw_pt}_posts_columns",
				function ( $cols ) {
					$cols['aw_publisher'] = 'Publisher';
					return $cols;
				}
			);
			add_action(
				"manage_{$aw_pt}_posts_custom_column",
				function ( $col, $id ) {
					if ( 'aw_publisher' !== $col ) {
						return;
					}
					$host = sourceweb_host( get_post_meta( $id, 'aw_source_url', true ) );
					if ( ! $host ) {
						return;
					}
					echo esc_html( $host ) . '<br>' . sourceweb_publisher_status_html( (string) ( sourceweb_publishers()[ $host ]['status'] ?? 'neutral' ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in the helper
				},
				10,
				2
			);
		}
	}
);

add_filter(
	'post_row_actions',
	function ( $actions, $post ) {
		if ( ! in_array( $post->post_type, kits_sourced_types(), true ) || ! current_user_can( SOURCEWEB_SRC_CAP ) ) {
			return $actions;
		}
		$host = sourceweb_host( get_post_meta( $post->ID, 'aw_source_url', true ) );
		if ( $host && 'block' !== ( sourceweb_publishers()[ $host ]['status'] ?? '' ) ) {
			$url             = wp_nonce_url( add_query_arg( array( 'action' => 'aw_block_publisher', 'host' => $host ), admin_url( 'admin-post.php' ) ), 'aw_block_' . $host );
			$actions['spam'] = '<a href="' . esc_url( $url ) . '">Block ' . esc_html( $host ) . '</a>'; // core colours the "spam" row action red (as for comments); posts have no spam action
		}
		return $actions;
	},
	10,
	2
);

add_action(
	'admin_notices',
	function () {
		if ( ! empty( $_GET['aw_blocked'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			wp_admin_notice( 'Blocked ' . esc_html( sanitize_text_field( wp_unslash( $_GET['aw_blocked'] ) ) ) . '. New items from it will be refused. Items already on the site are unchanged. <a href="' . esc_url( admin_url( 'admin.php?page=aw-sourcing&tab=sources&status=block' ) ) . '">Manage sources</a>', array( 'type' => 'success', 'dismissible' => true ) ); // phpcs:ignore WordPress.Security.NonceVerification
		}
	}
);

/**
 * The Change log as plain text, newest first: when, who, the tab (tabs since merged are named after their new home:
 * Feeds and Relay moved into Sources on 25 Oct 2026; Sections, Summary rules and Directory enrichment into Rules in
 * phase 3), what changed, and "old → new" when the entry has them. Used by the Change log tab and GET
 * sourceweb/v1/changes.
 *
 * @return array[] { at, user, tab, what, change }
 */
function sourceweb_sourcing_change_rows(): array {
	$tabs = array_map( fn( $t ) => $t[0], sourceweb_sourcing_tabs() );
	$old  = array(
		'publishers'    => 'Sources',
		'feeds'         => 'Sources (feeds)',
		'library'       => 'Sources (Library feeds)',
		'opportunities' => 'Sources (Opportunity feeds)',
		'relay'         => 'Sources (relay)',
	);
	if ( function_exists( 'sourceweb_rules_live' ) && sourceweb_rules_live() ) {
		$old += array(
			'sections' => 'Rules (section rules)',
			'summary'  => 'Rules (summary rules)',
			'enrich'   => 'Rules (Directory enrichment)',
		);
	}
	$rows = array();
	foreach ( (array) get_option( 'kits_sourcing_log', array() ) as $e ) {
		$e      = (array) $e;
		$has    = array_key_exists( 'old', $e ) || array_key_exists( 'new', $e );
		$rows[] = array(
			'at'     => (string) ( $e['at'] ?? '' ),
			'user'   => (string) ( $e['user'] ?? '' ),
			'tab'    => (string) ( $old[ $e['tab'] ?? '' ] ?? ( $tabs[ $e['tab'] ?? '' ] ?? ( $e['tab'] ?? '' ) ) ),
			'what'   => (string) ( $e['what'] ?? '' ),
			'change' => $has ? sourceweb_src_log_value( $e['old'] ?? '' ) . ' → ' . sourceweb_src_log_value( $e['new'] ?? '' ) : '',
		);
	}
	return $rows;
}

/** The Sourcing page: each tab is a shell screen (sourceweb-ui.php). */
function sourceweb_sourcing_page() {
	if ( ! current_user_can( SOURCEWEB_SRC_CAP ) ) {
		return;
	}
	sourceweb_ui_page( sourceweb_ui_wanted() );
}

/* ---------- Saves of the Sourcing options (their sanitize callbacks) ---------- */

/**
 * Was this value saved by a Sourcing screen? Each screen's save (sourceweb/v1) sends _aw_tab with its option. A
 * sanitize callback runs on every update_option() of its option, also the site's own saves (suggestions, the workers'
 * seed), so those pass through unchanged.
 *
 * @param mixed  $value Value being saved.
 * @param string $tab   Tab that posts it ('' for any).
 * @return string The tab, or ''.
 */
function sourceweb_sourcing_settings_tab( $value, $tab = '' ) {
	$t = is_array( $value ) ? sanitize_key( $value['_aw_tab'] ?? '' ) : '';
	return ( '' === $tab || $t === $tab ) ? $t : '';
}

/** After a Sourcing form saved: one notice in place of core's "Settings saved." */
function sourceweb_sourcing_settings_saved() {
	add_settings_error( 'aw_sourcing', 'saved', 'Saved. The workers use this from their next run.', 'success' );
}

/** A textarea list (one per line) as a clean array. */
function sourceweb_sourcing_lines( $text ) {
	return array_values( array_unique( array_filter( array_map( 'trim', explode( "\n", sanitize_textarea_field( (string) $text ) ) ) ) ) );
}

// Options.php checks the group's capability: the Sourcing screen's own.
foreach ( array( 'aw_sourcing_switches', 'aw_sourcing_sources', 'aw_sourcing_summary', 'aw_sourcing_enrich' ) as $sourceweb_group ) {
	add_filter( 'option_page_capability_' . $sourceweb_group, fn() => SOURCEWEB_SRC_CAP );
}

// Keywords: the two switches (option sourceweb_relevance).
add_action(
	'admin_init',
	fn() => register_setting( 'aw_sourcing_switches', SOURCEWEB_REL_OPTION, array( 'type' => 'array', 'sanitize_callback' => 'sourceweb_relevance_switches_sanitize', 'show_in_rest' => false ) )
);

/** The two switches from the Keywords screen; any other save of sourceweb_relevance passes through. */
function sourceweb_relevance_switches_sanitize( $value ) {
	if ( ! sourceweb_sourcing_settings_tab( $value, 'keywords' ) ) {
		return $value;
	}
	$rel                     = sourceweb_relevance();
	$old                     = $rel;
	$rel['enabled']          = ! empty( $value['enabled'] );
	$rel['gnews_allow_only'] = ! empty( $value['gnews_allow_only'] );
	$what                    = array();
	if ( ! empty( $old['enabled'] ) !== $rel['enabled'] ) {
		$what[] = 'keyword check ' . ( $rel['enabled'] ? 'on' : 'off' );
	}
	if ( ! empty( $old['gnews_allow_only'] ) !== $rel['gnews_allow_only'] ) {
		$what[] = 'aggregators allowed-only ' . ( $rel['gnews_allow_only'] ? 'on' : 'off' );
	}
	sourceweb_sourcing_settings_saved();
	if ( ! $what ) {
		return get_option( SOURCEWEB_REL_OPTION ); // Save with no change writes nothing
	}
	sourceweb_src_log( 'keywords', implode( ' · ', $what ) );
	return $rel;
}
