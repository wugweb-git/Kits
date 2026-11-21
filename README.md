
# Wugweb Monorepo — Kits Theme, Companion Plugins & Design System

The canonical monorepo for the Wugweb ecosystem: WordPress theme, modular companion plugins, design system tokens, shared packages, skills, agents, and release tooling.

Detailed Architecture & Delivery Specification: [`docs/architecture/monorepo-delivery-architecture.md`](docs/architecture/monorepo-delivery-architecture.md)

---

## 1. Monorepo Structure

```text
wugweb/ (https://github.com/wugweb-git/kits)
├── plugins/              # Independently buildable WordPress plugins (Kits Core, RankWeb, MailWeb, etc.)
├── themes/               # Kits by Wugweb universal FSE block theme
├── packages/             # Shared contracts, Token Foundry, and namespaced plugin shells
├── skills/               # Reusable task skills (WordPress, Design System, Testing, etc.)
├── agents/               # Role-specific agent instructions
├── tools/                # Build, package, release, and Playground preview scripts
├── docs/                 # Canonical architecture, ADRs, and product specifications
├── marketplace/          # WordPress.org and commercial distribution assets
└── tests/                # Shared, integration, and contract tests
```

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
