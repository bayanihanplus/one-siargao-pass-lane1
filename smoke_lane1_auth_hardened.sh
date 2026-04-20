#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"

login_token() {
  local email="$1"
  local password="$2"
  curl -s -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["accessToken"])'
}

expect_http() {
  local expected="$1"
  local label="$2"
  shift 2
  local body_file
  body_file="$(mktemp)"
  local code
  code="$("$@" -s -o "$body_file" -w "%{http_code}")"
  echo "=== $label ==="
  echo "HTTP $code"
  cat "$body_file"
  echo
  echo
  if [ "$code" != "$expected" ]; then
    echo "ASSERTION FAILED: $label expected HTTP $expected but got HTTP $code" >&2
    exit 1
  fi
}

TRAVELER_TOKEN="$(login_token "traveler1@osp.local" "Password123!")"

expect_http 200 "1) AUTH ME WITH JWT" \
  curl "$BASE/auth/me" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"

expect_http 401 "2) PROFILE WITH LEGACY x-user-id SHOULD FAIL" \
  curl "$BASE/profile" \
  -H "x-user-id: cmo76yyf9000010izxopwrn6u"

expect_http 200 "3) PROFILE WITH JWT" \
  curl "$BASE/profile" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"

expect_http 401 "4) BOOKINGS WITHOUT AUTH SHOULD FAIL" \
  curl -X POST "$BASE/bookings" \
  -H "Content-Type: application/json" \
  -d '{}'

expect_http 200 "5) NOTIFICATIONS WITH JWT" \
  curl "$BASE/notifications" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"

expect_http 401 "6) MANIFEST APPROVAL QUEUE WITHOUT AUTH SHOULD FAIL" \
  curl "$BASE/manifests/approval-queue"

expect_http 403 "7) MANIFEST APPROVAL QUEUE WITH TRAVELER JWT SHOULD FAIL BY ROLE" \
  curl "$BASE/manifests/approval-queue" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"

echo "=== AUTH HARDENING SMOKE PASSED ==="
