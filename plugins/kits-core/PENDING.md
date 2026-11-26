# Kits Core: Pending & Roadmap

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

1. **4-Layer Theme.json Injection**:
   - Verify tenant brand tokens injected into Layer 3 (`wp_theme_json_data_theme`) so Site Editor "Reset styles" restores tenant brand defaults, not generic core defaults.
   - Cache merged theme data in transients (`kits_brand_theme_data`) with automatic invalidation on option save.

2. **Cloudflare Worker Two-Way Relay**:
   - Implement `save_post_wp_block` hook in `Kits Core` dispatching pattern payloads to Cloudflare Worker relay.
   - Worker validates tenant API key, sanitizes pattern markup, opens GitHub PR in `wugweb-git/kits`, and triggers preview.
   - Strict zero GitHub token exposure in WordPress plugin code.

3. **Onboarding Wizard Multi-Tenant Flow**:
   - 4-step wizard: Site Identity $\rightarrow$ Typography Preset $\rightarrow$ Color Palette $\rightarrow$ Telemetry Activation.
   - Cloudflare Worker key verification check step.
   - Nonce-protected AJAX / REST endpoints for seamless onboarding step saves.

4. **Scripts Manager Hardening**:
   - Ensure header and footer injected tags are sanitized to prevent unclosed tags or invalid HTML.
   - Capability gate strictly restricted to `manage_options` / `manage_kits`.

5. **Form Engine Polish & Multi-Step Validation (Forwarded from Tenant Roadmap, 24 Nov 2026)**:
   - **Upload Limits & Granular File Diagnostics (B2)**: Raise limit to 8 MB (`kits_ff_upload()` in `includes/forms/fluentforms.php`), replacing generic errors with specific diagnostics (file size vs unsupported formats like HEIC), displaying selected file name, size indicator, and a Remove button.
   - **Multi-Step Validation Error Summary Banner (B3)**: In `assets/js/forms.js`, when step validation fails on a previous step, display a top-level error summary banner on the active step with direct links that jump to and focus the invalid fields.
   - **About Field Prefill Sanitization (B1)**: Ensure `kits_ff_form()` textarea value population strips raw HTML tags, decodes entities, and converts date markup (`<span class="kit-date">`) into plain text before rendering.

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Translations for the shell (only `kits-core.pot` exists).
- Shell parts still missing: detail panel, rich text, file and media fields, pair-list editor, row view inside a list, read-only HashList and ServiceRow, FieldReview options.
- Settings "Features" section with `kits_settings_fields` and `kits_features` filters; a `kits/v1/site-check` route; a `kits/socials` block.
- Hidden screens: Setup Wizard (saves an option nothing reads, OD2) and Scripts & Pixels (raw save, no `unfiltered_html` check, OD3) wait for owner decisions; Brand Customizer is reachable only through Appearance › Brand Tokens.
- Deleting the old `aw_keys` option on live is owner-gated (the read fallback is already gone).

## Carried over from the admin IA inventory (26 Nov 2026)

- Empty last item in the wp-admin side menu: seen on the live site only; no empty-title submenu in code. Find it on live, then remove.
- Tools tab (RankWeb) and Help tab (PlanWeb, MailWeb): wait for the owner's reference list. MailWeb already has a Help card; RankWeb has a Tools card (owner, 14 Nov: no Tools tab).
- Setup Wizard (`kits-onboarding`) and Scripts & Pixels (`kits-scripts`): registered under Kits but hidden, reachable by URL only. Link them from Kits or retire them (owner decisions OD2, OD3).
- Kept on purpose, per plugin (independence): `*_simple_table`, `*_rest_can`, `rankweb_seo_api_allowed`, `insightweb_si_api_allowed`.

## Carried over from the owner decisions and the multi-tenant guide (26 Nov 2026)

Tenancy is per installation (Multisite keeps one brand per site), with no network or SaaS-managed branding for now. The theme owns no tenant branding and works without Kits Core. Both WordPress.org and direct distribution come from one source tree.

