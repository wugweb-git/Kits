<?php
/**
 * PlanWeb tests that need no WordPress (owner rule: no local WordPress or MySQL): the field checks (date, time, link,
 * no personal data) and the Dates import mapping and its one-for-one comparison (includes/model.php). Run by the
 * Deploy check; the import itself is run against a real WordPress there too (tools/ci/smoke.sh).
 *
 * Usage: php plugins/planweb/tests/run.php
 *
 * @package planweb
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput -- a command-line test runner.
if ( ! function_exists( 'wp_strip_all_tags' ) ) {
	function wp_strip_all_tags( $t ) { return trim( strip_tags( (string) $t ) ); }
}
require dirname( __DIR__ ) . '/includes/model.php';
require dirname( __DIR__ ) . '/includes/feed-model.php';
require_once dirname( __DIR__ ) . '/includes/ui-model.php';
require_once dirname( __DIR__ ) . '/includes/jobs-model.php'; // its functions run after the translation stand-ins below

$fails = 0;
$count = 0;

/**
 * One check.
 *
 * @param bool   $ok   Passed.
 * @param string $name What it checks.
 */
function check( bool $ok, string $name ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL $name\n";
	}
}

// Dates and times.
check( planweb_is_date( '2026-11-17' ), 'a real date' );
check( ! planweb_is_date( '2026-02-30' ), 'no 30 Feb' );
check( ! planweb_is_date( '17 Nov 2026' ), 'only Y-m-d' );
check( ! planweb_is_date( null ), 'null is not a date' );
check( planweb_is_time( '' ) && planweb_is_time( '09:30' ) && planweb_is_time( '23:59' ), 'empty or H:i' );
check( ! planweb_is_time( '24:00' ) && ! planweb_is_time( '9:30' ) && ! planweb_is_time( '09:30:00' ), 'no other times' );

// Links: this site and social sites only.
$site = 'animalwrites.in';
check( '' === planweb_link_problem( '', $site ), 'empty link is fine' );
check( '' === planweb_link_problem( 'https://animalwrites.in/campaigns/x/', $site ), 'own page' );
check( '' === planweb_link_problem( 'https://www.animalwrites.in/', $site ), 'own page with www' );
check( '' === planweb_link_problem( 'https://x.com/animal_writes_/status/1', $site ), 'X' );
check( '' === planweb_link_problem( 'https://www.linkedin.com/company/animalwrites', $site ), 'LinkedIn with www' );
check( '' === planweb_link_problem( 'https://in.linkedin.com/company/animalwrites', $site ), 'LinkedIn subdomain' );
check( '' === planweb_link_problem( 'https://www.whatsapp.com/channel/abc', $site ), 'WhatsApp channel' );
check( '' !== planweb_link_problem( 'https://wa.me/919999999999', $site ), 'no wa.me' );
check( '' !== planweb_link_problem( 'https://api.whatsapp.com/send?phone=919999999999', $site ), 'no WhatsApp send link' );
check( '' !== planweb_link_problem( 'tel:+919999999999', $site ), 'no tel:' );
check( '' !== planweb_link_problem( 'mailto:someone@example.com', $site ), 'no mailto:' );
check( '' !== planweb_link_problem( 'https://example.com/', $site ), 'no other site' );
check( '' !== planweb_link_problem( 'https://animalwrites.in.example.com/', $site ), 'no look-alike host' );
check( '' !== planweb_link_problem( 'https://notx.com/', $site ), 'no host ending in x.com' );
check( '' !== planweb_link_problem( 'https://user@animalwrites.in/', $site ), 'no user in the address' );
check( '' !== planweb_link_problem( 'javascript:alert(1)', $site ), 'no javascript:' );

// No personal data; the real Dates entries pass.
check( '' !== planweb_personal_data_problem( 'Write to someone@example.com' ), 'email refused' );
check( '' !== planweb_personal_data_problem( 'Call +91 98765 43210' ), 'phone refused' );
check( '' !== planweb_personal_data_problem( 'Call 098765-43210' ), 'phone with dash refused' );
check( '' !== planweb_personal_data_problem( 'Call (022) 2345 6789' ), 'landline refused' );
$live = array(
	'Cause-list check, SMWP (C) 5/2025, for 17 Nov',
	'Supreme Court cause list (advance and daily lists for 17 Nov 2026) and case status, diary no. 41706/2025. Repeat on 13 and 14 Nov.',
	'Scheduled tasks at 10:00 (Directory indexing against the 20 Oct baseline) and 11:00 (8 tracked keywords).',
	'Search Insights → Pages: the campaign, the explainer and the Library judgment of 19 May 2026, impressions, clicks and position for 17 Nov–14 Dec against the 1 Nov baseline.',
	'help-now guides 28-day checkpoint: 1962 (13798), who-to-call (9031), injured-animal (126) and dog-bite (17307)',
	'Campaign form #10: 8,089 entries (8,079 yesterday)',
	'Supreme Court stray-dog case: High Court compliance reports due (19 May 2026 judgment)',
);
check( '' === planweb_personal_data_problem( 'Recheck 2026-11-13 2026-11-14' ), 'two Y-m-d dates are not a phone' );
check( '' !== planweb_personal_data_problem( 'On 2026-11-13 call 98765 43210' ), 'phone next to a date still refused' );
foreach ( $live as $i => $text ) {
	check( '' === planweb_personal_data_problem( $text ), "live text $i passes" );
}

// The import mapping.
$stored = array(
	array(
		'date'  => '2026-11-05',
		'title' => 'Lab rules objections close',
		'note'  => 'Campaign 13848.',
	),
	array(
		'date'  => '2026-11-17',
		'title' => 'Rankings recheck',
		'note'  => '',
	),
	array(
		'date'  => '2026-11-05',
		'title' => 'Lab rules objections close',
		'note'  => 'Campaign 13848.',
	), // An identical copy.
	array(
		'date'  => 'soon',
		'title' => 'Not a date',
	),
	'a string',
	array(
		'date'  => '2026-12-01',
		'title' => '',
	),
	array(
		'date'  => '2026-12-01',
		'title' => 'No note key',
	),
);
$mapped = planweb_map_dates( $stored );
check( 4 === count( $mapped['rows'] ), 'four valid rows' );
check( 3 === count( $mapped['invalid'] ), 'three invalid elements listed' );
check( $mapped['rows'][0]['key'] !== $mapped['rows'][2]['key'], 'identical copies get different keys' );
check( planweb_source_key( $stored[0], 2 ) === $mapped['rows'][2]['key'], 'second copy is copy 2' );
check( '' === $mapped['rows'][3]['note'], 'missing note becomes empty' );
check( 6 === $mapped['rows'][3]['index'], 'stored position kept' );
check( planweb_map_dates( $stored )['rows'] === $mapped['rows'], 'same keys on a second run' );
check( array() === planweb_map_dates( null )['rows'] && array() === planweb_map_dates( 'x' )['rows'], 'no list, no rows' );

