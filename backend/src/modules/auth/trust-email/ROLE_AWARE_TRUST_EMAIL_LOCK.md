# OSP GLOBAL TRUST AUTH INFRA 01

## Locked doctrine

One backend auth truth.
Multiple role-aware experience surfaces.
Protected CTA relies on auth-aware routing.
Email never grants access directly.

## Role-aware trust email templates

### TRAVELER_QR_CREATED
Trigger:
Traveler OSP account / QR identity / pass created.

CTA:
Open My OSP Pass

Destination:
/traveler/pass

Login fallback:
Traveler App returning login only.

Public wording:
OSP Pass, QR identity, trips, receipts, official trails, saved journey.

Forbidden:
Admin, operator, LGU, intelligence, compliance monitoring language.

---

### OPERATOR_ACCOUNT_READY
Trigger:
Local partner / operator account created or approved.

CTA:
Open Partner Dashboard

Destination:
/operator/commercial

Login fallback:
Public platform login.

Public wording:
approved local partner, services, bookings, validation, traveler support.

Forbidden:
operator scoring, ranking, monitoring, intelligence.

---

### ADMIN_ACCOUNT_READY
Trigger:
Admin / Super Admin access created.

CTA:
Open Admin Console

Destination:
/admin/control-tower/command-center

Login fallback:
Public platform login.

Public wording:
authorized platform access.

Forbidden:
traveler pass language.

---

### AUTHORIZED_ACCESS_READY
Trigger:
LGU / governance / operations / implicit intelligence access assigned.

CTA:
Open Authorized Access

Destination:
/lgu

Login fallback:
Public platform login.

Public wording:
approved operations, partner, and governance access.

Forbidden:
LGU Intelligence, Destination Intelligence, Compliance Monitoring, Analytics Console.

## Hard security locks

No JWT in email.
No magic login token.
No QR secret in email.
No frontend-only trust success.
No fake approval claims.
No traveler language for operator/admin/LGU.
No operator/admin/LGU routing through /traveler/login.
No public /login fallback for traveler app CTA if traveler protected route middleware is available.

## Protected CTA principle

Email CTA points to protected route.
Middleware/session decides access.
Login continuation must respect backend role.
