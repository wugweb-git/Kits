<?php
/**
 * Multi-tenant sender profiles, per-profile rate limiting, and failed outbound retry queue.
 *
 * @package mailweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const MAILWEB_TENANT_PROFILES_OPTION = 'mailweb_tenant_profiles';
const MAILWEB_RETRY_QUEUE_OPTION     = 'mailweb_retry_queue';
const MAILWEB_RETRY_MAX_ATTEMPTS     = 3;

/**
 * Normalizes a single tenant sender profile entry.
 *
 * @param string $slug    Profile slug (e.g. 'alerts', 'newsletter').
 * @param array  $profile Raw profile fields.
 * @return array{slug: string, label: string, from_email: string, from_name: string, reply_to: string, daily_limit: int}
 */
function mailweb_normalize_sender_profile( string $slug, array $profile ): array {
	$slug       = function_exists( 'sanitize_key' ) ? sanitize_key( $slug ) : strtolower( preg_replace( '/[^a-z0-9_-]/i', '', $slug ) );
	$from_email = trim( (string) ( $profile['from_email'] ?? '' ) );
	$reply_to   = trim( (string) ( $profile['reply_to'] ?? '' ) );
	if ( function_exists( 'sanitize_email' ) ) {
		$from_email = sanitize_email( $from_email );
		$reply_to   = sanitize_email( $reply_to );
	}
	$label     = trim( (string) ( $profile['label'] ?? ucfirst( $slug ) ) );
	$from_name = trim( (string) ( $profile['from_name'] ?? '' ) );
	$limit     = max( 0, min( 100000, (int) ( $profile['daily_limit'] ?? 0 ) ) );

	return array(
		'slug'        => $slug,
		'label'       => $label,
		'from_email'  => $from_email,
		'from_name'   => $from_name,
		'reply_to'    => $reply_to,
		'daily_limit' => $limit,
	);
}

/**
 * Returns all configured tenant sender profiles, keyed by slug.
 *
 * @return array<string, array>
 */
function mailweb_tenant_sender_profiles(): array {
	$stored = function_exists( 'get_option' ) ? (array) get_option( MAILWEB_TENANT_PROFILES_OPTION, array() ) : array();
	$out    = array();
	foreach ( $stored as $slug => $row ) {
		if ( ! is_array( $row ) ) {
			continue;
		}
		$norm = mailweb_normalize_sender_profile( (string) $slug, $row );
		if ( '' !== $norm['slug'] && '' !== $norm['from_email'] ) {
			$out[ $norm['slug'] ] = $norm;
		}
	}
	if ( function_exists( 'apply_filters' ) ) {
		$out = (array) apply_filters( 'mailweb_sender_profiles', $out );
	}
	return $out;
}

/**
 * Resolves a sender profile by slug/context.
 *
 * @param string $slug Profile slug.
 * @return array|null
 */
function mailweb_resolve_sender_profile( string $slug ): ?array {
	$key      = function_exists( 'sanitize_key' ) ? sanitize_key( $slug ) : strtolower( $slug );
	$profiles = mailweb_tenant_sender_profiles();
	return $profiles[ $key ] ?? null;
}

/**
 * Applies a sender profile's From and Reply-To headers to wp_mail args.
 *
 * @param array  $args    wp_mail args (to, subject, message, headers, attachments).
 * @param array  $profile Normalized profile from mailweb_resolve_sender_profile().
 * @return array
 */
function mailweb_apply_sender_profile_to_args( array $args, array $profile ): array {
	$headers = $args['headers'] ?? array();
	if ( is_string( $headers ) ) {
		$headers = '' !== trim( $headers ) ? preg_split( "/\r\n|\n|\r/", $headers ) : array();
	}
	$headers = array_values( array_filter( (array) $headers, fn( $h ) => 0 !== stripos( ltrim( (string) $h ), 'X-Mailweb-Profile:' ) ) );

	if ( ! empty( $profile['from_email'] ) ) {
		$from      = ! empty( $profile['from_name'] ) ? $profile['from_name'] . ' <' . $profile['from_email'] . '>' : $profile['from_email'];
		$headers   = array_values( array_filter( $headers, fn( $h ) => 0 !== stripos( ltrim( (string) $h ), 'From:' ) ) );
		$headers[] = 'From: ' . $from;
	}
	if ( ! empty( $profile['reply_to'] ) ) {
		$headers   = array_values( array_filter( $headers, fn( $h ) => 0 !== stripos( ltrim( (string) $h ), 'Reply-To:' ) ) );
		$headers[] = 'Reply-To: ' . $profile['reply_to'];
	}
	$args['headers'] = $headers;
	return $args;
}

