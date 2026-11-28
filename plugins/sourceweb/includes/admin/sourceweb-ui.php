<?php
/**
 * SourceWeb's screens on the Kits admin shell.
 *
 * Addresses:
 *   admin.php?page=aw-sourcing-menu              Dashboard          (manage_sourceweb)
 *   admin.php?page=aw-review                     To review          (manage_sourceweb)
 *   admin.php?page=aw-enrich-review              Enrichment review  (manage_sourceweb)
 *   admin.php?page=aw-sourcing                   Sources            (manage_options; &edit=<host|new>, &view=feeds,
 *                                                &feed=<id|new>: the feed form, sourceweb_feed_parts())
 *   admin.php?page=aw-sourcing&tab=keywords      Keywords           (manage_options; &edit=<id|new>, &kw=suggestions)
 *   admin.php?page=aw-sourcing&tab=rules         Rules              (manage_options; &part=sections|summary|enrich, &edit=<type>,
 *                                                &tagrule=<tag|new>, &field=<key>)
 *   admin.php?page=aw-sourcing&tab=ai            AI models          (manage_options; &edit=<key id|new>, &overview=1)
 *   admin.php?page=aw-sourcing&tab=workers       Workers            (manage_options; &edit=<id|new>, &runs=<id>)
 *   admin.php?page=aw-sourcing&tab=rejected      Rejected           (manage_options; read-only)
 *   admin.php?page=aw-sourcing&tab=relay-log     Relay log          (manage_options; read-only)
 *   admin.php?page=aw-sourcing&tab=log           Change log         (manage_options; read-only)
 *   admin.php?page=aw-sourcing&tab=settings      Settings           (manage_options)
 *
 * The screens are one script (build/index.js, from src/), drawn with Kits Core's shell parts and fed by the
 * sourceweb/v1 routes (sourceweb-rest.php). When Kits Core or the build is missing, each screen says so (one notice).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The Sourcing page's tabs. */
const SOURCEWEB_UI_TABS = array( 'sources', 'keywords', 'rules', 'places', 'ai', 'workers', 'rejected', 'relay-log', 'log', 'settings' );

/**
 * Which screen this request asks for: 'dashboard', 'review', 'enrichment', a tab of SOURCEWEB_UI_TABS or ''. An
 * unknown tab of the Sourcing page is Sources, its first screen.
 */
function sourceweb_ui_wanted(): string {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- which screen to show; nothing is saved here
	$page = sanitize_key( wp_unslash( $_GET['page'] ?? '' ) );
	$tab  = sanitize_key( wp_unslash( $_GET['tab'] ?? '' ) );
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	if ( SOURCEWEB_SRC_PAGE === $page ) {
		return in_array( $tab, SOURCEWEB_UI_TABS, true ) ? $tab : 'sources';
	}
	return array(
		SOURCEWEB_SRC_MENU        => 'dashboard',
		'aw-review'        => 'review',
		'aw-enrich-review' => 'enrichment',
	)[ $page ] ?? '';
}

/** The capability each screen needs. */
function sourceweb_ui_caps(): array {
	return array(
		'dashboard'  => SOURCEWEB_REVIEW_CAP,
		'review'     => SOURCEWEB_REVIEW_CAP,
		'enrichment' => SOURCEWEB_ENRICH_CAP,
		'sources'    => SOURCEWEB_SRC_CAP,
		'keywords'   => SOURCEWEB_SRC_CAP,
		'rules'      => SOURCEWEB_SRC_CAP,
		'places'     => SOURCEWEB_SRC_CAP,
		'ai'         => SOURCEWEB_SRC_CAP,
		'workers'    => SOURCEWEB_SRC_CAP,
		'rejected'   => SOURCEWEB_SRC_CAP,
		'relay-log'  => SOURCEWEB_SRC_CAP,
		'log'        => SOURCEWEB_SRC_CAP,
		'settings'   => SOURCEWEB_SRC_CAP,
	);
}

/**
 * The screen is on this request (its script enqueued). Set on admin_enqueue_scripts.
 *
 * @param bool|null $set Set the flag.
 */
