#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"
TOKEN="Bearer dev-token-cmo76yyf9000010izxopwrn6u"

echo "=== 1) AUTH ME WITH BEARER ==="
curl -s -o /tmp/osp_auth_me.json -w "HTTP %{http_code}\n" \
  "$BASE/auth/me" \
  -H "Authorization: $TOKEN"
cat /tmp/osp_auth_me.json
echo
echo

echo "=== 2) PROFILE WITH LEGACY x-user-id SHOULD FAIL ==="
curl -s -o /tmp/osp_profile_legacy.json -w "HTTP %{http_code}\n" \
  "$BASE/profile" \
  -H "x-user-id: cmo76yyf9000010izxopwrn6u"
cat /tmp/osp_profile_legacy.json
echo
echo

echo "=== 3) PROFILE WITH BEARER ==="
curl -s -o /tmp/osp_profile_bearer.json -w "HTTP %{http_code}\n" \
  "$BASE/profile" \
  -H "Authorization: $TOKEN"
cat /tmp/osp_profile_bearer.json
echo
echo

echo "=== 4) BOOKINGS WITHOUT AUTH SHOULD FAIL ==="
curl -s -o /tmp/osp_bookings_noauth.json -w "HTTP %{http_code}\n" \
  -X POST "$BASE/bookings" \
  -H "Content-Type: application/json" \
  -d '{}'
cat /tmp/osp_bookings_noauth.json
echo
echo

echo "=== 5) NOTIFICATIONS WITH BEARER ==="
curl -s -o /tmp/osp_notifications.json -w "HTTP %{http_code}\n" \
  "$BASE/notifications" \
  -H "Authorization: $TOKEN"
cat /tmp/osp_notifications.json
echo
echo

echo "=== 6) MANIFEST APPROVAL QUEUE WITHOUT AUTH SHOULD FAIL ==="
curl -s -o /tmp/osp_manifest_queue_noauth.json -w "HTTP %{http_code}\n" \
  "$BASE/manifests/approval-queue"
cat /tmp/osp_manifest_queue_noauth.json
echo
echo

echo "=== 7) MANIFEST APPROVAL QUEUE WITH BEARER ==="
curl -s -o /tmp/osp_manifest_queue_bearer.json -w "HTTP %{http_code}\n" \
  "$BASE/manifests/approval-queue" \
  -H "Authorization: $TOKEN"
cat /tmp/osp_manifest_queue_bearer.json
echo
echo

echo "=== SMOKE TEST COMPLETE ==="
