# RankWeb: Pending & Roadmap

Status as of 25 Nov 2026 on `feat/directoryweb-completion`. Evidence: U unit, H headless Playground, B browser, X external. See `docs/audit/acceptance-gates.md`.

## Active Scope & Responsibilities
The SEO, schema, and sitemap plugin owns:
- Meta title, description, and canonical URL management.
- Real-time Editor Sidebar with title/meta character length counters and SERP previews.
- Breadcrumbs Block (`build/blocks/breadcrumbs.js`).
- Auto-linker engine with keyword-to-URL mapping.
- XML sitemaps: WordPress's own on a standalone site (noindex pages excluded); Rank Math's with directory, filtered and news additions beside Rank Math.
- Schema.org JSON-LD generation (`Article`, `Organization`, `BreadcrumbList`).

---

## Standalone (no Rank Math, no Kits Core, no DirectoryWeb) — 25 Nov 2026

- ✅ `includes/standalone-seo.php`: who prints the head (`rankweb_seo_owner()`: `none`, `rank_math`, `other`), meta description, Open Graph, Twitter, noindex via `wp_robots`, sitemap exclusion, generic post/page schema, `rankweb_site_default()` seam. **U** `tests/StandaloneSeoTest.php` (8). **H** journey 24 checks. **B** sidebar to front end to sitemap verified.
- ✅ `_rankweb_schema_type` has a PHP consumer: Article, BlogPosting, NewsArticle or WebPage; the sidebar offers only those. **B** BlogPosting chosen in the sidebar reached the JSON-LD.
- ✅ `_rankweb_description` and `_rankweb_noindex` (new post meta) are written by the sidebar and read by the head and the sitemap. **B**.
- ✅ Coexistence: **real Rank Math 1.0.282 (B)** with RankWeb active prints title, description, canonical, robots, OG, Twitter and JSON-LD once each, all from Rank Math; RankWeb adds none. Rank Math prints nothing until registration is skipped or connected (`rank_math_registration_skip`), so a fresh install shows nothing from either plugin until that wizard step. Stub also passes. **Real Yoast SEO (B)** with RankWeb active: title, description, canonical, robots, OG, Twitter and JSON-LD once each (Yoast's schema graph). SEOPress: installed in Playground but its front end could not be confirmed active or attributed, so **unverified (X)**. AIOSEO: not tested, **unverified (X)**; both are detected by constant only.
- ✅ Admin without Kits Core: Overview (real diagnostics: head owner, search visibility, permalinks, sitemap, robots.txt, noindex count), Modules, Settings (all tabs), FAQ, Insights note. Settings persist, survive deactivate/reactivate (**B**).
- ✅ Hard-coded Animal Writes values removed from generic output (organisation email, profiles, alternate names, `en-IN`, India, news publication name, health email, media text, self-host redirect, titles for any front page and About page, seed redirects). They live in the site layer `sites/animalwrites/rankweb/` (`site.php`, `defaults.php`, `programmatic.php`), a must-use plugin outside the package, which feeds them through RankWeb's filters (`rankweb_site_default_*`, `rankweb_contact_email`, `rankweb_organization_node`, `rankweb_directory_scope`, `rankweb_faq_item_block`, `rankweb_breadcrumbs_legacy_block`, `rankweb_built_block_namespaces`, `rankweb_modules` defaults…). **Migration note:** install the site layer on the Animal Writes site before updating RankWeb there. `tests/no-animal-writes-test.php` fails if the plugin names the site again.
- ⏳ Still Animal Writes-shaped (no brand strings, only runs with the Animal Writes hubs/types): `aw_*` content-type keys in `titles.php`, India-specific schema fields (`addressCountry` IN), FAQ question wording in `faq-data.php`. Not shown on other sites; candidates for the site layer.
- ⏳ Redirects (documented limitation): standalone there is no redirect list; the tools read and write Rank Math's Redirections, so redirects need Rank Math. A native list is not built and is not planned for this release.
- ✅ Canonical: singular via core; home, archives and paginated pages get one self-referencing canonical from RankWeb (search and 404 none). Robots rules for archives/404 beyond core and search noindex: still open.
- ✅ Ranking formula (owner, 26 Nov: "do it"): there is one formula and it is InsightWeb's keyword score, `round(0.35·Demand + 0.30·Opportunity + 0.20·Momentum + 0.15·Engagement)` (`insightweb/includes/search-insights/score.php`, weights and caps as constants, tested). RankWeb has no second formula and does not need one.
- ⏳ **X** Yoast / SEOPress / AIOSEO coexistence with the real plugins; Google Search Console acceptance of the sitemap.

## Open Tasks & Enhancements

1. **Editor Sidebar Integration** — ✅ built, ✅ open work refined:
   - ✅ The sidebar exists: `includes/editor-sidebar.php` registers the post meta (`rank_math_focus_keyword`, title, description…) and enqueues `assets/editor-sidebar.js` + `assets/editor-sidebar.css` through `enqueue_block_editor_assets` (title/meta counters, SERP preview, 0–100 score, schema selector).
   - ✅ B (25 Nov): opens in Gutenberg, controls change post meta and the printed head, no editor JS errors. Score engine unit-tested (`tests/sidebar-score.test.js`, 10).
   - ✅ Reactive updates re-verified in the live block editor (WordPress 7.1.5, Playground, 25 Nov 2026): the counters, the Google preview and the social preview update as the title, description and keyphrase change; saving writes `rank_math_title` and `rank_math_description`, and the page prints them.
   - ✅ Fixed in the sidebar: `sprintf` was never imported, so the checklist threw once a keyphrase was set; the internal and external link counts and the default address named another organisation's domain (they use the site's own host now); the subheading check matched the keyphrase anywhere in the text (headings are parsed now); `ButtonGroup` (deprecated since 6.8) replaced; `PluginSidebar` is taken from `wp.editor`.
   - ✅ SEO title and meta description fields with character counters (60 and 160), and a Social share preview card (featured image, title, description, host) in the sidebar.
   - ✅ Without Rank Math (`includes/standalone-head.php`): the typed SEO title is the page title for a single item, and Open Graph and Twitter tags are printed (type, title, description, url, site name, locale, the 1080 square share image when there is one). Covered by `tests/ShareTagsTest.php`. With Rank Math active it prints nothing and `opengraph.php` adjusts Rank Math's tags as before.
   - Not built, by decision: a generated overlay image (text drawn over a picture). It needs a design owner's choice of template, fonts and a cache policy; the sidebar preview shows what the tags will carry.

