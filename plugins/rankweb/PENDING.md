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
- ✅ Coexistence: Rank Math stub (**B**, one of each tag in both modes); **real Rank Math installed (B): RankWeb printed no duplicate tag, but Rank Math itself printed no tags in Playground (unconfigured), so "Rank Math prints once" is proven against the stub only.** Yoast, SEOPress, AIOSEO: detected by constant, not tested with the real plugins (**X**).
- ✅ Admin without Kits Core: Overview (real diagnostics: head owner, search visibility, permalinks, sitemap, robots.txt, noindex count), Modules, Settings (all tabs), FAQ, Insights note. Settings persist, survive deactivate/reactivate (**B**).
- ✅ Hard-coded Animal Writes values removed from generic output (organisation email, profiles, alternate names, `en-IN`, India, news publication name, health email, media text, self-host redirect, titles for any front page and About page). They live in `includes/animal-writes-compat.php`, loaded only when Animal Writes Core is active. **Migration note:** the Animal Writes site keeps them through that file; do not remove it before the site stores its own values under RankWeb → Settings.
- ⏳ Still Animal Writes copy (only runs with the Animal Writes hubs/types): directory and hub descriptions in `titles.php`/`programmatic.php`, hub titles in `settings.php` (`aw_news`, `aw_legal`, `post` hub pages), FAQ question wording in `faq-data.php`. Not shown on other sites; to be moved behind the compat file.
- ⏳ Redirects: the tools read and write Rank Math's Redirections; standalone there is no redirect list. A native list is not built.
- ⏳ Canonical for archives/paginated/search and robots rules for archives/404 beyond search: WordPress core canonical on singular only; archive canonical not printed standalone.
- ⏳ Ranking formula (function + existence + consumption): unresolved. No formula exists in the repo or docs; owner to define. Not invented.
- ⏳ **X** Yoast / SEOPress / AIOSEO coexistence with the real plugins; Google Search Console acceptance of the sitemap.

## Open Tasks & Enhancements

1. **Editor Sidebar Integration** — ✅ built, ✅ open work refined:
   - ✅ The sidebar exists: `includes/editor-sidebar.php` registers the post meta (`rank_math_focus_keyword`, title, description…) and enqueues `assets/editor-sidebar.js` + `assets/editor-sidebar.css` through `enqueue_block_editor_assets` (title/meta counters, SERP preview, 0–100 score, schema selector).
   - ✅ B (25 Nov): opens in Gutenberg, controls change post meta and the printed head, no editor JS errors. Score engine unit-tested (`tests/sidebar-score.test.js`, 10).
   - ⏳ Open: social preview card generator (Twitter card / Open Graph image overlay). Open Graph tags are already emitted (`includes/opengraph.php`); the overlay image is not built.

2. **Breadcrumbs Block Polish** — ✅ done:
   - ✅ `build/blocks/breadcrumbs.js` is built and `includes/breadcrumbs-render.php` renders it; used in `templates/single-aw_listing.html` and the patterns.
   - ✅ Accessible ARIA markup present: `<nav class="kit-crumbs" aria-label="Breadcrumb">` with `aria-current="page"` on the last crumb, and `aria-label="Home"` on the home link (`breadcrumbs-render.php:70`, `:81`, `:131`).
   - ⏳ Open: a visual pass in FSE templates and the classic templates after the theme's next CSS change.

3. **Auto-Linker Performance** — ✅ done:
   - ✅ Standalone test suite passes without WordPress: `php plugins/rankweb/tests/run.php` → **all 94 RankWeb settings checks passed** (plus `LinkerTest.php`, `LinkAuditTest.php`, `SiloTest.php`, `SchemaTest.php`, `RedirectsTest.php`, `AgentTest.php`, `AnchorTest.php`, `BulkTest.php`, `VideoTest.php`).
   - ✅ Word boundaries and skipping inside `<a>`, `<h1>`–`<h6>` and `<pre>` are covered by `LinkerTest.php`.

4. **Services already built and on the branch** (for the record, not open work): `titles.php`, `canonical.php`, `sitemap.php`, `robots.php`, `schema.php`, `schema-custom.php`, `rank-math-schema.php`, `opengraph.php`, `silos.php`, `redirects.php`, `redirect-tools.php`, `programmatic.php`, `media-seo.php`, `video.php`, `faq-data.php`, plus the admin shell screens (`rankweb-ui.php`, `rankweb-dashboard.php`, `rankweb-modules.php`, `rankweb-rest.php`, `rankweb-caps.php`).
