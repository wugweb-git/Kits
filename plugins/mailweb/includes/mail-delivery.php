<?php
/**
 * What happened to the site's email, and what to do when sending fails. Three separate switches, all off on a clean
 * install, in Mail → Settings → Site sending → "Delivery log, fallback and alerts" (option mailweb_delivery):
 *
 * - log_mail: keep one line per email wp_mail() handled (time, recipients, subject, status, error; never the text).
 *   The status is what wp_mail() really reported: "sent" means the mail server accepted the message, not that it was
 *   delivered; "failed" is an error from the mail server or PHPMailer; "fallback" means the primary send failed and
 *   the fallback SMTP connection accepted it; "queued" means MailWeb's daily limit is holding it (the send that
 *   follows gets its own line). An email another plugin short-circuits (pre_wp_mail) never reaches wp_mail's mailer
 *   and is not logged.
 * - alerts: email the site administrator (or the address set here) when an email could not be sent, at most one alert
 *   an hour. The alert says how many sends failed since the last one and the last error, never a recipient or text.
 * - Fallback SMTP: a second SMTP connection (option mailweb_smtp_fallback, password encrypted, never shown again).
 *   When the primary send fails, the same message is sent once more through it; only if that fails too does wp_mail()
 *   report a failure. Not used while another SMTP plugin is active (sending-mode.php).
 *
 * The per-user dismiss of the "sending paused" notice is here too (user meta mailweb_pause_dismissed).
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const MAILWEB_DELIVERY_OPTION  = 'mailweb_delivery';
const MAILWEB_ALERT_INTERVAL   = HOUR_IN_SECONDS; // at most one failure alert in this time.
const MAILWEB_LOG_STATUSES     = array( 'sent', 'failed', 'fallback', 'queued' );

/* ---------- Settings ---------- */

/**
 * The delivery switches as they are stored.
 *
 * @param array $in log_mail, alerts (truthy), alert_to (address).
 */
function mailweb_delivery_clean( array $in ): array {
	$to = sanitize_email( (string) ( $in['alert_to'] ?? '' ) );
	return array(
		'log_mail' => empty( $in['log_mail'] ) ? 0 : 1,
		'alerts'   => empty( $in['alerts'] ) ? 0 : 1,
		'alert_to' => is_email( $to ) ? $to : '',
	);
}

/** The stored delivery settings; everything off and no address when nothing is stored. */
function mailweb_delivery_settings(): array {
	$saved = get_option( MAILWEB_DELIVERY_OPTION, array() );
	return mailweb_delivery_clean( is_array( $saved ) ? $saved : array() );
}

/**
 * One delivery switch.
 *
 * @param string $key log_mail or alerts.
 */
function mailweb_delivery_on( string $key ): bool {
	return ! empty( mailweb_delivery_settings()[ $key ] );
}

/** Where a failure alert goes: the address saved here, else the site's administration email. */
function mailweb_alert_recipient(): string {
	$to = mailweb_delivery_settings()['alert_to'];
	if ( '' === $to ) {
		$to = sanitize_email( (string) get_option( 'admin_email', '' ) );
	}
	return is_email( $to ) ? $to : '';
}

/* ---------- Fallback SMTP ---------- */

/** The fallback connection is on, complete (server, mailbox, password) and MailWeb is the one sending. */
function mailweb_fallback_active(): bool {
	if ( function_exists( 'mailweb_defer_to_external_smtp' ) && mailweb_defer_to_external_smtp() ) {
		return false;
	}
	$fb = mailweb_smtp_fallback_settings();
	return ! empty( $fb['enabled'] ) && '' !== $fb['host'] && '' !== $fb['user'] && '' !== $fb['pass'];
}

/**
 * Point a PHPMailer at the fallback connection. The port decides the encryption, as for the primary: 465 is SSL, any
 * other port is STARTTLS.
 *
 * @param object $mailer PHPMailer instance.
 * @param array  $fb     mailweb_smtp_fallback_settings().
 */
function mailweb_apply_fallback_smtp( $mailer, array $fb ): void {
	$mailer->isSMTP();
	$mailer->Host       = $fb['host']; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	$mailer->Port       = (int) $fb['port']; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	$mailer->SMTPAuth   = true; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	$mailer->SMTPSecure = 465 === (int) $fb['port'] ? 'ssl' : 'tls'; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	$mailer->Username   = $fb['user']; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	$mailer->Password   = $fb['pass']; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
}

