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

extract_json_field() {
  local file="$1"
  local expr="$2"
  python3 - "$file" "$expr" <<'PY'
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
expr = sys.argv[2]
parts = expr.split(".")
cur = data
for p in parts:
    if p.isdigit():
        cur = cur[int(p)]
    else:
        cur = cur[p]
print(cur)
PY
}

TRAVELER_TOKEN="$(login_token "traveler1@osp.local" "Password123!")"

echo "=== 1) FIND LATEST ACTIVITY INSTANCE ==="
ACTIVITY_INSTANCE_ID="$(cd backend && node - <<'NODE'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const row = await prisma.activityInstance.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log(row ? row.id : '');
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
NODE
)"
if [ -z "$ACTIVITY_INSTANCE_ID" ]; then
  echo "ASSERTION FAILED: no activity instance found" >&2
  exit 1
fi
echo "ACTIVITY_INSTANCE_ID=$ACTIVITY_INSTANCE_ID"
echo

BOOKING_BODY="$(mktemp)"
BOOKING_CODE="$(curl -s -o "$BOOKING_BODY" -w "%{http_code}" \
  -X POST "$BASE/bookings" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingSource\":\"OSP\",\"itemType\":\"activity\",\"activityInstanceId\":\"$ACTIVITY_INSTANCE_ID\",\"bookingTotalPhp\":1500,\"currencyCode\":\"PHP\"}")"
echo "=== 2) CREATE BOOKING ==="
echo "HTTP $BOOKING_CODE"
cat "$BOOKING_BODY"
echo
echo
if [ "$BOOKING_CODE" != "201" ]; then
  echo "ASSERTION FAILED: booking create expected HTTP 201 but got HTTP $BOOKING_CODE" >&2
  exit 1
fi

BOOKING_ID="$(extract_json_field "$BOOKING_BODY" "id")"
if [ -z "$BOOKING_ID" ]; then
  echo "ASSERTION FAILED: no booking id found" >&2
  exit 1
fi

LINK_BODY="$(mktemp)"
LINK_CODE="$(curl -s -o "$LINK_BODY" -w "%{http_code}" \
  -X POST "$BASE/bookings/link-trip" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingId\":\"$BOOKING_ID\",\"tripId\":\"$TRIP_ID\",\"linkMethod\":\"traveler_claimed\"}")"
echo "=== 3) LINK BOOKING TO TRIP ==="
echo "HTTP $LINK_CODE"
cat "$LINK_BODY"
echo
echo
if [ "$LINK_CODE" != "201" ]; then
  echo "ASSERTION FAILED: booking link expected HTTP 201 but got HTTP $LINK_CODE" >&2
  exit 1
fi

INTENT_BODY="$(mktemp)"
INTENT_CODE="$(curl -s -o "$INTENT_BODY" -w "%{http_code}" \
  -X POST "$BASE/payments/intents" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingId\":\"$BOOKING_ID\"}")"
echo "=== 4) CREATE PAYMENT INTENT ==="
echo "HTTP $INTENT_CODE"
cat "$INTENT_BODY"
echo
echo
if [ "$INTENT_CODE" != "201" ]; then
  echo "ASSERTION FAILED: payment intent create expected HTTP 201 but got HTTP $INTENT_CODE" >&2
  exit 1
fi

INTENT_ID="$(extract_json_field "$INTENT_BODY" "id")"
if [ -z "$INTENT_ID" ]; then
  echo "ASSERTION FAILED: no payment intent id found" >&2
  exit 1
fi

cat > lane2_payment_ids.env <<ENV
BOOKING_ID=$BOOKING_ID
INTENT_ID=$INTENT_ID
ENV

EVENT_KEY="lane2-smoke-confirm-$INTENT_ID"

