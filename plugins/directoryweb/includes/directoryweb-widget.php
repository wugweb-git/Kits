<?php
/**
 * DirectoryWeb's WordPress dashboard box: the same counts as DirectoryWeb → Dashboard, read from the stored count
 * (never counted while the dashboard loads). Stat cards from Kits Core when it is active, a plain list when not.
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'wp_dashboard_setup',
	function () {
		if ( ! current_user_can( defined( 'DIRECTORYWEB_CAP' ) ? DIRECTORYWEB_CAP : 'manage_options' ) ) {
			return;
		}
		wp_add_dashboard_widget(
			'directoryweb_dashboard',
			'DirectoryWeb',
			function () {
				$c = get_transient( DIRECTORYWEB_STATS );
				if ( ! is_array( $c ) ) {
					directoryweb_stats_request(); // one background count; this view writes nothing else
					echo '<p>' . esc_html__( 'Counting. Come back in a minute.', 'directoryweb' ) . '</p>';
				} else {
					$s    = (array) ( $c['listings']['status'] ?? array() );
					$cl   = is_array( $c['claims'] ?? null ) ? $c['claims'] : array();
					$b    = (array) ( $c['badges'] ?? array() );
					$rows = array(
						array( 'label' => __( 'Published', 'directoryweb' ), 'value' => number_format_i18n( (int) ( $s['publish'] ?? 0 ) ) ),
						array( 'label' => __( 'Waiting for review', 'directoryweb' ), 'value' => number_format_i18n( (int) ( $s['pending'] ?? 0 ) ) ),
						array( 'label' => __( 'Claims waiting', 'directoryweb' ), 'value' => number_format_i18n( (int) ( $cl['pending'] ?? 0 ) ) ),
						array( 'label' => __( 'Need a re-check', 'directoryweb' ), 'value' => number_format_i18n( (int) ( $b['recheck'] ?? 0 ) ) ),
					);
					if ( function_exists( 'kits_dash_cards' ) ) {
						echo kits_dash_cards( $rows ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside.
					} else {
						echo '<ul>';
						foreach ( $rows as $r ) {
							echo '<li>' . esc_html( $r['label'] . ': ' . $r['value'] ) . '</li>';
						}
						echo '</ul>';
					}
				}
				echo '<p><a href="' . esc_url( directoryweb_ui_url( 'dashboard' ) ) . '">' . esc_html__( 'Open DirectoryWeb', 'directoryweb' ) . '</a></p>';
			}
		);
	},
	20
);
