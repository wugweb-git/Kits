# Animal Writes site layer for InsightWeb

Deploy this alongside InsightWeb 1.2.0 on the Animal Writes site. InsightWeb 1.1.x carried these for this one site; 1.2.0 does not. It is PHP, not part of the InsightWeb zip.

Install: copy this folder to `wp-content/mu-plugins/animalwrites-insightweb/` and add a one-line loader `wp-content/mu-plugins/animalwrites-insightweb.php` containing `<?php require __DIR__ . '/animalwrites-insightweb/site.php';`.

What it does, through InsightWeb's filters and actions:

- `links-seed.php`, `data/links-2026-11-02.php`: the known-links seed (25 Oct and 2 Nov 2026 reads), moved unchanged. Runs on the action `insightweb_si_links_seed` (schema install, opening the Links tab). Its markers (`aw_si_links_seeded`, `aw_si_links_seeded_20261102`) are cleared on `insightweb_si_dropped` (Delete Search Insights data). `wp aw-si-links seed [--force]` replaces `wp aw-si links seed`.
- `site.php`: keeps visitor counting on when the counter table already holds rows and no choice is stored (the 1.1.4 rule that 1.2.0 dropped); the brand pattern (`insightweb_brand_pattern`); the Rising lists, anchor topic and extra exclude words (`aw_si_rising_lists`); the topic words (`aw_si_species`); the PHP-error links to the public repository (`aw_si_srv_repo_dirs`, `aw_si_srv_repo_url`).
- `tests/site-layer-test.php`: `php sites/animalwrites/insightweb/tests/site-layer-test.php`.

If this layer is not deployed the site loses the seed rows it has not already stored (stored rows stay), starts with visitor counting off if no choice was stored, and its Rising worker lists are empty.
