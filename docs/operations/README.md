# Operations

## Release one product

1. Raise the version in the plugin header, the version constant, `readme.txt` (Stable tag and changelog) and `CHANGELOG.md`.
2. Run `python3 tools/validate/check-versions.py`, `check-held-code.py` and `check-visible-brand.py`, and the plugin's tests.
3. Push to `kits-suite` and wait for "Kits Suite CI/CD" to pass on that commit (`gh run watch <id> --exit-status`). Do not push while a needed run is in flight.
4. Run `gh workflow run release-product.yml --ref kits-suite -f product=<slug> -f prerelease=false`, one product at a time. It tags `<slug>-v<version>` and attaches `<slug>.zip`, `<slug>-wporg.zip`, `SHA256SUMS` and a release JSON.
5. "Product pages and registry" rebuilds `https://wugweb-git.github.io/Kits/registry/index.json`.

Pre-releases reach only a site whose `kits_update_channel` option is `pre`.

## CI

`ci-suite.yml` runs the version, held-code and visible-brand checks, every plugin test (test files are listed explicitly in the workflow), `tools/build/gen-more-page.py --check` through `tools/validate/more-page-test.sh`, `tools/playground/build-blueprints.py --check`, the Playground smoke for every blueprint, and the offline site and registry build. `plugin-check.yml` runs WordPress Plugin Check on every zip. The only expected error is `plugin_updater_detected`, from the deliberate Update URI header.

## Check screens in a real WordPress

Build the zips with `python3 tools/build/build-dist.py --target all --track commercial --out dist`, then run `python3 tools/playground/admin-audit-standalone.py --plugin <slug> --port <n>` to load every server-rendered admin screen with only that plugin installed. `tools/playground/serve-suite.py` serves the whole suite locally for a browser pass.

## Branches

`kits-suite` is the default; `main` equals it. Work merges directly (no pull requests). A merged branch is deleted. Commits carry the trailer `Co-Authored-By: Wugweb <admin@wugweb.com>`.

## Sites

- A site on the commercial build updates from the registry. It must be on Kits Core 1.1.0 or newer to read it.
- Animal Writes: the site layer in `sites/animalwrites/` deploys with the plugin versions it was tested against, together. Staging (`staging.animalwrites.in`) is changed only after the owner's go, and the production site follows only after staging is checked.
- SourceWeb's scheduled jobs run from `wugweb-git/sourceweb-workers`. Run now needs `SOURCEWEB_GITHUB_TOKEN` (fine-grained, Actions read and write, that repository only) and `SOURCEWEB_WORKERS_REPO` in `wp-config.php`, never in the database.

## Known limits

Not verified: screen readers, Safari, real phones, Windows high contrast, a live SMTP fallback, a live Site Kit country call, live Fluent Forms submissions. The React screens have been checked in unit tests and server-rendered audits, not in a browser pass.
