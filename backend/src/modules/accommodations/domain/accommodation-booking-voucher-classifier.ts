import {
  AccommodationPaymentOwnershipMode,
  AccommodationPayoutResponsibility,
  AccommodationSettlementMode,
} from '@prisma/client';
import {
  AccommodationCommercialLaneKey,
  AccommodationCommercialMatrixPreset,
  getAccommodationCommercialPreset,
} from './accommodation-commercial-matrix';

/**
 * ACCOM-03B — Accommodation Booking Voucher Classification
 *
 * Pure domain helper only.
 *
 * No Prisma client.
 * No DB reads.
 * No DB writes.
 * No controller.
 * No API route.
 * No frontend.
 * No QR scan behavior change.
 *
 * Locked doctrine:
 * Booking voucher !== payment receipt !== QR/pass credential.
 */

export type AccommodationVoucherAudience =
  | 'TRAVELER'
  | 'OPERATOR'
  | 'ADMIN'
  | 'SOURCE_PARTNER';

export type AccommodationVoucherPaymentReceiptPolicy =
  | 'OSP_PAYMENT_RECEIPT_ALLOWED_AFTER_CONFIRMATION'
  | 'OSP_PAYMENT_RECEIPT_NOT_ALLOWED_EXTERNAL_PAYMENT'
  | 'PAYMENT_RECEIPT_NOT_APPLICABLE';

export type AccommodationVoucherQrPolicy =
  | 'QR_SUMMARY_ALLOWED'
  | 'QR_CHECK_IN_ALLOWED_WHEN_READY'
  | 'QR_SUMMARY_ONLY_NOT_CHECK_IN_READY';

export type AccommodationVoucherMyTripsPolicy =
  | 'SHOW_IN_MY_TRIPS_WHEN_TRIP_LINKED'
  | 'DO_NOT_SHOW_UNLESS_TRIP_LINKED';

export type AccommodationBookingVoucherClassification = {
  laneKey: AccommodationCommercialLaneKey;
  travelerVoucherAllowed: boolean;
  operatorVoucherAllowed: boolean;
  sourcePartnerVoucherAllowed: boolean;
  adminVoucherAllowed: boolean;
  paymentReceiptPolicy: AccommodationVoucherPaymentReceiptPolicy;
  qrPolicy: AccommodationVoucherQrPolicy;
  myTripsPolicy: AccommodationVoucherMyTripsPolicy;
  travelerPaymentCopy: string;
  operatorSettlementCopy: string;
  travelerHiddenFields: string[];
  operatorHiddenFields: string[];
  qrPayloadHiddenFields: string[];
  voucherHardFailureToAvoid: string;
};

const INTERNAL_COMMERCIAL_FIELDS = [
  'operator_payout_amount',
  'partner_margin',
  'source_partner_commission',
  'platform_share_amount',
  'ota_channel_fee_amount',
  'travel_tours_channel_fee_amount',
  'commercial_adjustment_amount',
  'admin_only_notes',
] as const;

const QR_HIDDEN_FIELDS = [
  'commercial_fee_breakdown',
  'operator_payout_amount',
  'source_partner_margin',
  'source_partner_commission',
  'traveler_private_profile',
  'admin_only_notes',
] as const;

export function classifyAccommodationBookingVoucher(
  laneKey: AccommodationCommercialLaneKey,
): AccommodationBookingVoucherClassification {
  const preset = getAccommodationCommercialPreset(laneKey);

  return classifyAccommodationBookingVoucherFromPreset(preset);
}

