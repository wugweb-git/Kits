<?php
/**
 * Search Insights' seven numbers and its API rule, as they were in RankWeb (moved 11 Nov 2026, docs/plugins/insightweb-plan.md).
 *
 * Only values that differ from the default are stored. Where: while RankWeb is active, in its option aw_seo_settings,
 * key 'search-insights', as before (RankWeb's export carries it); without RankWeb, in InsightWeb's own option
 * insightweb_numbers (since 1.1.4: InsightWeb no longer writes to another plugin's option unless that plugin is active).
 * Values already in the old key are still read when the own option has not been written yet. The constants are defined
 * here from the stored numbers, with the same defaults. The Settings screen writes only through
 * insightweb_si_settings_save().
 *
 * @package insightweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The settings numbers: constant => [label, help, default]. As RankWeb's module list had them. */
function insightweb_si_setting_fields(): array {
	return array(
		'AW_SI_HIGH_TRENDS'       => array(
			'label'   => 'High demand: Trends at least',
			'help'    => '',
			'default' => 20,
		),
		'AW_SI_HIGH_IMPR'         => array(
			'label'   => 'High demand: impressions in 28 days at least',
			'help'    => '',
			'default' => 50,
		),
		'AW_SI_QUICK_MIN'         => array(
			'label'   => 'Quick win: impressions at least',
			'help'    => 'At position 8 to 20.',
			'default' => 10,
		),
		'AW_SI_MOVERS'            => array(
			'label'   => 'Listing names shown one by one',
			'help'    => 'The rest are one "entity" row.',
			'default' => 20,
		),
		'AW_SI_PSI_FLAG'          => array(
			'label'   => 'PageSpeed mobile score that flags a page (under)',
			'help'    => '',
			'default' => 50,
		),
		'AW_SI_RM_LOW'            => array(
			'label'   => 'Rank Math SEO score that is "low" (under)',
			'help'    => '',
			'default' => 50,
		),
		'AW_SI_KEEP_DAYS'         => array(
			'label'   => 'Daily figures kept (days)',
			'help'    => 'Older days become monthly totals.',
			'default' => 90,
		),
		'AW_SI_SOURCING_PUSH_MIN' => array(
			'label'   => 'Score to offer a keyword to SourceWeb (at least)',
			'help'    => 'A sourcing candidate scoring this high is offered to SourceWeb as a suggestion.',
			'default' => 70,
		),
	);
}

const INSIGHTWEB_NUMBERS_OPTION = 'insightweb_numbers'; // the numbers when RankWeb is not active.

/** Whether the numbers live in RankWeb's option: only while RankWeb is active. */
function insightweb_si_numbers_in_rankweb(): bool {
	return (bool) apply_filters( 'insightweb_numbers_in_rankweb_option', defined( 'RANKWEB_VERSION' ) );
}

/** The saved numbers (only those that differ from the default; the key may also hold RankWeb's old switch, 'on'). */
function insightweb_si_settings_saved(): array {
	if ( ! insightweb_si_numbers_in_rankweb() ) {
		$own = get_option( INSIGHTWEB_NUMBERS_OPTION, null );
		if ( is_array( $own ) ) {
			return $own;
		}
	}
	$all = (array) get_option( 'aw_seo_settings', array() ); // read only here when RankWeb is not active: values an earlier version stored.
	return (array) ( $all['search-insights'] ?? array() );
}

