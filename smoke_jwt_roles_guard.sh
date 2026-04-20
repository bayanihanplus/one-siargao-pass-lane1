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

TRAVELER_TOKEN="$(login_token "traveler1@osp.local" "Password123!")"
OPERATOR_TOKEN="$(login_token "operator1@osp.local" "Password123!")"
ADMIN_TOKEN="$(login_token "admin1@osp.local" "Password123!")"

echo "=== 1) JWT auth/me with traveler token ==="
curl -s -o /tmp/osp_jwt_me.json -w "HTTP %{http_code}\n" \
  "$BASE/auth/me" \
  -H "Authorization: Bearer $TRAVELER_TOKEN"
cat /tmp/osp_jwt_me.json
echo
echo

echo "=== 2) old dev token should fail ==="
curl -s -o /tmp/osp_old_token_fail.json -w "HTTP %{http_code}\n" \
  "$BASE/auth/me" \
  -H "Authorization: Bearer dev-token-cmo76yyf9000010izxopwrn6u"
cat /tmp/osp_old_token_fail.json
echo
echo

echo "=== 3) traveler should fail activity template ==="
curl -s -o /tmp/osp_traveler_activity_fail.json -w "HTTP %{http_code}\n" \
  -X POST "$BASE/activities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -d '{"title":"smoke traveler fail","description":"fail","meetingPointText":"General Luna"}'
cat /tmp/osp_traveler_activity_fail.json
echo
echo

echo "=== 4) operator should pass activity template ==="
curl -s -o /tmp/osp_operator_activity_ok.json -w "HTTP %{http_code}\n" \
  -X POST "$BASE/activities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -d '{"title":"smoke operator ok","description":"pass","meetingPointText":"General Luna"}'
cat /tmp/osp_operator_activity_ok.json
echo
echo

echo "=== 5) operator should fail admin-only approve ==="
curl -s -o /tmp/osp_operator_admin_fail.json -w "HTTP %{http_code}\n" \
  -X POST "$BASE/manifest-approvals/fake-request-id/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -d '{"notes":"operator fail"}'
cat /tmp/osp_operator_admin_fail.json
echo
echo

echo "=== 6) admin should pass authz and hit not found ==="
curl -s -o /tmp/osp_admin_not_found.json -w "HTTP %{http_code}\n" \
  -X POST "$BASE/manifest-approvals/fake-request-id/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"notes":"admin ok"}'
cat /tmp/osp_admin_not_found.json
echo
echo

echo "=== JWT + RolesGuard smoke complete ==="
