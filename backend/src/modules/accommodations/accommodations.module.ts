import { Module } from '@nestjs/common';
import {
  AccommodationVoucherDocumentsController,
  AccommodationVoucherEmailsController,
  AccommodationVoucherQrController,
  AdminAccommodationImportsController,
  AdminAccommodationsController,
  AdminAccommodationVouchersController,
  OperatorAccommodationRequestsController,
  OperatorAccommodationsController,
  OperatorAccommodationVouchersController,
  TravelerAccommodationRequestsController,
  TravelerAccommodationsController,
  TravelerAccommodationVouchersController,
} from './controllers';
import {
  AccommodationBookingRequestService,
  AccommodationCommercialSnapshotService,
  AccommodationExposureService,
  AccommodationInventoryService,
  AccommodationPayoutService,
  AccommodationProfileService,
  AccommodationStayService,
  AccommodationVoucherDocumentService,
  AccommodationVoucherEmailService,
  AccommodationVoucherQrService,
  AccommodationVoucherService,
  RawAccommodationImportService,
} from './services';

/**
 * ACCOM-09B — Accommodation module shell.
 *
 * Controller shells + provider shells only.
 *
 * No route methods.
 * No API mount into app module.
 * No DB writes.
 * No service implementation logic yet.
 * No marketplace exposure endpoint.
 * No traveler UI.
 */
@Module({
  imports: [],
  controllers: [
    TravelerAccommodationsController,
    TravelerAccommodationRequestsController,
    TravelerAccommodationVouchersController,
    OperatorAccommodationsController,
    OperatorAccommodationRequestsController,
    OperatorAccommodationVouchersController,
    AdminAccommodationsController,
    AdminAccommodationImportsController,
    AdminAccommodationVouchersController,
    AccommodationVoucherDocumentsController,
    AccommodationVoucherEmailsController,
    AccommodationVoucherQrController,
  ],
  providers: [
    AccommodationProfileService,
    AccommodationInventoryService,
    AccommodationBookingRequestService,
    AccommodationStayService,
    AccommodationCommercialSnapshotService,
    AccommodationPayoutService,
    AccommodationVoucherService,
    AccommodationVoucherDocumentService,
    AccommodationVoucherEmailService,
    AccommodationVoucherQrService,
    AccommodationExposureService,
    RawAccommodationImportService,
  ],
  exports: [
    AccommodationProfileService,
    AccommodationInventoryService,
    AccommodationBookingRequestService,
    AccommodationStayService,
    AccommodationCommercialSnapshotService,
    AccommodationPayoutService,
    AccommodationVoucherService,
    AccommodationVoucherDocumentService,
    AccommodationVoucherEmailService,
    AccommodationVoucherQrService,
    AccommodationExposureService,
    RawAccommodationImportService,
  ],
})
export class AccommodationsModule {}
