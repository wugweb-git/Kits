# Docs vs code audit: theme and Kits Core (read-only)

Repo `/Users/abcom/Documents/GitHub/Kits`, branch `feat/theme-fixes`, HEAD 2360009. Nothing was changed except this file.
Paths below are relative to the repo. T = `themes/kits-by-wugweb`, KC = `plugins/kits-core`.
Tests re-run during the audit (read-only): `T/tests/ThemeValidationTest.php` 29 checks 0 failed; KC `admin-menu-tests.php` 74/0; `brand-customizer-tests.php` 22/0.
Depth: **READ** = read in full or the relevant sections and checked against code. **SKIMMED** = head, headings and targeted greps only; claims not all verified.

Status words: Current / Outdated / Conflicting / Duplicate / Historical / NIF (not-implemented-feature-documented).

## 0. Facts verified in code that most findings hang on

| Fact | Evidence |
|---|---|
| Only the theme hooks `wp_theme_json_data_theme` (site-layer merge, and only if `assets/site/` exists) | `T/inc/site-layer.php:91`; no hit in KC |
| Brand CSS is printed on `wp_head` priority 100 and `admin_head` (block editor only); no theme.json merge, no transient | `KC/includes/brand-customizer.php:30-62` |
| Brand defaults: accent `#FFBE1A`, preset named "Default (Animal Writes / Neutral Kits)"; theme primary is `#C6D2E0` | `KC/includes/brand-customizer-model.php:28,187-191`; `T/theme.json:19`; `T/assets/css/kit-tokens.css:32` |
| Onboarding wizard has 3 steps; it saves option `kits_active_style_variation`, which nothing reads; its variation list (`default, slate, forest, ink`) swatch colours do not match the theme files and `ink` is a colour set, not a variation; `dark` is missing | `KC/includes/onboarding-wizard.php:75-80,97,104-130,136,167,192`; grep finds 2 hits, both in that file |
| Scripts & Pixels saves raw, unsanitised script text, gated only by `manage_options` (not `manage_kits`) | `KC/includes/header-footer-scripts.php:63-69` |
| Theme toggle is injected by a `render_block_core/navigation` filter (key `kit-theme`), not placed in `parts/header.html` (no `data-kit-theme-toggle` in any `.html`) | `T/inc/blocks.php:268-286`; `T/assets/js/kit.js:365-373`; `T/inc/assets.php:30` |
| Kits Core registers one block, `kits/hero`; `theme-options` is a JS app under `src/`, not a block | `KC/includes/blocks.php:32`; `KC/blocks/` has `hero` only |
| `kits/post-field` Block Bindings source exists | `KC/includes/bindings.php:107-110` |
| Uninstall omits: `kits_brand_tokens`, `kits_header_scripts`, `kits_body_scripts`, `kits_footer_scripts`, `kits_active_style_variation`, `kits_caps`, `kits_cron_runs`, `kits_taxonomy_rename`, `kits_taxonomy_rename_backup` (and `aw_camp_letters_db`, `aw_cl_ref`, `aw_form_raw_db`) although KC writes them | `KC/uninstall.php:60-91` vs `update_option` calls in `KC/includes/` |
| Theme: 47 pattern files, 10 templates, 4 parts (header, footer, newsletter, sidebar), variations `dark, forest, slate` + `colours/ink`; contentSize = wideSize = 1200px | `T/patterns`, `T/templates`, `T/parts`, `T/styles`, `T/theme.json:8-9` |
| No `assets/site/` folder in the theme in this repo; the only `assets/site/` is `KC/assets/site/` (dropins) | `ls` |
| No `register_external_service`, no "Foundry", no `save_post_wp_block`, no Cloudflare code in theme or KC; `packages/shared-php` is consumed by no plugin; 11 of 12 `packages/*` dirs hold 1 file (.gitkeep) | greps; `docs/release/ci-packaging-playground-release.md:16` confirms shared-php unused |
| CI theme job only parses theme.json and runs `build-tokens.py --help`; `ThemeValidationTest.php` is not in any workflow | `.github/workflows/ci-suite.yml:122-126` |
| Only workflows are `ci-suite.yml` and `release.yml`; `tools/ci/` (css_min.py, registry_check.py, component_map.py, theme_rules_check.py) does not exist but is cited by code comments and docs | `.github/workflows/`; `T/inc/assets.php:55`, `T/inc/site-layer.php:64`, `T/assets/css/kit.css:862` |
| Stale AW references in code: `T/assets/css/kits.css:27-30` cites `styles/animal-writes.json` (does not exist); KC default preset name; KC `uninstall.php` header and many `aw_*` options | files cited |

## 1. Per-document table

### 1.1 Root and package docs

