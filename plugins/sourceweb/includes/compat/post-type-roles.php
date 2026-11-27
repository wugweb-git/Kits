<?php
/**
 * Which content type plays which role. SourceWeb runs on any site, so it never names a site's post types: it asks for a
 * role (news, library, campaign, opportunity, listing, press) and the site (or its site layer) says which type that is,
 * through the filter sourceweb_post_type_roles. A role nobody filled is '' and every code path that reads it treats it as
 * "not applicable" (no match, no query, no notice). The listing type is DirectoryWeb's own: it comes from
 * directoryweb_post_type() when DirectoryWeb is loaded.
 *
 * Stored data that holds a post type (option rows keyed by type, a route's place) is read as opaque text; nothing here
 * rewrites it.
 *
 * @package sourceweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The role map: role => post type slug, empty slugs dropped.
 *
 * Filter sourceweb_post_type_roles (default: empty array). Roles: news, library (the legal and document type),
 * campaign, opportunity, listing, press, social.
 *
 * @return array<string,string>
 */
function sourceweb_post_type_roles(): array {
	$map = function_exists( 'apply_filters' ) ? apply_filters( 'sourceweb_post_type_roles', array() ) : array();
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
 * @param string $role news, library, campaign, opportunity, listing, press or social.
 * @return string
 */
function sourceweb_type( string $role ): string {
	if ( 'listing' === $role && function_exists( 'directoryweb_post_type' ) ) {
		$own = directoryweb_post_type();
		if ( is_string( $own ) && '' !== $own ) {
			return $own;
		}
	}
	return sourceweb_post_type_roles()[ $role ] ?? '';
}

/**
 * Whether a post type is the one that plays a role. False when the role has no type (so '' never matches '').
 *
 * @param mixed  $post_type A post type slug.
 * @param string $role      Role name.
 * @return bool
 */
function sourceweb_is_type( $post_type, string $role ): bool {
	$slug = sourceweb_type( $role );
	return '' !== $slug && is_string( $post_type ) && $slug === $post_type;
}

/**
 * Whether a post type plays any of the roles.
 *
 * @param mixed    $post_type A post type slug.
 * @param string[] $roles     Role names.
 * @return bool
 */
function sourceweb_is_any_type( $post_type, array $roles ): bool {
	return is_string( $post_type ) && '' !== $post_type && in_array( $post_type, sourceweb_types( $roles ), true );
}

/**
 * The post types that play the roles: non-empty, no repeats, in the order of the roles.
 *
 * @param string[] $roles Role names.
 * @return string[]
 */
function sourceweb_types( array $roles ): array {
	$out = array();
	foreach ( $roles as $role ) {
		$slug = sourceweb_type( (string) $role );
		if ( '' !== $slug ) {
			$out[] = $slug;
		}
	}
	return array_values( array_unique( $out ) );
}

/**
 * The same, with extra plain types (for example WordPress's own post) added after them.
 *
 * @param string[] $roles Role names.
 * @param string[] $plain Types every site has.
 * @return string[]
 */
function sourceweb_types_with( array $roles, array $plain ): array {
	return array_values( array_unique( array_merge( sourceweb_types( $roles ), $plain ) ) );
}

/**
 * A SQL condition on a post type column: column IN ('a','b'), or 1=0 when the list is empty (nothing matches, and the
 * query stays valid). Values are escaped.
 *
 * @param string   $column Column, e.g. p.post_type (code, never user input).
 * @param string[] $types  Post type slugs.
 * @return string
 */
function sourceweb_sql_in_types( string $column, array $types ): string {
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
 * The post types an incoming item can land in (news, library, opportunity and WordPress's own post): what a duplicate
 * check compares against. Never empty: post is always there.
 *
 * @return string[]
 */
function sourceweb_item_types(): array {
	return sourceweb_types_with( array( 'news', 'library', 'opportunity' ), array( 'post' ) );
}
