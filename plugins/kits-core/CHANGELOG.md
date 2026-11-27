# Kits Core changelog

Each version's notes also sit in `readme.txt`. Newest first.

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
