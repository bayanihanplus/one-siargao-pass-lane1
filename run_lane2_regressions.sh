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

echo "=== LANE 2 REGRESSION SUITE COMPLETE ==="
