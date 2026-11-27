<?php
/**
 * Kits block renderers (the server side of countdown, metric, share, sticky action, letter, sponsored and socials):
 * what each prints, that it escapes, and that it prints nothing when it has nothing to say. The socials block must
 * also make no request to another site: its markup holds only plain links.
 *
 * Usage: php plugins/kits-core/tests/block-render-tests.php
 *
 * @package kits-core
 */

// phpcs:disable WordPress.WP.AlternativeFunctions, WordPress.Security.EscapeOutput, WordPress.NamingConventions.PrefixAllGlobals, Universal.Files.SeparateFunctionsFromOO -- a command-line test runner with stand-ins.

require __DIR__ . '/wp-stubs.php';

function wp_date( $f ) {
	return $GLOBALS['t_today'] ?? '2026-11-27';
}
function number_format_i18n( $n ) {
	return number_format( (float) $n );
}
function get_the_ID() {
	return $GLOBALS['t_post_id'] ?? 0;
}
function get_permalink( $id ) {
	return 'https://example.test/post-' . $id . '/';
}
function get_the_title( $id ) {
	return 'Post <b>' . $id . '</b>';
}
function kits_share_html( $url, $title, $x, $y, $args ) {
	return '<div class="share" data-url="' . esc_attr( $url ) . '" data-title="' . esc_attr( $title ) . '"></div>';
}
function register_block_type_from_metadata( $dir, $args = array() ) {
	$GLOBALS['t_blocks'][ basename( $dir ) ] = $args['render_callback'] ?? null;
}
function t_no_external( $html, $name ) {
	t( ! preg_match( '/<(script|img|iframe|link|object|embed|video|audio|source)\b/i', $html ) && ! preg_match( '/\b(src|srcset|data-src)=/i', $html ), $name );
}

require dirname( __DIR__ ) . '/includes/blocks-dynamic.php';
do_action( 'init' );

t( isset( $GLOBALS['t_blocks']['countdown'], $GLOBALS['t_blocks']['metric'], $GLOBALS['t_blocks']['share'], $GLOBALS['t_blocks']['sticky-cta'], $GLOBALS['t_blocks']['letter'], $GLOBALS['t_blocks']['sponsored'], $GLOBALS['t_blocks']['socials'] ), 'all seven blocks register a render callback' );
t( is_file( dirname( __DIR__ ) . '/blocks/socials/block.json' ) && 'kits/socials' === json_decode( file_get_contents( dirname( __DIR__ ) . '/blocks/socials/block.json' ), true )['name'], 'the socials block has its block.json' );
foreach ( glob( dirname( __DIR__ ) . '/blocks/*/block.json' ) as $f ) {
	$name = basename( dirname( $f ) );
	t( isset( $GLOBALS['t_blocks'][ $name ] ) || 'hero' === $name, "block.json for $name has a server renderer or is the hero" );
}

// ---- countdown ----
$GLOBALS['t_today'] = '2026-11-27';
$h                  = kits_render_countdown( array( 'date' => '2026-12-02', 'label' => 'to <i>close</i>' ) );
t( false !== strpos( $h, '<strong class="kits-countdown__n">5</strong>' ) && false !== strpos( $h, 'days left' ) && false !== strpos( $h, 'datetime="2026-12-02"' ), 'countdown: five days left' );
t( false === strpos( $h, '<i>' ) && false !== strpos( $h, '&lt;i&gt;close' ), 'countdown: the label is escaped' );
t( false !== strpos( kits_render_countdown( array( 'date' => '2026-11-28' ) ), 'day left' ), 'countdown: one day is singular' );
t( false !== strpos( kits_render_countdown( array( 'date' => '2026-11-27' ) ), 'Last day' ), 'countdown: the last day' );
t( false !== strpos( kits_render_countdown( array( 'date' => '2026-11-01' ) ), 'Closed' ), 'countdown: closed after the date' );
t( '' === kits_render_countdown( array( 'date' => 'soon' ) ) && '' === kits_render_countdown( array() ), 'countdown: no valid date prints nothing' );
add_filter( 'kits_countdown_date', fn() => '2026-12-27' );
t( false !== strpos( kits_render_countdown( array() ), '30</strong>' ), 'countdown: a site gives the date through kits_countdown_date' );

