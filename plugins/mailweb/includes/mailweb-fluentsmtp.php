<?php
/**
 * MailWeb FluentSMTP-parity enhancements & remaining plan items:
 * - Site Health test ("Email sending")
 * - Per-user pause notice dismissal (mailweb_pause_dismissed)
 * - Email logging + resend (mailweb_email_logs + mailweb_resend_email)
 * - Fallback SMTP connection (mailweb_smtp_fallback)
 * - Failure webhook alerts (Slack/Discord/Telegram/custom)
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
	return (bool) update_user_meta( $uid, 'mailweb_pause_dismissed', (string) ( $pause['at'] ?? '' ) );
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
 * Record a sanitized email log entry (no message body stored).
 *
 * @param array $entry Log entry fields: to, subject, status, provider, error, queue_id.
 */
function mailweb_log_record( array $entry ): void {
	$logs   = get_option( 'mailweb_email_logs', array() );
	$logs   = is_array( $logs ) ? $logs : array();
	$logs[] = array(
		'at'       => gmdate( 'Y-m-d H:i:s' ),
		'to'       => sanitize_text_field( (string) ( $entry['to'] ?? '' ) ),
		'subject'  => mb_substr( sanitize_text_field( (string) ( $entry['subject'] ?? '' ) ), 0, 140 ),
		'status'   => in_array( (string) ( $entry['status'] ?? '' ), array( 'sent', 'failed', 'fallback' ), true ) ? (string) $entry['status'] : 'sent',
		'provider' => sanitize_key( (string) ( $entry['provider'] ?? 'primary' ) ),
		'error'    => mb_substr( sanitize_text_field( (string) ( $entry['error'] ?? '' ) ), 0, 200 ),
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
 * Re-queue a failed or held item in mailweb_queue for resending.
 *
 * @param int $queue_id Row ID in {prefix}mailweb_queue.
 * @return bool
 */
function mailweb_resend_email( int $queue_id ): bool {
	if ( $queue_id <= 0 ) {
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
 * Return decrypted fallback SMTP settings.
 *
 * @return array<string, mixed>
 */
function mailweb_smtp_fallback_settings(): array {
	$saved = get_option( 'mailweb_smtp_fallback', array() );
	$saved = is_array( $saved ) ? $saved : array();
	return array(
		'enabled' => ! empty( $saved['enabled'] ),
		'host'    => sanitize_text_field( (string) ( $saved['host'] ?? '' ) ),
		'port'    => absint( $saved['port'] ?? 465 ) ?: 465,
		'user'    => sanitize_email( (string) ( $saved['user'] ?? '' ) ),
		'pass'    => function_exists( 'mailweb_decrypt' ) ? mailweb_decrypt( (string) ( $saved['pass'] ?? '' ) ) : '',
	);
}

/**
 * Save fallback SMTP settings (encrypting password).
 *
 * @param array $in Input fields.
 * @return array<string, mixed>
 */
function mailweb_smtp_fallback_save( array $in ): array {
	$prev = get_option( 'mailweb_smtp_fallback', array() );
	$prev = is_array( $prev ) ? $prev : array();
	$pass = isset( $in['pass'] ) && '' !== (string) $in['pass']
		? ( function_exists( 'mailweb_encrypt' ) ? mailweb_encrypt( (string) $in['pass'] ) : (string) $in['pass'] )
		: (string) ( $prev['pass'] ?? '' );

	$next = array(
		'enabled' => ! empty( $in['enabled'] ),
		'host'    => sanitize_text_field( (string) ( $in['host'] ?? '' ) ),
		'port'    => max( 1, min( 65535, absint( $in['port'] ?? 465 ) ) ),
		'user'    => sanitize_email( (string) ( $in['user'] ?? '' ) ),
		'pass'    => $pass,
	);
	update_option( 'mailweb_smtp_fallback', $next, false );
	return $next;
}

/* ---------- 5. Failure Alerts (Webhook: Slack / Discord / Telegram / Custom) ---------- */

/**
 * Send a throttled webhook alert when sending fails or pauses.
 *
 * @param string $reason  Failure reason.
 * @param array  $context Optional context.
 * @return bool
 */
function mailweb_send_failure_alert( string $reason, array $context = array() ): bool {
	$url = (string) get_option( 'mailweb_alert_webhook', '' );
	if ( '' === $url || ! wp_http_validate_url( $url ) ) {
		return false;
	}
	if ( get_transient( 'mailweb_alert_throttled' ) ) {
		return false;
	}
	set_transient( 'mailweb_alert_throttled', 1, 15 * MINUTE_IN_SECONDS );

	$site    = (string) get_bloginfo( 'name' );
	$message = sprintf( '[%s] MailWeb Alert: %s', $site, sanitize_text_field( $reason ) );
	$body    = array(
		'text'    => $message,
		'content' => $message,
		'site'    => home_url(),
		'reason'  => sanitize_text_field( $reason ),
		'context' => $context,
	);
	$res = wp_safe_remote_post(
		$url,
		array(
			'timeout' => 8,
			'headers' => array( 'Content-Type' => 'application/json' ),
			'body'    => wp_json_encode( $body ),
		)
	);
	return ! is_wp_error( $res ) && wp_remote_retrieve_response_code( $res ) < 300;
}

/* ---------- 6. REST Routes for Pause Dismiss, Logs, Resend, Fallback & Alerts ---------- */

add_action(
	'rest_api_init',
	function () {
		$cap   = function_exists( 'mailweb_rest_can' ) ? mailweb_rest_can( MAILWEB_CAP ) : fn() => current_user_can( 'edit_others_posts' );
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
					'callback'            => fn() => rest_ensure_response( array( 'configured' => '' !== (string) get_option( 'mailweb_alert_webhook', '' ) ) ),
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => $admin,
					'callback'            => function ( WP_REST_Request $r ) {
						$url = esc_url_raw( trim( (string) $r->get_param( 'webhook_url' ) ) );
						update_option( 'mailweb_alert_webhook', $url, false );
						return rest_ensure_response( array( 'configured' => '' !== $url ) );
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
 * Send a diagnostic test email and return structured status.
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
	$ok      = wp_mail( $to, $subject, $body, $headers );
	mailweb_log_record(
		array(
			'to'       => $to,
			'subject'  => $subject,
			'status'   => $ok ? 'sent' : 'failed',
			'provider' => 'test',
		)
	);
	return array(
		'sent'    => (bool) $ok,
		'to'      => $to,
		'message' => $ok ? __( 'Test email dispatched.', 'mailweb' ) : __( 'Test email failed to send.', 'mailweb' ),
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
			'manage_options',
			'mailweb-logs',
			'mailweb_render_logs_screen'
		);
	},
	30
);

/**
 * Render the Email Logs, Resend, Fallback & Test Email screen.
 */
function mailweb_render_logs_screen(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to access this page.', 'mailweb' ), 403 );
	}
	$logs = mailweb_logs_list( 50 );
	$fb   = mailweb_smtp_fallback_settings();
	echo '<div class="wrap">';
	echo '<h1>' . esc_html__( 'MailWeb — Email Logs & Diagnostics', 'mailweb' ) . '</h1>';
	echo '<p>' . esc_html( sprintf( /* translators: %s: fallback status */ __( 'Fallback SMTP: %s', 'mailweb' ), $fb['enabled'] ? ( $fb['host'] . ':' . $fb['port'] ) : __( 'Not enabled', 'mailweb' ) ) ) . '</p>';
	echo '<table class="widefat striped" style="margin-top:16px;"><thead><tr>';
	echo '<th>' . esc_html__( 'Time (UTC)', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'To', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Subject', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Status', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Provider', 'mailweb' ) . '</th>';
	echo '<th>' . esc_html__( 'Error', 'mailweb' ) . '</th>';
	echo '</tr></thead><tbody>';
	if ( empty( $logs ) ) {
		echo '<tr><td colspan="6">' . esc_html__( 'No email log entries recorded yet.', 'mailweb' ) . '</td></tr>';
	} else {
		foreach ( $logs as $row ) {
			echo '<tr>';
			echo '<td>' . esc_html( (string) ( $row['at'] ?? '' ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $row['to'] ?? '' ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $row['subject'] ?? '' ) ) . '</td>';
			echo '<td><strong>' . esc_html( (string) ( $row['status'] ?? '' ) ) . '</strong></td>';
			echo '<td>' . esc_html( (string) ( $row['provider'] ?? '' ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $row['error'] ?? '' ) ) . '</td>';
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
