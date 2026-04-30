# OSP Command Center Phase 3 — Operational Queues + Date Range

## Purpose

This lane adds operational command-center behavior beyond static dashboard summaries.

## Added

- Date range filter UI
- Backend `startDate` and `endDate` query support
- Event-wide summary panels
- LGU operational queues
- Super Admin operational queues
- Better queue-oriented UI cards

## LGU Queues

- Pending Partner Review
- Manifest Coordination
- QR / Checkpoint Activity
- Event-Wide Coordination
- Data Gaps / Build Targets

## Super Admin Queues

- Partner / OTA Governance
- Platform Data Integrity
- Commercial / Marketplace Oversight
- Security / Token Boundary

## Hard Boundaries

LGU remains role-scoped and governance-safe.

LGU does not receive:

- raw OTA commercial data
- operator financial data
- unrestricted traveler personal data
- token secrets

## Still To Harden Later

- actual date-window SQL filtering
- municipality-native aggregation
- event mode calculations
- operational drilldowns
- map / zone pressure UI
