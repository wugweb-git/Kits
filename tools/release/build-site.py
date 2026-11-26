#!/usr/bin/env python3
"""Build the GitHub Pages site: one page per product and the registry manifest.

  _site/index.html                    all products
  _site/plugins/<slug>/index.html     a plugin's page (the address its Plugin URI points to)
  _site/themes/kits-by-wugweb/        the theme's page
  _site/registry/index.json           every product's latest release: version, requirements, download addresses, SHA-256
  _site/registry/<slug>.json          the same for one product

Page text comes from the product's own readme.txt and headers. Download facts come from GitHub releases: a product's own
release (<slug>-v<version>) when one exists, else the latest suite release (kits-suite-*), which attaches every ZIP.
A product with no release is listed as "not released yet": nothing is invented.

Usage: python3 tools/release/build-site.py [--out _site] [--offline]
  GITHUB_TOKEN (optional) raises the API rate limit. --offline skips GitHub (pages only, no download facts).
"""
from __future__ import annotations

import argparse
import datetime
import html
import json
import os
import pathlib
import re
import shutil
import sys
import urllib.request

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import productinfo as pi  # noqa: E402

ASSETS = HERE / "site-assets"


# ---------- GitHub releases ----------

def api(path: str):
    req = urllib.request.Request(f"https://api.github.com/{path}", headers={"Accept": "application/vnd.github+json", "User-Agent": "kits-site-build"})
    tok = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if tok:
        req.add_header("Authorization", f"Bearer {tok}")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def fetch(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "kits-site-build"}), timeout=60) as r:
        return r.read()


def semver(v: str):
    return tuple(int(x) if x.isdigit() else 0 for x in re.split(r"[.\-]", v)[:4])


def release_facts(offline: bool) -> dict[str, dict]:
    """slug -> {version, tag, released_at, prerelease, download{commercial,wporg}, sha256{...}} from GitHub releases."""
    if offline:
        return {}
    rels = [r for r in api(f"repos/{pi.GITHUB}/releases?per_page=100") if not r.get("draft")]
    found: dict[str, dict] = {}

    def assets(r):
        return {a["name"]: a["browser_download_url"] for a in r["assets"]}

    # suite releases: version from release-manifest.json (newest first)
    for r in sorted((r for r in rels if r["tag_name"].startswith("kits-suite-")), key=lambda r: r["created_at"], reverse=True):
        a = assets(r)
        if "release-manifest.json" not in a:
            continue
        try:
            m = json.loads(fetch(a["release-manifest.json"]))
        except Exception:
            continue
        for p in m.get("products", []):
            s = p["product"]
            if s in found:
                continue
            found[s] = {
                "version": p["version"], "tag": r["tag_name"], "released_at": r["published_at"], "prerelease": r["prerelease"],
                "download": {"commercial": a.get(p["artifact"]), "wporg": None},
                "sha256": {"commercial": p.get("sha256"), "wporg": None}, "channel": "suite",
            }
    # per-product releases win when their version is the same or newer
    for r in rels:
        m = re.match(r"^(.+)-v(\d+\.\d+\.\d+.*)$", r["tag_name"])
        if not m or m.group(1) not in pi.PRODUCTS:
            continue
        s, v = m.group(1), m.group(2)
        if s in found and semver(found[s]["version"]) > semver(v):
            continue
        if s in found and found[s].get("channel") == "product" and semver(found[s]["version"]) >= semver(v):
            continue
        a = assets(r)
        sums = {}
        if "SHA256SUMS" in a:
            try:
                for line in fetch(a["SHA256SUMS"]).decode().splitlines():
                    h, _, n = line.partition("  ")
                    sums[n.strip()] = h.strip()
            except Exception:
                pass
        found[s] = {
            "version": v, "tag": r["tag_name"], "released_at": r["published_at"], "prerelease": r["prerelease"],
            "download": {"commercial": a.get(f"{s}.zip"), "wporg": a.get(f"{s}-wporg.zip")},
            "sha256": {"commercial": sums.get(f"{s}.zip"), "wporg": sums.get(f"{s}-wporg.zip")}, "channel": "product",
        }
    return found


# ---------- readme text to HTML ----------

def inline(s: str) -> str:
    s = html.escape(s, quote=False)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", lambda m: f'<a href="{html.escape(m.group(2), quote=True)}">{m.group(1)}</a>', s)
    s = re.sub(r"(?<![\"'>=])(https?://[^\s<)]+)", lambda m: f'<a href="{html.escape(m.group(1), quote=True)}">{m.group(1)}</a>', s)
    return s


