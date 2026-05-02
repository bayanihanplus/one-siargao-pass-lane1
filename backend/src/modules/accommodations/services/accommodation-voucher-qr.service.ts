import { Injectable, NotImplementedException } from '@nestjs/common';
import { AccommodationVoucherQrPayloadDto } from '../dto';

/**
 * ACCOM-12B — AccommodationVoucherQrService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationVoucherQrService {
  async getAccommodationVoucherQrPayload(_voucherId: string): Promise<AccommodationVoucherQrPayloadDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationVoucherQrReady(_voucherId: string): Promise<AccommodationVoucherQrPayloadDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async checkInAccommodationVoucherQr(_voucherId: string): Promise<AccommodationVoucherQrPayloadDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async checkOutAccommodationVoucherQr(_voucherId: string): Promise<AccommodationVoucherQrPayloadDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async revokeAccommodationVoucherQr(_voucherId: string): Promise<AccommodationVoucherQrPayloadDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
