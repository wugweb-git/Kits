<?php
/**
 * Sourcing → AI models (a tab since 24 Oct 2026). Each row is one connection the administrator entered on this site: a
 * label, an OpenAI-compatible base address, a model name and a key (a tool connection: label, address and key). Nothing
 * is shipped in the code: no provider, address, model or key. One row per key, tried top to bottom, each kept separately.
 * Option aw_ai_models = list of {key, label, url, model, kind (ai|tool), provider (an id the workers pick it by), status,
 * checked, workers, caps?} (not autoloaded). workers: the worker IDs (workers-meta.php) the key is for; empty or missing =
 * every worker. The workers read the usable rows (GET /aw/v1/ai-keys; with ?worker=<id>, only the keys for that worker or
 * for all) and try them before their GitHub Actions secrets.
 *
 * On WordPress 7.0 and later the plugin's own text tasks use the core AI client first (ai-core-client.php), with the keys
 * saved under Settings > Connectors; these rows are for the workers, which run outside WordPress, and for older WordPress.
 * Administrators and the ingest user only.
 *
 * @package aw-sourcing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Kinds of connection a row can be. Nothing here names a provider: the administrator enters the label, the address and
 * the model (a "tool" connection has no model and is never tested as one).
 */
const SOURCEWEB_AI_KINDS = array(
	'ai'   => array( 'AI model', 'An OpenAI-compatible address, a model name and a key.' ),
	'tool' => array( 'Tool', 'Not an AI model: an address and a key a worker calls.' ),
);

/** What each connection can do, as icons (owner, 22 Oct 2026: "label like directories do"). dashicon, label. Rows may carry a `caps` list. */
const SOURCEWEB_AI_CAP_ICONS = array(
	'text'      => array( 'editor-paragraph', 'Text' ),
	'fast'      => array( 'performance', 'Fast' ),
	'reasoning' => array( 'lightbulb', 'Reasoning' ),
	'code'      => array( 'editor-code', 'Code' ),
	'vision'    => array( 'format-image', 'Images' ),
	'long'      => array( 'media-document', 'Long text' ),
	'slow'      => array( 'clock', 'Slow' ),
	'scrape'    => array( 'admin-site-alt3', 'Reads web pages' ),
	'search'    => array( 'search', 'Web search' ),
	'agent'     => array( 'admin-users', 'Web agent' ),
);

const SOURCEWEB_AI_STATUS = array(
	'card'       => 'Needs a card on file',
	'works'      => 'Works',
	'tool'       => 'Tool key, not an AI model',
	'no-credit'  => 'No credit',
	'limited'    => 'Rate-limited for now',
	'invalid'    => 'Key refused',
	'incomplete' => 'Address or model missing',
	'unchecked'  => 'Not checked yet',
	'no-model'   => 'No model answered',
);

/** The option holding the optional model preference passed to the WordPress AI client (empty = the client chooses). */
const SOURCEWEB_AI_MODEL_PREFERENCE_OPTION = 'sourceweb_ai_model_preference';

/**
 * A connection's base address, tidied: http or https only, no trailing slash, nothing else.
 *
 * @param string $url As typed.
 * @return string '' when it is not a web address.
 */
function sourceweb_ai_clean_url( string $url ): string {
	$url = trim( $url );
	if ( '' === $url || ! preg_match( '#^https?://[^\s/]+#i', $url ) ) {
		return '';
	}
	$url = (string) preg_replace( '#/chat/completions/?$#i', '', $url );
	return rtrim( function_exists( 'esc_url_raw' ) ? esc_url_raw( $url, array( 'http', 'https' ) ) : $url, '/' );
}

/** The host of a connection's address, for display. */
function sourceweb_ai_host( string $url ): string {
	$h = wp_parse_url( $url, PHP_URL_HOST );
	return is_string( $h ) ? $h : '';
}

/**
 * The id a row gets for the workers to pick it out by: the label as a slug, else the address' host as a slug. Rows saved
 * before 28 Nov 2026 keep the id they had.
 */
function sourceweb_ai_provider_id( string $label, string $url ): string {
	$id = sanitize_key( $label );
	return '' !== $id ? $id : sanitize_key( str_replace( '.', '-', sourceweb_ai_host( $url ) ) );
}

/** A connection's name for lists and the change log: its label, else the id it was saved with, else its host. */
function sourceweb_ai_row_name( array $row ): string {
	foreach ( array( (string) ( $row['label'] ?? '' ), (string) ( $row['provider'] ?? '' ), sourceweb_ai_host( (string) ( $row['url'] ?? '' ) ) ) as $n ) {
		if ( '' !== $n ) {
			return $n;
		}
	}
	return '';
}

/** A row is a tool connection (not an AI model). */
function sourceweb_ai_row_is_tool( array $row ): bool {
	return 'tool' === ( $row['kind'] ?? ( 'tool' === ( $row['status'] ?? '' ) ? 'tool' : 'ai' ) );
}

/**
 * The AI models screen's address.
 *
 * @param array $args Extra query args.
 * @return string
 */
function sourceweb_ai_keys_url( array $args = array() ) {
	return add_query_arg( $args, admin_url( 'admin.php?page=aw-sourcing&tab=ai' ) );
}

// Sourcing → AI models.
add_filter(
	'kits_sourcing_tabs',
	function ( $tabs ) {
		if ( current_user_can( 'manage_options' ) ) {
			$tabs['ai'] = array( 'AI models' );
		}
		return $tabs;
	}
);

