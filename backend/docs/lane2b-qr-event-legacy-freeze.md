# Lane 2-B.2 — QR Event Legacy Freeze

## Decision

`QrEvent` is frozen as a legacy/history table.

All new QR/compliance scan writes must use:

- `OspQrEvent`
- database table: `osp_qr_events`

## Reason

Lane 2-A introduced the audit-grade QR compliance schema for:

- traveler ingress
- traveler egress
- operator access validation
- future inter-island movement
- future boat boarding / disembarkation
- future Passport Stamp validation
- DOT/LGU compliance audit events

The older `QrEvent` table does not carry the full compliance doctrine fields required for Lane 2-A onward.

## Rules

1. Do not delete `QrEvent` yet.
2. Do not write new scan events to `QrEvent`.
3. Keep existing `QrEvent` rows for backward compatibility and audit continuity.
4. Current read endpoint `getCheckpointEvents()` must read from `OspQrEvent`.
5. Ingress, egress, and operator access scans must write to `OspQrEvent`.
6. No destructive migration until a separate archive/migration plan is approved.

## Verified

- Ingress scan writes to `osp_qr_events`.
- Egress scan writes to `osp_qr_events`.
- Operator access scan writes to `osp_qr_events`.
- Old `QrEvent` count does not increase during new scan tests.
