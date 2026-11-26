# DirectoryWeb: Pending & Roadmap

Status as of 25 Nov 2026 on `feat/directoryweb-completion`. Evidence classes: U unit, H headless Playground, B browser, X external. See `docs/audit/acceptance-gates.md` and `docs/audit/master-matrix.md`.

## Active Scope & Responsibilities
- Custom Post Type `aw_listing` (or configurable tenant listing post type).
- Faceted search, filtering, and geolocation queries.
- Directory detail and archive rendering.
- Shelter and veterinary clinic claim listing workflow.
- Schema.org structured data for local organizations and clinics.

---

## Open Tasks & Enhancements

1. **Complete Data Model Decoupling from Animal Writes Core**:
   - ~~Merge remaining listing field definitions and taxonomies from `claude/awcore-directoryweb-7a7567` directly into `DirectoryWeb`.~~ ✅ Done: `listing-meta.php`, `listing-terms.php`, `data-sources.php` load from the plugin; `DIRECTORYWEB_SCF_GROUPS` owns the eight field groups.
   - ~~Remove legacy bridge calls to `animal-writes-core`.~~ ✅ Done: `aw_scf_groups` filter kept as the one documented seam.

2. **Unified Search & Facet System**:
   - ~~Harmonize homepage quick-search bar with `/directory/` faceted filter query engine.~~ ✅ Done (`find-help.php`, `directory.php`).
   - ~~Support URL state persistence for active filters (city, state, emergency care, verified status).~~ ✅ Done (`directory.php`).
   - ✅ `directoryweb/collection-filter` block (24 Nov 2026, `includes/directoryweb-collection-filter.php`) renders the same `directoryweb_directory_filter()` as the `[directoryweb_directory_filter]` shortcode, which stays for existing content. Standalone: needs neither Kits Core nor SCF. `type` attribute is validated against known organisation types. Covered by `tests/collection-filter-tests.php`.

3. **Listing Claim Flow (`docs/cc-master-plan-19-nov.md (not in this repo)`)**:
   - ~~Frontend claim modal with verification document/email submission.~~ ✅ Done (`claim-page.php`, `claims.php`).
   - ~~Admin review queue under `DirectoryWeb > Claims` with Approve/Reject actions.~~ ✅ Done (`claims-review.php`); the new shell screen stays read-only by owner decision (11 Nov 2026).
   - Notification emails: native claims send plain `wp_mail` (claimant on receipt and on every decision, site owner on new claim); gated by the *Claim emails* setting. B: captured with `pre_wp_mail`. **X open:** delivery through a real transport (SMTP/MailWeb) is not testable in Playground.
   - ~~Verified badge assignment upon approval.~~ ✅ Done (`gov-verified.php`, `claim-page.php`).

4. **Directory Performance & Caching**:
   - ✅ Cache expensive facet aggregation counts in transients (`directoryweb_facet_districts`, `directoryweb_facet_types`, `directoryweb_facet_services`) with automatic invalidation on `directoryweb_place_counts_reset` and listing updates.
   - ✅ Ensure zero slow MySQL queries on large directory datasets (7,700+ entries).
   - ✅ Wrapped external site-layer `content/meta.php` require in `tests/listing-meta-tests.php` with `file_exists()` guard to ensure tests pass in decoupled monorepo environments (23 Nov 2026).
   - ✅ Integrated DirectoryWeb test suite into `.github/workflows/ci-suite.yml` path-based PHP matrix (23 Nov 2026).

5. **Phase 2 blocks (plan §1.6)** — ✅ built and loaded 22 Nov 2026:
   - ✅ `directoryweb/fields` (`includes/directoryweb-fields.php`)
   - ✅ `directoryweb/status` (`includes/directoryweb-status.php`)
   - ✅ `directoryweb/people` (`includes/directoryweb-people.php`)
   - ✅ `directoryweb/featured-in` (`includes/directoryweb-featured-in.php`; parse error fixed, `post_type` corrected to `aw_listing`)
   - ✅ `directoryweb/local-card` (`includes/directoryweb-local-card.php`)
   - ✅ `directoryweb/helplines` (`includes/directoryweb-helplines.php`)
   - ✅ `directoryweb/find-help` (`includes/directoryweb-find-help.php`)
   - ✅ `directoryweb/listing-finder` (`includes/directoryweb-listing-finder.php`)
   - ✅ Swapped `single-aw_listing.html` over to `directoryweb/status` and `directoryweb/people`.
   - ✅ Swapped `animal-writes/find-help` pattern over to `directoryweb/find-help` block.

