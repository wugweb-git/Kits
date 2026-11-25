# DirectoryWeb pre-commit review

Branch `feat/directoryweb-completion` (HEAD `67756d8`, in step with origin). Read-only review of the staged batch:
37 files, +2,108 / −243. Nothing was staged, unstaged, edited, committed or pushed by this review. This file is new
and untracked.

**Status: APPROVE WITH CONDITIONS.** No blocker was found in the staged diff itself. Two conditions are security
hardening of code this batch adds (C1, C2) and should be fixed before the commit. The standalone fatal errors found
(section 4) are older code that this batch does not touch; they need their own fix, outside PR #11.

Evidence kinds are kept apart: **[U]** unit test, **[P]** Playground run on the extracted ZIP, **[S]** static reading,
**[X]** not tested.

## 1. Staged scope

| Check | Result |
|---|---|
| Files | 28 modified, 9 added. All in `plugins/directoryweb`, `plugins/rankweb/includes/redirects.php`, `tools/playground`, `.github/workflows/ci-suite.yml` |
| Unstaged changes | None (`git diff` is empty) |
| Untracked files | Only this review file |
| Secrets / keys / tokens | None found. Pattern matches were the words "secretbox", "salt", "nonce" and the `$token` form-state key |
| Generated artifacts (`dist/`, logs, zips, `node_modules`) | None staged |
| Deletions (243 lines) | Mostly `rankweb/includes/redirects.php` (Animal Writes redirects, intended). The rest are small rewordings and one removed branch in `bootstrap.php` |
| Existing user changes overwritten | None found. The test files edited were edited by this batch only |
| Blueprints | `build-blueprints.py --check` exits 0, so the committed JSON matches the generator [P] |

## 2. REST exposure of the eight team-only keys

Mechanism (`includes/listing-meta.php`): a `rest_prepare_aw_listing` / `_revision` / `_autosave` filter (priority 99)
removes the keys unless `current_user_can( 'manage_directoryweb' )`, and a `rest_post_dispatch` filter removes them from
any nested `meta` object as a second layer. The capability is the same constant in both filters and in the write guard.

| Path | Evidence | Result |
|---|---|---|
| Single read, anonymous and contributor | [P] journey, 67/67 | No leak. Public meta still present |
| Collection read | [P] | No leak |
| `_fields=meta` | [P] | No leak |
| `_embed` | [P] | No leak |
| Contributor reading own listing in edit context | [P] | No leak |
| Batch endpoint (response body) | [P] | No leak |
| Nested `meta` in any response | [U] 64 checks, and one [P] call of the filter | Scrubbed |
| Manager | [P] | Reads all eight |
| Revisions and autosaves | [S] only. The filter is registered; **no test fetches a revision or autosave** | **Untested** |
| XML-RPC custom fields, Custom Fields box | [S] the eight keys are in the write-protected list, so `edit_post_meta` is refused through `auth_callback` | Not exercised |
| Other plugins' REST fields | `grep` found no `register_rest_field` or `rest_prepare` outside this file; InsightWeb hooks `rest_post_dispatch` for its own purpose | None found |
| Public map route, RankWeb FAQ | [S] they read derived yes/no values only (`directory-map.php`, `faq-data.php`) | No raw values |
| **wp-admin editor with Secure Custom Fields / ACF** | [S] `acf-json/group_aw_listing_claimed.json` and `…_registrations.json` define `aw_needs_reverify`, `aw_reg_authority`, `aw_reg_act`, `aw_sectors`. The batch makes them read-only for non-managers but **still renders the stored value** | **Finding S1** |

Public values stay readable: Verified date, registration date (printed as "Incorporated"), 12A/80G, Darpan ID, AWBI
code. Confirmed by reading `listing-template.php`.

`PENDING.md` says revisions and autosaves are covered. That is true of the code, not of the tests. The wording should
say "implemented, untested" until a test exists.

## 3. Evidence encryption

