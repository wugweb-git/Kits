<?php
/**
 * One-time move of the saved AI key rows (option aw_ai_models) to the generic connection fields (28 Nov 2026): kind
 * (ai or tool), url (the OpenAI-compatible base address) and model. REMOVABLE: delete this file, its require in
 * sourceweb.php and the test in tests/ai-connection-test.php once every site has run it (the flag option
 * sourceweb_ai_conn_migrated is set on each).
 *
 * Nothing is looked up. A row saved by the earlier versions already holds the provider's id, the base address that
 * answered (url) and the model that answered (model), so the migration copies those: no provider, address or model is
 * written in this plugin. A row with no address (a provider whose keys the workers call on their own) keeps its id,
 * model and status, so the workers read it as before. Idempotent: a row that has been migrated is returned as it is, and
 * the flag stops the second run.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SOURCEWEB_AI_CONN_MIGRATED_OPTION = 'sourceweb_ai_conn_migrated';

/**
 * The rows with kind, url and model set from what each row already holds. Pure.
 *
 * @param array $rows Saved rows.
 * @return array The same rows; a second call returns them unchanged.
 */
function sourceweb_ai_migrate_rows( array $rows ): array {
	$out = array();
	foreach ( $rows as $r ) {
		if ( ! is_array( $r ) ) {
			continue;
		}
		if ( ! isset( $r['kind'] ) || ! in_array( $r['kind'], array( 'ai', 'tool' ), true ) ) {
			$r['kind'] = 'tool' === ( $r['status'] ?? '' ) ? 'tool' : 'ai';
		}
		$r['url']   = sourceweb_ai_clean_url( (string) ( $r['url'] ?? '' ) );
		$r['model'] = 'tool' === $r['kind'] ? '' : (string) ( $r['model'] ?? '' );
		$out[]      = $r;
	}
	return $out;
}

/** Run once per site, before anything reads the rows. */
function sourceweb_ai_migrate_connections(): void {
	if ( get_option( SOURCEWEB_AI_CONN_MIGRATED_OPTION ) ) {
		return;
	}
	$rows = get_option( 'aw_ai_models', null );
	if ( is_array( $rows ) ) {
		$new = sourceweb_ai_migrate_rows( $rows );
		if ( $new !== $rows ) {
			update_option( 'aw_ai_models', $new, false );
		}
	}
	update_option( SOURCEWEB_AI_CONN_MIGRATED_OPTION, '1', false );
}
add_action( 'init', 'sourceweb_ai_migrate_connections', 5 );
