// Validate every Playground blueprint against the official schema (fetched live, or from --schema <file>).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const here = path.dirname(fileURLToPath(import.meta.url));
const argIdx = process.argv.indexOf('--schema');
const schema = argIdx > 0
  ? JSON.parse(fs.readFileSync(process.argv[argIdx + 1], 'utf8'))
  : await (await fetch('https://playground.wordpress.net/blueprint-schema.json')).json();
const ajv = new Ajv({ strict: false, allErrors: true });
const validate = ajv.compile(schema);
const files = ['blueprint-base.json', ...fs.readdirSync(path.join(here, 'blueprints')).map((f) => `blueprints/${f}`)].sort();
let bad = 0;
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(here, f), 'utf8'));
  if (validate(data)) console.log(`PASS  ${f}`);
  else { bad++; console.log(`FAIL  ${f}`); for (const e of validate.errors.slice(0, 6)) console.log(`      ${e.instancePath} ${e.message}`); }
}
process.exit(bad ? 1 : 0);
