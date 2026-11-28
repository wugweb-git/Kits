<?php
/**
 * Directory enrichment: what the enrichment worker (sourceweb-workers, aw_workers/directory) found for a listing,
 * where each value came from, and how it is applied.
 *
 * - Every proposed value is one row of {prefix}aw_enrich: field, value, the value it replaced, its sources
 *   ({key, name, url, fetched_at} each; the exact page), confidence (high / medium / low) and status
 *   (auto-applied, approved, pending, rejected, undone, superseded, failed). The rows are the change log (old → new) and the
 *   provenance of every value the worker set: a field's source is its latest applied row.
 * - Apply rules (owner's brief, 18 Oct 2026): a listing that is claimed or verified is never changed; everything goes to
 *   the review queue. Otherwise a high-confidence value is applied at once when the field is empty; a value that would
 *   replace something already on the listing, and every medium or low one, waits in the queue.
 * - Google Places is a locator and a check only: the listing keeps its place ID and Maps link; Google's phone, hours,
 *   rating and status are never stored here (shown live, enrichment-front.php). A field whose only source is Google is
 *   flagged "Invite to claim". Google reporting the place permanently closed: the listing stays in search and
 *   carries a "Reported closed" note (owner, 21 Oct 2026); logged, nothing to review. Two listings with the same place ID (or another identifier a site adds): "Possible duplicate" (never merged).
 * - List fields (services, animals helped, areas served; owner, 24 Oct 2026): a proposal is the union of what the
 *   listing has and what was found, so a value is never dropped; when it adds something it is applied like a second
 *   phone (claimed, verified and low-confidence still wait for review).
 * - Identity unresolved (owner, 24 Oct 2026): while an editor has ticked it on the listing (it is not known which
 *   organisation the listing is), the queue leaves the listing out and its proposals are dropped.
 *
 * REST (Editor's Application Password, like the ingest):
 *   GET  aw/v1/enrich/queue    the next listings to check (new or claimed first, then the rest, then any not checked
 *                              for 90 days; a site may add its own steps), with what they hold now.
 *   POST aw/v1/enrich/results  one listing's findings; the site applies the rules above.
 *   GET  aw/v1/enrich/config   which sources are switched on, and Google spend this month.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const AW_ENRICH_DB_VERSION = '1';

/** How many days a check stays fresh before the listing is checked again. */
const AW_ENRICH_REFRESH_DAYS = 90;

/**
 * The sources: key => [name, host for the icon, on by default, what it gives].
 * A new source is one module in the worker and one row here.
 */
function sourceweb_enrich_sources() {
	$sources = array(
		'claim'         => array( 'The organisation (claim)', '', true, 'Values the organisation sent with the claim or update form (highest trust)' ),
		'website'       => array( 'The organisation\'s website', '', true, 'Home, contact, about, donate, volunteer and adopt pages (up to 8)' ),
		'social'        => array( 'Instagram / Facebook', 'instagram.com', true, 'Public page: bio, contact, followers, posts, last post' ),
		'osm'           => array( 'OpenStreetMap', 'openstreetmap.org', true, 'Coordinates and tagged hours (ODbL)' ),
		'wikidata'      => array( 'Wikidata', 'wikidata.org', true, 'Larger organisations: founded, website, social profiles' ),
		'listing'       => array( 'The listing\'s own details', '', true, 'Clean-up pass: the address, PIN code and place already on the listing, and same-name listings in the same district' ),
		'india_post'    => array( 'India Post (PIN codes)', 'postalpincode.in', true, 'Clean-up pass: the district and state of the listing\'s own PIN code' ),
		'google_places' => array( 'Google Maps', 'google.com', true, 'Locator and check only: place ID, Maps link and website lead are kept' ),
	);
	// Filter sourceweb_enrich_sources: a site adds (or changes) the sources of its own, key => same row shape as above.
	$filtered = apply_filters( 'sourceweb_enrich_sources', $sources );
	return is_array( $filtered ) ? $filtered : $sources;
}

/** Switched-on sources (Sourcing → Directory enrichment). */
function sourceweb_enrich_sources_on() {
	$saved = get_option( 'aw_enrich_sources' );
	$out   = array();
	foreach ( sourceweb_enrich_sources() as $k => $s ) {
		$out[ $k ] = is_array( $saved ) && array_key_exists( $k, $saved ) ? (bool) $saved[ $k ] : $s[2];
	}
	return $out;
}

/**
 * The fields: key => [label, where it is kept, group]. "Where" is a meta key, or one of the special stores:
 * phones (the Phone numbers list), hours (Opening hours by day), services (service tags), excerpt (the short bio),
 * logo (featured image), photos (aw_gallery, sideloaded).
 */
function sourceweb_enrich_fields() {
	$fields = array(
		'phone'          => array( 'Phone', 'phones', 'Contact' ),
		'whatsapp'       => array( 'WhatsApp', 'phones', 'Contact' ),
		'emergency'      => array( 'Emergency / ambulance', 'phones', 'Contact' ),
		'email'          => array( 'Email', 'aw_email', 'Contact' ),
		'website'        => array( 'Website', 'aw_website', 'Contact' ),
		'address'        => array( 'Full address', 'aw_address', 'Location' ),
		'pincode'        => array( 'PIN code', 'aw_pincode', 'Location' ),
		'lat'            => array( 'Latitude', 'aw_lat', 'Location' ),
		'lng'            => array( 'Longitude', 'aw_lng', 'Location' ),
		'maps_url'       => array( 'Google Maps link', 'aw_maps_url', 'Location' ),
		'place_id'       => array( 'Google place ID', 'aw_place_id', 'Location' ),
		'hours'          => array( 'Opening hours', 'hours', 'Hours' ),
		'logo'           => array( 'Logo', 'logo', 'Identity' ),
		'photos'         => array( 'Photos', 'photos', 'Identity' ),
		'description'    => array( 'About (short bio)', 'excerpt', 'Identity' ),
		'founded'        => array( 'Year established', 'aw_founded', 'Identity' ),
		'reg_type'       => array( 'Registered as', 'aw_reg_type', 'Legal' ),
		'registration'   => array( 'Registration number', 'aw_registration', 'Legal' ),
		'reg_80g'        => array( '80G', 'aw_reg_80g', 'Legal' ),
		'reg_12a'        => array( '12A', 'aw_reg_12a', 'Legal' ),
		'fcra'           => array( 'FCRA', 'aw_fcra', 'Legal' ),
		'services'       => array( 'Services', 'services', 'Work' ),
		'animals'        => array( 'Animals helped', 'aw_animals', 'Work' ),
		'areas_served'   => array( 'Areas served', 'aw_areas_served', 'Work' ),
		'donate_url'     => array( 'Donate link', 'aw_donate_url', 'Action links' ),
		'upi'            => array( 'UPI ID', 'aw_upi', 'Action links' ),
		'volunteer_url'  => array( 'Volunteer link', 'aw_volunteer_url', 'Action links' ),
		'adopt_url'      => array( 'Adopt link', 'aw_adopt_url', 'Action links' ),
		'instagram'      => array( 'Instagram', 'aw_instagram', 'Social' ),
		'facebook'       => array( 'Facebook', 'aw_facebook', 'Social' ),
		'x'              => array( 'X', 'aw_x', 'Social' ),
		'youtube'        => array( 'YouTube', 'aw_youtube', 'Social' ),
		'linkedin'       => array( 'LinkedIn', 'aw_linkedin', 'Social' ),
		'ig_followers'   => array( 'Instagram followers', 'aw_ig_followers', 'Social' ),
		'ig_posts'       => array( 'Instagram posts', 'aw_ig_posts', 'Social' ),
		'last_post'      => array( 'Last post', 'aw_last_post', 'Social' ),
		'head'           => array( 'Founder / key contact', 'aw_head', 'People' ),
		'wikidata'       => array( 'Wikidata ID', 'aw_wikidata', 'Signals' ),
		'closed'         => array( 'Reported closed', 'aw_reported_closed', 'Signals' ),
		'place'          => array( 'State and district', 'place', 'Location' ),
		'merge_into'     => array( 'Duplicate: merge into', 'merge', 'Identity' ),
	);
	// Filter sourceweb_enrich_fields: a site adds the fields its own sources fill, key => [label, store, group].
	$filtered = apply_filters( 'sourceweb_enrich_fields', $fields );
	return is_array( $filtered ) ? $filtered : $fields;
}

/** The table. */
function sourceweb_enrich_table() {
	global $wpdb;
	return $wpdb->prefix . 'aw_enrich';
}

/** Create or update the table (once per version). */
function sourceweb_enrich_install() {
	if ( get_option( 'aw_enrich_db' ) === AW_ENRICH_DB_VERSION ) {
		return;
	}
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$t = sourceweb_enrich_table();
	dbDelta(
		"CREATE TABLE {$t} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		listing_id bigint(20) unsigned NOT NULL,
		field varchar(40) NOT NULL,
		value longtext NOT NULL,
		old_value longtext NOT NULL,
		sources longtext NOT NULL,
		confidence varchar(8) NOT NULL DEFAULT '',
		status varchar(14) NOT NULL DEFAULT 'pending',
		note varchar(190) NOT NULL DEFAULT '',
		run varchar(40) NOT NULL DEFAULT '',
		created datetime NOT NULL,
		decided_at datetime NULL,
		decided_by bigint(20) unsigned NOT NULL DEFAULT 0,
		PRIMARY KEY  (id),
		KEY listing_field (listing_id, field),
		KEY status (status)
		) {$wpdb->get_charset_collate()};"
	);
	update_option( 'aw_enrich_db', AW_ENRICH_DB_VERSION, false );
}
add_action( 'admin_init', 'sourceweb_enrich_install' );
add_action( 'rest_api_init', 'sourceweb_enrich_install', 1 );

