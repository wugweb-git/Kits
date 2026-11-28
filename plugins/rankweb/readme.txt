=== RankWeb ===
Contributors: wugweb
Tags: seo, schema, sitemap, faq, breadcrumbs
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 2.5.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

SEO for WordPress, with or without Rank Math: titles, descriptions, share cards, schema, canonicals, FAQs, breadcrumbs, internal links and video.

== Description ==

RankWeb works on its own, and next to Rank Math (free) when that is active. It is part of the Wugweb "Kits" suite and needs no other Kits plugin; where a feature belongs to another suite plugin, RankWeb hands it over: search analytics and Google data live in InsightWeb, not here.

**On its own** (no other SEO plugin): RankWeb prints the SEO title and meta description you type in the editor sidebar (else the excerpt or the start of the page), the Open Graph and Twitter share tags and the structured data (JSON-LD: Organization, WebSite and the item), adds noindex through WordPress's own robots tag, and leaves pages marked "Keep out of search results" out of WordPress's sitemap. The canonical address and the sitemap itself come from WordPress. The editor sidebar also sets a page's schema type (Article, BlogPosting, NewsArticle or WebPage) and noindex.

**Beside Rank Math:** Rank Math prints the page head and RankWeb prints none of it again; it reads Rank Math's own fields and tables and adds what Rank Math keeps for its Premium plan. **Beside Yoast SEO, SEOPress or All in One SEO:** RankWeb leaves the page head to them and says so on its screens; its own tools keep working.

* FAQ system: an FAQ box on every public post type and taxonomy, questions filled in automatically and kept once edited, an accordion and FAQPage structured data.
* Canonical addresses Rank Math cannot work out: hub pages, directory places and filtered or sorted lists.
* One breadcrumb trail per page, given to search engines as one BreadcrumbList.
* Rank Math's content analysis run on the page visitors see, with stored scores.
* Focus keywords with a one-page-per-keyphrase guard.
* The RankWeb content panel in the block editor: keyphrases, the searches a page showed for, internal links to add, and the item's link keywords (the only thing it saves, with its own button).
* Internal links: an auto-linker that links items to each other from their link keywords (off until a post type is chosen in Settings → Internal links), a link audit (orphans, click depth, broken links, redirects, nofollow, canonical elsewhere), an anchor-type mix with warnings, and silos (hub and supporting items, virtual or circle).
* Video SEO: YouTube and Vimeo detection from content, a VideoObject in the schema, and a video sitemap.
* Custom schema: a per-item JSON-LD box, Speakable, about and mentions, import from a URL, and a Rich Results Test link.
* Bulk work: SEO columns and filters on the list screens, Quick Edit and Bulk Edit, and a CSV export and import of the SEO fields. Image find-and-replace across alt, title and caption, and fill missing captions.
* Redirect tools: CSV export and import of Rank Math's redirect list, a 404-log export, and an Apache .htaccess block. RankWeb has no redirect list of its own: these tools work only with Rank Math's Redirections module on, and on any other site they do nothing and say so on the screen.
* Agent tools: RankWeb's work as WordPress abilities (the Abilities API) for AI agents through the MCP adapter; reads by default, writes opt-in.
* A password-protected item is kept out of search.
* llms.txt, Open Graph details, share images and a watchdog for the sitemap.
* Settings for every rule, grouped by module, with their defaults. Every switchable module has an on/off switch on the dashboard.

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/rankweb. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Installation ==

1. Upload the plugin to wp-content/plugins, or install the zip from Plugins → Add New.
2. Activate RankWeb. (Rank Math SEO is optional: install it if you want its own fields and screens next to RankWeb.)
3. Open an item in the block editor to use the RankWeb SEO sidebar. RankWeb's settings are under the RankWeb menu; each module has an on/off switch on the RankWeb dashboard.

== Frequently Asked Questions ==

= Does RankWeb replace Rank Math? =

No. With Rank Math active, RankWeb adds only what Rank Math does not do or keeps for its Premium plan, and prints none of the page head again. Without it, RankWeb prints the page head itself.

= Does it work without Rank Math? =

Yes, for the basics: the SEO title and description from the editor sidebar, Open Graph and Twitter tags, structured data, noindex and the sitemap exclusion. Rank Math's own analysis, redirect list and schema bridge need Rank Math and stay off without it.

= Which SEO plugin prints my page head? =

RankWeb → Overview says: RankWeb, Rank Math, or another plugin (Yoast SEO, SEOPress, All in One SEO).

= Does it send my data anywhere? =

