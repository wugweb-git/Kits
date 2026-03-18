# /imports/pasted_text — Reference Index

This directory contains architecture and token reference documents used to define the Wugweb Kits design system. All files are source-of-truth references for the token system, naming contract, and architecture decisions.

---

## Files

| File | Purpose | Status |
|---|---|---|
| `design-system-architecture.md` | Full 10-layer architecture (Tokens → Flows) | ✅ Reference |
| `design-system-audit.md` | AI system audit prompt + instructions | ✅ Reference |
| `design-system-layers.md` | Layer-by-layer breakdown | ✅ Reference |
| `design-system-tokens.json` | Component list from design system | ✅ Reference |
| `design-token-structure.md` | Token type + scope + usage + code table | ✅ Reference |
| `design-tokens-mapping.json` | Naming system + Figma→Tailwind mapping | ✅ Reference |
| `design-tokens.md` | Token type definitions and examples | ✅ Reference |
| `token-audit-report.md` | Full audit of missing/broken tokens | ✅ Reference |
| `token-system-refactor.md` | Refactor plan for 4-layer system | ✅ Reference |
| `token-validation-script.js` | Validator script source (lives at /scripts/validate-tokens.js) | ✅ Implemented |

---

## What's been implemented

All items from these docs have been implemented in:
- `/styles/globals.css` — 4-layer token system (Core → Alias → Semantic → Component)
- `/components/ds/pages/TokenMappingDoc.tsx` — full token→scope→output map
- `/components/ds/pages/TokenExportDoc.tsx` — downloadable JSON export
- `/components/ds/pages/BreakpointsDoc.tsx` — responsive system
- `/components/ds/pages/TypographyDoc.tsx` — type hierarchy
- `/components/ds/pages/MCPConnectorDoc.tsx` — MCP integration plan
- `/scripts/validate-tokens.js` — token validation CLI

---

## Pending

- `tokens/` directory creation with actual JSON files (global.json, alias.json, semantic.json, component.json)
- GitHub Action for token validation on push
- Style Dictionary integration (`npm run tokens:build`)
- Figma webhook for Tokens Studio sync