// The old Settings → AI models address (bookmarks, links in notices and e-mails) opens the tab, with its query args.
// The page is no longer registered, so WordPress refuses it in wp-admin/menu.php before admin_init runs; the
// redirect hooks the refusal itself (admin_page_access_denied fires just before the "not allowed" screen).
add_action(
	'admin_page_access_denied',
	function () {
		global $pagenow;
		if ( 'options-general.php' === $pagenow && 'aw-ai-keys' === sanitize_key( $_GET['page'] ?? '' ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- a redirect only
			$args = array_map( 'sanitize_text_field', (array) wp_unslash( $_GET ) ); // phpcs:ignore WordPress.Security.NonceVerification
			unset( $args['page'] );
			wp_safe_redirect( sourceweb_ai_keys_url( array_map( 'rawurlencode', $args ) ), 301 );
			exit;
		}
	}
);

// Keys overview (&overview=1): help in the core Help tab.
add_action(
	'load-' . SOURCEWEB_SRC_SCREEN,
	function () {
		if ( 'ai' !== sanitize_key( $_GET['tab'] ?? '' ) ) { // phpcs:ignore WordPress.Security.NonceVerification -- which tab is shown
			return;
		}
		if ( ! isset( $_GET['overview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}
		get_current_screen()->add_help_tab(
			array(
				'id'      => 'aw-ai-overview',
				'title'   => 'Keys overview',
				'content' => '<p>A read-only view of every key saved on the AI models tab and of what each worker gets. Keys show only their last 4 characters. To change a key, use Edit on the AI models tab.</p>'
					. '<p><strong>Attached to</strong>: the workers a key is for. <em>All workers</em> means the key is attached to none, so every worker may use it, also workers added later.</p>'
					. '<p><strong>Usable keys per worker</strong>: what GET aw/v1/ai-keys serves that worker now: AI keys that work or are rate-limited for now, plus tool keys. A key that is not checked yet, refused or out of credit is not counted.</p>',
			)
		);
	}
);

/** Saved rows. First read converts the older per-provider keys (aw_ai_keys) into unchecked rows. */
function sourceweb_ai_rows(): array {
	$rows = get_option( 'aw_ai_models', null );
	if ( is_array( $rows ) ) {
		$rows = array_values( array_filter( $rows, fn( $r ) => is_array( $r ) && ! empty( $r['key'] ) ) );
		return array_map( fn( $r ) => isset( $r['status'] ) ? $r : sourceweb_ai_blank_row( $r['key'] ), $rows );
	}
	$rows = array();
	foreach ( (array) get_option( 'aw_ai_keys', array() ) as $v ) {
		foreach ( (array) ( is_array( $v ) ? $v : preg_split( '/[\s,]+/', (string) $v ) ) as $k ) {
			if ( '' !== trim( (string) $k ) ) {
				$rows[] = sourceweb_ai_blank_row( trim( (string) $k ) );
			}
		}
	}
	update_option( 'aw_ai_models', $rows, false );
	return $rows;
}

/** The saved rows as they are in the database now (skips this request's cached copy: a check or save may have run meanwhile). */
function sourceweb_ai_rows_fresh(): array {
	wp_cache_delete( 'aw_ai_models', 'options' );
	return sourceweb_ai_rows();
}

/** A short id for a key, used by the Remove button so the key itself never goes into the page. */
function sourceweb_ai_key_id( string $key ): string {
	return substr( hash( 'sha256', $key ), 0, 16 );
}

function sourceweb_ai_blank_row( string $key, array $conn = array() ): array {
	$kind  = 'tool' === ( $conn['kind'] ?? '' ) ? 'tool' : 'ai';
	$url   = sourceweb_ai_clean_url( (string) ( $conn['url'] ?? '' ) );
	$label = (string) ( $conn['label'] ?? '' );
	return array(
		'key'      => $key,
		'kind'     => $kind,
		'provider' => sourceweb_ai_provider_id( $label, $url ),
		'model'    => 'tool' === $kind ? '' : sanitize_text_field( (string) ( $conn['model'] ?? '' ) ),
		'url'      => $url,
		'status'   => 'unchecked',
		'checked'  => 0,
	);
}

/** The worker IDs a saved key is for; empty = every worker (owner, 24 Oct 2026; keys saved before have none). */
function sourceweb_ai_row_workers( array $row ): array {
	return array_values( array_filter( array_map( 'sanitize_key', (array) ( $row['workers'] ?? array() ) ) ) );
}

/** The key may be used by this worker: it is for every worker, or for this one. */
function sourceweb_ai_key_for_worker( array $row, string $worker ): bool {
	$ws = sourceweb_ai_row_workers( $row );
	return ! $ws || in_array( $worker, $ws, true );
}

/**
 * What GET aw/v1/ai-keys serves: the usable AI rows and the tool keys. Without a worker, every one (as before 24 Oct
 * 2026); with one, only the keys for that worker or for every worker.
 *
 * @param string $worker Worker ID ('' = all).
 * @return array{rows: array, tools: array}
 */
function sourceweb_ai_served( string $worker = '', string $job = '' ): array {
	$out   = array();
	$tools = array(); // Tool connections: the workers pick them out by provider (the id saved with the row)
	$caps  = array();
	foreach ( sourceweb_ai_rows() as $r ) {
		if ( '' !== $worker && ! sourceweb_ai_key_for_worker( $r, $worker ) ) {
			continue;
		}
		if ( sourceweb_ai_row_is_tool( $r ) ) {
			$tools[] = array( 'provider' => (string) $r['provider'], 'name' => sourceweb_ai_row_name( $r ), 'url' => (string) ( $r['url'] ?? '' ), 'key' => $r['key'] );
			continue;
		}
		if ( empty( $r['provider'] ) || ! in_array( $r['status'], array( 'works', 'limited' ), true ) ) {
			continue;
		}
		$caps[ $r['provider'] ] = array_values( array_filter( (array) ( $r['caps'] ?? array() ), 'is_string' ) );
		$out[]                  = array( 'provider' => $r['provider'], 'name' => sourceweb_ai_row_name( $r ), 'model' => $r['model'], 'url' => $r['url'] ? $r['url'] . '/chat/completions' : '', 'key' => $r['key'] );
	}
	if ( '' === $job && '' !== $worker ) {
		$job = SOURCEWEB_AI_WORKER_JOBS[ $worker ] ?? '';
	}
	return array( 'rows' => sourceweb_ai_order_for_job( $out, $job, $caps ), 'tools' => $tools );
}

/**
 * What sourceweb_ai_served() returns with every key cut to "…" and its last 4 characters.
 *
 * @param array $served { rows: array, tools: array }.
 * @return array The same shape.
 */
function sourceweb_ai_mask_served( array $served ): array {
	foreach ( array( 'rows', 'tools' ) as $group ) {
		foreach ( (array) ( $served[ $group ] ?? array() ) as $i => $r ) {
			if ( isset( $r['key'] ) ) {
				$served[ $group ][ $i ]['key'] = '…' . substr( (string) $r['key'], -4 );
			}
		}
	}
	return $served;
}

/** "…abcd (label)" for notices and the change log: never more of the key than its last 4. */
function sourceweb_ai_key_short( array $row ): string {
	$n = sourceweb_ai_row_name( $row );
	$n = '' !== $n ? $n : 'no label';
	return '…' . substr( (string) $row['key'], -4 ) . ' (' . $n . ( ! empty( $row['label'] ) ? ', ' . $row['label'] : '' ) . ')';
}

/** "all workers" or the workers' names, for the change log. */
function sourceweb_ai_workers_words( array $ids ): string {
	if ( ! $ids ) {
		return 'all workers';
	}
	return implode( ', ', array_map( fn( $id ) => function_exists( 'sourceweb_worker' ) && sourceweb_worker( $id ) ? sourceweb_worker( $id )['name'] . ' (' . $id . ')' : $id, $ids ) );
}

/**
 * HTTP status of a short test request to the connection's own address: a chat completion of a few tokens.
 *
 * @param string $url   Base address (no trailing slash).
 * @param string $key   Key.
 * @param string $model Model name.
 * @return array { status code (0 = no answer), lower-cased start of the body, headers }
 */
function sourceweb_ai_call( string $url, string $key, string $model ): array {
	$arg  = array(
		'timeout'            => 45, // some models take 20 s or more to answer
		'reject_unsafe_urls' => true,
		'headers'            => array( 'Authorization' => 'Bearer ' . $key, 'content-type' => 'application/json' ),
		'body'               => wp_json_encode( array( 'model' => $model, 'max_tokens' => 5, 'messages' => array( array( 'role' => 'user', 'content' => 'Say ok' ) ) ) ),
	);
	$r = wp_remote_post( $url . '/chat/completions', $arg );
	if ( is_wp_error( $r ) ) {
		return array( 0, '', array() );
	}
	$hd      = wp_remote_retrieve_headers( $r );
	$headers = array_change_key_case( is_object( $hd ) && method_exists( $hd, 'getAll' ) ? $hd->getAll() : (array) $hd, CASE_LOWER );
	return array( (int) wp_remote_retrieve_response_code( $r ), strtolower( substr( wp_remote_retrieve_body( $r ), 0, 3000 ) ), $headers );
}

/** Limits a connection reports on a test call (x-ratelimit headers, Retry-After, a retry delay in the body). */
function sourceweb_ai_limits( array $h, string $body, int $code ): array {
	$get   = fn( $k ) => isset( $h[ $k ] ) ? ( is_array( $h[ $k ] ) ? reset( $h[ $k ] ) : $h[ $k ] ) : null;
	$parts = array();
	foreach ( array( 'requests', 'tokens' ) as $what ) {
		$left  = $get( "x-ratelimit-remaining-$what" );
		$limit = $get( "x-ratelimit-limit-$what" );
		$reset = $get( "x-ratelimit-reset-$what" );
		if ( null !== $left && null !== $limit ) {
			$parts[] = ucfirst( $what ) . ': ' . number_format_i18n( (float) $left ) . ' of ' . number_format_i18n( (float) $limit ) . ' left' . ( $reset ? ' (resets ' . ( is_numeric( $reset ) ? $reset . 's' : ( strtotime( $reset ) ? wp_date( 'H:i', strtotime( $reset ) ) : $reset ) ) . ')' : '' );
		}
	}
	$wait = null;
	if ( 429 === $code ) {
		$ra = $get( 'retry-after' );
		if ( is_numeric( $ra ) ) {
			$wait = (int) $ra;
		} elseif ( preg_match( '/"retrydelay":\s*"(\d+)s"/', $body, $m ) ) {
			$wait = (int) $m[1];
		} elseif ( preg_match( '/try again in (?:(\d+)m)?([\d.]+)s/', $body, $m ) ) {
			$wait = (int) $m[1] * 60 + (int) ceil( (float) $m[2] );
		}
	}
	return array( 'limits' => implode( ' · ', $parts ), 'cooldown' => null !== $wait ? time() + $wait : 0 );
}

/**
 * Test a saved connection once, with the address and model it was saved with. A tool connection is not tested as a
 * model. A row with no address (a connection saved before addresses were entered by hand, which the workers still read
 * as it is) keeps the status it had; one that was never checked is marked incomplete.
 */
function sourceweb_ai_check( array $row ): array {
	$row['checked'] = time();
	if ( sourceweb_ai_row_is_tool( $row ) ) {
		return array_merge( $row, array( 'kind' => 'tool', 'model' => '', 'status' => 'tool' ) );
	}
	$url   = (string) ( $row['url'] ?? '' );
	$model = (string) ( $row['model'] ?? '' );
	if ( '' === $url || '' === $model ) {
		if ( 'unchecked' === ( $row['status'] ?? 'unchecked' ) ) {
			$row['status'] = 'incomplete';
		}
		return $row;
	}
	list( $code, $body, $headers ) = sourceweb_ai_call( $url, $row['key'], $model );
	$row                           = array_merge( $row, sourceweb_ai_limits( $headers, $body, $code ) );
	if ( $code >= 200 && $code < 300 ) {
		$row['status']  = 'works';
		$row['last_ok'] = time();
	} elseif ( str_contains( $body, 'credit card' ) || str_contains( $body, 'card on file' ) || str_contains( $body, 'payment_method_required' ) ) {
		$row['status'] = 'card';
	} elseif ( 429 === $code && ! str_contains( $body, 'insufficient_quota' ) ) { // A free tier's daily/minute limit, not an empty account.
		$row['status'] = 'limited';
	} elseif ( 402 === $code || preg_match( '/credit|balance|insufficient|billing|quota exceeded/', $body ) ) {
		$row['status'] = 'no-credit';
	} elseif ( 429 === $code ) {
		$row['status'] = 'limited';
	} elseif ( 401 === $code || 403 === $code ) {
		$row['status'] = 'invalid';
	} else {
		$row['status'] = 'no-model';
	}
	return $row;
}

/** Test every saved key (owner, 12 Oct 2026): twice a day by WP-Cron, so the list and the workers only use keys that answer. */
function sourceweb_ai_check_all( bool $new_only = false ): void {
	@set_time_limit( 1200 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, Squiz.PHP.DiscouragedFunctions.Discouraged -- long import/AI run
	$checked = array();
	foreach ( sourceweb_ai_rows() as $r ) {
		if ( ! $new_only || 'unchecked' === $r['status'] || ! empty( $r['recheck'] ) ) { // recheck: "Check again" on the list
			$checked[ $r['key'] ] = sourceweb_ai_check( $r );
			unset( $checked[ $r['key'] ]['recheck'] );
		}
	}
	// The checks take a while: write the results into the list as it is now, so a key removed meanwhile stays removed.
	$rows = sourceweb_ai_rows_fresh();
	foreach ( $rows as &$r ) {
		if ( isset( $checked[ $r['key'] ] ) ) {
			// The check's results; the label and workers as they are now (edited while the check ran).
			$r = array_merge( $checked[ $r['key'] ], array_intersect_key( $r, array_flip( array( 'label', 'workers' ) ) ) );
		}
	}
	unset( $r );
	update_option( 'aw_ai_models', $rows, false );
}
add_action( 'aw_ai_check_all', 'sourceweb_ai_check_all' );
add_action( 'aw_ai_check_all_now', 'sourceweb_ai_check_all' );
add_action( 'aw_ai_check_new', fn() => sourceweb_ai_check_all( true ) );
add_action(
	'init',
	function () {
		if ( ! wp_next_scheduled( 'aw_ai_check_all' ) ) {
			wp_schedule_event( time() + 300, 'twicedaily', 'aw_ai_check_all' );
		}
	}
);

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'aw/v1',
			'/ai-keys',
			array(
				'methods'             => 'GET',
				'permission_callback' => fn() => current_user_can( 'manage_options' ) || current_user_can( 'aw_worker' ),
				// Optional ?worker=<id> (the workflow file without .yml; "sourcing.yml" works too): only that worker's keys.
				'args'                => array(
					'worker' => array(
						'type'     => 'string',
						'required' => false,
					),
					// Optional ?job=<id> (relevance, summary, rewrite, titles, search): the keys best suited to it first.
					'job'    => array(
						'type'     => 'string',
						'required' => false,
					),
				),
				'callback'            => function ( WP_REST_Request $req ) {
					$worker = preg_replace( '/\.ya?ml$/i', '', (string) $req->get_param( 'worker' ) );
					$served = sourceweb_ai_served( sanitize_key( $worker ), sanitize_key( (string) $req->get_param( 'job' ) ) );
					// The workers (an application password) get the keys they call the providers with. Anyone else who may read
					// this route (an administrator's browser session) gets each key masked to its last 4 characters.
					if ( ! did_action( 'application_password_did_authenticate' ) ) {
						$served = sourceweb_ai_mask_served( $served );
					}
					return new WP_REST_Response( $served );
				},
			)
		);
	}
);

/*
 * Work done per key (owner, 20 Oct 2026): each worker run reports, per key, its calls, answers, rate-limited and failed
 * calls (POST aw/v1/ai-usage, key id = sourceweb_ai_key_id, never the key). Kept: each key's last run and its runs of the
 * last 24 hours. Shown on this screen, keys from the GitHub secrets included.
 */

/** Usage by key id: [ last => run, runs => [ {at, workflow, calls, ok, limited, failed} ... (24 h) ], provider, last4 ]. */
function sourceweb_ai_usage(): array {
	return (array) get_option( 'aw_ai_usage', array() );
}

/** "Sourcing workers, 20 Oct 06:17: 14 calls (12 answered, 2 rate-limited)". */
function sourceweb_ai_usage_line( array $u ): string {
	$last = (array) ( $u['last'] ?? array() );
	if ( ! $last ) {
		return 'No run reported yet';
	}
	$bits = array( (int) $last['ok'] . ' answered' );
	if ( (int) $last['limited'] ) {
		$bits[] = (int) $last['limited'] . ' rate-limited';
	}
	if ( (int) $last['failed'] ) {
		$bits[] = (int) $last['failed'] . ' failed';
	}
	$day = array( 'calls' => 0, 'ok' => 0 );
	foreach ( (array) ( $u['runs'] ?? array() ) as $r ) {
		$day['calls'] += (int) $r['calls'];
		$day['ok']    += (int) $r['ok'];
	}
	return sprintf( '%s, %s%s: %d calls (%s) · 24 h: %d calls, %d answered', $last['workflow'], wp_date( 'j M, H:i', (int) $last['at'] ), empty( $last['dry_run'] ) ? '' : ' (dry run)', (int) $last['calls'], implode( ', ', $bits ), $day['calls'], $day['ok'] );
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'aw/v1',
			'/ai-usage',
			array(
				'methods'             => 'POST',
				'permission_callback' => fn() => sourceweb_ingest_can() && did_action( 'application_password_did_authenticate' ),
				'callback'            => function ( WP_REST_Request $req ) {
					$now   = time();
					$usage = sourceweb_ai_usage();
					$wf    = sanitize_text_field( (string) $req->get_param( 'workflow' ) );
					$link  = esc_url_raw( (string) $req->get_param( 'link' ) );
					$dry   = (bool) $req->get_param( 'dry_run' );
					foreach ( (array) $req->get_param( 'keys' ) as $k ) {
						$id = preg_replace( '/[^a-f0-9]/', '', strtolower( (string) ( $k['id'] ?? '' ) ) );
						if ( 16 !== strlen( $id ) ) {
							continue;
						}
						$n = array( 'calls' => 0, 'ok' => 0, 'limited' => 0, 'failed' => 0 );
						foreach ( $n as $f => $_ ) {
							$n[ $f ] = max( 0, (int) ( $k[ $f ] ?? 0 ) );
						}
						$models = array();
						foreach ( (array) ( $k['models'] ?? array() ) as $m => $c ) {
							$models[ sanitize_text_field( (string) $m ) ] = max( 0, (int) ( $c['calls'] ?? 0 ) );
						}
						$run  = array( 'at' => $now, 'workflow' => $wf, 'link' => $link, 'dry_run' => $dry, 'models' => $models ) + $n;
						$u    = (array) ( $usage[ $id ] ?? array() );
						$runs = array_values( array_filter( (array) ( $u['runs'] ?? array() ), fn( $r ) => $now - (int) $r['at'] < DAY_IN_SECONDS ) );
						$runs[] = array( 'at' => $now, 'workflow' => $wf ) + $n;
						$usage[ $id ] = array(
							'provider' => sanitize_key( (string) ( $k['provider'] ?? '' ) ),
							'last4'    => substr( preg_replace( '/[^A-Za-z0-9_-]/', '', (string) ( $k['last4'] ?? '' ) ), -4 ),
							'last'     => $run,
							'runs'     => array_slice( $runs, -200 ),
						);
					}
					update_option( 'aw_ai_usage', $usage, false );
					// Free-model daily caps per account (owner, 22 Oct 2026), as the workers saw them at the start of this run.
					$caps = (array) get_option( 'aw_ai_free_caps', array() );
					foreach ( (array) $req->get_param( 'accounts' ) as $a ) {
						$acct = substr( preg_replace( '/[^A-Za-z0-9_-]/', '', (string) ( $a['account'] ?? '' ) ), -4 );
						if ( '' === $acct ) {
							continue;
						}
						$caps[ $acct ] = array(
							'provider'  => sanitize_key( (string) ( $a['provider'] ?? '' ) ),
							'limit'     => max( 0, (int) ( $a['limit'] ?? 0 ) ),
							'remaining' => max( 0, (int) ( $a['remaining'] ?? 0 ) ),
							'share'     => max( 0, (int) ( $a['share'] ?? 0 ) ),
							'used'      => max( 0, (int) ( $a['used'] ?? 0 ) ),
							'keys'      => array_values( array_unique( array_merge( (array) ( $caps[ $acct ]['keys'] ?? array() ), array_map( fn( $k ) => substr( preg_replace( '/[^A-Za-z0-9_=-]/', '', (string) $k ), -4 ), (array) ( $a['keys'] ?? array() ) ) ) ) ),
							'at'        => $now,
							'workflow'  => $wf,
						);
					}
					update_option( 'aw_ai_free_caps', $caps, false );
					return new WP_REST_Response( array( 'keys' => count( (array) $req->get_param( 'keys' ) ) ) );
				},
			)
		);
	}
);