// ---- metric ----
add_filter( 'kits_metric_value', fn( $v, $k ) => 'members' === $k ? 12345 : null, 10, 2 );
$h = kits_render_metric( array( 'key' => 'Members', 'label' => 'Members <u>strong</u>', 'min' => 100 ) );
t( false !== strpos( $h, '12,345' ) && false !== strpos( $h, 'kits-metric__l' ) && false === strpos( $h, '<u>' ), 'metric: a number from the site, label escaped, key cleaned' );
t( '' === kits_render_metric( array( 'key' => 'members', 'min' => 99999 ) ), 'metric: under its threshold prints nothing' );
t( '' === kits_render_metric( array( 'key' => 'unknown' ) ), 'metric: a key the site does not know prints nothing' );

// ---- share ----
$GLOBALS['t_post_id'] = 9;
$h                    = kits_render_share( array() );
t( false !== strpos( $h, 'data-url="https://example.test/post-9/"' ) && false !== strpos( $h, 'data-title="Post 9"' ) && false !== strpos( $h, 'kits-share-block' ), 'share: the current page\'s address and a tag-free title' );
$GLOBALS['t_post_id'] = 0;
t( false !== strpos( kits_render_share( array() ), 'data-url="https://example.test/"' ), 'share: outside a post it shares the home address' );

// ---- sticky action ----
$h = kits_render_sticky_cta( array( 'href' => 'tel:5550100', 'label' => 'Call <b>now</b>' ) );
t( false === strpos( $h, '<b>' ) && false !== strpos( $h, 'kits-sticky-cta__a' ), 'sticky action: label escaped' );
t( '' === kits_render_sticky_cta( array( 'href' => '', 'label' => 'x' ) ) && '' === kits_render_sticky_cta( array( 'href' => '/x', 'label' => '' ) ), 'sticky action: needs both a link and a label' );
t( false === strpos( kits_render_sticky_cta( array( 'href' => 'javascript:alert(1)', 'label' => 'x' ) ), 'javascript:' ), 'sticky action: a javascript: link is not printed' );

// ---- letter ----
$h = kits_render_letter( array( 'grounds' => "One\nTwo <i>x</i>\nThree", 'ticked' => '1, 3', 'to' => 'a@example.test', 'subject' => 'Hi <b>', 'sign' => 'Me' ) );
t( 3 === substr_count( $h, 'type="checkbox"' ) && 2 === substr_count( $h, ' checked>' ), 'letter: one checkbox per ground, the ticked ones checked' );
t( false === strpos( $h, '<i>x</i>' ) && false !== strpos( $h, 'Two &lt;i&gt;x&lt;/i&gt;' ), 'letter: a ground is escaped' );
t( false !== strpos( $h, 'data-kits-letter=' ) && false === strpos( $h, 'Hi <b>' ), 'letter: the config is one escaped attribute without tags' );
t( '' === kits_render_letter( array() ), 'letter: no grounds prints nothing' );

// ---- sponsored ----
$h = kits_render_sponsored( array( 'heading' => 'Friends <b>', 'items' => "Acme | https://acme.test | Food\nBad | http://no-tls.test\n | https://x.test" ) );
t( false !== strpos( $h, 'Sponsored' ) && false !== strpos( $h, 'rel="sponsored noopener"' ) && 1 === substr_count( $h, '<li>' ), 'sponsored: labelled, rel=sponsored, only the valid https row' );
t( false === strpos( $h, '<b>' ), 'sponsored: heading escaped' );
t( '' === kits_render_sponsored( array( 'items' => 'x | http://no-tls.test' ) ), 'sponsored: nothing valid prints nothing' );

