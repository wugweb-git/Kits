<?php
/**
 * Animal Writes site layer for MailWeb. Load as a must-use plugin (wp-content/mu-plugins/). It is not part of any
 * distributed package: it holds what belongs to this one site, which MailWeb used to carry. Needs MailWeb 3.5.0.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// After MailWeb's own plugins_loaded 5 callback, which loads its generic includes/fluentcrm.php where FluentCRM or Fluent
// Forms is active. Without those (or without MailWeb) nothing here loads, as before.
add_action(
	'plugins_loaded',
	function () {
		if ( ! function_exists( 'mailweb_fcrm_on' ) ) {
			return;
		}
		require_once __DIR__ . '/website-forms.php'; // Website forms in the Inbox, the old webhook address, the API token from AW_HOSTINGER_MAIL_TOKEN.
		require_once __DIR__ . '/fluentcrm-aw.php'; // Volunteer fields, update link and {{aw.*}} smart code, form notes, `wp aw crm-setup`, the block list and tag titles.
		require_once __DIR__ . '/newsletter.php'; // [aw_newsletter] (Fluent Forms) and the old list's confirm and unsubscribe links.
		require_once __DIR__ . '/fluentcrm-compat.php'; // the old aw_ names of the files above.

		// The generic plugin takes its block list and tag titles from filters; these are the site's own.
		add_filter(
			'mailweb_fcrm_blocked_emails',
			function ( $hashes ) {
				return (array) apply_filters( 'aw_crm_blocked_emails', array_merge( (array) $hashes, MAILWEB_FCRM_BLOCKED_EMAILS ) );
			}
		);
		add_filter(
			'mailweb_fcrm_tag_titles',
			function ( $titles ) {
				return (array) $titles + MAILWEB_FCRM_TAG_TITLES;
			}
		);
	},
	6
);
