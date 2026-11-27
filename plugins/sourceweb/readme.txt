=== SourceWeb ===
Contributors: wugweb
Tags: news, sources, feeds, curation, ai
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 0.2.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Brings in news from RSS and Atom feeds, applies source trust and keyword rules, and queues items for editors to review.

== Description ==

SourceWeb decides what comes into your site and lets your editorial team review it from a dedicated SourceWeb admin menu.

* **Sources:** Manage publisher hosts with trust status (allowed, neutral, or blocked), feeds, optional relay settings, and locally cached site icons.
* **Keywords & Rules:** Configure include, context, and exclude keyword lists alongside per-section rules, domain trust overrides, and feed tag exclusions.
* **Review Queues:** Approve, publish, or reject incoming items and enrichment proposals in To review and Enrichment review.
* **Reports & Jobs:** Monitor worker heartbeats, retry backoff state, rejected items, relay logs, and change logs.
* **Optional AI & Worker Endpoints:** Configure optional AI provider keys with daily caps and REST endpoints for ingestion, relay, relevance, same-story grouping, summaries, and enrichment.

SourceWeb operates standalone with no mandatory plugin dependencies, and optionally integrates with Kits Core, DirectoryWeb, and InsightWeb when active.

**How items arrive.** SourceWeb does not fetch feeds inside WordPress. The list of sources you keep here is read by external workers (scripts run outside your site, for example GitHub Actions), and they send each item to this site's ingest routes (`/wp-json/aw/v1/ingest`, also at `/wp-json/sourceweb/v1/worker-api/ingest`) with an application password.  Without workers, no items arrive. The workers themselves are not part of this plugin.

**What needs Kits Core.** Without Kits Core you get plain WordPress screens for Sources (list, add, turn on or off, remove), AI models (add and remove keys), To review, Rules (domain overrides and feed tag filters) and Settings. Keywords, Places, Workers, Rejected, Relay log, and Change log need Kits Core; without it they show a notice and the Overview counts.

**Who may push items, and what goes live.** The worker routes need the SourceWeb capability (`manage_sourceweb`, held by administrators and by roles that can edit others' posts), or administrator rights; Authors and Contributors cannot use them. Change it with the `sourceweb_ingest_capability` filter. Every item arrives as Pending and waits in To review: nothing is published without a person unless an administrator ticks **Publishing** in SourceWeb → Settings (or a site returns true from the `sourceweb_allow_publish` filter).

**Animal Writes extras.** The starter list of animal-welfare sources and keywords, the alert emails to the site administrator (ingestion, workers and relevance problems) and the Dashboard box are off unless **Animal Writes extras** is ticked in SourceWeb → Settings or a site returns true from the `sourceweb_animal_writes_context` filter. No alert email is sent from a site that has not switched it on.

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
* **Google favicon service (`https://www.google.com/s2/favicons`):** When a publisher's site icon is cached, sends the publisher's host name (then tries `https://<host>/favicon.ico` on the publisher's own site).
* **Image hosts and YouTube thumbnails (`https://i.ytimg.com/`):** When an item's picture is checked or a copy is kept, requests the page, its `og:image` and the image from the publisher's own host or from the host named in the page; a YouTube link uses its thumbnail from `i.ytimg.com`.
* **AI provider endpoints:** Only when an administrator saves a key, SourceWeb sends a short test prompt to that key's provider, and the workers (not WordPress) later send article text and prompts using the key. The providers the code can call are OpenRouter (`openrouter.ai`), Requesty (`router.requesty.ai`), Cline (`api.cline.bot`), Command Code (`api.commandcode.ai`), NVIDIA (`integrate.api.nvidia.com`), Vercel AI Gateway (`ai-gateway.vercel.sh`), Hugging Face (`router.huggingface.co`), SambaNova (`api.sambanova.ai`), Groq (`api.groq.com`), Google Gemini (`generativelanguage.googleapis.com`), Mistral (`api.mistral.ai`) and Cerebras (`api.cerebras.ai`). Each provider's own terms and privacy policy apply.
* **Configured AI Providers (free models only: OpenRouter, Google Gemini, Groq, Cerebras, NVIDIA, Mistral and similar):** Only when an administrator configures an API key for a provider, sends article text/prompts to perform relevance, summary, or enrichment tasks. Each provider's own Terms of Service and Privacy Policy apply.
* **Configured Worker Relay:** Only when an administrator configures a relay worker URL, forwards fetch requests through that endpoint.

== Uninstall ==

Deleting the plugin deletes no data by default: sources, keywords, rules, review queues, logs, AI model settings, and media library icons stay intact. To remove SourceWeb's own options, schedules, and enrichment table on deletion, enable **Delete this plugin's data when it is deleted** under **SourceWeb → Settings**.

== Changelog ==

= 0.2.6 =
* The worker routes (ingest, relevance, same story, relay, summaries, sourcing policy, heartbeat, AI usage) now need the SourceWeb capability or administrator rights instead of `edit_posts`. The routes that required an application password still do.
* Nothing is published without a person unless **Publishing** is ticked in SourceWeb → Settings (off by default). This includes opportunities, backfill items and auto-review. Sites that relied on auto-publishing must tick it.
* The Animal Writes starter sources, the alert emails and the Dashboard box are off unless **Animal Writes extras** is ticked in SourceWeb → Settings (off by default).
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
* Standalone release with native admin UI fallback, worker/feed retry backoff, domain trust overrides, and feed tag exclusions.

== Upgrade Notice ==

= 0.1.0 =
Initial standalone release of SourceWeb.
