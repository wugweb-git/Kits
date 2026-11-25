#!/usr/bin/env python3
"""DirectoryWeb alone (no Kits Core, no Animal Writes Core) renders its public pages and routes without a PHP error.

Starts the extracted directoryweb.zip in Playground, seeds typed, placed listings with phones, and requests the public
pages: home, directory hub and a type and place view, a listing, the claim page, the directory map routes, the listing
REST routes, feeds and sitemaps. Each must answer without a fatal error, warning, notice or "critical error" page.

Usage: python3 http-directoryweb-frontend.py [--dist ../../dist] [--port 9471]
"""
import argparse, http.cookiejar, json, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.error, urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

SEED_OLD = ("<?php require '/wordpress/wp-load.php'; wp_insert_post(array('post_title'=>'Hello neighbour guide','post_name'=>'hello-neighbour-guide','post_status'=>'publish','post_type'=>'post','post_content'=>'x')); "
        "update_option('permalink_structure','/%postname%/'); flush_rewrite_rules();")


SEED = r"""<?php require '/wordpress/wp-load.php';
update_option( 'permalink_structure', '/%postname%/' );
$t = wp_insert_term( 'Animal shelter', 'aw_listing_type' );
foreach ( array( 'Asha Shelter', 'Bruno Clinic', 'Cat Haven' ) as $i => $n ) {
	$id = wp_insert_post( array( 'post_title' => $n, 'post_status' => 'publish', 'post_type' => 'aw_listing', 'post_content' => 'A listing for ' . $n, 'post_excerpt' => 'Short text' ) );
	update_post_meta( $id, 'aw_area', 'Indiranagar' ); update_post_meta( $id, 'aw_reg_date', '2015-04-01' ); update_post_meta( $id, 'aw_awbi_valid', '2027-03-31' ); update_post_meta( $id, 'aw_awbi_code', 'AWBI/123' ); update_post_meta( $id, 'aw_services', 'rescue' ); update_post_meta( $id, 'aw_services_on', '2026-05-01' ); update_post_meta( $id, 'aw_darpan_id', 'KA/2015/0001' ); update_post_meta( $id, 'aw_founded', '2015' ); update_post_meta( $id, 'aw_volunteer_url', 'https://example.org/volunteer' ); update_post_meta( $id, 'aw_lat', '12.97' . $i ); update_post_meta( $id, 'aw_lng', '77.64' . $i );
	update_post_meta( $id, 'aw_email', 'x' . $i . '@example.org' ); update_post_meta( $id, 'aw_website', 'https://example.org/' . $i ); update_post_meta( $id, 'aw_verified', $i ? false : true );
	if ( function_exists( 'directoryweb_set_listing_list' ) ) { directoryweb_set_listing_list( $id, 'aw_phones', array( array( 'number' => '98765 4321' . $i, 'label' => 'Office', 'whatsapp' => (bool) $i ) ) ); }
	if ( ! is_wp_error( $t ) ) { wp_set_object_terms( $id, (int) $t['term_id'], 'aw_listing_type' ); }
}
update_option( 'directoryweb_first_listing', (int) get_posts( array( 'post_type' => 'aw_listing', 'fields' => 'ids', 'numberposts' => 1, 'orderby' => 'ID', 'order' => 'ASC' ) )[0] );
flush_rewrite_rules();
"""


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


JAR = http.cookiejar.CookieJar()
OPEN = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR), NoRedirect)
WARM = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR))


def get(url):
    try:
        r = OPEN.open(url, timeout=60)
        return r.status, dict(r.headers), r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode('utf-8', 'replace')