Read from `includes/claim-evidence.php`, not from the tests.

| Property | Finding |
|---|---|
| Cipher | `sodium_crypto_secretbox` (XSalsa20-Poly1305): encrypted and authenticated. A flipped byte is refused [U] |
| Nonce | 24 bytes from `random_bytes`, fresh per file, stored in front of the box [U] |
| Key | `sha256( wp_salt('auth') | wp_salt('secure_auth') | label )`. Sound for high-entropy salts. A plain hash with no HKDF; `hash_hkdf` would be cleaner (S5). If `wp-config` has no salts, WordPress keeps generated ones in the database, so the key then travels with a database backup |
| Plaintext on disk | **Not in the store.** Brief plaintext exists in: PHP's own upload temp file (standard); a re-encoded PNG written to `wp_tempnam()` for about one call, then deleted; a decrypted temp file when a reviewer approves a logo or photo (it is going to the public media library anyway). Originals a form provider saved (Fluent Forms folder) **stay in plaintext** (S3) |
| Logs and errors | Messages carry the label, sizes and limits, never file names or content. Claim history stores those messages [S] |
| Permission and nonce on download | `manage_directoryweb` plus a nonce bound to the file name; headers `nosniff`, a sandbox CSP, images always `image/png`, PDFs as attachment [P] |
| Name validation | Regex `^[a-z0-9]{24}\.(png\|jpg\|webp\|pdf)$`, plus `sanitize_file_name`; traversal and `.php` refused [U][P]. The `$` anchor also accepts one trailing newline (S6, not exploitable here) |
| Salts changed | [U] the file cannot be opened. Behaviour: the handler answers a misleading "File not found"; a logo or photo **silently fails to apply on approval** (S4) |
| Decryption or encryption failure | Download: 404. Store failure: the claim is kept, the failure is written to the claim history [S] |
| Existing unencrypted evidence | None from this batch: the upload feature is new. Older files (Kits Core private folder, the legacy `claims.php` logo store) are unencrypted. The fallback `directoryweb_private_dir()` now gets the deny rule, but those files are not migrated. No migration is needed for the new store |
| Backups | Encrypted files are only as protected as the key. A backup that includes `wp-config.php` includes the salts |

Server rules, assessed separately:

- **Apache `.htaccess`: [X] not tested.** The test only checks that the file's text contains a deny rule. Playground
  ignores `.htaccess`.
- **nginx `location` block: [X] not tested.** No nginx here. The snippet is documented in `readme.txt`.
- **What was tested:** on a server with no rule at all (Playground serves files from disk), a direct URL returns bytes
  beginning `DWE1` and never a PDF or PNG header [P]. That shows encryption works; it does not show either server rule
  works.

## 4. Standalone dependency audit

Method: static scan of every `aw_*`/`kits_*` call that DirectoryWeb does not define, then reading each enclosing
function, plus a **[P] probe** that called the flagged functions in a DirectoryWeb-only site (no Kits Core, no Animal
Writes). The probe was a throw-away script in the scratchpad.

**Confirmed fatal errors [P]:**

- `aw_listing_validity()` → `Call to undefined function kits_date()`
- `aw_claim_head_band()` → `Call to undefined function aw_head_band()`

Neither is in this batch's diff. The claim in `docs/architecture/monorepo-consolidated-roadmap.md` (DirectoryWeb bundles
a `kits_date` fallback) does not match the code: `standalone-fallback.php` defines `directoryweb_date`, not `kits_date`.

