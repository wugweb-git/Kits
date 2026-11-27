<?php
/**
 * Who may push items in, and whether anything may go live without a person.
 * Plain helpers; no screen. Loaded right after sourceweb-caps.php.
 *
 * - sourceweb_ingest_can(): the capability the worker routes (ingest, relevance, same story, relay, summaries,
 *   heartbeat, AI usage) need. It is manage_sourceweb (administrators and every role that can edit others' posts, so
 *   an Editor-level worker login keeps working); Authors and Contributors (edit_posts) no longer qualify. A site can
 *   change it with the `sourceweb_ingest_capability` filter. The workers that authenticate with an application
 *   password keep doing so: the routes that already required it still do.
 * - sourceweb_publish_allowed(): items arrive as Pending (or are held) unless this is on. Off by default. Turn it on in
 *   SourceWeb → Settings ("Publishing"), or with the `sourceweb_allow_publish` filter. A person can still approve an
 *   item in To review whatever this says.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The capability the worker routes need (default manage_sourceweb). */
function sourceweb_ingest_cap(): string {
	$cap = apply_filters( 'sourceweb_ingest_capability', defined( 'SOURCEWEB_CAP' ) ? SOURCEWEB_CAP : 'manage_options' );
	return is_string( $cap ) && '' !== $cap ? $cap : 'manage_options';
}

/** The current user may push items to the worker routes. Administrators and the dedicated aw_worker capability always may. */
function sourceweb_ingest_can(): bool {
	return current_user_can( 'manage_options' ) || current_user_can( 'aw_worker' ) || current_user_can( sourceweb_ingest_cap() );
}

/** Items that arrive may be published without a person (off unless the setting or the filter turns it on). */
function sourceweb_publish_allowed(): bool {
	return (bool) apply_filters( 'sourceweb_allow_publish', (bool) get_option( 'sourceweb_allow_publish', false ) );
}

// SourceWeb → Settings → Modes: one switch, off. A Settings API form (see sourceweb_modes_form()).
add_action(
	'init',
	function () {
		foreach ( array( 'sourceweb_allow_publish' ) as $name ) {
			register_setting(
				'aw_src_modes',
				$name,
				array(
					'type'              => 'boolean',
					'default'           => false,
					'sanitize_callback' => 'rest_sanitize_boolean',
					'show_in_rest'      => false,
				)
			);
		}
	}
);

/** The switch, as a form for the Settings screen (administrators only; the caller checks). */
function sourceweb_modes_form(): void {
	echo '<form method="post" action="' . esc_url( admin_url( 'options.php' ) ) . '">';
	settings_fields( 'aw_src_modes' );
	echo '<h2>' . esc_html__( 'Publishing', 'sourceweb' ) . '</h2>';
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row">' . esc_html__( 'Publishing', 'sourceweb' ) . '</th><td><label for="sourceweb_allow_publish"><input type="checkbox" id="sourceweb_allow_publish" name="sourceweb_allow_publish" value="1"' . checked( (bool) get_option( 'sourceweb_allow_publish', false ), true, false ) . '> ' . esc_html__( 'Let items that pass the checks go live without a person', 'sourceweb' ) . '</label>';
	echo '<p class="description">' . esc_html__( 'Off: every item the workers send waits in To review as Pending. A person can still approve it there.', 'sourceweb' ) . '</p></td></tr>';
	echo '</tbody></table>';
	submit_button( __( 'Save', 'sourceweb' ) );
	echo '</form>';
}
