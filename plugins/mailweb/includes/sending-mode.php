<?php
/**
 * How far MailWeb takes over the site's outgoing mail. Three things are explicit settings, each off for a new
 * install (Mail → Settings → Site sending → "How MailWeb handles the site's email"):
 *
 * - force_from: every email leaves with the sending mailbox as From address and the site name as sender name (the
 *   wp_mail_from and wp_mail_from_name filters). Off: WordPress and other plugins choose the From address.
 * - cap: the daily sending limit and queue (mail-cap.php). Off: emails are sent at once and never queued or paused.
 * - log_body: keep the text of sent emails in the log table for log_days days. Off: the table holds metadata only
 *   (time, priority, status, error); an email's text is kept only while it waits in the queue or for a retry, and is
 *   cleared after it is sent.
 *
 * Sites that already had MailWeb set up before 3.3.4 (saved settings found, see mailweb_is_configured_site()) keep the
 * old behaviour: force_from and cap on, log_body off. The choice is made once and stored in the option mailweb_sending.
 *
 * MailWeb stands down completely (no forced From, no SMTP override, no limit, no queue) while another SMTP plugin is
 * active: FluentSMTP, Post SMTP or WP Mail SMTP. The filter mailweb_defer_to_external_smtp changes that either way.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const MAILWEB_SENDING_OPTION = 'mailweb_sending';

/**
 * The name of the other SMTP plugin that is active, or '' for none. Detected by constant or class, when it is asked.
 */
function mailweb_external_smtp_plugin(): string {
	if ( defined( 'FLUENTMAIL' ) || defined( 'FLUENTMAIL_PLUGIN_FILE' ) || class_exists( 'FluentMail\\App\\Services\\Mailer\\Manager', false ) ) {
		return 'FluentSMTP';
	}
	if ( defined( 'POST_SMTP_VER' ) || class_exists( 'PostmanWpMail', false ) ) {
		return 'Post SMTP';
	}
	if ( defined( 'WPMS_PLUGIN_VER' ) || function_exists( 'wp_mail_smtp' ) || class_exists( 'WPMailSMTP\\Core', false ) ) {
		return 'WP Mail SMTP';
	}
	return '';
}

/**
 * Whether MailWeb leaves sending to another SMTP plugin.
 *
 * Filter `mailweb_defer_to_external_smtp` (bool $defer, string $plugin): return false to make MailWeb send anyway, or
 * true to make it stand down for a plugin it does not detect.
 */
function mailweb_defer_to_external_smtp(): bool {
	$plugin = mailweb_external_smtp_plugin();
	return (bool) apply_filters( 'mailweb_defer_to_external_smtp', '' !== $plugin, $plugin );
}

/**
 * Whether the site already had MailWeb set up: any saved MailWeb setting, or a mailbox password or token in wp-config
 * or the server environment. Only read while the option mailweb_sending does not exist yet.
 */
function mailweb_is_configured_site(): bool {
	foreach ( array( 'mailweb_smtp', 'mailweb_cap', 'mailweb_api_token', 'mailweb_mailboxes', 'mailweb_default_from', 'mailweb_aliases', 'mailweb_profiles', 'mailweb_crm' ) as $name ) {
		$value = get_option( $name, null );
		if ( null !== $value && false !== $value && array() !== $value && '' !== $value ) {
			return true;
		}
	}
	foreach ( array( 'MAILWEB_SMTP_PASSWORD', 'MAILWEB_API_TOKEN', 'SMTP_PASS', 'SMTP_HOST' ) as $name ) {
		if ( ( defined( $name ) && constant( $name ) ) || getenv( $name ) ) {
			return true;
		}
	}
	return false;
}

/**
 * The three switches and the retention as they are stored.
 *
 * @param array $in force_from, cap, log_body (truthy), log_days.
 */
function mailweb_sending_clean( array $in ): array {
	$days = absint( $in['log_days'] ?? 30 );
	return array(
		'force_from' => empty( $in['force_from'] ) ? 0 : 1,
		'cap'        => empty( $in['cap'] ) ? 0 : 1,
		'log_body'   => empty( $in['log_body'] ) ? 0 : 1,
		'log_days'   => min( 365, max( 1, $days ? $days : 30 ) ),
	);
}

/** The values a site gets when nothing is stored: all off for a new install, the old behaviour for a set-up one. */
function mailweb_sending_initial(): array {
	$old = mailweb_is_configured_site();
	return mailweb_sending_clean(
		array(
			'force_from' => $old,
			'cap'        => $old,
			'log_body'   => false,
			'log_days'   => 30,
		)
	);
}

/** The stored switches (or the values a site would get now, when nothing is stored yet). */
function mailweb_sending_settings(): array {
	$saved = get_option( MAILWEB_SENDING_OPTION, null );
	return is_array( $saved ) ? mailweb_sending_clean( $saved ) : mailweb_sending_initial();
}

/**
 * One switch as it works now: a switch that takes over mail is off while another SMTP plugin is active.
 *
 * @param string $key force_from, cap or log_body.
 */
function mailweb_sending_on( string $key ): bool {
	if ( 'log_body' !== $key && mailweb_defer_to_external_smtp() ) {
		return false;
	}
	return ! empty( mailweb_sending_settings()[ $key ] );
}

/** The daily limit and queue are on. */
function mailweb_cap_active(): bool {
	return mailweb_sending_on( 'cap' );
}

/** Days the text of sent emails is kept when body logging is on, and the age at which held emails lose their text. */
function mailweb_log_days(): int {
	return (int) mailweb_sending_settings()['log_days'];
}

