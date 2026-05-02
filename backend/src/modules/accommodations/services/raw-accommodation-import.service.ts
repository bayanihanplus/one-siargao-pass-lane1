import { Injectable, NotImplementedException } from '@nestjs/common';

/**
 * ACCOM-12B — RawAccommodationImportService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class RawAccommodationImportService {
  async listAccommodationImports(): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async reviewAccommodationImport(_rawImportId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async detectAccommodationImportDuplicates(_rawImportId: string): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async createProfileFromAccommodationImport(_rawImportId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async rejectAccommodationImport(_rawImportId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
