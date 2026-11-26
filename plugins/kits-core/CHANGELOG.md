# Kits Core changelog

Each version's notes also sit in `readme.txt`. Newest first.

## 1.2.0

- Six blocks: Countdown (days left to a date), Metric (a number from the site, shown from a threshold), Share (the share bar), Sticky action (one bar on phones), Letter (a letter built from ticked grounds, opened in Gmail or an email app, or copied) and Sponsored (labelled slots with rel=sponsored). They render on the server; a site gives them data through the filters kits_countdown_date, kits_metric_value and kits_sponsored_items.

## 1.1.0

- Updates from the Wugweb registry for the Wugweb plugins and the Kits theme (direct build only; inert in the WordPress.org build, which has no Update URI). Public registry and release files, stable releases by default (`kits_update_channel` option or filter: `pre`), the download is checked against the registry's SHA-256, off with `KITS_NO_REGISTRY_UPDATES`.

- Menus fold: Kits is one item under Appearance, and DirectoryWeb, SourceWeb, RankWeb, InsightWeb, MailWeb and PlanWeb are one item each under Plugins. Each opens its first screen; its other screens show as tabs above the screen. Addresses (`admin.php?page=`) and capabilities are unchanged. The `kits_folded_menus` filter changes which menus fold.

## 1.0.0

- First release.