/** MailWeb is the one sending the site's email: not deferring, and it was asked to force the From, limit or use SMTP. */
function mailweb_takes_over_mail(): bool {
	if ( mailweb_defer_to_external_smtp() ) {
		return false;
	}
	$s = mailweb_sending_settings();
	return ! empty( $s['force_from'] ) || ! empty( $s['cap'] ) || ( function_exists( 'mailweb_smtp_settings' ) && '' !== mailweb_smtp_settings()['pass'] );
}

// Decide once, before anything is saved: a new install starts with everything off; a set-up site keeps its behaviour.
add_action(
	'init',
	function () {
		if ( null === get_option( MAILWEB_SENDING_OPTION, null ) ) {
			update_option( MAILWEB_SENDING_OPTION, mailweb_sending_initial(), false );
		}
	},
	1
);

/** Save the switches from the Site sending form. */
add_action(
	'admin_post_mailweb_sending_save',
	function () {
		if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'mailweb_sending_save' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'mailweb' ), 403 );
		}
		update_option(
			MAILWEB_SENDING_OPTION,
			mailweb_sending_clean(
				array(
					'force_from' => isset( $_POST['force_from'] ),
					'cap'        => isset( $_POST['cap'] ),
					'log_body'   => isset( $_POST['log_body'] ),
					'log_days'   => absint( wp_unslash( $_POST['log_days'] ?? 30 ) ),
				)
			),
			false
		);
		if ( function_exists( 'mailweb_delete_data_save' ) ) {
			mailweb_delete_data_save( isset( $_POST['delete_data'] ) );
		}
		if ( function_exists( 'mailweb_purge_log' ) ) {
			mailweb_purge_log();
		}
		wp_safe_redirect( mailweb_settings_url( 'sending', array( 'mailweb_sending' => 'saved' ), 'mode' ) );
		exit;
	}
);

/** The form: one place for the three switches, the retention and "delete data". */
function mailweb_sending_mode_form(): void {
	$s     = mailweb_sending_settings();
	$other = mailweb_external_smtp_plugin();
	echo '<hr><h2 id="mode">' . esc_html__( 'How MailWeb handles the site\'s email', 'mailweb' ) . '</h2>';
	if ( 'saved' === sanitize_key( wp_unslash( $_GET['mailweb_sending'] ?? '' ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- a notice after the nonced save.
		wp_admin_notice( esc_html__( 'Saved.', 'mailweb' ), array( 'type' => 'success', 'additional_classes' => array( 'inline' ) ) );
	}
	if ( mailweb_defer_to_external_smtp() ) {
		wp_admin_notice(
			esc_html(
				'' !== $other
					/* translators: %s: name of the other SMTP plugin. */
					? sprintf( __( '%s is active, so MailWeb is not changing the From address, not sending through its own SMTP settings and not limiting or queuing email. The switches below apply again when it is deactivated.', 'mailweb' ), $other )
					: __( 'Another plugin is sending the site\'s email (filter mailweb_defer_to_external_smtp), so the switches below are not applied.', 'mailweb' )
			),
			array( 'type' => 'info', 'additional_classes' => array( 'inline' ) )
		);
	}
	echo '<p>' . esc_html__( 'These switches decide how much of the site\'s email MailWeb takes over. A new install has them all off.', 'mailweb' ) . '</p>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	wp_nonce_field( 'mailweb_sending_save' );
	echo '<input type="hidden" name="action" value="mailweb_sending_save"><table class="form-table" role="presentation"><tbody>';
	$rows = array(
		'force_from'  => array( __( 'Force the From address', 'mailweb' ), __( 'Every email leaves as the mailbox and sender name above. Off: WordPress and other plugins choose the From address (with a saved mailbox password, mail is still sent through that mailbox).', 'mailweb' ) ),
		'cap'         => array( __( 'Daily sending limit and queue', 'mailweb' ), __( 'Keep under the limit below; anything over waits in a queue table (with its text) until it can be sent, and a refusal by the mail server pauses sending. Off: emails are sent at once.', 'mailweb' ) ),
		'log_body'    => array( __( 'Keep the text of sent emails', 'mailweb' ), __( 'Off: the queue table keeps metadata only (time, priority, status); recipients and subject are logged only by the separate Delivery log switch below. On: the recipients, subject and text of sent emails stay in the queue table for the days below, then are cleared. Password reset links are among them.', 'mailweb' ) ),
		'delete_data' => array( __( 'Delete MailWeb\'s data when the plugin is deleted', 'mailweb' ), __( 'A backup file is written to wp-content/uploads/wugweb-backups first. Mailbox contents are never touched.', 'mailweb' ) ),
	);
	foreach ( $rows as $key => $r ) {
		$on = 'delete_data' === $key ? mailweb_delete_data_on() : ! empty( $s[ $key ] );
		echo '<tr><th scope="row">' . esc_html( $r[0] ) . '</th><td><label for="mailweb-mode-' . esc_attr( $key ) . '"><input type="checkbox" id="mailweb-mode-' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="1"' . checked( $on, true, false ) . '> ' . esc_html( $r[0] ) . '</label><p class="description">' . esc_html( $r[1] ) . '</p></td></tr>';
	}
	echo '<tr><th scope="row"><label for="mailweb-mode-days">' . esc_html__( 'Keep email text for (days)', 'mailweb' ) . '</label></th><td><input id="mailweb-mode-days" name="log_days" type="number" min="1" max="365" value="' . (int) $s['log_days'] . '"><p class="description">' . esc_html__( 'Applies to kept text of sent emails and to held emails that were never sent: after this many days their text is deleted, daily. The log rows themselves go after 30 days or this many, whichever is longer.', 'mailweb' ) . '</p></td></tr>';
	echo '</tbody></table><p><button class="button button-primary" type="submit">' . esc_html__( 'Save', 'mailweb' ) . '</button></p></form>';
}
