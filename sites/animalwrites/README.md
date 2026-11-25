# Animal Writes site layer

What the distributed plugins used to carry for this one site. Not packaged (the build only reads `themes/` and `plugins/`).

Install: copy `rankweb/` to `wp-content/mu-plugins/animalwrites-rankweb/` and add a one-line loader `wp-content/mu-plugins/animalwrites-rankweb.php` containing `<?php require __DIR__ . '/animalwrites-rankweb/site.php';`.

- `rankweb/programmatic.php`: directory, category and tag titles and descriptions (the module RankWeb no longer has).
- `rankweb/defaults.php`: settings defaults (content types, hub and term titles, directory index list, brand words).
- `rankweb/site.php`: loads the two above and restores, through the plugins' filters, the contact, country, social profiles, publication name, page titles, geocoding identity, the redirect and 410 rules and the seed redirects, the site defaults (`rankweb_site_default_*`: other names, profiles, email, language, country, founding date), the Directory's scope words, the FAQ item block, the Breadcrumbs block's earlier name (`animal-writes/breadcrumb`, kept as an alias) and the `animal-writes` block namespace.

Not restored (shorter generic copy now): the media caption and description wording. The directory place description gets its scope words back through `rankweb_directory_scope`.
