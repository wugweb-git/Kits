<?php
/**
 * SourceWeb without Kits Core, part two (0.3.0): To review, Enrichment review, Rejected, Relay log and Change log as
 * plain WordPress admin screens drawn on the server. Keywords, Rules, Places and Workers are in
 * sourceweb-standalone-config.php. Part one (Sources and AI models) is sourceweb-standalone.php.
 *
 * Every screen reads what the plugin already stores through the functions and route callbacks the Kits shell screens
 * use (sourceweb_rest_rejected() and the like are called in-process with a request object, so the filtering, sorting
 * and paging are the same code). Reading is by GET (search, view, sort and page only); every change is a POST to
 * admin-post.php with a nonce and a capability check, and comes back to the screen with a one-line notice kept in a
 * short-lived per-user transient (never in the address). Used only when the Kits shell is not drawing the screen
 * (sourceweb_ui_fallback_page() in sourceweb-ui.php); with Kits Core the shell screens are as they were.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The screens drawn here: screen => [ callback, capability ]. Sources, AI models and Settings are drawn by
 * sourceweb-standalone.php and sourceweb-ui.php.
 *
 * @return array<string, array{0: callable, 1: string}>
 */
function sourceweb_sa_screens(): array {
	$src = defined( 'SOURCEWEB_SRC_CAP' ) ? SOURCEWEB_SRC_CAP : 'manage_options';
	return array(
		'review'     => array( 'sourceweb_sa_screen_review', defined( 'AW_REVIEW_CAP' ) ? AW_REVIEW_CAP : 'manage_options' ),
		'enrichment' => array( 'sourceweb_sa_screen_enrichment', defined( 'AW_ENRICH_CAP' ) ? AW_ENRICH_CAP : 'manage_options' ),
		'keywords'   => array( 'sourceweb_sa_screen_keywords', $src ),
		'rules'      => array( 'sourceweb_sa_screen_rules', $src ),
		'places'     => array( 'sourceweb_sa_screen_places', $src ),
		'workers'    => array( 'sourceweb_sa_screen_workers', $src ),
		'rejected'   => array( 'sourceweb_sa_screen_rejected', $src ),
		'relay-log'  => array( 'sourceweb_sa_screen_relay', $src ),
		'log'        => array( 'sourceweb_sa_screen_changes', $src ),
	);
}

/**
 * Draw a screen from the list above. False when the screen is not one of them or the person may not open it (the
 * caller then shows what it showed before).
 *
 * @param string $screen Screen key.
 */
function sourceweb_sa_render( string $screen ): bool {
	$all = sourceweb_sa_screens();
	if ( ! isset( $all[ $screen ] ) || ! current_user_can( $all[ $screen ][1] ) ) {
		return false;
	}
	sourceweb_sa_notice();
	call_user_func( $all[ $screen ][0] );
	return true;
}

/* ---------- Addresses, notices, guards ---------- */

/**
 * The query arguments that open a screen (page and tab).
 *
 * @param string $screen Screen key.
 */
function sourceweb_sa_args( string $screen ): array {
	$args = array();
	parse_str( (string) wp_parse_url( sourceweb_ui_url( $screen ), PHP_URL_QUERY ), $args );
	return array_map( 'strval', $args );
}

/**
 * A screen's address, with more query arguments.
 *
 * @param string $screen Screen key.
 * @param array  $args   More arguments.
 */
function sourceweb_sa_url( string $screen, array $args = array() ): string {
	return add_query_arg( array_map( 'rawurlencode', array_filter( $args, static fn( $v ) => '' !== (string) $v ) ), sourceweb_ui_url( $screen ) );
}

/**
 * One line to show on the next load of a screen (kept 60 seconds for this person only; nothing goes in the address).
 *
 * @param string $type success, error, warning or info.
 * @param string $text The line.
 */
function sourceweb_sa_flash( string $type, string $text ): void {
	set_transient( 'sourceweb_sa_flash_' . get_current_user_id(), array( $type, $text ), 60 );
}

/** Show the line a form left, once. */
function sourceweb_sa_notice(): void {
	$key  = 'sourceweb_sa_flash_' . get_current_user_id();
	$flash = get_transient( $key );
	if ( is_array( $flash ) && isset( $flash[1] ) ) {
		delete_transient( $key );
		$type = in_array( $flash[0], array( 'success', 'error', 'warning', 'info' ), true ) ? $flash[0] : 'info';
		wp_admin_notice( esc_html( (string) $flash[1] ), array( 'type' => $type ) );
	}
	if ( function_exists( 'sourceweb_standalone_notice' ) ) {
		sourceweb_standalone_notice(); // the notices of Sources and AI models (a code in the address)
	}
}

/**
 * Back to a screen with a line. Ends the request.
 *
 * @param string $screen Screen key.
 * @param string $type   success, error, warning or info.
 * @param string $text   The line.
 * @param array  $args   More arguments for the address.
 */
function sourceweb_sa_back( string $screen, string $type, string $text, array $args = array() ): void {
	sourceweb_sa_flash( $type, $text );
	wp_safe_redirect( sourceweb_sa_url( $screen, $args ) );
	exit;
}

/**
 * The guard of every change: POST only, the capability, then the nonce (in that order, as the screens of part one).
 *
 * @param string $nonce_action The nonce's action.
 * @param string $cap          Capability.
 */
