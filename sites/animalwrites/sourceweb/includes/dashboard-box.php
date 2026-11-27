<?php
/**
 * Animal Writes: the WordPress Dashboard box "SourceWeb" (cards: to review, workers needing attention, AI keys refused;
 * a table of the workers with their last run and status). SourceWeb 0.4.0 no longer adds it; the helpers it uses
 * (sourceweb_sourcing_dash_workers(), sourceweb_sourcing_dash_ai_refused()) stay in the plugin. Loaded by ../site.php.
 *
 * @package animalwrites-sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'wp_dashboard_setup',
	function () {
		if ( ! current_user_can( AW_REVIEW_CAP ) ) {
			return; // the Sourcing menu's own capability
		}
		wp_add_dashboard_widget(
			'aw_sourcing_dashboard',
			'SourceWeb',
			function () {
				$rows    = sourceweb_sourcing_dash_workers();
				$need    = count( array_filter( $rows, fn( $r ) => $r['problem'] ) );
				$refused = sourceweb_sourcing_dash_ai_refused();
				$review  = sourceweb_review_count();
				$to_rev  = sourceweb_sourcing_overview_link( 'To review', admin_url( 'admin.php?page=aw-review' ), AW_REVIEW_CAP );
				if ( function_exists( 'kits_dash_cards' ) ) {
					echo kits_dash_cards( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside.
						array(
							array( 'label' => 'To review', 'value' => number_format_i18n( $review ) ),
							array( 'label' => 'Workers needing attention', 'value' => number_format_i18n( $need ) ),
							array( 'label' => 'AI keys refused', 'value' => null === $refused ? '–' : number_format_i18n( $refused ) ),
						)
					);
				}
				/* translators: 1: number of items, 2: link to To review. */
				echo '<p>' . sprintf( esc_html( _n( '%1$d item waiting in %2$s.', '%1$d items waiting in %2$s.', $review, 'sourceweb' ) ), (int) $review, $to_rev ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- the link is escaped by sourceweb_sourcing_overview_link().

				$status = array(
					'failed'  => array( 'dismiss', '#b32d2e', 'Failed' ),
					'late'    => array( 'clock', '#b32d2e', 'Late' ),
					'running' => array( 'update', '#50575e', 'Running' ),
					'ok'      => array( 'yes-alt', '#007017', 'OK' ),
					'off'     => array( 'minus', '#50575e', 'Off' ),
				);
				/* translators: 1: number of workers, 2: how many need attention. */
				$summary = sprintf( 'Workers (%1$s, %2$s need attention)', number_format_i18n( count( $rows ) ), number_format_i18n( $need ) );
				echo '<details' . ( $need ? ' open' : '' ) . '><summary>' . esc_html( $summary ) . '</summary>';
				echo '<table class="widefat striped"><thead><tr><th scope="col">Worker</th><th scope="col">Last run</th><th scope="col">Status</th></tr></thead><tbody>';
				foreach ( $rows as $r ) {
					$s = $status[ $r['status'] ];
					echo '<tr><td style="overflow-wrap:anywhere">' . esc_html( $r['name'] ) . '</td><td>' . esc_html( $r['last'] ? wp_date( 'j M, g:i a', $r['last'] ) : 'never' ) . '</td><td><span class="dashicons dashicons-' . esc_attr( $s[0] ) . '" style="color:' . esc_attr( $s[1] ) . '" aria-hidden="true"></span> ' . esc_html( $s[2] ) . '</td></tr>';
				}
				echo '</tbody></table></details>';

				echo '<p>' . sourceweb_sourcing_overview_link( 'Plugins → SourceWeb → Workers', admin_url( 'admin.php?page=aw-sourcing&tab=workers' ) ) . ' | ' . $to_rev . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by sourceweb_sourcing_overview_link().
			}
		);
	},
	20
);
