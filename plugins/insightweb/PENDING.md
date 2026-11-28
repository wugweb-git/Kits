# InsightWeb: Pending & Roadmap

## Built 28 Nov 2026 (1.2.2)

- Favicon host check with two filters (`tests/favicon-hosts-test.php`). Not run on a live WordPress.

## Verified status, 27 Nov 2026 (this section overrides any 'done' or 'resolved' mark below)

Checked line by line against the code on 27 Nov 2026.

- DEAD (held, not loaded): 404 and internal-search logging and `insightweb_keyword_movers()`; the earlier 'done' marks are wrong. No UI or REST route reaches them.
- Not tested: 'Tiles and MiniCharts safe when tables are empty' (no test covers empty tables); 1.1.3 cleanup; 1.1.4 native screens.
- 1.2.1 (27 Nov 2026): content-type slugs are gone from the plugin (roles through `insightweb_post_type_roles`, fed by the site layer). The path-based page class still names `/library/`, `/directory/` paths, and `aw_si_*` aliases stay for Kits Core, RankWeb and DirectoryWeb.
- 1.2.0 (27 Nov 2026): the links seed, the visitor-counting carry-over, the brand regex and the Rising/species word lists are out of the plugin (the site layer is `sites/animalwrites/insightweb/`). Still open for neutral behaviour: the scoring ladder (`score.php`), the crawl check (`crawlcheck.php`), the indexing request order (`gsc-types.php`), the PageSpeed sample (`psi.php`) and the keyword spike SQL (`rising.php`) name the `aw_news`, `aw_legal`, `aw_campaign`, `aw_opportunity` and `aw_listing` post types; they are inert on a site without those types but are not yet configurable. `insightweb_keys_copy()` still reads the old shared Kits vault option. `CHANGELOG`/`readme` history and `languages/insightweb.pot` (stale) still mention the earlier names. The overview boxes retry is manual (a 'Try again' button).
- The 'Tabs: 10 flat tabs' and '404 surfacing: unverified' notes are outdated.

## Active Scope & Responsibilities
The analytics, telemetry, and search metrics plugin owns:
- Minimalist admin dashboard with inline SVG MiniCharts (zero external JS chart dependencies).
- Privacy-first engagement telemetry (no cookies, no PII stored).
- Search query and impression tracking.
- Daily aggregation crons with zero write-locks on front-end views.

---

## Built & Operational (22 Nov 2026)

1. **Dashboard Tile & Telemetry Core**:
   - ✅ Verified dashboard tiles and SVG MiniCharts render safely when analytics tables are empty without fatal errors.
   - ✅ Monthly rankings CSV export (`insightweb_si_snapshot_csv`) and markdown keyword map download (`snapshot.php`).
   - ✅ Kits settings transfer export integration (`insightweb_kits_export`).

---

## Open Tasks & Enhancements (Resolved 26 Nov 2026)

1. **Search Insights Integration**:
   - ✅ Added rising queries and declining keywords aggregation (`includes/search-insights/telemetry-404.php`: `insightweb_keyword_movers()`).
   - ✅ Added privacy-first 404 tracking and internal search query logging (`insightweb_record_404()`, `insightweb_record_internal_search()`, `template_redirect` hook, `/insightweb/v1/telemetry/404-searches`).

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Search report by email (items 11, 12, 29; 26 Nov): built, off by default, weekly or monthly to the site administrator with an optional first line for white label (`search-insights/report-email.php`, Settings → Runs and data). Not built: a PDF or a recipient list.
- AdSense is not InsightWeb's (owner, 26 Nov): dropped from this plugin.
- Country filter (53): not built. Site Kit's Search Console call is only known to take a page filter (`gsc.php`), and a filter it ignored would show unfiltered figures as filtered; build it once Site Kit's accepted arguments are verified on a real site.
- The Step 0 to 9 action plan surface and 404 / internal-search surfacing: unverified.
- Tabs: 10 flat tabs; grouping inside the plugin is allowed (owner, 26 Nov) and proposed in `docs/ux-discovery/2026-11-26-admin-ia-discovery.md`.
- `data/links-2026-11-02.php` holds static seeded links: confirm they are never shown as live data.

## HOLD: 404 and internal search logging (review of 26 Nov 2026, not released)

Code is on kits-suite (`includes/search-insights/telemetry-404.php`, commit 15ee659). It logs every front-end 404 path and every visitor search into two options, unconditionally, with no setting and no readme disclosure. Before release: off by default with a switch; say in readme.txt what is stored (no outbound call, but visitor search terms can hold names or emails and 404 paths can hold tokens); retention by days; purge on uninstall whatever the delete-data switch says; mask email-like terms; fix the 100-row cap, which drops every new path once the log is full; write at most once per interval, not on every hit; show it in the UI (today it is REST only). `insightweb_keyword_movers()` is not called anywhere outside the tests.
