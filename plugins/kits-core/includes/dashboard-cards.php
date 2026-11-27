<?php
/**
 * Dashboard widget parts (owner, 3 Nov 2026: Dashboard widgets may use stat cards and small charts; every other admin
 * screen stays core-only). Plain HTML and inline SVG, no chart library and no script. Kits shell look from 26 Nov 2026 (black, white, greys; red only for a fault), text
 * that says up or down (never colour alone), and the exact figures stay in a table under the chart.
 *
 * kits_dash_cards( $cards ): a row of stat cards. Each card: label, value (already formatted), and optionally
 * delta (number, the change), delta_text (what it is compared with, e.g. "on the 7 days before"), href (the number
 * links there), sub (one small line) and tone ('warn' or 'error': "Needs attention" / "Not working", with an icon).
 * kits_dash_bars( $values, $label ): a small bar chart; $values is label => number, oldest first.
 *
 * @package kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Stat cards.
 *
 * @param array $cards Cards: label, value, delta (optional), delta_text (optional).
 * @return string HTML.
 */
function kits_dash_cards( array $cards ): string {
	$out = '<ul class="aw-dash-cards">';
	foreach ( $cards as $c ) {
		$out .= '<li class="aw-dash-card"><span class="aw-dash-label">' . esc_html( (string) ( $c['label'] ?? '' ) ) . '</span>';
		$val  = esc_html( (string) ( $c['value'] ?? '' ) );
		if ( ! empty( $c['href'] ) ) {
			$val = '<a href="' . esc_url( (string) $c['href'] ) . '">' . $val . '</a>'; // the number opens the screen behind it
		}
		$out .= '<span class="aw-dash-value">' . $val . '</span>';
		if ( ! empty( $c['sub'] ) ) {
			$out .= '<span class="aw-dash-sub">' . esc_html( (string) $c['sub'] ) . '</span>';
		}
		if ( in_array( $c['tone'] ?? '', array( 'warn', 'error' ), true ) ) {
			// A tone is said in words and an icon as well as colour.
			$out .= '<span class="aw-dash-tone aw-dash-tone--' . esc_attr( $c['tone'] ) . '"><span class="dashicons dashicons-' . ( 'error' === $c['tone'] ? 'dismiss' : 'warning' ) . '" aria-hidden="true"></span> ' . esc_html( 'error' === $c['tone'] ? __( 'Not working', 'kits-core' ) : __( 'Needs attention', 'kits-core' ) ) . '</span>';
		}
		if ( isset( $c['delta'] ) && is_numeric( $c['delta'] ) ) {
			$d    = (float) $c['delta'];
			$dir  = $d > 0 ? 'up' : ( $d < 0 ? 'down' : 'flat' );
			$mark = 'up' === $dir ? '▲' : ( 'down' === $dir ? '▼' : '=' );
			$word = 'up' === $dir ? 'Up' : ( 'down' === $dir ? 'Down' : 'Same' );
			$num  = 'flat' === $dir ? '' : ' ' . number_format_i18n( abs( $d ) );
			$out .= '<span class="aw-dash-delta aw-dash-delta--' . $dir . '"><span aria-hidden="true">' . $mark . '</span> ' . esc_html( $word . $num . ( empty( $c['delta_text'] ) ? '' : ' ' . $c['delta_text'] ) ) . '</span>';
		}
		$out .= '</li>';
	}
	return $out . '</ul>';
}

/**
 * A small bar chart (inline SVG). Screen readers get one sentence; the figures themselves are in the table the widget
 * prints under it.
 *
 * @param array  $values Label => number, oldest first.
 * @param string $label  What the bars are, e.g. "Visits per day, last 14 days".
 * @return string HTML.
 */
