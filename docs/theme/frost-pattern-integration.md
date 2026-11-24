# Frost pattern integration record

Source: Frost 1.0.10 (WP Engine), read as a structural and compositional reference. No Frost markup, CSS, colours, fonts or media were copied; every Kits file below was written from the Kits design system (palette presets, `is-style-kits-*` styles, core blocks). Kits is GPL-2.0-or-later; Frost's own files disagree on GPL-3.0 vs GPL-2.0-or-later, so nothing was copied.

Paths are relative to `themes/kits-by-wugweb/`. Status words: **Implemented** (a Kits file exists), **Adapted** (an existing Kits file was changed), **Excluded** (decided not to build, with the reason). Nothing is pending in this record.

## 1. Pattern catalogue: all 50 Frost pattern files

Frost ships 50 pattern files. 18 are `-dark` duplicates of a light file.

| # | Frost file (slug under `frost/`) | Kits equivalent | Status | Reason / note |
|---|---|---|---|---|
| 1 | `header-default` | `patterns/header-default.php` | Implemented | Variant bound to the header part (`Block Types: core/template-part/header`); a copy of `parts/header.html`, kept equal by a test |
| 2 | `header-default-dark` | none | Excluded | Dark mode is a runtime switch (`data-theme`), not a second pattern |
| 3 | `header-notification-bar` | none | Excluded | Kits Core owns the announcement bar (Theme Options); the theme does not duplicate a plugin feature |
| 4 | `header-notification-bar-dark` | none | Excluded | As 2 and 3 |
| 5 | `footer-default` | `patterns/footer-default.php`, `patterns/footer-minimal.php` | Implemented | The default footer as a variant (equal to `parts/footer.html`, test-enforced), plus a minimal one-row footer |
| 6 | `footer-default-dark` | none | Excluded | As 2 |
| 7 | `footer-mega` | `patterns/footer-columns.php` | Implemented | Four columns |
| 8 | `footer-mega-dark` | none | Excluded | As 2 |
| 9 | `footer-stacked` | `patterns/footer-stacked.php` | Implemented | Centred |
| 10 | `footer-stacked-dark` | none | Excluded | As 2 |
| 11 | `footer-three-columns` | `patterns/footer-social.php` | Implemented | Links and social icons |
| 12 | `footer-three-columns-dark` | none | Excluded | As 2 |
| 13 | `hero-one-column` | `patterns/hero-centered.php` | Implemented | No image slot; uses the Kits button styles |
| 14 | `hero-two-columns` | `patterns/hero-split.php` | Adapted | Kits already had a split hero. It now has a secondary button; reversing the order on mobile is the `kits-reverse` Columns style |
| 15 | `boxes-two` | `patterns/boxes-two.php` | Implemented | Card groups |
| 16 | `boxes-two-dark` | none | Excluded | As 2 |
| 17 | `boxes-three` | `patterns/boxes-three.php` | Implemented | Card groups |
| 18 | `boxes-three-dark` | none | Excluded | As 2 |
| 19 | `cta-button` | `patterns/cta-inline.php` | Implemented | One line with an action |
| 20 | `cta-button-dark` | none | Excluded | As 2 |
| 21 | `cta-stacked` | `patterns/cta.php` | Adapted | Existing pattern: now a dark band with centred heading, supporting line and a Brand action |
| 22 | `cta-stacked-dark` | none | Excluded | As 2 |
| 23 | `newsletter-signup` | `patterns/newsletter.php` | Excluded | Kits already has the pattern and the `newsletter` part, and Frost's has no form |
| 24 | `newsletter-signup-dark` | none | Excluded | As 2 and 23 |
| 25 | `author-box` | `patterns/author-box.php` | Implemented | Avatar, name, biography |
| 26 | `author-box-dark` | none | Excluded | As 2 |
| 27 | `product-box` | `patterns/product-box.php` | Implemented | Empty image slot |
| 28 | `product-box-dark` | none | Excluded | As 2 |
| 29 | `testimonials` | `patterns/testimonials.php` | Implemented | Three Card groups with `core/quote`; placeholder text only, no invented quotes |
| 30 | `testimonials-dark` | none | Excluded | As 2 |
| 31 | `testimonials-image` | `patterns/testimonials.php` | Adapted | Folded into one pattern: each card has an optional round image slot; an empty slot renders nothing on the site |
| 32 | `testimonials-image-dark` | none | Excluded | As 2 |
| 33 | `team-four-columns` | `patterns/team.php` | Implemented | Empty image slots |
| 34 | `portfolio` | `patterns/portfolio.php` | Implemented | Empty gallery |
| 35 | `progress-bars` | `patterns/progress-bars.php` | Implemented | Core blocks only, no `wp:html`. The value is in the label text; the bar is a visual aid |
| 36 | `pricing-two-columns` | `patterns/pricing-two.php` | Implemented | Real `core/list`, not separator rows |
| 37 | `pricing-two-columns-dark` | none | Excluded | As 2 |
| 38 | `pricing-three-columns` | `patterns/pricing-three.php` | Implemented | As 36 |
| 39 | `pricing-three-columns-dark` | none | Excluded | As 2 |
| 40 | `pricing-four-columns` | `patterns/pricing-four.php` | Implemented | As 36 |
| 41 | `pricing-four-columns-dark` | none | Excluded | As 2 |
| 42 | `posts` | `patterns/posts.php` | Implemented | One column query |
| 43 | `posts-grid` | `patterns/card-grid.php` | Adapted | Kits already had the grid. It now has pagination (previous, numbers, next) |
| 44 | `posts-list` | `patterns/posts-list.php` | Implemented | Ruled rows |
| 45 | `404` | `patterns/404.php` | Implemented | `Inserter: no`; `templates/404.html` calls it |
| 46 | `comments` | `patterns/comments.php` | Implemented | `Inserter: no`; `templates/single.html` calls it |
| 47 | `page-home` | `patterns/page-home.php` | Implemented | Category "Kits: Pages"; assembled from the patterns above; placeholder copy and empty media only |
| 48 | `page-about` | `patterns/page-about.php` | Implemented | As 47 |
| 49 | `page-pricing` | `patterns/page-pricing.php` | Implemented | As 47 |
| 50 | `page-link` | `patterns/page-link.php` | Implemented | As 47 |

