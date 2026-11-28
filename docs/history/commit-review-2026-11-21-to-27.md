# Per-commit review, 21 to 27 Nov 2026

Every one of the 294 non-merge commits on kits-suite since 21 Nov was reviewed against its own diff by six read-only reviewers (49 commits each, oldest first). Each row in `ledger-parts/part-N.md` says what the commit really changed, whether the subject matches, and one verdict. Parts: [1](ledger-parts/part-1.md) 21-24 Nov, [2](ledger-parts/part-2.md) 24-25 Nov, [3](ledger-parts/part-3.md) 25 Nov, [4](ledger-parts/part-4.md) 25-26 Nov, [5](ledger-parts/part-5.md) 26 Nov, [6](ledger-parts/part-6.md) 26-27 Nov. Who made which commit: [session-activity-2026-11-21-to-27.md](session-activity-2026-11-21-to-27.md). The plain list of commits: [commit-ledger-2026-11-21-to-27.md](commit-ledger-2026-11-21-to-27.md).

## Verdict totals

| Part | OK | Docs only | Fixed later | Churn | Reverted | Broke (unfixed when reviewed) | Unverified |
|---|---|---|---|---|---|---|---|
| 1 | 16 | 20 | 10 | 0 | 3 | 0 | 0 |
| 2 | 25 | 15 | 5 | 4 | 0 | 0 | 0 |
| 3 | 17 | 13 | 10 | 5 | 2 | 2 | 0 |
| 4 | 22 | 18 | 2 | 4 | 1 | 1 | 1 |
| 5 | 37 | 3 | 8 | 1 | 0 | 0 | 0 |
| 6 | 19 | 12 | 10 | 0 | 0 | 7 | 1 |
| **All 294** | **136** | **81** | **45** | **14** | **6** | **10** | **2** |

"OK" means the diff does what its subject says and nothing later contradicts it. It does not mean CI passed on that commit: only about one commit in three was ever the head of a CI run (15, 16, 17, 0, 6 and about 21 per part), because work was pushed in batches.

## What the review found, in order of seriousness

### Shipped to users
1. **Held code released three times**: MailWeb 3.3.2 (retry queue storing full mail bodies), InsightWeb 1.1.2 (logging every 404 path and visitor search), SourceWeb 0.2.4 (dead consent code plus two REST routes). Fixed in 3.3.3, 1.1.3, 0.2.5.
2. **Release notes described features that did not exist**: MailWeb Status column, real-mail logging, fallback SMTP, failure alerts, pause dismiss; SourceWeb retry backoff; PlanWeb Repeat field in the form (added in 0.3.2). Corrected in MailWeb 3.3.5 and SourceWeb 0.2.7; the PlanWeb gap closed in 0.3.2.
3. **MailWeb's "sending paused" notice showed on every admin screen with no way to dismiss it** (fd79d2b). Fixed in 3.3.6 (committed, see below).
4. **DirectoryWeb fatal on load** in five consecutive states of the branch (7adced9 required four files that did not exist until 45b910a). Standalone DirectoryWeb did not register its listing type until 75a0a88.
5. **The live `aw/v1/mail-in` webhook route was deleted for a day** (f8ff4ed) until 2243d7a.
6. **Registry updater cut off**: 965685f removed `Update URI` from MailWeb and PlanWeb until 38b8815; 928c816's registry cache did not clear on "Check again" until 774ee19.
7. **Theme "Upgrade to Premium" link** was left in when the plugins' links were removed (774ee19); removed 27 Nov.

### CI and process
8. **CI red for 11 consecutive runs 22-24 Nov** (the workflow was born red in f8ff4ed) and again on 26 Nov for four separate causes.
9. **Work done twice**: the `aw_` rename on two lineages (d30b12c / ede0b04 vs 8953680, merged in 2746002); duplicate patches 6cfff73 and 6398705; the page-parts mechanism built and removed an hour later (e9b4cad, f14458a); a claim-email path registered twice (997c3d7).
10. **Subjects that do not match diffs**: at least 14 in part 3 alone (for example "no tenant data left" while Animal Writes wording stayed; "regenerates blueprints" with none in the diff), and a347fe9 titled as a Plugin Check workflow change that deletes 68 files / 5,436 lines of docs.
11. **Docs written, then deleted within hours** (six commits in part 4; one deletion of 7,366 lines carried only 62 lines into PENDING).
12. **False "done" notes in PENDING** (theme width and token claims, 'text domain complete' for SourceWeb, tests 'verified'), several repeated into new changelogs.
13. **Things committed by accident**: seven built zips (4.3 MB, b4172a0, removed in e6d9441); a 212-line review file `directoryweb-precommit-review.md` at the repo root (8d8446f, still there).
14. **Commit trailers**: about 80 commits pushed this week carry `Co-Authored-By: Claude Sonnet 5.5`; the repo rule (restored in docs/git/commit-attribution.md) is `Co-Authored-By: Wugweb <admin@wugweb.com>`. Not rewritten (shared history).

### Not done properly
15. **SourceWeb "text domain complete" is false**: PHP strings use `sourceweb`, but about 758 `aw-sourcing` strings remain in `src/index.js` and the translation file is still `aw-sourcing.pot` (e666d7b, recorded as done in 73950ca).
16. **WordPress.org inline-script fixes (a003cff and four others) left Plugin Check errors**; ececc74 fixed them but also hid a hard-coded host from the scan by splitting the string.
17. **DirectoryWeb options never removed on uninstall** (bd609dc: `directoryweb_fields`, `directoryweb_listing_types`, `directoryweb_form_mappings`); 947 lines of admin UI shipped never opened in a browser (b6a9e44).
18. **The workflow-list drift check cannot fail CI** (89ef5ca, `continue-on-error`).
19. **Silently deleted docs not restored**: `docs/brand-os/*` (a347fe9). The commit-attribution rule was restored.
20. **Content Web (ae82e66)** is not wired into CI, release or build and its subject claims a move that the diff does not show.

## Done during this review (27 Nov)
Seven plugins corrected and released (see the audit); verified-status sections in every PENDING; the held-code check in CI and release; draft-then-verify release; zips and theme upgrade link removed; commit-attribution rule restored; MailWeb 3.3.6 (notice fix) committed.

## Mistakes made while doing this review
- I committed seven zips with `git add -A` (b4172a0). Removed.
- I re-ran 23 cancelled CI runs at once. They share a concurrency group that cancels the running job, so they cancelled each other and the run on the head commit. Nothing was learned from them; the head was re-run alone. **So the question "did the cancelled runs hide failures" is still open** (see below).
- I used the wrong commit trailer all session until the rule file was restored.

## Still not covered
- Whether the 22 cancelled CI runs would have passed. Re-running them one at a time on old commits would answer it.
- Live behaviour: nothing since 26 Nov was run on a WordPress site.
- Brand OS docs deleted by a347fe9; Content Web; the RankWeb import-columns commit (7e2bb0d) was reviewed only as a diff.
