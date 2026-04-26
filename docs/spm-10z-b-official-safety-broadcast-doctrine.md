# SPM-10Z-B — Official Safety Broadcast Doctrine + Backend Spine Audit

## Status

Doctrine and backend spine audit foundation only. No live SMS, push, or email sending yet.

## Product Name

Official Safety Broadcast.

This is not Emergency Dispatch, Rescue Command, or responder assignment.

## Access

The broadcast console belongs only to:

- SUPER_ADMIN
- LGU_ADMIN

Forbidden:

- Travelers
- Operators
- OTAs
- Normal staff
- Public users

## Siargao Municipality Registry

Canonical nine-town targeting registry:

- BURGOS — Burgos
- DAPA — Dapa
- DEL_CARMEN — Del Carmen
- GENERAL_LUNA — General Luna
- PILAR — Pilar
- SAN_BENITO — San Benito
- SAN_ISIDRO — San Isidro
- SANTA_MONICA — Santa Monica
- SOCORRO — Socorro

## Channels

Phase 1:

- In-app notification
- Traveler alert inbox
- Admin/LGU broadcast log

Later:

- Push notification
- SMS blast
- Email optional

## Broadcast Categories

- WEATHER_ADVISORY
- SEA_TRAVEL_ADVISORY
- PORT_OR_FERRY_ADVISORY
- ROAD_ACCESS_ADVISORY
- PUBLIC_SAFETY_ALERT
- HEALTH_ADVISORY
- EVENT_CROWD_ADVISORY
- ENVIRONMENTAL_ADVISORY
- MUNICIPAL_NOTICE
- GENERAL_ANNOUNCEMENT

## Severity

- INFO
- ADVISORY
- WARNING
- URGENT
- CRITICAL

CRITICAL requires stronger approval and immutable audit trace.

## State Machine

- DRAFT
- PENDING_APPROVAL
- APPROVED
- SCHEDULED
- SENT
- PARTIALLY_SENT
- FAILED
- CANCELLED
- EXPIRED

Traveler-visible broadcasts must be filtered to published/approved/sent states only. Internal draft or failed states must not leak to travelers.

## Targeting

- ALL_SIARGAO_TRAVELERS
- CURRENTLY_IN_SIARGAO
- BY_MUNICIPALITY
- BY_ROUTE_OR_PORT
- BY_TRIP_DATE_RANGE
- BY_TRAIL_OR_ACTIVITY_AREA
- BY_OPERATOR_MANIFEST_GROUP_LATER

## Minimum Audit Fields

- created_by
- created_at
- approved_by
- approved_at
- sent_by
- sent_at
- cancelled_by
- cancelled_at
- broadcast_title
- broadcast_body
- severity
- category
- target_scope
- target_municipalities
- channels_requested
- channels_attempted
- recipient_count_estimate
- delivery_attempt_count
- failure_count
- expiry_time
- revision_history

## Kuya Tala™ Role

Kuya Tala™ may explain official broadcasts visible to travelers.

Kuya Tala™ must not:

- create broadcasts
- approve broadcasts
- send broadcasts
- cancel broadcasts
- claim SMS/push/email was sent unless delivery logs prove it
- override LGU instructions
- downplay urgent advisories
- invent municipal coverage

## Hard Rule

No SMS blast before broadcast governance, consent/critical-alert policy, provider integration, and delivery logs exist.