def text_to_html(body: str) -> str:
    out: list[str] = []
    para: list[str] = []
    items: list[str] = []

    def flush():
        nonlocal para, items
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para = []
        if items:
            out.append("<ul>" + "".join(f"<li>{inline(i)}</li>" for i in items) + "</ul>")
            items = []

    for line in body.splitlines():
        s = line.rstrip()
        m = re.match(r"^=\s*(.+?)\s*=$", s)
        if m:
            flush()
            out.append(f"<h3>{html.escape(m.group(1))}</h3>")
        elif re.match(r"^\s*[*\-]\s+", s):
            if para:
                flush()
            items.append(re.sub(r"^\s*[*\-]\s+", "", s))
        elif not s.strip():
            flush()
        else:
            if items:
                flush()
            para.append(s.strip())
    flush()
    return "\n".join(out)


# ---------- pages ----------

def esc(s: str) -> str:
    return html.escape(s or "", quote=True)


def faq_html(body: str) -> str:
    """readme FAQ ('= Question =' then answer) as accessible disclosure widgets."""
    out = []
    for m in re.finditer(r"^=\s*(.+?)\s*=\s*\n(.*?)(?=^=\s|\Z)", body, re.M | re.S):
        out.append(f"<details class=\"faq\"><summary>{esc(m.group(1))}</summary>{text_to_html(m.group(2))}</details>")
    return "\n".join(out)


def card(title: str, inner: str, ident: str = "") -> str:
    i = f' id="{ident}"' if ident else ""
    return f'<section class="card"{i} aria-labelledby="h-{ident or esc(title).lower().replace(" ", "-")}"><h2 id="h-{ident or esc(title).lower().replace(" ", "-")}">{esc(title)}</h2>{inner}</section>'


def tile(label: str, value: str, sub: str = "", href: str = "") -> str:
    v = f'<a href="{esc(href)}">{esc(value)}</a>' if href else esc(value)
    s = f'<span class="tile-sub">{esc(sub)}</span>' if sub else ""
    return f'<li class="tile"><span class="tile-label">{esc(label)}</span><span class="tile-value">{v}</span>{s}</li>'


