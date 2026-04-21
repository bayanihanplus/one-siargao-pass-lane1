#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"
MISSING_BOOKING_ID="missing-booking-link-001"
MISSING_TRIP_ID="missing-trip-link-001"

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
VALID_BOOKING_ID="$(grep '^BOOKING_ID=' lane2_payment_ids.env | cut -d= -f2-)"
VALID_TRIP_ID="$(grep '^TRIP_ID=' happy_path_ids.env | cut -d= -f2-)"

expect_http 404 "1) LINK REJECTS NONEXISTENT BOOKING" \
  curl -X POST "$BASE/bookings/link-trip" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingId\":\"$MISSING_BOOKING_ID\",\"tripId\":\"$VALID_TRIP_ID\",\"linkMethod\":\"traveler_claimed\"}"

expect_http 404 "2) LINK REJECTS NONEXISTENT TRIP" \
  curl -X POST "$BASE/bookings/link-trip" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingId\":\"$VALID_BOOKING_ID\",\"tripId\":\"$MISSING_TRIP_ID\",\"linkMethod\":\"traveler_claimed\"}"

echo "=== BOOKING LINK NONEXISTENT TARGET REJECTION SMOKE PASSED ==="