/**
 * Add New Key (owner, 24 Oct 2026): one key or several (spaces, commas or new lines between them), each with the same
 * label and workers (none = every worker). Keys already saved are skipped. New keys are checked in the background,
 * never during the save: one slow provider (18 s a call) times ten keys was enough for a 503 (owner, 22 Oct
 * 2026). Keys removed while this save ran stay removed. Used by POST sourceweb/v1/ai/keys/add.
 *
 * @param string     $pasted  The keys as pasted.
 * @param string     $label   Label (80 characters at most).
 * @param array      $workers Worker IDs (known ones, from sourceweb_workers_posted_ids()).
 * @param array|null $rows    The rows to keep, in order (the older one-form list); null keeps the saved rows.
 * @param bool       $recheck Also check every saved key again.
 * @param array      $conn    The connection every pasted key shares: url (base address), model, kind (ai or tool).
 * @return array { added: string[] (each "…last4 (label)"), dupes: int, saved: bool }
 */
function sourceweb_ai_keys_add( string $pasted, string $label, array $workers, ?array $rows = null, bool $recheck = false, array $conn = array() ): array {
	$saved = sourceweb_ai_rows();
	$keep  = null !== $rows;
	$rows  = $keep ? $rows : $saved;
	$have  = wp_list_pluck( $rows, 'key' );
	$label = mb_substr( $label, 0, 80 );
	$added = array();
	$dupes = 0;
	foreach ( preg_split( '/[\s,]+/', $pasted ) as $k ) {
		if ( '' === $k ) {
			continue;
		}
		if ( in_array( $k, $have, true ) ) {
			++$dupes;
			continue;
		}
		$row     = sourceweb_ai_blank_row( $k, $conn + array( 'label' => $label ) ) + array(
			'label'   => $label,
			'workers' => $workers,
		);
		$rows[]  = $row;
		$have[]  = $k;
		$added[] = sourceweb_ai_key_short( $row );
	}
	if ( ! $added && ! $keep && ! $recheck ) {
		return array(
			'added' => array(),
			'dupes' => $dupes,
			'saved' => false,
		);
	}
	$now  = wp_list_pluck( sourceweb_ai_rows_fresh(), 'key' );
	$was  = wp_list_pluck( $saved, 'key' );
	$rows = array_values( array_filter( $rows, fn( $r ) => in_array( $r['key'], $now, true ) || ! in_array( $r['key'], $was, true ) ) );
	update_option( 'aw_ai_models', $rows, false );
	if ( $added ) {
		sourceweb_src_log( 'ai', 'added key ' . implode( ', ', $added ) . ' for ' . sourceweb_ai_workers_words( $workers ) );
	}
	$hook = $recheck ? 'aw_ai_check_all_now' : 'aw_ai_check_new'; // every key, or the new ones
	if ( ( 'aw_ai_check_all_now' === $hook || in_array( 'unchecked', wp_list_pluck( $rows, 'status' ), true ) ) && ! wp_next_scheduled( $hook ) ) {
		wp_schedule_single_event( time(), $hook );
		spawn_cron();
	}
	return array(
		'added' => $added,
		'dupes' => $dupes,
		'saved' => true,
	);
}

