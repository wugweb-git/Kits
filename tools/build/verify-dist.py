#!/usr/bin/env python3
"""Verify the eight Kits Suite distribution ZIPs and write checksums + a release manifest.

Checks per ZIP (fail-fast, exit 1 on any failure):
  * exactly one root folder named after the product slug
  * main plugin file / style.css carries Plugin Name + Version (version read from the file, never invented)
  * no tests, node_modules, composer manifests, lockfiles, uncompiled top-level src/, VCS or dev files
  * every .php file passes `php -l`
  * no reference to sibling monorepo paths (../../ plugins/, packages/, themes/)
  * vendor/ is present only for products that bundle production dependencies (MailWeb), and for MailWeb
    vendor/autoload.php loads in an isolated PHP process and exposes Hostinger\\Api\\SendApi

Usage: python3 tools/build/verify-dist.py --dist dist [--commit SHA] [--manifest dist/release-manifest.json]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import re
import subprocess
import sys
import tempfile
import zipfile

PRODUCTS = {
    "kits-by-wugweb": ("theme", "style.css"),
    "kits-core": ("plugin", "kits-core.php"),
    "directoryweb": ("plugin", "directoryweb.php"),
    "rankweb": ("plugin", "rankweb.php"),
    "mailweb": ("plugin", "mailweb.php"),
    "sourceweb": ("plugin", "sourceweb.php"),
    "insightweb": ("plugin", "insightweb.php"),
    "planweb": ("plugin", "planweb.php"),
}
VENDOR_PRODUCTS = {"mailweb"}
FORBIDDEN_PARTS = {"tests", "test", "node_modules", ".git", ".github"}
# Uncompiled JS/CSS sources: forbidden only at the package top level (vendor packages use src/ for PHP).
FORBIDDEN_TOP_LEVEL = {"src"}
FORBIDDEN_NAMES = {"composer.json", "composer.lock", "package.json", "package-lock.json", "PENDING.md"}
MONOREPO_REF = re.compile(r"(\.\./){2,}(plugins|packages|themes|design-system)/|/home/claude|monorepo-root", re.I)


def sha256(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def header(text: str, key: str) -> str | None:
    m = re.search(r"^\s*\*?\s*" + re.escape(key) + r":\s*(.+?)\s*$", text, re.M)
    return m.group(1) if m else None


def verify(slug: str, zip_path: pathlib.Path, errors: list[str]) -> dict:
    kind, main = PRODUCTS[slug]
    info = {"product": slug, "type": kind, "artifact": zip_path.name}
    with zipfile.ZipFile(zip_path) as zf:
        if zf.testzip() is not None:
            errors.append(f"{slug}: corrupt zip entry")
        names = [n for n in zf.namelist() if not n.endswith("/")]
        roots = {n.split("/")[0] for n in names}
        if roots != {slug}:
            errors.append(f"{slug}: root folder(s) {sorted(roots)} != [{slug}]")
        if f"{slug}/{main}" not in names:
            errors.append(f"{slug}: missing {main}")
        else:
            text = zf.read(f"{slug}/{main}").decode("utf-8", "replace")[:8192]
            name, ver = header(text, "Plugin Name") or header(text, "Theme Name"), header(text, "Version")
            if not name or not ver:
                errors.append(f"{slug}: Name/Version header missing in {main}")
            info.update(name=name, version=ver)
        has_vendor = any(n.startswith(f"{slug}/vendor/") for n in names)
        if has_vendor != (slug in VENDOR_PRODUCTS):
            errors.append(f"{slug}: vendor/ present={has_vendor}, expected={slug in VENDOR_PRODUCTS}")
        for n in names:
            rel = n.split("/", 1)[1]
            parts = rel.split("/")
            in_vendor = parts[0] == "vendor"
            check_parts = parts[1:] if in_vendor else parts
            if any(p.lower() in FORBIDDEN_PARTS for p in (check_parts[:-1] if in_vendor else parts[:-1])) or \
               (not in_vendor and parts[-1].lower() in FORBIDDEN_PARTS):
                errors.append(f"{slug}: dev/uncompiled path shipped: {rel}")
                break
            if not in_vendor and parts[0] in FORBIDDEN_TOP_LEVEL:
                errors.append(f"{slug}: uncompiled source shipped: {rel}")
                break
            if parts[-1] in FORBIDDEN_NAMES and not (parts == ['composer.json'] and slug in VENDOR_PRODUCTS):  # a bundled vendor/ ships with its composer.json
                errors.append(f"{slug}: forbidden file shipped: {rel}")
                break
        with tempfile.TemporaryDirectory() as tmp:
            zf.extractall(tmp)
            root = pathlib.Path(tmp) / slug
            bad_lint = 0
            for f in root.rglob("*.php"):
                r = subprocess.run(["php", "-l", str(f)], capture_output=True, text=True)
                if r.returncode != 0:
                    # vendor files for newer PHP syntax are not linted on older runtimes
                    errors.append(f"{slug}: php -l failed: {f.relative_to(root)}: {r.stdout.strip()[:120]}")
                    bad_lint += 1
                    if bad_lint > 3:
                        break
            for f in root.rglob("*.php"):
                if "vendor" in f.relative_to(root).parts:
                    continue
                if MONOREPO_REF.search(f.read_text("utf-8", "replace")):
                    errors.append(f"{slug}: monorepo path reference in {f.relative_to(root)}")
            if slug in VENDOR_PRODUCTS:
                probe = (
                    "require %r; exit( class_exists('Hostinger\\\\Api\\\\SendApi') "
                    "&& class_exists('Hostinger\\\\Configuration') ? 0 : 3 );" % str(root / "vendor/autoload.php")
                )
                r = subprocess.run(["php", "-d", "display_errors=1", "-r", probe], capture_output=True, text=True)
                if r.returncode != 0:
                    errors.append(f"{slug}: SDK autoload probe failed rc={r.returncode} {r.stdout[:200]}{r.stderr[:200]}")
                info["sdk_autoload"] = r.returncode == 0
    info["size_bytes"] = zip_path.stat().st_size
    info["sha256"] = sha256(zip_path)
    return info


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default="dist")
    ap.add_argument("--commit", default="")
    ap.add_argument("--manifest", default="")
    args = ap.parse_args()
    dist = pathlib.Path(args.dist)
    errors: list[str] = []
    products = []
    for slug in PRODUCTS:
        z = dist / f"{slug}.zip"
        if not z.is_file():
            errors.append(f"{slug}: {z} missing")
            continue
        products.append(verify(slug, z, errors))
    extra = sorted(p.name for p in dist.glob("*.zip") if p.stem not in PRODUCTS)
    if extra:
        errors.append(f"unexpected zips: {extra}")
    for p in products:
        print(f"  {p['product']:<16} {p.get('version','?'):<8} {p['size_bytes']:>9} B  sha256:{p['sha256']}")
    if errors:
        print("\nFAILED:")
        for e in errors:
            print("  -", e)
        return 1
    out = pathlib.Path(args.manifest or dist / "release-manifest.json")
    out.write_text(json.dumps({"source_commit": args.commit, "products": products}, indent=2) + "\n")
    (dist / "SHA256SUMS").write_text("".join(f"{p['sha256']}  {p['artifact']}\n" for p in products))
    print(f"\nAll {len(products)} packages verified. Manifest: {out}  Checksums: {dist/'SHA256SUMS'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
