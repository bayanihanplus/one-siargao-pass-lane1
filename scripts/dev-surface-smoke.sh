#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"

check_route() {
  local label="$1"
  local path="$2"

  local status
  status="$(curl -o /dev/null -s -w "%{http_code}" "${BASE_URL}${path}")"

  if [ "$status" != "200" ]; then
    echo "FAIL: ${label} -> ${path} returned HTTP ${status}"
    exit 1
  fi

  echo "PASS: ${label} -> ${path} returned HTTP ${status}"
}

check_route "Root" "/"
check_route "Operator Activities" "/operator/activities"
check_route "Operator Manifests" "/operator/manifests"
check_route "Admin Activities" "/admin/activities"
check_route "Admin Manifest Approvals" "/admin/manifest-approvals"
check_route "Admin Manifest History" "/admin/manifests/history"

echo
echo "ALL DEV SURFACE SMOKE CHECKS PASSED"
