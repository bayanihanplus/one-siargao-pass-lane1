# SPM-11H — Operator-Led Tour Suggestion Source Doctrine

## Locked Feature Context

Build Your Own Passport Trail™ is a premium traveler-curated route request product inside Siargao Passport Map / Passport Trails.

The current traveler builder may use temporary local/static suggestion data only as a UI scaffold.

This scaffold must not become the final source of tour truth.

## Locked Future Source of Truth

Once Operators populate approved tour-led activities, those operator-led activities become the primary source for:

- Passport Trail style dropdown suggestions
- auto-populated tour suggestions
- suggested stops / activities
- operator-supported route options
- guide-supported route options
- pricing-required route candidates
- fulfillment-required route candidates

## Temporary Hardcoded Scaffold Rule

The current hardcoded suggestions inside:

`frontend/app/traveler/passport-trails/diy-trail-builder/page.tsx`

are allowed only as a temporary product UX scaffold.

They must be treated as:

- preview-only
- local-only
- non-bookable
- non-payment-linked
- non-guide-assigned
- non-QR-validating
- non-stamp-progressing

## Future Data Source Rule

The future builder must populate suggestions from approved records such as:

- approved Operator tour-led activities
- approved SPM Trail Packages
- approved SPM Trail Package Nodes
- approved SPM Trail Nodes
- approved Operator pricing rules
- guide support requirement flags
- operatorRequired / bookingRequired / stampEligible / approvalStatus fields
- future operator activity/tour catalog records where applicable

## Future Builder Behavior

When operator-led tour activities are available, the builder must:

1. Load approved tour-led activities from backend.
2. Group suggestions by Passport Trail style.
3. Show only approved and traveler-visible activities.
4. Mark each item with:
   - operator support requirement
   - guide support requirement
   - pricing mode
   - request-to-confirm requirement
   - QR/stamp eligibility boundary
   - fulfillment readiness
5. Allow traveler to add items to a draft route.
6. Save draft only as draft/request state until backend persistence is available.
7. Never claim booking, payment, guide assignment, QR validation, or stamp progress from selection alone.

## Dropdown Doctrine

The Passport Trail dropdown must eventually become data-backed.

Allowed future dropdown sources:

- trail family
- trail package
- operator-led activity category
- route style
- support requirement
- pricing mode

Disallowed:

- random hardcoded tourist labels as final truth
- unapproved operator activities
- pending-review locations presented as confirmed products
- guide names as a traveler selection marketplace
- fake price or checkout labels

## Operator-Led Activity Fulfillment Rule

Operator-led tours must be surfaced only when:

- operator is approved
- activity/service is approved
- activity is traveler-visible
- pricing rule is approved or clearly request-to-confirm
- service has fulfillment readiness
- guide support rules are defined where required
- booking/payment path is available before confirmation
- QR/stamp behavior is governed by OSP/SPM records

## Guide Support Rule

Guide support may be displayed as:

- "Guide support may be required"
- "Guide support provided where required"
- "Assigned guide appears after operator confirmation"

It must not display:

- "Choose your guide"
- "Guide assigned"
- "Guide confirmed"

unless backend guide assignment records prove it.

## Pricing Rule

Build Your Own Passport Trail™ is a specialized trip product.

Operator-led suggestions must support:

- REQUEST_TO_CONFIRM
- PRICE_RANGE
- PACKAGE_FLAT_RATE where approved
- FIXED_PER_HEAD where approved
- support-based pricing notes

No suggestion may imply checkout readiness unless checkout is actually wired.

## Hard Commercial Boundary

Selection inside the builder means:

`draft interest / draft route composition`

It does not mean:

- booking created
- route confirmed
- price finalized
- operator assigned
- guide assigned
- QR validated
- Passport Stamp unlocked
- manifest created
- payment intent created

## Required Future Technical Direction

When backend wiring begins, replace the local hardcoded `suggestions` array in the DIY builder with a read model from backend.

Recommended future API shape:

`GET /api/v1/spm/passport-trail-builder/suggestions`

Expected response fields:

- suggestionId
- sourceType
- operatorActivityId
- trailPackageId
- trailNodeId
- title
- publicLabel
- category
- trailFamilyCode
- routeStyle
- area
- operatorRequired
- guideSupportRequired
- bookingRequired
- stampEligible
- approvalStatus
- bookabilityStatus
- pricingMode
- priceRangeMin
- priceRangeMax
- currencyCode
- requestToConfirmRequired
- instantCheckoutAllowed
- fulfillmentReadiness
- disclaimer

## Locked Build Instruction

Until backend suggestions exist, every UI build touching Build Your Own Passport Trail™ must preserve this visible or code-level doctrine:

"Current suggestions are temporary scaffolds. Future suggestions must be populated from approved operator-led activities and governed Passport Trails records."

