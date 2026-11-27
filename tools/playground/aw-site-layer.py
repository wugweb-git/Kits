#!/usr/bin/env python3
"""Load the whole suite (dist/ zips) plus the Animal Writes site layer (sites/animalwrites/*, as must-use plugins, the way each
README says) into WordPress Playground, then assert that the features the plugins no longer carry are back, and crawl the admin.

Usage: python3 aw-site-layer.py [--port 9830]"""
import argparse, importlib.util, json, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import smoke
spec = importlib.util.spec_from_file_location('aud', HERE / 'admin-audit-standalone.py'); aud = importlib.util.module_from_spec(spec); spec.loader.exec_module(aud)

ASSERT = r"""<?php
require '/wordpress/wp-load.php';
wp_set_current_user(1); do_action('init'); do_action('admin_init');
$R = array(); function chk($n,$ok,$d=''){ global $R; $R[]=array('name'=>$n,'ok'=>(bool)$ok,'detail'=>(string)$d); }
$reg = WP_Block_Type_Registry::get_instance();
chk('site layer loaded: directoryweb', function_exists('directoryweb_label'));
chk('DirectoryWeb: Animal Writes wording back', 'Animals helped' === directoryweb_label('animals'), directoryweb_label('animals'));
chk('DirectoryWeb: helplines block back', $reg->is_registered('directoryweb/helplines'));
$schema = function_exists('directoryweb_meta_schema') ? array_keys(directoryweb_meta_schema()) : array();
chk('DirectoryWeb: AWBI / 12A / Darpan fields back in the schema', in_array('aw_awbi_code', $schema, true) && in_array('aw_reg_12a', $schema, true) && in_array('aw_darpan_id', $schema, true), implode(',', array_slice($schema, 0, 60)));
chk('DirectoryWeb: place data file back', function_exists('directoryweb_places_file') ? is_readable(directoryweb_places_file()) : (bool) apply_filters('directoryweb_places_file', ''));
$txt = apply_filters('robots_txt', "User-agent: *\nDisallow: /wp-admin/\n", true);
chk('RankWeb: news sitemap line back in robots.txt', false !== stripos($txt, 'news-sitemap'), $txt);
chk('RankWeb: hubs filled by the site', !empty(apply_filters('rankweb_hubs', array())));
chk('RankWeb: post-type roles filled by the site', !empty(apply_filters('rankweb_post_type_roles', array())), json_encode(apply_filters('rankweb_post_type_roles', array())));
chk('SourceWeb: starter sources back', !empty(apply_filters('sourceweb_starter_sources', array())));
chk('SourceWeb: post-type roles filled', !empty(apply_filters('sourceweb_post_type_roles', array())));
chk('InsightWeb: post-type roles filled', !empty(apply_filters('insightweb_post_type_roles', array())));
chk('PlanWeb: team dates back', function_exists('aw_team_dates_context'));
chk('MailWeb: newsletter shortcode back', shortcode_exists('aw_newsletter'));
chk('Kits Core: campaign letters code back', function_exists('kits_cl_optin_text'));
chk('Kits Core: error page marker kept for installed drop-ins', 'Animal Writes error page' === apply_filters('kits_error_page_marker', KITS_ERROR_PAGE_MARKER), (string) apply_filters('kits_error_page_marker', KITS_ERROR_PAGE_MARKER));
if (!is_dir('/wordpress/wp-content/uploads')) mkdir('/wordpress/wp-content/uploads', 0777, true);
file_put_contents('/wordpress/wp-content/uploads/aw-layer.json', json_encode($R));
"""
SITE_STUB = "<?php\n// What the live site repo supplies itself (not in this repo): the content types and the hubs constant.\nadd_action( 'init', function () { foreach ( array( 'aw_news', 'aw_legal', 'aw_campaign', 'aw_opportunity', 'aw_press' ) as $t ) { if ( ! post_type_exists( $t ) ) { register_post_type( $t, array( 'public' => true, 'label' => $t, 'has_archive' => true, 'rewrite' => array( 'slug' => str_replace( 'aw_', '', $t ) ), 'supports' => array( 'title', 'editor', 'custom-fields' ) ) ); } } }, 1 );\nif ( ! defined( 'AW_HUBS' ) ) { define( 'AW_HUBS', array( 'news' => array( 'type' => 'aw_news', 'title' => 'News' ) ) ); }\n"
LOADER = "<?php\n// Test loader: the same lines each site-layer README gives.\n$d = __DIR__ . '/animalwrites';\nforeach ( array( 'kits-core/kits-core-site.php', 'directoryweb/site.php', 'rankweb/site.php', 'sourceweb/site.php', 'insightweb/site.php', 'mailweb/site.php', 'planweb/site.php' ) as $f ) { if ( is_readable( $d . '/' . $f ) ) { require_once $d . '/' . $f; } }\n"

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--port', type=int, default=9830); ap.add_argument('--layers', default='kits-core/kits-core-site.php,directoryweb/site.php,rankweb/site.php,sourceweb/site.php,insightweb/site.php,mailweb/site.php,planweb/site.php'); a = ap.parse_args()
    base = f'http://127.0.0.1:{a.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='awlayer-'))
    bp, mounts = smoke.prepare(HERE / 'blueprints/suite.json', HERE.parent.parent / 'dist', work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    mu = work / 'mu-plugins'; mu.mkdir()
    shutil.copytree(HERE.parent.parent / 'sites/animalwrites', mu / 'animalwrites', ignore=shutil.ignore_patterns('tests', 'README.md'))
    (mu / 'aa-site-stub.php').write_text(SITE_STUB)
    (mu / 'aw-loader.php').write_text(LOADER.replace("array( 'kits-core/kits-core-site.php', 'directoryweb/site.php', 'rankweb/site.php', 'sourceweb/site.php', 'insightweb/site.php', 'mailweb/site.php', 'planweb/site.php' )", 'array( ' + ', '.join(repr(x) for x in a.layers.split(',')) + ' )'))
    mounts.append(f'{mu}:/wordpress/wp-content/mu-plugins')
    for slug in ('fluentform', 'fluent-crm'):
        bp['steps'].append({'step': 'installPlugin', 'pluginData': {'resource': 'wordpress.org/plugins', 'slug': slug}, 'options': {'activate': True}})
    bp['steps'].append({'step': 'runPHP', 'code': ASSERT})
    (work / 'bp.json').write_text(json.dumps(bp)); logf = work / 'log.txt'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={work}/bp.json', f'--port={a.port}'] + [f'--mount={m}' for m in mounts], stdout=logf.open('w'), stderr=subprocess.STDOUT, cwd=HERE)
    bad = 0
    try:
        for _ in range(400):
            if 'Ready!' in logf.read_text(): break
            if proc.poll() is not None: print(logf.read_text()[-1500:]); return 2
            time.sleep(2)
        try: res = json.loads(urllib.request.urlopen(base + '/wp-content/uploads/aw-layer.json', timeout=120).read())
        except Exception as e: print('could not read results:', e, logf.read_text()[-800:]); return 2
        for r in res:
            print(('PASS ' if r['ok'] else 'FAIL ') + r['name'] + ('' if r['ok'] or not r['detail'] else '  :: ' + r['detail'][:300])); bad += 0 if r['ok'] else 1
        aud.get(base + '/wp-admin/'); st, fin, body = aud.get(base + '/wp-admin/')
        links = sorted(set(urllib.parse.urljoin(base + '/wp-admin/', h.replace('&amp;', '&')) for h in re.findall(r'''href=["']([^"']+)["']''', body)))
        links = [u for u in links if u.startswith(base + '/wp-admin/') and re.search(r'[?&](page|post_type)=', u) and not aud.SKIP.search(u) and not aud.CORE_PAGES.search(u.replace(base, ''))]
        print(f'\ncrawling {len(links)} admin screens with the site layer loaded')
        for u in links:
            st, fin, html = aud.get(u); pr = aud.problems(u, st, fin, html)
            if pr: print('FAIL', u.replace(base, ''), pr); bad += 1
        for u in (base + '/robots.txt', base + '/news-sitemap.xml', base + '/'):
            st, fin, html = aud.get(u); ok = st < 400 and not re.search(r'(Fatal error|Parse error|<b>Warning</b>|<b>Notice</b>)', html)
            print(('PASS ' if ok else 'FAIL ') + f'front: {u.replace(base, "") or "/"} -> {st}'); bad += 0 if ok else 1
    finally:
        proc.terminate()
        try: proc.wait(15)
        except Exception: proc.kill()
        shutil.rmtree(work, ignore_errors=True)
    print(f'\n{bad} problems'); return 1 if bad else 0
if __name__ == '__main__': sys.exit(main())
