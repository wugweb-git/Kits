# SourceWeb: how it is organised

SourceWeb decides **what the workers fetch**, receives **what they bring**, **gates and reviews** it, and **publishes the result** on the site. `includes/` is grouped by that flow, one folder per purpose. The load order in `sourceweb.php` is unchanged (hooks and tab order depend on it); only the folders are new (26 Nov 2026).

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
| `rules/` | The gate: relevance (is it about animal welfare?), auto-review, auto-resolve of queued values, summary rules, section rules, same-story grouping | An ingested item or a queued value | Accept, hold for review, or reject, each with a logged reason |
| `review/` | The To review queue: everything that came in automatically and still needs a person | Items the rules held | A decision: publish, edit or reject |
| `enrichment/` | Directory enrichment: what the directory worker found for a listing, review of changes, clean-up proposals, the listing-page output | Worker results per listing | Listing field changes, with provenance, after review |
| `output/` | What the site shows from sourced content: attribution and source row, sentence-case titles, summary rewrite, CC0 images, Library PDFs, issuer label, research citation, content helpers | Published items | Front-end markup, images, canonical links |
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

- Names: `sourcing-*`, `sourceweb-*` and plain names mix inside folders; `sourcing-basics.php` is loaded first and used everywhere.
- `rest/sourceweb-rest-pages.php` is 2,100 lines and serves five screens; split it per feature and move each part next to its model.
- `rules/` and `keywords/` each hold a model, an admin file and a WP side with overlapping helpers; they could share one small settings layer.
- The workers repo (`animal-writes-workers`) is separate. `workers/workers-registry.php` mirrors its workflow list by hand and can drift; a generated registry would remove that.
