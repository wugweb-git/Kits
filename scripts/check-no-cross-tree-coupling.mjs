import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const forbidden = ['components/wugweb/', '/imports/'];
const allowPrefixes = ['src/components/wugweb/', 'src/components/design-system/', 'src/imports/', 'scripts/', 'reports/'];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    const st = statSync(f);
    if (st.isDirectory()) out.push(...walk(f));
    else out.push(f);
  }
  return out;
}

const hits = [];
for (const file of walk(join(root, 'src')).filter((f) => /\.(ts|tsx|js|jsx|css)$/.test(f))) {
  const rel = relative(root, file).replaceAll('\\', '/');
  if (allowPrefixes.some((p) => rel.startsWith(p))) continue;
  const text = readFileSync(file, 'utf8');
  for (const token of forbidden) {
    if (text.includes(token)) hits.push(`${rel} -> ${token}`);
  }
}

if (hits.length) {
  console.error('Forbidden cross-tree references found:');
  for (const hit of hits) console.error(`- ${hit}`);
  process.exit(1);
}

console.log('No forbidden cross-tree references found.');