/**
 * Edit a saved key: its label and the workers it is for (none = every worker). The key itself is never edited. Writes
 * and logs only on a change. Used by POST sourceweb/v1/ai/key/save.
 *
 * @param string $id      Key id (sourceweb_ai_key_id()).
 * @param string $label   Label.
 * @param array  $workers Worker IDs (known ones).
 * @param array  $conn    Optional: url and model to change (a blank one is left as it is).
 * @return int|null 1 saved, 0 nothing changed, null no such key.
 */
function sourceweb_ai_key_edit_save( string $id, string $label, array $workers, array $conn = array() ): ?int {
	$rows  = sourceweb_ai_rows_fresh();
	$label = mb_substr( $label, 0, 80 );
	foreach ( $rows as $i => $r ) {
		if ( sourceweb_ai_key_id( $r['key'] ) !== $id ) {
			continue;
		}
		$was  = sourceweb_ai_row_workers( $r );
		$what = array();
		if ( (string) ( $r['label'] ?? '' ) !== $label ) {
			$what[] = 'label "' . ( $r['label'] ?? '' ) . '" → "' . $label . '"';
		}
		$a = $was;
		$b = $workers;
		sort( $a );
		sort( $b );
		if ( $a !== $b ) {
			$what[] = 'used by ' . sourceweb_ai_workers_words( $was ) . ' → ' . sourceweb_ai_workers_words( $workers );
		}
		$url = isset( $conn['url'] ) ? sourceweb_ai_clean_url( (string) $conn['url'] ) : '';
		if ( '' !== $url && $url !== (string) ( $r['url'] ?? '' ) ) {
			$what[]                = 'address ' . sourceweb_ai_host( (string) ( $r['url'] ?? '' ) ) . ' → ' . sourceweb_ai_host( $url );
			$rows[ $i ]['url']     = $url;
			$rows[ $i ]['recheck'] = 1;
		}
		$model = isset( $conn['model'] ) && ! sourceweb_ai_row_is_tool( $r ) ? sanitize_text_field( (string) $conn['model'] ) : '';
		if ( '' !== $model && $model !== (string) ( $r['model'] ?? '' ) ) {
			$what[]                = 'model "' . ( $r['model'] ?? '' ) . '" → "' . $model . '"';
			$rows[ $i ]['model']   = $model;
			$rows[ $i ]['recheck'] = 1;
		}
		if ( ! $what ) {
			return 0;
		}
		$rows[ $i ]['label']   = $label;
		$rows[ $i ]['workers'] = $workers;
		update_option( 'aw_ai_models', $rows, false );
		sourceweb_src_log( 'ai', 'key ' . sourceweb_ai_key_short( $r ) . ': ' . implode( '; ', $what ) );
		return 1;
	}
	return null;
}

