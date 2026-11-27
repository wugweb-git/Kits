<?php
/**
 * FluentCRM helpers (generic): the Newsletter list, tags, subscribing a person, finding or making a contact for an email
 * address, the block list, the campaign UTM tags and the dashboard tidy-up. Loaded only where FluentCRM or Fluent Forms is
 * active. Sends nothing.
 *
 * A site that needs more (its own forms, volunteer fields, notes, smart codes, tag titles, a block list) adds it through
 * the filters `mailweb_fcrm_tag_titles` and `mailweb_fcrm_blocked_emails`, or in its own code on top of these functions.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const MAILWEB_FCRM_LIST = 'newsletter';

/**
 * Block list: SHA-256 of the lowercased, trimmed address, for addresses that must never become contacts. Empty by default;
 * a site adds hashes through the filter `mailweb_fcrm_blocked_emails`. Checked by mailweb_fcrm_subscribe(),
 * mailweb_fcrm_contact_for(), MailWeb's inbox sync and the Fluent Forms → FluentCRM feed (below).
 * Make a hash with: php -r 'echo hash("sha256","name@example.com");'
 */
function mailweb_fcrm_blocked_hashes(): array {
	return array_map( 'strval', (array) apply_filters( 'mailweb_fcrm_blocked_emails', array() ) );
}

/** Whether an email address is on the block list. */
function mailweb_fcrm_blocked( $email ) {
	$email = strtolower( trim( (string) $email ) );
	return '' !== $email && in_array( hash( 'sha256', $email ), mailweb_fcrm_blocked_hashes(), true );
}

add_filter(
	'mailweb_crm_skip_email',
	function ( $skip, $email ) {
		return $skip || mailweb_fcrm_blocked( $email );
	},
	10,
	2
);

/*
 * Fluent Forms → FluentCRM feeds create contacts inside FluentCRM, which has no hook before it creates one. For a
 * blocked address the feed's handler (priority 10) is taken off for that one run and put back straight after.
 */
add_action(
	'fluentform/integration_notify_fluentcrm_feeds',
	function ( $feed, $form_data ) {
		$email = (string) ( $feed['processedValues']['email'] ?? '' );
		if ( ! is_email( $email ) ) {
			$email = (string) ( is_array( $form_data ) ? ( $form_data[ $email ] ?? '' ) : '' );
		}
		if ( ! mailweb_fcrm_blocked( $email ) ) {
			return;
		}
		global $wp_filter;
		$hook = 'fluentform/integration_notify_fluentcrm_feeds';
		$cbs  = isset( $wp_filter[ $hook ] ) ? (array) ( $wp_filter[ $hook ]->callbacks[10] ?? array() ) : array();
		foreach ( $cbs as $cb ) {
			$fn = $cb['function'];
			if ( ! is_array( $fn ) || ! is_object( $fn[0] ) || 'notify' !== $fn[1] || ! str_starts_with( get_class( $fn[0] ), 'FluentCrm\\' ) ) {
				continue;
			}
			remove_action( $hook, $fn, 10 );
			$restore = function () use ( $hook, $fn, &$restore ) {
				add_action( $hook, $fn, 10, 4 );
				remove_action( $hook, $restore, 11 );
			};
			add_action( $hook, $restore, 11, 0 );
		}
	},
	9,
	2
);

function mailweb_fcrm_on() {
	return function_exists( 'FluentCrmApi' );
}

/** The Newsletter list ID (created on first use). */
function mailweb_fcrm_list_id() {
	if ( ! mailweb_fcrm_on() ) {
		return 0;
	}
	$list = FluentCrmApi( 'lists' )->getInstance()->where( 'slug', MAILWEB_FCRM_LIST )->first();
	if ( ! $list ) {
		$list = FluentCrmApi( 'lists' )->getInstance()->create( array( 'title' => 'Newsletter', 'slug' => MAILWEB_FCRM_LIST ) );
	}
	return $list ? (int) $list->id : 0;
}

/**
 * Tag titles shown in FluentCRM (slug => title); any other tag is titled by its slug. DirectoryWeb's two organisation tags
 * are here; a site adds its own through the filter `mailweb_fcrm_tag_titles`.
 */
function mailweb_fcrm_tag_titles(): array {
	return (array) apply_filters(
		'mailweb_fcrm_tag_titles',
		array(
			'org-pending'  => 'Organisation: pending',
			'org-approved' => 'Organisation: approved',
		)
	);
}

