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

// The earlier aw_* function names (they moved here from the plugin; each calls the rankweb_* function when it runs).
require_once __DIR__ . '/legacy-aliases.php';

// Which content type plays which role for RankWeb: the plugin names none of them.
add_filter(
	'rankweb_post_type_roles',
	fn() => array(
		'news'        => 'aw_news',
		'library'     => 'aw_legal',
		'campaign'    => 'aw_campaign',
		'opportunity' => 'aw_opportunity',
		'listing'     => 'aw_listing',
		'press'       => 'aw_press',
	)
);

// Defined before RankWeb loads (plugins_loaded 5), so the plugin's stand-ins step aside.
require_once __DIR__ . '/programmatic.php';

// What RankWeb 2.3.7 carried for this site and 2.4.0 no longer does (each file says where it came from).
require_once __DIR__ . '/listings.php';          // listing schema types and AWBI, hubs, Directory wording, country code.
require_once __DIR__ . '/schema-hubs.php';       // section-hub and Media & PR list schema, "mentions" on articles.
require_once __DIR__ . '/news-and-robots.php';   // /news-sitemap.xml, its robots.txt line, the Content-Signal line.
require_once __DIR__ . '/faq-data.php';          // the FAQ module's questions and rules for this site's content.

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
add_filter( 'rankweb_currency', fn() => 'INR' ); // free events: priceCurrency
add_filter( 'rankweb_schedule_timezone', fn() => 'Asia/Kolkata' ); // monthly events' scheduleTimezone
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


/* ---------- Seed redirects that were in RankWeb's redirects.php (moved here unchanged; they need RankWeb and Rank Math Redirections) ---------- */

/**
 * Seed redirects, added once per version to Rank Math's list (they can be edited or removed there afterwards; an exact
 * path already in the list is left alone). 12 Nov 2026: common city spellings that are not the Directory's district
 * slug (each checked as 404 on live, its target as 200), the old campaign addresses still asked for, and a removed
 * News item.
 */
const AW_SEED_REDIRECTS_VERSION = '1';
add_action(
	'init',
	function () {
		if ( ! function_exists( 'rankweb_rank_math_redirect' ) || AW_SEED_REDIRECTS_VERSION === get_option( 'aw_seed_redirects_version' ) || ! class_exists( '\RankMath\Redirections\Redirection' ) || ! \RankMath\Helper::is_module_active( 'redirections' ) || get_transient( 'aw_seed_redirects_wait' ) ) {
			return;
		}
		$exact = array(
			'directory/karnataka/bengaluru'                => '/directory/karnataka/bengaluru-urban/',
			'directory/karnataka/bangalore'                => '/directory/karnataka/bengaluru-urban/',
			'directory/karnataka/bangalore-urban'          => '/directory/karnataka/bengaluru-urban/',
			'directory/delhi/delhi'                        => '/directory/delhi/',
			'directory/assam/guwahati'                     => '/directory/assam/kamrup-metro/',
			'directory/haryana/gurgaon'                    => '/directory/haryana/gurugram/',
			'directory/uttar-pradesh/noida'                => '/directory/uttar-pradesh/gautam-buddha-nagar/',
			'directory/uttar-pradesh/gautam-buddh-nagar'   => '/directory/uttar-pradesh/gautam-buddha-nagar/',
			'campaign/lab-animal-rules-2026'               => '/campaigns/lab-animals-rules-2026/',
			'campaigns/draft-laboratory-animals-rules-2026' => '/campaigns/lab-animals-rules-2026/',
			'news/niagara-falls-man-charged-after-cat-found-severely-emaciated-at-motel' => '/news/',
		);
		$ok = true;
		foreach ( $exact as $from => $to ) {
			$ok = rankweb_rank_math_redirect( $from, home_url( $to ) ) && $ok;
		}
		// Any other /campaign/{slug}/ goes to /campaigns/{slug}/. Bare /campaign/ keeps its own exact rule.
		global $wpdb;
		$table = $wpdb->prefix . 'rank_math_redirections';
		$have  = (int) $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM %i WHERE sources LIKE %s', $table, '%' . $wpdb->esc_like( '^campaign/(.+?)/?$' ) . '%' ) ); // phpcs:ignore WordPress.DB
		if ( ! $have ) {
			$ok = rankweb_rank_math_redirect( '^campaign/(.+?)/?$', home_url( '/campaigns/$1/' ), 'regex' ) && $ok;
		}
		if ( $ok ) {
			update_option( 'aw_seed_redirects_version', AW_SEED_REDIRECTS_VERSION, false );
		} else {
			set_transient( 'aw_seed_redirects_wait', 1, HOUR_IN_SECONDS ); // a save failed: try again in an hour, not on every request
		}
	},
	20
);

/* ---------- Site values RankWeb's generic code asks for through filters (were in RankWeb's animal-writes-compat.php) ---------- */

// rankweb_site_default(): the WebSite and Organization nodes, the schema language and the share tags (standalone-seo.php).
foreach (
	array(
		'alt_names'    => array( 'AnimalWrites', 'Animal Writes India', 'animalwrites.in' ), // people search the brand under several names (12 Nov 2026)
		'same_as'      => array( 'https://www.facebook.com/profile.php?id=61596537146561', 'https://www.instagram.com/animal_writes_/', 'https://x.com/animal_writes_', 'https://www.linkedin.com/company/animalwrites/', 'https://www.threads.com/@animal_writes_' ),
		'email'        => 'contact@animalwrites.in',
		'language'     => 'en-IN',
		'country'      => 'IN',
		'country_name' => 'India',
		'languages'    => array( 'en', 'hi' ),
		'founded'      => '2025-11', // the first campaign (November 2025)
	) as $aw_site_key => $aw_site_value
) {
	add_filter( 'rankweb_site_default_' . $aw_site_key, fn() => $aw_site_value );
}
unset( $aw_site_key, $aw_site_value );

// The Directory's subject and country, after "the Animal Writes Directory" in a place's description (titles.php).
add_filter( 'rankweb_directory_scope', fn( $scope, $long = false ) => $long ? ' of animal welfare organisations in India' : ' of India', 10, 2 );

// The theme block that places the FAQ in an item template, the Breadcrumbs block's earlier name (kept as an alias so
// saved pages still render), and the block namespace whose blocks print run-time content (analysis.php).
add_filter( 'rankweb_faq_item_block', fn() => 'animal-writes/item-faq' );
add_filter( 'rankweb_breadcrumbs_legacy_block', fn() => 'animal-writes/breadcrumb' );
add_filter( 'rankweb_built_block_namespaces', fn( $spaces ) => array_merge( (array) $spaces, array( 'animal-writes' ) ) );