/**
 * Make wp_mail() use a PHPMailer that can retry through the fallback connection. wp_mail() creates its own PHPMailer only
 * when none exists, so a plain one (or none) is replaced by ours right before it is used; a PHPMailer of another kind
 * (another plugin's) is left alone and the fallback is then not applied.
 *
 * @param array $atts wp_mail's arguments, passed through.
 */
function mailweb_prepare_fallback_mailer( $atts ) {
	if ( ! mailweb_fallback_active() ) {
		return $atts;
	}
	global $phpmailer;
	if ( is_object( $phpmailer ) && 'PHPMailer\\PHPMailer\\PHPMailer' !== get_class( $phpmailer ) && ! $phpmailer instanceof MailWeb_Fallback_Mailer ) {
		return $atts;
	}
	if ( $phpmailer instanceof MailWeb_Fallback_Mailer ) {
		return $atts;
	}
	if ( ! class_exists( 'PHPMailer\\PHPMailer\\PHPMailer', false ) ) {
		require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
		require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
		require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';
	}
	require_once MAILWEB_DIR . 'includes/mail-fallback-mailer.php';
	$phpmailer = new MailWeb_Fallback_Mailer( true ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- wp_mail() reuses this object; that is its documented seam.
	$phpmailer::$validator = static function ( $email ) {
		return (bool) is_email( $email );
	};
	return $atts;
}
add_filter( 'wp_mail', 'mailweb_prepare_fallback_mailer', 99 );

/* ---------- The delivery log: what wp_mail() really did ---------- */

/** Error text for the log and the alert: one short line, no addresses, no passwords. */
function mailweb_delivery_error( $msg ): string {
	if ( function_exists( 'mailweb_clean_error' ) ) {
		return mailweb_clean_error( $msg );
	}
	$msg = preg_replace( '/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', '[address]', wp_strip_all_tags( (string) $msg ) );
	return mb_substr( trim( preg_replace( '/\s+/', ' ', (string) $msg ) ), 0, 250 );
}

/** The recipients of a wp_mail() data array as one trimmed string. */
function mailweb_delivery_recipients( array $data ): string {
	$to = $data['to'] ?? '';
	$to = is_array( $to ) ? implode( ', ', array_map( 'strval', $to ) ) : (string) $to;
	return mb_substr( $to, 0, 200 );
}

/** Which way the email went: the fallback, MailWeb's SMTP mailbox, or WordPress's default. */
function mailweb_delivery_provider( bool $fallback ): string {
	if ( $fallback ) {
		return 'fallback';
	}
	if ( function_exists( 'mailweb_defer_to_external_smtp' ) && mailweb_defer_to_external_smtp() ) {
		return 'other-plugin';
	}
	return function_exists( 'mailweb_smtp_settings' ) && '' !== mailweb_smtp_settings()['pass'] ? 'smtp' : 'wordpress';
}

/**
 * wp_mail_succeeded: the mail server accepted the message.
 *
 * @param array $data to, subject, message, headers, attachments.
 */
function mailweb_on_mail_succeeded( $data ): void {
	$fallback_error = $GLOBALS['mailweb_fallback_error'] ?? null;
	unset( $GLOBALS['mailweb_fallback_error'] );
	if ( ! mailweb_delivery_on( 'log_mail' ) ) {
		return;
	}
	$data = is_array( $data ) ? $data : array();
	mailweb_log_record(
		array(
			'to'       => mailweb_delivery_recipients( $data ),
			'subject'  => (string) ( $data['subject'] ?? '' ),
			'status'   => null !== $fallback_error ? 'fallback' : 'sent',
			'provider' => mailweb_delivery_provider( null !== $fallback_error ),
			'error'    => null !== $fallback_error ? 'Primary failed: ' . $fallback_error : '',
		)
	);
}
add_action( 'wp_mail_succeeded', 'mailweb_on_mail_succeeded' );

/**
 * wp_mail_failed: the email could not be sent (after the fallback, when there is one). Logs it when logging is on and
 * counts it for the alert.
 *
 * @param mixed $err WP_Error with the mail data in its data.
 */
function mailweb_on_mail_failed( $err ): void {
	unset( $GLOBALS['mailweb_fallback_error'] );
	$msg  = mailweb_delivery_error( is_wp_error( $err ) ? $err->get_error_message() : 'Send failed' );
	$data = is_wp_error( $err ) && is_array( $err->get_error_data() ) ? $err->get_error_data() : array();
	if ( mailweb_delivery_on( 'log_mail' ) ) {
		mailweb_log_record(
			array(
				'to'       => mailweb_delivery_recipients( $data ),
				'subject'  => (string) ( $data['subject'] ?? '' ),
				'status'   => 'failed',
				'provider' => mailweb_delivery_provider( false ),
				'error'    => '' === $msg ? 'Send failed' : $msg,
			)
		);
	}
	mailweb_failure_alert( '' === $msg ? 'Send failed' : $msg );
}
add_action( 'wp_mail_failed', 'mailweb_on_mail_failed', 10 );

/**
 * An email was put in MailWeb's queue instead of being sent now (daily limit, or sending paused).
 *
 * @param array $atts wp_mail's arguments.
 */
function mailweb_on_mail_queued( $atts ): void {
	if ( ! mailweb_delivery_on( 'log_mail' ) ) {
		return;
	}
	$atts = is_array( $atts ) ? $atts : array();
	mailweb_log_record(
		array(
			'to'       => mailweb_delivery_recipients( $atts ),
			'subject'  => (string) ( $atts['subject'] ?? '' ),
			'status'   => 'queued',
			'provider' => 'queue',
		)
	);
}
add_action( 'mailweb_mail_queued', 'mailweb_on_mail_queued' );

/** The words for a logged status: said as what it is, not as "delivered". */
function mailweb_log_status_label( string $status ): string {
	$labels = array(
		'sent'     => __( 'Accepted by the mail server', 'mailweb' ),
		'failed'   => __( 'Failed', 'mailweb' ),
		'fallback' => __( 'Accepted by the fallback SMTP (primary failed)', 'mailweb' ),
		'queued'   => __( 'Held in the queue (limit or pause)', 'mailweb' ),
	);
	return $labels[ $status ] ?? $status;
}

/* ---------- Failure alerts ---------- */

/**
 * Email the administrator that sending failed, when alerts are on, at most once per MAILWEB_ALERT_INTERVAL. Failures in
 * between are counted and reported in the next alert. The alert is sent past MailWeb's own limit and pause so a pause
 * does not hold it, and a failure of the alert itself raises no further alert.
 *
 * @param string $reason The (cleaned) error of the last failure.
 * @return bool Whether an alert email was handed to wp_mail() and accepted.
 */
function mailweb_failure_alert( string $reason ): bool {
	if ( ! mailweb_delivery_on( 'alerts' ) || ! empty( $GLOBALS['mailweb_alerting'] ) ) {
		return false;
	}
	$count = (int) get_transient( 'mailweb_alert_count' ) + 1;
	set_transient( 'mailweb_alert_count', $count, DAY_IN_SECONDS );
	if ( get_transient( 'mailweb_alert_throttled' ) ) {
		return false;
	}
	$to = mailweb_alert_recipient();
	if ( '' === $to ) {
		return false;
	}
	set_transient( 'mailweb_alert_throttled', 1, MAILWEB_ALERT_INTERVAL ); // before sending: a failing alert cannot loop.
	delete_transient( 'mailweb_alert_count' );
	$site    = trim( preg_replace( '/[\r\n]+/', ' ', wp_specialchars_decode( (string) get_bloginfo( 'name' ), ENT_QUOTES ) ) );
	$subject = sprintf( /* translators: %s: site name. */ __( '[%s] MailWeb: an email could not be sent', 'mailweb' ), $site );
	$lines   = array(
		sprintf( /* translators: %d: number of failed sends. */ _n( '%d email could not be sent since the last alert.', '%d emails could not be sent since the last alert.', $count, 'mailweb' ), $count ),
		/* translators: %s: the error. */
		sprintf( __( 'Last error: %s', 'mailweb' ), $reason ),
		mailweb_fallback_active() ? __( 'The fallback SMTP connection is on and did not send it either.', 'mailweb' ) : __( 'No fallback SMTP connection is on.', 'mailweb' ),
		'',
		/* translators: %s: URL of the Site sending screen. */
		sprintf( __( 'Check Site sending: %s', 'mailweb' ), function_exists( 'mailweb_settings_url' ) ? mailweb_settings_url( 'sending' ) : admin_url( 'admin.php?page=mailweb-settings' ) ),
		sprintf( /* translators: %d: hours. */ __( 'At most one alert is sent every %d hour(s). This email lists no recipients and no message text.', 'mailweb' ), (int) ( MAILWEB_ALERT_INTERVAL / HOUR_IN_SECONDS ) ),
	);
	$prev                          = $GLOBALS['mailweb_bypass_cap'] ?? null;
	$GLOBALS['mailweb_alerting']   = true;
	$GLOBALS['mailweb_bypass_cap'] = true;
	try {
		$ok = (bool) wp_mail( $to, $subject, implode( "\n", $lines ) );
	} finally {
		unset( $GLOBALS['mailweb_alerting'] );
		if ( null === $prev ) {
			unset( $GLOBALS['mailweb_bypass_cap'] );
		} else {
			$GLOBALS['mailweb_bypass_cap'] = $prev;
		}
	}
	return $ok;
}

/* ---------- Dismiss the "sending paused" notice ---------- */

/** The link that hides the paused notice for the current user until the next pause. */
function mailweb_dismiss_pause_url(): string {
	return wp_nonce_url( admin_url( 'admin-post.php?action=mailweb_dismiss_pause' ), 'mailweb_dismiss_pause' );
}

add_action(
	'admin_post_mailweb_dismiss_pause',
	function () {
		if ( ! current_user_can( MAILWEB_CAP ) || ! check_admin_referer( 'mailweb_dismiss_pause' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'mailweb' ), 403 );
		}
		mailweb_dismiss_pause_notice();
		wp_safe_redirect( wp_get_referer() ? wp_get_referer() : admin_url() );
		exit;
	}
);