**Brand layer (Layer 3), not built.** Kits Core has no `wp_theme_json_data_theme` filter. The Brand Customizer prints CSS custom properties in `wp_head` (priority 100) and the block editor, so it wins over Site Editor changes and "Reset styles" does not restore it. Decided shape: merge tenant values into the theme data by slug (list presets are replaced whole, so return the full list), clean the resolved-data cache when tenant values change and when Core is activated or deactivated, and Reset must restore the tenant preset instead of deleting the option (a separate confirmed "clear brand" action removes it).

**Brand Customizer, open:**
- The three tenant profiles (Modern Tech, Editorial, Eco) are hard-coded; they should come through a filter. Editorial and Eco name fonts the theme does not bundle (only Inter is).
- No contrast check on tenant colours; the theme's dark mode does not follow tenant colours.
- `kits_brand_tokens` is not in settings transfer, the uninstall list or the uninstall backup.
- Setting defaults should be read from the theme's own `theme.json`, and a value equal to its default should not be skipped.

**Owner decisions still open:**
- OD1 accent colour: theme `primary` is `#C6D2E0` (what renders), the Brand Customizer default is `#FFBE1A`, the admin shell uses `#FFC300`, old docs say `#f59e0b`. Recommendation: `theme.json` is the source of truth; keep `#C6D2E0` unless the brand says otherwise.
- OD2 Setup Wizard: it has 3 steps and saves `kits_active_style_variation`, which nothing reads; swatches do not match `styles/*.json`; `ink` is listed as a variation and `dark` is missing. Recommendation: repair it to 3 steps that really apply a variation, or remove it. Do not build the 4-step flow.
- OD3 Scripts & Pixels: raw script text saved under `manage_options`. Recommendation: gate on `unfiltered_html`, keep it raw, correct the docs, add a test.
- OD4 Cloudflare relay and Foundry: no code exists. Recommendation: drop it from this file unless a date exists.
- OD6 Update URI: the WordPress.org build omits `Update URI` and the updater file; the direct build keeps them.
- OD7 commit history naming the reference theme: leave history alone.
- Shared connector or auth layer across plugins: not decided; each plugin keeps its own credentials today. `packages/shared-php` is unused.

## Carried over from the admin UI spec, blocks spec, registry notes and CI notes (26 Nov 2026)

- Admin menu spec (11 Nov): phase 1 is built (`includes/admin-menu*.php`); its later parts (Home status rows, Plugins list, Appearance placement) were not re-checked against the code (the folded menus are built: `includes/admin-fold.php`, 26 Nov), and it still names Animal Writes-era items. Code comments that cite `docs/org/admin-ui-spec.md` now point at git history.
- Custom blocks plan (approved 18 Nov): only `kits/hero` is built. Not built: `kits/letter`, `kits/countdown`, `kits/metric`, `kits/share`, `kits/sticky-cta`, `kits/sponsored`; the collection filter shipped as `directoryweb/collection-filter`. Native replacements still open: section-head pattern, Query Loop variations for related items and partners, Social Icons reading Theme Options → Socials, Block Bindings for item meta, a rule-chip text format. The site-specific `[aw_*]` shortcodes stay on the Animal Writes site layer.
- Registry and updates (26 Nov): built in Kits Core 1.1.0 (`includes/registry-updates.php`, `tests/registry-updates-tests.php`). Decisions taken: public registry and release files; stable releases only unless `kits_update_channel` is `pre`; the `Update URI` host stays wugweb.com (WordPress asks `update_*_wugweb.com`); the download is checked against the registry SHA-256. Every release so far is a pre-release, so nothing is offered until the first stable release or the channel is set to pre. Still to do by hand: enable GitHub Pages (Source: GitHub Actions) if the pages job has not published, and confirm `registry/index.json` loads.
- CI and release reference (last verified 24 Nov): the HTTP checks and nav audits have not been run on a pushed commit; browser loading of release assets (CORS) and credentialed Playground scenarios stay manual. `packages/shared-php` is still not bundled.
- The component map was generated by `tools/ci/component_map.py`, which is not in this repo; regenerate it if the map is wanted again.
