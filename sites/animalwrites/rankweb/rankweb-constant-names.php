<?php
/**
 * The earlier AW_ constant names of RankWeb's settings, for this site. RankWeb names its constants RANKWEB_*; this file
 * carries three things over from the names it used before (it is loaded before the plugin, see site.php):
 *
 * 1. wp-config overrides: a site that defines AW_SEO_DESC_MAX (and so on) in wp-config.php keeps that value as RANKWEB_SEO_DESC_MAX.
 * 2. Saved settings: the option aw_seo_settings was saved with the AW_ names as keys; they are read as the RANKWEB_ names (a new save writes the new names).
 * 3. Readers that still use the old names (the theme, Animal Writes Core, InsightWeb, Kits Core): once RankWeb is loaded,
 *    each AW_ name is defined with the value of its RANKWEB_ constant.
 *
 * @package animalwrites-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The settings constants (the suffix after RANKWEB_ / AW_), the ones a site can override from wp-config. */
function awsite_rankweb_setting_names(): array {
	return array(
	'AGENT_WRITES', 'ARCHIVE_DESCRIPTIONS', 'BULK_TYPES', 'DEFER_SCRIPTS', 'DELAY_SCRIPTS',
	'DIRECTORY_KEEP_INDEXED', 'FAQ_HUBS', 'FAQ_MAX', 'FAQ_MIN', 'FAQ_MIN_GUIDE', 'FAQ_WORDS',
	'FILTERED_CATEGORY_HUBS', 'FILTERED_MIN_ITEMS', 'FILTERED_STATE_NOINDEX', 'FILTERED_TITLE_WORDS',
	'FILTER_PARAMS', 'HUB_DESCRIPTIONS', 'HUB_TITLES', 'ITEM_ROBOTS', 'LINK_ANCHOR_EXACT_MAX',
	'LINK_ANCHOR_MIN', 'LINK_ANCHOR_TYPE_MAX', 'LINK_AUDIT_AVOID', 'LINK_AUDIT_DEPTH', 'LINK_AUDIT_MAX',
	'LINK_BRAND', 'LINK_EXCLUDE', 'LINK_FIRST_ONLY', 'LINK_GENERIC', 'LINK_LONG_WORDS', 'LINK_MAX',
	'LINK_MAX_PER_TARGET', 'LINK_NO_SELF', 'LINK_SKIP_LINKED', 'LINK_TYPES', 'LLMS_GUIDE_TYPES',
	'LLMS_PAGE_ORDER', 'MD_VARY_HTML', 'MEDIA_CAPTION', 'NOINDEX_ATTACHMENT', 'PRUNE_SAFELIST',
	'REDIRECT_HTACCESS', 'RM_SCHEMA_TYPES', 'SCHEMA_TYPES', 'SEO_ARTICLE_TYPES', 'SEO_BREAKDOWN',
	'SEO_COVERED_TESTS', 'SEO_DESC_MAX', 'SEO_GENERIC_WORDS', 'SEO_ITEM_TYPES', 'SEO_LISTING_SHARE_IMAGE',
	'SEO_NOINDEX_PROTECTED', 'SEO_RENDERED_TYPES', 'SEO_SOURCE_IMAGE_TYPES', 'SEO_SUMMARY_SKIP_TESTS',
	'SEO_TERM_TITLES', 'SILO_DEPTH', 'SILO_MAX', 'SILO_MIN', 'SITE_ALT_NAMES', 'THIN_DISTRICT_TYPE',
	'TITLE_PREFIX', 'TITLE_SEPARATOR', 'TWITTER_SITE', 'VERIFY_PINTEREST', 'VIDEO_TYPES',
	);
}

// 1. wp-config overrides under the old names.
foreach ( awsite_rankweb_setting_names() as $awsite_name ) {
	if ( defined( 'AW_' . $awsite_name ) && ! defined( 'RANKWEB_' . $awsite_name ) ) {
		define( 'RANKWEB_' . $awsite_name, constant( 'AW_' . $awsite_name ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- site layer: old name to new
	}
}
unset( $awsite_name );

// 2. Saved settings keyed by the old names.
add_filter(
	'option_aw_seo_settings',
	function ( $saved ) {
		if ( ! is_array( $saved ) ) {
			return $saved;
		}
		$names = awsite_rankweb_setting_names();
		foreach ( $saved as $module => $values ) {
			if ( ! is_array( $values ) ) {
				continue;
			}
			foreach ( $names as $name ) {
				if ( array_key_exists( 'AW_' . $name, $values ) ) {
					if ( ! array_key_exists( 'RANKWEB_' . $name, $values ) ) {
						$saved[ $module ][ 'RANKWEB_' . $name ] = $values[ 'AW_' . $name ];
					}
					unset( $saved[ $module ][ 'AW_' . $name ] );
				}
			}
		}
		return $saved;
	}
);

// 3. The old names for what other code still reads (after RankWeb has defined its constants).
add_action(
	'plugins_loaded',
	function () {
		foreach ( array_merge( awsite_rankweb_setting_names(), array( 'SEO_MENU', 'SEO_SETTINGS' ) ) as $name ) {
			if ( defined( 'RANKWEB_' . $name ) && ! defined( 'AW_' . $name ) ) {
				define( 'AW_' . $name, constant( 'RANKWEB_' . $name ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- site layer: old name
			}
		}
	},
	20
);
