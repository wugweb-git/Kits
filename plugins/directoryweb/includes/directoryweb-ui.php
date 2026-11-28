<?php
/**
 * DirectoryWeb's screens on the Kits admin shell (docs/plugins/directoryweb-plan.md §2), the default since 12 Nov 2026.
 *
 * Addresses:
 *   admin.php?page=directoryweb                              Dashboard   manage_directoryweb (directoryweb-caps.php)
 *   edit.php?post_type=<listing type>&page=aw-claims              Claims      manage_directoryweb (menu: Fluent Forms → Claims)
 *   admin.php?page=directoryweb-settings                      Settings    manage_options
 *
 * One claim (&entry=) and the notice after a review (&done=) are server-rendered on the Claims address
 * (claims-review.php). The screens are one script (directoryweb/build/index.js, from directoryweb/src/), drawn with
 * Kits Core's shell parts and fed by the directoryweb/v1 routes (directoryweb-rest.php). When Kits Core's shell or the
 * build file is missing, each screen shows one notice saying so.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const DIRECTORYWEB_PAGE          = 'directoryweb';
const DIRECTORYWEB_SETTINGS_PAGE = 'directoryweb-settings';

/** Which screen each page is, with its capability. */
function directoryweb_ui_screens(): array {
	return array(
		DIRECTORYWEB_PAGE          => array( 'dashboard', DIRECTORYWEB_CAP ),
		'aw-claims'                => array( 'claims', DIRECTORYWEB_CAP ),
		DIRECTORYWEB_SETTINGS_PAGE => array( 'settings', 'manage_options' ),
		DIRECTORYWEB_LISTINGS_PAGE => array( 'listings', DIRECTORYWEB_LISTINGS_CAP ),
		'directoryweb-types'       => array( 'types', 'manage_options' ),
		'directoryweb-schema'      => array( 'schema', 'manage_options' ),
		'directoryweb-forms'       => array( 'forms', 'manage_options' ),
		'directoryweb-transfer'    => array( 'transfer', 'manage_options' ),
	);
}

/**
 * Which new screen this request asks for: 'dashboard', 'claims', 'listings', 'settings' or ''.
 */