function kits_dash_bars( array $values, string $label, bool $table = false ): string {
	if ( ! $values ) {
		return '';
	}
	// Mark spec (dataviz, 3 Nov 2026): bars at most 24px wide with a 2px surface gap, a 4px rounded data-end and a
	// square baseline, one recessive baseline, and only the peak labelled (never a number on every bar).
	$n    = count( $values );
	$max  = max( 1, max( array_map( 'floatval', $values ) ) );
	$w    = 280;
	$h    = 72;
	$top  = 14; // room for the peak label
	$gap  = 2;
	$slot = ( $w - $gap * ( $n - 1 ) ) / $n;
	$bw   = min( 24, max( 2, $slot ) );
	$keys = array_keys( $values );
	$sum  = sprintf( '%1$s: from %2$s (%3$s) to %4$s (%5$s), highest %6$s.', $label, $keys[0], number_format_i18n( (float) reset( $values ) ), end( $keys ), number_format_i18n( (float) end( $values ) ), number_format_i18n( $max ) );
	$bars = '';
	$peak = '';
	$i    = 0;
	foreach ( $values as $k => $v ) {
		$v   = (float) $v;
		$bh  = $v > 0 ? max( 1, round( ( $v / $max ) * ( $h - $top ), 1 ) ) : 0;
		$x   = round( $i * ( $slot + $gap ) + ( $slot - $bw ) / 2, 1 );
		$y   = $h - $bh;
		$r   = min( 4, $bw / 2, $bh );
		$tip = '<title>' . esc_html( $k . ': ' . number_format_i18n( $v ) ) . '</title>';
		if ( $bh > 0 ) {
			// Rounded top corners, square at the baseline.
			$d     = sprintf( 'M%1$s %2$sV%3$sQ%1$s %4$s %5$s %4$sH%6$sQ%7$s %4$s %7$s %3$sV%2$sZ', $x, $h, $y + $r, $y, $x + $r, $x + $bw - $r, $x + $bw );
			$bars .= '<path d="' . esc_attr( $d ) . '">' . $tip . '</path>';
		}
		if ( '' === $peak && $v >= $max ) {
			$peak = '<text x="' . round( $x + $bw / 2, 1 ) . '" y="' . max( 10, $y - 3 ) . '" text-anchor="middle">' . esc_html( number_format_i18n( $v ) ) . '</text>';
		}
		++$i;
	}
	$base = '<line x1="0" y1="' . $h . '" x2="' . $w . '" y2="' . $h . '"></line>';
	$out  = '<figure class="aw-dash-chart"><svg viewBox="0 0 ' . $w . ' ' . ( $h + 1 ) . '" role="img" aria-label="' . esc_attr( $sum ) . '">' . $bars . $base . $peak . '</svg><figcaption class="description">' . esc_html( $label ) . '</figcaption></figure>';
	if ( $table ) { // the exact figures (a table view for every chart)
		$rows = '';
		foreach ( array_reverse( $values, true ) as $k => $v ) {
			$rows .= '<tr><td>' . esc_html( (string) $k ) . '</td><td>' . esc_html( number_format_i18n( (float) $v ) ) . '</td></tr>';
		}
		$out .= '<details><summary>' . esc_html( 'Figures' ) . '</summary><table class="widefat striped"><thead><tr><th scope="col">Day</th><th scope="col">' . esc_html( $label ) . '</th></tr></thead><tbody>' . $rows . '</tbody></table></details>';
	}
	return $out;
}

