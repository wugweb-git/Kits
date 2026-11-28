=== DirectoryWeb ===
Contributors: wugweb
Tags: directory, listings, places, claims, map
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.5.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A directory of organisations in WordPress: listings, places, a map, Near me and claims from the organisations.

== Description ==

DirectoryWeb adds a directory of listings, places and claims to a WordPress site, with its own admin screens, public pages, blocks and REST routes.

= Listings, places and types =

* The listing post type, its fields (eight field groups), types and services.
* States and districts from a places file your site supplies (the plugin ships none; a site can use a local government directory's export), with counts and old address redirects.
* Directory pages for the whole list, a place, and a place and type.
* A map with Near me, and an admin map beside the latitude and longitude fields.
* Coordinates from an address (one request a second) and phone, hours and registration helpers.

= Claims and records =

* Claims from organisations through a built-in claim form (or your Fluent Forms form), reviewed field by field: approve, reject, revoke, re-open. Emails to the claimant and the site owner are optional.
* Claimed and Verified marks (government records) and unverified values.
* The people of an organisation from FluentCRM.

= For the team =

* DirectoryWeb in the admin menu: Dashboard, Listings, Listing Types, Schema & Fields, Form Integrations, Claims, Import / Export, Settings and Place intros. With Kits Core active (and its build) they use the Kits admin shell. Without it every one of them is a plain WordPress screen: Dashboard, Listings, Settings and Place intros as before, and Listing Types, Schema & Fields, Form Integrations, Import / Export and the Claims list as plain tables and forms. The plain Claims list shows the status tabs and 20 rows a page, without the shell's live filtering; the plain Import / Export takes a file or pasted text instead of a drop box.
* Wording that was written for one site is neutral by default and goes through filters: `directoryweb_labels` (field and registration labels), `directoryweb_directory_h1`, `directoryweb_directory_intro` and `directoryweb_archive_place_title` (Directory titles), `directoryweb_claim_copy` (the /claim/ wording), `directoryweb_services`, `directoryweb_service_type_slugs` and `directoryweb_type_services` (the services a listing can offer; none by default), `directoryweb_type_groups` (types shown as one choice), the data source filters (`directoryweb_data_sources`, `directoryweb_listing_source_slugs`, `directoryweb_listing_source`, `directoryweb_source_hosts`), and `directoryweb_geocode_profile` (country, address fields and postal code rules for geocoding: none by default).
* Near me accepts any place on Earth by default; narrow it with the `directoryweb_near_bounds` filter (array of min latitude, max latitude, min longitude, max longitude).
* A "Directory filter" block (`directoryweb/collection-filter`) that puts the directory's filters on any page.

= Works with =

* Kits Core (optional: gives the admin the Kits shell, list tables, icons and dates). Without Kits Core the admin screens are plain WordPress ones, as described above; no DirectoryWeb screen is blocked.
* RankWeb and SourceWeb (optional companions: RankWeb reads the Directory for titles, schema and the sitemap; SourceWeb adds listings and keeps the change log).

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/directoryweb. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Installation ==

1. Activate DirectoryWeb under Plugins. It creates a Claim page and owns the Directory's rewrite rules and capability.
2. Optional: activate Kits Core for the Kits admin shell.
3. Under DirectoryWeb → Settings, choose whether claim emails are sent and where new-claim emails go.

== Frequently Asked Questions ==

= Where are claim files kept, and how are they protected? =

Proof documents, logos and photos sent with a claim are stored in `wp-content/uploads/directoryweb-private/` under random names, and only a DirectoryWeb manager can open them (through the Claims screen, with a nonce). The files are also encrypted on disk with a key derived from your site's secret salts in `wp-config.php`, so a web server that serves the folder directly still returns unreadable bytes. Keep your salts: if you change them, earlier claim files can no longer be opened. Back up the folder with your uploads.

Still block the folder at the web server, so it is never listed or probed.

Apache: the plugin writes `.htaccess` (deny all) and an empty `index.php` into the folder. Nothing to do, unless your host ignores `.htaccess` (`AllowOverride None`): then add to your site configuration:

`<Directory "/path/to/wp-content/uploads/directoryweb-private"> Require all denied </Directory>`

nginx ignores `.htaccess`. Add this inside your `server { }` block, before the PHP location, and reload nginx:

`location ^~ /wp-content/uploads/directoryweb-private/ { deny all; return 403; }`

Test it: open `https://your-site/wp-content/uploads/directoryweb-private/index.php`. It should answer 403 (or 404), not a blank page.

= Which form plugins work for claims? =

With no form plugin the plugin shows its own claim form, which also accepts the proof, logo and photos. If Fluent Forms is active and you choose a claim form, that form is used. Fluent Forms' free version has no file-upload field, so uploads with Fluent Forms need its Pro upload field; this plugin copies the files that field saves into its own protected folder. That Pro path has not been tested with the real Pro uploader.

== External services ==

DirectoryWeb calls the outside services below, only for the tasks named. Nothing is sent when you do not use these features. The plugin makes no other outside request: its scripts (MapLibre GL and Leaflet) are served from the plugin folder, not from a CDN.

* **OpenStreetMap Nominatim (`https://nominatim.openstreetmap.org/`):** when a listing with an address is saved or its address changes, a background task about a minute later (and the geocode tool) looks up the listing's map position. The address, postal code or place names are sent, with your site address in the User-Agent header. A contact email is sent only if your site adds one through the `directoryweb_geocode_contact` filter. Usage policy: [https://operations.osmfoundation.org/policies/nominatim/](https://operations.osmfoundation.org/policies/nominatim/). Privacy: [https://osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy)
* **OpenFreeMap map tiles (`https://tiles.openfreemap.org/`):** when a visitor opens the directory map on the public Directory pages, their browser loads the map style, fonts and vector tiles from this host. The visitor's IP address and browser details reach that host, and the map area being viewed is requested. Nothing is sent from your server. Service site: [https://openfreemap.org/](https://openfreemap.org/). Privacy: [https://openfreemap.org/privacy/](https://openfreemap.org/privacy/)
* **OpenStreetMap map tiles (`https://tile.openstreetmap.org/`):** when an editor opens the map beside the latitude and longitude fields of a listing, their browser loads map tile images from this host. The editor's IP address and browser details reach that host. Nothing is sent from your server. Tile usage policy: [https://operations.osmfoundation.org/policies/tiles/](https://operations.osmfoundation.org/policies/tiles/). Privacy: [https://osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy)

Links shown in the admin and on listings to registers a site configures are plain links the reader may click; the plugin does not call them.
* **More from Kits install (direct build only, only when you click Install):** the "More from Kits" page makes no request when it is viewed. When an administrator clicks Install, WordPress fetches the Wugweb registry (`https://wugweb-git.github.io/Kits/registry/index.json`, GitHub Pages) and then downloads that plugin's zip from the project's GitHub releases (`https://github.com/wugweb-git/Kits/releases/`), checked against the registry's SHA-256 before it installs. No site data is sent. This page is not in the WordPress.org build. Turn the Install button off with `define( 'KITS_NO_PLUGIN_INSTALLS', true );`. Terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service. Privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

== Uninstall ==

By default, deleting the plugin removes nothing: listings, places, claims, settings and every option stay, so reinstalling finds everything as it was. Only if the option `directoryweb_delete_data_on_uninstall` is true does uninstall delete DirectoryWeb's own bookkeeping options (`directoryweb_caps`, `directoryweb_rewrite_ver`), its two cached counts and its scheduled count job, after writing a backup to `wp-content/uploads/wugweb-backups/`. It never deletes listings, claims, uploads, users, terms or any post, term or user meta. Deactivating the plugin unschedules the hourly count job and flushes the rewrite rules, and deletes nothing.

== Screenshots ==

1. The Dashboard, with counts of published and unpublished listings, waiting claims and claimed listings, and three small charts.
2. The Listings screen, a table of eight demo listings with status filters, search and a view and edit link for each row.
3. Settings, Connected services: the place source, geocoder, map tiles, claim form, FluentCRM and the other plugins DirectoryWeb works with.
4. The Claims list, showing claims sent through the claim form with status filters, claimant, contact and number of fields changed.
5. Schema & Fields: every field a listing can hold, with its label, key, type and whether it is required.

== Changelog ==

= 1.5.2 =
* Claims: no stray "0" above the list; older claim status keys map to approved, rejected or pending. Listings rows have View profile and Edit listing links named for the listing. The More from Kits link of a plugin goes to Kits Core's page when Core is active.

= 1.5.1 =
* The Plugins screen now shows Version, By, View details (Description, Installation, FAQ, Changelog, Screenshots, Reviews), Getting Started and Documentation for this plugin, and the plugin carries its screenshots. The More from Kits page registers after the plugin's own menu and a deep link goes to Kits Core's page when Core is active. Keys copy points to Settings.

= 1.5.0 =
* A new More from Kits page lists the other Wugweb plugins with their release version and lets an administrator install and activate one (direct build only; nothing is requested until Install is clicked; the download is checked against its SHA-256; not in the WordPress.org build).

= 1.4.0 =
* The India and animal welfare registration fields are out of the plugin: AWBI recognition (code, dates, the lapsed mark), NGO Darpan (ID, blacklist, authority, Act, sectors), 12A, 80G and FCRA, with their words, their claim form rows, their rows on the listing page and in the admin list, their editor field group and the daily check of the "valid until" date. The stored meta keys (`aw_awbi_*`, `aw_darpan_*`, `aw_reg_12a`, `aw_reg_80g`, `aw_fcra`, `aw_reg_authority`, `aw_reg_act`, `aw_sectors`) are unchanged: a site that had them keeps its data and puts the fields back with the filters below. The plugin keeps one neutral registration number, registration type and registration date.
* New filters, all with an empty default: `directoryweb_meta_fields` (add listing fields), `directoryweb_protected_meta_names`, `directoryweb_private_meta_names`, `directoryweb_date_meta_names`, `directoryweb_expiry_meta_names` (a date that, once passed, flags the listing for re-checking), `directoryweb_claim_fields` (claim form rows; the table is read through `directoryweb_claim_fields()`), `directoryweb_claim_date_meta_keys`, `directoryweb_ff_dates`, `directoryweb_listing_fields` (the profile box), `directoryweb_org_facts`, `directoryweb_listing_registration_rows` (the Registrations group on the listing page), `directoryweb_listing_registration_pairs` (the admin reading panel) and `directoryweb_listing_template_intro_prefixes`. Any tenant can also define its own fields in Schema & Fields.
* The places file (`data/lgd.json`) and the district centres file (`data/district-centroids.json`) are no longer shipped. A site gives its own with the `directoryweb_places_file` and `directoryweb_district_centroids_file` filters; with none, the place lists are empty and the Place source row says "No places file".
* The default wording is shorter: the labels for AWBI, accreditation, registry, 12A, 80G and foreign funding are gone from `directoryweb_labels` (keys animals, animals_help and category_example remain). The field groups no longer name animals or an example of an animal shelter.
* Tests: new `tests/no-india-registration-test.php` (none of these names in the runtime code or a bundled data file); `meta-authorization-tests.php` checks that a site's own protected, team-only and date fields work through the filters; the Animal Writes half is in `sites/animalwrites/directoryweb/tests/registrations-tests.php`.

= 1.3.0 =
* DirectoryWeb is a generic directory: everything that was only for the Animal Writes site is removed from the plugin and moved, unchanged, to that site's own layer (`sites/animalwrites/directoryweb/`, not part of this plugin; it must be deployed alongside DirectoryWeb 1.3.0). Removed from the plugin: the Find help block and its links on item and campaign pages with place detection in News, Library and guides, the district helpline cards and row (112, the 1962 Mobile Veterinary Unit card), the small-district local card, the three blocks `directoryweb/find-help`, `directoryweb/helplines` and `directoryweb/local-card`, Verified from government lists (and its `wp aw gov-verify` command), the Featured in lists, the Indian PIN code lookup (India Post), the veterinary one-choice type filter and the fixed animal welfare services list.
* New neutral defaults with filters for what a site used to get from that code: type groups (`directoryweb_type_groups`), services (`directoryweb_services`), Directory title and intro (`directoryweb_directory_h1`, `directoryweb_directory_intro`), the /claim/ wording (`directoryweb_claim_copy`), the data sources, and geocoding (`directoryweb_geocode_profile`: no country is added to an address unless the site says so). A postal code field is stored as any 2 to 12 letters, digits, spaces or hyphens (`directoryweb_postal_code_valid` narrows it). Without the site layer, a Directory place page reads "Listings in {place}" and the Settings screen has no PIN row.
* Search by postal code and the Near me postal code box are off until a site answers `directoryweb_search_place_from_code`, `directoryweb_near_from_code` and `directoryweb_near_code_input`.
* Still in the plugin by design, with neutral labels: the listing field names that began as the Animal Writes records (`aw_awbi_*`, `aw_darpan_id`, `aw_reg_12a`, `aw_reg_80g`, `aw_fcra`) and their claim form rows. They are stored keys and the schema reads them; they are not shown with any site's wording unless the site gives it.
* Tests: `tests/generic-defaults-tests.php` (the moved files are gone, no Animal Writes token in the runtime code, neutral defaults); the Animal Writes tests moved to `sites/animalwrites/directoryweb/tests/`.

= 1.2.5 =
* The rest of the animal welfare and India-specific wording on the listing screens is neutral by default and goes through the `directoryweb_labels` filter: the 12A, 80G and foreign funding (FCRA) labels, the registry and accreditation names in the claim form and the field descriptions (the REST schema), and the Google category example. New label keys: registry_name, accreditor, accreditor_list, accreditor_first_list, tax_12a, tax_12a_help, tax_80g, tax_80g_help, foreign_funding, category_example. Stored keys are unchanged. The Animal Writes site layer restores the exact old words.

= 1.2.4 =
* Delete data on uninstall now also removes the three settings options added in 1.2.0 (the field, listing type and form mapping settings). They were left behind before. The backup written before deleting includes them.

= 1.2.3 =
* Without Kits Core, Listing Types, Schema & Fields, Form Integrations, Import / Export and the Claims list are plain WordPress screens (tables and forms, with a nonce and a capability check) instead of a "needs Kits Core" notice. The Claims list there has no live filtering; Import / Export takes a file or pasted text.
* Animal welfare and India-specific wording is neutral by default (Who is helped, Accreditation number, Registry ID); the old words come back through the `directoryweb_labels` filter.
* Near me accepts any place by default (the India-only limit is now the `directoryweb_near_bounds` filter), and the Indian PIN code lookup is off until a site turns it on with the `directoryweb_pin_lookup_enabled` filter. With it off, no PIN code is sent to India Post and the PIN box is not shown.
* Claim references read DW-C-<number> where they read AW-C-<number>; the setup hint no longer names a `wp aw` command.
* External services lists the map tile hosts (tiles.openfreemap.org, tile.openstreetmap.org); the uninstall default is documented.
* Deactivating the plugin unschedules the hourly count job.

= 1.2.2 =
* The "Upgrade to Premium" link is gone from the Plugins screen (there is no premium product).

= 1.2.1 =
* The WordPress dashboard box is a row of tiles: each number links to its screen and a count to act on says Needs attention.

= 1.2.0 =
* New menu: Dashboard, Listings, Listing Types, Schema & Fields, Form Integrations, Claims, Import / Export, Settings.
* One canonical schema (10 field types, with required, choices, min, max and pattern) and listing types that use it.
* Form Integrations: a form provider contract, a Fluent Forms reader, and a mapping from a form's fields to the schema; a mapped submission arrives as a pending or draft listing.
* Import / Export: the structure (fields, types, mappings) as one file, and listings as CSV (checked like a form submission, dry run by default, formulas escaped, 500 rows).
* Settings: a "Works with" list with a Get it link for each companion plugin.
* A WordPress dashboard box with the stored counts.
* Fixed: the Settings screen read SourceWeb as "Not active" when it was running; a fatal when SourceWeb ran without Kits Core.
* Claims no longer need Fluent Forms: a built-in claim form, a `/claim/` page created on activation, and a claim lifecycle (pending, approved, rejected, withdrawn, revoked) with history. Approving applies the ticked fields and marks the listing verified.
* Claim emails (optional) to the claimant and the site owner.
* New block: Directory filter.
* Settings: claim emails on or off, and who is told about new claims.

= 1.1.0 =
* The listing's data model moves into this plugin: the 48 listing fields and their rules, the phone and opening-hours lists, the never-publish list, where a listing's details come from, and the daily re-check flags. Same keys and stored values; nothing changes on the site.

= 1.0.0 =
* The Directory becomes its own plugin. Same pages, data, field groups, blocks, shortcodes and routes; nothing changes on the site.

== Upgrade Notice ==

= 1.1.0 =
The listing fields are registered by DirectoryWeb now; no change on the site.

= 1.0.0 =
First release as its own plugin; no change on the site.