| Path | Purpose | Status | Discrepancies (doc evidence vs code evidence) | Depth |
|---|---|---|---|---|
| `KITS_WP_SUITE.md` | Suite overview, tenant profiles, Brand Customizer how-to | Outdated (mostly accurate on Brand Customizer) | `:13` "style variations (Animal Writes, Slate, Forest)" vs `T/styles/` = dark, forest, slate (no animal-writes). `:15` parts "header, footer, announcement, sidebar" vs `T/parts/` = header, footer, newsletter, sidebar. `:36` calls the default "Animal Writes / Neutral Kits" (copied from `brand-customizer-model.php:187`). Preset values `:34-39`, export/import `:61-65`, LiteSpeed purge `:57` match code (`brand-customizer.php:105-147`). Does not mention that brand CSS beats the Site Editor (priority 100) and "Reset styles" does not restore it. | READ |
| `README.md` | Monorepo overview | Outdated | `:33` "Zero Raw Values ... all styling consumes `--kit-*`" vs `kit-tokens.css:32` fallbacks and `styles/*.json` literal hex. `:32` "External Services Registry (`register_external_service`)" vs no such function anywhere. `:47` token sources `tokens.json` and `design-system/tokens/*.json` (two sources, different primary: `#C6D2E0` vs `#ffbe1a`). `:31` per-plugin `*-shell` packages vs empty `packages/*-shell`. | READ |
| `DEPLOYMENT.md` | Vercel/Vite deploy for the React app | Not theme/Core related; Historical for this audit | Describes `build/`, Vercel; no WordPress content. | READ |
| `MERGE_REPORT.md` | 2026-04-19 branch merge log | Historical | Date predates every Kits doc; says `main` is the only local branch; `git branch` shows `kits-suite`, `feat/*`, `agent/*`, `docs/*`. | READ |
| `design-system/README.md`, `phase-status.md`, `docs/{tokens,components,usage-guidelines}.md` | React/Style Dictionary design system | Conflicting (with theme token pipeline) | `docs/tokens.md` "Source of truth: `design-system/tokens/*.json`" (primary `#ffbe1a`, `color.json`) vs theme `tokens/tokens.json` primary `#C6D2E0` and `build-tokens.py`; `README.md:4` "Figma -> GitHub -> Style Dictionary" vs `package.json:66` script is `scripts/build-design-tokens.mjs`. Three of the docs are 5-line stubs. | READ |
| `packages/shared-php/README.md` | PHP SDK | Not-implemented-as-integrated | Roadmap P1.1 says Kits Core consumes `Wugweb\Kits\Tokens\TokenEngine`; no `require`/use in `KC/kits-core.php` or `includes/`. `release doc :16` says "no product consumes it yet". | SKIMMED |

### 1.2 `themes/kits-by-wugweb`

