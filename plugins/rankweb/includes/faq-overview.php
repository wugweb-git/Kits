<?php
/**
 * RankWeb → FAQ (owner, 31 Oct 2026): which post types and taxonomies have the FAQ box ("FAQ box on": all ticked by
 * default; the unticked ones are stored in option aw_faq_off_types), then the overview. Questions are written, edited
 * and approved in each item's own FAQ box; this screen lists the items that show an FAQ (one core list table: name, type, questions shown, auto /
 * edited / own; search, sort, filter by type), a "Waiting for approval" view of draft questions with bulk Approve, and
 * the counts by type with Recount.
 *
 * rankweb_faq_index() walks every item with the box once an hour (transient aw_faq_index): items of a type with automatic
 * questions all, other items only when their box holds questions.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The RankWeb Overview's FAQ status asks for this when the hourly count has run out (5 Nov 2026).
add_action( 'aw_faq_index_build', fn() => rankweb_faq_index( true ) );

/**
 * Every item that shows an FAQ or has draft questions, and the counts by type. Cached for an hour.
 *
 * @param bool $fresh Count again.
 * @return array [ at, rows[ [ store, id, name, type, shown, auto, edited, own, drafts, draft_q[] ] ], counts[ type => [ store, published, faq, below, drafts ] ] ]
 */
