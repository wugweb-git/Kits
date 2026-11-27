<?php
/**
 * Admin tables for all Notion data. Every field is a column; Screen Options lists a tick box
 * for each column (show / hide). Covers posts, case studies, clients, taxonomy terms and the
 * custom tables (platforms, tools, engagements).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function wugweb_admin_label( $key, $prefix = '' ) {
	$k = $prefix && strpos( $key, $prefix ) === 0 ? substr( $key, strlen( $prefix ) ) : $key;
	return ucwords( str_replace( '_', ' ', $k ) );
}
function wugweb_admin_fmt( $v, $type = 'string' ) {
	if ( $type === 'boolean' ) { return $v ? '✔' : '—'; }
	if ( $v === '' || $v === null || $v === '[]' || $v === array() ) { return '—'; }
	$s = is_array( $v ) ? implode( ', ', $v ) : (string) $v;
	if ( preg_match( '#^https?://#', $s ) ) { return '<a href="' . esc_url( $s ) . '" target="_blank" rel="noopener">' . esc_html( strlen( $s ) > 40 ? '…' . substr( $s, -38 ) : $s ) . '</a>'; }
	if ( strlen( $s ) > 90 ) { return '<span title="' . esc_attr( $s ) . '">' . esc_html( mb_substr( $s, 0, 90 ) ) . '…</span>'; }
	return esc_html( $s );
}

/** Post-type list: one column per meta field. */
function wugweb_admin_post_columns( $post_type, $prefix, array $fields, array $visible ) {
	add_filter( "manage_{$post_type}_posts_columns", function ( $cols ) use ( $prefix, $fields ) {
		foreach ( $fields as $k => $t ) { $cols[ $k ] = wugweb_admin_label( $k, $prefix ); }
		return $cols;
	} );
	add_action( "manage_{$post_type}_posts_custom_column", function ( $col, $id ) use ( $fields ) {
		if ( isset( $fields[ $col ] ) ) { echo wugweb_admin_fmt( get_post_meta( $id, $col, true ), $fields[ $col ] ); } // phpcs:ignore
	}, 10, 2 );
}

add_action( 'admin_init', function () {
	$blog = array();
	foreach ( wugweb_core_blog_fields() as $k => $d ) { $blog[ $k ] = $d[0]; }
	wugweb_admin_post_columns( 'post', 'wugweb_', $blog, array( 'wugweb_post_id', 'wugweb_publish_date', 'wugweb_word_count', 'wugweb_featured' ) );

	$cs = array();
	foreach ( wugweb_core_cs_fields() as $k => $t ) { $cs[ 'wugweb_cs_' . $k ] = $t; }
	wugweb_admin_post_columns( 'case_study', 'wugweb_cs_', $cs, array( 'wugweb_cs_case_study_id', 'wugweb_cs_primary_discipline', 'wugweb_cs_notion_status', 'wugweb_cs_featured', 'wugweb_cs_word_count' ) );

	$cl = array();
	foreach ( wugweb_core_client_fields() as $k => $t ) { $cl[ 'wugweb_client_' . $k ] = $t; }
	wugweb_admin_post_columns( 'client', 'wugweb_client_', $cl, array( 'wugweb_client_client_id', 'wugweb_client_entity_type', 'wugweb_client_engagement', 'wugweb_client_status', 'wugweb_client_nda' ) );


	// Slug column right after the title for posts, case studies and clients.
	foreach ( array( 'post', 'case_study', 'client' ) as $pt ) {
		add_filter( "manage_{$pt}_posts_columns", function ( $cols ) {
			$out = array();
			foreach ( $cols as $k => $v ) { $out[ $k ] = $v; if ( $k === 'title' ) { $out['wugweb_slug'] = 'Slug'; } }
			return $out;
		}, 15 );
		add_action( "manage_{$pt}_posts_custom_column", function ( $col, $id ) {
			if ( $col === 'wugweb_slug' ) { echo esc_html( get_post_field( 'post_name', $id ) ); }
		}, 10, 2 );
	}

	// Case study: Body Content column (post body), right after the title.
	foreach ( array( 'case_study', 'post', 'client' ) as $pt2 ) { add_filter( "manage_{$pt2}_posts_columns", function ( $cols ) {
		$out = array();
		foreach ( $cols as $k => $v ) { $out[ $k ] = $v; if ( $k === 'title' ) { $out['wugweb_excerpt'] = 'Excerpt'; $out['wugweb_content'] = 'Body Content'; } }
		return $out;
	}, 20 ); add_action( "manage_{$pt2}_posts_custom_column", function ( $col, $id ) {
		if ( $col === 'wugweb_excerpt' ) {
			$x = trim( wp_strip_all_tags( get_post_field( 'post_excerpt', $id ) ) );
			echo $x === '' ? '—' : '<span title="' . esc_attr( $x ) . '">' . esc_html( mb_substr( $x, 0, 120 ) ) . ( mb_strlen( $x ) > 120 ? '…' : '' ) . '</span>'; // phpcs:ignore
		}
		if ( $col === 'wugweb_content' ) {
			$t = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( get_post_field( 'post_content', $id ) ) ) );
			echo $t === '' ? '—' : '<span title="' . esc_attr( mb_substr( $t, 0, 600 ) ) . '">' . esc_html( mb_substr( $t, 0, 120 ) ) . '…</span>'; // phpcs:ignore
		}
	}, 10, 2 ); }

	// Taxonomy term lists.
	$extra = array(
		'industry' => array( 'industry_id', 'persona', 'sector', 'seo_keyphrases', 'show_on_sector_card', 'seo_score' ),
		'sector'   => array( 'icon', 'show', 'order', 'seo_keyphrases', 'seo_score' ),
		'country'  => array( 'country_id', 'notes', 'seo_score' ),
		'asset_type' => array( 'id', 'seo_score' ), 'content_type' => array( 'id', 'seo_score' ), 'department' => array( 'id', 'seo_score' ), 'service_group' => array( 'id', 'seo_score' ),
		'owner' => array( 'client', 'blog_posts', 'case_studies', 'seo_score' ), 'platform' => array( 'seo_score' ), 'tool' => array( 'seo_score' ), 'discipline' => array( 'seo_score' ), 'post_tag' => array( 'seo_score' ),
	);
	foreach ( $extra as $tax => $keys ) {
		add_filter( "manage_edit-{$tax}_columns", function ( $cols ) use ( $keys ) {
			foreach ( $keys as $k ) { $cols[ 'nd_' . $k ] = wugweb_admin_label( $k ); }
			$cols['nd_notion_url'] = 'Notion URL';
			return $cols;
		} );
		add_filter( "manage_{$tax}_custom_column", function ( $out, $col, $term_id ) {
			if ( strpos( $col, 'nd_' ) !== 0 ) { return $out; }
			$key = substr( $col, 3 );
			if ( $key === 'notion_url' ) { return wugweb_admin_fmt( get_term_meta( $term_id, 'wugweb_notion_url', true ) ); }
			$d = json_decode( (string) get_term_meta( $term_id, 'wugweb_notion_data', true ), true );
			$v = is_array( $d ) && isset( $d[ $key ] ) ? $d[ $key ] : '';
			return wugweb_admin_fmt( $v, is_bool( $v ) ? 'boolean' : 'string' );
		}, 10, 3 );
	}
} );

