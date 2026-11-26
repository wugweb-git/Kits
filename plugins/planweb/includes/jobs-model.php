<?php
/**
 * PlanWeb's scheduled jobs: the rules that need no WordPress. Which entries are overdue, which repeat and on what date,
 * who gets a reminder and what the emails say, how a setting is cleaned, and when a job runs next. includes/jobs.php
 * wires these to WP-Cron and wp_mail(); tests/run.php covers this file (it needs model.php and ui-model.php loaded).
 *
 * Every job and every email is off until the owner switches it on in PlanWeb Settings. Email goes only to site users,
 * through the site's own wp_mail(); nothing is posted to any social network.
 *
 * @package planweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Most entries one repeat run may create. */
const PLANWEB_REPEAT_CAP = 50;

/** Reminder window in days: the lowest and highest the setting takes. */
const PLANWEB_REMINDER_DAYS_MIN = 1;
const PLANWEB_REMINDER_DAYS_MAX = 14;

/** Longest first line of the digest. */
const PLANWEB_DIGEST_BRAND_MAX = 120;

/**
 * The four jobs. option: the setting that switches it on. time: site time (H:i). recurrence: a WordPress schedule.
 * weekday: 1 (Monday) to 7, or 0 for every day.
 */
const PLANWEB_JOBS = array(
	'overdue'   => array(
		'hook'       => 'planweb_job_overdue',
		'option'     => 'planweb_jobs_overdue',
		'time'       => '06:00',
		'recurrence' => 'daily',
		'weekday'    => 0,
	),
	'repeats'   => array(
		'hook'       => 'planweb_job_repeats',
		'option'     => 'planweb_jobs_repeats',
		'time'       => '06:15',
		'recurrence' => 'daily',
		'weekday'    => 0,
	),
	'reminders' => array(
		'hook'       => 'planweb_job_reminders',
		'option'     => 'planweb_reminders_on',
		'time'       => '08:00',
		'recurrence' => 'daily',
		'weekday'    => 0,
	),
	'digest'    => array(
		'hook'       => 'planweb_job_digest',
		'option'     => 'planweb_digest_on',
		'time'       => '08:30',
		'recurrence' => 'weekly',
		'weekday'    => 1,
	),
);

/**
 * A switch setting as stored: 1 or 0. Anything that is not clearly on or off is refused.
 *
 * @param mixed $v Value.
 * @return int|null 1, 0, or null when the value is not a switch.
 */
function planweb_jobs_clean_flag( $v ): ?int {
	if ( true === $v || 1 === $v || '1' === $v || 'on' === $v || 'true' === $v ) {
		return 1;
	}
	if ( false === $v || 0 === $v || '0' === $v || '' === $v || 'off' === $v || 'false' === $v || null === $v ) {
		return 0;
	}
	return null;
}

/**
 * The reminder window in days: a whole number from 1 to 14.
 *
 * @param mixed $v Value.
 * @return int|null The days, or null when out of range or not a whole number.
 */
function planweb_jobs_clean_days( $v ): ?int {
	if ( is_string( $v ) ) {
		$v = trim( $v );
		if ( 1 !== preg_match( '/^\d{1,3}$/', $v ) ) {
			return null;
		}
		$v = (int) $v;
	}
	if ( ! is_int( $v ) || $v < PLANWEB_REMINDER_DAYS_MIN || $v > PLANWEB_REMINDER_DAYS_MAX ) {
		return null;
	}
	return $v;
}

/**
 * The digest's first line: one line of plain text, tags removed, at most 120 characters.
 *
 * @param mixed $v Value.
 * @return string|null The line ('' for none), or null when it is not text or is too long.
 */
function planweb_jobs_clean_brand( $v ): ?string {
	if ( null === $v ) {
		return '';
	}
	if ( ! is_string( $v ) ) {
		return null;
	}
	$v = trim( (string) preg_replace( '/\s+/u', ' ', strip_tags( $v ) ) );
	if ( 1 === preg_match( '/[\x00-\x1F\x7F]/', $v ) || mb_strlen( $v ) > PLANWEB_DIGEST_BRAND_MAX ) {
		return null;
	}
	return $v;
}

