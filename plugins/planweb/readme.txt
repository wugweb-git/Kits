=== PlanWeb ===
Contributors: wugweb
Tags: calendar, planner, schedule, content calendar, team
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 0.7.4
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A team calendar inside WordPress: content, social, email and campaign dates. Posts nothing; emails only site users, and only if switched on.

== Description ==

PlanWeb keeps the team's dates and plans: content, social, email, campaign and reminder entries, each with one or more channels, an owner and a status (idea, draft, approved, due, sent, done). PlanWeb posts nothing to any social network and schedules nothing out. It sends email only through this site's own wp_mail(), only when you switch a reminder or the weekly digest on in PlanWeb Settings, and only to people with an account on this site: never to an outside address.

* PlanWeb → Calendar (the page used without Kits Core): a month grid, a week view and a Timeline, filters by type, status, owner, channel and a From / To date range, and a form to add or edit an entry. The Timeline draws a lane for each type with every entry as a marker placed by its date (default: eight weeks from this week's Monday, at most a year), and lists the same entries below it. Each entry has one date, so there are no spans or campaign bars. Changing a date by drag and drop is not built.
* A Dashboard box with the next 7 days.
* Entries are a private post type in the REST API (`/wp/v2/planweb-entries`), readable only by people who work with them.
* Links may point only to this site or to social sites; titles and notes may hold no email address or phone number.
* Only administrators set Approved or Sent. Done closes an entry that was finished but never sent: it is not overdue and not counted as sent.
* Scheduled jobs, each off until you switch it on in PlanWeb Settings: an overdue sweep, repeating entries (every week or month), email reminders to the entry's owner, and a weekly digest to the site administrator.
* A read-only calendar feed (iCalendar) for Google Calendar, Apple Calendar or Outlook, at `/wp-json/planweb/v1/calendar.ics?key=…`. The key is made in PlanWeb → Settings → Calendar feed; there are filters by type (`type=marketing`) and status (`status=open`). The feed holds date, time, title, type, channels, status and link, never the note.

A site that kept its dates in an option can name it through the filter `planweb_import_source`; switching PlanWeb on then copies every date once and leaves the list unchanged, and `wp planweb verify` compares the two one for one. With no source named (the default) there is no import and no import screen.

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/planweb. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Installation ==

1. Upload the `planweb` folder to `/wp-content/plugins/`, or install PlanWeb through the Plugins screen in WordPress.
2. Activate PlanWeb through the Plugins screen.
3. Open PlanWeb → Calendar to add entries, and PlanWeb → Settings → Calendar feed to make the read-only feed key.

On activation PlanWeb registers the private `planweb_entry` post type and grants the `edit_planweb_entries` capability set (plus `planweb_approve`, administrators only) to administrators and editors. Deactivating removes those capabilities and keeps every entry.

== Frequently Asked Questions ==

= Does PlanWeb post or send anything? =

It posts nothing to any social network and never publishes or schedules a post. It does send email in two cases, and both are off until you switch them on in PlanWeb → Settings → Scheduled jobs: a daily reminder to a site user about their entries that are due soon and not finished, and a weekly digest (the next 7 days and what is overdue) to the site administrator address. The emails go only to people with an account on this site, through this site's own email (wp_mail), never to an outside address. A site can stop any of them with the planweb_job_email filter.

= What are the scheduled jobs? =

Four small jobs on WP-Cron, all off by default. The overdue sweep marks open entries whose date has passed. Repeats makes one next entry (a week or a month later) for an entry set to repeat, once its date has passed, and never repeats the same entry twice. Reminders emails each site user their entries due within 1 to 14 days (you choose). The weekly digest emails the administrator address on Monday morning, with an optional first line of your own. No job changes an entry's date or deletes anything. Deleting the plugin with "Delete this plugin's data" ticked stops and removes them.

= Does it need another plugin? =

The Calendar screen works on its own. The Dashboard, Entries and Settings screens are drawn with the Kits admin shell (Kits Core); without Kits Core those screens show a notice and the standalone Calendar screen remains available.

= How does the calendar feed work? =

PlanWeb serves a read-only iCalendar feed at `/wp-json/planweb/v1/calendar.ics?key=…`. Make the secret key in PlanWeb → Settings → Calendar feed, then subscribe in Google Calendar, Apple Calendar or Outlook. The feed holds date, time, title, type, channels, status and link only — never notes, names, emails or phone numbers. A missing or wrong key returns 404.

= What data does it store, and what happens on uninstall? =

Entries are a private post type, readable only by signed-in people who hold the capability. On uninstall nothing is deleted unless you tick "Delete this plugin's data when it is deleted"; when ticked, a compressed backup is written first and the delete is aborted if the backup fails.

== External Services ==

PlanWeb does not connect to, call, or send any data to an external service, and it makes no outbound HTTP requests.

The iCalendar feed it serves is read by your own calendar app (Google, Apple or Outlook) pulling from this site; the plugin itself never contacts those apps. Any social tools named elsewhere in PlanWeb (for example Meta Business Suite or Buffer) are used by the team outside the plugin — nothing is sent to them from PlanWeb.
* **More from Kits install (direct build only, only when you click Install):** the "More from Kits" page makes no request when it is viewed. When an administrator clicks Install, WordPress fetches the Wugweb registry (`https://wugweb-git.github.io/Kits/registry/index.json`, GitHub Pages) and then downloads that plugin's zip from the project's GitHub releases (`https://github.com/wugweb-git/Kits/releases/`), checked against the registry's SHA-256 before it installs. No site data is sent. This page is not in the WordPress.org build. Turn the Install button off with `define( 'KITS_NO_PLUGIN_INSTALLS', true );`. Terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service. Privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

== Screenshots ==

1. The Dashboard, with counts for the next 30 days, overdue and waiting entries, and a month calendar of entries, posts and listings.
2. Entries: the team's plan as a table of 12 entries with date, type, channels, owner and status, and filters above it.
3. Settings, Connected services: FluentCRM, social posts and the outside tools the team uses by hand.
4. The Add an entry form, with date, time, title, note, type, channels, owner, status, repeat and link.

== Changelog ==

= 0.7.4 =
* Plugin Check clean-up: hook names, variables and request-method reads carry each plugin's own prefix (hooks named aw_si_*, aw_enrich_* and similar are now insightweb_*, sourceweb_*, kits_*, rankweb_*, directoryweb_*), and the update code no longer touches WordPress's update cache.

= 0.7.3 =
* Checks for its own updates from the registry.

= 0.7.2 =
* Entries table fits at 1280 and stacks on phones. Scheduled jobs are a card in Settings, not a block far below it. An empty Dashboard offers Add an entry. Timeline marks have 24px hit areas. Each screen has its own tab title. The More from Kits link of a plugin goes to Kits Core's page when Core is active.

= 0.7.1 =
* The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The Dashboard says "1 idea, 1 draft" in the singular.

= 0.7.0 =
* A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

= 0.6.0 =
* The Entries screen has a From / To date range.
* The shell has a Timeline of entries by type, with Earlier and Later.

= 0.5.0 =
* PlanWeb no longer carries anything for one site. The team's Dates calendar (`includes/team-dates.php`, `aw_team_dates()`, the seeded and campaign dates, their migrations, the one-time 14 Nov entry move and the Kits → Dates screen) is removed from the plugin and kept for the Animal Writes site in its own site layer, `sites/animalwrites/planweb/`, outside the plugin package.
* The import from an earlier Dates list is now generic: the option is named through the filter `planweb_import_source` and is empty by default, so a site without one has no import, no Import settings group and no import status row. The stored `planweb_source` value on entries already imported is unchanged.
* The site schedule no longer leaves two post types out by default (the default is none); a site lists bulk-imported types through the filter `planweb_site_skip_types`. The settings now send `import.enabled`.
* Wording that pointed to Kits → Dates (switch description, off notice, confirm) is neutral.
* Needs the Animal Writes site layer on that site: PlanWeb 0.5.0 alone does not restore the old Dates screen there.

= 0.4.1 =
* The shell calendar's disabled "Today" button is readable (#646970 on white, 5.7:1, was 3.03:1). The control is drawn by Kits Core and fixed there (Kits Core 1.3.4).
* Checked: no visible "Animal Writes" text outside the team-dates data for the live site, which stays as it was.

= 0.4.0 =
* New Timeline view on the Calendar page: a lane for each entry type, each entry a marker placed along the chosen date range, with a plain list of the same entries below. It only reads; nothing is changed or sent.
* New From / To date-range filter on the Calendar page (month, week and Timeline), combining with the type, status, owner and channel filters.
* Not built: the Timeline and date range in the Kits shell (React) screens, drag-and-drop rescheduling, and author, category or campaign-tag filters (no entry has those fields).

= 0.3.2 =
* The Calendar menu page no longer says "needs Kits Core" when Kits Core is missing: it shows a plain WordPress page with the upcoming entries and the add-entry form, and Settings holds the calendar feed key and the scheduled jobs.
* The Repeat field (none, weekly, monthly) is now in the entry form of the Dashboard and Entries screens, bound to the existing Repeat setting.
* The Animal Writes sample and campaign dates are only added on an Animal Writes site (Animal Writes Core loaded, the planweb_animal_writes_context option set to 1, or the planweb_animal_writes_context filter). Elsewhere nothing is written to options and the old Dates dashboard box is not shown. Dates already stored are kept.
* The "Kits Core is not loaded" notice on PlanWeb's own screen is gone.
* An unused calendar-grid file (calendar-views.php) is no longer loaded.

= 0.3.1 =
* The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

= 0.3.0 =

* Four scheduled jobs on WP-Cron, all off until you switch them on in PlanWeb Settings: an overdue sweep (marks open entries whose date has passed; dates are never changed and nothing is deleted), repeats (an entry can repeat every week or month; once its date has passed PlanWeb makes one next entry and never repeats the same one twice), email reminders (one plain-text email a day to the site user who owns an entry that is due in the next 1 to 14 days and not finished) and a weekly digest (the next 7 days and what is overdue, to the site administrator address on Monday morning).
* New Repeat field on an entry, in the Calendar form and in the REST API.
* Email goes only to site users, through this site's own wp_mail(), only when you switch a reminder or the digest on. PlanWeb posts nothing to any social network and makes no outside connection.
* Filters: planweb_job_email (return false to stop any email) and planweb_repeat_entry (return false to skip an entry).
* Delete data now also removes the jobs' settings and schedules.

= 0.2.1 =

* The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.

= 0.2.0 =
* The read-only calendar feed, with a key made in Settings and filters by type and status.
* An entry may have several channels; Threads and Bluesky are on the list.
* The Done status.
* Connected services: Metricool and Postiz rejected; Meta Business Suite and Buffer (free) listed as used outside PlanWeb.
* Opening the Dashboard writes nothing; the permission check without Kits Core matches Kits Core's.

= 0.1.0 =
* The store, the import from Dates, the Calendar screen and the Dashboard box.
