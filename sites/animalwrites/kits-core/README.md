# Animal Writes site layer for Kits Core

What Kits Core carried for the Animal Writes site only, taken out of the plugin in Kits Core 1.4.0 so the plugin is neutral for every tenant (Wugweb, iKAN, others). The code moved here unchanged: option names, meta keys, hooks, REST routes, slugs and stored data are the same as before, so the live site behaves as it did.

This folder is NOT part of the Kits Core zip (the build only reads `themes/` and `plugins/`).

## Deploy alongside Kits Core 1.4.0

It needs Kits Core 1.4.0 or later. With an older Kits Core (which still contains the same functions) the layer does nothing, and it must not be loaded there on purpose, because the functions would be declared twice.

Load it as a must-use plugin:

1. Copy this folder to `wp-content/mu-plugins/animalwrites-kits-core/`.
2. Add a one-line loader `wp-content/mu-plugins/animalwrites-kits-core.php`:

   ```php
   <?php require __DIR__ . '/animalwrites-kits-core/kits-core-site.php';
   ```

Must-use plugins load before regular plugins, so `kits-core-site.php` waits for `plugins_loaded` (priority 1) and then loads the files in the order Kits Core used to load them. Only the uninstall and deactivation hooks (`includes/site-uninstall.php`) are registered at once, because Kits Core is deactivated before it is deleted.

Deploy order for the live site: put this layer in place first (it is inert under Kits Core 1.3.x), then update Kits Core to 1.4.0. Doing it the other way round leaves a gap with no campaign letters, volunteer or report forms, thumbnails or error pages until the layer is there.

## What is here

| Path | What |
| --- | --- |
| `kits-core-site.php` | The loader (version check, load order). |
| `includes/site-filters.php` | The values Kits Core's generic features now read through filters: error page folder, marker and 404 pictures, form reference prefixes (`AW-`, `AW-V-`, `AW-C-`, `AW-R-`), private-file capability, media group rules (listing, Library, press, campaign photos), media merge groups and meta keys, the `animal-writes` redirect, Edit screens' own names and folders, Overview pattern category, the first backup choice (on where it already ran), the one-time carry-over (`kits_aw_carryover_done`) and the campaign letters Dashboard box styling. |
| `includes/site-uninstall.php` | What Kits Core's uninstall and deactivation also clean up for the moved features (through `kits_core_uninstall_options`, `kits_core_uninstall`, `kits_core_uninstall_data`, `kits_core_deactivated`). Loaded even when Kits Core is not active. |
| `includes/campaign-letters.php`, `includes/forms/campaign-form.php` | The campaign letter tool's statistics and the Campaign form with the raw copy of every send (`aw_form_raw`, `kits_form_raw_capture`). |
| `includes/campaign-links.php`, `includes/taxonomy-rename.php` | The campaign link taxonomy (`aw_news` line) and the Tools → Taxonomy rename migration (`KITS_CAMPAIGN_LINK`, `KITS_MEDIA_GROUP`). |
| `includes/forms/volunteers.php`, `reports.php`, `form-pages.php` | The volunteer form, Report a mistake and the `animal-writes/*` form blocks, the thank-you page and the campaign end band. |
| `includes/thumbs.php`, `category-images.php`, `card-images.php` | Card pictures that never repeat (`aw_thumb_map`, `/aw/v1/thumb-dupes`), category photos and the placard fallback (Animal Writes logo). |
| `includes/tools/media-reuse.php`, `includes/tools/data/` | Media → Reuse pictures and its plan, and the duplicate file groups for Media → Duplicate files (live attachment IDs). |
| `includes/ops/retention.php` | Opportunity closing dates (`aw_opportunity`). |
| `includes/edit-fields.php` | The Library "Dated" (`aw_legal_dated`) and campaign "Metrics" (`aw_campaign_metrics`) edit fields, moved out of Kits Core 1.4.1. Loads only with Kits Core 1.4.1 or later; switch either off with the filter `animalwrites_edit_fields`; names the Library type `aw_legal` through `kits_library_post_type` (priority 5, so a later filter can change it). |
| `includes/ops/compat.php`, `includes/forms/compat.php`, `includes/compat-backups-error-pages.php` | The older `aw_` function names, as thin wrappers over Kits Core's `kits_` functions. |
| `assets/site/dropins/`, `assets/site/error/` | The branded 500 and 503 drop-ins (they carry the marker `Animal Writes error page`, a compatibility key: pages already in `wp-content` stay recognised and are updated in place) and the 404 pictures. |
| `assets/js/sponsored-blocks.js` | Editor script of the `animal-writes/sponsored-*` blocks (nothing in this repository registers it; it comes from the theme layer). |
| `assets/css/dashboard-letters.css` | The card look of the campaign letters Dashboard box (`#aw_cl_widget`), taken out of Kits Core's Dashboard cards. |
| `tests/` | `php tests/site-layer-tests.php`, `php tests/site-ops-tests.php`, `php tests/taxonomy-rename-tests.php`, `php tests/edit-fields-tests.php`. |

## Notes

- The site layer for the other plugins (`directoryweb/`, `rankweb/`) is next to this folder and is deployed separately.
- Plugins that call these functions (MailWeb, DirectoryWeb, RankWeb, SourceWeb) already guard with `function_exists()`/`defined()`, so they work with or without this layer.
- The drop-ins look for their own pictures in `wp-content/plugins/kits-core/assets/site/dropins/` and fall back to the Media Library photo, exactly as before. Those picture files are not in this repository.
- The `Animal Writes` text that remains in this folder is data for the live site (marker, media titles, labels), not product wording.
