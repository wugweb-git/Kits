<?php
/**
 * Animal Writes compatibility: the site values RankWeb used to assume, given back to the Animal Writes site only.
 *
 * Loaded by rankweb.php when Animal Writes Core is active. Every other site gets RankWeb's generic defaults
 * (standalone-seo.php: rankweb_site_default()). A site can change any of these under RankWeb → Settings or with the
 * `rankweb_site_default_*` filters; nothing here is stored.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$rankweb_aw_defaults = array(
	'alt_names'    => array( 'AnimalWrites', 'Animal Writes India', 'animalwrites.in' ), // people search the brand under several names (12 Nov 2026)
	'same_as'      => array( 'https://www.facebook.com/profile.php?id=61596537146561', 'https://www.instagram.com/animal_writes_/', 'https://x.com/animal_writes_', 'https://www.linkedin.com/company/animalwrites/', 'https://www.threads.com/@animal_writes_' ),
	'email'        => 'contact@animalwrites.in',
	'language'     => 'en-IN',
	'country'      => 'IN',
	'country_name' => 'India',
	'languages'    => array( 'en', 'hi' ),
	'founded'      => '2025-11', // the first campaign (November 2025)
);
foreach ( $rankweb_aw_defaults as $rankweb_aw_key => $rankweb_aw_value ) {
	add_filter( 'rankweb_site_default_' . $rankweb_aw_key, fn() => $rankweb_aw_value );
}
unset( $rankweb_aw_defaults, $rankweb_aw_key, $rankweb_aw_value );

/* ---------- Copy and names the generic code leaves neutral (each is a filter the generic code applies) ---------- */

// The Directory's subject and country, after "the Animal Writes Directory" in a place's description.
add_filter( 'rankweb_directory_scope', fn( $scope, $long = false ) => $long ? ' of animal welfare organisations in India' : ' of India', 10, 2 );

// The block that places the FAQ in an item template, the Breadcrumbs block's earlier name, and the block namespace whose blocks print run-time content.
add_filter( 'rankweb_faq_item_block', fn() => 'animal-writes/item-faq' );
add_filter( 'rankweb_breadcrumbs_legacy_block', fn() => 'animal-writes/breadcrumb' );
add_filter( 'rankweb_built_block_namespaces', fn( $spaces ) => array_merge( (array) $spaces, array( 'animal-writes' ) ) );

// Settings defaults for the Animal Writes content types (only the defaults: a value a site has saved is untouched).
add_filter(
	'rankweb_default_hub_titles',
	fn() => array(
		'aw_news'        => 'Animal Welfare News from India – Animal Writes',
		'aw_legal'       => 'Animal Laws and Court Orders in India – Animal Writes',
		'post'           => 'Animal Welfare Guides & Research in India – Animal Writes',
		'aw_listing'     => 'Directory of 5,000+ Animal Welfare NGOs in India',
		'aw_opportunity' => 'Animal Welfare Volunteering and Jobs in India',
		'aw_press'       => 'Animal Writes in the News',
		'aw_campaign'    => 'Animal Welfare Campaigns in India – Animal Writes',
	)
);
add_filter(
	'rankweb_default_hub_descriptions',
	fn() => array(
		'aw_opportunity' => 'Volunteer, foster, intern or find a job with animal welfare organisations across India. Each opportunity lists its role, location and how to apply.',
		'aw_press'       => 'Press coverage of Animal Writes campaigns for animals in India: news articles, videos and social posts.',
		'aw_listing'     => 'Find %s animal welfare NGOs, shelters, rescuers, Gaushalas and government vets in every state and district of India, with phone, address and services.',
	)
);
add_filter(
	'rankweb_default_archive_descriptions',
	fn() => array(
		'aw_news'        => 'Animal-welfare news from across India, summarised with a link to every source.',
		'aw_legal'       => 'Court orders, notifications and rules that affect animals in India, explained in plain words.',
		'post'           => 'Practical guides: what to do for an injured animal, how to report cruelty, Animal Birth Control and more.',
		'aw_campaign'    => 'Citizen campaigns for animals in India: what each one asks for, how to take part and what it achieved.',
		'aw_opportunity' => 'Volunteer, foster, internship and job opportunities in animal welfare in India.',
		'aw_listing'     => 'Animal welfare organisations, Gaushalas and government vets across India.',
	)
);
