import { Controller, Get, Param, Post } from '@nestjs/common';
import { RawAccommodationImportService } from '../services';

/**
 * ACCOM-14B — AdminAccommodationImportsController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('admin/accommodations/imports')
export class AdminAccommodationImportsController {
  constructor(private readonly rawAccommodationImportService: RawAccommodationImportService) {}

  @Get()
  listAccommodationImports() {
    return this.rawAccommodationImportService.listAccommodationImports();
  }

  @Post(':rawImportId/review')
  reviewAccommodationImport(@Param('rawImportId') rawImportId: string) {
    return this.rawAccommodationImportService.reviewAccommodationImport(rawImportId);
  }

  @Post(':rawImportId/create-profile')
  createProfileFromAccommodationImport(@Param('rawImportId') rawImportId: string) {
    return this.rawAccommodationImportService.createProfileFromAccommodationImport(rawImportId);
  }
}
