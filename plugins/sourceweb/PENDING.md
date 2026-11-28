# SourceWeb: Pending & Roadmap

## Status, 28 Nov 2026, second batch (0.7.1)

Released from kits-suite with CI green on a3db44c. Tests run: version, held-code and brand checks, more-page and plugin-info tests, the plugin's own suite, `php -l`; screenshots captured in Playground with headless Chrome. Not run on a live WordPress.

- Done: Plugins-screen row (Version | By | View details | Getting Started | Documentation) and the View details modal (Description, Installation, FAQ, Changelog, Screenshots, Reviews) from readme.txt and assets/screenshot-N.png; screenshots and captions; .pot regenerated; UX audit fixes 01, 07, 08, 09, 10 that touch this plugin; More from Kits registered after the plugin's own menu with a redirect to Kits Core's page when Core is active.
- Open: pipeline chart shows fat blocks with three bars; contradicting health verdict on Dashboard and Workers (UX 06); verify Add place on the Core-shell Places screen (UX 22); tab strip overflow (UX 04).
- Open, whole suite: official Plugin Check on a live WordPress (deferred by the owner); WordPress.org submission (when everything is done; Claude confirms each product first); staging then live deploy; UX findings listed in docs/ux-audit-2026-11-28.md; screen reader, Safari and real phones.

## Built 28 Nov 2026 (0.6.0)

- Run now without Kits Core (own GitHub dispatch, token and repository in wp-config.php). The workers repository is renamed `wugweb-git/sourceweb-workers`. Tested with a stand-in for GitHub only: no real dispatch was made. The live Animal Writes site must deploy the site layer (its `kits_dispatch_repo` and `sourceweb_workers_repo` now name the new repository) and, if its token is a fine-grained token for the old repository, keep using it (GitHub keeps tokens across a rename; if Run now says the repository moved, check `SOURCEWEB_WORKERS_REPO`).
- The workers repository's own README, tests and docs may still say the old name; that is in that repository, not here.

## Built 28 Nov 2026 (0.5.0)

- Add place (and Remove, when no route uses it) on the standalone Places screen; favicon host check with two filters. Unit tests only; not run on a live WordPress.
- Still not built standalone: Run now (needs a GitHub token and a workers repository, which belong to the tenant), custom boolean tests in routes, some rule types.

## 0.4.1: post types by role, AWBI and Darpan enrichment moved out (27 Nov 2026)

