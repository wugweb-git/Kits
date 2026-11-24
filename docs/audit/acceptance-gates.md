# Acceptance gates: DirectoryWeb and RankWeb

A product is **complete** only when every box in its section is ticked **with evidence** (command, run URL, or browser
session note). Evidence classes are kept apart: **U** unit/integration (PHP/JS), **H** headless Playground
(`tools/playground/smoke.py`), **B** browser (real admin/front end in Playground), **X** external integration (real
credentials/transport). A ZIP that builds, a plugin that activates, or a green smoke test is not completion.

`[x]` done with evidence, `[~]` partly, `[ ]` not done.

Last updated: 25 Nov 2026 on `feat/directoryweb-completion`. Branch is not merged; PR #11 is a draft.

## First execution steps (in order)

- [x] 1. DirectoryWeb browser gaps: public claim form POST, mail capture, permissions, invalid transitions, standalone, settings, deactivate/reactivate
- [x] 2. DirectoryWeb: collection-filter block in the Gutenberg editor and on the front end
- [ ] 3. DirectoryWeb docs: audit, update, delete stale; PENDING, matrix, Notion
- [x] 4. RankWeb standalone core: sitemap, robots (canonical on singular and listings)
- [x] 5. RankWeb schema: real PHP consumer for `_rankweb_schema_type`; generic post/page schema not tied to `aw_*` types
- [x] 6. RankWeb coexistence (stub and real Rank Math) and AW references removed from generic output
- [x] 7. RankWeb sidebar and admin screens in the browser; settings persistence; diagnostics
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
- [x] U Full suites pass on PHP 8.0, 8.1, 8.2, 8.3 (CI run 45478006598, PHP 8.0-8.3 jobs, dcfa016)
- [x] H All blueprints pass; DirectoryWeb journey extended (8 blueprints against extracted ZIPs, local run on dcfa016; DirectoryWeb 28 checks)
- [x] Distribution ZIP extracted, activated standalone, no monorepo reference (smoke mounts only the extracted ZIP; standalone matrix 6/6; dcfa016)
- [ ] CI green on the final commit
- [ ] Docs updated; stale docs removed; `docs/pending.md`, `plugins/directoryweb/PENDING.md`, master matrix and Notion current

## RankWeb

### Standalone output (no Rank Math, no Kits Core)
- [x] U/B XML sitemap standalone = WordPress's own (`/wp-sitemap.xml`, `lastmod`, types and taxonomies); noindex pages excluded (B: a noindex post disappeared from `wp-sitemap-posts-post-1.xml`); robots.txt carries the `Sitemap:` line and no longer advertises an empty News sitemap (25 Nov)
- [x] U/B Canonical URL: singular once per page (core `rel_canonical`); home, archives and paginated pages print one self-referencing canonical from RankWeb (journey, B); search results and 404 print none (25 Nov)
- [x] U/B Meta robots: per-post noindex through core `wp_robots` (one tag, B) and search results noindex. Archives/404 rules beyond core: open
- [x] U/B Title from WordPress core (one `<title>`, B); meta description: own field, then excerpt, then content; tagline never copied into posts (B, U)
- [x] U/B Open Graph and Twitter tags once each (B, H)
- [x] U/B JSON-LD: Organization, WebSite, Article/BlogPosting node for posts, WebPage + BreadcrumbList for pages (B, H)
- [x] U/B/H `_rankweb_schema_type` read by PHP; BlogPosting chosen in the sidebar reached the JSON-LD; selector offers only Article, BlogPosting, NewsArticle, WebPage; `Event` is ignored (StandaloneSeoTest, journey)
- [x] U Schema for `aw_*` types unchanged (`phpunit-lite` 133 tests, `run.php` 94); generic content has its own path

### Coexistence
- [x] B Real Rank Math 1.0.282 (WP 7.1, PHP 8.2, Playground) with RankWeb active: title, description, canonical, robots, og:title, twitter:card and JSON-LD each exactly once, all printed by Rank Math (comment markers, `rank-math-schema` class); RankWeb prints none. Rank Math's front end only runs once registration is skipped or connected (`rank_math_registration_skip`), the state after the wizard's Skip. Stub also passes (25 Nov)
- [x] B Real Yoast SEO with RankWeb active: each head tag once, Yoast's schema graph the only JSON-LD (25 Nov)
- [ ] X SEOPress and AIOSEO: detection by constant only; SEOPress front end not confirmed in Playground, AIOSEO untested. Compatibility documented as unverified
- [x] B With Rank Math inactive: title, description, canonical, robots, og:title, twitter:card, JSON-LD all exactly 1 (25 Nov)
- [x] B Tag-level counter (`__count`) used in both modes in the browser; the same counts asserted in the headless journey (H)
- [~] U Detected by constant; RankWeb leaves the head and shows a notice and an Overview line. **Real Yoast/SEOPress/AIOSEO not installed: X open**

### Editor and admin
- [x] B Gutenberg sidebar opens from the pinned button, score 15/100 on short content, description, noindex and schema type persist on save and change the front end (25 Nov)
- [x] B No RankWeb console errors in the editor (remaining console errors are Playground environment)
- [x] B All nine screens load without PHP errors; the five that said "needs Kits Core" now render natively. Redirects needs Rank Math Redirections (open)
- [x] B/H Settings save and persist across reload and deactivate/reactivate; module switch saved (18 to 17) and `aw_seo_files_off()` includes the module (H)
- [x] B Overview lists real state: head owner, search visibility, permalinks, sitemap URL, robots.txt, noindex count. Canonical status not listed

### Independence and hard-coded references
- [x] U/H No Animal Writes value in a generic site's head or graph (H probe); values moved to `animal-writes-compat.php`. Remaining AW copy only runs with AW hubs (listed in PENDING)
- [x] H/B Journey activates with none of them and passes 24 checks; browser admin and front end verified
- [x] B Settings intact; tags absent while deactivated, back after (25 Nov)

### Gate
- [x] U Full suites pass on PHP 8.0, 8.1, 8.2, 8.3 (`phpunit-lite`, `run.php`, `sidebar-score.test.js`, new tests) (CI run 45478006598, PHP 8.0-8.3 jobs, dcfa016)
- [x] H All blueprints pass; RankWeb checks extended (sitemap, canonical, robots, schema) (RankWeb journey 26 checks against the extracted ZIP, dcfa016)
- [x] Distribution ZIP verified (checksums OK for all 8 ZIPs; verify-dist passes; dcfa016)
- [ ] CI green on the final commit
- [ ] Docs updated; stale docs removed; `docs/pending.md`, `plugins/rankweb/PENDING.md`, master matrix and Notion current

## Integration gate (after both products)

- [ ] Reconcile branch with latest `kits-suite` (no overwritten work from other agents)
- [ ] Full diff reviewed; no secrets or generated files
- [ ] Kits Core + theme + DirectoryWeb + RankWeb coexistence in Playground (`suite.json`), browser-checked
- [ ] CI green on the final branch state
- [ ] Review requested; merge only after approval

### Classified, not built (25 Nov)
- [ ] DirectoryWeb CRM events: deferred (no hook in code; waits on the shared connector decision)
- [ ] DirectoryWeb default preset: deferred (no preset object; waits on Kits Core preset format)
- [ ] DirectoryWeb claim proof upload: deferred (needs validation, private storage and a security review)
