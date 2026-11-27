# DirectoryWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 1.2.5

- The rest of the animal welfare and India-specific wording on the listing screens is neutral by default and goes through the `directoryweb_labels` filter: the 12A, 80G and foreign funding (FCRA) labels, the registry and accreditation names in the claim form and the field descriptions (the REST schema), and the Google category example. New label keys: registry_name, accreditor, accreditor_list, accreditor_first_list, tax_12a, tax_12a_help, tax_80g, tax_80g_help, foreign_funding, category_example. Stored keys are unchanged. The Animal Writes site layer restores the exact old words.
- Tests: `tests/labels-tests.php` checks that no default names the animal or India-specific wording and that the Animal Writes layer returns the old words; `listing-meta-tests.php` and `meta-authorization-tests.php` load `labels.php`.

## 1.2.4

- Delete data on uninstall now also removes the three settings options added in 1.2.0 (the field, listing type and form mapping settings). They were left behind before. The backup written before deleting includes them.

## 1.2.3

- Without Kits Core, Listing Types, Schema & Fields, Form Integrations, Import / Export and the Claims list are plain WordPress screens (tables and forms, nonce and capability checked) instead of a "needs Kits Core" notice. The Claims list there has no live filtering; Import / Export takes a file or pasted text. (`includes/standalone-screens.php`)
- Animal welfare and India-specific wording is neutral by default (Who is helped, Accreditation number, Registry ID); the old words come back through the `directoryweb_labels` filter. Stored keys (`aw_animals`, `aw_awbi_*`, `aw_darpan_id`) are unchanged. (`includes/labels.php`)
- Near me accepts any place by default; the India-only limit is the `directoryweb_near_bounds` filter. The Indian PIN code lookup is off until a site returns true from `directoryweb_pin_lookup_enabled`; with it off nothing goes to India Post and the PIN box is hidden.
- Claim references read DW-C-<number> where they read AW-C-<number> (Fluent Forms serial); the setup hint no longer names a `wp aw` command.
- readme: External services lists the map tile hosts and says the scripts are bundled; the uninstall default is documented; the Kits Core claims are exact.
- Deactivating the plugin unschedules the hourly count job.

## 1.2.2

- The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

## 1.2.1

- The WordPress dashboard box is a row of tiles: each number links to its screen and a count to act on says Needs attention (words and icon, not colour alone).

## 1.2.0

- New menu: Dashboard, Listings, Listing Types, Schema & Fields, Form Integrations, Claims, Import / Export, Settings.
- One canonical schema (10 field types, with required, choices, min, max and pattern) and listing types that use it.
- Form Integrations: a form provider contract, a Fluent Forms reader, and a mapping from a form's fields to the schema; a mapped submission arrives as a pending or draft listing.
- Import / Export: the structure (fields, types, mappings) as one file, and listings as CSV (checked like a form submission, dry run by default, formulas escaped, 500 rows).
- Settings: a "Works with" list with a Get it link for each companion plugin.
- A WordPress dashboard box with the stored counts.
- Fixed: the Settings screen read SourceWeb as "Not active" when it was running; a fatal when SourceWeb ran without Kits Core.
- Claims no longer need Fluent Forms: a built-in claim form, a `/claim/` page created on activation, and a claim lifecycle (pending, approved, rejected, withdrawn, revoked) with history. Approving applies the ticked fields and marks the listing verified.
- Claim emails (optional) to the claimant and the site owner.
- New block: Directory filter.
- Settings: claim emails on or off, and who is told about new claims.

## 1.1.0

- The listing's data model moves into this plugin: the 48 listing fields and their rules, the phone and opening-hours lists, the never-publish list, where a listing's details come from, and the daily re-check flags. Same keys and stored values; nothing changes on the site.

## 1.0.0

- The Directory becomes its own plugin. Same pages, data, field groups, blocks, shortcodes and routes; nothing changes on the site.
