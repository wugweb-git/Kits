# Mistakes audit, 21 to 26 Nov 2026

Source: git history of kits-suite (313 commits), CI run history (100 runs), GitHub releases and PRs. Numbers below were counted from those, not estimated. Cause of each CI failure was read from the failed job.

## Volume
- 313 commits: 21 Nov 1, 22 Nov 28, 23 Nov 10, 24 Nov 20, 25 Nov 112, 26 Nov 142. 37 merge commits. 26 PRs (23 merged, 2 closed, 1 open).
- 308 commits by the owner's account, 5 by Claude. (Authorship does not say who wrote the code.)

## A. Release mistakes (user-visible)
1. **MailWeb 3.3.2 and InsightWeb 1.1.2 shipped held code.** Held code is code PENDING.md says must not load. Checked tag by tag: only 3.3.2 and 1.1.2 loaded it (3.3.0, 3.3.1, 1.1.0, 1.1.1 did not). MailWeb stored full failed-mail bodies (including password resets) in an option; InsightWeb stored 404 paths and visitor search terms. Live from 17:36 until 3.3.3 and 1.1.3 at 17:52 on 26 Nov. Found by audit, not by CI. Fixed.
2. **RankWeb 2.3.0 to 2.3.2: false "Sitemap not answering" notice and hourly email** on any site without Rank Math. Page cache could store WooCommerce cart and checkout pages. Fixed in 2.3.3.
3. **Kits Core dashboard and wizard shipped looking wrong** (1.2.0 to 1.3.1): unstyled boxes, an empty Cron health box, Animal Writes-only alarms on every site. Fixed in 1.3.2 after repeated complaints.
4. **Updater cached the registry 12 hours** and "Check again" did not clear it, so a new release looked missing. Fixed in 1.3.2.
5. **"Upgrade to Premium" link in 7 plugins** (WordPress.org guideline 5 and 11 risk). Removed.
6. **Kits Core 1.3.1 was never released as a tag** (1.3.0 then 1.3.2). The test site runs 1.3.1 by hand. Cosmetic, but the registry history has a gap.
7. **Check-in feature built, receiver not built.** Off by default and harmless, but it is shipped UI with nothing on the other end.

## B. CI and process mistakes
1. **CI was red for 2 days, 22 Nov 19:23 to 24 Nov 16:13: 13 failed runs in a row.** Causes read from the failed jobs: "Shared PHP SDK" TokenEngine and SDK tests failing (22 Nov on PHP 8.0, 23 Nov on PHP 8.3), then Composer lockfile not resolving on PHP 8.0, then the Playground blueprint run failing on an unpinned CLI (24 Nov). Work kept being pushed on top of a red branch.
2. **22 Nov: "revert: undo all plugin compatibility changes"** (ce7cda3), then the same decoupling redone on 23 Nov (6a32c29). The revert touched 9 files (176 lines removed, including `compat-bdp.php` in DirectoryWeb). One day of work thrown away and repeated.
3. **Red again on 26 Nov:** 5be7952 and 5921e83 (PHP 8.0/8.2 test matrix), 4117975 (DirectoryWeb 1.2.1, admin navigation audit), 0959092 (version check: changelog entries missing for bumped versions). Each was fixed by a follow-up commit.
4. **0959092 bumped seven plugins in one commit without changelog entries.** CI caught it. Same class of mistake as releasing 3.3.2 with held code: the release step has no check that held code is not loaded.
5. **16 CI runs were cancelled, never finished** (rapid merges: 25 Nov 12:55, 13:02, 16:52, 18:19 to 19:14, 26 Nov 04:11 to 04:45, and four on 26 Nov afternoon). Those commits have no result of their own. A later run on a newer commit covered them, but a failure in between would have been hidden.
6. **Releases were made while only the head commit was proven.** No check ties a release tag to a green CI run on that exact commit. I did that by hand this time.
7. **Too many changes per day to review.** 112 and 142 commits on 25 and 26 Nov, with a standalone audit only on day 5. The two held-code releases and the RankWeb false alarm all got through because nothing read the shipped zip.
8. **Documentation churn:** about 24 commits are doc corrections ("fix stale names", "correct names, counts and not-built claims"). The docs were wrong often enough to need their own fix cycles.

## C. Product mistakes found by the audit (open, not fixed)
Full list: docs/standalone-audit-2026-11-26.md. Headlines:
1. Five of six plugins show "needs Kits Core" as the admin screen when installed alone (DirectoryWeb 5 of 8 screens, SourceWeb, InsightWeb, MailWeb, PlanWeb). Readmes say "standalone".
2. Animal Writes data and wording ship to every customer (SourceWeb seed and emails, PlanWeb team dates, MailWeb forms and newsletter, DirectoryWeb India and animal wording, RankWeb robots Content-Signal line).
3. MailWeb takes over every `wp_mail`, forces From, caps 90 mails a day, not disclosed.
4. InsightWeb visitor tracking on by default with no switch, not disclosed.
5. SourceWeb ingest routes need only `edit_posts`; AI keys in plain-text options; nothing fetches feeds inside WordPress.
6. External-services lists incomplete in DirectoryWeb, RankWeb, SourceWeb, InsightWeb, MailWeb (WordPress.org rejection reason).
7. `aw_` prefix remains on post types, options, REST and cron names.
8. PlanWeb Calendar landing is an error without Kits Core; compiled JS is stale.

## D. Things I got wrong in this session
1. Said a push rejection "recurs"; the owner corrected it (the cause was the earlier split of work).
2. Spent four days on fixes the owner could not see on the live site, because the test site was not updated after each release. Updates are now through the registry, but test.wugweb.com is still on older plugin versions.
3. Asked the owner for decisions that had a clear default. Now defaults are taken.
4. Hotfix 26beb14 and the audit doc were written after the held-code releases went out, not before. The check should have come first.

## E. Not verified
Plugin Check output for any plugin; real-browser rendering of the fallback screens; live mail, Site Kit and Fluent Forms behaviour; job logs of the other 22 to 24 Nov failures (only the first and last of each kind were read; the rest are inferred from the same job names and the fix commits).

## Suggested fixes to the process (not done)
1. A CI step that fails if a file listed as HOLD in a PENDING.md is required by any loader.
2. A release step that refuses a tag unless CI is green on that exact commit.
3. A CI step that installs each built zip alone and opens each admin screen, failing on "needs Kits Core".
4. Stop running CI with cancel-in-progress on the main branch.
