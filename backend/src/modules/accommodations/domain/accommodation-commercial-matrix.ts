import {
  AccommodationBookingSourceChannel,
  AccommodationPaymentOwnershipMode,
  AccommodationPayoutResponsibility,
  AccommodationSettlementMode,
  AccommodationPackageComposerType,
  AccommodationRevenueMode,
} from '@prisma/client';

/**
 * ACCOM-02B — Accommodation Commercial Matrix
 *
 * Pure domain helper only.
 *
 * No Prisma client calls.
 * No DB writes.
 * No controller.
 * No route.
 * No fee calculation.
 *
 * Locked doctrine:
 * booking source !== payment owner !== package composer !== payout responsibility !== QR issuer
 */

export const ACCOMMODATION_QR_ISSUER = 'OSP' as const;

export type AccommodationQrIssuer = typeof ACCOMMODATION_QR_ISSUER;

export type AccommodationCommercialLaneKey =
  | 'OSP_DIRECT'
  | 'OTA_EXTERNAL_PAYMENT'
  | 'OTA_OSP_CHECKOUT'
  | 'TRAVEL_TOURS_EXTERNAL_PAYMENT'
  | 'TRAVEL_TOURS_OSP_CHECKOUT'
  | 'ACCOMMODATION_DIRECT_OPERATOR_COLLECTED'
  | 'ACCOMMODATION_DIRECT_OSP_CHECKOUT'
  | 'ACCOMMODATION_DIRECT_STATEMENT_ONLY'
  | 'ACCOMMODATION_DIRECT_NO_PAYMENT_REQUIRED';

export type AccommodationCommercialMatrixPreset = {
  laneKey: AccommodationCommercialLaneKey;
  label: string;
  sourceChannel: AccommodationBookingSourceChannel;
  paymentOwnershipMode: AccommodationPaymentOwnershipMode;
  payoutResponsibility: AccommodationPayoutResponsibility;
  settlementMode: AccommodationSettlementMode;
  packageComposerType: AccommodationPackageComposerType;
  supportedPackageComposerTypes: AccommodationPackageComposerType[];
  revenueMode: AccommodationRevenueMode;
  qrIssuer: AccommodationQrIssuer;
  paymentIntentRequired: boolean;
  ospPayoutRecordRequired: boolean;
  externalSettlement: boolean;
  statementOnly: boolean;
  defaultPayoutHoldDays: number | null;
  travelerPaymentCopy: string;
  operatorSettlementCopy: string;
  hardFailureToAvoid: string;
};

export const ACCOMMODATION_COMMERCIAL_MATRIX: Record<
  AccommodationCommercialLaneKey,
  AccommodationCommercialMatrixPreset