/**
 * Checks whether a sender profile is within its daily rate limit, incrementing its counter when allowed.
 *
 * @param string $slug  Profile slug.
 * @param int    $limit Daily limit (0 = unlimited).
 * @param int    $now   Unix timestamp (optional, for testing).
 * @return bool
 */
function mailweb_tenant_rate_allow( string $slug, int $limit, ?int $now = null ): bool {
	if ( $limit <= 0 ) {
		return true;
	}
	$now   = $now ?? time();
	$day   = gmdate( 'Ymd', $now );
	$key   = 'mailweb_rate_' . sanitize_key( $slug ) . '_' . $day;
	$count = (int) get_transient( $key );
	if ( $count >= $limit ) {
		return false;
	}
	set_transient( $key, $count + 1, DAY_IN_SECONDS );
	return true;
}

/**
 * Computes exponential backoff delay in seconds for a retry attempt (5m, 15m, 60m).
 *
 * @param int $attempt Zero-based attempt count.
 * @return int
 */
function mailweb_retry_backoff_seconds( int $attempt ): int {
	$delays = array( 300, 900, 3600 );
	return $delays[ min( max( 0, $attempt ), count( $delays ) - 1 ) ];
}

/**
 * Pushes a failed outbound email into the retry queue option.
 *
 * @param array  $mail_args Original wp_mail arguments.
 * @param string $reason    Failure reason.
 * @param int    $attempt   Previous attempt count.
 * @param int    $now       Current Unix timestamp.
 * @return array<string, mixed>|null Queued item, or null if max attempts reached.
 */
function mailweb_retry_queue_push( array $mail_args, string $reason, int $attempt = 0, ?int $now = null ): ?array {
	if ( $attempt >= MAILWEB_RETRY_MAX_ATTEMPTS ) {
		return null;
	}
	$now   = $now ?? time();
	$queue = function_exists( 'get_option' ) ? (array) get_option( MAILWEB_RETRY_QUEUE_OPTION, array() ) : array();
	$id    = function_exists( 'wp_generate_uuid4' ) ? wp_generate_uuid4() : uniqid( 'mw_', true );
	$item  = array(
		'id'            => $id,
		'to'            => $mail_args['to'] ?? '',
		'subject'       => (string) ( $mail_args['subject'] ?? '' ),
		'message'       => (string) ( $mail_args['message'] ?? '' ),
		'headers'       => $mail_args['headers'] ?? array(),
		'attempts'      => $attempt + 1,
		'last_error'    => $reason,
		'queued_at'     => $now,
		'next_retry_at' => $now + mailweb_retry_backoff_seconds( $attempt ),
	);
	$queue[ $id ] = $item;
	// Cap queue size to 200 entries to prevent unbounded option growth.
	if ( count( $queue ) > 200 ) {
		$queue = array_slice( $queue, -200, null, true );
	}
	if ( function_exists( 'update_option' ) ) {
		update_option( MAILWEB_RETRY_QUEUE_OPTION, $queue, false );
	}
	return $item;
}

/**
 * Processes due items in the MailWeb retry queue.
 *
 * @param int|null $now Current Unix timestamp.
 * @return array{processed: int, sent: int, requeued: int, dropped: int}
 */
function mailweb_retry_queue_process( ?int $now = null ): array {
	$now     = $now ?? time();
	$queue   = function_exists( 'get_option' ) ? (array) get_option( MAILWEB_RETRY_QUEUE_OPTION, array() ) : array();
	$summary = array( 'processed' => 0, 'sent' => 0, 'requeued' => 0, 'dropped' => 0 );
	if ( empty( $queue ) ) {
		return $summary;
	}

	foreach ( $queue as $id => $item ) {
		if ( ! is_array( $item ) || (int) ( $item['next_retry_at'] ?? 0 ) > $now ) {
			continue;
		}
		++$summary['processed'];
		unset( $queue[ $id ] );

		$ok = function_exists( 'wp_mail' )
			? (bool) wp_mail( $item['to'] ?? '', (string) ( $item['subject'] ?? '' ), (string) ( $item['message'] ?? '' ), $item['headers'] ?? array() )
			: false;

		if ( $ok ) {
			++$summary['sent'];
		} elseif ( (int) ( $item['attempts'] ?? 1 ) < MAILWEB_RETRY_MAX_ATTEMPTS ) {
			$item['attempts']      = (int) $item['attempts'] + 1;
			$item['next_retry_at'] = $now + mailweb_retry_backoff_seconds( $item['attempts'] - 1 );
			$queue[ $id ]          = $item;
			++$summary['requeued'];
		} else {
			++$summary['dropped'];
		}
	}

	if ( function_exists( 'update_option' ) ) {
		update_option( MAILWEB_RETRY_QUEUE_OPTION, $queue, false );
	}
	return $summary;
}

