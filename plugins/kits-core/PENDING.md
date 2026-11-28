# Kits Core: Pending & Roadmap

## Status, 27 Nov 2026 (Kits Core 1.4.1)

Only what was run is marked done. Test runs: every `plugins/kits-core/tests/*-tests.php`, every `sites/animalwrites/*/tests/*.php`, `php -l` on each edited PHP file, and `tools/validate/check-versions.py`, `check-visible-brand.py`, `check-held-code.py`, all passing on 27 Nov 2026. No WordPress or MySQL was available: the tests use stand-ins for WordPress and, for the ALTCHA claim and the uninstall backup, an in-memory SQLite database that behaves like MySQL for the statements used. Nothing here was run on a live WordPress.

### Done in 1.4.1 (with tests)

- Hardening: the form-key endpoint (nonce only for a real form), ALTCHA single use made atomic, the preview device link token out of the query string, the settings download link (single-use token instead of the REST nonce), theme update package integrity (https + SHA-256, verified before install; still off until an update address is set). `tests/hardening-tests.php`.
- Filters `kits_features` and `kits_settings_fields`, the `kits/v1/site-check` route (administrators, read only), the `kits/socials` block, the Scripts Manager gate test. `tests/surface-tests.php`, `tests/block-render-tests.php`.
- Tests that did not exist: wizard Global Styles backup and Restore (`wizard-backup-tests.php`), uninstall (`uninstall-tests.php`), brand Reset and Clear brand (`brand-reset-tests.php`), the registry updater's SHA-256 check (`registry-updates-tests.php`), the block renderers (`block-render-tests.php`).
- `tests/admin-layer-tests.php` no longer stops halfway. The Animal Writes value assertions were deleted because their source (`themes/kits-by-wugweb/assets/site/admin.php`, removed in 238fe14) is not in this repository; the other half of the file now runs.
- The Library "Dated" and campaign "Metrics" edit fields moved to `sites/animalwrites/kits-core/includes/edit-fields.php` (test: `sites/animalwrites/kits-core/tests/edit-fields-tests.php`). The plugin has no `aw_legal` string left; `tests/neutral-core-tests.php` enforces it.
- Coding standard: WordPress-Extra reports 0 errors (241 of 306 fixed by `phpcbf`; the rest by hand, most of them the fixed DOM property names in `admin-shell-parts.php`, handled with one documented `phpcs:disable`). Formatting only.
- `languages/kits-core.pot` regenerated (609 strings). `build/blocks/` rebuilt; `build/shell/` rebuilt from `src/shell/` and identical to the committed bundle, so the shell Settings screen is in step with its source.

### Still open

- Favicon host allow-list: no code in Kits Core fetches favicons. The favicon code is in other plugins (`plugins/sourceweb/includes/enhance/attribution.php` and `sources/source-icons.php`, `plugins/directoryweb/includes/data-sources.php`, `plugins/rankweb/includes/media-autofill.php`, `plugins/insightweb/includes/search-insights/referrer-icons.php`); an allow-list there is that plugin's change, not made here.
- The settings download's success path (the JSON going out) is not unit tested because the handler ends with `exit`; its refusals and the single-use token are tested. Same for the successful preview device registration cookie: tested up to the redirect, with `setcookie()` inside an output buffer.
- Not run on a live WordPress: nonce endpoint, ALTCHA claim on MySQL, REST route, block rendering in the editor, and the Socials block's editor settings (built, not opened in a browser).
- Coding standard (28 Nov 2026, ruleset in `phpcs.xml.dist`: WordPress-Extra and WordPress-Docs): 0 errors on both; 16 WordPress-Extra warnings remain, on purpose: parameter names that are reserved words (`$class`, `$list`, `$new`, `$parent`, `$match` in `preview.php`, `demo.php`, `primitives.php`, `slugs.php`, `presets-scf.php`, `admin-fold-model.php`, `media-webp.php`, `admin-layer/*`), because renaming them touches function bodies and named-argument callers in other plugins; and 3 unused parameters in `forms/fluentforms.php`, which are fixed hook callback signatures. Before: 4 errors and 609 warnings (Extra), 335 errors (Docs). The generated files `more-products.php` and `plugin-info.php` are clean (their templates are `tools/build/gen-more-page.py` and `tools/build/gen-plugin-info.py`).
- Translations beyond the .pot (no `.po` or `.mo` files exist).
- Not tested: form copy (`wp_aw_form_raw`, now the site layer's), the one-time carry-over (the site layer's, tested in `sites/animalwrites/kits-core/tests/site-layer-tests.php`).
- Visible skips that remain on purpose: `tests/content-bindings-tests.php` prints `SKIP` for the Animal Writes content files that are not in this checkout; `tests/brand-customizer-tests.php` prints a skip line only when the theme's `theme.json` is missing.
- Wording corrections to old notes: 1.3.3 says the carry-over turns on 'four' options (it was five); it says five tests 'print a check count' (three did not); 'More from Wugweb is the only place products promote each other' (a Plugins-screen 'More' link remains); there is no 1.3.1 entry (1.3.1 was never tagged).

