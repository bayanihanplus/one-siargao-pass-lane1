# ONE SIARGAO PASS — Public Website Universal Hardening Doctrine

## Locked Purpose

The public website is the public gateway for One Siargao Pass.

It must explain the ecosystem, build trust, route the right stakeholder to the right access path, and prepare the user for the protected app surfaces.

It must not duplicate protected dashboards.

## Public Website Role

Public pages may show:
- OSP purpose and positioning
- stakeholder pathways
- public-sector value
- traveler journey explanation
- operator / partner onboarding explanation
- access request CTAs
- responsible data use language
- high-level compliance and coordination value

Public pages must not show:
- live LGU intelligence dashboards
- admin controls
- approve / suspend / reject controls
- DB-wired operational counts as if public
- raw internal table names
- token or API secrets
- protected traveler identity records
- operator financial or commercial details
- Super Admin-only intelligence controls

## Correct Page Separation

### `/`
Public master gateway.
Should explain OSP as the digital island gateway and route to traveler, operator, OTA/API, government, and support pathways.

### `/travelers`
Public traveler explanation page.
Should route to traveler registration/app journey, not expose internal pass logic.

### `/passport-trails`
Public discovery and conversion page.
Should explain Passport Trails, not expose stamp fraud logic or admin completion engines.

### `/operators`
Public operator onboarding page.
Should explain benefits and readiness, not expose operator console internals.

### `/ota`
Public partner/API access request page.
Should explain partner intake and API governance, not expose tokens or production credentials.

### `/government`
Public LGU/DOT trust page.
Should explain coordination purpose and request access. It must not duplicate `/lgu/intelligence`.

### `/support`
Public support page.
Should guide users to help paths, not expose admin support tooling.

## CTA Doctrine

Public CTAs should use:
- Start Traveler Journey
- See Government Use Cases
- Request Authorized Access
- Apply as Operator
- Request Partner/API Access
- Explore Passport Trails
- Contact Support
- View Responsible Data Use

Avoid public CTAs that imply unrestricted access:
- Open Admin Console
- Open LGU Console
- Enter Dashboard
- Open Intelligence Dashboard
- View Live Intelligence
- Open Super Admin
- Generate API Token

## UX Doctrine

All public pages must have:
- polished OSP header
- consistent button hierarchy
- readable hero typography
- non-squeezed headlines
- clear card spacing
- strong mobile behavior
- visible focus states
- hover affordance
- no raw blue links
- no generic unstyled HTML
- no dashboard duplication
