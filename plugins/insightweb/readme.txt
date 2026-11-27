=== InsightWeb ===
Contributors: wugweb
Tags: search console, analytics, keywords, pagespeed, seo
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.1.4
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
* Tabs: Overview, Keywords, Rising, Pages, Clarity, Check list, Links, Server, and Settings. Other plugins can add a tab (filter `aw_si_tabs`); SourceWeb adds a Sourcing keywords tab.
* Site Health integration, a WordPress Dashboard widget, and `wp aw-si` WP-CLI commands.

= Standalone & Optional Integrations =

* InsightWeb installs and operates without any other plugin. Every tab (Overview with its boxes, Keywords, Rising, Pages, Clarity, Check list, Links, Server, Settings) has a native WordPress admin screen made of core markup, with nonces and capability checks on every form. Kits Core is not needed. When Kits Core is active, it draws the same tabs in its own admin shell instead; the data and settings are the same.
* A tab shows figures only once its source is connected or has run: Search Console and GA4 need **Site Kit by Google**, Clarity and Bing need their keys, and the keyword roles and scores read **Rank Math** when it is active. Without them a tab shows an empty state, not an error.
* Optionally integrates with **Site Kit by Google** (Search Console and GA4), **Rank Math** (focus keyword and score sync), **Kits Core**, **RankWeb**, and **SourceWeb**.
* Settings numbers are stored in InsightWeb's own option (`insightweb_numbers`). Only while RankWeb is active are they stored in RankWeb's option, as before; InsightWeb writes to no other plugin's option otherwise.

= Privacy: what is stored about visitors =

* **Visitor counting is off by default** (since 1.1.4). Turn it on under InsightWeb → Settings → Visitor counting. While it is off nothing about visitors is stored, no table is made, and the country file below is not downloaded.
* When on, each front-end request that reaches WordPress (not logged-in users, wp-admin, REST, AJAX, cron or WP-CLI) adds one to a daily count for its country and for its shortened IP address: IPv4 with the last number set to 0, IPv6 cut to its first 48 bits. No full IP address, user agent or cookie is stored. Table: `{prefix}aw_si_visits`. Shortened addresses are deleted after 30 days by the daily job; country counts are kept until you turn the setting off or delete the plugin.
* Turning the setting off deletes the table, the country file and its schedule. Deleting the plugin does the same, whatever the "Delete data" setting says. A site that already held counted rows when it updated to 1.1.4 keeps counting until you turn it off.
* The country comes from the CDN's country header when one is sent, otherwise from a free DB-IP Lite file saved in `wp-content/uploads/aw-geo/` (see External services). The look-up happens on your server; no address is sent anywhere.
* Not switched by that setting: the Server tab's per-day counts of named crawlers and of 4xx/5xx answers (path only, no query string, no address or user agent), and counts of searches made on your own site (daily counts per search term; terms that look like an email address or a phone number are dropped). These are kept as daily aggregates.

= Keys =

Clarity, Bing Webmaster, PageSpeed, and Google Alerts keys are configured under **InsightWeb → Settings → Keys**, or as `wp-config.php` constants (which take precedence). Key values are never echoed back in HTML.

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/insightweb. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Installation ==

1. Upload the `insightweb` folder to `/wp-content/plugins/`, or install the `insightweb.zip` package via **Plugins → Add New → Upload Plugin**.
2. Activate **InsightWeb** on the **Plugins** screen.
3. Open **InsightWeb** in the WordPress admin menu to view telemetry or configure API keys. Visitor counting stays off until you turn it on in Settings.

== Frequently Asked Questions ==

= Does InsightWeb require Kits Core or Rank Math? =

No. InsightWeb runs on its own with native WordPress admin screens for every tab and honest empty states when no external services are connected. Search Console and GA4 figures need Site Kit by Google.

= Does it change my SEO settings? =

No. InsightWeb only reads telemetry and suggests actions.

= What happens when it is switched off or deleted? =

