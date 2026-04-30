# OSP Public Website Browser Review Checklist

## Routes to Review

- http://localhost:3000/
- http://localhost:3000/travelers
- http://localhost:3000/passport-trails
- http://localhost:3000/operators
- http://localhost:3000/ota
- http://localhost:3000/government
- http://localhost:3000/support

## Global Acceptance

Each route must pass:

- Styled public shell loads correctly
- No raw blue links
- Header is polished and consistent
- Traveler App / Create Pass buttons are readable and consistent
- Hero headline is not squeezed
- Hero copy is public-facing and commercially clear
- CTA hierarchy is clear
- Buttons have visible hover/focus states
- Cards have clean spacing and hover states
- Mobile layout does not break
- No protected dashboard duplication
- No admin / LGU operational controls exposed publicly
- No DB table names exposed to public users
- No token, approval, suspension, rejection, or admin-only controls presented as public actions

## Page-Specific Review

### `/`
Should act as the master public gateway.

### `/travelers`
Should route travelers into the traveler journey.

### `/passport-trails`
Should sell/discover Passport Trails without exposing stamp/admin internals.

### `/operators`
Should explain operator onboarding and readiness.

### `/ota`
Should explain partner/API request and governance, not token issuance.

### `/government`
Should explain public-sector coordination and route to authorized access only.

### `/support`
Should guide help pathways without exposing support admin tooling.
