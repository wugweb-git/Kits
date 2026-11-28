<?php
/**
 * Search titles and meta descriptions.
 *
 * Items (news, Library, Resources, listings, opportunities, campaigns, press, Pages): the title and description are
 * stored in Rank Math's own fields (rank_math_title, rank_math_description), so the Rank Math box shows what is printed.
 * They are written when an item is published or saved, and only where the field is empty or still holds the value
 * written automatically last time (_aw_seo_auto); a value typed in Rank Math is never replaced.
 *   - News: over 60 characters the headline is cut at a word (no "…", no site name); shorter ones get
 *     " – {Site}". A publisher's name appended to the headline and separators joining its parts are dropped.
 *   - The only separator in any title is the " – " before "{Site}" (owner, 15 Oct 2026): no colons, pipes,
 *     other dashes, or commas and brackets used as separators (rankweb_seo_unseparate); later list pages add " Page N"
 *     before the site name.
 *   - Library and Resources: rankweb_seo_resource_title() (Title Case, the kind added to short ones, never cut inside).
 *   - Listings: "{Name} in {District} – {Site}" ("{Name} in {State}" without a district); over 60 characters
 *     without " – {Site}", and the name itself is never cut.
 *   - Opportunities: "{Title} – {Site}"; over 60 characters the title alone (the role and organisation are
 *     never cut).
 *   - Home and About: fixed titles. Everything else: "{Title} – {Site}".
 *   - Description: the excerpt, else the first real paragraph; listings without one get a line of their facts.
 *
 *   - Directory places (18 Nov 2026, option B): "Animal NGOs and Helpline Numbers in {District}, {State} – {Site}"
 *     (then without the site name, then without the state) where the district has a listing with a phone or an official
 *     number; "Animal Welfare NGOs and Helpline Numbers in {State}" where any listing in the state has a phone; where the
 *     name is too long for these, "Animal Helpline Numbers in …" (the earlier titles) is the last fallback. The earlier
 *     "Contact Numbers" and "Animal Welfare …" titles stay for places without a number. District × type pages are unchanged.
 * Lists (section hub Pages, Directory places and type pages, filtered lists, archives) change with their contents and
 * page number, which Rank Math's templates cannot express: they are built here at run time, through Rank Math's
 * title and description filters. A title or description typed in Rank Math for a hub Page still wins.
 *
 * The seven section hub Pages also keep a copy of their page-1 title and description in Rank Math's fields, so the
 * Rank Math box shows what is printed (owner, 14 Oct 2026). The copy is refreshed once a day by rankweb_seo_sync_hubs() (no
 * longer while a visitor's page is built: plugin audit 13) and is marked as automatic (_aw_seo_auto), so it is never
 * mistaken for a typed one.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Content types whose items carry stored titles, descriptions and focus keywords. */
// RANKWEB_SEO_ITEM_TYPES: RankWeb → Settings (settings.php).

/** Whether a post is a section hub Page (a list, not an item). */
function rankweb_seo_is_hub_page( $post ) {
	$post = get_post( $post );
	if ( ! $post || 'page' !== $post->post_type || $post->post_parent || ! rankweb_hubs() ) { // the site's section hubs (rankweb_hubs())
		return false;
	}
	foreach ( rankweb_hubs() as $h ) {
		if ( $h[0] === $post->post_name ) {
			return true;
		}
	}
	return false;
}

/**
 * The search title of an item ('' for a hub Page).
 *
 * @param int|WP_Post $post Post.
 * @return string
 */
function rankweb_seo_item_title( $post ) {
	$post = get_post( $post );
	$t    = rankweb_seo_item_title_rules( $post );
	return $post && rankweb_is_type( $post->post_type, 'listing' ) ? $t : rankweb_seo_no_hyphens_title( $t ); // no hyphens in any title, except organisation names (owner, 18 Oct 2026)
}