function sourceweb_ui_ready( ?bool $set = null ): bool {
	static $ready = false;
	if ( null !== $set ) {
		$ready = $set;
	}
	return $ready;
}

/**
 * The address of a screen.
 *
 * @param string $screen 'dashboard', 'review', 'enrichment' or a tab of SOURCEWEB_UI_TABS.
 */
function sourceweb_ui_url( string $screen ): string {
	$q = array(
		'dashboard'  => array( 'page' => SOURCEWEB_SRC_MENU ),
		'review'     => array( 'page' => 'aw-review' ),
		'enrichment' => array( 'page' => 'aw-enrich-review' ),
		'sources'    => array( 'page' => SOURCEWEB_SRC_PAGE ),
	)[ $screen ] ?? ( in_array( $screen, SOURCEWEB_UI_TABS, true ) ? array(
		'page' => SOURCEWEB_SRC_PAGE,
		'tab'  => $screen,
	) : array( 'page' => SOURCEWEB_SRC_MENU ) );
	return add_query_arg( $q, admin_url( 'admin.php' ) );
}

add_action(
	'admin_enqueue_scripts',
	function () {
		$screen = sourceweb_ui_wanted();
		if ( '' === $screen || ! function_exists( 'kits_shell_app' ) || ! current_user_can( sourceweb_ui_caps()[ $screen ] ) ) {
			return;
		}
		$main_file = defined( 'SOURCEWEB_FILE' ) ? SOURCEWEB_FILE : ( file_exists( SOURCEWEB_SOURCING_DIR . 'sourceweb.php' ) ? SOURCEWEB_SOURCING_DIR . 'sourceweb.php' : SOURCEWEB_SOURCING_DIR . 'aw-sourcing.php' );
		$head      = get_file_data( $main_file, array( 'Version' => 'Version' ) );
		// The header's tabs in menu order, with the menu's names (admin-menu.php, menu-model.php): Kits Core hides its own tab row when this lists every item.
		$order = array(
			'dashboard'  => __( 'Dashboard', 'sourceweb' ),
			'review'     => __( 'To review', 'sourceweb' ),
			'enrichment' => __( 'Enrichment review', 'sourceweb' ),
			'sources'    => __( 'Sources', 'sourceweb' ),
			'keywords'   => __( 'Keywords', 'sourceweb' ),
			'rules'      => __( 'Rules', 'sourceweb' ),
			'ai'         => __( 'AI models', 'sourceweb' ),
			'places'     => __( 'Places', 'sourceweb' ),
			'workers'    => __( 'Workers', 'sourceweb' ),
			'rejected'   => __( 'Rejected', 'sourceweb' ),
			'relay-log'  => __( 'Relay log', 'sourceweb' ),
			'log'        => __( 'Change log', 'sourceweb' ),
			'settings'   => __( 'Settings', 'sourceweb' ),
		);
		$caps  = sourceweb_ui_caps();
		$tabs  = array();
		foreach ( $order as $slug => $label ) {
			if ( ! current_user_can( $caps[ $slug ] ) ) {
				continue;
			}
			$tabs[] = array(
				'slug'    => $slug,
				'label'   => $label,
				'url'     => sourceweb_ui_url( $slug ),
				'current' => $slug === $screen,
			);
		}
		$ok = kits_shell_app(
			array(
				'handle'      => 'sourceweb-admin',
				'src'         => plugins_url( 'build/index.js', $main_file ),
				'asset'       => SOURCEWEB_SOURCING_DIR . 'build/index.asset.php',
				'object'      => 'sourcewebApp',
				'text_domain' => 'sourceweb',
				'data'        => array(
					'screen'  => $screen,
					'name'    => 'SourceWeb',
					'version' => (string) $head['Version'],
					'icon'    => plugins_url( 'assets/icon.svg', $main_file ),
					'tabs'    => $tabs,
					'rest'    => SOURCEWEB_REST,
					'isAdmin' => current_user_can( SOURCEWEB_SRC_CAP ),
					'feed'    => 'sources' === $screen ? sourceweb_feed_parts() : array(),
					'extra'   => sourceweb_extra_parts( $screen ),
				),
			)
		);
		sourceweb_ui_ready( $ok );
	}
);

