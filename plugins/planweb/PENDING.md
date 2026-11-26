# PlanWeb: Pending & Roadmap

## Active Scope & Responsibilities
The editorial calendar and campaign planning plugin owns:
- Editorial planning calendar and post-status workflow.
- Campaign roadmap timelines and milestone tracking.
- Content scheduling guards and date validation.

---

## Open Tasks & Enhancements (Resolved 26 Nov 2026)

1. **Editorial Calendar Flow**:
   - ✅ Added monthly and weekly calendar grid builders (`includes/calendar-views.php`: `planweb_calendar_month_grid()`, `planweb_calendar_week_grid()`).
   - ✅ Added nonce-verified drag-and-drop schedule adjustment AJAX handler (`wp_ajax_planweb_reschedule_entry`).

2. **Deferred Tasks from 17 Nov Session (`claude/planweb-deferred-1117`)**:
   - ✅ Added zero-dependency HTML/CSS campaign timeline visualization (`planweb_campaign_timeline_data()`, `planweb_render_campaign_timeline()`).
   - ✅ Added calendar entry filtering by author, category, campaign tag, type, and status (`planweb_calendar_filter_entries()`).

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Strip the `aw_team_dates` import before WordPress.org submission (`import.php`, `migrate.php`, `team-dates.php`; the unguarded Core call in the Dates menu is now guarded, 26 Nov).
- Drag-and-drop schedule and a Help tab: not built. The classic Calendar (used without Kits Core) now has filters by type, status, owner and channel and a week view (26 Nov); the shell's Entries list already filtered by the same four. No entry has an author, category or campaign field, so those filters do not exist.
- Screenshots, Plugin Check on a clean WordPress, and the submission itself.
- Scheduled jobs (overdue sweep, reminders, repeats, digest): not built. Owner decision first: Action Scheduler (new dependency) or WP-cron. Only the `planweb_counts_build` cron exists.