/**
 * A list action on saved keys, straight away (owner, 24 Oct 2026): Move up / down (one key), Remove, Check again,
 * Attach to / Detach from a worker. A key keeps at least one worker: detaching its last one is refused. Writes only on
 * a change. Used by POST sourceweb/v1/ai/keys/decide.
 *
 * @param string $op     up, down, remove, recheck, attach or detach.
 * @param array  $ids    Key ids.
 * @param string $worker Worker ID for attach / detach.
 * @return array { op: the action, or 'noworker' when attach / detach has no known worker; n: keys done; skip: keys not detached }
 */
function sourceweb_ai_keys_list_op( string $op, array $ids, string $worker = '' ): array {
	$worker = '' !== $worker && function_exists( 'sourceweb_worker' ) && sourceweb_worker( $worker ) ? $worker : '';
	if ( in_array( $op, array( 'attach', 'detach' ), true ) && '' === $worker ) {
		$op = 'noworker';
	}
	$ids  = array_map( 'sanitize_key', $ids );
	$rows = sourceweb_ai_rows_fresh();
	$orig = $rows;
	$n    = 0;
	$skip = 0;
	$gone = array();
	$did  = array();
	foreach ( $rows as $i => $r ) {
		if ( ! in_array( sourceweb_ai_key_id( $r['key'] ), $ids, true ) ) {
			continue;
		}
		if ( 'attach' === $op || 'detach' === $op ) {
			// Attach: the key is for this worker (a key for every worker becomes this worker's only). Detach: no longer
			// for this worker (a key for every worker becomes every other worker's).
			$ws = sourceweb_ai_row_workers( $r );
			if ( 'attach' === $op ) {
				if ( in_array( $worker, $ws, true ) ) {
					continue;
				}
				$new = array_merge( $ws, array( $worker ) );
			} else {
				if ( $ws && ! in_array( $worker, $ws, true ) ) {
					continue;
				}
				$new = array_values( array_diff( $ws ? $ws : array_keys( sourceweb_workers_all() ), array( $worker ) ) );
				if ( ! $new ) {
					++$skip;
					continue;
				}
			}
			$rows[ $i ]['workers'] = $new;
			$did[]                 = sourceweb_ai_key_short( $r );
		} elseif ( 'remove' === $op ) {
			$gone[] = '…' . substr( $r['key'], -4 ) . ' (' . ( '' !== sourceweb_ai_row_name( $r ) ? sourceweb_ai_row_name( $r ) : 'no label' ) . ')';
			unset( $rows[ $i ] );
		} elseif ( 'recheck' === $op ) {
			$rows[ $i ]['recheck'] = 1; // checked in the background by aw_ai_check_new; the key keeps its status (and stays in use) meanwhile
		} elseif ( ( 'up' === $op && $i > 0 ) || ( 'down' === $op && $i < count( $rows ) - 1 ) ) {
			$j          = 'up' === $op ? $i - 1 : $i + 1;
			$tmp        = $rows[ $j ];
			$rows[ $j ] = $r;
			$rows[ $i ] = $tmp;
			$did[]      = sourceweb_ai_key_short( $r );
			++$n;
			break;
		} else {
			continue;
		}
		++$n;
	}
	$rows = array_values( $rows );
	if ( $rows !== $orig ) {
		update_option( 'aw_ai_models', $rows, false );
	}
	if ( $gone && function_exists( 'sourceweb_src_log' ) ) {
		sourceweb_src_log( 'AI models', 'removed key ' . implode( ', ', $gone ) );
	}
	if ( $did ) {
		$words = array(
			'attach' => 'attached to ' . sourceweb_ai_workers_words( array( $worker ) ),
			'detach' => 'detached from ' . sourceweb_ai_workers_words( array( $worker ) ),
			'up'     => 'moved up',
			'down'   => 'moved down',
		);
		sourceweb_src_log( 'ai', 'key ' . implode( ', ', $did ) . ': ' . ( $words[ $op ] ?? $op ) );
	}
	if ( 'recheck' === $op && $n && ! wp_next_scheduled( 'aw_ai_check_new' ) ) {
		wp_schedule_single_event( time(), 'aw_ai_check_new' );
		spawn_cron();
	}
	if ( in_array( $op, array( 'attach', 'detach' ), true ) ) {
		$n = count( $did );
	}
	return array(
		'op'   => $op,
		'n'    => $n,
		'skip' => $skip,
	);
}