Totals: of the 50 Frost files, 20 are excluded (18 `-dark` duplicates, `header-notification-bar`, `newsletter-signup`) and 30 are implemented or adapted (one Frost file can map onto an existing Kits pattern, and two Frost files, `testimonials` and `testimonials-image`, share one Kits pattern). Kits ships 47 patterns: 20 that existed before, 27 added.

## 2. Templates and parts

| Frost | Kits | Status | Note |
|---|---|---|---|
| `templates/blank.html` | `templates/blank.html` | Implemented | No header, no footer; declared in `theme.json` `customTemplates` |
| `templates/no-title.html` | `templates/no-title.html` | Implemented | Header and footer, no page title; declared in `customTemplates` |
| `templates/404.html` | `templates/404.html` | Adapted | Calls `kits-by-wugweb/404` |
| archive, home, index, search, page, single | existing Kits templates | Excluded | Kits equivalents are richer (single calls the `comments` pattern) |
| `parts/header.html`, `parts/footer.html` (a pattern call each) | `parts/header.html`, `parts/footer.html` | Excluded | Kits keeps inline parts; the variants are offered through patterns, which is how the Site Editor swaps them (section 5) |
| 7 colour `styles/*.json` | none | Excluded | Frost's palettes are Frost's brand; Kits has `dark`, `forest`, `slate` and the `colours/ink` set |

## 3. Block styles and theme.json

