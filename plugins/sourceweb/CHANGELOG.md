# SourceWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 0.2.4

- The "Upgrade to Premium" link is gone from the Plugins screen.
- A site whose workers have never reported no longer shows "Ingestion needs attention" or "Late" for every worker; alarms start after the first report.

## 0.2.2

- The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.

## 0.2.1

- Places: with no place available the Routes card says so and "Add a route" is off, instead of an empty "Send to" list.

## 0.2.0

- Places tab: routes (a boolean expression sends an item to a place, first match wins), per-place enhancements, a source-type registry, and a read-out of what each place says back.
- Closed loop: a source with 10 or more decisions and under 30% accepted is flagged "Review this source". Nothing is blocked automatically.
- AI keys are ordered by job (relevance, summary, rewrite, titles, search); the paid providers are removed.
- Workers: an "All workers" table (the union of registered and reported workers); the registry is down to the 12 workflows in use.
- Rejected: a manual re-check of the newest published items against the current rules. Nothing is changed.
- The REST callbacks are split by feature; every `aw/v1` worker route is also served at `sourceweb/v1/worker-api/`.
- A CI check compares the workers registry with the workers repository.

## 0.1.0

- Standalone release with native admin UI fallback, worker/feed retry backoff, domain trust overrides, and feed tag exclusions.
