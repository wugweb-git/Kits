# SourceWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 0.3.1

- No visible text names a particular site: alert email subjects and bodies use the site name (`get_bloginfo('name')`), the Site Health badge reads SourceWeb, the Press keyword help says "coverage of this site", and the Settings switch is labelled "Site-specific extras". Option and filter names are unchanged.

## 0.3.0

- Without Kits Core, nine more screens work as plain WordPress screens instead of showing a notice: To review, Enrichment review, Keywords, Rules, Places, Workers, Rejected, Relay log and Change log. They read through the same functions and route callbacks the Kits shell screens use, so searching, sorting and paging behave the same.
- Every change is a POST to `admin-post.php` with a capability check (`manage_sourceweb` for To review and Enrichment review, administrators for the rest) and a nonce; a GET only reads. A one-line notice after a change is kept in a 60-second per-user transient, never in the address.
- The fallback To review table no longer approves or rejects through a link (it changed data by GET); it posts forms.
- Said on the screen, not faked: Run now needs Kits Core's GitHub dispatch; Enrichment review needs DirectoryWeb's listings; Search suggestions need InsightWeb; summary rules, enrichment field rules and the enrichment review-queue rules stay on the Kits screens.
- With Kits Core active the shell screens are unchanged.
- New file `tests/SourceWebStandaloneScreensTest.php` (144 checks): every handler is POST-only, checks the capability first, then a nonce named after its action; the keyword, press and route saves; a route's stored test can never come from the form.

## 0.2.8

- The text domain is `sourceweb` everywhere, including the screens built in JavaScript (about 760 strings still said `aw-sourcing`), and the translation template is now `languages/sourceweb.pot`. No behaviour changes.

## 0.2.7

- Corrects the readme: it listed 'retry backoff state' and 'worker/feed retry backoff', but the backoff code is not called, so there is no retry backoff. No behaviour changes.

## 0.2.6

- The worker routes (ingest, relevance, same story, relay, summaries, sourcing policy, heartbeat, AI usage) now need the SourceWeb capability or administrator rights instead of `edit_posts`. Routes that required an application password still do.
- Nothing is published without a person unless Publishing is ticked in SourceWeb → Settings (off by default): opportunities, backfill items and auto-review included. Sites that relied on auto-publishing must tick it.
- The Animal Writes starter sources, alert emails and Dashboard box are off unless Site-specific extras is ticked in SourceWeb → Settings (filter `sourceweb_animal_writes_context`).
- Ingest answers with an error instead of inserting when the site has no `aw_news`, `aw_legal`, `aw_listing` or `aw_opportunity` content type.
- `aw/v1/ai-keys` returns full keys only to a worker signed in with an application password; any other caller gets them masked.
- Without Kits Core, Sources and AI models have plain WordPress screens.
- Readme: how items arrive, what needs Kits Core, key storage, and favicon, image-host and AI provider endpoints under External services.

## 0.2.5

- Stops loading the unfinished open-model consent and source-quality code that 0.2.4 shipped by mistake. It added two admin-only REST routes and no visible feature.

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

- Standalone release with native admin UI fallback, domain trust overrides, and feed tag exclusions. (Corrected in 0.2.7: 'worker/feed retry backoff' was listed here but nothing calls the backoff code.)
