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