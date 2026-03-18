🧠 Figma Make Prompt (Use this directly)
Writing

Audit and restructure the existing "Wugweb Kits" design system into a scalable, production-ready system aligned with design-to-code workflows and token-based architecture.

Context:

This file already contains components, variables, and styles.

There is an associated GitHub repo: https://github.com/wugweb-git/Kits

The goal is to transform this into a system that supports token sync, MCP connectors, and frontend integration (React / Tailwind / Web).

Tasks:

Token Architecture Refactor

Reorganize all variables into 3 layers:
a. Core (raw values: colors, spacing, radius, typography primitives)
b. Semantic (usage-based: text.primary, bg.surface, button.primary.bg)
c. Component (optional overrides for specific components)

Remove hardcoded values (hex, px) from components and map everything to variables

Eliminate invalid tokens such as text content inside variables

Naming System Standardization

Enforce consistent naming:

color.brand.primary.500

spacing.4, spacing.6

text.heading.h1, text.body.md

Avoid ambiguous or one-off names

Ensure naming is scalable to 10x expansion

Component System Audit

Identify duplicate or inconsistent components (especially buttons, inputs, cards)

Convert components into variant-based architecture:

size (sm, md, lg)

state (default, hover, disabled)

type (primary, secondary, ghost)

Ensure all components strictly consume tokens (no local overrides)

Typography System

Convert typography into structured tokens:

font family

size

weight

line height

letter spacing

Create semantic text styles (h1, h2, body, caption)

Layout + Spacing Enforcement

Ensure all auto-layout gaps, padding, and sizing use spacing tokens

Remove arbitrary values

Effects + Elevation

Define shadow, blur, and opacity tokens

Apply consistently across components

Code Alignment (Important)

Structure tokens so they can map directly to:

Tailwind config

CSS variables

JSON token files

Ensure naming is compatible with frontend usage

Output

Provide:
a. Clean variable structure
b. Updated component architecture
c. Token JSON structure for export
d. List of inconsistencies fixed
e. Recommendations for MCP connector integration

Constraints:

Do not redesign visually unless necessary

Focus on system integrity, scalability, and dev alignment

Keep the system minimal, strict, and extensible

Goal:
Transform this from a Figma design file into a design infrastructure layer that can sync with code and scale across products.

⚡ Why this works (quick reality check)

This prompt forces Figma Make to:

stop being decorative

act like a system architect

It explicitly:

kills token chaos

aligns with your GitHub repo

prepares for MCP (which you asked earlier)

🧭 How to use it properly

Don’t just run it once.

Run flow:

Run prompt → get output

Apply changes partially

Re-run with:

“validate current system against rules”

Iterate

🚨 One important pushback

If your current Kits file is messy (which it likely is),
this prompt will not magically fix everything in one go.

You’ll still need:

manual cleanup

decisions on naming

pruning components

If you want next level

I can:

map your GitHub repo → token schema

define Tailwind config from your tokens