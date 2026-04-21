#!/usr/bin/env bash
set -euo pipefail

echo "=== LANE 2 REGRESSION SUITE START ==="
echo

echo "=== 1) PAYMENT HAPPY PATH + IDEMPOTENCY SMOKE ==="
./smoke_lane2_payments.sh
echo
echo "=== PAYMENT HAPPY PATH + IDEMPOTENCY SMOKE PASSED ==="
echo

echo "=== LANE 2 REGRESSION SUITE COMPLETE ==="
