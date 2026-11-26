#!/usr/bin/env python3
"""Form Integrations end to end with the REAL Fluent Forms plugin, DirectoryWeb alone (no Kits Core, no Animal Writes).

Starts a Playground with the extracted directoryweb.zip and Fluent Forms from wordpress.org, saves a schema, a listing
type and form mappings, creates three Fluent Forms, submits them over HTTP through Fluent Forms' own AJAX endpoint (so
Fluent Forms validates, stores and fires its hooks) and checks what DirectoryWeb made of each submission. Also runs the
listing CSV import and export inside the same WordPress.

Proves: the adapter lists the real forms and their fields; a mapped submission becomes a pending (or draft) listing of
the right type with the values in the right fields; a value that breaks the schema, a form with no mapping and a mapping
that is off make no listing; forms from the same provider with different field names feed one listing type; the CSV
dry run reports bad rows and the import creates only the good ones.
Does not prove: other providers' adapters (none are built), Fluent Forms Pro elements.

Usage: NODE_OPTIONS="--dns-result-order=ipv4first" python3 http-fluentforms-mapping.py [--dist ../../dist] [--port 9452]
"""
import argparse, http.cookiejar, json, pathlib, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request, urllib.error

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke  # noqa: E402

MU = r"""<?php
add_action( 'init', function () {
	if ( ! isset( $_GET['directoryweb_t'] ) ) { return; }
	header( 'Content-Type: application/json' );
	wp_set_current_user( 1 );
	$t = $_GET['directoryweb_t'];
	$body = json_decode( file_get_contents( 'php://input' ), true ) ?: array();
	if ( 'info' === $t ) {
		$a = directoryweb_form_adapters();
		echo wp_json_encode( array( 'ff' => defined( 'FLUENTFORM' ), 'ffver' => defined( 'FLUENTFORM_VERSION' ) ? FLUENTFORM_VERSION : '', 'kits' => function_exists( 'kits_ff_id' ), 'adapters' => array_keys( $a ), 'active' => isset( $a['fluentforms'] ) ? (bool) call_user_func( $a['fluentforms']['active'] ) : false, 'forms' => get_option( 'directoryweb_t_forms' ) ) );
	}
	if ( 'forms' === $t ) {
		$a = directoryweb_form_adapters()['fluentforms'];
		$out = array();
		foreach ( call_user_func( $a['forms'] ) as $f ) { $out[] = array( 'id' => $f[0], 'title' => $f[1], 'fields' => array_map( fn( $x ) => $x[0], call_user_func( $a['fields'], $f[0] ) ) ); }
		echo wp_json_encode( $out );
	}
	if ( 'save' === $t ) {
		update_option( DIRECTORYWEB_FIELDS_OPTION, $body['fields'] );
		update_option( DIRECTORYWEB_TYPES_OPTION, $body['types'] );
		update_option( DIRECTORYWEB_MAPPINGS_OPTION, $body['mappings'] );
		echo wp_json_encode( array( 'types' => array_keys( directoryweb_schema_types() ), 'mappings' => count( directoryweb_form_mappings() ), 'fields' => count( directoryweb_schema_fields() ) ) );
	}
	if ( 'listings' === $t ) {
		$out = array();
		foreach ( get_posts( array( 'post_type' => directoryweb_post_type(), 'post_status' => 'any', 'posts_per_page' => 50, 'orderby' => 'ID', 'order' => 'ASC' ) ) as $p ) {
			$m = array();
			foreach ( get_post_meta( $p->ID ) as $k => $v ) { $m[ $k ] = $v[0]; }
			$out[] = array( 'id' => $p->ID, 'title' => $p->post_title, 'status' => $p->post_status, 'meta' => $m );
		}
		echo wp_json_encode( $out );
	}
	if ( 'import' === $t ) {
		echo wp_json_encode( directoryweb_import_csv( $body['type'], $body['csv'], (bool) $body['dry'], $body['status'] ?? 'pending' ) );
	}
	if ( 'export' === $t ) {
		echo wp_json_encode( array( 'csv' => directoryweb_export_csv( $_GET['type'] ) ) );
	}
	if ( 'prefix' === $t ) { echo wp_json_encode( array( 'prefix' => directoryweb_meta_prefix() ) ); }
	exit;
} );
"""

