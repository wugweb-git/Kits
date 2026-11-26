<?php
/**
 * RankWeb's admin screens as plain WordPress pages, for a site without Kits Core.
 *
 * With Kits Core (and its build) the screens are the Kits shell (rankweb-ui.php). Without it, rankweb_ui_page() calls
 * rankweb_native_screen() here: Overview with the real state of the site's search files, Modules, Settings (every tab,
 * saved through the same rankweb_seo_settings_save() the shell uses), FAQ and a pointer for Insights. Nothing here needs
 * Kits Core, Rank Math or any sibling plugin.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The address of a RankWeb screen. */
function rankweb_native_url( string $page, array $args = array() ): string {
	return add_query_arg( array_merge( array( 'page' => $page ), $args ), admin_url( 'admin.php' ) );
}

/** The state of the site's search files, as rows: [label, ok (true, false or null for a note), detail]. */
function rankweb_native_diagnostics(): array {
	$rows   = array();
	$owner  = function_exists( 'rankweb_seo_owner' ) ? rankweb_seo_owner() : 'none';
	$other  = function_exists( 'rankweb_other_seo_plugin' ) ? rankweb_other_seo_plugin() : '';
	$labels = array(
		'none'      => __( 'RankWeb prints the page head (description, Open Graph, Twitter, robots, structured data).', 'rankweb' ),
		'rank_math' => __( 'Rank Math prints the page head; RankWeb adds its own tools to it.', 'rankweb' ),
		'other'     => sprintf( /* translators: %s: plugin name */ __( '%s prints the page head; RankWeb leaves it alone.', 'rankweb' ), '' !== $other ? $other : __( 'Another SEO plugin', 'rankweb' ) ),
	);
	$rows[] = array( __( 'Who prints the page head', 'rankweb' ), true, $labels[ $owner ] ?? $owner );
	$rows[] = array( __( 'Search engine visibility', 'rankweb' ), (bool) get_option( 'blog_public' ), get_option( 'blog_public' ) ? __( 'The site asks search engines to index it.', 'rankweb' ) : __( 'Settings → Reading asks search engines NOT to index this site. Nothing else here will matter until that is off.', 'rankweb' ) );
	$pretty = '' !== (string) get_option( 'permalink_structure' );
	$rows[] = array( __( 'Permalinks', 'rankweb' ), $pretty, $pretty ? __( 'Readable addresses are on.', 'rankweb' ) : __( 'Plain permalinks: the sitemap and canonical addresses are less useful. Use Settings → Permalinks.', 'rankweb' ) );
	$sitemaps = function_exists( 'wp_sitemaps_get_server' ) && wp_sitemaps_get_server()->sitemaps_enabled();
	if ( 'rank_math' === $owner ) {
		$rows[] = array( __( 'XML sitemap', 'rankweb' ), null, __( 'Rank Math builds the sitemap (sitemap_index.xml).', 'rankweb' ) );
	} elseif ( 'other' === $owner ) {
		$rows[] = array( __( 'XML sitemap', 'rankweb' ), null, __( 'The other SEO plugin or WordPress builds the sitemap.', 'rankweb' ) );
	} else {
		$rows[] = array( __( 'XML sitemap', 'rankweb' ), $sitemaps, $sitemaps ? home_url( '/wp-sitemap.xml' ) . ' ' . __( '(pages marked "Keep out of search results" are left out).', 'rankweb' ) : __( 'WordPress sitemaps are switched off by something on this site.', 'rankweb' ) );
	}
	$file = file_exists( ABSPATH . 'robots.txt' );
	$rows[] = array( __( 'robots.txt', 'rankweb' ), ! $file, $file ? __( 'A real robots.txt file exists in the site folder, so WordPress cannot add the sitemap line to it.', 'rankweb' ) : home_url( '/robots.txt' ) . ' ' . __( '(built by WordPress; lists the sitemap).', 'rankweb' ) );
	if ( 'none' === $owner ) {
		$noindex = (int) ( new WP_Query( array( 'post_type' => 'any', 'post_status' => 'publish', 'meta_key' => '_rankweb_noindex', 'meta_value' => '1', 'fields' => 'ids', 'posts_per_page' => 1, 'no_found_rows' => false ) ) )->found_posts; // phpcs:ignore WordPress.DB.SlowDBQuery
		$rows[]  = array( __( 'Pages kept out of search', 'rankweb' ), null, sprintf( /* translators: %d: count */ _n( '%d page', '%d pages', $noindex, 'rankweb' ), $noindex ) );
	}
	return $rows;
}

