# OSP LGU Phase 9A — Dashboard, Auth, and Control Audit

## Purpose

Audit existing LGU / Government / DOT / Admin surfaces before wiring LGU controls into the LGU Tourism Coordination Center.

## Question

Should approve, suspend, edit, update, and not-approved controls live inside the LGU Tourism Coordination Center?

## Preliminary Architecture Decision

Yes, but only as role-gated LGU-authorized controls.

The LGU Tourism Coordination Center should become one integrated dashboard with:
- Intelligence / visibility layer
- Action / intervention layer
- Review and status controls
- Login-aware access
- Role-based permission boundaries

## Hard Boundary

LGU controls must not expose:
- OTA commercial economics
- Operator financial data
- API token issuance
- Super Admin-only governance
- unrestricted traveler personal records

## Next Step

Use the audit output to decide:
- which existing endpoints can be reused
- which LGU control endpoints are missing
- whether current login/auth surfaces can protect `/lgu/intelligence`
- which controls belong to LGU vs Super Admin
