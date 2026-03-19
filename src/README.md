# Wugweb Kits — Design System

> **Live:** [kits.wugweb.studio](https://kits.wugweb.studio) · **Figma:** [wugweb-kits](https://www.figma.com/design/ttIty8LUIsRsU4AJFlX8To/wugweb-kits) · **v2.1.0**

Production-ready design system for Wugweb products and the broader dev community. 81 React components, a strict 4-layer CSS token architecture, fluid responsive type, and a full token-to-code mapping system.

---

## What's in the box

| Layer | What |
|---|---|
| **81 Components** | Buttons, inputs, charts, overlays, navigation, layout, feedback |
| **4-Layer Tokens** | Core → Alias → Semantic → Component (W3C DTCG) |
| **Fluid Type** | `clamp()`-based scale: Display → Caption, viewport-driven |
| **Token Export** | `global.json`, `alias.json`, `semantic.json`, `component.json` |
| **Token Mapping** | Figma scope → CSS property → Tailwind class → component |
| **459 Blocks** | Hero, Feature, Pricing, Testimonials, CTAs, Forms, Nav, Footer |
| **6 Templates** | Dashboard, Landing Page, Marketing, Docs, Portfolio, E-commerce |
| **MCP Connector** | Planned: push tokens to GitHub, trigger Style Dictionary builds |

---

## Token System (4 Layers)

```
LAYER 0 — CORE (globals.css)
  Raw values only. #FFBE1A, 16px, 8px radius.
  Never used directly in components.
  ↓
LAYER 1.5 — ALIAS (alias.json)
  Brand bridge. Maps core → brand names.
  Swap this file to change brand.
  ↓
LAYER 2 — SEMANTIC (semantic.json)
  Intent layer. --background, --accent, --text-primary.
  Change here → everything updates.
  ↓
LAYER 3 — COMPONENT (component.json)
  Per-component overrides. --btn-height-md, --card-radius.
  References semantic only. Never core.
```

### Rules (non-negotiable)
- ✅ Always use `var(--token)` — never hardcode `#hex`, `px`, or `rem`
- ✅ Components reference semantic layer only
- ✅ Font face: **Inter Tight** only (mono for code blocks)
- ❌ Never use Tailwind `text-2xl` or `font-bold` classes — use token vars
- ❌ Never skip the semantic layer (core → component directly)

---

## Getting Started

```bash
# Clone
git clone https://github.com/wugweb-git/Kits.git
cd Kits

# Install
npm install

# Dev server
npm run dev

# Token validation
npm run validate:tokens

# Style Dictionary build
npm run tokens:build
```

---

## Folder Structure

```
/
├── App.tsx                    # Entry — routing, layout shell
├── index.html                 # Full SEO metadata, OG tags, favicon
├── styles/
│   ├── globals.css            # 4-layer token system (THE source of truth)
│   └── animations.css         # Scroll reveal, page transitions
├── components/
│   ├── ds/                    # Documentation site shell
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ContextualSidebar.tsx
│   │   ├── TopNavigation.tsx
│   │   ├── PageWrapper.tsx
│   │   ├── TokenCard.tsx
│   │   └── pages/             # All doc pages (150+)
│   │       ├── blocks/        # 8 block section pages
│   │       └── templates/     # Dashboard, Landing, Stubs
│   ├── wugweb/                # 81 public component modules
│   │   └── index.ts           # Single export barrel
│   ├── ui/                    # shadcn/radix primitives (base layer)
│   ├── motion/                # ScrollReveal, animation wrappers
│   └── figma/                 # ImageWithFallback (protected)
├── hooks/
│   ├── useMediaQuery.ts       # useBreakpoint hook
│   └── useMotion.ts           # useScrollPosition, usePrefersReducedMotion
├── lib/
│   ├── design-tokens.ts       # Token data for Tokens doc page
│   └── component-registry.ts  # Component registry
├── utils/
│   ├── clipboard.ts
│   ├── layout.ts
│   └── responsive.ts
├── imports/
│   ├── Kits_Logo.svg          # Brand mark
│   ├── pasted_text/           # Architecture & token reference docs
│   └── [figma-imports]/       # Auto-generated Figma component imports
└── contexts/
    └── MotionContext.tsx
```

---

## Components at a Glance

**Form Controls** (16) · Input, SearchInput, NumberInput, PhoneInput, Textarea, Checkbox, RadioGroup, Switch, Select, NativeSelect, Combobox, Slider, Calendar, DatePicker, TimePicker, FileInput, WYSIWYG

**Data Display** (8) · Table, DataTable, Card, ListGroup, Badge, Chip, Avatar, Kbd

**Surfaces / Actions** (10) · Button, ButtonGroup, SocialButton, CTABanner, TeamCard, TopicTile, Jumbotron, Rating, Indicator, EmptyState

**Navigation** (9) · Header, Breadcrumb, Pagination, Tabs, NavigationMenu, SideMenu, MenuItem, MegaMenu, BottomNavigation

**Feedback** (8) · Alert, AlertDialog, Dialog, Toast, Banner, Spinner, Progress, Skeleton

**Overlay** (5) · Drawer, BottomSheet, Popover, Tooltip, Collapsible

**Layout** (6) · Grid, Accordion, Divider, Timeline, Stepper, Form

**Charts** (6) · Area, Bar, Line, Pie, Radar, Radial

**Utility** (9) · Clipboard, SpeedDial, ChatBubble, DeviceMockup, EmbedBadge, Logo, Icon, Avatar, Toaster

---

## Token Export Files

| File | Layer | Contents |
|---|---|---|
| `global.json` | Core | Raw values — colors, spacing, radius, type, shadow, motion |
| `alias.json` | Alias | Brand bridge — swap to change brand identity |
| `semantic.json` | Semantic | Intent tokens — --background, --accent, text.primary |
| `component.json` | Component | Per-component overrides — btn-height, card-radius |

---

## Links

| | |
|---|---|
| Live site | https://kits.wugweb.studio |
| Figma file | https://www.figma.com/design/ttIty8LUIsRsU4AJFlX8To/wugweb-kits |
| GitHub | https://github.com/wugweb-git/Kits |
| Wugweb | https://wugweb.com |
| Contact | hello@wugweb.com |

---

## Wugweb Products using Kits

| Product | Repo | Live |
|---|---|---|
| StayWeb | [wugweb-git/Staywebdev](https://github.com/wugweb-git/Staywebdev) | [stayweb.wugweb.studio](https://stayweb.wugweb.studio) |
| DocWeb | [wugweb-git/Docweb](https://github.com/wugweb-git/Docweb) | [doc.wugweb.studio](https://doc.wugweb.studio) |
| NookWeb | [wugweb-git/Nookweb](https://github.com/wugweb-git/Nookweb) | [nook.wugweb.studio](https://nook.wugweb.studio) |
| ThinkWeb | [wugweb-git/thinkweb](https://github.com/wugweb-git/thinkweb) | [think.wugweb.studio](https://think.wugweb.studio) |

---

## License

MIT © 2024–2026 [Wugweb](https://wugweb.com)
