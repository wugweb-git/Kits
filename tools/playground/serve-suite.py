#!/usr/bin/env python3
"""Serve the whole suite (all plugins + Kits Core + theme, from dist/ zips) in WordPress Playground on a port, for manual and browser audits.
Usage: python3 serve-suite.py [--port 9510]   (Ctrl-C to stop)"""
import argparse, json, pathlib, subprocess, sys, tempfile
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import smoke
ap = argparse.ArgumentParser(); ap.add_argument('--port', type=int, default=9510); a = ap.parse_args()
work = pathlib.Path(tempfile.mkdtemp(prefix='suite-serve-'))
bp, mounts = smoke.prepare(smoke.HERE / 'blueprints/suite.json', smoke.HERE.parent.parent / 'dist', work)
bp['steps'] = [s for s in bp['steps'] if not (s['step'] == 'runPHP' and 'Smoke check failed' in json.dumps(s))]
(work / 'bp.json').write_text(json.dumps(bp))
subprocess.call(['npx', '--no-install', 'wp-playground-cli', 'server', f'--blueprint={work}/bp.json', f'--port={a.port}'] + [f'--mount={m}' for m in mounts], cwd=smoke.HERE)
