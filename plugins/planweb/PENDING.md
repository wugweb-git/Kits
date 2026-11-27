# PlanWeb: Pending & Roadmap

## Verified status, 27 Nov 2026 (this section overrides any 'done' or 'resolved' mark below)

Checked line by line against the code on 27 Nov 2026.

- Built in 0.4.0 (27 Nov 2026): a Timeline view and a From / To date-range filter on the classic Calendar page (`planweb_timeline_view()` in `admin.php`; pure `planweb_timeline_range()`, `planweb_timeline_lanes()` and the date keys of `planweb_calendar_filter()` in `model.php`; tested in `tests/run.php`). Type, status, owner and channel filters already existed there.
- Not built: the Timeline and a custom date range in the shell (React) screens (Entries has date presets only; it needs `src/index.js` and a build); drag-and-drop rescheduling; campaign bars spanning dates (an entry has one date). Not run on a live WordPress.
- DEAD (file written, not loaded, not held): `calendar-views.php`, which `planweb.php` does not load. Its campaign-timeline and author / category / campaign-tag filters have no data (no entry has those fields); the timeline and date filter now live in `model.php` and `admin.php` instead. Its earlier 'done' marks are wrong.
- Stale: 'Help tab: not built' (it exists: `help-tab.php`); 'the shell entry form has no Repeat field' (added in 0.3.2).
- Not tested: the cron run functions, saving, uninstall, the switch.
- 0.5.0 (27 Nov 2026): all Animal Writes-only code left the plugin (see CHANGELOG). The site layer at `sites/animalwrites/planweb/` must be deployed with it on the live site; not run on a live WordPress.

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
   - Superseded: those two functions sit in the unloaded `calendar-views.php`, so those 'added' marks never applied. What exists is in 0.4.0: a Timeline (lane per type, marker per entry) and filters by type, status, owner, channel and From / To date on the classic Calendar.

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Done in 0.5.0: `team-dates.php` and the `aw_team_dates` name left the plugin; `import.php` keeps a generic, off-by-default import from a source named by the filter `planweb_import_source`. Remaining before WordPress.org submission: decide whether to drop the generic import too. `migrate.php` (the 14 Nov one-time channel and Done move, with Animal Writes entry IDs 25181 to 25187) moved to the site layer too.
- Drag-and-drop schedule: not built (the Help tab exists). The classic Calendar (used without Kits Core) now has filters by type, status, owner and channel and a week view (26 Nov), and from 0.4.0 a Timeline and a From / To date range; the shell's Entries list filters by the same four plus date presets. No entry has an author, category or campaign field, so those filters do not exist.
- Screenshots, Plugin Check on a clean WordPress, and the submission itself.
- Scheduled jobs: built in 0.3.0 on WP-cron (no Action Scheduler, no new dependency), all off by default, switched in PlanWeb Settings (`includes/jobs.php`, pure rules in `includes/jobs-model.php`, covered by `tests/run.php`).
  - Built: overdue sweep (daily 06:00, sets the `planweb_flag` = overdue on open past entries), repeats (daily 06:15, weekly/monthly, one next entry, `planweb_repeated_to` marks the source, 50 a run), email reminders (daily 08:00, one email per site user, deduped by entry ID and date), weekly digest (Monday 08:30, to `admin_email`, optional first line). Filters `planweb_job_email`, `planweb_repeat_entry`, `planweb_reminder_user`. Cron hooks and options are removed by Delete data.
  - Not built: the Settings group in the shell (React) screen. The six settings are a server-rendered form under the shell's groups (and on the classic Calendar) and the route `POST settings/jobs` is ready; a native group needs `src/index.js` changed and `npm run build` run. The shell's entry form has no Repeat field for the same reason (the REST API takes `repeat`). A reminder's "owner" is the entry's WordPress author, because the Owner list holds team labels, not users. No per-user opt-out, no reminder time setting, no "Run now" button. Daily events are fixed 24 hours apart, so after a clock change they may run an hour off site time until rescheduled.
  - Not verified on a live WordPress (owner rule: no local WordPress): real WP-Cron runs and real mail delivery.
