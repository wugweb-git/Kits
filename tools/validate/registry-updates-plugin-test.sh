#!/bin/sh
# Runs tools/validate/registry-updates-plugin-test.php for every plugin that has its own registry updater.
set -e
cd "$(dirname "$0")/../.."
python3 tools/build/gen-registry-updates.py --check
for t in directoryweb:directoryweb_reg:includes/registry-updates.php rankweb:rankweb_reg:includes/registry-updates.php sourceweb:sourceweb_reg:includes/admin/registry-updates.php insightweb:insightweb_reg:includes/registry-updates.php mailweb:mailweb_reg:includes/registry-updates.php planweb:planweb_reg:includes/registry-updates.php; do
  slug=${t%%:*}; rest=${t#*:}; p=${rest%%:*}; rel=${rest#*:}
  php tools/validate/registry-updates-plugin-test.php "$slug" "$p" "$rel"
done
