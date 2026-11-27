<?php
/**
 * Animal Writes MailWeb site layer: the moved files are all there, parse, and still define what Kits Core calls.
 *
 * Usage: php sites/animalwrites/mailweb/tests/site-tests.php
 *
 * @package animalwrites-site
 */

$fails = 0;
$count = 0;
function check( $ok, $name ) {
	global $fails, $count;
	++$count;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL $name\n";
	}
}

$dir = dirname( __DIR__ );
$need = array(
	'site.php'              => array( 'plugins_loaded', 'mailweb_fcrm_blocked_emails', 'mailweb_fcrm_tag_titles' ),
	'website-forms.php'     => array( 'mailweb_forms_source', 'AW_HOSTINGER_MAIL_TOKEN', 'function mailweb_wf_forms' ),
	'newsletter.php'        => array( "add_shortcode( 'aw_newsletter'", 'function mailweb_nl_table' ),
	'fluentcrm-compat.php'  => array( 'function aw_crm_on', 'AW_CRM_LIST' ),
	'fluentcrm-aw.php'      => array( 'const MAILWEB_FCRM_BLOCKED_EMAILS', 'const MAILWEB_FCRM_TAG_TITLES', 'function mailweb_fcrm_campaign_signer', 'function mailweb_fcrm_entry_note', 'function mailweb_fcrm_update_link', "'aw crm-setup'" ),
);
foreach ( $need as $file => $needles ) {
	$path = $dir . '/' . $file;
	check( is_readable( $path ), "$file exists" );
	$src = (string) @file_get_contents( $path );
	exec( 'php -l ' . escapeshellarg( $path ) . ' 2>&1', $out, $rc );
	check( 0 === $rc, "$file parses" );
	foreach ( $needles as $n ) {
		check( false !== strpos( $src, $n ), "$file has $n" );
	}
}

// The plugin must no longer define what moved.
$plugin = dirname( $dir, 3 ) . '/plugins/mailweb/includes';
foreach ( array( 'mailweb_fcrm_campaign_signer', 'mailweb_fcrm_entry_note', 'mailweb_fcrm_update_link', 'MAILWEB_FCRM_BLOCKED_EMAILS', 'MAILWEB_FCRM_TAG_TITLES' ) as $n ) {
	$hit = false;
	foreach ( glob( $plugin . '/*.php' ) as $f ) {
		if ( false !== strpos( (string) file_get_contents( $f ), $n ) ) {
			$hit = true;
		}
	}
	check( ! $hit, "plugin no longer mentions $n" );
}

echo $fails ? "$fails of $count checks failed.\n" : "All $count checks passed.\n";
exit( $fails ? 1 : 0 );
