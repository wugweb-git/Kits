<?php
/**
 * Standalone compatibility layer for PlanWeb when Kits Core is inactive.
 * Provides fallback implementations for REST permissions.
 *
 * @package planweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'planweb_rest_can' ) ) {
	/**
	 * Fallback REST permission callback for PlanWeb routes.
	 *
	 * @param string $cap Capability.
	 * @return callable
	 */
	function planweb_rest_can( string $cap ): callable {
		if ( function_exists( 'kits_shell_rest_can' ) ) {
			return kits_shell_rest_can( $cap );
		}
		return function ( $request = null ) use ( $cap ) {
			if ( ! is_user_logged_in() ) {
				return new WP_Error( 'rest_not_logged_in', __( 'Sign in to use this.', 'planweb' ), array( 'status' => 401 ) );
			}
			$app = function_exists( 'rest_get_authenticated_app_password' ) && null !== rest_get_authenticated_app_password();
			if ( ! $app ) {
				$nonce = '';
				if ( $request instanceof WP_REST_Request ) {
					$nonce = (string) ( $request->get_header( 'X-WP-Nonce' ) ?? $request->get_param( '_wpnonce' ) ?? '' );
				} elseif ( is_object( $request ) && isset( $request->headers ) && is_array( $request->headers ) ) {
					$nonce = (string) ( $request->headers['X-WP-Nonce'] ?? '' );
				}
				if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
					return new WP_Error( 'rest_cookie_invalid_nonce', __( 'The page has expired. Reload it and try again.', 'planweb' ), array( 'status' => 403 ) );
				}
			}
			if ( ! current_user_can( $cap ) ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not allowed to do this.', 'planweb' ), array( 'status' => 403 ) );
			}
			return true;
		};
	}
}

/**
 * The screens PlanWeb draws itself when the Kits shell is not there (no Kits Core, or no build): Dashboard and Entries
 * show what is coming up and the add form; Settings holds the calendar feed key and the scheduled jobs. Core markup only.
 *
 * @param string $screen 'dashboard', 'entries' or 'settings'.
 */
function planweb_standalone_screen( string $screen ) {
	$labels = array(
		'dashboard' => __( 'Dashboard', 'planweb' ),
		'entries'   => __( 'Entries', 'planweb' ),
		'settings'  => __( 'Settings', 'planweb' ),
	);
	echo '<div class="wrap planweb"><h1 class="wp-heading-inline">' . esc_html__( 'PlanWeb', 'planweb' ) . '</h1><hr class="wp-header-end">';
	echo '<nav class="nav-tab-wrapper" aria-label="' . esc_attr__( 'PlanWeb', 'planweb' ) . '">';
	foreach ( $labels as $slug => $label ) {
		if ( current_user_can( planweb_ui_cap( $slug ) ) ) {
			echo '<a class="nav-tab' . ( $slug === $screen ? ' nav-tab-active' : '' ) . '"' . ( $slug === $screen ? ' aria-current="page"' : '' ) . ' href="' . esc_url( planweb_ui_url( $slug ) ) . '">' . esc_html( $label ) . '</a>';
		}
	}
	echo '<a class="nav-tab" href="' . esc_url( planweb_url( array( 'm' => wp_date( 'Y-m' ) ) ) ) . '">' . esc_html__( 'Calendar', 'planweb' ) . '</a></nav>';

	if ( 'settings' === $screen ) {
		planweb_standalone_settings();
		echo '</div>';
		return;
	}

	echo '<p class="description">' . esc_html__( 'Nothing on this calendar is posted to any social network: it is the team\'s plan.', 'planweb' ) . '</p>';
	$today = wp_date( 'Y-m-d' );
	if ( 'entries' === $screen ) {
		$from  = wp_date( 'Y-m-d', time() - 30 * DAY_IN_SECONDS );
		$to    = wp_date( 'Y-m-d', time() + 365 * DAY_IN_SECONDS );
		$title = __( 'Entries (the last 30 days and the next year)', 'planweb' );
	} else {
		$from  = $today;
		$to    = wp_date( 'Y-m-d', time() + 60 * DAY_IN_SECONDS );
		$title = __( 'Coming up (next 60 days)', 'planweb' );
	}
	$entries = planweb_entries( $from, $to );
	echo '<h2>' . esc_html( $title ) . '</h2>';
	if ( ! $entries ) {
		echo '<p>' . esc_html__( 'Nothing here yet. Add an entry below.', 'planweb' ) . '</p>';
	} else {
		echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Date', 'planweb' ) . '</th><th scope="col">' . esc_html__( 'Entry', 'planweb' ) . '</th><th scope="col">' . esc_html__( 'Type', 'planweb' ) . '</th><th scope="col">' . esc_html__( 'Status', 'planweb' ) . '</th></tr></thead><tbody>';
		foreach ( $entries as $e ) {
			$href = planweb_url(
				array(
					'm'    => substr( $e['date'], 0, 7 ),
					'edit' => $e['id'],
				)
			) . '#planweb-form';
			echo '<tr><td>' . esc_html( planweb_date_label( $e['date'] ) . ( '' !== $e['time'] ? ' ' . $e['time'] : '' ) ) . '<br><span class="description">' . esc_html( planweb_when( $e['date'] ) ) . '</span></td>'
				. '<td><a href="' . esc_url( $href ) . '">' . esc_html( $e['title'] ) . '</a></td>'
				. '<td>' . planweb_type_badge( $e['type'] ) . '</td><td>' . planweb_status_badge( $e['status'] ) . '</td></tr>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- the badges escape their parts.
		}
		echo '</tbody></table>';
	}
	echo '<p><a href="' . esc_url( planweb_url( array( 'm' => wp_date( 'Y-m' ) ) ) ) . '">' . esc_html__( 'Open the month calendar', 'planweb' ) . '</a></p>';
	planweb_form( null, wp_date( 'Y-m' ) ); // Nonce, capability check and escaping are in the form and its admin-post handler.
	echo '</div>';
}