Its scheduled jobs stop, while tables and options remain intact by default. Only enabling **Delete Search Insights data** (typed `DELETE`) or running `wp aw-si delete-data --yes` removes its own tables and options. Visitor counting data (table, country file, schedule) is always removed when the plugin is deleted.

== External services ==

InsightWeb connects to external services only when the corresponding integration or API key is configured by an administrator, except where noted. Every host below was found by searching the code for remote calls and downloads.

* **Google Search Console & Google Analytics 4 (via Site Kit by Google):** Reads search performance, URL inspection, and analytics metrics when Site Kit is connected. The calls are made by Site Kit. Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).
* **Google PageSpeed Insights API (`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`):** Runs weekly (Sundays) and when you press Start PageSpeed, for the key pages and campaign pages of your own site. It uses Site Kit's PageSpeed module when that is connected, and otherwise calls the API directly. It sends the page address and, if you set one, your PageSpeed API key; the key is optional (without it Google allows fewer requests). Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).
* **Microsoft Clarity API (`https://www.clarity.ms/`):** Only when a Clarity token is configured, fetches project UX/behavior telemetry. Terms & Privacy: [https://privacy.microsoft.com/](https://privacy.microsoft.com/).
* **Bing Webmaster API (`https://ssl.bing.com/webmaster/`):** Only when a Bing Webmaster API key is configured, fetches crawl, backlink, and keyword telemetry for the site. Terms & Privacy: [https://privacy.microsoft.com/](https://privacy.microsoft.com/).
* **Google Alerts RSS (`https://www.google.com/alerts/feeds/`, or your country's Google domain):** Only when alert feed addresses are configured, fetches alert entries for the Links view. Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).
* **DB-IP Lite country database (`https://download.db-ip.com/free/`):** Only while Visitor counting is on. Downloads one file, `dbip-country-lite-YYYY-MM.csv.gz`, about once a month; nothing about your site or visitors is sent. The file is converted into two small look-up files in `wp-content/uploads/aw-geo/`. The database is by DB-IP.com under CC BY 4.0. Terms & Privacy: [https://db-ip.com/privacy](https://db-ip.com/privacy).
* **Favicons of referring sites (`https://www.google.com/s2/favicons` and `https://<referring site>/favicon.ico`):** On the hourly icon run, up to five a run, InsightWeb fetches the small site icon of each referring site that GA4 reports, to show it on the Overview. It asks Google's favicon service first, which receives that site's domain name (not your visitors or your own site), and otherwise asks the referring site directly for its `/favicon.ico`. Icons are saved in the Media Library. This needs no key and runs once GA4 referrer data is stored. Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).

InsightWeb also requests pages of your own site (home page, robots.txt, llms.txt and a few key pages, some with AI-crawler user-agent names) to check that crawlers can reach them. These calls stay on your own domain.

== Changelog ==

= 1.1.4 =
* Visitor counting (country and a shortened IP address per day) is now off by default and has a switch under Settings. A site that already held counted rows keeps counting until switched off. Turning it off, or deleting the plugin, deletes its table, the country file and the schedule. What is stored and for how long is now in this readme.
* Every tab now has a native WordPress screen without Kits Core (Overview boxes, Rising, Pages, Clarity, Check list, Links, Server, plus the numbers form on Settings). The Kits Core install notice is gone. The readme says which sources each tab needs.
* External services: added DB-IP (monthly country file), favicon fetching and the real PageSpeed behaviour (the key is optional).
* A missing keyword-map seed file is no longer reported as an error on every daily run.
* Neutral wording: the keyword map download and the Google Alerts notice use the site's name; no Animal Writes text by default.
* The seven numbers are written to RankWeb's option only while RankWeb is active; otherwise to InsightWeb's own option `insightweb_numbers`.

= 1.1.3 =
* Fix: 1.1.2 loaded the 404 and search logging, which is not ready. It is no longer loaded, and the 404 paths and search terms it stored are removed once.

= 1.1.2 =
* The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

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