def layout(title: str, body: str, depth: int, tabs: list[tuple[str, str]] | None = None, header: str = "", desc: str = "", path: str = "", ld: dict | None = None) -> str:
    up = "../" * depth
    url = f"{pi.PAGES}/{path}"
    meta = ""
    if desc:
        meta += f'<meta name="description" content="{esc(desc)}">\n<meta property="og:description" content="{esc(desc)}">\n'
    meta += f'<link rel="canonical" href="{esc(url)}">\n<meta property="og:title" content="{esc(title)}">\n<meta property="og:type" content="website">\n<meta property="og:url" content="{esc(url)}">\n<meta name="twitter:card" content="summary">\n<meta name="theme-color" content="#141414">\n'
    meta += '<link rel="icon" href="' + up + 'assets/icon.svg" type="image/svg+xml">\n'
    if ld:
        meta += '<script type="application/ld+json">' + json.dumps(ld).replace("</", "<\\/") + "</script>\n"
    nav = ""
    if tabs:
        cur = ' aria-current="page"'
        items = "".join(f'<li><a href="{esc(h)}"{cur if k == 0 else ""}>{esc(t)}</a></li>' for k, (t, h) in enumerate(tabs))
        nav = f'<nav class="tabs" aria-label="Sections"><ul>{items}</ul></nav>'
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
{meta}<link rel="stylesheet" href="{up}assets/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap bar"><a class="brand" href="{up}">Kits <span>by Wugweb</span></a>
<nav aria-label="Site"><a href="{up}">Products</a><a href="{up}registry/index.json">Registry</a><a href="https://github.com/{pi.GITHUB}">Source</a></nav></div></header>
<div class="appheader"><div class="wrap">{header}{nav}</div></div>
<main id="main" class="wrap">
{body}
</main>
<footer class="wrap foot"><p>Kits by Wugweb. GPL-2.0-or-later. <a href="https://github.com/{pi.GITHUB}">{pi.GITHUB}</a></p></footer>
</body>
</html>
"""


def product_page(i: dict, rel: dict | None) -> str:
    theme = i["type"] == "theme"
    tiles = [tile("Version", i["version"], "in source")]
    if rel:
        tiles.append(tile("Released", rel["version"], rel["released_at"][:10] + (" · prerelease" if rel["prerelease"] else ""), f'https://github.com/{pi.GITHUB}/releases/tag/{rel["tag"]}'))
    else:
        tiles.append(tile("Released", "Not yet", "no download offered"))
    tiles += [tile("WordPress", i["requires_wp"] + "+" if i["requires_wp"] else "", f'tested to {i["tested"]}' if i["tested"] else ""), tile("PHP", i["requires_php"] + "+" if i["requires_php"] else "")]
    tiles = [t for t in tiles if '<span class="tile-value"></span>' not in t]
    cards = []
    if rel:
        dl = ['<ul class="dl">']
        for key, label, note in (("commercial", "Download", "for a site you manage yourself"), ("wporg", "WordPress.org build", "no update header of its own, source included")):
            url = rel["download"].get(key)
            if url:
                sha = rel["sha256"].get(key)
                cls = "btn" if key == "commercial" else "btn btn-2"
                dl.append(f'<li><a class="{cls}" href="{esc(url)}">{label}</a> <span class="muted">{note}</span>' + (f'<br><span class="sha">SHA-256 {esc(sha)}</span>' if sha else "") + "</li>")
        dl.append("</ul>")
        download = "".join(dl)
    else:
        download = "<p>Not released yet. The source is public; no download is offered until a release is published.</p>"
    cards.append(card("Download", download, "download"))
    if i["description_long"].strip():
        cards.append(card("Description", text_to_html(i["description_long"]), "description"))
    if i["screenshots"].strip():
        cards.append(card("Screenshots", text_to_html(i["screenshots"]), "screenshots"))
    if i["installation"].strip():
        cards.append(card("Installation", text_to_html(i["installation"]), "installation"))
    if i["faq"].strip():
        cards.append(card("FAQ", faq_html(i["faq"]), "faq"))
    if i["external_services"].strip():
        cards.append(card("External services", text_to_html(i["external_services"]), "external-services"))
    if i["changelog"].strip():
        cards.append(card("Changelog", text_to_html(i["changelog"]), "changelog"))
    meta = [("Author", f'<a href="{esc(i["author_uri"])}">{esc(i["author"])}</a>' if i["author_uri"] else esc(i["author"])),
            ("Licence", f'<a href="{esc(i["license_uri"])}">{esc(i["license"])}</a>' if i["license_uri"] else esc(i["license"])),
            ("Text domain", f'<code>{esc(i["text_domain"])}</code>' if i["text_domain"] else ""),
            ("Translations", f'<code>{esc(i["domain_path"])}</code>' if i["domain_path"] else ""),
            ("Tags", ", ".join(esc(t) for t in i["tags"])),
            ("Contributors", ", ".join(esc(c) for c in i["contributors"])),
            ("Source", f'<a href="{esc(i["source"])}">{esc(i["source"].replace("https://github.com/", ""))}</a>'),
            ("Registry entry", f'<a href="../../registry/{esc(i["slug"])}.json">registry/{esc(i["slug"])}.json</a>')]
    if i["donate"]:
        meta.append(("Donate", f'<a href="{esc(i["donate"])}">{esc(i["donate"])}</a>'))
    rows = "".join(f'<tr><th scope="row">{k}</th><td>{v}</td></tr>' for k, v in meta if v)
    cards.append(card("Details" if not theme else "Theme details", f'<table class="facts">{rows}</table>', "details"))
    if i["credits"].strip():
        cards.append(card("Credits and copyright", text_to_html(i["credits"]), "credits"))
    tabs = [(t, "#" + h) for t, h, present in (("Download", "download", True), ("Description", "description", bool(i["description_long"].strip())), ("FAQ", "faq", bool(i["faq"].strip())), ("Changelog", "changelog", bool(i["changelog"].strip())), ("Details", "details", True)) if present]
    header = (f'<div class="ah"><div class="ah-icon" aria-hidden="true">{esc(i["name"][:1])}</div><div><p class="kind">{esc(i["type"].capitalize())}</p>'
              f'<h1>{esc(i["name"])} <span class="ver">{esc(i["version"])}</span></h1><p class="lead">{esc(i["short_description"])}</p>'
              + (f'<p class="ah-cta"><a class="btn" href="{esc(rel["download"].get("commercial") or "#download")}">Download {esc(rel["version"])}</a></p>' if rel else '<p class="ah-cta"><a class="btn btn-2" href="#download">Release status</a></p>') + '</div></div>')
    ld = {"@context": "https://schema.org", "@type": "WebApplication" if False else ("SoftwareApplication"), "name": i["name"], "softwareVersion": (rel or {}).get("version") or i["version"],
          "description": i["short_description"], "applicationCategory": "WordPress " + i["type"], "operatingSystem": "WordPress " + (i["requires_wp"] + "+" if i["requires_wp"] else ""),
          "license": i["license_uri"] or None, "url": i["page"], "author": {"@type": "Organization", "name": i["author"] or "Wugweb"}}
    ld = {k: v for k, v in ld.items() if v}
    body = f'<ul class="tiles">{"".join(tiles)}</ul>' + "\n".join(cards)
    return layout(f'{i["name"]} {i["version"]} | Kits by Wugweb', body, 2, tabs, header, i["short_description"], f'{"themes" if theme else "plugins"}/{i["slug"]}/', ld)


def index_page(infos: list[dict], facts: dict) -> str:
    cards = []
    for i in infos:
        rel = facts.get(i["slug"])
        status = f'Released {esc(rel["version"])}' if rel else "Not released yet"
        href = f'{"themes" if i["type"] == "theme" else "plugins"}/{esc(i["slug"])}/'
        cards.append(f'<li class="tile"><span class="tile-label">{esc(i["type"].capitalize())}</span><span class="tile-value"><a href="{href}">{esc(i["name"])}</a></span>'
                     f'<span class="tile-sub">{status} · source {esc(i["version"])}</span><span class="tile-desc">{esc(i["short_description"])}</span></li>')
    header = '<div class="ah"><div class="ah-icon" aria-hidden="true">K</div><div><h1>Kits by Wugweb</h1><p class="lead">The theme and the plugins of the Kits suite. Each product has its own version, changelog and release.</p></div></div>'
    body = f'<ul class="tiles tiles-wide">{"".join(cards)}</ul>' + card("Registry", '<p>The machine-readable list of every product\'s latest release, with download addresses and SHA-256, is the <a href="registry/index.json">registry</a>.</p>', "registry")
    return layout("Kits by Wugweb: products", body, 0, None, header, "The Kits by Wugweb block theme and plugins for WordPress. Each has its own version, changelog and release.", "")


def registry_entry(i: dict, rel: dict | None) -> dict:
    e = {
        "name": i["name"], "type": i["type"], "version_in_source": i["version"],
        "requires_wp": i["requires_wp"], "requires_php": i["requires_php"], "tested": i["tested"], "license": i["license"],
        "page": i["page"], "source": i["source"], "released": bool(rel),
    }
    if rel:
        e.update({
            "version": rel["version"], "tag": rel["tag"], "released_at": rel["released_at"], "prerelease": rel["prerelease"],
            "download": rel["download"], "sha256": rel["sha256"],
        })
    return e


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="_site")
    ap.add_argument("--offline", action="store_true")
    a = ap.parse_args()
    out = pathlib.Path(a.out).resolve()
    if out.exists():
        shutil.rmtree(out)
    (out / "registry").mkdir(parents=True)
    shutil.copytree(ASSETS, out / "assets")
    (out / ".nojekyll").write_text("")

    facts = release_facts(a.offline)
    infos = [pi.info(s) for s in pi.PRODUCTS]
    (out / "index.html").write_text(index_page(infos, facts), encoding="utf-8")
    entries = {}
    for i in infos:
        rel = facts.get(i["slug"])
        d = out / ("themes" if i["type"] == "theme" else "plugins") / i["slug"]
        d.mkdir(parents=True)
        (d / "index.html").write_text(product_page(i, rel), encoding="utf-8")
        e = registry_entry(i, rel)
        entries[i["slug"]] = e
        (out / "registry" / f"{i['slug']}.json").write_text(json.dumps({"schema_version": 1, "product": i["slug"], **e}, indent=2) + "\n")
    urls = [pi.PAGES + "/"] + [i["page"] for i in infos]
    (out / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "".join(f"<url><loc>{u}</loc></url>" for u in urls) + "</urlset>\n")
    (out / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {pi.PAGES}/sitemap.xml\n")
    (out / "404.html").write_text(layout("Page not found | Kits by Wugweb", '<section class="card"><h2>Page not found</h2><p>This address has no page. Go to <a href="/Kits/">all products</a>.</p></section>', 0, None, '<div class="ah"><div><h1>Page not found</h1></div></div>', "", "404.html"), encoding="utf-8")
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    (out / "registry" / "index.json").write_text(json.dumps({"schema_version": 1, "generated_at": stamp, "repository": f"https://github.com/{pi.GITHUB}", "products": entries}, indent=2) + "\n")
    print(f"site: {len(infos)} product pages, registry with {sum(1 for e in entries.values() if e['released'])} released products -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