/**
 * A repeat rule from a form or request.
 *
 * @param mixed $v Value.
 * @return string|null none, weekly or monthly; '' counts as none; null for anything else.
 */
function planweb_repeat_clean( $v ): ?string {
	if ( null === $v || '' === $v ) {
		return 'none';
	}
	return is_string( $v ) && isset( PLANWEB_REPEATS[ $v ] ) ? $v : null;
}

/**
 * The date of the next occurrence of a repeating entry. Weekly adds 7 days; monthly adds one month and stops at the
 * month's last day (31 Jan becomes 28 or 29 Feb). With $today, it steps on until the date is not in the past, always
 * counted from the first date, so a monthly entry on the 31st returns to the 31st.
 *
 * @param string $ymd   The entry's date (Y-m-d).
 * @param string $rule  weekly or monthly.
 * @param string $today Y-m-d, or '' for exactly one step.
 * @return string Y-m-d, or '' when the date or the rule is not usable.
 */
function planweb_repeat_next( string $ymd, string $rule, string $today = '' ): string {
	if ( ! planweb_is_date( $ymd ) || ! in_array( $rule, array( 'weekly', 'monthly' ), true ) ) {
		return '';
	}
	[ $y, $m, $d ] = array_map( 'intval', explode( '-', $ymd ) );
	for ( $n = 1; $n <= 1200; $n++ ) {
		if ( 'weekly' === $rule ) {
			$next = gmdate( 'Y-m-d', (int) gmmktime( 12, 0, 0, $m, $d + 7 * $n, $y ) );
		} else {
			$index = $y * 12 + ( $m - 1 ) + $n;
			$ny    = intdiv( $index, 12 );
			$nm    = $index % 12 + 1;
			$last  = (int) gmdate( 't', (int) gmmktime( 12, 0, 0, $nm, 1, $ny ) );
			$next  = sprintf( '%04d-%02d-%02d', $ny, $nm, min( $d, $last ) );
		}
		if ( '' === $today || $next >= $today ) {
			return $next;
		}
	}
	return '';
}

/**
 * Which entries the overdue sweep flags and which it lets go. Overdue means the date is before today and the status
 * is still open. Today is never overdue. Nothing here changes a date or deletes anything.
 *
 * @param array[] $entries planweb_entry() arrays (id, date, status, flag).
 * @param string  $today   Y-m-d.
 * @return array{set: int[], clear: int[]} Entry IDs to flag, and flagged IDs that are no longer overdue.
 */
function planweb_overdue_plan( array $entries, string $today ): array {
	$out = array(
		'set'   => array(),
		'clear' => array(),
	);
	foreach ( $entries as $e ) {
		$date    = (string) ( $e['date'] ?? '' );
		$open    = in_array( (string) ( $e['status'] ?? 'idea' ), PLANWEB_OPEN_STATUSES, true );
		$late    = planweb_is_date( $date ) && $date < $today && $open;
		$flagged = 'overdue' === (string) ( $e['flag'] ?? '' );
		if ( $late && ! $flagged ) {
			$out['set'][] = (int) $e['id'];
		} elseif ( ! $late && $flagged ) {
			$out['clear'][] = (int) $e['id'];
		}
	}
	return $out;
}

/**
 * The entries that should get a next occurrence. One per source entry, none that already repeated, none whose rule is
 * none, none dated today or later, none whose next date is past its "repeat until". The caller creates at most
 * PLANWEB_REPEAT_CAP of them and may skip any (the planweb_repeat_entry filter).
 *
 * @param array[] $entries planweb_entry() arrays with repeat, repeat_until and repeated_to.
 * @param string  $today   Y-m-d.
 * @return array[] Each: source (the entry), fields (what planweb_save_entry() takes for the new one).
 */
