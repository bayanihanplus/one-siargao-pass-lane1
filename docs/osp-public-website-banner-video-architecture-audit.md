# OSP Public Website — Banner + Hero Video Architecture Audit

## CTO Decision

The public website must be treated as a professional public-facing website, not a collection of placeholder route pages.

## Required Public Page Standard

Every public route must have:

1. A proper public hero
2. A visual banner or media module
3. Clear stakeholder-specific CTA hierarchy
4. Professional typography
5. Hover/focus states
6. No raw blue-link rendering
7. No protected operational/dashboard exposure
8. No internal DB/intelligence terminology

## Main Homepage `/`

The homepage should have the strongest visual identity.

Required:
- video-style hero module
- OSP public gateway message
- stakeholder pathway cards
- quick routing to Travelers, Passport Trails, Operators, OTA/API, Government, Support
- no operational dashboard data
- no LGU intelligence duplication

## Recommended Homepage Hero

Headline:
One Siargao Pass — Powering the Digital Island.

Subcopy:
A governed digital gateway for travelers, local operators, booking partners, and authorized destination stakeholders across Siargao.

Hero media:
A cinematic island-operation video panel showing:
- arrival / travel readiness
- QR/pass journey
- operator coordination
- Passport Trails discovery
- LGU/DOT coordination layer

Fallback:
If no real video asset exists yet, use a professional video placeholder shell with gradient, motion cue, play badge, and “video coming soon” behavior hidden from public wording.

## Route-Level Banner Doctrine

### `/`
Main video hero.

### `/travelers`
Traveler journey banner: pass, QR, trips, Passport Map.

### `/passport-trails`
Destination discovery banner: trails, stamps, local experiences.

### `/operators`
Operator readiness banner: verified participation, manifests, access scans.

### `/ota`
Partner/API banner: request access, governed integrations, no token exposure.

### `/government`
Public-sector coordination banner: public purpose only, protected LGU console inside.

### `/support`
Support routing banner: help pathways, traveler/operator/partner support.

## Non-Negotiable Separation

`/government` must not duplicate `/lgu/intelligence`.

`/` must not become a dashboard.

Public website explains and routes.
Protected app surfaces operate and control.

## Next Build Recommendation

Phase Public-01:
- Create reusable public banner/media component.
- Create video hero shell for `/`.
- Add banner module to all public pages.
- Harden public CTA language.
- Preserve all protected dashboards untouched.
