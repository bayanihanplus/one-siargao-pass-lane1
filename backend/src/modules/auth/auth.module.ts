import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DevAuthGuard } from './guards/dev-auth.guard';
import { PrismaService } from '../../database/prisma.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = (config.get<string>('JWT_EXPIRES_IN') || '1d') as JwtSignOptions['expiresIn'];

        return {
          secret: config.get<string>('JWT_SECRET') || 'osp_local_dev_jwt_secret_change_me',
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, DevAuthGuard, PrismaService],
  exports: [AuthService, DevAuthGuard, JwtModule],
})
export class AuthModule {}
