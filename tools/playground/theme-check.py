#!/usr/bin/env python3
"""Run the WordPress.org Theme Check plugin on the built theme ZIP inside WordPress Playground.

Same shape as plugin-check.py: installs the theme-check plugin from wordpress.org, mounts the theme under test from
dist/<slug>.zip, runs the checks through the plugin's own PHP API (run_themechecks_against_theme) and writes the findings
to wp-content/uploads/theme-check.json, which this script reads over HTTP.
Usage: python3 theme-check.py [--theme kits-by-wugweb] [--zip kits-by-wugweb-wporg] [--port 9481] [--dist ../../dist]
Defaults to the wordpress.org track ZIP (no Update URI header, which the directory forbids); pass --zip kits-by-wugweb to check the self-hosted ZIP.
Exit status 1 when any REQUIRED finding exists (warnings and recommendations are listed, not failing).
Build the ZIPs first: python3 tools/build/build-dist.py --target all --track commercial --out dist
                      python3 tools/build/build-dist.py --target theme --track wporg --out dist
"""
import argparse, json, pathlib, shutil, subprocess, sys, tempfile, time, urllib.request, zipfile
HERE = pathlib.Path(__file__).resolve().parent
PHP = r"""<?php
require '/wordpress/wp-load.php';
wp_set_current_user(1);
require_once ABSPATH . 'wp-admin/includes/plugin.php'; require_once ABSPATH . 'wp-admin/includes/file.php'; require_once ABSPATH . 'wp-admin/includes/admin.php';
$out = array('items' => array(), 'passed' => null, 'fatal' => '', 'theme' => '', 'version' => '');
try {
  require_once WP_PLUGIN_DIR . '/theme-check/checkbase.php';
  $theme = wp_get_theme('__SLUG__');
  $out['theme'] = $theme->get('Name'); $out['version'] = $theme->get('Version');
  $out['passed'] = run_themechecks_against_theme($theme, '__SLUG__');
  global $themechecks;
  foreach ((array) $themechecks as $check) {
    if (!is_object($check) || !method_exists($check, 'getError')) continue;
    foreach ((array) $check->getError() as $e) {
      $kind = 'INFO';
      foreach (array('REQUIRED', 'WARNING', 'RECOMMENDED', 'INFO') as $k) if (false !== strpos($e, $k)) { $kind = $k; break; }
      $out['items'][] = array('kind' => $kind, 'check' => get_class($check), 'message' => trim(preg_replace('/\s+/', ' ', wp_strip_all_tags($e))));
    }
  }
} catch (Throwable $e) { $out['fatal'] = get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine(); }
if (!is_dir('/wordpress/wp-content/uploads')) mkdir('/wordpress/wp-content/uploads', 0777, true);
file_put_contents('/wordpress/wp-content/uploads/theme-check.json', json_encode($out));
"""
def run(slug, zipname, port, dist):
    work = pathlib.Path(tempfile.mkdtemp(prefix=f'tc-{slug}-'))
    with zipfile.ZipFile(dist / f'{zipname}.zip') as z: z.extractall(work)
    bp = {"preferredVersions": {"php": "8.2", "wp": "latest"}, "features": {"networking": True}, "steps": [
        {"step": "login", "username": "admin", "password": "password"},
        {"step": "installPlugin", "pluginData": {"resource": "wordpress.org/plugins", "slug": "theme-check"}, "options": {"activate": True}},
        {"step": "runPHP", "code": PHP.replace('__SLUG__', slug)}]}
    (work / 'bp.json').write_text(json.dumps(bp)); logf = work / 'log.txt'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={work}/bp.json', f'--port={port}', f'--mount={work / slug}:/wordpress/wp-content/themes/{slug}'],
                            stdout=logf.open('w'), stderr=subprocess.STDOUT, cwd=HERE)
    try:
        for _ in range(300):
            if 'Ready!' in logf.read_text(): break
            if proc.poll() is not None: return {'fatal': 'server exited: ' + logf.read_text()[-600:]}
            time.sleep(2)
        try: return json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/wp-content/uploads/theme-check.json', timeout=600).read())
        except Exception as e: return {'fatal': f'{e}; {logf.read_text()[-600:]}'}
    finally:
        proc.terminate()
        try: proc.wait(15)
        except Exception: proc.kill()
        shutil.rmtree(work, ignore_errors=True)
def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--theme', default='kits-by-wugweb'); ap.add_argument('--zip'); ap.add_argument('--port', type=int, default=9481)
    ap.add_argument('--dist', default=str(HERE.parent.parent / 'dist')); a = ap.parse_args()
    r = run(a.theme, a.zip or f'{a.theme}-wporg', a.port, pathlib.Path(a.dist).resolve())
    items = r.get('items', []); by = {}
    for i in items: by.setdefault(i['kind'], []).append(i)
    print(f"######## {a.theme} {r.get('version', '')}: passed={r.get('passed')} " + ', '.join(f"{len(v)} {k}" for k, v in sorted(by.items())) + (f" FATAL {r['fatal']}" if r.get('fatal') else ''))
    for k in ('REQUIRED', 'WARNING', 'RECOMMENDED', 'INFO'):
        for i in by.get(k, []): print(f"  {k} [{i['check']}] {i['message'][:400]}")
    return 1 if by.get('REQUIRED') or r.get('fatal') else 0
if __name__ == '__main__': sys.exit(main())
