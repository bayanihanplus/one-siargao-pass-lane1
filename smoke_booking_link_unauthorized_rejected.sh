#!/usr/bin/env bash
set -euo pipefail

source lane2_payment_ids.env

BASE="http://localhost:8001/api/v1"
TRIP_ID="$(grep '^TRIP_ID=' happy_path_ids.env | cut -d= -f2-)"

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

OPERATOR_TOKEN="$(login_token "operator1@osp.local" "Password123!")"

expect_http 404 "1) NON-OWNER CANNOT LINK SOMEONE ELSE'S BOOKING TO TRIP" \
  curl -X POST "$BASE/bookings/link-trip" \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingId\":\"$BOOKING_ID\",\"tripId\":\"$TRIP_ID\",\"linkMethod\":\"traveler_claimed\"}"

echo "=== BOOKING LINK OWNERSHIP REJECTION SMOKE PASSED ==="
