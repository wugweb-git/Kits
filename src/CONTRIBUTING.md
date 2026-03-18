# Contributing to Wugweb Kits

> **Repo:** https://github.com/wugweb-git/Kits · **Live:** https://kits.wugweb.studio

We welcome contributions — components, tokens, blocks, docs, and bug fixes. Read this before opening a PR.

---

## Token Contract (mandatory)

Every contribution must respect the token system:

```
Core → Alias → Semantic → Component
```

| Rule | Example |
|---|---|
| ✅ Use semantic tokens in components | `var(--accent)`, `var(--card)` |
| ✅ var(--token) everywhere | No `#hex`, no `16px`, no `rgb()` |
| ✅ Font: Inter Tight only | `font-family: var(--core-font-family-base)` |
| ❌ Never core tokens in components | `var(--core-color-brand-yellow-500)` in a button = ❌ |
| ❌ Never skip the semantic layer | core → component = ❌ |
| ❌ Never Tailwind font classes | `text-2xl`, `font-bold` = ❌ |

---

## Local Setup

```bash
git clone https://github.com/wugweb-git/Kits.git
cd Kits
npm install
npm run dev

# Validate tokens before committing
npm run validate:tokens
```

---

## Contribution Types

### New Component
1. Create `/components/wugweb/ComponentName.tsx`
2. Export from `/components/wugweb/index.ts`
3. Create doc page `/components/ds/pages/ComponentNameDoc.tsx`
4. Wire route in `App.tsx`
5. Add to `ContextualSidebar.tsx`
6. Must be: variant-based (size sm/md/lg + state default/hover/disabled), WCAG 2.1 AA

### New Token
1. Add to correct layer in `/styles/globals.css`
2. Add entry to `/imports/pasted_text/design-tokens-mapping.json`
3. Document in `TokenMappingDoc.tsx`
4. Include use-case justification in PR description

### Bug Fix
- Link the GitHub issue
- Screenshot before/after for visual changes
- Run `npm run validate:tokens` — all must pass

### Documentation
- Follow `PageWrapper` / `PageHeader` / `PageSection` patterns
- Use CSS variable tokens only — no Tailwind font/spacing classes
- Inter Tight only — no other font faces

---

## PR Checklist

- [ ] Token contract respected (no hardcoded values)
- [ ] Fonts via `var(--core-font-family-base)` only
- [ ] WCAG 2.1 AA contrast check done
- [ ] `npm run validate:tokens` passes
- [ ] Screenshot / preview attached for visual changes
- [ ] CHANGELOG updated with version entry
- [ ] One logical change per PR

---

## File Structure (where things go)

```
components/wugweb/       → Production components (exported from index.ts)
components/ds/pages/     → Documentation pages
components/ds/pages/blocks/    → Block section pages
components/ds/pages/templates/ → Full page templates
styles/globals.css       → Token definitions (THE source of truth)
imports/pasted_text/     → Architecture reference docs
```

---

## Contact

- Issues: https://github.com/wugweb-git/Kits/issues
- Discussions: https://github.com/wugweb-git/Kits/discussions
- Email: hello@wugweb.com
