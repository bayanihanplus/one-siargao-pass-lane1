#!/usr/bin/env bash
set -euo pipefail

echo "=== LANE 2 REGRESSION SUITE START ==="
echo

echo "=== 1) PAYMENT HAPPY PATH + IDEMPOTENCY SMOKE ==="
./smoke_lane2_payments.sh
echo
echo "=== PAYMENT HAPPY PATH + IDEMPOTENCY SMOKE PASSED ==="
echo

echo "=== 2) PAYMENT UNAUTHORIZED ACCESS SMOKE ==="
./smoke_lane2_payments_unauthorized.sh
echo
echo "=== PAYMENT UNAUTHORIZED ACCESS SMOKE PASSED ==="
echo

echo "=== 3) PAYMENT ADMIN VISIBILITY SMOKE ==="
./smoke_lane2_payments_admin.sh
echo
echo "=== PAYMENT ADMIN VISIBILITY SMOKE PASSED ==="
echo

echo "=== 4) PAYMENT ADMIN FORBIDDEN ROLE SMOKE ==="
./smoke_lane2_payments_admin_forbidden.sh
echo
echo "=== PAYMENT ADMIN FORBIDDEN ROLE SMOKE PASSED ==="
echo

echo "=== 5) TRIP PAYMENT READ EXPOSURE SMOKE ==="
./smoke_lane2_trip_payment_read.sh
echo
echo "=== TRIP PAYMENT READ EXPOSURE SMOKE PASSED ==="
echo

echo "=== LANE 2 REGRESSION SUITE COMPLETE ==="
