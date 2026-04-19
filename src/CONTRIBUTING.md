# Contributing to Wugweb Kits

> **Repo:** https://github.com/wugweb-git/Kits · **Live:** https://kits.wugweb.studio

## Canonical design-system rules

- **Single runtime entrypoint:** import components from `src/components/design-system/components.ts`.
- **Canonical component tree:** `src/components/ui/*` (component-per-folder wrappers in `src/components/ui/<Component>/index.ts`).
- **Token source of truth:** `design-system/tokens/*.json`.
- **Generated artifacts:** `design-system/build/*` via Style Dictionary.
- **Legacy paths are migration-only:** do not add new imports from `src/components/wugweb` or `src/imports`.

## Local setup

```bash
git clone https://github.com/wugweb-git/Kits.git
cd Kits
npm install
npm run dev
npm run check:ci
```

## Contribution checklist

- [ ] Use semantic token names (no spaces in token keys).
- [ ] Add/modify tokens in `design-system/tokens/*.json` only.
- [ ] Export new runtime components through `src/components/ui/index.ts`.
- [ ] Keep docs aligned with `design-system/docs/*`.
- [ ] Run `npm run check:ci` and include results in PR.