// The styles, once, on the Dashboard only.
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		if ( 'index.php' !== $hook ) {
			return;
		}
		wp_register_style( 'kits-dash-cards', false, array(), KITS_CORE_LOADED ); // No file: the rules below only.
		wp_enqueue_style( 'kits-dash-cards' );
		wp_add_inline_style(
			'kits-dash-cards',
			implode(
				"\n",
				array(
					'.aw-dash-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,8.5em),1fr));gap:10px;margin:0 0 16px;padding:0;list-style:none}',
					'.aw-dash-card{min-width:0;margin:0;padding:14px 14px 12px;border:1px solid #e6e6e6;border-radius:12px;background:#fafafa;display:flex;flex-direction:column;gap:4px}',
					'.aw-dash-label{color:#6b6b6b;font-size:12px;font-weight:500;letter-spacing:.02em;overflow-wrap:anywhere}',
					'.aw-dash-value{color:#0a0a0a;font-size:30px;font-weight:700;line-height:1.1;letter-spacing:-.02em;overflow-wrap:anywhere}',
					'.aw-dash-value a{color:inherit;text-decoration:none}',
					'.aw-dash-value a:hover,.aw-dash-value a:focus{text-decoration:underline}',
					'.aw-dash-sub{color:#6b6b6b;font-size:12px}',
					'.aw-dash-tone{font-size:12px;font-weight:600}',
					'.aw-dash-tone .dashicons{font-size:14px;width:14px;height:14px;vertical-align:text-bottom}',
					'.aw-dash-tone--warn{color:#0a0a0a}',
					'.aw-dash-tone--error{color:#b32d2e}',
					'.aw-dash-delta{font-size:12px;color:#6b6b6b}',
					'.aw-dash-delta--up{color:#0a0a0a}',
					'.aw-dash-delta--down{color:#b32d2e}',
					'.aw-dash-chart{margin:0 0 14px}',
					'.aw-dash-chart svg{display:block;width:100%;height:auto;max-height:120px;fill:#0a0a0a;overflow:visible}',
					'.aw-dash-chart line{stroke:#e6e6e6;stroke-width:1}',
					'.aw-dash-chart text{fill:#6b6b6b;font-size:10px}',
					'.aw-dash-chart figcaption{margin-top:4px}',
					'#mailweb_widget,#planweb_next,#aw_team_dates,#aw_activity,#aw_form_entries,#aw_cron_health,#aw_seo_dashboard,#rankweb_dashboard,#aw_sourcing_dashboard,#directoryweb_dashboard{border:1px solid #e6e6e6;border-radius:14px;box-shadow:none;background:#fff;overflow:hidden}',
					'#mailweb_widget .postbox-header,#planweb_next .postbox-header,#aw_team_dates .postbox-header,#aw_activity .postbox-header,#aw_form_entries .postbox-header,#aw_cron_health .postbox-header,#aw_seo_dashboard .postbox-header,#rankweb_dashboard .postbox-header,#aw_sourcing_dashboard .postbox-header,#directoryweb_dashboard .postbox-header{border-bottom:1px solid #efefef}',
					'#mailweb_widget .postbox-header .hndle,#planweb_next .postbox-header .hndle,#aw_team_dates .postbox-header .hndle,#aw_activity .postbox-header .hndle,#aw_form_entries .postbox-header .hndle,#aw_cron_health .postbox-header .hndle,#aw_seo_dashboard .postbox-header .hndle,#rankweb_dashboard .postbox-header .hndle,#aw_sourcing_dashboard .postbox-header .hndle,#directoryweb_dashboard .postbox-header .hndle{font-size:14px;font-weight:700;color:#0a0a0a;letter-spacing:-.01em;padding:12px 16px}',
					'#mailweb_widget .inside,#planweb_next .inside,#aw_team_dates .inside,#aw_activity .inside,#aw_form_entries .inside,#aw_cron_health .inside,#aw_seo_dashboard .inside,#rankweb_dashboard .inside,#aw_sourcing_dashboard .inside,#directoryweb_dashboard .inside{margin:0;padding:16px;color:#2b2b2b}',
					'#mailweb_widget a,#planweb_next a,#aw_team_dates a,#aw_activity a,#aw_form_entries a,#aw_cron_health a,#aw_seo_dashboard a,#rankweb_dashboard a,#aw_sourcing_dashboard a,#directoryweb_dashboard a{color:#0a0a0a;text-decoration:underline;text-underline-offset:2px}',
					'#mailweb_widget a:hover,#planweb_next a:hover,#aw_team_dates a:hover,#aw_activity a:hover,#aw_form_entries a:hover,#aw_cron_health a:hover,#aw_seo_dashboard a:hover,#rankweb_dashboard a:hover,#aw_sourcing_dashboard a:hover,#directoryweb_dashboard a:hover,#mailweb_widget a:focus,#planweb_next a:focus,#aw_team_dates a:focus,#aw_activity a:focus,#aw_form_entries a:focus,#aw_cron_health a:focus,#aw_seo_dashboard a:focus,#rankweb_dashboard a:focus,#aw_sourcing_dashboard a:focus,#directoryweb_dashboard a:focus{color:#000;text-decoration-thickness:2px}',
					'#mailweb_widget table.widefat,#planweb_next table.widefat,#aw_team_dates table.widefat,#aw_activity table.widefat,#aw_form_entries table.widefat,#aw_cron_health table.widefat,#aw_seo_dashboard table.widefat,#rankweb_dashboard table.widefat,#aw_sourcing_dashboard table.widefat,#directoryweb_dashboard table.widefat{border:0;box-shadow:none;background:transparent}',
					'#mailweb_widget table.widefat th,#planweb_next table.widefat th,#aw_team_dates table.widefat th,#aw_activity table.widefat th,#aw_form_entries table.widefat th,#aw_cron_health table.widefat th,#aw_seo_dashboard table.widefat th,#rankweb_dashboard table.widefat th,#aw_sourcing_dashboard table.widefat th,#directoryweb_dashboard table.widefat th{color:#6b6b6b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #e6e6e6;padding:8px 4px}',
					'#mailweb_widget table.widefat td,#planweb_next table.widefat td,#aw_team_dates table.widefat td,#aw_activity table.widefat td,#aw_form_entries table.widefat td,#aw_cron_health table.widefat td,#aw_seo_dashboard table.widefat td,#rankweb_dashboard table.widefat td,#aw_sourcing_dashboard table.widefat td,#directoryweb_dashboard table.widefat td{padding:9px 4px;border-bottom:1px solid #f1f1f1}',
					'#mailweb_widget table.widefat tbody th,#planweb_next table.widefat tbody th,#aw_team_dates table.widefat tbody th,#aw_activity table.widefat tbody th,#aw_form_entries table.widefat tbody th,#aw_cron_health table.widefat tbody th,#aw_seo_dashboard table.widefat tbody th,#rankweb_dashboard table.widefat tbody th,#aw_sourcing_dashboard table.widefat tbody th,#directoryweb_dashboard table.widefat tbody th{text-transform:none;font-size:13px;font-weight:500;color:#0a0a0a;letter-spacing:0;border-bottom:1px solid #f1f1f1;padding:9px 4px}',
					'#mailweb_widget table.widefat tr:last-child td,#planweb_next table.widefat tr:last-child td,#aw_team_dates table.widefat tr:last-child td,#aw_activity table.widefat tr:last-child td,#aw_form_entries table.widefat tr:last-child td,#aw_cron_health table.widefat tr:last-child td,#aw_seo_dashboard table.widefat tr:last-child td,#rankweb_dashboard table.widefat tr:last-child td,#aw_sourcing_dashboard table.widefat tr:last-child td,#directoryweb_dashboard table.widefat tr:last-child td{border-bottom:0}',
					'#mailweb_widget table.widefat.striped>tbody>:nth-child(odd),#planweb_next table.widefat.striped>tbody>:nth-child(odd),#aw_team_dates table.widefat.striped>tbody>:nth-child(odd),#aw_activity table.widefat.striped>tbody>:nth-child(odd),#aw_form_entries table.widefat.striped>tbody>:nth-child(odd),#aw_cron_health table.widefat.striped>tbody>:nth-child(odd),#aw_seo_dashboard table.widefat.striped>tbody>:nth-child(odd),#rankweb_dashboard table.widefat.striped>tbody>:nth-child(odd),#aw_sourcing_dashboard table.widefat.striped>tbody>:nth-child(odd),#directoryweb_dashboard table.widefat.striped>tbody>:nth-child(odd){background:transparent}',
					'#mailweb_widget details>summary,#planweb_next details>summary,#aw_team_dates details>summary,#aw_activity details>summary,#aw_form_entries details>summary,#aw_cron_health details>summary,#aw_seo_dashboard details>summary,#rankweb_dashboard details>summary,#aw_sourcing_dashboard details>summary,#directoryweb_dashboard details>summary{cursor:pointer;font-weight:600;color:#0a0a0a;margin:0 0 8px}',
					'#mailweb_widget .description,#planweb_next .description,#aw_team_dates .description,#aw_activity .description,#aw_form_entries .description,#aw_cron_health .description,#aw_seo_dashboard .description,#rankweb_dashboard .description,#aw_sourcing_dashboard .description,#directoryweb_dashboard .description{color:#6b6b6b}',
					'#mailweb_widget .button,#planweb_next .button,#aw_team_dates .button,#aw_activity .button,#aw_form_entries .button,#aw_cron_health .button,#aw_seo_dashboard .button,#rankweb_dashboard .button,#aw_sourcing_dashboard .button,#directoryweb_dashboard .button,#mailweb_widget .button-primary,#planweb_next .button-primary,#aw_team_dates .button-primary,#aw_activity .button-primary,#aw_form_entries .button-primary,#aw_cron_health .button-primary,#aw_seo_dashboard .button-primary,#rankweb_dashboard .button-primary,#aw_sourcing_dashboard .button-primary,#directoryweb_dashboard .button-primary{background:#0a0a0a;border-color:#0a0a0a;color:#fff;border-radius:8px;box-shadow:none}',
					'#mailweb_widget .button:hover,#planweb_next .button:hover,#aw_team_dates .button:hover,#aw_activity .button:hover,#aw_form_entries .button:hover,#aw_cron_health .button:hover,#aw_seo_dashboard .button:hover,#rankweb_dashboard .button:hover,#aw_sourcing_dashboard .button:hover,#directoryweb_dashboard .button:hover{background:#2b2b2b;border-color:#2b2b2b;color:#fff}',
				)
			)
		);
	}
);
