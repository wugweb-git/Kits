<?php
/**
 * External services: every outside service SourceWeb can send data to, in one list, so the plugin's readme disclosure
 * can be checked against it and a plugin can add its own through the `sourceweb_external_services` filter. No
 * WordPress here, so tests/run.php checks it (it also fails when readme.txt stops naming a service).
 *
 * A service: id, name, host (what appears in the readme), when (the condition that switches it on), sends (what data
 * leaves the site), terms (its terms or privacy page).
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SOURCEWEB_EXTERNAL_SERVICES = array(
	array( 'id' => 'feeds', 'name' => 'Configured RSS/Atom Feeds & Publisher Websites', 'host' => '', 'when' => 'a feed or publisher is configured', 'sends' => 'the request for the feed, page, icon or PDF', 'terms' => '' ),
	array( 'id' => 'openverse', 'name' => 'Openverse API', 'host' => 'api.openverse.org', 'when' => 'CC0 fallback image search is on', 'sends' => 'search keywords', 'terms' => 'https://openverse.org/' ),
	array( 'id' => 'doi', 'name' => 'DOI / Crossref', 'host' => 'doi.org', 'when' => 'a research citation is resolved', 'sends' => 'the DOI', 'terms' => 'https://www.crossref.org/services/metadata-retrieval/' ),
	array( 'id' => 'google-places', 'name' => 'Google Places API', 'host' => 'places.googleapis.com', 'when' => 'a Google Places key is set', 'sends' => 'the stored Place ID', 'terms' => 'https://policies.google.com/privacy' ),
	array( 'id' => 'favicons', 'name' => 'Google favicon service', 'host' => 'www.google.com/s2/favicons', 'when' => 'a publisher icon is fetched', 'sends' => 'the publisher host name', 'terms' => 'https://policies.google.com/privacy' ),
	array( 'id' => 'images', 'name' => 'Image hosts and YouTube thumbnails', 'host' => 'i.ytimg.com', 'when' => 'an item\'s picture is checked or a copy is kept', 'sends' => 'the request for the image or page', 'terms' => '' ),
	array( 'id' => 'ai-openrouter', 'name' => 'OpenRouter', 'host' => 'openrouter.ai', 'when' => 'an OpenRouter key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://openrouter.ai/privacy' ),
	array( 'id' => 'ai-requesty', 'name' => 'Requesty', 'host' => 'router.requesty.ai', 'when' => 'a Requesty key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://www.requesty.ai/' ),
	array( 'id' => 'ai-cline', 'name' => 'Cline', 'host' => 'api.cline.bot', 'when' => 'a Cline key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://cline.bot/' ),
	array( 'id' => 'ai-commandcode', 'name' => 'Command Code', 'host' => 'api.commandcode.ai', 'when' => 'a Command Code key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://commandcode.ai/' ),
	array( 'id' => 'ai-nvidia', 'name' => 'NVIDIA', 'host' => 'integrate.api.nvidia.com', 'when' => 'an NVIDIA key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://www.nvidia.com/en-us/about-nvidia/privacy-policy/' ),
	array( 'id' => 'ai-vercel', 'name' => 'Vercel AI Gateway', 'host' => 'ai-gateway.vercel.sh', 'when' => 'a Vercel AI Gateway key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://vercel.com/legal/privacy-policy' ),
	array( 'id' => 'ai-huggingface', 'name' => 'Hugging Face', 'host' => 'router.huggingface.co', 'when' => 'a Hugging Face key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://huggingface.co/privacy' ),
	array( 'id' => 'ai-sambanova', 'name' => 'SambaNova', 'host' => 'api.sambanova.ai', 'when' => 'a SambaNova key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://sambanova.ai/privacy-policy' ),
	array( 'id' => 'ai-groq', 'name' => 'Groq', 'host' => 'api.groq.com', 'when' => 'a Groq key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://groq.com/privacy-policy' ),
	array( 'id' => 'ai-gemini', 'name' => 'Google Gemini', 'host' => 'generativelanguage.googleapis.com', 'when' => 'a Gemini key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://policies.google.com/privacy' ),
	array( 'id' => 'ai-mistral', 'name' => 'Mistral', 'host' => 'api.mistral.ai', 'when' => 'a Mistral key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://mistral.ai/terms' ),
	array( 'id' => 'ai-cerebras', 'name' => 'Cerebras', 'host' => 'api.cerebras.ai', 'when' => 'a Cerebras key is saved', 'sends' => 'a test prompt, then article text and prompts', 'terms' => 'https://www.cerebras.ai/privacy' ),
	array( 'id' => 'ai', 'name' => 'Configured AI Providers', 'host' => '', 'when' => 'an administrator saves a key', 'sends' => 'article text and prompts', 'terms' => '' ),
	array( 'id' => 'github', 'name' => 'GitHub Actions (workers repository)', 'host' => 'api.github.com', 'when' => 'an administrator sets a GitHub token and the workers repository and presses Run now', 'sends' => 'the workflow file name and its inputs, with the token', 'terms' => 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement' ),
	array( 'id' => 'relay', 'name' => 'Configured Worker Relay', 'host' => '', 'when' => 'a relay worker URL is set', 'sends' => 'fetch requests', 'terms' => '' ),
);

/**
 * One service, tidied, or null when it has no id or name.
 *
 * @param array $s id, name, host, when, sends, terms.
 * @return array|null
 */
function sourceweb_external_service_clean( array $s ): ?array {
	$id   = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $s['id'] ?? '' ) ) );
	$name = trim( (string) ( $s['name'] ?? '' ) );
	if ( '' === $id || '' === $name ) {
		return null;
	}
	return array(
		'id'    => $id,
		'name'  => $name,
		'host'  => strtolower( trim( (string) ( $s['host'] ?? '' ) ) ),
		'when'  => trim( (string) ( $s['when'] ?? '' ) ),
		'sends' => trim( (string) ( $s['sends'] ?? '' ) ),
		'terms' => trim( (string) ( $s['terms'] ?? '' ) ),
	);
}

/**
 * Tidies a list of services; a later one with the same id replaces an earlier one.
 *
 * @param array $list Raw services.
 * @return array<string, array> id => service.
 */
function sourceweb_external_services_clean( array $list ): array {
	$out = array();
	foreach ( $list as $s ) {
		$c = is_array( $s ) ? sourceweb_external_service_clean( $s ) : null;
		if ( $c ) {
			$out[ $c['id'] ] = $c;
		}
	}
	return $out;
}

/**
 * Names in a readme's "External services" section that the list does not cover, and listed services the readme does
 * not name. A service is named by its name, or its host when it has one.
 *
 * @param string $readme Readme text.
 * @param array  $services id => service.
 * @return string[] Problems; empty when they agree.
 */
function sourceweb_external_services_readme_gaps( string $readme, array $services ): array {
	$start = strpos( $readme, '== External services ==' );
	if ( false === $start ) {
		return array( 'no External services section' );
	}
	$end = strpos( $readme, "\n== ", $start + 5 );
	$sec = false === $end ? substr( $readme, $start ) : substr( $readme, $start, $end - $start );
	$bad = array();
	foreach ( $services as $s ) {
		if ( false === stripos( $sec, $s['name'] ) && ( '' === $s['host'] || false === stripos( $sec, $s['host'] ) ) ) {
			$bad[] = 'readme does not name ' . $s['name'];
		}
	}
	return $bad;
}