// The constants, from the saved numbers or the defaults (in a function, so no loop variable is left in the global scope).
function insightweb_si_define_constants(): void {
	$saved = insightweb_si_settings_saved();
	foreach ( insightweb_si_setting_fields() as $name => $field ) {
		if ( ! defined( $name ) ) {
			define( $name, array_key_exists( $name, $saved ) ? $saved[ $name ] : $field['default'] ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.VariableConstantNameFound -- the names come from the fixed list in insightweb_si_setting_fields() (the AW_SI_ settings constants other code reads).
		}
	}
}
insightweb_si_define_constants();

/** Whether the current request may use the Search Insights APIs: administrators, or the workers' user (sourceweb_worker). */
function insightweb_si_api_allowed() {
	return current_user_can( 'manage_options' ) || current_user_can( 'aw_worker' );
}

/**
 * Save the numbers. The Settings screen's route and the admin-post action aw_si_settings both come here.
 * - Only values that differ from the default are stored, so a later default change reaches unchanged fields.
 * - A field not sent keeps its stored value.
 * - Nothing is written when nothing changed (the stored values compared, whatever their order).
 *
 * @param array $posted const => number as sent (strings or integers).
 * @param bool  $reset  Restore defaults: every number goes back to its default.
 * @return bool Whether the option was written.
 */
function insightweb_si_settings_save( array $posted, bool $reset = false ): bool {
	$rank = insightweb_si_numbers_in_rankweb();
	$all  = $rank ? (array) get_option( 'aw_seo_settings', array() ) : array(); // RankWeb's option (only while RankWeb is active): every other key stays as it is.
	$had  = insightweb_si_settings_saved();
	$mine = $had;
	foreach ( insightweb_si_setting_fields() as $const => $f ) {
		if ( $reset ) {
			unset( $mine[ $const ] ); // Back to the default.
			continue;
		}
		if ( ! array_key_exists( $const, $posted ) ) {
			continue; // Field not sent: its stored value stays.
		}
		$value = max( 0, (int) $posted[ $const ] );
		if ( $value === $f['default'] ) {
			unset( $mine[ $const ] ); // Equal to the default: never stored, so a later default change is followed, even if a stale value equal to the default was stored before.
		} else {
			$mine[ $const ] = $value;
		}
	}
	$a = $mine;
	$b = $had;
	ksort( $a );
	ksort( $b );
	if ( $a === $b ) {
		return false;
	}
	if ( ! $rank ) {
		update_option( INSIGHTWEB_NUMBERS_OPTION, $mine, true ); // an empty array is kept, so the old key is not read again after Restore defaults.
		return true;
	}
	if ( $mine ) {
		$all['search-insights'] = $mine;
	} else {
		unset( $all['search-insights'] );
	}
	update_option( 'aw_seo_settings', $all, true ); // read on every request (the constants), so autoloaded.
	return true;
}

add_action(
	'admin_post_aw_si_settings',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed.', 403 );
		}
		check_admin_referer( 'aw_si_settings' );
		$reset  = isset( $_POST['reset'] );
		$posted = (array) wp_unslash( $_POST['f'] ?? array() ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- each known field is read as an integer in insightweb_si_settings_save().
		// The form sends every field; one it leaves out goes back to its default, as before.
		foreach ( insightweb_si_setting_fields() as $const => $f ) {
			if ( ! isset( $posted[ $const ] ) ) {
				$posted[ $const ] = $f['default'];
			}
		}
		insightweb_si_settings_save( $posted, $reset );
		wp_safe_redirect( add_query_arg( 'saved', $reset ? 'reset' : 'saved', insightweb_si_url( 'settings' ) ) );
		exit;
	}
);

/* ---------- The options, registered with the Settings API ---------- */

const INSIGHTWEB_DELETE_DATA = 'insightweb_delete_data'; // 1: uninstall.php deletes InsightWeb's own data. Default 0: it keeps everything.

/**
 * Every option the InsightWeb Settings screen saves, as register_setting() arguments. The names and stored shapes are
 * the ones used before (no migration); the default is what the code reads when the option is missing.
 */
function insightweb_registered_settings(): array {
	return array(
		'aw_si_gdelt_on'       => array(
			'type'              => 'boolean',
			'description'       => 'Use GDELT for Rising.',
			'default'           => false,
			'sanitize_callback' => fn( $v ) => rest_sanitize_boolean( $v ) ? 1 : 0,
			'show_in_rest'      => array( 'schema' => array( 'type' => 'boolean' ) ),
		),
		'aw_si_tool_seeds'     => array(
			'type'              => 'string',
			'description'       => 'Seeds for keyword tools, one search per line.',
			'default'           => '',
			'sanitize_callback' => fn( $v ) => function_exists( 'insightweb_si_tool_seeds_clean' ) ? insightweb_si_tool_seeds_clean( sanitize_textarea_field( (string) $v ) ) : sanitize_textarea_field( (string) $v ),
			'show_in_rest'      => array( 'schema' => array( 'type' => 'string' ) ),
		),
		INSIGHTWEB_DELETE_DATA => array(
			'type'              => 'boolean',
			'description'       => 'Delete InsightWeb\'s own data when the plugin is deleted.',
			'default'           => false,
			'sanitize_callback' => fn( $v ) => rest_sanitize_boolean( $v ) ? 1 : 0,
			'show_in_rest'      => array( 'schema' => array( 'type' => 'boolean' ) ),
		),
	);
}

add_action(
	'init',
	function () {
		foreach ( insightweb_registered_settings() as $name => $args ) {
			register_setting( 'insightweb', $name, $args );
		}
	}
);

// The seven numbers live in RankWeb's option while RankWeb is active, and RankWeb registers that option itself.
// Without RankWeb they are in insightweb_numbers (insightweb_si_settings_save()), which the Settings screen reaches
// through its own route, so InsightWeb registers nothing for another plugin's option.

/** Whether InsightWeb's data goes when the plugin is deleted (Settings → Numbers → Keeping data). */
function insightweb_delete_data_on(): bool {
	return (bool) get_option( INSIGHTWEB_DELETE_DATA, 0 );
}

/**
 * Save "Delete this plugin's data when it is deleted". Nothing is written when it is already so.
 *
 * @param bool $on On.
 * @return bool Whether the option was written.
 */
function insightweb_delete_data_save( bool $on ): bool {
	if ( insightweb_delete_data_on() === $on ) {
		return false;
	}
	update_option( INSIGHTWEB_DELETE_DATA, $on ? 1 : 0, false );
	return true;
}
