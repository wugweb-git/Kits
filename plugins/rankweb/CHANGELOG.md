# RankWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 2.3.0

- The WordPress dashboard box is a row of tiles: each number links to its screen and a count to act on says Needs attention (words and icon, not colour alone).
- Transport also reads SEOPress and The SEO Framework; robots choices are in the classic editor too.

## 2.2.0

- Per-item robots in the editor sidebar: nofollow, noarchive, nosnippet and max-snippet next to noindex, printed through one robots tag. A setting turns them off. The classic editor has the same choices in a "Search engines (RankWeb)" box.
- Per-item canonical address, 301 redirect and share image address, in the editor sidebar and the classic box.
- Archive rules (without Rank Math): keep author archives, date archives, page 2 and later of lists, attachment pages and empty category or tag archives out of search. All off until set.
- Page speed (Core Web Vitals): defer chosen scripts, Google Fonts shown at once (display=swap), and WebP for new JPEG and PNG uploads. No outside service.
- Transport (RankWeb → Transport): copy SEO title, description, focus keyword and robots settings from Yoast SEO, Rank Math, All in One SEO, SEOPress or The SEO Framework. A dry run is the default, a filled field is never overwritten, and a title still made of the other plugin's variables is skipped.
- The SEO Bar on the category, tag and user list screens.
- An image sitemap (`/image-sitemap.xml`) when Rank Math is absent, listed in robots.txt. Rank Math's own sitemap already lists images.
- SEO Bar on the post lists: a colour-coded bar with icons and a spoken summary for title, description, focus keyword, noindex and address.
- Structured data box for Google gallery types: Recipe, Product, Local business, Event, Job posting, Course, Fact check, Profile page, Software app, Book, Movie, Review, Dataset, Question and answer page, Discussion forum post, Education Q&A, Employer rating, Math solver, Vacation rental, Image licence, Paywalled content and Carousel; Product also takes shipping and returns. Required properties are checked and an incomplete type prints nothing.
- Search engines and crawlers: verification tags for Google, Bing, Yandex and Pinterest, and crawlers kept out of the whole site in robots.txt.
- Native screens on the Kits shell for FAQ, Internal links, Images, SEO CSV and Redirect tools.
- A WordPress dashboard box showing gaps (titles, descriptions, focus keywords, schema).
- Works without Rank Math: meta description, Open Graph and Twitter tags, structured data for posts and pages, noindex, and sitemap exclusion of noindex pages.
- The block editor sidebar now changes what is printed: meta description, noindex and a schema type RankWeb can write (Article, BlogPosting, NewsArticle, WebPage).
- Overview, Modules, Settings, FAQ and Insights screens work without Kits Core.
- Another SEO plugin (Yoast SEO, SEOPress, All in One SEO) is detected and RankWeb leaves the page head to it.
- No site-specific values: the site's own name, language and profiles are used. Animal Writes values load only when Animal Writes Core is active.
- Fixed: the site tagline was copied into the description of every short post.

## 2.1.0

- Internal links: link audit (orphans, click depth, broken links, redirects, nofollow, canonical elsewhere, too many links), anchor-type mix with per-target warnings and keyword rotation, and silos (virtual and circle modes).
- Video SEO: YouTube and Vimeo detection, VideoObject schema from oEmbed, and a video sitemap.
- Custom schema: a per-item JSON-LD box (checked on save), Speakable, about and mentions, import JSON-LD from a URL, and a Rich Results Test link.
- Bulk work: a SEO column, list filters, Quick Edit and Bulk Edit, and a SEO CSV export and import; image find-and-replace and fill missing captions.
- Redirect tools: redirect CSV export and import, a 404-log export, and an Apache .htaccess block.
- Agent tools: RankWeb abilities on the WordPress Abilities API for the MCP adapter; reads by default, writes opt-in.
- A password-protected item is set to noindex.
- Module on/off switches on the dashboard.

## 2.0.0

- FAQ, canonicals, breadcrumbs, content analysis, focus keywords, the content panel, and the internal-links auto-linker.