// The one-for-one comparison.
$entries = array();
foreach ( $mapped['rows'] as $n => $r ) {
	$entries[ $r['key'] ] = array(
		'id'    => 100 + $n,
		'date'  => $r['date'],
		'title' => $r['title'],
		'note'  => $r['note'],
	);
}
$cmp = planweb_compare( $mapped['rows'], $entries );
check( 4 === $cmp['same'] && 0 === $cmp['differs'] + $cmp['missing'] + $cmp['extra'], 'all the same after an import' );
$k                      = $mapped['rows'][1]['key'];
$entries[ $k ]['title'] = 'Rankings recheck (edited)';
unset( $entries[ $mapped['rows'][0]['key'] ] );
$entries['other'] = array(
	'id'    => 999,
	'date'  => '2026-12-31',
	'title' => 'Not from Dates',
	'note'  => '',
);
$cmp              = planweb_compare( $mapped['rows'], $entries );
check( 1 === $cmp['differs'] && 1 === $cmp['missing'] && 1 === $cmp['extra'] && 2 === $cmp['same'], 'differs, missing and extra counted' );

// The new screens (includes/ui-model.php): the counts, the tiles, the list's arguments, the switch. WordPress's
// translation and number functions are stood in for.
require_once dirname( __DIR__ ) . '/includes/ui-model.php';
if ( ! function_exists( '__' ) ) {
	/**
	 * Stand-in.
	 *
	 * @param string $t Text.
	 */
	function __( $t ) {
		return $t;
	}
	/**
	 * Stand-in.
	 *
	 * @param string $one  Singular.
	 * @param string $many Plural.
	 * @param int    $n    Number.
	 */
	function _n( $one, $many, $n ) {
		return 1 === $n ? $one : $many;
	}
	/**
	 * Stand-in.
	 *
	 * @param int $n Number.
	 */
	function number_format_i18n( $n ) {
		return number_format( $n );
	}
}

check( '2026-12-01' === planweb_add_days( '2026-11-30', 1 ) && '2026-10-12' === planweb_add_days( '2026-11-11', -30 ), 'days added across months' );
$today = '2026-11-11';
$es    = array(
	array(
		'id'     => 1,
		'date'   => '2026-11-11',
		'time'   => '',
		'title'  => 'Today',
		'type'   => 'social',
		'status' => 'draft',
	),
	array(
		'id'     => 2,
		'date'   => '2026-11-17',
		'time'   => '10:00',
		'title'  => 'Rankings',
		'type'   => 'content',
		'status' => 'approved',
	),
	array(
		'id'     => 3,
		'date'   => '2026-12-05',
		'time'   => '',
		'title'  => 'Jharkhand',
		'type'   => 'campaign',
		'status' => 'idea',
	),
	array(
		'id'     => 4,
		'date'   => '2026-11-07',
		'time'   => '',
		'title'  => 'Lab rules',
		'type'   => 'reminder',
		'status' => 'idea',
	),
	array(
		'id'     => 5,
		'date'   => '2026-11-01',
		'time'   => '',
		'title'  => 'Sent one',
		'type'   => 'email',
		'status' => 'sent',
	),
	array(
		'id'     => 6,
		'date'   => '2027-03-01',
		'time'   => '',
		'title'  => 'Far',
		'type'   => 'bogus',
		'status' => 'bogus',
	),
);
$c     = planweb_count_entries( $es, $today, array( 'same' => 4 ) );
check( 6 === $c['total'] && 1 === $c['today'], 'total and today counted' );
check( 2 === $c['ahead'][7]['total'], 'next 7 days: today and 17 Nov' );
check( 3 === $c['ahead'][30]['total'] && 3 === $c['ahead'][90]['total'], 'next 30 and 90 days' );
check( 1 === $c['ahead'][30]['types']['campaign'] && 0 === $c['ahead'][30]['types']['email'], 'by type' );
check( 2 === $c['types']['reminder'], 'unknown type counts as reminder' );
check( 1 === $c['overdue']['total'] && '2026-11-07' === $c['overdue']['oldest'], 'overdue: open and past only, not sent' );
check( 1 === $c['waiting'] && 1 === $c['ready'], 'waiting (draft) and ready (approved)' );
check( 3 === $c['statuses']['idea'] && 1 === $c['statuses']['sent'], 'by status; unknown status counts as idea' );
check( 1 === $c['next']['id'] && ! isset( $c['next']['key'] ), 'next date is today\'s entry' );
check(
	array(
		'same'    => 4,
		'differs' => 0,
		'missing' => 0,
		'extra'   => 0,
	) === $c['check'],
	'import check kept'
);
check( planweb_is_overdue( array( 'flag' => 'overdue' ), $today ), 'scheduler flag is overdue' );
$empty = planweb_count_entries( array(), $today );
check( 0 === $empty['total'] && null === $empty['next'] && array() === $empty['check'], 'no entries, zero counts' );

$seen_urls = array();
$tiles     = planweb_dashboard_tiles(
	$c + array( 'at' => 1 ),
	7,
	function ( array $a ) use ( &$seen_urls ) {
		$seen_urls[] = $a;
		return 'u?' . http_build_query( $a );
	},
	fn( $d ) => 'L' . $d
);
$keys      = array_column( $tiles, 'key' );
check( array( 'ahead', 'overdue', 'waiting', 'ready', 'next', 'today', 'total', 'check' ) === $keys, 'eight tiles in order' );
check( '2' === $tiles[0]['value'] && 'Coming up in 7 days' === $tiles[0]['label'] && 'u?when=next7' === $tiles[0]['href'], 'coming-up tile for the range' );
check( '1 social, 1 content' === $tiles[0]['sub'] || '1 content, 1 social' === $tiles[0]['sub'], 'coming-up sub-line by type' );
check( 'warn' === $tiles[1]['tone'] && 'Oldest from L2026-11-07' === $tiles[1]['sub'], 'overdue tile warns with the oldest date' );
check( 'L2026-11-11' === $tiles[4]['value'] && 'Today' === $tiles[4]['sub'], 'next date tile' );
check( 'Matches' === $tiles[7]['value'] && '' === $tiles[7]['tone'], 'import check tile' );
$ts = planweb_dashboard_tiles(
	$c + array(
		'site' => array(
			'ahead'  => array(
				7  => 2,
				30 => 5,
				90 => 9,
			),
			'missed' => 1,
			'next'   => null,
		),
	),
	30,
	fn( $a ) => 'u?' . http_build_query( $a ),
	fn( $d ) => 'L' . $d
);
check( array( 'ahead', 'overdue', 'waiting', 'ready', 'next', 'today', 'total', 'site', 'check' ) === array_column( $ts, 'key' ), 'site schedule tile before the import check' );
check( '5' === $ts[7]['value'] && 'warn' === $ts[7]['tone'] && str_contains( $ts[7]['sub'], '1 missed' ), 'site tile: scheduled in range, missed warns' );
$t90 = planweb_dashboard_tiles( $empty, 99, fn() => '', fn( $d ) => $d );
check( 'Coming up in 30 days' === $t90[0]['label'] && 7 === count( $t90 ) && '' === $t90[1]['tone'], 'unknown range is 30; no check tile without an import' );