function sourceweb_sa_guard( string $nonce_action, string $cap ): void {
	if ( 'POST' !== strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) ) {
		wp_die( esc_html__( 'This action needs a form post.', 'sourceweb' ), 405 );
	}
	if ( ! current_user_can( $cap ) ) {
		wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'sourceweb' ), 403 );
	}
	check_admin_referer( $nonce_action );
}

/**
 * Open a form that posts to admin-post.php with its action, nonce and hidden fields.
 *
 * @param string $action Action (the admin_post_ hook, also the nonce action).
 * @param array  $hidden Name => value.
 * @param string $class  Form class.
 */
function sourceweb_sa_form( string $action, array $hidden = array(), string $class = '' ): void {
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"' . ( '' !== $class ? ' class="' . esc_attr( $class ) . '"' : '' ) . '>';
	echo '<input type="hidden" name="action" value="' . esc_attr( $action ) . '">';
	foreach ( $hidden as $k => $v ) {
		echo '<input type="hidden" name="' . esc_attr( (string) $k ) . '" value="' . esc_attr( (string) $v ) . '">';
	}
	wp_nonce_field( $action );
}

/**
 * Wrap a screen: the title and the "needs" line for something that cannot exist without Kits Core or another plugin.
 *
 * @param string $text Plain words, already translated.
 */
function sourceweb_sa_limit( string $text ): void {
	echo '<div class="notice notice-info inline"><p>' . esc_html( $text ) . '</p></div>';
}

/* ---------- A list: views, search, sortable columns, pages ---------- */

/** The list controls from the address (read only). */
function sourceweb_sa_query(): array {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- list controls only (view, search, sort, page); nothing is saved.
	$order = sanitize_key( wp_unslash( $_GET['sw_order'] ?? '' ) );
	$q     = array(
		'view'    => sanitize_key( wp_unslash( $_GET['sw_view'] ?? '' ) ),
		'search'  => sanitize_text_field( wp_unslash( $_GET['sw_s'] ?? '' ) ),
		'orderby' => sanitize_key( wp_unslash( $_GET['sw_orderby'] ?? '' ) ),
		'order'   => 'desc' === $order ? 'desc' : 'asc',
		'page'    => max( 1, absint( $_GET['sw_page'] ?? 1 ) ),
	);
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	return $q;
}

/**
 * A route callback's data, called in-process (the same filtering, sorting and paging as the shell screens).
 *
 * @param callable $cb     A callback taking a WP_REST_Request (sourceweb_rest_rejected and the like).
 * @param array    $params Its parameters.
 */
function sourceweb_sa_data( callable $cb, array $params ): array {
	$req = new WP_REST_Request( 'GET', '/' );
	$req->set_query_params( $params );
	$res = $cb( $req );
	if ( $res instanceof WP_REST_Response ) {
		return (array) $res->get_data();
	}
	if ( is_wp_error( $res ) ) {
		return array( 'error' => $res->get_error_message() );
	}
	return (array) $res;
}

/**
 * Draw a list the way the sourceweb_list() answer has it.
 *
 * @param string $screen Screen key (where the links go).
 * @param array  $res    { rows, total, page, pages, view, views: [ { value, label, count } ] }.
 * @param array  $cols   key => [ label, sortable (bool), cell: callable( row ): string of HTML already escaped ].
 * @param array  $q      sourceweb_sa_query().
 * @param string $label  The search box's label.
 * @param string $empty  What an empty list says.
 * @param array  $keep   More address arguments to keep (view, search and sort are kept by this function).
 */
