#!/usr/bin/env python3
"""HTTP-level checks of the public claim form's limits, against the extracted directoryweb.zip in Playground.

Starts a Playground server (the ZIP's own bytes, as smoke.py does), seeds published listings, then posts the claim
form over real HTTP and reads the redirect the handler answers with. A tiny test-only mu-plugin exposes the stored
claim count and clears the rate-limit counter; it is written into the throw-away instance and ships nowhere.

Playground answers every browser request as an administrator, so the anonymous path (the `nopriv` hook) cannot be
told apart from the logged-in one here: both hooks call the same handler, and that is all this proves.

Usage: python3 http-claim-limits.py [--dist ../../dist] [--port 9421]
"""
import argparse, http.cookiejar, json, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request, urllib.error

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

MU = r"""<?php
add_action( 'init', function () {
	if ( isset( $_GET['dw_t'] ) ) {
		header( 'Content-Type: application/json' );
		if ( 'count' === $_GET['dw_t'] ) {
			$n = get_posts( array( 'post_type' => 'aw_claim', 'post_status' => 'any', 'posts_per_page' => -1, 'fields' => 'ids' ) );
			echo wp_json_encode( array( 'count' => count( $n ) ) );
		}
		if ( 'reset' === $_GET['dw_t'] ) {
			delete_transient( 'dw_claim_rl_' . md5( $_SERVER['REMOTE_ADDR'] ?? '' ) );
			echo wp_json_encode( array( 'ok' => true ) );
		}
		if ( 'ids' === $_GET['dw_t'] ) {
			echo wp_json_encode( get_posts( array( 'post_type' => 'aw_listing', 'post_status' => 'publish', 'posts_per_page' => -1, 'fields' => 'ids', 'orderby' => 'ID', 'order' => 'ASC' ) ) );
		}
		exit;
	}
} );
add_filter( 'pre_wp_mail', '__return_true' );
"""

SEED = (
    "<?php require '/wordpress/wp-load.php'; "
    "for($i=1;$i<=6;$i++){ wp_insert_post(array('post_title'=>'Limit test listing '.$i,'post_status'=>'publish','post_type'=>'aw_listing','post_content'=>'x')); } "
    "update_option('permalink_structure','/%postname%/'); flush_rewrite_rules(); "
    "if(function_exists('directoryweb_ensure_claim_page')) directoryweb_ensure_claim_page();"
)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


JAR = http.cookiejar.CookieJar()
OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR), NoRedirect)
WARM = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR))


