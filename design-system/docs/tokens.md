# Tokens

Source of truth: `design-system/tokens/*.json`, in the W3C design tokens (DTCG)
format (`$value`, `$type`). Tokens Studio and Style Dictionary v4 both read it.

## Files

| File | Holds |
|---|---|
| `color.json` | neutrals, brand colours, service colours, semantic `bg` / `surface` / `fg` / `accent` / `line`, selection |
| `typography.json` | font families and weights, static (`ts-*`) and fluid (`fluid-*`) sizes, roles (`t-*`), line heights, tracking, measure |
| `spacing.json` | `gap-*`, `space-*`, `p-*`, safe areas, section spacing |
| `radius.json` | `r-*`, `radius-*`, chip radius |
| `effects.json` | shadow, elevation, opacity, stroke, blur, glass, noise, gradient, hover, focus, cursor |
| `motion.json` | duration, easing, transition |
| `layout.json` | breakpoints, layers (z-index), shell, grid, nav, header, article and block sizes |
| `modes/md.json`, `modes/lg.json`, `modes/lg-dvh.json` | values that change at 768 and 1200 (`modes/index.json` names the media query for each) |

## Names

A token's path joined with `-` is its CSS variable: `color.surface-page` is
`--color-surface-page`. A name that is also a group keeps the bare token under
`_`: `bg._` is `--bg`, next to `bg.elevated` (`--bg-elevated`).

A reference is written `{gap.4}` and builds to `var(--gap-4)`.

## Build

```bash
npm run ds:tokens:build
```

Writes `design-system/build/css/variables.css` (the `:root` block plus one block
per mode) and `design-system/build/js/tokens.js` (resolved values). Values are
copied exactly; nothing is converted.

## Package

`packages/design-tokens` publishes these as `@wugweb-git/kits-tokens` on GitHub
Packages: `variables.css`, `tokens.js` and the JSON source. Release: bump its
`version`, merge, push the tag `tokens-v<version>`. See that package's README for
install (a `read:packages` token is needed to install).

## Tokens Studio

The folder is set up for Tokens Studio's multi-file GitHub sync: `$metadata.json`
holds the set order, `$themes.json` three viewport themes (Base, Tablet 768+,
Desktop 1200+, each stacking the narrower one). In the plugin: Sync, GitHub,
repository `wugweb-git/Kits`, branch `kits-suite` (or a working branch), file path
`design-system/tokens`. The build ignores the two `$` files.

## Where the values came from

Imported on 2026-11-26 from the live wugweb.com stylesheet
(`wugweb_site/src/styles/global.css`, 395 base tokens and 24 mode overrides):

```bash
node scripts/import-css-tokens.mjs ../wugweb_site/src/styles/global.css
node scripts/check-tokens-match-css.mjs ../wugweb_site/src/styles/global.css
```

The second command checks that the build matches that stylesheet exactly. The
import is one-way and is not meant to be rerun once these files are edited here.
CSS comments next to a token are kept as its `$description` and written back as a CSS comment by the build. Two `--grid-cols` overrides on `.grid` are component CSS and stay in the site.

The WordPress theme keeps its own tokens in `themes/kits-by-wugweb/tokens/`.
