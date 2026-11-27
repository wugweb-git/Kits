<?php
/**
 * Animal Writes: real Dates texts must pass PlanWeb's personal-data rule (moved from plugins/planweb/tests/run.php).
 *
 * Usage: php sites/animalwrites/planweb/tests/site-tests.php
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) && 'cli' === PHP_SAPI ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput -- a command-line test runner.
if ( ! function_exists( 'wp_strip_all_tags' ) ) {
	function wp_strip_all_tags( $t ) { return trim( strip_tags( (string) $t ) ); }
}
require dirname( __DIR__, 4 ) . '/plugins/planweb/includes/model.php';

$fails = 0;
$count = 0;
function check( $ok, $name ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL $name\n";
	}
}

$site = 'animalwrites.in';
check( '' === planweb_link_problem( 'https://animalwrites.in/campaigns/x/', $site ), 'own page' );
check( '' === planweb_link_problem( 'https://www.animalwrites.in/', $site ), 'own page with www' );
check( '' === planweb_link_problem( 'https://x.com/animal_writes_/status/1', $site ), 'X' );
check( '' === planweb_link_problem( 'https://www.linkedin.com/company/animalwrites', $site ), 'LinkedIn with www' );
check( '' !== planweb_link_problem( 'https://animalwrites.in.example.com/', $site ), 'no look-alike host' );
check( '' !== planweb_link_problem( 'https://user@animalwrites.in/', $site ), 'no user in the address' );

$live = array(
	'Cause-list check, SMWP (C) 5/2025, for 17 Nov',
	'Supreme Court cause list (advance and daily lists for 17 Nov 2026) and case status, diary no. 41706/2025. Repeat on 13 and 14 Nov.',
	'Scheduled tasks at 10:00 (Directory indexing against the 20 Oct baseline) and 11:00 (8 tracked keywords).',
	'Search Insights → Pages: the campaign, the explainer and the Library judgment of 19 May 2026, impressions, clicks and position for 17 Nov–14 Dec against the 1 Nov baseline.',
	'help-now guides 28-day checkpoint: 1962 (13798), who-to-call (9031), injured-animal (126) and dog-bite (17307)',
	'Campaign form #10: 8,089 entries (8,079 yesterday)',
	'Supreme Court stray-dog case: High Court compliance reports due (19 May 2026 judgment)',
);
foreach ( $live as $i => $text ) {
	check( '' === planweb_personal_data_problem( $text ), "live text $i passes" );
}

echo $fails ? "$fails of $count checks failed.\n" : "All $count checks passed.\n";
exit( $fails ? 1 : 0 );
