#!/usr/bin/env bash
set -euo pipefail

source happy_path_ids.env
source lane2_payment_ids.env

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

BODY_FILE="$(mktemp)"
CODE="$(curl -s -o "$BODY_FILE" -w "%{http_code}" \
  "$BASE/trips/$TRIP_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN")"

echo "=== 1) TRAVELER TRIP READ WITH PAYMENT EXPOSURE ==="
echo "HTTP $CODE"
cat "$BODY_FILE"
echo
echo

if [ "$CODE" != "200" ]; then
  echo "ASSERTION FAILED: trip read expected HTTP 200 but got HTTP $CODE" >&2
  exit 1
fi

python3 - "$BODY_FILE" "$BOOKING_ID" "$INTENT_ID" <<'PY'
import json, sys

body_file, booking_id, intent_id = sys.argv[1], sys.argv[2], sys.argv[3]

with open(body_file) as f:
    data = json.load(f)

links = data.get("bookingLinks") or []
target = None
for link in links:
    booking = link.get("booking")
    if booking and booking.get("id") == booking_id:
        target = booking
        break

if not target:
    raise SystemExit("ASSERTION FAILED: target booking not found in trip payload")

if str(target.get("bookingTotalPhp")) != "1500":
    raise SystemExit(f"ASSERTION FAILED: expected bookingTotalPhp=1500 but got {target.get('bookingTotalPhp')}")

if target.get("currencyCode") != "PHP":
    raise SystemExit(f"ASSERTION FAILED: expected currencyCode=PHP but got {target.get('currencyCode')}")

payment_state = target.get("paymentState")
if not payment_state:
    raise SystemExit("ASSERTION FAILED: paymentState missing from trip payload")

if payment_state.get("state") != "PAID":
    raise SystemExit(f"ASSERTION FAILED: expected paymentState.state=PAID but got {payment_state.get('state')}")

latest_intent = target.get("latestPaymentIntent")
if not latest_intent:
    raise SystemExit("ASSERTION FAILED: latestPaymentIntent missing from trip payload")

if latest_intent.get("id") != intent_id:
    raise SystemExit(f"ASSERTION FAILED: expected latestPaymentIntent.id={intent_id} but got {latest_intent.get('id')}")

if latest_intent.get("status") != "PAID":
    raise SystemExit(f"ASSERTION FAILED: expected latestPaymentIntent.status=PAID but got {latest_intent.get('status')}")

print("ASSERTIONS PASSED: trip payload exposes payment state for latest generated booking")
PY

echo
echo "=== LANE 2 TRIP PAYMENT READ SMOKE PASSED ==="
