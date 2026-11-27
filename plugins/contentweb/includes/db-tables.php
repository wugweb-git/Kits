<?php
/**
 * Custom tables for the Notion directories: platforms, tools and client engagements.
 * Rows are keyed by notion_id (unique) so re-imports update in place.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'WUGWEB_DB_VERSION', '1.4.0' );

function wugweb_core_create_tables() {
	global $wpdb;
	$cc = $wpdb->get_charset_collate();
	$p = $wpdb->prefix;
	$sql = "CREATE TABLE {$p}wugweb_platforms (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  notion_id varchar(40) NOT NULL,
  platform_id varchar(255) NOT NULL DEFAULT '',
  name varchar(255) NOT NULL DEFAULT '',
  slug varchar(255) NOT NULL DEFAULT '',
  sub_category varchar(255) NOT NULL DEFAULT '',
  description longtext,
  official_website varchar(255) NOT NULL DEFAULT '',
  supports_api varchar(255) NOT NULL DEFAULT '',
  supports_rss tinyint(1) NOT NULL DEFAULT 0,
  supports_oauth_login tinyint(1) NOT NULL DEFAULT 0,
  supports_webhooks tinyint(1) NOT NULL DEFAULT 0,
  supports_media_upload varchar(255) NOT NULL DEFAULT '',
  requires_login tinyint(1) NOT NULL DEFAULT 0,
  business_objective longtext,
  traffic_potential varchar(255) NOT NULL DEFAULT '',
  authority_score decimal(6,2) NULL DEFAULT NULL,
  seo_value varchar(255) NOT NULL DEFAULT '',
  backlink_type varchar(255) NOT NULL DEFAULT '',
  domain_authority varchar(255) NOT NULL DEFAULT '',
  posting_frequency varchar(255) NOT NULL DEFAULT '',
  supported_content_types longtext,
  supported_asset_types longtext,
  default_asset_sizes longtext,
  automation varchar(255) NOT NULL DEFAULT '',
  active tinyint(1) NOT NULL DEFAULT 0,
  notes longtext,
  icon varchar(255) NOT NULL DEFAULT '',
  categories longtext,
  seo_score varchar(20) NOT NULL DEFAULT '',
  notion_url varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY  (id),
  UNIQUE KEY notion_id (notion_id),
  KEY slug (slug(100)),
  KEY platform_id (platform_id)
) $cc;
CREATE TABLE {$p}wugweb_tools (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  notion_id varchar(40) NOT NULL,
  technology_id varchar(255) NOT NULL DEFAULT '',
  name varchar(255) NOT NULL DEFAULT '',
  slug varchar(255) NOT NULL DEFAULT '',
  description longtext,
  capability_area varchar(255) NOT NULL DEFAULT '',
  status varchar(255) NOT NULL DEFAULT '',
  official_website varchar(255) NOT NULL DEFAULT '',
  icon varchar(255) NOT NULL DEFAULT '',
  notes longtext,
  categories longtext,
  seo_score varchar(20) NOT NULL DEFAULT '',
  notion_url varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY  (id),
  UNIQUE KEY notion_id (notion_id),
  KEY slug (slug(100)),
  KEY technology_id (technology_id)
) $cc;
CREATE TABLE {$p}wugweb_engagements (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  notion_id varchar(40) NOT NULL,
  client_post_id bigint(20) unsigned NOT NULL DEFAULT 0,
  engagement_id varchar(255) NOT NULL DEFAULT '',
  client_notion_url varchar(255) NOT NULL DEFAULT '',
  client_code varchar(255) NOT NULL DEFAULT '',
  client_name varchar(255) NOT NULL DEFAULT '',
  project_id varchar(255) NOT NULL DEFAULT '',
  project_name varchar(255) NOT NULL DEFAULT '',
  start_date varchar(255) NOT NULL DEFAULT '',
  end_date varchar(255) NOT NULL DEFAULT '',
  duration varchar(255) NOT NULL DEFAULT '',
  engagement_type varchar(255) NOT NULL DEFAULT '',
  primary_contact varchar(255) NOT NULL DEFAULT '',
  additional_stakeholders longtext,
  services longtext,
  industry varchar(255) NOT NULL DEFAULT '',
  country varchar(255) NOT NULL DEFAULT '',
  partner varchar(255) NOT NULL DEFAULT '',
  status varchar(255) NOT NULL DEFAULT '',
  nda tinyint(1) NOT NULL DEFAULT 0,
  notes longtext,
  notion_url varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY  (id),
  UNIQUE KEY notion_id (notion_id),
  KEY client_post_id (client_post_id),
  KEY engagement_id (engagement_id)
) $cc;

CREATE TABLE {$p}wugweb_client_engagements (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  client_post_id bigint(20) unsigned NOT NULL DEFAULT 0,
  client_id varchar(255) NOT NULL DEFAULT '',
  brand_name varchar(255) NOT NULL DEFAULT '',
  slug varchar(255) NOT NULL DEFAULT '',
  entity_type varchar(255) NOT NULL DEFAULT '',
  year_first_worked varchar(255) NOT NULL DEFAULT '',
  status varchar(255) NOT NULL DEFAULT '',
  website varchar(255) NOT NULL DEFAULT '',
  logo varchar(255) NOT NULL DEFAULT '',
  partnered_by varchar(255) NOT NULL DEFAULT '',
  sector varchar(255) NOT NULL DEFAULT '',
  industry varchar(255) NOT NULL DEFAULT '',
  country varchar(255) NOT NULL DEFAULT '',
  country_legacy varchar(255) NOT NULL DEFAULT '',
  date varchar(255) NOT NULL DEFAULT '',
  blocked_by longtext,
  blocking longtext,
  projects longtext,
  case_studies longtext,
  engagement_count int(11) NOT NULL DEFAULT 0,
  engagement_ids longtext,
  project_ids longtext,
  project_names longtext,
  start_dates longtext,
  end_dates longtext,
  durations longtext,
  engagement_types longtext,
  primary_contacts longtext,
  additional_stakeholders longtext,
  services longtext,
  engagement_industries longtext,
  engagement_countries longtext,
  partners longtext,
  engagement_statuses longtext,
  engagement_ndas longtext,
  engagement_notes longtext,
  seo_score varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY  (id),
  UNIQUE KEY client_post_id (client_post_id)
) $cc;
";
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql );
}

add_action( 'plugins_loaded', function () {
	if ( version_compare( get_option( 'wugweb_db_version', '0' ), WUGWEB_DB_VERSION, '<' ) ) {
		wugweb_core_create_tables();
		update_option( 'wugweb_db_version', WUGWEB_DB_VERSION );
	}
} );

/** Engagements for one client post, newest first by engagement id. */
function wugweb_get_client_engagements( $client_post_id ) {
	global $wpdb;
	return $wpdb->get_results( $wpdb->prepare(
		"SELECT * FROM {$wpdb->prefix}wugweb_engagements WHERE client_post_id = %d ORDER BY engagement_id DESC",
		(int) $client_post_id
	) );
}
