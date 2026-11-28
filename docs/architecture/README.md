# Architecture

Repository: `wugweb-git/Kits`, default branch `kits-suite` (`main` is kept equal to it).

## One repository, independent products

The repository is the development and governance boundary. It is not a runtime boundary: each plugin and the theme has its own bootstrap, namespace, version, changelog, build, tests and release, and installs and runs alone. No plugin requires a sibling plugin. Kits Core is an optional add-on that supplies the shared admin shell and a few extras when it is present.

```
plugins/            kits-core, directoryweb, rankweb, sourceweb, insightweb, mailweb, planweb
themes/             kits-by-wugweb (block theme)
packages/           shared source: design-tokens, design-system, admin-shell, shared-php, shared-js,
                    automation-contracts, rankweb-core, and one shell per plugin
sites/animalwrites/ the Animal Writes site layer: one folder per plugin, loaded as must-use plugins
tools/              build, validate, release, playground, ci, package, tokens
.github/workflows/  ci-suite, release-product, pages, plugin-check, release-tokens, release
design-system/ skills/ agents/ marketplace/ tests/ scripts/ reports/ vendor/
src/ + index.html   Brand OS design-system app (Vite); Wugweb_Brand_OS_Foundation/ is its reference
docs/               this folder, the current status report, and history/
```

There is no `workers/` folder, no `animal-writes-core` plugin and no package-manager workspace. SourceWeb's scheduled jobs run in the separate repository `wugweb-git/sourceweb-workers`. Each plugin has its own `package.json` (and `composer.json` where it needs PHP packages). WordPress Playground tooling has its own `package.json` in `tools/playground/`. The root `package.json` serves only the Brand OS app and the token scripts.

## Inside a plugin

`<slug>.php` (header, version constant, loader), `includes/` (PHP), `src/` compiled to `build/` (React screens on the Kits shell), `assets/`, `languages/`, `tests/`, `readme.txt`, `CHANGELOG.md`, `PENDING.md` (open work). Each plugin has its own REST namespace (`<slug>/v1`), its own admin menu (one item under Plugins, folded) and its own uninstall path.

## Shared code is copied, not required

Because a plugin must stand alone, shared behaviour is generated into each plugin with its own function prefix. `tools/build/gen-more-page.py` writes the More from Kits page into every plugin; `--check` fails CI if a copy drifts. Shared tooling (one build script, one validator set, one CI and release workflow) lives in `tools/`.

## Tenant neutrality

No plugin names a site. A plugin asks for a role or a value through a filter (for example `rankweb_post_type_roles`, `sourceweb_starter_sources`, `planweb_import_source`, `directoryweb_meta_fields`, `kits_features`) and a site supplies it. Everything specific to Animal Writes lives in `sites/animalwrites/<plugin>/`. `tools/validate/check-visible-brand.py` fails CI if the site's name, its registration bodies or its domain appear in a plugin string. Stored option, meta and REST names that begin `aw_` are kept so existing data keeps working.

## Two build tracks

`tools/build/build-dist.py` builds each product twice: a commercial zip that keeps the `Update URI` header (sites update from the registry) and a WordPress.org zip without it. The More from Kits page is left out of the WordPress.org build, since that directory forbids installing code from other sources.

## Release and update path

Version bump, CI on the exact commit, `release-product.yml` for one product, a tag and two zips with SHA-256 sums, `pages.yml` rebuilds the product pages and `registry/index.json` on GitHub Pages. A site on the commercial build reads the registry (cached 12 hours), offers the update and checks the SHA-256 before it installs. Details: `docs/operations/README.md`.

## Verification tooling

`tools/playground/` builds WordPress Playground blueprints (`build-blueprints.py`, checked in CI), audits every server-rendered admin screen with a plugin installed alone (`admin-audit-standalone.py`), runs smoke, Plugin Check and Theme Check, and serves the whole suite locally (`serve-suite.py`).