if ( function_exists( 'add_filter' ) ) {
	add_filter(
		'wp_mail',
		function ( $args ) {
			if ( ! is_array( $args ) ) {
				return $args;
			}
			$slug    = '';
			$headers = $args['headers'] ?? array();
			if ( is_string( $headers ) ) {
				$headers = preg_split( "/\r\n|\n|\r/", $headers );
			}
			foreach ( (array) $headers as $h ) {
				if ( preg_match( '/^X-Mailweb-Profile:\s*([a-z0-9_-]+)/i', ltrim( (string) $h ), $m ) ) {
					$slug = strtolower( $m[1] );
					break;
				}
			}
			$slug = (string) apply_filters( 'mailweb_mail_profile', $slug, $args );
			if ( '' === $slug ) {
				return $args;
			}
			$profile = mailweb_resolve_sender_profile( $slug );
			if ( ! $profile ) {
				return $args;
			}
			if ( ! mailweb_tenant_rate_allow( $slug, (int) $profile['daily_limit'] ) ) {
				mailweb_retry_queue_push( $args, 'Daily profile rate limit reached for ' . $slug );
			}
			return mailweb_apply_sender_profile_to_args( $args, $profile );
		},
		15
	);

	add_action(
		'wp_mail_failed',
		function ( $wp_error ) {
			if ( ! is_wp_error( $wp_error ) ) {
				return;
			}
			$data = (array) $wp_error->get_error_data();
			if ( empty( $data['to'] ) && empty( $data['subject'] ) ) {
				return;
			}
			mailweb_retry_queue_push( $data, $wp_error->get_error_message() );
		}
	);

	add_action( 'mailweb_retry_queue_tick', 'mailweb_retry_queue_process' );
	add_action(
		'init',
		function () {
			if ( function_exists( 'wp_next_scheduled' ) && ! wp_next_scheduled( 'mailweb_retry_queue_tick' ) ) {
				wp_schedule_event( time() + 300, 'mailweb_5min', 'mailweb_retry_queue_tick' );
			}
		}
	);

	add_action(
		'rest_api_init',
		function () {
			$perm = function_exists( 'mailweb_rest_can' ) ? mailweb_rest_can( MAILWEB_CAP ) : fn() => current_user_can( 'manage_options' );
			register_rest_route(
				'mailweb/v1',
				'/services/sender-profiles',
				array(
					array(
						'methods'             => 'GET',
						'callback'            => fn() => rest_ensure_response( array( 'profiles' => array_values( mailweb_tenant_sender_profiles() ) ) ),
						'permission_callback' => $perm,
					),
					array(
						'methods'             => 'POST',
						'callback'            => function ( WP_REST_Request $request ) {
							$raw  = (array) $request->get_param( 'profiles' );
							$save = array();
							foreach ( $raw as $slug => $row ) {
								if ( ! is_array( $row ) ) {
									continue;
								}
								$key  = is_string( $slug ) ? $slug : (string) ( $row['slug'] ?? '' );
								$norm = mailweb_normalize_sender_profile( $key, $row );
								if ( '' !== $norm['slug'] && '' !== $norm['from_email'] ) {
									$save[ $norm['slug'] ] = $norm;
								}
							}
							update_option( MAILWEB_TENANT_PROFILES_OPTION, $save, false );
							return rest_ensure_response( array( 'profiles' => array_values( mailweb_tenant_sender_profiles() ) ) );
						},
						'permission_callback' => $perm,
					),
				)
			);
			register_rest_route(
				'mailweb/v1',
				'/services/retry-queue',
				array(
					array(
						'methods'             => 'GET',
						'callback'            => fn() => rest_ensure_response( array( 'queue' => array_values( (array) get_option( MAILWEB_RETRY_QUEUE_OPTION, array() ) ) ) ),
						'permission_callback' => $perm,
					),
					array(
						'methods'             => 'POST',
						'callback'            => fn() => rest_ensure_response( mailweb_retry_queue_process() ),
						'permission_callback' => $perm,
					),
				)
			);
		}
	);
}
