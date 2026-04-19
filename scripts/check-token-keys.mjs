import { readFileSync } from 'node:fs';

const files = [
  'design-system/tokens/color.json',
  'design-system/tokens/spacing.json',
  'design-system/tokens/typography.json',
];

const issues = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const matches = [...text.matchAll(/["']([^"']*\s+[^"']*)["']\s*:/g)].map((m) => m[1]);
  for (const token of matches) issues.push(`${file}: ${token}`);
}

if (issues.length) {
  console.error('Token keys with spaces are not allowed in source-of-truth token files:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Source token keys are normalized (no spaces).');
