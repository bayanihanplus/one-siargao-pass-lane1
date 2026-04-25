# SPM-06C-R — Package Completion Doctrine Lock

## 1. Purpose

This document locks the result of the SPM-06C Stamp Package Linkage + Completion Logic Audit.

The audit confirmed that the current stamp/progress engine is trail-family based, while the new commercial Passport Trails package system is package based.

This document prevents accidental misuse of family-level progress as package completion.

---

## 2. Current Canonical Stamp Chain

Current canonical chain remains:

OspQrEvent
→ SpmTravelerStamp
→ SpmTravelerStopVerification
→ SpmTravelerTrailProgress

Current digital stamp table:

- SpmTravelerStamp

Current verified stop table:

- SpmTravelerStopVerification

Current progress table:

- SpmTravelerTrailProgress

No duplicate SpmDigitalStamp table should be created.

---

## 3. Audit Finding

Current SpmTravelerStamp contains:

- travelerUserId
- tripId
- passId
- trailFamilyId
- trailTrackId
- trailNodeId
- qrEventId
- status
- stampedAt

Current SpmTravelerStamp does not contain:

- trailPackageId
- trailBookingId

Current SpmTravelerTrailProgress is keyed by:

- travelerUserId
- trailFamilyId
- tripId

It is not keyed by:

- trailPackageId
- trailBookingId

---

## 4. Current Completion Calculation

The current passport stamp scan path calculates progress using:

- active stamps for traveler + trailFamilyId + tripId
- required node count from all approved stamp-eligible nodes in the trail family

Therefore current progress means:

Traveler progress inside a trail family.

It does not mean:

Traveler completion of an activated Passport Trails package.

---

## 5. Example: Island Hopping vs Tri-Island Joiner

Island Hopping Trail family may contain:

- Corregidor Island
- Guyam Island
- Daku Island
- Naked Island
- Mam-on Island
- Secret Island

The activated package TRI_ISLAND_JOINER requires only:

- Guyam Island
- Daku Island
- Naked Island

Current family progress example:

- Traveler stamps Corregidor Island
- System reports Island Hopping progress as 1/6 = 17%

But TRI_ISLAND_JOINER package progress should be:

- 0/3 if Guyam, Daku, and Naked are not stamped
- 1/3 if one of those package-required nodes is stamped
- 3/3 only when all required package nodes are stamped

Hard rule:

Family progress must not be treated as package completion.

---

## 6. Package Completion Rule

Package completion must be calculated from SpmTrailPackageNode.

For each package:

- required nodes = SpmTrailPackageNode where isRequired = true and isStampEligible = true
- completed nodes = traveler active stamps where trailNodeId is in that required package node set
- optional nodes = SpmTrailPackageNode where isOptional = true
- conditional nodes = SpmTrailPackageNode where isConditional = true

Package completion is true only when:

- all required stamp-eligible package nodes have valid active stamps
- no required stamp is revoked
- package remains approved/distributed
- no fraud/abuse state blocks completion

---

## 7. Non-Linear Movement Rule

Traveler may stamp package nodes out of order.

Example:

- Traveler stamps Daku first.
- TRI_ISLAND_JOINER package progress becomes 1/3.
- Package is not completed until Guyam and Naked are also stamped.

Do not force strict sequence unless a later safety/compliance rule requires it.

---

## 8. Required Future Schema

A future schema lane should add package-level completion storage.

Recommended model:

SpmTravelerPackageProgress

Candidate fields:

- id
- travelerUserId
- tripId nullable
- passId nullable
- trailPackageId
- trailBookingId nullable
- completedRequiredNodeCount
- requiredNodeCount
- completedOptionalNodeCount
- optionalNodeCount
- completedConditionalNodeCount
- conditionalNodeCount
- progressPercentage
- completionStatus
- completedAt nullable
- lastStampAt nullable
- createdAt
- updatedAt

Recommended uniqueness:

- travelerUserId + trailPackageId + tripId

Reason:

A traveler may complete the same package again on a later trip.

---

## 9. Stamp Linkage Decision

Do not immediately alter SpmTravelerStamp unless required.

Package completion can initially be derived from:

- SpmTravelerStamp.trailNodeId
- SpmTravelerStamp.travelerUserId
- SpmTravelerStamp.tripId
- SpmTrailPackageNode.trailNodeId
- SpmTrailPackageNode.trailPackageId

This avoids mutating the canonical stamp table prematurely.

However, future package booking flows may require:

- trailPackageId on stamp
- trailBookingId on stamp
- sourcePackageId on QR event
- sourceTrailBookingId on QR event

That should be handled in a separate booking-linked stamp audit.

---

## 10. Rewards Position

Rewards must not read SpmTravelerTrailProgress alone.

Rewards should read package-level completion once available.

Correct future reward chain:

SpmTravelerStamp
→ package completion calculation
→ SpmTravelerPackageProgress
→ reward eligibility
→ reward issuance

Disallowed:

- reward based only on family progress
- reward from visual UI completion
- reward from package catalog presence
- reward from unverified traveler claim

---

## 11. UI Position

Traveler Passport Map and Passport Trails UI must clearly distinguish:

1. Trail family progress
2. Package progress
3. Verified stop stamps
4. Package completion
5. Reward eligibility

Do not display “package completed” unless package-level progress says completed.

Do not display “reward unlocked” unless package-level completion/reward eligibility is true.

---

## 12. Next Technical Lane

Next lane:

SPM-06D — Package Completion Schema Foundation Audit

Purpose:

- confirm whether `SpmTravelerPackageProgress` should be added
- confirm relation/index strategy
- confirm whether existing stamp path should recalculate package progress after each stamp
- confirm whether package progress should support package booking linkage now or later

---

## 13. Final Locked Decision

Locked:

- Existing family-level progress remains valid.
- Existing stamp table remains canonical.
- Existing verified stop table remains canonical.
- Package completion must not use family progress directly.
- Package completion must be derived from package required nodes.
- Add package-level progress storage before rewards or package completion UI.
- No reward ladder execution until package completion exists.