6. **Phase 3 admin (Kits Core shell)** — ✅ built on `wordpress-dev`:
   - ✅ Dashboard, Claims (read-only), Settings screens (`directoryweb-ui.php`, `directoryweb-dashboard.php`)
   - ✅ `directoryweb/v1` routes: `dashboard`, `dashboard/count`, `stats/<tile>`, `claims`, `claims/<id>`, `settings`, `settings/claim-form`, `listings` (`directoryweb-rest.php`)
   - ✅ `manage_directoryweb` capability with grant + fallback (`directoryweb-caps.php`)
   - Open: the §2.4 requests to Kits Core first; the old Claims address 301 redirect.

6a. **Native claims and claim states** (`includes/claim-native.php`, `includes/claim-native-mail.php`, `tests/claim-native-tests.php`, `tests/claim-native-mail-tests.php`):
   - ✅ Standalone claim path with no Fluent Forms; creates the `/claim/` page on activation; the refused form comes back filled in. Core's `kits_ff_form` and a configured Fluent Forms form still win when present.
   - ✅ State machine `pending → approved | rejected | withdrawn`, `approved → revoked`, `rejected/revoked → pending`; illegal moves are HTTP 409 (REST and the decide handler). Approval applies the ticked fields through `directoryweb_claim_apply_field()` and marks the listing verified; revoke removes the mark and sets `aw_needs_reverify`.
   - ✅ Abuse limits: nonce, honeypot, 5 sends/IP/hour, 3 open claims per email, 1 per email per listing.
   - ✅ Decide on the claim edit screen (Approve, Reject, Revoke, Re-open) or `POST directoryweb/v1/claims/<id>/transition`; only `manage_directoryweb`. H: subscriber, editor and anonymous are refused.
   - ✅ Native claims are listed on the Claims screen and in the Kits Core shell (`dw-<id>` rows, detail at `claims/dw-<id>`, states Withdrawn and Revoked labelled); the shell stays read-only by owner decision (11 Nov 2026).
   - ✅ Notification emails (25 Nov 2026): the claimant on receipt and on approved, rejected or revoked; the site owner on a new claim. One sender, `directoryweb_claim_mail()` in `claim-native.php`: obeys the "Claim emails" switch, goes to the Settings notify address (else the older `directoryweb_claim_notify` option, else the admin email), and MailWeb (or any mailer) takes a message over by returning `false` from the `directoryweb_claim_mail` filter. `claim-native-mail.php` keeps the tested message builder and registers no hooks of its own (both would email twice).
   - ✅ Settings (standalone): claim emails on/off, notify address, Fluent Forms form selector only when Fluent Forms is present.
   - Open: Fluent Forms claims use the state table only to refuse illegal moves (they cannot revoke or re-open; no state hooks because form-entry ids collide with post ids; **X**: needs Fluent Forms to test); moving existing Fluent Forms entries onto the state table is a data migration of live claims (OD8); claimant withdraw UI; per-claim email templates and translations.

7. **Deploy**: parent PR to `wordpress-dev` merges through the Deploy check; ship with `tools/kits-ship.sh`.

## Remaining requirements, classified (25 Nov 2026)

| Requirement | Status | Why | What unblocks it |
|---|---|---|---|
| CRM events (claim submitted / approved / rejected) | **Not built, deferred** | No event hook exists in code. The CRM is FluentCRM, so the contract belongs with the shared connector work, which is deferred. | Shared connector decision; then fire `do_action` events from the state machine |
| Default preset (`directoryweb-default`) | **Not built, deferred** | No preset object exists in code. Presets live in Kits Core, which stays optional, so DirectoryWeb must work without one. | Kits Core preset format and the theme work |
| Claim proof upload | **Built 25 Nov 2026** (see "Claim evidence" below) | — | Security review still recommended before release |