> = {
  OSP_DIRECT: {
    laneKey: 'OSP_DIRECT',
    label: 'OSP Direct Booking',
    sourceChannel: AccommodationBookingSourceChannel.OSP_DIRECT,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.OSP_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.OSP_PAYOUT,
    settlementMode: AccommodationSettlementMode.OSP_SETTLEMENT,
    packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
    supportedPackageComposerTypes: [
      AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
      AccommodationPackageComposerType.OSP_PASSPORT_TRAIL,
      AccommodationPackageComposerType.OSP_DIY_CURATED,
      AccommodationPackageComposerType.ADMIN_PACKAGE,
    ],
    revenueMode: AccommodationRevenueMode.COMMISSION_PLUS_PLATFORM_FEE,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: true,
    ospPayoutRecordRequired: true,
    externalSettlement: false,
    statementOnly: false,
    defaultPayoutHoldDays: 7,
    travelerPaymentCopy: 'Payment is handled by OSP checkout.',
    operatorSettlementCopy: 'Payouts are released according to the payout schedule after stay validation.',
    hardFailureToAvoid: 'Do not treat OSP_DIRECT as always instant book. Booking mode still controls confirmation behavior.',
  },

  OTA_EXTERNAL_PAYMENT: {
    laneKey: 'OTA_EXTERNAL_PAYMENT',
    label: 'OTA API — External Payment',
    sourceChannel: AccommodationBookingSourceChannel.OTA_API,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.SOURCE_PARTNER_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.OTA_PAYOUT,
    settlementMode: AccommodationSettlementMode.EXTERNAL_SETTLEMENT,
    packageComposerType: AccommodationPackageComposerType.OTA_PACKAGE,
    supportedPackageComposerTypes: [AccommodationPackageComposerType.OTA_PACKAGE],
    revenueMode: AccommodationRevenueMode.API_PROCESSING_FEE,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: false,
    ospPayoutRecordRequired: false,
    externalSettlement: true,
    statementOnly: false,
    defaultPayoutHoldDays: null,
    travelerPaymentCopy: 'Payment handled by your booking partner. OSP Pass and QR readiness are connected to this stay.',
    operatorSettlementCopy: 'Settlement handled by source partner. OSP provides stay record, QR readiness, and check-in tracking.',
    hardFailureToAvoid: 'Do not show OSP checkout or OSP payout schedule when the OTA already collected payment.',
  },

  OTA_OSP_CHECKOUT: {
    laneKey: 'OTA_OSP_CHECKOUT',
    label: 'OTA API — OSP Checkout',
    sourceChannel: AccommodationBookingSourceChannel.OTA_API,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.OSP_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.OSP_PAYOUT,
    settlementMode: AccommodationSettlementMode.OSP_SETTLEMENT,
    packageComposerType: AccommodationPackageComposerType.OTA_PACKAGE,
    supportedPackageComposerTypes: [AccommodationPackageComposerType.OTA_PACKAGE],
    revenueMode: AccommodationRevenueMode.COMMISSION_PLUS_PLATFORM_FEE,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: true,
    ospPayoutRecordRequired: true,
    externalSettlement: false,
    statementOnly: false,
    defaultPayoutHoldDays: 7,
    travelerPaymentCopy: 'Payment is handled by OSP checkout for this partner-sourced stay.',
    operatorSettlementCopy: 'Payouts are released according to the payout schedule after stay validation.',
    hardFailureToAvoid: 'Do not collapse OTA channel revenue into OSP platform share unless the contract explicitly says so.',
  },

  TRAVEL_TOURS_EXTERNAL_PAYMENT: {
    laneKey: 'TRAVEL_TOURS_EXTERNAL_PAYMENT',
    label: 'Local Travel & Tours — External Payment',
    sourceChannel: AccommodationBookingSourceChannel.TRAVEL_TOURS_PARTNER,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.SOURCE_PARTNER_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.TRAVEL_TOURS_PAYOUT,
    settlementMode: AccommodationSettlementMode.EXTERNAL_SETTLEMENT,
    packageComposerType: AccommodationPackageComposerType.TRAVEL_TOURS_PACKAGE,
    supportedPackageComposerTypes: [AccommodationPackageComposerType.TRAVEL_TOURS_PACKAGE],
    revenueMode: AccommodationRevenueMode.API_PROCESSING_FEE,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: false,
    ospPayoutRecordRequired: false,
    externalSettlement: true,
    statementOnly: false,
    defaultPayoutHoldDays: null,
    travelerPaymentCopy: 'Payment handled by your booking partner. OSP Pass and QR readiness are connected to this stay.',
    operatorSettlementCopy: 'Settlement handled by source partner. OSP provides stay record, QR readiness, and check-in tracking.',
    hardFailureToAvoid: 'Do not force OSP checkout for partner packages that were already paid externally.',
  },

  TRAVEL_TOURS_OSP_CHECKOUT: {
    laneKey: 'TRAVEL_TOURS_OSP_CHECKOUT',
    label: 'Local Travel & Tours — OSP Checkout',
    sourceChannel: AccommodationBookingSourceChannel.TRAVEL_TOURS_PARTNER,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.OSP_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.OSP_PAYOUT,
    settlementMode: AccommodationSettlementMode.OSP_SETTLEMENT,
    packageComposerType: AccommodationPackageComposerType.TRAVEL_TOURS_PACKAGE,
    supportedPackageComposerTypes: [AccommodationPackageComposerType.TRAVEL_TOURS_PACKAGE],
    revenueMode: AccommodationRevenueMode.COMMISSION_PLUS_PLATFORM_FEE,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: true,
    ospPayoutRecordRequired: true,
    externalSettlement: false,
    statementOnly: false,
    defaultPayoutHoldDays: 7,
    travelerPaymentCopy: 'Payment is handled by OSP checkout for this Travel & Tours package.',
    operatorSettlementCopy: 'Payouts are released according to the payout schedule after stay validation.',
    hardFailureToAvoid: 'Do not let Travel & Tours own accommodation fulfillment unless separately authorized.',
  },

  ACCOMMODATION_DIRECT_OPERATOR_COLLECTED: {
    laneKey: 'ACCOMMODATION_DIRECT_OPERATOR_COLLECTED',
    label: 'Accommodation Direct — Operator Collected',
    sourceChannel: AccommodationBookingSourceChannel.ACCOMMODATION_DIRECT,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.OPERATOR_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.OPERATOR_DIRECT_COLLECTION,
    settlementMode: AccommodationSettlementMode.EXTERNAL_SETTLEMENT,
    packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
    supportedPackageComposerTypes: [
      AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
      AccommodationPackageComposerType.ADMIN_PACKAGE,
    ],
    revenueMode: AccommodationRevenueMode.QR_ISSUANCE_FEE,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: false,
    ospPayoutRecordRequired: false,
    externalSettlement: true,
    statementOnly: false,
    defaultPayoutHoldDays: null,
    travelerPaymentCopy: 'Payment handled directly by the accommodation. OSP Pass and QR readiness are connected to this stay.',
    operatorSettlementCopy: 'Settlement handled directly by your accommodation. OSP provides stay record, QR readiness, and check-in tracking.',
    hardFailureToAvoid: 'Do not create OSP payout records when the accommodation directly collected payment.',
  },

  ACCOMMODATION_DIRECT_OSP_CHECKOUT: {
    laneKey: 'ACCOMMODATION_DIRECT_OSP_CHECKOUT',
    label: 'Accommodation Direct — OSP Checkout',
    sourceChannel: AccommodationBookingSourceChannel.ACCOMMODATION_DIRECT,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.OSP_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.OSP_PAYOUT,
    settlementMode: AccommodationSettlementMode.OSP_SETTLEMENT,
    packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
    supportedPackageComposerTypes: [
      AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
      AccommodationPackageComposerType.ADMIN_PACKAGE,
    ],
    revenueMode: AccommodationRevenueMode.COMMISSION,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: true,
    ospPayoutRecordRequired: true,
    externalSettlement: false,
    statementOnly: false,
    defaultPayoutHoldDays: 7,
    travelerPaymentCopy: 'Payment is handled by OSP checkout.',
    operatorSettlementCopy: 'Payouts are released according to the payout schedule after stay validation.',
    hardFailureToAvoid: 'Do not assume direct accommodation bookings are always external settlement.',
  },

  ACCOMMODATION_DIRECT_STATEMENT_ONLY: {
    laneKey: 'ACCOMMODATION_DIRECT_STATEMENT_ONLY',
    label: 'Accommodation Direct — Statement Only',
    sourceChannel: AccommodationBookingSourceChannel.ACCOMMODATION_DIRECT,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.OPERATOR_COLLECTED,
    payoutResponsibility: AccommodationPayoutResponsibility.OPERATOR_DIRECT_COLLECTION,
    settlementMode: AccommodationSettlementMode.STATEMENT_ONLY,
    packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
    supportedPackageComposerTypes: [
      AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
      AccommodationPackageComposerType.ADMIN_PACKAGE,
    ],
    revenueMode: AccommodationRevenueMode.PLATFORM_FEE_ONLY,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: false,
    ospPayoutRecordRequired: false,
    externalSettlement: false,
    statementOnly: true,
    defaultPayoutHoldDays: null,
    travelerPaymentCopy: 'Payment handled by the accommodation. OSP provides the stay record and QR readiness.',
    operatorSettlementCopy: 'This stay is tracked for records and statement visibility only.',
    hardFailureToAvoid: 'Do not show OSP payout release dates for statement-only lanes.',
  },

  ACCOMMODATION_DIRECT_NO_PAYMENT_REQUIRED: {
    laneKey: 'ACCOMMODATION_DIRECT_NO_PAYMENT_REQUIRED',
    label: 'Accommodation Direct — No Payment Required',
    sourceChannel: AccommodationBookingSourceChannel.ACCOMMODATION_DIRECT,
    paymentOwnershipMode: AccommodationPaymentOwnershipMode.NO_PAYMENT_REQUIRED,
    payoutResponsibility: AccommodationPayoutResponsibility.NO_PAYOUT_REQUIRED,
    settlementMode: AccommodationSettlementMode.STATEMENT_ONLY,
    packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
    supportedPackageComposerTypes: [
      AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY,
      AccommodationPackageComposerType.ADMIN_PACKAGE,
    ],
    revenueMode: AccommodationRevenueMode.NO_OSP_REVENUE_INTERNAL_TEST,
    qrIssuer: ACCOMMODATION_QR_ISSUER,
    paymentIntentRequired: false,
    ospPayoutRecordRequired: false,
    externalSettlement: false,
    statementOnly: true,
    defaultPayoutHoldDays: null,
    travelerPaymentCopy: 'No payment is required for this stay record. OSP Pass and QR readiness are connected.',
    operatorSettlementCopy: 'No payout workflow is required for this stay record.',
    hardFailureToAvoid: 'Do not create payment or payout workflows for no-payment-required stays.',
  },
};

