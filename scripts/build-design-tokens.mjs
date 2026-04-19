import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

async function runStyleDictionary() {
  const module = await import('style-dictionary');
  const StyleDictionary = module.default;
  await new StyleDictionary('style-dictionary.config.cjs').buildAllPlatforms();
  console.log('Design tokens build completed via Style Dictionary.');
}

function runFallbackBuilder() {
  const color = JSON.parse(readFileSync('design-system/tokens/color.json', 'utf8'));
  const spacing = JSON.parse(readFileSync('design-system/tokens/spacing.json', 'utf8'));
  const typography = JSON.parse(readFileSync('design-system/tokens/typography.json', 'utf8'));

  const cssLines = [':root {'];
  const jsTokens = {};

  const addToken = (key, value) => {
    cssLines.push(`  --${key}: ${value};`);
    jsTokens[key] = value;
  };

  for (const [name, token] of Object.entries(color.color)) addToken(`color-${name}`, token.value);
  for (const [name, token] of Object.entries(spacing.spacing)) addToken(`spacing-${name}`, token.value);
  for (const [name, token] of Object.entries(typography.typography.fontSize)) addToken(`font-size-${name}`, token.value);
  for (const [name, token] of Object.entries(typography.typography.fontWeight)) addToken(`font-weight-${name}`, token.value);
  for (const [name, token] of Object.entries(typography.typography.lineHeight)) addToken(`line-height-${name}`, token.value);
  addToken('font-family-base', typography.typography.fontFamily.base.value);

  cssLines.push('}');

  mkdirSync('design-system/build/css', { recursive: true });
  mkdirSync('design-system/build/js', { recursive: true });
  writeFileSync('design-system/build/css/variables.css', `${cssLines.join('\n')}\n`);
  writeFileSync('design-system/build/js/tokens.js', `export const tokens = ${JSON.stringify(jsTokens, null, 2)};\n`);

  console.log('Design tokens build completed via fallback generator (Style Dictionary unavailable).');
}

try {
  await runStyleDictionary();
} catch {
  runFallbackBuilder();
}
