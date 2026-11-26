# Kits by Wugweb Theme: Pending & Roadmap

## Active Scope & Responsibilities

The declarative FSE block theme owns:

- `theme.json` semantic tokens, typography scales, layout definitions, and color palette.
- Templates (`templates/`) and template parts (`parts/`).
- Native block patterns (`patterns/`).
- Style variations (`styles/`).
- Day/Night anti-FOUC runtime and CSS variables.

---

## Open Tasks & Enhancements

1. **Day/Night Anti-FOUC Implementation (Resolved 24 Nov 2026)**:
   - ✅ High-priority early `wp_head` inline script (priority 1) in `inc/assets.php` to read `localStorage` / `prefers-color-scheme` before DOM rendering, eliminating theme flash.
   - ✅ Header toggle component (`data-kit-theme-toggle`) added to `parts/header.html` with zero-dependency listener in `assets/js/kit.js`.
   - ✅ Dedicated `styles/dark.json` style variation added for sites wanting a permanently dark default.

2. **Spacing & Layout Normalization (Resolved 24 Nov 2026)**:
   - ✅ Aligned `theme.json` to schema v6.7. (Correction, 25 Nov 2026: `theme.json` has `contentSize` and `wideSize` both `1200px`, and the test suite asserts it; the earlier note said 840px.)
   - ✅ Recompiled token engine with `tools/build-tokens.py`, emitting synchronized `assets/css/kit-tokens.css` and `kit-tokens.min.css`.

3. **Pattern Library Expansion (Resolved 24 Nov 2026)**:
   - ✅ Authored accessible Breadcrumbs block pattern (`patterns/breadcrumbs.php`) integrating with RankWeb's breadcrumbs block and accessible HTML fallback.
   - ✅ Authored comprehensive automated test suite `tests/ThemeValidationTest.php` validating templates, parts, patterns, style variations, and CSS assets.

3b. **Frost pattern library (Resolved 25 Nov 2026)**: templates `blank`, `no-title`; 27 new patterns (footer variants, boxes, CTA inline, product box, team, portfolio, progress bars, pricing x3, posts, posts list, 404, comments, author box, testimonials, hero centred, four sample pages); `hero-split`, `cta`, `card-grid`, `testimonials` adapted; block styles Reverse on mobile, Plain (no bullets), Outline; `theme.json` styling for code, preformatted, quote, pullquote; breadcrumbs fallback made valid; `sidebar` template-part area registered once, with or without Kits Core; POT regenerated.
   - Catalogue of all 50 Frost files, what was built, adapted or excluded and why: `docs/theme/frost-pattern-integration.md`.
   - Validation evidence (WordPress Playground, with and without Kits Core): same document, and the test suite in `tests/ThemeValidationTest.php` (29 checks).
   - Verified since: Firefox 160 and WebKit 26.6 run; header/footer variants click-driven through the Site Editor's Design panel (Replace does not list patterns in WP 7.1.5); progress-bar and Ink contrast fixed with tests.
   - Open, genuinely: no real screen reader run; Safari proper not run (WebKit stand-in); Dark/Forest/Slate not visually rendered through the Site Editor (contrast computed from palettes).
   - Content width stays `1200px` for both `contentSize` and `wideSize` (an earlier note said 840px).

4. **Tenant Asset Decoupling (Resolved)**:
   - ✅ `assets/site/` and tenant style variations have been removed from the theme core (verified absent from `themes/kits-by-wugweb/assets/`).

## Carried over from docs/org (26 Nov 2026)

From the marketplace plan and the reverse-engineering matrix; the full text is in git history (`docs/org/`).

- Owner steps before submission: run Theme Check on staging; run the wp.org readme validator on each `readme.txt`; a real front-page screenshot (the current one is the logo); upload to the theme and plugin directories (slug `kits-by-wugweb`).
- Known gaps: front-end `kit.js` strings (`Close search`, ` (external site)`, `Loading results`) are now localized via `wp_localize_script` (`kitsI18n` in `inc/assets.php`); no real screen reader run; Safari proper not run.
- Kits Core audit leftovers: roughly 200 WPCS style errors across 35 files (CI gates security only); the `aw_` / `AW_` prefix rename and the `aw_campaign` coupling (coordinated across plugins, see each plugin's notes); low-severity hardening items (nonce oracle `kits_form_nonce`, theme-update package without an integrity check and off by default, favicon host with no allow-list, nonce in the download URL, ALTCHA replay not atomic, preview token in the query string).
- Reverse-engineering comparison with the reference theme is open: fluid typography (off in Kits), drop caps, gradients and duotone, custom weight maps, 25 versus 13 block styles in `theme.json`, `style.css` form and focus rules, navigation overlay and submenu, 600 and 782 px breakpoints, pattern, template and part block-level comparison, variations. Each needs a browser comparison and a recorded reason; nothing is copied from the reference theme.
- Base accent: the build swaps `#FFBE1A` for `#C6D2E0` in the shipped zip only; the repo default is still the tenant yellow (see the accent decision in Kits Core's notes).
