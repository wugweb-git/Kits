#!/bin/sh
# Generates every plugin's Plugins-screen details and runs tools/validate/plugin-info-test.php for each plugin.
set -e
cd "$(dirname "$0")/../.."
python3 tools/build/gen-plugin-info.py --check
for t in kits-core:kits_plugin:includes/plugin-info.php:kits-core.php directoryweb:directoryweb_plugin:includes/plugin-info.php:directoryweb.php rankweb:rankweb_seo_plugin:includes/plugin-info.php:rankweb.php sourceweb:sourceweb_src_plugin:includes/admin/plugin-info.php:sourceweb.php insightweb:insightweb_si_plugin:includes/plugin-info.php:insightweb.php mailweb:mailweb_plugin:includes/plugin-info.php:mailweb.php planweb:planweb_plugin:includes/plugin-info.php:planweb.php; do
  slug=${t%%:*}; r=${t#*:}; p=${r%%:*}; r=${r#*:}; rel=${r%%:*}; main=${r#*:}
  php tools/validate/plugin-info-test.php "$slug" "$p" "$rel" "$main"
done
