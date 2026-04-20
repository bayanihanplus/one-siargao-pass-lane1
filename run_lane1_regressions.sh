#!/usr/bin/env bash
set -euo pipefail

echo "=== LANE 1 REGRESSION SUITE START ==="
echo

echo "=== 1) AUTH HARDENING SMOKE ==="
./smoke_lane1_auth_hardened.sh
echo
echo "=== AUTH HARDENING SMOKE PASSED ==="
echo

echo "=== 2) HAPPY PATH VERIFICATION ==="
./smoke_lane1_happy_path_verify.sh
echo
echo "=== HAPPY PATH VERIFICATION PASSED ==="
echo

echo "=== 3) JWT + ROLE GUARD SMOKE ==="
./smoke_jwt_roles_guard.sh
echo
echo "=== JWT + ROLE GUARD SMOKE PASSED ==="
echo

echo "=== LANE 1 REGRESSION SUITE COMPLETE ==="