| Frost item | Kits | Status | Reason |
|---|---|---|---|
| Columns `columns-reverse` | `kits-reverse` "Reverse on mobile" (`inc/blocks.php`, `assets/css/kits.css`) | Implemented | Flips to `column-reverse` while core stacks the columns (to 781px) |
| List `no-disc` | `kits-plain` "Plain (no bullets)" | Implemented | Keeps list semantics; only the markers and indent go |
| Social links `outline` | `kits-outline` "Outline" | Implemented | Line in the text colour, so it follows light, dark and every variation |
| Group / quote `shadow-light` | none | Excluded | Duplicate: Kits already has Card, Surface and the Elevation shadow presets |
| Group / quote `shadow-solid` | none | Excluded | Duplicate: the Brand-offset shadow preset covers it |
| `is-style-hidden-mobile` | none | Excluded | Hides content with no accessible alternative |
| `is-style-outline-background` | none | Excluded | Used by Frost, defined nowhere in Frost |
| Code, Preformatted | `theme.json` `styles.blocks` | Implemented | Not styled before: surface fill, border, control radius, `mono` font preset (new, system stack), label size |
| Quote, Pullquote | `theme.json` `styles.blocks` | Implemented | Not styled before: rule in the border colour, muted normal-style cite |
| Table | existing | Excluded | Already styled in `kit.css` |
| Comments | existing | Excluded | Already styled in `kit.css` and the `comments` pattern |
| Cover | none | Excluded | Nothing to add: Kits has `hero` and `banner`; a second default would fight them |
| Palette, Outfit font, sample images, per-block px values, `!important` | none | Excluded | Kits tokens own these |

The three new block styles carry behaviour, not design values, so their CSS is in `assets/css/kits.css`, not in `theme.json`. Block styles are registered once, in `kits_block_styles()`.

## 4. Decisions