function directoryweb_ui_wanted(): string {
	$page = sanitize_key( wp_unslash( $_GET['page'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- which screen to show; nothing is saved here
	// One claim to review, and the notice after a review, are server-rendered (claims-review.php).
	if ( 'aw-claims' === $page && ( isset( $_GET['entry'] ) || isset( $_GET['done'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- same
		return '';
	}
	return directoryweb_ui_screens()[ $page ][0] ?? '';
}

/**
 * The new screen is on this request (its script enqueued). Set on admin_enqueue_scripts.
 *
 * @param bool|null $set Set the flag.
 */
function directoryweb_ui_ready( ?bool $set = null ): bool {
	static $ready = false;
	if ( null !== $set ) {
		$ready = $set;
	}
	return $ready;
}

/**
 * The address of a screen.
 *
 * @param string $screen 'dashboard', 'claims', 'listings' or 'settings'.
 */
function directoryweb_ui_url( string $screen ): string {
	$pages = array(
		'settings' => DIRECTORYWEB_SETTINGS_PAGE,
		'listings' => DIRECTORYWEB_LISTINGS_PAGE,
		'types'    => 'directoryweb-types',
		'schema'   => 'directoryweb-schema',
		'forms'    => 'directoryweb-forms',
		'transfer' => 'directoryweb-transfer',
	);
	if ( 'claims' === $screen ) {
		return add_query_arg(
			array(
				'post_type' => directoryweb_post_type(),
				'page'      => 'aw-claims',
			),
			admin_url( 'edit.php' )
		);
	}
	return add_query_arg( 'page', $pages[ $screen ] ?? DIRECTORYWEB_PAGE, admin_url( 'admin.php' ) );
}

// Plugins → DirectoryWeb opens the Dashboard (owner, 12 Nov 2026: "Yes, add it", as the other Kits plugins); Settings
// opens from the Dashboard and lights the same item. Claims: Fluent Forms → Claims (claims-review.php).
add_action(
	'admin_menu',
	function () {
		// The Wugweb block (owner, 12 Nov 2026): Kits, DirectoryWeb, SourceWeb, RankWeb, InsightWeb, MailWeb, PlanWeb at 58.1-58.7,
		// after one separator (58.05), before WordPress's second separator (59); the same with or without Kits Core.
		// The icon is the plugin's one-colour SVG as a data URI, which WordPress paints in the admin colour scheme.
		$icon = DIRECTORYWEB_DIR . 'assets/menu-icon.svg';
		$icon = is_readable( $icon ) ? 'data:image/svg+xml;base64,' . base64_encode( (string) file_get_contents( $icon ) ) : 'dashicons-location-alt'; // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode, WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- the plugin's own small SVG file.
		add_menu_page( __( 'DirectoryWeb', 'directoryweb' ), __( 'DirectoryWeb', 'directoryweb' ), DIRECTORYWEB_CAP, DIRECTORYWEB_PAGE, 'directoryweb_dashboard_page', $icon, '58.2' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown -- DirectoryWeb's own capability (directoryweb-caps.php)
		$GLOBALS['admin_page_hooks'][ DIRECTORYWEB_PAGE ] = 'directoryweb'; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- the screens' hook prefix (directoryweb_page_…), whatever the title.
		if ( ! isset( $GLOBALS['menu']['58.05'] ) ) {
			$GLOBALS['menu']['58.05'] = array( '', 'read', 'separator-wugweb', '', 'wp-menu-separator', 'separator-wugweb' ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- one separator above the block, as core adds its own.
		}
		add_submenu_page( DIRECTORYWEB_PAGE, __( 'DirectoryWeb', 'directoryweb' ), __( 'Dashboard', 'directoryweb' ), DIRECTORYWEB_CAP, DIRECTORYWEB_PAGE, 'directoryweb_dashboard_page' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown -- as above
		add_submenu_page( DIRECTORYWEB_PAGE, __( 'Directory listings', 'directoryweb' ), __( 'Listings', 'directoryweb' ), DIRECTORYWEB_LISTINGS_CAP, DIRECTORYWEB_LISTINGS_PAGE, 'directoryweb_listings_page' );
		add_submenu_page( DIRECTORYWEB_PAGE, __( 'DirectoryWeb settings', 'directoryweb' ), __( 'Settings', 'directoryweb' ), 'manage_options', DIRECTORYWEB_SETTINGS_PAGE, 'directoryweb_settings_page' );
		foreach ( array(
			'types'    => array( 'directoryweb-types', __( 'Listing Types', 'directoryweb' ) ),
			'schema'   => array( 'directoryweb-schema', __( 'Schema & Fields', 'directoryweb' ) ),
			'forms'    => array( 'directoryweb-forms', __( 'Form Integrations', 'directoryweb' ) ),
			'transfer' => array( 'directoryweb-transfer', __( 'Import / Export', 'directoryweb' ) ),
		) as $directoryweb_screen => $directoryweb_item ) {
			add_submenu_page(
				DIRECTORYWEB_PAGE,
				$directoryweb_item[1],
				$directoryweb_item[1],
				'manage_options',
				$directoryweb_item[0],
				static function () use ( $directoryweb_screen, $directoryweb_item ) {
					if ( directoryweb_ui_page( $directoryweb_screen ) ) {
						return;
					}
					directoryweb_missing_page( $directoryweb_item[1], $directoryweb_screen );
				}
			);
		}
	}
);

// The menu's order: Dashboard, Listings, Listing Types, Schema & Fields, Form Integrations, Claims, Import / Export,
// Settings; any other item (Place intros) after them. Claims is added elsewhere (claims-review.php), so this runs last.
add_action(
	'admin_menu',
	function () {
		global $submenu;
		if ( empty( $submenu[ DIRECTORYWEB_PAGE ] ) ) {
			return;
		}
		$order = array( DIRECTORYWEB_PAGE, DIRECTORYWEB_LISTINGS_PAGE, 'directoryweb-types', 'directoryweb-schema', 'directoryweb-forms', 'aw-claims', DIRECTORYWEB_CLAIMS_LINK, 'directoryweb-transfer', DIRECTORYWEB_SETTINGS_PAGE );
		$rank  = static function ( $item ) use ( $order ) {
			$i = array_search( $item[2], $order, true );
			return false === $i ? count( $order ) : $i;
		};
		$items = array_values( $submenu[ DIRECTORYWEB_PAGE ] );
		usort( $items, static fn( $a, $b ) => $rank( $a ) <=> $rank( $b ) );
		$submenu[ DIRECTORYWEB_PAGE ] = $items; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- reordering this plugin's own submenu
	},
	999
);

// One top-level menu for the plugin (WordPress Plugin Handbook): the listing type sits under DirectoryWeb instead of a
// second top-level "Directory" item beside it. Only the menu placement changes — the listings, their data, the Fluent
// Forms claims and the theme are untouched; the native All listings / Add listing screens still open at their URLs
// (DirectoryWeb → Listings, and the editor), and Claims stays where it is (Fluent Forms → Claims when active).
// NOTE: the site's admin IA groups content types at the top (animal-writes-core/includes/admin-ia.php, owner 12 Nov
// 2026), so this moves "Directory" out of that top group into the DirectoryWeb product menu. Owner to review and
// verify on staging before shipping. Prepared on a branch; nothing deploys from here.
add_filter(
	'register_post_type_args',
	function ( $args, $type ) {
		if ( directoryweb_post_type() === $type ) {
			$args['show_in_menu'] = false;
		}
		return $args;
	},
	20, // After the legacy Core plugin's own register_post_type_args filter (priority 10).
	2
);
add_filter(
	'parent_file',
	function ( $parent_file ) {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		return $screen && directoryweb_post_type() === $screen->post_type ? DIRECTORYWEB_PAGE : $parent_file;
	}
);
add_filter(
	'submenu_file',
	function ( $submenu ) {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		return $screen && directoryweb_post_type() === $screen->post_type ? DIRECTORYWEB_LISTINGS_PAGE : $submenu;
	}
);

add_action(
	'admin_enqueue_scripts',
	function () {
		$screen = directoryweb_ui_wanted();
		if ( '' === $screen || ! function_exists( 'kits_shell_app' ) ) {
			return;
		}
		$caps = array_column( directoryweb_ui_screens(), 1, 0 );
		if ( ! current_user_can( $caps[ $screen ] ) ) {
			return;
		}
		$tab = static fn( $slug, $label, $url ) => array(
			'slug'    => $slug,
			'label'   => $label,
			'url'     => $url,
			'current' => $slug === $screen,
		);
		$tabs = array(
			$tab( 'dashboard', __( 'Dashboard', 'directoryweb' ), directoryweb_ui_url( 'dashboard' ) ),
			$tab( 'listings', __( 'Listings', 'directoryweb' ), current_user_can( DIRECTORYWEB_LISTINGS_CAP ) ? directoryweb_ui_url( 'listings' ) : add_query_arg( 'post_type', directoryweb_post_type(), admin_url( 'edit.php' ) ) ),
		);
		if ( current_user_can( 'manage_options' ) ) {
			$tabs[] = $tab( 'types', __( 'Listing Types', 'directoryweb' ), directoryweb_ui_url( 'types' ) );
			$tabs[] = $tab( 'schema', __( 'Schema & Fields', 'directoryweb' ), directoryweb_ui_url( 'schema' ) );
			$tabs[] = $tab( 'forms', __( 'Form Integrations', 'directoryweb' ), directoryweb_ui_url( 'forms' ) );
		}
		$tabs[] = $tab( 'claims', __( 'Claims', 'directoryweb' ), directoryweb_ui_url( 'claims' ) );
		if ( current_user_can( 'manage_options' ) ) {
			$tabs[] = $tab( 'transfer', __( 'Import / Export', 'directoryweb' ), directoryweb_ui_url( 'transfer' ) );
			$tabs[] = $tab( 'settings', __( 'Settings', 'directoryweb' ), directoryweb_ui_url( 'settings' ) );
			$tabs[] = array(
				'slug'    => 'place-intros',
				'label'   => __( 'Place intros', 'directoryweb' ),
				'url'     => directoryweb_place_intros_url(), // a core screen (place-intros.php)
				'current' => false,
			);
		}
		$ok = kits_shell_app(
			array(
				'handle'      => 'directoryweb-admin',
				'src'         => plugins_url( 'build/index.js', DIRECTORYWEB_FILE ),
				'asset'       => DIRECTORYWEB_DIR . 'build/index.asset.php',
				'object'      => 'directorywebApp',
				'text_domain' => 'directoryweb',
				'data'        => array(
					'screen'   => $screen,
					'name'     => 'DirectoryWeb',
					'version'  => DIRECTORYWEB_VERSION,
					'icon'     => plugins_url( 'assets/icon.svg', DIRECTORYWEB_FILE ),
					'tabs'     => $tabs,
					'listings' => add_query_arg( 'post_type', directoryweb_post_type(), admin_url( 'edit.php' ) ),
					'rest'     => DIRECTORYWEB_REST,
				),
			)
		);
		if ( $ok ) {
			// The plugin's own screen layout (full-width tables, Dashboard overview grid), on top of the shell's styles.
			wp_enqueue_style(
				'directoryweb-admin',
				plugins_url( 'assets/css/directoryweb-admin.css', DIRECTORYWEB_FILE ),
				array( 'kits-shell' ),
				DIRECTORYWEB_VERSION
			);
		}
		directoryweb_ui_ready( $ok );
	}
);

/**
 * Draw the new screen in place of the current one, when it is ready. The page callbacks call this first.
 *
 * @param string $screen 'dashboard', 'claims', 'listings' or 'settings'.
 * @return bool True when the new screen was drawn.
 */
function directoryweb_ui_page( string $screen ): bool {
	if ( directoryweb_ui_wanted() !== $screen || ! directoryweb_ui_ready() || ! function_exists( 'kits_shell_mount' ) ) {
		return false;
	}
	$titles = array(
		'dashboard' => __( 'DirectoryWeb', 'directoryweb' ),
		'claims'    => __( 'Claims', 'directoryweb' ),
		'listings'  => __( 'Directory listings', 'directoryweb' ),
		'settings'  => __( 'DirectoryWeb settings', 'directoryweb' ),
		'types'     => __( 'Listing Types', 'directoryweb' ),
		'schema'    => __( 'Schema & Fields', 'directoryweb' ),
		'forms'     => __( 'Form Integrations', 'directoryweb' ),
		'transfer'  => __( 'Import / Export', 'directoryweb' ),
	);
	kits_shell_mount( 'directoryweb-app', $titles[ $screen ] );
	return true;
}

/**
 * The page when the shell screen cannot be drawn (Kits Core or the build missing): the plain screen for the five that have one, else a notice.
 *
 * @param string $title  Heading.
 * @param string $screen types, schema, forms, transfer or claims; empty for none.
 */
function directoryweb_missing_page( string $title, string $screen = '' ): void {
	if ( '' !== $screen && function_exists( 'directoryweb_native_screens' ) && isset( directoryweb_native_screens()[ $screen ] ) ) {
		directoryweb_native_screen( $screen ); // plain WordPress screen, no Kits Core needed
		return;
	}
	if ( 'claims' === $screen && function_exists( 'directoryweb_native_claims_list' ) ) {
		directoryweb_native_claims_list();
		return;
	}
	echo '<div class="wrap"><h1>' . esc_html( $title ) . '</h1>';
	wp_admin_notice( esc_html__( 'DirectoryWeb needs Kits Core (active, with its build) to show this screen.', 'directoryweb' ), array( 'type' => 'error' ) );
	echo '</div>';
}

// Kits → Tools export: only the claim form's ID from the site's form map (owner, 12 Nov 2026), the one value the new
// Settings saves. On import only that key changes; every other form ID stays as stored.
add_filter(
	'kits_settings_transfer_options',
	function ( $names ) {
		return array_values( array_unique( array_merge( (array) $names, array( directoryweb_forms_option() ) ) ) );
	}
);
add_filter(
	'kits_settings_transfer_value',
	function ( $value, $name ) {
		if ( directoryweb_forms_option() !== $name ) {
			return $value;
		}
		return array( 'claim' => absint( ( (array) $value )['claim'] ?? 0 ) );
	},
	10,
	2
);
add_filter(
	'kits_settings_transfer_import_value',
	function ( $value, $name, $stored ) {
		if ( directoryweb_forms_option() !== $name ) {
			return $value;
		}
		$stored = (array) $stored;
		$claim  = absint( ( (array) $value )['claim'] ?? 0 );
		if ( $claim ) {
			$stored['claim'] = $claim;
		}
		return $stored;
	},
	10,
	3
);

/** The option that maps form keys to Fluent Forms IDs. */
function directoryweb_forms_option(): string {
	return defined( 'KITS_FF_OPTION' ) ? KITS_FF_OPTION : 'aw_ff_forms';
}

/** Dashboard page callback. */
function directoryweb_dashboard_page(): void {
	if ( directoryweb_ui_page( 'dashboard' ) ) {
		return;
	}
	directoryweb_dashboard_native_page();
}

/** Standalone native Dashboard page. */
function directoryweb_dashboard_native_page(): void {
	$listing_counts = function_exists( 'wp_count_posts' ) ? wp_count_posts( directoryweb_post_type() ) : (object) array( 'publish' => 0 );
	$published      = (int) ( $listing_counts->publish ?? 0 );
	$drafts         = (int) ( $listing_counts->draft ?? 0 );
	$places_count   = function_exists( 'wp_count_posts' ) ? wp_count_posts( 'aw_place' ) : (object) array( 'publish' => 0 );
	$places         = (int) ( $places_count->publish ?? 0 );

	echo '<div class="wrap">';
	echo '<h1>' . esc_html__( 'DirectoryWeb Dashboard', 'directoryweb' ) . '</h1>';

	if ( ! defined( 'KITS_CORE_LOADED' ) ) {
		echo '<div class="notice notice-info"><p>' . esc_html__( 'DirectoryWeb is running in standalone mode with native WordPress admin screens. Install and activate Kits Core to unlock the unified React shell, interactive charts, and quick-filter tabs.', 'directoryweb' ) . '</p></div>';
	}

	echo '<div style="display:flex; gap:16px; margin-top:20px; flex-wrap:wrap;">';

	// Published listings card
	echo '<div class="card" style="flex:1; min-width:200px; padding:16px;">';
	echo '<h2 style="margin-top:0;">' . esc_html__( 'Published Listings', 'directoryweb' ) . '</h2>';
	echo '<p style="font-size:32px; font-weight:600; margin:10px 0;">' . esc_html( number_format_i18n( $published ) ) . '</p>';
	echo '<p><a href="' . esc_url( admin_url( 'edit.php?post_type=' . directoryweb_post_type() ) ) . '" class="button button-secondary">' . esc_html__( 'View Listings', 'directoryweb' ) . '</a></p>';
	echo '</div>';

	// Draft listings card
	echo '<div class="card" style="flex:1; min-width:200px; padding:16px;">';
	echo '<h2 style="margin-top:0;">' . esc_html__( 'Draft Listings', 'directoryweb' ) . '</h2>';
	echo '<p style="font-size:32px; font-weight:600; margin:10px 0;">' . esc_html( number_format_i18n( $drafts ) ) . '</p>';
	echo '<p><a href="' . esc_url( admin_url( 'edit.php?post_status=draft&post_type=' . directoryweb_post_type() ) ) . '" class="button button-secondary">' . esc_html__( 'View Drafts', 'directoryweb' ) . '</a></p>';
	echo '</div>';

	// Places card: only where the place type exists (it is not registered on a standalone site), or its links lead nowhere.
	if ( post_type_exists( 'aw_place' ) ) {
		echo '<div class="card" style="flex:1; min-width:200px; padding:16px;">';
		echo '<h2 style="margin-top:0;">' . esc_html__( 'Places', 'directoryweb' ) . '</h2>';
		echo '<p style="font-size:32px; font-weight:600; margin:10px 0;">' . esc_html( number_format_i18n( $places ) ) . '</p>';
		echo '<p><a href="' . esc_url( admin_url( 'edit.php?post_type=aw_place' ) ) . '" class="button button-secondary">' . esc_html__( 'Manage Places', 'directoryweb' ) . '</a></p>';
		echo '</div>';
	}

	echo '</div>';

	// Quick actions box
	echo '<div class="card" style="margin-top:20px; max-width:800px; padding:16px;">';
	echo '<h2 style="margin-top:0;">' . esc_html__( 'Quick Actions', 'directoryweb' ) . '</h2>';
	echo '<p>';
	echo '<a href="' . esc_url( admin_url( 'post-new.php?post_type=' . directoryweb_post_type() ) ) . '" class="button button-primary" style="margin-right:8px;">' . esc_html__( 'Add New Listing', 'directoryweb' ) . '</a> ';
	if ( post_type_exists( 'aw_place' ) ) {
		echo '<a href="' . esc_url( admin_url( 'post-new.php?post_type=aw_place' ) ) . '" class="button button-secondary" style="margin-right:8px;">' . esc_html__( 'Add New Place', 'directoryweb' ) . '</a> ';
	}
	if ( current_user_can( DIRECTORYWEB_CAP ) && defined( 'DIRECTORYWEB_CLAIMS_LINK' ) ) { // phpcs:ignore WordPress.WP.Capabilities.Unknown -- DirectoryWeb's own capability
		echo '<a href="' . esc_url( admin_url( DIRECTORYWEB_CLAIMS_LINK ) ) . '" class="button button-secondary" style="margin-right:8px;">' . esc_html__( 'Review Claims', 'directoryweb' ) . '</a> ';
	}
	echo '<a href="' . esc_url( admin_url( 'admin.php?page=' . DIRECTORYWEB_SETTINGS_PAGE ) ) . '" class="button button-secondary">' . esc_html__( 'DirectoryWeb Settings', 'directoryweb' ) . '</a>';
	echo '</p>';
	echo '</div>';

	echo '</div>';
}

/** Settings page callback. */
function directoryweb_settings_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to do this.', 'directoryweb' ), 403 );
	}
	if ( directoryweb_ui_page( 'settings' ) ) {
		return;
	}
	directoryweb_settings_native_page();
}

/** Standalone native Settings page. */
function directoryweb_settings_native_page(): void {
	$option_name = directoryweb_forms_option();
	$forms_map   = (array) get_option( $option_name, array() );
	$saved       = false;

	if ( 'POST' === ( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ?? '' ) ) ) && check_admin_referer( 'directoryweb_standalone_settings' ) ) {
		update_option( 'aw_ff_send_email', ! empty( $_POST['directoryweb_claim_mail'] ) ? '1' : '0' );
		$to = sanitize_email( wp_unslash( $_POST['directoryweb_claim_notify_to'] ?? '' ) );
		update_option( 'directoryweb_claim_notify_to', is_email( $to ) ? $to : '' );
		if ( isset( $_POST['directoryweb_claim_form_id'] ) ) {
			$forms_map['claim'] = absint( $_POST['directoryweb_claim_form_id'] );
			update_option( $option_name, $forms_map );
		}
		$saved = true;
	}

	$current_claim = absint( $forms_map['claim'] ?? 0 );
	$all_forms     = function_exists( 'directoryweb_ff_forms' ) ? directoryweb_ff_forms() : array();
	$native        = function_exists( 'directoryweb_claim_native_active' ) && directoryweb_claim_native_active();
	$mail_on       = '1' === (string) get_option( 'aw_ff_send_email', '0' );
	$notify        = (string) get_option( 'directoryweb_claim_notify_to', '' );
	$page_id       = (int) get_option( 'directoryweb_claim_page', 0 );

	echo '<div class="wrap">';
	echo '<h1>' . esc_html__( 'DirectoryWeb Settings', 'directoryweb' ) . '</h1>';
	if ( $saved ) {
		echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved successfully.', 'directoryweb' ) . '</p></div>';
	}
	if ( ! defined( 'KITS_CORE_LOADED' ) ) {
		echo '<div class="notice notice-info"><p>' . esc_html__( 'DirectoryWeb is running on its own. Settings saved here configure the directory and claims.', 'directoryweb' ) . '</p></div>';
	}

	echo '<form method="post" action="">';
	wp_nonce_field( 'directoryweb_standalone_settings' );
	echo '<div class="card" style="max-width:800px; margin-top:20px; padding:20px;">';
	echo '<h2 style="margin-top:0;">' . esc_html__( 'Listing claims', 'directoryweb' ) . '</h2>';
	if ( $native ) {
		echo '<p>' . esc_html__( 'Claims use the built-in claim form. Review them under Claims.', 'directoryweb' ) . '</p>';
		if ( $page_id && 'publish' === get_post_status( $page_id ) ) {
			echo '<p><a href="' . esc_url( get_permalink( $page_id ) ) . '">' . esc_html__( 'View the claim page', 'directoryweb' ) . '</a></p>';
		}
	} else {
		echo '<p class="description">' . esc_html__( 'Claims come from the selected Fluent Forms form.', 'directoryweb' ) . '</p>';
	}
	echo '<table class="form-table">';
	echo '<tr><th scope="row">' . esc_html__( 'Claim emails', 'directoryweb' ) . '</th><td><label><input type="checkbox" name="directoryweb_claim_mail" value="1"' . checked( $mail_on, true, false ) . '> ' . esc_html__( 'Email claimants and the site owner about new claims and decisions', 'directoryweb' ) . '</label></td></tr>';
	echo '<tr><th scope="row"><label for="directoryweb_claim_notify_to">' . esc_html__( 'Notify', 'directoryweb' ) . '</label></th><td><input type="email" class="regular-text" name="directoryweb_claim_notify_to" id="directoryweb_claim_notify_to" value="' . esc_attr( $notify ) . '" placeholder="' . esc_attr( (string) get_option( 'admin_email' ) ) . '"><p class="description">' . esc_html__( 'Where new-claim emails go. Empty uses the site admin email.', 'directoryweb' ) . '</p></td></tr>';
	if ( ! empty( $all_forms ) ) {
		echo '<tr><th scope="row"><label for="directoryweb_claim_form_id">' . esc_html__( 'Fluent Forms claim form', 'directoryweb' ) . '</label></th><td><select name="directoryweb_claim_form_id" id="directoryweb_claim_form_id"><option value="0">' . esc_html__( 'None (use the built-in form)', 'directoryweb' ) . '</option>';
		foreach ( $all_forms as $id => $title ) {
			echo '<option value="' . esc_attr( (string) $id ) . '" ' . selected( $current_claim, (int) $id, false ) . '>' . esc_html( sprintf( '#%d — %s', $id, $title ) ) . '</option>';
		}
		echo '</select></td></tr>';
	}
	echo '</table>';
	echo '<p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="' . esc_attr__( 'Save Changes', 'directoryweb' ) . '"></p>';
	echo '</div>';
	echo '</form>';
	directoryweb_claim_status_card();
	echo '</div>';
}

/** Standalone Settings: a read-only card with the live state of the claim path. */
function directoryweb_claim_status_card(): void {
	if ( ! function_exists( 'directoryweb_claim_diagnostics' ) ) {
		return;
	}
	$d    = directoryweb_claim_diagnostics();
	$yes  = __( 'Yes', 'directoryweb' );
	$no   = __( 'No', 'directoryweb' );
	$src  = fn( string $k ) => ' (' . directoryweb_claim_source_label( (string) $d['sources'][ $k ] ) . ')';
	$rows = array(
		__( 'Claim path', 'directoryweb' )              => 'built-in' === $d['mode'] ? __( 'Built-in form', 'directoryweb' ) : __( 'Fluent Forms', 'directoryweb' ),
		__( 'Fluent Forms active', 'directoryweb' )     => $d['fluent_forms'] ? $yes : $no,
		__( 'Claim page published', 'directoryweb' )    => ( $d['page_live'] ? $yes : $no ) . $src( 'page' ),
		__( 'Claim emails', 'directoryweb' )            => ( $d['mail_on'] ? __( 'On', 'directoryweb' ) : __( 'Off', 'directoryweb' ) ) . $src( 'mail' ),
		__( 'New-claim emails go to', 'directoryweb' )  => $d['notify_to'] . ' (' . ( 'option' === $d['sources']['notify'] ? directoryweb_claim_source_label( 'option' ) : __( 'site admin email', 'directoryweb' ) . ', ' . directoryweb_claim_source_label( 'default' ) ) . ')',
		/* translators: 1: open claims per email, 2: submissions per hour. */
		__( 'Limits', 'directoryweb' )                  => sprintf( __( '%1$d open claims per email; %2$d submissions per hour per connection', 'directoryweb' ), $d['max_open_per_email'], $d['max_sends_per_hour'] ) . $src( 'limits' ),
	);
	foreach ( $d['counts'] as $state => $n ) {
		/* translators: %s: claim state. */
		$rows[ sprintf( __( 'Built-in claims: %s', 'directoryweb' ), $state ) ] = number_format_i18n( $n );
	}
	$rows[ __( 'Built-in claims: all', 'directoryweb' ) ] = number_format_i18n( $d['total'] );
	echo '<div class="card" id="directoryweb-claim-status" style="max-width:800px; margin-top:20px; padding:20px;">';
	echo '<h2 style="margin-top:0;">' . esc_html__( 'Claim status', 'directoryweb' ) . '</h2>';
	echo '<table class="widefat striped" role="presentation"><tbody>';
	foreach ( $rows as $label => $value ) {
		echo '<tr><th scope="row" style="width:40%">' . esc_html( $label ) . '</th><td>' . esc_html( $value ) . '</td></tr>';
	}
	echo '</tbody></table>';
	echo '<p class="description">' . esc_html__( 'Read live each time this page opens. Counts are DirectoryWeb’s built-in claims only: claims submitted through Fluent Forms or another form provider are not read and not included.', 'directoryweb' ) . '</p>';
	echo '</div>';
}
