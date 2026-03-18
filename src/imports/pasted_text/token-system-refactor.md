Alright—this is a lot, and I see what you’re doing: you’re mixing

Figma scopes

Tokens Studio types

W3C DTCG spec

and your own system ideas

👉 Right now it’s overloaded but not structured.

Let me clean this into something you can actually build and scale.

🧠 First — Brutal truth

You don’t have “too many tokens”.

You have:

❌ too many classifications
❌ no hierarchy

✅ The only structure you should follow

Forget the noise. This is your final system:

🧱 1. Token Levels (MANDATORY)
Global (Core)

Raw values. No meaning.

Alias (Optional bridge)

References global (used for theming)

Semantic (Required)

Actual usage (UI intent)

🎯 Example
global:
  color.yellow.500 = #FFC700

alias:
  color.brand.primary = {color.yellow.500}

semantic:
  button.primary.bg = {color.brand.primary}
🧩 2. Token Types (FINAL LIST — not negotiable)

From everything you pasted, this is the clean consolidated set:

🎨 Visual Tokens

color

opacity

border (stroke)

radius

shadow (elevation)

blur

📏 Layout Tokens

spacing (padding, margin, gap)

size (width, height)

grid

breakpoints

🔤 Typography Tokens

font family

font size

weight

line height

letter spacing

🎞 Motion Tokens

duration

easing

animation

🧱 System Tokens

z-index

elevation (maps to shadow)

density (optional)

🖼 Asset Tokens

icons

images

illustrations

👉 That’s it.

Not 30 types. Not plugin-defined chaos.

⚠️ Now mapping your list → reality

You mentioned:

✔ Valid (keep)

stroke → ✅ border

corner radius → ✅ radius

shadow → ✅ shadow/elevation

motion → ✅ motion

icon → ✅ asset

semantic → ✅ correct

global → ✅ correct

breakpoints → ✅ layout

grid → ✅ layout

opacity → ✅ visual

z-index → ✅ system

accessibility → ⚠️ not a token (rule layer)

RTL → ⚠️ layout logic, not token

❌ Misleading / redundant

margin vs padding → ❌ both = spacing

elevation vs shadow → ❌ same system

number/dimension → ❌ implementation detail

string tokens → ❌ dangerous (avoid except font)

“other” → ❌ garbage bucket → delete

🔌 3. Mapping to Figma scopes (clean version)

Now your original question:

🎯 Final Mapping
COLOR        → Color scope
OPACITY      → Number scope
SPACING      → Number (gap/padding)
SIZE         → Number (width/height)
RADIUS       → Number (corner radius)
BORDER       → Stroke
TYPOGRAPHY   → Typography scope
SHADOW       → Effects
MOTION       → (Not native → handled via naming / export)
Z-INDEX      → (Code only)
ASSETS       → Fill (image) / plugin
GRID         → Layout grids
BREAKPOINTS  → Code only
⚠️ Important: Some tokens DO NOT belong in Figma

This is where most people screw up.

❌ Keep OUT of Figma variables:

breakpoints

z-index

motion (partially)

accessibility rules

RTL logic

👉 These belong in:

code

token JSON

design docs

🧠 4. W3C / Tokens Studio confusion (cleared)

You pasted:

“dimension”

“number”

“composition”

“box shadow composite”

👉 These are formats, not system design.

Example:

shadow.sm = {
  x: 0,
  y: 1,
  blur: 2,
  color: "#0000001A"
}

That’s how it’s stored, not how you think.

🚀 Final mental model (this is what you stick to)
LEVELS:
global → alias → semantic

TYPES:
color, spacing, size, radius, typography, shadow, motion, opacity, asset, z-index

SCOPES:
just where they apply (Figma limitation)
⚡ What you should do next (very конкрет)

Delete garbage categories

“other”

“string content”

mixed number tokens

Rebuild token sets:

global

semantic

Group by type inside sets:

