import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const mode = process.argv.includes('--check') ? 'check' : 'write';

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(root, file), content);

const barrelPath = 'src/components/wugweb/index.ts';
const barrel = read(barrelPath);
const publicModules = [...barrel.matchAll(/from '\.\/([^']+)'/g)].map((match) => match[1]);
const publicSymbols = [...barrel.matchAll(/export\s*\{([^}]+)\}\s*from/gms)]
  .flatMap((match) => match[1].split(','))
  .map((part) => {
    const trimmed = part.trim();
    if (!trimmed) return null;
    const aliasParts = trimmed.split(/\s+as\s+/);
    return (aliasParts[1] ?? aliasParts[0]).trim();
  })
  .filter(Boolean);

const wugwebDir = path.join(root, 'src/components/wugweb');
const topLevelModules = fs
  .readdirSync(wugwebDir)
  .filter((entry) => /\.(ts|tsx)$/.test(entry) && entry !== 'index.ts')
  .map((entry) => entry.replace(/\.(ts|tsx)$/, ''));
const internalModules = fs
  .readdirSync(path.join(wugwebDir, 'internal'))
  .filter((entry) => /\.(ts|tsx)$/.test(entry))
  .map((entry) => entry.replace(/\.(ts|tsx)$/, ''));
const privateTopLevelModules = topLevelModules.filter((name) => !publicModules.includes(name));

const blocksSource = read('src/components/ds/pages/BlocksOverviewComplete.tsx');
const blockSection = blocksSource.match(/const blockCategories(?::[^=]+)? = \[(.*?)\];/s)?.[1] ?? '';
const blockCounts = [...blockSection.matchAll(/count:\s*(\d+)/g)].map((match) => Number(match[1]));
const blockTotal = blockCounts.reduce((sum, count) => sum + count, 0);
const blockCategoryCount = [...blockSection.matchAll(/id:\s*'[^']+'/g)].length;

const templatesSource = read('src/components/ds/pages/TemplatesOverview.tsx');
const templateSection = templatesSource.match(/const templates = \[(.*?)\];/s)?.[1] ?? '';
const templateIds = [...templateSection.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]);

const inventory = {
  publicComponentModuleCount: new Set(publicModules).size,
  publicComponentSymbolCount: new Set(publicSymbols).size,
  publicModules: [...new Set(publicModules)].sort(),
  publicSymbols: [...new Set(publicSymbols)].sort(),
  privateTopLevelModules: privateTopLevelModules.sort(),
  internalModules: internalModules.sort(),
  blockCategoryCount,
  blockTotal,
  templateCount: templateIds.length,
  templateIds,
};

const marketingCopy = {
  componentBadge: `${inventory.publicComponentModuleCount} Components`,
  componentPhrase: `${inventory.publicComponentModuleCount} production-ready React components`,
  blockBadge: `${inventory.blockTotal} Blocks`,
  templateBadge: `${inventory.templateCount} Templates`,
  docsFolderPhrase: `${inventory.publicComponentModuleCount} public component modules`,
};

const generatedTs = `// AUTO-GENERATED FILE. Run \`npm run inventory:sync\` to refresh.
export const siteInventory = ${JSON.stringify({ ...inventory, marketingCopy }, null, 2)} as const;
`;
const generatedJson = `${JSON.stringify({ ...inventory, marketingCopy }, null, 2)}\n`;
const generatedMd = `# Site inventory\n\n- Public component modules: ${inventory.publicComponentModuleCount}\n- Public exported symbols: ${inventory.publicComponentSymbolCount}\n- Block categories: ${inventory.blockCategoryCount}\n- Total blocks: ${inventory.blockTotal}\n- Templates: ${inventory.templateCount}\n\n## Public modules\n${inventory.publicModules.map((name) => `- ${name}`).join('\n')}\n\n## Private top-level modules\n${inventory.privateTopLevelModules.map((name) => `- ${name}`).join('\n') || '- None'}\n\n## Internal modules\n${inventory.internalModules.map((name) => `- ${name}`).join('\n') || '- None'}\n`;

const outputs = [
  ['src/generated/siteInventory.ts', generatedTs],
  ['src/generated/siteInventory.json', generatedJson],
  ['reports/site-inventory.md', generatedMd],
];

let dirty = false;
for (const [file, content] of outputs) {
  const full = path.join(root, file);
  const current = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
  if (current !== content) {
    dirty = true;
    if (mode === 'write') {
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, content);
    }
  }
}

const replacements = [
  {
    file: 'src/README.md',
    replacers: [
      [/\d+ React components/g, `${inventory.publicComponentModuleCount} React components`],
      [/\*\*\d+ Components\*\*/g, `**${inventory.publicComponentModuleCount} Components**`],
      [/\*\*\d+ Blocks\*\*/g, `**${inventory.blockTotal} Blocks**`],
      [/\*\*6 Templates\*\*/g, `**${inventory.templateCount} Templates**`],
      [/\d+ production components/g, `${inventory.publicComponentModuleCount} public component modules`],
    ],
  },
  {
    file: 'src/index.html',
    replacers: [
      [/127\+ production-ready React components/g, marketingCopy.componentPhrase],
      [/Production-ready design system with 127\+ React components/g, `Production-ready design system with ${inventory.publicComponentModuleCount} public React component modules`],
    ],
  },
  {
    file: 'src/public/site.webmanifest',
    replacers: [[/127\+ production-ready React components/g, marketingCopy.componentPhrase]],
  },
];

for (const { file, replacers } of replacements) {
  let content = read(file);
  const original = content;
  for (const [pattern, value] of replacers) {
    content = content.replace(pattern, value);
  }
  if (content !== original) {
    dirty = true;
    if (mode === 'write') {
      write(file, content);
    }
  }
}

if (mode === 'check' && dirty) {
  console.error('Inventory-generated files are out of date. Run: npm run inventory:sync');
  process.exit(1);
}

if (mode === 'write') {
  console.log(`Inventory synced: ${inventory.publicComponentModuleCount} components, ${inventory.blockTotal} blocks, ${inventory.templateCount} templates.`);
}