/**
 * Draw a screen. The page callbacks call this after their capability check. Without Kits Core or the build, one
 * notice says so in place of the screen.
 *
 * @param string $screen 'dashboard', 'review', 'enrichment' or a tab of SOURCEWEB_UI_TABS.
 */
function sourceweb_ui_page( string $screen ): void {
	$titles = array(
		'dashboard'  => __( 'SourceWeb', 'sourceweb' ),
		'review'     => __( 'To review', 'sourceweb' ),
		'enrichment' => __( 'Enrichment review', 'sourceweb' ),
		'sources'    => __( 'Sources', 'sourceweb' ),
		'keywords'   => __( 'Keywords', 'sourceweb' ),
		'rules'      => __( 'Rules', 'sourceweb' ),
		'places'     => __( 'Places', 'sourceweb' ),
		'ai'         => __( 'AI models', 'sourceweb' ),
		'workers'    => __( 'Workers', 'sourceweb' ),
		'rejected'   => __( 'Rejected', 'sourceweb' ),
		'relay-log'  => __( 'Relay log', 'sourceweb' ),
		'log'        => __( 'Change log', 'sourceweb' ),
		'settings'   => __( 'SourceWeb settings', 'sourceweb' ),
	);
	$title = $titles[ $screen ] ?? $titles['dashboard'];
	if ( sourceweb_ui_wanted() === $screen && sourceweb_ui_ready() && function_exists( 'kits_shell_mount' ) ) {
		kits_shell_mount( 'sourceweb-app', $title );
		return;
	}
	sourceweb_ui_fallback_page( $screen, $title );
}

/**
 * Standalone native WordPress admin fallback page.
 *
 * @param string $screen The screen key.
 * @param string $title  The screen title.
 */
