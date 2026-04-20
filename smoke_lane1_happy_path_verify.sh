#!/usr/bin/env bash
set -euo pipefail

source happy_path_ids.env

DB_URL="postgresql://osp:osp@127.0.0.1:5433/osp_dev"
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

echo "=== 1) DB: TRIP / MANIFEST / APPROVAL REQUEST ==="
psql "$DB_URL" <<SQL
select
  t.id as trip_id,
  t."clearanceStatus" as trip_clearance_status,
  m.id as manifest_id,
  m."manifestStatus" as manifest_status,
  r.id as request_id,
  r."requestStatus" as request_status,
  r."reviewedBy" as reviewed_by,
  r."reviewedAt" as reviewed_at
from "Trip" t
left join "ManifestMember" mm on mm."tripId" = t.id
left join "Manifest" m on m.id = mm."manifestId"
left join "ManifestApprovalRequest" r on r."manifestId" = m.id
where t.id = '$TRIP_ID';
SQL
echo

echo "=== 2) DB: TRIP CLEARANCE HISTORY ==="
psql "$DB_URL" <<SQL
select
  id,
  "tripId",
  "clearanceStatus",
  "approvedBy",
  "approvedAt",
  "clearanceReason",
  "createdAt"
from "TripClearanceState"
where "tripId" = '$TRIP_ID'
order by "createdAt" asc;
SQL
echo

TRIP_BODY="$(mktemp)"
TRIP_CODE="$(curl -s -o "$TRIP_BODY" -w "%{http_code}" \
  "$BASE/trips/$TRIP_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN")"
echo "=== 3) API: TRIP READ WITH TRAVELER JWT ==="
echo "HTTP $TRIP_CODE"
cat "$TRIP_BODY"
echo
echo
if [ "$TRIP_CODE" != "200" ]; then
  echo "ASSERTION FAILED: trip read expected HTTP 200 but got HTTP $TRIP_CODE" >&2
  exit 1
fi

PASS_ID="$(python3 - "$TRIP_BODY" <<'PY'
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
print(data["pass"]["id"] if data.get("pass") else "")
PY
)"
if [ -z "$PASS_ID" ]; then
  echo "ASSERTION FAILED: no pass id found in traveler trip payload" >&2
  exit 1
fi

expect_http 200 "4) API: PASS READ WITH TRAVELER JWT" \
  curl "$BASE/passes/$PASS_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"

echo "=== HAPPY PATH VERIFICATION PASSED ==="
