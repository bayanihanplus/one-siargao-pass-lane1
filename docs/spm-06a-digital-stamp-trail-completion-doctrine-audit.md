# SPM-06A — Digital Stamp + Trail Completion Doctrine Audit

## 1. Purpose

This doctrine defines how Siargao Passport Map / Passport Trails should issue digital stamps, validate real-world trail completion, handle missed scans, prevent guide/operator bypass abuse, support non-linear traveler movement, and prepare reward progression.

This is a doctrine/audit lane only.

No schema migration.
No UI patch.
No checkout.
No payment.
No reward issuance.
No guide bypass endpoint.
No traveler self-claim completion.

---

## 2. Current Backend Context

SPM backend already supports the controlled package chain:

1. Product + pricing schema foundation
2. Seed catalog foundation
3. Geography research doctrine
4. Node classification matrix
5. Researched official trail node seed
6. Traveler package catalog read contract
7. Operator pricing input
8. Admin pricing review
9. Package activation governance
10. Traveler package visibility hardening

Current traveler package visibility rule:

- Traveler list returns only approvalStatus = APPROVED
- Traveler list returns only distributionEnabled = true
- Traveler detail blocks non-distributed packages
- Approved operator pricing is preferred over platform default pricing
- Checkout remains disabled
- Payment execution remains disabled

Current UI issue:

- Traveler Passport Trails UI still reads older trail-family discovery contract.
- The governed package contract is under `/spm/passport-trail-packages`.
- Final UI must wait until stamp/completion doctrine is locked.

---

## 3. Core Doctrine Decision

Digital stamps are not decorative badges.

A digital stamp is a verified completion receipt created from a governed event source.

Correct model:

Traveler action
→ OSP QR / operator / guide / admin validation
→ digital stamp issuance
→ trail progress update
→ completion eligibility
→ reward eligibility

Hard rule:

No real digital stamp without validation source.

---

## 4. Digital Stamp Definition

A digital stamp must represent verified traveler movement or verified node completion.

A stamp should include:

- travelerId
- passId
- tripId where available
- bookingId where available
- trailPackageId where available
- trailNodeId
- ospQrEventId where available
- issuedByType
- issuedByUserId where available
- stampType
- stampStatus
- issuedAt
- revokedAt where applicable
- verification metadata

Recommended future model:

SpmDigitalStamp

Candidate fields:

- id
- travelerId
- passId
- tripId nullable
- bookingId nullable
- trailPackageId nullable
- trailNodeId
- ospQrEventId nullable
- issuedByType
- issuedByUserId nullable
- stampType
- stampStatus
- issuedAt
- revokedAt nullable
- metadataJson

---

## 5. Stamp Types

Recommended stamp types:

1. VISIT_STAMP
2. BOOKING_STAMP
3. OPERATOR_CONFIRMED_STAMP
4. GUIDE_CONFIRMED_STAMP
5. CHECKPOINT_STAMP
6. MILESTONE_STAMP
7. RECOVERY_APPROVED_STAMP

Examples:

- Guyam Island → QR / operator trip validation
- Daku Island → QR / operator trip validation
- Naked Island → QR / operator trip validation
- Cloud 9 → public QR visit stamp
- Sohoton → operator + guide + safety-controlled validation
- Tayangban Cave → guide/operator validation

---

## 6. Stamp Status

Recommended initial statuses:

- ISSUED
- REVOKED

Future statuses:

- PENDING_VALIDATION
- DISPUTED
- VOIDED

Initial build should avoid overbuilding dispute workflow unless required.

---

## 7. Stamp Issuance Sources

Allowed stamp sources:

1. QR scan at approved node
2. Operator confirmation
3. Guide confirmation
4. Manifest-linked check-in/check-out
5. Admin-approved manual correction
6. System-issued milestone completion

Disallowed:

- traveler self-claim auto-stamp
- frontend-only completion button
- guide unrestricted mass-stamping
- operator unrestricted retroactive stamping
- reward issuance without stamp validation

---

## 8. Missed Stamp Recovery Doctrine

Real-world completion may happen without digital capture.

Valid reasons:

- poor signal
- dead phone
- QR not available
- guide forgot to initiate validation
- weather/field operation issue
- operator device issue

Recovery path:

1. Traveler, guide, or operator raises missed-stamp claim.
2. Claim enters review state.
3. Evidence is attached.
4. System/admin/operator rule validates claim.
5. Stamp is issued or denied.

Evidence may include:

- booking reference
- trip manifest
- operator confirmation
- guide confirmation
- timestamped photo
- vessel/transport record
- nearby node sequence proof
- prior and next valid stamp

Hard rule:

A missed-stamp claim is not a stamp.
A missed-stamp claim only becomes a stamp after governed validation.

---

## 9. Guide Bypass Doctrine

A guide must not have unrestricted bypass power.

Correct role:

Guide can initiate or support assisted validation.

Guide cannot:

- issue arbitrary stamps
- complete trails without traveler presence
- override safety/compliance gates
- mass-stamp travelers without audit
- approve his/her own suspicious recovery claims without control

Allowed guide actions:

- confirm traveler attendance
- confirm node visit
- upload evidence
- flag missed stamp
- support operator/admin validation

Recommended doctrine:

Guide may submit assisted completion.
System/admin/operator governance decides whether stamp is issued.

---

## 10. Non-Linear Node Progression Doctrine

Travelers may physically visit nodes out of sequence.

The system should allow non-linear movement unless safety/compliance requires sequence.

Node categories:

1. REQUIRED_NODE
2. OPTIONAL_NODE
3. CONDITIONAL_NODE
4. CHECKPOINT_ONLY_NODE
5. SAFETY_CONTROLLED_NODE

