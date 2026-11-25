# Kits master audit matrix (24 Nov 2026)

**Status (25 Nov 2026):** DirectoryWeb and RankWeb rows are current for `feat/directoryweb-completion`; MailWeb, PlanWeb, SourceWeb and InsightWeb rows are report only.

Source of truth for both agents. Evidence is from reading code and running the listed commands on `kits-suite` @ `675e96a`
(plus the DirectoryWeb branch `feat/directoryweb-completion`). Nothing here was exercised in a browser or with live credentials
unless a row says so. "Passes its tests" is not "functionally verified": the Status column says which one it is.

Statuses: **Verified complete** · **Implemented, not functionally verified** · **Partially implemented** · **Not implemented** · **Blocked** · **Superseded**.
Owners: **CC** = Claude Code, **AG** = Antigravity (reports only; not edited by CC).

## Baseline (do not redo)

| Area | Requirement | Status | Evidence |
|---|---|---|---|
| Infra | CI green, 8 ZIPs, checksums, manifest, prerelease | Verified complete | Run 45437456610 (14/14); release `kits-suite-2026.11.24-pre.1`; ZIPs re-checked locally |
| Infra | Headless Playground smoke per blueprint (WP 7.1 / PHP 8.2) | Verified complete | `tools/playground/smoke.py`; this is a smoke test, not acceptance |
| Infra | Browser Playground can load release assets (CORS) | Implemented, not functionally verified | Only `directoryweb.zip` returned HTTP 200; CORS header not seen; others untested |

## Per product

### DirectoryWeb (CC, priority 1)

| Requirement | Status | Evidence | Missing work | Pri | Acceptance |
|---|---|---|---|---|---|
| Listing type, facets, filter engine, find-help, local cards | Implemented, not functionally verified | `directory.php`, `find-help.php`; suites `directoryweb-tests` (44), `listing-meta-tests` (2), `org-people-tests` (16) pass | Browser/E2E of facet UI | P2 | Playground journey: filter by state/type, URL state persists |
| Collection/filter block | Implemented, not functionally verified | `directoryweb-collection-filter.php`; `collection-filter-tests` 8/8; Playground renders the block (21/21 smoke) | Editor UI check in a browser; block patterns using it | P1 | Block insertable and saved in editor; renders filtered results |
| Native claim submit (no Fluent Forms) | Implemented, not functionally verified | `claim-native.php`; Playground creates a claim via `dw_claim_create` and renders the form | Real form POST through `admin-post.php` (nonce, honeypot, rate limit) not exercised end-to-end; evidence upload built (see rows below) | P1 | HTTP POST journey in Playground |
| Claim limits over HTTP | **Headless-verified (extracted ZIP)** | 17 HTTP checks: per-email cap 3, per-IP 5/hour, honeypot, nonce, spoofed headers; plus-address variants are a known limitation; anonymous vs logged-in path not distinguishable in Playground (X) |
| Claim diagnostics and admin navigation | **Headless-verified; shell row browser-unverified** | Live-state card on standalone Settings and a Claims row in the Kits shell payload; menu/link audit clean standalone and with Kits Core; Claims menu entry and Places dead links fixed |
| Claim state machine and transitions | Verified complete (REST + core) | `claim-native-tests` 35/35; Playground: 409 on illegal move, approve applies area and verifies, revoke unverifies, anonymous denied | Withdraw UI for claimant; re-open from admin screen | P1 | Done for REST; UI pending |
| Claims list/detail show native claims | **Browser-verified** (24 Nov, Playground full suite) | Kits Core shell Claims screen lists native claim `DW-5` ("Waiting 1"); View opens detail (`#claim-dw-5`). Fixed in this pass: shell hash route and `open > 0` check ignored `dw-<id>`; row `entry` collided with form-entry ids | Shell stays read-only by owner decision (11 Nov); decisions are made on the claim's edit screen | P1 | Done |
| Decide native claims in admin (standalone) | **Browser-verified** | Claim edit screen metabox: Approve applied phone/website/area to listing; Revoke approval set state Revoked; list columns show state and changed fields. Fixed: legacy "Review" box garbled native claims; `kits_ff_phone_store` undefined standalone caused a fatal after approval (`claims-review.php` now uses `directoryweb_ff_*` wrappers) | Success notice after decide; shell "Claims" screen itself needs Kits Core with build (standalone shows "needs Kits Core") | P2 | Standalone Claims screen without Core |
| Fluent Forms review path uses the state table | Partially implemented | `claims-review.php` decide handler now asks `dw_claim_can_transition` (409 on illegal move); behaviour unchanged (form claims still only leave `pending`); no state-change hooks fired because form-entry ids collide with post ids | Revoke/re-open for form claims; unified id space | P2 | Same 409 on both paths: done; revoke for form claims: pending |
| Claim emails (claimant/reviewer) | Implemented, not functionally verified | `claim-native.php` sends via `wp_mail` (MailWeb/SMTP plugins carry it; no dependency) on create (claimant + site owner) and on approve/reject/revoke; gated by existing `aw_ff_send_email`; unit tests 5/5; not sent in a real mail transport | Delivery test with MailWeb; templates/translation | P1 | Mail observed with a real transport |
| Admin UI, settings, onboarding | Partially implemented | Dashboard/Claims/Settings built (`directoryweb-ui.php`); onboarding not found | Audit with a browser; onboarding flow | P2 | Walkthrough passes in Playground |
| Standalone without SCF/Kits Core | Implemented, not functionally verified | `directoryweb-standalone-test` 16, `directoryweb-scf-fallback-test` 10; real-WP activation | Field editing without SCF | P2 | Listing editable standalone |
| Security | Partially implemented | Nonce enforced on REST; capability `manage_directoryweb`; claim abuse limits | Nonce-less admin-post path review; security review of the evidence store | P1 | Security checklist |
| Claim review without Kits Core or Animal Writes (F5) | Verified (U, P) | `claim-review-standalone-tests` 12; real Fluent Forms 6.2.17, `http-fluentforms-claim.py` 22 | Fluent Forms Pro uploader (X) | P1 | Pro upload test |
| Protected listing fields and REST redaction (F6) | Verified (U, P) | `meta-authorization-tests` 64; journeys F6/F6b as anonymous, contributor, manager | Revisions/autosave hiding implemented, untested | P1 | Add revision/autosave probe |
| Claim evidence store | Verified (U, P); web-server rules untested (X) | `claim-evidence-tests` 15; `http-claim-evidence.py` 22; encrypted at rest, served only by `manage_directoryweb` with nonce | Apache/nginx deny rules; provider originals stay plaintext | P1 | Deploy-time check |