/**
 * Every key in one list (owner, 24 Oct 2026): the saved ones in the order the workers try them, then the ones in the
 * workers' GitHub secrets (from their own reports; changed in GitHub). Never more of a key than its last 4 characters:
 * a key is its id (sourceweb_ai_key_id()). Used by GET sourceweb/v1/ai/keys.
 *
 * @return array[] { pos, id, last4, provider, model, label, workers, status, last_ok, limits, usage, checked, recheck, secret }
 */
function sourceweb_ai_key_records(): array {
	$out   = array();
	$usage = sourceweb_ai_usage();
	$shown = array();
	foreach ( sourceweb_ai_rows() as $i => $r ) {
		$uid     = sourceweb_ai_key_id( $r['key'] );
		$shown[] = $uid;
		$out[]   = array(
			'pos'      => $i,
			'id'       => $uid,
			'last4'    => substr( $r['key'], -4 ),
			'provider' => (string) $r['provider'],
			'name'     => sourceweb_ai_row_name( $r ),
			'kind'     => sourceweb_ai_row_is_tool( $r ) ? 'tool' : 'ai',
			'url'      => (string) ( $r['url'] ?? '' ),
			'caps'     => array_values( array_filter( (array) ( $r['caps'] ?? array() ), 'is_string' ) ),
			'model'    => (string) $r['model'],
			'label'    => (string) ( $r['label'] ?? '' ),
			'workers'  => sourceweb_ai_row_workers( $r ),
			'status'   => (string) $r['status'],
			'last_ok'  => (int) ( $r['last_ok'] ?? 0 ),
			'limits'   => ! empty( $r['cooldown'] ) && $r['cooldown'] > time() ? 'Cooldown until ' . wp_date( 'j M, H:i', $r['cooldown'] ) . ( ! empty( $r['limits'] ) ? ' · ' . $r['limits'] : '' ) : ( ! empty( $r['limits'] ) ? $r['limits'] : 'Not reported' ),
			'usage'    => sourceweb_ai_usage_line( (array) ( $usage[ $uid ] ?? array() ) ),
			'checked'  => (int) $r['checked'],
			'recheck'  => ! empty( $r['recheck'] ),
			'secret'   => false,
		);
	}
	// The workers' GitHub secrets: write-only in GitHub, so shown from the workers' reports.
	$other = array_diff_key( $usage, array_flip( $shown ) );
	uasort( $other, fn( $a, $b ) => (int) ( $b['last']['at'] ?? 0 ) <=> (int) ( $a['last']['at'] ?? 0 ) );
	foreach ( $other as $uid => $u ) {
		$prov  = (string) ( $u['provider'] ?? '' );
		$last  = (array) ( $u['last'] ?? array() );
		$out[] = array(
			'pos'      => PHP_INT_MAX,
			'id'       => (string) $uid,
			'last4'    => (string) ( $u['last4'] ?? '' ),
			'provider' => $prov,
			'name'     => $prov,
			'kind'     => 'ai',
			'url'      => '',
			'caps'     => array(),
			'model'    => implode( ', ', array_keys( (array) ( $last['models'] ?? array() ) ) ),
			'label'    => '',
			'workers'  => array(),
			'status'   => ! empty( $last['ok'] ) ? 'works' : ( ! empty( $last['limited'] ) ? 'limited' : 'failed' ),
			'last_ok'  => 0,
			'limits'   => '',
			'usage'    => sourceweb_ai_usage_line( $u ),
			'checked'  => (int) ( $last['at'] ?? 0 ),
			'recheck'  => false,
			'secret'   => true,
		);
	}
	return $out;
}

