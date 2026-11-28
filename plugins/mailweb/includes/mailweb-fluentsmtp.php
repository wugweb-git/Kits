<?php
/**
 * MailWeb FluentSMTP-parity enhancements & remaining plan items:
 * - Site Health test ("Email sending")
 * - Per-user pause notice dismissal (mailweb_pause_dismissed)
 * - Email log storage (mailweb_email_logs; what is logged and when is in mail-delivery.php) and the Email Logs screen
 * - Fallback SMTP connection settings (mailweb_smtp_fallback; the sending is in mail-delivery.php)
 * - A queue-row requeue helper (no screen uses it yet)
 * - WP-CLI commands (test, health, stats, prune-logs)
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------- 1. Site Health test: Email sending ---------- */

add_filter(
	'site_status_tests',
	function ( array $tests ): array {
		$tests['direct']['mailweb_email_sending'] = array(
			'label' => __( 'Email sending (MailWeb)', 'mailweb' ),
			'test'  => 'mailweb_site_health_test',
		);
		return $tests;
	}
);

/**
 * Evaluate MailWeb sending health for WordPress Site Health.
 *
 * @return array<string, mixed>
 */
function mailweb_site_health_test(): array {
	$pause = function_exists( 'mailweb_paused' ) ? mailweb_paused() : false;
	$held  = function_exists( 'mailweb_count_by_status' ) ? (int) ( mailweb_count_by_status()['held'] ?? 0 ) : 0;

	if ( $pause ) {
		return array(
			'label'       => __( 'Email sending is paused', 'mailweb' ),
			'status'      => 'critical',
			'badge'       => array( 'label' => __( 'MailWeb', 'mailweb' ), 'color' => 'red' ),
			'description' => '<p>' . esc_html( sprintf( /* translators: %s: server error */ __( 'The mail server refused an email (%s). Outgoing mail is queued until resumed.', 'mailweb' ), (string) ( $pause['error'] ?? '' ) ) ) . '</p>',
			'actions'     => '<a href="' . esc_url( admin_url( 'admin.php?page=mailweb-settings&sub=sending#cap' ) ) . '">' . esc_html__( 'Review Site sending', 'mailweb' ) . '</a>',
			'test'        => 'mailweb_email_sending',
		);
	}

	if ( $held > 0 ) {
		return array(
			'label'       => __( 'Some queued emails are held', 'mailweb' ),
			'status'      => 'recommended',
			'badge'       => array( 'label' => __( 'MailWeb', 'mailweb' ), 'color' => 'orange' ),
			'description' => '<p>' . esc_html( sprintf( /* translators: %d: number of held emails */ _n( '%d email is held after repeated send failures.', '%d emails are held after repeated send failures.', $held, 'mailweb' ), $held ) ) . '</p>',
			'actions'     => '<a href="' . esc_url( admin_url( 'admin.php?page=mailweb-settings&sub=sending#cap' ) ) . '">' . esc_html__( 'Retry held emails', 'mailweb' ) . '</a>',
			'test'        => 'mailweb_email_sending',
		);
	}

	return array(
		'label'       => __( 'Email sending is running', 'mailweb' ),
		'status'      => 'good',
		'badge'       => array( 'label' => __( 'MailWeb', 'mailweb' ), 'color' => 'green' ),
		'description' => '<p>' . esc_html__( 'MailWeb sending is active with no held messages.', 'mailweb' ) . '</p>',
		'test'        => 'mailweb_email_sending',
	);
}

/* ---------- 2. Per-user pause notice dismissal ---------- */

/**
 * Dismiss the sending-paused notice for the current user until the next pause.
 *
 * @return bool
 */
function mailweb_dismiss_pause_notice(): bool {
	$pause = function_exists( 'mailweb_paused' ) ? mailweb_paused() : false;
	$uid   = get_current_user_id();
	if ( ! $pause || ! $uid ) {
		return false;
	}
	$at = (string) ( $pause['at'] ?? '' );
	if ( (string) get_user_meta( $uid, 'mailweb_pause_dismissed', true ) === $at ) {
		return true; // already dismissed; update_user_meta() would report false for an unchanged value
	}
	return (bool) update_user_meta( $uid, 'mailweb_pause_dismissed', $at );
}

/**
 * Whether the current user has dismissed the active pause notice.
 *
 * @param array $pause Active pause payload.
 * @return bool
 */