- **Core block patterns stay offered.** `remove_theme_support( 'core-block-patterns' )` was not applied: it hides core's patterns on every site that uses the theme, and nothing in Kits conflicts with them. A site that wants a curated inserter can add the line in a child theme or plugin.
- **Notification bar is Kits Core's**, not the theme's (ownership boundary).
- **Sidebar template-part area.** `theme.json` declares a `sidebar` area. WordPress knows only header, footer, uncategorized and navigation-overlay, and Kits Core registers `sidebar` itself (`plugins/kits-core/includes/landmarks.php`, priority 10). The theme adds the same area in `inc/blocks.php` at priority 20 and only when it is missing, so without Core there is no PHP Notice and with Core there is exactly one area. The theme does not depend on Core.
- **Breadcrumbs.** The fallback (RankWeb inactive) now builds a native ordered list (`core/list`, `core/list-item`) inside the Group, so it is valid in the editor; the RankWeb branch is unchanged.
- **Ink colour-set links.** Links in the Ink set were 1.91:1 against the panel under the Dark palette and 1.41:1 in dark mode. The fix now lives in `styles/colours/ink.json` (link colour is the set's own `on-ink`, underlined, same on hover), so it follows every palette and variation; the earlier CSS-only dark-mode rule was removed. A test checks link, heading and text against the Ink panel in the base, Dark, Forest and Slate palettes.
- **Progress bars.** Track and fill were 1.39:1. The track is now `border` and the fill `secondary` (13.19:1, light). A test requires at least 3:1 (WCAG 1.4.11). The bar has no `role="progressbar"`: the value is in the label text ("Label, 90%"), so it is not conveyed by the bar alone.

## 5. Header and footer variants

A pattern with `Block Types: core/template-part/header` or `.../footer` is offered as a variant of that part. In WordPress 7.1.5 this is in the block's Settings tab, **Design** panel, not in the **Replace** menu: Replace lists only other template-part entities of the same area, never patterns. Registered Kits variants: header-default; footer-default, footer-minimal, footer-columns, footer-social, footer-stacked.

Checked in WordPress Playground with real clicks in the Site Editor: selecting the footer part, opening Settings, Design, the panel lists the five Kits footers (columns, default, minimal, links and social, stacked) plus core's; choosing one replaces the part, Save writes a `wp_template_part` as `custom` that holds the pattern reference, the front end renders it, reload shows 0 invalid blocks. The header part offers header-default and core's headers the same way. The Replace menu was opened too and confirmed to list no patterns.

## 6. Validation (25 Nov 2026)

WordPress Playground CLI, WordPress 7.1.5, PHP 8.3, `WP_DEBUG` and `WP_DEBUG_LOG` on. The theme was built with `tools/build/build-dist.py`, the ZIP extracted, and the extracted folder mounted. Test A: theme only. Test B: theme plus Kits Core (built ZIP, extracted).

| Check | Test A (no Core) | Test B (Core) |
|---|---|---|
| Activation, `debug.log` | Activates; no `debug.log` created (the earlier `sidebar` Notice is gone) | Same |
| Patterns registered | 47 | 47 |
| Pattern categories | `kits-components`, `kits-lists`, `kits-pages` registered; every pattern is in one, is a header/footer variant, or hidden (`404`, `comments`) | Same |
| `sidebar` template-part area | One | One (Core's, not duplicated) |
| Gutenberg validity (parse, 47 of 47) | No invalid or freeform blocks, including `breadcrumbs` and `testimonials` | Same |
| Insert, save, reload | All 53 block groups inserted, saved, reloaded: 570 blocks, 0 invalid, 0 freeform | Same |
| Front end | All patterns render with no PHP errors; empty image slots render nothing | Same |
| Templates | Home, single, page, archive, search, 404 (status 404), Page Wide, Blank (no header or footer), No title: all render, no PHP errors | Same |
| Widths | No horizontal scroll at 375, 600, 768, 1000, 1200 | No horizontal scroll at the same widths |
| Reverse on mobile | `column-reverse` at 375; `row` at 1024 | Not repeated |
| Plain, Outline, Code, Preformatted, Quote, Pullquote | Computed styles checked: list markers none; outline border and icon follow the text colour; code and quote use border, radius, mono font | Not repeated |
| Contrast (measured, WCAG ratio) | Light: code text 12.35, cite 5.46, quote 12.35. Dark: code 11.21, cite 6.15, quote 12.26. Ink set: text 17.58, link 17.58 light and 17.39 dark (1.41 before). Progress bar 13.19 (1.39 before). Palettes Default/Dark/Forest/Slate computed from the JSON: code 12.35/11.21, cite 5.46/6.15, quote 12.35/12.26, progress 13.19/11.21, Ink text 17.58/17.39 | Final run: progress 13.19, Ink link 17.58/17.39 |
| Heading hierarchy | No skipped level across the 47 patterns on one page (after changing card headings in boxes, product box, pricing and team from h3 to h2) | Same |
| Names and alt | No unnamed link or button, no image without `alt`; one input without a label is WordPress's own admin-bar search | Not repeated |
| Header and footer variants | Design panel clicked through; `footer-minimal` saved as `custom`, renders, 0 invalid on reload | Not repeated |
| Cross-browser | Chromium 153, WebKit 26.6 (Safari engine) and Firefox 160: no horizontal overflow at 375, 768, 1200; Plain, Outline, Reverse, code and quote computed styles identical; keyboard focus walk shows an indicator on every stop | Not repeated |
| Theme tests | `php tests/ThemeValidationTest.php`: 29 checks, 0 failed | |
| ZIP | 106 files, 47 patterns; no `assets/site/`, no `tests/`, no `PENDING.md`, no `phpcs.xml.dist`; `tools/build/verify-dist.py` lists `kits-by-wugweb` and `kits-core` correctly | |

Style variations Dark, Forest and Slate: contrast was computed from their palette files against the final patterns (above). A full visual render through the Site Editor's Browse styles was not obtained (the test harness for switching variations was unreliable), so that remains unverified visually.

## 7. Known limitations

- Safari itself was not run: WebKit 26.6 from Playwright stands in for its engine. Firefox 160 and Chromium 153 were run.
- No real screen reader (VoiceOver, NVDA) was used. Keyboard-only walks and accessible names were checked by script.
- Playground is not a production host: caching, object cache and real mail were not exercised.
- Earlier console noise (connection refused, 502 from restarting the test server, `beforeunload`) did not reproduce. The single unexplained 404 could not be reproduced either; the final runs, with WP_DEBUG on, show only the intentional 404 of the not-found test URL and no `debug.log`.
- Not driven: real assistive technology; Safari proper; a visual render of Dark, Forest and Slate through the Site Editor; Kits Core alongside a different theme.
- The theme ZIP ships `tokens/` and `tools/build-tokens.py` (so a child theme can rebuild tokens, as `readme.txt` describes). That is an existing distribution choice, not part of this work.
