# SPM Real Progress Schema Plan

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer

## Current State

Existing SPM schema covers official trail catalog only:

- SpmTrailFamily
- SpmTrailTrack
- SpmTrailNode
- SpmTrailVariant
- SpmTrailVariantNode

QR foundation already includes:

- PASSPORT_STAMP_SCAN

## Missing Real Progress Layer

The system does not yet have traveler-specific SPM progress records.

Required future models:

1. SpmTravelerStamp
2. SpmTravelerTrailProgress
3. SpmTravelerStopVerification
4. SpmTravelerRecommendationSnapshot

## Core Rule

The UI must not claim real progress from catalog tables alone.

Catalog = official trails/stops.
Progress = traveler-specific verified events.

## Proposed Model: SpmTravelerStamp

Purpose:
Record every governed passport stamp earned by a traveler.

Key fields:
- id
- travelerUserId
- tripId
- passId
- trailFamilyId
- trailTrackId
- trailNodeId
- qrEventId
- eventType
- verificationSource
- stampedAt
- status
- revokedAt
- revokedByUserId
- revokeReason
- createdAt
- updatedAt

Uniqueness:
- travelerUserId + trailNodeId + tripId should be unique for active stamp state.

## Proposed Model: SpmTravelerTrailProgress

Purpose:
Store computed or snapshotted traveler progress per trail.

Key fields:
- id
- travelerUserId
- trailFamilyId
- trailVariantId
- tripId
- completedNodeCount
- requiredNodeCount
- progressPercentage
- status
- completedAt
- lastStampAt
- createdAt
- updatedAt

## Proposed Model: SpmTravelerStopVerification

Purpose:
Store traveler-facing verified stop status.

Key fields:
- id
- travelerUserId
- trailNodeId
- tripId
- stampId
- verificationStatus
- verificationSource
- verifiedAt
- createdAt
- updatedAt

## Proposed Model: SpmTravelerRecommendationSnapshot

Purpose:
Store the next recommended stop/trail card shown to traveler.

Key fields:
- id
- travelerUserId
- tripId
- recommendedTrailNodeId
- recommendedTrailFamilyId
- recommendationReason
- distanceOrEtaLabel
- ctaRoute
- generatedAt
- expiresAt
- createdAt

## Hard Governance Rule

A verified stop can only become verified through governed backend records:

- QR event
- passport stamp scan
- trip/pass relationship
- approved trail node
- audit trail

No frontend-only verification.

## Next Build Lane

After this plan:
1. Create Prisma migration for traveler progress models.
2. Generate Prisma client.
3. Add SPM service methods reading real progress.
4. Replace preview counts with progress data.