The first two do not block standalone DirectoryWeb. They stay out of "done" until built and verified.

## Claim diagnostics, limits and navigation (25 Nov 2026)
- ✅ `directoryweb_claim_diagnostics()`: live claim state on standalone Settings and as a Claims row in the Kits shell Settings payload. Browser rendering of the shell row: **unverified (X)**.
- ✅ Claim limits verified over HTTP (`tools/playground/http-claim-limits.py`). Known limitation, unchanged: the per-email cap matches the exact address, so plus-address variants count separately. Anonymous and logged-in submissions share one handler; Playground cannot separate them (**X**).
- ✅ Navigation audited standalone and with Kits Core (`tools/playground/admin-nav-audit.py`). Fixed: Claims menu entry without Fluent Forms; Dashboard Places links when the place type is absent.

## Claim evidence, Verified-field protection, Fluent Forms claim review (25 Nov 2026)
- ✅ **Evidence store** (`includes/claim-evidence.php`): DirectoryWeb's own private folder `uploads/directoryweb-private/` (deny-all rule, index, random names, no Kits Core folder). The built-in claim form takes proof (PDF/PNG/JPG/WebP, 8 MB), a logo (5 MB) and up to 5 photos; content is checked, images are re-encoded to PNG, a refused file is reported to the claimant and the claim is not stored (nothing is dropped silently). Files are served only to `manage_directoryweb` with a nonce. A logo and photos reach the media library only on approval; the proof never does. Deleting a claim deletes its files. Verified over HTTP in the extracted ZIP: `tools/playground/http-claim-evidence.py` (17 checks). Files are **encrypted at rest** (libsodium secretbox, key from the site salts; `tests/claim-evidence-tests.php`, 15 checks). Verified over HTTP on a server that ignores the deny rule (Playground serves files straight from disk, like nginx with no location block): a direct URL returns only ciphertext, while the authenticated handler returns the real PDF/PNG. **X**: the Apache `.htaccess` and the nginx `location` block (documented in `readme.txt`, FAQ) could not be run here (no nginx, and Playground ignores `.htaccess`), so those two web-server rules are documented but unverified; the encryption is the control that does not depend on them. Changing the site salts makes earlier evidence unreadable.
- ✅ **Fluent Forms (real plugin 6.2.17)**: `tools/playground/http-fluentforms-claim.py` (22 checks): submission through Fluent Forms' own endpoint, entry read, `+91` phone with label, WhatsApp tick and "show my name" consent kept, review screen, approval, double decision refused, Claims screens load without Kits Core. Not in CI (it installs Fluent Forms from wordpress.org).
- ⚠ **Fluent Forms evidence uploads**: the free Fluent Forms has no file-upload field (Fluent Forms Pro element). DirectoryWeb's contract is: fields named `logo`, `photos`, `proof` (filter `directoryweb_claim_ff_file_fields`) whose values are URLs of files the provider saved under the uploads folder; they are copied into the private store when the claim arrives, refused files are listed on the review screen. The real Pro uploader is **unverified (X)**; the test stands in for it with URL values.
- ✅ **F6**: decision fields (Verified mark and dates, re-verify flag, government source, AWBI/Darpan/registry) are writable over REST/editor only by `manage_directoryweb` (`auth_callback`), and a signed-in user without it is refused on every route by a metadata filter (plain `update_post_meta`, Custom Fields box, SCF/ACF forms shown read-only, REST batch, null-delete). Code with no signed-in user (CLI, cron) and claim approval still write them. 64 unit checks (`tests/meta-authorization-tests.php`) plus Playground journey checks. **Public reads**: the team-only keys (`aw_needs_reverify`, `aw_gov_verified_by`, `aw_darpan_blacklisted_by/on`, `aw_reg_authority`, `aw_reg_act`, `aw_sectors`, `aw_awbi_list_on`) are removed from every REST response (single, collection, `_fields`, `_embed`, revisions/autosaves (implemented, untested), the batch endpoint and a response-level scrub) unless the reader has `manage_directoryweb`; regression checks run as anonymous, contributor and manager. Values the listing page itself prints (Verified date, registration date, 12A/80G, Darpan ID, AWBI code) stay public by design. The public directory map and RankWeb FAQ read only derived yes/no values. **Not covered**: files a form provider stored itself (Fluent Forms originals) stay in plaintext in the provider's folder; DirectoryWeb only keeps its own sealed copy. SourceWeb's enrichment screen lists `reg_authority`/`reg_act` for its own admins (a separate plugin, not changed here).
- ✅ **F5**: claim review no longer needs Kits Core or Animal Writes helpers (`tests/claim-review-standalone-tests.php`, 12 checks, plus the real Fluent Forms run). Remaining optional Kits Core compatibility: files an older Kits Core form kept in its private folder are still readable if Kits Core is present.

