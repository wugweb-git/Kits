=== InsightWeb ===
Contributors: wugweb
Tags: search console, analytics, keywords, pagespeed, seo
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.1.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Search Console, GA4, Clarity, PageSpeed, Bing, keywords and rising terms for WordPress sites.

== Description ==

InsightWeb measures how your site performs in search. It reads telemetry data and surfaces prioritized suggestions; it never alters SEO settings, keyphrases, or content.

= Search Insights =

* One record per keyword, with its roles, owning pages, Search Console figures by day, priority, and a suggested action.
* Search Console through Site Kit (daily sync), plus Discover, Google News, and URL Inspection.
* GA4 through Site Kit (read-only), PageSpeed Insights, Microsoft Clarity, and Bing Webmaster, each active only when its key or connection is configured.
* Rising terms, quick wins, conflicts, Links view, crawler access checks, server figures, and a monthly check list.
* Tabs: Overview, Keywords, Rising, Pages, Clarity, Check list, Links, Server, and Settings. Other plugins can add a tab (filter `aw_si_tabs`).
* Site Health integration, a WordPress Dashboard widget, and `wp aw-si` WP-CLI commands.

= Standalone & Optional Integrations =

* InsightWeb installs and operates standalone with no mandatory plugin dependencies.
* Optionally integrates with **Site Kit by Google** (Search Console and GA4), **Rank Math** (focus keyword & score sync), **Kits Core**, **RankWeb**, and **SourceWeb**.

= Keys =

Clarity, Bing Webmaster, PageSpeed, and Google Alerts keys are configured under **InsightWeb → Settings → Keys**, or as `wp-config.php` constants (which take precedence). Key values are never echoed back in HTML.

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/insightweb. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Installation ==

1. Upload the `insightweb` folder to `/wp-content/plugins/`, or install the `insightweb.zip` package via **Plugins → Add New → Upload Plugin**.
2. Activate **InsightWeb** on the **Plugins** screen.
3. Open **InsightWeb** in the WordPress admin menu to view telemetry or configure API keys.

== Frequently Asked Questions ==

= Does InsightWeb require Kits Core or Rank Math? =

No. InsightWeb runs standalone with native WordPress admin screens and honest empty states when no external services are connected.

= Does it change my SEO settings? =

No. InsightWeb only reads telemetry and suggests actions.

= What happens when it is switched off or deleted? =

Its scheduled jobs stop, while tables and options remain intact by default. Only enabling **Delete Search Insights data** (typed `DELETE`) or running `wp aw-si delete-data --yes` removes its own tables and options.

== External services ==

InsightWeb connects to external services only when the corresponding integration or API key is configured by an administrator:

* **Google Search Console & Google Analytics 4 (via Site Kit by Google):** Reads search performance, URL inspection, and analytics metrics when Site Kit is connected. Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).
* **Google PageSpeed Insights API (`https://www.googleapis.com/pagespeedonline/`):** Only when a PageSpeed API key is configured, sends site page URLs to retrieve Core Web Vitals and Lighthouse scores. Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).
* **Microsoft Clarity API (`https://www.clarity.ms/`):** Only when a Clarity token is configured, fetches project UX/behavior telemetry. Terms & Privacy: [https://privacy.microsoft.com/](https://privacy.microsoft.com/).
* **Bing Webmaster API (`https://ssl.bing.com/webmaster/`):** Only when a Bing Webmaster API key is configured, fetches crawl, backlink, and keyword telemetry for the site. Terms & Privacy: [https://privacy.microsoft.com/](https://privacy.microsoft.com/).
* **Google Alerts RSS (`https://www.google.com/alerts/feeds/`):** Only when alert feed URLs are configured, fetches alert entries for the Links view. Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).

== Changelog ==

= 1.1.1 =

* The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.


= 1.1.0 =
* Tabs follow a fixed order; SourceWeb's tab label is translatable.
* A scheduled report email (weekly or monthly, off by default) with an optional white-label line.

= 1.0.0 =
* Standalone release with native admin UI fallback, daily telemetry cron, credential status diagnostics, and honest empty-state dashboard tiles.

== Upgrade Notice ==

= 1.0.0 =
Initial standalone release of InsightWeb.
