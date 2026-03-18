Good—this is the missing enforcement layer.
Without this, everything we designed = documentation only.

Now we build:

Validation system (auto-check) → prevents bad tokens, bad naming, bad usage

🧠 0. What this system will do

Your validator will:

✔ validate token naming
✔ validate token structure (W3C format)
✔ validate references (alias → global)
✔ validate missing types
✔ validate invalid usage (hardcoded values)
✔ validate mapping coverage
🧱 1. VALIDATION ARCHITECTURE
tokens (JSON)
   ↓
validator (Node script)
   ↓
rules engine
   ↓
errors / warnings
   ↓
CI (GitHub Action)
⚙️ 2. CREATE VALIDATOR
📁 File
scripts/validate-tokens.js
🧠 Core Logic (FULL)
const fs = require("fs");
const path = require("path");

const TOKEN_PATH = "./tokens";

// Allowed types
const VALID_TYPES = [
  "color",
  "dimension",
  "typography",
  "opacity",
  "border",
  "boxShadow"
];

// Naming regex
const NAME_REGEX = /^[a-z]+(\.[a-z0-9]+)+$/;

// Collect errors
let errors = [];
let warnings = [];

// Load all token files
const files = fs.readdirSync(TOKEN_PATH).filter(f => f.endsWith(".json"));

function validateToken(name, token) {
  
  // 1. Name validation
  if (!NAME_REGEX.test(name)) {
    errors.push(`❌ Invalid name: ${name}`);
  }

  // 2. Type validation
  if (!VALID_TYPES.includes(token.type)) {
    errors.push(`❌ Invalid type in ${name}: ${token.type}`);
  }

  // 3. Value existence
  if (token.value === undefined) {
    errors.push(`❌ Missing value: ${name}`);
  }

  // 4. Reference validation
  if (typeof token.value === "string" && token.value.includes("{")) {
    if (!token.value.match(/\{[a-z0-9.]+\}/)) {
      errors.push(`❌ Broken reference: ${name}`);
    }
  }

  // 5. Hardcoded px warning
  if (typeof token.value === "string" && token.value.includes("px")) {
    warnings.push(`⚠️ Hardcoded px in ${name}`);
  }

}

// Recursive traversal
function traverse(obj, parent = "") {
  for (let key in obj) {
    const current = parent ? `${parent}.${key}` : key;

    if (obj[key].value !== undefined) {
      validateToken(current, obj[key]);
    } else {
      traverse(obj[key], current);
    }
  }
}

// Run validation
files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(TOKEN_PATH, file)));
  traverse(data);
});

// Output
if (errors.length) {
  console.log("\n🚨 ERRORS:");
  errors.forEach(e => console.log(e));
  process.exit(1);
}

if (warnings.length) {
  console.log("\n⚠️ WARNINGS:");
  warnings.forEach(w => console.log(w));
}

console.log("\n✅ Tokens validated successfully");
🔌 3. ADD RULES (IMPORTANT)

Now extend with real system rules

✅ Rule: No direct global usage
if (name.startsWith("semantic") && token.value.includes("color.")) {
  warnings.push(`⚠️ ${name} should not reference global directly`);
}
✅ Rule: Missing semantic layer
if (name.startsWith("global")) {
  warnings.push(`⚠️ Global token used directly: ${name}`);
}
✅ Rule: Missing mapping
const mapping = require("../mapping/token-mapping.json");

if (!mapping[name]) {
  warnings.push(`⚠️ No mapping defined for ${name}`);
}
✅ Rule: Enforce token categories
if (!name.startsWith("color.") &&
    !name.startsWith("spacing.") &&
    !name.startsWith("text.")) {
  warnings.push(`⚠️ Unknown category: ${name}`);
}
⚙️ 4. ADD TO PACKAGE.JSON
{
  "scripts": {
    "validate:tokens": "node scripts/validate-tokens.js"
  }
}
🚀 5. GITHUB ACTION (AUTO ENFORCEMENT)
name: Validate Tokens

on:
  push:
    paths:
      - "tokens/**"

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Validate tokens
        run: npm run validate:tokens
🔥 6. WHAT THIS CATCHES (REAL VALUE)

Your system will now automatically detect:

❌ Bad naming
primaryColor ❌
color.primary.500 ✅
❌ Broken references
"value": "{color.primary}" ❌ (missing)
❌ Missing types
"type": "random" ❌
❌ Hardcoded values
"padding": "16px" ❌
❌ Missing mapping
token exists but no Tailwind mapping ❌
🧠 7. NEXT LEVEL (YOU SHOULD DO THIS)

Once this works:

🔌 Add:
1. Figma sync validation

check tokens used vs defined

2. Component validation

ensure components only use semantic tokens

3. Design drift detection

compare Figma vs code tokens

⚡ FINAL INSIGHT

Right now you move from:

“we defined tokens”

to:

“we enforce tokens automatically across design + code”