/** New fields on listings (registered like the others in meta.php: shown in REST, edited by editors). */
add_action(
	'init',
	function () {
		$listing_type = sourceweb_type( 'listing' );
		if ( '' === $listing_type ) {
			return; // no listing type on this site
		}
		$new = array(
			'aw_address'       => 'Full address (from the organisation or a named source)',
			'aw_reg_type'      => 'Registered as (Trust, Society, Section 8 company)',
			'aw_fcra'          => 'FCRA registration number',
			'aw_areas_served'  => 'Areas served (comma separated)',
			'aw_upi'           => 'UPI ID for donations',
			'aw_adopt_url'     => 'Adopt link',
			'aw_linkedin'      => 'LinkedIn',
			'aw_ig_followers'  => 'Instagram followers',
			'aw_ig_posts'      => 'Instagram posts',
			'aw_last_post'     => 'Date of the latest social post (Y-m-d)',
			'aw_wikidata'      => 'Wikidata ID (Q…)',
		);
		foreach ( $new as $key => $desc ) {
			register_post_meta(
				$listing_type,
				$key,
				array(
					'type'              => 'string',
					'description'       => $desc,
					'single'            => true,
					'show_in_rest'      => true,
					'sanitize_callback' => fn( $v ) => sourceweb_enrich_sanitize( $key, $v ),
					'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
				)
			);
		}
	}
);

/** Clean one value for its meta key. */
function sourceweb_enrich_sanitize( $key, $v ) {
	if ( in_array( $key, array( 'aw_adopt_url', 'aw_linkedin' ), true ) ) {
		return esc_url_raw( (string) $v );
	}
	if ( in_array( $key, array( 'aw_ig_followers', 'aw_ig_posts' ), true ) ) {
		return ctype_digit( trim( (string) $v ) ) ? trim( (string) $v ) : '';
	}
	if ( 'aw_last_post' === $key ) {
		return preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $v ) ? (string) $v : '';
	}
	if ( 'aw_wikidata' === $key ) {
		return preg_match( '/^Q\d+$/', trim( (string) $v ) ) ? trim( (string) $v ) : '';
	}
	if ( 'aw_upi' === $key ) {
		return preg_match( '/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/', trim( (string) $v ) ) ? trim( (string) $v ) : '';
	}
	return function_exists( 'aw_sanitize_meta' ) ? aw_sanitize_meta( $v, $key ) : sanitize_text_field( (string) $v );
}

/* ---------- Reading and writing a field ---------- */

/**
 * What a listing holds now for a field (string, or a list for hours / services / photos).
 *
 * @param int    $lid   Listing ID.
 * @param string $field Field key.
 * @return mixed
 */
function sourceweb_enrich_current( $lid, $field ) {
	$def = sourceweb_enrich_fields_all()[ $field ] ?? null;
	if ( ! $def ) {
		return '';
	}
	switch ( $def[1] ) {
		case 'phones':
			$rows = function_exists( 'directoryweb_listing_phones' ) ? directoryweb_listing_phones( $lid ) : array();
			if ( 'whatsapp' === $field ) {
				return implode( ', ', wp_list_pluck( array_filter( $rows, fn( $r ) => $r['whatsapp'] ), 'number' ) );
			}
			if ( 'emergency' === $field ) {
				return implode( ', ', wp_list_pluck( array_filter( $rows, fn( $r ) => 'Emergency' === $r['label'] ), 'number' ) );
			}
			return implode( ', ', wp_list_pluck( $rows, 'number' ) );
		case 'hours':
			return function_exists( 'directoryweb_listing_hours' ) ? directoryweb_listing_hours( $lid ) : '';
		case 'services':
			return ( function_exists( 'directoryweb_item_tags' ) && function_exists( 'directoryweb_service_slugs' ) ) ? wp_list_pluck( directoryweb_item_tags( $lid, directoryweb_service_slugs() ), 'slug' ) : array();
		case 'excerpt':
			return (string) get_post_field( 'post_excerpt', $lid );
		case 'logo':
			$t = (int) get_post_thumbnail_id( $lid );
			return $t ? (string) wp_get_attachment_url( $t ) : '';
		case 'photos':
			return array_values( array_filter( array_map( fn( $p ) => (string) wp_get_attachment_url( (int) $p ), array_filter( explode( ',', (string) get_post_meta( $lid, 'aw_gallery', true ) ) ) ) ) );
		case 'place':
			return sourceweb_enrich_place_current( $lid );
		case 'merge':
			return (int) get_post_meta( $lid, 'aw_merged_into', true ) ? (int) get_post_meta( $lid, 'aw_merged_into', true ) : '';
		default:
			return (string) get_post_meta( $lid, $def[1], true );
	}
}

/**
 * Fields only an approved claim writes (animal-writes-core claims-review.php, owner 31 Oct 2026): field => [label, store,
 * group]. Kept out of sourceweb_enrich_fields_all() so the workers are never asked for them; used for the change log's
 * snapshot, Undo and labels.
 */
function sourceweb_enrich_claim_fields() {
	$fields = array(
		'area'            => array( 'Area or landmark', 'aw_area', 'Location' ),
		'about'           => array( 'About', 'content', 'Identity' ),
		'aliases'         => array( 'Also known as', 'aw_aliases', 'Identity' ),
		'languages'       => array( 'Languages', 'aw_languages', 'Work' ),
		'reg_authority'   => array( 'Registration authority', 'aw_reg_authority', 'Legal' ),
		'reg_act'         => array( 'Registration act', 'aw_reg_act', 'Legal' ),
		'reg_date'        => array( 'Date of registration', 'aw_reg_date', 'Legal' ),
	);
	// Filter sourceweb_enrich_claim_fields: a site adds the claim-only fields of its own, key => [label, store, group].
	$filtered = apply_filters( 'sourceweb_enrich_claim_fields', $fields );
	return is_array( $filtered ) ? $filtered : $fields;
}

/** A field's definition for the change log: the enrichment fields, then the claim-only fields. */
function sourceweb_enrich_field_def( $field ) {
	return sourceweb_enrich_fields_all()[ $field ] ?? ( sourceweb_enrich_claim_fields()[ $field ] ?? array( '', '' ) );
}

/** Raw state of the store a field lives in, for undo. */
function sourceweb_enrich_snapshot( $lid, $field ) {
	$def = sourceweb_enrich_field_def( $field );
	switch ( $def[1] ) {
		case '':
			return ''; // an unknown field: nothing to keep
		case 'content':
			return (string) get_post_field( 'post_content', $lid );
		case 'phones':
			return array( 'rows' => function_exists( 'directoryweb_listing_phones' ) ? directoryweb_listing_phones( $lid ) : array(), 'unv' => directoryweb_unverified_list( $lid ) );
		case 'hours':
			return function_exists( 'directoryweb_listing_hours' ) ? directoryweb_listing_hours( $lid ) : array();
		case 'services':
			return sourceweb_enrich_current( $lid, $field );
		case 'excerpt':
			return (string) get_post_field( 'post_excerpt', $lid );
		case 'logo':
			return (int) get_post_thumbnail_id( $lid );
		case 'photos':
			return (string) get_post_meta( $lid, 'aw_gallery', true );
		case 'place':
			list( $states, $districts ) = directoryweb_item_codes( $lid );
			return array( 'states' => $states, 'districts' => $districts );
		case 'merge':
			return '';
		default:
			if ( isset( AW_ENRICH_ALT[ $field ] ) ) {
				return array( 'v' => (string) get_post_meta( $lid, $def[1], true ), 'alt' => (string) get_post_meta( $lid, AW_ENRICH_ALT[ $field ], true ), 'unv' => directoryweb_unverified_list( $lid ) );
			}
			return (string) get_post_meta( $lid, $def[1], true );
	}
}

/** Put a snapshot back (undo). */
function sourceweb_enrich_restore( $lid, $field, $snap ) {
	$def = sourceweb_enrich_field_def( $field );
	switch ( $def[1] ) {
		case '':
			return; // an unknown field: nothing to put back
		case 'content':
			wp_update_post( array( 'ID' => $lid, 'post_content' => (string) $snap ) );
			break;
		case 'phones':
			$rows = isset( $snap['rows'] ) ? (array) $snap['rows'] : (array) $snap; // older rows kept the list alone
			if ( function_exists( 'directoryweb_set_listing_list' ) ) {
				directoryweb_set_listing_list( $lid, 'aw_phones', $rows );
			}
			if ( isset( $snap['unv'] ) ) {
				$snap['unv'] ? update_post_meta( $lid, 'aw_unverified', array_values( (array) $snap['unv'] ) ) : delete_post_meta( $lid, 'aw_unverified' );
			}
			break;
		case 'hours':
			if ( function_exists( 'directoryweb_set_listing_list' ) ) {
				directoryweb_set_listing_list( $lid, 'aw_opening_hours', (array) $snap );
			}
			break;
		case 'services':
			if ( function_exists( 'directoryweb_set_item_tags' ) && function_exists( 'directoryweb_service_slugs' ) ) {
				directoryweb_set_item_tags( $lid, (array) $snap, directoryweb_service_slugs() );
			}
			break;
		case 'excerpt':
			wp_update_post( array( 'ID' => $lid, 'post_excerpt' => (string) $snap ) );
			break;
		case 'logo':
			(int) $snap ? set_post_thumbnail( $lid, (int) $snap ) : delete_post_thumbnail( $lid );
			break;
		case 'photos':
			'' === (string) $snap ? delete_post_meta( $lid, 'aw_gallery' ) : update_post_meta( $lid, 'aw_gallery', (string) $snap );
			break;
		case 'place':
			sourceweb_enrich_place_restore( $lid, (array) $snap );
			break;
		case 'merge':
			break; // a merge is undone by sourceweb_enrich_unmerge()
		default:
			if ( is_array( $snap ) && isset( $snap['v'] ) ) { // a field that can hold a second value
				'' === $snap['v'] ? delete_post_meta( $lid, $def[1] ) : update_post_meta( $lid, $def[1], $snap['v'] );
				'' === $snap['alt'] ? delete_post_meta( $lid, AW_ENRICH_ALT[ $field ] ) : update_post_meta( $lid, AW_ENRICH_ALT[ $field ], $snap['alt'] );
				$snap['unv'] ? update_post_meta( $lid, 'aw_unverified', array_values( (array) $snap['unv'] ) ) : delete_post_meta( $lid, 'aw_unverified' );
				break;
			}
			'' === (string) $snap ? delete_post_meta( $lid, $def[1] ) : update_post_meta( $lid, $def[1], $snap );
	}
	sourceweb_enrich_after_change( $lid );
}

/**
 * Write a proposed value onto the listing. Returns false when the value cannot be used.
 *
 * @param int    $lid   Listing ID.
 * @param string $field Field key.
 * @param mixed  $value   Value (string; list for hours, services, photos).
 * @param string $mode    apply or both (sourceweb_enrich_mode()).
 * @param array  $sources The row's sources: a picture is fetched with the page it was found on as the Referer.
 * @return bool
 */
