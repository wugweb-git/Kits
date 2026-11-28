#!/bin/sh
# Runs tools/validate/more-page-test.php for every plugin that has the generated page.
set -e
cd "$(dirname "$0")/../.."
python3 tools/build/gen-more-page.py --check
for t in directoryweb:directoryweb:includes/more-from-kits.php rankweb:rankweb:includes/more-from-kits.php insightweb:insightweb:includes/more-from-kits.php sourceweb:sourceweb:includes/more-from-kits.php mailweb:mailweb:includes/more-from-kits.php planweb:planweb:includes/more-from-kits.php kits-core:kits:includes/more-products.php; do
  slug=${t%%:*}; rest=${t#*:}; p=${rest%%:*}; rel=${rest#*:}
  php tools/validate/more-page-test.php "$slug" "$p" "$rel"
done