| Path | Purpose | Status | Discrepancies | Depth |
|---|---|---|---|---|
| `T/PENDING.md` | Theme task log | Mostly Current; two items inaccurate | `:19` "Header toggle added to `parts/header.html`" vs toggle is injected by filter `inc/blocks.php:268-286`; `parts/header.html` has no toggle. `:37-38` "Tenant Asset Decoupling ... relocate `assets/site/`" vs theme has no `assets/site/` and `site-layer.php:15-16` says the dist build leaves it out (mechanism exists, task is about a folder that is absent here). `:24` correction note on 1200px matches `theme.json:8-9`. `:30-35` the reference theme record, 29 checks, 47 patterns match code and a live run. `:21` "Day/Night CSS variables" ok (`kits.css:128-171`). Does not say the 29-check suite is outside CI. | READ |
| `T/readme.txt` | wp.org-style readme | Outdated in places | `:61` "Needs WordPress 6.6 or later" vs header `Requires at least: 7.1` (`:4`, `style.css`, `kits-core.php`). `:36` "bundled variations (the default, Slate or Forest)" omits Dark (`styles/dark.json`). `:66` 2.0.0 "Inter Tight bundled" vs Inter (`theme.json:120`, `:75`). `:18` says `kit.css` only adds what theme.json cannot express; true in spirit. `:22` "47 patterns" matches. `:26` block-style list not fully checked. `:58` "style variations ... with the Inter font" ok. | READ |
| `T/style.css` header | Theme header | Current | Version 2.2.0 = readme Stable tag; Requires 7.1/PHP 8.0 consistent with readme header. No `Update URI` in the repo header (added by `tools/build/build-dist.py:144-146` for commercial track), while readme `:61` describes it as present; fine for the built edition. | READ |
| `T/tests/ThemeValidationTest.php` (doc-like header) | Test suite | Current but ungated | Docblock lists 7 areas; 29 `it()` calls; passes. Not wired into `.github/workflows/ci-suite.yml` (`:114-126`). | READ |
| `docs/theme/pattern-library-integration.md (planned rename)` | Record of the reference theme-derived patterns and validation | **Current** (best-aligned doc) | Verified: 47 patterns, `customTemplates` blank/no-title (`theme.json:803+`), `sidebar` area added at priority 20 only if missing (`inc/blocks.php:47`) and KC registers it (`landmarks.php:71`), contrast fixes, 29 checks. Minor: `:135` ZIP "106 files" and `:129` ratios not re-measured; `:140` says ZIP ships `tokens/` while marketplace plan Phase 5 says token sources are stripped (see 4.7). It does not mention that `kits.css:27-30` still cites a non-existent `styles/animal-writes.json`. | READ |
| `docs/theme/kits-theme-admin-ui-spec.md` | Kits admin UI spec | **Duplicate** (byte-identical to `docs/design-system/admin-ui-spec.md`, `diff` empty) and Outdated | `:14` menu "Appearance -> Kits" vs `add_menu_page('Kits' ... '58.1')` top-level (`KC/includes/admin-home.php:26`). Heavy Animal Writes content (26 mentions): "Scope: ... screens Animal Writes adds". `kits_admin_tabs` filter exists (`admin-menu-model.php:111`). | READ (head, sections A/B) / SKIMMED (rest) |
| `docs/design-system/design-system.md` | "Animal Writes design system" | Historical + Conflicting | Title and `:23` "Wugweb yellow `#ffbe1a` is the only accent" vs theme `primary #C6D2E0` (`theme.json:19`); `:6` cites `plugins/animal-writes-core/theme/tokens/` (absent); links `item-template.md`, `listing-template.md` (absent). Self-labelled history at `:3`. | READ (head) |
| `docs/design-system/buttons.md` | Button variants | Partly Outdated | `:3` "Brand = yellow, ink text"; theme default accent is `#C6D2E0`, yellow only via brand preset or AW. References `--kit-btn-*` tokens (exist in tokens.json). `.aw-camp--*` campaign colours are tenant-only. | SKIMMED |
| `docs/design-system/card-sizes.md` | Card limits | Outdated | `:3` "set in `plugins/animal-writes-core/theme/assets/css/aw.css`" (absent); `kits_card_markup()` in "the Kits functions.php" - `T/functions.php` is 20 lines and the function exists nowhere; `settings.custom.kits.card.ratio.*` not in `theme.json` (`custom.kits.card` has only padding and gap, `:365-369`). `--kit-card-min: 17rem` matches `kit-tokens.css:138`. | READ (head) |
| `docs/design-system/component-map.md` | Generated component table | Historical | "Generated by `tools/ci/component_map.py`" (script absent); `Used in` lists AW files (`campaign-lab.css`, `aw.css`, `hub-blocks.php`). Registry has 64 items in `T/kits-registry.json`, docs say 53 + 99 / 172 (only true with the AW site layer). | SKIMMED |
| `docs/design-system/blocks-spec.md` | Plan for 7 Kits Core blocks | NIF | `:11-19` `kits/letter, countdown, metric, collection-filter, share, sticky-cta, sponsored` - none registered (only `kits/hero`, `KC/includes/blocks.php:32`). `:21` "no Animal Writes names" rule but 101 AW mentions. | READ (head) / SKIMMED |
| `docs/design-system/ui-spacing-audit.md` | Spacing audit of the live AW site | Historical | Audits `animalwrites.in`; normalisation rules "specified", not implemented in `T` (no `+ .is-style-kits-section` rule in theme). Also summarised in pending.md as "completed". | READ (head) |
| `docs/design-system/admin-ui-spec.md` | Same as theme copy | **Duplicate** | See above. | - |
| `docs/marketplace/theme-marketplace-plan.md` | wp.org/ThemeForest prep plan | Historical + Conflicting | `:73` "Base-accent default `theme.json primary #FFBE1A` still open" vs `:101` "neutralised ... DONE" vs current `#C6D2E0`. `:5` branch `claude/theme-marketplace-prep` local; `:20` Phase 1 targets `kits.css` AW rules and `aw.css` (absent). `:34` "`styles/animal-writes.json` ... relocated" but `kits.css:29-30` still cites it. `:11` "No `Update URI`" (theme repo header true) vs `kits-core.php:12` has one. `:99` `tools/build-dist.py` vs actual `tools/build/build-dist.py`. Treats Animal Writes as the tenant, not architectural authority. | READ |
| `docs/release/ci-packaging-playground-release.md` | CI/packaging record | **Current** | Matches `ci-suite.yml`, `build-dist.py`, `verify-dist.py`. Gap: lists a "theme" gate (`:7`) but that gate only JSON-parses and runs `--help`. | READ |

### 1.3 `plugins/kits-core`

