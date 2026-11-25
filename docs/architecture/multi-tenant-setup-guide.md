# Multi-tenant setup and brand customisation

**Status (25 Nov 2026):** describes what the code does today and what is decided but not yet built. Every statement is labelled **Implemented**, **Decided, not built** or **Open**. Evidence and the full audit are in `docs/audit/`.

## 1. Model

- **Per installation.** Each independent WordPress installation has its own brand configuration, stored in that site's database. On Multisite each site keeps its own (the option is per site; a Multisite run has not been done yet, so this is expected rather than verified).
- **No network or SaaS-managed branding** in this phase. The design must stay extensible so it can be added later without a redesign (**Decided**).
- **The theme owns no tenant branding and does not need Kits Core.** Kits by Wugweb works on its own; Kits Core adds the tenant layer (**Decided**).

## 2. Layers

Intended order, lowest to highest (**Decided**):

1. WordPress and Kits defaults.
2. Kits theme `theme.json`.
3. Kits Core tenant brand values, merged through `wp_theme_json_data_theme`.
4. User customisations made in the native Site Editor (Styles).

| Layer | Status |
|---|---|
| 1, 2, 4 | **Implemented** (WordPress core and the theme) |
| 3 | **Decided, not built.** Kits Core has no `wp_theme_json_data_theme` filter. Today the Brand Customizer prints CSS custom properties in `wp_head` (priority 100) and in the block editor, outside `theme.json`. That CSS wins over the user's Site Editor changes and "Reset styles" does not restore it |

Findings that shape the build (WordPress 7.1.5 probe, `docs/audit/wp-api-probe.md`): list presets such as the colour palette are replaced as a whole, so the filter must merge by slug and return the full list; resolved theme data is cached, so Core must clean the cache when tenant values change and when it is activated or deactivated; with the filter in place, a Site Editor change wins and "Reset styles" returns to the tenant baseline.

## 3. Style variations and colour sets (**Implemented**)

Theme variations: **Dark**, **Forest**, **Slate** (`styles/*.json`). Block colour set: **Ink** (`styles/colours/ink.json`), a style for Group and Post Content blocks, not a site variation. Slate matches the default palette except two slots. A tenant's brand values sit below any variation the user picks.

## 4. Tenant presets in Kits Core (**Implemented**, values from `brand-customizer-model.php`)

| Token | Default | Modern Tech & SaaS | Editorial & Publication | Eco & Community |
|---|---|---|---|---|
| Accent | `#FFBE1A` | `#2563EB` | `#C2410C` | `#059669` |
| Accent contrast | `#0062b8` | `#1D4ED8` | `#7C2D12` | `#065F46` |
| Canvas | `#F4F4F4` | `#F8FAFC` | `#FDFBF7` | `#F4FBF7` |
| Ink | `#191919` | `#0F172A` | `#1C1917` | `#064E3B` |
| Body text | `#2E2E2E` | `#334155` | `#44403C` | `#1E3A2F` |
| Control / card radius | 8px / 12px | 6px / 10px | 2px / 4px | 9999px / 16px |
| Wide width | 1200px | 1280px | 1160px | 1200px |
| Section spacing | 48px | 56px | 64px | 48px |

Known problems (see the audit):
- **Open:** the Default accent `#FFBE1A` does not match the theme's own `primary` (`#C6D2E0`). Because the compiler skips values equal to its default, the screen shows gold while the site renders the theme colour. The canonical accent is an owner decision (`docs/audit/owner-decisions.md`, OD1).
- The three tenant profiles are hard-coded in the plugin; they should become data supplied through a filter (**Decided, not built**).
- Editorial and Eco presets name fonts (Georgia, Plus Jakarta Sans) that the theme does not bundle; only Inter is bundled.
- There is no contrast check on tenant colours, and the theme's dark mode does not follow tenant colours (a dark-mode rule is proposed in `wp-api-probe.md`, awaiting confirmation).

## 5. Setting up a new site

1. Install and activate the theme (**Appearance, Themes**). It is fully usable at this point.
2. Optionally install and activate Kits Core to get the Brand Customizer (**Kits, Brand Customizer**, also under **Appearance, Brand Tokens**). Companion plugins (DirectoryWeb, RankWeb, MailWeb, SourceWeb, InsightWeb, PlanWeb) are independent and optional.
3. Apply a preset or set individual colours, radii and widths, then save. **Implemented behaviour today:** the values are written to one option (`kits_brand_tokens`), compiled to CSS custom properties, printed in `wp_head` and the block editor, and a LiteSpeed purge action is fired. **Decided:** the same values will feed Layer 3 instead.
4. Refine in the Site Editor (**Appearance, Editor, Styles**). Those changes are the user's and stay authoritative until reset.

## 6. Reset (**Decided, not built**)

Reset must restore the tenant's brand preset and must not delete the tenant configuration. Today the Brand Customizer's Reset deletes the option. A separate, confirmed "clear brand" action is proposed for removing it.

## 7. Moving settings between sites (**Implemented**)

The Brand Customizer exports and imports its tokens as JSON. Import sanitises each token. `kits_brand_tokens` is **not yet** part of Kits Core's settings transfer, uninstall list or uninstall backup (**Open**, tracked as G21).

## 8. Shortcodes and native blocks

Keep new content on native blocks and Block Bindings (`kits/post-field`). Kits Core currently registers one block, `kits/hero`; `directoryweb/people` and `mailweb/newsletter` are registered by their plugins. Blocks named in older documents (`kits-core/countdown`, `kits-core/category-hub`, `directoryweb/search`, `sourceweb/attribution`) have **not** been verified in this repository and should not be relied on until each plugin documents them.