/** One screen. */
function rankweb_native_screen( string $screen, string $title ): void {
	echo '<div class="wrap"><h1>' . esc_html( $title ) . '</h1>';
	switch ( $screen ) {
		case 'settings':
			rankweb_native_settings( false );
			break;
		case 'modules':
			rankweb_native_settings( true );
			break;
		case 'faq':
			if ( function_exists( 'rankweb_faq_admin_body' ) ) {
				rankweb_faq_admin_body();
			}
			break;
		case 'links':
		case 'images':
		case 'csv':
		case 'webp':
		case 'transport':
		case 'redirects':
			$body = array(
				'links'     => 'rankweb_link_audit_body',
				'images'    => 'rankweb_media_body',
				'csv'       => 'rankweb_bulk_csv_body',
				'redirects' => 'rankweb_redirect_tools_body',
				'transport' => 'rankweb_transport_body',
				'webp'      => 'rankweb_webp_body',
			)[ $screen ];
			if ( function_exists( $body ) ) {
				$body();
			}
			break;
		case 'insights':
			echo '<p>' . esc_html__( 'Search insights (impressions, clicks and keyword scores) are part of InsightWeb. Install and activate InsightWeb to see them here.', 'rankweb' ) . '</p>';
			break;
		default:
			rankweb_native_overview();
	}
	echo '</div>';
}

/** Overview: what RankWeb is doing on this site, and the real state of the search files. */
function rankweb_native_overview(): void {
	echo '<h2>' . esc_html__( 'Search files and page head', 'rankweb' ) . '</h2><table class="widefat striped" style="max-width:900px"><tbody>';
	foreach ( rankweb_native_diagnostics() as $row ) {
		$mark = null === $row[1] ? '•' : ( $row[1] ? '✔' : '✖' );
		echo '<tr><th scope="row" style="width:240px">' . esc_html( $row[0] ) . '</th><td><span aria-hidden="true">' . esc_html( $mark ) . '</span> ' . esc_html( (string) $row[2] ) . '</td></tr>';
	}
	echo '</tbody></table>';
	$mods = rankweb_seo_modules();
	$on   = 0;
	$sw   = 0;
	foreach ( $mods as $key => $m ) {
		if ( empty( $m['switch'] ) ) {
			continue;
		}
		++$sw;
		$on += rankweb_seo_module_on( $key ) ? 1 : 0;
	}
	echo '<h2>' . esc_html__( 'Modules', 'rankweb' ) . '</h2><p>' . esc_html( sprintf( /* translators: 1: modules on, 2: modules */ __( '%1$d of %2$d switchable modules are on.', 'rankweb' ), $on, $sw ) ) . ' <a href="' . esc_url( rankweb_native_url( 'aw-seo-modules' ) ) . '">' . esc_html__( 'Manage modules', 'rankweb' ) . '</a> · <a href="' . esc_url( rankweb_native_url( 'aw-seo-settings' ) ) . '">' . esc_html__( 'Settings', 'rankweb' ) . '</a></p>';
}