| Path | Purpose | Status | Discrepancies | Depth |
|---|---|---|---|---|
| `KC/PENDING.md` | Kits Core roadmap | **Conflicting / NIF** (several lines describe behaviour that does not exist) | `:6` and `:22-23` "4-layer ... `wp_theme_json_data_theme`", cache `kits_brand_theme_data`: no such filter or transient (known; `brand-customizer.php:30-62` is wp_head CSS). `:7` "Onboarding Wizard" ok. `:9` "Cloudflare Worker relay & Foundry token sync": no code. `:10` "Custom blocks (`hero`, `theme-options`)": only `kits/hero`. `:26-28` `save_post_wp_block` relay: absent (correctly under open tasks). `:31` 4-step wizard (Identity, Typography, Palette, Telemetry) vs 3 steps (Brand Identity & Logo, Style Variation, Starter Patterns) at `onboarding-wizard.php:139,170,195`; no Cloudflare key step, no AJAX/REST saves (`admin_init` POST handler only, `:55-82`). `:36-37` "sanitized ... capability `manage_options` / `manage_kits`": raw save, `manage_options` only (`header-footer-scripts.php:63-69`). `:40` "raise limit to 8 MB": hint text already says 8 MB (`forms/fluentforms.php:420`); enforcement not verified. `:42` multi-step summary banner: `assets/js/forms.js:93` `summary()` already exists; whether it links to fields was not verified. `:18-19` tests wrapped with `file_exists` verified (`admin-layer-tests.php:207`) and CI loop at `ci-suite.yml:173` verified. | READ |
| `KC/readme.txt` | wp.org readme | Outdated (incomplete) | `:22` menu "Home, Theme Options, Settings, Tools and Help" but code also adds Brand Customizer (`kits-brand`), Setup Wizard (`kits-onboarding`), Scripts & Pixels (`kits-scripts`), and Appearance > Brand Tokens (`brand-customizer.php:75-92`, `onboarding-wizard.php:30`, `header-footer-scripts.php:27`): none described. `:27` uninstall says it removes "Kits Core's own options" - omits brand tokens, scripts, wizard option, `kits_caps` etc. (see section 0). External-services section does not cover the `kits_update_url` check beyond one line; fine. Stable tag 1.0.0 = header. | READ |
| `KC/kits-core.php` header | Plugin header | Current | `Update URI` present (`:12`), contradicts the "no Update URI" wp.org rule in 4.5. `Description` omits Brand Customizer, Wizard, Scripts. | READ |
| `KC/uninstall.php` docblock | Uninstall contract | Outdated | Docblock `:6-40` lists exactly what is deleted and claims completeness; misses the options in section 0. It is correct that `kits_brand_tokens` etc. are untouched, but the doc calls the list "exactly this" while plugin writes more. Many `aw_*` names and "Animal Writes Core" provenance comments. | READ |
| `docs/plugins/kits-plugin-ui-spec.md` | Shell parts for plugin screens | Outdated | `:3` links `docs/admin-ui-spec.md` (moved); `:14` "one yellow accent (#FFC300)" vs shell CSS `#FFC300` (matches `src/shell/shell.css`) but vs `#f59e0b` (delivery arch) and `#FFBE1A` (brand). Part names (`AppShell`, `Tile`...) match `src/shell/*.js` by file list only. | READ (head) / SKIMMED |
| `docs/plugins/plugin-map.md` | File-by-file plugin map | Outdated + AW-heavy (51 AW mentions) | `kits-core` table (`:271-313`) names `library-documents.php`, `media.php` (not present in KC; pending.md `:236` says moved to theme site layer), has no row for `brand-customizer*.php`, `onboarding-wizard.php`, `header-footer-scripts.php`, `bindings.php`, `blocks.php`, `joined-css.php`, `kits-caps.php`, `page-options.php`, `theme-options.php`, `settings-transfer.php`, `presets*.php`, `theme-updates.php`, `fonts.php`, `site-parts.php`. `:3` load chain "animal-writes-core ... loads Kits Core" vs the repo where Kits Core loads itself (`kits-core.php:22-25`). Update URI "stays on our plugins" (`:13`) conflicts with 4.5. | READ (kits-core section) |
| `docs/plugins/kits-control-map.md` | Which WP control holds each Kits part | Historical / Outdated | `:9` registries `plugins/animal-writes-core/theme/kits-registry.json` (absent), "53 + 99 = 152" vs 64 items now; `:11` "Animal Writes child theme goes away" (done differently: site layer). `:137` layout row ok in concept. 109 AW mentions. | SKIMMED |
| `docs/plugins/plugin-ui-gaps-audit.md` | Classic vs new screens (12 Nov) | Historical | "Code read at live `d9163bf7`"; not Kits Core specific. | SKIMMED |
| `docs/plugins/keys-per-plugin.md` | Service keys policy | Historical (policy Current) | Refers to Animal Writes Core `aw_keys` vault (retired). Policy "each plugin owns its keys" is repeated in synthesis `:251`; KC code has no vault. | SKIMMED |
| `docs/plugins/content-blocks-feasibility.md` | Plan to move AW content parts to Kits Core | Historical | Written to retire Animal Writes Core; 39 AW mentions; relies on `blocks-spec.md` (NIF blocks). Bindings part is implemented (`bindings.php`). | SKIMMED |

### 1.4 Architecture and tracking docs (Kits Core and theme claims)