/** Settings without the shell: the calendar feed key (administrators) and the scheduled jobs. */
function planweb_standalone_settings() {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- messages only; the changes are nonce-checked admin-post.
	$done  = isset( $_GET['done'] ) ? sanitize_key( wp_unslash( $_GET['done'] ) ) : '';
	$error = isset( $_GET['error'] ) ? sanitize_text_field( wp_unslash( $_GET['error'] ) ) : '';
	// phpcs:enable
	$messages = array(
		'jobs'     => __( 'Scheduled jobs saved.', 'planweb' ),
		'feed-new' => __( 'New key made. The old feed address no longer works: subscribe again with the new one.', 'planweb' ),
		'feed-off' => __( 'The calendar feed is off. Calendars subscribed to it stop updating.', 'planweb' ),
	);
	if ( isset( $messages[ $done ] ) ) {
		wp_admin_notice( esc_html( $messages[ $done ] ), array( 'type' => 'success' ) );
	}
	if ( '' !== $error ) {
		wp_admin_notice( esc_html( $error ), array( 'type' => 'error' ) );
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	echo '<h2 id="planweb-feed">' . esc_html__( 'Calendar feed', 'planweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'A read-only feed for Google Calendar, Apple Calendar or Outlook, with date, time, title, type, channels, status and link, never the note. Anyone with the address can read it, so keep it private. Nothing comes back from the calendar app and nothing is posted.', 'planweb' ) . '</p>';
	$payload = planweb_feed_payload();
	if ( $payload['on'] ) {
		echo '<table class="widefat striped" role="presentation"><tbody>';
		foreach ( $payload['urls'] as $u ) {
			$id = 'planweb-feed-' . sanitize_key( substr( md5( $u['url'] ), 0, 8 ) );
			echo '<tr><th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $u['label'] ) . '</label></th><td><input type="text" readonly class="large-text code" id="' . esc_attr( $id ) . '" value="' . esc_attr( $u['url'] ) . '"></td></tr>';
		}
		echo '</tbody></table>';
	} else {
		echo '<p>' . esc_html__( 'The feed is off: there is no key.', 'planweb' ) . '</p>';
	}
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="planweb_feed_key">';
	wp_nonce_field( 'planweb_feed_key' );
	echo '<p><button class="button" name="feed" value="new">' . esc_html( $payload['on'] ? __( 'Make a new key', 'planweb' ) : __( 'Turn the feed on', 'planweb' ) ) . '</button>';
	if ( $payload['on'] ) {
		echo ' <button class="button" name="feed" value="off">' . esc_html__( 'Turn the feed off', 'planweb' ) . '</button>';
	}
	echo '</p></form>';
	planweb_jobs_panel( false, 'settings' );
}

add_action(
	'admin_post_planweb_feed_key',
	function () {
		if ( ! check_admin_referer( 'planweb_feed_key' ) || ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'planweb' ), 403 );
		}
		if ( isset( $_POST['feed'] ) && 'off' === sanitize_key( wp_unslash( $_POST['feed'] ) ) ) {
			delete_option( PLANWEB_FEED_KEY );
			$done = 'feed-off';
		} else {
			planweb_feed_new_key();
			$done = 'feed-new';
		}
		wp_safe_redirect( add_query_arg( 'done', $done, planweb_ui_url( 'settings' ) ) . '#planweb-feed' );
		exit;
	}
);
