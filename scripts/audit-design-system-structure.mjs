import { existsSync } from 'node:fs';

const required = [
  'design-system/tokens/color.json',
  'design-system/tokens/spacing.json',
  'design-system/tokens/typography.json',
  'design-system/README.md',
  'design-system/taxonomy.ts',
  'style-dictionary.config.cjs',
  '.github/CODEOWNERS',
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error('Design-system structure audit failed. Missing:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('Design-system structure audit passed.');
