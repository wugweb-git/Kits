=== PlanWeb ===
Contributors: wugweb
Tags: calendar, planner, schedule, content calendar, team
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 0.3.2
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A team calendar inside WordPress: content, social, email and campaign dates. Posts nothing; emails only site users, and only if switched on.

== Description ==

PlanWeb keeps the team's dates and plans: content, social, email, campaign and reminder entries, each with one or more channels, an owner and a status (idea, draft, approved, due, sent, done). PlanWeb posts nothing to any social network and schedules nothing out. It sends email only through this site's own wp_mail(), only when you switch a reminder or the weekly digest on in PlanWeb Settings, and only to people with an account on this site: never to an outside address.

* PlanWeb → Calendar: a month grid, a list with filters, and a form to add or edit an entry.
* A Dashboard box with the next 7 days.
* Entries are a private post type in the REST API (`/wp/v2/planweb-entries`), readable only by people who work with them.
* Links may point only to this site or to social sites; titles and notes may hold no email address or phone number.
* Only administrators set Approved or Sent. Done closes an entry that was finished but never sent: it is not overdue and not counted as sent.
* Scheduled jobs, each off until you switch it on in PlanWeb Settings: an overdue sweep, repeating entries (every week or month), email reminders to the entry's owner, and a weekly digest to the site administrator.
* A read-only calendar feed (iCalendar) for Google Calendar, Apple Calendar or Outlook, at `/wp-json/planweb/v1/calendar.ics?key=…`. The key is made in PlanWeb → Settings → Calendar feed; there are filters by type (`type=marketing`) and status (`status=open`). The feed holds date, time, title, type, channels, status and link, never the note.

On a site with the earlier Dates list (option `aw_team_dates`), switching PlanWeb on copies every date once and leaves the list unchanged. `wp planweb verify` compares the two one for one.

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

== Changelog ==

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