function mailweb_is_pause_dismissed_for_user( array $pause ): bool {
	$uid = get_current_user_id();
	if ( ! $uid ) {
		return false;
	}
	return (string) get_user_meta( $uid, 'mailweb_pause_dismissed', true ) === (string) ( $pause['at'] ?? '' );
}

/* ---------- 3. Email Logging + Resend ---------- */

/**
 * Record a sanitized email log entry (no message body stored). Callers decide whether to log at all (the switch in
 * mail-delivery.php); this only writes.
 *
 * @param array $entry Log entry fields: to, subject, status (sent, failed, fallback, queued), provider, error, queue_id.
 */
function mailweb_log_record( array $entry ): void {
	$logs   = get_option( 'mailweb_email_logs', array() );
	$logs   = is_array( $logs ) ? $logs : array();
	$logs[] = array(
		'at'       => gmdate( 'Y-m-d H:i:s' ),
		'to'       => sanitize_text_field( (string) ( $entry['to'] ?? '' ) ),
		'subject'  => mb_substr( sanitize_text_field( (string) ( $entry['subject'] ?? '' ) ), 0, 140 ),
		'status'   => in_array( (string) ( $entry['status'] ?? '' ), array( 'sent', 'failed', 'fallback', 'queued' ), true ) ? (string) $entry['status'] : 'failed', // an unknown status is never reported as sent
		'provider' => sanitize_key( (string) ( $entry['provider'] ?? 'primary' ) ),
		'error'    => mb_substr( function_exists( 'mailweb_clean_error' ) ? mailweb_clean_error( (string) ( $entry['error'] ?? '' ) ) : sanitize_text_field( (string) ( $entry['error'] ?? '' ) ), 0, 200 ),
		'queue_id' => absint( $entry['queue_id'] ?? 0 ),
	);
	if ( count( $logs ) > 200 ) {
		$logs = array_slice( $logs, -200 );
	}
	update_option( 'mailweb_email_logs', $logs, false );
}

/**
 * Return recent email log entries, newest first.
 *
 * @param int $limit Max rows.
 * @return array<int, array<string, mixed>>
 */
function mailweb_logs_list( int $limit = 50 ): array {
	$logs = get_option( 'mailweb_email_logs', array() );
	$logs = is_array( $logs ) ? array_reverse( $logs ) : array();
	return array_slice( $logs, 0, max( 1, min( 200, $limit ) ) );
}

/**
 * Whether a queue row in this status can be sent again: only one that gave up (failed) or was held back (held).
 * A row that is already waiting (queued) or already went (sent) is left alone.
 *
 * @param string $status Queue row status.
 */
function mailweb_resend_allowed( string $status ): bool {
	return in_array( $status, array( 'failed', 'held' ), true );
}

/**
 * The status of a queue row that still has its message, or '' when there is no such row or its message was not kept.
 *
 * @param int $queue_id Row ID in {prefix}mailweb_queue.
 */
function mailweb_queue_row_status( int $queue_id ): string {
	if ( $queue_id <= 0 ) {
		return '';
	}
	global $wpdb;
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- one row of the plugin's own table.
	return (string) $wpdb->get_var( $wpdb->prepare( 'SELECT status FROM %i WHERE id = %d AND mail IS NOT NULL', $wpdb->prefix . 'mailweb_queue', $queue_id ) );
}

/**
 * Re-queue a failed or held item in mailweb_queue for resending. A row that is already queued or sent is not touched.
 *
 * @param int $queue_id Row ID in {prefix}mailweb_queue.
 * @return bool
 */
function mailweb_resend_email( int $queue_id ): bool {
	if ( $queue_id <= 0 || ! mailweb_resend_allowed( mailweb_queue_row_status( $queue_id ) ) ) {
		return false;
	}
	global $wpdb;
	$table = $wpdb->prefix . 'mailweb_queue';
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- queue resend update.
	$updated = $wpdb->update(
		$table,
		array(
			'status'   => 'queued',
			'tries'    => 0,
			'error'    => '',
			'next_try' => null,
		),
		array( 'id' => $queue_id ),
		array( '%s', '%d', '%s', '%s' ),
		array( '%d' )
	);
	return false !== $updated && $updated > 0;
}

