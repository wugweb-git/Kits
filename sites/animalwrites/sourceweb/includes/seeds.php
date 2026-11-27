<?php
/**
 * Animal Writes: the starter source list, the two one-time list seeds and the defaults that SourceWeb 0.4.0 no longer
 * assumes for every site (filters), restored here. Loaded by ../site.php.
 *
 * @package animalwrites-sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The starter list for aw_sources (from data/sources-seed.json), used once when the option does not exist. */
add_filter(
	'sourceweb_starter_sources',
	function ( $starter ) {
		$c = json_decode( (string) file_get_contents( dirname( __DIR__ ) . '/data/sources-seed.json' ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		return is_array( $c ) ? $c : $starter;
	}
);

/** The relay allow list of before phase 1 (a site that saved its own list keeps it). */
add_filter(
	'sourceweb_relay_default_hosts',
	function () {
		return array( 'substack.com', 'zoomtventertainment.com', 'awbi.gov.in', 'ccsea.gov.in', 'egazette.gov.in' );
	}
);

/** Publishers whose items count as legal sources for Legal Watch. */
add_filter(
	'sourceweb_legal_hosts',
	function () {
		return array( 'livelaw.in', 'barandbench.com', 'scobserver.in', 'pib.gov.in', 'awbi.gov.in', 'sci.gov.in', 'indiankanoon.org', 'egazette.gov.in' );
	}
);

/** The Animal Welfare Board of India as an issuer, with its short name for card chips. */
add_filter(
	'sourceweb_issuers_base',
	function ( $base ) {
		return array_merge( (array) $base, array( 'awbi' => 'Animal Welfare Board of India' ) );
	}
);
add_filter(
	'sourceweb_issuer_short_defaults',
	function ( $short ) {
		return array_merge( (array) $short, array( 'awbi' => 'AWBI' ) );
	}
);

/** The workers' repository, for the links on the Workers screen. */
add_filter(
	'sourceweb_workers_repo',
	function () {
		return 'wugweb-git/animal-writes-workers';
	}
);

/** The first publisher lists, used once when the publisher records are seeded on a new site (as SourceWeb 0.3.x did). */
add_filter(
	'sourceweb_default_blocked_publishers',
	function () {
		return array( 'bollyspice.com', 'storyboard18.com' );
	}
);
add_filter(
	'sourceweb_default_allowed_publishers',
	function () {
		return array( 'thehindu.com', 'indianexpress.com', 'hindustantimes.com', 'timesofindia.indiatimes.com', 'ndtv.com', 'theprint.in', 'scroll.in', 'thewire.in', 'newindianexpress.com', 'deccanherald.com', 'indiatoday.in', 'news18.com', 'aninews.in', 'ptinews.com', 'wionews.com', 'mid-day.com', 'thenewsmill.com', 'kashmirobserver.net', 'downtoearth.org.in', 'news.mongabay.com', 'livelaw.in', 'barandbench.com', 'scobserver.in', 'pib.gov.in', 'awbi.gov.in', 'petaindia.com' );
	}
);

/** Seed (once): blocked publishers from the owner's list (S3.5). */
add_action(
	'init',
	function () {
		if ( '1' === get_option( 'aw_sourcing_seed_s35' ) || ! function_exists( 'sourceweb_publishers' ) ) {
			return;
		}
		$pubs = sourceweb_publishers();
		foreach ( array( 'bollyspice.com', 'storyboard18.com', 'in.eventfaqs.com' ) as $h ) {
			$pubs[ $h ] = array_merge( array( 'name' => '', 'count' => 0, 'first' => current_time( 'Y-m-d' ), 'last' => '' ), $pubs[ $h ] ?? array(), array( 'status' => 'block' ) );
		}
		update_option( SOURCEWEB_PUB_OPTION, $pubs, false );
		sourceweb_sources_config();
		update_option( 'aw_sourcing_seed_s35', '1', false );
	}
);

/**
 * Seed (once): the High Court judgments source (owner, 25 Oct 2026). The seed file is read only when the lists do not
 * exist yet, so the live lists get it here: added after the Supreme Court source, off, for the owner to turn on in
 * Feeds after checking the workers' dry run. A list that already has it is left as it is.
 */
add_action(
	'init',
	function () {
		if ( '1' === get_option( 'aw_sourcing_seed_hc' ) || ! function_exists( 'sourceweb_sources_config' ) ) {
			return;
		}
		$c       = sourceweb_sources_config();
		$sources = array_values( (array) ( $c['sources'] ?? array() ) );
		$ids     = array_column( $sources, 'id' );
		if ( ! in_array( 'judgments-high-courts', $ids, true ) ) {
			$hc  = array(
				'id'            => 'judgments-high-courts',
				'name'          => 'High Court judgments (open dataset, CC BY 4.0)',
				'kind'          => 'judgments-hc',
				'type'          => 'legal',
				'url'           => 'https://indian-high-court-judgments.s3.ap-south-1.amazonaws.com/', // phpcs:ignore PluginCheck.CodeAnalysis.Offloading.OffloadedContent -- a source's address to read, not a file the page loads
				'lookback_days' => 60,
				'on'            => false,
				'filter'        => false,
			);
			$at  = array_search( 'judgments-supreme-court', $ids, true );
			$pos = false === $at ? count( $sources ) : $at + 1;
			array_splice( $sources, $pos, 0, array( $hc ) );
			$c['sources'] = $sources;
			update_option( 'aw_sources', $c, false );
		}
		update_option( 'aw_sourcing_seed_hc', '1', false );
	}
);