/** The title by the rules of its type, before hyphens are removed (see rankweb_seo_item_title). */
function rankweb_seo_item_title_rules( $post ) {
	$post = get_post( $post );
	if ( ! $post || rankweb_seo_is_hub_page( $post ) ) {
		return '';
	}
	if ( (int) get_option( 'page_on_front' ) === (int) $post->ID ) {
		$front = (string) apply_filters( 'rankweb_front_page_title', '' ); // a site's own front-page title; none: the title the rules build below
		if ( '' !== $front ) {
			return $front;
		}
		return trim( rankweb_site_name() . ( '' !== trim( (string) get_bloginfo( 'description' ) ) ? ' – ' . trim( (string) get_bloginfo( 'description' ) ) : '' ) );
	}
	if ( in_array( $post->post_type, rankweb_types_with( array( 'library' ), array( 'post' ) ), true ) ) {
		return rankweb_seo_resource_title( $post ); // Library and Resources (helpers.php)
	}
	if ( rankweb_is_type( $post->post_type, 'news' ) ) {
		return rankweb_seo_headline_title( rankweb_seo_unseparate( rankweb_plain_text( $post->post_title ), rankweb_plain_text( (string) get_post_meta( $post->ID, 'aw_source_name', true ) ) ) );
	}
	if ( rankweb_is_type( $post->post_type, 'listing' ) ) {
		$name = rankweb_seo_listing_name( $post->ID );
		return mb_strlen( rankweb_seo_branded( $name ) ) <= 60 ? rankweb_seo_branded( $name ) : $name; // over 60: no site name (Google shows it beside the result); the name is never cut (owner, 15 Oct 2026)
	}
	if ( rankweb_is_type( $post->post_type, 'opportunity' ) ) {
		$t = rankweb_seo_unseparate( rankweb_plain_text( wptexturize( $post->post_title ) ) );
		return mb_strlen( rankweb_seo_branded( $t ) ) <= 60 ? rankweb_seo_branded( $t ) : $t; // over 60: no site name; the role and organisation are never cut (owner, 15 Oct 2026)
	}
	if ( 'page' === $post->post_type && 'about' === $post->post_name && ! $post->post_parent ) {
		$about = (string) apply_filters( 'rankweb_about_page_title', '' );
		if ( '' !== $about ) {
			return $about;
		}
		return 'About ' . rankweb_site_name();
	}
	return rankweb_seo_branded( rankweb_plain_text( wptexturize( $post->post_title ) ) ); // as WordPress's own document title
}

/**
 * The meta description of an item ('' for a hub Page).
 *
 * @param int|WP_Post $post Post.
 * @return string
 */
function rankweb_seo_item_description( $post ) {
	$post = get_post( $post );
	if ( ! $post || rankweb_seo_is_hub_page( $post ) ) {
		return '';
	}
	$desc = has_excerpt( $post ) ? $post->post_excerpt : rankweb_seo_intro( $post );
	if ( rankweb_is_type( $post->post_type, 'listing' ) ) {
		if ( '' === trim( wp_strip_all_tags( (string) $desc ) ) ) {
			$desc = rankweb_listing_fact_description( $post->ID ); // no description of its own: one from its facts
		}
		$desc = (string) apply_filters( 'rankweb_listing_description', $desc, $post->ID ); // a site's own line (none by default)
	} elseif ( rankweb_is_type( $post->post_type, 'library' ) && mb_strlen( rankweb_plain_text( $desc ) ) < 60 ) { // a one-line note: the intro says more
		$better = rankweb_seo_intro( $post );
		$desc   = mb_strlen( rankweb_plain_text( $better ) ) >= 60 ? $better : $desc;
	}
	if ( '' === trim( (string) $desc ) ) {
		$desc = trim( wp_strip_all_tags( strip_shortcodes( excerpt_remove_blocks( (string) $post->post_content ) ) ) ); // a short page still says what it says
	}
	if ( '' === trim( (string) $desc ) ) {
		$desc = get_bloginfo( 'description' );
	}
	$desc = preg_replace( '/\s+,/u', ',', html_entity_decode( wp_strip_all_tags( (string) $desc ), ENT_QUOTES, 'UTF-8' ) ); // "Jaipur , Rajasthan"
	// A summary's description is the summary condensed (Summary rules): its lead, or the first sentences that fit whole.
	if ( has_excerpt( $post ) && function_exists( 'sourceweb_summary_section' ) && '' !== sourceweb_summary_section( $post ) ) {
		return sourceweb_summary_description( trim( str_replace( '[Needs legal review]', '', $desc ) ) );
	}
	return rankweb_seo_cut( $desc, RANKWEB_SEO_DESC_MAX );
}

/**
 * Write an item's title and description into Rank Math's fields: where empty, or still the value written
 * automatically last time. Listings also get their name as the focus keyword when that field is empty.
 *
 * @param int $post_id Post ID.
 * @return array What was written: field => value.
 */
