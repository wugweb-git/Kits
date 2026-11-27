# Animal Writes site layer

What the distributed plugins used to carry for this one site. Not packaged (the build only reads `themes/` and `plugins/`).

Install: copy `rankweb/` to `wp-content/mu-plugins/animalwrites-rankweb/` and add a one-line loader `wp-content/mu-plugins/animalwrites-rankweb.php` containing `<?php require __DIR__ . '/animalwrites-rankweb/site.php';`.

- `directoryweb/site.php`: restores, through DirectoryWeb 1.2.3's filters, the 'Animals helped' and 'AWBI number' wording, the India PIN lookup and the India bounds for Near me. Copy it to `wp-content/mu-plugins/animalwrites-directoryweb.php`. Claim references now read `DW-C-` instead of `AW-C-`; existing stored references are unchanged.
- `rankweb/programmatic.php`: directory, category and tag titles and descriptions (the module RankWeb no longer has).
- `rankweb/defaults.php`: settings defaults (content types, hub and term titles, directory index list, brand words).
- `rankweb/site.php`: loads the two above and restores, through the plugins' filters, the contact, country, social profiles, publication name, page titles, geocoding identity, the redirect and 410 rules and the seed redirects, the site defaults (`rankweb_site_default_*`: other names, profiles, email, language, country, founding date), the Directory's scope words, the FAQ item block, the Breadcrumbs block's earlier name (`animal-writes/breadcrumb`, kept as an alias) and the `animal-writes` block namespace.

Not restored (shorter generic copy now): the media caption and description wording. The directory place description gets its scope words back through `rankweb_directory_scope`.

## Site operations list (retired 26 Nov 2026)

`docs/org/pending.md` also held the Animal Writes site's own task list: campaign pages (Diwali, community dogs, Supreme Court strays, lab rules), Home and Directory content, search and keyword fixes, social accounts, help-now and FIR state pages, owner-only server steps (`WP_MEMORY_LIMIT`, hPanel cron for `wp aw workers-tick`, Rank Math 404 log), dates and a done log. That is site content and operations, not product code; the product items from it are in each plugin's `PENDING.md`. The full text is in git history at `docs/org/pending.md`.
