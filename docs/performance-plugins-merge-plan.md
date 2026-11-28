# Performance plugins: what stays, what merges into Kits (plan, 28 Nov 2026)

Decision (owner, 28 Nov 2026): **Optimization Detective stays installed and active, with Image Prioritizer** (it is an
extension of Optimization Detective and cannot run without it). **Speculation Rules, View Transitions and Auto Sizes are
merged into Kits in the coming days**, then retired on each site. Nothing here is built yet; this is the plan.

## Where things stand (checked on animalwrites.in, 28 Nov 2026)
| Plugin | Version | Code size | What it does for the site today |
|---|---|---|---|
| `optimization-detective` | 1.0.0-beta7 | 3,151 PHP + 1,185 JS lines | Measures what real visitors see first. Stores 2,809 `od_url_metrics` posts. Kits Core's `includes/performance.php` ("Largest image preload fix") is built on its `data-od-removed-fetchpriority` marker. |
| `image-prioritizer` | 1.0.0-beta4 | 786 PHP + 179 JS lines | Uses those measurements for `fetchpriority`, the main-image preload and lazy loading. Needs Optimization Detective. Home page shows 2 high-priority images and 1 image preload. |
| `speculation-rules` | 1.7.0 | 520 PHP lines (396 are the settings screen) | Saved settings: mode `prerender`, eagerness `moderate`, signed-out visitors only. Core (WordPress 7.1.5) has the engine but defaults to a gentler prefetch. |
| `view-transitions` | 1.2.1 | 885 PHP, 241 JS, 133 CSS lines | Emits `@view-transition { navigation: auto }` and a `view-transition-name` rule. Nothing in the theme does this. |
| `auto-sizes` | 1.8.0 | 232 PHP lines | Core already adds `sizes="auto"`; the plugin also improves how `sizes` is calculated for image, cover and featured-image blocks. |

## Plan
Placement follows the decisions: Kits Core is optional (decision 2) and site-specific values stay out of plugins
(decision 3), so each item ships as a neutral default with a switch in Kits → Settings → Performance, the same pattern as
`performance.php` (`kits_perf_on`). The site's values (for example `prerender` and `moderate`) are saved settings, not code.

1. **Speculation Rules → Kits Core.** One filter on core's `wp_speculation_rules_configuration` (mode, eagerness) plus two
   settings fields. Core keeps its own safe exclusions. The plugin's settings screen is not carried over.
2. **View Transitions → theme CSS** (pure CSS, so the theme is the right place). `@view-transition { navigation: auto }`
   and the `view-transition-name` rule only if the current output uses it; the plugin's admin and JS are not carried over.
3. **Auto Sizes → Kits Core.** Port the `sizes` calculation and the three block filters (image, cover, post-featured-image),
   skipping the `sizes="auto"` step core now does, so it is never applied twice. Keep the GPL licence line and attribution.
4. **Optimization Detective and Image Prioritizer: unchanged.** Add a note in `performance.php` and the Kits Core readme that
   the preload fix depends on them. Merging them would mean forking about 5,300 lines of beta code.

## How each step is checked (before and after, on staging first)
- Speculation Rules: the `<script type="speculationrules">` JSON on Home and Directory is identical with the plugin off and Kits on.
- View Transitions: the emitted CSS for navigation and naming is equivalent.
- Auto Sizes: the `sizes` value of each image on a sample of pages (Home, a listing, a news item, a profile) is identical.
- Optimization Detective: still emits its markers; the Home page still shows the high-priority image and the preload.
- Kits Core tests for each new switch (on and off). The change is released from `kits-suite` like any other.

## Rollout
Staging first: merge, deactivate the plugin, run the checks. Then production the same way. A plugin is deleted only after
its check passes on that site. Until then deactivating it brings it straight back.

## Open
- Optimization Detective's stored measurements (2,809 posts) have no retention rule on this site; decide whether to set one.
- The licence line was readable for `view-transitions` and `auto-sizes` (GPLv2 or later); confirm it for `speculation-rules` before copying anything.
- A site without Kits Core loses these three features, by design (decision 2).
