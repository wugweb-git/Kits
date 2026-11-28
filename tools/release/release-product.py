#!/usr/bin/env python3
"""Prepare one product's release: its own ZIPs, checksums, manifest entry and notes. Nothing is published here.

A release is one product with its own version, changelog and tag (docs/architecture/monorepo-delivery-architecture.md, 4.2).
The tag is <slug>-v<version>, the version read from the product's own header.

Outputs in --out:
  <slug>.zip            commercial build (keeps Update URI where the product has one)
  <slug>-wporg.zip      WordPress.org build (no Update URI; source included)
  SHA256SUMS            both ZIPs
  <slug>-release.json   the registry entry for this release
  NOTES.md              release notes: this version's changelog, install, external services

Usage: python3 tools/release/release-product.py <slug> --out dist-release [--commit SHA]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import productinfo as pi  # noqa: E402

BUILD = pi.REPO / "tools" / "build" / "build-dist.py"


def sha256(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def build(target: str, track: str, out: pathlib.Path) -> None:
    subprocess.run([sys.executable, str(BUILD), "--target", target, "--track", track, "--out", str(out)], check=True, stdout=subprocess.DEVNULL)


def read_main(zip_path: pathlib.Path, slug: str) -> str:
    name = f"{slug}/{'style.css' if slug == pi.THEME else slug + '.php'}"
    with zipfile.ZipFile(zip_path) as zf:
        return zf.read(name).decode("utf-8", errors="ignore")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("product", choices=pi.PRODUCTS)
    ap.add_argument("--out", default="dist-release")
    ap.add_argument("--commit", default="")
    a = ap.parse_args()

    slug = a.product
    i = pi.info(slug)
    version = i["version"]
    if not version or i["stable_tag"] != version:
        print(f"{slug}: header Version {version!r} and readme Stable tag {i['stable_tag']!r} must match", file=sys.stderr)
        return 1
    target = "theme" if slug == pi.THEME else slug
    out = pathlib.Path(a.out).resolve()
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    with tempfile.TemporaryDirectory() as t1, tempfile.TemporaryDirectory() as t2:
        build(target, "commercial", pathlib.Path(t1))
        build(target, "wporg", pathlib.Path(t2))
        commercial = pathlib.Path(t1) / f"{slug}.zip"
        wporg_src = pathlib.Path(t2) / (f"{slug}-wporg.zip" if slug == pi.THEME else f"{slug}.zip")
        shutil.copy2(commercial, out / f"{slug}.zip")
        shutil.copy2(wporg_src, out / f"{slug}-wporg.zip")
        # Banners, icons and screenshots for the WordPress.org SVN /assets folder (they are not in the .org zip).
        assets_dir = pathlib.Path(t2) / "wporg-assets" / slug
        if assets_dir.is_dir():
            shutil.make_archive(str(out / f"{slug}-wporg-assets"), "zip", root_dir=assets_dir.parent, base_dir=slug)

    # The ZIPs must carry the version they are named for, and the .org build must not carry an updater of its own.
    for name in (f"{slug}.zip", f"{slug}-wporg.zip"):
        v = pi.header(read_main(out / name, slug), "Version")
        if v != version:
            print(f"{name}: Version {v!r} in the ZIP, {version!r} in the source", file=sys.stderr)
            return 1
    if re.search(r"^[ \t/*#]*Update URI:", read_main(out / f"{slug}-wporg.zip", slug), re.M | re.I):
        print(f"{slug}-wporg.zip still has an Update URI", file=sys.stderr)
        return 1

    files = {n: out / n for n in (f"{slug}.zip", f"{slug}-wporg.zip", f"{slug}-wporg-assets.zip") if (out / n).is_file()}
    sums = {n: sha256(p) for n, p in files.items()}
    (out / "SHA256SUMS").write_text("".join(f"{s}  {n}\n" for n, s in sums.items()))

    tag = pi.tag_for(slug, version)
    entry = {
        "schema_version": 1,
        "product": slug,
        "type": i["type"],
        "name": i["name"],
        "version": version,
        "tag": tag,
        "requires_wp": i["requires_wp"],
        "requires_php": i["requires_php"],
        "tested": i["tested"],
        "license": i["license"],
        "page": i["page"],
        "source": i["source"],
        "source_commit": a.commit,
        "assets": {n: {"size_bytes": p.stat().st_size, "sha256": sums[n]} for n, p in files.items()},
    }
    (out / f"{slug}-release.json").write_text(json.dumps(entry, indent=2) + "\n")

    notes = [f"{i['name']} {version}", "", i["short_description"], ""]
    if i["changelog_current"]:
        notes += ["## Changes", "", i["changelog_current"], ""]
    notes += [
        "## Files",
        "",
        f"- `{slug}.zip`: the build for sites you manage yourself.",
        f"- `{slug}-wporg.zip`: the WordPress.org build, without an update header of its own, with its source included.",
        f"- `{slug}-wporg-assets.zip`: its banners, icons and screenshots, for the WordPress.org assets folder.",
        "- `SHA256SUMS` and the registry entry are attached.",
        "",
        f"Requires WordPress {i['requires_wp']}, PHP {i['requires_php']}. Details: {i['page']}",
    ]
    if i["external_services"].strip():
        notes += ["", "## External services", "", i["external_services"].strip()]
    (out / "NOTES.md").write_text("\n".join(notes) + "\n")

    print(f"tag={tag}")
    print(f"title={i['name']} {version}")
    for n, s in sums.items():
        print(f"{s}  {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
