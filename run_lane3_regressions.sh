#!/usr/bin/env bash
set -euo pipefail

echo "=== LANE 3 REGRESSION SUITE START ==="
echo

echo "=== 1) ALREADY-PAID RECREATE REJECTION SMOKE ==="
./smoke_lane3_already_paid_recreate_rejected.sh
echo
echo "=== ALREADY-PAID RECREATE REJECTION SMOKE PASSED ==="
echo

echo "=== 2) NONEXISTENT TARGET REJECTION SMOKE ==="
./smoke_lane3_nonexistent_targets_rejected.sh
echo
echo "=== NONEXISTENT TARGET REJECTION SMOKE PASSED ==="
echo

echo "=== 3) ADMIN READ-ONLY ENFORCEMENT SMOKE ==="
./smoke_lane3_admin_read_only_enforced.sh
echo
echo "=== ADMIN READ-ONLY ENFORCEMENT SMOKE PASSED ==="
echo

echo "=== LANE 3 REGRESSION SUITE COMPLETE ==="
