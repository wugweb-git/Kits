# Deployment and CI/CD

## Vercel build settings

This repo is configured for Vite output in `build/` via `vercel.json`.

- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `build`

## Lockfile policy

CI requires `package-lock.json` at repository root. Do not remove it.

## Workflow SDK (Vercel Workflows)

There is no separate UI toggle required for basic SDK usage in most projects.

1. Install SDK:
   ```bash
   npm i workflow
   ```
2. Add workflow functions using the `"use workflow"` directive.
3. Deploy and monitor executions in Vercel Workflow/observability views.

Example workflow function is provided in `src/workflows/handleUserSignup.ts`.
