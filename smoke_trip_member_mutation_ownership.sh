#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"
TRIP_ID="$(grep '^TRIP_ID=' happy_path_ids.env | cut -d= -f2-)"

login_token() {
  local email="$1"
  local password="$2"
  local login_json
  login_json="$(curl -s -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}")"
  printf '%s' "$login_json" | python3 -c 'import sys,json; print(json.loads(sys.stdin.read())["accessToken"])'
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
OPERATOR_TOKEN="$(login_token "operator1@osp.local" "Password123!")"

expect_http 201 "1) OWNER CAN ADD TRIP MEMBER" \
  curl -X POST "$BASE/trips/$TRIP_ID/members" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberType": "COMPANION",
    "fullName": "Regression Companion",
    "nationalityCode": "PH",
    "age": 27,
    "passportOrIdHint": "REG-TRIP-001",
    "isPrimaryTraveler": false
  }'

expect_http 404 "2) NON-OWNER CANNOT ADD TRIP MEMBER" \
  curl -X POST "$BASE/trips/$TRIP_ID/members" \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberType": "COMPANION",
    "fullName": "Unauthorized Regression Companion",
    "nationalityCode": "PH",
    "age": 31,
    "passportOrIdHint": "REG-TRIP-002",
    "isPrimaryTraveler": false
  }'

echo "=== TRIP MEMBER MUTATION OWNERSHIP SMOKE PASSED ==="
