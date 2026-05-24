# OSP-GLOBAL-TRUST-EMAIL-PROVIDER-02

## Provider mode

Development/default:
OSP_TRUST_EMAIL_PROVIDER=console

Webhook provider:
OSP_TRUST_EMAIL_PROVIDER=webhook
OSP_TRUST_EMAIL_WEBHOOK_URL=https://your-email-provider-or-automation-webhook

## Required behavior

- No JWT in email
- No magic login token
- No QR secret
- CTA points to protected route
- Auth-aware routing protects destination
- Provider failure must not block account creation

## Current template proof

TRAVELER_QR_CREATED
CTA: Open My OSP Pass
Path: /traveler/pass

OPERATOR_ACCOUNT_READY
CTA: Open Partner Dashboard
Path: /operator/commercial

ADMIN_ACCOUNT_READY
CTA: Open Admin Console
Path: /admin/control-tower/command-center

AUTHORIZED_ACCESS_READY
CTA: Open Authorized Access
Path: /lgu