### Site layer (1.4.0 and 1.4.1)

- Done: everything that only made sense for Animal Writes is in `sites/animalwrites/kits-core/` (see CHANGELOG 1.4.0 and 1.4.1). The plugin keeps neutral defaults and filters; `tests/neutral-core-tests.php` guards it.
- Open, owner: deploy the site layer (`sites/animalwrites/kits-core/`, as a must-use plugin, README there) before or with Kits Core. Kits Core alone leaves the site without campaign letters, volunteer and report forms, thumbnails, error pages and the old `aw_` names. The layer's `edit-fields.php` loads only with Kits Core 1.4.1 or later; with 1.4.0 the plugin still carries those fields itself. Not tested on a live WordPress: the load order was checked with stub tests only.
- Open, owner: the live `wp-content/php-error.php` and `maintenance.php` keep the marker `Animal Writes error page`; the site layer keeps it through `kits_error_page_marker`. Change both together if the marker is ever changed.
- Open: `KITS_FF_DATES` still lists the three `l_awbi_*` claim field names (stored in existing Fluent Forms forms; DirectoryWeb reads the constant). Make it a filter in DirectoryWeb first, then here.
- Open, owner: Animal Writes' values for the admin layer (menu order, labels, retired shortcodes, edit-screen map, Overview) were in the theme's removed `assets/site/admin.php` and are not in this repository; if the live site still needs them they must come from the Animal Writes repository or be added to the site layer, with tests.
- `tools/validate/visible-brand-allow.txt` is empty (the old entries are gone).

## Active Scope & Responsibilities
The foundational companion plugin owns:
- Multi-tenant Brand Customizer (`Appearance > Brand Tokens` / `admin.php?page=kits-brand`).
- 4-Layer `theme.json` cascade baseline injector (`wp_theme_json_data_theme`).
- Onboarding Wizard (`admin.php?page=kits-onboarding`).
- Scripts Manager (safe header/footer tracking script injection).
- Cloudflare Worker relay integration & Foundry token sync.
- Custom blocks (`hero`, `theme-options`).
- Action list shell part for admin buttons.

---

## Open Tasks & Enhancements

0. **Standalone Test Hardening & CI Integration (23 Nov 2026)**:
   - ✅ Wrapped external site-layer `admin.php` require in `tests/admin-layer-tests.php` with `file_exists()` guard to ensure tests execute cleanly in decoupled monorepo environments without crashing.
   - ✅ Integrated `plugins/kits-core/tests/*-tests.php` into `.github/workflows/ci-suite.yml` path-based PHP matrix.

1. **4-Layer Theme.json Injection (Resolved 26 Nov 2026)**:
   - ✅ Added Layer 3 `wp_theme_json_data_theme` filter (`includes/brand-customizer.php`) and `kits_brand_build_theme_json()` (`includes/brand-customizer-model.php`), merging saved tenant brand tokens into the full palette/radius lists and layout settings so Site Editor "Reset styles" restores tenant defaults.
   - ✅ Cached Layer 3 patch in transient `kits_brand_theme_data` with automatic invalidation (`kits_brand_clear_theme_cache()`) on option add/update/delete and plugin activation/deactivation.
   - ✅ Made `kits_brand_presets()` filterable via `kits_brand_presets`, separated `Restore Active Preset` vs confirmed `Clear Brand`, and added `kits_brand_tokens` to `settings-transfer.php` and `uninstall.php`.

2. **Cloudflare Worker Two-Way Relay**:
   - Deferred (OD4: no code exists; drop unless a date is set).

