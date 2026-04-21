#!/usr/bin/env bash
set -euo pipefail

echo "=== CORE FOUNDATION REGRESSION SUITE START ==="
echo

echo "=== 1) PAYMENTS FOUNDATION REGRESSIONS ==="
./run_payments_foundation_regressions.sh
echo
echo "=== PAYMENTS FOUNDATION REGRESSIONS PASSED ==="
echo

echo "=== 2) TRIP FOUNDATION REGRESSIONS ==="
./run_trip_foundation_regressions.sh
echo
echo "=== TRIP FOUNDATION REGRESSIONS PASSED ==="
echo

echo "=== CORE FOUNDATION REGRESSION SUITE COMPLETE ==="
