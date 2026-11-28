# SourceWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 0.7.5

- Plugin Check clean-up: hook names, variables and request-method reads carry each plugin's own prefix (hooks named aw_si_*, aw_enrich_* and similar are now insightweb_*, sourceweb_*, kits_*, rankweb_*, directoryweb_*), and the update code no longer touches WordPress's update cache.

## 0.7.4

- Checks for its own updates from the registry. The earlier aw_ shims are gone from the plugin; calls to DirectoryWeb use its current names.

## 0.7.3

- The menu item Overview reads Dashboard and AI models comes before Places, so the WordPress tab bar and the header agree and the bar is hidden. A failed Add place scrolls the message into view. Checkboxes and radios in labels have a 24px hit area.

## 0.7.2

- Add place and Remove on the Places screen of the shell (it was only on the classic screen). The Dashboard and Workers verdicts say "waiting for the first report" instead of "no problems" before any worker has reported. Narrower bars in the pipeline chart. The More from Kits link of a plugin goes to Kits Core's page when Core is active.

## 0.7.1

- The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The Run now notice names SOURCEWEB_GITHUB_TOKEN and SOURCEWEB_WORKERS_REPO. Singular and plural item labels.

## 0.7.0

- A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

## 0.6.0

- Run now works without Kits Core. SourceWeb starts a worker's workflow on GitHub itself (`sourceweb_dispatch_workflow()`, GitHub's workflow dispatch on the main branch). It needs a fine-grained token for the workers repository only, with Actions read and write, in wp-config.php as `SOURCEWEB_GITHUB_TOKEN` (the names `KITS_GITHUB_DISPATCH_TOKEN` and `AW_GITHUB_DISPATCH_TOKEN` keep working), and the repository as `SOURCEWEB_WORKERS_REPO` (owner/name) or the filter `sourceweb_workers_repo`. With neither set, Run now stays off and the Workers screen says what to add. The standalone Workers screen has a Run now button on each worker that can run; a renamed repository, a refused token and a missing workflow each give their own message. When Kits Core is present and this plugin has no setting of its own, Kits Core's connection is used as before.
- The workers repository is now `wugweb-git/sourceweb-workers` (it was `wugweb-git/animal-writes-workers`). Names in the plugin's docs and comments, the site layer and the registry check are updated. The site layer sets both `sourceweb_workers_repo` and `kits_dispatch_repo` to it.
- External services: GitHub's API (`api.github.com`) is listed in the readme and the registry; it is called only on Run now.
- Tests: `tests/dispatch-test.php` (token, repository, request, every error), screens test (22 handlers).
- Not run against GitHub or on a live WordPress.

## 0.5.0

