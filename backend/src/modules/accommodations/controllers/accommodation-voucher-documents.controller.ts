import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccommodationVoucherDocumentService } from '../services';

/**
 * ACCOM-14B — AccommodationVoucherDocumentsController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('accommodation-voucher-documents')
export class AccommodationVoucherDocumentsController {
  constructor(private readonly accommodationVoucherDocumentService: AccommodationVoucherDocumentService) {}

  @Post(':voucherId/generate')
  prepareAccommodationVoucherDocument(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherDocumentService.prepareAccommodationVoucherDocument(voucherId);
  }

  @Get(':documentId')
  getAccommodationVoucherDocument(@Param('documentId') documentId: string) {
    return this.accommodationVoucherDocumentService.getAccommodationVoucherDocument(documentId);
  }

  @Post(':documentId/mark-downloaded')
  markAccommodationVoucherDocumentDownloaded(@Param('documentId') documentId: string) {
    return this.accommodationVoucherDocumentService.markAccommodationVoucherDocumentDownloaded(documentId);
  }

  @Post(':documentId/mark-printed')
  markAccommodationVoucherDocumentPrinted(@Param('documentId') documentId: string) {
    return this.accommodationVoucherDocumentService.markAccommodationVoucherDocumentPrinted(documentId);
  }
}
