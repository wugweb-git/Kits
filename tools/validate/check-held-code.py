#!/usr/bin/env python3
"""A file a plugin's PENDING.md lists under a "## HOLD" heading must not be loaded by that plugin.

A HOLD section names its held files in the sentence "Code is on kits-suite (`includes/x.php`, commit ...)". Any require/include of that file name, or of a loader-list entry
(a quoted bare name such as 'telemetry-404'), from the plugin's own code fails the check. Tests may load held files.

Usage: python3 tools/validate/check-held-code.py        (exit 1 on any problem)
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
problems: list[str] = []

for pending in sorted((ROOT / "plugins").glob("*/PENDING.md")):
    plugin = pending.parent
    text = pending.read_text(encoding="utf-8", errors="ignore")
    for section in re.split(r"(?m)^## ", text):
        if not section.startswith("HOLD"):
            continue
        # the section ends at the next "## " (split already did that)
        # only the files in "Code is on kits-suite (`path`, ...)" are held; other paths in the text are context
        m0 = re.search(r"Code is on kits-suite \(([^)]*)\)", section)
        held = {pathlib.PurePosixPath(m).name for m in re.findall(r"`([\w./-]+\.php)`", m0.group(1))} if m0 else set()
        for name in sorted(held):
            stem = name[:-4]
            files = [p for p in plugin.rglob("*.php") if "tests" not in p.parts and "vendor" not in p.parts and "node_modules" not in p.parts]
            for f in files:
                if f.name == name:
                    continue
                src = f.read_text(encoding="utf-8", errors="ignore")
                for i, line in enumerate(src.splitlines(), 1):
                    if line.lstrip().startswith(("//", "*", "#")):
                        continue
                    if re.search(r"(require|include)(_once)?\b.*" + re.escape(name), line) or re.search(r"""['"]""" + re.escape(stem) + r"""['"]""", line):
                        problems.append(f"{plugin.name}: held file {name} is loaded at {f.relative_to(ROOT)}:{i}")

if problems:
    print("HELD CODE IS LOADED:")
    for p in problems:
        print("  " + p)
    sys.exit(1)
print("ok: no held file is loaded")
