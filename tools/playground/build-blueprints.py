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
RELEASE_TAG = "kits-suite-2026.11.25-pre.2"
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
	$c( 'native claim form renders', false !== strpos( $form, 'directoryweb_claim_submit' ) && false !== strpos( $form, '_dw_nonce' ) );
	$bad = directoryweb_claim_create( $lid, array( 'name' => '', 'email' => 'x' ) );
	$c( 'invalid claim refused with field errors', is_wp_error( $bad ) && ! empty( $bad->get_error_data()['errors'] ) );
	$cid = directoryweb_claim_create( $lid, array( 'name' => 'Asha', 'email' => 'asha@example.org', 'role' => 'founder', 'l_phone' => '+91 98765 43210', 'l_area' => 'Indiranagar' ) );
	$c( 'claim created pending', ! is_wp_error( $cid ) && 'pending' === directoryweb_claim_get( $cid )['status'] );
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
	ob_start(); directoryweb_claim_metabox( get_post( $cid ) ); $box = ob_get_clean();
	$c( 'claim review box renders after approval (no fatal, shows state and applied phone)', false !== strpos( $box, 'approved' ) && false !== strpos( $box, '98765' ), substr( wp_strip_all_tags( $box ), 0, 120 ) );
	$c( 'approval verifies listing and applies area', (bool) get_post_meta( $lid, 'aw_verified', true ) && 'Indiranagar' === get_post_meta( $lid, 'aw_area', true ) );
	$rv = $post( 'revoked' );
	$c( 'revoke via REST removes verified mark', 200 === $rv->get_status() && ! get_post_meta( $lid, 'aw_verified', true ) );
	wp_set_current_user( 0 );
	$nonce = '';
	$anon = $post( 'pending' );
	$c( 'anonymous cannot transition claims', in_array( $anon->get_status(), array( 401, 403 ), true ), (string) $anon->get_status() );
	foreach ( array( 'subscriber', 'editor' ) as $role ) {
		$uid = wp_insert_user( array( 'user_login' => 'dw_' . $role, 'user_pass' => wp_generate_password(), 'role' => $role ) );
		wp_set_current_user( $uid );
		$nonce = wp_create_nonce( 'wp_rest' );
		$lst = $get( '/directoryweb/v1/claims', array( 'status' => 'all' ) );
		$c( $role . ' cannot list claims', in_array( $lst->get_status(), array( 401, 403 ), true ), (string) $lst->get_status() );
		$tr = $post( 'approved' );
		$c( $role . ' cannot transition claims', in_array( $tr->get_status(), array( 401, 403 ), true ), (string) $tr->get_status() );
		$c( $role . ' lacks manage_directoryweb', ! current_user_can( 'manage_directoryweb' ) );
	}
	wp_set_current_user( 1 );
	$nonce = wp_create_nonce( 'wp_rest' );
	$blk = do_blocks( '<!-- wp:directoryweb/collection-filter /-->' );
	$c( 'collection-filter block renders on the front end', false !== strpos( $blk, 'wp-block-directoryweb-collection-filter' ), substr( wp_strip_all_tags( $blk ), 0, 80 ) );
	unset( $post ); // the journey's REST helper shares its name with WordPress's global $post, which trashing a post touches
	try {
		// No Animal Writes coupling in the generic plugin.
		$c( 'geocoder identifies this plugin and site, not another site', false !== strpos( directoryweb_geo_user_agent(), 'DirectoryWeb/' ) && false !== strpos( directoryweb_geo_user_agent(), home_url( '/' ) ) && false === stripos( directoryweb_geo_user_agent(), 'animal' ) && ! defined( 'AW_GEO_UA' ) );
		$c( 'the Directory address is this site\'s own /directory/', home_url( '/directory/' ) === directoryweb_hub_url() && ! function_exists( 'aw_hub_url' ) );
		$c( 'listing type is registered by DirectoryWeb itself', post_type_exists( 'aw_listing' ) && ! function_exists( 'aw_content_type_args' ) && 'directory' === get_post_type_object( 'aw_listing' )->rewrite['slug'] );
		// Diagnostics read live state.
		$d0 = directoryweb_claim_diagnostics();
		$c( 'diagnostics: the revoked claim is counted, nothing pending', 1 === $d0['counts']['revoked'] && 0 === $d0['counts']['pending'] && 1 === $d0['total'], wp_json_encode( $d0['counts'] ) );
		$cid2 = directoryweb_claim_create( $lid, array( 'name' => 'Ravi', 'email' => 'ravi@example.org', 'role' => 'staff', 'l_area' => 'Koramangala' ) );
		$d1 = directoryweb_claim_diagnostics();
		$c( 'diagnostics: a new claim moves the pending count', ! is_wp_error( $cid2 ) && 1 === $d1['counts']['pending'] && 2 === $d1['total'] );
		update_option( 'aw_ff_send_email', '0' );
		$off = directoryweb_claim_diagnostics()['mail_on'];
		update_option( 'aw_ff_send_email', '1' );
		$c( 'diagnostics: claim email state follows the setting', false === $off && true === directoryweb_claim_diagnostics()['mail_on'] );
		update_option( 'directoryweb_claim_notify_to', 'desk@example.org' );
		$d2 = directoryweb_claim_diagnostics();
		update_option( 'directoryweb_claim_notify_to', '' );
		$d3 = directoryweb_claim_diagnostics();
		$c( 'diagnostics: notify address is the stored one, else the site admin email', 'desk@example.org' === $d2['notify_to'] && get_option( 'admin_email' ) === $d3['notify_to'] && '' === $d3['notify_stored'] );
		wp_trash_post( $cid2 );
		$c( 'diagnostics: a trashed claim is not counted', 0 === directoryweb_claim_diagnostics()['counts']['pending'] );
		wp_untrash_post( $cid2 );
		ob_start(); directoryweb_claim_status_card(); $card = ob_get_clean();
		$c( 'standalone Settings card shows the status and no claimant details', false !== strpos( $card, 'Claim status' ) && false !== strpos( $card, 'Built-in form' ) && false === strpos( $card, 'asha@example.org' ) && false === strpos( $card, 'ravi@example.org' ) );
		$c( 'diagnostics: scope is built-in claims and sources are labelled', 'built-in' === $d3['scope'] && 'default' === $d3['sources']['notify'] && 'option' === $d2['sources']['notify'] && 'code' === $d3['sources']['limits'] && 'option' === $d3['sources']['page'] );
		delete_option( 'aw_ff_send_email' );
		$c( 'diagnostics: an unset email setting reads as default, not as stored', 'default' === directoryweb_claim_diagnostics()['sources']['mail'] );
		update_option( 'aw_ff_send_email', '1' );
		$c( 'Settings card says counts are built-in and external form claims are not included', false !== strpos( $card, 'Built-in claims: pending' ) && false !== strpos( $card, 'not read and not included' ) && false !== strpos( $card, 'Stored setting' ) && false !== strpos( $card, 'Fixed in code' ) );
		$svc = array_column( directoryweb_settings_payload()['services'], null, 'slug' );
		$c( 'Kits shell Settings payload carries the claims status row', isset( $svc['claims-status'] ) && ! empty( $svc['claims-status']['facts'] ) );
		$c( 'shell row says built-in and that provider claims are not counted', false !== strpos( $svc['claims-status']['summary'], 'built-in' ) && false !== strpos( $svc['claims-status']['summary'], 'not counted' ) );
		$sreq = new WP_REST_Request( 'GET', '/directoryweb/v1/settings' );
		$sreq->set_header( 'X-WP-Nonce', $nonce );
		$c( 'admin can read the settings route', 200 === rest_do_request( $sreq )->get_status() );
		$uid = wp_insert_user( array( 'user_login' => 'directoryweb_sub2', 'user_pass' => wp_generate_password(), 'role' => 'subscriber' ) );
		wp_set_current_user( $uid );
		$sreq2 = new WP_REST_Request( 'GET', '/directoryweb/v1/settings' );
		$sreq2->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );
		$c( 'subscriber cannot read the settings route', in_array( rest_do_request( $sreq2 )->get_status(), array( 401, 403 ), true ) );
		wp_set_current_user( 1 );
		// F6: the Verified mark and registry fields over the real REST API.
		$f6l = wp_insert_post( array( 'post_title' => 'F6 listing', 'post_status' => 'publish', 'post_type' => 'aw_listing', 'post_author' => 0 ) );
		$f6u = wp_insert_user( array( 'user_login' => 'directoryweb_contrib', 'user_pass' => wp_generate_password(), 'role' => 'contributor' ) );
		$f6o = wp_insert_post( array( 'post_title' => 'F6 contributor listing', 'post_status' => 'draft', 'post_type' => 'aw_listing', 'post_author' => $f6u ) );
		$f6 = function ( $meta ) use ( $f6o ) {
			$rq = new WP_REST_Request( 'POST', '/wp/v2/aw_listing/' . $f6o );
			$rq->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );
			$rq->set_body_params( array( 'meta' => $meta ) );
			return rest_do_request( $rq );
		};
		wp_set_current_user( $f6u );
		$ra = $f6( array( 'aw_verified' => true ) );
		$c( 'F6: a contributor cannot set the Verified mark over REST', in_array( $ra->get_status(), array( 400, 401, 403 ), true ) && ! get_post_meta( $f6o, 'aw_verified', true ), (string) $ra->get_status() );
		$rb = $f6( array( 'aw_gov_verified_by' => 'Forged', 'aw_needs_reverify' => false ) );
		$c( 'F6: nor the government source, re-verify flag or registry id', in_array( $rb->get_status(), array( 400, 401, 403 ), true ) && '' === (string) get_post_meta( $f6o, 'aw_gov_verified_by', true ) && '' === (string) get_post_meta( $f6o, 'aw_darpan_id', true ) );
		$rc = $f6( array( 'aw_area' => 'Indiranagar' ) );
		$c( 'F6: a contributor can still edit their own listing\'s descriptive fields', 200 === $rc->get_status() && 'Indiranagar' === get_post_meta( $f6o, 'aw_area', true ), (string) $rc->get_status() );
		wp_set_current_user( 1 );
		$rd = $f6( array( 'aw_verified' => true ) );
		$c( 'F6: an administrator can set the Verified mark', 200 === $rd->get_status() && (bool) get_post_meta( $f6o, 'aw_verified', true ), (string) $rd->get_status() );
		// F6: the other routes a signed-in contributor could take.
		wp_set_current_user( $f6u );
		update_post_meta( $f6o, 'aw_gov_verified_by', 'Forged by plain update_post_meta' );
		$c( 'F6: plain update_post_meta by a contributor is refused', '' === (string) get_post_meta( $f6o, 'aw_gov_verified_by', true ) );
		delete_post_meta( $f6o, 'aw_verified' );
		$c( 'F6: a contributor cannot remove the Verified mark either', (bool) get_post_meta( $f6o, 'aw_verified', true ) );
		$rn = $f6( array( 'aw_verified' => null ) );
		$c( 'F6: nor delete it through REST (null)', (bool) get_post_meta( $f6o, 'aw_verified', true ) && ! in_array( $rn->get_status(), array( 500 ), true ), (string) $rn->get_status() );
		$c( 'F6: the Custom Fields box capability follows (decision fields no, descriptive yes)', ! current_user_can( 'edit_post_meta', $f6o, 'aw_verified' ) && current_user_can( 'edit_post_meta', $f6o, 'aw_area' ) );
		$fld = apply_filters( 'acf/prepare_field', array( 'name' => 'aw_verified', 'type' => 'true_false' ) );
		$fld2 = apply_filters( 'acf/prepare_field', array( 'name' => 'aw_area', 'type' => 'text' ) );
		$c( 'F6: Secure Custom Fields / ACF forms show the decision field read only to a contributor', ! empty( $fld['readonly'] ) && empty( $fld2['readonly'] ) );
		$c( 'F6b: Secure Custom Fields / ACF forms do not draw the team-only fields for a contributor, and still draw public ones', false === apply_filters( 'acf/prepare_field', array( 'name' => 'aw_gov_verified_by', 'type' => 'text' ) ) && false === apply_filters( 'acf/prepare_field', array( 'name' => 'aw_needs_reverify', 'type' => 'true_false' ) ) && is_array( apply_filters( 'acf/prepare_field', array( 'name' => 'aw_reg_date', 'type' => 'text' ) ) ) );
		$bq = new WP_REST_Request( 'POST', '/batch/v1' );
		$bq->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );
		$bq->set_body_params( array( 'requests' => array( array( 'method' => 'POST', 'path' => '/wp/v2/aw_listing/' . $f6o, 'body' => array( 'meta' => array( 'aw_needs_reverify' => true, 'aw_gov_verified_by' => 'Forged' ) ) ) ) ) );
		rest_do_request( $bq );
		$c( 'F6: the REST batch endpoint cannot be used to set them', ! get_post_meta( $f6o, 'aw_needs_reverify', true ) && '' === (string) get_post_meta( $f6o, 'aw_gov_verified_by', true ) );
		wp_set_current_user( 1 );
		// F6b: team-only meta must not appear in any public or non-manager read.
		wp_set_current_user( 1 );
		$priv = array( 'aw_gov_verified_by' => 'Registry source', 'aw_needs_reverify' => true );
		foreach ( $priv as $k => $v ) { update_post_meta( $f6l, $k, $v ); }
		update_post_meta( $f6l, 'aw_gov_verified_on', '2026-02-02' );
		update_post_meta( $f6l, 'aw_area', 'Indiranagar' );
		$leak = function ( $data ) use ( $priv ) { $j = wp_json_encode( $data ); foreach ( array_keys( $priv ) as $k ) { if ( false !== strpos( $j, '"' . $k . '"' ) ) { return $k; } } return ''; };
		$rest_get = function ( $path, $params = array() ) { $rq = new WP_REST_Request( 'GET', $path ); foreach ( $params as $a => $b ) { $rq->set_param( $a, $b ); } return rest_do_request( $rq ); };
		$readers = array( 'anonymous' => 0, 'contributor' => $f6u );
		foreach ( $readers as $who => $rid ) {
			wp_set_current_user( $rid );
			$one = $rest_get( '/wp/v2/aw_listing/' . $f6l );
			$many = $rest_get( '/wp/v2/aw_listing', array( 'per_page' => 50 ) );
			$fld = $rest_get( '/wp/v2/aw_listing/' . $f6l, array( '_fields' => 'meta' ) );
			$emb = rest_get_server()->response_to_data( $rest_get( '/wp/v2/aw_listing/' . $f6l, array( '_embed' => 1 ) ), true );
			$c( 'F6b: ' . $who . ' single read has no team-only meta, and public meta is still there', 200 === $one->get_status() && '' === $leak( $one->get_data() ) && 'Indiranagar' === ( $one->get_data()['meta']['aw_area'] ?? '' ) && '2026-02-02' === ( $one->get_data()['meta']['aw_gov_verified_on'] ?? '' ), $leak( $one->get_data() ) . ' ' . $one->get_status() );
			$c( 'F6b: ' . $who . ' collection read has no team-only meta', 200 === $many->get_status() && '' === $leak( $many->get_data() ), $leak( $many->get_data() ) );
			$c( 'F6b: ' . $who . ' _fields=meta read has none', '' === $leak( $fld->get_data() ), $leak( $fld->get_data() ) );
			$c( 'F6b: ' . $who . ' _embed read has none', '' === $leak( $emb ), $leak( $emb ) );
		}
		wp_set_current_user( 1 );
		foreach ( $priv as $k => $v ) { update_post_meta( $f6o, $k, $v ); }
		wp_set_current_user( $f6u );
		$own = $rest_get( '/wp/v2/aw_listing/' . $f6o, array( 'context' => 'edit' ) );
		$c( 'F6b: a contributor reading their own listing in the editor (edit context) still gets no team-only meta', 200 === $own->get_status() && '' === $leak( $own->get_data() ), $own->get_status() . ' ' . $leak( $own->get_data() ) );
		$bq2 = new WP_REST_Request( 'POST', '/batch/v1' );
		$bq2->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );
		$bq2->set_body_params( array( 'requests' => array( array( 'method' => 'POST', 'path' => '/wp/v2/aw_listing/' . $f6o, 'body' => array( 'meta' => array( 'aw_area' => 'Batch area' ) ) ) ) ) );
		$bres = rest_do_request( $bq2 );
		$c( 'F6b: a batch request\'s response body has no team-only meta', '' === $leak( $bres->get_data() ) );
		$post = apply_filters( 'rest_post_dispatch', new WP_REST_Response( array( 'responses' => array( array( 'body' => array( 'meta' => array( 'aw_gov_verified_by' => 'x', 'aw_area' => 'y' ) ) ) ) ) ), rest_get_server(), new WP_REST_Request( 'POST', '/batch/v1' ) );
		$c( 'F6b: the response-level scrub removes a team-only key from any nested meta, keeps public ones', '' === $leak( $post->get_data() ) && false !== strpos( wp_json_encode( $post->get_data() ), 'aw_area' ) );
		wp_set_current_user( 1 );
		$mgr = $rest_get( '/wp/v2/aw_listing/' . $f6l, array( 'context' => 'edit' ) );
		$mm  = $mgr->get_data()['meta'] ?? array();
		$c( 'F6b: a manager still reads every team-only field', true === ( $mm['aw_needs_reverify'] ?? false ) && 'Registry source' === ( $mm['aw_gov_verified_by'] ?? '' ), wp_json_encode( array_intersect_key( $mm, $priv ) ) );
		$c( 'F6b: a manager still sees the team-only fields in Secure Custom Fields / ACF forms', is_array( apply_filters( 'acf/prepare_field', array( 'name' => 'aw_reg_authority', 'type' => 'text' ) ) ) );
		foreach ( array_keys( $priv ) as $k ) { delete_post_meta( $f6l, $k ); }
		update_post_meta( $f6l, 'aw_verified', true );
		$c( 'F6: code (claim approval, imports) still writes the Verified mark', (bool) get_post_meta( $f6l, 'aw_verified', true ) );
		wp_set_current_user( 1 );
	} catch ( Throwable $e ) {
		$c( 'diagnostics block ran without a fatal', false, $e->getMessage() . ' @' . basename( $e->getFile() ) . ':' . $e->getLine() );
	}
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
$c( 'RankWeb owns the head with no other SEO plugin', 'none' === rankweb_seo_owner() && rankweb_prints_head() );
$pid = wp_insert_post( array( 'post_title' => 'Journey post', 'post_content' => '<!-- wp:paragraph --><p>A short page about dog care in monsoon season, with water, shade and rest for street dogs.</p><!-- /wp:paragraph -->', 'post_status' => 'publish', 'post_type' => 'post' ) );
$cnt = function ( $h, $re ) { return preg_match_all( $re, $h ); };
$view = function () use ( $pid ) { global $wp_query; query_posts( array( 'p' => $pid ) ); ob_start(); do_action( 'wp_head' ); return ob_get_clean(); };
$h = $view();
$c( 'description printed once and from the post', 1 === $cnt( $h, '/<meta name="description"/' ) && false !== strpos( $h, 'dog care in monsoon' ) );
$c( 'Open Graph and Twitter tags printed once each', 1 === $cnt( $h, '/property="og:title"/' ) && 1 === $cnt( $h, '/name="twitter:card"/' ) && 1 === $cnt( $h, '/property="og:url"/' ), $cnt( $h, '/property="og:title"/' ) . '/' . $cnt( $h, '/name="twitter:card"/' ) . '/' . $cnt( $h, '/property="og:url"/' ) . ' ' . substr( preg_replace( '/\s+/', ' ', $h ), 0, 300 ) );
$c( 'canonical printed once', 1 === $cnt( $h, '/rel="canonical"/' ) );
$c( 'WordPress 404 permalink guessing is not switched off', true === apply_filters( 'do_redirect_guess_404_permalink', true ) );
$c( 'no Animal Writes redirect hooks: seed redirects and ?author= rule are gone', ! defined( 'AW_SEED_REDIRECTS_VERSION' ) && false === has_action( 'init', 'aw_seed_redirects' ) );
$c( 'JSON-LD printed once with an Article node', 1 === $cnt( $h, '/application\/ld\+json/' ) && false !== strpos( $h, '"@type":"Article"' ) );
$lst = function ( $args ) { global $wp_query; query_posts( $args ); ob_start(); do_action( 'wp_head' ); return ob_get_clean(); };
$lh = $lst( array( 'paged' => 1 ) );
$c( 'blog listing prints one canonical', 1 === $cnt( $lh, '/rel="canonical"/' ) );
$c( 'search results print no canonical', 0 === $cnt( $lst( array( 's' => 'dog' ) ), '/rel="canonical"/' ) );
update_post_meta( $pid, '_rankweb_schema_type', 'BlogPosting' );
$c( 'sidebar schema type reaches the JSON-LD', false !== strpos( $view(), '"@type":"BlogPosting"' ) );
update_post_meta( $pid, '_rankweb_schema_type', 'Event' );
$c( 'a type PHP cannot write is not printed', false === strpos( $view(), '"@type":"Event"' ) );
update_post_meta( $pid, '_rankweb_description', 'A hand-written description.' );
$c( 'own description wins', false !== strpos( $view(), 'content="A hand-written description."' ) );
update_post_meta( $pid, '_rankweb_noindex', '1' );
$robots = ''; ob_start(); wp_robots(); $robots = ob_get_clean();
query_posts( array( 'p' => $pid ) );
ob_start(); wp_robots(); $robots = ob_get_clean();
$c( 'noindex setting adds noindex through core wp_robots', false !== strpos( $robots, 'noindex' ), $robots );
$sm = wp_sitemaps_get_server()->registry->get_provider( 'posts' ) ? 1 : 0;
$args = apply_filters( 'wp_sitemaps_posts_query_args', array(), 'post' );
$c( 'noindex items are excluded from the sitemap query', ! empty( $args['meta_query'] ) );
foreach ( array( 'dashboard', 'modules', 'settings', 'insights' ) as $scr ) { // the FAQ screen needs a real admin screen (get_current_screen): checked in the browser
	ob_start();
	try { rankweb_ui_page( $scr ); } catch ( Throwable $e ) { echo 'Fatal error: ' . $e->getMessage() . ' at ' . basename( $e->getFile() ) . ':' . $e->getLine(); }
	$out = ob_get_clean();
	$c( 'admin screen renders without Kits Core: ' . $scr, '' !== trim( $out ) && false === strpos( $out, 'needs Kits Core' ) && false === strpos( $out, 'Fatal error' ), substr( wp_strip_all_tags( $out ), 0, 80 ) );
}
rankweb_seo_settings_save( 'schema', array( 'AW_SITE_ALT_NAMES' => "Journey Site\nJS" ) );
$c( 'settings save and persist', array( 'Journey Site', 'JS' ) === ( rankweb_seo_saved()['schema']['AW_SITE_ALT_NAMES'] ?? null ) );
$on = array(); foreach ( rankweb_seo_modules() as $k => $m ) { if ( ! empty( $m['switch'] ) && 'llms' !== $k ) { $on[ $k ] = true; } }
rankweb_seo_settings_save( 'modules', array(), false, $on );
$c( 'switching a module off takes its files out', ! rankweb_seo_module_on( 'llms' ) && in_array( 'llms', rankweb_seo_files_off(), true ) );
$pub = rankweb_aw_leak_probe();
$c( 'no Animal Writes site values in a generic site graph', '' === $pub, $pub );
$r['info']['head_has_canonical'] = false !== strpos( $head, 'rel="canonical"' );
function rankweb_aw_leak_probe() {
	query_posts( array( 'p' => get_posts( array( 'numberposts' => 1, 'fields' => 'ids' ) )[0] ) );
	ob_start(); do_action( 'wp_head' ); $h = ob_get_clean();
	foreach ( array( 'animalwrites.in', 'AnimalWrites', 'Animal Writes', 'animal_writes_' ) as $needle ) {
		if ( false !== stripos( $h, $needle ) ) { return $needle; }
	}
	return '';
}
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
                  "$c( 'Kits theme active', 'kits-by-wugweb' === get_stylesheet() );\n"
                  "$lid = wp_insert_post( array( 'post_title' => 'Fallback listing', 'post_status' => 'publish', 'post_type' => 'aw_listing', 'post_content' => 'x' ) );\n"
                  "$c( 'Kits Core active, Fluent Forms not: the claim form is the built-in one', function_exists( 'kits_ff_form' ) && ! defined( 'FLUENTFORM' ) && directoryweb_claim_native_active() && false !== strpos( directoryweb_claim_form( get_post( $lid ) ), 'directoryweb_claim_submit' ) );", False)
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
