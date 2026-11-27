<?php
/**
 * MailWeb's own capability, manage_mailweb. It opens MailWeb's screens and routes (Inbox, Overview), and with them the
 * site's mailboxes (read, reply, delete to Trash); MAILWEB_CAP is it. MailWeb → Settings keeps manage_options.
 *
 * Since 3.3.4 only administrators (manage_options) hold it. A site that wants more people to read its mailboxes widens
 * it with the filter mailweb_caps_from, which returns the capabilities that grant it, for example:
 *   add_filter( 'mailweb_caps_from', fn() => array( 'edit_others_posts' ) );   // editors and above
 *
 * - Granted to administrator, and to every role that holds one of the capabilities the filter returns, on activation and
 *   once on the first admin request after an upgrade (option mailweb_caps, compared with MAILWEB_CAP_VERSION).
 * - On that one upgrade run, a role that got it before 3.3.4 only through edit_others_posts (editors) loses it, unless
 *   the filter widens it. A role that holds it on purpose can be given it again in Users → roles.
 * - user_has_cap gives it to anyone holding a capability the filter returns (live, where activation hooks do not run on
 *   deploy). By default that is no one beyond administrators.
 *
 * Self-contained: no other plugin's function or capability helper is used.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'MAILWEB_CAP' ) ) {
	define( 'MAILWEB_CAP', 'manage_mailweb' );
}
const MAILWEB_CAP_VERSION = 2;

/**
 * The capabilities that also grant MAILWEB_CAP. None by default: administrators only (manage_options).
 *
 * Filter `mailweb_caps_from` (string[] $caps): return, for example, array( 'edit_others_posts' ) to let editors read mail.
 */
function mailweb_caps_from(): array {
	return array_values( array_filter( array_map( 'sanitize_key', (array) apply_filters( 'mailweb_caps_from', array() ) ) ) );
}

/**
 * Gives MAILWEB_CAP to administrator and to every role that holds a capability from mailweb_caps_from(). Before this
 * version's upgrade run (option mailweb_caps below 2), it also takes it back from other roles that got it from the
 * earlier edit_others_posts rule, unless the filter widens it.
 */
function mailweb_caps_grant(): void {
	if ( ! function_exists( 'wp_roles' ) ) {
		return;
	}
	$from    = mailweb_caps_from();
	$upgrade = (int) get_option( 'mailweb_caps', 0 ) < MAILWEB_CAP_VERSION;
	foreach ( wp_roles()->role_objects as $name => $role ) {
		$held = array_filter( $from, array( $role, 'has_cap' ) );
		if ( 'administrator' === $name || $held ) {
			if ( ! $role->has_cap( MAILWEB_CAP ) ) {
				$role->add_cap( MAILWEB_CAP );
			}
		} elseif ( $upgrade && $role->has_cap( MAILWEB_CAP ) && ! $role->has_cap( 'manage_options' ) && (int) get_option( 'mailweb_caps', 0 ) > 0 ) {
			$role->remove_cap( MAILWEB_CAP ); // granted by the old edit_others_posts rule; now administrators only
		}
	}
	update_option( 'mailweb_caps', MAILWEB_CAP_VERSION, true );
}

register_activation_hook( dirname( __DIR__ ) . '/mailweb.php', 'mailweb_caps_grant' );

// Upgrade check: once per MAILWEB_CAP_VERSION, on an admin request.
add_action(
	'admin_init',
	function () {
		if ( (int) get_option( 'mailweb_caps', 0 ) < MAILWEB_CAP_VERSION ) {
			mailweb_caps_grant();
		}
	}
);

/**
 * A user who holds a capability from mailweb_caps_from() holds MAILWEB_CAP too, until the role grant has run.
 *
 * @param array $allcaps The user's capabilities.
 */
function mailweb_caps_fallback( $allcaps ) {
	if ( is_array( $allcaps ) && ! isset( $allcaps[ MAILWEB_CAP ] ) ) {
		foreach ( mailweb_caps_from() as $old ) {
			if ( ! empty( $allcaps[ $old ] ) ) {
				$allcaps[ MAILWEB_CAP ] = true;
				break;
			}
		}
	}
	return $allcaps;
}
add_filter( 'user_has_cap', 'mailweb_caps_fallback' );
