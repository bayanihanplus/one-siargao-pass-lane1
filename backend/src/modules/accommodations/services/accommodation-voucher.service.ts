import { Injectable, NotImplementedException } from '@nestjs/common';
import { AccommodationVoucherSummaryDto } from '../dto';

/**
 * ACCOM-12B — AccommodationVoucherService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationVoucherService {
  async createAccommodationBookingVoucherSnapshot(): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getTravelerAccommodationVoucher(_voucherId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getOperatorAccommodationVoucher(_voucherId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAdminAccommodationVoucher(_voucherId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getTripAccommodationVoucher(_tripId: string, _voucherId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listAccommodationVouchers(_accommodationId: string): Promise<AccommodationVoucherSummaryDto[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listAccommodationVoucherAuditEvents(_voucherId: string): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async cancelAccommodationVoucher(_voucherId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async supersedeAccommodationVoucher(_voucherId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