/* ---------- custom tables: Notion Data menu ---------- */
if ( is_admin() ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';

	class Wugweb_Table_List extends WP_List_Table {
		public $tbl; public $cols = array(); public $types = array(); public $visible = array(); public $hook;
		public function __construct( $tbl, $hook, $visible ) {
			global $wpdb;
			$this->tbl = $wpdb->prefix . $tbl; $this->hook = $hook; $this->visible = $visible;
			foreach ( $wpdb->get_results( "SHOW COLUMNS FROM {$this->tbl}" ) as $c ) { $this->types[ $c->Field ] = $c->Type; } // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- table is $wpdb->prefix plus a name registered in this file, no user input
			parent::__construct( array( 'plural' => $tbl, 'singular' => $tbl, 'screen' => $hook ) );
		}
		public function get_columns() {
			$c = array();
			foreach ( $this->types as $f => $t ) { $c[ $f ] = wugweb_admin_label( $f ); }
			return $c;
		}
		public function get_sortable_columns() {
			$s = array();
			foreach ( $this->types as $f => $t ) { $s[ $f ] = array( $f, false ); }
			return $s;
		}
		protected function column_default( $item, $col ) {
			$v = $item[ $col ]; $t = $this->types[ $col ] ?? '';
			if ( $col === 'client_post_id' && $v ) {
				return '<a href="' . esc_url( get_edit_post_link( (int) $v ) ) . '">' . esc_html( get_the_title( (int) $v ) ?: $v ) . '</a>';
			}
			if ( is_string( $v ) && strpos( $v, "\n" ) !== false ) { return nl2br( esc_html( $v ) ); }
			return wugweb_admin_fmt( $v, strpos( $t, 'tinyint(1)' ) === 0 ? 'boolean' : 'string' );
		}
		public function prepare_items() {
			global $wpdb;
			$per = (int) get_user_option( "wugweb_{$this->tbl}_per_page" ) ?: 50;
			$page = max( 1, (int) ( $_GET['paged'] ?? 1 ) ); // phpcs:ignore
			$ob = $_GET['orderby'] ?? 'id'; $ob = isset( $this->types[ $ob ] ) ? $ob : 'id'; // phpcs:ignore
			$od = ( $_GET['order'] ?? 'asc' ) === 'desc' ? 'DESC' : 'ASC'; // phpcs:ignore
			$where = '1=1'; $args = array();
			if ( ! empty( $_GET['s'] ) ) { // phpcs:ignore
				$like = '%' . $wpdb->esc_like( wp_unslash( $_GET['s'] ) ) . '%'; // phpcs:ignore
				$parts = array();
				foreach ( $this->types as $f => $t ) { if ( preg_match( '/char|text/', $t ) ) { $parts[] = "`$f` LIKE %s"; $args[] = $like; } }
				$where = '(' . implode( ' OR ', $parts ) . ')';
			}
			$sql_total = "SELECT COUNT(*) FROM {$this->tbl} WHERE $where";
			$total = (int) ( $args ? $wpdb->get_var( $wpdb->prepare( $sql_total, $args ) ) : $wpdb->get_var( $sql_total ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- $sql_total holds identifiers from SHOW COLUMNS and %s placeholders; values go through prepare() when present
			$sql = "SELECT * FROM {$this->tbl} WHERE $where ORDER BY `$ob` $od LIMIT %d OFFSET %d";
			$this->items = $wpdb->get_results( $wpdb->prepare( $sql, array_merge( $args, array( $per, ( $page - 1 ) * $per ) ) ), ARRAY_A ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- identifiers whitelisted (table prefix, SHOW COLUMNS, orderby checked against it), values via prepare()
			$this->set_pagination_args( array( 'total_items' => $total, 'per_page' => $per ) );
			$this->_column_headers = array( $this->get_columns(), get_hidden_columns( $this->screen ), $this->get_sortable_columns() );
		}
	}

	add_action( 'admin_menu', function () {
		$pages = array(
			'wugweb-platforms'   => array( 'Platforms', 'wugweb_platforms', array( 'platform_id', 'name', 'sub_category', 'supports_api', 'traffic_potential', 'seo_value', 'official_website', 'active' ) ),
			'wugweb-tools'       => array( 'Tools', 'wugweb_tools', array( 'technology_id', 'name', 'capability_area', 'status', 'official_website' ) ),
			'wugweb-engagements' => array( 'Client - Engagement', 'wugweb_client_engagements', array() ),
		);
		add_menu_page( 'Master', 'Master', 'manage_options', 'wugweb-platforms', '__return_null', 'dashicons-database', 58 );
		foreach ( $pages as $slug => $p ) {
			$hook = add_submenu_page( 'wugweb-platforms', $p[0], $p[0], 'manage_options', $slug, function () use ( $slug, $p, &$hook ) {
				global $wpdb;
				$h = get_plugin_page_hookname( $slug, 'wugweb-platforms' );
				$t = new Wugweb_Table_List( $p[1], $h, $p[2] );
				$t->prepare_items();
				echo '<div class="wrap"><h1>' . esc_html( $p[0] ) . '</h1>';
				echo '<details style="margin:12px 0"><summary><strong>Schema: ' . esc_html( $wpdb->prefix . $p[1] ) . ' (' . count( $t->types ) . ' columns)</strong></summary><table class="widefat striped" style="max-width:520px;margin-top:8px"><thead><tr><th>Column</th><th>Type</th></tr></thead><tbody>';
				foreach ( $t->types as $f => $ty ) { echo '<tr><td>' . esc_html( $f ) . '</td><td>' . esc_html( $ty ) . '</td></tr>'; }
				echo '</tbody></table></details><form method="get"><input type="hidden" name="page" value="' . esc_attr( $slug ) . '" />';
				$t->search_box( 'Search', 'wugweb' ); $t->display();
				echo '</form></div>';
			} );
			add_action( "load-$hook", function () use ( $p, $hook ) {
				add_screen_option( 'per_page', array( 'label' => 'Rows per page', 'default' => 50, 'option' => "wugweb_{$GLOBALS['wpdb']->prefix}{$p[1]}_per_page" ) );
				$t = new Wugweb_Table_List( $p[1], $hook, $p[2] );
				add_filter( "manage_{$hook}_columns", array( $t, 'get_columns' ) );
			} );
		}
	} );
	add_filter( 'set_screen_option_wugweb_' . $GLOBALS['wpdb']->prefix . 'wugweb_platforms_per_page', function ( $s, $o, $v ) { return (int) $v; }, 10, 3 );
	add_filter( 'set_screen_option_wugweb_' . $GLOBALS['wpdb']->prefix . 'wugweb_tools_per_page', function ( $s, $o, $v ) { return (int) $v; }, 10, 3 );
	add_filter( 'set_screen_option_wugweb_' . $GLOBALS['wpdb']->prefix . 'wugweb_client_engagements_per_page', function ( $s, $o, $v ) { return (int) $v; }, 10, 3 );
}
