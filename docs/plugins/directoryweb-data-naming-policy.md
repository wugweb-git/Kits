# DirectoryWeb data naming and the legacy `aw_` names (policy)

**Status (25 Nov 2026):** Code names done; stored data names kept. All `aw_` functions, classes and constants in DirectoryWeb and RankWeb are renamed to `directoryweb_*` / `rankweb_*` (about 740 functions, 12 classes, 3 constants, 9 hooks and scheduled jobs). Saved data names (post types, meta keys, options) are unchanged. The data migration in section 3 is documented, not built, and not scheduled.

## 1. Rule for code (now)

- New functions, hooks, options, REST routes, capabilities and meta use `directoryweb_` or the agreed short form `dw_`. Never `aw_` or `aw-` in new code.
- Already done: `manage_directoryweb`, REST `directoryweb/v1`, `_dw_claim_*` claim meta, `directoryweb_*` helper names, the `dw_evidence_*` store.

## 1a. What is left of `aw` in code (deliberate)

- `plugins/*/includes/legacy-aliases.php`: thin `aw_*` functions (24 in DirectoryWeb, 9 in RankWeb) and `AW_SEO_EXTRAS_DIR`, kept only because Kits Core, MailWeb, SourceWeb and InsightWeb still call them. Nothing inside DirectoryWeb or RankWeb calls them. Delete an alias when its last caller is updated.
- Hooks other plugins listen to or fire: `aw_scf_groups`, `aw_daily`, `aw_claim_before_apply`, `aw_breadcrumb_label`.
- RankWeb's text domain and slug `aw-seo-extras` (renaming changes translation loading and the WordPress.org slug), CSS classes and WP-CLI commands (`aw-`).
- File names such as `class-aw-*.php` in RankWeb.

## 2. Rule for stored data (now): preserve, do not migrate

These keep their names in 1.x, so no existing site loses or has to move data:

- the `aw_listing` and `aw_claim` post types and their slugs and URLs;
- `aw_*` listing meta keys (all read through `directoryweb_meta_prefix()`, which returns `aw_`), terms and options;
- the claim state meta already written under `aw_`.

There is no database migration in 1.1.0. A fresh install that never had Animal Writes data simply starts with these names too; the prefix is an internal storage detail, not branding.

## 3. Migration path (documented, not built)

Only if and when the owner approves it. Every step is reversible until step 6.

1. Add a setting `directoryweb_data_prefix` (default `aw_`). `directoryweb_meta_prefix()` returns it, so every read and write already goes through one function.
2. Dual-read: when the new prefix is chosen, read the new key first and fall back to the old one.
3. Back up (export and DB dump) and run a dry-run command (`wp directoryweb migrate-prefix --dry-run`) that reports key counts, collisions and unknown `aw_*` keys that DirectoryWeb does not own.
4. Copy in batches (old key to new key), never delete in this step. Log counts per key.
5. Verify: counts match, a sample of listings renders identically, REST output is unchanged, claim history intact.
6. Switch the setting to the new prefix. Keep the old keys for one release.
7. Later release: offer a separate, explicit cleanup that deletes the old keys. Post type slugs and URLs (`aw_listing`) are not renamed in this path; renaming a post type is a separate decision because it changes stored `post_type` values.

## 4. Tests required before building it

Unit tests for the prefix function and fallback reads; a Playground run on a seeded site with real `aw_*` data before and after step 5; and a failure test (stop halfway, re-run, no duplicates).

## 5. Not covered

Other plugins (RankWeb, SourceWeb, InsightWeb, MailWeb, PlanWeb) have their own `aw_*` names and follow the same rule, but each needs its own migration plan.
