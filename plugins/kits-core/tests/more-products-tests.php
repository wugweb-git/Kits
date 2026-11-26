<?php
/** Standalone checks for the More from Wugweb list. */
define( 'ABSPATH', __DIR__ . '/' );
define( 'KITS_MENU', 'kits' );
function add_action() {}
function add_submenu_page() {}
function __( $s ) { return $s; }
require dirname( __DIR__ ) . '/includes/more-products.php';
$fail = 0;
$p    = kits_more_products();
foreach ( array( 'directoryweb', 'rankweb', 'insightweb', 'sourceweb', 'mailweb', 'planweb' ) as $k ) {
	if ( ! isset( $p[ $k ] ) || 0 !== strpos( $p[ $k ][2], 'https://wugweb.com/plugins/' ) ) {
		echo "FAIL $k\n";
		++$fail;
	}
}
if ( isset( $p['kits-core'] ) ) {
	echo "FAIL kits-core listed\n";
	++$fail;
}
echo $fail ? "$fail failed\n" : "ok 7 checks\n";
exit( $fail ? 1 : 0 );
