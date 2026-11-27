# Changelog

Kits by Wugweb. The same entries are in the Changelog section of `readme.txt`; `tests/ThemeValidationTest.php` checks that the two agree for the current version.

## 2.2.2 (27 Nov 2026)

- Fixed: the dark-mode theme toggle no longer wraps under the menu in the desktop header; the header is one row (75 px) instead of two (130 px).
- Fixed: the keyboard focus ring inside a header submenu panel is the Focus colour. It was the yellow meant for dark surfaces, 1.5:1 on the light panel.
- Fixed: in the Dark style variation and in dark mode, links in content read at 4.98:1 on Raised (was 4.37:1; `primary-dark` `#2188FF` is now `#3B94FF`).
- Fixed: form field focus keeps an outline in Windows high-contrast mode (`forced-colors`), where box-shadow is removed.
- Fixed: post titles on the blog, archive, search and index templates, and the "Nothing here yet" message, are `h2` under the page `h1` (they were `h3`, skipping a level).
- Removed the block-theme tag from the `style.css` header: Theme Check reports it as a wrong tag (it is not on the WordPress.org tag list).
- New theme screenshot (the front page, 1200 x 900 PNG) replaces `screenshot.jpg`; `readme.txt` has an Installation section, a copyright entry for the screenshot and the block style list brought in line with the code.
- Tests: contrast is now checked for every style variation (focus, status colours, buttons, muted text on each surface), `readme.txt` structure and changelog, screenshot size, tags and the header toggle row.

## 2.2.1 (26 Nov 2026)

- Theme details in Appearance > Themes show View details, Support and More links.
- The strings `kit.js` shows (Close search, the external-site label, Loading results) are translatable (`kitsI18n`, passed with `wp_localize_script`).
- Stacked card styling.

## 2.2.0 (25 Nov 2026)

- 47 patterns (starter pages, pricing, testimonials, team, portfolio, progress bars, header and footer variants and more), Blank and No title templates, block styles Reverse on mobile, Plain and Outline, and Code, Preformatted, Quote and Pullquote styling in `theme.json`.
- The breadcrumbs fallback is valid in the editor; the Sidebar template-part area works with or without Kits Core; links in the Ink colour set stay readable in dark mode.
- Section and Head band are Group styles; their padding, background and gap are set in Styles > Blocks > Group.
- Kits Hero block: height, colours, padding, border and shadow are block supports.
- Style variations under `styles/` (Dark, Forest, Slate and the Ink colour set), with the bundled Inter font declared once in `theme.json` (no Google Fonts request).

## 2.0.0

- Rebuilt: valid `theme.json` from the Kits tokens, a real header and footer, the full template set, cleaned patterns, Inter Tight bundled.