/** Tag IDs for slugs (created if missing). */
function mailweb_fcrm_tag_ids( $slugs ) {
	$ids = array();
	foreach ( (array) $slugs as $slug ) {
		$tag = FluentCrmApi( 'tags' )->getInstance()->where( 'slug', $slug )->first();
		$tag = $tag ? $tag : FluentCrmApi( 'tags' )->getInstance()->create( array( 'title' => mailweb_fcrm_tag_titles()[ $slug ] ?? $slug, 'slug' => $slug ) );
		$ids[] = (int) $tag->id;
	}
	return $ids;
}

/**
 * Add or update a contact on the Newsletter list as subscribed (someone who unsubscribed, bounced or complained keeps
 * that status). Sends nothing.
 *
 * @param string $email Email.
 * @param string $name  Full name (optional).
 * @param array  $extra FluentCRM fields (phone, address_line_1, city, state, postal_code, country, source).
 * @param array  $tags  Tag slugs.
 * @return int Contact ID, or 0.
 */
function mailweb_fcrm_subscribe( $email, $name = '', $extra = array(), $tags = array() ) {
	$email = strtolower( trim( (string) $email ) );
	$list  = mailweb_fcrm_list_id();
	if ( ! $list || ! is_email( $email ) || mailweb_fcrm_blocked( $email ) ) {
		return 0;
	}
	$parts = preg_split( '/\s+/', trim( (string) $name ), 2 );
	$data  = array_filter( $extra ) + array(
		'email'  => $email,
		'status' => 'subscribed',
		'lists'  => array( $list ),
	);
	if ( '' !== ( $parts[0] ?? '' ) ) {
		$data['first_name'] = $parts[0];
		$data['last_name']  = $parts[1] ?? '';
	}
	$have = FluentCrmApi( 'contacts' )->getContact( $email );
	if ( $have && in_array( $have->status, array( 'unsubscribed', 'bounced', 'complained' ), true ) ) {
		$data['status'] = $have->status;
	}
	if ( $tags ) {
		$data['tags'] = mailweb_fcrm_tag_ids( $tags );
	}
	$c = FluentCrmApi( 'contacts' )->createOrUpdate( $data );
	return $c ? (int) $c->id : 0;
}


/* ---------- Messages: a note on the sender's contact ---------- */

/**
 * The sender's contact, found or made. A new contact is "transactional" (no newsletter); an existing one keeps its
 * status. Our own addresses and mail-system senders get none.
 *
 * @param string $email  Email.
 * @param string $name   Name (optional).
 * @param array  $tags   Tag slugs.
 * @param string $source Where the contact came from.
 * @return object|null FluentCRM contact.
 */
function mailweb_fcrm_contact_for( $email, $name, $tags, $source ) {
	$email = strtolower( trim( (string) $email ) );
	$site_host = preg_replace( '/^www\./', '', (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
	$own_email = '' !== $site_host && str_ends_with( $email, '@' . $site_host );
	if ( ! mailweb_fcrm_on() || ! is_email( $email ) || mailweb_fcrm_blocked( $email ) || $own_email || preg_match( '/^(mailer-daemon|postmaster|no-?reply)@/i', $email ) ) {
		return null;
	}
	if ( function_exists( 'mailweb_crm_upsert' ) ) {
		$c = mailweb_crm_upsert( $email, $name, $source ); // MailWeb's copy of the step below (one place to change)
		if ( $c && $tags ) {
			$c->attachTags( mailweb_fcrm_tag_ids( $tags ) );
		}
		return $c;
	}
	// Without MailWeb: the same step here, so Core works on its own.
	$c = FluentCrmApi( 'contacts' )->getContact( $email );
	if ( ! $c ) {
		$data  = array( 'email' => $email, 'status' => 'transactional', 'source' => $source );
		$name  = false !== strpos( (string) $name, '@' ) ? '' : trim( (string) $name, " \t\"'" );
		$parts = preg_split( '/\s+/', $name, 2 );
		if ( '' !== ( $parts[0] ?? '' ) ) {
			$data['first_name'] = $parts[0];
			$data['last_name']  = $parts[1] ?? '';
		}
		$c = FluentCrmApi( 'contacts' )->createOrUpdate( $data );
	}
	if ( $c && $tags ) {
		$c->attachTags( mailweb_fcrm_tag_ids( $tags ) );
	}
	return $c ? $c : null;
}

/** Reply-To for an email to a person. */
function mailweb_fcrm_reply_to( $email = '' ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found -- kept for callers
	return (string) apply_filters( 'mailweb_fcrm_reply_to', get_option( 'admin_email' ) );
}


/* ---------- Dashboard panels (owner, 1 Nov 2026) ---------- */

// Getting Started: FluentCRM shows the checklist only while its dashboard data carries onboarding steps.
add_filter(
	'fluent_crm/dashboard_data',
	function ( $data ) {
		if ( is_array( $data ) ) {
			$data['onboarding'] = null;
		}
		return $data;
	}
);

// The greeting header, Quick Links and the "Do more with FluentCRM Pro" card have no filter, so they are hidden with
// a few lines of CSS on FluentCRM's own stylesheet, on FluentCRM's admin page only. The Pro card is the one linking to
// FluentCRM's Pro page; the integration "Recommendation" card links there too, so it goes as well.
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		if ( 'toplevel_page_fluentcrm-admin' !== $hook || ! mailweb_fcrm_on() || ! wp_style_is( 'fluentcrm_app_global', 'enqueued' ) ) {
			return;
		}
		wp_add_inline_style(
			'fluentcrm_app_global',
			'.fluentcrm_admin_dashboard .fcrm_dashboard_user,.fluentcrm_admin_dashboard .fcrm_quick_links_wrap,'
			. '.fluentcrm_admin_dashboard .fcrm_base_card:has(a[href*="utm_campaign=pro"]){display:none}'
		);
	},
	20
);

