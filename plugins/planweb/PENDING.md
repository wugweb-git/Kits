# PlanWeb: Pending & Roadmap

## Active Scope & Responsibilities
The editorial calendar and campaign planning plugin owns:
- Editorial planning calendar and post-status workflow.
- Campaign roadmap timelines and milestone tracking.
- Content scheduling guards and date validation.

---

## Open Tasks & Enhancements

1. **Editorial Calendar Flow**:
   - Monthly and weekly calendar views for upcoming drafts and scheduled posts.
   - Drag-and-drop schedule adjustment with nonce-verified AJAX.

2. **Deferred Tasks from 17 Nov Session (`claude/planweb-deferred-1117`)**:
   - Campaign timeline visualization without heavy third-party Gantt chart libraries.
   - Filter calendar entries by author, category, or campaign tag.

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Strip the `aw_team_dates` import before WordPress.org submission (`import.php`, `migrate.php`, `team-dates.php`; the unguarded Core call in the Dates menu is now guarded, 26 Nov).
- Drag-and-drop schedule, filters by author, category or campaign, a Help tab.
- Screenshots, Plugin Check on a clean WordPress, and the submission itself.
- Scheduled jobs (overdue sweep, reminders, repeats, digest): not built. Owner decision first: Action Scheduler (new dependency) or WP-cron. Only the `planweb_counts_build` cron exists.
