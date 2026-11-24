# Acceptance gates: DirectoryWeb and RankWeb

A product is **complete** only when every box in its section is ticked **with evidence** (command, run URL, or browser
session note). Evidence classes are kept apart: **U** unit/integration (PHP/JS), **H** headless Playground
(`tools/playground/smoke.py`), **B** browser (real admin/front end in Playground), **X** external integration (real
credentials/transport). A ZIP that builds, a plugin that activates, or a green smoke test is not completion.

Last updated: 25 Nov 2026 on `feat/directoryweb-completion`. Branch is not merged; PR #11 is a draft.

## First execution steps (in order)

- [x] 1. DirectoryWeb browser gaps: public claim form POST, mail capture, permissions, invalid transitions, standalone, settings, deactivate/reactivate
- [x] 2. DirectoryWeb: collection-filter block in the Gutenberg editor and on the front end
- [ ] 3. DirectoryWeb docs: audit, update, delete stale; PENDING, matrix, Notion
- [ ] 4. RankWeb standalone core: XML sitemap, canonical, robots (no Rank Math)
- [ ] 5. RankWeb schema: real PHP consumer for `_rankweb_schema_type`; generic post/page schema not tied to `aw_*` types
- [ ] 6. RankWeb coexistence: Rank Math active vs inactive, no duplicate output; remove `animalwrites.in` references
- [ ] 7. RankWeb sidebar and admin screens in the browser; settings persistence; diagnostics
- [ ] 8. RankWeb docs: audit, update, delete stale; PENDING, matrix, Notion
- [ ] 9. Reconcile with latest `kits-suite`, inspect diff, final CI, ZIP verification, review request

## DirectoryWeb

### Claims
- [x] U Native claim lifecycle and state table (`claim-native-tests` 34/34)
- [x] H REST journey: create, list, detail, 409, approve, revoke, anonymous denied (22 checks)
- [x] B Approve and Revoke from the claim edit screen (Playground, 24 Nov)
- [x] B Kits Core shell Claims list and detail open `#claim-dw-<id>` (24 Nov)
- [x] B Public claim form POST in a browser: invalid shows messages and keeps what was typed; valid reaches `dw_claim=sent` (25 Nov, Playground)
- [x] B Reject then Re-open from the claim edit screen; history logged; illegal moves 409 on REST and checked by `dw_claim_can_transition` in the decide handler (25 Nov)
- [ ] U/H Rate limits and per-email caps exercised over HTTP
- [x] H Subscriber, editor and anonymous get 401/403 on claim list and transition (journey, 28 checks). Browser role switching not possible: Playground treats every request as admin
- [x] B/U Claim emails captured via `pre_wp_mail`: received (claimant), new claim with working review link (owner), decision (claimant); none on re-open (25 Nov)
- [ ] X Claim email delivery through a real transport (classify: not testable in Playground unless an SMTP sink is reachable)
- [ ] U/H Fluent Forms claim decisions: state table enforced on the Fluent Forms path (needs Fluent Forms; classify X if not installed)
- [x] B Claim list columns, button labels (Approve, Reject, Re-open, Revoke) and state shown after each decision

### Blocks and front end
- [x] B `directoryweb/collection-filter` inserts, renders the real filter in the editor and saves (25 Nov)
- [x] B Renders on the front end; submitting its GET form returns the matching listing from `/directory/` (25 Nov)
- [x] B `/directory/`, `/claim/`, `/claim/?listing=`, block page: 200, no PHP notices (25 Nov). Find-help not separately visited

### Settings, diagnostics, lifecycle
- [x] B Standalone settings save (claim emails, notify address) and persist across reload and deactivate/reactivate. With Kits Core: shell Settings not re-tested this round
- [ ] B Diagnostics/status shows real state (claim mail on/off, forms, counts)
- [x] B Deactivate then reactivate: claim, settings, `/claim/` page and block page intact (25 Nov)
- [ ] B Admin navigation and onboarding without Kits Core (standalone) free of dead links
- [x] B No DirectoryWeb console errors; remaining errors are Playground environment (blocked external loads, heartbeat)

### Gate
- [ ] U Full suites pass on PHP 8.0, 8.1, 8.2, 8.3
- [ ] H All blueprints pass; DirectoryWeb journey extended
- [ ] Distribution ZIP extracted, activated standalone, no monorepo reference
- [ ] CI green on the final commit
- [ ] Docs updated; stale docs removed; `docs/pending.md`, `plugins/directoryweb/PENDING.md`, master matrix and Notion current

## RankWeb

### Standalone output (no Rank Math, no Kits Core)
- [ ] U/B XML sitemap index and per-type sitemaps (posts, pages, public CPTs, taxonomies), `lastmod`, `noindex` exclusion, robots.txt `Sitemap:` line
- [ ] U/B Canonical URL on singular, archives, paginated and search views
- [ ] U/B Meta robots (noindex/nofollow, archives, search, 404) and robots.txt rules
- [ ] U/B Title and meta description templates
- [ ] U/B Open Graph / Twitter tags
- [ ] U/B JSON-LD for generic `post`/`page` (Article, WebPage, BreadcrumbList, Organization/WebSite)
- [ ] U `_rankweb_schema_type` read by PHP and changes the JSON-LD `@type` (Article / NewsArticle / BlogPosting); selector only offers types PHP can emit
- [ ] U Schema for `aw_*` types stays as it is and is not required for generic content

### Coexistence
- [ ] B With Rank Math active: RankWeb adds nothing Rank Math already prints (title, description, canonical, robots, OG, JSON-LD, sitemap)
- [ ] B With Rank Math inactive: RankWeb prints each tag exactly once
- [ ] U Tag-level duplicate detector (counts `<title>`, canonical, robots, description, OG, JSON-LD) used in both modes
- [ ] Other SEO plugin detected (Yoast, SEOPress, AIOSEO): RankWeb stays quiet or warns

### Editor and admin
- [ ] B Gutenberg sidebar opens, keyword field, score, SERP preview, schema type persist on save
- [ ] B No JavaScript errors in the editor
- [ ] B All RankWeb admin screens load (Overview, Insights, Modules, FAQ, Settings, CSV, Images, Redirects, Internal links)
- [ ] B Settings persist; modules on/off take effect
- [ ] B Diagnostics page reports real sitemap/robots/canonical status

### Independence and hard-coded references
- [ ] U No `animalwrites.in` or other site-specific host in shipped code, except explicit, documented `aw_*` compatibility
- [ ] H/B Activates and works with neither Rank Math nor Kits Core nor DirectoryWeb
- [ ] B Deactivate then reactivate: settings and post meta intact

### Gate
- [ ] U Full suites pass on PHP 8.0, 8.1, 8.2, 8.3 (`phpunit-lite`, `run.php`, `sidebar-score.test.js`, new tests)
- [ ] H All blueprints pass; RankWeb checks extended (sitemap, canonical, robots, schema)
- [ ] Distribution ZIP verified
- [ ] CI green on the final commit
- [ ] Docs updated; stale docs removed; `docs/pending.md`, `plugins/rankweb/PENDING.md`, master matrix and Notion current

## Integration gate (after both products)

- [ ] Reconcile branch with latest `kits-suite` (no overwritten work from other agents)
- [ ] Full diff reviewed; no secrets or generated files
- [ ] Kits Core + theme + DirectoryWeb + RankWeb coexistence in Playground (`suite.json`), browser-checked
- [ ] CI green on the final branch state
- [ ] Review requested; merge only after approval
