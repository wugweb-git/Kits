#!/usr/bin/env python3
"""HTTP-level checks of claim evidence uploads (logo, photos, proof) on the built-in claim form, against the extracted directoryweb.zip in Playground.

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
		$t = $_GET['dw_t'];
		if ( 'ids' === $t ) {
			echo wp_json_encode( get_posts( array( 'post_type' => 'aw_listing', 'post_status' => 'publish', 'posts_per_page' => -1, 'fields' => 'ids', 'orderby' => 'ID', 'order' => 'ASC' ) ) );
		}
		if ( 'reset' === $t ) {
			delete_transient( 'dw_claim_rl_' . md5( $_SERVER['REMOTE_ADDR'] ?? '' ) );
			echo wp_json_encode( array( 'ok' => true ) );
		}
		if ( 'claims' === $t ) {
			$o = array();
			foreach ( get_posts( array( 'post_type' => 'aw_claim', 'post_status' => 'any', 'posts_per_page' => -1, 'orderby' => 'ID', 'order' => 'ASC' ) ) as $p ) {
				$o[] = array( 'id' => $p->ID, 'evidence' => dw_evidence_get( $p->ID ), 'history' => json_decode( (string) get_post_meta( $p->ID, '_dw_claim_history', true ), true ) );
			}
			echo wp_json_encode( $o );
		}
		if ( 'dir' === $t ) {
			$d = dw_evidence_dir();
			echo wp_json_encode( array( 'dir' => basename( $d ), 'files' => array_values( array_diff( scandir( $d ), array( '.', '..' ) ) ), 'htaccess' => is_file( $d . '/.htaccess' ) ? file_get_contents( $d . '/.htaccess' ) : '', 'index' => is_file( $d . '/index.php' ), 'perm' => wp_upload_dir()['basedir'] ) );
		}
		if ( 'link' === $t ) {
			wp_set_current_user( 1 );
			echo wp_json_encode( array( 'url' => dw_evidence_link( sanitize_file_name( $_GET['f'] ) ) ) );
		}
		if ( 'approve' === $t ) {
			wp_set_current_user( 1 );
			$r = dw_claim_transition( (int) $_GET['id'], 'approved', 1 );
			$l = (int) get_post_meta( (int) $_GET['id'], '_dw_claim_listing', true );
			echo wp_json_encode( array( 'ok' => true === $r, 'err' => is_wp_error( $r ) ? $r->get_error_message() : '', 'thumb' => has_post_thumbnail( $l ), 'attachments' => count( get_posts( array( 'post_type' => 'attachment', 'post_parent' => $l, 'post_status' => 'any', 'fields' => 'ids', 'posts_per_page' => -1 ) ) ), 'applied' => json_decode( (string) get_post_meta( (int) $_GET['id'], '_dw_claim_applied', true ) ) ) );
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



import io, struct, zlib, uuid

def png(w=64, h=64):
    raw = b''.join(b'\x00' + bytes([(x * 4) % 256, (y * 4) % 256, 128]) * 1 * 1 for y in range(h) for x in range(1)) 
    raw = b''.join(b'\x00' + b'\x80\x40\xc0' * w for _ in range(h))
    def chunk(t, d):
        c = struct.pack('>I', len(d)) + t + d
        return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b'')

PDF = b'%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n'
EVIL = b'<?php echo "pwned"; ?>'


def multipart(fields, files):
    b = uuid.uuid4().hex
    out = io.BytesIO()
    for k, v in fields.items():
        vals = v if isinstance(v, list) else [v]
        for x in vals:
            out.write(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{x}\r\n'.encode())
    for k, name, ctype, data in files:
        out.write(f'--{b}\r\nContent-Disposition: form-data; name="{k}"; filename="{name}"\r\nContent-Type: {ctype}\r\n\r\n'.encode() + data + b'\r\n')
    out.write(f'--{b}--\r\n'.encode())
    return out.getvalue(), f'multipart/form-data; boundary={b}'


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    ap.add_argument('--port', type=int, default=9441)
    args = ap.parse_args()
    base = f'http://127.0.0.1:{args.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='dw-ev-'))
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
        WARM.open(base + '/', timeout=120).read()
        ids = json.loads(http(base + '/?dw_t=ids')[2])
        claims = lambda: json.loads(http(base + '/?dw_t=claims')[2])
        pdir = lambda: json.loads(http(base + '/?dw_t=dir')[2])
        reset = lambda: http(base + '/?dw_t=reset')

        def nonce(listing):
            m = re.search(r'name="_dw_nonce" value="([a-z0-9]+)"', http(f'{base}/claim/?listing={listing}')[2])
            return m.group(1) if m else ''

        def form_html(listing):
            return http(f'{base}/claim/?listing={listing}')[2]

        def post(listing, email, files, name='Asha Rao'):
            fields = {'action': 'dw_claim_submit', 'listing': str(listing), '_dw_nonce': nonce(listing), 'dw_website_hp': '', 'name': name, 'email': email, 'role': 'founder', 'l_area': 'Indiranagar'}
            body, ctype = multipart(fields, files)
            req = urllib.request.Request(base + '/wp-admin/admin-post.php', data=body, headers={'Content-Type': ctype})
            try:
                r = OPENER.open(req, timeout=120)
                st, h = r.status, dict(r.headers)
            except urllib.error.HTTPError as e:
                st, h = e.code, dict(e.headers)
            loc = h.get('Location') or h.get('location') or ''
            q = urllib.parse.parse_qs(urllib.parse.urlparse(loc).query)
            return st, (q.get('dw_claim') or [''])[0], urllib.parse.unquote((q.get('msg') or [''])[0])

        html = form_html(ids[0])
        check('the claim form has multipart encoding and the three file fields', 'enctype="multipart/form-data"' in html and 'name="evidence_proof"' in html and 'name="evidence_logo"' in html and 'name="evidence_photos[]"' in html)

        st, flag, msg = post(ids[0], 'a1@example.org', [('evidence_proof', 'proof.pdf', 'application/pdf', PDF), ('evidence_logo', 'logo.png', 'image/png', png(300, 200)), ('evidence_photos[]', 'p1.png', 'image/png', png()), ('evidence_photos[]', 'p2.png', 'image/png', png())])
        check('a claim with proof, logo and two photos is accepted', st == 302 and flag == 'sent', (st, flag, msg))
        c = claims()
        ev = c[-1]['evidence'] if c else {}
        check('all four files are stored and listed on the claim', len(ev.get('proof', [])) == 1 and len(ev.get('logo', [])) == 1 and len(ev.get('photos', [])) == 2, ev)
        d = pdir()
        check('they sit in DirectoryWeb\'s own folder, not a Kits Core folder', d['dir'] == 'directoryweb-private' and len(d['files']) >= 6, d['files'])
        check('the folder is closed to the web server and has an index', 'denied' in d['htaccess'] or 'Deny from all' in d['htaccess'])
        check('stored names are random and carry no original file name', all(re.match(r'^[a-z0-9]{24}\.(png|pdf)$', f) for f in d['files'] if f not in ('.htaccess', 'index.php')), d['files'])

        before = len(claims())
        st, flag, msg = post(ids[1], 'a2@example.org', [('evidence_logo', 'logo.png', 'image/png', EVIL)])
        check('a script renamed .png is refused with a reason, and no claim is stored', flag == 'error' and 'Logo' in msg and len(claims()) == before, (flag, msg))
        st, flag, msg = post(ids[1], 'a2@example.org', [('evidence_proof', 'shell.php', 'application/x-php', EVIL)])
        check('a .php file is refused', flag == 'error' and 'Proof' in msg and len(claims()) == before, (flag, msg))
        st, flag, msg = post(ids[1], 'a2@example.org', [('evidence_proof', 'big.pdf', 'application/pdf', b'%PDF-' + b'0' * (9 * 1024 * 1024))])
        check('an oversize proof is refused and the limit is named', flag == 'error' and ('limit' in msg or 'too large' in msg) and len(claims()) == before, (flag, msg[:120]))
        st, flag, msg = post(ids[1], 'a2@example.org', [('evidence_photos[]', f'p{i}.png', 'image/png', png()) for i in range(7)])
        check('more than five photos is refused', flag == 'error' and 'at most' in msg and len(claims()) == before, (flag, msg))
        st, flag, msg = post(ids[1], 'a2@example.org', [('evidence_proof', 'fake.pdf', 'application/pdf', b'not a pdf at all')])
        check('a file named .pdf that is not a PDF is refused', flag == 'error' and len(claims()) == before, (flag, msg))
        reset()
        st, flag, msg = post(ids[1], 'a2@example.org', [])
        check('a claim with no files is still accepted (files are optional)', flag == 'sent', (flag, msg))

        files = pdir()['files']
        pname = ev['proof'][0]
        lname = ev['logo'][0]
        url = json.loads(http(base + f'/?dw_t=link&f={pname}')[2])['url'].replace('&#038;', '&').replace('&amp;', '&')
        st, h, body = http(url)
        check('a manager with the nonce link downloads the proof as a PDF', st == 200 and body.startswith('%PDF-') and {k.lower(): v for k, v in h.items()}.get('content-type', '').startswith('application/pdf') and 'nosniff' in {k.lower(): v for k, v in h.items()}.get('x-content-type-options', ''), (st, {k.lower(): v for k, v in h.items()}))
        # This Playground serves files straight from disk and ignores .htaccess, like nginx with no location block: the worst case.
        for label, nm in (('proof PDF', pname), ('logo PNG', lname)):
            raw = urllib.request.urlopen(urllib.request.Request(base + f'/wp-content/uploads/directoryweb-private/{nm}'), timeout=60).read()
            check(f'direct URL to the {label} on a server with no deny rule returns only ciphertext, never the document', raw[:4] == b'DWE1' and not raw.startswith(b'%PDF-') and not raw.startswith(b'\x89PNG'), raw[:8])
            check(f'the {label} bytes on disk contain no readable content marker', b'%PDF-' not in raw and b'IHDR' not in raw)
        lurl = json.loads(http(base + f'/?dw_t=link&f={lname}')[2])['url'].replace('&#038;', '&').replace('&amp;', '&')
        req = urllib.request.Request(lurl)
        raw_logo = OPENER.open(req, timeout=60).read()
        check('the authenticated handler still returns the logo as a real PNG', raw_logo.startswith(b'\x89PNG'))
        st, h, body = http(base + f'/wp-admin/admin-post.php?action=dw_evidence_file&f={pname}')
        check('without the nonce the file is refused', st in (403, 400) or 'Not allowed' in body, st)
        st, h, body = http(base + '/wp-admin/admin-post.php?action=dw_evidence_file&f=../../../wp-config.php&_wpnonce=x')
        check('a path-traversal name is refused', st in (403, 404) or 'Not allowed' in body or 'not found' in body.lower(), st)

        r = json.loads(http(base + f'/?dw_t=approve&id={c[-1]["id"]}')[2])
        check('approving applies the logo and photos to the listing (media library), not the proof', r['ok'] and r['thumb'] and r['attachments'] == 3 and 'logo' in (r['applied'] or []), r)
        check('the proof stays private: only the logo and two photos became attachments, and the proof file is still in the private folder', r['attachments'] == 3 and pname in pdir()['files'])
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