function rankweb_faq_index( $fresh = false ) {
	$ix = $fresh ? false : get_transient( 'aw_faq_index' );
	if ( is_array( $ix ) && isset( $ix['rows'], $ix['counts'] ) ) {
		return $ix;
	}
	$ix  = array( 'at' => time(), 'rows' => array(), 'counts' => array() );
	$reg = rankweb_faq_registry();
	$add = function ( $ctx, $name, &$c ) use ( &$ix ) {
		$r      = rankweb_faq_rows( $ctx, false );
		$shown  = $r['ok'] ? array_values( array_filter( $r['rows'], fn( $x ) => $x['shown'] ) ) : array();
		$drafts = array_values( array_filter( $r['rows'], fn( $x ) => 'own' === $x['origin'] && 'approved' !== $x['status'] ) );
		$c['faq']    += $shown ? 1 : 0;
		$c['below']  += ! $shown && array_filter( $r['rows'], fn( $x ) => $x['shown'] ) ? 1 : 0;
		$c['drafts'] += count( $drafts );
		if ( ! $shown && ! $drafts ) {
			return;
		}
		$by           = array_count_values( wp_list_pluck( $shown, 'origin' ) );
		$ix['rows'][] = array(
			'store'   => $ctx['store'],
			'id'      => $ctx['id'],
			'name'    => $name,
			'type'    => $ctx['type'],
			'shown'   => count( $shown ),
			'auto'    => (int) ( $by['auto'] ?? 0 ),
			'edited'  => (int) ( $by['edited'] ?? 0 ),
			'own'     => (int) ( $by['own'] ?? 0 ),
			'drafts'  => count( $drafts ),
			'draft_q' => array_slice( wp_list_pluck( $drafts, 'q' ), 0, 10 ),
		);
	};
	foreach ( rankweb_faq_post_types() as $pt ) {
		$c    = array( 'store' => 'post', 'published' => (int) ( wp_count_posts( $pt )->publish ?? 0 ), 'faq' => 0, 'below' => 0, 'drafts' => 0 );
		$args = array( 'post_type' => $pt, 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids', 'no_found_rows' => true, 'orderby' => 'ID', 'order' => 'ASC' );
		if ( empty( $reg[ $pt ] ) ) {
			$args['meta_key'] = 'aw_faq'; // phpcs:ignore WordPress.DB.SlowDBQuery -- hourly count; a type without automatic questions has an FAQ only from its box
		}
		foreach ( array_chunk( get_posts( $args ), 200 ) as $chunk ) {
			foreach ( get_posts( array( 'post_type' => $pt, 'post_status' => 'publish', 'post__in' => $chunk, 'numberposts' => count( $chunk ), 'orderby' => 'post__in', 'no_found_rows' => true ) ) as $p ) { // meta and terms primed per chunk
				$ctx = rankweb_faq_context( $p );
				if ( $ctx ) {
					$add( $ctx, html_entity_decode( get_the_title( $p ), ENT_QUOTES, 'UTF-8' ), $c );
				}
			}
		}
		$ix['counts'][ $pt ] = $c;
	}
	foreach ( rankweb_faq_taxonomies() as $tax ) {
		$c     = array( 'store' => 'term', 'published' => (int) wp_count_terms( array( 'taxonomy' => $tax, 'hide_empty' => false ) ), 'faq' => 0, 'below' => 0, 'drafts' => 0 );
		$targs = array( 'taxonomy' => $tax, 'hide_empty' => false );
		if ( empty( $reg[ $tax ] ) ) {
			$targs['meta_key'] = 'aw_faq'; // phpcs:ignore WordPress.DB.SlowDBQuery -- hourly count; a taxonomy without automatic questions has an FAQ only from its box
		}
		$terms = get_terms( $targs );
		foreach ( is_wp_error( $terms ) ? array() : $terms as $t ) {
			$ctx = rankweb_faq_context( $t );
			if ( $ctx ) {
				$add( $ctx, html_entity_decode( $t->name, ENT_QUOTES, 'UTF-8' ), $c );
			}
		}
		$ix['counts'][ $tax ] = $c;
	}
	set_transient( 'aw_faq_index', $ix, HOUR_IN_SECONDS );
	delete_option( 'aw_faq_experiment' ); // the holdout experiment is gone (owner, 31 Oct 2026); so is its old count
	delete_transient( 'aw_faq_counts' );
	return $ix;
}

/** A type's name for the screen: the post type's or taxonomy's singular label. */
function rankweb_faq_type_label( $type ) {
	$o = post_type_exists( $type ) ? get_post_type_object( $type ) : get_taxonomy( $type );
	return $o ? (string) $o->labels->singular_name : (string) $type;
}

/** The edit screen of an item, at its FAQ box. */
function rankweb_faq_edit_url( $store, $id ) {
	$url = 'term' === $store ? (string) get_edit_term_link( (int) $id ) : (string) get_edit_post_link( (int) $id, 'raw' );
	return '' !== $url ? $url . '#aw-faq' : '';
}

/** Whether the current user may edit an item's FAQ box. */
function rankweb_faq_can_edit( $store, $id ) {
	return 'term' === $store ? current_user_can( 'edit_term', (int) $id ) : current_user_can( 'edit_post', (int) $id );
}

add_action(
	'admin_menu',
	function () {
		$hook = add_submenu_page( AW_SEO_MENU, 'FAQ', 'FAQ', RANKWEB_CAP, 'aw-faq', 'rankweb_faq_admin_page' ); // RankWeb → FAQ (overview.php has the menu)
		if ( $hook ) {
			add_action( 'load-' . $hook, 'rankweb_faq_admin_load' );
		}
	}
);

/**
 * Approve the draft questions of the picked items (their own questions only: automatic ones need no approval), then
 * count again. The classic bulk Approve and POST rankweb/v1/faq/approve both call this.
 *
 * @param string[] $picks "post:ID" or "term:ID", as the list's tick boxes carry them.
 * @return array { approved: questions approved, items: items changed, skipped: picks left out (bad form, or not editable by this user) }.
 */
function rankweb_faq_approve( array $picks ): array {
	$done    = 0;
	$items_n = 0;
	$skipped = 0;
	foreach ( array_unique( array_map( 'strval', $picks ) ) as $pick ) {
		if ( ! preg_match( '/^(post|term):(\d+)$/', $pick, $m ) || ! rankweb_faq_can_edit( $m[1], (int) $m[2] ) ) {
			++$skipped;
			continue;
		}
		$items = rankweb_faq_items( $m[1], (int) $m[2] );
		$here  = 0;
		foreach ( $items as $i => $it ) {
			if ( '' === ( $it['auto'] ?? '' ) && 'approved' !== $it['status'] ) {
				$items[ $i ]['status']   = 'approved';
				$items[ $i ]['reviewed'] = wp_date( 'Y-m-d' );
				++$here;
			}
		}
		if ( $here ) {
			rankweb_faq_items_save( $m[1], (int) $m[2], $items );
			$done += $here;
			++$items_n;
		}
	}
	rankweb_faq_index( true );
	return array(
		'approved' => $done,
		'items'    => $items_n,
		'skipped'  => $skipped,
	);
}

/**
 * Count the FAQs again now (the hourly count, run on demand).
 *
 * @return array { at: when it was counted }.
 */
function rankweb_faq_recount(): array {
	$ix = rankweb_faq_index( true );
	return array( 'at' => (int) $ix['at'] );
}

/**
 * Filter, sort and page the index rows: the "With an FAQ" and "Waiting for approval" views, a type, a name search.
 * The classic list table and GET rankweb/v1/faq both use it.
 *
 * @param array $rows rankweb_faq_index() rows.
 * @param array $args { view: 'all'|'waiting', type, s, orderby: name|type|shown, order: asc|desc, page, per_page }.
 * @return array { rows: this page's rows, total: rows in all pages }.
 */
function rankweb_faq_query( array $rows, array $args ): array {
	$view    = 'waiting' === ( $args['view'] ?? '' ) ? 'waiting' : 'all';
	$type    = (string) ( $args['type'] ?? '' );
	$s       = trim( (string) ( $args['s'] ?? '' ) );
	$orderby = in_array( $args['orderby'] ?? '', array( 'name', 'type', 'shown' ), true ) ? (string) $args['orderby'] : 'name';
	$sign    = 'desc' === strtolower( (string) ( $args['order'] ?? 'asc' ) ) ? -1 : 1;
	$per     = max( 1, (int) ( $args['per_page'] ?? 50 ) );
	$page    = max( 1, (int) ( $args['page'] ?? 1 ) );
	$rows    = array_filter( $rows, fn( $r ) => 'waiting' === $view ? $r['drafts'] > 0 : $r['shown'] > 0 );
	if ( '' !== $type ) {
		$rows = array_filter( $rows, fn( $r ) => $r['type'] === $type );
	}
	if ( '' !== $s ) {
		$rows = array_filter( $rows, fn( $r ) => false !== mb_stripos( $r['name'], $s ) );
	}
	usort( $rows, fn( $a, $b ) => $sign * ( 'shown' === $orderby ? $a['shown'] <=> $b['shown'] : strnatcasecmp( (string) $a[ $orderby ], (string) $b[ $orderby ] ) ) );
	return array(
		'rows'  => array_slice( $rows, ( $page - 1 ) * $per, $per ),
		'total' => count( $rows ),
	);
}

/**
 * The FAQ screen's data: the views with their counts, one page of rows, the types to filter by, the counts by type
 * and "FAQ box on". Read from the hourly index; nothing is counted here.
 *
 * @param array $args As rankweb_faq_query().
 */
function rankweb_faq_payload( array $args ): array {
	$ix   = rankweb_faq_index();
	$per  = max( 1, (int) ( $args['per_page'] ?? 50 ) );
	$q    = rankweb_faq_query( $ix['rows'], array_merge( $args, array( 'per_page' => $per ) ) );
	$view = 'waiting' === ( $args['view'] ?? '' ) ? 'waiting' : 'all';
	$rows = array();
	foreach ( $q['rows'] as $r ) {
		$edit   = rankweb_faq_can_edit( $r['store'], $r['id'] ) ? rankweb_faq_edit_url( $r['store'], $r['id'] ) : '';
		$link   = 'term' === $r['store'] ? get_term_link( (int) $r['id'] ) : get_permalink( (int) $r['id'] );
		$rows[] = array(
			'key'       => $r['store'] . ':' . $r['id'],
			'name'      => $r['name'],
			'type'      => $r['type'],
			'typeLabel' => rankweb_faq_type_label( $r['type'] ),
			'shown'     => $r['shown'],
			'auto'      => $r['auto'],
			'edited'    => $r['edited'],
			'own'       => $r['own'],
			'drafts'    => $r['drafts'],
			'draftQ'    => $r['draft_q'],
			'editUrl'   => $edit,
			'viewUrl'   => $link && ! is_wp_error( $link ) ? (string) $link : '',
		);
	}
	$types = array();
	foreach ( array_unique( wp_list_pluck( $ix['rows'], 'type' ) ) as $t ) {
		$types[] = array(
			'value' => (string) $t,
			'label' => rankweb_faq_type_label( (string) $t ),
		);
	}
	$counts = array();
	foreach ( $ix['counts'] as $type => $c ) {
		if ( ! $c['published'] && ! $c['faq'] ) {
			continue;
		}
		$counts[] = array(
			'type'      => rankweb_faq_type_label( $type ),
			'terms'     => 'term' === $c['store'],
			'published' => (int) $c['published'],
			'faq'       => (int) $c['faq'],
			'below'     => (int) $c['below'],
			'drafts'    => (int) $c['drafts'],
		);
	}
	$off     = rankweb_faq_off_types();
	$choices = rankweb_faq_type_choices();
	$box     = array();
	foreach ( array( 'post', 'term' ) as $store ) {
		foreach ( $choices[ $store ] as $slug => $name ) {
			$box[] = array(
				'slug'  => (string) $slug,
				'label' => (string) $name,
				'store' => $store,
				'on'    => ! in_array( (string) $slug, $off, true ),
			);
		}
	}
	return array(
		'view'     => $view,
		'rows'     => $rows,
		'total'    => $q['total'],
		'page'     => max( 1, (int) ( $args['page'] ?? 1 ) ),
		'pages'    => max( 1, (int) ceil( $q['total'] / $per ) ),
		'views'    => array(
			array(
				'value' => 'all',
				'label' => __( 'With an FAQ', 'rankweb' ),
				'count' => count( array_filter( $ix['rows'], fn( $r ) => $r['shown'] > 0 ) ),
			),
			array(
				'value' => 'waiting',
				'label' => __( 'Waiting for approval', 'rankweb' ),
				'count' => count( array_filter( $ix['rows'], fn( $r ) => $r['drafts'] > 0 ) ),
			),
		),
		'types'    => $types,
		'counts'   => $counts,
		'at'       => (int) $ix['at'],
		'atText'   => wp_date( 'j M Y, H:i', (int) $ix['at'] ),
		'faqTypes' => $box,
		'canTypes' => current_user_can( 'manage_options' ),
	);
}

add_action( 'rest_api_init', 'rankweb_faq_register_routes' );

/**
 * RankWeb → FAQ on the shell, under rankweb/v1 (all manage_rankweb, the menu entry's capability; Approve checks each
 * item's own edit right):
 *
 *   GET  faq          the views, a page of rows (view, type, s, orderby, order, page), the counts and "FAQ box on"
 *   POST faq/approve  { items: [ "post:ID", "term:ID" ] } approve those items' draft questions
 *   POST faq/recount  count the FAQs again now
 *
 * "FAQ box on" saves through POST settings/faq-types (manage_options), as on the Settings screen.
 */
function rankweb_faq_register_routes(): void {
	register_rest_route(
		RANKWEB_REST,
		'/faq',
		array(
			'methods'             => 'GET',
			'permission_callback' => rankweb_rest_can( RANKWEB_CAP ),
			'args'                => array(
				'view'     => array(
					'type'    => 'string',
					'enum'    => array( 'all', 'waiting' ),
					'default' => 'all',
				),
				'type'     => array(
					'type'              => 'string',
					'default'           => '',
					'sanitize_callback' => 'sanitize_key',
				),
				's'        => array(
					'type'              => 'string',
					'default'           => '',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orderby'  => array(
					'type'    => 'string',
					'enum'    => array( 'name', 'type', 'shown' ),
					'default' => 'name',
				),
				'order'    => array(
					'type'    => 'string',
					'enum'    => array( 'asc', 'desc' ),
					'default' => 'asc',
				),
				'page'     => array(
					'type'    => 'integer',
					'minimum' => 1,
					'default' => 1,
				),
				'per_page' => array(
					'type'    => 'integer',
					'minimum' => 1,
					'maximum' => 100,
					'default' => 50,
				),
			),
			'callback'            => fn( WP_REST_Request $req ) => rest_ensure_response( rankweb_faq_payload( (array) $req->get_params() ) ),
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/faq/approve',
		array(
			'methods'             => 'POST',
			'permission_callback' => rankweb_rest_can( RANKWEB_CAP ),
			'args'                => array(
				'items' => array(
					'type'     => 'array',
					'items'    => array( 'type' => 'string' ),
					'required' => true,
				),
			),
			'callback'            => function ( WP_REST_Request $req ) {
				$r = rankweb_faq_approve( (array) $req['items'] );
				return rest_ensure_response(
					$r + array(
						/* translators: %d: number of questions. */
						'message' => sprintf( _n( '%d question approved.', '%d questions approved.', $r['approved'], 'rankweb' ), $r['approved'] ),
					)
				);
			},
		)
	);
	register_rest_route(
		RANKWEB_REST,
		'/faq/recount',
		array(
			'methods'             => 'POST',
			'permission_callback' => rankweb_rest_can( RANKWEB_CAP ),
			'callback'            => fn() => rest_ensure_response( rankweb_faq_recount() + array( 'message' => __( 'Counted again.', 'rankweb' ) ) ),
		)
	);
}

/** Before the screen: bulk Approve and Recount, then back to the list (the classic screen; the shell uses the REST routes). */
function rankweb_faq_admin_load() {
	$action = sanitize_key( wp_unslash( $_GET['action'] ?? '-1' ) ); // phpcs:ignore WordPress.Security.NonceVerification -- checked below
	if ( '-1' === $action || '' === $action ) {
		$action = sanitize_key( wp_unslash( $_GET['action2'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification -- checked below
	}
	if ( 'approve' === $action ) {
		check_admin_referer( 'bulk-aw-faq-items' );
		$r = rankweb_faq_approve( array_map( 'sanitize_text_field', (array) wp_unslash( $_GET['item'] ?? array() ) ) );
		wp_safe_redirect( add_query_arg( array( 'page' => 'aw-faq', 'view' => 'waiting', 'approved' => $r['approved'] ), admin_url( 'admin.php' ) ) );
		exit;
	}
	if ( isset( $_GET['recount'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- checked below
		check_admin_referer( 'aw_faq_recount' );
		rankweb_faq_recount();
		wp_safe_redirect( add_query_arg( array( 'page' => 'aw-faq', 'counted' => 1 ), admin_url( 'admin.php' ) ) );
		exit;
	}
}

/** Every public post type (not attachments) and every public taxonomy with an edit screen: slug => label. */
function rankweb_faq_type_choices() {
	$out = array( 'post' => array(), 'term' => array() );
	foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $slug => $o ) {
		if ( 'attachment' !== $slug ) {
			$out['post'][ $slug ] = (string) $o->label;
		}
	}
	foreach ( get_taxonomies( array( 'public' => true, 'show_ui' => true ), 'objects' ) as $slug => $o ) {
		$out['term'][ $slug ] = (string) $o->label;
	}
	return $out;
}

/** "FAQ box on": a core form-table of checkboxes, ticked = the type has the box. Administrators only can save it. */
function rankweb_faq_types_form() {
	$choices = rankweb_faq_type_choices();
	$off     = rankweb_faq_off_types();
	$can     = current_user_can( 'manage_options' );
	echo '<h2>FAQ box on</h2>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="aw_faq_types">';
	wp_nonce_field( 'aw_faq_types' );
	echo '<table class="form-table" role="presentation"><tbody>';
	foreach ( array( 'post' => 'Post types', 'term' => 'Taxonomies' ) as $store => $label ) {
		echo '<tr><th scope="row">' . esc_html( $label ) . '</th><td><fieldset><legend class="screen-reader-text"><span>' . esc_html( $label ) . '</span></legend>';
		foreach ( $choices[ $store ] as $slug => $name ) {
			echo '<label><input type="checkbox" name="on[]" value="' . esc_attr( $slug ) . '"' . checked( ! in_array( $slug, $off, true ), true, false ) . disabled( $can, false, false ) . '> ' . esc_html( $name ) . ' <code>' . esc_html( $slug ) . '</code></label><br>';
		}
		echo '</fieldset></td></tr>';
	}
	echo '</tbody></table>';
	if ( $can ) {
		submit_button( 'Save' );
	} else {
		echo '<p class="description">Only administrators can change this.</p>';
	}
	echo '</form>';
}

add_action(
	'admin_post_aw_faq_types',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed.', 403 );
		}
		check_admin_referer( 'aw_faq_types' );
		$on      = array_map( 'sanitize_key', (array) wp_unslash( $_POST['on'] ?? array() ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitize_key on each
		$choices = rankweb_faq_type_choices();
		$all     = array_merge( array_keys( $choices['post'] ), array_keys( $choices['term'] ) );
		update_option( 'aw_faq_off_types', array_values( array_diff( $all, $on ) ), false ); // only the unticked: a type registered later has the box
		delete_transient( 'aw_faq_index' );
		wp_safe_redirect( add_query_arg( array( 'page' => 'aw-faq', 'types_saved' => 1 ), admin_url( 'admin.php' ) ) );
		exit;
	}
);

/** RankWeb → FAQ on the Kits shell (rankweb-ui.php). */
function rankweb_faq_admin_page() {
	rankweb_ui_page( 'faq' );
}

/** The FAQ screen's body: notices, FAQ box on, the list, the counts. The classic page, for a site with no Kits Core; the shell screen is native (src/tools/faq.js) and reads GET rankweb/v1/faq. */
function rankweb_faq_admin_body() {
	if ( ! class_exists( 'WP_List_Table' ) ) {
		require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
	}
	require_once __DIR__ . '/class-aw-faq-list-table.php';
	$ix    = rankweb_faq_index();
	$table = new RankWeb_FAQ_List_Table( $ix['rows'] );
	$table->prepare_items();
	if ( isset( $_GET['approved'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- a notice after the redirect
		wp_admin_notice( esc_html( sprintf( '%d questions approved.', (int) $_GET['approved'] ) ), array( 'type' => 'success', 'dismissible' => true ) ); // phpcs:ignore WordPress.Security.NonceVerification
	}
	if ( isset( $_GET['counted'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- a notice after the redirect
		wp_admin_notice( 'Counted again.', array( 'type' => 'success', 'dismissible' => true ) );
	}
	if ( isset( $_GET['types_saved'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- a notice after the redirect
		wp_admin_notice( 'Saved: the FAQ box is on the ticked types.', array( 'type' => 'success', 'dismissible' => true ) );
	}
	echo '<p>Every page’s questions are in its own FAQ box: open it with Edit. A page shows its FAQ when its box has enough questions to show. This list: the pages that show one, and the draft questions waiting for approval.</p>';
	rankweb_faq_types_form();
	echo '<h2>Pages with an FAQ</h2>';
	$table->views();
	echo '<form method="get"><input type="hidden" name="page" value="aw-faq">';
	if ( 'waiting' === $table->view ) {
		echo '<input type="hidden" name="view" value="waiting">';
	}
	$table->search_box( 'Search', 'aw-faq' );
	$table->display();
	echo '</form>';

	echo '<h2>Counts</h2>';
	$cells = array();
	foreach ( $ix['counts'] as $type => $c ) {
		if ( ! $c['published'] && ! $c['faq'] ) {
			continue;
		}
		$cells[] = array(
			'type'      => esc_html( rankweb_faq_type_label( $type ) ) . ( 'term' === $c['store'] ? ' <span class="description">(terms)</span>' : '' ),
			'published' => esc_html( number_format_i18n( $c['published'] ) ),
			'faq'       => esc_html( number_format_i18n( $c['faq'] ) ),
			'below'     => esc_html( number_format_i18n( $c['below'] ) ),
			'drafts'    => esc_html( number_format_i18n( $c['drafts'] ) ),
		);
	}
	rankweb_seo_extras_simple_table( 'faq-counts', array( 'type' => 'Type', 'published' => 'Published', 'faq' => 'Show an FAQ', 'below' => 'Questions, but fewer than the minimum (no FAQ)', 'drafts' => 'Draft questions waiting' ), $cells );
	echo '<p>' . esc_html( sprintf( 'Counted %s.', wp_date( 'j M Y, H:i', (int) $ix['at'] ) ) ) . ' <a href="' . esc_url( wp_nonce_url( add_query_arg( array( 'page' => 'aw-faq', 'recount' => 1 ), admin_url( 'admin.php' ) ), 'aw_faq_recount' ) ) . '">Recount</a></p>';
}
