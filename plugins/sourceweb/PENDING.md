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

- Standalone edition (26 Nov 2026), part built: an external-services registry (`includes/sources/external-services-model.php`, `sourceweb_external_services` filter; a test fails when `readme.txt` stops naming a service), and every `aw/v1` worker route is also served at `sourceweb/v1/worker-api/<route>`. Not built: moving the workers repository to the new address, a shared `Wugweb\ExternalServices` package across plugins, and renaming the `AW_*` constants and stored `aw_*` names (kept: renaming breaks stored data and the workers).
- Menu: the code has Overview, Enrichment review, To review and per-tab items; the old plan wanted Dashboard, To review, Settings.
- `enrichment-front.php` Kits Core calls (`kits_icon`, `kits_date`) are now guarded (26 Nov).
- The AI model router is on hold (owner).
- Organisation (26 Nov): `includes/` is now grouped by purpose and `ARCHITECTURE.md` maps the flow, folders, inputs and outputs. Still open: consistent file names, a shared settings layer for rules and keywords, and generating the workers registry (a CI check, tools/ci/workers_registry_check.php, now compares it with the workers repo; it is not gating until the workers repo's chore/retire-eight-workflows is merged).
- Workflow cleanup (26 Nov 2026): 12 workflows kept, 8 removed from the registry; merge the workers repo branch `chore/retire-eight-workflows`. Not built: the manual Tools task for submit and relevance-existing.

## Built 26 Nov 2026 (branch feat/sourceweb-places-ui)

- Places tab (routes, per-place enhancements, source types, what places say back); AI keys ordered by job (`?job=`) with the paid providers removed; worker union (`workers/union`, `sourceweb_workers` filter); manual re-check tool on Rejected; REST callbacks split by feature.
- Not verified in a browser: the Places screen and the re-check card (built and linted, never opened).
- Closed loop (26 Nov): a source with 10 or more decisions and under 30% accepted is flagged "Review this source" on Places; nothing is blocked automatically. Workers screen has an "All workers" table (the union). The workers repo sends `job` when `AW_AI_JOB` is set (branch chore/retire-eight-workflows); the site picks a default job from the worker otherwise.
- Fixed 26 Nov: the first Places build shipped enhancement handlers in the wrong component and no checkboxes (lint showed it; I had not read the lint output). Rebuilt and relinted clean.
- Not built: anything that acts on a flag (auto-pausing a source); places calling `places/outcome` (no place calls it yet); the standalone edition's renames.
