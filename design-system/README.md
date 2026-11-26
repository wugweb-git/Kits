# Design System Source of Truth

## Locked flow
Figma (Tokens Studio) -> GitHub (`design-system/tokens`, W3C DTCG JSON) -> `npm run ds:tokens:build` -> product apps.

Token files, naming and where the values came from: `design-system/docs/tokens.md`.

Wugweb site design docs (design rules, 23 token references, components, widgets,
motion and 9 block specs): `design-system/docs/wugweb/`. Copied on 2026-11-26 from
`wugweb_site/kits_design_system/`; paths such as `src/styles/global.css` inside
them refer to the wugweb_site repo.

## Governance
- Git is the source of truth.
- If Figma and Git diverge, Git wins.
- All token changes require CODEOWNERS review.

## Build tokens
```bash
npm run ds:tokens:build
```

Generated outputs:
- `design-system/build/css/variables.css`
- `design-system/build/js/tokens.js`


## Phase tracking
See `design-system/phase-status.md` for closed vs deferred items.
