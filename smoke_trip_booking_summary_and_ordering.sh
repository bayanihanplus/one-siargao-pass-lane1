#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8001/api/v1"
TRIP_ID="$(grep '^TRIP_ID=' happy_path_ids.env | cut -d= -f2-)"

login_token() {
  local email="$1"
  local password="$2"
  local body_file
  body_file="$(mktemp)"
  local code
  code="$(curl -s -o "$body_file" -w "%{http_code}" -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}")"

  if [ "$code" != "201" ]; then
    echo "ASSERTION FAILED: login expected HTTP 201 but got HTTP $code" >&2
    cat "$body_file" >&2
    exit 1
  fi

  python3 - "$body_file" <<'PY'
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
print(data["accessToken"])
PY
}

TRAVELER_TOKEN="$(login_token "traveler1@osp.local" "Password123!")"

BODY_FILE="$(mktemp)"
CODE="$(curl -s -o "$BODY_FILE" -w "%{http_code}" \
  "$BASE/trips/$TRIP_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN")"

echo "=== 1) TRIP READ WITH BOOKING SUMMARY ==="
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

summary = data.get("bookingSummary")
if not summary:
    raise SystemExit("ASSERTION FAILED: bookingSummary missing")

required_keys = [
    "totalLinkedBookings",
    "paidBookings",
    "unpaidBookings",
    "latestLinkedBookingId",
    "latestPayableBookingId",
    "latestPaidBookingId",
]
for key in required_keys:
    if key not in summary:
        raise SystemExit(f"ASSERTION FAILED: bookingSummary.{key} missing")

links = data.get("bookingLinks") or []
if not links:
    raise SystemExit("ASSERTION FAILED: bookingLinks missing or empty")

first_booking = links[0].get("booking")
if not first_booking:
    raise SystemExit("ASSERTION FAILED: first bookingLinks entry missing booking")

first_booking_id = first_booking.get("id")
latest_linked_booking_id = summary.get("latestLinkedBookingId")

if first_booking_id != latest_linked_booking_id:
    raise SystemExit(
        f"ASSERTION FAILED: first booking id {first_booking_id} != latestLinkedBookingId {latest_linked_booking_id}"
    )

created_ats = []
for link in links:
    booking = link.get("booking")
    if booking and booking.get("createdAt"):
        created_ats.append(booking["createdAt"])

if created_ats != sorted(created_ats, reverse=True):
    raise SystemExit("ASSERTION FAILED: bookingLinks are not ordered newest-first by booking.createdAt")

total = summary["totalLinkedBookings"]
paid = summary["paidBookings"]
unpaid = summary["unpaidBookings"]

if total != len(links):
    raise SystemExit(f"ASSERTION FAILED: totalLinkedBookings {total} != len(bookingLinks) {len(links)}")

if paid + unpaid != total:
    raise SystemExit(f"ASSERTION FAILED: paid+unpaid {paid+unpaid} != total {total}")

print("ASSERTIONS PASSED: bookingSummary present and bookingLinks ordered newest-first")
PY

echo
echo "=== TRIP BOOKING SUMMARY AND ORDERING SMOKE PASSED ==="
