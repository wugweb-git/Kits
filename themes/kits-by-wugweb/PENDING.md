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
   - ✅ Aligned `theme.json` to schema v6.7 with `contentSize: 840px` and `wideSize: 1200px` for optimal reading line length.
   - ✅ Recompiled token engine with `tools/build-tokens.py`, emitting synchronized `assets/css/kit-tokens.css` and `kit-tokens.min.css`.

3. **Pattern Library Expansion (Resolved 24 Nov 2026)**:
   - ✅ Authored accessible Breadcrumbs block pattern (`patterns/breadcrumbs.php`) integrating with RankWeb's breadcrumbs block and accessible HTML fallback.
   - ✅ Authored comprehensive automated test suite `tests/ThemeValidationTest.php` validating templates, parts, patterns, style variations, and CSS assets.

4. **Tenant Asset Decoupling**:
   - Relocate tenant-specific site files (`assets/site/`) and site style variations out of the theme core and into the tenant options loader.
