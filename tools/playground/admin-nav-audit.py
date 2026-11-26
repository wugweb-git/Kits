#!/usr/bin/env python3
"""Walk DirectoryWeb's wp-admin navigation over HTTP in Playground, using the extracted ZIPs.

For the chosen blueprint (directoryweb = standalone, suite = with Kits Core and the theme) it loads the DirectoryWeb
menu and every submenu item, then every same-site wp-admin link found on those pages (one level, GET only, never a
delete/trash/nonce action), and reports any that fail: HTTP error, PHP fatal or notice, "not allowed", or a quiet
bounce to the Dashboard. Server-rendered HTML only: screens the Kits shell draws with JavaScript are checked in the
browser, not here.

Usage: python3 admin-nav-audit.py [--blueprint directoryweb|suite] [--port 9431]
"""
import argparse, http.cookiejar, json, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request, urllib.error

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

SEED = ("<?php require '/wordpress/wp-load.php'; "
        "wp_insert_post(array('post_title'=>'Nav audit listing','post_status'=>'publish','post_type'=>'aw_listing','post_content'=>'x')); "
        "if(function_exists('directoryweb_claim_create')){ $l=get_posts(array('post_type'=>'aw_listing','fields'=>'ids','posts_per_page'=>1)); if($l) directoryweb_claim_create((int)$l[0], array('name'=>'Nav Test','email'=>'nav@example.org','role'=>'founder','l_area'=>'Indiranagar')); } "
        "update_option('permalink_structure','/%postname%/'); flush_rewrite_rules();")

SKIP = re.compile(r'(action=(delete|trash|untrash|activate|deactivate|logout|directoryweb_claim_decide)|_wpnonce|wp-login\.php|/wp-admin/(update|plugin-install|theme-install)\.php|customize\.php|load-styles|load-scripts)', re.I)

JAR = http.cookiejar.CookieJar()
FOLLOW = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR))


def get(url):
    try:
        r = FOLLOW.open(url, timeout=120)
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
    want = urllib.parse.urlparse(url)
    got = urllib.parse.urlparse(final)
    if got.path.endswith('/wp-admin/index.php') and not want.path.endswith('index.php'):
        out.append('bounced to Dashboard')
    if 'wp-login.php' in final:
        out.append('sent to login')
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--blueprint', default='directoryweb')
    ap.add_argument('--port', type=int, default=9431)
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    a = ap.parse_args()
    base = f'http://127.0.0.1:{a.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='dw-nav-'))
    bp, mounts = smoke.prepare(smoke.HERE / f'blueprints/{a.blueprint}.json', pathlib.Path(a.dist).resolve(), work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bp['steps'].append({'step': 'runPHP', 'code': SEED})
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
        get(base + '/wp-admin/')  # Playground logs the browser session in on the first admin request
        st, final, body = get(base + '/wp-admin/admin.php?page=directoryweb')
        kits_core = 'kits-core' in ''.join(re.findall(r'id="toplevel_page_([a-z0-9-]+)"', body)) or 'toplevel_page_kits' in body
        print(f'mode: {a.blueprint}; Kits Core menu present: {kits_core}')
        # the DirectoryWeb menu and its submenu
        m = re.search(r'''<li[^>]*id=["']toplevel_page_directoryweb["'].*?</ul>\s*</li>''', body, re.S)
        menu_html = m.group(0) if m else ''
        if not menu_html:
            # Folded (Kits Core active): one item under Plugins, the other screens as tabs above the screen.
            pm = re.search(r'''<li[^>]*id=["']menu-plugins["'].*?</ul>\s*</li>''', body, re.S)
            if not pm or 'page=directoryweb' not in pm.group(0):
                bad.append(('menu', 'no DirectoryWeb item under Plugins'))
                print('FAIL no DirectoryWeb item under Plugins')
            tm = re.search(r'''<div class="wrap kits-fold-tabs">.*?</nav>''', body, re.S)
            menu_html = tm.group(0) if tm else ''
            print('DirectoryWeb is folded under Plugins; reading its tabs')
        menu = sorted(set(re.findall(r'''href=["']([^"']+)["']''', menu_html)))
        menu = [urllib.parse.urljoin(base + '/wp-admin/', h.replace('&amp;', '&')) for h in menu]
        print(f'DirectoryWeb menu entries: {len(menu)}')
        if not menu:
            bad.append(('menu', 'DirectoryWeb menu not found'))
        if not any('page=aw-claims' in u for u in menu):
            bad.append(('menu', 'no Claims entry in the DirectoryWeb menu'))
            print('FAIL menu has no Claims entry')
        queue = [(u, 'menu') for u in menu]
        # the Claims screen is part of the product even where the menu hides it
        queue.append((base + '/wp-admin/edit.php?post_type=aw_listing&page=aw-claims', 'known'))
        queue.append((base + '/wp-admin/admin.php?page=directoryweb-settings', 'known'))
        queue.append((base + '/wp-admin/edit.php?post_type=aw_claim', 'known'))
        links = []
        for u, src in queue:
            if u in seen:
                continue
            st, final, html = get(u)
            seen[u] = (st, final)
            pr = problems(u, st, final, html)
            print(('FAIL ' if pr else 'ok   ') + f'[{src}] {u.replace(base, "")} -> {st}' + (f' :: {pr}' if pr else ''))
            if pr:
                bad.append((u, pr))
            wrap = re.search(r'<div class="wrap.*?<div id="wpfooter"', html, re.S)
            for h in re.findall(r'href="([^"#]+)', wrap.group(0) if wrap else ''):
                h = urllib.parse.urljoin(u, h.replace('&amp;', '&'))
                if h.startswith(base + '/wp-admin/') and not SKIP.search(h) and 'admin-post.php' not in h:
                    links.append((h, u))
        for h, src in links:
            if h in seen:
                continue
            st, final, html = get(h)
            seen[h] = (st, final)
            pr = problems(h, st, final, html)
            print(('FAIL ' if pr else 'ok   ') + f'[link from {src.replace(base, "")[:40]}] {h.replace(base, "")} -> {st}' + (f' :: {pr}' if pr else ''))
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
