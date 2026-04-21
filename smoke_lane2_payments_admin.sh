#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"
source lane2_payment_ids.env

KNOWN_BOOKING_ID="$BOOKING_ID"
KNOWN_INTENT_ID="$INTENT_ID"

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

ADMIN_TOKEN="$(login_token "admin1@osp.local" "Password123!")"

expect_http 200 "1) ADMIN CAN READ PAYMENT INTENT" \
  curl "$BASE/payments/admin/intents/$KNOWN_INTENT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

expect_http 200 "2) ADMIN CAN READ BOOKING PAYMENT STATE" \
  curl "$BASE/payments/admin/states/$KNOWN_BOOKING_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

echo "=== LANE 2 PAYMENT ADMIN SMOKE PASSED ==="
