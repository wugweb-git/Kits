#!/usr/bin/env node
/**
 * One-way import: CSS custom properties -> W3C design tokens (DTCG) JSON.
 *
 *   node scripts/import-css-tokens.mjs <path/to/global.css>
 *
 * Reads every custom property declared on :root (plus :root inside the
 * min-width media queries) and writes design-system/tokens/*.json.
 *
 * Naming: a token's path joined with "-" is its CSS name, so --color-surface-page
 * is { color: { "surface-page": … } }. A name that is also a group (--bg and
 * --bg-soft) keeps the bare one under the key "_", which the build drops.
 * References: var(--x) becomes {x…} when --x is itself a token, so the build
 * writes var(--x) back. Values are copied as written; nothing is converted.
 * Media-query overrides go to design-system/tokens/modes/<mode>.json.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/import-css-tokens.mjs <global.css>'); process.exit(1); }
const OUT = 'design-system/tokens';

// ---- Parse ---------------------------------------------------------------------------------
const css = readFileSync(src, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const decls = []; const stack = []; let buf = '';
for (const ch of css) {
  if (ch === '{') { stack.push(buf.trim()); buf = ''; continue; }
  if (ch === '}') {
    const ctx = [...stack.slice(0, -1)]; const sel = stack.pop();
    for (const d of buf.split(';')) {
      const m = d.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/);
      if (m) decls.push({ at: ctx.join(' > '), sel, name: m[1].slice(2), value: m[2].replace(/\s+/g, ' ') });
    }
    buf = ''; continue;
  }
  buf += ch;
}

// Which at-rule contexts become modes. Anything else (component selectors such as .grid) stays in CSS.
const MODES = {
  '': 'base',
  '@media (min-width: 768px)': 'md',
  '@media (min-width: 1200px)': 'lg',
  '@media (min-width: 1200px) > @supports (height: 100dvh)': 'lg-dvh',
};
const rootDecls = decls.filter((d) => d.sel === ':root' && d.at in MODES);
const skipped = decls.filter((d) => !rootDecls.includes(d));
const base = rootDecls.filter((d) => MODES[d.at] === 'base');
const names = new Set(base.map((d) => d.name));

// ---- Paths ---------------------------------------------------------------------------------
const groupNames = new Set([...names].filter((n) => n.includes('-')).map((n) => n.split('-')[0]));
const pathOf = (name) => {
  const i = name.indexOf('-');
  if (i < 0) return groupNames.has(name) ? [name, '_'] : [name];
  return [name.slice(0, i), name.slice(i + 1)];
};
const ref = (name) => `{${pathOf(name).join('.')}}`;
const toValue = (v) => v.replace(/var\(\s*--([\w-]+)\s*\)/g, (m, n) => (names.has(n) ? ref(n) : m));

// ---- Types (DTCG $type). Only set when the value is plainly one kind. ----------------------
function typeOf(name, v) {
  if (/^#[0-9a-f]{3,8}$/i.test(v) || /^(rgb|rgba|hsl|hsla)\(/i.test(v)) return 'color';
  if (/^font-weight|^font-weight/.test(name) || (/weight/.test(name) && /^\d{3}$/.test(v))) return 'fontWeight';
  if (/family/.test(name)) return 'fontFamily';
  if (/^-?\d*\.?\d+(px|rem|em)$/.test(v) || v === '0') return 'dimension';
  if (/^\d*\.?\d+m?s$/.test(v)) return 'duration';
  if (/^cubic-bezier\(/.test(v)) return 'cubicBezier';
  if (/^-?\d*\.?\d+$/.test(v)) return 'number';
  return undefined;
}

// ---- Files: one per category, by the name's first segment -----------------------------------
const FILES = {
  typography: ['core', 'font', 'ts', 'fluid', 'type', 't', 'tracking', 'lh', 'measure'],
  color: ['neutral', 'color', 'svc', 'bg', 'surface', 'fg', 'accent', 'line', 'selection'],
  spacing: ['p', 'gap', 'space', 'safe', 'section'],
  radius: ['r', 'radius', 'chip'],
  effects: ['shadow', 'opacity', 'stroke', 'blur', 'elevation', 'glass', 'noise', 'gradient', 'hover', 'focus', 'cursor'],
  motion: ['duration', 'easing', 'ease', 'transition'],
};
const fileOf = (name) => Object.entries(FILES).find(([, g]) => g.includes(pathOf(name)[0]))?.[0] ?? 'layout';

function put(tree, path, token) {
  let node = tree;
  for (const p of path.slice(0, -1)) node = node[p] ||= {};
  node[path.at(-1)] = token;
}
const token = (d) => {
  const t = { $value: toValue(d.value) };
  const type = typeOf(d.name, d.value);
  if (type && !/\{/.test(t.$value)) t.$type = type;
  return t;
};

// ---- Write ---------------------------------------------------------------------------------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/modes`, { recursive: true });
const trees = {};
for (const d of base) put((trees[fileOf(d.name)] ||= {}), pathOf(d.name), token(d));
for (const [file, tree] of Object.entries(trees)) writeFileSync(`${OUT}/${file}.json`, `${JSON.stringify(tree, null, 2)}\n`);

const modeMeta = {};
for (const [at, mode] of Object.entries(MODES)) {
  if (mode === 'base') continue;
  const list = rootDecls.filter((d) => d.at === at);
  if (!list.length) continue;
  const tree = {};
  for (const d of list) {
    if (!names.has(d.name)) throw new Error(`--${d.name} is set in ${at} but has no base value`);
    put(tree, pathOf(d.name), token(d));
  }
  writeFileSync(`${OUT}/modes/${mode}.json`, `${JSON.stringify(tree, null, 2)}\n`);
  modeMeta[mode] = at;
}
writeFileSync(`${OUT}/modes/index.json`, `${JSON.stringify({ $description: 'Mode file -> the CSS at-rules its :root block is wrapped in (outermost first, joined by " > ").', modes: modeMeta }, null, 2)}\n`);

console.log(`Imported ${base.length} base tokens into ${Object.keys(trees).length} files; modes: ${Object.entries(modeMeta).map(([m]) => `${m} (${rootDecls.filter((d) => MODES[d.at] === m).length})`).join(', ')}.`);
if (skipped.length) console.log(`Left in CSS (not :root): ${skipped.map((d) => `${d.at} ${d.sel} --${d.name}`).join('; ')}`);
