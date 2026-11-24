=== SourceWeb ===
Contributors: wugweb
Tags: news, sources, feeds, curation, ai
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

SourceWeb manages RSS/Atom feed ingestion, source trust rules, keyword relevance, review queues, and optional AI-assisted enrichment.

== Description ==

SourceWeb decides what comes into your site and lets your editorial team review it from a dedicated SourceWeb admin menu.

* **Sources:** Manage publisher hosts with trust status (allowed, neutral, or blocked), feeds, optional relay settings, and locally cached site icons.
* **Keywords & Rules:** Configure include, context, and exclude keyword lists alongside per-section rules, domain trust overrides, and feed tag exclusions.
* **Review Queues:** Approve, publish, or reject incoming items and enrichment proposals in To review and Enrichment review.
* **Reports & Jobs:** Monitor worker heartbeats, retry backoff state, rejected items, relay logs, and change logs.
* **Optional AI & Worker Endpoints:** Configure optional AI provider keys with daily caps and REST endpoints for ingestion, relay, relevance, same-story grouping, summaries, and enrichment.

SourceWeb operates standalone with no mandatory plugin dependencies, and optionally integrates with Kits Core, DirectoryWeb, and InsightWeb when active.

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
* **Configured AI Providers (OpenRouter, OpenAI, Anthropic, Google Gemini, Groq, xAI, DeepSeek, Mistral, etc.):** Only when an administrator configures an API key for a provider, sends article text/prompts to perform relevance, summary, or enrichment tasks. Each provider's own Terms of Service and Privacy Policy apply.
* **Configured Worker Relay:** Only when an administrator configures a relay worker URL, forwards fetch requests through that endpoint.

== Uninstall ==

Deleting the plugin deletes no data by default: sources, keywords, rules, review queues, logs, AI model settings, and media library icons stay intact. To remove SourceWeb's own options, schedules, and enrichment table on deletion, enable **Delete this plugin's data when it is deleted** under **SourceWeb → Settings**.

== Changelog ==

= 0.1.0 =
* Standalone release with native admin UI fallback, worker/feed retry backoff, domain trust overrides, and feed tag exclusions.

== Upgrade Notice ==

= 0.1.0 =
Initial standalone release of SourceWeb.