3. **Onboarding Wizard Multi-Tenant Flow (Resolved 26 Nov 2026, OD2)**:
   - ✅ Updated `includes/onboarding-wizard.php` to 3 steps with real `styles/*.json` swatches (`default`, `slate`, `forest`, `dark`, replacing `ink`) and `kits_onboarding_apply_style_variation()` writing to the active theme's `wp_global_styles` record.

4. **Scripts Manager Hardening (Resolved 26 Nov 2026, OD3)**:
   - ✅ Gated `includes/header-footer-scripts.php` menu, page render, and POST save on `kits_scripts_can_manage()` (`manage_options` + `unfiltered_html`).

5. **Form Engine Polish & Multi-Step Validation (Resolved 26 Nov 2026)**:
   - ✅ **Upload Limits & Granular File Diagnostics (B2)**: `kits_ff_upload()` now falls back to standalone `kits_ff_upload_error()` (8 MB limit, HEIC/type/size diagnostics) when `directoryweb` is inactive, and `assets/js/forms.js` renders selected file name, size, and a Remove button.
   - ✅ **Multi-Step Validation Error Summary Banner (B3)**: `assets/js/forms.js` renders `.kit-error-summary` on the active and last steps with direct jump-and-focus links.
   - ✅ **About Field Prefill Sanitization (B1)**: `kits_ff_plain_text()` in `includes/forms/fluentforms.php` strips HTML tags, unwraps `<time>` date chips, and decodes entities on textarea prefill values.

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Translations for the shell (only `kits-core.pot` exists; regenerated 27 Nov 2026).
- Shell parts still missing: detail panel, rich text, file and media fields, pair-list editor, row view inside a list, read-only HashList and ServiceRow, FieldReview options.
- Done in 1.4.1: the `kits_settings_fields` and `kits_features` filters, the `kits/v1/site-check` route and the `kits/socials` block (see Status above).
- Hidden screens: Setup Wizard (OD2, repaired) and Scripts & Pixels (OD3, gated) are still registered but hidden and wait for the owner to link or retire them; Brand Customizer is reachable only through Appearance › Brand Tokens.
- Deleting the old `aw_keys` option on live is owner-gated (the read fallback is already gone).

## Carried over from the admin IA inventory (26 Nov 2026)

- Empty last item in the wp-admin side menu: seen on the live site only; no empty-title submenu in code. Find it on live, then remove.
- Tools tab (RankWeb) and Help tab (PlanWeb, MailWeb): wait for the owner's reference list. MailWeb already has a Help card; RankWeb has a Tools card (owner, 14 Nov: no Tools tab).
- Setup Wizard (`kits-onboarding`) and Scripts & Pixels (`kits-scripts`): registered under Kits but hidden, reachable by URL only. Link them from Kits or retire them (owner decisions OD2, OD3).
- Kept on purpose, per plugin (independence): `*_simple_table`, `*_rest_can`, `rankweb_seo_api_allowed`, `insightweb_si_api_allowed`.

## Carried over from the owner decisions and the multi-tenant guide (26 Nov 2026)

Tenancy is per installation (Multisite keeps one brand per site), with no network or SaaS-managed branding for now. The theme owns no tenant branding and works without Kits Core. Both WordPress.org and direct distribution come from one source tree.

**Brand layer (Layer 3), built in 1.3.0 (`includes/brand-customizer.php`, tested in `brand-customizer-tests.php` and `brand-reset-tests.php`).** The notes in this block were the plan; the decided shape was: merge tenant values into the theme data by slug (list presets are replaced whole, so return the full list), clean the resolved-data cache when tenant values change and when Core is activated or deactivated, and Reset must restore the tenant preset instead of deleting the option (a separate confirmed "clear brand" action removes it).

**Brand Customizer, open:**
- Done (checked in code on 27 Nov): the presets come through the `kits_brand_presets` filter; `kits_brand_tokens` is in settings transfer and the uninstall list; defaults are resolved from the theme's `theme.json` (`kits_brand_resolve_defaults()`).
- Open: Editorial and Eco name fonts the theme does not bundle (only Inter is). No contrast check on tenant colours; the theme's dark mode does not follow tenant colours.

