#!/usr/bin/env bash
# pack.sh: Package all theme and companion plugins in Kits Suite into release ZIPs.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KITS_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=== Packaging Kits Suite Distribution Artifacts ==="
python3 "$KITS_ROOT/tools/build/build-dist.py" --target all --track commercial --out dist
echo "=== Packaging complete. Artifacts ready in $KITS_ROOT/dist ==="
