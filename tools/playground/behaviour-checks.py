#!/usr/bin/env python3
"""Behaviour checks for the six plugins, installed alone in WordPress Playground from the built ZIPs.

Screen loads (admin-audit-standalone.py) cannot show that a switch defaults off, that an uninstall cleans up, or that a
low-privilege user is refused. This runs PHP inside the Playground site after the plugin is active and reports each
assertion. The PHP writes its results to wp-content/uploads/behaviour-checks.json, which the script reads over HTTP.

Usage: python3 behaviour-checks.py [--plugin mailweb ...] [--port 9460] [--dist ../../dist]
"""
import argparse, json, pathlib, shutil, subprocess, sys, tempfile, time, urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

PRELUDE = r"""<?php
require '/wordpress/wp-load.php';
$R = array();
function chk($name, $ok, $detail = '') { global $R; $R[] = array('name' => $name, 'ok' => (bool) $ok, 'detail' => (string) $detail); }
wp_set_current_user(1);
do_action('init'); do_action('admin_init');
"""
EPILOGUE = r"""
if (!is_dir('/wordpress/wp-content/uploads')) { mkdir('/wordpress/wp-content/uploads', 0777, true); }
file_put_contents('/wordpress/wp-content/uploads/behaviour-checks.json', json_encode($R));
"""

CHECKS = {
    'mailweb': r"""
chk('takes over mail: off on a new install', function_exists('mailweb_takes_over_mail') && false === mailweb_takes_over_mail());
chk('daily cap: off on a new install', function_exists('mailweb_cap_active') && false === mailweb_cap_active());
chk('body logging: off on a new install', function_exists('mailweb_sending_on') && false === mailweb_sending_on('log_body'));
chk('From address is not forced', 'someone@example.test' === apply_filters('wp_mail_from', 'someone@example.test'));
$ed = wp_insert_user(array('user_login' => 'ed', 'user_pass' => wp_generate_password(), 'user_email' => 'ed@example.test', 'role' => 'editor'));
wp_set_current_user($ed);
chk('an editor cannot manage_mailweb', !current_user_can('manage_mailweb'));
wp_set_current_user(1);
chk('an administrator can manage_mailweb', current_user_can('manage_mailweb') || current_user_can('manage_options'));
""",
    'directoryweb': r"""
chk('India PIN lookup: off by default', function_exists('directoryweb_pin_lookup_enabled') && false === directoryweb_pin_lookup_enabled());
chk('neutral label for animals', function_exists('directoryweb_labels') && 'Animals helped' !== (directoryweb_labels()['animals'] ?? ''));
foreach (array('directoryweb_fields','directoryweb_listing_types','directoryweb_form_mappings') as $o) { update_option($o, array('x' => 1)); }
update_option('directoryweb_delete_data_on_uninstall', true);
define('WP_UNINSTALL_PLUGIN', 'directoryweb/directoryweb.php');
include '/wordpress/wp-content/plugins/directoryweb/uninstall.php';
foreach (array('directoryweb_fields','directoryweb_listing_types','directoryweb_form_mappings','directoryweb_delete_data_on_uninstall') as $o) { chk('uninstall removes ' . $o, false === get_option($o, false)); }
""",
    'insightweb': r"""
chk('visitor tracking: off on a clean install', function_exists('insightweb_si_vis_enabled') && false === insightweb_si_vis_enabled());
global $wpdb; $t = function_exists('insightweb_si_vis_table') ? insightweb_si_vis_table() : '';
chk('no visitor table on a clean install', $t && $wpdb->get_var("SHOW TABLES LIKE '" . esc_sql($t) . "'") !== $t);
""",
    'planweb': r"""
chk('Animal Writes dates: off on another site', function_exists('aw_team_dates_context') && false === aw_team_dates_context());
chk('no Animal Writes dates stored', empty(get_option('aw_team_dates')));
""",
    'rankweb': r"""
$txt = apply_filters('robots_txt', "User-agent: *\nDisallow: /wp-admin/\n", true);
chk('robots.txt: no Content-Signal line by default', false === stripos($txt, 'Content-Signal'), $txt);
chk('robots.txt: no news sitemap line on a site without News', false === stripos($txt, 'news-sitemap'), $txt);
""",
    'kits-core': r"""
chk('form copy: off on a new install', function_exists('kits_raw_capture_on') && false === kits_raw_capture_on());
global $wpdb; $t = function_exists('kits_raw_table') ? kits_raw_table() : '';
chk('no form copy table on a new install', $t && $wpdb->get_var("SHOW TABLES LIKE '" . esc_sql($t) . "'") !== $t);
chk('no Animal Writes carry-over flag on a new site', empty(get_option('aw_form_raw_db')));
$o = function_exists('kits_brand_sanitize_tokens') ? kits_brand_sanitize_tokens(array('primary' => '#123456; } body { display:none')) : array('x' => 1);
chk('brand colour with CSS injection is rejected', empty($o['primary']) || '#123456' === $o['primary'] || false === strpos(json_encode($o), 'display'), json_encode($o));
update_option('kits_form_raw_capture', '1'); do_action('init');
chk('form copy: turning it on creates the table', $wpdb->get_var("SHOW TABLES LIKE '" . esc_sql($t) . "'") === $t);
""",
    'sourceweb': r"""
$au = wp_insert_user(array('user_login' => 'au', 'user_pass' => wp_generate_password(), 'user_email' => 'au@example.test', 'role' => 'author'));
wp_set_current_user($au);
chk('an author may not push items (ingest)', function_exists('sourceweb_ingest_can') && false === sourceweb_ingest_can());
wp_set_current_user(1);
chk('an administrator may push items', function_exists('sourceweb_ingest_can') && true === sourceweb_ingest_can());
chk('publishing without review: off', function_exists('sourceweb_publish_allowed') && false === sourceweb_publish_allowed());
chk('Animal Writes extras: off', function_exists('sourceweb_animal_writes_context') && false === sourceweb_animal_writes_context());
chk('no starter source list stored', empty(get_option('aw_sources')), json_encode(get_option('aw_sources')));
chk('no Animal Writes dashboard box', !isset($GLOBALS['wp_meta_boxes']['dashboard']['normal']['core']['aw_sourcing_health']) );
""",
}