/**
 * A key's state for the views and badges: ok (works, tool, paid secret), wait (rate-limited, not checked, needs a
 * card) or bad.
 *
 * @param string $status Status.
 */
function sourceweb_ai_key_tone( string $status ): string {
	if ( in_array( $status, array( 'works', 'tool', 'paid' ), true ) ) {
		return 'ok';
	}
	return in_array( $status, array( 'limited', 'unchecked', 'card' ), true ) ? 'wait' : 'bad';
}

/**
 * The free-model accounts the workers reported, as plain text: provider, account (its last characters), daily limit,
 * left today, the last run's share and use, its keys (last 4 each), when.
 */
function sourceweb_ai_free_caps_rows(): array {
	$out = array();
	foreach ( (array) get_option( 'aw_ai_free_caps', array() ) as $acct => $c ) {
		$fresh = gmdate( 'Y-m-d', (int) $c['at'] ) === gmdate( 'Y-m-d' );
		$out[] = array(
			'provider' => (string) $c['provider'],
			'account'  => (string) $acct,
			'limit'    => (int) $c['limit'],
			'left'     => $fresh ? (string) max( 0, $c['remaining'] - $c['used'] ) : 'Full again (reset since the last run)',
			'share'    => (int) $c['share'],
			'used'     => (int) $c['used'],
			'keys'     => implode( ' ', array_map( fn( $k ) => '…' . $k, (array) $c['keys'] ) ),
			'count'    => count( (array) $c['keys'] ),
			'at'       => wp_date( 'j M, H:i', (int) $c['at'] ) . ( $c['workflow'] ? ' · ' . $c['workflow'] : '' ),
		);
	}
	return $out;
}

