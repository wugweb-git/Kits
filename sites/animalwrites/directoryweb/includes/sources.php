<?php
/**
 * The Animal Writes data sources (moved out of DirectoryWeb 1.3.0 unchanged): where an organisation's details come from.
 *
 * Each source has its own schema (the fields it gives) and date:
 * - awbi       AWBI list of recognised organisations, as on 31 May 2026: name, recognition code, address, valid until.
 * - awbi-abc   AWBI list of ABC projects: name, district, recognition and validity of the ABC project.
 * - gov        State animal husbandry departments and DAHD: name, place, type (veterinary institutions).
 * - awol       AWO List (Dec 2023 – Jan 2025), schema 1.2: name, address, phone, whether the
 *              organisation said it has a shelter, rescue and treatment, notes from the call.
 * - darpan     NGO Darpan (NITI Aayog), read from its own search (owner types the CAPTCHA): Darpan ID, registration, sectors.
 * - datagov    data.gov.in (Open Government Data Platform India) datasets.
 * - nalsa      District Legal Services Authorities (NALSA / State Legal Services Authorities): office, address, phone.
 * - gujforest  Gujarat Forest Department (Karuna Abhiyan): permanent bird treatment centres.
 * - pfa        People For Animals: the unit's phone and email from its unit page.
 * - web        A public web page listing organisations (adopt-a-pet.in, AWBP Trust, dogsindia.com); the page names itself.
 *   These carry their own date (aw_source_date) and link (aw_source_url) from the import.
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Import sources that carry their own date and link on the listing (aw_source_date, aw_source_url). */
const AW_IMPORT_SOURCES = array( 'darpan', 'datagov', 'nalsa', 'gujforest', 'pfa', 'web' );

add_filter(
	'directoryweb_data_sources',
	function ( $reg ) {
		return array_merge(
			(array) $reg,
			array(
				'awbi'         => array( 'AWBI', 'AWBI list of recognised organisations', '2026-05-31', 'https://awbi.gov.in/' ),
				'awbi-abc'     => array( 'AWBI', 'AWBI list of ABC projects', '', 'https://awbi.gov.in/' ),
				'gov'          => array( 'GOV', '', '', '' ), // label and link come from the listing's own source name and URL
				'awol'         => array( 'AWOL', 'AWO List', '2025-01-03', '' ),
				'ngobase'      => array( 'NGOB', 'ngobase.org', '2026-10-09', '' ), // link: the organisation's ngobase.org profile
				'darpan'       => array( 'DARPAN', 'NGO Darpan (NITI Aayog)', '', 'https://ngodarpan.gov.in/' ),
				'datagov'      => array( 'OGD', 'data.gov.in', '', '' ),
				'nalsa'        => array( 'NALSA', 'Legal Services Authority', '', '' ),
				'gujforest'    => array( 'GUJ', 'Gujarat Forest Department', '', '' ),
				'pfa'          => array( 'PFA', 'People For Animals', '', '' ),
				'web'          => array( 'WEB', 'Public list', '', '' ),
			)
		);
	}
);

// The sources told from the listing's own fields (older imports): the AWBI code, and the import's source name.
add_filter(
	'directoryweb_listing_source_slugs',
	function ( $slugs, $id ) {
		$name = (string) get_post_meta( $id, 'aw_source_name', true );
		if ( get_post_meta( $id, 'aw_awbi_code', true ) ) {
			$slugs[] = 'awbi';
		}
		if ( 'AWBI ABC list' === $name ) {
			$slugs[] = 'awbi-abc';
		} elseif ( $name && ! array_intersect( $slugs, AW_IMPORT_SOURCES ) && ! ( get_post_meta( $id, 'aw_awbi_code', true ) && false !== stripos( $name, 'AWBI list' ) ) ) { // an import source names itself; an older AWBI list is the AWBI label
			$slugs[] = false !== stripos( $name, 'google' ) ? 'gmaps' : 'gov'; // a Google profile is not a government list
		}
		return $slugs;
	},
	10,
	2
);

// One entry's label, date and link.
add_filter(
	'directoryweb_listing_source',
	function ( $entry, $id ) {
		list( $slug, $mark, $label, $on, $link ) = $entry;
		$name                                    = (string) get_post_meta( $id, 'aw_source_name', true );
		if ( 'gov' === $slug ) {
			$label = $name;
			$on    = (string) get_post_meta( $id, 'aw_source_date', true );
			$link  = (string) get_post_meta( $id, 'aw_source_url', true );
		}
		if ( in_array( $slug, AW_IMPORT_SOURCES, true ) ) {
			$label = $name ? $name : $label; // the list's own publisher, e.g. "Telangana State Legal Services Authority"
			$on    = (string) get_post_meta( $id, 'aw_source_date', true );
			$link  = (string) get_post_meta( $id, 'aw_source_url', true );
		}
		if ( 'awbi' === $slug && get_post_meta( $id, 'aw_awbi_list_on', true ) ) {
			$on = (string) get_post_meta( $id, 'aw_awbi_list_on', true ); // an older AWBI list (e.g. active list of 21 Feb 2025)
		}
		if ( 'ngobase' === $slug ) {
			$link = (string) get_post_meta( $id, 'aw_ngobase_url', true );
		}
		return array( $slug, $mark, $label, $on, $link );
	},
	10,
	2
);

add_filter(
	'directoryweb_source_variants',
	fn( $v ) => array_merge( (array) $v, array( 'awbi' => 'success', 'awbi-abc' => 'success', 'gov' => 'info', 'nalsa' => 'info', 'gujforest' => 'info', 'awol' => '' ) )
);

add_filter( 'directoryweb_source_labels_hidden', fn( $h ) => array_merge( (array) $h, array( 'ngobase' ) ) ); // kept as a source in the data, not shown on the site

// incometax (12A, 80G) and mha (FCRA): the issuing bodies of a listing's registrations (listing-template.php)
add_filter(
	'directoryweb_source_hosts',
	fn( $h ) => array_merge( (array) $h, array( 'awbi' => 'https://awbi.gov.in/', 'awbi-abc' => 'https://awbi.gov.in/', 'darpan' => 'https://ngodarpan.gov.in/', 'datagov' => 'https://www.data.gov.in/', 'nalsa' => 'https://nalsa.gov.in/', 'gujforest' => 'https://forests.gujarat.gov.in/', 'pfa' => 'https://peopleforanimalsindia.org/', 'incometax' => 'https://www.incometax.gov.in/', 'mha' => 'https://www.mha.gov.in/' ) )
);
