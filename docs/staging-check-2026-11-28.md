# Staging check and sync, 28 Nov 2026

`staging.animalwrites.in` was checked, then brought up to date with production (`animalwrites.in`) on 28 Nov 2026, at the owner's request. Production was only read. Nothing here includes passwords, tokens or keys.

## Headline

- **SSH works.** Hostinger shared hosting, port 65002, key `~/.ssh/hostinger_aw`, account `u544169507`. Production and staging are on the same account: `~/domains/animalwrites.in/public_html` and `~/domains/staging.animalwrites.in/public_html`. They use separate databases.
- **Before today staging was not a faithful copy.** It was a snapshot from about 11 Nov: 2 of 4 users, the old `animal-writes-core` plugin instead of the Kits plugins, WordPress 7.1.4, and older pages and settings.
- **After today staging matches production in code, themes, plugins, active plugins, users, pages, SCF field groups, layout and plugin settings.** It does not match in content (listings, news, press, metrics, comments, and so on) or in uploads, on purpose.
- **Users now match:** the same 4 logins and roles (`admin`, `Wugweb`, `Wugweb Design Team` as administrators, `ingest` as editor).

## What was done on staging

1. **Backups first.** Files: `~/aw-backups/staging-before-sync-2026-11-28.tgz` (code, without uploads). Database: `~/aw-backups/staging-db-pre-struct-2026-11-28.sql.gz` (full, verified).
2. **Users.** `Wugweb` (ID 4) and `Wugweb Design Team` (ID 3) copied with their roles and password hashes. `ingest` was left as it is: its email domain differs between the sites (production has `@animnalwrites.in`, which looks like a typo).
3. **Code.** WordPress core 7.1.5; `wp-admin`, `wp-includes`, all themes and plugins and the whole `aw_deploy` folder copied from production. Checksums show 0 differing files. `aw_deploy` is on commit `91f354f`, the same as production. Removed from staging: `animal-writes-core`, `aw-seo-extras`, `plugin-check`, `create-block-theme`, `theme-check`, `advanced-custom-fields`, `link-whisper`, `resmushit-image-optimizer`, `scriptless-social-sharing`, `wp-dark-mode`, `dominant-color-images`, and the `uncode` theme.
4. **Active plugins.** The active set is identical to production's: 22 plugins. Seven were switched on (`directoryweb`, `insightweb`, `internal-links`, `mailweb`, `planweb`, `rankweb`, `sourceweb`) and three switched off (`embed-optimizer`, `webp-uploads`, `performance-lab`).
5. **Customisations.** `.htaccess` copied without the redirects that point at the live domain. `ads.txt` and the `pwa-amp-*` files copied, with the host changed to staging. The dead `themes/animal-writes` link removed from staging only.
6. **Database structure, not content.**
   - The plugin's own `wp kits taxonomy-rename run` (`aw_campaign_link` to `kits_campaign_link`, `aw_media_group` to `kits_media_group`).
   - 30 pages, 9 synced patterns, 4 global styles, the navigation, the custom CSS and the 6 SCF field groups with their 126 fields mirrored from production.
   - About 60 layout and plugin settings copied (theme mods, widgets, user roles, Kits and Animal Writes settings, internal-links settings, Rank Math title options).
   - Links to the live domain in those pages now point to staging.
7. **Images the pages show.** 272 files (with resized versions) copied and 41 attachment records added. All 32 images the pages use by ID have a record and a file, the same as on production. Staging's uploads folder is 573 MB.

## Where staging stands now

| | Production | Staging |
|---|---|---|
| WordPress | 7.1.5 | 7.1.5 |
| `aw_deploy` commit | `91f354f` | `91f354f` |
| Active plugins | 22 | 22 (identical) |
| Users | 4 | 4 (identical) |
| Pages | 30 | 30, content identical |
| SCF groups and fields | 6 and 126 | 6 and 126 |
| Database size (without uploads) | 1,651 MB | 729 MB |
| Uploads | 4,473 MB | 573 MB (page images only) |
| Search indexing | on | off (`blog_public` 0) |

## Differences that stay on purpose

- **`wp-config.php`:** staging has its own database and `AW_STAGING`, and it does not have the GitHub dispatch token, the Hostinger mail token or the SMTP constants.
- **`aw-staging-guard.php`:** a must-use plugin on staging only. It blocks all email and all outside requests, keeps search engines out and allows signed-in users only.
- **Cron:** WordPress cron is off. The server job `aw-dispatch-sourcing.sh` runs for production only.
- **`.htaccess`:** without the live-domain redirects.
- **Not copied:** `wp-config.before-smtp-constants.php` (a backup of production's config with its credentials), error logs, cache folders, and the secrets in the database (API tokens, SMTP, OAuth tokens, MailWeb mailboxes, `planweb_feed_key`).

## Not synced, by the owner's decision

- **Content:** staging has about 17 days less. Production has 31,155 posts and staging 24,445 (listings, news, press, legal pages, metrics rows), 3 comments against none, and 6,005 attachments against 4,538. Legal pages (`aw_legal`) are 167 on production and 107 on staging.
- **Uploads:** only the page images were copied.
- **47 database tables** that exist only on production, all from inactive plugins.

## Findings about the old setup

- `docs/staging.md` and `tools/staging/` (`refresh.sh`, `copy-db.sh`, `staging-guard.php`) live in the `wugweb-git/animalwrites` repo, not in this one.
- That doc's status line from 24 Oct (staging runs the deleted `ux-audit` branch, database from 15 Oct) is stale. Staging's `aw_deploy` was cloned on 15 Oct on `ux-audit`, which no longer exists on GitHub, and was moved to a detached commit `5beeac0` on 11 Nov. Its database was refreshed around 11 Nov, not 15 Oct. The doc should be corrected there.
- The hPanel Git setting could not be read from the server.

## Risks and follow-ups

- **The guard is the only thing keeping staging from acting on live services.** The database still holds production's credentials and personal data (FluentCRM, MailWeb). Check the guard file and `AW_STAGING` stay in place after any refresh.
- **Code is newer than the content.** Content is from 11 Nov, code from 28 Nov, so a few layout or data mismatches are possible when testing.
- **`wordpress` is 7 commits ahead of staging's `aw_deploy` and production** (`91f354f` against `04275398`). Production has not received those yet.
- **The Kits repo's new plugin versions and `sites/animalwrites/` site layer** are not deployed on staging or production. Staging runs production's code.
- **Two things I could not explain:** a re-run reported 20 settings as new again after the first run had written them, and `ilj_batch_info` (internal-links runtime state) is missing on staging.

## Undo

- Files: unpack `~/aw-backups/staging-before-sync-2026-11-28.tgz` over `public_html`.
- Database: import `~/aw-backups/staging-db-pre-struct-2026-11-28.sql.gz`.
- Taxonomy rename: `wp kits taxonomy-rename undo`.
