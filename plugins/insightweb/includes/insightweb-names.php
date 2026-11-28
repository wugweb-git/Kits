<?php
/**
 * The names InsightWeb's numbers and service keys are saved under.
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The name a setting or service key is stored under. The code, the screens and the REST routes use the INSIGHTWEB_ names;
 * the option values already saved (insightweb_numbers, insightweb_keys, RankWeb's aw_seo_settings, the old shared vault)
 * use the earlier names with this one prefix, which stay as they are so nothing is migrated.
 *
 * @param string $name An INSIGHTWEB_ name.
 */
function insightweb_stored_name( string $name ): string {
	return 0 === strpos( $name, 'INSIGHTWEB_' ) ? 'AW_' . substr( $name, 11 ) : $name;
}

/**
 * The INSIGHTWEB_ name of a stored one (other names stay as they are).
 *
 * @param string $stored A stored name.
 */
function insightweb_public_name( string $stored ): string {
	return 0 === strpos( $stored, 'AW_' ) ? 'INSIGHTWEB_' . substr( $stored, 3 ) : $stored;
}

/**
 * An array with its keys turned into stored names, or back.
 *
 * @param array $values Name => value.
 * @param bool  $stored True: INSIGHTWEB_ keys become stored names; false: stored keys become INSIGHTWEB_ names.
 */
function insightweb_map_names( array $values, bool $stored ): array {
	$out = array();
	foreach ( $values as $k => $v ) {
		$out[ is_string( $k ) ? ( $stored ? insightweb_stored_name( $k ) : insightweb_public_name( $k ) ) : $k ] = $v;
	}
	return $out;
}
