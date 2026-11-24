#!/usr/bin/env python3
"""Generate the Kits Suite WordPress Playground blueprints.

One base blueprint, six standalone product blueprints and one full-suite blueprint are written next to this
script. Plugin ZIPs are fetched from the GitHub release assets of RELEASE_TAG (never from the gitignored
dist/ folder). Every blueprint ends with a smoke-assertion step that throws (failing the blueprint) when a
check fails, and writes machine-readable results to /results/<name>.json when that folder is mounted (CI).

Usage: python3 tools/playground/build-blueprints.py [--check]   (--check fails if files differ from disk)
"""
from __future__ import annotations

import argparse
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
REPO_SLUG = "wugweb-git/Kits"
RELEASE_TAG = "kits-suite-2026.11.24-pre.1"
ASSET_BASE = f"https://github.com/{REPO_SLUG}/releases/download/{RELEASE_TAG}"
SCHEMA = "https://playground.wordpress.net/blueprint-schema.json"
# Every product declares "Requires at least: 7.1" and "Requires PHP: 8.0". PHP 8.2 is used here because the
# MailWeb SDK needs 8.2; CI additionally runs the PHP 8.0-8.3 unit matrix.
PREFERRED = {"php": "8.2", "wp": "7.1"}

ASSERT_PHP = r"""<?php
require '/wordpress/wp-load.php';
wp_set_current_user( 1 );
do_action( 'admin_menu' );
global $submenu;
$r = array( 'blueprint' => %(name)s, 'wp' => get_bloginfo( 'version' ), 'php' => PHP_VERSION, 'checks' => array(), 'info' => array() );
$c = function ( $n, $ok, $d = '' ) use ( &$r ) { $r['checks'][] = array( 'name' => $n, 'ok' => (bool) $ok, 'detail' => (string) $d ); };
$plugins = %(plugins)s;
foreach ( $plugins as $p ) { $c( 'plugin active: ' . $p, is_plugin_active( $p ) ); }
%(standalone)s
foreach ( %(menus)s as $m ) { $c( 'admin menu registered: ' . $m, isset( $submenu[ $m ] ) ); }
foreach ( %(rest)s as $ns ) { $c( 'REST namespace: ' . $ns, in_array( $ns, rest_get_server()->get_namespaces(), true ) ); }
ob_start(); do_action( 'wp_head' ); $head = ob_get_clean();
$bad = preg_match( '/(Fatal error|Warning|Notice|Deprecated):\s.{0,300}? in \/\S+ on line \d+/s', $head, $mm ) ? $mm[0] : '';
$c( 'frontend wp_head renders without PHP notices', '' === $bad, $bad );
$c( 'content filter renders blocks', false !== strpos( apply_filters( 'the_content', "<!-- wp:paragraph -->\n<p>smoke</p>\n<!-- /wp:paragraph -->" ), 'smoke' ) );
%(extra)s
if ( is_dir( '/results' ) ) { file_put_contents( '/results/' . %(name)s . '.json', wp_json_encode( $r ) ); }
foreach ( $r['checks'] as $x ) { if ( ! $x['ok'] ) { throw new Exception( 'Smoke check failed: ' . $x['name'] . ' ' . $x['detail'] ); } }
"""

STANDALONE = (
    "$c( 'Kits Core NOT active (standalone)', ! is_plugin_active( 'kits-core/kits-core.php' ) && ! defined( 'KITS_CORE_DIR' ) );"
)