function planweb_repeat_plan( array $entries, string $today ): array {
	$out = array();
	foreach ( $entries as $e ) {
		$rule = (string) ( $e['repeat'] ?? 'none' );
		$date = (string) ( $e['date'] ?? '' );
		if ( ! in_array( $rule, array( 'weekly', 'monthly' ), true ) || '' !== (string) ( $e['repeated_to'] ?? '' ) || ! planweb_is_date( $date ) || $date >= $today ) {
			continue;
		}
		$next  = planweb_repeat_next( $date, $rule, $today );
		$until = (string) ( $e['repeat_until'] ?? '' );
		if ( '' === $next || ( planweb_is_date( $until ) && $next > $until ) ) {
			continue;
		}
		$out[] = array(
			'source' => $e,
			'fields' => array(
				'title'        => (string) $e['title'],
				'note'         => '',
				'date'         => $next,
				'time'         => (string) ( $e['time'] ?? '' ),
				'type'         => (string) ( $e['type'] ?? 'reminder' ),
				'channels'     => array_values( (array) ( $e['channels'] ?? array() ) ),
				'owner'        => (string) ( $e['owner'] ?? '' ),
				'status'       => 'idea', // The first open status.
				'link'         => '',
				'repeat'       => $rule,
				'repeat_until' => planweb_is_date( $until ) ? $until : '',
			),
		);
	}
	return $out;
}

/**
 * The key that says a reminder for this entry and date was sent.
 *
 * @param int    $id   Entry.
 * @param string $date Its date (Y-m-d).
 */
function planweb_reminder_key( int $id, string $date ): string {
	return $id . '|' . $date;
}

/**
 * Reminders grouped per user: entries dated today or within the next N days, not finished, not reminded already. The
 * person is the entry's owner as a WordPress user (its author). An entry with no valid user is left out: it is never
 * sent to an address from anywhere else.
 *
 * @param array[] $entries planweb_entry() arrays plus author (user ID).
 * @param string  $today   Y-m-d.
 * @param int     $days    Window, 1 to 14.
 * @param array   $users   User ID => array( email, name ): only users that exist.
 * @param array   $sent    Dedupe: reminder key => Y-m-d sent.
 * @return array[] One per user: user, email, name, entries (by date and time), keys.
 */
function planweb_reminder_groups( array $entries, string $today, int $days, array $users, array $sent ): array {
	$end    = planweb_add_days( $today, $days );
	$groups = array();
	foreach ( $entries as $e ) {
		$date = (string) ( $e['date'] ?? '' );
		$uid  = (int) ( $e['author'] ?? 0 );
		$user = $users[ $uid ] ?? null;
		if ( ! planweb_is_date( $date ) || $date < $today || $date > $end || ! in_array( (string) ( $e['status'] ?? 'idea' ), PLANWEB_OPEN_STATUSES, true ) ) {
			continue;
		}
		if ( ! is_array( $user ) || false === filter_var( (string) ( $user['email'] ?? '' ), FILTER_VALIDATE_EMAIL ) ) {
			continue;
		}
		$key = planweb_reminder_key( (int) $e['id'], $date );
		if ( isset( $sent[ $key ] ) ) {
			continue;
		}
		if ( ! isset( $groups[ $uid ] ) ) {
			$groups[ $uid ] = array(
				'user'    => $uid,
				'email'   => (string) $user['email'],
				'name'    => (string) ( $user['name'] ?? '' ),
				'entries' => array(),
				'keys'    => array(),
			);
		}
		$groups[ $uid ]['entries'][] = $e;
		$groups[ $uid ]['keys'][]    = $key;
	}
	foreach ( $groups as &$g ) {
		usort( $g['entries'], fn( $a, $b ) => strcmp( $a['date'] . ' ' . ( '' === ( $a['time'] ?? '' ) ? '99:99' : $a['time'] ) . ' ' . $a['title'], $b['date'] . ' ' . ( '' === ( $b['time'] ?? '' ) ? '99:99' : $b['time'] ) . ' ' . $b['title'] ) );
	}
	unset( $g );
	ksort( $groups );
	return array_values( $groups );
}

/**
 * A date in words, j M Y.
 *
 * @param string $ymd Y-m-d.
 */
function planweb_jobs_date_label( string $ymd ): string {
	$t = strtotime( $ymd . ' 12:00:00 UTC' );
	return false === $t ? $ymd : gmdate( 'j M Y', $t );
}

/**
 * One entry as a line of the email: date, time, title and status, in plain text.
 *
 * @param array  $e     planweb_entry() array.
 * @param string $today Y-m-d, to say "today" and "overdue".
 */
