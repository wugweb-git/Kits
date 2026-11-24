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
const SOURCEWEB_UI_TABS = array( 'sources', 'keywords', 'rules', 'ai', 'workers', 'rejected', 'relay-log', 'log', 'settings' );

/**
 * Which screen this request asks for: 'dashboard', 'review', 'enrichment', a tab of SOURCEWEB_UI_TABS or ''. An
 * unknown tab of the Sourcing page is Sources, its first screen.
 */
function sourceweb_ui_wanted(): string {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- which screen to show; nothing is saved here
	$page = sanitize_key( wp_unslash( $_GET['page'] ?? '' ) );
	$tab  = sanitize_key( wp_unslash( $_GET['tab'] ?? '' ) );
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	if ( AW_SRC_PAGE === $page ) {
		return in_array( $tab, SOURCEWEB_UI_TABS, true ) ? $tab : 'sources';
	}
	return array(
		AW_SRC_MENU        => 'dashboard',
		'aw-review'        => 'review',
		'aw-enrich-review' => 'enrichment',
	)[ $page ] ?? '';
}

/** The capability each screen needs. */
function sourceweb_ui_caps(): array {
	return array(
		'dashboard'  => AW_REVIEW_CAP,
		'review'     => AW_REVIEW_CAP,
		'enrichment' => AW_ENRICH_CAP,
		'sources'    => AW_SRC_CAP,
		'keywords'   => AW_SRC_CAP,
		'rules'      => AW_SRC_CAP,
		'ai'         => AW_SRC_CAP,
		'workers'    => AW_SRC_CAP,
		'rejected'   => AW_SRC_CAP,
		'relay-log'  => AW_SRC_CAP,
		'log'        => AW_SRC_CAP,
		'settings'   => AW_SRC_CAP,
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
		'dashboard'  => array( 'page' => AW_SRC_MENU ),
		'review'     => array( 'page' => 'aw-review' ),
		'enrichment' => array( 'page' => 'aw-enrich-review' ),
		'sources'    => array( 'page' => AW_SRC_PAGE ),
	)[ $screen ] ?? ( in_array( $screen, SOURCEWEB_UI_TABS, true ) ? array(
		'page' => AW_SRC_PAGE,
		'tab'  => $screen,
	) : array( 'page' => AW_SRC_MENU ) );
	return add_query_arg( $q, admin_url( 'admin.php' ) );
}

