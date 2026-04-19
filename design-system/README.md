# Design System Source of Truth

## Locked flow
Figma (Tokens Studio) -> GitHub (`design-system/tokens`) -> Style Dictionary -> product apps.

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
