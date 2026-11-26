<?php
/**
 * RankWeb's screens on the Kits admin shell: admin.php?page=aw-seo-plus (Dashboard: the counts and the tools),
 * aw-seo-insights (Insights: trends and gaps), aw-seo-modules (Modules: switches, the modules table, where things
 * are), aw-faq (FAQ, native), aw-links (Internal links, native), aw-images and aw-seo-csv (native), aw-seo-settings (Settings) and
 * the one other working tool, aw-redirects (its own output and forms as page parts). The screens are one
 * script (build/index.js, from src/), drawn with Kits Core's shell parts (kits-core/includes/admin-shell.php) and fed
 * by the rankweb/v1 routes (rankweb-rest.php).
 *
 * When Kits Core or a build file is missing, the screen is drawn as a plain WordPress page (rankweb-native-admin.php). The front end (titles,
 * schema, sitemap and the rest) never needs Kits Core.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Which screen this request asks for: 'dashboard', 'insights', 'modules', 'faq', 'settings', 'links', 'images', 'csv', 'redirects' or ''.
 */
function rankweb_ui_wanted(): string {
	$page = sanitize_key( wp_unslash( $_GET['page'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- which screen to show; nothing is saved here
	return array(
		AW_SEO_MENU       => 'dashboard',
		'aw-seo-insights' => 'insights',
		'aw-seo-modules'  => 'modules',
		'aw-faq'          => 'faq',
		'aw-seo-settings' => 'settings',
		'aw-links'        => 'links',
		'aw-images'       => 'images',
		'aw-seo-csv'      => 'csv',
		'aw-redirects'    => 'redirects',
	)[ $page ] ?? '';
}

/**
 * The capability a screen needs: the menu entry's own (Settings, Images, SEO CSV and Redirect tools are manage_options;
 * the rest manage_rankweb). The script is enqueued only for a user who has it, and each screen's REST routes check the
 * same one (rankweb_rest_can()).
 *
 * @param string $screen A screen from rankweb_ui_wanted().
 */
function rankweb_ui_cap( string $screen ): string {
	return in_array( $screen, array( 'settings', 'images', 'csv', 'redirects' ), true ) ? 'manage_options' : RANKWEB_CAP;
}

/**
 * The views of the Internal links screen that are available: the audit always, the anchor mix and the silos when their
 * files are loaded.
 *
 * @return string[] 'audit', 'anchors', 'silos'.
 */
function rankweb_ui_link_views(): array {
	return array_values(
		array_filter(
			array(
				'audit',
				function_exists( 'rankweb_anchor_page' ) ? 'anchors' : '',
				function_exists( 'rankweb_silo_payload' ) ? 'silos' : '',
			)
		)
	);
}

/**
 * The screen is on this request (its script enqueued). Set on admin_enqueue_scripts.
 *
 * @param bool|null $set Set the flag.
 */
function rankweb_ui_ready( ?bool $set = null ): bool {
	static $ready = false;
	if ( null !== $set ) {
		$ready = $set;
	}
	return $ready;
}

/**
 * The address of a screen.
 *
 * @param string $screen 'dashboard', 'insights', 'modules' or 'settings'.
 */
function rankweb_ui_url( string $screen ): string {
	$page = array(
		'settings' => 'aw-seo-settings',
		'insights' => 'aw-seo-insights',
		'modules'  => 'aw-seo-modules',
	)[ $screen ] ?? AW_SEO_MENU;
	return add_query_arg( 'page', $page, admin_url( 'admin.php' ) );
}

/**
 * RankWeb's working screens (the classic pages under the RankWeb menu) the current user can open, for the Dashboard's
 * Tools card. Read from the menu itself, so a screen of a module switched off is not listed.
 *
 * @return array[] [ { label, desc, url } ].
 */
function rankweb_ui_tools(): array {
	$about = array(
		'aw-links'     => __( 'The internal-link audit, anchor mix and silos.', 'rankweb' ),
		'aw-images'    => __( 'Find and replace alt text, titles and captions across the media library.', 'rankweb' ),
		'aw-seo-csv'   => __( 'Export and import SEO fields as a CSV file.', 'rankweb' ),
		'aw-redirects' => __( 'Redirect imports, exports and the 404 log.', 'rankweb' ),
	);
	$items = (array) ( $GLOBALS['submenu'][ AW_SEO_MENU ] ?? array() );
	$tools = array();
	foreach ( $about as $slug => $desc ) {
		foreach ( $items as $item ) {
			if ( ( $item[2] ?? '' ) === $slug && current_user_can( (string) $item[1] ) ) {
				$tools[] = array(
					'label' => wp_strip_all_tags( (string) $item[0] ),
					'desc'  => $desc,
					'url'   => add_query_arg( 'page', $slug, admin_url( 'admin.php' ) ),
				);
				break;
			}
		}
	}
	return $tools;
}

add_action(
	'admin_enqueue_scripts',
	function () {
		$screen = rankweb_ui_wanted();
		if ( '' === $screen || ! function_exists( 'kits_shell_app' ) || ! is_readable( RANKWEB_DIR . 'build/index.js' ) || ! current_user_can( rankweb_ui_cap( $screen ) ) ) {
			return;
		}
		$main_file = defined( 'RANKWEB_FILE' ) ? RANKWEB_FILE : ( file_exists( RANKWEB_DIR . 'rankweb.php' ) ? RANKWEB_DIR . 'rankweb.php' : RANKWEB_DIR . 'rankweb.php' );
		$head      = get_file_data( $main_file, array( 'Version' => 'Version' ) );
		$tabs = array(
			array(
				'slug'    => 'dashboard',
				'label'   => __( 'Dashboard', 'rankweb' ),
				'url'     => rankweb_ui_url( 'dashboard' ),
				'current' => 'dashboard' === $screen,
			),
			array(
				'slug'    => 'insights',
				'label'   => __( 'Insights', 'rankweb' ),
				'url'     => rankweb_ui_url( 'insights' ),
				'current' => 'insights' === $screen,
			),
			array(
				'slug'    => 'modules',
				'label'   => __( 'Modules', 'rankweb' ),
				'url'     => rankweb_ui_url( 'modules' ),
				'current' => 'modules' === $screen,
			),
			array(
				'slug'    => 'faq',
				'label'   => __( 'FAQ', 'rankweb' ),
				'url'     => add_query_arg( 'page', 'aw-faq', admin_url( 'admin.php' ) ),
				'current' => 'faq' === $screen,
			),
		);
		// No Search Insights tab: it is InsightWeb's, with its own menu (owner, 11 Nov 2026).
		if ( current_user_can( 'manage_options' ) ) {
			$tabs[] = array(
				'slug'    => 'settings',
				'label'   => __( 'Settings', 'rankweb' ),
				'url'     => rankweb_ui_url( 'settings' ),
				'current' => 'settings' === $screen,
			);
		}
		if ( 'settings' === $screen ) {
			wp_enqueue_media(); // The default share image picker (MediaField).
		}
		$ok = kits_shell_app(
			array(
				'handle'      => 'rankweb-admin',
				'src'         => plugins_url( 'build/index.js', $main_file ),
				'asset'       => RANKWEB_DIR . 'build/index.asset.php',
				'object'      => 'rankwebApp',
				'text_domain' => 'rankweb',
				'data'        => array(
					'screen'    => $screen,
					'name'      => 'RankWeb',
					'version'   => (string) $head['Version'],
					'icon'      => plugins_url( 'assets/icon.svg', $main_file ),
					'tabs'      => $tabs,
					'rest'      => RANKWEB_REST,
					'faqUrl'    => add_query_arg( 'page', 'aw-faq', admin_url( 'admin.php' ) ),
					// The Dashboard's module switches save through settings/modules (manage_options).
					'canSwitch' => current_user_can( 'manage_options' ),
					// Internal links: the views whose files are loaded (a module switched off has none).
					'linkViews' => 'links' === $screen ? rankweb_ui_link_views() : array(),
					// The tools still drawn as page parts (Kits Core's page parts); the FAQ screen is native.
					'parts'     => rankweb_tool_parts( $screen ),
					// The Dashboard's Tools card.
					'tools'     => 'dashboard' === $screen ? rankweb_ui_tools() : array(),
				),
			)
		);
		rankweb_ui_ready( $ok );
		if ( $ok ) {
			// Layout-only overrides on RankWeb's own shell screens (full-width data tables, dashboard chart grids).
			// Scoped to the body class below, so no other Kits plugin's shell is affected; the shell package is untouched.
			wp_enqueue_style(
				'rankweb-admin-css',
				plugins_url( 'assets/admin.css', $main_file ),
				array( 'kits-shell' ),
				(string) $head['Version']
			);
			add_filter( 'admin_body_class', 'rankweb_ui_body_class' );
		}
	}
);

/**
 * The body class that scopes RankWeb's layout overrides (assets/admin.css) to its own shell screens.
 *
 * @param string $classes Admin body classes.
 */
function rankweb_ui_body_class( $classes ) {
	return trim( (string) $classes . ' rankweb-shell-screen' );
}

/**
 * Draw a screen: the shell when its script is enqueued, else a notice that it needs Kits Core. The page callbacks
 * call this.
 *
 * @param string $screen 'dashboard', 'insights', 'modules', 'faq' or 'settings'.
 */
function rankweb_ui_page( string $screen ): void {
	$title = array(
		'settings' => __( 'RankWeb settings', 'rankweb' ),
		'faq'      => __( 'FAQ', 'rankweb' ),
		'insights' => __( 'RankWeb insights', 'rankweb' ),
		'modules'  => __( 'RankWeb modules', 'rankweb' ),
		'links'    => __( 'Internal links', 'rankweb' ),
		'images'   => __( 'Image SEO', 'rankweb' ),
		'csv'      => __( 'SEO CSV', 'rankweb' ),
		'redirects' => __( 'Redirect tools', 'rankweb' ),
	)[ $screen ] ?? __( 'RankWeb', 'rankweb' );
	if ( rankweb_ui_ready() && function_exists( 'kits_shell_mount' ) ) {
		kits_shell_mount( 'rankweb-app', $title );
		return;
	}
	if ( function_exists( 'rankweb_native_screen' ) ) { // no Kits Core: the same screens as plain WordPress pages (rankweb-native-admin.php)
		rankweb_native_screen( $screen, $title );
		return;
	}
	echo '<div class="wrap"><h1>' . esc_html( $title ) . '</h1>';
	wp_admin_notice( esc_html__( 'RankWeb needs Kits Core (active, with its build) to show this screen.', 'rankweb' ), array( 'type' => 'error' ) );
	echo '</div>';
}

/**
 * The output of one working tool (Internal links, Image SEO, SEO CSV, Redirect tools) as page parts for the shell. The
 * forms keep posting to admin-post.php with their own nonce, so nothing about saving changed.
 *
 * @param string $screen 'links', 'images', 'csv' or 'redirects'.
 */
function rankweb_tool_parts( string $screen ): array {
	$body = array(
		'redirects' => 'rankweb_redirect_tools_body',
	)[ $screen ] ?? '';
	if ( '' === $body || ! function_exists( $body ) || ! function_exists( 'kits_shell_html_parts' ) ) {
		return array();
	}
	ob_start();
	$body();
	return kits_shell_html_parts( (string) ob_get_clean() );
}
