=== RankWeb ===
Contributors: wugweb
Tags: seo, schema, sitemap, faq, breadcrumbs
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 2.3.0
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
* Redirect tools: CSV export and import of Rank Math's redirect list, a 404-log export, and an Apache .htaccess block (these need Rank Math's Redirections).
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

Only as described under "External services" below, and only for the features that use them. There is no tracking or phone-home.

== External services ==

RankWeb contacts these third-party services, only when the matching feature is used:

* YouTube and Vimeo oEmbed — when the Video module scans an item that contains a YouTube or Vimeo video, the video's public URL is sent to that provider's oEmbed endpoint (https://www.youtube.com/oembed, https://vimeo.com/api/oembed.json) to read the title, thumbnail and (Vimeo) duration and date. YouTube: https://policies.google.com/terms , https://policies.google.com/privacy . Vimeo: https://vimeo.com/terms , https://vimeo.com/privacy .
* Google Rich Results Test — the Custom schema box shows a link to https://search.google.com/test/rich-results for the current item. It is a link the editor clicks; RankWeb makes no automatic request. https://policies.google.com/terms , https://policies.google.com/privacy .
* Import schema from a URL — when an editor uses "Import from a URL" in the Custom schema box, RankWeb fetches that editor-supplied URL to read its JSON-LD. No request is made unless the editor enters a URL and clicks Import.

RankWeb's link audit and content analysis fetch URLs on your own site only.

== Uninstall ==

Deleting the plugin deletes no data: settings, FAQ records, focus keywords and the scores it has stored stay, so reinstalling finds everything as it was.

== Changelog ==

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
* No site-specific values: the site's own name, language and profiles are used. Animal Writes values load only when Animal Writes Core is active.
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
