# wp-admin IA inventory (12 Nov 2026)

**Status (25 Nov 2026):** Finished items were removed from this file on 25 Nov; what is left is open or "keep". The menu snapshot is from the Animal Writes wp-admin on 12 Nov and has not been re-checked against the live site. Nothing here is deployed.

Target layout: content menus first, then one block of Wugweb products (each its own top-level menu, the same with or without Kits Core), then third-party plugins as their vendors ship them.

## Open

| Item | Where | Note |
|---|---|---|
| Empty last menu item | wp-admin side menu | Seen on live only; no empty-title submenu found in code. Find on live, then remove. |
| Tools tab (RankWeb) and Help tab (PlanWeb, MailWeb) | `rankweb-ui.php`, `planweb-ui.php`, `mailweb-ui.php` | Wait for the owner's reference list. MailWeb already has a Help card on its Dashboard; RankWeb has a Tools card (owner, 14 Nov: no Tools tab, `docs/pending.md`). |
| Place intros into Listings › Places | `directoryweb-ui.php:174`, `place-intros.php` | Still a separate tab and submenu. Claims stays read-only (owner). |
| `kits_link` and `kits_options_link` | Kits Core `admin-home.php:53`, `admin-screens.php:854` | Identical bodies; merge into one. |
| Renaming the developer parts of Kits › Help | `admin-menu.php:187-190` | Help already has Docs, Design system and "Developer: extra settings"; rename only if the owner asks. |

Dropped by the owner on 25 Nov (no tabbing or regrouping): grouping the InsightWeb (10) and SourceWeb (12) tabs.

## Menu snapshot: keep (12 Nov)

| Menu › submenu | Owner (file) |
|---|---|
| Dashboard › Home, Updates; Simple History | core; Simple History |
| Directory › Directory, Add Listing | CPT `aw_listing` |
| News › News, Add News item; Social posts | CPT `aw_news`; CPT `aw_social` (kept in Kits: Animal Writes is the site layer and goes with the child theme, plan 4.3; owner, 12 Nov) |
| Resources, Pages | core |
| Library › Library, Add Library item | CPT `aw_legal` |
| Opportunities | CPT `aw_opportunity` |
| Campaigns › Campaigns, Add Campaign, Letter report | CPT `aw_campaign`; `campaign-letters.php` |
| Press coverage › All coverage, Add coverage | CPT `aw_press` (`press.php`) |
| Media › Library, Add Media File, Media groups, Make WebP, Duplicate files, Reuse pictures | core; `kits_media_group`; `media-webp.php`, `media-merge.php`, `media-reuse.php` |
| Classification › Categories, Tags, Linked campaigns | `admin-ia.php` |
| Appearance › Themes, Editor, Fonts, Theme Check | core; Theme Check |
| Kits, DirectoryWeb, SourceWeb, RankWeb, InsightWeb, MailWeb, PlanWeb | each plugin's own `add_menu_page()` at 58.1 to 58.7, separator `separator-wugweb` at 58.05 |
| Tools › Plugin Check (3 items); Settings › Performance, Plugin Check, Simple History | third party |
| Site Kit, LiteSpeed Cache, FluentCRM, Fluent Forms (with Claims), UpdraftPlus | third party |
| `aw-keys` (Kits › Keys), `aw-modules` (Kits › Modules), `aw-dates` (redirect to PlanWeb), `aw-theme-parts` and `kits-docs` (redirect to Kits › Help) | keep in Kits (as above) |

## Done, no longer listed

Fluent Forms › Claims; Linked campaigns under Classification; Press menu defined once; Kits as its own top-level menu and the Wugweb menu block (13 Nov, no Kits Core helper); redirects for `kits-fonts`, `kits-design-system`, `aw-cron-health`, `aw-core`; Edit the theme links on Kits Home; every option, term-meta and post-meta field in the old section 6 (12 Nov); `kits_term_url` duplicate; Rank Math "Black Friday Sale" link (`kits-core/includes/admin-layer/tidy.php:100`); `mailweb_crm_*` / `aw_crm_*` (the `aw_crm_*` names are wrappers in `mailweb/includes/fluentcrm-compat.php`); `aw_core_link` and `aw_theme_parts_link` (gone); shell and classic twins (classic screens removed, the shell is the one screen); Theme Options mapped to the Site Editor (`kits_options_link`, `site-editor-links.js`); Create Block Theme and Link Whisper status in the plugin table (`docs/plugins/plugin-map.md`).

Kept per plugin on purpose (independence): `*_simple_table`, `*_rest_can`, `aw_seo_api_allowed` / `aw_si_api_allowed`.