function planweb_jobs_line( array $e, string $today ): string {
	$title  = trim( (string) preg_replace( '/\s+/u', ' ', strip_tags( (string) ( $e['title'] ?? '' ) ) ) );
	$status = PLANWEB_STATUSES[ $e['status'] ?? '' ] ?? (string) ( $e['status'] ?? '' );
	$date   = planweb_jobs_date_label( (string) $e['date'] );
	$when   = $e['date'] === $today ? __( 'today', 'planweb' ) : $date;
	return '- ' . $when . ( '' !== (string) ( $e['time'] ?? '' ) ? ' ' . $e['time'] : '' ) . ': ' . $title . ' (' . $status . ')';
}

/**
 * The reminder email for one user's group. Plain text.
 *
 * @param array  $g     A planweb_reminder_groups() group.
 * @param string $site  Site name.
 * @param string $url   Where the calendar is.
 * @param int    $days  The window.
 * @param string $today Y-m-d.
 * @return array kind, to, subject, body.
 */
function planweb_reminder_build( array $g, string $site, string $url, int $days, string $today ): array {
	$lines = array();
	if ( '' !== trim( $g['name'] ) ) {
		/* translators: %s: the person's name. */
		$lines[] = sprintf( __( 'Hello %s,', 'planweb' ), trim( $g['name'] ) );
		$lines[] = '';
	}
	$lines[] = 1 === $days
		? __( 'These calendar entries are due today or tomorrow and are not finished yet:', 'planweb' )
		/* translators: %d: number of days. */
		: sprintf( __( 'These calendar entries are due within the next %d days and are not finished yet:', 'planweb' ), $days );
	$lines[] = '';
	foreach ( $g['entries'] as $e ) {
		$lines[] = planweb_jobs_line( $e, $today );
	}
	$lines[] = '';
	$lines[] = __( 'The calendar', 'planweb' ) . ': ' . $url;
	$lines[] = __( 'You get this because the site administrator switched on reminders in PlanWeb, Settings. It goes only to the person who owns the entry.', 'planweb' );
	return array(
		'kind'    => 'reminder',
		'to'      => $g['email'],
		/* translators: 1: site name, 2: number of entries. */
		'subject' => sprintf( _n( '%1$s: %2$d calendar entry coming up', '%1$s: %2$d calendar entries coming up', count( $g['entries'] ), 'planweb' ), $site, count( $g['entries'] ) ),
		'body'    => implode( "\n", $lines ) . "\n",
	);
}

/**
 * The weekly digest: the next 7 days (today and the six after) and what is overdue, to the site administrator.
 *
 * @param array[] $entries planweb_entry() arrays.
 * @param string  $today   Y-m-d.
 * @param string  $site    Site name.
 * @param string  $to      The administrator's address.
 * @param string  $brand   Optional first line (white label).
 * @param string  $url     Where the calendar is.
 * @return array|null kind, to, subject, body; null when there is nothing to say.
 */