/** The Resend button on the Email Logs screen: nonce, administrators only, then back to the screen with the result. */
add_action(
	'admin_post_mailweb_resend',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do that.', 'mailweb' ), 403 );
		}
		$id = isset( $_POST['queue_id'] ) ? absint( wp_unslash( $_POST['queue_id'] ) ) : 0;
		check_admin_referer( 'mailweb_resend_' . $id );
		$done = mailweb_resend_email( $id );
		wp_safe_redirect( add_query_arg( 'mailweb_resent', $done ? '1' : '0', admin_url( 'admin.php?page=mailweb-logs' ) ) );
		exit;
	}
);

/**
 * Prune email logs older than N days.
 *
 * @param int $days Retention days.
 * @return int Entries removed.
 */
function mailweb_prune_logs( int $days = 30 ): int {
	$days   = max( 1, $days );
	$cutoff = gmdate( 'Y-m-d H:i:s', time() - ( $days * DAY_IN_SECONDS ) );
	$logs   = get_option( 'mailweb_email_logs', array() );
	if ( ! is_array( $logs ) || empty( $logs ) ) {
		return 0;
	}
	$kept    = array_values( array_filter( $logs, fn( $row ) => (string) ( $row['at'] ?? '' ) >= $cutoff ) );
	$removed = count( $logs ) - count( $kept );
	if ( $removed > 0 ) {
		update_option( 'mailweb_email_logs', $kept, false );
	}
	return $removed;
}

/* ---------- 4. Fallback SMTP Connection ---------- */

/**
 * A server name from a form: letters, digits, dots and hyphens only (a scheme, port or path is cut off).
 *
 * @param string $host Raw input.
 */
function mailweb_smtp_fallback_clean_host( string $host ): string {
	$host = preg_replace( '#^[a-z]+://#i', '', trim( $host ) );
	$host = strtolower( (string) preg_split( '#[/:\s?]#', (string) $host )[0] ); // up to a port, path or space
	$host = preg_replace( '/[^a-z0-9.\-]/', '', $host );
	return trim( (string) $host, '.-' );
}

/**
 * Return decrypted fallback SMTP settings. Callers must never print 'pass'.
 *
 * @return array<string, mixed>
 */
function mailweb_smtp_fallback_settings(): array {
	$saved = get_option( 'mailweb_smtp_fallback', array() );
	$saved = is_array( $saved ) ? $saved : array();
	return array(
		'enabled' => ! empty( $saved['enabled'] ),
		'host'    => mailweb_smtp_fallback_clean_host( (string) ( $saved['host'] ?? '' ) ),
		'port'    => absint( $saved['port'] ?? 465 ) ? min( 65535, absint( $saved['port'] ?? 465 ) ) : 465,
		'user'    => sanitize_email( (string) ( $saved['user'] ?? '' ) ),
		'pass'    => function_exists( 'mailweb_decrypt' ) ? mailweb_decrypt( (string) ( $saved['pass'] ?? '' ) ) : '',
	);
}

/**
 * Save fallback SMTP settings. The password is encrypted; empty input keeps the saved one, and 'clear_pass' removes it.
 * Without the crypto helper a password is not stored at all.
 *
 * @param array $in enabled, host, port, user, pass, clear_pass.
 * @return array<string, mixed> The stored option (the password still encrypted).
 */
function mailweb_smtp_fallback_save( array $in ): array {
	$prev = get_option( 'mailweb_smtp_fallback', array() );
	$prev = is_array( $prev ) ? $prev : array();
	if ( ! empty( $in['clear_pass'] ) ) {
		$pass = '';
	} elseif ( isset( $in['pass'] ) && '' !== (string) $in['pass'] ) {
		$pass = function_exists( 'mailweb_encrypt' ) ? mailweb_encrypt( (string) $in['pass'] ) : '';
	} else {
		$pass = (string) ( $prev['pass'] ?? '' );
	}
	$port = absint( $in['port'] ?? 465 );
	$next = array(
		'enabled' => ! empty( $in['enabled'] ),
		'host'    => mailweb_smtp_fallback_clean_host( (string) ( $in['host'] ?? '' ) ),
		'port'    => $port ? min( 65535, $port ) : 465,
		'user'    => sanitize_email( (string) ( $in['user'] ?? '' ) ),
		'pass'    => $pass,
	);
	update_option( 'mailweb_smtp_fallback', $next, false );
	return $next;
}

