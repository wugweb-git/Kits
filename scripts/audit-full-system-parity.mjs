import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

const root = process.cwd();
const stateKeywords = ['default', 'hover', 'active', 'disabled', 'loading', 'error', 'focus'];
const styleVarPattern = /var\(--[A-Za-z0-9-_]+\)/g;
const rawVisualPattern = /#[0-9A-Fa-f]{3,8}|\b\d+(?:\.\d+)?px\b/g;

const trees = [
  'src/components/wugweb',
  'src/imports',
  'src/components/ds',
  'src/components/blocks',
  'src/components/stayweb',
  'src/components/nav',
  'src/components/ui',
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

function scanFile(absPath) {
  const text = readFileSync(absPath, 'utf8');
  const rel = relative(root, absPath).replaceAll('\\', '/');
  const stateHits = stateKeywords.filter((k) => new RegExp(`\\b${k}\\b`, 'i').test(text));
  const cssVarHits = text.match(styleVarPattern)?.length ?? 0;
  const rawVisualHits = text.match(rawVisualPattern)?.length ?? 0;
  const imports = [...text.matchAll(/from\s+['\"]([^'\"]+)['\"]/g)].map((m) => m[1]);
  return { rel, stateHits, cssVarHits, rawVisualHits, imports, text };
}

const treeSummary = [];
const treeFiles = new Map();
for (const tree of trees) {
  const abs = join(root, tree);
  const files = walk(abs);
  treeFiles.set(tree, files);
  treeSummary.push({ tree, exists: existsSync(abs), files: files.length });
}

const tsxIn = (tree) => (treeFiles.get(tree) ?? []).filter((f) => f.endsWith('.tsx'));
const uiFiles = tsxIn('src/components/ui');
const wugwebFiles = tsxIn('src/components/wugweb');

const uiMap = new Map(uiFiles.map((f) => [basename(f, '.tsx').toLowerCase(), f]));
const legacyMap = new Map(wugwebFiles.map((f) => [basename(f, '.tsx').toLowerCase(), f]));
const overlap = [...uiMap.keys()].filter((k) => legacyMap.has(k)).sort();

const overlapDetails = overlap.map((name) => {
  const ui = scanFile(uiMap.get(name));
  const legacy = scanFile(legacyMap.get(name));
  const sameSource = ui.text === legacy.text;
  return {
    name,
    ui: ui.rel,
    legacy: legacy.rel,
    sameSource,
    uiStates: ui.stateHits.join(', ') || 'none',
    legacyStates: legacy.stateHits.join(', ') || 'none',
    uiCssVars: ui.cssVarHits,
    legacyCssVars: legacy.cssVarHits,
    uiRawVisual: ui.rawVisualHits,
    legacyRawVisual: legacy.rawVisualHits,
  };
});

const referenceTargets = [
  'components/wugweb',
  '/imports',
  'components/ds',
  'components/blocks',
  'components/stayweb',
  'components/nav',
];

const srcFiles = walk(join(root, 'src')).filter((f) => /\.(ts|tsx|js|jsx|md|css)$/.test(f));
const referenceRows = [];
for (const file of srcFiles) {
  const rel = relative(root, file).replaceAll('\\', '/');
  const text = readFileSync(file, 'utf8');
  for (const target of referenceTargets) {
    if (text.includes(target)) {
      referenceRows.push({ rel, target });
    }
  }
}

const report = [];
report.push('# Full System Parity Audit');
report.push('');
report.push('## 1) Tree presence + file counts');
report.push('');
report.push('| Tree | Exists | Files |');
report.push('|---|---:|---:|');
for (const row of treeSummary) {
  report.push(`| ${row.tree} | ${row.exists ? 'yes' : 'no'} | ${row.files} |`);
}

report.push('');
report.push('## 2) ui vs wugweb overlap parity');
report.push('');
report.push(`- Overlapping component names: **${overlapDetails.length}**`);
report.push(`- Exact-source matches: **${overlapDetails.filter((r) => r.sameSource).length}**`);
report.push(`- Non-identical overlaps: **${overlapDetails.filter((r) => !r.sameSource).length}**`);
report.push('');
report.push('| Component | UI file | Legacy file | Exact source? | UI states | Legacy states | UI css vars | Legacy css vars | UI raw visual hits | Legacy raw visual hits |');
report.push('|---|---|---|---|---|---|---:|---:|---:|---:|');
for (const row of overlapDetails) {
  report.push(`| ${row.name} | ${row.ui} | ${row.legacy} | ${row.sameSource ? 'yes' : 'no'} | ${row.uiStates} | ${row.legacyStates} | ${row.uiCssVars} | ${row.legacyCssVars} | ${row.uiRawVisual} | ${row.legacyRawVisual} |`);
}

report.push('');
report.push('## 3) Cross-tree references still present in src');
report.push('');
report.push(`- Total reference hits: **${referenceRows.length}**`);
report.push('');
report.push('| File | Reference token |');
report.push('|---|---|');
for (const row of referenceRows.slice(0, 250)) {
  report.push(`| ${row.rel} | ${row.target} |`);
}
if (referenceRows.length > 250) {
  report.push('');
  report.push(`_Truncated at 250 rows (${referenceRows.length - 250} more hits)._`);
}

report.push('');
report.push('## 4) Risk conclusion');
report.push('');
report.push('- This repository still contains substantial non-identical overlap between `ui` and `wugweb`.');
report.push('- Bulk deletion of legacy trees is unsafe until migration + visual/state parity checks are complete.');
report.push('- Recommended next step: migrate 1 component at a time with explicit state checklist and snapshot/interaction verification.');

writeFileSync(join(root, 'reports/full-system-parity-audit.md'), report.join('\n'));
console.log('Wrote reports/full-system-parity-audit.md');
