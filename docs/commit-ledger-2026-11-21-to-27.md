# Commit ledger, 21 Nov to 27 Nov 2026

Generated from `git log origin/kits-suite --since=2026-11-21 --no-merges` on 27 Nov 2026: 293 non-merge commits, plus 37 merge commits (not listed). Columns are mechanical: area is taken from the paths each commit touched, kind from the subject line.

**This is a list, not a review.** No verdict is recorded per commit. What was actually reviewed, and the findings, are in `mistakes-audit-2026-11-21-to-26.md` and `standalone-audit-2026-11-26.md`. Commits by area (a commit can touch several areas): rankweb 88, docs 85, sourceweb 62, directoryweb 60, kits-core 40, insightweb 38, mailweb 37, tools 35, planweb 24, other 22, ci 22, theme 19, sites 5, contentweb 1.

Not covered anywhere: line-by-line review of each commit's diff, the 26 PRs individually, whether the cancelled CI runs hid failures, the largest deleted docs (searched, not read), and live-site behaviour.

| Commit | When (IST) | Author | Kind | Area | Files | Subject |
|---|---|---|---|---|---|---|
| `2ed264f` | 11-21 20:08 | Wugweb | feature | directoryweb,insightweb,kits-core,mailweb,other,planweb,rankweb,sourceweb,theme | 840 | feat(kits-suite): add Kits WordPress theme and companion plugins suite |
| `603ce74` | 11-21 23:55 | Wugweb | fix | kits-core | 2 | fix(kits-core): add sanitization and escaping annotations in Brand Customizer |
| `648842e` | 11-22 01:22 | Wugweb | fix | kits-core | 2 | fix(kits-core): add translators comment and direct access guard for Plugin Check |
| `c7fcd0c` | 11-22 01:50 | Wugweb | feature | mailweb | 4 | feat(mailweb): integrate Hostinger Mail API SDK, SMTP overrides and DKIM card |
| `f55527d` | 11-22 01:55 | Wugweb | feature | mailweb | 1 | feat(mailweb): add Hostinger server connectivity protocols (IMAP 993, SMTP 465, POP3 995) |
| `460b2b6` | 11-22 02:56 | Wugweb | other | docs,other,tools | 48 | chore(monorepo): scaffold canonical Wugweb monorepo directories and delivery architecture |
| `292d4ae` | 11-22 03:09 | Wugweb | docs | docs | 1 | docs: add tenant pattern discovery and upstream contribution pipeline |
| `4ce85d5` | 11-22 03:10 | Wugweb | docs | docs | 1 | docs: add FSE interaction model, Theme Hub and Day/Night architecture |
| `4670973` | 11-22 03:13 | Wugweb | docs | docs | 1 | docs: add consolidated technical audit, security safeguards and contradiction resolutions |
| `3ec7cae` | 11-22 03:16 | Wugweb | docs | docs | 1 | docs: add comprehensive master architectural synthesis |
| `01dec66` | 11-22 03:22 | Wugweb | docs | docs | 1 | docs: expand master synthesis with external services registry, capabilities matrix and 5-tier governance |
| `63513ca` | 11-22 03:25 | Wugweb | docs | docs | 1 | docs: add 4-layer theme.json cascade and 7-layer automation stack to master synthesis |
| `1757943` | 11-22 03:27 | Wugweb | docs | docs | 1 | docs: import and track Wugweb modular master blueprint and audit |
| `3fea7c7` | 11-22 03:37 | Wugweb | feature | directoryweb,insightweb,kits-core,mailweb,other,planweb,rankweb,sourceweb,tools | 27 | build: add packaging pipeline, pack.sh, and track plugin compiled build bundles |
| `03e6f32` | 11-22 03:40 | Wugweb | docs | docs,tools | 2 | docs: mirror Animal Writes monorepo migration inventory and tenant decoupling |
| `45d5afc` | 11-22 03:48 | Wugweb | docs | directoryweb,insightweb,kits-core,mailweb,planweb,rankweb,sourceweb,theme | 8 | docs: add component-level pending roadmaps to theme and 7 companion plugins |
| `1d8305d` | 11-22 03:51 | Wugweb | docs | docs | 1 | docs: clarify that animal-writes-core was fully retired on 19 Nov (commit 69832857) |
| `e8dadc7` | 11-22 04:09 | Wugweb | docs | docs | 6 | docs: import standalone WordPress.org plugin edition plans from org-editions |
| `f96e0ea` | 11-22 04:11 | Wugweb | docs | docs | 1 | docs: clarify that kits-core succeeded animal-writes-core with zero custom tenant plugins |
| `ebc5005` | 11-22 04:19 | Wugweb | docs | docs | 5 | docs: import Minimal UI, theme admin UI, and plugin admin UI specifications |
| `238fe14` | 11-22 04:58 | Wugweb | other | theme | 161 | refactor(theme): neutralize kits-by-wugweb in central monorepo |
| `ba0aad0` | 11-22 05:13 | Wugweb | feature | directoryweb,mailweb,planweb,sourceweb | 7 | feat(plugins): add consumption bridges for BDP, FluentSMTP, and The Events Calendar |
| `b806a94` | 11-22 05:25 | Wugweb | docs | directoryweb,mailweb | 2 | docs: accurately record BDP and FluentSMTP status and open tasks in plugin PENDING.md |
| `ce7cda3` | 11-22 05:28 | Wugweb | revert | directoryweb,mailweb,planweb,sourceweb | 9 | revert: undo all plugin compatibility changes; restore clean suite |
| `bb52473` | 11-22 05:47 | Wugweb | feature | mailweb,other,tools | 14 | feat(sdk): build Wugweb Kits PHP SDK in packages/shared-php and wire Hostinger Mail API SDK |
| `23c355c` | 11-22 06:05 | Wugweb | other | directoryweb,rankweb | 6 | DirectoryWeb & RankWeb: align claim UI and schema with directory standards |
| `7adced9` | 11-22 20:36 | Wugweb | feature | directoryweb | 6 | feat(directoryweb): add local-card and helplines blocks, facet transient caching |
| `4172a3b` | 11-22 20:49 | Wugweb | fix | directoryweb | 1 | fix(directoryweb): add translators comment for state name i18n in local-card block |
| `378a640` | 11-22 21:07 | Wugweb | docs | docs | 6 | docs(org): synchronize and validate implementation statuses across Kits plugin plans |
| `a6d8f0d` | 11-22 23:51 | Wugweb | feature | directoryweb,insightweb,mailweb,sourceweb | 8 | feat(plugins): register find-help and listing-finder blocks; wire daily DNS telemetry; update roadmaps |
| `694e703` | 11-23 00:05 | Wugweb | docs | docs | 1 | docs: sync pending.md with animalwrites monorepo |
| `45b910a` | 11-23 00:09 | Wugweb | feature | directoryweb,rankweb | 5 | feat(plugins): transfer missing directoryweb blocks and sync rankweb roadmap |
| `6ee0200` | 11-23 00:17 | Wugweb | docs | docs | 6 | docs: copy universal blocks, design system, and multi-tenant specs to platform docs |
| `f8ff4ed` | 11-23 00:53 | Wugweb | feature | ci,directoryweb,docs,kits-core,mailweb,other,rankweb | 9 | feat(plugins): retire old mail-in route, add tel crawler 301s, and harden test runners |
| `d6443ff` | 11-23 01:00 | Wugweb | docs | docs | 2 | docs(roadmap): add consolidated master architecture and implementation roadmap |
| `2243d7a` | 11-23 01:04 | Wugweb | fix | mailweb | 1 | fix(mailweb): restore backward-compatible mail-in webhook alias |
| `9fcdfe8` | 11-23 01:17 | Wugweb | docs | docs | 1 | docs: sync pending roadmap with C1 and C3 completions |
| `92345bc` | 11-23 01:50 | Wugweb | other | theme | 2 | style(cards,spacing): sync kit card zero container padding, independent padding, and section collapse |
| `6a32c29` | 11-23 22:09 | Wugweb | feature | directoryweb,docs,insightweb,mailweb,other,planweb,rankweb,sourceweb | 30 | feat(plugins): decouple all companion plugins from Kits Core boot, add standalone fallbacks |
| `48ffa0b` | 11-23 22:32 | Wugweb | fix | ci | 1 | fix(ci): add composer install for shared-php SDK tests |
| `4c5fdeb` | 11-24 20:28 | Wugweb | docs | docs,kits-core | 2 | docs(kits-core): add forwarded tenant form engine polish and validation tasks (B1-B3) |
| `8b8db2a` | 11-24 20:37 | Wugweb | docs | docs | 21 | docs: import Kits platform, plugin, and design system specifications from Animal Writes |
| `2acac68` | 11-24 20:55 | Wugweb | feature | ci,directoryweb,docs,insightweb,kits-core,mailweb,other,planweb,rankweb,sourceweb,tools | 51 | feat(infra): harden packaging vendor bundling, expand CI matrix, and add Playground blueprints |
| `6cbd0d6` | 11-24 16:03 | Claude | fix | ci,docs,mailweb,tools | 24 | fix(infra): repair Composer CI, bundle MailWeb SDK at build time, real Playground blueprints and release workf |
| `decf84b` | 11-24 16:07 | Claude | fix | tools | 2 | fix(ci): resolve shared-php lockfile for PHP 8.0 so the SDK matrix installs on 8.0-8.3 |
| `36421c2` | 11-24 16:13 | Claude | fix | tools | 2 | fix(ci): pin @wp-playground/cli 3.1.66 (the tested version) and regenerate a complete lockfile |
| `75a0a88` | 11-24 16:05 | Claude | fix | directoryweb | 1 | fix(directoryweb): register aw_listing standalone when aw_content_type_args() is absent |
| `ef578a4` | 11-24 21:26 | Wugweb | feature | theme | 13 | feat(theme): complete Kits by Wugweb theme audit, tests, anti-FOUC, and tokens |
| `24a9727` | 11-24 21:45 | Wugweb | fix | theme | 15 | fix(theme): implement dark mode CSS token mappings, dynamic breadcrumbs, and FSE toggle filter |
| `8c81698` | 11-24 16:28 | Claude | docs | docs | 2 | docs(infra): record verified CI, packaging, Playground and release status |
| `4b0cc60` | 11-24 22:50 | Wugweb | feature | sourceweb | 11 | feat(sourceweb): implement worker retry backoff, domain trust overrides, feed filters, and standalone resilien |
| `1038292` | 11-24 23:00 | Wugweb | feature | directoryweb | 2 | feat(directoryweb): add directoryweb/collection-filter block |
| `675e96a` | 11-24 23:00 | Wugweb | feature | ci,directoryweb | 6 | feat(directoryweb): native claim path with claim-state machine |
| `4d7b8a4` | 11-24 23:03 | Wugweb | feature | insightweb | 5 | feat(insightweb): implement automated daily telemetry cron, credential status diagnostics, and strict empty-st |
| `e5e4bd8` | 11-24 23:10 | Wugweb | docs | docs,insightweb,sourceweb | 8 | docs: audit and harmonize SourceWeb and InsightWeb status across docs and roadmap |
| `6398705` | 11-24 23:10 | Wugweb | docs | docs,insightweb,sourceweb | 8 | docs: audit and harmonize SourceWeb and InsightWeb status across docs and roadmap |
| `4ea69d5` | 11-24 23:30 | Wugweb | feature | directoryweb,tools | 4 | feat(directoryweb): list and inspect native claims; claim-journey acceptance check |
| `cb7b8e6` | 11-24 23:30 | Wugweb | docs | docs | 1 | docs(audit): master audit matrix with evidence, owners and acceptance matrix |
| `d5ee2d5` | 11-24 23:31 | Wugweb | docs | docs,insightweb,sourceweb | 10 | docs: remove obsolete SourceWeb/InsightWeb plans and consolidate pending into docs/pending.md |
| `6cfff73` | 11-24 23:31 | Wugweb | docs | docs,insightweb,sourceweb | 10 | docs: remove obsolete SourceWeb/InsightWeb plans and consolidate pending into docs/pending.md |
| `0711799` | 11-25 00:00 | Wugweb | feature | ci,directoryweb,docs,tools | 12 | feat(directoryweb): claim emails, state-table check for form claims, native claims in the shell |
| `6d87162` | 11-25 00:00 | Wugweb | fix | rankweb | 3 | fix(rankweb): editor sidebar sprintf import, host-agnostic link counts, honest schema help |
| `99453f4` | 11-25 00:26 | Wugweb | other | directoryweb,docs,tools | 9 | DirectoryWeb: standalone claim page, form keeps typed values, claim email settings, role checks in journey |
| `5863dce` | 11-25 00:28 | Wugweb | docs | directoryweb,docs | 7 | docs(directoryweb): status blocks, readme, PENDING; drop duplicate org plan |
| `b596ee5` | 11-25 01:11 | Wugweb | other | rankweb,tools | 34 | RankWeb: standalone page head, schema type consumer, native admin, no site-specific defaults |
| `05ab6ac` | 11-25 01:11 | Wugweb | docs | docs,rankweb | 9 | docs: RankWeb readme and PENDING, one RankWeb plan, gates and matrix |
| `6ed9b1c` | 11-25 01:16 | Wugweb | feature | other,rankweb | 2 | RankWeb: standalone head no longer needs wp_specialchars_decode / remove_action; remediation harness learns th |
| `dcfa016` | 11-25 01:40 | Wugweb | other | directoryweb,docs,other,rankweb,tools | 8 | RankWeb: real Rank Math and Yoast coexistence verified, listing canonical; classify DirectoryWeb leftovers |
| `19a69c6` | 11-25 01:51 | Wugweb | other | docs | 1 | Gates: tick suites, blueprints and ZIP verification with dcfa016 evidence |
| `67756d8` | 11-25 02:32 | Wugweb | fix | directoryweb,docs,tools | 11 | DirectoryWeb: claim diagnostics, Claims menu entry standalone, Places link fix; HTTP limit and nav audits |
| `0241403` | 11-25 02:33 | Wugweb | feature | theme | 34 | feat(theme): integrate Frost-derived patterns and templates |
| `93a3ea7` | 11-25 02:33 | Wugweb | other | docs,theme | 3 | test(theme): validate Frost integration and update documentation |
| `ef2e64f` | 11-25 03:02 | Wugweb | fix | theme | 15 | fix(theme): complete Frost integration and Gutenberg compatibility |
| `6847b09` | 11-25 03:02 | Wugweb | other | docs,theme | 5 | test(theme): complete theme validation and integration documentation |
| `875fd70` | 11-25 03:42 | Wugweb | fix | theme | 3 | fix(theme): meet contrast for progress bars and Ink colour-set links |
| `2360009` | 11-25 03:42 | Wugweb | fix | docs,theme | 3 | test(theme): regression tests for contrast fixes and record verification |
| `a7231c2` | 11-25 03:53 | Wugweb | other | sourceweb | 4 | chore(sourceweb): remediate WP.org compliance, External services docs, and standalone UA strings |
| `8369632` | 11-25 03:53 | Wugweb | other | insightweb | 5 | chore(insightweb): remediate WP.org compliance, External services docs, and tenant host leaks |
| `e666d7b` | 11-25 04:03 | Wugweb | fix | sourceweb | 12 | fix(sourceweb): resolve all WP.org Plugin Check errors (text domain, translator comment, wp_parse_url, gmdate) |
| `c0c5e5a` | 11-25 04:03 | Wugweb | fix | insightweb | 3 | fix(insightweb): resolve all WP.org Plugin Check errors (translator comment, gmdate, input sanitization) |
| `eb5d2e0` | 11-25 04:15 | Wugweb | docs | docs | 8 | docs(audit): preserve ecosystem audit, baseline and remediation registers |
| `556af75` | 11-25 04:15 | Wugweb | other | ci | 1 | ci(theme): run ThemeValidationTest.php in the theme job |
| `73950ca` | 11-25 04:19 | Wugweb | docs | docs | 1 | docs(pending): record SourceWeb & InsightWeb WP.org Plugin Check and packaging completion |
| `be976d9` | 11-25 04:19 | Wugweb | fix | theme | 5 | fix(theme): page background follows the canvas preset |
| `987022e` | 11-25 04:28 | Wugweb | docs | docs | 2 | docs(plugins): update SourceWeb & InsightWeb plan status headers for kits-suite integration |
| `0d13ec7` | 11-25 04:29 | Wugweb | docs | docs | 2 | docs(plugins): remove completed sourceweb-plan.md and insightweb-plan.md |
| `42910c8` | 11-25 04:31 | Wugweb | docs | docs | 2 | docs: align SourceWeb text domain reference to 'sourceweb' |
| `2a91956` | 11-25 04:27 | Wugweb | fix | theme | 3 | fix(theme): Ink-panel tiles readable in Dark, and the theme-toggle icon has a mask |
| `5c26e67` | 11-25 04:27 | Wugweb | fix | docs | 1 | docs(audit): record fixed P0 items and sweep results |
| `3f2aa70` | 11-25 05:01 | Wugweb | docs | docs | 1 | docs(audit): WordPress API probe for the tenant theme.json layer |
| `5fe95e9` | 11-25 05:06 | Wugweb | docs | docs | 6 | docs(architecture): reconcile four architecture documents with the code |
| `6ecfb5c` | 11-25 05:08 | Wugweb | fix | kits-core | 3 | fix(kits-core): brand token defaults come from the theme, not literals |
| `e620a38` | 11-25 05:11 | Wugweb | feature | insightweb | 1 | feat(insightweb): remove legacy aw_keys read fallback (Stage 3 Step 2) |
| `fcfa4b5` | 11-25 05:12 | Wugweb | docs | docs | 2 | docs(keys): mark Stage 3 Step 2 aw_keys fallback removal completed |
| `44d7e23` | 11-25 05:12 | Wugweb | feature | directoryweb,tools | 5 | feat(directoryweb): native claims appear in the Claims screen |
| `98ffe85` | 11-25 05:14 | Wugweb | fix | directoryweb | 5 | fix(directoryweb): no raw Kits Core calls; every one goes through a fallback wrapper |
| `997c3d7` | 11-25 05:15 | Wugweb | feature | ci,directoryweb,docs | 6 | feat(directoryweb): notification emails for native claims |
| `c61e1eb` | 11-25 05:17 | Wugweb | other | directoryweb | 6 | style(directoryweb): clear the substantive WordPress-Extra findings |
| `965685f` | 11-25 05:21 | Wugweb | other | docs,mailweb,planweb | 8 | chore(mailweb,planweb): resolve WP.org Plugin Check errors, External services docs, and tenant host leaks |
| `46ab5df` | 11-25 05:22 | Wugweb | docs | docs,insightweb,sourceweb | 8 | docs: restore deleted SourceWeb and InsightWeb plan and PENDING docs |
| `32d7177` | 11-25 05:29 | Wugweb | feature | docs,rankweb | 10 | feat(rankweb): working sidebar, standalone title and share tags, truthful readme |
| `fd79d2b` | 11-25 05:30 | Wugweb | feature | mailweb | 5 | feat(mailweb): add Site Health, per-user pause dismiss, email logs/resend, fallback SMTP, alert webhooks, and  |
| `ad6e9a2` | 11-25 05:32 | Wugweb | feature | mailweb | 1 | feat(mailweb): add SMTP presets, Email Test endpoint, and Email Logs admin screen |
| `ede0b04` | 11-25 05:32 | Wugweb | other | directoryweb | 58 | DirectoryWeb: standalone claim review, evidence store, protected fields, aw_ code names removed |
| `d30b12c` | 11-25 05:32 | Wugweb | other | rankweb | 74 | RankWeb: standalone SEO output, aw_ code names removed, Animal Writes redirects dropped |
| `13786ae` | 11-25 05:32 | Wugweb | fix | insightweb,kits-core,mailweb,planweb,theme | 50 | Fix doc paths cited in plugin and theme code comments |
| `65995c0` | 11-25 05:32 | Wugweb | other | ci,other,tools | 11 | Playground, HTTP checks, nav audits and CI steps for DirectoryWeb and RankWeb |
| `f86cdf8` | 11-25 05:32 | Wugweb | fix | docs | 42 | Docs: status lines, stale claims fixed, duplicates removed, aw_ data naming policy |
| `607b349` | 11-25 05:33 | Wugweb | fix | docs,rankweb | 29 | fix(rankweb): translatable strings, working news and video sitemaps without Rank Math |
| `25196ce` | 11-25 05:33 | Wugweb | feature | docs,rankweb | 2 | feat(rankweb): the InsightWeb bridge can be turned off by filter |
| `8d8446f` | 11-25 05:34 | Wugweb | feature | other | 1 | Add DirectoryWeb pre-commit security and integration review |
| `5520087` | 11-25 05:35 | Wugweb | other | docs,rankweb | 7 | refactor(rankweb): decouple from the Animal Writes tenant and from InsightWeb |
| `d43ce81` | 11-25 05:37 | Wugweb | other | sourceweb | 3 | chore(sourceweb): replace remaining AnimalWrites User-Agent strings with SourceWeb |
| `c0b6dd4` | 11-25 05:39 | Wugweb | other | ci,directoryweb,docs,other,rankweb | 23 | refactor(rankweb,directoryweb): no tenant data left in either plugin |
| `e6f2032` | 11-25 05:41 | Wugweb | other | docs,rankweb,sites | 9 | refactor(rankweb): move the Animal Writes title module and site values to sites/animalwrites |
| `6721bbb` | 11-25 05:48 | Wugweb | fix | tools | 2 | fix(playground): send the REST nonce in the DirectoryWeb claim smoke checks |
| `9453bef` | 11-25 05:54 | Wugweb | other | rankweb | 13 | RankWeb: remove Animal Writes brand strings; AW-only values move to animal-writes-compat.php |
| `8a947a3` | 11-25 05:54 | Wugweb | feature | directoryweb | 11 | DirectoryWeb: remove Animal Writes references; add no-animal-writes guard test |
| `1124d45` | 11-25 05:54 | Wugweb | other | ci | 1 | CI and blueprints: run no-animal-writes guards; regenerate blueprints |
| `8953680` | 11-25 05:57 | Wugweb | other | directoryweb,other,rankweb | 113 | Mechanical rename of aw_ functions to directoryweb_/rankweb_ on the kits-suite tree (same tool as PR #11) |
| `c1ec313` | 11-25 12:07 | Wugweb | other | rankweb | 2 | RankWeb: keep aw_seo_kp_* aliases beside the keyphrase model, which SourceWeb and InsightWeb tests load on its |
| `6350d6b` | 11-25 18:29 | Wugweb | other | docs,rankweb,sites | 84 | RankWeb: the text domain, slug and main file are rankweb; update @package tags, test paths, plugin-info slug,  |
| `c8d2a40` | 11-25 18:32 | Wugweb | release/version | tools | 8 | chore(release): point the Playground blueprints at kits-suite-2026.11.25-pre.1 |
| `8ae6374` | 11-25 18:44 | Wugweb | other | rankweb | 1 | RankWeb: Plugin URI is https://wugweb.com/wordpress/plugin/rankweb |
| `45813d9` | 11-25 19:03 | Wugweb | docs | kits-core | 1 | docs(kits-core): WordPress.org readme: source link, External services, tags and short description |
| `1b0be97` | 11-25 19:03 | Wugweb | docs | directoryweb | 1 | docs(directoryweb): WordPress.org readme: source link, External services, tags and short description |
| `dd8c3f4` | 11-25 19:03 | Wugweb | docs | rankweb | 1 | docs(rankweb): WordPress.org readme: source link, External services, tags and short description |
| `e01e84f` | 11-25 19:03 | Wugweb | docs | sourceweb | 1 | docs(sourceweb): WordPress.org readme: source link, External services, tags and short description |
| `892afae` | 11-25 19:03 | Wugweb | docs | insightweb | 1 | docs(insightweb): WordPress.org readme: source link, External services, tags and short description |
| `61038a1` | 11-25 19:03 | Wugweb | docs | mailweb | 1 | docs(mailweb): WordPress.org readme: source link, External services, tags and short description |
| `bf24896` | 11-25 19:03 | Wugweb | docs | planweb | 1 | docs(planweb): WordPress.org readme: source link, External services, tags and short description |
| `a003cff` | 11-25 21:23 | Wugweb | fix | kits-core | 3 | fix(kits-core): print inline scripts through wp_add_inline_script (WordPress.org) |
| `4b6112c` | 11-25 21:23 | Wugweb | fix | directoryweb | 2 | fix(directoryweb): print inline scripts through wp_add_inline_script (WordPress.org) |
| `0adb625` | 11-25 21:23 | Wugweb | fix | mailweb | 1 | fix(mailweb): print inline scripts through wp_add_inline_script (WordPress.org) |
| `7b3ed18` | 11-25 21:23 | Wugweb | fix | rankweb | 1 | fix(rankweb): print inline scripts through wp_add_inline_script (WordPress.org) |
| `ba27705` | 11-25 21:23 | Wugweb | fix | sourceweb | 1 | fix(sourceweb): print inline scripts through wp_add_inline_script (WordPress.org) |
| `4a34473` | 11-25 21:34 | Wugweb | other | ci,docs,insightweb,other,sourceweb | 155 | InsightWeb and SourceWeb: rename aw_ code names to insightweb_ and sourceweb_ |
| `ce8155b` | 11-25 22:04 | Wugweb | fix | tools | 1 | fix(build): the wporg track strips Update URI from plugin main files |
| `8521788` | 11-25 22:04 | Wugweb | docs | directoryweb,mailweb | 2 | docs: working Plugin URI for DirectoryWeb; list MailWeb's bundled libraries and licences |
| `ececc74` | 11-25 22:04 | Wugweb | fix | directoryweb,kits-core,mailweb,rankweb,sourceweb | 13 | fix(plugins): Plugin Check errors: explicit script versions, escaped proof links, SES host |
| `1cc28b5` | 11-25 22:12 | Wugweb | other | ci,directoryweb,docs,tools | 31 | DirectoryWeb: dw_ and DW_ code names become directoryweb_ and DIRECTORYWEB_ |
| `c28c0db` | 11-25 22:22 | Wugweb | release/version | tools | 8 | chore(release): point the Playground blueprints at kits-suite-2026.11.25-pre.2 |
| `b5c8936` | 11-25 22:48 | Wugweb | other | directoryweb,insightweb,kits-core,mailweb,planweb,rankweb,sourceweb | 11 | WordPress.org: wp_delete_file in uninstall-backup, inline styles via wp_add_inline_style |
| `bbdec36` | 11-25 23:22 | Wugweb | release/version | ci,directoryweb,docs,insightweb,kits-core,mailweb,planweb,rankweb,sourceweb,tools | 21 | Add per-product release, product pages and registry, Plugin Check gate |
| `b547457` | 11-25 23:24 | Wugweb | docs | docs | 1 | docs: mark plugin-map live plugin table as not re-run, animal-writes-core retired |
| `482ba74` | 11-25 23:27 | Wugweb | feature | docs | 1 | Registry doc: add status list, strike what is done |
| `70eec40` | 11-25 23:37 | Wugweb | docs | docs | 3 | docs(architecture): remove finished items, list what is still open |
| `eb7445f` | 11-25 23:47 | Wugweb | fix | docs | 5 | docs(architecture): correct names, counts and not-built claims against the code |
| `1a89dcb` | 11-25 23:52 | Wugweb | fix | docs | 4 | docs(plugins): mark finished items and fix stale names |
| `518b72d` | 11-25 23:58 | Wugweb | docs | docs | 5 | docs(org): add a checked-against-code status to the five org plans |
| `f2333a2` | 11-25 23:59 | Wugweb | other | docs,kits-core | 2 | kits-core: one link helper (kits_options_link calls kits_link); inventory updated |
| `a347fe9` | 11-26 00:07 | Wugweb | other | ci,docs | 68 | Plugin Check workflow: manual and weekly only, too slow to gate PRs |
| `dbc690a` | 11-26 00:33 | Wugweb | other | docs,mailweb | 2 | mailweb: drop the dead ui=classic argument from the Site sending URL |
| `2fdef65` | 11-26 00:34 | Wugweb | other | ci | 1 | Plugin Check workflow: manual and weekly only, too slow to gate PRs |
| `00aec2c` | 11-26 00:46 | Wugweb | docs | docs | 1 | docs: place intros and RankWeb classic screens are not simple removals |
| `314dc83` | 11-26 06:22 | Wugweb | docs | docs | 5 | docs: delete four Animal Writes-era design specs and a duplicate file |
| `f7cc90d` | 11-26 06:26 | Wugweb | docs | directoryweb,docs,insightweb,kits-core,mailweb,planweb,rankweb,sourceweb | 22 | docs: retire 15 plugin docs, carry their open items into each plugin's PENDING.md |
| `3f9ad25` | 11-26 06:30 | Wugweb | other | insightweb,sourceweb | 4 | insightweb: order the tabs (reading screens, then site screens); SourceWeb tab label translatable |
| `8078e92` | 11-26 06:47 | Wugweb | other | insightweb | 5 | InsightWeb: weekly or monthly search report by email, off by default |
| `e9b4cad` | 11-26 06:51 | Wugweb | other | insightweb,rankweb | 11 | RankWeb: Internal links, Image SEO, SEO CSV and Redirect tools inside the Kits shell; InsightWeb and RankWeb p |
| `b3e0362` | 11-26 06:52 | Wugweb | docs | docs | 13 | docs/org: delete 12 finished audit, baseline and architecture records |
| `f7ed343` | 11-26 06:56 | Wugweb | other | planweb,sourceweb | 4 | SourceWeb and PlanWeb: guard the Kits Core calls that fatal without Kits Core |
| `9c357cd` | 11-26 06:58 | Wugweb | other | insightweb,rankweb | 3 | RankWeb: .htaccess write needs a ticked confirm, checked on the server; InsightWeb pending: AdSense dropped |
| `27abe17` | 11-26 07:00 | Wugweb | other | rankweb | 4 | RankWeb: redirect categories as a CSV label kept in RankWeb; ranking formula recorded as InsightWeb's keyword  |
| `5504481` | 11-26 07:01 | Wugweb | docs | directoryweb,docs | 2 | docs/org: delete directoryweb-data-naming-policy; its rule moves to DirectoryWeb PENDING |
| `cb37436` | 11-26 07:01 | Wugweb | docs | directoryweb,docs,kits-core,rankweb | 5 | docs/org: delete acceptance-gates and admin-ia-inventory; open items move to plugin PENDING files |
| `65a5193` | 11-26 07:04 | Wugweb | docs | directoryweb,docs,insightweb,kits-core,mailweb,planweb,rankweb | 10 | docs/org: delete master-matrix, multi-tenant-setup-guide and owner-decisions; open items move to plugin PENDIN |
| `2eeb0a8` | 11-26 07:07 | Wugweb | docs | docs,kits-core,sites,theme | 12 | docs/org: delete the last eight files; open items move to plugin, theme and site notes |
| `3f85420` | 11-26 07:09 | Wugweb | other | mailweb | 6 | MailWeb: daily DNS check also verifies SPF, warning shown on MailWeb screens, cron and warning removed on unin |
| `071fcb0` | 11-26 07:10 | Wugweb | other | planweb | 4 | PlanWeb: Calendar filters (type, status, owner, channel) and a week view |
| `147f68b` | 11-26 07:16 | Wugweb | other | ci,directoryweb | 5 | DirectoryWeb: claim events go to the installed CRM (FluentCRM built in, adapter filter for others) |
| `6240190` | 11-26 07:17 | Wugweb | other | other,sourceweb | 81 | SourceWeb: group includes by purpose (sources, workers, rules, review, enrichment, output, keywords, ai, admin |
| `e28bb7f` | 11-26 07:18 | Wugweb | other | sourceweb | 2 | SourceWeb: architecture note wording, PENDING |
| `7247543` | 11-26 07:20 | Wugweb | other | sourceweb | 1 | SourceWeb: architecture note leads with the six-step purpose |
| `ed9b188` | 11-26 07:21 | Wugweb | other | sourceweb | 19 | SourceWeb: summaries, output and directory enrichment move into enhance/ |
| `375cdbd` | 11-26 07:22 | Wugweb | other | sourceweb | 1 | SourceWeb: information architecture analysis against the six steps |
| `b8fd4c0` | 11-26 07:22 | Wugweb | other | sourceweb | 1 | SourceWeb: sources can be any method, outputs can be plugins or workflows |
| `2336135` | 11-26 07:25 | Wugweb | other | sourceweb | 1 | SourceWeb: pipeline model with standard blocks, places of any kind, enhancement per place |
| `2e54a09` | 11-26 07:26 | Wugweb | other | sourceweb | 5 | SourceWeb: places registry, routes and boolean tests; ingest asks where an item goes (default unchanged) |
| `2b4ca81` | 11-26 07:27 | Wugweb | other | sourceweb | 1 | SourceWeb: workers audit, AI model purposes, one worker definition, reorganisation by step |
| `4ee8526` | 11-26 07:28 | Wugweb | feature | sourceweb | 2 | SourceWeb: add the Site backup copy worker the registry was missing |
| `2a8b369` | 11-26 07:31 | Wugweb | other | sourceweb | 2 | SourceWeb: record the 12 workflows to keep and the 8 to retire or move |
| `d88c0e2` | 11-26 07:33 | Wugweb | other | sourceweb | 5 | SourceWeb: registry is the twelve workflows to keep |
| `89ef5ca` | 11-26 07:35 | Wugweb | fix | ci,sourceweb,tools | 3 | SourceWeb: add the workflow-list drift check and fix the drift it found |
| `0799851` | 11-26 07:37 | Wugweb | other | sourceweb | 8 | SourceWeb: Places tab to choose where items go |
| `b1357d8` | 11-26 07:38 | Wugweb | other | sourceweb | 5 | SourceWeb: AI keys matched by job, paid providers removed |
| `4ad6d35` | 11-26 07:39 | Wugweb | other | sourceweb | 7 | SourceWeb: source-type registry, shown on the Places tab |
| `b7db71c` | 11-26 07:40 | Wugweb | other | sourceweb | 6 | SourceWeb: per-place enhancement and the closed loop |
| `4c714ae` | 11-26 07:41 | Wugweb | other | sourceweb | 8 | SourceWeb: worker union, and the manual re-check tool |
| `cae0699` | 11-26 07:42 | Wugweb | other | sourceweb | 9 | SourceWeb: split the REST pages file by feature; notes |
| `96ff9c0` | 11-26 07:43 | Wugweb | other | sourceweb | 8 | SourceWeb: external-services registry with a readme check; worker routes also under sourceweb/v1 |
| `bd609dc` | 11-26 07:48 | Wugweb | other | ci,directoryweb | 7 | DirectoryWeb: canonical schema, listing types, form adapter contract and submission engine |
| `12032c7` | 11-26 07:49 | Wugweb | other | rankweb | 11 | RankWeb: native FAQ screen (GET faq, POST faq/approve, POST faq/recount) |
| `b6a9e44` | 11-26 07:50 | Wugweb | feature | directoryweb | 6 | DirectoryWeb: new menu, Schema & Fields, Listing Types, Form Integrations, Import / Export, Works with |
| `b6acb1b` | 11-26 07:53 | Wugweb | other | rankweb | 10 | RankWeb: native Internal links screen (audit, anchor mix, silos) |
| `d6ed9e2` | 11-26 07:57 | Wugweb | other | rankweb | 12 | RankWeb: native Image SEO and SEO CSV screens (first REST multipart upload) |
| `f14458a` | 11-26 08:01 | Wugweb | other | rankweb | 13 | RankWeb: native Redirect tools screen (import, 404 log, .htaccess write behind a confirm) |
| `26d6042` | 11-26 08:01 | Wugweb | other | rankweb | 1 | RankWeb: PENDING.md records the native tool screens and what is unverified |
| `643cb96` | 11-26 08:10 | Wugweb | other | directoryweb,tools | 9 | DirectoryWeb: listing CSV import and export, Get-it links, a Fluent Forms mapping harness; rename a colliding  |
| `1ea286a` | 11-26 08:18 | Wugweb | other | directoryweb,tools | 3 | DirectoryWeb: Fluent Forms adapter reads its tables directly; mapping harness handles the rate limit; notes |
| `5e7c3d6` | 11-26 08:21 | Wugweb | other | directoryweb,tools | 2 | DirectoryWeb: mapping harness switches off Fluent Forms' submission throttle; deferred |
| `7b15558` | 11-26 08:21 | Wugweb | fix | directoryweb,tools | 2 | DirectoryWeb: mapping harness counts the fixture listing in the export |
| `c4b13e0` | 11-26 08:24 | Wugweb | fix | sourceweb | 7 | SourceWeb: low-acceptance source flags, All workers table; fix the Places enhancement UI |
| `ff1a8cd` | 11-26 08:38 | Wugweb | fix | directoryweb,sourceweb | 3 | Fix alias fatal without Core and SourceWeb detection on DirectoryWeb Settings |
| `1a79cd3` | 11-26 08:56 | Wugweb | other | directoryweb,rankweb | 4 | DirectoryWeb and RankWeb: WordPress dashboard boxes |
| `dcd7fa9` | 11-26 08:56 | Wugweb | other | rankweb | 1 | RankWeb dashboard box: show gaps only (titles, descriptions, focus keywords, schema), not FAQ |
| `bcdd7fe` | 11-26 09:01 | Wugweb | other | rankweb | 3 | RankWeb: SEO Bar on the post lists (title, description, focus keyword, noindex, address), spoken summary for s |
| `6def15f` | 11-26 09:06 | Wugweb | other | rankweb | 6 | RankWeb: Structured data box for Google gallery types (Recipe, Product, Local business, Event, Job posting, Co |
| `16d8cf6` | 11-26 09:07 | Wugweb | other | rankweb | 6 | RankWeb: verification tags (Google, Bing, Yandex, Pinterest) and crawlers kept out in robots.txt, as a module  |
| `d674045` | 11-26 09:07 | Wugweb | other | rankweb | 1 | RankWeb: the Structured data box shows in the block editor too |
| `49d8cfd` | 11-26 09:11 | Wugweb | feature | directoryweb,insightweb,kits-core,mailweb,planweb,rankweb,sourceweb | 7 | A CHANGELOG.md for each plugin, from its readme changelog plus what is new |
| `5921e83` | 11-26 09:17 | Wugweb | other | rankweb | 1 | Test runner: setUp() through reflection works on PHP 8.0 (CI matrix) |
| `3c67f20` | 11-26 09:18 | Wugweb | other | rankweb | 1 | RankWeb: the Structured data code does not need WordPress functions the test harness lacks |
| `1426632` | 11-26 09:21 | Wugweb | other | rankweb | 7 | RankWeb: per-item nofollow, noarchive, nosnippet and max-snippet next to noindex |
| `72334b9` | 11-26 09:23 | Wugweb | other | rankweb | 13 | RankWeb: Transport copies SEO fields from Yoast, Rank Math and All in One SEO (dry run first, never overwrites |
| `92c481b` | 11-26 09:23 | Wugweb | other | rankweb | 3 | RankWeb: the SEO Bar on the category, tag and user lists |
| `b80ef1c` | 11-26 09:24 | Wugweb | other | rankweb | 3 | RankWeb: an image sitemap (image-sitemap.xml) when Rank Math is absent |
| `04a34c4` | 11-26 09:33 | Wugweb | feature | other | 58 | feat(design-system): tokens from the live wugweb.com stylesheet, W3C format |
| `a10601d` | 11-26 09:33 | Wugweb | fix | rankweb | 8 | RankWeb: browser pass fixes (max-snippet printed bare, SEO column too narrow), notes updated |
| `9a584ae` | 11-26 09:36 | Wugweb | docs | other | 40 | docs(design-system): site design docs at design-system/, not docs/wugweb |
| `a30faba` | 11-26 09:39 | Wugweb | feature | ci,other,tools | 22 | feat(design-tokens): @wugweb-git/kits-tokens package, Tokens Studio sync, token notes |
| `385b7a7` | 11-26 09:42 | Wugweb | release/version | directoryweb,insightweb,rankweb,sourceweb | 11 | Versions: DirectoryWeb 1.2.0, SourceWeb 0.2.0, InsightWeb 0.3.0, RankWeb 2.2.0 |
| `efb6bbc` | 11-26 09:59 | Wugweb | release/version | insightweb,rankweb | 11 | InsightWeb 1.1.0: the header was 1.0.0, so the 0.3.0 bump did not apply and v1.0.0 was published with the new  |
| `1b6f45c` | 11-26 10:01 | Wugweb | other | rankweb | 1 | RankWeb: Transport reads SEOPress and The SEO Framework; robots choices in the classic editor |
| `6953540` | 11-26 10:10 | Wugweb | other | directoryweb,kits-core,rankweb | 3 | Dashboard boxes as tiles: the number links to its screen, a count to act on says Needs attention (words and ic |
| `d8c3868` | 11-26 10:14 | Wugweb | other | tools | 3 | Product pages follow the Kits shell UI; listing adds FAQ, credits, screenshots and theme meta |
| `d4f2ff6` | 11-26 10:15 | Wugweb | other | tools | 3 | Pages: descriptions, canonical, social tags, structured data, sitemap, robots, 404, header action |
| `fd40d8b` | 11-26 10:15 | Wugweb | other | planweb,sourceweb,tools | 3 | Listing copy: plainer short descriptions for PlanWeb and SourceWeb; index intro names what the products do |
| `f1385e3` | 11-26 10:16 | Wugweb | other | tools | 2 | Pages: unique link names, headings on the index, visible focus on buttons, forced-colours support |
| `e55d38d` | 11-26 10:21 | Wugweb | other | kits-core | 4 | Kits Core: fold plugin menus under Plugins and Kits under Appearance; other screens as core tabs |
| `928c816` | 11-26 14:27 | Wugweb | release/version | kits-core,rankweb | 8 | Kits Core 1.1.0 (registry updater, SHA-256 check), RankWeb 2.3.0 (tiles box, SEOPress/SEO Framework transport) |
| `cb8c2de` | 11-26 14:28 | Wugweb | release/version | sourceweb | 6 | SourceWeb 0.2.1: Places says when there is no place instead of an empty Send to list |
| `4117975` | 11-26 14:29 | Wugweb | release/version | directoryweb,kits-core | 4 | DirectoryWeb 1.2.1 (tiles box); Kits Core PENDING notes |
| `426bc61` | 11-26 14:33 | Wugweb | other | rankweb | 4 | RankWeb: more Google gallery types (Dataset, Q&A, forum post, education Q&A, employer rating, math solver, vac |
| `96aa7d0` | 11-26 14:34 | Wugweb | feature | rankweb | 8 | RankWeb: page speed module (defer chosen scripts, Google Fonts display=swap, WebP for new uploads) |
| `f9a61dc` | 11-26 14:34 | Wugweb | other | rankweb | 6 | RankWeb: archive noindex rules (author, date, paged, attachment, empty terms) |
| `8e1fed0` | 11-26 14:35 | Wugweb | other | rankweb | 6 | RankWeb: per-item canonical address, 301 redirect and share image address |
| `750ca00` | 11-26 14:35 | Wugweb | other | rankweb | 6 | RankWeb: SEO fields on category and tag screens (title, description, noindex) |
| `9728b86` | 11-26 14:36 | Wugweb | other | rankweb | 8 | RankWeb: twitter:site handle and an appeared-first-on line in feeds |
| `236dcd4` | 11-26 14:40 | Wugweb | other | tools | 1 | Nav audit: with Kits Core the DirectoryWeb menu is one item under Plugins and its screens are tabs |
| `9f61d37` | 11-26 14:44 | Wugweb | other | rankweb | 1 | RankWeb: notes for the gallery, SEO Framework and page speed work |
| `eef3398` | 11-26 14:45 | Wugweb | other | rankweb | 6 | RankWeb: per-item share title and description |
| `780102c` | 11-26 14:46 | Wugweb | other | rankweb | 11 | RankWeb: title separator and prefix; SEO fields on the user profile for the author page |
| `f74f192` | 11-26 14:47 | Wugweb | other | rankweb | 7 | RankWeb: Transport copies category, tag and author fields |
| `1d6d476` | 11-26 14:47 | Wugweb | other | rankweb | 4 | RankWeb: Product with variants and Loyalty program gallery types |
| `b67e13c` | 11-26 14:47 | Wugweb | other | rankweb | 6 | RankWeb: WooCommerce cart, checkout and account pages stay out of search |
| `200c8a8` | 11-26 14:48 | Wugweb | other | rankweb | 8 | RankWeb: primary category for the address and breadcrumbs |
| `97cb438` | 11-26 14:52 | Wugweb | other | rankweb | 19 | RankWeb: heavier page speed options (delay scripts, CSS shrink and prune, local Google Fonts, WebP serving and |
| `c2ae1eb` | 11-26 14:57 | Wugweb | other | rankweb | 1 | RankWeb: PENDING updated with what is built and what is still unverified |
| `8e24c06` | 11-26 15:10 | Wugweb | release/version | rankweb | 2 | RankWeb 2.3.0 changelog lists the later features |
| `96924ef` | 11-26 15:27 | Wugweb | other | rankweb | 1 | RankWeb: WooCommerce schema work marked deferred in PENDING |
| `f079183` | 11-26 16:21 | Wugweb | release/version | kits-core | 25 | Kits Core 1.2.0: Countdown, Metric, Share, Sticky action, Letter and Sponsored blocks |
| `38b8815` | 11-26 17:27 | Wugweb | release/version | insightweb,mailweb,planweb,sourceweb | 12 | InsightWeb 1.1.1, MailWeb 3.3.1, PlanWeb 0.2.1, SourceWeb 0.2.2: Update URI so the registry reaches them |
| `0e982c3` | 11-26 21:51 | Wugweb | feature | theme | 7 | feat(theme): theme info modal, localized UI strings, and stacked card styling |
| `288bf4d` | 11-26 21:51 | Wugweb | feature | kits-core | 12 | feat(kits-core): brand customizer layer 3 theme.json injection, onboarding swatches, and form diagnostics |
| `9e85a56` | 11-26 21:51 | Wugweb | feature | directoryweb,rankweb | 2 | feat(plugins): add plugin row meta actions for directoryweb and rankweb |
| `15ee659` | 11-26 21:51 | Wugweb | feature | insightweb | 5 | feat(insightweb): telemetry 404 tracking, internal search logging, and keyword movers |
| `207df6a` | 11-26 21:51 | Wugweb | feature | mailweb | 5 | feat(mailweb): tenant sender profiles, per-profile rate limits, and retry queue |
| `b44b346` | 11-26 21:52 | Wugweb | feature | planweb | 5 | feat(planweb): calendar filtering and views for campaigns, authors, and categories |
| `0ba8c39` | 11-26 21:52 | Wugweb | feature | other,sourceweb | 6 | feat(sourceweb): ai open-model consent gate and source quality threshold evaluator |
| `deb0951` | 11-26 22:08 | Wugweb | docs | other | 1 | docs: update KITS_WP_SUITE.md for Layer 3 theme.json and theme-info |
| `5edaa6a` | 11-26 22:10 | Wugweb | docs | kits-core | 1 | docs(kits-core): mark GitHub Pages and registry/index.json verified |
| `b885a16` | 11-26 21:51 | Wugweb | release/version | kits-core,other | 2 | README: real repo map and the release-to-site path; Kits Core pending note brought up to date |
| `b46992a` | 11-26 22:03 | Wugweb | release/version | kits-core | 7 | Kits Core 1.3.0 (part 1): optional site check-in, off by default |
| `a111613` | 11-26 22:05 | Wugweb | fix | kits-core | 4 | Kits Core 1.3.0 (part 2): fixes from the review of the brand layer, and its changelog |
| `3e5074c` | 11-26 22:05 | Wugweb | release/version | directoryweb,insightweb,mailweb,rankweb,sourceweb,theme | 6 | PENDING: the review's HOLD findings for the unreleased mailweb, sourceweb, insightweb, row-link and theme chan |
| `ce6c2b0` | 11-26 22:10 | Wugweb | release/version | planweb | 17 | PlanWeb 0.3.0: scheduled jobs (overdue sweep, repeats, reminders, weekly digest), all off by default |
| `1c3791e` | 11-26 22:10 | Wugweb | other | kits-core | 1 | Kits Core pending: the check-in is built, its receiver is not |
| `b4ff08a` | 11-26 22:42 | Wugweb | other | kits-core,rankweb,sourceweb | 14 | Dashboard boxes in the Kits look; stop Animal Writes-only alarms on other sites |
| `d4f35cf` | 11-26 22:45 | Wugweb | other | kits-core | 1 | Setup wizard in the Kits look: cards, big titles, black buttons and selection |
| `774ee19` | 11-26 22:53 | Wugweb | other | directoryweb,insightweb,kits-core,mailweb,planweb,rankweb,sourceweb | 28 | Remove Upgrade to Premium links; Check again clears the registry cache |
| `0959092` | 11-26 22:53 | Wugweb | release/version | kits-core,rankweb,sourceweb,theme | 8 | chore: bump patch versions across all 7 plugins and theme |
| `a8d4f7c` | 11-26 22:54 | Wugweb | other | kits-core | 5 | Kits Core: More from Wugweb page, the one place products promote each other |
| `e74a6b7` | 11-26 22:55 | Wugweb | release/version | kits-core,rankweb,sourceweb | 6 | Changelog entries match the bumped versions (Kits Core 1.3.2, RankWeb 2.3.2, SourceWeb 0.2.4) |
| `a13ea12` | 11-26 23:03 | Wugweb | other | rankweb | 1 | RankWeb: watch llms.txt only when Rank Math's llms module is on |
| `26beb14` | 11-26 23:11 | Wugweb | fix | insightweb,mailweb,rankweb | 13 | Hotfix: stop loading held MailWeb retry queue and InsightWeb 404 logging; RankWeb page cache and sitemap check |
| `8983d68` | 11-26 23:12 | Wugweb | docs | docs | 1 | docs: standalone audit of the six plugins, 26 Nov 2026 |
| `586ff83` | 11-26 23:28 | Wugweb | docs | docs | 1 | docs: mistakes audit, 21 to 26 Nov 2026 |
| `b4172a0` | 11-26 23:30 | Wugweb | fix | ci,docs,other,sourceweb,tools | 14 | Held-code check in CI and release; SourceWeb 0.2.5 stops loading held consent code; audit corrections |
| `6fef29d` | 11-26 23:38 | Wugweb | docs | docs | 1 | docs: second-pass audit findings (Kits Core, pipeline, zips, deletions) |
| `54023df` | 11-27 06:52 | Wugweb | release/version | rankweb | 12 | RankWeb 2.3.4: robots extras only when RankWeb owns SEO, honest redirect wording, uninstall cleanup, External  |
| `e605b59` | 11-27 06:52 | Wugweb | release/version | sourceweb | 21 | SourceWeb 0.2.6: ingest needs a worker capability and lands as pending, Animal Writes extras off unless enable |
| `7e0c80c` | 11-27 06:52 | Wugweb | release/version | ci,tools | 4 | Release pipeline: draft, verify, then publish; inputs via env; tag checks; held files left out of zips; prerel |
| `eeb1ce1` | 11-27 06:53 | Wugweb | release/version | planweb | 13 | PlanWeb 0.3.2: Repeat field in the Calendar form, native Calendar and Settings screens without Kits Core, Anim |
| `b25f074` | 11-27 06:54 | Wugweb | release/version | insightweb | 14 | InsightWeb 1.1.4: visitor tracking off unless switched on and disclosed, native tab screens, External services |
| `5f7c184` | 11-27 06:56 | Wugweb | release/version | directoryweb,sites | 21 | DirectoryWeb 1.2.3: native screens without Kits Core, neutral wording and PIN lookup off by default, External  |
| `fbd9173` | 11-27 06:56 | Wugweb | release/version | kits-core | 20 | Kits Core 1.3.3: form copy off by default with retention and delete, five silent tests now run, wizard backup  |
| `f4d4fee` | 11-27 06:58 | Wugweb | release/version | mailweb | 18 | MailWeb 3.3.4: force From, daily cap and body logging are switches (off for new installs), stands down for oth |
| `426f037` | 11-26 21:40 | Wugweb | fix | insightweb | 4 | fix(insightweb): load overview boxes four at a time, retry on error, say how to fix Clarity 401/403 |
| `441291e` | 11-27 07:17 | Wugweb | release/version | insightweb | 3 | InsightWeb 1.1.5: overview boxes load four at a time, retry, Clarity 401/403 message (from feat/insightweb-com |
| `bce58c6` | 11-27 07:21 | Wugweb | fix | directoryweb,docs,insightweb,kits-core,mailweb,planweb,rankweb,sites,sourceweb | 19 | Correct claims that were not built: MailWeb 3.3.5, SourceWeb 0.2.7, RankWeb 2.3.5 readmes and news sitemap; ve |
| `7e2bb0d` | 11-27 07:22 | Wugweb | release/version | rankweb | 4 | RankWeb 2.3.6: import columns, copy SEO values stored under a source's own meta keys into the SEO plugin's fie |
| `ae82e66` | 11-27 07:26 | Wugweb | release/version | contentweb | 10 | Add Content Web 1.0.0: client/case study content model, taxonomies, Notion fields, admin columns and Master me |
