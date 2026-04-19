import { readFileSync } from 'node:fs';

const lines = readFileSync('.github/CODEOWNERS', 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

const errors = [];
for (const line of lines) {
  const parts = line.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    errors.push(`Invalid CODEOWNERS line: ${line}`);
    continue;
  }
  const owners = parts.slice(1);
  for (const owner of owners) {
    if (!owner.startsWith('@') || owner.length < 2) {
      errors.push(`Invalid owner handle '${owner}' in line: ${line}`);
    }
  }
}

if (errors.length) {
  console.error('CODEOWNERS audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`CODEOWNERS audit passed: ${lines.length} rule(s).`);
