import { Injectable, NotImplementedException } from '@nestjs/common';
import { AccommodationVoucherSummaryDto } from '../dto';

/**
 * ACCOM-12B — AccommodationVoucherDocumentService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationVoucherDocumentService {
  async prepareAccommodationVoucherDocument(_voucherId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAccommodationVoucherDocument(_documentId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listTravelerAccommodationVoucherDocuments(_voucherId: string): Promise<AccommodationVoucherSummaryDto[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listOperatorAccommodationVoucherDocuments(_voucherId: string): Promise<AccommodationVoucherSummaryDto[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationVoucherDocumentDownloaded(_documentId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationVoucherDocumentPrinted(_documentId: string): Promise<AccommodationVoucherSummaryDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
