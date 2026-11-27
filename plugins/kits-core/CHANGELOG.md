# Kits Core changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 1.4.0

- Site-only code removed from the plugin (owner decision, 27 Nov 2026: Kits Core runs on other tenants). Moved unchanged to `sites/animalwrites/kits-core/` (not in the plugin zip): `includes/campaign-letters.php`, `campaign-links.php`, `taxonomy-rename.php`, `thumbs.php`, `category-images.php`, `card-images.php`, `forms/campaign-form.php` (raw copy of every send, Form copies settings), `forms/volunteers.php`, `forms/reports.php`, `forms/form-pages.php`, `forms/compat.php`, `ops/retention.php`, `ops/compat.php`, `tools/media-reuse.php` and its plan, the duplicate-file groups for Media → Duplicate files, `assets/site/` (500 and 503 drop-ins, 404 pictures), `assets/js/sponsored-blocks.js`, the older `aw_` names of the backup and error page functions, the one-time 1.3.3 carry-over (`kits_aw_carryover_done`), and the first-backup-choice evidence (`aw_backup_last`). Option names, meta keys, hooks, REST routes and slugs were not renamed. The moved files load as a must-use plugin through `kits-core-site.php`, which does nothing before Kits Core 1.4.0 is loaded.
- `KITS_FF_DATES` is now just `l_reg_date`; the AWBI claim-date fields come from the site layer through DirectoryWeb's `directoryweb_ff_dates` filter.
- New filters carry the site's values, with neutral defaults: `kits_error_pages_dir`, `kits_error_page_marker`, `kits_error_picture_source`, `kits_ff_ref_prefixes`, `kits_ff_file_capability`, `kits_media_group_for`, `kits_media_merge_groups`, `kits_media_merge_meta_keys`, `kits_media_merge_known_keys`, `kits_daily_backup_first_choice`, `kits_edit_screen_own_plugins`, `kits_edit_screen_own_folders`, `kits_overview_pattern_categories`. Uninstall and deactivation call `kits_core_uninstall_options`, `kits_core_uninstall`, `kits_core_uninstall_data` and `kits_core_deactivated`, so a site layer cleans up its own data.
- Changed defaults (a site layer restores the old values): form references `FF-`, `FF-V-`, `FF-C-`, `FF-R-` (were `AW-…`); `KITS_ERROR_PAGE_MARKER` is `Kits error page` (constant name kept; the live marker `Animal Writes error page` comes back through `kits_error_page_marker`, so installed drop-ins stay recognised); Media group rules lose the listing, Library, press and campaign photo rules (generic rules stay, the filter adds more); the private claim file link needs `manage_options` unless `kits_ff_file_capability` says otherwise; the Overview screen slug `animal-writes` is now `kits-overview` and its old-address redirect is the site layer's; the volunteer block no longer counts as a page with a form unless the site layer adds it; `#aw_cl_widget` is out of the Dashboard cards CSS (the site layer carries its own).
- Wording: comments and notes that named Animal Writes Core, Animal Writes' server paths, repository and hashtag are neutral or gone; the Issuer short names help no longer uses AWBI as its example.
- Kept, on purpose: `KITS_FF_DATES` keeps the stored Fluent Forms field names `l_awbi_rec`, `l_awbi_ren`, `l_awbi_valid` (DirectoryWeb reads the constant; renaming breaks existing claim forms); the opt-in Library "Dated" and campaign Metrics edit fields and `kits_campaign_post_type` hooks (inert unless a site names those types); `aw_` options, cron hooks, routes and the `aw-` screen slugs that generic features use (`aw_daily`, `aw_backup_last`, `aw/v1/backup`, `aw/v1/deploy-status`, `aw_error_pages`, `aw-cdn` …).
- Tests: `tests/neutral-core-tests.php` is new and fails if Animal Writes wording or the moved files come back; `ops-tests.php` and `site-ops-tests.php` test the neutral defaults; the AW-specific checks moved to `sites/animalwrites/kits-core/tests/` (`site-layer-tests.php`, `site-ops-tests.php`, `taxonomy-rename-tests.php`).

## 1.3.4

