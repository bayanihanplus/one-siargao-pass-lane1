import { Injectable, NotImplementedException } from '@nestjs/common';

/**
 * ACCOM-12B — AccommodationCommercialSnapshotService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationCommercialSnapshotService {
  async resolveAccommodationCommercialLane(): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async createAccommodationCommercialSnapshot(): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAccommodationCommercialSnapshotForInternalUse(_snapshotId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getTravelerPaymentWording(_commercialSnapshotId: string): Promise<string> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getOperatorSettlementWording(_commercialSnapshotId: string): Promise<string> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getVoucherCommercialVisibilityPolicy(_commercialSnapshotId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
