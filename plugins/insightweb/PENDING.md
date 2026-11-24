# InsightWeb: Pending & Roadmap

## Active Scope & Responsibilities
The analytics, telemetry, and search metrics plugin owns:
- Minimalist admin dashboard with inline SVG MiniCharts (zero external JS chart dependencies).
- Privacy-first engagement telemetry (no cookies, no PII stored).
- Search query and impression tracking.
- Daily aggregation crons with zero write-locks on front-end views.

---

## Built & Operational (24 Nov 2026)

1. **Dashboard Tile & Telemetry Core**:
   - ✅ Verified dashboard tiles and SVG MiniCharts render safely when analytics tables are empty without fatal errors.
   - ✅ Monthly rankings CSV export (`aw_si_snapshot_csv`) and markdown keyword map download (`snapshot.php`).
   - ✅ Kits settings transfer export integration (`insightweb_kits_export`).
   - ✅ Automated daily telemetry cron hook: `INSIGHTWEB_CRON_TELEMETRY` (`insightweb_daily_telemetry_cron`) registered and scheduled to refresh Search Console and telemetry daily.
   - ✅ Service credentials diagnostics and health reporting: `insightweb_check_service_status()` reporting connected, invalid_key, quota_exceeded, or not_configured status across Search Console, GA4, Clarity, PageSpeed, and Bing.
   - ✅ Native Service Credentials status rows with colored status pills and secure password inputs in `insightweb-keys.php` hooked to `aw_si_settings_rows` and `admin_post_insightweb_save_keys`.
   - ✅ Strict empty-state telemetry across all 6 dashboard tiles (`empty => true, is_mock: false`) in `insightweb-dashboard.php` and `insightweb-rest.php`.
   - ✅ Complete standalone operation without Kits Core or Rank Math boot halt. All 150 checks passing.

---

## Open Tasks & Enhancements

1. **Search Insights Integration**:
   - Step 0–9 keyword action plan integration: surface rising queries and declining keywords directly in the dashboard.
   - 404 error tracking and internal search query logging.
