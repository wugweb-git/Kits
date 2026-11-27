<?php
/**
 * One page per keyphrase (includes/keyphrase-model.php): a News-role item never takes a phrase an evergreen page owns, the
 * oldest page keeps a phrase. The content types are given through the role map, as a site layer would.
 * Usage: php plugins/rankweb/tests/keyphrase-roles-test.php
 *
 * @package rankweb
 */

// phpcs:disable -- a command-line test with stand-ins for WordPress.
define( 'ABSPATH', '/' );
function apply_filters( $t, $v ) { return 'rankweb_post_type_roles' === $t ? array( 'news' => 'site_news', 'library' => 'site_library' ) : $v; }
require dirname( __DIR__ ) . '/includes/post-type-roles.php';
require dirname( __DIR__ ) . '/includes/keyphrase-model.php';

$fails = 0;
function chk( $ok, $what ) { global $fails; echo ( $ok ? 'ok   ' : 'FAIL ' ) . $what . "\n"; $fails += $ok ? 0 : 1; }

chk( '' === rankweb_seo_kp_refusal( 'site_news', array() ), 'a keyphrase nobody has is allowed' );
chk( 0 === strpos( rankweb_seo_kp_refusal( 'site_news', array( array( 'type' => 'post', 'id' => 7 ) ) ), 'an evergreen page owns' ), 'News never takes a phrase a guide owns' );
chk( false !== strpos( rankweb_seo_kp_refusal( 'site_news', array( array( 'type' => 'site_news', 'id' => 3 ), array( 'type' => 'site_library', 'id' => 9 ) ) ), 'site_library 9' ), 'the reason names the evergreen owner before a News item' );
chk( 0 === strpos( rankweb_seo_kp_refusal( 'post', array( array( 'type' => 'site_news', 'id' => 3 ) ) ), 'another page owns' ), 'a guide is refused a phrase a News item has' );
chk( '' === rankweb_seo_kp_refusal( 'post', array( array( 'type' => 'post', 'id' => 0 ) ) ), 'an owner without an ID is ignored' );
$kp = rankweb_seo_kp_replay( array( array( 'type' => 'site_news', 'id' => 1, 'date' => '2026-01-01' ), array( 'type' => 'post', 'id' => 2, 'date' => '2026-05-01' ), array( 'type' => 'site_news', 'id' => 3, 'date' => '2026-02-01' ) ) );
chk( 2 === $kp['keep']['id'] && 2 === count( $kp['refused'] ), 'the replay keeps the guide over older News items' );
$kp = rankweb_seo_kp_replay( array( array( 'type' => 'site_news', 'id' => 5, 'date' => '2026-03-01' ), array( 'type' => 'site_news', 'id' => 4, 'date' => '2026-02-01' ) ) );
chk( 4 === $kp['keep']['id'] && 5 === $kp['refused'][0]['id'], 'between News items the oldest keeps it' );
echo $fails ? "\n$fails failed\n" : "\nall passed\n";
exit( $fails ? 1 : 0 );
