=== SourceWeb ===
Contributors: wugweb
Tags: news, sources, feeds, curation, ai
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 0.7.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Brings in news from RSS and Atom feeds, applies source trust and keyword rules, and queues items for editors to review.

== Description ==

SourceWeb decides what comes into your site and lets your editorial team review it from a dedicated SourceWeb admin menu.

* **Sources:** Manage publisher hosts with trust status (allowed, neutral, or blocked), feeds, optional relay settings, and locally cached site icons.
* **Keywords & Rules:** Configure include, context, and exclude keyword lists alongside per-section rules, domain trust overrides, and feed tag exclusions.
* **Review Queues:** Approve, publish, or reject incoming items and enrichment proposals in To review and Enrichment review.
* **Reports & Jobs:** Monitor worker heartbeats, rejected items, relay logs, and change logs.
* **Optional AI & Worker Endpoints:** Configure optional AI provider keys with daily caps and REST endpoints for ingestion, relay, relevance, same-story grouping, summaries, and enrichment.

SourceWeb operates standalone with no mandatory plugin dependencies, and optionally integrates with Kits Core, DirectoryWeb, and InsightWeb when active.

**How items arrive.** SourceWeb does not fetch feeds inside WordPress. The list of sources you keep here is read by external workers (scripts run outside your site, for example GitHub Actions), and they send each item to this site's ingest routes (`/wp-json/aw/v1/ingest`, also at `/wp-json/sourceweb/v1/worker-api/ingest`) with an application password.  Without workers, no items arrive. The workers themselves are not part of this plugin.

**What needs Kits Core.** Nothing is needed to open a screen: without Kits Core every SourceWeb screen is a plain WordPress screen (a table or a list with forms; nothing is drawn by JavaScript). Sources, AI models, To review, Enrichment review, Keywords, Rules, Places, Workers, Rejected, Relay log, Change log and Settings all open and save. What they cannot do without Kits Core or another plugin is said on the screen: Run now on Workers needs Kits Core's GitHub connection; Enrichment review needs DirectoryWeb's listings; Search suggestions under Keywords need InsightWeb's Search Insights; Rules does not have the summary rules, the enrichment field rules or the review-queue rules for enrichment values (Kits Core's screens set those). With Kits Core active the screens are the Kits ones, as before.

