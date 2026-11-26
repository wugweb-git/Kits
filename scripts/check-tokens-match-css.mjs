#!/usr/bin/env node
/**
 * Parity check: every :root custom property in a CSS file must match the built
 * design-system/build/css/variables.css exactly (same at-rule, name and value).
 *
 *   node scripts/check-tokens-match-css.mjs <path/to/global.css>
 */
import { readFileSync } from 'node:fs';

function roots(file) {
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const out = new Map(); const stack = []; let buf = '';
  for (const ch of css) {
    if (ch === '{') { stack.push(buf.trim()); buf = ''; continue; }
    if (ch === '}') {
      const at = stack.slice(0, -1).join(' > '); const sel = stack.pop();
      if (sel === ':root') for (const d of buf.split(';')) {
        const m = d.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/);
        if (m) out.set(`${at} ${m[1]}`, m[2].replace(/\s+/g, ' '));
      }
      buf = ''; continue;
    }
    buf += ch;
  }
  return out;
}

const src = roots(process.argv[2]);
const built = roots('design-system/build/css/variables.css');
const diffs = [];
for (const [k, v] of src) if (!built.has(k)) diffs.push(`missing  ${k}`); else if (built.get(k) !== v) diffs.push(`differs  ${k}: css "${v}" vs tokens "${built.get(k)}"`);
for (const k of built.keys()) if (!src.has(k)) diffs.push(`extra    ${k}`);
if (diffs.length) { console.error(`${diffs.length} differences:\n${diffs.join('\n')}`); process.exit(1); }
console.log(`Tokens match ${process.argv[2]}: ${src.size} :root declarations, 0 differences.`);
