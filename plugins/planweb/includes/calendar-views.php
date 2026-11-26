<?php
/**
 * PlanWeb editorial calendar views (monthly, weekly), drag-and-drop reschedule AJAX/REST,
 * lightweight CSS campaign timeline visualization, and author/category/campaign-tag filters.
 *
 * @package planweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Filters calendar entries by author, category, campaign tag, type, or status.
 *
 * @param array<int, array<string, mixed>> $entries Calendar entry rows.
 * @param array<string, mixed>             $filters Filter criteria (author, category, tag, type, status).
 * @return array<int, array<string, mixed>>
 */
function planweb_calendar_filter_entries( array $entries, array $filters ): array {
	$author   = trim( (string) ( $filters['author'] ?? '' ) );
	$category = trim( (string) ( $filters['category'] ?? '' ) );
	$tag      = trim( (string) ( $filters['tag'] ?? '' ) );
	$type     = trim( (string) ( $filters['type'] ?? '' ) );
	$status   = trim( (string) ( $filters['status'] ?? '' ) );

	return array_values(
		array_filter(
			$entries,
			function ( $entry ) use ( $author, $category, $tag, $type, $status ) {
				if ( ! is_array( $entry ) ) {
					return false;
				}
				if ( '' !== $author && (string) ( $entry['author'] ?? $entry['owner'] ?? '' ) !== $author ) {
					return false;
				}
				if ( '' !== $category ) {
					$cats = (array) ( $entry['categories'] ?? ( isset( $entry['category'] ) ? array( $entry['category'] ) : array() ) );
					if ( ! in_array( $category, array_map( 'strval', $cats ), true ) ) {
						return false;
					}
				}
				if ( '' !== $tag ) {
					$tags = (array) ( $entry['tags'] ?? ( isset( $entry['campaign_tag'] ) ? array( $entry['campaign_tag'] ) : array() ) );
					if ( ! in_array( $tag, array_map( 'strval', $tags ), true ) ) {
						return false;
					}
				}
				if ( '' !== $type && (string) ( $entry['type'] ?? '' ) !== $type ) {
					return false;
				}
				if ( '' !== $status && (string) ( $entry['status'] ?? '' ) !== $status ) {
					return false;
				}
				return true;
			}
		)
	);
}

/**
 * Groups filtered entries by Y-m-d date.
 *
 * @param array<int, array<string, mixed>> $entries Entry rows.
 * @return array<string, array<int, array<string, mixed>>>
 */
function planweb_calendar_group_by_date( array $entries ): array {
	$by_date = array();
	foreach ( $entries as $entry ) {
		$d = (string) ( $entry['date'] ?? '' );
		if ( ! function_exists( 'planweb_is_date' ) || planweb_is_date( $d ) ) {
			$by_date[ $d ][] = $entry;
		}
	}
	return $by_date;
}

/**
 * Builds a monthly calendar grid (list of 7-day weeks, Sunday–Saturday) with slotted entries.
 *
 * @param int                              $year    Four-digit year.
 * @param int                              $month   Month 1–12.
 * @param array<int, array<string, mixed>> $entries Entry rows.
 * @param array<string, mixed>             $filters Optional filters.
 * @return array{year: int, month: int, weeks: array<int, array<int, array<string, mixed>>>}
 */
function planweb_calendar_month_grid( int $year, int $month, array $entries, array $filters = array() ): array {
	$month   = max( 1, min( 12, $month ) );
	$filtered = planweb_calendar_filter_entries( $entries, $filters );
	$by_date  = planweb_calendar_group_by_date( $filtered );

	$first_ts   = gmmktime( 0, 0, 0, $month, 1, $year );
	$days_in_mo = (int) gmdate( 't', $first_ts );
	$start_dow  = (int) gmdate( 'w', $first_ts ); // 0 = Sun .. 6 = Sat

	$weeks = array();
	$week  = array();
	for ( $i = 0; $i < $start_dow; $i++ ) {
		$week[] = array( 'date' => '', 'in_month' => false, 'entries' => array() );
	}
	for ( $day = 1; $day <= $days_in_mo; $day++ ) {
		$ymd    = sprintf( '%04d-%02d-%02d', $year, $month, $day );
		$week[] = array(
			'date'     => $ymd,
			'day'      => $day,
			'in_month' => true,
			'entries'  => $by_date[ $ymd ] ?? array(),
		);
		if ( 7 === count( $week ) ) {
			$weeks[] = $week;
			$week    = array();
		}
	}
	if ( ! empty( $week ) ) {
		while ( count( $week ) < 7 ) {
			$week[] = array( 'date' => '', 'in_month' => false, 'entries' => array() );
		}
		$weeks[] = $week;
	}

	return array(
		'year'  => $year,
		'month' => $month,
		'weeks' => $weeks,
	);
}