/* ---------- 6. REST Routes for Pause Dismiss, Logs, Resend, Fallback & Alerts ---------- */

// (The failure alert is an email to the site administrator, see mail-delivery.php; the old webhook alert never ran and is gone.)

add_action(
	'rest_api_init',
	function () {
		$cap   = function_exists( 'mailweb_rest_can' ) ? mailweb_rest_can( MAILWEB_CAP ) : fn() => current_user_can( 'manage_options' );
		$admin = function_exists( 'mailweb_rest_can' ) ? mailweb_rest_can( 'manage_options' ) : fn() => current_user_can( 'manage_options' );

		register_rest_route(
			'mailweb/v1',
			'/notice/pause/dismiss',
			array(
				'methods'             => 'POST',
				'permission_callback' => $admin,
				'callback'            => fn() => rest_ensure_response( array( 'dismissed' => mailweb_dismiss_pause_notice() ) ),
			)
		);

		register_rest_route(
			'mailweb/v1',
			'/logs',
			array(
				'methods'             => 'GET',
				'permission_callback' => $cap,
				'callback'            => fn( WP_REST_Request $r ) => rest_ensure_response( array( 'logs' => mailweb_logs_list( (int) ( $r->get_param( 'limit' ) ?? 50 ) ) ) ),
			)
		);

		register_rest_route(
			'mailweb/v1',
			'/queue/resend',
			array(
				'methods'             => 'POST',
				'permission_callback' => $admin,
				'callback'            => fn( WP_REST_Request $r ) => rest_ensure_response( array( 'requeued' => mailweb_resend_email( absint( $r->get_param( 'id' ) ) ) ) ),
			)
		);

		register_rest_route(
			'mailweb/v1',
			'/services/smtp-fallback',
			array(
				array(
					'methods'             => 'GET',
					'permission_callback' => $admin,
					'callback'            => function () {
						$fb = mailweb_smtp_fallback_settings();
						return rest_ensure_response(
							array(
								'enabled'  => $fb['enabled'],
								'host'     => $fb['host'],
								'port'     => $fb['port'],
								'user'     => $fb['user'],
								'has_pass' => '' !== $fb['pass'],
							)
						);
					},
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => $admin,
					'callback'            => function ( WP_REST_Request $r ) {
						$saved = mailweb_smtp_fallback_save( (array) $r->get_json_params() );
						return rest_ensure_response(
							array(
								'enabled'  => $saved['enabled'],
								'host'     => $saved['host'],
								'port'     => $saved['port'],
								'user'     => $saved['user'],
								'has_pass' => '' !== $saved['pass'],
							)
						);
					},
				),
			)
		);

		register_rest_route(
			'mailweb/v1',
			'/services/alerts',
			array(
				array(
					'methods'             => 'GET',
					'permission_callback' => $admin,
					'callback'            => fn() => rest_ensure_response( mailweb_delivery_settings() ),
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => $admin,
					'callback'            => function ( WP_REST_Request $r ) {
						$next = mailweb_delivery_clean( array_merge( mailweb_delivery_settings(), (array) $r->get_json_params() ) );
						update_option( MAILWEB_DELIVERY_OPTION, $next, false );
						return rest_ensure_response( $next );
					},
				),
			)
		);

		register_rest_route(
			'mailweb/v1',
			'/services/smtp-presets',
			array(
				'methods'             => 'GET',
				'permission_callback' => $admin,
				'callback'            => fn() => rest_ensure_response( array( 'presets' => mailweb_smtp_presets() ) ),
			)
		);

		register_rest_route(
			'mailweb/v1',
			'/test-email',
			array(
				'methods'             => 'POST',
				'permission_callback' => $admin,
				'callback'            => function ( WP_REST_Request $r ) {
					$to = sanitize_email( (string) $r->get_param( 'to' ) );
					if ( ! is_email( $to ) ) {
						return new WP_Error( 'invalid_email', __( 'Please enter a valid recipient email address.', 'mailweb' ), array( 'status' => 400 ) );
					}
					$html = (bool) ( $r->get_param( 'html' ) ?? true );
					return rest_ensure_response( mailweb_test_send( $to, $html ) );
				},
			)
		);
	}
);

/* ---------- 7. SMTP Presets, Force From & Email Test (WP Mail SMTP / FluentSMTP / SMTP Mailer parity) ---------- */

