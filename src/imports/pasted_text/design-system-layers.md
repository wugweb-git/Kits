I’ll give you a complete layered model that connects:

tokens → components → blocks → UI → screens → flows → product

motion + icons + behavior

🧠 0. The Big Picture (Your System)
TOKENS → STYLES → COMPONENTS → BLOCKS → SCREENS → FLOWS → PRODUCT

Each layer has a clear responsibility. No overlap.

🧱 1. TOKENS (Foundation Layer)

👉 Already defined, but placing correctly in system

Responsibility:

store raw values

enable consistency across platforms

Types (final)
color
dimension (spacing + size)
radius
typography (composite)
shadow
border
opacity
motion (duration, easing)
z-index
asset (icons/images)
Output:

JSON (GitHub)

CSS variables

Tailwind config

🎨 2. STYLES (Figma Layer)

👉 This is often ignored—but critical

Responsibility:

map tokens → usable styles

Includes:
Color styles

text.primary

bg.surface

Text styles

heading.h1

body.md

Effect styles

shadow.sm

👉 This is where Figma becomes usable
👉 NOT where logic lives

🧩 3. COMPONENTS (Atomic Level)

👉 Smallest reusable UI units

Examples:

Button

Input

Badge

Checkbox

Avatar

Structure:
Component:
  Type (primary, secondary)
  Size (sm, md, lg)
  State (default, hover, disabled)
Rules:

100% token-driven

no hardcoded values

variant-based (not duplicates)

🧱 4. BLOCKS (Composition Layer)

👉 This is where most systems are weak

What are blocks?

Reusable UI patterns made of components.

Examples:

Navbar

Card

Form

Table

Modal

Dashboard widget

Structure:
Block:
  layout
  component composition
  spacing rules

👉 Blocks = real product UI, not just elements

🖥 5. SCREENS (Page Layer)

👉 Actual product views

Examples:

Dashboard

Booking page

Invoice page

Settings

Structure:
Screen:
  blocks
  layout grid
  data mapping

👉 Screens should:

NOT invent UI

ONLY assemble blocks

🔄 6. USER FLOWS (Behavior Layer)

👉 This is where product thinking comes in

Examples:

Booking flow

Checkout flow

Onboarding

Login

Structure:
Flow:
  screen → screen → state changes

👉 Flows define:

transitions

logic

edge cases

🎞 7. MOTION SYSTEM (Cross-layer)

You mentioned gestures + moods → here’s the correct place.

🎯 Motion Tokens
duration.fast = 120ms
duration.normal = 240ms

easing.standard = cubic-bezier(0.4,0,0.2,1)
🎬 Motion Rules
Micro-interactions

button hover

input focus

Transitions

modal open

page switch

Feedback

loading

success/error

🎭 “Moods” → translated properly
Mood	Motion behavior
Fast	120–160ms
Calm	240–300ms
Premium	easing + delay
Playful	bounce/spring

👉 Mood is NOT a token
👉 It’s a motion preset

🖱 8. INTERACTION SYSTEM (Gestures)

👉 This is NOT tokens—it’s behavior

Desktop:

hover

click

focus

Mobile:

tap

swipe

drag

Example:
Button:
  hover → elevate + color change
  click → scale 0.98
🖼 9. ICON SYSTEM

You mentioned icons—this is often messy.

Structure:
icon/
  system/
    add
    edit
    delete
  product/
    booking
    invoice
Rules:

16 / 20 / 24 sizes only

stroke consistency

tokenized color

Token mapping:
icon.color.default = {color.gray.600}
🖼 10. ASSET SYSTEM
Includes:

images

illustrations

logos

Token example:
image.hero.default = "https://cdn/hero.png"

👉 Used for:

marketing

dashboards

CMS-driven UI

📐 11. LAYOUT SYSTEM
Includes:

grid

spacing

containers

Example:
container.max = 1200px
grid.columns = 12

👉 Some in tokens
👉 Some in code

⚠️ 12. WHAT NOT TO MIX

This is where systems break:

❌ Tokens ≠ Components
❌ Components ≠ Screens
❌ Motion ≠ Tokens
❌ Mood ≠ Data
❌ Accessibility ≠ Tokens

🔥 FINAL SYSTEM (Your Blueprint)
FOUNDATION:
  Tokens

DESIGN:
  Styles

UI:
  Components → Blocks → Screens

PRODUCT:
  User Flows

CROSS-LAYER:
  Motion
  Interaction
  Icons
  Layout
🧭 How THIS applies to you (important)

For your stack (StayWeb + Kits):

You should build:
1. Tokens (GitHub + Tokens Studio) ✅
2. Components (strict variants)
3. Blocks (PMS-specific UI) ← BIG opportunity
4. Screens (assembled only)
5. Flows (booking, invoice, etc.)

👉 Most competitors stop at components
👉 You go to blocks + flows = product system