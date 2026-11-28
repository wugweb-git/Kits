# PlanWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 0.7.2

- Entries table fits at 1280 and stacks on phones. Scheduled jobs are a card in Settings, not a block far below it. An empty Dashboard offers Add an entry. Timeline marks have 24px hit areas. Each screen has its own tab title. The More from Kits link of a plugin goes to Kits Core's page when Core is active.

## 0.7.1

- The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The Dashboard says "1 idea, 1 draft" in the singular.

## 0.7.0

- A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

## 0.6.0

- The shell Entries screen has a From / To date range (either end can be left empty; reversed ends are swapped; a bad date is ignored). It replaces the Dates choice, and Overdue still ends before today (`planweb_list_args()`, REST `date_from` and `date_to`).
- The shell has a Timeline under the list: a lane for each type that has an entry in the range, a marker for each entry, weekly ticks, and Earlier and Later. It follows the list's filters and dates; with no dates it shows eight weeks from this week's Monday (new REST route `planweb/v1/timeline`, `planweb_rest_timeline()`).
- Tests: `tests/run.php` covers the range. `src/index.js` and `build/` rebuilt; lint clean.
- Not built: drag-and-drop rescheduling; campaign bars spanning dates (an entry has one date). Not run on a live WordPress or in a browser.

## 0.5.0

- Removed all Animal Writes-only code. `includes/team-dates.php` (`aw_team_dates*`, `aw_team_dates_context()`, the seeded and campaign dates, their one-off migrations, the Kits → Dates screen and Dashboard box) moved unchanged to `sites/animalwrites/planweb/team-dates.php`, loaded by `sites/animalwrites/planweb/site.php`. `includes/migrate.php` (the 14 Nov 2026 one-time move, which names Animal Writes entry IDs 25181 to 25187) moved the same way. `planweb.php` requires neither.
- Import from an earlier Dates list is generic: `planweb_import_source()` and the filter `planweb_import_source` (option, source, wait). Default empty: no automatic run, no Import group (REST `import.enabled`, `src/index.js` hides the chip), no Import panel, no Kits status "import" wording. Stored `planweb_source` values and option keys are not renamed.
- `PLANWEB_SITE_SKIP` is now empty; `planweb_site_skip_types()` reads the filter `planweb_site_skip_types`. The site layer restores `aw_news` and `aw_listing`.
- Neutral wording where it named Kits → Dates (`switch.php`, `kits-hub.php`, `planweb-rest.php`, `src/index.js`, `languages/planweb.pot`); build rebuilt.
- `tests/run.php`: Animal Writes host, handles and live texts replaced by neutral ones; the originals are in `sites/animalwrites/planweb/tests/site-tests.php`; a check that the plugin source names no site.

## 0.4.1

- The shell calendar's disabled "Today" button was #949494 on white (3.03:1); Kits Core 1.3.4 sets it to #646970 (5.7:1, WCAG 1.4.3) in `src/shell/calendar.js` and `more.css`; PlanWeb itself has no override.
- Audit: no visible "Animal Writes" string outside the team-dates data in `includes/team-dates.php`, which is gated by `aw_team_dates_context()` and stays for the live site.

## 0.4.0

- New Timeline view on the Calendar page (the one used without Kits Core): a lane for each entry type, each entry a marker placed by its date along the range, plus a plain list of the same entries. Default range is eight weeks from this week's Monday; at most one year. Read-only.
- New From / To date-range filter on the Calendar page (month, week and Timeline views), combined with the existing type, status, owner and channel filters. Pure helpers `planweb_timeline_range()` and `planweb_timeline_lanes()` and the From / To keys of `planweb_calendar_filter()` are in `includes/model.php`, covered by `tests/run.php`.
- Not built: the Timeline and a custom date range in the shell (React) Entries screen (it has date presets only), drag-and-drop rescheduling, author / category / campaign-tag filters. `includes/calendar-views.php` stays unloaded.

## 0.3.2

- The Calendar menu page no longer says "needs Kits Core" when Kits Core is missing: it shows a plain WordPress page with the upcoming entries and the add-entry form, and Settings holds the calendar feed key and the scheduled jobs.
- The Repeat field (none, weekly, monthly) is now in the entry form of the Dashboard and Entries screens, bound to the existing Repeat setting.
- The Animal Writes sample and campaign dates are only added on an Animal Writes site (Animal Writes Core loaded, the planweb_animal_writes_context option set to 1, or the planweb_animal_writes_context filter). Elsewhere nothing is written to options and the old Dates dashboard box is not shown. Dates already stored are kept.
- The "Kits Core is not loaded" notice on PlanWeb's own screen is gone.
- An unused calendar-grid file (calendar-views.php) is no longer loaded.

## 0.3.1

- The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

## 0.3.0

- Four scheduled jobs on WP-Cron, all off until you switch them on in PlanWeb Settings: an overdue sweep (marks open entries whose date has passed; dates are never changed and nothing is deleted), repeats (an entry can repeat every week or month; once its date has passed PlanWeb makes one next entry and never repeats the same one twice), email reminders (one plain-text email a day to the site user who owns an entry that is due in the next 1 to 14 days and not finished) and a weekly digest (the next 7 days and what is overdue, to the site administrator address on Monday morning).
- New Repeat field on an entry, in the Calendar form and in the REST API.
- Email goes only to site users, through this site's own wp_mail(), only when you switch a reminder or the digest on. PlanWeb posts nothing to any social network and makes no outside connection.
- Filters: planweb_job_email (return false to stop any email) and planweb_repeat_entry (return false to skip an entry).
- Delete data now also removes the jobs' settings and schedules.

## 0.2.1

- The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.

## 0.2.0

- The read-only calendar feed, with a key made in Settings and filters by type and status.
- An entry may have several channels; Threads and Bluesky are on the list.
- The Done status.
- Connected services: Metricool and Postiz rejected; Meta Business Suite and Buffer (free) listed as used outside PlanWeb.
- Opening the Dashboard writes nothing; the permission check without Kits Core matches Kits Core's.

## 0.1.0

- The store, the import from Dates, the Calendar screen and the Dashboard box.
