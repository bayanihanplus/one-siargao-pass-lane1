# OSP Language Pack Runtime Checkpoint

Date: 2026-04-25  
Branch: fix/operator-staff-membership-layer

## Purpose

This checkpoint records the current OSP language-pack runtime foundation.

The system is no longer only a static UI language selector. It now has:

- DB-backed language pack records
- API-accessible language pack list
- API-accessible traveler dictionary
- traveler preferredLanguage persistence
- Settings screen dictionary consumption
- tracked seed script for reproducible language pack foundation

## Current Commit Stack

Latest relevant commits:

- fb6cdbf add language pack foundation seed script
- f1c2376 wire settings copy to language dictionary
- 0040a19 wire traveler settings to db language packs
- ab610f9 add language pack dictionary foundation
- 450cad0 persist traveler preferred language
- 00eba5f document osp language fx ai implementation contract
- ebe0faf document osp home header language fx ai doctrine

## Database Foundation

New DB models:

- LanguagePack
- LanguageTranslationKey
- LanguageTranslationValue

Purpose:

- LanguagePack stores the active supported language packs.
- LanguageTranslationKey stores stable UI/content translation keys.
- LanguageTranslationValue stores language-specific published/draft values.

Seed file:

- backend/prisma/seeds/language-pack-foundation.sql

Seed file includes:

- International language packs
- European language packs
- Filipino/local language packs
- starter traveler translation keys
- English published defaults
- Filipino proof values for Settings screen

## Supported Language Packs

International:

- English
- Chinese Traditional
- Chinese Simplified
- Korean
- Japanese

European:

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

Filipino / Local:

- Filipino
- Bisaya / Cebuano
- Surigaonon

## API Foundation

Backend routes:

- GET /api/v1/language-packs
- GET /api/v1/language-packs/:languageCode/dictionary?scope=traveler

Current API behavior:

- /language-packs returns active language packs ordered by launchPriority.
- /dictionary returns traveler-scope dictionary values.
- Missing published values fall back to the translation key defaultText.
- Missing language pack returns 404.

## Frontend Foundation

Traveler Settings currently:

- loads language pack options from GET /language-packs
- saves selected language through PATCH /profile
- reads user preferredLanguage from /auth/me
- loads dictionary from GET /language-packs/:languageCode/dictionary?scope=traveler
- applies dictionary values to:
  - settings.title
  - settings.language.title
- falls back safely to English if dictionary loading fails

## Current Runtime Proof

English dictionary API returns keys including:

- settings.title
- settings.language.title
- home.hero.title
- home.cta.showQr
- home.cta.passportMap
- trips.title
- tripDetail.title
- paymentDetail.title
- spm.title

Filipino proof values:

- settings.title = Mga Kontrol ng Traveler
- settings.language.title = Piliin ang travel language mo

## Important Product Constraint

The system now has language-pack infrastructure, but it is not yet fully localized.

Do not claim full translation until:

- every target screen consumes dictionary keys
- translated values exist for the selected language
- status labels and CTA labels are mapped
- fallback behavior is tested
- admin governance exists for managing translation values

## Next Recommended Lanes

### Lane 14I — OSP Home Dictionary Consumption

Small proof lane:

- consume home.hero.title
- consume home.cta.showQr
- consume home.cta.passportMap
- preserve current OSP Home visual design
- fallback to current English if dictionary fails

### Lane 14J — Traveler Core Screens Dictionary Expansion

Screens:

- /traveler/pass
- /traveler/trips
- /traveler/trips/[tripId]
- /traveler/payments/[intentId]
- /traveler/passport-map

### Lane 14K — Admin Language Pack Manager

Admin should eventually manage:

- language packs
- active/inactive state
- launch priority
- translation keys
- translation values
- publish/draft status

### Lane 14L — FX Preference Foundation

Separate lane.

Do not mix FX with language runtime.

## Hard Stop Rules

- Do not fake complete translation.
- Do not hardcode future translation values only in frontend.
- Do not use external translation API as runtime source of truth.
- Do not translate operational/governance meaning loosely.
- Do not allow missing translation to break traveler screens.
- Do not wire language runtime into Intelligence, Operator, or Admin layers until the traveler contract is stable.
- Do not mix FX, AI Assistant runtime, and language dictionary work in the same patch.
