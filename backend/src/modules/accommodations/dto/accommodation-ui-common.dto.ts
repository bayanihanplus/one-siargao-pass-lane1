/**
 * ACCOM-11B — Shared accommodation UI DTO contracts.
 *
 * DTO shells only.
 *
 * Purpose:
 * - support Super Premium Mobile App Production Grade UI
 * - prevent raw Prisma model dumps
 * - keep copy, CTA, status chips, QR/payment/voucher wording backend-aware
 *
 * Forbidden:
 * - no DB calls
 * - no service calls
 * - no fake data factories
 * - no payment receipt logic
 * - no PDF rendering
 * - no email sending
 */

export type AccommodationUiTone =
  | 'OSP_DEEP_NAVY'
  | 'OSP_OCEAN_TEAL'
  | 'OSP_SUN_GOLD'
  | 'OSP_WHITE'
  | 'OSP_MIST'
  | 'OSP_SOFT_SLATE';

export type AccommodationCtaMode =
  | 'REQUEST_AVAILABILITY'
  | 'SEND_STAY_REQUEST'
  | 'CONTINUE_TO_PAYMENT'
  | 'PAY_TO_HOLD'
  | 'VIEW_BOOKING_SUMMARY'
  | 'VIEW_VOUCHER'
  | 'SHOW_QR'
  | 'CHECK_IN_QR'
  | 'CONTACT_SUPPORT'
  | 'VIEW_STAY_DETAILS'
  | 'ADMIN_REVIEW_ACCOMMODATION'
  | 'ADMIN_APPROVE_ACCOMMODATION'
  | 'ADMIN_SUSPEND_ACCOMMODATION'
  | 'ADMIN_MARKETPLACE_ELIGIBILITY'
  | 'DISABLED';

export type AccommodationStatusChipTone =
  | 'TRUST'
  | 'READY'
  | 'PENDING'
  | 'WARNING'
  | 'DISABLED'
  | 'INFO';

export class AccommodationStatusChipDto {
  label!: string;
  tone!: AccommodationStatusChipTone;
  description?: string;
}

export class AccommodationImageDto {
  url!: string;
  alt!: string;
  role!: 'HERO' | 'CARD' | 'GALLERY' | 'THUMBNAIL';
}

export class AccommodationActionDto {
  label!: string;
  mode!: AccommodationCtaMode;
  href?: string;
  disabled?: boolean;
  disabledReason?: string;
}

export class AccommodationSupportPathDto {
  label!: string;
  mode!: 'TRAVELER_SUPPORT' | 'OPERATOR_SUPPORT' | 'ADMIN_REVIEW' | 'PAYMENT_HELP' | 'QR_HELP';
  href?: string;
}
