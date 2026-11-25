<?php
/**
 * Standalone SEO output: what RankWeb prints itself when no other SEO plugin does.
 *
 * Who owns the page head is decided once (rankweb_seo_owner()):
 * - 'rank_math': Rank Math prints title, description, canonical, robots, Open Graph and JSON-LD. RankWeb adds nothing
 *   it already prints; its rank_math/* filters shape Rank Math's output.
 * - 'other': Yoast SEO, SEOPress or All in One SEO is active. RankWeb stays quiet in the head and says so in Diagnostics.
 * - 'none': RankWeb prints the head tags below, each exactly once.
 *
 * Title, canonical and the XML sitemap come from WordPress itself (document title, rel_canonical, wp-sitemap.xml);
 * this file adds what core lacks: a real meta description, Open Graph and Twitter tags, noindex rules, sitemap
 * exclusion of noindex items, and a schema type for ordinary posts and pages. Nothing here knows about `aw_*` content
 * types, a host name or a site name: the site name is the site's own.
 *
 * @package rankweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Who prints the page head: 'rank_math', 'other' or 'none'. */
function rankweb_seo_owner(): string {
	if ( function_exists( 'rankweb_seo_extras_rank_math' ) && rankweb_seo_extras_rank_math() ) {
		return 'rank_math';
	}
	if ( defined( 'WPSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' ) || defined( 'AIOSEO_VERSION' ) || class_exists( 'AIOSEO\\Plugin\\AIOSEO' ) ) {
		return 'other';
	}
	return (string) apply_filters( 'rankweb_seo_owner', 'none' );
}

/** The other SEO plugin that is active, by name ('' when none). For Diagnostics and the admin notice. */
function rankweb_other_seo_plugin(): string {
	if ( defined( 'WPSEO_VERSION' ) ) {
		return 'Yoast SEO';
	}
	if ( defined( 'SEOPRESS_VERSION' ) ) {
		return 'SEOPress';
	}
	if ( defined( 'AIOSEO_VERSION' ) || class_exists( 'AIOSEO\\Plugin\\AIOSEO' ) ) {
		return 'All in One SEO';
	}
	return '';
}

/** Whether RankWeb prints the head itself on this site. */
function rankweb_prints_head(): bool {
	return 'none' === rankweb_seo_owner();
}

/**
 * A site-level default that is generic here and can be set by the site. Animal Writes' own values live in
 * animal-writes-compat.php and load only when Animal Writes Core is active.
 *
 * Keys: alt_names (list), same_as (list), email, language (BCP 47), country (ISO code), country_name, languages (list), founded.
 *
 * @param string $key     Key.
 * @param mixed  $generic The value for a site with no special setting.
 * @return mixed
 */
function rankweb_site_default( string $key, $generic = '' ) {
	return apply_filters( 'rankweb_site_default_' . $key, $generic );
}

/** The language of the site's schema and share tags, as BCP 47 (en-US), from the WordPress locale unless the site says otherwise. */
function rankweb_language(): string {
	return (string) rankweb_site_default( 'language', str_replace( '_', '-', get_locale() ) );
}

/** The site's name (the site's own; a filter lets a site brand it differently). */
function rankweb_site_name(): string {
	return (string) apply_filters( 'rankweb_site_name', html_entity_decode( (string) get_bloginfo( 'name' ), ENT_QUOTES, 'UTF-8' ) );
}

/**
 * A post's own SEO value: RankWeb's field first, then Rank Math's stored field (kept so a site that leaves Rank Math
 * keeps what it wrote).
 *
 * @param int    $post_id Post.
 * @param string $what    'title', 'description' or 'robots'.
 */
function rankweb_post_seo_field( int $post_id, string $what ): string {
	foreach ( array( '_rankweb_' . $what, 'rank_math_' . $what ) as $key ) {
		$v = get_post_meta( $post_id, $key, true );
		if ( is_array( $v ) ) {
			$v = implode( ',', $v );
		}
		if ( is_string( $v ) && '' !== trim( $v ) ) {
			if ( 'description' === $what && trim( $v ) === trim( (string) get_bloginfo( 'description' ) ) ) {
				continue; // the site tagline copied into a post is not that post's description
			}
			return trim( $v );
		}
	}
	return '';
}

