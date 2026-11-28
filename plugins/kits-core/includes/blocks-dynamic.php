<?php
/**
 * The Kits blocks that WordPress has no native way to make (blocks spec, 18 Nov 2026): countdown, metric, share,
 * sticky action, letter, sponsored, socials. All render on the server, so saved content never goes stale and an old page shows
 * the new look. Where a block needs data the site holds, it asks a `kits_*` filter and the site answers:
 *
 * The filters, with what each returns:
 *
 *   kits_countdown_date( $date )         the close date when the block has none (YYYY-MM-DD)
 *   kits_metric_value( $value, $key )    the number for a key (null when none)
 *   kits_sponsored_items( $items )       rows of [ name, url, text ]
 *   kits_social_profiles( $urls )        addresses for the Socials block when it has none of its own (default: the
 *                                        profiles Rank Math holds, as Theme Options → Socials lists them)
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/blocks-model.php';

add_action(
	'init',
	function () {
		$map = array(
			'countdown'  => 'kits_render_countdown',
			'metric'     => 'kits_render_metric',
			'share'      => 'kits_render_share',
			'sticky-cta' => 'kits_render_sticky_cta',
			'letter'     => 'kits_render_letter',
			'sponsored'  => 'kits_render_sponsored',
			'socials'    => 'kits_render_socials',
		);
		foreach ( $map as $dir => $cb ) {
			register_block_type_from_metadata( KITS_CORE_DIR . 'blocks/' . $dir, array( 'render_callback' => $cb ) );
		}
	}
);

/**
 * Days left to a date.
 *
 * @param array $a Block attributes.
 */
function kits_render_countdown( array $a ): string {
	$date = (string) ( $a['date'] ?? '' );
	if ( '' === $date ) {
		$date = (string) apply_filters( 'kits_countdown_date', '' );
	}
	$days = kits_countdown_days( $date, wp_date( 'Y-m-d' ) );
	if ( null === $days ) {
		return '';
	}
	$label = (string) ( $a['label'] ?? '' );
	if ( $days < 0 ) {
		$text = __( 'Closed', 'kits-core' );
		$num  = '';
	} elseif ( 0 === $days ) {
		$text = __( 'Last day', 'kits-core' );
		$num  = '';
	} else {
		$num  = number_format_i18n( $days );
		$text = _n( 'day left', 'days left', $days, 'kits-core' );
	}
	return '<p ' . get_block_wrapper_attributes( array( 'class' => 'kits-countdown' ) ) . '><time datetime="' . esc_attr( $date ) . '">'
		. ( '' !== $num ? '<strong class="kits-countdown__n">' . esc_html( $num ) . '</strong> ' : '' )
		. '<span class="kits-countdown__t">' . esc_html( $text ) . '</span></time>'
		. ( '' !== $label ? ' <span class="kits-countdown__l">' . esc_html( $label ) . '</span>' : '' ) . '</p>';
}

/**
 * A number with a label, once it reaches its threshold.
 *
 * @param array $a Block attributes.
 */
function kits_render_metric( array $a ): string {
	$key   = sanitize_key( (string) ( $a['key'] ?? '' ) );
	$value = apply_filters( 'kits_metric_value', null, $key );
	if ( ! kits_metric_show( $value, (int) ( $a['min'] ?? 0 ) ) ) {
		return '';
	}
	return '<p ' . get_block_wrapper_attributes( array( 'class' => 'kits-metric' ) ) . '><strong class="kits-metric__n">' . esc_html( kits_metric_format( $value ) ) . '</strong> <span class="kits-metric__l">' . esc_html( (string) ( $a['label'] ?? '' ) ) . '</span></p>';
}

/**
 * The share bar for the current page (kits_share_html(), share.php).
 *
 * @param array $a Block attributes.
 */
