# Wugweb Kits Design System — CHANGELOG

All notable changes to the Kits design system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] — 2026-07-26

### Added
- 4-layer token system (Core → Alias → Semantic → Component) in `src/styles/globals.css`
- W3C DTCG-compliant token JSON files in `src/tokens/` (global.json, alias.json, semantic.json, component.json)
- Style Dictionary build pipeline (`npm run tokens:build`, `npm run ds:tokens:build`)
- Token validation scripts (`npm run validate:tokens`)
- Design system documentation hub at `design-system/`
- Source-of-truth docs in `design-system/docs/`
- Component-per-folder wrappers under `src/components/ui/<Component>/index.ts`
- Canonical bridge at `src/components/ui/index.ts`
- Token normalization: removed space-based token keys, replaced with kebab-case

### Changed
- Migrated from raw hex/px values to token-based styling in UI components
- Normalized all component tokens to reference semantic layer
- Rebuilt `src/components/ui` with Radix-based primitives (accordion, alert, alert-dialog, etc.)

### Pending
- Full parity migration: 61 doc pages still import via `src/components/ui/legacy-adapters.ts`
- Missing grouped components: AccordionGroup, AvatarGroup, AreaChart, BarChart, ButtonGroup, etc.
- Missing custom components: Banner, CTABanner, ChatBubble, Clipboard, DeviceMockup, etc.
- Screenshot-diff visual regression tooling (future work)

## [1.0.0] — 2026-07-21

### Added
- Initial component library with 50+ UI components
- Base components: Button, Input, Card, Badge, Dialog, Dropdown, Tabs, etc.
- Chart components: AreaChart, BarChart, LineChart, PieChart, RadarChart, RadialChart
- Form components: Checkbox, RadioGroup, Switch, Slider, Select, DatePicker, etc.
- Navigation: Header, Footer, SideMenu, MegaMenu, Breadcrumb, Pagination
- Data display: Table, DataTable, ListGroup, Timeline, Avatar
- Feedback: Toast, Spinner, Skeleton, Progress, Rating
- Layout: Grid, Divider, Jumbotron
- Utilities: Clipboard, SearchInput, Kbd, Tag, Chip, Logo
- Block templates: Hero, Features, Pricing, Testimonials, CTA, Forms
- Documentation site with component examples
- Figma integration and token mapping docs

### Infrastructure
- Vite + React + TypeScript setup
- Tailwind CSS v4 with custom @theme bridge
- Sonner toast integration
- Framer Motion animations
- Supabase authentication framework
- Recharts for data visualization