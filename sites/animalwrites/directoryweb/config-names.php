<?php
/**
 * Animal Writes site layer for DirectoryWeb: the wp-config.php names this site set before DirectoryWeb's constants took
 * the plugin's own prefix. When the earlier name is set and the new one is not, the new one is defined with the same
 * value, so wp-config.php stays as it is. Loaded first by site.php, before DirectoryWeb loads.
 *
 * @package animalwrites-directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Days after which a Claimed listing is checked again (DirectoryWeb falls back to 180).
if ( defined( 'AW_REVERIFY_DAYS' ) && ! defined( 'DIRECTORYWEB_REVERIFY_DAYS' ) ) {
	define( 'DIRECTORYWEB_REVERIFY_DAYS', AW_REVERIFY_DAYS );
}
