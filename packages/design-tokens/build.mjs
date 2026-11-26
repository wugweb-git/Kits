#!/usr/bin/env node
/**
 * Package build: runs the design-system token build at the repo root, then copies
 * the outputs and the JSON source into dist/.
 *
 *   dist/variables.css   :root plus one block per media query (import this in CSS)
 *   dist/tokens.js       resolved values: { base, modes }
 *   dist/tokens/**       the W3C (DTCG) JSON source, incl. Tokens Studio $metadata / $themes
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const dist = path.join(here, 'dist');

execFileSync(process.execPath, ['scripts/build-design-tokens.mjs'], { cwd: root, stdio: 'inherit' });
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(path.join(root, 'design-system/build/css/variables.css'), path.join(dist, 'variables.css'));
cpSync(path.join(root, 'design-system/build/js/tokens.js'), path.join(dist, 'tokens.js'));
cpSync(path.join(root, 'design-system/tokens'), path.join(dist, 'tokens'), { recursive: true });
console.log(`Package built: ${path.relative(root, dist)}`);