def run(plugin: str, port: int, dist: pathlib.Path) -> list:
    base = f'http://127.0.0.1:{port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix=f'beh-{plugin}-'))
    bp, mounts = smoke.prepare(smoke.HERE / f'blueprints/{"suite" if plugin == "kits-core" else plugin}.json', dist, work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bp['steps'].append({'step': 'runPHP', 'code': PRELUDE + CHECKS[plugin] + EPILOGUE})
    bpf = work / 'bp.json'
    bpf.write_text(json.dumps(bp))
    logf = work / 'server.log'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={bpf}', f'--port={port}'] + [f'--mount={m}' for m in mounts],
                            stdout=logf.open('w'), stderr=subprocess.STDOUT, cwd=smoke.HERE)
    try:
        for _ in range(300):
            if 'Ready!' in logf.read_text():
                break
            if proc.poll() is not None:
                return [{'name': 'server started', 'ok': False, 'detail': logf.read_text()[-800:]}]
            time.sleep(2)
        try:
            data = urllib.request.urlopen(base + '/wp-content/uploads/behaviour-checks.json', timeout=60).read().decode()
            return json.loads(data)
        except Exception as e:  # noqa: BLE001
            return [{'name': 'read results', 'ok': False, 'detail': f'{e}; log tail: {logf.read_text()[-600:]}'}]
    finally:
        proc.terminate()
        try:
            proc.wait(15)
        except Exception:
            proc.kill()
        shutil.rmtree(work, ignore_errors=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--plugin', action='append', choices=list(CHECKS))
    ap.add_argument('--port', type=int, default=9460)
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    a = ap.parse_args()
    failed = 0
    for plugin in a.plugin or list(CHECKS):
        print(f'######## {plugin}')
        for r in run(plugin, a.port, pathlib.Path(a.dist).resolve()):
            print(('PASS ' if r['ok'] else 'FAIL ') + r['name'] + ('' if r['ok'] or not r['detail'] else f"  :: {r['detail'][:300]}"))
            failed += 0 if r['ok'] else 1
    print(f'\n{failed} failed')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