function sourceweb_ui_fallback_page( string $screen, string $title ): void {
	echo '<div class="wrap">';
	echo '<h1>' . esc_html( $title ) . '</h1>';

	if ( ! defined( 'KITS_CORE_LOADED' ) ) {
		echo '<div class="notice notice-info"><p>' . esc_html__( 'SourceWeb is running without Kits Core, so its screens are plain WordPress screens. SourceWeb does not fetch feeds inside WordPress: external workers read your sources and push the items to this site.', 'sourceweb' ) . '</p></div>';
	} else {
		wp_admin_notice( esc_html__( 'SourceWeb needs Kits Core (active, with its build) to show this screen.', 'sourceweb' ), array( 'type' => 'error' ) );
	}

	if ( in_array( $screen, array( 'sources', 'ai' ), true ) && ! defined( 'KITS_CORE_LOADED' ) && current_user_can( 'manage_options' ) && function_exists( 'sourceweb_standalone_sources_screen' ) ) {
		'sources' === $screen ? sourceweb_standalone_sources_screen() : sourceweb_standalone_ai_screen();
	} elseif ( 'settings' === $screen && current_user_can( 'manage_options' ) ) {
		echo '<div class="card" style="max-width:800px; padding:20px; margin-top:20px;">';
		sourceweb_modes_form();
		echo '<hr style="margin:24px 0;">';
		settings_errors( 'aw_backfill_floor' );
		settings_errors( 'aw_src_reset' );
		echo '<form method="post" action="' . esc_url( admin_url( 'options.php' ) ) . '">';
		settings_fields( 'aw_src_backfill' );
		do_settings_sections( 'aw-src-backfill' );
		submit_button( __( 'Save backfill date', 'sourceweb' ) );
		echo '</form>';
		if ( function_exists( 'sourceweb_reset_form' ) ) {
			sourceweb_reset_form( 'backfill' );
		}
		echo '<hr style="margin:24px 0;">';
		echo '<form method="post" action="' . esc_url( admin_url( 'options.php' ) ) . '">';
		settings_fields( 'aw_src_uninstall' );
		do_settings_sections( 'aw-src-uninstall' );
		submit_button( __( 'Save uninstall setting', 'sourceweb' ) );
		echo '</form>';
		if ( function_exists( 'sourceweb_reset_form' ) ) {
			sourceweb_reset_form( 'uninstall' );
		}
		echo '</div>';
	} elseif ( function_exists( 'sourceweb_sa_render' ) && sourceweb_sa_render( $screen ) ) {
		// Drawn: To review, Enrichment review, Keywords, Rules, Places, Workers, Rejected, Relay log and Change log (sourceweb-standalone-screens.php, sourceweb-standalone-config.php).
	} else {
		$cfg = function_exists( 'sourceweb_sources_config' ) ? sourceweb_sources_config() : array();
		$num_sources = count( (array) ( $cfg['sources'] ?? array() ) );
		$num_feeds   = count( (array) ( $cfg['feeds'] ?? array() ) );
		$review_count = function_exists( 'sourceweb_review_count' ) ? sourceweb_review_count() : 0;

		echo '<div style="display:flex; gap:16px; margin-top:20px; flex-wrap:wrap;">';
		echo '<div class="card" style="flex:1; min-width:200px; padding:16px;">';
		echo '<h2 style="margin-top:0;">' . esc_html__( 'Configured Sources', 'sourceweb' ) . '</h2>';
		echo '<p style="font-size:32px; font-weight:600; margin:10px 0;">' . esc_html( number_format_i18n( $num_sources ) ) . '</p>';
		echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=aw-sourcing&tab=sources' ) ) . '" class="button button-secondary">' . esc_html__( 'Manage Sources', 'sourceweb' ) . '</a></p>';
		echo '</div>';

		echo '<div class="card" style="flex:1; min-width:200px; padding:16px;">';
		echo '<h2 style="margin-top:0;">' . esc_html__( 'Active Feeds', 'sourceweb' ) . '</h2>';
		echo '<p style="font-size:32px; font-weight:600; margin:10px 0;">' . esc_html( number_format_i18n( $num_feeds ) ) . '</p>';
		echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=aw-sourcing&tab=rules' ) ) . '" class="button button-secondary">' . esc_html__( 'View Rules', 'sourceweb' ) . '</a></p>';
		echo '</div>';

		echo '<div class="card" style="flex:1; min-width:200px; padding:16px;">';
		echo '<h2 style="margin-top:0;">' . esc_html__( 'To Review', 'sourceweb' ) . '</h2>';
		echo '<p style="font-size:32px; font-weight:600; margin:10px 0;">' . esc_html( number_format_i18n( $review_count ) ) . '</p>';
		echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=aw-review' ) ) . '" class="button button-secondary">' . esc_html__( 'Review Queue', 'sourceweb' ) . '</a></p>';
		echo '</div>';

		echo '</div>';

		if ( function_exists( 'sourceweb_sourcing_dash_workers' ) ) {
			$workers = sourceweb_sourcing_dash_workers();
			if ( ! empty( $workers ) ) {
				echo '<div class="card" style="margin-top:20px; padding:16px;">';
				echo '<h2 style="margin-top:0;">' . esc_html__( 'Worker Status', 'sourceweb' ) . '</h2>';
				echo '<table class="widefat striped"><thead><tr><th>Worker</th><th>Last Run</th><th>Status</th></tr></thead><tbody>';
				foreach ( $workers as $w ) {
					echo '<tr>';
					echo '<td>' . esc_html( $w['name'] ) . '</td>';
					echo '<td>' . esc_html( $w['last'] ? wp_date( 'j M, g:i a', $w['last'] ) : 'never' ) . '</td>';
					echo '<td>' . esc_html( ucfirst( $w['status'] ) ) . '</td>';
					echo '</tr>';
				}
				echo '</tbody></table></div>';
			}
		}
	}

	echo '</div>';
}

/**
 * Server-drawn forms a screen shows under its own content, as Kits page parts: on To review, other plugins' intake
 * forms (aw_review_intake; core's social-posts.php adds a social post from its link); on Settings, the backfill date
 * and the uninstall box (Settings API forms, administrators only).
 *
 * @param string $screen The screen.
 */
