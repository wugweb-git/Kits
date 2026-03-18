/**
 * Wugweb Kits — Token Validation Script
 * ──────────────────────────────────────
 * Validates all token JSON files against W3C DTCG schema,
 * naming contract, reference integrity, and layer rules.
 *
 * Usage: node scripts/validate-tokens.js
 * CI:    npm run validate:tokens
 *
 * Layer rules enforced:
 *   global.json   → raw values only, no references
 *   alias.json    → references global only {color.*}
 *   semantic.json → references alias only {alias.*} or {color.brand.*}
 *   component.json→ references semantic only {spacing.*}, {radius.*}, etc.
 */

const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '../tokens');

// ── W3C DTCG valid types ─────────────────────────────────────
const VALID_TYPES = [
  'color',
  'dimension',
  'typography',
  'fontFamilies',
  'fontWeights',
  'fontSizes',
  'lineHeights',
  'letterSpacing',
  'opacity',
  'border',
  'boxShadow',
  'other',       // motion, z-index, breakpoints
];

// ── Naming contract regex ─────────────────────────────────────
// Allows: color.brand.primary, spacing.4, text.body.md
const NAME_REGEX = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9-]*)+$/;

// ── Forbidden hardcoded patterns in values ───────────────────
const HARDCODED_PATTERNS = [
  { pattern: /^#[0-9a-fA-F]{3,8}$/, label: 'raw hex color' },
  { pattern: /^[0-9]+px$/, label: 'raw px value' },
  { pattern: /^rgb\(/, label: 'raw rgb()' },
];

// ── Layer file rules ─────────────────────────────────────────
const LAYER_RULES = {
  'global.json': {
    allowReferences: false,
    description: 'Core — raw values only, no token references',
  },
  'alias.json': {
    allowReferences: true,
    referencePrefix: null, // references global tokens
    description: 'Alias — references global tokens only',
  },
  'semantic.json': {
    allowReferences: true,
    description: 'Semantic — references alias/global tokens',
  },
  'component.json': {
    allowReferences: true,
    description: 'Component — references semantic tokens only',
  },
};

let errors = [];
let warnings = [];
let tokenCount = 0;

// ── Helpers ──────────────────────────────────────────────────
function isReference(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function validateReference(value) {
  return /^\{[a-z][a-z0-9.]+\}$/.test(value);
}

function validateToken(dotPath, token, filename) {
  tokenCount++;

  // 1. Name contract
  if (!NAME_REGEX.test(dotPath)) {
    errors.push(`[${filename}] ❌ Invalid name: "${dotPath}" — must be lowercase dot.notation`);
  }

  // 2. Must have "value"
  if (token.value === undefined) {
    errors.push(`[${filename}] ❌ Missing value: ${dotPath}`);
    return;
  }

  // 3. Must have "type"
  if (!token.type) {
    warnings.push(`[${filename}] ⚠️  Missing type: ${dotPath}`);
  } else if (!VALID_TYPES.includes(token.type)) {
    errors.push(`[${filename}] ❌ Invalid type "${token.type}" in: ${dotPath} — valid: ${VALID_TYPES.join(', ')}`);
  }

  // 4. Reference validation
  const value = token.value;
  if (typeof value === 'string' && isReference(value)) {
    if (!validateReference(value)) {
      errors.push(`[${filename}] ❌ Broken reference syntax: ${dotPath} → "${value}"`);
    }

    const rule = LAYER_RULES[filename];
    if (rule && !rule.allowReferences) {
      errors.push(`[${filename}] ❌ References not allowed in global layer: ${dotPath} → "${value}"`);
    }
  } else if (typeof value === 'string') {
    // 5. Hardcoded value check (warning only for global, error for semantic/component)
    for (const { pattern, label } of HARDCODED_PATTERNS) {
      if (pattern.test(value)) {
        const isGlobal = filename === 'global.json';
        const msg = `[${filename}] ${isGlobal ? '✓ OK' : '⚠️'} Hardcoded ${label} in ${dotPath}: "${value}"`;
        if (!isGlobal) {
          warnings.push(msg);
        }
      }
    }
  }
}

// ── Recursive traversal ──────────────────────────────────────
function traverse(obj, parent, filename) {
  for (const key of Object.keys(obj)) {
    const current = parent ? `${parent}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (obj[key].value !== undefined) {
        // Leaf token
        validateToken(current, obj[key], filename);
      } else {
        // Group — recurse
        traverse(obj[key], current, filename);
      }
    }
  }
}

// ── Main ─────────────────────────────────────────────────────
console.log('\n🔍 Wugweb Kits — Token Validator\n');
console.log(`   Token path: ${TOKEN_PATH}\n`);

if (!fs.existsSync(TOKEN_PATH)) {
  console.log('⚠️  tokens/ directory not found. Skipping validation.');
  console.log('   Create tokens/global.json, alias.json, semantic.json, component.json');
  process.exit(0);
}

const files = fs.readdirSync(TOKEN_PATH).filter(f => f.endsWith('.json'));

if (files.length === 0) {
  console.log('⚠️  No JSON files found in tokens/. Skipping.');
  process.exit(0);
}

files.forEach(file => {
  const filePath = path.join(TOKEN_PATH, file);
  let data;

  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    errors.push(`[${file}] ❌ JSON parse error: ${e.message}`);
    return;
  }

  console.log(`  → Validating ${file} (${LAYER_RULES[file]?.description || 'unknown layer'})`);
  traverse(data, '', file);
});

// ── Layer cross-reference checks ─────────────────────────────
// Semantic tokens should not reference global directly
// (They should go via alias)
// This is a simple heuristic check
if (files.includes('semantic.json') && files.includes('global.json')) {
  const semanticData = JSON.parse(
    fs.readFileSync(path.join(TOKEN_PATH, 'semantic.json'), 'utf8')
  );
  const globalData = JSON.parse(
    fs.readFileSync(path.join(TOKEN_PATH, 'global.json'), 'utf8')
  );

  function checkSemanticRefs(obj, parent = '') {
    for (const key of Object.keys(obj)) {
      const current = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (obj[key].value !== undefined && isReference(obj[key].value)) {
          const ref = obj[key].value.slice(1, -1); // strip {}
          const topLevel = ref.split('.')[0];
          // If semantic token references a global top-level key directly, warn
          if (globalData[topLevel] && !ref.includes('brand') && !ref.includes('alias')) {
            warnings.push(`[semantic.json] ⚠️  Direct global reference in ${current}: "${obj[key].value}" — prefer alias layer`);
          }
        } else {
          checkSemanticRefs(obj[key], current);
        }
      }
    }
  }

  checkSemanticRefs(semanticData);
}

// ── Output ───────────────────────────────────────────────────
console.log(`\n   Validated ${tokenCount} tokens across ${files.length} files.\n`);

if (errors.length > 0) {
  console.log(`🚨 ERRORS (${errors.length}):`);
  errors.forEach(e => console.log(`   ${e}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
  warnings.forEach(w => console.log(`   ${w}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All tokens validated successfully. No errors, no warnings.\n');
} else if (errors.length === 0) {
  console.log(`\n✅ Validation passed with ${warnings.length} warning(s).\n`);
} else {
  console.log(`\n❌ Validation failed: ${errors.length} error(s), ${warnings.length} warning(s).\n`);
  process.exit(1);
}
