# InsightWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

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
