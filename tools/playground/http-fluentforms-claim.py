#!/usr/bin/env python3
"""A claim sent through the REAL Fluent Forms plugin, reviewed with DirectoryWeb alone (no Kits Core, no Animal Writes).

Starts a Playground with the extracted directoryweb.zip and Fluent Forms installed from wordpress.org, creates a claim
form in Fluent Forms, submits it over HTTP through Fluent Forms' own AJAX endpoint (so Fluent Forms validates, stores
and fires its hooks), then reads the entry, renders the review screen, approves, and checks what reached the listing.

What this proves and what it does not:
  * Proven with the real plugin: the claim form id resolves from DirectoryWeb's own option; submission is stored by
    Fluent Forms; the entry is read; the WhatsApp tick and "show my name" consent are kept; the review screen renders;
    approval writes the ticked fields; a second decision is refused.
  * Evidence: Fluent Forms' free plugin has NO file-upload field (it is a Fluent Forms Pro element). A file that a form
    provider has saved in the uploads folder reaches DirectoryWeb as a URL in the entry. This test puts such a URL in
    the entry through a text field and checks DirectoryWeb copies the file into its private store, refuses bad ones, and
    shows the reviewer why. It does not run Fluent Forms Pro's uploader.

Usage: NODE_OPTIONS="--dns-result-order=ipv4first" python3 http-fluentforms-claim.py [--dist ../../dist] [--port 9451]
"""
import argparse, http.cookiejar, json, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request, urllib.error

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

MU = r"""<?php
add_action( 'init', function () {
	if ( ! isset( $_GET['dw_t'] ) ) { return; }
	header( 'Content-Type: application/json' );
	wp_set_current_user( 1 );
	$t = $_GET['dw_t'];
	if ( 'info' === $t ) {
		echo wp_json_encode( array( 'listing' => (int) get_option( 'dw_t_listing' ), 'form' => (int) get_option( 'dw_t_form' ), 'ff' => defined( 'FLUENTFORM' ), 'kits' => function_exists( 'kits_ff_id' ), 'ffver' => defined( 'FLUENTFORM_VERSION' ) ? FLUENTFORM_VERSION : '', 'claim_id' => directoryweb_claim_ff_id(), 'native' => dw_claim_native_active() ) );
	}
	if ( 'entries' === $t ) {
		global $wpdb;
		echo wp_json_encode( $wpdb->get_col( "SELECT id FROM {$wpdb->prefix}fluentform_submissions ORDER BY id" ) );
	}
	if ( 'entry' === $t ) {
		$c = directoryweb_claim_entry( (int) $_GET['id'] );
		echo wp_json_encode( $c );
	}
	if ( 'screen' === $t ) {
		ob_start(); directoryweb_claim_review_screen( (int) $_GET['id'] ); $h = ob_get_clean();
		echo wp_json_encode( array( 'html' => $h, 'nonce' => wp_create_nonce( 'aw_claim_ff_decide_' . (int) $_GET['id'] ) ) );
	}
	if ( 'phones' === $t ) {
		echo wp_json_encode( array( 'phones' => directoryweb_listing_phones( (int) get_option( 'dw_t_listing' ) ), 'verified' => (bool) get_post_meta( (int) get_option( 'dw_t_listing' ), 'aw_verified', true ) ) );
	}
	if ( 'dir' === $t ) {
		$d = dw_evidence_dir();
		echo wp_json_encode( array_values( array_diff( scandir( $d ), array( '.', '..', '.htaccess', 'index.php' ) ) ) );
	}
	if ( 'mkfile' === $t ) {
		$up = wp_upload_dir();
		$dir = isset( $_GET['d'] ) && 'media' === $_GET['d'] ? '2026/11' : 'fluentform';
		wp_mkdir_p( $up['basedir'] . '/' . $dir );
		$name = sanitize_file_name( $_GET['n'] );
		file_put_contents( $up['basedir'] . '/' . $dir . '/' . $name, base64_decode( $_GET['b'] ) );
		echo wp_json_encode( array( 'url' => $up['baseurl'] . '/' . $dir . '/' . $name ) );
	}
	exit;
} );
add_filter( 'pre_wp_mail', '__return_true' );
"""

