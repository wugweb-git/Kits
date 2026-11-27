# Animal Writes site layer: PlanWeb

What PlanWeb carried for this one site until 0.4.1. PlanWeb 0.5.0 is neutral and does not ship it. Not packaged (the build only reads `themes/` and `plugins/`).

Deploy this alongside PlanWeb 0.5.0. Without it the live site loses its Kits → Dates calendar, the seeded dates and the Dates import into PlanWeb.

Install: copy this folder to `wp-content/mu-plugins/animalwrites-planweb/` and add a one-line loader `wp-content/mu-plugins/animalwrites-planweb.php` containing `<?php require __DIR__ . '/animalwrites-planweb/site.php';`.

- `team-dates.php`: moved from `plugins/planweb/includes/team-dates.php` byte for byte: `aw_team_dates()`, the context switch, the seeded and campaign dates and their one-off migrations, the Kits → Dates screen and the Dashboard box. Stored option names are unchanged.
- `migrate.php`: moved from `plugins/planweb/includes/migrate.php` byte for byte (names Animal Writes entry IDs 25181 to 25187; result option `planweb_migrate_1114`, unchanged).
- `site.php`: loads it, and restores through PlanWeb's filters `planweb_import_source` (option `aw_team_dates`, source value `aw_team_dates`, waits for `aw_team_dates_links_note_1111`) and `planweb_site_skip_types` (`aw_news`, `aw_listing`).
- `tests/site-tests.php`: the Animal Writes live-text checks for the personal-data rule. Run `php sites/animalwrites/planweb/tests/site-tests.php` from the repo root.

Kits Core and Animal Writes Core may still call `aw_team_dates()`; it is defined here again once this layer loads.