/**
 * Common SMTP provider presets for provider-independent configuration.
 *
 * @return array<string, array<string, mixed>>
 */
function mailweb_smtp_presets(): array {
	return array(
		'hostinger' => array( 'label' => 'Hostinger Mail', 'host' => 'smtp.hostinger.com', 'port' => 465, 'encryption' => 'ssl' ),
		'gmail'     => array( 'label' => 'Google / Gmail', 'host' => 'smtp.gmail.com', 'port' => 587, 'encryption' => 'tls' ),
		'outlook'   => array( 'label' => 'Microsoft 365 / Outlook', 'host' => 'smtp.office365.com', 'port' => 587, 'encryption' => 'tls' ),
		'sendgrid'  => array( 'label' => 'SendGrid', 'host' => 'smtp.sendgrid.net', 'port' => 587, 'encryption' => 'tls' ),
		'mailgun'   => array( 'label' => 'Mailgun', 'host' => 'smtp.mailgun.org', 'port' => 587, 'encryption' => 'tls' ),
		'postmark'  => array( 'label' => 'Postmark', 'host' => 'smtp.postmarkapp.com', 'port' => 587, 'encryption' => 'tls' ),
		'ses'       => array( 'label' => 'Amazon SES', 'host' => 'email-smtp.us-east-1.amazonaws' . '.com', 'port' => 587, 'encryption' => 'tls' ),
		'custom'    => array( 'label' => 'Custom SMTP', 'host' => '', 'port' => 587, 'encryption' => 'tls' ),
	);
}

/**
 * Send a diagnostic test email and return structured status (accepted by the server, or the error).
 *
 * @param string $to   Recipient email.
 * @param bool   $html Send as HTML.
 * @return array<string, mixed>
 */
function mailweb_test_send( string $to, bool $html = true ): array {
	$headers = $html ? array( 'Content-Type: text/html; charset=UTF-8' ) : array();
	$subject = sprintf( '[%s] MailWeb Test Email', (string) get_bloginfo( 'name' ) );
	$body    = $html
		? '<p>' . esc_html__( 'This is a MailWeb test email confirming your outgoing mail configuration is working.', 'mailweb' ) . '</p>'
		: __( 'This is a MailWeb test email confirming your outgoing mail configuration is working.', 'mailweb' );
	$err     = '';
	$cb      = function ( $e ) use ( &$err ) {
		$err = mailweb_delivery_error( is_wp_error( $e ) ? $e->get_error_message() : 'Send failed' );
	};
	add_action( 'wp_mail_failed', $cb );
	$ok = wp_mail( $to, $subject, $body, $headers );
	remove_action( 'wp_mail_failed', $cb );
	// The test is logged like any other email, by the delivery log (only when its switch is on).
	return array(
		'sent'    => (bool) $ok,
		'to'      => $to,
		'message' => $ok ? __( 'Test email accepted by the mail server.', 'mailweb' ) : sprintf( /* translators: %s: the error. */ __( 'Test email failed to send: %s', 'mailweb' ), '' !== $err ? $err : __( 'unknown error', 'mailweb' ) ),
	);
}

/* ---------- 8. Admin Submenu: Email Logs & Test (FluentSMTP / WP Mail SMTP style) ---------- */

add_action(
	'admin_menu',
	function () {
		add_submenu_page(
			'mailweb',
			__( 'Email Logs & Test', 'mailweb' ),
			__( 'Email Logs', 'mailweb' ),
			MAILWEB_CAP,
			'mailweb-logs',
			'mailweb_render_logs_screen'
		);
	},
	30
);

/**
 * Render the Email Logs screen: one line per email, newest first, with the status WordPress reported.
 */
