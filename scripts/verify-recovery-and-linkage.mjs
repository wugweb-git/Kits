import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

const root = process.cwd();

const requiredTrees = [
  'src/components/wugweb',
  'src/imports',
  'src/components/ds',
  'src/components/blocks',
  'src/components/stayweb',
  'src/components/nav',
];

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function tsxNames(dir) {
  return walk(join(root, dir))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => basename(f, '.tsx').toLowerCase());
}

const recovery = requiredTrees.map((tree) => {
  const abs = join(root, tree);
  const files = walk(abs);
  return { tree, exists: existsSync(abs), fileCount: files.length };
});

const ui = new Set(tsxNames('src/components/ui'));
const legacy = new Set(tsxNames('src/components/wugweb'));
const overlap = [...ui].filter((name) => legacy.has(name)).sort();
const uiOnly = [...ui].filter((name) => !legacy.has(name)).sort();
const legacyOnly = [...legacy].filter((name) => !ui.has(name)).sort();

const tokenFiles = [
  'src/lib/design-tokens.ts',
];

const badTokenNames = [];
for (const tokenFile of tokenFiles) {
  const abs = join(root, tokenFile);
  if (!existsSync(abs)) continue;
  const text = readFileSync(abs, 'utf8');
  for (const match of text.matchAll(/["']([^"']*\s+[^"']*)["']\s*:/g)) {
    badTokenNames.push({ tokenFile, tokenName: match[1] });
  }
}

const referenceTargets = ['components/wugweb', '/imports', 'components/ds', 'components/blocks', 'components/stayweb', 'components/nav'];
const refHits = [];
for (const file of walk(join(root, 'src')).filter((f) => /\.(ts|tsx|js|jsx|md|css)$/.test(f))) {
  const rel = relative(root, file).replaceAll('\\', '/');
  const text = readFileSync(file, 'utf8');
  for (const target of referenceTargets) {
    if (text.includes(target)) refHits.push({ rel, target });
  }
}

const lines = [];
lines.push('# Recovery and Linkage Verification');
lines.push('');
lines.push('## Deleted-tree recovery status');
lines.push('');
lines.push('| Tree | Exists | File count |');
lines.push('|---|---:|---:|');
for (const row of recovery) lines.push(`| ${row.tree} | ${row.exists ? 'yes' : 'no'} | ${row.fileCount} |`);
lines.push('');
lines.push('## Mapping status (ui ↔ wugweb by component filename)');
lines.push('');
lines.push(`- overlap: **${overlap.length}**`);
lines.push(`- ui-only: **${uiOnly.length}**`);
lines.push(`- legacy-only: **${legacyOnly.length}**`);
lines.push('');
lines.push('## Naming status (token keys with spaces)');
lines.push('');
lines.push(`- keys containing spaces detected: **${badTokenNames.length}**`);
for (const row of badTokenNames.slice(0, 50)) lines.push(`- ${row.tokenFile}: ${row.tokenName}`);
lines.push('');
lines.push('## Linkage status (cross-tree references found)');
lines.push('');
lines.push(`- total references found: **${refHits.length}**`);
for (const row of refHits.slice(0, 80)) lines.push(`- ${row.rel} -> ${row.target}`);
if (refHits.length > 80) lines.push(`- ... ${refHits.length - 80} more`);

writeFileSync(join(root, 'reports/recovery-linkage-verification.md'), lines.join('\n'));
console.log('Wrote reports/recovery-linkage-verification.md');
