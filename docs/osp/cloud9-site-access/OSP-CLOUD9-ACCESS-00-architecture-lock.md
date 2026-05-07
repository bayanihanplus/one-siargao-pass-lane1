# OSP-CLOUD9-ACCESS-00 — Cloud 9 LGU Site Access QR Architecture Lock

## Locked Doctrine

Cloud 9 is an LGU Site Access module, not a DCS module.

DCS is for regulated port departure control, boarding, manifests, vessel/operator assignment, and movement records.

Cloud 9 Site Access is for LGU entrance-fee capture, official Traveler QR validation, entitlement attachment, gate validation, scan logging, and daily site-access reporting.

## One Traveler QR Rule

OSP uses one official Traveler QR for identity and access validation.

Cloud 9 does not create a separate site QR for the traveler.

The public signage QR only opens the Cloud 9 Site Access page.

After payment or LGU counter confirmation, Cloud 9 entitlement attaches to the official Traveler QR.

At the gate, LGU staff validates the official Traveler QR against the attached Cloud 9 entitlement.

## Governance Positioning

LGU / DOT owns Cloud 9 site-access governance.

OSP is the service provider and system operator.

Super Admin / Creator has explicit root bypass access for inspection, repair, override, and system recovery, but every bypass must be audit-logged.

## Fee Rule

Cloud 9 LGU entrance fee:

PHP 100 per traveler

The fee belongs to LGU governance.

OSP may support digital collection, QR validation, entitlement attachment, receipt generation, reporting, and settlement workflows depending on approved commercial/legal arrangement.

## Primary Real-World Flow

Traveler arrives at Cloud 9.

Traveler sees official signage:

“Scan to Pay Cloud 9 LGU Entrance Fee”

Traveler scans the signage QR using:

1. OSP Main QR Scanner
2. Phone camera / browser QR scanner

The signage QR resolves to:

/traveler/site-access/cloud-9

Traveler sees:

- Cloud 9 Boardwalk / View Deck
- LGU entrance fee: PHP 100
- Access valid within active trip period
- One-use access
- Official Traveler QR validation required
- Payment / access instructions

Traveler pays online or completes approved LGU counter path.

OSP attaches Cloud 9 entitlement to the official Traveler QR.

LGU gate staff scans or verifies the official Traveler QR.

System marks the entitlement as USED.

LGU dashboard updates paid entries, scanned entries, exceptions, and collection totals.

## QR Type Separation

### 1. Site Signage QR

Purpose:

Start the Cloud 9 access flow.

Public and reusable.

Example payload intent:

SITE_ACCESS_SIGNAGE:CLOUD_9

Route target:

/traveler/site-access/cloud-9

The signage QR must not grant access by itself.

### 2. Official Traveler QR

Purpose:

Prove traveler identity and validate attached entitlements, including Cloud 9 access.

Private traveler identity QR.

Validation target:

LGU scanner validation / scan result flow.

The official Traveler QR is what LGU validates at the gate.

## Main QR Scanner Role

The OSP Main QR Scanner becomes a universal resolver.

Supported QR intent families:

- SITE_ACCESS_SIGNAGE
- TRAVELER_IDENTITY
- BOARDING_PASS
- RECEIPT
- CHECKPOINT
- MERCHANT_REWARD
- PASSPORT_STAMP

Cloud 9 QR resolution:

SITE_ACCESS_SIGNAGE:CLOUD_9
→ /traveler/site-access/cloud-9

TRAVELER_IDENTITY:<travelerToken>
→ LGU scanner validation / entitlement check flow

## Traveler Routes

Planned traveler routes:

/traveler/scan
/traveler/site-access/cloud-9
/traveler/payments/site-sandbox/cloud-9
/traveler/pass

## LGU Routes

Planned LGU routes:

/lgu/site-access/cloud-9
/lgu/site-access/cloud-9/scanner
/lgu/site-access/cloud-9/manual-verify
/lgu/site-access/cloud-9/counter
/lgu/site-access/cloud-9/scan-result
/lgu/site-access/cloud-9/daily-summary

## Backend API Targets

Future backend endpoints:

GET  /api/v1/site-access/sites/cloud-9
POST /api/v1/site-access/cloud-9/entitlements
POST /api/v1/site-access/cloud-9/validate-traveler-qr
POST /api/v1/site-access/cloud-9/scan-events
GET  /api/v1/site-access/cloud-9/daily-summary

## Entitlement State Machine

Cloud 9 entitlement states:

