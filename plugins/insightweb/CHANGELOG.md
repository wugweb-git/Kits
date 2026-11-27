# InsightWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 1.1.6

- The links seed uses the site name (`get_bloginfo('name')`) for the anchor and note text it writes. Seeding and gating are unchanged.

## 1.1.5

- Overview boxes load four at a time and retry on an error, and the Clarity 401/403 message says how to fix it.

## 1.1.4

- Visitor counting (country and a shortened IP address per day) is now off by default and has a switch under Settings. A site that already held counted rows keeps counting until switched off. Turning it off, or deleting the plugin, deletes its table, the country file and the schedule. What is stored and for how long is now in `readme.txt`.
- Every tab now has a native WordPress screen without Kits Core (Overview boxes, Rising, Pages, Clarity, Check list, Links, Server, plus the numbers form on Settings). The Kits Core install notice is gone. The readme says which sources each tab needs.
- External services: added DB-IP (monthly country file), favicon fetching and the real PageSpeed behaviour (the key is optional).
- A missing keyword-map seed file is no longer reported as an error on every daily run.
- Neutral wording: the keyword map download and the Google Alerts notice use the site's name; no Animal Writes text by default.
- The seven numbers are written to RankWeb's option only while RankWeb is active; otherwise to InsightWeb's own option `insightweb_numbers`.

## 1.1.3

- Fix: 1.1.2 loaded the 404 and search logging, which is not ready. It is no longer loaded, and the 404 paths and search terms it stored are removed once.

## 1.1.2

- The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

## 1.1.1

- The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.

## 1.1.0

- Tabs follow a fixed order; SourceWeb's tab label is translatable.
- A scheduled report email (weekly or monthly, off by default) with an optional white-label line.

## 1.0.0

- Standalone release with native admin UI fallback, daily telemetry cron, credential status diagnostics, and honest empty-state dashboard tiles.
