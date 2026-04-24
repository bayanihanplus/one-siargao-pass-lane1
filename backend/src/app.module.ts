import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { AuditModule } from './modules/audit/audit.module';
import { TripsModule } from './modules/trips/trips.module';
import { PassesModule } from './modules/passes/passes.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ValidationModule } from './modules/validation/validation.module';
import { OspQrModule } from './modules/osp-qr/osp-qr.module';
import { ManifestsModule } from './modules/manifests/manifests.module';
import { ManifestApprovalsModule } from './modules/manifest-approvals/manifest-approvals.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { GuidesModule } from './modules/guides/guides.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    RolesModule,
    ProfilesModule,
    GovernanceModule,
    AuditModule,
    TripsModule,
    PassesModule,
    ActivitiesModule,
    BookingsModule,
    PaymentsModule,
    ValidationModule,
    OspQrModule,
    ManifestsModule,
    ManifestApprovalsModule,
    NotificationsModule,
    GuidesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
