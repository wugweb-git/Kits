#!/usr/bin/env python3
"""Build distributable ZIP packages for the Kits Suite monorepo.

Packages:
  * themes/kits-by-wugweb -> dist/kits-by-wugweb.zip (or -commercial / -wporg)
  * plugins/kits-core     -> dist/kits-core.zip
  * plugins/directoryweb  -> dist/directoryweb.zip
  * plugins/rankweb       -> dist/rankweb.zip
  * plugins/mailweb       -> dist/mailweb.zip
  * plugins/sourceweb     -> dist/sourceweb.zip
  * plugins/insightweb    -> dist/insightweb.zip
  * plugins/planweb       -> dist/planweb.zip

Usage:
  python3 tools/build/build-dist.py --target all [--out dist]
  python3 tools/build/build-dist.py --target theme --track commercial
  python3 tools/build/build-dist.py --target kits-core
"""

from __future__ import annotations

import argparse
import fnmatch
import hashlib
import pathlib
import re
import shutil
import sys
import zipfile

REPO = pathlib.Path(__file__).resolve().parent.parent.parent

PLUGINS = [
    "kits-core",
    "directoryweb",
    "rankweb",
    "mailweb",
    "sourceweb",
    "insightweb",
    "planweb",
]

TARGETS = {
    "theme": {
        "src": REPO / "themes" / "kits-by-wugweb",
        "slug": "kits-by-wugweb",
        "update_uri": "https://wugweb.com/kits/",
    },
}

for p in PLUGINS:
    TARGETS[p] = {
        "src": REPO / "plugins" / p,
        "slug": p,
        "update_uri": None,
    }

EXCLUDE = [
    ".git*",
    ".DS_Store",
    "Thumbs.db",
    "*.log",
    ".phpcs.xml*",
    "phpcs.xml*",
    "phpstan.neon*",
    "phpunit.xml*",
    "composer.json",
    "composer.lock",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "vite.config.*",
    "webpack.config.*",
    "node_modules",
    "node_modules/*",
    "vendor",
    "vendor/*",
    "tests",
    "tests/*",
    "*_test.go",
    "*_test.py",
    "*.test.ts",
    "*.spec.ts",
    "*.test.js",
    "*.spec.js",
    "coverage",
    "coverage/*",
    ".pytest_cache",
    ".pytest_cache/*",
]

SRC_EXCLUDE = [
    "admin-app/src",
    "admin-app/src/*",
]


def excluded(rel_path: str, patterns: list[str]) -> bool:
    for pat in patterns:
        if fnmatch.fnmatch(rel_path, pat):
            return True
        for part in pathlib.PurePosixPath(rel_path).parts:
            if fnmatch.fnmatch(part, pat):
                return True
    return False


def set_theme_update_uri(style_css: pathlib.Path, uri: str | None) -> None:
    if not style_css.exists():
        return
    text = style_css.read_text(encoding="utf-8")
    text = re.sub(r"^\s*Update URI:.*\n", "", text, flags=re.MULTILINE)
    if uri:
        text = re.sub(r"^(\s*Version:.*\n)", r"\1Update URI: " + uri + "\n", text, count=1, flags=re.MULTILINE)
    style_css.write_text(text, encoding="utf-8")


def sha256_file(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def build(target: str, track: str, out_dir: pathlib.Path) -> pathlib.Path:
    spec = TARGETS[target]
    src: pathlib.Path = spec["src"]
    slug = spec["slug"]
    if not src.is_dir():
        sys.exit(f"Source not found: {src}")

    stage = out_dir / f".stage_{slug}"
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)

    patterns = EXCLUDE if track == "wporg" else EXCLUDE + SRC_EXCLUDE

    count = 0
    for path in sorted(src.rglob("*")):
        rel = path.relative_to(src).as_posix()
        if excluded(rel, patterns):
            continue
        dest = stage / rel
        if path.is_dir():
            dest.mkdir(parents=True, exist_ok=True)
        else:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, dest)
            count += 1

    if target == "theme":
        set_theme_update_uri(stage / "style.css", spec["update_uri"] if track == "commercial" else None)

    zip_name = f"{slug}-{track}.zip" if target == "theme" and track != "commercial" else f"{slug}.zip"
    zip_path = out_dir / zip_name
    if zip_path.exists():
        zip_path.unlink()

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for path in sorted(stage.rglob("*")):
            if path.is_file():
                arcname = pathlib.Path(slug) / path.relative_to(stage)
                zf.write(path, arcname)

    shutil.rmtree(stage)

    sha = sha256_file(zip_path)
    size_kb = zip_path.stat().st_size / 1024
    print(f"  ✓ {zip_path.name:<24} {size_kb:>7.1f} KB  ({count:>3} files)  sha256:{sha[:12]}...")
    return zip_path


def main() -> None:
    ap = argparse.ArgumentParser(description="Build theme and plugin distribution ZIPs.")
    ap.add_argument("--target", choices=["all", "theme"] + PLUGINS, default="all")
    ap.add_argument("--track", choices=["commercial", "wporg"], default="commercial")
    ap.add_argument("--out", default="dist")
    args = ap.parse_args()

    out_dir = (REPO / args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    targets = ["theme"] + PLUGINS if args.target == "all" else [args.target]
    print(f"Building Kits Suite distribution packages (track: {args.track})...")
    for t in targets:
        build(t, args.track, out_dir)
    print(f"All packages written to {out_dir}/")


if __name__ == "__main__":
    main()
