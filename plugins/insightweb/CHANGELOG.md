# InsightWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 1.4.3

- Checks for its own updates from the registry. The earlier aw_ shims are gone from the plugin; calls use the current names.

## 1.4.2

- The Dashboard no longer says "All working" above sources that have never run; the Search Console import tile says no import is logged yet. Larger link targets in the Priorities box. The More from Kits link of a plugin goes to Kits Core's page when Core is active.

## 1.4.1

- The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The top-level menu opens Search Insights when Kits Core is off (it used to open a dead address). Keys copy points to Settings.

## 1.4.0

- A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

## 1.3.0

- The Dashboard by country. The daily Search Console run asks once more for date + country and stores those rows (metric `c`, the three-letter code in the page column; a failure of that one request does not lose the day's other rows). Site Kit's Search Console call has no country filter (it filters by page only, checked in its source) but passes `dimensions` through, so country is stored as a dimension. The Dashboard has a Country choice (the 40 countries with the most clicks over 90 days); a chosen country shows its clicks, impressions, click rate and position for the range, with the same "compare only with a full window before" rule, and the clicks per day chart. Pages and searches are not split by country, and the lists are hidden while a country is chosen.
- New route `insightweb/v1/dashboard/country?code=`; the Dashboard payload has `countries`. Names for common codes are built in; the filter `insightweb_country_names` adds or corrects names, and a code with no name shows as the code.
- Figures start with the first daily run after the update: older days have no country rows, so the first days show fewer stored days (the tile says so).
- Tests: country code, names and stored rows in `tests/run.php`. `src/index.js` and `build/` rebuilt; lint clean. Not run on a live WordPress with Site Kit.

## 1.2.2

- Favicon host check: referring-site icons are fetched only from a public DNS name (no address, no single-label or local-looking name). The filter `insightweb_favicon_hosts` limits it to a list of hosts and their subdomains; `insightweb_favicon_third_party` returns false to stop asking Google's favicon service. A host that fails the check gets the letter fallback.
- Tests: `tests/favicon-hosts-test.php`.
- Not rebuilt: `build/` (no `src/` change).

## 1.2.1

The Animal Writes site layer must be deployed alongside InsightWeb 1.2.1 (it maps the content types).

- The plugin no longer names any content type of one site. The scoring ladder's page class, the crawl check, the Request indexing order, the PageSpeed sample, the keyword and Rising title searches and the campaign box ask for a role (news, library, campaign, opportunity, listing) through `includes/post-type-roles.php`; the site says which type plays which role with the new filter `insightweb_post_type_roles` (default: none, so a type-specific step is skipped). The listing role comes from DirectoryWeb's `directoryweb_post_type()` when it is loaded.
- The Animal Writes slugs are supplied from `sites/animalwrites/insightweb/site.php`. The path-based page class (`/library/`, `/directory/`, `/news/`) is unchanged.
- Not rebuilt: `build/` (no `src/` change).

## 1.2.0

Code that existed for one site (Animal Writes) is out of the plugin; it lives in `sites/animalwrites/insightweb/`, which must be deployed alongside InsightWeb 1.2.0 on that site.

- Moved out, unchanged: `includes/search-insights/links-seed.php` and `data/links-2026-11-02.php` (the known-links seed, run through the new action `insightweb_si_links_seed`; markers cleared on the new action `insightweb_si_dropped`); `insightweb_si_vis_migrate()` (the carry-over that kept visitor counting on where the table had rows); the brand regex `AW_SI_BRAND` (now the filter `insightweb_brand_pattern`); the Rising and species word lists and the GitHub repository link for PHP errors (now filters).
- Removed: the `wp aw-si links seed` subcommand (a site layer registers `wp aw-si-links seed`); the hard-coded one-host cache note on the Server tab.
- Neutral defaults: brand pattern from the site name and host; Rising lists, species list and anchor topic empty; the "animal welfare = 100" wording is "the anchor topic = 100".
- Behaviour change: a site that relied on the 1.1.4 carry-over and has no stored choice now starts with counting off. The Animal Writes site layer restores the rule.
- Kept on purpose: the Kits → Keys vault copy (`insightweb_keys_copy()`, it names the shared Kits vault, not one site); the earlier `aw_si_*` function names (Kits Core, RankWeb and DirectoryWeb call them); content classes keyed on `aw_*` post types in scoring and the crawl check (inert where the types do not exist).
- Test fixtures no longer use the Animal Writes name or domain.

## 1.1.6

- The links seed uses the site name (`get_bloginfo('name')`) for the anchor and note text it writes. Seeding and gating are unchanged.

## 1.1.5

- Overview boxes load four at a time and retry on an error, and the Clarity 401/403 message says how to fix it.

## 1.1.4

- Visitor counting (country and a shortened IP address per day) is now off by default and has a switch under Settings. A site that already held counted rows keeps counting until switched off. Turning it off, or deleting the plugin, deletes its table, the country file and the schedule. What is stored and for how long is now in `readme.txt`.
- Every tab now has a native WordPress screen without Kits Core (Overview boxes, Rising, Pages, Clarity, Check list, Links, Server, plus the numbers form on Settings). The Kits Core install notice is gone. The readme says which sources each tab needs.
- External services: added DB-IP (monthly country file), favicon fetching and the real PageSpeed behaviour (the key is optional).
- A missing keyword-map seed file is no longer reported as an error on every daily run.
- Neutral wording: the keyword map download and the Google Alerts notice use the site's name; no Animal Writes text by default.
- The seven numbers are written to RankWeb's option only while RankWeb is active; otherwise to InsightWeb's own option `insightweb_numbers`.

## 1.1.3

- Fix: 1.1.2 loaded the 404 and search logging, which is not ready. It is no longer loaded, and the 404 paths and search terms it stored are removed once.

## 1.1.2

- The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

## 1.1.1

- The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.

## 1.1.0

- Tabs follow a fixed order; SourceWeb's tab label is translatable.
- A scheduled report email (weekly or monthly, off by default) with an optional white-label line.

## 1.0.0

- Standalone release with native admin UI fallback, daily telemetry cron, credential status diagnostics, and honest empty-state dashboard tiles.