CONFIRM_BODY="$(mktemp)"
CONFIRM_CODE="$(curl -s -o "$CONFIRM_BODY" -w "%{http_code}" \
  -X POST "$BASE/payments/intents/$INTENT_ID/confirm" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"eventKey\":\"$EVENT_KEY\"}")"
echo "=== 5) CONFIRM PAYMENT INTENT ==="
echo "HTTP $CONFIRM_CODE"
cat "$CONFIRM_BODY"
echo
echo
if [ "$CONFIRM_CODE" != "201" ]; then
  echo "ASSERTION FAILED: payment confirm expected HTTP 201 but got HTTP $CONFIRM_CODE" >&2
  exit 1
fi

CONFIRM_STATUS="$(extract_json_field "$CONFIRM_BODY" "paymentStatus")"
if [ "$CONFIRM_STATUS" != "PAID" ]; then
  echo "ASSERTION FAILED: payment confirm expected paymentStatus=PAID but got $CONFIRM_STATUS" >&2
  exit 1
fi

REPLAY_BODY="$(mktemp)"
REPLAY_CODE="$(curl -s -o "$REPLAY_BODY" -w "%{http_code}" \
  -X POST "$BASE/payments/intents/$INTENT_ID/confirm" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"eventKey\":\"$EVENT_KEY\"}")"
echo "=== 6) REPLAY SAME EVENT KEY ==="
echo "HTTP $REPLAY_CODE"
cat "$REPLAY_BODY"
echo
echo
if [ "$REPLAY_CODE" != "201" ]; then
  echo "ASSERTION FAILED: payment replay expected HTTP 201 but got HTTP $REPLAY_CODE" >&2
  exit 1
fi

echo "=== 7) DB: PAYMENT STATE / INTENT / LEDGER ==="
psql "$DB_URL" <<SQL
select
  b.id as booking_id,
  b."bookingReference",
  b."bookingTotalPhp",
  b."currencyCode",
  ps.state as payment_state,
  ps."paidAmountPhp",
  ps."unpaidAmountPhp",
  ps."lastPaymentIntentId"
from "Booking" b
left join "PaymentStateRecord" ps on ps."bookingId" = b.id
where b.id = '$BOOKING_ID';

select
  id,
  "bookingId",
  "intentReference",
  "amountPhp",
  "currencyCode",
  status,
  provider,
  "confirmedAt"
from "PaymentIntent"
where id = '$INTENT_ID';

select
  id,
  "bookingId",
  "paymentIntentId",
  "eventType",
  "eventKey",
  source,
  "createdAt"
from "PaymentEventLedger"
where "bookingId" = '$BOOKING_ID'
order by "createdAt" asc;
SQL
echo

STATE_BODY="$(mktemp)"
STATE_CODE="$(curl -s -o "$STATE_BODY" -w "%{http_code}" \
  "$BASE/payments/states/$BOOKING_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN")"
echo "=== 8) API: PAYMENT STATE READ ==="
echo "HTTP $STATE_CODE"
cat "$STATE_BODY"
echo
echo
if [ "$STATE_CODE" != "200" ]; then
  echo "ASSERTION FAILED: payment state read expected HTTP 200 but got HTTP $STATE_CODE" >&2
  exit 1
fi

INTENT_READ_BODY="$(mktemp)"
INTENT_READ_CODE="$(curl -s -o "$INTENT_READ_BODY" -w "%{http_code}" \
  "$BASE/payments/intents/$INTENT_ID" \
  -H "Authorization: Bearer $TRAVELER_TOKEN")"
echo "=== 9) API: PAYMENT INTENT READ ==="
echo "HTTP $INTENT_READ_CODE"
cat "$INTENT_READ_BODY"
echo
echo
if [ "$INTENT_READ_CODE" != "200" ]; then
  echo "ASSERTION FAILED: payment intent read expected HTTP 200 but got HTTP $INTENT_READ_CODE" >&2
  exit 1
fi

echo "=== LANE 2 PAYMENT SMOKE PASSED ==="
