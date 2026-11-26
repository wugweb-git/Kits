<?php
/**
 * Source types: the ways an item can enter SourceWeb (step 1 and 2). One list, so Sources can show them together and a
 * plugin can add its own through the `sourceweb_source_types` filter. No WordPress here, so tests/run.php checks it.
 *
 * A type: id, label, method (how it fetches: feed, search, api, page, manual, social, push), runner (a workflow file id,
 * 'site' for the site itself, 'person' for someone adding it, or a plugin slug), screen (the tab where its list is kept),
 * and whether it is on by default.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SOURCEWEB_SOURCE_METHODS = array( 'feed', 'search', 'api', 'page', 'manual', 'social', 'push' );

/** The built-in types, from what the workers and screens do today. */
const SOURCEWEB_SOURCE_TYPES = array(
	array( 'id' => 'feed', 'label' => 'Feeds and hosts', 'method' => 'feed', 'runner' => 'sourcing', 'screen' => 'sources' ),
	array( 'id' => 'keyword-search', 'label' => 'Keyword searches', 'method' => 'search', 'runner' => 'sourcing', 'screen' => 'keywords' ),
	array( 'id' => 'press-search', 'label' => 'Press searches', 'method' => 'search', 'runner' => 'sourcing', 'screen' => 'keywords' ),
	array( 'id' => 'research-api', 'label' => 'Research papers (Europe PMC, Crossref)', 'method' => 'api', 'runner' => 'research', 'screen' => 'sources' ),
	array( 'id' => 'trends-api', 'label' => 'Rising terms (Trends, Wikipedia, GDELT)', 'method' => 'api', 'runner' => 'search-insights', 'screen' => 'keywords' ),
	array( 'id' => 'site-page', 'label' => 'Pages fetched from a site', 'method' => 'page', 'runner' => 'site', 'screen' => 'sources' ),
	array( 'id' => 'manual-link', 'label' => 'Add by link', 'method' => 'manual', 'runner' => 'person', 'screen' => 'review' ),
	array( 'id' => 'candidate-push', 'label' => 'Pushed by another plugin', 'method' => 'push', 'runner' => 'site', 'screen' => 'keywords' ),
);

/**
 * One type, tidied, or null when it cannot be one.
 *
 * @param array $t id, label, method, runner, screen.
 * @return array{id:string,label:string,method:string,runner:string,screen:string}|null
 */
function sourceweb_source_type_clean( array $t ): ?array {
	$id     = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $t['id'] ?? '' ) ) );
	$method = (string) ( $t['method'] ?? '' );
	if ( '' === $id || ! in_array( $method, SOURCEWEB_SOURCE_METHODS, true ) ) {
		return null;
	}
	return array(
		'id'     => $id,
		'label'  => '' !== trim( (string) ( $t['label'] ?? '' ) ) ? trim( (string) $t['label'] ) : $id,
		'method' => $method,
		'runner' => strtolower( preg_replace( '/[^a-z0-9_.-]/i', '', (string) ( $t['runner'] ?? '' ) ) ),
		'screen' => strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $t['screen'] ?? '' ) ) ),
	);
}

/**
 * A list of types, tidied: bad ones dropped, a later one with the same id replaces an earlier one.
 *
 * @param array $types Raw types.
 * @return array<string, array> id => type.
 */
function sourceweb_source_types_clean( array $types ): array {
	$out = array();
	foreach ( $types as $t ) {
		$c = is_array( $t ) ? sourceweb_source_type_clean( $t ) : null;
		if ( $c ) {
			$out[ $c['id'] ] = $c;
		}
	}
	return $out;
}
