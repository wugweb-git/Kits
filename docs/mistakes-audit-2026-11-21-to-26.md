# Mistakes audit, 21 to 26 Nov 2026

Source: git history of kits-suite (313 commits), CI run history (100 runs), GitHub releases and PRs. Numbers below were counted from those, not estimated. Cause of each CI failure was read from the failed job.

## Volume
- 313 commits: 21 Nov 1, 22 Nov 28, 23 Nov 10, 24 Nov 20, 25 Nov 112, 26 Nov 142. 37 merge commits. 26 PRs (23 merged, 2 closed, 1 open).
- 308 commits by the owner's account, 5 by Claude. (Authorship does not say who wrote the code.)

## A. Release mistakes (user-visible)
1. **MailWeb 3.3.2, InsightWeb 1.1.2 and SourceWeb 0.2.4 shipped held code** (SourceWeb found later, by the new check; see Suggested fixes). Held code is code PENDING.md says must not load. Checked tag by tag: only 3.3.2 and 1.1.2 loaded it (3.3.0, 3.3.1, 1.1.0, 1.1.1 did not). MailWeb stored full failed-mail bodies (including password resets) in an option; InsightWeb stored 404 paths and visitor search terms. Live from 17:36 until 3.3.3 and 1.1.3 at 17:52 on 26 Nov. Found by audit, not by CI. Fixed.
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
6. **(Corrected 26 Nov)** An earlier version of this file said nothing ties a release to green CI. That was wrong: `release-product.yml` already refuses to run unless CI succeeded on that exact commit. The held-code releases passed that gate because the gate does not read the zip.
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
1. DONE 26 Nov: `tools/validate/check-held-code.py`, run in CI and in the release workflow. It immediately found a third held-code release: SourceWeb 0.2.4 loaded the held open-model consent file (two admin-only REST routes, no visible feature). Fixed in SourceWeb 0.2.5.
2. (Already exists in release-product.yml; removed from this list.)
3. A CI step that installs each built zip alone and opens each admin screen, failing on "needs Kits Core".
4. Stop running CI with cancel-in-progress on the main branch.

---

# Second pass, 26 Nov: four independent reviews
Four read-only reviewers covered Kits Core, the theme and release pipeline, the seven live zips, and everything deleted or reverted. Items marked (verified) were re-checked by the lead by reading or running. The rest are the reviewer's reading and are not re-run.

## F1. Shipped releases
1. **SourceWeb 0.2.4 loaded held code** (verified). Fixed in 0.2.5 (committed, not released at time of writing).
2. **PlanWeb 0.3.1 release notes claim a Repeat field "in the Calendar form"** that does not exist (verified: zero "repeat" in `src/index.js` and `build/index.js`). Repeats work only through REST. The readme and CHANGELOG are wrong; the UI was never written.
3. **Held files ship inside the zips** (MailWeb `tenant-profiles.php`, InsightWeb `telemetry-404.php`). Not loaded, but one loader-list edit turns them on, which is how 3.3.2 and 1.1.2 failed. Fix: exclude HOLD files in `build-dist.py`.
4. **Kits Core shell bundle looks older than `src/shell`** (13 strings missing; unconfirmed until rebuilt).
5. Dev files in zips: theme ships `tools/build-tokens.py` and `tokens/` (59 KB); SourceWeb ships ARCHITECTURE.md and WORKERS.md; plugin zips carry WordPress.org banners; MailWeb `vendor/` is 785 files.
6. Theme: `readme.txt` Stable tag 2.2.1 has no 2.2.1 changelog entry (the version check exempts the theme); "Needs WordPress 6.6" contradicts Requires 7.1; Open Font License text for the bundled Inter font is not shipped; changelog says "Inter Tight" but Inter ships. `directoryweb/assets/img/google-maps.png` has no licence note.

## F2. Release pipeline
1. **The registry can serve a prerelease as "latest"** (verified by running against live GitHub): `kits-by-wugweb` shows 2.2.0 from tag `kits-suite-2026.11.25-pre.2`, prerelease, no WordPress.org zip, while source is 2.2.1. Any product whose own release is withdrawn falls back to a stale prerelease. `semver()` ignores `-rc` suffixes.
2. **A release goes public before its assets are checked** (`release.yml:76-98`, `release-product.yml:73-100`). A failed upload leaves a live release with a null download in the registry, and the tag cannot be reused. Fix: create as draft, verify, then publish.
3. **Script injection** in `release.yml` (`${{ inputs.tag }}` interpolated into shell in a `contents: write` job) and in `release-product.yml` (readme title). Needs workflow-dispatch access to exploit.
4. Per-product releases never run `verify-dist.py`; the `-wporg.zip` files are never verified anywhere.
5. Third-party actions pinned by tag only; broad job permissions; dispatch `ref` not restricted; registry sha taken from the same release.

