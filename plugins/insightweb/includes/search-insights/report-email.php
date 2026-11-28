<?php
/**
 * Search report by email: a short plain-text summary of the Dashboard's figures, weekly or monthly, to the site
 * administrator. Off until it is switched on in Settings. Nothing leaves the site except the email itself.
 *
 * - insightweb_report_on     1 when the owner switched it on (default off).
 * - insightweb_report_freq   'weekly' (Monday) or 'monthly' (the 1st).
 * - insightweb_report_brand  A line shown first in the email, for a site handed to a client (white label).
 * - insightweb_report_sent   The period last mailed, written only once wp_mail() said yes.
 *
 * The figures are the Dashboard's stored counts (INSIGHTWEB_DASH), so nothing is fetched here. A change is shown only
 * against a fully stored window before, as on the Dashboard.
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const INSIGHTWEB_REPORT_CRON = 'insightweb_report_cron';

/** The saved settings, with their defaults. */
function insightweb_report_settings(): array {
	$freq = (string) get_option( 'insightweb_report_freq', 'weekly' );
	return array(
		'on'    => (bool) get_option( 'insightweb_report_on', 0 ),
		'freq'  => 'monthly' === $freq ? 'monthly' : 'weekly',
		'brand' => (string) get_option( 'insightweb_report_brand', '' ),
	);
}

/**
 * The email for one stored range of the Dashboard. Pure: nothing is read or sent here.
 *
 * @param array  $r      A range from insightweb_dash_count() (days, clicks, impr, pos, pages, queries, prev*, stored, prevStored, topPages, topQueries).
 * @param string $site   Site name.
 * @param string $host   Site host.
 * @param string $brand  Optional first line (white label).
 * @param string $freq   'weekly' or 'monthly'.
 * @param string $url    Where the full figures are.
 * @return array|null subject and body, or null when no day is stored yet.
 */
function insightweb_report_build( array $r, string $site, string $host, string $brand, string $freq, string $url ): ?array {
	$n = (int) ( $r['days'] ?? 0 );
	if ( $n < 1 || empty( $r['stored'] ) ) {
		return null;
	}
	$full = (int) ( $r['prevStored'] ?? 0 ) >= $n;
	$num  = fn( $v ) => number_format_i18n( (int) $v );
	$ctr  = fn( $c, $i ) => $i > 0 ? round( $c / $i * 100, 1 ) : null;
	$now  = $ctr( (int) $r['clicks'], (int) $r['impr'] );
	$was  = $ctr( (int) ( $r['prevClicks'] ?? 0 ), (int) ( $r['prevImpr'] ?? 0 ) );
	$pos  = null === ( $r['pos'] ?? null ) ? null : (float) $r['pos'];
	$ppos = null === ( $r['prevPos'] ?? null ) ? null : (float) $r['prevPos'];
	$tail = fn( string $d ) => '' === $d ? '' : ' (' . $d . ')';

	$lines   = array();
	$lines[] = '' !== trim( $brand ) ? trim( $brand ) : '';
	/* translators: 1: number of days, 2: site host. */
	$lines[] = sprintf( __( 'Search Console, the last %1$d days, for %2$s', 'insightweb' ), $n, $host );
	$lines[] = '';
	$lines[] = __( 'Clicks', 'insightweb' ) . ': ' . $num( $r['clicks'] ) . $tail( $full ? insightweb_delta( (int) $r['clicks'], (int) $r['prevClicks'], $n ) : '' );
	$lines[] = __( 'Impressions', 'insightweb' ) . ': ' . $num( $r['impr'] ) . $tail( $full ? insightweb_delta( (int) $r['impr'], (int) $r['prevImpr'], $n ) : '' );
	$lines[] = __( 'Click rate', 'insightweb' ) . ': ' . ( null === $now ? '–' : number_format_i18n( $now, 1 ) . '%' ) . $tail( $full ? insightweb_delta( $now, $was, $n, 'points' ) : '' );
	$lines[] = __( 'Average position', 'insightweb' ) . ': ' . ( null === $pos ? '–' : number_format_i18n( $pos, 1 ) ) . $tail( $full ? insightweb_delta( $pos, $ppos, $n, 'diff' ) : '' );
	$lines[] = __( 'Pages in search', 'insightweb' ) . ': ' . $num( $r['pages'] ?? 0 );
	$lines[] = __( 'Searches', 'insightweb' ) . ': ' . $num( $r['queries'] ?? 0 );
	foreach ( array(
		__( 'Top pages', 'insightweb' )    => (array) ( $r['topPages'] ?? array() ),
		__( 'Top searches', 'insightweb' ) => (array) ( $r['topQueries'] ?? array() ),
	) as $label => $rows ) {
		$rows = array_slice( $rows, 0, 5 );
		if ( ! $rows ) {
			continue;
		}
		$lines[] = '';
		$lines[] = $label . ':';
		foreach ( $rows as $x ) {
			/* translators: 1: page or search, 2: clicks. */
			$lines[] = '- ' . sprintf( __( '%1$s: %2$s clicks', 'insightweb' ), (string) $x[0], $num( $x[1] ) );
		}
	}
	$lines[] = '';
	$lines[] = __( 'All figures', 'insightweb' ) . ': ' . $url;
	$lines[] = __( 'You get this because it was switched on in Search Insights, Settings. Switch it off there.', 'insightweb' );

	$what = 'monthly' === $freq ? __( 'monthly search report', 'insightweb' ) : __( 'weekly search report', 'insightweb' );
	return array(
		'subject' => $site . ': ' . $what,
		'body'    => ltrim( implode( "\n", $lines ), "\n" ) . "\n",
	);
}

