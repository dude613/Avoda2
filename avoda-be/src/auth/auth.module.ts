import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './access-token.guard';

import { DatabaseModule } from '@/database/database.module';
import { databaseProviders } from '@/database/database.provider';

import { UsersModule } from '@/users/users.module';
import { UserService } from '@/users/users.service';
import { userProviders } from '@/users/users.provider';

import { PermissionsGuard } from '@/shared/guards/permissions.guard';
import { organizationProvider } from '@/organizations/organizations.provider';

@Module({
  imports: [UsersModule, DatabaseModule],
  providers: [
    AuthService,
    AuthGuard,
    PermissionsGuard,
    UserService,
    ...userProviders,
    ...databaseProviders,
    ...organizationProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
