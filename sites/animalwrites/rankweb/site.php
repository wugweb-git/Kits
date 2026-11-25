<?php
/**
 * Animal Writes site layer for RankWeb and DirectoryWeb. Load as a must-use plugin (wp-content/mu-plugins/). It is not part
 * of any distributed package: it holds what belongs to this one site, which the plugins used to carry.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Defined before RankWeb loads (plugins_loaded 5), so the plugin's stand-ins step aside.
require_once __DIR__ . '/programmatic.php';

// Defaults the plugin no longer ships: content types, hub and term titles, directory index list, brand words.
add_filter(
	'rankweb_modules',
	function ( $modules ) {
		$defaults = require __DIR__ . '/defaults.php';
		foreach ( $modules as $mk => $mod ) {
			foreach ( (array) ( $mod['fields'] ?? array() ) as $key => $field ) {
				if ( array_key_exists( $key, $defaults ) ) {
					$modules[ $mk ]['fields'][ $key ]['default'] = $defaults[ $key ];
				}
			}
		}
		return $modules;
	}
);

add_filter( 'rankweb_contact_email', fn() => 'contact@animalwrites.in' );
add_filter( 'rankweb_news_publication_name', fn() => 'Animal Writes' );
add_filter( 'rankweb_own_hosts', fn( $h ) => array_merge( $h, array( 'animalwrites.in' ) ) );
add_filter( 'rankweb_country_name', fn() => 'India' );
add_filter( 'rankweb_remote_job_country', fn() => 'India' );
add_filter( 'rankweb_front_page_title', fn() => 'Animal Writes – Animal welfare news, law and help in India' );
add_filter( 'rankweb_about_page_title', fn() => 'About Animal Writes' );
add_filter( 'rankweb_term_share_alt', fn( $alt, $term, $kw ) => ( '' !== $kw ? $kw : $term->name ) . ' in India – Animal Writes', 10, 3 );
add_filter( 'directoryweb_geocode_contact', fn() => 'contact@animalwrites.in' );
add_filter( 'directoryweb_geocode_countries', fn() => 'in' );

/** Organization node: the country, founding date, area served, contact point and social profiles of the site. */
add_filter(
	'rankweb_organization_node',
	function ( $node ) {
		$email = 'contact@animalwrites.in';
		$node['email']        = $node['email'] ?? $email;
		$node['contactPoint'] = $node['contactPoint'] ?? array( '@type' => 'ContactPoint', 'contactType' => 'customer support', 'email' => $email, 'url' => home_url( '/contact/' ), 'areaServed' => 'IN', 'availableLanguage' => array( 'en', 'hi' ) );
		$node['address']      = array( '@type' => 'PostalAddress', 'addressCountry' => 'IN' );
		$node['foundingDate'] = '2025-11';
		$node['areaServed']   = array( '@type' => 'Country', 'name' => 'India', 'identifier' => 'IN' );
		if ( empty( $node['sameAs'] ) ) {
			$node['sameAs'] = array( 'https://www.facebook.com/profile.php?id=61596537146561', 'https://www.instagram.com/animal_writes_/', 'https://x.com/animal_writes_', 'https://www.linkedin.com/company/animalwrites/', 'https://www.threads.com/@animal_writes_' );
		}
		return $node;
	}
);

/* ---------- Redirect rules that were in RankWeb (moved here unchanged) ---------- */

// Crawlers and link scrapers that strip the "tel:" scheme and request it as a path (e.g. /tel:1962, /tel:112; 404 audit).
// Send each to its dedicated guide or directory page instead of a 404 error.
add_action(
	'parse_request',
	function () {
		if ( ! in_array( $_SERVER['REQUEST_METHOD'] ?? 'GET', array( 'GET', 'HEAD' ), true ) ) {
			return;
		}
		$path = (string) wp_parse_url( (string) wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ), PHP_URL_PATH ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		if ( ! preg_match( '#^/+tel:([0-9\+\-]+)$#i', $path, $m ) ) {
			return;
		}
		$num = preg_replace( '/\D+/', '', $m[1] );
		if ( '1962' === $num ) {
			wp_safe_redirect( home_url( '/resources/1962-helpline-mobile-veterinary-units/' ), 301, 'Animal Writes' );
			exit;
		}
		if ( '112' === $num ) {
			wp_safe_redirect( home_url( '/resources/who-to-call-for-an-animal-emergency-in-india-112-1962-local-groups/' ), 301, 'Animal Writes' );
			exit;
		}
		if ( '01292555700' === $num || '1292555700' === $num ) {
			wp_safe_redirect( home_url( '/resources/animal-cruelty-law-india/' ), 301, 'Animal Writes' );
			exit;
		}
		wp_safe_redirect( home_url( '/directory/' ), 301, 'Animal Writes' );
		exit;
	},
	0
);

// Addresses that are gone for good answer 410 (audit, 12 Nov 2026; checked the same day: no file of the build and none
// of 20 live pages prints them): the removed kits-core ad slot script and Core's old visit counter, plugin files under
// a server path (wp-content/plugins/home/…/aw_deploy/…, a plugins_url() address from before the plugin links of
// 10–11 Nov), and sitemaps of types or taxonomies that no longer exist (news-sitemap.xml itself is the Google News
// sitemap again since 12 Nov 2026, sitemap.php; only numbered copies stay gone). Old kits-cache CSS files are left at 404:
// their names come from each build, so a pattern could catch a file the next build writes.
add_action(
	'parse_request',
	function () {
		$path = (string) wp_parse_url( (string) wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ), PHP_URL_PATH ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		if ( preg_match( '#^/(?:wp-content/plugins/home/u544169507/.+|wp-content/plugins/kits-core/assets/js/ad-slot\.js|wp-content/plugins/animal-writes-core/visit\.php|(?:aw_listing_type|aw_guide)-sitemap\d*\.xml|news-sitemap\d+\.xml)$#', $path ) ) {
			status_header( 410 );
			nocache_headers();
			header( 'Content-Type: text/plain; charset=utf-8' );
			echo 'Gone';
			exit;
		}
	},
	0
);

// /?author=N goes to About in one hop (WordPress would first send it to /author/{name}/, which the ^author rule sends on).
add_action(
	'template_redirect',
	function () {
		if ( isset( $_GET['author'] ) && is_author() ) { // phpcs:ignore WordPress.Security.NonceVerification
			wp_safe_redirect( home_url( '/about/' ), 301, 'Animal Writes' );
			exit;
		}
	},
	1
);

