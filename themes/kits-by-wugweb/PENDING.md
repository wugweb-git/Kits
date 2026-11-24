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
   - Validation evidence (WordPress Playground, with and without Kits Core): same document, and the test suite in `tests/ThemeValidationTest.php` (28 checks).
   - Open, genuinely: Safari and Firefox not run; no real assistive technology run; the Site Editor Replace dialog for header and footer variants was not click-driven (the replacement itself was verified through the editor store).
   - Content width stays `1200px` for both `contentSize` and `wideSize` (an earlier note said 840px).

4. **Tenant Asset Decoupling**:
   - Relocate tenant-specific site files (`assets/site/`) and site style variations out of the theme core and into the tenant options loader.
