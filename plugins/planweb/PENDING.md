# PlanWeb: Pending & Roadmap

## Active Scope & Responsibilities
The editorial calendar and campaign planning plugin owns:
- Editorial planning calendar and post-status workflow.
- Campaign roadmap timelines and milestone tracking.
- Content scheduling guards and date validation.

---

## Open Tasks & Enhancements (Resolved 26 Nov 2026)

1. **Editorial Calendar Flow**:
   - Written, not wired (the file is not loaded and no script calls it): monthly and weekly calendar grid builders (`includes/calendar-views.php`: `planweb_calendar_month_grid()`, `planweb_calendar_week_grid()`).
   - Written, not wired (calendar-views.php is not loaded, no drag-and-drop script exists): nonce-verified schedule adjustment AJAX handler (`wp_ajax_planweb_reschedule_entry`).

2. **Deferred Tasks from 17 Nov Session (`claude/planweb-deferred-1117`)**:
   - ✅ Added zero-dependency HTML/CSS campaign timeline visualization (`planweb_campaign_timeline_data()`, `planweb_render_campaign_timeline()`).
   - ✅ Added calendar entry filtering by author, category, campaign tag, type, and status (`planweb_calendar_filter_entries()`).

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Strip the `aw_team_dates` import before WordPress.org submission (`import.php`, `migrate.php`, `team-dates.php`; the unguarded Core call in the Dates menu is now guarded, 26 Nov).
- Drag-and-drop schedule and a Help tab: not built. The classic Calendar (used without Kits Core) now has filters by type, status, owner and channel and a week view (26 Nov); the shell's Entries list already filtered by the same four. No entry has an author, category or campaign field, so those filters do not exist.
- Screenshots, Plugin Check on a clean WordPress, and the submission itself.
- Scheduled jobs: built in 0.3.0 on WP-cron (no Action Scheduler, no new dependency), all off by default, switched in PlanWeb Settings (`includes/jobs.php`, pure rules in `includes/jobs-model.php`, covered by `tests/run.php`).
  - Built: overdue sweep (daily 06:00, sets the `planweb_flag` = overdue on open past entries), repeats (daily 06:15, weekly/monthly, one next entry, `planweb_repeated_to` marks the source, 50 a run), email reminders (daily 08:00, one email per site user, deduped by entry ID and date), weekly digest (Monday 08:30, to `admin_email`, optional first line). Filters `planweb_job_email`, `planweb_repeat_entry`, `planweb_reminder_user`. Cron hooks and options are removed by Delete data.
  - Not built: the Settings group in the shell (React) screen. The six settings are a server-rendered form under the shell's groups (and on the classic Calendar) and the route `POST settings/jobs` is ready; a native group needs `src/index.js` changed and `npm run build` run. The shell's entry form has no Repeat field for the same reason (the REST API takes `repeat`). A reminder's "owner" is the entry's WordPress author, because the Owner list holds team labels, not users. No per-user opt-out, no reminder time setting, no "Run now" button. Daily events are fixed 24 hours apart, so after a clock change they may run an hour off site time until rescheduled.
  - Not verified on a live WordPress (owner rule: no local WordPress): real WP-Cron runs and real mail delivery.
