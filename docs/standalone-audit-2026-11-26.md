# Standalone audit of six plugins, 26 Nov 2026

Plugins: DirectoryWeb, RankWeb, SourceWeb, InsightWeb, MailWeb, PlanWeb. All six entered this repo on 21 Nov 2026 (commit 2ed264f).

**Method.** One read-only reviewer per plugin read the code and ran every test file. A live install test (each plugin installed alone, no Kits Core, WordPress Playground) was run separately. Nothing was opened in a real browser by the reviewers. Findings below were spot-checked by the lead where noted.

## Headline

| Plugin | Installs and activates alone | Fully usable alone | Verdict |
|---|---|---|---|
| DirectoryWeb 1.2.2 | yes (Playground) | no: 5 of 8 admin screens are an error without Kits Core | Partly |
| RankWeb 2.3.3 | yes | mostly: classic fallback screens exist; redirects need Rank Math | Partly |
| SourceWeb 0.2.4 | yes | no: most tabs are not usable; nothing fetches feeds inside WordPress | No |
| InsightWeb 1.1.3 | yes | no: only Keywords, Settings, Overview without Kits Core | Partly |
| MailWeb 3.3.3 | yes | no: Dashboard, Inbox and Settings are an error without Kits Core | Partly |
| PlanWeb 0.3.1 | yes | no: the main Calendar menu page is an error | Partly |

None of the six hits a fatal error without Kits Core: every call to a Kits Core function is guarded. The gap is the admin screens, which are drawn by Kits Core's shell, and which have little or no fallback.

## Mistakes found in our own releases (fixed, awaiting push and release)

1. **MailWeb 3.3.2 shipped held code.** The sender-profile and retry-queue file (`tenant-profiles.php`) was loaded. It stores the full body of every failed email, including password resets, in an unencrypted option, can retry forever, and accepts a newline in the sender name. Verified in the released zips. Fixed in 3.3.3: not loaded, and the stored data, schedule and profiles are removed once.
2. **InsightWeb 1.1.2 shipped held code.** The 404 and visitor-search logging was loaded; it stores raw 404 paths and visitor search terms. Verified in source. Fixed in 1.1.3: not loaded, stored data removed once.
3. RankWeb 2.3.2: a false "Sitemap not answering" notice and hourly email on any site without Rank Math (found by review; llms.txt and directory cases were already fixed). Page cache could store WooCommerce cart and checkout pages (off by default). Both fixed in 2.3.3.

## Findings still open, by plugin

### DirectoryWeb
- High: Listing Types, Schema and Fields, Form Integrations, Import/Export and Claims list show "needs Kits Core" alone. The readme and changelog say it runs without it.
- High: Animal-welfare and India-specific wording and data ship to every site ("AWBI number", "Animals helped", bundled Indian place data and PIN lookup).
- Medium: External services list omits map tile hosts (tiles.openfreemap.org, tile.openstreetmap.org).
- Medium: stale names (`animal-writes-core`, `AW-C-` claim references shown in the UI, a `wp aw` hint). Public REST namespace `aw/v1`, post types `aw_*`.
- Low: uninstall keeps everything by default; the hourly job is not unscheduled on deactivation.

### RankWeb
- Medium: robots.txt gets a `Content-Signal` AI policy line and a news sitemap line on every site, regardless of which SEO plugin owns SEO.
- Medium: redirects do nothing without Rank Math.
- Medium: Google Fonts download (opt-in) is missing from External services; the readme says "no outside call".
- Medium: uninstall leaves cache files, font files and capabilities.
- Medium: Animal Welfare strings and `aw_*` post types are in shipped code, inert unless those exist.
- Test note: 26 test files exit 255 when run directly; they are meant to be run through `phpunit-lite.php` (CI does this and passes, 272 tests).

### SourceWeb
- High: no native screens for Sources, Keywords, AI models, Places, Workers and others without Kits Core; a standalone user cannot add a feed or an AI key.
- High: nothing fetches feeds inside WordPress. Ingestion is pushed by external GitHub Actions workers in a private Animal Writes repo.
- High: post types `aw_news`, `aw_legal`, `aw_opportunity` are never registered by this plugin.
- High: Animal Writes seed data, alert emails and dashboard box ship to every site.
- High: ingest routes need only `edit_posts`; some paths publish without review. API keys are stored in plain text options.
- Medium: External services list incomplete (favicons, image hosts, several AI providers). Consent gate for open models is dead code.
- Test note: four test files exit 255 because they need Animal Writes Core functions.

### InsightWeb
- High: without Kits Core only Keywords, Settings and Overview work; the readme lists more.
- High: visitor tracking is on by default with no switch, storing country and a shortened IP for 30 days; not disclosed in the readme.
- High: Kits Core upsell notice on every standalone screen.
- Medium: External services omit db-ip.com (monthly download) and favicon fetching; the readme's PageSpeed "only with a key" is wrong.
- Medium: a missing seed file records an error on every clean site's daily run (display unverified).
- Medium: Animal Writes wording in downloads and notices; settings written into RankWeb's option.

### MailWeb
- High: Dashboard, Inbox and Settings are an error without Kits Core.
- High: activation alone takes over every `wp_mail` on the site: forces the From address, caps the whole site at 90 mails a day, stores every mail body in a table. Not disclosed.
- High: Animal Writes code ships (`website-forms.php`, `fluentcrm.php`, newsletter table and shortcode, an admin notice on every screen).
- Medium: readme contradicts code on uninstall, logging and who can read mailboxes (editors). Uninstall and deactivation leave data and schedules. External services list incomplete (SMTP presets, DNS lookups).
- Note: the bundled Hostinger SDK is MIT; not inspected on disk.

### PlanWeb
- High: the main Calendar menu page shows "needs Kits Core" alone; the calendar feed key and Settings are shell-only.
- High: Animal Writes sample dates are written into other sites' options and shown in a Dashboard widget when the module is off.
- Medium: calendar-views code is dead (no caller, no script); PENDING lists drag-and-drop as done. Compiled JS is stale: it lacks the Repeat field and jobs settings from 0.3.0.
- Medium: a "Kits Core is not loaded" notice appears on PlanWeb's own screen.

## Across all six
- `Requires at least: 7.1` and `Tested up to: 7.1` could not be confirmed by the reviewers; the test site and Playground run WordPress 7.1.
- Corrected by the lead: the `Update URI` header is present in the direct-download zip (needed for registry updates) and absent from the `-wporg.zip` for each plugin (checked on DirectoryWeb and PlanWeb builds). Reviewer claims that it blocks WordPress.org are only true of the direct build.
- The Animal Writes `aw_` prefix remains on post types, options, REST and cron names (documented as no migration in 1.x). This fails WordPress.org's prefix rule in part.
- The word "standalone" in readmes and changelogs is currently stronger than the code supports for every plugin except at the "installs and runs without a fatal" level.

## Not verified by anyone
Real browser rendering of the fallback screens; Plugin Check output for any plugin; live mail, Site Kit and Fluent Forms behaviour; what the Playground standalone test does not assert (it checks menus, REST and head tags, not that each screen is usable).