Rule:

- Traveler can receive a valid stamp for a later node before an earlier node.
- Trail completion remains incomplete until required nodes are completed.
- Optional nodes can increase richness but should not block completion.
- Conditional nodes count only when package condition applies.
- Checkpoint-only nodes should not become trophy stamps unless explicitly configured.
- Safety-controlled nodes may require stricter validation.

Example:

Tri-Island Joiner required nodes:

- Guyam Island
- Daku Island
- Naked Island

Traveler visits Daku before Guyam:

- Daku stamp can be issued if valid
- Trail remains incomplete until Guyam and Naked are completed

---

## 11. Trail Completion Doctrine

Trail completion is calculated, not manually declared.

Completion requirements:

- all required nodes completed
- required stamps are valid
- no required stamp is revoked
- package/trail remains valid
- no fraud flag blocks completion

Trail completion should produce:

- trailCompletionId
- completedAt
- completionStatus
- requiredNodeCount
- completedRequiredNodeCount
- optionalNodeCount
- completedOptionalNodeCount
- completionSource
- rewardEligibilityFlag

Recommended future model:

SpmTrailCompletion

Candidate fields:

- id
- travelerId
- passId
- tripId nullable
- bookingId nullable
- trailPackageId
- completionStatus
- requiredNodeCount
- completedRequiredNodeCount
- optionalNodeCount
- completedOptionalNodeCount
- completedAt nullable
- createdAt
- updatedAt

---

## 12. Passport Map Visual Doctrine

The Passport Map may use a stylized adventure-map visual inspired by old expedition maps.

Allowed visual direction:

- parchment / aged paper base
- illustrated Siargao coastline
- dotted travel routes
- compass mark
- node icons
- stamped node markers
- trail-family color coding
- route progress path
- completed stamp marks
- unfinished faded markers

Hard rule:

The map illustration is visual only.
The node graph and stamp records are system truth.

The UI must not fake completed stamps from visuals.

---

## 13. Digital Stamp Visual Doctrine

Digital stamps should feel like passport immigration stamps, not cartoon badges.

Recommended stamp anatomy:

- outer ring: ONE SIARGAO PASS / PASSPORT TRAILS
- node name
- trail family
- date/time
- verification source
- reference code
- stamp status
- subtle trail icon

Sample layout:

ONE SIARGAO PASS • VERIFIED  
PASSPORT TRAILS DIGITAL STAMP

NODE: GUYAM ISLAND  
TRAIL: ISLAND HOPPING  
TYPE: VISIT STAMP

VERIFIED VIA OSP QR  
DATE: 25 APR 2026 • 10:42 AM  
REF: STP-GUYAM-26-000184  
STATUS: ISSUED

Visual styles:

- circular stamp
- oval immigration stamp
- rectangular visa stamp
- faded ink texture
- muted teal, navy, green, rust, or passport purple

Disallowed:

- fake badge-only design
- emoji-only stamp
- gamified trophy with no verification
- stamp shown before actual issuance

---

## 14. Reward Ladder Doctrine

Rewards should be retention and progression tools, not financial products.

Launch rewards should avoid:

- cashback
- withdrawable credits
- transferable tokens
- cash-equivalent points
- crypto-like assets

Initial rewards should use:

- Passport Levels
- Trail Completion Badges
- Digital Completion Stamp
- Unlockable Offers
- Partner Perks
- Return Traveler Status

---

## 15. Recommended Reward Ladder

### Level 0 — New Explorer

Trigger:
- traveler creates account
- traveler receives first SPM access

Reward:
- Passport profile activated
- New Explorer state

### Level 1 — Trail Finisher

Trigger:
- all required nodes of one activated trail package completed

Reward:
- Digital Trail Completion Stamp
- Trail Finisher badge
- Trail Completion Certificate
- Explorer Level 1

### Level 2 — Island Explorer

Trigger:
- completes more than one trail package
- or completes nodes across multiple trail families

Reward:
- Island Explorer status
- multi-trail badge
- curated next-trail recommendations
- partner perk eligibility

### Level 3 — Return Traveler

Trigger:
- verified participation across more than one Siargao trip

Reward:
- Return Traveler status
- personalized next-trip trail path
- repeat-visitor recognition

### Level 4 — Siargao Explorer Rank

Trigger:
- verified completion across multiple trail families and destination modes

Reward:
- elevated Explorer Rank
- special route unlocks
- expanded partner-perk eligibility

### Level 5 — Siargao Passport Elite

Trigger:
- sustained verified engagement over time
- multiple trails
- repeat trips
- no abuse flags

Reward:
- elite passport frame
- premium recognition
- highest partner-perk eligibility
- invite-only campaign access

---

## 16. Reward Eligibility Rules

Reward eligibility requires:

- valid stamps
- completed required nodes
- no revoked stamps
- no unresolved fraud/abuse flags
- package/trail remains valid
- reward still active

No reward from unverified self-claim.

---

## 17. Partner Perk Doctrine

Partner perks must define:

- who funds the perk
- redemption conditions
- expiry
- cap
- partner participation
- fraud limits
- whether perk is one-time or repeatable

No open-ended liability.

---

## 18. Strategic Decision

Recommended next technical sequence:

1. SPM-06A — Digital Stamp + Trail Completion Doctrine Audit
2. SPM-06B — Digital Stamp Schema Foundation
3. SPM-06C — Stamp Issuance Backend Contract
4. SPM-06D — Trail Completion Engine
5. SPM-06E — Reward Eligibility Doctrine
6. SPM-06F — Passport Map + Stamp UI Contract

Hard rule:

Do not build final stamp UI before stamp truth exists.