function sourceweb_enrich_write( $lid, $field, $value, $mode = 'apply', $sources = array() ) {
	$def = sourceweb_enrich_fields_all()[ $field ] ?? null;
	if ( ! $def ) {
		return false;
	}
	$name = get_the_title( $lid );
	$page = sourceweb_enrich_source_page( $sources );
	switch ( $def[1] ) {
		case 'phones':
			$num  = trim( sanitize_text_field( (string) $value ) );
			$rows = function_exists( 'directoryweb_listing_phones' ) ? directoryweb_listing_phones( $lid ) : array();
			$norm = fn( $n ) => substr( preg_replace( '/\D+/', '', $n ), -10 );
			$hit  = null;
			foreach ( $rows as $i => $r ) {
				if ( $norm( $r['number'] ) === $norm( $num ) ) {
					$hit = $i;
				}
			}
			if ( '' === $num || strlen( $norm( $num ) ) < 6 ) {
				return false;
			}
			if ( null === $hit ) {
				if ( 'both' === $mode && $rows ) { // another number is already there: both are shown as unverified
					directoryweb_unverified_add( $lid, array_merge( wp_list_pluck( $rows, 'number' ), array( $num ) ) );
				}
				$rows[] = array( 'number' => $num, 'label' => 'emergency' === $field ? 'Emergency' : '', 'whatsapp' => 'whatsapp' === $field );
			} elseif ( 'whatsapp' === $field ) {
				$rows[ $hit ]['whatsapp'] = true;
			} elseif ( 'emergency' === $field && '' === $rows[ $hit ]['label'] ) {
				$rows[ $hit ]['label'] = 'Emergency';
			}
			if ( function_exists( 'directoryweb_set_listing_list' ) ) {
				directoryweb_set_listing_list( $lid, 'aw_phones', $rows );
			}
			break;
		case 'hours':
			$rows = array();
			foreach ( (array) $value as $r ) {
				if ( isset( $r['day'] ) && in_array( $r['day'], SOURCEWEB_WEEKDAYS, true ) ) {
					$rows[] = array( 'day' => $r['day'], 'open' => (string) ( $r['open'] ?? '' ), 'close' => (string) ( $r['close'] ?? '' ), 'closed' => ! empty( $r['closed'] ) );
				}
			}
			if ( ! $rows ) {
				return false;
			}
			if ( function_exists( 'directoryweb_set_listing_list' ) ) {
				directoryweb_set_listing_list( $lid, 'aw_opening_hours', $rows );
			}
			break;
		case 'services':
			$slugs = sourceweb_enrich_services_norm( $value )[0];
			if ( ! $slugs ) {
				return false;
			}
			if ( function_exists( 'directoryweb_set_item_tags' ) && function_exists( 'directoryweb_service_slugs' ) ) {
				directoryweb_set_item_tags( $lid, $slugs, directoryweb_service_slugs() );
			}
			update_post_meta( $lid, 'aw_services_source', 'the organisation\'s own pages' );
			update_post_meta( $lid, 'aw_services_on', wp_date( 'Y-m-d' ) );
			break;
		case 'excerpt':
			wp_update_post( array( 'ID' => $lid, 'post_excerpt' => sanitize_textarea_field( (string) $value ) ) );
			break;
		case 'logo':
			$att = sourceweb_enrich_sideload( (string) $value, $lid, $name . ' logo', $page );
			if ( ! $att ) {
				return false;
			}
			set_post_thumbnail( $lid, $att );
			break;
		case 'photos':
			$ids = array();
			foreach ( array_slice( (array) $value, 0, 6 ) as $url ) {
				$att = sourceweb_enrich_sideload( (string) $url, $lid, $name, $page );
				if ( $att ) {
					$ids[] = $att;
				}
			}
			if ( ! $ids ) {
				return false;
			}
			update_post_meta( $lid, 'aw_gallery', implode( ',', $ids ) );
			break;
		case 'place':
			if ( ! sourceweb_enrich_place_write( $lid, $value ) ) {
				return false;
			}
			break;
		case 'merge':
			return false; // never written as a value: an approved merge runs sourceweb_enrich_merge()
		default:
			$v = isset( $def[3] ) // a listing field from the field group (phase 3): cleaned by its ACF type
				? sourceweb_enrich_acf_value( $def[3], is_array( $value ) ? implode( ', ', $value ) : (string) $value )
				: sourceweb_enrich_sanitize( $def[1], is_array( $value ) ? implode( ', ', $value ) : (string) $value );
			if ( '' === $v ) {
				return false;
			}
			if ( 'both' === $mode && isset( AW_ENRICH_ALT[ $field ] ) ) { // keep the value already there, add this one next to it
				$now = (string) get_post_meta( $lid, $def[1], true );
				update_post_meta( $lid, AW_ENRICH_ALT[ $field ], $v );
				directoryweb_unverified_add( $lid, array( $now, $v ) );
				break;
			}
			update_post_meta( $lid, $def[1], $v );
	}
	sourceweb_enrich_after_change( $lid );
	return true;
}

/**
 * The page a value was found on: the first source address that is not Google's (Google Maps is never where a picture
 * is published). '' when none.
 *
 * @param array $sources Row sources ({key, name, url, fetched_at} each).
 * @return string
 */
function sourceweb_enrich_source_page( $sources ) {
	foreach ( (array) $sources as $s ) {
		if ( ! is_array( $s ) ) {
			continue;
		}
		$u = (string) ( $s['url'] ?? '' );
		if ( 'google_places' !== ( $s['key'] ?? '' ) && preg_match( '#^https?://#i', $u ) ) {
			return esc_url_raw( $u );
		}
	}
	return '';
}

/**
 * Download a picture as a browser opening it from the page it is on would (owner, 25 Oct 2026): a normal browser
 * User-Agent and that page as the Referer, because some sites (smptindia.org, swordodisha, vardodisha) refuse other
 * requests with 403. Nothing else is changed: the same download as before (sourceweb_source_download: wp_safe_remote_get,
 * redirects, 20 s, 15 MB), then the type and size checks in sourceweb_enrich_sideload. Returns a temporary file or WP_Error.
 *
 * @param string $url     Picture address.
 * @param string $referer Page the picture was found on ('' for none).
 * @return string|WP_Error
 */