$a = planweb_list_args( array(), $today );
check( 'from30' === $a['when'] && '2026-10-12' === $a['from'] && '' === $a['to'] && 'date' === $a['sort'] && 'asc' === $a['dir'] && 1 === $a['page'], 'list defaults: from 30 days ago, by date' );
$a = planweb_list_args(
	array(
		'when'   => 'next7',
		'type'   => 'social',
		'status' => 'nope',
		'sort'   => 'title',
		'dir'    => 'desc',
		'page'   => '3',
	),
	$today
);
check( '2026-11-11' === $a['from'] && '2026-11-17' === $a['to'] && 'social' === $a['type'] && '' === $a['status'] && 'title' === $a['sort'] && 'desc' === $a['dir'] && 3 === $a['page'], 'list arguments checked' );
$a = planweb_list_args( array( 'view' => 'overdue' ), $today );
check( 'all' === $a['when'] && '' === $a['from'] && $today === $a['before'], 'overdue view: before today, any date' );
$a = planweb_list_args( array( 'when' => 'past' ), $today );
check( $today === $a['before'] && '' === $a['from'], 'before today' );
$a = planweb_list_args(
	array(
		'when' => 'all',
		'view' => 'x',
	),
	$today
);
check( '' === $a['from'] . $a['to'] . $a['before'] && 'all' === $a['view'], 'all dates; unknown view is all' );

// Save only what changed: the switch is written only when its stored form changes.
check( null === planweb_switch_change( true, '1' ) && null === planweb_switch_change( false, '' ), 'unchanged switch writes nothing' );
check( '' === planweb_switch_change( false, '1' ) && '1' === planweb_switch_change( true, '' ), 'changed switch gives the new stored value' );
check( '1' === planweb_on_clean( '1' ) && '' === planweb_on_clean( '' ) && '' === planweb_on_clean( 0 ), 'the same clean-up as Kits → Modules' );