2. **Breadcrumbs Block Polish** — ✅ done:
   - ✅ `build/blocks/breadcrumbs.js` is built and `includes/breadcrumbs-render.php` renders it; used in `templates/single-aw_listing.html` and the patterns.
   - ✅ Accessible ARIA markup present: `<nav class="kit-crumbs" aria-label="Breadcrumb">` with `aria-current="page"` on the last crumb, and `aria-label="Home"` on the home link (`breadcrumbs-render.php:70`, `:81`, `:131`).
   - ⏳ Open: a visual pass in FSE templates and the classic templates after the theme's next CSS change.

3. **Auto-Linker Performance** — ✅ done:
   - ✅ Standalone test suite passes without WordPress: `php plugins/rankweb/tests/run.php` → **all 94 RankWeb settings checks passed** (plus `LinkerTest.php`, `LinkAuditTest.php`, `SiloTest.php`, `SchemaTest.php`, `RedirectsTest.php`, `AgentTest.php`, `AnchorTest.php`, `BulkTest.php`, `VideoTest.php`).
   - ✅ Word boundaries and skipping inside `<a>`, `<h1>`–`<h6>` and `<pre>` are covered by `LinkerTest.php`.

4. **Services already built and on the branch** (for the record, not open work): `titles.php`, `canonical.php`, `sitemap.php`, `robots.php`, `schema.php`, `schema-custom.php`, `rank-math-schema.php`, `opengraph.php`, `silos.php`, `redirects.php`, `redirect-tools.php`, `programmatic.php`, `media-seo.php`, `video.php`, `faq-data.php`, plus the admin shell screens (`rankweb-ui.php`, `rankweb-dashboard.php`, `rankweb-modules.php`, `rankweb-rest.php`, `rankweb-caps.php`).

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- SEO CSV, Internal links, Redirect tools and Images (26 Nov): now drawn inside the Kits shell through page parts, the way the FAQ list is (`rankweb_tool_parts()`, `rankweb-ui.php`). Their forms still post to `admin-post.php` with their own nonce; with no Kits Core they stay plain WordPress pages. Not done: REST routes and native React screens for them, (the "Write to .htaccess now" form now needs a ticked confirm box, checked on the server).
- Redirect categories (26 Nov): built as a label per source kept in RankWeb (`rankweb_redirect_categories`), carried by a `category` column on the redirects CSV and listed on Redirect tools. Rank Math's list is unchanged and nothing reads the label at request time. A native redirect list is not planned.
- Not in this repo: a bundled `rankweb-shell` package (`packages/rankweb-shell` is empty).

## Carried over from the acceptance gates (26 Nov 2026)

- Not verifiable here (class X): SEOPress and AIOSEO coexistence (detected by constant only); real Yoast, SEOPress and AIOSEO installs beyond the Yoast check already done; Google Search Console accepting the sitemap.
- Robots rules for archives and 404 beyond core and search noindex: open.
- Animal Writes copy still in the plugin, inert without the site's hub functions: directory place phrasing in `titles.php`, question wording in `faq-data.php`, and the `animal-writes/breadcrumb` and `render_block_animal-writes/*` compatibility hooks. Live Animal Writes needs its site layer (`sites/animalwrites/rankweb/`) to restore the old schema values; confirm InsightWeb is active on live, because RankWeb no longer loads its bootstrap.
