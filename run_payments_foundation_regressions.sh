#!/usr/bin/env bash
set -euo pipefail

echo "=== PAYMENTS FOUNDATION REGRESSION SUITE START ==="
echo

echo "=== LANE 2 REGRESSIONS ==="
./run_lane2_regressions.sh
echo
echo "=== LANE 2 REGRESSIONS PASSED ==="
echo

echo "=== LANE 3 REGRESSIONS ==="
./run_lane3_regressions.sh
echo
echo "=== LANE 3 REGRESSIONS PASSED ==="
echo

echo "=== PAYMENTS FOUNDATION REGRESSION SUITE COMPLETE ==="
