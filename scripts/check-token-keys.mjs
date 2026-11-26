import { readdirSync, readFileSync } from 'node:fs';

// Every token file, including design-system/tokens/modes/*.json.
const files = readdirSync('design-system/tokens', { recursive: true })
  .filter((f) => f.endsWith('.json'))
  .map((f) => `design-system/tokens/${f}`);

const issues = [];
for (const file of files) {
  const walk = (node) => {
    for (const [key, value] of Object.entries(node)) {
      if (/\s/.test(key)) issues.push(`${file}: ${key}`);
      if (value && typeof value === 'object' && !key.startsWith('$')) walk(value);
    }
  };
  walk(JSON.parse(readFileSync(file, 'utf8')));
}

if (issues.length) {
  console.error('Token keys with spaces are not allowed in source-of-truth token files:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Source token keys are normalized (no spaces).');