Only as described under "External services" below, and only for the features that use them. Most of RankWeb makes no outside call. There is no tracking or phone-home.

== External services ==

RankWeb contacts these third-party services, only when the matching feature is used:

* YouTube and Vimeo oEmbed — when the Video module scans an item that contains a YouTube or Vimeo video, the video's public URL is sent to that provider's oEmbed endpoint (https://www.youtube.com/oembed, https://vimeo.com/api/oembed.json) to read the title, thumbnail and (Vimeo) duration and date. YouTube: https://policies.google.com/terms , https://policies.google.com/privacy . Vimeo: https://vimeo.com/terms , https://vimeo.com/privacy .
* Google Rich Results Test — the Custom schema box shows a link to https://search.google.com/test/rich-results for the current item. It is a link the editor clicks; RankWeb makes no automatic request. https://policies.google.com/terms , https://policies.google.com/privacy .
* Import schema from a URL — when an editor uses "Import from a URL" in the Custom schema box, RankWeb fetches that editor-supplied URL to read its JSON-LD. No request is made unless the editor enters a URL and clicks Import.

* Google Fonts, local copy (off until switched on: RankWeb → Settings → Page speed, "Serve Google Fonts from this site") — when a page links a Google Fonts stylesheet, the server downloads that stylesheet from https://fonts.googleapis.com and its font files from https://fonts.gstatic.com once, and saves them in wp-content/uploads/rankweb-fonts/. The request carries the stylesheet address and the server's IP address; no visitor data is sent. https://policies.google.com/terms , https://policies.google.com/privacy . With the option off, RankWeb makes no request to these hosts. (The separate "show text at once" option only adds display=swap to a Google Fonts address in the page; visitors' browsers then load the font from Google exactly as the theme already asked.)
* Video thumbnails — a YouTube video's structured data names its thumbnail on https://i.ytimg.com. The server does not fetch it; it is only written into the page's JSON-LD and the video sitemap.

RankWeb's link audit, content analysis, sitemap check and llms.txt check request URLs on your own site only. No other host is contacted by the plugin code. The scripts and styles it loads in the admin are in the plugin folder.
* **More from Kits install (direct build only, only when you click Install):** the "More from Kits" page makes no request when it is viewed. When an administrator clicks Install, WordPress fetches the Wugweb registry (`https://wugweb-git.github.io/Kits/registry/index.json`, GitHub Pages) and then downloads that plugin's zip from the project's GitHub releases (`https://github.com/wugweb-git/Kits/releases/`), checked against the registry's SHA-256 before it installs. No site data is sent. This page is not in the WordPress.org build. Turn the Install button off with `define( 'KITS_NO_PLUGIN_INSTALLS', true );`. Terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service. Privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

== Uninstall ==

By default, deleting the plugin deletes no data: settings, FAQ records, focus keywords and the scores it has stored stay, so reinstalling finds everything as it was. Deactivating the plugin always removes its scheduled jobs.

Tick "Delete this plugin's data when it is deleted" (RankWeb → Settings → Modules) and deleting the plugin removes its settings, stored scores and counts, link tables, scheduled jobs, the manage_rankweb capability, the page cache folder (wp-content/cache/rankweb) and the local font folder (wp-content/uploads/rankweb-fonts). A backup of the options and tables is first written to wp-content/uploads/wugweb-backups/; if it cannot be written, nothing is deleted. Posts, pages, post meta, Rank Math's data and the .webp copies in your media library are never deleted.

== Screenshots ==

1. The Dashboard, listing the RankWeb tools and counts of missing search titles, descriptions and focus keywords.
2. The FAQ screen, with the pages that show an FAQ, the post types that have the FAQ box, and counts by type.
3. Settings, Titles and descriptions: description length, section hub titles, item types and title separator.
4. Internal links, Audit: items with their links in and out, clicks from the home page and the findings for each.
5. Modules: each RankWeb module with where it is set up, its status and an on or off switch.

== Changelog ==

= 2.5.4 =
* The first menu item reads Dashboard, matching the header tab. Checkboxes and radios in labels have a 24px hit area.

= 2.5.3 =
* Insights charts no longer stretch two bars across the card. Empty states say what to do (Internal links, FAQ). Module switches are named "Use <module>". The More from Kits link of a plugin goes to Kits Core's page when Core is active.

= 2.5.2 =
* The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The sitemap and llms.txt notice shows only on RankWeb screens, the Dashboard and the Plugins list, can be dismissed, and links to Settings > Permalinks. Singular and plural item labels. Keys copy points to Settings.

= 2.5.1 =
* The SEO column width on the list screens is added as a registered inline style instead of a raw style tag in the page head (WordPress.org readiness).

= 2.5.0 =
* A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

= 2.4.1 =
* The plugin no longer names any content type of one site. It asks for a role (news, library, campaign, opportunity, listing, press) through `includes/post-type-roles.php` (`rankweb_type()`, `rankweb_is_type()`, `rankweb_types_with()`, `rankweb_is_singular()`, `rankweb_sql_in_types()`); the site says which type plays which role with the new filter `rankweb_post_type_roles` (default: no roles, so every per-type rule is inactive). The listing role comes from DirectoryWeb's `directoryweb_post_type()` when it is loaded. The per-type rules (title, description, schema, sitemap, robots, breadcrumb) are still written in the plugin and now keyed by role; they were not moved into the site layer.
* The Animal Writes slugs are supplied from `sites/animalwrites/rankweb/site.php`. The filtered-view title words (state and publisher shapes) are no longer defaulted in code; the site layer already supplies them.
* `includes/legacy-aliases.php` (the earlier `aw_*` function names and `AW_SEO_EXTRAS_DIR`) moved to `sites/animalwrites/rankweb/legacy-aliases.php`; the plugin has no `aw_` aliases. SourceWeb 0.4.1 calls the `rankweb_*` functions.
* New neutral filters: `rankweb_post_type_roles`, `rankweb_listing_identifier_fields` (registration numbers as schema identifiers; default only the general registration number) and `rankweb_analysis_excluded_fields` (stored identifier fields the analyzer ignores; default empty). The India register fields (12A, 80G, FCRA, NGO Darpan ID, AWBI code, NGO Base URL) left the plugin's lists; the site layer re-adds them.
* Constants that held type lists (`AW_FAQ_SUBJECT_TYPES`, `AW_SEO_KP_EVERGREEN`) are now functions (`rankweb_faq_subject_types()`, `rankweb_seo_kp_evergreen_types()`).

= 2.4.0 =
* Site-only code moved out. Code that existed for one site is no longer in the plugin: the Google News sitemap (`/news-sitemap.xml`) and its robots.txt line, the robots.txt Content-Signal line, the FAQ questions built from one site's content, the section-hub and press-list schema, a listing's recognition code and listing-type schema map, and the one site's Directory wording. A site that wants them supplies them through filters (`rankweb_hubs`, `rankweb_wording`, `rankweb_listing_schema_types`, `rankweb_listing_schema_node`, `rankweb_listing_description`, `rankweb_collection_page_nodes`, `rankweb_page_schema_nodes`, `rankweb_filtered_place_title_words`, `rankweb_faq_all_url`, `rankweb_country_code`, `rankweb_currency`, `rankweb_schedule_timezone`).
* Settings → Robots rules no longer has the two switches for the Content-Signal line and the news sitemap line (84 settings fields, was 86). A saved value of either is ignored and is dropped the next time the Robots tab is saved.
* No India defaults: the Open Graph locale follows the site language; the country code in addresses and legislation, the currency of free events and the time zone of monthly events are left out until a site sets them with the filters above.
* The FAQ module no longer loads a second file (`faq-data.php`); without a site's questions it asks for none.
* Only wording and notes touched in the rest; titles, descriptions and structured data of other sites are unchanged.

= 2.3.7 =
- Wording only: a code note in the press-list schema no longer names a particular site. No change to the output.

= 2.3.6 =
- Import columns: a site that keeps SEO values in its own meta keys (a Notion sync, a script) lists its prefixes with the `rankweb_import_prefixes` filter, and the title, description, focus keyword, canonical address, share image and noindex it stores are copied into the SEO plugin's fields when saved. The source keys are never deleted. Does nothing until a site opts in.

= 2.3.5 =
* /news-sitemap.xml is answered only on a site that has News items (aw_news); on any other site with Rank Math active it no longer returns an empty sitemap.
* The readme changelog entry for 2.2.0 listed fewer Transport sources and gallery types than CHANGELOG.md; CHANGELOG.md is the accurate list (five SEO plugins; 24 gallery types).

= 2.3.4 =
* robots.txt: the Content-Signal AI line is now off by default and is added only when RankWeb prints the page head (no other SEO plugin does) and the new setting is on. The news sitemap line is added only under the same rule, with its own setting, and only on sites that have News items; the /news-sitemap.xml address no longer answers on other sites.
* Redirect tools say plainly when Rank Math is missing or its Redirections module is off: RankWeb keeps no redirect list of its own, so nothing is imported or redirected.
* The readme's External services now lists the Google Fonts download (opt-in) and the hosts RankWeb names or contacts.
* Uninstall (with the delete-data setting ticked) also removes the page cache folder, the local font folder, the manage_rankweb capability, more stored options and transients. Deactivation also unschedules the FAQ index job.
* The FAQ box's "see all" link no longer says "Animal welfare FAQ" and points to a page only when the site has one.

= 2.3.3 =
* Fix: the page cache never stores a cart, checkout or account page, or any page with a form nonce. The sitemap check watches /sitemap_index.xml only when Rank Math is active, so other sites no longer get a false "not answering" notice.

= 2.3.2 =
* The "Upgrade to Premium" link is gone from the Plugins screen.
* The sitemap check watches the Directory sitemap only when a Directory exists, so other sites no longer get a false "not answering" notice.

= 2.3.0 =
* The WordPress dashboard box is a row of tiles: each number links to its screen and a count to act on says Needs attention.
* Transport also reads SEOPress and The SEO Framework; robots choices are in the classic editor too.
* Per-item share title and description.
* A title separator and prefix setting, and SEO fields on the user profile for the author page.
* A primary category per post, used for the address and the breadcrumbs.
* WooCommerce cart, checkout and account pages stay out of search.
* Gallery types Product with variants and Loyalty program.
* Transport also copies category, tag and author fields.
* Page speed options: delay scripts, shrink and prune CSS, local Google Fonts, WebP serving and conversion, and a page cache. Each is off until switched on.

= 2.2.0 =
* Per-item robots in the editor sidebar: nofollow, noarchive, nosnippet and max-snippet next to noindex, printed through one robots tag. A setting turns them off.
* Transport (RankWeb → Transport): copy SEO title, description, focus keyword and robots settings from Yoast SEO, Rank Math or All in One SEO. A dry run is the default, a filled field is never overwritten, and a title still made of the other plugin's variables is skipped.
* The SEO Bar on the category, tag and user list screens.
* An image sitemap (`/image-sitemap.xml`) when Rank Math is absent, listed in robots.txt. Rank Math's own sitemap already lists images.
* SEO Bar on the post lists: a colour-coded bar with icons and a spoken summary for title, description, focus keyword, noindex and address.
* Structured data box for Google gallery types: Recipe, Product, Local business, Event, Job posting, Course, Fact check, Profile page, Software app, Book, Movie and Review. Required properties are checked and an incomplete type prints nothing.
* Search engines and crawlers: verification tags for Google, Bing, Yandex and Pinterest, and crawlers kept out of the whole site in robots.txt.
* Native screens on the Kits shell for FAQ, Internal links, Images, SEO CSV and Redirect tools.
* A WordPress dashboard box showing gaps (titles, descriptions, focus keywords, schema).
* Works without Rank Math: meta description, Open Graph and Twitter tags, structured data for posts and pages, noindex, and sitemap exclusion of noindex pages.
* The block editor sidebar now changes what is printed: meta description, noindex and a schema type RankWeb can write (Article, BlogPosting, NewsArticle, WebPage).
* Overview, Modules, Settings, FAQ and Insights screens work without Kits Core.
* Another SEO plugin (Yoast SEO, SEOPress, All in One SEO) is detected and RankWeb leaves the page head to it.
* No site-specific values: the site's own name, language and profiles are used. Values for one particular site belong in that site's own code, which feeds them in through RankWeb's filters.
* Fixed: the site tagline was copied into the description of every short post.

= 2.1.0 =
* Internal links: link audit (orphans, click depth, broken links, redirects, nofollow, canonical elsewhere, too many links), anchor-type mix with per-target warnings and keyword rotation, and silos (virtual and circle modes).
* Video SEO: YouTube and Vimeo detection, VideoObject schema from oEmbed, and a video sitemap.
* Custom schema: a per-item JSON-LD box (checked on save), Speakable, about and mentions, import JSON-LD from a URL, and a Rich Results Test link.
* Bulk work: a SEO column, list filters, Quick Edit and Bulk Edit, and a SEO CSV export and import; image find-and-replace and fill missing captions.
* Redirect tools: redirect CSV export and import, a 404-log export, and an Apache .htaccess block.
* Agent tools: RankWeb abilities on the WordPress Abilities API for the MCP adapter; reads by default, writes opt-in.
* A password-protected item is set to noindex.
* Module on/off switches on the dashboard.

= 2.0.0 =
* FAQ, canonicals, breadcrumbs, content analysis, focus keywords, the content panel, and the internal-links auto-linker.