/** The period a mail covers, so a repeat run in the same period sends nothing. */
function insightweb_report_period( string $freq, int $now ): string {
	return 'monthly' === $freq ? gmdate( 'Y-m', $now ) : gmdate( 'o-\WW', $now );
}

/**
 * Send the report when it is on, not sent for this period yet and there is something to say.
 *
 * @param bool $force Send now whatever the period says (the Send now button).
 * @return string 'sent', 'off', 'already', 'nodata' or 'failed'.
 */
function insightweb_report_run( bool $force = false ): string {
	$s = insightweb_report_settings();
	if ( ! $force && ( ! $s['on'] || get_option( 'aw_si_off' ) ) ) {
		return 'off';
	}
	$period = insightweb_report_period( $s['freq'], time() );
	if ( ! $force && get_option( 'insightweb_report_sent' ) === $period ) {
		return 'already';
	}
	$c    = get_transient( INSIGHTWEB_DASH );
	$days = 'monthly' === $s['freq'] ? 28 : 7;
	$r    = is_array( $c ) && isset( $c['ranges'][ $days ] ) ? (array) $c['ranges'][ $days ] : array();
	$mail = insightweb_report_build( $r, (string) get_bloginfo( 'name' ), (string) wp_parse_url( home_url(), PHP_URL_HOST ), $s['brand'], $s['freq'], insightweb_si_url() );
	if ( null === $mail ) {
		return 'nodata';
	}
	if ( ! wp_mail( get_option( 'admin_email' ), $mail['subject'], $mail['body'] ) ) {
		return 'failed'; // Not recorded, so the next run tries again.
	}
	update_option( 'insightweb_report_sent', $period, false );
	return 'sent';
}

add_action( INSIGHTWEB_REPORT_CRON, fn() => insightweb_report_run() );

// Every Monday 08:55 (after the daily import at 07:10 and the crawler check at 08:45); a monthly report is sent on the
// first Monday, which insightweb_report_period() keeps to one a month.
add_action(
	'init',
	function () {
		if ( ! get_option( 'aw_si_off' ) && insightweb_report_settings()['on'] && ! wp_next_scheduled( INSIGHTWEB_REPORT_CRON ) ) {
			wp_schedule_event( ( new DateTimeImmutable( 'next monday 08:55', wp_timezone() ) )->getTimestamp(), 'weekly', INSIGHTWEB_REPORT_CRON );
		}
	}
);

