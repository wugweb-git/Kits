"""Read a product's own headers and readme.txt. Shared by the release, site and validation tools.

A product is a plugin (plugins/<slug>/<slug>.php + readme.txt) or the theme (themes/kits-by-wugweb/style.css + readme.txt).
Nothing here is invented: every value comes from the product's files.
"""
from __future__ import annotations

import pathlib
import re

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
PLUGINS = ["kits-core", "directoryweb", "rankweb", "sourceweb", "insightweb", "mailweb", "planweb"]
THEME = "kits-by-wugweb"
PRODUCTS = [THEME] + PLUGINS
GITHUB = "wugweb-git/Kits"
PAGES = "https://wugweb-git.github.io/Kits"


def folder(slug: str) -> pathlib.Path:
    return REPO / ("themes" if slug == THEME else "plugins") / slug


def kind(slug: str) -> str:
    return "theme" if slug == THEME else "plugin"


def main_file(slug: str) -> pathlib.Path:
    return folder(slug) / ("style.css" if slug == THEME else f"{slug}.php")


def header(text: str, key: str) -> str:
    m = re.search(r"^[ \t/*#]*" + re.escape(key) + r":[ \t]*(.+?)[ \t]*$", text[:8000], re.M | re.I)
    return m.group(1).strip() if m else ""


def sections(readme: str) -> dict[str, str]:
    """readme.txt split by '== Name ==' lines (lower-cased names)."""
    out: dict[str, str] = {}
    parts = re.split(r"^==\s*([^=\n]+?)\s*==\s*$", readme, flags=re.M)
    # parts[0] is the header block; then name, body, name, body ...
    out["_header"] = parts[0]
    for i in range(1, len(parts) - 1, 2):
        out[parts[i].strip().lower()] = parts[i + 1].strip("\n")
    return out


def short_description(readme: str) -> str:
    head = sections(readme)["_header"].splitlines()
    i = next((k for k, l in enumerate(head) if l.lower().startswith("license uri")), None)
    if i is None:
        return ""
    return next((l.strip() for l in head[i + 1:] if l.strip()), "")


def changelog_for(readme: str, version: str) -> str:
    body = sections(readme).get("changelog", "")
    m = re.search(r"^=\s*" + re.escape(version) + r"[^=\n]*=\s*\n(.*?)(?=^=\s|\Z)", body, re.M | re.S)
    return m.group(1).strip() if m else ""


def info(slug: str) -> dict:
    main = main_file(slug).read_text(encoding="utf-8", errors="ignore")
    rm_path = folder(slug) / "readme.txt"
    rm = rm_path.read_text(encoding="utf-8", errors="ignore") if rm_path.exists() else ""
    rh = sections(rm)["_header"] if rm else ""
    name = header(main, "Plugin Name" if slug != THEME else "Theme Name")
    version = header(main, "Version")
    sec = sections(rm) if rm else {}
    return {
        "slug": slug,
        "type": kind(slug),
        "name": name,
        "version": version,
        "description": header(main, "Description"),
        "short_description": short_description(rm) if rm else header(main, "Description"),
        "requires_wp": header(main, "Requires at least") or header(rh, "Requires at least"),
        "requires_php": header(main, "Requires PHP") or header(rh, "Requires PHP"),
        "tested": header(rh, "Tested up to"),
        "stable_tag": header(rh, "Stable tag"),
        "license": header(main, "License") or header(rh, "License"),
        "tags": [t.strip() for t in header(rh, "Tags").split(",") if t.strip()],
        "has_update_uri": bool(re.search(r"^[ \t/*#]*Update URI:", main[:8000], re.M | re.I)),
        "plugin_uri": header(main, "Plugin URI") or header(main, "Theme URI"),
        "page": f"{PAGES}/{'themes' if slug == THEME else 'plugins'}/{slug}/",
        "source": f"https://github.com/{GITHUB}/tree/kits-suite/{'themes' if slug == THEME else 'plugins'}/{slug}",
        "description_long": sec.get("description", ""),
        "external_services": sec.get("external services", ""),
        "installation": sec.get("installation", ""),
        "changelog": sec.get("changelog", ""),
        "faq": sec.get("frequently asked questions", ""),
        "credits": sec.get("credits", "") or sec.get("copyright", "") or sec.get("resources", ""),
        "screenshots": sec.get("screenshots", ""),
        "upgrade_notice": sec.get("upgrade notice", ""),
        "contributors": [c.strip() for c in header(rh, "Contributors").split(",") if c.strip()],
        "donate": header(rh, "Donate link"),
        "author": header(main, "Author"),
        "author_uri": header(main, "Author URI"),
        "text_domain": header(main, "Text Domain"),
        "domain_path": header(main, "Domain Path"),
        "license_uri": header(main, "License URI"),
        "changelog_current": changelog_for(rm, version) if rm else "",
    }


def tag_for(slug: str, version: str) -> str:
    return f"{slug}-v{version}"