function planweb_digest_build( array $entries, string $today, string $site, string $to, string $brand, string $url ): ?array {
	$end  = planweb_add_days( $today, 6 );
	$next = array();
	$late = array();
	foreach ( $entries as $e ) {
		$date = (string) ( $e['date'] ?? '' );
		if ( ! planweb_is_date( $date ) ) {
			continue;
		}
		if ( planweb_is_overdue( $e, $today ) ) {
			$late[] = $e;
		} elseif ( $date >= $today && $date <= $end && ! in_array( (string) ( $e['status'] ?? 'idea' ), array( 'done', 'sent' ), true ) ) {
			$next[] = $e;
		}
	}
	if ( ! $next && ! $late ) {
		return null;
	}
	$by_date = fn( $a, $b ) => strcmp( $a['date'] . ' ' . ( '' === ( $a['time'] ?? '' ) ? '99:99' : $a['time'] ) . ' ' . $a['title'], $b['date'] . ' ' . ( '' === ( $b['time'] ?? '' ) ? '99:99' : $b['time'] ) . ' ' . $b['title'] );
	usort( $next, $by_date );
	usort( $late, $by_date );
	$lines = array();
	if ( '' !== trim( $brand ) ) {
		$lines[] = trim( $brand );
		$lines[] = '';
	}
	/* translators: %s: site name. */
	$lines[] = sprintf( __( 'The week ahead on %s', 'planweb' ), $site );
	$lines[] = '';
	$lines[] = __( 'Next 7 days', 'planweb' ) . ':';
	if ( $next ) {
		foreach ( $next as $e ) {
			$lines[] = planweb_jobs_line( $e, $today );
		}
	} else {
		$lines[] = __( 'Nothing planned.', 'planweb' );
	}
	$lines[] = '';
	$lines[] = __( 'Overdue (past their date and not finished)', 'planweb' ) . ':';
	if ( $late ) {
		foreach ( $late as $e ) {
			$lines[] = '- ' . planweb_jobs_date_label( $e['date'] ) . ': ' . trim( (string) preg_replace( '/\s+/u', ' ', strip_tags( (string) $e['title'] ) ) ) . ' (' . ( PLANWEB_STATUSES[ $e['status'] ?? '' ] ?? (string) ( $e['status'] ?? '' ) ) . ')';
		}
	} else {
		$lines[] = __( 'Nothing overdue.', 'planweb' );
	}
	$lines[] = '';
	$lines[] = __( 'The calendar', 'planweb' ) . ': ' . $url;
	$lines[] = __( 'You get this because the weekly digest was switched on in PlanWeb, Settings. Switch it off there.', 'planweb' );
	return array(
		'kind'    => 'digest',
		'to'      => $to,
		/* translators: %s: site name. */
		'subject' => sprintf( __( '%s: the week ahead', 'planweb' ), $site ),
		'body'    => implode( "\n", $lines ) . "\n",
	);
}

/**
 * Send one email, unless the opt-out filter says no. The filter may change the subject or the text; it can never
 * change who it goes to. Sends nothing for a bad address or an empty email.
 *
 * @param array    $mail   kind, to, subject, body.
 * @param callable $filter ( array $mail ) => array|false. false stops the email.
 * @param callable $send   ( array $mail ) => bool: the real send (wp_mail()).
 * @return bool Whether the mail was sent.
 */
function planweb_job_deliver( array $mail, callable $filter, callable $send ): bool {
	$m = $filter( $mail );
	if ( false === $m ) {
		return false;
	}
	$m       = is_array( $m ) ? $m : $mail;
	$m['to'] = $mail['to']; // Never anyone else.
	if ( false === filter_var( (string) $m['to'], FILTER_VALIDATE_EMAIL ) || '' === trim( (string) ( $m['subject'] ?? '' ) ) || '' === trim( (string) ( $m['body'] ?? '' ) ) ) {
		return false;
	}
	return (bool) $send( $m );
}

/**
 * The dedupe list without keys for dates long past (35 days), so it does not grow for ever.
 *
 * @param array  $sent  Key => Y-m-d sent.
 * @param string $today Y-m-d.
 */
function planweb_jobs_sent_prune( array $sent, string $today ): array {
	$floor = planweb_add_days( $today, -35 );
	foreach ( array_keys( $sent ) as $key ) {
		$date = substr( (string) strrchr( (string) $key, '|' ), 1 );
		if ( ! planweb_is_date( $date ) || $date < $floor ) {
			unset( $sent[ $key ] );
		}
	}
	return $sent;
}

/**
 * When a job next runs: the next time the clock reads H:i in the site's time zone, on a given weekday or any day.
 *
 * @param DateTimeImmutable $now     Now, in the site's time zone.
 * @param string            $hm      H:i.
 * @param int               $weekday 1 (Monday) to 7, or 0 for every day.
 * @return int Unix time.
 */
function planweb_job_next_run( DateTimeImmutable $now, string $hm, int $weekday = 0 ): int {
	[ $h, $m ] = array_map( 'intval', explode( ':', $hm ) );
	$t         = $now->setTime( $h, $m, 0 );
	if ( $weekday >= 1 && $weekday <= 7 ) {
		$ahead = ( $weekday - (int) $now->format( 'N' ) + 7 ) % 7;
		$t     = $t->modify( '+' . $ahead . ' days' )->setTime( $h, $m, 0 );
	}
	if ( $t <= $now ) {
		$t = $t->modify( $weekday ? '+7 days' : '+1 day' )->setTime( $h, $m, 0 );
	}
	return $t->getTimestamp();
}