function sourceweb_extra_parts( string $screen ): array {
	if ( ! function_exists( 'kits_shell_html_parts' ) ) {
		return array();
	}
	ob_start();
	if ( 'review' === $screen ) {
		do_action( 'sourceweb_review_intake' );
	} elseif ( 'settings' === $screen && current_user_can( 'manage_options' ) ) {
		settings_errors( 'aw_backfill_floor' );
		settings_errors( 'aw_src_reset' ); // "Defaults restored." after a reset below
		sourceweb_modes_form();
		echo '<form method="post" action="' . esc_url( admin_url( 'options.php' ) ) . '">';
		settings_fields( 'aw_src_backfill' );
		do_settings_sections( 'aw-src-backfill' );
		submit_button( 'Save backfill date' );
		echo '</form>';
		sourceweb_reset_form( 'backfill' );
		echo '<form method="post" action="' . esc_url( admin_url( 'options.php' ) ) . '">';
		settings_fields( 'aw_src_uninstall' );
		do_settings_sections( 'aw-src-uninstall' );
		submit_button( 'Save uninstall setting' );
		echo '</form>';
		sourceweb_reset_form( 'uninstall' );
	}
	$html = trim( (string) ob_get_clean() );
	return '' === $html ? array() : kits_shell_html_parts( $html );
}

/**
 * The feed form (Sources &feed=<id|new>, with &type= and &host=) as Kits page parts: sourceweb_sources_edit_form()'s output, so Add Feed and Update post to the same admin-post handler (sourceweb_sourcing_save_feeds),
 * with its nonce, and come back to the screen the form was opened from. Empty without a feed in the address.
 *
 * @return array[]
 */
function sourceweb_feed_parts(): array {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- which feed to show; nothing is saved here
	$feed = sanitize_key( wp_unslash( $_GET['feed'] ?? '' ) );
	if ( '' === $feed || ! function_exists( 'sourceweb_sources_edit_form' ) || ! function_exists( 'kits_shell_html_parts' ) || ! current_user_can( SOURCEWEB_SRC_CAP ) ) {
		return array();
	}
	ob_start();
	sourceweb_sources_edit_form( $feed, sanitize_key( wp_unslash( $_GET['type'] ?? '' ) ), sourceweb_sourcing_norm_host( sanitize_text_field( wp_unslash( $_GET['host'] ?? '' ) ) ) );
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	$html = (string) ob_get_clean();
	$html = (string) preg_replace( '#\s*<a [^>]*class="button">Cancel</a>#', '', $html ); // the screen's own Back button does this
	return kits_shell_html_parts( $html );
}

// SourceWeb → Settings → Uninstall: whether deleting SourceWeb also deletes its own data (uninstall.php). Off by
// default. Registered on init, so the REST API has it too; the box is a Settings API form (sourceweb_extra_parts()).
add_action(
	'init',
	function () {
		register_setting(
			'aw_src_uninstall',
			'aw_src_delete_data_on_uninstall',
			array(
				'type'              => 'boolean',
				'default'           => false,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'show_in_rest'      => true,
			)
		);
	}
);
add_action(
	'admin_init',
	function () {
		add_settings_section( 'aw_src_uninstall', 'Uninstall', '__return_null', 'aw-src-uninstall' );
		add_settings_field( 'aw_src_delete_data_on_uninstall', 'Delete this plugin\'s data when it is deleted', 'sourceweb_uninstall_field', 'aw-src-uninstall', 'aw_src_uninstall', array( 'label_for' => 'aw_src_delete_data_on_uninstall' ) );
	}
);

/** The uninstall box. */
function sourceweb_uninstall_field(): void {
	printf(
		'<input type="checkbox" id="aw_src_delete_data_on_uninstall" name="aw_src_delete_data_on_uninstall" value="1"%1$s> <p class="description">%2$s</p>',
		checked( (bool) get_option( 'aw_src_delete_data_on_uninstall', false ), true, false ),
		esc_html( 'Off: everything stays in the database if the plugin is deleted.' )
	);
}

/* ---------- Reset this section (Backfill, Uninstall) ---------- */