function rankweb_seo_fill_post( $post_id ) {
	$post = get_post( $post_id );
	if ( ! $post || 'publish' !== $post->post_status || ! in_array( $post->post_type, RANKWEB_SEO_ITEM_TYPES, true ) || rankweb_seo_is_hub_page( $post ) ) {
		return array();
	}
	$auto  = (array) json_decode( (string) get_post_meta( $post->ID, '_aw_seo_auto', true ), true );
	$want  = array(
		'title'       => rankweb_seo_item_title( $post ),
		'description' => rankweb_seo_item_description( $post ),
	);
	$wrote = array();
	foreach ( $want as $field => $value ) {
		$have = trim( (string) get_post_meta( $post->ID, 'rank_math_' . $field, true ) );
		if ( '' === $value || $have === $value || ( '' !== $have && $have !== ( $auto[ $field ] ?? null ) ) ) {
			if ( '' !== $have && $have === $value ) {
				$auto[ $field ] = $value;
			}
			continue; // nothing to write, or typed by an editor
		}
		update_post_meta( $post->ID, 'rank_math_' . $field, wp_slash( $value ) );
		$auto[ $field ]  = $value;
		$wrote[ $field ] = $value;
	}
	if ( rankweb_is_type( $post->post_type, 'listing' ) && '' === trim( (string) get_post_meta( $post->ID, 'rank_math_focus_keyword', true ) ) ) {
		$kw = rankweb_seo_listing_keyword( $post );
		if ( '' !== $kw ) {
			update_post_meta( $post->ID, 'rank_math_focus_keyword', wp_slash( $kw ) );
			$wrote['focus_keyword'] = $kw;
		}
	}
	update_post_meta( $post->ID, '_aw_seo_auto', wp_slash( wp_json_encode( $auto, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ) );
	return $wrote;
}

/** A listing's focus keyword: its name, plain, without a trailing place or bracketed abbreviation clutter. */
function rankweb_seo_listing_keyword( $post ) {
	$name = rankweb_plain_text( get_post_field( 'post_title', $post ) );
	$name = preg_replace( '/[\s,;:\x{2013}\x{2014}-]+$/u', '', $name ); // organisation names keep their hyphens
	return trim( str_replace( array( '"', '“', '”' ), '', $name ) );
}

// After every save of a published item (terms and meta are in place by then; also for REST and ingest).
add_action(
	'wp_after_insert_post',
	function ( $post_id, $post ) {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) || 'publish' !== $post->post_status ) {
			return;
		}
		rankweb_seo_fill_post( $post_id );
	},
	99,
	2
);

