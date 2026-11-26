=== DirectoryWeb ===
Contributors: wugweb
Tags: directory, listings, places, claims, map
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.2.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A directory of organisations in WordPress: listings, places, a map, Near me, claims from the organisations and "Find help near you".

== Description ==

DirectoryWeb adds a directory of listings, places and claims to a WordPress site, with its own admin screens, public pages, blocks and REST routes.

= Listings, places and types =

* The listing post type, its fields (eight field groups), types and services.
* States and districts from a bundled list of local government places, with counts, PIN code lookup and old address redirects.
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

* DirectoryWeb in the admin menu: Dashboard, Claims, Settings and Place intros. With Kits Core active they use the Kits admin shell; without it they are plain WordPress screens.
* A "Directory filter" block (`directoryweb/collection-filter`) that puts the directory's filters on any page.

= Works with =

* Kits Core (optional: gives the admin the Kits shell, list tables, icons and dates; DirectoryWeb runs without it).
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

DirectoryWeb calls two outside services, only for the tasks below. Nothing is sent when you do not use these features.

* **Postal PIN code lookup (`https://api.postalpincode.in/`):** when a visitor or an editor enters a 6-digit Indian PIN code to find a district. The PIN code they typed is sent; the answer is kept for a while in a WordPress transient. Service site: [https://www.postalpincode.in/](https://www.postalpincode.in/)
* **OpenStreetMap Nominatim (`https://nominatim.openstreetmap.org/`):** when a listing with an address is saved or its address changes, a background task about a minute later (and the geocode tool) looks up the listing's map position. The address, PIN code or place names are sent, with your site address in the User-Agent header. A contact email is sent only if your site adds one through the `directoryweb_geocode_contact` filter. Usage policy: [https://operations.osmfoundation.org/policies/nominatim/](https://operations.osmfoundation.org/policies/nominatim/). Privacy: [https://osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy)

== Changelog ==

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
