#!/usr/bin/env python3
"""A generic WordPress site with RankWeb active behaves like WordPress: none of Animal Writes' redirects, 410s or 404 overrides run.

Starts the extracted rankweb.zip in Playground, adds one published post, and asks for the addresses RankWeb used to
answer specially. Each must now be handled by WordPress itself.

Usage: python3 http-generic-behavior.py [--dist ../../dist] [--port 9461]
"""
import argparse, http.cookiejar, json, pathlib, shutil, subprocess, sys, tempfile, time, urllib.error, urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

SEED = ("<?php require '/wordpress/wp-load.php'; wp_insert_post(array('post_title'=>'Hello neighbour guide','post_name'=>'hello-neighbour-guide','post_status'=>'publish','post_type'=>'post','post_content'=>'x')); "
        "update_option('permalink_structure','/%postname%/'); flush_rewrite_rules();")


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


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    ap.add_argument('--port', type=int, default=9461)
    a = ap.parse_args()
    base = f'http://127.0.0.1:{a.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='rw-gen-'))
    bp, mounts = smoke.prepare(smoke.HERE / 'blueprints/rankweb.json', pathlib.Path(a.dist).resolve(), work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bp['steps'].append({'step': 'runPHP', 'code': SEED})
    bpf = work / 'bp.json'
    bpf.write_text(json.dumps(bp))
    logf = work / 'server.log'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={bpf}', f'--port={a.port}'] + [f'--mount={m}' for m in mounts],
                            stdout=logf.open('w'), stderr=subprocess.STDOUT, cwd=smoke.HERE)
    res = []

    def check(name, ok, detail=''):
        res.append(bool(ok))
        print(('PASS ' if ok else 'FAIL ') + name + ((' :: ' + str(detail)) if detail and not ok else ''))

    try:
        for _ in range(300):
            if 'Ready!' in logf.read_text():
                break
            if proc.poll() is not None:
                print(logf.read_text()[-1500:])
                return 2
            time.sleep(2)
        WARM.open(base + '/', timeout=120).read()
        loc = lambda h: h.get('Location') or h.get('location') or ''

        st, h, _ = get(base + '/tel:1962')
        check('/tel:1962 is not redirected to a resource page', st not in (301, 302) or 'resources' not in loc(h), (st, loc(h)))
        st, h, _ = get(base + '/tel:112')
        check('/tel:112 gets only the native trailing-slash redirect, not a resource page or the directory', 'resources' not in loc(h) and '/directory' not in loc(h), (st, loc(h)))
        st, h, _ = get(base + '/?author=1')
        check('/?author=1 is not sent to /about/', not loc(h).rstrip('/').endswith('/about'), (st, loc(h)))
        for path in ('/wp-content/plugins/animal-writes-core/visit.php', '/wp-content/plugins/kits-core/assets/js/ad-slot.js', '/aw_listing_type-sitemap.xml', '/news-sitemap2.xml', '/wp-content/plugins/home/u544169507/x.php'):
            st, h, _ = get(base + path)
            check(f'{path} is not answered 410', st != 410, st)
        st, h, _ = get(base + '/Hello-Neighbour-Guide/')
        check('upper-case paths still go to lower case (generic rule kept)', st == 301 and loc(h).endswith('/hello-neighbour-guide/'), (st, loc(h)))
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