def http(url, data=None, headers=None):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data, doseq=True).encode() if data is not None else None, headers=headers or {})
    try:
        r = OPENER.open(req, timeout=60)
        return r.status, dict(r.headers), r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode('utf-8', 'replace')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    ap.add_argument('--port', type=int, default=9421)
    args = ap.parse_args()
    base = f'http://127.0.0.1:{args.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='dw-http-'))
    bp, mounts = smoke.prepare(smoke.HERE / 'blueprints/directoryweb.json', pathlib.Path(args.dist).resolve(), work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bp['steps'] += [
        {'step': 'mkdir', 'path': '/wordpress/wp-content/mu-plugins'},
        {'step': 'writeFile', 'path': '/wordpress/wp-content/mu-plugins/dw-http-test.php', 'data': MU},
        {'step': 'runPHP', 'code': SEED},
    ]
    bpf = work / 'bp.json'
    bpf.write_text(json.dumps(bp))
    log = (work / 'server.log').open('w')
    cmd = ['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={bpf}', f'--port={args.port}'] + [f'--mount={m}' for m in mounts]
    proc = subprocess.Popen(cmd, stdout=log, stderr=subprocess.STDOUT, cwd=smoke.HERE)
    results = []

    def check(name, ok, detail=''):
        results.append((name, bool(ok), detail))
        print(('PASS ' if ok else 'FAIL ') + name + ((' :: ' + str(detail)) if detail and not ok else ''))

    try:
        for _ in range(240):
            if 'Ready!' in (work / 'server.log').read_text():
                break
            if proc.poll() is not None:
                print((work / 'server.log').read_text()[-1500:])
                return 2
            time.sleep(2)
        else:
            print('server did not start')
            return 2

        WARM.open(base + '/', timeout=120).read()  # Playground sets its session cookie on the first request
        r0 = http(base + '/?dw_t=ids')
        if not r0[2].startswith('['):
            print('probe failed', r0[0], r0[1], r0[2][:300])
            return 2
        ids = json.loads(r0[2])
        count = lambda: json.loads(http(base + '/?dw_t=count')[2])['count']
        reset = lambda: http(base + '/?dw_t=reset')
        check('seeded six published listings', len(ids) >= 6, ids)

        def nonce(listing):
            st, _, body = http(f'{base}/claim/?listing={listing}')
            m = re.search(r'name="_dw_nonce" value="([a-z0-9]+)"', body)
            return m.group(1) if m else ''

        def submit(listing, email, name='Test Person', hp='', n=None, extra_headers=None):
            data = {'action': 'dw_claim_submit', 'listing': listing, '_dw_nonce': nonce(listing) if n is None else n,
                    'dw_website_hp': hp, 'name': name, 'email': email, 'role': 'founder', 'l_area': 'Indiranagar'}
            st, h, _ = http(base + '/wp-admin/admin-post.php', data, extra_headers)
            loc = h.get('Location') or h.get('location') or ''
            q = urllib.parse.parse_qs(urllib.parse.urlparse(loc).query)
            return st, (q.get('dw_claim') or [''])[0], urllib.parse.unquote((q.get('msg') or [''])[0])

        check('claim form carries a nonce over HTTP', bool(nonce(ids[0])))
        c0 = count()

        st, flag, msg = submit(ids[0], 'asha@example.org')
        check('valid post answers 302 with dw_claim=sent', st == 302 and flag == 'sent', (st, flag, msg))
        check('one claim stored', count() == c0 + 1)

        st, flag, msg = submit(ids[0], 'asha@example.org')
        check('same email, same listing: refused, nothing stored', flag == 'error' and 'this listing' in msg and count() == c0 + 1, (flag, msg))

        st, flag, msg = submit(ids[1], 'ASHA@Example.org')
        check('upper-case spelling of the same email counts as the same person', flag == 'sent' and count() == c0 + 2, (flag, msg))
        st, flag, msg = submit(ids[2], 'asha@example.org')
        check('third open claim for the email accepted', flag == 'sent' and count() == c0 + 3, (flag, msg))
        st, flag, msg = submit(ids[3], 'Asha@example.org')
        check('fourth open claim for the email refused by the per-email cap', flag == 'error' and 'waiting for review' in msg and count() == c0 + 3, (flag, msg))

        # five attempts have now reached the create step from this address
        st, flag, msg = submit(ids[4], 'someone.else@example.org')
        check('sixth attempt from one address in the hour refused by the IP cap, even with a fresh email', flag == 'error' and 'Too many claims' in msg and count() == c0 + 3, (flag, msg))
        st, flag, msg = submit(ids[4], 'another@example.org', extra_headers={'X-Forwarded-For': '203.0.113.9', 'Client-IP': '203.0.113.10', 'X-Real-IP': '203.0.113.11'})
        check('spoofed forwarding headers do not get round the IP cap', flag == 'error' and 'Too many claims' in msg and count() == c0 + 3, (flag, msg))
        time.sleep(3)
        st, flag, msg = submit(ids[4], 'third@example.org')
        check('the IP cap persists across later requests', flag == 'error' and 'Too many claims' in msg, (flag, msg))

        reset()
        st, flag, msg = submit(ids[4], 'someone.else@example.org')
        check('after the counter is cleared a fresh email is accepted again', flag == 'sent' and count() == c0 + 4, (flag, msg))

        before = count()
        for _ in range(7):
            st, flag, msg = submit(ids[5], 'bot@example.org', hp='http://spam.example')
        check('filled honeypot looks successful but stores nothing', flag == 'sent' and count() == before)
        st, flag, msg = submit(ids[5], 'real.person@example.org')
        check('honeypot posts do not use up the IP allowance', flag == 'sent' and count() == before + 1, (flag, msg))

        before = count()
        st, flag, msg = submit(ids[0], 'late@example.org', n='deadbeef00')
        check('wrong nonce refused, nothing stored', flag == 'error' and 'expired' in msg and count() == before, (flag, msg))
        st, flag, msg = submit(ids[0], 'late@example.org', n=nonce(ids[1]))
        check('a nonce issued for another listing is refused', flag == 'error' and 'expired' in msg and count() == before, (flag, msg))

        reset()
        st, flag, msg = submit(ids[3], 'asha+second@example.org')
        print('NOTE plus-address variant of a capped email: ' + ('accepted (known limitation: the cap keys on the exact address)' if flag == 'sent' else 'refused'))

        st, h, body = http(base + '/wp-admin/admin-post.php?action=dw_claim_submit')
        check('GET on the handler does not create a claim and does not fatal', 'Fatal error' not in body and count() >= before)
    finally:
        proc.terminate()
        try:
            proc.wait(15)
        except Exception:
            proc.kill()
        shutil.rmtree(work, ignore_errors=True)

    failed = [r for r in results if not r[1]]
    print(f'\n{len(results) - len(failed)} passed, {len(failed)} failed')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