function kits_render_share( array $a ): string {
	if ( ! function_exists( 'kits_share_html' ) ) {
		return '';
	}
	$id    = get_the_ID();
	$url   = $id ? get_permalink( $id ) : home_url( '/' );
	$title = $id ? get_the_title( $id ) : get_bloginfo( 'name' );
	$args  = '' !== (string) ( $a['button'] ?? '' ) ? array( 'button' => (string) $a['button'] ) : array();
	return '<div ' . get_block_wrapper_attributes( array( 'class' => 'kits-share-block' ) ) . '>' . kits_share_html( (string) $url, wp_strip_all_tags( (string) $title ), null, '', $args ) . '</div>';
}

/**
 * One action bar fixed to the bottom on phones.
 *
 * @param array $a Block attributes.
 */
function kits_render_sticky_cta( array $a ): string {
	$href  = (string) ( $a['href'] ?? '' );
	$label = (string) ( $a['label'] ?? '' );
	if ( '' === $href || '' === $label ) {
		return '';
	}
	return '<div ' . get_block_wrapper_attributes( array( 'class' => 'kits-sticky-cta' ) ) . '><a class="kits-sticky-cta__a" href="' . esc_url( $href ) . '">' . esc_html( $label ) . '</a></div>';
}

/**
 * The letter tool: grounds as checkboxes, the letter built by view.js (no script: the grounds and a mail link).
 *
 * @param array $a Block attributes.
 */
function kits_render_letter( array $a ): string {
	$grounds = kits_block_lines( (string) ( $a['grounds'] ?? '' ) );
	if ( ! $grounds ) {
		return '';
	}
	$ticked = array_map( 'trim', explode( ',', (string) ( $a['ticked'] ?? '' ) ) );
	$cfg    = array(
		'to'      => sanitize_email( (string) ( $a['to'] ?? '' ) ),
		'subject' => wp_strip_all_tags( (string) ( $a['subject'] ?? '' ) ),
		'salute'  => wp_strip_all_tags( (string) ( $a['salute'] ?? '' ) ),
		'intro'   => wp_strip_all_tags( (string) ( $a['intro'] ?? '' ) ),
		'closing' => wp_strip_all_tags( (string) ( $a['closing'] ?? '' ) ),
		'sign'    => wp_strip_all_tags( (string) ( $a['sign'] ?? '' ) ),
	);
	$id     = wp_unique_id( 'kits-letter-' );
	$out    = '<div ' . get_block_wrapper_attributes(
		array(
			'class'            => 'kits-letter',
			'data-kits-letter' => wp_json_encode( $cfg ),
		)
	) . '>';
	$out   .= '<fieldset class="kits-letter__grounds"><legend>' . esc_html__( 'Tick the grounds to include', 'kits-core' ) . '</legend>';
	foreach ( $grounds as $i => $g ) {
		$out .= '<label class="kits-letter__g"><input type="checkbox" value="' . esc_attr( $g ) . '"' . ( in_array( (string) ( $i + 1 ), $ticked, true ) ? ' checked' : '' ) . '> <span>' . esc_html( $g ) . '</span></label>';
	}
	$out .= '</fieldset><label class="kits-letter__l" for="' . esc_attr( $id ) . '-name">' . esc_html__( 'Your name', 'kits-core' ) . '</label><input id="' . esc_attr( $id ) . '-name" class="kits-letter__name" type="text" autocomplete="name">';
	$out .= '<label class="kits-letter__l" for="' . esc_attr( $id ) . '-text">' . esc_html__( 'Your letter', 'kits-core' ) . '</label><textarea id="' . esc_attr( $id ) . '-text" class="kits-letter__text" rows="12" readonly></textarea>';
	$out .= '<p class="kits-letter__actions"><a class="kits-letter__btn kits-letter__gmail" target="_blank" rel="noopener noreferrer" href="#">' . esc_html__( 'Open in Gmail', 'kits-core' ) . '</a> <a class="kits-letter__btn kits-letter__mail" href="#">' . esc_html__( 'Open in your email app', 'kits-core' ) . '</a> <button type="button" class="kits-letter__btn kits-letter__copy">' . esc_html__( 'Copy the letter', 'kits-core' ) . '</button></p><p class="screen-reader-text" role="status" aria-live="polite"></p></div>';
	return $out;
}

