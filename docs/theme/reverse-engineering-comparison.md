# Reverse-engineering comparison: reference theme and Kits by Wugweb

Status: **done for everything that can be measured from files and a WordPress Playground render (27 Nov 2026, theme 2.2.2).** What cannot be done without a person or a real device is listed in section 6.

The reference theme is Frost 1.0.10 (see `frost-pattern-integration.md` for the file catalogue). Nothing from it is copied: every Kits rule below was written from the Kits design system.

**How to read the two columns.** The Kits column is measured in this run (files plus a Playground render, WordPress 7.1.x, PHP 8.2, Chromium 1243 driven by script). The reference column is what the 25 Nov record (`frost-pattern-integration.md`, and the matrix that preceded this file) wrote down about Frost 1.0.10. Frost was **not downloaded again** in this run, so the reference column is "as recorded", not re-measured. Where a row says "recorded", that is why.

## 1. Differences and the reason for each

| Area | Reference (recorded) | Kits (measured) | Difference and reason | Action |
|---|---|---|---|---|
| Fluid typography | `typography.fluid` on | `typography.fluid: false`, but 10 of 12 size presets are written as `clamp()` from the Kits tokens. Rendered `h1`: 32 px at 375, 39.6 at 768, 48 at 1200, 1600 and 1920. Body 15 to 16 px, `h3` 20 to 22, `h4` 17 to 18. | Core's fluid mode would compute a second min/max per preset from the same values and drift from the tokens (`tokens/tokens.json` is the source). Kits is fluid already, and the editor and the front end use one rule. | None. Reason recorded. |
| Drop caps | present in `theme.json` | `typography.dropCap` is not set, so core's default applies and the control is available. Rendered: `float: left`, `8.4em` (134 px on a 16 px paragraph), weight 100. | A decorative first letter; it does not change what a screen reader reads. Core's default is thin and very large against Inter. Not an accessibility or robustness defect. | None. If a site wants a quieter cap it sets it in Styles > Typography. |
| Gradients and duotone | present | `defaultGradients: false`, `defaultDuotone: false`, none defined | Kits is a flat brand. Free gradients and duotones are a way to put text on a colour nobody contrast-checked. | None. |
| Custom weight and line-height maps | present | Inter is one variable file declared `100 900`, so any weight renders. Weights are tokens (`--kit-h1-weight` ... `--kit-h6-weight`, default 700 and 600). Line heights are a map in `settings.custom.line-height` (sm 1.5, md 1.5, lg 1.55, heading 1.15). | `theme.json` has no weight preset, so a map would be a custom property in either theme. Kits keeps it in the tokens. | None. |
| Defaults off (palette, sizes, spacing, shadows, aspect ratios) | off | all `false` (`defaultPalette`, `defaultFontSizes`, `defaultSpacingSizes`, shadow `defaultPresets`, `defaultAspectRatios`) | Same decision, recorded in the integration doc: core presets would sit beside the tokens and bypass the design system. | None. |
| Block styles in `theme.json` | 25 blocks | 13 blocks under `styles.blocks`, 10 `styles.elements`, and 8 block-style variations in `theme.json` (Button x3, Group x4, Separator x1). 15 block styles are registered in `inc/blocks.php`. | Blocks without an entry are styled in `kit.css`. The cost is that those are not editable in Styles > Blocks. The gain is that behaviour (hover, lift, clamp, motion) that `theme.json` cannot express stays next to its markup. | None now. The remaining blocks can move into `theme.json` one at a time; no accessibility reason to hurry. |
| Forms, `mark`, `th`, focus (`style.css`) | present | Global rule `:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible` (3 px, token colour and offset). Walked by keyboard on the home, single post, page and search: 38 to 39 stops each, every theme stop has an indicator (the only stops without one are the two WordPress admin-bar inputs). Core comment, search and password fields: 16 px on a 375 px phone (no iOS focus zoom), border `#949494` (3.0:1). `mark` is the browser default (black on yellow). | Core's field borders already meet 3:1, so Kits does not restyle them (a light Kits line would not). The one gap was `.kit-form` fields, whose ring is a `box-shadow`, which Windows high-contrast mode removes. | **Implemented**: `forced-colors` outline for `.kit-form` fields (section 2, item 3). |
| Navigation overlay and submenu | CSS rules | Overlay opens at 1199 px and below (Kits CSS, not core's 600). Dialog has `role="dialog"`, `aria-modal="true"`, `aria-label="Menu"`; close button is labelled "Close menu"; after 8 Tab presses focus is still inside the overlay; Esc closes it and focus returns to the open button. Submenu: the toggle is a button with `aria-expanded` and the label "Products submenu"; Enter opens, Esc closes and focus returns to the toggle. | Behaviour is core's (Interactivity API); Kits adds look only. Two defects found, both fixed (section 2, items 1 and 2). | **Implemented**: toggle wrap, submenu focus colour. |
| Breakpoints 600 and 782 | 600 and 782 | Kits uses 768 and 1200 (kit.css: 24 `min-width: 768px`, 24 `max-width: 767px`, 13 `min-width: 1200px`, 6 `max-width: 1199px`; kits.css adds 781 for Reverse on mobile). No horizontal overflow at 375, 600, 781, 782, 783 (script). | 768 and 1200 follow the Kits layout tokens (tablet, desktop). 781 is core's own Columns stacking point and is used only where the Kits style must follow it (Reverse on mobile). Between 768 and 781 core stacks Columns while Kits applies its tablet rules: a 14 px band, no overflow or overlap seen in it. | None. |
| Patterns | 50 files (18 are `-dark` duplicates) | 47 patterns, 3 categories. This run changed one (`empty-state`, heading level). | Dark is a runtime switch (`data-theme`), not a second pattern. Block-level catalogue: `frost-pattern-integration.md`. | Heading level fixed (section 2, item 5). |
| Templates and parts | 9 templates, 2 parts | 10 templates (adds `blank`, `no-title`, `page-wide`; the rest as core), 4 parts (header, footer, sidebar, newsletter) | Kits keeps inline parts and offers variants through patterns; the sidebar and newsletter parts belong to Kits Core and the page layout. | None. |
| Variations | 7, colour only | 3 JSON variations (Dark, Forest, Slate) plus the Ink colour set. Contrast computed for every one (section 3). | Frost's palettes are Frost's brand; excluded by decision. Kits Dark had a link colour under 4.5:1 on Raised, now fixed. | **Implemented**: Dark link colour. |

## 2. Differences implemented, with the reason and the evidence

Only changes that are clearly an improvement to accessibility or robustness were made. Each is covered by a test in `tests/ThemeValidationTest.php`.

1. **The dark-mode toggle no longer wraps under the menu.** The toggle button is injected inside the header `nav`; the nav is `flex-wrap: wrap` and shrink-to-fit, so on desktop the button dropped to a second row. Measured at 1200 px: nav 205 x 106 px, toggle at y 106, header 130 px tall. Fix: `.kit-header-right > .wp-block-navigation { flex-wrap: nowrap; align-items: center; }`. After: nav 154 x 44, toggle on the same row, header 75 px (also 75 px at 1024 and 375). Reason: a two-row header pushes content down and breaks the visual order of the controls.
2. **Focus ring inside a header submenu panel.** The header is a dark surface, where Kits switches the focus colour to yellow. The submenu panel is light, and yellow on white is 1.5:1 (WCAG 2.4.11 / 1.4.11 want 3:1). The panel now sets `--kit-color-focus` to the Focus preset. After: ring `rgb(0, 98, 184)` on the white panel, 6.1:1.
3. **Form field focus in forced-colors mode.** `.kit-form` fields drop the outline and draw a `box-shadow` ring; Windows high-contrast removes box-shadows, leaving no indicator. Added `@media (forced-colors: active)` with a `CanvasText` outline. Not testable in Chromium without the OS mode, so this one is checked in the CSS only.
4. **Dark variation link colour.** `primary-dark` was `#2188FF`: 4.37:1 on Raised `#21262D`, under 4.5:1 for text. It is now `#3B94FF` (4.98:1 on Raised, 6.19 on the page, 5.66 on Surface), in `styles/dark.json` and the matching runtime tokens in `assets/css/kits.css`.
5. **Heading levels.** Post titles in the blog, archive, search and index templates and the "Nothing here yet" empty state were `h3` under the page `h1` (heading list `1 3`). They are `h2` now (`1 2`). The card CSS forces the card title size, so the look is unchanged; the empty-state keeps its size through the `2-x-large` preset.
6. **`block-theme` tag removed from `style.css`.** Theme Check reports it as a wrong tag; it is not on the WordPress.org list. `full-site-editing` stays.

## 3. Contrast across the style variations (computed from the palette files)

A palette is the base `theme.json` palette with the variation's overrides. Ratios are WCAG 2.x.

| Set | Text on page | Muted on Raised | Link on Raised | Focus on Raised | Button text on ink | Worst status colour on its tint |
|---|---|---|---|---|---|---|
| Base | 12.35 | 6.01 | 6.11 | 6.11 | 17.58 | 4.79 |
| Dark | 12.26 | 4.95 | 4.98 (was 4.37) | 6.03 | 17.39 | 4.56 |
| Forest | 12.35 | 6.01 | 6.48 | 6.48 | 17.58 | 4.79 |
| Slate | 12.35 | 6.01 | 8.64 | 8.64 | 17.58 | 4.79 |

The tests require, for every variation and for all three surfaces (page, Surface, Raised): text and muted text at 4.5:1, link colour at 4.5:1, focus at 3:1; the default button, the Brand button (ash `#191919` on the accent) and the error, success and warning colours on the page and on their tints at 4.5:1. The Ink colour set and the progress bar keep their own tests from 25 Nov.

Not a text colour, so not required to reach 4.5:1: the accent (`primary`) against the page is 1.39 to 1.49 in the light sets. The accent is used as a fill (buttons, chips) with dark text on it, and links in content use `primary-dark`.

## 4. Landmarks, skip link, headings (rendered in Playground)

Theme only (no Kits Core), 1200 px, logged in as admin. Pages: blog home, single post, page, 404, search with and without results.

| Check | Result |
|---|---|
| `lang`, `viewport`, a unique `<title>` | present on all six |
| `header`, `main`, `footer` | exactly one each on all six |
| Skip link | "Skip to content" with a real target (`#wp--skip-link--target`) on all six |
| `nav` | "Main", "Footer links 1", "Footer links 2", "Policies": all named |
| `search` landmark | on 404 and search; the no-results search page has two search forms (the template's own and the empty-state's), both unnamed |
| `h1` | exactly one on every page |
| Heading order | home `1 2`, single `1 2 3`, page `1`, 404 `1`, search `1 2` (was `1 3`) |
| Images without `alt`, unnamed links and buttons, unlabelled inputs | none (the only flagged input is the comment form's submit button, which has a value) |

With Kits Core active the same pages have a named `main` (`aria-label` set by `plugins/kits-core/includes/landmarks.php`) and "Skip to content" points at `#main`. On the 404 page that label is "Archives", which does not describe it. That file belongs to Kits Core, so it is reported, not changed, here.

## 5. Left as they are (warnings, with the reason)

- The commercial ZIP carries an `Update URI` header (self-hosted updates through Kits Core). Theme Check marks it REQUIRED for a directory upload; the build's wordpress.org track (`--track wporg`) strips it and passes with no warning. This is by design.
- Two unnamed search landmarks on the no-results page (section 4). Naming them needs a label on the search block in the empty-state pattern, which is also used on pages without a second search. Low impact; recorded.
- Drop cap and the remaining `kit.css`-only blocks (section 1).

## 6. Not done, and why

- **Real screen reader (VoiceOver, NVDA, JAWS, TalkBack):** needs a person and the software. Names, roles, states and focus order were checked by script only.
- **Safari proper and real iPhones and Android phones:** not available here. WebKit and Firefox runs from 25 Nov stand in; this run used Chromium only.
- **Windows high-contrast mode (`forced-colors`) rendering:** needs Windows. The rule is in the CSS and tested as text.
- **Reference theme re-measurement:** the reference column is as recorded on 25 Nov; Frost was not downloaded again.
- **Visual render of Dark, Forest and Slate through the Site Editor:** unchanged from 25 Nov; their contrast is computed from the palette files.
