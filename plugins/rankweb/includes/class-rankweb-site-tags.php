<?php
/**
 * Site-wide tags: search-engine verification meta tags, and robots.txt rules that keep chosen crawlers out. Pure PHP, no
 * WordPress, so tests/SiteTagsTest.php runs it.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Verification tags and crawler rules. */
final class RankWeb_Site_Tags {

	/** Verification meta names by service. */
	const VERIFY = array(
		'google'    => 'google-site-verification',
		'bing'      => 'msvalidate.01',
		'yandex'    => 'yandex-verification',
		'pinterest' => 'p:domain_verify',
	);

	/** Crawlers people often keep out (name => what it is). A starting list for the settings help. */
	const KNOWN_AI = array(
		'GPTBot'          => 'OpenAI training',
		'ChatGPT-User'    => 'OpenAI, a person asking',
		'OAI-SearchBot'   => 'OpenAI search',
		'ClaudeBot'       => 'Anthropic training',
		'Claude-User'     => 'Anthropic, a person asking',
		'Google-Extended' => 'Google AI training',
		'CCBot'           => 'Common Crawl',
		'PerplexityBot'   => 'Perplexity',
		'Bytespider'      => 'ByteDance',
		'Applebot-Extended' => 'Apple AI training',
	);

	/**
	 * The verification meta tags.
	 *
	 * @param array $codes service => code (a bare code, or the whole tag pasted: the content is taken out).
	 * @return string[] Ready-made <meta> tags (values escaped by the caller-supplied $esc).
	 */
	public static function verify_tags( array $codes, callable $esc ): array {
		$out = array();
		foreach ( self::VERIFY as $svc => $name ) {
			$code = self::code( (string) ( $codes[ $svc ] ?? '' ) );
			if ( '' !== $code ) {
				$out[] = '<meta name="' . $name . '" content="' . $esc( $code ) . '" />';
			}
		}
		return $out;
	}

	/** A code from what was typed: a pasted tag gives its content. Only letters, digits, - _ . : are kept. */
	public static function code( string $raw ): string {
		if ( preg_match( '/content\s*=\s*["\']([^"\']+)["\']/i', $raw, $m ) ) {
			$raw = $m[1];
		}
		return (string) preg_replace( '/[^A-Za-z0-9._:\-]/', '', trim( $raw ) );
	}

	/**
	 * robots.txt with a "Disallow: /" group for each chosen crawler that has no group yet.
	 *
	 * @param string   $txt  The robots.txt text.
	 * @param string[] $bots Crawler names.
	 */
	public static function robots( string $txt, array $bots ): string {
		$add = '';
		foreach ( array_unique( array_filter( array_map( array( __CLASS__, 'bot' ), $bots ) ) ) as $bot ) {
			if ( preg_match( '/^\s*User-agent:\s*' . preg_quote( $bot, '/' ) . '\s*$/mi', $txt ) ) {
				continue;
			}
			$add .= "\nUser-agent: $bot\nDisallow: /\n";
		}
		return '' === $add ? $txt : rtrim( $txt ) . "\n" . $add;
	}

	/** A crawler name, cleaned ('' when it is not one). */
	public static function bot( string $name ): string {
		$name = trim( $name );
		return preg_match( '/^[A-Za-z0-9._\-]{2,60}$/', $name ) ? $name : '';
	}
}
