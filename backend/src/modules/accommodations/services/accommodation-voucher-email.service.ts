import { Injectable, NotImplementedException } from '@nestjs/common';
import { AccommodationVoucherEmailPreviewDto } from '../dto';

/**
 * ACCOM-12B — AccommodationVoucherEmailService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationVoucherEmailService {
  async prepareAccommodationVoucherEmail(_voucherId: string): Promise<AccommodationVoucherEmailPreviewDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationVoucherEmailSent(_emailDeliveryId: string): Promise<AccommodationVoucherEmailPreviewDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationVoucherEmailFailed(_emailDeliveryId: string): Promise<AccommodationVoucherEmailPreviewDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAccommodationVoucherEmailPreview(_voucherId: string): Promise<AccommodationVoucherEmailPreviewDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async evaluateVoucherEmailResendEligibility(_emailDeliveryId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
