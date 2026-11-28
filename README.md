
# Wugweb Monorepo — Kits Theme, Companion Plugins & Design System

The canonical monorepo for the Wugweb ecosystem: WordPress theme, modular companion plugins, design system tokens, shared packages, skills, agents, and release tooling.

Delivery and CI/CD: [`DEPLOYMENT.md`](DEPLOYMENT.md). Each product's open work and decisions: `plugins/<name>/PENDING.md` and `themes/kits-by-wugweb/PENDING.md`. The old plan documents were retired on 26 Nov 2026 (kits-suite `9f81e36` and earlier). `docs/` now holds only dated reports: the current status report (`docs/standalone-audit-2026-11-28.md`), the staging check, and `docs/history/` for the older ledgers and audits.

**Branches.** `kits-suite` is the default branch and the one CI and releases run from; `main` is kept equal to it (fast-forward only). Work branches are deleted once merged.

---

## 1. Monorepo Structure

```text
wugweb/ (https://github.com/wugweb-git/Kits, branch kits-suite)
├── plugins/              # Seven WordPress plugins, each independently built and released:
│                         #   kits-core, directoryweb, rankweb, sourceweb, insightweb, mailweb, planweb
├── themes/               # kits-by-wugweb: the universal block theme
├── packages/             # Shared PHP and JS, design tokens, and the namespaced admin shells
├── design-system/        # Token and component docs, taxonomy, token build
├── tools/                # build/ (zips), release/ (per-product release, product pages, registry),
│                         #   validate/ (versions, Plugin Check), playground/ (WordPress previews and audits)
├── .github/workflows/    # ci-suite, plugin-check, release-product, release-tokens, release, pages
├── marketplace/          # WordPress.org and commercial distribution assets
├── skills/ agents/       # Reusable task skills and role instructions
├── tests/                # Shared, integration and contract tests
├── sites/animalwrites/   # The Animal Writes site layer (not packaged)
├── reports/ system/      # Audit reports and the inventory
├── scripts/              # Audit and token scripts
├── vendor/workflow/      # Local compatibility copy of the Workflow SDK
├── src/ + index.html     # The original React/Vite design-system app (Vercel build to build/)
└── Wugweb_Brand_OS_Foundation/   # Brand operating system reference (kept as is)
```

### How a release reaches a site

1. Bump the version in the main plugin file, `readme.txt` (Stable tag and changelog) and `CHANGELOG.md`; `python3 tools/validate/check-versions.py` checks they agree.
2. Push to `kits-suite`. `ci-suite.yml` must pass for that exact commit.
3. Run the `release-product.yml` workflow for one product (`product`, `prerelease`). It tags `<slug>-v<version>` and attaches `<slug>.zip` (direct build, keeps `Update URI`), `<slug>-wporg.zip` (no `Update URI`), `SHA256SUMS` and a release JSON.
4. `pages.yml` rebuilds the product pages and `registry/index.json` on GitHub Pages.
5. Sites running the direct zip of Kits Core 1.1.0 or newer read the registry (cached 12 hours), offer the new version on the Plugins screen, check its SHA-256 and install on Update. A pre-release is offered only to a site whose `kits_update_channel` option is `pre`.

---

## 2. Core Architectural Principles

1. **One Monorepo ≠ One Product**: Each product retains its own independent code boundary, namespace, version, changelog, tests, and release artifact (`dist/*.zip`).
2. **Bundled-Code Model**: Shared code is bundled into each public plugin edition at build time. Public plugins never depend at runtime on sibling plugins.
3. **Namespaced Shell Per Plugin**: Each plugin bundles its own namespaced admin shell (`rankweb-shell`, `mailweb-shell`, etc.). No global handles.
4. **External Services Registry**: Enforces centralized outbound network requests (`register_external_service` + `remote_request`) with mandatory `== External services ==` disclosures.
5. **Zero Raw Values**: All styling consumes `--kit-*` design tokens compiling from `tokens.json`.

---

## 3. Legacy Code & Safe Consolidation

- The original React/Vite application code and `Wugweb_Brand_OS_Foundation/` remain preserved.
- Before removing any legacy component source, run `node scripts/audit-component-duplicates.mjs` and review `reports/duplicate-audit.md`.
- For full cross-tree parity checks, run `node scripts/audit-full-system-parity.mjs` and review `reports/full-system-parity-audit.md`.

---

## 4. Design System Source of Truth

- Tokens: `themes/kits-by-wugweb/tokens/tokens.json` & `design-system/tokens/*.json`
- Token Compiler: `themes/kits-by-wugweb/tools/build-tokens.py`
- Token docs: `design-system/docs/tokens.md`
- Component docs: `design-system/docs/components.md`
- Usage guidelines: `design-system/docs/usage-guidelines.md`
- Canonical component bridge: `src/components/design-system/components.ts`
