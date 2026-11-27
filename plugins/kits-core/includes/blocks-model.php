<?php
/**
 * The Kits blocks' own logic as plain PHP (no WordPress calls), so tests/blocks-tests.php runs without WordPress:
 * days left, whether a metric shows, a safe address, the sponsored list.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Whole days from today to a date (YYYY-MM-DD): 0 on the day, negative after, null for a date that is not one.
 *
 * @param string $date  The date.
 * @param string $today Today, YYYY-MM-DD.
 */
function kits_countdown_days( string $date, string $today ): ?int {
	if ( ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $date, $a ) || ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $today, $b ) || ! checkdate( (int) $a[2], (int) $a[3], (int) $a[1] ) ) {
		return null;
	}
	return (int) round( ( gmmktime( 0, 0, 0, (int) $a[2], (int) $a[3], (int) $a[1] ) - gmmktime( 0, 0, 0, (int) $b[2], (int) $b[3], (int) $b[1] ) ) / DAY_SECONDS_KITS );
}

const DAY_SECONDS_KITS = 86400;

/**
 * Whether a metric shows: a number at or above its threshold. No number, or a number under the threshold, shows nothing.
 *
 * @param mixed $value The number from the site (null when it has none).
 * @param int   $min   The threshold (0: always).
 */
function kits_metric_show( $value, int $min ): bool {
	return is_numeric( $value ) && (float) $value >= $min;
}

/**
 * A number for a page: whole numbers with thousands separators the Indian way are the site's job; here, plain grouping.
 *
 * @param mixed $value The number.
 */
function kits_metric_format( $value ): string {
	$n = (float) $value;
	return floor( $n ) === $n ? number_format( $n, 0, '.', ',' ) : rtrim( rtrim( number_format( $n, 2, '.', ',' ), '0' ), '.' );
}

/**
 * Lines of a text field as a clean list: trimmed, empty lines dropped, at most $max.
 *
 * @param string $text The field.
 * @param int    $max  The most lines.
 * @return string[]
 */
function kits_block_lines( string $text, int $max = 30 ): array {
	$out = array();
	foreach ( preg_split( '/\R/', $text ) as $line ) {
		$line = trim( $line );
		if ( '' !== $line ) {
			$out[] = $line;
		}
	}
	return array_slice( $out, 0, $max );
}

/**
 * Sponsored items cleaned: each needs a name and an https address; the rest is dropped.
 *
 * @param array $items Rows of [ 'name' => …, 'url' => …, 'text' => … ].
 * @return array[]
 */
function kits_sponsored_clean( array $items ): array {
	$out = array();
	foreach ( $items as $i ) {
		if ( ! is_array( $i ) ) {
			continue;
		}
		$name = trim( wp_strip_all_tags_kits( (string) ( $i['name'] ?? '' ) ) );
		$url  = trim( (string) ( $i['url'] ?? '' ) );
		if ( '' === $name || 0 !== strpos( $url, 'https://' ) ) {
			continue;
		}
		$out[] = array(
			'name' => $name,
			'url'  => $url,
			'text' => trim( wp_strip_all_tags_kits( (string) ( $i['text'] ?? '' ) ) ),
		);
	}
	return $out;
}

/**
 * Clean a list of social profile addresses for the Socials block: https only, no duplicates, at most 12, each with a
 * label (the network's name, else the host). No request is made.
 *
 * @param array $raw Addresses or handles.
 * @return array<int,array{label:string,url:string}>
 */
function kits_socials_clean( array $raw ): array {
	$names = array(
		'facebook.com'  => 'Facebook',
		'x.com'         => 'X',
		'twitter.com'   => 'X',
		'instagram.com' => 'Instagram',
		'linkedin.com'  => 'LinkedIn',
		'youtube.com'   => 'YouTube',
		'youtu.be'      => 'YouTube',
		'tiktok.com'    => 'TikTok',
		'pinterest.com' => 'Pinterest',
		'threads.net'   => 'Threads',
		'whatsapp.com'  => 'WhatsApp',
		'wa.me'         => 'WhatsApp',
		't.me'          => 'Telegram',
		'github.com'    => 'GitHub',
	);
	$out  = array();
	$seen = array();
	foreach ( $raw as $item ) {
		$url = trim( (string) $item );
		if ( 0 !== strpos( $url, 'https://' ) || preg_match( '/[\s"<>]/', $url ) ) {
			continue;
		}
		$host = strtolower( (string) wp_parse_url_kits( $url ) );
		if ( '' === $host || isset( $seen[ $url ] ) ) {
			continue;
		}
		$host          = preg_replace( '/^(www|m|mobile)\./', '', $host );
		$seen[ $url ]  = true;
		$out[]         = array(
			'label' => $names[ $host ] ?? $host,
			'url'   => $url,
		);
		if ( count( $out ) >= 12 ) {
			break;
		}
	}
	return $out;
}

/**
 * The host of an address (stand-in for wp_parse_url so the model runs without WordPress).
 *
 * @param string $url Address.
 */
function wp_parse_url_kits( string $url ): string {
	$h = parse_url( $url, PHP_URL_HOST ); // phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url
	return is_string( $h ) ? $h : '';
}

/**
 * Tags out of a string (stand-in for wp_strip_all_tags so the model runs without WordPress).
 *
 * @param string $s Text.
 */
function wp_strip_all_tags_kits( string $s ): string {
	return trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $s ) ) );
}
