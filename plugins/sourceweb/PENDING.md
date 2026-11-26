# SourceWeb: Pending & Roadmap

## Active Scope & Responsibilities
The content ingestion and syndication plugin owns:
- Feed ingestion (RSS, Atom, JSON feeds).
- External news scrapers and content reprint engine.
- Duplicate detection and content fingerprinting.
- Ingestion review queue and source rejection logic.

---

## Built & Operational (22 Nov 2026)

1. **Reprint Engine Controls**:
   - ✅ Canonical URL enforcement linking back to original sources (`attribution.php`).
   - ✅ Author attribution cards and syndication notices (`attribution.php`).
   - ✅ Automated keyword tagging based on incoming content analysis (`relevance.php`, `keywords-model.php`).

2. **Ingestion Queue & Source Rules**:
   - ✅ Rule engine for auto-discarding rejected or already applied rows (`rules-model.php`, `auto-review.php`).
   - ✅ Domain whitelisting and blacklisting (`source-sites.php`, `sources-model.php`).
   - ✅ Rate limiting external fetches with `wp_safe_remote_get` (`ingest.php`).

---

## Open Tasks & Enhancements

1. **AI Model Router Parity**:
   - Free/open model integration when gated by owner consent.
   - Ongoing evaluation of feed sources against quality thresholds.

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- A standalone `sourceweb_` edition with an external-services registry and a shared `Wugweb\ExternalServices` package: not built. The plugin still uses `AW_SRC_*` constants and `aw/v1` routes (kept by policy).
- Menu: the code has Overview, Enrichment review, To review and per-tab items; the old plan wanted Dashboard, To review, Settings.
- `enrichment-front.php` Kits Core calls (`kits_icon`, `kits_date`) are now guarded (26 Nov).
- The AI model router is on hold (owner).
- Organisation (26 Nov): `includes/` is now grouped by purpose and `ARCHITECTURE.md` maps the flow, folders, inputs and outputs. Still open: consistent file names, splitting `rest/sourceweb-rest-pages.php` (2,100 lines), a shared settings layer for rules and keywords, and a generated workers registry so it cannot drift from the workers repo.
