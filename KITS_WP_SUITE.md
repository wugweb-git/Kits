# Kits by Wugweb — WordPress Suite (Theme & Companion Plugins)

This directory houses the official WordPress Suite for **Kits by Wugweb**, designed for multi-tenant deployment across 1 default site and 3 tenant installations with minimal setup.

---

## 1. Directory Structure

```
├── themes/
│   └── kits-by-wugweb/          # Universal Full Site Editing (FSE) block theme
│       ├── theme.json           # Design system root presets (palette, typography, spacing, radii)
│       ├── styles/              # WordPress style variations (Dark, Slate, Forest, Colours/Ink)
│       ├── templates/           # Native Gutenberg block templates (index, single, archive, 404, etc.)
│       ├── parts/               # Modular template parts (header, footer, announcement, sidebar)
│       ├── patterns/            # Curated block patterns (heroes, cards, FAQs, CTAs)
│       └── inc/theme-info.php   # Full theme metadata (title, purpose, functions, logo, themes_api)
│
└── plugins/
    ├── kits-core/               # Shared engine: Brand Customizer, forms, ALTCHA spam guard, Block Bindings, sharing
    ├── directoryweb/            # Directory listings, search filter engine, interactive maps, organization hub
    ├── rankweb/                 # SEO & metadata engine, automated schema, XML sitemaps, internal links
    ├── mailweb/                 # High-deliverability newsletters, transactional mail, subscriber management
    ├── sourceweb/               # Content sourcing, research attribution, auto-enrichment, media verification
    ├── insightweb/              # Consent-mode analytics, search queries, editorial content metrics
    └── planweb/                 # Editorial calendar, campaign planner, issue scheduling
```

---

## 2. Multi-Tenant Deployment Model (1 Default + 3 Tenants)

The suite is engineered so that **1 default install and 3 tenant sites** can run the exact same theme and companion plugins codebase with zero code changes or template branching.

| Tenant Profile | Archetype | Primary Accent | Base Radius | Display Font Stack |
| :--- | :--- | :--- | :--- | :--- |
| **Default** | *Animal Writes / Neutral Kits* | `#FFBE1A` (Gold) | `8px` / `12px` | System Sans / Inter |
| **Tenant 1** | *Modern Tech & SaaS* | `#2563EB` (Electric Blue) | `6px` / `10px` | Inter, -apple-system, Roboto |
| **Tenant 2** | *Editorial & Publishing* | `#C2410C` (Terracotta) | `2px` / `4px` | Georgia, Times New Roman |
| **Tenant 3** | *Eco, Health & Community* | `#059669` (Emerald) | `9999px` (Pill) / `16px` | Plus Jakarta Sans, system-ui |

---

## 3. Brand Customizer UI (`Appearance > Brand Tokens`)

Each tenant administrator can customize design tokens directly via the WordPress admin without writing CSS or modifying files:

1. Navigate to **Kits → Brand Customizer** (or **Appearance → Brand Tokens**).
2. Use **1-Click Tenant Presets** to instantly adopt one of the pre-configured profiles, or adjust individual tokens:
   - **Colors:** Accent (`--kit-color-accent`), Accent Contrast (`--kit-color-accent-ink`), Background Canvas (`--kit-color-bg`), Raised Card Surface (`--kit-color-raised`), Ink (`--kit-color-ink`), Text (`--kit-color-text`), Muted (`--kit-color-muted`), and Borders (`--kit-color-line`).
   - **Typography:** Display Font Family (`--kit-font-display`) and Body Font Family (`--kit-font-body`).
   - **Shapes & Corners:** Controls/Buttons (`--kit-radius-control`), Cards (`--kit-radius-card`), Media/Hero (`--kit-radius-media`), and Badges/Pills (`--kit-radius-pill`).
   - **Layout Dimensions:** Content max-width (`--kit-width-content`), Wide grid container max-width (`--kit-width-wide`), and Section vertical padding (`--kit-space-section-base`).
3. Click **Save Brand Tokens**:
   - Tenant overrides are injected into **Layer 3 `theme.json`** (`wp_theme_json_data_theme`, cached in `kits_brand_theme_data` transient) so Site Editor **Reset styles** restores tenant defaults.
   - Dynamic CSS overrides are compiled into `<style id="kits-brand-tokens">`.
   - Variables seamlessly bridge to WordPress native block styles via `--wp--preset--*`.
   - Both the frontend and Gutenberg Block Editor canvases reflect changes immediately.
   - Any active page cache (LiteSpeed Cache) is automatically purged upon save.
   - Use **Restore Active Preset** to revert to the active tenant preset, or **Clear Brand** to remove all tenant overrides.
   - Preset profiles are filterable via `kits_brand_presets`, and `kits_brand_tokens` is included in **Settings Transfer** and uninstall backups.

---

## 4. Migration & Multi-Site Replication (Export / Import)

Under the **Tenant Token Backup & Migration** section in the Brand Customizer:
- **Export:** Copy the JSON snippet containing your tenant's active tokens.
- **Import:** On a newly installed tenant site, paste the JSON snippet and click **Import & Apply Configuration**.

---

## 5. Minimal Setup Quickstart for New Tenants

1. Upload and activate `themes/kits-by-wugweb` in `wp-content/themes/`.
2. Upload and activate the desired companion plugins in `wp-content/plugins/` (at minimum `kits-core`).
3. Go to **Appearance → Brand Tokens**:
   - Pick a tenant preset or paste your brand tokens JSON.
   - Click Save.
4. Your tenant site is now fully styled, branded, and operational!
