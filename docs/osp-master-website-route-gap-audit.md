# OSP MASTER WEBSITE — FRONTEND ROUTE GAP AUDIT

Generated at: Wed Apr 29 20:15:27 PST 2026

## App router page files

frontend/app/admin/activities/page.tsx
frontend/app/admin/checkpoint/page.tsx
frontend/app/admin/manifest-approvals/page.tsx
frontend/app/admin/manifests/history/page.tsx
frontend/app/admin/official-safety-broadcasts/page.tsx
frontend/app/dev/page.tsx
frontend/app/lgu/official-safety-broadcasts/page.tsx
frontend/app/lgu/page.tsx
frontend/app/login/page.tsx
frontend/app/operator/access-records/[recordId]/page.tsx
frontend/app/operator/access-scan/page.tsx
frontend/app/operator/activities/page.tsx
frontend/app/operator/guides/page.tsx
frontend/app/operator/manifests/page.tsx
frontend/app/operator/page.tsx
frontend/app/operator/records/page.tsx
frontend/app/operator/settings/page.tsx
frontend/app/page.tsx
frontend/app/siargao-passport-map/page.tsx
frontend/app/traveler/emergency-safety/page.tsx
frontend/app/traveler/partner-tours/page.tsx
frontend/app/traveler/pass/page.tsx
frontend/app/traveler/passport-map/page.tsx
frontend/app/traveler/passport-trails/[trailSlug]/page.tsx
frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx
frontend/app/traveler/passport-trails/diy-trail-builder/summary/page.tsx
frontend/app/traveler/passport-trails/page.tsx
frontend/app/traveler/payments/[intentId]/page.tsx
frontend/app/traveler/register/page.tsx
frontend/app/traveler/scan/page.tsx
frontend/app/traveler/settings/page.tsx
frontend/app/traveler/start/page.tsx
frontend/app/traveler/trips/[tripId]/page.tsx
frontend/app/traveler/trips/new/page.tsx
frontend/app/traveler/trips/page.tsx

## Layout files

frontend/app/layout.tsx
frontend/app/operator/layout.tsx

## Public route existence check

MISSING: /travelers
MISSING: /osp-pass
EXISTS: /siargao-passport-map
MISSING: /passport-trails
MISSING: /operators
MISSING: /ota
MISSING: /developers
MISSING: /government
MISSING: /support
MISSING: /privacy
MISSING: /terms
MISSING: /data-governance
MISSING: /api-terms
MISSING: /operator-terms
MISSING: /ota-terms

## Traveler home conflict

EXISTS: / root page
MISSING: /traveler/home
