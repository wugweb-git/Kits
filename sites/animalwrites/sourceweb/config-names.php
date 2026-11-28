<?php
/**
 * Animal Writes site layer for SourceWeb: the wp-config.php name this site set before SourceWeb's constants took the
 * plugin's own prefix. When the earlier name is set and the new one is not, the new one is defined with the same value,
 * so wp-config.php stays as it is. Loaded first by site.php, before SourceWeb loads.
 *
 * @package animalwrites-sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The GitHub token that starts a workflow (Run now). SourceWeb reads SOURCEWEB_GITHUB_TOKEN (or KITS_GITHUB_DISPATCH_TOKEN).
if ( defined( 'AW_GITHUB_DISPATCH_TOKEN' ) && ! defined( 'SOURCEWEB_GITHUB_TOKEN' ) ) {
	define( 'SOURCEWEB_GITHUB_TOKEN', AW_GITHUB_DISPATCH_TOKEN );
}