export function classifyAccommodationBookingVoucherFromPreset(
  preset: AccommodationCommercialMatrixPreset,
): AccommodationBookingVoucherClassification {
  const ospCollected =
    preset.paymentOwnershipMode === AccommodationPaymentOwnershipMode.OSP_COLLECTED;

  const noPaymentRequired =
    preset.paymentOwnershipMode === AccommodationPaymentOwnershipMode.NO_PAYMENT_REQUIRED ||
    preset.payoutResponsibility === AccommodationPayoutResponsibility.NO_PAYOUT_REQUIRED;

  const externalPayment =
    preset.paymentOwnershipMode !== AccommodationPaymentOwnershipMode.OSP_COLLECTED &&
    !noPaymentRequired;

  const paymentReceiptPolicy: AccommodationVoucherPaymentReceiptPolicy = noPaymentRequired
    ? 'PAYMENT_RECEIPT_NOT_APPLICABLE'
    : ospCollected
      ? 'OSP_PAYMENT_RECEIPT_ALLOWED_AFTER_CONFIRMATION'
      : 'OSP_PAYMENT_RECEIPT_NOT_ALLOWED_EXTERNAL_PAYMENT';

  const qrPolicy: AccommodationVoucherQrPolicy =
    preset.settlementMode === AccommodationSettlementMode.STATEMENT_ONLY
      ? 'QR_SUMMARY_ONLY_NOT_CHECK_IN_READY'
      : 'QR_CHECK_IN_ALLOWED_WHEN_READY';

  const operatorHiddenFields = [
    'unrelated_trip_intelligence',
    'competitor_data',
    'lgu_admin_only_intelligence',
  ];

  if (externalPayment) {
    operatorHiddenFields.push('source_partner_margin_unless_contract_permits');
  }

  return {
    laneKey: preset.laneKey,
    travelerVoucherAllowed: true,
    operatorVoucherAllowed: true,
    sourcePartnerVoucherAllowed:
      preset.sourceChannel === 'OTA_API' || preset.sourceChannel === 'TRAVEL_TOURS_PARTNER',
    adminVoucherAllowed: true,
    paymentReceiptPolicy,
    qrPolicy,
    myTripsPolicy: 'SHOW_IN_MY_TRIPS_WHEN_TRIP_LINKED',
    travelerPaymentCopy: preset.travelerPaymentCopy,
    operatorSettlementCopy: preset.operatorSettlementCopy,
    travelerHiddenFields: [...INTERNAL_COMMERCIAL_FIELDS],
    operatorHiddenFields,
    qrPayloadHiddenFields: [...QR_HIDDEN_FIELDS],
    voucherHardFailureToAvoid: getVoucherHardFailureToAvoid(preset, paymentReceiptPolicy),
  };
}

function getVoucherHardFailureToAvoid(
  preset: AccommodationCommercialMatrixPreset,
  paymentReceiptPolicy: AccommodationVoucherPaymentReceiptPolicy,
): string {
  if (paymentReceiptPolicy === 'OSP_PAYMENT_RECEIPT_NOT_ALLOWED_EXTERNAL_PAYMENT') {
    return 'Do not issue or display an OSP payment receipt when payment was collected externally.';
  }

  if (paymentReceiptPolicy === 'PAYMENT_RECEIPT_NOT_APPLICABLE') {
    return 'Do not create payment or payout receipt workflows for no-payment-required stay records.';
  }

  if (preset.payoutResponsibility !== AccommodationPayoutResponsibility.OSP_PAYOUT) {
    return 'Do not show OSP payout schedules for non-OSP payout lanes.';
  }

  return 'Do not confuse booking voucher with payment receipt or QR/pass credential.';
}

export type AccommodationBookingVoucherValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateAccommodationBookingVoucherClassification(
  classification: AccommodationBookingVoucherClassification,
): AccommodationBookingVoucherValidationResult {
  const errors: string[] = [];

  if (!classification.travelerVoucherAllowed) {
    errors.push(`${classification.laneKey}: traveler booking summary must be allowed.`);
  }

  if (!classification.operatorVoucherAllowed) {
    errors.push(`${classification.laneKey}: operator booking summary must be allowed.`);
  }

  if (classification.myTripsPolicy !== 'SHOW_IN_MY_TRIPS_WHEN_TRIP_LINKED') {
    errors.push(`${classification.laneKey}: trip-linked stays must be eligible for My Trips.`);
  }

  if (
    classification.paymentReceiptPolicy === 'OSP_PAYMENT_RECEIPT_NOT_ALLOWED_EXTERNAL_PAYMENT' &&
    classification.travelerPaymentCopy.toLowerCase().includes('osp checkout')
  ) {
    errors.push(`${classification.laneKey}: external payment lane must not use OSP checkout traveler copy.`);
  }

  if (
    classification.paymentReceiptPolicy === 'PAYMENT_RECEIPT_NOT_APPLICABLE' &&
    !classification.travelerPaymentCopy.toLowerCase().includes('no payment')
  ) {
    errors.push(`${classification.laneKey}: no-payment lane must clearly say no payment is required.`);
  }

  if (
    classification.qrPayloadHiddenFields.length === 0 ||
    !classification.qrPayloadHiddenFields.includes('commercial_fee_breakdown')
  ) {
    errors.push(`${classification.laneKey}: QR payload must hide commercial fee breakdown.`);
  }

  if (
    !classification.travelerHiddenFields.includes('operator_payout_amount') ||
    !classification.travelerHiddenFields.includes('platform_share_amount')
  ) {
    errors.push(`${classification.laneKey}: traveler voucher must hide payout and platform-share fields.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAccommodationBookingVoucherClassifications(
  laneKeys: AccommodationCommercialLaneKey[],
): AccommodationBookingVoucherValidationResult {
  const errors: string[] = [];

  for (const laneKey of laneKeys) {
    const classification = classifyAccommodationBookingVoucher(laneKey);
    const result = validateAccommodationBookingVoucherClassification(classification);

    for (const error of result.errors) {
      errors.push(error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
