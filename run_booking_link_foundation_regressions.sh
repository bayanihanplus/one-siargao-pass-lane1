#!/usr/bin/env bash
set -euo pipefail

echo "=== BOOKING LINK FOUNDATION REGRESSION SUITE START ==="
echo

echo "=== 1) DUPLICATE BOOKING-TRIP LINK REJECTION SMOKE ==="
./smoke_booking_link_duplicate_rejected.sh
echo
echo "=== DUPLICATE BOOKING-TRIP LINK REJECTION SMOKE PASSED ==="
echo

echo "=== 2) BOOKING LINK OWNERSHIP REJECTION SMOKE ==="
./smoke_booking_link_unauthorized_rejected.sh
echo
echo "=== BOOKING LINK OWNERSHIP REJECTION SMOKE PASSED ==="
echo

echo "=== BOOKING LINK FOUNDATION REGRESSION SUITE COMPLETE ==="
