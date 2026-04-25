# OSP Home Header Language, FX, and AI Assistant Doctrine

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer

## Purpose

The OSP Home Screen must expose traveler-facing controls for language, currency/FX awareness, AI assistance, and notifications.

These controls are part of the traveler operating layer and must not be treated as decorative UI.

## Header Control Order

Recommended compact order:

1. Language
2. FX / Currency
3. AI Assistant
4. Notifications

Compact UI labels:

- Language: EN / 🌐
- FX: PHP / ₱
- AI Assistant: AI / assistant icon
- Notifications: bell icon

## International Language Pack

The International Language Pack is for foreign travelers.

Supported doctrine list:

- English
- Korean
- Japanese
- Chinese Simplified
- Chinese Traditional
- Spanish
- French
- German

Launch priority:

1. English
2. Chinese Traditional / Chinese Simplified
3. Korean
4. Japanese
5. Spanish / French / German later

Hard rule:
Do not pretend full translation exists unless page content, system labels, CTAs, status messages, and error states are actually localized.

## Filipino Language Pack

The Filipino Language Pack is for domestic travelers, local operators, staff, and public-sector accessibility.

Supported doctrine list:

- Filipino / Tagalog
- Cebuano / Bisaya
- Surigaonon
- Waray optional later
- Ilocano optional later
- Hiligaynon optional later

Launch priority:

1. Filipino / Tagalog
2. Cebuano / Bisaya
3. Surigaonon

Hard rule:
Local dialect support is a trust and accessibility layer, not decorative localization.

## FX / Currency Layer

The FX control should support traveler currency awareness.

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

Hard rule:
FX display must eventually be booking-linked and snapshot-based. Do not fake conversion values before FX logic is wired.

## AI Assistant Layer

The AI Assistant belongs on the Main OSP UI Screen as a controlled traveler guidance layer.

Correct product framing:

OSP Travel Assistant

Allowed assistant scope:

- Explain pass status
- Explain trip status
- Explain QR credential state
- Explain Passport Map / SPM next step
- Explain checkpoint/access state
- Explain payment status
- Help users navigate to the right screen
- Provide language help
- Provide traveler support guidance

Forbidden assistant scope:

- Approving traveler clearance
- Issuing passes
- Overriding payment state
- Confirming bookings without backend record
- Creating fake trail verification
- Replacing LGU/operator governance
- Giving unsupported legal or emergency claims

## UI Stage

Current implementation stage should be access buttons only:

- Language selector button
- FX selector button
- AI Assistant access button
- Notification button

No full language engine, FX conversion engine, or AI assistant runtime should be claimed until actually built.

## Hard Rules

- Do not hide language/FX under generic settings only.
- Do not use full-width controls in the home header.
- Do not overcrowd the main header.
- Do not fake translation.
- Do not fake FX.
- Do not let AI assistant become a governance authority.
- Keep controls compact and mobile-first.
