# OSP GATEWAY_QR Registry Doctrine

## Purpose

GATEWAY_QR is the public acquisition QR class for One Siargao Pass.

It is used for physical traveler entry points such as Sayak Airport, Dapa Port, General Luna arrival areas, seaport and landing points, partner counters, accommodation front desks, tour operator counters, public posters, and official onboarding materials.

The purpose is to open the One Siargao Pass app/start experience and acquire travelers into the OSP onboarding flow.

## Critical Separation

GATEWAY_QR is not the official Traveler QR.

The official Traveler QR is issued only after traveler onboarding/account flow and represents the traveler's identity/pass context.

GATEWAY_QR only brings a traveler into the OSP entry funnel.

## QR Type Separation

- GATEWAY_QR: Public acquisition QR for app/open/start onboarding.
- TRAVELER_IDENTITY_QR: Official traveler identity/pass QR after onboarding.
- BOOKING_QR: Booking/voucher/boarding-specific QR.
- SITE_ACCESS_QR: Site entitlement/access validation attached to official Traveler QR.
- PARTNER_QR: Partner/operator/staff onboarding or channel access QR.

## Scan Behavior

Physical scan flow:

Traveler scans printed GATEWAY_QR.
Then the stable OSP gateway URL opens.
Then the gateway page handles app/PWA/start flow.
Then the traveler chooses Get Pass, Sign In, or Explore.
Then the traveler completes onboarding.
Then the system later issues the official Traveler QR identity.

## Durable URL Rule

Printed QR targets must use stable URLs.

Do not print QR codes that point directly to localhost, temporary dev routes, raw image files, unstable query strings, private dashboard routes, /traveler/home, or /login?next=/traveler/home.

Preferred URL pattern:

https://app.onesiargao.online/gateway/[location-slug]

Temporary fallback if gateway route is not yet built:

https://app.onesiargao.online/traveler/start?source=[source_slug]

## Registry Rule

Every GATEWAY_QR must have a registry record before print use.

Required registry fields:

- qr_id
- qr_type
- label
- physical_location
- target_url
- fallback_url
- source_slug
- status
- print_version
- asset_path
- created_at
- last_verified_at
- owner
- notes

## Print Rule

Do not print DRAFT QR codes for public placement.

Only print QR codes with ACTIVE status, verified live target_url, generated and checked asset_path, and assigned print_version.

## Initial GATEWAY_QR Locations

- OSP-GW-SAYAK-001
- OSP-GW-DAPA-PORT-001
- OSP-GW-GENERAL-LUNA-ARRIVAL-001
- OSP-GW-SEAPORT-001
- OSP-GW-PARTNER-COUNTER-001

## Commercial / Analytics Purpose

Location-specific GATEWAY_QR codes allow OSP to measure scans per physical location, started onboarding, completed accounts, app/PWA installs, sign-ins, and later booking contribution.

This should remain internal analytics language and should not be exposed as public traveler copy.
