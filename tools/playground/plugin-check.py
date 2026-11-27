#!/usr/bin/env python3
"""Run WordPress.org Plugin Check (static checks) on the built plugin ZIPs inside WordPress Playground.

Installs the plugin-check plugin from wordpress.org, mounts the plugin under test from dist/<slug>.zip, runs the checker
through its PHP API and writes the findings to wp-content/uploads/plugin-check.json, which this script reads over HTTP.
Usage: python3 plugin-check.py --plugin directoryweb [--port 9480] [--dist ../../dist]
Exit status 1 when any ERROR-level finding exists (warnings are listed, not failing).
"""
import argparse, json, pathlib, shutil, subprocess, sys, tempfile, time, urllib.request, zipfile
HERE = pathlib.Path(__file__).resolve().parent
PHP = r"""<?php
require '/wordpress/wp-load.php';
wp_set_current_user(1);
require_once ABSPATH . 'wp-admin/includes/plugin.php'; require_once ABSPATH . 'wp-admin/includes/file.php'; require_once ABSPATH . 'wp-admin/includes/admin.php';
define('WP_CLI', true);
$_SERVER['argv'] = array('wp', 'plugin', 'check', '__SLUG__/__SLUG__.php', '--categories=plugin_repo,security,performance,general,accessibility');
$out = array('errors' => array(), 'warnings' => array(), 'fatal' => '');
try {
  $runner = new WordPress\Plugin_Check\Checker\CLI_Runner();
  $runner->set_plugin('__SLUG__/__SLUG__.php');
  $runner->set_experimental_flag(false);
  $cleanup = $runner->prepare();
  $res = $runner->run();
  $cleanup();
  foreach (array('errors' => $res->get_errors(), 'warnings' => $res->get_warnings()) as $k => $files) {
    foreach ($files as $file => $lines) foreach ($lines as $line => $cols) foreach ($cols as $col => $items) foreach ($items as $i) {
      $out[$k][] = array('file' => $file, 'line' => $line, 'code' => $i['code'] ?? '', 'message' => wp_strip_all_tags($i['message'] ?? ''));
    }
  }
} catch (Throwable $e) { $out['fatal'] = get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine(); }
if (!is_dir('/wordpress/wp-content/uploads')) mkdir('/wordpress/wp-content/uploads', 0777, true);
file_put_contents('/wordpress/wp-content/uploads/plugin-check.json', json_encode($out));
"""
def run(slug, port, dist):
    work = pathlib.Path(tempfile.mkdtemp(prefix=f'pc-{slug}-'))
    with zipfile.ZipFile(dist / f'{slug}.zip') as z: z.extractall(work)
    bp = {"preferredVersions": {"php": "8.2", "wp": "latest"}, "features": {"networking": True}, "steps": [
        {"step": "login", "username": "admin", "password": "password"},
        {"step": "installPlugin", "pluginData": {"resource": "wordpress.org/plugins", "slug": "plugin-check"}, "options": {"activate": True}},
        {"step": "activatePlugin", "pluginPath": f"{slug}/{slug}.php"},
        {"step": "runPHP", "code": PHP.replace('__SLUG__', slug)}]}
    (work / 'bp.json').write_text(json.dumps(bp)); logf = work / 'log.txt'
    proc = subprocess.Popen(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={work}/bp.json', f'--port={port}', f'--mount={work / slug}:/wordpress/wp-content/plugins/{slug}'],
                            stdout=logf.open('w'), stderr=subprocess.STDOUT, cwd=HERE)
    try:
        for _ in range(300):
            if 'Ready!' in logf.read_text(): break
            if proc.poll() is not None: return {'fatal': 'server exited: ' + logf.read_text()[-600:]}
            time.sleep(2)
        try: return json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/wp-content/uploads/plugin-check.json', timeout=600).read())
        except Exception as e: return {'fatal': f'{e}; {logf.read_text()[-600:]}'}
    finally:
        proc.terminate()
        try: proc.wait(15)
        except Exception: proc.kill()
        shutil.rmtree(work, ignore_errors=True)
def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--plugin', action='append'); ap.add_argument('--port', type=int, default=9480)
    ap.add_argument('--dist', default=str(HERE.parent.parent / 'dist')); a = ap.parse_args(); bad = 0
    for s in a.plugin or ['kits-core', 'directoryweb', 'rankweb', 'sourceweb', 'insightweb', 'mailweb', 'planweb']:
        r = run(s, a.port, pathlib.Path(a.dist).resolve())
        print(f"######## {s}: {len(r.get('errors', []))} errors, {len(r.get('warnings', []))} warnings" + (f" FATAL {r['fatal']}" if r.get('fatal') else ''))
        for k in ('errors', 'warnings'):
            for i in r.get(k, []): print(f"  {k[:-1].upper()} {i['code']} {i['file'].split('/plugins/')[-1]}:{i['line']} {i['message'][:140]}")
        bad += len(r.get('errors', [])) + (1 if r.get('fatal') else 0)
    return 1 if bad else 0
if __name__ == '__main__': sys.exit(main())