| Path | Purpose | Status | Discrepancies | Depth |
|---|---|---|---|---|
| `docs/pending.md` (1267 lines) | Master task log | Historical, Conflicting in parts, Animal Writes-dominated (110 mentions) | `:11` links to `docs/animalwrites-operations-and-content-pending.md` and `:12` `docs/animalwrites-monorepo-migration-inventory.md` (file is at `docs/architecture/`; the first is absent); ~50 other `docs/*.md` paths do not resolve after the move into subfolders. `:171-176` A/B engine `plugins/kits-core/includes/ab-testing.php` "built, merged and live" vs `:158-162` "Reverted ... A/B testing engine"; file does not exist. `:224` "Requires at least 6.6" vs 7.1. `:30-33` B2 "2 MB to 8 MB" see KC PENDING. `:144-156` Brand Customizer claims match code except "Appearance > Brand Tokens" ok. `:9` and `:17` repeat the 4-layer claim as scope. Treats "Animal Writes WordPress" session as the owner of theme work. | READ (lines 1-216, 218-290) / SKIMMED (rest) |
| `docs/architecture/monorepo-consolidated-roadmap.md` | P0-P4 roadmap | Conflicting / NIF | `:244-245` states in present tense that "Kits Core registers a filter callback on `wp_theme_json_data_theme` in `brand-customizer.php` ... transient `kits_brand_theme_data`" while `:288-290` lists the same as a to-do (P1.2). Code: neither. `:74` diagram "Brand Customizer, Layer 3 theme.json, Admin Shell". P0 items (`:260-270`) verified. P1.1 shared-php integration not done. | READ (`:215-300`) / SKIMMED |
| `docs/architecture/wugweb-master-architecture-synthesis.md` | "Canonical living blueprint" | Conflicting / NIF | See 3 and 4. `:105` Kits Core injects into Layer 3 (no). `:133-137` Cloudflare relay (no). `:184-190` four-step wizard Entitlement/Preset/Brand/Hub (code: 3 steps, different). `:196` "No `Update URI`" (KC header has it). `:196-199` "No legacy `aw_`" (KC `aw_*` options). `:89` `--kit-color-accent: var(--wp--preset--color--accent, #f59e0b)` vs `kit-tokens.css:32` `primary, #C6D2E0`. `:171` localStorage `kit_theme_mode` + Interactivity API vs `kit-theme` + plain listener. `:206-218` `manage_kits` ok; others not verified. `:222-250` `register_external_service()` absent. | READ (`:85-250`) / SKIMMED |
| `docs/architecture/wugweb_modular_master_blueprint_audit.md` | Earlier synthesis/audit | Conflicting + Historical | `:106-125` same Layer-3 injection with option `tenant_design_tokens` (code: `kits_brand_tokens`). `:279` "theme 100% declarative ... all PHP hooks in the plugin" vs `T/inc/*.php` (5 files, `site-layer.php` hooks `wp_theme_json_data_theme`) and theme PENDING calling the theme "declarative" while it ships PHP. `:17` `packages/worker-relay`, `apps/wugweb-kits`, `apps/wugweb-core`: none exist. `:280` locked slugs `base, surface, contrast, muted, primary, accent, border` vs theme slugs `primary, primary-dark, secondary, foreground, text-muted, border, canvas, surface, background, ...`. | READ (`:100-125,260-282`) / SKIMMED |
| `docs/architecture/monorepo-delivery-architecture.md` and `wugweb-monorepo-delivery-architecture.md` | Repo/packaging/token architecture | **Duplicate** (byte-identical, 588 lines) and NIF | Tree `:25-135` lists `ci.yml, lint.yml, test.yml, build-theme.yml, build-plugins.yml, plugin-check.yml, playground-preview.yml` (absent), `composer.json` in kits-core (absent), `docs/decisions/` (only `.gitkeep`), `packages/design-tokens` and shells (empty). `:136` accent `#f59e0b`. `:182-198` 11.3 steps 2-5 (Token Customizer saves to `kits_brand_tokens` ok; `wp_theme_json_data_theme` no). `:187-190` token keys `blur.md, stroke.default, radius.md` not in `theme.json settings.custom` (`:358-375`). `:7` Native vs Core table `:126-132` "Theme Hub, Page Options, Design-system index, Settings transfer" matches KC. | READ (`:1-135,240-345`) |
| `docs/architecture/multi-tenant-setup-guide.md` | Tenant how-to | Outdated | `:5` branch `kits-suite` (still exists but current branch differs); `:6` "Live & Documented". `:26-31` style variations "Default, Animal Writes, Slate, Forest" vs dark/forest/slate. `:39-51` preset values match `brand-customizer-model.php:210-300`. `:100-105` blocks `kits-core/countdown`, `kits-core/category-hub`, `directoryweb/people` (exists), `directoryweb/search` (not registered under that name), `sourceweb/attribution` (absent), `mailweb/newsletter` (exists). `:108` `animal-writes/*` fallbacks in `hub-blocks.php` (absent here). | READ |
| `docs/architecture/block-theme-and-plugins-plan.md` | FSE plan from an AW live audit | Historical, **authority = Animal Writes site** | `:12-33` live AW data (7,738 listings, AW templates/blocks). `:113` "Ensure the theme contains zero hardcoded tenant terms (`Animal Writes`, `aw_`)" - theme still has comments `kits.css:27-30`. `:93` `assets/site/parts/newsletter.html` absent. | READ |
| `docs/architecture/kits-audit-architecture-deliverables.md` | 20 Nov audit + IA proposal | Mostly Current, partly Historical | `:195` contentSize 1200/wideSize 1200 matches. `:296` `840px` is an admin form column, not theme width. `:379` 74/74 matches. `:360-363` `.kits-layout-split` present (`more.css`, `admin-menu.php`). `:322` "172 entries" true only with AW site registry (theme registry = 64). `:358` Co-author trailer "Wugweb" fine. | READ (`:195,296,354-388`) / SKIMMED |
| `docs/architecture/admin-ia-inventory.md` | wp-admin IA on live AW | Historical | Live AW screens; refs `docs/plugin-map.md` (moved). | SKIMMED |
| `docs/architecture/animalwrites-monorepo-migration-inventory.md` | AW to monorepo inventory | Historical, by definition Animal Writes | `:12` "kits-core ... Foundry sync, token injection, telemetry" vs no Foundry code and no `wp_theme_json_data_theme` in KC. `:112` "relocate ... `styles/animal-writes.json` ... via `kits-core` tenant asset loader (`wp_theme_json_data_theme`)": KC has no loader; the theme's `site-layer.php` does. | READ (head, `:105-116`) |

