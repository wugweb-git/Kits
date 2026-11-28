<?php
/**
 * Which content type plays which role. RankWeb runs on any site, so it never names a site's post types: it asks for a role
 * (news, library, campaign, opportunity, listing, press) and the site (or its site layer) says which type that is, through
 * the filter rankweb_post_type_roles. A role nobody filled is '' and every code path that reads it treats it as "not
 * applicable" (no match, no query, no notice). The listing type is DirectoryWeb's own: it comes from directoryweb_post_type()
 * when DirectoryWeb is loaded.
 *
 * @package RankWeb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The role map: role => post type slug, empty slugs dropped. Filter rankweb_post_type_roles (default: empty array).
 *
 * @return array<string,string>
 */
function rankweb_post_type_roles(): array {
	$map = function_exists( 'apply_filters' ) ? apply_filters( 'rankweb_post_type_roles', array() ) : array();
	$out = array();
	foreach ( is_array( $map ) ? $map : array() as $role => $slug ) {
		if ( is_string( $role ) && '' !== $role && is_string( $slug ) && '' !== $slug ) {
			$out[ $role ] = $slug;
		}
	}
	return $out;
}

/**
 * The post type that plays a role, or '' when this site has none.
 *
 * @param string $role news, library, campaign, opportunity, listing or press.
 */
function rankweb_type( string $role ): string {
	if ( 'listing' === $role && function_exists( 'directoryweb_post_type' ) ) {
		$own = directoryweb_post_type();
		if ( is_string( $own ) && '' !== $own ) {
			return $own;
		}
	}
	return rankweb_post_type_roles()[ $role ] ?? '';
}

/**
 * Whether a post type is the one that plays a role. False when the role has no type (so '' never matches '').
 *
 * @param mixed  $post_type A post type slug.
 * @param string $role      Role name.
 */
function rankweb_is_type( $post_type, string $role ): bool {
	$slug = rankweb_type( $role );
	return '' !== $slug && is_string( $post_type ) && $slug === $post_type;
}

/**
 * The post types that play the roles: non-empty, no repeats, in the order of the roles.
 *
 * @param string[] $roles Role names.
 * @return string[]
 */
function rankweb_types( array $roles ): array {
	$out = array();
	foreach ( $roles as $role ) {
		$slug = rankweb_type( (string) $role );
		if ( '' !== $slug ) {
			$out[] = $slug;
		}
	}
	return array_values( array_unique( $out ) );
}

/**
 * The same, with extra plain types (WordPress's own post, page) added after them.
 *
 * @param string[] $roles Role names.
 * @param string[] $plain Types every site has.
 * @return string[]
 */
function rankweb_types_with( array $roles, array $plain ): array {
	return array_values( array_unique( array_merge( rankweb_types( $roles ), $plain ) ) );
}

/**
 * Whether a post type plays any of the roles.
 *
 * @param mixed    $post_type A post type slug.
 * @param string[] $roles     Role names.
 */
function rankweb_is_any_type( $post_type, array $roles ): bool {
	return is_string( $post_type ) && '' !== $post_type && in_array( $post_type, rankweb_types( $roles ), true );
}

/**
 * Whether the queried page is a single item of a type that plays one of the roles (never true for a role without a type;
 * WordPress's is_singular() with an empty list would match every page).
 *
 * @param string[] $roles Role names.
 * @param string[] $plain Plain post types to include (for example post).
 */
function rankweb_is_singular( array $roles, array $plain = array() ): bool {
	$types = rankweb_types_with( $roles, $plain );
	return $types && is_singular( $types );
}

/**
 * A SQL condition on a post type column: column IN ('a','b'), or 1=0 when the list is empty. Values are escaped.
 *
 * @param string   $column Column, e.g. p.post_type (code, never user input).
 * @param string[] $types  Post type slugs.
 */
function rankweb_sql_in_types( string $column, array $types ): string {
	$types = array_values( array_filter( array_map( 'strval', $types ), 'strlen' ) );
	if ( ! $types ) {
		return '1=0';
	}
	$quoted = array();
	foreach ( $types as $t ) {
		$quoted[] = "'" . ( function_exists( 'esc_sql' ) ? esc_sql( $t ) : addslashes( $t ) ) . "'";
	}
	return $column . ' IN (' . implode( ',', $quoted ) . ')';
}

/**
 * The post types the SEO items run over (the site's RANKWEB_SEO_ITEM_TYPES constant when it defines one, else the types of the
 * news, library, campaign, opportunity and listing roles plus post and page).
 *
 * @return string[]
 */
function rankweb_item_types(): array {
	if ( defined( 'RANKWEB_SEO_ITEM_TYPES' ) ) {
		return (array) RANKWEB_SEO_ITEM_TYPES;
	}
	return rankweb_types_with( array( 'news', 'library', 'campaign', 'opportunity', 'listing' ), array( 'post', 'page' ) );
}
