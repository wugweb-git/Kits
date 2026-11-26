# SourceWeb: how it is organised

## What SourceWeb is for (owner, 26 Nov 2026)

1. **Source** things,
2. **from** defined origins, by any method: feeds (RSS, Atom, Google News), keyword and press searches, APIs (GDELT, Openverse, DOI, Google Places), pages the site fetches itself, social posts, a link added by hand, or a push from another plugin (InsightWeb). Keywords are one method among these, not the model,
3. **via** workers,
4. **within** a defined guardrail (relevance and rules),
5. **to** dedicated outputs, chosen in settings: a content type (News, Library, Opportunities), another plugin (DirectoryWeb, Resources, any plugin that registers), or a workflow (an automation, webhook, queue or worker job), and
6. **enhance** them so they fit in (attribution, titles, summaries, images, directory facts).

Everything in `includes/` serves one of those six steps, and `includes/` is grouped that way (the load order in `sourceweb.php` is unchanged; hooks and tab order depend on it).

| Step | Folders |
|---|---|
| 1 and 2. Source, from origins | `sources/` (feeds, hosts, icons, site-fetched pages), `keywords/` (one search method: terms, press queries, pushed candidates). Other methods (APIs, manual link, social) live with their worker or screen today and should be listed as source types |
| 3. Via workers | `workers/` (registry, tick, relay, ingest) |
| 4. Within a guardrail | `rules/` (relevance, auto-review, section rules), `review/` (what a person still decides), `ai/` (the models behind relevance) |
| 5. To dedicated outputs | no folder of its own yet: the routing is spread over `workers/ingest.php`, `rules/` (section rules) and `output/content-helpers.php` (section lists) |
| 6. Enhance | `enhance/`: summaries (rules, rewrite), titles, attribution, images, Library PDFs, issuer, research citation; `enhance/directory/`: directory enrichment |
| Around all steps | `admin/`, `rest/` (screens and routes), `lifecycle/` (migrations, uninstall), `compat/` |

## The flow

```
sources ──> workers ──> rules ──> review ──> enrichment / output
 (what)      (who,       (is it     (a person    (directory facts,
              arrival)    wanted?)   decides)     what the site shows)
                 ▲                                     │
 keywords ───────┘  (search terms in, SEO stats out)   ▼
                                              admin + rest (screens, routes)
```

| Folder | Purpose | Takes in | Puts out |
|---|---|---|---|
| `sources/` | The lists the workers fetch: feeds, publishers, hosts, their icons, the policy over them, opportunity pages the site fetches itself | The Sources and Press screens, `data/sources-seed.json` | Option `aw_sources`; the lists the workers read over REST |
| `workers/` | The Python workers (repo `animal-writes-workers`): their registry, status, the 15-minute tick that keeps GitHub's late schedules on time, the relay for publishers that block GitHub, and **ingest**, the endpoint where items arrive | Worker POSTs (`aw/v1/*`), hPanel cron, WP-CLI | New items as drafts; run records; worker status |
| `rules/` | The gate: relevance (is it about animal welfare?), auto-review, auto-resolve of queued values, section rules, same-story grouping | An ingested item or a queued value | Accept, hold for review, or reject, each with a logged reason |
| `review/` | The To review queue: everything that came in automatically and still needs a person | Items the rules held | A decision: publish, edit or reject |
| `enhance/` | Making an item fit in. **Summarising is enhancement:** the summary rules and the rewrite pass. Also sentence-case titles, attribution and source row, CC0 images, Library PDFs, issuer label, research citation. `enhance/directory/` is directory enrichment: what the directory worker found for a listing, review of changes, clean-up proposals, the listing-page output | Items that passed the gate; worker results per listing | Final summary, title, image, credit; listing field changes with provenance |
| `keywords/` | The keyword table and its screens, keywords pushed from InsightWeb, routing on approval, per-keyword stats, suggestions, the Tools → Search Insights tab | Search Insights, owner approvals | Keyword lists for the workers; stats |
| `ai/` | AI provider keys and icons for the workers' relevance and summary passes | Pasted keys | Provider and mode per worker |
| `admin/` | The SourceWeb menu and Overview, Dashboard counts and the hourly build, screens on the Kits shell, capability `manage_sourceweb`, Help tab, Plugins-screen info, Site Health test | Counts and stored state | Screens and tiles |
| `rest/` | The `sourceweb/v1` routes the shell screens call (dashboard, review, enrichment, pages, AI, logs) | Screen requests | JSON |
| `lifecycle/` | Phase migrations from WP-CLI (backup, dry run, migrate, verify, roll back), the retire model, the uninstall backup | WP-CLI, uninstall | Backups, migrated options |
| `compat/` | The earlier `aw_*` function names other plugins and the site still call | Old callers | The new `sourceweb_*` functions |

## Rules this layout keeps

- A file belongs to the folder of the thing it is **for**, not of the screen that shows it. The screen part of a feature is `admin/` or `rest/`; its model and logic stay with the feature.
- `*-model.php` files are pure (no WordPress calls) so `tests/run.php` can load them alone. Keep new logic pure where it can be.
- Stored names (`aw_*` options, `aw/v1` routes, `AW_*` constants) stay: live data and the workers depend on them.

## Still scattered (next steps, not done)

