# Lane 2-G — Booking / Payment Clearance Visibility Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island tours are the primary compliance reason OSP exists.

Lane 2-G adds read-only booking/payment clearance visibility before enforcing payment clearance on inter-island departures.

## CTO Decision

Do not enforce payment clearance directly through `InterIslandMovement.bookingId` yet.

Current movements mostly have:

- bookingId: null
- trailBookingId: null
- manifestId: present on some movements

Therefore payment clearance must be computed through:

- InterIslandMovement.manifestId
- ManifestMember.bookingId
- Booking.paymentState.state

## Completed

### API

Added:

- GET /api/v1/osp-qr/inter-island/movements/:id/payment-clearance

This returns:

- movement
- manifest
- clearanceStatus
- manifestMemberCount
- bookingLinkedMemberCount
- paidBookingCount
- unpaidBookingCount
- missingBookingCount
- issues[]
- memberClearance[]

### Verified Runtime Result

For current vessel-linked movement:

- clearanceStatus: NEEDS_REVIEW
- manifestMemberCount: 0
- bookingLinkedMemberCount: 0
- paidBookingCount: 0
- issues:
  - MANIFEST_HAS_NO_MEMBERS

### Compliance Summary Updated

GET /api/v1/osp-qr/inter-island/compliance-summary now includes:

- paymentClearMovementCount
- paymentNeedsReviewMovementCount

## Not Yet Done

Still pending before full DOT-LGU readiness:

- payment clearance enforcement on departure
- booking-linked manifest generation cleanup
- passenger-level scan writes
- missing passenger detection
- exception resolution workflow
- LGU Console / DOT-LGU Dashboard UI
- DOT-LGU role/auth separation
- audit export/reporting

## Hard Rule

Do not enforce payment clearance until the manifest-member-to-booking linkage is reliable.

Lane 2-G currently provides read-only payment clearance visibility only.