## F3. Kits Core (1.1.0 to 1.3.2)
1. **Every Fluent Forms submission is copied whole into `wp_aw_form_raw` for 180 days** (verified in code), undisclosed, and removed by neither uninstall nor deactivation.
2. **Five test files run nothing and exit 0** (verified): content-bindings, ops, presets, site-ops, taxonomy-rename. CI runs them and shows green. With ABSPATH defined, four pass and content-bindings fatals because the deleted Animal Writes site layer is missing.
3. The setup wizard overwrites the owner's Site Editor styles (`wp_global_styles`) with no backup.
4. Animal Writes behaviour on every site: admin menu items removed (Rank Math, FluentCRM, Link Whisper, Fluent Forms), a daily error-count email, public `aw/v1/deploy-status` and `aw/v1/thumb-dupes` routes.
5. Registry checks send the site address to GitHub Pages (default WordPress User-Agent); "Send once now" works with the switch off, contradicting the readme.
6. Brand colour input accepts text that breaks out of its CSS declaration (admin or imported file only).
7. Uninstall leaves the check-in job, registry cache, update-channel option and several `aw_` cron jobs.

## F4. Deletions and reverts
1. **PENDING says "Resolved" over code that is written but not wired**: PlanWeb calendar views (no caller, no JS, nonce never created); MailWeb, InsightWeb and SourceWeb held code.
2. **Kits Core PENDING is stale the other way:** Layer 3, the wizard option and the Scripts & Pixels capability check are done in code but listed open.
3. **The Animal Writes site layer was deleted on 22 Nov (238fe14: 161 files, about 33,800 lines)**; plugins still reference its content types 330 times; two test files now skip silently; the same commit changed the theme primary colour `#FFBE1A` to `#C6D2E0`. The only copy is git history.
4. **The 22 Nov revert lost features never redone:** MailWeb standing down for FluentSMTP / Post SMTP / WP Mail SMTP, PlanWeb The Events Calendar handling, DirectoryWeb's Business Directory Plugin adapter.
5. About 25 dangling doc paths in 59 files; the specs they cite exist only in git history.
6. The commit-attribution rule file was deleted; the rule exists only in memory notes.
7. The never-rename option and table list is missing from PENDING; preset-font gap not recorded; a RankWeb entry is dated 27 Nov.

## G. Not checked by anyone
Plugin Check output; real browser rendering; live mail, Site Kit and Fluent Forms; the large deleted architecture and roadmap docs (only grepped, not read); whether the Animal Writes site layer survives in another repo; branch protection and secrets settings.

---

# Third pass, 27 Nov: every "done" claim checked against code
Four read-only reviewers checked every claim of completed work since 21 Nov (PENDING marks, changelogs, readme changelogs, commit messages) in all seven plugins: about 190 claims. Each plugin's PENDING.md now begins with a "Verified status, 27 Nov 2026" section that overrides older marks.

## Claimed done, not built (customers or HQ were told it existed)
1. **MailWeb 3.3.0: Status column (New / Read / Replied / Forwarded) in lists.** Not built; the data is stored, no screen reads it. Shipped in readme and changelog for 3.3.0 to 3.3.4. Corrected in 3.3.5.
2. **MailWeb: email logging of real mail, fallback SMTP connection, failure alert webhooks, per-user pause dismiss, resend.** Settings or routes exist, nothing uses them (only test emails are logged). Listed in the 3.3.0 Upgrade Notice and External services. Corrected in 3.3.5.
3. **SourceWeb, marked done 22 Nov: canonical-URL enforcement, author and syndication cards, rate limiting of external fetches.** No code. Auto keyword tagging is partial. Feed retry backoff is dead code and was in the readme. Corrected in 0.2.7 (readme) and PENDING.
4. **PlanWeb, marked done: campaign timeline and author / category / tag filters.** Live only in a file that is not loaded.
5. **DirectoryWeb, PENDING: template swap to status and people blocks; "0 slow MySQL queries on 7,700+ entries".** No code or test in the repo.
6. **MailWeb tenant profiles and retry queue, InsightWeb 404 and search logging, SourceWeb consent gate: marked "Resolved" while held and unloaded.**

## Partial or overstated
- DirectoryWeb neutral wording is incomplete (hard-coded in `listing-meta.php`, `claims-review.php`, `listing-profile.php`).
- InsightWeb neutral wording incomplete (`links-seed.php`, `keyword-model.php`).
- RankWeb `/news-sitemap.xml` answered on any Rank Math site (fixed in 2.3.5); the readme 2.2.0 entry lists fewer sources than CHANGELOG.md; 2.3.1 has no entry.
- Kits Core 1.3.3 changelog says "four" options (five) and "five tests print a count" (three do not); "only place products promote each other" is wrong; no 1.3.1 entry.

## No tests exist for (all new in 1.3.3 to 3.3.4)
Kits Core form copy, wizard backup, uninstall and carry-over; DirectoryWeb 1.2.3 standalone screens (about 660 lines); SourceWeb 0.2.6 (capability, publishing, Animal Writes switch, masked keys); InsightWeb 1.1.4 native screens and tracking switch; MailWeb 3.3.4 cron, uninstall and screens; PlanWeb job cron and the Animal Writes switch; RankWeb robots extras, uninstall and page-cache exclusion.

## Credit where it held up
All 0.2.6 SourceWeb behaviour, InsightWeb 1.1.x, Kits Core blocks, registry updates and check-in, all PlanWeb 0.3.x jobs and 0.3.2 fixes, RankWeb 2.2.0 to 2.3.4 features (29 settings traced, none dead), and most DirectoryWeb 1.2.0 features (claim flow, schema, CSV, evidence store) were found in code.
