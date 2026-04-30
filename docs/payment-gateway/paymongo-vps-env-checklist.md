# PayMongo VPS Environment Checklist

## Required for sandbox checkout

Set these on the VPS frontend runtime environment:

PAYMONGO_TEST_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_BASE_URL=https://your-vps-domain.com

## Required for production checkout later

PAYMONGO_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_BASE_URL=https://your-production-domain.com

## Current payment architecture status

- Payment Detail creates a PayMongo Checkout Session server-side.
- Traveler is redirected to PayMongo checkout_url.
- QR PH checkout is requested through payment_method_types: ["qrph"].
- Payment success redirect alone must not mark the OSP payment as PAID.
- Production settlement requires PayMongo webhook verification.

## Required before production settlement claims

1. Add PayMongo webhook endpoint.
2. Verify PayMongo webhook signature.
3. Match PayMongo checkout/payment metadata to OSP PaymentIntent.
4. Update PaymentIntent to PAID only after verified event.
5. Update PaymentStateRecord to PAID.
6. Write PaymentEventLedger records for received webhook and marked-paid settlement.
7. Make webhook idempotent by provider event ID.

## Required for PayMongo webhook verification

Set this on the VPS backend runtime environment:

PAYMONGO_WEBHOOK_SECRET=whsec_or_secret_from_paymongo_dashboard

## PayMongo dashboard webhook URL

Sandbox / test mode:

https://your-vps-domain.com/api/v1/payments/webhooks/paymongo

Subscribe to:

- payment.paid
- payment.failed

## Webhook settlement rule

The app must not mark PaymentIntent or PaymentStateRecord as PAID from browser redirect alone.

Only a verified PayMongo webhook can settle payment records.

## Implemented backend webhook route

The backend exposes:

POST /api/v1/payments/webhooks/paymongo

Expected header:

Paymongo-Signature: t=<timestamp>,te=<test_signature>,li=<live_signature>

Settlement behavior:

- Unsupported events are acknowledged but ignored.
- payment.paid and checkout_session.payment.paid can mark the OSP PaymentIntent as PAID.
- payment.failed and checkout_session.payment.failed can mark the PaymentIntent as FAILED.
- PaymentStateRecord is set to PAID only for verified paid events.
- PaymentEventLedger uses provider event idempotency keys:
  - paymongo:<event_id>:received
  - paymongo:<event_id>:paid