function sourceweb_sa_list( string $screen, array $res, array $cols, array $q, string $label, string $empty, array $keep = array() ): void {
	$base = sourceweb_sa_url( $screen, $keep );
	$view = (string) ( $res['view'] ?? '' );
	$keepq = array(
		'sw_view'    => $view,
		'sw_s'       => $q['search'],
		'sw_orderby' => $q['orderby'],
		'sw_order'   => '' !== $q['orderby'] ? $q['order'] : '',
	);
	if ( ! empty( $res['views'] ) && count( $res['views'] ) > 1 ) {
		$links = array();
		foreach ( $res['views'] as $v ) {
			$links[] = '<li><a href="' . esc_url( add_query_arg( array_map( 'rawurlencode', array_filter( array( 'sw_view' => (string) $v['value'], 'sw_s' => $q['search'] ), 'strlen' ) ), $base ) ) . '"' . ( (string) $v['value'] === $view ? ' class="current" aria-current="page"' : '' ) . '>' . esc_html( (string) $v['label'] ) . ' <span class="count">(' . esc_html( number_format_i18n( (int) $v['count'] ) ) . ')</span></a>';
		}
		echo '<ul class="subsubsub">' . implode( ' | </li>', $links ) . '</li></ul>'; // phpcs:ignore WordPress.Security.EscapeOutput -- each link is escaped above.
	}
	echo '<form method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><p class="search-box">';
	foreach ( sourceweb_sa_args( $screen ) + $keep as $k => $v ) {
		echo '<input type="hidden" name="' . esc_attr( (string) $k ) . '" value="' . esc_attr( (string) $v ) . '">';
	}
	echo '<input type="hidden" name="sw_view" value="' . esc_attr( $view ) . '">';
	echo '<label class="screen-reader-text" for="sw-search">' . esc_html( $label ) . '</label>';
	echo '<input type="search" id="sw-search" name="sw_s" value="' . esc_attr( $q['search'] ) . '"> ';
	echo '<input type="submit" class="button" value="' . esc_attr__( 'Search', 'sourceweb' ) . '"></p></form>';
	echo '<div class="clear"></div>';

	echo '<table class="widefat striped"><thead><tr>';
	foreach ( $cols as $key => $c ) {
		if ( ! empty( $c[1] ) ) {
			$dir  = $q['orderby'] === $key && 'asc' === $q['order'] ? 'desc' : 'asc';
			$href = add_query_arg( array_map( 'rawurlencode', array_filter( array( 'sw_view' => $view, 'sw_s' => $q['search'], 'sw_orderby' => $key, 'sw_order' => $dir ), 'strlen' ) ), $base );
			echo '<th scope="col"' . ( $q['orderby'] === $key ? ' aria-sort="' . ( 'asc' === $q['order'] ? 'ascending' : 'descending' ) . '"' : '' ) . '><a href="' . esc_url( $href ) . '">' . esc_html( (string) $c[0] ) . '</a></th>';
		} else {
			echo '<th scope="col">' . esc_html( (string) $c[0] ) . '</th>';
		}
	}
	echo '</tr></thead><tbody>';
	if ( empty( $res['rows'] ) ) {
		echo '<tr><td colspan="' . esc_attr( (string) count( $cols ) ) . '">' . esc_html( $empty ) . '</td></tr>';
	}
	foreach ( (array) ( $res['rows'] ?? array() ) as $r ) {
		echo '<tr>';
		foreach ( $cols as $c ) {
			echo '<td>' . call_user_func( $c[2], $r ) . '</td>'; // phpcs:ignore WordPress.Security.EscapeOutput -- every cell callback returns escaped HTML.
		}
		echo '</tr>';
	}
	echo '</tbody></table>';
	sourceweb_sa_pages( $base, $keepq, (int) ( $res['page'] ?? 1 ), (int) ( $res['pages'] ?? 1 ), (int) ( $res['total'] ?? 0 ) );
}

/**
 * Page links under a list.
 *
 * @param string $base  The screen's address.
 * @param array  $keepq Controls to keep.
 * @param int    $page  Page now.
 * @param int    $pages Pages.
 * @param int    $total Rows in all.
 */
function sourceweb_sa_pages( string $base, array $keepq, int $page, int $pages, int $total ): void {
	if ( $pages < 2 ) {
		/* translators: %s: number of rows. */
		echo '<p class="description">' . esc_html( sprintf( _n( '%s row', '%s rows', $total, 'sourceweb' ), number_format_i18n( $total ) ) ) . '</p>';
		return;
	}
	$links = paginate_links(
		array(
			'base'      => add_query_arg( array_map( 'rawurlencode', array_filter( $keepq, 'strlen' ) ), $base ) . '&sw_page=%#%',
			'format'    => '',
			'current'   => $page,
			'total'     => $pages,
			'type'      => 'plain',
			'prev_text' => '&laquo;',
			'next_text' => '&raquo;',
		)
	);
	/* translators: %s: number of rows. */
	echo '<div class="tablenav"><div class="tablenav-pages"><span class="displaying-num">' . esc_html( sprintf( _n( '%s row', '%s rows', $total, 'sourceweb' ), number_format_i18n( $total ) ) ) . '</span> ' . wp_kses_post( (string) $links ) . '</div></div>';
}

/* ---------- Rejected, Relay log, Change log (read only) ---------- */

