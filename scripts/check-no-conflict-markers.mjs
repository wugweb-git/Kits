import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', 'build']);
const conflictPattern = /^(<<<<<<<|=======|>>>>>>>)/m;
const offenders = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = full.replace(`${root}/`, '');
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!skipDirs.has(entry)) walk(full);
      continue;
    }

    if (!/\.(ts|tsx|js|mjs|json|md|yml|yaml|css|html)$/.test(entry)) continue;

    const text = readFileSync(full, 'utf8');
    if (conflictPattern.test(text)) offenders.push(rel);
  }
}

walk(root);

if (offenders.length) {
  console.error('Merge conflict markers found:');
  for (const file of offenders) console.error(`- ${file}`);
  process.exit(1);
}

console.log('No merge conflict markers found.');
