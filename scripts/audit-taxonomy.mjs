import { readFileSync } from 'node:fs';
const inventory = JSON.parse(readFileSync('src/generated/siteInventory.json', 'utf8'));
const taxonomyText = readFileSync('design-system/taxonomy.ts', 'utf8');
const taxonomyModules = [...taxonomyText.matchAll(/'([^']+)'/g)].map((m) => m[1]);
const publicModules = inventory.publicModules;
const taxonomySet = new Set(taxonomyModules);
const missingFromTaxonomy = publicModules.filter((name) => !taxonomySet.has(name));
const unknownInTaxonomy = [...taxonomySet].filter((name) => !publicModules.includes(name));
const duplicateCounts = taxonomyModules.reduce((acc, name) => (acc.set(name, (acc.get(name)||0)+1), acc), new Map());
const duplicates = [...duplicateCounts.entries()].filter(([,count]) => count>1).map(([name]) => name);
if (missingFromTaxonomy.length || unknownInTaxonomy.length || duplicates.length) {
  console.error('Taxonomy audit failed.');
  if (missingFromTaxonomy.length) console.error(`Missing taxonomy entries: ${missingFromTaxonomy.join(', ')}`);
  if (unknownInTaxonomy.length) console.error(`Unknown taxonomy entries: ${unknownInTaxonomy.join(', ')}`);
  if (duplicates.length) console.error(`Duplicated taxonomy entries: ${duplicates.join(', ')}`);
  process.exit(1);
}
console.log(`Taxonomy audit passed: ${publicModules.length} modules classified once.`);
