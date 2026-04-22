#!/usr/bin/env bash
set -euo pipefail

echo "=== DEV SURFACE SMOKE ==="
./scripts/dev-surface-smoke.sh

echo
echo "=== MANIFEST WORKFLOW SMOKE ==="
cd backend
node scripts/manifest-workflow-smoke.js

echo
echo "=== ACTIVITIES WORKFLOW SMOKE ==="
node scripts/activities-workflow-smoke.js

echo
echo "ALL FULL DEV REGRESSION CHECKS PASSED"