/**
 * Sponsored slots, labelled, with rel="sponsored".
 *
 * @param array $a Block attributes.
 */
function kits_render_sponsored( array $a ): string {
	$rows = array();
	foreach ( kits_block_lines( (string) ( $a['items'] ?? '' ) ) as $line ) {
		$p      = array_map( 'trim', explode( '|', $line ) );
		$rows[] = array(
			'name' => $p[0] ?? '',
			'url'  => $p[1] ?? '',
			'text' => $p[2] ?? '',
		);
	}
	$items = kits_sponsored_clean( (array) apply_filters( 'kits_sponsored_items', $rows ) );
	if ( ! $items ) {
		return '';
	}
	$out = '<aside ' . get_block_wrapper_attributes(
		array(
			'class'      => 'kits-sponsored',
			'aria-label' => __( 'Sponsored', 'kits-core' ),
		)
	) . '><p class="kits-sponsored__tag">' . esc_html__( 'Sponsored', 'kits-core' ) . '</p>';
	if ( '' !== (string) ( $a['heading'] ?? '' ) ) {
		$out .= '<h2 class="kits-sponsored__h">' . esc_html( (string) $a['heading'] ) . '</h2>';
	}
	$out .= '<ul class="kits-sponsored__list">';
	foreach ( $items as $i ) {
		$out .= '<li><a href="' . esc_url( $i['url'] ) . '" rel="sponsored noopener" target="_blank">' . esc_html( $i['name'] ) . '</a>' . ( '' !== $i['text'] ? ' <span>' . esc_html( $i['text'] ) . '</span>' : '' ) . '</li>';
	}
	return $out . '</ul></aside>';
}

/**
 * The site's social profile addresses: Rank Math's (Facebook, X, extra profiles), the same ones Theme Options → Socials
 * lists. A site changes them with the filter kits_social_profiles.
 *
 * @return string[]
 */
function kits_social_profiles(): array {
	$rm   = (array) get_option( 'rank-math-options-titles', array() );
	$urls = array();
	if ( ! empty( $rm['social_url_facebook'] ) ) {
		$urls[] = (string) $rm['social_url_facebook'];
	}
	$x = ltrim( trim( (string) ( $rm['twitter_author_names'] ?? '' ) ), '@' ); // a handle, not an address.
	if ( preg_match( '/^[A-Za-z0-9_]{1,15}$/', $x ) ) {
		$urls[] = 'https://x.com/' . $x;
	}
	foreach ( kits_block_lines( (string) ( $rm['social_additional_profiles'] ?? '' ) ) as $u ) {
		$urls[] = $u;
	}
	return array_map( 'strval', (array) apply_filters( 'kits_social_profiles', $urls ) );
}

/**
 * The social profiles as a list of links. Server rendered and escaped; plain text links, so nothing is fetched from
 * another site and no script runs. The block's own list (one address per line) wins over the site's.
 *
 * @param array $a Block attributes.
 */
function kits_render_socials( array $a ): string {
	$own   = kits_block_lines( (string) ( $a['profiles'] ?? '' ) );
	$items = kits_socials_clean( $own ? $own : kits_social_profiles() );
	if ( ! $items ) {
		return '';
	}
	$out = '<nav ' . get_block_wrapper_attributes(
		array(
			'class'      => 'kits-socials',
			'aria-label' => '' !== (string) ( $a['heading'] ?? '' ) ? (string) $a['heading'] : __( 'Social profiles', 'kits-core' ),
		)
	) . '>';
	if ( '' !== (string) ( $a['heading'] ?? '' ) ) {
		$out .= '<h2 class="kits-socials__h">' . esc_html( (string) $a['heading'] ) . '</h2>';
	}
	$out .= '<ul class="kits-socials__list">';
	foreach ( $items as $i ) {
		$out .= '<li><a href="' . esc_url( $i['url'] ) . '" rel="me noopener" target="_blank">' . esc_html( $i['label'] ) . '<span class="screen-reader-text"> ' . esc_html__( '(opens in a new tab)', 'kits-core' ) . '</span></a></li>';
	}
	return $out . '</ul></nav>';
}
