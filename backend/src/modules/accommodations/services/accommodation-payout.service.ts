import { Injectable, NotImplementedException } from '@nestjs/common';

/**
 * ACCOM-12B — AccommodationPayoutService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationPayoutService {
  async createAccommodationPayoutRecordIfRequired(): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getOperatorPayoutVisibility(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getPayoutHoldStatus(_payoutId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markPayoutReadyForReview(_payoutId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markPayoutBlocked(_payoutId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
