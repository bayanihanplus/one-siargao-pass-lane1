# SPM-05A — Passport Trails Product + Pricing Schema Foundation

## Locked Context

This lane adds the commercial product and pricing schema foundation for Passport Trails™ inside Siargao Passport Map™.

The locked traveler-facing product categories are:

1. Siargao Partner Tour
2. Passport Trails™ Curated Tour
3. Build Your Own Passport Trail

This lane does not introduce Local Tour Operator led / OTA led / SPM led tour categories.

Correct doctrine:

- SPM curates.
- OTA / Travel & Tours distributes.
- Approved local partners fulfill.
- OSP QR validates.
- Passport Stamps prove.
- Operators later fill pricing in the Operator Dashboard.

## Scope Included

This lane adds schema support for:

- Passport Trails product taxonomy
- SPM curation source
- distribution channel
- fulfillment partner type
- pricing mode
- bookability status
- approval status
- trail booking status
- discount type
- trail packages
- trail package nodes
- pricing rules
- pax tier prices
- discount rules
- add-ons
- trail booking shell
- trail pricing snapshot shell

## Scope Excluded

This lane does not add:

- Operator Dashboard price UI
- checkout execution
- payment intent creation for trail packages
- OTA partner API
- admin package editor
- guide assignment workflow
- frontend Passport Map changes
- frontend Passport Trails page changes
- any new official trail family
- any separate QR domain

## Pricing Doctrine

Pricing logic is schema-level now.

Operators will later be able to fill prices in the Operator Dashboard through fields supported by:

- SpmPricingRule
- SpmPaxTierPrice
- SpmDiscountRule
- SpmAddOn
- SpmTrailPricingSnapshot

Supported pricing modes:

- FIXED_PER_HEAD
- PAX_TIERED_PER_HEAD
- PACKAGE_FLAT_RATE
- FILLABLE_PRICE_REQUIRED
- REQUEST_TO_CONFIRM
- ADD_ON_PRICE
- DISCOUNT_RULE
- PRICE_RANGE
- PACKAGE_INCLUSION

For unpriced or variable experiences:

- pricingMode = FILLABLE_PRICE_REQUIRED or REQUEST_TO_CONFIRM
- instantCheckoutAllowed = false
- bookabilityStatus = REQUEST_TO_CONFIRM or DISABLED_PENDING_PRICE

## QR Doctrine

This lane does not create any new QR table.

Trail bookings are designed to attach to the existing OSP QR spine through:

- OspQrEvent.trailBookingId
- InterIslandMovement.trailBookingId

The single OSP QR identity doctrine remains intact.

## Hard Lock

No public or schema naming should imply:

- SPM-operated tour
- OTA-led tour as fulfillment
- Classic Siargao Tour
- separate trail QR
- separate manifest QR
- separate payment QR
