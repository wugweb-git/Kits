# Phase status

## Closed in this phase
- Root lockfile added for Vercel/CI lockfile-based installs.
- Canonical bridge now routes through `src/components/ui/index.ts`.
- UI component-per-folder wrappers created under `src/components/ui/<Component>/index.ts`.
- Source-of-truth docs added in `design-system/docs/*`.
- Token naming in `src/lib/design-tokens.ts` normalized to non-space keys.
- Token outputs aligned to Style Dictionary pipeline (`npm run ds:tokens:build`).

## Active migration items
- Legacy adapter exports in `src/components/ui/legacy-adapters.ts` remain until full parity replacement is complete.
- Screenshot-diff visual regression tooling remains future work.