- CREATED
- PAYMENT_PENDING
- COUNTER_CONFIRMATION_PENDING
- PAID_ATTACHED
- READY_FOR_GATE
- USED
- MANUAL_VERIFIED_USED
- OUTSIDE_TRIP_WINDOW
- REFUNDED
- VOIDED
- DUPLICATE_ATTEMPT
- MANUAL_REVIEW

Scanner outcomes:

VALID_SINGLE_ENTRY
→ allow entry

VALID_GROUP_ENTRY
→ allow group entry after headcount confirmation

ALREADY_USED
→ reject duplicate or require supervisor override

PAYMENT_REQUIRED
→ require payment or counter confirmation

ACCOUNT_REQUIRED
→ create official Traveler QR first

OUTSIDE_TRIP_WINDOW
→ proceed to LGU counter review

VOIDED
→ reject

UNKNOWN
→ manual review

## Validity Rule

One Cloud 9 entitlement attached to the official Traveler QR equals:

- one traveler identity or approved group-lead entitlement
- one use only
- validation within the active trip period
- one gate-use event

Cloud 9 access should not be presented as a daily-expiring QR. It is attached to the official Traveler QR and consumed once when validated.

## Rate Categories

Gate-side rate categories:

- STANDARD_RATE
- EXEMPT
- DISCOUNTED
- RESIDENT_RATE
- SENIOR_RATE
- CHILD_RATE

These categories may be automatically applied at the gate if LGU rules/configuration are available.

## Payment Model

MVP must support hybrid payment logic.

### Online payment path

Traveler pays inside OSP.

OSP records payment.

Cloud 9 entitlement is attached to the official Traveler QR.

LGU validates the official Traveler QR.

Daily settlement / collection report is generated.

### Walk-in / LGU counter path

Traveler pays at LGU counter.

LGU staff confirms or creates traveler identity.

OSP logs entitlement, entry, and payment source as LGU_COUNTER or WALK_IN.

Both online and walk-in records must appear in LGU reports.

## Core Data Model Targets

### LguSite

site_code
site_name
municipality
fee_amount
currency
fee_owner
operating_hours
validity_rule
scanner_required
status

### SiteAccessEntitlement

id
site_code
traveler_id
traveler_name_snapshot
nationality_snapshot
fee_amount
currency
rate_category
payment_status
traveler_qr_identity_ref
valid_from
valid_until
trip_period_ref
status
issued_at
used_at
validated_by_user_id
scanner_station_id
payment_intent_id
receipt_id
source_channel
audit_log

### SiteAccessScanEvent

site_access_entitlement_id
site_code
scan_result
scanned_by
scanner_device
timestamp
reason
metadata

## LGU Dashboard Requirements

LGU Cloud 9 dashboard must show:

- Today’s paid entitlements
- Today’s validated entries
- Unused paid entitlements
- Used entitlement count
- Duplicate attempts
- Manual review count
- Manual verification count
- Estimated collection
- Scanner staff activity
- Payment source breakdown
- Rate category breakdown
- Exception records

## Hard Boundaries

Do not mix Cloud 9 Site Access with DCS.

Do not treat signage QR as paid access.

Do not create a separate Cloud 9 traveler QR.

Do not issue access before payment, official rate category approval, or approved LGU counter action.

Do not create fake production collection data.

Do not expose commercial internals to LGU-facing scanner screens.

Do not allow frontend-only validation for access control.

Do not allow Super Admin bypass without audit logging.

## Build Lane Order

### OSP-CLOUD9-ACCESS-00

Architecture lock only.

### OSP-CLOUD9-ACCESS-01

Existing QR scanner / site access / payment / receipt audit.

### OSP-CLOUD9-ACCESS-02

Traveler Cloud 9 Site Access page.

### OSP-CLOUD9-ACCESS-03

Cloud 9 sandbox payment and handoff state.

### OSP-CLOUD9-ACCESS-04

LGU Cloud 9 scanner presentation and validation shell.

### OSP-CLOUD9-ACCESS-05

LGU Cloud 9 daily access dashboard.

### OSP-CLOUD9-ACCESS-06

Backend entitlement attachment, validation, scan event, and audit logging.

## Final Locked Positioning

Cloud 9 Site Access is a regulated LGU site-access lane.

The Main QR Scanner resolves the official Cloud 9 signage QR.

The signage QR starts the access flow.

The official Traveler QR is the only traveler QR.

Cloud 9 entitlement attaches to the official Traveler QR.

LGU / DOT governs the site fee and access rules.

OSP supports as service provider and system operator.

Super Admin has audited root bypass only.
