# SPM-05B — Passport Trails Seed + Catalog Foundation

## Locked Product Categories

This lane seeds catalog records only for the three locked traveler-facing Passport Trails categories:

1. Siargao Partner Tour
2. Passport Trails™ Curated Tour
3. Build Your Own Passport Trail

This lane does not introduce:
- Local Tour Operator led tour
- OTA led tour
- SPM led tour
- SPM-operated tour
- Classic Siargao Tour

Correct doctrine:
- SPM curates.
- OTA / Travel & Tours distributes later.
- Approved local partners fulfill.
- OSP QR validates.
- Passport Stamps prove.

## Scope Included

This lane adds a seed script for starter Passport Trails catalog records:

- TRI_ISLAND_JOINER
- CORREGIDOR_TRI_ISLAND_JOINER
- LAND_JOINER
- SOHOTON_JOINER
- NORTH_SIARGAO_SCENIC_ROUTE
- INLAND_DISCOVERY_TRAIL
- SUNSET_SCENIC_LOOP
- SURF_DISCOVERY_TRAIL
- CULTURE_LOCAL_FLAVOR_ROUTE
- BUILD_YOUR_OWN_PASSPORT_TRAIL

The seed script:
- upserts SpmTrailPackage records
- creates or updates package-level SpmPricingRule records
- maps package nodes only when matching SpmTrailNode records already exist
- skips missing nodes safely with console warnings
- keeps instantCheckoutAllowed = false
- keeps approvalStatus = DRAFT
- keeps distributionEnabled = false

## Pricing Doctrine

Pricing logic is prepared but not executed.

Operators will later fill prices in the Operator Dashboard.

Pricing records use:

- FIXED_PER_HEAD
- REQUEST_TO_CONFIRM
- FILLABLE_PRICE_REQUIRED

No package is activated for instant checkout in this lane.

## Scope Excluded

This lane does not add:
- frontend UI changes
- traveler checkout
- payment intent creation for trail packages
- Operator Dashboard price input UI
- admin package editor
- OTA / partner API
- guide assignment workflow
- new official trail families
- new QR tables

## Mobile Readiness Doctrine

Although this lane is backend seed/catalog work, all future traveler-facing Passport Trails screens must be treated as Mobile App Production Pages.

Future traveler UI must use:
- mobile-first shell
- soft island colors
- icon-led CTAs
- compact cards
- readable status blocks
- tap-friendly actions
- no generic web/admin dashboard feel

Operator/Admin/LGU surfaces remain responsive dashboard/console surfaces.
