# WordPress Playground Blueprints for Kits Suite

This directory contains declarative [WordPress Playground](https://playground.wordpress.net) blueprint configurations for running and testing the Kits Suite products in zero-setup WebAssembly WordPress instances.

## Architecture & Version Matrix

All blueprints conform to the official Playground schema (`https://playground.wordpress.net/blueprint-schema.json`) and target:
- **WordPress Version:** 6.7
- **PHP Version:** 8.2
- **Networking:** Enabled (`"features": { "networking": true }`)

## Blueprints Available

| Blueprint | Path | Target Landing Page | Purpose |
| :--- | :--- | :--- | :--- |
| **Universal Base** | `tools/playground/blueprint-base.json` | `/wp-admin/` | Clean base environment with administrator credentials and default settings. |
| **DirectoryWeb** | `tools/playground/blueprints/directoryweb.json` | `/wp-admin/edit.php?post_type=aw_listing` | Installs DirectoryWeb, provisions sample verified listing, tests standalone operations. |
| **RankWeb** | `tools/playground/blueprints/rankweb.json` | `/wp-admin/admin.php?page=rankweb-settings` | Installs RankWeb, configures title/description templates, tests native SEO controls. |
| **SourceWeb** | `tools/playground/blueprints/sourceweb.json` | `/wp-admin/admin.php?page=sourceweb` | Installs SourceWeb, tests syndication and feed ingestion settings. |
| **InsightWeb** | `tools/playground/blueprints/insightweb.json` | `/wp-admin/admin.php?page=insightweb` | Installs InsightWeb, tests dashboard tiles with empty-state semantics (no mock data). |
| **MailWeb** | `tools/playground/blueprints/mailweb.json` | `/wp-admin/admin.php?page=mailweb` | Installs MailWeb, verifies Hostinger Mail API SDK bundling and transport fallback. |
| **PlanWeb** | `tools/playground/blueprints/planweb.json` | `/wp-admin/admin.php?page=planweb` | Installs PlanWeb, tests editorial calendar navigation and milestone planning. |

## Running Blueprints

### In the Browser
Load any blueprint directly by hosting or linking to it:
```
https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/AnimalWrites/Kits/kits-suite/tools/playground/blueprints/<product>.json
```

### Locally via CLI
Using the official `@wp-playground/cli`:
```bash
npx @wp-playground/cli --blueprint=tools/playground/blueprints/directoryweb.json
```
