# Animal Writes theme layer

The site's own templates, parts, patterns, styles, scripts, content types and campaign pages that sit over the neutral Kits by Wugweb theme. This is the `assets/site/` folder the theme's site layer (`inc/site-layer.php`) already knows how to load; the theme zip leaves it out, so it was not in the repository after 238fe14. It is copied here unchanged from the production theme folder (`aw_deploy/themes/kits-by-wugweb/assets/site/`, 28 Nov 2026), with one fix below.

This folder is NOT part of the theme zip (the build only reads `themes/` and `plugins/`).

## Deploy

After installing or updating the Kits by Wugweb theme, copy `site/` to `wp-content/themes/kits-by-wugweb/assets/site/` (replace the folder). A theme update replaces the theme folder, so repeat this each time. Without the folder the theme runs neutral and does nothing from this layer.

The layer needs Kits Core 1.4.0 or later with the Kits Core site layer (`sites/animalwrites/kits-core/`) in place; its files load only when `KITS_CORE_LOADED` is set.

## Changed from production

- `site/includes/sponsored-blocks.php` read `KITS_CORE_DIR . 'assets/js/sponsored-blocks.js'`, a file that moved to the Kits Core site layer. `filemtime()` on the missing path raised a PHP warning on every load. It now reads the script from `ANIMALWRITES_KITS_CORE_SITE_DIR` and registers it only when the file exists; the blocks register either way.
