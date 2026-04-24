# Lane 2-F — Overdue Departed Movement Detection Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island tours are the primary compliance reason OSP exists.

Lane 2-F adds read-only detection for boats/movements that have departed but have not yet arrived or returned within a configured threshold.

## Completed

### API

Added:

- GET /api/v1/osp-qr/inter-island/overdue-movements?thresholdMinutes=5

This returns:

- thresholdMinutes
- now
- count
- movements[]
- minutesSinceDeparture
- missingArrival
- missingReturn
- originCheckpoint
- destinationCheckpoint

### Verified Runtime Result

Using thresholdMinutes=5:

- ok: true
- count: 4
- movements are DEPARTED
- missingArrival: true
- missingReturn: true
- minutesSinceDeparture: 8–21 during test

### Compliance Summary Updated

GET /api/v1/osp-qr/inter-island/compliance-summary now includes:

- overdueDepartedMovements

## Current Known Data Condition

Current local test DB includes departed inter-island movements without arrival/return events.

Some are historical test movements from before vessel enforcement, so they may have vesselId = null.

Future LGU Console must clearly distinguish:

- hardened compliant departed movements
- legacy/test loose movements
- overdue or incomplete movement trails

## Not Yet Done

Still pending before full DOT-LGU readiness:

- automatic overdue exception creation
- configured threshold per route/checkpoint/operator
- LGU Console overdue card
- DOT-LGU role/auth separation
- exception resolution workflow
- passenger-level scan writes
- missing passenger detection
- audit export/reporting

## Hard Rule

Do not auto-create alerts yet.

Lane 2-F is read-only detection. It gives DOT-LGU visibility but does not yet mutate movement state or create new compliance exceptions automatically.