/**
 * The At a glance numbers (owner, 22 Oct 2026: "keep it simple"): keys saved and working, the free daily supply, the
 * last 24 h's demand, the workers that used AI, and per worker the keys it can use now.
 *
 * @param array $rows Saved rows.
 * @return array { keys, working, daily, nocap, ok, miss, pct, used: worker id => true, workers: [ { id, name, planned, can, all, today } ] }
 */
function sourceweb_ai_overview_data( array $rows ): array {
	$workers = sourceweb_workers_all();
	$working = 0;
	foreach ( $rows as $r ) {
		if ( in_array( $r['status'], array( 'works', 'limited' ), true ) && ! sourceweb_ai_row_is_tool( $r ) ) {
			++$working;
		}
	}
	// The daily supply is what the workers reported per account (aw_ai_free_caps), never a figure kept in the code.
	$caps    = (array) get_option( 'aw_ai_free_caps', array() );
	$daily   = 0;
	$covered = 0;
	foreach ( $caps as $c ) {
		$daily   += max( 0, (int) ( $c['limit'] ?? 0 ) );
		$covered += count( (array) ( $c['keys'] ?? array() ) );
	}
	$nocap = max( 0, $working - $covered );
	$calls = 0;
	$ok    = 0;
	$miss  = 0;
	$wf    = array(); // worker ID (or the reported name of a workflow not in the registry) => true
	foreach ( sourceweb_ai_usage() as $u ) {
		foreach ( (array) ( $u['runs'] ?? array() ) as $run ) {
			if ( time() - (int) $run['at'] < DAY_IN_SECONDS ) {
				$calls += (int) ( $run['calls'] ?? 0 );
				$ok    += (int) ( $run['ok'] ?? 0 );
				$miss  += (int) ( $run['limited'] ?? 0 ) + (int) ( $run['failed'] ?? 0 );
				if ( ! empty( $run['workflow'] ) ) {
					$wf[ sourceweb_ai_usage_worker( (string) $run['workflow'] ) ] = true;
				}
			}
		}
	}
	$all_rows = count( sourceweb_ai_served()['rows'] );
	$list     = array();
	foreach ( $workers as $id => $w ) {
		$list[] = array(
			'id'      => (string) $id,
			'name'    => (string) $w['name'],
			'planned' => ! empty( $w['planned'] ),
			'can'     => count( sourceweb_ai_served( $id )['rows'] ),
			'all'     => $all_rows,
			'today'   => isset( $wf[ $id ] ),
		);
	}
	return array(
		'keys'    => count( $rows ),
		'working' => $working,
		'daily'   => $daily,
		'nocap'   => $nocap,
		'ok'      => $ok,
		'miss'    => $miss,
		'pct'     => $daily ? min( 100, (int) round( 100 * $ok / $daily ) ) : 0,
		'used'    => $wf,
		'workers' => $list,
	);
}

/**
 * The worker ID of a usage report: the workers report their GitHub workflow name (Sourcing workers …), which is the
 * registry's name; a name not in the registry stays as it is.
 */
function sourceweb_ai_usage_worker( string $name ): string {
	foreach ( SOURCEWEB_WORKERS as $file => $w ) {
		if ( $w['name'] === $name ) {
			return sourceweb_worker_id( $file );
		}
	}
	return $name;
}

/**
 * Keys per kind and connection (owner, 22 Oct 2026), as plain text.
 *
 * @param array $rows Saved rows.
 * @return array [ { group, means, providers } ]
 */
function sourceweb_ai_tier_groups( array $rows ): array {
	$g = array();
	foreach ( $rows as $r ) {
		$t = sourceweb_ai_row_is_tool( $r ) ? 'tool' : 'ai';
		$n = '' !== sourceweb_ai_row_name( $r ) ? sourceweb_ai_row_name( $r ) : 'No label';
		$g[ $t ][ $n ]['all']   = ( $g[ $t ][ $n ]['all'] ?? 0 ) + 1;
		$g[ $t ][ $n ]['works'] = ( $g[ $t ][ $n ]['works'] ?? 0 ) + ( in_array( $r['status'], array( 'works', 'tool' ), true ) ? 1 : 0 );
	}
	$out = array();
	foreach ( array_keys( SOURCEWEB_AI_KINDS ) as $t ) {
		if ( empty( $g[ $t ] ) ) {
			continue;
		}
		$parts = array();
		foreach ( $g[ $t ] as $n => $c ) {
			$parts[] = $n . ' ' . $c['works'] . ' / ' . $c['all'];
		}
		$out[] = array(
			'group'     => (string) SOURCEWEB_AI_KINDS[ $t ][0],
			'means'     => (string) SOURCEWEB_AI_KINDS[ $t ][1],
			'providers' => implode( ' · ', $parts ),
		);
	}
	return $out;
}