/** A short plain-text description of a post: its own field, its excerpt, or the start of its content. */
function rankweb_post_description( $post ): string {
	$post = get_post( $post );
	if ( ! $post ) {
		return '';
	}
	$own = rankweb_post_seo_field( (int) $post->ID, 'description' );
	if ( '' !== $own ) {
		return rankweb_cut_text( $own, 160 );
	}
	$src = has_excerpt( $post ) ? $post->post_excerpt : strip_shortcodes( excerpt_remove_blocks( (string) $post->post_content ) );
	$txt = trim( preg_replace( '/\s+/u', ' ', html_entity_decode( wp_strip_all_tags( (string) $src ), ENT_QUOTES, 'UTF-8' ) ) );
	return rankweb_cut_text( $txt, 160 );
}

/** Cut at a word end, with an ellipsis, never longer than $max characters. */
function rankweb_cut_text( string $text, int $max ): string {
	$text = trim( $text );
	if ( mb_strlen( $text ) <= $max ) {
		return $text;
	}
	$cut = mb_substr( $text, 0, $max - 1 );
	$sp  = mb_strrpos( $cut, ' ' );
	if ( false !== $sp && $sp > $max * 0.6 ) {
		$cut = mb_substr( $cut, 0, $sp );
	}
	return rtrim( $cut, " ,;:.-–" ) . '…';
}

/** The description of the page being viewed ('' when there is nothing honest to say). */
function rankweb_head_description(): string {
	if ( is_singular() ) {
		$pt = (string) get_post_type();
		if ( 0 === strpos( $pt, 'aw_' ) && function_exists( 'rankweb_seo_description' ) ) {
			$d = rankweb_seo_description(); // Animal Writes content types keep their own descriptions
			if ( '' !== trim( (string) $d ) ) {
				return rankweb_plain_text( $d );
			}
		}
		return rankweb_post_description( get_queried_object_id() );
	}
	if ( is_front_page() || is_home() ) {
		return trim( wp_strip_all_tags( (string) get_bloginfo( 'description' ) ) );
	}
	if ( is_category() || is_tag() || is_tax() ) {
		$d = term_description();
		return rankweb_cut_text( trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( (string) $d ) ) ), 160 );
	}
	return '';
}

/** The share image of the page: the featured image, else the site icon. */
function rankweb_head_image(): array {
	$id = is_singular() ? (int) get_post_thumbnail_id( get_queried_object_id() ) : 0;
	if ( $id ) {
		$src = wp_get_attachment_image_src( $id, 'large' );
		if ( $src ) {
			return array( 'url' => $src[0], 'width' => (int) $src[1], 'height' => (int) $src[2], 'alt' => trim( (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) ) );
		}
	}
	$icon = get_site_icon_url( 512 );
	return $icon ? array( 'url' => $icon, 'width' => 512, 'height' => 512, 'alt' => '' ) : array();
}

/** The canonical address of the page being viewed (what core's rel_canonical prints on singular pages, plus archives). */
function rankweb_head_url(): string {
	if ( is_singular() ) {
		$u = wp_get_canonical_url( get_queried_object_id() );
		return $u ? $u : '';
	}
	global $wp;
	return home_url( user_trailingslashit( $wp->request ?? '' ) );
}

/** Meta description, Open Graph and Twitter tags: once each. */
function rankweb_print_head_tags(): void {
	if ( is_admin() || is_feed() || is_404() || ! rankweb_prints_head() ) {
		return;
	}
	$desc  = rankweb_head_description();
	$title = html_entity_decode( wp_get_document_title(), ENT_QUOTES, 'UTF-8' );
	$url   = rankweb_head_url();
	$img   = rankweb_head_image();
	$post  = is_singular() ? get_queried_object() : null;
	$type  = $post instanceof WP_Post && 'page' !== $post->post_type ? 'article' : 'website';
	$tags  = array();
	if ( '' !== $desc ) {
		echo '<meta name="description" content="' . esc_attr( $desc ) . '" />' . "\n";
	}
	$tags[] = array( 'property', 'og:locale', str_replace( '-', '_', get_locale() ) );
	$tags[] = array( 'property', 'og:type', $type );
	$tags[] = array( 'property', 'og:title', $title );
	if ( '' !== $desc ) {
		$tags[] = array( 'property', 'og:description', $desc );
	}
	if ( '' !== $url ) {
		$tags[] = array( 'property', 'og:url', $url );
	}
	$tags[] = array( 'property', 'og:site_name', rankweb_site_name() );
	if ( $img ) {
		$tags[] = array( 'property', 'og:image', $img['url'] );
		if ( $img['width'] ) {
			$tags[] = array( 'property', 'og:image:width', (string) $img['width'] );
			$tags[] = array( 'property', 'og:image:height', (string) $img['height'] );
		}
		if ( '' !== $img['alt'] ) {
			$tags[] = array( 'property', 'og:image:alt', $img['alt'] );
		}
	}
	if ( 'article' === $type && $post instanceof WP_Post ) {
		$tags[] = array( 'property', 'article:published_time', get_post_time( 'c', true, $post ) );
		$tags[] = array( 'property', 'article:modified_time', get_post_modified_time( 'c', true, $post ) );
	}
	$tags[] = array( 'name', 'twitter:card', $img ? 'summary_large_image' : 'summary' );
	$tags[] = array( 'name', 'twitter:title', $title );
	if ( '' !== $desc ) {
		$tags[] = array( 'name', 'twitter:description', $desc );
	}
	if ( $img ) {
		$tags[] = array( 'name', 'twitter:image', $img['url'] );
	}
	foreach ( (array) apply_filters( 'rankweb_head_tags', $tags ) as $t ) {
		if ( is_array( $t ) && 3 === count( $t ) && '' !== (string) $t[2] ) {
			echo '<meta ' . esc_attr( $t[0] ) . '="' . esc_attr( $t[1] ) . '" content="' . esc_attr( (string) $t[2] ) . '" />' . "\n";
		}
	}
}
add_action(
	'wp_head',
	function () {
		if ( rankweb_prints_head() ) {
			rankweb_print_head_tags();
		}
	},
	1
);