## 2. (1) Documented but not implemented

| Feature | Documented in | Code reality |
|---|---|---|
| Kits Core merges brand tokens into `wp_theme_json_data_theme` so "Reset styles" restores tenant baseline; transient `kits_brand_theme_data` | `KC/PENDING.md:6,21-23`; consolidated roadmap `:244-247`; synthesis `:105,109`; delivery arch `:11.3`; blueprint audit `:106`; migration inventory `:112` | None. Brand CSS is injected on `wp_head` 100 (`brand-customizer.php:30-39`). |
| Cloudflare Worker relay, `save_post_wp_block` capture, Foundry token sync, Token Foundry | `KC/PENDING.md:9,25-28`; synthesis `:113-137`; blueprint audit `:203-205`; delivery arch `:161` | No code. |
| 4-step onboarding (Identity, Typography, Palette, Telemetry) with worker key check and AJAX/REST saves; or (Entitlement, Preset, Brand, Hub) | `KC/PENDING.md:31-33`; synthesis `:184-190`; delivery arch `:527` | 3 steps, one POST; the variation choice is saved to an option nothing reads, so the step has no effect. |
| Scripts Manager sanitising / `manage_kits` gate | `KC/PENDING.md:36-37` | Raw, `manage_options` only. |
| Kits Core blocks `letter, countdown, metric, collection-filter, share, sticky-cta, sponsored`, `kits-core/countdown`, `category-hub` | `docs/design-system/blocks-spec.md:11-19`; multi-tenant guide `:103-104` | Only `kits/hero`. |
| `register_external_service()` / `remote_request()` registry with auto-disclosure | README `:32`; synthesis `:222-250`; pending.md `:141` | None. |
| Interactivity-API theme toggle with key `kit_theme_mode` | synthesis `:171` | Plain `kit.js` listener, key `kit-theme`. |
| A/B testing engine `includes/ab-testing.php` | `docs/pending.md:175` | File absent; same doc `:160` says it was reverted. |
| `kits_card_markup()`, card ratio tokens `settings.custom.kits.card.ratio.*` | `docs/design-system/card-sizes.md:8,13` | Not in theme. |
| Theme-level locked tokens `blur.md`, `stroke.default`, `radius.md`, `shadow.card` in `settings.custom` | delivery arch `:11.1-11.3`; synthesis `:96` | `settings.custom` has only line-height and kits.card/layout (`theme.json:358-375`). |
| Shared PHP SDK consumed by Kits Core | roadmap P1.1 | Unused. |
| Workflows ci/lint/test/build-theme/plugin-check/playground-preview; `.github/CODEOWNERS` content; `docs/decisions` ADRs; `tools/ci/*` scripts | delivery arch `:25-135`; pending, marketplace plan | Only `ci-suite.yml`, `release.yml`; `docs/decisions/` empty; `tools/ci` absent. |
| Theme Validation in CI | implied by release doc `:7` "theme" gate | CI does not run `ThemeValidationTest.php`. |

## 3. (2) Implemented but not documented (or documented wrongly)

