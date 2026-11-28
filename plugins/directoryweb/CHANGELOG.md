# DirectoryWeb changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 1.5.0

- A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

## 1.4.0

- The India and animal welfare registration fields are out of the plugin and in the site layer (`sites/animalwrites/directoryweb/includes/registrations.php`, deployed alongside DirectoryWeb 1.4.0): AWBI (`aw_awbi_*`), NGO Darpan (`aw_darpan_id`, `aw_darpan_blacklisted_*`, `aw_reg_authority`, `aw_reg_act`, `aw_sectors`), 12A (`aw_reg_12a`), 80G (`aw_reg_80g`) and FCRA (`aw_fcra`). Stored meta keys are unchanged. The plugin keeps `aw_registration`, `aw_reg_type` and `aw_reg_date`.
- Removed from the plugin: those keys from `directoryweb_meta_schema()`, the protected, team-only and date lists in `listing-meta.php`, the AWBI lapse check in the daily re-check, the claim table rows `l_12a`, `l_80g`, `l_darpan`, `l_reg_auth`, `l_reg_act`, `l_fcra`, `l_awbi_*` (`claims-review.php`) and their claim date fields (`standalone-fallback.php`), the 12A/80G/Darpan fields and facts (`listing-profile.php`), the AWBI, 12A, 80G, FCRA and Darpan rows of the Registrations group and the AWBI template-intro test (`listing-template.php`), the 12A/80G/registry pairs of the reading panel (`directoryweb-listings.php`), the labels for them (`labels.php`), and those fields from `acf-json/group_aw_listing_registrations.json` (the plugin group keeps registration, registered as and registration date). `acf-json/group_aw_listing_about.json` and `group_aw_listing_online.json` no longer say "Animals helped", "dogs, cats, cattle, birds" or "Animal shelter".
- Moved to the site layer: `acf-json/group_aw_listing_registrations_in.json` (same field keys), `data/lgd.json` and `data/district-centroids.json`.
- New filters (empty by default): `directoryweb_meta_fields`, `directoryweb_protected_meta_names` (existed), `directoryweb_private_meta_names` (existed), `directoryweb_date_meta_names`, `directoryweb_expiry_meta_names`, `directoryweb_claim_fields` (every reader now calls `directoryweb_claim_fields()` instead of the constant), `directoryweb_claim_date_meta_keys`, `directoryweb_ff_dates`, `directoryweb_listing_fields`, `directoryweb_org_facts`, `directoryweb_listing_registration_rows`, `directoryweb_listing_registration_pairs`, `directoryweb_listing_template_intro_prefixes`, `directoryweb_places_file`, `directoryweb_district_centroids_file`. The default places file is none: the place lists are empty and the Settings row says "No places file".
- Tests: new `tests/no-india-registration-test.php`; `listing-meta-tests.php` (34 keys), `meta-authorization-tests.php` and `labels-tests.php` adjusted; the Animal Writes checks are `sites/animalwrites/directoryweb/tests/registrations-tests.php` (compares the whole schema and claim table with what 1.3.0 had) and `labels-aw-tests.php`.
- Still not neutral, see PENDING.md: the `aw_` meta prefix and `aw_listing` post type, `aw_ngobase_url`, `aw_animals`, `legacy-aliases.php`, the LGD place model in `places.php` (with the Odisha/Jharkhand/Andhra common names), `aw_gov_verified_*`, and Kits Core's own `KITS_FF_DATES`.

## 1.3.0

- DirectoryWeb is a generic directory: all Animal Writes only code is out of the plugin and lives, unchanged, in the site layer `sites/animalwrites/directoryweb/` (not in the plugin zip; deploy it alongside DirectoryWeb 1.3.0).
- Removed from the plugin (moved): `includes/find-help.php`, `directoryweb-find-help.php`, `district-helplines.php`, `directoryweb-helplines.php`, `local-cards.php`, `directoryweb-local-card.php` (Find help, district helplines with 112 and the 1962 unit, the local card and their three blocks), `gov-verified.php` (Verified from government lists), `featured.php` (Featured in), and from `places.php`, `places-admin.php`, `directory.php` and `directory-map.php` the India Post PIN lookup, its AJAX handlers, the nearest-district-by-PIN query and the PIN box.
- Neutral defaults and filters in their place: `directoryweb_type_groups` (replaces the AW_VET_TYPES constant), `directoryweb_services`, `directoryweb_service_type_slugs`, `directoryweb_type_services` (replace DIRECTORYWEB_SERVICES and AW_TYPE_SERVICES), `directoryweb_directory_h1`, `directoryweb_directory_intro`, `directoryweb_archive_place_title`, `directoryweb_claim_copy`, `directoryweb_data_sources` and four more source filters (replace the Animal Writes source list, host list and import list), `directoryweb_geocode_profile` (country, address fields, postal code rules), `directoryweb_postal_code_valid`, `directoryweb_postal_code_input`, `directoryweb_place_box_postal_row`, `directoryweb_search_place_from_code`, `directoryweb_near_from_code`, `directoryweb_near_code_input`, `directoryweb_settings_services`.
- Behaviour without the site layer: the Directory H1 for a place reads "Listings in {place}", the archive title "Directory: {place}", no services list, no type groups, no helpline benefit on /claim/, geocoding adds no country, no PIN search.
- Tests: new `tests/generic-defaults-tests.php`; `labels-tests.php` keeps only the neutral half; the Animal Writes half and the site layer's wiring are in `sites/animalwrites/directoryweb/tests/`.
- Not moved: the stored listing field names `aw_awbi_*`, `aw_darpan_id`, `aw_reg_12a`, `aw_reg_80g`, `aw_fcra` and the claim form rows for them (neutral labels; see PENDING.md).

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