- Neutral installs: the newsletter thank-you, the campaign consent line, the SQL backup header, the Fluent Forms placeholder and the "Animal Writes (plugin)" origin label now use get_bloginfo( 'name' ), so Animal Writes reads exactly as before. The Default brand preset is named "Default (Neutral Kits)"; its key is unchanged. AW_CL_OPTIN (unused) became kits_cl_optin_text().
- Accessibility: Brand Tokens colour pickers get an aria-label, the "(Default: #…)" hint is #50575e (was 2.56:1), and the screen prints once per request. Kits Settings save buttons go through kits_submit_button() (aria-label, unique id instead of the repeated "submit"), and the Backup, Uninstall, Content types and Forms emails checkboxes get a label. Shell calendar "Today" when disabled is #646970 at full opacity (was 3.03:1); build/shell rebuilt.
- Left as they are: the error-page marker "Animal Writes error page" (installed drop-ins are recognised by it), the drop-in HTML in assets/site/dropins/ (site layer, WordPress not loaded), the media-title pattern for existing "Animal Writes campaign photo" titles, and the map plugin name "Animal Writes core".

## 1.3.3

- Form copy (wp_aw_form_raw) is off by default, with a Kits → Settings → Form copies screen: retention (default 30 days), "Delete stored copies" (nonce, manage_options), and fields named pass, card, cvv, ssn or token are never stored. readme.txt lists what is stored. Sites with the table keep the rows but copy nothing new until it is switched on.
- Setup wizard: one-level backup of Styles (option kits_global_styles_backup) with a Restore button; "Kits Default" needs a confirmation before it clears Styles.
- Off unless enabled (option or filter): admin tidy (kits_tidy_menus), daily error-count e-mail (kits_error_count_daily), aw_daily (kits_daily_event). aw/v1/deploy-status and aw/v1/thumb-dupes need manage_options unless kits_public_gate_routes is on. One-time carry-over turns all four on where aw_error_count_daily is already booked.
- Registry and theme-update requests send the User-Agent Kits-registry/1. Deactivation unschedules aw_daily, aw_error_count_daily, aw_daily_backup, aw_raw_prune; uninstall also removes kits_active_style_variation, kits_update_channel, the kits_registry transient, the form copy table and kits_checkin_weekly. Brand colour values containing { } ; < > are rejected.
- Tests: content-bindings, ops, presets, site-ops and taxonomy-rename ran nothing before (an ABSPATH guard exited 0); they now run, and print a check count.

## 1.3.2

- New page Kits → More from Wugweb lists the other Wugweb plugins and whether each is installed; it is the only place they promote each other. "Check again" on Dashboard → Updates now clears the stored update list too, so a new release shows at once. The "Upgrade to Premium" link is gone from the Plugins screen. The setup wizard uses the Kits look.
- Dashboard boxes now use the Kits look (black, white and greys, large figures). The "Scheduled tasks" box appears only once a cron trigger has called in.

## 1.3.0

- Optional site check-in (Kits → Tools): off by default; once a week it can send the site address, WordPress and PHP versions and the Wugweb plugin versions to an https address you choose. Nothing is sent until you switch it on and set the address.
- Brand layer: your brand colours and widths now flow into the theme's own settings, so Site Editor "Reset styles" returns to your brand. Reset brand goes back to the preset you chose (or to the theme's values when you never chose one), and "Clear brand" removes everything. Brand settings travel in the settings file, and an imported file is cleaned like the form is.
- The setup wizard applies the chosen colour style to Styles (the old "ink" style is now "dark"; existing sites are mapped over). Fluent Forms upload fields show the chosen file with a Remove button and clearer errors, and an About field is filled with plain text.
- Header & Footer Scripts now also needs the "unfiltered_html" permission. On multisite or where that is switched off, administrators will no longer see the page.

## 1.2.0

- Six blocks: Countdown (days left to a date), Metric (a number from the site, shown from a threshold), Share (the share bar), Sticky action (one bar on phones), Letter (a letter built from ticked grounds, opened in Gmail or an email app, or copied) and Sponsored (labelled slots with rel=sponsored). They render on the server; a site gives them data through the filters kits_countdown_date, kits_metric_value and kits_sponsored_items.

## 1.1.0

- Updates from the Wugweb registry for the Wugweb plugins and the Kits theme (direct build only; inert in the WordPress.org build, which has no Update URI). Public registry and release files, stable releases by default (`kits_update_channel` option or filter: `pre`), the download is checked against the registry's SHA-256, off with `KITS_NO_REGISTRY_UPDATES`.

- Menus fold: Kits is one item under Appearance, and DirectoryWeb, SourceWeb, RankWeb, InsightWeb, MailWeb and PlanWeb are one item each under Plugins. Each opens its first screen; its other screens show as tabs above the screen. Addresses (`admin.php?page=`) and capabilities are unchanged. The `kits_folded_menus` filter changes which menus fold.

## 1.0.0

- First release.