- Add a place: the standalone Places screen can make a place (a content type, plugin, workflow or other), with a name, an optional id and, for a content type, the content type. It is kept in the option `sourceweb_custom_places`, joins the list of places and can be chosen in a route. An id that is already a place is refused; a place a route still sends items to cannot be removed (`sourceweb_place_add()`, `sourceweb_place_remove()`).
- Favicon host check: SourceWeb fetches a site icon only from a public DNS name (no address, no single-label or local-looking name). The filter `sourceweb_favicon_hosts` limits it to a list of hosts and their subdomains; `sourceweb_favicon_third_party` returns false to stop asking Google's favicon service. Applies to the hourly publisher icons and the source icons.
- Uninstall also removes the routes, place choices, made places and outcomes options.
- Tests: `tests/run.php` (places), `tests/favicon-hosts-test.php`, and the screens test (21 handlers).
- Not built: Run now for workers (it needs a GitHub token and the workers' repository; Kits Core dispatches it). Not run on a live WordPress.

## 0.4.1

- The second pass of taking site-specific code out of the plugin. The Animal Writes site layer (`sites/animalwrites/sourceweb/`, not in this zip) must be deployed alongside 0.4.1: without it the plugin finds no News, Library, Opportunity, Press or Directory content type on that site and its type-dependent features do nothing.
- Post types by role. SourceWeb no longer names any site's content types. New `includes/compat/post-type-roles.php`: the filter `sourceweb_post_type_roles` (role => post type; roles news, library, campaign, opportunity, listing, press, social; default empty) and the helpers `sourceweb_type( $role )`, `sourceweb_is_type( $type, $role )`, `sourceweb_is_any_type()`, `sourceweb_types( $roles )`, `sourceweb_types_with()`, `sourceweb_item_types()` and `sourceweb_sql_in_types( $column, $types )` (a quoted `IN (...)` list, or `1=0` when there are none). The listing role comes from DirectoryWeb's `directoryweb_post_type()` when that plugin is active. A role with no type is "not applicable": no query, no notice, no empty `IN ()`.
- The constants that held slugs became functions built from the roles: `AW_REVIEW_TYPES` is `sourceweb_review_types()`, `AW_RELEVANCE_TYPES` is `sourceweb_relevance_types()`, `SOURCEWEB_SAME_STORY_TYPES` is `sourceweb_same_story_types()`, `AW_RULES_SUMMARY_ALIAS`, `AW_RULES_SUMMARY_INHERIT` and `AW_RULES_WORKER_TYPES` are `sourceweb_rules_summary_alias()`, `sourceweb_rules_summary_inherit()` and `sourceweb_rules_worker_types()`, and `AW_SOURCING_PUSH_SECTION` is `sourceweb_sourcing_push_section()`. Hooks that were added at load time for each type (bulk Publish, the Review column, the post meta for the publisher image switch) are added on `init`. `wp aw news-titles apply --type` is now `news` or `press`.
- The Directory enrichment is generic again. The AWBI and NGO Darpan sources, the NGO Darpan ID field, the four AWBI claim fields, the AWBI-only queue group (`group=awbi-bare`), the Darpan duplicate check and the AWBI and Darpan values in the worker payload, the state index and the clean-up export moved to the site layer (`includes/enrichment.php`). New neutral filters: `sourceweb_enrich_sources`, `sourceweb_enrich_fields`, `sourceweb_enrich_claim_fields`, `sourceweb_enrich_listing_payload`, `sourceweb_enrich_queue_steps`, `sourceweb_enrich_index_item`, `sourceweb_enrich_cleanup_item` and `sourceweb_enrich_duplicate_keys`. Stored meta keys and source keys are unchanged.
- The job-vacancy rule of the "not news" check (Indian job sites, "recruitment 2026" headlines) moved to the site layer (`includes/not-news-rules.php`) behind the new filter `sourceweb_not_news_reason`; the archive and tag-page rule stays.
- No visible text names a site or an Indian body: the Sources help and the field rule help are neutral (`source-sites.php`, `src/index.js`, rebuilt). `tools/validate/check-visible-brand.py` passes for SourceWeb with an empty allowlist.
- Redirects and search descriptions call RankWeb's `rankweb_redirect_add`, `rankweb_seo_cut`, `rankweb_seo_item_description` and `rankweb_rank_math_redirect` (each still guarded by `function_exists`, same fallbacks as before) instead of the earlier `aw_` names.
- Kept on purpose: stored names (options, meta, routes, cron, the `aw-section` post-type support key, the ACF listing group key `group_aw_listing` in `rules.php`), the earlier `aw_` function names in `includes/compat/legacy-aliases.php` (sixteen one-line wrappers for callers outside the plugin), and the lowercase source keys `awbi` and `darpan` in the enrichment trust-order seed (`rules-model.php`), which the workers repository's constants and the seed fixture hold too.
- Tests: `tests/run.php` registers the Animal Writes role map and has 12 new checks for the roles (including the empty map) and for the plugin naming none of the six types. The site layer's test has 11 new checks for the role map, the enrichment filters and the not-news rule. The five failures that were there before (DirectoryWeb's listing fields, mid-change) are unchanged.

## 0.4.0

- No code written for one site is in the plugin any more. SourceWeb is used on several sites, so everything that served only the Animal Writes site was removed or turned into a filter or action with a neutral default. The Animal Writes site keeps it in a separate site layer (`sites/animalwrites/sourceweb/` in the Kits repository, not in this zip) that must be deployed alongside 0.4.0.
- Removed: the `sourceweb_animal_writes_context()` switch and the Site-specific extras checkbox in Settings (the stored option name is unchanged and is cleaned on uninstall); the one-time carry-over that switched the extras on for a site with published `aw_news` items; the starter source list (`data/sources-seed.json`); the two one-time list seeds (blocked publishers, High Court source); the WordPress Dashboard box; the alert emails.
- Alert emails are now actions and a filter: `sourceweb_ingest_problems`, `sourceweb_workers_problems` and `sourceweb_relevance_alert` (the dashboard notice for held items is still stored). SourceWeb sends no email itself. The relevance-alert route answers `noted` instead of `email off`.
- Neutral defaults, with a filter for a site to supply its own: starter sources (`sourceweb_starter_sources`, empty), relay allow list (`sourceweb_relay_default_hosts`, empty; the constant `AW_RELAY_DEFAULT` is now that function), legal hosts for Legal Watch (`sourceweb_legal_hosts`; `AW_LEGAL_HOSTS` is now that function), issuers (`sourceweb_issuers_base`, `sourceweb_issuer_short_defaults`; the built-in list no longer has the Animal Welfare Board of India), blocked and allowed publishers and the keyword lists seeded on a new site (`sourceweb_default_blocked_publishers`, `sourceweb_default_allowed_publishers`; the keyword lists start empty), and the workers' repository for the links on the Workers screen (`sourceweb_workers_repo`; no links when none is named). A site that already has these options stored is unchanged.
- The keyword role shown as Animal is now labelled Topic (stored key unchanged). The auto-review reason reads "not clearly about this site's subject".
- Moved out of the plugin, unchanged, to the site layer: the Kits status row and settings-transfer options (`kits-hub.php`) and the four WP-CLI migration tools (`sourcing-migrate.php`, `-phase2`, `-rules`, `-retire`). Their file-reading tests moved with them.
- Kept on purpose: the `aw_*` option, meta, route, cron and capability names and the `aw_news`/`aw_legal` content types (stored names, other plugins use them), the workers registry (an exact copy of the workers repository's `docs/workers.json`), the Google News India edition and the IST schedule display (see PENDING.md).
- `languages/sourceweb.pot` is regenerated (it was last built on 13 Nov and still carried the old text domain).

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