| Implementation | Evidence | Where docs are silent |
|---|---|---|
| Theme toggle injected through `render_block_core/navigation` with filter `kits_header_theme_toggle_enabled`; also a `theme-toggle` pattern | `T/inc/blocks.php:268-286`; `patterns/theme-toggle.php` | Theme PENDING says toggle is in `parts/header.html`; readme and the reference theme record do not mention it. |
| `Dark` style variation | `T/styles/dark.json` | Theme readme FAQ lists only Slate and Forest; wizard omits it. |
| Brand Customizer, Setup Wizard, Scripts & Pixels, Appearance > Brand Tokens | `KC/includes/brand-customizer.php`, `onboarding-wizard.php`, `header-footer-scripts.php` | `KC/readme.txt`, `plugin-map.md`, plugin header. |
| `kits-caps` (`manage_kits`) with option `kits_caps` | `KC/includes/kits-caps.php` | Not removed by uninstall. |
| `theme-updates.php` (theme updates via Update URI) | `KC/includes/theme-updates.php` | Doc example JSON `requires 6.6, php 7.4` (stale vs 7.1/8.0). |
| Site layer (`kits_site_on`, merge of `assets/site/theme.json`, templates, parts, patterns) | `T/inc/site-layer.php` | Only named in migration docs; theme readme says site features belong in plugins and does not mention it; theme PENDING calls the theme "declarative". |
| Brand preset exports bridge `--wp--preset--*` for colour and radius only; layout/typography/space tokens have no preset bridge | `brand-customizer-model.php:27-146` (`wp_preset` only on colours and radii) | KITS_WP_SUITE `:55` says variables bridge to `--wp--preset--*` generally. |
| Brand CSS also printed in block editor via `admin_head` (not `enqueue_block_editor_assets`/iframe-safe) | `brand-customizer.php:44-62` | Docs say "both reflect changes"; untested in the Site Editor iframe. |
| Pattern theme registration `header-default`/`footer-*` variants, `kits-reverse`, `kits-plain`, `kits-outline` | the reference theme record | Theme readme documents them; fine. |

## 4. (3) Duplicate or overlapping documents

| Group | Documents | Note |
|---|---|---|
| Byte-identical | `docs/architecture/monorepo-delivery-architecture.md` = `docs/architecture/wugweb-monorepo-delivery-architecture.md` (588 lines, `diff` empty) | Keep one. |
| Byte-identical | `docs/theme/kits-theme-admin-ui-spec.md` = `docs/design-system/admin-ui-spec.md` (531 lines, `diff` empty) | Keep one; several docs link `docs/admin-ui-spec.md` (neither). |
| Overlapping (architecture synthesis x3) | `wugweb-master-architecture-synthesis.md`, `wugweb_modular_master_blueprint_audit.md`, `monorepo-consolidated-roadmap.md`, `monorepo-delivery-architecture.md` | All restate the 4-layer cascade, Foundry flywheel, wizard, governance with different details (see 5). |
| Overlapping (tenant setup) | `KITS_WP_SUITE.md`, `docs/architecture/multi-tenant-setup-guide.md`, `docs/pending.md:144-156` | Same Brand Customizer content three times. |
| Overlapping (spacing) | `docs/design-system/ui-spacing-audit.md`, `docs/pending.md:164-169` | |
| Overlapping (roadmaps) | `T/PENDING.md`, `KC/PENDING.md`, `docs/pending.md` (which says it partitions into the two PENDING files at `:5-27` yet still holds the same tasks at `:30-33`) | |
| Overlapping (tokens) | `design-system/docs/tokens.md`, `T/readme.txt` "One source", `README.md:47` | Three statements of "source of truth". |

## 5. (4) Conflicting architectural decisions (quoted)

1. **Where tenant tokens live in the theme.json cascade.**
   - Roadmap `:245`: "Kits Core registers a filter callback on `wp_theme_json_data_theme` in `plugins/kits-core/includes/brand-customizer.php`."
   - Same file `:290`: "Hook `wp_theme_json_data_theme` filter in Kits Core" as a future task.
   - Code (`brand-customizer.php:30-39`): CSS echoed at `wp_head` priority 100. Consequence: brand CSS overrides Styles at runtime and "Reset styles" does not restore it.
   - Also synthesis `:306`: "REJECTED: Directly update `wp_global_styles`"; the accepted route is not built.
2. **Theme purity.** Blueprint audit `:279`: "Keep ... 100% declarative ... all PHP hooks (`wp_theme_json_data_theme` ...) ... inside `apps/wugweb-core`." vs `T/inc/site-layer.php:91` hooks it inside the theme; Theme PENDING `:5` "The declarative FSE block theme"; marketplace plan "no admin UI in the theme".
3. **Accent colour.** Delivery arch `:136` and synthesis `:89`: `#f59e0b`. `design-system.md:23` and brand preset: `#ffbe1a` / `#FFBE1A`. `kits-plugin-ui-spec.md:12`: `#FFC300`. Theme: `primary #C6D2E0` (`theme.json:19`). Marketplace plan `:73` says the `#FFBE1A` default is "still open", `:101` says "neutralised".
4. **Token source of truth.** `design-system/docs/tokens.md`: "Source of truth: `design-system/tokens/*.json`" vs `T/readme.txt:18`: "`tokens/tokens.json` is the source" vs README `:47` both.
5. **Dark mode implementation.** Synthesis `:171`: "Header button + Interactivity API", key `kit_theme_mode` vs Theme PENDING `:19` "zero-dependency listener in `assets/js/kit.js`", code key `kit-theme`.
6. **Onboarding wizard shape.** Synthesis `:184`: "Four-Step ... Entitlement & Connection ... Theme Hub Launch"; KC PENDING `:31`: "4-step ... Site Identity -> Typography Preset -> Color Palette -> Telemetry Activation"; code: three steps.
7. **Update URI.** Synthesis `:196`: "No `Update URI`: Removed from all public .org plugin and theme headers." vs plugin-map `:13` "the `Update URI` header stays on our plugins (owner, 12 Nov 2026)" and `kits-core.php:12`.
8. **Where the admin menu lives.** `admin-ui-spec` `:14`: "one item, Appearance -> Kits" vs code top-level "Kits" at position 58.1 (`admin-home.php:26`).
9. **Who owns Animal Writes-named code.** blocks-spec `:21` / block-theme plan `:113`: "Kits Core and the Kits theme get no Animal Writes names" vs code: preset "Default (Animal Writes / Neutral Kits)" (`brand-customizer-model.php:187`), `kits.css:27-30`, many `aw_*` options and comments in KC; synthesis `:199` "No legacy `aw_`" for new code.
10. **Minimum WordPress.** Theme/KC headers and readmes `Requires at least: 7.1` vs theme readme changelog "Needs WordPress 6.6 or later" and pending.md `:224` "Requires at least 6.6".
11. **Token packaging.** Theme readme `:18` (child theme can rebuild tokens; the reference theme record `:146` "ZIP ships `tokens/` and `tools/build-tokens.py`") vs marketplace plan `:99` "stripping ... token sources".