PRODUCTS = {
    "directoryweb": {
        "title": "DirectoryWeb Playground",
        "desc": "Standalone directory and place listings engine",
        "landing": "/wp-admin/admin.php?page=directoryweb",
        "menus": ["directoryweb"],
        "rest": ["directoryweb/v1"],
        "fixture": r"""<?php
require '/wordpress/wp-load.php';
if ( post_type_exists( 'aw_listing' ) ) {
	$id = wp_insert_post( array( 'post_title' => 'Sample Community Veterinary Clinic', 'post_content' => 'Sample listing created by the Playground blueprint.', 'post_status' => 'publish', 'post_type' => 'aw_listing' ) );
	if ( $id && ! is_wp_error( $id ) ) { update_post_meta( $id, 'aw_verified', '1' ); }
}
""",
        "extra": r"""
$c( 'claims post type registered', post_type_exists( 'aw_claim' ) );
$listing = post_type_exists( 'aw_listing' );
$c( 'listing post type registered (aw_listing)', $listing, $listing ? '' : 'aw_listing is not registered without an external aw_content_type_args()' );
if ( $listing ) { $c( 'listing fixture created', 1 === (int) wp_count_posts( 'aw_listing' )->publish ); }
$c( 'block registered: directoryweb/collection-filter', WP_Block_Type_Registry::get_instance()->is_registered( 'directoryweb/collection-filter' ) );
if ( $listing ) {
	// Claim journey, no Fluent Forms and no Kits Core: submit, list, approve, verify, revoke.
	$lid = (int) get_posts( array( 'post_type' => 'aw_listing', 'fields' => 'ids', 'posts_per_page' => 1 ) )[0];
	update_post_meta( $lid, 'aw_verified', false );
	$form = directoryweb_ff_form( 'claim', array( 'listing' => $lid ) );
	$c( 'native claim form renders', false !== strpos( $form, 'dw_claim_submit' ) && false !== strpos( $form, '_dw_nonce' ) );
	$bad = dw_claim_create( $lid, array( 'name' => '', 'email' => 'x' ) );
	$c( 'invalid claim refused with field errors', is_wp_error( $bad ) && ! empty( $bad->get_error_data()['errors'] ) );
	$cid = dw_claim_create( $lid, array( 'name' => 'Asha', 'email' => 'asha@example.org', 'role' => 'founder', 'l_phone' => '+91 98765 43210', 'l_area' => 'Indiranagar' ) );
	$c( 'claim created pending', ! is_wp_error( $cid ) && 'pending' === dw_claim_get( $cid )['status'] );
	$nonce = wp_create_nonce( 'wp_rest' ); // cookie-authenticated REST requires the nonce header (directoryweb_rest_can)
	$get = function ( $path, $q = array() ) use ( $nonce ) { $req = new WP_REST_Request( 'GET', $path ); $req->set_header( 'X-WP-Nonce', $nonce ); foreach ( $q as $k => $v ) { $req->set_param( $k, $v ); } return rest_do_request( $req ); };
	$list = $get( '/directoryweb/v1/claims', array( 'status' => 'all' ) )->get_data();
	$ids = is_array( $list ) ? wp_list_pluck( (array) ( $list['rows'] ?? array() ), 'id' ) : array();
	$c( 'native claim appears in the Claims list', in_array( 'dw-' . $cid, $ids, true ), wp_json_encode( $ids ) );
	$det = $get( '/directoryweb/v1/claims/dw-' . $cid );
	$c( 'claim detail endpoint returns the claim', 200 === $det->get_status() && 'pending' === ( $det->get_data()['status'] ?? '' ) );
	$post = function ( $to ) use ( $cid, &$nonce ) { $req = new WP_REST_Request( 'POST', '/directoryweb/v1/claims/' . $cid . '/transition' ); if ( $nonce ) { $req->set_header( 'X-WP-Nonce', $nonce ); } $req->set_param( 'to', $to ); return rest_do_request( $req ); };
	$bad = $post( 'revoked' );
	$c( 'illegal transition returns 409', 409 === $bad->get_status(), (string) $bad->get_status() );
	$ok = $post( 'approved' );
	$c( 'approve via REST', 200 === $ok->get_status(), (string) $ok->get_status() );
	ob_start(); dw_claim_metabox( get_post( $cid ) ); $box = ob_get_clean();
	$c( 'claim review box renders after approval (no fatal, shows state and applied phone)', false !== strpos( $box, 'approved' ) && false !== strpos( $box, '98765' ), substr( wp_strip_all_tags( $box ), 0, 120 ) );
	$c( 'approval verifies listing and applies area', (bool) get_post_meta( $lid, 'aw_verified', true ) && 'Indiranagar' === get_post_meta( $lid, 'aw_area', true ) );
	$rv = $post( 'revoked' );
	$c( 'revoke via REST removes verified mark', 200 === $rv->get_status() && ! get_post_meta( $lid, 'aw_verified', true ) );
	wp_set_current_user( 0 );
	$nonce = '';
	$anon = $post( 'pending' );
	$c( 'anonymous cannot transition claims', in_array( $anon->get_status(), array( 401, 403 ), true ), (string) $anon->get_status() );
	wp_set_current_user( 1 );
	$blk = do_blocks( '<!-- wp:directoryweb/collection-filter /-->' );
	$c( 'collection-filter block renders on the front end', false !== strpos( $blk, 'wp-block-directoryweb-collection-filter' ), substr( wp_strip_all_tags( $blk ), 0, 80 ) );
}
""",
    },
    "rankweb": {
        "title": "RankWeb Playground",
        "desc": "Native SEO controls, internal linking and schema",
        "landing": "/wp-admin/admin.php?page=aw-seo-plus",
        "menus": ["aw-seo-plus"],
        "rest": ["rankweb/v1"],
        "fixture": r"""<?php
require '/wordpress/wp-load.php';
wp_insert_post( array( 'post_title' => 'RankWeb sample post', 'post_content' => '<!-- wp:paragraph --><p>Sample content for SEO checks.</p><!-- /wp:paragraph -->', 'post_status' => 'publish', 'post_type' => 'post' ) );
""",
        "extra": r"""
$c( 'no Rank Math / Yoast required', ! defined( 'RANK_MATH_VERSION' ) && ! defined( 'WPSEO_VERSION' ) );
$r['info']['head_has_canonical'] = false !== strpos( $head, 'rel="canonical"' );
""",
    },
    "sourceweb": {
        "title": "SourceWeb Playground",
        "desc": "Source feeds, syndication and review queue",
        "landing": "/wp-admin/admin.php?page=aw-sourcing-menu",
        "menus": ["aw-sourcing-menu"],
        "rest": ["sourceweb/v1"],
        "fixture": None,
        "extra": "",
    },
    "insightweb": {
        "title": "InsightWeb Playground",
        "desc": "Search insights with honest empty states",
        "landing": "/wp-admin/admin.php?page=aw-search-insights",
        "menus": ["aw-search-insights"],
        "rest": ["insightweb/v1"],
        "fixture": None,
        "extra": r"""
$req = new WP_REST_Request( 'GET', '/insightweb/v1/dashboard' );
$req->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );
$res = rest_do_request( $req );
$c( 'dashboard REST answers 200 with no connection', 200 === $res->get_status(), (string) $res->get_status() );
$body = wp_json_encode( $res->get_data() );
$r['info']['dashboard_payload_bytes'] = strlen( (string) $body );
$c( 'no demo or mock telemetry in payload', ! preg_match( '/"(demo|mock|sample|fake)"\s*:\s*true/i', (string) $body ) );
""",
    },
    "mailweb": {
        "title": "MailWeb Playground",
        "desc": "Hostinger Mail inside WordPress (no credentials configured)",
        "landing": "/wp-admin/admin.php?page=mailweb",
        "menus": ["mailweb"],
        "rest": ["mailweb/v1"],
        "fixture": None,
        "extra": r"""
$c( 'Hostinger Mail API SDK bundled and loadable', class_exists( 'Mailweb_Hostinger_Provider' ) && Mailweb_Hostinger_Provider::has_sdk() );
$c( 'no API token present (no credentials in blueprint)', '' === (string) ( function_exists( 'mailweb_setting' ) ? mailweb_setting( 'api_token' ) : '' ) );
""",
    },
    "planweb": {
        "title": "PlanWeb Playground",
        "desc": "Editorial calendar and milestone planning",
        "landing": "/wp-admin/admin.php?page=planweb",
        "menus": ["planweb"],
        "rest": ["planweb/v1"],
        "fixture": r"""<?php
require '/wordpress/wp-load.php';
if ( post_type_exists( 'planweb_entry' ) ) {
	wp_insert_post( array( 'post_title' => 'Sample milestone', 'post_status' => 'publish', 'post_type' => 'planweb_entry' ) );
}
""",
        "extra": r"""
$c( 'calendar entry type registered', post_type_exists( 'planweb_entry' ) );
$c( 'fixture entry created', 1 === (int) wp_count_posts( 'planweb_entry' )->publish );
""",
    },
}