/**
 * Builds a 7-day weekly calendar view starting from $start_ymd.
 *
 * @param string                           $start_ymd Start date (Y-m-d).
 * @param array<int, array<string, mixed>> $entries   Entry rows.
 * @param array<string, mixed>             $filters   Optional filters.
 * @return array{start: string, days: array<int, array<string, mixed>>}
 */
function planweb_calendar_week_grid( string $start_ymd, array $entries, array $filters = array() ): array {
	$ts = strtotime( $start_ymd . ' 00:00:00 UTC' );
	if ( false === $ts ) {
		$ts        = gmmktime( 0, 0, 0 );
		$start_ymd = gmdate( 'Y-m-d', $ts );
	}
	$filtered = planweb_calendar_filter_entries( $entries, $filters );
	$by_date  = planweb_calendar_group_by_date( $filtered );

	$days = array();
	for ( $i = 0; $i < 7; $i++ ) {
		$ymd    = gmdate( 'Y-m-d', $ts + ( $i * 86400 ) );
		$days[] = array(
			'date'    => $ymd,
			'label'   => gmdate( 'D j M', $ts + ( $i * 86400 ) ),
			'entries' => $by_date[ $ymd ] ?? array(),
		);
	}
	return array(
		'start' => $start_ymd,
		'days'  => $days,
	);
}

/**
 * Computes percentage-based campaign timeline bars without any third-party Gantt library.
 *
 * @param array<int, array<string, mixed>> $entries Entry rows (date, optional end_date, title, status, campaign_tag).
 * @param array<string, mixed>             $filters Optional filters.
 * @return array{min_date: string, max_date: string, span_days: int, bars: array<int, array<string, mixed>>}
 */
function planweb_campaign_timeline_data( array $entries, array $filters = array() ): array {
	$filtered = planweb_calendar_filter_entries( $entries, $filters );
	$ranges   = array();
	$min_ts   = null;
	$max_ts   = null;

	foreach ( $filtered as $entry ) {
		$start = (string) ( $entry['date'] ?? '' );
		$end   = (string) ( $entry['end_date'] ?? $start );
		$s_ts  = strtotime( $start . ' 00:00:00 UTC' );
		$e_ts  = strtotime( $end . ' 00:00:00 UTC' );
		if ( false === $s_ts ) {
			continue;
		}
		if ( false === $e_ts || $e_ts < $s_ts ) {
			$e_ts = $s_ts;
			$end  = $start;
		}
		$min_ts   = null === $min_ts ? $s_ts : min( $min_ts, $s_ts );
		$max_ts   = null === $max_ts ? $e_ts : max( $max_ts, $e_ts );
		$ranges[] = array(
			'id'     => (int) ( $entry['id'] ?? 0 ),
			'title'  => (string) ( $entry['title'] ?? '' ),
			'start'  => $start,
			'end'    => $end,
			's_ts'   => $s_ts,
			'e_ts'   => $e_ts,
			'status' => (string) ( $entry['status'] ?? 'idea' ),
			'tag'    => (string) ( $entry['campaign_tag'] ?? '' ),
		);
	}

	if ( empty( $ranges ) || null === $min_ts || null === $max_ts ) {
		return array( 'min_date' => '', 'max_date' => '', 'span_days' => 0, 'bars' => array() );
	}

	$span_days = max( 1, (int) round( ( $max_ts - $min_ts ) / 86400 ) + 1 );
	$bars      = array();
	foreach ( $ranges as $r ) {
		$offset_days = (int) round( ( $r['s_ts'] - $min_ts ) / 86400 );
		$dur_days    = max( 1, (int) round( ( $r['e_ts'] - $r['s_ts'] ) / 86400 ) + 1 );
		$bars[]      = array(
			'id'        => $r['id'],
			'title'     => $r['title'],
			'start'     => $r['start'],
			'end'       => $r['end'],
			'status'    => $r['status'],
			'tag'       => $r['tag'],
			'left_pct'  => round( ( $offset_days / $span_days ) * 100, 2 ),
			'width_pct' => round( ( $dur_days / $span_days ) * 100, 2 ),
		);
	}

	return array(
		'min_date'  => gmdate( 'Y-m-d', $min_ts ),
		'max_date'  => gmdate( 'Y-m-d', $max_ts ),
		'span_days' => $span_days,
		'bars'      => $bars,
	);
}

