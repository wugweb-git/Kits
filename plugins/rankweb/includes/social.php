<?php
/**
 * Social and feed settings (RankWeb → Settings): the twitter:site tag (needs RankWeb to print the page head) and a link
 * back to the site in each feed item. Module "social"; the rules are in class-rankweb-social.php.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-social.php';

add_filter(
	'rankweb_head_tags',
	function ( $tags ) {
		$h = defined( 'RANKWEB_TWITTER_SITE' ) ? RankWeb_Social::handle( RANKWEB_TWITTER_SITE ) : '';
		if ( '' !== $h && is_array( $tags ) ) {
			$tags[] = array( 'name', 'twitter:site', $h );
		}
		return $tags;
	}
);

$rankweb_feed_line = function ( $content ) {
	if ( ! defined( 'RANKWEB_FEED_SOURCE' ) || ! RANKWEB_FEED_SOURCE || ! is_feed() ) {
		return $content;
	}
	return $content . RankWeb_Social::feed_line(
		html_entity_decode( wp_strip_all_tags( get_the_title() ), ENT_QUOTES, 'UTF-8' ),
		(string) get_permalink(),
		html_entity_decode( (string) get_bloginfo( 'name' ), ENT_QUOTES, 'UTF-8' ),
		home_url( '/' ),
		static fn( $v, $kind ) => 'url' === $kind ? esc_url( $v ) : esc_html( $v )
	);
};
add_filter( 'the_content_feed', $rankweb_feed_line );
add_filter( 'the_excerpt_rss', $rankweb_feed_line );