function sourceweb_enrich_download( $url, $referer = '' ) {
	$headers = array( 'Accept' => 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5' );
	if ( '' !== $referer ) {
		$headers['Referer'] = $referer;
	}
	return sourceweb_source_download( $url, 20, 15 * MB_IN_BYTES, $headers, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' ); // cc0-images.php
}

/**
 * A picture from a public page into the Media Library (alt = the organisation's name).
 *
 * @param string $url     Picture address.
 * @param int    $lid     Listing ID.
 * @param string $alt     Alt text.
 * @param string $referer Page the picture was found on (sent as the Referer).
 * @return int Attachment ID, or 0.
 */
function sourceweb_enrich_sideload( $url, $lid, $alt, $referer = '' ) {
	if ( ! preg_match( '#^https?://#i', $url ) ) { // http too: the picture is copied into Media, never linked
		return 0;
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	$tmp = sourceweb_enrich_download( $url, $referer ); // core download_url() fails fatally on a doubled content-type
	if ( is_wp_error( $tmp ) ) {
		return 0;
	}
	$type = wp_get_image_mime( $tmp );
	$ext  = array( 'image/png' => 'png', 'image/jpeg' => 'jpg', 'image/webp' => 'webp', 'image/gif' => 'gif' )[ $type ] ?? '';
	if ( ! $ext || filesize( $tmp ) < 2000 ) {
		wp_delete_file( $tmp );
		return 0;
	}
	// No picture is used by two items (deploy check, owner 9 Oct 2026): one that another item already uses is not taken
	// (the same organisation often has two listings; the first keeps the picture).
	$hash = (string) md5_file( $tmp );
	global $wpdb;
	foreach ( $wpdb->get_col( $wpdb->prepare( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'aw_md5' AND meta_value = %s LIMIT 10", $hash ) ) as $used ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$inuse = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->postmeta} pm JOIN {$wpdb->posts} p ON p.ID = pm.post_id AND p.post_status = 'publish' WHERE ( pm.meta_key = '_thumbnail_id' AND pm.meta_value = %s ) OR ( pm.meta_key = 'aw_gallery' AND FIND_IN_SET( %s, pm.meta_value ) )", (string) $used, (string) $used ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		if ( $inuse ) {
			wp_delete_file( $tmp );
			return 0;
		}
	}
	$id = media_handle_sideload( array( 'name' => sanitize_title( $alt ) . '.' . $ext, 'tmp_name' => $tmp ), $lid, $alt );
	if ( is_wp_error( $id ) ) {
		return 0;
	}
	update_post_meta( $id, '_wp_attachment_image_alt', $alt );
	update_post_meta( $id, 'aw_md5', $hash );
	update_post_meta( $id, '_aw_source_url', esc_url_raw( $url ) ); // where the picture came from
	return (int) $id;
}

/** After a listing changes: its page cache. */
function sourceweb_enrich_after_change( $lid ) {
	clean_post_cache( $lid );
	do_action( 'litespeed_purge_post', $lid );
	do_action( 'aw_enrich_changed', $lid ); // autoresolve.php: a PIN in the address fills an empty PIN field
}

/** Values compared loosely: phones by the last 10 digits, links without scheme / www / slash, text lower-case. */
function sourceweb_enrich_norm( $field, $v ) {
	if ( is_array( $v ) ) {
		$v = wp_json_encode( $v );
	}
	$v = strtolower( trim( (string) $v ) );
	if ( in_array( $field, array( 'phone', 'whatsapp', 'emergency' ), true ) ) {
		return substr( preg_replace( '/\D+/', '', $v ), -10 );
	}
	if ( preg_match( '#^https?://#', $v ) ) {
		return rtrim( preg_replace( '#^https?://(www\.|m\.)?#', '', $v ), '/' );
	}
	return preg_replace( '/[\s,.]+/', ' ', $v );
}

/** Whether a listing already holds this value (for phones: any of its numbers). */
function sourceweb_enrich_has_value( $lid, $field, $value ) {
	if ( 'place' === $field ) {
		return sourceweb_enrich_place_held( $lid, $value );
	}
	$now = sourceweb_enrich_current( $lid, $field );
	if ( in_array( $field, array( 'phone', 'whatsapp', 'emergency' ), true ) ) {
		$want = sourceweb_enrich_norm( $field, $value );
		foreach ( explode( ',', (string) $now ) as $n ) {
			if ( '' !== $want && sourceweb_enrich_norm( $field, $n ) === $want ) {
				return true;
			}
		}
		return false;
	}
	if ( 'services' === $field ) {
		return ! array_diff( (array) $value, (array) $now );
	}
	if ( 'photos' === $field || 'logo' === $field ) {
		return ! empty( $now ); // never replaced automatically; a reviewer decides
	}
	if ( 'hours' === $field ) {
		return wp_json_encode( sourceweb_enrich_hours_key( (array) $now ) ) === wp_json_encode( sourceweb_enrich_hours_key( (array) $value ) );
	}
	return sourceweb_enrich_norm( $field, $now ) === sourceweb_enrich_norm( $field, $value );
}

/** Hours rows reduced to day => "open-close" for comparing. */
function sourceweb_enrich_hours_key( $rows ) {
	$out = array();
	foreach ( $rows as $r ) {
		$out[ $r['day'] ?? '' ] = ! empty( $r['closed'] ) ? 'closed' : ( $r['open'] ?? '' ) . '-' . ( $r['close'] ?? '' );
	}
	ksort( $out );
	return $out;
}

/** Whether a field is empty on the listing. */
function sourceweb_enrich_is_empty( $lid, $field ) {
	if ( 'place' === $field ) {
		return ! directoryweb_item_codes( $lid )[1]; // a state without a district is a place still to fill
	}
	if ( in_array( $field, array( 'whatsapp', 'emergency' ), true ) ) {
		return true; // adding a marked number never removes one
	}
	$now = sourceweb_enrich_current( $lid, $field );
	return is_array( $now ) ? ! $now : '' === trim( (string) $now );
}

/** Claimed (an approved claim) or verified listings are never changed by the worker. */
function sourceweb_enrich_is_protected( $lid ) {
	if ( get_post_meta( $lid, 'aw_verified', true ) ) {
		return true;
	}
	global $wpdb;
	return (bool) $wpdb->get_var( $wpdb->prepare( "SELECT 1 FROM {$wpdb->postmeta} a JOIN {$wpdb->postmeta} s ON s.post_id = a.post_id AND s.meta_key = 'aw_c_status' AND s.meta_value = 'approved' WHERE a.meta_key = 'aw_c_listing' AND a.meta_value = %d LIMIT 1", $lid ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
}

/* ---------- Owner's rule (21 Oct 2026): fill empty fields with sourced values; keep both when a value is already there ---------- */

/**
 * The change-log note of a value kept next to what was there.
 *
 * @param string $field Field key.
 * @return string
 */
function sourceweb_enrich_both_note( $field ) {
	return in_array( $field, AW_ENRICH_LIST_FIELDS, true ) ? 'Added to what was there; nothing removed' : 'Kept next to the value already there; both shown as unverified';
}

/** Fields that can hold a second value next to the one already on the listing: field => meta key of the second value. */
const AW_ENRICH_ALT = array( 'email' => 'aw_email_alt', 'website' => 'aw_website_alt' );

/**
 * What to do with a sourced value: 'apply' (the field is empty), 'both' (phones, email, website, list fields: keep it
 * next to what is there, both unverified) or 'queue' (a reviewer decides: conflicting sources, claimed or verified
 * listings, and any other field that already has a value). Claimed, verified and low-confidence always wait; the rest
 * follows the field's apply rule (Rules → Directory enrichment → Field rules, phase 3; seeded from the rules that were
 * written here: closed and merge_into always to review, a merge being the owner's decision, 25 Oct 2026).
 */
function sourceweb_enrich_mode( $lid, $field, $conf, $protected, $value = null ) {
	return sourceweb_enrich_mode_decide(
		$field,
		(string) sourceweb_enrich_field_rule( $field )['apply'],
		$conf,
		$protected,
		fn() => sourceweb_enrich_is_empty( $lid, $field ),
		fn() => (bool) ( function_exists( 'directoryweb_listing_phones' ) && directoryweb_listing_phones( $lid ) ),
		fn() => isset( AW_ENRICH_ALT[ $field ] ) && '' === trim( (string) get_post_meta( $lid, AW_ENRICH_ALT[ $field ], true ) ),
		fn() => sourceweb_enrich_place_fills( $lid, $value )
	);
}

/* ---------- Rows ---------- */

/** Whether a value holds a number on the never-publish list (DirectoryWeb's), at any depth. */
function sourceweb_enrich_never_publish( $value ) {
	$blocked = false;
	$vals    = (array) $value;
	array_walk_recursive(
		$vals,
		function ( $v ) use ( &$blocked ) {
			$blocked = $blocked || ( is_scalar( $v ) && function_exists( 'directoryweb_phone_never_publish' ) && directoryweb_phone_never_publish( $v ) );
		}
	);
	return $blocked;
}

/** Add a row. */
function sourceweb_enrich_add_row( $lid, $field, $value, $old, $sources, $confidence, $status, $run = '', $note = '' ) {
	global $wpdb;
	if ( sourceweb_enrich_never_publish( $value ) ) {
		return 0; // On the never-publish list: not proposed, not queued.
	}
	$wpdb->insert( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		sourceweb_enrich_table(),
		array(
			'listing_id' => $lid,
			'field'      => $field,
			'value'      => wp_json_encode( $value ),
			'old_value'  => wp_json_encode( $old ),
			'sources'    => wp_json_encode( array_values( (array) $sources ) ),
			'confidence' => $confidence,
			'status'     => $status,
			'note'       => substr( (string) $note, 0, 190 ),
			'run'        => substr( (string) $run, 0, 40 ),
			'created'    => current_time( 'mysql' ),
			'decided_at' => in_array( $status, array( 'auto-applied', 'approved', 'failed' ), true ) ? current_time( 'mysql' ) : null,
			'decided_by' => in_array( $status, array( 'approved', 'rejected' ), true ) ? get_current_user_id() : 0,
		)
	);
	return (int) $wpdb->insert_id;
}

/**
 * The note on a value that could not be written (25 Oct 2026): a picture that could not be copied from its source, or
 * a value the field cannot use. Such a row has status 'failed': it is logged, nothing to review, and it never stops the
 * same value being proposed again (only a person's rejection does, see sourceweb_enrich_rest_results()).
 *
 * @param string $field Field key.
 * @param bool   $auto  True for an automatic apply, false for a reviewer's Approve.
 * @return string
 */
function sourceweb_enrich_fail_note( $field, $auto ) {
	$why = in_array( $field, array( 'logo', 'photos' ), true ) ? 'the picture could not be copied from its source' : 'the value could not be used for this field';
	return 'Could not be applied ' . ( $auto ? 'automatically' : 'on approval' ) . ': ' . $why;
}

/** One row, decoded. */
function sourceweb_enrich_row( $id ) {
	global $wpdb;
	$r = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM %i WHERE id = %d', sourceweb_enrich_table(), $id ), ARRAY_A ); // phpcs:ignore WordPress.DB
	return $r ? sourceweb_enrich_decode( $r ) : null;
}

/** JSON columns to values. */
function sourceweb_enrich_decode( $r ) {
	foreach ( array( 'value', 'old_value', 'sources' ) as $k ) {
		$r[ $k ] = json_decode( (string) $r[ $k ], true );
	}
	return $r;
}

/** Set a row's status. */
function sourceweb_enrich_set_status( $id, $status, $note = null ) {
	global $wpdb;
	$data = array( 'status' => $status, 'decided_at' => current_time( 'mysql' ), 'decided_by' => get_current_user_id() );
	if ( null !== $note ) {
		$data['note'] = substr( (string) $note, 0, 190 );
	}
	$wpdb->update( sourceweb_enrich_table(), $data, array( 'id' => $id ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
}

/**
 * Approve a pending row: write it (old value kept for undo). The "Reported closed" row: approving keeps the listing out
 * of search with its note; rejecting clears both.
 */
function sourceweb_enrich_approve( $id ) {
	$r = sourceweb_enrich_row( $id );
	if ( ! $r || 'pending' !== $r['status'] ) {
		return false;
	}
	$lid = (int) $r['listing_id'];
	if ( 'closed' === $r['field'] ) {
		update_post_meta( $lid, 'aw_reported_closed', wp_date( 'Y-m-d' ) );
		sourceweb_enrich_set_status( $id, 'approved' );
		sourceweb_enrich_after_change( $lid );
		return true;
	}
	if ( 'merge_into' === $r['field'] ) {
		$done = sourceweb_enrich_merge( $lid, (int) $r['value'], $id );
		if ( is_string( $done ) ) {
			sourceweb_enrich_set_status( $id, 'rejected', 'Not merged: ' . $done );
			return false;
		}
		global $wpdb;
		$wpdb->update( sourceweb_enrich_table(), array( 'old_value' => wp_json_encode( $done ) ), array( 'id' => $id ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		sourceweb_enrich_set_status( $id, 'approved' );
		return true;
	}
	$snap = sourceweb_enrich_snapshot( $lid, $r['field'] );
	if ( ! sourceweb_enrich_write( $lid, $r['field'], $r['value'], 'apply', (array) $r['sources'] ) ) {
		sourceweb_enrich_set_status( $id, 'failed', sourceweb_enrich_fail_note( $r['field'], false ) );
		return false;
	}
	global $wpdb;
	$wpdb->update( sourceweb_enrich_table(), array( 'old_value' => wp_json_encode( $snap ) ), array( 'id' => $id ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	sourceweb_enrich_set_status( $id, 'approved' );
	sourceweb_enrich_supersede( $lid, $r['field'], $id );
	if ( is_scalar( $r['value'] ) ) {
		directoryweb_unverified_remove( $lid, $r['value'] ); // a person confirmed this value
	}
	return true;
}

/**
 * Reject a row: a person says no to this value for this listing and field, for good. A waiting row is turned down. An
 * applied row (auto-applied or approved) is undone first, so the value before it comes back; an undone row already has
 * its old value back. The row becomes 'rejected', and a later check never proposes or applies the same value for the
 * same listing and field again (sourceweb_enrich_rest_results()). An applied "Reported closed" row is not rejected (it follows
 * Google on every check; Undo it instead), and an applied row that a newer applied value already replaced is only
 * marked rejected, so the newer value stays.
 *
 * @param int $id Row ID.
 * @return bool False when the row is missing, already settled another way, or could not be undone.
 */
function sourceweb_enrich_reject( $id ) {
	$r = sourceweb_enrich_row( $id );
	if ( ! $r || ! in_array( $r['status'], array( 'pending', 'auto-applied', 'approved', 'undone' ), true ) ) {
		return false;
	}
	$was = (string) $r['status'];
	if ( 'closed' === $r['field'] && 'pending' !== $was ) {
		return false; // "Reported closed" follows Google on every check, not the rows: Undo it instead.
	}
	if ( in_array( $was, array( 'auto-applied', 'approved' ), true ) ) {
		global $wpdb;
		// A newer applied value for the same field has already replaced this one: undoing this row would put back what
		// was there before it, over the newer value. Then the row is only marked rejected.
		$newer = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM %i WHERE listing_id = %d AND field = %s AND id > %d AND status IN ('auto-applied','approved') LIMIT 1", sourceweb_enrich_table(), (int) $r['listing_id'], $r['field'], (int) $id ) ); // phpcs:ignore WordPress.DB
		if ( ! $newer && ! sourceweb_enrich_undo( $id ) ) {
			return false;
		}
	}
	if ( 'pending' === $was && 'closed' === $r['field'] ) {
		delete_post_meta( (int) $r['listing_id'], 'aw_reported_closed' );
		sourceweb_enrich_flag( (int) $r['listing_id'], 'reported_closed', false );
	}
	// A row that had been applied keeps its note after a marker; the marker also keeps it clear of the "Could not be
	// applied" notes that the recheck does not count as a no.
	$note = 'pending' === $was ? null : trim( 'Rejected after it was applied. ' . (string) $r['note'] );
	sourceweb_enrich_set_status( $id, 'rejected', $note );
	return true;
}

/** Undo an applied row: the value before it goes back. */
function sourceweb_enrich_undo( $id ) {
	$r = sourceweb_enrich_row( $id );
	if ( ! $r || ! in_array( $r['status'], array( 'auto-applied', 'approved' ), true ) ) {
		return false;
	}
	if ( 'closed' === $r['field'] ) {
		delete_post_meta( (int) $r['listing_id'], 'aw_reported_closed' );
		sourceweb_enrich_flag( (int) $r['listing_id'], 'reported_closed', false );
	} elseif ( 'merge_into' === $r['field'] ) {
		sourceweb_enrich_unmerge( (int) $r['listing_id'], (array) $r['old_value'] );
	} else {
		sourceweb_enrich_restore( (int) $r['listing_id'], $r['field'], $r['old_value'] );
	}
	sourceweb_enrich_set_status( $id, 'undone' );
	return true;
}

/** Older pending rows for the same field are settled by a newer decision. */
function sourceweb_enrich_supersede( $lid, $field, $except ) {
	global $wpdb;
	$wpdb->query( $wpdb->prepare( "UPDATE %i SET status = 'superseded' WHERE listing_id = %d AND field = %s AND status = 'pending' AND id <> %d", sourceweb_enrich_table(), $lid, $field, $except ) ); // phpcs:ignore WordPress.DB
}

/**
 * Where a listing's field came from: the latest applied row's sources ([] when the worker never set it).
 *
 * @return array{sources: array, confidence: string, at: string, status: string}|null
 */
function sourceweb_enrich_provenance( $lid, $field ) {
	static $cache = array();
	if ( ! isset( $cache[ $lid ] ) ) {
		global $wpdb;
		$cache[ $lid ] = array();
		if ( get_option( 'aw_enrich_db' ) ) {
			$rows = $wpdb->get_results( $wpdb->prepare( "SELECT field, sources, confidence, status, created FROM %i WHERE listing_id = %d AND status IN ('auto-applied','approved') ORDER BY id ASC", sourceweb_enrich_table(), $lid ), ARRAY_A ); // phpcs:ignore WordPress.DB
			foreach ( $rows as $r ) {
				$cache[ $lid ][ $r['field'] ] = array( 'sources' => (array) json_decode( $r['sources'], true ), 'confidence' => $r['confidence'], 'at' => $r['created'], 'status' => $r['status'] );
			}
		}
	}
	return $cache[ $lid ][ $field ] ?? null;
}

/** Every source key behind a listing's applied values. */
function sourceweb_enrich_listing_source_keys( $lid ) {
	global $wpdb;
	if ( ! get_option( 'aw_enrich_db' ) ) {
		return array();
	}
	$keys = array();
	foreach ( $wpdb->get_col( $wpdb->prepare( "SELECT sources FROM %i WHERE listing_id = %d AND status IN ('auto-applied','approved')", sourceweb_enrich_table(), $lid ) ) as $s ) { // phpcs:ignore WordPress.DB
		foreach ( (array) json_decode( $s, true ) as $src ) {
			$k = (string) ( $src['key'] ?? '' );
			if ( $k && ! isset( $keys[ $k ] ) ) {
				$keys[ $k ] = $src;
			}
		}
	}
	return $keys;
}

/** Listing flags (Invite to claim, Reported closed, Possible duplicate): sourceweb_enrich_flags = [flag => detail]. */
function sourceweb_enrich_flags( $lid ) {
	$f = get_post_meta( $lid, 'aw_enrich_flags', true );
	return is_array( $f ) ? array_filter( $f ) : array();
}

/** Set or clear one flag. */
function sourceweb_enrich_flag( $lid, $flag, $detail ) {
	$f = sourceweb_enrich_flags( $lid );
	if ( false === $detail || null === $detail || array() === $detail ) {
		unset( $f[ $flag ] );
	} else {
		$f[ $flag ] = $detail;
	}
	$f ? update_post_meta( $lid, 'aw_enrich_flags', $f ) : delete_post_meta( $lid, 'aw_enrich_flags' );
}

/**
 * Whether an editor marked the listing's identity unresolved: then nothing is proposed for it.
 *
 * @param int $lid Listing ID.
 * @return bool
 */
function sourceweb_enrich_identity_unresolved( $lid ) {
	return ! empty( sourceweb_enrich_flags( $lid )['identity'] );
}

/** List fields: a proposal adds to what is there and never drops a value. */
const AW_ENRICH_LIST_FIELDS = array( 'services', 'animals', 'areas_served' );

/**
 * The items of a list field's value: an array (services) or comma-separated text.
 *
 * @param mixed $v Value.
 * @return array
 */
function sourceweb_enrich_list_items( $v ) {
	$items = is_array( $v ) ? $v : explode( ',', (string) $v );
	return array_values( array_filter( array_map( fn( $s ) => trim( (string) $s ), $items ), 'strlen' ) );
}

/**
 * Words the worker uses for a service that are not services on the site, and the service each one is stored as
 * (owner, 25 Oct 2026). "wildlife-rescue" and "emergency-rescue" are listing types, not services (directoryweb_service_slugs()).
 */
const AW_ENRICH_SERVICE_MAP = array(
	'wildlife-rescue'  => 'rescue',
	'emergency-rescue' => 'rescue',
);

/**
 * A services proposal as the site's service slugs: known ones kept, mapped ones (AW_ENRICH_SERVICE_MAP) replaced,
 * others dropped. Returns the slugs and a note for the change-log row naming what was mapped or dropped ('' if none).
 *
 * @param mixed $value Proposed services (list or comma-separated text).
 * @return array{0: string[], 1: string}
 */
function sourceweb_enrich_services_norm( $value ) {
	$known  = function_exists( 'directoryweb_service_slugs' ) ? directoryweb_service_slugs() : array();
	$out    = array();
	$mapped = array();
	$drop   = array();
	foreach ( sourceweb_enrich_list_items( $value ) as $item ) {
		$slug = sanitize_title( $item );
		if ( isset( AW_ENRICH_SERVICE_MAP[ $slug ] ) && in_array( AW_ENRICH_SERVICE_MAP[ $slug ], $known, true ) ) {
			$mapped[] = $slug . ' as ' . AW_ENRICH_SERVICE_MAP[ $slug ];
			$slug     = AW_ENRICH_SERVICE_MAP[ $slug ];
		} elseif ( ! in_array( $slug, $known, true ) ) {
			if ( '' !== $slug ) {
				$drop[] = $slug;
			}
			continue;
		}
		if ( ! in_array( $slug, $out, true ) ) {
			$out[] = $slug;
		}
	}
	$note = array();
	if ( $mapped ) {
		$note[] = 'Stored as site services: ' . implode( ', ', array_unique( $mapped ) );
	}
	if ( $drop ) {
		$note[] = 'Not services on the site, dropped: ' . implode( ', ', array_unique( $drop ) );
	}
	return array( $out, implode( '. ', $note ) );
}

/**
 * A list field's proposal as the union of what the listing holds and what was found (current order first, matched
 * case-insensitively), in the field's own shape. Returns the proposal unchanged for other fields or an empty listing.
 *
 * @param int    $lid   Listing ID.
 * @param string $field Field key.
 * @param mixed  $value Proposed value.
 * @return mixed
 */
function sourceweb_enrich_union( $lid, $field, $value ) {
	if ( ! in_array( $field, AW_ENRICH_LIST_FIELDS, true ) || sourceweb_enrich_is_empty( $lid, $field ) ) {
		return $value;
	}
	$out  = sourceweb_enrich_list_items( sourceweb_enrich_current( $lid, $field ) );
	$seen = array_map( 'strtolower', $out );
	foreach ( sourceweb_enrich_list_items( $value ) as $item ) {
		if ( 'services' === $field && ( ! function_exists( 'directoryweb_service_slugs' ) || ! in_array( sanitize_title( $item ), directoryweb_service_slugs(), true ) ) ) {
			continue; // Only known services are stored (sourceweb_enrich_write), so an unknown one adds nothing.
		}
		if ( ! in_array( strtolower( $item ), $seen, true ) ) {
			$out[]  = $item;
			$seen[] = strtolower( $item );
		}
	}
	return is_array( $value ) ? $out : implode( ', ', $out );
}

/* ---------- Claims are a source too ---------- */

// An approved claim's values are logged as approved rows from the organisation (provenance "claim"), before they apply.
add_action(
	'aw_claim_before_apply',
	function ( $lid, $proposed, $claim_id ) {
		sourceweb_enrich_install();
		$map = array( 'aw_phone' => 'phone', 'aw_whatsapp' => 'whatsapp', 'aw_email' => 'email', 'aw_website' => 'website', 'aw_services' => 'services' );
		delete_post_meta( $lid, 'aw_unverified' ); // the organisation has spoken: nothing on the listing is "unverified" any more
		delete_post_meta( $lid, 'aw_email_alt' );
		delete_post_meta( $lid, 'aw_website_alt' );
		$src = array( array( 'key' => 'claim', 'name' => 'The organisation (claim)', 'url' => '', 'fetched_at' => wp_date( 'c' ) ) );
		foreach ( (array) $proposed as $k => $v ) {
			if ( isset( $map[ $k ] ) && '' !== (string) $v ) {
				$field = $map[ $k ];
				$val   = 'services' === $field ? explode( ',', (string) $v ) : $v;
				sourceweb_enrich_add_row( $lid, $field, $val, sourceweb_enrich_snapshot( $lid, $field ), $src, 'high', 'approved', 'claim-' . $claim_id );
			}
		}
	},
	10,
	3
);

/* ---------- Spend (Google Places) ---------- */

/** Google spend this month (USD): the worker's calls plus the live block's. */
function sourceweb_enrich_spent( $which = 'all' ) {
	$l = (array) get_option( 'aw_enrich_ledger', array() );
	$m = (array) ( $l[ wp_date( 'Y-m' ) ] ?? array() );
	return 'all' === $which ? (float) array_sum( $m ) : (float) ( $m[ $which ] ?? 0 );
}

/** Add to this month's spend. */
function sourceweb_enrich_spend( $usd, $which = 'worker' ) {
	$l   = (array) get_option( 'aw_enrich_ledger', array() );
	$key = wp_date( 'Y-m' );
	$l[ $key ][ $which ] = round( (float) ( $l[ $key ][ $which ] ?? 0 ) + (float) $usd, 4 );
	$l   = array_slice( $l, -13, null, true );
	update_option( 'aw_enrich_ledger', $l, false );
}

/* ---------- REST ---------- */

add_action(
	'rest_api_init',
	function () {
		$can = fn() => current_user_can( 'edit_others_posts' );
		register_rest_route( 'aw/v1', '/enrich/config', array( 'methods' => 'GET', 'permission_callback' => $can, 'callback' => 'sourceweb_enrich_rest_config' ) );
		register_rest_route( 'aw/v1', '/enrich/queue', array( 'methods' => 'GET', 'permission_callback' => $can, 'callback' => 'sourceweb_enrich_rest_queue' ) );
		register_rest_route( 'aw/v1', '/enrich/results', array( 'methods' => 'POST', 'permission_callback' => $can, 'callback' => 'sourceweb_enrich_rest_results' ) );
		register_rest_route( 'aw/v1', '/enrich/index', array( 'methods' => 'GET', 'permission_callback' => $can, 'callback' => 'sourceweb_enrich_rest_index' ) );
		register_rest_route( 'aw/v1', '/enrich/cleanup', array( 'methods' => 'GET', 'permission_callback' => $can, 'callback' => 'sourceweb_enrich_rest_cleanup' ) );
	}
);

/** GET enrich/config. From phase 3 also the Directory schema, the trust order and the field rules (rules.php). */
function sourceweb_enrich_rest_config() {
	$out = array(
		'sources'      => sourceweb_enrich_sources_on(),
		'google_spent' => sourceweb_enrich_spent( 'worker' ),
		'fields'       => array_keys( sourceweb_enrich_fields_all() ),
		'services'     => DIRECTORYWEB_SERVICES,
		'counts'       => sourceweb_enrich_progress(),
	);
	if ( function_exists( 'sourceweb_rules_live' ) && sourceweb_rules_live() ) {
		$rules              = sourceweb_enrich_field_rules();
		$out['schema']      = sourceweb_enrich_schema();
		$out['priority']    = $rules['priority'];
		$out['field_rules'] = (object) $rules['fields'];
	}
	return $out;
}

/** How far the worker has got: listings checked / total, and pending reviews. */
function sourceweb_enrich_progress() {
	global $wpdb;
	$is_l    = sourceweb_sql_in_types( 'p.post_type', array( sourceweb_type( 'listing' ) ) ); // 1=0 without a listing type
	$total   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} p WHERE {$is_l} AND p.post_status = 'publish'" ); // phpcs:ignore WordPress.DB
	$checked = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'aw_enrich_checked' WHERE {$is_l} AND p.post_status = 'publish'" ); // phpcs:ignore WordPress.DB
	$pending = get_option( 'aw_enrich_db' ) ? (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM %i WHERE status = 'pending'", sourceweb_enrich_table() ) ) : 0; // phpcs:ignore WordPress.DB
	return array( 'total' => $total, 'checked' => $checked, 'pending' => $pending );
}

/**
 * GET enrich/index?state=Haryana&page=1: the published listings of one state (id, name, district, whether they have any
 * contact), for matching an outside list to listings (a site may add an identifier: filter sourceweb_enrich_index_item). 1,000 a page.
 */
function sourceweb_enrich_rest_index( WP_REST_Request $req ) {
	global $wpdb;
	$want = strtolower( trim( (string) $req['state'] ) );
	$page = max( 1, (int) ( $req['page'] ?? 1 ) );
	$out  = array();
	$code = 0;
	foreach ( directoryweb_place_states() as $st ) {
		if ( strtolower( $st->name ) === $want ) {
			$code = (int) $st->code;
		}
	}
	if ( ! $code ) {
		return array( 'items' => array(), 'state' => (string) $req['state'] );
	}
	$is_l = sourceweb_sql_in_types( 'p.post_type', array( sourceweb_type( 'listing' ) ) );
	$ids = $wpdb->get_col( $wpdb->prepare( "SELECT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'aw_state_code' AND m.meta_value = %d WHERE {$is_l} AND p.post_status = 'publish' ORDER BY p.ID LIMIT 1000 OFFSET %d", $code, ( $page - 1 ) * 1000 ) ); // phpcs:ignore WordPress.DB
	foreach ( $ids as $id ) {
		$pl    = function_exists( 'directoryweb_listing_place' ) ? directoryweb_listing_place( (int) $id ) : array( '', '' );
		$out[] = (array) apply_filters( 'sourceweb_enrich_index_item', array(
			'id'        => (int) $id,
			'name'      => html_entity_decode( get_the_title( (int) $id ), ENT_QUOTES ),
			'district'  => (string) ( $pl[1] ?? '' ),
			'state'     => (string) ( $pl[0] ?? '' ),
			'contact'   => (bool) ( ( function_exists( 'directoryweb_listing_phones' ) && directoryweb_listing_phones( (int) $id ) ) || get_post_meta( $id, 'aw_email', true ) || get_post_meta( $id, 'aw_website', true ) || get_post_meta( $id, 'aw_facebook', true ) ),
		), (int) $id );
	}
	return array( 'items' => $out, 'state' => (string) $req['state'], 'page' => $page );
}

/**
 * GET enrich/queue?limit=50&ids=1,2&group=name. Order: published or claimed in the last 24 hours and not checked
 * since; never checked listings with no way to reach them; every other never-checked listing; then those last checked
 * more than 90 days ago. A site may add steps or a named group: filter sourceweb_enrich_queue_steps.
 */
function sourceweb_enrich_rest_queue( WP_REST_Request $req ) {
	global $wpdb;
	$limit = max( 1, min( 200, (int) ( $req['limit'] ?? 50 ) ) );
	$ids   = array_filter( array_map( 'absint', explode( ',', (string) ( $req['ids'] ?? '' ) ) ) );
	$group = sanitize_key( (string) ( $req['group'] ?? '' ) );
	$google = ! empty( $req['google'] ); // the worker has Google on this run
	if ( ! $ids ) {
		$p      = $wpdb->posts;
		$m      = $wpdb->postmeta;
		$base   = "FROM {$p} p LEFT JOIN {$m} c ON c.post_id = p.ID AND c.meta_key = 'aw_enrich_checked' WHERE " . sourceweb_sql_in_types( 'p.post_type', array( sourceweb_type( 'listing' ) ) ) . " AND p.post_status = 'publish'"
			. " AND NOT EXISTS (SELECT 1 FROM {$m} f WHERE f.post_id = p.ID AND f.meta_key = 'aw_enrich_flags' AND f.meta_value LIKE '%\"identity\"%')"; // Identity unresolved: left out.
		// No way to reach them at all (no phone, email, website or Facebook): these go first after new and claimed listings
		// (SEO, 24 Oct 2026: such profiles are not indexed until a contact is added).
		$none   = "NOT EXISTS (SELECT 1 FROM {$m} x WHERE x.post_id = p.ID AND x.meta_key IN ('aw_email','aw_website','aw_facebook') AND x.meta_value <> '') AND NOT EXISTS (SELECT 1 FROM {$m} x WHERE x.post_id = p.ID AND x.meta_key = 'aw_phones' AND x.meta_value > 0)";
		$gpend  = "c.meta_value IS NOT NULL AND p.ID IN (SELECT post_id FROM {$m} WHERE meta_key = 'aw_enrich_google_pending' AND meta_value = '1')"; // checked while Google was off
		$since  = wp_date( 'Y-m-d H:i:s', time() - DAY_IN_SECONDS );
		$claims = "SELECT a.meta_value FROM {$m} a JOIN {$m} s ON s.post_id = a.post_id AND s.meta_key = 'aw_c_status' AND s.meta_value = 'approved' JOIN {$p} cp ON cp.ID = a.post_id AND cp.post_modified >= '{$since}' WHERE a.meta_key = 'aw_c_listing'";
		$steps  = array(
			"c.meta_value IS NULL AND p.post_date >= '{$since}'",
			"p.ID IN ({$claims}) AND (c.meta_value IS NULL OR c.meta_value < '{$since}')",
			"c.meta_value IS NULL AND {$none}",
			...( $google ? array( "{$gpend} AND {$none}", $gpend ) : array() ),
			'c.meta_value IS NULL',
			"c.meta_value < '" . wp_date( 'Y-m-d H:i:s', time() - AW_ENRICH_REFRESH_DAYS * DAY_IN_SECONDS ) . "'",
		);
		// Filter sourceweb_enrich_queue_steps( string[] $steps, string $group, array $ctx ): SQL conditions tried in order
		// (c = the checked meta, p = the post, $ctx['m'] the postmeta table, ['none'] the "no way to reach them" test). A
		// site adds a step of its own, or answers its own named group with the steps for it alone. Fixed fragments only.
		$filtered = apply_filters( 'sourceweb_enrich_queue_steps', $steps, $group, array( 'm' => $m, 'p' => $p, 'since' => $since, 'none' => $none, 'google' => $google ) );
		$steps    = is_array( $filtered ) ? array_values( array_filter( $filtered, 'is_string' ) ) : $steps;
		foreach ( $steps as $where ) {
			if ( count( $ids ) >= $limit ) {
				break;
			}
			$not  = $ids ? ' AND p.ID NOT IN (' . implode( ',', $ids ) . ')' : '';
			$ids  = array_merge( $ids, array_map( 'intval', $wpdb->get_col( "SELECT p.ID {$base} AND {$where}{$not} ORDER BY p.ID ASC LIMIT " . ( $limit - count( $ids ) ) ) ) ); // phpcs:ignore WordPress.DB, PluginCheck.Security.DirectDB.UnescapedDBParameter -- $base and $where are fixed fragments built above (core table names, dates from wp_date); the ids are integers
		}
	}
	$items = array();
	foreach ( array_slice( $ids, 0, $limit ) as $id ) {
		if ( sourceweb_is_type( get_post_type( $id ), 'listing' ) ) {
			$items[] = sourceweb_enrich_listing_payload( $id );
		}
	}
	return array( 'items' => $items, 'progress' => sourceweb_enrich_progress(), 'google_spent' => sourceweb_enrich_spent( 'worker' ) );
}

/** What the worker needs to know about one listing. */
function sourceweb_enrich_listing_payload( $id ) {
	list( $state, $district ) = function_exists( 'directoryweb_listing_place' ) ? directoryweb_listing_place( $id ) : array( '', '' );
	$now = array();
	foreach ( array_keys( sourceweb_enrich_fields_all() ) as $f ) {
		$v = sourceweb_enrich_current( $id, $f );
		if ( ( is_array( $v ) && $v ) || ( ! is_array( $v ) && '' !== trim( (string) $v ) ) ) {
			$now[ $f ] = $v;
		}
	}
	$claim = array();
	global $wpdb;
	foreach ( $wpdb->get_col( $wpdb->prepare( "SELECT a.post_id FROM {$wpdb->postmeta} a JOIN {$wpdb->postmeta} s ON s.post_id = a.post_id AND s.meta_key = 'aw_c_status' AND s.meta_value = 'approved' WHERE a.meta_key = 'aw_c_listing' AND a.meta_value = %d", $id ) ) as $cid ) { // phpcs:ignore WordPress.DB
		$claim = array_merge( $claim, (array) get_post_meta( (int) $cid, 'aw_c_proposed', true ) );
	}
	return (array) apply_filters( 'sourceweb_enrich_listing_payload', array(
		'id'           => $id,
		'name'         => html_entity_decode( get_the_title( $id ), ENT_QUOTES ),
		'url'          => get_permalink( $id ),
		'state'        => $state,
		'district'     => $district,
		'area'         => (string) get_post_meta( $id, 'aw_area', true ),
		'types'        => function_exists( 'directoryweb_listing_types' ) ? wp_list_pluck( directoryweb_listing_types( $id ), 'slug' ) : array(),
		'protected'    => sourceweb_enrich_is_protected( $id ),
		'checked'      => (string) get_post_meta( $id, 'aw_enrich_checked', true ),
		'now'          => $now,
		'claim'        => $claim,
	), $id ); // filter sourceweb_enrich_listing_payload( array $payload, int $id ): a site adds what its own sources need
}

/**
 * POST enrich/results: {listing_id, run, google_cost, sources_used: [keys], proposals: [{field, value, confidence,
 * sources: [{key, name, url, fetched_at}]}], flags: {invite_claim: [fields], reported_closed: {url, at}}}.
 */
function sourceweb_enrich_rest_results( WP_REST_Request $req ) {
	sourceweb_enrich_install();
	$b   = (array) $req->get_json_params();
	$lid = (int) ( $b['listing_id'] ?? 0 );
	if ( ! sourceweb_is_type( get_post_type( $lid ), 'listing' ) ) {
		return new WP_Error( 'aw_enrich', 'Not a listing', array( 'status' => 400 ) );
	}
	$run       = sanitize_text_field( (string) ( $b['run'] ?? '' ) );
	$protected = sourceweb_enrich_is_protected( $lid );
	$fields    = sourceweb_enrich_fields_all(); // with the listing fields whose field rule is on (phase 3)
	$out       = array( 'applied' => array(), 'queued' => array(), 'skipped' => array(), 'failed' => array() ); // skipped: nothing to do (already held, not usable); failed: a write that did not work, logged as a 'failed' row
	if ( ! empty( $b['google_cost'] ) ) {
		sourceweb_enrich_spend( (float) $b['google_cost'], 'worker' );
	}
	if ( sourceweb_enrich_identity_unresolved( $lid ) ) { // Which organisation this is is not known: nothing is proposed.
		$out['skipped'] = array_values( array_filter( array_map( fn( $p ) => sanitize_key( (string) ( $p['field'] ?? '' ) ), (array) ( $b['proposals'] ?? array() ) ) ) );
		return $out + array(
			'protected'           => $protected,
			'identity_unresolved' => true,
		);
	}
	foreach ( (array) ( $b['proposals'] ?? array() ) as $p ) {
		$field = sanitize_key( (string) ( $p['field'] ?? '' ) );
		$conf  = in_array( $p['confidence'] ?? '', array( 'high', 'medium', 'low' ), true ) ? $p['confidence'] : 'low';
		$value = $p['value'] ?? '';
		$srcs  = array_map(
			fn( $s ) => array(
				'key'        => sanitize_key( (string) ( $s['key'] ?? '' ) ),
				'name'       => sanitize_text_field( (string) ( $s['name'] ?? '' ) ),
				'url'        => esc_url_raw( (string) ( $s['url'] ?? '' ) ),
				'fetched_at' => sanitize_text_field( (string) ( $s['fetched_at'] ?? '' ) ),
			),
			(array) ( $p['sources'] ?? array() )
		);
		if ( ! isset( $fields[ $field ] ) || 'closed' === $field || ( is_string( $value ) && '' === trim( $value ) ) || ( is_array( $value ) && ! $value ) ) {
			$out['skipped'][] = $field;
			continue;
		}
		$rule = sourceweb_enrich_field_rule( $field ); // Rules → Directory enrichment: a field switched off, or sources not allowed to fill it
		if ( empty( $rule['on'] ) ) {
			$out['skipped'][] = $field;
			continue;
		}
		if ( $rule['sources'] ) { // a source not allowed is never credited; nothing left from an allowed one: skipped
			$srcs = sourceweb_enrich_allowed_sources( $srcs, $rule['sources'] );
			if ( ! $srcs ) {
				$out['skipped'][] = $field;
				continue;
			}
		}
		if ( ! array_filter( $srcs, fn( $s ) => 'google_places' !== $s['key'] ) && ! in_array( $field, array( 'place_id', 'maps_url' ), true ) ) {
			$out['skipped'][] = $field; // Google alone never stores a fact
			continue;
		}
		if ( sourceweb_enrich_never_publish( $value ) ) {
			$out['skipped'][] = $field; // on the never-publish list (privacy takedown)
			continue;
		}
		$svc_note = '';
		if ( 'services' === $field ) { // the site's own service slugs; what was mapped or dropped goes into the row's note
			list( $value, $svc_note ) = sourceweb_enrich_services_norm( $value );
			if ( ! $value ) {
				$out['skipped'][] = $field;
				continue;
			}
		}
		$value = sourceweb_enrich_union( $lid, $field, $value ); // List fields: what is there plus what was found.
		if ( sourceweb_enrich_has_value( $lid, $field, $value ) ) {
			$out['skipped'][] = $field;
			continue;
		}
		global $wpdb;
		// Already waiting, or a person said no (Reject, also on a value that had been applied or undone: see
		// sourceweb_enrich_reject()). A failed write is not a no (status 'failed'; rows from before 25 Oct 2026
		// were 'rejected' with a "Could not be applied" / "could not be copied" note), so that value may come back.
		$same = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM %i WHERE listing_id = %d AND field = %s AND value = %s AND ( status = 'pending' OR ( status = 'rejected' AND note NOT LIKE %s AND note NOT LIKE %s ) ) LIMIT 1", sourceweb_enrich_table(), $lid, $field, wp_json_encode( $value ), $wpdb->esc_like( 'Could not be applied' ) . '%', '%' . $wpdb->esc_like( 'could not be copied' ) . '%' ) ); // phpcs:ignore WordPress.DB
		if ( $same ) {
			$out['skipped'][] = $field;
			continue;
		}
		$mode = ! empty( $b['force_review'] ) ? 'queue' : sourceweb_enrich_mode( $lid, $field, $conf, $protected, $value ); // an outside list always goes to review
		if ( 'queue' !== $mode ) {
			$snap = sourceweb_enrich_snapshot( $lid, $field );
			if ( sourceweb_enrich_write( $lid, $field, $value, $mode, $srcs ) ) {
				$rid = sourceweb_enrich_add_row( $lid, $field, $value, $snap, $srcs, $conf, 'auto-applied', $run, trim( $svc_note . ( 'both' === $mode ? '. ' . sourceweb_enrich_both_note( $field ) : '' ), '. ' ) );
				sourceweb_enrich_supersede( $lid, $field, $rid );
				$out['applied'][] = $field;
				continue;
			}
			$prev = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM %i WHERE listing_id = %d AND field = %s AND status = 'failed' AND value = %s ORDER BY id DESC LIMIT 1", sourceweb_enrich_table(), $lid, $field, wp_json_encode( $value ) ) ); // phpcs:ignore WordPress.DB
			if ( $prev ) { // the same value failed before: one row, dated by its latest attempt
				$wpdb->update( sourceweb_enrich_table(), array( 'run' => substr( $run, 0, 40 ), 'decided_at' => current_time( 'mysql' ) ), array( 'id' => (int) $prev ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			} else {
				sourceweb_enrich_add_row( $lid, $field, $value, $snap, $srcs, $conf, 'failed', $run, sourceweb_enrich_fail_note( $field, true ) );
			}
			$out['failed'][] = $field;
			continue;
		}
		$note = 'merge_into' === $field ? 'Same name and district, shared contact: approve to merge (the other listing becomes a draft with a 301)' : ( 'place' === $field && ! $protected ? ( 'low' === $conf ? 'Check first: the PIN code points to another state or district, or only the name gives the district' : 'The listing has a different state or already a district' ) : null );
		$note = null !== $note ? $note : ( ! empty( $b['force_review'] ) ? 'From an imported list: approve to apply' : ( $protected ? 'Claimed or verified listing: never changed automatically' : ( 'low' === $conf ? 'Sources disagree' : 'Would replace a value already on the listing' ) ) );
		$rid = sourceweb_enrich_add_row( $lid, $field, $value, sourceweb_enrich_snapshot( $lid, $field ), $srcs, $conf, 'pending', $run, trim( ( '' !== $svc_note ? $svc_note . '. ' : '' ) . $note, '. ' ) );
		$dec = apply_filters( 'aw_enrich_queued_decision', '', (int) $rid, $lid, $field ); // autoresolve.php decides the obvious ones at once: approve | reject | ''
		if ( 'approve' === $dec ) {
			$out['applied'][] = $field;
		} elseif ( 'reject' === $dec ) {
			$out['skipped'][] = $field;
		} else {
			$out['queued'][] = $field;
		}
	}

	if ( ! empty( $b['import'] ) ) { // an import neither marks the listing checked nor changes its flags
		return $out + array( 'protected' => $protected );
	}
	$flags = (array) ( $b['flags'] ?? array() );
	sourceweb_enrich_flag( $lid, 'invite_claim', array_values( array_intersect( array_map( 'sanitize_key', (array) ( $flags['invite_claim'] ?? array() ) ), array_keys( $fields ) ) ) );
	if ( ! empty( $flags['reported_closed'] ) ) {
		$rc  = (array) $flags['reported_closed'];
		$src = array( array( 'key' => 'google_places', 'name' => 'Google Maps', 'url' => esc_url_raw( (string) ( $rc['url'] ?? '' ) ), 'fetched_at' => sanitize_text_field( (string) ( $rc['at'] ?? '' ) ) ) );
		update_post_meta( $lid, 'aw_reported_closed', wp_date( 'Y-m-d' ) ); // the listing stays in search and shows the "Reported closed" note (owner, 21 Oct 2026)
		sourceweb_enrich_flag( $lid, 'reported_closed', wp_date( 'Y-m-d' ) );
		global $wpdb;
		if ( ! $wpdb->get_var( $wpdb->prepare( "SELECT id FROM %i WHERE listing_id = %d AND field = 'closed' AND status IN ('auto-applied','approved')", sourceweb_enrich_table(), $lid ) ) ) { // phpcs:ignore WordPress.DB
			sourceweb_enrich_add_row( $lid, 'closed', 'Google Maps shows this place as permanently closed', '', $src, 'medium', 'auto-applied', $run, 'Shown on the listing as "Reported closed"; nothing to review' );
			$out['applied'][] = 'closed';
		}
		sourceweb_enrich_after_change( $lid );
	}
	sourceweb_enrich_duplicates( $lid );
	$used = array_values( array_unique( array_map( 'sanitize_key', (array) ( $b['sources_used'] ?? array() ) ) ) );
	update_post_meta( $lid, 'aw_enrich_checked', wp_date( 'Y-m-d H:i:s' ) );
	update_post_meta( $lid, 'aw_enrich_tried', $used );
	// Checked while Google was off (monthly quota used): it comes back first when Google is on, unless it already has its place.
	if ( ! empty( $b['google_skipped'] ) && '' === (string) get_post_meta( $lid, 'aw_place_id', true ) ) {
		update_post_meta( $lid, 'aw_enrich_google_pending', '1' );
	} else {
		delete_post_meta( $lid, 'aw_enrich_google_pending' );
	}
	return $out + array( 'protected' => $protected );
}

/**
 * When enrichment last changed this listing: the newest applied row (auto-applied or approved; undone rows do not
 * count), as Y-m-d H:i:s site time, or ''. Used by the profile's "Last updated" (owner, 25 Oct 2026).
 *
 * @param int $lid Listing ID.
 * @return string
 */
function sourceweb_enrich_last_applied( $lid ) {
	if ( ! get_option( 'aw_enrich_db' ) ) {
		return '';
	}
	global $wpdb;
	return (string) $wpdb->get_var( $wpdb->prepare( "SELECT MAX( COALESCE( decided_at, created ) ) FROM %i WHERE listing_id = %d AND status IN ('auto-applied','approved')", sourceweb_enrich_table(), $lid ) ); // phpcs:ignore WordPress.DB
}

/** Another listing with the same place ID, or the same value of an identifier a site adds (filter sourceweb_enrich_duplicate_keys; stored or waiting in the queue): flag both, never merge. */
function sourceweb_enrich_duplicates( $lid ) {
	global $wpdb;
	$dups = array();
	$keys = apply_filters( 'sourceweb_enrich_duplicate_keys', array( 'place_id' => 'aw_place_id' ) ); // field => meta key
	foreach ( is_array( $keys ) ? $keys : array() as $field => $key ) {
		$vals = array_filter( array( (string) get_post_meta( $lid, $key, true ) ) );
		foreach ( $wpdb->get_col( $wpdb->prepare( "SELECT value FROM %i WHERE listing_id = %d AND field = %s AND status = 'pending'", sourceweb_enrich_table(), $lid, $field ) ) as $v ) { // phpcs:ignore WordPress.DB
			$vals[] = (string) json_decode( $v, true );
		}
		foreach ( array_unique( array_filter( $vals ) ) as $v ) {
			$other = array_merge(
				$wpdb->get_col( $wpdb->prepare( "SELECT m.post_id FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID = m.post_id AND p.post_type = %s AND p.post_status <> 'trash' WHERE m.meta_key = %s AND m.meta_value = %s AND m.post_id <> %d", sourceweb_type( 'listing' ), $key, $v, $lid ) ), // phpcs:ignore WordPress.DB
				$wpdb->get_col( $wpdb->prepare( "SELECT listing_id FROM %i WHERE field = %s AND value = %s AND status = 'pending' AND listing_id <> %d", sourceweb_enrich_table(), $field, wp_json_encode( $v ), $lid ) ) // phpcs:ignore WordPress.DB
			);
			foreach ( array_unique( array_map( 'intval', $other ) ) as $o ) {
				$dups[ $o ] = $field;
				$theirs     = (array) ( sourceweb_enrich_flags( $o )['duplicate'] ?? array() );
				$theirs[ $lid ] = $field;
				sourceweb_enrich_flag( $o, 'duplicate', $theirs );
			}
		}
	}
	sourceweb_enrich_flag( $lid, 'duplicate', $dups );
}


/**
 * Apply the owner's rule (21 Oct 2026) to proposals already waiting: a sourced value fills an empty field; a second
 * phone, email or website is kept next to the first, both unverified. Rows of claimed or verified listings and low
 * confidence rows stay for review. wp eval 'echo sourceweb_enrich_policy_pass();'
 *
 * A server tool, run by hand with wp eval: no code calls it, on purpose (audit, 25 Oct 2026). Keep it.
 *
 * @return string What was done.
 */
function sourceweb_enrich_policy_pass() {
	global $wpdb;
	$t = sourceweb_enrich_table();
	$n = array( 'apply' => 0, 'both' => 0, 'queue' => 0, 'skip' => 0 );
	foreach ( $wpdb->get_results( $wpdb->prepare( "SELECT id FROM %i WHERE status = 'pending' AND field <> 'closed' ORDER BY id ASC", $t ), ARRAY_A ) as $x ) { // phpcs:ignore WordPress.DB
		$r = sourceweb_enrich_row( (int) $x['id'] );
		if ( ! $r || 'pending' !== $r['status'] ) {
			continue;
		}
		$lid = (int) $r['listing_id'];
		if ( sourceweb_enrich_identity_unresolved( $lid ) ) {
			++$n['queue'];
			continue;
		}
		// The field rule as it is now (Codex, #77): a field switched off, or a row with no allowed source left, waits for
		// a reviewer instead of being applied; an allowed row is written with its allowed sources only.
		$rule = sourceweb_enrich_field_rule( $r['field'] );
		if ( empty( $rule['on'] ) ) {
			++$n['queue'];
			continue;
		}
		if ( $rule['sources'] ) {
			$r['sources'] = sourceweb_enrich_allowed_sources( (array) $r['sources'], $rule['sources'] );
			if ( ! $r['sources'] ) {
				++$n['queue'];
				continue;
			}
		}
		$svc_note = '';
		if ( 'services' === $r['field'] ) {
			list( $r['value'], $svc_note ) = sourceweb_enrich_services_norm( $r['value'] );
			if ( ! $r['value'] ) { // none of the words is a service on the site: nothing to apply
				sourceweb_enrich_set_status( (int) $r['id'], 'superseded', 'Nothing to apply. ' . $svc_note );
				$n['skip']++;
				continue;
			}
		}
		$r['value'] = sourceweb_enrich_union( $lid, $r['field'], $r['value'] );
		if ( sourceweb_enrich_has_value( $lid, $r['field'], $r['value'] ) ) {
			sourceweb_enrich_set_status( (int) $r['id'], 'superseded', 'Already on the listing' );
			$n['skip']++;
			continue;
		}
		$mode = sourceweb_enrich_mode( $lid, $r['field'], $r['confidence'], sourceweb_enrich_is_protected( $lid ), $r['value'] );
		if ( 'queue' === $mode ) {
			$n['queue']++;
			continue;
		}
		$snap = sourceweb_enrich_snapshot( $lid, $r['field'] );
		if ( ! sourceweb_enrich_write( $lid, $r['field'], $r['value'], $mode, (array) $r['sources'] ) ) {
			$n['queue']++;
			continue;
		}
		$wpdb->update( $t, array( 'value' => wp_json_encode( $r['value'] ), 'old_value' => wp_json_encode( $snap ), 'status' => 'auto-applied', 'decided_at' => current_time( 'mysql' ), 'note' => substr( ( '' !== $svc_note ? $svc_note . '. ' : '' ) . ( 'both' === $mode ? sourceweb_enrich_both_note( $r['field'] ) : 'Sourced value for an empty field (owner rule, 21 Oct 2026)' ), 0, 190 ) ), array( 'id' => (int) $r['id'] ) ); // phpcs:ignore WordPress.DB
		sourceweb_enrich_supersede( $lid, $r['field'], (int) $r['id'] );
		$n[ $mode ]++;
	}
	return wp_json_encode( $n );
}