def php_arr(items):
    return "array( " + ", ".join(json.dumps(i) for i in items) + " )"


def assertion(name, plugins, menus, rest, extra, standalone):
    code = ASSERT_PHP % {
        "name": json.dumps(name),
        "plugins": php_arr(plugins),
        "menus": php_arr(menus),
        "rest": php_arr(rest),
        "extra": extra.strip("\n"),
        "standalone": STANDALONE if standalone else "",
    }
    return {"step": "runPHP", "code": code}


def zip_step(slug):
    return {
        "step": "installPlugin",
        "pluginData": {"resource": "url", "url": f"{ASSET_BASE}/{slug}.zip"},
        "options": {"activate": False},
    }


def base(title, desc, landing):
    return {
        "$schema": SCHEMA,
        "landingPage": landing,
        "preferredVersions": dict(PREFERRED),
        "features": {"networking": True},
        "steps": [
            {"step": "login", "username": "admin", "password": "password"},
            {"step": "setSiteOptions", "options": {"blogname": title, "blogdescription": desc}},
        ],
    }


def build():
    out = {}
    b = base("Kits Suite Playground", "Disposable preview environment for Kits Suite", "/wp-admin/")
    b["steps"].append(assertion("base", [], [], [], "", True))
    out["blueprint-base.json"] = b

    for slug, p in PRODUCTS.items():
        bp = base(p["title"], p["desc"], p["landing"])
        bp["steps"] += [zip_step(slug), {"step": "activatePlugin", "pluginPath": f"{slug}/{slug}.php"}]
        if p["fixture"]:
            bp["steps"].append({"step": "runPHP", "code": p["fixture"]})
        bp["steps"].append(assertion(slug, [f"{slug}/{slug}.php"], p["menus"], p["rest"], p["extra"], True))
        out[f"blueprints/{slug}.json"] = bp

    suite = base("Kits Suite (full)", "Kits Core, the Kits theme and all six companion plugins", "/wp-admin/admin.php?page=kits")
    suite["steps"].append(
        {"step": "installTheme", "themeData": {"resource": "url", "url": f"{ASSET_BASE}/kits-by-wugweb.zip"}, "options": {"activate": True}}
    )
    slugs = ["kits-core"] + list(PRODUCTS)
    for s in slugs:
        suite["steps"] += [zip_step(s), {"step": "activatePlugin", "pluginPath": f"{s}/{s}.php"}]
    allmenus = [m for p in PRODUCTS.values() for m in p["menus"]]
    allrest = [n for p in PRODUCTS.values() for n in p["rest"]]
    suite["steps"].append(
        assertion("suite", [f"{s}/{s}.php" for s in slugs], allmenus, allrest,
                  "$c( 'Kits theme active', 'kits-by-wugweb' === get_stylesheet() );", False)
    )
    out["blueprints/suite.json"] = suite
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    bad = 0
    for rel, data in build().items():
        text = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
        path = HERE / rel
        if args.check:
            if not path.is_file() or path.read_text() != text:
                print(f"OUT OF DATE: {rel}")
                bad += 1
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
            print(f"wrote {rel}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
