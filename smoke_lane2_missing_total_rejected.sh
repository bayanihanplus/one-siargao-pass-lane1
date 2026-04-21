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

LEGACY_BOOKING_ID="$(cd backend && node - <<'NODE'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const booking = await prisma.booking.findFirst({
    where: {
      primaryTravelerUserId: 'cmo76yyf9000010izxopwrn6u',
      bookingTotalPhp: null,
    },
    orderBy: { createdAt: 'asc' },
  });
  console.log(booking ? booking.id : '');
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
NODE
)"

if [ -z "$LEGACY_BOOKING_ID" ]; then
  echo "ASSERTION FAILED: no legacy booking with null bookingTotalPhp found" >&2
  exit 1
fi

expect_http 400 "1) PAYMENT INTENT CREATE REJECTS BOOKING WITH NULL TOTAL" \
  curl -X POST "$BASE/payments/intents" \
  -H "Authorization: Bearer $TRAVELER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookingId\":\"$LEGACY_BOOKING_ID\"}"

echo "=== LANE 2 MISSING TOTAL REJECTION SMOKE PASSED ==="
