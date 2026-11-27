=== DirectoryWeb ===
Contributors: wugweb
Tags: directory, listings, places, claims, map
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.2.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A directory of organisations in WordPress: listings, places, a map, Near me, claims from the organisations and "Find help near you".

== Description ==

DirectoryWeb adds a directory of listings, places and claims to a WordPress site, with its own admin screens, public pages, blocks and REST routes.

= Listings, places and types =

* The listing post type, its fields (eight field groups), types and services.
* States and districts from a bundled list of local government places (the bundled list is of India), with counts and old address redirects. The Indian PIN code lookup is off until a site turns it on (see External services).
* Directory pages for the whole list, a place, and a place and type.
* A map with Near me, and an admin map beside the latitude and longitude fields.
* Coordinates from an address (one request a second) and phone, hours and registration helpers.

= Claims and records =

* Claims from organisations through a built-in claim form (or your Fluent Forms form), reviewed field by field: approve, reject, revoke, re-open. Emails to the claimant and the site owner are optional.
* Claimed and Verified marks (government records) and unverified values.
* The people of an organisation from FluentCRM.

= Find help =

* "Find help near you" on a page, and "Featured in": News, Library, Resources and Press items that mention an organisation.

= For the team =

* DirectoryWeb in the admin menu: Dashboard, Listings, Listing Types, Schema & Fields, Form Integrations, Claims, Import / Export, Settings and Place intros. With Kits Core active (and its build) they use the Kits admin shell. Without it every one of them is a plain WordPress screen: Dashboard, Listings, Settings and Place intros as before, and Listing Types, Schema & Fields, Form Integrations, Import / Export and the Claims list as plain tables and forms. The plain Claims list shows the status tabs and 20 rows a page, without the shell's live filtering; the plain Import / Export takes a file or pasted text instead of a drop box.
* Wording written for an animal welfare site ("Animals helped", "AWBI number", "NGO Darpan ID") is neutral by default ("Who is helped", "Accreditation number", "Registry ID"). To bring the old words back: `add_filter( 'directoryweb_labels', fn( $l ) => array_merge( $l, array( 'animals' => 'Animals helped', 'awbi_number' => 'AWBI number', 'registry_id' => 'NGO Darpan ID' ) ) );` The keys are animals, animals_help, awbi_number, awbi_not_on_list, awbi_code, awbi_recognised, awbi_renewed, awbi_valid and registry_id.
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

* **Postal PIN code lookup (`https://api.postalpincode.in/`, India Post data):** off by default. Only when a site turns it on (`add_filter( 'directoryweb_pin_lookup_enabled', '__return_true' );`), and then when a visitor or an editor enters a 6-digit Indian PIN code to find a district. The PIN code they typed is sent; the answer is kept for a week in a WordPress transient. Service site: [https://www.postalpincode.in/](https://www.postalpincode.in/)
* **OpenStreetMap Nominatim (`https://nominatim.openstreetmap.org/`):** when a listing with an address is saved or its address changes, a background task about a minute later (and the geocode tool) looks up the listing's map position. The address, PIN code or place names are sent, with your site address in the User-Agent header. A contact email is sent only if your site adds one through the `directoryweb_geocode_contact` filter. Usage policy: [https://operations.osmfoundation.org/policies/nominatim/](https://operations.osmfoundation.org/policies/nominatim/). Privacy: [https://osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy)
* **OpenFreeMap map tiles (`https://tiles.openfreemap.org/`):** when a visitor opens the directory map on the public Directory pages, their browser loads the map style, fonts and vector tiles from this host. The visitor's IP address and browser details reach that host, and the map area being viewed is requested. Nothing is sent from your server. Service site: [https://openfreemap.org/](https://openfreemap.org/). Privacy: [https://openfreemap.org/privacy/](https://openfreemap.org/privacy/)
* **OpenStreetMap map tiles (`https://tile.openstreetmap.org/`):** when an editor opens the map beside the latitude and longitude fields of a listing, their browser loads map tile images from this host. The editor's IP address and browser details reach that host. Nothing is sent from your server. Tile usage policy: [https://operations.osmfoundation.org/policies/tiles/](https://operations.osmfoundation.org/policies/tiles/). Privacy: [https://osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy)

Links shown in the admin and on listings to government and other registers (for example awbi.gov.in, ngodarpan.gov.in) are plain links the reader may click; the plugin does not call them.

== Uninstall ==

By default, deleting the plugin removes nothing: listings, places, claims, settings and every option stay, so reinstalling finds everything as it was. Only if the option `directoryweb_delete_data_on_uninstall` is true does uninstall delete DirectoryWeb's own bookkeeping options (`directoryweb_caps`, `directoryweb_rewrite_ver`), its two cached counts and its scheduled count job, after writing a backup to `wp-content/uploads/wugweb-backups/`. It never deletes listings, claims, uploads, users, terms or any post, term or user meta. Deactivating the plugin unschedules the hourly count job and flushes the rewrite rules, and deletes nothing.

== Changelog ==

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
