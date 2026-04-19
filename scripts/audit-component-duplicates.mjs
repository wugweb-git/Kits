import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const uiDir = join(root, 'src/components/ui');
const legacyDir = join(root, 'src/components/wugweb');
const stateTokens = ['disabled', 'loading', 'hover', 'active', 'error', 'focus'];

function fileHash(content) {
  return createHash('sha256').update(content).digest('hex');
}

function listTsx(dir) {
  return readdirSync(dir).filter((file) => file.endsWith('.tsx'));
}

const uiFiles = listTsx(uiDir);
const legacyFiles = listTsx(legacyDir);

const uiMap = new Map(uiFiles.map((file) => [file.replace('.tsx', '').toLowerCase(), file]));
const legacyMap = new Map(legacyFiles.map((file) => [file.replace('.tsx', '').toLowerCase(), file]));

const overlaps = [...uiMap.keys()].filter((key) => legacyMap.has(key)).sort();
const uiOnly = [...uiMap.keys()].filter((key) => !legacyMap.has(key)).sort();
const legacyOnly = [...legacyMap.keys()].filter((key) => !uiMap.has(key)).sort();

const rows = overlaps.map((key) => {
  const uiFile = uiMap.get(key);
  const legacyFile = legacyMap.get(key);
  const uiContent = readFileSync(join(uiDir, uiFile), 'utf8');
  const legacyContent = readFileSync(join(legacyDir, legacyFile), 'utf8');
  const identical = fileHash(uiContent) === fileHash(legacyContent);
  const legacyStates = stateTokens.filter((token) => legacyContent.includes(token));

  return {
    key,
    uiFile,
    legacyFile,
    identical,
    legacyStates: legacyStates.length ? legacyStates.join(', ') : 'none-detected',
  };
});

const identicalCount = rows.filter((row) => row.identical).length;
const differentCount = rows.length - identicalCount;

const report = [
  '# Component Duplicate Audit',
  '',
  `- Compared UI source: \`src/components/ui\``,
  `- Compared legacy source: \`src/components/wugweb\``,
  `- Overlapping component names: **${rows.length}**`,
  `- Exact duplicates: **${identicalCount}**`,
  `- Non-identical overlaps: **${differentCount}**`,
  `- UI-only components: **${uiOnly.length}**`,
  `- Legacy-only components: **${legacyOnly.length}**`,
  '',
  '## Overlap Details',
  '',
  '| Component | ui file | wugweb file | Exact duplicate? | Legacy state keywords detected |',
  '|---|---|---|---|---|',
  ...rows.map((row) => `| ${row.key} | ${row.uiFile} | ${row.legacyFile} | ${row.identical ? 'yes' : 'no'} | ${row.legacyStates} |`),
  '',
  '## UI-only Components',
  '',
  uiOnly.length ? uiOnly.map((name) => `- ${name}`).join('\n') : '- none',
  '',
  '## Legacy-only Components',
  '',
  legacyOnly.length ? legacyOnly.map((name) => `- ${name}`).join('\n') : '- none',
  '',
  '## Recommendation',
  '',
  'Do not mass-delete legacy components until each non-identical overlap is migrated and state parity is validated.',
].join('\n');

writeFileSync(join(root, 'reports/duplicate-audit.md'), report);
console.log('Wrote reports/duplicate-audit.md');
