#!/usr/bin/env python3
"""Run every Kits Playground blueprint headlessly with @wp-playground/cli against the freshly built ZIPs.

The release-asset install steps are swapped for mounts of the extracted ZIP contents (the exact bytes that
get released), so installation/activation is tested from the packaged files, not from the monorepo.
URL resolution of the released assets is checked separately (verify-release-urls.py) once the release exists.

Usage: python3 tools/playground/smoke.py --dist dist [--only directoryweb] [--cli "npx --no-install wp-playground-cli"]
Exit code 1 if any blueprint fails; per-blueprint JSON results are written to <dist>/playground-results/.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import shlex
import subprocess
import sys
import tempfile
import zipfile

HERE = pathlib.Path(__file__).resolve().parent
BLUEPRINTS = ["blueprint-base.json"] + [f"blueprints/{n}.json" for n in
              ["directoryweb", "rankweb", "sourceweb", "insightweb", "mailweb", "planweb", "suite"]]


def prepare(bp_path: pathlib.Path, dist: pathlib.Path, work: pathlib.Path):
    bp = json.loads(bp_path.read_text())
    mounts = []
    steps = []
    for st in bp["steps"]:
        if st["step"] in ("installPlugin", "installTheme"):
            data = st.get("pluginData") or st.get("themeData")
            slug = data["url"].rsplit("/", 1)[1].removesuffix(".zip")
            z = dist / f"{slug}.zip"
            with zipfile.ZipFile(z) as zf:
                zf.extractall(work)
            kind = "plugins" if st["step"] == "installPlugin" else "themes"
            mounts.append(f"{work / slug}:/wordpress/wp-content/{kind}/{slug}")
            if kind == "themes":
                steps.append({"step": "activateTheme", "themeFolderName": slug})
            continue
        steps.append(st)
    bp["steps"] = steps
    bp.pop("$schema", None)
    return bp, mounts


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default="dist")
    ap.add_argument("--only", default="")
    ap.add_argument("--cli", default="npx --no-install wp-playground-cli")
    ap.add_argument("--timeout", type=int, default=900)
    args = ap.parse_args()
    dist = pathlib.Path(args.dist).resolve()
    results_dir = dist / "playground-results"
    results_dir.mkdir(exist_ok=True)
    failed = []
    for rel in BLUEPRINTS:
        name = pathlib.Path(rel).stem
        key = "base" if name == "blueprint-base" else name
        if args.only and args.only != key:
            continue
        with tempfile.TemporaryDirectory() as tmp:
            work = pathlib.Path(tmp)
            bp, mounts = prepare(HERE / rel, dist, work)
            bpfile = work / "blueprint.json"
            bpfile.write_text(json.dumps(bp))
            res = work / "results"
            res.mkdir()
            cmd = shlex.split(args.cli) + ["run-blueprint", f"--blueprint={bpfile}", f"--mount={res}:/results"]
            cmd += [f"--mount={m}" for m in mounts]
            try:
                r = subprocess.run(cmd, capture_output=True, text=True, timeout=args.timeout)
                rc, tail = r.returncode, (r.stdout + r.stderr)[-1500:]
            except subprocess.TimeoutExpired:
                rc, tail = 124, "timeout"
            out = res / f"{key}.json"
            checks = []
            if out.is_file():
                data = json.loads(out.read_text())
                checks = data["checks"]
                (results_dir / out.name).write_text(out.read_text())
            bad = [c for c in checks if not c["ok"]]
            ok = rc == 0 and checks and not bad
            print(f"{'PASS' if ok else 'FAIL'}  {key:<13} rc={rc} checks={len(checks)} failed={len(bad)}")
            for c in bad:
                print(f"      x {c['name']} {c['detail']}")
            if not ok:
                failed.append(key)
                if not checks:
                    print("      output tail:", tail.replace("\n", "\n      "))
    print("\nFAILED: " + ", ".join(failed) if failed else "\nAll blueprints passed.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