// Daily: items published another way (direct status changes) get their fields too. Scheduled from admin.
add_action(
	'admin_init',
	function () {
		if ( ! wp_next_scheduled( 'aw_seo_fill_daily' ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'aw_seo_fill_daily' );
		}
	}
);
add_action(
	'aw_seo_fill_daily',
	function () {
		global $wpdb;
		$types = array_values( (array) RANKWEB_SEO_ITEM_TYPES );
		$ids   = $wpdb->get_col( $wpdb->prepare( "SELECT p.ID FROM {$wpdb->posts} p LEFT JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'rank_math_title' WHERE p.post_type IN (" . implode( ',', array_fill( 0, count( $types ), '%s' ) ) . ") AND p.post_status = 'publish' AND m.meta_id IS NULL LIMIT 500", $types ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL, WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- one %s per item type
		foreach ( $ids as $id ) {
			rankweb_seo_fill_post( $id );
		}
	}
);

/* ---------- Rank Math Titles & Meta templates: the same rules (SEO Phase 10, 16 Oct 2026) ---------- */

/*
 * Every item type's Titles & Meta template is %aw_title% / %aw_description% (Rank Math → Titles & Meta → each post
 * type), so an item that has no stored title or description yet, and the snippet preview in the editor and in the
 * settings, show what the rules above write: one separator, the site name only at the end, never a bare
 * %variable%. Stored values still win, as Rank Math always does.
 */

/** The post a Rank Math variable is being replaced for. */
function rankweb_seo_var_post( $args = null ) {
	if ( $args instanceof WP_Post ) {
		return $args;
	}
	if ( is_object( $args ) && ! empty( $args->ID ) ) {
		return get_post( (int) $args->ID );
	}
	if ( is_admin() && ! empty( $_GET['post'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		return get_post( (int) $_GET['post'] ); // phpcs:ignore WordPress.Security.NonceVerification
	}
	$post = get_post();
	return $post ? $post : ( is_singular() ? get_queried_object() : null );
}

/** %aw_title%: the item's title by the rules above; a hub or an untitled draft: "{Title} – {Site}". */
function rankweb_seo_var_title( $var_args = '', $args = null ) {
	$post  = rankweb_seo_var_post( $args );
	$title = $post ? rankweb_seo_item_title( $post ) : '';
	if ( '' === $title ) {
		$own   = $post ? trim( rankweb_plain_text( wptexturize( $post->post_title ) ) ) : '';
		$title = '' !== $own ? rankweb_seo_branded( $own ) : get_bloginfo( 'name' );
	}
	return $title;
}

/** %aw_description%: the item's description by the rules above (its summary condensed, else its intro). */
function rankweb_seo_var_description( $var_args = '', $args = null ) {
	$post = rankweb_seo_var_post( $args );
	$desc = $post ? rankweb_seo_item_description( $post ) : '';
	return '' !== $desc ? $desc : get_bloginfo( 'description' );
}

add_action(
	'rank_math/vars/register_extra_replacements',
	function () {
		$post = is_admin() ? rankweb_seo_var_post() : null; // the example is only shown in admin previews
		rank_math_register_var_replacement(
			'aw_title',
			array(
				'name'        => 'RankWeb title',
				'description' => 'The title by the site\'s rules: one separator, the site name only at the end',
				'variable'    => 'aw_title',
				'nocache'     => true, // one value per post (Rank Math caches a template's result for the whole request otherwise)
				'example'     => $post ? rankweb_seo_var_title( '', $post ) : rankweb_seo_branded( 'Example page title' ),
			),
			'rankweb_seo_var_title'
		);
		rank_math_register_var_replacement(
			'aw_description',
			array(
				'name'        => 'RankWeb description',
				'description' => 'The description by the site\'s rules (the summary condensed, else the intro)',
				'variable'    => 'aw_description',
				'nocache'     => true, // one value per post (Rank Math caches a template's result for the whole request otherwise)
				'example'     => $post ? rankweb_seo_var_description( '', $post ) : get_bloginfo( 'description' ),
			),
			'rankweb_seo_var_description'
		);
	}
);

/* ---------- Lists: built at run time ---------- */

/** The title rule for the current list view, '' to leave it to WordPress (type pages, filtered lists, archives). */
function rankweb_seo_list_title() {
	if ( is_404() || is_search() ) {
		return '';
	}
	$hub  = function_exists( 'aw_hub_type' ) ? aw_hub_type() : '';
	$adj  = rankweb_wording( 'dir_adjective' ); // a site's word before the Directory's nouns (none by default)
	$adjl = rankweb_wording( 'dir_adjective_long' );
	if ( rankweb_is_type( $hub, 'listing' ) && function_exists( 'directoryweb_current_place' ) ) { // the Directory's titles need DirectoryWeb
		$place = directoryweb_current_place();
		$typed = rankweb_seo_dir_title(); // district × type pages and lists filtered by type (programmatic.php)
		if ( '' !== $typed ) {
			return $typed;
		}
		if ( directoryweb_current_type_name() || ! empty( $_GET['q'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return ''; // name searches and other filtered lists keep their own titles
		}
		if ( ! $place ) {
			return rankweb_seo_fit( array_filter( array( RANKWEB_HUB_TITLES[ rankweb_type( 'listing' ) ] ?? '' ) ), 60 - mb_strlen( rankweb_seo_page_suffix() ) );
		}
		if ( $place->parent ) { // within 60 characters: the longest of these that fits
			$where = $place->name . ', ' . directoryweb_place_parent_state( $place )->name;
			// "Animal NGOs and Helpline Numbers in {District}, {State} – {Site}" where the district has a number of its own
			// (18 Nov 2026: option B); searched as "animal helpline number {city}" and "animal ngo in {district}".
			// "Animal Helpline Numbers in …" (1 Nov 2026: option A) stays as the last fallback for long names.
			$help  = rankweb_seo_place_has_helpline( $place ) ? array( rankweb_seo_branded( $adj . 'NGOs and Helpline Numbers in ' . $where ), $adj . 'NGOs and Helpline Numbers in ' . $where, rankweb_seo_branded( $adj . 'NGOs and Helpline Numbers in ' . $place->name ), $adj . 'NGOs and Helpline Numbers in ' . $place->name, rankweb_seo_branded( $adj . 'Helpline Numbers in ' . $where ), $adj . 'Helpline Numbers in ' . $where, rankweb_seo_branded( $adj . 'Helpline Numbers in ' . $place->name ), $adj . 'Helpline Numbers in ' . $place->name ) : array();
			$phone = rankweb_seo_has_numbers( $place ) ? array( $adj . 'Rescue and NGO Contact Numbers in ' . $where, $adj . 'Rescue and NGO Contact Numbers in ' . $place->name ) : array(); // searched as "animal rescue {district} contact number"
			return rankweb_seo_fit(
				array_merge(
					$help,
					$phone,
					array(
						$adjl . 'NGOs Shelters and Vets in ' . $where,
						$adjl . 'NGOs and Vets in ' . $where,
						$adjl . 'NGOs in ' . $where,
						$adjl . 'NGOs in ' . $place->name,
					)
				),
				60 - mb_strlen( rankweb_seo_page_suffix() )
			);
		}
		// A state: its two biggest listing types, each listing counted once by its most specific type (owner, 15 Oct 2026). "Animal Welfare {Type1} and {Type2} in {State}"
		// (no comma: one separator only); "{Type1} and More" when it has a third type; one type, then "NGOs", when the longer ones pass 60 characters.
		$types = array_map( fn( $b ) => rankweb_seo_state_type_title( $place, $b[0] ), rankweb_seo_dir_breakdown( $place ) );
		$first = $types[0] ?? 'NGOs';
		$in    = ' in ' . $place->name;
		$more  = count( $types ) > 2 ? ' and More' : '';
		$try   = array();
		if ( rankweb_seo_place_has_helpline( $place ) ) { // 18 Nov 2026 (option B): a state with any listing that has a phone
			$try[] = rankweb_seo_branded( $adjl . 'NGOs and Helpline Numbers' . $in );
			$try[] = $adjl . 'NGOs and Helpline Numbers' . $in;
			$try[] = rankweb_seo_branded( $adj . 'Helpline Numbers' . $in ); // the earlier title, kept for long names (Arunachal Pradesh, Jammu and Kashmir)
		}
		if ( count( $types ) > 1 ) {
			$try[] = $adjl . $first . ' and ' . $types[1] . $in;
		}
		if ( $more ) {
			$try[] = $adjl . $first . $more . $in;
		}
		$try[] = $adjl . $first . $in;
		$try[] = $adjl . 'NGOs' . $in;
		$try[] = ( '' !== $adjl ? $adjl : 'Organisations ' ) . 'in ' . preg_replace( '/^The /', '', $place->name ); // a long name ("The Dadra and Nagar Haveli and Daman and Diu"): never cut inside it
		return rankweb_seo_fit( array_unique( $try ), 60 - mb_strlen( rankweb_seo_page_suffix() ) );
	}
	if ( ( is_tag() || rankweb_seo_is_category_page() ) && function_exists( 'rankweb_seo_term_title' ) ) { // a tag or category page: its written title (programmatic.php)
		$what = rankweb_seo_term_title( get_queried_object() );
		return rankweb_seo_page_number() > 1 ? rankweb_seo_fit( array( $what, preg_replace( '/ – ' . preg_quote( get_bloginfo( 'name' ), '/' ) . '$/u', '', $what ) ), 60 - mb_strlen( rankweb_seo_page_suffix() ) ) : $what;
	}
	return RANKWEB_HUB_TITLES[ $hub ] ?? '';
}

/**
 * Whether a place's page can be titled "Animal NGOs and Helpline Numbers in …" (or "Animal Helpline Numbers in …"): at least one of its listings has a phone number
 * (stored counts, programmatic.php), or, for a district, an official number is kept for it (district-helplines.php).
 * Title only; the district helpline block has its own test.
 *
 * @param object $place State or district.
 * @return bool
 */
function rankweb_seo_place_has_helpline( $place ) {
	if ( rankweb_seo_dir_count( $place, '*#ph' ) >= 1 ) {
		return true;
	}
	return 'district' === $place->kind && function_exists( 'directoryweb_district_official_numbers' ) && array() !== directoryweb_district_official_numbers( $place->code );
}

/** DirectoryWeb asks whether a place can be called "Animal NGOs and Helpline Numbers in …" (filter directoryweb_place_has_helpline). */
add_filter( 'directoryweb_place_has_helpline', fn( $has, $place ) => is_object( $place ) ? rankweb_seo_place_has_helpline( $place ) : $has, 10, 2 );

/**
 * A listing type as a state page's title names it, plural and short: "NGOs", "Gaushalas", "ABC Centres". Every
 * veterinary type (hospital, dispensary, clinic, government office, 1962 unit, bird hospital) is counted together and
 * always named "Vets" (owner, 15 Oct 2026).
 *
 * @param object $place State.
 * @param string $key   Type slug or "veterinary".
 * @return string
 */
function rankweb_seo_state_type_title( $place, $key ) {
	$words = array(
		'animal-welfare-organisation' => 'NGOs',
		'gaushala'                    => 'Gaushalas',
		'abc-centre'                  => 'ABC Centres',
		'wildlife-rescue'             => 'Wildlife Rescuers',
		'veterinary'                  => 'Vets',
	);
	if ( isset( $words[ $key ] ) ) {
		return $words[ $key ];
	}
	return rankweb_seo_title_case( rankweb_seo_type_words( $key, 2, true ) );
}

/** True while the WordPress document title of a list is being built (Rank Math's title filter then steps aside). */
function rankweb_seo_building_title( $set = null ) {
	static $busy = false;
	if ( null !== $set ) {
		$busy = (bool) $set;
	}
	return $busy;
}

/**
 * Refresh the stored copies of all seven hub Pages without a visitor (daily, and from WP-CLI:
 * `wp eval 'print_r( rankweb_seo_sync_hubs() );'`): each hub's page 1 is fetched and the title and description it prints are
 * stored. This is the only place the copies are written (page loads write nothing).
 *
 * @return array Hub slug => [title, description] as printed, or the error.
 */
function rankweb_seo_sync_hubs() {
	$out = array();
	if ( ! rankweb_hubs() ) { // the site has no section hubs
		return $out;
	}
	foreach ( rankweb_hubs() as $h ) {
		$page = get_page_by_path( $h[0] );
		if ( ! $page || 'publish' !== $page->post_status ) {
			continue;
		}
		$res = wp_remote_get( get_permalink( $page ), array( 'timeout' => 30, 'user-agent' => 'aw-seo-hub-sync' ) );
		$doc = is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ? '' : (string) wp_remote_retrieve_body( $res );
		$head = (string) strstr( $doc, '</head>', true );
		if ( ! preg_match( '#<title[^>]*>(.*?)</title>#si', $head, $t ) || ! preg_match( '#<meta name="description" content="([^"]*)"#i', $head, $d ) ) {
			$out[ $h[0] ] = is_wp_error( $res ) ? $res->get_error_message() : 'no title or description';
			continue;
		}
		$printed = array(
			'title'       => trim( html_entity_decode( wp_strip_all_tags( $t[1] ), ENT_QUOTES, 'UTF-8' ) ),
			'description' => trim( html_entity_decode( $d[1], ENT_QUOTES, 'UTF-8' ) ),
		);
		$auto = (array) json_decode( (string) get_post_meta( $page->ID, '_aw_seo_auto', true ), true );
		foreach ( $printed as $field => $value ) {
			$have = trim( (string) get_post_meta( $page->ID, 'rank_math_' . $field, true ) );
			if ( '' === $value || $have === $value || ( '' !== $have && $have !== ( $auto[ $field ] ?? null ) ) ) {
				continue; // up to date, or typed by an editor
			}
			update_post_meta( $page->ID, 'rank_math_' . $field, wp_slash( $value ) );
			$auto[ $field ] = $value;
		}
		update_post_meta( $page->ID, '_aw_seo_auto', wp_slash( wp_json_encode( $auto, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ) );
		$out[ $h[0] ] = array_values( $printed );
	}
	return $out;
}
add_action( 'aw_seo_fill_daily', 'rankweb_seo_sync_hubs', 20 );

/**
 * Directory views that no title rule above names (a name search in a place, "/directory/rajasthan/?q=cow"): the
 * document title is the page's own heading, directoryweb_directory_title() ("Animal welfare directory: Rajasthan"). Moved here
 * from the earlier Core plugin (SEO ground rule G1, 16 Oct 2026); titles are unchanged.
 *
 * @param array $parts Title parts.
 * @return array
 */
function rankweb_seo_directory_document_title( $parts ) {
	if ( function_exists( 'directoryweb_is_directory_view' ) && function_exists( 'directoryweb_directory_title' ) && directoryweb_is_directory_view() ) {
		$parts['title'] = wp_strip_all_tags( directoryweb_directory_title( $parts['title'] ?? '' ) );
	}
	return $parts;
}
add_filter( 'document_title_parts', 'rankweb_seo_directory_document_title' );

// While building, the document title comes from WordPress's own parts (the Directory type pages set theirs).
add_filter( 'pre_get_document_title', fn( $t ) => rankweb_seo_building_title() ? '' : $t, 16 );
add_filter(
	'pre_get_document_title',
	function ( $title ) {
		if ( ! rankweb_seo_building_title() ) {
			return $title;
		}
		$ours = rankweb_seo_list_title();
		return '' !== $ours ? rankweb_seo_title_with_page( $ours ) : $title;
	},
	25
);

add_filter(
	'rank_math/frontend/title',
	function ( $title ) {
		if ( rankweb_seo_building_title() || ! rankweb_seo_is_list_view() || is_404() ) {
			return $title; // items: Rank Math's own field
		}
		if ( '' !== rankweb_seo_typed( 'title' ) ) {
			return rankweb_seo_title_with_page( $title ); // typed in Rank Math: used as is (" Page N" on later pages)
		}
		rankweb_seo_building_title( true );
		$ours = wp_get_document_title();
		rankweb_seo_building_title( false );
		$ours  = trim( html_entity_decode( wp_strip_all_tags( $ours ), ENT_QUOTES, 'UTF-8' ) );
		$brand = ' – ' . get_bloginfo( 'name' );
		if ( mb_strlen( $ours ) > 60 && rankweb_seo_page_number() > 1 && false !== mb_strpos( $ours, $brand ) ) {
			$ours = str_replace( $brand, '', $ours ); // later pages: the page number before the site name
		}
		$ours = '' !== $ours ? $ours : $title;
		return $ours;
	},
	20
);

/** The description of the current list view. */
function rankweb_seo_list_description() {
	$desc    = '';
	$adjl_lc = mb_strtolower( rankweb_wording( 'dir_adjective_long' ) ); // a site's word before the Directory's nouns (none by default)
	$hub  = function_exists( 'aw_hub_type' ) ? aw_hub_type() : '';
	if ( is_singular() ) { // a hub Page: its excerpt or intro, then the rules below
		$post = get_queried_object();
		$desc = has_excerpt( $post ) ? $post->post_excerpt : rankweb_seo_intro( $post );
	} elseif ( is_post_type_archive() ) {
		$desc = RANKWEB_ARCHIVE_DESCRIPTIONS[ get_query_var( 'post_type' ) ] ?? '';
	} elseif ( is_tag() && '' === trim( (string) term_description() ) && function_exists( 'rankweb_seo_tag_description' ) ) {
		$desc = rankweb_seo_tag_description( get_queried_object() ); // what the tag holds, counted (programmatic.php)
	} elseif ( rankweb_seo_is_category_page() && '' !== rankweb_seo_category_description( get_queried_object() ) ) {
		$desc = rankweb_seo_category_description( get_queried_object() ); // what the category holds, counted (programmatic.php)
	} elseif ( is_tax() || is_category() || is_tag() ) {
		$desc = term_description() ?: single_term_title( '', false ) . ' on ' . get_bloginfo( 'name' ) . '.';
	}
	if ( function_exists( 'directoryweb_is_directory_view' ) && directoryweb_is_directory_view() && ! get_query_var( 'aw_dir_type' ) && empty( $_GET['tag'] ) && empty( $_GET['q'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		$desc = directoryweb_directory_intro();
	}
	$built = rankweb_is_type( $hub, 'listing' ) ? rankweb_seo_dir_description() : ''; // places, district × type pages, lists filtered by type (programmatic.php)
	if ( '' !== $built ) {
		$desc = $built;
	} elseif ( rankweb_is_type( $hub, 'listing' ) && ! is_404() && function_exists( 'directoryweb_current_place' ) ) {
		$place = directoryweb_current_place();
		$slug  = (string) get_query_var( 'aw_type_slug' );
		$n     = number_format_i18n( aw_hub_total( rankweb_type( 'listing' ) ) );
		$state = $place ? directoryweb_place_parent_state( $place ) : null;
		if ( ! $place ) {
			$desc = ( directoryweb_current_type_name() || ! empty( $_GET['q'] ) ) ? $desc : sprintf( RANKWEB_HUB_DESCRIPTIONS[ rankweb_type( 'listing' ) ] ?? '%s', $n ); // phpcs:ignore WordPress.Security.NonceVerification
		} elseif ( $place->parent && '' !== $slug && '0' !== $n ) {
			$what = '1' === $n ? 'One ' . preg_replace( '/\bgaushala\b/u', 'Gaushala', mb_strtolower( trim( preg_replace( '/\s*\(.*?\)\s*/', ' ', rankweb_seo_listing_type_name( $slug ) ) ) ) ) : $n . ' ' . rankweb_seo_type_plural( $slug );
			$desc = sprintf( '1' === $n ? '%1$s in %2$s, %3$s: address, phone number and services.' : '%1$s in %2$s, %3$s: addresses, phone numbers and services.', $what, $place->name, $state->name );
			$more = ' From the ' . rankweb_site_name() . ' Directory' . rankweb_seo_dir_scope( true ) . '.';
			$short = ' From the ' . rankweb_site_name() . ' Directory.';
			$desc = mb_strlen( $desc . $more ) <= RANKWEB_SEO_DESC_MAX ? $desc . $more : ( mb_strlen( $desc . $short ) <= RANKWEB_SEO_DESC_MAX ? $desc . $short : $desc );
		} elseif ( directoryweb_current_type_name() || ! empty( $_GET['q'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$desc = $desc; // a filtered list: as before
		} elseif ( $place->parent ) {
			$desc = '1' === $n
				? sprintf( 'One ' . $adjl_lc . 'organisation listed in %1$s, %2$s, with its phone, address and services, in the %3$s Directory%4$s.', $place->name, $state->name, rankweb_site_name(), rankweb_seo_dir_scope() )
				: sprintf( '%1$s ' . $adjl_lc . 'NGOs, rescue groups, shelters, Gaushalas and vets in %2$s, %3$s. Phone, address and services of each.', $n, $place->name, $state->name );
		} else {
			$desc = sprintf( '%1$s ' . $adjl_lc . 'NGOs, shelters, rescuers, Gaushalas and government vets in %2$s, district by district. Phone, address and services.', $n, $place->name );
		}
	} elseif ( isset( RANKWEB_HUB_DESCRIPTIONS[ $hub ] ) && ! rankweb_is_type( $hub, 'listing' ) ) { // the Directory's has a count to fill in (above)
		$desc = RANKWEB_HUB_DESCRIPTIONS[ $hub ];
	} elseif ( in_array( $hub, rankweb_types_with( array( 'news', 'library' ), array( 'post' ) ), true ) ) {
		$desc = rankweb_seo_hub_intro_description( $hub );
	}
	if ( '' === trim( (string) $desc ) ) {
		$desc = get_bloginfo( 'description' );
	}
	$desc  = preg_replace( '/\s+,/u', ',', html_entity_decode( wp_strip_all_tags( (string) $desc ), ENT_QUOTES, 'UTF-8' ) );
	$pages = rankweb_seo_page_suffix();
	return rankweb_seo_with_page( rankweb_seo_cut( $desc, RANKWEB_SEO_DESC_MAX - mb_strlen( $pages ) ) );
}

/**
 * Description of the current view (schema nodes use it): an item's Rank Math description (or what would be stored),
 * a list's built description.
 *
 * @return string
 */
function rankweb_seo_description() {
	if ( rankweb_seo_is_list_view() ) {
		return rankweb_seo_list_description();
	}
	$typed = rankweb_seo_typed( 'description' );
	return '' !== $typed ? $typed : rankweb_seo_item_description( get_queried_object_id() );
}

add_filter(
	'rank_math/frontend/description',
	function ( $desc ) {
		if ( is_404() || ! rankweb_seo_is_list_view() ) {
			return $desc; // items: Rank Math's own field
		}
		if ( '' !== rankweb_seo_typed( 'description' ) ) {
			return rankweb_seo_with_page( $desc ); // typed in Rank Math: used as is (" – Page N" on later pages)
		}
		$ours = rankweb_seo_list_description();
		$ours = '' !== $ours ? $ours : $desc;
		return $ours;
	},
	20
);

/* ---------- /claim/?listing=ID: one indexed page per listing, with its own title (owner, 10 Oct 2026) ---------- */

add_filter(
	'rank_math/frontend/description',
	function ( $desc ) {
		$id = function_exists( 'rankweb_claim_listing' ) ? rankweb_claim_listing() : 0;
		if ( ! $id ) {
			return $desc;
		}
		$name = rankweb_plain_text( get_the_title( $id ) );
		return rankweb_seo_cut( 'Claim ' . $name . ' in the ' . rankweb_site_name() . ' Directory: send changes to its phone, WhatsApp, email, website, area, services or logo for review.', 160 );
	},
	30
);

add_filter(
	'rank_math/frontend/title',
	function ( $title ) {
		$id = function_exists( 'rankweb_claim_listing' ) ? rankweb_claim_listing() : 0;
		return $id ? 'Claim ' . html_entity_decode( get_the_title( $id ), ENT_QUOTES ) . ' – ' . rankweb_site_name() : $title;
	},
	30
);

/*
 * The title separator as a character: Rank Math writes %sep% as an HTML entity (htmlentities of "–" is "&ndash;"),
 * and its <title> and share titles print that entity as is. Titles are plain text, so entities are decoded last; the
 * output is still escaped by Rank Math.
 */
/** A printed title without hyphens, except in the Directory (organisation and place names are official names, owner 18 Oct 2026). */
function rankweb_seo_printed_title( $t ) {
	$dir = rankweb_is_singular( array( 'listing' ) ) || ( function_exists( 'aw_hub_type' ) && rankweb_is_type( aw_hub_type(), 'listing' ) ) || ( function_exists( 'directoryweb_is_directory_view' ) && directoryweb_is_directory_view() );
	return $dir ? $t : rankweb_seo_no_hyphens_title( $t );
}
add_filter( 'rank_math/frontend/title', fn( $t ) => rankweb_seo_printed_title( html_entity_decode( (string) $t, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ), 9999 ); // and no hyphen joining two words (owner, 18 Oct 2026)
add_filter( 'rank_math/opengraph/facebook/og_title', fn( $t ) => rankweb_seo_printed_title( html_entity_decode( (string) $t, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ), 9999 );
add_filter( 'rank_math/opengraph/twitter/twitter_title', fn( $t ) => rankweb_seo_printed_title( html_entity_decode( (string) $t, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ), 9999 );

/*
 * Yearly SEO titles (owner, 21 Oct 2026: "World Animal Day 2026 Date, Theme, History – {Site}", the year
 * updated each year; the slug has no year). A post with meta aw_seo_title_yearly = 1 gets the year in its Rank Math
 * title moved to the current one, checked once a day by the daily event (never on a page view). A plain number in the
 * stored field, never a %variable%.
 */
add_action(
	'aw_seo_fill_daily',
	function () {
		$year = wp_date( 'Y' );
		foreach ( get_posts( array( 'post_type' => 'any', 'post_status' => 'publish', 'numberposts' => 50, 'fields' => 'ids', 'meta_key' => 'aw_seo_title_yearly', 'meta_value' => '1' ) ) as $id ) { // phpcs:ignore WordPress.DB.SlowDBQuery
			$t = (string) get_post_meta( $id, 'rank_math_title', true );
			$n = preg_replace( '/\b20\d\d\b/', $year, $t, 1 );
			if ( '' !== $t && $n !== $t ) {
				update_post_meta( $id, 'rank_math_title', wp_slash( $n ) );
			}
		}
	},
	50
);

// Titles and descriptions are printed in the one date format (owner, 17 Oct 2026); aw_heading_dates() is in the earlier Core plugin.
foreach ( array( 'rank_math/frontend/title', 'rank_math/frontend/description' ) as $rankweb_hook ) {
	add_filter( $rankweb_hook, fn( $text ) => function_exists( 'aw_heading_dates' ) ? aw_heading_dates( $text ) : $text, 20 );
}

/* The standalone meta description is printed by standalone-seo.php (rankweb_print_head_tags), once, for every kind of page. */