add_filter( 'insightweb_si_cron_hooks', fn( $h ) => array_merge( (array) $h, array( INSIGHTWEB_REPORT_CRON ) ) );

/** The form on Settings → Runs and data. */
add_action(
	'insightweb_si_settings_rows',
	function () {
		$s = insightweb_report_settings();
		echo '<tr><th scope="row">' . esc_html__( 'Search report by email', 'insightweb' ) . '</th><td>';
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="insightweb_report_save">';
		wp_nonce_field( 'insightweb_report_save' );
		echo '<p><label><input type="checkbox" name="on" value="1"' . checked( $s['on'], true, false ) . '> ' . esc_html__( 'Email the Search Console figures to the site administrator', 'insightweb' ) . '</label></p>';
		echo '<p><label for="insightweb-report-freq">' . esc_html__( 'How often', 'insightweb' ) . '</label> <select id="insightweb-report-freq" name="freq"><option value="weekly"' . selected( $s['freq'], 'weekly', false ) . '>' . esc_html__( 'Every Monday', 'insightweb' ) . '</option><option value="monthly"' . selected( $s['freq'], 'monthly', false ) . '>' . esc_html__( 'First Monday of the month', 'insightweb' ) . '</option></select></p>';
		echo '<p><label for="insightweb-report-brand">' . esc_html__( 'First line of the email (optional)', 'insightweb' ) . '</label><br><input type="text" id="insightweb-report-brand" name="brand" class="regular-text" maxlength="120" value="' . esc_attr( $s['brand'] ) . '"></p>';
		submit_button( __( 'Save', 'insightweb' ), 'secondary', 'submit', false );
		echo ' ';
		submit_button( __( 'Send now', 'insightweb' ), 'secondary', 'send', false );
		echo '<p class="description">' . esc_html__( 'Off by default. Goes to the address under Settings, General. It says the same as the Dashboard: clicks, impressions, click rate, position and the top pages and searches, against the days before.', 'insightweb' ) . '</p>';
		echo '</form></td></tr>';
	},
	15
);

add_action(
	'admin_post_insightweb_report_save',
	function () {
		if ( ! current_user_can( insightweb_si_cap() ) || ! check_admin_referer( 'insightweb_report_save' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'insightweb' ), 403 );
		}
		update_option( 'insightweb_report_on', isset( $_POST['on'] ) ? 1 : 0, false );
		$freq = isset( $_POST['freq'] ) ? sanitize_key( wp_unslash( $_POST['freq'] ) ) : 'weekly';
		update_option( 'insightweb_report_freq', 'monthly' === $freq ? 'monthly' : 'weekly', false );
		update_option( 'insightweb_report_brand', isset( $_POST['brand'] ) ? mb_substr( sanitize_text_field( wp_unslash( $_POST['brand'] ) ), 0, 120 ) : '', false );
		$result = isset( $_POST['send'] ) ? insightweb_report_run( true ) : 'saved';
		wp_safe_redirect( add_query_arg( 'report', $result, insightweb_si_return_url( 'settings' ) ) );
		exit;
	}
);

add_action(
	'insightweb_si_settings_notices',
	function () {
		$r = isset( $_GET['report'] ) ? sanitize_key( wp_unslash( $_GET['report'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- message only.
		$m = array(
			'saved'  => array( 'success', __( 'Report settings saved.', 'insightweb' ) ),
			'sent'   => array( 'success', __( 'Report sent to the site administrator.', 'insightweb' ) ),
			'nodata' => array( 'warning', __( 'Nothing to send yet: no Search Console day is stored.', 'insightweb' ) ),
			'failed' => array( 'error', __( 'The email could not be sent. Check the site\'s email setup.', 'insightweb' ) ),
		);
		if ( isset( $m[ $r ] ) ) {
			wp_admin_notice( esc_html( $m[ $r ][1] ), array( 'type' => $m[ $r ][0], 'additional_classes' => array( 'inline' ) ) );
		}
	}
);