## Carried over from docs/org (26 Nov 2026)

Open items from the retired plan docs, each checked against the code on 26 Nov. The full old text is in git history (kits-suite `9f81e36` and earlier, `docs/org/`).

- Place intros into Listings › Places: needs a new shell view and a rebuilt `build/index.js` (Place intros is a server-rendered form, `place-intros.php`). It stays its own tab until then.
- Default preset (`directoryweb-default`) and a CRM adapter: `claim-native.php` fires `directoryweb_claim_created` and `directoryweb_claim_transitioned`, but nothing consumes them.
- District pages for helpline titles print no `kit-section-desc`, so an intro would not show (`directory.php:268-275`); confirm on the live site.
- Not verifiable here: Fluent Forms Pro uploader, real mail delivery, SEOPress/AIOSEO coexistence, the old Claims address redirect.

## Naming rule carried over from the retired naming policy (26 Nov 2026)

- Code names are `directoryweb_*` / `DIRECTORYWEB_*`; never `aw_`, `dw_` or `aw-` in new code (WordPress.org wants four or more characters). Thin `aw_*` aliases for Kits Core, MailWeb, SourceWeb and InsightWeb live in `includes/legacy-aliases.php`; delete one when its last caller is updated.
- Stored names are kept, with no migration in 1.x: the `aw_listing` and `aw_claim` post types and their URLs, `aw_*` listing meta (read through `directoryweb_meta_prefix()`), terms, options, the `_dw_claim_*` claim meta and Fluent Forms' `dw_evidence` meta.
- A data-prefix migration is only documented, not built or scheduled: a `directoryweb_data_prefix` setting with dual reads, a dry-run command, batch copy with no deletes, verification, then a switch. It needs the owner's yes, a seeded-site Playground run before and after, and a stop-and-rerun test. Renaming a post type is a separate decision.
- Guards: `plugins/directoryweb/tests/no-short-prefix-test.php`.

## Carried over from the acceptance gates (26 Nov 2026)

- Not verifiable without outside systems (class X): claim email delivery through a real transport; anonymous versus logged-in claim submission over HTTP (Playground answers every request as an administrator; both hooks call one handler); the Kits shell Settings Claims row drawn in a browser (payload checked in PHP only); the Fluent Forms Pro uploader; Apache and nginx deny rules for the private evidence folder (documented, untested).
- CRM events (26 Nov): built. Each native claim change fires `directoryweb_claim_event` and is filed with every active CRM adapter; FluentCRM is built in (transactional contact, one tag for the current state: Claim received, approved, rejected or revoked). Other CRMs and form plugins (WPForms, Fluent Forms, others) attach through the `directoryweb_claim_crm_adapters` filter or the action; none is built because their APIs are untested here. Not tried against a real FluentCRM. Fluent Forms-path claims fire no events (their ids collide with post ids).
- Deferred: the default preset (waits on Kits Core's preset format).
- Open owner decision (OD8): Fluent Forms claims keep their own `aw_c_status` meta and screen; native claims use the state table. Recommendation: leave both, never migrate stored claims, new sites use the native form. Revoke and re-open for Fluent Forms claims are not built.
