# Deployment and CI/CD

## Vercel build settings

This repo is configured for Vite output in `build/` via `vercel.json`.

- Install command: `npm ci --no-audit --no-fund || npm install --no-audit --no-fund`
- Build command: `npm run build`
- Output directory: `build`

## Lockfile policy

CI requires `package-lock.json` at repository root. Do not remove it.

If a third-party environment reports lock drift unexpectedly, the install command falls back to `npm install` to keep deployments unblocked while lock refresh is propagated.

## Workflow SDK (Vercel Workflows)

There is no separate UI toggle required for basic SDK usage in most projects.

1. This repo includes a local `workflow` compatibility package (`vendor/workflow`) so imports like `import { sleep } from "workflow"` work in all environments.
2. Add workflow functions using the `"use workflow"` directive (example: `src/workflows/handleUserSignup.ts`).
3. In environments with npm registry access, replace the local package with the official SDK by running `npm i workflow@latest` and committing the updated lockfile.


## Unverified commit deployments

If Vercel shows **"Deployment canceled because it was created with an unverified commit"**, this is a Git identity/signature policy issue, not a Vite build config issue.

Checklist:
- Ensure the GitHub account email used for commits is verified.
- If your org requires signed commits, enable GPG/SSH signing for local commits.
- Re-push a verified commit (or merge via GitHub UI with verified identity).


## Lock sync guard

Run `npm run check:lock-sync` before pushing. This validates that `package.json` dependency sections match `package-lock.json` root metadata to prevent recurring `npm ci` EUSAGE failures on Vercel.
