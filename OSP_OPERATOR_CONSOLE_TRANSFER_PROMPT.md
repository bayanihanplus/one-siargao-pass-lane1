# OSP OPERATOR CONSOLE — TRANSFER CHECKPOINT

## Current Branch
fix/guide-payment-api-filtering

## Latest Commits
- 7c54053 normalize operator console links to fixed dev port
- caa859a stabilize operator console final qa
- dc2f170 harden guide assignment visibility and activity dropdown
- 9d86bfd wire guide assignments with role restricted payment visibility
- 1ed8955 wire operator settings profile storage
- 35d38f5 harden operator manifests workflow page
- 6704159 add operator activity manifest readiness board
- e218dd8 harden operator console button contrast

## Operator Console Status
Operator console has been hardened into a sidebar-only workspace.

Routes:
- http://localhost:3000/operator
- http://localhost:3000/operator/activities
- http://localhost:3000/operator/manifests
- http://localhost:3000/operator/access-scan
- http://localhost:3000/operator/records
- http://localhost:3000/operator/guides
- http://localhost:3000/operator/settings

## Completed
- Operator sidebar shell
- Dashboard intelligence layer
- Pax confidence layer
- Scan enforcement and pax feedback
- Records list
- Activities execution board
- Manifest readiness board
- Manifests workflow page
- Settings editable profile storage
- Guides assignment storage scaffold
- Guide payment visibility gated by role
- Backend guide payment field filtering
- Dev links normalized to port 3000
- Builds passed for backend and frontend

## Hard Rules
- Frontend fixed dev port: 3000
- Backend fixed API port: 8001
- Do not allow port drift to 3001/3002 during testing
- Buttons, CTAs, and sidebar items must be high-contrast
- Guide assignment is placeholder/future operational capability; do not overbuild guide workflows yet
- Guide pay/tips/commission must not be visible to OPERATOR_STAFF
- UI hiding is not enough; backend filtering must stay enforced
- Full guide payout automation is deferred

## Known Strategic Gap
The system still needs a real Operator Staff Auth + Membership Layer.

Current role logic uses global User.primaryRole.
Future correct model should support:
- operator workspace membership
- role per operator workspace
- staff belonging to owner/operator workspace
- no hardcoded owner fallback
- permission enforcement by workspace membership, not global role only

## Next Best Lane
Operator Staff Auth + Membership Layer

Goal:
Build proper operator organization membership so OPERATOR_STAFF belongs to an operator workspace and inherits correct visibility/access without hardcoded ownership assumptions.

