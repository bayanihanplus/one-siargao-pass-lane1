import {
  AccommodationPackageComposerType,
  AccommodationPaymentOwnershipMode,
  AccommodationPayoutResponsibility,
  AccommodationSettlementMode,
} from '@prisma/client';
import {
  ACCOMMODATION_COMMERCIAL_MATRIX,
  ACCOMMODATION_QR_ISSUER,
  AccommodationCommercialLaneKey,
  getAccommodationCommercialPreset,
  resolveAccommodationCommercialLane,
  resolveAccommodationCommercialLaneForModule,
  supportsAccommodationPackageComposerType,
  validateAccommodationCommercialMatrix,
} from './accommodation-commercial-matrix';

/**
 * ACCOM-02C — Validation-only guard for the accommodation commercial matrix.
 *
 * This file is intentionally pure.
 *
 * No Prisma client.
 * No DB reads.
 * No DB writes.
 * No Nest provider registration.
 * No controller.
 * No API route.
 */

const REQUIRED_LANES: AccommodationCommercialLaneKey[] = [
  'OSP_DIRECT',
  'OTA_EXTERNAL_PAYMENT',
  'OTA_OSP_CHECKOUT',
  'TRAVEL_TOURS_EXTERNAL_PAYMENT',
  'TRAVEL_TOURS_OSP_CHECKOUT',
  'ACCOMMODATION_DIRECT_OPERATOR_COLLECTED',
  'ACCOMMODATION_DIRECT_OSP_CHECKOUT',
  'ACCOMMODATION_DIRECT_STATEMENT_ONLY',
  'ACCOMMODATION_DIRECT_NO_PAYMENT_REQUIRED',
];

export type AccommodationCommercialMatrixValidationReport = {
  valid: boolean;
  presetCount: number;
  checkedLaneKeys: AccommodationCommercialLaneKey[];
  errors: string[];
};

function assertCondition(errors: string[], condition: boolean, message: string) {
  if (!condition) {
    errors.push(message);
  }
}

