# Wugweb Kits — Token Files

W3C DTCG-compliant token JSON files. These are the source of truth for all design tokens across Wugweb products.

## Layers

```
global.json    → Core raw values (colors, spacing, radius, type, shadow, motion)
alias.json     → Brand bridge (maps core → brand names; swap = full rebrand)
semantic.json  → Intent layer (--background, --accent, --foreground)
component.json → Per-component overrides (btn-height, card-radius, etc.)
```

## Rules

- `global.json` — raw values only, no references
- `alias.json` — references global tokens via `{token.path}`
- `semantic.json` — references alias tokens
- `component.json` — references semantic tokens only

## Validation

```bash
npm run validate:tokens
```

## Style Dictionary

```bash
npm run tokens:build
```

## Pipeline

```
tokens/*.json → Style Dictionary → CSS variables + Tailwind config + JS tokens
                                 → Deployed to kits.wugweb.studio
```
