# RankWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 2.5.6

- Link keyword index uses the table `{prefix}aw_link_keywords` again. The earlier rename to `rankweb_link_keywords` pointed at a table that was never created, so the index was missing on sites that already had version 1 installed.
- Plugin Check clean-up: hook names, variables and request-method reads carry each plugin's own prefix (hooks named aw_si_*, aw_enrich_* and similar are now insightweb_*, sourceweb_*, kits_*, rankweb_*, directoryweb_*), and the update code no longer touches WordPress's update cache.

## 2.5.5

- Checks for its own updates from the registry. The earlier aw_ shims are gone from the plugin; calls use the current names.

## 2.5.4

- The first menu item reads Dashboard, matching the header tab. Checkboxes and radios in labels have a 24px hit area.

## 2.5.3

- Insights charts no longer stretch two bars across the card. Empty states say what to do (Internal links, FAQ). Module switches are named "Use <module>". The More from Kits link of a plugin goes to Kits Core's page when Core is active.

## 2.5.2

- The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The sitemap and llms.txt notice shows only on RankWeb screens, the Dashboard and the Plugins list, can be dismissed, and links to Settings > Permalinks. Singular and plural item labels. Keys copy points to Settings.

## 2.5.1

- The SEO column width on the list screens is added as a registered inline style instead of a raw style tag in the page head (WordPress.org readiness).

## 2.5.0

- A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

## 2.4.1

Second pass on site-only code. The Animal Writes site layer must be deployed alongside RankWeb 2.4.1 (without it that site's content types are not mapped and the per-type rules do nothing).

- The plugin no longer names any content type of one site. It asks for a role (news, library, campaign, opportunity, listing, press) through `includes/post-type-roles.php` (`rankweb_type()`, `rankweb_is_type()`, `rankweb_types_with()`, `rankweb_is_singular()`, `rankweb_sql_in_types()`); the site says which type plays which role with the new filter `rankweb_post_type_roles` (default: no roles, so every per-type rule is inactive). The listing role comes from DirectoryWeb's `directoryweb_post_type()` when it is loaded. The per-type rules (title, description, schema, sitemap, robots, breadcrumb) are still written in the plugin and now keyed by role; they were not moved into the site layer.
- The Animal Writes slugs are supplied from `sites/animalwrites/rankweb/site.php`. The filtered-view title words (state and publisher shapes) are no longer defaulted in code; the site layer already supplies them.
- `includes/legacy-aliases.php` (the earlier `aw_*` function names and `SEO_EXTRAS_DIR`) moved to `sites/animalwrites/rankweb/legacy-aliases.php`; the plugin has no `aw_` aliases. SourceWeb 0.4.1 calls the `rankweb_*` functions.
- New neutral filters: `rankweb_post_type_roles`, `rankweb_listing_identifier_fields` (registration numbers as schema identifiers; default only the general registration number) and `rankweb_analysis_excluded_fields` (stored identifier fields the analyzer ignores; default empty). The India register fields (12A, 80G, FCRA, NGO Darpan ID, AWBI code, NGO Base URL) left the plugin's lists; the site layer re-adds them.
- Constants that held type lists (`FAQ_SUBJECT_TYPES`, `SEO_KP_EVERGREEN`) are now functions (`rankweb_faq_subject_types()`, `rankweb_seo_kp_evergreen_types()`).
- Test: `tests/post-type-roles-test.php` (role helpers, and no runtime file names the six types). Not rebuilt: `build/` (no `src/` change).

## 2.4.0

Code that existed for one site (Animal Writes) is out of the plugin; it lives in that site's own layer, `sites/animalwrites/rankweb/`, which must be deployed alongside RankWeb 2.4.0 on that site.

- Moved out, unchanged, and fed back through filters: the Google News sitemap (`/news-sitemap.xml`, its sitemap-index entry, its robots.txt line); the robots.txt Content-Signal line; `includes/faq-data.php` (the FAQ questions built from the site's listings, Library items, research summaries and tags; the module no longer loads it); the section-hub and Media & PR list schema (`rankweb_hub_schema_nodes()`, `rankweb_press_schema()`) and the article "mentions" from featured organisations; a listing's AWBI recognition code (schema identifier, description line) and its listing-type to schema-type map; the Directory's Animal/Animal Welfare wording in place titles and descriptions; the news, Library and opportunity title shapes of `?state=` and `?publisher=` views; the link to the site's FAQ index page.
- New neutral hooks (all default to nothing): `rankweb_hubs`, `rankweb_wording`, `rankweb_listing_schema_types`, `rankweb_listing_schema_node`, `rankweb_listing_description`, `rankweb_collection_page_nodes`, `rankweb_page_schema_nodes`, `rankweb_filtered_place_title_words`, `rankweb_faq_all_url`, `rankweb_country_code`, `rankweb_currency`, `rankweb_schedule_timezone`. `HUBS` is no longer read by name.
- Removed from Settings → Robots rules: the two switches for the Content-Signal line and the news sitemap line (settings fields 86 to 84). Saved values stay in the option until the Robots tab is saved; the site layer reads them until then.
- No India defaults in code: the Open Graph locale follows `rankweb_language()`; the address country, the legislation jurisdiction, the free-event currency and the monthly-event time zone are omitted until a site sets them.
- Test fixtures no longer use the Animal Writes name or domain. `tests/no-animal-writes-test.php` is kept and passes.
- Kept on purpose: the earlier `aw_*` function names in `includes/legacy-aliases.php` (SourceWeb still calls `aw_redirect_add()`, `aw_seo_cut()`, `aw_seo_item_description()`, `aw_rank_math_redirect()`); the `aw_*` content-type rules in the title, schema and sitemap code, which are inert on a site without those types (see PENDING.md).

## 2.3.7

- Wording only in a schema code note; the structured data output is unchanged.

## 2.3.6

- Import columns: a site that keeps SEO values in its own meta keys (a Notion sync, a script) lists its prefixes with the `rankweb_import_prefixes` filter, and the title, description, focus keyword, canonical address, share image and noindex it stores are copied into the SEO plugin's fields when saved. The source keys are never deleted. Does nothing until a site opts in.

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
