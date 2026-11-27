<?php
/**
 * Site check-in: an optional, weekly message from a site to an address its owner chose, saying which Wugweb products
 * and versions it runs. Off by default, and nothing is sent until BOTH the switch is on AND an https address is set.
 *
 * What is sent (and nothing else; the Tools card shows the exact text): the site address, the WordPress and PHP
 * versions, the update channel, and the name and version of each Wugweb plugin and the Kits theme that is installed.
 * No user, no email address, no content, no IP list, no plugin of anyone else's.
 *
 * Decisions (26 Nov 2026): off by default (WordPress.org rule: no calling home without consent); the address is the owner's
 * setting and is empty until a receiver exists; one try a week, no retry loop; a failure is recorded, never repeated at once.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const KITS_CHECKIN_JOB = 'kits_checkin_weekly';

/** The Wugweb plugin folders a check-in may name (anything else is left out). */
function kits_checkin_known_plugins(): array {
	return array( 'kits-core', 'directoryweb', 'rankweb', 'sourceweb', 'insightweb', 'mailweb', 'planweb' );
}

/** A safe https address, or an empty string. */
function kits_checkin_clean_url( $url ): string {
	$url = esc_url_raw( trim( (string) $url ), array( 'https' ) );
	if ( '' === $url ) {
		return '';
	}
	$parts = wp_parse_url( $url );
	return ( is_array( $parts ) && ! empty( $parts['host'] ) && empty( $parts['user'] ) && empty( $parts['pass'] ) ) ? $url : '';
}

/** 1 or 0 (a checkbox). */
function kits_checkin_clean_flag( $value ): int {
	return ( true === $value || 1 === $value || '1' === $value || 'on' === $value ) ? 1 : 0;
}

/**
 * Whether the check-in may send now: switched on, an address set, and not off by a filter.
 *
 * @param int    $on  The switch.
 * @param string $url The address.
 */
function kits_checkin_may_send( int $on, string $url ): bool {
	return 1 === $on && '' !== kits_checkin_clean_url( $url ) && (bool) apply_filters( 'kits_checkin', true );
}

/**
 * The message, from plain facts. Pure: it only trims and limits what it is given.
 *
 * @param array $facts site (string address), wp, php, channel, theme (version or ''), plugins (folder => version).
 * @return array
 */
function kits_checkin_payload( array $facts ): array {
	$known   = kits_checkin_known_plugins();
	$plugins = array();
	foreach ( (array) ( $facts['plugins'] ?? array() ) as $folder => $version ) {
		$folder  = (string) $folder;
		$version = substr( preg_replace( '/[^0-9A-Za-z.\-+]/', '', (string) $version ), 0, 32 );
		if ( in_array( $folder, $known, true ) && '' !== $version ) {
			$plugins[ $folder ] = $version;
		}
	}
	ksort( $plugins );
	$channel = ( 'pre' === ( $facts['channel'] ?? '' ) ) ? 'pre' : 'stable';
	$theme   = substr( preg_replace( '/[^0-9A-Za-z.\-+]/', '', (string) ( $facts['theme'] ?? '' ) ), 0, 32 );
	return array(
		'schema'  => 1,
		'site'    => esc_url_raw( (string) ( $facts['site'] ?? '' ) ),
		'wp'      => substr( preg_replace( '/[^0-9A-Za-z.\-+]/', '', (string) ( $facts['wp'] ?? '' ) ), 0, 32 ),
		'php'     => substr( preg_replace( '/[^0-9A-Za-z.\-+]/', '', (string) ( $facts['php'] ?? '' ) ), 0, 32 ),
		'channel' => $channel,
		'theme'   => $theme,
		'plugins' => $plugins,
	);
}

/** The facts about this site that the message uses. */
function kits_checkin_facts(): array {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$plugins = array();
	foreach ( get_plugins() as $file => $data ) {
		$folder = dirname( (string) $file );
		if ( in_array( $folder, kits_checkin_known_plugins(), true ) ) {
			$plugins[ $folder ] = (string) ( $data['Version'] ?? '' );
		}
	}
	$theme = wp_get_theme( 'kits-by-wugweb' );
	return array(
		'site'    => home_url( '/' ),
		'wp'      => get_bloginfo( 'version' ),
		'php'     => PHP_VERSION,
		'channel' => function_exists( 'kits_update_channel' ) ? kits_update_channel() : 'stable',
		'theme'   => $theme->exists() ? (string) $theme->get( 'Version' ) : '',
		'plugins' => $plugins,
	);
}

/** The settings. */
function kits_checkin_settings(): array {
	return array(
		'on'  => kits_checkin_clean_flag( get_option( 'kits_checkin_on', 0 ) ),
		'url' => kits_checkin_clean_url( get_option( 'kits_checkin_url', '' ) ),
	);
}

/**
 * Send one check-in now. Records the time and the outcome; never loops.
 *
 * @param bool $force Send even when the switch is off (the "Send now" button still needs an address).
 * @return array{ok: bool, message: string}
 */
