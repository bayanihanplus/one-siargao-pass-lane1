# OSP-GLOBAL-TRUST-EMAIL-PROVIDER

## Provider modes

Development/default console:
OSP_TRUST_EMAIL_PROVIDER=console

Native Resend provider:
OSP_TRUST_EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxx
OSP_TRUST_EMAIL_FROM=One Siargao Pass <noreply@onesiargao.online>

Webhook provider:
OSP_TRUST_EMAIL_PROVIDER=webhook
OSP_TRUST_EMAIL_WEBHOOK_URL=https://your-email-provider-or-automation-webhook

## Resend production requirements

1. Create Resend account.
2. Add and verify sending domain:
   onesiargao.online
3. Configure DNS records required by Resend:
   SPF
   DKIM
   DMARC recommended
4. Create production API key.
5. Store API key only in environment variables.
6. Never commit secrets.

## Required behavior

- No JWT in email
- No magic login token
- No QR secret
- CTA points to protected route
- Auth-aware routing protects destination
- Provider failure must not block account creation
- Console fallback remains available in local/dev

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