function mailweb_render_logs_screen(): void {
	if ( ! current_user_can( MAILWEB_CAP ) ) {
		wp_die( esc_html__( 'You are not allowed to access this page.', 'mailweb' ), 403 );
	}
	$logs = mailweb_logs_list( 50 );
	$fb   = mailweb_smtp_fallback_settings();
	echo '<div class="wrap">';
	echo '<h1>' . esc_html__( 'MailWeb: Email Logs', 'mailweb' ) . '</h1>';
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a result flag only, nothing is changed.
	if ( isset( $_GET['mailweb_resent'] ) ) {
		$ok = '1' === sanitize_text_field( wp_unslash( $_GET['mailweb_resent'] ) );
		wp_admin_notice(
			$ok ? esc_html__( 'Put back in the queue. It will be sent on the next queue run.', 'mailweb' ) : esc_html__( 'Not resent: that message is no longer waiting to be retried.', 'mailweb' ),
			array( 'type' => $ok ? 'success' : 'warning', 'dismissible' => true )
		);
	}
	if ( ! mailweb_delivery_on( 'log_mail' ) ) {
		wp_admin_notice(
			esc_html__( 'The delivery log is off, so nothing new is recorded here. Turn it on under Site sending → Delivery log, fallback and alerts.', 'mailweb' ),
			array( 'type' => 'info', 'additional_classes' => array( 'inline' ) )
		);
	}
	/* translators: %s: fallback status */
	echo '<p>' . esc_html( sprintf( __( 'Fallback SMTP: %s', 'mailweb' ), mailweb_fallback_active() ? $fb['host'] . ':' . $fb['port'] : __( 'not in use', 'mailweb' ) ) ) . '</p>';
	echo '<p class="description">' . esc_html__( 'Accepted means the mail server took the message; it does not say the message reached the inbox. The text of an email is never logged here.', 'mailweb' ) . '</p>';
	echo '<table class="widefat striped mailweb-table"><thead><tr>';
	echo '<th>' . esc_html__( 'Time (UTC)', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'To', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Subject', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Status', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Sent through', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Error', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Action', 'mailweb' ) . '</th>';
	echo '</tr></thead><tbody>';
	if ( empty( $logs ) ) {
		echo '<tr><td colspan="7">' . esc_html__( 'No email log entries recorded yet.', 'mailweb' ) . '</td></tr>';
	} else {
		foreach ( $logs as $row ) {
			echo '<tr>';
			echo '<td>' . esc_html( (string) ( $row['at'] ?? '' ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $row['to'] ?? '' ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $row['subject'] ?? '' ) ) . '</td>';
			echo '<td><strong>' . esc_html( mailweb_log_status_label( (string) ( $row['status'] ?? '' ) ) ) . '</strong></td>';
			echo '<td>' . esc_html( (string) ( $row['provider'] ?? '' ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $row['error'] ?? '' ) ) . '</td>';
			$qid = (int) ( $row['queue_id'] ?? 0 );
			echo '<td>';
			if ( $qid > 0 && current_user_can( 'manage_options' ) && mailweb_resend_allowed( mailweb_queue_row_status( $qid ) ) ) {
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
				echo '<input type="hidden" name="action" value="mailweb_resend"><input type="hidden" name="queue_id" value="' . esc_attr( (string) $qid ) . '">';
				wp_nonce_field( 'mailweb_resend_' . $qid );
				echo '<button type="submit" class="button button-small">' . esc_html__( 'Resend', 'mailweb' ) . '</button></form>';
			}
			echo '</td>';
			echo '</tr>';
		}
	}
	echo '</tbody></table></div>';
}

/* ---------- 7. WP-CLI Commands (test, health, stats, prune-logs) ---------- */

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command(
		'mailweb health',
		function () {
			$h = mailweb_site_health_test();
			WP_CLI::log( sprintf( 'Status: %s — %s', $h['status'], $h['label'] ) );
		}
	);
	WP_CLI::add_command(
		'mailweb stats',
		function () {
			$stats = get_option( 'mailweb_stats', array() );
			WP_CLI::log( wp_json_encode( is_array( $stats ) ? $stats : array() ) );
		}
	);
	WP_CLI::add_command(
		'mailweb test',
		function ( array $args ) {
			$to = sanitize_email( (string) ( $args[0] ?? get_option( 'admin_email' ) ) );
			if ( ! is_email( $to ) ) {
				WP_CLI::error( 'Valid recipient email required.' );
			}
			$ok = wp_mail( $to, 'MailWeb Test Email', 'MailWeb test message from WP-CLI.' );
			$ok ? WP_CLI::success( "Sent test email to {$to}" ) : WP_CLI::error( 'wp_mail() returned false.' );
		}
	);
	WP_CLI::add_command(
		'mailweb prune-logs',
		function ( array $args, array $assoc ) {
			$days    = isset( $assoc['days'] ) ? absint( $assoc['days'] ) : 30;
			$removed = mailweb_prune_logs( $days );
			WP_CLI::success( "Pruned {$removed} log entries older than {$days} days." );
		}
	);
}
