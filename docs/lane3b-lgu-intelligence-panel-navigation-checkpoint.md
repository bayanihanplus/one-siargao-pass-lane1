# Lane 3-B — LGU Intelligence Panel Navigation Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Convert the LGU Console from long-page anchor scrolling into a proper panel-based dashboard.

## Completed

- LGU side navigation now uses panel query state:
  - /lgu?panel=overview
  - /lgu?panel=intelligence
  - /lgu?panel=manifests
  - /lgu?panel=clearance
  - /lgu?panel=fee-exceptions
  - /lgu?panel=receipts
  - /lgu?panel=payment-audit
  - /lgu?panel=fee-programs
  - /lgu?panel=notifications
  - /lgu?panel=session

- Side nav stays visible.
- Right-side content changes by selected panel.
- No child routes are required.
- No 404 route behavior from side nav.
- No scroll-jump behavior from side nav.
- Intelligence Layer is backend-backed using existing read endpoints.
- Fee Exceptions panel shows fee-clearance blocked cases.
- Receipt, payment audit, fee programs, clearance, notifications, and session panels are read-only.

## Backend Endpoints Used

- GET /api/v1/osp-qr/inter-island/compliance-summary
- GET /api/v1/osp-qr/compliance/fee-clearance-exceptions?limit=5
- GET /api/v1/osp-qr/compliance/fee-receipts?limit=5
- GET /api/v1/osp-qr/compliance/fee-payment-audits?limit=5
- GET /api/v1/osp-qr/compliance/fee-programs
- GET /api/v1/osp-qr/inter-island/overdue-movements

## Runtime Visual Verification

Confirmed visually:

- /lgu?panel=overview renders Overview panel
- /lgu?panel=fee-exceptions renders Fee Exceptions Watch panel
- side nav active state updates correctly
- panel UX is acceptable
- LGU Console remains read-only

## Current UI Doctrine

LGU Console navigation is not public route navigation yet.

For now:

- side nav controls dashboard panels
- no child pages
- no route 404s
- no mutation buttons
- no export
- no PDF

## Not Yet Done

Still pending:

- manifest submission list backed by real manifest queue
- full intelligence charts
- DOT/LGU export/reporting
- receipt PDF/export
- traveler-facing receipt view
- formal finance role separation
- dedicated FEE_CLEARANCE_REQUIRED exception taxonomy

## Hard Rules

1. Do not reintroduce side-nav 404 child routes unless those pages exist.
2. Do not use anchor scrolling for main dashboard navigation.
3. Keep SILENT_LGU_ANALYTICS read-only.
4. Do not add mutation buttons without a dedicated role-governed lane.
5. Keep backend read endpoints as source of truth.
