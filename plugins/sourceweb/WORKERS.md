# SourceWeb workers: audit and reorganisation (26 Nov 2026)

Read from `includes/workers/workers-registry.php` (the plugin's copy), `workers-meta.php`, `includes/ai/ai-keys.php`, and the workers repository (`sourceweb-workers`: `docs/workers.json`, `.github/workflows/`, the docstring of each `aw_workers/*.py`). "AI?" is taken from those docstrings; rows marked *confirm* were not traced into the code.

## 1. What exists: 20 workflows

Step = where it sits in SourceWeb's flow (source, guard, route, enhance) or *platform* (keeps the machine running). Trigger: **scheduled**, **after** (runs when another finishes), **manual** (Run now), **input** (manual with data supplied by a person).

| Worker | What it does | Step | AI? | Trigger |
|---|---|---|---|---|
| sourcing | Finds News, Library, press items (Google News, feeds), gates relevance, summarises, sends to the site | source + guard + enhance | yes: relevance, summary | scheduled, 6 h |
| research | New Indian animal-welfare papers (Europe PMC, Crossref) for the Library; three titles per paper | source (+ enhance titles) | yes: headline | scheduled, weekly |
| press-gnews | One-off press coverage search (Google News, Google Search through Gemini grounding) | source | yes: search grounding | manual |
| search-insights | Rising terms (Trends, Wikipedia, autocomplete) for InsightWeb | source (of keywords: feeds the loop) | no, *confirm* | scheduled, daily/weekly/monthly |
| submit | News URLs found by hand through the same checks and summary | source (manual) | yes: summary | input |
| darpan-import | NGO Darpan CSVs into Directory enrichment review, after name, state, district checks | source (manual, for Directory) | no | input |
| backfill | Older News and Library items as drafts, from 1 Nov 2025 | source (one-off) | yes: same pipeline | manual |
| relevance-existing | Re-checks published items against the relevance rules | guard | yes: relevance | manual |
| same-story-fold | Folds duplicate stories into the first | guard (de-duplication) | yes: rewrite of the first story | input |
| summary-rewrite | Rewrites summaries that break the summary rules | enhance | yes | scheduled, 30 min |
| news-title-case | Sentence-case titles (dry run, writes nothing) | enhance | *confirm* (model or rule) | manual |
| focus-keywords | Rank Math focus keyword per item | enhance (SEO) | yes, or the best words of the SEO title | scheduled, daily |
| seo-scores | Rank Math SEO scores with Rank Math's own analyser | enhance (SEO) / eval | no | scheduled, daily |
| directory-enrichment | Missing contact details for listings (Google Places, OSM, Wikidata, websites, Gemini with Search) for review | enhance (for the Directory place) | yes: lead finding, clean-up | after seo-scores |
| crawl-check | Asks sample pages as each search and AI crawler | platform / eval | no | scheduled, weekly |
| sources-sync | Copies the site's lists into `sources.yaml` and the rules into JSON | platform | no | scheduled, daily |
| tests | The workers' tests; failure opens an issue | platform | no | after sources-sync |
| wp-cron | Backup trigger for WordPress scheduled tasks | platform | no | scheduled, 15 min |
| keepalive | Keeps scheduled workflows alive after 50 quiet days | platform | no | scheduled, monthly |
| backup-offsite | Copies the daily site backup to a private release (14 days) | platform | no | scheduled, daily |

Counts: 8 sources, 2 guards, 5 enhance, 5 platform. **Seven use AI for a real job; the rest do not.**

### Drift found
`backup-offsite.yml` ("Site backup copy") is in the workers repository's `docs/workers.json` but **not** in the plugin's `AW_WORKERS`, which has 19. The plugin's copy is maintained by hand, so the Workers screen does not show the backup worker and cannot alert if it stops. The Deploy check that compares the two is not in this repository (`tools/ci/workers_registry_check.php`).

## 2. AI models: what they are for

The Settings screen lists **22 providers**: 4 free, 5 quota-limited, 4 card-gated, 7 paid, 2 tools (Firecrawl, TinyFish). Owner rule: paid models are not used. So **7 paid entries are dead weight**, TinyFish is "not used yet", and the card-gated four give nothing until a card is added.

The AI work itself is six jobs, each wanting a different *kind* of model, not a particular provider:

| Job | Needs | Where |
|---|---|---|
| Relevance gate | very fast, cheap, yes or no | sourcing, relevance-existing |
| Summarise | long context, good prose | sourcing, submit, backfill, summary-rewrite |
| Rewrite a story with new facts | reasoning | same-story-fold |
| Titles and keyphrases | short, fast | research, focus-keywords, news-title-case |
| Find facts with a source | **web search grounding** (today only Gemini) | press, directory lead finder |
| Read a page that hides its text | scrape tool, not a model | Firecrawl |

Keys are chosen one by one and attached to workers. The better unit is the job: each job says what it needs (fast, long, reasoning, search), and keys are matched by capability, with the free daily caps already tracked (`AW_AI_DAILY`). Providers with no free route or no capability anyone needs can be retired from the list.

## 3. Where workers come from, and whether they accept manual changes

Today there are three kinds, and the screen cannot tell them apart well:

1. **Registry workers:** a copy of a workflow file in another repository. SourceWeb cannot create or change them; it can only run one (`workflow_dispatch`) and read its reports. They change only by editing the workers repository.
2. **Planned workers** (`planned => true` in `sourceweb_workers_meta`): a note that a worker is wanted. It shows "Not built yet" until a workflow with that id reports a run.
3. **Inputs from a person:** three workers need data supplied at run time (`submit`, `same-story-fold`, `darpan-import`; `needs_input`). Everything else takes at most the Run now defaults.

Nothing in the plugin creates a worker "based on need", and a plugin other than SourceWeb cannot add one. Plugin-internal jobs (WordPress cron events such as the dashboard build and the 15-minute workers tick) exist but are not listed as workers at all.

## 4. One worker definition

Every worker, wherever it runs, should be one record. Plugins register theirs the way they register places, and the Workers screen is built from the records:

| Field | Meaning |
|---|---|
| `id`, `label`, `what` | stable id and plain words |
| `step` | source, guard, enhance, platform (and, for enhance, the place it serves) |
| `runner` | `github-actions`, `wp-cron`, `hpanel-tick` or `plugin` (internal) |
| `trigger` | schedule, after another worker, manual, or input |
| `accepts` | `none`, `defaults`, `input`: whether a person may change it at run time, and what |
| `ai` | `none`, or the job it needs (relevance, summarise, rewrite, titles, search, scrape) |
| `place` | the place its output goes to |
| `late_after_h` | when it counts as late |
| `owner` | the plugin that provides it |

Creation by need follows from this: a plugin that needs a worker registers a record. If its runner is `plugin` or `wp-cron`, SourceWeb can run it; if it is `github-actions`, the record states the workflow file that must exist in the workers repository and shows "Not built yet" until it reports.

## 5. Reorganise by step, not by topic

The groups today are Sourcing, SEO, Directory, Maintenance, One-off. They mix purpose and lifecycle ("One-off" is not a purpose) and put Darpan under Directory although it is a source, and search-insights under SEO although it is a source that feeds back into keywords.

| Group | Workers |
|---|---|
| Source | sourcing, research, press-gnews, search-insights, submit, darpan-import, backfill |
| Guard | relevance-existing, same-story-fold |
| Enhance | summary-rewrite, news-title-case, focus-keywords, seo-scores, directory-enrichment |
| Platform | sources-sync, tests, wp-cron, keepalive, backup-offsite, crawl-check |

"One-off" becomes a trigger shown on the row, not a group.

## 6. Order of work

1. Add `backup-offsite` to the registry (a data change) and add the registry comparison to this repository's CI so the copy cannot drift again.
2. Add `step`, `runner`, `accepts`, `ai`, `place` to each worker (data only) and regroup the Workers screen by step.
3. Let plugins register workers through a filter; list plugin-internal cron jobs as `runner: plugin`.
4. Match AI keys to jobs by capability; retire the dead providers from the list.
5. Join the closed loops (search-insights, keyword stats, review outcomes) so a result can propose a change to a source, keyword or rule.

Steps 1 and 2 are small and safe; 3 to 5 change how the Workers and AI screens behave and need the shell rebuilt and checked in a browser.

## 7. The 12 workflows to keep (focus, 26 Nov 2026)

Source: the Workers Union page's 17 Nov audit (19 workflows: six proposed for removal, two moved to a manual Tools task). That cleanup was never merged, so all 20 workflow files still exist. Owner approved the list on 26 Nov 2026 and it is applied: the workers repo branch `chore/retire-eight-workflows` removes the eight workflow files and `docs/workers.json` now lists 12; this plugin's registry matches. The Python modules stay.

**Keep (12)**

| Worker | Step | Why it stays |
|---|---|---|
| sourcing | source + guard + enhance | The main pipeline |
| summary-rewrite | enhance | Keeps summaries inside the rules |
| research | source | Library papers, weekly |
| search-insights | source (keywords) | Feeds InsightWeb |
| focus-keywords | enhance (SEO) | Daily, free AI or title words |
| seo-scores | enhance (eval) | Rank Math's own analyser, no AI |
| directory-enrichment | enhance (Directory place) | Contact details for review |
| crawl-check | platform (eval) | Crawler access, weekly |
| sources-sync | platform | The workers' fallback lists |
| tests | platform | Failure opens an issue |
| keepalive | platform | Stops schedules going quiet |
| backup-offsite | platform | Offsite copy of the daily backup (the twelfth: it was missing from the 19) |

**Retire (6)**: wp-cron (the site's own cron already runs), same-story-fold (needs input, rare), backfill (one-off, done), news-title-case (dry run only), press-gnews (one-off), darpan-import (one-off).

**Move to a manual Tools task (2)**: submit (URLs found by hand) and relevance-existing (re-check on demand). Both are person-triggered, not workers.

Still to do: merge the workers repo branch, then build the manual Tools task for submit and relevance-existing (not built). The twelfth keeper (backup-offsite) was confirmed with the approval.
