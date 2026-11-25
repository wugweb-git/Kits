# Baseline report, Phase 1 (no files modified)

## 0. Report format (used for every phase from now on)
Each finding row: ID | Class | Severity | Priority | Evidence (file:line or run) | Files | Test (existing / needed) | Decision needed.
Classes: CD confirmed defect, DD documentation drift, MI missing implementation, UV unverified claim, OD owner decision required, AR already resolved.
Severity (impact if shipped): S1 breaks use or accessibility for real content (unreadable text, fatal, data loss, security hole); S2 wrong or silently ignored behaviour of a shipped feature, or data left behind; S3 inconsistency a user or reviewer would notice but works; S4 hygiene (dead references, naming).
Priority (when): P0 fix first, no decision needed, blocks release; P1 fix after P0, no decision needed; P2 needs an owner decision before work; P3 backlog or documentation-only after code settles.
Rules: S1 is always P0 unless it needs a decision (then P2 with the decision at the top of the register). A defect that others depend on (the brand layer's defaults) is promoted one priority. Docs findings are never above P1 unless a doc causes unsafe action. A claim is only "resolved" with a passing test or a recorded run.

## 1. Verified baseline
- Repo /Users/abcom/Documents/GitHub/Kits, branch feat/theme-fixes, HEAD 2360009 (875fd70 fix, 2360009 test on top of 6847b09). No stashes.
- Working tree: exactly the 4 unrelated files, unmodified by this work: plugins/directoryweb/includes/directoryweb-dashboard.php, directoryweb-rest.php, tools/playground/blueprints/directoryweb.json, tools/playground/build-blueprints.py. Nothing staged. (.DS_Store ignored.)
- Nothing from the remediation plan is implemented. Re-verified below.
- The three audit reports are NOT in the repo: they live in the session scratchpad (audit-2360009.md, audit-docs.md, audit-plugins.md). Adding them under docs/ is itself a change; proposed location in section 4.
- Tools available: php, python3, node, composer. Not installed: phpcs/WPCS, Theme Check, Plugin Check (installing needs a network download: ask first).
- CI today (.github/workflows/ci-suite.yml): theme job only parses theme.json and runs build-tokens.py --help (lines 117-126); Core tests are run (line 173 loops plugins/kits-core/tests/*-tests.php); ThemeValidationTest.php is not run anywhere.

## 2. Re-verification of reported issues against current code
| ID | Class | Sev | Pri | Evidence (re-checked now) | Test | Decision |
|---|---|---|---|---|---|---|
| G17 Dark body background light, 1.40:1 | CD | S1 | P0 | kit.css:1142 body{background:var(--kit-surface-page)}; kit-tokens.css:225 --kit-surface-page: var(--neutral-1); runtime run: Dark gave bodyBg #F4F4F4 with canvas #0D1117 | needed: contrast + bodyBg==canvas for Dark | none |
| G3 Brand accent default #FFBE1A vs theme #C6D2E0; stale-default skip | CD | S2 | P0 (promoted: blocks layer) | brand-customizer-model.php:28,337; test uses same constants (22/0 pass) | needed: defaults read from theme.json | accent (OD1) only for the canonical value; the mechanism (read theme.json) needs no decision |
| G1/G2 Core has no wp_theme_json_data_theme; CSS at wp_head:100 overrides user styles | MI | S2 | P1 | grep: 0 hits in plugins/kits-core (non-test); brand-customizer.php:30-62 | needed | approach owner-approved (Core owns layer); verify API first (Phase 3) |
| Reset deletes option instead of restoring preset | CD | S2 | P1 | brand-customizer.php:110 delete_option | needed | none (owner decided) |
| G21 uninstall omits brand + 8 other options | CD | S2 | P1 | uninstall.php: 0 matches for kits_brand_tokens, kits_*_scripts, kits_caps, kits_active_style_variation, kits_cron_runs, kits_taxonomy_rename* | needed | which aw_* are shared (OD7-ish) |
| G22 Scripts & Pixels raw save, manage_options only | UV->CD vs docs | S2 | P2 | header-footer-scripts.php:63-69 (raw by design comment "super admin") | needed after decision | OD3 |
| G20 Wizard saves kits_active_style_variation nobody reads | CD | S3 | P2 | onboarding-wizard.php (agent evidence; not re-opened this round) | needed | OD2 |
| G9 "Core readers of theme files unguarded" | UV, downgraded | S3 | P3 | demo.php:15 and system-screen.php:153 use file_exists/is_readable; joined-css.php:59 guards on theme functions; runtime: Core on Twenty Twenty-Five, 7 admin screens + Site Editor, no notices | extend: Core + 2nd theme + no Core matrix | none |
| G23 ThemeValidationTest not in CI | MI | S2 | P0 (cheap, enables gating) | ci-suite.yml:117-126 | n/a | none |
| G19 Core brand tokens inert on non-Kits themes | UV (by design?) | S3 | P3 | Playground run | document | none |
| G18 Slate equals default (2 slots differ) | DD/design | S3 | P2 | styles/*.json | n/a | variation set intent |
| Duplicate docs (2 byte-identical pairs) | DD | S4 | P2 | cmp: identical1, identical2 true | n/a | OD5 |
| Layer-3 claim in six docs | DD | S3 | P3 (after code) | audit-docs.md section 2/5 | n/a | none |
| Min WP 6.6 vs 7.1 | DD | S3 | P1 | theme readme.txt:60 "6.6" vs 7.1 headers | doc test | confirm 7.1 |
| G24 AW refs in code (preset name, kits.css:27-30, uninstall header, aw_* options) | CD(hygiene) | S4 | P2 | file list above; kits.css:27-30 cites missing styles/animal-writes.json | grep test | OD: legacy aw_* rename vs keep for compatibility |
| Update URI kept vs removed | OD | S2 for WP.org | P2 | kits-core.php:12; plugin-map says keep, synthesis says remove | n/a | OD6 |
| Cloudflare relay / Foundry in PENDING with no code | DD | S3 | P2 | agent grep: no code | n/a | OD4 |
| Reference name in repo | CD(hygiene) | S4 | P1 | 20 lines/5 files; built ZIP clean | rename + test | OD7 (history only) |
| Reverse engineering incomplete (theme.json settings, 25 block styles, style.css, nav) | MI | S2 | P1 | docs/theme/pattern-library-integration.md (planned rename) covers 4 block styles only; the reference theme fluid=true vs Kits false | matrix | none |
| Plugins: *_STANDALONE decorative; raw calls (directoryweb, sourceweb); no Requires Plugins | DD/UV | S3 | P3 | audit-plugins.md | n/a | out of scope: do not modify unrelated plugins; record only |
| VoiceOver, real Safari | UV | S3 | manual | not runnable by agent | n/a | owner must run |

Corrections to my earlier audit: G9 was overstated (readers are guarded; verified at runtime). Also audit-plugins claims about directoryweb/sourceweb come from an agent and were not re-read by me.

## 3. Proposed execution sequence (small, independently verifiable; no decision dependencies first)
1. Docs location: add the three audit reports + the four deliverables under docs/audit/ (new folder, no existing file touched). Commit 1 (docs only).
2. CI gate: add ThemeValidationTest.php to ci-theme job (php setup), plus Core brand/admin-menu tests already looped. Test: run locally; commit 2.
3. G17: Dark body background fix; write failing test first (bodyBg == canvas, contrast >= 4.5 for default/Dark/Forest/Slate computed from palettes + one render check); also audit other kit CSS rules that override Global Styles-owned properties (body, headings, links). Commit 3.
4. Rendered verification of Dark/Forest/Slate (script already exists in scratchpad, promote to tests/ as Playground harness only if owner wants it in repo).
5. Brand model: read defaults from resolved theme.json; fix stale-default compare; tests against real theme.json. Commit 4.
6. Verify WordPress API for the Layer-3 filter on this WP (WP_Theme_JSON_Data::update_with, filter order vs user data, behaviour of "Reset styles", Multisite) with a throwaway Playground probe before writing code. Report findings; then implement in Core (filter, registry, reset-restores-preset, remove CSS injection). Commits 5-6.
7. Contrast validation and dark-mode rule for tenant colours; settings lifecycle (uninstall, backup, transfer). Commits 7-8.
8. Core standalone matrix (none / TT25 / second theme / Kits; activate, deactivate, delete). Commit 9.
9. Reverse-engineering matrix: theme.json settings, 25 block styles, style.css behaviours, nav overlay/submenu, 50 patterns at block level, 9 templates, 2 parts, 7 variations; browser comparison pages. Output reverse-engineering-matrix.md. Parallel to 5-8.
10. Distribution: build channels; run Theme Check / PHPCS Theme Review / Plugin Check (needs download approval); packaging verification.
11. Docs reconciliation (after code), naming cleanup, archive proposal (docs/archive/ with banner; no deletions).
12. Release-readiness report listing remaining owner decisions and manual tests (VoiceOver, Safari).
Owner-decision items are batched in owner-decisions.md and not started: OD1 accent, OD2 wizard, OD3 scripts, OD4 Cloudflare/Foundry, OD5 duplicate docs, OD6 Update URI, OD7 history naming.

## 4. Needs your OK before I modify anything
- Creating docs/audit/ and the deliverable files in the repo (and where).
- Installing PHPCS/WPCS/Plugin Check tooling (network download).
- Whether Playground harness scripts may be committed under tools/ or stay out of the repo.