/**
 * Canonical for listings (home, archives, paginated pages). Core prints one only on singular pages.
 * Search results and 404s get none. Each page of a series points at itself.
 */
function rankweb_listing_canonical(): string {
	if ( is_singular() || is_search() || is_404() || is_feed() || is_admin() ) {
		return '';
	}
	$paged = max( 1, (int) get_query_var( 'paged' ) );
	$url   = get_pagenum_link( $paged );
	if ( ! $url ) {
		return '';
	}
	return get_option( 'permalink_structure' ) ? strtok( $url, '?' ) : $url;
}
add_action(
	'wp_head',
	function () {
		if ( ! rankweb_prints_head() ) {
			return;
		}
		$url = rankweb_listing_canonical();
		if ( '' !== $url ) {
			echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
		}
	},
	1
);

/* ---------- robots: noindex by rule, through core's wp_robots (one robots tag) ---------- */

/** Whether the viewed page should stay out of search results, by a post's own setting or a rule of the page kind. */
function rankweb_page_is_noindex(): bool {
	if ( is_singular() ) {
		$id  = get_queried_object_id();
		$raw = rankweb_post_seo_field( $id, 'robots' );
		if ( '' !== $raw && false !== stripos( $raw, 'noindex' ) ) {
			return true;
		}
		if ( '1' === (string) get_post_meta( $id, '_rankweb_noindex', true ) ) {
			return true;
		}
		return false;
	}
	if ( is_search() ) {
		return true; // search result pages are not for the index
	}
	return false;
}

add_filter(
	'wp_robots',
	function ( $robots ) {
		if ( ! rankweb_prints_head() || is_admin() ) {
			return $robots;
		}
		if ( rankweb_page_is_noindex() ) {
			unset( $robots['index'] );
			$robots['noindex'] = true;
			$robots['follow']  = true;
			unset( $robots['max-image-preview'] );
		}
		return $robots;
	},
	20
);

/* ---------- sitemap: items marked noindex stay out of WordPress's sitemap ---------- */

add_filter(
	'wp_sitemaps_posts_query_args',
	function ( $args ) {
		if ( ! rankweb_prints_head() ) {
			return $args;
		}
		$args['meta_query'] = array_merge( // phpcs:ignore WordPress.DB.SlowDBQuery
			(array) ( $args['meta_query'] ?? array() ),
			array(
				'relation' => 'AND',
				array(
					'relation' => 'OR',
					array( 'key' => '_rankweb_noindex', 'compare' => 'NOT EXISTS' ),
					array( 'key' => '_rankweb_noindex', 'value' => '1', 'compare' => '!=' ),
				),
				array(
					'relation' => 'OR',
					array( 'key' => 'rank_math_robots', 'compare' => 'NOT EXISTS' ),
					array( 'key' => 'rank_math_robots', 'value' => 'noindex', 'compare' => 'NOT LIKE' ),
				),
			)
		);
		return $args;
	}
);

/* ---------- schema: an ordinary post or page gets its own node, typed by the sidebar's schema choice ---------- */

/** The schema types RankWeb can write for an ordinary post or page. The sidebar offers exactly these. */
function rankweb_schema_types(): array {
	return array( 'Article', 'BlogPosting', 'NewsArticle', 'WebPage' );
}