- **Summaries in ingest.** `workers/ingest.php` still trims the summary to whole sentences, strips the legal-review flag and checks the section minimum while an item arrives. That is enhancement: move it to `enhance/` and have ingest call it.
- **Step 5 has no home.** Where an item goes should be one `outputs/` folder with a registry of destinations. A destination has a kind (content type, plugin, or workflow), a label, a test for "is it available", and a handler that takes the finished item. Settings choose which kind of item goes to which destination; today's routing is the default. Adding a destination (another plugin, a webhook, a workflow) touches one registration, not the intake. Today the routing is spread across the three files above and assumes a content type.
- **Step 1 has no list of source types.** Feed, keyword search, API, site-fetched page, manual link, social and pushed candidate are handled in different places. A source-type registry (type, label, which worker or screen runs it) would let Sources show them all in one place.
- Names: `sourcing-*`, `sourceweb-*` and plain names mix inside folders; `sourcing-basics.php` is loaded first and used everywhere.
- `rest/sourceweb-rest-pages.php` is 2,100 lines and serves five screens; split it per feature and move each part next to its model.
- `rules/` and `keywords/` each hold a model, an admin file and a WP side with overlapping helpers; they could share one small settings layer.
- The workers repo (`animal-writes-workers`) is separate. `workers/workers-registry.php` mirrors its workflow list by hand and can drift; a generated registry would remove that.

## Information architecture today, against the six steps (26 Nov 2026)

Read from `menu-model.php`, `sourceweb-ui.php`, the settings payload and `src/index.js` (7,100 lines, one script).

**Menu:** Overview, To review, Enrichment review, then nine tabs of one page: Sources, Keywords, Rules, AI models, Workers, Rejected, Relay log, Change log, Settings. Twelve items, flat.

| Screen | Sections inside it | Steps it really serves |
|---|---|---|
| Overview | Pipeline and trends, Worker runs, Reports, Commands | all (monitoring) |
| To review | To review list, Add by link, Proposed details, Listing details | 4 (a person decides); **Add by link is step 1** |
| Enrichment review | Waiting values per listing, Listing details | 6 (review of an enhancement) |
| Sources | Sources (hosts), Feeds (per host) | 1 and 2 |
| Keywords | Keyword check, Press discovery, Test a headline, the keyword list (Roles, Categories, Sections), Suggestions from Search Insights, Auto-approve rules | 2 (what to look for), 4 (keyword check is a gate), plus InsightWeb input |
| Rules | Section rules (allowed categories and tags per content type), Tag rules, Summary rules, Directory enrichment (field rules, trust order), Review-queue rules | **4, 5 and 6 in one tab** |
| AI models | At a glance, Daily caps, Keys by group, Keys, Used by, Keys overview | infrastructure for 4 (relevance) and 6 (summaries, enrichment) |
| Workers | Workers, Run now log, Keys | 3 (its Keys block repeats AI models) |
| Rejected / Relay log / Change log | read-only reports | 4 / 3 / all |
| Settings | Workers use these lists, Directory enrichment live cap, Social posts, Connected services, Backfill, links to the other screens | 3, 6, **5 (Social posts is a destination)**, and a drawer of leftovers |

### What does not fit

1. **Rules mixes three steps.** Section rules decide where an item lands (step 5), Summary rules and Directory enrichment shape it (step 6), Review-queue rules and Tag rules guard it (step 4). Someone changing how summaries read must open the same tab as someone changing what is rejected.
2. **Settings is a drawer.** It holds one switch for workers, one cap for enrichment, a destination (Social posts), connected services and Backfill. None belongs to "settings of the plugin" except Backfill-style switches.
3. **Step 5 has no screen.** Destinations appear only as "Section rules" and as the Social posts switch, and the code assumes every destination is a content type. There is nowhere to see or choose where each kind of item goes, or to add a plugin or a workflow as a destination.
4. **Reports are scattered.** Rejected (the guardrail's output) and Relay log (the workers' output) are top-level tabs beside settings, and the Overview has a fourth reports block.
5. **Two review screens** (To review, Enrichment review) do one job for two kinds of item.
6. **Add by link** (a manual source) is inside To review.
7. **Keywords** is both a sourcing list and an SEO tool (suggestions from InsightWeb, headline test).
8. **Keys appear twice** (AI models and Workers).
9. **Twelve flat items** with no grouping by what the person is doing.

### Proposed layout (one place per step)

| Tab | Holds | Moves from |
|---|---|---|
| Overview | Pipeline, worker runs, what needs attention | as now |
| Sources (1, 2) | Every source type in one list: hosts and feeds, keyword and press searches, APIs, site-fetched pages, social, **Add by link**, pushes from other plugins | Sources, Keywords, To review, Settings |
| Workers (3) | Workers, runs, relay and its log, the "workers use these lists" switch, worker keys | Workers, Relay log, Settings |
| Guardrails (4) | Keyword check, Review-queue rules, Tag rules, Rejected log, relevance model choice | Keywords, Rules, Rejected |
| Outputs (5) | Each destination, whether a content type, a plugin or a workflow, with its section rules and allowed categories and tags; which kind of item goes where | Rules (Section rules), Settings (Social posts) |
| Enhance (6) | Summary rules, titles, images, Directory enrichment rules, trust order, live cap | Rules, Settings |
| Review | One queue for items and enrichment values, filter by kind | To review, Enrichment review |
| Settings and logs | Backfill, connected services, AI keys and caps, change log | Settings, AI models, Change log |

Eight items instead of twelve, and each answers one question: what do we look for, who fetches, what is allowed, where does it go, how is it improved, what needs a person.

### What stays put

Addresses (`admin.php?page=aw-sourcing&tab=…`), capabilities, option names and routes are live and used by the Plugins screen links and the workers, so the regroup is done in the screens first and the old addresses redirect. Nothing in this section is built yet; it needs the shell script rebuilt (`npm run build`) and a browser check of each moved block.
