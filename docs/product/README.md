# Products

Released versions (stable, 28 Nov 2026): Kits Core 1.5.0, DirectoryWeb 1.5.0, RankWeb 2.5.1, SourceWeb 0.7.0, InsightWeb 1.4.0, MailWeb 3.7.0, PlanWeb 0.7.0, Kits by Wugweb theme 2.2.2. Each product's open work is in its `PENDING.md`; its history is in its `CHANGELOG.md`.

| Product | What it does | REST namespace |
|---|---|---|
| Kits Core | Shared engine: brand customizer, form engine and spam guard (ALTCHA), share bar, update checker from the registry, site-check route, six custom blocks, optional shared admin shell, More from Kits page | `kits/v1` |
| DirectoryWeb | Directory listings, search and filters, interactive maps, claims with evidence review, one neutral registration number, type and date | `directoryweb/v1` |
| RankWeb | SEO titles and descriptions, schema, sitemaps, internal links, redirects, FAQ, image and CSV tools, bulk edit | `rankweb/v1` |
| SourceWeb | Content sourcing, places and routes, attribution, enrichment, scheduled workers through GitHub Actions, Run now | `sourceweb/v1` |
| InsightWeb | Search and visitor insights from Site Kit, keywords, pages, links, Clarity, referrers, Dashboard by country | `insightweb/v1` |
| MailWeb | Delivery log with Resend, fallback SMTP, alerts, Inbox with status, provider picker | `mailweb/v1` |
| PlanWeb | Editorial calendar, list, filters, date range, Timeline | `planweb/v1` |
| Kits by Wugweb (theme) | Universal block theme: style variations, patterns, template parts | none |

## Shared standard

Each plugin has one menu item under Plugins (folded), screens on the Kits shell (with a classic fallback screen when the shell is absent), its own REST namespace, `readme.txt`, a translation template, and an uninstall that deletes only its own data, with an optional backup. Kits Core is never required.

## Extension points (neutral filters)

`rankweb_post_type_roles`, `sourceweb_post_type_roles`, `insightweb_post_type_roles`, `sourceweb_starter_sources`, `planweb_import_source`, `directoryweb_meta_fields`, `directoryweb_claim_fields`, `directoryweb_ff_dates`, `mailweb_fcrm_blocked_emails`, `kits_error_page_marker`, `kits_features`, `kits_settings_fields`, `sourceweb_favicon_hosts`, `insightweb_favicon_hosts`, `kits_more_can_install`.

## Outside services

Each plugin lists every outside service it calls under External services in its `readme.txt`. Nothing is called unless the feature is used. The More from Kits Install reads the registry and the GitHub release download only on click.
