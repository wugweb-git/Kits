<?php
/**
 * AI jobs: what the workers ask a model to do, and what each job needs. Keys are matched by capability (the icons on the
 * AI models screen: text, fast, reasoning, long, search …), not attached to workers one by one. No WordPress here, so
 * tests/run.php checks it.
 *
 * A job lists the capabilities a model should have ('need': all of them score the job's best fit) and those that make it
 * a poor fit ('avoid'). Every usable key is still offered, best fit first, so a job never ends up with nothing.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SOURCEWEB_AI_JOBS = array(
	'relevance' => array( 'Relevance check', array( 'fast' ), array( 'slow' ) ),
	'summary'   => array( 'Summary', array( 'long' ), array() ),
	'rewrite'   => array( 'Rewrite a story with new facts', array( 'reasoning' ), array() ),
	'titles'    => array( 'Titles and keyphrases', array( 'fast' ), array( 'slow' ) ),
	'search'    => array( 'Find facts with a source', array( 'search' ), array() ),
);

/** The job a worker mostly does, for keys asked for by worker (workflow file id). */
const SOURCEWEB_AI_WORKER_JOBS = array(
	'sourcing'             => 'summary',
	'summary-rewrite'      => 'summary',
	'research'             => 'titles',
	'focus-keywords'       => 'titles',
	'directory-enrichment' => 'search',
);

/**
 * Orders served key rows for a job: those with the most needed capabilities first, those with an avoided capability
 * last, the rest in their given order (a stable sort, so the owner's order breaks ties).
 *
 * @param array  $rows Rows with a `provider`.
 * @param string $job  Job id.
 * @param array  $caps provider => list of capabilities (AW_AI_CAPS).
 * @return array Same rows, reordered. An unknown job leaves them as they are.
 */
function sourceweb_ai_order_for_job( array $rows, string $job, array $caps ): array {
	if ( ! isset( SOURCEWEB_AI_JOBS[ $job ] ) ) {
		return $rows;
	}
	list( , $need, $avoid ) = SOURCEWEB_AI_JOBS[ $job ];
	$score                  = static function ( array $r ) use ( $need, $avoid, $caps ): int {
		$has = (array) ( $caps[ $r['provider'] ?? '' ] ?? array() );
		return 10 * count( array_intersect( $need, $has ) ) - 20 * count( array_intersect( $avoid, $has ) );
	};
	$keyed = array();
	foreach ( array_values( $rows ) as $i => $r ) {
		$keyed[] = array( $score( $r ), $i, $r );
	}
	usort( $keyed, static fn( $a, $b ) => $b[0] <=> $a[0] ?: $a[1] <=> $b[1] );
	return array_column( $keyed, 2 );
}
