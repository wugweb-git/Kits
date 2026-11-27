# RankWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 2.3.5

- /news-sitemap.xml is answered only on a site that has News items (aw_news); on any other site with Rank Math active it no longer returns an empty sitemap.
- The readme changelog entry for 2.2.0 listed fewer Transport sources and gallery types than CHANGELOG.md; CHANGELOG.md is the accurate list (five SEO plugins; 24 gallery types).

## 2.3.4

- robots.txt: the Content-Signal AI line is off by default and is added only when RankWeb prints the page head (no other SEO plugin does) and the new setting (Settings → Robots rules) is on. The news sitemap line follows the same rule with its own setting, and only on sites that have News items; `/news-sitemap.xml` no longer answers on sites without them.
- Redirect tools (classic and Kits screens, import error text, readme): they say that RankWeb has no redirect list of its own and do nothing without Rank Math's Redirections module.
- readme External services: adds the opt-in Google Fonts download (fonts.googleapis.com, fonts.gstatic.com), the YouTube thumbnail host named in video data, and which requests stay on your own site.
- Uninstall with the delete-data setting ticked also removes the page cache folder, the local font folder, the `manage_rankweb` capability, `rankweb_caps`, `rankweb_redirect_categories` and more transients. Deactivation also unschedules `aw_faq_index_build`.
- The FAQ head's link label is "All FAQs" instead of "Animal welfare FAQ", and the link is shown only when a /resources/animal-welfare-faqs/ page exists.

## 2.3.3

- Fix: the page cache never stores a cart, checkout or account page, or any page with a form nonce. The sitemap check watches /sitemap_index.xml only when Rank Math is active, so other sites no longer get a false "not answering" notice.

## 2.3.2

- The "Upgrade to Premium" link is gone from the Plugins screen.
- The sitemap check watches the Directory sitemap only when a Directory exists, so other sites no longer get a false "not answering" notice.

## 2.3.0

- The WordPress dashboard box is a row of tiles: each number links to its screen and a count to act on says Needs attention (words and icon, not colour alone).
- Transport also reads SEOPress and The SEO Framework; robots choices are in the classic editor too.
- Per-item share title and description.
- A title separator and prefix setting, and SEO fields on the user profile for the author page.
- A primary category per post, used for the address and the breadcrumbs.
- WooCommerce cart, checkout and account pages stay out of search.
- Gallery types Product with variants and Loyalty program.
- Transport also copies category, tag and author fields.
- Page speed options: delay scripts, shrink and prune CSS, local Google Fonts, WebP serving and conversion, and a page cache. Each is off until switched on.

## 2.2.0

- Per-item robots in the editor sidebar: nofollow, noarchive, nosnippet and max-snippet next to noindex, printed through one robots tag. A setting turns them off. The classic editor has the same choices in a "Search engines (RankWeb)" box.
- Primary category: choose which of a post's categories is the main one; it sets the address (%category%) and the breadcrumbs.
- A title separator and a text before every title (when RankWeb prints the head), and SEO fields on the user profile for the author page (search title, description, noindex).
- Social and feeds: the twitter:site tag from the site's X handle, and an "appeared first on" line in feed items. Both off until set.
- SEO fields on the category and tag screens: a search title, a search description and noindex, printed when RankWeb prints the head. Rank Math's term fields are read when RankWeb's are empty.
- Per-item share title and description (Open Graph and Twitter), beside the canonical address, 301 redirect and share image address, in the editor sidebar and the classic box.
- Archive rules (without Rank Math): keep WooCommerce cart, checkout and account pages (on by default; does nothing without WooCommerce), author archives, date archives, page 2 and later of lists, attachment pages and empty category or tag archives out of search. All off until set.
- Page speed, heavier options (all off until set): delay chosen scripts until the visitor interacts, shrink the site's CSS and drop rules the page does not use, serve Google Fonts from this site (downloads the font files once from Google), serve WebP copies of images, a page cache for signed-out visitors with a Clear page cache button in the admin bar, and RankWeb → Convert to WebP to make copies of the media library (originals untouched).
- Page speed (Core Web Vitals): defer chosen scripts, Google Fonts shown at once (display=swap), and WebP for new JPEG and PNG uploads. No outside service.
- Transport also copies category and tag fields and author fields (title, description, noindex).
- Transport (RankWeb → Transport): copy SEO title, description, focus keyword and robots settings from Yoast SEO, Rank Math, All in One SEO, SEOPress or The SEO Framework. A dry run is the default, a filled field is never overwritten, and a title still made of the other plugin's variables is skipped.
- The SEO Bar on the category, tag and user list screens.
- An image sitemap (`/image-sitemap.xml`) when Rank Math is absent, listed in robots.txt. Rank Math's own sitemap already lists images.
- SEO Bar on the post lists: a colour-coded bar with icons and a spoken summary for title, description, focus keyword, noindex and address.
- Structured data box for Google gallery types: Recipe, Product, Local business, Event, Job posting, Course, Fact check, Profile page, Software app, Book, Movie, Review, Dataset, Question and answer page, Discussion forum post, Education Q&A, Employer rating, Math solver, Vacation rental, Image licence, Paywalled content, Carousel, Product with variants and Loyalty program; Product also takes shipping and returns. Required properties are checked and an incomplete type prints nothing.
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
