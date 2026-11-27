#!/usr/bin/env python3
"""Open every admin screen of one plugin, installed alone (no Kits Core), in WordPress Playground, using the built ZIPs.

For the chosen plugin blueprint it logs in, finds the plugin's admin menu entries, loads each one and every same-site
wp-admin link on it (one level, GET only, never delete/trash/nonce links), and fails on: HTTP error, PHP fatal, notice or
warning, "not allowed", a quiet bounce to the Dashboard, a screen that only says it needs Kits Core, or an empty screen.
Server-rendered HTML only: screens the Kits shell draws with JavaScript are not rendered here.

Usage: python3 admin-audit-standalone.py --plugin mailweb [--port 9440] [--dist ../../dist]
"""
import argparse, http.cookiejar, json, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request, urllib.error

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

CORE_PAGES = re.compile(r'/wp-admin/(index|edit|upload|themes|plugins|users|profile|tools|import|export|options-[a-z-]+|edit-comments|nav-menus|site-editor|update-core|about|credits|freedoms|privacy|erase-personal-data|export-personal-data|site-health|options)\.php(\?(?!.*page=).*)?$')
SKIP = re.compile(r'(action=(delete|trash|untrash|activate|deactivate|logout)|_wpnonce|wp-login\.php|/wp-admin/(update|plugin-install|theme-install)\.php|customize\.php|load-styles|load-scripts|admin-post\.php|admin-ajax\.php)', re.I)
NEEDS_CORE = re.compile(r'(needs?|requires?)\s+Kits\s+Core|Kits Core is not (loaded|active|installed)', re.I)

JAR = http.cookiejar.CookieJar()
OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR))


def get(url):
    try:
        r = OPENER.open(url, timeout=120)
        return r.status, r.geturl(), r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, url, e.read().decode('utf-8', 'replace')


def problems(url, status, final, body):
    out = []
    if status >= 400:
        out.append(f'HTTP {status}')
    if re.search(r'(Fatal error|Parse error|Uncaught )', body):
        out.append('PHP fatal')
    if re.search(r'<b>(Notice|Warning|Deprecated)</b>:', body):
        out.append('PHP notice/warning')
    if re.search(r'<div class="wp-die-message">|<body id="error-page"', body):
        out.append('"not allowed"')
    want, got = urllib.parse.urlparse(url), urllib.parse.urlparse(final)
    if got.path.endswith('/wp-admin/index.php') and not want.path.endswith('index.php'):
        out.append('bounced to Dashboard')
    if 'wp-login.php' in final:
        out.append('sent to login')
    wrap = re.search(r'<div class="wrap.*?<div id="wpfooter"', body, re.S)
    text = re.sub(r'<[^>]+>', ' ', wrap.group(0)) if wrap else ''
    text = re.sub(r'\s+', ' ', text).strip()
    if wrap and NEEDS_CORE.search(text) and len(text) < 400:
        out.append('only says it needs Kits Core')
    if wrap and len(text) < 40:
        out.append('empty screen')
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--plugin', required=True, choices=['directoryweb', 'rankweb', 'sourceweb', 'insightweb', 'mailweb', 'planweb'])
    ap.add_argument('--port', type=int, default=9440)
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    a = ap.parse_args()
    base = f'http://127.0.0.1:{a.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix=f'aud-{a.plugin}-'))
    bp, mounts = smoke.prepare(smoke.HERE / f'blueprints/{a.plugin}.json', pathlib.Path(a.dist).resolve(), work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bpf = work / 'bp.json'
    bpf.write_text(json.dumps(bp))
    logf = work / 'server.log'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={bpf}', f'--port={a.port}'] + [f'--mount={m}' for m in mounts],
                            stdout=logf.open('w'), stderr=subprocess.STDOUT, cwd=smoke.HERE)
    bad, seen = [], {}
    try:
        for _ in range(300):
            if 'Ready!' in logf.read_text():
                break
            if proc.poll() is not None:
                print(logf.read_text()[-1500:])
                return 2
            time.sleep(2)
        get(base + '/wp-admin/')
        st, final, body = get(base + '/wp-admin/')
        m = re.search(r'<ul[^>]*id="adminmenu".*?</ul>\s*(?=<div id="wpcontent"|</div>)', body, re.S) or re.search(r'id="adminmenu".*', body, re.S)
        menu_html = m.group(0) if m else ''
        links = sorted(set(urllib.parse.urljoin(base + '/wp-admin/', h.replace('&amp;', '&')) for h in re.findall(r'''href=["']([^"']+)["']''', menu_html)))
        links = [u for u in links if u.startswith(base + '/wp-admin/') and not CORE_PAGES.search(u.replace(base, '')) and not SKIP.search(u)]
        print(f'plugin: {a.plugin}; menu entries that are not WordPress core: {len(links)}')
        if not links:
            bad.append(('menu', 'no plugin entries in the admin menu'))
        queue, deeper = [(u, 'menu') for u in links], []
        for u, src in queue:
            if u in seen:
                continue
            st, final, html = get(u)
            seen[u] = (st, final)
            pr = problems(u, st, final, html)
            h1 = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S)
            title = re.sub(r'<[^>]+>', '', h1.group(1)).strip()[:50] if h1 else '-'
            print(('FAIL ' if pr else 'ok   ') + f'[{src}] {u.replace(base, "")[:70]} -> {st} "{title}"' + (f' :: {pr}' if pr else ''))
            if pr:
                bad.append((u, pr))
            wrap = re.search(r'<div class="wrap.*?<div id="wpfooter"', html, re.S)
            if re.search(r'[?&](page|post_type)=', u) and wrap:
                snip = re.sub(r'\s+', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', re.sub(r'<[^>]+>', ' ', wrap.group(0)), flags=re.S)).strip()
                print('       ' + snip[:150])
            for h in re.findall(r'href="([^"#]+)', wrap.group(0) if wrap else ''):
                h = urllib.parse.urljoin(u, h.replace('&amp;', '&'))
                if h.startswith(base + '/wp-admin/') and not SKIP.search(h) and not CORE_PAGES.search(h.replace(base, '')) and re.search(r'[?&](page|post_type)=', h) and 'theme-editor' not in h and 'plugin-editor' not in h:
                    deeper.append((h, u))
        for h, src in deeper:
            if h in seen:
                continue
            st, final, html = get(h)
            seen[h] = (st, final)
            pr = problems(h, st, final, html)
            print(('FAIL ' if pr else 'ok   ') + f'[link] {h.replace(base, "")[:70]} -> {st}' + (f' :: {pr}' if pr else ''))
            if pr:
                bad.append((h, pr))
    finally:
        proc.terminate()
        try:
            proc.wait(15)
        except Exception:
            proc.kill()
        shutil.rmtree(work, ignore_errors=True)
    print(f'\n{len(seen)} pages visited, {len(bad)} with problems')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