/**
 * "Reset this section" for SourceWeb → Settings' server-drawn sections: section => option names, put back to their
 * registered defaults. Backfill: the oldest date, 2025-11-01. Uninstall: "Delete this plugin's data" off. The groups
 * drawn by the screen itself reset through POST settings/<group> (sourceweb_settings_defaults()).
 */
function sourceweb_reset_sections(): array {
	return array(
		'backfill'  => array( 'aw_backfill_floor' ),
		'uninstall' => array( 'aw_src_delete_data_on_uninstall' ),
	);
}

/**
 * The "Reset this section" button, in a form of its own under the section's form. The screen asks before it is sent
 * (ExtraParts in src/index.js: the page parts drop a button's own script).
 *
 * @param string $section A key of sourceweb_reset_sections().
 */
function sourceweb_reset_form( string $section ): void {
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	echo '<input type="hidden" name="action" value="sourceweb_reset_section"><input type="hidden" name="section" value="' . esc_attr( $section ) . '">';
	wp_nonce_field( 'sourceweb_reset_section_' . $section, '_wpnonce', false );
	printf(
		'<p><button type="submit" class="button" onclick="return window.confirm(%1$s);">%2$s</button></p>',
		esc_attr( (string) wp_json_encode( 'Reset this section to its defaults?' ) ),
		esc_html( 'Reset this section' )
	);
	echo '</form>';
}

// "Reset this section": nonce and capability checked, the registered defaults written, back to Settings.
add_action(
	'admin_post_sourceweb_reset_section',
	function () {
		$section = isset( $_POST['section'] ) ? sanitize_key( wp_unslash( $_POST['section'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- the nonce's action names the section; checked on the next line.
		check_admin_referer( 'sourceweb_reset_section_' . $section );
		$sections = sourceweb_reset_sections();
		if ( ! current_user_can( 'manage_options' ) || ! isset( $sections[ $section ] ) ) {
			wp_die( esc_html( 'Sorry, you are not allowed to do that.' ), 403 );
		}
		$registered = get_registered_settings();
		foreach ( $sections[ $section ] as $name ) {
			if ( ! isset( $registered[ $name ] ) || ! array_key_exists( 'default', $registered[ $name ] ) ) {
				continue;
			}
			$default = $registered[ $name ]['default'];
			$now     = get_option( $name, $default );
			if ( is_bool( $default ) ? (bool) $now !== $default : (string) $now !== (string) $default ) {
				update_option( $name, $default );
				sourceweb_src_log( 'settings', $name . ': default restored' );
			}
		}
		add_settings_error( 'aw_src_reset', 'aw_src_reset', 'Defaults restored.', 'success' );
		set_transient( 'settings_errors', get_settings_errors(), 30 ); // as options.php does, for settings_errors() on the screen
		wp_safe_redirect( add_query_arg( 'settings-updated', 'true', admin_url( sourceweb_src_tab_path( SOURCEWEB_SRC_SETTINGS_TAB ) ) ) . '#backfill' );
		exit;
	}
);

// Checkboxes and radios on this plugin's classic admin screens: a label that wraps one is at least 24 x 24 px to hit
// (WCAG 2.5.8). The input keeps WordPress's look, and a core list table's own check column is left as it is.
add_action(
	'admin_enqueue_scripts',
	function () {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- which screen is open; nothing is saved here.
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
		if ( 0 !== strpos( $page, 'aw-sourcing' ) && ! in_array( $page, array( 'aw-review', 'aw-enrich-review' ), true ) ) {
			return;
		}
		wp_register_style( 'sourceweb-hit-area', false, array(), '1' );
		wp_enqueue_style( 'sourceweb-hit-area' );
		wp_add_inline_style( 'sourceweb-hit-area', '.wrap label:has(> input[type=checkbox]):not(.screen-reader-text),.wrap label:has(> input[type=radio]):not(.screen-reader-text){display:inline-flex;align-items:center;gap:6px;min-height:24px;min-width:24px;padding-block:4px;box-sizing:border-box}.wrap .wp-list-table label:has(> input[type=checkbox]),.wrap .wp-list-table label:has(> input[type=radio]){display:revert;min-height:0;min-width:0;padding-block:0;gap:0}' );
	}
);