## 6. Documents that treat Animal Writes as an architectural authority (flag)

| Doc | Evidence |
|---|---|
| `docs/architecture/block-theme-and-plugins-plan.md` | Whole plan derived from audit of the live AW site (`:12-33`); targets AW templates and blocks. |
| `docs/design-system/design-system.md` | Titled "Animal Writes design system"; accent and tokens defined from AW. |
| `docs/design-system/component-map.md`, `blocks-spec.md`, `card-sizes.md`, `ui-spacing-audit.md` | Reference AW files and the live AW site as the spec. |
| `docs/plugins/plugin-map.md`, `kits-control-map.md`, `content-blocks-feasibility.md`, `keys-per-plugin.md`, `plugin-ui-gaps-audit.md` | AW Core as source; AW child theme assumptions. |
| `docs/marketplace/theme-marketplace-plan.md` | "Live Animal Writes look" as the parity gate. |
| `docs/architecture/multi-tenant-setup-guide.md`, `KITS_WP_SUITE.md` | "Default (Animal Writes / Neutral)" profile is the default tenant. |
| `docs/architecture/animalwrites-monorepo-migration-inventory.md`, `docs/pending.md` | AW is the primary subject; pending.md names AW sessions as owners. |
| Code mirroring this | `KC/includes/brand-customizer-model.php:187`; `T/assets/css/kits.css:27-30`. |

## 7. (5) Decisions needing owner confirmation

1. Is the Brand Customizer meant to stay a CSS-override layer (current), or become a real `wp_theme_json_data_theme` Layer 3 (documented in 6 docs)? This decides whether "Reset styles" restores brand values and whether the Site Editor can edit them. Either fix the code or rewrite those docs.
2. Which default accent is canonical: theme `#C6D2E0`, Brand Customizer `#FFBE1A`, shell `#FFC300`, docs `#f59e0b`? Brand Customizer defaults currently recolour a fresh install once saved.
3. Onboarding wizard: keep 3 steps and make the variation step real (it currently saves an option nobody reads; swatches do not match `styles/*.json`; `ink` is not a variation; `dark` missing), or build the documented 4-step flow, or delete the claim.
4. Is Cloudflare relay / Foundry / `save_post_wp_block` still planned? If not, remove from `KC/PENDING.md:9,25-28` and the three architecture docs.
5. Keep `Update URI` on `kits-core.php` (plugin-map decision) or remove it (synthesis decision)? Affects wp.org readiness.
6. The 7 documented custom blocks and `kits-core/countdown`, `category-hub`: build, or drop from `blocks-spec.md`/tenant guide?
7. Uninstall: should brand tokens, scripts options, wizard option, `kits_caps`, `kits_cron_runs`, `kits_taxonomy_rename*` be deleted when the flag is ticked (they are Kits Core's)? Which `aw_*` options are shared and must stay?
8. Scripts & Pixels: sanitise or keep raw (super-admin trust); capability `manage_options` or `manage_kits`.
9. Should `ThemeValidationTest.php` (29 checks) be added to `ci-suite.yml`? Today CI would not catch the contrast regressions the the reference theme record says are tested.
10. Which of the duplicate docs to keep (two byte-identical pairs) and whether to archive the Animal Writes-authored docs under `docs/archive/` with a banner, since many claim "live" states.
11. Theme PENDING item 4 "Tenant Asset Decoupling": still open or done, given `assets/site/` is already absent and `site-layer.php` is the generic loader?
12. Theme style variation set: add `Dark` to readme FAQ and wizard? Confirm that `colours/ink` is a colour set (not a variation) in all docs.
13. Dark-mode: is the Interactivity-API toggle in the synthesis still the target, or is the plain `kit.js` toggle final (key `kit-theme`)?
14. Min WP version wording (6.6 vs 7.1) in readme changelog and `theme-updates.php` example.
15. Dead references: `tools/ci/*.py`, `plugins/animal-writes-core/...`, `docs/*.md` paths that moved; fix or remove.
