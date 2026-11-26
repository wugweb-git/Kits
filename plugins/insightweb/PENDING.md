# InsightWeb: Pending & Roadmap

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

## Open Tasks & Enhancements

1. **Search Insights Integration**:
   - Step 0–9 keyword action plan integration: surface rising queries and declining keywords directly in the dashboard.
   - 404 error tracking and internal search query logging.

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Search report by email (items 11, 12, 29; 26 Nov): built, off by default, weekly or monthly to the site administrator with an optional first line for white label (`search-insights/report-email.php`, Settings → Runs and data). Not built: a PDF or a recipient list.
- AdSense is not InsightWeb's (owner, 26 Nov): dropped from this plugin.
- Country filter (53): not built. Site Kit's Search Console call is only known to take a page filter (`gsc.php`), and a filter it ignored would show unfiltered figures as filtered; build it once Site Kit's accepted arguments are verified on a real site.
- The Step 0 to 9 action plan surface and 404 / internal-search surfacing: unverified.
- Tabs: 10 flat tabs; grouping inside the plugin is allowed (owner, 26 Nov) and proposed in `docs/ux-discovery/2026-11-26-admin-ia-discovery.md`.
