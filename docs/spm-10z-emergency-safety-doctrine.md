# SPM-10Z — Emergency & Safety Doctrine

## Status

Phase 1 traveler safety-readiness surface. Not live dispatch.

## Product Position

Emergency & Safety is a controlled OSP traveler safety surface. It helps travelers access trip, pass, QR, accommodation, and safety guidance quickly.

It must not imply OSP is a police, medical, rescue, coast guard, or LGU dispatch center unless the backend incident and responder workflow exists.

## Kuya Tala™ Role

Kuya Tala™ may:
- explain what to do next
- guide traveler to OSP Pass / QR
- guide traveler to Trip Details
- explain emergency safety boundaries
- remind traveler to contact local emergency services for immediate danger
- help prepare information for nearby authorities or responders

Kuya Tala™ must not:
- claim help is coming
- claim responder dispatch
- claim LGU/police/medical/coast guard notification
- diagnose medical conditions
- replace local authorities
- invent location sharing
- invent incident case status
- create emergency proof without backend records

## Phase 1 UI

Traveler-facing page may show:
- Call Emergency Help CTA
- Show My OSP Pass / QR CTA
- Open Trip Details CTA
- Ask Kuya Tala™ CTA
- Trip safety snapshot
- emergency boundary notice

## Future Backend Required

Before live emergency notification:
- SafetyIncident
- SafetyIncidentEvent
- SafetyNotificationAttempt
- EmergencyEscalationTarget
- EmergencyLocationSnapshot
- EmergencyResponderAcknowledgement
- Admin/LGU receiving surface

## Hard Rule

Traveler UI must never show RECEIVED, ACKNOWLEDGED, IN_PROGRESS, or DISPATCHED unless backend records prove it.
