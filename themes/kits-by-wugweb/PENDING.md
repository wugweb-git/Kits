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

3b. **Frost pattern library (25 Nov 2026)**: templates `blank`, `no-title`; 27 new patterns (footer variants, boxes, CTA inline, product box, team, portfolio, progress bars, pricing x3, posts, posts list, 404, comments, author box, testimonials, hero centred, four sample pages); block style Reverse on mobile. Record and exclusions: `docs/theme/frost-pattern-integration.md`.
   - ⏳ Version 2: adapt `hero-split`, `cta`, `card-grid`; image slot for `testimonials`.
   - ✅ Validated in WordPress Playground (WP 7.1.5), with and without Kits Core: activation, all 47 patterns, 10 templates, editor insert and save, 375/768/1200, light/dark, variations. Results and open issues: `docs/theme/frost-pattern-integration.md`.
   - ⏳ New strings not yet in `languages/kits-by-wugweb.pot` (run `wp i18n make-pot`).
   - ⏳ Existing issues found: `breadcrumbs` fallback is invalid when inserted in the editor; the `sidebar` template-part area logs a PHP Notice when Kits Core is absent.
   - ⏳ Frost items not carried over: shadow, no-disc and social-outline block styles, per-block `theme.json` styling (code, quote, table, cover, comments), core pattern removal.

4. **Tenant Asset Decoupling**:
   - Relocate tenant-specific site files (`assets/site/`) and site style variations out of the theme core and into the tenant options loader.
