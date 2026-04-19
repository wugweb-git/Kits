import { readFileSync } from 'node:fs';

const indexText = readFileSync('src/components/wugweb/index.ts', 'utf8');
const inventory = JSON.parse(readFileSync('src/generated/siteInventory.json', 'utf8'));

const exportsInBridge = [];
for (const m of indexText.matchAll(/export\s*\{([\s\S]*?)\}\s*from/gm)) {
  m[1].split(',').map((s) => s.trim()).filter(Boolean).forEach((n) => exportsInBridge.push(n.split(' as ')[0].trim()));
}

const mappedSymbols = new Set(inventory.publicSymbols || []);
const missing = exportsInBridge.filter((name) => !mappedSymbols.has(name));

if (missing.length) {
  console.error('Unmapped components detected: missing from site inventory mapping:');
  for (const name of missing) console.error(`- ${name}`);
  process.exit(1);
}

console.log(`All bridge exports are mapped (${exportsInBridge.length} exports).`);