SEED = r"""<?php require '/wordpress/wp-load.php';
global $wpdb;
$n = 0;
$el = function ( $element, $name, $label, $attrs = array(), $settings = array() ) use ( &$n ) {
	++$n;
	return array( 'index' => $n, 'element' => $element, 'attributes' => array_merge( array( 'name' => $name, 'value' => '', 'id' => '', 'class' => '' ), $attrs ),
		'settings' => array_merge( array( 'container_class' => '', 'label' => $label, 'label_placement' => '', 'admin_field_label' => $label, 'help_message' => '', 'validation_rules' => array( 'required' => array( 'value' => false, 'message' => 'Required' ) ), 'conditional_logics' => array() ), $settings ),
		'editor_options' => array( 'title' => $label, 'template' => 'inputText' ) );
};
$opts = fn( $pairs ) => array( 'advanced_options' => array_map( fn( $k, $v ) => array( 'label' => $v, 'value' => $k, 'calc_value' => '' ), array_keys( $pairs ), $pairs ) );
$submit = array( 'uniqElKey' => 'el_1', 'element' => 'button', 'attributes' => array( 'type' => 'submit', 'class' => '' ), 'settings' => array( 'align' => 'left', 'button_style' => 'default', 'container_class' => '', 'help_message' => '', 'background_color' => '#409EFF', 'button_size' => 'md', 'color' => '#ffffff', 'button_ui' => array( 'type' => 'default', 'text' => 'Send', 'img_url' => '' ), 'normal_styles' => array(), 'hover_styles' => array(), 'current_state' => 'normal_styles' ), 'editor_options' => array( 'title' => 'Submit Button' ) );
$mk = function ( $title, $fields ) use ( $wpdb, $submit ) {
	$wpdb->insert( $wpdb->prefix . 'fluentform_forms', array( 'title' => $title, 'status' => 'published', 'type' => 'form', 'has_payment' => 0, 'appearance_settings' => '', 'conditions' => '', 'created_by' => 1,
		'form_fields' => wp_json_encode( array( 'fields' => $fields, 'submitButton' => $submit ) ), 'created_at' => current_time( 'mysql' ), 'updated_at' => current_time( 'mysql' ) ) );
	return (int) $wpdb->insert_id;
};
$f1 = $mk( 'Add a shelter', array(
	$el( 'input_text', 'name', 'Name', array( 'type' => 'text' ) ),
	$el( 'input_email', 'email', 'Email', array( 'type' => 'email' ) ),
	$el( 'select', 'kind', 'Kind', array(), $opts( array( 'shelter' => 'Shelter', 'clinic' => 'Clinic' ) ) ),
	$el( 'input_checkbox', 'animals', 'Animals', array( 'type' => 'checkbox' ), $opts( array( 'dogs' => 'Dogs', 'cats' => 'Cats', 'cows' => 'Cows' ) ) ),
	$el( 'input_text', 'beds', 'Beds', array( 'type' => 'text' ) ),
	$el( 'input_text', 'site', 'Website', array( 'type' => 'text' ) ),
) );
$f2 = $mk( 'Quick add', array(
	$el( 'input_text', 'shelter_name', 'Shelter', array( 'type' => 'text' ) ),
	$el( 'input_text', 'contact', 'Contact email', array( 'type' => 'text' ) ),
) );
$f4 = $mk( 'Mapping off', array(
	$el( 'input_text', 'shelter_name', 'Shelter', array( 'type' => 'text' ) ),
	$el( 'input_text', 'contact', 'Contact email', array( 'type' => 'text' ) ),
) );
$f3 = $mk( 'Unmapped form', array( $el( 'input_text', 'name', 'Name', array( 'type' => 'text' ) ) ) );
update_option( 'directoryweb_t_forms', array( 'f1' => $f1, 'f2' => $f2, 'f3' => $f3, 'f4' => $f4 ) );
update_option( 'permalink_structure', '/%postname%/' );
flush_rewrite_rules();
"""

JAR = http.cookiejar.CookieJar()
OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(JAR))


