<?php
/**
 * The worker union: one definition for every worker, wherever it runs (a workflow in the workers repository, a job
 * inside a plugin, a person's manual task). No WordPress here, so tests/run.php checks it.
 *
 * A definition: id, label, what, step (source, guard, enhance, platform), runner (workflow, plugin, person),
 * trigger (scheduled, after, manual, input), accepts (what a person can change: nothing, run-now, input),
 * ai (what AI job it uses, '' for none), place (a place id it serves, '' for any), late_after_h, owner.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SOURCEWEB_WORKER_STEPS = array( 'source', 'guard', 'enhance', 'platform' );

/** What the registry does not say about each workflow: its step and the AI job it does. */
const SOURCEWEB_WORKER_PROFILES = array(
	'sourcing'             => array( 'source', 'relevance, summary' ),
	'summary-rewrite'      => array( 'enhance', 'summary' ),
	'research'             => array( 'source', 'titles' ),
	'search-insights'      => array( 'source', '' ),
	'focus-keywords'       => array( 'enhance', 'titles' ),
	'seo-scores'           => array( 'enhance', '' ),
	'directory-enrichment' => array( 'enhance', 'search' ),
	'crawl-check'          => array( 'platform', '' ),
	'sources-sync'         => array( 'platform', '' ),
	'tests'                => array( 'platform', '' ),
	'keepalive'            => array( 'platform', '' ),
	'backup-offsite'       => array( 'platform', '' ),
);

/**
 * A definition from a registry entry (workers-registry.php) and the id.
 *
 * @param string $file Workflow file ('sourcing.yml').
 * @param array  $reg  The registry entry.
 * @return array
 */
function sourceweb_worker_from_registry( string $file, array $reg ): array {
	$id      = preg_replace( '/\.ya?ml$/i', '', $file );
	$profile = SOURCEWEB_WORKER_PROFILES[ $id ] ?? array( 'platform', '' );
	$trigger = ! empty( $reg['crons'] ) ? 'scheduled' : ( ! empty( $reg['after'] ) ? 'after' : ( ! empty( $reg['needs_input'] ) ? 'input' : 'manual' ) );
	return array(
		'id'           => $id,
		'label'        => (string) ( $reg['name'] ?? $id ),
		'what'         => (string) ( $reg['what'] ?? '' ),
		'step'         => $profile[0],
		'runner'       => 'workflow',
		'trigger'      => $trigger,
		'accepts'      => ! empty( $reg['needs_input'] ) ? 'input' : ( isset( $reg['runnow'] ) ? 'run-now' : 'nothing' ),
		'ai'           => $profile[1],
		'place'        => '',
		'late_after_h' => $reg['late_after_h'] ?? null,
		'owner'        => 'workers repository',
	);
}

/**
 * A definition tidied, or null when it cannot be one (no id, an unknown step or runner).
 *
 * @param array $w Raw definition (as a plugin registers it).
 * @return array|null
 */
function sourceweb_worker_clean( array $w ): ?array {
	$id = strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $w['id'] ?? '' ) ) );
	if ( '' === $id || ! in_array( $w['step'] ?? '', SOURCEWEB_WORKER_STEPS, true ) || ! in_array( $w['runner'] ?? '', array( 'workflow', 'plugin', 'person' ), true ) ) {
		return null;
	}
	return array(
		'id'           => $id,
		'label'        => '' !== trim( (string) ( $w['label'] ?? '' ) ) ? trim( (string) $w['label'] ) : $id,
		'what'         => trim( (string) ( $w['what'] ?? '' ) ),
		'step'         => $w['step'],
		'runner'       => $w['runner'],
		'trigger'      => in_array( $w['trigger'] ?? '', array( 'scheduled', 'after', 'manual', 'input' ), true ) ? $w['trigger'] : 'manual',
		'accepts'      => in_array( $w['accepts'] ?? '', array( 'nothing', 'run-now', 'input' ), true ) ? $w['accepts'] : 'nothing',
		'ai'           => trim( (string) ( $w['ai'] ?? '' ) ),
		'place'        => strtolower( preg_replace( '/[^a-z0-9_-]/i', '', (string) ( $w['place'] ?? '' ) ) ),
		'late_after_h' => isset( $w['late_after_h'] ) && is_numeric( $w['late_after_h'] ) ? (int) $w['late_after_h'] : null,
		'owner'        => trim( (string) ( $w['owner'] ?? '' ) ),
	);
}

/**
 * The union: the registry's workflows, then the workers plugins add. A plugin's worker cannot take a workflow's id.
 *
 * @param array $registry file => registry entry.
 * @param array $added    Raw definitions from plugins.
 * @return array<string, array> id => definition.
 */
function sourceweb_worker_union( array $registry, array $added ): array {
	$out = array();
	foreach ( $registry as $file => $reg ) {
		$d             = sourceweb_worker_from_registry( (string) $file, (array) $reg );
		$out[ $d['id'] ] = $d;
	}
	foreach ( $added as $w ) {
		$d = is_array( $w ) ? sourceweb_worker_clean( $w ) : null;
		if ( $d && ! isset( $out[ $d['id'] ] ) ) {
			$out[ $d['id'] ] = $d;
		}
	}
	return $out;
}
