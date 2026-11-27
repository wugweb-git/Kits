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
   - Validation evidence (WordPress Playground, with and without Kits Core): same document, and the test suite in `tests/ThemeValidationTest.php` (29 checks on 25 Nov, 45 since 27 Nov).
   - Verified since: Firefox 160 and WebKit 26.6 run; header/footer variants click-driven through the Site Editor's Design panel (Replace does not list patterns in WP 7.1.5); progress-bar and Ink contrast fixed with tests.
   - Open, genuinely: no real screen reader run; Safari proper not run (WebKit stand-in); Dark/Forest/Slate not visually rendered through the Site Editor (contrast computed from palettes).
   - Content width stays `1200px` for both `contentSize` and `wideSize` (an earlier note said 840px).

4. **Tenant Asset Decoupling (Resolved)**:
   - ✅ `assets/site/` and tenant style variations have been removed from the theme core (verified absent from `themes/kits-by-wugweb/assets/`).

## Release 2.2.2 (27 Nov 2026): what was done, what is still open

Done (evidence in `CHANGELOG.md`, `docs/theme/reverse-engineering-comparison.md` and `tests/ThemeValidationTest.php`, 45 checks):

- **CHANGELOG.md** added; `readme.txt` changelog has 2.2.2, 2.2.1, 2.2.0 and 2.0.0 and a test checks it matches `CHANGELOG.md` and the `style.css` Version. Stable tag is 2.2.2 (the earlier note saying 2.2.0 was stale).
- **Theme Check** (WordPress.org plugin, run in Playground by `tools/playground/theme-check.py`): the wordpress.org ZIP (`--track wporg`) passes, 0 required, 0 warnings. The one earlier finding (`block-theme` is not a directory tag) was fixed. The commercial ZIP reports only the `Update URI` header, which is the self-hosted updater and is removed by the wordpress.org build.
- **readme.txt**: checked the way the wordpress.org parser reads it (title line, header fields, version formats, 150-character short description, known section names, FAQ entries, changelog) by tests; an Installation section was added and a stale "needs WordPress 6.6" line corrected. The online plugin readme validator was not run (it needs the live site and is built for plugin readmes).
- **screenshot.png** (1200 x 900, front page, sample text, no third-party images) replaces the logo `screenshot.jpg`.
- **Reverse-engineering comparison**: done where it can be measured; the reasons are in `docs/theme/reverse-engineering-comparison.md`. Six robustness and accessibility fixes came out of it.
- **Accessibility measured**: contrast for every variation (tests), focus indicator on every theme stop, skip link and landmarks on home, single, page, 404 and search.

Still open:

- No real screen reader run (VoiceOver, NVDA, JAWS, TalkBack): needs a person and the software.
- Safari proper and real phones not run (WebKit and Firefox stand-ins from 25 Nov; this round used Chromium).
- Windows high-contrast (`forced-colors`) rendering not seen; the rule is in the CSS and tested as text.
- Dark, Forest and Slate not rendered through the Site Editor (contrast is computed from the palettes).
- The reference theme was not downloaded again; its column in the comparison is as recorded on 25 Nov.
- Kits Core's named `main` landmark reads "Archives" on the 404 page (`plugins/kits-core/includes/landmarks.php`; not a theme file).
- Two unnamed search landmarks on the no-results search page (recorded in the comparison, low impact).
- Owner steps before submission: upload to the theme directory (slug `kits-by-wugweb`; build with `python3 tools/build/build-dist.py --target theme --track wporg`), and a Theme Check run on a real staging site if you want a second opinion.

## Carried over from docs/org (26 Nov 2026)

From the marketplace plan and the reverse-engineering matrix; the full text is in git history (`docs/org/`).

- Owner steps before submission: upload to the theme and plugin directories (slug `kits-by-wugweb`). Theme Check and the readme checks, and the real front-page screenshot, are done for the theme (see Release 2.2.2 above); the plugins' readmes are not covered here.
- Known gaps: front-end `kit.js` strings (`Close search`, ` (external site)`, `Loading results`) are now localized via `wp_localize_script` (`kitsI18n` in `inc/assets.php`); no real screen reader run; Safari proper not run.
- Kits Core audit leftovers: roughly 200 WPCS style errors across 35 files (CI gates security only); the `aw_` / `AW_` prefix rename and the `aw_campaign` coupling (coordinated across plugins, see each plugin's notes); low-severity hardening items (nonce oracle `kits_form_nonce`, theme-update package without an integrity check and off by default, favicon host with no allow-list, nonce in the download URL, ALTCHA replay not atomic, preview token in the query string).
- Reverse-engineering comparison with the reference theme: done (27 Nov 2026), see `docs/theme/reverse-engineering-comparison.md`.
- Base accent: the build swaps `#FFBE1A` for `#C6D2E0` in the shipped zip only; the repo default is still the tenant yellow (see the accent decision in Kits Core's notes).

## Before the next theme release (review of 26 Nov 2026)

`inc/theme-info.php` (commit 0e982c3) added an "Upgrade to Premium" link to the theme details; it was removed on 27 Nov 2026 (WordPress.org theme review forbids upsell links in the theme UI). It was missed when the same link was removed from the plugins on 26 Nov. Resolved in 2.2.2: the theme has a `CHANGELOG.md`, the readme Stable tag is 2.2.2 and the stacked card, info modal and translated labels are in the 2.2.1 entry.