export function runAccommodationCommercialMatrixValidation(): AccommodationCommercialMatrixValidationReport {
  const errors: string[] = [];
  const matrixKeys = Object.keys(ACCOMMODATION_COMMERCIAL_MATRIX) as AccommodationCommercialLaneKey[];

  const baseline = validateAccommodationCommercialMatrix();
  for (const error of baseline.errors) {
    errors.push(error);
  }

  for (const requiredLane of REQUIRED_LANES) {
    assertCondition(
      errors,
      matrixKeys.includes(requiredLane),
      `Missing required accommodation commercial lane: ${requiredLane}`,
    );
  }

  assertCondition(
    errors,
    matrixKeys.length === REQUIRED_LANES.length,
    `Unexpected lane count. expected=${REQUIRED_LANES.length} actual=${matrixKeys.length}`,
  );

  for (const laneKey of REQUIRED_LANES) {
    const preset = getAccommodationCommercialPreset(laneKey);

    assertCondition(
      errors,
      preset.laneKey === laneKey,
      `${laneKey}: preset.laneKey mismatch. actual=${preset.laneKey}`,
    );

    assertCondition(
      errors,
      preset.qrIssuer === ACCOMMODATION_QR_ISSUER,
      `${laneKey}: QR issuer must remain OSP.`,
    );

    const resolved = resolveAccommodationCommercialLane({
      sourceChannel: preset.sourceChannel,
      paymentOwnershipMode: preset.paymentOwnershipMode,
      payoutResponsibility: preset.payoutResponsibility,
      settlementMode: preset.settlementMode,
      packageComposerType: preset.packageComposerType,
    });

    assertCondition(
      errors,
      resolved === laneKey,
      `${laneKey}: resolver mismatch. resolved=${resolved}`,
    );

    if (preset.paymentOwnershipMode === AccommodationPaymentOwnershipMode.OSP_COLLECTED) {
      assertCondition(
        errors,
        preset.paymentIntentRequired === true,
        `${laneKey}: OSP-collected lane must require PaymentIntent.`,
      );
    }

    if (preset.paymentOwnershipMode !== AccommodationPaymentOwnershipMode.OSP_COLLECTED) {
      assertCondition(
        errors,
        preset.paymentIntentRequired === false,
        `${laneKey}: non-OSP-collected lane must not require PaymentIntent.`,
      );
    }

    if (preset.payoutResponsibility === AccommodationPayoutResponsibility.OSP_PAYOUT) {
      assertCondition(
        errors,
        preset.ospPayoutRecordRequired === true,
        `${laneKey}: OSP payout lane must require AccommodationPayoutRecord.`,
      );

      assertCondition(
        errors,
        preset.defaultPayoutHoldDays === 7,
        `${laneKey}: OSP payout lane must default to 7-day payout hold.`,
      );
    }

    if (preset.payoutResponsibility !== AccommodationPayoutResponsibility.OSP_PAYOUT) {
      assertCondition(
        errors,
        preset.ospPayoutRecordRequired === false,
        `${laneKey}: non-OSP payout lane must not require OSP payout record.`,
      );
    }

    if (preset.settlementMode === AccommodationSettlementMode.EXTERNAL_SETTLEMENT) {
      assertCondition(
        errors,
        preset.externalSettlement === true,
        `${laneKey}: external settlement flag must be true.`,
      );

      assertCondition(
        errors,
        preset.defaultPayoutHoldDays === null,
        `${laneKey}: external settlement lane must not expose payout hold days.`,
      );
    }

    if (preset.statementOnly) {
      assertCondition(
        errors,
        preset.paymentIntentRequired === false,
        `${laneKey}: statement-only lane must not require PaymentIntent.`,
      );
    }

    if (laneKey === 'ACCOMMODATION_DIRECT_NO_PAYMENT_REQUIRED') {
      assertCondition(
        errors,
        preset.paymentOwnershipMode === AccommodationPaymentOwnershipMode.NO_PAYMENT_REQUIRED,
        `${laneKey}: must use NO_PAYMENT_REQUIRED ownership mode.`,
      );

      assertCondition(
        errors,
        preset.payoutResponsibility === AccommodationPayoutResponsibility.NO_PAYOUT_REQUIRED,
        `${laneKey}: must use NO_PAYOUT_REQUIRED payout responsibility.`,
      );

      assertCondition(
        errors,
        preset.paymentIntentRequired === false,
        `${laneKey}: no-payment lane must not require payment intent.`,
      );

      assertCondition(
        errors,
        preset.ospPayoutRecordRequired === false,
        `${laneKey}: no-payment lane must not require payout record.`,
      );
    }
  }

  const moduleExpectations: Array<{
    laneKey: AccommodationCommercialLaneKey;
    packageComposerType: AccommodationPackageComposerType;
  }> = [
    { laneKey: 'OSP_DIRECT', packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY },
    { laneKey: 'OSP_DIRECT', packageComposerType: AccommodationPackageComposerType.OSP_PASSPORT_TRAIL },
    { laneKey: 'OSP_DIRECT', packageComposerType: AccommodationPackageComposerType.OSP_DIY_CURATED },
    { laneKey: 'OSP_DIRECT', packageComposerType: AccommodationPackageComposerType.ADMIN_PACKAGE },
    { laneKey: 'OTA_EXTERNAL_PAYMENT', packageComposerType: AccommodationPackageComposerType.OTA_PACKAGE },
    { laneKey: 'OTA_OSP_CHECKOUT', packageComposerType: AccommodationPackageComposerType.OTA_PACKAGE },
    { laneKey: 'TRAVEL_TOURS_EXTERNAL_PAYMENT', packageComposerType: AccommodationPackageComposerType.TRAVEL_TOURS_PACKAGE },
    { laneKey: 'TRAVEL_TOURS_OSP_CHECKOUT', packageComposerType: AccommodationPackageComposerType.TRAVEL_TOURS_PACKAGE },
    { laneKey: 'ACCOMMODATION_DIRECT_OPERATOR_COLLECTED', packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY },
    { laneKey: 'ACCOMMODATION_DIRECT_OPERATOR_COLLECTED', packageComposerType: AccommodationPackageComposerType.ADMIN_PACKAGE },
    { laneKey: 'ACCOMMODATION_DIRECT_OSP_CHECKOUT', packageComposerType: AccommodationPackageComposerType.ACCOMMODATION_STAY_ONLY },
    { laneKey: 'ACCOMMODATION_DIRECT_OSP_CHECKOUT', packageComposerType: AccommodationPackageComposerType.ADMIN_PACKAGE },
  ];

  for (const expectation of moduleExpectations) {
    const supported = supportsAccommodationPackageComposerType(
      expectation.laneKey,
      expectation.packageComposerType,
    );

    assertCondition(
      errors,
      supported,
      `${expectation.laneKey}: must support package composer ${expectation.packageComposerType}.`,
    );

    const preset = getAccommodationCommercialPreset(expectation.laneKey);
    const resolved = resolveAccommodationCommercialLaneForModule({
      sourceChannel: preset.sourceChannel,
      paymentOwnershipMode: preset.paymentOwnershipMode,
      payoutResponsibility: preset.payoutResponsibility,
      settlementMode: preset.settlementMode,
      packageComposerType: expectation.packageComposerType,
    });

    assertCondition(
      errors,
      resolved.laneKey === expectation.laneKey,
      `${expectation.laneKey}: module-aware resolver mismatch for ${expectation.packageComposerType}. resolved=${resolved.laneKey}`,
    );
  }

  return {
    valid: errors.length === 0,
    presetCount: matrixKeys.length,
    checkedLaneKeys: REQUIRED_LANES,
    errors,
  };
}

if (require.main === module) {
  const report = runAccommodationCommercialMatrixValidation();

  if (!report.valid) {
    console.error('ACCOM commercial matrix validation failed:');
    for (const error of report.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`ACCOM commercial matrix validation passed. presets=${report.presetCount}`);
  console.log(`Checked lanes: ${report.checkedLaneKeys.join(', ')}`);
}