/** The type chosen for a post in the sidebar ('' when none was chosen). Only a type PHP can emit is returned. */
function rankweb_post_schema_type( int $post_id ): string {
	$t = (string) get_post_meta( $post_id, '_rankweb_schema_type', true );
	return in_array( $t, rankweb_schema_types(), true ) ? $t : '';
}

/**
 * Schema nodes for an ordinary post or page: a WebPage for a page, the chosen article type for a post, and the
 * trail as a BreadcrumbList. Content types with their own schema (the `aw_*` ones, presets) never come here.
 *
 * @return array[] Nodes.
 */
function rankweb_generic_schema_nodes( int $post_id ): array {
	$post = get_post( $post_id );
	if ( ! $post instanceof WP_Post ) {
		return array();
	}
	$url  = get_permalink( $post );
	$chosen = rankweb_post_schema_type( $post_id );
	$type   = '' !== $chosen ? $chosen : ( 'page' === $post->post_type ? 'WebPage' : 'Article' );
	$desc   = rankweb_post_description( $post );
	$node   = array(
		'@type'            => $type,
		'@id'              => $url . '#' . ( 'WebPage' === $type ? 'webpage' : 'article' ),
		'mainEntityOfPage' => array( '@id' => $url ),
		'url'              => $url,
		'name'             => rankweb_plain_text( get_the_title( $post ) ),
		'isPartOf'         => array( '@id' => home_url( '/#website' ) ),
	);
	if ( 'WebPage' !== $type ) {
		$node['headline']      = mb_substr( rankweb_plain_text( get_the_title( $post ) ), 0, 110 );
		$node['datePublished'] = get_post_time( 'c', true, $post );
		$node['author']        = array( '@type' => 'Person', 'name' => get_the_author_meta( 'display_name', (int) $post->post_author ) );
		$node['publisher']     = array( '@id' => home_url( '/#organization' ) );
	}
	$node['dateModified'] = get_post_modified_time( 'c', true, $post );
	if ( '' !== $desc ) {
		$node['description'] = $desc;
	}
	$img = get_the_post_thumbnail_url( $post, 'large' );
	if ( $img ) {
		$node['image'] = $img;
	}
	$nodes = array( $node );
	$trail = rankweb_generic_trail( $post );
	if ( count( $trail ) > 1 ) {
		$items = array();
		foreach ( $trail as $i => $crumb ) {
			$items[] = array( '@type' => 'ListItem', 'position' => $i + 1, 'name' => $crumb[0], 'item' => $crumb[1] );
		}
		$nodes[] = array( '@type' => 'BreadcrumbList', '@id' => $url . '#breadcrumb', 'itemListElement' => $items );
	}
	return $nodes;
}

/** Home > ancestors > page, for any post (names and addresses only). */
function rankweb_generic_trail( WP_Post $post ): array {
	$trail = array( array( rankweb_site_name(), home_url( '/' ) ) );
	foreach ( array_reverse( get_post_ancestors( $post ) ) as $aid ) {
		$trail[] = array( rankweb_plain_text( get_the_title( $aid ) ), get_permalink( $aid ) );
	}
	$trail[] = array( rankweb_plain_text( get_the_title( $post ) ), get_permalink( $post ) );
	return $trail;
}

/**
 * Apply the sidebar's schema type to an article node another module built (a `post` handled by the article builder).
 *
 * @param array[] $nodes   Nodes.
 * @param int     $post_id Post.
 */
function rankweb_apply_schema_type( array $nodes, int $post_id ): array {
	$chosen = rankweb_post_schema_type( $post_id );
	if ( '' === $chosen || 'WebPage' === $chosen ) {
		return $nodes;
	}
	foreach ( $nodes as $i => $n ) {
		if ( is_array( $n ) && isset( $n['@type'] ) && is_string( $n['@type'] ) && in_array( $n['@type'], array( 'Article', 'BlogPosting', 'NewsArticle' ), true ) ) {
			$nodes[ $i ]['@type'] = $chosen;
		}
	}
	return $nodes;
}

/** A notice on the RankWeb screens when another SEO plugin owns the head. */
add_action(
	'admin_notices',
	function () {
		$name = rankweb_other_seo_plugin();
		if ( '' === $name || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$screen = get_current_screen();
		if ( ! $screen || false === strpos( (string) $screen->id, 'seo' ) && false === strpos( (string) $screen->id, 'rankweb' ) ) {
			return;
		}
		echo '<div class="notice notice-info"><p>' . esc_html( sprintf( /* translators: %s: SEO plugin name */ __( '%s is active, so RankWeb leaves the page head (title, description, robots, Open Graph, schema) to it. RankWeb\'s own tools keep working.', 'rankweb' ), $name ) ) . '</p></div>';
	}
);
