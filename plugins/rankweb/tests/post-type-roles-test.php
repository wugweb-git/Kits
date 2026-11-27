<?php
/**
 * Guard: RankWeb names none of the content types of any one site. The role helpers (includes/post-type-roles.php) answer
 * from the filter rankweb_post_type_roles (empty by default), and no runtime file spells the six slugs.
 *
 * Usage: php plugins/rankweb/tests/post-type-roles-test.php
 *
 * @package rankweb
 */

// phpcs:disable -- a command-line test.

define( 'ABSPATH', __DIR__ . '/' );
$GLOBALS['t_filters'] = array();
function apply_filters( $tag, $value ) {
	foreach ( $GLOBALS['t_filters'][ $tag ] ?? array() as $cb ) {
		$value = $cb( $value );
	}
	return $value;
}
function esc_sql( $s ) {
	return addslashes( $s );
}
require dirname( __DIR__ ) . '/includes/post-type-roles.php';

$fails = 0;
$n     = 0;
function t( $ok, $label ) {
	global $fails, $n;
	++$n;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL: $label\n";
	}
}

t( array() === rankweb_post_type_roles(), 'no roles by default' );
t( '' === rankweb_type( 'news' ) && ! rankweb_is_type( '', 'news' ) && ! rankweb_is_type( 'news', 'news' ), 'an empty role never matches (not even the empty slug)' );
t( array( 'post' ) === rankweb_types_with( array( 'news', 'library' ), array( 'post' ) ), 'empty roles drop out of lists' );
t( '1=0' === rankweb_sql_in_types( 'p.post_type', array() ), 'no types: SQL matches nothing and stays valid' );
$GLOBALS['t_filters']['rankweb_post_type_roles'][] = fn() => array( 'news' => 'story', 'library' => 'doc' );
t( 'story' === rankweb_type( 'news' ) && rankweb_is_type( 'doc', 'library' ) && ! rankweb_is_type( 'doc', 'news' ), 'the site fills roles' );
t( array( 'story', 'doc', 'post' ) === rankweb_types_with( array( 'news', 'library', 'campaign' ), array( 'post' ) ), 'filled roles in order, unfilled skipped' );
t( "p.post_type IN ('story','doc')" === rankweb_sql_in_types( 'p.post_type', array( 'story', 'doc' ) ), 'SQL condition' );

$bad = array();
$it  = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( dirname( __DIR__ ) . '/includes' ) );
foreach ( $it as $f ) {
	if ( 'php' !== $f->getExtension() ) {
		continue;
	}
	$code = '';
	foreach ( token_get_all( file_get_contents( $f->getPathname() ) ) as $tk ) {
		if ( ! is_array( $tk ) || ! in_array( $tk[0], array( T_COMMENT, T_DOC_COMMENT ), true ) ) {
			$code .= is_array( $tk ) ? $tk[1] : $tk;
		}
	}
	if ( preg_match( '/aw_(news|legal|campaign|opportunity|listing|press)\b/', $code, $m ) ) {
		$bad[] = basename( $f->getPathname() ) . ' names ' . $m[0];
	}
}
t( ! $bad, 'no runtime file names the six content types ' . implode( '; ', $bad ) );

echo "$n checks, $fails failed\n";
exit( $fails ? 1 : 0 );
