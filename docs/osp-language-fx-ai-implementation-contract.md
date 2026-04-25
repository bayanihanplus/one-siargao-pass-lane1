# OSP Language, FX, and AI Assistant Implementation Contract

Date: 2026-04-25  
Branch: fix/operator-staff-membership-layer

## Purpose

This contract defines how One Siargao Pass should later implement:

1. International Language Pack
2. Filipino Language Pack
3. FX / Currency Pack
4. OSP Travel Assistant
5. Future Intelligence / Operator / Admin layer wiring

The current UI exposes access points only. Full runtime wiring must be done later using controlled data contracts.

## Current UI State

OSP Home exposes:

- Language control: /traveler/settings?panel=language
- FX / Currency control: /traveler/settings?panel=currency
- AI Assistant control: /traveler/settings?panel=assistant
- Notifications control: /traveler/settings?panel=notifications

Traveler Settings Hub exposes panels for:

- Language
- Currency
- AI
- Alerts

Current stage:

- UI access only
- No fake translation
- No fake FX conversion
- No fake AI runtime
- No fake notification engine

## International Language Pack

Target users:

- Foreign travelers
- International OTA users
- International agencies
- Non-Filipino tourists

Supported doctrine list:

- English
- Chinese Simplified
- Chinese Traditional
- Korean
- Japanese
- Spanish
- French
- German
- Italian
- Portuguese
- Dutch
- Swedish
- Norwegian
- Danish
- Polish

European Language Pack:

- Spanish
- French
- German
- Italian
- Portuguese
- Dutch
- Swedish
- Norwegian
- Danish
- Polish

Launch priority:

1. English
2. Chinese Traditional
3. Chinese Simplified
4. Korean
5. Japanese
6. Spanish
7. French
8. German
9. Italian / Portuguese / Dutch / Nordic languages / Polish later

Required future data contract:

- user.preferredLanguage
- traveler profile language preference
- UI label dictionary
- status message dictionary
- CTA dictionary
- error-state dictionary
- notification template dictionary

Hard rule:

Language switching must not claim complete localization unless page labels, statuses, CTAs, validation states, and system messages are translated.

## Filipino Language Pack

Target users:

- Domestic Filipino travelers
- Local Siargao operators
- Staff
- LGU-facing users where appropriate
- Field users

Supported doctrine list:

- Filipino / Tagalog
- Cebuano / Bisaya
- Surigaonon
- Waray optional later
- Hiligaynon optional later
- Ilocano optional later

Launch priority:

1. Filipino / Tagalog
2. Cebuano / Bisaya
3. Surigaonon

Required future data contract:

- user.preferredLanguage
- local dialect display labels
- traveler-facing instruction templates
- operator-facing guidance templates
- checkpoint/QR helper text
- payment/pass status explanations

Hard rule:

Filipino language and local dialect support is an accessibility and trust layer, not decoration.

## FX / Currency Pack

Target users:

- Foreign travelers
- OTA buyers
- Booking/payment users
- Future partner channels

Supported doctrine list:

- PHP
- USD
- EUR
- JPY
- KRW
- CNY
- HKD
- AUD
- SGD

Required future data contract:

- traveler preferredCurrency
- booking currency_code
- booking currency_fx_rate
- booking currency_fx_amount
- booking pricing snapshot
- payment intent currency code
- FX timestamp/source
- display currency vs settlement currency separation

Hard rules:

- PHP remains operational settlement base unless changed by payment doctrine.
- FX must be booking-linked and snapshot-based.
- Do not recalculate old bookings from current FX rates.
- Do not show fake conversion values.
- Do not mix traveler display currency with settlement accounting.

## OSP Travel Assistant

Correct product name:

OSP Travel Assistant

Allowed scope:

- Explain pass status
- Explain trip status
- Explain payment status
- Explain QR/pass state
- Explain Passport Map / SPM next steps
- Explain checkpoint/access status
- Help users navigate to the right screen
- Provide language help
- Provide traveler support guidance

Forbidden scope:

- Approve clearance
- Issue passes
- Override payment state
- Confirm bookings without backend record
- Invent trail verification
- Replace LGU or operator decisioning
- Change manifest state
- Change QR/pass validity
- Give unsupported emergency/legal claims

Required future data contract:

- assistant session
- authenticated user context
- traveler trip context
- pass context
- booking/payment context
- SPM progress context
- allowed action map
- forbidden action guardrails
- conversation event log
- escalation marker

Hard rule:

The assistant is an explanation and navigation layer, not a governance authority.

## Intelligence Layer Wiring

Do later.

Future Intelligence should consume:

- trip events
- pass events
- QR scan events
- SPM stamp events
- payment state events
- language preference trends
- FX display usage
- assistant question categories
- unresolved support intent categories

Hard rules:

- Intelligence is read/analysis layer first.
- Do not allow Intelligence to mutate operational records.
- Do not expose LGU intelligence data inside traveler UI.
- Do not route UFN data into LGU intelligence dashboards unless explicitly approved.

## Operator Layer Wiring

Do later.

Future Operator layer should receive:

- booking state
- manifest status
- traveler arrival/departure context
- payment clearance state
- pass readiness where permitted
- QR/checkpoint event results where relevant

Hard rules:

- Operators must not gain unauthorized traveler private data.
- Operators must not override OSP pass validity.
- Operators must not approve LGU-controlled clearance unless governed route exists.

## Admin Layer Wiring

Do later.

Future Admin layer should control:

- language pack management
- currency/FX rules
- assistant allowed/forbidden scope
- notification templates
- SPM trail governance
- QR/pass state governance
- audit log inspection

Hard rules:

- Admin controls governance.
- Traveler UI consumes governed outputs.
- No frontend-only security.
- No admin bypass without explicit audit trail.

## Recommended Execution Sequence

1. Keep current UI controls as access points.
2. Audit current schema and backend routes.
3. Add schema fields only if missing:
   - preferredLanguage
   - preferredCurrency
   - languagePackKey
   - currencyDisplayCode
4. Add read-only traveler preference endpoints.
5. Wire Settings Hub to saved traveler preferences.
6. Add translation dictionary infrastructure.
7. Add FX display snapshot rules.
8. Add assistant runtime only after pass/trip/payment/SPM data contracts are stable.
9. Add Intelligence event ingestion later.
10. Add Operator/Admin management layers after governance rules are clear.

## Hard Stop Rules

- Do not wire UI to fake runtime.
- Do not fake translated content.
- Do not fake FX rates.
- Do not fake AI authority.
- Do not let AI modify operational state.
- Do not expose private traveler data to Operator/Admin surfaces without permission rules.
- Do not build Intelligence dashboards before event contracts are stable.
