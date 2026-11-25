#!/usr/bin/env python3
"""Every product's version must agree: main-file header, readme.txt Stable tag, any *_VERSION constant, and the changelog.

Also checks the identity a release depends on: text domain equals the slug, the readme names its tested-up-to and requires
lines, and a plugin's readme has a changelog entry for its current version.

Usage: python3 tools/validate/check-versions.py        (exit 1 on any problem)
"""
from __future__ import annotations

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "release"))
import productinfo as pi  # noqa: E402

problems: list[str] = []


def bad(slug: str, msg: str) -> None:
    problems.append(f"{slug}: {msg}")


for slug in pi.PRODUCTS:
    i = pi.info(slug)
    main = pi.main_file(slug).read_text(encoding="utf-8", errors="ignore")
    if not i["version"]:
        bad(slug, "no Version header")
        continue
    if i["stable_tag"] != i["version"]:
        bad(slug, f"readme Stable tag {i['stable_tag']!r} != header Version {i['version']!r}")
    for k in ("requires_wp", "requires_php", "tested", "license"):
        if not i[k]:
            bad(slug, f"missing {k.replace('_', ' ')}")
    if pi.header(main, "Text Domain") != slug:
        bad(slug, f"Text Domain {pi.header(main, 'Text Domain')!r} != slug")
    # a *_VERSION constant in the main file must equal the header
    for m in re.finditer(r"define\(\s*'([A-Z_]*VERSION)'\s*,\s*'([^']+)'", main):
        if m.group(2) != i["version"]:
            bad(slug, f"{m.group(1)} is {m.group(2)!r}, header says {i['version']!r}")
    if slug != pi.THEME and not i["changelog_current"]:
        bad(slug, f"readme.txt has no changelog entry for {i['version']}")

if problems:
    print("Version / identity problems:")
    for p in problems:
        print("  -", p)
    sys.exit(1)
print(f"ok: {len(pi.PRODUCTS)} products agree on version, text domain and readme basics")
