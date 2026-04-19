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

1. Install the official Workflow SDK in environments with npm registry access (`npm i workflow`).
2. In restricted environments, use the local shim in `src/lib/workflow.ts` for development validation.
3. Add workflow functions using the `"use workflow"` directive and deploy to monitor executions in Vercel Workflow/observability views.

Example workflow function is provided in `src/workflows/handleUserSignup.ts`.
