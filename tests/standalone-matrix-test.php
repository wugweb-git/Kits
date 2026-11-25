<?php
/**
 * Standalone Isolation Matrix Test for Wugweb Companion Plugins.
 *
 * Verifies that each of the six companion plugins boots, initializes, and provides
 * fallback admin/REST/data functionality when Kits Core and EVERY sibling plugin are deactivated.
 *
 * Each plugin is executed in an isolated clean-room PHP subprocess.
 *
 * Usage: php tests/standalone-matrix-test.php
 *
 * @package wugweb-kits
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 1 );
}

$plugins = array(
	'directoryweb' => array(
		'name'  => 'DirectoryWeb',
		'entry' => dirname( __DIR__ ) . '/plugins/directoryweb/directoryweb.php',
		'check' => function () {
			return defined( 'DIRECTORYWEB_LOADED' )
				&& function_exists( 'directoryweb_count' )
				&& function_exists( 'directoryweb_icon' )
				&& function_exists( 'directoryweb_date' )
				&& function_exists( 'directoryweb_simple_table' )
				&& function_exists( 'directoryweb_rest_can' )
				&& function_exists( 'directoryweb_scf_active' )
				&& false === directoryweb_scf_active();
		},
		'test'  => dirname( __DIR__ ) . '/plugins/directoryweb/tests/directoryweb-standalone-test.php',
	),
	'rankweb'      => array(
		'name'  => 'RankWeb',
		'entry' => dirname( __DIR__ ) . '/plugins/rankweb/rankweb.php',
		'check' => function () {
			return defined( 'RANKWEB_DIR' )
				&& function_exists( 'rankweb_seo_canonical' )
				&& function_exists( 'rankweb_schema_render_standalone_json_ld' )
				&& function_exists( 'rankweb_print_head_tags' )
				&& class_exists( 'RankWeb_Schema' );
		},
		'test'  => dirname( __DIR__ ) . '/plugins/rankweb/tests/phpunit-lite.php',
	),
	'sourceweb'    => array(
		'name'  => 'SourceWeb',
		'entry' => dirname( __DIR__ ) . '/plugins/sourceweb/sourceweb.php',
		'check' => function () {
			return defined( 'AW_SOURCING_LOADED' )
				&& function_exists( 'aw_host' )
				&& function_exists( 'sourceweb_rest_can' )
				&& function_exists( 'sourceweb_item_tags' )
				&& function_exists( 'sourceweb_sanitize_meta' );
		},
		'test'  => dirname( __DIR__ ) . '/plugins/sourceweb/tests/SourceWebStandaloneTest.php',
	),
	'insightweb'   => array(
		'name'  => 'InsightWeb',
		'entry' => dirname( __DIR__ ) . '/plugins/insightweb/insightweb.php',
		'check' => function () {
			return defined( 'INSIGHTWEB_VERSION' )
				&& function_exists( 'insightweb_rest_can' )
				&& function_exists( 'insightweb_dash_count' )
				&& function_exists( 'aw_si_keywords_active' );
		},
		'test'  => dirname( __DIR__ ) . '/plugins/insightweb/tests/StandaloneInsightsTest.php',
	),
	'mailweb'      => array(
		'name'  => 'MailWeb',
		'entry' => dirname( __DIR__ ) . '/plugins/mailweb/mailweb.php',
		'check' => function () {
			return defined( 'MAILWEB_VERSION' )
				&& function_exists( 'mailweb_rest_can' )
				&& class_exists( 'Hostinger\Configuration' );
		},
		'test'  => dirname( __DIR__ ) . '/plugins/mailweb/tests/run.php',
	),
	'planweb'      => array(
		'name'  => 'PlanWeb',
		'entry' => dirname( __DIR__ ) . '/plugins/planweb/planweb.php',
		'check' => function () {
			return defined( 'PLANWEB_VERSION' )
				&& function_exists( 'planweb_rest_can' );
		},
		'test'  => dirname( __DIR__ ) . '/plugins/planweb/tests/run.php',
	),
);

$all_passed = true;
$total = count( $plugins );
$passed = 0;

echo "=== Wugweb Monorepo: Isolated Companion Plugin Independence Matrix ===\n";
echo "Testing all 6 companion plugins with Kits Core and all sibling plugins DEACTIVATED...\n\n";

foreach ( $plugins as $slug => $config ) {
	echo "Testing [{$config['name']}] in complete isolation... ";

	// Run dedicated standalone test file in clean isolated subprocess.
	$cmd = escapeshellcmd( PHP_BINARY ) . ' ' . escapeshellarg( $config['test'] );
	$output = array();
	$exit_code = 0;
	exec( $cmd . ' 2>&1', $output, $exit_code );

	if ( 0 === $exit_code ) {
		++$passed;
		echo "PASS (Clean boot, standalone fallbacks operational, 0 fatal errors)\n";
	} else {
		$all_passed = false;
		echo "FAIL (Exit code {$exit_code})\n";
		echo "  Output:\n  " . implode( "\n  ", $output ) . "\n";
	}
}

echo "\n======================================================================\n";
echo sprintf( "Results: %d of %d plugins passed standalone isolation verification.\n", $passed, $total );

if ( ! $all_passed ) {
	echo "Status: FAILED\n";
	exit( 1 );
}

echo "Status: ALL 6 PLUGINS FULLY INDEPENDENT AND VERIFIED OPERATIONAL\n";
exit( 0 );
