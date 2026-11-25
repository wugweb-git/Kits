<?php
/**
 * The claim evidence store's pure parts (includes/claim-evidence.php), without WordPress: stored-name rules, sealing at
 * rest (a file read straight off disk is not the document), tamper and wrong-key handling, upload list handling and the
 * built-in form's refusal of too many files. File content checks and the HTTP paths run in the Playground scripts.
 *
 * Usage: php plugins/directoryweb/tests/claim-evidence-tests.php
 *
 * @package directoryweb
 */

if ( ! defined( 'ABSPATH' ) ) {
	if ( 'cli' !== PHP_SAPI ) {
		exit;
	}
	define( 'ABSPATH', __DIR__ . '/' );
}

// phpcs:disable -- a command-line test runner with stand-ins for WordPress functions.

define( 'MB_IN_BYTES', 1048576 );
$salt = 'salt-one';
function add_action( ...$a ) {}
function apply_filters( $h, $v ) { return $v; }
function wp_salt( $s = 'auth' ) { global $salt; return $salt . $s; }
function size_format( $b, $d = 0 ) { return round( $b / 1048576, 1 ) . ' MB'; }
function wp_check_filetype_and_ext( $f, $n, $m ) { return array( 'ext' => false, 'type' => false ); }

require dirname( __DIR__ ) . '/includes/claim-evidence.php';

$fails = 0;
$count = 0;
function check( $ok, $name ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo 'FAIL: ' . $name . "\n";
	}
}

check( directoryweb_evidence_name_ok( 'abcdefghijklmnopqrstuvwx.png' ) && directoryweb_evidence_name_ok( 'abcdefghijklmnopqrstuvwx.pdf' ), 'a stored name is 24 characters and an accepted extension' );
check( ! directoryweb_evidence_name_ok( '../etc/passwd' ) && ! directoryweb_evidence_name_ok( 'abcdefghijklmnopqrstuvwx.php' ) && ! directoryweb_evidence_name_ok( 'short.png' ) && ! directoryweb_evidence_name_ok( "abcdefghijklmnopqrstuvwx.png\0.php" ), 'traversal, a script extension, a short name and a null byte are refused' );

$doc = "%PDF-1.4\nTHE SECRET DOCUMENT\n%%EOF";
$box = directoryweb_evidence_seal( $doc );
check( 0 === strpos( $box, 'DWE1' ), 'sealed bytes carry the format marker' );
check( false === strpos( $box, 'SECRET' ) && false === strpos( $box, '%PDF-' ), 'sealed bytes contain nothing readable from the document' );
check( $doc === directoryweb_evidence_unseal( $box ), 'sealing round-trips' );
check( directoryweb_evidence_seal( $doc ) !== $box, 'each seal uses a fresh nonce' );
$bad = $box;
$bad[ strlen( $bad ) - 3 ] = $bad[ strlen( $bad ) - 3 ] === 'a' ? 'b' : 'a';
check( '' === directoryweb_evidence_unseal( $bad ), 'a changed byte is refused' );
check( '' === directoryweb_evidence_unseal( $doc ) && '' === directoryweb_evidence_unseal( '' ) && '' === directoryweb_evidence_unseal( 'DWE1short' ), 'plain, empty and truncated files are refused' );
$salt = 'salt-two';
check( '' === directoryweb_evidence_unseal( $box ), 'with other site salts the file cannot be opened' );

$one = directoryweb_evidence_files_list( array( 'name' => 'a.png', 'tmp_name' => '/t/a', 'size' => 5, 'error' => 0 ) );
check( 1 === count( $one ) && 'a.png' === $one[0]['name'], 'a single upload is listed' );
$many = directoryweb_evidence_files_list( array( 'name' => array( 'a.png', 'b.png', '' ), 'tmp_name' => array( '/t/a', '/t/b', '' ), 'size' => array( 5, 6, 0 ), 'error' => array( 0, 0, UPLOAD_ERR_NO_FILE ) ) );
check( 2 === count( $many ), 'a multiple upload is listed, empty slots dropped' );
check( array() === directoryweb_evidence_files_list( null ) && array() === directoryweb_evidence_files_list( array( 'name' => '', 'tmp_name' => '', 'size' => 0, 'error' => UPLOAD_ERR_NO_FILE ) ), 'no file chosen is no upload' );

$errs = directoryweb_evidence_validate_post( array( 'evidence_photos' => array( 'name' => array_fill( 0, 7, 'p.png' ), 'tmp_name' => array_fill( 0, 7, '/nope' ), 'size' => array_fill( 0, 7, 10 ), 'error' => array_fill( 0, 7, 0 ) ) ) );
check( (bool) array_filter( $errs, fn( $e ) => false !== strpos( $e, 'at most 5' ) ), 'seven photos are refused with the limit named' );
$errs = directoryweb_evidence_validate_post( array( 'evidence_proof' => array( 'name' => 'big.pdf', 'tmp_name' => '/nope', 'size' => 1, 'error' => UPLOAD_ERR_INI_SIZE ) ) );
check( 1 === count( $errs ) && false !== strpos( $errs[0], 'too large' ), 'a file the server itself rejected is reported' );
check( array() === directoryweb_evidence_validate_post( array() ), 'no files, no errors' );

echo $count . ' checks, ' . $fails . " failed\n";
exit( $fails ? 1 : 0 );