| Call | Site | Classification |
|---|---|---|
| `kits_date` | `listing-template.php:94,95` (AWBI "valid until"), `:247` (services stated), `:303` (registration date), `data-sources.php:134` (dated source) | **Genuine standalone fatal risk.** Confirmed at `:94/:95`; same cause at the others [S]. Triggered by data: an AWBI valid date, a registration date, a services date or a dated source. The public-pages crawl passed because its listings had none |
| `kits_icon` | `listing-template.php:339` (Volunteer / Adopt buttons) | **Genuine fatal risk** [S]: `kits_icon` is undefined standalone (the fallback has `directoryweb_icon`). Triggered when a listing has a volunteer or adopt URL. Not executed |
| `aw_head_band`, `aw_item_chip` | `claim-page.php:256,261` in `directoryweb_claim_head_band()` | **Genuine fatal [P], but no caller in this repo** except the back-compat wrapper `aw_claim_head_band()`. Reachable only if an external template calls it. Legacy |
| `aw_campaign_organiser`, `aw_campaign_partner_ids` | `listing-template.php:529,535` | Safely guarded: the enclosing function tests both with `function_exists` |
| `aw_item_more_card` | `listing-template.php:561` | Safely guarded in `aw_block_listing_campaigns` |
| `aw_enrich_progress`, `aw_enrich_table`, `aw_sitemap_unreachable_listings` | dashboard and REST | Safely guarded by `function_exists` in the same function |
| `aw_enrich_install`, `aw_enrich_add_row`, `aw_enrich_snapshot` | `claims-review.php:652` | Safely guarded: reached only when `$on` is true, which requires all three to exist |
| `aw_source_logo` | `data-sources.php` | Defined by DirectoryWeb, not external |
| `aw_is_directory_view`, `aw_request_type` | `district-helplines.php` | Defined by DirectoryWeb (`directory.php`) |
| `aw_hub_page` | `district-helplines.php:108` | False positive: it is inside a comment. The block filter is guarded by `function_exists( 'aw_hub_of_query' )`, so it is inert standalone |
| `aw_type_icon` (`directory-map.php:330`), `kits_ff_ref` (`directoryweb-dashboard.php:382`) | | False positives (comments) |
| `aw_si_url` | `directoryweb-rest.php:269` | Guarded by testing its sibling `aw_si_cap` only. Low risk (same plugin provides both) |
| `kits_shell_app`, `kits_shell_mount`, `kits_use_component_style` | `directoryweb-ui.php`, `listing-terms.php` | Guarded in the enclosing function |