export function getAccommodationCommercialPreset(
  laneKey: AccommodationCommercialLaneKey,
): AccommodationCommercialMatrixPreset {
  const preset = ACCOMMODATION_COMMERCIAL_MATRIX[laneKey];

  if (!preset) {
    throw new Error(`Unsupported accommodation commercial lane: ${laneKey}`);
  }

  return preset;
}

export type AccommodationCommercialPresetInput = {
  sourceChannel: AccommodationBookingSourceChannel;
  paymentOwnershipMode: AccommodationPaymentOwnershipMode;
  payoutResponsibility: AccommodationPayoutResponsibility;
  settlementMode: AccommodationSettlementMode;
  packageComposerType: AccommodationPackageComposerType;
};

export type AccommodationCommercialLaneResolution = {
  laneKey: AccommodationCommercialLaneKey;
  preset: AccommodationCommercialMatrixPreset;
  requestedPackageComposerType: AccommodationPackageComposerType;
  effectivePackageComposerType: AccommodationPackageComposerType;
  packageComposerSupported: boolean;
};

export function supportsAccommodationPackageComposerType(
  laneKey: AccommodationCommercialLaneKey,
  packageComposerType: AccommodationPackageComposerType,
): boolean {
  const preset = getAccommodationCommercialPreset(laneKey);
  return preset.supportedPackageComposerTypes.includes(packageComposerType);
}

