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