/** Settings (all tabs) or the Modules tab alone. */
function rankweb_native_settings( bool $modules_only ): void {
	$tabs = rankweb_seo_setting_tabs();
	$page = $modules_only ? 'aw-seo-modules' : 'aw-seo-settings';
	$tab  = $modules_only ? 'modules' : sanitize_key( wp_unslash( $_GET['tab'] ?? 'titles' ) ); // phpcs:ignore WordPress.Security.NonceVerification
	if ( ! isset( $tabs[ $tab ] ) ) {
		$tab = $modules_only ? 'modules' : 'titles';
	}
	if ( 'POST' === ( $_SERVER['REQUEST_METHOD'] ?? '' ) && check_admin_referer( 'rankweb_native_' . $tab ) && current_user_can( 'manage_options' ) ) {
		$posted = array();
		foreach ( (array) wp_unslash( $_POST['f'] ?? array() ) as $k => $v ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
			$posted[ sanitize_text_field( (string) $k ) ] = is_scalar( $v ) ? (string) $v : '';
		}
		$on = array();
		foreach ( (array) ( $_POST['on'] ?? array() ) as $k => $v ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
			$on[ sanitize_key( (string) $k ) ] = (bool) $v;
		}
		rankweb_seo_settings_save( $tab, $posted, ! empty( $_POST['reset'] ), $on );
		echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved.', 'rankweb' ) . '</p></div>';
	}
	if ( ! $modules_only ) {
		echo '<nav class="nav-tab-wrapper" style="margin-bottom:16px">';
		foreach ( $tabs as $k => $t ) {
			if ( 'modules' === $k ) {
				continue;
			}
			echo '<a class="nav-tab' . ( $k === $tab ? ' nav-tab-active' : '' ) . '" href="' . esc_url( rankweb_native_url( $page, array( 'tab' => $k ) ) ) . '">' . esc_html( $t['label'] ) . '</a>';
		}
		echo '</nav>';
	}
	echo '<form method="post" action="' . esc_url( rankweb_native_url( $page, $modules_only ? array() : array( 'tab' => $tab ) ) ) . '">';
	wp_nonce_field( 'rankweb_native_' . $tab );
	if ( 'modules' === $tab ) {
		echo '<table class="form-table"><tbody>';
		foreach ( rankweb_seo_modules() as $key => $m ) {
			if ( empty( $m['switch'] ) ) {
				continue;
			}
			echo '<tr><th scope="row">' . esc_html( (string) ( $m['label'] ?? $key ) ) . '</th><td><label><input type="checkbox" name="on[' . esc_attr( $key ) . ']" value="1"' . checked( rankweb_seo_module_on( $key ), true, false ) . '> ' . esc_html__( 'On', 'rankweb' ) . '</label>' . ( ! empty( $m['desc'] ) ? '<p class="description">' . esc_html( (string) $m['desc'] ) . '</p>' : '' ) . '</td></tr>';
		}
		echo '</tbody></table>';
	} else {
		$any = false;
		echo '<table class="form-table"><tbody>';
		foreach ( rankweb_seo_tab_fields( $tab ) as $key => $list ) {
			foreach ( $list as $const => $f ) {
				$any   = true;
				$saved = rankweb_seo_saved();
				$value = array_key_exists( $const, (array) ( $saved[ $key ] ?? array() ) ) ? $saved[ $key ][ $const ] : $f['default']; // what is stored now, not the constant fixed at the start of this request
				$text  = rankweb_seo_field_text( (string) $f['type'], $value );
				$name  = 'f[' . esc_attr( $const ) . ']';
				echo '<tr><th scope="row"><label for="' . esc_attr( $const ) . '">' . esc_html( (string) ( $f['label'] ?? $const ) ) . '</label></th><td>';
				if ( in_array( $f['type'], array( 'int', 'text' ), true ) ) {
					echo '<input id="' . esc_attr( $const ) . '" type="' . ( 'int' === $f['type'] ? 'number' : 'text' ) . '" class="regular-text" name="' . $name . '" value="' . esc_attr( $text ) . '">'; // phpcs:ignore WordPress.Security.EscapeOutput
				} else {
					echo '<textarea id="' . esc_attr( $const ) . '" class="large-text code" rows="' . (int) min( 12, max( 3, substr_count( $text, "\n" ) + 2 ) ) . '" name="' . $name . '">' . esc_textarea( $text ) . '</textarea>'; // phpcs:ignore WordPress.Security.EscapeOutput
				}
				if ( ! empty( $f['help'] ) ) {
					echo '<p class="description">' . esc_html( (string) $f['help'] ) . '</p>';
				}
				echo '</td></tr>';
			}
		}
		echo '</tbody></table>';
		if ( ! $any ) {
			echo '<p>' . esc_html__( 'Nothing to set on this tab.', 'rankweb' ) . '</p>';
		}
	}
	echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__( 'Save changes', 'rankweb' ) . '</button> ';
	echo '<button type="submit" name="reset" value="1" class="button" onclick="return confirm(\'' . esc_js( __( 'Restore the defaults on this tab?', 'rankweb' ) ) . '\')">' . esc_html__( 'Restore defaults', 'rankweb' ) . '</button></p></form>';
}
