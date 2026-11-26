# PlanWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

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