**Remediation proposal (separate PR, not PR #11):**

*Necessary, small, same cause:*
1. Replace the five `kits_date()` calls with `directoryweb_date()` (it already delegates to Kits Core when present).
2. Replace `kits_icon()` at `listing-template.php:339` with `directoryweb_icon()`.
3. Add a regression test that renders each of these paths standalone (a listing with an AWBI valid date, a registration
   date, a services date, a volunteer URL), so the public-pages crawl covers data-dependent branches.

*Optional cleanup:* remove `directoryweb_claim_head_band()` and its `aw_claim_head_band` wrapper (dead in this repo), or
give them a DirectoryWeb-owned head band; guard `aw_si_url`; delete the inert `aw_hub_of_query` filter.

*Why this stays out of PR #11:* none of it is in the diff, and none of it affects the claim, evidence or REST work.
If you want a standalone release soon, the first three items are a blocker for *that release*, not for this commit.

## 5. Fluent Forms and CI

| Check | Result |
|---|---|
| Free-plugin limitation documented | Yes: `readme.txt` FAQ and `PENDING.md` say the free Fluent Forms has no upload field |
| Pro uploader stated as unverified | Yes, in both. The test stands in for Pro with URLs in text fields, and its docstring says so |
| `continue-on-error` implying Pro compatibility | No. The step is named "compatibility canary", runs against free Fluent Forms and never touches Pro. A green step means only "the free plugin's current release still works with this claim path" |
| Playground tests invoked by CI | Yes. `playground-smoke` runs `smoke.py`, then the HTTP checks, the navigation audits and the Fluent Forms canary, from the `kits-suite-packages` artifact built in the same run (`needs: [package-dist]`), so no stale ZIP |
| Failures swallowed | Only the Fluent Forms step is allowed to fail. The others run under the default `bash -e`, so a failing line fails the job |
| PHP tests in CI | All 11 files in `plugins/directoryweb/tests/` are listed (checked file by file), including the four new ones. `claim-evidence-tests.php` and `meta-authorization-tests.php` need libsodium; `setup-php` ships it, **but this is assumed, not confirmed** (X) |
| Workflow structure | **No YAML parser was available** in this environment. A crude check found no tabs and no odd indentation. GitHub is the first real validation |
| Blueprint check job | Passes locally (`--check` exit 0) [P] |
| One CI assumption | Local builds used `build-dist.py` with default arguments; CI uses `--target all --track commercial`. Not run that way here |

## 6. Commit groups

The five proposed groups hold together, but the files overlap, so they cannot be split by file. Hunk-level staging
(`git add -p`) is needed in these files:

| File | Groups that touch it |
|---|---|
| `listing-meta.php` | F3 (the "Verified" label) and F6 (guard, REST hiding) |
| `claim-native.php` | F1/F2 (diagnostics, sources) and evidence (form fields, upload handling, approval) |
| `claims-review.php` | F5 (form id, fallbacks) and evidence (import, review rows) |
| `directoryweb-rest.php` | F2 (status row) and F5/evidence (file links, detail) |
| `standalone-fallback.php` | F1 (native form first) and F5 (phone, social, ticked helpers) |
| `build-blueprints.py`, `ci-suite.yml`, `PENDING.md`, `readme.txt` | several |

**Recommended order**

1. **F3** coupling removal (acf-json, `bootstrap.php`, `directory.php`, find-help, `geocode.php`, the label hunk, RankWeb redirects, the readme wording, `http-generic-behavior.py`, the rankweb blueprint checks).
2. **F1/F2** claim fallback and diagnostics (with `claim-fallback-tests.php` and its CI line).
3. **F6** write protection and read hiding (with `meta-authorization-tests.php` and the journey checks).
4. **F5 + evidence + Fluent Forms** (with the evidence and review tests and HTTP scripts).
5. **Docs and remaining CI** (`PENDING.md`, `readme.txt`, workflow lines not already attached to a group).

Dependencies: group 4 needs the helpers added to `standalone-fallback.php` and the form-id resolver from group 2.
Group 3 is independent. **Put each group's tests in the same commit as its code** rather than all in group 5, so every
commit passes CI on its own. Risk: splitting hunks inside `claim-native.php` and `claims-review.php` is delicate. A
three-commit alternative (F3 / claims + evidence + F5 / F6) needs less hunk splitting if CI-per-commit matters less to you.

## 7. Risk matrix

| ID | Finding | Severity | In this diff? | Needed before commit? |
|---|---|---|---|---|
| S1 | SCF/ACF editor shows team-only values (read-only) to contributors | Medium | Yes (read-hiding claim) | **Yes (C1)**: return `false` from `acf/prepare_field` for the eight keys when the user is not a manager, and test it |
| S2 | Fluent Forms import accepts any URL or path under `uploads/`, not only the form plugin's folder. A claimant-controlled text field can make the server copy an unrelated uploaded image or PDF into the evidence store; an approved logo would then be published | Medium-low | Yes | **Yes (C2)**: restrict to the Fluent Forms upload subfolder and add a refusal test |
| S3 | Provider's original upload stays in plaintext in `uploads/fluentform/` | Low | Yes | No. State it in the docs; optionally remove after import |
| S4 | Salt change makes evidence unreadable; logo/photo apply fails without telling the reviewer; 404 says "File not found" | Low | Yes | Recommended: say "cannot be decrypted" and show it on the review screen |
| S5 | Key from a plain hash of salts, no HKDF/context | Low | Yes | No |
| S6 | Name regex `$` accepts a trailing newline | Low | Yes | Trivial: use `\z` |
| S7 | The write guard lets requests with no signed-in user through (needed for CLI/cron), so any unauthenticated front-end path of another plugin could write these keys | Low | Yes | No; document |
| S8 | No total cap on evidence per claim or per hour; rejected claims keep their files | Low | Yes | No; follow-up |
| S9 | Apache and nginx rules untested | Info | Yes | No: documented as unverified |
| S10 | Revision/autosave hiding untested | Info | Yes | Add a test or soften the wording |
| D1 | `kits_date` undefined standalone: listing page fatal with dated data | **High for a standalone release** | **No** (older code) | No; separate PR |
| D2 | `kits_icon` undefined standalone (volunteer/adopt buttons) | High for a standalone release | No | No; separate PR |
| D3 | `aw_head_band` / `aw_item_chip`, dead in this repo | Low | No | No |
| N1 | New code uses `dw_` for functions and the `DW_EVIDENCE_FIELDS` constant. The architecture docs set a 4-character minimum prefix (`directoryweb_`) and "no `aw_`" in new code | Info | Yes | Confirm. You said `dw_` is acceptable; the docs say otherwise. No new `aw_` names were added by this batch |
| N2 | The docs say legacy `aw_*` keys are preserved and not migrated; your earlier instruction was to document a migration path | Info | n/a | Decide which governs |

## 8. Tests still required

- Revision and autosave REST responses hide the eight keys [P].
- SCF/ACF field hidden (not just read-only) for a contributor, after C1.
- Fluent Forms import refuses a URL outside the form plugin's folder, after C2.
- Salt-change behaviour: reviewer is told, the logo is not silently dropped.
- Standalone render of a listing with dated AWBI/registration/services data and a volunteer URL (for the separate PR).
- CI itself: libsodium present in the PHP matrix, workflow valid, `--target all --track commercial` build.
- Apache and nginx rules on a real server (X).

## 9. Remaining actions before commit approval

1. **C1** hide team-only fields in SCF/ACF forms for non-managers, with a test.
2. **C2** restrict Fluent Forms evidence import to the form plugin's upload folder, with a test.
3. Correct the `PENDING.md` wording on revisions and autosaves, and add the S3 note.
4. Decide naming (N1) and the migration policy (N2).
5. Choose the commit split (five groups with hunk staging, or three).
6. Let CI run on each commit and read the workflow result, because the YAML is unvalidated locally.
7. Open a separate task for D1 and D2 (`kits_date`, `kits_icon`).

## Update 25 Nov 2026 (after C1/C2, docs sweep)

- **C1/C2 done (unstaged until re-stage, now staged):** `kits_date`/`kits_icon` calls in `listing-template.php` and `data-sources.php` use `directoryweb_date`/`directoryweb_icon`; `claim-page.php` uses `directoryweb_head_band()` and guards `aw_item_chip`. Proven by a dated-data MU probe in `http-directoryweb-frontend.py` (calls the functions with Kits Core and Animal Writes absent). These hunks form their own separable commit group.
- **Evidence:** all DirectoryWeb PHP files 0 failed (claim-evidence 15, claim-fallback 8, claim-native 35, claim-review-standalone 12, meta-authorization 64, collection-filter 8, scf-fallback 10, standalone 16, directoryweb-tests 44, listing-meta 2, org-people 16); RankWeb 94 settings checks; Playground journeys 8/8 (directoryweb 69 checks); HTTP/audit scripts 0 failures.
- **Docs:** stale claims fixed, status lines added, 3 duplicate/historical docs removed (`wugweb-monorepo-delivery-architecture.md`, `theme/kits-theme-admin-ui-spec.md`, `wugweb_modular_master_blueprint_audit.md`), broken doc paths in code comments and `pending.md` remapped (comment-only edits, including 4 theme files), new `docs/plugins/directoryweb-data-naming-policy.md` (preserve `aw_` data in 1.x; migration path documented, not built).
- **Still open:** Apache/nginx rules and Fluent Forms Pro uploader untested (X); revisions/autosave hiding untested; CI not run on final commits; `Kits` checkout (branch `feat/theme-fixes`) still holds the old copies of the docs.