color/*

spacing/*

text/*

shadow/*

Ignore 30% of what Tokens Studio tells you

it’s flexible, not opinionated

🧭 Final push (important)

Right now you’re trying to:

understand tokens

You should shift to:

enforcing a token contract across design + code

If you want, next I can:

convert your Kits → proper token.json (W3C compliant)

map → Tailwind config

define → MCP schema

That’s when this becomes real infrastructure, not theory.

⚠️ Important: Some tokens DO NOT belong in Figma - iti sifine iw ill use https://tokens.studio/ + github as it is hight time

so now i ask to reevaluate eveuyrhting

Good. Now you’re making the right architectural move.

Switching to:

✅ Tokens Studio + GitHub = source of truth
✅ Figma = consumer layer
✅ Code = runtime

This changes everything. So yes—we need to reevaluate from scratch, not tweak.

🧠 New Reality (post decision)

Earlier:

“What should stay in Figma?”

Now:

❌ Figma is NOT your source of truth anymore
✅ Tokens live in JSON (W3C format)
✅ Figma just consumes via Tokens Studio

🔥 Final Architecture (this is your system now)
Tokens Studio (Figma plugin)
        ↓
Token JSON (GitHub)
        ↓
Style Dictionary / Transforms
        ↓
Frontend (Tailwind / CSS / React)
        ↓
Figma (reads from tokens)

👉 Direction = GitHub-first, not Figma-first

🧱 1. Token Levels (Reconfirmed)

You were right to question earlier advice. Now it matters more.

✅ FINAL:
global → alias → semantic → component (optional)
Example (real)
{
  "global": {
    "color.yellow.500": { "value": "#FFC700" }
  },
  "alias": {
    "color.brand.primary": { "value": "{color.yellow.500}" }
  },
  "semantic": {
    "button.primary.bg": { "value": "{color.brand.primary}" }
  }
}
🧩 2. Token Types (Rebuilt for Tokens Studio + W3C)

Now we align with:

W3C DTCG

Tokens Studio

Code usage

🎯 FINAL TOKEN TYPES
🎨 Core Visual

color

opacity

border (composite)

shadow (composite)

📏 Layout

dimension (W3C term → use for size/spacing)

spacing (alias of dimension in your system)

radius

grid

breakpoints (code only)

🔤 Typography (composite)

typography (NOT split manually)

text.h1 = {
  "value": {
    "fontSize": 32,
    "fontWeight": 600,
    "lineHeight": 40
  },
  "type": "typography"
}
🎞 Motion

duration

easing

(animation = composition, not base token)

🧱 System

z-index

elevation (alias of shadow)

🖼 Assets

asset (icons, images via URL)

⚠️ Key Correction (important)

Earlier I told you to split typography → ❌

👉 With Tokens Studio + W3C:

✅ Use composite tokens for typography, shadow, border

This is a major upgrade.

🔌 3. What stays in Figma now?

Now the answer changes:

✅ Figma SHOULD consume:

color

spacing

radius

typography

shadow

opacity

❌ Figma SHOULD NOT own:

breakpoints

z-index

motion (partially)

accessibility rules

RTL logic

grid logic (optional visual only)

👉 These stay in GitHub tokens only

🧠 4. Your earlier list — final classification

Let’s clean YOUR exact list:

✅ Keep as tokens

stroke → border

corner radius → radius

shadow → shadow

motion → duration + easing

icon → asset

alias → alias layer

semantic → semantic layer

global → global layer

breakpoints → token (code only)

grid → token

opacity → token

z-index → token

elevation → alias of shadow

⚠️ Transform / merge

margin / padding → spacing

motion animation → composition

typography split → composite token

border → composite (width + color)

❌ Remove from token system

accessibility → rules, not tokens

RTL → layout logic

“other” → delete

string content → delete

🧬 5. Token Studio + GitHub Setup (your new stack)
Repo structure:
tokens/
  global.json
  alias.json
  semantic.json
  component.json

transforms/
  sd.config.js

output/
  tailwind.config.js
  css/variables.css
Token Studio config:

enable multi-file sync

connect to GitHub repo

separate sets:

global

alias

semantic

🔄 6. Transformation Layer (CRITICAL)

You mentioned:

Style Dictionary + sd-transforms

Correct.

Flow:
Tokens Studio JSON
→ @tokens-studio/sd-transforms
→ Style Dictionary
→ Output formats:
   - CSS variables
   - Tailwind config
   - JS/TS tokens
⚡ 7. Where MCP fits NOW (updated)

Earlier MCP was optional.

Now:

🔥 MCP becomes orchestration layer

Use MCP for:

pushing tokens → GitHub

syncing tokens → Figma

triggering builds (Style Dictionary)

validating token schema

🚨 Final Reality Check

Now your system is:

BEFORE:

Figma-centered

visually structured

manually synced

NOW:

GitHub-centered

token-driven

programmatic

scalable

🧭 What I would do next (exact steps)

Set up Tokens Studio → GitHub sync

Create:

global.json

semantic.json

Move ALL variables out of Figma into tokens

Apply tokens back into Figma via plugin

Set up Style Dictionary

Generate Tailwind + CSS vars

(Optional) Add MCP later

💡 Final insight (this is the shift)

You are no longer:

designing components

You are:

designing a token contract that controls your entire product system

If you want next:
I can:

generate your actual token.json from Kits

create Style Dictionary config

map → Tailwind + React system

That’s the point where your system becomes production-grade.

consider reanalysiug everything 

Component tokens (in development)

System tokens

Reference tokens
gestures and mooods

Good—you’ve hit the point where most systems either evolve into real infra or collapse into token soup.

And right now, you’re very close to over-engineering.

So let’s re-evaluate cleanly and cut through this.

🚨 First — Reality Check on What You Added

You introduced:

component tokens

system tokens

reference tokens

gestures

moods

👉 Problem:
You’re mixing different layers of abstraction into “token types”.

That’s wrong.

🧠 The Correct Separation (THIS fixes everything)

You need to split into 4 different systems, not one:

🧱 1. Token System (Design Tokens)

This is what goes into:

Tokens Studio

GitHub JSON

Style Dictionary

ONLY includes:
color
spacing
dimension
radius
typography
shadow
opacity
border
motion (duration, easing)
z-index
asset

👉 This is your actual token system

🧩 2. Reference / Alias System

This is NOT a new type.
This is a layer inside tokens.

You said: “reference tokens” ✅

Correct term:

alias tokens

color.brand.primary = {color.yellow.500}

👉 They exist to:

enable theming

avoid direct global usage

🧠 3. System Tokens (you mentioned)

This is where you’re slightly off.

“System tokens” are NOT separate tokens.

They are:

cross-cutting constraints used by code

Examples:

breakpoints

grid

z-index

layout rules

👉 Some are tokens
👉 Some are configs

Correct classification:
Item	Token?	Where
breakpoints	✅	JSON (code-first)
grid	⚠️	partial token + layout
z-index	✅	JSON
accessibility	❌	rules
🧩 4. Component Tokens (important)

You mentioned:

component tokens (in development)

This is real—but dangerous if misused.

What they ACTUALLY are:
button.primary.padding = {spacing.4}
button.primary.bg = {color.brand.primary}

👉 These are:

semantic extensions scoped to components

Rule:

❌ Don’t start here
✅ Add AFTER semantic layer is stable

🎭 5. Gestures & Moods (you added this)

This is where you're drifting into design language, not tokens.

❌ These are NOT tokens:

gestures

moods

“feelings”

✅ These belong to:
Motion System
motion.fast = 120ms
motion.ease.standard = cubic-bezier(...)
OR Design Language Docs

Example:

“playful”

“serious”

“enterprise”

👉 These guide decisions
NOT stored as tokens

🔥 Final Clean Architecture (Your System)

This is your corrected model:

🧱 LAYERS
1. Global (raw values)
2. Alias (reference layer)
3. Semantic (usage)
4. Component (optional)
🎯 TOKEN TYPES
color
dimension (spacing + size)
radius
typography (composite)
shadow (composite)
border (composite)
opacity
motion (duration, easing)
z-index
asset
🧩 NON-TOKEN SYSTEMS
breakpoints → config/token hybrid
grid → layout system
accessibility → rules
RTL → logic
gestures → interaction design
moods → brand/design language
⚠️ Where most people fail (you’re close)

You’re trying to:

make tokens describe EVERYTHING

That leads to:

bloated JSON

impossible maintenance

confused dev mapping

✅ The rule you should follow

Tokens = values that change UI consistently

NOT:

behavior

logic

content

meaning

🧠 Final clarity (this is your mental model now)
TOKENS → values
SEMANTIC → intent
COMPONENT → implementation
SYSTEM → rules/config
DESIGN LANGUAGE → direction
⚡ What I would do next (very конкрет for you)

Lock token types (don’t expand anymore)

Define:

global.json

alias.json

semantic.json

Ignore:

moods

gestures (for tokens)

Add component tokens later

Move:

breakpoints → config file

grid → layout system

If you want to go deeper

Next level for you would be:

defining token naming contract (strict)

creating Style Dictionary transforms

mapping → Tailwind + React props

building multi-brand theming via alias layer

You’re very close now—but this step decides whether this becomes:

a clean infra system
OR
a very sophisticated mess

Let’s keep it on the first path.

give whats best - but with full valye / mapping / everything

Alright—this is the final, no-confusion, production-grade system.

Not theory. Not options.
This is what you implement across Tokens Studio + GitHub + Figma + Code.

🧠 0. Core Principle (lock this)

Tokens = values
Layers = meaning
Components = usage
Code = execution

🧱 1. TOKEN ARCHITECTURE (FINAL)
✅ Layers (strict)
global → alias → semantic → component
🔹 Global (raw values only)
{
  "color": {
    "yellow": {
      "500": { "value": "#FFC700", "type": "color" }
    }
  },
  "spacing": {
    "4": { "value": "16px", "type": "dimension" }
  },
  "radius": {
    "sm": { "value": "6px", "type": "dimension" }
  }
}
🔹 Alias (branding / theming layer)
{
  "color": {
    "brand": {
      "primary": { "value": "{color.yellow.500}", "type": "color" }
    }
  }
}
🔹 Semantic (UI intent)
{
  "button": {
    "primary": {
      "bg": { "value": "{color.brand.primary}", "type": "color" },
      "padding": { "value": "{spacing.4}", "type": "dimension" }
    }
  }
}
🔹 Component (optional, controlled)
{
  "button": {
    "primary": {
      "height": { "value": "40px", "type": "dimension" }
    }
  }
}
🎯 2. TOKEN TYPES (FINAL + MAPPED)

This is your complete, correct list:

🎨 COLOR
"type": "color"

Figma:

fill

text

stroke

Code:

--color-brand-primary: #FFC700;
📏 DIMENSION (unified system)

👉 replaces:

spacing

size

margin/padding

"type": "dimension"

Examples:

spacing.4 = 16px
size.icon.sm = 16px

Figma:

auto layout

width/height

🔲 RADIUS
"type": "dimension"

Figma:

corner radius

🔤 TYPOGRAPHY (COMPOSITE)
{
  "text": {
    "h1": {
      "value": {
        "fontFamily": "Inter",
        "fontWeight": 600,
        "fontSize": "32px",
        "lineHeight": "40px",
        "letterSpacing": "0px"
      },
      "type": "typography"
    }
  }
}

Figma:

full text styles

Code:

font-size: 32px;
line-height: 40px;
🌫 SHADOW (COMPOSITE)
{
  "shadow": {
    "sm": {
      "value": {
        "x": "0px",
        "y": "1px",
        "blur": "2px",
        "spread": "0px",
        "color": "#0000001A"
      },
      "type": "boxShadow"
    }
  }
}

Figma:

effects

🧱 BORDER (COMPOSITE)
{
  "border": {
    "default": {
      "value": {
        "width": "1px",
        "style": "solid",
        "color": "{color.gray.300}"
      },
      "type": "border"
    }
  }
}
🔳 OPACITY
{
  "opacity": {
    "disabled": { "value": 0.4, "type": "opacity" }
  }
}
🎞 MOTION
{
  "motion": {
    "duration": {
      "fast": { "value": "120ms" }
    },
    "easing": {
      "standard": { "value": "cubic-bezier(0.4,0,0.2,1)" }
    }
  }
}

👉 Figma: limited
👉 Code: primary use

🧱 Z-INDEX
{
  "zIndex": {
    "modal": { "value": 1000 }
  }
}

👉 Code only

🖼 ASSET
{
  "icon": {
    "logo": {
      "value": "https://cdn.yoursite.com/logo.svg",
      "type": "asset"
    }
  }
}

Figma:

fill / plugin usage

🔌 3. FULL MAPPING (DESIGN → CODE)
TOKEN        → FIGMA           → CODE

color        → fill/text       → CSS vars
dimension    → spacing/size    → spacing/size scale
radius       → corner radius   → border-radius
typography   → text styles     → font system
shadow       → effects         → box-shadow
border       → stroke          → border
opacity      → opacity         → opacity
motion       → (limited)       → transitions
z-index      → ❌              → layout layering
asset        → image fill      → CDN/assets
⚠️ 4. NON-TOKEN SYSTEMS (STRICTLY SEPARATE)

These are NOT tokens but must exist:

Breakpoints
// tailwind.config.js
screens: {
  sm: "640px",
  md: "768px"
}
Grid

layout system

not token-driven fully

Accessibility

contrast rules

not tokens

RTL

layout logic

not tokens

Gestures / Moods

👉 belong to:

motion design

brand guidelines

NOT tokens

🔥 5. FINAL REPO STRUCTURE
tokens/
  global.json
  alias.json
  semantic.json
  component.json

build/
  sd.config.js

output/
  css/
  tailwind/
  js/
🔄 6. TRANSFORMATION PIPELINE
Tokens Studio
→ GitHub JSON
→ sd-transforms
→ Style Dictionary
→ Outputs:
   - CSS variables
   - Tailwind config
   - JS tokens
⚡ 7. RULES (NON-NEGOTIABLE)

❌ No hex in components

❌ No px in components

❌ No direct global usage

✅ Always use semantic

✅ Alias for branding

✅ Composite tokens where needed

❌ No content as tokens

🧠 Final System (one line)
Global → Alias → Semantic → Component → Figma + Code
🚀 What you have now

This is no longer:

a Figma design system

This is:

a cross-platform design infrastructure

If you want next step

I can now:

generate your actual token files from Kits repo

create Style Dictionary config

map → Tailwind + React system

or define multi-brand theming setup

That’s the last step from “clean system” → “production engine”.