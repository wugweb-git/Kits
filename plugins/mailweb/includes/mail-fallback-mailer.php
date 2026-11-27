<?php
/**
 * The PHPMailer wp_mail() uses while the fallback SMTP connection is on (loaded by mailweb_prepare_fallback_mailer(),
 * only after WordPress's PHPMailer classes exist). send() tries the primary settings first; if that fails it sends the
 * same message once through the fallback connection and puts the primary settings back, so the next email starts from
 * the primary again. wp_mail() sees one send: success if either connection accepted it, one error if both failed.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use PHPMailer\PHPMailer\Exception as MailWeb_Mailer_Exception;
use PHPMailer\PHPMailer\PHPMailer as MailWeb_Core_Mailer;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase, WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid -- PHPMailer's own property and method names.

/** PHPMailer with a one-shot retry through the fallback SMTP connection. */
class MailWeb_Fallback_Mailer extends MailWeb_Core_Mailer {

	/**
	 * Send, falling back once.
	 *
	 * @return bool
	 * @throws MailWeb_Mailer_Exception When both connections fail (exceptions on, as wp_mail() sets it).
	 */
	public function send() {
		unset( $GLOBALS['mailweb_fallback_error'] );
		if ( ! mailweb_fallback_active() ) {
			return parent::send();
		}
		$primary = '';
		try {
			if ( parent::send() ) {
				return true;
			}
			$primary = (string) $this->ErrorInfo;
		} catch ( MailWeb_Mailer_Exception $e ) {
			$primary = $e->getMessage();
		}
		$primary = mailweb_delivery_error( $primary );

		$keep    = array();
		foreach ( array( 'Mailer', 'Host', 'Port', 'SMTPAuth', 'SMTPSecure', 'Username', 'Password', 'From', 'FromName', 'Sender' ) as $prop ) {
			$keep[ $prop ] = $this->$prop;
		}
		$replies = $this->getReplyToAddresses();
		try {
			$this->smtpClose();
			mailweb_apply_fallback_smtp( $this, mailweb_smtp_fallback_settings() );
			if ( empty( $replies ) && '' !== (string) $keep['From'] ) {
				$this->addReplyTo( (string) $keep['From'], (string) $keep['FromName'] );
			}
			$this->setFrom( mailweb_smtp_fallback_settings()['user'], (string) $keep['FromName'], false );
			$this->Sender = '';
			$ok           = parent::send();
			if ( $ok ) {
				$GLOBALS['mailweb_fallback_error'] = $primary;
				return true;
			}
			$second = mailweb_delivery_error( (string) $this->ErrorInfo );
		} catch ( MailWeb_Mailer_Exception $e ) {
			$second = mailweb_delivery_error( $e->getMessage() );
			$thrown = true;
		} finally {
			$this->smtpClose();
			foreach ( $keep as $prop => $value ) {
				$this->$prop = $value;
			}
			$this->clearReplyTos();
			foreach ( $replies as $addr ) {
				$this->addReplyTo( (string) $addr[0], (string) ( $addr[1] ?? '' ) );
			}
		}
		$message = $primary . ' | Fallback: ' . $second;
		if ( ! empty( $thrown ) || $this->exceptions ) {
			throw new MailWeb_Mailer_Exception( $message );
		}
		$this->ErrorInfo = $message;
		return false;
	}
}
