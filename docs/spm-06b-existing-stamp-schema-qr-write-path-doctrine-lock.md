# SPM-06B-R — Existing Stamp Schema + QR Write Path Doctrine Lock

## 1. Purpose

This document locks the existing SPM digital stamp schema and QR write path as the canonical implementation foundation.

This lane corrects the earlier assumption that a new `SpmDigitalStamp` table is required.

Current decision:

Do not create a duplicate `SpmDigitalStamp` table.

The existing `SpmTravelerStamp` model is the canonical digital stamp table for the current architecture.

---

## 2. Canonical Stamp Architecture

The current stamp architecture is:

OSP QR scan event
→ OspQrEvent
→ SpmTravelerStamp
→ SpmTravelerStopVerification
→ SpmTravelerTrailProgress

Canonical roles:

1. `OspQrEvent`
   - immutable QR/audit event source
   - records scan event, outcome, actor, pass/trip/booking linkage where available

2. `SpmTravelerStamp`
   - canonical digital stamp record
   - represents issued/active traveler stamp state for a trail node

3. `SpmTravelerStopVerification`
   - traveler-facing verified stop state
   - connects stamp issuance to visible stop verification

4. `SpmTravelerTrailProgress`
   - computed/snapshotted trail progress state
   - tracks completed nodes, required nodes, percentage, and completion status

---

## 3. Hard Rejection of Duplicate Stamp Table

Do not add:

- `SpmDigitalStamp`
- duplicate passport stamp ledger
- separate visual badge table
- separate non-QR stamp source of truth

Reason:

The system already has stamp/progress records. Adding a parallel stamp table would create:

- duplicate truth
- reconciliation debt
- UI confusion
- audit risk
- reward eligibility ambiguity

Any future enhancement must extend or reference the existing stamp chain, not replace it.

---

## 4. Existing QR Write Path

The existing write path is:

POST /api/v1/osp-qr/passport-stamp-scan

This path must remain the governed stamp issuance path unless a later lane explicitly creates controlled admin/operator recovery flows.

Existing behavior:

- validates QR token / pass state
- validates approved stamp-eligible SPM trail node
- writes OspQrEvent
- blocks invalid/non-stamp-eligible nodes
- prevents duplicate active stamp per traveler + node + trip
- upserts SpmTravelerStamp
- upserts SpmTravelerStopVerification
- recalculates SpmTravelerTrailProgress
- returns stampId, qrEventId, progress counts, and progress percentage

---

## 5. Canonical Duplicate Prevention

Current duplicate prevention is based on:

travelerUserId + trailNodeId + tripId

This remains the correct baseline for active stamp idempotency.

Important nuance:

- A traveler can earn the same node stamp again on a different trip.
- A traveler should not repeatedly earn the same node stamp within the same trip unless a later special rule permits it.
- Duplicate scans may still create QR audit events but must not rewrite active stamp/progress truth.

---

## 6. OSP QR Identity Doctrine

The single OSP QR identity doctrine remains intact.

Rules:

- Do not create separate stamp QR.
- Do not create separate manifest QR.
- Do not create separate payment QR.
- Passport Trails stamp validation writes to OspQrEvent.
- SPM stamp/progress records are downstream records from governed QR events.

---

## 7. Traveler-Facing Stamp Truth

Traveler-facing UI should read from governed backend records only:

- SpmTravelerStamp
- SpmTravelerStopVerification
- SpmTravelerTrailProgress
- OspQrEvent as supporting audit trail

The UI must not:

- infer stamps from package catalog alone
- infer completion from static node lists
- show fake verified stops
- create frontend-only stamps
- count visual map markers as completion

---

## 8. Missed Stamp Recovery Position

Missed-stamp recovery is not yet implemented as a controlled backend workflow.

Future recovery should not create a separate stamp table.

Correct future pattern:

Missed stamp claim
→ evidence review
→ approved recovery action
→ OspQrEvent or recovery audit event
→ SpmTravelerStamp
→ SpmTravelerStopVerification
→ SpmTravelerTrailProgress

Possible future table:

SpmMissedStampClaim

But not now unless explicitly opened.

---

## 9. Guide / Operator Validation Position

Guide and operator validation must not bypass the canonical stamp path.

Allowed future role:

- guide/operator can submit assisted validation
- system/admin can approve or deny
- approved result writes the canonical stamp/progress chain

Disallowed:

- unrestricted guide stamp issuance
- unrestricted operator retroactive completion
- mass stamping without audit
- trail completion without SpmTravelerStamp records

---

## 10. Trail Completion Position

Trail completion should continue to use the existing progress model unless an audit proves it is insufficient.

Current canonical progress table:

SpmTravelerTrailProgress

Future enhancements may extend completion metadata, but should not create a competing progress table unless necessary.

Recommended future audit:

SPM-06C should inspect:

- SpmTravelerStamp fields
- SpmTravelerStopVerification fields
- SpmTravelerTrailProgress fields
- current calculation logic
- whether package-level completion is currently family-based or package-based
- whether completion should be migrated from trail family progress to trail package progress

---

## 11. Known Gap

The existing stamp/progress path appears to be trail-family/node based.

The new commercial Passport Trails package system is package-based.

Therefore, the likely next technical risk is:

Stamp/progress records may not yet know which activated trail package produced the stamp.

This must be audited before final package-level completion and rewards.

Key question:

Does `SpmTravelerStamp` need `trailPackageId` or `trailBookingId` linkage?

Do not assume. Audit first.

---

## 12. Next Lane

Recommended next lane:

SPM-06C — Stamp Package Linkage + Completion Logic Audit

Purpose:

- inspect current SpmTravelerStamp schema
- inspect current progress calculation
- determine whether progress is family-based or package-based
- determine whether activated packages require package-scoped stamp/progress linkage
- decide whether schema patch is needed

---

## 13. Final Decision

Locked decision:

- `SpmTravelerStamp` is the canonical digital stamp record.
- `OspQrEvent` is the audit/event source.
- `SpmTravelerStopVerification` is the verified-stop read layer.
- `SpmTravelerTrailProgress` is the current progress/completion layer.
- No duplicate `SpmDigitalStamp` table will be created at this stage.
- Next work must audit package linkage before adding schema.

