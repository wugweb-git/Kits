# SourceWeb: how it is organised

## What SourceWeb is for (owner, 26 Nov 2026)

1. **Source** things,
2. **from** defined origins (feeds, publishers, hosts),
3. **via** workers,
4. **within** a defined guardrail (relevance and rules),
5. **to** dedicated places (News, Library, Opportunities, Directory and the other content types), and
6. **enhance** them so they fit in (attribution, titles, summaries, images, directory facts).

Everything in `includes/` serves one of those six steps, and `includes/` is grouped that way (the load order in `sourceweb.php` is unchanged; hooks and tab order depend on it).

| Step | Folders |
|---|---|
| 1 and 2. Source, from origins | `sources/`, `keywords/` (the search terms that steer what is sought) |
| 3. Via workers | `workers/` (registry, tick, relay, ingest) |
| 4. Within a guardrail | `rules/` (relevance, auto-review, section rules), `review/` (what a person still decides), `ai/` (the models behind relevance) |
| 5. To dedicated places | no folder of its own yet: the routing is spread over `workers/ingest.php`, `rules/` (section rules) and `output/content-helpers.php` (section lists) |
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
- **Step 5 has no home.** Where an item lands (which content type, section, status) should be one `places/` folder with one function per place, so adding or changing a destination touches one file. Today it is spread across the three files above.
- Names: `sourcing-*`, `sourceweb-*` and plain names mix inside folders; `sourcing-basics.php` is loaded first and used everywhere.
- `rest/sourceweb-rest-pages.php` is 2,100 lines and serves five screens; split it per feature and move each part next to its model.
- `rules/` and `keywords/` each hold a model, an admin file and a WP side with overlapping helpers; they could share one small settings layer.
- The workers repo (`animal-writes-workers`) is separate. `workers/workers-registry.php` mirrors its workflow list by hand and can drift; a generated registry would remove that.
