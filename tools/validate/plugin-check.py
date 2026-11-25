#!/usr/bin/env python3
"""Run the official Plugin Check (static checks) on the WordPress.org build of each plugin, inside WordPress Playground.

What it does
  1. builds every plugin with --track wporg (no Update URI, source included), the build WordPress.org would receive
  2. starts WordPress in Playground (tools/playground, @wp-playground/cli), installs Plugin Check from wordpress.org
  3. runs Plugin Check's static checks on each plugin, writes plugin-check-report.json
  4. fails when any plugin has more than --max-errors errors (default 0). Warnings are listed, never fatal.

Playground has no php://stdin, which PHP_CodeSniffer (inside Plugin Check) opens; the throwaway Playground copy of
Plugin Check is patched for that one line. Nothing in a product is touched. Runtime checks need a database set-up
Playground does not offer, so only static checks run.

Usage: python3 tools/validate/plugin-check.py [--plugins directoryweb rankweb] [--max-errors 0] [--out plugin-check-out]
Needs: node (npm ci already run in tools/playground), PHP and composer (MailWeb's vendor build), network.
"""
from __future__ import annotations

import argparse
import collections
import json
import pathlib
import shutil
import subprocess
import sys
import tempfile
import zipfile

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
PLUGINS = ["kits-core", "directoryweb", "rankweb", "sourceweb", "insightweb", "mailweb", "planweb"]

STDIN_PATCH = (
    "<?php $f='/wordpress/wp-content/plugins/plugin-check/vendor/squizlabs/php_codesniffer/src/Config.php'; "
    "$s=file_get_contents($f); file_put_contents($f,str_replace(\"fopen('php://stdin', 'r')\",\"fopen('php://memory', 'r')\",$s));"
)

RUNNER = r"""<?php
require '/wordpress/wp-load.php';
use WordPress\Plugin_Check\Checker\Check_Context;
use WordPress\Plugin_Check\Checker\Check_Repository;
use WordPress\Plugin_Check\Checker\Default_Check_Repository;
use WordPress\Plugin_Check\Checker\Checks;
@set_time_limit( 0 );
$slugs = %SLUGS%;
$flat = function ( $msgs ) { $o = array(); foreach ( (array) $msgs as $file => $lines ) { foreach ( (array) $lines as $line => $cols ) { foreach ( (array) $cols as $col => $items ) { foreach ( (array) $items as $m ) { $o[] = array( 'file' => $file, 'line' => $line, 'code' => $m['code'] ?? '', 'message' => wp_strip_all_tags( $m['message'] ?? '' ) ); } } } } return $o; };
foreach ( $slugs as $slug ) {
	$out = array( 'slug' => $slug );
	try {
		$ctx    = new Check_Context( WP_PLUGIN_DIR . '/' . $slug . '/' . $slug . '.php' );
		$repo   = new Default_Check_Repository();
		$checks = $repo->get_checks( Check_Repository::TYPE_STATIC )->to_array();
		$res    = ( new Checks() )->run_checks( $ctx, $checks );
		$out['errors']   = $flat( $res->get_errors() );
		$out['warnings'] = $flat( $res->get_warnings() );
	} catch ( Throwable $e ) {
		$out['exception'] = get_class( $e ) . ': ' . $e->getMessage();
	}
	file_put_contents( '/results/pc-' . $slug . '.json', wp_json_encode( $out ) );
}
file_put_contents( '/results/pc-done.txt', 'done' );
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--plugins", nargs="*", default=PLUGINS, choices=PLUGINS)
    ap.add_argument("--max-errors", type=int, default=0)
    ap.add_argument("--out", default="plugin-check-out")
    ap.add_argument("--timeout", type=int, default=2400)
    a = ap.parse_args()

    out = pathlib.Path(a.out).resolve()
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    work = pathlib.Path(tempfile.mkdtemp(prefix="plugin-check-"))
    dist, plug, res = work / "dist", work / "plugins", work / "results"
    for d in (dist, plug, res):
        d.mkdir()

    for slug in a.plugins:
        subprocess.run([sys.executable, str(REPO / "tools/build/build-dist.py"), "--target", slug, "--track", "wporg", "--out", str(dist)], check=True, stdout=subprocess.DEVNULL)
        with zipfile.ZipFile(dist / f"{slug}.zip") as zf:
            zf.extractall(plug)

    blueprint = {
        "landingPage": "/wp-admin/",
        "preferredVersions": {"php": "8.2", "wp": "latest"},
        "steps": [
            {"step": "login"},
            {"step": "installPlugin", "pluginData": {"resource": "wordpress.org/plugins", "slug": "plugin-check"}, "options": {"activate": True}},
            {"step": "runPHP", "code": STDIN_PATCH},
            {"step": "runPHP", "code": RUNNER.replace("%SLUGS%", "array( " + ", ".join(f"'{s}'" for s in a.plugins) + " )")},
        ],
    }
    bp = work / "blueprint.json"
    bp.write_text(json.dumps(blueprint))

    cmd = ["npx", "--no-install", "wp-playground-cli", "run-blueprint", f"--blueprint={bp}", f"--mount={res}:/results"]
    cmd += [f"--mount={plug / s}:/wordpress/wp-content/plugins/{s}" for s in a.plugins]
    print(f"Running Plugin Check on {len(a.plugins)} plugin(s) in Playground...", flush=True)
    r = subprocess.run(cmd, cwd=REPO / "tools" / "playground", capture_output=True, text=True, timeout=a.timeout)
    if not (res / "pc-done.txt").exists():
        print((r.stdout + r.stderr)[-3000:], file=sys.stderr)
        print("Plugin Check did not finish.", file=sys.stderr)
        return 2

    report, failed = {}, False
    print(f"\n{'plugin':<14}{'errors':>8}{'warnings':>10}")
    for slug in a.plugins:
        d = json.loads((res / f"pc-{slug}.json").read_text())
        report[slug] = d
        if "exception" in d:
            print(f"{slug:<14} EXCEPTION {d['exception'][:160]}")
            failed = True
            continue
        ne, nw = len(d["errors"]), len(d["warnings"])
        print(f"{slug:<14}{ne:>8}{nw:>10}")
        for x in d["errors"]:
            print(f"    error  {x['file'].split('/plugins/')[-1]}:{x['line']}  {x['code']}")
        if ne > a.max_errors:
            failed = True
    (out / "plugin-check-report.json").write_text(json.dumps(report, indent=1))

    top = collections.Counter(w["code"] for d in report.values() for w in d.get("warnings", []))
    print("\nMost common warnings (not fatal):")
    for code, n in top.most_common(6):
        print(f"  {n:>5}  {code}")
    shutil.rmtree(work, ignore_errors=True)
    print("\nFAILED" if failed else "\nOK: no errors above the limit")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