**Who may push items, and what goes live.** The worker routes need the SourceWeb capability (`manage_sourceweb`, held by administrators and by roles that can edit others' posts), or administrator rights; Authors and Contributors cannot use them. Change it with the `sourceweb_ingest_capability` filter. Every item arrives as Pending and waits in To review: nothing is published without a person unless an administrator ticks **Publishing** in SourceWeb → Settings (or a site returns true from the `sourceweb_allow_publish` filter).

**Site-specific extras.** The starter list of animal-welfare sources and keywords, the alert emails to the site administrator (ingestion, workers and relevance problems) and the Dashboard box are off unless **Site-specific extras** is ticked in SourceWeb → Settings or a site returns true from the `sourceweb_animal_writes_context` filter. No alert email is sent from a site that has not switched it on.

**Content types.** SourceWeb does not register the `aw_news`, `aw_legal`, `aw_listing` or `aw_opportunity` content types; another plugin or theme must. On a site without a type, the ingest route answers with an error for that kind of item and creates nothing.

**API keys.** AI keys and the Google Places key are stored as saved in the WordPress options table (not encrypted). The admin screens and REST routes show a key only as its last four characters. The one route that returns the full keys, `/wp-json/aw/v1/ai-keys`, does so only to a worker signed in with an application password; any other caller gets them masked.

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/sourceweb. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Installation ==

1. Upload the `sourceweb` folder to `/wp-content/plugins/`, or install the `sourceweb.zip` package via **Plugins → Add New → Upload Plugin**.
2. Activate **SourceWeb** on the **Plugins** screen.
3. Open **SourceWeb** in the WordPress admin menu to configure sources, rules, and optional API keys.

== Frequently Asked Questions ==

= Does SourceWeb require Kits Core or other plugins? =

No. SourceWeb installs and operates independently with native WordPress admin screens. If Kits Core, DirectoryWeb, or InsightWeb are active, SourceWeb integrates with them automatically.

= What happens if no AI or external API keys are configured? =

SourceWeb works without external AI keys. Feed management, domain trust overrides, keyword filtering, and manual review queues continue operating normally; optional AI and live-enrichment features remain inactive until configured.

== External services ==

SourceWeb may connect to external services only when the corresponding feature or administrator configuration is enabled:

* **Configured RSS/Atom Feeds & Publisher Websites:** Fetches feed entries, article metadata (`og:image`), site icons, and public PDFs from feed and publisher URLs configured by the site administrator.
* **Openverse API (`https://api.openverse.org/`):** When CC0 fallback image search is enabled, sends search keywords to retrieve public-domain/CC0 image metadata. Terms & Privacy: [https://openverse.org/](https://openverse.org/).
* **DOI / Crossref (`https://doi.org/`):** When resolving research paper citations by DOI, sends the DOI identifier to retrieve bibliographic metadata. Terms: [https://www.crossref.org/services/metadata-retrieval/](https://www.crossref.org/services/metadata-retrieval/).
* **Google Places API (`https://places.googleapis.com/`):** Only when a Google Places API key is configured and live place details are requested, sends the stored Place ID to retrieve business hours and contact details. Terms & Privacy: [https://policies.google.com/privacy](https://policies.google.com/privacy).
* **Google favicon service (`https://www.google.com/s2/favicons`):** When a publisher's site icon is cached, sends the publisher's host name (then tries `https://<host>/favicon.ico` on the publisher's own site). Only public host names are asked; the `sourceweb_favicon_hosts` filter limits it to a list and `sourceweb_favicon_third_party` can turn the Google service off.
* **Image hosts and YouTube thumbnails (`https://i.ytimg.com/`):** When an item's picture is checked or a copy is kept, requests the page, its `og:image` and the image from the publisher's own host or from the host named in the page; a YouTube link uses its thumbnail from `i.ytimg.com`.
* **AI endpoint configured by the administrator:** SourceWeb contains no AI provider, address, model or key. Only when an administrator enters an AI connection (a label, an OpenAI-compatible address, a model name and a key) on the AI models tab, SourceWeb sends a short test prompt to that address with that key, and the workers (not WordPress) later send article text and prompts to it. A tool connection (a label, an address and a key) is not tested; the workers call it. Everything is stored in this site's options and nothing is shared between sites. The terms of service and privacy policy are those of the provider whose address the administrator entered.
* **WordPress AI client (Settings > Connectors):** When WordPress's AI client (WordPress 7.0 or later) has a text connection set up under Settings > Connectors, SourceWeb's own text tasks use it and send article text and prompts to the provider chosen there; the plugin stores no key for it, and an optional model preference is only a hint to the client. The terms of service and privacy policy are those of that provider. Where the client is switched off or has no text connection, nothing is sent through it, and nothing is sent at all unless an administrator has entered a connection as above.
* **GitHub Actions, the workers repository (`https://api.github.com/`):** Only when an administrator adds a GitHub token and the workers repository to wp-config.php and presses Run now on a worker, sends the workflow's file name and its inputs, with the token, to start that workflow. Nothing is sent otherwise. Terms & Privacy: [https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
* **Configured Worker Relay:** Only when an administrator configures a relay worker URL, forwards fetch requests through that endpoint.
* **More from Kits install (direct build only, only when you click Install):** the "More from Kits" page makes no request when it is viewed. When an administrator clicks Install, WordPress fetches the Wugweb registry (`https://wugweb-git.github.io/Kits/registry/index.json`, GitHub Pages) and then downloads that plugin's zip from the project's GitHub releases (`https://github.com/wugweb-git/Kits/releases/`), checked against the registry's SHA-256 before it installs. No site data is sent. This page is not in the WordPress.org build. Turn the Install button off with `define( 'KITS_NO_PLUGIN_INSTALLS', true );`. Terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service. Privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

== Uninstall ==

Deleting the plugin deletes no data by default: sources, keywords, rules, review queues, logs, AI model settings, and media library icons stay intact. To remove SourceWeb's own options, schedules, and enrichment table on deletion, enable **Delete this plugin's data when it is deleted** under **SourceWeb → Settings**.

== Screenshots ==

1. The Dashboard, with counts of items waiting for review, refused items, allowed sources and workers on time, and the pipeline charts.
2. To review: four demo items held by the automatic checks, each with the reason it was held and publish and reject buttons.
3. Settings, Connected services: the workers, Google Maps, enrichment sources, AI providers and relay SourceWeb works with.
4. Sources: publishers with their status (Allowed, Neutral or Blocked), short name and quick actions.
5. Keywords: the Include, Topic, Context, Exclude, Search and Press words the relevance check uses.
6. Workers: one row per scheduled workflow, with its group, workflow file, schedule and a run now button.

== Changelog ==

= 0.7.5 =
* Plugin Check clean-up: hook names, variables and request-method reads carry each plugin's own prefix (hooks named aw_si_*, aw_enrich_* and similar are now insightweb_*, sourceweb_*, kits_*, rankweb_*, directoryweb_*), and the update code no longer touches WordPress's update cache.

= 0.7.4 =
* Checks for its own updates from the registry. The earlier aw_ shims are gone from the plugin; calls to DirectoryWeb use its current names.

= 0.7.3 =
* The menu item Overview reads Dashboard and AI models comes before Places, so the WordPress tab bar and the header agree and the bar is hidden. A failed Add place scrolls the message into view. Checkboxes and radios in labels have a 24px hit area.

= 0.7.2 =
* Add place and Remove on the Places screen of the shell (it was only on the classic screen). The Dashboard and Workers verdicts say "waiting for the first report" instead of "no problems" before any worker has reported. Narrower bars in the pipeline chart. The More from Kits link of a plugin goes to Kits Core's page when Core is active.

= 0.7.1 =
* The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. The Run now notice names SOURCEWEB_GITHUB_TOKEN and SOURCEWEB_WORKERS_REPO. Singular and plural item labels.

= 0.7.0 =
* A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

= 0.6.0 =
* Run now works without Kits Core: set SOURCEWEB_GITHUB_TOKEN and SOURCEWEB_WORKERS_REPO in wp-config.php.
* GitHub's API is listed under External services (called only when Run now is pressed).

= 0.5.0 =
* The Places screen can add a place and remove one a route does not use.
* Site icons are fetched only from public host names; `sourceweb_favicon_hosts` can limit them to a list and `sourceweb_favicon_third_party` can turn Google's favicon service off.

= 0.4.1 =
* The second pass of taking site-specific code out of the plugin. The Animal Writes site layer (`sites/animalwrites/sourceweb/`, not in this zip) must be deployed alongside 0.4.1: without it the plugin finds no News, Library, Opportunity, Press or Directory content type on that site and its type-dependent features do nothing.
* Post types by role. SourceWeb no longer names any site's content types. New `includes/compat/post-type-roles.php`: the filter `sourceweb_post_type_roles` (role => post type; roles news, library, campaign, opportunity, listing, press, social; default empty) and the helpers `sourceweb_type( $role )`, `sourceweb_is_type( $type, $role )`, `sourceweb_is_any_type()`, `sourceweb_types( $roles )`, `sourceweb_types_with()`, `sourceweb_item_types()` and `sourceweb_sql_in_types( $column, $types )` (a quoted `IN (...)` list, or `1=0` when there are none). The listing role comes from DirectoryWeb's `directoryweb_post_type()` when that plugin is active. A role with no type is "not applicable": no query, no notice, no empty `IN ()`.
* The constants that held slugs became functions built from the roles: `REVIEW_TYPES` is `sourceweb_review_types()`, `RELEVANCE_TYPES` is `sourceweb_relevance_types()`, `SAME_STORY_TYPES` is `sourceweb_same_story_types()`, `RULES_SUMMARY_ALIAS`, `RULES_SUMMARY_INHERIT` and `RULES_WORKER_TYPES` are `sourceweb_rules_summary_alias()`, `sourceweb_rules_summary_inherit()` and `sourceweb_rules_worker_types()`, and `SOURCING_PUSH_SECTION` is `sourceweb_sourcing_push_section()`. Hooks that were added at load time for each type (bulk Publish, the Review column, the post meta for the publisher image switch) are added on `init`. `wp aw news-titles apply --type` is now `news` or `press`.
* The Directory enrichment is generic again. The AWBI and NGO Darpan sources, the NGO Darpan ID field, the four AWBI claim fields, the AWBI-only queue group (`group=awbi-bare`), the Darpan duplicate check and the AWBI and Darpan values in the worker payload, the state index and the clean-up export moved to the site layer (`includes/enrichment.php`). New neutral filters: `sourceweb_enrich_sources`, `sourceweb_enrich_fields`, `sourceweb_enrich_claim_fields`, `sourceweb_enrich_listing_payload`, `sourceweb_enrich_queue_steps`, `sourceweb_enrich_index_item`, `sourceweb_enrich_cleanup_item` and `sourceweb_enrich_duplicate_keys`. Stored meta keys and source keys are unchanged.
* The job-vacancy rule of the "not news" check (Indian job sites, "recruitment 2026" headlines) moved to the site layer (`includes/not-news-rules.php`) behind the new filter `sourceweb_not_news_reason`; the archive and tag-page rule stays.
* No visible text names a site or an Indian body: the Sources help and the field rule help are neutral (`source-sites.php`, `src/index.js`, rebuilt). `tools/validate/check-visible-brand.py` passes for SourceWeb with an empty allowlist.
* Redirects and search descriptions call RankWeb's `rankweb_redirect_add`, `rankweb_seo_cut`, `rankweb_seo_item_description` and `rankweb_rank_math_redirect` (each still guarded by `function_exists`, same fallbacks as before) instead of the earlier `aw_` names.
* Kept on purpose: stored names (options, meta, routes, cron, the `aw-section` post-type support key, the ACF listing group key `group_aw_listing` in `rules.php`), the earlier `aw_` function names in `includes/compat/legacy-aliases.php` (sixteen one-line wrappers for callers outside the plugin), and the lowercase source keys `awbi` and `darpan` in the enrichment trust-order seed (`rules-model.php`), which the workers repository's constants and the seed fixture hold too.
* Tests: `tests/run.php` registers the Animal Writes role map and has 12 new checks for the roles (including the empty map) and for the plugin naming none of the six types. The site layer's test has 11 new checks for the role map, the enrichment filters and the not-news rule. The five failures that were there before (DirectoryWeb's listing fields, mid-change) are unchanged.

= 0.4.0 =
* No code written for one site is in the plugin any more. SourceWeb is used on several sites, so everything that served only the Animal Writes site was removed or turned into a filter or action with a neutral default. The Animal Writes site keeps it in a separate site layer (not in this zip) that must be deployed alongside 0.4.0.
* Removed: the `sourceweb_animal_writes_context()` switch and the Site-specific extras checkbox in Settings (the stored option name is unchanged and is cleaned on uninstall); the one-time carry-over that switched the extras on for a site with published `aw_news` items; the starter source list (`data/sources-seed.json`); the two one-time list seeds (blocked publishers, High Court source); the WordPress Dashboard box; the alert emails.
* Alert emails are now actions and a filter: `sourceweb_ingest_problems`, `sourceweb_workers_problems` and `sourceweb_relevance_alert` (the dashboard notice for held items is still stored). SourceWeb sends no email itself. The relevance-alert route answers `noted` instead of `email off`.
* Neutral defaults, with a filter for a site to supply its own: starter sources (`sourceweb_starter_sources`, empty), relay allow list (`sourceweb_relay_default_hosts`, empty; the earlier `RELAY_DEFAULT` constant is now that function), legal hosts for Legal Watch (`sourceweb_legal_hosts`; the earlier `LEGAL_HOSTS` constant is now that function), issuers (`sourceweb_issuers_base`, `sourceweb_issuer_short_defaults`; the built-in list no longer has the Animal Welfare Board of India), blocked and allowed publishers and the keyword lists seeded on a new site (`sourceweb_default_blocked_publishers`, `sourceweb_default_allowed_publishers`; the keyword lists start empty), and the workers' repository for the links on the Workers screen (`sourceweb_workers_repo`; no links when none is named). A site that already has these options stored is unchanged.
* The keyword role shown as Animal is now labelled Topic (stored key unchanged). The auto-review reason reads "not clearly about this site's subject".
* Moved out of the plugin, unchanged, to the site layer: the Kits status row and settings-transfer options (`kits-hub.php`) and the four WP-CLI migration tools (`sourcing-migrate.php`, `-phase2`, `-rules`, `-retire`). Their file-reading tests moved with them.
* Kept on purpose: the `aw_*` option, meta, route, cron and capability names and the `aw_news`/`aw_legal` content types (stored names, other plugins use them), the workers registry (an exact copy of the workers repository's `docs/workers.json`), the Google News India edition and the IST schedule display (see PENDING.md).
* `languages/sourceweb.pot` is regenerated (it was last built on 13 Nov and still carried the old text domain).

= 0.3.1 =
* No visible text names a particular site any more: the alert emails (ingestion, workers, relevance) use the site's own name in the subject and first line, the Site Health badge reads SourceWeb, the Press keyword help says "coverage of this site", and the Settings switch is labelled "Site-specific extras" (same option and filter as before).

= 0.3.0 =
* Without Kits Core, nine more screens work as plain WordPress screens instead of showing a notice: To review (publish or reject one, ticked, or every item of a view), Enrichment review (approve, reject or undo a proposed value), Keywords (the check's switches, the four keyword lists or the keyword table, Press settings, a headline test), Rules (domain trust, feed tags to leave out, tag rules, section rules), Places (routes, enhancements, how each source did), Workers (list, runs, add, change and delete a planned worker), Rejected, Relay log and Change log (search, view, sort, pages).
* Every change on these screens is a POST with a capability check and a nonce; reading is by GET and changes nothing. Notices are kept in a short-lived per-user transient, not in the address.
* The old To review table on the fallback page approved and rejected through a link (a change by GET). It is replaced by forms.
* Not on these screens without Kits Core or another plugin: Run now (needs Kits Core's GitHub dispatch), Search suggestions (InsightWeb), summary rules, enrichment field rules and the review-queue rules for enrichment values (the Kits screens), and the AI keys attached to a worker (set on AI models).

= 0.2.8 =
* The text domain is `sourceweb` everywhere, including the screens built in JavaScript (about 760 strings still said `aw-sourcing`), and the translation template is now `languages/sourceweb.pot`. No behaviour changes.

= 0.2.7 =
* Corrects the readme: it listed 'retry backoff state' and 'worker/feed retry backoff', but the backoff code is not called, so there is no retry backoff. No behaviour changes.

= 0.2.6 =
* The worker routes (ingest, relevance, same story, relay, summaries, sourcing policy, heartbeat, AI usage) now need the SourceWeb capability or administrator rights instead of `edit_posts`. The routes that required an application password still do.
* Nothing is published without a person unless **Publishing** is ticked in SourceWeb → Settings (off by default). This includes opportunities, backfill items and auto-review. Sites that relied on auto-publishing must tick it.
* The Animal Writes starter sources, the alert emails and the Dashboard box are off unless **Site-specific extras** is ticked in SourceWeb → Settings (off by default).
* Ingest answers with an error instead of inserting when the site has no `aw_news`, `aw_legal`, `aw_listing` or `aw_opportunity` content type.
* `/wp-json/aw/v1/ai-keys` returns full keys only to a worker signed in with an application password; others get them masked.
* Without Kits Core, Sources and AI models now have plain WordPress screens.
* The readme says how items arrive, what needs Kits Core, and lists favicon, image-host and every AI provider endpoint under External services.

= 0.2.5 =
* Stops loading the unfinished open-model consent and source-quality code that 0.2.4 shipped by mistake. It added two admin-only REST routes and no visible feature. Any consent value saved through them is ignored.

= 0.2.4 =
* The "Upgrade to Premium" link is gone from the Plugins screen.
* A site whose workers have never reported no longer shows "Ingestion needs attention" or "Late" for every worker; alarms start after the first report.

= 0.2.2 =

* The direct (non-WordPress.org) build now carries an Update URI header, so the site checks the Kits registry for new versions. The WordPress.org build still omits it.


= 0.2.1 =
* Places: with no place available the Routes card says so and "Add a route" is off, instead of an empty "Send to" list.

= 0.2.0 =
* Places tab: routes (a boolean expression sends an item to a place, first match wins), per-place enhancements, a source-type registry, and a read-out of what each place says back.
* Closed loop: a source with 10 or more decisions and under 30% accepted is flagged "Review this source". Nothing is blocked automatically.
* AI keys are ordered by job (relevance, summary, rewrite, titles, search); the paid providers are removed.
* Workers: an "All workers" table (the union of registered and reported workers); the registry is down to the 12 workflows in use.
* Rejected: a manual re-check of the newest published items against the current rules. Nothing is changed.
* The REST callbacks are split by feature; every `aw/v1` worker route is also served at `sourceweb/v1/worker-api/`.
* A CI check compares the workers registry with the workers repository.

= 0.1.0 =
* Standalone release with native admin UI fallback, domain trust overrides, and feed tag exclusions. (Corrected in 0.2.7: this entry also said 'worker/feed retry backoff'. The backoff code exists but nothing calls it, so there is no retry backoff.)

== Upgrade Notice ==

= 0.7.5 =
Hook names and variables now carry the plugin prefix.

= 0.7.4 =
Checks for its own updates from the registry. The earlier aw_ shims are gone from the plugin; calls to DirectoryWeb use its current names.

= 0.1.0 =
Initial standalone release of SourceWeb.
