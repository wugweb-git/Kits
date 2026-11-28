<?php
/**
 * SourceWeb without Kits Core, part three (0.3.0): Keywords, Rules, Places and Workers as plain WordPress admin screens
 * drawn on the server. The helpers (addresses, notices, the guard, lists) are in sourceweb-standalone-screens.php.
 *
 * What each screen edits is what the shell screen edits, through the same functions: the relevance switches and keyword
 * lists, the Press settings, the keyword table (when InsightWeb has made it), the domain trust list, tag rules, section
 * rules, excluded feed tags, the places routes and enhancements, and the planned workers. What cannot exist without
 * Kits Core or another plugin is said on the screen in plain words and listed in PENDING.md.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The capability of the settings screens. */
function sourceweb_sa_cap(): string {
	return defined( 'SOURCEWEB_SRC_CAP' ) ? SOURCEWEB_SRC_CAP : 'manage_options';
}

/**
 * A posted value, unslashed and sanitized as text.
 *
 * @param string $key Key in $_POST.
 */
function sourceweb_sa_post_text( string $key ): string {
	return isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( (string) $_POST[ $key ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- every handler calls sourceweb_sa_guard() first.
}

/**
 * A posted multi-line value, unslashed and sanitized (new lines kept).
 *
 * @param string $key Key in $_POST.
 */
function sourceweb_sa_post_lines( string $key ): string {
	return isset( $_POST[ $key ] ) ? sanitize_textarea_field( wp_unslash( (string) $_POST[ $key ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- every handler calls sourceweb_sa_guard() first.
}

/* ============================== Keywords ============================== */

/** The four keyword lists: key => label. */
function sourceweb_sa_kw_list_defs(): array {
	return array(
		'strong'  => __( 'Include', 'sourceweb' ),
		'animal'  => __( 'Topic', 'sourceweb' ),
		'context' => __( 'Context', 'sourceweb' ),
		'exclude' => __( 'Exclude', 'sourceweb' ), // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- needed here and bounded; see the surrounding code.
	);
}

/** Whether the keyword table (InsightWeb's) is the live store. */
function sourceweb_sa_kw_table(): bool {
	return function_exists( 'sourceweb_sourcing_kw_on' ) && sourceweb_sourcing_kw_on();
}

/**
 * Keywords: the keyword check's switches, the words (the four lists, or the keyword table when InsightWeb has made it),
 * the Press settings and a headline test.
 */
function sourceweb_sa_screen_keywords(): void {
	$table = sourceweb_sa_kw_table();
	$rel   = sourceweb_relevance();
	$cfg   = (array) sourceweb_sources_config();
	$press = (array) ( $cfg['press'] ?? array() );

	echo '<p>' . esc_html__( 'The words the workers and this site use to decide whether an item is about your subject. An item is kept when it has an Include word, or a Topic word together with a Context word, and no Exclude word. Exclude words always apply.', 'sourceweb' ) . '</p>';

	echo '<h2>' . esc_html__( 'The check', 'sourceweb' ) . '</h2>';
	sourceweb_sa_form( 'sourceweb_sa_kw_switches' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row">' . esc_html__( 'Keyword check', 'sourceweb' ) . '</th><td><label><input type="checkbox" name="enabled" value="1"' . checked( ! empty( $rel['enabled'] ), true, false ) . '> ' . esc_html__( 'Refuse items that fail the check (off: every item arrives, except those with an Exclude word)', 'sourceweb' ) . '</label></td></tr>';
	echo '<tr><th scope="row">' . esc_html__( 'Aggregators', 'sourceweb' ) . '</th><td><label><input type="checkbox" name="gnews_allow_only" value="1"' . checked( ! empty( $rel['gnews_allow_only'] ), true, false ) . '> ' . esc_html__( 'From aggregator feeds (Google News and the like) accept only publishers marked Allowed (Rules → Domain trust)', 'sourceweb' ) . '</label></td></tr>';
	echo '</tbody></table>';
	submit_button( __( 'Save the check', 'sourceweb' ), 'secondary' );
	echo '</form>';

	echo '<h2>' . esc_html__( 'Keywords', 'sourceweb' ) . '</h2>';
	if ( $table ) {
		sourceweb_sa_kw_table_part();
	} else {
		sourceweb_sa_kw_lists_part( $rel );
	}

	echo '<h2>' . esc_html__( 'Press coverage', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'The workers look weekly for press coverage of your organisation using these queries (Google News and Google Search).', 'sourceweb' ) . '</p>';
	sourceweb_sa_form( 'sourceweb_sa_kw_press' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row">' . esc_html__( 'Press discovery', 'sourceweb' ) . '</th><td><label><input type="checkbox" name="enabled" value="1"' . checked( ! empty( $press['enabled'] ), true, false ) . '> ' . esc_html__( 'On', 'sourceweb' ) . '</label></td></tr>';
	echo '<tr><th scope="row"><label for="sw_press_days">' . esc_html__( 'Look every (days)', 'sourceweb' ) . '</label></th><td><input type="number" id="sw_press_days" name="every_days" min="1" max="60" value="' . esc_attr( (string) (int) ( $press['every_days'] ?? 7 ) ) . '" class="small-text"></td></tr>';
	if ( ! $table ) {
		echo '<tr><th scope="row"><label for="sw_press_q">' . esc_html__( 'Queries', 'sourceweb' ) . '</label></th><td><textarea id="sw_press_q" name="queries" rows="4" class="large-text code">' . esc_textarea( implode( "\n", array_map( 'strval', (array) ( $press['queries'] ?? array() ) ) ) ) . '</textarea><p class="description">' . esc_html__( 'One per line.', 'sourceweb' ) . '</p></td></tr>';
	} else {
		echo '<tr><th scope="row">' . esc_html__( 'Queries', 'sourceweb' ) . '</th><td>' . esc_html__( 'Press queries are keywords with the Press role (in the list above).', 'sourceweb' ) . '</td></tr>';
	}
	echo '</tbody></table>';
	submit_button( __( 'Save press settings', 'sourceweb' ), 'secondary' );
	echo '</form>';

	echo '<h2>' . esc_html__( 'Test a headline', 'sourceweb' ) . '</h2>';
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- a read-only test: nothing is saved.
	$text = isset( $_GET['sw_test'] ) ? sanitize_text_field( wp_unslash( $_GET['sw_test'] ) ) : '';
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	echo '<form method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '">';
	foreach ( sourceweb_sa_args( 'keywords' ) as $k => $v ) {
		echo '<input type="hidden" name="' . esc_attr( $k ) . '" value="' . esc_attr( $v ) . '">';
	}
	echo '<p><label for="sw_test" class="screen-reader-text">' . esc_html__( 'A headline', 'sourceweb' ) . '</label><input type="text" id="sw_test" name="sw_test" class="large-text" value="' . esc_attr( $text ) . '" placeholder="' . esc_attr__( 'Paste a headline', 'sourceweb' ) . '"></p>';
	submit_button( __( 'Test', 'sourceweb' ), 'secondary', '', false );
	echo '</form>';
	if ( '' !== $text ) {
		$v = sourceweb_relevance_verdict( $text );
		echo '<p><strong>' . esc_html( $v[0] ? __( 'Kept', 'sourceweb' ) : __( 'Refused', 'sourceweb' ) ) . '</strong>: ' . esc_html( (string) $v[1] ) . '</p>';
	}

	echo '<h2>' . esc_html__( 'Search suggestions', 'sourceweb' ) . '</h2>';
	sourceweb_sa_limit( __( 'Suggested keywords come from the searches people make on your site (Search Insights, part of InsightWeb). They are not shown here: this screen has no search data of its own.', 'sourceweb' ) );
}

/**
 * The four lists as text areas (the keyword table is not there).
 *
 * @param array $rel The relevance option.
 */
function sourceweb_sa_kw_lists_part( array $rel ): void {
	if ( function_exists( 'sourceweb_sourcing_phase' ) && sourceweb_sourcing_phase() >= 2 ) {
		sourceweb_sa_limit( __( 'These lists were moved to a keyword table by InsightWeb. InsightWeb is not active, so the saved lists below are what is used. If you switch InsightWeb on again, the table is used and rewrites these lists.', 'sourceweb' ) );
	}
	sourceweb_sa_form( 'sourceweb_sa_kw_lists' );
	echo '<table class="form-table" role="presentation"><tbody>';
	$help = array(
		'strong'  => __( 'Keeps an item on its own. Each English one is also searched on Google News every run.', 'sourceweb' ),
		'animal'  => __( 'Keeps an item together with a Context word.', 'sourceweb' ),
		'context' => __( 'Keeps an item together with a Topic word.', 'sourceweb' ),
		'exclude' => __( 'Drops an item, whatever else it has.', 'sourceweb' ), // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- needed here and bounded; see the surrounding code.
	);
	foreach ( sourceweb_sa_kw_list_defs() as $k => $label ) {
		echo '<tr><th scope="row"><label for="sw_kw_' . esc_attr( $k ) . '">' . esc_html( $label ) . '</label></th><td><textarea id="sw_kw_' . esc_attr( $k ) . '" name="' . esc_attr( $k ) . '" rows="5" class="large-text code">' . esc_textarea( implode( "\n", array_map( 'strval', (array) ( $rel[ $k ] ?? array() ) ) ) ) . '</textarea><p class="description">' . esc_html( $help[ $k ] ) . ' ' . esc_html__( 'One word or phrase per line; a trailing * matches a prefix.', 'sourceweb' ) . '</p></td></tr>';
	}
	echo '</tbody></table>';
	submit_button( __( 'Save keywords', 'sourceweb' ) );
	echo '</form>';
}

/** The keyword table's list (InsightWeb's table, read and changed through SourceWeb's own functions). */
function sourceweb_sa_kw_table_part(): void {
	$q          = sourceweb_sa_query();
	$res        = sourceweb_sa_data( 'sourceweb_rest_keywords', $q );
	$res['rows'] = (array) ( $res['rows'] ?? array() );
	sourceweb_sa_list(
		'keywords',
		$res,
		array(
			'title' => array( __( 'Keyword', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['title'] ) . ( '' !== (string) $r['langLabel'] ? ' <span class="description">(' . esc_html( (string) $r['langLabel'] ) . ')</span>' : '' ) ),
			'roles' => array( __( 'Roles', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['rolesText'] ) ),
			'cats'  => array( __( 'Categories', 'sourceweb' ), false, static fn( $r ) => esc_html( implode( ', ', array_map( static fn( $c ) => (string) $c['name'], (array) $r['categories'] ) ) ) ),
			'spell' => array( __( 'Other spellings', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['spellings'] ) ),
			'items' => array( __( 'Last 30 days', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['items'] ) ),
			'del'   => array(
				__( 'Actions', 'sourceweb' ),
				false,
				static function ( $r ) {
					ob_start();
					sourceweb_sa_form( 'sourceweb_sa_kw_remove', array( 'id' => (int) $r['id'] ), 'sw-inline' );
					echo '<button type="submit" class="button button-small button-link-delete" onclick="return confirm(' . esc_attr( (string) wp_json_encode( __( 'Remove this keyword from sourcing? Search Insights keeps the record.', 'sourceweb' ) ) ) . ');">' . esc_html__( 'Remove', 'sourceweb' ) . '</button></form>';
					return (string) ob_get_clean();
				},
			),
		),
		$q,
		__( 'Search keywords', 'sourceweb' ),
		__( 'No keywords yet. Add one below.', 'sourceweb' )
	);
	echo '<h3>' . esc_html__( 'Add a keyword', 'sourceweb' ) . '</h3>';
	sourceweb_sa_form( 'sourceweb_sa_kw_add' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="sw_kw_label">' . esc_html__( 'Keyword', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_kw_label" name="label" class="regular-text" required></td></tr>';
	echo '<tr><th scope="row">' . esc_html__( 'Roles', 'sourceweb' ) . '</th><td>';
	foreach ( sourceweb_sourcing_kw_roles() as $bit => $label ) {
		echo '<label style="display:block"><input type="checkbox" name="roles[]" value="' . esc_attr( (string) $bit ) . '"> ' . esc_html( $label ) . ' <span class="description">' . esc_html( (string) ( sourceweb_sourcing_kw_role_help()[ $bit ] ?? '' ) ) . '</span></label>';
	}
	echo '</td></tr>';
	echo '<tr><th scope="row"><label for="sw_kw_lang">' . esc_html__( 'Language', 'sourceweb' ) . '</label></th><td><select id="sw_kw_lang" name="lang"><option value="en">English</option><option value="hi">Hindi</option><option value="hinglish">Hinglish</option></select></td></tr>';
	echo '</tbody></table>';
	submit_button( __( 'Add keyword', 'sourceweb' ) );
	echo '</form>';
}

add_action( 'admin_post_sourceweb_sa_kw_switches', 'sourceweb_sa_handle_kw_switches' );
add_action( 'admin_post_sourceweb_sa_kw_lists', 'sourceweb_sa_handle_kw_lists' );
add_action( 'admin_post_sourceweb_sa_kw_press', 'sourceweb_sa_handle_kw_press' );
add_action( 'admin_post_sourceweb_sa_kw_add', 'sourceweb_sa_handle_kw_add' );
add_action( 'admin_post_sourceweb_sa_kw_remove', 'sourceweb_sa_handle_kw_remove' );

/**
 * Save the two switches.
 *
 * @param bool $enabled          Keyword check on.
 * @param bool $gnews_allow_only Aggregators: allowed publishers only.
 * @return bool Whether anything changed.
 */
function sourceweb_sa_kw_switches_save( bool $enabled, bool $gnews_allow_only ): bool {
	$rel  = sourceweb_relevance();
	$what = array();
	if ( ! empty( $rel['enabled'] ) !== $enabled ) {
		$what[] = 'keyword check ' . ( $enabled ? 'on' : 'off' );
	}
	if ( ! empty( $rel['gnews_allow_only'] ) !== $gnews_allow_only ) {
		$what[] = 'aggregators allowed-only ' . ( $gnews_allow_only ? 'on' : 'off' );
	}
	if ( ! $what ) {
		return false;
	}
	$rel['enabled']          = $enabled;
	$rel['gnews_allow_only'] = $gnews_allow_only;
	update_option( SOURCEWEB_REL_OPTION, $rel );
	sourceweb_src_log( 'keywords', implode( ' · ', $what ) );
	return true;
}

/** The two switches. */
function sourceweb_sa_handle_kw_switches(): void {
	sourceweb_sa_guard( 'sourceweb_sa_kw_switches', sourceweb_sa_cap() );
	$changed = sourceweb_sa_kw_switches_save( '' !== sourceweb_sa_post_text( 'enabled' ), '' !== sourceweb_sa_post_text( 'gnews_allow_only' ) );
	sourceweb_sa_back( 'keywords', $changed ? 'success' : 'info', $changed ? __( 'Saved. The workers use this from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ) );
}

/**
 * Save the four lists. A list whose words did not change is left as it is.
 *
 * @param array $in key (strong, animal, context, exclude) => text, one word per line.
 * @return string[] The labels of the lists that changed.
 */
function sourceweb_sa_kw_lists_save( array $in ): array {
	$rel     = sourceweb_relevance();
	$changed = array();
	$log     = array();
	foreach ( sourceweb_sa_kw_list_defs() as $k => $label ) {
		if ( ! array_key_exists( $k, $in ) ) {
			continue;
		}
		$new = sourceweb_sourcing_lines( $in[ $k ] );
		$old = array_values( array_map( 'strval', (array) ( $rel[ $k ] ?? array() ) ) );
		if ( $new === $old ) {
			continue;
		}
		$rel[ $k ] = $new;
		$changed[] = $label;
		$diff      = sourceweb_src_diff( $label, $old, $new );
		$log[]     = array( 'keywords', '' !== $diff ? $diff : $label . ': reordered', $old, $new );
	}
	if ( $changed ) {
		update_option( SOURCEWEB_REL_OPTION, $rel );
		sourceweb_src_log_many( $log );
	}
	return $changed;
}

/** The four lists. */
function sourceweb_sa_handle_kw_lists(): void {
	sourceweb_sa_guard( 'sourceweb_sa_kw_lists', sourceweb_sa_cap() );
	if ( sourceweb_sa_kw_table() ) {
		sourceweb_sa_back( 'keywords', 'error', __( 'The keyword table is in use: change keywords there, not in the lists.', 'sourceweb' ) );
	}
	$in = array();
	foreach ( array_keys( sourceweb_sa_kw_list_defs() ) as $k ) {
		$in[ $k ] = sourceweb_sa_post_lines( $k );
	}
	$changed = sourceweb_sa_kw_lists_save( $in );
	/* translators: %s: the lists that changed. */
	sourceweb_sa_back( 'keywords', $changed ? 'success' : 'info', $changed ? sprintf( __( 'Saved: %s. The workers use them from their next run.', 'sourceweb' ), implode( ', ', $changed ) ) : __( 'Nothing changed.', 'sourceweb' ) );
}

/**
 * Save the Press settings.
 *
 * @param array $in      enabled (bool), every_days (int, 1 to 60), queries (text, one per line; only without the keyword table).
 * @param bool  $table   The keyword table is the live store (queries are keywords there).
 * @return bool Whether anything changed.
 */
function sourceweb_sa_kw_press_save( array $in, bool $table ): bool {
	$c   = (array) sourceweb_sources_config();
	$old = (array) ( $c['press'] ?? array() );
	$new = $old;
	$new['enabled'] = ! empty( $in['enabled'] );
	$days           = absint( $in['every_days'] ?? 0 );
	if ( $days >= 1 && $days <= 60 ) {
		$new['every_days'] = $days;
	}
	if ( ! $table && array_key_exists( 'queries', $in ) ) {
		$new['queries'] = sourceweb_sourcing_lines( $in['queries'] );
	}
	$log = array();
	foreach ( array( 'enabled' => 'press discovery', 'every_days' => 'press every (days)', 'queries' => 'press queries' ) as $k => $l ) {
		if ( ( $old[ $k ] ?? null ) !== ( $new[ $k ] ?? null ) ) {
			$log[] = array( 'keywords', $l, $old[ $k ] ?? '', $new[ $k ] ?? '' );
		}
	}
	if ( ! $log ) {
		return false;
	}
	$c['press'] = $new;
	update_option( 'aw_sources', $c, false );
	sourceweb_src_log_many( $log );
	return true;
}

/** The Press settings. */
function sourceweb_sa_handle_kw_press(): void {
	sourceweb_sa_guard( 'sourceweb_sa_kw_press', sourceweb_sa_cap() );
	$changed = sourceweb_sa_kw_press_save(
		array(
			'enabled'    => '' !== sourceweb_sa_post_text( 'enabled' ),
			'every_days' => sourceweb_sa_post_text( 'every_days' ),
			'queries'    => sourceweb_sa_post_lines( 'queries' ),
		),
		sourceweb_sa_kw_table()
	);
	sourceweb_sa_back( 'keywords', $changed ? 'success' : 'info', $changed ? __( 'Saved. The workers use this from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ) );
}

/** Add a keyword to the keyword table. */
function sourceweb_sa_handle_kw_add(): void {
	sourceweb_sa_guard( 'sourceweb_sa_kw_add', sourceweb_sa_cap() );
	if ( ! sourceweb_sa_kw_table() ) {
		sourceweb_sa_back( 'keywords', 'error', __( 'There is no keyword table on this site; use the lists.', 'sourceweb' ) );
	}
	$roles = isset( $_POST['roles'] ) ? array_map( 'absint', (array) wp_unslash( $_POST['roles'] ) ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- checked by sourceweb_sa_guard(); each value is made a whole number.
	$bits  = sourceweb_sourcing_kw_bits( $roles );
	if ( ! $bits ) {
		sourceweb_sa_back( 'keywords', 'error', __( 'Choose at least one role.', 'sourceweb' ) );
	}
	$lang = sourceweb_sa_post_text( 'lang' );
	$lang = in_array( $lang, array( 'en', 'hi', 'hinglish' ), true ) ? $lang : 'en';
	$r    = sourceweb_sourcing_kw_add( sourceweb_sa_post_text( 'label' ), array( 'roles' => $bits, 'lang' => $lang ) );
	if ( is_wp_error( $r ) ) {
		sourceweb_sa_back( 'keywords', 'error', $r->get_error_message() );
	}
	sourceweb_sa_back( 'keywords', 'success', __( 'Keyword saved. The workers use it from their next run.', 'sourceweb' ) );
}

/** Remove a keyword from sourcing (its Sourcing and Press roles go; the record stays). */
function sourceweb_sa_handle_kw_remove(): void {
	sourceweb_sa_guard( 'sourceweb_sa_kw_remove', sourceweb_sa_cap() );
	$id = isset( $_POST['id'] ) ? absint( wp_unslash( $_POST['id'] ) ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	if ( $id && sourceweb_sa_kw_table() ) {
		list( $n ) = sourceweb_sourcing_kw_bulk( 'delete', array( $id ) );
		sourceweb_sa_back( 'keywords', $n ? 'success' : 'info', $n ? __( 'Keyword removed from sourcing (Search Insights keeps the record).', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ) );
	}
	sourceweb_sa_back( 'keywords', 'info', __( 'Nothing changed.', 'sourceweb' ) );
}

/* ============================== Rules ============================== */

/**
 * Rules: domain trust, feed tags to leave out, tag rules and section rules. Summary rules, the enrichment field rules
 * and the review-queue rules are not here (said on the screen).
 */
function sourceweb_sa_screen_rules(): void {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- which row to open for editing; nothing is saved.
	$edit_tag     = isset( $_GET['sw_tag'] ) ? sanitize_title( wp_unslash( $_GET['sw_tag'] ) ) : '';
	$edit_section = isset( $_GET['sw_section'] ) ? sanitize_key( wp_unslash( $_GET['sw_section'] ) ) : '';
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	echo '<p>' . esc_html__( 'The rules the workers and this site follow when an item arrives. Every change is in the Change log with its value before and after.', 'sourceweb' ) . '</p>';

	sourceweb_sa_rules_domains();
	sourceweb_sa_rules_excluded();
	sourceweb_sa_rules_tags( $edit_tag );
	sourceweb_sa_rules_sections( $edit_section );

	echo '<h2>' . esc_html__( 'Not on this screen', 'sourceweb' ) . '</h2>';
	sourceweb_sa_limit( __( 'Summary rules (length and wording of summaries), the Directory enrichment field rules and trust order, and the review-queue rules for enrichment values are set on the Kits shell and need Kits Core. The workers use their built-in defaults for these until then.', 'sourceweb' ) );
}

/** Domain trust: the publishers marked Allowed or Blocked by hand. */
function sourceweb_sa_rules_domains(): void {
	$rows = function_exists( 'sourceweb_rules_domain_overrides' ) ? sourceweb_rules_domain_overrides() : array();
	echo '<h2>' . esc_html__( 'Domain trust', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Allow a publisher (its items skip the keyword check), leave it neutral (items wait for review), or block it (its items are refused on arrival).', 'sourceweb' ) . '</p>';
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Domain', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Name', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Policy', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Last item', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Actions', 'sourceweb' ) . '</th></tr></thead><tbody>';
	if ( ! $rows ) {
		echo '<tr><td colspan="5">' . esc_html__( 'No publisher has been allowed or blocked by hand yet.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( $rows as $host => $r ) {
		echo '<tr><td><strong>' . esc_html( (string) $host ) . '</strong></td><td>' . esc_html( (string) $r['name'] ) . '</td><td>' . esc_html( (string) ( SOURCEWEB_DOMAIN_TRUST_STATUSES[ $r['status'] ] ?? $r['status'] ) ) . '</td><td>' . esc_html( '' !== (string) $r['last'] ? (string) $r['last'] : '–' ) . '</td><td>';
		sourceweb_sa_form( 'sourceweb_sa_rules_domain_reset', array( 'host' => (string) $host ), 'sw-inline' );
		echo '<button type="submit" class="button button-small button-link-delete">' . esc_html__( 'Reset to neutral', 'sourceweb' ) . '</button></form></td></tr>';
	}
	echo '</tbody></table>';
	sourceweb_sa_form( 'sourceweb_sa_rules_domain' );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="sw_dom_host">' . esc_html__( 'Domain', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_dom_host" name="host" class="regular-text" placeholder="example.com" required></td></tr>';
	echo '<tr><th scope="row"><label for="sw_dom_status">' . esc_html__( 'Policy', 'sourceweb' ) . '</label></th><td><select id="sw_dom_status" name="status">';
	foreach ( SOURCEWEB_DOMAIN_TRUST_STATUSES as $k => $l ) {
		echo '<option value="' . esc_attr( $k ) . '">' . esc_html( $l ) . '</option>';
	}
	echo '</select></td></tr>';
	echo '<tr><th scope="row"><label for="sw_dom_name">' . esc_html__( 'Name (optional)', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_dom_name" name="name" class="regular-text"></td></tr>';
	echo '</tbody></table>';
	submit_button( __( 'Save domain', 'sourceweb' ), 'secondary' );
	echo '</form>';
}

/** Feed categories and tags to leave out. */
function sourceweb_sa_rules_excluded(): void {
	$tags = function_exists( 'sourceweb_rules_feed_excluded_tags' ) ? sourceweb_rules_feed_excluded_tags() : array();
	echo '<h2>' . esc_html__( 'Feed tags to leave out', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Category or tag slugs. A feed item that carries one of them is held for review instead of being published.', 'sourceweb' ) . '</p>';
	sourceweb_sa_form( 'sourceweb_sa_rules_excluded' );
	echo '<p><label for="sw_excl" class="screen-reader-text">' . esc_html__( 'Slugs to leave out', 'sourceweb' ) . '</label><textarea id="sw_excl" name="excluded_tags" rows="4" class="large-text code" placeholder="politics, gossip, sports">' . esc_textarea( implode( "\n", $tags ) ) . '</textarea></p>';
	echo '<p class="description">' . esc_html__( 'One per line, or separated by commas.', 'sourceweb' ) . '</p>';
	submit_button( __( 'Save', 'sourceweb' ), 'secondary' );
	echo '</form>';
}

/**
 * Tag rules: give an item a tag when its title or text has one of the phrases; hold it for a person when it matches a hold pattern.
 *
 * @param string $edit The rule's tag to put in the form ('' for a new rule).
 */
function sourceweb_sa_rules_tags( string $edit ): void {
	$rules = function_exists( 'sourceweb_rules_tag_rules' ) ? sourceweb_rules_tag_rules() : array();
	$r     = '' !== $edit && isset( $rules[ $edit ] ) ? (array) $rules[ $edit ] : array();
	$edit  = $r ? $edit : '';
	$lines = static fn( $k ) => implode( "\n", array_map( 'strval', (array) ( $r[ $k ] ?? array() ) ) );
	echo '<h2>' . esc_html__( 'Tag rules', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Give an item a tag when its title or text has one of the phrases. An item that also matches a "hold" pattern, and has none of the "unless" words, waits for a person.', 'sourceweb' ) . '</p>';
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Tag', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Any of these phrases', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Hold when', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Unless', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Actions', 'sourceweb' ) . '</th></tr></thead><tbody>';
	if ( ! $rules ) {
		echo '<tr><td colspan="5">' . esc_html__( 'No tag rules yet.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( $rules as $slug => $row ) {
		$slug = (string) $slug;
		echo '<tr><td><code>' . esc_html( urldecode( $slug ) ) . '</code></td><td>' . esc_html( implode( ', ', array_map( 'strval', (array) ( $row['any'] ?? array() ) ) ) ) . '</td><td>' . esc_html( implode( ', ', array_map( 'strval', (array) ( $row['hold'] ?? array() ) ) ) ) . '</td><td>' . esc_html( implode( ', ', array_map( 'strval', (array) ( $row['unless'] ?? array() ) ) ) ) . '</td><td><a class="button button-small" href="' . esc_url( sourceweb_sa_url( 'rules', array( 'sw_tag' => $slug ) ) . '#sw-tag-form' ) . '">' . esc_html__( 'Edit', 'sourceweb' ) . '</a> ';
		sourceweb_sa_form( 'sourceweb_sa_rules_tag_delete', array( 'tag' => $slug ), 'sw-inline' );
		echo '<button type="submit" class="button button-small button-link-delete" onclick="return confirm(' . esc_attr( (string) wp_json_encode( __( 'Delete this tag rule? The tag itself stays.', 'sourceweb' ) ) ) . ');">' . esc_html__( 'Delete', 'sourceweb' ) . '</button></form></td></tr>';
	}
	echo '</tbody></table>';
	echo '<h3 id="sw-tag-form">' . esc_html( '' !== $edit ? __( 'Edit the tag rule', 'sourceweb' ) : __( 'Add a tag rule', 'sourceweb' ) ) . '</h3>';
	sourceweb_sa_form( 'sourceweb_sa_rules_tag', array( 'original' => $edit ) );
	echo '<table class="form-table" role="presentation"><tbody>';
	echo '<tr><th scope="row"><label for="sw_tr_tag">' . esc_html__( 'Tag (slug)', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_tr_tag" name="tag" class="regular-text" list="sw_tr_tags" value="' . esc_attr( $edit ) . '" required><datalist id="sw_tr_tags">';
	foreach ( (array) get_terms( array( 'taxonomy' => 'post_tag', 'hide_empty' => false, 'number' => 300, 'orderby' => 'name' ) ) as $t ) {
		if ( $t instanceof WP_Term ) {
			echo '<option value="' . esc_attr( $t->slug ) . '">' . esc_html( $t->name ) . '</option>';
		}
	}
	echo '</datalist></td></tr>';
	echo '<tr><th scope="row"><label for="sw_tr_any">' . esc_html__( 'Any of these phrases', 'sourceweb' ) . '</label></th><td><textarea id="sw_tr_any" name="any" rows="4" class="large-text code" required>' . esc_textarea( $lines( 'any' ) ) . '</textarea><p class="description">' . esc_html__( 'One per line.', 'sourceweb' ) . '</p></td></tr>';
	echo '<tr><th scope="row"><label for="sw_tr_hold">' . esc_html__( 'Hold when (patterns)', 'sourceweb' ) . '</label></th><td><textarea id="sw_tr_hold" name="hold" rows="3" class="large-text code">' . esc_textarea( $lines( 'hold' ) ) . '</textarea><p class="description">' . esc_html__( 'Regular expressions, one per line. Optional.', 'sourceweb' ) . '</p></td></tr>';
	echo '<tr><th scope="row"><label for="sw_tr_unless">' . esc_html__( 'Unless these words', 'sourceweb' ) . '</label></th><td><textarea id="sw_tr_unless" name="unless" rows="3" class="large-text code">' . esc_textarea( $lines( 'unless' ) ) . '</textarea></td></tr>';
	echo '<tr><th scope="row"><label for="sw_tr_reason">' . esc_html__( 'Hold reason', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_tr_reason" name="hold_reason" class="large-text" value="' . esc_attr( (string) ( $r['hold_reason'] ?? '' ) ) . '"></td></tr>';
	echo '</tbody></table>';
	submit_button( '' !== $edit ? __( 'Save tag rule', 'sourceweb' ) : __( 'Add tag rule', 'sourceweb' ) );
	echo '</form>';
}

/**
 * Section rules: which categories and tags each section (content type) may use.
 *
 * @param string $edit The section to open for editing ('' none).
 */
function sourceweb_sa_rules_sections( string $edit ): void {
	$secs   = function_exists( 'sourceweb_rules_sections' ) ? sourceweb_rules_sections( true ) : array();
	$stored = (array) ( sourceweb_sources_config()['sections'] ?? array() );
	echo '<h2>' . esc_html__( 'Section rules', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Which categories and tags the workers may file each kind of item under. A section with no category ticked uses every category.', 'sourceweb' ) . '</p>';
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Section', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Categories', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Tags', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Actions', 'sourceweb' ) . '</th></tr></thead><tbody>';
	if ( ! $secs ) {
		echo '<tr><td colspan="4">' . esc_html__( 'This site has no content types for sourced items yet.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( $secs as $type => $def ) {
		$cats = array_values( (array) ( $stored[ $type ]['categories'] ?? array() ) );
		$tags = array_values( (array) ( $stored[ $type ]['tags'] ?? array() ) );
		echo '<tr><td>' . esc_html( (string) $def['label'] ) . '</td><td>' . esc_html( $cats ? implode( ', ', sourceweb_rules_names( $cats, 'category' ) ) : __( 'Every category', 'sourceweb' ) ) . '</td><td>' . esc_html( $tags ? implode( ', ', sourceweb_rules_names( $tags, 'post_tag' ) ) : '—' ) . '</td><td><a class="button button-small" href="' . esc_url( sourceweb_sa_url( 'rules', array( 'sw_section' => (string) $type ) ) . '#sw-section-form' ) . '">' . esc_html__( 'Edit', 'sourceweb' ) . '</a></td></tr>';
	}
	echo '</tbody></table>';
	if ( '' === $edit || ! isset( $secs[ $edit ] ) ) {
		return;
	}
	$sec  = (array) ( $stored[ $edit ] ?? array() );
	$have = array(
		'categories' => array_map( 'strval', (array) ( $sec['categories'] ?? array() ) ),
		'tags'       => array_map( 'strval', (array) ( $sec['tags'] ?? array() ) ),
	);
	/* translators: %s: section name. */
	echo '<h3 id="sw-section-form">' . esc_html( sprintf( __( 'Section: %s', 'sourceweb' ), (string) $secs[ $edit ]['label'] ) ) . '</h3>';
	sourceweb_sa_form( 'sourceweb_sa_rules_section', array( 'type' => $edit ) );
	foreach ( array( 'categories' => 'category', 'tags' => 'post_tag' ) as $key => $tax ) {
		$terms = get_terms( array( 'taxonomy' => $tax, 'hide_empty' => false, 'orderby' => 'name', 'number' => 500 ) );
		$terms = is_array( $terms ) ? $terms : array();
		$slugs = array();
		foreach ( $terms as $t ) {
			$slugs[ $t->slug ] = $t->name;
		}
		foreach ( $have[ $key ] as $slug ) { // a ticked slug past the 500 shown, or with no term, still shows
			if ( ! isset( $slugs[ $slug ] ) ) {
				$t             = get_term_by( 'slug', $slug, $tax );
				$slugs[ $slug ] = $t ? $t->name : urldecode( $slug ) . ' (' . __( 'no such term', 'sourceweb' ) . ')';
				if ( ! $t ) {
					echo '<input type="hidden" name="' . esc_attr( 'gone_' . $key ) . '[]" value="' . esc_attr( $slug ) . '">';
				}
			}
		}
		echo '<fieldset><legend><strong>' . esc_html( 'categories' === $key ? __( 'Categories', 'sourceweb' ) : __( 'Tags', 'sourceweb' ) ) . '</strong></legend><div style="max-height:220px;overflow:auto;border:1px solid #c3c4c7;padding:8px;background:#fff">';
		if ( ! $slugs ) {
			echo '<span class="description">' . esc_html__( 'None yet.', 'sourceweb' ) . '</span>';
		}
		foreach ( $slugs as $slug => $name ) {
			$term = get_term_by( 'slug', (string) $slug, $tax );
			if ( ! $term ) {
				continue; // a slug with no term travels in the hidden field above
			}
			echo '<label style="display:block"><input type="checkbox" name="' . esc_attr( $key ) . '[]" value="' . esc_attr( (string) $term->term_id ) . '"' . checked( in_array( (string) $slug, $have[ $key ], true ), true, false ) . '> ' . esc_html( (string) $name ) . '</label>';
		}
		echo '</div></fieldset>';
	}
	submit_button( __( 'Save section', 'sourceweb' ) );
	echo '</form>';
}

add_action( 'admin_post_sourceweb_sa_rules_domain', 'sourceweb_sa_handle_rules_domain' );
add_action( 'admin_post_sourceweb_sa_rules_domain_reset', 'sourceweb_sa_handle_rules_domain_reset' );
add_action( 'admin_post_sourceweb_sa_rules_excluded', 'sourceweb_sa_handle_rules_excluded' );
add_action( 'admin_post_sourceweb_sa_rules_tag', 'sourceweb_sa_handle_rules_tag' );
add_action( 'admin_post_sourceweb_sa_rules_tag_delete', 'sourceweb_sa_handle_rules_tag_delete' );
add_action( 'admin_post_sourceweb_sa_rules_section', 'sourceweb_sa_handle_rules_section' );

/** Save a domain's policy. */
function sourceweb_sa_handle_rules_domain(): void {
	sourceweb_sa_guard( 'sourceweb_sa_rules_domain', sourceweb_sa_cap() );
	$status = sanitize_key( sourceweb_sa_post_text( 'status' ) );
	$ok     = sourceweb_rules_domain_override_save( sourceweb_sa_post_text( 'host' ), $status, sourceweb_sa_post_text( 'name' ) );
	sourceweb_sa_back( 'rules', $ok ? 'success' : 'error', $ok ? __( 'Domain saved.', 'sourceweb' ) : __( 'Not saved: give a domain and a policy.', 'sourceweb' ) );
}

/** Put a domain back to neutral. */
function sourceweb_sa_handle_rules_domain_reset(): void {
	sourceweb_sa_guard( 'sourceweb_sa_rules_domain_reset', sourceweb_sa_cap() );
	$ok = sourceweb_rules_domain_override_delete( sourceweb_sa_post_text( 'host' ) );
	sourceweb_sa_back( 'rules', $ok ? 'success' : 'info', $ok ? __( 'Domain put back to neutral.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ) );
}

/**
 * Slugs from a posted list (one per line or separated by commas).
 *
 * @param string $text The text.
 * @return string[]
 */
function sourceweb_sa_slugs( string $text ): array {
	return array_values( array_unique( array_filter( array_map( 'sanitize_title', (array) preg_split( '/[\r\n,]+/', $text, -1, PREG_SPLIT_NO_EMPTY ) ) ) ) );
}

/** Save the feed tags to leave out. */
function sourceweb_sa_handle_rules_excluded(): void {
	sourceweb_sa_guard( 'sourceweb_sa_rules_excluded', sourceweb_sa_cap() );
	$new = sourceweb_sa_slugs( sourceweb_sa_post_lines( 'excluded_tags' ) );
	if ( $new === sourceweb_rules_feed_excluded_tags() ) {
		sourceweb_sa_back( 'rules', 'info', __( 'Nothing changed.', 'sourceweb' ) );
	}
	sourceweb_rules_feed_excluded_tags_save( $new );
	sourceweb_sa_back( 'rules', 'success', __( 'Saved. The workers use this from their next run.', 'sourceweb' ) );
}

/** Add or change a tag rule. */
function sourceweb_sa_handle_rules_tag(): void {
	sourceweb_sa_guard( 'sourceweb_sa_rules_tag', sourceweb_sa_cap() );
	$res = sourceweb_rules_tag_save(
		sanitize_title( sourceweb_sa_post_text( 'tag' ) ),
		sanitize_title( sourceweb_sa_post_text( 'original' ) ),
		array(
			'any'         => sourceweb_sa_post_lines( 'any' ),
			'hold'        => sourceweb_sa_post_lines( 'hold' ),
			'unless'      => sourceweb_sa_post_lines( 'unless' ),
			'hold_reason' => sourceweb_sa_post_text( 'hold_reason' ),
		)
	);
	list( $tone, $text ) = sourceweb_rules_message( (string) $res[0], (string) $res[1] );
	sourceweb_sa_back( 'rules', 'warn' === $tone ? 'warning' : $tone, $text );
}

/** Delete a tag rule. */
function sourceweb_sa_handle_rules_tag_delete(): void {
	sourceweb_sa_guard( 'sourceweb_sa_rules_tag_delete', sourceweb_sa_cap() );
	$res = sourceweb_rules_tag_delete( sanitize_title( sourceweb_sa_post_text( 'tag' ) ) );
	list( $tone, $text ) = sourceweb_rules_message( (string) $res[0], (string) $res[1] );
	sourceweb_sa_back( 'rules', $tone, $text );
}

/** Save one section's categories and tags. */
function sourceweb_sa_handle_rules_section(): void {
	sourceweb_sa_guard( 'sourceweb_sa_rules_section', sourceweb_sa_cap() );
	$type = sanitize_key( sourceweb_sa_post_text( 'type' ) );
	if ( ! isset( sourceweb_rules_sections( true )[ $type ] ) ) {
		sourceweb_sa_back( 'rules', 'error', __( 'No such section.', 'sourceweb' ) );
	}
	$ids  = static fn( string $k ): array => isset( $_POST[ $k ] ) ? array_map( 'absint', (array) wp_unslash( $_POST[ $k ] ) ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- checked by sourceweb_sa_guard(); whole numbers.
	$gone = static fn( string $k ): array => isset( $_POST[ $k ] ) ? array_map( 'sanitize_title', array_map( 'strval', (array) wp_unslash( $_POST[ $k ] ) ) ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- checked by sourceweb_sa_guard(); each is sanitized as a slug.
	$done = sourceweb_sourcing_section_save(
		$type,
		array(
			'categories' => $ids( 'categories' ),
			'tags'       => $ids( 'tags' ),
		),
		array(
			'categories' => $gone( 'gone_categories' ),
			'tags'       => $gone( 'gone_tags' ),
		)
	);
	sourceweb_sa_back( 'rules', 'saved' === $done ? 'success' : 'info', 'saved' === $done ? __( 'Section saved. The workers use it from their next run.', 'sourceweb' ) : __( 'Nothing changed.', 'sourceweb' ) );
}

/* ============================== Places ============================== */

/**
 * Places: where an item goes. The routes are tried top to bottom and the first whose test matches wins; an item that
 * matches none goes to the place of its own type, as it always did.
 */
function sourceweb_sa_screen_places(): void {
	$d      = sourceweb_places_screen();
	$places = sourceweb_places();
	$kinds  = array(
		'content_type' => __( 'Content type', 'sourceweb' ),
		'plugin'       => __( 'Plugin', 'sourceweb' ),
		'workflow'     => __( 'Workflow', 'sourceweb' ),
		'other'        => __( 'Other', 'sourceweb' ),
	);
	$ops    = array(
		'always'   => __( 'Always', 'sourceweb' ),
		'eq'       => __( 'is exactly', 'sourceweb' ),
		'contains' => __( 'contains', 'sourceweb' ),
		'in'       => __( 'is one of', 'sourceweb' ),
		'has'      => __( 'is not empty', 'sourceweb' ),
	);
	echo '<p>' . esc_html__( 'Where an item goes when it arrives. The routes are tried from the top and the first whose test matches wins. An item that matches none goes to the content type of its own type, as it always did.', 'sourceweb' ) . '</p>';

	echo '<h2>' . esc_html__( 'Routes', 'sourceweb' ) . '</h2>';
	sourceweb_sa_form( 'sourceweb_sa_places_routes' );
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Order', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'When the item\'s', 'sourceweb' ) . '</th><th scope="col"></th><th scope="col">' . esc_html__( 'Value', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Goes to', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Remove', 'sourceweb' ) . '</th></tr></thead><tbody>';
	$rows = (array) $d['routes'];
	$n    = count( $rows );
	for ( $i = 0; $i < $n + 2; $i++ ) { // the saved routes, then two blank rows for new ones
		$r      = $rows[ $i ] ?? array( 'op' => 'always', 'field' => '', 'value' => '', 'place' => '', 'keep' => null, 'custom' => '' );
		$new    = $i >= $n;
		$custom = ! $new && null !== $r['keep'];
		echo '<tr>';
		echo '<td><input type="number" class="small-text" min="1" name="route[' . esc_attr( (string) $i ) . '][pos]" value="' . esc_attr( (string) ( $i + 1 ) ) . '" aria-label="' . esc_attr__( 'Order', 'sourceweb' ) . '"><input type="hidden" name="route[' . esc_attr( (string) $i ) . '][orig]" value="' . esc_attr( $new ? '' : (string) $i ) . '"></td>';
		if ( $custom ) {
			echo '<td colspan="3"><input type="hidden" name="route[' . esc_attr( (string) $i ) . '][op]" value="keep"><code>' . esc_html( (string) $r['custom'] ) . '</code> <span class="description">' . esc_html__( 'A test made of several parts: kept as it is.', 'sourceweb' ) . '</span></td>';
		} else {
			echo '<td><select name="route[' . esc_attr( (string) $i ) . '][field]" aria-label="' . esc_attr__( 'Field', 'sourceweb' ) . '"><option value=""></option>';
			foreach ( SOURCEWEB_ROUTE_FIELDS as $f ) {
				echo '<option value="' . esc_attr( $f ) . '"' . selected( (string) $r['field'], $f, false ) . '>' . esc_html( $f ) . '</option>';
			}
			echo '</select></td><td><select name="route[' . esc_attr( (string) $i ) . '][op]" aria-label="' . esc_attr__( 'Test', 'sourceweb' ) . '">';
			foreach ( $ops as $k => $l ) {
				echo '<option value="' . esc_attr( $k ) . '"' . selected( (string) $r['op'], $k, false ) . '>' . esc_html( $l ) . '</option>';
			}
			echo '</select></td><td><input type="text" class="regular-text" name="route[' . esc_attr( (string) $i ) . '][value]" value="' . esc_attr( (string) $r['value'] ) . '" aria-label="' . esc_attr__( 'Value', 'sourceweb' ) . '"></td>';
		}
		echo '<td><select name="route[' . esc_attr( (string) $i ) . '][place]" aria-label="' . esc_attr__( 'Place', 'sourceweb' ) . '"><option value=""></option>';
		foreach ( $places as $p ) {
			echo '<option value="' . esc_attr( (string) $p['id'] ) . '"' . selected( (string) $r['place'], (string) $p['id'], false ) . '>' . esc_html( (string) $p['label'] . ' (' . ( $kinds[ $p['kind'] ] ?? $p['kind'] ) . ')' ) . '</option>';
		}
		echo '</select></td><td>' . ( $new ? '' : '<input type="checkbox" name="route[' . esc_attr( (string) $i ) . '][remove]" value="1" aria-label="' . esc_attr__( 'Remove this route', 'sourceweb' ) . '">' ) . '</td></tr>';
	}
	echo '</tbody></table>';
	echo '<p class="description">' . esc_html__( 'A blank row is ignored. To move a route, change its order number. "is one of" takes values separated by commas.', 'sourceweb' ) . '</p>';
	submit_button( __( 'Save routes', 'sourceweb' ) );
	echo '</form>';

	echo '<h2>' . esc_html__( 'Places', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Every place items can go to, and what is done to an item when it gets there.', 'sourceweb' ) . '</p>';
	$enh = (array) $d['enhancers'];
	sourceweb_sa_form( 'sourceweb_sa_places_enhance' );
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Place', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Kind', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Does this to each item', 'sourceweb' ) . '</th></tr></thead><tbody>';
	foreach ( $places as $p ) {
		echo '<tr><td><strong>' . esc_html( (string) $p['label'] ) . '</strong><br><code>' . esc_html( (string) $p['id'] ) . '</code></td><td>' . esc_html( (string) ( $kinds[ $p['kind'] ] ?? $p['kind'] ) ) . ( '' !== (string) $p['owner'] ? '<br><span class="description">' . esc_html( (string) $p['owner'] ) . '</span>' : '' ) . '</td><td>';
		if ( ! $enh ) {
			echo '<span class="description">' . esc_html__( 'No enhancements are available.', 'sourceweb' ) . '</span>';
		}
		foreach ( $enh as $e ) {
			echo '<label style="display:block"><input type="checkbox" name="enhance[' . esc_attr( (string) $p['id'] ) . '][]" value="' . esc_attr( (string) $e['id'] ) . '"' . checked( in_array( $e['id'], (array) $p['enhance'], true ), true, false ) . '> ' . esc_html( (string) $e['label'] ) . '</label>';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';
	submit_button( __( 'Save enhancements', 'sourceweb' ), 'secondary' );
	echo '</form>';

	echo '<h2>' . esc_html__( 'Add a place', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'A place is where items can go: a content type, another plugin, a workflow or something else. Add one here and it can be chosen in a route above.', 'sourceweb' ) . '</p>';
	sourceweb_sa_form( 'sourceweb_sa_place_add' );
	echo '<table class="form-table" role="presentation"><tr><th scope="row"><label for="sw-place-label">' . esc_html__( 'Name', 'sourceweb' ) . '</label></th><td><input type="text" class="regular-text" id="sw-place-label" name="label" required></td></tr>';
	echo '<tr><th scope="row"><label for="sw-place-id">' . esc_html__( 'Id (optional)', 'sourceweb' ) . '</label></th><td><input type="text" class="regular-text" id="sw-place-id" name="id" pattern="[a-z0-9_-]*"><p class="description">' . esc_html__( 'Lower-case letters, digits, dash and underscore. Left empty, it is made from the name. It cannot be changed later.', 'sourceweb' ) . '</p></td></tr>';
	echo '<tr><th scope="row"><label for="sw-place-kind">' . esc_html__( 'Kind', 'sourceweb' ) . '</label></th><td><select id="sw-place-kind" name="kind">';
	foreach ( $kinds as $k => $l ) {
		echo '<option value="' . esc_attr( $k ) . '">' . esc_html( $l ) . '</option>';
	}
	echo '</select></td></tr>';
	echo '<tr><th scope="row"><label for="sw-place-type">' . esc_html__( 'Content type', 'sourceweb' ) . '</label></th><td><select id="sw-place-type" name="post_type"><option value=""></option>';
	foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $pt ) {
		echo '<option value="' . esc_attr( $pt->name ) . '">' . esc_html( $pt->label . ' (' . $pt->name . ')' ) . '</option>';
	}
	echo '</select><p class="description">' . esc_html__( 'Only for the kind "Content type".', 'sourceweb' ) . '</p></td></tr></table>';
	submit_button( __( 'Add place', 'sourceweb' ), 'secondary' );
	echo '</form>';
	$mine = (array) get_option( SOURCEWEB_CUSTOM_PLACES_OPTION, array() );
	if ( $mine ) {
		echo '<h3>' . esc_html__( 'Places made here', 'sourceweb' ) . '</h3><ul>';
		foreach ( $mine as $p ) {
			echo '<li>';
			sourceweb_sa_form( 'sourceweb_sa_place_remove', array( 'place' => (string) ( $p['id'] ?? '' ) ), 'sw-inline' );
			echo esc_html( (string) ( $p['label'] ?? '' ) ) . ' <code>' . esc_html( (string) ( $p['id'] ?? '' ) ) . '</code> <button type="submit" class="button-link button-link-delete">' . esc_html__( 'Remove', 'sourceweb' ) . '</button></form></li>';
		}
		echo '</ul>';
	}

	echo '<h2>' . esc_html__( 'How each source did', 'sourceweb' ) . '</h2>';
	echo '<p>' . esc_html__( 'Items given to a place, and what the place did with them. A source whose items are mostly rejected is flagged.', 'sourceweb' ) . '</p>';
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'Source', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Delivered', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Accepted', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Rejected', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Accepted share', 'sourceweb' ) . '</th></tr></thead><tbody>';
	if ( ! $d['outcomes'] ) {
		echo '<tr><td colspan="5">' . esc_html__( 'Nothing has been delivered to a place yet.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( (array) $d['outcomes'] as $o ) {
		echo '<tr><td>' . esc_html( (string) $o['source'] ) . ( ! empty( $o['flag'] ) ? ' <strong>(' . esc_html__( 'flagged', 'sourceweb' ) . ')</strong>' : '' ) . '</td><td>' . esc_html( (string) (int) $o['delivered'] ) . '</td><td>' . esc_html( (string) (int) $o['accepted'] ) . '</td><td>' . esc_html( (string) (int) $o['rejected'] ) . '</td><td>' . esc_html( null === $o['rate'] ? '–' : $o['rate'] . '%' ) . '</td></tr>';
	}
	echo '</tbody></table>';
}

add_action( 'admin_post_sourceweb_sa_places_routes', 'sourceweb_sa_handle_places_routes' );
add_action( 'admin_post_sourceweb_sa_places_enhance', 'sourceweb_sa_handle_places_enhance' );

add_action( 'admin_post_sourceweb_sa_place_add', 'sourceweb_sa_handle_place_add' );
add_action( 'admin_post_sourceweb_sa_place_remove', 'sourceweb_sa_handle_place_remove' );

/** Add a place. */
function sourceweb_sa_handle_place_add(): void {
	sourceweb_sa_guard( 'sourceweb_sa_place_add', sourceweb_sa_cap() );
	// phpcs:disable WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	$raw = array(
		'label'     => isset( $_POST['label'] ) ? sanitize_text_field( wp_unslash( $_POST['label'] ) ) : '',
		'id'        => isset( $_POST['id'] ) ? sanitize_text_field( wp_unslash( $_POST['id'] ) ) : '',
		'kind'      => isset( $_POST['kind'] ) ? sanitize_key( wp_unslash( $_POST['kind'] ) ) : '',
		'post_type' => isset( $_POST['post_type'] ) ? sanitize_key( wp_unslash( $_POST['post_type'] ) ) : '',
	);
	// phpcs:enable WordPress.Security.NonceVerification.Missing
	$custom                = array_values( (array) get_option( SOURCEWEB_CUSTOM_PLACES_OPTION, array() ) );
	list( $custom, $why )  = sourceweb_place_add( $custom, $raw, array_keys( sourceweb_places() ) );
	if ( '' !== $why ) {
		sourceweb_sa_back( 'places', 'error', __( 'Not added. ', 'sourceweb' ) . $why );
	}
	update_option( SOURCEWEB_CUSTOM_PLACES_OPTION, $custom, false );
	sourceweb_src_log( 'places', 'place added', '', (string) end( $custom )['id'] );
	sourceweb_sa_back( 'places', 'success', __( 'Place added.', 'sourceweb' ) );
}

/** Remove a place made here. */
function sourceweb_sa_handle_place_remove(): void {
	sourceweb_sa_guard( 'sourceweb_sa_place_remove', sourceweb_sa_cap() );
	$id                   = isset( $_POST['place'] ) ? sanitize_key( wp_unslash( $_POST['place'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	$custom               = array_values( (array) get_option( SOURCEWEB_CUSTOM_PLACES_OPTION, array() ) );
	list( $custom, $why ) = sourceweb_place_remove( $custom, $id, (array) get_option( SOURCEWEB_ROUTES_OPTION, array() ) );
	if ( '' !== $why ) {
		sourceweb_sa_back( 'places', 'error', __( 'Not removed. ', 'sourceweb' ) . $why );
	}
	update_option( SOURCEWEB_CUSTOM_PLACES_OPTION, $custom, false );
	sourceweb_src_log( 'places', 'place removed', $id, '' );
	sourceweb_sa_back( 'places', 'success', __( 'Place removed.', 'sourceweb' ) );
}


/**
 * The route rows a form posted, in the order asked for, ready for sourceweb_routes_from_rows(). A row with no place and
 * no test (a blank new row) or ticked for removal is left out. A route whose test the form cannot show (op "keep")
 * takes its test from the stored route it came from, never from the post.
 *
 * @param array $posted The posted route[] rows.
 * @param array $stored The stored routes (option sourceweb_routes).
 * @return array[] Rows (place, op, field, value, keep).
 */
function sourceweb_sa_routes_from_post( array $posted, array $stored ): array {
	$rows = array();
	$i    = 0;
	foreach ( $posted as $r ) {
		if ( ! is_array( $r ) || ! empty( $r['remove'] ) ) {
			continue;
		}
		$place = sanitize_text_field( (string) ( $r['place'] ?? '' ) );
		$op    = sanitize_key( (string) ( $r['op'] ?? 'always' ) );
		$orig  = isset( $r['orig'] ) && '' !== (string) $r['orig'] ? absint( $r['orig'] ) : -1;
		$row   = array(
			'place' => $place,
			'op'    => $op,
			'field' => sanitize_key( (string) ( $r['field'] ?? '' ) ),
			'value' => sanitize_text_field( (string) ( $r['value'] ?? '' ) ),
		);
		if ( 'keep' === $op ) {
			if ( $orig < 0 || ! isset( $stored[ $orig ]['when'] ) || ! is_array( $stored[ $orig ]['when'] ) ) {
				continue; // nothing stored to keep
			}
			$row['keep'] = $stored[ $orig ]['when'];
		} elseif ( '' === $place && 'always' === $op && '' === $row['field'] && '' === $row['value'] ) {
			continue; // a blank row
		}
		$rows[] = array( 'pos' => is_numeric( $r['pos'] ?? null ) ? (float) $r['pos'] : (float) ( $i + 1 ), 'i' => $i, 'row' => $row );
		++$i;
	}
	usort( $rows, static fn( $a, $b ) => ( $a['pos'] <=> $b['pos'] ) ?: ( $a['i'] <=> $b['i'] ) );
	return array_column( $rows, 'row' );
}

/** Save the routes. */
function sourceweb_sa_handle_places_routes(): void {
	sourceweb_sa_guard( 'sourceweb_sa_places_routes', sourceweb_sa_cap() );
	$posted = isset( $_POST['route'] ) ? (array) wp_unslash( $_POST['route'] ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- checked by sourceweb_sa_guard(); each value is sanitized in sourceweb_sa_routes_from_post().
	$stored = array_values( (array) get_option( SOURCEWEB_ROUTES_OPTION, array() ) );
	$rows   = sourceweb_sa_routes_from_post( $posted, $stored );
	list( $routes, $notes ) = sourceweb_routes_from_rows( $rows, sourceweb_places() );
	if ( $notes ) {
		sourceweb_sa_back( 'places', 'error', __( 'Not saved. ', 'sourceweb' ) . implode( ' ', $notes ) );
	}
	if ( $routes === $stored ) {
		sourceweb_sa_back( 'places', 'info', __( 'Nothing changed.', 'sourceweb' ) );
	}
	update_option( SOURCEWEB_ROUTES_OPTION, $routes, false );
	sourceweb_src_log( 'places', 'routes saved', count( $stored ) . ' routes', count( $routes ) . ' routes' );
	sourceweb_sa_back( 'places', 'success', __( 'Routes saved.', 'sourceweb' ) );
}

/** Save what is done to an item for each place. */
function sourceweb_sa_handle_places_enhance(): void {
	sourceweb_sa_guard( 'sourceweb_sa_places_enhance', sourceweb_sa_cap() );
	$known  = array_keys( sourceweb_enhancers() );
	$posted = isset( $_POST['enhance'] ) ? (array) wp_unslash( $_POST['enhance'] ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- checked by sourceweb_sa_guard(); each value is sanitized below.
	$save   = array();
	foreach ( array_keys( sourceweb_places() ) as $id ) {
		$list        = isset( $posted[ $id ] ) ? array_map( 'sanitize_key', array_map( 'strval', (array) $posted[ $id ] ) ) : array();
		$save[ $id ] = array_values( array_intersect( $list, $known ) );
	}
	update_option( SOURCEWEB_PLACE_ENHANCE_OPTION, $save, false );
	sourceweb_src_log( 'places', 'enhancements saved' );
	sourceweb_sa_back( 'places', 'success', __( 'Enhancements saved.', 'sourceweb' ) );
}

/* ============================== Workers ============================== */

add_action( 'admin_post_sourceweb_sa_worker_run', 'sourceweb_sa_handle_worker_run' );

/** Run now for one worker: the same check and the same call as the shell's route. */
function sourceweb_sa_handle_worker_run(): void {
	sourceweb_sa_guard( 'sourceweb_sa_worker_run', sourceweb_sa_cap() );
	$id = isset( $_POST['worker'] ) ? sanitize_key( wp_unslash( $_POST['worker'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- checked by sourceweb_sa_guard().
	$w  = sourceweb_worker( $id );
	if ( ! $w || ! sourceweb_workers_can_run( $w ) ) {
		sourceweb_sa_back( 'workers', 'error', __( 'Run now is not available for this worker.', 'sourceweb' ) );
	}
	$res = sourceweb_workers_run_now( $w['file'] );
	if ( true !== $res ) {
		sourceweb_sa_back( 'workers', 'error', $w['name'] . ': ' . __( 'not started', 'sourceweb' ) . ' — ' . $res->get_error_message() );
	}
	sourceweb_sa_back( 'workers', 'success', $w['name'] . ': ' . __( 'started on GitHub. Its start report appears here within a minute or two.', 'sourceweb' ) );
}


/**
 * Workers: every worker the site knows, with its last report and status; its runs; add, change and delete a planned
 * worker. Run now is a button on each worker that can run (a GitHub token and the workers repository are set in wp-config.php).
 */
function sourceweb_sa_screen_workers(): void {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- which view to show; nothing is saved.
	$runs = isset( $_GET['sw_runs'] ) ? sanitize_key( wp_unslash( $_GET['sw_runs'] ) ) : '';
	$edit = isset( $_GET['sw_edit'] ) ? sanitize_key( wp_unslash( $_GET['sw_edit'] ) ) : '';
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	if ( '' !== $runs ) {
		sourceweb_sa_workers_runs( $runs );
		return;
	}
	if ( '' !== $edit ) {
		sourceweb_sa_workers_form( $edit );
		return;
	}
	$q   = sourceweb_sa_query();
	$res = sourceweb_sa_data( 'sourceweb_rest_workers', $q );
	echo '<p>' . esc_html__( 'The scheduled and manual jobs that fetch, check and tidy items, each with its last report and whether it is late or failing. A worker runs outside WordPress (GitHub Actions) and reports to this site when it starts and ends.', 'sourceweb' ) . '</p>';
	if ( ! empty( $res['runOff'] ) ) {
		sourceweb_sa_limit( __( 'Run now is off: it needs a GitHub token and the workers repository. Add SOURCEWEB_GITHUB_TOKEN (a fine-grained token for that repository only, with Actions read and write) and SOURCEWEB_WORKERS_REPO (owner/name) to wp-config.php. Until then, start a worker from GitHub Actions.', 'sourceweb' ) );
	}
	echo '<p><a class="button" href="' . esc_url( sourceweb_sa_url( 'workers', array( 'sw_edit' => 'new' ) ) ) . '">' . esc_html__( 'Add a planned worker', 'sourceweb' ) . '</a></p>';
	sourceweb_sa_list(
		'workers',
		$res,
		array(
			'title'    => array(
				__( 'Worker', 'sourceweb' ),
				true,
				static fn( $r ) => '<strong>' . esc_html( (string) $r['title'] ) . '</strong>' . ( '' !== (string) $r['what'] ? '<br><span class="description">' . esc_html( (string) $r['what'] ) . '</span>' : '' ),
			),
			'group'    => array( __( 'Group', 'sourceweb' ), true, static fn( $r ) => esc_html( (string) $r['groupLabel'] ) ),
			'schedule' => array( __( 'Schedule', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['schedule'] ) . ( '' !== (string) $r['late'] ? '<br><span class="description">' . esc_html( (string) $r['late'] ) . '</span>' : '' ) ),
			'last_run' => array(
				__( 'Last run', 'sourceweb' ),
				true,
				static function ( $r ) {
					$l = $r['last'];
					if ( ! is_array( $l ) ) {
						return '–';
					}
					return esc_html( (string) $l['label'] ) . '<br><span class="description">' . esc_html( trim( (string) $l['when'] . ( '' !== (string) $l['took'] ? ' · ' . $l['took'] : '' ) ) ) . ( '' !== (string) $l['counts'] ? '<br>' . esc_html( (string) $l['counts'] ) : '' ) . '</span>';
				},
			),
			'status'   => array(
				__( 'Status', 'sourceweb' ),
				true,
				static fn( $r ) => ( in_array( $r['status'], array( 'late', 'failing' ), true ) ? '<strong>' : '' ) . esc_html( (string) $r['statusLabel'] ) . ( in_array( $r['status'], array( 'late', 'failing' ), true ) ? '</strong>' : '' ) . ( '' !== (string) $r['statusNote'] ? '<br><span class="description">' . esc_html( (string) $r['statusNote'] ) . '</span>' : '' ) . ( '' !== (string) $r['problem'] ? '<br><span class="description">' . esc_html( (string) $r['problem'] ) . '</span>' : '' ),
			),
			'keys'     => array( __( 'AI keys', 'sourceweb' ), false, static fn( $r ) => esc_html( (string) $r['keys'] ) ),
			'act'      => array(
				__( 'Actions', 'sourceweb' ),
				false,
				static function ( $r ) {
					$out = '';
					if ( empty( $r['planned'] ) || (int) $r['lastAt'] > 0 ) {
						$out .= '<a class="button button-small" href="' . esc_url( sourceweb_sa_url( 'workers', array( 'sw_runs' => (string) $r['id'] ) ) ) . '">' . esc_html__( 'Runs', 'sourceweb' ) . '</a> ';
					}
					if ( ! empty( $r['canRun'] ) ) {
						$out .= '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="sw-inline" style="display:inline"><input type="hidden" name="action" value="sourceweb_sa_worker_run"><input type="hidden" name="worker" value="' . esc_attr( (string) $r['id'] ) . '">' . wp_nonce_field( 'sourceweb_sa_worker_run', '_wpnonce', true, false ) . '<button type="submit" class="button button-small">' . esc_html__( 'Run now', 'sourceweb' ) . '</button></form> ';
					}
					return $out . '<a class="button button-small" href="' . esc_url( sourceweb_sa_url( 'workers', array( 'sw_edit' => (string) $r['id'] ) ) ) . '">' . esc_html__( 'Edit', 'sourceweb' ) . '</a>';
				},
			),
		),
		$q,
		__( 'Search workers', 'sourceweb' ),
		__( 'No workers.', 'sourceweb' )
	);

	echo '<h2>' . esc_html__( 'Run now log', 'sourceweb' ) . '</h2>';
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'When', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Who', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Worker', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Result', 'sourceweb' ) . '</th></tr></thead><tbody>';
	if ( empty( $res['log'] ) ) {
		echo '<tr><td colspan="4">' . esc_html__( 'Nothing has been started from this site.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( (array) ( $res['log'] ?? array() ) as $l ) {
		echo '<tr>';
		foreach ( (array) $l as $cell ) {
			echo '<td>' . esc_html( (string) $cell ) . '</td>';
		}
		echo '</tr>';
	}
	echo '</tbody></table>';
}

/**
 * One worker's reported runs, newest first.
 *
 * @param string $id Worker id.
 */
function sourceweb_sa_workers_runs( string $id ): void {
	$w = sourceweb_worker( $id );
	if ( ! $w ) {
		sourceweb_sa_limit( __( 'No such worker.', 'sourceweb' ) );
		echo '<p><a href="' . esc_url( sourceweb_sa_url( 'workers' ) ) . '">' . esc_html__( 'Back to Workers', 'sourceweb' ) . '</a></p>';
		return;
	}
	$res = sourceweb_sa_data( 'sourceweb_rest_worker_runs', array( 'id' => $id ) );
	/* translators: %s: worker name. */
	echo '<h2>' . esc_html( sprintf( __( 'Runs of %s', 'sourceweb' ), (string) $w['name'] ) ) . '</h2>';
	echo '<p><a href="' . esc_url( sourceweb_sa_url( 'workers' ) ) . '">' . esc_html__( '← Back to Workers', 'sourceweb' ) . '</a>' . ( ! empty( $res['githubUrl'] ) ? ' · <a href="' . esc_url( (string) $res['githubUrl'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'All runs on GitHub', 'sourceweb' ) . '</a>' : '' ) . '</p>';
	/* translators: %d: number of runs kept. */
	echo '<p class="description">' . esc_html( sprintf( __( 'The last %d runs the workflow reported are kept.', 'sourceweb' ), (int) ( $res['keep'] ?? 0 ) ) ) . '</p>';
	echo '<table class="widefat striped"><thead><tr><th scope="col">' . esc_html__( 'When', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Result', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Took', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Started', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Counts', 'sourceweb' ) . '</th><th scope="col">' . esc_html__( 'Commit', 'sourceweb' ) . '</th></tr></thead><tbody>';
	if ( empty( $res['rows'] ) ) {
		echo '<tr><td colspan="6">' . esc_html__( 'No run has been reported yet.', 'sourceweb' ) . '</td></tr>';
	}
	foreach ( (array) ( $res['rows'] ?? array() ) as $r ) {
		echo '<tr><td>' . ( '' !== (string) $r['link'] ? '<a href="' . esc_url( (string) $r['link'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( (string) $r['when'] ) . '</a>' : esc_html( (string) $r['when'] ) ) . '</td><td>' . esc_html( (string) $r['label'] ) . '</td><td>' . esc_html( (string) $r['took'] ) . '</td><td>' . esc_html( (string) $r['event'] ) . '</td><td>' . esc_html( (string) $r['counts'] ) . '</td><td>' . ( '' !== (string) $r['commitUrl'] ? '<a href="' . esc_url( (string) $r['commitUrl'] ) . '" target="_blank" rel="noopener noreferrer"><code>' . esc_html( (string) $r['commit'] ) . '</code></a>' : '' ) . '</td></tr>';
	}
	echo '</tbody></table>';
}

/**
 * A worker's form: its name, what it does, group and late limit; a planned worker also its id and schedule.
 *
 * @param string $id Worker id or 'new'.
 */
function sourceweb_sa_workers_form( string $id ): void {
	$new = 'new' === $id;
	$w   = $new ? null : sourceweb_worker( $id );
	if ( ! $new && ! $w ) {
		sourceweb_sa_limit( __( 'No such worker.', 'sourceweb' ) );
		echo '<p><a href="' . esc_url( sourceweb_sa_url( 'workers' ) ) . '">' . esc_html__( 'Back to Workers', 'sourceweb' ) . '</a></p>';
		return;
	}
	$planned = $new || $w['planned'];
	echo '<h2>' . esc_html( $new ? __( 'Add a planned worker', 'sourceweb' ) : (string) $w['name'] ) . '</h2>';
	echo '<p><a href="' . esc_url( sourceweb_sa_url( 'workers' ) ) . '">' . esc_html__( '← Back to Workers', 'sourceweb' ) . '</a></p>';
	if ( $new ) {
		echo '<p>' . esc_html__( 'A planned worker is a note of one you mean to build. It shows "Not built yet" until a workflow with the same ID reports a run.', 'sourceweb' ) . '</p>';
	} elseif ( ! $planned ) {
		echo '<p class="description">' . esc_html__( 'Its ID, workflow and schedule are read from the workflow and cannot be changed here.', 'sourceweb' ) . '</p>';
	}
	sourceweb_sa_form( 'sourceweb_sa_worker_save', array( 'edit' => $new ? 'new' : (string) $w['id'] ) );
	echo '<table class="form-table" role="presentation"><tbody>';
	if ( $new ) {
		echo '<tr><th scope="row"><label for="sw_w_id">' . esc_html__( 'ID', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_w_id" name="id" class="regular-text" required pattern="[a-z0-9-]+"><p class="description">' . esc_html__( 'Lowercase letters, digits and hyphens: the workflow file name without .yml. It never changes.', 'sourceweb' ) . '</p></td></tr>';
	}
	echo '<tr><th scope="row"><label for="sw_w_name">' . esc_html__( 'Name', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_w_name" name="name" class="regular-text" maxlength="120" value="' . esc_attr( $w ? (string) $w['name'] : '' ) . '"' . ( $planned ? ' required' : '' ) . '></td></tr>';
	echo '<tr><th scope="row"><label for="sw_w_what">' . esc_html__( 'What it does', 'sourceweb' ) . '</label></th><td><textarea id="sw_w_what" name="what" rows="3" class="large-text" maxlength="500">' . esc_textarea( $w ? (string) $w['what'] : '' ) . '</textarea></td></tr>';
	echo '<tr><th scope="row"><label for="sw_w_group">' . esc_html__( 'Group', 'sourceweb' ) . '</label></th><td><select id="sw_w_group" name="group">';
	foreach ( sourceweb_worker_group_defs() as $slug => $g ) {
		echo '<option value="' . esc_attr( (string) $slug ) . '"' . selected( $w ? (string) $w['group'] : 'one-off', (string) $slug, false ) . '>' . esc_html( (string) $g[0] ) . '</option>';
	}
	echo '</select></td></tr>';
	$late = $w && null !== $w['late_after_h'] && '' !== $w['late_after_h'] ? (string) (int) $w['late_after_h'] : '';
	echo '<tr><th scope="row"><label for="sw_w_late">' . esc_html__( 'Late after (hours)', 'sourceweb' ) . '</label></th><td><input type="number" id="sw_w_late" name="late" min="1" class="small-text" value="' . esc_attr( $late ) . '"><p class="description">' . esc_html__( 'Hours without a report before the worker is late. Empty: never late.', 'sourceweb' ) . '</p></td></tr>';
	if ( $planned ) {
		echo '<tr><th scope="row"><label for="sw_w_sched">' . esc_html__( 'Schedule wanted', 'sourceweb' ) . '</label></th><td><input type="text" id="sw_w_sched" name="schedule" class="regular-text" maxlength="200" value="' . esc_attr( $w ? (string) $w['schedule'] : '' ) . '"></td></tr>';
	}
	echo '</tbody></table>';
	submit_button( $new ? __( 'Add worker', 'sourceweb' ) : __( 'Save worker', 'sourceweb' ) );
	echo '</form>';
	if ( ! $new && $planned ) {
		sourceweb_sa_form( 'sourceweb_sa_worker_delete', array( 'id' => (string) $w['id'] ) );
		echo '<p><button type="submit" class="button button-link-delete" onclick="return confirm(' . esc_attr( (string) wp_json_encode( __( 'Delete this planned worker?', 'sourceweb' ) ) ) . ');">' . esc_html__( 'Delete this planned worker', 'sourceweb' ) . '</button></p></form>';
	}
	echo '<p class="description">' . esc_html__( 'Which AI keys a worker may use is set on AI models.', 'sourceweb' ) . '</p>';
}

add_action( 'admin_post_sourceweb_sa_worker_save', 'sourceweb_sa_handle_worker_save' );
add_action( 'admin_post_sourceweb_sa_worker_delete', 'sourceweb_sa_handle_worker_delete' );

/** Add a planned worker or change a worker's details. */
function sourceweb_sa_handle_worker_save(): void {
	sourceweb_sa_guard( 'sourceweb_sa_worker_save', sourceweb_sa_cap() );
	$edit = sanitize_key( sourceweb_sa_post_text( 'edit' ) );
	$res  = sourceweb_worker_save(
		array(
			'edit'     => $edit,
			'id'       => sourceweb_sa_post_text( 'id' ),
			'name'     => sourceweb_sa_post_text( 'name' ),
			'what'     => sourceweb_sa_post_lines( 'what' ),
			'schedule' => sourceweb_sa_post_text( 'schedule' ),
			'late'     => sourceweb_sa_post_text( 'late' ),
			'group'    => sourceweb_sa_post_text( 'group' ),
			'keys'     => null, // the keys are attached on AI models
		)
	);
	if ( is_wp_error( $res ) ) {
		sourceweb_sa_back( 'workers', 'error', $res->get_error_message(), array( 'sw_edit' => $edit ) );
	}
	$msg = array(
		/* translators: %s: worker name. */
		'added' => __( 'Planned worker "%s" added. It shows "Not built yet" until a workflow with its ID reports a run.', 'sourceweb' ),
		/* translators: %s: worker name. */
		'saved' => __( 'Worker "%s" saved.', 'sourceweb' ),
		/* translators: %s: worker name. */
		'same'  => __( 'Nothing changed for "%s".', 'sourceweb' ),
	);
	sourceweb_sa_back( 'workers', 'same' === $res['done'] ? 'info' : 'success', sprintf( $msg[ $res['done'] ] ?? '%s', (string) $res['name'] ) );
}

/** Delete a planned worker. */
function sourceweb_sa_handle_worker_delete(): void {
	sourceweb_sa_guard( 'sourceweb_sa_worker_delete', sourceweb_sa_cap() );
	$res = sourceweb_worker_delete( sanitize_key( sourceweb_sa_post_text( 'id' ) ) );
	if ( is_wp_error( $res ) ) {
		sourceweb_sa_back( 'workers', 'error', $res->get_error_message() );
	}
	/* translators: %s: worker name. */
	sourceweb_sa_back( 'workers', 'success', sprintf( __( 'Planned worker "%s" deleted.', 'sourceweb' ), (string) $res['name'] ) );
}
