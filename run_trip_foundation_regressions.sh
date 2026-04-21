#!/usr/bin/env bash
set -euo pipefail

echo "=== TRIP FOUNDATION REGRESSION SUITE START ==="
echo

echo "=== 1) BOOKING LINK FOUNDATION REGRESSIONS ==="
./run_booking_link_foundation_regressions.sh
echo
echo "=== BOOKING LINK FOUNDATION REGRESSIONS PASSED ==="
echo

echo "=== 2) TRIP BOOKING SUMMARY AND ORDERING SMOKE ==="
./smoke_trip_booking_summary_and_ordering.sh
echo
echo "=== TRIP BOOKING SUMMARY AND ORDERING SMOKE PASSED ==="
echo

echo "=== 3) TRIP CURRENT BOOKING CONTRACT SMOKE ==="
./smoke_trip_current_booking_contract.sh
echo
echo "=== TRIP CURRENT BOOKING CONTRACT SMOKE PASSED ==="
echo

echo "=== TRIP FOUNDATION REGRESSION SUITE COMPLETE ==="
