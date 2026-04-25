# Operator Passport Stamp Scan UI Checkpoint

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer

## Locked State

Operator Workspace now includes a Passport Stamp Scan panel inside:

/operator/access-scan

## Purpose

Allow operator-side governed passport stamp scans for SPM trail nodes using the existing backend passport stamp write path.

## UI Location

File:

frontend/app/operator/access-scan/page.tsx

Panel:

- Passport Stamp Scan
- QR Token input
- Trail Node ID input
- Dev Fill: Active QR + Corregidor
- Scan Passport Stamp button
- Passport Stamp Result panel

## Backend Endpoint Used

POST /api/v1/osp-qr/passport-stamp-scan

## Role Fix

The endpoint now allows actual operator workspace roles:

- OPERATOR_OWNER
- OPERATOR_MANAGER
- OPERATOR_STAFF

Plus:

- ADMIN
- LGU_APPROVER

## Validated Browser Result

Using operator1@osp.local:

- route opened: /operator/access-scan
- Dev Fill filled active QR and Corregidor node
- scan returned ALREADY_STAMPED
- progress displayed: 1/6 · 17%
- stamp ID displayed
- QR event ID displayed

## Hard Rules

- Operator UI does not create fake verification.
- Verification still goes through backend QR/stamp governance.
- Duplicate scans must remain idempotent.
- No legacy QrEvent usage.
- Use OspQrEvent only.
- Existing Live Activity Scan remains intact below the passport stamp panel.

## Latest Relevant Commit

- bef9c02 add operator passport stamp scan panel