/* ---------- Site sending: the delivery form ---------- */

add_action( 'mailweb_smtp_screen_after', 'mailweb_delivery_form', 20 );

/** The form: the log and alert switches, the alert address and the fallback SMTP connection. */
function mailweb_delivery_form(): void {
	$d  = mailweb_delivery_settings();
	$fb = mailweb_smtp_fallback_settings();
	echo '<hr><h2 id="delivery">' . esc_html__( 'Delivery log, fallback and alerts', 'mailweb' ) . '</h2>';
	if ( 'saved' === sanitize_key( wp_unslash( $_GET['mailweb_delivery'] ?? '' ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a notice after the nonced save.
		wp_admin_notice( esc_html__( 'Saved.', 'mailweb' ), array( 'type' => 'success', 'additional_classes' => array( 'inline' ) ) );
	}
	if ( function_exists( 'mailweb_defer_to_external_smtp' ) && mailweb_defer_to_external_smtp() ) {
		wp_admin_notice( esc_html__( 'Another SMTP plugin is sending the site\'s email, so the fallback connection below is not used. The log and alerts still record what WordPress reports.', 'mailweb' ), array( 'type' => 'info', 'additional_classes' => array( 'inline' ) ) );
	}
	echo '<p>' . esc_html__( 'All off on a new install. "Accepted" means the mail server took the message; it does not say it reached the inbox.', 'mailweb' ) . '</p>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	wp_nonce_field( 'mailweb_delivery_save' );
	echo '<input type="hidden" name="action" value="mailweb_delivery_save"><table class="form-table" role="presentation"><tbody>';

	echo '<tr><th scope="row">' . esc_html__( 'Delivery log', 'mailweb' ) . '</th><td><label for="mailweb-log-mail"><input type="checkbox" id="mailweb-log-mail" name="log_mail" value="1"' . checked( ! empty( $d['log_mail'] ), true, false ) . '> ' . esc_html__( 'Keep a log line for every email', 'mailweb' ) . '</label><p class="description">' . esc_html__( 'Time, recipients, subject, what WordPress reported (accepted, failed, sent by the fallback, held in the queue) and the error. Never the text. The last 200 lines are kept, for the days set under "Keep email text for" (at least 1), and deleted with the plugin\'s data. Recipients are personal data.', 'mailweb' ) . ' <a href="' . esc_url( admin_url( 'admin.php?page=mailweb-logs' ) ) . '">' . esc_html__( 'Open the log', 'mailweb' ) . '</a></p></td></tr>';

	echo '<tr><th scope="row">' . esc_html__( 'Failure alerts', 'mailweb' ) . '</th><td><label for="mailweb-alerts"><input type="checkbox" id="mailweb-alerts" name="alerts" value="1"' . checked( ! empty( $d['alerts'] ), true, false ) . '> ' . esc_html__( 'Email me when an email cannot be sent', 'mailweb' ) . '</label><p class="description">' . esc_html__( 'At most one alert an hour, with the count and the last error (no recipient, no text). It goes out through the same mail system, so if all sending is down it can fail too; the fallback connection helps there.', 'mailweb' ) . '</p></td></tr>';
	echo '<tr><th scope="row"><label for="mailweb-alert-to">' . esc_html__( 'Send alerts to', 'mailweb' ) . '</label></th><td><input class="regular-text" type="email" id="mailweb-alert-to" name="alert_to" value="' . esc_attr( $d['alert_to'] ) . '" placeholder="' . esc_attr( (string) get_option( 'admin_email', '' ) ) . '"><p class="description">' . esc_html__( 'Empty: the site\'s administration email address.', 'mailweb' ) . '</p></td></tr>';

	$state = ! empty( $fb['enabled'] )
		? ( mailweb_fallback_active() ? __( 'On: used when the primary send fails.', 'mailweb' ) : __( 'Switched on but not used: it needs a server, a mailbox and a password, and no other SMTP plugin active.', 'mailweb' ) )
		: __( 'Off.', 'mailweb' );
	echo '<tr><th scope="row">' . esc_html__( 'Fallback SMTP', 'mailweb' ) . '</th><td><label for="mailweb-fb-enabled"><input type="checkbox" id="mailweb-fb-enabled" name="fb_enabled" value="1"' . checked( ! empty( $fb['enabled'] ), true, false ) . '> ' . esc_html__( 'If the primary send fails, try this SMTP connection once', 'mailweb' ) . '</label><p class="description">' . esc_html( $state ) . ' ' . esc_html__( 'The message leaves from the fallback mailbox (your original From address becomes the Reply-To). Email, including recipients and text, goes to this server when it is used.', 'mailweb' ) . '</p></td></tr>';
	$rows = array(
		'fb_host' => array( __( 'Fallback SMTP server', 'mailweb' ), 'text', $fb['host'] ),
		'fb_port' => array( __( 'Fallback port', 'mailweb' ), 'number', $fb['port'] ),
		'fb_user' => array( __( 'Fallback mailbox (email address)', 'mailweb' ), 'email', $fb['user'] ),
		'fb_pass' => array( __( 'Fallback mailbox password', 'mailweb' ), 'password', '' ),
	);
	foreach ( $rows as $k => $r ) {
		$ph = 'fb_pass' === $k && '' !== $fb['pass'] ? ' placeholder="' . esc_attr__( 'Saved. Leave empty to keep it.', 'mailweb' ) . '"' : '';
		echo '<tr><th scope="row"><label for="mailweb-' . esc_attr( $k ) . '">' . esc_html( $r[0] ) . '</label></th><td><input class="regular-text" id="mailweb-' . esc_attr( $k ) . '" name="' . esc_attr( $k ) . '" type="' . esc_attr( $r[1] ) . '" value="' . esc_attr( (string) $r[2] ) . '"' . $ph . ' autocomplete="' . ( 'fb_pass' === $k ? 'new-password' : 'off' ) . '">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $ph is escaped above
		if ( 'fb_pass' === $k && '' !== $fb['pass'] ) {
			echo '<p><label for="mailweb-fb-clear"><input type="checkbox" id="mailweb-fb-clear" name="fb_clear_pass" value="1"> ' . esc_html__( 'Remove the saved password', 'mailweb' ) . '</label></p>';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table><p><button class="button button-primary" type="submit">' . esc_html__( 'Save', 'mailweb' ) . '</button></p></form>';
}

add_action(
	'admin_post_mailweb_delivery_save',
	function () {
		if ( ! current_user_can( MAILWEB_CAP ) || ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'mailweb_delivery_save' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'mailweb' ), 403 );
		}
		update_option(
			MAILWEB_DELIVERY_OPTION,
			mailweb_delivery_clean(
				array(
					'log_mail' => isset( $_POST['log_mail'] ),
					'alerts'   => isset( $_POST['alerts'] ),
					'alert_to' => sanitize_email( wp_unslash( $_POST['alert_to'] ?? '' ) ),
				)
			),
			false
		);
		mailweb_smtp_fallback_save(
			array(
				'enabled'    => isset( $_POST['fb_enabled'] ),
				'host'       => sanitize_text_field( wp_unslash( $_POST['fb_host'] ?? '' ) ),
				'port'       => absint( wp_unslash( $_POST['fb_port'] ?? 465 ) ),
				'user'       => sanitize_email( wp_unslash( $_POST['fb_user'] ?? '' ) ),
				'pass'       => (string) wp_unslash( $_POST['fb_pass'] ?? '' ), // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- a password: any characters; encrypted before it is stored.
				'clear_pass' => isset( $_POST['fb_clear_pass'] ),
			)
		);
		wp_safe_redirect( mailweb_settings_url( 'sending', array( 'mailweb_delivery' => 'saved' ), 'delivery' ) );
		exit;
	}
);
