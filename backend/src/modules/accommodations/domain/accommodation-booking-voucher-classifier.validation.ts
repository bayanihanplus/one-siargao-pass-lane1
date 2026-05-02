import {
  AccommodationCommercialLaneKey,
  ACCOMMODATION_COMMERCIAL_MATRIX,
} from './accommodation-commercial-matrix';
import {
  classifyAccommodationBookingVoucher,
  validateAccommodationBookingVoucherClassifications,
} from './accommodation-booking-voucher-classifier';

/**
 * ACCOM-03B validation guard.
 *
 * Pure validation only.
 * No Prisma client.
 * No DB.
 * No API.
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

export function runAccommodationBookingVoucherClassifierValidation() {
  const errors: string[] = [];

  const matrixKeys = Object.keys(ACCOMMODATION_COMMERCIAL_MATRIX).sort();
  const requiredKeys = [...REQUIRED_LANES].sort();

  if (JSON.stringify(matrixKeys) !== JSON.stringify(requiredKeys)) {
    errors.push(`Voucher classifier lane mismatch. matrix=${matrixKeys.join(',')} required=${requiredKeys.join(',')}`);
  }

  const classificationResult = validateAccommodationBookingVoucherClassifications(REQUIRED_LANES);
  for (const error of classificationResult.errors) {
    errors.push(error);
  }

  for (const laneKey of REQUIRED_LANES) {
    const classification = classifyAccommodationBookingVoucher(laneKey);

    if (!classification.travelerVoucherAllowed) {
      errors.push(`${laneKey}: traveler voucher must be allowed.`);
    }

    if (!classification.operatorVoucherAllowed) {
      errors.push(`${laneKey}: operator voucher must be allowed.`);
    }

    if (classification.laneKey !== laneKey) {
      errors.push(`${laneKey}: classification lane mismatch.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    checkedLaneCount: REQUIRED_LANES.length,
  };
}

if (require.main === module) {
  const result = runAccommodationBookingVoucherClassifierValidation();

  if (!result.valid) {
    console.error('ACCOM booking voucher classifier validation failed:');
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`ACCOM booking voucher classifier validation passed. lanes=${result.checkedLaneCount}`);
}
