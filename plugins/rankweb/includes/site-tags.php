<?php
/**
 * Site-wide tags (RankWeb → Settings → Search engines and crawlers): verification meta tags for Google, Bing, Yandex and
 * Pinterest, and crawlers kept out in robots.txt. Both are empty until set. The verification tags print only when RankWeb
 * prints the head (Rank Math has its own box for them). Module "site-tags".
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-rankweb-site-tags.php';

add_action(
	'wp_head',
	function () {
		if ( function_exists( 'rankweb_prints_head' ) && ! rankweb_prints_head() ) {
			return;
		}
		$codes = array(
			'google'    => defined( 'RANKWEB_VERIFY_GOOGLE' ) ? RANKWEB_VERIFY_GOOGLE : '',
			'bing'      => defined( 'RANKWEB_VERIFY_BING' ) ? RANKWEB_VERIFY_BING : '',
			'yandex'    => defined( 'RANKWEB_VERIFY_YANDEX' ) ? RANKWEB_VERIFY_YANDEX : '',
			'pinterest' => defined( 'RANKWEB_VERIFY_PINTEREST' ) ? RANKWEB_VERIFY_PINTEREST : '',
		);
		foreach ( RankWeb_Site_Tags::verify_tags( $codes, 'esc_attr' ) as $tag ) {
			echo $tag . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- the name is a fixed string and the code was cleaned and escaped
		}
	},
	2
);

add_filter(
	'robots_txt',
	function ( $txt ) {
		$bots = defined( 'RANKWEB_BLOCK_CRAWLERS' ) ? (array) RANKWEB_BLOCK_CRAWLERS : array();
		return $bots ? RankWeb_Site_Tags::robots( (string) $txt, $bots ) : $txt;
	},
	60
);
