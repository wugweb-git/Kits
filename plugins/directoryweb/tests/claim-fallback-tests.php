<?php
/**
 * Which claim form a visitor gets, in all six combinations of Kits Core, Fluent Forms and a configured claim form.
 * Each case runs in its own PHP process, because Fluent Forms and Kits Core are detected by a constant and by functions
 * that cannot be undefined. WordPress is stubbed; Fluent Forms and Kits Core are stubs too, so this proves the decision
 * logic, not a real Fluent Forms install.
 *
 * Usage: php plugins/directoryweb/tests/claim-fallback-tests.php
 *
 * @package directoryweb
 */

$root  = dirname( __DIR__ );
$cases = array(
	// name                         kits   ff     form id configured (0 none, 7 existing, 99 deleted)  expected
	array( 'no Kits, no FF',          false, false, 0,  'native' ),
	array( 'Kits, no FF',             true,  false, 0,  'native' ),
	array( 'no Kits, FF, no form',    false, true,  0,  'native' ),
	array( 'Kits, FF, no form',       true,  true,  0,  'native' ),
	array( 'no Kits, FF, form set',   false, true,  7,  'fluent' ),
	array( 'Kits, FF, form set',      true,  true,  7,  'fluent' ),
	array( 'Kits, FF, form deleted',  true,  true,  99, 'native' ),
	array( 'Kits, no FF, form saved', true,  false, 7,  'native' ),
);

$child = <<<'PHP'
<?php
define( 'ABSPATH', '/' );
define( 'DIRECTORYWEB_CAP', 'manage_directoryweb' );
define( 'HOUR_IN_SECONDS', 3600 );
define( 'DIRECTORYWEB_VERSION', '1.1.0' );
define( 'MINUTE_IN_SECONDS', 60 );
const DIRECTORYWEB_CLAIM_ROLES = array( '' => 'Choose', 'founder' => 'Founder' );
const DIRECTORYWEB_SERVICES = array();
function add_action( ...$a ) {}
function add_filter( ...$a ) {}
function add_shortcode( ...$a ) {}
function absint( $n ) { return abs( (int) $n ); }
function get_option( $k, $d = false ) { return 'aw_ff_forms' === $k ? array( 'claim' => (int) getenv( 'FORM' ) ) : $d; }
function esc_html__( $s ) { return $s; }
function __( $s ) { return $s; }
function current_user_can( $c ) { return false; }
function get_post_type( $id ) { return 'aw_listing'; }
function sanitize_key( $s ) { return (string) $s; }
function esc_url( $u ) { return $u; }
function esc_attr( $s ) { return (string) $s; }
function esc_html( $s ) { return (string) $s; }
function esc_textarea( $s ) { return (string) $s; }
function checked( ...$a ) { return ''; }
function selected( ...$a ) { return ''; }
function admin_url( $p = '' ) { return '/wp-admin/' . $p; }
function wp_register_style( ...$a ) {}
function wp_enqueue_style( ...$a ) {}
function wp_add_inline_style( ...$a ) {}
function wp_nonce_field( ...$a ) { return '<input name="_dw_nonce">'; }
function get_transient( $k ) { return false; }
function wp_unslash( $v ) { return $v; }
function get_the_title( $id ) { return 'Listing'; }
function get_permalink( $id ) { return '/l/'; }
function esc_html_e( $s ) { echo $s; }
function do_shortcode( $s ) { return 'FLUENT:' . $s; }
if ( getenv( 'FF' ) ) { define( 'FLUENTFORM', true ); }
function directoryweb_ff_forms(): array { return defined( 'FLUENTFORM' ) ? array( 7 => 'Claim form' ) : array(); }
if ( getenv( 'KITS' ) ) {
	function kits_ff_id( $key ) { return defined( 'FLUENTFORM' ) ? (int) ( get_option( 'aw_ff_forms' )[ $key ] ?? 0 ) : 0; }
	function kits_ff_form( $key, $ctx = array() ) { return 'KITS-FF-FORM'; }
}
require getenv( 'ROOT' ) . '/includes/claim-native.php';
require getenv( 'ROOT' ) . '/includes/standalone-fallback.php';
echo directoryweb_claim_native_active() ? 'native' : 'fluent', '|', directoryweb_ff_form( 'claim', array( 'listing' => 5 ) );
PHP;
$file = tempnam( sys_get_temp_dir(), 'dwfb' );
file_put_contents( $file, $child );

$pass = 0;
$fail = 0;
foreach ( $cases as $c ) {
	list( $name, $kits, $ff, $form, $want ) = $c;
	$out = (string) shell_exec( sprintf( 'ROOT=%s KITS=%s FF=%s FORM=%d php %s 2>&1', escapeshellarg( $root ), $kits ? '1' : '', $ff ? '1' : '', $form, escapeshellarg( $file ) ) );
	$decided = strtok( $out, '|' );
	$html    = (string) strstr( $out, '|' );
	if ( 'native' === $want ) {
		$ok = 'native' === $decided && false !== strpos( $html, 'directoryweb_claim_submit' );
	} else {
		$ok = 'fluent' === $decided && ( $kits ? false !== strpos( $html, 'KITS-FF-FORM' ) : false !== strpos( $html, 'FLUENT:[fluentform id="7"]' ) );
	}
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $name . ( $ok ? '' : ' :: ' . substr( $out, 0, 200 ) ) . "\n";
	$ok ? $pass++ : $fail++;
}
unlink( $file );
echo "\n{$pass} passed, {$fail} failed\n";
exit( $fail ? 1 : 0 );