/** Rejected: the items the relevance check refused, and the manual re-check of published items. */
function sourceweb_sa_screen_rejected(): void {
	$q   = sourceweb_sa_query();
	$res = sourceweb_sa_data( 'sourceweb_rest_rejected', $q );
	echo '<p>' . esc_html__( 'Items the relevance check refused, with the reason. They were never created. An item from an allowed publisher is rarely refused: worth a look.', 'sourceweb' ) . '</p>';
	sourceweb_sa_list(
		'rejected',
		$res,
		array(
			'title'  => array(
				__( 'Item', 'sourceweb' ),
				false,
				static function ( $r ) {
					$link = '' !== (string) $r['url'] ? '<a href="' . esc_url( (string) $r['url'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( (string) $r['title'] ) . '</a>' : esc_html( (string) $r['title'] );
					return $link . ' <span class="description">— ' . esc_html( (string) $r['host'] ) . '</span>' . ( '' !== (string) $r['problem'] ? '<br><strong>' . esc_html( (string) $r['problem'] ) . '</strong>' : '' );
				},
			),
			'type'   => array( __( 'Type', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['type'] ) ),
			'found'  => array( __( 'Found by', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['found'] ) ),
			'reason' => array( __( 'Reason', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['reason'] ) ),
			'at'     => array( __( 'Date', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['at'] ) ),
		),
		$q,
		__( 'Search rejected items', 'sourceweb' ),
		__( 'Nothing rejected.', 'sourceweb' )
	);

	echo '<h2>' . esc_html__( 'Check published items against the rules', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Looks at the newest 300 published news items and lists those the current rules would refuse (archive or tag pages, job vacancies). Nothing is changed.', 'sourceweb' ) . '</p>';
	$found = get_transient( 'sourceweb_sa_recheck_' . get_current_user_id() );
	if ( is_array( $found ) ) {
		if ( ! $found['flagged'] ) {
			/* translators: %d: items looked at. */
			echo '<p>' . esc_html( sprintf( __( 'Checked %d items: none would be refused.', 'sourceweb' ), (int) $found['checked'] ) ) . '</p>';
		} else {
			echo '<table class="widefat striped"><tbody>';
			foreach ( $found['flagged'] as $f ) {
				echo '<tr><td><a href="' . esc_url( (string) $f['edit'] ) . '">' . esc_html( (string) $f['title'] ) . '</a></td><td>' . esc_html( (string) $f['reason'] ) . '</td></tr>';
			}
			echo '</tbody></table>';
		}
	}
	sourceweb_sa_form( 'sourceweb_sa_recheck' );
	submit_button( __( 'Check now', 'sourceweb' ), 'secondary', 'submit', false );
	echo '</form>';
}

// Re-check: runs the read-only check and keeps its answer for this person for ten minutes.
add_action( 'admin_post_sourceweb_sa_recheck', 'sourceweb_sa_handle_recheck' );

/** The re-check button. */
function sourceweb_sa_handle_recheck(): void {
	sourceweb_sa_guard( 'sourceweb_sa_recheck', defined( 'SOURCEWEB_SRC_CAP' ) ? SOURCEWEB_SRC_CAP : 'manage_options' );
	$out = function_exists( 'sourceweb_recheck_published' ) ? sourceweb_recheck_published() : array( 'checked' => 0, 'flagged' => array() );
	set_transient( 'sourceweb_sa_recheck_' . get_current_user_id(), $out, 10 * MINUTE_IN_SECONDS );
	sourceweb_sa_back( 'rejected', 'success', __( 'Checked. The list is below. Nothing was changed.', 'sourceweb' ) );
}

/** Relay log: every request the workers made through this site. */
function sourceweb_sa_screen_relay(): void {
	$q   = sourceweb_sa_query();
	$res = sourceweb_sa_data( 'sourceweb_rest_relay_log', $q );
	echo '<p>' . esc_html__( 'Every request the workers made through this site for a publisher that refuses GitHub (the last 200). Each source has its relay switch on Sources.', 'sourceweb' ) . '</p>';
	sourceweb_sa_list(
		'relay-log',
		$res,
		array(
			'at'     => array( __( 'Time', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['when'] ) ),
			'host'   => array( __( 'Host', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['host'] ) ),
			'path'   => array( __( 'Path', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['path'] ) ),
			'status' => array( __( 'Result', 'sourceweb' ), true, static fn( $r ) => ( $r['ok'] ? '' : '<strong>' ) . esc_html( (string) $r['status'] ) . ( $r['ok'] ? '' : '</strong>' ) ),
			'bytes'  => array( __( 'Size', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['size'] ) ),
			'ms'     => array( __( 'Time taken', 'sourceweb' ), true, static fn( $r ) => esc_html( (int) $r['ms'] . ' ms' ) ),
			'note'   => array( __( 'Note', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['note'] ) ),
		),
		$q,
		__( 'Search requests', 'sourceweb' ),
		__( 'None yet.', 'sourceweb' )
	);
}

/** Change log: who changed what, when. */
function sourceweb_sa_screen_changes(): void {
	$q   = sourceweb_sa_query();
	$res = sourceweb_sa_data( 'sourceweb_rest_changes', $q );
	echo '<p>' . esc_html__( 'Who changed what on these screens and when, with the value before and after (newest first, the last 1,000).', 'sourceweb' ) . '</p>';
	sourceweb_sa_list(
		'log',
		$res,
		array(
			'at'     => array( __( 'When', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['at'] ) ),
			'user'   => array( __( 'Who', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['user'] ) ),
			'tab'    => array( __( 'Tab', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['tab'] ) ),
			'what'   => array( __( 'What changed', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['what'] ) ),
			'change' => array( __( 'Old → new', 'sourceweb' ), false, static fn( $r ) => '' !== (string) $r['change'] ? esc_html( (string) $r['change'] ) : '—' ),
		),
		$q,
		__( 'Search changes', 'sourceweb' ),
		__( 'No changes yet.', 'sourceweb' )
	);
}

/* ---------- To review ---------- */

/**
 * To review: everything that came in automatically and waits for a person. Publish puts an item live; Reject moves it to
 * Drafts with a note. One row at a time, ticked rows together, or every item of the view.
 */
function sourceweb_sa_screen_review(): void {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- list filters only; nothing is saved.
	$q = sourceweb_sa_query();
	$q = array(
		'type'    => $q['view'],
		'search'  => $q['search'],
		'orderby' => $q['orderby'],
		'order'   => $q['order'],
		'page'    => $q['page'],
		'source'  => sanitize_text_field( wp_unslash( $_GET['sw_source'] ?? '' ) ),
		'why'     => sanitize_text_field( wp_unslash( $_GET['sw_why'] ?? '' ) ),
	);
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	$items = array_map( 'sourceweb_review_row', sourceweb_review_items() );
	$res   = sourceweb_review_list( $items, $q, sourceweb_review_types() );
	$type  = (string) $res['type'];
	$view  = array_map(
		static fn( $v ) => array(
			'value' => $v['value'],
			'label' => $v['label'],
			'count' => $v['count'],
		),
		$res['views']
	);
	echo '<p>' . esc_html__( 'Everything that came in automatically and is waiting for a person: news, Library items, opportunities, press and research, with why each was held. Publish puts an item live. Reject moves it to Drafts with a note (nothing is deleted).', 'sourceweb' ) . '</p>';
	if ( ! $items ) {
		echo '<div class="notice notice-info inline"><p><strong>' . esc_html__( 'Review queue is clear.', 'sourceweb' ) . '</strong> ' . esc_html__( 'There are currently no pending or held items waiting for editorial review.', 'sourceweb' ) . '</p></div>';
		return;
	}
	$keep = array_filter( array( 'sw_source' => $q['source'], 'sw_why' => $q['why'] ), 'strlen' );
	// Filters of this screen: source and reason (a GET form; the type views are links above it).
	echo '<form method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><p class="search-box">';
	foreach ( sourceweb_sa_args( 'review' ) as $k => $v ) {
		echo '<input type="hidden" name="' . esc_attr( $k ) . '" value="' . esc_attr( $v ) . '">';
	}
	echo '<input type="hidden" name="sw_view" value="' . esc_attr( $type ) . '">';
	foreach ( array( 'source' => array( 'sw_source', __( 'All sources', 'sourceweb' ) ), 'why' => array( 'sw_why', __( 'Any reason', 'sourceweb' ) ) ) as $fk => $f ) {
		echo '<label class="screen-reader-text" for="' . esc_attr( $f[0] ) . '">' . esc_html( $f[1] ) . '</label><select id="' . esc_attr( $f[0] ) . '" name="' . esc_attr( $f[0] ) . '">';
		foreach ( (array) ( $res['filters'][ $fk ] ?? array() ) as $o ) {
			echo '<option value="' . esc_attr( (string) $o['value'] ) . '"' . selected( (string) $q[ $fk ], (string) $o['value'], false ) . '>' . esc_html( '' === (string) $o['value'] ? $f[1] : (string) $o['label'] ) . '</option>';
		}
		echo '</select> ';
	}
	echo '<input type="search" name="sw_s" value="' . esc_attr( $q['search'] ) . '" aria-label="' . esc_attr__( 'Search waiting items', 'sourceweb' ) . '"> <input type="submit" class="button" value="' . esc_attr__( 'Filter', 'sourceweb' ) . '"></p></form>';

	$base = sourceweb_sa_url( 'review' );
	$links = array();
	foreach ( $view as $v ) {
		$links[] = '<li><a href="' . esc_url( add_query_arg( array_map( 'rawurlencode', array_filter( array( 'sw_view' => (string) $v['value'] ), 'strlen' ) ), $base ) ) . '"' . ( (string) $v['value'] === $type ? ' class="current" aria-current="page"' : '' ) . '>' . esc_html( (string) $v['label'] ) . ' <span class="count">(' . esc_html( number_format_i18n( (int) $v['count'] ) ) . ')</span></a>';
	}
	echo '<ul class="subsubsub">' . implode( ' | </li>', $links ) . '</li></ul><div class="clear"></div>'; // phpcs:ignore WordPress.Security.EscapeOutput -- each link is escaped above.

	sourceweb_sa_form( 'sourceweb_sa_review', array( 'sw_type' => $type ) );
	echo '<p><label for="sw-review-bulk" class="screen-reader-text">' . esc_html__( 'Action for ticked items', 'sourceweb' ) . '</label><select id="sw-review-bulk" name="sw_bulk"><option value="publish">' . esc_html__( 'Publish ticked', 'sourceweb' ) . '</option><option value="reject">' . esc_html__( 'Reject ticked', 'sourceweb' ) . '</option></select> <button type="submit" class="button" name="sw_go" value="bulk">' . esc_html__( 'Apply', 'sourceweb' ) . '</button></p>';
	echo '<table class="widefat striped"><thead><tr><td class="check-column"></td>';
	$cols = array(
		'title' => array( __( 'Title', 'sourceweb' ), true ),
		'type'  => array( __( 'Type', 'sourceweb' ), true ),
		'host'  => array( __( 'Source', 'sourceweb' ), false ),
		'date'  => array( __( 'Date', 'sourceweb' ), true ),
		'why'   => array( __( 'Why it waits', 'sourceweb' ), false ),
		'act'   => array( __( 'Actions', 'sourceweb' ), false ),
	);
	foreach ( $cols as $k => $c ) {
		if ( $c[1] ) {
			$dir  = $q['orderby'] === $k && 'asc' === $q['order'] ? 'desc' : 'asc';
			$href = add_query_arg( array_map( 'rawurlencode', array_filter( array( 'sw_view' => $type, 'sw_s' => $q['search'], 'sw_orderby' => $k, 'sw_order' => $dir ) + $keep, 'strlen' ) ), $base );
			echo '<th scope="col"><a href="' . esc_url( $href ) . '">' . esc_html( $c[0] ) . '</a></th>';
		} else {
			echo '<th scope="col">' . esc_html( $c[0] ) . '</th>';
		}
	}
	echo '</tr></thead><tbody>';
	if ( ! $res['rows'] ) {
		echo '<tr><td colspan="7">' . esc_html__( 'Nothing matches this filter.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( $res['rows'] as $r ) {
		$id = (int) $r['id'];
		echo '<tr><th scope="row" class="check-column"><input type="checkbox" name="ids[]" value="' . esc_attr( (string) $id ) . '" aria-label="' . esc_attr( (string) $r['title'] ) . '"></th>';
		echo '<td><strong><a href="' . esc_url( (string) $r['editUrl'] ) . '">' . esc_html( (string) $r['title'] ) . '</a></strong>' . ( '' !== (string) $r['excerpt'] ? '<br><span class="description">' . esc_html( (string) $r['excerpt'] ) . '</span>' : '' ) . '</td>';
		echo '<td>' . esc_html( (string) $r['typeLabel'] ) . '</td>';
		echo '<td>' . ( '' !== (string) $r['url'] ? '<a href="' . esc_url( (string) $r['url'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( (string) $r['host'] ) . '</a>' : '–' ) . '</td>';
		echo '<td>' . esc_html( (string) $r['dateText'] ) . '</td>';
		echo '<td>' . esc_html( (string) $r['why'] ) . '</td><td>';
		if ( empty( $r['noPublish'] ) ) {
			echo '<button type="submit" class="button button-small button-primary" name="sw_go" value="' . esc_attr( 'publish-' . $id ) . '">' . esc_html__( 'Publish', 'sourceweb' ) . '</button> ';
		} else {
			echo '<span class="description">' . esc_html__( 'Needs its staff summary first', 'sourceweb' ) . '</span> ';
		}
		echo '<button type="submit" class="button button-small" name="sw_go" value="' . esc_attr( 'reject-' . $id ) . '">' . esc_html__( 'Reject', 'sourceweb' ) . '</button></td></tr>';
	}
	echo '</tbody></table></form>';
	sourceweb_sa_pages( $base, array( 'sw_view' => $type, 'sw_s' => $q['search'], 'sw_orderby' => $q['orderby'], 'sw_order' => '' !== $q['orderby'] ? $q['order'] : '' ) + $keep, (int) $res['page'], (int) $res['pages'], (int) $res['total'] );

	if ( $res['count'] > 0 ) {
		sourceweb_sa_form( 'sourceweb_sa_review_all', array( 'sw_type' => $type, 'sw_count' => (int) $res['count'] ) );
		/* translators: %d: number of items. */
		echo '<p><button type="submit" class="button" onclick="return confirm(' . esc_attr( (string) wp_json_encode( sprintf( __( 'Publish all %d items in this view?', 'sourceweb' ), (int) $res['count'] ) ) ) . ');">' . esc_html( sprintf( __( 'Publish all %d in this view', 'sourceweb' ), (int) $res['count'] ) ) . '</button></p></form>';
	}
	if ( has_action( 'aw_review_intake' ) ) {
		do_action( 'aw_review_intake' ); // other plugins' intake forms (add an item by its link), as on the shell screen
	}
}

add_action( 'admin_post_sourceweb_sa_review', 'sourceweb_sa_handle_review' );
add_action( 'admin_post_sourceweb_sa_review_all', 'sourceweb_sa_handle_review_all' );

/**
 * The items a review post names: the one row whose button was pressed, or the ticked ones with the bulk action.
 *
 * @param array $post The posted values (already unslashed).
 * @return array{0: string, 1: int[]} Action (publish or reject, '' when none) and item ids.
 */
function sourceweb_sa_review_choice( array $post ): array {
	$go = isset( $post['sw_go'] ) ? sanitize_text_field( (string) $post['sw_go'] ) : '';
	if ( preg_match( '/^(publish|reject)-(\d+)$/', $go, $m ) ) {
		return array( $m[1], array( (int) $m[2] ) );
	}
	if ( 'bulk' === $go ) {
		$act = isset( $post['sw_bulk'] ) ? sanitize_key( (string) $post['sw_bulk'] ) : '';
		$ids = array_values( array_unique( array_filter( array_map( 'absint', (array) ( $post['ids'] ?? array() ) ) ) ) );
		return in_array( $act, array( 'publish', 'reject' ), true ) ? array( $act, $ids ) : array( '', array() );
	}
	return array( '', array() );
}

/** Publish or Reject one, several or ticked items. */
function sourceweb_sa_handle_review(): void {
	sourceweb_sa_guard( 'sourceweb_sa_review', AW_REVIEW_CAP );
	list( $act, $ids ) = sourceweb_sa_review_choice( wp_unslash( $_POST ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- the nonce was checked by sourceweb_sa_guard(); each value is sanitized in the function.
	$type = isset( $_POST['sw_type'] ) ? sanitize_key( wp_unslash( $_POST['sw_type'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked above.
	$args = isset( sourceweb_review_types()[ $type ] ) ? array( 'sw_view' => $type ) : array();
	if ( '' === $act || ! $ids ) {
		sourceweb_sa_back( 'review', 'warning', __( 'Nothing was chosen. Tick items first, or use a row\'s button.', 'sourceweb' ), $args );
	}
	$n = sourceweb_review_apply( $ids, $act );
	if ( 'publish' === $act ) {
		/* translators: %d: number of items. */
		$text = sprintf( _n( '%d item published.', '%d items published.', $n, 'sourceweb' ), $n );
	} else {
		/* translators: %d: number of items. */
		$text = sprintf( _n( '%d item moved to Drafts.', '%d items moved to Drafts.', $n, 'sourceweb' ), $n );
	}
	sourceweb_sa_back( 'review', $n ? 'success' : 'warning', $n ? $text : __( 'Nothing changed: the items may have been handled already, or you may not edit them.', 'sourceweb' ), $args );
}

/** Publish every item of the view, when the count the person saw is still the count. */
function sourceweb_sa_handle_review_all(): void {
	sourceweb_sa_guard( 'sourceweb_sa_review_all', AW_REVIEW_CAP );
	$type  = isset( $_POST['sw_type'] ) ? sanitize_key( wp_unslash( $_POST['sw_type'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	$count = isset( $_POST['sw_count'] ) ? absint( wp_unslash( $_POST['sw_count'] ) ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	$type  = isset( sourceweb_review_types()[ $type ] ) ? $type : '';
	$args  = '' !== $type ? array( 'sw_view' => $type ) : array();
	$items = sourceweb_review_items( $type );
	if ( count( $items ) !== $count ) {
		/* translators: %d: number of items. */
		sourceweb_sa_back( 'review', 'error', sprintf( __( 'The list changed: %d items wait now. Nothing was published; check the list and try again.', 'sourceweb' ), count( $items ) ), $args );
	}
	$n = sourceweb_review_apply( wp_list_pluck( $items, 'ID' ), 'publish' );
	/* translators: %d: number of items. */
	sourceweb_sa_back( 'review', 'success', sprintf( _n( '%d item published.', '%d items published.', $n, 'sourceweb' ), $n ), $args );
}

/* ---------- Enrichment review ---------- */

/**
 * Enrichment review: what the enrichment worker proposes for Directory listings, one block per listing. Approve puts a
 * value on the listing, Reject drops it, Undo puts the old value back.
 */
function sourceweb_sa_screen_enrichment(): void {
	echo '<p>' . esc_html__( 'Details the enrichment worker found for Directory listings (phones, hours, website, logo and so on), for a person to approve. A claimed or verified listing is never changed.', 'sourceweb' ) . '</p>';
	if ( '' === sourceweb_type( 'listing' ) || ! post_type_exists( sourceweb_type( 'listing' ) ) ) {
		sourceweb_sa_limit( __( 'This site has no Directory listings (the listing content type comes with DirectoryWeb), so the enrichment worker has nothing to propose and nothing can be applied here. Install and activate DirectoryWeb to use this screen.', 'sourceweb' ) );
		return;
	}
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- list filters only; nothing is saved.
	$q      = sourceweb_sa_query();
	$status = isset( SOURCEWEB_ENRICH_VIEWS[ $q['view'] ] ) ? $q['view'] : 'pending';
	$params = array(
		'status' => $status,
		'search' => $q['search'],
		'page'   => $q['page'],
	);
	foreach ( array( 'source', 'confidence', 'field', 'flag', 'state' ) as $k ) {
		$params[ $k ] = sanitize_key( wp_unslash( $_GET[ 'sw_' . $k ] ?? '' ) );
	}
	$params['listing'] = absint( $_GET['sw_listing'] ?? 0 );
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	$res = sourceweb_sa_data( 'sourceweb_rest_enrichment', $params );
	if ( empty( $res['views'] ) && empty( $res['rows'] ) ) {
		$p = (array) ( $res['progress'] ?? array() );
		echo '<p>' . esc_html__( 'No proposals have been stored yet. They appear after the Directory enrichment worker has run on this site.', 'sourceweb' ) . '</p>';
		if ( $p ) {
			/* translators: 1: listings checked, 2: listings in all. */
			echo '<p class="description">' . esc_html( sprintf( __( '%1$d of %2$d listings checked so far.', 'sourceweb' ), (int) ( $p['checked'] ?? 0 ), (int) ( $p['total'] ?? 0 ) ) ) . '</p>';
		}
		return;
	}
	$base  = sourceweb_sa_url( 'enrichment' );
	$links = array();
	foreach ( (array) $res['views'] as $v ) {
		$links[] = '<li><a href="' . esc_url( add_query_arg( array( 'sw_view' => rawurlencode( (string) $v['value'] ) ), $base ) ) . '"' . ( (string) $v['value'] === $status ? ' class="current" aria-current="page"' : '' ) . '>' . esc_html( (string) $v['label'] ) . ' <span class="count">(' . esc_html( number_format_i18n( (int) $v['count'] ) ) . ')</span></a>';
	}
	echo '<ul class="subsubsub">' . implode( ' | </li>', $links ) . '</li></ul>'; // phpcs:ignore WordPress.Security.EscapeOutput -- each link is escaped above.

	echo '<form method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><p class="search-box">';
	foreach ( sourceweb_sa_args( 'enrichment' ) as $k => $v ) {
		echo '<input type="hidden" name="' . esc_attr( $k ) . '" value="' . esc_attr( $v ) . '">';
	}
	echo '<input type="hidden" name="sw_view" value="' . esc_attr( $status ) . '">';
	foreach ( (array) ( $res['filters'] ?? array() ) as $f ) {
		echo '<label class="screen-reader-text" for="sw_' . esc_attr( (string) $f['key'] ) . '">' . esc_html( (string) $f['label'] ) . '</label><select id="sw_' . esc_attr( (string) $f['key'] ) . '" name="sw_' . esc_attr( (string) $f['key'] ) . '">';
		foreach ( (array) $f['options'] as $o ) {
			echo '<option value="' . esc_attr( (string) $o['value'] ) . '"' . selected( (string) $f['value'], (string) $o['value'], false ) . '>' . esc_html( (string) $o['label'] ) . '</option>';
		}
		echo '</select> ';
	}
	echo '<input type="search" name="sw_s" value="' . esc_attr( $q['search'] ) . '" aria-label="' . esc_attr__( 'Search listings', 'sourceweb' ) . '"> <input type="submit" class="button" value="' . esc_attr__( 'Filter', 'sourceweb' ) . '"></p></form><div class="clear"></div>';

	if ( empty( $res['rows'] ) ) {
		echo '<p>' . esc_html__( 'Nothing in this view.', 'sourceweb' ) . '</p>';
		return;
	}
	sourceweb_sa_form( 'sourceweb_sa_enrich', array( 'sw_view' => $status ) );
	foreach ( (array) $res['rows'] as $g ) {
		echo '<h2><a href="' . esc_url( (string) $g['editUrl'] ) . '">' . esc_html( (string) $g['title'] ) . '</a>';
		foreach ( (array) $g['flags'] as $fl ) {
			echo ' <span class="description">[' . esc_html( (string) $fl ) . ']</span>';
		}
		echo '</h2>';
		echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Field', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Now', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Proposed', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Confidence', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Source', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Status', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Actions', 'sourceweb' ) . '</th></tr></thead><tbody>';
		foreach ( array_merge( (array) $g['fields'], (array) $g['others'] ) as $f ) {
			$id = (int) $f['key'];
			echo '<tr><td>' . esc_html( (string) $f['label'] ) . '</td><td>' . esc_html( (string) $f['current'] ) . '</td><td>' . esc_html( (string) $f['proposed'] ) . '</td><td>' . esc_html( (string) $f['confidence'] ) . '</td><td>' . esc_html( (string) $f['source'] ) . ( '' !== (string) $f['note'] ? '<br><span class="description">' . esc_html( (string) $f['note'] ) . '</span>' : '' ) . '</td><td>' . esc_html( (string) $f['status'] ) . '</td><td>';
			if ( ! empty( $f['waiting'] ) ) {
				echo '<button type="submit" class="button button-small button-primary" name="sw_go" value="' . esc_attr( 'approve-' . $id ) . '">' . esc_html__( 'Approve', 'sourceweb' ) . '</button> <button type="submit" class="button button-small" name="sw_go" value="' . esc_attr( 'reject-' . $id ) . '">' . esc_html__( 'Reject', 'sourceweb' ) . '</button>';
			} elseif ( ! empty( $f['applied'] ) ) {
				echo '<button type="submit" class="button button-small" name="sw_go" value="' . esc_attr( 'undo-' . $id ) . '">' . esc_html__( 'Undo', 'sourceweb' ) . '</button>';
			} else {
				echo '–';
			}
			echo '</td></tr>';
		}
		echo '</tbody></table>';
	}
	echo '</form>';
	sourceweb_sa_pages( $base, array( 'sw_view' => $status, 'sw_s' => $q['search'] ), (int) $res['page'], (int) $res['pages'], (int) $res['total'] );
}

add_action( 'admin_post_sourceweb_sa_enrich', 'sourceweb_sa_handle_enrich' );

/** Approve, reject or undo one proposed value. */
function sourceweb_sa_handle_enrich(): void {
	sourceweb_sa_guard( 'sourceweb_sa_enrich', AW_ENRICH_CAP );
	$go   = isset( $_POST['sw_go'] ) ? sanitize_text_field( wp_unslash( $_POST['sw_go'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	$view = isset( $_POST['sw_view'] ) ? sanitize_key( wp_unslash( $_POST['sw_view'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	$args = isset( SOURCEWEB_ENRICH_VIEWS[ $view ] ) ? array( 'sw_view' => $view ) : array();
	if ( ! preg_match( '/^(approve|reject|undo)-(\d+)$/', $go, $m ) || ! get_option( 'aw_enrich_db' ) ) {
		sourceweb_sa_back( 'enrichment', 'warning', __( 'Nothing was chosen.', 'sourceweb' ), $args );
	}
	$fn   = array(
		'approve' => 'sourceweb_enrich_approve',
		'reject'  => 'sourceweb_enrich_reject',
		'undo'    => 'sourceweb_enrich_undo',
	)[ $m[1] ];
	$done = (bool) $fn( (int) $m[2] );
	sourceweb_sa_back( 'enrichment', $done ? 'success' : 'warning', $done ? __( 'Done.', 'sourceweb' ) : __( 'Not changed: the value may have been handled already, or could not be applied (see its note).', 'sourceweb' ), $args );
}
