<?php
/**
 * Animal Writes site layer for Kits Core: the wp-config.php names this site set before Kits Core's constants took the
 * plugin's own prefix. When the earlier name is set and the new one is not, the new one is defined with the same value,
 * so wp-config.php stays as it is. Loaded first by kits-core-site.php, before Kits Core loads.
 *
 * @package animalwrites-kits-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

foreach ( array(
	'GITHUB_DISPATCH_TOKEN', // the token that starts a workflow from Kits Core's cron health.
	'PHP_ERROR_LOG',         // where the PHP error log is (a file or a folder), when it is not found by itself.
) as $animalwrites_name ) {
	if ( defined( 'AW_' . $animalwrites_name ) && ! defined( 'KITS_' . $animalwrites_name ) ) {
		define( 'KITS_' . $animalwrites_name, constant( 'AW_' . $animalwrites_name ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- site layer: earlier name to new.
	}
}
unset( $animalwrites_name );
