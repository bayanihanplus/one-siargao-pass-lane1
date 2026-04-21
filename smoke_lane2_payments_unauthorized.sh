#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"
KNOWN_BOOKING_ID="cmo7vpxpw000immj62pavif6r"
KNOWN_INTENT_ID="cmo7vpxrh000pmmj639xvzr7r"

login_token() {
  local email="$1"
  local password="$2"
  curl -s -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["accessToken"])'
}

OTHER_TRAVELER_TOKEN="$(login_token "operator1@osp.local" "Password123!")"

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

expect_http 404 "1) OTHER TRAVELER CANNOT READ PAYMENT INTENT" \
  curl "$BASE/payments/intents/$KNOWN_INTENT_ID" \
  -H "Authorization: Bearer $OTHER_TRAVELER_TOKEN"

expect_http 404 "2) OTHER TRAVELER CANNOT READ BOOKING PAYMENT STATE" \
  curl "$BASE/payments/states/$KNOWN_BOOKING_ID" \
  -H "Authorization: Bearer $OTHER_TRAVELER_TOKEN"

expect_http 404 "3) OTHER TRAVELER CANNOT CONFIRM SOMEONE ELSE'S PAYMENT INTENT" \
  curl -X POST "$BASE/payments/intents/$KNOWN_INTENT_ID/confirm" \
  -H "Authorization: Bearer $OTHER_TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventKey":"lane2-unauthorized-confirm-attempt"}'

echo "=== LANE 2 PAYMENT UNAUTHORIZED SMOKE PASSED ==="
