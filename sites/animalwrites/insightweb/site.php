<?php
/**
 * Animal Writes site layer for InsightWeb 1.2.0. Load as a must-use plugin (wp-content/mu-plugins/). It is not part of
 * the InsightWeb package: it holds what InsightWeb 1.1.x carried for this one site.
 *
 * - The links seed (links-seed.php, data/): runs on InsightWeb's action insightweb_si_links_seed, and `wp aw-si-links seed`.
 * - Visitor counting stays on for this site when its counter table already holds rows (InsightWeb 1.1.4 migration).
 * - Brand words, Rising lists, topic words and the public repository link of the Server tab's PHP errors.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/config-names.php'; // earlier wp-config.php names -> InsightWeb's INSIGHTWEB_ constants (before the plugin loads).
require_once __DIR__ . '/links-seed.php';

// Which content type plays which role for InsightWeb (scoring ladder, crawl check, indexing order, PageSpeed sample): the
// plugin names none of them.
add_filter(
	'insightweb_post_type_roles',
	fn() => array(
		'news'        => 'aw_news',
		'library'     => 'aw_legal',
		'campaign'    => 'aw_campaign',
		'opportunity' => 'aw_opportunity',
		'listing'     => 'aw_listing',
	)
);

// The seed, when InsightWeb installs or opens the Links tab; its markers go when Search Insights data is deleted.
add_action( 'insightweb_si_links_seed', fn() => insightweb_si_links_seed() );
add_action(
	'insightweb_si_dropped',
	function () {
		delete_option( 'aw_si_links_seeded' );
		delete_option( 'aw_si_links_seeded_20261102' );
	}
);

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command(
		'aw-si-links',
		/**
		 * Animal Writes links seed: `seed` adds the 25 Oct to 2 Nov 2026 lists (once; --force runs it again, which only moves dates).
		 *
		 * <what>
		 * : seed.
		 *
		 * [--force]
		 * : Run again.
		 */
		function ( $args, $assoc ) {
			if ( 'seed' !== (string) ( $args[0] ?? '' ) ) {
				WP_CLI::error( 'Say seed.' );
			}
			if ( function_exists( 'insightweb_si_install' ) ) {
				insightweb_si_install();
			}
			$out = insightweb_si_links_seed( ! empty( $assoc['force'] ) );
			WP_CLI::log( $out ? (string) wp_json_encode( $out ) : 'Already seeded (add --force to run again).' );
		}
	);
}

/**
 * InsightWeb 1.1.4 moved visitor counting to off by default, and kept it on for a site that already held counted rows.
 * Once, on a site with no choice stored: keep counting only when the table already holds rows. Moved unchanged from
 * InsightWeb 1.1.6 (insightweb_si_vis_migrate()).
 */
add_action(
	'admin_init',
	function () {
		if ( ! defined( 'INSIGHTWEB_SI_VIS_OPTION' ) || ! function_exists( 'insightweb_si_vis_table' ) || false !== get_option( INSIGHTWEB_SI_VIS_OPTION, false ) ) {
			return;
		}
		global $wpdb;
		$t        = insightweb_si_vis_table();
		$has      = $t === $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $t ) ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- one check, once
		$has_rows = $has && (bool) $wpdb->get_var( $wpdb->prepare( 'SELECT 1 FROM %i LIMIT 1', $t ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- one check, once
		update_option( INSIGHTWEB_SI_VIS_OPTION, $has_rows ? 1 : 0, true );
	},
	5
);

// Brand searches: Animal Writes in any spelling, and the old animalrights.in name (was InsightWeb's old brand constant).
add_filter( 'insightweb_brand_pattern', fn() => '/animal\s*-?\s*writ|animalwrit|animal\s*-?\s*rights?\s*\.\s*in|animalrights?\.in|india\s*writes/i' );

// Rising lists the worker reads: what InsightWeb 1.1.6 shipped as its defaults.
add_filter(
	'insightweb_si_rising_lists',
	function ( $lists ) {
		$lists['wikipedia']      = array( 'Rabies', 'Free-ranging dog', 'Indian pariah dog', 'Animal Welfare Board of India', 'Prevention of Cruelty to Animals Act, 1960', 'Wild Life (Protection) Act, 1972', 'Goshala', 'Cattle slaughter in India', 'Cow protection movement', 'Cow vigilante violence in India', 'Animal welfare and rights in India', 'Human–wildlife conflict', 'Project Tiger', 'Dog bite' );
		$lists['gdelt']          = array( 'stray dogs', 'dog bite', 'rabies', 'animal cruelty', 'gaushala', 'cow vigilante', 'human wildlife conflict', 'leopard attack', 'elephant death', 'animal welfare board' );
		$lists['autocomplete']   = array_values( array_unique( array_merge( array( 'stray dogs', 'street dogs', 'dog bite', 'rabies', 'animal welfare', 'animal cruelty', 'animal rescue', 'animal shelter', 'gaushala', 'veterinary hospital', 'pet adoption', 'abc rules', 'pca act', 'feeding stray dogs', 'wildlife rescue' ), array_slice( (array) ( $lists['interest'] ?? array() ), 0, 15 ) ) ) );
		$lists['trends_related'] = array( 'stray dogs', 'animal welfare', 'rabies', 'animal cruelty', 'gaushala' );
		$lists['anchor']         = 'animal welfare';
		$lists['exclude']        = array_merge( (array) ( $lists['exclude'] ?? array() ), array( 'bungo', 'meaning in', 'cricket', 'ipl', 'vs', 'odi', 't20', 'match', 'score', 'shroff', 'ott' ) );
		return $lists;
	}
);

// Animal names counted in the Sourcing spikes (InsightWeb 1.1.6 default list).
add_filter(
	'insightweb_si_species',
	function ( $list ) {
		return array_merge( (array) $list, array( 'dog', 'puppy', 'cat', 'kitten', 'cow', 'cattle', 'buffalo', 'calf', 'goat', 'sheep', 'pig', 'horse', 'donkey', 'mule', 'camel', 'monkey', 'macaque', 'langur', 'elephant', 'tiger', 'leopard', 'lion', 'cheetah', 'bear', 'deer', 'blackbuck', 'peacock', 'peafowl', 'pigeon', 'parrot', 'bird', 'vulture', 'eagle', 'owl', 'crow', 'snake', 'cobra', 'crocodile', 'turtle', 'tortoise', 'dolphin', 'whale', 'shark', 'pangolin', 'rhino', 'rhinoceros', 'wolf', 'jackal', 'hyena', 'boar', 'squirrel', 'rabbit', 'chicken', 'hen', 'poultry' ) );
	}
);

// The Server tab links a PHP error in these folders to the site's public repository.
add_filter( 'insightweb_si_srv_repo_dirs', fn() => array( 'animal-writes-core', 'aw-seo-extras', 'aw-sourcing', 'kits-core', 'mailweb', 'animal-writes', 'kits-by-wugweb' ) );
add_filter( 'insightweb_si_srv_repo_url', fn() => 'https://github.com/wugweb-git/animalwrites/blob/wordpress/' );