MU_CODE = "<?php\nadd_action( 'init', function () {\n\tif ( ! isset( $_GET['directoryweb_probe'] ) ) { return; }\n\theader( 'Content-Type: application/json' );\n\t$id = (int) get_option( 'directoryweb_first_listing' );\n\t$out = array( 'kits_date_defined' => function_exists( 'kits_date' ), 'kits_core' => function_exists( 'kits_ff_id' ), 'aw_head_band_defined' => function_exists( 'aw_head_band' ), 'aw_item_chip_defined' => function_exists( 'aw_item_chip' ), 'aw_hub_page_defined' => function_exists( 'aw_hub_page' ) );\n\t$tests = array(\n\t\t'directoryweb_listing_validity' => function () { return directoryweb_listing_validity( '2027-03-31' ); },\n\t\t'directoryweb_source_labels' => function () use ( $id ) { return directoryweb_source_labels( $id, true ); },\n\t\t'directoryweb_claim_head_band' => function () { return directoryweb_claim_head_band(); },\n\t\t'claim_head_band_with_listing' => function () use ( $id ) { $_GET['listing'] = $id; return directoryweb_claim_head_band(); },\n\t\t'support_block' => function () use ( $id ) { return function_exists( 'directoryweb_block_listing_support' ) ? directoryweb_block_listing_support( array(), $id ) : 'ok: n/a'; },\n\t);\n\tforeach ( $tests as $k => $f ) {\n\t\ttry { $out[ $k ] = 'ok: ' . substr( trim( strip_tags( (string) $f() ) ), 0, 70 ); } catch ( Throwable $e ) { $out[ $k ] = 'FATAL: ' . $e->getMessage(); }\n\t}\n\techo wp_json_encode( $out );\n\texit;\n} );\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    ap.add_argument('--port', type=int, default=9471)
    a = ap.parse_args()
    base = f'http://127.0.0.1:{a.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='dw-fe-'))
    bp, mounts = smoke.prepare(smoke.HERE / 'blueprints/directoryweb.json', pathlib.Path(a.dist).resolve(), work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bp['steps'].append({'step': 'runPHP', 'code': SEED})
    bp['steps'] += [{'step': 'mkdir', 'path': '/wordpress/wp-content/mu-plugins'}, {'step': 'writeFile', 'path': '/wordpress/wp-content/mu-plugins/dw-probe.php', 'data': MU_CODE}]
    bpf = work / 'bp.json'
    bpf.write_text(json.dumps(bp))
    logf = work / 'server.log'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={bpf}', f'--port={a.port}'] + [f'--mount={m}' for m in mounts],
                            stdout=logf.open('w'), stderr=subprocess.STDOUT, cwd=smoke.HERE)
    res = []
    bad = re.compile(r'(Fatal error|Parse error|Uncaught |<b>(Warning|Notice|Deprecated)</b>|There has been a critical error|Call to undefined function)')

    def check(name, ok, detail=''):
        res.append(bool(ok))
        print(('PASS ' if ok else 'FAIL ') + name + ((' :: ' + str(detail)[:200]) if detail and not ok else ''))

    try:
        for _ in range(300):
            if 'Ready!' in logf.read_text():
                break
            if proc.poll() is not None:
                print(logf.read_text()[-1500:])
                return 2
            time.sleep(2)
        WARM.open(base + '/', timeout=120).read()
        probe = json.loads(get(base + '/?directoryweb_probe=1')[2])
        for k in ('directoryweb_listing_validity', 'directoryweb_source_labels', 'directoryweb_claim_head_band', 'claim_head_band_with_listing', 'support_block'):
            check(f'data-dependent path {k} runs standalone without a fatal error', str(probe.get(k, '')).startswith('ok'), probe.get(k))
        check('the probe really ran without Kits Core or Animal Writes helpers', probe.get('kits_core') is False and probe.get('kits_date_defined') is False and probe.get('aw_head_band_defined') is False, probe)
        st, h, body = get(base + '/wp-json/wp/v2/aw_listing?per_page=1')
        first = json.loads(body)[0] if st == 200 and body.startswith('[') else {}
        link = first.get('link', '')
        pages = [('home', '/'), ('directory hub', '/directory/'), ('directory by type', '/?aw_dir_type=animal-shelter'), ('directory search', '/directory/?s=Asha'),
                 ('listing archive', '/?post_type=aw_listing'), ('claim page without a listing', '/claim/'), ('RSS feed', '/?feed=rss2'), ('core sitemap', '/wp-sitemap.xml'),
                 ('listing sitemap', '/wp-sitemap-posts-aw_listing-1.xml'), ('404 page', '/no-such-page-xyz/')]
        if link:
            pages += [('a listing', '/?post_type=aw_listing&p=' + str(first.get('id'))), ('claim page for that listing', '/claim/?listing=' + str(first.get('id')))]
        for name, path in pages:
            st, h, body = get(base + path)
            m = bad.search(body)
            check(f'{name} renders without a PHP error ({st})', st in (200, 301, 302, 404) and not m and (st != 404 or name == '404 page'), (st, m.group(0) if m else '', path))
        for name, path in [('listing REST list', '/wp-json/wp/v2/aw_listing'), ('DirectoryWeb REST index', '/wp-json/directoryweb/v1'), ('REST root', '/wp-json/')]:
            st, h, body = get(base + path)
            check(f'{name} answers JSON without a PHP error ({st})', st in (200, 401, 403) and not bad.search(body), (st, body[:120]))
        st, h, body = get(base + '/wp-json/')
        routes = [r for r in json.loads(body).get('routes', {}) if r.startswith('/directoryweb/v1') and 'map' in r] if st == 200 else []
        for r in routes[:4]:
            st, h, body = get(base + '/wp-json' + r)
            check(f'public map route {r} answers without a PHP error ({st})', st in (200, 400, 401, 403) and not bad.search(body), (st, body[:120]))
    finally:
        proc.terminate()
        try:
            proc.wait(15)
        except Exception:
            proc.kill()
        shutil.rmtree(work, ignore_errors=True)
    print(f'\n{sum(res)} passed, {len(res) - sum(res)} failed')
    return 0 if all(res) else 1


if __name__ == '__main__':
    sys.exit(main())