export function resolveAccommodationCommercialLaneForModule(
  input: AccommodationCommercialPresetInput,
): AccommodationCommercialLaneResolution {
  const match = Object.values(ACCOMMODATION_COMMERCIAL_MATRIX).find((preset) => {
    return (
      preset.sourceChannel === input.sourceChannel &&
      preset.paymentOwnershipMode === input.paymentOwnershipMode &&
      preset.payoutResponsibility === input.payoutResponsibility &&
      preset.settlementMode === input.settlementMode &&
      preset.supportedPackageComposerTypes.includes(input.packageComposerType)
    );
  });

  if (!match) {
    throw new Error(
      [
        'Unsupported accommodation commercial matrix/module combination.',
        `sourceChannel=${input.sourceChannel}`,
        `paymentOwnershipMode=${input.paymentOwnershipMode}`,
        `payoutResponsibility=${input.payoutResponsibility}`,
        `settlementMode=${input.settlementMode}`,
        `packageComposerType=${input.packageComposerType}`,
      ].join(' '),
    );
  }

  return {
    laneKey: match.laneKey,
    preset: match,
    requestedPackageComposerType: input.packageComposerType,
    effectivePackageComposerType: input.packageComposerType,
    packageComposerSupported: true,
  };
}

export function resolveAccommodationCommercialLane(
  input: AccommodationCommercialPresetInput,
): AccommodationCommercialLaneKey {
  return resolveAccommodationCommercialLaneForModule(input).laneKey;
}

export type AccommodationCommercialValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateAccommodationCommercialPreset(
  preset: AccommodationCommercialMatrixPreset,
): AccommodationCommercialValidationResult {
  const errors: string[] = [];

  if (preset.qrIssuer !== ACCOMMODATION_QR_ISSUER) {
    errors.push('Accommodation QR issuer must remain OSP.');
  }

  if (!preset.supportedPackageComposerTypes.includes(preset.packageComposerType)) {
    errors.push('Default package composer type must be included in supported package composer types.');
  }

  if (preset.supportedPackageComposerTypes.length === 0) {
    errors.push('At least one supported package composer type is required.');
  }

  if (
    preset.paymentOwnershipMode === AccommodationPaymentOwnershipMode.OSP_COLLECTED &&
    !preset.paymentIntentRequired
  ) {
    errors.push('OSP-collected lanes must require a PaymentIntent.');
  }

  if (
    preset.payoutResponsibility === AccommodationPayoutResponsibility.OSP_PAYOUT &&
    !preset.ospPayoutRecordRequired
  ) {
    errors.push('OSP payout lanes must require an AccommodationPayoutRecord.');
  }

  if (
    preset.payoutResponsibility !== AccommodationPayoutResponsibility.OSP_PAYOUT &&
    preset.ospPayoutRecordRequired
  ) {
    errors.push('Non-OSP payout lanes must not require an OSP payout record.');
  }

  if (
    preset.paymentOwnershipMode !== AccommodationPaymentOwnershipMode.OSP_COLLECTED &&
    preset.paymentIntentRequired
  ) {
    errors.push('Externally collected or no-payment lanes must not require OSP PaymentIntent.');
  }

  if (
    preset.settlementMode === AccommodationSettlementMode.EXTERNAL_SETTLEMENT &&
    preset.defaultPayoutHoldDays !== null
  ) {
    errors.push('External settlement lanes must not expose OSP payout hold days.');
  }

  if (
    preset.payoutResponsibility === AccommodationPayoutResponsibility.OSP_PAYOUT &&
    preset.defaultPayoutHoldDays !== 7
  ) {
    errors.push('OSP payout lanes must default to the 7-day payout hold doctrine.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAccommodationCommercialMatrix(): AccommodationCommercialValidationResult {
  const errors: string[] = [];

  for (const preset of Object.values(ACCOMMODATION_COMMERCIAL_MATRIX)) {
    const result = validateAccommodationCommercialPreset(preset);

    for (const error of result.errors) {
      errors.push(`${preset.laneKey}: ${error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