add_action(
	'admin_enqueue_scripts',
	function () {
		$screen = sourceweb_ui_wanted();
		if ( '' === $screen || ! function_exists( 'kits_shell_app' ) || ! current_user_can( sourceweb_ui_caps()[ $screen ] ) ) {
			return;
		}
		$main_file = defined( 'SOURCEWEB_FILE' ) ? SOURCEWEB_FILE : ( file_exists( AW_SOURCING_DIR . 'sourceweb.php' ) ? AW_SOURCING_DIR . 'sourceweb.php' : AW_SOURCING_DIR . 'aw-sourcing.php' );
		$head      = get_file_data( $main_file, array( 'Version' => 'Version' ) );
		// The header's tabs in menu order.
		$order = array(
			'dashboard'  => __( 'Dashboard', 'sourceweb' ),
			'review'     => __( 'To review', 'sourceweb' ),
			'enrichment' => __( 'Enrichment review', 'sourceweb' ),
			'sources'    => __( 'Sources', 'sourceweb' ),
			'keywords'   => __( 'Keywords', 'sourceweb' ),
			'rules'      => __( 'Rules', 'sourceweb' ),
			'ai'         => __( 'AI models', 'sourceweb' ),
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
				'asset'       => AW_SOURCING_DIR . 'build/index.asset.php',
				'object'      => 'sourcewebApp',
				'text_domain' => 'sourceweb',
				'data'        => array(
					'screen'  => $screen,
					'name'    => 'SourceWeb',
					'version' => (string) $head['Version'],
					'icon'    => plugins_url( 'assets/icon.svg', $main_file ),
					'tabs'    => $tabs,
					'rest'    => SOURCEWEB_REST,
					'isAdmin' => current_user_can( AW_SRC_CAP ),
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
		echo '<div class="notice notice-info"><p>' . esc_html__( 'SourceWeb is running in standalone mode with native WordPress admin screens. Install and activate Kits Core to unlock the unified React shell and real-time feed monitors.', 'sourceweb' ) . '</p></div>';
	} else {
		wp_admin_notice( esc_html__( 'SourceWeb needs Kits Core (active, with its build) to show this screen.', 'sourceweb' ), array( 'type' => 'error' ) );
	}

	if ( 'settings' === $screen && current_user_can( 'manage_options' ) ) {
		echo '<div class="card" style="max-width:800px; padding:20px; margin-top:20px;">';
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
	} elseif ( 'review' === $screen ) {
		$items = function_exists( 'aw_review_items' ) ? aw_review_items() : array();
		if ( empty( $items ) ) {
			echo '<div class="notice notice-info inline" style="margin:20px 0; padding:12px 16px;">';
			echo '<p><strong>' . esc_html__( 'Review queue is clear.', 'sourceweb' ) . '</strong> ' . esc_html__( 'There are currently no pending or held items waiting for editorial review.', 'sourceweb' ) . '</p>';
			echo '</div>';
		} else {
			/* translators: %d: number of items waiting for review. */
			echo '<p style="margin:16px 0;">' . sprintf( esc_html__( '%d items waiting for review.', 'sourceweb' ), count( $items ) ) . '</p>';
			echo '<table class="widefat striped" style="margin-top:10px;">';
			echo '<thead><tr>';
			echo '<th>' . esc_html__( 'Title', 'sourceweb' ) . '</th>';
			echo '<th>' . esc_html__( 'Type', 'sourceweb' ) . '</th>';
			echo '<th>' . esc_html__( 'Source', 'sourceweb' ) . '</th>';
			echo '<th>' . esc_html__( 'Date', 'sourceweb' ) . '</th>';
			echo '<th>' . esc_html__( 'Hold Reason', 'sourceweb' ) . '</th>';
			echo '<th>' . esc_html__( 'Actions', 'sourceweb' ) . '</th>';
			echo '</tr></thead><tbody>';
			foreach ( $items as $p ) {
				$url    = get_post_meta( $p->ID, 'aw_source_url', true );
				$reason = get_post_meta( $p->ID, 'aw_review', true );
				$pub_url = wp_nonce_url( admin_url( 'admin-post.php?action=aw_review_item&item_id=' . $p->ID . '&review_action=publish' ), 'aw_review_' . $p->ID );
				$rej_url = wp_nonce_url( admin_url( 'admin-post.php?action=aw_review_item&item_id=' . $p->ID . '&review_action=reject' ), 'aw_review_' . $p->ID );
				echo '<tr>';
				echo '<td><strong><a href="' . esc_url( get_edit_post_link( $p->ID ) ) . '">' . esc_html( $p->post_title ? $p->post_title : '(no title)' ) . '</a></strong></td>';
				echo '<td>' . esc_html( $p->post_type ) . '</td>';
				echo '<td>' . ( $url ? '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener">' . esc_html( function_exists( 'aw_host' ) ? aw_host( $url ) : wp_parse_url( $url, PHP_URL_HOST ) ) . '</a>' : '–' ) . '</td>';
				echo '<td>' . esc_html( substr( $p->post_date, 0, 16 ) ) . '</td>';
				echo '<td>' . esc_html( $reason ? $reason : 'Pending' ) . '</td>';
				echo '<td>';
				echo '<a href="' . esc_url( $pub_url ) . '" class="button button-small button-primary">' . esc_html__( 'Approve', 'sourceweb' ) . '</a> ';
				echo '<a href="' . esc_url( $rej_url ) . '" class="button button-small">' . esc_html__( 'Reject', 'sourceweb' ) . '</a>';
				echo '</td>';
				echo '</tr>';
			}
			echo '</tbody></table>';
		}
	} elseif ( 'rules' === $screen && current_user_can( 'manage_options' ) ) {
		$overrides = function_exists( 'aw_rules_domain_overrides' ) ? aw_rules_domain_overrides() : array();
		$excluded  = function_exists( 'aw_rules_feed_excluded_tags' ) ? aw_rules_feed_excluded_tags() : array();

		echo '<div style="display:flex; gap:24px; margin-top:20px; flex-wrap:wrap;">';

		// Column 1: Domain Trust Overrides
		echo '<div class="card" style="flex:1; min-width:320px; padding:20px;">';
		echo '<h2 style="margin-top:0;">' . esc_html__( 'Domain Trust Overrides', 'sourceweb' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Configure domain-level trust rules to auto-approve, hold for review, or discard incoming content from specific publishers.', 'sourceweb' ) . '</p>';

		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="margin-top:16px;">';
		wp_nonce_field( 'aw_rules_domain_override' );
		echo '<input type="hidden" name="action" value="aw_domain_override">';
		echo '<table class="form-table" style="margin-top:0;">';
		echo '<tr><th scope="row"><label for="override_host">' . esc_html__( 'Domain Host', 'sourceweb' ) . '</label></th>';
		echo '<td><input type="text" id="override_host" name="host" class="regular-text" placeholder="example.com" required></td></tr>';
		echo '<tr><th scope="row"><label for="override_status">' . esc_html__( 'Trust Policy', 'sourceweb' ) . '</label></th>';
		echo '<td><select id="override_status" name="status">';
		echo '<option value="allow">' . esc_html__( 'Allow (Auto-approve if checks pass)', 'sourceweb' ) . '</option>';
		echo '<option value="neutral">' . esc_html__( 'Require Review (Hold in Review Queue)', 'sourceweb' ) . '</option>';
		echo '<option value="block">' . esc_html__( 'Discard (Block and Reject)', 'sourceweb' ) . '</option>';
		echo '</select></td></tr>';
		echo '<tr><th scope="row"><label for="override_name">' . esc_html__( 'Publisher Name', 'sourceweb' ) . '</label></th>';
		echo '<td><input type="text" id="override_name" name="name" class="regular-text" placeholder="Optional label"></td></tr>';
		echo '</table>';
		submit_button( __( 'Save Domain Override', 'sourceweb' ), 'secondary', 'submit', false );
		echo '</form>';

		if ( ! empty( $overrides ) ) {
			echo '<hr style="margin:20px 0;">';
			echo '<table class="widefat striped">';
			echo '<thead><tr><th>' . esc_html__( 'Domain', 'sourceweb' ) . '</th><th>' . esc_html__( 'Policy', 'sourceweb' ) . '</th><th>' . esc_html__( 'Action', 'sourceweb' ) . '</th></tr></thead><tbody>';
			foreach ( $overrides as $h => $ov ) {
				echo '<tr>';
				echo '<td><strong>' . esc_html( $h ) . '</strong>' . ( ! empty( $ov['name'] ) && $ov['name'] !== $h ? ' (' . esc_html( $ov['name'] ) . ')' : '' ) . '</td>';
				echo '<td><span class="badge">' . esc_html( ucfirst( $ov['status'] ) ) . '</span></td>';
				echo '<td>';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="display:inline;">';
				wp_nonce_field( 'aw_rules_domain_override' );
				echo '<input type="hidden" name="action" value="aw_domain_override">';
				echo '<input type="hidden" name="aw_delete" value="1">';
				echo '<input type="hidden" name="host" value="' . esc_attr( $h ) . '">';
				echo '<button type="submit" class="button button-small button-link-delete">' . esc_html__( 'Reset', 'sourceweb' ) . '</button>';
				echo '</form>';
				echo '</td>';
				echo '</tr>';
			}
			echo '</tbody></table>';
		}
		echo '</div>';

		// Column 2: Excluded Category & Tag Filters
		echo '<div class="card" style="flex:1; min-width:320px; padding:20px;">';
		echo '<h2 style="margin-top:0;">' . esc_html__( 'Feed Category & Tag Filters', 'sourceweb' ) . '</h2>';
		echo '<p class="description">' . esc_html__( 'Specify category or topic tag slugs to exclude from feed ingestion. Matching feed stories will be automatically flagged or held.', 'sourceweb' ) . '</p>';

		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="margin-top:16px;">';
		wp_nonce_field( 'aw_rules_feed_filter' );
		echo '<input type="hidden" name="action" value="aw_feed_filter">';
		echo '<p><textarea name="excluded_tags" rows="6" class="large-text code" placeholder="politics, gossip, sports">' . esc_textarea( implode( "\n", $excluded ) ) . '</textarea></p>';
		echo '<p class="description">' . esc_html__( 'Enter tag or category slugs, one per line or separated by commas.', 'sourceweb' ) . '</p>';
		submit_button( __( 'Save Feed Filters', 'sourceweb' ), 'secondary', 'submit', false );
		echo '</form>';
		echo '</div>';

		echo '</div>';
	} else {
		$cfg = function_exists( 'sourceweb_sources_config' ) ? sourceweb_sources_config() : array();
		$num_sources = count( (array) ( $cfg['sources'] ?? array() ) );
		$num_feeds   = count( (array) ( $cfg['feeds'] ?? array() ) );
		$review_count = function_exists( 'aw_review_count' ) ? aw_review_count() : 0;

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

		if ( function_exists( 'aw_sourcing_dash_workers' ) ) {
			$workers = aw_sourcing_dash_workers();
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
		do_action( 'aw_review_intake' );
	} elseif ( 'settings' === $screen && current_user_can( 'manage_options' ) ) {
		settings_errors( 'aw_backfill_floor' );
		settings_errors( 'aw_src_reset' ); // "Defaults restored." after a reset below
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
 * The feed form (Sources &feed=<id|new>, with &type= and &host=) as Kits page parts: aw_sources_edit_form()'s output, so Add Feed and Update post to the same admin-post handler (kits_sourcing_save_feeds),
 * with its nonce, and come back to the screen the form was opened from. Empty without a feed in the address.
 *
 * @return array[]
 */
function sourceweb_feed_parts(): array {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- which feed to show; nothing is saved here
	$feed = sanitize_key( wp_unslash( $_GET['feed'] ?? '' ) );
	if ( '' === $feed || ! function_exists( 'aw_sources_edit_form' ) || ! function_exists( 'kits_shell_html_parts' ) || ! current_user_can( AW_SRC_CAP ) ) {
		return array();
	}
	ob_start();
	aw_sources_edit_form( $feed, sanitize_key( wp_unslash( $_GET['type'] ?? '' ) ), aw_sourcing_norm_host( sanitize_text_field( wp_unslash( $_GET['host'] ?? '' ) ) ) );
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
				aw_src_log( 'settings', $name . ': default restored' );
			}
		}
		add_settings_error( 'aw_src_reset', 'aw_src_reset', 'Defaults restored.', 'success' );
		set_transient( 'settings_errors', get_settings_errors(), 30 ); // as options.php does, for settings_errors() on the screen
		wp_safe_redirect( add_query_arg( 'settings-updated', 'true', admin_url( aw_src_tab_path( AW_SRC_SETTINGS_TAB ) ) ) . '#backfill' );
		exit;
	}
);
