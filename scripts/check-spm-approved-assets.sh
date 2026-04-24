#!/usr/bin/env bash
set -u

ASSET_DIR="frontend/public/osp"

REQUIRED_ASSETS=(
  "one-siargao-pass.png"
  "osp-hero-map.png"
)

echo "=== SPM APPROVED UI ASSET GATE ==="
echo "Asset directory: $ASSET_DIR"
echo ""

missing=0

for asset in "${REQUIRED_ASSETS[@]}"; do
  path="$ASSET_DIR/$asset"

  if [ ! -f "$path" ]; then
    echo "MISSING: $path"
    missing=1
    continue
  fi

  size=$(du -h "$path" | awk '{print $1}')
  dims="unknown"

  if command -v sips >/dev/null 2>&1; then
    width=$(sips -g pixelWidth "$path" 2>/dev/null | awk '/pixelWidth/ {print $2}')
    height=$(sips -g pixelHeight "$path" 2>/dev/null | awk '/pixelHeight/ {print $2}')
    if [ -n "${width:-}" ] && [ -n "${height:-}" ]; then
      dims="${width}x${height}"
    fi
  fi

  echo "FOUND:   $path | $dims | $size"
done

echo ""
echo "=== CURRENT PUBLIC OSP ASSETS ==="
find "$ASSET_DIR" -maxdepth 1 -type f | sort

echo ""
if [ "$missing" -eq 1 ]; then
  echo "ASSET GATE RESULT: BLOCKED"
  echo "Reason: Required approved UI assets are missing."
  exit 1
fi

echo "ASSET GATE RESULT: PASSED"