def http(url, data=None, json_body=None):
    if json_body is not None:
        req = urllib.request.Request(url, data=json.dumps(json_body).encode(), headers={'Content-Type': 'application/json'})
    else:
        req = urllib.request.Request(url, data=urllib.parse.urlencode(data, doseq=True).encode() if data is not None else None)
    try:
        r = OPENER.open(req, timeout=120)
        return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dist', default=str(smoke.HERE.parent.parent / 'dist'))
    ap.add_argument('--port', type=int, default=9452)
    a = ap.parse_args()
    base = f'http://127.0.0.1:{a.port}'
    work = pathlib.Path(tempfile.mkdtemp(prefix='dw-map-'))
    bp, mounts = smoke.prepare(smoke.HERE / 'blueprints/directoryweb.json', pathlib.Path(a.dist).resolve(), work)
    bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
    bp['steps'] += [
        {'step': 'installPlugin', 'pluginData': {'resource': 'wordpress.org/plugins', 'slug': 'fluentform'}, 'options': {'activate': True}},
        {'step': 'mkdir', 'path': '/wordpress/wp-content/mu-plugins'},
        {'step': 'writeFile', 'path': '/wordpress/wp-content/mu-plugins/dw-map-test.php', 'data': MU},
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
        print(('PASS ' if ok else 'FAIL ') + name + ((' :: ' + str(detail)[:400]) if detail and not ok else ''))

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
        T = lambda name, body=None, extra='': json.loads((http(base + f'/?directoryweb_t={name}{extra}', json_body=body) if body is not None else http(base + f'/?directoryweb_t={name}{extra}'))[1])
        LL = lambda: [x for x in T('listings') if 'directoryweb_listing_type' in x['meta']]  # the fixture listing the blueprint adds is not ours
        info = T('info')
        print('info:', info)
        check('the real Fluent Forms plugin is active and the adapter sees it', info['ff'] and info['ffver'] and info['active'] and 'fluentforms' in info['adapters'], info)
        check('Kits Core is not loaded', not info['kits'])
        f1, f2, f3, f4 = info['forms']['f1'], info['forms']['f2'], info['forms']['f3'], info['forms']['f4']

        raw = T('forms')
        print('forms:', raw)
        forms = {int(f['id']): f for f in raw if str(f['id']).isdigit()}
        check('the adapter lists the real forms', {f1, f2, f3} <= set(forms), list(forms))
        check('the adapter lists a form\'s real fields', forms[f1]['fields'] == ['name', 'email', 'kind', 'animals', 'beds', 'site'], forms[f1]['fields'])
        check('the adapter reads another form\'s fields', forms[f2]['fields'] == ['shelter_name', 'contact'], forms[f2]['fields'])

        fields = [
            {'key': 'name', 'label': 'Name', 'type': 'text', 'required': True, 'max': 60},
            {'key': 'email', 'label': 'Email', 'type': 'email'},
            {'key': 'kind', 'label': 'Kind', 'type': 'select', 'options': ['shelter', 'clinic']},
            {'key': 'animals', 'label': 'Animals', 'type': 'multiselect', 'options': ['dogs', 'cats', 'cows']},
            {'key': 'beds', 'label': 'Beds', 'type': 'number', 'min': 1, 'max': 500},
            {'key': 'site', 'label': 'Website', 'type': 'url'},
        ]
        types = [{'id': 'shelter', 'label': 'Shelter', 'fields': [x['key'] for x in fields]}]
        maps = [
            {'provider': 'fluentforms', 'form': str(f1), 'type': 'shelter', 'enabled': True, 'status': 'pending', 'fields': {k: k for k in ('name', 'email', 'kind', 'animals', 'beds', 'site')}},
            {'provider': 'fluentforms', 'form': str(f2), 'type': 'shelter', 'enabled': True, 'status': 'draft', 'fields': {'shelter_name': 'name', 'contact': 'email'}},
            {'provider': 'fluentforms', 'form': str(f4), 'type': 'shelter', 'enabled': False, 'status': 'draft', 'fields': {'shelter_name': 'name', 'contact': 'email'}},
        ]
        saved = T('save', {'fields': fields, 'types': types, 'mappings': maps})
        check('the schema, the listing type and both mappings are stored', saved == {'types': ['shelter'], 'mappings': 3, 'fields': 6}, saved)
        prefix = T('prefix')['prefix']

        def submit(fid, data):
            # Fluent Forms throttles one address (429 Too Many Requests); wait out the window and try again, so that every
            # submission below really reached Fluent Forms and a "no listing" result is DirectoryWeb's doing.
            body = {'action': 'fluentform_submit', 'form_id': str(fid), 'data': urllib.parse.urlencode(data, doseq=True)}
            for _ in range(4):
                st, txt = http(base + '/wp-admin/admin-ajax.php', body)
                if st != 429:
                    break
                time.sleep(65)
            return st, txt

        st, body = submit(f1, {'name': 'Paws Haven', 'email': 'hello@paws.example', 'kind': 'shelter', 'animals[]': ['dogs', 'cats'], 'beds': '40', 'site': 'https://paws.example'})
        check('Fluent Forms accepts the mapped form\'s submission', st == 200 and '"insert_id"' in body, (st, body[:200]))
        L = LL()
        check('exactly one listing was made, pending', len(L) == 1 and L[0]['status'] == 'pending', L)
        l = L[0] if L else {'meta': {}, 'title': ''}
        check('the name became the title', l['title'] == 'Paws Haven', l['title'])
        check('the values are in the right fields', l['meta'].get(prefix + 'email') == 'hello@paws.example' and l['meta'].get(prefix + 'kind') == 'shelter' and l['meta'].get(prefix + 'beds') == '40' and l['meta'].get(prefix + 'site') == 'https://paws.example', l['meta'])
        check('a multiselect is stored as a list of its choices', l['meta'].get(prefix + 'animals') == 'dogs, cats', l['meta'].get(prefix + 'animals'))
        check('the listing records its type and where it came from', l['meta'].get('directoryweb_listing_type') == 'shelter' and l['meta'].get('directoryweb_submitted_via') == f'fluentforms:{f1}', l['meta'])

        sts = submit(f1, {'name': 'Bad Site', 'site': 'not a web address'})[0]
        check('Fluent Forms accepted that submission (so DirectoryWeb is what made no listing)', sts == 200, sts)
        check('a value that breaks the schema makes no listing', len(LL()) == 1)
        sts = submit(f1, {'name': '', 'email': 'x@y.example'})[0]
        check('Fluent Forms accepted that submission (so DirectoryWeb is what made no listing)', sts == 200, sts)
        check('a missing required field makes no listing', len(LL()) == 1)
        sts = submit(f1, {'name': 'Too Big', 'beds': '9999'})[0]
        check('Fluent Forms accepted that submission (so DirectoryWeb is what made no listing)', sts == 200, sts)
        check('a number outside its limits makes no listing', len(LL()) == 1)
        sts = submit(f3, {'name': 'Nobody Mapped'})[0]
        check('Fluent Forms accepted that submission (so DirectoryWeb is what made no listing)', sts == 200, sts)
        check('a form with no mapping makes no listing', len(LL()) == 1)
        sts = submit(f4, {'shelter_name': 'Off Mapping', 'contact': 'a@b.example'})[0]
        check('Fluent Forms accepted that submission (so DirectoryWeb is what made no listing)', sts == 200, sts)
        check('a mapping that is off makes no listing', len(LL()) == 1)

        st2, body2 = submit(f2, {'shelter_name': 'Second Form Shelter', 'contact': 'two@forms.example'})
        check('Fluent Forms accepts the second form\'s submission', st2 == 200 and '"insert_id"' in body2, (st2, body2[:200]))
        L = LL()
        check('a form with other field names feeds the same listing type, as a draft', len(L) == 2 and L[1]['title'] == 'Second Form Shelter' and L[1]['status'] == 'draft' and L[1]['meta'].get('directoryweb_listing_type') == 'shelter', L[1:] )
        check('the second form\'s email reached the same field', L[1]['meta'].get(prefix + 'email') == 'two@forms.example' if len(L) > 1 else False)

        # CSV: a dry run, then the import, then the export
        csv = 'name,email,kind,animals,beds,site,junk\r\nCsv One,one@csv.example,clinic,"dogs, cows",12,https://one.example,x\r\n=EVIL(),bad,,,,,\r\nCsv Three,,shelter,,0,,\r\n'
        r = T('import', {'type': 'shelter', 'csv': csv, 'dry': True})
        check('CSV dry run: reads three rows, one good, reports the others by row, notes the unused column', r['rows'] == 3 and r['ok'] == 1 and sorted(r['problems']) == ['2', '3'] and r['ignored'] == ['junk'] and not r['created'], r)
        check('CSV dry run creates nothing', len(LL()) == 2)
        r = T('import', {'type': 'shelter', 'csv': csv, 'dry': False, 'status': 'draft'})
        check('CSV import creates only the good row', len(r['created']) == 1 and r['ok'] == 1, r)
        L = LL()
        check('the imported listing is a draft of the right type with its values', len(L) == 3 and L[2]['title'] == 'Csv One' and L[2]['status'] == 'draft' and L[2]['meta'].get(prefix + 'animals') == 'dogs, cows' and L[2]['meta'].get('directoryweb_submitted_via') == 'csv:', L[2:])
        ex = T('export', extra='&type=shelter')['csv']
        check('CSV export has a header of the type\'s fields and every listing', ex.splitlines()[0] == 'name,email,kind,animals,beds,site' and len(ex.splitlines()) == 4 and 'Csv One' in ex and 'Paws Haven' in ex, ex[:300])
        r = T('import', {'type': 'nope', 'csv': csv, 'dry': True})
        check('an unknown listing type is refused', r['error'] != '', r)
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
