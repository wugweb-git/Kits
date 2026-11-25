<?php
/**
 * Tests the directoryweb/collection-filter block: registration shape and render behaviour.
 *
 * Usage: php plugins/directoryweb/tests/collection-filter-tests.php
 *
 * @package directoryweb
 */

define( 'ABSPATH', __DIR__ . '/' );
$GLOBALS['registered'] = array();
$GLOBALS['filter_args'] = array();
function add_action( ...$a ) {}
function __( $t ) { return $t; }
function sanitize_key( $s ) { return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $s ) ); }
function register_block_type( $name, $args ) { $GLOBALS['registered'][ $name ] = $args; }
function directoryweb_listing_type_ok( $slug ) { return in_array( $slug, array( 'shelter', 'vet' ), true ); }
function directoryweb_directory_filter( $type = '' ) { $GLOBALS['filter_args'][] = $type; return '<form data-type="' . $type . '"></form>'; }

require dirname( __DIR__ ) . '/includes/directoryweb-collection-filter.php';
directoryweb_register_collection_filter_block();

$pass = 0; $fail = 0;
function check( $ok, $name ) { global $pass, $fail; if ( $ok ) { $pass++; echo "  ok  $name\n"; } else { $fail++; echo "FAIL  $name\n"; } }

$b = $GLOBALS['registered']['directoryweb/collection-filter'] ?? null;
check( null !== $b, 'block registered as directoryweb/collection-filter' );
check( 'directoryweb_collection_filter_render' === $b['render_callback'], 'server-rendered' );
check( '' === $b['attributes']['type']['default'], 'type defaults to all types' );
check( true === $b['supports']['autoRegister'], 'editable without a JS bundle (autoRegister)' );

check( false !== strpos( directoryweb_collection_filter_render( array() ), 'data-type=""' ), 'no type: all types' );
check( false !== strpos( directoryweb_collection_filter_render( array( 'type' => 'shelter' ) ), 'data-type="shelter"' ), 'known type passed through' );
check( false !== strpos( directoryweb_collection_filter_render( array( 'type' => 'x"><script>' ) ), 'data-type=""' ), 'unknown or hostile type falls back to all types' );
check( 0 === strpos( directoryweb_collection_filter_render(), '<div class="wp-block-directoryweb-collection-filter">' ), 'wrapped with the block class' );

echo "\n$pass passed, $fail failed\n";
exit( $fail ? 1 : 0 );