/* ---------- Campaign tags (UTM) on email links (owner, 12 Nov 2026) ---------- */

/*
 * Every FluentCRM email's links to the site carry utm_source=newsletter, utm_medium=email, utm_campaign={campaign slug},
 * so GA4 shows email visits as email. Never an address or a name (owner, 21 Oct 2026).
 * - A new campaign gets these in FluentCRM's own UTM settings (its Settings step shows them; an editor can change them).
 * - Automation emails and any campaign without its own tags: FluentCRM adds a campaign's tags on its click redirect only
 *   when the campaign's UTM switch is on, so the same tags are added there to a link to the site that has none.
 * The site's other emails are tagged by Mailweb (utm_source=site-email, mailweb/includes/utm.php).
 */

/** A campaign's slug as its utm_campaign: a duplicate's "-1793715277" ending dropped. */
function mailweb_fcrm_utm_campaign( $slug ) {
	$slug = sanitize_title( (string) $slug );
	return '' !== $slug ? (string) preg_replace( '/-\d{9,}$/', '', $slug ) : 'newsletter';
}

// A new campaign: FluentCRM's own UTM settings filled in, unless it already has its own.
add_action(
	'fluent_crm/campaign_created',
	function ( $campaign ) {
		if ( ! is_object( $campaign ) || ! empty( $campaign->utm_status ) || '' !== (string) $campaign->utm_source ) {
			return;
		}
		$campaign->utm_status   = 1;
		$campaign->utm_source   = 'newsletter';
		$campaign->utm_medium   = 'email';
		$campaign->utm_campaign = mailweb_fcrm_utm_campaign( $campaign->slug );
		$campaign->save();
	}
);

// The click redirect: a link to the site with no tags gets the campaign's (or automation email's) tags.
add_action(
	'fluentcrm_email_url_click',
	function ( $url, $mail_id ) {
		add_filter(
			'wp_redirect',
			function ( $to ) use ( $mail_id ) {
				$host = wp_parse_url( (string) $to, PHP_URL_HOST );
				$home = wp_parse_url( home_url(), PHP_URL_HOST );
				if ( ! $host || strtolower( preg_replace( '/^www\./i', '', (string) $host ) ) !== strtolower( preg_replace( '/^www\./i', '', (string) $home ) ) || preg_match( '/[?&]utm_source=/i', (string) $to ) ) {
					return $to;
				}
				global $wpdb;
				$slug = $mail_id ? (string) $wpdb->get_var( $wpdb->prepare( "SELECT c.slug FROM {$wpdb->prefix}fc_campaign_emails e JOIN {$wpdb->prefix}fc_campaigns c ON c.id = e.campaign_id WHERE e.id = %d", (int) $mail_id ) ) : ''; // phpcs:ignore WordPress.DB.DirectDatabaseQuery
				return add_query_arg(
					array(
						'utm_source'   => 'newsletter',
						'utm_medium'   => 'email',
						'utm_campaign' => mailweb_fcrm_utm_campaign( $slug ),
					),
					$to
				);
			},
			5
		);
	},
	10,
	2
);

/** The site's name as a sender name: no quotes, angle brackets, commas or line breaks (it goes into a header). */
function mailweb_fcrm_site_name(): string {
	$n = trim( preg_replace( '/[\r\n"<>,]+/', ' ', wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) ) );
	return '' !== $n ? $n : 'WordPress';
}
