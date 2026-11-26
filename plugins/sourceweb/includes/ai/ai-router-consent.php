<?php
/**
 * SourceWeb AI free/open model owner consent gate and feed source quality threshold evaluator.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SOURCEWEB_AI_OPEN_CONSENT_OPTION    = 'sourceweb_ai_open_model_consent';
const SOURCEWEB_AI_OPEN_PROVIDERS         = array( 'openrouter', 'requesty', 'huggingface' );
const SOURCEWEB_SOURCE_QUALITY_THRESHOLD  = 0.60;

/**
 * Whether free/open-model routing is enabled by explicit owner consent.
 *
 * @return bool
 */
function sourceweb_ai_open_models_allowed(): bool {
	$consented = function_exists( 'get_option' ) ? (bool) get_option( SOURCEWEB_AI_OPEN_CONSENT_OPTION, false ) : false;
	if ( function_exists( 'apply_filters' ) ) {
		$consented = (bool) apply_filters( 'sourceweb_ai_open_model_consent', $consented );
	}
	return $consented;
}

/**
 * Filters a provider map so free/open-model routers are only exposed when owner consent is granted.
 *
 * @param array<string, mixed> $providers Provider map keyed by provider slug.
 * @param bool|null            $consented Optional explicit consent override (for unit tests).
 * @return array<string, mixed>
 */
function sourceweb_ai_filter_router_models( array $providers, ?bool $consented = null ): array {
	$allowed = $consented ?? sourceweb_ai_open_models_allowed();
	if ( $allowed ) {
		return $providers;
	}
	foreach ( SOURCEWEB_AI_OPEN_PROVIDERS as $slug ) {
		unset( $providers[ $slug ] );
	}
	return $providers;
}

/**
 * Evaluates a feed source against quality thresholds using ingestion & review metrics.
 *
 * @param array<string, mixed> $metrics       Keys: fetched, accepted, duplicates, rejected, errors.
 * @param float                $min_threshold Minimum passing score (0.0–1.0).
 * @return array{score: float, grade: string, passes: bool, threshold: float, reasons: array<int, string>}
 */
function sourceweb_evaluate_source_quality( array $metrics, float $min_threshold = SOURCEWEB_SOURCE_QUALITY_THRESHOLD ): array {
	$fetched    = max( 0, (int) ( $metrics['fetched'] ?? 0 ) );
	$accepted   = max( 0, (int) ( $metrics['accepted'] ?? 0 ) );
	$duplicates = max( 0, (int) ( $metrics['duplicates'] ?? 0 ) );
	$rejected   = max( 0, (int) ( $metrics['rejected'] ?? 0 ) );
	$errors     = max( 0, (int) ( $metrics['errors'] ?? 0 ) );

	$reasons = array();
	if ( 0 === $fetched ) {
		$score = $errors > 0 ? 0.0 : 0.5;
		if ( $errors > 0 ) {
			$reasons[] = 'Fetch errors with zero items retrieved.';
		} else {
			$reasons[] = 'No items fetched yet.';
		}
		return array(
			'score'     => $score,
			'grade'     => $score >= $min_threshold ? 'healthy' : ( $score >= 0.4 ? 'watch' : 'poor' ),
			'passes'    => $score >= $min_threshold,
			'threshold' => $min_threshold,
			'reasons'   => $reasons,
		);
	}

	$accept_rate = min( 1.0, $accepted / $fetched );
	$dupe_rate   = min( 1.0, $duplicates / $fetched );
	$reject_rate = min( 1.0, $rejected / $fetched );
	$error_pen   = min( 0.4, $errors * 0.1 );

	$score = max( 0.0, min( 1.0, round( ( 0.65 * $accept_rate ) + ( 0.20 * ( 1.0 - $reject_rate ) ) + ( 0.15 * ( 1.0 - $dupe_rate ) ) - $error_pen, 3 ) ) );

	if ( $accept_rate < 0.25 ) {
		$reasons[] = 'Low acceptance rate.';
	}
	if ( $dupe_rate > 0.5 ) {
		$reasons[] = 'High duplicate rate.';
	}
	if ( $reject_rate > 0.5 ) {
		$reasons[] = 'High rejection rate.';
	}
	if ( $errors > 0 ) {
		$reasons[] = 'Recent fetch errors recorded.';
	}

	$passes = $score >= $min_threshold;
	$grade  = $passes ? 'healthy' : ( $score >= 0.40 ? 'watch' : 'poor' );

	return array(
		'score'     => $score,
		'grade'     => $grade,
		'passes'    => $passes,
		'threshold' => $min_threshold,
		'reasons'   => $reasons,
	);
}

if ( function_exists( 'add_action' ) ) {
	add_action(
		'rest_api_init',
		function () {
			$perm = function_exists( 'sourceweb_rest_can' ) ? sourceweb_rest_can( 'manage_options' ) : fn() => current_user_can( 'manage_options' );
			register_rest_route(
				'sourceweb/v1',
				'/ai/open-consent',
				array(
					array(
						'methods'             => 'GET',
						'callback'            => fn() => rest_ensure_response( array( 'consented' => sourceweb_ai_open_models_allowed() ) ),
						'permission_callback' => $perm,
					),
					array(
						'methods'             => 'POST',
						'callback'            => function ( WP_REST_Request $request ) {
							$yes = (bool) $request->get_param( 'consented' );
							update_option( SOURCEWEB_AI_OPEN_CONSENT_OPTION, $yes, false );
							return rest_ensure_response( array( 'consented' => sourceweb_ai_open_models_allowed() ) );
						},
						'permission_callback' => $perm,
					),
				)
			);
			register_rest_route(
				'sourceweb/v1',
				'/sources/evaluate-quality',
				array(
					'methods'             => 'POST',
					'callback'            => function ( WP_REST_Request $request ) {
						$metrics   = (array) $request->get_param( 'metrics' );
						$threshold = $request->get_param( 'threshold' );
						$min       = null !== $threshold ? (float) $threshold : SOURCEWEB_SOURCE_QUALITY_THRESHOLD;
						return rest_ensure_response( sourceweb_evaluate_source_quality( $metrics, $min ) );
					},
					'permission_callback' => $perm,
				)
			);
		}
	);
}