/**
 * Renders a zero-dependency HTML/CSS campaign timeline visualization.
 *
 * @param array<int, array<string, mixed>> $entries Entry rows.
 * @param array<string, mixed>             $filters Optional filters.
 * @return string HTML markup.
 */
function planweb_render_campaign_timeline( array $entries, array $filters = array() ): string {
	$data = planweb_campaign_timeline_data( $entries, $filters );
	if ( empty( $data['bars'] ) ) {
		return '<p class="planweb-timeline-empty">No scheduled entries match the selected filters.</p>';
	}
	$esc  = function_exists( 'esc_html' ) ? 'esc_html' : fn( $s ) => htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' );
	$attr = function_exists( 'esc_attr' ) ? 'esc_attr' : fn( $s ) => htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' );

	$html  = '<div class="planweb-timeline" data-min="' . $attr( $data['min_date'] ) . '" data-max="' . $attr( $data['max_date'] ) . '">';
	$html .= '<div class="planweb-timeline-axis"><span>' . $esc( $data['min_date'] ) . '</span><span>' . $esc( $data['max_date'] ) . '</span></div>';
	foreach ( $data['bars'] as $bar ) {
		$style = 'margin-left:' . $bar['left_pct'] . '%;width:' . max( 4, $bar['width_pct'] ) . '%;';
		$html .= '<div class="planweb-timeline-row">';
		$html .= '<span class="planweb-timeline-label">' . $esc( $bar['title'] ) . '</span>';
		$html .= '<div class="planweb-timeline-track"><div class="planweb-timeline-bar is-' . $attr( $bar['status'] ) . '" style="' . $attr( $style ) . '" title="' . $attr( $bar['start'] . ' – ' . $bar['end'] ) . '">' . $esc( $bar['start'] ) . '</div></div>';
		$html .= '</div>';
	}
	$html .= '</div>';
	return $html;
}

if ( function_exists( 'add_action' ) ) {
	/**
	 * Nonce-verified AJAX handler for drag-and-drop calendar schedule adjustment.
	 */
	add_action(
		'wp_ajax_planweb_reschedule_entry',
		function () {
			check_ajax_referer( 'planweb_calendar_reschedule', 'nonce' );
			$post_id = isset( $_POST['entry_id'] ) ? (int) $_POST['entry_id'] : 0;
			$date    = isset( $_POST['date'] ) ? sanitize_text_field( wp_unslash( $_POST['date'] ) ) : '';
			$time    = isset( $_POST['time'] ) ? sanitize_text_field( wp_unslash( $_POST['time'] ) ) : '';

			// Only a PlanWeb entry can be moved: without this a user could write a date onto any post they can edit.
			if ( $post_id <= 0 || PLANWEB_TYPE !== get_post_type( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
				wp_send_json_error( array( 'message' => __( 'Permission denied.', 'planweb' ) ), 403 );
			}
			if ( ! planweb_is_date( $date ) || ! planweb_is_time( $time ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid date or time.', 'planweb' ) ), 400 );
			}

			update_post_meta( $post_id, 'planweb_date', $date );
			if ( '' !== $time ) {
				update_post_meta( $post_id, 'planweb_time', $time );
			}
			if ( function_exists( 'planweb_counts_invalidate' ) ) {
				planweb_counts_invalidate();
			}
			wp_send_json_success( array( 'id' => $post_id, 'date' => $date, 'time' => $time ) );
		}
	);
}
