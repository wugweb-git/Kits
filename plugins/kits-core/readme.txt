=== Kits Core ===
Contributors: wugweb
Tags: forms, spam protection, share, analytics, admin
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

The shared layer for Kits by Wugweb sites: form engine with spam guard, share bar, consent-mode analytics and the Kits admin screens.

== Description ==

Kits Core is the shared layer of Kits by Wugweb sites. The site configures it through `kits_*` filters.

* Form engine: one field dictionary, server-side checks, per-field errors that work without JavaScript, and ALTCHA, a proof-of-work spam guard with no third-party service and no cookies.
* Share bar: a native share sheet where the browser offers one, plus plain links and copy-link, with no third-party scripts or tracking.
* Google Tag Manager and Microsoft Clarity with consent mode v2, denied by default where the law asks for it.
* Preview-only items.
* The Kits admin shell: the screens of every Kits plugin built on WordPress components and DataViews, with lists, settings, empty and error states that look and work the same everywhere.
* The Kits menu: Home, Theme Options, Settings, Tools and Help, with the design system and the registry of every component.
* Content types: seven ready-made presets (portfolio, cards, infographics, case studies, events, people, testimonials) registered with WordPress's own post type and post meta calls, using core categories and tags only. Each is off until switched on in Kits &rarr; Settings &rarr; Content types, so the admin menu shows only the types a site uses. Their fields show in core blocks through the kits/post-field binding; Kits Core prints no structured data of its own.

= Source code =

The JavaScript in `build/` is compiled with `@wordpress/scripts`. Its unminified source is in the `src/` folder of this plugin and is public at https://github.com/wugweb-git/Kits/tree/kits-suite/plugins/kits-core. To rebuild it, run `npm install` and then `npm run build` in that folder.

== Uninstall ==

By default, deleting the plugin deletes nothing — theme options, form settings and saved keys all stay (the publisher records and keyword tables are SourceWeb's and InsightWeb's since 18 Nov 2026), so reinstalling finds everything as it was. Only when you tick Kits &rarr; Settings &rarr; Uninstall &rarr; "Delete this plugin's data when it is deleted" does it remove Kits Core's own options and transients, after first writing a backup to wp-content/uploads/wugweb-backups/ (nothing is deleted if the backup fails). Shared data and anything belonging to another plugin are never touched. Items of the content types are posts: they are never deleted, also when a type is switched off.

== External services ==

Each of these loads only when you turn it on; none runs by default.

* Google Tag Manager / Google Analytics — loaded only when a GTM or GA container is configured (through Site Kit or the site's own settings), under consent mode (denied by default where the law requires it). What is collected is whatever your container is set up to send. Terms: https://marketingplatform.google.com/about/analytics/terms/ — Privacy: https://policies.google.com/privacy
* Microsoft Clarity — loaded only when a Clarity project is configured, under the same consent gate. Terms: https://www.microsoft.com/en-us/legal/terms-of-use — Privacy: https://privacy.microsoft.com/privacystatement
* Update check (direct build only) — WordPress asks the Wugweb registry (https://wugweb-git.github.io/Kits/registry/index.json, GitHub Pages) for newer versions of the Wugweb plugins and theme, at most every 12 hours; no site data is sent. A new version downloads from the project's GitHub releases and is checked against the registry's SHA-256 before it installs. Turn it off with `define( 'KITS_NO_REGISTRY_UPDATES', true );`. Pre-releases are offered only when the channel is set to pre-release. Terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service — Privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

The ALTCHA spam guard runs locally (proof of work) and contacts no third-party service.

== Changelog ==

= 1.1.0 =
* Menus fold: Kits is one item under Appearance, and each Wugweb plugin is one item under Plugins, opening its first screen with the other screens as tabs. Addresses and capabilities are unchanged.
* Updates from the Wugweb registry for the Wugweb plugins and the Kits theme (direct build only): stable releases by default, a SHA-256 check before install, off with one constant.

= 1.0.0 =
* First release.
