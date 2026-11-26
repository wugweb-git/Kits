<?php
/**
 * Claim events for a CRM. Every native claim change (received, approved, rejected, revoked) is announced once with
 * `do_action( 'directoryweb_claim_event', $event, $claim, $listing_title )`, so any CRM, form or mailer plugin can
 * listen. The claimant is also filed with every CRM adapter that reports itself active (the system's own CRM, whichever
 * is installed). Built in: FluentCRM, as a contact (status "transactional": no list and no marketing consent, so
 * nothing is mailed to them from the CRM) carrying one tag for the claim's current state. Another CRM is added with
 * the `directoryweb_claim_crm_adapters` filter: `$adapters['id'] = array( 'active' => callable(): bool, 'file' =>
 * callable( array $plan, array $claim ): void )`, where `$plan` comes from directoryweb_claim_crm_plan(). With no CRM
 * installed nothing happens beyond the action. Turn the filing off with
 * `add_filter( 'directoryweb_claim_crm_enabled', '__return_false' )`.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Tag titles by event. A contact carries only the tag of the claim's latest state.
 *
 * @return array<string, string> event => tag title.
 */
function directoryweb_claim_crm_tags(): array {
	return array(
		'received' => 'Claim received',
		'approved' => 'Claim approved',
		'rejected' => 'Claim rejected',
		'revoked'  => 'Claim revoked',
	);
}

/**
 * What to file for a claim event, or null when the event is not one of the four or the claimant has no valid address.
 * Pure: no CRM call, so it can be tested.
 *
 * @param string $event 'created' or the state the claim moved to.
 * @param array  $claim directoryweb_claim_get().
 * @return array{email:string,first_name:string,last_name:string,event:string,tag:string}|null
 */
function directoryweb_claim_crm_plan( string $event, array $claim ): ?array {
	$event = 'created' === $event ? 'received' : $event;
	$tags  = directoryweb_claim_crm_tags();
	$email = strtolower( trim( (string) ( $claim['person']['email'] ?? '' ) ) );
	if ( ! isset( $tags[ $event ] ) || ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
		return null;
	}
	$parts = preg_split( '/\s+/', trim( (string) ( $claim['person']['name'] ?? '' ) ), 2 );
	return array(
		'email'      => $email,
		'first_name' => (string) ( $parts[0] ?? '' ),
		'last_name'  => (string) ( $parts[1] ?? '' ),
		'event'      => $event,
		'tag'        => $tags[ $event ],
	);
}

/**
 * Announces a claim event and, with FluentCRM active, files the claimant.
 *
 * @param string $event 'created' or the state the claim moved to.
 * @param int    $id    aw_claim ID.
 */
function directoryweb_claim_event( string $event, int $id ): void {
	$claim = function_exists( 'directoryweb_claim_get' ) ? directoryweb_claim_get( $id ) : null;
	if ( ! $claim ) {
		return;
	}
	$title = (string) get_the_title( (int) $claim['listing'] );
	do_action( 'directoryweb_claim_event', 'created' === $event ? 'received' : $event, $claim, $title );
	if ( ! apply_filters( 'directoryweb_claim_crm_enabled', true, $event, $claim ) ) {
		return;
	}
	$plan = directoryweb_claim_crm_plan( $event, $claim );
	if ( ! $plan ) {
		return;
	}
	foreach ( directoryweb_claim_crm_adapters() as $adapter ) {
		try {
			if ( is_callable( $adapter['active'] ?? null ) && is_callable( $adapter['file'] ?? null ) && call_user_func( $adapter['active'] ) ) {
				call_user_func( $adapter['file'], $plan, $claim );
			}
		} catch ( \Throwable $e ) {
			error_log( 'DirectoryWeb claim CRM error: ' . $e->getMessage() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- a CRM problem is only logged.
		}
	}
}

/**
 * The CRMs a claim can be filed with. FluentCRM is built in; others come through the filter.
 *
 * @return array<string, array{active: callable, file: callable}>
 */
function directoryweb_claim_crm_adapters(): array {
	$adapters = array(
		'fluentcrm' => array(
			'active' => static function (): bool {
				return function_exists( 'FluentCrmApi' );
			},
			'file'   => 'directoryweb_claim_crm_fluent',
		),
	);
	return (array) apply_filters( 'directoryweb_claim_crm_adapters', $adapters );
}

/**
 * Files the claimant in FluentCRM: finds or makes the contact, attaches the state's tag, removes the other claim tags.
 *
 * @param array $plan  directoryweb_claim_crm_plan().
 * @param array $claim directoryweb_claim_get().
 */
function directoryweb_claim_crm_fluent( array $plan, array $claim ): void {
	$contacts = FluentCrmApi( 'contacts' );
	$tags     = FluentCrmApi( 'tags' );
	if ( ! is_object( $contacts ) || ! is_object( $tags ) || ! method_exists( $tags, 'getInstance' ) ) {
		return;
	}
	$contact = $contacts->getContact( $plan['email'] );
	if ( ! $contact ) {
		$contact = $contacts->createOrUpdate(
			array(
				'email'      => $plan['email'],
				'first_name' => $plan['first_name'],
				'last_name'  => $plan['last_name'],
				'status'     => 'transactional',
				'source'     => 'directoryweb',
			)
		);
	}
	if ( ! is_object( $contact ) || ! method_exists( $contact, 'attachTags' ) ) {
		return;
	}
	$model  = $tags->getInstance();
	$attach = array();
	$detach = array();
	foreach ( directoryweb_claim_crm_tags() as $ev => $title ) {
		$slug = sanitize_title( $title );
		$tag  = $model->where( 'slug', $slug )->first();
		if ( ! $tag && $ev === $plan['event'] ) {
			$tag = $model->create(
				array(
					'title' => $title,
					'slug'  => $slug,
				)
			);
		}
		$tid = is_object( $tag ) ? (int) $tag->id : ( is_array( $tag ) ? (int) ( $tag['id'] ?? 0 ) : 0 );
		if ( $tid ) {
			if ( $ev === $plan['event'] ) {
				$attach[] = $tid;
			} else {
				$detach[] = $tid;
			}
		}
	}
	if ( $detach && method_exists( $contact, 'detachTags' ) ) {
		$contact->detachTags( $detach );
	}
	if ( $attach ) {
		$contact->attachTags( $attach );
	}
}

add_action(
	'directoryweb_claim_created',
	static function ( $id ) {
		directoryweb_claim_event( 'created', (int) $id );
	},
	20
);
add_action(
	'directoryweb_claim_transitioned',
	static function ( $id, $from, $to ) {
		directoryweb_claim_event( (string) $to, (int) $id );
	},
	20,
	3
);
