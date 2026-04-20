#!/usr/bin/env bash
set -euo pipefail

source happy_path_ids.env

DB_URL="postgresql://osp:osp@127.0.0.1:5433/osp_dev"
BASE="http://localhost:8001/api/v1"
TRAVELER_TOKEN="Bearer dev-token-cmo76yyf9000010izxopwrn6u"

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

echo "=== 3) API: TRIP READ WITH TRAVELER BEARER ==="
curl -s -o /tmp/osp_trip_verify.json -w "HTTP %{http_code}\n" \
  "$BASE/trips/$TRIP_ID" \
  -H "Authorization: $TRAVELER_TOKEN"
cat /tmp/osp_trip_verify.json
echo
echo

echo "=== 4) API: PASS READ WITH TRAVELER BEARER ==="
PASS_ID="$(python3 - <<'PY'
import json
with open('/tmp/osp_trip_verify.json') as f:
    data = json.load(f)
print(data["pass"]["id"] if data.get("pass") else "")
PY
)"
echo "PASS_ID=$PASS_ID"
curl -s -o /tmp/osp_pass_verify.json -w "HTTP %{http_code}\n" \
  "$BASE/passes/$PASS_ID" \
  -H "Authorization: $TRAVELER_TOKEN"
cat /tmp/osp_pass_verify.json
echo
echo

echo "=== HAPPY PATH VERIFICATION COMPLETE ==="