Done: see CHANGELOG.md 0.4.1. Still to do from the 0.4.0 list below: `AW_WORKERS`, the India edition of Google News and IST, the Indian place-name scoring in `cc0-images.php`, the Indian hosts and "india" stop words in `library-pdfs.php` and `auto-review.php`, the India Post source and the `animals` field in `enrichment.php` and `src/index.js`, and the `awbi` and `darpan` keys in the `rules-model.php` trust-order seed (kept: the workers' constants and the seed fixture hold them). The AWBI and NGO Darpan sources, fields and queue group are no longer in that list: they are in the site layer.

Also still Animal Writes shaped, found while removing the types: the Indian place matching in `ingest.php` (`aw_places_from_text`, the LGD files), the Gazette notification number check (`sourceweb_legal_by_number`), the "about India" verdict in `sourceweb_ai_passed()`, and the `aw_post_types()` and `aw_section_*` calls that read Kits Core. `includes/compat/legacy-aliases.php` is not site-only (callers outside the plugin use those names), so it stays until they call the `sourceweb_` functions.

The ACF group key `group_aw_listing` (`AW_ENRICH_LISTING_GROUP`, `rules.php`) is the one place the plugin still spells a listing name: it is the key of DirectoryWeb's field group file; it should come from a DirectoryWeb accessor.

## 0.4.0: site-specific code removed (27 Nov 2026)

Done: see CHANGELOG.md 0.4.0. The Animal Writes extras live in `sites/animalwrites/sourceweb/` (not in the zip; deploy it with 0.4.0 or the starter list, alert emails, Dashboard box, relay and legal hosts, AWBI issuer, workers links and the CLI migrations are gone from that site).

Not done, still site-shaped, to decide:

- `AW_WORKERS` (`includes/workers/workers-registry.php`) is the Animal Writes workers repository's workflow list, including "Research (India, ...)" and "Finds new Indian animal-welfare papers". The workers repository's test compares it with its `docs/workers.json`, so changing the wording means changing both. It needs to become a filter with an empty default.
- Google News is searched in the India edition (`hl=en-IN&gl=IN`, " India" appended in `keywords-model.php`), and the Workers screen shows schedules in IST. Both should follow a setting or the site's locale and timezone.
- `cc0-images.php` scores photos higher for Indian place names; `library-pdfs.php` and `auto-review.php`'s stop words name Indian government hosts and "india"; `enrichment.php` has AWBI and India Post sources and `aw_awbi_*` fields; `rules-model.php` lists `awbi` and `darpan` in the enrichment trust order; `src/index.js` lists the DirectoryWeb field `animals`. These are Directory-enrichment and Library features written for Indian animal welfare; each needs a filter or to move to the site layer.
- (Done in 0.4.1: the content-type names are no longer in the plugin; see the roles in CHANGELOG.md.)
- The site layer has no test against a running WordPress; its test (`sites/animalwrites/sourceweb/tests/run.php`) only checks the files, the seed and the hooks. Check the alert emails once on the live site after deploying (an ingestion problem, a worker problem, a held-items run).
- The `sourceweb_default_relevance` keyword lists seeded on a new site are now empty; the Animal Writes lists are not carried because that site's option is already stored.

## Verified status, 27 Nov 2026 (this section overrides any 'done' or 'resolved' mark below)

Checked line by line against the code on 27 Nov 2026.

- NOT BUILT, although marked done on 22 Nov: canonical-URL enforcement linking to the original (`attribution.php` has chips, favicons and slugs only); author attribution cards and syndication notices; rate limiting of external fetches (no `wp_safe_remote_get` and no rate code in `ingest.php`). Auto keyword tagging is partial: tags come from the worker, SourceWeb only serves the allowed list.
- DEAD CODE: feed retry backoff (`sourceweb_feed_*_backoff` in `ingest.php`) is called only by tests; the readme no longer promises it (0.2.7).
- The 'Resolved 26 Nov' line for the open-model consent gate contradicts the HOLD section: the code is held and unloaded.
- Partial: summary routes use their own check (`aw_worker` or `manage_options` plus application password), not `sourceweb_ingest_can`; the 'quiet' alert in `relevance.php` has no heartbeat guard; a 'paid' AI tier still exists in the code.
- 0.2.6 (route capability, publishing switch, site-extras switch (removed in 0.4.0), standalone screens, masked keys) has no automated test of its own. 0.3.0 adds `tests/SourceWebStandaloneScreensTest.php`, which covers the nine screens added in 0.3.0 (not the two of 0.2.6).

## Standalone screens, 0.3.0 (27 Nov 2026)

Nine screens that only said "needs Kits Core" are plain WordPress screens now: To review, Enrichment review, Keywords, Rules, Places, Workers, Rejected, Relay log, Change log (`includes/admin/sourceweb-standalone-screens.php`, `sourceweb-standalone-config.php`). Reads are GET, every change is a nonce-checked POST. With Kits Core the shell screens are untouched. What each screen cannot do without Kits Core or another plugin, and is therefore NOT BUILT standalone:

- Workers: attaching AI keys to a worker (done on AI models); the "All workers" union table.
- Enrichment review: needs DirectoryWeb's `aw_listing` content type; without it the screen says so and shows nothing. Not exercised against real proposals in a browser (no listings exist in the Playground blueprint).
- Keywords: Search suggestions and their auto-approve rules need InsightWeb's Search Insights data; the keyword table (roles, categories, spellings, languages) is only edited when InsightWeb has made it, and only add and remove are offered (no edit form for one keyword, no bulk actions, no category mapping). Without InsightWeb the four lists are edited as text; if the site once ran phase 2 the screen warns that InsightWeb rewrites them when switched on again.
- Rules: summary rules, Directory enrichment field rules and trust order, and the review-queue (auto-resolve) rules are not here; they need the phase 3 migration and the Kits shell. The workers use their built-in defaults for them. Section rules show every public content type (`sourceweb_rules_sections( true )`) and list at most 500 tags to tick.
- Places: no "Add place" (places come from content types and the `sourceweb_places` filter), no custom boolean tests (a test of several parts is kept as stored and shown read-only); routes are reordered by an order number, not drag and drop.
- Not done: a "Publish all" is offered for To review but not for Enrichment review (the shell's "approve all high" and per-listing bulk actions are not here); lists have no per-page option; no help tabs on these screens.
- `languages/sourceweb.pot` was not regenerated, so the new strings are not in it yet.
- CI does not run the new test: add `php plugins/sourceweb/tests/SourceWebStandaloneScreensTest.php` next to the existing SourceWeb line in `.github/workflows/ci-suite.yml` and to `tests/standalone-matrix-test.php` (outside this plugin's folder).

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

## Open Tasks & Enhancements (Resolved 26 Nov 2026)

1. **AI Model Router Parity**:
   - ✅ Added owner-consent gate for free/open model routers (`includes/ai/ai-router-consent.php`: `sourceweb_ai_open_models_allowed()`, `sourceweb_ai_filter_router_models()`, `/sourceweb/v1/ai/open-consent`).
   - ✅ Added feed source quality threshold evaluator (`sourceweb_evaluate_source_quality()`, `/sourceweb/v1/sources/evaluate-quality`).

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
- Browser check (26 Nov): Places, Workers, DirectoryWeb (all screens) and RankWeb (FAQ, Internal links, Images, SEO CSV, Redirect tools) opened in the Playground suite; two bugs found and fixed: the alias guard in DirectoryWeb legacy-aliases.php (a fatal when SourceWeb ran without Core) and DirectoryWeb Settings reading SourceWeb as "Not active" (it tested an old constant).
- Not built: anything that acts on a flag (auto-pausing a source); places calling `places/outcome` (no place calls it yet); the standalone edition's renames.

## HOLD: AI open-model consent gate and quality scorer (review of 26 Nov 2026, not released)

Code is on kits-suite (`includes/ai/ai-router-consent.php`, commit 0ba8c39). It is dead code: `sourceweb_ai_filter_router_models()` and `sourceweb_ai_open_models_allowed()` are called nowhere, `ai-keys.php` and `rules/relevance.php` still route to OpenRouter with no consent check, and nothing shows the scorer. Before release: wire the gate; add an admin control to give consent (today only a REST route); migrate sites that already hold an OpenRouter, Requesty or Hugging Face key (consent defaults to false, which would stop their routing); clamp `threshold` to 0-1; name Requesty and Hugging Face in the readme's External services. The plugin-info slug changed from `aw-sourcing` to `sourceweb`: check the update row on existing sites.
