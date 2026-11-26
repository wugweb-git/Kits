=== Kits Core ===
Contributors: wugweb
Tags: forms, spam protection, share, analytics, admin
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.3.1
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

* Site check-in (optional, off by default) — when you switch it on in Kits → Tools and give an https address, this site sends a short message once a week to that address: the site address, the WordPress and PHP versions, the update channel, and the name and version of each Wugweb plugin and the Kits theme that is installed. No user, email address or content is sent. The receiver is whatever address you enter; nothing is sent while the address is empty or the switch is off.

The ALTCHA spam guard runs locally (proof of work) and contacts no third-party service.

== Changelog ==

= 1.3.1 =
* "Check again" on Dashboard → Updates now clears the stored update list too, so a new release shows at once. The "Upgrade to Premium" link is gone from the Plugins screen. The setup wizard uses the Kits look.
* Dashboard boxes now use the Kits look (black, white and greys, large figures). The "Scheduled tasks" box appears only once a cron trigger has called in.

= 1.3.0 =

* Optional site check-in (Kits → Tools): off by default; once a week it can send the site address, WordPress and PHP versions and the Wugweb plugin versions to an https address you choose. Nothing is sent until you switch it on and set the address.
* Brand layer: your brand colours and widths now flow into the theme's own settings, so Site Editor "Reset styles" returns to your brand. Reset brand goes back to the preset you chose (or to the theme's values when you never chose one), and "Clear brand" removes everything. Brand settings travel in the settings file, and an imported file is cleaned like the form is.
* The setup wizard applies the chosen colour style to Styles (the old "ink" style is now "dark"; existing sites are mapped over). Fluent Forms upload fields show the chosen file with a Remove button and clearer errors, and an About field is filled with plain text.
* Header & Footer Scripts now also needs the "unfiltered_html" permission. On multisite or where that is switched off, administrators will no longer see the page.

= 1.2.0 =
* Six blocks: Countdown (days left to a date), Metric (a number from the site, shown from a threshold), Share (the share bar), Sticky action (one bar on phones), Letter (a letter built from ticked grounds, opened in Gmail or an email app, or copied) and Sponsored (labelled slots with rel=sponsored). They render on the server; a site gives them data through the filters kits_countdown_date, kits_metric_value and kits_sponsored_items.

= 1.1.0 =
* Menus fold: Kits is one item under Appearance, and each Wugweb plugin is one item under Plugins, opening its first screen with the other screens as tabs. Addresses and capabilities are unchanged.
* Updates from the Wugweb registry for the Wugweb plugins and the Kits theme (direct build only): stable releases by default, a SHA-256 check before install, off with one constant.

= 1.0.0 =
* First release.
