import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const targets = [
  path.resolve('src/App.tsx'),
  path.resolve('src/components/wugweb'),
  path.resolve('src/components/ui'),
  path.resolve('src/components/ds'),
];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);
const versionSuffix = /(?:import\s+(?:[^'"`]+?\s+from\s+)?|export\s+[^'"`]*?from\s+|import\s*\()(['"`])([^'"`\n]+?@[0-9][^'"`\n]*)\1/g;
const hits = [];

function checkFile(filePath) {
  if (!exts.has(path.extname(filePath))) return;

  const content = readFileSync(filePath, 'utf8');
  let match;
  while ((match = versionSuffix.exec(content)) !== null) {
    const before = content.slice(0, match.index);
    const line = before.split('\n').length;
    hits.push({ file: path.relative(process.cwd(), filePath), line, specifier: match[2] });
  }
}

function walk(targetPath) {
  const stat = statSync(targetPath);
  if (stat.isFile()) {
    checkFile(targetPath);
    return;
  }

  for (const entry of readdirSync(targetPath)) {
    walk(path.join(targetPath, entry));
  }
}

for (const target of targets) {
  walk(target);
}

if (hits.length > 0) {
  console.error('Found version-suffixed package imports in checked source files:');
  for (const hit of hits) {
    console.error(`- ${hit.file}:${hit.line} -> ${hit.specifier}`);
  }
  console.error('\nUse bare package specifiers (for example, "sonner" instead of "sonner@2.0.3").');
  process.exit(1);
}

console.log('No version-suffixed package imports found in checked source files.');
