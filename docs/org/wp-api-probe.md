# WordPress API probe: tenant layer through `wp_theme_json_data_theme`

Run: 25 Nov 2026, WordPress 7.1.5 in Playground, Kits theme active, a scratch must-use plugin (outside the repo). Scenarios A to G below. Source for the probe is not in the repo (Playground scripts stay outside it for now).

| # | Scenario | Result |
|---|---|---|
| A | Baseline, no filter active | palette has 19 theme colours, `primary` is `#C6D2E0` |
| B | Option set, theme.json cache not cleared | **no change**: the resolved settings are cached |
| C | After `wp_clean_theme_json_cache()` | `primary` is the tenant value; with a filter that merges by slug all 19 colours remain |
| D | Site Editor user style changes `primary` | user value wins, origin `custom` appears |
| E | Reset: the user record is written empty (what "Reset styles" does) | tenant value is back, theme default is not |
| F | Tenant option deleted, cache cleaned | theme default returns |
| G | `update_with()` with a palette that lists only the changed slug | **the whole theme palette is replaced**: 19 colours became 1 (or 2), `canvas` and the rest vanished |

## What this means for the implementation
1. The layer works as the owner described: theme.json, then Core tenant values, then user styles; Reset returns to the tenant baseline; removing the tenant option returns the theme default.
2. List-type presets (colour palette, font families, spacing and size scales) are replaced as a whole, not merged by slug. The Core filter must read the current list from the data it receives, replace entries by slug, and send the full list. The list can arrive flat or keyed by origin; handle both.
3. Resolved theme data is cached. Core must call `wp_clean_theme_json_cache()` when tenant values change (save, reset, preset apply, import) and on plugin activation and deactivation, so removing Core does not leave tenant colours cached.
4. User styles are only saved with the right capability: the probe had to act as an administrator (a request without `unfiltered_html` had its JSON stripped).
5. Not verified by this probe: Multisite (expected per site, since the option is per site and the cache is per site), persistent object cache behaviour, font family and radius presets (same replace semantics expected), `styles.css` as the carrier for dark-mode values.

## Dark mode proposal (needs owner confirmation before build)
The theme's dark mode is a set of fixed values in `kits.css` under `html[data-theme="dark"]`, so a tenant colour would not follow it. Proposed: tenants provide light values only; Core derives dark `primary` and `primary-dark` (lightened until they reach 4.5:1 on the dark canvas) and carries them to the page through the same theme.json layer (`styles.css`), leaving the theme's neutral dark palette alone. An optional explicit dark value per token overrides the derivation. The Dark style variation stays a user choice above the tenant layer.
