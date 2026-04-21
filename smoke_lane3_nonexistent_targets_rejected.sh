#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"
MISSING_BOOKING_ID="missing-booking-001"
MISSING_INTENT_ID="missing-intent-001"

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
ADMIN_TOKEN="$(login_token "admin1@osp.local" "Password123!")"

expect_http 404 "1) OWNER READ PAYMENT INTENT RETURNS 404 FOR NONEXISTENT ID" \
  curl "$BASE/payments/intents/$MISSING_INTENT_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"

expect_http 404 "2) OWNER READ BOOKING PAYMENT STATE RETURNS 404 FOR NONEXISTENT ID" \
  curl "$BASE/payments/states/$MISSING_BOOKING_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"

expect_http 404 "3) OWNER CONFIRM PAYMENT INTENT RETURNS 404 FOR NONEXISTENT ID" \
  curl -X POST "$BASE/payments/intents/$MISSING_INTENT_ID/confirm" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventKey":"lane3-missing-intent-confirm"}'

expect_http 404 "4) OWNER CREATE PAYMENT INTENT RETURNS 404 FOR NONEXISTENT BOOKING" \
  curl -X POST "$BASE/payments/intents" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingId\":\"$MISSING_BOOKING_ID\"}"

expect_http 404 "5) ADMIN READ PAYMENT INTENT RETURNS 404 FOR NONEXISTENT ID" \
  curl "$BASE/payments/admin/intents/$MISSING_INTENT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

expect_http 404 "6) ADMIN READ BOOKING PAYMENT STATE RETURNS 404 FOR NONEXISTENT ID" \
  curl "$BASE/payments/admin/states/$MISSING_BOOKING_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

echo "=== LANE 3 NONEXISTENT TARGET REJECTION SMOKE PASSED ==="
