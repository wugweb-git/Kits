# Frost pattern integration record

Source: Frost 1.0.10 (WP Engine, GPL), read as a structural and compositional reference. No Frost markup, CSS, colours, fonts or media were copied; every Kits file below was written from the Kits design system (palette presets, `is-style-kits-*` styles, core blocks). Kits is GPL-2.0-or-later; Frost's own files disagree on GPL-3.0 vs GPL-2.0-or-later, so nothing was copied.

Paths are relative to `themes/kits-by-wugweb/`. "Version 2" means deferred by decision, not rejected.

## Implemented (Frost pattern -> Kits file)

| Frost | Kits | Notes |
|---|---|---|
| header-default | `patterns/header-default.php` | Variant bound to the header part; a copy of `parts/header.html`, kept in step by a test |
| footer-default | `patterns/footer-minimal.php`, `patterns/footer-default.php` | Minimal one-row footer, plus the default footer as a variant (test keeps it equal to `parts/footer.html`) |
| footer-mega | `patterns/footer-columns.php` | Four columns |
| footer-stacked | `patterns/footer-stacked.php` | Centred |
| footer-three-columns | `patterns/footer-social.php` | Links and social icons |
| hero-one-column | `patterns/hero-centered.php` | No image slot |
| boxes-two / boxes-three | `patterns/boxes-two.php`, `patterns/boxes-three.php` | Card groups |
| cta-button | `patterns/cta-inline.php` | |
| author-box | `patterns/author-box.php` | Avatar, name, biography |
| product-box | `patterns/product-box.php` | Empty image slot |
| testimonials | `patterns/testimonials.php` | Text only; image slot is version 2 |
| team-four-columns | `patterns/team.php` | Empty image slots |
| portfolio | `patterns/portfolio.php` | Empty gallery |
| progress-bars | `patterns/progress-bars.php` | Core blocks only; value is in the label text, bar is visual |
| pricing-two / three / four | `patterns/pricing-two.php`, `-three`, `-four` | Real `core/list`, not separator rows |
| posts | `patterns/posts.php` | One column |
| posts-list | `patterns/posts-list.php` | Ruled rows |
| 404 | `patterns/404.php` | Inserter: no; `templates/404.html` calls it |
| comments | `patterns/comments.php` | Inserter: no; `templates/single.html` calls it |
| page-home / about / pricing / link | `patterns/page-home.php`, `page-about.php`, `page-pricing.php`, `page-link.php` | Category "Kits: Pages"; assembled from the patterns above; placeholder copy and empty media only |
| templates blank, no-title | `templates/blank.html`, `templates/no-title.html` | Declared in `theme.json` `customTemplates` |
| block style columns-reverse | `kits-reverse` (`inc/blocks.php`, `assets/css/kits.css`) | |

## Deferred to version 2 (decided)

- Adapt existing `hero-split` (image slot, reverse option), `cta` (supporting line), `card-grid` (pagination, author), and add an image slot to `testimonials`.

## Excluded, with the reason

| Frost item | Reason |
|---|---|
| All 18 `-dark` files | Kits dark mode is a runtime switch (`data-theme`, `kit-dark`); a hard-coded dark copy would fight the toggle. Check each new pattern in both modes instead |
| header-notification-bar (+dark) | Kits Core owns the announcement bar (Theme Options); the theme does not duplicate a plugin feature |
| newsletter-signup (+dark) | `patterns/newsletter.php` already has the same blocks |
| `is-style-hidden-mobile` utility | Hides content with no accessible alternative |
| `shadow-light`, `shadow-solid`, list `no-disc`, social-links `outline` | Not carried over yet (visual styles with no Kits need); revisit on request |
| 7 colour style variations | Frost's palettes are Frost's brand; Kits has `dark`, `forest`, `slate`, `colours/ink` |
| Frost palette, Outfit font, sample images, per-block px values | Kits tokens and rules own these |
| `is-style-outline-background` | Used by Frost, defined nowhere in Frost |

## Validation (25 Nov 2026, WordPress Playground CLI, WP 7.1.5, PHP 8.2, theme built with `tools/build/build-dist.py`)

Run twice: theme only, and theme with Kits Core active (kits-core.zip contents).

| Check | Result |
|---|---|
| Theme activates; `WP_DEBUG` and `WP_DEBUG_LOG` on | Yes |
| Patterns registered | 47 theme patterns, in both runs. `404` and `comments` hidden from the inserter. Header and footer variants offered for the template parts |
| Templates | 10 listed. Home, single, archive, search, 404 and the page, `page-wide`, `blank` and `no-title` templates all render (200; 404 returns 404); `blank` has no header or footer |
| Pattern validity in Gutenberg | 46 of 47 parse with no invalid blocks (all except `breadcrumbs`, see below) |
| Insert and save | All 46 inserted into a page in the editor, saved, re-read and re-parsed: no invalid blocks, no editor JS errors; front end 200 with no PHP errors |
| 375 / 768 / 1200 px | No horizontal overflow at any width. Progress bars measure 90, 75 and 60 percent of the track at 1200 |
| Light and dark | Dark mode (`data-theme`) renders all patterns; button contrast measured 9.1 to 19.2 |
| Style variations | Dark, Forest and Slate apply through Global Styles and render without errors |
| Reverse on mobile | Flips to `column-reverse` at 375 px |
| Kits Core present | Same results; no `debug.log` created, so no PHP notices or errors |
| Kits Core absent | One PHP Notice in the debug log (see below) |

## Known issues and gaps (documented, not fixed)

- **`kits-by-wugweb/breadcrumbs` (existing pattern, not part of this work):** when RankWeb is inactive its fallback prints a bare `<nav>` list inside a Group block, which Gutenberg marks invalid if the pattern is inserted. It renders correctly on the front end.
- **`sidebar` template-part area (existing, `theme.json` templateParts):** WordPress supports only header, footer and uncategorized. Kits Core registers the `sidebar` area (`plugins/kits-core/includes/landmarks.php`), so with Core there is no notice. Without Core, WordPress logs a PHP Notice (with `WP_DEBUG`) and files the part under "uncategorized". Not changed: changing it would break Core's Sidebar area.
- **Console:** a handful of 400/403/404 resource errors appeared in the editor console during testing. They were not traced to a theme file; the likely source is test calls made before a REST nonce was available.
- **`languages/kits-by-wugweb.pot`:** the new strings are not in it; no extraction tool was available. Regenerate with `wp i18n make-pot`.
- **Not carried over from Frost:** the `shadow-light`/`shadow-solid` group and quote styles, list `no-disc`, social-links `outline`, the `mark` highlight, and Frost's per-block `theme.json` styling of code, preformatted, quote, pullquote, table, cover and comment blocks. Whether `kit.css` already styles those blocks was not checked.
- **Core block patterns** are still offered in the inserter (`remove_theme_support('core-block-patterns')` was not applied; decision pending).
- **Version 2:** adapt `hero-split`, `cta`, `card-grid`; image slot for `testimonials`.
- **Not tested:** Safari/Firefox, real assistive technology, the Site Editor's variant-swap UI (the variants are registered with the right block types, but swapping was not clicked through), and the `Colours: Ink` block-style variation.
