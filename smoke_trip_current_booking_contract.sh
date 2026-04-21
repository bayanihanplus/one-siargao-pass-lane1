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

TRAVELER_TOKEN="$(login_token "traveler1@osp.local" "Password123!")"

BODY_FILE="$(mktemp)"
CODE="$(curl -s -o "$BODY_FILE" -w "%{http_code}" \
  "$BASE/trips/$TRIP_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN")"

echo "=== 1) TRIP READ WITH CURRENT BOOKING CONTRACT ==="
echo "HTTP $CODE"
cat "$BODY_FILE"
echo
echo

if [ "$CODE" != "200" ]; then
  echo "ASSERTION FAILED: trip read expected HTTP 200 but got HTTP $CODE" >&2
  exit 1
fi

python3 - "$BODY_FILE" <<'PY'
import json, sys

with open(sys.argv[1]) as f:
    data = json.load(f)

summary = data.get("bookingSummary") or {}
current_booking = data.get("currentBooking")
current_payment_state = data.get("currentPaymentState")
current_payment_intent = data.get("currentPaymentIntent")

if not current_booking:
    raise SystemExit("ASSERTION FAILED: currentBooking missing")

if current_booking.get("id") != summary.get("latestLinkedBookingId"):
    raise SystemExit(
        f"ASSERTION FAILED: currentBooking.id {current_booking.get('id')} != latestLinkedBookingId {summary.get('latestLinkedBookingId')}"
    )

if not current_payment_state:
    raise SystemExit("ASSERTION FAILED: currentPaymentState missing")

if current_payment_state.get("bookingId") != current_booking.get("id"):
    raise SystemExit(
        f"ASSERTION FAILED: currentPaymentState.bookingId {current_payment_state.get('bookingId')} != currentBooking.id {current_booking.get('id')}"
    )

if not current_payment_intent:
    raise SystemExit("ASSERTION FAILED: currentPaymentIntent missing")

if current_payment_intent.get("status") not in {"PENDING", "PAID"}:
    raise SystemExit(
        f"ASSERTION FAILED: unexpected currentPaymentIntent.status {current_payment_intent.get('status')}"
    )

print("ASSERTIONS PASSED: current booking contract is aligned")
PY

echo
echo "=== TRIP CURRENT BOOKING CONTRACT SMOKE PASSED ==="