### RankWeb (CC, priority 2) — updated 25 Nov 2026

| Requirement | Status | Evidence | Missing work | Pri | Acceptance |
|---|---|---|---|---|---|
| Standalone page head: description, Open Graph, Twitter, noindex | **Browser-verified** | `includes/standalone-seo.php`; `StandaloneSeoTest` (8); journey 24 checks; one of each tag with no SEO plugin | Archives/paginated canonical; robots rules beyond search | P2 | Done for posts/pages |
| Sidebar controls reach the output | **Browser-verified** | Description, noindex and schema type set in Gutenberg, saved, then seen in the front-end head, JSON-LD and sitemap | Score is a heuristic (unit-tested only) | P1 | Done |
| `_rankweb_schema_type` consumer | **Verified complete** | `rankweb_post_schema_type`, `rankweb_apply_schema_type`; selector limited to Article, BlogPosting, NewsArticle, WebPage; BlogPosting reached JSON-LD (B, H, U) | Event/FAQPage/Organization types are not offered (not built) | P1 | Done |
| Generic post/page schema not tied to `aw_*` | Verified complete | `rankweb_generic_schema_nodes` (WebPage + BreadcrumbList); the `aw_*` builders are unchanged (133 + 94 tests) | | P1 | Done |
| XML sitemap standalone | Verified complete (WordPress core's) | `/wp-sitemap.xml`; noindex pages excluded (B); robots.txt `Sitemap:` line; empty News sitemap no longer advertised | Native sitemap with images/video: not built | P1 | Done |
| Rank Math coexistence | **Browser/headless-verified (real plugin)** | Real Rank Math 1.0.282 + RankWeb: each head tag once, all Rank Math's. Needs registration skipped. Real Yoast also verified (B). SEOPress/AIOSEO unverified (X) |
| Admin without Kits Core | **Browser-verified** | Overview, Modules, Settings (all tabs), FAQ, Insights render natively; settings save, persist and survive deactivate/reactivate; module switch saved (`rankweb-native-admin.php`) | Redirects needs Rank Math Redirections; native redirect list not built | P1 | Redirects standalone |
| Diagnostics | Browser-verified | Overview: head owner, search visibility, permalinks, sitemap, robots.txt, noindex count | Canonical and last-cron status | P3 | |
| Hard-coded Animal Writes values | Mostly removed | Generic site graph/head has none (H probe); values live in `animal-writes-compat.php` | AW copy in `titles.php`/`programmatic.php`/hub titles/FAQ wording (only with AW hubs) | P2 | grep clean outside compat |
| Ranking/score logic | Superseded / undefined | No "function + existence + consumption" formula in repo or docs; only the sidebar score and InsightWeb's keyword score | Owner's definition required; **not invented** | Blocked | Written definition |
| Cron (health, sitemap, fill, link audit, video) | Implemented, not functionally verified | 8 WP-cron events | Admin status for last run/failure | P3 | Status visible |

### MailWeb (CC, priority 4)

| Requirement | Status | Evidence | Missing work | Pri | Acceptance |
|---|---|---|---|---|---|
| Hostinger API + SMTP transport, queue, retry (15 min/1 h/6 h), daily cap | Implemented, not functionally verified | `providers.php`, `mail-cap.php::mailweb_flush`; `tests/run.php` passes | No tests for API, flush/retry, inbox; needs credentials | P2 | Mocked-transport tests; live test classified credential-dependent |
| Multi-tenant sender profiles, per-tenant rate limit | Not implemented | `PENDING.md` | Design | P3 | Per-tenant caps enforced |
| DNS check cron | Implemented, not functionally verified | Scheduled at `smtp.php:271`; handler not located | Find/verify handler | P2 | Handler runs |
| SDK on PHP < 8.2 | Verified complete (by design) | REST transport used below 8.2 | Document | P3 | n/a |
| Standalone | Implemented, not functionally verified | `MAILWEB_STANDALONE`; Playground activates with SDK loaded | Shell UI absent standalone (list-table pages remain) | P2 | Journey in Playground |

### PlanWeb (CC, priority 4)

| Requirement | Status | Evidence | Missing work | Pri | Acceptance |
|---|---|---|---|---|---|
| Entries CPT, month calendar, ICS feed, import | Implemented, not functionally verified | `store.php`, `admin.php`, `feed.php`; `tests/run.php` 123 checks | Browser verification | P3 | Journey in Playground |
| Weekly view, drag/drop reschedule, campaign timeline, filters | Not implemented | `PENDING.md`; grep finds no AJAX/draggable | Build | P3 | Per `PENDING.md` |
| Overdue sweep, reminders, repeats, digest (Action Scheduler) | Not implemented | Only `planweb_counts_build` cron exists | Decide: needs real scheduled jobs; design before build | P3 | Jobs idempotent with admin status |
| Standalone | Partially implemented | Header "Needs Kits Core"; Dashboard/Entries/Settings show "needs Kits Core" without it | Native fallbacks for those screens | P2 | All screens work without Core |

### SourceWeb (AG, report only)

| Requirement | Status | Evidence | Notes |
|---|---|---|---|
| Ingest/relay/review routes, watchdogs, retry backoff | Implemented, not functionally verified | ~36 `aw/v1` routes; `aw_worker_retry_backoff`; `tests/run.php` OK 455 (PENDING says 480); standalone test 7 | Workers dispatch needs `kits_dispatch_workflow` (Core): hard Core dependency for dispatch |
| Readme vs code | Partially implemented | Readme says it needs Core, DirectoryWeb, InsightWeb; code does not enforce | AG to reconcile |
| Workers overlap | Verified (documented) | `animal-writes-workers` feeds it (ingest, relay, relevance, summaries); site registry may have drifted (`plugins/aw-sourcing/includes/workers.php` vs `workers-registry.php`) | Parity check before any change |

### InsightWeb (AG, report only)

| Requirement | Status | Evidence | Notes |
|---|---|---|---|
| Dashboard tiles show empty state, not mock data | Implemented, not functionally verified | `insightweb-dashboard.php:107`; Playground empty dashboard passes | Static seeded links in `data/links-2026-11-02.php`: confirm not shown as live |
| Daily/rollup cron, URL-inspection queue | Implemented, not functionally verified | `aw_si_daily` 07:10, `aw_si_rollup_cron` 23:30 | No queue-based retry verified |
| OAuth wizard | Not implemented | Uses Site Kit + API keys | AG |
| Tests | Implemented | `run.php` 109 ok, standalone 14 (PENDING claims 150) | Stale claim |
| Keyword score formula | Documented only | `docs/plugins/insightweb-plan.md:245`; `score.php` existence unchecked | AG |

### Kits Core, shared packages, theme

| Requirement | Status | Evidence | Notes |
|---|---|---|---|
| Kits Core (admin shell, customizer, onboarding, etc.) | Partially implemented | `PENDING.md` still lists core features open; roadmap says "Hardened" (contradiction); 11 test files vs "5" in roadmap | Reconcile docs |
| Shared connectors/auth layer | Not implemented | None in Core: each plugin owns credentials | Decide whether one is wanted |
| `packages/shared-php` | Implemented, unused | Nothing consumes it; roadmap §7.3 vs release doc contradict | Keep unbundled |
| Theme | AG | Loose `Kits-theme-worktree` dir (no git); header.html differs only in formatting | Do not copy over |

## Workers and automation matrix

| Workflow | Where it runs | Mechanism | Retry/idempotency | Owner | Decision |
|---|---|---|---|---|---|
| News/library sourcing, relay, summaries, relevance | `animal-writes-workers` (GitHub Actions, Python) → SourceWeb REST | cron 6 h etc. | worker skips rejected keys; `/exists` dedupe | AG (SourceWeb) | **Do not migrate or duplicate.** Parity plan before change |
| Search insights (rising terms, crawl-check) | same repo → InsightWeb REST | daily/weekly/monthly | run record per source | AG | same |
| SEO focus/scores | same repo → `aw/v1/seo-focus`, `seo-items` (Rank Math related) | daily | unverified | CC (RankWeb) | Verify consumer before touching RankWeb routes |
| Directory enrichment, Darpan import | same repo → DirectoryWeb data | after seo-scores | unverified | CC | Keep |
| MailWeb queue flush, CRM sync, DNS check | WP-cron | 5 min/daily | status+lock, 4 tries | CC | Exists; add tests |
| RankWeb health/sitemap/fill/link audit/video | WP-cron | hourly/daily | sliced single events | CC | Exists; add status |
| PlanWeb overdue/reminders/repeats/digest | none yet | would need Action Scheduler | n/a | CC | Not built; design first |
| DirectoryWeb claims | none needed | request-driven | state machine, 409 on repeat | CC | No worker needed |

## Acceptance and QA matrix (Playground)

| # | Check | DirectoryWeb | RankWeb | MailWeb | PlanWeb | SourceWeb | InsightWeb |
|---|---|---|---|---|---|---|---|
| 1 | Installs and activates standalone | Smoke ✔ | Smoke ✔ | Smoke ✔ | Smoke ✔ | Smoke ✔ | Smoke ✔ |
| 2 | No mandatory sibling | ✔ (matrix test) | ✔ | ✔ | ✔ | ✔ | ✔ |
| 3 Theme + plugin coexistence | `suite.json` smoke ✔ | | | | | | |
| 4 Frontend blocks render | ✔ collection-filter (this branch) | breadcrumbs ✗ | – | – | – | – |
| 5 Admin screens load | ✗ not automated | ✗ | ✗ | ✗ | ✗ | ✗ |
| 6 Settings persist | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| 7 Connectors | credential-dependent | n/a | credential-dependent | n/a | credential-dependent | credential-dependent |
| 8 End-to-end journey | ✔ claim journey via REST (21/21 checks) | ✗ | ✗ | ✗ | ✗ | ✗ |
| 9 Background jobs | n/a | ✗ | ✗ | – | ✗ | ✗ |
| 10 Permissions | ✔ anonymous denied | ✗ | ✗ | ✗ | ✗ | ✗ |
| 11 Error/recovery | ✔ invalid claim, 409 | ✗ | ✗ | ✗ | ✗ | ✗ |
| 12 Deactivate/reactivate keeps data | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

Credential-dependent and therefore untestable here: MailWeb Hostinger token and SMTP; InsightWeb Site Kit / Search Console / GA4 / Clarity / Bing keys; SourceWeb worker ingest and AI keys; browser Playground CORS needs a browser run.

## Contradictions found in docs (to correct)

1. Roadmap §7.3 treats `shared-php` as shared infra; release doc says nothing consumes it.
2. Roadmap says Kits Core "Hardened" and 5 suites; Core `PENDING.md` lists core features open; 11 test files exist.
3. SourceWeb and InsightWeb readmes claim hard dependencies the code no longer enforces.
4. SourceWeb PENDING says 480 checks (actual 455); InsightWeb PENDING says 150 (actual 109 + 14).
5. `docs/pending.md` links `docs/animalwrites-monorepo-migration-inventory.md`; the file is under `docs/architecture/`.
6. Roadmap lists 2 theme style variations; theme has 3 (`dark` added).

## Execution schedule

1. **CC, now**: DirectoryWeb: claim screen actions, claim emails, Fluent Forms path onto the state table, HTTP form journey, browser check.
2. **CC**: RankWeb: fix the sidebar `sprintf` defect and wire schema type; standalone sitemap; coexistence tests.
3. **AG**: SourceWeb, InsightWeb, theme on their own branches. CC reviews diffs before any merge to `kits-suite`.
4. **CC**: MailWeb tests, PlanWeb standalone screens; PlanWeb jobs only after a written design.
5. **Release readiness**: all journeys above ✔ or explicitly classified credential-dependent; docs contradictions fixed; CI green; no new release without approval.

## Open decisions for the owner

- The "function + existence + consumption" ranking definition (not in the repo).
- Whether a shared connector/auth layer is wanted, or each plugin keeps its own credentials.
- PlanWeb scheduled jobs: Action Scheduler (new dependency) versus WP-cron.
