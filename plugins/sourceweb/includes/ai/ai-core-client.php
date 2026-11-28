<?php
/**
 * SourceWeb's text tasks that run inside WordPress (28 Nov 2026): where WordPress 7.0's AI client is there and has a
 * connection for text, SourceWeb asks it; keys then live in Settings > Connectors, per site, and SourceWeb holds none.
 * Everywhere else (WordPress before 7.0, or no connection set up in Connectors) it falls back to the connection the
 * administrator entered on the AI models tab (ai-keys.php): an OpenAI-compatible address, a model name and a key,
 * stored in this site's options. No provider, address, model or key is in the code.
 *
 * With neither, nothing runs: generate_text returns null and nothing is shown, no notice, no banner.
 *
 * The workers run outside WordPress (GitHub Actions) and cannot use the core client; they read the saved connections
 * from GET aw/v1/ai-keys (ai-keys.php).
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The core AI client can generate text here: the function exists and says so without making a request. */
function sourceweb_ai_core_ready(): bool {
	if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
		return false;
	}
	try {
		$b = wp_ai_client_prompt( 'ok' );
		return is_object( $b ) && method_exists( $b, 'is_supported_for_text_generation' ) && true === $b->is_supported_for_text_generation();
	} catch ( \Throwable $e ) {
		return false; // the client is switched off (wp_ai_client_prevent_prompt) or not set up
	}
}

/** The model the administrator prefers for the core client, as typed; '' = the client chooses. A preference only: the client may use another. */
function sourceweb_ai_model_preference(): string {
	return trim( (string) get_option( SOURCEWEB_AI_MODEL_PREFERENCE_OPTION, '' ) );
}

/** The first saved AI connection that works (or is only rate-limited for now), or null. */
function sourceweb_ai_connection(): ?array {
	foreach ( sourceweb_ai_rows() as $r ) {
		if ( ! sourceweb_ai_row_is_tool( $r ) && ! empty( $r['url'] ) && ! empty( $r['model'] ) && in_array( $r['status'], array( 'works', 'limited' ), true ) ) {
			return $r;
		}
	}
	return null;
}

/** Which source answers text tasks here: 'core', 'connection' or '' (none). */
function sourceweb_ai_text_source(): string {
	if ( sourceweb_ai_core_ready() ) {
		return 'core';
	}
	return null !== sourceweb_ai_connection() ? 'connection' : '';
}

/**
 * Generate text for a task inside WordPress.
 *
 * @param string $prompt The prompt.
 * @return string|WP_Error|null The text; an error when the call failed; null when there is nothing to ask (no core
 *                              connection and no saved one), so the caller simply skips the feature.
 */
function sourceweb_ai_generate_text( string $prompt ) {
	$via = sourceweb_ai_text_source();
	if ( 'core' === $via ) {
		$b    = wp_ai_client_prompt( $prompt );
		$pref = sourceweb_ai_model_preference();
		if ( '' !== $pref && method_exists( $b, 'using_model_preference' ) ) {
			$b = $b->using_model_preference( $pref ); // only a preference
		}
		return $b->generate_text();
	}
	if ( 'connection' !== $via ) {
		return null;
	}
	$c = sourceweb_ai_connection();
	$r = wp_remote_post(
		$c['url'] . '/chat/completions',
		array(
			'timeout'            => 45,
			'reject_unsafe_urls' => true,
			'headers'            => array( 'Authorization' => 'Bearer ' . $c['key'], 'content-type' => 'application/json' ),
			'body'               => wp_json_encode( array( 'model' => $c['model'], 'messages' => array( array( 'role' => 'user', 'content' => $prompt ) ) ) ),
		)
	);
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$code = (int) wp_remote_retrieve_response_code( $r );
	$json = json_decode( wp_remote_retrieve_body( $r ), true );
	$text = is_array( $json ) ? ( $json['choices'][0]['message']['content'] ?? null ) : null;
	if ( $code < 200 || $code >= 300 || ! is_string( $text ) ) {
		return new WP_Error( 'sourceweb_ai_failed', 'The AI connection did not answer (HTTP ' . $code . ').' );
	}
	return $text;
}