**Owner decisions still open:**
- OD1 accent colour: theme `primary` is `#C6D2E0` (what renders), the Brand Customizer default is `#FFBE1A`, the admin shell uses `#FFC300`, old docs say `#f59e0b`. Recommendation: `theme.json` is the source of truth; keep `#C6D2E0` unless the brand says otherwise.
- OD2 Setup Wizard: repaired in 1.3.0 (3 steps that apply a variation to Styles, `dark` instead of `ink`); backup and restore tested in `wizard-backup-tests.php`.
- OD3 Scripts & Pixels: gated on `manage_options` plus `unfiltered_html` (1.3.0); tested in `surface-tests.php` (menu, page, save).
- OD4 Cloudflare relay and Foundry: no code exists (same as open task 2). Recommendation: drop it from this file unless a date exists.
- OD6 Update URI: the WordPress.org build omits `Update URI` and the updater file; the direct build keeps them.
- OD7 commit history naming the reference theme: leave history alone.
- Shared connector or auth layer across plugins: not decided; each plugin keeps its own credentials today. `packages/shared-php` is unused.

## Carried over from the admin UI spec, blocks spec, registry notes and CI notes (26 Nov 2026)

- Admin menu spec (11 Nov): phase 1 is built (`includes/admin-menu*.php`); its later parts (Home status rows, Plugins list, Appearance placement) were not re-checked against the code (the folded menus are built: `includes/admin-fold.php`, 26 Nov), and it still names Animal Writes-era items. Code comments that cite `docs/org/admin-ui-spec.md` now point at git history.
- Custom blocks plan (approved 18 Nov): built (26 Nov, Kits Core 1.2.0): `kits/hero`, `kits/letter`, `kits/countdown`, `kits/metric`, `kits/share`, `kits/sticky-cta`, `kits/sponsored` (checked on the suite Playground; `tests/blocks-tests.php`), and `kits/socials` (1.4.1; renderers tested in `tests/block-render-tests.php`). The collection filter shipped as `directoryweb/collection-filter`. Native replacements still open: section-head pattern, Query Loop variations for related items and partners, Social Icons reading Theme Options → Socials (the `kits/socials` block covers this since 1.4.1), Block Bindings for item meta, a rule-chip text format. The site-specific `[aw_*]` shortcodes stay on the Animal Writes site layer.
- Registry and updates (26 Nov): built in Kits Core 1.1.0 (`includes/registry-updates.php`, `tests/registry-updates-tests.php`). Decisions taken: public registry and release files; stable releases only unless `kits_update_channel` is `pre`; the `Update URI` host stays wugweb.com (WordPress asks `update_*_wugweb.com`); the download is checked against the registry SHA-256 (tested in `registry-updates-tests.php`, 1.4.1). Since 26 Nov all seven plugins are released as stable and the registry (`https://wugweb-git.github.io/Kits/registry/index.json`) is live; a site on SourceWeb 0.2.1 was offered 0.2.2 on the default channel, and Kits Core 1.1.0 to 1.2.0 was installed through the updater in a real WordPress. InsightWeb 1.1.1, MailWeb 3.3.1, PlanWeb 0.2.1 and SourceWeb 0.2.2 restored the `Update URI` header they lost in the 25 Nov Plugin Check clean-up (the WordPress.org build strips it). Sites on older versions of those four need one manual update. The Kits theme (2.2.0) is still a pre-release in the registry. Installed on test.wugweb.com (26 Nov): all seven plugins active beside Rank Math; the head tags still print once. Kits Core 1.3.0 adds an optional site check-in (Kits → Tools, `includes/site-checkin.php`): off by default, weekly, to an https address the owner sets; the plugin side is built and tested, but nothing receives it yet (a receiver such as a Cloudflare Worker needs the owner's account). Not done: that receiver, the tenant relay in OD4, and an install test for each of the six plugins other than Kits Core. Pages itself is verified: GitHub Pages (`build_type: workflow`, HTTPS enforced) is enabled and the registry answers `HTTP/2 200` (`application/json`).
- CI and release reference (last verified 24 Nov): the HTTP checks and nav audits have not been run on a pushed commit; browser loading of release assets (CORS) and credentialed Playground scenarios stay manual. `packages/shared-php` is still not bundled.
- The component map was generated by `tools/ci/component_map.py`, which is not in this repo; regenerate it if the map is wanted again.
