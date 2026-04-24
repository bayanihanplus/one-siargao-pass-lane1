# Lane 3-X — Official Report Type + Jurisdiction Registry Schema Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

Added official report registry schema foundation.

## Migration

Created:

- 20260424102549_add_official_report_registries

## Models Added

### OfficialReportTypeRegistry

Mapped table:

- official_report_type_registry

Purpose:

- registry-controlled official report type codes
- prevents dynamic/invented official report type codes
- allows future official activation per report type
- keeps official reporting disabled by default

Key fields:

- code
- name
- description
- isActive
- isOfficialEnabled
- requiresPeriod
- requiresJurisdiction
- requiresSignature
- requiresFileHash
- sortOrder
- createdAt
- updatedAt

### OfficialJurisdictionRegistry

Mapped table:

- official_jurisdiction_registry

Purpose:

- registry-controlled jurisdiction codes
- prevents dynamic/invented LGU/DOT jurisdiction codes
- allows future official activation per jurisdiction
- keeps official reporting disabled by default

Key fields:

- code
- name
- jurisdictionType
- parentCode
- isActive
- isOfficialEnabled
- sortOrder
- metadataJson
- createdAt
- updatedAt

## Current Doctrine

Registry schema exists, but official reports remain disabled.

Official numbering is still not implemented.

Server-side PDF is still not implemented.

Signature/seal is still not implemented.

## Required Seed Doctrine

Initial report type codes:

- MANIFEST-APPROVAL
- MANIFEST-SUBMISSION
- APPROVAL-EVENT
- FEE-CLEARANCE-EXCEPTION
- FEE-RECEIPT-REGISTER
- PAYMENT-AUDIT
- OVERDUE-MOVEMENT
- INTER-ISLAND-COMPLIANCE

Initial jurisdiction codes:

- GL
- SIARGAO
- SDN
- DOT

Every seed row must keep:

- isOfficialEnabled: false

## Not Yet Done

Still pending:

- persistent seed file or controlled seed lane
- registry read endpoint
- registry admin/read panel
- official numbering generator
- official report creation endpoint
- server-side PDF generation
- official templates
- signature/attestation block
- file hash/storage
- void/supersede workflow

## Hard Rules

1. Do not enable official reports yet.
2. Do not generate official report numbers yet.
3. Do not add official report buttons yet.
4. Do not add signature/seal yet.
5. Do not remove DRAFT warning.
6. Keep registry-controlled official report and jurisdiction codes.
7. Keep isOfficialEnabled false until official activation doctrine is built.
