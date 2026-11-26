<?php
/**
 * RankWeb's WordPress dashboard box: the same counts as RankWeb → Dashboard, read from the stored count (never counted
 * while the dashboard loads). Stat cards from Kits Core when it is active, a plain list when not.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'wp_dashboard_setup',
	function () {
		if ( ! current_user_can( defined( 'RANKWEB_CAP' ) ? RANKWEB_CAP : 'manage_options' ) ) {
			return;
		}
		wp_add_dashboard_widget(
			'rankweb_dashboard',
			'RankWeb',
			function () {
				$c = get_transient( defined( 'RANKWEB_HEALTH' ) ? RANKWEB_HEALTH : 'rankweb_health' );
				if ( ! is_array( $c ) ) {
					if ( function_exists( 'rankweb_health_request' ) ) {
						rankweb_health_request(); // one background count; this view writes nothing else
					}
					echo '<p>' . esc_html__( 'Counting. Come back in a minute.', 'rankweb' ) . '</p>';
				} else {
					$n    = rankweb_health_numbers( $c );
					$rows = array(
						array( 'label' => __( 'Missing a title', 'rankweb' ), 'value' => number_format_i18n( $n['titles'] ) ),
						array( 'label' => __( 'Missing a description', 'rankweb' ), 'value' => number_format_i18n( $n['descs'] ) ),
						array( 'label' => __( 'Pages with an FAQ', 'rankweb' ), 'value' => number_format_i18n( $n['faq'] ) ),
						array( 'label' => __( 'Kept out of search', 'rankweb' ), 'value' => number_format_i18n( $n['noindex'] ) ),
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
				echo '<p><a href="' . esc_url( function_exists( 'rankweb_ui_url' ) ? rankweb_ui_url( 'dashboard' ) : admin_url( 'admin.php?page=aw-seo-plus' ) ) . '">' . esc_html__( 'Open RankWeb', 'rankweb' ) . '</a></p>';
			}
		);
	},
	20
);
