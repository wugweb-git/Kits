<?php
/**
 * Animal Writes site layer for InsightWeb: the wp-config.php names this site set before InsightWeb's constants took the
 * plugin's own prefix. Each earlier name that is set (and whose new name is not) defines the new one with the same value,
 * so wp-config.php stays as it is. Loaded first by site.php, before InsightWeb loads.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

foreach ( array(
	// The eight numbers (Settings → Numbers).
	'SI_HIGH_TRENDS',
	'SI_HIGH_IMPR',
	'SI_QUICK_MIN',
	'SI_MOVERS',
	'SI_PSI_FLAG',
	'SI_RM_LOW',
	'SI_KEEP_DAYS',
	'SI_SOURCING_PUSH_MIN',
	// The score floor.
	'SI_SCORE_FLOOR',
	// The service keys (Settings → Keys).
	'CLARITY_TOKEN',
	'BING_WEBMASTER_KEY',
	'PSI_KEY',
	'GOOGLE_ALERTS_FEED_1',
	'GOOGLE_ALERTS_FEED_2',
) as $aw_name ) {
	if ( defined( 'AW_' . $aw_name ) && ! defined( 'INSIGHTWEB_' . $aw_name ) ) {
		define( 'INSIGHTWEB_' . $aw_name, constant( 'AW_' . $aw_name ) );
	}
}
unset( $aw_name );

// The post types the focus-keyphrase sync runs over, when the site sets them (InsightWeb reads the filter, not the constant).
if ( defined( 'AW_SEO_ITEM_TYPES' ) ) {
	add_filter( 'insightweb_seo_item_types', fn() => (array) AW_SEO_ITEM_TYPES );
}