// Backup before uninstall deletes (includes/uninstall-backup.php): the lines, the 500-row batches, the folder guard.
require_once dirname( __DIR__ ) . '/includes/uninstall-backup.php';
$ub_t = static function ( bool $ok, string $what ): void {
	check( $ok, $what );
};
$ub_h = json_decode( planweb_backup_header( 'planweb', '1.2.3', 'https://example.org/', 1763000000, array( 'a_opt', 'b_opt' ), array( 'wp_x' ) ), true );
$ub_t( 'header' === $ub_h['type'] && 'planweb' === $ub_h['plugin'] && '1.2.3' === $ub_h['version'] && 'https://example.org/' === $ub_h['site'], 'backup: header names the plugin, version and site' );
$ub_t( '2025-11-13T02:13:20Z' === $ub_h['time'] && array( 'a_opt', 'b_opt' ) === $ub_h['options'] && array( 'wp_x' ) === $ub_h['tables'], 'backup: header has the time, the options and the tables' );
$ub_l = planweb_backup_option_line( 'a_opt', 'a:1:{s:1:"k";s:3:"é/";}', 'yes' );
$ub_o = json_decode( $ub_l, true );
$ub_t( "\n" === substr( $ub_l, -1 ) && 1 === substr_count( $ub_l, "\n" ), 'backup: one line per option' );
$ub_t( 'option' === $ub_o['type'] && 'a:1:{s:1:"k";s:3:"é/";}' === $ub_o['value'] && 'yes' === $ub_o['autoload'] && ! isset( $ub_o['b64'] ), 'backup: option value kept exactly as stored' );
$ub_o = json_decode( planweb_backup_option_line( 'bin', "\xff\x00\xfe", 'no' ), true );
$ub_t( array( 'value' ) === $ub_o['b64'] && "\xff\x00\xfe" === base64_decode( $ub_o['value'] ), 'backup: a value that is not UTF-8 is kept base64-encoded' ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- the test reads the value back
$ub_r = json_decode(
	planweb_backup_row_line(
		'wp_x',
		array(
			'id'   => '7',
			'note' => null,
			'blob' => "\x80",
		)
	),
	true
);
$ub_t( 'row' === $ub_r['type'] && 'wp_x' === $ub_r['table'] && '7' === $ub_r['row']['id'] && null === $ub_r['row']['note'] && array( 'blob' ) === $ub_r['b64'], 'backup: row line keeps every column, null and binary' );
$ub_t( '{}' === substr( trim( planweb_backup_row_line( 'wp_x', array() ) ), -3, 2 ), 'backup: an empty row is an object' );
$ub_t( 500 === PLANWEB_BACKUP_BATCH, 'backup: tables are read 500 rows at a time' );
$ub_calls = array();
$ub_seen  = 0;
$ub_fetch = static function ( int $offset, int $limit ) use ( &$ub_calls ) {
	$ub_calls[] = array( $offset, $limit );
	return array_fill( 0, max( 0, min( $limit, 1203 - $offset ) ), array( 'id' => '1' ) );
};
// phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter -- the test callbacks mirror the planweb_backup_rows() signature; not every case uses each argument.
$ub_n = planweb_backup_rows(
	$ub_fetch,
	static function ( array $row ) use ( &$ub_seen ): bool {
		++$ub_seen;
		return true;
	}
);
$ub_t( 1203 === $ub_n && 1203 === $ub_seen && array( array( 0, 500 ), array( 500, 500 ), array( 1000, 500 ) ) === $ub_calls, 'backup: 1203 rows in batches of 500' );
$ub_calls = array();
$ub_n     = planweb_backup_rows( static fn( int $o, int $l ) => $o < 1000 ? array_fill( 0, $l, array() ) : array(), static fn( array $r ): bool => true );
$ub_t( 1000 === $ub_n, 'backup: an exact multiple of 500 ends on the empty batch' );
$ub_t( false === planweb_backup_rows( static fn( int $o, int $l ) => null, static fn( array $r ): bool => true ), 'backup: a read error stops the backup' );
$ub_w = 0;
$ub_n = planweb_backup_rows(
	static fn( int $o, int $l ) => array_fill( 0, $l, array() ),
	static function ( array $r ) use ( &$ub_w ): bool {
		return ++$ub_w < 3;
	}
);
// phpcs:enable Generic.CodeAnalysis.UnusedFunctionParameter
$ub_t( false === $ub_n && 3 === $ub_w, 'backup: a write error stops the backup at once' );
$ub_t( 1 === preg_match( '/^planweb-uninstall-\d{8}-\d{6}\.jsonl\.gz$/', planweb_backup_name( 'planweb', 1763000000 ) ) && 'planweb-uninstall-20251113-021320.jsonl.gz' === planweb_backup_name( 'planweb', 1763000000 ), 'backup: file name' );
$ub_dir = sys_get_temp_dir() . '/planweb-ub-' . getmypid();
@mkdir( $ub_dir ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.WP.AlternativeFunctions -- a temporary folder for the test
file_put_contents( $ub_dir . '/index.php', 'kept' ); // phpcs:ignore WordPress.WP.AlternativeFunctions -- the test's own file
$ub_t( planweb_backup_protect( $ub_dir ) && false !== strpos( (string) file_get_contents( $ub_dir . '/.htaccess' ), 'Require all denied' ) && 'kept' === file_get_contents( $ub_dir . '/index.php' ), 'backup: folder guarded by .htaccess and index.php, an existing file kept' ); // phpcs:ignore WordPress.WP.AlternativeFunctions -- the test's own files
$ub_gz = gzopen( $ub_dir . '/t.jsonl.gz', 'wb6' ); // phpcs:ignore WordPress.WP.AlternativeFunctions -- the test's own file
gzwrite( $ub_gz, planweb_backup_header( 'planweb', '1', 's', 0, array( 'a' ), array() ) . planweb_backup_option_line( 'a', 'v', 'yes' ) );
gzclose( $ub_gz );
$ub_lines = gzfile( $ub_dir . '/t.jsonl.gz' );
$ub_t( 2 === count( $ub_lines ) && 'header' === json_decode( $ub_lines[0], true )['type'] && 'v' === json_decode( $ub_lines[1], true )['value'], 'backup: gzip JSON lines read back' );
foreach ( array( 'index.php', '.htaccess', 't.jsonl.gz' ) as $ub_f ) {
	unlink( $ub_dir . '/' . $ub_f ); // phpcs:ignore WordPress.WP.AlternativeFunctions -- the test's own files
}
rmdir( $ub_dir ); // phpcs:ignore WordPress.WP.AlternativeFunctions -- the test's own folder
$ub_dir = sys_get_temp_dir() . '/planweb-ub-ro-' . getmypid();
@mkdir( $ub_dir, 0555 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.WP.AlternativeFunctions -- a read-only folder for the test
$ub_t( 0 === getmyuid() || ! @planweb_backup_protect( $ub_dir ), 'backup: a folder that cannot be written is refused' ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- the warning is the expected failure
rmdir( $ub_dir ); // phpcs:ignore WordPress.WP.AlternativeFunctions -- the test's own folder

// Several channels (14 Nov 2026).
check( array( 'x', 'linkedin' ) === planweb_title_channels( '[X + LinkedIn] Lab rules in plain words (set 4)' ), 'title channels: X + LinkedIn' );
check( array( 'instagram', 'facebook', 'threads' ) === planweb_title_channels( '[Instagram + Facebook + Threads] Lab rules wait period' ), 'title channels: three, any case' );
check( array() === planweb_title_channels( '[X] One channel' ), 'title channels: one channel is not a bracket list' );
check( array() === planweb_title_channels( '[X + Mastodon] Not a channel' ), 'title channels: an unknown part leaves it alone' );
check( array() === planweb_title_channels( 'Plain title [X + LinkedIn]' ), 'title channels: only at the start' );
check( array( 'x', 'linkedin' ) === planweb_channel_list( 'x, LinkedIn,,x' ), 'channel list from text' );
check( array( 'x' ) === planweb_channel_list( array( 'x', '', 'x' ) ), 'channel list from an array' );
check( array() === planweb_channel_list( array( '' ) ), 'channel list: the form\'s empty box clears' );
check( isset( PLANWEB_CHANNELS['threads'], PLANWEB_CHANNELS['bluesky'], PLANWEB_STATUSES['done'] ), 'Threads, Bluesky and Done are on the lists' );
check( '' === planweb_link_problem( 'https://bsky.app/profile/x', 'animalwrites.in' ), 'Bluesky link allowed' );

// The calendar feed.
check( array( 'social', 'email', 'campaign', 'content', 'site' ) === planweb_feed_list( 'marketing', PLANWEB_TYPES, PLANWEB_FEED_TYPE_GROUPS ), 'feed: marketing types' );
check( array( 'approved', 'due' ) === planweb_feed_list( 'approved,due', PLANWEB_STATUSES, PLANWEB_FEED_STATUS_GROUPS ), 'feed: statuses' );
check( array() === planweb_feed_list( '', PLANWEB_TYPES, PLANWEB_FEED_TYPE_GROUPS ), 'feed: no filter' );
check( null === planweb_feed_list( 'social,spam', PLANWEB_TYPES, PLANWEB_FEED_TYPE_GROUPS ), 'feed: unknown value refused' );
$fe = array(
	array(
		'id'       => 1,
		'date'     => '2026-11-20',
		'time'     => '09:30',
		'title'    => 'Post; with, commas',
		'type'     => 'social',
		'channels' => array( 'x', 'linkedin' ),
		'status'   => 'approved',
		'link'     => 'https://x.com/a',
		'note'     => 'SECRET NOTE',
		'modified' => '2026-11-14 06:30:00',
	),
	array(
		'id'       => 2,
		'date'     => '2026-11-21',
		'time'     => '',
		'title'    => 'Call 98765 43210 about it',
		'type'     => 'reminder',
		'channels' => array(),
		'status'   => 'done',
		'link'     => 'https://evil.example/x',
		'note'     => '',
	),
	array(
		'id'       => 3,
		'date'     => '2026-11-22',
		'time'     => '',
		'title'    => str_repeat( 'Gaushālā ', 20 ),
		'type'     => 'content',
		'channels' => array( 'site' ),
		'status'   => 'idea',
		'link'     => '',
		'note'     => '',
	),
);
check( array( 1, 3 ) === array_column( planweb_feed_pick( $fe, PLANWEB_FEED_TYPE_GROUPS['marketing'], array() ), 'id' ), 'feed: marketing only' );
check( array( 1, 3 ) === array_column( planweb_feed_pick( $fe, array(), PLANWEB_FEED_STATUS_GROUPS['open'] ), 'id' ), 'feed: open statuses only (not done)' );
$ics       = planweb_ics(
	$fe,
	array(
		'name'     => 'Animal Writes: PlanWeb',
		'version'  => '0.2.0',
		'host'     => 'animalwrites.in',
		'stamp'    => '20261114T120000Z',
		'types'    => PLANWEB_TYPES,
		'channels' => PLANWEB_CHANNELS,
		'statuses' => PLANWEB_STATUSES,
	)
);
$ics_lines = explode( "\r\n", $ics );
check( '' === end( $ics_lines ) && false === strpos( str_replace( "\r\n", '', $ics ), "\n" ), 'ics: CRLF line ends only' );
check( 0 === count( array_filter( $ics_lines, fn( $l ) => strlen( $l ) > 75 ) ), 'ics: no line over 75 octets' );
check( (bool) mb_check_encoding( $ics, 'UTF-8' ), 'ics: folding keeps UTF-8 whole' );
$ics_un = preg_replace( "/\r\n /", '', $ics );
check( 3 === substr_count( $ics_un, 'BEGIN:VEVENT' ) && 3 === substr_count( $ics_un, 'END:VEVENT' ) && str_starts_with( $ics_un, "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:" ) && str_ends_with( $ics_un, "END:VCALENDAR\r\n" ), 'ics: calendar and events open and close' );
check( str_contains( $ics_un, "DTSTART:20261120T040000Z\r\nDTEND:20261120T043000Z" ), 'ics: 09:30 IST is 04:00 UTC' );
check( str_contains( $ics_un, "DTSTART;VALUE=DATE:20261121\r\nDTEND;VALUE=DATE:20261122" ), 'ics: all-day entry' );
check( str_contains( $ics_un, 'SUMMARY:Post\; with\, commas' ), 'ics: text escaped' );
check( str_contains( $ics_un, 'DESCRIPTION:Type: Social\nChannels: X\, LinkedIn\nStatus: Approved\nLink: https://x.com/a' ), 'ics: type, channels, status, link' );
check( false === strpos( $ics_un, 'SECRET NOTE' ), 'ics: never the note' );
check( false === strpos( $ics_un, '98765' ) && str_contains( $ics_un, 'SUMMARY:Entry 2 (title not shown' ), 'ics: a title with a phone number is not shown' );
check( false === strpos( $ics_un, 'evil.example' ), 'ics: a link to another site is left out' );
check( str_contains( $ics_un, 'UID:planweb-1@animalwrites.in' ) && str_contains( $ics_un, 'DTSTAMP:20261114T120000Z' ), 'ics: UID and DTSTAMP' );
check( str_contains( $ics_un, 'Status: Done' ), 'ics: Done status' );
$site_ics = planweb_ics(
	array(
		array(
			'uid'        => 'planweb-site-post-77',
			'id'         => 77,
			'date'       => '2026-12-02',
			'time'       => '10:00',
			'title'      => 'Rabies guide',
			'type'       => 'site',
			'typeText'   => 'Resource',
			'channels'   => array( 'site' ),
			'status'     => 'scheduled',
			'statusText' => 'Scheduled',
			'link'       => '',
		),
	),
	array(
		'name'     => 'N',
		'version'  => '0.2.0',
		'host'     => 'animalwrites.in',
		'stamp'    => '20261114T120000Z',
		'types'    => PLANWEB_TYPES,
		'channels' => PLANWEB_CHANNELS,
		'statuses' => PLANWEB_STATUSES,
	)
);
check( str_contains( $site_ics, 'UID:planweb-site-post-77@animalwrites.in' ) && str_contains( $site_ics, 'Type: Resource' ) && str_contains( $site_ics, 'Status: Scheduled' ), 'ics: a site post with its own kind and status' );
check( array( 'site' ) === planweb_feed_list( 'site', PLANWEB_TYPES + PLANWEB_FEED_EXTRA_TYPES, PLANWEB_FEED_TYPE_GROUPS ) && in_array( 'site', PLANWEB_FEED_TYPE_GROUPS['marketing'], true ), 'feed: site type, in marketing' );
check( str_contains( $ics_un, 'LAST-MODIFIED:20261114T063000Z' ) && 1 === substr_count( $ics_un, 'LAST-MODIFIED' ), 'ics: LAST-MODIFIED when the entry has one' );

$cf = array(
	array( 'id' => 1, 'type' => 'post', 'owner' => 'a', 'channels' => array( 'x', 'email' ), 'status' => 'approved' ),
	array( 'id' => 2, 'type' => 'reminder', 'owner' => 'b', 'channels' => array(), 'status' => 'due' ),
	array( 'id' => 3, 'type' => 'post', 'owner' => 'a', 'channels' => array( 'email' ), 'status' => 'idea' ),
);
check( 3 === count( planweb_calendar_filter( $cf, array() ) ), 'calendar filter: no filter keeps all' );
check( array( 1, 3 ) === array_column( planweb_calendar_filter( $cf, array( 'type' => 'post' ) ), 'id' ), 'calendar filter: by type' );
check( array( 1, 3 ) === array_column( planweb_calendar_filter( $cf, array( 'owner' => 'a' ) ), 'id' ), 'calendar filter: by owner' );
check( array( 1, 3 ) === array_column( planweb_calendar_filter( $cf, array( 'channel' => 'email' ) ), 'id' ), 'calendar filter: by channel, an entry may have several' );
check( array( 1, 2 ) === array_column( planweb_calendar_filter( $cf, array( 'status' => 'approved' ) ), 'id' ), 'calendar filter: Approved also lists Due' );
check( array( 1 ) === array_column( planweb_calendar_filter( $cf, array( 'type' => 'post', 'status' => 'approved' ) ), 'id' ), 'calendar filter: filters combine' );
check( array( 2, 3 ) === array_column( planweb_calendar_filter( array( array( 'id' => 1, 'date' => '2026-11-01' ), array( 'id' => 2, 'date' => '2026-11-10' ), array( 'id' => 3, 'date' => '2026-11-20' ) ), array( 'from' => '2026-11-10' ) ), 'id' ), 'calendar filter: a From date alone, inclusive' );
check( array( 2 ) === array_column( planweb_calendar_filter( array( array( 'id' => 1, 'date' => '2026-11-01' ), array( 'id' => 2, 'date' => '2026-11-10' ), array( 'id' => 3, 'date' => '2026-11-20' ) ), array( 'from' => '2026-11-02', 'to' => '2026-11-10' ) ), 'id' ), 'calendar filter: a date range, both ends inclusive' );
check( array( 1 ) === array_column( planweb_calendar_filter( array( array( 'id' => 1, 'date' => '2026-11-01', 'type' => 'post' ), array( 'id' => 2, 'date' => '2026-11-10', 'type' => 'email' ) ), array( 'to' => '2026-11-05', 'type' => 'post' ) ), 'id' ), 'calendar filter: the date range combines with the others' );

// Timeline.
$tr = planweb_timeline_range( '', '', '2026-11-26' );
check( '2026-11-23' === $tr['from'] && '2027-01-17' === $tr['to'] && 56 === $tr['days'], 'timeline range: no ends gives eight weeks from this Monday' );
$tr = planweb_timeline_range( '2026-12-10', '2026-12-01', '2026-11-26' );
check( '2026-12-01' === $tr['from'] && '2026-12-10' === $tr['to'] && 10 === $tr['days'], 'timeline range: reversed ends are swapped' );
$tr = planweb_timeline_range( '2026-01-01', '', '2026-11-26' );
check( '2026-01-01' === $tr['from'] && '2026-02-25' === $tr['to'], 'timeline range: only a start runs eight weeks on' );
$tr = planweb_timeline_range( '', '2026-03-01', '2026-11-26' );
check( '2026-01-05' === $tr['from'] && '2026-03-01' === $tr['to'], 'timeline range: only an end runs eight weeks back' );
$tr = planweb_timeline_range( '2026-01-01', '2028-01-01', '2026-11-26' );
check( 366 === $tr['days'] && '2027-01-01' === $tr['to'], 'timeline range: cut to a year' );
$tr = planweb_timeline_range( 'nonsense', '2026-02-30', '2026-11-26' );
check( '2026-11-23' === $tr['from'], 'timeline range: bad dates are ignored' );
$tl = planweb_timeline_lanes(
	array(
		array( 'id' => 1, 'type' => 'social', 'date' => '2026-11-12', 'time' => '', 'title' => 'B' ),
		array( 'id' => 2, 'type' => 'content', 'date' => '2026-11-11', 'time' => '', 'title' => 'A' ),
		array( 'id' => 3, 'type' => 'social', 'date' => '2026-11-11', 'time' => '', 'title' => 'C' ),
		array( 'id' => 4, 'type' => 'social', 'date' => '2026-12-01', 'time' => '', 'title' => 'Outside' ),
		array( 'id' => 5, 'type' => 'social', 'date' => 'bad', 'time' => '', 'title' => 'No date' ),
		array( 'id' => 6, 'type' => 'unknown', 'date' => '2026-11-10', 'time' => '', 'title' => 'Odd type' ),
	),
	'2026-11-10',
	'2026-11-19'
);
check( array( 'content', 'social', 'reminder' ) === array_keys( $tl ), 'timeline lanes: Type order, empty lanes left out, unknown type in Reminder' );
check( array( 3, 1 ) === array_column( $tl['social'], 'id' ), 'timeline lanes: by date, then title; out-of-range and dateless entries left out' );
check( 15.0 === $tl['content'][0]['left_pct'] && 5.0 === $tl['reminder'][0]['left_pct'], 'timeline lanes: marker at the middle of its day (10 days: day 1 = 15%, day 0 = 5%)' );
check( array() === planweb_timeline_lanes( array(), '2026-11-10', '2026-11-19' ), 'timeline lanes: none for no entries' );

check( '2026-11-23' === planweb_week_start( '2026-11-26' ) && '2026-11-23' === planweb_week_start( '2026-11-23' ) && '2026-11-23' === planweb_week_start( '2026-11-29' ), 'week start: Monday of the week, Sunday belongs to the week before' );
check( '2026-12-28' === planweb_week_start( '2027-01-01' ), 'week start: across a year end' );

require_once dirname( __DIR__ ) . '/includes/calendar-views.php';
$cal_entries = array(
	array( 'id' => 10, 'date' => '2026-11-05', 'end_date' => '2026-11-10', 'title' => 'Launch', 'author' => 'editor1', 'category' => 'news', 'campaign_tag' => 'winter', 'status' => 'approved' ),
	array( 'id' => 11, 'date' => '2026-11-12', 'title' => 'Follow-up', 'author' => 'editor2', 'category' => 'social', 'campaign_tag' => 'spring', 'status' => 'draft' ),
);
check( 1 === count( planweb_calendar_filter_entries( $cal_entries, array( 'author' => 'editor1', 'tag' => 'winter' ) ) ), 'calendar views: filters by author and campaign tag' );
$mo = planweb_calendar_month_grid( 2026, 11, $cal_entries );
check( 5 === count( $mo['weeks'] ) && 1 === count( $mo['weeks'][0][4]['entries'] ), 'calendar views: monthly grid slots Nov 5 entry' );
$wk = planweb_calendar_week_grid( '2026-11-05', $cal_entries );
check( 7 === count( $wk['days'] ) && 1 === count( $wk['days'][0]['entries'] ), 'calendar views: weekly grid has 7 days and slots Nov 5' );
$tl = planweb_campaign_timeline_data( $cal_entries );
check( 8 === $tl['span_days'] && 0.0 === $tl['bars'][0]['left_pct'] && 75.0 === $tl['bars'][0]['width_pct'], 'campaign timeline: percentage bars computed without Gantt lib' );
check( false !== strpos( planweb_render_campaign_timeline( $cal_entries ), 'planweb-timeline-bar' ), 'campaign timeline: renders HTML bar markup' );

// Scheduled jobs (includes/jobs-model.php).
// Cleaners reject bad input.
check( 1 === planweb_jobs_clean_flag( '1' ) && 1 === planweb_jobs_clean_flag( true ) && 0 === planweb_jobs_clean_flag( '0' ) && 0 === planweb_jobs_clean_flag( '' ), 'jobs: switches read 1 and 0' );
check( null === planweb_jobs_clean_flag( 'maybe' ) && null === planweb_jobs_clean_flag( array( 1 ) ) && null === planweb_jobs_clean_flag( 2 ), 'jobs: a switch refuses anything else' );
check( 1 === planweb_jobs_clean_days( 1 ) && 14 === planweb_jobs_clean_days( '14' ) && 7 === planweb_jobs_clean_days( ' 7 ' ), 'jobs: reminder days 1 to 14 are taken' );
check( null === planweb_jobs_clean_days( 0 ) && null === planweb_jobs_clean_days( '15' ) && null === planweb_jobs_clean_days( '-1' ) && null === planweb_jobs_clean_days( 'abc' ) && null === planweb_jobs_clean_days( '2.5' ) && null === planweb_jobs_clean_days( 3.0 ) && null === planweb_jobs_clean_days( array() ), 'jobs: reminder days refuse 0, 15, negatives, words and fractions' );
check( 'Acme Studio' === planweb_jobs_clean_brand( '  <b>Acme</b>   Studio ' ) && '' === planweb_jobs_clean_brand( '' ) && '' === planweb_jobs_clean_brand( null ), 'jobs: the digest line is plain text on one line' );
check( null === planweb_jobs_clean_brand( str_repeat( 'a', 121 ) ) && null === planweb_jobs_clean_brand( array( 'x' ) ) && null === planweb_jobs_clean_brand( 12 ), 'jobs: the digest line refuses too long and not text' );
check( 'none' === planweb_repeat_clean( '' ) && 'weekly' === planweb_repeat_clean( 'weekly' ) && 'monthly' === planweb_repeat_clean( 'monthly' ), 'repeat: none, weekly, monthly' );
check( null === planweb_repeat_clean( 'yearly' ) && null === planweb_repeat_clean( 'daily' ) && null === planweb_repeat_clean( array() ), 'repeat: refuses anything else' );

// Overdue: today is not overdue, closed entries are not, nothing is changed but the flag.
$od = array(
	array( 'id' => 1, 'date' => '2026-11-25', 'status' => 'draft', 'flag' => '' ),
	array( 'id' => 2, 'date' => '2026-11-26', 'status' => 'draft', 'flag' => '' ),
	array( 'id' => 3, 'date' => '2026-11-20', 'status' => 'sent', 'flag' => '' ),
	array( 'id' => 4, 'date' => '2026-11-20', 'status' => 'done', 'flag' => 'overdue' ),
	array( 'id' => 5, 'date' => '2026-11-10', 'status' => 'idea', 'flag' => 'overdue' ),
	array( 'id' => 6, 'date' => '2026-11-27', 'status' => 'approved', 'flag' => 'overdue' ),
	array( 'id' => 7, 'date' => '', 'status' => 'idea', 'flag' => '' ),
	array( 'id' => 8, 'date' => '2026-11-01', 'status' => 'due', 'flag' => '' ),
);
$op = planweb_overdue_plan( $od, '2026-11-26' );
check( array( 1, 8 ) === $op['set'], 'overdue: past and open is flagged; today, future, closed and dateless are not' );
check( array( 4, 6 ) === $op['clear'], 'overdue: a flag on a finished or future entry is let go; a still overdue one stays' );
check( ! planweb_is_overdue( array( 'date' => '2026-11-20', 'status' => 'done', 'flag' => 'overdue' ), '2026-11-26' ) && planweb_is_overdue( array( 'date' => '2026-11-20', 'status' => 'idea', 'flag' => '' ), '2026-11-26' ), 'overdue: a stale flag does not make a done entry overdue' );
$cnt = planweb_count_entries( $od, '2026-11-26' );
check( 4 === $cnt['overdue']['total'] && '2026-11-01' === $cnt['overdue']['oldest'], 'overdue: the Dashboard count uses the same rule' );

// Repeats.
check( '2027-02-28' === planweb_repeat_next( '2027-01-31', 'monthly' ), 'repeat: 31 Jan becomes 28 Feb (not a leap year)' );
check( '2028-02-29' === planweb_repeat_next( '2028-01-31', 'monthly' ), 'repeat: 31 Jan becomes 29 Feb in a leap year' );
check( '2026-12-30' === planweb_repeat_next( '2026-11-30', 'monthly' ) && '2027-01-15' === planweb_repeat_next( '2026-12-15', 'monthly' ), 'repeat: monthly keeps the day and crosses a year end' );
check( '2026-12-03' === planweb_repeat_next( '2026-11-26', 'weekly' ) && '2027-01-01' === planweb_repeat_next( '2026-12-25', 'weekly' ), 'repeat: weekly adds 7 days' );
check( '2027-03-31' === planweb_repeat_next( '2027-01-31', 'monthly', '2027-03-01' ), 'repeat: a long-past monthly entry returns to its own day, the 31st' );
check( '' === planweb_repeat_next( '2026-02-30', 'weekly' ) && '' === planweb_repeat_next( '2026-11-26', 'none' ), 'repeat: a bad date or rule gives nothing' );
$rp = array(
	array( 'id' => 1, 'date' => '2026-11-25', 'time' => '09:30', 'title' => 'Weekly post', 'type' => 'social', 'channels' => array( 'x', 'linkedin' ), 'owner' => 'team', 'status' => 'sent', 'repeat' => 'weekly', 'repeat_until' => '', 'repeated_to' => '' ),
	array( 'id' => 2, 'date' => '2026-11-25', 'title' => 'Done already', 'repeat' => 'weekly', 'repeated_to' => '77' ),
	array( 'id' => 3, 'date' => '2026-11-26', 'title' => 'Today', 'repeat' => 'weekly', 'repeated_to' => '' ),
	array( 'id' => 4, 'date' => '2026-11-20', 'title' => 'Never', 'repeat' => 'none', 'repeated_to' => '' ),
	array( 'id' => 5, 'date' => '2026-11-20', 'title' => 'Ends', 'repeat' => 'weekly', 'repeat_until' => '2026-11-25', 'repeated_to' => '' ),
	array( 'id' => 6, 'date' => '2026-10-31', 'title' => 'Month end', 'repeat' => 'monthly', 'repeated_to' => '' ),
);
$pl = planweb_repeat_plan( $rp, '2026-11-26' );
check( array( 1, 6 ) === array_map( fn( $p ) => $p['source']['id'], $pl ), 'repeat: only past entries that repeat, have not repeated and are not past their end' );
check( '2026-12-02' === $pl[0]['fields']['date'] && 'idea' === $pl[0]['fields']['status'] && 'Weekly post' === $pl[0]['fields']['title'] && 'social' === $pl[0]['fields']['type'] && array( 'x', 'linkedin' ) === $pl[0]['fields']['channels'] && 'team' === $pl[0]['fields']['owner'] && 'weekly' === $pl[0]['fields']['repeat'], 'repeat: the new entry keeps title, type, channels, owner and rule, resets status, moves the date' );
check( '2026-11-30' === $pl[1]['fields']['date'], 'repeat: monthly from 31 Oct, a month on is 30 Nov' );
$again = array_map( fn( $e ) => 1 === $e['id'] ? $e + array() : $e, $rp );
$again[0]['repeated_to'] = '90';
check( array( 6 ) === array_map( fn( $p ) => $p['source']['id'], planweb_repeat_plan( $again, '2026-11-26' ) ), 'repeat: once marked repeated_to, an entry is never planned again (idempotent)' );

// Reminders: grouping per user, window, dedupe, no outside addresses.
$users = array(
	10 => array( 'email' => 'ann@example.org', 'name' => 'Ann' ),
	11 => array( 'email' => 'not-an-address', 'name' => 'Bad' ),
	12 => array( 'email' => 'raj@example.org', 'name' => 'Raj' ),
);
$re = array(
	array( 'id' => 1, 'date' => '2026-11-27', 'time' => '', 'title' => 'B entry', 'status' => 'draft', 'author' => 10 ),
	array( 'id' => 2, 'date' => '2026-11-26', 'time' => '10:00', 'title' => 'A entry', 'status' => 'approved', 'author' => 10 ),
	array( 'id' => 3, 'date' => '2026-11-27', 'time' => '', 'title' => 'Raj', 'status' => 'idea', 'author' => 12 ),
	array( 'id' => 4, 'date' => '2026-11-27', 'time' => '', 'title' => 'Finished', 'status' => 'done', 'author' => 10 ),
	array( 'id' => 5, 'date' => '2026-11-29', 'time' => '', 'title' => 'Too far', 'status' => 'draft', 'author' => 10 ),
	array( 'id' => 6, 'date' => '2026-11-27', 'time' => '', 'title' => 'Bad email owner', 'status' => 'draft', 'author' => 11 ),
	array( 'id' => 7, 'date' => '2026-11-27', 'time' => '', 'title' => 'No owner', 'status' => 'draft', 'author' => 0 ),
	array( 'id' => 8, 'date' => '2026-11-27', 'time' => '', 'title' => 'Unknown user', 'status' => 'draft', 'author' => 99 ),
	array( 'id' => 9, 'date' => '2026-11-25', 'time' => '', 'title' => 'Yesterday', 'status' => 'draft', 'author' => 10 ),
);
$gr = planweb_reminder_groups( $re, '2026-11-26', 1, $users, array() );
check( 2 === count( $gr ) && 10 === $gr[0]['user'] && 12 === $gr[1]['user'], 'reminders: one group per user, nobody without a valid user or address' );
check( array( 2, 1 ) === array_column( $gr[0]['entries'], 'id' ) && array( '1|2026-11-27', '2|2026-11-26' ) === $gr[0]['keys'], 'reminders: a user\'s entries by date, only open ones inside the window' );
$gr7 = planweb_reminder_groups( $re, '2026-11-26', 3, $users, array() );
check( in_array( 5, array_column( $gr7[0]['entries'], 'id' ), true ), 'reminders: a wider window takes in later entries' );
$gd = planweb_reminder_groups( $re, '2026-11-26', 1, $users, array( '1|2026-11-27' => '2026-11-26', '2|2026-11-26' => '2026-11-26' ) );
check( 1 === count( $gd ) && 12 === $gd[0]['user'], 'reminders: entries already mailed (entry and date) are left out' );
$gd2 = planweb_reminder_groups( array( array( 'id' => 1, 'date' => '2026-11-28', 'time' => '', 'title' => 'Moved', 'status' => 'draft', 'author' => 10 ) ), '2026-11-27', 1, $users, array( '1|2026-11-27' => '2026-11-26' ) );
check( 1 === count( $gd2 ), 'reminders: the same entry on a new date is mailed again' );
$mail = planweb_reminder_build( $gr[0], 'My Site', 'https://example.org/wp-admin/admin.php?page=planweb', 1, '2026-11-26' );
check( 'ann@example.org' === $mail['to'] && 'reminder' === $mail['kind'] && false !== strpos( $mail['body'], '- today 10:00: A entry (Approved)' ) && false !== strpos( $mail['body'], '- 27 Nov 2026: B entry (Draft)' ) && false !== strpos( $mail['body'], 'Hello Ann,' ) && $mail['body'] === strip_tags( $mail['body'] ), 'reminders: the email is plain text with one line per entry' );
check( false !== strpos( $mail['subject'], 'My Site' ) && false !== strpos( $mail['subject'], '2' ), 'reminders: the subject names the site and the count' );
$pruned = planweb_jobs_sent_prune( array( '1|2026-11-27' => 'x', '2|2026-09-01' => 'x', 'junk' => 'x' ), '2026-11-26' );
check( array( '1|2026-11-27' ) === array_keys( $pruned ), 'dedupe: old keys are dropped' );

// Digest.
$dg = array(
	array( 'id' => 1, 'date' => '2026-11-28', 'time' => '09:00', 'title' => 'Launch', 'status' => 'approved', 'flag' => '' ),
	array( 'id' => 2, 'date' => '2026-12-02', 'time' => '', 'title' => 'Day seven', 'status' => 'draft', 'flag' => '' ),
	array( 'id' => 3, 'date' => '2026-12-03', 'time' => '', 'title' => 'Too far', 'status' => 'draft', 'flag' => '' ),
	array( 'id' => 4, 'date' => '2026-11-20', 'time' => '', 'title' => 'Late one', 'status' => 'draft', 'flag' => '' ),
	array( 'id' => 5, 'date' => '2026-11-30', 'time' => '', 'title' => 'Finished', 'status' => 'done', 'flag' => '' ),
);
$d = planweb_digest_build( $dg, '2026-11-26', 'My Site', 'admin@example.org', 'Acme Studio', 'https://example.org/cal' );
check( 'admin@example.org' === $d['to'] && 'digest' === $d['kind'] && 0 === strpos( $d['body'], "Acme Studio\n" ), 'digest: to the administrator, the brand line first' );
check( false !== strpos( $d['body'], 'Launch' ) && false !== strpos( $d['body'], 'Day seven' ) && false === strpos( $d['body'], 'Too far' ) && false === strpos( $d['body'], 'Finished' ) && false !== strpos( $d['body'], '- 20 Nov 2026: Late one (Draft)' ), 'digest: the next 7 days, then overdue; not later and not finished entries' );
$d2 = planweb_digest_build( $dg, '2026-11-26', 'My Site', 'admin@example.org', '', 'https://example.org/cal' );
check( 0 === strpos( $d2['body'], 'The week ahead on My Site' ), 'digest: no brand line when none is set' );
check( null === planweb_digest_build( array(), '2026-11-26', 'My Site', 'admin@example.org', '', 'x' ), 'digest: nothing to say, nothing to send' );

// Opt-out filter and delivery.
$sent_to = array();
$send    = function ( $m ) use ( &$sent_to ) {
	$sent_to[] = $m['to'];
	return true;
};
check( false === planweb_job_deliver( $mail, fn( $m ) => false, $send ) && array() === $sent_to, 'email: the filter returning false stops the send' );
check( true === planweb_job_deliver( $mail, fn( $m ) => $m, $send ) && array( 'ann@example.org' ) === $sent_to, 'email: sent when the filter lets it through' );
$sent_to = array();
planweb_job_deliver( $mail, fn( $m ) => array_merge( $m, array( 'to' => 'someone@outside.example' ) ), $send );
check( array( 'ann@example.org' ) === $sent_to, 'email: the filter cannot change who it goes to' );
check( false === planweb_job_deliver( $mail, fn( $m ) => $m, fn( $m ) => false ), 'email: a failed wp_mail() is not a send (so no dedupe is written)' );
check( false === planweb_job_deliver( array_merge( $mail, array( 'to' => 'nope' ) ), fn( $m ) => $m, $send ), 'email: no send to a bad address' );

// When a job runs.
$tz = new DateTimeZone( 'Asia/Kolkata' );
check( ( new DateTimeImmutable( '2026-11-26 08:00', $tz ) )->getTimestamp() === planweb_job_next_run( new DateTimeImmutable( '2026-11-26 07:00', $tz ), '08:00' ), 'schedule: today at 08:00 when it is still ahead' );
check( ( new DateTimeImmutable( '2026-11-27 08:00', $tz ) )->getTimestamp() === planweb_job_next_run( new DateTimeImmutable( '2026-11-26 08:00', $tz ), '08:00' ), 'schedule: tomorrow once 08:00 has come' );
check( ( new DateTimeImmutable( '2026-11-30 08:30', $tz ) )->getTimestamp() === planweb_job_next_run( new DateTimeImmutable( '2026-11-26 12:00', $tz ), '08:30', 1 ), 'schedule: the next Monday 08:30' );
check( ( new DateTimeImmutable( '2026-12-07 08:30', $tz ) )->getTimestamp() === planweb_job_next_run( new DateTimeImmutable( '2026-11-30 09:00', $tz ), '08:30', 1 ), 'schedule: a week on when Monday 08:30 has passed' );


// 0.4.1: no visible "Animal Writes" outside the gated team dates. (The calendar Today button colour is Kits Core's: kits-core 1.3.4.)
$visible = 0;
foreach ( glob( dirname( __DIR__ ) . '/includes/*.php' ) as $f ) {
	foreach ( explode( "\n", (string) file_get_contents( $f ) ) as $line ) {
		$t = ltrim( $line );
		if ( '' === $t || in_array( $t[0], array( '*', '/' ), true ) ) {
			continue;
		}
		$visible += (int) ( preg_match( "/(__|_e|esc_html__|esc_attr__)\(\s*'[^']*Animal Writes/", $t ) );
	}
}
check( 0 === $visible, 'no translatable string names Animal Writes' );

echo $fails ? "$fails of $count checks failed.\n" : "All $count checks passed.\n";
exit( $fails ? 1 : 0 );
