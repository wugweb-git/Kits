import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const root = lock?.packages?.[''];

if (!root) {
  console.error('package-lock.json is missing packages[""] root entry.');
  process.exit(1);
}

function compare(section, expected, actual) {
  const issues = [];
  const expectedObj = expected || {};
  const actualObj = actual || {};

  for (const [name, range] of Object.entries(expectedObj)) {
    if (!(name in actualObj)) issues.push(`${section}: missing ${name}@${range} in package-lock root`);
    else if (actualObj[name] !== range) issues.push(`${section}: version mismatch for ${name} (${range} != ${actualObj[name]})`);
  }

  for (const [name, range] of Object.entries(actualObj)) {
    if (!(name in expectedObj)) issues.push(`${section}: extra ${name}@${range} in package-lock root`);
  }

  return issues;
}

const issues = [
  ...compare('dependencies', pkg.dependencies, root.dependencies),
  ...compare('devDependencies', pkg.devDependencies, root.devDependencies),
];

if (issues.length) {
  console.error('package.json and package-lock.json are out of sync:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('package.json and package-lock.json root sections are in sync.');
