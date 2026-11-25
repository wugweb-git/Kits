# CI, packaging, Playground and release (infrastructure)

**Status (25 Nov 2026):** CI and packaging reference, last verified 24 Nov; the new HTTP checks and nav audits are not yet run on a pushed commit.

Last verified: 24 Nov 2026. Remote CI evidence is recorded in `docs/pending.md`.

## CI (`.github/workflows/ci-suite.yml`)
- Deterministic installs only: `npm ci` (no `|| npm install` fallback), `composer validate` + `composer install` against a committed `composer.lock` (`packages/shared-php`). Composer has no `--no-fund`; `--no-audit` is not an `install` option on the runner's Composer, which is what failed run 45425360668.
- Gates: root/design system, Shared PHP SDK (8.0-8.3), theme, Playground blueprints (generator sync + official schema), companion plugin suites (8.0-8.3: Kits Core, DirectoryWeb incl. standalone and SCF fallback, InsightWeb, RankWeb incl. phpunit-lite, MailWeb, PlanWeb, SourceWeb incl. standalone) and the root `standalone-matrix` / `remediation-verification` tests.
- The Playground job also runs the HTTP checks (`http-claim-limits`, `http-claim-evidence`, `http-generic-behavior`, `http-directoryweb-frontend`), the admin-nav audit twice (standalone and suite) and a non-blocking Fluent Forms canary (`continue-on-error`).
- `package-dist` needs every gate and has no `always()`: a failed, cancelled or skipped gate skips packaging. Path-filtered gates also run when packaging inputs change, so PRs and pushes receive the same required validation.
- `playground-smoke` runs every blueprint headlessly (`@wp-playground/cli`, WP 7.1, PHP 8.2) against the ZIPs built by `package-dist`.
- `ci-design-system.yml` was a strict subset of the root job in `ci-suite.yml` and was removed.

## Packaging (`tools/build/build-dist.py`, `verify-dist.py`)
- Source `vendor/` is never copied (it is gitignored). MailWeb's production dependencies are resolved at build time with `composer install --no-dev` from `plugins/mailweb/composer.json` + `composer.lock`, then pruned of tests/docs/dev files.
- MailWeb: the Hostinger Mail API SDK needs PHP 8.2+, while MailWeb declares PHP 8.0+. The lock is resolved for platform PHP 8.2.0 (Symfony 7.4, SDK 1.19.0), the composer platform check is off, and MailWeb only loads `vendor/autoload.php` on PHP >= 8.2; older hosts use the built-in REST transport.
- `verify-dist.py` checks root folder, Name/Version headers (versions are read from product headers), no dev/test/uncompiled files, `php -l` on every file, no monorepo path references, vendor only for MailWeb, and loads the MailWeb SDK autoloader in an isolated PHP process. It writes `SHA256SUMS` and `release-manifest.json`.
- `packages/shared-php` is not bundled: no product consumes it yet (decision deferred until adoption, ownership and versioning are settled).

## Playground (`tools/playground/`)
- `build-blueprints.py` generates `blueprint-base.json`, six standalone product blueprints and `blueprints/suite.json` (Kits Core + theme + all plugins). WP 7.1 is required because every product declares `Requires at least: 7.1`.
- ZIPs come from the GitHub release assets of `RELEASE_TAG` in `build-blueprints.py` (the old `AnimalWrites/Kits/.../dist/` URLs pointed at the wrong org and a gitignored folder).
- Each blueprint ends with a smoke assertion (plugin active, Kits Core not active for standalone scenarios, admin menu, REST namespace, `wp_head`/content render clean, product-specific checks) that fails the blueprint on error.
- Not covered in CI (manual): browser-based Playground loading of release assets (GitHub release downloads can be blocked by CORS in a browser; the CLI is unaffected), anything needing credentials (MailWeb API token, Search Console OAuth, SourceWeb publisher feeds).

## Release (`.github/workflows/release.yml`)
Manual dispatch with a tag. Requires a clean tree, a tag that matches the blueprints, and a successful `ci-suite.yml` push run for the same commit. Builds, verifies, publishes a prerelease with the eight ZIPs + `SHA256SUMS` + `release-manifest.json`, then re-downloads every asset and checks its checksum.