SEED = r"""<?php require '/wordpress/wp-load.php';
global $wpdb;
$lid = wp_insert_post( array( 'post_title' => 'Fluent Forms test shelter', 'post_status' => 'publish', 'post_type' => 'aw_listing', 'post_content' => 'x' ) );
update_option( 'dw_t_listing', $lid );
$n = 0;
$el = function ( $element, $name, $label, $attrs = array(), $settings = array() ) use ( &$n ) {
	++$n;
	return array( 'index' => $n, 'element' => $element, 'attributes' => array_merge( array( 'name' => $name, 'value' => '', 'id' => '', 'class' => '' ), $attrs ),
		'settings' => array_merge( array( 'container_class' => '', 'label' => $label, 'label_placement' => '', 'admin_field_label' => $label, 'help_message' => '', 'validation_rules' => array( 'required' => array( 'value' => false, 'message' => 'Required' ) ), 'conditional_logics' => array() ), $settings ),
		'editor_options' => array( 'title' => $label, 'template' => 'inputText' ) );
};
$opts = fn( $pairs ) => array( 'advanced_options' => array_map( fn( $k, $v ) => array( 'label' => $v, 'value' => $k, 'calc_value' => '' ), array_keys( $pairs ), $pairs ) );
$fields = array(
	$el( 'input_hidden', 'listing', 'Listing', array( 'type' => 'hidden' ) ),
	$el( 'input_text', 'name', 'Your name', array( 'type' => 'text' ) ),
	$el( 'input_email', 'email', 'Your email', array( 'type' => 'email' ) ),
	$el( 'select', 'role', 'Role', array(), $opts( array( 'founder' => 'Founder', 'staff' => 'Staff' ) ) ),
	$el( 'input_checkbox', 'show_on_listing', 'Show my name', array( 'type' => 'checkbox' ), $opts( array( 'yes' => 'Yes' ) ) ),
	$el( 'input_text', 'l_phone1', 'Phone', array( 'type' => 'text' ) ),
	$el( 'input_text', 'l_phone1_label', 'Phone label', array( 'type' => 'text' ) ),
	$el( 'input_checkbox', 'l_phone1_wa', 'WhatsApp', array( 'type' => 'checkbox' ), $opts( array( '1' => 'This number is on WhatsApp' ) ) ),
	$el( 'input_text', 'logo', 'Logo file URL (stands in for a Fluent Forms Pro upload)', array( 'type' => 'text' ) ),
	$el( 'input_text', 'proof', 'Proof file URL (stands in for a Fluent Forms Pro upload)', array( 'type' => 'text' ) ),
);
$wpdb->insert( $wpdb->prefix . 'fluentform_forms', array(
	'title' => 'Claim form (test)', 'status' => 'published', 'type' => 'form', 'has_payment' => 0,
	'appearance_settings' => '', 'conditions' => '', 'created_by' => 1,
	'form_fields' => wp_json_encode( array( 'fields' => $fields, 'submitButton' => array( 'uniqElKey' => 'el_1', 'element' => 'button', 'attributes' => array( 'type' => 'submit', 'class' => '' ), 'settings' => array( 'align' => 'left', 'button_style' => 'default', 'container_class' => '', 'help_message' => '', 'background_color' => '#409EFF', 'button_size' => 'md', 'color' => '#ffffff', 'button_ui' => array( 'type' => 'default', 'text' => 'Send', 'img_url' => '' ), 'normal_styles' => array(), 'hover_styles' => array(), 'current_state' => 'normal_styles' ), 'editor_options' => array( 'title' => 'Submit Button' ) ) ) ),
	'created_at' => current_time( 'mysql' ), 'updated_at' => current_time( 'mysql' ),
) );
$fid = (int) $wpdb->insert_id;
update_option( 'dw_t_form', $fid );
update_option( 'aw_ff_forms', array( 'claim' => $fid ) );
update_option( 'permalink_structure', '/%postname%/' );
flush_rewrite_rules();
"""

JAR = http.cookiejar.CookieJar()
OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