// ---- socials ----
$GLOBALS['t_opts']['rank-math-options-titles'] = array(
	'social_url_facebook'        => 'https://www.facebook.com/example',
	'twitter_author_names'       => '@example_org',
	'social_additional_profiles' => "https://www.instagram.com/example/\nhttp://insecure.example.test/x\njavascript:alert(1)\nhttps://mastodon.example.test/@example\nhttps://www.instagram.com/example/",
);
t( array( 'https://www.facebook.com/example', 'https://x.com/example_org' ) === array_slice( kits_social_profiles(), 0, 2 ), 'socials: the site\'s profiles come from the Rank Math options (Facebook, then X from its handle)' );
$h = kits_render_socials( array() );
t( 4 === substr_count( $h, '<li>' ), 'socials: https profiles only, no duplicates (Facebook, X, Instagram, Mastodon)' );
t( false !== strpos( $h, '>Facebook<' ) && false !== strpos( $h, '>X<' ) && false !== strpos( $h, '>Instagram<' ) && false !== strpos( $h, '>mastodon.example.test<' ), 'socials: network names, else the host' );
t( false === strpos( $h, 'insecure.example.test' ) && false === strpos( $h, 'javascript:' ), 'socials: http and javascript: addresses are dropped' );
t( 4 === substr_count( $h, 'rel="me noopener"' ) && 4 === substr_count( $h, 'target="_blank"' ), 'socials: every link has rel and target set' );
t_no_external( $h, 'socials: no script, image, frame or src attribute, so nothing is fetched from another site' );
$h = kits_render_socials( array( 'heading' => 'Follow <b>us</b>', 'profiles' => "https://example.test/a\"onmouseover=\"x\nhttps://ok.example.test/p<script>\nhttps://fine.example.test/" ) );
t( 1 === substr_count( $h, '<li>' ), 'socials: only the clean address of three is listed' );
t( false === strpos( $h, 'onmouseover' ) && false === strpos( $h, '<script>' ), 'socials: an address with a quote or tag is dropped, not escaped into markup' );
t( false !== strpos( $h, 'Follow &lt;b&gt;us&lt;/b&gt;' ) && false !== strpos( $h, 'aria-label="Follow &lt;b&gt;us&lt;/b&gt;"' ), 'socials: the heading is escaped, in the text and in the label' );
$h = kits_render_socials( array( 'profiles' => "https://a.example.test/1\nhttps://b.example.test/2" ) );
t( 2 === substr_count( $h, '<li>' ) && false === strpos( $h, 'facebook' ), 'socials: the block\'s own list wins over the site\'s' );
add_filter( 'kits_social_profiles', fn( $u ) => array( 'https://example.test/only' ) );
$h = kits_render_socials( array() );
t( 1 === substr_count( $h, '<li>' ) && false !== strpos( $h, 'https://example.test/only' ), 'socials: a site changes the list with kits_social_profiles' );
$GLOBALS['t_hooks']['kits_social_profiles'] = array();
$GLOBALS['t_opts']                          = array();
t( '' === kits_render_socials( array() ), 'socials: no profiles prints nothing' );
$many = implode( "\n", array_map( fn( $i ) => 'https://site' . $i . '.example.test/', range( 1, 20 ) ) );
t( 12 === count( kits_socials_clean( explode( "\n", $many ) ) ), 'socials: at most 12 links' );
$src = file_get_contents( dirname( __DIR__ ) . '/includes/blocks-dynamic.php' );
preg_match( '/function kits_render_socials.*?\n}\n/s', $src, $m );
t( ! preg_match( '/wp_remote|file_get_contents|curl_|fopen\(|wp_safe_remote/', $m[0] ?? 'x' ) && ! preg_match( '/wp_remote|file_get_contents|curl_/', substr( $src, strpos( $src, 'function kits_social_profiles' ) ) ), 'socials: the renderer\'s code makes no HTTP call' );

t_done();
