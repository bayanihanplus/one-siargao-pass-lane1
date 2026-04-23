#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"

check_public_route() {
  local label="$1"
  local path="$2"

  local status
  status="$(curl -o /dev/null -s -w "%{http_code}" "${BASE_URL}${path}")"

  if [ "$status" != "200" ]; then
    echo "FAIL: ${label} -> ${path} returned HTTP ${status}, expected 200"
    exit 1
  fi

  echo "PASS: ${label} -> ${path} returned HTTP ${status}"
}

check_protected_route() {
  local label="$1"
  local path="$2"
  local expected_location="$3"

  local headers
  headers="$(curl -I -s "${BASE_URL}${path}")"

  local status
  status="$(printf '%s\n' "$headers" | awk 'toupper($1) ~ /^HTTP\// {print $2; exit}')"

  local location
  location="$(printf '%s\n' "$headers" | awk 'tolower($1)=="location:" {print $2}' | tr -d '\r')"

  if [ "$status" != "307" ]; then
    echo "FAIL: ${label} -> ${path} returned HTTP ${status}, expected 307"
    exit 1
  fi

  if [ "$location" != "$expected_location" ]; then
    echo "FAIL: ${label} -> ${path} redirected to ${location}, expected ${expected_location}"
    exit 1
  fi

  echo "PASS: ${label} -> ${path} returned HTTP ${status} and redirected to ${location}"
}

check_public_route "Root" "/"
check_public_route "Login" "/login"

check_protected_route "Operator Activities" "/operator/activities" "/login?next=/operator/activities"
check_protected_route "Operator Manifests" "/operator/manifests" "/login?next=/operator/manifests"
check_protected_route "Admin Activities" "/admin/activities" "/login?next=/admin/activities"
check_protected_route "Admin Manifest Approvals" "/admin/manifest-approvals" "/login?next=/admin/manifest-approvals"
check_protected_route "Admin Manifest History" "/admin/manifests/history" "/login?next=/admin/manifests/history"
check_protected_route "Traveler Pass" "/traveler/pass" "/login?next=/traveler/pass"

echo
echo "ALL DEV SURFACE SMOKE CHECKS PASSED"