NOFOLLOW = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR), NoRedirect)


def http(url, data=None, opener=OPENER):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data, doseq=True).encode() if data is not None else None)
    try:
        r = opener.open(req, timeout=120)
        return r.status, dict(r.headers), r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode('utf-8', 'replace')


PNG = ("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
import base64  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    ap.add_argument('--port', type=int, default=9451)
    a = ap.parse_args()
    base = f'http://127.0.0.1:{a.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='dw-ff-'))
    bp, mounts = smoke.prepare(smoke.HERE / 'blueprints/directoryweb.json', pathlib.Path(a.dist).resolve(), work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bp['steps'] += [
        {'step': 'installPlugin', 'pluginData': {'resource': 'wordpress.org/plugins', 'slug': 'fluentform'}, 'options': {'activate': True}},
        {'step': 'mkdir', 'path': '/wordpress/wp-content/mu-plugins'},
        {'step': 'writeFile', 'path': '/wordpress/wp-content/mu-plugins/dw-ff-test.php', 'data': MU},
        {'step': 'runPHP', 'code': SEED},
    ]
    bpf = work / 'bp.json'
    bpf.write_text(json.dumps(bp))
    log = work / 'server.log'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={bpf}', f'--port={a.port}'] + [f'--mount={m}' for m in mounts],
                            stdout=log.open('w'), stderr=subprocess.STDOUT, cwd=smoke.HERE)
    results = []

    def check(name, ok, detail=''):
        results.append((name, bool(ok), detail))
        print(('PASS ' if ok else 'FAIL ') + name + ((' :: ' + str(detail)[:300]) if detail and not ok else ''))

    try:
        for _ in range(300):
            if 'Ready!' in log.read_text():
                break
            if proc.poll() is not None:
                print(log.read_text()[-1500:])
                return 2
            time.sleep(2)
        else:
            print('server did not start')
            return 2
        http(base + '/')
        info = json.loads(http(base + '/?dw_t=info')[2])
        print('info:', info)
        check('the real Fluent Forms plugin is active (not a stub)', info['ff'] and info['ffver'], info)
        check('Kits Core is not loaded', not info['kits'])
        check('the claim form id resolves from DirectoryWeb\'s own option, and the built-in form steps aside', info['claim_id'] == info['form'] and not info['native'], info)

        lid, fid = info['listing'], info['form']
        mk = lambda n, data, d='': json.loads(http(base + '/?dw_t=mkfile&n=' + n + '&d=' + d + '&b=' + urllib.parse.quote(base64.b64encode(data).decode()))[2])['url']
        logo_url = mk('ff-logo.png', base64.b64decode(PNG))
        good_proof = mk('ff-proof.pdf', b'%PDF-1.4\n%%EOF\n')
        media_png = mk('media-library.png', base64.b64decode(PNG), 'media')
        bad_proof = mk('ff-evil.png', b'<?php echo 1;')

        def submit(extra, email='ff1@example.org'):
            data = {'action': 'fluentform_submit', 'form_id': str(fid),
                    'data': urllib.parse.urlencode({'listing': lid, 'name': 'Asha Rao', 'email': email, 'role': 'founder', 'show_on_listing[]': 'yes',
                                                    'l_phone1': '9876543210', 'l_phone1_label': 'Office', 'l_phone1_wa[]': '1', **extra}, doseq=True)}
            return http(base + '/wp-admin/admin-ajax.php', data)

        st, h, body = submit({'logo': logo_url, 'proof': good_proof})
        check('Fluent Forms accepts the submission through its own endpoint', st == 200 and '"insert_id"' in body, (st, body[:200]))
        ids = json.loads(http(base + '/?dw_t=entries')[2])
        check('the entry is stored by Fluent Forms', len(ids) == 1, ids)
        eid = ids[0]
        c = json.loads(http(base + f'/?dw_t=entry&id={eid}')[2])
        check('DirectoryWeb reads the entry', isinstance(c, dict) and c.get('listing') == lid and c.get('email') == 'ff1@example.org', c)
        check('role and name are read', str(c.get('role')).startswith('Founder') and c.get('name') == 'Asha Rao', {k: c.get(k) for k in ('role', 'name')})
        ph = c.get('propose', {}).get('phones', '')
        check('the phone is stored as +91 with its label', '+91 98765 43210' in ph and '| Office' in ph, ph)
        check('WhatsApp consent: the ticked box is kept on the number', '| WhatsApp' in ph, ph)
        check('"show my name" consent is kept', c.get('show') is True, c.get('show'))
        check('evidence: the logo and proof were copied into DirectoryWeb\'s private store', bool(c.get('logo')) and len(c.get('proofs', [])) == 1 and c.get('problems') == [], {k: c.get(k) for k in ('logo', 'proofs', 'problems')})
        files = json.loads(http(base + '/?dw_t=dir')[2])
        check('the stored names are random, in directoryweb-private', len(files) == 2 and all(re.match(r'^[a-z0-9]{24}\.(png|pdf)$', f) for f in files), files)

        page = lambda e: http(base + f'/wp-admin/edit.php?post_type=aw_listing&page=aw-claims&entry={e}')[2]
        html = page(eid)
        m = re.search(r'name="_wpnonce" value="([a-z0-9]+)"', html)
        scr = {'html': html, 'nonce': m.group(1) if m else ''}
        check('the review screen renders with the real entry', 'Asha Rao' in html and 'Phone numbers' in html and 'Fatal' not in html)
        check('the review screen shows the proof link and the logo, from DirectoryWeb\'s own handler', 'dw_evidence_file' in html and 'aw_ff_file' not in html and 'Open document 1' in html)

        st, h, body = submit({'logo': bad_proof, 'proof': 'https://example.com/elsewhere.pdf'}, 'ff2@example.org')
        ids = json.loads(http(base + '/?dw_t=entries')[2])
        c2 = json.loads(http(base + f'/?dw_t=entry&id={ids[-1]}')[2])
        check('a refused or foreign file is not imported and the reviewer is told why', c2.get('logo') == '' and not c2.get('proofs') and len(c2.get('problems', [])) == 2, c2.get('problems'))
        check('the review screen lists the files that were not accepted', 'Files not accepted' in page(ids[-1]))

        st, h, body = submit({'logo': media_png, 'proof': ''}, 'ff3@example.org')
        ids = json.loads(http(base + '/?dw_t=entries')[2])
        c3 = json.loads(http(base + f'/?dw_t=entry&id={ids[-1]}')[2])
        check('a file in the media library (outside the form plugin\'s folder) is refused, not copied', c3.get('logo') == '' and any('upload folder' in x for x in c3.get('problems', [])), c3.get('problems'))
        # approve the first claim with the phones ticked
        st, h, body = http(base + '/wp-admin/admin-post.php', {'action': 'aw_claim_ff_decide', 'entry': str(eid), '_wpnonce': scr['nonce'], 'fields[]': ['phones', 'logo'], 'do_approve': 'Approve'}, NOFOLLOW)
        check('approval is accepted', st == 302, st)
        r = json.loads(http(base + '/?dw_t=phones')[2])
        nums = r['phones']
        check('the listing now has the number with its WhatsApp flag', any('98765' in x['number'] and x['whatsapp'] for x in nums), nums)
        check('the listing is marked claimed', r['verified'] is True)
        st, h, body = http(base + '/wp-admin/admin-post.php', {'action': 'aw_claim_ff_decide', 'entry': str(eid), '_wpnonce': scr['nonce'], 'do_approve': 'Approve'}, NOFOLLOW)
        check('a second decision on the same claim is refused', st == 409 or 'already decided' in body, st)
        # the Claims admin screens over HTTP
        st, h, body = http(base + f'/wp-admin/edit.php?post_type=aw_listing&page=aw-claims&entry={eid}')
        check('the Claims entry screen loads over HTTP without Kits Core', st == 200 and 'Fatal error' not in body and 'Asha Rao' in body, st)
        st, h, body = http(base + '/wp-admin/edit.php?post_type=aw_listing&page=aw-claims')
        check('the Claims list loads over HTTP', st == 200 and 'Fatal error' not in body, st)
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