function kits_checkin_send( bool $force = false ): array {
	$s = kits_checkin_settings();
	if ( '' === $s['url'] ) {
		return array(
			'ok' => false,
			'message' => 'No address is set.',
		);
	}
	if ( ! $force && ! kits_checkin_may_send( $s['on'], $s['url'] ) ) {
		return array(
			'ok' => false,
			'message' => 'The check-in is off.',
		);
	}
	$res = wp_remote_post(
		$s['url'],
		array(
			'timeout'     => 5,
			'redirection' => 0,
			'headers'     => array( 'Content-Type' => 'application/json' ),
			'user-agent'  => 'Kits-checkin/1',
			'body'        => wp_json_encode( kits_checkin_payload( kits_checkin_facts() ) ),
		)
	);
	$code = is_wp_error( $res ) ? 0 : (int) wp_remote_retrieve_response_code( $res );
	$ok   = $code >= 200 && $code < 300;
	update_option(
		'kits_checkin_last',
		array(
			'time'    => time(),
			'ok'      => $ok,
			'message' => $ok ? 'Sent.' : ( is_wp_error( $res ) ? $res->get_error_message() : 'The receiver answered ' . $code . '.' ),
		),
		false
	);
	return array(
		'ok' => $ok,
		'message' => $ok ? 'Sent.' : (string) get_option( 'kits_checkin_last' )['message'],
	);
}

add_action(
	KITS_CHECKIN_JOB,
	function () {
		kits_checkin_send( false );
	}
);

/** Books or removes the weekly job to match the settings. Runs on admin requests only. */
function kits_checkin_sync_schedule(): void {
	$s    = kits_checkin_settings();
	$next = wp_next_scheduled( KITS_CHECKIN_JOB );
	if ( kits_checkin_may_send( $s['on'], $s['url'] ) ) {
		if ( ! $next ) {
			wp_schedule_event( time() + DAY_IN_SECONDS, 'weekly', KITS_CHECKIN_JOB );
		}
	} elseif ( $next ) {
		wp_unschedule_hook( KITS_CHECKIN_JOB );
	}
}
add_filter(
	'cron_schedules',
	function ( $schedules ) {
		if ( ! isset( $schedules['weekly'] ) ) {
			$schedules['weekly'] = array(
				'interval' => WEEK_IN_SECONDS,
				'display'  => 'Once a week',
			);
		}
		return $schedules;
	}
);
add_action( 'admin_init', 'kits_checkin_sync_schedule' );

/** Tools → Site check-in. */
function kits_checkin_part(): void {
	$s    = kits_checkin_settings();
	$last = get_option( 'kits_checkin_last' );
	echo '<p>' . esc_html( 'Off by default. When you switch it on and give an https address, this site sends the message below to that address once a week. Nothing is sent otherwise. It carries no user, no email address and no content.' ) . '</p>';
	echo '<pre style="white-space:pre-wrap;max-width:60em">' . esc_html( (string) wp_json_encode( kits_checkin_payload( kits_checkin_facts() ), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) ) . '</pre>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	wp_nonce_field( 'kits_checkin_save' );
	echo '<input type="hidden" name="action" value="kits_checkin_save" />';
	echo '<p><label><input type="checkbox" name="kits_checkin_on" value="1"' . checked( 1, $s['on'], false ) . ' /> ' . esc_html( 'Send this message once a week' ) . '</label></p>';
	echo '<p><label>' . esc_html( 'Send it to (https address)' ) . '<br /><input type="url" class="regular-text" name="kits_checkin_url" value="' . esc_attr( $s['url'] ) . '" placeholder="https://" /></label></p>';
	echo '<p><button type="submit" class="button button-primary">' . esc_html( 'Save' ) . '</button></p></form>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	wp_nonce_field( 'kits_checkin_now' );
	echo '<input type="hidden" name="action" value="kits_checkin_now" />';
	echo '<p><button type="submit" class="button">' . esc_html( 'Send once now' ) . '</button> ' . esc_html( 'Uses the saved address.' ) . '</p></form>';
	if ( is_array( $last ) && ! empty( $last['time'] ) ) {
		echo '<p>' . esc_html( sprintf( 'Last try: %1$s, %2$s', wp_date( 'j M Y, H:i', (int) $last['time'] ), (string) ( $last['message'] ?? '' ) ) ) . '</p>';
	}
}

add_action(
	'admin_post_kits_checkin_save',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html( 'You cannot change these settings.' ), 403 );
		}
		check_admin_referer( 'kits_checkin_save' );
		$url = kits_checkin_clean_url( wp_unslash( $_POST['kits_checkin_url'] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- cleaned by kits_checkin_clean_url().
		$on  = kits_checkin_clean_flag( wp_unslash( $_POST['kits_checkin_on'] ?? 0 ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- cleaned by kits_checkin_clean_flag().
		$bad = '' === $url && '' !== trim( (string) wp_unslash( $_POST['kits_checkin_url'] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- only tested for empty.
		update_option( 'kits_checkin_url', $url, false );
		update_option( 'kits_checkin_on', $on, false );
		kits_checkin_sync_schedule();
		kits_transfer_back(
			$bad
				? array(
					'title' => 'Saved, but the address was not used',
					'error' => 'It must be an https address.',
				)
				: array(
					'title' => 'Check-in settings saved.',
					'lines' => array( ( $on && '' !== $url ) ? 'It will send once a week.' : 'Nothing will be sent.' ),
				)
		);
	}
);

add_action(
	'admin_post_kits_checkin_now',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html( 'You cannot change these settings.' ), 403 );
		}
		check_admin_referer( 'kits_checkin_now' );
		$r = kits_checkin_send( true );
		kits_transfer_back(
			$r['ok']
				? array(
					'title' => 'Check-in sent.',
					'lines' => array( 'Sent once, to the saved address.' ),
				)
				: array(
					'title' => 'Check-in not sent',
					'error' => $r['message'],
				)
		);
	}
);
