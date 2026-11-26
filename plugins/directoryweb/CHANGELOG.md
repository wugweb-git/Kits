# DirectoryWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

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
