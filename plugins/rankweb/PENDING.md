# RankWeb: Pending & Roadmap

Status as of 22 Nov 2026 (checked on `wordpress-dev`).

## Active Scope & Responsibilities
The SEO, schema, and sitemap plugin owns:
- Meta title, description, and canonical URL management.
- Real-time Editor Sidebar with title/meta character length counters and SERP previews.
- Breadcrumbs Block (`build/blocks/breadcrumbs.js`).
- Auto-linker engine with keyword-to-URL mapping.
- XML Sitemaps (posts, pages, directory listings).
- Schema.org JSON-LD generation (`Article`, `Organization`, `BreadcrumbList`).

---

## Open Tasks & Enhancements

1. **Editor Sidebar Integration** — ✅ built, ✅ open work refined:
   - ✅ The sidebar exists: `includes/editor-sidebar.php` registers the post meta (`rank_math_focus_keyword`, title, description…) and enqueues `assets/editor-sidebar.js` + `assets/editor-sidebar.css` through `enqueue_block_editor_assets` (title/meta counters, SERP preview, 0–100 score, schema selector).
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
